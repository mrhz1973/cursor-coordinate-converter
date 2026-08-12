# Synthetic unit tests for goi_dflight_helper (no real D-Flight data, no network by default).

from __future__ import annotations

import json
import os
import sys
import tempfile
import threading
import time
import unittest
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from unittest import mock
from urllib.error import HTTPError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import goi_dflight_helper as h  # noqa: E402

FIXTURES = Path(__file__).resolve().parent / "fixtures"
EXAMPLE_PEM = ROOT / "csrf-public.pem.example"


def _load_fixture(name: str) -> dict:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def _start_httpd(helper: h.DFlightHelper):
    handler_cls = h.make_handler(helper)
    httpd = h.HelperHTTPServer(("127.0.0.1", 0), handler_cls, helper)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd, thread


def _stop_httpd(httpd, thread) -> None:
    httpd.shutdown()
    httpd.server_close()
    thread.join(timeout=5)


def _http_json(url: str, *, method: str = "GET", headers: Optional[dict] = None, data: bytes | None = None):
    req = Request(url, data=data, headers=headers or {}, method=method)
    try:
        resp = urlopen(req, timeout=3)
        try:
            body = resp.read()
            return resp.status, dict(resp.headers), body
        finally:
            resp.close()
    except HTTPError as exc:
        try:
            body = exc.read()
            return exc.code, dict(exc.headers or {}), body
        finally:
            exc.close()


def _write_min_config(tmpdir: Path, *, host: str = "127.0.0.1", port: int = 0, allowlist=None) -> Path:
    state_dir = tmpdir / "state"
    state_dir.mkdir(parents=True, exist_ok=True)
    pem = tmpdir / "csrf.pem"
    pem.write_text(EXAMPLE_PEM.read_text(encoding="utf-8"), encoding="utf-8")
    cfg = tmpdir / "config.toml"
    allow = allowlist if allowlist is not None else []
    allow_toml = "[" + ", ".join(f'"{x}"' for x in allow) + "]"
    cfg.write_text(
        f"""
[dflight]
token_url = "https://example.test/auth-iam/token"
refresh_url = "https://example.test/auth-iam/token/refresh"
preflight_url = "https://example.test/api-gateway/pre-flight"
wfs_url = "https://example.test/maps/wms"
client_id = "web-app"
scope = "openid email profile user-data personal-data pilot-license dflight-identification"
typename = "D-FLIGHT:NO_FLY_ZONE"
output_format = "application/json"
srs_name = "EPSG:4326"
timeout_sec = 5
byte_cap = 26214400
feature_cap = 5000
csrf_public_key_path = "{pem.as_posix()}"
openssl_path = "/usr/bin/openssl"

[server]
host = "{host}"
port = {port if port else 18010}
cooldown_sec = 300
origin_allowlist = {allow_toml}

[cache]
state_dir = "{state_dir.as_posix()}"
""",
        encoding="utf-8",
    )
    return cfg


class TestConfigCredentials(unittest.TestCase):
    def test_config_parser(self):
        with tempfile.TemporaryDirectory() as td:
            cfg_path = _write_min_config(Path(td))
            cfg = h.load_config(cfg_path)
            self.assertEqual(cfg["dflight"]["client_id"], "web-app")
            self.assertEqual(cfg["server"]["host"], "127.0.0.1")

    def test_reject_wildcard_bind(self):
        with tempfile.TemporaryDirectory() as td:
            cfg_path = _write_min_config(Path(td), host="0.0.0.0")
            with self.assertRaises(h.HelperError):
                h.load_config(cfg_path)

    def test_credential_loader(self):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td)
            (p / "dflight_username").write_text("user1\n", encoding="utf-8")
            (p / "dflight_password").write_text("s3cret", encoding="utf-8")
            with mock.patch.dict(os.environ, {"CREDENTIALS_DIRECTORY": str(p)}):
                u, pw = h.load_credentials()
            self.assertEqual(u, "user1")
            self.assertEqual(pw, "s3cret")

    def test_config_has_no_password_fields(self):
        text = (ROOT / "config.example.toml").read_text(encoding="utf-8").lower()
        self.assertNotIn("client_secret", text)
        self.assertNotIn("dflight_password", text)
        self.assertNotRegex(text, r"(?m)^\s*password\s*=")
        self.assertNotRegex(text, r"(?m)^\s*username\s*=")


