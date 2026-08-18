# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3 — REVIEW-RAW-RECOVERY-FIX3

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3`  
**PASS:** `REVIEW-RAW-RECOVERY-FIX3`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (invariato; FRONTIER / WU-HOT-HEADER **non** toccati)  
**Verdetto review:** **NON EMETTERE** (evidence-only per GPT sostitutiva)  
**Deploy / ABQA / QA operatore / finito / build bump / monolite:** **NON ESEGUITI**  
**Selftest 769/769:** **non rieseguito** (candidate immutato)

Fonte blob: `git cat-file -p 4a9565af089bde990b9d9c64689164da21949273`  
Commit runtime: `d4558419c7139a4587389528d76bd82395ada100`  
Linee citate = blob candidate **224**.

Selftest già persistito: [`2026-08-18_1748_outdoor-routing-f-provider-compare-a-fix3.md`](2026-08-18_1748_outdoor-routing-f-provider-compare-a-fix3.md).

---

## 1. Anchor — RUNTIME_CANDIDATE_SHA

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `d4558419c7139a4587389528d76bd82395ada100` |
| Subject | `feat(routing): FIX3 layout, VIA pick, loop/compare readability, build 224` |
| Parent | `3f15338f7644cce52bc5a5dec81fff9372eee80c` (docs FIX2 ABQA PASS; **non** runtime LIVE) |
| Base 223 | `4a6dca938057d2c1e2b0f0a2cdec1480c13f3d20` |
| LIVE runtime (build 220) | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` |
| `APP_BUILD_NUM` | **224** |
| `APP_BUILD_ID` | `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3` |
| Blob git monolite | `4a9565af089bde990b9d9c64689164da21949273` |
| Bytes LF | `10657904` |
| SHA-256 LF | `a895f02c79339e19887dc3c2f3cb903bcbabd7bf3f25f14c86202fff68700a0a` |
| Helper | **0.1.3** (invariato; FRONTIER LIVE) |
| Candidate immutabile | **SÌ** — questo pass **non** riscrive il monolite |

Verifica `APP_BUILD_*` nel blob (`24033–24036`):

```javascript
const APP_BUILD_ID = "OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3";
const APP_BUILD_DETAIL = "Routing layout + VIA pick + loop/compare readability (FIX3).";
const APP_BUILD_NUM = 224;
```

```text
git rev-parse d4558419c7139a4587389528d76bd82395ada100:"coordinate_converter Claude.html"
4a9565af089bde990b9d9c64689164da21949273
```

**NON** usare HEAD / current container / self-reference come sostituto di `RUNTIME_CANDIDATE_SHA`.

HEAD locale al momento dell’anchor (docs container post-FIX3 candidate, **non** il candidate runtime):

```text
git rev-parse HEAD
52816fdf519f13fd860716f66bef56f6ffcab6d6
```

## 2. REMOTE_HEAD_AT_EVIDENCE_TIME (separato)

Attestazione **prima** del commit docs di questo recovery:

```text
git ls-remote origin refs/heads/main
52816fdf519f13fd860716f66bef56f6ffcab6d6	refs/heads/main
```

**REMOTE_HEAD_AT_EVIDENCE_TIME** = `52816fdf519f13fd860716f66bef56f6ffcab6d6`

Un successivo commit docs-only può rendere `origin/main` diverso: **non** cambia `RUNTIME_CANDIDATE_SHA`.

---

## 3. RAW — LAYOUT ROUTING

Ordine in `#routingPlannerPanelBody` (blob): status → nota servizio → **details provider chiuso** → profilo → `#routingPointsList` → `#routingRouteOptionsZone` (alternative **+** compare) → result card → `#routingModeRow` **senza** Centra risultato.

### 3.1 Provider collapsible, chiuso di default, accessibile (`15123–15142`)

`<details>` **senza** attributo `open`. `<summary>` nativo = focus/tastiera. Select + Verifica + endpoint restano nel pannello.

