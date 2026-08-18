# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2 — REVIEW-RAW-RECOVERY-FIX2

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2`  
**PASS:** `REVIEW-RAW-RECOVERY-FIX2`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (invariato; FRONTIER / WU-HOT-HEADER **non** toccati)  
**Verdetto review:** **NON EMETTERE** (evidence-only per GPT sostitutiva)  
**Deploy / ABQA / QA operatore / finito / build bump / monolite:** **NON ESEGUITI**  
**Selftest 741/741 e live probes 28/28:** **non rieseguiti** (candidate immutato)

Fonte blob: `git cat-file -p 56163b6f4e43e1ea8eec837ba535cd62c4b6c38f`  
Commit runtime: `git log -1 --format=%H -- "coordinate_converter Claude.html"`  
Linee citate = blob candidate **223** (working tree HTML identico a `4a6dca9`; nessun `M` sul monolite).

Probes/selftest già persistiti: [`2026-08-18_1635_outdoor-routing-f-provider-compare-a-fix2.md`](2026-08-18_1635_outdoor-routing-f-provider-compare-a-fix2.md).

---

## 1. Anchor — RUNTIME_CANDIDATE_SHA

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `4a6dca938057d2c1e2b0f0a2cdec1480c13f3d20` |
| Subject | `feat(routing): gate alternatives to exactly 2 points and fix VIA reorder, build 223` |
| Parent | `1b1aed9076e1565c47d0a212a3b91593fe1860f9` (docs FIX1 ABQA FAIL; **non** runtime LIVE) |
| Base 222 | `105bedf3c0fa4f15f1be0edf4929d19e8842235b` |
| LIVE runtime (build 220) | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` |
| `APP_BUILD_NUM` | **223** |
| `APP_BUILD_ID` | `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2` |
| Blob git monolite | `56163b6f4e43e1ea8eec837ba535cd62c4b6c38f` |
| Bytes LF | `10639339` |
| SHA-256 LF | `2b9df0d23602478937528913f19500e1445275a7a447d6944cab9d21336f28e8` |
| Helper | **0.1.3** (invariato; FRONTIER LIVE) |
| Candidate immutabile | **SÌ** — questo pass **non** riscrive il monolite |

Verifica `APP_BUILD_*` nel blob candidate (`coordinate_converter Claude.html` 23982–23985):

```javascript
const APP_BUILD_ID = "OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2";
const APP_BUILD_DETAIL = "Constrained Anello: alternatives only when request has exactly 2 points (FIX2).";
const APP_BUILD_NUM = 223;
```

```text
git rev-parse 4a6dca938057d2c1e2b0f0a2cdec1480c13f3d20:"coordinate_converter Claude.html"
56163b6f4e43e1ea8eec837ba535cd62c4b6c38f
```

**NON** usare HEAD / current container / self-reference come sostituto di `RUNTIME_CANDIDATE_SHA`.

HEAD locale al momento dell’anchor (docs container post-FIX2 candidate, **non** il candidate runtime):

```text
git rev-parse HEAD
10dd02bc0164fe75c56b41d374a83d3a007ef404
```

## 2. REMOTE_HEAD_AT_EVIDENCE_TIME (separato)

Attestazione **prima** del commit docs di questo recovery:

```text
git ls-remote origin refs/heads/main
10dd02bc0164fe75c56b41d374a83d3a007ef404	refs/heads/main
```

**REMOTE_HEAD_AT_EVIDENCE_TIME** = `10dd02bc0164fe75c56b41d374a83d3a007ef404`

Un successivo commit docs-only può rendere `origin/main` diverso: **non** cambia `RUNTIME_CANDIDATE_SHA`.

---

## 3. RAW — ALTERNATIVES CAPABILITY

Decisione unica, **prima** della costruzione/request HTTP. `nPts` = lunghezza del vettore già chiuso (constrained) o dei 2 punti A→B.

### 3.1 Regola (`87640–87643`)

```javascript
/** Alternatives only when the HTTP request has exactly 2 effective points (start+end). */
function routingAlternativesAllowed(effectiveRoutePointCount){
  return Number(effectiveRoutePointCount) === 2;
}
```

