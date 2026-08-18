#!/usr/bin/env python3
"""Deploy ORS HTTPS gateway INFRA1. Does not restart GIS/GH/proxy/helper. Never writes ORS_API_KEY."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "infra" / "ors-gateway"

REMOTE = r"""
set -euo pipefail
umask 022
echo '=== PID SNAPSHOT PRE ==='
for s in nginx goi-gis-app goi-nav-proxy goi-graphhopper goi-dflight-helper; do
  echo "PRE $s ACTIVE=$(systemctl is-active $s) PID=$(systemctl show -p MainPID --value $s)"
done
TS_IP="$(tailscale ip -4)"
DOMAIN="$(hostname -f)"
echo "TS_IP=$TS_IP DOMAIN=$DOMAIN"

id goi-ors >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin --home-dir /nonexistent goi-ors
mkdir -p /opt/goi-ors-gateway/current /etc/goi-ors/tls /etc/systemd/ors-credentials
chown root:goi-ors /etc/systemd/ors-credentials
chmod 0750 /etc/systemd/ors-credentials

install -o root -g root -m 0644 /tmp/goi-ors-gw/goi_ors_gateway.py /opt/goi-ors-gateway/current/goi_ors_gateway.py
install -o root -g root -m 0644 /tmp/goi-ors-gw/goi-ors-gateway.service /etc/systemd/system/goi-ors-gateway.service
install -o root -g root -m 0755 /tmp/goi-ors-gw/goi-ors-renew-cert.sh /usr/local/sbin/goi-ors-renew-cert
install -o root -g root -m 0644 /tmp/goi-ors-gw/goi-ors-cert-renew.service /etc/systemd/system/goi-ors-cert-renew.service
install -o root -g root -m 0644 /tmp/goi-ors-gw/goi-ors-cert-renew.timer /etc/systemd/system/goi-ors-cert-renew.timer

sed -e "s/__TS_IP__/${TS_IP}/g" -e "s/__TS_DOMAIN__/${DOMAIN}/g" \
  /tmp/goi-ors-gw/nginx-goi-ors-gateway.conf.tmpl \
  > /etc/nginx/sites-available/goi-ors-gateway
ln -sfn /etc/nginx/sites-available/goi-ors-gateway /etc/nginx/sites-enabled/goi-ors-gateway

umask 077
TMPCERT="$(mktemp -d)"
tailscale cert --cert-file "$TMPCERT/cert.pem" --key-file "$TMPCERT/key.pem" "$DOMAIN"
install -o root -g root -m 0644 "$TMPCERT/cert.pem" /etc/goi-ors/tls/fullchain.pem
install -o root -g root -m 0600 "$TMPCERT/key.pem" /etc/goi-ors/tls/privkey.pem
rm -rf "$TMPCERT"
openssl x509 -in /etc/goi-ors/tls/fullchain.pem -noout -subject -issuer -dates

python3 -m py_compile /opt/goi-ors-gateway/current/goi_ors_gateway.py
nginx -t
systemctl daemon-reload
systemctl enable --now goi-ors-gateway.service goi-ors-cert-renew.timer
systemctl reload nginx
sleep 1
systemctl is-active goi-ors-gateway.service
systemctl is-active nginx

echo '=== LISTEN 443 ==='
ss -ltn | awk '/:443/ {print}'

echo '=== VERIFY HTTPS STATUS ==='
curl -fsS --resolve "${DOMAIN}:443:${TS_IP}" "https://${DOMAIN}/ors/status" -o /tmp/ors_status.json
echo -n 'STATUS_JSON='
cat /tmp/ors_status.json
echo
python3 - <<'PY'
import json
d=json.load(open("/tmp/ors_status.json",encoding="utf-8"))
assert d.get("service")=="goi-ors-gateway"
assert d.get("status")=="ready"
assert d.get("secret") in ("ABSENT","PRESENT")
assert d.get("secret_name")=="ORS_API_KEY"
assert "BEGIN" not in json.dumps(d)
print("STATUS_SECRET", d.get("secret"))
print("STATUS_OK")
PY

echo '=== VERIFY FAIL-CLOSED NO SECRET ==='
CODE="$(curl -sS -o /tmp/ors_post.json -w '%{http_code}' --resolve "${DOMAIN}:443:${TS_IP}" \
  -H 'Content-Type: application/json' \
  -X POST "https://${DOMAIN}/ors/v2/directions/foot-hiking/geojson" \
  --data '{"coordinates":[[9.83,44.11],[9.84,44.12]],"elevation":true}')"
