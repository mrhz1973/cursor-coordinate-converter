# Riepilogo intervento — Range Rings: centro Favoriti/Waypoint/GeoJSON, I/O, rename

**Data:** 2026-04-30 (completamento integrazione post-blocco JS)  
**File toccati:** `coordinate_converter Claude.html`, `.cursor/rules/00-project-core.mdc`, `.cursor/rules/10-html-architecture.mdc`, `docs/PROJECT_notes.md`, `docs/orchestrator/*`

## 1. Standard Import/Export (regole + note)

- **`10-html-architecture.mdc`:** sottosezione §7 su Import/Export nei modal/pannelli (file-first, GeoJSON preferito, export singolo/selezionati/globale, i18n, notifiche in-pannello, niente `alert`/`confirm` per flussi normali).
- **`00-project-core.mdc`:** richiamo breve agli standard UI incluso I/O.
- **`docs/PROJECT_notes.md`:** nota su standard I/O, GeoJSON, import locale.

## 2. Range Rings — centro

- Pulsanti **Centro da** (Favoriti, Waypoint, GeoJSON file locale).
- **Dialog** `#rrSourcePickerDialog`: ricerca, max 50 risultati, hint; indici su `state.favorites` e `state.mapWaypoints` (sola lettura, nessuna scrittura sugli array canonici).
- **GeoJSON centro:** `extractGeoJsonPointsForCenter` → un punto = applica subito; più punti = picker; senza rete, senza toccare store GIS.
- **Disarmo** Punta / Punta e crea con notifica `rangeRings.notice.disarmedForCenter` quando serve.

## 3. Range Rings — I/O

- **`<details id="rrIoDetails">`:** Esporta visibili, Esporta tutti, Import set + file nascosto; stesso stile pannelli operativi.
- Funzioni esistenti: `exportRangeRingSetsGeoJSON`, `importRangeRingsFromGeoJSONObj`, notifiche ok/errore.

## 4. Rename in-pannello

- **`state._rrPendingRename`** + `#rrRenameConfirm` (no `window.confirm` nel handler tabella).
- `rrRequestRenameFromInput` / `rrExecutePendingRename` / `rrCancelPendingRename`.
- Esc: dialog picker → annulla rename (globale) → clear delete; da campo rename con pending, hook `ensureGisInlineRenameKeyboardHooks` + `rrCancelPendingRename`.
- `rrRequestDeleteSet` / batch: blocco se `pending rename`.

## 5. Altre integrazioni (questa sessione)

- Rimossi riferimenti a `rrWaypointWrap` / `rrWaypointSelect` e ramo `waypoint` in `rrGetCenterFromUi` (centro da waypoint via picker).
- `renderRangeRingsPanel`: `ensureRrSourcePickerWired`, `ensureRrRangeRingsIoWired`, `ensureRrRenameConfirmWired`, `rrRenderRenameConfirmUI` prima di delete/operative info.
- `closeRangeRingsPanel`: chiude picker, cancella rename, poi delete.
- i18n **IT/EN/FR** per tutte le chiavi nuove (centro, picker, I/O, errori GeoJSON, rename, tip).
- `renderRangeRingsList` se lista vuota: `rrCancelPendingRename` + `rrCloseRrSourcePicker`.

## 6. QA

- `git diff --check -- "coordinate_converter Claude.html"`: ok.
- `node --check` su script estratto da `<script>`: ok.
- **Manuale:** elenco in richiesta utente (Favoriti/WP ricerca, edit+centro, import/export, rename, Esc).

## 7. Rischi residui

- **5F** drag handle centro: esplicitamente fuori scope.
- Autosync: commit memoria **senza** `coordinate_converter Claude.html`; monolite in commit separato se si versiona.

## 8. Prossimo passo

- QA manuale in GIS mode (floating + drawer). Valutare **5F** o micro-polish i18n.