- `2` → `true` (A→B normale).
- `3` / `4` / altro → `false` (constrained START→VIA…→START).

### 3.2 GraphHopper body (`87644–87660`)

`algorithm = "alternative_route"` e `alternative_route.*` **solo se** `opts.withAlternatives && routingAlternativesAllowed(nPts)`.

```javascript
  const nPts = Array.isArray(pointsLonLat) ? pointsLonLat.length : 0;
  if (opts.withAlternatives && routingAlternativesAllowed(nPts)){
    body.algorithm = "alternative_route";
    body["alternative_route.max_paths"] = ROUTING_ALTERNATIVE_MAX_PATHS;
    body["alternative_route.max_weight_factor"] = ROUTING_ALTERNATIVE_MAX_WEIGHT_FACTOR;
    body["alternative_route.max_share_factor"] = ROUTING_ALTERNATIVE_MAX_SHARE_FACTOR;
  }
  return routingApplyAvoidPayloadToBody(body);
```

Con `nPts > 2`: nessun `algorithm`, nessun `alternative_route.*`. Il fallback HTTP storico 400→retry **non** è questo path.

### 3.3 ORS body (`88194–88206`)

```javascript
  const nPts = Array.isArray(pointsLonLat) ? pointsLonLat.length : 0;
  if (opts.withAlternatives && routingAlternativesAllowed(nPts)){
    body.alternative_routes = {
      target_count: ROUTING_ALTERNATIVE_MAX_PATHS,
      share_factor: ROUTING_ALTERNATIVE_MAX_SHARE_FACTOR,
      weight_factor: ROUTING_ALTERNATIVE_MAX_WEIGHT_FACTOR
    };
  }
  return routingApplyAvoidPayloadToOrsBody(body);
```

Con `nPts > 2`: nessun `alternative_routes`.

### 3.4 Call-site **prima** della POST — calc ORS (`88564–88605`)

```javascript
  const wantAlt = !isOutAndBack && routingAlternativesAllowed(
    Array.isArray(ptsRes.pointsLonLat) ? ptsRes.pointsLonLat.length : 0
  );
  // ...
      const data = await routingPostOrsDirections(profile, routingBuildOrsRouteBody(ptsRes.pointsLonLat, { withAlternatives: wantAlt }), controller);
```

Constrained loop: `ptsRes.pointsLonLat` ha lunghezza 3 o 4 → `wantAlt === false` **prima** di `routingPostOrsDirections`.

### 3.5 Call-site **prima** della POST — calc GH (`89932–89950`)

```javascript
  const wantAlt = !isOutAndBack && routingAlternativesAllowed(
    Array.isArray(snapPts.pointsLonLat) ? snapPts.pointsLonLat.length : 0
  );
  const avoidPreflight = routingAvoidPreflightBlock({ withAlternatives: wantAlt });
  // ...
  const bodyPrimary = routingBuildGraphhopperRouteBody(profile, snapPts.pointsLonLat, {
    withAlternatives: wantAlt
  });
```

### 3.6 Compare — stesso snapshot chiuso, stessa regola

GH (`88893–88917`): `lonlat` da `routingClosedLoopLonLatFromOpen` se `constrainedLoop`; poi `wantAlt` sul **length** di quel vettore, poi body.

```javascript
      const lonlat = snap.constrainedLoop
        ? routingClosedLoopLonLatFromOpen(snap.points)
        : routingCompareLonLat(snap.points);
      // out_and_back: withAlternatives: false (invariato)
      const wantAlt = routingAlternativesAllowed(Array.isArray(lonlat) ? lonlat.length : 0);
      const body = routingBuildGraphhopperRouteBody(profile, lonlat, { withAlternatives: wantAlt });
```

ORS (`88956–88979`): identico schema `constrainedLoop` → `wantAlt` → `routingBuildOrsRouteBody(..., { withAlternatives: wantAlt })`.

A→B (`lonlat.length === 2`): `wantAlt === true` → Alternative conservata su GH e ORS (calc e compare).

