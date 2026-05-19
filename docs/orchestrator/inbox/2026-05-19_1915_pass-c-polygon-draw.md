# T1.1 Pass C — Polygon Map Draw Interaction

**Data:** 2026-05-19  
**Tipo:** CODE  
**Stato:** implementato, browser QA pending

---

## Sommario

Implementata l'interazione di disegno poligono sulla mappa tile. L'utente clicca "Nuovo poligono" nel pannello polygon, entra in draw mode, aggiunge vertici cliccando sulla mappa, e chiude il poligono con double-click o pulsante "Chiudi poligono". Il poligono viene salvato in `state.gisPolygons` tramite `gisFeatureAdd("polygon", feature)` e renderizzato dalla preesistente `renderGisPolygonsOverlay()` (Pass A).

---

## File e funzioni toccati

### `coordinate_converter Claude.html`

| Riga (approx) | Funzione / Sezione | Modifica |
|---|---|---|
| ~9491 | HTML `#polygonPanelNewBtn` | Aggiunto `onclick="polygonStartDraw()"`, rimosso `disabled` |
| ~9495-9498 | HTML footer polygon panel | Aggiunti pulsanti `#polygonPanelFinishBtn` e `#polygonPanelCancelBtn` |
| ~19691 | `bindHotkeys` Esc handler | Aggiunto branch `state.polygonDrawMode` → `polygonCancelDraw()` |
| ~30112-30133 | `onUp` handler (tile map) | Aggiunto branch `state.polygonDrawMode`: vertex add + double-click finish |
| ~39074 | `closePolygonPanel()` | Aggiunto `polygonCancelDraw()` su chiusura panel |
| ~39085-39196 | Nuove funzioni Pass C | `polygonStartDraw`, `polygonCancelDraw`, `polygonFinishDraw`, `renderPolygonDraftOverlay` |
| ~39954 | `openTrackModal` blocked check | Aggiunto `state.polygonDrawMode` alla condizione `blocked` |

### `docs/orchestrator/latest.md`
- Aggiunta entry Pass C

---

## Comportamento implementato

1. **Attivazione:** click su "Nuovo poligono" → `polygonStartDraw()` → setta `state.polygonDrawMode=true`, azzera `_polygonDraftVertices`, disabilita conflicting pick modes (track, waypoint, RR, astro).
2. **Aggiunta vertici:** click mappa in `onUp` handler → push `[normalizeLon(lon), lat]` in `_polygonDraftVertices`, re-render draft overlay.
3. **Draft overlay:** `renderPolygonDraftOverlay()` disegna SVG con poligono dashed (`#ca8a04`), fill semi-trasparente, e cerchietti vertice.
4. **Finish:** double-click (400ms/12px soglia) con ≥3 vertici, oppure click "Chiudi poligono" → `polygonFinishDraw()` → build GeoJSON ring [lon,lat], auto-close, `gisFeatureAdd("polygon", feature)`, reset draw state, badge successo.
5. **Cancel:** Esc key, click "Annulla", o chiusura panel → `polygonCancelDraw()` → reset state.
6. **Panel UI sync:** `renderPolygonPanelList()` già gestisce: New btn disabled durante draw, Finish btn visibile se ≥3 vertici, Cancel btn visibile durante draw.
7. **Conflitti:** `openTrackModal` non auto-arma `pickMode` se `polygonDrawMode` è attivo. `polygonStartDraw` disabilita track/waypoint/RR/astro pick modes.

---

## Static checks

- **`<script>` blocks:** 2 ✓
- **`<script src=`:** 0 ✓
- **`type="module"`:** 0 ✓
- **`node --check`:** non applicabile (file .html, Node non supporta syntax check HTML)

---

## Browser QA — NOT EXECUTED

### Checklist manuale

1. **Apri GIS mode**, apri pannello Poligoni
2. **Click "Nuovo poligono"** → pulsante si disabilita, appaiono "Annulla" (visibile) e "Chiudi poligono" (nascosto)
3. **Click sulla mappa** → appare primo vertice (cerchietto giallo)
4. **Click ancora 2 volte** → 3 vertici, poligono dashed visibile, appare "Chiudi poligono"
5. **Click "Chiudi poligono"** → poligono salvato, badge "Poligono salvato", appare nella lista panel, overlay solido
6. **Ripeti:** draw un altro poligono, questa volta finisci con **double-click** → stessa cosa
7. **Esc durante draw** → draft cancellato, tornato a stato idle
8. **"Annulla" durante draw** → idem
9. **Chiudi panel durante draw** → draft cancellato
10. **Regressione Track:** apri Track panel → pick mode si arma; click mappa → vertice track (non poligono)
11. **Regressione Waypoint:** apri Waypoint panel → pick mode si arma; click mappa → draft waypoint
12. **Conflitto:** attiva polygon draw → apri Track panel → track pick mode NON si arma (blocked)
13. **Pan/zoom durante draw** → draft overlay segue correttamente la mappa
14. **Poligono con <3 vertici + finish button** → button non visibile; double-click → cancel (non crash)

---

## Rischi

- **Draft overlay su pan/zoom:** il draft overlay usa posizioni calcolate al momento del render; un pan/zoom rapido potrebbe mostrare un frame sfalsato fino al prossimo render. Rischio cosmetico basso.
- **Double-click false positive:** la soglia 400ms/12px è la stessa usata per waypoint. Se l'utente clicca due vertici vicini rapidamente, potrebbe triggerare un finish indesiderato. Mitigazione: l'utente può usare il pulsante "Chiudi poligono" per controllo esplicito.
- **GeoJSON coordinate order:** i vertici sono salvati in ordine [lon, lat] (standard GeoJSON). Se un consumer esterno si aspetta [lat, lon] potrebbe interpretare male. Il renderer interno (`renderGisPolygonsOverlay`) usa correttamente `coords[i][0]` = lon, `coords[i][1]` = lat.

---

## Prossimo consigliato

**T1.1 Pass D — polygon export GeoJSON/KML** oppure **Pass E — polygon edit/delete/polish**.

Pass D scope:
- Export `state.gisPolygons` come `.geojson` FeatureCollection
- Export come `.kml` con Placemark/Polygon
- UI: pulsante export nel polygon panel

Pass E scope:
- Delete singolo poligono (click destro o bottone lista)
- Toggle visibilità (già nel panel list, ma handler da implementare)
- Rename poligono inline
- Color picker per poligono
