#!/usr/bin/env python3
"""Execute the approved HTTPS443 packet; no provider POST or HTML deployment.

The containing backup directory and packet are prepared by the transport script.
Every service-changing attempt is recorded before execution. A failed apply
calls the packet's per-file/per-phase rollback, retaining the audit directory.
"""
from pathlib import Path
import datetime
import hashlib
import http.client
import json
import os
import re
import socket
import ssl
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parent
PACKET = ROOT / "packet"
STATE = ROOT / "state.json"
ORIGIN = "https://ionos-n8n-new.tailc01234.ts.net"
HOST = "ionos-n8n-new.tailc01234.ts.net"
UNIT = "goi-gis-https443-proxy"
MANIFEST_SHA = "cb35d9035c4e2aed757ac76ee827007769a5fe98aae2ccb7b4013622d085874e"
RUNTIME_SHA = "bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253"
NEW_DIR = Path("/opt/goi-gis-https443")
INSTALL = {
    "proxy/gis_same_origin_proxy.py": str(NEW_DIR / "gis_same_origin_proxy.py"),
    "nginx/goi-gis-https443.common.conf": "/etc/nginx/snippets/goi-gis-https443.common.conf",
    "nginx/goi-gis-https443.locations.conf": "/etc/nginx/snippets/goi-gis-https443.locations.conf",
    "systemd/goi-gis-https443-proxy.service": "/etc/systemd/system/goi-gis-https443-proxy.service",
}
manifest = json.loads((PACKET / "manifest.json").read_text())
state = json.loads(STATE.read_text())


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def sync_directory(path):
    descriptor = os.open(path, os.O_RDONLY)
    try:
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


def save(event=None, value=None):
    if event:
        state.setdefault("events", []).append({"at_utc": now(), "event": event, "value": value})
    temporary = ROOT / ".state.pending"
    with open(temporary, "w") as f:
        os.fchmod(f.fileno(), 0o600)
        json.dump(state, f, indent=2)
        f.write("\n")
        f.flush()
        os.fsync(f.fileno())
    os.replace(temporary, STATE)
    sync_directory(ROOT)


def same_inode(path, identity):
    if path.is_symlink() or not path.exists():
        return False
    metadata = path.stat()
    return metadata.st_dev == identity["device"] and metadata.st_ino == identity["inode"]


def install_new(relative, target):
    """Publish complete bytes with an exclusive hard link; never overwrite."""
    target = Path(target)
    data = (PACKET / relative).read_bytes()
    expected = manifest["files"][relative]["sha256"]
    assert sha(data) == expected
    descriptor, temporary_name = tempfile.mkstemp(prefix=".gis-https443-new-", dir=target.parent)
    temporary = Path(temporary_name)
    metadata = os.fstat(descriptor)
    identity = {"temporary": str(temporary), "target": str(target),
                "device": metadata.st_dev, "inode": metadata.st_ino, "sha256": expected}
    try:
        state.setdefault("install_temporary", {})[relative] = identity
        save("temporary_created", identity)
        with os.fdopen(descriptor, "wb") as output:
            descriptor = None
            output.write(data)
            os.fchmod(output.fileno(), 0o644)
            output.flush()
            os.fsync(output.fileno())
        assert same_inode(temporary, identity) and sha(temporary.read_bytes()) == expected
        # Persist ownership before linking, so interruption after link is recoverable.
        state.setdefault("install_prepared", {})[relative] = identity
        save("exclusive_link_attempt", identity)
        os.link(temporary, target, follow_symlinks=False)
        sync_directory(target.parent)
        assert same_inode(target, identity) and sha(target.read_bytes()) == expected
        state["installed"][relative] = str(target)
        save("installed_file", str(target))
    finally:
        if descriptor is not None:
            os.close(descriptor)
        if temporary.exists():
            assert same_inode(temporary, identity), "TEMPORARY_IDENTITY_CHANGED"
            temporary.unlink()
            sync_directory(temporary.parent)


def run(args, *, required=True):
    p = subprocess.run(args, capture_output=True, text=True, timeout=35)
    result = {"argv": args, "code": p.returncode,
              "stdout": p.stdout.strip()[:4000], "stderr": p.stderr.strip()[:4000]}
    save("command", result)
    if required and p.returncode:
        raise RuntimeError("COMMAND_FAILED: " + " ".join(args[:3]))
    return result


def attempt(flag, args):
    state[flag] = True
    save("attempt", flag)
    return run(args)


def fetch(url, origin=None, method="GET"):
    headers = {"Origin": origin} if origin else {}
    request = urllib.request.Request(url, headers=headers, method=method)
    try:
        response = urllib.request.urlopen(request, timeout=25, context=ssl.create_default_context())
    except urllib.error.HTTPError as error:
        response = error
    with response:
        body = response.read()
        return {"status": response.status, "bytes": len(body), "sha256": sha(body),
                "content_type": response.headers.get("Content-Type"),
                "allow_origin": response.headers.get("Access-Control-Allow-Origin"),
                "content_length": response.headers.get("Content-Length")}


