# TRACK-ELEVATION-PROFILE-A — UI/renderer (locale)

Data: 2026-07-30 · Ambito: pezzi UI rimanenti su fondazione già presente nel working tree.

## Sintesi

Implementati i pezzi UI/renderer di **TRACK-ELEVATION-PROFILE-A** senza toccare parser/export, senza rete, senza `ele` sui punti canonici. Routing resta su adapter sottile di `routingDrawAltitudeChart`.

## File modificati

- `coordinate_converter Claude.html` — **solo locale / non nel commit autosync** (policy default)

## Cosa fatto

### A) Renderer SVG comune
- Nuova `elevationProfileDrawChart(options)` (~L62721)
- `routingDrawAltitudeChart` riscritto come adapter sottile (~L63011) → scrive `r._altitudeChartLayout` + restore hover

### B) Saved-track runtime + UI
- `ensureSavedTrackElevationViewState` / `savedTrackClearElevationView` (~L36608)
- `savedTrackBuildRuntimeElevationProfile` (+ cache/interpolate lat/lon) (~L36713)
- `openSavedTrackElevationProfile` / `closeSavedTrackElevationProfile` / `renderSavedTrackElevationSection` (~L37054–L37188)
- CTA `data-saved-profile` in `renderSavedTracksList` + handler delegato
- `#trackSavedElevationClose` wired once
- Cleanup su `closeTrackModal`, delete track, `prepareUiBeforeAppFullReset`, lista vuota

### C) Hover chart↔mappa
- Dispatcher in `routingAltitudeOnMapHover` / `routingAttachAltitudeMapHoverOnce`
- Marker `.saved-track-elevation-sync-marker` (distinto da routing)
- Re-draw marker dopo `renderSavedTracksOverlays`

### D) CSS
- Blocco `.track-saved-elevation*` dopo `.routing-altitude-chart`

### E) i18n IT/EN/FR
- Chiavi `track.profile.*` (action, actionAria, title, close, unavailable, stale, partial, distance, ascent, descent, min/maxElevation, savedWithoutElevation)

## QA / verifiche

- `node --check` su JS inline estratto: **PASS**
- Nessun `<script src>` / `type="module"` aggiunto
- Test browser: **non eseguito** in questo subagent

## Monolite

- Incluso nel commit autosync: **no** (policy default)
- Working tree: `M coordinate_converter Claude.html` (fondazione + UI)
- Build display già su **B6.1TP-A · build 79** (fondazione precedente nello stesso WT)

## Non toccato

- Parser/export GPX/KML/GeoJSON
- Persistenza addon elevationProfile (già in fondazione)
- `routingPerformSaveAsTrack` (fondazione)
- Rete / fetch

## Prossimo passo

1. Review del diff monolite completo (fondazione + UI)
2. Commit/push runtime + deploy GIS-only
3. QA operatore minima su CTA Profilo + chart + hover mappa + regressione Routing altitude

## Limiti

- QA browser non attestata
- Workspace era già sporco all’inizio (fondazione parziale) — autorizzato dal prompt di completamento UI
