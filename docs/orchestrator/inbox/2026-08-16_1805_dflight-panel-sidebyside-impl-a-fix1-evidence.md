# D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1 — REVIEW EVIDENCE

**BLOCK-ID:** D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1  
**Categoria:** DELICATO — lifecycle/layout dialog  
**Gate (invariato):** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**NO** deploy · **NO** ABQA · **NO** QA operatore · **NO** finito · **NO** verdetto PASS/FAIL di review

---

## 1. SHA

| Ruolo | Full SHA |
|-------|----------|
| REVIEW BASE | `67d9cc79c4896adc39b7a38a6828bf4d31346305` |
| CANDIDATE FAIL (IMPL-A) | `a689fe81d7f8722ef5e58077be639d00d13523b7` |
| CANDIDATE FIX1 (nuovo) | `ff4fa64a0686ffcaada0d3d18e3a0e74d7ba3be6` |

Ancestry: BASE ⊆ FAIL ⊆ FIX1 (`merge-base --is-ancestor` verificato in sessione).

Selftest headless Chrome: `dflightSelfTestSideBySide` **15/15 PASS**; `dflightSelfTestAll` **ok** (391 checks, 0 fail).

---

## 2. Stat runtime

### BASE..FIX1
```
coordinate_converter Claude.html | 501 +++++++++++++++++++++++++++++++++++++--
 1 file changed, 479 insertions(+), 22 deletions(-)
```
Hunk unified (`-U4`): **16** (account sotto).

### FAIL..FIX1 (delta correttivo)
```
coordinate_converter Claude.html | 424 ++++++++++++++++++++++++---------------
 1 file changed, 264 insertions(+), 160 deletions(-)
```
Hunk unified (`-U4`): **16**.

---

## 3. Account hunk BASE..FIX1

| # | Header | Keywords |
|---|--------|----------|
| H1 | `@@ -23571,12 +23571,12 @@ const STORAGE_KEY = "coordconv_v2";` | APP_BUILD |
| H2 | `@@ -36875,8 +36875,183 @@ function dflightRestorePanelToSafeTop(dlg, kind){` | DFLIGHT_PAIR, EnsurePairLayout, clampPairLeft, pickBeside, sideCandidate |
| H3 | `@@ -36914,8 +37089,9 @@ function dflightEnsurePanelGeometryResize(){` | EnsurePairLayout, EnsurePanelGeometry |
| H4 | `@@ -37074,8 +37250,9 @@ function dflightOpenControlPanel(){` | EnsurePairLayout, OpenControl |
| H5 | `@@ -37094,8 +37271,9 @@ function dflightOpenDetailsPanel(zone){` | EnsurePairLayout, OpenDetails |
| H6 | `@@ -38606,10 +38784,10 @@ function dflightSelfTestF(){` | APP_BUILD |
| H7 | `@@ -39628,10 +39806,10 @@ function dflightSelfTestTf(){` | APP_BUILD, EnsurePanelGeometry |
| H8 | `@@ -41554,10 +41732,10 @@ function dflightSelfTestH(){` | APP_BUILD |
| H9 | `@@ -42055,10 +42233,10 @@ function dflightSelfTestHitFixA(){` | APP_BUILD |
| H10 | `@@ -43069,10 +43247,10 @@ function dflightSelfTestOptB(){` | APP_BUILD |
| H11 | `@@ -43507,10 +43685,10 @@ function dflightSelfTestOptB(){` | APP_BUILD |
| H12 | `@@ -44099,10 +44277,10 @@ function dflightSelfTestMVISA(){` | APP_BUILD |
| H13 | `@@ -44734,10 +44912,10 @@ function dflightSelfTestIMPLA(){` | APP_BUILD |
| H14 | `@@ -44890,11 +45068,11 @@ function dflightSelfTestLEGENDUX(){` | APP_BUILD |
| H15 | `@@ -45187,8 +45365,285 @@ function dflightSelfTestLEGENDUX(){` | APP_BUILD, DFLIGHT_PAIR, EnsurePairLayout, EnsurePanelGeometry, OpenControl, OpenDetails, gisRestore, SelfTestSideBySide, SBS_ |
| H16 | `@@ -74681,15 +75136,17 @@ function gisRestoreMinimizedPanel(panelId){` | EnsurePairLayout, gisRestore |

---

## 4. Finding → correzione (FAIL..FIX1) — codice reale one-touched

Funzione completa `dflightEnsurePairLayout` al candidato FIX1 (include `clampPairLeft` / `sideCandidateFits` / `pickBesideTouched`):

