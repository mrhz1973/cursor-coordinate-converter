# D-FLIGHT-PANEL-SIDEBYSIDE-FIX3-REVIEW-EVIDENCE-B

**BLOCK-ID:** D-FLIGHT-PANEL-SIDEBYSIDE-FIX3-REVIEW-EVIDENCE-B  
**CONTEXT:** D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX3  
**Tipo:** DIAGNOSTIC / DOCS — evidence-only (nessuna modifica runtime)  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (nessun verdetto)

| Ruolo | Full SHA |
|-------|----------|
| BASE LIVE FAIL (FIX2) | `a40d216300deefa2c23f6b20585f9543c6ee024c` |
| CANDIDATE FIX3 | `9643ca0839878b154e68ffa003aa94570375d111` |
| Diff comando | `git diff -U8 a40d216… 9643ca0… -- "coordinate_converter Claude.html"` |
| Blob BASE | `4df31cfc013e80e26a6f079e21d198cecbd7d1fb` |
| Blob FIX3 | `e89fd070444b62aaab2d0f0a26796286f0036866` |
| Build FIX3 | **204** · `APP_BUILD_ID=D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX3` |
| LIVE VPS | resta FIX2/203 (`a40d216`) — **non** deployato |

---

## 1. Account completo hunk (17/17)

Origine: `git diff -U8 a40d216300deefa2c23f6b20585f9543c6ee024c 9643ca0839878b154e68ffa003aa94570375d111 -- "coordinate_converter Claude.html"` → **17** hunk, nessuno inatteso.

| # | Header | Classificazione | Inatteso |
|---|--------|-----------------|----------|
| 01 | `@@ -8672,17 +8672,20 @@` …legend swatch… | CSS_LEGEND `#dflightAtm09UserLegend` z 40→5 | no |
| 02 | `@@ -23567,20 +23570,20 @@` …fmtMils… | BUILD_META APP_BUILD_ID/DETAIL/NUM 203→204 | no |
| 03 | `@@ -37219,26 +37222,34 @@` …dflightWireFloatingPanel… | WIRE_DFLIGHT onDragEnd/onResizeEnd | no |
| 04 | `@@ -38823,18 +38834,18 @@` …dflightSelfTestF… | SELFTEST_BUILD_GUARD 203/FIX2→204/FIX3 | no |
| 05 | `@@ -39845,18 +39856,18 @@` …dflightSelfTestTf… | SELFTEST_BUILD_GUARD | no |
| 06 | `@@ -41121,19 +41132,21 @@` …dflightAtm09OpenDetails… | ATM09_OPEN +EnsurePairLayout | no |
| 07 | `@@ -41771,18 +41784,18 @@` …dflightSelfTestH… | SELFTEST_BUILD_GUARD | no |
| 08 | `@@ -42272,18 +42285,18 @@` …dflightSelfTestHitFixA… | SELFTEST_BUILD_GUARD | no |
| 09 | `@@ -43286,18 +43299,18 @@` …dflightSelfTestOptB… | SELFTEST_BUILD_GUARD | no |
| 10 | `@@ -43724,18 +43737,18 @@` …dflightSelfTestOptB… | SELFTEST_BUILD_GUARD | no |
| 11 | `@@ -44316,18 +44329,18 @@` …dflightSelfTestMVISA… | SELFTEST_BUILD_GUARD | no |
| 12 | `@@ -44951,18 +44964,18 @@` …dflightSelfTestIMPLA… | SELFTEST_BUILD_GUARD | no |
| 13 | `@@ -45108,18 +45121,18 @@` …dflightSelfTestLEGENDUX… | SELFTEST_BUILD_GUARD | no |
| 14 | `@@ -45532,19 +45545,19 @@` …dflightSelfTestSideBySide… | SELFTEST_BUILD_GUARD SBS_build_204 | no |
| 15 | `@@ -45699,16 +45712,104 @@` …dflightSelfTestSideBySide… | SELFTEST_SBS_R_* real-UI asserts | no |
| 16 | `@@ -75511,19 +75612,23 @@` …gisPanelAttachDrag… | GIS_ATTACH_DRAG optional onDragEnd | no |
| 17 | `@@ -75626,19 +75731,23 @@` …gisPanelAttachResize… | GIS_ATTACH_RESIZE optional onResizeEnd | no |

**Hunk inattesi:** nessuno.

---