class TestViewparamsWfs(unittest.TestCase):
    def test_viewparams_utc_exact(self):
        dt = datetime(2026, 8, 11, 21, 0, 33, tzinfo=timezone.utc)
        vp = h.build_viewparams(dt)
        self.assertEqual(vp, "start_nfz:2026-08-11T21:00;end_nfz:9999-12-31T00:00;")

    def test_wfs_query_builder(self):
        url = h.build_wfs_url(
            wfs_url="https://example.test/maps/wms",
            typename="D-FLIGHT:NO_FLY_ZONE",
            output_format="application/json",
            srs_name="EPSG:4326",
            viewparams="start_nfz:2026-08-11T21:00;end_nfz:9999-12-31T00:00;",
        )
        self.assertIn("service=WFS", url)
        self.assertIn("version=1.1.0", url)
        self.assertIn("request=GetFeature", url)
        self.assertIn("typename=D-FLIGHT%3ANO_FLY_ZONE", url)
        self.assertIn("srsname=EPSG%3A4326", url)
        self.assertIn("viewparams=", url)


class TestValidation(unittest.TestCase):
    def setUp(self):
        with tempfile.TemporaryDirectory() as td:
            self._td = td
        self.tmp = Path(tempfile.mkdtemp())
        self.cfg = h.load_config(_write_min_config(self.tmp))

    def tearDown(self):
        import shutil
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_valid(self):
        fc = _load_fixture("valid_small.json")
        info = h.validate_feature_collection(fc, cfg=self.cfg, byte_count=100)
        self.assertEqual(info["feature_count"], 2)

    def test_empty_fail(self):
        fc = _load_fixture("invalid_empty.json")
        with self.assertRaises(h.HelperError) as cm:
            h.validate_feature_collection(fc, cfg=self.cfg, byte_count=10)
        self.assertEqual(cm.exception.category, "empty")

    def test_missing_id_fail(self):
        fc = _load_fixture("invalid_missing_id.json")
        with self.assertRaises(h.HelperError):
            h.validate_feature_collection(fc, cfg=self.cfg, byte_count=10)

    def test_duplicate_id_fail(self):
        fc = _load_fixture("invalid_duplicate_id.json")
        with self.assertRaises(h.HelperError) as cm:
            h.validate_feature_collection(fc, cfg=self.cfg, byte_count=10)
        self.assertIn("duplicate", str(cm.exception))

    def test_invalid_geometry_fail(self):
        fc = _load_fixture("valid_small.json")
        fc["features"][0]["geometry"]["type"] = "Point"
        with self.assertRaises(h.HelperError):
            h.validate_feature_collection(fc, cfg=self.cfg, byte_count=10)

    def test_nan_fail(self):
        fc = _load_fixture("valid_small.json")
        fc["features"][0]["geometry"]["coordinates"][0][0][0] = float("nan")
        with self.assertRaises(h.HelperError):
            h.validate_feature_collection(fc, cfg=self.cfg, byte_count=10)

    def test_range_fail(self):
        fc = _load_fixture("valid_small.json")
        fc["features"][0]["geometry"]["coordinates"][0][0] = [179.0, 44.0]
        with self.assertRaises(h.HelperError):
            h.validate_feature_collection(fc, cfg=self.cfg, byte_count=10)

    def test_feature_cap_fail(self):
        self.cfg["dflight"]["feature_cap"] = 1
        fc = _load_fixture("valid_small.json")
        with self.assertRaises(h.HelperError) as cm:
            h.validate_feature_collection(fc, cfg=self.cfg, byte_count=10)
        self.assertEqual(cm.exception.category, "cap")


