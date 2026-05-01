# Riepilogo — Pass 6 Step 6A.1 (Preferiti + Waypoint polish, monolite locale)

**Data:** 2026-05-01  
**Scope:** solo **`coordinate_converter Claude.html`** (working tree locale). **Monolite escluso** dal commit memoria (policy default).

## Cosa è stato corretto / completato

1. **Preferiti — formato coordinate (solo lista)**  
   - Variabile runtime **`favoritesListCoordDisplayMode`** (non persistita).  
   - **`#favListCoordFmt`**: opzioni `dd`, `signed`, `ddm`, `dms`, `mgrs5` via **`syncFavCoordFmtSelectOptions`** + **`favWireCoordFmtSelectOnce`** (init accanto ai pulsanti Preferiti).  
   - **`renderFavorites`**: coordinate in lista da **`formatFavoriteListCoordinate`**; all’inizio della render chiama wire + sync select.  
   - **`applyLanguage`**: dopo **`renderFavorites`** richiama **`syncFavCoordFmtSelectOptions`** per etichette opzioni IT/EN/FR.

2. **Preferiti — conferme interne** (già presenti, integrazione chiusura)  
   - **`favInlineConfirmBar`**: rename / delete senza `window.confirm` per singolo preferito.  
   - **`closeFavoritesPanel`**: se la barra è aperta, ripristina il nome in caso di rename pendente e chiama **`favHideInlineConfirmBar`**.  
   - **Esc** globale: se **`favInlineConfirmBar`** visibile, annulla come il pulsante Annulla.

3. **Waypoint — eliminazione singola con barra interna**  
   - **`#wpDeleteOneBar`**: **`wpWireDeleteOneBarOnce`**, **`wpShowDeleteOneConfirmBar`**, **`wpHideDeleteOneBar`**, **`waypointPendingDeleteId`**.  
   - **`waypointDeleteExecute`**: rimozione effettiva (stessa logica di prima senza `confirm`).  
   - **`requestWaypointDelete`**: usato da lista (**`wp-del`**), editor (**`wpEditorDelete`**), menu contestuale mappa (**`wptMapCtxMenu`**).  
   - **Esc** con modal waypoint aperto: chiude prima la barra delete se visibile.  
   - **`closeWaypointModal`**: **`wpHideDeleteOneBar()`** all’apertura della chiusura.

4. **Waypoint — stella ★ attiva se già in Preferiti**  
   - **`renderWpModalList`**: **`waypointCoordinateHasMatchingFavorite(p.lat, p.lon)`** → classe **`gis-wp-fav-on`**, **`aria-pressed`**, tooltip/ARIA **`tip.favWaypointInFavorites`** vs **`tip.favAddWaypointRow`**.  
   - Dopo **`favoriteAddFromWaypointRowId`** (ok) e **`removeFavoriteExecute`**: **`renderWpModalList()`** per aggiornare lo stato visivo.

5. **i18n (IT/EN/FR)**  
   - Chiavi: **`fav.coordFmtLabel`**, **`fav.coordFmtHint`**, **`fav.coordFmt.*`**, **`fav.inlineOk`**, **`fav.inlineRenameMsg`**, **`fav.inlineDeleteMsg`**, **`tip.favWaypointInFavorites`**, **`waypointModal.deleteOneMsg`**, **`waypointModal.deleteOneConfirmBtn`**.

6. **API marker**  
   - **`removeFavorite`** ripristinato come alias pubblico → **`requestRemoveFavorite`** (delete effettivo **`removeFavoriteExecute`** dopo conferma inline).

## Cosa NON è stato implementato (per vincolo prompt)

- Pass **6B / 6C**, Range Rings polish, Traccia, Mappe online/offline, schema dati, nuove chiavi `localStorage`, modifiche a **`state.lastResult`**, **`renderResults`** per Centra, SunCalc/WMM/OLC/QR, OPSEC/geocoding/tiles/IndexedDB.  
- **`clearFavorites`** resta con **`window.confirm`** (non richiesto).  
- Rename waypoint da lista: ancora **`window.confirm`** su **`waypoint.renameConfirm`** (non nel task 6A.1).

## QA automatica (eseguita)

- **`git status --short`**: solo **`M coordinate_converter Claude.html`** (nessun altro file modificato oltre al monolite → OK).  
- **`git diff --stat`**: riportato in RIEPILOGO chat (~600 inserimenti / ~146 rimozioni al momento del check).  
- **`grep '<script src'`** / **`type='module'`**: nessun match.  
- Conteggio **`<script>`** / **`</script>`**: **2** / **2**.  
- **`node --check`**: OK su estratti **SunCalc** righe `9140–9260` e **main** `9264–39506` (estrazione senza riga `</script>`).

## Test browser

**Non eseguiti** in questa sessione (nessun server/browser automatizzato). Checklist manuale consigliata: layout Preferiti compatto; azioni su una riga; select formato coordinate; rename/delete con barra interna; Esc/ chiusura pannello; Waypoint delete da lista/editor/ctx; ★ attiva dopo aggiunta e dopo ri-render; tooltip IT/EN/FR; Centra invariato; Astro + RR non regressi; console pulita.

## Commit memoria (solo docs)

Dopo questo file: commit selettivo **`docs/orchestrator/latest.md`** + questo **`inbox`**, messaggio  
`docs: memoria Pass 6 Step 6A.1 preferiti waypoint polish local`  
— **senza** `coordinate_converter Claude.html`, **senza** `git add .`.

## Stato working tree atteso post-commit memoria

- **`coordinate_converter Claude.html`**: modificato **solo in locale** (finché non si fa commit principale).
