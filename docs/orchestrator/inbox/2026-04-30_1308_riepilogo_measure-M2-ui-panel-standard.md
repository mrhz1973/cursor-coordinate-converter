# Riepilogo — Misura M2: UI pannello GIS secondo standard

**Data:** 2026-04-30 13:08 UTC  
**Blocco:** M2 (UI pannello Misura GIS)  
**Perimetro:** UI pannello `#sec-measure` `.meas-gis-only` (nessun `finito`)

## Cosa è stato modificato (UI Misura)

- Aggiunta nel pannello Misura GIS una riga azioni **in contesto** con comando **Pulisci** (stile **danger-subtle**) per azzerare i vertici misura senza uscire dal tab.
- Micro CSS scoped per rendere l’area azioni coerente e non invasiva (dark/light, mobile).
- Il comando clear nel pannello chiama la stessa semantica già esistente: azzera `mapMeasurePts`/`mapPolyPts`, pulisce drag state, aggiorna overlay/readout e risincronizza `#measOperativeNotices`.

## File toccati

- `coordinate_converter Claude.html`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1308_riepilogo_measure-M2-ui-panel-standard.md`

## Regioni / funzioni toccate (monolite)

- **HTML**: `#sec-measure` → `.meas-gis-only` (aggiunto `<div class="meas-gis-actions">` + bottone `data-role="gis-meas-clear"`).
- **CSS**: scoped Misura GIS (`.meas-gis-only .meas-gis-actions` + micro override bordo per `.btn-danger-subtle`).
- **JS**: listener GIS misura (document `click` handler vicino a `[data-gis-meas-flow]` / `[data-gis-meas-kind]`) per gestire `data-role="gis-meas-clear"`.

## Conferme vincoli

- **Matematica misura**: invariata.
- **M4 storico / M5 export / M6 overlay polish**: **non** implementati.
- **Persistenza**: nessuna persistenza geometrie (`mapMeasurePts`/`mapPolyPts` restano transient). Preferenze (`mapMeasureUnit`, `mapMeasureKind`, `mapPolyClosed`, `gisMeasureFlow`) restano come da M1.
- Nessun floating panel nuovo: il pannello resta nel drawer/tab Misura GIS.

## QA eseguito

- `git diff --stat`
- `git diff --check -- "coordinate_converter Claude.html"`
- `node --check` su JS estratto dal `<script>`
- Test manuale (da completare in browser): layout, linea/poligono, unità, Due punti/Proietta, notices, clear, undo, Esc, pan/zoom, overlay, regressioni RR/Track/WP, dark/light.

## Rischi residui

- Basso: il clear nel pannello usa le stesse variabili globali della misura mappa; rischio principale è UX (utente si aspetta che “Pulisci” faccia anche altro) mitigato da label standard già usata altrove.

## Prossimo passo consigliato

- Se serve, aggiungere (sempre UI-only) un richiamo “Undo” in pannello o un hint contestuale, ma solo se non duplica/confondendo i controlli già sulla mappa.

