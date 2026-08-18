# GOI ORS directions gateway

Loopback Python micro-gateway + nginx TLS on the Tailscale interface. **Not** a generic proxy.

This directory is the Git source of truth. Runtime on the VPS: `/opt/goi-ors-gateway/current/`.

## Architecture

```text
browser  --HTTPS-->  nginx :443 @ Tailscale IP
                        |
                        | HTTP loopback
                        v
                goi-ors-gateway :127.0.0.1:8020
                        |
                        | only if ORS_API_KEY PRESENT (via systemd LoadCredential)
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
| systemd unit | `goi-ors-gateway.service` |
| Credential drop-in | `/etc/systemd/system/goi-ors-gateway.service.d/credential.conf` |
| Drop-in source | `infra/ors-gateway/goi-ors-gateway.service.d/credential.conf` |
| Code | `/opt/goi-ors-gateway/current/goi_ors_gateway.py` |
| nginx site | `/etc/nginx/sites-available/goi-ors-gateway` |
| TLS cert | `/etc/goi-ors/tls/fullchain.pem` (Tailscale / Let's Encrypt) |
| TLS key | `/etc/goi-ors/tls/privkey.pem` |
| Cert renew | `goi-ors-cert-renew.timer` (weekly) |
| Secret name | `ORS_API_KEY` |
| Secret file | `/etc/systemd/ors-credentials/ORS_API_KEY` (**do not commit**) |

## Secret contract (source of truth)

- Canonical name: **`ORS_API_KEY`**
- On-disk file: **`0600` `root:root`** at `/etc/systemd/ors-credentials/ORS_API_KEY`
- The gateway process **does not** open that path. systemd injects a copy via:

  `LoadCredential=ORS_API_KEY:/etc/systemd/ors-credentials/ORS_API_KEY`

  in the **dedicated drop-in** (not commented, not optional **when the secret file exists**).
- If the secret file is **missing/empty**: **omit** the drop-in so the unit still starts. `/ors/status` → `"secret":"ABSENT"`; POST directions → **503** `secret_not_configured`; **zero** upstream calls.
- If the secret file is **present**: drop-in **must** be installed, then `daemon-reload` + restart. `/ors/status` → `"secret":"PRESENT"` (value never in JSON).
- Never in repo, nginx responses, journal bodies, argv, or process environment dumps.

## Install / redeploy (reproducible from this repo)

```bash
# 1) Gateway + nginx TLS (idempotent ABSENT or PRESENT)
python infra/ors-gateway/deploy_vps.py

# 2) Provision or rotate the key (masked stdin → SSH stdin only)
python infra/ors-gateway/install_secret.py
```

`deploy_vps.py`:

- copies unit, code, nginx template, **and** `credential.conf`
- if `$KEY` exists and is non-empty → install drop-in, expect status **PRESENT**, **skip** 503 probe, **no** ORS upstream request
- if `$KEY` missing → remove drop-in, expect status **ABSENT**, POST **503** fail-closed

`install_secret.py` (after a successful write): install drop-in, `daemon-reload`, restart, verify **PRESENT** + service **active**. Fail-closed with `SECRET_INSTALL_FAIL phase=…` (no secret leak).

## Local tests

```bash
python -m py_compile infra/ors-gateway/goi_ors_gateway.py
python -m unittest discover -s infra/ors-gateway/tests -v
```
