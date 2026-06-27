# Riepilogo finito — UI-MODAL-PARITY-HELP-QR chiusura docs-only

**Data:** 2026-06-27  
**Tipo:** docs-only (`finito`) — monolite **non** modificato in questo intervento.

## Catena runtime (già su VPS)

### UI-MODAL-PARITY-HELP-QR build 5

- **Commit:** `dcea02f131c71c587d2c345059fb14cc8458e401`
- **Blob:** `cf23cc9ca4392fc489c8ccf4a7cda11b67f7f673`
- **Contenuto:** migrazione Help/QR da legacy `modal-overlay` a `<dialog class="app-modal">`
- **`APP_BUILD_NUM`:** 5
- **Deploy GIS-only:** PASS tecnico
- **QA operatore:** **FAIL** — Help GIS tagliata/non floating/senza `−`; QR da Converti non si apre

### UI-MODAL-PARITY-HELP-QR-FIX1 build 6

- **Commit:** `e8e8ff13030496ccf31e6b4bcb8fc57772a60cac`
- **Blob:** `6eee6872d47dd8a0ed4e04c34dd990e661ced153`
- **Subject:** `fix(ui): restore GIS help and QR dialog behavior`
- **Contenuto:** Help GIS floating (drag/resize/minimize/scroll body); QR ripristinato (`openContextAwareAppDialog`, bring-to-front); **`APP_BUILD_NUM`:** 6; display **`B5.5Z · build 6`**
- **Review:** **GPT sostitutiva PASS** (Claude indisponibile — **non** review byte Claude ordinaria)
- **Deploy GIS-only:** PASS tecnico — byte **2404202**, SHA **`3fe2ac2e39c2a92cc8b282eede1e937036440f7cc4acfb672003eb0290899775`**, CMP_PASS, HTTP **200**
- **QA operatore:** **PASS** — «**QA UI-MODAL-PARITY-HELP-QR-FIX1 PASS operatore**»

**Runtime autorevole live VPS:** `e8e8ff1`  
**URL QA:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=e8e8ff1`

## Esito

**UI-MODAL-PARITY-HELP-QR — CLOSED / PASS end-to-end**

## File docs aggiornati (commit task `finito`)

- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/QA-CHECKLIST.md`
- `docs/HANDOFF.md`

**Monolite:** invariato (`6eee6872…` @ `e8e8ff1`).

## Backlog non bloccante

1. **UI-MODAL-PARITY-HELP-QR-FIX2** — QR ridimensionabile
2. **CONVERT-SOURCE-PICKER** — waypoint/preferito/punto mappa nel Convertitore
3. **P-POLYGON-LIST-UX-NEXT-B-FIX2** — indicatore Vis. poligoni (pallino verde/grigio)

## Prossimo candidato operativo

**UI-MODAL-PARITY-HELP-QR-FIX2** (QR resizable) — oppure **CONVERT-SOURCE-PICKER** per priorità operatore.
