#!/usr/bin/env python3
"""GOI D-Flight authenticated WFS helper (H2).

Python 3.12 stdlib only. CSRF uses system openssl (RSA PKCS#1 v1.5).
No secrets in config/repo/logs. Tokens and credentials live only in process RAM.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import logging
import math
import os
import secrets
import ssl
import subprocess
import sys
import tempfile
import threading
import time
import tomllib
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Callable, Optional
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

HELPER_VERSION = "0.1.2"
SCHEMA_VERSION = 1
ACCESS_SAFETY_MARGIN_SEC = 60
DEFAULT_END_NFZ = "9999-12-31T00:00"
ALLOWED_GEOM_TYPES = frozenset({"Polygon", "MultiPolygon"})
STATUS_EMPTY = "EMPTY"
STATUS_READY = "READY"
STATUS_CHECKING = "CHECKING"
STATUS_STALE = "STALE"
STATUS_ERROR = "ERROR"

log = logging.getLogger("goi.dflight.helper")


# ---------------------------------------------------------------------------
# Errors
# ---------------------------------------------------------------------------

class HelperError(Exception):
    def __init__(self, category: str, message: str = ""):
        self.category = category
        super().__init__(message or category)


# ---------------------------------------------------------------------------
# Config / credentials
# ---------------------------------------------------------------------------

def load_config(path: Path) -> dict[str, Any]:
    raw = path.read_bytes()
    data = tomllib.loads(raw.decode("utf-8"))
    dflight = dict(data.get("dflight") or {})
    server = dict(data.get("server") or {})
    cache = dict(data.get("cache") or {})

    required_dflight = [
        "token_url", "refresh_url", "preflight_url", "wfs_url",
        "client_id", "scope", "typename", "output_format", "srs_name",
        "csrf_public_key_path", "openssl_path",
    ]
    for key in required_dflight:
        if not dflight.get(key):
            raise HelperError("config", f"missing dflight.{key}")

    host = str(server.get("host") or "").strip()
    if not host or host in ("0.0.0.0", "::", "[::]"):
        raise HelperError("config", "server.host must be a concrete Tailscale IPv4")
    try:
        port = int(server.get("port"))
    except (TypeError, ValueError) as exc:
        raise HelperError("config", "server.port invalid") from exc
    if not (1 <= port <= 65535):
        raise HelperError("config", "server.port out of range")

    cfg = {
        "dflight": {
            "token_url": str(dflight["token_url"]),
            "refresh_url": str(dflight["refresh_url"]),
            "preflight_url": str(dflight["preflight_url"]),
            "wfs_url": str(dflight["wfs_url"]),
            "client_id": str(dflight["client_id"]),
            "scope": str(dflight["scope"]),
            "typename": str(dflight["typename"]),
            "output_format": str(dflight["output_format"]),
            "srs_name": str(dflight["srs_name"]),
            "timeout_sec": int(dflight.get("timeout_sec", 30)),
            "byte_cap": int(dflight.get("byte_cap", 26214400)),
            "feature_cap": int(dflight.get("feature_cap", 5000)),
            "csrf_public_key_path": str(dflight["csrf_public_key_path"]),
            "openssl_path": str(dflight.get("openssl_path", "/usr/bin/openssl")),
            "lon_min": float(dflight.get("lon_min", -30.0)),
            "lon_max": float(dflight.get("lon_max", 60.0)),
            "lat_min": float(dflight.get("lat_min", 20.0)),
            "lat_max": float(dflight.get("lat_max", 80.0)),
        },
        "server": {
            "host": host,
            "port": port,
            "cooldown_sec": int(server.get("cooldown_sec", 300)),
            "origin_allowlist": [str(x) for x in (server.get("origin_allowlist") or [])],
        },
        "cache": {
            "state_dir": str(cache.get("state_dir") or "/var/lib/goi-dflight"),
        },
    }
    return cfg


def load_credentials() -> tuple[str, str]:
    cred_dir = os.environ.get("CREDENTIALS_DIRECTORY")
    if not cred_dir:
        raise HelperError("auth", "CREDENTIALS_DIRECTORY not set")
    base = Path(cred_dir)
    user_path = base / "dflight_username"
    pass_path = base / "dflight_password"
    if not user_path.is_file() or not pass_path.is_file():
        raise HelperError("auth", "credential files missing")
    username = user_path.read_text(encoding="utf-8").strip()
    password = pass_path.read_text(encoding="utf-8").rstrip("\n").rstrip("\r")
    if not username or not password:
        raise HelperError("auth", "empty credentials")
    return username, password


# ---------------------------------------------------------------------------
# HTTP helpers (stdlib)
# ---------------------------------------------------------------------------

def _ssl_context() -> ssl.SSLContext:
    return ssl.create_default_context()


def http_get_json(url: str, *, timeout: float, headers: Optional[dict[str, str]] = None) -> Any:
    req = Request(url, headers=headers or {}, method="GET")
    try:
        with urlopen(req, timeout=timeout, context=_ssl_context()) as resp:
            status = getattr(resp, "status", 200)
            if status != 200:
                raise HelperError("http", f"GET status {status}")
            raw = resp.read(1_000_000)
            return json.loads(raw.decode("utf-8"))
    except HTTPError as exc:
        raise HelperError("http", f"GET HTTP {exc.code}") from exc
    except URLError as exc:
        raise HelperError("network", "GET network error") from exc
    except json.JSONDecodeError as exc:
        raise HelperError("parse", "GET JSON parse error") from exc


def http_post_form(
    url: str,
    body: str,
    *,
    timeout: float,
    headers: Optional[dict[str, str]] = None,
) -> tuple[int, dict[str, str], bytes]:
    hdrs = {"Content-Type": "application/x-www-form-urlencoded"}
    if headers:
        hdrs.update(headers)
    data = body.encode("utf-8")
    req = Request(url, data=data, headers=hdrs, method="POST")
    try:
        with urlopen(req, timeout=timeout, context=_ssl_context()) as resp:
            status = getattr(resp, "status", 200)
            resp_headers = {k.lower(): v for k, v in resp.headers.items()}
            raw = resp.read(2_000_000)
            return status, resp_headers, raw
    except HTTPError as exc:
        raw = exc.read(2_000_000) if hasattr(exc, "read") else b""
        resp_headers = {k.lower(): v for k, v in (exc.headers.items() if exc.headers else [])}
        return int(exc.code), resp_headers, raw
    except URLError as exc:
        raise HelperError("network", "POST network error") from exc


def http_get_bytes_capped(
    url: str,
    *,
    timeout: float,
    headers: Optional[dict[str, str]] = None,
    byte_cap: int,
) -> tuple[int, dict[str, str], bytes]:
    req = Request(url, headers=headers or {}, method="GET")
    try:
        with urlopen(req, timeout=timeout, context=_ssl_context()) as resp:
            status = getattr(resp, "status", 200)
            resp_headers = {k.lower(): v for k, v in resp.headers.items()}
            cl = resp_headers.get("content-length")
            if cl is not None:
                try:
                    if int(cl) > byte_cap:
                        raise HelperError("cap", "content-length exceeds byte_cap")
                except ValueError:
                    pass
            chunks: list[bytes] = []
            total = 0
            while True:
                block = resp.read(64 * 1024)
                if not block:
                    break
                total += len(block)
                if total > byte_cap:
                    raise HelperError("cap", "response exceeds byte_cap")
                chunks.append(block)
            return status, resp_headers, b"".join(chunks)
    except HelperError:
        raise
    except HTTPError as exc:
        raw = exc.read(min(byte_cap, 2_000_000)) if hasattr(exc, "read") else b""
        resp_headers = {k.lower(): v for k, v in (exc.headers.items() if exc.headers else [])}
        return int(exc.code), resp_headers, raw
    except URLError as exc:
        raise HelperError("network", "GET network error") from exc


# ---------------------------------------------------------------------------
# CSRF (openssl PKCS#1 v1.5) — contract verified PLAN COMPLETE
# ---------------------------------------------------------------------------

def fetch_preflight_value(preflight_url: str, timeout: float) -> str:
    data = http_get_json(preflight_url, timeout=timeout)
    if not isinstance(data, dict) or "value" not in data:
        raise HelperError("csrf", "preflight missing value")
    return str(data["value"])


def openssl_rsa_pkcs1_encrypt(
    plaintext: bytes,
    *,
    pem_path: Path,
    openssl_path: str,
    timeout: float = 10.0,
) -> bytes:
    """Encrypt plaintext with RSA PKCS#1 v1.5 via openssl (stdin/stdout only)."""
    cmd = [
        openssl_path,
        "pkeyutl",
        "-encrypt",
        "-pubin",
        "-inkey",
        str(pem_path),
        "-pkeyopt",
        "rsa_padding_mode:pkcs1",
    ]
    try:
        proc = subprocess.run(
            cmd,
            input=plaintext,
            capture_output=True,
            timeout=timeout,
            check=False,
        )
    except FileNotFoundError as exc:
        raise HelperError("csrf", "openssl not found") from exc
    except subprocess.TimeoutExpired as exc:
        raise HelperError("csrf", "openssl timeout") from exc
    if proc.returncode != 0:
        # Do not log stderr contents (may contain path noise only, but keep silent)
        raise HelperError("csrf", f"openssl failed rc={proc.returncode}")
    if not proc.stdout:
        raise HelperError("csrf", "openssl empty ciphertext")
    return proc.stdout


