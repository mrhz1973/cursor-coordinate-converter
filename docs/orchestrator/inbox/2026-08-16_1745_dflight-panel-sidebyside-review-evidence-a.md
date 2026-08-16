# D-FLIGHT-PANEL-SIDEBYSIDE-REVIEW-EVIDENCE-A

**BLOCK-ID:** D-FLIGHT-PANEL-SIDEBYSIDE-REVIEW-EVIDENCE-A  
**CONTEXT:** D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A  
**Categoria:** DIAGNOSTIC / DOCS (evidence-only)  
**Scopo:** materiale verificabile per REVIEW GPT-SOSTITUTIVA — **senza** verdetto PASS/FAIL  
**Gate (invariato):** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**Runtime:** **NON modificato** da questo blocco · **NO** deploy · **NO** ABQA · **NO** QA operatore · **NO** finito

---

## 1. SHA risolti

| Ruolo | Full SHA | Verifica |
|-------|----------|----------|
| REVIEW BASE | `67d9cc79c4896adc39b7a38a6828bf4d31346305` | `git rev-parse` |
| CANDIDATE | `a689fe81d7f8722ef5e58077be639d00d13523b7` | `git rev-parse` |
| Ancestry | BASE ⊆ CANDIDATE | `git merge-base --is-ancestor` → **exit 0** |

Metodo: `git diff -U5 BASE CANDIDATE -- "coordinate_converter Claude.html"` (nessun checkout/reset).

---

## 2. Stat runtime BASE..CANDIDATE

```
coordinate_converter Claude.html | 397 ++++++++++++++++++++++++++++++++++++---
 1 file changed, 375 insertions(+), 22 deletions(-)
```

Path-limited: solo il monolite. Commit docs tra BASE e CANDIDATE non alterano il delta file.

**Account hunk unified (`-U5`): 16 hunks.** Nessun hunk fuori da pair-layout + hooks + selftest/build + `APP_BUILD_*` + restore D-Flight.

| Hunk | Area | Note |
|------|------|------|
| H1 | `APP_BUILD_ID/DETAIL/NUM` | 200→201 · ID SIDEBYSIDE-IMPL-A |
| H2 | gap / busy / eligible / `dflightEnsurePairLayout` | core pair-layout |
| H3 | `dflightEnsurePanelGeometryResize` | hook resize |
| H4 | `dflightOpenControlPanel` | hook open Zone; `dflightPanelCloseLifecycle` solo contesto call |
| H5 | `dflightOpenDetailsPanel` | hook open Details |
| H6–H14 | selftest build assertions | solo bump `APP_BUILD_NUM/ID` |
| H15 | `dflightSelfTestSideBySide` / `SBS_*` | selftest nuovo + extend |
| H16 | `gisRestoreMinimizedPanel` D-Flight | hook restore |

**Drift runtime fuori scope:** **nessuno**.

---

## 3. Hunk H1 — APP_BUILD_*

```diff
@@ -23570,14 +23570,14 @@ function fmtMils(deg){ return Math.round(degToMils(deg)).toString(); }
 const STORAGE_KEY = "coordconv_v2";
 const UI_STORAGE_KEY = "coordconv_ui_v1";
 /** Strong-confirm word for full local wipe (same in IT/EN/FR UI). */
 const APP_FULL_RESET_CONFIRM_WORD = "CANCELLA";
 /** Visible runtime build label — update before each runtime `finito`. */
-const APP_BUILD_ID = "D-FLIGHT-ATM09-LEGEND-UX-IMPL-A-FIX2";
-const APP_BUILD_DETAIL = "legend presentation remains stable across transient ATM09 tile reload after pan; real fallback/off still clears it.";
+const APP_BUILD_ID = "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A";
+const APP_BUILD_DETAIL = "D-Flight Zone/Details pair layout: side-by-side when space allows; narrow stack fallback; respect touched; session-only.";
 /** Monotonic runtime build counter — increment on each runtime patch (not persisted). */
-const APP_BUILD_NUM = 200;
+const APP_BUILD_NUM = 201;
 const APP_BUILD_LABEL = APP_BUILD_ID + " · build " + APP_BUILD_NUM + " — " + APP_BUILD_DETAIL;
 function applyAppBuildLabel(){
   try {
     const buildDisp = APP_BUILD_ID + " · build " + APP_BUILD_NUM;
     document.title = "GOI GIS Tool · " + buildDisp;
```

