# T1.1 Pass E — polygon polish / edit / delete

**Data:** 2026-05-20  
**Tipo:** Implementazione CODE  
**Stato:** Completato (browser QA pending)

---

## Summary

Pannello Poligoni: **elimina** con conferma in-pannello (`#polygonPanelDeleteBar`, no `window.confirm`), **rinomina** con barra input (`#polygonPanelRenameBar`), **visibilità** con toggle per `data-poly-id` via `gisFeatureUpdate`. Lista con azioni **Rinomina** / occhio / **Elimina** per riga. Persistenza tramite `gisFeatureDelete` / `gisFeatureUpdate` + `saveStore()`. Export Pass D invariato.

---

## Files changed

| File | Modifica |
|---|---|
| `coordinate_converter Claude.html` | HTML barre confirm/rename, CSS `.poly-actions`, funzioni Pass E, `renderPolygonPanelList`, i18n IT/EN/FR, wire in `openPolygonPanel` / `closePolygonPanel` |
| `docs/orchestrator/latest.md` | Sintesi Pass E |
| `docs/orchestrator/inbox/2026-05-20_0039_pass-e-polygon-polish.md` | Questo record |

---

## Functions added/changed

**Aggiunte:**

- `polygonHideDeleteBar`, `polygonHideRenameBar`
- `polygonShowDeleteConfirm`, `polygonDeleteExecute`
- `polygonShowRenameBar`, `polygonRenameExecute`
- `polygonToggleVisibility`
- `polygonWirePanelBarsOnce`, `ensurePolygonPanelListWired`

**Modificate:**

- `renderPolygonPanelList` — righe con `data-poly-id` e azioni
- `openPolygonPanel` — wire UI
- `closePolygonPanel` — nasconde barre pending

**Preservate:** draw/export Pass A–D, `gisFeatureAdd`, overlay render.

---

## Static checks

| Check | Esito |
|---|---|
| `<script>` blocks | **2** |
| `<script src=` | **0** |
| `type="module"` | **0** |
| `node --check` blocco 1 | **SYNTAX OK** |
| `node --check` blocco 2 (main) | **SYNTAX OK** |
| `git diff --check` | **OK** |

---

## Browser QA

**NOT EXECUTED** — checklist manuale:

1. Poligono in lista → Elimina → conferma → sparisce da lista e mappa → reload assente.
2. Nuovo poligono → draw/save OK.
3. Rinomina → nome in lista → reload persistito → export con nuovo nome.
4. Toggle visibilità → overlay on/off → reload se supportato da `state.gisPolygons`.
5. Export GeoJSON/KML dopo edit → poligono eliminato assente.
6. Regressione: waypoint pick, track, pan/zoom, panel drag/resize, RR/Astro/Measure, no console errors.

---

## Known risks / deferred

- Import GeoJSON/KML, vertex drag, edit geometria: fuori scope.
- Righe azioni compatte su viewport stretti (test mobile).
- Undo stack GIS non esposto in UI per delete/rename (recordUndo: false).

---

## Next recommended step

Eseguire **browser QA** sopra; se PASS, registrare inbox browser-pass e pianificare eventuale batch polish GIS o nuovo Tier 1.