Selftest pin (`89590–89607`): `routingAlternativesAllowed(2)===true`, `(3)===false`, `(4)===false`; body GH/ORS con `{withAlternatives:true}` su 2 punti ha alt; su 3 punti **non** ha `alternative_route` / `alternative_routes`.

---

## 4. RAW — REORDER VIA

### 4.1 Delta `routingEnsureAbPoints` (`83571–83585`)

Prima (222): `r.points = r.points.filter(p => !!p)` — **nuovo array**.  
`routingMovePoint` / DnD tenevano `const pts = r.points` **prima** di `routingPushPointUndoSnapshot` → `routingEnsureAbPoints`, poi mutavano la copia staccata.

Ora compact **in-place** (`splice`); l’identità di `r.points` resta `state._routing.points`.

```javascript
  // Compact null holes in place so callers holding r.points (MovePoint / DnD) keep a live reference.
  for (let i = r.points.length - 1; i >= 0; i--){
    if (!r.points[i]) r.points.splice(i, 1);
  }
```

`routingPushPointUndoSnapshot` (`83590`) chiama ancora `routingEnsureAbPoints(r)` **prima** dello snapshot; con compact in-place il riferimento di MovePoint/DnD resta vivo.

Selftest: `RPCF2_points_identity_after_undo_snap` (`ptsRef === r.points` dopo `routingPushPointUndoSnapshot`).

### 4.2 `routingMovePoint` (`85517–85535`) — identità + lock START/hidden B

```javascript
function routingMovePoint(id, delta){
  const r = routingEnsureState();
  const pts = r.points;
  const ix = pts.findIndex(p => p && p.id === id);
  if (ix < 0) return;
  const j = ix + delta;
  if (j < 0 || j >= pts.length) return;
  if (routingGetRouteMode() === "round_trip"){
    const last = pts.length - 1;
    if (ix === 0 || j === 0 || ix === last || j === last) return;
  }
  try { routingPushPointUndoSnapshot(); } catch(_){}
  const tmp = pts[ix];
  pts[ix] = pts[j];
  pts[j] = tmp;
  r.dirty = true;
  try { routingInvalidateRoutePreview(); } catch(_){}
```

- START (`ix/j === 0`) non riordinabile in `round_trip`.
- Hidden endpoint = ultimo slot (`ix/j === last`) non riordinabile.
- Swap sul **medesimo** `r.points` / `state._routing.points`.
- `routingInvalidateRoutePreview` (`84242`) chiama `routingCompareOnInputInvalidated()` → abort compare + clear preview (niente ghost/stale).

### 4.3 DnD (`92605–92625`) — stessa lock + stesso array

```javascript
    const pts = r.points;
    // ...
    if (routingGetRouteMode() === "round_trip"){
      const last = pts.length - 1;
      if (from === 0 || to === 0 || from === last || to === last) return;
    }
    try { routingPushPointUndoSnapshot(); } catch(_){}
    const item = pts.splice(from, 1)[0];
    pts.splice(to, 0, item);
    r.dirty = true;
    try { routingInvalidateRoutePreview(); } catch(_){}
```

ArrowUp/Down (`92639–92640`) delegano a `routingMovePoint`.

### 4.4 Hidden B non entra nei VIA visibili

`routingRoundTripVisiblePoints` (`86246–86250`): `pts.slice(0, pts.length - 1)`.  
Lista UI (`85340–85344`): `if (roundTripMode && i === n - 1) continue`.  
`routingExtractClosedLoopPoints` legge i visibili e **appende** START in coda al payload (non un secondo punto in `state._routing.points`).

Ordine atteso dopo `routingMovePoint("v1", 1)` su `[s, v1, v2, hid]`: `[s, v2, v1, hid]` → payload START→VIA2→VIA1→START. Selftest `RPCF2_reorder_*`.

---

## 5. RAW — CENTRA / HARNESS

`function routingCenterResultAction` **non** compare come hunk di definizione nel diff `105bedf..4a6dca9`. Corpo invariato (`89110–89118`): solo `routingFitMapToRoutePreview` su geometria compare/preview; **nessuna** `routingCalculateRoute*` / `routingCompareStart` / POST.

