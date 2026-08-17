# OUTDOOR-ROUTING-F-AVOID-AREAS-A — REVIEW-EVIDENCE-B (scoped)

**BLOCK-ID:** `OUTDOOR-ROUTING-F-AVOID-AREAS-A`  
**PASS:** `REVIEW-EVIDENCE-B-RECOVERY`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (invariato)  
**Verdetto review:** **NON EMETTERE** (evidence-only per GPT sostitutiva)

## Scope diff

| Campo | Valore |
| --- | --- |
| BASE | `1e37e56f04ddb9e7aec2598b398739e7772cec6c` · build **217** |
| CANDIDATE (immutabile) | `12a7477414a311b1650e9b575c89cab6966e240e` · build **218** |
| File toccati | **1** — `coordinate_converter Claude.html` |
| Hunk | **38** |
| Linee | **+647 / −51** (net +596) |
| Blob candidate | `5c25a1fa923fb41f9a82e9cecb9108fa61ba681a` |

### Hunk account per regione

| # | Hunk `@` (BASE line) | Regione | Δ |
| --- | --- | --- | --- |
| 1 | 9813 | CSS `.routing-avoid-*` | +17 |
| 2 | 15140 | HTML `#routingAvoidAreasSection` | +16 |
| 3 | 17647 | i18n IT routing.avoid* | +21 |
| 4 | 19856 | i18n EN routing.avoid* | +21 |
| 5 | 23767 | `APP_BUILD_*` 217→218 | ±4 |
| 6–27 | 39061…48527 | Selftest build counter bump (22 hunks) | ±22×2 |
| 28 | 68838 | `renderTileMap` → overlay hook | +1 |
| 29 | 69382 | Map click → `routingAvoidApplyMapClick` | +14 |
| 30 | 83237 | `routingEnsureState` existing `_routing` | +1 |
| 31 | 83289 | `routingEnsureState` new `_routing` fields | +4 |
| 32 | 84154 | `routingDisarmOtherMapPicks` cleanup | +1 |
| 33 | 84433 | `routingFullCleanup` avoid exit | +1 |
| 34 | 86005 | **Modulo avoid areas** (core) | +495 |
| 35 | 86017 | `routingBuildGraphhopperRoundTripBody` | +1 |
| 36 | 86791 | `routingBuildGraphhopperRouteBody` | +1 |
| 37 | 87454 | `routingCalculateRouteGraphhopper` alternatives gate | ±1 |
| 38 | 90239 | `openRoutingPlannerPanel` wire UI | +2 |
| 39 | 90329 | `wireRoutingPlannerOnce` minimize cleanup | +1 |

*(Git diff riporta 38 hunk totali; tabella raggruppa i 22 micro-hunk selftest build.)*

---

## 1. Session-only — `_routingAvoidSession`

Modulo top-level; **nessun** `localStorage`, **nessun** `IndexedDB`, **nessun** `saveStore` nel diff aggiunto.

```javascript
var _routingAvoidSession = { areas: [], drawActive: false, draft: null, _seq: 0 };
function routingAvoidEnsureSessionFields(r){
  if (!r) return;
  if (!Array.isArray(_routingAvoidSession.areas)) _routingAvoidSession.areas = [];
  r.avoidAreas = _routingAvoidSession.areas;
  r.avoidDrawActive = !!_routingAvoidSession.drawActive;
  r.avoidDraft = _routingAvoidSession.draft;
}
```

Mirror transiente su `state._routing` (riferimenti, non copia persistita):

```javascript
avoidAreas: _routingAvoidSession.areas,
avoidDrawActive: !!_routingAvoidSession.drawActive,
avoidDraft: _routingAvoidSession.draft
```

`routingEnsureState()` chiama `routingAvoidEnsureSessionFields(r)` su path esistente e nuovo.

---

## 2. Draw lifecycle — start / undo / confirm / Esc / cleanup

**Enter draw** — disarma altri pick, attiva `mapToolActivate("routing-avoid-draw")`, cursor crosshair:

```javascript
function routingAvoidEnterDrawMode(){
  const r = routingEnsureState();
  try { routingExitPickMode({ silent: true }); } catch(_){}
  try { routingDisarmOtherMapPicks(); } catch(_){}
  routingAvoidExitDrawMode({ silent: true });
  _routingAvoidSession.drawActive = true;
  _routingAvoidSession.draft = { vertices: [] };
  // … tm.classList.add("routing-avoid-drawing")
  mapToolActivate("routing-avoid-draw", function(){
    try { routingAvoidExitDrawMode({ silent: true }); } catch(_){}
  });
}
```

**Map click** (capture in `attachPanHandlers`, ~69461):

```javascript
if (_routingAvoidSession && _routingAvoidSession.drawActive && !drag.moved && cx != null && cy != null){
  // … mapClientToLatLonMap …
  if (typeof routingAvoidApplyMapClick === "function") routingAvoidApplyMapClick(pickAv.lat, pickAv.lon);
  ev.preventDefault(); ev.stopPropagation();
  return;
}
```

