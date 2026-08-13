# D-FLIGHT-F-ATM09-HELPER-DEPLOY-A

Data: 2026-08-13 (~02:26 +02)  
Tipo: deploy helper produzione (nessuna patch codice)

## Contesto

- Diagnosi precedente (`64ad3c0`): QA FIX2 FAIL operatore perché helper prod **0.1.2** senza `/atm09/*` → 404 JSON.
- Runtime GIS invariato: FIX2 / build **170** / monolite `887d321944b941af06ff6091b0fb2bc19df4c065`.
- Obiettivo: distribuire helper **0.1.3** già in repo (ARCH-A), smoke reale, Automated Browser QA; **stop** prima QA operatore / `finito`.

## Baseline git (pre-intervento)

- branch: `main`
- HEAD = origin/main = ls-remote: `64ad3c0c500a720570f5c87bb15dc2eb64117f22`
- workspace: pulito (solo script temporanei deploy/smoke, poi rimossi)

## Pre-flight helper sorgente

- `HELPER_VERSION = "0.1.3"`
- Route presenti: `/atm09/tile/{z}/{x}/{y}.png`, `/atm09/legend.png`, `/atm09/info`
- Blob sorgente allineato ARCH-A: `04d3003ae71e9e5f8f511d9110b2b219d57ed807`
- Suite test helper: **78/78 PASS** (pre-deploy)

## Deploy

- Servizio: `goi-dflight-helper`
- Path: `/opt/goi-dflight-helper/current/`
- Porta: `8010` (bind Tailscale `100.114.7.53`)
- File distribuito: `goi_dflight_helper.py` (+ `REVISION`)
- SHA256 install: `db29ff989ca87031d273446947ff804e8d45b6ff719f7761a4fac0845eed5f8d`
- Config / unit / credentials: **non modificati**
- Backup rollback 0.1.2:
  - `goi_dflight_helper.py.bak-20260813_002259`
  - `REVISION.bak-20260813_002259`
- Restart: OK; NRestarts=0; journal `server_start host=100.114.7.53 port=8010`

## Post-deploy /status

- HTTP 200
- `helper_version = 0.1.3`
- `status = READY`
- `feature_count = 846` (NO_FLY_ZONE)

## Smoke ATM09 reale

| Check | Esito |
|-------|-------|
| GET `/atm09/tile/11/1079/743.png` | 200, `image/png`, 3589 B, PNG valido, non JSON |
| GET `/atm09/legend.png` | 200, `image/png`, 3378 B |
| GET `/atm09/info?bbox=9.6,44.0,10.0,44.3` | 200, FeatureCollection, **13** feature, MultiPolygon + props sanitize |
| GET `/dataset` (NFZ) | 200, FeatureCollection, 846 feature |
| Journal post-restart | access 200 su tile/legend/info/status/dataset |

## Automated Browser QA (FIX2/170, monolite invariato)

URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=887d3219`

- Boot: **zero-fetch** ATM09/helper (`bootNetCount=0`) prima azione operatore
- Dopo Carica zone + overlay ON + `renderMiniMap(44.1, 9.85)`:
  - `dflightAtm09OverlayVisible() = true`
  - `img.tile-atm09` = **60**
  - expected=**60**, ok=**60**, err=**0**, ready=**true**
  - `dflightAtm09ShouldSuppressNfzColors() = true`
  - legend ATM09 ufficiale visibile (screenshot)
  - INFO FC features > 0 (viewport Spezia)
  - opacity **1**
  - chiamate `d-flight.it` = **0**; solo helper `:8010/atm09`
- Forced-offline: preferred=false, overlayWant=false, ready=false, suppress=false, tiles ATM09=0 (fail-closed NFZ)
- Restore online: ready=true, ok=60/60, suppress=true

**AUTOMATED BROWSER QA D-FLIGHT-F-ATM09-HELPER-DEPLOY-A PASS**

## Non fatto (vincoli)

- Nessuna modifica monolite / nessun redeploy GIS
- Nessun FIX3 / nessun cambio contratto ATM09
- Nessun `finito`
- **QA operatore non eseguita / non attestata** → gate richiesto

## Prossimo passo

QA operatore umana su runtime FIX2/170 + helper 0.1.3 live.  
Attestare `QA D-FLIGHT-F-ATM09-HELPER-DEPLOY-A PASS operatore` oppure FAIL con dettaglio.

## Limiti

- SHA/push del commit autosync corrente = **EXTERNAL_ONLY** (non autorati qui).
- Task commit: N/A (solo deploy VPS + memoria docs).
