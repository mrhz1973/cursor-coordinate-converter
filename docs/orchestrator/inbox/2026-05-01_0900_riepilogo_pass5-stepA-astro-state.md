# Pass 5 — Step A: `state.astro` transient + `runAstroUI` da coordinate Astro con fallback `lastResult`

**Data:** 2026-05-01  
**Riferimento piano:** `docs/orchestrator/inbox/2026-05-01_0804_plan_astro-source-picker-floating-panel.md`  
**Ambito:** solo Step A (nessun `#astroPanel`, nessun markup Astro nuovo, nessun picker / pick-on-map / Waypoint o Favorite chooser).

## Cosa è stato fatto

1. **`coordinate_converter Claude.html`**
   - Dopo `lastResult` nello `state` principale (`const state = {` ~riga 12561): aggiunto oggetto **`state.astro`** transient (`source`, `lat`, `lon`, `label`, `origin`, `pickMode`, `error`) e flag **`astroPanelOpen`**, **`astroPickCenterMode`** (placeholder per Step B/C), con commento che **non** è persistito in `saveStore` (il payload di `saveStore()` resta esplicito e non include questi campi).
   - **`runAstroUI`**: risolve `lat`/`lon` da `state.astro` se entrambi `Number.isFinite`, altrimenti da **`state.lastResult`** (stesso comportamento utente finché Step B+ non imposta `state.astro`). SunCalc/Moon/LMT usano le variabili `lat`/`lon` unificate.
   - **i18n:** chiave **`astro.col.utcLmt`** (IT/EN/FR, valore visivo `UTC + LMT*`) e intestazione tabella generata da `runAstroUI` usa `t("astro.col.utcLmt")` + `esc()` invece di stringa hardcoded.
2. **Memoria orchestratore:** questo file + aggiornamento `docs/orchestrator/latest.md`.

## File modificati

- `coordinate_converter Claude.html` — dichiarazione `state`, `runAstroUI`, dizionari i18n (IT/EN/FR).
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-05-01_0900_riepilogo_pass5-stepA-astro-state.md`

## Cosa non è stato toccato

- Markup sezione Astro (`#sec-astro`), `#astroPanel`, Range Rings, WMM/OLC/QR, blocco SunCalc vendored, OPSEC/geocoding/tiles, `syncOpsFieldsFromState` (solo `#astroDate` come prima), persistenza `localStorage` / nuove chiavi storage, `docs/PROJECT_notes.md`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/roadmap.md`, `.cursor/rules/*`.

## Conferme analisi (Task 1)

- **`state`:** dichiarato con `const state = {` nel monolite (~12561).
- **`runAstroUI`:** ~28448; scrive **solo** in `#astro-result` (`innerHTML` tabella + nota LMT a piè tabella); legge `#astroDate` come prima.
- **`astro.col.utcLmt`:** non esisteva; aggiunta in Step A.
- **`syncOpsFieldsFromState`:** imposta `#astroDate` a data odierna ISO; nessun cambiamento richiesto da Step A.

## QA

- Revisione statica del diff; `saveStore()` non serializza `state.astro` / flag panel.
- **Monolite non committato** in questo intervento (policy default).

## Prossimo passo consigliato

- **Step B:** pannello floating `#astroPanel` (architettura confermata: dedicato, non estensione inline `#sec-astro`).
- **Step C:** disarmo esplicito `mapPickMode` e altri pick concorrenti.

## Git (atteso post-commit memoria)

- Commit autosync: **solo** `docs/orchestrator/latest.md` + questo inbox (nessun `git add .`; monolite escluso).
- `coordinate_converter Claude.html`: modificato in working tree, **non** incluso nel commit orchestratore.
