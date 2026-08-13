# D-FLIGHT-PERF-VISUAL-READY-A-FIX1 — deploy + Automated Browser QA

## Gate

`D-FLIGHT-PERF-VISUAL-READY-A-FIX1 DEPLOYED — AUTOMATED BROWSER QA PASS — QA OPERATORE REQUIRED`

`QA FINALE CHATGPT — PENDING`

## Deploy

- Candidate runtime: `12fcba580391e456cd1d9984f340355707a7ecc2`
- Main tip deployato: `e0c25cae1e3f8c814d71569b141669ea3329276f` (candidate + autosync docs only)
- VPS: ff-only `a61c9aa` → `e0c25ca`; restart **solo** `goi-gis-app.service`
- HTTP 200 Tailscale `:8000`
- Bytes/SHA git↔VPS↔HTTP: `10052600` / `f96ebc4ca0fecf8a2a922d164a7fe6796dc99608538531cc77527868726b163c`
- Build live: `D-FLIGHT-PERF-VISUAL-READY-A-FIX1` / **178**
- Helper: **0.1.3** READY (`/status`); PID **2645184** pre=post (invariato)
- Patch codice in questo step: **NO**
- `finito`: **NO**
- QA operatore: **NON ATTESTATA**

## Automated Browser QA URL

`http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=12fcba5-vr-fix1-qa2`

### Case A — boot zero-network — PASS

Zero `/dataset` `/atm09/tile` `/info` `/legend` / d-flight.it a pannello chiuso (wait 6s + resource scan since nav).

### Case B — panel open auto VISUAL READY, no pan — PASS

- Viewport La Spezia z12 stabile; zero pan/zoom operatore
- `/dataset` ×1 (~1.46s)
- ATM09 auto: 50 tile / ok 50 / err 0 / FULL_READY → «Pronto» ~3.0s
- Nessun «Pronto» prematuro (premature=[])
- Progress ATM09 osservato (`ATM09 N/50`)
- Nota: finestra «Preparazione ATM09…» non catturata dal poll 60ms (likely elisa: expected>0 armato nello stesso tick del render post-apply); nessun Pronto nella finestra DATA→ATM09
- Helper host only `100.114.7.53:8010`; zero d-flight.it
- Generation iniziale unica (50 tile z12); no seconda generation spontanea senza interazione

### Case C — reopen — PASS

dataset=0, tile=0, expDelta=0, readyStill=true, label Pronto

### Case D — z19 — PASS

eligible/want true; nuova generation da zoom (atteso follow-up storm); settle Pronto ready

### Case E — z20 — PASS (FIX1)

- eligible=false want=false
- tilesNew=0; zero URL `/atm09/tile/20/`
- preferred=true residuo ma label **Pronto** (non sticky Preparazione)
- `info=1` pre-existing separato (non tile generation)
- ritorno z19: ATM09 ready/Pronto

### Case F — gates — PASS

forceOffline / OPSEC / helper missing → tiles=0

### Case G — selftest — PASS

185/185; helperDelta=0; example.test=0; mapZoom restored

### Case H — FIX5 isolation — PASS

185/185; zero network selftest; src/handlers/details/zoom preservati

## Non fatto

Patch runtime, helper change, finito, attestazione QA operatore.

## Autosync corrente

Fatti container autosync: **EXTERNAL_ONLY**.
