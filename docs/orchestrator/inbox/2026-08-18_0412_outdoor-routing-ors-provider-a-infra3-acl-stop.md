# OUTDOOR-ROUTING-ORS-PROVIDER-A-INFRA3 — STOP ACL control-plane

**BLOCK-ID:** `OUTDOOR-ROUTING-ORS-PROVIDER-A-INFRA3`  
**Parent:** `OUTDOOR-ROUTING-ORS-PROVIDER-A`  
**Data:** 2026-08-18  
**Esito:** **STOP** — ACL Tailscale non applicabile da sessione Cursor · client HTTPS ancora **FAIL** · **nessun candidate 220**

## Step 1 — Tailscale ACL

| Voce | Esito |
| --- | --- |
| Grant richiesto (additivo) | `{ "src": ["autogroup:member"], "dst": ["100.114.7.53/32"], "ip": ["tcp:443"] }` |
| Control-plane | `https://controlplane.tailscale.com` (client loggato) |
| `tailscale acl` CLI Windows v1.102.2 | **subcommand sconosciuto** — nessuna API ACL locale |
| Credenziali admin / API token in sessione | **ASSENTI** |
| Grant applicato da Cursor | **NO** |

**Blocker:** il control-plane Tailscale **non è modificabile in modo autorizzato** da questa sessione Cursor. L’operatore deve applicare manualmente il grant additivo nella console admin Tailscale (stesso pattern storico di `tcp:8010`).

## Step 2 — Verify reachability (GIS client Windows)

Eseguito **prima** e **dopo** tentativo ACL (invariato — grant non applicato):

| Check | Esito |
| --- | --- |
| Ping `100.114.7.53` | True |
| TCP `100.114.7.53:443` | **False** |
| `https://ubuntu.tailc01234.ts.net/ors/status` | **non eseguito** (TCP 443 bloccato) |
| Certificato / status ready / secret esposto | **non verificabile** finché TCP 443 FAIL |

Grant storici **invariati** (non toccati):

| Porta | TcpTestSucceeded |
| --- | --- |
| `8000` (GIS HTTP) | True · HTTP 200 |
| `8010` (D-Flight) | True |
| `8989` (GraphHopper) | True |

On-box gateway (commit INFRA1/INFRA2): **ORS_API_KEY=PRESENT** · nginx `:443` · servizio ready — **non** ri-verificato in questo pass (client bloccato prima di HTTPS).

## Step 3–4 — Non eseguito

- capability ORS 1–10
- AUTO-VIA parent `OUTDOOR-ROUTING-ORS-PROVIDER-A`
- patch `coordinate_converter Claude.html`
- build 220 · `APP_BUILD_ID=OUTDOOR-ROUTING-ORS-PROVIDER-A`
- deploy GIS / ABQA / QA / finito

## LIVE

Invariato: `5477a5e0d8d9a5681dbfab37b3c39e182306fc79` · build **219** · helper **0.1.3**

## Sblocco (operatore)

1. Console admin Tailscale → aggiungere **solo** il grant additivo `tcp:443` → `100.114.7.53/32` (non rimuovere grant esistenti).
2. Nuovo pass Cursor (INFRA3 retry o INFRA4): verify client HTTPS + capability 1–10 → se PASS, AUTO-VIA parent → candidate build 220.