**Undo / confirm / delete / toggle / clear** — mutazioni chiamano `routingAvoidTouchInvalidatePreview()`.

**Esc** — listener capture su `document`:

```javascript
document.addEventListener("keydown", function(ev){
  if (ev.key !== "Escape" && ev.key !== "Esc") return;
  if (!_routingAvoidSession.drawActive) return;
  ev.preventDefault();
  routingAvoidExitDrawMode({});
}, true);
```

**Cleanup integrato** in `routingDisarmOtherMapPicks`, `routingFullCleanup`, minimize panel:

```javascript
try { if (typeof routingAvoidExitDrawMode === "function") routingAvoidExitDrawMode({ silent: true }); } catch(_){}
```

---

## 3. Validazione coordinate / ring / antimeridiano

```javascript
function routingAvoidNormalizeVertex(v){
  // lat/lon finite, lat ∈ [-90,90], lon ∈ [-180,180], normalizeLon(lon)
}
function routingAvoidValidateVertices(vertices, opts){
  // min 3, max 24 verts; distinct count ≥ 3
  // antimeridiano: if (maxLon - minLon > 180) return { ok: false, key: "routing.avoidAntimeridian" };
}
function routingAvoidClosedRingLonLat(vertices){
  // chiude ring GeoJSON [lon,lat] se non già chiuso
}
```

Selftest `RAA_validate_min`, `RAA_validate_ok`, `RAA_antimeridian_fail` coprono fail-closed.

---

## 4. Payload — `custom_model.areas` + `priority` + `ch.disable`

```javascript
function routingBuildAvoidAreasCustomModel(){
  const areas = Object.create(null);
  const priority = [];
  // … per area attiva:
  areas[areaId] = { type: "Feature", geometry: { type: "Polygon", coordinates: [ring] } };
  priority.push({ if: "in_" + areaId, multiply_by: "0" });
  return { custom_model: { areas: areas, priority: priority } };
}
function routingApplyAvoidPayloadToBody(body){
  const payload = routingBuildAvoidAreasCustomModel();
  if (!payload) return body;
  body.custom_model = payload.custom_model;
  body["ch.disable"] = true;
  delete body.algorithm;
  delete body["alternative_route.max_paths"];
  delete body["alternative_route.max_weight_factor"];
  delete body["alternative_route.max_share_factor"];
  return body;
}
```

`ch.disable` impostato **solo** quando avoid attive; round_trip mantiene il proprio `"ch.disable": true` preesistente + merge avoid.

Selftest `RAA_payload_custom_model`: verifica `custom_model.areas`, `ch.disable === true`, assenza `algorithm`.  
Selftest `RAA_payload_no_avoid_clean`: senza aree → nessun `custom_model`, `algorithm === "alternative_route"`.

---

## 5. Routing normale + round_trip

**Route one-way** — body builder invariato salvo wrapper finale:

```javascript
function routingBuildGraphhopperRouteBody(profile, pointsLonLat, opts){
  const body = { profile, points: pointsLonLat, elevation: true, points_encoded: false, instructions: false };
  if (opts.withAlternatives){ body.algorithm = "alternative_route"; /* … */ }
  return routingApplyAvoidPayloadToBody(body);
}
```

**Alternatives disabilitate con avoid attive:**

```javascript
const bodyPrimary = routingBuildGraphhopperRouteBody(profile, snapPts.pointsLonLat, {
  withAlternatives: !isOutAndBack && !routingHasActiveAvoidAreas()
});
```

**Round trip:**

```javascript
function routingBuildGraphhopperRoundTripBody(profile, pointLonLat, distanceM, seed){
  const body = { profile, points: [pointLonLat], algorithm: "round_trip", /* … */, "ch.disable": true, /* … */ };
  return routingApplyAvoidPayloadToBody(body);
}
```

**POST URL invariato** (nessun nuovo path):

```javascript
const ROUTING_GRAPHHOPPER_ROUTE_PATH = "/route";
const url = routeEndpoint + ROUTING_GRAPHHOPPER_ROUTE_PATH;
```

---

## 6. Invalidazione `requestSequence` / `requestController`

Mutazioni avoid → `routingAvoidTouchInvalidatePreview()` → `routingInvalidateRoutePreview()`:

```javascript
function routingInvalidateRoutePreview(){
  try { if (state._routing.requestController) state._routing.requestController.abort(); } catch(_){}
  state._routing.requestSequence = (state._routing.requestSequence || 0) + 1;
  state._routing.requestController = null;
  // … clear preview state …
}
```

Chiamato da: `routingAvoidConfirmDraft`, `routingAvoidDeleteArea`, `routingAvoidToggleArea`, `routingAvoidClearAll`.

Calcolo route mantiene pattern esistente: abort controller, increment seq, gate pre/post snap (`routingNetworkGateGraphhopper`).

