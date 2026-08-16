# GIS-PANEL-DOCK-MGR-G-B-AUDIT-A — evidence (docs-only)

**BLOCK-ID:** `GIS-PANEL-DOCK-MGR-G-B-AUDIT-A`  
**WU:** WU-0021  
**TIPO:** AUDIT / DOCS-ONLY  
**CATEGORIA:** DELICATO  
**GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING**

## Baseline (invariato)

| Voce | Valore |
| --- | --- |
| LIVE | `525e7df50cb4edf768b0da7f59e7414dd79d56de` |
| Build | **210** / `APP_BUILD_ID=GIS-PANEL-DOCK-MGR-G-A1-FIX2` |
| Blob | `9aa5441d48b89968cb388e3a7c61ee6d063a964d` |
| Helper | **0.1.3** |
| G-A1-FIX2 | **CLOSED / PASS** — **NON riaperto** |
| Monolite questo pass | **byte-invariato** (nessuna patch) |

---

## 1. Whitelist reale `gisMinimizePanel` (LIVE 210)

Catena `if / else if` (~76069–76126). Qualunque `panelId` non elencato cade in:

```javascript
} else {
  return; // silent no-op
}
```

### Partecipanti whitelist (minimize consentito se passano block check)

| panelId | Branch | Block check | Label tipica |
| --- | --- | --- | --- |
| `waypointModal` | sì | `gisWaypointModalBlockingSubdialogsOpen` | `gis.minimized.waypoint` |
| `trackModal` | sì | `trackBrushOnMinimizeAttempt` + `gisTrackModalBlockingSubdialogsOpen` | `gis.minimized.track` |
| `favoritesPanel` | sì | `gisFavoritesMinimizeBlocked` (`#favInlineConfirmBar`) | `gis.minimized.favorites` |
| `layersPanel` | sì | `gisLayersMinimizeBlocked` (`#offlineDraftWarnDialog`) | `gis.minimized.layers` |
| `astroPanel` | sì | `gisAstroMinimizeBlocked` (pickers) | `gis.minimized.astro` |
| `rangeRingsPanel` | sì | `gisRangeRingsMinimizeBlocked` | `gis.minimized.rings` |
| `measurePanel` | sì | nessuno (commento esplicito) | `gis.minimized.measure` |
| `polygonPanel` | sì | `gisPolygonMinimizeBlocked` salvo `opts.skipBlockCheck` | `gis.minimized.polygon` |
| `helpOverlay` | sì | nessuno | `gis.minimized.help` |
| `routingPlannerPanel` | sì | cleanup pick/drag (non flash-block) | `gis.minimized.routing` |
| `cartoIgmPanel` | sì | nessuno in branch (lifecycle in `_cartoUi`) | `gis.minimized.cartoigm` / `cartoUiT(...)` |
| `dflightPanel` | sì | nessuno in branch | `gis.minimized.dflight` |
| `dflightDetailsPanel` | sì | nessuno in branch | `gis.minimized.dflightDetails` |
| **`gisWorkbenchPanel`** | **ASSENTE** | — | `gis.minimized.workbench` (già in dict) |

`GIS_MIN_FOCUS_MAP` include workbench; `GIS_MIN_BLOCKED_MAP` include notice key; `gisRestoreMinimizedPanel` ha branch workbench; wire UI chiama già `gisMinimizePanel("gisWorkbenchPanel", …)` — ma la whitelist **non** ha il branch → **no-op**.

Selftest G-A1 attuale: `DOCK_GA1_neg_workbench_whitelist` **asserisce** l’assenza del branch (gap documentato, non regressione accidentale).

---

## 2. Classificazione A / B / C (richiesta prompt)

Legenda: **A = G-B ORDINARY** (normal path certificabile in G-B) · **B = G-C EXCEPTION** (lifecycle speciale) · **C = OUTSIDE**.

