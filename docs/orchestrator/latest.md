# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-30 — **Range Rings — blocco operativo completo (centro + I/O + rename):** **Centro da** Favoriti / Waypoint (picker ricercabile `#rrSourcePickerDialog`, cap risultati, no select enorme) e **GeoJSON locale** (punto o picker multi); **Import/Esporta** in `<details#rrIoDetails>` (esporta visibili, tutti, import GeoJSON set); **rename** con `state._rrPendingRename` e `#rrRenameConfirm` (niente `window.confirm` in lista); **Esc** ordine: picker → rename → delete; `closeRangeRingsPanel` chiude picker/rename. Standard **§7** Import/Export in `10-html-architecture.mdc` + nota in `docs/PROJECT_notes.md`. Inbox: `docs/orchestrator/inbox/2026-04-30_riepilogo_range-rings-center-import-export-rename.md`. Commit HTML **fuori** dall’autosync memoria: descrivere diff nell’`inbox`.

## Ultimo intervento Cursor

`coordinate_converter Claude.html`, `.cursor/rules/10-html-architecture.mdc`, `00-project-core.mdc`, `docs/PROJECT_notes.md`, memoria orchestratore. **Nessun** `finito`.

## File modificati (sintesi)

- `coordinate_converter Claude.html` (Range Rings: picker centro, I/O, rename, i18n, hotkey)
- `.cursor/rules/10-html-architecture.mdc`, `.cursor/rules/00-project-core.mdc`
- `docs/PROJECT_notes.md`
- `docs/orchestrator/latest.md`, `inbox/2026-04-30_riepilogo_range-rings-center-import-export-rename.md`

**Non toccati (richiesta):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/roadmap.md`.

## Prossimo passo consigliato

- Committare il monolite separatamente; QA su floating + drawer; backlog **5F** (maniglia/drag centro).

## Dettagli (inbox)

- Blocco centro + I/O + rename: `docs/orchestrator/inbox/2026-04-30_riepilogo_range-rings-center-import-export-rename.md`
- Storico RR: `inbox/2026-04-29_2930_riepilogo_range-rings-edit-delete-confirm.md`, …