## 2. `dflightAtm09OpenDetails` (FIX3 completo)

Ordine: `show` → Wire → Pin → **EnsurePairLayout**. Nessun `setTimeout` / timer nel body.

```javascript
function dflightAtm09OpenDetails(feat){
  if (!feat) return;
  const p = feat.properties || {};
  const body = document.getElementById("dflightDetailsPanelBody");
  const title = document.getElementById("dflightDetailsPanelTitle");
  const dlg = document.getElementById("dflightDetailsPanel");
  if (!body || !dlg) return;
  _dflightAtm09SelectedId = p.id != null ? String(p.id) : (feat.id != null ? String(feat.id) : null);
  if (title) title.textContent = p.name ? String(p.name) : ("ATM09 · " + (_dflightAtm09SelectedId || "—"));
  const rows = [
    ["ID", p.id],
    ["Nome", p.name],
    ["Tipo", p.type],
    ["Sottotipo", p.subtype],
    ["Quota max (m)", p.quota_max],
    ["Limite inf. (m)", p.lower_limit_m],
    ["Limite sup. (m)", p.upper_limit_m],
    ["Rule", p.rule],
    ["Regola", p.regola],
    ["Designator", p.designator],
    ["Valid from", p.valid_from],
    ["Valid to", p.valid_to],
    ["Priority", p.priority],
    ["Note", p.note]
  ];
  body.textContent = "";
  const dl = document.createElement("dl");
  dl.className = "dflight-details-meta";
  for (let i = 0; i < rows.length; i++){
    const k = rows[i][0], v = rows[i][1];
    if (v == null || v === "") continue;
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = String(v);
    dl.appendChild(dt);
    dl.appendChild(dd);
  }
  body.appendChild(dl);
  try {
    if (typeof dlg.show === "function" && !dlg.open) dlg.show();
    else if (!dlg.open && typeof dlg.showModal === "function") dlg.showModal();
  } catch(_){
    try { dlg.setAttribute("open", ""); } catch(__){}
  }
  try { dlg.setAttribute("aria-modal", "false"); } catch(_){}
  _dflightDetailsOpen = true;
  try { if (typeof gisRemoveFromMinimizedDock === "function") gisRemoveFromMinimizedDock("dflightDetailsPanel"); } catch(_){}
  /* FIX3: same floating/pin/pair lifecycle as native dflightOpenDetailsPanel.
   * FIX2 omitted EnsurePairLayout here → desktop overlap on map-zone click path. */
  try { dflightWireFloatingPanel(dlg, "details"); } catch(_){}
  try { dflightPinPanelBelowTopbar(dlg, "details"); } catch(_){}
  try { if (typeof dflightEnsurePairLayout === "function") dflightEnsurePairLayout(); } catch(_){}
}
```

### Diff hunk 06 (reale)

```diff
@@ -41121,19 +41132,21 @@ function dflightAtm09OpenDetails(feat){
     if (typeof dlg.show === "function" && !dlg.open) dlg.show();
     else if (!dlg.open && typeof dlg.showModal === "function") dlg.showModal();
   } catch(_){
     try { dlg.setAttribute("open", ""); } catch(__){}
   }
   try { dlg.setAttribute("aria-modal", "false"); } catch(_){}
   _dflightDetailsOpen = true;
   try { if (typeof gisRemoveFromMinimizedDock === "function") gisRemoveFromMinimizedDock("dflightDetailsPanel"); } catch(_){}
-  /* FIX3 D3: same floating/pin lifecycle as native dflightOpenDetailsPanel. */
+  /* FIX3: same floating/pin/pair lifecycle as native dflightOpenDetailsPanel.
+   * FIX2 omitted EnsurePairLayout here → desktop overlap on map-zone click path. */
   try { dflightWireFloatingPanel(dlg, "details"); } catch(_){}
   try { dflightPinPanelBelowTopbar(dlg, "details"); } catch(_){}
+  try { if (typeof dflightEnsurePairLayout === "function") dflightEnsurePairLayout(); } catch(_){}
 }
 
 function dflightAtm09AttachInteraction(tileMap){
   if (!tileMap || tileMap._dflightAtm09IxBound) return;
   tileMap._dflightAtm09IxBound = true;
   let hoverTimer = null;
   const clearT = function(){
     if (hoverTimer){ try { clearTimeout(hoverTimer); } catch(_){} hoverTimer = null; }
```

---

