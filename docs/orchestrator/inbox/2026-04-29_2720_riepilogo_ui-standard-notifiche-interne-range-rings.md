# Riepilogo — UI standard notifiche interne (modal/pannello) + Range Rings

**Data:** 2026-04-29 (ora locale indicativa 27:20)

## Scope

- **Parte A (regole):** sottosezione **«5) Notifiche interne»** in `.cursor/rules/10-html-architecture.mdc` (GIS & tools UI/UX standards); richiamo breve in `.cursor/rules/00-project-core.mdc` con rimando alla §10.
- **Parte B (monolite):** pannello `#sec-rangerings` — area `#rrOperativeNotices` (`role="region"`, `aria-live="polite"`, `data-i18n-aria="rangeRings.noticeRegionAria"`), sotto-blocchi `#rrInfo` (stato / arm / Esc), `#rrError`, `#rrOk`; CSS `.rr-operative-notices`, `.rr-notice-box--info`.
- **Stato:** `state._rrPanelEscNotice` per messaggio one-shot dopo Esc; `rrClearMsgs` / `rrShowError` / `rrShowOk` azzerano o gestiscono i tre canali; `rrSyncRangeRingsOperativeInfo()` aggiorna `#rrInfo` se non c’è errore/ok visibile.
- **Integrazione:** `bindHotkeys` (Esc su Range Rings: flag + `rangeRingsClearPickCenterMode` + `renderRangeRingsPanel`); `renderRangeRingsPanel` chiama `rrSyncRangeRingsOperativeInfo` prima di `renderRangeRingsList`; 5E `onUp` invariato salvo uso messaggi (nessun 5F).
- **i18n (IT/EN/FR):** `rangeRings.noticeRegionAria`, `rangeRings.notice.escClearedRings` (oltre a stringhe arm già presenti `pickCreateActive` / `pickMapActive`).

## File toccati

| File | Note |
|------|------|
| `.cursor/rules/10-html-architecture.mdc` | Standard notifiche interne |
| `.cursor/rules/00-project-core.mdc` | Richiamo notifiche interne |
| `coordinate_converter Claude.html` | Range Rings: markup, CSS, JS RR, i18n |

## Commit

- **Commit selettico:** `docs/orchestrator/**` + `.cursor/rules/**` pertinenti. **`coordinate_converter Claude.html` escluso** (policy autosync; modifiche al monolite descritte qui).

## Non toccato (per richiesta)

- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/roadmap.md`
- 5F drag centro, logica 5E oltre l’aggancio notifiche, shape `state.rangeRingSets[]`, OPSEC, GPS, tile offline, ecc.

## QA automatizzato (sessione)

- `git diff --check -- "coordinate_converter Claude.html"`: ok (nessun error/warning).
- Estrazione script inline (righe script principale) + `node --check`: ok.

## Rischi residui

- Dopo **cambio lingua** con pannello RR aperto, i testi in `#rrInfo` potrebbero restare nella lingua precedente fino a un nuovo `renderRangeRingsPanel` (stesso pattern di altri pannelli non ridisegnati in `applyLanguage`).