def services():
    result = run(["systemctl", "show", "nginx", "goi-ors-gateway", "goi-gis-app", UNIT,
                  "--property=Id,ActiveState,MainPID,LoadState,UnitFileState"])
    parsed = {}
    for block in result["stdout"].split("\n\n"):
        values = dict(line.split("=", 1) for line in block.splitlines() if "=" in line)
        parsed[values["Id"]] = values
    return parsed


def shared_listeners():
    output = run(["ss", "-H", "-ltnp", "( sport = :8989 or sport = :8089 or sport = :8099 or sport = :8000 )"])["stdout"]
    rows = []
    for line in output.splitlines():
        rows.append({"address": line.split()[3], "pids": sorted(set(re.findall(r"pid=(\d+)", line)))})
    return sorted(rows, key=lambda row: row["address"])


def replace(label, reverse=False):
    entry = manifest["baselines"][label]
    target = Path(entry["target"])
    assert str(target.resolve()) == state["targets"][label]["resolved"], "RESOLVED_TARGET_CHANGED"
    if label == "nginx":
        source = "baseline/nginx.before.conf" if reverse else "proposed/nginx.after.conf"
    else:
        source = "baseline/goi_ors_gateway.before.py" if reverse else "proposed/goi_ors_gateway.after.py"
    old = entry["after_sha256"] if reverse else entry["before_sha256"]
    new = entry["before_sha256"] if reverse else entry["after_sha256"]
    save("replace_attempt", {"target": label, "reverse": reverse})
    run([sys.executable, "-B", str(PACKET / "replace_if_hash.py"), str(target), str(PACKET / source), old, new])
    save("replace_completed", {"target": label, "reverse": reverse})


def rollback():
    state["status"] = "ROLLBACK_STARTED"
    save("rollback_started")
    conflicts = []
    for label, entry in manifest["baselines"].items():
        path = Path(entry["target"])
        current = sha(path.read_bytes())
        if str(path.resolve()) != state["targets"][label]["resolved"]:
            conflicts.append(label + ": resolved path changed")
        elif current == entry["after_sha256"]:
            replace(label, reverse=True)
        elif current != entry["before_sha256"]:
            conflicts.append(label + ": unknown current hash")
    managed = dict(state.get("installed", {}))
    # A complete target may have been linked before its completion journal write.
    for relative, identity in state.get("install_prepared", {}).items():
        path = Path(identity["target"])
        if path.exists() or path.is_symlink():
            if same_inode(path, identity) and sha(path.read_bytes()) == identity["sha256"]:
                managed[relative] = str(path)
            else:
                conflicts.append(str(path) + ": not the exclusively linked file")
    for relative, name in managed.items():
        path = Path(name)
        if path.exists() and (path.is_symlink() or sha(path.read_bytes()) != manifest["files"][relative]["sha256"]):
            conflicts.append(name + ": changed installed file")
    for identity in state.get("install_temporary", {}).values():
        temporary = Path(identity["temporary"])
        if temporary.exists() or temporary.is_symlink():
            if same_inode(temporary, identity):
                temporary.unlink()
                sync_directory(temporary.parent)
            else:
                conflicts.append(str(temporary) + ": temporary identity changed")
    if conflicts:
        state["status"] = "ROLLBACK_CONFLICT"
        state["rollback_conflicts"] = conflicts
        save("rollback_conflicts", conflicts)
        return
    if state.get("ors_restart_attempted") or state.get("nginx_reload_attempted"):
        run(["nginx", "-t"])
        if state.get("ors_restart_attempted"):
            run(["systemctl", "restart", "goi-ors-gateway"])
        if state.get("nginx_reload_attempted"):
            run(["systemctl", "reload", "nginx"])
    if state.get("proxy_start_attempted"):
        run(["systemctl", "stop", UNIT])
    if state.get("proxy_enable_attempted"):
        run(["systemctl", "disable", UNIT])
    for relative, name in managed.items():
        path = Path(name)
        if path.exists():
            assert not path.is_symlink() and sha(path.read_bytes()) == manifest["files"][relative]["sha256"]
            path.unlink()
            save("removed_installed_file", name)
    if state.get("directory_created") and NEW_DIR.exists():
        NEW_DIR.rmdir()
    if state.get("daemon_reload_attempted"):
        run(["systemctl", "daemon-reload"])
    assert not run(["ss", "-H", "-ltn", "sport = :18080"])["stdout"]
    runtime = fetch("http://100.99.54.93:8000/coordinate_converter%20Claude.html")
    assert runtime["status"] == 200 and runtime["sha256"] == RUNTIME_SHA
    state["rollback_runtime"] = runtime
    state["rollback_services"] = services()
    state["rollback_original_hashes"] = {}
    for label, entry in manifest["baselines"].items():
        path = Path(entry["target"])
        assert str(path.resolve()) == state["targets"][label]["resolved"]
        current = sha(path.read_bytes())
        assert current == entry["before_sha256"], "ROLLBACK_HASH_NOT_ORIGINAL"
        state["rollback_original_hashes"][label] = current
    for name in ("nginx.service", "goi-ors-gateway.service", "goi-gis-app.service"):
        assert state["rollback_services"][name]["ActiveState"] == "active", "ROLLBACK_SERVICE_NOT_ACTIVE"
    expected = json.loads((ROOT / "preflight.json").read_text())["http"]
    original_http = {"ors_old_origin": fetch(ORIGIN + "/ors/status", "http://100.99.54.93:8000")}
    assert original_http["ors_old_origin"]["status"] == 200
    assert original_http["ors_old_origin"]["allow_origin"] == "http://100.99.54.93:8000"
    for label, path in (("catalogo", "/catalogo/"), ("vps", "/vps/"), ("root", "/")):
        original_http[label] = fetch(ORIGIN + path)
        for key in ("status", "bytes", "sha256", "content_type"):
            assert original_http[label][key] == expected[label][key], "ROLLBACK_ENDPOINT_CHANGED:" + label
    state["rollback_original_http"] = original_http
    state["status"] = "ROLLED_BACK"
    save("rollback_completed")


