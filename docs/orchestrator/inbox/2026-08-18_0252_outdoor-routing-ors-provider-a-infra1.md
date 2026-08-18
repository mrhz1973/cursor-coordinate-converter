# OUTDOOR-ROUTING-ORS-PROVIDER-A-INFRA1 — sede HTTPS

**BLOCK-ID:** `OUTDOOR-ROUTING-ORS-PROVIDER-A-INFRA1`  
**Parent:** `OUTDOOR-ROUTING-ORS-PROVIDER-A`  
**Categoria:** DELICATO  
**Data:** 2026-08-18  
**Esito:** sede HTTPS **READY** · secret ORS **ABSENT** · monolite **UNTOUCHED**

## Sede scelta

Riutilizzo **nginx** (già presente) come terminator TLS + **systemd** + certificato **Tailscale / Let's Encrypt**. Micro-gateway Python 3.12 stdlib (stesso pattern del helper D-Flight, **servizio separato**). Helper **0.1.3 non modificato**.

```text
https://ubuntu.tailc01234.ts.net/ors/*  →  nginx :443 @ 100.114.7.53
                                         →  127.0.0.1:8020 goi-ors-gateway
                                         →  api.openrouteservice.org  (solo se ORS_API_KEY PRESENT)
```

## URL / service / config (senza secret)

| Voce | Valore |
| --- | --- |
| URL status | `https://ubuntu.tailc01234.ts.net/ors/status` |
| URL directions | `https://ubuntu.tailc01234.ts.net/ors/v2/directions/{profile}/geojson` |
| Profili | `foot-hiking` · `foot-walking` · `cycling-mountain` |
| systemd | `goi-ors-gateway.service` (enabled) |
| Timer cert | `goi-ors-cert-renew.timer` (weekly) |
| Codice | `/opt/goi-ors-gateway/current/goi_ors_gateway.py` |
| nginx site | `/etc/nginx/sites-available/goi-ors-gateway` |
| TLS | `/etc/goi-ors/tls/fullchain.pem` + `privkey.pem` · issuer Let's Encrypt YE2 · CN `ubuntu.tailc01234.ts.net` |
| Secret name | `ORS_API_KEY` |
| Secret path | `/etc/systemd/ors-credentials/ORS_API_KEY` |
| Secret stato | **ABSENT** (file non creato; valore mai letto) |

## Verifiche

| Check | Esito |
| --- | --- |
| HTTPS valido (on-box `curl --resolve`, cert LE) | PASS |
| GET `/ors/status` ready + `secret: ABSENT` | PASS |
| POST directions senza secret → 503 `secret_not_configured` | PASS |
| Nessun upstream senza credenziale | PASS (fail-closed) |
| Open proxy: `/` 404 · `driving-car` 404 · GET directions 403 | PASS |
| Listen `:443` solo `100.114.7.53` (non `0.0.0.0`) | PASS |
| Journal senza PEM/Authorization | PASS |
| Restart gateway → status ready | PASS |
| GIS / GH / nav-proxy / dflight PID invariati | PASS (`2759608` / `2034035` / `2481045` / `2645184`) · nginx master `2622063` |
| Helper 0.1.3 | invariato |
| HTML build 219 | invariato · nessun endpoint ORS nel monolite |
| Client Windows `https://ubuntu.tailc01234.ts.net/ors/status` | timeout (~8s) — ACL Tailscale `tcp:443` probabilmente assente (stesso pattern storico di `:8010`) |

## Non fatto (fuori scope INFRA1)

- valorizzare `ORS_API_KEY`
- capability ORS 1–10
- patch `coordinate_converter Claude.html` / build 220
- deploy GIS / ABQA / QA operatore / finito
- modifica Tailscale ACL (admin console)

## NEXT

Configurare secret server-side (`ORS_API_KEY` nel path sopra, senza copiarlo in chat/repo) e ripetere capability 1–10 **tramite gateway**. Per uso dal browser GIS: grant ACL additivo `tcp:443` → `100.114.7.53/32` se il client non raggiunge `:443`.
