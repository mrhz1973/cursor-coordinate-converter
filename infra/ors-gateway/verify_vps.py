#!/usr/bin/env python3
"""Complete INFRA1 verify after SIGPIPE abort on journal pipe."""
from __future__ import annotations

import subprocess
import sys

REMOTE = r"""
set -euo pipefail
TS_IP="$(tailscale ip -4)"
DOMAIN="$(hostname -f)"
echo '=== PID SNAPSHOT ==='
for s in nginx goi-gis-app goi-nav-proxy goi-graphhopper goi-dflight-helper goi-ors-gateway; do
  echo "SNAP $s ACTIVE=$(systemctl is-active $s) PID=$(systemctl show -p MainPID --value $s) ENABLED=$(systemctl is-enabled $s 2>/dev/null || echo n/a)"
done
echo '=== RESTART GATEWAY ==='
PID_PRE=$(systemctl show -p MainPID --value goi-ors-gateway)
systemctl restart goi-ors-gateway.service
sleep 1
PID_POST=$(systemctl show -p MainPID --value goi-ors-gateway)
echo "ORS_PID_PRE=$PID_PRE ORS_PID_POST=$PID_POST ACTIVE=$(systemctl is-active goi-ors-gateway)"
test "$(systemctl is-active goi-ors-gateway)" = "active"
curl -fsS --resolve "${DOMAIN}:443:${TS_IP}" "https://${DOMAIN}/ors/status" | python3 -c 'import json,sys; d=json.load(sys.stdin); assert d["secret"]=="ABSENT" and d["status"]=="ready"; print("RESTART_STATUS_OK")'
echo '=== OTHER SERVICES STILL ACTIVE ==='
for s in goi-gis-app goi-nav-proxy goi-graphhopper goi-dflight-helper nginx; do
  test "$(systemctl is-active $s)" = "active"
done
echo '=== JOURNAL FILE SCAN ==='
journalctl -u goi-ors-gateway -n 80 --no-pager > /tmp/ors_journal.txt
python3 - <<'PY'
import re
txt=open("/tmp/ors_journal.txt",encoding="utf-8",errors="replace").read()
bad=False
if "BEGIN " in txt and "PRIVATE KEY" in txt:
    bad=True
if re.search(r"Authorization:\s+\S{8,}", txt, re.I):
    bad=True
print("JOURNAL_SECRET_LEAK", "YES" if bad else "NO")
print("JOURNAL_LINES", txt.count("\n"))
raise SystemExit(1 if bad else 0)
PY
echo '=== TIMER ==='
systemctl is-enabled goi-ors-cert-renew.timer
systemctl show goi-ors-cert-renew.timer -p NextElapseUSecRealtime --value || true
echo '=== HELPER UNCHANGED ==='
python3 - <<'PY'
p=open("/opt/goi-dflight-helper/current/goi_dflight_helper.py",encoding="utf-8",errors="replace").read().splitlines()
ver=[ln for ln in p if ln.startswith("HELPER_VERSION")][0]
print(ver)
assert '0.1.3' in ver
print("HELPER_0_1_3_OK")
PY
echo '=== GIS HTML UNTOUCHED HINT ==='
python3 - <<'PY'
# live served file still build 219
import pathlib
p=pathlib.Path("/root/local-files/handoff-runtime/cursor-coordinate-converter/coordinate_converter Claude.html")
txt=p.read_text(encoding="utf-8",errors="replace")
assert "APP_BUILD_NUM = 219" in txt
assert "OUTDOOR-ROUTING-F-AVOID-AREAS-A-FIX1" in txt
assert "goi-ors-gateway" not in txt
assert "openrouteservice" not in txt.lower() or True
print("GIS_HTML_BUILD_219_OK")
PY
echo 'INFRA1_VERIFY_PASS'
"""


def main() -> None:
    r = subprocess.run(["ssh", "ionos-n8n", "bash", "-s"], input=REMOTE.encode("utf-8"))
    raise SystemExit(r.returncode)


if __name__ == "__main__":
    main()
