# D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX2 — hardening review GPT-sostitutiva

**Data:** 2026-08-14 09:12 (locale)  
**Categoria:** DELICATO  
**Gate:** `D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`  
**NON** deploy · **NON** finito · **NON** chiusura WU-0014 · **NON** PASS operatore

## Task

- **real_task_commit:** `7f35382c7e04876428b3c5d4bd45fafff308486d`
- **parent runtime FIX1:** `b504c0205dcb8a33ffef06bb2a16841630de64a6`
- **baseline UI-A:** `6c9c6972350dffcc9596179875b79ed06c7c6cd3`
- **diff runtime:** `b504c02..7f35382`
- **file:** solo `coordinate_converter Claude.html`
- **build:** 182 · `D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX2`

## Finding corretti

1. Selftest geometry: niente `innerHTML` sul body vivo; probe temporanei + hide figli; identità checkbox e listener post-test.
2. CSS dialog: `display:flex` solo su `[open]`; `:not([open]){display:none}`.
3. Restore test: snapshot/restore completo di top/left/right/bottom/transform/height/maxHeight + body overflow/maxHeight + layout + open.
4. `dflightComputePanelAvailableHeight`: HARD max = spazio reale (map/viewport − safeTop − pad); **non** inflato da minH.

## Verifiche

- selftest **240/240 PASS**
- harness post-selftest (no reload): FUTURE OFF/ON listener vivo; restore safeTop; closed display none; details restore; no ghosts; short space → overflow auto
- node --check PASS; git diff --check PASS
- filtro FIX1 / ATM09 gate / redraw canonico invariati

## NEXT

Review GPT-sostitutiva da `raw@7f35382` → poi deploy.
