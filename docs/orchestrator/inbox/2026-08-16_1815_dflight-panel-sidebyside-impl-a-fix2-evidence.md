# D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2 — REVIEW EVIDENCE

**BLOCK-ID:** D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (nessun verdetto)  
**NO** deploy · **NO** ABQA · **NO** QA · **NO** finito

---

## 1. SHA / ancestry

| Ruolo | Full SHA |
|-------|----------|
| REVIEW BASE | `67d9cc79c4896adc39b7a38a6828bf4d31346305` |
| CANDIDATE FIX1 FAIL | `ff4fa64a0686ffcaada0d3d18e3a0e74d7ba3be6` |
| CANDIDATE FIX2 | `a40d216300deefa2c23f6b20585f9543c6ee024c` |

Ancestry: BASE ⊆ FIX1 ⊆ FIX2.

Build: **203** · `APP_BUILD_ID=D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2`

---

## 2. Selftest output (reale)

### `dflightSelfTestSideBySide`
```json
{
  "ok": true,
  "total": 20,
  "fail": [],
  "all": [
    {
      "name": "SBS_build_203",
      "ok": true,
      "detail": ""
    },
    {
      "name": "SBS_fn_present",
      "ok": true,
      "detail": ""
    },
    {
      "name": "SBS_L_no_localStorage",
      "ok": true,
      "detail": ""
    },
    {
      "name": "SBS_K_close_lifecycle_untouched",
      "ok": true,
      "detail": ""
    },
    {
      "name": "SBS_no_permissive_or_true",
      "ok": true,
      "detail": ""
    },
    {
      "name": "SBS_vw_stub",
      "ok": true,
      "detail": "iw=1000 ih=1100"
    },
    {
      "name": "SBS_geom_stub",
      "ok": true,
      "detail": "safeTop=60 bottom=1100"
    },
    {
      "name": "SBS_A_no_touched_side_by_side",
      "ok": true,
      "detail": "mode=side_by_side zl=12 dl=362"
    },
    {
      "name": "SBS_B_zone_touched_deadzone",
      "ok": true,
      "detail": "mode=stack_details_below zl=330px sep=true zt=80 dt=370"
    },
    {
      "name": "SBS_C_details_touched_deadzone",
      "ok": true,
      "detail": "mode=stack_zone_below dl=330px sep=true zt=370 dt=80"
    },
    {
      "name": "SBS_D_right_side_available",
      "ok": true,
      "detail": "mode=place_details_beside_zone dl=362"
    },
    {
      "name": "SBS_E_left_side_available",
      "ok": true,
      "detail": "mode=place_details_beside_zone dl=258 zr=648"
    },
    {
      "name": "SBS_F_below_when_sides_blocked",
      "ok": true,
      "detail": "mode=stack_details_below dt=370 zb=360"
    },
    {
      "name": "SBS_G_above_when_below_blocked",
      "ok": true,
      "detail": "mode=stack_zone_above zt=630 zb=810 dt=820"
    },
    {
      "name": "SBS_H_both_touched_skip",
      "ok": true,
      "detail": "mode=both_touched_skip"
    },
    {
      "name": "SBS_I_partial_visible",
      "ok": true,
      "detail": "mode=partial_visible_details sep=false zw=340 dw=380"
    },
    {
      "name": "SBS_J_hooks_open_details",
      "ok": true,
      "detail": ""
    },
    {
      "name": "SBS_J_hooks_open_control",
      "ok": true,
      "detail": ""
    },
    {
      "name": "SBS_J_hooks_resize",
      "ok": true,
      "detail": ""
    },
    {
      "name": "SBS_J_hooks_restore",
      "ok": true,
      "detail": ""
    }
  ]
}
```

### `dflightSelfTestAll`
```json
{
  "ok": true,
  "total": 396,
  "failCount": 0,
  "fail": []
}
```

---

## 3. Stat

### BASE..FIX2
```
coordinate_converter Claude.html | 618 +++++++++++++++++++++++++++++++++++++--
 1 file changed, 596 insertions(+), 22 deletions(-)
```
Hunk headers (`-U2`): **17**

| H1 | `@@ -23573,8 +23573,8 @@ const UI_STORAGE_KEY = "coordconv_ui_v1";` |
| H2 | `@@ -36877,4 +36877,222 @@ function dflightRestorePanelToSafeTop(dlg, kind){` |
| H3 | `@@ -36916,4 +37134,5 @@ function dflightEnsurePanelGeometryResize(){` |
| H4 | `@@ -37076,4 +37295,5 @@ function dflightOpenControlPanel(){` |
| H5 | `@@ -37096,4 +37316,5 @@ function dflightOpenDetailsPanel(zone){` |
| H6 | `@@ -38608,6 +38829,6 @@ function dflightSelfTestF(){` |
| H7 | `@@ -39630,6 +39851,6 @@ function dflightSelfTestTf(){` |
| H8 | `@@ -41556,6 +41777,6 @@ function dflightSelfTestH(){` |
| H9 | `@@ -42057,6 +42278,6 @@ function dflightSelfTestHitFixA(){` |
| H10 | `@@ -43071,6 +43292,6 @@ function dflightSelfTestOptB(){` |
| H11 | `@@ -43509,6 +43730,6 @@ function dflightSelfTestOptB(){` |
| H12 | `@@ -44101,6 +44322,6 @@ function dflightSelfTestMVISA(){` |
| H13 | `@@ -44736,6 +44957,6 @@ function dflightSelfTestIMPLA(){` |
| H14 | `@@ -44892,7 +45113,7 @@ function dflightSelfTestLEGENDUX(){` |
| H15 | `@@ -45189,4 +45410,355 @@ function dflightSelfTestLEGENDUX(){` |
| H16 | `@@ -74683,4 +75255,5 @@ function gisRestoreMinimizedPanel(panelId){` |
| H17 | `@@ -74690,4 +75263,5 @@ function gisRestoreMinimizedPanel(panelId){` |

### FIX1..FIX2
```
coordinate_converter Claude.html | 501 ++++++++++++++++++++++++---------------
 1 file changed, 309 insertions(+), 192 deletions(-)
```
Hunk (`-U3`): **20**

---

