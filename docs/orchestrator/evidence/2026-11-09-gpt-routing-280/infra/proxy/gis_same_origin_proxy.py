#!/usr/bin/env python3
"""Loopback-only same-origin GIS routing proxy candidate.

This process is intended to sit behind Tailscale Serve. It does not implement
TLS or tailnet authentication; Serve terminates TLS and tailnet policy gates
remote access. All upstream destinations are fixed in PRODUCTION_TARGETS.
"""

from __future__ import annotations

import http.client
import json
import os
import re
import socket
import ssl
import threading
import time
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Callable
from urllib.parse import parse_qsl, quote, unquote, urlencode, urlsplit
import math


GIS_HOST = "100.99.54.93"
GIS_PORT = 8000
GRAPHHOPPER_HOST = "100.99.54.93"
GRAPHHOPPER_PORT = 8989
ORS_HOST = "ionos-n8n-new.tailc01234.ts.net"
ORS_PORT = 443

PRODUCTION_TARGETS = {
    "gis": ("http", GIS_HOST, GIS_PORT),
    "gh": ("http", GRAPHHOPPER_HOST, GRAPHHOPPER_PORT),
    "ors": ("https", ORS_HOST, ORS_PORT),
}

GRAPHHOPPER_PROFILES = frozenset(
    {"hiking", "hiking_easy", "mtb_touring", "mtb_trail"}
)
ORS_PROFILES = frozenset({"foot-hiking", "foot-walking", "cycling-mountain"})
ORS_GEOJSON_MEDIA_TYPES = frozenset(
    {"application/json", "application/geo+json", "application/vnd.geo+json"}
)
API_PREFIX = "/_routing"
MAX_REQUEST_BYTES = 2 * 1024 * 1024
MAX_RESPONSE_BYTES = 12 * 1024 * 1024
UPSTREAM_TIMEOUT_SECONDS = 20.0
_DECIMAL = re.compile(r"^-?\d{1,3}(?:\.\d{1,12})?$")
_ORS_DIRECTIONS = re.compile(
    r"^/_routing/ors/v2/directions/"
    r"(foot-hiking|foot-walking|cycling-mountain)/geojson$"
)
_MAX_REQUEST_TARGET_LENGTH = 4096
_MAX_QUERY_FIELDS = 128
_MAX_DECODE_ROUNDS = 8
_GH_ROUTE_BASE_KEYS = frozenset(
    {
        "profile",
        "points",
        "elevation",
        "points_encoded",
        "instructions",
        "custom_model",
        "ch.disable",
        "details",
        "snap_preventions",
    }
)
_GH_ROUTE_ALT_KEYS = frozenset(
    {
        "algorithm",
        "alternative_route.max_paths",
        "alternative_route.max_weight_factor",
        "alternative_route.max_share_factor",
    }
)
_GH_ROUTE_ROUND_TRIP_KEYS = frozenset(
    {"algorithm", "round_trip.distance", "round_trip.seed"}
)
_GH_AVOID_AREA_ID = re.compile(r"^avoid_[A-Za-z0-9_]{1,24}$")


