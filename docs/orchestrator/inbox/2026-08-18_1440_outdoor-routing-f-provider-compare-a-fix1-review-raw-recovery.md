# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1 — REVIEW-RAW-RECOVERY

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1`  
**PASS:** `REVIEW-RAW-RECOVERY`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (invariato; FRONTIER / WU-HOT-HEADER **non** toccati)  
**Verdetto review:** **NON EMETTERE** (evidence-only per GPT sostitutiva)  
**Deploy / ABQA / QA operatore / finito / build bump / monolite:** **NON ESEGUITI**

Fonte blob: `git cat-file -p 99233802af29998ee3c0c659d72ffa9db6bbe100`  
Commit runtime: `git log -1 --format=%H -- "coordinate_converter Claude.html"`  
Linee citate = blob candidate **222** (working tree HTML identico a `105bedf`; nessun `M` sul monolite).

---

## 1. Anchor — RUNTIME_CANDIDATE_SHA

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `105bedf3c0fa4f15f1be0edf4929d19e8842235b` |
| Subject | `feat(routing): compare UX polish and constrained Anello vias, build 222` |
| Parent | `3dce0978302d79f1dedcc52dde82f68afd76b148` (docs; **non** runtime LIVE) |
| LIVE runtime (build 220) | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` |
| `APP_BUILD_NUM` | **222** |
| `APP_BUILD_ID` | `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1` |
| Blob git monolite | `99233802af29998ee3c0c659d72ffa9db6bbe100` |
| Bytes LF | `10631301` |
| SHA-256 LF | `fb76c7fff6d08b15bce236d52a72e0cf367e2abed5ad1c3456b50b0217891eba` |
| Helper | **0.1.3** (invariato; FRONTIER LIVE) |
| Candidate immutabile | **SÌ** — questo pass **non** riscrive il monolite |

Verifica `APP_BUILD_*` nel blob candidate (`coordinate_converter Claude.html` 23982–23985):

```javascript
const APP_BUILD_ID = "OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1";
const APP_BUILD_DETAIL = "Compare UX polish + constrained Anello via waypoints (FIX1).";
const APP_BUILD_NUM = 222;
```

```text
git rev-parse 105bedf3c0fa4f15f1be0edf4929d19e8842235b:"coordinate_converter Claude.html"
99233802af29998ee3c0c659d72ffa9db6bbe100
```

**NON** usare HEAD / current container / self-reference come sostituto di `RUNTIME_CANDIDATE_SHA`.

HEAD locale al momento dell’anchor (docs container post-FIX1, **non** il candidate runtime):

```text
git rev-parse HEAD
068a6553eadda2d5add38e6d218fec0a93d2dffc
```

## 2. REMOTE_HEAD_AT_EVIDENCE_TIME (separato)

Attestazione **prima** del commit docs di questo recovery:

```text
git ls-remote origin refs/heads/main
068a6553eadda2d5add38e6d218fec0a93d2dffc	refs/heads/main
```

**REMOTE_HEAD_AT_EVIDENCE_TIME** = `068a6553eadda2d5add38e6d218fec0a93d2dffc`

Un successivo commit docs-only può rendere `origin/main` diverso: **non** cambia `RUNTIME_CANDIDATE_SHA`.

---

## 3. RAW — LEGENDA COMPARE

### Overlay mappa solo con compare attivo (track PASS, non scelto)

`routingCompareOverlayTracks` (88982–88989): overlay **null** se `chosen`; altrimenti solo pack `status === "pass"`.

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

`routingSyncCompareMapLegend` (89035–89070): **mostra** solo se `tracks.length`; altrimenti `routingRemoveCompareMapLegend()`. Un solo nodo `#routingCompareMapLegend`. `pointer-events:none` sul CSS overlay.

