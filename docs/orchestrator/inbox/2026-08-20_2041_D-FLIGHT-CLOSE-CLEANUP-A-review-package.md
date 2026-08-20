# REVIEW PACKAGE — D-FLIGHT-CLOSE-CLEANUP-A (build 234)

BLOCK-ID: D-FLIGHT-CLOSE-CLEANUP-A  
PHASE: IMPLEMENT → LOCAL QA → REVIEW PACKAGE  
CLOSURE: NONE  
MAIN WRITE: FORBIDDEN · DEPLOY: FORBIDDEN · FINITO: FORBIDDEN

## Identifiers

- BASE_FULL_SHA: 18aa41a8c625d67ea1a5e7c213fff4097790e751
- CANDIDATE_FULL_SHA: ea8370460ae133fbba2592235277a9cc1f7d9d1e
- BRANCH: review/D-FLIGHT-CLOSE-CLEANUP-A-234
- APP_BUILD_NUM: 234
- APP_BUILD_ID: D-FLIGHT-CLOSE-CLEANUP-A
- CANDIDATE_BLOB: 7232d08e1452bbea4563fe096fa71342b2cb2b63
- Monolite bytes (candidate): 10816055
- Monolite lines (candidate): 100544

## Ownership A/B

### A) Appartiene alla sessione chiusa — rimosso/spento al close completo
- Overlay zone SVG / hit-layer / temporal fx DOM (dflightSetOverlayVisible(false))
- Visibilità overlay _dflightOverlayVisible
- ATM09 preferred paint + info/fx/legend presentation (dflightAtm09SetPreferred(false))
- Master UI ATM09 _dflightAtm09MasterUi = false (solo al close completo)
- Legende mappa #dflightRestrictionsLegend / #dflightAtm09UserLegend (hidden + clear items DF)
- Selection _dflightSelectedZoneId + Details panel
- Auto-refresh timer
- Flag _dflightRestoreOverlayOnPanelReopen = false (niente auto-resurrezione)

### B) Globale / indipendente — preservato
- _dflightClientSession / dataset in-memory (nessuna cancellazione nel lifecycle)
- _dflightOverlaySession reference (tenuta; non ridisegna se visible=false)
- Waypoint / gisTracks / gisPolygons / overlay non D-Flight
- Minimize/restore path (gisMinimizePanel) — **non** chiama dflightPanelCloseLifecycle
- show/showModal/aria-modal selectors invariati

## Local QA evidence

- Build 234 / ID PASS
- Close con sessione seeded: overlay assente, legende hidden, ATM preferred/master OFF, panel chiuso
- Restore flag false; client session preservata
- Network delta gesture close = 0
- Reopen senza resurrezione automatica overlay/ATM09
- Minimize: overlay/preferred restano ON
- Close dopo restore: cleanup completo PASS
- Isolamento waypoint/tracce/poligoni PASS
- Offline convert smoke PASS
- Console uncaught attribuibili: 0
- Selftest H close-related (VR_FIX2/CC_*): **27/27 PASS**
- Failure H residua FIX3_D4_resize_handles_anchored: **pre-esistente su BASE 233** (stesso fail)

## Lifecycle evidence (diff)

- Funzioni toccate: dflightPanelCloseLifecycle, dflightOpenControlPanel, dflightAtm09SyncPreferredFromUi, APP_BUILD_*, selftest VR_FIX2/CC
- Minimize wiring invariata (gisMinimizePanel only)
- dflightAtm09SyncPreferredFromUi richiede _dflightPanelOpen (minimize lascia il flag true)

## Remote refs (pre-docs package)

`
18aa41a8c625d67ea1a5e7c213fff4097790e751	refs/heads/main
ea8370460ae133fbba2592235277a9cc1f7d9d1e	refs/heads/review/D-FLIGHT-CLOSE-CLEANUP-A-234
origin	https://github.com/mrhz1973/cursor-coordinate-converter.git (fetch)
origin	DISABLED_PUSH (push)
`

## git show --format=fuller --stat

`
commit ea8370460ae133fbba2592235277a9cc1f7d9d1e
Author:     Martino Tuso <53308962+mrhz1973@users.noreply.github.com>
AuthorDate: Thu Aug 20 20:40:52 2026 +0200
Commit:     Martino Tuso <53308962+mrhz1973@users.noreply.github.com>
CommitDate: Thu Aug 20 20:40:52 2026 +0200

    fix(dflight): clear session map visuals on complete panel close, build 234
    
    Co-authored-by: Cursor <cursoragent@cursor.com>

 coordinate_converter Claude.html | 203 ++++++++++++++++++++++-----------------
 1 file changed, 117 insertions(+), 86 deletions(-)
`

