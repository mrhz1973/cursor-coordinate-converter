#!/usr/bin/env python3
"""GOI ORS directions gateway (INFRA1).

Python 3.12 stdlib only. Not a generic proxy.

- Bind loopback only.
- Upstream host hardcoded: api.openrouteservice.org
- Path + profile whitelist.
- JSON body key whitelist from ORS Directions Service schema.
- Secret ORS_API_KEY read server-side; empty/missing => fail-closed (no upstream).
- Never log bodies, coordinates, or Authorization values.
"""

from __future__ import annotations

import json
import logging
import os
import re
import ssl
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Optional
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

GATEWAY_VERSION = "0.1.0"
UPSTREAM_HOST = "api.openrouteservice.org"
UPSTREAM_SCHEME = "https"
ALLOWED_PROFILES = frozenset({"foot-hiking", "foot-walking", "cycling-mountain"})
DIRECTIONS_RE = re.compile(
    r"^/ors/v2/directions/(" + "|".join(sorted(ALLOWED_PROFILES)) + r")/geojson$"
)
SECRET_NAME = "ORS_API_KEY"
SECRET_FILE = Path("/etc/systemd/ors-credentials/ORS_API_KEY")

REQUEST_BODY_MAX = 64 * 1024
RESPONSE_BODY_MAX = 2 * 1024 * 1024
UPSTREAM_TIMEOUT_SEC = 20
LISTEN_HOST = "127.0.0.1"
LISTEN_PORT = 8020
ORIGIN_ALLOWLIST = frozenset({"http://100.114.7.53:8000"})

BODY_KEYS = frozenset(
    {
        "coordinates",
        "elevation",
        "instructions",
        "instructions_format",
        "preference",
        "units",
        "language",
        "geometry",
        "geometry_simplify",
        "extra_info",
        "radiuses",
        "bearings",
        "continue_straight",
        "attributes",
        "maneuvers",
        "suppress_warnings",
        "roundabout_exits",
        "options",
        "alternative_routes",
        "id",
        "skip_segments",
    }
)
OPTIONS_KEYS = frozenset(
    {
        "avoid_borders",
        "avoid_countries",
        "avoid_features",
        "avoid_polygons",
        "profile_params",
        "round_trip",
        "vehicle_type",
    }
)
ALT_KEYS = frozenset({"share_factor", "target_count", "weight_factor"})
ROUND_TRIP_KEYS = frozenset({"length", "points", "seed"})
PROFILE_PARAMS_KEYS = frozenset({"weightings", "restrictions", "allow_unsuitable", "surface_quality_known"})
WEIGHTINGS_KEYS = frozenset({"steepness_difficulty", "green", "quiet", "shadow"})
AVOID_POLY_TYPES = frozenset({"Polygon", "MultiPolygon"})

log = logging.getLogger("goi.ors.gateway")


def _pick_keys(obj: Any, allowed: frozenset[str]) -> dict[str, Any]:
    if not isinstance(obj, dict):
        return {}
    out: dict[str, Any] = {}
    for k, v in obj.items():
        if isinstance(k, str) and k in allowed:
            out[k] = v
    return out


def sanitize_directions_body(raw: Any) -> Optional[dict[str, Any]]:
    """Copy only documented ORS Directions Service fields. Drop everything else."""
    if not isinstance(raw, dict):
        return None
    body = _pick_keys(raw, BODY_KEYS)
    if "options" in body:
        opts = _pick_keys(body["options"], OPTIONS_KEYS)
        if "round_trip" in opts:
            opts["round_trip"] = _pick_keys(opts["round_trip"], ROUND_TRIP_KEYS)
        if "profile_params" in opts:
            pp = _pick_keys(opts["profile_params"], PROFILE_PARAMS_KEYS)
            if "weightings" in pp:
                pp["weightings"] = _pick_keys(pp["weightings"], WEIGHTINGS_KEYS)
            opts["profile_params"] = pp
        if "avoid_polygons" in opts:
            poly = opts["avoid_polygons"]
            if not isinstance(poly, dict):
                return None
            ptype = poly.get("type")
            if ptype not in AVOID_POLY_TYPES:
                return None
            if "coordinates" not in poly or not isinstance(poly["coordinates"], list):
                return None
            opts["avoid_polygons"] = {"type": ptype, "coordinates": poly["coordinates"]}
        body["options"] = opts
    if "alternative_routes" in body:
        body["alternative_routes"] = _pick_keys(body["alternative_routes"], ALT_KEYS)
    return body