```html
    <details id="routingGraphhopperProviderDetails" class="routing-provider-details">
      <summary id="routingGraphhopperProviderSummary" class="routing-provider-summary routing-section-heading" data-i18n="routing.providerSettings">Impostazioni GraphHopper</summary>
    <div id="routingGraphhopperProviderRow" class="routing-provider-row">
      ...
      <select id="routingProviderSelect" ...>
      <button type="button" id="routingVerifyBtn" ...>
    </div>
    <p ... id="routingEndpointRow">...</p>
    </details>
```

### 3.2 Punti, poi alternative+compare nella stessa zona (`15154–15198`)

```html
    <div id="routingPointsList" class="routing-points-list" role="list"></div>
    <div id="routingPointsFeedback" ...></div>
    <div id="routingRouteOptionsZone" class="routing-route-options-zone" data-routing-route-options="1">
      <div id="routingAlternativesRow" class="routing-alternatives-row" hidden>
        <span id="routingAlternativesLabel" ...>Percorsi alternativi</span>
        <div id="routingAlternativesChips" ...></div>
      </div>
    <section id="routingCompareSection" class="routing-compare-section" aria-labelledby="routingCompareTitle">
      ...
      <button type="button" id="routingCompareBtn" class="btn btn-sm btn-primary" ...>
      ...
      <button ... id="routingCompareChooseGh" ...>
      <button ... id="routingCompareChooseOrs" ...>
      <ul id="routingCompareLegend" ...>
    </section>
    </div>
```

CSS zona unica (`9849–9859`): flex column, bordo, sfondo accent; compare senza margine extra.

### 3.3 «Centra risultato» rimosso dal planner

`id="routingCenterResultBtn"`: **0** occorrenze nel markup. `#routingModeRow` azioni (`15229–15240`): Calcola, Annulla, Modifica coordinate, Aggiungi VIA, Inverti, Salva — **nessun** Centra risultato.  
JS `getElementById("routingCenterResultBtn")` resta no-op se assente (`89248`, `93333`). Selftest `RPCF3_no_center_old`. Centra **per-alternativa** invariato (`data-routing-alt-center`).

### 3.4 Minimize / close / restore **invariati**

Head (`15113–15116`): `data-role="routingpanel-minimize"` + `#routingPlannerPanelClose`.  
Wire (`93252–93264`): close → `closeRoutingPlannerPanel()`; minimize → `gisMinimizePanel("routingPlannerPanel", ...)`. Nessun hunk di lifecycle nel senso di nuova API.

---

## 4. RAW — AREE DA EVITARE

Stesso overlay `routingSyncAvoidAreasOverlay` / sessione `_routingAvoidSession` / `routingAvoidEnterDrawMode`. **Nessun** secondo drawing engine.

### 4.1 Fill + bordo (`9831–9834`)

```css
.routing-avoid-poly{ fill:rgba(220,38,38,.42); stroke:#b91c1c; stroke-width:3.5; paint-order:stroke fill; }
.routing-avoid-poly.is-draft{ fill:rgba(234,88,12,.46); stroke:#c2410c; stroke-width:4; stroke-dasharray:8 4; }
.routing-avoid-vert{ fill:#fff; stroke:#b91c1c; stroke-width:2; }
.routing-avoid-vert.is-draft{ stroke:#c2410c; fill:#ffedd5; }
```

### 4.2 Draft e area confermata (`86848–86856`)

`drawRing(..., "routing-avoid-poly")` + `drawVerts` per aree; draft `is-draft`. Vertici cerchiati. Overlay `pointer-events:none`. State canonico: `_routingAvoidSession.areas[].vertices` invariato.

### 4.3 Help presente (`15311–15314`)

`#routingAvoidAreasTitle` + `#routingAvoidHelpBtn` `data-i18n-tip="tip.routingAvoidHelp"`.

---

## 5. RAW — ADD VIA IMMEDIATE MAP PICK

### 5.1 Click CTA (`93266–93269` + `85658–85669`)

```javascript
function routingAddVia(){
  const r = routingEnsureState();
  if ((r.points || []).length >= ROUTING_MAX_POINTS){
    routingSetStatus(routingT("routing.maxPoints", "Max 20"), true);
    return;
  }
  try { routingPushPointUndoSnapshot(); } catch(_){}
  const via = { id: uidRouting(), label: "", snapStatus: "unverified" };
  r.points.splice(Math.max(1, r.points.length - 1), 0, via);
  r.dirty = true;
  try { routingInvalidateRoutePreview(); } catch(_){}
  routingEnterPickMode(via.id);
}
```

