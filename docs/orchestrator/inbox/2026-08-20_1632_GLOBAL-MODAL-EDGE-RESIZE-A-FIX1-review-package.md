# REVIEW PACKAGE — GLOBAL-MODAL-EDGE-RESIZE-A-FIX1 (build 233)

BLOCK-ID: GLOBAL-MODAL-EDGE-RESIZE-A-FIX1  
PHASE: REVIEW EVIDENCE PUBLISH  
CLOSURE: NONE  
REMOTE MAIN WRITE: FORBIDDEN  
DEPLOY: FORBIDDEN

## Identifiers

- CANDIDATE_FULL_SHA: 1b8aa3c688f9800a47d0f7851af4c3d38ffe3c00
- PARENT_FULL_SHA: cde80223c51b8ff6969ebb58fe1e78712a810b58
- BRANCH: review/GLOBAL-MODAL-EDGE-RESIZE-A-FIX1-233
- APP_BUILD_NUM: 233
- APP_BUILD_ID: GLOBAL-MODAL-EDGE-RESIZE-A-FIX1
- CANDIDATE_BLOB (coordinate_converter Claude.html): 8bb4133bbfe29a13794fdb7355c0e4aec0c35213

## Convert stress — BASE vs CANDIDATE

Classification: **A) PRE-EXISTING / NOT REGRESSION**

Same sequence on TEMP copies (Track 8-dir + drag → close → Convert open + attachResize → E/N → 8-dir):

| Metric | BASE 232 | CANDIDATE 233 |
| --- | --- | --- |
| Convert efore panel | l=-425.67, t=95, w=680, h=940 | l=-425.67, t=95, w=680, h=940 |
| midN | x=-85.67 off-viewport | idem |
| hitN at midpoint | false (mid off-screen) | idem |
| Gesture on still-visible N strip | changed=true | idem |
| After E/N / 8-dir | back in viewport; midN ok | idem |

Mid-N “partial” is a consequence of the panel already opening off-left, not of N/S dead zones introduced by FIX1. Identical on base.

## Checklist DELICATO — evidence (not verdict)

### Lifecycle modal/dialog
- Touched: CSS edge-resize; gisPanelDefaultRect; gisModalEdgeResizeSelfTest; APP_BUILD_* + selftest gates.
- show / showModal / ria-modal / close selectors: **unchanged**.
- − / minimize / restore / close: verified PASS (prior browser QA + stress).
- Header actions clickable: PASS (EDGE_header_controls_clickable + manual).
- pointerup / pointercancel cleanup: present in gisPanelAttachResize (unchanged; selftest EDGE_L_pointer_cleanup).

### OPSEC / network
- New endpoints: **no**
- New external calls: **no**
- Isolated resize external-network delta: none observed
- Offline smoke: MGRS convert OK

### Sanitizer / storage / create-path / persisted fields
- **N/A** — diff does not touch them (session/default layout + CSS + selftest only).

### Full-perimeter
- N/S ≈ full width (h=8); E/W ≈ full height (w=8)
- mid + 0.25/0.5/0.75 on four sides: hit OK
- Corners: resize OK
- No dead zones observed on tested panels (Track / Convert after on-screen)

### Safe-top
- chromeBottom≈85; safeTop≈95
- Traccia first-open top=95; Convert first-open top=95 (after rAF)
- touched/reopen: preserved, not re-anchored

### Selftest
- gisModalEdgeResizeSelfTest: **31/31 PASS**

### Console
- No new errors attributed to FIX1 during QA/stress (panel off-left on Convert open is pre-existing geometry, not a console fault).

## Status git / remote refs (pre-evidence-publish)

`
git status --short:
(clean)

git remote -v:
origin	https://github.com/mrhz1973/cursor-coordinate-converter.git (fetch)
origin	DISABLED_PUSH (push)

git ls-remote origin refs/heads/main:
cde80223c51b8ff6969ebb58fe1e78712a810b58	refs/heads/main

git ls-remote origin refs/heads/review/GLOBAL-MODAL-EDGE-RESIZE-A-FIX1-233:
1b8aa3c688f9800a47d0f7851af4c3d38ffe3c00	refs/heads/review/GLOBAL-MODAL-EDGE-RESIZE-A-FIX1-233

LOCAL HEAD (candidate): 1b8aa3c688f9800a47d0f7851af4c3d38ffe3c00
origin/main local: cde80223c51b8ff6969ebb58fe1e78712a810b58
`

## 1) git show --format=fuller --stat

`
commit 1b8aa3c688f9800a47d0f7851af4c3d38ffe3c00
Author:     Martino Tuso <53308962+mrhz1973@users.noreply.github.com>
AuthorDate: Thu Aug 20 16:08:37 2026 +0200
Commit:     Martino Tuso <53308962+mrhz1973@users.noreply.github.com>
CommitDate: Thu Aug 20 16:08:37 2026 +0200

    fix(ui): full-perimeter edge hit-zones and safe-top first-open, build 233
    
    Co-authored-by: Cursor <cursoragent@cursor.com>

 coordinate_converter Claude.html | 285 ++++++++++++++++++++++++++-------------
 1 file changed, 188 insertions(+), 97 deletions(-)
`

## 2) git diff parent candidate --check

`
(empty — PASS)
`

## 3) DIFF COMPLETO — coordinate_converter Claude.html (unified=5)

