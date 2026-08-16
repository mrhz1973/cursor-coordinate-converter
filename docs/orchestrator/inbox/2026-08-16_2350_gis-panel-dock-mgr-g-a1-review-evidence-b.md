# REVIEW-EVIDENCE-B — GIS-PANEL-DOCK-MGR-G-A1

**BLOCK-ID:** `GIS-PANEL-DOCK-MGR-G-A1-REVIEW-EVIDENCE-B`  
**WU:** WU-0021  
**Tipo:** DIAGNOSTIC / DOCS — evidence-only  
**Data:** 2026-08-16  
**Gate (invariato):** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**Verdetto review:** *non emesso* (STOP del prompt)

> Candidato runtime **invariato**. Nessuna patch monolite, nessun bump, nessun deploy.

---

## 0. Ancestry / candidate (immutabile)

| Voce | Valore |
|------|--------|
| BASE | `508dd039981b1878e427c9440033fcad854351b1` · build **207** · `BRANDING-TMART-IMPL-A-FIX1` |
| CANDIDATE | `7a5c42f3708cfa3dff3f7a7a7e1fdab5e470066c` · build **208** · `GIS-PANEL-DOCK-MGR-G-A1` |
| merge-base | `508dd039981b1878e427c9440033fcad854351b1` (= BASE) |
| ahead/behind (BASE…candidate) | ahead **6** / behind **0** (6 commit: docs WU-0020/0021 + runtime G-A1) |
| Blob monolite candidate | `d57ead862ef65e894cb637b590650912ff261a16` |
| Bytes (LF working copy tip) | `10366856` |
| SHA-256 LF | `8be66eacec91291c21fc650f5b3fde6e4b74e44bf265912c03fe4b1a5422c05b` |
| Diff comando | `git diff -U8 BASE CANDIDATE -- "coordinate_converter Claude.html"` |
| Shortstat | `1 file changed, 352 insertions(+), 30 deletions(-)` |

Artefatti inbox (sibling): [`2026-08-16_2350_gis-panel-dock-mgr-g-a1-hunk-account.json`](2026-08-16_2350_gis-panel-dock-mgr-g-a1-hunk-account.json) · [`2026-08-16_2350_gis-panel-dock-mgr-g-a1-review-rects.json`](2026-08-16_2350_gis-panel-dock-mgr-g-a1-review-rects.json). Raw patch locale (non versionato): `C:\tmp\ga1_review_diff.patch`.

---

## 1. Hunk account completo

**Totale hunk runtime:** **17**  
**Riconciliazione +/-:** **+352 / −30** (esatto)

| # | @@ header | Area / simbolo | +/− | Classificazione |
|---|-----------|----------------|-----|-----------------|
| 01 | `@@ -7000,37 +7000,53 @@` | CSS header/dock z + host | +19/−3 | **DOCK_CSS** (include Z_ORDER CSS) |
| 02 | `@@ -23568,20 +23584,20 @@` | `APP_BUILD_ID/NUM/DETAIL` | +3/−3 | **BUILD_META** |
| 03 | `@@ -38833,18 +38849,18 @@` | `dflightSelfTestF` build pin | +2/−2 | **BUILD_META** |
| 04 | `@@ -39855,18 +39871,18 @@` | `dflightSelfTestTf` | +2/−2 | **BUILD_META** |
| 05 | `@@ -41783,18 +41799,18 @@` | `dflightSelfTestH` | +2/−2 | **BUILD_META** |
| 06 | `@@ -42284,18 +42300,18 @@` | `dflightSelfTestHitFixA` | +2/−2 | **BUILD_META** |
| 07 | `@@ -43298,18 +43314,18 @@` | `dflightSelfTestOptB` | +2/−2 | **BUILD_META** |
| 08 | `@@ -43736,18 +43752,18 @@` | `dflightSelfTestOptB` (2°) | +2/−2 | **BUILD_META** |
| 09 | `@@ -44328,18 +44344,18 @@` | `dflightSelfTestMVISA` | +2/−2 | **BUILD_META** |
| 10 | `@@ -44963,18 +44979,18 @@` | `dflightSelfTestIMPLA` | +2/−2 | **BUILD_META** |
| 11 | `@@ -45120,18 +45136,18 @@` | `dflightSelfTestLEGENDUX` | +2/−2 | **BUILD_META** |
| 12 | `@@ -45545,18 +45561,18 @@` | `dflightSelfTestSideBySide` build pin | +2/−2 | **BUILD_META** |
| 13 | `@@ -45933,19 +45949,19 @@` | `brandingSelfTestTmartImplA` build pin | +3/−3 | **BUILD_META** |
| 14 | `@@ -46054,16 +46070,193 @@` | `gisDockSelfTestGA1` + extend | +177/−0 | **DOCK_SELFTEST** |
| 15 | `@@ -75142,17 +75335,17 @@` | `gisPanelBringToFront` maxZ 29→28 | +1/−1 | **Z_ORDER** |
| 16 | `@@ -75271,31 +75464,155 @@` | `gisDock*` + rewrite render | +124/−0 | **DOCK_JS** |
| 17 | `@@ -75312,16 +75629,21 @@` | coda `gisRenderMinimizedDock` (wire+reflow hooks) | +5/−0 | **DOCK_JS** *(continuazione hunk 16; non OTHER)* |