## 3. `dflightWireFloatingPanel` (FIX3 completo)

Callback `_dflightPairAfterUserGeom` passato **solo** qui a `gisPanelAttachDrag` / `gisPanelAttachResize`. Nessun altro caller nel delta passa `onDragEnd`/`onResizeEnd`.

```javascript
function dflightWireFloatingPanel(dlg, kind){
  if (!dlg || !document.body.classList.contains("gis-mode")) return;
  const opts = _dflightPanelLayoutOpts(kind);
  dlg.classList.add("gis-panel-floating");
  try { gisPanelTrapWheel(dlg); } catch(_){}
  dlg.style.position = "fixed";
  dlg.style.margin = "0";
  dlg.style.transform = "none";
  dlg.style.right = "auto";
  dlg.style.bottom = "auto";
  try {
    const h = document.getElementById(opts.headId);
    if (h) h.classList.add("gis-panel-drag-head");
  } catch(_){}
  const _dflightPairAfterUserGeom = function(){
    try { if (typeof dflightEnsurePairLayout === "function") dflightEnsurePairLayout(); } catch(_){}
  };
  if (typeof gisPanelAttachDrag === "function"){
    gisPanelAttachDrag(dlg, Object.assign({}, opts, {
      threshold: 4,
      draggingClass: "dragging",
      ignoreSelector: "#" + opts.closeId + ",.app-modal-min-btn,button,input,select,textarea,label,a,[data-no-drag],.app-modal-close,[data-role=\"gis-panel-resize\"]",
      onDragEnd: _dflightPairAfterUserGeom
    }));
  }
  if (typeof gisPanelAttachResize === "function"){
    const handles = [...dlg.querySelectorAll('[data-role="gis-panel-resize"][data-handle]')];
    gisPanelAttachResize(dlg, Object.assign({}, opts, {
      handleEls: handles,
      threshold: 3,
      onResizeEnd: _dflightPairAfterUserGeom
    }));
  }
  if (typeof gisPanelAttachBringToFront === "function") gisPanelAttachBringToFront(dlg, opts);
  if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(dlg, opts);
  if (typeof gisPanelApplyLayout === "function") gisPanelApplyLayout(dlg, opts);
  try { dflightEnsurePanelGeometryResize(); } catch(_){}
  try { dflightSyncAdaptivePanelGeometry(dlg, kind); } catch(_){
    try { if (typeof gisPanelSyncBodySize === "function") gisPanelSyncBodySize(dlg, opts); } catch(__){}
  }
}
```

### Diff hunk 03 (reale)

```diff
@@ -37219,26 +37222,34 @@ function dflightWireFloatingPanel(dlg, kind){
   dlg.style.margin = "0";
   dlg.style.transform = "none";
   dlg.style.right = "auto";
   dlg.style.bottom = "auto";
   try {
     const h = document.getElementById(opts.headId);
     if (h) h.classList.add("gis-panel-drag-head");
   } catch(_){}
+  const _dflightPairAfterUserGeom = function(){
+    try { if (typeof dflightEnsurePairLayout === "function") dflightEnsurePairLayout(); } catch(_){}
+  };
   if (typeof gisPanelAttachDrag === "function"){
     gisPanelAttachDrag(dlg, Object.assign({}, opts, {
       threshold: 4,
       draggingClass: "dragging",
-      ignoreSelector: "#" + opts.closeId + ",.app-modal-min-btn,button,input,select,textarea,label,a,[data-no-drag],.app-modal-close,[data-role=\"gis-panel-resize\"]"
+      ignoreSelector: "#" + opts.closeId + ",.app-modal-min-btn,button,input,select,textarea,label,a,[data-no-drag],.app-modal-close,[data-role=\"gis-panel-resize\"]",
+      onDragEnd: _dflightPairAfterUserGeom
     }));
   }
   if (typeof gisPanelAttachResize === "function"){
     const handles = [...dlg.querySelectorAll('[data-role="gis-panel-resize"][data-handle]')];
-    gisPanelAttachResize(dlg, Object.assign({}, opts, { handleEls: handles, threshold: 3 }));
+    gisPanelAttachResize(dlg, Object.assign({}, opts, {
+      handleEls: handles,
+      threshold: 3,
+      onResizeEnd: _dflightPairAfterUserGeom
+    }));
   }
   if (typeof gisPanelAttachBringToFront === "function") gisPanelAttachBringToFront(dlg, opts);
   if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(dlg, opts);
   if (typeof gisPanelApplyLayout === "function") gisPanelApplyLayout(dlg, opts);
   try { dflightEnsurePanelGeometryResize(); } catch(_){}
   try { dflightSyncAdaptivePanelGeometry(dlg, kind); } catch(_){
     try { if (typeof gisPanelSyncBodySize === "function") gisPanelSyncBodySize(dlg, opts); } catch(__){}
   }
```

