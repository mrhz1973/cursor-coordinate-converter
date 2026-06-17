# Riepilogo — WU-0009B B4.2 frontend GIS Bing Satellite `bsat`

**Data:** 2026-06-17  
**Commit principale runtime:** `8d4deab`  
**Commit docs:** *(segue nel commit docs adiacente)*

## Cosa è stato fatto

Integrato layer **Bing Satellite** (`bsat`) nel monolite GIS, speculare a `gsat`:

- `TILE_LAYERS.bsat` — tailnet-proxy, `/bsat/{z}/{x}/{y}.jpg`, attrib Microsoft Bing, maxZoom 20, offline-eligible
- `MAP_BASE_LAYER_IDS` + `OFFLINE_LAYER_IDS` auto-derivato
- Gate OPSEC: `tileLayerProxyProvider` → `bing`, `tileFetchAllowed`, `offlineTileNetworkKind`, reset `_bingConsentGranted` su toggle strict
- Consenso: `_bsatConsentPending`, `ensureBsatConsent()`, dispatch `ensureProxyConsent` — isolato da Google/Navionics
- UI Layers sezione Satellitare + i18n IT/EN/FR (`map.layerBsat`, `tip.layerBsat`, `offcache.area.layerBsat`, `opsec.strict.bsatConfirm/Warn`)
- `offlineNamedAreaLayerLabel` ramo `bsat`

## File modificati

- `coordinate_converter Claude.html` (runtime)
- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md` §B4

## Controlli

- `node --check` su JS inline estratto: **OK**
- 25 controlli statici mirati: **25/25 PASS**
- Browser QA: **non eseguita** (pending B4.4)

## Nota cache OPSEC strict

Sotto OPSEC strict senza consenso, `hydrateMapTiles` è **cache-first**: tile già in IndexedDB vengono servite da blob locale **senza fetch proxy**; solo miss cache tenta consenso/rete. Non confondere con fetch proxy.

## Esclusi

- Planet-Clone, VPS, systemd, deploy
- `LAST_CURSOR_REPORT` aggiornato nel commit autosync/report separato

## Prossimo passo

**B4.4** — Browser QA OPSEC strict (checklist: strict OFF/ON, consenso isolato, Annulla fail-closed, forced-offline, non-regressione gsat/nav/sonar).
