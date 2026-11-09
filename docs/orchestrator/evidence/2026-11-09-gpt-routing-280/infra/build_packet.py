#!/usr/bin/env python3
"""Build the review packet locally. This script has no deployment capability."""
from pathlib import Path
import difflib
import hashlib
import json

ROOT = Path(__file__).resolve().parent
BASE_NGINX = "ebdfcdcbbddf9c4ffcad20f7f8cab79c588bdb66eabd40a2dffd5f17b2aad4ca"
BASE_GATEWAY = "dd329ce310bea97f4900a065ea91083d7853047173ba53ea2a6f092d07ae3625"
ORIGIN = "https://ionos-n8n-new.tailc01234.ts.net"
INSERT = (
    "    # TMAR GIS HTTPS443 BEGIN: new locations only.\n"
    "    include /etc/nginx/snippets/goi-gis-https443.locations.conf;\n"
    "    # TMAR GIS HTTPS443 END\n\n"
)


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> None:
    nginx = (ROOT / "baseline/nginx.before.conf").read_bytes()
    gateway = (ROOT / "baseline/goi_ors_gateway.before.py").read_bytes()
    assert sha(nginx) == BASE_NGINX, "NGINX_BASE_CHANGED"
    assert sha(gateway) == BASE_GATEWAY, "GATEWAY_BASE_CHANGED"
    anchor = b"    location = /ors/status {\n"
    assert nginx.count(anchor) == 1
    nginx_after = nginx.replace(anchor, INSERT.encode() + anchor, 1)
    before_origin = b'ORIGIN_ALLOWLIST = frozenset({"http://100.99.54.93:8000"})'
    after_origin = (
        b'ORIGIN_ALLOWLIST = frozenset({"http://100.99.54.93:8000", '
        b'"https://ionos-n8n-new.tailc01234.ts.net"})'
    )
    assert gateway.count(before_origin) == 1
    gateway_after = gateway.replace(before_origin, after_origin, 1)
    assert nginx_after.replace(INSERT.encode(), b"", 1) == nginx
    assert gateway_after.replace(after_origin, before_origin, 1) == gateway
    (ROOT / "proposed").mkdir(exist_ok=True)
    (ROOT / "patches").mkdir(exist_ok=True)
    (ROOT / "evidence").mkdir(exist_ok=True)
    pairs = [
        ("nginx", nginx, nginx_after,
         "/etc/nginx/sites-available/goi-ors-gateway", "nginx.after.conf"),
        ("gateway-origin", gateway, gateway_after,
         "/opt/goi-ors-gateway/current/goi_ors_gateway.py", "goi_ors_gateway.after.py"),
    ]
    baselines = {}
    for label, before, after, target, output in pairs:
        (ROOT / "proposed" / output).write_bytes(after)
        diff = "".join(difflib.unified_diff(
            before.decode().splitlines(keepends=True),
            after.decode().splitlines(keepends=True),
            fromfile=target, tofile=target))
        (ROOT / "patches" / (label + ".patch")).write_text(diff)
        baselines[label] = {"target": target, "before_sha256": sha(before),
                            "after_sha256": sha(after)}
    files = {}
    for folder in ("baseline", "proposed", "nginx", "proxy", "systemd", "patches", "evidence"):
        for p in sorted((ROOT / folder).glob("*")):
            if p.is_file():
                b = p.read_bytes()
                files[str(p.relative_to(ROOT))] = {"bytes": len(b), "sha256": sha(b)}
    for name in ("README.md", "build_packet.py", "verify_packet.py", "replace_if_hash.py", "qa_integration.py"):
        p = ROOT / name
        if p.is_file():
            b = p.read_bytes()
            files[name] = {"bytes": len(b), "sha256": sha(b)}
    result = {
        "state": "LOCAL_REVIEW_PACKET_NOT_APPLIED",
        "origin": ORIGIN,
        "baseline_date": "2026-11-09",
        "baselines": baselines,
        "files": files,
        "preservation": {
            "nginx_existing_bytes_restored_by_removing_one_insert": True,
            "gateway_only_exact_origin_allowlist_changes": True,
            "ors_catalogo_vps_tls_listen_unchanged": True,
        },
        "authorization": "User approval required before VPS installation/reload/restart",
    }
    (ROOT / "manifest.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({"state": result["state"], "baselines": baselines,
                      "files": len(files), "preservation": result["preservation"]}))


if __name__ == "__main__":
    main()