| ID | Classe | Motivazione | Simboli chiave |
| --- | --- | --- | --- |
| `trackModal` | **A** normal + **B** states | Normal min/restore OK; brush + subdialog = eccezione | `gisMinimizePanel` · `trackBrushOnMinimizeAttempt` · `gisTrackModalBlockingSubdialogsOpen` · `savedTrackStyleCloseForLifecycle` |
| `waypointModal` | **A** normal + **B** states | Normal OK; import/export dialog block | `gisWaypointModalBlockingSubdialogsOpen` |
| `favoritesPanel` | **A** normal + **B** states | Pilot G-A1; confirm bar block | `gisFavoritesMinimizeBlocked` · `#favInlineConfirmBar` |
| `layersPanel` | **A** normal + **B** states | Normal OK; **bbox auto-min** + draft warn | `offlinePanelMinimizeForBbox` · `offlinePanelRestoreAfterBbox` · `gisLayersMinimizeBlocked` |
| `astroPanel` | **A** normal + **B** states | Normal OK; picker open block | `gisAstroMinimizeBlocked` · `astroWaypointPicker` / `astroFavoritePicker` |
| `rangeRingsPanel` | **A** normal + **B** states | Normal OK; **pick auto-min** + picker/delete | `gisMinimizePanel` in pick flow ~72779 · `gisRangeRingsMinimizeBlocked` |
| `measurePanel` | **A** | Path più pulito; nessun auto-min/block | minimize/restore/clamp measure |
| `polygonPanel` | **A** normal + **B** states | Normal OK; **draw auto-min** + rename/delete | `polygonDrawMinimizeIfOpen` · `skipBlockCheck` · `_polygonDrawAutoMinimized` |
| `helpOverlay` | **A** | Minimize manuale ordinario | `helppanel-minimize` |
| `routingPlannerPanel` | **A** normal + **B** states | Normal min con exit pick/cancel drag; pick/marker = speciale | `routingExitPickMode` · `routingCancelMarkerDrag` |
| `cartoIgmPanel` | **B** | Dual state `_cartoUi` + area-pick auto-min | `minimizeCartoIgmPanel` · `state._cartoUi` · restore → `openCartoIgmPanel` |
| `dflightPanel` | **B** | Pair/touched WU-0019 su restore | `dflightRestorePanelToSafeTop` · `dflightEnsurePairLayout` |
| `dflightDetailsPanel` | **B** | Idem sibling | stesso pair |
| `gisWorkbenchPanel` | **A** (dopo fix) | Infra completa; **solo** manca branch whitelist | wire ~89022 · focus map · restore branch · `gis.minimized.workbench` |
| `searchPanel` | **C** | Floating/z-list ma **non** in whitelist; **non** aggiungere senza decisione | `gisPanelBringToFront` ids only |
| `convertModal` | **C** | Modal pesante; Esc chiude; fuori dock G | — |
| `qrModal` | **C** | Overlay; fuori dock G | — |

---

## 3. Workbench gap — codice reale

### Cosa c’è già

| Pezzo | Presente? | Locus |
| --- | --- | --- |
| Minimize button + wire | sì | `[data-role="workbenchpanel-minimize"]` → `gisMinimizePanel("gisWorkbenchPanel","gis.minimized.workbench")` ~89018–89023 |
| `GIS_MIN_FOCUS_MAP.gisWorkbenchPanel` | sì | head `gisWorkbenchPanelHead`, minSel workbench |
| `GIS_MIN_BLOCKED_MAP.gisWorkbenchPanel` | sì (notice only) | key `workbenchPanel.minimizeBlockedSubdialog` — **nessuna** `gisWorkbenchMinimizeBlocked()` chiamata in `gisMinimizePanel` |
| Restore branch | sì | `gisRestoreMinimizedPanel` → `_gisWorkbenchPanelLayoutOpts` / clamp / sync ~76230–76235 |
| Label chip i18n | sì | `gis.minimized.workbench` IT/EN/FR (già nel dict) |
| Drag / resize / z | sì | `_gisWorkbenchPanelLayoutOpts` · `gisPanelAttach*` · in z-repack ids · in nudge ids |
| Close path | sì | `closeGisWorkbenchPanel` + `gisClearPanelMinimizeUi("gisWorkbenchPanel")` |
| Occluder map | sì | `GIS_MAP_FLOATING_OCCLUDER_IDS` include workbench |

### Cosa manca (unico gap minimize)

Branch whitelist in `gisMinimizePanel`:

```text
} else if (panelId === "gisWorkbenchPanel"){
  /* ordinary — no subdialog block wired today */
}
```

oggi assente → cade in `else { return; }`.

### Patch minima proposta (futura G-B IMPL — **non** in questo pass)

1. Aggiungere **solo** il branch `panelId === "gisWorkbenchPanel"` nella catena whitelist (prima del `else return`), senza nuove UX.
2. **Non** introdurre nuovo block-check (nessuna funzione block esistente per workbench; la notice map resta per coerenza futura).
3. **Nessuna** nuova chiave i18n: riusare `gis.minimized.workbench`.
4. Aggiornare selftest: invertire `DOCK_GA1_neg_workbench_whitelist` → assert **presenza** branch + smoke minimize/restore workbench; aggiungere suite `gisDockSelfTestGB` mirata.
5. **Non** toccare: `gisDockReflow`, `gisPanelSafeTop`, z 28/29/30, `_gisMinimizedPanels`, `#gisMinimizedDock`, Esc/close, auto-min, D-Flight pair, touched.

---

## 4. Set espliciti

### `G_B_ORDINARY_IDS`

Pannelli il cui **normal path** minimize → chip shared dock → restore è certificabile in G-B (senza esercitare eccezioni G-C):

