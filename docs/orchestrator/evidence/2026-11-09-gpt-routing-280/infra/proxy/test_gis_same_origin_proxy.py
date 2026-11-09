from __future__ import annotations

import http.client
import json
import shutil
import socket
import ssl
import subprocess
import tempfile
import threading
import time
import unittest
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

import gis_same_origin_proxy as proxy


class MockState:
    def __init__(self) -> None:
        self.calls: list[dict[str, object]] = []
        self.mode = "normal"
        self.lock = threading.Lock()

    def record(self, item: dict[str, object]) -> None:
        with self.lock:
            self.calls.append(item)

    def count(self) -> int:
        with self.lock:
            return len(self.calls)

    def last(self) -> dict[str, object]:
        with self.lock:
            return dict(self.calls[-1])


def gh_route_body(profile: str = "hiking", points: list[list[float]] | None = None) -> dict[str, object]:
    return {
        "profile": profile,
        "points": points or [[9.82, 44.10], [9.85, 44.12]],
        "elevation": True,
        "points_encoded": False,
        "instructions": False,
        "custom_model": {
            "priority": [{"if": "road_environment == FERRY", "multiply_by": "0"}]
        },
        "ch.disable": True,
        "details": ["road_environment"],
        "snap_preventions": ["ferry"],
    }


def make_mock(name: str, state: MockState) -> ThreadingHTTPServer:
    class Handler(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"

        def log_message(self, _format: str, *args: object) -> None:
            return

        def _respond(
            self,
            status: int,
            payload: bytes,
            content_type: str = "application/json",
            extra_headers: tuple[tuple[str, str], ...] = (),
        ) -> None:
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(payload)))
            for key, value in extra_headers:
                self.send_header(key, value)
            self.end_headers()
            try:
                self.wfile.write(payload)
            except OSError:
                return

        def _record(self, body: bytes | None = None) -> tuple[str, dict[str, list[str]]]:
            parsed = urlsplit(self.path)
            query = parse_qs(parsed.query, keep_blank_values=True)
            state.record(
                {
                    "upstream": name,
                    "method": self.command,
                    "raw_target": self.path,
                    "path": parsed.path,
                    "query_keys": tuple(sorted(query.keys())),
                    "has_point": "point" in query,
                    "origin": self.headers.get("Origin"),
                    "accept": self.headers.get("Accept"),
                    "has_authorization": bool(self.headers.get("Authorization")),
                    "has_cookie": bool(self.headers.get("Cookie")),
                    "body_length": len(body or b""),
                    "body": body if name == "gh" and parsed.path == "/route" else None,
                }
            )
            return parsed.path, query

        def do_GET(self) -> None:
            path, query = self._record()
            if name == "gis":
                if path == "/":
                    return self._respond(200, b"GIS_STATIC_OK", "text/html")
                if path == "/large":
                    return self._respond(200, b"x" * 2048)
            if name == "gh":
                if path == "/info":
                    if state.mode == "slow_drip":
                        payload = b'{"profiles":[]}'
                        self.send_response(200)
                        self.send_header("Content-Type", "application/json")
                        self.send_header("Content-Length", str(len(payload)))
                        self.end_headers()
                        try:
                            for byte in payload:
                                self.wfile.write(bytes([byte]))
                                self.wfile.flush()
                                time.sleep(0.04)
                        except OSError:
                            return
                        return
                    if state.mode == "slow":
                        time.sleep(0.25)
                    if state.mode == "large":
                        return self._respond(200, b"x" * 2048)
                    if state.mode == "redirect":
                        self.send_response(302)
                        self.send_header("Location", "http://example.invalid/")
                        self.send_header("Content-Length", "0")
                        self.end_headers()
                        return
                    return self._respond(
                        200,
                        json.dumps(
                            {
                                "profiles": [
                                    {"name": "hiking"},
                                    {"name": "hiking_easy"},
                                    {"name": "mtb_touring"},
                                    {"name": "mtb_trail"},
                                ],
                                "bbox": [9, 43, 10, 45],
                            }
                        ).encode(),
                    )
                if path == "/nearest" and "point" in query:
                    return self._respond(200, b'{"hits":[]}')
            if name == "ors" and path == "/ors/status":
                if state.mode == "slow_drip_close":
                    payload = b'{"status":"ready","secret":"PRESENT"}'
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Content-Length", str(len(payload)))
                    self.send_header("Connection", "close")
                    self.end_headers()
                    try:
                        for byte in payload:
                            self.wfile.write(bytes([byte]))
                            self.wfile.flush()
                            time.sleep(0.04)
                    except OSError:
                        return
                    return
                if state.mode == "slow":
                    time.sleep(0.25)
                if state.mode == "error503":
                    return self._respond(
                        503,
                        b'{"error":"failure","private_key":"ORS_SECRET_SENTINEL"}',
                        "text/html",
                        (
                            ("Set-Cookie", "session=ORS_SECRET_SENTINEL"),
                            ("Access-Control-Allow-Origin", "https://evil.invalid"),
                            ("X-Private-Debug", "ORS_SECRET_SENTINEL"),
                        ),
                    )
                if state.mode == "redirect":
                    self.send_response(302)
                    self.send_header("Location", "http://example.invalid/")
                    self.send_header("Content-Length", "0")
                    self.end_headers()
                    return
                if state.mode == "large":
                    return self._respond(200, b"x" * 2048)
                return self._respond(
                    200,
                    json.dumps(
                        {
                            "status": "ready",
                            "secret": "PRESENT",
                            "profiles": ["foot-hiking", "foot-walking", "cycling-mountain"],
                            "private_field": "DO_NOT_FORWARD",
                        }
                    ).encode(),
                )
            return self._respond(404, b'{"error":"mock_not_found"}')

        def do_POST(self) -> None:
            length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(length)
            path, _query = self._record(body)
            if name == "gh" and path == "/route":
                return self._respond(200, b'{"synthetic":true}')
            if name == "ors" and path.startswith("/ors/v2/directions/"):
                if "application/geo+json" not in self.headers.get("Accept", "").lower():
                    return self._respond(406, b'{"error":"geojson_accept_required"}')
                if state.mode == "error503":
                    return self._respond(
                        503,
                        b'{"error":"failure","private_key":"ORS_SECRET_SENTINEL"}',
                        "text/html",
                        (
                            ("Set-Cookie", "session=ORS_SECRET_SENTINEL"),
                            ("Access-Control-Allow-Origin", "https://evil.invalid"),
                            ("X-Private-Debug", "ORS_SECRET_SENTINEL"),
                        ),
                    )
                if state.mode == "html200":
                    return self._respond(
                        200,
                        b"<script>ORS_SECRET_SENTINEL</script>",
                        "text/html",
                        (("X-Private-Debug", "ORS_SECRET_SENTINEL"),),
                    )
                return self._respond(
                    200,
                    json.dumps(
                        {
                            "type": "FeatureCollection",
                            "features": [
                                {
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "LineString",
                                        "coordinates": [[0, 0], [0.1, 0.1]],
                                    },
                                    "properties": {
                                        "way_points": [0, 1],
                                        "extras": {"waytype": {"values": [[0, 1, 1]]}},
                                        "summary": {"distance": 100, "duration": 10},
                                        "private_field": "ORS_SECRET_SENTINEL",
                                    },
                                }
                            ],
                            "private_root_field": "ORS_SECRET_SENTINEL",
                        }
                    ).encode(),
                )
            return self._respond(404, b'{"error":"mock_not_found"}')

    class QuietMockServer(ThreadingHTTPServer):
        def handle_error(self, _request: object, _client_address: object) -> None:
            return

    server = QuietMockServer(("127.0.0.1", 0), Handler)
    server.daemon_threads = True
    server.state = state  # type: ignore[attr-defined]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


class SameOriginProxyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.gis_state, cls.gh_state, cls.ors_state = MockState(), MockState(), MockState()
        cls.gis = make_mock("gis", cls.gis_state)
        cls.gh = make_mock("gh", cls.gh_state)
        cls.ors = make_mock("ors", cls.ors_state)
        cls.targets = {
            "gis": ("http", "127.0.0.1", cls.gis.server_port),
            "gh": ("http", "127.0.0.1", cls.gh.server_port),
            "ors": ("https", "127.0.0.1", cls.ors.server_port),
        }

        def local_mock_connection(
            _scheme: str, host: str, port: int, timeout: float
        ) -> http.client.HTTPConnection:
            # Test-only transport to loopback mocks; production uses verified HTTPS.
            return http.client.HTTPConnection(host, port, timeout=timeout)

        cls.proxy_server = proxy.create_server(
            "https://gis.test:8443",
            bind_host="127.0.0.1",
            bind_port=0,
            targets=cls.targets,
            request_limit=16384,
            response_limit=1024,
            timeout_seconds=0.05,
            client_timeout_seconds=0.3,
            connection_factory=local_mock_connection,
        )
        threading.Thread(target=cls.proxy_server.serve_forever, daemon=True).start()
        cls.proxy_port = cls.proxy_server.server_port

    @classmethod
    def tearDownClass(cls) -> None:
        cls.proxy_server.shutdown()
        cls.proxy_server.server_close()
        for server in (cls.gis, cls.gh, cls.ors):
            server.shutdown()
            server.server_close()

    def request(
        self,
        method: str,
        path: str,
        *,
        body: bytes | None = None,
        headers: dict[str, str] | None = None,
    ) -> tuple[int, dict[str, str], bytes]:
        request_headers = {"Host": "gis.test:8443", "Connection": "close"}
        request_headers.update(headers or {})
        conn = http.client.HTTPConnection("127.0.0.1", self.proxy_port, timeout=2)
        conn.request(method, path, body=body, headers=request_headers)
        response = conn.getresponse()
        payload = response.read()
        result = response.status, {k.lower(): v for k, v in response.getheaders()}, payload
        conn.close()
        return result

    def json_result(self, result: tuple[int, dict[str, str], bytes]) -> dict[str, object]:
        return json.loads(result[2].decode("utf-8"))

    def test_known_upstreams_are_fixed_and_old_http_candidate_is_unchanged(self) -> None:
        self.assertEqual(proxy.PRODUCTION_TARGETS["gis"], ("http", "100.99.54.93", 8000))
        self.assertEqual(proxy.PRODUCTION_TARGETS["gh"], ("http", "100.99.54.93", 8989))
        self.assertEqual(
            proxy.PRODUCTION_TARGETS["ors"],
            ("https", "ionos-n8n-new.tailc01234.ts.net", 443),
        )
        candidate = Path(__file__).resolve().parents[1] / "routing-candidate-277-compare-snap.html"
        html = candidate.read_text(encoding="utf-8")
        self.assertIn('ROUTING_GRAPHHOPPER_ENDPOINT = "http://100.99.54.93:8989"', html)
        self.assertIn(
            'ROUTING_ORS_GATEWAY_BASE = "https://ionos-n8n-new.tailc01234.ts.net"',
            html,
        )

    def test_static_frontend_is_forwarded_to_existing_gis_http_upstream(self) -> None:
        status, headers, body = self.request("GET", "/")
        self.assertEqual(status, 200)
        self.assertEqual(body, b"GIS_STATIC_OK")
        self.assertEqual(self.gis_state.last()["path"], "/")
        self.assertNotIn("access-control-allow-origin", headers)
        status, _headers, _body = self.request("GET", "/?asset=a%252Fb")
        self.assertEqual(status, 200)
        self.assertEqual(self.gis_state.last()["raw_target"], "/?asset=a%2Fb")

    def test_same_origin_get_needs_no_acao_and_does_not_forward_origin_or_credentials(self) -> None:
        status, headers, body = self.request(
            "GET",
            "/_routing/gh/info",
            headers={
                "Origin": "https://gis.test:8443",
                "Sec-Fetch-Site": "same-origin",
                "Authorization": "Bearer SHOULD_NOT_FORWARD",
                "Cookie": "session=SHOULD_NOT_FORWARD",
            },
        )
        self.assertEqual(status, 200)
        self.assertNotIn("access-control-allow-origin", headers)
        call = self.gh_state.last()
        self.assertIsNone(call["origin"])
        self.assertFalse(call["has_authorization"])
        self.assertFalse(call["has_cookie"])
        self.assertEqual(json.loads(body)["profiles"][0]["name"], "hiking")

    def test_get_without_origin_is_accepted_for_server_to_server_and_same_origin_use(self) -> None:
        status, headers, body = self.request("GET", "/_routing/ors/status")
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(body)["status"], "ready")
        self.assertNotIn("access-control-allow-origin", headers)
        self.assertIsNone(self.ors_state.last()["origin"])

    def test_nearest_query_is_validated_and_not_reflected(self) -> None:
        status, _headers, _body = self.request(
            "GET", "/_routing/gh/nearest?point=44.1%2C9.8"
        )
        self.assertEqual(status, 200)
        self.assertTrue(self.gh_state.last()["has_point"])
        before = self.gh_state.count()
        status, _headers, _body = self.request(
            "GET", "/_routing/gh/nearest?point=44.1%2C9.8&url=http%3A%2F%2Fevil.invalid"
        )
        self.assertEqual(status, 404)
        self.assertEqual(self.gh_state.count(), before)
        status, _headers, _body = self.request(
            "GET", "/_routing/gh/nearest?point=999%2C9.8"
        )
        self.assertEqual(status, 404)
        self.assertEqual(self.gh_state.count(), before)

    def test_only_allowlisted_posts_reach_fixed_backends_without_credentials(self) -> None:
        json_headers = {
            "Origin": "https://gis.test:8443",
            "Sec-Fetch-Site": "same-origin",
            "Content-Type": "application/json",
            "Authorization": "Bearer SHOULD_NOT_FORWARD",
            "Cookie": "session=SHOULD_NOT_FORWARD",
        }
        gh_payload = json.dumps(gh_route_body(), separators=(",", ":")).encode()
        status, _headers, _body = self.request(
            "POST", "/_routing/gh/route", body=gh_payload, headers=json_headers
        )
        self.assertEqual(status, 200)
        gh_call = self.gh_state.last()
        self.assertEqual(gh_call["body"], gh_payload)
        self.assertFalse(gh_call["has_authorization"])
        self.assertFalse(gh_call["has_cookie"])
        self.assertIsNone(gh_call["origin"])
        status, _headers, _body = self.request(
            "POST",
            "/_routing/ors/v2/directions/foot-hiking/geojson",
            body=b'{"synthetic":true}',
            headers=json_headers,
        )
        self.assertEqual(status, 200)
        ors_call = self.ors_state.last()
        self.assertEqual(ors_call["accept"], "application/geo+json, application/json")
        self.assertFalse(ors_call["has_authorization"])
        self.assertFalse(ors_call["has_cookie"])
        self.assertIsNone(ors_call["origin"])
        before = self.ors_state.count()
        status, _headers, _body = self.request(
            "POST",
            "/_routing/ors/v2/directions/unknown-profile/geojson",
            body=b'{"synthetic":true}',
            headers=json_headers,
        )
        self.assertEqual(status, 404)
        self.assertEqual(self.ors_state.count(), before)

    def test_graphhopper_builder_profiles_and_modes_are_forwarded_verbatim(self) -> None:
        headers = {
            "Origin": "https://gis.test:8443",
            "Sec-Fetch-Site": "same-origin",
            "Content-Type": "application/json",
        }
        for profile in sorted(proxy.GRAPHHOPPER_PROFILES):
            body = gh_route_body(profile)
            payload = json.dumps(body, separators=(",", ":")).encode()
            status, _headers, _response = self.request(
                "POST", "/_routing/gh/route", body=payload, headers=headers
            )
            self.assertEqual(status, 200, profile)
            self.assertEqual(self.gh_state.last()["body"], payload)

        alternatives = gh_route_body()
        alternatives.update(
            {
                "algorithm": "alternative_route",
                "alternative_route.max_paths": 3,
                "alternative_route.max_weight_factor": 1.4,
                "alternative_route.max_share_factor": 0.6,
            }
        )
        round_trip = gh_route_body(points=[[9.82, 44.10]])
        round_trip.update(
            {
                "algorithm": "round_trip",
                "round_trip.distance": 40000,
                "round_trip.seed": 4294967295,
            }
        )
        avoid = gh_route_body()
        areas: dict[str, object] = {}
        priority: list[dict[str, str]] = []
        for area_index in range(8):
            area_id = f"avoid_ra{area_index}"
            offset = area_index * 0.1
            ring = [
                [9.8 + offset + i * 0.001, 44.1 + offset + (i % 2) * 0.001]
                for i in range(24)
            ]
            ring.append(ring[0])
            areas[area_id] = {
                "type": "Feature",
                "properties": {},
                "geometry": {"type": "Polygon", "coordinates": [ring]},
            }
            priority.append({"if": f"in_{area_id}", "multiply_by": "0"})
        priority.append({"if": "road_environment == FERRY", "multiply_by": "0"})
        avoid["custom_model"] = {"areas": areas, "priority": priority}
        for body in (alternatives, round_trip, avoid, gh_route_body(points=[[float(i), 10.0] for i in range(20)])):
            payload = json.dumps(body, separators=(",", ":")).encode()
            status, _headers, _response = self.request(
                "POST", "/_routing/gh/route", body=payload, headers=headers
            )
            self.assertEqual(status, 200, body)
            self.assertEqual(self.gh_state.last()["body"], payload)

    def test_graphhopper_route_payload_allowlist_rejects_without_upstream_call(self) -> None:
        headers = {
            "Origin": "https://gis.test:8443",
            "Sec-Fetch-Site": "same-origin",
            "Content-Type": "application/json",
        }
        invalid: list[dict[str, object]] = []
        body = gh_route_body("custom_profile")
        invalid.append(body)
        body = gh_route_body()
        body["profile"] = {"name": "hiking"}
        invalid.append(body)
        body = gh_route_body()
        body["url"] = "http://127.0.0.1/admin"
        invalid.append(body)
        body = gh_route_body()
        body["points"] = [[9.82, 44.10]]
        invalid.append(body)
        body = gh_route_body()
        body["points"] = [[181, 44.1], [9.85, 44.12]]
        invalid.append(body)
        body = gh_route_body(points=[[9.82, 44.1]])
        body.update({"algorithm": "round_trip", "round_trip.distance": 41000, "round_trip.seed": 1})
        invalid.append(body)
        body = gh_route_body()
        body.update(
            {
                "algorithm": "alternative_route",
                "alternative_route.max_paths": 4,
                "alternative_route.max_weight_factor": 1.4,
                "alternative_route.max_share_factor": 0.6,
            }
        )
        invalid.append(body)
        body = gh_route_body(points=[[9.82, 44.1], [9.83, 44.11], [9.84, 44.12]])
        body.update(
            {
                "algorithm": "alternative_route",
                "alternative_route.max_paths": 3,
                "alternative_route.max_weight_factor": 1.4,
                "alternative_route.max_share_factor": 0.6,
            }
        )
        invalid.append(body)
        body = gh_route_body()
        body["custom_model"] = {"priority": [{"if": "true", "multiply_by": "0"}]}
        invalid.append(body)
        body = gh_route_body()
        body["custom_model"] = {
            "areas": {
                "avoid_ra123": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[9.8, 44.1], [9.9, 44.1], [9.9, 44.2], [9.8, 44.2]]],
                    },
                }
            },
            "priority": [
                {"if": "in_avoid_ra123", "multiply_by": "0"},
                {"if": "road_environment == FERRY", "multiply_by": "0"},
            ],
        }
        invalid.append(body)
        body = gh_route_body()
        body["points"] = [[9.82 + i * 0.001, 44.1] for i in range(21)]
        invalid.append(body)

        before = self.gh_state.count()
        for body in invalid:
            with self.subTest(body=body):
                status, _response_headers, response = self.request(
                    "POST",
                    "/_routing/gh/route",
                    body=json.dumps(body, separators=(",", ":")).encode(),
                    headers=headers,
                )
                self.assertEqual(status, 400)
                self.assertEqual(json.loads(response), {"error": "graphhopper_route_payload_invalid"})
                self.assertNotIn(b"127.0.0.1", response)
        duplicate_key_payload = (
            b'{"profile":"hiking","profile":"mtb_trail","points":[[9.82,44.1],[9.85,44.12]],'
            b'"elevation":true,"points_encoded":false,"instructions":false,'
            b'"custom_model":{"priority":[{"if":"road_environment == FERRY","multiply_by":"0"}]},'
            b'"ch.disable":true,"details":["road_environment"],"snap_preventions":["ferry"]}'
        )
        status, _response_headers, _response = self.request(
            "POST", "/_routing/gh/route", body=duplicate_key_payload, headers=headers
        )
        self.assertEqual(status, 400)
        self.assertEqual(self.gh_state.count(), before)

    def test_graphhopper_route_rejects_wrong_methods_and_invalid_limits(self) -> None:
        before = self.gh_state.count()
        for method in ("GET", "PUT", "DELETE", "OPTIONS"):
            status, _headers, _body = self.request(
                method,
                "/_routing/gh/route",
                body=None,
                headers={
                    "Origin": "https://gis.test:8443",
                    "Content-Type": "application/json",
                },
            )
            self.assertIn(status, (404, 405), method)
        self.assertEqual(self.gh_state.count(), before)

        headers = {
            "Origin": "https://gis.test:8443",
            "Sec-Fetch-Site": "same-origin",
            "Content-Type": "application/json",
        }
        too_many_points = gh_route_body(
            points=[[9.82 + i * 0.001, 44.1] for i in range(21)]
        )
        payload = json.dumps(too_many_points, separators=(",", ":")).encode()
        status, _headers, _body = self.request(
            "POST", "/_routing/gh/route", body=payload, headers=headers
        )
        self.assertEqual(status, 400)
        status, _headers, _body = self.request(
            "POST",
            "/_routing/gh/route",
            body=b"x" * 16385,
            headers=headers,
        )
        self.assertEqual(status, 413)
        self.assertEqual(self.gh_state.count(), before)

    def test_ors_status_is_sanitized_and_has_no_cors_header(self) -> None:
        status, headers, body = self.request(
            "GET",
            "/_routing/ors/status",
            headers={"Origin": "https://gis.test:8443", "Sec-Fetch-Site": "same-origin"},
        )
        data = json.loads(body)
        self.assertEqual(status, 200)
        self.assertEqual(data["status"], "ready")
        self.assertEqual(data["secret"], "PRESENT")
        self.assertEqual(len(data["profiles"]), 3)
        self.assertNotIn("private_field", data)
        self.assertNotIn("access-control-allow-origin", headers)
        self.assertEqual(self.ors_state.last()["accept"], "application/json")
        self.assertIsNone(self.ors_state.last()["origin"])

    def test_ors_non_2xx_body_and_headers_are_suppressed_for_every_route(self) -> None:
        self.ors_state.mode = "error503"
        requests = (
            ("GET", "/_routing/ors/status", None),
            (
                "POST",
                "/_routing/ors/v2/directions/foot-hiking/geojson",
                b'{"synthetic":true}',
            ),
        )
        for method, path, body in requests:
            headers = {}
            if body is not None:
                headers = {
                    "Origin": "https://gis.test:8443",
                    "Sec-Fetch-Site": "same-origin",
                    "Content-Type": "application/json",
                }
            status, response_headers, response_body = self.request(
                method, path, body=body, headers=headers
            )
            self.assertEqual(status, 503)
            self.assertEqual(response_headers["content-type"], "application/json")
            self.assertEqual(
                json.loads(response_body),
                {"error": "ors_upstream_error", "status": 503},
            )
            self.assertNotIn(b"ORS_SECRET_SENTINEL", response_body)
            for name in ("set-cookie", "access-control-allow-origin", "x-private-debug", "location"):
                self.assertNotIn(name, response_headers)
        self.ors_state.mode = "normal"

    def test_ors_active_content_and_unexpected_geojson_fields_are_not_forwarded(self) -> None:
        self.ors_state.mode = "html200"
        status, headers, body = self.request(
            "POST",
            "/_routing/ors/v2/directions/foot-hiking/geojson",
            body=b'{"synthetic":true}',
            headers={
                "Origin": "https://gis.test:8443",
                "Sec-Fetch-Site": "same-origin",
                "Content-Type": "application/json",
            },
        )
        self.assertEqual(status, 502)
        self.assertEqual(headers["content-type"], "application/json")
        self.assertEqual(json.loads(body), {"error": "ors_response_not_json"})
        self.assertNotIn(b"<script>", body)
        self.ors_state.mode = "normal"
        status, headers, body = self.request(
            "POST",
            "/_routing/ors/v2/directions/foot-hiking/geojson",
            body=b'{"synthetic":true}',
            headers={
                "Origin": "https://gis.test:8443",
                "Sec-Fetch-Site": "same-origin",
                "Content-Type": "application/json",
            },
        )
        self.assertEqual(status, 200)
        self.assertEqual(headers["content-type"], "application/json")
        data = json.loads(body)
        self.assertEqual(data["type"], "FeatureCollection")
        self.assertNotIn("private_root_field", data)
        self.assertNotIn("private_field", data["features"][0]["properties"])
        self.assertIn("extras", data["features"][0]["properties"])

    def test_cross_origin_or_missing_post_origin_is_denied_before_upstream(self) -> None:
        body = b'{"synthetic":true}'
        before = self.gh_state.count()
        status, _headers, _body = self.request(
            "POST",
            "/_routing/gh/route",
            body=body,
            headers={"Origin": "https://evil.invalid", "Content-Type": "application/json"},
        )
        self.assertEqual(status, 403)
        self.assertEqual(self.gh_state.count(), before)
        status, _headers, _body = self.request(
            "POST",
            "/_routing/gh/route",
            body=body,
            headers={"Content-Type": "application/json"},
        )
        self.assertEqual(status, 403)
        self.assertEqual(self.gh_state.count(), before)
        status, _headers, _body = self.request(
            "GET",
            "/_routing/gh/info",
            headers={"Sec-Fetch-Site": "cross-site"},
        )
        self.assertEqual(status, 403)
        self.assertEqual(self.gh_state.count(), before)

    def test_host_path_traversal_unknown_routes_and_wrong_methods_are_rejected(self) -> None:
        for path in (
            "/_routing/gh/../../ors/status",
            "/_routing/%2e%2e/ors/status",
            "/_routing%252fgh%252finfo",
            "/%252e%252e/secret",
            "/?path=%252e%252e%252fsecret",
            "/_routing/unknown?url=http%3A%2F%2Fevil.invalid",
            "/_routing/ors/status?extra=1",
        ):
            status, _headers, _body = self.request("GET", path)
            self.assertIn(status, (400, 404))
        status, _headers, _body = self.request(
            "POST",
            "/_routing/ors/status",
            body=b"{}",
            headers={"Origin": "https://gis.test:8443", "Content-Type": "application/json"},
        )
        self.assertEqual(status, 404)
        status, _headers, _body = self.request(
            "GET", "/_routing/gh/info", headers={"Host": "evil.invalid"}
        )
        self.assertEqual(status, 421)
        status, _headers, _body = self.request(
            "OPTIONS", "/_routing/gh/info", headers={"Origin": "https://gis.test:8443"}
        )
        self.assertEqual(status, 405)

    def test_body_type_and_size_limits_are_enforced(self) -> None:
        status, _headers, _body = self.request(
            "POST",
            "/_routing/gh/route",
            body=b"synthetic",
            headers={
                "Origin": "https://gis.test:8443",
                "Content-Type": "text/plain",
            },
        )
        self.assertEqual(status, 415)
        status, _headers, _body = self.request(
            "POST",
            "/_routing/gh/route",
            body=b"x" * 16385,
            headers={
                "Origin": "https://gis.test:8443",
                "Content-Type": "application/json",
            },
        )
        self.assertEqual(status, 413)

    def test_timeout_redirect_and_oversized_response_fail_closed(self) -> None:
        self.gh_state.mode = "slow"
        status, _headers, _body = self.request("GET", "/_routing/gh/info")
        self.assertEqual(status, 504)
        time.sleep(0.27)
        self.gh_state.mode = "large"
        status, _headers, _body = self.request("GET", "/_routing/gh/info")
        self.assertEqual(status, 502)
        self.ors_state.mode = "redirect"
        before = self.ors_state.count()
        status, _headers, _body = self.request("GET", "/_routing/ors/status")
        self.assertEqual(status, 502)
        self.assertEqual(self.ors_state.count(), before + 1)
        self.ors_state.mode = "normal"

    def test_slow_drip_ors_close_response_deadline_and_recovery(self) -> None:
        connections: list[http.client.HTTPConnection] = []

        class RecordingHTTPConnection(http.client.HTTPConnection):
            def getresponse(self) -> http.client.HTTPResponse:
                response = super().getresponse()
                self.response_transport = getattr(
                    getattr(getattr(response, "fp", None), "raw", None), "_sock", None
                )
                self.sock_detached_after_headers = self.sock is None
                return response

        def local_mock_connection(
            _scheme: str, host: str, port: int, timeout: float
        ) -> http.client.HTTPConnection:
            connection = RecordingHTTPConnection(host, port, timeout=timeout)
            connections.append(connection)
            return connection

        slow_server = proxy.create_server(
            "https://gis.test:8443",
            bind_host="127.0.0.1",
            bind_port=0,
            max_connections=1,
            client_timeout_seconds=0.5,
            body_timeout_seconds=0.5,
            header_timeout_seconds=0.5,
            timeout_seconds=0.5,
            response_timeout_seconds=0.12,
            targets=self.targets,
            connection_factory=local_mock_connection,
        )
        threading.Thread(target=slow_server.serve_forever, daemon=True).start()
        self.ors_state.mode = "slow_drip_close"
        try:
            conn = http.client.HTTPConnection("127.0.0.1", slow_server.server_port, timeout=2)
            conn.request(
                "GET",
                "/_routing/ors/status",
                headers={"Host": "gis.test:8443", "Connection": "close"},
            )
            response = conn.getresponse()
            status = response.status
            error_body = response.read()
            conn.close()
            self.assertEqual(status, 504)
            self.assertEqual(json.loads(error_body), {"error": "upstream_timeout"})
            self.assertEqual(len(connections), 1)
            self.assertTrue(connections[0].sock_detached_after_headers)
            self.assertIsNotNone(connections[0].response_transport)

            deadline = time.monotonic() + 1
            while slow_server.active_connections != 0 and time.monotonic() < deadline:
                time.sleep(0.01)
            self.assertEqual(slow_server.active_connections, 0)

            self.ors_state.mode = "normal"
            conn = http.client.HTTPConnection("127.0.0.1", slow_server.server_port, timeout=2)
            conn.request(
                "GET",
                "/_routing/ors/status",
                headers={"Host": "gis.test:8443", "Connection": "close"},
            )
            response = conn.getresponse()
            status = response.status
            response.read()
            conn.close()
            self.assertEqual(status, 200)
        finally:
            self.ors_state.mode = "normal"
            slow_server.shutdown()
            slow_server.server_close()

    def test_slow_drip_ors_tls_response_deadline_with_test_ca(self) -> None:
        pwsh = shutil.which("pwsh")
        if pwsh is None:
            self.skipTest("PowerShell 7 is needed to create an ephemeral TLS test CA")

        with tempfile.TemporaryDirectory(prefix="gis-proxy-tls-test-") as temp_dir:
            test_dir = Path(temp_dir)
            test_dir_ps = "'" + str(test_dir).replace("'", "''") + "'"
            certificate_script = f"""
$ErrorActionPreference = 'Stop'
$root = {test_dir_ps}
$now = [DateTimeOffset]::UtcNow
$caKey = [System.Security.Cryptography.RSA]::Create(2048)
$caRequest = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
    'CN=GIS Proxy Ephemeral Test CA', $caKey,
    [System.Security.Cryptography.HashAlgorithmName]::SHA256,
    [System.Security.Cryptography.RSASignaturePadding]::Pkcs1)
$caRequest.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($true, $true, 1, $true))
$caUsage = [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::KeyCertSign -bor
    [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::CrlSign
$caRequest.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509KeyUsageExtension]::new($caUsage, $true))
$caCertificate = $caRequest.CreateSelfSigned($now.AddMinutes(-2), $now.AddHours(1))

$serverKey = [System.Security.Cryptography.RSA]::Create(2048)
$serverRequest = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
    'CN=localhost', $serverKey,
    [System.Security.Cryptography.HashAlgorithmName]::SHA256,
    [System.Security.Cryptography.RSASignaturePadding]::Pkcs1)
$serverRequest.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($false, $false, 0, $true))
$san = [System.Security.Cryptography.X509Certificates.SubjectAlternativeNameBuilder]::new()
$san.AddDnsName('localhost')
$serverRequest.CertificateExtensions.Add($san.Build())
$serverUsage = [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::DigitalSignature -bor
    [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::KeyEncipherment
$serverRequest.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509KeyUsageExtension]::new($serverUsage, $true))
$eku = [System.Security.Cryptography.OidCollection]::new()
[void]$eku.Add([System.Security.Cryptography.Oid]::new('1.3.6.1.5.5.7.3.1'))
$serverRequest.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509EnhancedKeyUsageExtension]::new($eku, $true))
$serial = [byte[]](1, 2, 3, 4, 5, 6, 7, 8)
$serverPublicCertificate = $serverRequest.Create(
    $caCertificate, $now.AddMinutes(-2), $now.AddHours(1), $serial)
$serverCertificate = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::CopyWithPrivateKey(
    $serverPublicCertificate, $serverKey)
[System.IO.File]::WriteAllText((Join-Path $root 'test-ca.pem'), $caCertificate.ExportCertificatePem())
[System.IO.File]::WriteAllText((Join-Path $root 'server-cert.pem'), $serverCertificate.ExportCertificatePem())
[System.IO.File]::WriteAllText((Join-Path $root 'server-key.pem'), $serverKey.ExportPkcs8PrivateKeyPem())
$serverCertificate.Dispose()
$serverPublicCertificate.Dispose()
$caCertificate.Dispose()
$serverKey.Dispose()
$caKey.Dispose()
"""
            try:
                subprocess.run(
                    [pwsh, "-NoLogo", "-NoProfile", "-NonInteractive", "-Command", certificate_script],
                    check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                )
            except subprocess.CalledProcessError as error:
                self.fail(f"ephemeral TLS test certificate generation failed: {error.stderr}")

            ca_file = test_dir / "test-ca.pem"
            certificate_file = test_dir / "server-cert.pem"
            key_file = test_dir / "server-key.pem"
            server_tls = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            server_tls.load_cert_chain(str(certificate_file), str(key_file))
            trusted_test_client = ssl.create_default_context(cafile=str(ca_file))
            self.assertTrue(trusted_test_client.check_hostname)
            self.assertEqual(trusted_test_client.verify_mode, ssl.CERT_REQUIRED)
            test_state = {"mode": "slow_drip"}

            class TLSHandler(BaseHTTPRequestHandler):
                protocol_version = "HTTP/1.1"

                def log_message(self, _format: str, *args: object) -> None:
                    return

                def do_GET(self) -> None:
                    if self.path != "/ors/status":
                        self.send_error(404)
                        return
                    payload = (
                        b'{"status":"ready","secret":"PRESENT"}'
                        if test_state["mode"] == "slow_drip"
                        else b'{"status":"ready","secret":"PRESENT","profiles":["foot-hiking"]}'
                    )
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Content-Length", str(len(payload)))
                    self.send_header("Connection", "close")
                    self.end_headers()
                    if test_state["mode"] == "slow_drip":
                        try:
                            for byte in payload:
                                self.wfile.write(bytes([byte]))
                                self.wfile.flush()
                                time.sleep(0.04)
                        except (OSError, ssl.SSLError):
                            return
                    else:
                        self.wfile.write(payload)

            class TLSThreadingHTTPServer(ThreadingHTTPServer):
                def get_request(self) -> tuple[socket.socket, object]:
                    request, client_address = super().get_request()
                    try:
                        return server_tls.wrap_socket(request, server_side=True), client_address
                    except OSError:
                        request.close()
                        raise

            tls_upstream = TLSThreadingHTTPServer(("127.0.0.1", 0), TLSHandler)
            tls_upstream.daemon_threads = True
            threading.Thread(target=tls_upstream.serve_forever, daemon=True).start()

            connections: list[http.client.HTTPSConnection] = []

            class RecordingHTTPSConnection(http.client.HTTPSConnection):
                def getresponse(self) -> http.client.HTTPResponse:
                    response = super().getresponse()
                    self.response_transport = getattr(
                        getattr(getattr(response, "fp", None), "raw", None), "_sock", None
                    )
                    self.sock_detached_after_headers = self.sock is None
                    return response

            def verified_test_connection(
                scheme: str, host: str, port: int, timeout: float
            ) -> http.client.HTTPConnection:
                if scheme == "https":
                    connection = RecordingHTTPSConnection(
                        host, port, timeout=timeout, context=trusted_test_client
                    )
                    connections.append(connection)
                    return connection
                return http.client.HTTPConnection(host, port, timeout=timeout)

            targets = dict(self.targets)
            targets["ors"] = ("https", "localhost", tls_upstream.server_port)
            slow_server = proxy.create_server(
                "https://gis.test:8443",
                bind_host="127.0.0.1",
                bind_port=0,
                max_connections=1,
                client_timeout_seconds=0.5,
                body_timeout_seconds=0.5,
                header_timeout_seconds=0.5,
                timeout_seconds=0.5,
                response_timeout_seconds=0.12,
                targets=targets,
                connection_factory=verified_test_connection,
            )
            threading.Thread(target=slow_server.serve_forever, daemon=True).start()
            try:
                conn = http.client.HTTPConnection("127.0.0.1", slow_server.server_port, timeout=2)
                conn.request(
                    "GET",
                    "/_routing/ors/status",
                    headers={"Host": "gis.test:8443", "Connection": "close"},
                )
                response = conn.getresponse()
                status = response.status
                error_body = response.read()
                conn.close()
                self.assertEqual(status, 504)
                self.assertEqual(json.loads(error_body), {"error": "upstream_timeout"})
                self.assertEqual(len(connections), 1)
                self.assertTrue(connections[0].sock_detached_after_headers)
                self.assertIsInstance(connections[0].response_transport, ssl.SSLSocket)

                deadline = time.monotonic() + 1
                while slow_server.active_connections != 0 and time.monotonic() < deadline:
                    time.sleep(0.01)
                self.assertEqual(slow_server.active_connections, 0)

                test_state["mode"] = "normal"
                conn = http.client.HTTPConnection("127.0.0.1", slow_server.server_port, timeout=2)
                conn.request(
                    "GET",
                    "/_routing/ors/status",
                    headers={"Host": "gis.test:8443", "Connection": "close"},
                )
                response = conn.getresponse()
                status = response.status
                data = json.loads(response.read())
                conn.close()
                self.assertEqual(status, 200)
                self.assertEqual(data["status"], "ready")
                self.assertEqual(data["secret"], "PRESENT")
            finally:
                slow_server.shutdown()
                slow_server.server_close()
                tls_upstream.shutdown()
                tls_upstream.server_close()

    def test_production_configuration_rejects_plain_http_ors(self) -> None:
        bad_targets = dict(self.targets)
        bad_targets["ors"] = ("http", "127.0.0.1", self.ors.server_port)
        with self.assertRaisesRegex(ValueError, "ORS upstream must use HTTPS"):
            proxy.create_server(
                "https://gis.test:8443",
                bind_host="127.0.0.1",
                bind_port=0,
                targets=bad_targets,
            )

    def test_slow_headers_are_timed_out_before_bounded_worker_creation(self) -> None:
        def local_mock_connection(
            _scheme: str, host: str, port: int, timeout: float
        ) -> http.client.HTTPConnection:
            return http.client.HTTPConnection(host, port, timeout=timeout)

        slow_server = proxy.create_server(
            "https://gis.test:8443",
            bind_host="127.0.0.1",
            bind_port=0,
            max_connections=1,
            client_timeout_seconds=0.12,
            targets=self.targets,
            timeout_seconds=0.05,
            connection_factory=local_mock_connection,
        )
        threading.Thread(target=slow_server.serve_forever, daemon=True).start()
        partial = b"GET /_routing/gh/info HTTP/1.1\r\nHost: gis.test:8443\r\nX-Slow:"
        first = socket.create_connection(("127.0.0.1", slow_server.server_port), timeout=1)
        second = socket.create_connection(("127.0.0.1", slow_server.server_port), timeout=1)
        try:
            first.sendall(partial)
            deadline = time.monotonic() + 1
            while slow_server.active_connections == 0 and time.monotonic() < deadline:
                time.sleep(0.01)
            self.assertEqual(slow_server.active_connections, 1)
            second.settimeout(0.5)
            try:
                second.sendall(partial)
                second_data = second.recv(1)
                self.assertEqual(second_data, b"")
            except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
                # Windows may report the close as a reset instead of returning EOF.
                pass
            self.assertEqual(slow_server.active_connections, 1)
            time.sleep(0.2)
            self.assertEqual(slow_server.active_connections, 0)
            first.settimeout(0.5)
            self.assertEqual(first.recv(1), b"")
            conn = http.client.HTTPConnection("127.0.0.1", slow_server.server_port, timeout=1)
            conn.request(
                "GET",
                "/_routing/gh/info",
                headers={"Host": "gis.test:8443", "Connection": "close"},
            )
            response = conn.getresponse()
            status = response.status
            response.read()
            conn.close()
            self.assertEqual(status, 200)
        finally:
            first.close()
            second.close()
            slow_server.shutdown()
            slow_server.server_close()

    def test_slow_body_has_total_deadline_and_releases_worker_slot(self) -> None:
        def local_mock_connection(
            _scheme: str, host: str, port: int, timeout: float
        ) -> http.client.HTTPConnection:
            return http.client.HTTPConnection(host, port, timeout=timeout)

        slow_server = proxy.create_server(
            "https://gis.test:8443",
            bind_host="127.0.0.1",
            bind_port=0,
            max_connections=1,
            client_timeout_seconds=0.5,
            body_timeout_seconds=0.22,
            targets=self.targets,
            timeout_seconds=0.05,
            connection_factory=local_mock_connection,
        )
        threading.Thread(target=slow_server.serve_forever, daemon=True).start()
        slow = socket.create_connection(("127.0.0.1", slow_server.server_port), timeout=1)
        body = b'{"x":1}'
        request_head = (
            b"POST /_routing/gh/route HTTP/1.1\r\n"
            b"Host: gis.test:8443\r\n"
            b"Origin: https://gis.test:8443\r\n"
            b"Sec-Fetch-Site: same-origin\r\n"
            b"Content-Type: application/json\r\n"
            b"Content-Length: 7\r\n\r\n"
        )
        upstream_calls_before = self.gh_state.count()
        try:
            slow.sendall(request_head + body[:1])
            deadline = time.monotonic() + 1
            while slow_server.active_connections == 0 and time.monotonic() < deadline:
                time.sleep(0.01)
            self.assertEqual(slow_server.active_connections, 1)

            # The next byte arrives within the 0.5 s idle timeout, but then the
            # connection stays active longer than the 0.22 s total body deadline.
            time.sleep(0.12)
            slow.sendall(body[1:2])
            time.sleep(0.15)

            slow.settimeout(1)
            response = slow.recv(4096)
            self.assertIn(b" 408 ", response.split(b"\r\n", 1)[0])
            deadline = time.monotonic() + 1
            while slow_server.active_connections != 0 and time.monotonic() < deadline:
                time.sleep(0.01)
            self.assertEqual(slow_server.active_connections, 0)
            self.assertEqual(self.gh_state.count(), upstream_calls_before)

            conn = http.client.HTTPConnection("127.0.0.1", slow_server.server_port, timeout=1)
            conn.request(
                "GET",
                "/_routing/gh/info",
                headers={"Host": "gis.test:8443", "Connection": "close"},
            )
            response = conn.getresponse()
            status = response.status
            response.read()
            conn.close()
            self.assertEqual(status, 200)
        finally:
            slow.close()
            slow_server.shutdown()
            slow_server.server_close()

    def test_slow_headers_have_total_deadline_and_valid_headers_recover(self) -> None:
        def local_mock_connection(
            _scheme: str, host: str, port: int, timeout: float
        ) -> http.client.HTTPConnection:
            return http.client.HTTPConnection(host, port, timeout=timeout)

        slow_server = proxy.create_server(
            "https://gis.test:8443",
            bind_host="127.0.0.1",
            bind_port=0,
            max_connections=1,
            client_timeout_seconds=0.5,
            header_timeout_seconds=0.22,
            body_timeout_seconds=0.5,
            targets=self.targets,
            timeout_seconds=0.05,
            connection_factory=local_mock_connection,
        )
        threading.Thread(target=slow_server.serve_forever, daemon=True).start()
        slow = socket.create_connection(("127.0.0.1", slow_server.server_port), timeout=1)
        upstream_calls_before = self.gh_state.count()
        try:
            slow.sendall(b"GET /_routing/gh/info HTTP/1.1\r\nHost:")
            deadline = time.monotonic() + 1
            while slow_server.active_connections == 0 and time.monotonic() < deadline:
                time.sleep(0.01)
            self.assertEqual(slow_server.active_connections, 1)
            time.sleep(0.12)
            slow.sendall(b" gis.test:8443\r\nX-Slow: x\r\n")
            # Both drips are within the 0.5 s socket idle timeout; the overall
            # header deadline has expired at 0.22 s from request parsing start.
            time.sleep(0.15)
            slow.settimeout(0.2)
            try:
                slow_data = slow.recv(1)
                self.assertEqual(slow_data, b"")
            except (ConnectionAbortedError, ConnectionResetError):
                pass
            except socket.timeout:
                self.fail("total header deadline did not close the slow request")

            deadline = time.monotonic() + 0.5
            while slow_server.active_connections != 0 and time.monotonic() < deadline:
                time.sleep(0.01)
            self.assertEqual(slow_server.active_connections, 0)
            self.assertEqual(self.gh_state.count(), upstream_calls_before)

            # A complete valid request on the same listener still reaches GH.
            conn = http.client.HTTPConnection("127.0.0.1", slow_server.server_port, timeout=1)
            conn.request(
                "GET",
                "/_routing/gh/info",
                headers={"Host": "gis.test:8443", "Connection": "close"},
            )
            response = conn.getresponse()
            status = response.status
            response.read()
            conn.close()
            self.assertEqual(status, 200)
        finally:
            slow.close()
            slow_server.shutdown()
            slow_server.server_close()


if __name__ == "__main__":
    unittest.main(verbosity=2)