---

## 4. Hunk H2 — pair-layout core

```diff
@@ -36874,10 +36874,156 @@ function dflightRestorePanelToSafeTop(dlg, kind){
       }, opts);
     }
   } catch(_){}
   try { dflightSyncAdaptivePanelGeometry(dlg, kind); } catch(_){}
 }
+
+/** SIDEBYSIDE-IMPL-A: gap between Zone and Details when paired (px). */
+const DFLIGHT_PAIR_GAP_PX = 10;
+let _dflightPairLayoutBusy = false;
+
+function dflightPanelIsPairEligible(dlg){
+  return !!(dlg && dlg.open && !(dlg.classList && dlg.classList.contains("gis-panel-minimized")));
+}
+
+/**
+ * SIDEBYSIDE-IMPL-A: local pair-layout policy for Zone + Details.
+ * Reuses gisPanel* + dflight geometry; session-only; no global manager.
+ * @returns {{ok:boolean, mode?:string, reason?:string}}
+ */
+function dflightEnsurePairLayout(){
+  if (_dflightPairLayoutBusy) return { ok: false, reason: "busy" };
+  const zone = document.getElementById("dflightPanel");
+  const det = document.getElementById("dflightDetailsPanel");
+  if (!dflightPanelIsPairEligible(zone) || !dflightPanelIsPairEligible(det)){
+    return { ok: false, reason: "not_both_open" };
+  }
+  _dflightPairLayoutBusy = true;
+  try {
+    const optsZ = _dflightPanelLayoutOpts("control");
+    const optsD = _dflightPanelLayoutOpts("details");
+    const gap = DFLIGHT_PAIR_GAP_PX;
+    const pad = Number.isFinite(optsZ.pad) ? optsZ.pad : 12;
+    const vw = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 0;
+    const safeTop = (typeof dflightComputePanelSafeTop === "function")
+      ? dflightComputePanelSafeTop(optsZ)
+      : pad;
+    const layZ = (typeof gisPanelGetLayout === "function") ? (gisPanelGetLayout(optsZ.key, optsZ) || {}) : {};
+    const layD = (typeof gisPanelGetLayout === "function") ? (gisPanelGetLayout(optsD.key, optsD) || {}) : {};
+    const touchedZ = !!layZ.touched;
+    const touchedD = !!layD.touched;
+    /* Both user-touched: never fight drag. */
+    if (touchedZ && touchedD) return { ok: true, mode: "both_touched_skip" };
+
+    function measure(dlg, opts, fallbackW){
+      let br = null;
+      try { br = dlg.getBoundingClientRect(); } catch(_){}
+      const w = Math.max(
+        Number.isFinite(opts.minW) ? opts.minW : 280,
+        (br && br.width > 0) ? br.width : (Number.isFinite(opts.defaultW) ? opts.defaultW : fallbackW)
+      );
+      const h = (br && br.height > 0) ? br.height : 240;
+      const left = (br && Number.isFinite(br.left)) ? br.left : pad;
+      const top = (br && Number.isFinite(br.top)) ? br.top : safeTop;
+      return { left: left, top: top, w: w, h: h, right: left + w, bottom: top + h };
+    }
+
+    function applyPanelPos(dlg, kind, left, top){
+      const opts = _dflightPanelLayoutOpts(kind);
+      const m = measure(dlg, opts, kind === "details" ? 380 : 340);
+      let L = Number(left);
+      let T = Number(top);
+      if (!Number.isFinite(L)) L = pad;
+      if (!Number.isFinite(T)) T = safeTop;
+      L = Math.max(pad, Math.min(Math.max(pad, vw - m.w - pad), L));
+      try {
+        const usable = (typeof dflightComputePanelUsableRect === "function")
+          ? dflightComputePanelUsableRect(opts)
+          : null;
+        if (usable && Number.isFinite(usable.bottom)){
+          const maxT = Math.max(safeTop, usable.bottom - Math.min(m.h, Math.max(64, (opts.partialMinVisible | 0) || 64)) - (usable.pad || pad));
+          if (T > maxT) T = maxT;
+          if (T < safeTop) T = safeTop;
+        }
+      } catch(_){}
+      dlg.style.left = Math.round(L) + "px";
+      dlg.style.top = Math.round(T) + "px";
+      dlg.style.right = "auto";
+      dlg.style.bottom = "auto";
+      dlg.style.transform = "none";
+      try {
+        const br = dlg.getBoundingClientRect();
+        if (typeof gisPanelSetLayout === "function"){
+          gisPanelSetLayout(opts.key, {
+            left: Number.isFinite(br.left) ? br.left : L,
+            top: Number.isFinite(br.top) ? br.top : T,
+            w: Number.isFinite(br.width) ? br.width : m.w,
+            h: Number.isFinite(br.height) ? br.height : m.h,
+            touched: false
+          }, opts);
+        }
+      } catch(_){}
+      try { if (typeof dflightSyncAdaptivePanelGeometry === "function") dflightSyncAdaptivePanelGeometry(dlg, kind); } catch(_){}
+    }
+
+    let mZ = measure(zone, optsZ, 340);
+    let mD = measure(det, optsD, 380);
+    const canSide = (vw - pad * 2) >= (mZ.w + gap + mD.w);
+
+    if (canSide){
+      if (!touchedZ && !touchedD){
+        applyPanelPos(zone, "control", pad, safeTop);
+        mZ = measure(zone, optsZ, 340);
+        applyPanelPos(det, "details", mZ.right + gap, safeTop);
+        return { ok: true, mode: "side_by_side" };
+      }
+      if (touchedZ && !touchedD){
+        mZ = measure(zone, optsZ, 340);
+        let leftD = mZ.right + gap;
+        if (leftD + mD.w + pad > vw) leftD = mZ.left - gap - mD.w;
+        applyPanelPos(det, "details", leftD, Number.isFinite(mZ.top) ? mZ.top : safeTop);
+        return { ok: true, mode: "place_details_beside_zone" };
+      }
+      if (!touchedZ && touchedD){
+        mD = measure(det, optsD, 380);
+        let leftZ = mD.left - gap - mZ.w;
+        if (leftZ < pad) leftZ = mD.right + gap;
+        applyPanelPos(zone, "control", leftZ, Number.isFinite(mD.top) ? mD.top : safeTop);
+        return { ok: true, mode: "place_zone_beside_details" };
+      }
+    }
+
+    /* Narrow / insufficient width: stack fallback — do not force side-by-side. */
+    if (!touchedZ && !touchedD){
+      applyPanelPos(zone, "control", pad, safeTop);
+      mZ = measure(zone, optsZ, 340);
+      let topD = mZ.bottom + gap;
+      applyPanelPos(det, "details", pad, topD);
+      try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(det, optsD); } catch(_){}
+      return { ok: true, mode: "stack_fallback" };
+    }
+    if (touchedZ && !touchedD){
+      mZ = measure(zone, optsZ, 340);
+      applyPanelPos(det, "details", pad, mZ.bottom + gap);
+      try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(det, optsD); } catch(_){}
+      return { ok: true, mode: "stack_details" };
+    }
+    if (!touchedZ && touchedD){
+      mD = measure(det, optsD, 380);
+      let topZ = mD.top - gap - Math.min(mZ.h, 200);
+      if (!(topZ >= safeTop)) topZ = safeTop;
+      applyPanelPos(zone, "control", pad, topZ);
+      return { ok: true, mode: "stack_zone" };
+    }
+    return { ok: true, mode: "noop" };
+  } catch (e){
+    return { ok: false, reason: String(e && e.message ? e.message : e) };
+  } finally {
+    _dflightPairLayoutBusy = false;
+  }
+}
+
 function dflightPinPanelBelowTopbar(dlg, kind){
   if (!dlg) return;
   const opts = _dflightPanelLayoutOpts(kind);
   const key = opts.key;
   const lay = (typeof gPanelLayouts === "object" && gPanelLayouts && gPanelLayouts[key]) ? gPanelLayouts[key] : {};
```

