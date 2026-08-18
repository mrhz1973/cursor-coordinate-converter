# OUTDOOR-ROUTING-ORS-PROVIDER-A — REVIEW-ANCHOR (scoped)

**BLOCK-ID:** `OUTDOOR-ROUTING-ORS-PROVIDER-A`  
**PASS:** `REVIEW-ANCHOR-RECOVERY`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (invariato)  
**Verdetto review:** **NON EMETTERE** (evidence-only per GPT sostitutiva)  
**Deploy / ABQA / QA operatore / finito / build bump / monolite:** **NON ESEGUITI**

## Anchor — candidate immutabile

| Campo | Valore |
| --- | --- |
| FULL SHA candidate | `268787379f18f52bf2f6285d3e852f9770f260ed` |
| Subject | `feat(routing): ORS provider opt-in candidate build 220` |
| Git parent | `757a6f277e25d4a59d8e1eed1e676508752e3a22` (docs INFRA3 STOP; **non** runtime) |
| Parent/base runtime (LIVE 219) | `5477a5e0d8d9a5681dbfab37b3c39e182306fc79` |
| Ultimo commit che ha cambiato il monolite prima del candidate | `5477a5e` (stesso LIVE) |
| `APP_BUILD_NUM` | **220** |
| `APP_BUILD_ID` | `OUTDOOR-ROUTING-ORS-PROVIDER-A` |
| Blob git monolite | `23fe93aae3c7c2c6f32dfdcaab90f2cc827e14a1` |
| Bytes LF | `10562488` |
| SHA-256 LF | `f80c645699cb0ee533c6454afc23269665373b3773c9ae0e7b7a0e6831418afa` |
| Helper | **0.1.3** (invariato) |
| Candidate immutabile | **SÌ** — già su `origin/main`; questo pass **non** lo riscrive |

Verifica `APP_BUILD_*` nel blob candidate:

```javascript
const APP_BUILD_ID = "OUTDOOR-ROUTING-ORS-PROVIDER-A";
const APP_BUILD_DETAIL = "ORS provider opt-in via HTTPS gateway; GraphHopper unchanged.";
const APP_BUILD_NUM = 220;
```

## Diff monolite vs LIVE 219

```text
git diff --stat 5477a5e0d8d9a5681dbfab37b3c39e182306fc79 268787379f18f52bf2f6285d3e852f9770f260ed -- "coordinate_converter Claude.html"
 coordinate_converter Claude.html | 644 +++++++++++++++++++++++++++++++++++----
 1 file changed, 583 insertions(+), 61 deletions(-)
```

- File runtime toccati nel diff LIVE→candidate: **1** (`coordinate_converter Claude.html`)
- Hunk git `--unified=0`: **43** (22 micro-hunk = bump selftest `APP_BUILD_NUM` 219→220; 1 hunk core ORS ~+501 linee @ `87884`)
- `state.mapWaypoints[]` / `state.gisPolygons`: **assenti dal diff HTML**
- `ORS_API_KEY` / `api.openrouteservice.org` come host client: **assenti dal monolite** (selftest `RAA_ors_gateway_base` asserisce che `ROUTING_ORS_GATEWAY_BASE` non contiene `api.openrouteservice`)
- Match `AUTHORIZATION: 1` nel file: enum D-Flight preesistente (`DFLIGHT_AUTH_PURPOSE_ENUM`), **non** header ORS

## Capability ORS 1–10 — già eseguite (non rieseguite)

Fonte: [`2026-08-18_0425_outdoor-routing-ors-provider-a-infra3-retry-candidate220.md`](2026-08-18_0425_outdoor-routing-ors-provider-a-infra3-retry-candidate220.md) · script locale `_ors_capability_matrix.py` (untracked, non nel candidate).

| # | Capability | Esito |
| --- | --- | --- |
| 1 | multi-waypoint | PASS |
| 2 | elevation | PASS |
| 3 | alternatives | PASS |
| 4 | round trip | PASS |
| 5 | avoid polygon | PASS |
| 6 | alternatives + avoid | PASS |
| 7 | round trip + avoid | PASS |
| 8 | Andata/Ritorno (2 POST) | PASS |
| 9 | foot-hiking | PASS |
| 10 | cycling-mountain | PASS |