---

## 7. CRUD aree — add / delete / toggle / clear

| Azione | Funzione | Effetto |
| --- | --- | --- |
| Add (confirm draft) | `routingAvoidConfirmDraft` | push su `_routingAvoidSession.areas`, exit draw, invalidate |
| Delete | `routingAvoidDeleteArea(id)` | `splice`, invalidate |
| Toggle | `routingAvoidToggleArea(id)` | flip `enabled`, invalidate |
| Clear all | `routingAvoidClearAll()` | `areas.length = 0`, invalidate |

UI lista in `routingSyncAvoidAreasUi()` con bottoni Enable/Disable, Center, Delete.

---

## 8. Rete / OPSEC

### Delta rete nel diff

| Controllo | Esito diff `1e37e56..12a7477` |
| --- | --- |
| Nuovi endpoint | **0** — solo `ROUTING_GRAPHHOPPER_ROUTE_PATH = "/route"` (preesistente, citato non modificato) |
| Nuove `fetch(` | **0** linee aggiunte con `fetch(` |
| Nuove XHR / WebSocket / EventSource | **0** |
| Chiamate al boot | **0** — modulo avoid wire-on-demand in `openRoutingPlannerPanel` |
| `routingNetworkGateGraphhopper` | **non modificato** nel diff |
| `opsecStrict` | gate linea 85874: `if (state.opsecStrict) return { ok: false, errKey: "routing.errorOpsec" };` — invariato |
| `forceOffline` | gate linee 85876–85890 — invariato; VPS bloccato, loopback solo con consent |

### Gate pre-fetch (path invariato)

`routingCalculateRouteGraphhopper` e `routingCalculateRoundTripGraphhopper` invocano **prima** di qualsiasi `fetch`:

```javascript
const gate0 = routingNetworkGateGraphhopper({ provider: selectedProvider });
if (!gate0.ok){ /* return — nessun POST */ }
```

Re-gate post-snap (~88025): stessa funzione, stesso contratto.

Payload avoid = **arricchimento body POST esistente** su azione utente «Calcola»; nessuna rete silenziosa.

---

## 9. Prova tecnica minima (static + selftest)

| Scenario | Evidenza |
| --- | --- |
| **forced-offline → zero POST /route** | `routingNetworkGateGraphhopper`: se `state.forceOffline` e provider `vps` → `{ ok: false }`; calcolo esce a `gate0` / `gateAfterSnap` **prima** di `postRouteBody`/`fetch`. Nessuna bypass nel diff avoid. |
| **Routing senza avoid → path preesistente** | `routingApplyAvoidPayloadToBody(body)` ritorna `body` unchanged se `routingBuildAvoidAreasCustomModel()` null. Selftest `RAA_payload_no_avoid_clean`: `!b2.custom_model && b2.algorithm === "alternative_route"`. |
| **Routing con avoid → stesso `/route`** | URL construction invariata; body arricchito con `custom_model` + `ch.disable`. Selftest `RAA_payload_custom_model` PASS. |

Selftest aggregato candidate: **644/644 PASS** (+7 `RAA_*`); `node --check` OK (da evidence candidate A).

---

## 10. Invarianti

| Invariante | Verifica diff / runtime |
| --- | --- |
| `state.mapWaypoints[]` | **0** occorrenze modificate nel diff |
| `state.gisPolygons` | **0** scritture; solo read in selftest `RAA_gis_polygons_untouched` |
| `state.gisTracks[]` / `state.gisLayers[]` | **0** tocchi nel diff |
| Oggetti GIS | **UNTOUCHED** — overlay dedicato `routing-avoid-areas-overlay`, non layer GIS |
| Persistenza | `_routingAvoidSession` module var; non in `STORAGE_KEY`/`saveStore` path |
| GPS | **0** `getCurrentPosition` / `watchPosition` aggiunti |
| Helper | **0.1.3** (FRONTIER LIVE STATE; monolite non bumpa helper) |

---

## 11. UI / overlay (supplemento evidence)

- Sezione `#routingAvoidAreasSection` nel pannello routing planner.
- Overlay SVG `routingSyncAvoidAreasOverlay` invocato da `renderTileMap` (stesso pattern altri overlay mappa).
- Wire once: `routingWireAvoidAreasOnce()` da `openRoutingPlannerPanel`.

---

## Riferimenti

- Evidence candidate A: [`2026-08-18_0105_outdoor-routing-f-avoid-areas-a-evidence.md`](2026-08-18_0105_outdoor-routing-f-avoid-areas-a-evidence.md)
- LIVE STATE: [`docs/FRONTIER.md`](../../FRONTIER.md) — gate **REVIEW GPT-SOSTITUTIVA — PENDING**
- WU: [`docs/work-units/WU-0010-outdoor-routing-graphhopper.md`](../../work-units/WU-0010-outdoor-routing-graphhopper.md)

**NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito · **NON** verdetto review
