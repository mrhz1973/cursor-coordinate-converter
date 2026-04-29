# Riepilogo intervento — Range Rings floating: cleanup titolo duplicato

**Data:** 2026-04-29 18:26 (locale Cursor)  
**File monolite:** `coordinate_converter Claude.html` (modifiche locali; **non** incluso nel commit autosync orchestratore).

## Obiettivo

- Rimuovere la scritta/link blu “Range Rings” **duplicata** dentro il pannello floating `#rangeRingsPanel`, che risultava cliccabile e poteva chiudere/collassare la sezione.

## Causa

- Nel floating panel, `openRangeRingsFloatingPanelGis()` **reparenta** `#sec-rangerings` (un `<details>`) dentro `#rangeRingsPanelBody`.
- Il `<summary data-i18n="sec.rangerings">Range Rings</summary>` del `<details>` rimane visibile e, con gli stili default del browser, appare come **testo blu cliccabile** (toggle di `<details>`), producendo un comportamento percepito come “chiudi/cambia finestra”.

## Fix minimo applicato

- CSS scoped solo per il floating panel:
  - `#rangeRingsPanelBody #sec-rangerings > summary` reso **visualmente nascosto** (pattern già usato per Waypoint modal: non `display:none`, ma clip 1px).
  - `#rangeRingsPanelBody #sec-rangerings .section-body { display:block !important; }` per garantire resa del contenuto.

## Impatto / invarianti

- **Accesso da Strumenti → Range Rings** invariato: il fix è scoped a `#rangeRingsPanelBody` (non tocca drawer/Tools).
- Nessuna modifica a: logica dati Range Rings, pick centro mappa, overlay, export, selezione/visibilità, persistenza, Offline, Track, Waypoint, CoT, geocoding, OPSEC, GPS live, coord-cycle.

## Test browser (manuale)

1. Click su Rings dalla mappa → si apre `#rangeRingsPanel`.
2. La scritta blu duplicata “Range Rings” **non** compare più nel body del pannello.
3. La X chiude normalmente il pannello.
4. Pick centro da mappa + «Crea anelli» + export selezionati continuano a funzionare.
5. Strumenti → Range Rings continua a funzionare (render del tool invariato).

## QA tecnico (locale)

- `git diff --check -- "coordinate_converter Claude.html"`: ok
- Estrazione JS inline + `node --check`: ok

## Prossimo passo consigliato

- Continuare QA UX del pannello (desktop/touch) e commit del monolite solo su richiesta utente.