```javascript
function routingRemoveCompareMapLegend(){
  try {
    const el = document.getElementById("routingCompareMapLegend");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  } catch(_){}
}
function routingSyncCompareMapLegend(){
  const tracks = (typeof routingCompareOverlayTracks === "function") ? routingCompareOverlayTracks() : null;
  const show = !!(tracks && tracks.length);
  if (!show){
    routingRemoveCompareMapLegend();
    return;
  }
  // ... crea #routingCompareMapLegend con swatch GH + ORS, append su #miniMap .tile-map
}
```

### Swatch: GH rosso continuo / ORS blu tratteggiato (oltre al solo colore)

CSS 9860–9862 + polilinee 9886–9887:

```css
.routing-swatch{ display:inline-block; width:28px; height:0; border-top-width:3px; flex:0 0 auto; }
.routing-swatch-gh{ border-top-style:solid; border-top-color:#ef4444; }
.routing-swatch-ors{ border-top-style:dashed; border-top-color:#2563eb; }
.routing-route-preview-line.is-compare-gh{ stroke:#ef4444; stroke-width:3; stroke-dasharray:none; }
.routing-route-preview-line.is-compare-ors{ stroke:#2563eb; stroke-width:3; stroke-dasharray:7 5; }
```

Overlay CSS 9870–9876: `position:absolute; right:8px; bottom:8px; … pointer-events:none`.

Render overlay (90265–90273) usa classi `is-compare-gh` / `is-compare-ors`; poi `routingSyncCompareMapLegend()`. Se **non** overlay compare: `routingRemoveCompareMapLegend()` (90278) e preview canonica.

### Cleanup choose / invalidate / close — nessun ghost DOM

| Evento | Path |
| --- | --- |
| Choose | `routingCompareChoose` set `chosen` (89273) → `refreshTileMapForTrackUi` → overlay null → legend remove. Selftest `RPCF1_legend_choose_gone`. |
| Invalidate | `routingInvalidateRoutePreview` (84240) → `routingCompareOnInputInvalidated` (89277–89279) → `routingCompareAbortInFlight({ clearResults: true })` → `routingSyncCompareMapLegend` (88661). Overlay remove chiama `routingRemoveCompareMapLegend` (83775). |
| Close panel | `closeRoutingPlannerPanel` → `routingFullCleanup` → `routingCompareAbortInFlight({ clearResults: true })` (84720) + `routingRemoveRoutePreviewOverlay` (84723 → 83775). |
| Abort in-flight | 88647–88663 abort entrambi i controller, clear results, sync legend. |

`getElementById` + `parentNode.removeChild`: un solo ID, nessun clone residuo.

### Legenda equivalente in sezione confronto

HTML 15268–15278: stessi swatch-class + nomi provider; nota no-rank.

```html
<ul id="routingCompareLegend" class="routing-compare-legend-list" …>
  <li>… <span class="routing-swatch routing-swatch-gh"> … GraphHopper</li>
  <li>… <span class="routing-swatch routing-swatch-ors"> … OpenRouteService</li>
</ul>
<p class="hint" data-i18n="routing.compareNoRank">Il confronto non dichiara un provider migliore.</p>
```

---

## 4. RAW — CTA / PULSANTI / LEGGIBILITÀ

CTA `#routingCompareBtn` **primary blu esistente** (15246–15247 + `.btn-primary` 4298–4301):

```html
<button type="button" id="routingCompareBtn" class="btn btn-sm btn-primary" data-i18n="routing.compareRun"
        data-i18n-tip="tip.routingCompare" data-i18n-aria="tip.routingCompare">Confronta GraphHopper e OpenRouteService</button>
```

```css
.btn-primary{
  background:var(--gradient-btn); color:#fff; border-color:transparent;
  box-shadow:0 8px 20px rgba(59,130,246,0.3);
```

Chiamate `routingCompareStart(`: **2** — definizione 89185 + click 89288. Nessun boot-auto.

«Usa risultato GraphHopper / OpenRouteService» stile GH/ORS (15263–15266 + CSS 9863–9868):

