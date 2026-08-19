## REVIEW-EVIDENCE-RECOVERY — `GLOBAL-MODAL-EDGE-RESIZE-A`

### Candidate identity (verifica byte-identica)
- FULL SHA (candidate): `942ab73e73fa61870ab85a72d871b35f0105e8f2`
- BUILD: `232`
- APP_BUILD_ID: `GLOBAL-MODAL-EDGE-RESIZE-A`
- BLOB (git object): `ae5b4df61f76b7b16d4e889a618abf7cf1010c80`
- BYTES LF (raw blob, `git cat-file -p`): `10807943`
- SHA-256 LF (raw blob, `git cat-file -p`): `2fbfc107dcb370fd70cb68e792d5e517e5d7b48b376f1506cd86946ba13bbad9`

### RAW CATEGORY EVIDENCE — estratti deterministici

#### CSS hit-zone full-edge/corner + disattivazione grip `::after`
Marker: `coordinate_converter Claude.html` linee `11508-11615` (blocchi “GLOBAL-MODAL-EDGE-RESIZE-A” e regole `body.gis-mode .gis-panel-resize-handle*`).

```css
/* GLOBAL-MODAL-EDGE-RESIZE-A — invisible full-edge/corner hit-zones; no visible grip. */
body.gis-mode .gis-panel-resize-handle,
body.gis-mode .track-resize-handle{
  background:transparent !important;
  box-shadow:none !important;
  transform:none !important;
  margin:0;
  padding:0;
  border:none;
  opacity:1;
  pointer-events:auto;
}
body.gis-mode .gis-panel-resize-handle::after,
body.gis-mode .track-resize-handle::after,
body.gis-mode .gis-panel-resize-handle:hover::after,
body.gis-mode .track-resize-handle:hover::after,
body.gis-mode .gis-panel-resize-handle:focus-visible::after,
body.gis-mode .track-resize-handle:focus-visible::after{
  content:none !important;
  display:none !important;
  border:none !important;
  background:none !important;
  box-shadow:none !important;
  width:0 !important;
  height:0 !important;
  opacity:0 !important;
  filter:none !important;
}
body.gis-mode .gis-panel-resize-handle:hover,
body.gis-mode .track-resize-handle:hover,
body.gis-mode .gis-panel-resize-handle:focus-visible,
body.gis-mode .track-resize-handle:focus-visible{
  background:transparent !important;
  outline:none;
}
body.gis-mode .gis-panel-resize-handle[data-handle="e"],
body.gis-mode .track-resize-handle[data-handle="e"]{
  top:12px; bottom:12px; right:0; left:auto;
  width:8px; height:auto; cursor:ew-resize; z-index:4;
}
body.gis-mode .gis-panel-resize-handle[data-handle="w"],
body.gis-mode .track-resize-handle[data-handle="w"]{
  top:12px; bottom:12px; left:0; right:auto;
  width:8px; height:auto; cursor:ew-resize; z-index:4;
}
body.gis-mode .gis-panel-resize-handle[data-handle="n"],
body.gis-mode .track-resize-handle[data-handle="n"]{
  top:0; left:12px; right:12px; bottom:auto;
  height:8px; width:auto; cursor:ns-resize; z-index:4;
}
body.gis-mode .gis-panel-resize-handle[data-handle="s"],
body.gis-mode .track-resize-handle[data-handle="s"]{
  bottom:0; left:12px; right:12px; top:auto;
  height:8px; width:auto; cursor:ns-resize; z-index:4;
}
body.gis-mode .gis-panel-resize-handle[data-handle="se"],
body.gis-mode .track-resize-handle[data-handle="se"]{
  width:14px; height:14px; right:0; bottom:0; top:auto; left:auto; cursor:nwse-resize; z-index:5;
}
body.gis-mode .gis-panel-resize-handle[data-handle="nw"],
body.gis-mode .track-resize-handle[data-handle="nw"]{
  width:14px; height:14px; left:0; top:0; right:auto; bottom:auto; cursor:nwse-resize; z-index:5;
}
body.gis-mode .gis-panel-resize-handle[data-handle="ne"],
body.gis-mode .track-resize-handle[data-handle="ne"]{
  width:14px; height:14px; right:0; top:0; left:auto; bottom:auto; cursor:nesw-resize; z-index:5;
}
body.gis-mode .gis-panel-resize-handle[data-handle="sw"],
body.gis-mode .track-resize-handle[data-handle="sw"]{
  width:14px; height:14px; left:0; bottom:0; right:auto; top:auto; cursor:nesw-resize; z-index:5;
}
@media (max-width:600px){
  body.gis-mode .gis-panel-resize-handle[data-handle="e"],
  body.gis-mode .track-resize-handle[data-handle="e"],
  body.gis-mode .gis-panel-resize-handle[data-handle="w"],
  body.gis-mode .track-resize-handle[data-handle="w"]{ width:12px; }
  body.gis-mode .gis-panel-resize-handle[data-handle="n"],
  body.gis-mode .track-resize-handle[data-handle="n"],
  body.gis-mode .gis-panel-resize-handle[data-handle="s"],
  body.gis-mode .track-resize-handle[data-handle="s"]{ height:12px; }
  body.gis-mode .gis-panel-resize-handle[data-handle="se"],
  body.gis-mode .track-resize-handle[data-handle="se"],
  body.gis-mode .gis-panel-resize-handle[data-handle="nw"],
  body.gis-mode .track-resize-handle[data-handle="nw"],
  body.gis-mode .gis-panel-resize-handle[data-handle="ne"],
  body.gis-mode .track-resize-handle[data-handle="ne"],
  body.gis-mode .gis-panel-resize-handle[data-handle="sw"],
  body.gis-mode .track-resize-handle[data-handle="sw"]{ width:18px; height:18px; }
}
```

