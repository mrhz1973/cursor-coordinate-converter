# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A — evidence (candidate)

> Recovery raw/anchor: [`2026-08-18_1320_outdoor-routing-f-provider-compare-a-review-anchor.md`](2026-08-18_1320_outdoor-routing-f-provider-compare-a-review-anchor.md).  
> **RUNTIME_CANDIDATE_SHA** = `1a5e971459f13b12ed303f1e7105998db774b3bf` (non HEAD).

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**Deploy / ABQA / QA operatore:** **NOT EXECUTED**  
**NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito

## BASE

| Campo | Valore |
| --- | --- |
| BASE LIVE | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` · build **220** · `OUTDOOR-ROUTING-ORS-PROVIDER-A` |
| BASE REPO ATTESTATA (pre-task) | `9e811d58668067ae48ce40f44d9466a3953040e2` |
| FULL SHA (candidate) | `1a5e971459f13b12ed303f1e7105998db774b3bf` |
| Build / ID | **221** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A` |
| Blob git | `90c52d57f58ec49af91bf0364e2fe7c8aa5ece3b` |
| Bytes LF | `10605066` |
| SHA-256 LF | `72a8ed2456baea53994b18635fa4b967c89b1a11dc6861bbe2b9ca10ab80f01f` |
| Diff scoped | `coordinate_converter Claude.html` · +834 / −47 |

## Mapping profili (parità reale)

Confrontabili (unica coppia semantica onesta già nel runtime):

| GraphHopper | OpenRouteService |
| --- | --- |
| `hiking` | `foot-hiking` |
| `mtb_trail` | `cycling-mountain` |

**Finding — non confrontabili (nessuna equivalenza inventata):** `hiking_easy`, `mtb_touring`, ORS `foot-walking`. UI esplicita «Profilo non confrontabile»; nessuna degradazione silenziosa. Il blocco resta significativo: hiking + MTB trail coperti.

Auto GH resta **Locale → VPS** (mai ORS). ORS resta opt-in, mai fallback Auto.

## Orchestrazione

- Session-only `_routingCompareSession` (fuori da `state._routing` così minimize/restore preserva il confronto; close abortisce).
- Snapshot immutabile: punti planner, ordine, `routeMode`, coppia profili, avoid attive, seed/distanza anello. **Non** duplica `state.mapWaypoints[]`. **Non** tocca `state.gisPolygons`.
- CTA esplicita `#routingCompareBtn` — nessun avvio a boot / open planner / cambio provider / background.
- Controller isolati GH/ORS + `sequence` stale; abort su invalidate input, Calcola, close, policy rete.
- Choose riusa `routingApplyRouteResultFromValidated` (preview/profile/save-track esistenti). Nessun ranking.

## Rete / OPSEC

- **Nessun endpoint nuovo.** GH: `127.0.0.1:8989` / `100.114.7.53:8989`. ORS: `https://ubuntu.tailc01234.ts.net/ors/...`
- **Nessuna API key** nel monolite. Nessun `api.openrouteservice.org`. Nessun `Authorization`.
- `forcedOffline` / `opsecStrict`: stessi gate `routingNetworkGateGraphhopper` / `routingNetworkGateOrs`. ORS bloccato sotto opsec; nessun tentativo nascosto.
- Nessun polling / prefetch / retry extra.

## Selftest

`GOIDflight.selfTest()`: **679/679 PASS** (`node --check` OK). RPC 30/30:

`RPC_build_221` `RPC_no_boot_start` `RPC_cta_fn` `RPC_auto_no_ors` `RPC_pair_hiking` `RPC_pair_mtb` `RPC_hiking_easy_unmapped` `RPC_snapshot_stable` `RPC_isolation_controllers` `RPC_stale_bump` `RPC_partial` `RPC_delta` `RPC_no_new_endpoint` `RPC_no_api_key` `RPC_waypoints` `RPC_gis_polygons` `RPC_no_storage_key` `RPC_map_hiking` `RPC_hiking_easy_block` `RPC_walking_block` `RPC_mtb_touring_block` `RPC_opsec_fn` `RPC_modes_supported` `RPC_avoid_both` `RPC_choose_gh` `RPC_choose_ors` `RPC_forcedOffline` `RPC_opsecStrict` `RPC_cta_only` `RPC_wp_poly_count`

## Estratti (rete / OPSEC / isolation)

```text
const ROUTING_GRAPHHOPPER_ENDPOINT = "http://100.114.7.53:8989";
const ROUTING_GRAPHHOPPER_ENDPOINT_LOCAL = "http://127.0.0.1:8989";
const ROUTING_ORS_GATEWAY_BASE = "https://ubuntu.tailc01234.ts.net";
```

```javascript
function routingCalculateRoute(){
  try { routingCompareAbortInFlight({ clearResults: true }); } catch(_){}
  if (routingIsOrsService()) return routingCalculateRouteOrs();
  return routingCalculateRouteGraphhopper();
}
```

```javascript
function routingCompareAutoCandidates(){
  if (state.forceOffline) return ["local"];
  return ["local", "vps"];
}
```

`grep` monolite: nessuna occorrenza `api.openrouteservice` come URL; nessuna `ORS_API_KEY`.

## Storage / GIS / GPS

- Nessuna nuova chiave `localStorage` (`STORAGE_KEY` resta `coordconv_v2`).
- `state.mapWaypoints[]` / `state.gisPolygons` **untouched**.
- Oggetti GIS **FROZEN** / **UNTOUCHED**.
- Helper D-Flight **0.1.3** invariato.
- Nessun GPS nuovo.
- GraphHopper normale e ORS normale invariati (Calcola abortisce solo lo stato confronto, poi dispatch identico).

## i18n

Nuove stringhe **solo IT** (L10N freeze EN/FR). Chiavi `routing.compare*` / `tip.routingCompare`.