```html
<button type="button" id="routingCompareChooseGh" class="btn btn-sm routing-compare-choose-gh" disabled
        data-i18n="routing.compareChooseGh">Usa risultato GraphHopper</button>
<button type="button" id="routingCompareChooseOrs" class="btn btn-sm routing-compare-choose-ors" disabled
        data-i18n="routing.compareChooseOrs">Usa risultato OpenRouteService</button>
```

```css
#routingCompareChooseGh.routing-compare-choose-gh{ background:#b91c1c; color:#fff; border-color:transparent; }
#routingCompareChooseOrs.routing-compare-choose-ors{ background:#1d4ed8; color:#fff; border-color:transparent; }
```

Gerarchia heading / metriche / delta (9849–9855, 9878–9884, HTML 15243–15261):

```css
.routing-compare-col.is-gh .routing-compare-provider-heading{ color:#b91c1c; }
.routing-compare-col.is-ors .routing-compare-provider-heading{ color:#1d4ed8; }
.routing-compare-metric-label{ color:var(--muted); font-weight:500; }
.routing-compare-metric-value{ font-weight:700; text-align:right; }
.routing-compare-delta{ font-weight:600; }
#routingPlannerPanel .routing-section-heading{ font-size:.88rem; font-weight:700; color:var(--fg, inherit); }
```

Nessun ranking: copy `routing.compareNoRank` / `routing.compareComplete` (17848, 17853, 89160). Delta è differenza numerica GH−ORS, non winner.

---

## 5. RAW — CENTRA RISULTATO

Wiring (15145–15146 + 92842–92849):

```html
<button type="button" id="routingCenterResultBtn" class="btn btn-sm" disabled
        data-i18n="routing.centerResult" …>Centra risultato</button>
```

```javascript
const centerBtn = document.getElementById("routingCenterResultBtn");
if (centerBtn && !centerBtn._routingCenterBound){
  centerBtn._routingCenterBound = true;
  centerBtn.addEventListener("click", function(ev){
    ev.preventDefault();
    if (centerBtn.disabled) return;
    routingCenterResultAction();
  });
}
```

Funzioni complete (89072–89105):

