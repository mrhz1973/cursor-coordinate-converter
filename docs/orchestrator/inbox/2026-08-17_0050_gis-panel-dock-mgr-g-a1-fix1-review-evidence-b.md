# REVIEW-EVIDENCE-B — GIS-PANEL-DOCK-MGR-G-A1-FIX1

**BLOCK-ID:** `GIS-PANEL-DOCK-MGR-G-A1-FIX1-REVIEW-EVIDENCE-B`  
**WU:** WU-0021  
**Tipo:** DIAGNOSTIC / DOCS — evidence-only  
**Data:** 2026-08-17  
**Gate (invariato):** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**Verdetto review:** *non emesso*

> Candidato runtime **invariato**. Nessuna patch monolite, nessun bump, nessun deploy.

---

## 0. Ancestry / candidate (immutabile)

| Voce | Valore |
|------|--------|
| BASE LIVE | `7a5c42f3708cfa3dff3f7a7a7e1fdab5e470066c` · build **208** · `GIS-PANEL-DOCK-MGR-G-A1` |
| CANDIDATE | `c122fd49c7046a8a3ef98f08d9d94d1e6b4676a6` · build **209** · `GIS-PANEL-DOCK-MGR-G-A1-FIX1` |
| merge-base | `7a5c42f3708cfa3dff3f7a7a7e1fdab5e470066c` (= BASE) |
| ahead/behind (BASE…candidate) | ahead **4** / behind **0** (`732f297` docs · `20708cf` docs · `3106e0d` docs · `c122fd4` FIX1) |
| Blob monolite | `278421cc4fd4e3b57965ff717f5fc3cf7e20b4a1` |
| Bytes LF | `10375356` |
| SHA-256 LF | `0ef362dfac902f9fe963ed07e73e19ecf9141bcf69ce91e62b8b1a4b08dbe7d2` |
| Diff | `git diff -U8 BASE CANDIDATE -- "coordinate_converter Claude.html"` |
| Shortstat | `1 file changed, 217 insertions(+), 40 deletions(-)` |

Sibling: [`2026-08-17_0050_gis-panel-dock-mgr-g-a1-fix1-hunk-account.json`](2026-08-17_0050_gis-panel-dock-mgr-g-a1-fix1-hunk-account.json) · [`2026-08-17_0050_gis-panel-dock-mgr-g-a1-fix1-review-rects.json`](2026-08-17_0050_gis-panel-dock-mgr-g-a1-fix1-review-rects.json)

---

## 1. Hunk account completo

**Totale hunk:** **18**  
**Riconciliazione:** **+217 / −40** (esatto)  
**OTHER = 0**