## 4. `dflightEnsurePairLayout` completo (FIX2)

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

    function clampPairTop(top, h, opts){
      let T = Number(top);
      if (!Number.isFinite(T)) T = safeTop;
      try {
        const usable = (typeof dflightComputePanelUsableRect === "function")
          ? dflightComputePanelUsableRect(opts)
          : null;
        if (usable && Number.isFinite(usable.bottom)){
          const maxT = Math.max(safeTop, usable.bottom - Math.min(h, Math.max(64, (opts.partialMinVisible | 0) || 64)) - (usable.pad || pad));
          if (T > maxT) T = maxT;
          if (T < safeTop) T = safeTop;
        } else if (T < safeTop){
          T = safeTop;
        }
      } catch(_){
        if (T < safeTop) T = safeTop;
      }
      return T;
    }

    function predictRect(left, top, w, h, opts){
      const L = clampPairLeft(left, w);
      const T = clampPairTop(top, h, opts);
      return { left: L, top: T, w: w, h: h, right: L + w, bottom: T + h };
    }

    function rectsSeparate(a, b){
      return !(a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom);
    }

    /**
     * FIX2: evaluate right → left → below → above; accept only post-clamp full separation.
     */
    function pickFreeAroundTouched(touchedM, freeW, freeH, freeOpts){
      const cands = [
        { side: "right", left: touchedM.right + gap, top: touchedM.top, kind: "beside" },
        { side: "left", left: touchedM.left - gap - freeW, top: touchedM.top, kind: "beside" },
        { side: "below", left: pad, top: touchedM.bottom + gap, kind: "below" },
        { side: "above", left: pad, top: touchedM.top - gap - freeH, kind: "above" }
      ];
      for (let i = 0; i < cands.length; i++){
        const c = cands[i];
        const fr = predictRect(c.left, c.top, freeW, freeH, freeOpts);
        if (rectsSeparate(touchedM, fr)){
          return { ok: true, left: fr.left, top: fr.top, side: c.side, kind: c.kind };
        }
      }
      return { ok: false };
    }

    function applyPanelPos(dlg, kind, left, top, skipSync){
      const opts = _dflightPanelLayoutOpts(kind);
      const m = measure(dlg, opts, kind === "details" ? 380 : 340);
      const L = clampPairLeft(left, m.w);
      const T = clampPairTop(top, m.h, opts);
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
      if (!skipSync){
        try { if (typeof dflightSyncAdaptivePanelGeometry === "function") dflightSyncAdaptivePanelGeometry(dlg, kind); } catch(_){}
      }
    }

    function modeForFree(freeKind, pick){
      if (!pick || !pick.ok){
        return freeKind === "details" ? "partial_visible_details" : "partial_visible_zone";
      }
      if (pick.kind === "beside"){
        return freeKind === "details" ? "place_details_beside_zone" : "place_zone_beside_details";
      }
      if (pick.kind === "below"){
        return freeKind === "details" ? "stack_details_below" : "stack_zone_below";
      }
      return freeKind === "details" ? "stack_details_above" : "stack_zone_above";
    }

    function placeFreeAroundTouched(touchedDlg, touchedKind, freeDlg, freeKind){
      const tOpts = _dflightPanelLayoutOpts(touchedKind);
      const fOpts = _dflightPanelLayoutOpts(freeKind);
      let tM = measure(touchedDlg, tOpts, touchedKind === "details" ? 380 : 340);
      const fM0 = measure(freeDlg, fOpts, freeKind === "details" ? 380 : 340);
      const cands = [
        { side: "right", left: tM.right + gap, top: tM.top, kind: "beside" },
        { side: "left", left: tM.left - gap - fM0.w, top: tM.top, kind: "beside" },
        { side: "below", left: pad, top: tM.bottom + gap, kind: "below" },
        { side: "above", left: pad, top: tM.top - gap - fM0.h, kind: "above" }
      ];
      for (let i = 0; i < cands.length; i++){
        const c = cands[i];
        const fr = predictRect(c.left, c.top, fM0.w, fM0.h, fOpts);
        if (!rectsSeparate(tM, fr)) continue;
        applyPanelPos(freeDlg, freeKind, fr.left, fr.top, true);
        tM = measure(touchedDlg, tOpts, touchedKind === "details" ? 380 : 340);
        const fM = measure(freeDlg, fOpts, freeKind === "details" ? 380 : 340);
        if (rectsSeparate(tM, fM)){
          if (c.kind === "below" || c.kind === "above"){
            try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(freeDlg, fOpts); } catch(_){}
          }
          return { ok: true, mode: modeForFree(freeKind, { ok: true, side: c.side, kind: c.kind }) };
        }
      }
      /* Complete separation impossible: canonical partial-visible place (do not claim clean stack). */
      tM = measure(touchedDlg, tOpts, touchedKind === "details" ? 380 : 340);
      applyPanelPos(freeDlg, freeKind, pad, tM.bottom + gap, true);
      try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(freeDlg, fOpts); } catch(_){}
      return { ok: true, mode: modeForFree(freeKind, null) };
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
        mD = measure(det, optsD, 380);
        if (rectsSeparate(mZ, mD)) return { ok: true, mode: "side_by_side" };
      }
      applyPanelPos(zone, "control", pad, safeTop);
      mZ = measure(zone, optsZ, 340);
      applyPanelPos(det, "details", pad, mZ.bottom + gap);
      mD = measure(det, optsD, 380);
      try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(det, optsD); } catch(_){}
      if (rectsSeparate(mZ, mD)) return { ok: true, mode: "stack_fallback" };
      return { ok: true, mode: "partial_visible_pair" };
    }

    /* FIX2: one touched — never move touched; place free via geometric pick. */
    if (touchedZ && !touchedD){
      return placeFreeAroundTouched(zone, "control", det, "details");
    }
    if (!touchedZ && touchedD){
      return placeFreeAroundTouched(det, "details", zone, "control");
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

## 5. Helper geometrici (excerpt)

```javascript
function clampPairLeft(left, w){
      let L = Number(left);
      if (!Number.isFinite(L)) L = pad;
      return Math.max(pad, Math.min(Math.max(pad, vw - w - pad), L));
    }

    function clampPairTop(top, h, opts){
      let T = Number(top);
      if (!Number.isFinite(T)) T = safeTop;
      try {
        const usable = (typeof dflightComputePanelUsableRect === "function")
          ? dflightComputePanelUsableRect(opts)
          : null;
        if (usable && Number.isFinite(usable.bottom)){
          const maxT = Math.max(safeTop, usable.bottom - Math.min(h, Math.max(64, (opts.partialMinVisible | 0) || 64)) - (usable.pad || pad));
          if (T > maxT) T = maxT;
          if (T < safeTop) T = safeTop;
        } else if (T < safeTop){
          T = safeTop;
        }
      } catch(_){
        if (T < safeTop) T = safeTop;
      }
      return T;
    }

    function predictRect(left, top, w, h, opts){
      const L = clampPairLeft(left, w);
      const T = clampPairTop(top, h, opts);
      return { left: L, top: T, w: w, h: h, right: L + w, bottom: T + h };
    }

    function rectsSeparate(a, b){
      return !(a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom);
    }

    /**
     * FIX2: evaluate right → left → below → above; accept only post-clamp full separation.
     */
    function pickFreeAroundTouched(touchedM, freeW, freeH, freeOpts){
      const cands = [
        { side: "right", left: touchedM.right + gap, top: touchedM.top, kind: "beside" },
        { side: "left", left: touchedM.left - gap - freeW, top: touchedM.top, kind: "beside" },
        { side: "below", left: pad, top: touchedM.bottom + gap, kind: "below" },
        { side: "above", left: pad, top: touchedM.top - gap - freeH, kind: "above" }
      ];
      for (let i = 0; i < cands.length; i++){
        const c = cands[i];
        const fr = predictRect(c.left, c.top, freeW, freeH, freeOpts);
        if (rectsSeparate(touchedM, fr)){
          return { ok: true, left: fr.left, top: fr.top, side: c.side, kind: c.kind };
        }
      }
      return { ok: false };
    }

    
```

---

## 6. Selftest B / C / F / G / I (excerpt)

```javascript
/* B — Zone touched central dead-zone */
    prepFloating(340, 380, 280, 280);
    setLay(330, 80, 340, 280, true, 12, 80, 380, 280, false);
    const zLB = zone.style.left, zTB = zone.style.top;
    const rB = dflightEnsurePairLayout();
    const zrB = zone.getBoundingClientRect();
    const drB = det.getBoundingClientRect();
    const zoneFixedB = zone.style.left === zLB && zone.style.top === zTB && approx(zrB.left, 330);
    const sepB = rectsSeparate(zrB, drB);
    const modeB = rB && (rB.mode === "place_details_beside_zone" || rB.mode === "stack_details_below" || rB.mode === "stack_details_above");
    add("SBS_B_zone_touched_deadzone",
      !!(rB && rB.ok && zoneFixedB && modeB && sepB),
      "mode=" + (rB && rB.mode) + " zl=" + zone.style.left + " sep=" + sepB
      + " zt=" + Math.round(zrB.top) + " dt=" + Math.round(drB.top));

    /* C — Details touched central dead-zone (must fail on FIX1, pass on FIX2) */
    prepFloating(340, 380, 280, 280);
    setLay(12, 80, 340, 280, false, 330, 80, 380, 280, true);
    const dLC = det.style.left, dTC = det.style.top;
    const rC = dflightEnsurePairLayout();
    const zrC = zone.getBoundingClientRect();
    const drC = det.getBoundingClientRect();
    const detFixedC = det.style.left === dLC && det.style.top === dTC && approx(drC.left, 330);
    const sepC = rectsSeparate(zrC, drC);
    const modeC = rC && (rC.mode === "place_zone_beside_details" || rC.mode === "stack_zone_below" || rC.mode === "stack_zone_above");
    add("SBS_C_details_touched_deadzone",
      !!(rC && rC.ok && detFixedC && modeC && sepC),
      "mode=" + (rC && rC.mode) + " dl=" + det.style.left + " sep=" + sepC
      + " zt=" + Math.round(zrC.top) + " dt=" + Math.round(drC.top));

    
/* F — no lateral room; below available (Zone touched center) */
    prepFloating(340, 380, 280, 280);
    setLay(330, 80, 340, 280, true, 12, 80, 380, 280, false);
    const zLF = zone.style.left, zTF = zone.style.top;
    const rF = dflightEnsurePairLayout();
    const zrF = zone.getBoundingClientRect();
    const drF = det.getBoundingClientRect();
    add("SBS_F_below_when_sides_blocked",
      !!(rF && rF.mode === "stack_details_below"
        && zone.style.left === zLF && zone.style.top === zTF
        && drF.top + 1 >= zrF.bottom
        && rectsSeparate(zrF, drF)),
      "mode=" + (rF && rF.mode) + " dt=" + Math.round(drF.top) + " zb=" + Math.round(zrF.bottom));

    /* G — sides blocked; only above available (Details touched near bottom of stubbed usable) */
    prepFloating(340, 380, 180, 220);
    setLay(12, 80, 340, 180, false, 330, 820, 380, 220, true);
    const dLG = det.style.left, dTG = det.style.top;
    const rG = dflightEnsurePairLayout();
    const zrG = zone.getBoundingClientRect();
    const drG = det.getBoundingClientRect();
    add("SBS_G_above_when_below_blocked",
      !!(rG && rG.mode === "stack_zone_above"
        && det.style.left === dLG && det.style.top === dTG && approx(drG.left, 330) && approx(drG.top, 820, 3)
        && zrG.bottom <= drG.top + 1
        && rectsSeparate(zrG, drG)),
      "mode=" + (rG && rG.mode) + " zt=" + Math.round(zrG.top) + " zb=" + Math.round(zrG.bottom)
      + " dt=" + Math.round(drG.top));

    
/* I — viewport too small for full separation → explicit partial_visible (no false no-overlap assert) */
    unstubViewport();
    unstubGeom();
    if (!stubViewport(420, 400) || !stubGeom(60, 400)){
      add("SBS_I_partial_visible", false, "stub tiny failed");
    } else {
      prepFloating(340, 380, 280, 280);
      setLay(12, 80, 340, 280, true, 12, 80, 380, 280, false);
      const rI = dflightEnsurePairLayout();
      const zrI = zone.getBoundingClientRect();
      const drI = det.getBoundingClientRect();
      const partialI = !!(rI && String(rI.mode || "").indexOf("partial_visible") === 0);
      add("SBS_I_partial_visible",
        !!(rI && rI.ok && partialI && approx(zrI.left, 12)
          && zrI.width > 40 && drI.width > 40),
        "mode=" + (rI && rI.mode) + " sep=" + rectsSeparate(zrI, drI)
        + " zw=" + Math.round(zrI.width) + " dw=" + Math.round(drI.width));
    }

    
```

---

## 7. Diff FIX1..FIX2 (tutti gli hunk runtime)

### F1\n\n```diff\n@@ -23572,10 +23572,10 @@ const UI_STORAGE_KEY = "coordconv_ui_v1";
 /** Strong-confirm word for full local wipe (same in IT/EN/FR UI). */
 const APP_FULL_RESET_CONFIRM_WORD = "CANCELLA";
 /** Visible runtime build label — update before each runtime `finito`. */
-const APP_BUILD_ID = "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1";
-const APP_BUILD_DETAIL = "FIX1: one-touched pair-layout requires real post-clamp side clearance; no artificial horizontal overlap; stack fallback when dead-zone.";
+const APP_BUILD_ID = "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2";
+const APP_BUILD_DETAIL = "FIX2: one-touched symmetric right/left/below/above post-clamp separation; explicit partial_visible when impossible.";
 /** Monotonic runtime build counter — increment on each runtime patch (not persisted). */
-const APP_BUILD_NUM = 202;
+const APP_BUILD_NUM = 203;
 const APP_BUILD_LABEL = APP_BUILD_ID + " · build " + APP_BUILD_NUM + " — " + APP_BUILD_DETAIL;
 function applyAppBuildLabel(){
   try {\n```\n\n### F2\n\n```diff\n@@ -36886,9 +36886,10 @@ function dflightPanelIsPairEligible(dlg){
 }
 
 /**
- * SIDEBYSIDE-IMPL-A / FIX1: local pair-layout policy for Zone + Details.
+ * SIDEBYSIDE-IMPL-A / FIX2: local pair-layout policy for Zone + Details.
  * Reuses gisPanel* + dflight geometry; session-only; no global manager.
- * FIX1: one-touched branches require real post-clamp side clearance (no artificial overlap).
+ * FIX2: one-touched — try right/left/below/above with post-clamp full separation;
+ * explicit partial_visible when complete separation is impossible.
  * @returns {{ok:boolean, mode?:string, reason?:string}}
  */
 function dflightEnsurePairLayout(){\n```\n\n### F3\n\n```diff\n@@ -36934,28 +36935,7 @@ function dflightEnsurePairLayout(){
       return Math.max(pad, Math.min(Math.max(pad, vw - w - pad), L));
     }
 
-    /** FIX1: candidate fits only if post-clamp rect has no horizontal overlap with touched. */
-    function sideCandidateFits(candLeft, freeW, tLeft, tRight){
-      const L = clampPairLeft(candLeft, freeW);
-      const R = L + freeW;
-      if (L < tRight && tLeft < R) return { ok: false, left: L };
-      return { ok: true, left: L };
-    }
-
-    function pickBesideTouched(touchedM, freeW){
-      const rightCand = touchedM.right + gap;
-      const leftCand = touchedM.left - gap - freeW;
-      const rightFit = sideCandidateFits(rightCand, freeW, touchedM.left, touchedM.right);
-      if (rightFit.ok) return { ok: true, left: rightFit.left, side: "right" };
-      const leftFit = sideCandidateFits(leftCand, freeW, touchedM.left, touchedM.right);
-      if (leftFit.ok) return { ok: true, left: leftFit.left, side: "left" };
-      return { ok: false };
-    }
-
-    function applyPanelPos(dlg, kind, left, top){
-      const opts = _dflightPanelLayoutOpts(kind);
-      const m = measure(dlg, opts, kind === "details" ? 380 : 340);
-      let L = clampPairLeft(left, m.w);
+    function clampPairTop(top, h, opts){
       let T = Number(top);
       if (!Number.isFinite(T)) T = safeTop;
       try {\n```\n\n### F4\n\n```diff\n@@ -36963,11 +36943,53 @@ function dflightEnsurePairLayout(){
           ? dflightComputePanelUsableRect(opts)
           : null;
         if (usable && Number.isFinite(usable.bottom)){
-          const maxT = Math.max(safeTop, usable.bottom - Math.min(m.h, Math.max(64, (opts.partialMinVisible | 0) || 64)) - (usable.pad || pad));
+          const maxT = Math.max(safeTop, usable.bottom - Math.min(h, Math.max(64, (opts.partialMinVisible | 0) || 64)) - (usable.pad || pad));
           if (T > maxT) T = maxT;
           if (T < safeTop) T = safeTop;
+        } else if (T < safeTop){
+          T = safeTop;
         }
-      } catch(_){}
+      } catch(_){
+        if (T < safeTop) T = safeTop;
+      }
+      return T;
+    }
+
+    function predictRect(left, top, w, h, opts){
+      const L = clampPairLeft(left, w);
+      const T = clampPairTop(top, h, opts);
+      return { left: L, top: T, w: w, h: h, right: L + w, bottom: T + h };
+    }
+
+    function rectsSeparate(a, b){
+      return !(a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom);
+    }
+
+    /**
+     * FIX2: evaluate right → left → below → above; accept only post-clamp full separation.
+     */
+    function pickFreeAroundTouched(touchedM, freeW, freeH, freeOpts){
+      const cands = [
+        { side: "right", left: touchedM.right + gap, top: touchedM.top, kind: "beside" },
+        { side: "left", left: touchedM.left - gap - freeW, top: touchedM.top, kind: "beside" },
+        { side: "below", left: pad, top: touchedM.bottom + gap, kind: "below" },
+        { side: "above", left: pad, top: touchedM.top - gap - freeH, kind: "above" }
+      ];
+      for (let i = 0; i < cands.length; i++){
+        const c = cands[i];
+        const fr = predictRect(c.left, c.top, freeW, freeH, freeOpts);
+        if (rectsSeparate(touchedM, fr)){
+          return { ok: true, left: fr.left, top: fr.top, side: c.side, kind: c.kind };
+        }
+      }
+      return { ok: false };
+    }
+
+    function applyPanelPos(dlg, kind, left, top, skipSync){
+      const opts = _dflightPanelLayoutOpts(kind);
+      const m = measure(dlg, opts, kind === "details" ? 380 : 340);
+      const L = clampPairLeft(left, m.w);
+      const T = clampPairTop(top, m.h, opts);
       dlg.style.left = Math.round(L) + "px";
       dlg.style.top = Math.round(T) + "px";
       dlg.style.right = "auto";\n```\n\n### F5\n\n```diff\n@@ -36985,11 +37007,54 @@ function dflightEnsurePairLayout(){
           }, opts);
         }
       } catch(_){}
-      try { if (typeof dflightSyncAdaptivePanelGeometry === "function") dflightSyncAdaptivePanelGeometry(dlg, kind); } catch(_){}
+      if (!skipSync){
+        try { if (typeof dflightSyncAdaptivePanelGeometry === "function") dflightSyncAdaptivePanelGeometry(dlg, kind); } catch(_){}
+      }
+    }
+
+    function modeForFree(freeKind, pick){
+      if (!pick || !pick.ok){
+        return freeKind === "details" ? "partial_visible_details" : "partial_visible_zone";
+      }
+      if (pick.kind === "beside"){
+        return freeKind === "details" ? "place_details_beside_zone" : "place_zone_beside_details";
+      }
+      if (pick.kind === "below"){
+        return freeKind === "details" ? "stack_details_below" : "stack_zone_below";
+      }
+      return freeKind === "details" ? "stack_details_above" : "stack_zone_above";
     }
 
-    function noHOverlap(a, b){
-      return !(a.left < b.right && b.left < a.right);
+    function placeFreeAroundTouched(touchedDlg, touchedKind, freeDlg, freeKind){
+      const tOpts = _dflightPanelLayoutOpts(touchedKind);
+      const fOpts = _dflightPanelLayoutOpts(freeKind);
+      let tM = measure(touchedDlg, tOpts, touchedKind === "details" ? 380 : 340);
+      const fM0 = measure(freeDlg, fOpts, freeKind === "details" ? 380 : 340);
+      const cands = [
+        { side: "right", left: tM.right + gap, top: tM.top, kind: "beside" },
+        { side: "left", left: tM.left - gap - fM0.w, top: tM.top, kind: "beside" },
+        { side: "below", left: pad, top: tM.bottom + gap, kind: "below" },
+        { side: "above", left: pad, top: tM.top - gap - fM0.h, kind: "above" }
+      ];
+      for (let i = 0; i < cands.length; i++){
+        const c = cands[i];
+        const fr = predictRect(c.left, c.top, fM0.w, fM0.h, fOpts);
+        if (!rectsSeparate(tM, fr)) continue;
+        applyPanelPos(freeDlg, freeKind, fr.left, fr.top, true);
+        tM = measure(touchedDlg, tOpts, touchedKind === "details" ? 380 : 340);
+        const fM = measure(freeDlg, fOpts, freeKind === "details" ? 380 : 340);
+        if (rectsSeparate(tM, fM)){
+          if (c.kind === "below" || c.kind === "above"){
+            try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(freeDlg, fOpts); } catch(_){}
+          }
+          return { ok: true, mode: modeForFree(freeKind, { ok: true, side: c.side, kind: c.kind }) };
+        }
+      }
+      /* Complete separation impossible: canonical partial-visible place (do not claim clean stack). */
+      tM = measure(touchedDlg, tOpts, touchedKind === "details" ? 380 : 340);
+      applyPanelPos(freeDlg, freeKind, pad, tM.bottom + gap, true);
+      try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(freeDlg, fOpts); } catch(_){}
+      return { ok: true, mode: modeForFree(freeKind, null) };
     }
 
     let mZ = measure(zone, optsZ, 340);\n```\n\n### F6\n\n```diff\n@@ -37002,46 +37067,24 @@ function dflightEnsurePairLayout(){
         applyPanelPos(zone, "control", pad, safeTop);
         mZ = measure(zone, optsZ, 340);
         applyPanelPos(det, "details", mZ.right + gap, safeTop);
-        return { ok: true, mode: "side_by_side" };
+        mD = measure(det, optsD, 380);
+        if (rectsSeparate(mZ, mD)) return { ok: true, mode: "side_by_side" };
       }
       applyPanelPos(zone, "control", pad, safeTop);
       mZ = measure(zone, optsZ, 340);
       applyPanelPos(det, "details", pad, mZ.bottom + gap);
+      mD = measure(det, optsD, 380);
       try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(det, optsD); } catch(_){}