---

## 4. `gisPanelAttachDrag` (FIX3 completo)

Ordine gesto: `onMove` → `gisPanelSetLayout(..., touched:true)` ad ogni move; `onUp` → scheduleSave → **poi** `opts.onDragEnd` se `didMove` e callback è function. Se callback assente: no-op (`typeof` check). Nessuna invocazione callback in `onMove`. Nessun timer.

```javascript
function gisPanelAttachDrag(root, opts){
  opts = opts || {};
  if (!root || root._gisPanelDragInstalled) return;
  const key = opts.key || "";
  const head = opts.headEl || (opts.headId ? document.getElementById(opts.headId) : null) || root.querySelector(".app-modal-head");
  if (!head) return;
  const TH = Number.isFinite(opts.threshold) ? opts.threshold : 4;
  const pad = Number.isFinite(opts.pad) ? opts.pad : GIS_PANEL_DEFAULTS.pad;
  const closeBtn = opts.closeEl || (opts.closeId ? document.getElementById(opts.closeId) : null) || root.querySelector(".app-modal-close");
  const ignoreSel = opts.ignoreSelector || "button,input,select,textarea,label,a,[data-no-drag],.app-modal-close";
  let down = null;
  let moved = false;
  const clean = () => {
    document.removeEventListener("pointermove", onMove, true);
    document.removeEventListener("pointerup", onUp, true);
    document.removeEventListener("pointercancel", onUp, true);
  };
  function shouldIgnoreTarget(tgt){
    if (!tgt) return false;
    if (closeBtn && (tgt === closeBtn || (closeBtn.contains && closeBtn.contains(tgt)))) return true;
    try { if (tgt.closest && tgt.closest(ignoreSel)) return true; } catch(_){}
    return false;
  }
  function onMove(ev){
    if (!down || ev.pointerId !== down.pid) return;
    const dx = ev.clientX - down.sx, dy = ev.clientY - down.sy;
    if (!moved && Math.hypot(dx, dy) < TH) return;
    if (!moved){
      moved = true;
      try { head.classList.add(opts.draggingClass || "dragging"); } catch(_){}
      root.style.right = "auto";
      root.style.bottom = "auto";
      root.style.transform = "none";
    }
    if (ev.cancelable) ev.preventDefault();
    const w = root.offsetWidth, h = root.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    let L = down.startL + (ev.clientX - down.sx);
    let T = down.startT + (ev.clientY - down.sy);
    if (Number.isFinite(opts.partialMinVisible)){
      const mv = opts.partialMinVisible;
      const minLeft = -Math.max(0, w - mv);
      const maxLeft = vw - mv;
      const minTop = 0;
      const maxTop = vh - mv;
      L = Math.max(minLeft, Math.min(maxLeft, L));
      T = Math.max(minTop, Math.min(maxTop, T));
    } else {
      L = Math.max(pad, Math.min(vw - w - pad, L));
      T = Math.max(pad, Math.min(vh - h - pad, T));
    }
    root.style.left = L + "px";
    root.style.top = T + "px";
    gisPanelSetLayout(key, { left: L, top: T, touched: true }, opts);
  }
  function onUp(ev){
    if (!down || ev.pointerId !== down.pid) return;
    try { head.classList.remove(opts.draggingClass || "dragging"); } catch(_){}
    try { if (head.releasePointerCapture) head.releasePointerCapture(ev.pointerId); } catch(_){}
    try { if (moved && typeof scheduleSaveUiState === "function") scheduleSaveUiState(); } catch(_){}
    const didMove = moved;
    clean();
    down = null;
    moved = false;
    if (didMove && typeof opts.onDragEnd === "function"){
      try { opts.onDragEnd(root, opts); } catch(_){}
    }
  }
  head.addEventListener("pointerdown", (ev) => {
    if (ev.pointerType === "mouse" && ev.button !== 0) return;
    if (shouldIgnoreTarget(ev.target)) return;
    try { gisPanelBringToFront(root, opts); } catch(_){}
    // Keep the map from receiving pick-mode clicks while dragging.
    ev.stopPropagation();
    if (ev.cancelable) ev.preventDefault();
    const br = root.getBoundingClientRect();
    down = { sx: ev.clientX, sy: ev.clientY, startL: br.left, startT: br.top, pid: ev.pointerId };
    moved = false;
    try { head.setPointerCapture(ev.pointerId); } catch(_){}
    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("pointercancel", onUp, true);
  });
  root._gisPanelDragInstalled = true;
}
```

