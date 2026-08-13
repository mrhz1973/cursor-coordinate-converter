# D-FLIGHT-F-ATM09-ARCH-A-FIX2 — deploy + Automated Browser QA

## Trigger

```text
REVIEW GPT-SOSTITUTIVA: PASS
GO DEPLOY
FULL SHA: 887d321944b941af06ff6091b0fb2bc19df4c065
```

## Deploy GIS

- VPS: `ionos-n8n` / `ubuntu`
- Path: `/root/local-files/handoff-runtime/cursor-coordinate-converter`
- Pre: `42edb6f` (G-FIX2 live)
- `git pull --ff-only origin main` → `916c08106983ebd0e571fdcd6a0cc6f44d176df0`
- `systemctl restart goi-gis-app` → **active** / **enabled**
- HTTP **200** su `?v=887d3219` (size 10002990)
- Served markers: `D-FLIGHT-F-ATM09-ARCH-A-FIX2`, `APP_BUILD_NUM = 170`, `dflightAtm09SettleTile` present
- **CMP_PASS**: SHA256 WT = served = blob `887d321…`  
  `03dc395934bf69b489f3205cb40142cd5bac26c3ed99e83c271df064b661de2e`

## Helper

- **NO REDEPLOY** (byte-invariato nel FIX2)
- `goi-dflight-helper` **active**

## PASS tecnico remoto (fatti)

| Voce | Valore |
|------|--------|
| Runtime SHA | `887d321944b941af06ff6091b0fb2bc19df4c065` |
| VPS repo HEAD | `916c08106983ebd0e571fdcd6a0cc6f44d176df0` (include runtime + autosync docs) |
| Build | FIX2 / 170 |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=887d3219` |

## AUTOMATED BROWSER QA D-FLIGHT-F-ATM09-ARCH-A-FIX2 PASS

Eseguito su URL live `?v=887d3219`:

1. Title/build FIX2 · 170
2. Boot: preferred/ready false, expected 0, 0 img ATM09, 0 resource atm09 / d-flight.it / helper
3. `GOIDflight.selfTest` **140/140** (FIX2_1…11 + multipolygon)
4. Mixed load→error: midReady false, afterError ready false, suppress false
5. Settle-once: second settle false, okCount 1
6. Opacity computed `1`
7. Regressione G-FIX2: `gisUiBlocksMapWheelZoom` presente; no script module / no script src
8. `dflightAtm09ShouldSuppressNfzColors()` false al boot

## Gate

```text
QA FINALE CHATGPT — PENDING
```

Cursor **non** emette QA operatore. Attende attestazione:

```text
QA D-FLIGHT-F-ATM09-ARCH-A-FIX2 PASS operatore
```

**No finito** in questo intervento (attende PASS operatore se coda pre-autorizzata).

## Limiti

- Overlay ATM09 visual end-to-end con dataset D-Flight live non forzato in Automated QA (gate OPSEC / attivazione utente); readiness/settle coperti da selftest comportamentali sul runtime live.