def _json_object_without_duplicate_keys(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate JSON key")
        result[key] = value
    return result


def _gh_number(value: Any, low: float, high: float) -> bool:
    if type(value) not in (int, float):
        return False
    try:
        return math.isfinite(value) and low <= value <= high
    except (OverflowError, TypeError):
        return False


def _valid_gh_points(value: Any, *, minimum: int, maximum: int) -> bool:
    if not isinstance(value, list) or not minimum <= len(value) <= maximum:
        return False
    for point in value:
        if (
            not isinstance(point, list)
            or len(point) != 2
            or not _gh_number(point[0], -180, 180)
            or not _gh_number(point[1], -90, 90)
        ):
            return False
    return True


def _valid_gh_custom_model(value: Any) -> bool:
    if not isinstance(value, dict) or set(value) - {"areas", "priority"}:
        return False
    areas = value.get("areas")
    area_ids: list[str] = []
    if areas is not None:
        if not isinstance(areas, dict) or not 1 <= len(areas) <= 8:
            return False
        for area_id, feature in areas.items():
            if not isinstance(area_id, str) or not _GH_AVOID_AREA_ID.fullmatch(area_id):
                return False
            if not isinstance(feature, dict) or set(feature) != {"type", "properties", "geometry"}:
                return False
            if feature["type"] != "Feature" or feature["properties"] != {}:
                return False
            geometry = feature["geometry"]
            if not isinstance(geometry, dict) or set(geometry) != {"type", "coordinates"}:
                return False
            if geometry["type"] != "Polygon":
                return False
            coordinates = geometry["coordinates"]
            if not isinstance(coordinates, list) or len(coordinates) != 1:
                return False
            ring = coordinates[0]
            if not isinstance(ring, list) or not 4 <= len(ring) <= 25:
                return False
            for point in ring:
                if (
                    not isinstance(point, list)
                    or len(point) != 2
                    or not _gh_number(point[0], -180, 180)
                    or not _gh_number(point[1], -90, 90)
                ):
                    return False
            if ring[0] != ring[-1]:
                return False
            distinct = {(point[0], point[1]) for point in ring[:-1]}
            if len(distinct) < 3:
                return False
            longitudes = [point[0] for point in ring]
            if max(longitudes) - min(longitudes) > 180:
                return False
            area_ids.append(area_id)
    elif "areas" in value:
        return False

    priority = value.get("priority")
    if not isinstance(priority, list) or len(priority) != len(area_ids) + 1:
        return False
    expected_rules = [
        {"if": "in_" + area_id, "multiply_by": "0"} for area_id in area_ids
    ] + [{"if": "road_environment == FERRY", "multiply_by": "0"}]
    return priority == expected_rules


def valid_graphhopper_route_payload(payload: bytes) -> bool:
    """Allow only request shapes emitted by the app's GraphHopper route builders."""
    try:
        body = json.loads(
            payload.decode("utf-8"),
            object_pairs_hook=_json_object_without_duplicate_keys,
            parse_constant=lambda _value: (_ for _ in ()).throw(ValueError("invalid number")),
        )
    except (UnicodeDecodeError, json.JSONDecodeError, ValueError):
        return False
    if not isinstance(body, dict) or not _GH_ROUTE_BASE_KEYS <= set(body):
        return False
    if set(body) - (_GH_ROUTE_BASE_KEYS | _GH_ROUTE_ALT_KEYS | _GH_ROUTE_ROUND_TRIP_KEYS):
        return False
    profile = body.get("profile")
    if not isinstance(profile, str) or profile not in GRAPHHOPPER_PROFILES:
        return False
    if (
        body.get("elevation") is not True
        or body.get("points_encoded") is not False
        or body.get("instructions") is not False
        or body.get("ch.disable") is not True
        or body.get("details") != ["road_environment"]
        or body.get("snap_preventions") != ["ferry"]
        or not _valid_gh_custom_model(body.get("custom_model"))
    ):
        return False

    optional = set(body) - _GH_ROUTE_BASE_KEYS
    if not optional:
        return _valid_gh_points(body.get("points"), minimum=2, maximum=20)
    if optional == _GH_ROUTE_ALT_KEYS:
        return (
            body.get("algorithm") == "alternative_route"
            and body.get("alternative_route.max_paths") == 3
            and type(body.get("alternative_route.max_paths")) is int
            and _gh_number(body.get("alternative_route.max_weight_factor"), 1.4, 1.4)
            and _gh_number(body.get("alternative_route.max_share_factor"), 0.6, 0.6)
            and _valid_gh_points(body.get("points"), minimum=2, maximum=2)
        )
    if optional == _GH_ROUTE_ROUND_TRIP_KEYS:
        distance = body.get("round_trip.distance")
        seed = body.get("round_trip.seed")
        return (
            body.get("algorithm") == "round_trip"
            and type(distance) is int
            and 2000 <= distance <= 40000
            and type(seed) is int
            and 1 <= seed <= 0xFFFFFFFF
            and _valid_gh_points(body.get("points"), minimum=1, maximum=1)
        )
    return False


class QuietThreadingHTTPServer(ThreadingHTTPServer):
    def __init__(
        self,
        server_address: tuple[str, int],
        handler_class: type[BaseHTTPRequestHandler],
        *,
        max_connections: int = 24,
        client_timeout_seconds: float = 5.0,
        body_timeout_seconds: float = 15.0,
        header_timeout_seconds: float = 15.0,
    ) -> None:
        self._connection_slots = threading.BoundedSemaphore(max_connections)
        self._connection_lock = threading.Lock()
        self._active_connections = 0
        self.client_timeout_seconds = client_timeout_seconds
        self.body_timeout_seconds = body_timeout_seconds
        self.header_timeout_seconds = header_timeout_seconds
        super().__init__(server_address, handler_class)
        self.daemon_threads = True

    @property
    def active_connections(self) -> int:
        with self._connection_lock:
            return self._active_connections

    def get_request(self) -> tuple[socket.socket, Any]:
        request, client_address = super().get_request()
        # Apply before BaseHTTPRequestHandler reads the request line or headers.
        request.settimeout(self.client_timeout_seconds)
        return request, client_address

    def process_request(self, request: socket.socket, client_address: Any) -> None:
        # Acquire before ThreadingMixIn creates a worker, so slow headers cannot
        # create an unbounded number of blocked threads.
        if not self._connection_slots.acquire(blocking=False):
            self.shutdown_request(request)
            return
        with self._connection_lock:
            self._active_connections += 1
        try:
            super().process_request(request, client_address)
        except BaseException:
            with self._connection_lock:
                self._active_connections -= 1
            self._connection_slots.release()
            raise

    def process_request_thread(self, request: socket.socket, client_address: Any) -> None:
        try:
            super().process_request_thread(request, client_address)
        finally:
            with self._connection_lock:
                self._active_connections -= 1
            self._connection_slots.release()

    def handle_error(self, _request: Any, _client_address: Any) -> None:
        # The default handler can print tracebacks after client disconnects.
        # Keep request paths, headers, and bodies out of stderr as well.
        return


@dataclass(frozen=True)
class Upstream:
    scheme: str
    host: str
    port: int
    path: str
    name: str


def _json_bytes(value: Any) -> bytes:
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def _valid_origin(value: str) -> tuple[str, str] | None:
    try:
        parts = urlsplit(value)
        if (
            parts.scheme != "https"
            or not parts.netloc
            or parts.username
            or parts.password
            or parts.path not in ("", "/")
            or parts.query
            or parts.fragment
        ):
            return None
        return f"https://{parts.netloc}", parts.netloc.lower()
    except ValueError:
        return None


def _point_target(query: str) -> str | None:
    try:
        pairs = parse_qsl(query, keep_blank_values=True, strict_parsing=True)
    except ValueError:
        return None
    if len(pairs) != 1 or pairs[0][0] != "point":
        return None
    value = pairs[0][1]
    if len(value) > 48 or value.count(",") != 1:
        return None
    lat_text, lon_text = value.split(",", 1)
    if not _DECIMAL.fullmatch(lat_text) or not _DECIMAL.fullmatch(lon_text):
        return None
    try:
        lat, lon = float(lat_text), float(lon_text)
    except ValueError:
        return None
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        return None
    return "/nearest?point=" + quote(value, safe="")


def _fully_unquote(value: str) -> str | None:
    current = value
    try:
        for _ in range(_MAX_DECODE_ROUNDS):
            decoded = unquote(current, errors="strict")
            if decoded == current:
                return current
            current = decoded
        if unquote(current, errors="strict") != current:
            return None
        return current
    except (ValueError, UnicodeDecodeError):
        return None


def _has_dot_segments(value: str) -> bool:
    return any(part in (".", "..") for part in re.split(r"[\\/]", value))


def _canonical_query(query: str) -> str | None:
    if len(query) > _MAX_REQUEST_TARGET_LENGTH:
        return None
    try:
        pairs = parse_qsl(
            query,
            keep_blank_values=True,
            strict_parsing=False,
            max_num_fields=_MAX_QUERY_FIELDS,
            encoding="utf-8",
            errors="strict",
        )
    except (ValueError, UnicodeDecodeError):
        return None
    canonical: list[tuple[str, str]] = []
    for key, value in pairs:
        decoded_key = _fully_unquote(key)
        decoded_value = _fully_unquote(value)
        if decoded_key is None or decoded_value is None:
            return None
        if any(ord(char) < 0x20 or ord(char) == 0x7F for char in decoded_key + decoded_value):
            return None
        if _has_dot_segments(decoded_key) or _has_dot_segments(decoded_value):
            return None
        canonical.append((decoded_key, decoded_value))
    return urlencode(canonical, doseq=True)


def _safe_ors_status(body: bytes) -> bytes:
    """Return only fields the UI needs; never relay a gateway secret value."""
    try:
        data = json.loads(body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        data = {}
    if not isinstance(data, dict):
        data = {}
    profiles = data.get("profiles")
    safe_profiles = (
        [p for p in profiles if isinstance(p, str) and p in ORS_PROFILES]
        if isinstance(profiles, list)
        else []
    )
    return _json_bytes(
        {
            "status": "ready" if data.get("status") == "ready" else "unavailable",
            "secret": "PRESENT" if data.get("secret") == "PRESENT" else "MISSING",
            "profiles": safe_profiles,
        }
    )


def _safe_ors_directions(body: bytes) -> bytes | None:
    """Whitelist only the GeoJSON fields consumed by the candidate app."""
    try:
        data = json.loads(body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return None
    if not isinstance(data, dict) or data.get("type") != "FeatureCollection":
        return None
    features = data.get("features")
    if not isinstance(features, list) or not features or len(features) > 32:
        return None
    safe_features: list[dict[str, Any]] = []
    for feature in features:
        if not isinstance(feature, dict):
            return None
        geometry = feature.get("geometry")
        if not isinstance(geometry, dict) or geometry.get("type") != "LineString":
            return None
        coordinates = geometry.get("coordinates")
        if not isinstance(coordinates, list) or not (2 <= len(coordinates) <= 100000):
            return None
        safe_coordinates: list[list[float]] = []
        for coordinate in coordinates:
            if not isinstance(coordinate, list) or len(coordinate) < 2:
                return None
            lon, lat = coordinate[0], coordinate[1]
            if (
                isinstance(lon, bool)
                or isinstance(lat, bool)
                or not isinstance(lon, (int, float))
                or not isinstance(lat, (int, float))
                or not math.isfinite(float(lon))
                or not math.isfinite(float(lat))
                or not (-180 <= float(lon) <= 180)
                or not (-90 <= float(lat) <= 90)
            ):
                return None
            point = [float(lon), float(lat)]
            if len(coordinate) >= 3:
                elevation = coordinate[2]
                if (
                    isinstance(elevation, (int, float))
                    and not isinstance(elevation, bool)
                    and math.isfinite(float(elevation))
                ):
                    point.append(float(elevation))
            safe_coordinates.append(point)

        properties = feature.get("properties")
        if not isinstance(properties, dict):
            properties = {}
        safe_properties: dict[str, Any] = {}
        way_points = properties.get("way_points")
        if (
            isinstance(way_points, list)
            and len(way_points) <= 32
            and all(
                isinstance(index, int)
                and not isinstance(index, bool)
                and 0 <= index < len(safe_coordinates)
                for index in way_points
            )
        ):
            safe_properties["way_points"] = way_points

        extras = properties.get("extras")
        waytype = extras.get("waytype") if isinstance(extras, dict) else None
        values = waytype.get("values") if isinstance(waytype, dict) else None
        safe_values: list[list[int]] = []
        if isinstance(values, list) and len(values) <= 100000:
            for interval in values:
                if not isinstance(interval, list) or len(interval) < 3:
                    continue
                start, end, code = interval[:3]
                if (
                    isinstance(start, int)
                    and not isinstance(start, bool)
                    and isinstance(end, int)
                    and not isinstance(end, bool)
                    and isinstance(code, int)
                    and not isinstance(code, bool)
                    and 0 <= start <= end < len(safe_coordinates)
                    and (1 <= code <= 8 or code == 10)
                ):
                    safe_values.append([start, end, code])
        if safe_values:
            safe_properties["extras"] = {"waytype": {"values": safe_values}}

        summary = properties.get("summary")
        safe_summary: dict[str, float] = {}
        if isinstance(summary, dict):
            for field in ("distance", "duration", "ascent", "descent"):
                value = summary.get(field)
                if (
                    isinstance(value, (int, float))
                    and not isinstance(value, bool)
                    and math.isfinite(float(value))
                    and float(value) >= 0
                ):
                    safe_summary[field] = float(value)
        if safe_summary:
            safe_properties["summary"] = safe_summary
        safe_features.append(
            {
                "type": "Feature",
                "geometry": {"type": "LineString", "coordinates": safe_coordinates},
                "properties": safe_properties,
            }
        )
    return _json_bytes({"type": "FeatureCollection", "features": safe_features})
def _parse_targets(
    targets: dict[str, tuple[str, str, int]],
) -> dict[str, tuple[str, str, int]]:
    expected = {"gis", "gh", "ors"}
    if set(targets) != expected:
        raise ValueError("targets must contain exactly gis, gh, and ors")
    parsed: dict[str, tuple[str, str, int]] = {}
    for name, value in targets.items():
        scheme, host, port = value
        if scheme not in ("http", "https") or not host or not (1 <= int(port) <= 65535):
            raise ValueError(f"invalid upstream configuration for {name}")
        parsed[name] = (scheme, host, int(port))
    if parsed["ors"][0] != "https":
        raise ValueError("ORS upstream must use HTTPS")
    return parsed


def create_server(
    app_origin: str,
    *,
    bind_host: str = "127.0.0.1",
    bind_port: int = 0,
    max_connections: int = 24,
    client_timeout_seconds: float = 5.0,
    body_timeout_seconds: float = 15.0,
    header_timeout_seconds: float = 15.0,
    targets: dict[str, tuple[str, str, int]] | None = None,
    request_limit: int = MAX_REQUEST_BYTES,
    response_limit: int = MAX_RESPONSE_BYTES,
    timeout_seconds: float = UPSTREAM_TIMEOUT_SECONDS,
    response_timeout_seconds: float = UPSTREAM_TIMEOUT_SECONDS,
    connection_factory: Callable[..., http.client.HTTPConnection] | None = None,
) -> ThreadingHTTPServer:
    """Build a loopback-only server; targets override exists for local tests only."""
    origin_data = _valid_origin(app_origin)
    if origin_data is None:
        raise ValueError("app_origin must be a bare HTTPS origin")
    if bind_host not in ("127.0.0.1", "::1"):
        raise ValueError("proxy must bind to loopback")
    if (
        max_connections < 1
        or client_timeout_seconds <= 0
        or body_timeout_seconds <= 0
        or header_timeout_seconds <= 0
        or timeout_seconds <= 0
        or response_timeout_seconds <= 0
    ):
        raise ValueError("connection limits must be positive")
    expected_origin, expected_host = origin_data
    expected_host = expected_host.lower()
    target_map = _parse_targets(targets or PRODUCTION_TARGETS)

    def connect(scheme: str, host: str, port: int) -> http.client.HTTPConnection:
        if connection_factory is not None:
            return connection_factory(scheme, host, port, timeout_seconds)
        if scheme == "https":
            return http.client.HTTPSConnection(
                host, port, timeout=timeout_seconds, context=ssl.create_default_context()
            )
        return http.client.HTTPConnection(host, port, timeout=timeout_seconds)

    class Handler(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"
        server_version = "GISRoutingProxy"
        sys_version = ""

        def setup(self) -> None:
            super().setup()
            self._header_watchdog_lock = threading.Lock()
            self._header_watchdog_generation = 0
            self._header_watchdog: threading.Timer | None = None

        def _start_header_watchdog(self) -> None:
            with self._header_watchdog_lock:
                self._header_watchdog_generation += 1
                generation = self._header_watchdog_generation
                timer = threading.Timer(
                    self.server.header_timeout_seconds,
                    self._expire_header_watchdog,
                    args=(generation,),
                )
                timer.daemon = True
                self._header_watchdog = timer
                timer.start()

        def _expire_header_watchdog(self, generation: int) -> None:
            with self._header_watchdog_lock:
                if (
                    generation != self._header_watchdog_generation
                    or self._header_watchdog is None
                ):
                    return
                self._header_watchdog = None
                self._header_watchdog_generation += 1
                # Shutdown while holding the lock so successful header parsing
                # and timeout cancellation have a single, race-safe winner.
                try:
                    self.connection.shutdown(socket.SHUT_RDWR)
                except OSError:
                    pass

        def _stop_header_watchdog(self) -> None:
            with self._header_watchdog_lock:
                timer = self._header_watchdog
                self._header_watchdog = None
                self._header_watchdog_generation += 1
                if timer is not None:
                    timer.cancel()

        def handle_one_request(self) -> None:
            self._start_header_watchdog()
            try:
                super().handle_one_request()
            finally:
                self._stop_header_watchdog()

        def parse_request(self) -> bool:
            try:
                return super().parse_request()
            finally:
                # Request line and headers are fully parsed at this point.
                # Cancel before application routing/upstream work begins.
                self._stop_header_watchdog()

        def finish(self) -> None:
            self._stop_header_watchdog()
            super().finish()

        def log_message(self, _format: str, *args: Any) -> None:
            # Paths may contain route coordinates. Never log paths, headers, or bodies.
            return

        def _reply(self, status: int, payload: bytes, content_type: str = "application/json") -> None:
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            if self.close_connection:
                self.send_header("Connection", "close")
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(payload)

        def _error(self, status: int, code: str) -> None:
            self._reply(status, _json_bytes({"error": code}))

        def _valid_request_origin(self, *, is_post: bool) -> bool:
            origin = self.headers.get("Origin")
            if origin is not None and origin != expected_origin:
                return False
            fetch_site = self.headers.get("Sec-Fetch-Site")
            if fetch_site is not None and fetch_site.lower() != "same-origin":
                return False
            if is_post and origin != expected_origin:
                return False
            return True

        def _safe_request_target(self) -> tuple[str, str] | None:
            raw = self.path
            if (
                len(raw) > _MAX_REQUEST_TARGET_LENGTH
                or not raw.startswith("/")
                or raw.startswith("//")
                or "#" in raw
            ):
                return None
            try:
                parts = urlsplit(raw)
                raw_path = parts.path
                decoded_path = raw_path
                for _ in range(_MAX_DECODE_ROUNDS):
                    next_path = unquote(decoded_path, errors="strict")
                    if next_path == decoded_path:
                        break
                    if next_path.count("/") > raw_path.count("/"):
                        return None
                    decoded_path = next_path
                    if (
                        decoded_path.startswith("//")
                        or "\\" in decoded_path
                        or "\x00" in decoded_path
                        or any(ord(char) < 0x20 or ord(char) == 0x7F for char in decoded_path)
                        or _has_dot_segments(decoded_path)
                    ):
                        return None
                else:
                    if unquote(decoded_path, errors="strict") != decoded_path:
                        return None
                if (
                    decoded_path.startswith("//")
                    or "\\" in decoded_path
                    or "\x00" in decoded_path
                    or any(ord(char) < 0x20 or ord(char) == 0x7F for char in decoded_path)
                    or _has_dot_segments(decoded_path)
                ):
                    return None
                canonical_query = _canonical_query(parts.query)
                if canonical_query is None:
                    return None
                canonical_path = quote(
                    decoded_path, safe="/:@-._~!$&'()*+,;="
                )
                if (
                    (canonical_path == API_PREFIX or canonical_path.startswith(API_PREFIX + "/"))
                    and "%" in raw_path
                ):
                    return None
            except (ValueError, UnicodeDecodeError):
                return None
            return canonical_path, canonical_query

        def _route(self, path: str, query: str, method: str) -> Upstream | None:
            if path == f"{API_PREFIX}/gh/info" and method == "GET" and not query:
                scheme, host, port = target_map["gh"]
                return Upstream(scheme, host, port, "/info", "gh")
            if path == f"{API_PREFIX}/gh/nearest" and method == "GET":
                target_path = _point_target(query)
                if target_path is None:
                    return None
                scheme, host, port = target_map["gh"]
                return Upstream(scheme, host, port, target_path, "gh")
            if path == f"{API_PREFIX}/gh/route" and method == "POST" and not query:
                scheme, host, port = target_map["gh"]
                return Upstream(scheme, host, port, "/route", "gh")
            if path == f"{API_PREFIX}/ors/status" and method == "GET" and not query:
                scheme, host, port = target_map["ors"]
                return Upstream(scheme, host, port, "/ors/status", "ors_status")
            match = _ORS_DIRECTIONS.fullmatch(path)
            if match and method == "POST" and not query:
                scheme, host, port = target_map["ors"]
                return Upstream(
                    scheme,
                    host,
                    port,
                    f"/ors/v2/directions/{match.group(1)}/geojson",
                    "ors_directions",
                )
            return None

        def _read_body(self) -> bytes | None:
            transfer_encoding = self.headers.get("Transfer-Encoding")
            if transfer_encoding:
                self.close_connection = True
                self._error(411, "chunked_request_not_supported")
                return None
            raw_length = self.headers.get("Content-Length")
            if raw_length is None:
                self.close_connection = True
                self._error(411, "content_length_required")
                return None
            try:
                length = int(raw_length)
            except ValueError:
                self.close_connection = True
                self._error(400, "invalid_content_length")
                return None
            if length < 0 or length > request_limit:
                if not self._discard_request_body(length):
                    self.close_connection = True
                self._error(413, "request_body_too_large")
                return None
            media_type = self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
            if media_type != "application/json":
                if not self._discard_request_body(length):
                    self.close_connection = True
                self._error(415, "json_required")
                return None
            payload, timed_out = self._read_exact_body(length, retain=True)
            if payload is None:
                self.close_connection = True
                self._error(
                    408 if timed_out else 400,
                    "request_body_timeout" if timed_out else "incomplete_request_body",
                )
                return None
            try:
                decoded = json.loads(payload.decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                self.close_connection = True
                self._error(400, "invalid_json")
                return None
            if not isinstance(decoded, dict):
                self.close_connection = True
                self._error(400, "json_object_required")
                return None
            return payload

        def _read_exact_body(
            self, length: int, *, retain: bool
        ) -> tuple[bytes | None, bool]:
            """Read under both idle and total body deadlines, one socket read at a time."""
            deadline = time.monotonic() + self.server.body_timeout_seconds
            remaining = length
            chunks: list[bytes] = []
            try:
                while remaining:
                    time_left = deadline - time.monotonic()
                    if time_left <= 0:
                        return None, True
                    self.connection.settimeout(
                        min(self.server.client_timeout_seconds, time_left)
                    )
                    chunk = self.rfile.read1(min(65536, remaining))
                    if not chunk:
                        return None, False
                    remaining -= len(chunk)
                    if retain:
                        chunks.append(chunk)
                return (b"".join(chunks) if retain else b""), False
            except socket.timeout:
                return None, True
            except OSError:
                return None, False
            finally:
                # The handler will close failed/incomplete requests. For a
                # successful body, restore the configured per-operation idle
                # timeout so keep-alive cannot inherit the final deadline slice.
                try:
                    self.connection.settimeout(self.server.client_timeout_seconds)
                except OSError:
                    pass

        def _discard_request_body(self, length: int | None = None) -> bool:
            """Drain a small rejected request without buffering it, avoiding keep-alive desync."""
            if self.headers.get("Transfer-Encoding"):
                return False
            if length is None:
                raw_length = self.headers.get("Content-Length")
                if raw_length is None:
                    return True
                try:
                    length = int(raw_length)
                except ValueError:
                    return False
            if length < 0 or length > MAX_REQUEST_BYTES:
                return False
            payload, _timed_out = self._read_exact_body(length, retain=False)
            return payload is not None

        def _forward(self, upstream: Upstream, body: bytes | None) -> None:
            conn = None
            response_sockets: list[socket.socket] = []
            response_timer: threading.Timer | None = None
            response_guard = threading.Lock()
            response_finished = False
            response_timed_out = threading.Event()

            def remember_response_socket(candidate: Any) -> None:
                if isinstance(candidate, socket.socket) and all(
                    existing is not candidate for existing in response_sockets
                ):
                    response_sockets.append(candidate)

            def abort_slow_response() -> None:
                nonlocal response_finished
                with response_guard:
                    if response_finished:
                        return
                    response_timed_out.set()
                    for response_socket in tuple(response_sockets):
                        try:
                            response_socket.shutdown(socket.SHUT_RDWR)
                        except OSError:
                            pass
                        try:
                            response_socket.close()
                        except OSError:
                            pass
                    if conn is not None:
                        conn.close()

            def stop_response_deadline() -> None:
                nonlocal response_finished
                with response_guard:
                    response_finished = True
                if response_timer is not None:
                    response_timer.cancel()

            try:
                conn = connect(upstream.scheme, upstream.host, upstream.port)
                accept = (
                    "application/geo+json, application/json"
                    if upstream.name == "ors_directions"
                    else "application/json"
                )
                headers = {"Accept": accept}
                if body is not None:
                    headers["Content-Type"] = "application/json"
                # Deliberately do not forward Origin, Authorization, Cookie, or
                # arbitrary client headers to any provider.
                conn.request(self.command, upstream.path, body=body, headers=headers)
                remember_response_socket(getattr(conn, "sock", None))
                response_timer = threading.Timer(
                    response_timeout_seconds, abort_slow_response
                )
                response_timer.daemon = True
                response_timer.start()
                response = conn.getresponse()
                # HTTPConnection sets conn.sock to None for Connection: close
                # and some chunked responses. HTTPResponse still owns the
                # SocketIO stream; retain its transport for the deadline timer.
                response_raw = getattr(getattr(response, "fp", None), "raw", None)
                response_socket = getattr(response_raw, "_sock", None)
                with response_guard:
                    if not response_finished and not response_timed_out.is_set():
                        remember_response_socket(response_socket)
                if 300 <= response.status < 400:
                    self._error(502, "upstream_redirect_rejected")
                    return
                if upstream.name.startswith("ors") and response.status >= 400:
                    # Never read or relay ORS error bodies or their headers.
                    safe_error = _json_bytes(
                        {"error": "ors_upstream_error", "status": response.status}
                    )
                    self._reply(response.status, safe_error, "application/json")
                    return
                if upstream.name == "ors_directions":
                    media_type = (
                        response.getheader("Content-Type", "")
                        .split(";", 1)[0]
                        .strip()
                        .lower()
                    )
                    if media_type not in ORS_GEOJSON_MEDIA_TYPES:
                        self._error(502, "ors_response_not_json")
                        return
                payload = response.read(response_limit + 1)
                stop_response_deadline()
                if response_timed_out.is_set():
                    self._error(504, "upstream_timeout")
                    return
                if len(payload) > response_limit:
                    self._error(502, "upstream_response_too_large")
                    return
                if upstream.name == "ors_status" and 200 <= response.status < 300:
                    payload = _safe_ors_status(payload)
                elif upstream.name == "ors_directions" and 200 <= response.status < 300:
                    safe_payload = _safe_ors_directions(payload)
                    if safe_payload is None:
                        self._error(502, "ors_response_invalid")
                        return
                    payload = safe_payload
                content_type = (
                    "application/json"
                    if upstream.name.startswith("ors")
                    else response.getheader("Content-Type", "application/json")
                )
                if len(content_type) > 100 or "\r" in content_type or "\n" in content_type:
                    content_type = "application/json"
                self._reply(response.status, payload, content_type)
            except (socket.timeout, TimeoutError):
                self._error(504, "upstream_timeout")
            except (OSError, http.client.HTTPException, ssl.SSLError):
                self._error(
                    504 if response_timed_out.is_set() else 502,
                    "upstream_timeout" if response_timed_out.is_set() else "upstream_unavailable",
                )
            finally:
                stop_response_deadline()
                if conn is not None:
                    conn.close()

        def _handle(self) -> None:
            self._dispatch()

        def _dispatch(self) -> None:
            host = self.headers.get("Host", "").lower()
            if host != expected_host:
                if self.command not in ("GET", "HEAD"):
                    self._discard_request_body()
                    self.close_connection = True
                self._error(421, "host_rejected")
                return
            if self.command == "OPTIONS":
                self._error(405, "method_not_allowed")
                return
            target_parts = self._safe_request_target()
            if target_parts is None:
                self._error(400, "invalid_path")
                return
            path, query = target_parts
            is_api = path == API_PREFIX or path.startswith(API_PREFIX + "/")
            if is_api:
                if not self._valid_request_origin(is_post=self.command == "POST"):
                    if self.command not in ("GET", "HEAD") or self.headers.get("Content-Length"):
                        self._discard_request_body()
                        self.close_connection = True
                    self._error(403, "origin_rejected")
                    return
                upstream = self._route(path, query, self.command)
                if upstream is None:
                    if self.command not in ("GET", "HEAD") or self.headers.get("Content-Length"):
                        self._discard_request_body()
                        self.close_connection = True
                    self._error(404, "route_not_allowed")
                    return
                body = None
                if self.command == "POST":
                    body = self._read_body()
                    if body is None:
                        return
                    if (
                        upstream.name == "gh"
                        and upstream.path == "/route"
                        and not valid_graphhopper_route_payload(body)
                    ):
                        self._error(400, "graphhopper_route_payload_invalid")
                        return
                elif self.headers.get("Content-Length") not in (None, "0"):
                    self.close_connection = True
                    self._error(400, "request_body_not_allowed")
                    return
                self._forward(upstream, body)
                return
            if self.command not in ("GET", "HEAD"):
                self._discard_request_body()
                self.close_connection = True
                self._error(405, "method_not_allowed")
                return
            scheme, backend_host, backend_port = target_map["gis"]
            canonical_target = path + ("?" + query if query else "")
            upstream = Upstream(scheme, backend_host, backend_port, canonical_target, "gis")
            self._forward(upstream, None)

        do_GET = _handle
        do_HEAD = _handle
        do_POST = _handle
        do_PUT = _handle
        do_PATCH = _handle
        do_DELETE = _handle
        do_OPTIONS = _handle

    server = QuietThreadingHTTPServer(
        (bind_host, bind_port),
        Handler,
        max_connections=max_connections,
        client_timeout_seconds=client_timeout_seconds,
        body_timeout_seconds=body_timeout_seconds,
        header_timeout_seconds=header_timeout_seconds,
    )
    return server


def main() -> None:
    origin = os.environ.get("GIS_HTTPS_ORIGIN", "").strip()
    if not origin:
        raise SystemExit("Set GIS_HTTPS_ORIGIN to the exact HTTPS origin including :8443.")
    bind_port = int(os.environ.get("GIS_PROXY_PORT", "18080"))
    server = create_server(origin, bind_host="127.0.0.1", bind_port=bind_port)
    print(f"Loopback proxy listening on 127.0.0.1:{bind_port}; upstreams are fixed.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