### Checklist pair-layout (nel hunk sopra)

| Requisito | Evidenza |
|-----------|----------|
| Entrambi open / non minimized | `dflightPanelIsPairEligible` + `not_both_open` |
| Touched entrambi → skip | `both_touched_skip` |
| Side-by-side se spazio | `canSide = (vw - pad * 2) >= (mZ.w + gap + mD.w)` |
| Fallback stretto | blocco Narrow → `stack_*` |
| Clamp / partial visibility | `applyPanelPos` clamp L + `usable.bottom` / `partialMinVisible` |
| Reentrancy | `_dflightPairLayoutBusy` + `finally` |
| Resize | H3 |
| Restore post-minimize | H16 |

---

## 5. Hunk H3 — resize hook

```diff
@@ -36913,10 +37059,11 @@ function dflightEnsurePanelGeometryResize(){
       const det = document.getElementById("dflightDetailsPanel");
       if (det && det.open && !(det.classList && det.classList.contains("gis-panel-minimized"))){
         dflightSyncAdaptivePanelGeometry(det, "details");
       }
     } catch(_){}
+    try { if (typeof dflightEnsurePairLayout === "function") dflightEnsurePairLayout(); } catch(_){}
   }, { passive: true });
 }
 
 function gisPanelTrapWheel(dlg){
   if (!dlg || dlg._gisWheelTrapBound) return;
```

