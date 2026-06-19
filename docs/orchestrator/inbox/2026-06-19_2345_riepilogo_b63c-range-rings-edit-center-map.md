# Riepilogo — B6.3c Range Rings center map on edit

**Data:** 2026-06-19  
**Runtime commit:** `20d2141`  
**Monolite:** incluso nel commit runtime (non in autosync docs)

## Obiettivo

Centratura automatica mappa quando l’utente clicca **Modifica** su un set Range Rings nella lista.

## Modifiche

### `rrFocusRangeRingSetOnMap(set)` (nuovo)

- Valida centro del set.
- Se `distancesM` ha raggio max > 0: bounding box cardinale via `vincentyDirect` (0°/90°/180°/270°) + euristica zoom identica a `flyMapToTrackPoints` / `flyMiniMapToOfflineNamedAreaById` + `clampBasemapFitZoom`.
- Fallback: `gisMapCenterOnLatLon` sul centro (o `renderTileMap` diretto).
- **Solo UX:** non muta il set, non crea duplicati, nessuna rete.

### `rrBeginEditRangeRingSet`

- Dopo `rrLoadSetIntoForm` + `rrSyncLabelBgColorControlState`, chiama `rrFocusRangeRingSetOnMap(s)`.

## Invariati

- Edit style parity B6.3b (load/save form).
- `#rrCreateBtn` assente; **Punta e crea** / minimize / preset unit-aware.
- Parser, geodesia (`buildGeodesicCircleRing`), overlay SVG, OPSEC, tile, export JPG, `state.mapWaypoints[]`.

## Fuori scope

- Drag/spostamento centro (B6.5).
- Radial/bearing configurabili (B6.4).

## QA

- **`node --check`:** OK (2 blocchi script inline).
- **Browser QA operatore:** non attestata.

## Checklist QA manuale

1. Creare set con Punta e crea.
2. Spostare mappa lontano dal ring.
3. Clic **Modifica** → mappa centrata/fit sull’anello esterno.
4. Verificare form carica stili B6.3b; salvare modifica → stesso id, no duplicato.
5. Punta e crea, minimize, preset invariati; nessuna nuova rete.

## Git (post-runtime, pre-autosync)

```
git diff --stat 20d2141^..20d2141
 coordinate_converter Claude.html | 56 ++++++++++++++++++++++++++++++++++++++++
 1 file changed, 56 insertions(+)
```

## Prossimo passo

Browser QA B6.3c; candidato B6.5 drag centro.
