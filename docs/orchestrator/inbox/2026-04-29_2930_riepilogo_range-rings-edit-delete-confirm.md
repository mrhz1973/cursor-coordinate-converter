# Riepilogo intervento — Range Rings: conferma eliminazione, Modifica set, sposta centro (2026-04-29)

## Obiettivo

Completare UX Range Rings: conferma eliminazione in pannello (rafforzata), azione riga **Modifica**, modalità modifica con **Aggiorna set** / **Annulla modifica**, **Sposta centro sulla mappa** (pick-to-move, un solo clic), blocco **Punta e crea** durante la modifica; aggiornare standard progetto (liste operative, Modifica, conferme distruttive).

## Bug eliminazione

La logica `_rrPendingDelete` + `rrDeleteConfirm` esisteva già; è stata **rafforzata e allineata** alle richieste:

- Box `#rrDeleteConfirm` spostata **dentro** `#rrOperativeNotices` (notifiche interne unificate).
- `rrExecutePendingDelete` ora chiama `renderRangeRingsPanel()` dopo l’eliminazione per sincronizzare pulsanti (edit / pick / create).
- `rrDeleteSetIds` azzera sessione modifica se il set eliminato era quello in editing (`_rrEditingSetId`).
- Lista vuota e chiusura sezione/pannello continuano ad azzerare pending ed edit (sessione transient).

## Standard «Modifica» (progetto)

- **`.cursor/rules/10-html-architecture.mdc`**: nuovo §6 *Liste operative nei modal* (azione Modifica esplicita, conferme interne per delete, spostamento geometrico esplicito/annullabile).
- **`.cursor/rules/00-project-core.mdc`**: richiamo breve a Modifica + conferme in-pannello.
- **`docs/PROJECT_notes.md`**: nota sugli standard (notifiche interne, Modifica, conferme delete, geometria map-first esplicita).

## Applicato ai Range Rings (HTML)

- Stato transient: `_rrEditingSetId`, `_rrEditingMoveCenterMode` (non persistiti).
- Tabella: pulsante **Modifica** (`data-rr-edit`), **Elimina** con etichetta i18n; colonna azioni min ~260px.
- Form: **Aggiorna set** (primary in edit), **Annulla modifica**, **Sposta centro sulla mappa** (solo in edit); **Crea anelli** disabilitato in edit; **Punta sulla mappa** non primary in edit; **Punta e crea** disabilitato in edit + errore se invocato.
- Mappa: gestione clic per `_rrEditingMoveCenterMode` **prima** di pick-and-create; classe `.range-rings-edit-move-mode` + cursore crosshair; `saveStore` dopo spostamento centro.
- `rrSyncRangeRingsOperativeInfo`: messaggi per edit attivo e move-center armato.
- Esc: dopo pending delete, annulla move-center senza uscire dalla modifica del set (solo flag move).
- Funzioni principali: `rrFormatDistancesForInput`, `rrResetRangeRingsFormToNew`, `rrLoadSetIntoForm`, `rrClearRangeRingsEditSession`, `rrBeginEditRangeRingSet`, `rrCancelEditRangeRing`, `rrSaveEditedRangeRingSetFromUi`, `rrEnterRangeRingEditMoveCenterMode`.

## Spostamento centro

Implementato **pick-to-move** (un clic sulla mappa aggiorna `center` del set in editing, persistenza immediata). **Nessun** drag handle 5F.

## File toccati

- `coordinate_converter Claude.html`
- `.cursor/rules/10-html-architecture.mdc`, `.cursor/rules/00-project-core.mdc`
- `docs/PROJECT_notes.md`
- `docs/orchestrator/latest.md`, questo file inbox

## QA (manuale consigliato)

Conferma delete singolo/batch, Esc, annulla; Modifica → campi → Aggiorna senza duplicare; Annulla modifica; Sposta centro; blocco Punta e crea in edit; resize colonne / preset / batch / export / rename inline.

## Rischi residui

- Rename inline usa ancora `window.confirm` (preesistente; fuori scope delete RR).
- In edit, «Punta sulla mappa» (non pick-and-create) resta utilizzabile per aggiornare `_rangeRingsMapPickCenter` prima di **Aggiorna set** — coerente con centro «picked».

## Prossimo passo consigliato

- 5F drag handle centro (se approvato); sostituire `confirm` sul rename inline con flusso in-pannello allineato agli standard.