### Diff hunk 16 (reale)

```diff
@@ -75511,19 +75612,23 @@ function gisPanelAttachDrag(root, opts){
     root.style.top = T + "px";
     gisPanelSetLayout(key, { left: L, top: T, touched: true }, opts);
   }
   function onUp(ev){
     if (!down || ev.pointerId !== down.pid) return;
     try { head.classList.remove(opts.draggingClass || "dragging"); } catch(_){}
     try { if (head.releasePointerCapture) head.releasePointerCapture(ev.pointerId); } catch(_){}
     try { if (moved && typeof scheduleSaveUiState === "function") scheduleSaveUiState(); } catch(_){}
+    const didMove = moved;
     clean();
     down = null;
     moved = false;
+    if (didMove && typeof opts.onDragEnd === "function"){
+      try { opts.onDragEnd(root, opts); } catch(_){}
+    }
   }
   head.addEventListener("pointerdown", (ev) => {
     if (ev.pointerType === "mouse" && ev.button !== 0) return;
     if (shouldIgnoreTarget(ev.target)) return;
     try { gisPanelBringToFront(root, opts); } catch(_){}
     // Keep the map from receiving pick-mode clicks while dragging.
     ev.stopPropagation();
     if (ev.cancelable) ev.preventDefault();
```

---

## 5. `gisPanelAttachResize` (FIX3 — commit + onUp)

`touched:true` su `gisPanelSetLayout` durante move; `onResizeEnd` solo in `onUp` se `didMove`. Callback opzionale; caller senza `onResizeEnd` invariati.

```javascript
    gisPanelSetLayout(key, { left: rect.left, top: rect.top, w: rect.w, h: rect.h, touched: true }, opts);
    try { gisPanelSyncBodySize(root, opts); } catch(_){}
  }
  function onUp(ev){
    if (!down || ev.pointerId !== down.pid) return;
    try { if (down.handleEl && down.handleEl.releasePointerCapture) down.handleEl.releasePointerCapture(ev.pointerId); } catch(_){}
    try { if (moved && typeof scheduleSaveUiState === "function") scheduleSaveUiState(); } catch(_){}
    const didMove = moved;
    clean();
    down = null;
    moved = false;
    if (didMove && typeof opts.onResizeEnd === "function"){
      try { opts.onResizeEnd(root, opts); } catch(_){}
    }
  }
```

Firma: `function gisPanelAttachResize(root, opts){` — stessa famiglia opzionale di drag.

### Diff hunk 17 (reale)

```diff
@@ -75626,19 +75731,23 @@ function gisPanelAttachResize(root, opts){
     root.style.height = rect.h + "px";
     gisPanelSetLayout(key, { left: rect.left, top: rect.top, w: rect.w, h: rect.h, touched: true }, opts);
     try { gisPanelSyncBodySize(root, opts); } catch(_){}
   }
   function onUp(ev){
     if (!down || ev.pointerId !== down.pid) return;
     try { if (down.handleEl && down.handleEl.releasePointerCapture) down.handleEl.releasePointerCapture(ev.pointerId); } catch(_){}
     try { if (moved && typeof scheduleSaveUiState === "function") scheduleSaveUiState(); } catch(_){}
+    const didMove = moved;
     clean();
     down = null;
     moved = false;
+    if (didMove && typeof opts.onResizeEnd === "function"){
+      try { opts.onResizeEnd(root, opts); } catch(_){}
+    }
   }
   handles.forEach(h => {
     const handleId = (h.getAttribute("data-handle") || h.getAttribute("data-panel-resize") || "se");
     if ((handleId === "e" || handleId === "w") && typeof t === "function"){
       const tip = t("tip.panelResizeEW");
       if (tip){
         h.setAttribute("title", tip);
         if (h.hasAttribute("data-i18n-aria")) h.setAttribute("aria-label", tip);
```

---