`diff
diff --git a/coordinate_converter Claude.html b/coordinate_converter Claude.html
index ae5b4df..8bb4133 100644
--- a/coordinate_converter Claude.html	
+++ b/coordinate_converter Claude.html	
@@ -11503,24 +11503,27 @@ body.gis-mode #rangeRingsPanel .app-modal-body{
 html[data-theme="light"] .gis-panel-resize-handle,
 html[data-theme="light"] #trackModal .track-resize-handle{
   --gis-grip-stroke:rgba(51,65,85,.62);
   --gis-grip-stroke-hi:rgba(15,23,42,.88);
 }
-/* GLOBAL-MODAL-EDGE-RESIZE-A — invisible full-edge/corner hit-zones; no visible grip. */
+/* GLOBAL-MODAL-EDGE-RESIZE-A-FIX1 — full-perimeter hit-zones.
+ * Geometry uses !important to beat legacy #panel .*-resize-handle {22x22} and mid-edge 16x52. */
 body.gis-mode .gis-panel-resize-handle,
-body.gis-mode .track-resize-handle{
+body.gis-mode .track-resize-handle,
+body.gis-mode #trackModal .track-resize-handle{
   background:transparent !important;
   box-shadow:none !important;
   transform:none !important;
-  margin:0;
-  padding:0;
-  border:none;
-  opacity:1;
+  margin:0 !important;
+  padding:0 !important;
+  border:none !important;
+  opacity:1 !important;
   pointer-events:auto;
 }
 body.gis-mode .gis-panel-resize-handle::after,
 body.gis-mode .track-resize-handle::after,
+body.gis-mode #trackModal .track-resize-handle::after,
 body.gis-mode .gis-panel-resize-handle:hover::after,
 body.gis-mode .track-resize-handle:hover::after,
 body.gis-mode .gis-panel-resize-handle:focus-visible::after,
 body.gis-mode .track-resize-handle:focus-visible::after{
   content:none !important;
@@ -11538,63 +11541,88 @@ body.gis-mode .track-resize-handle:hover,
 body.gis-mode .gis-panel-resize-handle:focus-visible,
 body.gis-mode .track-resize-handle:focus-visible{
   background:transparent !important;
   outline:none;
 }
+/* Head below edge hit-zones; actions stay above so close/minimize remain clickable. */
+body.gis-mode .app-modal-head{
+  position:relative;
+  z-index:3;
+}
+body.gis-mode .app-modal-head-actions{
+  position:relative;
+  z-index:12;
+}
 body.gis-mode .gis-panel-resize-handle[data-handle="e"],
-body.gis-mode .track-resize-handle[data-handle="e"]{
-  top:12px; bottom:12px; right:0; left:auto;
-  width:8px; height:auto; cursor:ew-resize; z-index:4;
+body.gis-mode .track-resize-handle[data-handle="e"],
+body.gis-mode #trackModal .track-resize-handle[data-handle="e"]{
+  top:12px !important; bottom:12px !important; right:0 !important; left:auto !important;
+  width:8px !important; height:auto !important; cursor:ew-resize !important; z-index:4;
 }
 body.gis-mode .gis-panel-resize-handle[data-handle="w"],
-body.gis-mode .track-resize-handle[data-handle="w"]{
-  top:12px; bottom:12px; left:0; right:auto;
-  width:8px; height:auto; cursor:ew-resize; z-index:4;
+body.gis-mode .track-resize-handle[data-handle="w"],
+body.gis-mode #trackModal .track-resize-handle[data-handle="w"]{
+  top:12px !important; bottom:12px !important; left:0 !important; right:auto !important;
+  width:8px !important; height:auto !important; cursor:ew-resize !important; z-index:4;
 }
 body.gis-mode .gis-panel-resize-handle[data-handle="n"],
-body.gis-mode .track-resize-handle[data-handle="n"]{
-  top:0; left:12px; right:12px; bottom:auto;
-  height:8px; width:auto; cursor:ns-resize; z-index:4;
+body.gis-mode .track-resize-handle[data-handle="n"],
+body.gis-mode #trackModal .track-resize-handle[data-handle="n"]{
+  top:0 !important; left:12px !important; right:12px !important; bottom:auto !important;
+  height:8px !important; width:auto !important; cursor:ns-resize !important; z-index:11;
 }
 body.gis-mode .gis-panel-resize-handle[data-handle="s"],
-body.gis-mode .track-resize-handle[data-handle="s"]{
-  bottom:0; left:12px; right:12px; top:auto;
-  height:8px; width:auto; cursor:ns-resize; z-index:4;
+body.gis-mode .track-resize-handle[data-handle="s"],
+body.gis-mode #trackModal .track-resize-handle[data-handle="s"]{
+  bottom:0 !important; left:12px !important; right:12px !important; top:auto !important;
+  height:8px !important; width:auto !important; cursor:ns-resize !important; z-index:11;
 }
 body.gis-mode .gis-panel-resize-handle[data-handle="se"],
-body.gis-mode .track-resize-handle[data-handle="se"]{
-  width:14px; height:14px; right:0; bottom:0; top:auto; left:auto; cursor:nwse-resize; z-index:5;
+body.gis-mode .track-resize-handle[data-handle="se"],
+body.gis-mode #trackModal .track-resize-handle[data-handle="se"]{
+  width:14px !important; height:14px !important; right:0 !important; bottom:0 !important; top:auto !important; left:auto !important; cursor:nwse-resize !important; z-index:5;
 }
 body.gis-mode .gis-panel-resize-handle[data-handle="nw"],
-body.gis-mode .track-resize-handle[data-handle="nw"]{
-  width:14px; height:14px; left:0; top:0; right:auto; bottom:auto; cursor:nwse-resize; z-index:5;
+body.gis-mode .track-resize-handle[data-handle="nw"],
+body.gis-mode #trackModal .track-resize-handle[data-handle="nw"]{
+  width:14px !important; height:14px !important; left:0 !important; top:0 !important; right:auto !important; bottom:auto !important; cursor:nwse-resize !important; z-index:5;
 }
 body.gis-mode .gis-panel-resize-handle[data-handle="ne"],
-body.gis-mode .track-resize-handle[data-handle="ne"]{
-  width:14px; height:14px; right:0; top:0; left:auto; bottom:auto; cursor:nesw-resize; z-index:5;
+body.gis-mode .track-resize-handle[data-handle="ne"],
+body.gis-mode #trackModal .track-resize-handle[data-handle="ne"]{
+  width:14px !important; height:14px !important; right:0 !important; top:0 !important; left:auto !important; bottom:auto !important; cursor:nesw-resize !important; z-index:5;
 }
 body.gis-mode .gis-panel-resize-handle[data-handle="sw"],
-body.gis-mode .track-resize-handle[data-handle="sw"]{
-  width:14px; height:14px; left:0; bottom:0; right:auto; top:auto; cursor:nesw-resize; z-index:5;
+body.gis-mode .track-resize-handle[data-handle="sw"],
+body.gis-mode #trackModal .track-resize-handle[data-handle="sw"]{
+  width:14px !important; height:14px !important; left:0 !important; bottom:0 !important; right:auto !important; top:auto !important; cursor:nesw-resize !important; z-index:5;
 }
 @media (max-width:600px){
   body.gis-mode .gis-panel-resize-handle[data-handle="e"],
   body.gis-mode .track-resize-handle[data-handle="e"],
+  body.gis-mode #trackModal .track-resize-handle[data-handle="e"],
   body.gis-mode .gis-panel-resize-handle[data-handle="w"],
-  body.gis-mode .track-resize-handle[data-handle="w"]{ width:12px; }
+  body.gis-mode .track-resize-handle[data-handle="w"],
+  body.gis-mode #trackModal .track-resize-handle[data-handle="w"]{ width:12px !important; }
   body.gis-mode .gis-panel-resize-handle[data-handle="n"],
   body.gis-mode .track-resize-handle[data-handle="n"],
+  body.gis-mode #trackModal .track-resize-handle[data-handle="n"],
   body.gis-mode .gis-panel-resize-handle[data-handle="s"],
-  body.gis-mode .track-resize-handle[data-handle="s"]{ height:12px; }
+  body.gis-mode .track-resize-handle[data-handle="s"],
+  body.gis-mode #trackModal .track-resize-handle[data-handle="s"]{ height:12px !important; }
   body.gis-mode .gis-panel-resize-handle[data-handle="se"],
   body.gis-mode .track-resize-handle[data-handle="se"],
+  body.gis-mode #trackModal .track-resize-handle[data-handle="se"],
   body.gis-mode .gis-panel-resize-handle[data-handle="nw"],
   body.gis-mode .track-resize-handle[data-handle="nw"],
+  body.gis-mode #trackModal .track-resize-handle[data-handle="nw"],
   body.gis-mode .gis-panel-resize-handle[data-handle="ne"],
   body.gis-mode .track-resize-handle[data-handle="ne"],
+  body.gis-mode #trackModal .track-resize-handle[data-handle="ne"],
   body.gis-mode .gis-panel-resize-handle[data-handle="sw"],
-  body.gis-mode .track-resize-handle[data-handle="sw"]{ width:18px; height:18px; }
+  body.gis-mode .track-resize-handle[data-handle="sw"],
+  body.gis-mode #trackModal .track-resize-handle[data-handle="sw"]{ width:18px !important; height:18px !important; }
 }
 #trackModalHead{ cursor:grab; user-select:none; -webkit-user-select:none; touch-action:none; }
 #trackModalHead.dragging{ cursor:grabbing; }
 #waypointModalHead, #convertModalHead, #rangeRingsPanelHead, #measurePanelHead, #gisWorkbenchPanelHead, #astroPanelHead,
 #helpOverlayHead, #qrModalHead,
@@ -24275,14 +24303,14 @@ function fmtMils(deg){ return Math.round(degToMils(deg)).toString(); }
 const STORAGE_KEY = "coordconv_v2";
 const UI_STORAGE_KEY = "coordconv_ui_v1";
 /** Strong-confirm word for full local wipe (same in IT/EN/FR UI). */
 const APP_FULL_RESET_CONFIRM_WORD = "CANCELLA";
 /** Visible runtime build label — update before each runtime `finito`. */
-const APP_BUILD_ID = "GLOBAL-MODAL-EDGE-RESIZE-A";
-const APP_BUILD_DETAIL = "Resize globale modal: hit-zone invisibili su tutti i bordi e angoli; grip visibile rimosso.";
+const APP_BUILD_ID = "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1";
+const APP_BUILD_DETAIL = "FIX1: hit-zone N/S/E/W a tutta lunghezza; first-open sotto chrome (safeTop); grip invisibile.";
 /** Monotonic runtime build counter — increment on each runtime patch (not persisted). */
-const APP_BUILD_NUM = 232;
+const APP_BUILD_NUM = 233;
 const APP_BUILD_LABEL = APP_BUILD_ID + " · build " + APP_BUILD_NUM + " — " + APP_BUILD_DETAIL;
 function applyAppBuildLabel(){
   try {
     const buildDisp = APP_BUILD_ID + " · build " + APP_BUILD_NUM;
     document.title = "TMART GIS tool · " + buildDisp;
@@ -39656,12 +39684,12 @@ function dflightSelfTestF(){
         try { dflightSyncClientCtaState(); } catch(_){}
       }
     })());
 
     add("F_mvisa_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
 
     _dflightHelperBaseUrlOverride = "http://example.test:8010";
     if (typeof state !== "undefined") state.forceOffline = true;
     let gatedCalled = false;
     _dflightFetchImpl = function(){ gatedCalled = true; return Promise.resolve({ ok: true, status: 200, text: function(){ return Promise.resolve("{}"); }, headers: { get: function(){ return null; } } }); };
@@ -40678,12 +40706,12 @@ function dflightSelfTestTf(){
       String(dflightSyncAdaptivePanelGeometry).indexOf("dflightClampPanelTop") >= 0
       && String(dflightSyncAdaptivePanelGeometry).indexOf("dflightComputePanelUsableRect") >= 0
       && String(dflightEnsurePanelGeometryResize).indexOf("dflightSyncAdaptivePanelGeometry") >= 0);
 
     add("Tf_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
   } catch (e){
     add("selftest_tf_exception", false, String(e && e.message ? e.message : e));
   } finally {
     for (let i = 0; i < DFLIGHT_TEMPORAL_STATES.length; i++){
       const s = DFLIGHT_TEMPORAL_STATES[i];
@@ -42606,12 +42634,12 @@ function dflightSelfTestH(){
         if (Object.prototype.hasOwnProperty.call(state, "_dflightUiPhase")) return false;
         return true;
       } catch(_){ return false; }
     })());
 
-    add("H_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("H_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("VR_FIX1_sync_loading_passes_zoom", (function(){
       if (typeof dflightSyncLoadingUi !== "function") return false;
       const src = String(dflightSyncLoadingUi);
       return src.indexOf("dflightAtm09IsEligibleForStart(atmZoom)") >= 0
         && src.indexOf("dflightAtm09OverlayVisible(atmZoom)") >= 0
@@ -43107,12 +43135,12 @@ function dflightSelfTestHitFixA(){
   const prevAtm09Pref = _dflightAtm09Preferred;
   const prevUnavail = _dflightAtm09InfoUnavailable;
   const prevBase = _dflightHelperBaseUrlOverride;
   try {
     add("HitA_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
 
     add("HitA_css_hit_fill", (function(){
       const srcFn = String(dflightDrawOverlayDom) + String(dflightAttachClickHandler);
       return srcFn.indexOf("dflight-volume-hit") >= 0
         && srcFn.indexOf("dflight-zone-hitlayer") >= 0;
@@ -44121,12 +44149,12 @@ function dflightSelfTestOptB(){
     _dflightAtm09SubdivCache = [];
     _dflightAtm09InfoLastFetchStats = null;
     _dflightAtm09InfoLastFailReason = null;
 
     add("OptB_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
 
     add("OptB_constants",
       DFLIGHT_ATM09_SUBDIV_MAX_DEPTH === 2
       && DFLIGHT_ATM09_SUBDIV_MAX_REQUESTS === 21
       && DFLIGHT_ATM09_SUBDIV_CONCURRENCY === 3
@@ -44559,12 +44587,12 @@ function dflightSelfTestOptB(){
         try { if (typeof dflightAtm09SyncTemporalContextUi === "function") dflightAtm09SyncTemporalContextUi(); } catch(_){}
         try { if (typeof dflightRedrawOverlayFromSession === "function") dflightRedrawOverlayFromSession(tm); } catch(_){}
       }
     })());
 
-    add("OptB_FIX5_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("OptB_FIX5_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
 
     add("OptB_FIX2_any_enabled_all_on", (function(){
       for (let i = 0; i < DFLIGHT_TEMPORAL_STATES.length; i++) _dflightTemporalFilter[DFLIGHT_TEMPORAL_STATES[i]] = true;
       return typeof dflightTemporalFilterAnyEnabled === "function" && dflightTemporalFilterAnyEnabled() === true;
     })());
@@ -45151,12 +45179,12 @@ function dflightSelfTestMVISA(){
     dflightAtm09EnsureLegend = function(){ /* MVISA selftest no-op */ };
     _dflightClientSession = { normalizedDataset: { ok: true, zones: [] } };
     _dflightOverlaySession = { dataset: { ok: true, zones: [] } };
 
     add("MVISA_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
 
     add("MVISA_ui_label_exact", (function(){
       const lbl = document.getElementById("dflightAtm09MasterLabel");
       const tgl = document.getElementById("dflightAtm09MasterToggle");
       return !!(tgl && lbl && lbl.textContent.replace(/\s+/g, " ").trim() === "Mostra overlay ATM09 ufficiale"
@@ -46118,12 +46146,12 @@ function dflightSelfTestIMPLA(){
     /* Ensure the external user legend DOM exists before arbitration checks. */
     try { dflightEnsureAtm09UserLegend(); } catch(_){}
 
     add("IMPLA_api", typeof dflightLegendPaintMode === "function" && typeof dflightSyncContextualLegends === "function");
     add("IMPLA_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
 
     /* A: D ON / ATM OFF — F: restrictions overlay on map; in-panel hidden */
     add("IMPLA_A", (function(){
       _dflightAtm09MasterUi = false;
       _dflightAtm09Preferred = false;
@@ -46288,12 +46316,12 @@ function dflightSelfTestLEGENDUX(){
     _dflightOverlaySession = { dataset: ds };
     _dflightAtm09InfoUnavailable = false;
     dflightEnsureAtm09UserLegend();
 
     add("LEGENDUX_build_201",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
 
     /* SELFTEST 1+2: row count and canonical order */
     const rows = ulRoot ? ulRoot.querySelectorAll("ul li") : [];
     add("LEGENDUX_row_count_8", rows.length === 8, "rows=" + rows.length);
     const wantLabels = DFLIGHT_ATM09_USER_LEGEND_ROWS.map(function(r){ return r.label; });
@@ -46717,12 +46745,12 @@ function dflightSelfTestSideBySide(){
     try { if (prevUsable) dflightComputePanelUsableRect = prevUsable; } catch(_){}
     geomStubbed = false;
   }
   try {
     add("SBS_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("SBS_fn_present", typeof dflightEnsurePairLayout === "function");
     add("SBS_L_no_localStorage", (function(){
       const src = String(dflightEnsurePairLayout);
       return src.indexOf("setTimeout") < 0 && src.indexOf("localStorage") < 0;
     })());
@@ -47106,12 +47134,12 @@ function brandingSelfTestTmartImplA(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("BRAND_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
 
     const main = document.querySelector(".brand-main");
     const by = document.querySelector(".brand-by");
     const sig = document.querySelector(".brand-signature");
     add("BRAND_header_visible",
@@ -47234,12 +47262,12 @@ function gisDockSelfTestGA1(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("DOCK_GA1_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("DOCK_GA1_api",
       typeof gisDockReflow === "function"
       && typeof gisRenderMinimizedDock === "function"
       && typeof gisMinimizePanel === "function"
       && typeof gisRestoreMinimizedPanel === "function"
@@ -47410,12 +47438,12 @@ function gisPanelSafeTopSelfTestFix1(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("SAFE_TOP_FIX1_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("SAFE_TOP_FIX1_api",
       typeof gisPanelSafeTop === "function"
       && typeof gisPanelClampRectPartialVisible === "function"
       && typeof gisPanelNudgeOpenPanelsToSafeTop === "function");
     add("SAFE_TOP_FIX1_neg_pair_in_clamp",
@@ -47543,12 +47571,12 @@ function gisPanelSafeTopSelfTestFix2(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("SAFE_TOP_FIX2_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("SAFE_TOP_FIX2_src_uses_dock",
       String(gisPanelSafeTop).indexOf("gisMinimizedDock") >= 0
       && String(gisPanelSafeTop).indexOf("Math.max") >= 0);
     add("SAFE_TOP_FIX2_reflow_calls_nudge",
       String(gisDockReflow).indexOf("gisPanelNudgeOpenPanelsToSafeTop") >= 0);
@@ -47781,12 +47809,12 @@ function gisDockSelfTestGB(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("DOCK_GB_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("DOCK_GB_workbench_branch",
       String(gisMinimizePanel).indexOf('panelId === "gisWorkbenchPanel"') >= 0);
     add("DOCK_GB_ordinary_ids_len",
       Array.isArray(G_B_ORDINARY_IDS) && G_B_ORDINARY_IDS.length === 11
       && G_B_ORDINARY_IDS.indexOf("gisWorkbenchPanel") >= 0);
@@ -48090,12 +48118,12 @@ function gisDockSelfTestGC(){
       if (fn) fn();
     } catch(_){}
   };
   try {
     add("DOCK_GC_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("DOCK_GC_symbols",
       typeof offlinePanelMinimizeForBbox === "function"
       && typeof offlinePanelRestoreAfterBbox === "function"
       && typeof polygonDrawMinimizeIfOpen === "function"
       && typeof polygonDrawRestoreIfAutoMinimized === "function"
@@ -48383,12 +48411,12 @@ function gisDockSelfTestGD(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("DOCK_GD_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("DOCK_GD_api",
       typeof gisDockPlanSlots === "function"
       && typeof gisDockMeasureHeader === "function"
       && typeof gisDockReflow === "function"
       && typeof gisRenderMinimizedDock === "function");
@@ -48644,12 +48672,12 @@ function gisModalEdgeResizeSelfTest(){
   const checks = [];
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail == null ? "" : String(detail) });
   };
   try {
-    add("EDGE_build_232", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("EDGE_build_233", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("EDGE_compute_fn", typeof gisPanelResizeCompute === "function" && typeof gisPanelEnsureEdgeResizeHandles === "function");
     const down = { startL: 100, startT: 80, startW: 400, startH: 300 };
     const rE = gisPanelResizeCompute(down, "e", 40, 0, 200, 160, 2000, 2000);
     add("EDGE_A_right", rE.w === 440 && rE.left === 100 && rE.top === 80 && rE.h === 300, JSON.stringify(rE));
     const rW = gisPanelResizeCompute(down, "w", 40, 0, 200, 160, 2000, 2000);
@@ -48669,19 +48697,80 @@ function gisModalEdgeResizeSelfTest(){
     const minNeg = gisPanelResizeCompute(down, "e", -10000, 0, 200, 160, 2000, 2000);
     add("EDGE_min_width", minNeg.w === 200 && minNeg.left === 100);
     const host = document.createElement("dialog");
     host.id = "edgeResizeProbeDlg";
     host.className = "app-modal";
-    host.innerHTML = '<div class="app-modal-head" id="edgeResizeProbeHead"></div><div class="gis-panel-resize-handle" data-role="gis-panel-resize" data-handle="se"></div>';
+    host.style.cssText = "position:fixed;left:40px;top:60px;width:400px;height:300px;margin:0;display:block;box-sizing:border-box;z-index:2147483000;";
+    host.innerHTML = '<div class="app-modal-head" id="edgeResizeProbeHead"><div class="app-modal-head-actions"><button type="button" class="app-modal-min-btn" id="edgeResizeProbeMin">-</button><button type="button" class="app-modal-close" id="edgeResizeProbeClose">x</button></div></div><div class="gis-panel-resize-handle" data-role="gis-panel-resize" data-handle="se"></div>';
+    try { if (typeof closeTrackModal === "function") closeTrackModal(); } catch(_){}
+    try { if (typeof closeConvertModal === "function") closeConvertModal(); } catch(_){}
+    try { host.show(); } catch(_){ host.setAttribute("open", ""); }
     document.body.appendChild(host);
     const ensured = gisPanelEnsureEdgeResizeHandles(host);
     const ids = ensured.map(function(el){ return el.getAttribute("data-handle"); }).sort().join(",");
     add("EDGE_8_handles", ids === "e,n,ne,nw,s,se,sw,w", ids);
+    const hr = host.getBoundingClientRect();
+    const nEl = host.querySelector('[data-handle="n"]');
+    const sEl = host.querySelector('[data-handle="s"]');
+    const eEl = host.querySelector('[data-handle="e"]');
+    const wEl = host.querySelector('[data-handle="w"]');
+    const nr = nEl ? nEl.getBoundingClientRect() : { width:0, height:0 };
+    const sr = sEl ? sEl.getBoundingClientRect() : { width:0, height:0 };
+    const er = eEl ? eEl.getBoundingClientRect() : { width:0, height:0 };
+    const wr = wEl ? wEl.getBoundingClientRect() : { width:0, height:0 };
+    add("EDGE_N_full_width", nr.width >= (hr.width - 28) && nr.width > 200 && nr.height <= 16,
+      JSON.stringify({ w: nr.width, h: nr.height, hostW: hr.width }));
+    add("EDGE_S_full_width", sr.width >= (hr.width - 28) && sr.width > 200 && sr.height <= 16,
+      JSON.stringify({ w: sr.width, h: sr.height, hostW: hr.width }));
+    add("EDGE_E_full_height", er.height >= (hr.height - 28) && er.height > 150 && er.width <= 16,
+      JSON.stringify({ w: er.width, h: er.height, hostH: hr.height }));
+    add("EDGE_W_full_height", wr.height >= (hr.height - 28) && wr.height > 150 && wr.width <= 16,
+      JSON.stringify({ w: wr.width, h: wr.height, hostH: hr.height }));
+    const pickHandle = function(x, y, dir){
+      try {
+        const stack = (document.elementsFromPoint && document.elementsFromPoint(x, y)) || [document.elementFromPoint(x, y)];
+        for (let i = 0; i < stack.length; i++){
+          const el = stack[i];
+          if (el && el.getAttribute && el.getAttribute("data-handle") === dir) return el;
+        }
+      } catch(_){}
+      return null;
+    };
+    const midN = pickHandle(hr.left + hr.width / 2, hr.top + 3, "n");
+    const midS = pickHandle(hr.left + hr.width / 2, hr.bottom - 3, "s");
+    const midE = pickHandle(hr.right - 3, hr.top + hr.height / 2, "e");
+    const midW = pickHandle(hr.left + 3, hr.top + hr.height / 2, "w");
+    const isEdge = function(el, dir){
+      return !!(el && el.getAttribute && el.getAttribute("data-handle") === dir);
+    };
+    add("EDGE_mid_N_hit", isEdge(midN, "n"), midN && (midN.getAttribute("data-handle") || midN.id || midN.className));
+    add("EDGE_mid_S_hit", isEdge(midS, "s"), midS && (midS.getAttribute("data-handle") || midS.id || midS.className));
+    add("EDGE_mid_E_hit", isEdge(midE, "e"), midE && (midE.getAttribute("data-handle") || midE.id || midE.className));
+    add("EDGE_mid_W_hit", isEdge(midW, "w"), midW && (midW.getAttribute("data-handle") || midW.id || midW.className));
+    const closeBtn = document.getElementById("edgeResizeProbeClose");
+    const minBtn = document.getElementById("edgeResizeProbeMin");
+    let closeOk = false, minOk = false;
+    if (closeBtn){
+      const cr = closeBtn.getBoundingClientRect();
+      const hit = document.elementFromPoint(cr.left + cr.width / 2, cr.top + cr.height / 2);
+      closeOk = !!(hit && (hit === closeBtn || closeBtn.contains(hit)));
+    }
+    if (minBtn){
+      const mr = minBtn.getBoundingClientRect();
+      const hit = document.elementFromPoint(mr.left + mr.width / 2, mr.top + mr.height / 2);
+      minOk = !!(hit && (hit === minBtn || minBtn.contains(hit)));
+    }
+    add("EDGE_header_controls_clickable", closeOk && minOk, JSON.stringify({ closeOk: closeOk, minOk: minOk }));
+    const defR = (typeof gisPanelDefaultRect === "function") ? gisPanelDefaultRect(host, { pad: 12, defaultW: 400, defaultH: 300 }) : null;
+    const st = (typeof gisPanelSafeTop === "function") ? gisPanelSafeTop({ pad: 12 }) : null;
+    add("EDGE_default_safe_top", !!(defR && Number.isFinite(st) && Math.abs(defR.top - Math.max(12, st)) <= 1),
+      JSON.stringify({ top: defR && defR.top, safeTop: st }));
     const se = host.querySelector('[data-handle="se"]');
     const after = (se && window.getComputedStyle) ? window.getComputedStyle(se, "::after").getPropertyValue("content") : "";
     const afterOk = !after || after === "none" || after === '""' || after === "''";
     add("EDGE_F_no_visible_handle", afterOk, after);
+    try { if (host.close) host.close(); } catch(_){}
     document.body.removeChild(host);
     add("EDGE_G_drag_symbol", typeof gisPanelAttachDrag === "function" && String(gisPanelAttachDrag).indexOf("pointerdown") >= 0);
     add("EDGE_H_min_restore_symbol", typeof gisMinimizePanel === "function" && typeof gisRestoreMinimizedPanel === "function");
     add("EDGE_I_close_symbol", typeof closeFavoritesPanel === "function" && typeof openFavoritesPanel === "function");
     add("EDGE_J_dock_pair_symbol", typeof gisDockReflow === "function" && typeof dflightEnsurePairLayout === "function"
@@ -48741,12 +48830,12 @@ function gisDialogMinHistorySelfTest(){
   const chip = function(pid){
     return !!document.querySelector('#gisMinimizedDock [data-gis-min-panel="' + pid + '"]');
   };
   try {
     add("DH_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("DH_whitelist",
       String(gisMinimizePanel).indexOf('panelId === "convertModal"') >= 0
       && String(gisMinimizePanel).indexOf('panelId === "searchPanel"') >= 0
       && String(gisMinimizePanel).indexOf('panelId === "historyPanel"') >= 0);
     add("DH_history_not_valid_tab",
@@ -48887,12 +48976,12 @@ function gisWorkspaceLegendsFSelfTest(){
   const prevDfH = dfPrev ? !!dfPrev.hidden : null;
   const prevAtmH = atmPrev ? !!atmPrev.hidden : null;
   const prevWs = (_legendWs && typeof _legendWs === "object")
     ? { df: Object.assign({}, _legendWs.df), atm: Object.assign({}, _legendWs.atm) } : null;
   try {
-    add("WSF_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("WSF_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("WSF_two_fns", typeof dflightEnsureRestrictionsLegend === "function"
       && typeof dflightEnsureAtm09UserLegend === "function"
       && typeof legendWorkspaceLayout === "function"
       && typeof legendWorkspaceComputeDefaultPair === "function"
       && typeof legendWorkspaceAttachDrag === "function");
@@ -49103,12 +49192,12 @@ function gisWorkspaceLegendsFix1SelfTest(){
   const prevWs = (_legendWs && typeof _legendWs === "object")
     ? { df: Object.assign({}, _legendWs.df), atm: Object.assign({}, _legendWs.atm) } : null;
   const prevPrev = (_legendWsPrev && typeof _legendWsPrev === "object")
     ? { showAtm: !!_legendWsPrev.showAtm, showDf: !!_legendWsPrev.showDf } : null;
   try {
-    add("WSF1_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("WSF1_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("WSF1_enter_solo_src", (function(){
       const src = String(legendWorkspaceLayout);
       return src.indexOf("enterSoloDf") >= 0 && src.indexOf("wasSoloDf") >= 0
         && src.indexOf("legendWorkspacePlaceSingle") >= 0;
     })());
@@ -49214,12 +49303,12 @@ function gisWorkspaceLegendsFix2SelfTest(){
   const prevWs = (_legendWs && typeof _legendWs === "object")
     ? { df: Object.assign({}, _legendWs.df), atm: Object.assign({}, _legendWs.atm) } : null;
   const prevPrev = (_legendWsPrev && typeof _legendWsPrev === "object")
     ? { showAtm: !!_legendWsPrev.showAtm, showDf: !!_legendWsPrev.showDf } : null;
   try {
-    add("WSF2_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("WSF2_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("WSF2_enter_solo_src", (function(){
       const src = String(legendWorkspaceLayout);
       return src.indexOf("wasSoloDf") >= 0 && src.indexOf("isSoloDf") >= 0
         && src.indexOf("!wasSoloDf") >= 0;
     })());
@@ -79554,13 +79643,15 @@ function gisPanelDefaultRect(root, opts){
   const wWant = Number.isFinite(opts.defaultW) ? opts.defaultW : GIS_PANEL_DEFAULTS.defaultW;
   let hWant = Number.isFinite(opts.defaultH) ? opts.defaultH : null;
   if (!Number.isFinite(hWant)) hWant = gisPanelDefaultHeightPx(opts);
   const w = Math.min(maxW, Math.max(minW, wWant));
   const h = Math.min(maxH, Math.max(minH, hWant));
-  // Default placement: bottom-left.
+  // Default placement: top-left under live chrome (MODAL-OPEN-TOP-ALIGN / EDGE-FIX1).
+  // Touched/saved/restored layouts still win via gisPanelApplyLayout.
   const left = pad;
-  const top = Math.max(pad, vh - h - pad);
+  const safeTop = (typeof gisPanelSafeTop === "function") ? gisPanelSafeTop(opts) : pad;
+  const top = Math.max(pad, safeTop);
   return gisPanelClampRect({ left, top, w, h }, { pad, minW, minH, maxW, maxH });
 }
 /** UX-NEXT-RUNTIME-BUNDLE-D: session-only reset of panel width from e/w handles (double-click). */
 function gisPanelResetEwWidth(root, opts, handle){
   if (!root) return;
@@ -87551,12 +87642,12 @@ function routingAvoidAreasSelfTest(){
   };
   const prevAreas = (_routingAvoidSession.areas || []).slice();
   const prevDraw = _routingAvoidSession.drawActive;
   const prevDraft = _routingAvoidSession.draft;
   try {
-    add("RAA_build_220", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("RAA_build_220", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("RAA_ors_gateway_base", typeof ROUTING_ORS_GATEWAY_BASE === "string" && ROUTING_ORS_GATEWAY_BASE.indexOf("api.openrouteservice") < 0);
     add("RAA_ors_no_auto_fallback", typeof routingCalculateRoute === "function" && typeof routingIsOrsService === "function");
     add("RAA_capability_flags", ROUTING_AVOID_GH_ALT_WITH_AVOID === true && ROUTING_AVOID_GH_ROUND_TRIP_WITH_AVOID === true);
     add("RAA_validate_min", (function(){
       const v = routingAvoidValidateVertices([{ lat: 44.1, lon: 9.8 }, { lat: 44.11, lon: 9.81 }]);
@@ -90232,12 +90323,12 @@ function routingProviderCompareSelfTest(){
   const checks = [];
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
-    add("RPC_build_222", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("RPC_build_222", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     add("RPC_no_boot_start", _routingCompareSession.startedAt === 0 && !_routingCompareSession.loading);
     add("RPC_cta_fn", typeof routingCompareStart === "function" && typeof routingCompareChoose === "function");
     add("RPC_auto_no_ors", routingCompareAutoCandidates().indexOf("ors") < 0
       && routingCompareAutoCandidates().indexOf("local") >= 0);
     const hike = ROUTING_COMPARE_PROFILE_PAIRS[0];
@@ -90364,14 +90455,14 @@ function routingCompareFix1SelfTest(){
   const prevAvoid = _routingAvoidSession.areas;
   const prevGh = _routingCompareSession.gh;
   const prevOrs = _routingCompareSession.ors;
   const prevChosen = _routingCompareSession.chosen;
   try {
-    add("RPCF1_build_222", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
-    add("RPCF2_build_223", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A"
+    add("RPCF1_build_222", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("RPCF2_build_223", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1"
       && typeof routingAlternativesAllowed === "function");
     const cta = document.getElementById("routingCompareBtn");
     add("RPCF1_cta_primary", !!(cta && cta.classList.contains("btn-primary") && cta.id === "routingCompareBtn"));
     add("RPCF1_swatch_gh", !!document.querySelector("#routingCompareLegend .routing-swatch-gh"));
     add("RPCF1_swatch_ors", !!document.querySelector("#routingCompareLegend .routing-swatch-ors"));
@@ -90657,12 +90748,12 @@ function routingCompareFix3SelfTest(){
   const prevOrs = _routingCompareSession.ors;
   const prevChosen = _routingCompareSession.chosen;
   const wp0 = Array.isArray(state.mapWaypoints) ? state.mapWaypoints.slice() : [];
   const poly0 = Array.isArray(state.gisPolygons) ? state.gisPolygons.slice() : [];
   try {
-    add("RPCF3_build_224", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("RPCF3_build_224", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     const ptsEl = document.getElementById("routingPointsList");
     const zone = document.getElementById("routingRouteOptionsZone");
     const cmp = document.getElementById("routingCompareSection");
     const alt = document.getElementById("routingAlternativesRow");
     const modeRow = document.getElementById("routingModeRow");
@@ -90832,12 +90923,12 @@ function routingCompareFix4SelfTest(){
   const poly0 = Array.isArray(state.gisPolygons) ? state.gisPolygons.slice() : [];
   const savedChosen = _routingCompareSession.chosen;
   const savedGh = _routingCompareSession.gh;
   const savedOrs = _routingCompareSession.ors;
   try {
-    add("RPCF4_build_225", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("RPCF4_build_225", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     const params = document.getElementById("routingParamsRow");
     const prof = document.getElementById("routingProfileSelect");
     const speed = document.getElementById("routingSpeedSelect");
     const calc = document.getElementById("routingCalculateBtn");
     add("RPCF4_params_group", !!(params && prof && speed && calc && params.contains(prof) && params.contains(speed) && params.contains(calc)));
@@ -90932,12 +91023,12 @@ function routingRingWarnFix1SelfTest(){
   const savedMode = routingGetRouteMode();
   const savedCoords = Array.isArray(r.previewCoordinates) ? r.previewCoordinates.slice() : null;
   const savedWarn = (typeof r.ringSemanticWarn === "boolean") ? r.ringSemanticWarn : null;
   const savedWarnKey = r.roundTripWarnKey || "";
   try {
-    add("RWF1_build_226", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("RWF1_build_226", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     try { routingSetRouteMode("round_trip"); } catch(_){}
     const oab = [];
     for (let i = 0; i < 10; i++) oab.push({ lat: 44.1, lon: 9.82 + i * 0.002 });
     for (let i = 9; i >= 0; i--) oab.push({ lat: 44.1, lon: 9.82 + i * 0.002 });
     r.previewCoordinates = oab.slice();
@@ -90993,12 +91084,12 @@ function routingCompareFix6SelfTest(){
   const checks = [];
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
-    add("RPCF6_build_228", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("RPCF6_build_228", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     const params = document.getElementById("routingParamsRow");
     const modeGroup = document.getElementById("routingModeGroup");
     const modeRow = document.getElementById("routingModeRow");
     const chipsHost = modeGroup ? modeGroup.querySelector(".routing-mode-chips") : null;
     const chips = modeGroup ? modeGroup.querySelectorAll("[data-routing-mode]") : [];
@@ -91129,12 +91220,12 @@ function routingCompareFix5SelfTest(){
   const savedMetrics = r.routeMetrics;
   const savedAlts = r.alternatives;
   const savedProv = r.previewStyleProvider;
   const savedOverlay = r.activeOverlayKey;
   try {
-    add("RPCF5_build_follows_app", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
+    add("RPCF5_build_follows_app", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
     const params = document.getElementById("routingParamsRow");
     const prof = document.getElementById("routingProfileSelect");
     const speed = document.getElementById("routingSpeedSelect");
     const calc = document.getElementById("routingCalculateBtn");
     const modeGroup = document.getElementById("routingModeGroup");
`

---
END REVIEW PACKAGE — MAIN MUST REMAIN cde80223c51b8ff6969ebb58fe1e78712a810b58 — NO DEPLOY
