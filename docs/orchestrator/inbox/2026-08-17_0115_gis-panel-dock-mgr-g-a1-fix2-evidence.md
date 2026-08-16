# GIS-PANEL-DOCK-MGR-G-A1-FIX2 — evidence (pre-review)

**BLOCK-ID:** `GIS-PANEL-DOCK-MGR-G-A1-FIX2`  
**WU:** WU-0021  
**CATEGORIA:** DELICATO  
**GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**NO deploy · NO ABQA post-deploy · NO QA operatore · NO finito**

## Identity

| Voce | Valore |
| --- | --- |
| BASE (FIX1) | `c122fd49c7046a8a3ef98f08d9d94d1e6b4676a6` · build **209** · `GIS-PANEL-DOCK-MGR-G-A1-FIX1` |
| CANDIDATE FIX2 | `525e7df50cb4edf768b0da7f59e7414dd79d56de` · build **210** · `APP_BUILD_ID=GIS-PANEL-DOCK-MGR-G-A1-FIX2` |
| LIVE (invariato) | `7a5c42f3708cfa3dff3f7a7a7e1fdab5e470066c` · build **208** · `GIS-PANEL-DOCK-MGR-G-A1` |
| Blob | `9aa5441d48b89968cb388e3a7c61ee6d063a964d` |
| Bytes (LF) | `10386717` |
| SHA-256 (LF) | `2b136a6f0ab8684a27bd4e29526b2e088499b2f242ff166e706ca5036ca40f3b` |
| Diff vs BASE | **21 hunk** · **+292 / −50** · **OTHER=0** |

Ancestry: `c122fd4` (FIX1) → `525e7df` (FIX2). Tip docs successivi possono seguire; candidate runtime = `525e7df`.

Artifact: [`2026-08-17_0115_gis-panel-dock-mgr-g-a1-fix2-verify.json`](2026-08-17_0115_gis-panel-dock-mgr-g-a1-fix2-verify.json) · [`…-hunk-account.json`](2026-08-17_0115_gis-panel-dock-mgr-g-a1-fix2-hunk-account.json)

## Root cause (FIX1 FAIL)

A **360×640** con **3 chip**, `dockMode=row`:

| Metrica FIX1 | Valore |
| --- | --- |
| header.bottom | 144 |
| dock.bottom | 205 |
| safeTop (header-only) | 154 |
| hit-test handle | FAIL (sotto dock z29) |

`gisPanelSafeTop()` usava solo `header.getBoundingClientRect().bottom`; il dock assoluto può sporgere sotto il border-box dell’header.

## Fix

1. **`gisPanelSafeTop`** (GIS mode):  
   `chromeBottom = max(header.bottom, dock.bottom)` se dock esiste, non hidden, width/height > 1;  
   `safeTop = chromeBottom + gap`.  
   Dock assente/vuoto/nascosto → solo header. Fuori GIS → fallback reserve preesistente.
2. **`gisDockReflow`**: dopo geometria finale (anche empty/hidden) chiama `gisPanelNudgeOpenPanelsToSafeTop`.  
   Resize wire: solo `gisDockReflow` (nudge incluso).  
   Empty path di `gisRenderMinimizedDock`: nudge esplicito.
3. **Z-order G-A1 invariato** (panels ≤28, header/dock 29, drawer 30, tools 990).
4. **WU-0019**: nessun `dflightEnsurePairLayout` in clamp/drag/nudge; sibling invariato.

## Codice reale (estratto)

### `gisPanelSafeTop`

```javascript
function gisPanelSafeTop(opts){
  opts = opts || {};
  const gap = Number.isFinite(opts.safeTopGap) ? opts.safeTopGap : 10;
  let chromeBottom = null;
  try {
    const gis = document.body && document.body.classList && document.body.classList.contains("gis-mode");
    const hdr = gis
      ? (document.querySelector("body.gis-mode > header") || document.querySelector("header"))
      : document.querySelector("header");
    if (hdr){
      const hb = hdr.getBoundingClientRect();
      if (Number.isFinite(hb.bottom) && hb.bottom > 0) chromeBottom = hb.bottom;
    }
    if (gis){
      const dock = document.getElementById("gisMinimizedDock");
      if (dock && !dock.hidden){
        let dr = null;
        try { dr = dock.getBoundingClientRect(); } catch(_){ dr = null; }
        if (dr && dr.width > 1 && dr.height > 1 && Number.isFinite(dr.bottom) && dr.bottom > 0){
          chromeBottom = Number.isFinite(chromeBottom) ? Math.max(chromeBottom, dr.bottom) : dr.bottom;
        }
      }
    }
  } catch(_){}
  if (!(Number.isFinite(chromeBottom))){
    const reserve = Number.isFinite(opts.topbarReserve) ? opts.topbarReserve : 104;
    return Math.ceil(reserve + gap);
  }
  return Math.ceil(chromeBottom + gap);
}
```

