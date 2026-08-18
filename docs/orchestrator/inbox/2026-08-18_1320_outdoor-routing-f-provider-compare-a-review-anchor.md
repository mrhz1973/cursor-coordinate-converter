# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A — REVIEW-ANCHOR + RAW

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A`  
**PASS:** `REVIEW-ANCHOR-AND-RAW-RECOVERY`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (invariato)  
**Verdetto review:** **NON EMETTERE** (evidence-only per GPT sostitutiva)  
**Deploy / ABQA / QA operatore / finito / build bump / monolite:** **NON ESEGUITI**

Fonte blob: `git cat-file -p 90c52d57f58ec49af91bf0364e2fe7c8aa5ece3b`  
Commit runtime: `git log -1 --format=%H -- "coordinate_converter Claude.html"`

---

## 1. Anchor — RUNTIME_CANDIDATE_SHA

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `1a5e971459f13b12ed303f1e7105998db774b3bf` |
| Subject | `feat(routing): opt-in GraphHopper vs ORS compare, candidate build 221` |
| Parent | `9e811d58668067ae48ce40f44d9466a3953040e2` (docs ORS CLOSED; **non** runtime 220) |
| LIVE runtime (build 220) | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` |
| `APP_BUILD_NUM` | **221** |
| `APP_BUILD_ID` | `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A` |
| Blob git monolite | `90c52d57f58ec49af91bf0364e2fe7c8aa5ece3b` |
| Bytes LF | `10605066` |
| SHA-256 LF | `72a8ed2456baea53994b18635fa4b967c89b1a11dc6861bbe2b9ca10ab80f01f` |
| Helper | **0.1.3** (invariato) |
| Candidate immutabile | **SÌ** — questo pass **non** riscrive il monolite |

Verifica `APP_BUILD_*` nel blob candidate:

```javascript
const APP_BUILD_ID = "OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A";
const APP_BUILD_DETAIL = "Opt-in GraphHopper vs OpenRouteService comparison in Routing planner.";
const APP_BUILD_NUM = 221;
```

```text
git rev-parse 1a5e971459f13b12ed303f1e7105998db774b3bf:"coordinate_converter Claude.html"
90c52d57f58ec49af91bf0364e2fe7c8aa5ece3b
```

**NON** usare HEAD / current container / self-reference come anchor del runtime.

## 2. REMOTE_HEAD_AT_EVIDENCE_TIME (separato)

Attestazione **prima** del commit docs di questo recovery:

```text
git ls-remote origin refs/heads/main
1a5e971459f13b12ed303f1e7105998db774b3bf	refs/heads/main
```

**REMOTE_HEAD_AT_EVIDENCE_TIME** = `1a5e971459f13b12ed303f1e7105998db774b3bf`

Un successivo commit docs-only può rendere `origin/main` diverso: **non** cambia `RUNTIME_CANDIDATE_SHA`.

Diff monolite vs pre-task HEAD `9e811d5` (stesso HTML del LIVE 220):

```text
git diff --stat 9e811d58668067ae48ce40f44d9466a3953040e2 1a5e971459f13b12ed303f1e7105998db774b3bf -- "coordinate_converter Claude.html"
 coordinate_converter Claude.html | 881 ++++++++++++++++++++++++++++++++++++---
 1 file changed, 834 insertions(+), 47 deletions(-)
```

---

## 3. RAW REVIEW EVIDENCE (dal blob candidate)

### A. CTA esplicita / nessun boot-auto-start

Chiamate `routingCompareStart(` nel monolite: **2** — definizione della funzione + listener click `#routingCompareBtn`. Nessuna chiamata a boot / open planner / cambio provider.

```html
<button type="button" id="routingCompareBtn" class="btn btn-sm" data-i18n="routing.compareRun"
        data-i18n-tip="tip.routingCompare" data-i18n-aria="tip.routingCompare">Confronta GraphHopper e OpenRouteService</button>
```

```javascript
function routingWireCompareOnce(){
  if (routingWireCompareOnce._done) return;
  routingWireCompareOnce._done = true;
  const btn = document.getElementById("routingCompareBtn");
  if (btn) btn.addEventListener("click", function(ev){
    ev.preventDefault();
    if (btn.disabled) return;
    routingCompareStart();
  });
```