## 6. Caller impact `gisPanelAttachDrag` / `AttachResize`

**Nel delta FIX2→FIX3, l’unico call-site che passa i nuovi callback è `dflightWireFloatingPanel` (hunk 03).**

Le primitive (hunk 16–17) aggiungono solo hook **opzionali**:

- `if (didMove && typeof opts.onDragEnd === "function")`
- `if (didMove && typeof opts.onResizeEnd === "function")`

Caller esistenti (carto IGM, track, waypoint, convert, search, favorites, help, QR, layers, range rings, polygon, routing, workbench, measure, astro, pickers, …) **non** compaiono nel diff e **non** ricevono `onDragEnd`/`onResizeEnd` → comportamento invariato (callback assente).

Conteggio call-site tip FIX3 (fuori definizione): AttachDrag ≈ 18; AttachResize ≈ 18 — nessuno altro modificato nel delta.

---

## 7. Legenda — CSS reale (hunk 01)

```diff
@@ -8672,17 +8672,20 @@ html:not([data-theme="dark"]) .dflight-legend-swatch.is-unknown{ color:#475569;
 /* ===== D-FLIGHT-ATM09-LEGEND-UX-IMPL-A-FIX1 — adaptive external ATM09 legend ===== */
 #dflightAtm09UserLegend{
   position:absolute;
   /* left/top applied by dflightPositionAtm09UserLegend() relative to map host;
    * right/bottom cleared so the box stays left of .tile-ctrls and above
    * .trp-point / .trp-cursor (coordinate readout). */
   left:10px; top:10px;
   right:auto; bottom:auto;
-  z-index:40; /* above tiles; layout avoids overlap with .tile-ctrls (60) */
+  /* FIX3: keep map legend under ALL app modals/floating panels (gis baseZ 24–29).
+   * Mount may be #gisMapMount (sibling of dialogs), so high z competed with panels.
+   * Still above map tiles; below .tile-ctrls (60) by design. pointer-events:none unchanged. */
+  z-index:5;
   box-sizing:border-box;
   max-width:min(210px, 46vw);
   margin:0;
   padding:8px 10px 9px;
   border:1px solid var(--border, #334155);
   border-radius:8px;
   background:color-mix(in srgb, var(--panel-2, var(--panel, #0f172a)) 84%, transparent);
   -webkit-backdrop-filter:blur(3px);
```

| Voce | Valore |
|------|--------|
| z-index BASE (FIX2) | **40** |
| z-index FIX3 | **5** |
| `pointer-events` | `none` (invariato) |
| `position` | `absolute` |
| Mount | `#gisMapMount` (preferito) oppure `#miniMap` via `dflightEnsureAtm09UserLegend` |
| Contesto | può essere sibling dei `dialog` floating |

---

## 8. Layering: legenda sotto modal/panel app (solo evidence, no patch)

### Superfici canoniche che possono sovrapporsi alla mappa GIS

| Superficie | Selettore / meccanismo | z-index / stacking |
|------------|------------------------|--------------------|
| ATM09 user legend | `#dflightAtm09UserLegend` | **5** (FIX3) |
| GIS floating panels (JS) | `gisPanelBringToFront` `baseZ=24` `maxZ=29` | **24–29** inline |
| Astro panel | `body.gis-mode dialog#astroPanel` | CSS **24** |
| Search / Favorites / Range Rings | `dialog#searchPanel` / `#favoritesPanel` / `#rangeRingsPanel` | CSS **24–25** |
| Convert | `dialog#convertModal` | CSS **26** |
| Waypoint | `dialog#waypointModal` | CSS **27** |
| Track / Help / QR / Astro pickers | CSS family floating | **28** |
| Tab drawer | `.tab-drawer` | **30** |
| Minimized dock | `.gis-minimized-dock` | **22** |
| Offline panel enlarged | `body.mm-* #offlineTilePanel` | **9100** |
| Confirm track dialogs | `dialog.track-*-dialog.app-modal` | **30000+** |
| High overlays / toast | vari | **7000–99998** |

**Minimo tra superfici modal/panel/dock pertinenti sopra mappa:** dock **22** e floating CSS/JS **≥24**, tutti **> 5**.

**Conclusione layering:** con z-index legend = **5**, la relazione *legend sotto tutti i modal/panel app pertinenti che possono sovrapporsi alla mappa* risulta **garantita** dai valori CSS/JS sopra (nessun modal/panel app con z ≤ 5 trovato). Map chrome interno (`.tile-ctrls` 60, menu 80) resta sopra la legenda per design — non è modal app.

