# OPSEC Step 3 — gate strict graduato (completato)

**Data:** 2026-06-13  
**Commit codice:** `feat(opsec): graduated strict gate for external tile/api fetches`  
**Perimetro:** solo monolite `coordinate_converter Claude.html`

## Step 3 completato

### Classificazione layer
- `TILE_LAYERS`: `osm`/`topo`/`sat` → `external: "internet"`; `nav` → `external: "tailnet-proxy"`.
- `SEAMARK_OVERLAY` → `external: "internet"`.

### Helper gate
- `tileLayerExternalKind(layerId)`
- `tileFetchAllowed(layerId)` — rispetta `forceOffline`, strict, consenso nav, bypass operazioni precache/export confermate.
- `internetApiFetchAllowed()` — Esri identify + Open-Meteo elevation.
- `ensureNavProxyConsent()` — dialogo warn+confirm per-sessione.

### Stato transiente (non persistito)
- `state._navProxyConsentGranted` — consenso Navionics per sessione; reset al toggle strict; mai in `saveStore`/export/import.
- `_precacheStrictOpConfirmed` / `_exportJpgStrictOpConfirmed` — flag modulo per operazione offline/export.

### Punti gate
| Punto | Comportamento strict |
|---|---|
| `hydrateMapTiles` | cache hit ok; internet bloccati; nav richiede consenso |
| `fetchAndStoreTile` / `startPrecacheDownload` | conferma `activateWarn` una volta per operazione; nav + consenso se layer nav |
| `loadTileImageForOfflineExport` / `exportOfflineAreaAsJpg` | stesso gate; conferma export JPG |
| seamarks `renderTileMap` | blocco secco `&& !state.opsecStrict` |
| Esri identify / Open-Meteo | `internetApiFetchAllowed()`; cache hit invariato |
| geocoding | già gated da `geocodingAllowed()` |

### Toggle strict
- `activateWarn` + reset consenso nav; badge `seamarksBlocked` se seamarks ON.
- Hook `state._onOpsecChange` → re-render mappa senza reload.

### i18n aggiunte
- `opsec.strict.tilesBlocked`, `navProxyWarn`, `navProxyConfirm`, `seamarksBlocked`, `activateWarn` (IT/EN/FR).

### Step 1/2 invariati
- `recordNetEvent`, store `_netEvents`, punti registrazione Step 1 non modificati.
- Tooltip Step 2 invariato.

### Non implementato
- Gate `/sonar/` (non integrato nel monolite).
- Riga Cache net status (Step 2).

## Validazione
- `node --check` 2× script inline → **NODE_CHECK=OK**.

## Decisione utente (contesto Step 4+)
Opzione 3 strict graduato ratificata e ora implementata per tile/API; Step 4 = QA/i18n rifinitura.

## Righe patch
- Monolite: ~+130 righe net (sopra soglia 50/120 per gate obbligatori multi-punto + i18n 15 chiavi).
