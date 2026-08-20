# REVIEW PACKAGE — D-FLIGHT-CLOSE-CLEANUP-A-FIX1 (build 235)

BLOCK-ID: D-FLIGHT-CLOSE-CLEANUP-A-FIX1  
PHASE: FIX → LOCAL QA → REVIEW PACKAGE  
CLOSURE: NONE  
MAIN WRITE: FORBIDDEN · DEPLOY: FORBIDDEN · FINITO: FORBIDDEN · REVIEW PASS: NOT ATTESTED

## Identifiers

- BASE_RUNTIME_FULL_SHA (234): ea8370460ae133fbba2592235277a9cc1f7d9d1e
- BASE_BLOB (234): 7232d08e1452bbea4563fe096fa71342b2cb2b63
- CANDIDATE_FULL_SHA (235): f140e115fd2b8e2c321d94da41960f5cfefbc7fa
- CANDIDATE_PARENT: ea8370460ae133fbba2592235277a9cc1f7d9d1e (runtime 234 canonico)
- BRANCH: 
eview/D-FLIGHT-CLOSE-CLEANUP-A-FIX1-235
- APP_BUILD_NUM: **235**
- APP_BUILD_ID: D-FLIGHT-CLOSE-CLEANUP-A-FIX1
- CANDIDATE_BLOB: d2b7e1cdbd6a463741ab86b0a9616de85a9a2c9d
- Monolite bytes CRLF (working): 10917418
- Monolite bytes LF (git): 10816861
- Monolite lines: 100557
- origin/main (unchanged): 7895c908d05a1030da6b59ff647be5c85f773b70

## Root cause

**Classificazione: A + C** (nodo DOM ATM09 non invalidato; teardown applicato solo al prossimo render).

Su BASE 234, dflightPanelCloseLifecycle chiamava dflightSetOverlayVisible(false) **prima** di spegnere ATM09 preferred.  
dflightSetOverlayVisible(false) esegue 
enderTileMap mentre _dflightAtm09Preferred è ancora **ON** → 
enderTileMap **re-inietta** img.tile-atm09.  
Poi dflightAtm09SetPreferred(false) spegne i flag e ClearInfo, ma **non** chiamava dflightAtm09InvalidateVisual() e **non** rifaceva un render con preferred OFF.  
Risultato: raster ATM09 (zone ufficiali) restano nel frame fino a pan/zoom/resize (sintomo operatore: spariscono dopo secondi o solo muovendo la mappa).

Non è un timer di cleanup; è un render prematuro + mancanza di invalidate sincrono.

## Fix (scoped)

1. In dflightPanelCloseLifecycle: _dflightAtm09MasterUi=false → dflightAtm09SetPreferred(false) → dflightAtm09InvalidateVisual() → **poi** dflightSetOverlayVisible(false).
2. In dflightAtm09SetPreferred(false): chiamata sincrona a dflightAtm09InvalidateVisual() (tile DOM dead/hidden immediato).
3. Build 235 + selftest order/gates FIX1.
4. Reopen / no auto-reload / minimize invariati.

## BASE vs candidate — visual teardown evidence (Chrome CDP)

Probe: seed img.tile-atm09 + SVG zone/hit/info; stub 
enderTileMap che re-inietta ATM09 solo se dflightAtm09OverlayVisible(z); close; misura immediata + 2 rAF + reopen + pan.

| Metric | BASE 234 | CAND 235 |
|---|---|---|
| immediate live ATM09 | **1** (residuo) | **0** |
| render_during_close wanted ATM09 | **true** | **false** |
| after 2 rAF live ATM09 | 1 | 0 |
| reopen overlay/preferred | false/false | false/false |
| after pan live ATM09 | 0 | 0 |

Verdict probe: ase_shows_residual=true, candidate_immediate_clear=true, **PASS**.

Raw: C:/tmp/dflight-close-fix1/probe-report.json

## Lifecycle / minimize / reopen

- Minimize wiring: **non** chiama close lifecycle (source PASS)
- Close dopo restore simulato: vis/pref/master/panel OFF
- Reopen: nessuna auto-resurrezione (Aggiorna resta necessario) — invariato vs 234

## Isolation / network / offline / Console / selftest

