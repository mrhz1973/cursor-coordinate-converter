#!/usr/bin/env python3
"""Run only with an unprivileged uid and loopback mock upstreams; never deploy."""
from __future__ import annotations

import hashlib
import http.client
import importlib.util
import json
import logging
import os
from pathlib import Path
import shutil
import signal
import socket
import ssl
import subprocess
import sys
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = Path(__file__).resolve().parent
DOMAIN = "ionos-n8n-new.tailc01234.ts.net"
ORIGIN = "https://" + DOMAIN
PROXY_SHA = "ae32a22ac5b66fc4771e3d19d5fe7f89b34ce6ccfec0e1c02dc792a4165dc06d"


def require(value, name):
    if not value:
        raise AssertionError(name)


def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def quiet(args):
    result = subprocess.run(args, capture_output=True, timeout=25)
    require(result.returncode == 0, "COMMAND_FAILED:" + Path(args[0]).name + ":" + result.stderr.decode(errors="replace")[-1500:])


class VerifiedLoopbackHTTPS(http.client.HTTPSConnection):
    def connect(self):
        raw = socket.create_connection(("127.0.0.1", self.port), self.timeout)
        self.sock = self._context.wrap_socket(raw, server_hostname=DOMAIN)


def ephemeral_tls(root):
    ca_key, ca, key, csr, cert, ext = [root / n for n in ("ca.key", "ca.pem", "server.key", "server.csr", "server.pem", "server.ext")]
    ext.write_text("subjectAltName=DNS:" + DOMAIN + "\nextendedKeyUsage=serverAuth\n")
    quiet(["openssl", "req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", str(ca_key), "-out", str(ca), "-days", "1", "-subj", "/CN=GIS-Isolated-QA-CA"])
    quiet(["openssl", "req", "-newkey", "rsa:2048", "-nodes", "-keyout", str(key), "-out", str(csr), "-subj", "/CN=" + DOMAIN])
    quiet(["openssl", "x509", "-req", "-in", str(csr), "-CA", str(ca), "-CAkey", str(ca_key), "-CAcreateserial", "-out", str(cert), "-days", "1", "-extfile", str(ext)])
    return ca, cert, key