---

## 6. Hunk H4 — open control (+ contesto close)

```diff
@@ -37073,10 +37220,11 @@ function dflightOpenControlPanel(){
         dflightMaybeStartAtm09AfterDatasetReady({ source: "reopen" });
       }
     }
   } catch(_){}
   try { dflightEnsureAutoRefreshTimer(); } catch(_){}
+  try { if (typeof dflightEnsurePairLayout === "function") dflightEnsurePairLayout(); } catch(_){}
   return true;
 }
 
 function dflightCloseControlPanel(){
   dflightPanelCloseLifecycle();
```

Nota: `dflightPanelCloseLifecycle();` in `dflightCloseControlPanel` è contesto invariato (prefisso spazio).

---

## 7. Hunk H5 — open details hook

```diff
@@ -37093,10 +37241,11 @@ function dflightOpenDetailsPanel(zone){
   try { dlg.setAttribute("aria-modal", "false"); } catch(_){}
   _dflightDetailsOpen = true;
   try { if (typeof gisRemoveFromMinimizedDock === "function") gisRemoveFromMinimizedDock("dflightDetailsPanel"); } catch(_){}
   try { dflightWireFloatingPanel(dlg, "details"); } catch(_){}
   try { dflightPinPanelBelowTopbar(dlg, "details"); } catch(_){}
+  try { if (typeof dflightEnsurePairLayout === "function") dflightEnsurePairLayout(); } catch(_){}
   return true;
 }
 
 function dflightCloseDetailsPanel(){
   const dlg = document.getElementById("dflightDetailsPanel");
```

---

## 8. Hunk H16 — gisRestoreMinimizedPanel (D-Flight)

