# Riepilogo intervento — Abort fetch su supersede `renderTileMap` / `hydrateMapTiles`

**Data:** 2026-04-30  
**Sessione debug:** `bf0d51` (log `.cursor/debug-bf0d51.log`)

## Evidenza runtime (pre-fix nel log)

- `hydrateMapTiles:stale` con `tileGen:13`, `mapTileGen:16`, **`durationMs:14310`** — hydrate obsoleto ancora in corso mentre la generazione mappa è avanzata; coerente con **fetch di tile online** che restano pending fino a completamento anche se il DOM è stato sostituito da un render successivo.

## Fix (monolite, non in commit autosync)

**File:** `coordinate_converter Claude.html`

1. In `renderTileMap`, prima del bump `_mapTileGen`:
   - se `AbortController` disponibile: `abort()` sul controller precedente su `root._miniMapTileHydrateAC`, poi `new AbortController()` e memorizzazione su `root`.
   - segnale `signal` passato a `hydrateMapTiles` come ottavo argomento.

2. In `hydrateMapTiles(mapRoot, …, tileGen, fetchSig)`:
   - `fetch(url, { mode: "cors", signal: fetchSig })` quando `fetchSig` è definito.

Effetto: un nuovo `renderTileMap` interrompe i fetch della passata hydrate precedente; `Promise.all(load1)` sul gen obsoleto si chiude in tempi brevi (abort) invece di attendere secondi di rete inutili.

## QA atteso post-fix

- Hard refresh del monolite.
- Stress zoom/pan rapido come nel run che ha prodotto il log.
- Nei log: eventuali `hydrateMapTiles:stale` con **`durationMs` molto inferiore** a ~14s quando il supersede avviene durante fetch online.

## Strumentazione

Restano attivi i log `__dbgLog` / ingest `bf0d51` (map-blank, RR, ecc.) fino a conferma utente e rimozione esplicita.

## Git / autosync

- Commit/push: **solo** `docs/orchestrator/**` (questo file + `latest.md`).
- **`coordinate_converter Claude.html` escluso** dalla policy autosync (modificato in locale).
