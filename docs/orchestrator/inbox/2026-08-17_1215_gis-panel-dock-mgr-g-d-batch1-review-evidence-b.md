# GIS-PANEL-DOCK-MGR-G-D-BATCH1-REVIEW-EVIDENCE-B — verify-only

**BLOCK-ID:** `GIS-PANEL-DOCK-MGR-G-D-BATCH1-REVIEW-EVIDENCE-B`  
**Categoria:** DELICATO / VERIFY-ONLY  
**Scope:** chiudere il gap di evidenza della REVIEW GPT-SOSTITUTIVA. **Zero patch runtime.**

## Candidate immutabile

| Campo | Valore |
| --- | --- |
| FULL SHA | `7fb0c202378966a412e454459f2fdf278e14ccee` (commit task) |
| Build / APP_BUILD_ID | **213** / `GIS-PANEL-DOCK-MGR-G-D-BATCH1` |
| Blob monolite | `bbc9a5c88888b9d0a79fcef2374a252aaf9893b7` — **invariato pre e post test** |
| HEAD repo | `60cb7d2dab2baf255f8c6b33ec8d8b0d1b86e499` = origin/main = ls-remote |
| Monolite | **NON modificato** · **NON bumpato** · **NON deployato** |

Raw: sibling JSON `2026-08-17_1215_gis-panel-dock-mgr-g-d-batch1-review-evidence-b.json` (run A/B/D) + `…-review-c.json` (re-run C). Esecuzione: Edge headless CDP su http.server locale 127.0.0.1, eventi input reali (mouse `Input.dispatchMouseEvent`, tastiera `Input.dispatchKeyEvent` con `text="\r"`/`" "`).

## A. RESTORE DA SLOT SINISTRO — **PASS**

Viewport 1920×900 · 5 pannelli minimizzati (favorites, measure, layers, astro, help).

- Piano osservato: `right=4 · left=1 · row=0 · overflow=0` (`helpOverlay` a **left**)
- **Click reale** (pointer fisico su centro chip sinistro): listener once-once invocato **1** volta
- Prima/dopo: `_gisMinimizedPanels` 5 → **4**; `helpOverlay` `open=true`, `min=false`
- Ghost chip: **0** · duplicati id: **0** · dock: **1**
- I 4 chip a destra **non si muovono** (right_before = right_after = favorites, measure, layers, astro)
- Pannello ripristinato raggiungibile (elementFromPoint dentro `#helpOverlay`) · top `112` ≥ safeTop `95`

Screenshot (fuori repo): `%TEMP%\gd-review-b-A-before.png` / `gd-review-b-A-after.png`

## B. RESTORE REALE DA OVERFLOW +N — **PASS**

Viewport 360×640 · 11 pannelli minimizzati (5 base + RR, polygon, track, waypoint, routing, carto).

- Piano: `row=2 · overflow=9` · controllo visibile **«Altri 9»**
- **Click mouse reale** su «Altri 9» → menu aperto, item raggiungibili (rect centrati nel viewport)
- Selezione **reale** via mouse di `layersPanel` (primo item overflow): `open=true`, `min=false`
- Conteggi: `_gisMinimizedPanels` 11 → **10**; overflow 9 → **8**; etichetta aggiorna a **«Altri 8»**
- Ghost/duplicate: **0** · dock: **1** · menu chiuso dopo il restore
- Pannello raggiungibile · top `211` ≥ safeTop `209`

Screenshot (fuori repo): `%TEMP%\gd-review-b-B-menu-keyboard.png` / `gd-review-b-B-menu-mouse.png`

## C. ACCESSIBILITÀ OVERFLOW — **PASS**

Controllo `Altri N` = `<button type="button" class="gis-dock-overflow-btn btn btn-sm">` nativo · `tabIndex=0` · non disabled · `.focus()` ok.

- **Enter** con il focus sul pulsante → menu **apre** (`_gisDockOverflowOpen=true`, menu non hidden)
- **Focus automatico sul primo item** (`layersPanel`) all'apertura
- **Enter** sull'item focalizzato → restore tastiera: `open=true`, `min=false`, n 9→**8**, ov 7→**6**, etichetta **«Altri 6»**, duplicati **0**, dock **1**, menu chiuso
- Restore da tastiera **non dipende** dal mouse

Nota di metodo (trasparenza): una prima sintesi CDP `rawKeyDown` **senza** `text` non ha attivato il button — artefatto dell'evento sintetico, non del prodotto. Il re-run con evento fedele (`keyDown` + `text="\r"`) PASS al primo colpo. Nessuna patch necessaria; nessun finding prodotto.

Screenshot (fuori repo): `%TEMP%\gd-review-c-menu-enter.png`

## D. REGRESSIONE MINIMA POST-RESTORE — **PASS**

- **4→5 desktop stabile**: dopo tutti i restore, scenario 5 chip @1920 ridà `right=4 · left=1 · row=0` (nessuna mass relocation)
- **Resize desktop→mobile→desktop** (1920→360→1920→900→1920): spy su `dflightEnsurePairLayout` invocato **0 volte** dal reflow; sorgente `gisDockReflow`/`gisPanelSafeTop` senza `dflightEnsurePairLayout` (`indexOf < 0`)
- Duplicati/ghost dopo resize: **0** · un solo dock
- **Oggetti GIS non toccato**: `gisWorkbenchPanel` non minimizzato, non in `_gisMinimizedPanels`, mai aperto nei test
- `state.mapWaypoints` Array intatto
- Selftest completo **564/564** PASS alla fine della sessione di test

## Verdetto prove

| Prova | Esito |
| --- | --- |
| A restore slot sinistro | **PASS** |
| B restore reale da +N | **PASS** |
| C accessibilità keyboard | **PASS** |
| D regressione minima | **PASS** |

## STOP

Tutte le prove PASS. Nessuna patch. Nessun bump. Nessun nuovo candidate.

**REVIEW GPT-SOSTITUTIVA — PENDING** (verdetto a ChatGPT) su FULL SHA `7fb0c202378966a412e454459f2fdf278e14ccee`.

**NO DEPLOY** · **NO QA OPERATORE** · **NO FINITO** · **F NOT OPENED** · **Oggetti GIS FROZEN / UNTOUCHED**.