```javascript
function routingCompareCombinedPreviewCoordinates(){
  const tracks = routingCompareOverlayTracks();
  if (!tracks || !tracks.length) return null;
  const all = [];
  for (let i = 0; i < tracks.length; i++){
    const pts = tracks[i] && tracks[i].pts;
    if (!Array.isArray(pts)) continue;
    for (let j = 0; j < pts.length; j++){
      if (pts[j] && Number.isFinite(pts[j].lat) && Number.isFinite(pts[j].lon)) all.push(pts[j]);
    }
  }
  return all.length >= 2 ? all : null;
}
function routingCenterResultHasGeometry(){
  const combined = routingCompareCombinedPreviewCoordinates();
  if (combined) return true;
  const r = state._routing;
  return !!(r && Array.isArray(r.previewCoordinates) && r.previewCoordinates.length >= 2);
}
function routingSyncCenterResultBtnUi(){
  const btn = document.getElementById("routingCenterResultBtn");
  if (!btn) return;
  const busy = !!(state._routing && (state._routing.requestLoading || state._routing.infoLoading));
  btn.disabled = busy || !routingCenterResultHasGeometry();
}
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

| Caso | Comportamento |
| --- | --- |
| **A dual PASS** | overlay 2 track → `combined` = unione punti GH+ORS → bbox combinato |
| **B partial** | overlay solo pack PASS (`RPCF1_center_partial` length === 1) → bbox di quel provider |
| **C scelto / preview normale** | `chosen` → overlay null → fallback `state._routing.previewCoordinates` (percorso canonico) |
| **D nessuna geometria** | `HasGeometry` false → `btn.disabled` → click no-op (`if (btn.disabled) return false`) |
| **E rete / dati** | nessuna `fetch`; non muta snapshot/pack/state punti; solo `routingFitMapToRoutePreview` |

Riuso helper viewport-aware esistente `gisMapUsableRect` in `routingFitMapToRoutePreview` (88032–88081):

```javascript
function routingFitMapToRoutePreview(previewCoordinates){
  if (!Array.isArray(previewCoordinates) || previewCoordinates.length < 2) return false;
  // … bbox lat/lon unwrap …
  const root = document.getElementById("miniMap");
  const usable = (typeof gisMapUsableRect === "function") ? gisMapUsableRect(root) : null;
  const vp = (typeof gisMapTileMathViewport === "function")
    ? gisMapTileMathViewport(root)
    : { W: 400, H: 400 };
  // … padFrac 0.12; se usable.w/h validi, usati al posto di vp …
}
```

`gisMapUsableRect` definito 55352 (MAP-CENTER-VIEWPORT-AWARE). Nessun nuovo fitter.

---

## 6. RAW — TITOLI + AREE DA EVITARE

Titoli Routing distinguibili: classe `routing-section-heading` su Profilo (15096), Aree da evitare (15226), Confronto (15245). CSS 9878–9884.

```html
<section id="routingAvoidAreasSection" … aria-labelledby="routingAvoidAreasTitle">
  <div class="routing-avoid-head">
    <span class="routing-avoid-title-wrap">
      <span id="routingAvoidAreasTitle" class="routing-avoid-title routing-section-heading" data-i18n="routing.avoidAreasTitle">Aree da evitare</span>
      <button type="button" id="routingAvoidHelpBtn" class="btn btn-sm btn-ghost routing-help-tip"
              data-i18n-tip="tip.routingAvoidHelp" data-i18n-aria="tip.routingAvoidHelp"
              aria-label="Aiuto aree da evitare">?</button>
```

Tooltip = infrastruttura esistente `data-i18n-tip` → `data-tip` in apply i18n (73592–73595). Nessun `<dialog>` nuovo: unique routing dialog resta `#routingPlannerPanel` (15064). Help è `button` inline.

Lifecycle −/× invariato (15068–15071):

```html
<button type="button" data-role="routingpanel-minimize" class="app-modal-min-btn"
        data-i18n-tip="tip.panelMinimize" …>−</button>
<button type="button" class="app-modal-close" id="routingPlannerPanelClose"
        data-i18n-tip="tip.modalClose" …>×</button>
```

---

## 7. RAW — ANELLO ZERO VIA

Punti visibili = tutti tranne last (B nascosto). Constrained iff `visible.length >= 2` (86244–86253):

```javascript
function routingRoundTripVisiblePoints(r){
  const st = r || state._routing;
  const pts = (st && Array.isArray(st.points)) ? st.points : [];
  if (pts.length <= 1) return pts.slice();
  return pts.slice(0, pts.length - 1);
}
function routingRoundTripIsConstrained(r){
  if (routingGetRouteMode() !== "round_trip") return false;
  return routingRoundTripVisiblePoints(r).length >= 2;
}
```

Zero VIA: visibile = solo START → `constrained === false`.

GH calc (89615–89617): `round_trip && !constrained` → `routingCalculateRoundTripGraphhopper()` storico.

ORS calc (88527): stesso branch → `routingCalculateRoundTripOrs()`.

Body storici:

```javascript
// routingBuildGraphhopperRoundTripBody 86850–86862
algorithm: "round_trip",
"round_trip.distance": Math.round(Number(distanceM)),
"round_trip.seed": (Number(seed) >>> 0) || 1,
return routingApplyAvoidPayloadToBody(body);

// routingBuildOrsRoundTripBody 88199–88212
options: { round_trip: { length: …, points: 3, seed: … } }
return routingApplyAvoidPayloadToOrsBody(body);
```

Distanza/seed restano nel body RT. Avoid resta applicato (`custom_model` / `avoid_polygons`). Compare: `snap.mode === "round_trip" && !snap.constrainedLoop` usa gli stessi builder (88862–88868, 88924–88930).