**FINDING stacking:** nessuno in questo audit evidence-only.

---

## 9. `dflightPanelCloseLifecycle`

| Check | Esito |
|-------|-------|
| Body BASE vs FIX3 | **byte-identical** |
| SHA-256 body | `426a8b4dc6988c1b3fcaa867df95305bcac6633cb3ae75df3eef92ed82098dcf` (entrambi) |
| Hunk sul body | **nessuno** (nessuna riga `+/-` sul lifecycle nel diff) |

---

## 10. Selftest `SBS_R_*` — codice reale (hunk 15)

Assert geometrici: `rectsSeparate`, `getBoundingClientRect`, confronto `left`/`top` style, `approx(zrD2.left, 280)` — non solo `r.ok`/`mode`.

```javascript
/* R — FIX3 real-UI chain proofs (must FAIL on FIX2/203 Atm09 path; PASS on FIX3) */
    add("SBS_R_hooks_atm09", String(dflightAtm09OpenDetails).indexOf("dflightEnsurePairLayout") >= 0);
    add("SBS_R_hooks_drag_end",
      String(gisPanelAttachDrag).indexOf("onDragEnd") >= 0
      && String(dflightWireFloatingPanel).indexOf("onDragEnd") >= 0);
    add("SBS_R_hooks_resize_end",
      String(gisPanelAttachResize).indexOf("onResizeEnd") >= 0
      && String(dflightWireFloatingPanel).indexOf("onResizeEnd") >= 0);
    add("SBS_R_legend_z_css", (function(){
      try {
        const css = Array.from(document.styleSheets || []).map(function(ss){
          try { return Array.from(ss.cssRules || []).map(function(r){ return r.cssText || ""; }).join("\n"); }
          catch(_){ return ""; }
        }).join("\n");
        const hit = css.indexOf("#dflightAtm09UserLegend") >= 0 && /#dflightAtm09UserLegend[^{]*\{[^}]*z-index:\s*5\b/.test(css);
        return hit;
      } catch(_){ return false; }
    })());

    unstubViewport();
    unstubGeom();
    if (!stubViewport(1280, 900) || !stubGeom(60, 900)){
      add("SBS_R_atm09_chain_no_overlap", false, "stub wide failed");
      add("SBS_R_drag_touched_sibling", false, "stub wide failed");
      add("SBS_R_legend_stack_runtime", false, "stub wide failed");
    } else {
      /* Real open chain: control open + Atm09 details (no direct EnsurePairLayout call). */
      try {
        if (typeof gPanelLayouts === "object" && gPanelLayouts){
          delete gPanelLayouts.dflightPanel;
          delete gPanelLayouts.dflightDetailsPanel;
        }
      } catch(_){}
      try { closeDlg(det); } catch(_){}
      try { if (typeof dflightOpenControlPanel === "function") dflightOpenControlPanel(); } catch(_){}
      try {
        dflightAtm09OpenDetails({
          id: "sbs-r-atm09",
          properties: { id: "sbs-r-atm09", name: "SBS R ATM09", type: "TEST" }
        });
      } catch(eAtm){
        add("SBS_R_atm09_chain_no_overlap", false, "atm09 throw: " + String(eAtm && eAtm.message ? eAtm.message : eAtm));
      }
      const zrR = zone.getBoundingClientRect();
      const drR = det.getBoundingClientRect();
      const sepR = rectsSeparate(zrR, drR);
      const layZR = (typeof gisPanelGetLayout === "function") ? (gisPanelGetLayout("dflightPanel", _dflightPanelLayoutOpts("control")) || {}) : {};
      const layDR = (typeof gisPanelGetLayout === "function") ? (gisPanelGetLayout("dflightDetailsPanel", _dflightPanelLayoutOpts("details")) || {}) : {};
      add("SBS_R_atm09_chain_no_overlap",
        !!(zone.open && det.open && sepR && !layZR.touched && !layDR.touched
          && Math.round(drR.left) !== Math.round(zrR.left)),
        "sep=" + sepR + " zl=" + Math.round(zrR.left) + " dl=" + Math.round(drR.left)
          + " zt=" + Math.round(zrR.top) + " dt=" + Math.round(drR.top)
          + " zL=" + zone.style.left + " dL=" + det.style.left);

      /* Touched Zone: sibling must relocate; Zone left/top preserved. */
      prepFloating(340, 380, 280, 280);
      setLay(280, 90, 340, 280, true, 12, 90, 380, 280, false);
      const zBefore = { left: zone.style.left, top: zone.style.top };
      const rDrag = (typeof dflightEnsurePairLayout === "function") ? dflightEnsurePairLayout() : null;
      const zrD2 = zone.getBoundingClientRect();
      const drD2 = det.getBoundingClientRect();
      add("SBS_R_drag_touched_sibling",
        !!(rDrag && rDrag.ok && zone.style.left === zBefore.left && zone.style.top === zBefore.top
          && approx(zrD2.left, 280) && rectsSeparate(zrD2, drD2)),
        "mode=" + (rDrag && rDrag.mode) + " zl=" + zone.style.left + " dl=" + Math.round(drD2.left)
          + " sep=" + rectsSeparate(zrD2, drD2));

      /* Legend stacking: panel z-index must exceed legend (runtime). */
      try {
        let leg = document.getElementById("dflightAtm09UserLegend");
        if (!leg && typeof dflightEnsureAtm09UserLegend === "function") leg = dflightEnsureAtm09UserLegend();
        if (leg){
          try { leg.hidden = false; } catch(_){}
          try { if (typeof gisPanelBringToFront === "function") gisPanelBringToFront(zone, _dflightPanelLayoutOpts("control")); } catch(_){}
          const zLeg = parseInt(window.getComputedStyle(leg).zIndex, 10);
          const zPan = parseInt(window.getComputedStyle(zone).zIndex, 10);
          add("SBS_R_legend_stack_runtime",
            Number.isFinite(zLeg) && Number.isFinite(zPan) && zPan > zLeg,
            "legendZ=" + zLeg + " panelZ=" + zPan);
        } else {
          add("SBS_R_legend_stack_runtime", false, "legend missing");
        }
      } catch(eLeg){
        add("SBS_R_legend_stack_runtime", false, String(eLeg && eLeg.message ? eLeg.message : eLeg));
      }
    }
```

