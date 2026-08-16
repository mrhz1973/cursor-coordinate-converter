# Riepilogo — GIS-PANEL-DOCK-MGR-AUDIT-A (candidato G)

**Data:** 2026-08-16  
**Blocco:** `GIS-PANEL-DOCK-MGR-AUDIT-A`  
**WU:** [`WU-0021-gis-panel-minimized-dock-manager.md`](../../work-units/WU-0021-gis-panel-minimized-dock-manager.md)

## Esito

| Voce | Valore |
|------|--------|
| Scope | AUDIT / DIAGNOSTIC / DOCS only |
| LIVE tip | `508dd039981b1878e427c9440033fcad854351b1` (invariato) |
| Build | **207** |
| Blob monolite | `09fe2b4ac405f874866b19898ee844fe52ea1d8f` |
| Helper | 0.1.3 |
| Deploy / ABQA / QA / finito | **no** |
| Gate | **REVIEW PENDING** |
| F | **NOT OPENED** |
| H / WU-0020 | CLOSED (non riaperto) |
| WU-0012 | invariata |

## Sintesi audit

- **Root cause finding:** `#gisMinimizedDock` a `z-index:22` sotto floating panels `24–29`; dock sotto header in area mappa, non nel chrome titolo.
- **13 pannelli** in whitelist minimize effettiva; **`gisWorkbenchPanel`** gap (UI/restore sì, whitelist no).
- **Raccomandazione:** OPTION A thin global coordinator; session-only; no new persistence; micro-blocchi G-A…G-D.
- Brand LIVE: **TMART GIS tool**.

## File

- WU-0021 (nuovo)
- FRONTIER, OM §7.2–7.3, roadmap G, latest, questo inbox, LAST_CURSOR_REPORT
- Monolite: **escluso**