def simple_mock(label, payload):
    seen_paths = []
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            return

        def do_GET(self):
            seen_paths.append(self.path)
            self.send_response(200)
            self.send_header("Content-Type", "text/html" if label == "gis" else "text/plain")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

        def do_HEAD(self):
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    server.seen_paths = seen_paths
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def main():
    require(os.name == "posix" and os.geteuid() != 0, "REQUIRES_UNPRIVILEGED_LINUX")
    nginx = shutil.which("nginx") or "/usr/sbin/nginx"
    require(Path(nginx).is_file(), "NGINX_MISSING")
    require(hashlib.sha256((ROOT / "proxy/gis_same_origin_proxy.py").read_bytes()).hexdigest() == PROXY_SHA, "PINNED_PROXY_CHANGED")
    sys.dont_write_bytecode = True
    os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
    sys.path.insert(0, str(ROOT / "proxy"))
    proxy = load_module("gis_same_origin_proxy", ROOT / "proxy/gis_same_origin_proxy.py")
    mocks = load_module("gis_proxy_test_mocks", ROOT / "proxy/test_gis_same_origin_proxy.py")
    gateway = load_module("gis_test_gateway", ROOT / "proposed/goi_ors_gateway.after.py")
    gateway.log.handlers[:] = [logging.NullHandler()]
    gateway.log.propagate = False
    # Replace every credential/provider entry point before instantiating Handler.
    gateway.read_secret_status = lambda: ("PRESENT", "SYNTHETIC_QA_ONLY")
    gateway.urlopen = lambda *a, **k: (_ for _ in ()).throw(AssertionError("EXTERNAL_NETWORK_FORBIDDEN"))
    gateway_calls = []

    def fake_directions(profile, body, secret):
        require(secret == "SYNTHETIC_QA_ONLY", "UNEXPECTED_CREDENTIAL")
        gateway_calls.append(profile)
        return 200, {"type": "FeatureCollection", "features": []}, "application/geo+json"

    gateway.forward_directions = fake_directions
    checks = []
    servers = []
    nginx_process = None
    temp = tempfile.TemporaryDirectory(prefix="gis-443-it-", dir="/dev/shm")
    work = Path(temp.name)
    os.chmod(work, 0o700)
    try:
        mount = subprocess.run(["findmnt", "-n", "-o", "FSTYPE", "--target", str(work)], capture_output=True, text=True)
        require(mount.returncode == 0 and mount.stdout.strip() == "tmpfs", "TMPFS_REQUIRED")
        ca, cert, key = ephemeral_tls(work)
        context = ssl.create_default_context(cafile=str(ca))
        require(context.check_hostname and context.verify_mode == ssl.CERT_REQUIRED, "TLS_VERIFICATION_REQUIRED")
        static_body = b"<html>GIS_QA_STATIC</html>" + b" " * (3 * 1024 * 1024)
        gis = simple_mock("gis", static_body)
        catalogo = simple_mock("catalogo", b"CATALOGO_UNCHANGED")
        panel = simple_mock("vps", b"VPS_UNCHANGED")
        gh_state = mocks.MockState()
        gh = mocks.make_mock("gh", gh_state)
        ors = ThreadingHTTPServer(("127.0.0.1", 0), gateway.Handler)
        ors.daemon_threads = True
        threading.Thread(target=ors.serve_forever, daemon=True).start()
        servers.extend([gis, catalogo, panel, gh, ors])
        allowed_ports = {gis.server_port, gh.server_port}

        def loopback_only_connection(scheme, host, port, timeout):
            require(scheme == "http" and host == "127.0.0.1" and port in allowed_ports, "PROXY_NONLOCAL_TARGET_BLOCKED")
            return http.client.HTTPConnection(host, port, timeout=timeout)

        targets = {"gis": ("http", "127.0.0.1", gis.server_port),
                   "gh": ("http", "127.0.0.1", gh.server_port),
                   "ors": ("https", "127.0.0.1", ors.server_port)}
        proxyd = proxy.create_server(ORIGIN, bind_host="127.0.0.1", bind_port=0,
                                    targets=targets, connection_factory=loopback_only_connection)
        threading.Thread(target=proxyd.serve_forever, daemon=True).start()
        servers.append(proxyd)
        with socket.socket() as reserve:
            reserve.bind(("127.0.0.1", 0))
            nginx_port = reserve.getsockname()[1]
        common = ROOT.joinpath("nginx/goi-gis-https443.common.conf").read_text()
        locations = ROOT.joinpath("nginx/goi-gis-https443.locations.conf").read_text()
        locations = locations.replace("/etc/nginx/snippets/goi-gis-https443.common.conf", str(work / "common.conf"))
        locations = locations.replace("127.0.0.1:18080", f"127.0.0.1:{proxyd.server_port}")
        (work / "common.conf").write_text(common)
        (work / "locations.conf").write_text(locations)
        server = ROOT.joinpath("proposed/nginx.after.conf").read_text()
        replacements = {
            "listen 100.99.54.93:443 ssl;": f"listen 127.0.0.1:{nginx_port} ssl;",
            "/etc/goi-ors/tls/fullchain.pem": str(cert),
            "/etc/goi-ors/tls/privkey.pem": str(key),
            "/var/log/nginx/goi-ors-gateway.access.log": str(work / "shared.access.log"),
            "/var/log/nginx/goi-ors-gateway.error.log": str(work / "shared.error.log"),
            "/etc/nginx/snippets/goi-gis-https443.locations.conf": str(work / "locations.conf"),
            "127.0.0.1:8020": f"127.0.0.1:{ors.server_port}",
            "127.0.0.1:8089": f"127.0.0.1:{catalogo.server_port}",
            "127.0.0.1:8099": f"127.0.0.1:{panel.server_port}",
        }
        for old, new in replacements.items():
            require(old in server, "FIXTURE_REPLACEMENT_MISSING:" + old)
            server = server.replace(old, new)
        for dirname in ("body", "proxy", "fastcgi", "uwsgi", "scgi"):
            (work / dirname).mkdir(mode=0o700)
        conf = (
            f'worker_processes 1;\npid "{work / "nginx.pid"}";\nerror_log "{work / "nginx.boot.log"}" crit;\n'
            'events { worker_connections 64; }\nhttp {\n'
            + "\n".join(f'  {directive}_temp_path "{work / folder}";' for directive, folder in
                          (("client_body", "body"), ("proxy", "proxy"), ("fastcgi", "fastcgi"), ("uwsgi", "uwsgi"), ("scgi", "scgi")))
            + "\n" + server + "\n}\n"
        )
        config = work / "nginx.conf"
        config.write_text(conf)
        quiet([nginx, "-t", "-p", str(work) + "/", "-c", str(config)])
        checks.append("nginx_exact_candidate_directives_syntax")
        nginx_process = subprocess.Popen([nginx, "-p", str(work) + "/", "-c", str(config), "-g", "daemon off;"],
                                         stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                                         start_new_session=True)
        for _ in range(50):
            require(nginx_process.poll() is None, "ISOLATED_NGINX_EXITED")
            try:
                c = VerifiedLoopbackHTTPS(DOMAIN, nginx_port, context=context, timeout=1)
                c.connect(); c.close()
                break
            except OSError:
                time.sleep(0.1)
        else:
            raise AssertionError("ISOLATED_TLS_NOT_READY")
        checks.append("tls_chain_and_expected_hostname_verified")

        def request(method, target, body=None, headers=None):
            selected = {"Host": DOMAIN, "Connection": "close", **(headers or {})}
            if body is not None and "Content-Length" not in selected and "Transfer-Encoding" not in selected:
                selected["Content-Length"] = str(len(body))
            c = VerifiedLoopbackHTTPS(DOMAIN, nginx_port, context=context, timeout=30)
            try:
                c.putrequest(method, target, skip_host=True, skip_accept_encoding=True)
                for k, value in selected.items():
                    c.putheader(k, value)
                c.endheaders(body)
                r = c.getresponse()
                return r.status, {k.lower(): v for k, v in r.getheaders()}, r.read()
            finally:
                c.close()

        api = {"Origin": ORIGIN, "Sec-Fetch-Site": "same-origin"}
        status, headers, body = request("GET", "/gis")
        require(status == 200 and body == static_body and headers.get("cache-control") == "no-store", "STATIC_GIS_BYTES")
        status, _, body = request("HEAD", "/gis")
        require(status == 200 and body == b"", "STATIC_HEAD")
        status, _, body = request("GET", "/gis?v=abcdef1234567890")
        require(status == 200 and body == static_body and gis.seen_paths[-1].endswith("?v=abcdef1234567890"), "STATIC_CACHE_BUSTER")
        checks.append("gis_and_head_fixed_static_bytes_and_cache_buster")
        status, _, _ = request("GET", "/_routing/gh/info", headers=api)
        require(status == 200, "GH_INFO")
        status, _, _ = request("GET", "/_routing/gh/nearest?point=44.123456789%2C9.876543210", headers=api)
        require(status == 200, "GH_NEAREST")
        route_body = json.dumps(mocks.gh_route_body(), separators=(",", ":")).encode()
        status, _, _ = request("POST", "/_routing/gh/route", route_body,
                               {**api, "Content-Type": "application/json", "Authorization": "TEST_AUTH_MARKER", "Cookie": "test=TEST_COOKIE_MARKER", "X-Test-Private": "TEST_PRIVATE_MARKER"})
        call = gh_state.last()
        require(status == 200 and not call["has_authorization"] and not call["has_cookie"] and call["origin"] is None, "GH_HEADERS_STRIPPED")
        status, _, _ = request("POST", "/_routing/gh/route", route_body + b" " * (128 * 1024), {**api, "Content-Type": "application/json"})
        require(status == 200, "DEDICATED_GH_LIMIT_ABOVE_64K")
        checks.append("gh_real_proxy_route_body_and_credential_stripping")
        before = gh_state.count()
        cases = [
            ("GET", "/_routing/gh/info?x=1", None, api),
            ("GET", "/_routing/gh/nearest?point=91,181", None, api),
            ("GET", "/_routing/gh/nearest?point=44,9&extra=1", None, api),
            ("GET", "/_routing/gh/%69nfo", None, api),
            ("GET", "/_routing/gh/nearest/?point=44.123456789,9.876543210", None, api),
            ("GET", "/_routing/gh?point=44.123456789,9.876543210", None, api),
            ("GET", "/_routing/gh/info", b"x", api),
            ("POST", "/_routing/gh/route", b'{"profile":"unknown","points":[[0,0],[0.1,0.1]]}', {**api, "Content-Type": "application/json"}),
            ("POST", "/_routing/gh/route", route_body, {"Content-Type": "application/json"}),
            ("POST", "/_routing/gh/route", route_body, {"Origin": "https://evil.invalid", "Content-Type": "application/json"}),
            ("GET", "/_routing/gh/info", None, {**api, "Sec-Fetch-Site": "cross-site"}),
            ("GET", "/_routing/gh/info", None, {**api, "Host": "evil.invalid"}),
            ("POST", "/_routing/gh/route", None, {**api, "Content-Type": "application/json", "Content-Length": str(2 * 1024 * 1024 + 1)}),
            ("POST", "/_routing/gh/route", b"0\r\n\r\n", {**api, "Content-Type": "application/json", "Transfer-Encoding": "chunked"}),
        ]
        for index, case in enumerate(cases):
            status, _, _ = request(*case)
            require(400 <= status < 500 and gh_state.count() == before, "GH_NEGATIVE_CASE_" + str(index))
        checks.append("gh_14_negative_cases_no_upstream")
        proxyd.shutdown()
        proxyd.server_close()
        servers.remove(proxyd)
        status, _, body = request("GET", "/_routing/gh/nearest?point=44.987654321,9.123456789", headers=api)
        require(status == 502 and b"44.987654321" not in body, "NGINX_UPSTREAM_FAILURE")
        checks.append("nginx_proxy_unavailable_error_path")
        require(not any((work / "body").iterdir()) and not any((work / "proxy").iterdir()), "NEW_ROUTES_SPOOLED_TO_DISK")
        for path in (work / "shared.access.log", work / "shared.error.log", work / "nginx.boot.log"):
            text = path.read_bytes() if path.exists() else b""
            require(all(marker not in text for marker in (b"/_routing/gh", b"44.123456789", b"44.987654321", b"TEST_AUTH_MARKER", b"TEST_COOKIE_MARKER", b"TEST_PRIVATE_MARKER")), "NEW_ROUTE_DATA_IN_LOGS")
        checks.append("new_routes_no_body_response_tempfiles_or_sensitive_logs")
        for origin in (ORIGIN, "http://100.99.54.93:8000"):
            status, headers, _ = request("GET", "/ors/status", headers={"Origin": origin})
            require(status == 200 and headers.get("access-control-allow-origin") == origin, "ORS_KNOWN_ORIGIN")
            status, _, _ = request("POST", "/ors/v2/directions/foot-hiking/geojson", b'{"coordinates":[[0,0],[0.1,0.1]]}', {"Origin": origin, "Content-Type": "application/json"})
            require(status == 200, "ORS_KNOWN_ORIGIN_POST")
        for origin in ("https://evil.invalid", "https://ionos-n8n-new.tailc01234.ts.net:8443", "null"):
            before_ors = len(gateway_calls)
            status, _, _ = request("POST", "/ors/v2/directions/foot-hiking/geojson", b'{"coordinates":[[0,0],[0.1,0.1]]}', {"Origin": origin, "Content-Type": "application/json"})
            require(status == 403 and len(gateway_calls) == before_ors, "ORS_UNKNOWN_ORIGIN_BLOCKED")
        status, _, _ = request("POST", "/ors/v2/directions/foot-hiking/geojson", None, {"Origin": ORIGIN, "Content-Type": "application/json", "Content-Length": str(64 * 1024 + 1)})
        require(status == 413, "ORS_64K_LIMIT_PRESERVED")
        status, _, _ = request("GET", "/_routing/ors/status", headers=api)
        require(status == 404, "ORS_PROXY_LOOP_PATH_EXPOSED")
        checks.append("ors_existing_path_gateway_allowlist_and_64k_limit_no_loop")
        require(request("GET", "/catalogo/")[2] == b"CATALOGO_UNCHANGED", "CATALOGO_PRESERVED")
        require(request("GET", "/vps/")[2] == b"VPS_UNCHANGED", "VPS_PRESERVED")
        require(request("GET", "/catalogo")[0] == 301 and request("GET", "/vps")[0] == 301, "REDIRECTS_PRESERVED")
        require(request("GET", "/")[0] == 404, "ROOT_404_PRESERVED")
        checks.append("catalogo_vps_redirects_and_root_behavior_preserved")
        verify = subprocess.run(["systemd-analyze", "verify", "--man=no", str(ROOT / "systemd/goi-gis-https443-proxy.service")], capture_output=True, text=True, timeout=25)
        require(verify.returncode == 0, "SYSTEMD_UNIT_VERIFY:" + verify.stderr[-1500:])
        checks.append("systemd_unit_static_verification")
        result = {"result": "PASS", "checks": checks, "gh_negative_cases": len(cases),
                  "network": "loopback_only_fixed_mock_targets", "uid": os.geteuid(),
                  "credentials": "synthetic_only_no_credential_files_read", "tls_verification": True,
                  "live_services_started_reloaded_restarted": False,
                  "limits": ["Production TLS certificate, provider availability and full application UI were not tested.",
                             "Nginx early HTTP parser errors before location selection inherit the existing shared-server logging policy.",
                             "The deployed systemd sandbox/startup is not exercised by static unit verification."]}
    finally:
        if nginx_process is not None and nginx_process.poll() is None:
            os.killpg(nginx_process.pid, signal.SIGTERM)
            try:
                nginx_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                os.killpg(nginx_process.pid, signal.SIGKILL)
                nginx_process.wait(timeout=5)
        for server in reversed(servers):
            server.shutdown()
            server.server_close()
        temp.cleanup()
        require(not work.exists(), "TMPFS_CLEANUP_FAILED")
    result["temporary_files_cleaned"] = True
    print(json.dumps(result, sort_keys=True))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(json.dumps({"result": "FAIL", "error": type(error).__name__, "detail": str(error)}))
        sys.exit(1)