### Somme per classe (dopo riclassificazione #17 → DOCK_JS)

| Classe | Hunk | + | − | Note |
|--------|------|---|---|------|
| DOCK_CSS | 1 | 19 | 3 | |
| Z_ORDER | 1 | 1 | 1 | JS maxZ; z CSS contato in DOCK_CSS |
| DOCK_JS | 2 | 129 | 0 | |
| DOCK_SELFTEST | 1 | 177 | 0 | |
| BUILD_META | 12 | 26 | 26 | tip build 207→208 / ID bump |
| **OTHER** | **0** | 0 | 0 | |

**Σ +352 / −30.** **OTHER = 0.**

BUILD_META: aggiornamento assert tip runtime obbligatorio al bump — autorizzabile, nessuno scope drift funzionale.

---

## 2. Shared host / source of truth — codice reale

### Unico array

```75142:75143:coordinate_converter Claude.html
var gPanelZCounter = 24; // session-only z-order for floating operational panels
/** Pass 6 Step 6E.1 — minimized floating panels (runtime only; not persisted). */
```

(`var _gisMinimizedPanels = [];` subito sotto — invariato come SoT; G-A1 non introduce secondo array.)

### Unico dock + host header (no paralleli)

```75473:75480:coordinate_converter Claude.html
function gisDockEnsureHeaderHost(dock){
  if (!dock || !document.body.classList.contains("gis-mode")) return null;
  const header = document.querySelector("body.gis-mode > header") || document.querySelector("header");
  if (!header) return null;
  if (dock.parentElement !== header){
    try { header.appendChild(dock); } catch(_){}
  }
  return header;
}
```

In `gisRenderMinimizedDock`: crea al più un `#gisMinimizedDock`; in GIS mode chiama `gisDockEnsureHeaderHost`; **nessun** secondo id/host.

### Nessun branch foundation su favorites/measure

Delta foundation (`gisDockReflow` / `gisRenderMinimizedDock` / CSS / maxZ): **zero** `if (panelId === "favoritesPanel")` / measure.  
I ID pilota compaiono **solo** in `gisDockSelfTestGA1` (hunk 14).

### Nessuno state persistente nuovo

`gisMinimizePanel` / `gisRenderMinimizedDock` / `gisDockReflow`: nessun `localStorage` / IndexedDB nuovo (selftest `DOCK_GA1_session_only_minimized` + grep delta).

---

## 3. `gisDockReflow` — codice reale e hook

Funzioni contigue: **75473–75577** (`EnsureHeaderHost`, `Reflow`, `WireResizeOnce`) + render **75579+**.

### Responsabilità reflow (citazione)

Legge `getBoundingClientRect` di host/brand/ctrls/topbar; sceglie `left|right|row`; scrive **solo** style/class del dock (+ eventuale `header.paddingBottom`). Commento esplicito: *Does NOT move floating panels / touched layouts / D-Flight pair.*

### Hook

| Hook | Dove | Perché | Lifecycle panel? | Muove floating? | Chiama pair layout? |
|------|------|--------|------------------|-----------------|---------------------|
| fine `gisRenderMinimizedDock` | + `gisDockReflow` (+ rAF) | placement dopo chip DOM | no | no | **no** (`indexOf dflightEnsurePairLayout < 0`) |
| `gisDockWireResizeOnce` | `resize` passive | capacity cambia | no | no | no |
| i18n path esistente | già chiamava `gisRenderMinimizedDock` ~91624 | label chip / width | no | no | no |
| minimize/restore/remove | via `gisRenderMinimizedDock` esistente | sync chip list | semantica minimize/restore **invariata** | no | restore D-Flight path preesistente **non** alterato dal reflow |

**Acceptance:** reflow modifica solo dock/chrome.

---

## 4. Placement policy (geometry-driven)

### Rect letti

`host`, `.brand`, `.header-ctrls`, `#appTopbar` → `getBoundingClientRect()`.

### Formula (codice)

