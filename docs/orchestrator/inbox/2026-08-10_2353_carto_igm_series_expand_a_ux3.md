# CARTO-IGM-SERIES-EXPAND-A-UX3 — riepilogo intervento

## Esito
CARTO-IGM-SERIES-EXPAND-A-UX3 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED

## Trigger
Affinamenti UX post-deploy UX2: startup view, auto-refresh filtri, layout pannello.

## Cosa è stato fatto
1. **Startup view = MAPPA** — `state.gisMode = true` forzato al boot (dopo lettura localStorage); `gisInit` + CSS esistenti già nascondono la landing convertitore → zero flash. `topbarConvertBtn` apre `#convertModal` invariato → Convertitore pienamente accessibile.
2. **Auto-refresh filtri serie** — `onFilter()` ora chiama `cartoUiRunSearch()` dopo l'aggiornamento di `u.selectedSeries`; se il record selezionato non appartiene più alle serie attive, azzera `selectedRecordId`.
3. **Auto-refresh "Mostra tutte le impronte"** — già presente (`cartoUiRefreshOverlay`); aggiunto tooltip/aria-label.
4. **Rimozione "Cancella risultati" dalla UI GIS** — CSS `body.gis-mode #cartoIgmClearBtn{display:none!important}`. Handler interno e `cartoUiClearResultsAndOverlay()` (condiviso con `closeCartoIgmPanel`) restano intatti.
5. **Rename "Usa vista corrente" → "Aggiorna vista corrente"** + tooltip "Aggiorna risultati e impronte usando l'attuale vista della mappa".
6. **Tooltip IT** su `pickArea`, `useView`, 5 checkbox serie, `showAll` via pattern `data-i18n-tip`/`data-i18n-aria` esistente.
7. **Geometria pannello IGM** — `defaultHeightFraction 0.58→0.78`, `defaultHeightCap 640→720`; in `openCartoIgmPanel` reset posizione top se `top > 40% vh` e `gPanelLayouts.cartoigm.touched !== true`.
8. **First-open senza query** — in `openCartoIgmPanel` se `!(u.queryBbox || u.selectedArea)` chiama `cartoIgmUseCurrentView()` (popola N/S/E/O + lancia search).
9. **Build bump** → `CARTO-IGM-SERIES-EXPAND-A-UX3` / `147`.

## Non toccato
- dataset / manifest / payload embedded
- query engine / geometrie / storage / rete / proxy / Objects GIS
- navigation system globale, altri pannelli, waypoint/track/polygon
- UX1 (`CARTO_IGM_SERIES_VISUAL`) e UX2 (font/halo/pill label)
- Cataloga/Modifica/Centra, archive matching, persistenza

## Runtime
- FULL SHA: `9588e6cdeca743afed3dad0358984a5af637e9a1`
- blob: `84b3c8282f62df9a94cd56a18bb1d1b6b753910d`
- byte: `9766934`
- SHA-256: `4a41b6fcfa1c48b06117c42995759eb994388eeab3bdbec7d32a3e7ccd6cfd46`
- payload count: 8204; SHA payload invariato `487AC0A0FDB676001631DF90F20D12F784C70364CCBFF6DF2004F4636C8B6283`

## Verifiche
- `node --check` PASS (blocchi JS estratti)
- `git diff --check` PASS
- payload embedded byte-invariato PASS
- dataset / manifest invariati PASS
- diff scope: solo `coordinate_converter Claude.html` (+73/−17)

## Deploy / QA
- Deploy: NOT EXECUTED (gate esplicito)
- QA: NOT EXECUTED (attende review + deploy)
- `finito`: NOT EXECUTED

## Prossimo passo
Review GPT-sostitutiva → deploy UX3 → QA (startup, filtri auto-refresh, layout pannello, first-open, regressioni UX1/UX2).
