# B6.3a — Range Rings label readability (runtime)

**Data:** 2026-06-19  
**Commit runtime:** `22f19f1`  
**Tipo:** micro-patch rendering/UX su B6.3

## Obiettivo

Migliorare leggibilità label distanza: badge/sfondo SVG + posizionamento a 45° (offset da guide radiali 0°/90°/270°).

## Modifiche

1. **Rendering** — `rrAppendDistanceLabelSvg`: gruppo `g` con `rect` semi-opaco + `text`; bearing dedicato `RR_LABEL_BEARING_DEG = 45`.
2. **UI** — `#rrLabelBgEnabled` (default on), `#rrLabelBgColor` (default `#ffffff`).
3. **Stato** — `labelBgEnabled` / `labelBgColor` su set e `state.rangeRingsStyle`; legacy senza `labelBgEnabled` → no badge (CSS label invariato).
4. **Funzioni** — `sanitizeRangeRingSet`, `rrReadStyleFromForm`, `rrApplyStyleToForm`, create/edit/reset/load, binding.

## Non toccato

Linee radiali (solo angolo label), parser/geodesia, B6.2 pick/minimize, OPSEC/export/mapWaypoints.

## QA

- `node --check`: OK
- Browser QA operatore: pending

## Retrocompat

Set pre-B6.3a senza `labelBgEnabled`: nessuno sfondo finché non ricreati/editati con checkbox attivo.
