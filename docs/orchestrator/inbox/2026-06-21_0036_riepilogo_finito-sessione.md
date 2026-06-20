# Riepilogo finito sessione — B5.5B JPG export map overlays

**Data:** 2026-06-21  
**Trigger:** `finito`  
**Commit principale:** `e6b28db` — `feat(export): B5.5B JPG export map overlays dialog and SVG capture`

## Cosa è stato fatto

- Runtime **B5.5B**: checkbox «Includi overlay mappa» nel dialog JPG export; flag transiente `_jpgExportIncludeOverlays = true` (default ON).
- `exportMapAsJpg({ includeScale, includeOverlays })` con cattura WYSIWYG dei 4 overlay SVG live via `rasterizeSvgOntoCanvas`.
- Ordine canvas: tile → griglia → overlay (range rings, tracce, poligoni, waypoint) → marker → scala opzionale.
- i18n IT/EN/FR: `export.jpg.includeOverlays`.
- OM §7 + WU: registrato PASS tecnico statico B5.5B.

## File modificati (commit principale)

- `coordinate_converter Claude.html` (+37/−4 righe monolite; build **B5.5B**)
- `docs/OPERATING_MEMORY.md`
- `docs/work-units/WU-0005-0009-roadmap.md`

## Monolite

- **Incluso** in `e6b28db`. Size locale: **2200362** byte.

## Static checks

- `git diff --check`: OK
- `node --check`: OK (2× script inline)
- `<script src>` / `type="module"`: 0

## Fuori scope (confermato)

- B5.5C granular overlay / B5.5D tab coordinate / B5.5E risoluzione / B5.5Z zoom reale
- Nessun fetch; OPSEC/offline/cache/proxy/Planet-Clone non toccati
- `drawJpgExportScale` invariata; `.tile-readout`/cursore esclusi

## QA operatore

- **Pending** — deploy VPS GIS-only + `?v=e6b28db`
- Checklist: overlay ON/OFF, cursore assente, scala OK, regressione B6.6C

## Push step 2

- **OK** — `69ec3cb..e6b28db main -> main`

## git status --short (post step 2)

```
(clean)
```

## Prossimo passo

- Deploy VPS GIS-only B5.5B + QA operatore
- Poi **B5.5C** (selezione granulare overlay) o **B5.4f** plan