-      return { ok: true, mode: "stack_fallback" };
+      if (rectsSeparate(mZ, mD)) return { ok: true, mode: "stack_fallback" };
+      return { ok: true, mode: "partial_visible_pair" };
     }
 
-    /* FIX1: one touched — preserve touched; place free only if a real side clears post-clamp. */
+    /* FIX2: one touched — never move touched; place free via geometric pick. */
     if (touchedZ && !touchedD){
-      mZ = measure(zone, optsZ, 340);
-      mD = measure(det, optsD, 380);
-      const pick = pickBesideTouched(mZ, mD.w);
-      if (pick.ok){
-        applyPanelPos(det, "details", pick.left, Number.isFinite(mZ.top) ? mZ.top : safeTop);
-        mD = measure(det, optsD, 380);
-        if (noHOverlap(mZ, mD)){
-          return { ok: true, mode: "place_details_beside_zone" };
-        }
-      }
-      applyPanelPos(det, "details", pad, mZ.bottom + gap);
-      try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(det, optsD); } catch(_){}
-      return { ok: true, mode: "stack_details" };
+      return placeFreeAroundTouched(zone, "control", det, "details");
     }
     if (!touchedZ && touchedD){
-      mD = measure(det, optsD, 380);
-      mZ = measure(zone, optsZ, 340);
-      const pick = pickBesideTouched(mD, mZ.w);
-      if (pick.ok){
-        applyPanelPos(zone, "control", pick.left, Number.isFinite(mD.top) ? mD.top : safeTop);
-        mZ = measure(zone, optsZ, 340);
-        if (noHOverlap(mZ, mD)){
-          return { ok: true, mode: "place_zone_beside_details" };
-        }
-      }
-      let topZ = mD.top - gap - Math.min(mZ.h, 200);
-      if (!(topZ >= safeTop)) topZ = safeTop;
-      applyPanelPos(zone, "control", pad, topZ);
-      return { ok: true, mode: "stack_zone" };
+      return placeFreeAroundTouched(det, "details", zone, "control");
     }
     return { ok: true, mode: "noop" };
   } catch (e){\n```\n\n### F7\n\n```diff\n@@ -38785,8 +38828,8 @@ function dflightSelfTestF(){
     })());
 
     add("F_mvisa_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 203
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2");
 
     _dflightHelperBaseUrlOverride = "http://example.test:8010";
     if (typeof state !== "undefined") state.forceOffline = true;\n```\n\n### F8\n\n```diff\n@@ -39807,8 +39850,8 @@ function dflightSelfTestTf(){
       && String(dflightEnsurePanelGeometryResize).indexOf("dflightSyncAdaptivePanelGeometry") >= 0);
 
     add("Tf_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 203
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2");
   } catch (e){
     add("selftest_tf_exception", false, String(e && e.message ? e.message : e));
   } finally {\n```\n\n### F9\n\n```diff\n@@ -41733,8 +41776,8 @@ function dflightSelfTestH(){
       } catch(_){ return false; }
     })());
 