### Reflow → nudge

Fine di `gisDockReflow`:

```javascript
  } catch(_){}
  /* FIX2: nudge AFTER final dock geometry (including empty/hidden chrome). */
  try { gisPanelNudgeOpenPanelsToSafeTop(); } catch(_){}
}
```

## Caso primario obbligatorio (360×640 · 3 chip · row)

| Campo | Valore |
| --- | --- |
| header.bottom | **144** |
| dock.bottom | **205** |
| chromeBottom | **205** |
| safeTop | **215** (= 205 + gap 10) |
| hit-test handle | `favoritesPanelHead` · panel ✓ · dock ✗ |
| drag down | PASS |
| mode | `row` |

**PASS** rispetto all’acceptance: `safeTop >= dock.bottom + gap` ∧ handle hit = panel ∧ drag down possibile.

## Matrix (sintesi)

| Caso | mode | hdrB | dockB | safe | hit | pass |
| --- | --- | --- | --- | --- | --- | --- |
| 1400×900 · 0 chip | absent | 85 | — | 95 | favoritesPanelHead | ✓ |
| 1400×900 · 1 chip | right | 85 | 72 | 95 | … | ✓ |
| 1400×900 · 3 chip | row | 150 | 146 | 160 | … | ✓ |
| ~900×800 · 3 | row | 175 | 236 | 246 | … | ✓ |
| 360×640 · 0 | absent | 144 | — | 154 | … | ✓ |
| 360×640 · 1 | row | 144 | 205 | 215 | … | ✓ |
| 360×640 · 3 | row | 144 | 205 | 215 | … | ✓ |
| resize 1400→360→1400 · 3 | row | … | 146→205→146 | 160→215→160 | … | ✓ |
| i18n IT→EN→FR · 360 · 3 | row | … | 205→205→253 | 215→215→263 | … | ✓ |

FR allunga le label → dock più alto → safeTop aggiornato (263).

## Panel coverage

Nudge a safeTop esercitato su: `trackModal`, `favoritesPanel`, `measurePanel`, `layersPanel`, `dflightPanel`, `dflightDetailsPanel` — tutti `nudged: true`.

## WU-0019

`detailsStable: true` · `pairInClamp: false` · zone nudge non muove Details.

## Selftest

`dflightSelfTestAll` **468/468** PASS (locale Playwright, viewport 1400×900).  
Nuovi check non tautologici: `SAFE_TOP_FIX2_*` (dock bottom, hit vs dock, remove chips, i18n reflow, resize/reflow, partial-left, WU-0019).

## Hunk account (vs BASE FIX1)

| Class | Count | Note |
| --- | --- | --- |
| BUILD_META | 14 | APP_BUILD 209→210 + pin selftest tip |
| SAFE_TOP | 1 | `gisPanelSafeTop` chromeBottom |
| REFLOW_NUDGE | 5 | reflow braces + nudge + resize/empty paths |
| SELFTEST_FIX2 | 1 | `gisPanelSafeTopSelfTestFix2` |
| **OTHER** | **0** | |

Σ +292/−50 · 21 hunk. Detail: [`…-hunk-account.json`](2026-08-17_0115_gis-panel-dock-mgr-g-a1-fix2-hunk-account.json).

## Invarianti

- Nessuna nuova rete / GPS / `watchPosition` / storage / IDB
- Helper **0.1.3** invariato
- `state.mapWaypoints[]` invariato
- Z-order G-A1 invariato
- Workbench gap resta G-B; **G-B/C/D NOT OPENED**; **F NOT OPENED**; WU-0012 invariata
- Un solo `#gisMinimizedDock` · un solo `_gisMinimizedPanels[]` · brand **TMART GIS tool**

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING**  
Nessun deploy · nessuna ABQA post-deploy · nessuna QA operatore · nessun `finito`.
