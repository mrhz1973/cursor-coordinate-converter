# 2026-05-27 — Offline maps UX: download vs JPG export

## Intervento

Raffinamento pannello **Mappe Offline** (`#offlineTilePanel`): separazione download/cache ed export JPG, pulsante **Scarica** per area, layer condiviso, uso cache IndexedDB in export, nome file personalizzato, messaggi zoom/tile non disponibili.

## Commit principale (monolite + README)

- **Hash:** `4a98a33` — `feat: improve offline map download and JPG export`
- **Push:** origin/main riuscito
- **File:** `coordinate_converter Claude.html`, `README.md`
- **Monolite incluso** nel commit principale (non autosync separato)

## Deploy Firebase

- **Esito:** PASS
- **Script:** `scripts/deploy-hosting.ps1 -DeployFirebase` (clone `C:\Users\Utente\Documents\AI\GitHub\cursor-coordinate-converter`)
- **URL:** https://gistoolmarty-33cf8.web.app
- **VPS staging:** non aggiornato (fuori scope)

## UI / funzioni

### Separazione download / export JPG

- Due sezioni in `#pcBboxFieldsWrap`:
  - `offcache.sectionDownload` — z min/max, stima, precache area/named
  - `offcache.sectionExportJpg` — singolo zoom `#pcExportZ`, nome file `#pcExportJpgName`, `#btnOfflineExportJpg`
- Layer `#pcLayer` sopra le sezioni con nota `offcache.layerSharedNote`

### Pulsante Scarica (lista aree)

- Colonna azioni: `data-offline-download` → `precacheOfflineNamedAreaById(id)`
- Usa bbox/layer/zoom dell’area salvata (`namedAreaToPrecacheParams`)
- Stato: disabilitato se `status === 'complete'` o precache busy; tooltip `offcache.area.alreadyDownloaded`

### Layer

- `#pcLayer` influenza download globale e `exportOfflineAreaAsJpg()` (`getCurrentOfflineLayerId()`)
- Per-riga Scarica usa `layerId` dell’area

### Export JPG offline + cache

- `loadTileImageForOfflineExport`: IndexedDB (`getTileBlobByKey`) prima, poi fetch se online
- Messaggio successo con `export.offlineJpg.sources` (cache/rete/offline)
- Limiti invariati: **576 tile**, **8192 px/lato**, **32 MP**

### Nome file

- `#pcExportJpgName` → `buildOfflineJpgExportDownloadName(z)` con `sanitizeExportBaseName`
- Vuoto → default `offline-map-z{z}-YYYYMMDD-HHMMSS.jpg`

### Zoom / tile non disponibili

- `offlineLayerMaxZoom`, `validateExportZoomForLayer`, `#pcExportZoomWarn`
- Chiavi: `export.offlineJpg.zoomTooHigh`, `tilesUnavailable`, `offlineMissing`
- 404 tile → messaggio prudente tilesUnavailable dove applicabile

### Invariati

- `exportMapAsJpg()` / `#btnExportJpg` viewport
- GeoJSON/GPX/KML/CSV non toccati
- **Nessun GeoTIFF**, backend, API key

## QA

- `node --check` su 2 script inline estratti: **OK**
- `git diff --check`: pulito
- Browser QA automatico: **non eseguito** — utente aveva già PASS export JPG su Firebase; deploy ripetuto post-refinement

## Rischi / prossimo passo

- Dopo precache riga, lista potrebbe non aggiornare subito stato «già scaricata» finché non si ri-renderizza (refresh manuale pannello)
- **Prossimo:** test manuale su Firebase delle nuove sezioni + Scarica per area