| # | @@ header | Simbolo/area | +/− | Classe |
|---|-----------|--------------|-----|--------|
| 01 | `@@ -23584,20 +23584,20 @@` | `APP_BUILD_*` | +3/−3 | **BUILD_META** |
| 02 | `@@ -36705,33 +36705,41 @@` | `gisPanelSafeTop` + `dflightComputePanelSafeTop` delega | +12/−4 | **SAFE_TOP_JS** *(include DFLIGHT_DELEGATION nello stesso hunk)* |
| 03–14 | selftest build pins (F/Tf/H/Hit/OptB×2/MVISA/IMPLA/LEGENDUX/SBS/branding/DOCK_GA1) | tip 208→209 | +2/−2 o +3/−3 | **BUILD_META** (12 hunk, Σ +27/−27 con #01 → +30/−30) |
| 15 | `@@ -46246,16 +46254,150 @@` | `gisPanelSafeTopSelfTestFix1` | +134/−0 | **SAFE_TOP_SELFTEST** |
| 16 | `@@ -75563,22 +75705,51 @@` | `gisPanelNudgeOpenPanelsToSafeTop` + wire resize | +29/−0 | **RESIZE_NUDGE_JS** |
| 17 | `@@ -75923,46 +76094,50 @@` | `gisPanelClampRect` + `PartialVisible` | +8/−4 | **DRAG_CLAMP_JS** |
| 18 | `@@ -76082,29 +76257,31 @@` | `gisPanelAttachDrag` onMove | +4/−2 | **DRAG_CLAMP_JS** |

| Classe | Hunk | + | − |
|--------|------|---|---|
| BUILD_META | 13 | 30 | 30 |
| SAFE_TOP_JS | 1 | 12 | 4 |
| SAFE_TOP_SELFTEST | 1 | 134 | 0 |
| RESIZE_NUDGE_JS | 1 | 29 | 0 |
| DRAG_CLAMP_JS | 2 | 12 | 6 |
| DFLIGHT_DELEGATION | 0 *(contenuta in hunk 02)* | — | — |
| **OTHER** | **0** | 0 | 0 |

---

## 2. `gisPanelSafeTop` — codice reale (candidate ~36718–36734)

```36718:36734:coordinate_converter Claude.html
function gisPanelSafeTop(opts){
  opts = opts || {};
  const gap = Number.isFinite(opts.safeTopGap) ? opts.safeTopGap : 10;
  let topY = null;
  try {
    const hdr = document.querySelector("body.gis-mode > header") || document.querySelector("header");
    if (hdr){
      const hb = hdr.getBoundingClientRect();
      if (Number.isFinite(hb.bottom) && hb.bottom > 0) topY = hb.bottom + gap;
    }
  } catch(_){}
  if (!(Number.isFinite(topY))){
    const reserve = Number.isFinite(opts.topbarReserve) ? opts.topbarReserve : 104;
    topY = reserve + gap;
  }
  return Math.ceil(topY);
}
```

| Proprietà | Evidence |
|-----------|----------|
| Fonte geometrica | `header.getBoundingClientRect().bottom` |
| Gap | default **10** px (`opts.safeTopGap`) |
| Dock row | indiretta: se `gisDockReflow` aumenta `paddingBottom` header, `hb.bottom` cresce |
| Coordinate | viewport CSS px — coerenti con panel `position:fixed` / `style.top` |
| Fallback | `topbarReserve` (default 104) + gap se header assente/invalid |
| Fuori GIS | preferisce `body.gis-mode > header`, else `header`; se manca → reserve. Probe `non_gis`: nessuna throw; clamp usa safeTop fallback |

**FINDING (per review, non OTHER hunk):** a 360×640 con 3 chip in `dockMode=row`, probe mostra `dockBottom=205` > `hdrBottom=144` mentre `safeTop=154`. Il dock `position:absolute` può dipingere sotto il border-box usato da safeTop → hit-test handle può fallire (chip/dock). Desktop/900/360 senza overflow dock: hit PASS. Eventuale `max(header.bottom, dock.bottom)` = fuori scope evidence-only.

---

## 3. D-Flight safe top

```36735:36738:coordinate_converter Claude.html
/** Usable map top below GIS header (safeTop) — shared geometry via gisPanelSafeTop. */
function dflightComputePanelSafeTop(opts){
  return gisPanelSafeTop(opts);
}
```

| Check | Esito |
|-------|-------|
| Ricorsione | `gisPanelSafeTop` **non** chiama `dflightComputePanelSafeTop` |
| Doppio offset | una sola somma `bottom+gap` |
| WU-0019 policy | pair layout invariato; stub SBS su `dflightComputePanelSafeTop` resta possibile |
| Pair in drag clamp | assente (source + runtime `pairInClamp=false`) |

---

## 4. `gisPanelClampRect` (~76099–76115)

Cambiamento: `minTop = Math.max(pad, gisPanelSafeTop(opts))` al posto di solo `pad`. Left/right/bottom/w/h invariati nella formula.

**Caller `gisPanelClampRect` (12):** defaultRect, resetEwWidth, applyLayout, resize path, track/search/convert/routing clamps (linee tipiche 26413, 76157, 76178, 76196, 76397, 77527, 77576, 77782, 77803, 77827, 77903, 87447). Blast radius = tutti i layout full-clamp; solo asse Y minimo.

**Storage:** nessun write nuovo; `gisPanelSetLayout` solo se caller già lo faceva. Touched non resettato da clamp puro (clamp restituisce rect).

---

## 5. `gisPanelClampRectPartialVisible` (~76118–76140)

Solo `minTop`: `0` → `safeTop`. Restano `minLeft = -(w-mv)`, `maxLeft = vw-mv`, `maxTop = vh-mv`.

| Caso | Evidence favorites @1400 |
|------|---------------------------|
| Troppo alto (top −40) | afterTop **95** (= safe) |
| Parziale sinistra (left −200) | `partialLeftLeft=-200` preservato; top ≥ safe (**115**) |
| Basso (top ≈ vh−30) | `partialBottomTop=836` (ancora partial bottom, non full clamp) |

**Acceptance:** partial-visible **non** convertito in full clamp.

---

## 6. `gisPanelAttachDrag` — onMove

`safeTop` letto ogni move; `minTop = safeTop` (partial) o `max(pad,safeTop)` (full). Orizzontale invariato. `gisPanelSetLayout(..., {touched:true})` invariato. Nessun sibling / nessun pair.

Se panel già sotto header all’inizio drag: primo move con `T < safeTop` lo clampa a safeTop (recupero senza reset w/h/left oltre il clamp X esistente).

---

## 7. Resize nudge (~75717–75749)

Registry IDs (allineato a lista z-pack `gisPanelBringToFront`):  
`convertModal, waypointModal, searchPanel, favoritesPanel, trackModal, layersPanel, measurePanel, rangeRingsPanel, astroPanel, polygonPanel, gisWorkbenchPanel, routingPlannerPanel, astroWaypointPicker, astroFavoritePicker, helpOverlay, qrModal, dflightPanel, dflightDetailsPanel, cartoIgmPanel`.

| Regola | Codice |
|--------|--------|
| Solo open | `if (!el \|\| !el.open) continue` |
| Skip minimized | `gis-panel-minimized` |
| Y solo se `br.top < safe` | sì |
| left/w/h | non toccati |
| touched | preservato (`touched: cur.touched !== false`) |
| pair | assente |
| Hook | `gisDockWireResizeOnce` → `gisDockReflow` + nudge |

Probe resize 1400→360→1400: `leftSame/wSame/hSame`, `touched=true`, nudge quando necessario.

---

## 8. Dock row dinamica (360 + 3 chip)

| Rect | Valore |
|------|--------|
| hdr bottom / h | 144 / 144 |
| dock bottom | **205** (mode **row**, chips 3) |
| safeTop | **154** (= 144+10) |
| panel before→after | −40 → **154** |
| canDragDown | **true** (→234) |
| hitPanel @ handle | **false** *(FINDING: dock band sotto header.bottom — vedi §2)* |

Senza chip @1400: safe segue hdr 85→95; hitPanel **true**.

---

## 9. Viewport matrix

| Caso | safeTop | after clamp | hitPanel | note |
|------|---------|-------------|----------|------|
| 1400×900 | 95 | 95 | true | |
| 900×800 | 185 | 185 | true | header wrap |
| 360×640 | 154 | 154 | true | |
| 360 + 3 chip | 154 | 154 | false | FINDING §2/§8 |
| resize 1400→360→1400 | 95→154→95 | recoveribile | true @1400 | touched preservato |

Brand sempre `TMART GIS tool`; hOverflow false.

---

## 10. Panel coverage (shared clamp)

Tutti **FOUNDATION/SHARED CLAMP PASS** (hitPanel true @1400, w/h invariati):  
`trackModal`, `favoritesPanel`, `measurePanel`, `layersPanel`, `dflightPanel`, `dflightDetailsPanel`.  
G-B/G-C **NOT OPENED**.

---

## 11. WU-0019

| Assert | Esito |
|--------|-------|
| Zone clamp → Details invariato | true |
| Details clamp → Zone invariato | true |
| Overlap intenzionale | true |
| pair assente da clamp/drag/nudge | true |

---

## 12. Z-order / G-A1

panels ≤28 (probe z=26) · header/dock **29** · drawer **30** · toolsBd **990** · unico dock. FIX1 **non** alza i pannelli sopra header.

---

## 13. Selftest `SAFE_TOP_FIX1_*` (10/10)

| Check | Tipo | Anti-tautologia |
|-------|------|-----------------|
| build_209 | meta | tip bump |
| api | static | presenza funzioni |
| neg_pair_in_clamp | source | string inspect |
| z_order_preserved | source | maxZ 28 |
| ge_header_bottom | geometry | misura live hdr vs safe |
| clamp_rejects_top0 | geometry | clamp top=0 |
| nudge_recovers | DOM | style top=0 → nudge |
| handle_hit | hit-test | elementFromPoint |
| wu0019_details_stable | runtime | sibling rect |
| wu0019_zone_nudged | runtime | zone ≥ safe |

Suite: **454/454**, fail=0.

---

## 14. Invarianti / scope

| Voce | Esito |
|------|-------|
| Nuova rete / GPS / watchPosition | no nel delta |
| Helper 0.1.3 | invariato (`infra/.../goi_dflight_helper.py` no diff) |
| Nuova localStorage/IDB | no |
| minimized session-only / unico dock | sì |
| `state.mapWaypoints[]` | sì |
| Workbench gap G-B | non corretto |
| Brand TMART | sì |
| G-B/C/D / F / WU-0012 | NOT OPENED / invariata |

---

## 15. Acceptance EVIDENCE-B

| Criterio | Stato |
|----------|-------|
| Candidato invariato `c122fd4…` | PASS |
| 18 hunk / +217/−40 / OTHER=0 | PASS |
| safeTop dinamico | PASS *(con FINDING dock-row occlusion)* |
| partial-visible preservata | PASS |
| drag/touched | PASS |
| nudge minimo | PASS |
| D-Flight sibling | PASS |
| G-A1 z-order | PASS |
| selftest non tautologico | PASS |

---

## STOP

- **Nessun** verdetto REVIEW GPT-SOSTITUTIVA  
- **Nessuna** patch / bump / deploy / ABQA / QA / finito  
- G-B/G-C/G-D / F **NOT OPENED**  
- Gate resta: **REVIEW GPT-SOSTITUTIVA — PENDING**