Nessun secret in quella evidence. **Non rieseguito** in questo recovery (evidence sufficiente).

---

## Estratti raw (candidate `2687873`)

### 1. Select ORS — opt-in esplicito (menu, non Auto)

```html
<button … data-routing-service="graphhopper" …>GraphHopper</button>
<button … data-routing-service="ors" data-i18n="routing.serviceOrs">OpenRouteService</button>
```

```javascript
function routingNormalizeService(v){
  const s = String(v || "").trim().toLowerCase();
  return s === "ors" ? "ors" : "graphhopper";
}
```

Switch menu (wire): `routingEnsureState().service = routingNormalizeService(svc)` poi `openRoutingPlannerPanel(svc)`.

Dispatch calcolo:

```javascript
function routingCalculateRoute(){
  if (routingIsOrsService()) return routingCalculateRouteOrs();
  return routingCalculateRouteGraphhopper();
}
```

### 2. `routingProviderNormalize` / Auto = solo GraphHopper Local→VPS

Invariato rispetto a LIVE 219: **nessun** `"ors"` nel normalize GH.

```javascript
function routingProviderNormalize(v){
  const s = String(v || "").trim().toLowerCase();
  if (s === "local" || s === "auto" || s === "vps") return s;
  return "vps";
}
```

`routingResolveProvider` (Auto) spinge solo `"local"` / `"vps"` GraphHopper:

```javascript
if (selected === "auto"){
  if (state.forceOffline){
    // … candidates.push("local");
  } else {
    candidates.push("local", "vps");
  }
}
```

ORS **non** entra in Auto. ORS solo se `state._routing.service === "ors"` (menu esplicito).

### 3. Gateway URL HTTPS (nessuna key nel fetch)

```javascript
const ROUTING_ORS_GATEWAY_BASE = "https://ubuntu.tailc01234.ts.net";
const ROUTING_ORS_STATUS_PATH = "/ors/status";
const ROUTING_ORS_DIRECTIONS_PATH = "/ors/v2/directions";
```

POST directions: header solo `Content-Type: application/json` — **nessun** `Authorization`.

```javascript
async function routingPostOrsDirections(profile, bodyObj, controller){
  const res = await fetch(routingOrsDirectionsUrl(profile), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyObj),
    signal: controller.signal
  });
```

### 4. `forcedOffline` / `opsecStrict` fail-closed

```javascript
function routingNetworkGateOrs(){
  if (state.opsecStrict) return { ok: false, errKey: "routing.errorOpsec" };
  if (state.forceOffline) return { ok: false, errKey: "routing.errorOffline" };
  if (typeof navigator !== "undefined" && navigator.onLine === false)
    return { ok: false, errKey: "routing.errorOffline" };
  if (!isEffectivelyOnline()) return { ok: false, errKey: "routing.errorNetwork" };
  return { ok: true };
}
```

Policy change abortisce richieste ORS attive:

```javascript
const gate = routingIsOrsService()
  ? routingNetworkGateOrs()
  : routingNetworkGateGraphhopper({ provider: r.provider, endpoint: r.resolvedEndpoint || null });
```

### 5. Builder ORS normal + elevation + alternatives

```javascript
function routingBuildOrsRouteBody(pointsLonLat, opts){
  opts = opts || {};
  const body = { coordinates: pointsLonLat, elevation: true, instructions: false };
  if (opts.withAlternatives){
    body.alternative_routes = {
      target_count: ROUTING_ALTERNATIVE_MAX_PATHS,
      share_factor: ROUTING_ALTERNATIVE_MAX_SHARE_FACTOR,
      weight_factor: ROUTING_ALTERNATIVE_MAX_WEIGHT_FACTOR
    };
  }
  return routingApplyAvoidPayloadToOrsBody(body);
}
```

