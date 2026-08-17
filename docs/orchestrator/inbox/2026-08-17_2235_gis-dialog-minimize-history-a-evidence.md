# GIS-DIALOG-MINIMIZE-HISTORY-A — evidence unica

**BLOCK-ID:** `GIS-DIALOG-MINIMIZE-HISTORY-A`  
**WU:** WU-0021  
**Tipo:** STANDARD_RUNTIME_BUNDLE — Converti/Cerca minimize + Cronologia dialog  
**Categoria:** **DELICATO**  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (nessun verdetto in questo pass)

## Candidate

| Campo | Valore |
| --- | --- |
| BASE LIVE | `7fb0c202378966a412e454459f2fdf278e14ccee` · build **213** · `GIS-PANEL-DOCK-MGR-G-D-BATCH1` · blob `bbc9a5c88888b9d0a79fcef2374a252aaf9893b7` |
| FULL SHA candidato | `7196b30fe0c89acf2bd538640eb2076f012b6380` |
| Build / APP_BUILD_ID | **214** / `GIS-DIALOG-MINIMIZE-HISTORY-A` |
| Blob | `d425ec9a6c0fe4dc9e8f3a7445e6a1f6f6686f9f` |
| Bytes LF | `10468712` |
| SHA-256 LF | `523fc1cccc930461445235f7f50980dbc02db410b01e0e9225a6e63e1c2fd541` |
| LIVE (invariato — **no deploy**) | `7fb0c202378966a412e454459f2fdf278e14ccee` / **213** |
| Diff vs BASE | `+499 / −83` · **70 hunk** · **OTHER = 0** |

Raw browser: sibling JSON `2026-08-17_2235_gis-dialog-minimize-history-a-verify.json`.

## Task — esito aggregato

| Task | Esito | Evidenza |
| --- | --- | --- |
| 1 CONVERTI MINIMIZZABILE | **PASS** | `−` in `.app-modal-head-actions`; GIS `gisMinimizePanel("convertModal")`; minimize ≠ close; `aria-modal=false` in GIS; no inert/backdrop residuo; restore + × pulisce chip |
| 2 CERCA MINIMIZZABILE | **PASS** | stesso contratto su `searchPanel`; stato ricerca preservato; un solo dock |
| 3 LIFECYCLE COMUNE | **PASS** | whitelist in `gisMinimizePanel`; un solo `#gisMinimizedDock` / `_gisMinimizedPanels[]`; session-only; close handlers specifici; no `querySelectorAll` globale close/min |
| 4 CRONOLOGIA DRAWER → DIALOG | **PASS** | `#historyPanel` + `openHistoryPanel` / `closeHistoryPanel`; `GIS_VALID_TABS` esclude `history`; nessun `tabDrawer`/`translateX` nel path Cronologia |
| 5 RIMOZIONE VECCHIO DRAWER | **PASS** | Cronologia non usa più `#tabDrawer`; CSS `.tab-drawer` condiviso **intatto** (altri tab); un solo `#sec-history` reparent |
| 6 RESPONSIVE / A11Y | **PASS** | 1920×900 / 1400×900 / 900×700 / 360×640: titolo/`−`/`×` in view dopo layout; Esc/focus via selftest; safeTop |
| 7 REGRESSION CONTRACT | **PASS** | `DOCK_GD_*` 40/40; selftest 592/592; helper 0.1.3; no rete/GPS/storage nuovi |

## Selftest

- Suite completa: **592 / 592** PASS (`GOIDflight.selfTest()`)
- Baseline G-D: 564; delta = **28** check `DH_*` (0 fail)
- `DOCK_GD_*`: **40 / 40** (0 fail)
- pageErrors: **0**

`DH_*` coprono: build 214, whitelist convert/search/history, history non in `GIS_VALID_TABS`, un solo dock, i18n IT-only, convert/search/history minimize→restore→close, no inert, Cronologia non in drawer / no translate class.

## Matrice viewport (Chromium headless Playwright)

Chrome titolo/`−`/`×` in viewport dopo rAF (1920×900 Converti: `top=95`, `h=720`, `safe=95`). Probe immediato pre-rAF a 1920 può leggere geometria transitoria — non è il layout stabile.

| Viewport | Converti chrome | Cerca chrome | Cronologia chrome | drawer Cronologia |
| --- | --- | --- | --- | --- |
| 1920×900 | titolo/`−`/`×` OK (post-rAF top 95) | OK | OK | non usato |
| 1400×900 | OK top 95 | OK | OK | non usato |
| 900×700 | OK | OK | OK | non usato |
| 360×640 | OK | OK | OK | non usato |

## Conferme esclusioni / invarianti

- **F** workspace due legende: **NOT OPENED** (zero patch)
- **Oggetti GIS:** **FROZEN / UNTOUCHED** (nessun test/minimize `gisWorkbenchPanel` in questo blocco)
- **WU-0012:** invariata
- **G-D:** non riaperto; regressione dock dual-side / 4→5 / `Altri N` / resize coperta da `DOCK_GD_*`
- Un solo `#gisMinimizedDock` / un solo `_gisMinimizedPanels[]` · session-only · no nuova persistenza minimize
- Helper **0.1.3** non toccato (`infra/dflight-helper/**` invariato)
- Nessuna nuova rete / GPS / `watchPosition` / storage / IndexedDB
- `state.mapWaypoints[]` invariato
- vanilla single HTML; no `<script src>` / `type="module"`
- i18n nuove chiavi **solo IT**: `gis.minimized.convert` / `search` / `history` (L10N-EN-FR-FREEZE)
- Fuori GIS: Converti resta modal classica (`−` nascosto via CSS)

## Scope non toccato

- F, WU-0012, Oggetti GIS, helper
- Altri drawer (layers/measure/geocoding) — CSS `.tab-drawer` condiviso conservato
- `infra/dflight-helper/**`

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING** su FULL SHA `7196b30fe0c89acf2bd538640eb2076f012b6380`.

**NON** deploy · **NON** ABQA post-deploy · **NON** QA operatore · **NON** finito.
