# 2026-05-27 — Offline area JPG export (bbox + single zoom)

## Cosa è stato fatto

Aggiunta export **JPEG statico** dell’**area offline selezionata** a **un solo livello di zoom**, distinta dall’export JPG della **viewport** (`exportMapAsJpg()` in header).

### UI (pannello `#offlineTilePanel`, dentro `#pcBboxFieldsWrap`)

- `#pcExportZ` — input numerico «Zoom export JPG» (default 8; si sincronizza con `#pcZ0` finché l’utente non modifica manualmente).
- Testo guida `#pcExportJpgHint` (`offcache.exportJpgHint`).
- `#btnOfflineExportJpg` — «Esporta JPG offline» (`offcache.exportJpg`).

### Logica

- `getOfflineExportBbox()` — usa `state.bboxSelection` se valida, altrimenti `readBboxFields()`.
- `readOfflineExportZoom(layer)` — legge `#pcExportZ`, fallback media/estremi di z min–max.
- `computeOfflineJpgGrid()` + `collectBboxTiles(n,s,e,w,z,z)` — griglia tile Web Mercator 256 px.
- `validateOfflineJpgExportSize()` — limiti:
  - `OFFLINE_JPG_EXPORT_MAX_TILES = 576`
  - `OFFLINE_JPG_EXPORT_MAX_CANVAS_PX = 8192` (per lato)
  - `OFFLINE_JPG_EXPORT_MAX_PIXELS = 32 * 1024 * 1024`
- `loadTileImageForOfflineExport()` — IndexedDB (`getTileBlobByKey`) poi fetch CORS se online; blob URL → `<img>` (canvas non tainted).
- Tile mancanti → placeholder grigio con «?»; messaggio `export.offlineJpg.partial` se count > 0.
- `canvas.toBlob(..., "image/jpeg", 0.92)` → download `offline-map-z{z}-YYYYMMDD-HHMMSS.jpg`.
- Progresso su barra precache esistente (`#pcBar`, `#pcProgress`, `#pcStatus`); blocco se precache in corso.

### i18n

16 nuove chiavi IT/EN/FR: `offcache.exportZoom`, `offcache.exportJpgHint`, `offcache.exportJpg`, `tip.offlineExportJpg`, `export.offlineJpg.*`.

### README

Sezione export aggiornata: viewport JPG + offline area JPG; GeoTIFF/print layout non implementati.

## File modificati

- `coordinate_converter Claude.html` (+264)
- `README.md` (+3 righe nette)

## QA

- `node --check` su 2 script inline: **OK**
- `git diff --check`: **OK**
- Grep diff: nessun segreto/API key/backend; GeoTIFF solo in testo «non implementato»
- **Browser QA:** non eseguito automaticamente; testabile su https://gistoolmarty-33cf8.web.app

### Checklist browser

1. Tab **Layers** → pannello Mappe Offline.
2. Seleziona area (mappa o campi N/S/E/O).
3. Imposta **Zoom export JPG** (es. 10).
4. **Esporta JPG offline** → file `offline-map-z10-….jpg`.
5. Verifica che l’immagine copra l’area (non solo viewport).
6. Header **Export JPG** (🖼) ancora funzionante.

## Limiti / rischi

- **Non** mappa multi-zoom navigabile — un solo z per file.
- Aree grandi / z alto → messaggio `export.offlineJpg.tooLarge` (no crash browser).
- Tile non in cache e offline forzato → molti placeholder «?».
- CORS: fetch tile come precache; blob URL safe; `export.offlineJpg.tainted` se `toBlob` fallisce per SecurityError.

## Git / deploy

- Branch: `main`
- Commit feature: **`1259471`** `feat: add offline area JPG export` — push **riuscito**
- Monolite **incluso** nel commit feature (richiesta prompt)
- **Firebase:** PASS — `deploy-hosting.ps1 -DeployFirebase` da clone `Documents\AI\GitHub\cursor-coordinate-converter`
- **VPS staging:** non aggiornato (fuori scope)
- Working tree post-commit feature: pulito

## Prossimo passo

- QA browser su Firebase con area piccola (z 8–10) poi area media; opzionale DPI 2× in task futuro.