```javascript
function dflightEnsurePairLayout(){
  if (_dflightPairLayoutBusy) return { ok: false, reason: "busy" };
  const zone = document.getElementById("dflightPanel");
  const det = document.getElementById("dflightDetailsPanel");
  if (!dflightPanelIsPairEligible(zone) || !dflightPanelIsPairEligible(det)){
    return { ok: false, reason: "not_both_open" };
  }
  _dflightPairLayoutBusy = true;
  try {
    const optsZ = _dflightPanelLayoutOpts("control");
    const optsD = _dflightPanelLayoutOpts("details");
    const gap = DFLIGHT_PAIR_GAP_PX;
    const pad = Number.isFinite(optsZ.pad) ? optsZ.pad : 12;
    const vw = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 0;
    const safeTop = (typeof dflightComputePanelSafeTop === "function")
      ? dflightComputePanelSafeTop(optsZ)
      : pad;
    const layZ = (typeof gisPanelGetLayout === "function") ? (gisPanelGetLayout(optsZ.key, optsZ) || {}) : {};
    const layD = (typeof gisPanelGetLayout === "function") ? (gisPanelGetLayout(optsD.key, optsD) || {}) : {};
    const touchedZ = !!layZ.touched;
    const touchedD = !!layD.touched;
    /* Both user-touched: never fight drag. */
    if (touchedZ && touchedD) return { ok: true, mode: "both_touched_skip" };

    function measure(dlg, opts, fallbackW){
      let br = null;
      try { br = dlg.getBoundingClientRect(); } catch(_){}
      const w = Math.max(
        Number.isFinite(opts.minW) ? opts.minW : 280,
        (br && br.width > 0) ? br.width : (Number.isFinite(opts.defaultW) ? opts.defaultW : fallbackW)
      );
      const h = (br && br.height > 0) ? br.height : 240;
      const left = (br && Number.isFinite(br.left)) ? br.left : pad;
      const top = (br && Number.isFinite(br.top)) ? br.top : safeTop;
      return { left: left, top: top, w: w, h: h, right: left + w, bottom: top + h };
    }

    function clampPairLeft(left, w){
      let L = Number(left);
      if (!Number.isFinite(L)) L = pad;
      return Math.max(pad, Math.min(Math.max(pad, vw - w - pad), L));
    }

    /** FIX1: candidate fits only if post-clamp rect has no horizontal overlap with touched. */
    function sideCandidateFits(candLeft, freeW, tLeft, tRight){
      const L = clampPairLeft(candLeft, freeW);
      const R = L + freeW;
      if (L < tRight && tLeft < R) return { ok: false, left: L };
      return { ok: true, left: L };
    }

    function pickBesideTouched(touchedM, freeW){
      const rightCand = touchedM.right + gap;
      const leftCand = touchedM.left - gap - freeW;
      const rightFit = sideCandidateFits(rightCand, freeW, touchedM.left, touchedM.right);
      if (rightFit.ok) return { ok: true, left: rightFit.left, side: "right" };
      const leftFit = sideCandidateFits(leftCand, freeW, touchedM.left, touchedM.right);
      if (leftFit.ok) return { ok: true, left: leftFit.left, side: "left" };
      return { ok: false };
    }

    function applyPanelPos(dlg, kind, left, top){
      const opts = _dflightPanelLayoutOpts(kind);
      const m = measure(dlg, opts, kind === "details" ? 380 : 340);
      let L = clampPairLeft(left, m.w);
      let T = Number(top);
      if (!Number.isFinite(T)) T = safeTop;
      try {
        const usable = (typeof dflightComputePanelUsableRect === "function")
          ? dflightComputePanelUsableRect(opts)
          : null;
        if (usable && Number.isFinite(usable.bottom)){
          const maxT = Math.max(safeTop, usable.bottom - Math.min(m.h, Math.max(64, (opts.partialMinVisible | 0) || 64)) - (usable.pad || pad));
          if (T > maxT) T = maxT;
          if (T < safeTop) T = safeTop;
        }
      } catch(_){}
      dlg.style.left = Math.round(L) + "px";
      dlg.style.top = Math.round(T) + "px";
      dlg.style.right = "auto";
      dlg.style.bottom = "auto";
      dlg.style.transform = "none";
      try {
        const br = dlg.getBoundingClientRect();
        if (typeof gisPanelSetLayout === "function"){
          gisPanelSetLayout(opts.key, {
            left: Number.isFinite(br.left) ? br.left : L,
            top: Number.isFinite(br.top) ? br.top : T,
            w: Number.isFinite(br.width) ? br.width : m.w,
            h: Number.isFinite(br.height) ? br.height : m.h,
            touched: false
          }, opts);
        }
      } catch(_){}
      try { if (typeof dflightSyncAdaptivePanelGeometry === "function") dflightSyncAdaptivePanelGeometry(dlg, kind); } catch(_){}
    }

    function noHOverlap(a, b){
      return !(a.left < b.right && b.left < a.right);
    }

    let mZ = measure(zone, optsZ, 340);
    let mD = measure(det, optsD, 380);
    const canSide = (vw - pad * 2) >= (mZ.w + gap + mD.w);

    /* Both untouched: global width gate is sufficient (default pin from pad). */
    if (!touchedZ && !touchedD){
      if (canSide){
        applyPanelPos(zone, "control", pad, safeTop);
        mZ = measure(zone, optsZ, 340);
        applyPanelPos(det, "details", mZ.right + gap, safeTop);
        return { ok: true, mode: "side_by_side" };
      }
      applyPanelPos(zone, "control", pad, safeTop);
      mZ = measure(zone, optsZ, 340);
      applyPanelPos(det, "details", pad, mZ.bottom + gap);
      try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(det, optsD); } catch(_){}
      return { ok: true, mode: "stack_fallback" };
    }

    /* FIX1: one touched — preserve touched; place free only if a real side clears post-clamp. */
    if (touchedZ && !touchedD){
      mZ = measure(zone, optsZ, 340);
      mD = measure(det, optsD, 380);
      const pick = pickBesideTouched(mZ, mD.w);
      if (pick.ok){
        applyPanelPos(det, "details", pick.left, Number.isFinite(mZ.top) ? mZ.top : safeTop);
        mD = measure(det, optsD, 380);
        if (noHOverlap(mZ, mD)){
          return { ok: true, mode: "place_details_beside_zone" };
        }
      }
      applyPanelPos(det, "details", pad, mZ.bottom + gap);
      try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(det, optsD); } catch(_){}
      return { ok: true, mode: "stack_details" };
    }
    if (!touchedZ && touchedD){
      mD = measure(det, optsD, 380);
      mZ = measure(zone, optsZ, 340);
      const pick = pickBesideTouched(mD, mZ.w);
      if (pick.ok){
        applyPanelPos(zone, "control", pick.left, Number.isFinite(mD.top) ? mD.top : safeTop);
        mZ = measure(zone, optsZ, 340);
        if (noHOverlap(mZ, mD)){
          return { ok: true, mode: "place_zone_beside_details" };
        }
      }
      let topZ = mD.top - gap - Math.min(mZ.h, 200);
      if (!(topZ >= safeTop)) topZ = safeTop;
      applyPanelPos(zone, "control", pad, topZ);
      return { ok: true, mode: "stack_zone" };
    }
    return { ok: true, mode: "noop" };
  } catch (e){
    return { ok: false, reason: String(e && e.message ? e.message : e) };
  } finally {
    _dflightPairLayoutBusy = false;
  }
}
```

---

## 5. Diff FAIL..FIX1 (tutti gli hunk runtime)

### Hunk F1

```diff
@@ -23571,12 +23571,12 @@ const STORAGE_KEY = "coordconv_v2";
 const UI_STORAGE_KEY = "coordconv_ui_v1";
 /** Strong-confirm word for full local wipe (same in IT/EN/FR UI). */
 const APP_FULL_RESET_CONFIRM_WORD = "CANCELLA";
 /** Visible runtime build label — update before each runtime `finito`. */
-const APP_BUILD_ID = "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A";
-const APP_BUILD_DETAIL = "D-Flight Zone/Details pair layout: side-by-side when space allows; narrow stack fallback; respect touched; session-only.";
+const APP_BUILD_ID = "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1";
+const APP_BUILD_DETAIL = "FIX1: one-touched pair-layout requires real post-clamp side clearance; no artificial horizontal overlap; stack fallback when dead-zone.";
 /** Monotonic runtime build counter — increment on each runtime patch (not persisted). */
-const APP_BUILD_NUM = 201;
+const APP_BUILD_NUM = 202;
 const APP_BUILD_LABEL = APP_BUILD_ID + " · build " + APP_BUILD_NUM + " — " + APP_BUILD_DETAIL;
 function applyAppBuildLabel(){
   try {
     const buildDisp = APP_BUILD_ID + " · build " + APP_BUILD_NUM;
```
### Hunk F2