- Isolamento: fix solo path D-Flight close/ATM09 preferred; waypoint/tracce/poligoni non toccati
- Close helper/network delta (stub render + _dflightFetchImpl + fetch URL filter): helperN=0 fetchN=0
- Forced offline: dflightClientNetworkAllowed=false, dflightAtm09OverlayVisible=false
- Console errors probe: 0
- Selftest H: FIX1/CC/VR_FIX2 close-related **PASS**; fail unico FIX3_D4_resize_handles_anchored = **PRE-ESISTENTE** (identico BASE 234)
- Selftest F: 36/36 PASS (F_mvisa_build_199 235)

## Remote refs (pre-docs commit; post runtime)

`
7895c908d05a1030da6b59ff647be5c85f773b70	refs/heads/main
f140e115fd2b8e2c321d94da41960f5cfefbc7fa	refs/heads/review/D-FLIGHT-CLOSE-CLEANUP-A-FIX1-235 (local; push pending)
origin fetch: https://github.com/mrhz1973/cursor-coordinate-converter.git
origin push: DISABLED_PUSH
`

## git show --format=fuller --stat

`
commit f140e115fd2b8e2c321d94da41960f5cfefbc7fa
Author:     Martino Tuso <53308962+mrhz1973@users.noreply.github.com>
AuthorDate: Thu Aug 20 21:31:38 2026 +0200
Commit:     Martino Tuso <53308962+mrhz1973@users.noreply.github.com>
CommitDate: Thu Aug 20 21:31:38 2026 +0200

    ﻿fix(dflight): sync ATM09 visual teardown on complete panel close, build 235
    
    Disable ATM09 preferred and invalidate tile DOM before overlay hide/renderTileMap so close X clears session visuals immediately without pan/timer.
    
    Co-authored-by: Cursor <cursoragent@cursor.com>

 coordinate_converter Claude.html | 47 +++++++++++++++++++++++++---------------
 1 file changed, 30 insertions(+), 17 deletions(-)

`

## git diff parent..candidate --check

`
(empty — PASS)
`

## DIFF COMPLETO — coordinate_converter Claude.html

