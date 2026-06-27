# Riepilogo finito — CONVERT-SOURCE-PICKER chiusura docs-only

**Data:** 2026-06-27  
**Tipo:** docs-only (`finito`) — monolite **non** modificato in questo intervento.

## Runtime (già su VPS)

### CONVERT-SOURCE-PICKER build 8

- **Commit:** `b294140c6464c28634c775018c4bd80853041491`
- **Blob:** `6feba1c9e0b192c1655ba052314e7d8cae87df98`
- **Subject:** `feat(convert): add waypoint favorite and map source picker`
- **Obiettivo:** sezione **Sorgente coordinate** in Convertitore — waypoint, preferito, punto mappa one-shot, centro mappa; input manuale invariato; QR/Help non regressi
- **`APP_BUILD_NUM`:** 8 — display **`B5.5Z · build 8`**
- **Review:** **GPT sostitutiva PASS** (Claude non disponibile — **non** review byte Claude ordinaria)
- **Deploy GIS-only:** PASS tecnico — byte **2423291**, SHA **`1a954ca989e436bb1dadb319d7fc84701ed760a845d3127d6d963f4b1ae6b4ab`**, CMP_PASS, HTTP **200**, `goi-gis-app.service` active/enabled
- **QA operatore:** **PASS** — «**QA CONVERT-SOURCE-PICKER PASS operatore**»

**Runtime autorevole live VPS:** `b294140`  
**URL QA:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=b294140`

## Dettagli implementati (runtime già pubblicato)

- Nuova sezione «Sorgente coordinate» in `#manualInputSection`
- Waypoint: select da `state.mapWaypoints[]`; **Usa** compila DD; `doConvert()` aggiorna output
- Preferito: select da `state.favorites[]`; solo preferiti con lat/lon validi
- Punto mappa: click one-shot via `convertSourcePickMode`; pattern Astro/Range Rings; Esc/Annulla/chiusura Converti puliscono picker; nessun GPS/tracking
- Centro mappa: `state.viewCenter` \|\| `state.lastPoint`
- Feedback in `#convertSourceFeedback`
- Input manuale DD/DDM/DMS/free, UTM, MGRS invariato
- Nessuna nuova persistenza; OPSEC/rete/tile/proxy/cache/import-export/sanitizer/storage schema invariati

## QA PASS verificata

- Input manuale Convertitore OK
- Waypoint → Usa → output aggiornato
- Preferito → Usa → output aggiornato
- Punto mappa one-shot → output aggiornato
- Annulla/ESC disattivano picker
- Centro mappa → output aggiornato
- QR da Converti funziona
- Mappa interattiva dopo picker
- Help/QR build 7 non regressi
- Footer/about **`B5.5Z · build 8`**

## File docs aggiornati (commit task `finito`)

- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/QA-CHECKLIST.md`
- `docs/HANDOFF.md`

**Monolite:** invariato (`6feba1c9…` @ `b294140`).

## Backlog operativo

1. **P-POLYGON-LIST-UX-NEXT-B-FIX2** — indicatore Vis. poligoni (pallino verde/grigio)

## Prossimo candidato operativo

**P-POLYGON-LIST-UX-NEXT-B-FIX2**
