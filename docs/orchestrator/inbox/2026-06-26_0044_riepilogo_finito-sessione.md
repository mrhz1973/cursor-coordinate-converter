# Chiusura documentale P-UNITS — finito sessione

**Data:** 2026-06-26  
**Tipo:** docs-only + finito sessione + autosync orchestratore

## Commit task (docs chiusura)

- **SHA:** `b4be4d50a342980b08a7b89df9ae233f85eea747`
- **Subject:** `docs(gis): close P-UNITS after operator QA pass`
- **File:** `docs/OPERATING_MEMORY.md`, `docs/work-units/WU-0005-0009-roadmap.md`
- **Monolite:** non toccato — blob invariato `10f5f1e90a7cc9fcc4c63ea40627841878fbb378`

## Blocco P-UNITS — CLOSED / PASS end-to-end

### Catena runtime

| Step | SHA | Subject |
|------|-----|---------|
| P-UNITS base | `8c266aeec88dbd64e384479fb3567807218dd1ce` | feat(gis): selectable measurement units for polygon metrics (P-UNITS) |
| P-UNITS-FIX | `8be2845453f10deb6cbf319c3b9a07e55f6b6e26` | fix(gis): isolate polygon metric units from measure state (P-UNITS-FIX) |
| P-UNITS-RB-PARITY | `11838a15d39a8053e8f561300abf447c3aaf7823` | feat(gis): add NM mi and ft polygon metric units (P-UNITS-RB-PARITY) |

**Blob finale:** `10f5f1e90a7cc9fcc4c63ea40627841878fbb378`  
**APP_BUILD_ID:** `B5.5Z` invariato

### Funzionalità registrate

- Selettori Lunghezza e Area in pannello Poligoni (`#polygonPanelUnits`)
- Stato session-only `polygonMetricLengthUnit` / `polygonMetricAreaUnit`
- Lunghezze canoniche in metri; aree canoniche in m²
- Metriche drawing, Modifica e lati aggiornate live
- Nessuna persistenza nelle feature
- P-UNITS-FIX: rimossa `polygonSyncLengthUnitToMeasure`; unità Poligoni indipendenti da `state.mapMeasureUnit`; Range & Bearing indipendente via `rrUnit`; nessun render Misura GIS dal pannello Poligoni
- P-UNITS-RB-PARITY: lunghezza **auto/m/km/NM/mi/ft** via `formatMapMeasureDistance`; area **auto/m²/ha/km²**; Auto m/km sotto/sopra 1000 m; NM 1852 m; mi 1609.344 m; ft 0.3048 m
- Sanitizer/CRUD/storage/import/export/timestamp invariati

### Deploy VPS GIS-only — PASS tecnico

- HEAD VPS: **`26f73f7ef7f41f46038d4627b2fb735bca40ea8d`**
- Pull FF `8044356`→`26f73f7`
- `goi-gis-app.service` active/enabled; bind `100.114.7.53:8000`; HTTP 200
- Byte repo/servito/tailnet: **2314390**
- SHA-256: **`9b9aca0c591faea2f889905eef9c8ef170a5880defae7c94153736c0bb9ff5de`**
- Blob match repo/servito/tailnet; cmp PASS exit 0
- Solo clone GIS + restart servizio; proxy, Planet-Clone, Docker, n8n, Tailscale, firewall e altri servizi non toccati

### QA operatore — PASS

Attestazione esplicita: «**QA P-UNITS PASS operatore**»

Esiti: selettori Lunghezza/Area presenti; valori auto/m/km/NM/mi/ft e auto/m²/ha/km²; metriche drawing e Modifica (area/perimetro/lati) aggiornate live; nessuna mutazione geometria/draft/dirty da cambio unità; Misura GIS e Range & Bearing indipendenti; IT↔EN; P-UI-UNIFORM preservato; nessuna regressione evidente su drawing/Modifica/salvataggio/export.

### Review Claude

**NON RICHIESTA** — display e stato session-only; nessun nuovo campo feature; sanitizer GIS invariato; CRUD e geometria invariati; import/export e timestamp invariati.

## Stato residuo batch feature Poligoni

1. **P-UI-UNIFORM** — CLOSED / PASS end-to-end
2. **P-UNITS** — CLOSED / PASS end-to-end
3. **P-VERTEX-MODAL** — prossimo candidato, **non avviato**
4. **P-STYLE** — non iniziato, **review-gated** (review Claude obbligatoria prima del deploy)

Batch feature Poligoni **non chiuso** nel complesso. Batch separato **P5 / P5-B2-F / chiusura P5** invariato e **non chiuso**.

## Non eseguito in questo intervento

- Modifiche runtime/monolite
- Deploy / restart servizi
- QA ripetuta
- Review Claude
- Avvio P-VERTEX-MODAL / P-STYLE
- Chiusura batch P5

## Working tree pre-autosync

(vuoto dopo commit task docs — verificato esternamente post-push)