`startedAt` resta `0` finché non parte `routingCompareStart`. Calcola abortisce il confronto, non lo avvia:

```javascript
function routingCalculateRoute(){
  try { routingCompareAbortInFlight({ clearResults: true }); } catch(_){}
  if (routingIsOrsService()) return routingCalculateRouteOrs();
  return routingCalculateRouteGraphhopper();
}
```

### B. Profile mapping + fail unmapped

```javascript
const ROUTING_COMPARE_PROFILE_PAIRS = Object.freeze([
  Object.freeze({ gh: "hiking", ors: "foot-hiking" }),
  Object.freeze({ gh: "mtb_trail", ors: "cycling-mountain" })
]);
function routingComparePairForProfile(service, profile){
  const svc = service === "ors" ? "ors" : "graphhopper";
  const cur = String(profile || "");
  for (let i = 0; i < ROUTING_COMPARE_PROFILE_PAIRS.length; i++){
    const p = ROUTING_COMPARE_PROFILE_PAIRS[i];
    if (svc === "ors" && p.ors === cur) return { ok: true, pair: p, current: cur };
    if (svc !== "ors" && p.gh === cur) return { ok: true, pair: p, current: cur };
  }
  return { ok: false, current: cur, service: svc };
}
```

Start fail-closed se non mappato (nessun profilo sostitutivo):

```javascript
  const pairRes = routingCompareResolveProfilePair();
  if (!pairRes.ok){
    routingSyncCompareUi();
    return;
  }
```

UI:

```javascript
    if (!pairRes.ok){
      note.textContent = routingT("routing.compareNotComparable", "Profilo non confrontabile fra GraphHopper e OpenRouteService.");
```

Selftest unmapped:

```javascript
add("RPC_hiking_easy_block", routingComparePairForProfile("graphhopper", "hiking_easy").ok === false);
add("RPC_walking_block", routingComparePairForProfile("ors", "foot-walking").ok === false);
add("RPC_mtb_touring_block", routingComparePairForProfile("graphhopper", "mtb_touring").ok === false);
```

**Finding documentato:** `hiking_easy`, `mtb_touring`, `foot-walking` non hanno coppia semantica reale.

Auto GH non include ORS:

```javascript
function routingCompareAutoCandidates(){
  if (state.forceOffline) return ["local"];
  return ["local", "vps"];
}
async function routingCompareResolveGh(controller){
  const selected = routingProviderNormalize(r && r.provider);
  const candidates = selected === "auto" ? routingCompareAutoCandidates() : [selected];
  // ...
    if (cand === "ors") continue;
```

### C. Snapshot input immutabile

Punti da `state._routing.points` (clone), **non** da `state.mapWaypoints[]`. Avoid clone da session avoid, **non** `state.gisPolygons`.

```javascript
function routingCompareClonePointsForMode(mode){
  const r = state._routing;
  const src = (r && Array.isArray(r.points)) ? r.points : [];
  // round_trip: solo punto 0; altrimenti tutti i punti in ordine
}
function routingCompareFingerprint(snap){
  return JSON.stringify({
    mode: snap.mode,
    gh: snap.pair && snap.pair.gh,
    ors: snap.pair && snap.pair.ors,
    dist: snap.roundTripDistanceM,
    seed: snap.roundTripSeed,
    ghProvider: snap.ghProvider,
    pts: snap.points,
    avoid: snap.avoid
  });
}
```

```javascript
  const snap = {
    mode: mode,
    pair: { gh: pairRes.pair.gh, ors: pairRes.pair.ors },
    roundTripDistanceM: routingClampRoundTripDistanceM(r.roundTripDistanceM),
    roundTripSeed: r.roundTripSeed,
    ghProvider: routingProviderNormalize(r.provider),
    points: points,
    avoid: routingCompareCloneAvoid(),
    fingerprint: ""
  };
  snap.fingerprint = routingCompareFingerprint(snap);
  // dopo await:
  if (routingCompareLiveFingerprint() !== snap.fingerprint){
    routingCompareAbortInFlight({ clearResults: true });
    return;
  }
```

### D. Controller + sequence isolati, stale