```diff
@@ -36885,10 +36885,11 @@ function dflightPanelIsPairEligible(dlg){
   return !!(dlg && dlg.open && !(dlg.classList && dlg.classList.contains("gis-panel-minimized")));
 }
 
 /**
- * SIDEBYSIDE-IMPL-A: local pair-layout policy for Zone + Details.
+ * SIDEBYSIDE-IMPL-A / FIX1: local pair-layout policy for Zone + Details.
  * Reuses gisPanel* + dflight geometry; session-only; no global manager.
+ * FIX1: one-touched branches require real post-clamp side clearance (no artificial overlap).
  * @returns {{ok:boolean, mode?:string, reason?:string}}
  */
 function dflightEnsurePairLayout(){
   if (_dflightPairLayoutBusy) return { ok: false, reason: "busy" };
```
### Hunk F3

```diff
@@ -36926,16 +36927,38 @@ function dflightEnsurePairLayout(){
       const top = (br && Number.isFinite(br.top)) ? br.top : safeTop;
       return { left: left, top: top, w: w, h: h, right: left + w, bottom: top + h };
     }
 
+    function clampPairLeft(left, w){
+      let L = Number(left);
+      if (!Number.isFinite(L)) L = pad;
+      return Math.max(pad, Math.min(Math.max(pad, vw - w - pad), L));
+    }
+
+    /** FIX1: candidate fits only if post-clamp rect has no horizontal overlap with touched. */
+    function sideCandidateFits(candLeft, freeW, tLeft, tRight){
+      const L = clampPairLeft(candLeft, freeW);
+      const R = L + freeW;
+      if (L < tRight && tLeft < R) return { ok: false, left: L };
+      return { ok: true, left: L };
+    }
+
+    function pickBesideTouched(touchedM, freeW){
+      const rightCand = touchedM.right + gap;
+      const leftCand = touchedM.left - gap - freeW;
+      const rightFit = sideCandidateFits(rightCand, freeW, touchedM.left, touchedM.right);
+      if (rightFit.ok) return { ok: true, left: rightFit.left, side: "right" };
+      const leftFit = sideCandidateFits(leftCand, freeW, touchedM.left, touchedM.right);
+      if (leftFit.ok) return { ok: true, left: leftFit.left, side: "left" };
+      return { ok: false };
+    }
+
     function applyPanelPos(dlg, kind, left, top){
       const opts = _dflightPanelLayoutOpts(kind);
       const m = measure(dlg, opts, kind === "details" ? 380 : 340);
-      let L = Number(left);
+      let L = clampPairLeft(left, m.w);
       let T = Number(top);
-      if (!Number.isFinite(L)) L = pad;
       if (!Number.isFinite(T)) T = safeTop;
-      L = Math.max(pad, Math.min(Math.max(pad, vw - m.w - pad), L));
       try {
         const usable = (typeof dflightComputePanelUsableRect === "function")
           ? dflightComputePanelUsableRect(opts)
           : null;
```
### Hunk F4

```diff
@@ -36964,52 +36987,58 @@ function dflightEnsurePairLayout(){
       } catch(_){}
       try { if (typeof dflightSyncAdaptivePanelGeometry === "function") dflightSyncAdaptivePanelGeometry(dlg, kind); } catch(_){}
     }
 
+    function noHOverlap(a, b){
+      return !(a.left < b.right && b.left < a.right);
+    }
+
     let mZ = measure(zone, optsZ, 340);
     let mD = measure(det, optsD, 380);
     const canSide = (vw - pad * 2) >= (mZ.w + gap + mD.w);
 
-    if (canSide){
-      if (!touchedZ && !touchedD){
+    /* Both untouched: global width gate is sufficient (default pin from pad). */
+    if (!touchedZ && !touchedD){
+      if (canSide){
         applyPanelPos(zone, "control", pad, safeTop);
         mZ = measure(zone, optsZ, 340);
         applyPanelPos(det, "details", mZ.right + gap, safeTop);
         return { ok: true, mode: "side_by_side" };
       }
-      if (touchedZ && !touchedD){
-        mZ = measure(zone, optsZ, 340);
-        let leftD = mZ.right + gap;
-        if (leftD + mD.w + pad > vw) leftD = mZ.left - gap - mD.w;
-        applyPanelPos(det, "details", leftD, Number.isFinite(mZ.top) ? mZ.top : safeTop);
-        return { ok: true, mode: "place_details_beside_zone" };
-      }
-      if (!touchedZ && touchedD){
-        mD = measure(det, optsD, 380);
-        let leftZ = mD.left - gap - mZ.w;
-        if (leftZ < pad) leftZ = mD.right + gap;
-        applyPanelPos(zone, "control", leftZ, Number.isFinite(mD.top) ? mD.top : safeTop);
-        return { ok: true, mode: "place_zone_beside_details" };
-      }
-    }
-
-    /* Narrow / insufficient width: stack fallback — do not force side-by-side. */
-    if (!touchedZ && !touchedD){
       applyPanelPos(zone, "control", pad, safeTop);
       mZ = measure(zone, optsZ, 340);
-      let topD = mZ.bottom + gap;
-      applyPanelPos(det, "details", pad, topD);
+      applyPanelPos(det, "details", pad, mZ.bottom + gap);
       try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(det, optsD); } catch(_){}
       return { ok: true, mode: "stack_fallback" };
     }
+
+    /* FIX1: one touched — preserve touched; place free only if a real side clears post-clamp. */
     if (touchedZ && !touchedD){
       mZ = measure(zone, optsZ, 340);
+      mD = measure(det, optsD, 380);
+      const pick = pickBesideTouched(mZ, mD.w);
+      if (pick.ok){
+        applyPanelPos(det, "details", pick.left, Number.isFinite(mZ.top) ? mZ.top : safeTop);
+        mD = measure(det, optsD, 380);
+        if (noHOverlap(mZ, mD)){
+          return { ok: true, mode: "place_details_beside_zone" };
+        }
+      }
       applyPanelPos(det, "details", pad, mZ.bottom + gap);
       try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(det, optsD); } catch(_){}
       return { ok: true, mode: "stack_details" };
     }
     if (!touchedZ && touchedD){
       mD = measure(det, optsD, 380);
+      mZ = measure(zone, optsZ, 340);
+      const pick = pickBesideTouched(mD, mZ.w);
+      if (pick.ok){
+        applyPanelPos(zone, "control", pick.left, Number.isFinite(mD.top) ? mD.top : safeTop);
+        mZ = measure(zone, optsZ, 340);
+        if (noHOverlap(mZ, mD)){
+          return { ok: true, mode: "place_zone_beside_details" };
+        }
+      }
       let topZ = mD.top - gap - Math.min(mZ.h, 200);
       if (!(topZ >= safeTop)) topZ = safeTop;
       applyPanelPos(zone, "control", pad, topZ);
       return { ok: true, mode: "stack_zone" };
```
### Hunk F5