def apply():
    assert state["status"] == "PACKET_STAGED", "FRESH_APPLY_REQUIRED"
    assert sha((PACKET / "manifest.json").read_bytes()) == MANIFEST_SHA
    run([sys.executable, "-B", str(PACKET / "verify_packet.py")])
    assert not NEW_DIR.exists() and not NEW_DIR.is_symlink()
    for target in INSTALL.values():
        path = Path(target)
        assert not path.exists() and not path.is_symlink(), "INSTALLED_PATH_ALREADY_EXISTS"
    assert not run(["ss", "-H", "-ltn", "sport = :18080"])["stdout"]
    assert "LoadState=not-found" in run(["systemctl", "show", UNIT, "--property=LoadState"])["stdout"]
    state["targets"] = {}
    for label, entry in manifest["baselines"].items():
        path = Path(entry["target"])
        data = path.read_bytes()
        assert sha(data) == entry["before_sha256"], "BASELINE_CHANGED"
        metadata = path.stat()
        state["targets"][label] = {"path": str(path), "resolved": str(path.resolve()),
                                  "uid": metadata.st_uid, "gid": metadata.st_gid, "mode": metadata.st_mode & 0o7777}
        with open(ROOT / (label + ".original"), "xb") as backup:
            os.fchmod(backup.fileno(), 0o600)
            backup.write(data)
            backup.flush()
            os.fsync(backup.fileno())
    state["services_before"] = services()
    state["shared_listeners_before"] = shared_listeners()
    state["status"] = "BACKUPS_READY"
    save("backups_ready", state["targets"])
    try:
        NEW_DIR.mkdir(mode=0o755)
        NEW_DIR.chmod(0o755)
        state["directory_created"] = True
        save("directory_created", str(NEW_DIR))
        state["installed"] = {}
        for relative, target in INSTALL.items():
            install_new(relative, target)
        attempt("daemon_reload_attempted", ["systemctl", "daemon-reload"])
        attempt("proxy_start_attempted", ["systemctl", "start", UNIT])
        for index in range(12):
            try:
                connection = http.client.HTTPConnection("127.0.0.1", 18080, timeout=20)
                connection.request("GET", "/_routing/gh/info", headers={"Host": HOST, "Origin": ORIGIN, "Sec-Fetch-Site": "same-origin"})
                response = connection.getresponse()
                body = response.read()
                status = response.status
                connection.close()
                assert status == 200, "LOOPBACK_PROXY_INFO_FAILED"
                state["loopback_info"] = {"status": status, "bytes": len(body), "sha256": sha(body)}
                break
            except (OSError, http.client.HTTPException):
                if index == 11:
                    raise
                time.sleep(0.25)
        listeners = run(["ss", "-H", "-ltn", "sport = :18080"])["stdout"].splitlines()
        assert len(listeners) == 1 and "127.0.0.1:18080" in listeners[0], "NOT_LOOPBACK_ONLY"
        save("proxy_loopback_verified", state["loopback_info"])
        replace("nginx")
        replace("gateway-origin")
        run(["nginx", "-t"])
        attempt("ors_restart_attempted", ["systemctl", "restart", "goi-ors-gateway"])
        for index in range(12):
            try:
                gateway = fetch("http://127.0.0.1:8020/ors/status", ORIGIN)
                assert gateway["status"] == 200 and gateway["allow_origin"] == ORIGIN
                state["gateway_restart_health"] = gateway
                break
            except (OSError, urllib.error.URLError):
                if index == 11:
                    raise
                time.sleep(0.25)
        attempt("nginx_reload_attempted", ["systemctl", "reload", "nginx"])
        context = ssl.create_default_context()
        with socket.create_connection((HOST, 443), timeout=15) as raw:
            with context.wrap_socket(raw, server_hostname=HOST) as tls:
                cert = tls.getpeercert()
                state["tls"] = {"hostname_verified": HOST, "protocol": tls.version(),
                                "cipher": tls.cipher()[0], "not_before": cert["notBefore"],
                                "not_after": cert["notAfter"], "san": cert.get("subjectAltName", [])}
        expected = json.loads((ROOT / "preflight.json").read_text())["http"]
        # Reload is asynchronous: allow only a short old-worker 404 transition.
        for index in range(12):
            gis = fetch(ORIGIN + "/gis")
            if gis["status"] == 200 or gis["status"] != 404:
                break
            time.sleep(0.25)
        checks = {"gis_https": gis}
        save("postcheck", {"label": "gis_https", "result": gis})
        for label, url, origin in [
            ("runtime_http", "http://100.99.54.93:8000/coordinate_converter%20Claude.html", None),
            ("gh_info", ORIGIN + "/_routing/gh/info", ORIGIN),
            ("ors_old_origin", ORIGIN + "/ors/status", "http://100.99.54.93:8000"),
            ("ors_new_origin", ORIGIN + "/ors/status", ORIGIN),
            ("ors_foreign_origin", ORIGIN + "/ors/status", "https://example.invalid"),
            ("catalogo", ORIGIN + "/catalogo/", None),
            ("vps", ORIGIN + "/vps/", None),
            ("root", ORIGIN + "/", None),
            ("gh_unknown_path", ORIGIN + "/_routing/gh/disabled", None),
        ]:
            checks[label] = fetch(url, origin)
            save("postcheck", {"label": label, "result": checks[label]})
        for label in ("gis_https", "runtime_http"):
            assert checks[label]["status"] == 200 and checks[label]["sha256"] == RUNTIME_SHA
        assert checks["gh_info"]["status"] == 200
        for label, origin in (("ors_old_origin", "http://100.99.54.93:8000"), ("ors_new_origin", ORIGIN)):
            assert checks[label]["status"] == 200 and checks[label]["allow_origin"] == origin
        assert checks["ors_foreign_origin"]["status"] == 403
        assert checks["gh_unknown_path"]["status"] == 404
        for label in ("catalogo", "vps", "root"):
            for key in ("status", "bytes", "sha256", "content_type"):
                assert checks[label][key] == expected[label][key], "SHARED_ENDPOINT_CHANGED:" + label + ":" + key
        checks["gis_head"] = fetch(ORIGIN + "/gis", method="HEAD")
        assert checks["gis_head"]["status"] == 200 and checks["gis_head"]["bytes"] == 0
        state["http_after"] = checks
        state["shared_listeners_after"] = shared_listeners()
        assert state["shared_listeners_before"] == state["shared_listeners_after"], "SHARED_LISTENERS_CHANGED"
        current = services()
        for name in ("nginx.service", "goi-gis-app.service"):
            assert current[name]["MainPID"] == state["services_before"][name]["MainPID"]
        for name in ("nginx.service", "goi-gis-app.service", "goi-ors-gateway.service", UNIT + ".service"):
            assert current[name]["ActiveState"] == "active"
        for label, entry in manifest["baselines"].items():
            assert sha(Path(entry["target"]).read_bytes()) == entry["after_sha256"]
        attempt("proxy_enable_attempted", ["systemctl", "enable", UNIT])
        state["services_after"] = services()
        assert state["services_after"][UNIT + ".service"]["UnitFileState"] == "enabled"
        state["status"] = "APPLIED_PASS"
        state["completed_at_utc"] = now()
        save("apply_completed")
    except BaseException as error:
        state["apply_error"] = type(error).__name__ + ": " + str(error)
        save("apply_failed", state["apply_error"])
        try:
            rollback()
        except BaseException as rollback_error:
            state["status"] = "ROLLBACK_INCOMPLETE"
            state["rollback_error"] = type(rollback_error).__name__ + ": " + str(rollback_error)
            save("rollback_failed", state["rollback_error"])
        raise


if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in ("apply", "rollback"):
        raise SystemExit("Usage: apply_authorized.py apply|rollback")
    try:
        apply() if sys.argv[1] == "apply" else rollback()
    finally:
        print(json.dumps({"status": state["status"], "backup_directory": str(ROOT),
                          "apply_error": state.get("apply_error"), "rollback_error": state.get("rollback_error")}), flush=True)