def read_secret_status() -> tuple[str, str]:
    """Return (PRESENT|ABSENT, value_or_empty). Never log the value."""
    cred_dir = os.environ.get("CREDENTIALS_DIRECTORY", "")
    candidates = []
    if cred_dir:
        candidates.append(Path(cred_dir) / SECRET_NAME)
    env_val = os.environ.get(SECRET_NAME)
    if env_val is not None:
        stripped = env_val.strip()
        if stripped:
            return "PRESENT", stripped
    candidates.append(SECRET_FILE)
    for p in candidates:
        try:
            if p.is_file():
                text = p.read_text(encoding="utf-8").strip()
                if text:
                    return "PRESENT", text
        except OSError:
            continue
    return "ABSENT", ""


def status_payload() -> dict[str, Any]:
    present, _val = read_secret_status()
    return {
        "service": "goi-ors-gateway",
        "version": GATEWAY_VERSION,
        "status": "ready",
        "secret": present,
        "secret_name": SECRET_NAME,
        "upstream_host": UPSTREAM_HOST,
        "profiles": sorted(ALLOWED_PROFILES),
    }


def map_upstream_error(http_status: int) -> tuple[int, str, str]:
    if http_status in (401, 403):
        return 502, "ors_auth", "auth"
    if http_status == 429:
        return 429, "ors_rate_limit", "rate_limit"
    if http_status == 404:
        return 404, "ors_not_found", "not_found"
    if http_status == 400:
        return 400, "ors_invalid_payload", "invalid_payload"
    if http_status == 413:
        return 413, "ors_payload_too_large", "payload_too_large"
    if http_status >= 500:
        return 502, "ors_upstream", "upstream"
    return 502, "ors_upstream", "upstream"


def origin_allowed(origin: Optional[str]) -> bool:
    if not origin:
        return True
    return origin in ORIGIN_ALLOWLIST


