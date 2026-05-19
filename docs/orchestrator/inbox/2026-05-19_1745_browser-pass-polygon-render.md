# Browser PASS — T1.1 Pass A polygon render

**Data:** 2026-05-19 17:45  
**Branch:** main  
**Tipo:** browser QA confirmation  
**Commit testato:** `6e0b416`

---

## Risultato

| Area | Esito |
|------|-------|
| Polygon overlay su tile map | **PASS** |
| User quote | "PASS polygon render" |
| Regressioni segnalate | Nessuna |

---

## Cosa è stato verificato

- `renderGisPolygonsOverlay()` produce overlay SVG visibile sulla mappa.
- Poligoni da `state.gisPolygons[]` appaiono come previsto.
- Pass A rendering accettato dall'utente.

---

## Modifiche codice in questa sessione

**Nessuna.** Solo aggiornamento docs.

---

## Prossimo passo raccomandato

**T1.1 Pass B — Pannello floating shell + lista UI** (`#polygonPanel`):
- Dialog floating dedicato con lista poligoni.
- Drag/resize/minimize pattern standard.
- Pulsante "Nuovo poligono" (placeholder, non funzionale — Pass C).
- i18n IT/EN/FR.
- No draw mode, no map interaction, no export, no delete implementation.

---

## Prompt CODE Pass B (copy-paste ready)

```
SESSIONE CC DA USARE:
Repo: mrhz1973/cursor-coordinate-converter
Percorso: C:\Users\mrhz\Documents\AI\GitHub\cursor-coordinate-converter
Scopo: T1.1 compound polygon — Pass B: floating panel shell + list UI
NON usare: mrhz1973/dev-method
NON usare: mrhz1973/alina-lavoro
NON usare: altre cartelle o repository locali

Mode: CODE
Preferred model: Sonnet
Effort: medium

You are Claude Code working inside the GIS Tool repository only.

Goal:
Implement Pass B of T1.1 compound polygon: add a floating panel shell
(#polygonPanel) that displays a list of existing state.gisPolygons.
This is a UI-only pass — no draw mode, no map interaction, no export.

Pre-read:
- docs/orchestrator/inbox/2026-05-19_1745_browser-pass-polygon-render.md
- docs/orchestrator/inbox/2026-05-19_1700_plan_t1.1-compound-polygon.md
- docs/orchestrator/latest.md

Preflight:
1. Confirm repo, branch main, git status clean.
2. git pull --ff-only origin main.

Background:
- state.gisPolygons[] already exists and is rendered on the map (Pass A done).
- Floating panel pattern: #rangeRingsPanel / #astroPanel / #measurePanel.
- gisPanelAttachDrag + gisPanelAttachResize already available.
- gisMinimizePanel / gisRestoreMinimizedPanel already available.
- gisPanelBringToFront already handles z-order for all floating panels.
- GIS_DEFAULT_LAYER_IDS.polygons = default layer for polygons.
- Toolbar button pattern: .twpt-btn / .trr-btn / .ttrk-btn.

Large-file rules:
- Do NOT read coordinate_converter Claude.html in full.
- Use Grep/marker search to find:
  - #rangeRingsPanel DOM structure
  - openRangeRingsFloatingPanel / closeRangeRingsFloatingPanel
  - _rangeRingsPanelLayoutOpts
  - gisPanelBringToFront panel list
  - GIS_VALID_TOOLS or GIS_VALID_TABS
  - gisNavigateToolTarget
  - prepareUiBeforeAppFullReset
  - renderRangeRingsList (for list rendering pattern)
  - toolbar mappa buttons (.trr-btn, .twpt-btn)
- Read narrow ranges only (max 80 lines per read).

Implementation:
1. Use marker search to locate the above patterns.

2. Add <dialog id="polygonPanel"> HTML in the GIS DOM section:
   - Head: title "Poligoni (N/50)" + minimize btn + close btn.
   - Body: scrollable list area.
   - Footer: "Nuovo poligono" button (disabled, title hint "Pass C").
   - Pattern: identical to #rangeRingsPanel structure.
   - Insert near the other floating panel dialogs.

3. Add CSS scoped to #polygonPanel:
   - Reuse .gis-floating-panel or equivalent class.
   - Default size similar to RR panel.
   - Position offset so it doesn't overlap RR/Astro exactly.

4. Implement JS:
   - state.polygonPanelOpen = false (transient, not persisted).
   - _polygonPanelLayoutOpts() — same as _rangeRingsPanelLayoutOpts.
   - openPolygonFloatingPanel() / closePolygonFloatingPanel() / togglePolygonFloatingPanel().
   - renderPolygonList() — iterate state.gisPolygons, show name + color swatch + visibility icon.
   - Register in gisPanelBringToFront.
   - Register in prepareUiBeforeAppFullReset.
   - Register in gisNavigateToolTarget (if applicable).
   - Add minimize: gisMinimizePanel("polygonPanel", "gis.minimized.polygon").
   - Toolbar button: add .tpoly-btn to tile-ctrls (near .trr-btn).
   - trackSyncPickModeUi: update .tpoly-btn active state if polygonPanelOpen.

5. Add i18n keys:
   - gis.polygonPanel.title: "Poligoni" / "Polygons" / "Polygones"
   - gis.polygonPanel.newPolygon: "Nuovo poligono" / "New polygon" / "Nouveau polygone"
   - gis.polygonPanel.newPolygonDisabled: "Disegno in Pass C" / "Drawing in Pass C" / "Dessin en Pass C"
   - gis.polygonPanel.empty: "Nessun poligono" / "No polygons" / "Aucun polygone"
   - gis.minimized.polygon: "Poligoni" / "Polygons" / "Polygones"
   - tip.polygonPanel: "Poligoni" / "Polygons" / "Polygones"

6. Ensure the panel shows polygon list on open:
   - Each row: color swatch (small square), name (truncated), visibility toggle icon.
   - Click on row: no action yet (placeholder for Pass E edit).
   - Visibility toggle: toggles properties.visible, calls saveStore(), re-renders map + list.
   - This is the only interactive behavior in Pass B.

7. Call renderPolygonList() after gisFeatureAdd/Update/Delete if panel is open.

Static checks:
- Confirm no new <script src>.
- Confirm no type="module".
- Confirm 2× <script> blocks.
- Run node --check on main script block.
- Confirm existing waypoint/track/RR/Astro/Measure panels unmodified.

Browser QA checklist:
1. Open GIS Tool in browser.
2. Click polygon toolbar button → panel opens.
3. Panel shows "Nessun poligono" if no polygons exist.
4. Inject test polygon via console (same as Pass A checklist).
5. Panel updates to show "Test Alfa" with color swatch.
6. Toggle visibility icon → polygon disappears from map, reappears on toggle back.
7. Minimize panel → appears in dock.
8. Restore from dock → panel restored.
9. Drag panel → repositions.
10. Resize panel → resizes.
11. Close panel → panel hidden.
12. Verify Waypoint/Track/RR/Astro/Measure panels still work.
13. Verify no console errors.

Allowed files:
- coordinate_converter Claude.html (targeted edit only)
- docs/orchestrator/latest.md
- docs/orchestrator/inbox/2026-05-19_NNNN_pass-b-polygon-panel.md

Commit rules:
- Stage only the allowed files above.
- Commit message: feat: add polygon floating panel shell
- Push authorized after commit.
- Do not stop for confirmation.

Final report: repo path, branch, status before/after, commit hash, push result,
static checks, browser QA result or NOT EXECUTED checklist,
open risks, confirmation coordinate_converter Claude.html targeted-only.
```