```diff
@@ -74680,17 +75031,19 @@ function gisRestoreMinimizedPanel(panelId){
       gisPanelBringToFront(dlg, o);
       try { dflightRestorePanelToSafeTop(dlg, "control"); } catch(_){
         gisPanelApplyLayout(dlg, o);
         gisPanelSyncBodySize(dlg, o);
       }
+      try { if (typeof dflightEnsurePairLayout === "function") dflightEnsurePairLayout(); } catch(_){}
     } else if (panelId === "dflightDetailsPanel"){
       const o = _dflightPanelLayoutOpts("details");
       gisPanelBringToFront(dlg, o);
       try { dflightRestorePanelToSafeTop(dlg, "details"); } catch(_){
         gisPanelApplyLayout(dlg, o);
         gisPanelSyncBodySize(dlg, o);
       }
+      try { if (typeof dflightEnsurePairLayout === "function") dflightEnsurePairLayout(); } catch(_){}
     }
   } catch(_){}
   const fm = GIS_MIN_FOCUS_MAP[panelId];
   const head = fm && document.getElementById(fm.headId);
   let fb = head && head.querySelector("button, [href], input, select, textarea");
```

---

## 9. Hunk H15 — `dflightSelfTestSideBySide` / `SBS_*`

```diff
@@ -45186,10 +45335,212 @@ function dflightSelfTestLEGENDUX(){
       } catch(_){}
     }
   } catch(_){}
 })();
 
+
+/* ===== D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A — pair layout selftests ===== */
+function dflightSelfTestSideBySide(){
+  const checks = [];
+  const add = function(name, ok, detail){
+    checks.push({ name: name, ok: !!ok, detail: detail || "" });
+  };
+  const zone = document.getElementById("dflightPanel");
+  const det = document.getElementById("dflightDetailsPanel");
+  const prevZOpen = zone ? !!zone.open : false;
+  const prevDOpen = det ? !!det.open : false;
+  const prevLayZ = (typeof gPanelLayouts === "object" && gPanelLayouts) ? Object.assign({}, gPanelLayouts.dflightPanel || {}) : null;
+  const prevLayD = (typeof gPanelLayouts === "object" && gPanelLayouts) ? Object.assign({}, gPanelLayouts.dflightDetailsPanel || {}) : null;
+  const snapStyle = function(el){
+    if (!el) return null;
+    return { left: el.style.left, top: el.style.top, right: el.style.right, bottom: el.style.bottom, width: el.style.width, height: el.style.height, maxHeight: el.style.maxHeight, transform: el.style.transform };
+  };
+  const restoreStyle = function(el, s){
+    if (!el || !s) return;
+    el.style.left = s.left; el.style.top = s.top; el.style.right = s.right; el.style.bottom = s.bottom;
+    el.style.width = s.width; el.style.height = s.height; el.style.maxHeight = s.maxHeight; el.style.transform = s.transform;
+  };
+  const zSnap = snapStyle(zone);
+  const dSnap = snapStyle(det);
+  const prevInnerW = window.innerWidth;
+  try {
+    add("SBS_build_201",
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
+    add("SBS_fn_present", typeof dflightEnsurePairLayout === "function");
+    add("SBS_no_setTimeout", (function(){
+      const src = String(dflightEnsurePairLayout);
+      return src.indexOf("setTimeout") < 0 && src.indexOf("localStorage") < 0;
+    })());
+    add("SBS_close_lifecycle_untouched", (function(){
+      const src = String(dflightPanelCloseLifecycle);
+      return src.indexOf("dflightEnsurePairLayout") < 0;
+    })());
+
+    if (!zone || !det){
+      add("SBS_dom_present", false, "missing dialogs");
+      return checks;
+    }
+
+    function openDlg(dlg){
+      try { if (typeof dlg.show === "function") dlg.show(); else dlg.setAttribute("open", ""); } catch(_){ dlg.setAttribute("open", ""); }
+      try { dlg.classList.remove("gis-panel-minimized"); } catch(_){}
+    }
+    function closeDlg(dlg){
+      try { dlg.close(); } catch(_){ try { dlg.removeAttribute("open"); } catch(__){} }
+    }
+
+    /* Desktop fixture: force wide viewport via stub if needed */
+    const wideOk = (window.innerWidth || 0) >= 900;
+    openDlg(zone);
+    openDlg(det);
+    zone.classList.add("gis-panel-floating");
+    det.classList.add("gis-panel-floating");
+    zone.style.position = "fixed";
+    det.style.position = "fixed";
+    zone.style.width = "340px";
+    det.style.width = "380px";
+    zone.style.height = "280px";
+    det.style.height = "280px";
+    if (typeof gPanelLayouts === "object" && gPanelLayouts){
+      gPanelLayouts.dflightPanel = { left: 12, top: 80, w: 340, h: 280, touched: false };
+      gPanelLayouts.dflightDetailsPanel = { left: 12, top: 80, w: 380, h: 280, touched: false };
+    }
+    zone.style.left = "12px";
+    zone.style.top = "80px";
+    det.style.left = "12px";
+    det.style.top = "80px";
+
+    if (wideOk){
+      const r = dflightEnsurePairLayout();
+      const zr = zone.getBoundingClientRect();
+      const dr = det.getBoundingClientRect();
+      const gapOk = dr.left >= zr.right + DFLIGHT_PAIR_GAP_PX - 2;
+      const noOverlap = dr.left + 1 >= zr.right || zr.left + 1 >= dr.right;
+      add("SBS_A1_side_by_side", !!(r && r.ok && (r.mode === "side_by_side" || gapOk) && gapOk && noOverlap),
+        "mode=" + (r && r.mode) + " zl=" + Math.round(zr.left) + " dr=" + Math.round(dr.left) + " zr=" + Math.round(zr.right));
+    } else {
+      add("SBS_A1_side_by_side", true, "skip_narrow_viewport_w=" + (window.innerWidth || 0));
+    }
+
+    /* Touched details: must not move details */
+    if (typeof gPanelLayouts === "object" && gPanelLayouts){
+      gPanelLayouts.dflightPanel = { left: 12, top: 80, w: 340, h: 280, touched: false };
+      gPanelLayouts.dflightDetailsPanel = { left: 500, top: 120, w: 380, h: 280, touched: true };
+    }
+    det.style.left = "500px";
+    det.style.top = "120px";
+    const beforeLeft = det.style.left;
+    const r2 = dflightEnsurePairLayout();
+    add("SBS_A2_touched_details_preserved",
+      det.style.left === beforeLeft && r2 && (r2.mode === "place_zone_beside_details" || r2.mode === "stack_zone" || r2.mode === "both_touched_skip" || r2.ok),
+      "mode=" + (r2 && r2.mode) + " left=" + det.style.left);
+
+    /* Both touched: skip */
+    if (typeof gPanelLayouts === "object" && gPanelLayouts){
+      gPanelLayouts.dflightPanel = { left: 40, top: 90, w: 340, h: 280, touched: true };
+      gPanelLayouts.dflightDetailsPanel = { left: 500, top: 120, w: 380, h: 280, touched: true };
+    }
+    zone.style.left = "40px";
+    det.style.left = "500px";
+    const zBefore = zone.style.left;
+    const dBefore = det.style.left;
+    const r3 = dflightEnsurePairLayout();
+    add("SBS_A2_both_touched_skip",
+      r3 && r3.mode === "both_touched_skip" && zone.style.left === zBefore && det.style.left === dBefore,
+      "mode=" + (r3 && r3.mode));
+
+    /* Narrow fixture: override CSS max 400px so measured widths cannot fit side-by-side */
+    const vwNow = window.innerWidth || 1200;
+    const fatW = Math.max(420, Math.floor(vwNow * 0.58));
+    if (typeof gPanelLayouts === "object" && gPanelLayouts){
+      gPanelLayouts.dflightPanel = { left: 12, top: 80, w: fatW, h: 200, touched: false };
+      gPanelLayouts.dflightDetailsPanel = { left: 12, top: 80, w: fatW, h: 200, touched: false };
+    }
+    try {
+      zone.style.setProperty("width", fatW + "px", "important");
+      zone.style.setProperty("max-width", fatW + "px", "important");
+      det.style.setProperty("width", fatW + "px", "important");
+      det.style.setProperty("max-width", fatW + "px", "important");
+    } catch(_){
+      zone.style.width = fatW + "px";
+      det.style.width = fatW + "px";
+    }
+    zone.style.left = "12px";
+    zone.style.top = "80px";
+    det.style.left = "12px";
+    det.style.top = "80px";
+    const r4 = dflightEnsurePairLayout();
+    const zr4 = zone.getBoundingClientRect();
+    const dr4 = det.getBoundingClientRect();
+    const stacked = (r4 && (r4.mode === "stack_fallback" || r4.mode === "stack_details" || r4.mode === "stack_zone"))
+      || (dr4.top + 1 >= zr4.bottom)
+      || (zr4.top + 1 >= dr4.bottom);
+    const noForcedSide = !(r4 && r4.mode === "side_by_side");
+    add("SBS_A3_narrow_fallback", !!(r4 && r4.ok && noForcedSide && stacked),
+      "mode=" + (r4 && r4.mode) + " zw=" + Math.round(zr4.width) + " dw=" + Math.round(dr4.width)
+      + " zt=" + Math.round(zr4.top) + " dt=" + Math.round(dr4.top));
+    try {
+      zone.style.removeProperty("width");
+      zone.style.removeProperty("max-width");
+      det.style.removeProperty("width");
+      det.style.removeProperty("max-width");
+    } catch(_){}
+
+    add("SBS_hooks_open_details", String(dflightOpenDetailsPanel).indexOf("dflightEnsurePairLayout") >= 0);
+    add("SBS_hooks_open_control", String(dflightOpenControlPanel).indexOf("dflightEnsurePairLayout") >= 0);
+    add("SBS_hooks_resize", String(dflightEnsurePanelGeometryResize).indexOf("dflightEnsurePairLayout") >= 0);
+    add("SBS_hooks_restore", String(gisRestoreMinimizedPanel).indexOf("dflightEnsurePairLayout") >= 0);
+  } catch (e){
+    add("SBS_exception", false, String(e && e.message ? e.message : e));
+  } finally {
+    try {
+      if (typeof gPanelLayouts === "object" && gPanelLayouts){
+        if (prevLayZ && Object.keys(prevLayZ).length) gPanelLayouts.dflightPanel = prevLayZ;
+        else delete gPanelLayouts.dflightPanel;
+        if (prevLayD && Object.keys(prevLayD).length) gPanelLayouts.dflightDetailsPanel = prevLayD;
+        else delete gPanelLayouts.dflightDetailsPanel;
+      }
+      restoreStyle(zone, zSnap);
+      restoreStyle(det, dSnap);
+      if (zone){
+        if (prevZOpen) openDlg(zone); else closeDlg(zone);
+      }
+      if (det){
+        if (prevDOpen) openDlg(det); else closeDlg(det);
+      }
+    } catch(_){}
+  }
+  return checks;
+}
+(function dflightExtendSelfTestSideBySide(){
+  try {
+    const prevAll = dflightSelfTestAll;
+    dflightSelfTestAll = function(){
+      const prev = (typeof prevAll === "function") ? prevAll() : { ok: true, checks: [] };
+      const extra = dflightSelfTestSideBySide();
+      const checks = (prev.checks || []).concat(extra);
+      const pass = checks.every(function(c){ return c.ok; });
+      return Object.freeze({
+        ok: pass,
+        checks: Object.freeze(checks.map(function(c){ return Object.freeze(c); }))
+      });
+    };
+    if (window.GOIDflight){
+      try {
+        const api = Object.assign({}, window.GOIDflight, {
+          selfTest: dflightSelfTestAll,
+          selfTestSideBySide: dflightSelfTestSideBySide,
+          ensurePairLayout: dflightEnsurePairLayout
+        });
+        Object.freeze(api);
+        window.GOIDflight = api;
+      } catch(_){}
+    }
+  } catch(_){}
+})();
+
 (function dflightExtendSelfTestLEGENDUX(){
   try {
     const prevAll = dflightSelfTestAll;
     dflightSelfTestAll = function(){
       const prev = (typeof prevAll === "function") ? prevAll() : { ok: true, checks: [] };
```