Elevation normalization (GeoJSON `[lon,lat,ele]` → preview + `elevationCoordinates`):

```javascript
previewCoordinates.push({ lat: lat, lon: nLon });
const ele = (c.length >= 3 && typeof c[2] === "number" && Number.isFinite(c[2])) ? c[2] : null;
elevationCoordinates.push({ lat: lat, lon: nLon, ele: ele });
```

`routingApplyRouteResultFromValidated` riusa `routingBuildElevationProfile` / `routingComputeDifficulty` / preview/save-track esistenti.

### 6. Andata/Ritorno — due POST, merge client-side

In `routingCalculateRouteOrs`, se `routeMode === "out_and_back"`: outbound poi return (`pointsLonLat.slice().reverse()`), `withAlternatives: false`, merge via `routingMergeOutAndBackCoordinates` + `routingAggregateOutAndBackMetrics`.

### 7. Round trip

```javascript
function routingBuildOrsRoundTripBody(pointLonLat, distanceM, seed){
  const body = {
    coordinates: [pointLonLat],
    elevation: true,
    instructions: false,
    options: { round_trip: { length: Math.round(Number(distanceM)), points: 3, seed: (Number(seed) >>> 0) || 1 } }
  };
  return routingApplyAvoidPayloadToOrsBody(body);
}
```

`routingCalculateRoundTripOrs`: batch seed + `routingRoundTripClosureOk` + score; **nessun** fallback silenzioso a GraphHopper.

### 8. Avoid polygons (contratto ORS, non GH `custom_model`)

```javascript
function routingBuildOrsAvoidPolygons(){
  // … Polygon singolo o MultiPolygon
}
function routingApplyAvoidPayloadToOrsBody(body){
  const poly = routingBuildOrsAvoidPolygons();
  if (!poly) return body;
  if (!body.options || typeof body.options !== "object") body.options = {};
  body.options.avoid_polygons = poly;
  return body;
}
```

`routingAvoidPreflightBlock` è service-aware (`ROUTING_AVOID_ORS_*` vs `ROUTING_AVOID_GH_*`). Payload GH `custom_model` **invariato**.

### 9. `requestController` / `requestSequence` / stale

Pattern ripetuto in `routingVerifyOrsProvider`, `routingCalculateRouteOrs`, `routingCalculateRoundTripOrs`:

- abort controller precedente
- `r.requestSequence++` → `reqSeq`
- nuovo `AbortController` su `r.requestController`
- guard `if (!state._routing || state._routing.requestSequence !== reqSeq) return`
- `finally` azzera loading/controller solo se sequence ancora attiva

Timeout: `ROUTING_ORS_TIMEOUT_MS = 20000` / status `5000`.

### 10. Error mapping (no silent degrade)

- gate: `routing.errorOpsec` / `routing.errorOffline` / `routing.errorNetwork`
- status: `routing.orsProviderUnavailable` / `routing.orsProfilesMissing` / timeout / CORS / network
- route: `routing.errorInvalidProfile` / `routing.errorInvalidPoints` / `routing.errorOrsHttp` / `routing.errorTimeout` / `routing.errorOrsRoundTrip` / `routing.roundTripNoCandidate` / `routing.errorNoPath`
- HTTP/JSON malformati → throw `{ kind: "http"|"json"|"ors" }`; catch **non** chiama GraphHopper

### 11. Nessun nuovo storage / GPS

- Prefs ORS: solo session `_routingSessionPrefs.orsProfile` (non persistito; stesso bag session-only GH)
- `STORAGE_KEY` / `coordconv_v2`: **non** toccati nel diff
- Nessun `getCurrentPosition` / `watchPosition` aggiunto

### 12. Oggetti GIS / waypoints / polygons

Diff HTML LIVE→candidate: **nessuna** occorrenza `mapWaypoints` o `gisPolygons`. Oggetti GIS **UNTOUCHED**.

---

## NON in questo pass

- modifica `coordinate_converter Claude.html`
- build bump
- deploy / ABQA / QA operatore / finito
- riesecuzione capability 1–10
