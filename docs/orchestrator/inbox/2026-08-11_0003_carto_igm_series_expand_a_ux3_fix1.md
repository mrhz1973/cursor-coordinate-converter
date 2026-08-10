# CARTO-IGM-SERIES-EXPAND-A-UX3-FIX1 — riepilogo intervento

## Esito
CARTO-IGM-SERIES-EXPAND-A-UX3-FIX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED

## Trigger
Finding review GPT su UX3: con `selectedSeries.length === 0`, `onFilter()` mostrava il notice ma lasciava risultati e footprint stale.

## Cosa è stato fatto
Nel ramo zero-serie di `onFilter()`:
- preservati `queryBbox` / `selectedArea` / `areaMode`;
- `selectedSeries` resta `[]`;
- `selectedRecordId = null`;
- `results = []`, `total = 0`, `truncated = false`, `error = null`, `status = "ready"` (header "Risultati: 0");
- `cartoUiRefreshOverlay()` + `cartoUiRenderPanel()`;
- notice `carto.needOneSeries`;
- **non** chiama `cartoUiClearResults*` (che azzererebbe bbox/area);
- **non** esegue `cartoUiRunSearch()` con zero serie;
- ramo con ≥1 serie invariato → continua a rilanciare `cartoUiRunSearch()`.

Build bump → `CARTO-IGM-SERIES-EXPAND-A-UX3-FIX1` / `148`.

## Non toccato
startup MAPPA, Converti, geometry pannello, first-open, tooltip, hide Cancella, UX1/UX2, dataset/payload/query engine/storage/matching, altri path di `onFilter`.

## Runtime
- FULL SHA: `02c7b99bd282df4723ecd879b75c655874327dc1`
- blob: `6830e583459d420ee6101bc875a2db3aacabdb3e`
- byte: `9767301`
- SHA-256: `de8c373317a1125fec95a927e69d5ca6bf60fe459a8d50cac7d7417fb52a682e`
- payload count: 8204; SHA payload invariato `487AC0A0FDB676001631DF90F20D12F784C70364CCBFF6DF2004F4636C8B6283`

## Verifiche
- `node --check` PASS
- `git diff --check` PASS
- payload byte-invariato PASS
- dataset/manifest invariati PASS
- diff scope: solo monolite (+12/−3)

## Deploy / QA
- Deploy: NOT EXECUTED
- QA: NOT EXECUTED
- `finito`: NOT EXECUTED

## Prossimo passo
Review GPT-sostitutiva → deploy FIX1 → QA (zero-serie clear + riattivazione serie sulla stessa area).