- `need = max(120, ceil(dock.scrollWidth || n*96))`
- `leftSlotLeft = header.left+pad`, poi se topbar a sinistra del brand: `max(leftSlotLeft, topbar.right+pad)`
- `leftAvail = brand.left - leftSlotLeft - pad`
- `rightAvail = ctrls.left - brand.right - 2*pad`
- se `leftAvail >= need` → **left**; else se `rightAvail >= need` → **right**; else → **row** sotto `max(brand,ctrls,topbar).bottom`

### Costanti px (baseline, non breakpoint viewport)

| Costante | Ruolo |
|----------|--------|
| `pad = 8` | gap chrome |
| `need` floor `120` | min slot utile |
| fallback chip `96` | stima pre-measure |
| `maxWidth` cap `560` / floor `160` | allineati al CSS dock preesistente |
| `dockH` floor `38`/`58` | altezza chip/riga |

**Nessun** `@media` nuovo che sostituisca la decisione left/right/row (solo `max-width:520` preesistente sul dock).

### 360px

Probe: mode **row**; brand/controls/topbar/dock senza overlap; chip cliccabili (vedi §9).

---

## 5. Z-order — CSS/JS reali

### CSS (hunk 01)

```7008:7045:coordinate_converter Claude.html
/* G-A1: header stacking context raised so in-header dock can sit above floating panels (maxZ 28). */
body.gis-mode > header{
  z-index:29;
  position:sticky; /* keep sticky; reinforce stacking with z-index */
}
.gis-minimized-dock{
  ...
  z-index:29;
  ...
}
```

### JS (hunk 15)

`gisPanelBringToFront`: default `maxZ` **29 → 28**.

### Invariati (grep candidate, non nel delta)

| Layer | z |
|-------|---|
| `#tabDrawer` | **30** |
| `#toolsDrawerBackdrop` | **990** |
| subdialog unsaved/clear | 30000+ |

### Header a 29 — stacking side-effect

**Voluto:** dock nel context header può stare sopra floating panels (≤28).  
**Effetto collaterale:** anche brand/controls/topbar condividono stacking ≥ panels quando c’è overlap geometrico — coerente con “chip nel chrome raggiungibili”.  
**Non regressione drawer/tools:** 30 e 990 restano sopra.  
Classificazione: **comportamento voluto** (non OTHER).

---

## 6. Lifecycle — negative evidence

`git diff BASE..CANDIDATE` **non** tocca:

- close / Esc handlers
- `polygonDrawMinimizeIfOpen` / `offlinePanelMinimizeForBbox` / RR pick auto-min
- carto `_cartoUi` minimize paths
- corpo `dflightEnsurePairLayout` / open-close D-Flight
- touched/`gisPanelSetLayout` drag semantics

Uniche menzioni `dflightEnsurePairLayout` / favorites/measure nel delta: **selftest** (assert negativi + pilot).  
`gisRestoreMinimizedPanel` D-Flight branches **non** in diff.

**Acceptance:** nessun lifecycle G-C anticipato.

---

## 7. WU-0019 regression guard

| Guard | Evidence |
|-------|----------|
| Pair layout intatto | funzione + SBS selftests ancora in suite (444 include SBS_*) |
| Drag touched non muove sibling | logica in `dflightEnsurePairLayout` **fuori** delta |
| Dock reflow non chiama pair | `DOCK_GA1_neg_pair_layout_src`: `String(gisDockReflow).indexOf("dflightEnsurePairLayout") < 0` |
| Restore D-Flight | hook `gisRestoreMinimizedPanel` → `dflightEnsurePairLayout` **preesistente**, non modificato |

---

## 8. Pilot + shared smoke

### Pilot (acceptance / selftest, non architettura)

- `favoritesPanel`, `measurePanel`: minimize → chip → reachable con altro panel open → restore  
- 3+ FIFO: favorites → measure → layers  
- un solo `#gisMinimizedDock`

### Smoke whitelist esercitata in `gisDockSelfTestGA1`

`favoritesPanel`, `measurePanel`, `layersPanel`, `helpOverlay`, `astroPanel`  
→ **FOUNDATION PASS** (minimize/restore roundtrip).

**Non certificati (restano G-B/G-C):** track brush blocks, carto area-pick, RR pick auto-min, polygon draw auto-min, D-Flight pair/touched deep, workbench whitelist.

### Viewport / resize / i18n

Probe locale su candidate: 1400 / 900 / 360; resize 1400→360 con chip; `gisRenderMinimizedDock` post i18n path — dock unico, chip clickable.

---

## 9. Header / topbar regression — rect reali (candidate)

Brand text sempre **`TMART GIS tool`**. z: dock/header **29**, drawer **30**, toolsBd **990**.

