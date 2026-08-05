# Inbox — CARTO-IGM-ACQUIRE-A

**Data:** 2026-08-05 ~18:24 Europe/Rome  
**Gate:** `CARTO-IGM-ACQUIRE-A — COMPLETE / LOCAL PACKAGE VALIDATED / NO RUNTIME`  
**Tipo:** acquisizione + normalizzazione locale fuori repo + docs  
**real_task_commit:** `83a21033444198c03d05e7bee96ea935b9253927`  
**Subject:** `docs(carto): validate local IGM index package`

## Cosa è stato fatto

1. Pre-flight PASS su baseline `11a8ac8`; monolite `8e3cee4` / build 117 invariato.
2. Verificati hash Fase 1 dei ZIP IGM 50 + 100 (match esatto); copiati in `C:\tmp\goi-carto-discovery\igm-acquire-a\source\`.
3. Pipeline Python stdlib (GDAL assente): inventario, estrazione, normalizzazione GeoJSON WGS84 2D, manifest, doppia conversione deterministica, test spaziali offline.
4. Output locale (NON in Git):
   - `igm-series-50.geojson` — 633 feat — SHA-256 `401D6715E65561ECBF4FC9C653DF769324BC6D747FC5CA7EA73C91279E1158A1`
   - `igm-series-100v.geojson` — 278 feat — SHA-256 `C9619E5238A7F3FEA1DDFB0A95DCE886CBCDF0C88858B3B6D9BBA6AA22F9704C`
   - `manifest.json` — rights `local-use-prototype-no-redistribution`
5. AIVABLE preservato in raw; `provider_availability=null` (semantics not confirmed).
6. Determinismo PASS; spatial PASS (nord 147 / centro 133 / sud 94 / fuori 0 / confine 9); cross-series ID collision 0.
7. Aggiornati WU-0012 §16, OM §7, roadmap, HANDOFF.

## File repository (commit task)

- `docs/work-units/WU-0012-carto-index-federated.md`
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/OPERATING_MEMORY.md`
- `docs/HANDOFF.md`

**Monolite:** non modificato; escluso.  
**Dati IGM / GeoJSON / script-temp:** **esclusi** dal commit (solo fuori repo).

## Licenza

Fail-closed: prototipo locale; no redistribuzione; no publish; fonte IGM; redistribuzione derivati ancora UNKNOWN / RICHIEDE AUTORIZZAZIONE.

## QA

Docs + validazione locale tecnica PASS. QA operatore runtime: **N/A**. Deploy: **non eseguito**.

## Working tree (post-task / pre-autosync)

Pulito dopo push `83a2103`.

## Prossimo passo

Decisione operatore: chiarimento licenza IGM **oppure** `CARTO-SEARCH-ENGINE-A` / UI (DELICATO) — **non** auto-aprire runtime.

## Limiti

GDAL assente; validazione topologica OGR non eseguita; AIVABLE semantics UNKNOWN; pacchetto non nel repo.
