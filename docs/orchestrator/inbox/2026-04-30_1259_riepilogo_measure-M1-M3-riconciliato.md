# Riepilogo — Misura GIS M1 + M3 (riconciliato)

**Data:** 2026-04-30 12:59 UTC  
**Classificazione:** `IMPLEMENTATO E NON PUBBLICATO`  
**Perimetro:** solo memoria orchestratore (nessuna modifica al monolite, nessun `finito`)

## Contesto

È stato segnalato un disallineamento: il blocco **Misura M1 + M3 leggero** risultava **implementato nel codice reale** ma non risultava “pubblicato all’orchestratore” (assenza in `docs/orchestrator/latest.md` + `docs/orchestrator/inbox/` come blocco completato).

In accordo alla regola di riconciliazione, questo file **pubblica l’esito** senza richiedere a ChatGPT di dedurre lo stato scansionando il monolite.

## Evidenze verificate nel monolite (senza modificarlo)

1. **Commento stato Misura** (transient vs preferenze vs classic/legacy)
   - transienti: `mapMeasureMode`, `mapMeasurePts`, `mapPolyPts`, `mapCursorLL`, `mapMeasurePanelOpen`
   - preferenze persistite: `mapMeasureUnit`, `mapMeasureKind`, `mapPolyClosed`, `gisMeasureFlow`

2. **Persistenza / sanitizzazione**
   - `sanitizeGisMeasureFlow(v)` presente
   - `gisMeasureFlow` accetta solo `inverse2` / `direct`
   - `gisMeasureFlow` salvato in `saveStore.settings`
   - `gisMeasureFlow` ripristinato/sanitizzato al load
   - `mapMeasurePts` e `mapPolyPts` **non** persistiti (geometrie misura non in payload store)

3. **Notifiche interne Misura (M3 leggero)**
   - area `#measOperativeNotices` in `#sec-measure` (GIS-only) con `aria-live="polite"`
   - helper presenti: `measClearMsgs`, `measShowError`, `measShowInfo`, `measSyncOperativeInfo`
   - stato transient: `_measEscNoticePending`

4. **Esc in tab Misura GIS**
   - se Misura GIS attiva e ci sono vertici: Esc azzera vertici, imposta `_measEscNoticePending`, aggiorna overlay/readout
   - il messaggio interno viene mostrato da `measSyncOperativeInfo` (chiave `measure.notice.escCleared`)

5. **i18n**
   - chiavi IT/EN/FR presenti per notifiche Misura, errore input direct, messaggio Esc cleared

## Conferme richieste (perimetro)

- Monolite (`coordinate_converter Claude.html`): **non modificato** in questo step (solo verificato/registrato).
- Geometrie misura: **non persistite**.
- `gisMeasureFlow`: **persistito e sanitizzato** (`inverse2`/`direct`).
- Notifiche interne Misura: presenti (`#measOperativeNotices`) con helper e i18n.

## QA / stato repo (di questo step)

- `git status --short`: pulito prima dell’aggiornamento memoria.
- Solo file `docs/orchestrator/**` modificati per la pubblicazione memoria.

## Rischi residui

- Basso: rischio principale è **processo** (dimenticare la pubblicazione memoria) mitigato dal workflow + regola riconciliazione.

## Prossimo passo consigliato

- Proseguire con il backlog Misura (M2/M4/M5/M6) solo se richiesto; altrimenti usare la stessa procedura di riconciliazione per eventuali altri blocchi “implementati ma non pubblicati”.

