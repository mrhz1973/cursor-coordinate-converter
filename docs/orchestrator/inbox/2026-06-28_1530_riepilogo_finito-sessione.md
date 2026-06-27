# Riepilogo finito — BUNDLE-BACKLOG-B3 chiusura docs-only

**Data:** 2026-06-28  
**Tipo:** docs-only (`finito`) — monolite **non** modificato in questo intervento.

## Runtime (già su VPS)

| Campo | Valore |
|-------|--------|
| Commit runtime | `709079c989cc34b695e9cff3abf239ced77670dd` |
| Subject | `chore(ui): apply safe backlog micro-fixes` |
| Blob monolite | `da27be4363e878f97f1f1b8d4dbc9df34f9c7ed3` |
| SHA-256 file | `ca0d74a61395d02fc3a3281a29851721c4425e24e5073b68fe5d3d3ba95a0902` |
| Byte | **2426501** |
| Build | `APP_BUILD_NUM = 14` / display **`B5.5Z · build 14`** |

**Runtime autorevole live VPS:** `709079c`  
**URL QA:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=709079c`

### Deploy (PASS tecnico)

- HTTP **200**
- Byte repo/servito: **2426501** / **2426501**
- SHA-256 match
- CMP_PASS: **yes**
- `goi-gis-app.service`: active / enabled

## Patch implementate (runtime)

1. **Dead code:** rimossa `polygonShowRenameBar()` (0 call site; sostituita da rename inline).
2. **Multi-touch P2:** guardia su vertex `pointerdown` in `renderPolygonEditOverlay` — `if (mapPolyEditDocDrag || mapPolyMoveDocDrag) return;` (secondo dito non sostituisce drag attivo).

## Audit registrato / non implementato

1. `polygonHideRenameBar()` / `#polygonPanelRenameBar` — ancora wired (ESC/edit cancel); non rimossi.
2. CSS legacy `.modal-overlay` / `.modal` — nessun HTML diretto; candidato blocco CSS-only Ramo A.
3. `renderAllMaps()` — 8 call site, funzione undefined; blocco dedicato con sostituto/contratto.
4. Resize laterale pannelli — solo angoli nw/ne/sw/se; handle e/w/n/s assenti; blocco dedicato pilota.
5. HUD-VIS / HUD-LAYOUT — nessun setting pronto; design dedicato prima del runtime.

**Review Claude:** **NON RICHIESTA**

## QA finale verificata

Attestazione: «**QA BUNDLE-BACKLOG-B3 PASS operatore**»

- Poligoni → Modifica → drag vertice: comportamento invariato
- Touch/P2: secondo dito su altro handle non sostituisce il drag
- Rename inline Nome poligono OK
- Lista Poligoni non regressa
- Footer/about `B5.5Z · build 14`

## File docs aggiornati (commit task `finito`)

- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/QA-CHECKLIST.md`
- `docs/HANDOFF.md`

**Monolite:** invariato (`da27be43…` @ `709079c`).

## Stato finale

**BUNDLE-BACKLOG-B3 — CLOSED / PASS end-to-end**

## Prossimi candidati (non obbligatori)

- Resize laterale pannelli — blocco dedicato, pannello pilota
- HUD-VIS / HUD-LAYOUT — design + contratto, poi runtime
- Dead code CSS `.modal-overlay` — audit+rimozione Ramo A
- `renderAllMaps` undefined — audit dedicato e piano sostituto