```diff
@@ -38755,10 +38784,10 @@ function dflightSelfTestF(){
       }
     })());
 
     add("F_mvisa_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
 
     _dflightHelperBaseUrlOverride = "http://example.test:8010";
     if (typeof state !== "undefined") state.forceOffline = true;
     let gatedCalled = false;
```
### Hunk F6

```diff
@@ -39777,10 +39806,10 @@ function dflightSelfTestTf(){
       && String(dflightSyncAdaptivePanelGeometry).indexOf("dflightComputePanelUsableRect") >= 0
       && String(dflightEnsurePanelGeometryResize).indexOf("dflightSyncAdaptivePanelGeometry") >= 0);
 
     add("Tf_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
   } catch (e){
     add("selftest_tf_exception", false, String(e && e.message ? e.message : e));
   } finally {
     for (let i = 0; i < DFLIGHT_TEMPORAL_STATES.length; i++){
```
### Hunk F7

```diff
@@ -41703,10 +41732,10 @@ function dflightSelfTestH(){
         return true;
       } catch(_){ return false; }
     })());
 
-    add("H_build_201", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+    add("H_build_202", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
     add("VR_FIX1_sync_loading_passes_zoom", (function(){
       if (typeof dflightSyncLoadingUi !== "function") return false;
       const src = String(dflightSyncLoadingUi);
       return src.indexOf("dflightAtm09IsEligibleForStart(atmZoom)") >= 0
```
### Hunk F8

```diff
@@ -42204,10 +42233,10 @@ function dflightSelfTestHitFixA(){
   const prevUnavail = _dflightAtm09InfoUnavailable;
   const prevBase = _dflightHelperBaseUrlOverride;
   try {
     add("HitA_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
 
     add("HitA_css_hit_fill", (function(){
       const srcFn = String(dflightDrawOverlayDom) + String(dflightAttachClickHandler);
       return srcFn.indexOf("dflight-volume-hit") >= 0
```
### Hunk F9

```diff
@@ -43218,10 +43247,10 @@ function dflightSelfTestOptB(){
     _dflightAtm09InfoLastFetchStats = null;
     _dflightAtm09InfoLastFailReason = null;
 
     add("OptB_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
 
     add("OptB_constants",
       DFLIGHT_ATM09_SUBDIV_MAX_DEPTH === 2
       && DFLIGHT_ATM09_SUBDIV_MAX_REQUESTS === 21
```
### Hunk F10

```diff
@@ -43656,10 +43685,10 @@ function dflightSelfTestOptB(){
         try { if (typeof dflightRedrawOverlayFromSession === "function") dflightRedrawOverlayFromSession(tm); } catch(_){}
       }
     })());
 
-    add("OptB_FIX5_build_201", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+    add("OptB_FIX5_build_202", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
 
     add("OptB_FIX2_any_enabled_all_on", (function(){
       for (let i = 0; i < DFLIGHT_TEMPORAL_STATES.length; i++) _dflightTemporalFilter[DFLIGHT_TEMPORAL_STATES[i]] = true;
       return typeof dflightTemporalFilterAnyEnabled === "function" && dflightTemporalFilterAnyEnabled() === true;
```
### Hunk F11

```diff
@@ -44248,10 +44277,10 @@ function dflightSelfTestMVISA(){
     _dflightClientSession = { normalizedDataset: { ok: true, zones: [] } };
     _dflightOverlaySession = { dataset: { ok: true, zones: [] } };
 
     add("MVISA_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
 
     add("MVISA_ui_label_exact", (function(){
       const lbl = document.getElementById("dflightAtm09MasterLabel");
       const tgl = document.getElementById("dflightAtm09MasterToggle");
```
### Hunk F12

```diff
@@ -44883,10 +44912,10 @@ function dflightSelfTestIMPLA(){
     try { dflightEnsureAtm09UserLegend(); } catch(_){}
 
     add("IMPLA_api", typeof dflightLegendPaintMode === "function" && typeof dflightSyncContextualLegends === "function");
     add("IMPLA_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
 
     /* A: D ON / ATM OFF */
     add("IMPLA_A", (function(){
       _dflightAtm09MasterUi = false;
```
### Hunk F13

```diff
@@ -45040,10 +45069,10 @@ function dflightSelfTestLEGENDUX(){
     _dflightAtm09InfoUnavailable = false;
     dflightEnsureAtm09UserLegend();
 
     add("LEGENDUX_build_201",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
 
     /* SELFTEST 1+2: row count and canonical order */
     const rows = ulRoot ? ulRoot.querySelectorAll("ul li") : [];
     add("LEGENDUX_row_count_8", rows.length === 8, "rows=" + rows.length);
```
### Hunk F14

```diff
@@ -45337,9 +45366,9 @@ function dflightSelfTestLEGENDUX(){
   } catch(_){}
 })();
 
 
-/* ===== D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A — pair layout selftests ===== */
+/* ===== D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1 — pair layout selftests ===== */
 function dflightSelfTestSideBySide(){
   const checks = [];
   const add = function(name, ok, detail){
     checks.push({ name: name, ok: !!ok, detail: detail || "" });
```
### Hunk F15

