# OUTDOOR-ROUTING-F-AVOID-AREAS-A-FIX1 — evidence (candidate 219)

**BLOCK-ID:** `OUTDOOR-ROUTING-F-AVOID-AREAS-A-FIX1`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**Deploy / ABQA / QA operatore:** **NOT EXECUTED**

## BASE → CANDIDATE

| Campo | Valore |
| --- | --- |
| BASE CANDIDATE | `12a7477414a311b1650e9b575c89cab6966e240e` · build **218** · `OUTDOOR-ROUTING-F-AVOID-AREAS-A` |
| FULL SHA (candidate FIX1) | `5477a5e0d8d9a5681dbfab37b3c39e182306fc79` |
| Build / ID | **219** / `OUTDOOR-ROUTING-F-AVOID-AREAS-A-FIX1` |
| Blob git (monolite) | `a823ae9b5bb9bebb8606b4221221314186bc9370` |
| Bytes LF | `10537443` |
| SHA-256 LF | `eb7a8aa064245b49635ab94057567c750d059dfd3d66a87cc37e36aeb1c8b136` |

## Finding bloccante (review 218)

`routingApplyAvoidPayloadToBody()` eliminava genericamente `algorithm` e parametri `alternative_route.*`, rompendo **round_trip** e disabilitando silenziosamente **Alternative** con avoid attive.

## Capability check GraphHopper 11 (INFRA-GH-1D)

Endpoint: `http://100.114.7.53:8989/route` · stesso POST `/route`.

### A — alternative_route + avoid

```json
{
  "profile": "hiking",
  "points": [[9.82,44.10],[9.86,44.12]],
  "algorithm": "alternative_route",
  "alternative_route.max_paths": 3,
  "alternative_route.max_weight_factor": 1.4,
  "alternative_route.max_share_factor": 0.6,
  "ch.disable": true,
  "custom_model": { "areas": { "avoid1": { "type":"Feature", "geometry": { "type":"Polygon", "coordinates": [[[9.835,44.105],[9.845,44.105],[9.845,44.115],[9.835,44.115],[9.835,44.105]]] } } }, "priority": [{ "if":"in_avoid1", "multiply_by":"0" }] }
}
```

**HTTP 200** · paths=1 · dist=5800.532 m · `algorithm` accettato.

### B — round_trip + avoid

```json
{
  "profile": "hiking",
  "points": [[9.82,44.10]],
  "algorithm": "round_trip",
  "round_trip.distance": 8000,
  "round_trip.seed": 1,
  "ch.disable": true,
  "custom_model": { "areas": { "avoid1": { "…": "…" } }, "priority": [{ "if":"in_avoid1", "multiply_by":"0" }] }
}
```

**HTTP 200** · paths=1 · dist=14255.698 m · `algorithm` accettato.

**Esito:** entrambi supportati → implementati; flag `ROUTING_AVOID_GH_ALT_WITH_AVOID` / `ROUTING_AVOID_GH_ROUND_TRIP_WITH_AVOID` = `true`; fail-closed via `routingAvoidPreflightBlock()` se flag false (no degradazione silenziosa).

## Diff runtime (218 → 219)

| Metrica | Valore |
| --- | --- |
| File | `coordinate_converter Claude.html` |
| Hunk | 28 |
| Linee | +108 / −58 |

### Fix principali

1. **`routingApplyAvoidPayloadToBody`** — aggiunge solo `custom_model` + `ch.disable`; **non** cancella `algorithm` né parametri algorithm-specific.
2. **`routingCalculateRouteGraphhopper`** — `withAlternatives: !isOutAndBack` (avoid non disabilita più Alternative).
3. **`routingAvoidPreflightBlock`** — fail-closed esplicito pre-request se combo non supportata (i18n IT `routing.avoidAltUnsupported` / `routing.avoidRoundTripUnsupported`).
4. **`routingCalculateRoundTripGraphhopper`** — preflight round_trip+avoid prima del gate rete.

### Body raw attesi (post-fix, selftest)

**Alternative + avoid:**

- `algorithm === "alternative_route"`
- `alternative_route.max_paths === ROUTING_ALTERNATIVE_MAX_PATHS`
- `custom_model.areas` presente
- `ch.disable === true`

**Round trip + avoid:**

- `algorithm === "round_trip"`
- `round_trip.distance` / `round_trip.seed` preservati
- `custom_model.areas` presente
- `ch.disable === true`

**Normale senza avoid:** nessun `custom_model`, nessun `algorithm`.

## Regression essenziale (1–10)

| # | Caso | Esito |
| --- | --- | --- |
| 1 | Route normale senza avoid | PASS (selftest `RAA_payload_normal_clean`) |
| 2 | Route normale con avoid | PASS (payload alt/rt preserve custom_model) |
| 3 | Alternative senza avoid | PASS (`RAA_payload_no_avoid_alt`) |
| 4 | Alternative con avoid | PASS (`RAA_payload_alt_preserve`) |
| 5 | Round Trip senza avoid | PASS (invariato pre-FIX1) |
| 6 | Round Trip con avoid | PASS (`RAA_payload_round_trip_preserve`) |
| 7 | Andata/Ritorno con avoid | PASS (segmenti usano `routingApplyAvoidPayloadToBody`; no strip algorithm) |
| 8 | toggle/delete/clear invalida preview | PASS (invariato `routingAvoidTouchInvalidatePreview`) |
| 9 | forced-offline / OPSEC | PASS (`routingNetworkGateGraphhopper` non modificato; 0 nuove fetch) |
| 10 | Selftest aggregato | **647/647 PASS** (+10 `RAA_*`) · `node --check` OK |

## Rete / OPSEC

- **Endpoint:** solo `/route` esistente (`ROUTING_GRAPHHOPPER_ROUTE_PATH`)
- **Nuove fetch/XHR/WebSocket/EventSource:** 0
- **Boot:** 0 chiamate rete aggiunte
- **Gate:** `routingNetworkGateGraphhopper` invariato; forced-offline / opsecStrict non bypassati

## Invarianti

- Oggetti GIS **UNTOUCHED**
- `state.gisPolygons` read-only (`RAA_gis_polygons_untouched`)
- `state.mapWaypoints[]` non modificato nel diff
- Nessuna nuova persistenza
- Nessun GPS
- Helper **0.1.3**
- Dock/legende build 217 invariati

**NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito
