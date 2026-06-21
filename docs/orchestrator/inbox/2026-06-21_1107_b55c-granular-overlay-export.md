# B5.5C — export JPG selezione granulare overlay + label waypoint

**Data:** 2026-06-21  
**Baseline:** `1a377a477d207accb6434b3ca62414b67df63b2d`  
**Commit runtime:** `5a10a484a5a8ef1f28fa9bc07d2f7bb711ca4572`  
**Build:** `B5.5C`

## Implementazione

- Dialog `#jpgExportDialog`: master «Includi overlay mappa» + 5 opzioni subordinate (tracce, waypoint, etichette waypoint, poligoni/aree, Range Rings).
- Default tutte ON → parità comportamento B5.5B-1.
- Master OFF: esclude tutti gli overlay; sub-opzioni disabilitate visivamente; selezioni transienti conservate.
- Waypoint OFF prevale su label; label OFF rimuove solo `.wpt-map-label` dal clone export (marker `wpt-map-marker` visibili).
- `exportMapAsJpg({ includeScale, includeOverlays, overlays, scale })` con `jpgExportNormalizeOverlayGranular`.
- `rasterizeSvgOntoCanvas` esteso con `cloneMutator` opzionale.
- Qualità fissa 3× (`JPG_EXPORT_REQUESTED_SCALE`); cap 8192 invariato.
- i18n IT/EN/FR: `export.jpg.overlay*`.
- Nessuna persistenza localStorage/IndexedDB.

## Controlli

- `git diff --check`: OK
- `node --check`: OK (2 script inline)
- `<script src>` / `type="module"`: 0
- Scope task: solo monolite

## Fuori scope

- Deploy VPS, smoke HTTP, QA operatore visiva (blocco successivo)
- B5.5D tab coordinate, B5.5Z zoom reale
- Planet-Clone, proxy, tile fetch, OPSEC gates

## QA operatore

**Pending** — URL previsto: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=5a10a48`

## Prossimo passo

Deploy VPS GIS-only B5.5C + QA operatore; poi candidato **B5.5D**.