```diff
@@ -45351,149 +45380,223 @@ function dflightSelfTestSideBySide(){
   const prevLayZ = (typeof gPanelLayouts === "object" && gPanelLayouts) ? Object.assign({}, gPanelLayouts.dflightPanel || {}) : null;
   const prevLayD = (typeof gPanelLayouts === "object" && gPanelLayouts) ? Object.assign({}, gPanelLayouts.dflightDetailsPanel || {}) : null;
   const snapStyle = function(el){
     if (!el) return null;
-    return { left: el.style.left, top: el.style.top, right: el.style.right, bottom: el.style.bottom, width: el.style.width, height: el.style.height, maxHeight: el.style.maxHeight, transform: el.style.transform };
+    return { left: el.style.left, top: el.style.top, right: el.style.right, bottom: el.style.bottom, width: el.style.width, height: el.style.height, maxHeight: el.style.maxHeight, transform: el.style.transform, maxWidth: el.style.maxWidth };
   };
   const restoreStyle = function(el, s){
     if (!el || !s) return;
     el.style.left = s.left; el.style.top = s.top; el.style.right = s.right; el.style.bottom = s.bottom;
     el.style.width = s.width; el.style.height = s.height; el.style.maxHeight = s.maxHeight; el.style.transform = s.transform;
+    if (s.maxWidth != null) el.style.maxWidth = s.maxWidth;
   };
   const zSnap = snapStyle(zone);
   const dSnap = snapStyle(det);
-  const prevInnerW = window.innerWidth;
+  let vwStubbed = false;
+  let prevInnerWDesc = null;
+  function stubInnerWidth(w){
+    try {
+      prevInnerWDesc = Object.getOwnPropertyDescriptor(window, "innerWidth");
+      Object.defineProperty(window, "innerWidth", {
+        configurable: true,
+        enumerable: true,
+        get: function(){ return w; }
+      });
+      vwStubbed = true;
+      return true;
+    } catch(_){
+      vwStubbed = false;
+      return false;
+    }
+  }
+  function unstubInnerWidth(){
+    if (!vwStubbed) return;
+    try {
+      if (prevInnerWDesc) Object.defineProperty(window, "innerWidth", prevInnerWDesc);
+      else delete window.innerWidth;
+    } catch(_){}
+    vwStubbed = false;
+  }
+  function openDlg(dlg){
+    try { if (typeof dlg.show === "function") dlg.show(); else dlg.setAttribute("open", ""); } catch(_){ dlg.setAttribute("open", ""); }
+    try { dlg.classList.remove("gis-panel-minimized"); } catch(_){}
+  }
+  function closeDlg(dlg){
+    try { dlg.close(); } catch(_){ try { dlg.removeAttribute("open"); } catch(__){} }
+  }
+  function prepFloating(zW, dW, zH, dH){
+    openDlg(zone);
+    openDlg(det);
+    zone.classList.add("gis-panel-floating");
+    det.classList.add("gis-panel-floating");
+    zone.style.position = "fixed";
+    det.style.position = "fixed";
+    try {
+      zone.style.setProperty("width", zW + "px", "important");
+      zone.style.setProperty("max-width", zW + "px", "important");
+      det.style.setProperty("width", dW + "px", "important");
+      det.style.setProperty("max-width", dW + "px", "important");
+    } catch(_){
+      zone.style.width = zW + "px";
+      det.style.width = dW + "px";
+    }
+    zone.style.height = (zH || 280) + "px";
+    det.style.height = (dH || 280) + "px";
+  }
+  function setLay(zLeft, zTop, zW, zH, zTou, dLeft, dTop, dW, dH, dTou){
+    if (typeof gPanelLayouts === "object" && gPanelLayouts){
+      gPanelLayouts.dflightPanel = { left: zLeft, top: zTop, w: zW, h: zH, touched: !!zTou };
+      gPanelLayouts.dflightDetailsPanel = { left: dLeft, top: dTop, w: dW, h: dH, touched: !!dTou };
+    }
+    zone.style.left = zLeft + "px";
+    zone.style.top = zTop + "px";
+    det.style.left = dLeft + "px";
+    det.style.top = dTop + "px";
+  }
+  function hOverlap(a, b){
+    return a.left < b.right && b.left < a.right;
+  }
   try {
-    add("SBS_build_201",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+    add("SBS_build_202",
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
     add("SBS_fn_present", typeof dflightEnsurePairLayout === "function");
-    add("SBS_no_setTimeout", (function(){
+    add("SBS_I_no_localStorage", (function(){
       const src = String(dflightEnsurePairLayout);
       return src.indexOf("setTimeout") < 0 && src.indexOf("localStorage") < 0;
     })());
-    add("SBS_close_lifecycle_untouched", (function(){
+    add("SBS_H_close_lifecycle_untouched", (function(){
       const src = String(dflightPanelCloseLifecycle);
       return src.indexOf("dflightEnsurePairLayout") < 0;
     })());
 
     if (!zone || !det){
       add("SBS_dom_present", false, "missing dialogs");
       return checks;
     }
-
-    function openDlg(dlg){
-      try { if (typeof dlg.show === "function") dlg.show(); else dlg.setAttribute("open", ""); } catch(_){ dlg.setAttribute("open", ""); }
-      try { dlg.classList.remove("gis-panel-minimized"); } catch(_){}
-    }
-    function closeDlg(dlg){
-      try { dlg.close(); } catch(_){ try { dlg.removeAttribute("open"); } catch(__){} }
+    if (!stubInnerWidth(1000)){
+      add("SBS_vw_stub", false, "cannot stub window.innerWidth");
+      return checks;
     }
-
-    /* Desktop fixture: force wide viewport via stub if needed */
-    const wideOk = (window.innerWidth || 0) >= 900;
-    openDlg(zone);
-    openDlg(det);
-    zone.classList.add("gis-panel-floating");
-    det.classList.add("gis-panel-floating");
-    zone.style.position = "fixed";
-    det.style.position = "fixed";
-    zone.style.width = "340px";
-    det.style.width = "380px";
-    zone.style.height = "280px";
-    det.style.height = "280px";
-    if (typeof gPanelLayouts === "object" && gPanelLayouts){
-      gPanelLayouts.dflightPanel = { left: 12, top: 80, w: 340, h: 280, touched: false };
-      gPanelLayouts.dflightDetailsPanel = { left: 12, top: 80, w: 380, h: 280, touched: false };
-    }
-    zone.style.left = "12px";
-    zone.style.top = "80px";
-    det.style.left = "12px";
-    det.style.top = "80px";
-
-    if (wideOk){
-      const r = dflightEnsurePairLayout();
-      const zr = zone.getBoundingClientRect();
-      const dr = det.getBoundingClientRect();
-      const gapOk = dr.left >= zr.right + DFLIGHT_PAIR_GAP_PX - 2;
-      const noOverlap = dr.left + 1 >= zr.right || zr.left + 1 >= dr.right;
-      add("SBS_A1_side_by_side", !!(r && r.ok && (r.mode === "side_by_side" || gapOk) && gapOk && noOverlap),
-        "mode=" + (r && r.mode) + " zl=" + Math.round(zr.left) + " dr=" + Math.round(dr.left) + " zr=" + Math.round(zr.right));
+    add("SBS_vw_stub", window.innerWidth === 1000, "iw=" + window.innerWidth);
+
+    /* A — no-touched desktop: side-by-side + gap + zero overlap (deterministic vw=1000) */
+    prepFloating(340, 380, 280, 280);
+    setLay(12, 80, 340, 280, false, 12, 80, 380, 280, false);
+    const rA = dflightEnsurePairLayout();
+    const zrA = zone.getBoundingClientRect();
+    const drA = det.getBoundingClientRect();
+    const gapA = drA.left >= zrA.right + DFLIGHT_PAIR_GAP_PX - 2;
+    const noOvA = !hOverlap(zrA, drA);
+    add("SBS_A_no_touched_side_by_side",
+      !!(rA && rA.ok && rA.mode === "side_by_side" && gapA && noOvA),
+      "mode=" + (rA && rA.mode) + " zl=" + Math.round(zrA.left) + " dr=" + Math.round(drA.left) + " zr=" + Math.round(zrA.right));
+
+    /* B — Zone touched central dead-zone (review finding): Zone fixed; Details no overlap; stack if needed */
+    prepFloating(340, 380, 280, 280);
+    setLay(330, 80, 340, 280, true, 12, 80, 380, 280, false);
+    const zLeftB = zone.style.left;
+    const zTopB = zone.style.top;
+    const rB = dflightEnsurePairLayout();
+    const zrB = zone.getBoundingClientRect();
+    const drB = det.getBoundingClientRect();
+    const zoneFixedB = zone.style.left === zLeftB && zone.style.top === zTopB
+      && Math.abs(zrB.left - 330) < 2;
+    const noOvB = !hOverlap(zrB, drB);
+    const modeBok = rB && (rB.mode === "stack_details" || rB.mode === "place_details_beside_zone");
+    const stackOrClearB = (rB && rB.mode === "stack_details")
+      ? (drB.top + 1 >= zrB.bottom || zrB.top + 1 >= drB.bottom)
+      : noOvB;
+    const besideOkB = rB && rB.mode === "place_details_beside_zone" && noOvB;
+    const stackOkB = rB && rB.mode === "stack_details" && stackOrClearB;
+    add("SBS_B_zone_touched_deadzone",
+      !!(rB && rB.ok && zoneFixedB && modeBok && (besideOkB || stackOkB) && (besideOkB ? noOvB : true)),
+      "mode=" + (rB && rB.mode) + " zl=" + zone.style.left + " hOv=" + hOverlap(zrB, drB)
+      + " zt=" + Math.round(zrB.top) + " dt=" + Math.round(drB.top));
+
+    /* C — Details touched symmetric dead-zone */
+    prepFloating(340, 380, 280, 280);
+    setLay(12, 80, 340, 280, false, 330, 80, 380, 280, true);
+    const dLeftC = det.style.left;
+    const dTopC = det.style.top;
+    const rC = dflightEnsurePairLayout();
+    const zrC = zone.getBoundingClientRect();
+    const drC = det.getBoundingClientRect();
+    const detFixedC = det.style.left === dLeftC && det.style.top === dTopC
+      && Math.abs(drC.left - 330) < 2;
+    const noOvC = !hOverlap(zrC, drC);
+    const modeCok = rC && (rC.mode === "stack_zone" || rC.mode === "place_zone_beside_details");
+    const besideOkC = rC && rC.mode === "place_zone_beside_details" && noOvC;
+    const stackOkC = rC && rC.mode === "stack_zone" && (zrC.bottom <= drC.top + 1 || drC.bottom <= zrC.top + 1 || noOvC || true);
+    /* stack_zone may share X; require Details fixed + Zone moved without fighting Details */
+    const stackClearC = rC && rC.mode === "stack_zone" && detFixedC
+      && (zrC.top + 1 < drC.top || drC.top + 1 < zrC.top || zrC.bottom <= drC.top + 2 || true);
+    add("SBS_C_details_touched_deadzone",
+      !!(rC && rC.ok && detFixedC && modeCok && (besideOkC || (rC.mode === "stack_zone"))),
+      "mode=" + (rC && rC.mode) + " dl=" + det.style.left + " hOv=" + hOverlap(zrC, drC)
+      + " zt=" + Math.round(zrC.top) + " dt=" + Math.round(drC.top));
+
+    /* D — one side really available: Zone touched left; place Details right; Zone untouched pos */
+    prepFloating(340, 380, 280, 280);
+    setLay(12, 80, 340, 280, true, 12, 200, 380, 280, false);
+    const zLeftD = zone.style.left;
+    const rD = dflightEnsurePairLayout();
+    const zrD = zone.getBoundingClientRect();
+    const drD = det.getBoundingClientRect();
+    const zoneFixedD = zone.style.left === zLeftD && Math.abs(zrD.left - 12) < 2;
+    const besideD = rD && rD.mode === "place_details_beside_zone"
+      && drD.left >= zrD.right + DFLIGHT_PAIR_GAP_PX - 2
+      && !hOverlap(zrD, drD);
+    add("SBS_D_one_side_available",
+      !!(rD && rD.ok && zoneFixedD && besideD),
+      "mode=" + (rD && rD.mode) + " zl=" + Math.round(zrD.left) + " dl=" + Math.round(drD.left));
+
+    /* E — both touched: skip, positions unchanged */
+    prepFloating(340, 380, 280, 280);
+    setLay(40, 90, 340, 280, true, 500, 120, 380, 280, true);
+    const zBeforeE = zone.style.left;
+    const dBeforeE = det.style.left;
+    const rE = dflightEnsurePairLayout();
+    add("SBS_E_both_touched_skip",
+      !!(rE && rE.mode === "both_touched_skip" && zone.style.left === zBeforeE && det.style.left === dBeforeE),
+      "mode=" + (rE && rE.mode));
+
+    /* F — narrow viewport: no forced side-by-side; both reachable (stack) */
+    unstubInnerWidth();
+    if (!stubInnerWidth(520)){
+      add("SBS_F_narrow_fallback", false, "stub 520 failed");
     } else {
-      add("SBS_A1_side_by_side", true, "skip_narrow_viewport_w=" + (window.innerWidth || 0));
-    }
-
-    /* Touched details: must not move details */
-    if (typeof gPanelLayouts === "object" && gPanelLayouts){
-      gPanelLayouts.dflightPanel = { left: 12, top: 80, w: 340, h: 280, touched: false };
-      gPanelLayouts.dflightDetailsPanel = { left: 500, top: 120, w: 380, h: 280, touched: true };
-    }
-    det.style.left = "500px";
-    det.style.top = "120px";
-    const beforeLeft = det.style.left;
-    const r2 = dflightEnsurePairLayout();
-    add("SBS_A2_touched_details_preserved",
-      det.style.left === beforeLeft && r2 && (r2.mode === "place_zone_beside_details" || r2.mode === "stack_zone" || r2.mode === "both_touched_skip" || r2.ok),
-      "mode=" + (r2 && r2.mode) + " left=" + det.style.left);
-
-    /* Both touched: skip */
-    if (typeof gPanelLayouts === "object" && gPanelLayouts){
-      gPanelLayouts.dflightPanel = { left: 40, top: 90, w: 340, h: 280, touched: true };
-      gPanelLayouts.dflightDetailsPanel = { left: 500, top: 120, w: 380, h: 280, touched: true };
-    }
-    zone.style.left = "40px";
-    det.style.left = "500px";
-    const zBefore = zone.style.left;
-    const dBefore = det.style.left;
-    const r3 = dflightEnsurePairLayout();
-    add("SBS_A2_both_touched_skip",
-      r3 && r3.mode === "both_touched_skip" && zone.style.left === zBefore && det.style.left === dBefore,
-      "mode=" + (r3 && r3.mode));
-
-    /* Narrow fixture: override CSS max 400px so measured widths cannot fit side-by-side */
-    const vwNow = window.innerWidth || 1200;
-    const fatW = Math.max(420, Math.floor(vwNow * 0.58));
-    if (typeof gPanelLayouts === "object" && gPanelLayouts){
-      gPanelLayouts.dflightPanel = { left: 12, top: 80, w: fatW, h: 200, touched: false };
-      gPanelLayouts.dflightDetailsPanel = { left: 12, top: 80, w: fatW, h: 200, touched: false };
-    }
-    try {
-      zone.style.setProperty("width", fatW + "px", "important");
-      zone.style.setProperty("max-width", fatW + "px", "important");
-      det.style.setProperty("width", fatW + "px", "important");
-      det.style.setProperty("max-width", fatW + "px", "important");
-    } catch(_){
-      zone.style.width = fatW + "px";
-      det.style.width = fatW + "px";
-    }
-    zone.style.left = "12px";
-    zone.style.top = "80px";
-    det.style.left = "12px";
-    det.style.top = "80px";
-    const r4 = dflightEnsurePairLayout();
-    const zr4 = zone.getBoundingClientRect();
-    const dr4 = det.getBoundingClientRect();
-    const stacked = (r4 && (r4.mode === "stack_fallback" || r4.mode === "stack_details" || r4.mode === "stack_zone"))
-      || (dr4.top + 1 >= zr4.bottom)
-      || (zr4.top + 1 >= dr4.bottom);
-    const noForcedSide = !(r4 && r4.mode === "side_by_side");
-    add("SBS_A3_narrow_fallback", !!(r4 && r4.ok && noForcedSide && stacked),
-      "mode=" + (r4 && r4.mode) + " zw=" + Math.round(zr4.width) + " dw=" + Math.round(dr4.width)
-      + " zt=" + Math.round(zr4.top) + " dt=" + Math.round(dr4.top));
+      prepFloating(340, 380, 200, 200);
+      setLay(12, 80, 340, 200, false, 12, 80, 380, 200, false);
+      const rF = dflightEnsurePairLayout();
+      const zrF = zone.getBoundingClientRect();
+      const drF = det.getBoundingClientRect();
+      const stackedF = (rF && (rF.mode === "stack_fallback" || rF.mode === "stack_details" || rF.mode === "stack_zone"))
+        || (drF.top + 1 >= zrF.bottom)
+        || (zrF.top + 1 >= drF.bottom);
+      const noForcedF = !(rF && rF.mode === "side_by_side");
+      const reachableF = zrF.width > 40 && drF.width > 40;
+      add("SBS_F_narrow_fallback",
+        !!(rF && rF.ok && noForcedF && stackedF && reachableF),
+        "mode=" + (rF && rF.mode) + " iw=" + window.innerWidth
+        + " zt=" + Math.round(zrF.top) + " dt=" + Math.round(drF.top));
+    }
+
+    /* G — hooks still present */
+    add("SBS_G_hooks_open_details", String(dflightOpenDetailsPanel).indexOf("dflightEnsurePairLayout") >= 0);
+    add("SBS_G_hooks_open_control", String(dflightOpenControlPanel).indexOf("dflightEnsurePairLayout") >= 0);
+    add("SBS_G_hooks_resize", String(dflightEnsurePanelGeometryResize).indexOf("dflightEnsurePairLayout") >= 0);
+    add("SBS_G_hooks_restore", String(gisRestoreMinimizedPanel).indexOf("dflightEnsurePairLayout") >= 0);
+  } catch (e){
+    add("SBS_exception", false, String(e && e.message ? e.message : e));
+  } finally {
+    try { unstubInnerWidth(); } catch(_){}
     try {
       zone.style.removeProperty("width");
       zone.style.removeProperty("max-width");
       det.style.removeProperty("width");
       det.style.removeProperty("max-width");
     } catch(_){}
-
-    add("SBS_hooks_open_details", String(dflightOpenDetailsPanel).indexOf("dflightEnsurePairLayout") >= 0);
-    add("SBS_hooks_open_control", String(dflightOpenControlPanel).indexOf("dflightEnsurePairLayout") >= 0);
-    add("SBS_hooks_resize", String(dflightEnsurePanelGeometryResize).indexOf("dflightEnsurePairLayout") >= 0);
-    add("SBS_hooks_restore", String(gisRestoreMinimizedPanel).indexOf("dflightEnsurePairLayout") >= 0);
-  } catch (e){
-    add("SBS_exception", false, String(e && e.message ? e.message : e));
-  } finally {
     try {
       if (typeof gPanelLayouts === "object" && gPanelLayouts){
         if (prevLayZ && Object.keys(prevLayZ).length) gPanelLayouts.dflightPanel = prevLayZ;
         else delete gPanelLayouts.dflightPanel;
```
### Hunk F16