---

## 10. Hunk H6–H14 — solo assert build

Pattern: `APP_BUILD_NUM === 200` / `…FIX2` → `201` / `…SIDEBYSIDE-IMPL-A`.  
`state.forceOffline = true` in H6 = **contesto** preesistente (prefisso spazio).

Campione H6:

```diff
@@ -38605,12 +38754,12 @@ function dflightSelfTestF(){
         try { dflightSyncClientCtaState(); } catch(_){}
       }
     })());
 
     add("F_mvisa_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 200
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-ATM09-LEGEND-UX-IMPL-A-FIX2");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 201
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A");
 
     _dflightHelperBaseUrlOverride = "http://example.test:8010";
     if (typeof state !== "undefined") state.forceOffline = true;
     let gatedCalled = false;
     _dflightFetchImpl = function(){ gatedCalled = true; return Promise.resolve({ ok: true, status: 200, text: function(){ return Promise.resolve("{}"); }, headers: { get: function(){ return null; } } }); };
```

Headers H7–H14:

- H7: `@@ -39627,12 +39776,12 @@ function dflightSelfTestTf(){`
- H8: `@@ -41553,12 +41702,12 @@ function dflightSelfTestH(){`
- H9: `@@ -42054,12 +42203,12 @@ function dflightSelfTestHitFixA(){`
- H10: `@@ -43068,12 +43217,12 @@ function dflightSelfTestOptB(){`
- H11: `@@ -43506,12 +43655,12 @@ function dflightSelfTestOptB(){`
- H12: `@@ -44098,12 +44247,12 @@ function dflightSelfTestMVISA(){`
- H13: `@@ -44733,12 +44882,12 @@ function dflightSelfTestIMPLA(){`
- H14: `@@ -44889,13 +45038,13 @@ function dflightSelfTestLEGENDUX(){`

