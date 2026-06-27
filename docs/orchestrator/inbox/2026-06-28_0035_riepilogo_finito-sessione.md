# Riepilogo finito — MODAL-STD-SEARCH-B1 chiusura docs-only

**Data:** 2026-06-28  
**Tipo:** docs-only (`finito`) — monolite **non** modificato in questo intervento.

## Runtime (già su VPS)

### MODAL-STD-SEARCH-B1 build 10

- **Commit:** `33c95ad7cecbb7fa75e82f0e8ba9015ed9457193`
- **Blob:** `d048ee2ff92bf956b31a74aa8ecde21ae49a4540`
- **Subject:** `fix(ui): improve search panel viewport layout`
- **Obiettivo:** standardizzazione `#searchPanel` — altezza utile (`defaultHeightFraction` 0.78), scroll body, clamp parziale, summary geocode nascosto
- **`APP_BUILD_NUM`:** 10 — display **`B5.5Z · build 10`**
- **Review:** **NON RICHIESTA** (micro-blocco layout Ramo B)
- **Deploy GIS-only:** PASS tecnico — byte **2424747**, SHA **`fd6203f61e7f1b7fe14936664e20d280d0e32276988c769fe582178dd593b731`**, CMP_PASS, HTTP **200**, `goi-gis-app.service` active/enabled
- **QA operatore:** **PASS** — «**QA MODAL-STD-SEARCH-B1 PASS operatore**»

**Runtime autorevole live VPS:** `33c95ad`  
**URL QA:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=33c95ad`

## QA verificata

- Tab Cerca: pannello più alto (~75–80% viewport)
- Ricerca risultati multipli: scroll interno body; header/× fissi
- Resize angoli OK; input e risultati usabili
- Drag header OK; mappa interattiva
- ESC e × chiudono Cerca
- Nessun summary/titolo duplicato sotto Cerca
- Footer/about **`B5.5Z · build 10`**
- Nessuna regressione Help/QR, Converti, Poligoni

## File docs aggiornati (commit task `finito`)

- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/QA-CHECKLIST.md`
- `docs/HANDOFF.md`

**Monolite:** invariato (`d048ee2f…` @ `33c95ad`).

## Prossimo candidato operativo

1. **MODAL-STD-FAVORITES-B1** — standardizzazione layout/altezza/scroll pannello Preferiti (rischio basso-medio)
2. **MODAL-STD-POLYGON-ESC-B1** — ESC chiude `#polygonPanel` nella catena GIS (rischio medio)
3. Altri backlog: resize laterale pannelli, Personalizzazione HUD, dead code cleanup, micro-fix multi-touch P2
