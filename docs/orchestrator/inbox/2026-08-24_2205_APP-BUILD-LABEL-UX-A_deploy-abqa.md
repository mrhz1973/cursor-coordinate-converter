# APP-BUILD-LABEL-UX-A — ROUTINE + deploy GIS + ABQA PASS

**BLOCK-ID:** `APP-BUILD-LABEL-UX-A`  
**Categoria:** ROUTINE  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE:** **CLOSED / PASS** (QA operatore PASS · Regola H)

## Obiettivo

Rimuovere il badge tecnico build/versione dalla topbar/HUD mappa, preservando footer `#appBuildFooter` e About `#appBuildAbout` / `#appBuildAboutDetail`.

## A — Runtime candidate

| Campo | Valore |
| --- | --- |
| Tip | `f215011d9b725664506a1a155e27b64d5011fb99` |
| Build / ID | **256** / `APP-BUILD-LABEL-UX-A` |
| Blob | `7f9804d5333145552bba65d6570749c070656951` |
| Byte LF / SHA-256 | `10870739` / `a2829e32267bc025aaada01b6aed2865dc80bfb586a591d017a03ce0ee3d226c` |
| BASE LIVE | tip `0a4b52b` / **255** / blob `e8f5d3c0…` |

## Patch (già in tip)

- `APP_BUILD_*` → build **256**
- Stub HUD (`gisEnsureMapHud` / `updateGisMapHud`) mantiene `#gisMapHud` assente
- Selftest regressione `buildLabelUxSelfTestAppBuildLabelUxA` (12 check BLUX_*)

## B — Deploy GIS-only — PASS

CMP **PASS** · proxy PID `1387` invariato · HTTP 200 · byte/SHA match  
**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=f215011`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA APP-BUILD-LABEL-UX-A PASS** · **24/24**  
JSON: [`2026-08-24_2205_APP-BUILD-LABEL-UX-A-abqa.json`](2026-08-24_2205_APP-BUILD-LABEL-UX-A-abqa.json)

Desktop + narrow: nessun `#gisMapHud`/badge build in mappa/header/topbar; controlli `.tile-ctrls` e tab `#appTopbar` presenti; footer e About con build completa; console senza errori pertinenti (solo tile 404/503 non pertinenti).

## Gate

**CLOSED / PASS** — `QA APP-BUILD-LABEL-UX-A PASS operatore` (2026-08-24) → finito Regola H · LIVE **256**.