---

## 8. RAW — ANELLO CON VIA (builder / snapshot)

Chiusura **solo payload** (`routingExtractClosedLoopPoints` 86268–86287; analogo snap 86289–86312):

```javascript
// vis = START + VIA… (no hidden B)
pointsLonLat.push([nLon, lat]);
// …
pointsLonLat.push([pointsLonLat[0][0], pointsLonLat[0][1]]); // START finale solo qui
return { ok: true, pointsLonLat, pointsLatLon, openLatLon };
```

`openLatLon` **non** duplica START. State `r.points` resta START, VIA…, hidden B.

**1 VIA:** vis length 2 → payload length 3 = START, VIA, START.  
**2 VIA:** vis length 3 → payload length 4 = START, VIA1, VIA2, START.

Clone compare (88688–88699): constrained → open chain visibile; **non** chiude nello snapshot.

Add VIA (85574–85585): splice prima dell’ultimo (hidden B); `routingInvalidateRoutePreview()`.

Reorder (85515–85533): `routingMovePoint` scambia indici (non START, non last in round_trip); `invalidate`. Selftest `RAC_reorder_via`: ordine planner → ordine payload.

Remove: `routingRemovePoint` + invalidate; selftest `RAC_remove_via_before/after` constrained true→false.

---

## 9. RAW — GH CONSTRAINED LOOP

Dispatch calc (89612–89629): **non** chiama `routingCalculateRoundTripGraphhopper` se constrained; usa `routingExtractClosedLoopPoints` + routing normale.

POST (89830–89832):

```javascript
const bodyPrimary = routingBuildGraphhopperRouteBody(profile, snapPts.pointsLonLat, {
  withAlternatives: !isOutAndBack
});
```

Builder normale (87638–87653):

```javascript
function routingBuildGraphhopperRouteBody(profile, pointsLonLat, opts){
  const body = { profile, points: pointsLonLat, elevation: true, points_encoded: false, instructions: false };
  if (opts.withAlternatives){
    body.algorithm = "alternative_route";
    body["alternative_route.max_paths"] = ROUTING_ALTERNATIVE_MAX_PATHS;
    // … weight/share factors esistenti …
  }
  return routingApplyAvoidPayloadToBody(body);
}
```

Con ≥1 VIA: `algorithm !== "round_trip"`; `algorithm === "alternative_route"` (stesso builder one-way). Profile dal select. Avoid `custom_model` + `ch.disable` via helper esistente. Elevation/instructions identici al route normale.

Gate/controller/stale: `routingNetworkGateGraphhopper` pre e post-snap (89792); `AbortController` + `requestSequence` invariati.

Fallback HTTP `usedAlternativesFallback` (89884–89898): **solo** se alternative_route HTTP-unsupported; **stessi** `snapPts.pointsLonLat` chiusi; **non** `round_trip`. Non è un fallback silenzioso alla semantica anello storico.

Compare GH (88862 vs 88882–88905): constrained **non** entra nel loop seed `routingBuildGraphhopperRoundTripBody`; chiude con `routingClosedLoopLonLatFromOpen(snap.points)` poi `routingBuildGraphhopperRouteBody(..., { withAlternatives: true })`. Quindi `alternative_route` in compare deriva dal **builder esistente**, non sostituisce la semantica constrained-loop.

---

## 10. RAW — ORS CONSTRAINED LOOP

Dispatch (88524–88535): `round_trip && !constrained` → storico `routingCalculateRoundTripOrs`; altrimenti `routingExtractClosedLoopPoints`.

POST (88594):

```javascript
const data = await routingPostOrsDirections(profile, routingBuildOrsRouteBody(ptsRes.pointsLonLat, { withAlternatives: true }), controller);
```

