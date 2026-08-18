# GOI ORS directions gateway (INFRA1)

Loopback Python micro-gateway + nginx TLS on the Tailscale interface. **Not** a generic proxy.

This directory is the Git source of truth. Runtime on the VPS: `/opt/goi-ors-gateway/current/`. The GIS monolite is **not** wired to this gateway in INFRA1.

## Architecture

```text
browser (future)  --HTTPS-->  nginx :443 @ Tailscale IP
                                  |
                                  | HTTP loopback
                                  v
                          goi-ors-gateway :127.0.0.1:8020
                                  |
                                  | only if ORS_API_KEY PRESENT
                                  v
                     https://api.openrouteservice.org/v2/directions/{profile}/geojson
```

## Public HTTPS URL (stable)

- Status: `https://ubuntu.tailc01234.ts.net/ors/status`
- Directions: `https://ubuntu.tailc01234.ts.net/ors/v2/directions/{profile}/geojson`
  - profiles: `foot-hiking` | `foot-walking` | `cycling-mountain`
  - method: POST JSON only

## Service / paths

| Voce | Valore |
| --- | --- |
| systemd | `goi-ors-gateway.service` |
| Code | `/opt/goi-ors-gateway/current/goi_ors_gateway.py` |
| nginx site | `/etc/nginx/sites-available/goi-ors-gateway` |
| TLS cert | `/etc/goi-ors/tls/fullchain.pem` (Tailscale / Let's Encrypt) |
| TLS key | `/etc/goi-ors/tls/privkey.pem` |
| Cert renew | `goi-ors-cert-renew.timer` (weekly) |
| Secret name | `ORS_API_KEY` |
| Secret file | `/etc/systemd/ors-credentials/ORS_API_KEY` (optional; **do not commit**) |

## Secret contract

- Canonical name: **`ORS_API_KEY`**
- Never in repo, nginx responses, journal bodies, or status JSON value
- `/ors/status` reports `"secret": "PRESENT"` or `"ABSENT"` only
- If ABSENT/empty: service stays **ready**; POST directions returns **503** `secret_not_configured` and **does not** call upstream
- To provision later (not this pass): write the file mode 0640 `root:goi-ors`, then `systemctl restart goi-ors-gateway` (optional drop-in `LoadCredential=ORS_API_KEY:/etc/systemd/ors-credentials/ORS_API_KEY`)

## Local tests

```bash
python3 -m py_compile infra/ors-gateway/goi_ors_gateway.py
python3 -m unittest discover -s infra/ors-gateway/tests -v
```