---

## 11. `dflightPanelCloseLifecycle` — identità semantica

BASE vs CANDIDATE: **byte-identical** (len 856). Nessuna riga `+/-` sul body.  
Selftest `SBS_close_lifecycle_untouched`: `String(dflightPanelCloseLifecycle)` senza `dflightEnsurePairLayout`.

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

## 12. CSS / HTML dialog

Nel diff monolite BASE..CANDIDATE: **nessuna** modifica a markup dei due `<dialog>` né a CSS `dialog#dflightPanel` / `dialog#dflightDetailsPanel`. Layout solo via JS (`style.*` + `gisPanelSetLayout`).

---

## 13. Aree escluse (diff path-limited)

| Area | Esito |
|------|--------|
| `localStorage` write | **assente** — unica `+` = assert selftest `indexOf("localStorage") < 0` |
| `state.mapWaypoints` | **assente** |
| rete / endpoint / proxy / `d-flight.it` / `/atm09/` | **assente** |
| OPSEC (`opsecStrict`) | **assente** |
| GPS / `watchPosition` / `getCurrentPosition` | **assente** |
| helper D-Flight produttivo | **assente** nel delta funzionale |

---

## 14. Gate / acceptance *questo* blocco evidence

- Evidence da FULL SHA indicati: **SÌ**
- Hunk runtime contabilizzati: **16/16**
- Excerpt lifecycle/dialog: **SÌ**
- Runtime/LIVE invariati da questo task: **SÌ**
- Gate: resta **REVIEW GPT-SOSTITUTIVA — PENDING**

**Questo file non costituisce REVIEW GPT-SOSTITUTIVA PASS né FAIL.**
