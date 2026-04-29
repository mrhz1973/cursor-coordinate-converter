# Riepilogo — Range Rings: etichette distanza + guide radiali 0° / 90° / 270°

**Data:** 2026-04-30

## Implementazione

- **`rrFormatDistanceLabel(distanceM, unit)`** (dopo `rangeRingMetersToUnit`): formatta valore + suffisso (`m`, `km`, `NM`, `mi`) con cifre ridotte in base alla grandezza; nessun impatto su parser o store.
- **`renderRangeRingsOverlay`:** dopo i poliline degli anelli geodetici, per ogni raggio visibile:
  - tre segmenti **`<line>`** da centro mappa (proiezione tile) a `vincentyDirect(c, r, br)` con `br ∈ {0, 90, 270}` (gradi, coerente con `buildGeodesicCircleRing`);
  - classi `rr-distance-guide--0` (tinta piena) e `rr-distance-guide--eq` (tratteggio) + colore set;
  - un **`<text class="rr-distance-label">`** con distanza formattata, posizionato oltre il punto 0° con offset tangente per ridurre sovrapposizione al tratto;
- **CSS** in blocco `.range-rings-overlay`: guide sottili, opacità; label con `paint-order` + alone come `.rr-label`; `pointer-events: none`.

## Non realizzato

- **5F** drag handle centro: non toccato.

## File toccati

- `coordinate_converter Claude.html` (helper, CSS, `renderRangeRingsOverlay`).

## QA

- `git diff --check -- "coordinate_converter Claude.html"`: ok
- `node --check` su script estratto: ok
- Test manuale: elenco in specifica (pan/zoom, modifica, visibilità, import/rename/…): da fare in UI.

## Rischi residui

- Molti anelli / set densi: etichette distanza possono accavallarsi (stesso vincolo della label nome 5D).
- Proiezione equirettangolare sui tile: coerente col resto dell’overlay.

## Prossimo passo

- QA visivo in GIS; eventuale offset adattivo se clutter su zoom estremi; backlog 5F.
