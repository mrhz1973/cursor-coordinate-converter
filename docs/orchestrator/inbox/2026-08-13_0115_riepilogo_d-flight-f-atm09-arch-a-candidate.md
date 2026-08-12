# D-FLIGHT-F-ATM09-ARCH-A — candidate pre-deploy

**Gate:** `D-FLIGHT-F-ATM09-ARCH-A IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

**real_task_commit:** `5cbae9c9f4434db173a3bc534bb7e8345d1d048d`  
**subject:** `feat: D-FLIGHT-F-ATM09-ARCH-A candidate — ATM09 WMS tile proxy + ATM09_INFO`

**NON deployato.** Helper produzione (`:8010`) **non** aggiornato. Runtime live GIS resta `42edb6f` / build 167.

## Baseline

- origin/main pre: `677a1b8363315014014cec49a93b52748a1f4c23`
- CORS live `origin_allowlist = ["http://100.114.7.53:8000"]` — già presente, **non** modificato
- Gate 0B: TMS/GWC storico **404**; trasporto scelto = **WMS GetMap** `EPSG:3857` tile 256×256 Web Mercator (z/x/y XYZ, Y non invertita TMS)

## Cosa è stato fatto

### Helper (`goi_dflight_helper.py` → 0.1.3)

Endpoint chiusi (layer/style/typename hardcoded helper-side):

- `GET /atm09/tile/{z}/{x}/{y}.png` — proxy ATM09 style `D-FLIGHT:atm09_style`
- `GET /atm09/info?bbox=minLon,minLat,maxLon,maxLat` — `D-FLIGHT:ATM09_INFO` EPSG:4326
- `GET /atm09/legend.png` — GetLegendGraphic ufficiale

Anti-open-proxy: nessun URL/layer/style/typename client-controllabile; validazione z/x/y e bbox fail-closed; Bearer solo helper-side; errori sanitizzati.

### Monolite (build 168 / `D-FLIGHT-F-ATM09-ARCH-A`)

- Overlay tile ATM09 trasparente sopra basemap quando D-Flight overlay visibile + rete/helper OK
- Soppressione SVG colorato NO_FLY_ZONE quando ATM09 preferred (evita doppio paint); NFZ resta fallback
- ATM09_INFO: fetch debounce viewport, hit-overlay invisibile, tooltip/dettaglio
- Legenda ufficiale via `/atm09/legend.png` (niente categoria 120 m inventata)
- Nessun fetch ATM09 al boot; session-only; OPSEC gates preservati

## Prove

- Helper unit tests: **78/78 PASS**
- `node --check` script main + vendored: **PASS**
- `git diff --check`: **PASS**
- Browser selftest GOIDflight: **120/120 PASS** (incl. 7 ATM09); boot: preferred=false, infoFc=null, 0 tile-atm09
- Candidate helper temp `:8011` (non prod): tile z11 La Spezia PNG 3589 B; legend 3378 B; ATM09_INFO **17** feature bbox La Spezia
- Produzione `:8010` lasciata intatta (`active`, `/status` 200)

## Limiti / fuori scope (bundle successivi)

- Polling 30 min / autoload pannello / rename CTA
- Deploy helper + GIS
- Cache IndexedDB ATM09
- NOTAM / altri FeatureType

## NEXT

Review GPT-sostitutiva sul **FULL SHA** `5cbae9c9f4434db173a3bc534bb7e8345d1d048d` → poi eventuale deploy helper+GIS.

## Autosync container

`current_report_container`: `PENDING_SELF_REFERENCE` / fatti post-push autosync: `EXTERNAL_ONLY`