```javascript
var _routingCompareSession = {
  sequence: 0,
  loading: false,
  controllers: { gh: null, ors: null },
  snapshot: null, gh: null, ors: null, chosen: null, startedAt: 0
};
function routingCompareAbortInFlight(opts){
  try { if (_routingCompareSession.controllers.gh) _routingCompareSession.controllers.gh.abort(); } catch(_){}
  try { if (_routingCompareSession.controllers.ors) _routingCompareSession.controllers.ors.abort(); } catch(_){}
  _routingCompareSession.sequence = (_routingCompareSession.sequence || 0) + 1;
  // ...
}
```

```javascript
  const ghCtrl = new AbortController();
  const orsCtrl = new AbortController();
  _routingCompareSession.controllers = { gh: ghCtrl, ors: orsCtrl };
  const ghP = routingCompareRunGh(snap, ghCtrl, seq)...
  const orsP = routingCompareRunOrs(snap, orsCtrl, seq)...
  if (seq !== _routingCompareSession.sequence) return;
  if (ghRes && !ghRes.stale && !ghRes.aborted) _routingCompareSession.gh = ghRes;
  if (orsRes && !orsRes.stale && !orsRes.aborted) _routingCompareSession.ors = orsRes;
```

GH e ORS non si sovrascrivono: slot `.gh` / `.ors` distinti. Stale in-run: `if (seq !== _routingCompareSession.sequence) return { stale: true };`

### E. forcedOffline / opsecStrict

Gate **esistenti** riusati, non aggirati.

```javascript
function routingNetworkGateGraphhopper(opts){
  if (state.opsecStrict) return { ok: false, errKey: "routing.errorOpsec" };
  if (state.forceOffline){
    const consent = routingLoopbackAllowedInForcedOffline();
    if (provider === "vps") return { ok: false, errKey: "routing.errorOffline" };
    if (provider === "local"){
      if (!consent) return { ok: false, errKey: "routing.errorLoopbackConsent" };
      return { ok: true };
    }
    if (provider === "auto"){
      if (!consent) return { ok: false, errKey: "routing.errorLoopbackConsent" };
      return { ok: true };
    }
    // ...
  }
}
function routingNetworkGateOrs(){
  if (state.opsecStrict) return { ok: false, errKey: "routing.errorOpsec" };
  if (state.forceOffline) return { ok: false, errKey: "routing.errorOffline" };
  // ...
}
```

Applicazione nel compare:

```javascript
async function routingCompareRunGh(snap, controller, seq){
  const gate0 = routingNetworkGateGraphhopper({ provider: snap.ghProvider });
  if (!gate0.ok) return routingComparePackFail(gate0.errKey);
  // ...
  const gateEp = routingNetworkGateGraphhopper({ provider: resolved.provider, endpoint: resolved.endpoint });
  if (!gateEp.ok) return routingComparePackFail(gateEp.errKey);
}
async function routingCompareRunOrs(snap, controller, seq){
  const gate0 = routingNetworkGateOrs();
  if (!gate0.ok) return routingComparePackFail(gate0.errKey);
```

Policy change abortisce il confronto in-flight (niente update tardivo):

```javascript
function routingOnNetworkPolicyChange(){
  if (!state._routing) return;
  try { routingSearchResetAll(); } catch(_){}
  try { routingCompareAbortInFlight({ clearResults: true }); } catch(_){}
```

ORS: fail-closed su opsec e forcedOffline. GH: loopback solo con consenso esistente.

### F. PARTIAL RESULT

Assegnazione indipendente, nessun fallback dall’uno all’altro:

```javascript
  if (ghRes && !ghRes.stale && !ghRes.aborted) _routingCompareSession.gh = ghRes;
  else if (ghRes && ghRes.aborted) _routingCompareSession.gh = routingComparePackFail("routing.errorGeneric");
  if (orsRes && !orsRes.stale && !orsRes.aborted) _routingCompareSession.ors = orsRes;
  else if (orsRes && orsRes.aborted) _routingCompareSession.ors = routingComparePackFail("routing.errorGeneric");
```

```javascript
    else if (gh && ors && gh.status === "pass" && ors.status === "pass")
      status.textContent = routingT("routing.compareComplete", "Confronto completato (nessun provider dichiarato migliore).");
    else if ((gh && gh.status === "pass") || (ors && ors.status === "pass"))
      status.textContent = routingT("routing.comparePartial", "Confronto parziale: un provider non ha prodotto un percorso.");
```

