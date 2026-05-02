# Pass 6 Step 6F.3 — Waypoint: delete selezionati con conferma interna (monolite locale)

**Data:** 2026-05-02 (timestamp inbox `1715`). **Monolite:** `coordinate_converter Claude.html` modificato **solo in working tree**; **non incluso** nel commit memoria (policy default).

## Checklist richiesta (sì/no)

| Voce | Esito |
|------|--------|
| Delete selezionati con conferma interna | **Sì** (`#wpDeleteSelectedBar` + `wpShowDeleteSelectedConfirmBar` / `waypointsDeleteSelectedExecute`) |
| `window.confirm` rimosso dal flusso delete selezionati | **Sì** (`waypointsDeleteSelectedBulk` non chiama più `confirm`) |
| Barra usata/creata | **`#wpDeleteSelectedBar`** (skin `wp-inline-confirm` / `gis-rr-confirm-skin`, dopo `#wpRemoveFavBar`, prima `#wpBatchFavRow`) |
| Esc sulla barra | **Sì** (`bindHotkeys`: prima `wpHideDeleteSelectedBar`, senza cancellare dati) |
| Selezione dopo annulla | **Intatta** (solo `wpHideDeleteSelectedBar` → `waypointPendingDeleteSelectedIds = null`) |
| Selezione dopo conferma | **Pulita** per gli id eliminati (`waypointModalSelectedRowIds.delete` per ogni id in `set`) |
| Waypoint eliminati correttamente | **Sì** (stessa logica filtro `state.mapWaypoints` + `closeWaypointEditor` se draft colpito) |
| Mappa / lista / store aggiornati | **Sì** (`saveStore`, `renderMapWaypointsAll` → include `renderWpModalList`) |
| Batch Preferiti 6F.2 non regressione | **Previsto sì** (solo `wpHideDeleteSelectedBar` all’inizio di `waypointModalAddSelectedRowsToFavorites`; nessun cambio schema batch) |
| Icona Preferiti 6F.2a non regressione | **Sì** (nessun tocco a `renderFavorites` / pin) |
| Converti / GPS / Misura / RR / Traccia / OPSEC non toccati | **Sì** (solo Waypoint modal + i18n waypoint; diff filtrato su token vietati: **vuoto**) |

## Implementazione (sintesi)

- **Stato transiente:** `waypointPendingDeleteSelectedIds` (array o `null`).
- **`waypointsDeleteSelectedBulk`:** `wpModalPruneWaypointSelection`, elenco id da `state.mapWaypoints` ∩ `waypointModalSelectedRowIds`; vuoto → `showWpModalListFavFeedback("err", waypointModal.noSelection)`; altrimenti barra conferma.
- **`waypointsDeleteSelectedExecute`:** conferma → filtra esistenti, rimuove dal Set, aggiorna `state.mapWaypoints`, `saveStore`, `renderMapWaypointsAll`, feedback `waypointModal.deleteSelectedDone` con `{count}`.
- **Mutua esclusione barre:** `wpShowDeleteSelectedConfirmBar` chiude delete-one e remove-fav + `wpClearListFavFeedbackQuiet`; `wpShowDeleteOneConfirmBar` e `wpShowRemoveFavConfirmBar` chiudono delete-selezionati.
- **Batch UI:** click «Deseleziona» / «Seleziona tutti» chiude la barra delete-selezionati per evitare messaggio obsoleto.
- **`waypointModalUnsavedCloseRisk`:** barra delete-selezionati visibile → rischio (come le altre barre).
- **`closeWaypointModal`:** `wpHideDeleteSelectedBar`.
- **i18n IT/EN/FR:** `waypointModal.deleteSelectedConfirmTitle`, `deleteSelectedConfirmMsg`, `deleteSelectedConfirm`, `deleteSelectedDone`.

## QA automatici

- `git status --short`: `M coordinate_converter Claude.html`
- `git diff --stat`: ~105 insertions, ~10 deletions (valore da `git diff --stat` al momento dell’intervento)
- `<script src>` / `type="module"`: **assenti**
- Conteggio `<script>` / `</script>`: **2 / 2**
- `node --check` (estrazione **9912–10038** e **10042–42250**, senza tag): **OK**
- Diff vs `/tmp/goi-gis-before-6F3.html` filtrato su token vietati (GPS/Misura/RR/Traccia/Converti/…): **nessuna riga**

## Test browser

**Non eseguiti** in questa sessione (nessun server/browser qui). Checklist manuale: selezione multipla → Elimina selezionati → nessuna eliminazione immediata → conferma interna → Annulla (dati intatti) → ripeti → Conferma → solo selezionati rimossi; contatore/checkbox; mappa; Esc sulla barra; delete singolo; batch Preferiti; rimozione singolo preferito; Converti→waypoint; console pulita.

## Commit memoria

Messaggio: `docs: memoria Pass 6 Step 6F3 waypoint delete selected local`  
File versionati: `docs/orchestrator/latest.md`, questo file inbox.  
**Hash commit:** usare `git log -1 --oneline` sul branch dopo pull (messaggio commit come sopra); evitare hash hardcoded nel file inbox.

## Prossimo passo consigliato

Smoke test browser su 6F.3; poi, se OK, commit monolite su `main` quando autorizzato (fuori da questo autosync).