-    add("H_build_202", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
+    add("H_build_203", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 203
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2");
     add("VR_FIX1_sync_loading_passes_zoom", (function(){
       if (typeof dflightSyncLoadingUi !== "function") return false;
       const src = String(dflightSyncLoadingUi);\n```\n\n### F10\n\n```diff\n@@ -42234,8 +42277,8 @@ function dflightSelfTestHitFixA(){
   const prevBase = _dflightHelperBaseUrlOverride;
   try {
     add("HitA_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 203
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2");
 
     add("HitA_css_hit_fill", (function(){
       const srcFn = String(dflightDrawOverlayDom) + String(dflightAttachClickHandler);\n```\n\n### F11\n\n```diff\n@@ -43248,8 +43291,8 @@ function dflightSelfTestOptB(){
     _dflightAtm09InfoLastFailReason = null;
 
     add("OptB_build_196",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 203
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2");
 
     add("OptB_constants",
       DFLIGHT_ATM09_SUBDIV_MAX_DEPTH === 2\n```\n\n### F12\n\n```diff\n@@ -43686,8 +43729,8 @@ function dflightSelfTestOptB(){
       }
     })());
 
-    add("OptB_FIX5_build_202", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
+    add("OptB_FIX5_build_203", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 203
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2");
 
     add("OptB_FIX2_any_enabled_all_on", (function(){
       for (let i = 0; i < DFLIGHT_TEMPORAL_STATES.length; i++) _dflightTemporalFilter[DFLIGHT_TEMPORAL_STATES[i]] = true;\n```\n\n### F13\n\n```diff\n@@ -44278,8 +44321,8 @@ function dflightSelfTestMVISA(){
     _dflightOverlaySession = { dataset: { ok: true, zones: [] } };
 
     add("MVISA_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 203
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2");
 
     add("MVISA_ui_label_exact", (function(){
       const lbl = document.getElementById("dflightAtm09MasterLabel");\n```\n\n### F14\n\n```diff\n@@ -44913,8 +44956,8 @@ function dflightSelfTestIMPLA(){
 
     add("IMPLA_api", typeof dflightLegendPaintMode === "function" && typeof dflightSyncContextualLegends === "function");
     add("IMPLA_build_199",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 203
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2");
 
     /* A: D ON / ATM OFF */
     add("IMPLA_A", (function(){\n```\n\n### F15\n\n```diff\n@@ -45070,8 +45113,8 @@ function dflightSelfTestLEGENDUX(){
     dflightEnsureAtm09UserLegend();
 
     add("LEGENDUX_build_201",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 203
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2");
 
     /* SELFTEST 1+2: row count and canonical order */
     const rows = ulRoot ? ulRoot.querySelectorAll("ul li") : [];\n```\n\n### F16\n\n```diff\n@@ -45367,7 +45410,7 @@ function dflightSelfTestLEGENDUX(){
 })();
 
 
-/* ===== D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1 — pair layout selftests ===== */
+/* ===== D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2 — pair layout selftests ===== */
 function dflightSelfTestSideBySide(){
   const checks = [];
   const add = function(name, ok, detail){\n```\n\n### F17\n\n```diff\n@@ -45393,28 +45436,36 @@ function dflightSelfTestSideBySide(){
   const dSnap = snapStyle(det);
   let vwStubbed = false;
   let prevInnerWDesc = null;
-  function stubInnerWidth(w){
+  let vhStubbed = false;
+  let prevInnerHDesc = null;
+  function stubViewport(w, h){
     try {
       prevInnerWDesc = Object.getOwnPropertyDescriptor(window, "innerWidth");
-      Object.defineProperty(window, "innerWidth", {
-        configurable: true,
-        enumerable: true,
-        get: function(){ return w; }
-      });
+      Object.defineProperty(window, "innerWidth", { configurable: true, enumerable: true, get: function(){ return w; } });
       vwStubbed = true;
-      return true;
-    } catch(_){
+    } catch(_){ vwStubbed = false; return false; }
+    try {
+      prevInnerHDesc = Object.getOwnPropertyDescriptor(window, "innerHeight");
+      Object.defineProperty(window, "innerHeight", { configurable: true, enumerable: true, get: function(){ return h; } });
+      vhStubbed = true;
+    } catch(_){ vhStubbed = false; }
+    return vwStubbed;
+  }
+  function unstubViewport(){
+    if (vwStubbed){
+      try {
+        if (prevInnerWDesc) Object.defineProperty(window, "innerWidth", prevInnerWDesc);
+        else delete window.innerWidth;
+      } catch(_){}
       vwStubbed = false;
-      return false;
     }
-  }
-  function unstubInnerWidth(){
-    if (!vwStubbed) return;
-    try {
-      if (prevInnerWDesc) Object.defineProperty(window, "innerWidth", prevInnerWDesc);
-      else delete window.innerWidth;
-    } catch(_){}
-    vwStubbed = false;
+    if (vhStubbed){
+      try {
+        if (prevInnerHDesc) Object.defineProperty(window, "innerHeight", prevInnerHDesc);
+        else delete window.innerHeight;
+      } catch(_){}
+      vhStubbed = false;
+    }
   }
   function openDlg(dlg){
     try { if (typeof dlg.show === "function") dlg.show(); else dlg.setAttribute("open", ""); } catch(_){ dlg.setAttribute("open", ""); }\n```\n\n### F18\n\n```diff\n@@ -45435,12 +45486,14 @@ function dflightSelfTestSideBySide(){
       zone.style.setProperty("max-width", zW + "px", "important");
       det.style.setProperty("width", dW + "px", "important");
       det.style.setProperty("max-width", dW + "px", "important");
+      zone.style.setProperty("height", (zH || 280) + "px", "important");
+      det.style.setProperty("height", (dH || 280) + "px", "important");
     } catch(_){
       zone.style.width = zW + "px";
       det.style.width = dW + "px";
+      zone.style.height = (zH || 280) + "px";
+      det.style.height = (dH || 280) + "px";
     }
-    zone.style.height = (zH || 280) + "px";
-    det.style.height = (dH || 280) + "px";
   }
   function setLay(zLeft, zTop, zW, zH, zTou, dLeft, dTop, dW, dH, dTou){
     if (typeof gPanelLayouts === "object" && gPanelLayouts){\n```\n\n### F19\n\n```diff\n@@ -45452,149 +45505,217 @@ function dflightSelfTestSideBySide(){
     det.style.left = dLeft + "px";
     det.style.top = dTop + "px";
   }
-  function hOverlap(a, b){
-    return a.left < b.right && b.left < a.right;
+  function rectsSeparate(a, b){
+    return !(a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom);
+  }
+  function approx(n, exp, tol){
+    return Math.abs(Number(n) - exp) <= (tol == null ? 2 : tol);
+  }
+  let prevSafeTop = null;
+  let prevUsable = null;
+  let geomStubbed = false;
+  function stubGeom(safeTopY, bottomY){
+    try {
+      prevSafeTop = dflightComputePanelSafeTop;
+      prevUsable = dflightComputePanelUsableRect;
+      dflightComputePanelSafeTop = function(){ return safeTopY; };
+      dflightComputePanelUsableRect = function(opts){
+        const pad = (opts && Number.isFinite(opts.pad)) ? opts.pad : 12;
+        return { top: safeTopY, bottom: bottomY, pad: pad, height: Math.max(0, bottomY - safeTopY - pad) };
+      };
+      geomStubbed = true;
+      return true;
+    } catch(_){
+      geomStubbed = false;
+      return false;
+    }
+  }
+  function unstubGeom(){
+    if (!geomStubbed) return;
+    try { if (prevSafeTop) dflightComputePanelSafeTop = prevSafeTop; } catch(_){}
+    try { if (prevUsable) dflightComputePanelUsableRect = prevUsable; } catch(_){}
+    geomStubbed = false;
   }
   try {
-    add("SBS_build_202",
-      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 202
-      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX1");
+    add("SBS_build_203",
+      typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 203
+      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2");
     add("SBS_fn_present", typeof dflightEnsurePairLayout === "function");
-    add("SBS_I_no_localStorage", (function(){
+    add("SBS_L_no_localStorage", (function(){
       const src = String(dflightEnsurePairLayout);
       return src.indexOf("setTimeout") < 0 && src.indexOf("localStorage") < 0;
     })());
-    add("SBS_H_close_lifecycle_untouched", (function(){
+    add("SBS_K_close_lifecycle_untouched", (function(){
       const src = String(dflightPanelCloseLifecycle);
       return src.indexOf("dflightEnsurePairLayout") < 0;
     })());
+    add("SBS_no_permissive_or_true", (function(){
+      const src = String(dflightSelfTestSideBySide);
+      const needle = ["|", "| true"].join("");
+      return src.indexOf(needle) < 0;
+    })());
 
     if (!zone || !det){
       add("SBS_dom_present", false, "missing dialogs");
       return checks;
     }
-    if (!stubInnerWidth(1000)){
-      add("SBS_vw_stub", false, "cannot stub window.innerWidth");
+    if (!stubViewport(1000, 1100)){
+      add("SBS_vw_stub", false, "cannot stub viewport");
+      return checks;
+    }
+    add("SBS_vw_stub", window.innerWidth === 1000 && window.innerHeight === 1100,
+      "iw=" + window.innerWidth + " ih=" + window.innerHeight);
+    if (!stubGeom(60, 1100)){
+      add("SBS_geom_stub", false, "cannot stub usable rect");
       return checks;
     }
-    add("SBS_vw_stub", window.innerWidth === 1000, "iw=" + window.innerWidth);
+    add("SBS_geom_stub", true, "safeTop=60 bottom=1100");
 
-    /* A — no-touched desktop: side-by-side + gap + zero overlap (deterministic vw=1000) */
+    /* A — both untouched desktop */
     prepFloating(340, 380, 280, 280);
     setLay(12, 80, 340, 280, false, 12, 80, 380, 280, false);
     const rA = dflightEnsurePairLayout();
     const zrA = zone.getBoundingClientRect();
     const drA = det.getBoundingClientRect();
     const gapA = drA.left >= zrA.right + DFLIGHT_PAIR_GAP_PX - 2;
-    const noOvA = !hOverlap(zrA, drA);
     add("SBS_A_no_touched_side_by_side",
-      !!(rA && rA.ok && rA.mode === "side_by_side" && gapA && noOvA),
-      "mode=" + (rA && rA.mode) + " zl=" + Math.round(zrA.left) + " dr=" + Math.round(drA.left) + " zr=" + Math.round(zrA.right));
+      !!(rA && rA.mode === "side_by_side" && gapA && rectsSeparate(zrA, drA)),
+      "mode=" + (rA && rA.mode) + " zl=" + Math.round(zrA.left) + " dl=" + Math.round(drA.left));
 
-    /* B — Zone touched central dead-zone (review finding): Zone fixed; Details no overlap; stack if needed */
+    /* B — Zone touched central dead-zone */
     prepFloating(340, 380, 280, 280);
     setLay(330, 80, 340, 280, true, 12, 80, 380, 280, false);
-    const zLeftB = zone.style.left;
-    const zTopB = zone.style.top;
+    const zLB = zone.style.left, zTB = zone.style.top;
     const rB = dflightEnsurePairLayout();
     const zrB = zone.getBoundingClientRect();
     const drB = det.getBoundingClientRect();
-    const zoneFixedB = zone.style.left === zLeftB && zone.style.top === zTopB
-      && Math.abs(zrB.left - 330) < 2;
-    const noOvB = !hOverlap(zrB, drB);
-    const modeBok = rB && (rB.mode === "stack_details" || rB.mode === "place_details_beside_zone");
-    const stackOrClearB = (rB && rB.mode === "stack_details")
-      ? (drB.top + 1 >= zrB.bottom || zrB.top + 1 >= drB.bottom)
-      : noOvB;
-    const besideOkB = rB && rB.mode === "place_details_beside_zone" && noOvB;
-    const stackOkB = rB && rB.mode === "stack_details" && stackOrClearB;
+    const zoneFixedB = zone.style.left === zLB && zone.style.top === zTB && approx(zrB.left, 330);
+    const sepB = rectsSeparate(zrB, drB);
+    const modeB = rB && (rB.mode === "place_details_beside_zone" || rB.mode === "stack_details_below" || rB.mode === "stack_details_above");
     add("SBS_B_zone_touched_deadzone",
-      !!(rB && rB.ok && zoneFixedB && modeBok && (besideOkB || stackOkB) && (besideOkB ? noOvB : true)),
-      "mode=" + (rB && rB.mode) + " zl=" + zone.style.left + " hOv=" + hOverlap(zrB, drB)
+      !!(rB && rB.ok && zoneFixedB && modeB && sepB),
+      "mode=" + (rB && rB.mode) + " zl=" + zone.style.left + " sep=" + sepB
       + " zt=" + Math.round(zrB.top) + " dt=" + Math.round(drB.top));
 
-    /* C — Details touched symmetric dead-zone */
+    /* C — Details touched central dead-zone (must fail on FIX1, pass on FIX2) */
     prepFloating(340, 380, 280, 280);
     setLay(12, 80, 340, 280, false, 330, 80, 380, 280, true);
-    const dLeftC = det.style.left;
-    const dTopC = det.style.top;
+    const dLC = det.style.left, dTC = det.style.top;
     const rC = dflightEnsurePairLayout();
     const zrC = zone.getBoundingClientRect();
     const drC = det.getBoundingClientRect();
-    const detFixedC = det.style.left === dLeftC && det.style.top === dTopC
-      && Math.abs(drC.left - 330) < 2;
-    const noOvC = !hOverlap(zrC, drC);
-    const modeCok = rC && (rC.mode === "stack_zone" || rC.mode === "place_zone_beside_details");
-    const besideOkC = rC && rC.mode === "place_zone_beside_details" && noOvC;
-    const stackOkC = rC && rC.mode === "stack_zone" && (zrC.bottom <= drC.top + 1 || drC.bottom <= zrC.top + 1 || noOvC || true);
-    /* stack_zone may share X; require Details fixed + Zone moved without fighting Details */
-    const stackClearC = rC && rC.mode === "stack_zone" && detFixedC
-      && (zrC.top + 1 < drC.top || drC.top + 1 < zrC.top || zrC.bottom <= drC.top + 2 || true);
+    const detFixedC = det.style.left === dLC && det.style.top === dTC && approx(drC.left, 330);
+    const sepC = rectsSeparate(zrC, drC);
+    const modeC = rC && (rC.mode === "place_zone_beside_details" || rC.mode === "stack_zone_below" || rC.mode === "stack_zone_above");
     add("SBS_C_details_touched_deadzone",
-      !!(rC && rC.ok && detFixedC && modeCok && (besideOkC || (rC.mode === "stack_zone"))),
-      "mode=" + (rC && rC.mode) + " dl=" + det.style.left + " hOv=" + hOverlap(zrC, drC)
+      !!(rC && rC.ok && detFixedC && modeC && sepC),
+      "mode=" + (rC && rC.mode) + " dl=" + det.style.left + " sep=" + sepC
       + " zt=" + Math.round(zrC.top) + " dt=" + Math.round(drC.top));
 
-    /* D — one side really available: Zone touched left; place Details right; Zone untouched pos */
+    /* D — right side available: Zone touched at left */
     prepFloating(340, 380, 280, 280);
     setLay(12, 80, 340, 280, true, 12, 200, 380, 280, false);
-    const zLeftD = zone.style.left;
+    const zLD = zone.style.left, zTD = zone.style.top;
     const rD = dflightEnsurePairLayout();
     const zrD = zone.getBoundingClientRect();
     const drD = det.getBoundingClientRect();
-    const zoneFixedD = zone.style.left === zLeftD && Math.abs(zrD.left - 12) < 2;
-    const besideD = rD && rD.mode === "place_details_beside_zone"
-      && drD.left >= zrD.right + DFLIGHT_PAIR_GAP_PX - 2
-      && !hOverlap(zrD, drD);
-    add("SBS_D_one_side_available",
-      !!(rD && rD.ok && zoneFixedD && besideD),
-      "mode=" + (rD && rD.mode) + " zl=" + Math.round(zrD.left) + " dl=" + Math.round(drD.left));
-
-    /* E — both touched: skip, positions unchanged */
+    add("SBS_D_right_side_available",
+      !!(rD && rD.mode === "place_details_beside_zone"
+        && zone.style.left === zLD && zone.style.top === zTD && approx(zrD.left, 12)
+        && drD.left >= zrD.right + DFLIGHT_PAIR_GAP_PX - 2
+        && rectsSeparate(zrD, drD)),
+      "mode=" + (rD && rD.mode) + " dl=" + Math.round(drD.left));
+
+    /* E — left side available: Zone touched near right */
     prepFloating(340, 380, 280, 280);
-    setLay(40, 90, 340, 280, true, 500, 120, 380, 280, true);
-    const zBeforeE = zone.style.left;
-    const dBeforeE = det.style.left;
+    setLay(648, 80, 340, 280, true, 12, 200, 380, 280, false);
+    const zLE = zone.style.left, zTE = zone.style.top;
     const rE = dflightEnsurePairLayout();
-    add("SBS_E_both_touched_skip",
-      !!(rE && rE.mode === "both_touched_skip" && zone.style.left === zBeforeE && det.style.left === dBeforeE),
-      "mode=" + (rE && rE.mode));
-
-    /* F — narrow viewport: no forced side-by-side; both reachable (stack) */
-    unstubInnerWidth();
-    if (!stubInnerWidth(520)){
-      add("SBS_F_narrow_fallback", false, "stub 520 failed");
+    const zrE = zone.getBoundingClientRect();
+    const drE = det.getBoundingClientRect();
+    add("SBS_E_left_side_available",
+      !!(rE && rE.mode === "place_details_beside_zone"
+        && zone.style.left === zLE && zone.style.top === zTE && approx(zrE.left, 648)
+        && drE.right <= zrE.left - DFLIGHT_PAIR_GAP_PX + 2
+        && rectsSeparate(zrE, drE)),
+      "mode=" + (rE && rE.mode) + " dl=" + Math.round(drE.left) + " zr=" + Math.round(zrE.left));
+
+    /* F — no lateral room; below available (Zone touched center) */
+    prepFloating(340, 380, 280, 280);
+    setLay(330, 80, 340, 280, true, 12, 80, 380, 280, false);
+    const zLF = zone.style.left, zTF = zone.style.top;
+    const rF = dflightEnsurePairLayout();
+    const zrF = zone.getBoundingClientRect();
+    const drF = det.getBoundingClientRect();
+    add("SBS_F_below_when_sides_blocked",
+      !!(rF && rF.mode === "stack_details_below"
+        && zone.style.left === zLF && zone.style.top === zTF
+        && drF.top + 1 >= zrF.bottom
+        && rectsSeparate(zrF, drF)),
+      "mode=" + (rF && rF.mode) + " dt=" + Math.round(drF.top) + " zb=" + Math.round(zrF.bottom));
+
+    /* G — sides blocked; only above available (Details touched near bottom of stubbed usable) */
+    prepFloating(340, 380, 180, 220);
+    setLay(12, 80, 340, 180, false, 330, 820, 380, 220, true);
+    const dLG = det.style.left, dTG = det.style.top;
+    const rG = dflightEnsurePairLayout();
+    const zrG = zone.getBoundingClientRect();
+    const drG = det.getBoundingClientRect();
+    add("SBS_G_above_when_below_blocked",
+      !!(rG && rG.mode === "stack_zone_above"
+        && det.style.left === dLG && det.style.top === dTG && approx(drG.left, 330) && approx(drG.top, 820, 3)
+        && zrG.bottom <= drG.top + 1
+        && rectsSeparate(zrG, drG)),
+      "mode=" + (rG && rG.mode) + " zt=" + Math.round(zrG.top) + " zb=" + Math.round(zrG.bottom)
+      + " dt=" + Math.round(drG.top));
+
+    /* H — both touched skip */
+    prepFloating(340, 380, 280, 280);
+    setLay(40, 90, 340, 280, true, 500, 120, 380, 280, true);
+    const zLH = zone.style.left, dLH = det.style.left, zTH = zone.style.top, dTH = det.style.top;
+    const rH = dflightEnsurePairLayout();
+    add("SBS_H_both_touched_skip",
+      !!(rH && rH.mode === "both_touched_skip"
+        && zone.style.left === zLH && det.style.left === dLH
+        && zone.style.top === zTH && det.style.top === dTH),
+      "mode=" + (rH && rH.mode));
+
+    /* I — viewport too small for full separation → explicit partial_visible (no false no-overlap assert) */
+    unstubViewport();
+    unstubGeom();
+    if (!stubViewport(420, 400) || !stubGeom(60, 400)){
+      add("SBS_I_partial_visible", false, "stub tiny failed");
     } else {
-      prepFloating(340, 380, 200, 200);
-      setLay(12, 80, 340, 200, false, 12, 80, 380, 200, false);
-      const rF = dflightEnsurePairLayout();
-      const zrF = zone.getBoundingClientRect();
-      const drF = det.getBoundingClientRect();
-      const stackedF = (rF && (rF.mode === "stack_fallback" || rF.mode === "stack_details" || rF.mode === "stack_zone"))
-        || (drF.top + 1 >= zrF.bottom)
-        || (zrF.top + 1 >= drF.bottom);
-      const noForcedF = !(rF && rF.mode === "side_by_side");
-      const reachableF = zrF.width > 40 && drF.width > 40;
-      add("SBS_F_narrow_fallback",
-        !!(rF && rF.ok && noForcedF && stackedF && reachableF),
-        "mode=" + (rF && rF.mode) + " iw=" + window.innerWidth
-        + " zt=" + Math.round(zrF.top) + " dt=" + Math.round(drF.top));
-    }
-
-    /* G — hooks still present */
-    add("SBS_G_hooks_open_details", String(dflightOpenDetailsPanel).indexOf("dflightEnsurePairLayout") >= 0);
-    add("SBS_G_hooks_open_control", String(dflightOpenControlPanel).indexOf("dflightEnsurePairLayout") >= 0);
-    add("SBS_G_hooks_resize", String(dflightEnsurePanelGeometryResize).indexOf("dflightEnsurePairLayout") >= 0);
-    add("SBS_G_hooks_restore", String(gisRestoreMinimizedPanel).indexOf("dflightEnsurePairLayout") >= 0);
+      prepFloating(340, 380, 280, 280);
+      setLay(12, 80, 340, 280, true, 12, 80, 380, 280, false);
+      const rI = dflightEnsurePairLayout();
+      const zrI = zone.getBoundingClientRect();
+      const drI = det.getBoundingClientRect();
+      const partialI = !!(rI && String(rI.mode || "").indexOf("partial_visible") === 0);
+      add("SBS_I_partial_visible",
+        !!(rI && rI.ok && partialI && approx(zrI.left, 12)
+          && zrI.width > 40 && drI.width > 40),
+        "mode=" + (rI && rI.mode) + " sep=" + rectsSeparate(zrI, drI)
+        + " zw=" + Math.round(zrI.width) + " dw=" + Math.round(drI.width));
+    }
+
+    /* J — hooks */
+    add("SBS_J_hooks_open_details", String(dflightOpenDetailsPanel).indexOf("dflightEnsurePairLayout") >= 0);
+    add("SBS_J_hooks_open_control", String(dflightOpenControlPanel).indexOf("dflightEnsurePairLayout") >= 0);
+    add("SBS_J_hooks_resize", String(dflightEnsurePanelGeometryResize).indexOf("dflightEnsurePairLayout") >= 0);
+    add("SBS_J_hooks_restore", String(gisRestoreMinimizedPanel).indexOf("dflightEnsurePairLayout") >= 0);
   } catch (e){
     add("SBS_exception", false, String(e && e.message ? e.message : e));
   } finally {
-    try { unstubInnerWidth(); } catch(_){}
+    try { unstubViewport(); } catch(_){}
+    try { unstubGeom(); } catch(_){}
     try {
       zone.style.removeProperty("width");
       zone.style.removeProperty("max-width");
+      zone.style.removeProperty("height");
       det.style.removeProperty("width");
       det.style.removeProperty("max-width");
+      det.style.removeProperty("height");
     } catch(_){}
     try {
       if (typeof gPanelLayouts === "object" && gPanelLayouts){\n```\n\n### F20\n\n```diff\n@@ -45605,12 +45726,8 @@ function dflightSelfTestSideBySide(){
       }
       restoreStyle(zone, zSnap);
       restoreStyle(det, dSnap);
-      if (zone){
-        if (prevZOpen) openDlg(zone); else closeDlg(zone);
-      }
-      if (det){
-        if (prevDOpen) openDlg(det); else closeDlg(det);
-      }
+      if (zone){ if (prevZOpen) openDlg(zone); else closeDlg(zone); }
+      if (det){ if (prevDOpen) openDlg(det); else closeDlg(det); }
     } catch(_){}
   }
   return checks;\n```\n\n

---

## 8. `dflightPanelCloseLifecycle`

BASE ≡ FIX1 ≡ FIX2: **byte-identical** (len 856). `close_base == close_cand`: **True**.

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

## 9. Aree escluse (FIX1..FIX2 `+` lines)

| Area | Esito |
|------|--------|
| CSS/HTML dialog | assente |
| localStorage write | assente |
| state.mapWaypoints | assente |
| rete/endpoint/OPSEC/GPS/helper | assente |

---

## 10. Gate

**REVIEW GPT-SOSTITUTIVA — PENDING** su `a40d216300deefa2c23f6b20585f9543c6ee024c`.  
Questo file non è un verdetto PASS/FAIL.