def forward_directions(profile: str, body: dict[str, Any], secret: str) -> tuple[int, dict[str, Any] | bytes, str]:
    path = f"/v2/directions/{profile}/geojson"
    url = f"{UPSTREAM_SCHEME}://{UPSTREAM_HOST}{path}"
    payload = json.dumps(body, ensure_ascii=False, allow_nan=False).encode("utf-8")
    req = Request(
        url,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/geo+json, application/json",
            "Authorization": secret,
            "User-Agent": f"goi-ors-gateway/{GATEWAY_VERSION}",
        },
    )
    ctx = ssl.create_default_context()
    raw = b""
    status = 0
    ctype = ""
    try:
        with urlopen(req, timeout=UPSTREAM_TIMEOUT_SEC, context=ctx) as resp:
            raw = resp.read(RESPONSE_BODY_MAX + 1)
            status = int(getattr(resp, "status", 200) or 200)
            try:
                ctype = str(resp.headers.get("Content-Type") or "")
            except Exception:
                ctype = ""
    except HTTPError as e:
        try:
            e.read(256)
        except Exception:
            pass
        mapped, err, cat = map_upstream_error(int(e.code or 0))
        return mapped, {"error": err, "error_category": cat}, cat
    except URLError as e:
        reason = str(getattr(e, "reason", e) or e).lower()
        if "timed out" in reason or "timeout" in reason:
            return 504, {"error": "ors_timeout", "error_category": "timeout"}, "timeout"
        return 502, {"error": "ors_upstream_network", "error_category": "upstream"}, "upstream"
    except TimeoutError:
        return 504, {"error": "ors_timeout", "error_category": "timeout"}, "timeout"
    if len(raw) > RESPONSE_BODY_MAX:
        return 502, {"error": "ors_response_too_large", "error_category": "response_size"}, "response_size"
    return int(status or 200), raw, ctype


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt: str, *args: Any) -> None:
        # Access line only: client, method already in args[0] typically. Avoid header dump.
        try:
            msg = fmt % args
        except Exception:
            msg = "log"
        if "authorization" in msg.lower() or "ors_api_key" in msg.lower():
            msg = "redacted"
        log.info("access %s", msg)

    def log_error(self, fmt: str, *args: Any) -> None:
        try:
            msg = fmt % args
        except Exception:
            msg = "error"
        if "authorization" in msg.lower() or "ors_api_key" in msg.lower():
            msg = "redacted"
        log.error("http %s", msg)

    def _cors(self) -> dict[str, str]:
        origin = self.headers.get("Origin")
        if origin and origin in ORIGIN_ALLOWLIST:
            return {"Access-Control-Allow-Origin": origin, "Vary": "Origin"}
        return {}

    def _send_json(self, status: int, obj: dict[str, Any]) -> None:
        raw = json.dumps(obj, ensure_ascii=False, allow_nan=False).encode("utf-8")
        self._send_bytes(status, raw, "application/json; charset=utf-8")

    def _send_bytes(self, status: int, raw: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        for k, v in self._cors().items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(raw)

    def _forbid_origin(self) -> bool:
        origin = self.headers.get("Origin")
        if origin_allowed(origin):
            return False
        self._send_json(403, {"error": "origin_forbidden", "error_category": "origin"})
        return True

    def do_OPTIONS(self) -> None:  # noqa: N802
        origin = self.headers.get("Origin")
        if not origin or origin not in ORIGIN_ALLOWLIST:
            self.send_response(403)
            self.end_headers()
            return
        path = self.path.split("?", 1)[0]
        if path != "/ors/status" and not DIRECTIONS_RE.match(path):
            self.send_response(404)
            self.end_headers()
            return
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self._forbid_origin():
            return
        path = self.path.split("?", 1)[0]
        if path != "/ors/status":
            self._send_json(404, {"error": "not_found", "error_category": "path"})
            return
        self._send_json(200, status_payload())

    def do_POST(self) -> None:  # noqa: N802
        if self._forbid_origin():
            return
        path = self.path.split("?", 1)[0]
        m = DIRECTIONS_RE.match(path)
        if not m:
            self._send_json(404, {"error": "not_found", "error_category": "path"})
            return
        ctype = (self.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        if ctype != "application/json":
            self._send_json(415, {"error": "unsupported_media_type", "error_category": "content_type"})
            return
        try:
            length = int(self.headers.get("Content-Length") or "0")
        except ValueError:
            length = -1
        if length < 0 or length > REQUEST_BODY_MAX:
            self._send_json(413, {"error": "payload_too_large", "error_category": "payload_too_large"})
            return
        raw = self.rfile.read(length)
        if len(raw) > REQUEST_BODY_MAX:
            self._send_json(413, {"error": "payload_too_large", "error_category": "payload_too_large"})
            return
        try:
            parsed = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send_json(400, {"error": "invalid_json", "error_category": "invalid_payload"})
            return
        body = sanitize_directions_body(parsed)
        if body is None:
            self._send_json(400, {"error": "invalid_payload", "error_category": "invalid_payload"})
            return
        present, secret = read_secret_status()
        if present != "PRESENT" or not secret:
            log.info("directions fail-closed secret=ABSENT profile=%s", m.group(1))
            self._send_json(503, {"error": "secret_not_configured", "error_category": "auth"})
            return
        t0 = time.monotonic()
        status, result, extra = forward_directions(m.group(1), body, secret)
        dt = int((time.monotonic() - t0) * 1000)
        log.info("directions profile=%s upstream_ms=%s status=%s", m.group(1), dt, status)
        if isinstance(result, dict):
            self._send_json(status, result)
            return
        ct = extra if extra.startswith("application/") else "application/geo+json"
        self._send_bytes(status, result, ct)

    def do_PUT(self) -> None:  # noqa: N802
        self._send_json(405, {"error": "method_not_allowed", "error_category": "method"})

    def do_DELETE(self) -> None:  # noqa: N802
        self._send_json(405, {"error": "method_not_allowed", "error_category": "method"})


def main() -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
        stream=sys.stderr,
    )
    present, _ = read_secret_status()
    log.info(
        "start version=%s bind=%s:%s secret=%s upstream_host=%s",
        GATEWAY_VERSION,
        LISTEN_HOST,
        LISTEN_PORT,
        present,
        UPSTREAM_HOST,
    )
    httpd = ThreadingHTTPServer((LISTEN_HOST, LISTEN_PORT), Handler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