```javascript
const G_B_ORDINARY_IDS = Object.freeze([
  "favoritesPanel",
  "measurePanel",
  "layersPanel",
  "astroPanel",
  "rangeRingsPanel",
  "polygonPanel",
  "helpOverlay",
  "trackModal",
  "waypointModal",
  "routingPlannerPanel",
  "gisWorkbenchPanel" // dopo whitelist fix — deliverable primario G-B
]);
```

**Note:**

- Blocked-minimize **ordinario** (confirm/import/picker aperti → flash notice, no chip) resta nel contratto G-B come *negative path* leggero, **senza** certificare i lifecycle speciali sottostanti.
- **Non** includere `dflightPanel` / `dflightDetailsPanel` / `cartoIgmPanel` nel set ordinario.

### `G_C_RESERVED_IDS / STATES`

```text
G_C_RESERVED_IDS:
  - dflightPanel                    # pair / touched / EnsurePairLayout on restore
  - dflightDetailsPanel             # sibling pair
  - cartoIgmPanel                   # state._cartoUi + area-pick auto-min

G_C_RESERVED_STATES (panel può restare in G_B_ORDINARY_IDS per normal path):
  - layersPanel        / bbox auto-min          (offlinePanelMinimizeForBbox)
  - polygonPanel       / draw auto-min          (polygonDrawMinimizeIfOpen, skipBlockCheck)
  - rangeRingsPanel    / pick-and-create auto-min
  - trackModal         / brush + blocking subdialogs
  - waypointModal      / import-export dialogs
  - favoritesPanel     / favInlineConfirmBar
  - astroPanel         / waypoint|favorite picker open
  - rangeRingsPanel    / rrSourcePickerDialog | rrDeleteConfirm
  - polygonPanel       / inline rename | delete bar
  - routingPlannerPanel / pick mode | marker drag (re-entry / map-first)
  - layersPanel        / offlineDraftWarnDialog
  - cartoIgmPanel      / areaPickActive (già ID reserved)
```

G-C **non** aperto da questo audit.

### OUTSIDE (esplicito)

`searchPanel`, `convertModal`, `qrModal` — **non** aggiungere al sistema G senza decisione prodotto.

---

## 5. G-B implementation delta (proposta)

| Toccare | Non toccare |
| --- | --- |
| `gisMinimizePanel` — +1 branch workbench | `gisDockReflow` / `gisPanelSafeTop` |
| Selftest G-A1 neg workbench → positivo + smoke WB | z-order 28/29/30 |
| Nuovo selftest `gisDockSelfTestGB` (ordinary set + WB + FIX2 regression hooks) | shared `_gisMinimizedPanels[]` / `#gisMinimizedDock` schema |
| Build bump sequenza corrente + `APP_BUILD_ID=GIS-PANEL-DOCK-MGR-G-B` (solo in IMPL) | close/Esc semantics, auto-min logic, D-Flight pair, touched |
| i18n: **nessuna** nuova chiave obbligatoria | search/convert/qr |

Hunk stimati IMPL: **piccoli** (whitelist + selftest + build pins) — ordine di grandezza tipico +30/−10, da riconteggiare in IMPL.

---

## 6. Acceptance futura G-B

### A. Ogni `G_B_ORDINARY_ID`

1. open  
2. normal minimize  
3. chip in `#gisMinimizedDock`  
4. FIFO shared `_gisMinimizedPanels`  
5. restore  
6. close invariato  
7. drag/resize dopo restore  
8. `gisPanelSafeTop` ancora corretto (G-A1-FIX2)

### B. Workbench

1. minimize button **non** no-op  
2. chip workbench compare (`gis.minimized.workbench`)  
3. restore layout/clamp  
4. focus map / blocked notice coerenti (se esercitati)  
5. un solo dock / un solo array  

### C. Regression G-A1-FIX2

3 chip · narrow 360 · `safeTop >= dock.bottom + gap` · handle reachable · i18n IT→EN→FR · WU-0019 no sibling move.

---

## 7. Invarianti (questo pass)

- Monolite byte ≡ LIVE 210 / blob `9aa5441d…`  
- Helper 0.1.3  
- Nessuna rete/GPS/storage nuova  
- `state.mapWaypoints[]` invariato  
- **F NOT OPENED** · **G-C/G-D NOT OPENED** · WU-0012 invariata  
- G-A1-FIX2 **non** riaperto  

---

## 8. Verdetto audit

**G-B è tecnicamente determinato.**

- Scope G-B = certificazione `G_B_ORDINARY_IDS` + **fix whitelist workbench** (patch minima).  
- Scope G-C = `G_C_RESERVED_IDS/STATES` (lasciato integrale a G-C).  
- Nessuna ambiguità residua sul gap workbench: manca **solo** il branch in `gisMinimizePanel`.

**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**NEXT:** review audit → (se PASS) implementazione G-B.

STOP: no patch · no bump · no deploy · no ABQA · no QA · no finito · no G-C/G-D/F.
