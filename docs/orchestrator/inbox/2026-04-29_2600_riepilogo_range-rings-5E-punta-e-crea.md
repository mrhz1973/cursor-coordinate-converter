# Riepilogo — Range Rings 5E «Punta e crea»

**Data:** 2026-04-29  
**File:** `coordinate_converter Claude.html` (monolite; **non** nel commit selettico orchestratore salvo richiesta esplicita).  
**Checkpoint / session / roadmap:** non toccati.

## Scopo

Flusso aggiuntivo: l’utente compila distanze/unità (e opzionalmente il nome), preme **«Punta e crea»** (`#rrPickCreateBtn`), un solo clic sulla mappa crea il set (stesso percorso di `rrCreateFromUi()`) senza dover premere **«Crea anelli»**. **«Punto sulla mappa»** resta solo impostazione centro.

## Stato e helper

- `state.rangeRingsPickAndCreateMode` (transiente, non persistito).
- `rangeRingsEnterPickAndCreateMode()`: pre-validazione con `parseRangeRingDistancesInput`; se vuoto → `rrShowError("rangeRings.err.distances")` e nessun arm.
- `rangeRingsClearPickCenterMode(opts)`: esteso per azzerare anche `rangeRingsPickAndCreateMode` e rimuovere `range-rings-pick-create-mode` su `.tile-map` (re-use di tutte le chiamate esistenti: tab, chiusura pannello, Esc, ecc.).
- `rangeRingsEnterPickCenterMode()`: azzera `rangeRingsPickAndCreateMode` all’ingresso.
- `trackSyncPickModeUi()`: `tile-map` class `range-rings-pick-create-mode` quando `rangeRingsPickAndCreateMode`.

## Mappa

- In `attachPanHandlers` → `onUp`, **prima** del blocco track/waypoint: se `rangeRingsPickAndCreateMode && !drag.moved` → `mapClientToLatLonMap` → `_rangeRingsMapPickCenter` + `rrCenterMode` = `picked` → disarmo flag → `rrCreateFromUi()` → `renderRangeRingsPanel()` + `refreshTileMapForTrackUi()`.
- Il drag (pan) non entra in questo branch (`moved` true).

## UI / i18n

- Pulsante secondario accanto a `rrPickMapBtn`: `data-i18n` / `data-i18n-tip` per `rangeRings.pickCreate`, `tip.rangeRingsPickCreate`, testo stato `rangeRings.pickCreateActive` (IT/EN/FR).
- Stile cursore: regole CSS allineate a `range-rings-pick-mode` per `range-rings-pick-create-mode`.

## Esc

- In `bindHotkeys`, Esc cancella se `rangeRingsPickCenterMode || rangeRingsPickAndCreateMode` (stesso `rangeRingsClearPickCenterMode()`).

## Non toccato

- 5F, handle SVG, shape persistita set, Mappe offline, track/waypoint core, GPS automatico, ecc.

## QA in sessione

- `node --check` su righe script `8420–35062`, `git diff --check` sul monolite: OK.
- Test manuali in browser: da eseguire (click, drag, Esc, pannello, conflitti tool).

## Commit

Solo `docs/orchestrator/**` selettico (memoria), **non** il monolite (policy default).