def build_csrf_headers(
    *,
    preflight_url: str,
    pem_path: Path,
    openssl_path: str,
    timeout: float,
) -> dict[str, str]:
    value = fetch_preflight_value(preflight_url, timeout)
    nonce = str(uuid.uuid4())
    plaintext = f"{nonce}|{value}".encode("utf-8")
    ciphertext = openssl_rsa_pkcs1_encrypt(
        plaintext, pem_path=pem_path, openssl_path=openssl_path, timeout=min(timeout, 15.0)
    )
    token = base64.b64encode(ciphertext).decode("ascii")
    return {
        "X-CSRF-TOKEN": token,
        "X-CSRF-NONCE": nonce,
    }


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

def build_password_grant_body(*, client_id: str, scope: str, username: str, password: str) -> str:
    # username lowercased as observed in D-Flight webapp
    return urlencode(
        {
            "grant_type": "password",
            "client_id": client_id,
            "scope": scope,
            "username": username.lower(),
            "password": password,
        }
    )


def build_refresh_grant_body(*, client_id: str, refresh_token: str) -> str:
    return urlencode(
        {
            "grant_type": "refresh_token",
            "client_id": client_id,
            "refresh_token": refresh_token,
        }
    )


class TokenState:
    def __init__(self) -> None:
        self.access_token: Optional[str] = None
        self.refresh_token: Optional[str] = None
        self.access_expires_at: float = 0.0  # monotonic
        self.refresh_expires_at: float = 0.0

    def clear(self) -> None:
        self.access_token = None
        self.refresh_token = None
        self.access_expires_at = 0.0
        self.refresh_expires_at = 0.0

    def set_from_response(self, data: dict[str, Any]) -> None:
        access = data.get("access_token")
        refresh = data.get("refresh_token")
        if not isinstance(access, str) or not access:
            raise HelperError("auth", "missing access_token")
        expires_in = int(data.get("expires_in") or 0)
        refresh_expires_in = int(data.get("refresh_expires_in") or 0)
        now = time.monotonic()
        self.access_token = access
        self.refresh_token = refresh if isinstance(refresh, str) and refresh else None
        self.access_expires_at = now + max(0, expires_in)
        self.refresh_expires_at = now + max(0, refresh_expires_in) if self.refresh_token else 0.0

    def access_valid(self, margin: int = ACCESS_SAFETY_MARGIN_SEC) -> bool:
        return bool(self.access_token) and time.monotonic() < (self.access_expires_at - margin)

    def refresh_valid(self) -> bool:
        return bool(self.refresh_token) and time.monotonic() < self.refresh_expires_at