class TestCanonicalHash(unittest.TestCase):
    def test_stable_reorder_timestamp_fid(self):
        fc = _load_fixture("valid_small.json")
        sha1 = h.canonical_sha256(fc)
        fc2 = json.loads(json.dumps(fc))
        fc2["features"] = list(reversed(fc2["features"]))
        fc2["timeStamp"] = "2099-01-01T00:00:00.000Z"
        fc2["features"][0]["id"] = "NO_FLY_ZONE.fid-ZZZ"
        fc2["features"][1]["id"] = "NO_FLY_ZONE.fid-YYY"
        # also reorder property keys
        props = fc2["features"][0]["properties"]
        fc2["features"][0]["properties"] = {k: props[k] for k in sorted(props.keys(), reverse=True)}
        sha2 = h.canonical_sha256(fc2)
        self.assertEqual(sha1, sha2)

    def test_changes_with_geometry(self):
        fc = _load_fixture("valid_small.json")
        sha1 = h.canonical_sha256(fc)
        fc2 = json.loads(json.dumps(fc))
        fc2["features"][0]["geometry"]["coordinates"][0][1][0] = 9.15
        self.assertNotEqual(sha1, h.canonical_sha256(fc2))

    def test_changes_with_property(self):
        fc = _load_fixture("valid_small.json")
        changed = _load_fixture("changed_small.json")
        self.assertNotEqual(h.canonical_sha256(fc), h.canonical_sha256(changed))