Insert VIA **poi** `routingEnterPickMode(via.id)` nello stesso click. Nessun secondo click su «Scegli sulla mappa» richiesto per entrare in pick.

### 5.2 Pick-ready (`84467–84484`)

`r.pickMode = true`, `r.pickTargetId = id`, `mapToolActivate("routing-pick", ...)`, `routingRenderList()` (il pulsante pick della riga riceve `aria-pressed` / `is-active`).

### 5.3 Input testo/coordinate e reorder/remove invariati

Riga: `input.routing-pt-field` + azioni pick/gps/center/up/down/remove (`85520–85537`).  
`routingMovePoint` (`85599–85617`): swap in-place, lock START/hidden B in `round_trip`. Remove resta `data-routing-act="remove"`.

---

## 6. RAW — GEOCODING / DISMISS / TAB

### 6.1 Controllo visibile di chiusura (`85345–85348`)

Toolbar sticky con pulsante `data-routing-search-dismiss` testo «Chiudi risultati». Handler (`92887`): `routingSearchDismiss(did)` — **non** tocca `p.label` né `e.query` / `e.hits`.

```javascript
function routingSearchDismiss(pointId){
  const e = state._routing && state._routing.search && state._routing.search[String(pointId)];
  if (e){
    e.open = false;
    e.dismissed = true;
    e.activeIndex = -1;
  }
  try { routingSearchSyncDropdownDom(pointId); } catch(_){}
}
```

`routingSearchOnFocus`: `if (e.dismissed) return;` (`84929`) — lista non riapre sul solo focus. Digitare azzera `dismissed`. Enter/click pick invariati (`93435–93452`).

### 6.2 Tab locale, nessun trap (`84982–84995`, `93460–93461`)

```javascript
function routingPointLabelHandleTab(ev, labelInp){
  if (!ev || !labelInp || ev.key !== "Tab" || ev.shiftKey) return false;
  const row = labelInp.closest && labelInp.closest(".routing-point-row");
  if (!row) return false;
  ev.preventDefault();
  // dismiss se dropdown aperto, altrimenti pick della stessa riga
  ...
  return true;
}
```

Grip `tabindex="-1"` (`85442`) — non intercetta Tab. Shift+Tab nativo (nessun trap: `return false` se shift). Dopo pick, Tab nativo prosegue gps/center/up/down/remove → riga successiva.

---

## 7. RAW — ANELLO CON VIA

Payload HTTP **invariato** rispetto a FIX2: visibili + append START.

```javascript
function routingClosedLoopLonLatFromOpen(openPts){
  // ... push [lon,lat] ...
  if (out.length) out.push([out[0][0], out[0][1]]);
  return out;
}
```

`routingExtractClosedLoopPoints` / `routingRoundTripIsConstrained` (`visible.length >= 2`) non cambiano la semantica START→VIA…→START.

### 7.1 Preview: ultimo tratto verso START **solo display** (`86352–86363`, `90773–90775`)

```javascript
function routingEnsureLoopDisplayCoords(coords){
  if (!Array.isArray(coords) || coords.length < 2) return coords;
  if (typeof routingRoundTripIsConstrained === "function" && !routingRoundTripIsConstrained()) return coords;
  // se last ≉ first: slice() + push start. Non muta r.previewCoordinates.
  const out = coords.slice();
  out.push({ lat: latA, lon: lonA });
  return out;
}
```

Applicato in overlay singolo e compare **prima** del SVG. Zero-VIA (`!constrained`) ritorna `coords` invariato → `round_trip` algoritmico non toccato.

Marker/order: lista `round_trip` salta l’ultimo slot hidden (`85426`); badge A / VIA / (B nascosto).

Regression selftest già persistita (non rieseguita qui): `RAC_*` / `RPCF2_*` / `RPCF3_two_via_still_closed` / `RPCF3_zero_via_no_force_close` / `RPCF3_compare_via` / `RPCF3_avoid_via`.