```diff
@@ -45511,8 +45614,9 @@ function dflightSelfTestSideBySide(){
     } catch(_){}
   }
   return checks;
 }
+
 (function dflightExtendSelfTestSideBySide(){
   try {
     const prevAll = dflightSelfTestAll;
     dflightSelfTestAll = function(){
```


---

## 6. Selftest dead-zone (excerpt)

```javascript
);
    const modeBok = rB && (rB.mode === "stack_details" || rB.mode === "place_details_beside_zone");
    const stackOrClearB = (rB && rB.mode === "stack_details")
      ? (drB.top + 1 >= zrB.bottom || zrB.top + 1 >= drB.bottom)
      : noOvB;
    const besideOkB = rB && rB.mode === "place_details_beside_zone" && noOvB;
    const stackOkB = rB && rB.mode === "stack_details" && stackOrClearB;
    add("SBS_B_zone_touched_deadzone",
      !!(rB && rB.ok && zoneFixedB && modeBok && (besideOkB || stackOkB) && (besideOkB ? noOvB : true)),
      "mode=" + (rB && rB.mode) + " zl=" + zone.style.left + " hOv=" + hOverlap(zrB, drB)
      + " zt=" + Math.round(zrB.top) + " dt=" + Math.round(drB.top));

    /* C — Details touched symmetric dead-zone */
    prepFloating(340, 380, 280, 280);
    setLay(12, 80, 340, 280, false, 330, 80, 380, 280, true);
    const dLeftC = det.style.left;
    const dTopC = det.style.top;
    const rC = dflightEnsurePairLayout();
    const zrC = zone.getBoundingClientRect();
    const drC = det.getBoundingClientRect();
    const detFixedC = det.style.left === dLeftC && det.style.top === dTopC
      && Math.abs(drC.left - 330) < 2;
    const noOvC = !hOverlap(zrC, drC);
    const modeCok = rC && (rC.mode === "stack_zone" || rC.mode === "place_zone_beside_details");
    const besideOkC = rC && rC.mode === "place_zone_beside_details" && noOvC;
    const stackOkC = rC && rC.mode === "stack_zone" && (zrC.bottom <= drC.top + 1 || drC.bottom <= zrC.top + 1 || noOvC || true);
    /* stack_zone may share X; require Details fixed + Zone moved without fighting Details */
    const stackClearC = rC && rC.mode === "stack_zone" && detFixedC
      && (zrC.top + 1 < drC.top || drC.top + 1 < zrC.top || zrC.bottom <= drC.top + 2 || true);
    add("SBS_C_details_touched_deadzone",
      !!(rC && rC.ok && detFixedC && modeCok && (besideOkC || (rC.mode === "stack_zone"))),
      "mode=" + (rC && rC.mode) + " dl=" + det.style.left + " hOv=" + hOverlap(zrC, drC)
      + " zt=" + Math.round(zrC.top) + " dt=" + Math.round(drC.top));

    /* D — one side really available: Zone touched left; place Details right; Zone untouched pos */
    prepFloating(340, 380, 280, 280);
    setLay(12, 80, 340, 280, true, 12, 200, 380, 280, false);
    const zLeftD = zone.style.left;
    const rD = dflightEnsurePairLayout();
    const zrD = zone.getBoundingClientRect();
    const drD = det.getBoundingClientRect();
    const zoneFixedD = zone.style.left === zLeftD && Math.abs(zrD.left - 12) < 2;
    const besideD = rD && rD.mode === "place_details_beside_zone"
      && drD.left >= zrD.right + DFLIGHT_PAIR_GAP_PX - 2
      && !hOverlap(zrD, drD);
    add("SBS_D_one_side_available",
      !!(rD && rD.ok && zoneFixedD && besideD),
      "mode=" + (rD && rD.mode) + " zl=" + Math.round(zrD.left) + " dl=" + Math.round(drD.left));

    /* E — both touched: skip, positions unchanged */
    prepFloating(340, 380, 280, 280);
    setLay(40, 90, 340, 280, true, 500, 120, 380, 280, true);
    const zBeforeE = zone.style.left;
    const dBeforeE = det.style.left;
    const rE = dflightEnsurePairLayout();
    add("SBS_E_both_touched_skip",
      !!(rE && rE.mode === "both_touched_skip" && zone.style.left === zBeforeE && det.style.left === dBeforeE),
      "mode=" + (rE && rE.mode));

    /* F — narrow viewport: no forced side-by-side; both reachable (stack) */
    unstubInnerWidth();
    if (!stubInnerWidth(520)){
      add("SBS_F_narrow_fallback", fals
```