## git diff parent candidate --check

`
(empty — PASS)
`

## DIFF COMPLETO — coordinate_converter Claude.html (unified=5)

`diff
diff --git a/coordinate_converter Claude.html b/coordinate_converter Claude.html
index 8bb4133..7232d08 100644
--- a/coordinate_converter Claude.html	
+++ b/coordinate_converter Claude.html	
@@ -24303,14 +24303,14 @@ function fmtMils(deg){ return Math.round(degToMils(deg)).toString(); }
 const STORAGE_KEY = "coordconv_v2";
 const UI_STORAGE_KEY = "coordconv_ui_v1";
 /** Strong-confirm word for full local wipe (same in IT/EN/FR UI). */
 const APP_FULL_RESET_CONFIRM_WORD = "CANCELLA";
 /** Visible runtime build label — update before each runtime `finito`. */
-const APP_BUILD_ID = "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1";
-const APP_BUILD_DETAIL = "FIX1: hit-zone N/S/E/W a tutta lunghezza; first-open sotto chrome (safeTop); grip invisibile.";
+const APP_BUILD_ID = "D-FLIGHT-CLOSE-CLEANUP-A";
+const APP_BUILD_DETAIL = "Close completa Zone D-Flight: cleanup overlay/zone/legende sessione; minimize invariato.";
 /** Monotonic runtime build counter — increment on each runtime patch (not persisted). */
-const APP_BUILD_NUM = 233;
+const APP_BUILD_NUM = 234;
 const APP_BUILD_LABEL = APP_BUILD_ID + " · build " + APP_BUILD_NUM + " — " + APP_BUILD_DETAIL;
 function applyAppBuildLabel(){
   try {
     const buildDisp = APP_BUILD_ID + " · build " + APP_BUILD_NUM;
     document.title = "TMART GIS tool · " + buildDisp;
@@ -38118,30 +38118,52 @@ function dflightWireFloatingPanel(dlg, kind){
     try { if (typeof gisPanelSyncBodySize === "function") gisPanelSyncBodySize(dlg, opts); } catch(__){}
   }
 }
 
 /**
- * FIX2 real-close lifecycle (X / Esc / callers of dflightCloseControlPanel).
- * Minimize must NOT call this. Preserves dataset/session; hides map D-Flight visuals.
+ * D-FLIGHT-CLOSE-CLEANUP-A — complete-close lifecycle (X / Esc / dflightCloseControlPanel).
+ * Minimize must NOT call this.
+ * Tears down session-owned map visuals (zones/overlays/legends/ATM09 paint).
+ * Preserves in-memory client dataset; does NOT auto-restore visuals on reopen.
  */
 function dflightPanelCloseLifecycle(){
   const dlg = document.getElementById("dflightPanel");
   if (dlg){
     try { dlg.close(); } catch(_){ try { dlg.removeAttribute("open"); } catch(__){} }
   }
   _dflightPanelOpen = false;
   try { if (typeof gisClearPanelMinimizeUi === "function") gisClearPanelMinimizeUi("dflightPanel"); } catch(_){}
   try { dflightClearAutoRefreshTimer(); } catch(_){}
-  /* Remember pre-close overlay visibility for reopen (session-only; not persisted). */
-  _dflightRestoreOverlayOnPanelReopen = !!_dflightOverlayVisible;
+  /* CLEANUP-A: never auto-resurrect map visuals on the next open. */
+  _dflightRestoreOverlayOnPanelReopen = false;
+  _dflightSelectedZoneId = null;
+  try { if (typeof dflightCloseDetailsPanel === "function") dflightCloseDetailsPanel(); } catch(_){}
   try {
-    if (typeof dflightSetOverlayVisible === "function"){
-      /* Canonical OFF: removes native SVG, ATM09 preferred/tiles via SyncPreferred+render,
-         ATM09 info hit overlay, selection, and Details panel. Session/dataset untouched. */
-      dflightSetOverlayVisible(false);
+    if (typeof dflightSetOverlayVisible === "function") dflightSetOverlayVisible(false);
+  } catch(_){}
+  /* Drop ATM09 paint ownership for this closed session (Master UI + preferred). */
+  try { _dflightAtm09MasterUi = false; } catch(_){}
+  try {
+    if (typeof dflightAtm09SetPreferred === "function") dflightAtm09SetPreferred(false);
+  } catch(_){}
+  try {
+    const dfLeg = document.getElementById("dflightRestrictionsLegend");
+    if (dfLeg){
+      try { dfLeg.hidden = true; } catch(_){}
+      const ul = dfLeg.querySelector("ul");
+      if (ul) try { ul.innerHTML = ""; } catch(_){}
     }
+    const atmLeg = document.getElementById("dflightAtm09UserLegend");
+    if (atmLeg) try { atmLeg.hidden = true; } catch(_){}
   } catch(_){}
+  try {
+    if (typeof dflightSyncContextualLegends === "function") dflightSyncContextualLegends();
+  } catch(_){}
+  try {
+    if (typeof legendWorkspaceLayout === "function") legendWorkspaceLayout("close-cleanup");
+  } catch(_){}
+  try { if (typeof dflightSyncPanelUi === "function") dflightSyncPanelUi(); } catch(_){}
 }
 
 function dflightOpenControlPanel(){
   const dlg = document.getElementById("dflightPanel");
   if (!dlg) return false;
@@ -38155,17 +38177,18 @@ function dflightOpenControlPanel(){
   try { dflightEnsureClientWired(); } catch(_){}
   try { dflightSyncPanelUi(); } catch(_){}
   try { dflightMaybeAutoloadOnPanelOpen(); } catch(_){}
   try {
     if (dflightHasSessionDataset()){
-      /* Restore overlay only if it was ON before the last real close (not if user had toggled OFF). */
+      /* CLEANUP-A: restore flag is always false after complete close; keep branch for safety. */
       const wantRestore = !!_dflightRestoreOverlayOnPanelReopen;
       _dflightRestoreOverlayOnPanelReopen = false;
       if (wantRestore && !_dflightOverlayVisible && typeof dflightSetOverlayVisible === "function"){
         dflightSetOverlayVisible(true);
       }
-      if (_dflightOverlayVisible || _dflightAtm09Preferred || _dflightAtm09MasterUi){
+      /* Do not auto-start ATM09 from MasterUi alone after a complete close. */
+      if (_dflightOverlayVisible || _dflightAtm09Preferred){
         dflightMaybeStartAtm09AfterDatasetReady({ source: "reopen" });
       }
     }
   } catch(_){}
   try { dflightEnsureAutoRefreshTimer(); } catch(_){}
@@ -39684,12 +39707,12 @@ function dflightSelfTestF(){
         try { dflightSyncClientCtaState(); } catch(_){}
       }
     })());
 
     add("F_mvisa_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
 
     _dflightHelperBaseUrlOverride = "http://example.test:8010";
     if (typeof state !== "undefined") state.forceOffline = true;
     let gatedCalled = false;
     _dflightFetchImpl = function(){ gatedCalled = true; return Promise.resolve({ ok: true, status: 200, text: function(){ return Promise.resolve("{}"); }, headers: { get: function(){ return null; } } }); };
@@ -40706,12 +40729,12 @@ function dflightSelfTestTf(){
       String(dflightSyncAdaptivePanelGeometry).indexOf("dflightClampPanelTop") >= 0
       && String(dflightSyncAdaptivePanelGeometry).indexOf("dflightComputePanelUsableRect") >= 0
       && String(dflightEnsurePanelGeometryResize).indexOf("dflightSyncAdaptivePanelGeometry") >= 0);
 
     add("Tf_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
   } catch (e){
     add("selftest_tf_exception", false, String(e && e.message ? e.message : e));
   } finally {
     for (let i = 0; i < DFLIGHT_TEMPORAL_STATES.length; i++){
       const s = DFLIGHT_TEMPORAL_STATES[i];
@@ -41183,11 +41206,13 @@ function dflightAtm09SetPreferred(on){
 
 /* MASTER-VIS-A: preferred depends ONLY on the ATM09 master + existing gates (network/OPSEC/offline,
    helper availability, session dataset). Never on the D-Flight overlay (_dflightOverlayVisible)
    nor on the temporal filters. An ON master never authorizes network when gates forbid it. */
 function dflightAtm09SyncPreferredFromUi(){
-  const want = !!(_dflightAtm09MasterUi
+  /* CLEANUP-A: while control panel is fully closed, do not re-arm ATM09 paint. */
+  const want = !!(_dflightPanelOpen
+    && _dflightAtm09MasterUi
     && dflightHasSessionDataset()
     && dflightClientNetworkAllowed()
     && dflightHelperBaseUrl());
   if (want !== _dflightAtm09Preferred) dflightAtm09SetPreferred(want);
   else if (want){
@@ -42634,12 +42659,12 @@ function dflightSelfTestH(){
         if (Object.prototype.hasOwnProperty.call(state, "_dflightUiPhase")) return false;
         return true;
       } catch(_){ return false; }
     })());
 
-    add("H_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("H_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("VR_FIX1_sync_loading_passes_zoom", (function(){
       if (typeof dflightSyncLoadingUi !== "function") return false;
       const src = String(dflightSyncLoadingUi);
       return src.indexOf("dflightAtm09IsEligibleForStart(atmZoom)") >= 0
         && src.indexOf("dflightAtm09OverlayVisible(atmZoom)") >= 0
@@ -42666,17 +42691,20 @@ function dflightSelfTestH(){
     add("VR_FIX2_open_restores_overlay_source", (function(){
       if (typeof dflightOpenControlPanel !== "function") return false;
       const src = String(dflightOpenControlPanel);
       return src.indexOf("_dflightRestoreOverlayOnPanelReopen") >= 0
         && src.indexOf("dflightSetOverlayVisible(true)") >= 0
-        && src.indexOf("dflightMaybeStartAtm09AfterDatasetReady") >= 0;
+        && src.indexOf("dflightMaybeStartAtm09AfterDatasetReady") >= 0
+        && src.indexOf("_dflightAtm09MasterUi") < 0;
     })());
-    add("VR_FIX2_close_lifecycle_sets_restore_flag", (function(){
+    add("CC_close_lifecycle_source", (function(){
       if (typeof dflightPanelCloseLifecycle !== "function") return false;
       const src = String(dflightPanelCloseLifecycle);
-      return src.indexOf("_dflightRestoreOverlayOnPanelReopen") >= 0
+      return src.indexOf("_dflightRestoreOverlayOnPanelReopen = false") >= 0
         && src.indexOf("dflightSetOverlayVisible(false)") >= 0
+        && src.indexOf("dflightAtm09SetPreferred(false)") >= 0
+        && src.indexOf("_dflightAtm09MasterUi = false") >= 0
         && src.indexOf("_dflightClientSession") < 0;
     })());
 
     /* VISUAL-READY-A: pure/static + stubbed post-apply start (no live helper network). */
     add("VR_helpers_present", typeof dflightMaybeStartAtm09AfterDatasetReady === "function"
@@ -42913,34 +42941,37 @@ function dflightSelfTestH(){
           add("VR_FIX2_minimize_keeps_overlay", visBeforeMin === true && _dflightOverlayVisible === true);
           add("VR_FIX2_minimize_keeps_atm_pref", prefBeforeMin === true && _dflightAtm09Preferred === true);
           add("VR_FIX2_minimize_keeps_details", detailsBeforeMin === true && _dflightDetailsOpen === true);
           add("VR_FIX2_minimize_no_restore_flag_change", _dflightRestoreOverlayOnPanelReopen === restoreBeforeMin);
 
-          /* Close with overlay ON → restore flag true, overlay OFF, session kept, details closed. */
+          /* CLEANUP-A: Close with overlay ON → visuals OFF, no restore flag, client session kept. */
           setVisCalls = []; detailsCloseN = 0;
           _dflightOverlayVisible = true;
           _dflightAtm09Preferred = true;
+          _dflightAtm09MasterUi = true;
           _dflightDetailsOpen = true;
-          _dflightRestoreOverlayOnPanelReopen = false;
+          _dflightRestoreOverlayOnPanelReopen = true;
           const sessBefore = _dflightClientSession;
           const ovSessBefore = _dflightOverlaySession;
           dflightCloseControlPanel();
           add("VR_FIX2_close_calls_hide", setVisCalls.length >= 1 && setVisCalls[setVisCalls.length-1] === false);
           add("VR_FIX2_close_overlay_off", _dflightOverlayVisible === false);
-          add("VR_FIX2_close_keeps_session", _dflightClientSession === sessBefore && _dflightOverlaySession === ovSessBefore);
+          add("VR_FIX2_close_keeps_session", _dflightClientSession === sessBefore);
+          add("CC_close_keeps_overlay_session_ref", _dflightOverlaySession === ovSessBefore);
           add("VR_FIX2_close_panel_flag_off", _dflightPanelOpen === false);
-          add("VR_FIX2_close_restore_flag_true", _dflightRestoreOverlayOnPanelReopen === true);
+          add("CC_close_restore_flag_false", _dflightRestoreOverlayOnPanelReopen === false);
           add("VR_FIX2_close_closes_details", detailsCloseN >= 1 && _dflightDetailsOpen === false);
           add("VR_FIX2_close_atm_pref_off", _dflightAtm09Preferred === false);
+          add("CC_close_master_ui_off", _dflightAtm09MasterUi === false);
 
-          /* Reopen with restore=true → overlay ON + at most one maybeStart. */
+          /* CLEANUP-A: Reopen must NOT auto-resurrect overlay/ATM09. */
           setVisCalls = []; maybeStartN = 0;
           dflightOpenControlPanel();
-          add("VR_FIX2_open_restores_visible", setVisCalls.indexOf(true) >= 0 && _dflightOverlayVisible === true);
+          add("CC_open_no_auto_restore", setVisCalls.indexOf(true) < 0 && _dflightOverlayVisible === false);
           add("VR_FIX2_open_panel_flag_on", _dflightPanelOpen === true);
           add("VR_FIX2_open_restore_flag_cleared", _dflightRestoreOverlayOnPanelReopen === false);
-          add("VR_FIX2_open_maybe_start_once", maybeStartN === 1);
+          add("CC_open_no_atm_autostart", maybeStartN === 0);
 
           /* Close with overlay already OFF → restore flag false; reopen keeps OFF. */
           setVisCalls = []; maybeStartN = 0;
           _dflightOverlayVisible = false;
           _dflightAtm09Preferred = false;
@@ -43135,12 +43166,12 @@ function dflightSelfTestHitFixA(){
   const prevAtm09Pref = _dflightAtm09Preferred;
   const prevUnavail = _dflightAtm09InfoUnavailable;
   const prevBase = _dflightHelperBaseUrlOverride;
   try {
     add("HitA_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
 
     add("HitA_css_hit_fill", (function(){
       const srcFn = String(dflightDrawOverlayDom) + String(dflightAttachClickHandler);
       return srcFn.indexOf("dflight-volume-hit") >= 0
         && srcFn.indexOf("dflight-zone-hitlayer") >= 0;
@@ -44149,12 +44180,12 @@ function dflightSelfTestOptB(){
     _dflightAtm09SubdivCache = [];
     _dflightAtm09InfoLastFetchStats = null;
     _dflightAtm09InfoLastFailReason = null;
 
     add("OptB_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
 
     add("OptB_constants",
       DFLIGHT_ATM09_SUBDIV_MAX_DEPTH === 2
       && DFLIGHT_ATM09_SUBDIV_MAX_REQUESTS === 21
       && DFLIGHT_ATM09_SUBDIV_CONCURRENCY === 3
@@ -44587,12 +44618,12 @@ function dflightSelfTestOptB(){
         try { if (typeof dflightAtm09SyncTemporalContextUi === "function") dflightAtm09SyncTemporalContextUi(); } catch(_){}
         try { if (typeof dflightRedrawOverlayFromSession === "function") dflightRedrawOverlayFromSession(tm); } catch(_){}
       }
     })());
 
-    add("OptB_FIX5_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("OptB_FIX5_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
 
     add("OptB_FIX2_any_enabled_all_on", (function(){
       for (let i = 0; i < DFLIGHT_TEMPORAL_STATES.length; i++) _dflightTemporalFilter[DFLIGHT_TEMPORAL_STATES[i]] = true;
       return typeof dflightTemporalFilterAnyEnabled === "function" && dflightTemporalFilterAnyEnabled() === true;
     })());
@@ -45179,12 +45210,12 @@ function dflightSelfTestMVISA(){
     dflightAtm09EnsureLegend = function(){ /* MVISA selftest no-op */ };
     _dflightClientSession = { normalizedDataset: { ok: true, zones: [] } };
     _dflightOverlaySession = { dataset: { ok: true, zones: [] } };
 
     add("MVISA_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
 
     add("MVISA_ui_label_exact", (function(){
       const lbl = document.getElementById("dflightAtm09MasterLabel");
       const tgl = document.getElementById("dflightAtm09MasterToggle");
       return !!(tgl && lbl && lbl.textContent.replace(/\s+/g, " ").trim() === "Mostra overlay ATM09 ufficiale"
@@ -46146,12 +46177,12 @@ function dflightSelfTestIMPLA(){
     /* Ensure the external user legend DOM exists before arbitration checks. */
     try { dflightEnsureAtm09UserLegend(); } catch(_){}
 
     add("IMPLA_api", typeof dflightLegendPaintMode === "function" && typeof dflightSyncContextualLegends === "function");
     add("IMPLA_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
 
     /* A: D ON / ATM OFF — F: restrictions overlay on map; in-panel hidden */
     add("IMPLA_A", (function(){
       _dflightAtm09MasterUi = false;
       _dflightAtm09Preferred = false;
@@ -46316,12 +46347,12 @@ function dflightSelfTestLEGENDUX(){
     _dflightOverlaySession = { dataset: ds };
     _dflightAtm09InfoUnavailable = false;
     dflightEnsureAtm09UserLegend();
 
     add("LEGENDUX_build_201",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
 
     /* SELFTEST 1+2: row count and canonical order */
     const rows = ulRoot ? ulRoot.querySelectorAll("ul li") : [];
     add("LEGENDUX_row_count_8", rows.length === 8, "rows=" + rows.length);
     const wantLabels = DFLIGHT_ATM09_USER_LEGEND_ROWS.map(function(r){ return r.label; });
@@ -46745,12 +46776,12 @@ function dflightSelfTestSideBySide(){
     try { if (prevUsable) dflightComputePanelUsableRect = prevUsable; } catch(_){}
     geomStubbed = false;
   }
   try {
     add("SBS_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("SBS_fn_present", typeof dflightEnsurePairLayout === "function");
     add("SBS_L_no_localStorage", (function(){
       const src = String(dflightEnsurePairLayout);
       return src.indexOf("setTimeout") < 0 && src.indexOf("localStorage") < 0;
     })());
@@ -47134,12 +47165,12 @@ function brandingSelfTestTmartImplA(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("BRAND_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
 
     const main = document.querySelector(".brand-main");
     const by = document.querySelector(".brand-by");
     const sig = document.querySelector(".brand-signature");
     add("BRAND_header_visible",
@@ -47262,12 +47293,12 @@ function gisDockSelfTestGA1(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("DOCK_GA1_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("DOCK_GA1_api",
       typeof gisDockReflow === "function"
       && typeof gisRenderMinimizedDock === "function"
       && typeof gisMinimizePanel === "function"
       && typeof gisRestoreMinimizedPanel === "function"
@@ -47438,12 +47469,12 @@ function gisPanelSafeTopSelfTestFix1(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("SAFE_TOP_FIX1_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("SAFE_TOP_FIX1_api",
       typeof gisPanelSafeTop === "function"
       && typeof gisPanelClampRectPartialVisible === "function"
       && typeof gisPanelNudgeOpenPanelsToSafeTop === "function");
     add("SAFE_TOP_FIX1_neg_pair_in_clamp",
@@ -47571,12 +47602,12 @@ function gisPanelSafeTopSelfTestFix2(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("SAFE_TOP_FIX2_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("SAFE_TOP_FIX2_src_uses_dock",
       String(gisPanelSafeTop).indexOf("gisMinimizedDock") >= 0
       && String(gisPanelSafeTop).indexOf("Math.max") >= 0);
     add("SAFE_TOP_FIX2_reflow_calls_nudge",
       String(gisDockReflow).indexOf("gisPanelNudgeOpenPanelsToSafeTop") >= 0);
@@ -47809,12 +47840,12 @@ function gisDockSelfTestGB(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("DOCK_GB_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("DOCK_GB_workbench_branch",
       String(gisMinimizePanel).indexOf('panelId === "gisWorkbenchPanel"') >= 0);
     add("DOCK_GB_ordinary_ids_len",
       Array.isArray(G_B_ORDINARY_IDS) && G_B_ORDINARY_IDS.length === 11
       && G_B_ORDINARY_IDS.indexOf("gisWorkbenchPanel") >= 0);
@@ -48118,12 +48149,12 @@ function gisDockSelfTestGC(){
       if (fn) fn();
     } catch(_){}
   };
   try {
     add("DOCK_GC_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("DOCK_GC_symbols",
       typeof offlinePanelMinimizeForBbox === "function"
       && typeof offlinePanelRestoreAfterBbox === "function"
       && typeof polygonDrawMinimizeIfOpen === "function"
       && typeof polygonDrawRestoreIfAutoMinimized === "function"
@@ -48411,12 +48442,12 @@ function gisDockSelfTestGD(){
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
     add("DOCK_GD_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("DOCK_GD_api",
       typeof gisDockPlanSlots === "function"
       && typeof gisDockMeasureHeader === "function"
       && typeof gisDockReflow === "function"
       && typeof gisRenderMinimizedDock === "function");
@@ -48672,12 +48703,12 @@ function gisModalEdgeResizeSelfTest(){
   const checks = [];
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail == null ? "" : String(detail) });
   };
   try {
-    add("EDGE_build_233", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("EDGE_build_234", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("EDGE_compute_fn", typeof gisPanelResizeCompute === "function" && typeof gisPanelEnsureEdgeResizeHandles === "function");
     const down = { startL: 100, startT: 80, startW: 400, startH: 300 };
     const rE = gisPanelResizeCompute(down, "e", 40, 0, 200, 160, 2000, 2000);
     add("EDGE_A_right", rE.w === 440 && rE.left === 100 && rE.top === 80 && rE.h === 300, JSON.stringify(rE));
     const rW = gisPanelResizeCompute(down, "w", 40, 0, 200, 160, 2000, 2000);
@@ -48830,12 +48861,12 @@ function gisDialogMinHistorySelfTest(){
   const chip = function(pid){
     return !!document.querySelector('#gisMinimizedDock [data-gis-min-panel="' + pid + '"]');
   };
   try {
     add("DH_build_214",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("DH_whitelist",
       String(gisMinimizePanel).indexOf('panelId === "convertModal"') >= 0
       && String(gisMinimizePanel).indexOf('panelId === "searchPanel"') >= 0
       && String(gisMinimizePanel).indexOf('panelId === "historyPanel"') >= 0);
     add("DH_history_not_valid_tab",
@@ -48976,12 +49007,12 @@ function gisWorkspaceLegendsFSelfTest(){
   const prevDfH = dfPrev ? !!dfPrev.hidden : null;
   const prevAtmH = atmPrev ? !!atmPrev.hidden : null;
   const prevWs = (_legendWs && typeof _legendWs === "object")
     ? { df: Object.assign({}, _legendWs.df), atm: Object.assign({}, _legendWs.atm) } : null;
   try {
-    add("WSF_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("WSF_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("WSF_two_fns", typeof dflightEnsureRestrictionsLegend === "function"
       && typeof dflightEnsureAtm09UserLegend === "function"
       && typeof legendWorkspaceLayout === "function"
       && typeof legendWorkspaceComputeDefaultPair === "function"
       && typeof legendWorkspaceAttachDrag === "function");
@@ -49192,12 +49223,12 @@ function gisWorkspaceLegendsFix1SelfTest(){
   const prevWs = (_legendWs && typeof _legendWs === "object")
     ? { df: Object.assign({}, _legendWs.df), atm: Object.assign({}, _legendWs.atm) } : null;
   const prevPrev = (_legendWsPrev && typeof _legendWsPrev === "object")
     ? { showAtm: !!_legendWsPrev.showAtm, showDf: !!_legendWsPrev.showDf } : null;
   try {
-    add("WSF1_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("WSF1_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("WSF1_enter_solo_src", (function(){
       const src = String(legendWorkspaceLayout);
       return src.indexOf("enterSoloDf") >= 0 && src.indexOf("wasSoloDf") >= 0
         && src.indexOf("legendWorkspacePlaceSingle") >= 0;
     })());
@@ -49303,12 +49334,12 @@ function gisWorkspaceLegendsFix2SelfTest(){
   const prevWs = (_legendWs && typeof _legendWs === "object")
     ? { df: Object.assign({}, _legendWs.df), atm: Object.assign({}, _legendWs.atm) } : null;
   const prevPrev = (_legendWsPrev && typeof _legendWsPrev === "object")
     ? { showAtm: !!_legendWsPrev.showAtm, showDf: !!_legendWsPrev.showDf } : null;
   try {
-    add("WSF2_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("WSF2_build_217", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("WSF2_enter_solo_src", (function(){
       const src = String(legendWorkspaceLayout);
       return src.indexOf("wasSoloDf") >= 0 && src.indexOf("isSoloDf") >= 0
         && src.indexOf("!wasSoloDf") >= 0;
     })());
@@ -87642,12 +87673,12 @@ function routingAvoidAreasSelfTest(){
   };
   const prevAreas = (_routingAvoidSession.areas || []).slice();
   const prevDraw = _routingAvoidSession.drawActive;
   const prevDraft = _routingAvoidSession.draft;
   try {
-    add("RAA_build_220", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("RAA_build_220", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("RAA_ors_gateway_base", typeof ROUTING_ORS_GATEWAY_BASE === "string" && ROUTING_ORS_GATEWAY_BASE.indexOf("api.openrouteservice") < 0);
     add("RAA_ors_no_auto_fallback", typeof routingCalculateRoute === "function" && typeof routingIsOrsService === "function");
     add("RAA_capability_flags", ROUTING_AVOID_GH_ALT_WITH_AVOID === true && ROUTING_AVOID_GH_ROUND_TRIP_WITH_AVOID === true);
     add("RAA_validate_min", (function(){
       const v = routingAvoidValidateVertices([{ lat: 44.1, lon: 9.8 }, { lat: 44.11, lon: 9.81 }]);
@@ -90323,12 +90354,12 @@ function routingProviderCompareSelfTest(){
   const checks = [];
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
-    add("RPC_build_222", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("RPC_build_222", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     add("RPC_no_boot_start", _routingCompareSession.startedAt === 0 && !_routingCompareSession.loading);
     add("RPC_cta_fn", typeof routingCompareStart === "function" && typeof routingCompareChoose === "function");
     add("RPC_auto_no_ors", routingCompareAutoCandidates().indexOf("ors") < 0
       && routingCompareAutoCandidates().indexOf("local") >= 0);
     const hike = ROUTING_COMPARE_PROFILE_PAIRS[0];
@@ -90455,14 +90486,14 @@ function routingCompareFix1SelfTest(){
   const prevAvoid = _routingAvoidSession.areas;
   const prevGh = _routingCompareSession.gh;
   const prevOrs = _routingCompareSession.ors;
   const prevChosen = _routingCompareSession.chosen;
   try {
-    add("RPCF1_build_222", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
-    add("RPCF2_build_223", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1"
+    add("RPCF1_build_222", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
+    add("RPCF2_build_223", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A"
       && typeof routingAlternativesAllowed === "function");
     const cta = document.getElementById("routingCompareBtn");
     add("RPCF1_cta_primary", !!(cta && cta.classList.contains("btn-primary") && cta.id === "routingCompareBtn"));
     add("RPCF1_swatch_gh", !!document.querySelector("#routingCompareLegend .routing-swatch-gh"));
     add("RPCF1_swatch_ors", !!document.querySelector("#routingCompareLegend .routing-swatch-ors"));
@@ -90748,12 +90779,12 @@ function routingCompareFix3SelfTest(){
   const prevOrs = _routingCompareSession.ors;
   const prevChosen = _routingCompareSession.chosen;
   const wp0 = Array.isArray(state.mapWaypoints) ? state.mapWaypoints.slice() : [];
   const poly0 = Array.isArray(state.gisPolygons) ? state.gisPolygons.slice() : [];
   try {
-    add("RPCF3_build_224", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("RPCF3_build_224", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     const ptsEl = document.getElementById("routingPointsList");
     const zone = document.getElementById("routingRouteOptionsZone");
     const cmp = document.getElementById("routingCompareSection");
     const alt = document.getElementById("routingAlternativesRow");
     const modeRow = document.getElementById("routingModeRow");
@@ -90923,12 +90954,12 @@ function routingCompareFix4SelfTest(){
   const poly0 = Array.isArray(state.gisPolygons) ? state.gisPolygons.slice() : [];
   const savedChosen = _routingCompareSession.chosen;
   const savedGh = _routingCompareSession.gh;
   const savedOrs = _routingCompareSession.ors;
   try {
-    add("RPCF4_build_225", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("RPCF4_build_225", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     const params = document.getElementById("routingParamsRow");
     const prof = document.getElementById("routingProfileSelect");
     const speed = document.getElementById("routingSpeedSelect");
     const calc = document.getElementById("routingCalculateBtn");
     add("RPCF4_params_group", !!(params && prof && speed && calc && params.contains(prof) && params.contains(speed) && params.contains(calc)));
@@ -91023,12 +91054,12 @@ function routingRingWarnFix1SelfTest(){
   const savedMode = routingGetRouteMode();
   const savedCoords = Array.isArray(r.previewCoordinates) ? r.previewCoordinates.slice() : null;
   const savedWarn = (typeof r.ringSemanticWarn === "boolean") ? r.ringSemanticWarn : null;
   const savedWarnKey = r.roundTripWarnKey || "";
   try {
-    add("RWF1_build_226", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("RWF1_build_226", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     try { routingSetRouteMode("round_trip"); } catch(_){}
     const oab = [];
     for (let i = 0; i < 10; i++) oab.push({ lat: 44.1, lon: 9.82 + i * 0.002 });
     for (let i = 9; i >= 0; i--) oab.push({ lat: 44.1, lon: 9.82 + i * 0.002 });
     r.previewCoordinates = oab.slice();
@@ -91084,12 +91115,12 @@ function routingCompareFix6SelfTest(){
   const checks = [];
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
   };
   try {
-    add("RPCF6_build_228", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("RPCF6_build_228", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     const params = document.getElementById("routingParamsRow");
     const modeGroup = document.getElementById("routingModeGroup");
     const modeRow = document.getElementById("routingModeRow");
     const chipsHost = modeGroup ? modeGroup.querySelector(".routing-mode-chips") : null;
     const chips = modeGroup ? modeGroup.querySelectorAll("[data-routing-mode]") : [];
@@ -91220,12 +91251,12 @@ function routingCompareFix5SelfTest(){
   const savedMetrics = r.routeMetrics;
   const savedAlts = r.alternatives;
   const savedProv = r.previewStyleProvider;
   const savedOverlay = r.activeOverlayKey;
   try {
-    add("RPCF5_build_follows_app", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 233
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A-FIX1");
+    add("RPCF5_build_follows_app", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
     const params = document.getElementById("routingParamsRow");
     const prof = document.getElementById("routingProfileSelect");
     const speed = document.getElementById("routingSpeedSelect");
     const calc = document.getElementById("routingCalculateBtn");
     const modeGroup = document.getElementById("routingModeGroup");
`

---
END REVIEW PACKAGE — MAIN MUST REMAIN 18aa41a8c625d67ea1a5e7c213fff4097790e751 — NO DEPLOY
