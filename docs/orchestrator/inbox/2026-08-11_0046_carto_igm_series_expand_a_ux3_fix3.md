# CARTO-IGM-SERIES-EXPAND-A-UX3-FIX3 — riepilogo intervento

## Esito
CARTO-IGM-SERIES-EXPAND-A-UX3-FIX3 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED

## Trigger
QA: FIX2 ha nascosto la landing Convertitore, ma resta un frame intermedio (header classico + mappa scura) perché `gis-boot` veniva rimosso subito dopo `add("gis-mode")`, prima di relocate/topbar/map sizing.

## Cosa è stato fatto
1. **CSS:** `body.gis-boot > header { visibility:hidden; pointer-events:none; }` (layout preservato).
2. **gisInit:** rimossa la `remove("gis-boot")` immediata dopo `add("gis-mode")`.
3. **Reveal atomico:** a fine `gisInit`, `requestAnimationFrame(() => body.classList.remove("gis-boot"))` (+ fallback sync in catch).
4. **Failsafe:** ramo `state.gisMode === false` continua a rimuovere `gis-boot`.
5. **Build:** `CARTO-IGM-SERIES-EXPAND-A-UX3-FIX3` / `150`.

## Non toccato
IGM top-align FIX2, height 0.78/720, first-open, filtri, zero-serie FIX1, tooltip, Cataloga/Modifica/Centra, UX1/UX2, payload, dataset, query, storage, rete, proxy, Objects GIS, navigation system, Converti.

## Runtime
- FULL SHA: `65c9ef8fc8bf652f322c6c7e82a6d1d6912ecb76`
- blob: `cfd3acf33f5860864e4e019273e68174b45812d9`
- byte: `9768970`
- SHA-256: `6e54d5cea22e6da4af2fce2a74cefeb5e7799b23e15d1e28e98d8230145a7d62`
- payload count: 8204; SHA payload invariato `487AC0A0FDB676001631DF90F20D12F784C70364CCBFF6DF2004F4636C8B6283`

## Verifiche
- `node --check` PASS
- `git diff --check` PASS
- payload byte-invariato PASS
- dataset/manifest invariati PASS
- diff scope: solo monolite (+18/−5)

## Deploy / QA
- Deploy: NOT EXECUTED
- QA: NOT EXECUTED
- `finito`: NOT EXECUTED

## Prossimo passo
Review GPT-sostitutiva → deploy FIX3 → QA hard reload (nessun header intermedio).
