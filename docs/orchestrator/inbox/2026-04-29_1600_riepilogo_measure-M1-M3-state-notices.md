# Riepilogo — Misura M1 + M3 leggero (stato + notifiche interne GIS)

**Data:** 2026-04-29  
**File canonico:** `coordinate_converter Claude.html`  
**Riferimento piano:** `docs/orchestrator/inbox/2026-04-30_2345_plan_measure-tool-standardization.md`

## Stato Misura (M1)

- **Transient operativi:** `mapMeasureMode`, `mapMeasurePts`, `mapPolyPts`, `mapCursorLL`, `mapMeasurePanelOpen`, `_measEscNoticePending` (Esc one-shot).
- **Preferenze persistite (`saveStore.settings`):** `mapMeasureUnit`, `mapMeasureKind`, `mapPolyClosed`, `gisMeasureFlow` (whitelist `sanitizeGisMeasureFlow` → `inverse2` | `direct`).
- **Geometrie:** non nel payload `saveStore`; niente storico misure.
- **`gisMeasureFlow`:** già in `saveStore`; **aggiunto** ripristino al load da `stored.settings.gisMeasureFlow` con sanitizzazione.
- **`gisExitMeasureTabPartial`:** non resetta più `gisMeasureFlow` (prima annullava la preferenza persistita a ogni uscita tab).
- **`saveStore()`:** rimosso da `applyGisDirectInputsToMap` (non necessario per preferenze dopo edit geometria) e da contextmenu delete vertice overlay misura (preferenze invariate).

## M3 leggero — notifiche interne

- Area esistente `#measOperativeNotices` / `#measNoticeInfo` / `#measNoticeErr` collegata a:
  - `measSyncOperativeInfo()` dopo readout / attivazione tab Misura / cambio unità GIS / flow/kind / fine `updateMeasureReadouts` / `gisRefreshI18n` se tab Misura attivo.
  - `applyGisDirectInputsToMap`: errori `measure.err.invalidDirectInput` / `measure.err.invalidMeasureInput`; successo pulisce e risincronizza info.
- **Esc (global hotkey):** dopo Range Rings, prima Track/Waypoint pick — se GIS tab Misura attivo e ci sono vertici, azzera punti, refresh overlay/readout, flag `_measEscNoticePending` + messaggio `measure.notice.escCleared`.

## i18n (IT / EN / FR)

Chiavi aggiunte: `measure.noticeRegionAria`, `measure.notice.measureActive`, `measure.notice.lineMode`, `measure.notice.polyMode`, `measure.notice.directMode`, `measure.notice.escCleared`, `measure.err.invalidDirectInput`, `measure.err.invalidMeasureInput`.

## Funzioni / regioni toccate

- `sanitizeGisMeasureFlow`, `measClearMsgs`, `measShowError`, `measShowInfo`, `measSyncOperativeInfo`, `gisExitMeasureTabPartial`, `applyGisDirectInputsToMap`, `syncGisDirectInputsFromMeasurePts`, `updateMeasureReadouts`, `renderMapMeasureOverlay` (solo rimozione `saveStore` contextmenu), `activateTab`, `bindHotkeys`, `init` (`loadStore` / `gisMeasureFlow`), listener GIS misura (click flow/kind, change unità), `gisRefreshI18n`.

## QA eseguito

- `git diff --stat`
- `git diff --check -- coordinate_converter Claude.html` (exit 0)
- `node --check` su JS estratto da `<script>` inline — OK
- Test manuale: da ripetere in browser (lista utente: Misura GIS, linea/poligono, unità, flow, notifiche, Esc, undo, pan/zoom, reload preferenze, assenza persistenza geometrie, RR/Track/Waypoint).

## Rischi residui

- Doppia chiamata `measSyncOperativeInfo` in alcuni percorsi (trascurabile).
- Conflitti tra strumenti non annunciati in UI se non già previsti altrove (fuori scope).

## Prossimo passo consigliato

M2 solo se richiesto dal piano; altrimenti M6 polish overlay o priorità prodotto.