Fail colonna: `Errore: ` + `routingT(pack.errKey)`. Nessun retry loop nel compare.

### G. VIEW CONFRONTO (campi + delta, nessun ranking)

Formato colonna PASS (`routingCompareFmtPack`):

```javascript
  bits.push(routingT("routing.distance", "Distanza") + ": " + routingFmtRouteDistanceForUnit(m.distanceM));
  bits.push(routingT("routing.duration", "Tempo stimato") + ": " + routingFmtDurationMs(m.durationMs));
  bits.push(routingT("routing.ascent", "Dislivello positivo") + ": " + (Number.isFinite(m.ascentM) ? routingFmtAltitudeForUnit(m.ascentM) : "—"));
  bits.push(routingT("routing.difficultyLabel", "Difficoltà stimata") + ": " + diff);
```

GH body: stato OK/Errore + **provider effettivo** `gh.provider` + fmt pack.  
ORS body: stato OK/Errore + `ORS` + fmt pack.

Delta solo se entrambi PASS:

```javascript
      const dDist = routingCompareDelta(gh, ors, "distanceM");
      const dTime = routingCompareDelta(gh, ors, "durationMs");
      const dAsc = routingCompareDelta(gh, ors, "ascentM");
      // "Δ Distanza (GH−ORS)" / tempo / dislivello — segno GH+ o ORS+, non "migliore"
```

```html
<p class="hint" data-i18n="routing.compareNoRank">Il confronto non dichiara un provider migliore.</p>
```

```javascript
status ... "Confronto completato (nessun provider dichiarato migliore)."
```

Difficoltà: `routingComputeDifficulty` nel pack (`routingComparePackFromValidated`).

### H. MAPPA — entrambi i tracciati contemporanei

Collector: se non c’è `chosen`, push **entrambi** i PASS nello stesso array:

```javascript
function routingCompareOverlayTracks(){
  if (_routingCompareSession.chosen) return null;
  const out = [];
  if (_routingCompareSession.gh && _routingCompareSession.gh.status === "pass" && Array.isArray(_routingCompareSession.gh.previewCoordinates))
    out.push({ id: "gh", pts: _routingCompareSession.gh.previewCoordinates });
  if (_routingCompareSession.ors && _routingCompareSession.ors.status === "pass" && Array.isArray(_routingCompareSession.ors.previewCoordinates))
    out.push({ id: "ors", pts: _routingCompareSession.ors.previewCoordinates });
  return out.length ? out : null;
}
```

Render: rimuove overlay precedente, poi **un** SVG con **loop su tutti** i track (GH e ORS insieme), classi distinte, poi `return` (niente preview canonica mescolata):

```javascript
  const old = tileMap.querySelector(".routing-route-preview-overlay");
  if (old) old.remove();
  const cmpTracks = ... routingCompareOverlayTracks();
  if (cmpTracks && cmpTracks.length){
    // ... un wrapC / un svgC ...
    for (let ti = 0; ti < cmpTracks.length; ti++){
      const tr = cmpTracks[ti];
      lineC.setAttribute("class", "routing-route-preview-line is-compare-" + (tr.id === "ors" ? "ors" : "gh"));
      svgC.appendChild(lineC);
    }
    wrapC.appendChild(svgC);
    tileLayerC.appendChild(wrapC);
    return;
  }
```

CSS distinguibile:

```css
.routing-route-preview-line.is-compare-gh{ stroke:#ef4444; stroke-width:3; stroke-dasharray:none; }
.routing-route-preview-line.is-compare-ors{ stroke:#2563eb; stroke-width:3; stroke-dasharray:7 5; }
```

Legenda UI: `GraphHopper: linea rossa continua · OpenRouteService: linea blu tratteggiata`.

Cleanup / no ghost:

- overlay: `old.remove()` prima di ridisegnare;
- invalidate input → `routingCompareOnInputInvalidated` → abort+clear + `refreshTileMapForTrackUi`;
- close: `routingFullCleanup` chiama `routingCompareAbortInFlight({ clearResults: true })`;
- choose setta `chosen` → `routingCompareOverlayTracks()` torna `null` → overlay compare non ridisegnato, preview canonica unica.

Invalidate:

```javascript
function routingInvalidateRoutePreview(){
  // ...
  try { routingCompareOnInputInvalidated(); } catch(_){}
  try { routingRemoveRoutePreviewOverlay(); } catch(_){}
```

