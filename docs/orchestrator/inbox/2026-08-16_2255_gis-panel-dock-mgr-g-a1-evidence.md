# Evidence — GIS-PANEL-DOCK-MGR-G-A1

**BLOCK-ID:** `GIS-PANEL-DOCK-MGR-G-A1`  
**WU:** WU-0021  
**Data:** 2026-08-16  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**Deploy / ABQA / QA / finito:** **no**

## Runtime candidate

| Voce | Valore |
|------|--------|
| FULL SHA | `7a5c42f3708cfa3dff3f7a7a7e1fdab5e470066c` |
| Short | `7a5c42f` |
| Build | **208** |
| APP_BUILD_ID | `GIS-PANEL-DOCK-MGR-G-A1` |
| Blob monolite | `d57ead862ef65e894cb637b590650912ff261a16` |
| SHA-256 (LF file) | `8be66eacec91291c21fc650f5b3fde6e4b74e44bf265912c03fe4b1a5422c05b` |
| Bytes | `10366856` |
| BASE LIVE | `508dd039981b1878e427c9440033fcad854351b1` / build **207** |
| Helper | **0.1.3** invariato |

## Diff BASE→candidate (monolite)

`508dd03..7a5c42f` — `coordinate_converter Claude.html`: **+352 / −30** (1 file).  
Simboli: `gisDockReflow`, `gisDockEnsureHeaderHost`, `gisDockWireResizeOnce`, `gisRenderMinimizedDock` (host header), `gisPanelBringToFront` maxZ **28**, CSS header/dock **z-index:29**, selftest `gisDockSelfTestGA1`.

## Architettura

- Source of truth: `_gisMinimizedPanels[]` (unico)
- Host: `#gisMinimizedDock` unico, montato sotto `body.gis-mode > header`
- Placement: geometria reale (slot left tra topbar→brand, right brand→ctrls, else **row** sotto chrome)
- z: panels ≤28 · dock/header 29 · tabDrawer 30 · tools backdrop 990 invariato
- Lifecycle pannelli / WU-0019 / workbench whitelist: **non** toccati

## Selftest

Playwright locale su file monolite: **444/444 PASS** (include suite DOCK_GA1_*).

## Prove geometria (PW)

| Viewport | mode | docks | overlap topbar/brand | chip reachable |
|----------|------|-------|----------------------|----------------|
| 1400×900 | row | 1 | false / false | 3/3 |
| 900×800 | row | 1 | false / false | 3/3 |
| 360×640 | row | 1 | false / false | 3/3 |

Occlusione: measure forzato top=70 → chip ancora hit `#gisMinimizedDock` (z29 > panel≤28).

## Non fatto

Deploy, ABQA, QA operatore, finito, G-B/C/D, F, WU-0012.
