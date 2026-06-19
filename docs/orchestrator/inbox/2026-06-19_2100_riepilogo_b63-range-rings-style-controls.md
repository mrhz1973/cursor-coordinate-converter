# B6.3 — Range Rings style controls (runtime)

**Data:** 2026-06-19  
**Tipo:** patch controllata su feature esistente  
**Commit runtime:** `d69cacd` — `feat(gis): add Range Rings style controls (B6.3)`

## Obiettivo

Controlli stile pre-creazione: colore cerchi, spessore, tipo linea (solid/dashLarge/dashSmall/dotted), colore label distanza. Flusso B6.2 invariato.

## Modifiche

1. **UI** — sezione «Stile anelli» dopo preset: `#rrRingColor`, `#rrLabelColor`, `#rrRingWidth`, `#rrRingLineStyle`.
2. **Stato** — `state.rangeRingsStyle` (draft); set persistiti con `lineStyle` + `labelColor` opzionale via `sanitizeRangeRingSet`.
3. **Rendering SVG** — `stroke-dasharray` su polyline cerchi; `fill` inline su label distanza se `labelColor` presente.
4. **Create/edit/reset** — `rrCreateFromUi`, `rrSaveEditedRangeRingSetFromUi`, `rrLoadSetIntoForm`, `rrResetRangeRingsFormToNew`.
5. **Binding** — `rrWireRangeRingsStyleControls()` in `bindRangeRingsUI`; no live preview su anelli esistenti.
6. **i18n** — 9 chiavi IT/EN/FR + hint `rangeRings.hint` aggiornato (Punta e crea, no Crea anelli).

## Default

- ringColor `#16a34a`, ringWidth `2`, lineStyle `solid`, labelColor `#1e293b`.
- Set legacy senza `labelColor` → CSS `.rr-distance-label` invariato.

## Non toccato

Parser, geodesia, radial guides, OPSEC/proxy/tile/export JPG/buildScaleBar/mapWaypoints, minimizzazione B6.2, preset unit-aware.

## QA tecnico

- Guard: `main`, tree pulito, base `73044a3`, push `d69cacd`.
- `node --check`: OK (2 blocchi).
- `#rrCreateBtn`: assente.
- **Browser QA operatore:** non attestata.

## Checklist QA manuale

1. Cache-buster `d69cacd`
2. Controlli stile visibili; default distanze/NM
3. Punta e crea → minimize → click mappa
4. Test colori, spessori 1/2/4, 4 tipi linea, label color
5. Preset unit-aware; edit set; nessuna rete implicita

## Prossimo passo

Browser QA B6.3; backlog B6.4 radial/bearing styling.