```javascript
function routingBuildOrsRouteBody(pointsLonLat, opts){
  const body = { coordinates: pointsLonLat, elevation: true, instructions: false };
  if (opts.withAlternatives){ body.alternative_routes = { … costanti esistenti … }; }
  return routingApplyAvoidPayloadToOrsBody(body);
}
```

`coordinates` = START, VIA…, START. **Nessun** `options.round_trip`. Profile `snap.pair.ors` / select. `avoid_polygons` via helper esistente (88179–88185).

Gateway esclusivo: `routingPostOrsDirections` → `routingOrsDirectionsUrl` → `ROUTING_ORS_GATEWAY_BASE + /ors/v2/directions/…/geojson` (88115–88142, 88419–88425). Headers: solo `Content-Type: application/json`. Nessun `Authorization`.

Gate: `routingNetworkGateOrs` (88158–88164) prima del POST. Controller/stale = `requestSequence` + abort come storico.

Compare ORS (88924 vs 88944–88966): stesso split; constrained → `routingClosedLoopLonLatFromOpen` + `routingBuildOrsRouteBody` + `routingPostOrsDirections`. Nessun `routingBuildOrsRoundTripBody`.

---

## 11. RAW — DISTANCE / SEED

Fingerprint (88723–88738): `dist`/`seed` **solo se** `mode === "round_trip" && !constrainedLoop`.

UI (86931–86938, 86983–86992): regen disabled se constrained; input distanza + preset `disabled`; nota `#routingRoundTripConstrainedNote` visibile; hint storico nascosto; feedback «Distanza e seed non si applicano con punti di passaggio obbligati.»

Zero VIA: input abilitato; body RT include distance/seed. Compare RT storico usa `routingRoundTripSeedBatch(snap.roundTripSeed)`.

Selftest `RAC_distance_seed_ignored`: due snap constrained con dist/seed diversi → fingerprint uguale.

---

## 12. RAW — COMPARE CONSTRAINED LOOP

`routingCompareStart` (89203–89218): **un** snapshot:

```javascript
points: routingCompareClonePointsForMode(mode),  // open-chain se constrained
avoid: routingCompareCloneAvoid(),
constrainedLoop: routingRoundTripIsConstrained(),
```

GH e ORS ricevono lo **stesso** `snap`. Chiusura START solo in `routingCompareRunGh` / `RunOrs` via `routingClosedLoopLonLatFromOpen(snap.points)`. Stesso ordine VIA (clone visibile). Stesso avoid (`routingCompareWithAvoid` wrap 88757–88761).

Controller separati (89215–89217): `ghCtrl` / `orsCtrl`. Stale: `seq !== sequence` e fingerprint live vs snap (89230–89233). Partial: pack scritti indipendentemente (89240–89243); overlay solo PASS. Choose invariato: `routingApplyRouteResultFromValidated` (89272). Dual overlay invariato: `routingCompareOverlayTracks` due id.

---

## 13. RAW — RETE / OPSEC

Endpoint **nessuno nuovo**:

```javascript
const ROUTING_GRAPHHOPPER_ENDPOINT = "http://100.114.7.53:8989";
const ROUTING_GRAPHHOPPER_ENDPOINT_LOCAL = "http://127.0.0.1:8989";
const ROUTING_ORS_GATEWAY_BASE = "https://ubuntu.tailc01234.ts.net";
```

GH Auto Local→VPS (88680–88682, 88830–88835):

```javascript
function routingCompareAutoCandidates(){
  if (state.forceOffline) return ["local"];
  return ["local", "vps"];
}
// resolve: if (cand === "ors") continue;
```

ORS **non** in Auto. `routingNetworkGateGraphhopper` / `routingNetworkGateOrs` esistenti: `opsecStrict` / `forceOffline` / `navigator.onLine` / `isEffectivelyOnline`.

`api.openrouteservice.org`: solo assert **negativi** (86765, 89335–89339).  
`Authorization` / `ORS_API_KEY`: solo assert negativi (89340–89342). Fetch ORS senza Authorization (88419–88425). Compare POST stesso pattern (88801–88805).

