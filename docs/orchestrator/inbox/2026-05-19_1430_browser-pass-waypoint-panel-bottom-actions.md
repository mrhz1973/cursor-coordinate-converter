# Browser QA PASS — Waypoint panel bottom actions reachable

**Data:** 2026-05-19 ~14:30
**Tipo:** browser QA record
**Commit testato:** `ede1ec4` — fix: make waypoint panel bottom actions reachable

---

## Risultato

**PASS GIS** — utente ha confermato: "PERFETTO FUNZIONA"

| Check | Risultato |
|---|---|
| Waypoint panel bottom reachable | PASS |
| Final actions visible/reachable | PASS |
| Delete-all button (`#wpDeleteAllBtn`) reachable | PASS |

---

## Fix verificato

- CSS: `overflow:visible; max-height:none` su `.waypoint-modal-panel` in GIS mode → unico scroll container.
- JS: `gisPanelSyncBodySize` usa `bodyBr.top − rootBr.top` → contabilizza `#waypointModalUnsavedCloseBar` e qualsiasi altro elemento sopra il body.
- JS: show/hide barra avvisi ricalcolano il body in rAF.
