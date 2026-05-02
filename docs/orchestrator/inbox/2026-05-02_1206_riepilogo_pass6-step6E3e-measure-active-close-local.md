# Pass 6 — Step 6E.3e (Misura: sync active pulsante mappa alla chiusura)

**Data:** 2026-05-02  
**Scope:** micro-fix UI — pulsante Misura sulla **toolbar mappa** (`[data-role="measure-box-toggle"]`, classe `tmeas-btn`) restava **active/blu** dopo chiusura reale del pannello floating.

## Causa

- In **`renderTileMap`**, `active` / `aria-pressed` del toggle Misura sono calcolati solo **al rebuild HTML** della toolbar.
- **`closeMeasureFloatingPanelGis()`** (e Esc / X) aggiorna stato + **`gisSetTopbarTabActive("measure", false)`** + **`trackSyncPickModeUi()`**, ma **`trackSyncPickModeUi`** sincronizzava track/waypoint/Range Rings **senza** aggiornare il toggle Misura → DOM obsoleto fino al prossimo `renderTileMap`.

## Fix

- Esteso **`trackSyncPickModeUi()`**: blocco finale che aggiorna **`[data-role="measure-box-toggle"]`** con la **stessa formula** usata in `renderTileMap` (`mapMeasureMode` OR `mapMeasurePanelOpen` OR `gisMeasureIsDrawerContext()`), più tip/aria-label coerenti con `tip.mapMeasureBox` + `esc()` se presente.

## Checklist richiesta

| Voce | Esito |
|------|--------|
| Fix active Misura | **Sì** |
| Misura aperta (non minimizzata) → active | **Sì** (via `gisMeasureIsDrawerContext` / `mapMeasureMode`) |
| Misura minimizzata → active | **Sì** (`mapMeasureMode` resta true; `gisM` false ma `on` true) |
| Misura chiusa → inactive | **Sì** |
| `aria-pressed` coerente | **Sì** |
| Funzione modificata | **`trackSyncPickModeUi`** |
| Resize/drag/bring/minimizza Misura | **Non toccati** |
| Converti / GPS / persistenza / dati | **Non toccati** |
| Test automatici | `git status`, `git diff --stat`, script 2/2, `node --check` blocchi **9836–9962** e **9966–41769** OK |
| Test browser | **Non eseguiti** (checklist manuale utente) |
| Diff baseline `/tmp/goi-gis-before-6E3e.html` | ~27 righe |
| Monolite in commit | **No** |

## Non implementato

6F.1, 6D, `finito`, commit monolite, altre modifiche Misura oltre sync toggle.
