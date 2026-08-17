# GIS-WORKSPACE-LEGENDS-F-BATCH1 — evidence unica

**BLOCK-ID:** `GIS-WORKSPACE-LEGENDS-F-BATCH1`  
**Categoria:** **ROUTINE** (UI/layout/drag session-only; nessun lifecycle −/× nuovo, nessuna persistenza, nessuna rete)  
**CLOSURE:** STANDARD_RUNTIME_BUNDLE  
**Gate:** **QA FINALE CHATGPT — PENDING**

## Candidate / LIVE

| Campo | Valore |
| --- | --- |
| BASE LIVE | `7196b30fe0c89acf2bd538640eb2076f012b6380` · build **214** · `GIS-DIALOG-MINIMIZE-HISTORY-A` · blob `d425ec9a6c0fe4dc9e8f3a7445e6a1f6f6686f9f` |
| FULL SHA candidato | `7ef5c83351d76c941655d82cc8f8b2fdc0029b75` |
| Build / APP_BUILD_ID | **215** / `GIS-WORKSPACE-LEGENDS-F-BATCH1` |
| Blob | `5fafd7d63a6a67107c8bc52f6abcdab2f0cee169` |
| Bytes LF | `10494421` |
| SHA-256 LF | `3afa1e33c60996988d4d50eaafe90b889f600ccaf7a820c78aa3f5dde5aa68b2` |
| Diff vs BASE | `+735 / −153` · solo `coordinate_converter Claude.html` |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7ef5c83` |

## 10 task — esito aggregato

| # | Task | Esito |
| --- | --- | --- |
| 1 | Due legende distinte (`#dflightRestrictionsLegend` ≠ `#dflightAtm09UserLegend`) | **PASS** |
| 2 | Workspace destro default (safe rect: `.tile-ctrls` / `.trp-point` / `.trp-cursor`) | **PASS** |
| 3 | Side-by-side automatico se entrambe visibili e untouched | **PASS** |
| 4 | Singola legenda: nessun placeholder vuoto | **PASS** |
| 5 | Drag D-Flight autonomo + touched session-only | **PASS** |
| 6 | Drag ATM09 autonomo + stesso contratto | **PASS** |
| 7 | Drag di una **non** muove la sibling | **PASS** |
| 8 | Overlap volontario non autocorretto | **PASS** |
| 9 | Resize: clamp raggiungibilità; re-pair solo se entrambe untouched | **PASS** |
| 10 | Responsive + regressione G-D / HISTORY-A | **PASS** |

## Selftest

- Suite completa: **618 / 618** PASS (`GOIDflight.selfTest()`)
- `WSF_*`: **26 / 26**
- `DH_*`: **28 / 28** (HISTORY-A)
- Dock G-D: **0 fail** sui check `DOCK_GD_*` / `GD_*`
- Pre-push locale + post-deploy LIVE: stesso esito

## Viewport matrix (CDP)

| Viewport | Convert/Search/History chrome | pair default | toolbar / coords |
| --- | --- | --- | --- |
| 1920×900 | titolo/`−`/`×` in-view | side-by-side, no overlap | OK |
| 1400×900 | OK | side-by-side | OK |
| 900×700 | OK | side-by-side | OK |
| 360×640 | OK (intersezione viewport) | stacked, no overlap | OK |
| largo→stretto→largo | OK | stacked a 360, sbs al ritorno 1920 | OK |

## Touched / manual policy

- Stato `_legendWs` **session-only** (non `state`, non `coordconv_ui_v1`, non IndexedDB).
- Drag marca `touched` solo sul pannello mosso.
- `legendWorkspaceLayout("sync"|"resize")` non sposta un pannello che ha già posizione se il sibling è touched.
- Overlap entrambi touched: solo clamp di raggiungibilità, nessun un-overlap.
- Entrambe untouched: re-pair sicuro (anche su resize).

## Conferme invarianti

- **Oggetti GIS** (`gisWorkbenchPanel`): **FROZEN / UNTOUCHED** (nessuna apertura/minimize nel blocco; boot `open=false`)
- `state.mapWaypoints[]` invariato
- Nessuna nuova rete / endpoint / helper call
- Nessun GPS / `watchPosition`
- Nessuna nuova localStorage / IndexedDB
- Helper **0.1.3** invariato (GIS-only restart; helper PID invariato)
- vanilla single HTML; no modules/npm
- WU-0019 `dflightEnsurePairLayout` invariato (Zone/Dettagli, non chiamato dal workspace legende)
- Dock G-D + Converti/Cerca/Cronologia HISTORY-A preservati

## Deploy GIS-only

- VPS FF → `7ef5c83` · blob ≡ candidato · `goi-gis-app` PID `2755555`→`2756441`
- proxy PID **invariato** `2481045` · GH PID **invariato** `2034035` · helper listen **invariato**
- HTTP **200** · file↔HTTP SHA MATCH · build 215 in body

## Automated Browser QA

**AUTOMATED BROWSER QA GIS-WORKSPACE-LEGENDS-F-BATCH1 PASS**

JSON: [`2026-08-17_2335_gis-workspace-legends-f-batch1-abqa.json`](2026-08-17_2335_gis-workspace-legends-f-batch1-abqa.json)

## STOP

**QA FINALE CHATGPT — PENDING**

**NON** emettere QA umana da Cursor. **NON** attestare PASS operatore. **NON** `finito`.