class AuthClient:
    def __init__(self, cfg: dict[str, Any], credential_loader: Callable[[], tuple[str, str]]):
        self.cfg = cfg["dflight"]
        self._load_credentials = credential_loader
        self.tokens = TokenState()
        self._lock = threading.Lock()

    def _parse_token_response(self, status: int, raw: bytes) -> dict[str, Any]:
        try:
            data = json.loads(raw.decode("utf-8")) if raw else {}
        except json.JSONDecodeError as exc:
            raise HelperError("auth", f"token parse error status={status}") from exc
        if status != 200:
            err = data.get("error") if isinstance(data, dict) else None
            raise HelperError("auth", f"token HTTP {status}" + (f" error={err}" if err else ""))
        if not isinstance(data, dict):
            raise HelperError("auth", "token response not object")
        return data

    def _csrf_headers(self) -> dict[str, str]:
        return build_csrf_headers(
            preflight_url=self.cfg["preflight_url"],
            pem_path=Path(self.cfg["csrf_public_key_path"]),
            openssl_path=self.cfg["openssl_path"],
            timeout=float(self.cfg["timeout_sec"]),
        )

    def password_grant(self) -> None:
        username, password = self._load_credentials()
        body = build_password_grant_body(
            client_id=self.cfg["client_id"],
            scope=self.cfg["scope"],
            username=username,
            password=password,
        )
        # Drop local refs promptly (best-effort; Python strings are immutable)
        username = ""
        password = ""
        csrf = self._csrf_headers()
        status, _hdrs, raw = http_post_form(
            self.cfg["token_url"],
            body,
            timeout=float(self.cfg["timeout_sec"]),
            headers=csrf,
        )
        data = self._parse_token_response(status, raw)
        self.tokens.set_from_response(data)
        log.info("event=auth_password_grant status=ok")

    def refresh_grant(self) -> None:
        if not self.tokens.refresh_token:
            raise HelperError("auth", "no refresh_token")
        body = build_refresh_grant_body(
            client_id=self.cfg["client_id"],
            refresh_token=self.tokens.refresh_token,
        )
        csrf = self._csrf_headers()
        status, _hdrs, raw = http_post_form(
            self.cfg["refresh_url"],
            body,
            timeout=float(self.cfg["timeout_sec"]),
            headers=csrf,
        )
        data = self._parse_token_response(status, raw)
        self.tokens.set_from_response(data)
        log.info("event=auth_refresh_grant status=ok")

    def ensure_access_token(self) -> str:
        with self._lock:
            if self.tokens.access_valid():
                assert self.tokens.access_token
                return self.tokens.access_token
            if self.tokens.refresh_valid():
                try:
                    self.refresh_grant()
                    assert self.tokens.access_token
                    return self.tokens.access_token
                except HelperError:
                    log.info("event=auth_refresh_failed falling_back=password_grant")
            self.password_grant()
            assert self.tokens.access_token
            return self.tokens.access_token

    def force_reauth(self) -> str:
        with self._lock:
            try:
                if self.tokens.refresh_valid():
                    self.refresh_grant()
                else:
                    self.password_grant()
            except HelperError:
                self.password_grant()
            assert self.tokens.access_token
            return self.tokens.access_token


# ---------------------------------------------------------------------------
# WFS
# ---------------------------------------------------------------------------

