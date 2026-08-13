# D-FLIGHT-H-AUTOLOAD-UX-A-FIX5 — REMOVE LIVE LEGEND DOM FROM SELFTEST

**Gate:** `D-FLIGHT-H-AUTOLOAD-UX-A-FIX5 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

**Data:** 2026-08-13  
**Scope:** solo selftest (+ APP_BUILD). Runtime D2/D3/D4 frozen. **NO deploy. NO QA operatore. NO finito.**

---

## 1. Baseline

- HEAD pre: `34ffec2534d1e741bde268a8786cae9a2c74de06`
- Branch: `main` · workspace pulito

## 2–5. Candidate FIX5

- **FULL SHA:** `fb773c94088d7dbe6c672a104f1fdcb797ca6a6e`
- **Subject:** `fix(dflight): FIX5 selftest legend pure/static — no live DOM side-effects`
- **File:** `coordinate_converter Claude.html` only
- **Diff stat:** 134 insertions, 78 deletions

## 6. Selftest D2

**Rimosso:** `FIX4_D2_legend_wrap_lifecycle` (mutava DOM reale legenda / toggle / src / handlers).

**Sostituito con:** `FIX5_D2_ensure_legend_source_pure` — check statico su `String(dflightAtm09EnsureLegend)`:
1. branch `!can` + `wrap.hidden = true`
2. `wrap.hidden = false` nel ramo can
3. gate `forceLoad` / `details.open`
4. `img.src = url` solo nel ramo di caricamento

**Isolamento aggiuntivo (selftest-only, no runtime):**
- `dflightSelfTestF`: stub no-op di `EnsureLegend` durante ApplyDataset→SyncPanelUi; restore overlay/legend state senza riscrivere `img.src`
- `dflightSelfTestAtm09`: stub `EnsureLegend`; wrapper `OnNetworkGateOff` che preserva wrap.hidden / legendLoaded
- `dflightSelfTestH`: restore preferred/overlay/legend; stub temporaneo di EnsureLegend solo attorno al restore di `details.open` (anti-toggle network)

## 7. Build

- `APP_BUILD_ID = D-FLIGHT-H-AUTOLOAD-UX-A-FIX5`
- `APP_BUILD_NUM = 176`
- `APP_BUILD_DETAIL = FIX5 selftest legend pure/static — no live DOM/toggle/network.`

## 8. GOIDflight.selfTest()

- **165/165 PASS** (`ok: true`)
- `FIX5_D2_ensure_legend_source_pure` ok
- `FIX4_D2_legend_wrap_lifecycle` assente
- `H_build_176` ok
- `node --check` main JS: **PASS**

## 9–13. Probe Caso 5

### Legenda inizialmente APERTA (PNG reale 181×189)

- selfTest 165/165
- zero `window.fetch`
- zero HTTP/HTTPS nuovi / helper / legend.png (Performance + Observer)
- preserved: open, hidden, wrapHidden, src, onload, onerror
- details title/body/open/`_dflightDetailsOpen`/class/style preserved
- microtask + macrotask + rAF: stabile

### Legenda inizialmente CHIUSA

- selfTest ok
- non apre legenda; src/handlers invariati; zero network

## 14. Browser runtime regression

- **A D2:** PASS — expand, PNG 181×189, lazy reopen OK (candidate locale)
- **C D4 zone:** PASS — 6 handle, resize W 340→378
- **B D3 / D native:** non collaudabili end-to-end da `127.0.0.1` verso helper VPS (`fetch` CORS fail); runtime D3/D4 **non modificato** (diff solo selftest); `FIX4_D3_atm09_open_source_wires` ancora PASS; FIX4 live aveva già B/D PASS

## 15–16. Helper / D1

- Helper invariato (non toccato)
- D1 invariato (non toccato)

## 17–21. Git (post task, pre-autosync container)

```text
HEAD fb773c94088d7dbe6c672a104f1fdcb797ca6a6e
origin/main = HEAD
ls-remote = fb773c94088d7dbe6c672a104f1fdcb797ca6a6e
```

Anomalie: CORS locale↔helper limita B/D su candidate non deployato; non blocca FIX5 (selftest-only).

## Monolite in autosync

Incluso nel **commit task** `fb773c9`. Questo commit autosync: **solo** `docs/orchestrator/**` + `LAST_CURSOR_REPORT.md`.
