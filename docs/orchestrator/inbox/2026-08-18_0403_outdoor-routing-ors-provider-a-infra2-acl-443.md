# OUTDOOR-ROUTING-ORS-PROVIDER-A-INFRA2 — STOP reachability

**BLOCK-ID:** `OUTDOOR-ROUTING-ORS-PROVIDER-A-INFRA2`  
**Parent:** `OUTDOOR-ROUTING-ORS-PROVIDER-A`  
**Data:** 2026-08-18  
**Esito:** secret **PRESENT** · on-box HTTPS PASS · **GIS client HTTPS FAIL** · **nessun candidate 220**

## Secret (nessun valore)

| Voce | Valore |
| --- | --- |
| Path | `/etc/systemd/ors-credentials/ORS_API_KEY` |
| Exists / non-empty | YES / YES |
| Mode / owner | `600` `root:root` |
| Lettura servizio | systemd `LoadCredential=ORS_API_KEY` (`goi-ors-gateway.service.d/credential.conf`) |
| `/ors/status` after restart | **`ORS_API_KEY=PRESENT`** · `status=ready` |
| Journal leak | NO |

Il file `600 root:root` non è leggibile da `goi-ors`; **non** è stato allargato. Iniezione solo via `LoadCredential` (nessuna lettura/stampa del contenuto).

## Reachability GIS client — FAIL

Dal client Windows (stessa rete Tailscale del GIS):

| Check | Esito |
| --- | --- |
| Ping `100.114.7.53` | True |
| TCP `100.114.7.53:443` | **False** |
| `https://ubuntu.tailc01234.ts.net/ors/status` | timeout (~12s), HTTP 000 |
| On-box `curl --resolve` stesso URL | PASS |

**Blocker:** ACL Tailscale **non** concede `tcp:443` verso `100.114.7.53/32` (grant storico `8000`/`5000`/`8010`). Il browser GIS **non** può parlare col gateway HTTPS.

## Non eseguito

- capability ORS 1–10 (gate client HTTPS fallito)
- patch `coordinate_converter Claude.html`
- build 220
- deploy GIS / ABQA / QA / finito

## LIVE

Invariato: `5477a5e` · build **219** · helper **0.1.3**

## Sblocco

Grant ACL additivo `{ "src": ["autogroup:member"], "dst": ["100.114.7.53/32"], "ip": ["tcp:443"] }` (stesso pattern di `:8010`). Poi ripetere reachability client + capability 1–10; solo se PASS → candidate 220.