class TestCache(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.cfg_path = _write_min_config(self.tmp)
        self.cfg = h.load_config(self.cfg_path)
        self.store = h.CacheStore(Path(self.cfg["cache"]["state_dir"]), self.cfg)

    def tearDown(self):
        import shutil
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_first_write_and_unchanged(self):
        fc = _load_fixture("valid_small.json")
        raw = json.dumps(fc).encode("utf-8")
        info = h.validate_feature_collection(fc, cfg=self.cfg, byte_count=len(raw))
        sha = h.canonical_sha256(fc)
        r1 = self.store.apply_refresh_result(fc=fc, raw=raw, sha=sha, info=info, unchanged=False)
        self.assertEqual(r1["result"], "READY_CHANGED")
        self.assertTrue(self.store.current_path.is_file())
        mtime1 = self.store.current_path.stat().st_mtime_ns
        time.sleep(0.02)
        r2 = self.store.apply_refresh_result(fc=fc, raw=raw, sha=sha, info=info, unchanged=True)
        self.assertEqual(r2["result"], "READY_UNCHANGED")
        self.assertEqual(self.store.current_path.stat().st_mtime_ns, mtime1)

    def test_changed_preserves_previous(self):
        fc = _load_fixture("valid_small.json")
        raw = json.dumps(fc).encode("utf-8")
        info = h.validate_feature_collection(fc, cfg=self.cfg, byte_count=len(raw))
        sha = h.canonical_sha256(fc)
        self.store.apply_refresh_result(fc=fc, raw=raw, sha=sha, info=info, unchanged=False)
        changed = _load_fixture("changed_small.json")
        raw2 = json.dumps(changed).encode("utf-8")
        info2 = h.validate_feature_collection(changed, cfg=self.cfg, byte_count=len(raw2))
        sha2 = h.canonical_sha256(changed)
        self.store.apply_refresh_result(fc=changed, raw=raw2, sha=sha2, info=info2, unchanged=False)
        prev = json.loads(self.store.previous_path.read_text(encoding="utf-8"))
        self.assertEqual(h.canonical_sha256(prev), sha)

    def test_malformed_non_replace(self):
        fc = _load_fixture("valid_small.json")
        raw = json.dumps(fc).encode("utf-8")
        info = h.validate_feature_collection(fc, cfg=self.cfg, byte_count=len(raw))
        sha = h.canonical_sha256(fc)
        self.store.apply_refresh_result(fc=fc, raw=raw, sha=sha, info=info, unchanged=False)
        before = self.store.current_path.read_bytes()
        bad = _load_fixture("invalid_duplicate_id.json")
        with self.assertRaises(h.HelperError):
            h.validate_feature_collection(bad, cfg=self.cfg, byte_count=10)
        self.assertEqual(self.store.current_path.read_bytes(), before)

    def test_startup_meta_recovery(self):
        fc = _load_fixture("valid_small.json")
        raw = json.dumps(fc).encode("utf-8")
        self.store.current_path.write_bytes(raw)
        if self.store.current_meta_path.exists():
            self.store.current_meta_path.unlink()
        out_fc, out_meta = self.store.startup_consistency()
        self.assertIsNotNone(out_fc)
        self.assertIsNotNone(out_meta)
        self.assertEqual(out_meta["canonical_sha256"], h.canonical_sha256(fc))

    def test_rollback(self):
        fc = _load_fixture("valid_small.json")
        changed = _load_fixture("changed_small.json")
        for obj, flag in ((fc, False), (changed, False)):
            raw = json.dumps(obj).encode("utf-8")
            info = h.validate_feature_collection(obj, cfg=self.cfg, byte_count=len(raw))
            sha = h.canonical_sha256(obj)
            self.store.apply_refresh_result(fc=obj, raw=raw, sha=sha, info=info, unchanged=False)
        sha_first = h.canonical_sha256(fc)
        result = self.store.rollback()
        self.assertEqual(result["canonical_sha256"], sha_first)

    def test_read_current_meta_coherent(self):
        fc = _load_fixture("valid_small.json")
        raw = json.dumps(fc).encode("utf-8")
        info = h.validate_feature_collection(fc, cfg=self.cfg, byte_count=len(raw))
        sha = h.canonical_sha256(fc)
        self.store.apply_refresh_result(fc=fc, raw=raw, sha=sha, info=info, unchanged=False)
        # Stale meta on disk
        self.store.current_meta_path.write_text(
            json.dumps({"canonical_sha256": "deadbeef", "feature_count": 99}),
            encoding="utf-8",
        )
        out_fc, out_meta, _ = self.store.read_current()
        self.assertIsNotNone(out_fc)
        self.assertEqual(out_meta["canonical_sha256"], sha)
        self.assertEqual(out_meta["feature_count"], 2)

    def test_startup_meta_mismatch_rebuild(self):
        fc = _load_fixture("valid_small.json")
        raw = json.dumps(fc).encode("utf-8")
        self.store.current_path.write_bytes(raw)
        self.store.current_meta_path.write_text(
            json.dumps({"canonical_sha256": "mismatch", "feature_count": 1}),
            encoding="utf-8",
        )
        out_fc, out_meta = self.store.startup_consistency()
        self.assertEqual(out_meta["canonical_sha256"], h.canonical_sha256(fc))

    def test_rollback_rebuilds_stale_previous_meta(self):
        fc = _load_fixture("valid_small.json")
        changed = _load_fixture("changed_small.json")
        for obj in (fc, changed):
            raw = json.dumps(obj).encode("utf-8")
            info = h.validate_feature_collection(obj, cfg=self.cfg, byte_count=len(raw))
            sha = h.canonical_sha256(obj)
            self.store.apply_refresh_result(fc=obj, raw=raw, sha=sha, info=info, unchanged=False)
        # Corrupt previous.meta while previous.json remains valid
        self.store.previous_meta_path.write_text(
            json.dumps({"canonical_sha256": "stale-prev", "feature_count": 0}),
            encoding="utf-8",
        )
        result = self.store.rollback()
        self.assertEqual(result["canonical_sha256"], h.canonical_sha256(fc))
        cur_fc, cur_meta, _ = self.store.read_current()
        self.assertEqual(cur_meta["canonical_sha256"], h.canonical_sha256(fc))
        self.assertEqual(h.canonical_sha256(cur_fc), h.canonical_sha256(fc))

    def test_changed_refresh_keeps_current_previous_coherent(self):
        fc = _load_fixture("valid_small.json")
        changed = _load_fixture("changed_small.json")
        raw = json.dumps(fc).encode("utf-8")
        info = h.validate_feature_collection(fc, cfg=self.cfg, byte_count=len(raw))
        sha = h.canonical_sha256(fc)
        self.store.apply_refresh_result(fc=fc, raw=raw, sha=sha, info=info, unchanged=False)
        raw2 = json.dumps(changed).encode("utf-8")
        info2 = h.validate_feature_collection(changed, cfg=self.cfg, byte_count=len(raw2))
        sha2 = h.canonical_sha256(changed)
        self.store.apply_refresh_result(fc=changed, raw=raw2, sha=sha2, info=info2, unchanged=False)
        cur_fc, cur_meta, _ = self.store.read_current()
        self.assertEqual(cur_meta["canonical_sha256"], sha2)
        self.assertEqual(h.canonical_sha256(cur_fc), sha2)
        prev = json.loads(self.store.previous_path.read_text(encoding="utf-8"))
        prev_meta = json.loads(self.store.previous_meta_path.read_text(encoding="utf-8"))
        self.assertEqual(prev_meta["canonical_sha256"], h.canonical_sha256(prev))
        self.assertEqual(prev_meta["canonical_sha256"], sha)


class TestContentType(unittest.TestCase):
    def test_json_ok(self):
        self.assertTrue(h.is_json_content_type("application/json"))

    def test_json_charset_ok(self):
        self.assertTrue(h.is_json_content_type("application/json; charset=utf-8"))

    def test_geojson_ok(self):
        self.assertTrue(h.is_json_content_type("application/geo+json"))

    def test_missing_fail(self):
        self.assertFalse(h.is_json_content_type(None))
        self.assertFalse(h.is_json_content_type(""))

    def test_html_fail(self):
        self.assertFalse(h.is_json_content_type("text/html"))
        self.assertFalse(h.is_json_content_type("image/png"))


class FakeAuth(h.AuthClient):
    def __init__(self, cfg):
        super().__init__(cfg, lambda: ("u", "p"))
        self.tokens.access_token = "access-token-synthetic"
        self.tokens.refresh_token = "refresh-token-synthetic"
        self.tokens.access_expires_at = time.monotonic() + 1000
        self.tokens.refresh_expires_at = time.monotonic() + 2000
        self.force_calls = 0

    def ensure_access_token(self) -> str:
        return "access-token-synthetic"

    def force_reauth(self) -> str:
        self.force_calls += 1
        return "access-token-synthetic-2"


class TestHelperApi(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.cfg = h.load_config(_write_min_config(self.tmp, port=18011))
        self.auth = FakeAuth(self.cfg)
        self.helper = h.DFlightHelper(self.cfg, auth_client=self.auth)
        self.valid = _load_fixture("valid_small.json")
        self.valid_raw = json.dumps(self.valid).encode("utf-8")

    def tearDown(self):
        import shutil
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_status_empty(self):
        payload = self.helper.status_payload()
        self.assertEqual(payload["status"], h.STATUS_EMPTY)
        self.assertFalse(payload["dataset_available"])
        self.assertNotIn("password", json.dumps(payload))
        self.assertNotIn("access-token", json.dumps(payload))

    def test_status_ready_and_stale(self):
        info = h.validate_feature_collection(self.valid, cfg=self.cfg, byte_count=len(self.valid_raw))
        sha = h.canonical_sha256(self.valid)
        self.helper.cache.apply_refresh_result(
            fc=self.valid, raw=self.valid_raw, sha=sha, info=info, unchanged=False
        )
        self.helper.current_fc = self.valid
        self.helper.current_meta = self.helper.cache._read_json_file(self.helper.cache.current_meta_path)
        self.helper._api_status = h.STATUS_READY
        self.assertEqual(self.helper.status_payload()["status"], h.STATUS_READY)
        self.helper._last_error_category = "http"
        self.helper._api_status = h.STATUS_STALE
        self.assertEqual(self.helper.status_payload()["status"], h.STATUS_STALE)
        self.assertTrue(self.helper.status_payload()["dataset_available"])

    def test_origin_policy(self):
        self.assertTrue(h.origin_allowed(None, []))
        self.assertTrue(h.origin_allowed("", []))
        self.assertFalse(h.origin_allowed("http://evil.example", []))
        self.assertTrue(h.origin_allowed("http://gis.example", ["http://gis.example"]))

    def test_auth_form_builder(self):
        body = h.build_password_grant_body(
            client_id="web-app",
            scope="openid email",
            username="UserName",
            password="x",
        )
        self.assertIn("grant_type=password", body)
        self.assertIn("client_id=web-app", body)
        self.assertIn("username=username", body)
        self.assertNotIn("client_secret", body)

    def test_refresh_busy_does_not_consume_cooldown(self):
        state = self.helper.cache.load_state()
        state["last_attempt_at"] = None
        self.helper.cache.save_state(state)
        self.helper._refresh_lock.acquire()
        with self.assertRaises(h.HelperError) as cm:
            self.helper.refresh()
        self.assertEqual(cm.exception.category, "busy")
        self.helper._refresh_lock.release()
        self.assertIsNone(self.helper.cache.load_state().get("last_attempt_at"))
        self.assertEqual(self.helper.cooldown_remaining(), 0)

    def test_failed_refresh_triggers_cooldown(self):
        with mock.patch.object(
            h, "http_get_bytes_capped", side_effect=h.HelperError("network", "down")
        ):
            with self.assertRaises(h.HelperError) as cm:
                self.helper.refresh()
            self.assertEqual(cm.exception.category, "network")
        self.assertGreater(self.helper.cooldown_remaining(), 0)
        attempt = self.helper.cache.load_state()["last_attempt_at"]
        with self.assertRaises(h.HelperError) as cm2:
            self.helper.refresh()
        self.assertEqual(cm2.exception.category, "cooldown")
        self.assertEqual(self.helper.cache.load_state()["last_attempt_at"], attempt)

    def test_successful_refresh_triggers_cooldown(self):
        def fake_get(url, *, timeout, headers=None, byte_cap):
            return 200, {"content-type": "application/json"}, self.valid_raw

        with mock.patch.object(h, "http_get_bytes_capped", side_effect=fake_get):
            self.helper.refresh()
        self.assertGreater(self.helper.cooldown_remaining(), 0)
        with self.assertRaises(h.HelperError) as cm:
            self.helper.refresh()
        self.assertEqual(cm.exception.category, "cooldown")

    def test_cooldown_reject_does_not_reset_timer(self):
        state = self.helper.cache.load_state()
        state["last_attempt_at"] = h._utc_now_iso()
        self.helper.cache.save_state(state)
        first_rem = self.helper.cooldown_remaining()
        time.sleep(0.05)
        with self.assertRaises(h.HelperError) as cm:
            self.helper.refresh()
        self.assertEqual(cm.exception.category, "cooldown")
        # Timer not reset to full window
        self.assertLessEqual(self.helper.cooldown_remaining(), first_rem)
        self.assertEqual(self.helper.cache.load_state()["last_attempt_at"], state["last_attempt_at"])

    def test_wfs_content_type_fail_closed(self):
        cases = [
            ({}, False),
            ({"content-type": "text/html"}, False),
            ({"content-type": "application/json"}, True),
            ({"content-type": "application/json; charset=utf-8"}, True),
        ]
        for headers, ok in cases:
            self.helper = h.DFlightHelper(self.cfg, auth_client=FakeAuth(self.cfg))
            state = self.helper.cache.load_state()
            state["last_attempt_at"] = None
            self.helper.cache.save_state(state)

            def fake_get(url, *, timeout, headers=None, byte_cap, _hdrs=headers):
                return 200, _hdrs, self.valid_raw

            with mock.patch.object(h, "http_get_bytes_capped", side_effect=fake_get):
                if ok:
                    self.helper.refresh()
                else:
                    with self.assertRaises(h.HelperError) as cm:
                        self.helper.refresh()
                    self.assertEqual(cm.exception.category, "validation")

    def test_refresh_mocked_wfs_and_dataset_headers(self):
        def fake_get(url, *, timeout, headers=None, byte_cap):
            self.assertIn("Authorization", headers or {})
            self.assertTrue((headers or {})["Authorization"].startswith("Bearer "))
            return 200, {"content-type": "application/json"}, self.valid_raw

        with mock.patch.object(h, "http_get_bytes_capped", side_effect=fake_get):
            state = self.helper.cache.load_state()
            state["last_attempt_at"] = None
            self.helper.cache.save_state(state)
            result = self.helper.refresh()
        self.assertTrue(result["refreshed"])
        self.assertIn(result["status"], ("READY_CHANGED", "READY_UNCHANGED"))

        httpd, thread = _start_httpd(self.helper)
        port = httpd.server_address[1]
        try:
            status, headers, body = _http_json(f"http://127.0.0.1:{port}/status")
            self.assertEqual(status, 200)
            self.assertEqual(json.loads(body.decode("utf-8"))["status"], h.STATUS_READY)
            status, headers, body = _http_json(f"http://127.0.0.1:{port}/dataset")
            self.assertEqual(status, 200)
            self.assertTrue(headers.get("X-GOI-DFlight-Sha256"))
            self.assertTrue(headers.get("X-GOI-DFlight-Fetched-At"))
            self.assertEqual(headers.get("X-GOI-DFlight-Feature-Count"), "2")
            self.assertEqual(json.loads(body.decode("utf-8"))["type"], "FeatureCollection")

            status, headers, body = _http_json(
                f"http://127.0.0.1:{port}/status",
                headers={"Origin": "http://evil.test"},
            )
            self.assertEqual(status, 403)
            acao = headers.get("Access-Control-Allow-Origin")
            self.assertTrue(acao is None or acao == "")
            self.assertNotEqual(acao, "*")
        finally:
            _stop_httpd(httpd, thread)

    def test_cors_actual_responses_allowlisted(self):
        cfg = h.load_config(_write_min_config(self.tmp, port=18012, allowlist=["http://gis.test"]))
        helper = h.DFlightHelper(cfg, auth_client=FakeAuth(cfg))
        info = h.validate_feature_collection(self.valid, cfg=cfg, byte_count=len(self.valid_raw))
        sha = h.canonical_sha256(self.valid)
        helper.cache.apply_refresh_result(
            fc=self.valid, raw=self.valid_raw, sha=sha, info=info, unchanged=False
        )
        helper.current_fc = self.valid
        helper.current_meta = helper.cache.read_current()[1]
        helper._api_status = h.STATUS_READY

        httpd, thread = _start_httpd(helper)
        port = httpd.server_address[1]
        origin = {"Origin": "http://gis.test"}
        try:
            for path in ("/status", "/dataset"):
                status, headers, _body = _http_json(f"http://127.0.0.1:{port}{path}", headers=origin)
                self.assertEqual(status, 200, path)
                self.assertEqual(headers.get("Access-Control-Allow-Origin"), "http://gis.test")
                self.assertNotEqual(headers.get("Access-Control-Allow-Origin"), "*")

            status, headers, _body = _http_json(
                f"http://127.0.0.1:{port}/dataset", headers=origin
            )
            self.assertEqual(status, 200)
            self.assertEqual(headers.get("Access-Control-Allow-Origin"), "http://gis.test")
            expose = headers.get("Access-Control-Expose-Headers") or ""
            self.assertTrue(expose, "Access-Control-Expose-Headers required on /dataset")
            expose_l = expose.lower()
            self.assertIn("x-goi-dflight-sha256", expose_l)
            self.assertIn("x-goi-dflight-fetched-at", expose_l)
            self.assertIn("x-goi-dflight-feature-count", expose_l)
            self.assertNotIn("*", expose)
            self.assertTrue(headers.get("X-GOI-DFlight-Sha256"))
            self.assertTrue(headers.get("X-GOI-DFlight-Fetched-At"))
            self.assertEqual(headers.get("X-GOI-DFlight-Feature-Count"), "2")

            status, headers, _body = _http_json(
                f"http://127.0.0.1:{port}/status", headers=origin
            )
            self.assertEqual(status, 200)
            status_expose = headers.get("Access-Control-Expose-Headers")
            self.assertTrue(status_expose is None or status_expose == "")

            status, headers, _body = _http_json(
                f"http://127.0.0.1:{port}/dataset",
                headers={"Origin": "http://evil.test"},
            )
            self.assertEqual(status, 403)
            acao = headers.get("Access-Control-Allow-Origin")
            self.assertTrue(acao is None or acao == "")
            self.assertNotEqual(acao, "*")
            deny_expose = headers.get("Access-Control-Expose-Headers")
            self.assertTrue(deny_expose is None or deny_expose == "")

            def fake_get(url, *, timeout, headers=None, byte_cap):
                return 200, {"content-type": "application/json"}, self.valid_raw

            with mock.patch.object(h, "http_get_bytes_capped", side_effect=fake_get):
                state = helper.cache.load_state()
                state["last_attempt_at"] = None
                helper.cache.save_state(state)
                status, headers, body = _http_json(
                    f"http://127.0.0.1:{port}/refresh",
                    method="POST",
                    headers={**origin, "Content-Type": "application/json"},
                    data=b"{}",
                )
            self.assertEqual(status, 200)
            self.assertEqual(headers.get("Access-Control-Allow-Origin"), "http://gis.test")
            self.assertTrue(json.loads(body.decode("utf-8")).get("refreshed"))
        finally:
            _stop_httpd(httpd, thread)

    def test_wfs_401_retries_once(self):
        calls = {"n": 0}

        def fake_get(url, *, timeout, headers=None, byte_cap):
            calls["n"] += 1
            if calls["n"] == 1:
                return 401, {"content-type": "application/json"}, b'{"error":"auth"}'
            return 200, {"content-type": "application/json"}, self.valid_raw

        with mock.patch.object(h, "http_get_bytes_capped", side_effect=fake_get):
            state = self.helper.cache.load_state()
            state["last_attempt_at"] = None
            self.helper.cache.save_state(state)
            self.helper.refresh()
        self.assertEqual(calls["n"], 2)
        self.assertEqual(self.auth.force_calls, 1)

    def test_no_network_on_startup(self):
        with mock.patch.object(h, "urlopen", side_effect=AssertionError("network")):
            helper = h.DFlightHelper(self.cfg, auth_client=self.auth)
            self.assertIn(helper.status_payload()["status"], (h.STATUS_EMPTY, h.STATUS_READY, h.STATUS_ERROR))


class TestCsrfAuthMock(unittest.TestCase):
    def test_csrf_openssl_invocation_isolated(self):
        with tempfile.TemporaryDirectory() as td:
            pem = Path(td) / "csrf.pem"
            pem.write_text(EXAMPLE_PEM.read_text(encoding="utf-8"), encoding="utf-8")

            def fake_run(cmd, input=None, capture_output=None, timeout=None, check=None):
                self.assertEqual(cmd[0], "/usr/bin/openssl")
                self.assertIn("pkeyutl", cmd)
                self.assertIn("rsa_padding_mode:pkcs1", cmd)
                self.assertIsInstance(input, (bytes, bytearray))
                self.assertTrue(input.decode("utf-8").count("|") == 1)
                return mock.Mock(returncode=0, stdout=b"\x00\x01\x02\x03", stderr=b"")

            with mock.patch.object(h.subprocess, "run", side_effect=fake_run):
                with mock.patch.object(h, "fetch_preflight_value", return_value="1786481693350"):
                    headers = h.build_csrf_headers(
                        preflight_url="https://example.test/pre-flight",
                        pem_path=pem,
                        openssl_path="/usr/bin/openssl",
                        timeout=5,
                    )
            self.assertIn("X-CSRF-TOKEN", headers)
            self.assertIn("X-CSRF-NONCE", headers)
            self.assertEqual(len(headers["X-CSRF-NONCE"]), 36)

    def test_token_lifecycle_mocked(self):
        with tempfile.TemporaryDirectory() as td:
            cfg = h.load_config(_write_min_config(Path(td)))
            client = h.AuthClient(cfg, lambda: ("User", "pass"))

            def fake_post(url, body, *, timeout, headers=None):
                self.assertIn("X-CSRF-TOKEN", headers or {})
                if "refresh_token" in body:
                    payload = {
                        "access_token": "a2",
                        "expires_in": 300,
                        "refresh_token": "r2",
                        "refresh_expires_in": 1800,
                    }
                else:
                    payload = {
                        "access_token": "a1",
                        "expires_in": 300,
                        "refresh_token": "r1",
                        "refresh_expires_in": 1800,
                    }
                return 200, {"content-type": "application/json"}, json.dumps(payload).encode("utf-8")

            with mock.patch.object(h, "build_csrf_headers", return_value={"X-CSRF-TOKEN": "t", "X-CSRF-NONCE": "n"}):
                with mock.patch.object(h, "http_post_form", side_effect=fake_post):
                    token = client.ensure_access_token()
                    self.assertEqual(token, "a1")
                    client.tokens.access_expires_at = time.monotonic() - 1
                    token2 = client.ensure_access_token()
                    self.assertEqual(token2, "a2")


class TestLogging(unittest.TestCase):
    def test_status_has_no_secrets(self):
        with tempfile.TemporaryDirectory() as td:
            cfg = h.load_config(_write_min_config(Path(td)))
            helper = h.DFlightHelper(cfg, auth_client=FakeAuth(cfg))
            blob = json.dumps(helper.status_payload())
            for needle in ("password", "Bearer", "refresh_token", "access_token", "cookie"):
                self.assertNotIn(needle, blob)


if __name__ == "__main__":
    unittest.main()