#### `gisPanelEnsureEdgeResizeHandles` (tutti 8 hit-zones)
Marker: `coordinate_converter Claude.html` linee `79720-79749`.

```javascript
const GIS_EDGE_RESIZE_HANDLES = ["n", "s", "e", "w", "nw", "ne", "sw", "se"];
function gisPanelEdgeResizeHandleSelector(){
  return '[data-role="gis-panel-resize"][data-handle], [data-role="track-modal-resize"][data-handle], .track-resize-handle[data-handle], [data-panel-resize]';
}
/** Ensure resizable floating dialogs expose all 8 edge/corner hit-zones (GLOBAL-MODAL-EDGE-RESIZE-A). */
function gisPanelEnsureEdgeResizeHandles(root){
  if (!root) return [];
  const sel = gisPanelEdgeResizeHandleSelector();
  const existing = [...root.querySelectorAll(sel)];
  if (!existing.length) return existing;
  const useTrack = existing.some(function(el){
    return el.classList.contains("track-resize-handle") || el.getAttribute("data-role") === "track-modal-resize";
  });
  const have = {};
  existing.forEach(function(el){
    const id = el.getAttribute("data-handle") || el.getAttribute("data-panel-resize") || "";
    if (id) have[id] = true;
  });
  GIS_EDGE_RESIZE_HANDLES.forEach(function(id){
    if (have[id]) return;
    const el = document.createElement("div");
    el.className = useTrack ? "track-resize-handle" : "gis-panel-resize-handle";
    el.setAttribute("data-role", useTrack ? "track-modal-resize" : "gis-panel-resize");
    el.setAttribute("data-handle", id);
    el.setAttribute("aria-hidden", "true");
    root.appendChild(el);
    have[id] = true;
  });
  return [...root.querySelectorAll(sel)];
}
```

#### `gisPanelResizeCompute` (coordinata x/y per west/north + clamp min/max)
Marker: `coordinate_converter Claude.html` linee `79750-79781`.

```javascript
function gisPanelResizeCompute(down, handle, dx, dy, minW, minH, maxW, maxH){
  let L = down.startL, T = down.startT, w = down.startW, h = down.startH;
  if (handle === "e"){
    w = down.startW + dx;
  } else if (handle === "w"){
    w = down.startW - dx;
  } else if (handle === "n"){
    h = down.startH - dy;
  } else if (handle === "s"){
    h = down.startH + dy;
  } else if (handle === "se"){
    w = down.startW + dx;
    h = down.startH + dy;
  } else if (handle === "sw"){
    w = down.startW - dx;
    h = down.startH + dy;
  } else if (handle === "ne"){
    w = down.startW + dx;
    h = down.startH - dy;
  } else {
    w = down.startW - dx;
    h = down.startH - dy;
  }
  w = Math.max(minW, Math.min(maxW, w));
  h = Math.max(minH, Math.min(maxH, h));
  if (handle === "sw" || handle === "nw" || handle === "w"){
    L = down.startL + down.startW - w;
  }
  if (handle === "ne" || handle === "nw" || handle === "n"){
    T = down.startT + down.startH - h;
  }
  return { left: L, top: T, w: w, h: h };
}
```

#### `gisPanelAttachResize` (pointer capture/move/up/cancel + clamp viewport)
Marker: `coordinate_converter Claude.html` linee `79783-79854` e `79860-79893`.