### wide 1400×900 — mode `row`

| El | rect (l,t,r,b / w×h) |
|----|----------------------|
| header | 0,0,1400,85 / 1400×85 |
| brand | 586,6,814,80 / 228×74 |
| ctrls | 1041,6,1386,80 / 345×74 |
| appTopbar | 14,23,553,63 / 539×40 |
| dock | 8,88,1392,146 / 1384×58 |

Overlaps dock↔topbar/brand/ctrls: **false**. hOverflow: **false**. Chip 3/3 clickable.

### 900×800 — mode `row`

| El | rect |
|----|------|
| header | 0,0,900,175 / 900×175 |
| brand | 340,52,560,90 / 221×38 |
| ctrls | 14,96,886,170 / 872×74 |
| appTopbar | 218,6,682,46 / 463×40 |
| dock | 8,178,892,236 / 884×58 |

Overlaps: **false**. Chip 3/3 clickable. hOverflow: false.

### 360×640 — mode `row`

| El | rect |
|----|------|
| header | 0,0,360,144 / 360×144 |
| brand | 115,4,245,29 / 130×25 |
| ctrls | 8,33,352,95 / 344×62 |
| appTopbar | 8,99,352,139 / 344×40 |
| dock | 8,147,352,253 / 344×106 |

Overlaps: **false** (dock sotto topbar). Chip 3/3 clickable. hOverflow: **false**.

---

## 10. Selftest review — `gisDockSelfTestGA1`

**Loc:** ~46079+. **DOCK_GA1 checks:** **22**. **Suite totale:** **444/444**, fail=0.

| Assert | Tipo | Anti-tautologia |
|--------|------|-----------------|
| build_208 | meta tip | allineato bump (atteso) |
| api / single_array | static/runtime | presenza API |
| maxZ_default_28 | source guard | ispeziona sorgente `gisPanelBringToFront` |
| pilot_measure_open, chip_favorites | DOM runtime | apre panel reali |
| single_dock_dom, dock_in_header | DOM | querySelectorAll |
| z_dock_29 / z_header_29 / drawer_30 / panel_z_le_28 | computed style | misura live |
| chip_reachable_vs_measure | geometry hit-test | `elementFromPoint` |
| fifo_3plus / all_chips_rendered | runtime order | |
| smoke_whitelist_subset | runtime roundtrip | open/min/restore |
| neg_pair_layout_src / neg_workbench / session_only / mapWaypoints / storage | source/invariant guards | |

Non solo “costante === costante”: maggioranza esercita DOM/z/hit-test/roundtrip.

---

## 11. CSS scope

**Unico hunk CSS (#01).** Regole toccate/aggiunte:

- `body.gis-mode > header` z-index 29 + sticky reinforce  
- `.gis-minimized-dock` z 22→29, `box-sizing`, commento  
- `body.gis-mode > header > #gisMinimizedDock…` absolute host  
- `.gis-dock-mode-row` right/width/max-width  

**Non** toccati: branding colors/fonts, header-ctrls layout generale, topbar tabs styling, temi.

`@media (max-width:520px)` dock max-width: **preesistente**, invariato nella sostanza.

---

## 12. Invarianti (dal delta)

| Invariante | Esito |
|------------|-------|
| Nuova rete/endpoint | no |
| GPS / `watchPosition` | no nel delta (`getCurrentPosition` opt-in preesistente invariato) |
| Helper `HELPER_VERSION = "0.1.3"` | invariato (`infra/…/goi_dflight_helper.py` identico BASE/candidate) |
| Nuova localStorage/IDB | no |
| Minimized session-only | sì |
| `state.mapWaypoints[]` | invariato |
| Filename monolite | invariato |
| Vanilla standalone | sì |
| Workbench whitelist fix | **non** fatta (G-B) |
| G-B/C/D / F | **NOT OPENED** |
| WU-0012 | invariata |

---

## 13. Acceptance EVIDENCE-B checklist

| Criterio | Stato |
|----------|-------|
| Candidato invariato `7a5c42f…` | PASS |
| Hunk contabilizzati / +352/−30 | PASS |
| Codice inspectable | PASS |
| Shared host / SoT | PASS |
| Placement geometry-driven | PASS |
| Z-order completo | PASS |
| Lifecycle invariati | PASS |
| WU-0019 invariata | PASS |
| Selftest non tautologico | PASS |
| OTHER = 0 | PASS |
| Scope drift | nessuno |

---

## STOP

- **Nessun** verdetto REVIEW GPT-SOSTITUTIVA  
- **Nessuna** patch / bump / deploy / ABQA / QA / finito  
- Gate resta: **REVIEW GPT-SOSTITUTIVA — PENDING**