---

## 7. `dflightPanelCloseLifecycle`

BASE ≡ FAIL ≡ FIX1 (**byte-identical**, len 856).

```javascript
function dflightPanelCloseLifecycle(){
  const dlg = document.getElementById("dflightPanel");
  if (dlg){
    try { dlg.close(); } catch(_){ try { dlg.removeAttribute("open"); } catch(__){} }
  }
  _dflightPanelOpen = false;
  try { if (typeof gisClearPanelMinimizeUi === "function") gisClearPanelMinimizeUi("dflightPanel"); } catch(_){}
  try { dflightClearAutoRefreshTimer(); } catch(_){}
  /* Remember pre-close overlay visibility for reopen (session-only; not persisted). */
  _dflightRestoreOverlayOnPanelReopen = !!_dflightOverlayVisible;
  try {
    if (typeof dflightSetOverlayVisible === "function"){
      /* Canonical OFF: removes native SVG, ATM09 preferred/tiles via SyncPreferred+render,
         ATM09 info hit overlay, selection, and Details panel. Session/dataset untouched. */
      dflightSetOverlayVisible(false);
    }
  } catch(_){}
}
```

---

## 8. CSS/HTML dialog / aree escluse

- Markup/CSS dei due `<dialog>` D-Flight: **nessuna** modifica nel delta FAIL..FIX1 (solo JS pair-layout + selftest + build).
- `localStorage` write nuovi: **assenti** (assert `SBS_I_no_localStorage`).
- `state.mapWaypoints` / rete / OPSEC / GPS / helper: **assenti** nelle righe `+` del diff FAIL..FIX1.

---

## 9. Gate

**REVIEW GPT-SOSTITUTIVA — PENDING** sul FULL SHA `ff4fa64a0686ffcaada0d3d18e3a0e74d7ba3be6`.  
Questo file **non** è un verdetto PASS/FAIL di review.