```javascript
function gisPanelAttachResize(root, opts){
  opts = opts || {};
  if (!root) return;
  gisPanelEnsureEdgeResizeHandles(root);
  if (root._gisPanelResizeInstalled) return;
  const key = opts.key || "";
  const handles = [...root.querySelectorAll(gisPanelEdgeResizeHandleSelector())];
  if (!handles.length) return;
  const TH = Number.isFinite(opts.threshold) ? opts.threshold : 3;
  const pad = Number.isFinite(opts.pad) ? opts.pad : GIS_PANEL_DEFAULTS.pad;
  const minW0 = Number.isFinite(opts.minW) ? opts.minW : GIS_PANEL_DEFAULTS.minW;
  const minH = Number.isFinite(opts.minH) ? opts.minH : GIS_PANEL_DEFAULTS.minH;
  const resolveMinW = () => {
    const vw = window.innerWidth;
    if (vw <= 600) return Math.min(minW0, Math.max(260, vw - 40));
    return minW0;
  };
  let down = null;
  let moved = false;
  const setResizing = (on) => {
    try { root.classList.toggle("is-panel-resizing", !!on); } catch(_){}
  };
  const clean = () => {
    document.removeEventListener("pointermove", onMove, true);
    document.removeEventListener("pointerup", onUp, true);
    document.removeEventListener("pointercancel", onUp, true);
    setResizing(false);
  };
  function onMove(ev){
    if (!down || ev.pointerId !== down.pid) return;
    const dx = ev.clientX - down.sx, dy = ev.clientY - down.sy;
    if (!moved && Math.hypot(dx, dy) < TH) return;
    moved = true;
    if (ev.cancelable) ev.preventDefault();
    const vw = window.innerWidth, vh = window.innerHeight;
    const minW = resolveMinW();
    const maxW = Math.max(minW, vw - pad * 2);
    const maxH = Math.max(minH, vh - pad * 2);
    let L = down.startL, T = down.startT;
    let w = down.startW, h = down.startH;
    const handle = down.handle;
    const computed = gisPanelResizeCompute(down, handle, dx, dy, minW, minH, maxW, maxH);
    L = computed.left; T = computed.top; w = computed.w; h = computed.h;
    if (!down.rectified){
      down.rectified = true;
      root.style.right = "auto";
      root.style.bottom = "auto";
      root.style.transform = "none";
    }
    const clampOpts = Object.assign({}, opts, { pad, minW, minH, maxW, maxH });
    const rect = Number.isFinite(opts.partialMinVisible)
      ? gisPanelClampRectPartialVisible({ left: L, top: T, w, h }, clampOpts)
      : gisPanelClampRect({ left: L, top: T, w, h }, clampOpts);
    root.style.left = rect.left + "px";
    root.style.top = rect.top + "px";
    root.style.width = rect.w + "px";
    root.style.height = rect.h + "px";
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
  // ...
  h.addEventListener("pointerdown", (ev) => {
    if (ev.pointerType === "mouse" && ev.button !== 0) return;
    try { gisPanelBringToFront(root, opts); } catch(_){}
    ev.stopPropagation();
    if (ev.cancelable) ev.preventDefault();
    const br = root.getBoundingClientRect();
    down = {
      sx: ev.clientX, sy: ev.clientY,
      startW: br.width, startH: br.height,
      startL: br.left, startT: br.top,
      pid: ev.pointerId,
      rectified: !!(root.style.left || root.style.top),
      handle: handleId,
      handleEl: h
    };
    moved = false;
    setResizing(true);
    try { h.setPointerCapture(ev.pointerId); } catch(_){}
    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("pointercancel", onUp, true);
  }, true);
  // ...
}
```

#### Ignore resize handles durante drag header: `gisPanelAttachDrag` + esempio `attachSearchPanelFloatingGis`
Marker drag ignore generico: `coordinate_converter Claude.html` linee `79633-79717`.
Marker esempio ignore resize: `coordinate_converter Claude.html` linee `81310-81320`.

```javascript
function gisPanelAttachDrag(root, opts){
  // ...
  const ignoreSel = opts.ignoreSelector || "button,input,select,textarea,label,a,[data-no-drag],.app-modal-close";
  // ...
  function shouldIgnoreTarget(tgt){
    if (!tgt) return false;
    if (closeBtn && (tgt === closeBtn || (closeBtn.contains && closeBtn.contains(tgt)))) return true;
    try { if (tgt.closest && tgt.closest(ignoreSel)) return true; } catch(_){}
    return false;
  }
  head.addEventListener("pointerdown", (ev) => {
    // ...
    if (shouldIgnoreTarget(ev.target)) return;
    // ...
  });
}
```