def format_utc_minute(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M")


def build_viewparams(now_utc: Optional[datetime] = None) -> str:
    dt = now_utc or datetime.now(timezone.utc)
    start = format_utc_minute(dt)
    return f"start_nfz:{start};end_nfz:{DEFAULT_END_NFZ};"


def build_wfs_url(
    *,
    wfs_url: str,
    typename: str,
    output_format: str,
    srs_name: str,
    viewparams: str,
) -> str:
    q = urlencode(
        {
            "service": "WFS",
            "version": "1.1.0",
            "request": "GetFeature",
            "typename": typename,
            "outputFormat": output_format,
            "srsname": srs_name,
            "viewparams": viewparams,
        }
    )
    sep = "&" if ("?" in wfs_url) else "?"
    return f"{wfs_url}{sep}{q}"


# ---------------------------------------------------------------------------
# Validation + canonical hash
# ---------------------------------------------------------------------------

def _is_finite_number(x: Any) -> bool:
    return isinstance(x, (int, float)) and not isinstance(x, bool) and math.isfinite(float(x))


def _walk_coords(coords: Any, *, lon_min: float, lon_max: float, lat_min: float, lat_max: float) -> None:
    if isinstance(coords, (list, tuple)):
        if coords and _is_finite_number(coords[0]) and len(coords) >= 2 and _is_finite_number(coords[1]):
            lon = float(coords[0])
            lat = float(coords[1])
            if not (lon_min <= lon <= lon_max and lat_min <= lat <= lat_max):
                raise HelperError("validation", "coordinate out of range")
            for v in coords[2:]:
                if not _is_finite_number(v):
                    raise HelperError("validation", "non-finite coordinate")
            return
        for item in coords:
            _walk_coords(item, lon_min=lon_min, lon_max=lon_max, lat_min=lat_min, lat_max=lat_max)
        return
    raise HelperError("validation", "invalid coordinates structure")


def validate_feature_collection(fc: Any, *, cfg: dict[str, Any], byte_count: int) -> dict[str, Any]:
    d = cfg["dflight"]
    if byte_count <= 0 or byte_count > d["byte_cap"]:
        raise HelperError("validation", "byte_count invalid")
    if not isinstance(fc, dict):
        raise HelperError("validation", "not an object")
    if fc.get("type") != "FeatureCollection":
        raise HelperError("validation", "type not FeatureCollection")
    features = fc.get("features")
    if not isinstance(features, list):
        raise HelperError("validation", "features not list")
    count = len(features)
    if count < 1:
        raise HelperError("empty", "empty dataset")
    if count > d["feature_cap"]:
        raise HelperError("cap", "feature_cap exceeded")

    seen: set[str] = set()
    for feat in features:
        if not isinstance(feat, dict):
            raise HelperError("validation", "feature not object")
        props = feat.get("properties")
        if not isinstance(props, dict):
            raise HelperError("validation", "properties missing")
        fid = props.get("id")
        if fid is None or str(fid).strip() == "":
            raise HelperError("validation", "properties.id missing")
        sid = str(fid)
        if sid in seen:
            raise HelperError("validation", "duplicate properties.id")
        seen.add(sid)
        geom = feat.get("geometry")
        if not isinstance(geom, dict):
            raise HelperError("validation", "geometry missing")
        gtype = geom.get("type")
        if gtype not in ALLOWED_GEOM_TYPES:
            raise HelperError("validation", f"geometry type not allowed: {gtype}")
        coords = geom.get("coordinates")
        _walk_coords(
            coords,
            lon_min=d["lon_min"],
            lon_max=d["lon_max"],
            lat_min=d["lat_min"],
            lat_max=d["lat_max"],
        )

    return {
        "feature_count": count,
        "source_time_stamp": fc.get("timeStamp") if isinstance(fc.get("timeStamp"), str) else None,
        "source_update_sequence": None,
    }


def _canon_val(v: Any) -> Any:
    if isinstance(v, float):
        return round(v, 10)
    if isinstance(v, list):
        return [_canon_val(x) for x in v]
    if isinstance(v, dict):
        return {k: _canon_val(v[k]) for k in sorted(v.keys())}
    return v


def _canon_geom(g: dict[str, Any]) -> dict[str, Any]:
    return {
        "type": g.get("type"),
        "coordinates": _canon_val(g.get("coordinates")),
    }


def canonical_sha256(fc: dict[str, Any]) -> str:
    features = fc.get("features") or []
    keyed = []
    for f in features:
        props = f.get("properties") or {}
        if props.get("id") is None or str(props.get("id")).strip() == "":
            continue
        keyed.append(f)
    keyed.sort(key=lambda f: str(f["properties"]["id"]))
    canonical_features = []
    for f in keyed:
        props = f.get("properties") or {}
        geom = f.get("geometry") or {}
        canonical_features.append(
            {
                "id": str(props["id"]),
                "geometry": _canon_geom(geom if isinstance(geom, dict) else {}),
                "properties": _canon_val(props if isinstance(props, dict) else {}),
            }
        )
    payload = json.dumps(
        canonical_features,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
        allow_nan=False,
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


# ---------------------------------------------------------------------------
# Cache LKG
# ---------------------------------------------------------------------------

def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _write_bytes_fsync(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "wb") as fh:
        fh.write(data)
        fh.flush()
        os.fsync(fh.fileno())


def _atomic_write_bytes(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=".tmp-", dir=str(path.parent))
    tmp_path = Path(tmp_name)
    try:
        with os.fdopen(fd, "wb") as fh:
            fh.write(data)
            fh.flush()
            os.fsync(fh.fileno())
        os.replace(tmp_path, path)
    finally:
        if tmp_path.exists():
            try:
                tmp_path.unlink()
            except OSError:
                pass


def _atomic_write_json(path: Path, obj: Any) -> None:
    raw = json.dumps(obj, ensure_ascii=False, indent=2, allow_nan=False).encode("utf-8")
    _atomic_write_bytes(path, raw)


class CacheStore:
    def __init__(self, state_dir: Path, cfg: dict[str, Any]):
        self.state_dir = state_dir
        self.cfg = cfg
        self.tmp_dir = state_dir / "tmp"
        self.current_path = state_dir / "current.json"
        self.current_meta_path = state_dir / "current.meta.json"
        self.previous_path = state_dir / "previous.json"
        self.previous_meta_path = state_dir / "previous.meta.json"
        self.state_path = state_dir / "state.json"
        self._lock = threading.RLock()
        self.state_dir.mkdir(parents=True, exist_ok=True)
        self.tmp_dir.mkdir(parents=True, exist_ok=True)

    def load_state(self) -> dict[str, Any]:
        if not self.state_path.is_file():
            return {
                "last_check_at": None,
                "last_attempt_at": None,
                "last_error_category": None,
            }
        try:
            data = json.loads(self.state_path.read_text(encoding="utf-8"))
            if not isinstance(data, dict):
                raise json.JSONDecodeError("not object", "", 0)
            return {
                "last_check_at": data.get("last_check_at"),
                "last_attempt_at": data.get("last_attempt_at"),
                "last_error_category": data.get("last_error_category"),
            }
        except (OSError, json.JSONDecodeError):
            return {
                "last_check_at": None,
                "last_attempt_at": None,
                "last_error_category": None,
            }

    def save_state(self, state: dict[str, Any]) -> None:
        clean = {
            "last_check_at": state.get("last_check_at"),
            "last_attempt_at": state.get("last_attempt_at"),
            "last_error_category": state.get("last_error_category"),
        }
        _atomic_write_json(self.state_path, clean)

    def _read_json_file(self, path: Path) -> Optional[dict[str, Any]]:
        if not path.is_file():
            return None
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else None
        except (OSError, json.JSONDecodeError):
            return None

    def rebuild_meta_from_current(self, fc: dict[str, Any], byte_count: int) -> dict[str, Any]:
        info = validate_feature_collection(fc, cfg=self.cfg, byte_count=byte_count)
        sha = canonical_sha256(fc)
        now = _utc_now_iso()
        return {
            "schema_version": SCHEMA_VERSION,
            "helper_version": HELPER_VERSION,
            "source_typename": self.cfg["dflight"]["typename"],
            "source_srs": self.cfg["dflight"]["srs_name"],
            "fetched_at": now,
            "last_change_at": now,
            "canonical_sha256": sha,
            "byte_count": byte_count,
            "feature_count": info["feature_count"],
            "source_time_stamp": info.get("source_time_stamp"),
            "source_update_sequence": info.get("source_update_sequence"),
        }

    def _verified_meta_for_dataset(
        self,
        fc: dict[str, Any],
        raw: bytes,
        meta_path: Path,
        *,
        persist: bool = True,
    ) -> dict[str, Any]:
        """Return meta matching dataset hash; rebuild if missing/mismatch."""
        sha = canonical_sha256(fc)
        meta = self._read_json_file(meta_path)
        if meta and meta.get("canonical_sha256") == sha:
            return meta
        meta = self.rebuild_meta_from_current(fc, len(raw))
        if persist:
            _atomic_write_json(meta_path, meta)
            log.info("event=meta_rebuilt path=%s sha_prefix=%s", meta_path.name, sha[:12])
        return meta

    def startup_consistency(self) -> tuple[Optional[dict[str, Any]], Optional[dict[str, Any]]]:
        """Return (current_fc, current_meta) after recovery checks. No network."""
        with self._lock:
            if self.current_path.is_file():
                try:
                    raw_bytes = self.current_path.read_bytes()
                    fc = json.loads(raw_bytes.decode("utf-8"))
                    if isinstance(fc, dict) and fc.get("type") == "FeatureCollection":
                        validate_feature_collection(fc, cfg=self.cfg, byte_count=len(raw_bytes))
                        meta = self._verified_meta_for_dataset(
                            fc, raw_bytes, self.current_meta_path, persist=True
                        )
                        return fc, meta
                except (OSError, json.JSONDecodeError, HelperError, UnicodeDecodeError) as exc:
                    log.info(
                        "event=startup_current_invalid category=%s",
                        getattr(exc, "category", "parse"),
                    )
                    if self.previous_path.is_file():
                        try:
                            prev_bytes = self.previous_path.read_bytes()
                            prev = json.loads(prev_bytes.decode("utf-8"))
                            if not isinstance(prev, dict):
                                raise HelperError("parse", "previous invalid")
                            validate_feature_collection(prev, cfg=self.cfg, byte_count=len(prev_bytes))
                            meta = self._verified_meta_for_dataset(
                                prev, prev_bytes, self.previous_meta_path, persist=True
                            )
                            _atomic_write_bytes(self.current_path, prev_bytes)
                            _atomic_write_json(self.current_meta_path, meta)
                            log.info("event=startup_recovered_from_previous")
                            return prev, meta
                        except (OSError, HelperError, json.JSONDecodeError, UnicodeDecodeError):
                            pass
                    return None, None
            return None, None

    def read_current(self) -> tuple[Optional[dict[str, Any]], Optional[dict[str, Any]], Optional[bytes]]:
        with self._lock:
            if not self.current_path.is_file():
                return None, None, None
            try:
                raw = self.current_path.read_bytes()
                fc = json.loads(raw.decode("utf-8"))
                if not isinstance(fc, dict):
                    return None, None, None
                meta = self._verified_meta_for_dataset(fc, raw, self.current_meta_path, persist=True)
                return fc, meta, raw
            except (OSError, json.JSONDecodeError, UnicodeDecodeError, HelperError):
                return None, None, None

    def apply_refresh_result(
        self,
        *,
        fc: dict[str, Any],
        raw: bytes,
        sha: str,
        info: dict[str, Any],
        unchanged: bool,
    ) -> dict[str, Any]:
        with self._lock:
            state = self.load_state()
            now = _utc_now_iso()
            # last_attempt_at already stamped when the upstream attempt was accepted
            state["last_check_at"] = now
            state["last_error_category"] = None

            if unchanged:
                cur_fc, cur_meta, cur_raw = self.read_current()
                meta = cur_meta or {}
                if cur_fc is not None and cur_raw is not None and (
                    not meta or meta.get("canonical_sha256") != sha
                ):
                    meta = self._verified_meta_for_dataset(
                        cur_fc, cur_raw, self.current_meta_path, persist=True
                    )
                self.save_state(state)
                return {
                    "result": "READY_UNCHANGED",
                    "canonical_sha256": meta.get("canonical_sha256") or sha,
                    "meta": meta,
                }

            # CHANGED — crash-safe sequence (current stays until new tmp ready + previous preserved)
            new_tmp = self.tmp_dir / f"new-{os.getpid()}-{secrets.token_hex(4)}.json"
            _write_bytes_fsync(new_tmp, raw)

            cur_fc, cur_meta, cur_raw = self.read_current()
            if cur_raw is not None and cur_fc is not None:
                prev_tmp = self.tmp_dir / f"prev-{os.getpid()}-{secrets.token_hex(4)}.json"
                prev_meta_tmp = self.tmp_dir / f"prev-meta-{os.getpid()}-{secrets.token_hex(4)}.json"
                _write_bytes_fsync(prev_tmp, cur_raw)
                prev_meta_obj = cur_meta or self.rebuild_meta_from_current(cur_fc, len(cur_raw))
                if prev_meta_obj.get("canonical_sha256") != canonical_sha256(cur_fc):
                    prev_meta_obj = self.rebuild_meta_from_current(cur_fc, len(cur_raw))
                _atomic_write_json(prev_meta_tmp, prev_meta_obj)
                os.replace(prev_tmp, self.previous_path)
                os.replace(prev_meta_tmp, self.previous_meta_path)

            new_meta = {
                "schema_version": SCHEMA_VERSION,
                "helper_version": HELPER_VERSION,
                "source_typename": self.cfg["dflight"]["typename"],
                "source_srs": self.cfg["dflight"]["srs_name"],
                "fetched_at": now,
                "last_change_at": now,
                "canonical_sha256": sha,
                "byte_count": len(raw),
                "feature_count": info["feature_count"],
                "source_time_stamp": info.get("source_time_stamp"),
                "source_update_sequence": info.get("source_update_sequence"),
            }
            os.replace(new_tmp, self.current_path)
            _atomic_write_json(self.current_meta_path, new_meta)
            self.save_state(state)
            return {"result": "READY_CHANGED", "canonical_sha256": sha, "meta": new_meta}

    def rollback(self) -> dict[str, Any]:
        with self._lock:
            if not self.previous_path.is_file():
                raise HelperError("rollback", "previous missing")
            prev_raw = self.previous_path.read_bytes()
            prev_fc = json.loads(prev_raw.decode("utf-8"))
            validate_feature_collection(prev_fc, cfg=self.cfg, byte_count=len(prev_raw))
            prev_meta = self._verified_meta_for_dataset(
                prev_fc, prev_raw, self.previous_meta_path, persist=True
            )

            cur_fc, cur_meta, cur_raw = self.read_current()
            new_current_tmp = self.tmp_dir / f"rb-cur-{os.getpid()}-{secrets.token_hex(4)}.json"
            _write_bytes_fsync(new_current_tmp, prev_raw)

            if cur_raw is not None and cur_fc is not None:
                new_prev_tmp = self.tmp_dir / f"rb-prev-{os.getpid()}-{secrets.token_hex(4)}.json"
                _write_bytes_fsync(new_prev_tmp, cur_raw)
                os.replace(new_prev_tmp, self.previous_path)
                cur_meta_ok = cur_meta or self.rebuild_meta_from_current(cur_fc, len(cur_raw))
                if cur_meta_ok.get("canonical_sha256") != canonical_sha256(cur_fc):
                    cur_meta_ok = self.rebuild_meta_from_current(cur_fc, len(cur_raw))
                _atomic_write_json(self.previous_meta_path, cur_meta_ok)

            os.replace(new_current_tmp, self.current_path)
            now = _utc_now_iso()
            prev_meta = dict(prev_meta)
            prev_meta["last_change_at"] = now
            _atomic_write_json(self.current_meta_path, prev_meta)
            state = self.load_state()
            state["last_check_at"] = now
            state["last_error_category"] = None
            self.save_state(state)
            return {"status": "ok", "canonical_sha256": prev_meta.get("canonical_sha256")}


# ---------------------------------------------------------------------------
# Refresh engine + service facade
# ---------------------------------------------------------------------------

class DFlightHelper:
    def __init__(
        self,
        cfg: dict[str, Any],
        *,
        credential_loader: Optional[Callable[[], tuple[str, str]]] = None,
        auth_client: Optional[AuthClient] = None,
    ):
        self.cfg = cfg
        self.cache = CacheStore(Path(cfg["cache"]["state_dir"]), cfg)
        self.auth = auth_client or AuthClient(cfg, credential_loader or load_credentials)
        self._refresh_lock = threading.Lock()
        self._busy = False
        self._api_status = STATUS_EMPTY
        self._last_error_category: Optional[str] = None
        self.current_fc: Optional[dict[str, Any]] = None
        self.current_meta: Optional[dict[str, Any]] = None
        # Startup: local only
        fc, meta = self.cache.startup_consistency()
        self.current_fc = fc
        self.current_meta = meta
        state = self.cache.load_state()
        self._last_error_category = state.get("last_error_category")
        if self.current_fc is not None:
            if self._last_error_category:
                self._api_status = STATUS_STALE
            else:
                self._api_status = STATUS_READY
        else:
            self._api_status = STATUS_ERROR if self._last_error_category else STATUS_EMPTY

    def cooldown_remaining(self) -> int:
        state = self.cache.load_state()
        last = state.get("last_attempt_at")
        if not last:
            return 0
        try:
            ts = datetime.fromisoformat(str(last).replace("Z", "+00:00")).timestamp()
        except ValueError:
            return 0
        elapsed = time.time() - ts
        rem = int(self.cfg["server"]["cooldown_sec"] - elapsed)
        return max(0, rem)

    def status_payload(self) -> dict[str, Any]:
        meta = self.current_meta or {}
        state = self.cache.load_state()
        return {
            "service": "goi-dflight-helper",
            "helper_version": HELPER_VERSION,
            "status": STATUS_CHECKING if self._busy else self._api_status,
            "dataset_available": self.current_fc is not None,
            "typename": self.cfg["dflight"]["typename"],
            "canonical_sha256": meta.get("canonical_sha256"),
            "feature_count": meta.get("feature_count"),
            "byte_count": meta.get("byte_count"),
            "fetched_at": meta.get("fetched_at"),
            "last_check_at": state.get("last_check_at"),
            "last_change_at": meta.get("last_change_at"),
            "last_error_category": self._last_error_category,
            "cooldown_remaining_sec": self.cooldown_remaining(),
            "single_flight_busy": self._busy,
        }

    def _fetch_wfs_once(self, token: str, viewparams: str) -> tuple[bytes, dict[str, Any], str, dict[str, Any]]:
        url = build_wfs_url(
            wfs_url=self.cfg["dflight"]["wfs_url"],
            typename=self.cfg["dflight"]["typename"],
            output_format=self.cfg["dflight"]["output_format"],
            srs_name=self.cfg["dflight"]["srs_name"],
            viewparams=viewparams,
        )
        # Do not log Authorization
        status, headers, raw = http_get_bytes_capped(
            url,
            timeout=float(self.cfg["dflight"]["timeout_sec"]),
            headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
            byte_cap=int(self.cfg["dflight"]["byte_cap"]),
        )
        if status == 401:
            raise HelperError("auth", "WFS 401")
        if status != 200:
            raise HelperError("http", f"WFS HTTP {status}")
        ctype = headers.get("content-type")
        if not is_json_content_type(ctype):
            raise HelperError("validation", "WFS content-type missing or not JSON-compatible")
        try:
            fc = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise HelperError("parse", "WFS JSON parse error") from exc
        info = validate_feature_collection(fc, cfg=self.cfg, byte_count=len(raw))
        sha = canonical_sha256(fc)
        return raw, fc, sha, info

    def refresh(self) -> dict[str, Any]:
        if not self._refresh_lock.acquire(blocking=False):
            raise HelperError("busy", "refresh already in progress")
        self._busy = True
        prev_status = self._api_status
        self._api_status = STATUS_CHECKING
        try:
            rem = self.cooldown_remaining()
            if rem > 0:
                raise HelperError("cooldown", f"retry_after_sec={rem}")

            # Accepted upstream attempt: stamp cooldown clock before any D-Flight contact.
            state = self.cache.load_state()
            state["last_attempt_at"] = _utc_now_iso()
            self.cache.save_state(state)

            viewparams = build_viewparams()
            token = self.auth.ensure_access_token()
            try:
                raw, fc, sha, info = self._fetch_wfs_once(token, viewparams)
            except HelperError as exc:
                if exc.category == "auth":
                    token = self.auth.force_reauth()
                    try:
                        raw, fc, sha, info = self._fetch_wfs_once(token, viewparams)
                    except HelperError as exc2:
                        if exc2.category == "auth":
                            raise HelperError("auth", "WFS 401 after re-auth") from exc2
                        raise
                else:
                    raise

            cur_meta = self.current_meta or {}
            unchanged = bool(cur_meta.get("canonical_sha256") == sha and self.current_fc is not None)
            result = self.cache.apply_refresh_result(
                fc=fc, raw=raw, sha=sha, info=info, unchanged=unchanged
            )
            if not unchanged:
                self.current_fc = fc
                self.current_meta = result["meta"]
            else:
                if self.current_meta is None:
                    self.current_meta = result.get("meta")
            self._last_error_category = None
            self._api_status = STATUS_READY
            log.info(
                "event=refresh_ok result=%s features=%s bytes=%s sha_prefix=%s",
                result["result"],
                info["feature_count"],
                len(raw),
                sha[:12],
            )
            return {
                "refreshed": True,
                "status": result["result"],
                "canonical_sha256": result["canonical_sha256"],
            }
        except HelperError as exc:
            if exc.category in ("busy", "cooldown"):
                # Rejected before accepted attempt — do not consume cooldown slot.
                self._api_status = prev_status if prev_status != STATUS_CHECKING else (
                    STATUS_READY if self.current_fc is not None else STATUS_EMPTY
                )
                log.info("event=refresh_rejected category=%s", exc.category)
                raise
            self._last_error_category = exc.category
            state = self.cache.load_state()
            # Preserve last_attempt_at (already stamped); record failure category only.
            state["last_error_category"] = exc.category
            self.cache.save_state(state)
            if self.current_fc is not None:
                self._api_status = STATUS_STALE
            else:
                self._api_status = STATUS_ERROR
            log.info("event=refresh_fail category=%s", exc.category)
            raise
        finally:
            self._busy = False
            self._refresh_lock.release()


# ---------------------------------------------------------------------------
# Origin / CORS policy
# ---------------------------------------------------------------------------

def origin_allowed(origin: Optional[str], allowlist: list[str]) -> bool:
    if origin is None or origin == "":
        return True
    return origin in allowlist


def cors_response_headers(origin: Optional[str], allowlist: list[str]) -> dict[str, str]:
    """CORS headers for actual responses. Never '*'. No credentials."""
    if not origin:
        return {}
    if origin in allowlist:
        return {"Access-Control-Allow-Origin": origin}
    return {}


def is_json_content_type(content_type: Optional[str]) -> bool:
    """Fail-closed: missing header is invalid. Accept JSON / GeoJSON / +json."""
    if content_type is None:
        return False
    raw = str(content_type).strip()
    if not raw:
        return False
    main = raw.split(";", 1)[0].strip().lower()
    if main in ("application/json", "application/geo+json"):
        return True
    if main.startswith("application/") and main.endswith("+json"):
        return True
    return False


# ---------------------------------------------------------------------------
# HTTP API
# ---------------------------------------------------------------------------

class HelperHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True

    def __init__(self, server_address, RequestHandlerClass, helper: DFlightHelper):
        self.helper = helper
        super().__init__(server_address, RequestHandlerClass)


def make_handler(helper: DFlightHelper):
    class Handler(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"

        def log_message(self, fmt: str, *args: Any) -> None:
            log.info("event=http_access msg=" + (fmt % args))

        def _read_body(self, max_bytes: int = 4096) -> bytes:
            length = int(self.headers.get("Content-Length") or 0)
            if length < 0 or length > max_bytes:
                raise HelperError("validation", "body too large")
            if length == 0:
                return b""
            return self.rfile.read(length)

        def _cors_headers(self) -> dict[str, str]:
            return cors_response_headers(
                self.headers.get("Origin"),
                helper.cfg["server"]["origin_allowlist"],
            )

        def _send_json(self, status: int, obj: dict[str, Any], extra_headers: Optional[dict[str, str]] = None) -> None:
            raw = json.dumps(obj, ensure_ascii=False, allow_nan=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(raw)))
            headers = dict(extra_headers or {})
            headers.update(self._cors_headers())
            for k, v in headers.items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(raw)

        def _check_origin(self) -> bool:
            origin = self.headers.get("Origin")
            allow = helper.cfg["server"]["origin_allowlist"]
            if origin_allowed(origin, allow):
                return True
            # Forbidden: no ACAO wildcard
            self._send_json(403, {"error": "origin_forbidden", "error_category": "origin"})
            return False

        def do_OPTIONS(self) -> None:  # noqa: N802
            origin = self.headers.get("Origin")
            allow = helper.cfg["server"]["origin_allowlist"]
            if not origin or origin not in allow:
                self.send_response(403)
                self.end_headers()
                return
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header(
                "Access-Control-Allow-Headers",
                "Content-Type",
            )
            self.send_header("Content-Length", "0")
            self.end_headers()

        def do_GET(self) -> None:  # noqa: N802
            if not self._check_origin():
                return
            if self.path.split("?", 1)[0] == "/status":
                self._send_json(200, helper.status_payload())
                return
            if self.path.split("?", 1)[0] == "/dataset":
                fc, meta, _raw = helper.cache.read_current()
                if fc is None:
                    helper.current_fc = None
                    helper.current_meta = None
                    self._send_json(503, {"error": "no_dataset", "status": STATUS_EMPTY})
                    return
                helper.current_fc = fc
                helper.current_meta = meta
                raw = json.dumps(fc, ensure_ascii=False, allow_nan=False).encode("utf-8")
                headers = {
                    "X-GOI-DFlight-Sha256": str((meta or {}).get("canonical_sha256") or ""),
                    "X-GOI-DFlight-Fetched-At": str((meta or {}).get("fetched_at") or ""),
                    "X-GOI-DFlight-Feature-Count": str((meta or {}).get("feature_count") or ""),
                }
                cors = self._cors_headers()
                headers.update(cors)
                # Scoped to /dataset: browser JS needs X-GOI-DFlight-* via headers.get().
                # Only when Origin is already allowlisted (ACAO present). Never '*'.
                if cors.get("Access-Control-Allow-Origin"):
                    headers["Access-Control-Expose-Headers"] = (
                        "X-GOI-DFlight-Sha256, X-GOI-DFlight-Fetched-At, X-GOI-DFlight-Feature-Count"
                    )
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(raw)))
                for k, v in headers.items():
                    self.send_header(k, v)
                self.end_headers()
                self.wfile.write(raw)
                return
            self._send_json(404, {"error": "not_found"})

        def do_POST(self) -> None:  # noqa: N802
            if not self._check_origin():
                return
            if self.path.split("?", 1)[0] != "/refresh":
                self._send_json(404, {"error": "not_found"})
                return
            try:
                self._read_body()
            except HelperError as exc:
                self._send_json(400, {"error": exc.category, "error_category": exc.category})
                return
            try:
                result = helper.refresh()
                self._send_json(200, result)
            except HelperError as exc:
                if exc.category == "busy":
                    self._send_json(409, {"refreshed": False, "reason": "busy", "error_category": "busy"})
                elif exc.category == "cooldown":
                    self._send_json(
                        429,
                        {
                            "refreshed": False,
                            "reason": "cooldown",
                            "retry_after_sec": helper.cooldown_remaining(),
                            "error_category": "cooldown",
                        },
                    )
                else:
                    self._send_json(502, {"refreshed": False, "error_category": exc.category})

    return Handler


