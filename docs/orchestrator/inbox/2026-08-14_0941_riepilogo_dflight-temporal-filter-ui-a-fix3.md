# D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX3 — clamp geometry resize

**Data:** 2026-08-14 09:41 (locale)  
**Task:** `20b1b494238f8dd483b3eb739f42dbf1194ab727`  
**Subject:** `fix(dflight): clamp panel resize to actual top inside usable rect`  
**Parent runtime:** `7f35382c7e04876428b3c5d4bd45fafff308486d` (build 182, resta live)  
**Build:** `APP_BUILD_NUM=183` · `APP_BUILD_ID=D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX3`  
**Gate:** `D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX3 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`  
**NON** deploy · **NON** finito · **NON** PASS operatore · WU-0014 **OPEN**

## Cosa è stato fatto

Clamp geometrico dei pannelli D-Flight su resize: la max-height usa la **Y effettiva/clampata**, non `safeTop`.

1. `dflightComputePanelUsableRect` — `{ top: safeTop, bottom, pad, height }`; `bottom` non eccede il viewport; riusa `gisMapMount`/`miniMap`.
2. `dflightClampPanelTop` — `clampedTop = clamp(currentTop, safeTop, maxAllowedTop)`; `minH` solo preferred.
3. `dflightSyncAdaptivePanelGeometry` — legge Y reale, clampa se necessario, `availableFromActualTop = usableBottom - clampedTop - pad`.
4. Resize listener esistente (`dflightEnsurePanelGeometryResize`) esegue la sync completa su `#dflightPanel` e `#dflightDetailsPanel`.
5. Restore/maximize resta `top = safeTop` (`dflightRestorePanelToSafeTop`).

## File

- Commit task: solo `coordinate_converter Claude.html`
- Monolite **escluso** da questo autosync memoria

## Diff

- `7f35382..20b1b49` (monolite): `459 + / −16`
- `6c9c697..20b1b49` (monolite cumulativo UI-A): `1115 + / −32`

## QA / test

- `git diff --check` PASS
- `node --check` (script index 2) PASS
- selftest **250/250** (240 esistenti + 10 FIX3)
- Harness locale `http://127.0.0.1:8899/` viewport 1280×1000→700→500→1000
- Finding FIX2 riprodotto come geometria: top 287, fromSafe 532 → would-be bottom 819; dopo FIX3 maxH 339, bottom 626 ≤ map 638 − pad
- FUTURE listener vivo dopo selftest
- Filtro/ATM09/rete/storage/helper **non** toccati

## Rischi residui

- Review GPT-sostitutiva obbligatoria (bundle DELICATO)
- Runtime live resta 182 fino a deploy autorizzato

## Prossimo passo

Review GPT-sostitutiva. Se PASS: deploy GIS-only 183 + Automated Browser QA (incluso caso 8). Non `finito`, non chiudere WU-0014.
