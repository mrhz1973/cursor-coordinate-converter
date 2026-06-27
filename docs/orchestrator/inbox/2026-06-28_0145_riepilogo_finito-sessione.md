# Riepilogo finito — MODAL-STD-B2 chiusura docs-only

**Data:** 2026-06-28  
**Tipo:** docs-only (`finito`) — monolite **non** modificato in questo intervento.

## Runtime (già su VPS)

### Catena MODAL-STD-B2 (build 11 → 13)

| Fase | Commit | Blob | Build | QA |
|------|--------|------|-------|-----|
| B2 | `06ed2a09d5e621112877f9389c8ed839d9ae1f65` | `431a9c88e6e5093cc2d0944b81750b71650eb238` | 11 | Parziale — Poligoni ESC PASS; Preferiti FAIL |
| FIX1 | `f53e2d8ff8881434ff49104fb79e42202ad28e27` | `4ac10423c893241b88fc3613c5f5033538644925` | 12 | Parziale — ×/ESC/riapertura PASS; scroll FAIL |
| FIX2 | `266b1161a6f8d6f95fbc012687d0b0b377538484` | `0f4d275ea86b5b78690421405ffa5909add5783e` | 13 | **PASS end-to-end** |

**Runtime autorevole live VPS:** `266b116`  
**Display:** `B5.5Z · build 13`  
**URL QA:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=266b116`

### Deploy FIX2 (PASS tecnico)

- HTTP **200**
- Byte repo/servito: **2427039** / **2427039**
- SHA-256: `c8b39050e456511ea64ea4eaf60df88784ede46b0f490cf77efd587f9a227dc3` (match)
- CMP_PASS: **yes**
- `goi-gis-app.service`: active / enabled

## Contenuto implementato

**Preferiti:** layout `defaultHeightFraction` 0.78; scroll intero `#favoritesPanelBody` (FIX2, schema Search B1); `:not([open])` + close/ESC (FIX1); header/×/− accessibili; nessun tocco dati/store/import-export.

**Poligoni ESC:** catena GIS con precedenza interna (vertex modal → delete bar → rename bar → inline rename → edit cancel → `closePolygonPanel()`); draw via `bindHotkeys`; non regressito in QA.

## QA finale verificata

Attestazione: «**QA MODAL-STD-B2-FIX2 PASS operatore**»

- Preferiti ridimensionato in basso: scrollbar body, contenuti raggiungibili
- ×/ESC/riapertura OK; Poligoni ESC OK
- Footer/about `B5.5Z · build 13`

## File docs aggiornati (commit task `finito`)

- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/QA-CHECKLIST.md`
- `docs/HANDOFF.md`

**Monolite:** invariato (`0f4d275e…` @ `266b116`).

## Stato finale

**MODAL-STD-B2 — CLOSED / PASS end-to-end** (dopo FIX2).

## Prossimo candidato operativo

**Da scegliere da roadmap/backlog** — micro-blocchi standardizzazione modal, resize laterale, HUD, dead code cleanup, multi-touch P2 (nessun obbligo fisso).
