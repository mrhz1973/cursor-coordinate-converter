# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A — deploy GIS-only + ABQA

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `1a5e971459f13b12ed303f1e7105998db774b3bf` |
| Build / ID | **221** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A` |
| Monolite blob | `90c52d57f58ec49af91bf0364e2fe7c8aa5ece3b` |
| Verdetto | **PASS** |
| Note | loggato sul FULL SHA esatto; nessuna patch runtime in questo pass |

**REVIEW GPT-SOSTITUTIVA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A PASS.**

## Pre-deploy — PASS

| Check | Esito |
| --- | --- |
| `git log -1 --format=%H -- "coordinate_converter Claude.html"` | `1a5e971459f13b12ed303f1e7105998db774b3bf` |
| Blob | `90c52d57f58ec49af91bf0364e2fe7c8aa5ece3b` |
| `APP_BUILD_NUM` / ID | **221** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A` |
| Helper | **0.1.3** invariato |

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS `git pull --ff-only origin main` | `f100a5a` → `3de7f0cfb0b82028c8e7027035f8489e817f805e` (docs HEAD; monolite ≡ candidate) |
| Runtime identity (candidate) | `1a5e971459f13b12ed303f1e7105998db774b3bf` |
| Monolite blob | `90c52d57f58ec49af91bf0364e2fe7c8aa5ece3b` |
| Bytes / SHA-256 HTTP | `10605066` / `72a8ed2456baea53994b18635fa4b967c89b1a11dc6861bbe2b9ca10ab80f01f` (file↔HTTP MATCH) |
| Marker | `APP_BUILD_NUM = 221` · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A` |
| `goi-gis-app` | restart PID `2766482`→`2785129` |
| PIDs invariati | nav `2481045` · GH `2034035` · D-Flight `2645184` · ORS gateway `2765652` · nginx `2622063` |
| Secret / Tailscale ACL | **non** toccati |
| Helper | **0.1.3** · **non** riavviato |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=1a5e971`

Nota deploy: `curl | grep -q` ha dato exit 23 (SIGPIPE). Marker e blob verificati a file e HTTP in un secondo passo (`VERIFY_COMPARE_221_PASS`).

## Automated Browser QA — PASS

**AUTOMATED BROWSER QA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A PASS**

Viewport: desktop **1920×900** (51 check) · mobile **360×740** (CTA/build/no-autostart).  
JSON: [`2026-08-18_1335_outdoor-routing-f-provider-compare-a-abqa.json`](2026-08-18_1335_outdoor-routing-f-provider-compare-a-abqa.json).  
Selftest: **ok=true n=679** (RPC 30/30).

| Caso | Esito | Note |
| --- | --- | --- |
| A boot / CTA / no auto-start | PASS | startedAt=0; CTA «Confronta GraphHopper e OpenRouteService»; zero rete compare al boot (mobile detail vuoto) |
| B mapping hiking | PASS | `hiking` ↔ `foot-hiking` |
| C hiking live | PASS | GH vps + ORS PASS; overlay **entrambi** i tracciati; vista OK/provider/distanza/tempo/dislivello/difficoltà; Δ distanza 0.231 km (ORS+); nessun ranking; alts GH=3 ORS=2 |
| D choose GH / ORS | PASS | GH preview 116 pts; ORS preview 203 pts; dopo choose-GH overlay dual assente |
| E MTB trail | PASS | `mtb_trail` ↔ `cycling-mountain`; entrambi PASS; POST ORS `cycling-mountain` |
| F Andata/Ritorno | PASS | entrambi PASS |
| G Anello | PASS | entrambi PASS |
| H avoid + alt | PASS | payload GH `custom_model`+`alternative_route`; ORS `avoid_polygons`+`alternative_routes`; live entrambi PASS; body POST confermati |
| I partial | PASS | GH PASS + ORS FAIL `routing.errorOpsec`; UI «Confronto parziale»; zero POST ORS; nessun fallback |
| J forcedOffline | PASS | zero request ORS; zero VPS GH; ORS `routing.errorOffline` |
| K opsecStrict | PASS | zero POST; gate ORS e GH vps fail-closed |
| L Auto GH | PASS | resolve `vps`; zero `/ors/`; candidates senza `ors` |
| M invalidate | PASS | sequence 38→39; pack e overlay compare puliti |
| N regression GH Calcola | PASS | 116 pts; zero ORS |
| O regression ORS Calcola | PASS | 203 pts; zero GH `/route` |
| P responsive / minimize | PASS | sezione 654×252 desktop; CTA mobile visibile; minimize/restore |

**Network routing:** POST solo `http://100.114.7.53:8989/route` e `https://ubuntu.tailc01234.ts.net/ors/v2/directions/{foot-hiking\|cycling-mountain}/geojson`. Nessun `api.openrouteservice.org`. Nessun `Authorization`.

## Anomalie non bloccanti

- Console n=1: `net::ERR_CONNECTION_REFUSED` (probe Auto `127.0.0.1:8989/info`) — stesso pattern storico Auto.
- Dislivello ORS hiking in vista compare a volte «—» (duration/distanza/difficoltà presenti).
- GET `api.open-meteo.com` elevation e tile Carto: comportamento mappa preesistente, **non** endpoint routing nuovo.
- Dettaglio `A_boot_no_compare_net` desktop elenca anche request successive all’ABQA (listener non snapshot); il flag `ok` è calcolato **prima** della suite (mobile: detail vuoto).

## Gate

**QA FINALE CHATGPT — PENDING**

NON QA operatore. NON finito.