```javascript
function attachSearchPanelFloatingGis(dlg){
  // ...
  gisPanelAttachDrag(dlg, Object.assign({}, opts, {
    threshold: 4,
    draggingClass: "dragging",
    ignoreSelector: "#searchPanelClose,[data-role=\"searchpanel-minimize\"],.app-modal-min-btn,button,input,select,textarea,label,a,[data-no-drag],.app-modal-close,[data-role=\"gis-panel-resize\"]"
  }));
  // ...
}
```

#### `gisModalEdgeResizeSelfTest` (incl. check invisibilità `::after`)
Marker: `coordinate_converter Claude.html` linee `48643-48732` (selftest + estensione `dflightSelfTestAll`).

```javascript
function gisModalEdgeResizeSelfTest(){
  const checks = [];
  const add = function(name, ok, detail){
    checks.push({ name: name, ok: !!ok, detail: detail == null ? "" : String(detail) });
  };
  try {
    add("EDGE_build_232", typeof APP_BUILD_NUM !== "undefined" && APP_BUILD_NUM === 232
      && typeof APP_BUILD_ID !== "undefined" && APP_BUILD_ID === "GLOBAL-MODAL-EDGE-RESIZE-A");
    add("EDGE_compute_fn", typeof gisPanelResizeCompute === "function" && typeof gisPanelEnsureEdgeResizeHandles === "function");
    // ...
    const host = document.createElement("dialog");
    host.id = "edgeResizeProbeDlg";
    host.className = "app-modal";
    host.innerHTML = '<div class="app-modal-head" id="edgeResizeProbeHead"></div><div class="gis-panel-resize-handle" data-role="gis-panel-resize" data-handle="se"></div>';
    document.body.appendChild(host);
    const ensured = gisPanelEnsureEdgeResizeHandles(host);
    // ...
    const se = host.querySelector('[data-handle="se"]');
    const after = (se && window.getComputedStyle) ? window.getComputedStyle(se, "::after").getPropertyValue("content") : "";
    const afterOk = !after || after === "none" || after === '""' || after === "''";
    add("EDGE_F_no_visible_handle", afterOk, after);
    // ...
    add("EDGE_L_pointer_cleanup", String(gisPanelAttachResize).indexOf("pointercancel") >= 0 && String(gisPanelAttachResize).indexOf("removeEventListener") >= 0);
  } catch (e){
    add("EDGE_selftest_exception", false, String(e && e.message ? e.message : e));
  }
  return checks;
}
```

### Browser probe (local, NON deploy, no ABQA live)
Script: `local_edge_modal_edge_resize_recovery_probe.py`

**Risultati A–N (eseguiti via drag pointer su `favoritesPanel`)**
- A RIGHT EDGE: `PASS`
- B LEFT EDGE: `PASS`
- C BOTTOM EDGE: `PASS`
- D TOP EDGE: `PASS`
- E FOUR CORNERS: `PASS`
- F NO VISIBLE HANDLE (`::after` invisibile): `PASS`
- G DRAG REGRESSION (header): `PASS`
- H MINIMIZE / RESTORE: `PASS`
- I CLOSE / REOPEN: `PASS`
- J DOCK / SIDE-BY-SIDE stability: `PASS`
- K VIEWPORT / MIN SIZE + close reachable: `PASS`
- L POINTER CLEANUP: `PASS`
- M MULTI-MODAL independence (favorites resize != layers): `PASS`
- N CONSOLE / STATE / OPSEC:
  - `N_state_invariants...`: `PASS` (state arrays invariati)
  - `N_console_no_errors`: `PASS` (no console errors)
  - `N_external_network_delta0`: `FAIL` (externalResources aumentati durante la sessione probe: `beforeExt=2`, `afterExt=10`).

**Selftest**
- `gisModalEdgeResizeSelfTest` via `GOIDflight.selfTestModalEdgeResize()`: `PASS` (21 check, fail=0)
- Selftest aggregato `GOIDflight.selfTest()`: `FAIL` (871 checks, fail=5)
  - `HitA_FIX1_info_above_efp`
  - `HitA_FIX1_single_dispatch_info`
  - `HitA_FIX2_recovery_single_dispatch`
  - `DOCK_GD_four_not_all_row`
  - `DOCK_GD_fifth_uses_lateral_or_stable`

### Note su eventuali failure (gate review)
- Il fallimento **N_external_network_delta0** è l’unico relativo a “OPSEC/zero rete” nel probe locale (misurazione basata su `performance.getEntriesByType('resource')`, filtro `http(s)` non-local).
- I 5 fallimenti del selftest aggregato elencati sopra risultano **non** riconducibili in modo diretto al blocco “edge-resize” (attengono a hit-test/dock di famiglie diverse).

