# Pass 6 Step 6F.2 — Waypoint multi-selezione + batch Preferiti (monolite solo locale)

**Data:** 2026-05-02 (`1625` locale).

## Checklist richiesta (sì/no)

| Voce | Esito |
|------|--------|
| Multi-selezione waypoint implementata | **Sì** (checkbox esistenti + `Set` + ripristino dopo `renderWpModalList`) |
| Stato selezione transiente | **Sì** — `waypointModalSelectedRowIds` (`Set` in runtime) |
| Selezione **non** persistita in localStorage | **Sì** — `saveStore` payload invariato; nessuna nuova chiave storage |
| Batch add ai Preferiti | **Sì** — `waypointModalAddSelectedRowsToFavorites()` |
| Duplicati Preferiti evitati | **Sì** — `waypointCoordinateHasMatchingFavorite` (tolleranza **1e-5** come singolo) prima di `pushFavoriteEntrySilent` |
| Criterio «già preferito» | `waypointCoordinateHasMatchingFavorite(p.lat, p.lon)` |
| Feedback batch | **Sì** — `showWpModalListFavFeedback` (`#wpListFavFeedback`) con messaggi aggiunti / misti / tutti già presenti / nessuna selezione |
| i18n IT/EN/FR | **Sì** — `waypointModal.selectionCount`, `selectAll`, `clearSelection`, `addSelectedFavorites`, `noSelection`, `batchFavoritesAdded*`, `batchFavoritesAllSkipped` |
| Dopo batch: selezione | **Sì** — rimossi dal `Set` gli id **effettivamente aggiunti**; restano selezionati i soli skipped (già in Preferiti) se presenti |
| Rimozione multipla Preferiti | **NON implementata** |
| Cancellazione multipla waypoint | **NON implementata** (flusso `wpDeleteSelectedBtn` + `window.confirm` **invariato**) |
| Converti non toccato | **Sì** |
| `state.lastResult` non toccato | **Sì** |
| GPS / Misura / RR / Traccia / OPSEC / tile / geocoding / IndexedDB | **Sì** — delta mirato; diff baseline filtrato senza match su token vietati |

## Implementazione (sintesi file)

- **[`coordinate_converter Claude.html`](../../coordinate_converter%20Claude.html)** (solo locale, **non** in commit memoria):
  - `pushFavoriteEntrySilent`: opzione **`opts.deferPersist`** → salta `renderFavorites`/`saveStore`; batch chiama una volta a fine.
  - `waypointModalSelectedRowIds`, `wpModalPruneWaypointSelection`, `wpClearListFavFeedbackQuiet`, `syncWpModalBatchFavUi`, `wpModalApplySelectionCheckboxes`, `waypointModalAddSelectedRowsToFavorites`.
  - `renderWpModalList`: prune + dopo `innerHTML` ripristino checkbox; `change` su `#wpSelectAll` e `[data-wp-sel]` aggiorna il `Set`; `syncWpSelectAllState` chiama `syncWpModalBatchFavUi`.
  - HTML **`#wpBatchFavRow`** (contatore + Seleziona tutti / Deseleziona / Aggiungi selezionati ai Preferiti) + CSS scoped `#waypointModalPanel`.
  - `closeWaypointModal` / `executeWaypointsClearAll` / `waypointDeleteExecute` / `waypointsDeleteSelectedBulk`: coerenza `Set`.
  - `wpShowDeleteOneConfirmBar` / `wpShowRemoveFavConfirmBar`: `wpClearListFavFeedbackQuiet()` per non sovrapporre feedback batch alle conferme.

## QA automatica (eseguita)

- `git status --short`: monolite modificato (atteso).
- `git diff --stat`: ~220 righe sul monolite.
- Nessun `<script src>`; nessun `type="module"`.
- Conteggio `<script>` / `</script>`: **2 / 2**.
- `node --check`: OK blocco SunCalc **9903–10029** e blocco principale **10033–42156**.
- Diff vs `/tmp/goi-gis-before-6F2.html`: grep su token GPS/Misura/RR/Traccia/Converti/OPSEC/tile/IndexedDB/`state.lastResult`/SunCalc/WMM → **nessun match**.

## Test browser

**Non eseguiti** in questa sessione. Checklist: selezione multipla + contatore; Deseleziona; Seleziona tutti; batch con mix già/non preferiti; stella singola e barra rimuovi-preferito; delete selezionati (confirm nativo) invariato.

## Commit memoria orchestratore

Messaggio: `docs: memoria Pass 6 Step 6F2 waypoint multiselect local`  
**Hash:** `7d99bdd` — push **riuscito** su `main`.  
**Monolite escluso** dal commit/push memoria (policy + richiesta utente).
