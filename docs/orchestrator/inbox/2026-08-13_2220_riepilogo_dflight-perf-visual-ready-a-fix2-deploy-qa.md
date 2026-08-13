# D-FLIGHT-PERF-VISUAL-READY-A-FIX2 — deploy + Automated Browser QA

## Gate

`D-FLIGHT-PERF-VISUAL-READY-A-FIX2 DEPLOYED — AUTOMATED BROWSER QA PASS — QA FINALE CHATGPT PENDING`

## Baseline

- Pre-deploy HEAD / origin/main / ls-remote: `dcfd056f9d9b814a645ad5b479d1530b68763fc0`
- Monolite blob origin/main = candidate `52927c5`: `9611b87ec6077e2098d803330106f0cd8caae734` (MATCH)
- Review: GPT-SOSTITUTIVA PASS (esterna) — GO DEPLOY
- REVIEW BASE: `12fcba580391e456cd1d9984f340355707a7ecc2`

## Deploy VPS (GIS-only)

- SSH `ionos-n8n`
- Path: `/root/local-files/handoff-runtime/cursor-coordinate-converter`
- `git pull --ff-only` `e0c25ca` → `dcfd056`
- Restart **solo** `goi-gis-app.service` (active)
- HTTP 200 · BYTES 10062159
- CMP_OK repo↔HTTP · SERVED_SHA1 `a598fcad89c23f62a47c25e0166ca39def67bcdf`
- Build live: `D-FLIGHT-PERF-VISUAL-READY-A-FIX2` / **179**
- Helper: **0.1.3** READY (`/status`); service active; **non** riavviato
- Monolite patch in questo step: **NO**
- `finito`: **NO** (QA operatore PENDING)

## Automated Browser QA URL

`http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=52927c5-fix2-qa2`

### A Boot chiuso — PASS
Zero `/dataset` `/atm09/tile` `/atm09/info` / d-flight.it (wait 6s).

### B Apertura — PASS
Panel open; 846 zone; overlay ON; ATM09 tiles helper `:8010`; zero d-flight.it.

### C Minimize overlay ON — PASS
Overlay resta; restore flag invariato; dock presente.

### D Esc minimizzato — PASS
Nessun real-close; overlay resta; datasetDelta 0.

### E Restore minimize — PASS
Overlay già ON; datasetDelta 0; pannello ripristinato.

### F Real close overlay ON — PASS
Panel chiuso; overlay OFF; native SVG 0; ATM visual off; Details chiuso; restore=true.

### G Reopen dopo close ON — PASS
datasetDelta 0; overlay ripristinato; restore cleared.

### H Manual OFF preservato — PASS
Close con OFF → reopen resta OFF; restore=false.

### I Esc pannello espanso — PASS
Equivalente a ×; overlay OFF; restore=true.

### J Regressioni FIX1 — PASS
z19 eligible/want + tile z19; z20 eligible=false tiles20=0 stickyPrep=false hasPronto; forceOffline/OPSEC/helper-missing → not_eligible tileDelta 0.

### K Selftest — PASS
`GOIDflight.selfTest()` **208/208** ok; delta rete dataset/tile/example/helper8010 = 0.

## Console / Network

- d-flight.it: **0**
- Helper host: `100.114.7.53:8010`
- Nessun errore Console bloccante rilevato nei flussi A–I

## Docs reconcile (task)

- OM §7.1 / §7.2 + WU-0013 hot-header: LIVE 179, gate QA PENDING
- README AI-BOOT / HANDOFF / roadmap: **invariati**
- Commit docs: `15932067894b672a89ed737d239c7485df647a4d`

## Limiti

- QA operatore **non** attestata
- Fatti autosync corrente = EXTERNAL_ONLY
- Blocco **non** CLOSED
