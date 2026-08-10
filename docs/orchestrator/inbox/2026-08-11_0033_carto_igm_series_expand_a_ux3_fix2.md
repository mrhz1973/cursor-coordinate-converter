# CARTO-IGM-SERIES-EXPAND-A-UX3-FIX2 — riepilogo intervento

## Esito
CARTO-IGM-SERIES-EXPAND-A-UX3-FIX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED

## Trigger
QA operatore su UX3+FIX1 deployato: (1) flash landing Convertitore a hard reload; (2) pannello IGM alto ma top troppo basso rispetto alla topbar.

## Cosa è stato fatto

### A. Startup zero-flash (pre-paint)
- Markup: `<body class="gis-boot">`.
- CSS pre-paint: stessi selettori landing di `body.gis-mode > main > …` nascosti; `main` senza padding; `#gisMapMount` visibile (placeholder scuro) anche se `hidden`.
- `gisInit()`: dopo `classList.add("gis-mode")` rimuove `gis-boot`; anche sul ramo classic opt-out.
- **Non** secondo router; `body.gis-mode` resta canonico; Converti invariato.

### B. Top-align pannello IGM
- In `openCartoIgmPanel`, se `!gPanelLayouts.cartoigm.touched`:
  - `top = header.getBoundingClientRect().bottom + 10px` (gap 10);
  - fallback: `topbarReserve + 10` (non più `pad + reserve`);
  - applicato **sempre** su default (non solo se top > 40% vh — con height 0.78 il default bottom-left spesso resta <40%).
- Height fraction **0.78** / cap **720** invariati; drag/resize/minimize/close/z-index invariati; geometry touchata non sovrascritta.

## Non toccato
filtri, query, payload, dataset, first-open current-view, tooltip, Cataloga/Modifica/Centra, UX1/UX2 label, matching, storage, rete, proxy, zero-serie FIX1, navigation system.

## Runtime
- FULL SHA: `cb2a38b447f27c2e93b1c9c01ddd38785d31393b`
- blob: `d43ae6e083322647e7604b463144c94ab5c83862`
- byte: `9768520`
- SHA-256: `0fa7ba6ddb744075abbaf752260d1bd38ad6b26663545f9d1051fa84d3a17067`
- payload count: 8204; SHA payload invariato `487AC0A0FDB676001631DF90F20D12F784C70364CCBFF6DF2004F4636C8B6283`

## Verifiche
- `node --check` PASS
- `git diff --check` PASS
- payload byte-invariato PASS
- dataset/manifest invariati PASS
- diff scope: solo monolite (+45/−13)
- hard reload / QA browser: **NOT EXECUTED** (gate: review + deploy; no QA operatore in questo blocco)

## Deploy / QA
- Deploy: NOT EXECUTED
- QA: NOT EXECUTED
- `finito`: NOT EXECUTED

## Prossimo passo
Review GPT-sostitutiva → deploy FIX2 → QA (hard reload ×3, Converti, top pannello, drag touched, regressioni UX3/FIX1).