---

## 8. RAW — COMPARE OVERLAP VISUAL

Meccanismo: **offset laterale solo in pixel schermo** (±6 px, perpendicolare al tratto) **+ casing/halo**. Coordinate canoniche `previewCoordinates` di GH/ORS **non** riscritte.

```javascript
function routingOffsetComparePolylinePx(mapPts, side){
  const off = 6 * (Number(side) < 0 ? -1 : 1);
  // offset x/y in px; nessun lat/lon
}
```

Overlay (`90720–90751`): se `cmpTracks.length >= 2` → `data-routing-compare-offset="1"`; GH `side=-1`, ORS `side=+1`; polyline casing poi stroke. CSS: GH rosso continuo, ORS blu tratteggiato (`9929–9932`). Legenda swatch invariata (`15186–15195`).

`routingCompareOverlayTracks` (`89138–89145`): se `_routingCompareSession.chosen` → **`null`** (niente overlay dual, niente offset).

`routingCompareChoose` (`89405–89431`): applica pack canonico via `routingApplyRouteResultFromValidated`, poi `chosen = gh|ors`, `refreshTileMapForTrackUi()`. Cleanup: overlay precedente `old.remove()` (`90697–90698`); `routingCompareOnInputInvalidated` abort+clear.

---

## 9. RAW — OPSEC / STATE / INVARIANTI DEL DELTA

Diff HTML `4a6dca9..d455841` (un solo file runtime, +492/−118). Scansione hunk:

| Invariante | Nel delta FIX3 |
| --- | --- |
| Endpoint nuovi (`fetch(`, `tailc01234`, path `/ors/`) | **assenti** |
| `Authorization` / `ORS_API_KEY` | **0** |
| `api.openrouteservice` | solo assert selftest `indexOf(...) < 0` |
| Auto GH / `ROUTING_GRAPHHOPPER_ENDPOINT` | solo assert `100.114.7.53` / `127.0.0.1:8989` |
| `routingCompareAutoCandidates` | hunk pin preesistente `indexOf("ors") < 0` (ORS mai Auto) |
| `forcedOffline` / `opsecStrict` | **0** |
| `getCurrentPosition` | **0** |
| `watchPosition` | solo assert `RPCF3_no_gps_watch` `indexOf < 0` |
| `state.mapWaypoints` / `state.gisPolygons` | solo snapshot+assert **untouched** (zero write) |
| `localStorage` / `STORAGE_KEY` | contesto preesistente `coordconv_ui_v1` accanto a `APP_BUILD_*`; nessuna nuova chiave |
| Oggetti GIS / helper 0.1.3 | **non toccati** (commit runtime = solo monolite HTML) |

---

## 10. EVIDENCE ESISTENTE (non rieseguita)

Puntatore: [`2026-08-18_1748_outdoor-routing-f-provider-compare-a-fix3.md`](2026-08-18_1748_outdoor-routing-f-provider-compare-a-fix3.md) sul candidate immutabile `d455841`.

| Esito già persistito | Valore |
| --- | --- |
| Selftest globale | **769/769 PASS** |
| Diff scoped | +492 / −118 su `coordinate_converter Claude.html` |
| Live HTTP probes | **non** in questo FIX3 (layout/UX; probe 223 restano in [`1635`](2026-08-18_1635_outdoor-routing-f-provider-compare-a-fix2.md)) |
| Screenshot | **non** persistiti; RAW layout = markup `#routingRouteOptionsZone` + CSS sopra |

---

## 11. STOP

**REVIEW GPT-SOSTITUTIVA — PENDING** (invariato)

```text
BLOCK:     OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3
GATE:      REVIEW GPT-SOSTITUTIVA — PENDING
CANDIDATE: d4558419c7139a4587389528d76bd82395ada100
           build 224
           blob 4a9565af089bde990b9d9c64689164da21949273
NEXT:      review FIX3 candidate 224
```

FRONTIER / WU-HOT-HEADER: **non modificati**.  
NON deploy. NON ABQA. NON QA operatore. NON finito. NON build bump. NON monolite.
