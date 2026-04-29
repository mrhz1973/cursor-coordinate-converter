# Riepilogo intervento — Range Rings UI standard (post 5C/5D)

**Data:** 2026-04-29  
**File monolite:** `coordinate_converter Claude.html` (non versionato in commit selettico orchestratore; vedi sotto).  
**Checkpoint/session/roadmap:** non toccati, come da richiesta.

## Obiettivo

Allineare Range Rings agli standard progetto: colonne tabella ridimensionabili, preset distanze vicino al campo, flusso map-first con “Punto sulla mappa” evidenziato, senza 5E/5F né regressioni 5D (label SVG per `labelMode: "name"`).

## A — Colonne ridimensionabili

- Stato sessione su `#rrList` (`_rrNameColPx`, `_rrCenterColPx`, `_rrRingsColPx`, `_rrWhenColPx`, `_rrActionsColPx`), niente localStorage.
- `ensureRangeRingsTableColResizeWired()`: stesso modello Aree offline / tracce salvate (pointer capture su documento, `pointer:coarse` = nasconde handle).
- `renderRangeRingsList`: `colgroup` con classi `rr-col-*`, variabili CSS `--rr-*-col` sulla `<table>`, maniglie in `<th>`.
- Stili: `#sec-rangerings .rr-table` con `table-layout: fixed`, condivisione regole hover/resize con `.offline-areas-table` / `.saved-tracks-table` ove già presente.
- Celle `td.sub` con `word-break` / `overflow-wrap` per testi lunghi; input nome a `max-width: 100%` nella colonna.

## B — Preset distanze

- Campi `#rrDistances` / `#rrUnit` invariati; preset come pulsanti con `data-rr-preset` e `data-rr-values` (stesso handler `bindRangeRingsUI` esistente).
- Preset richiesti: 100,250,500 m; 1,2,5; 1,5,10; 5,10,25; 10,25,50 km.
- Rimosse le vecchie tre righe (5–50 km, NM, 100–500 m) sostituite dal set unificato.
- i18n IT/EN/FR: `rangeRings.presetsQuick`, `rangeRings.preset*`, `tip.rangeRingsPreset*`, `rangeRings.colResizeAria`.

## C — Map-first

- Ordine UI: hint → `rrMapFirstHint` (visibile se modalità `picked`, nessun centro mappa, non in pick mode) → `rrPickMapBtn` (primary) → griglia Nome + Centro.
- `select#rrCenterMode`: opzione predefinita `picked` (prima in lista); fallback JS `"picked"` ove usato.
- `rrCreateBtn`: stile `btn` senza `btn-primary` (gerarchia: CTA mappa = primary).

## D — 5D

- Nessuna modifica a `renderRangeRingsOverlay` / `labelMode`; solo testo e layout pannello.

## QA richiesto (replica ambiente)

- `git diff --stat`, `git diff --check` sul monolite, `node --check` su righe script `8417–34961` del file: OK in sessione.
- Test manuali: da verificare in browser (resize, preset, map-first, tabella, batch, label nuovi set).

## Rischi residui

- Doppio `btn-primary` era stato evitato (solo pick); l’esperienza “Crea anelli” resta CTA visibile ma secondaria sotto; se serve un solo primary ovunque, rivalutare.
- Tabelle molto strette: `table-layout: fixed` può comprimere testo; word-wrap mitiga.

## Commit

Autoscync: solo `docs/orchestrator/**` (il monolite resta non committato se non richiesto esplicitamente).
