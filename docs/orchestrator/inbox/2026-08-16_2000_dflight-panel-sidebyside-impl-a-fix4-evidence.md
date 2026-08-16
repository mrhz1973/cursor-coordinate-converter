# D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX4 — REVIEW EVIDENCE

**BLOCK-ID:** D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX4  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (nessun verdetto)  
**NO** deploy · **NO** ABQA post-deploy · **NO** QA · **NO** finito

---

## 1. SHA / build

| Ruolo | Full SHA |
|-------|----------|
| BASE FIX3 LIVE | `9643ca0839878b154e68ffa003aa94570375d111` |
| CANDIDATE FIX4 | `9820c8ab9cb0d2103adf955ba3b873bca4c89e08` |

Build: **205** · `APP_BUILD_ID=D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX4`  
Blob monolite: `689c831d902749d86d12667b18eab2bd84390662`  
SHA-256 LF: `60e797622e543417be1414e91a202137d0192766f1900b73a144fcbaef8b6535` · bytes LF `10346944`

**Decisione prodotto:** drag manuale → pannello trascinato resta; sibling **non** ricollocato automaticamente.

---

## 2. Diff FIX3→FIX4 (account hunk)

`git diff -U8 9643ca0 9820c8a -- "coordinate_converter Claude.html"` → **15** hunk:

| # | Area | Note |
|---|------|------|
| 01 | APP_BUILD_* | 204/FIX3 → 205/FIX4 |
| 02 | `dflightWireFloatingPanel` | **rimuove `onDragEnd` pair**; `onResizeEnd` resta |
| 03–12 | selftest build guards | 204→205 |
| 13–15 | `dflightSelfTestSideBySide` SBS_R_* | no wire drag-end pair; pointer-drag sibling invariant |

**Non nel diff:** `dflightAtm09OpenDetails`, `dflightEnsurePairLayout` geometry, `gisPanelAttachDrag`/`Resize` body, CSS legenda, `dflightPanelCloseLifecycle`.

---

## 3. Codice reale `dflightWireFloatingPanel` (FIX4)

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
  /* FIX4 product: drag-end must NOT re-pair sibling; user leaves relative layout as-is.
   * Resize-end still re-pairs (geometry change). Optional drag-end hook stays in gisPanelAttachDrag. */
  const _dflightPairAfterResize = function(){
    try { if (typeof dflightEnsurePairLayout === "function") dflightEnsurePairLayout(); } catch(_){}
  };
  if (typeof gisPanelAttachDrag === "function"){
    gisPanelAttachDrag(dlg, Object.assign({}, opts, {
      threshold: 4,
      draggingClass: "dragging",
      ignoreSelector: "#" + opts.closeId + ",.app-modal-min-btn,button,input,select,textarea,label,a,[data-no-drag],.app-modal-close,[data-role=\"gis-panel-resize\"]"
    }));
  }
  if (typeof gisPanelAttachResize === "function"){
    const handles = [...dlg.querySelectorAll('[data-role="gis-panel-resize"][data-handle]')];
    gisPanelAttachResize(dlg, Object.assign({}, opts, {
      handleEls: handles,
      threshold: 3,
      onResizeEnd: _dflightPairAfterResize
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

---

## 4. Prove pointer-drag (locale tip FIX4)

### Zone drag
```json
{ "touched": true, "siblingSame": true, "pairCalls": 0, "zl": 182, "dl": 362 }
```
Details `left/top` invariati; `dflightEnsurePairLayout` **0** chiamate durante drag-end.

### Details drag
```json
{ "touched": true, "siblingSame": true, "pairCalls": 0, "zl": 182, "dl": 222 }
```
Zone invariata; pairCalls=0.

### ATM09 open (no overlap)
`openSep=true` · `zl=12 dl=362`

### Narrow
`zw=340 dw=380` reachable (resize viewport listener ancora agganciato).

### Selftest
`dflightSelfTestSideBySide` 28/28 · `dflightSelfTestAll` **404/404** PASS  
`SBS_R_drag_sibling_invariant` · `SBS_R_no_wire_drag_end_pair` · ATM09/legend OK.

---

## 5. Invarianti

| Voce | Esito |
|------|--------|
| `dflightPanelCloseLifecycle` | byte-identical · sha256 `426a8b4dc6988c1b3fcaa867df95305bcac6633cb3ae75df3eef92ed82098dcf` |
| Legend z=5 | invariata (nessun hunk CSS) |
| Atm09 EnsurePair on open | invariato |
| `onResizeEnd` pair | invariato |
| AttachDrag optional `onDragEnd` | resta nella primitive |
| storage / waypoints / rete / OPSEC / GPS / helper | non nel delta |
| F/G/H | non aperti |

---

## Gate

**REVIEW GPT-SOSTITUTIVA — PENDING**
