# T1.1 Pass D — polygon export GeoJSON/KML

**Data:** 2026-05-20  
**Tipo:** Implementazione CODE  
**Stato:** Completato (browser QA pending)

---

## Summary

Export di `state.gisPolygons[]` in **GeoJSON** (FeatureCollection RFC 7946) e **KML 2.2** con download browser. Controlli nel footer del pannello floating Poligoni; nessun import/edit/delete.

---

## Source discovery docs used

- `docs/orchestrator/latest.md` (top entries: Pass C PASS, Pass D come prossimo feature)
- `docs/orchestrator/inbox/2026-05-19_1930_browser-pass-polygon-draw.md` (handoff Pass D)

---

## Files changed

| File | Modifica |
|---|---|
| `coordinate_converter Claude.html` | Export functions, UI buttons, i18n IT/EN/FR, `renderPolygonPanelList` export button state |
| `docs/orchestrator/latest.md` | Sintesi Pass D |
| `docs/orchestrator/inbox/2026-05-20_0025_pass-d-polygon-export.md` | Questo record |

**Non toccati:** dev-method, alina-lavoro, package.json, altri repo.

---

## Functions added/changed

**Aggiunte:**

- `polygonXmlEscape(s)` — wrapper su `xmlEsc`
- `polygonKmlColor(cssHex, alphaHex)` — CSS hex → KML aabbggrr
- `polygonRingToKmlCoords(ring)` — anello GeoJSON → stringa KML lon,lat,alt
- `polygonBuildGeoJson()` — FeatureCollection da `state.gisPolygons`
- `polygonExportGeoJson()` — download `.geojson` + `setBadge`
- `polygonBuildKml()` — KML Document con Placemark/Polygon e Style colore
- `polygonExportKml()` — download `.kml` + `setBadge`

**Modificate:**

- `renderPolygonPanelList()` — abilita/disabilita `#polygonPanelExportGeoJsonBtn` / `#polygonPanelExportKmlBtn`

**Preservate (non modificate):** `polygonStartDraw`, `polygonFinishDraw`, `polygonCancelDraw`, `renderPolygonDraftOverlay`, `renderGisPolygonsOverlay`, `openPolygonPanel`, `closePolygonPanel`.

---

## Static checks

| Check | Esito |
|---|---|
| `<script>` blocks | **2** (invariato) |
| `<script src=` | **0** |
| `type="module"` | **0** |
| Dipendenze esterne nuove | **Nessuna** |
| `node --check` blocco script 1 | **SYNTAX OK** |
| `node --check` blocco script 2 (main) | **SYNTAX OK** |

---

## Browser QA

**NOT EXECUTED** — nessun server/browser automatizzato in questa sessione Agent.

### Manual QA checklist

1. Apri GIS mode, pannello Poligoni.
2. Disegna e salva ≥2 poligoni.
3. **Esporta GeoJSON** → file `.geojson`; verifica `type: FeatureCollection`, `features[]`, geometry Polygon, properties name/color.
4. **Esporta KML** → file `.kml`; verifica root `kml`, `Document`, `Placemark`, `Polygon`/`outerBoundaryIs`/`LinearRing`/`coordinates`.
5. Con zero poligoni: pulsanti export disabilitati; click (se forzato da devtools) → badge info «Nessun poligono», nessun file vuoto.
6. Regressione: draw dopo export; Track/Waypoint pick; panel drag/resize/minimize; Range Rings, Astro, Measure; no errori console.

---

## Known risks / deferred

- Import GeoJSON/KML, edit, delete: **fuori scope** (Pass E).
- Fori (inner rings) / MultiPolygon: export coordinate come memorizzate; nessun handling speciale.
- `defaultName` / `savedOk` / etichette «Chiudi poligono» ancora senza chiavi i18n dedicate (pre-esistente).
- Interop KML in Google Earth / QGIS non validata senza browser PASS.

---

## Next recommended step

1. Eseguire **browser QA** sopra e registrare **PASS** in inbox se ok.
2. Se PASS: **T1.1 Pass E** — polygon polish / edit / delete.
3. Se regressione export: fix mirato prima di Pass E.