**Nota coverage resize-end:** `SBS_R_hooks_resize_end` verifica presenza `onResizeEnd` in AttachResize + Wire; il path geometrico touched/sibling è lo stesso `dflightEnsurePairLayout` invocato dal callback (copertura via `SBS_R_drag_touched_sibling`). Nessuna simulazione pointer-resize separata in SBS_R.

Hunk 15 header: `@@ -45699,16 +45712,104 @@ function dflightSelfTestSideBySide()`.

---

## 11. Browser real workflow (già acquisito)

### Pre-fix LIVE FIX2/203 (Atm09 path)

```json
{
  "overlap": true,
  "zone": { "left": "12px", "top": "95px" },
  "details": { "left": "12px", "top": "95px" },
  "atm09HasPairHook": false
}
```

### Post-fix FIX3 (Chrome CDP locale su tip `9643ca0`)

```json
{
  "wide": { "overlap": false, "zl": 12, "dl": 362, "zt": 95, "dt": 95 },
  "touched": { "zoneKept": true, "overlap2": false, "mode": "place_details_beside_zone", "zl": 320, "dl": 670 },
  "legend": { "zLeg": 5, "zPan": 28, "ok": true },
  "narrow": { "mode": "stack_fallback", "sep": true }
}
```

Selftest: `dflightSelfTestSideBySide` 27/27; `dflightSelfTestAll` 403/403.

---

## 12. Invarianti (solo righe `+/-` del delta)

| Invariante | Nel delta `+/-` |
|------------|-----------------|
| nuovo localStorage / storage key | **assente** |
| `state.mapWaypoints` | **assente** |
| rete / endpoint / proxy / `fetch(` | **assente** |
| OPSEC | **assente** |
| GPS / `getCurrentPosition` / `watchPosition` | **assente** |
| helper D-Flight | **assente** |
| global modal manager | **assente** |
| apertura F/G/H | **assente** |

---

## Gate / STOP

- Runtime **non** modificato in questo blocco.  
- Candidato resta `9643ca0839878b154e68ffa003aa94570375d111` / **204**.  
- LIVE resta FIX2/203.  
- **NO** deploy · **NO** ABQA · **NO** QA · **NO** finito.  

**REVIEW GPT-SOSTITUTIVA — PENDING**
