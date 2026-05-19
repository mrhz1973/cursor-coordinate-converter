# T1.1 Compound Polygon — Pass A: SVG overlay rendering

**Data:** 2026-05-19 17:30  
**Branch:** main  
**Tipo:** CODE — AUTOMATION HANDOFF TEST 1  
**Task discovery:** Automatica da `docs/orchestrator/latest.md` + `docs/orchestrator/inbox/2026-05-19_1700_plan_t1.1-compound-polygon.md`

---

## Sommario

Pass A implementato: `renderGisPolygonsOverlay()` aggiunta al monolite. I poligoni presenti in `state.gisPolygons[]` vengono ora disegnati come overlay SVG semi-trasparente sulla tile map. Nessun pannello UI, nessuna interazione — solo rendering di dati già persistiti.

---

## File modificati

| File | Tipo | Righe aggiunte |
|------|------|----------------|
| `coordinate_converter Claude.html` | codice runtime | +66 |
| `docs/orchestrator/latest.md` | docs | +1 riga |
| `docs/orchestrator/inbox/2026-05-19_1730_pass-a-polygon-render.md` | docs | nuovo |

---

## Implementazione

### Funzione aggiunta: `renderGisPolygonsOverlay(tileMap, markerLat, markerLon, zoom)`

Inserita immediatamente prima di `renderGisMapGpsOverlay` (già presente), seguendo il pattern esatto di `renderSavedTracksOverlays`.

**Comportamento:**
1. Rimuove overlay precedente `.gis-polygons-overlay` se presente (idempotente).
2. Se `state.gisPolygons` è vuoto, ritorna senza creare DOM.
3. Crea SVG `z-index:4` (sopra tracks z:3, sopra RR z:2, sotto GPS z:7).
4. Per ogni `Feature` in `state.gisPolygons`:
   - Salta se `properties.visible === false`.
   - Legge `geometry.coordinates[0]` (outer ring GeoJSON, `[lon, lat]`).
   - Converte con `tileMapLatLonToPx(root, lat, lon)` — coordinate invertite correttamente.
   - Sottrae offset pan `tx/ty` dal tile-layer transform.
   - Rimuove l'ultimo punto se coincide con il primo (auto-chiusura GeoJSON).
   - Richiede ≥ 3 punti pixel distinti.
   - Crea `<polygon>` SVG: fill colore a opacity 0.18, stroke colore pieno, stroke-width 1.5.
   - Colore da `properties.color`, default `#ca8a04` (colore default layer polygons).
5. Avvolge in `<div class="gis-polygons-overlay">`, appende a `tileLayer`.
6. Se nessun poligono è visibile, non aggiunge il wrapper al DOM.

### Siti di chiamata aggiunti

**In `renderTileMap` (riga ~29435, inserzione dopo `renderRangeRingsOverlay`):**
```js
try { renderGisPolygonsOverlay(tileMap, lat, lon, zoom); } catch(_){}
```

**In `renderTrackAll` (riga ~28294, inserzione dopo `renderRangeRingsOverlay`):**
```js
try { renderGisPolygonsOverlay(tileMap, lp.lat, lp.lon, z); } catch(_){}
```

Entrambe usano `try/catch` per protezione, coerenti con il pattern `renderGisMapGpsOverlay`.

---

## Static checks

| Check | Risultato |
|-------|-----------|
| `<script src` | **0** |
| `type="module"` | **0** |
| Blocchi `<script>` / `</script>` | **2** |
| `node --check` blocco principale | **SYNTAX OK** (Node v24.15.0) |
| Righe aggiunte al monolite | **66** |
| File toccati (runtime) | **1** (`coordinate_converter Claude.html`) |

---

## Browser QA

**NOT EXECUTED** — ambiente senza browser.

### Checklist manuale Pass A

1. Aprire GIS Tool nel browser (GIS mode).
2. Da console browser, iniettare un poligono di test:
   ```js
   const f = gisFeatureAdd("polygon", {
     geometry: {
       type: "Polygon",
       coordinates: [[[12.33, 44.40], [12.36, 44.40], [12.36, 44.42], [12.33, 44.42], [12.33, 44.40]]]
     },
     properties: { name: "Test Alfa", color: "#ca8a04" }
   });
   renderTileMap(state.viewCenter.lat, state.viewCenter.lon, state.mapZoom);
   ```
3. Verificare che il poligono appaia come overlay semi-trasparente sulla mappa.
4. Zoomare/pannare: verificare che il poligono si muova con la mappa.
5. Verificare che waypoint e saved tracks siano ancora visibili.
6. Verificare nessun errore console.
7. Ricaricare pagina: verificare che il poligono persista (già in saveStore).
8. Regressioni:
   - Waypoint flow (map click, Enter-save) invariato.
   - Track overlay invariato.
   - Range Rings overlay invariato.
   - CoT XML export/import invariato.
   - GPX/KML/GeoJSON export invariato.
   - Console: zero errori.

---

## Rischi noti

- La funzione usa `try/catch` nei call site → un eventuale errore non crasherebbe l'app.
- Se `tileMapLatLonToPx` ritorna coordinate fuori schermo, il punto viene comunque incluso nel poligono SVG (SVG clip è disabilitato con `overflow:visible`). Non è un bug ma può causare rendering fuori schermo per poligoni molto grandi. Accettabile per v1.
- Pass B (pannello UI) non ancora implementato: i poligoni di test possono essere iniettati solo da console.

---

## Prossimo passo raccomandato

**Pass B — Pannello floating shell + lista** (`#polygonPanel`): dialog floating con lista poligoni, drag/resize, minimize, pulsante "Nuovo poligono" (non ancora funzionale), i18n IT/EN/FR.
