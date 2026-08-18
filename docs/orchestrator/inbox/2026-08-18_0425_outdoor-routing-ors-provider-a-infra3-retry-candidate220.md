# OUTDOOR-ROUTING-ORS-PROVIDER-A-INFRA3-RETRY — candidate build 220

**BLOCK-ID:** `OUTDOOR-ROUTING-ORS-PROVIDER-A-INFRA3-RETRY`  
**Parent:** `OUTDOOR-ROUTING-ORS-PROVIDER-A`  
**Data:** 2026-08-18  
**Esito:** infra PASS · capability 1–10 PASS · **candidate build 220** · **REVIEW GPT-SOSTITUTIVA — PENDING**

## 1. Reachability client Windows (post-ACL operatore)

| Check | Esito |
| --- | --- |
| TCP `100.114.7.53:443` | **PASS** |
| HTTPS `/ors/status` | **PASS** HTTP 200 |
| Certificato TLS | valido (Tailscale/Let's Encrypt) |
| `secret` in status JSON | **PRESENT** (valore non letto/loggato) |
| Grant storici `:8000`/`:8010`/`:8989` | **PASS** (invariati) |

## 2. Capability ORS 1–10 (gateway)

Eseguito `_ors_capability_matrix.py` dal client GIS Windows · origin `http://100.114.7.53:8000`.

| # | Capability | Esito |
| --- | --- | --- |
| 1 | multi-waypoint | PASS |
| 2 | elevation | PASS |
| 3 | alternatives | PASS |
| 4 | round trip | PASS |
| 5 | avoid polygon | PASS |
| 6 | alternatives + avoid | PASS |
| 7 | round trip + avoid | PASS |
| 8 | Andata/Ritorno (2 leg) | PASS |
| 9 | foot-hiking | PASS |
| 10 | cycling-mountain | PASS |

Nessun secret in output/evidence.

## 3. AUTO-VIA parent — runtime candidate

**Monolite:** `coordinate_converter Claude.html`  
**build:** 219 → **220**  
**APP_BUILD_ID:** `OUTDOOR-ROUTING-ORS-PROVIDER-A`  
**Helper:** 0.1.3 (invariato)

Implementato:

- Servizio **OpenRouteService** opt-in nel menu routing (GraphHopper invariato)
- Gateway HTTPS `https://ubuntu.tailc01234.ts.net` — nessuna API key nel browser
- `forcedOffline` / `opsecStrict` bloccano ORS
- Auto resta **solo GraphHopper** (Locale → VPS); ORS **mai** fallback automatico
- Stesso planner: normal/elevation/alternative/andata-ritorno/anello/avoid areas/preview/save track
- `state.mapWaypoints[]` / `state.gisPolygons` non toccati · Oggetti GIS FROZEN

## NON eseguito

- deploy GIS
- ABQA
- QA operatore
- finito

## FRONTIER target

| Campo | Valore |
| --- | --- |
| BLOCK | `OUTDOOR-ROUTING-ORS-PROVIDER-A` |
| STATE | REVIEW GPT-SOSTITUTIVA — PENDING |
| GATE | REVIEW GPT-SOSTITUTIVA — PENDING |
| LIVE | build **219** (`5477a5e`) |
| CANDIDATE | build **220** |
| NEXT | review candidate 220 |
