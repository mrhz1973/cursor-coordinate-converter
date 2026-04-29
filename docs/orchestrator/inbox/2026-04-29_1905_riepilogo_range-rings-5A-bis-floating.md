# Riepilogo operativo — Range Rings **5A-bis** (pannello floating on-map)

**Timestamp nome file:** 2026-04-29 19:05 (locale Cursor).

## Problema osservato

Il pulsante on-map **Rings** (`data-role="rangerings-open"`) apriva il **drawer Strumenti** grande (`openToolsDrawer` + `activateToolPanel("rangerings")`), coprendo troppa mappa per un uso tattico.

## Causa

`openRangeRingsToolFromMap()` in GIS mode seguiva il flusso “Strumenti” invece di un contenitore **non modale** sopra la mappa.

## Fix applicato

- Aggiunto `<dialog id="rangeRingsPanel">` (pattern **Layers / Favoriti / Cerca**: `app-modal` + `gis-panel-floating`, drag/resize).
- Nuove funzioni: `_rangeRingsPanelLayoutOpts`, `attachRangeRingsPanelFloatingGis`, `clampRangeRingsPanelRect`, `wireRangeRingsPanelFloatingGis`, `openRangeRingsFloatingPanelGis`, `closeRangeRingsPanel`.
- `openRangeRingsToolFromMap()`: in GIS prova **prima** `openRangeRingsFloatingPanelGis()` (chiude drawer/modal tools inline, `closeToolsDrawer`, reparent `#sec-rangerings` in `#rangeRingsPanelBody`, `show()` non modale, `renderRangeRingsPanel()`); **solo se** il dialog manca → fallback drawer + `activateToolPanel("rangerings")`.
- `activateToolPanel`: all’inizio chiude il floating Range Rings se aperto (evita sezione duplicata / conflitto con altri tool).
- `prepareUiBeforeAppFullReset`, listener chiusura in `gisInit`, **Esc** additivo, `resize`: allineati agli altri pannelli floating.
- `gisPanelBringToFront`: incluso `rangeRingsPanel` nella lista z-order.
- Stato transiente: `state.rangeRingsPanelOpen`.

## File modificati

- `coordinate_converter Claude.html` (solo le regioni sopra).

## Cosa non è stato toccato (per scope)

- Logica dati Range Rings (`state.rangeRingSets`, export, overlay, selezione, ecc.) invariata salvo wiring UI.
- Accesso da **Strumenti** (tile + `activateToolPanel("rangerings")`) invariato nel flusso drawer; il floating viene chiuso quando si attiva un altro tool dal drawer.

## Verifiche tecniche

- `git diff --check -- "coordinate_converter Claude.html"`: ok.
- Estrazione primo `<script>` + `node --check`: ok.

## Prossimo passo consigliato

Smoke test browser: clic on-map Rings → pannello floating compatto, mappa visibile; Strumenti → Range Rings ancora ok; Esc chiude il floating.
