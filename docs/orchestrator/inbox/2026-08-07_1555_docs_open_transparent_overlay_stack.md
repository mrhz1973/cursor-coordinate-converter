# DOCS-MAP-TRANSPARENT-OVERLAY-STACK-A-OPEN — CLOSED / PASS docs-only

**Data:** 2026-08-07  
**Tipo:** DOCS-ONLY — riconciliazione diagnostica + promozione blocco  
**real_task_commit:** `5b4e4119da8e08f096cc1dec97baf3aedd683a46`  
**Subject:** docs: open transparent overlay stack after provider discovery  
**Baseline pre-task:** `d5ce8fe8883fc0bc2d07ffff47405c465607e203`  
**Monolite:** **non** modificato (`coordinate_converter Claude.html` escluso)

## Cosa è stato fatto

1. Preflight PASS: repo corretto, `main`, WT pulito, HEAD=origin/main=ls-remote=`d5ce8fe`, divergenza `0 0`.
2. Read-set: README, OM §4/§7, WU roadmap, HANDOFF, latest, LAST_CURSOR_REPORT, inbox backlog waypoint/overlays.
3. Promozione formale **MAP-TRANSPARENT-OVERLAY-STACK-A**: `BACKLOG / NOT OPENED` → **`OPEN / READY FOR IMPLEMENTATION`**.
4. Registrati fatti diagnostic / product scope / proxy ready (fuori runtime GIS).
5. WU-0012: ordine SERIES→provider→MODAL-OPEN **preservato e sospeso** (non cancellato né riordinato).
6. Objects GIS **FROZEN** preservato.
7. Prossimo passo vivo: **MAP-TRANSPARENT-OVERLAY-STACK-A — GIS IMPLEMENTATION** (target build **139**; tip live ancora `a0a6816` / 138).

## Diagnostic registrata

- ID: `MAP-TRANSPARENT-OVERLAY-STACK-A-PROVIDER-DISCOVERY`
- Tipo: READ-ONLY DIAGNOSTIC
- Esito: **PROVIDER DISCOVERY PARTIAL — PRODUCT DECISION COMPLETED AFTER DIAGNOSTIC**
- Baseline GIS discovery: `d5ce8fe`
- GIS non modificato in discovery

### Provider consolidati

| Item | Esito |
| --- | --- |
| OSM Standard | disponibile; sharding a/b/c entry esistente |
| Google Satellite | via `gsat` esistente; nessun nuovo Google layer |
| WayMarked Trails Hiking | READY; XYZ PNG; maxZoom 18; diretto |
| Strava Heatmap Run | endpoint pubblico verificato; PNG; maxZoom v1 11; solo proxy personale |
| Hillshade | OSM US verificato; JPEG; maxZoom 12; solo proxy personale |
| Slope | DEFERRED |
| Terrain/OpenMapSurfer | DROP FROM CURRENT BUNDLE |
| Bing hybrid/labels | DROP FROM CURRENT BUNDLE / future discovery |

## Product scope v1 LOCKED

**IN:** OSM Standard sharding; `gsat`; WayMarked Hiking; Strava Run maxZoom 11; Hillshade maxZoom 12.  
**DEFERRED:** Slope; labels-only overlay.  
**DROPPED:** OpenMapSurfer Terrain; Bing Hybrid as labels overlay.

## Proxy ready (Planet-Clone — non modificato in questo task)

- Repo: `mrhz1973/Planet-Clone`
- Commit: `0fa194106b153e77bd22fb0be2ae3cd98cd202c3` — `feat(proxy): add Strava Run and hillshade tile routes`
- Review: MAP-TRANSPARENT-OVERLAY-STACK-A-PROXY REVIEW GPT-SOSTITUTIVA — PASS
- Deploy: MAP-TRANSPARENT-OVERLAY-STACK-A-PROXY DEPLOYED — TECHNICAL PASS
- Route: `/strava-run/{z}/{x}/{y}.png`, `/hillshade/{z}/{x}/{y}.jpg`
- Smoke: Strava z11 200 PNG; z12 transparent fallback; Hillshade z12 200 JPEG; z13 502 controllato; CORS PASS; gsat/bsat/tiles/sonar/status PASS
- GIS / GraphHopper / n8n non riavviati

## File modificati (task)

- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/HANDOFF.md`

## QA

Non applicabile (docs-only; nessun QA runtime).

## Stato repo (post-task push, pre-autosync)

- Task push: riuscito (`d5ce8fe` → `5b4e411`)
- Monolite tip live invariato: `a0a6816` / build 138
- Working tree pre-autosync: solo artefatti autosync in preparazione

## Prossimo passo

Prompt implementazione monolite **MAP-TRANSPARENT-OVERLAY-STACK-A — GIS IMPLEMENTATION** (DELICATO; target build 139). Residui runtime: OPSEC, consent proxy, IndexedDB, lifecycle, persistenza toggle, UI Layers, zero-fetch OFF/offline/out-of-range.

## Limiti

- Nessuna implementazione GIS in questo blocco.
- Provider discovery non riaperta.
- Planet-Clone non toccato.
- Fatti post-push del commit autosync corrente: **EXTERNAL_ONLY** (non autorati qui).
