#!/usr/bin/env python3
"""Read-only packet integrity/preservation check. Does not import application code."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parent


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    manifest = json.loads((ROOT / "manifest.json").read_text())
    checked = 0
    for name, expected in manifest["files"].items():
        path = (ROOT / name).resolve()
        assert path.is_relative_to(ROOT), "PATH_OUTSIDE_PACKET"
        data = path.read_bytes()
        assert len(data) == expected["bytes"] and sha(data) == expected["sha256"], "HASH_MISMATCH:" + name
        if path.suffix == ".py":
            compile(data, name, "exec")
        checked += 1
    before = (ROOT / "baseline/nginx.before.conf").read_bytes()
    after = (ROOT / "proposed/nginx.after.conf").read_bytes()
    marker_start = b"    # TMAR GIS HTTPS443 BEGIN: new locations only.\n"
    marker_end = b"    # TMAR GIS HTTPS443 END\n\n"
    assert after.count(marker_start) == after.count(marker_end) == 1
    start = after.index(marker_start)
    end = after.index(marker_end) + len(marker_end)
    assert after[:start] + after[end:] == before, "EXISTING_NGINX_BYTES_CHANGED"
    old = (ROOT / "baseline/goi_ors_gateway.before.py").read_bytes()
    new = (ROOT / "proposed/goi_ors_gateway.after.py").read_bytes()
    old_line = b'ORIGIN_ALLOWLIST = frozenset({"http://100.99.54.93:8000"})'
    new_line = b'ORIGIN_ALLOWLIST = frozenset({"http://100.99.54.93:8000", "https://ionos-n8n-new.tailc01234.ts.net"})'
    assert new.count(new_line) == 1 and new.replace(new_line, old_line, 1) == old, "GATEWAY_OUTSIDE_ORIGIN_CHANGED"
    locations = (ROOT / "nginx/goi-gis-https443.locations.conf").read_text()
    assert "/_routing/ors" not in locations and "/ors/status" not in locations, "ORS_ROUTE_REWRITTEN"
    passes = [line.strip() for line in locations.splitlines() if line.strip().startswith("proxy_pass ")]
    assert passes.count("proxy_pass http://127.0.0.1:18080;") == 3
    assert passes.count("proxy_pass http://127.0.0.1:18080/coordinate_converter%20Claude.html;") == 1
    for name in ("qa_integration.py", "build_packet.py", "replace_if_hash.py"):
        compile((ROOT / name).read_bytes(), name, "exec")
    print(json.dumps({"result": "PASS", "files_checked": checked,
                      "existing_nginx_bytes_identical_outside_insert": True,
                      "gateway_only_one_exact_origin_added": True,
                      "ors_no_loop_route_preserved": True,
                      "network_or_mutations": False}))


if __name__ == "__main__":
    main()