`diff
diff --git a/coordinate_converter Claude.html b/coordinate_converter Claude.html
index 7232d08..d2b7e1c 100644
--- a/coordinate_converter Claude.html	
+++ b/coordinate_converter Claude.html	
@@ -24305,10 +24305,10 @@ const UI_STORAGE_KEY = "coordconv_ui_v1";
 /** Strong-confirm word for full local wipe (same in IT/EN/FR UI). */
 const APP_FULL_RESET_CONFIRM_WORD = "CANCELLA";
 /** Visible runtime build label ÔÇö update before each runtime `finito`. */
-const APP_BUILD_ID = "D-FLIGHT-CLOSE-CLEANUP-A";
-const APP_BUILD_DETAIL = "Close completa Zone D-Flight: cleanup overlay/zone/legende sessione; minimize invariato.";
+const APP_BUILD_ID = "D-FLIGHT-CLOSE-CLEANUP-A-FIX1";
+const APP_BUILD_DETAIL = "Close X: teardown visual ATM09/zone sincrono immediato (no pan/timer); reopen no auto-reload.";
 /** Monotonic runtime build counter ÔÇö increment on each runtime patch (not persisted). */
-const APP_BUILD_NUM = 234;
+const APP_BUILD_NUM = 235;
 const APP_BUILD_LABEL = APP_BUILD_ID + " ┬À build " + APP_BUILD_NUM + " ÔÇö " + APP_BUILD_DETAIL;
 function applyAppBuildLabel(){
   try {
@@ -38120,9 +38120,10 @@ function dflightWireFloatingPanel(dlg, kind){
 }
 
 /**
- * D-FLIGHT-CLOSE-CLEANUP-A ÔÇö complete-close lifecycle (X / Esc / dflightCloseControlPanel).
+ * D-FLIGHT-CLOSE-CLEANUP-A-FIX1 ÔÇö complete-close lifecycle (X / Esc / dflightCloseControlPanel).
  * Minimize must NOT call this.
- * Tears down session-owned map visuals (zones/overlays/legends/ATM09 paint).
+ * Tears down session-owned map visuals (zones/overlays/legends/ATM09 paint) synchronously.
+ * ATM09 preferred OFF + InvalidateVisual before SetOverlayVisible/renderTileMap.
  * Preserves in-memory client dataset; does NOT auto-restore visuals on reopen.
  */
 function dflightPanelCloseLifecycle(){
@@ -38137,14 +38138,18 @@ function dflightPanelCloseLifecycle(){
   _dflightRestoreOverlayOnPanelReopen = false;
   _dflightSelectedZoneId = null;
   try { if (typeof dflightCloseDetailsPanel === "function") dflightCloseDetailsPanel(); } catch(_){}
-  try {
-    if (typeof dflightSetOverlayVisible === "function") dflightSetOverlayVisible(false);
-  } catch(_){}
-  /* Drop ATM09 paint ownership for this closed session (Master UI + preferred). */
+  /* FIX1: disable ATM09 paint BEFORE overlay hide/renderTileMap,
+     otherwise ATM09 tiles are re-injected while preferred is still ON. */
   try { _dflightAtm09MasterUi = false; } catch(_){}
   try {
     if (typeof dflightAtm09SetPreferred === "function") dflightAtm09SetPreferred(false);
   } catch(_){}
+  try {
+    if (typeof dflightAtm09InvalidateVisual === "function") dflightAtm09InvalidateVisual();
+  } catch(_){}
+  try {
+    if (typeof dflightSetOverlayVisible === "function") dflightSetOverlayVisible(false);
+  } catch(_){}
   try {
     const dfLeg = document.getElementById("dflightRestrictionsLegend");
     if (dfLeg){
@@ -39709,8 +39714,8 @@ function dflightSelfTestF(){
     })());
 
     add("F_mvisa_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 235
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A-FIX1");
 
     _dflightHelperBaseUrlOverride = "http://example.test:8010";
     if (typeof state !== "undefined") state.forceOffline = true;
@@ -40731,8 +40736,8 @@ function dflightSelfTestTf(){
       && String(dflightEnsurePanelGeometryResize).indexOf("dflightSyncAdaptivePanelGeometry") >= 0);
 
     add("Tf_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 235
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A-FIX1");
   } catch (e){
     add("selftest_tf_exception", false, String(e && e.message ? e.message : e));
   } finally {
@@ -41187,6 +41192,7 @@ function dflightAtm09SetPreferred(on){
     _dflightAtm09SelectedId = null;
     _dflightAtm09LegendLoaded = false;
     dflightAtm09SetReady(false);
+    try { if (typeof dflightAtm09InvalidateVisual === "function") dflightAtm09InvalidateVisual(); } catch(_){}
     try { dflightAtm09ClearOverlayFx(); } catch(_){}
     try {
       const wrap = document.getElementById("dflightAtm09LegendWrap");
@@ -42661,8 +42667,8 @@ function dflightSelfTestH(){
       } catch(_){ return false; }
     })());
 
-    add("H_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 234
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A");
+    add("H_build_214", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 235
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-CLOSE-CLEANUP-A-FIX1");
     add("VR_FIX1_sync_loading_passes_zoom", (function(){
       if (typeof dflightSyncLoadingUi !== "function") return false;
       const src = String(dflightSyncLoadingUi);
@@ -42699,12 +42705,19 @@ function dflightSelfTestH(){
     add("CC_close_lifecycle_source", (function(){
       if (typeof dflightPanelCloseLifecycle !== "function") return false;
       const src = String(dflightPanelCloseLifecycle);
+      const iPref = src.indexOf("dflightAtm09SetPreferred(false)");
+      const iInv = src.indexOf("dflightAtm09InvalidateVisual");
+      const iVis = src.indexOf("dflightSetOverlayVisible(false)");
       return src.indexOf("_dflightRestoreOverlayOnPanelReopen = false") >= 0
-        && src.indexOf("dflightSetOverlayVisible(false)") >= 0
-        && src.indexOf("dflightAtm09SetPreferred(false)") >= 0
+        && iPref >= 0 && iInv >= 0 && iVis >= 0
+        && iPref < iVis && iInv < iVis
         && src.indexOf("_dflightAtm09MasterUi = false") >= 0
         && src.indexOf("_dflightClientSession") < 0;
     })());
+    add("FIX1_preferred_off_invalidates_visual", (function(){
+      if (typeof dflightAtm09SetPreferred !== "function") return false;
+      return String(dflightAtm09SetPreferred).indexOf("dflightAtm09InvalidateVisual") >= 0;
+    })());
 
     /* VISUAL-READY-A: pure/static + stubbed post-apply start (no live helper network). */
     add("VR_helpers_present", typeof dflightMaybeStartAtm09AfterDatasetReady === "function"

`

## STOP

NON deploy. NON main push. NON finito. NON attestare REVIEW PASS.

**D-FLIGHT-CLOSE-CLEANUP-A-FIX1 REVIEW PACKAGE READY — MAIN UNCHANGED — NO DEPLOY**
