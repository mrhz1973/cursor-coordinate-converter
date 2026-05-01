# Riepilogo Pass 2 — persistenza, IndexedDB, cap array

**Data:** 2026-04-30  
**Scope:** audit documentale solo lettura sul monolite; **nessuna** modifica a `coordinate_converter Claude.html`.

## Cosa è stato fatto

- Audit meccanico (grep/rg) su chiavi `localStorage`, IndexedDB, funzioni save/load/sanitize/reset, costanti `cap` / `MAX_` / `slice`, array `state` rilevanti.
- Aggiunta in **`docs/PROJECT_notes.md`** della sezione **«Persistenza, IndexedDB e cap array»** (tabelle A/B/C + incertezze).
- Aggiornamento **`docs/orchestrator/latest.md`** (sintesi Pass 2 + prossimo passo).
- Correzione minima **`/.cursor/rules/10-html-architecture.mdc`**: allineamento testuale su rimozione legacy `coordconv_v1` durante reset totale (prima: «not actively wiped» — impreciso vs `performAppFullLocalReset`).
- **`99-known-state.mdc`:** non modificato (già coerente su cap GIS / transient stacks).

## Comandi / ricerche principali

```bash
rg -n "localStorage|sessionStorage|indexedDB|STORAGE_KEY|UI_STORAGE_KEY|coordconv_v" "coordinate_converter Claude.html"
rg -n "CoordConvMapTiles|TILE_IDB|createObjectStore|idbClearAllTiles|idbPut|idbGet" "coordinate_converter Claude.html"
rg -n "saveStore|loadStore|sanitize|clearStore|performAppFullLocalReset|performOfflineGlobalReset" "coordinate_converter Claude.html"
rg -n "GIS_TRACK_CAP|GIS_POLYGON_CAP|GIS_LAYER_CAP|GIS_ACTION_STACK_CAP|RANGE_RING|SAVED_TRACKS_CAP|GEOCODE_CACHE_MAX|MAX_PRECACHE" "coordinate_converter Claude.html"
rg -n "deleteDatabase|sessionStorage" "coordinate_converter Claude.html"
```

Esito: **`sessionStorage`** e **`deleteDatabase`** senza occorrenze nel monolite.

## Chiavi di persistenza rilevate

| Chiave / DB | Note brevi |
|-------------|------------|
| `coordconv_v2` | Payload `saveStore()` |
| `coordconv_ui_v1` | Layout pannelli (`captureUiState`) |
| `coordconv_v1` | Legacy, non letto; rimosso solo da `performAppFullLocalReset` |
| IndexedDB `CoordConvMapTiles` v1, store `tiles` | Tile + chiavi `geo:rev:*` + `geo:dataset:cities` |
| RAM `geocodeCache.*` | Forward/reverse in-sessione; max map size 200 |

## Array / cap rilevati (estratto)

- `mapWaypoints`: 200; `savedTracks`: 50, punti 500; `gisTracks`/`gisPolygons`: 50; `gisLayers`: 20; `featureIds` per layer fino a 500 in sanitize.
- `rangeRingSets`: 20 set; 15 raggi/set; raggio max 5e6 m.
- `namedAreas`: 30; `track.points` / saved track points: 500.
- `history`: 10; `favorites`: 200 su path UI add; `undo`/`redo`: 100 elementi (transient, non in `saveStore`).
- **Non rilevato con certezza:** cap numerico esplicito per righe `lastBatchRows`.

## Funzioni reset / sanitize citate in doc

- `saveStore`, `loadStore`, `clearStore`, `init()` branch persistito, `sanitizeNamedAreas`, `gisSanitizeFeatureArray`, `gisSanitizeLayerArray`, `sanitizeRangeRingSets`, `ensureGisState`, `ensureRangeRingState`, `ensureSavedTracksState`, `performAppFullLocalReset`, `performOfflineGlobalReset`, `resetGisUiLayoutPanels`, `idbClearAllTiles` / `idbClearAllTilesOrThrow`.

## Rules modificate

- **Sì:** `.cursor/rules/10-html-architecture.mdc` (una riga, chiarezza `coordconv_v1` + reset totale).
- **No:** `.cursor/rules/99-known-state.mdc`.

## File modificati (commit Pass 2)

- `docs/PROJECT_notes.md`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1815_riepilogo_pass2-persistenza-cap.md`
- `.cursor/rules/10-html-architecture.mdc`

## File non toccati (estratti)

- `coordinate_converter Claude.html`
- `docs/roadmap.md`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`
- `.cursor/rules/00-project-core.mdc`, `.cursor/rules/20-domain-knowledge.mdc`

## Limiti / incertezze

- Cap batch (`lastBatchRows`): **non rilevato con certezza**.
- Preferiti: slice 200 su add; `saveStore` non tronca il vettore — edge case da tenere presente.

## Prossimo passo consigliato

**Pass 3** — feature rimosse/storiche + OPSEC strict + decisione roadmap §4.8 (sessione separata; nessuna decisione §4.8 in questo passaggio).