Nessuna scrittura GIS: overlay è DOM temporaneo su `.tile-layer`; choose usa solo `routingApplyRouteResultFromValidated` (preview in `state._routing`).

### I. CHOOSE RESULT

```html
<button type="button" id="routingCompareChooseGh" ...>Usa risultato GraphHopper</button>
<button type="button" id="routingCompareChooseOrs" ...>Usa risultato OpenRouteService</button>
```

```javascript
function routingCompareChoose(side){
  const pack = side === "ors" ? _routingCompareSession.ors : _routingCompareSession.gh;
  if (!pack || pack.status !== "pass") return;
  r.service = side === "ors" ? "ors" : "graphhopper";
  // sync profile select + prefs
  routingApplyRouteResultFromValidated(r, validated, pack.profile);
  _routingCompareSession.chosen = side === "ors" ? "ors" : "gh";
}
```

Riuso path preview / profilo / save-track esistente. Nessuna logica storage duplicata.

### J. Alternative / Andata-Ritorno / Anello / avoid

Stesso `snap.mode` e stesso `snap.avoid` per entrambi i runner.

| Mode | GH | ORS |
| --- | --- | --- |
| `round_trip` | `routingBuildGraphhopperRoundTripBody(profile, start, dist, seed)` | `routingBuildOrsRoundTripBody(start, dist, seed)` |
| `out_and_back` | due POST `withAlternatives: false` + merge | due POST `withAlternatives: false` + merge |
| default (normale + Alternative) | `routingBuildGraphhopperRouteBody(..., { withAlternatives: true })` | `routingBuildOrsRouteBody(..., { withAlternatives: true })` |

Avoid: `return await routingCompareWithAvoid(snap.avoid, async function(){ ... builders ... })` in **entrambi**. Nessun branch che sostituisce silenziosamente la modalità. Se gate/profile fail → `routingComparePackFail`, non un altro provider.

### K. Rete

```javascript
const ROUTING_GRAPHHOPPER_ENDPOINT = "http://100.114.7.53:8989";
const ROUTING_GRAPHHOPPER_ENDPOINT_LOCAL = "http://127.0.0.1:8989";
const ROUTING_GRAPHHOPPER_ROUTE_PATH = "/route";
const ROUTING_ORS_GATEWAY_BASE = "https://ubuntu.tailc01234.ts.net";
const ROUTING_ORS_DIRECTIONS_PATH = "/ors/v2/directions";
```

GH compare POST: `resolved.endpoint + ROUTING_GRAPHHOPPER_ROUTE_PATH` via `routingComparePostJson` — headers solo `Content-Type: application/json`.  
ORS: `routingPostOrsDirections` → `routingOrsDirectionsUrl(profile)` — stessi header, **nessun Authorization**.

Conteggi nel blob candidate:

- `api.openrouteservice.org`: **0**
- `ORS_API_KEY`: **2**, entrambi nel **selftest** `RPC_no_api_key` (`indexOf("ORS_API_KEY") < 0`) — non una chiave
- `setInterval` nel modulo compare: **0**
- nessun polling/prefetch; timeout singolo per fetch (`setTimeout` abort)

### L. Storage / GIS / GPS

```javascript
const STORAGE_KEY = "coordconv_v2";
```

Modulo compare: `localStorage` solo in asserzioni selftest (`indexOf("localStorage") < 0` su Start/Choose). Nessuna nuova chiave.  
`mapWaypoints` / `gisPolygons` nel modulo: solo selftest di non-uso / count invariato. Clone punti da `state._routing.points`.  
`getCurrentPosition` / `watchPosition` nel modulo compare: **0**.

---

## 4. Selftest già eseguiti (non rieseguiti)

`GOIDflight.selfTest()` sul candidate: **679/679 PASS** (30 `RPC_*`) — evidence precedente [`2026-08-18_1259_outdoor-routing-f-provider-compare-a-evidence.md`](2026-08-18_1259_outdoor-routing-f-provider-compare-a-evidence.md). Questo pass **non** riapre il browser.

## 5. STOP

Nessuna modifica runtime. Nessun nuovo test browser. Gate resta **REVIEW GPT-SOSTITUTIVA — PENDING**.