Nessun polling/prefetch/retry nuovo: timeout storici `ROUTING_GRAPHHOPPER_TIMEOUT_MS` / `ROUTING_ORS_TIMEOUT_MS`; abort controller; seed batch **solo** round_trip non constrained (storico).

---

## 14. RAW — STATE / STORAGE / GPS

Compare/anello usano `state._routing.points` + session `_routingCompareSession` (var, non persistita). Selftest:

- `RPC_waypoints`: `routingCompareClonePointsForMode` **non** contiene `mapWaypoints`
- `RPC_gis_polygons`: `routingCompareStart` **non** contiene `gisPolygons`
- `RPC_no_storage_key`: `STORAGE_KEY === "coordconv_v2"`; compare start/choose **non** `localStorage`

Oggetti GIS / `saveStore` mapWaypoints: non toccati da questo candidate (nessun write da compare).

`watchPosition`: **0** occorrenze nel monolite candidate.

Helper **0.1.3**: FRONTIER LIVE invariato; questo pass non tocca helper/D-FLIGHT URLs di produzione.

---

## 15. SELFTEST (non rieseguito)

Candidate **immutato** (`105bedf` / blob `99233802`). **716/716 PASS** già attestato in [`2026-08-18_1415_outdoor-routing-f-provider-compare-a-fix1.md`](2026-08-18_1415_outdoor-routing-f-provider-compare-a-fix1.md). Questo pass **non** riesegue `GOIDflight.selfTest()`.

Assert già presenti in `routingCompareFix1SelfTest` / `routingProviderCompareSelfTest` (blob 222):

| Tema | Assert |
| --- | --- |
| zero VIA | `RAC_zero_via_not_constrained`, `RAC_zero_via_gh_round_trip`, `RAC_zero_via_ors_round_trip`, `RAC_zero_via_regression`, `RAC_zero_via_builder_unchanged` |
| 1 VIA | `RAC_one_via_constrained`, `RAC_one_via_start_via_start`, `RAC_state_no_dup_start` |
| 2 VIA | `RAC_two_via_start_v1_v2_start` |
| GH constrained | `RAC_gh_constrained_no_round_trip` (`alternative_route`) |
| ORS constrained | `RAC_ors_constrained_no_round_trip` |
| avoid | `RAC_gh_avoid_constrained`, `RAC_ors_avoid_constrained` |
| compare | `RAC_compare_same_snapshot`, `RAC_compare_closed`, `RAC_compare_run_uses_flag`, `RPC_partial`, `RPC_isolation_controllers`, `RPC_stale_bump` |
| reorder/remove/seed | `RAC_reorder_via`, `RAC_remove_via_before`, `RAC_remove_via_after`, `RAC_distance_seed_ignored` |
| legend lifecycle | `RPCF1_legend_fn`, `RPCF1_legend_dom`, `RPCF1_legend_choose_gone`, `RPCF1_legend_invalidate_gone`, `RPCF1_swatch_gh`, `RPCF1_swatch_ors` |
| center | `RPCF1_center_btn`, `RPCF1_center_combined`, `RPCF1_center_partial`, `RPCF1_overlay_dual` |
| CTA | `RPCF1_cta_primary` |
| rete | `RPC_no_new_endpoint`, `RPC_no_api_key`, `RPC_auto_no_ors` |

---

## 16. STOP

FRONTIER / WU-HOT-HEADER restano:

```text
BLOCK: OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1
GATE: REVIEW GPT-SOSTITUTIVA — PENDING
CANDIDATE: 105bedf3c0fa4f15f1be0edf4929d19e8842235b / build 222 / blob 99233802af29998ee3c0c659d72ffa9db6bbe100
NEXT: review FIX1 candidate 222
```

NON deploy. NON ABQA. NON QA operatore. NON finito.