```javascript
function routingCenterResultAction(){
  const btn = document.getElementById("routingCenterResultBtn");
  if (btn && btn.disabled) return false;
  const combined = routingCompareCombinedPreviewCoordinates();
  if (combined) return !!routingFitMapToRoutePreview(combined);
  const r = state._routing;
  if (r && Array.isArray(r.previewCoordinates) && r.previewCoordinates.length >= 2)
    return !!routingFitMapToRoutePreview(r.previewCoordinates);
  return false;
}
```

Nuovo criterio automatico (`89680–89684`) — **solo** assenza di ricalcolo routing nella funzione:

```javascript
    add("RPCF2_center_no_route_post", typeof routingCenterResultAction === "function"
      && String(routingCenterResultAction).indexOf("routingFitMapToRoutePreview") >= 0
      && String(routingCenterResultAction).indexOf("/route") < 0
      && String(routingCenterResultAction).indexOf("routingCalculateRoute") < 0
      && String(routingCenterResultAction).indexOf("routingCompareStart") < 0);
```

Tile GET / elevation GET **non** sono nel criterio (non classificati come routing POST).

---

## 6. RAW — RETE / OPSEC / INVARIANTI DEL DELTA

Diff `105bedf..4a6dca9` (un solo file HTML, +182/−64). Scansione:

| Invariante | Nel delta FIX2 |
| --- | --- |
| Endpoint nuovi (`8989`, `tailc01234`, `/ors/`, `fetch(`) | **assenti** |
| `Authorization` / `ORS_API_KEY` | **0** occorrenze |
| `api.openrouteservice` | solo assert selftest preesistente `indexOf(...) < 0` |
| Auto GH Local→VPS / `ROUTING_GRAPHHOPPER_ENDPOINT` | **nessun hunk** |
| `routingCompareAutoCandidates` | solo assert `indexOf("ors") < 0` (ORS mai Auto) |
| `forcedOffline` / `opsecStrict` | **0** |
| `getCurrentPosition` / `watchPosition` / `gps` | **0** |
| `state.mapWaypoints` / `state.gisPolygons` | **0** |
| `localStorage` / nuova `STORAGE_KEY` | solo pin build selftest / contesto `coordconv_ui_v1` **non** cambiato |
| Oggetti GIS | **non toccati** |

Gateway ORS e GH Auto restano fuori dallo scope FIX2.

---

## 7. EVIDENCE ESISTENTE (non rieseguita)

Puntatore: [`2026-08-18_1635_outdoor-routing-f-provider-compare-a-fix2.md`](2026-08-18_1635_outdoor-routing-f-provider-compare-a-fix2.md) sul candidate immutabile `4a6dca9`.

| Esito già persistito | Valore |
| --- | --- |
| Selftest globale | **741/741 PASS** |
| Live probes | **28/28 PASS** |
| A GH 1 VIA / B ORS 1 VIA | HTTP 200, 3 pts/coords, no alt |
| C GH 2 VIA / D ORS 2 VIA | HTTP 200, 4 pts/coords, no alt |
| E/F compare VIA | stesso snapshot, entrambi 200 |
| G avoid VIA | GH `custom_model` / ORS `avoid_polygons`, no alt, HTTP 200 |
| H reorder | START→VIA2→VIA1→START, HTTP 200 GH+ORS |
| R zero-VIA | GH `round_trip`+distance+seed / ORS `options.round_trip`, HTTP 200 |
| R 2-point alternatives | GH `alternative_route` / ORS `alternative_routes`, HTTP 200 |

---

## 8. STOP

**REVIEW GPT-SOSTITUTIVA — PENDING** (invariato)

```text
BLOCK:     OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2
GATE:      REVIEW GPT-SOSTITUTIVA — PENDING
CANDIDATE: 4a6dca938057d2c1e2b0f0a2cdec1480c13f3d20
           build 223
           blob 56163b6f4e43e1ea8eec837ba535cd62c4b6c38f
NEXT:      review FIX2 candidate 223
```

FRONTIER / WU-HOT-HEADER: **non modificati**.  
NON deploy. NON ABQA. NON QA operatore. NON finito. NON build bump. NON monolite.