echo "POST_CODE=$CODE"
python3 - <<'PY'
import json
d=json.load(open("/tmp/ors_post.json",encoding="utf-8"))
print("POST_BODY_KEYS", sorted(d.keys()))
assert d.get("error")=="secret_not_configured"
assert d.get("error_category")=="auth"
print("FAIL_CLOSED_OK")
PY
test "$CODE" = "503"

echo '=== OPEN PROXY NEGATIVE ==='
c_root="$(curl -sS -o /tmp/ors_root.json -w '%{http_code}' --resolve "${DOMAIN}:443:${TS_IP}" "https://${DOMAIN}/")"
c_drive="$(curl -sS -o /tmp/ors_drive.json -w '%{http_code}' --resolve "${DOMAIN}:443:${TS_IP}" \
  -H 'Content-Type: application/json' -X POST "https://${DOMAIN}/ors/v2/directions/driving-car/geojson" --data '{}')"
c_getdir="$(curl -sS -o /tmp/ors_getdir.json -w '%{http_code}' --resolve "${DOMAIN}:443:${TS_IP}" \
  "https://${DOMAIN}/ors/v2/directions/foot-hiking/geojson")"
echo "ROOT_CODE=$c_root DRIVE_CODE=$c_drive GETDIR_CODE=$c_getdir"
test "$c_root" = "404"
test "$c_drive" = "404"
python3 - <<PY
codes = {"root": "$c_root", "drive": "$c_drive", "getdir": "$c_getdir"}
print("NEG_CODES", codes)
assert codes["getdir"] in ("403","405")
print("OPEN_PROXY_NEG_OK")
PY

echo '=== NO PUBLIC 443 ==='
if ss -ltn | awk '$4 ~ /0.0.0.0:443$/ || $4 ~ /\[::\]:443$/ {found=1} END { exit found ? 0 : 1 }'; then
  echo "BIND_443_PUBLIC_FAIL"
  exit 1
fi
echo "BIND_443_TAILNET_ONLY_OK"

echo '=== JOURNAL SECRET SCAN ==='
journalctl -u goi-ors-gateway -n 80 --no-pager | python3 - <<'PY'
import sys,re
txt=sys.stdin.read()
bad=False
if "BEGIN " in txt and "PRIVATE KEY" in txt:
    bad=True
if re.search(r"Authorization:\s+\S{8,}", txt, re.I):
    bad=True
print("JOURNAL_SECRET_LEAK", "YES" if bad else "NO")
sys.exit(1 if bad else 0)
PY

echo '=== PID SNAPSHOT POST ==='
for s in nginx goi-gis-app goi-nav-proxy goi-graphhopper goi-dflight-helper; do
  echo "POST $s ACTIVE=$(systemctl is-active $s) PID=$(systemctl show -p MainPID --value $s)"
done
echo "ORS_ACTIVE=$(systemctl is-active goi-ors-gateway) ORS_PID=$(systemctl show -p MainPID --value goi-ors-gateway)"
echo "INFRA1_DEPLOY_PASS"
echo "GATEWAY_URL=https://${DOMAIN}/ors/status"
echo "DIRECTIONS_URL=https://${DOMAIN}/ors/v2/directions/{profile}/geojson"
"""


def main() -> None:
    files = [
        "goi_ors_gateway.py",
        "goi-ors-gateway.service",
        "nginx-goi-ors-gateway.conf.tmpl",
        "goi-ors-renew-cert.sh",
        "goi-ors-cert-renew.service",
        "goi-ors-cert-renew.timer",
    ]
    for fn in files:
        p = SRC / fn
        if not p.is_file():
            raise SystemExit(f"missing {p}")
    subprocess.run(["ssh", "ionos-n8n", "mkdir", "-p", "/tmp/goi-ors-gw"], check=True)
    cmd = ["scp"] + [str(SRC / fn) for fn in files] + ["ionos-n8n:/tmp/goi-ors-gw/"]
    subprocess.run(cmd, check=True)
    r = subprocess.run(["ssh", "ionos-n8n", "bash", "-s"], input=REMOTE.encode("utf-8"))
    raise SystemExit(r.returncode)


if __name__ == "__main__":
    main()
