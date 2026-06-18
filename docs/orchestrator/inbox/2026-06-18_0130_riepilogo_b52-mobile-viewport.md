# WU-0009B B5.2 — mobile viewport containment iPhone

**Data:** 2026-06-18  
**Tipo:** runtime GIS monolite (CSS/HTML) + docs + autosync

## Cosa è stato fatto

1. **Meta viewport:** `width=device-width, initial-scale=1, viewport-fit=cover`
2. **CSS B5.2 mobile-only** (`@media max-width:768px`, `480px`, landscape):
   - Header GIS flex-wrap; topbar full-width row
   - Toolbar mappa `.tile-ctrls`: pulsanti compatti, `max-height` + scroll verticale, safe-area
   - `.gis-map-mount` height con `--gis-mobile-header-est`
   - Modal/dialog `.app-modal`, floating panels, tab-drawer, help `.modal-overlay`
   - **OPSEC dialog** `#opsecStrictConfirmDialog`: flex column, body scroll, azioni sticky Conferma/Annulla min-height 44px

## Non modificato

- JS OPSEC (`showOpsecStrictConfirmDialog`, `tileFetchAllowed`, `ensureProxyConsent`)
- Route proxy, waypoint/tracce/GPS, gate OPSEC
- Regole CSS base desktop fuori `@media` (solo meta + blocco additive)

## Commit

| SHA | Messaggio |
| --- | --- |
| `32418de` | feat(gis): contain mobile viewport for iPhone layout (B5.2) |
| `8856f31` | docs: OM §7 — B5.2 mobile viewport PASS tecnico |
| *(autosync)* | docs: orchestratore + LAST_CURSOR_REPORT — B5.2 mobile viewport |

## Controlli

- `node --check`: OK
- `tileFetchAllowed` / `showOpsecStrictConfirmDialog`: invariati
- Nuove regole layout solo in `@media` mobile

## QA

- **PASS operatore:** non attestato
- **Checklist iPhone post-deploy:** vedi prompt B5.2 (portrait/landscape, Layers, Help, Offline, dialog bsat Annulla fail-closed, desktop non-regressione)

## Monolite

- Runtime commit **include** monolite
- Autosync **esclude** monolite

## Prossimo

- Browser QA mobile operatore su iPhone 12 Pro Max via Tailscale
- B5.x hint Layers statico; B6 QA formale