def serve(helper: DFlightHelper) -> None:
    host = helper.cfg["server"]["host"]
    port = helper.cfg["server"]["port"]
    handler = make_handler(helper)
    try:
        httpd = HelperHTTPServer((host, port), handler, helper)
    except OSError as exc:
        raise HelperError("bind", f"bind failed {host}:{port}") from exc
    log.info("event=server_start host=%s port=%s", host, port)
    httpd.serve_forever()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def cmd_check_config(cfg_path: Path) -> int:
    cfg = load_config(cfg_path)
    pem = Path(cfg["dflight"]["csrf_public_key_path"])
    if not pem.is_file():
        print(f"ERROR: csrf pem missing: {pem}", file=sys.stderr)
        return 2
    text = pem.read_text(encoding="utf-8")
    if "BEGIN PUBLIC KEY" not in text:
        print("ERROR: csrf pem invalid", file=sys.stderr)
        return 2
    print("config_ok")
    print(f"host={cfg['server']['host']} port={cfg['server']['port']}")
    print(f"typename={cfg['dflight']['typename']}")
    return 0


def cmd_rollback(cfg_path: Path) -> int:
    cfg = load_config(cfg_path)
    store = CacheStore(Path(cfg["cache"]["state_dir"]), cfg)
    try:
        result = store.rollback()
    except HelperError as exc:
        print(f"ERROR: {exc.category}", file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False))
    return 0


def setup_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )


def main(argv: Optional[list[str]] = None) -> int:
    setup_logging()
    parser = argparse.ArgumentParser(description="GOI D-Flight helper")
    parser.add_argument(
        "--config",
        default=os.environ.get("GOI_DFLIGHT_CONFIG", ""),
        help="Path to config.toml (or GOI_DFLIGHT_CONFIG)",
    )
    parser.add_argument("--check-config", action="store_true")
    parser.add_argument("--rollback", action="store_true")
    args = parser.parse_args(argv)

    if not args.config:
        print("ERROR: --config or GOI_DFLIGHT_CONFIG required", file=sys.stderr)
        return 2
    cfg_path = Path(args.config)
    if not cfg_path.is_file():
        print(f"ERROR: config not found: {cfg_path}", file=sys.stderr)
        return 2

    if args.check_config:
        return cmd_check_config(cfg_path)
    if args.rollback:
        return cmd_rollback(cfg_path)

    cfg = load_config(cfg_path)
    helper = DFlightHelper(cfg)
    serve(helper)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
