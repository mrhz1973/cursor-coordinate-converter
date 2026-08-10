# CARTO-IGM-SERIES-EXPAND-A — implementazione

**Data:** 2026-08-10 ~19:24 locale  
**Tipo:** bundle dati + geometria + runtime CARTO  
**Baseline:** `0c3882828a686e27f100eaa1ef4d9172ca34b345`  
**RUNTIME_COMMIT:** `535670041dcb22f1505ff85e45ff3286ff91d293`  
**Subject:** `feat(carto): expand IGM series index`  
**Blob monolite:** `9266de153cfd1e0219e796463ddd0a81c345737e`  
**Byte LF monolite:** `9759720`  
**SHA-256 LF monolite:** `49b598c502834309a1af323379361bca31fb856961894c1ef57faa219ee5d72f`  
**Build:** `CARTO-IGM-SERIES-EXPAND-A` · **144**  
**Push task:** riuscito  
**Working tree pre-autosync:** pulito dopo push task  
**Monolite in autosync:** escluso

## Scope

- Serie 25/25DB (`series_id=25`) — 2266 feature, PolygonZ→2D CRS84
- Serie 25V (`series_id=25v`) — 3549 feature, Polygon CRS84
- Serie 25K Automatica (`series_id=25kauto`) — 1478 feature, RDN2008 TM→CRS84 **PASS**
- Totale payload: **8204** (precedente 911)
- Payload compact `carto-igm-compact-v1` bytes **6216735** SHA-256 **`487AC0A0FDB676001631DF90F20D12F784C70364CCBFF6DF2004F4636C8B6283`**

## RDN2008

- `.prj`: `RDN2008_Italy_zone` / Transverse_Mercator / GRS80 / lon0=12 / k0=0.9985 / FE=7000000 / FN=0
- Axis order: Easting, Northing
- Motore: TM puro stdlib (no pyproj/GDAL)
- Cross-validation: round-trip; max err **0.075 m** (tolleranza 0.5 m)

## Runtime

- Rimossi hard-code 911 / counts solo 50+100v
- Filtri UI: + Serie 25/25DB, 25V, 25K Automatica (IT only, no nuove chiavi EN/FR)
- Storage/rete/proxy/overlay raster/Objects GIS/routing: **non toccati**

## Gate

- Deploy: **NOT EXECUTED**
- QA operatore: **NOT EXECUTED**
- Review: **GPT-SOSTITUTIVA REQUIRED** su `5356700` immutabile
- `finito`: non eseguito (coda solo dopo review + deploy + QA PASS)

## Autosync corrente

SHA/push/HEAD finale = **EXTERNAL_ONLY** (anti-self-reference F3).
