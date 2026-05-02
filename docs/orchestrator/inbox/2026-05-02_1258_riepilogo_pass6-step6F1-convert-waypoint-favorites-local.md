# Pass 6 Step 6F.1 — Converti → waypoint + Waypoint → rimuovi Preferiti (monolite locale)

**Data:** 2026-05-02 (timestamp locale `1258`).  
**Scope:** `coordinate_converter Claude.html` (modifiche **non** incluse nel commit memoria; **policy default**).

## 1. Converti → waypoint diretto

| Voce | Esito |
|------|--------|
| Implementato | **Sì** (completamento su flusso già presente) |
| Già presente | `#btnAddResultToWaypoint`, click → `waypointAddFromConvertedPoint`, `getCurrentConvertedPointForWaypoint`, `syncConvertResultWaypointBtn`, `waypointAdd` / `state.mapWaypoints` / `saveStore` / `renderMapWaypointsAll` via catena esistente |
| Completato | `syncConvertResultWaypointBtn()` + `clearConvertWaypointFeedback()` in **`openConvertModal`** (dopo `state.convertOpen = true`); **`closeConvertModal`**: pulizia `#convertWaypointFeedback` prima di `state.convertOpen = false`; **`syncConvertResultWaypointBtn`**: `title` con `convert.addWaypointDisabled` se disabilitato; **`waypointAddFromConvertedPoint`**: feedback via **`setConvertWaypointFeedback`** (ok: `convert.waypointAdded`; err/dup: stessi messaggi di prima ma instradati) |
| Fonte coordinate | **`state.lastResult`** (solo lettura nel flusso 6F.1; scrittura `lastResult` invariata altrove) |
| `state.lastResult` | **Solo lettura** in questo step |
| Feedback Converti (`#convertWaypointFeedback`) | **Sì** (`role="status"`, `aria-live="polite"` già nel markup; classi ok/err/info) |
| Preferenza vs `setBadge` | Se **`state.convertOpen`** → pannello; altrimenti fallback **`setBadge`** |
| Aggiunta multipla waypoint | **Sì** se coordinate distinte; **no** se quasi-duplicato (logica **`waypointAdd`** / **`waypointNearlyDuplicateLatLon`** invariata) |

## 2. Waypoint → rimuovi Preferiti (conferma interna)

| Voce | Esito |
|------|--------|
| Implementato | **Sì** |
| Conferma interna | **Sì** — `#wpRemoveFavBar` (skin allineata a `#wpDeleteOneBar`), pulsanti Conferma / Annulla, **no** `alert` / **no** `window.confirm` |
| Waypoint non cancellato | **Sì** — si chiama **`removeFavoriteExecute(id)`** (solo filtro su `state.favorites`) |
| Criterio match waypoint ↔ preferito | Stessa tolleranza coordinate già usata: **±1e-5°** su lat/lon (`waypointCoordinateHasMatchingFavorite` / `findFirstFavoriteIdAtLatLon`) |
| Match multipli (stesse coordinate) | Si rimuove **un solo** preferito: **`findFirstFavoriteIdAtLatLon`** restituisce il **primo** elemento in **`state.favorites`** che matcha; poiché i nuovi preferiti sono inseriti con **`unshift`** (`pushFavoriteEntrySilent`), l’indice **0** corrisponde al **più recente** |
| Aggiornamenti post-conferma | `removeFavoriteExecute` → `renderFavorites`, `saveStore`, `renderWpModalList`; in più **`showWpModalListFavFeedback("ok", …)`** con `waypointModal.favoriteRemoved` |
| Annulla / Esc | **Nessuna modifica** a dati; **`wpHideRemoveFavBar`** |

### Integrazione UI

- Delegato click **`[data-role="wp-fav"]`**: se ha match preferito → **`wpShowRemoveFavConfirmBar(wpId)`**; altrimenti **`favoriteAddFromWaypointRowId`** (comportamento precedente).
- **`wpWireRemoveFavBarOnce`** in init accanto a **`wpWireDeleteOneBarOnce`**.
- **`waypointModalUnsavedCloseRisk`**: barra remove-fav aperta → rischio (come delete one).
- **Esc GIS** (waypoint modal): se `#wpRemoveFavBar` visibile → dismiss (come delete one).
- **`wpShowDeleteOneConfirmBar`** / **`wpShowRemoveFavConfirmBar`**: si nascondono a vicenda per evitare barre sovrapposte.
- **`closeWaypointModal`**: **`wpHideRemoveFavBar`**.

## 3. i18n (IT / EN / FR)

- **`convert.addWaypoint`**, **`convert.addWaypointDisabled`**, **`convert.waypointAdded`**: IT già presenti; aggiunti **EN** e **FR** (FR formulazioni naturali).
- **`waypointModal.removeFavoriteConfirmTitle`**, **`removeFavoriteConfirmMsg`**, **`removeFavoriteConfirm`**, **`favoriteRemoved`**: IT già presenti; aggiunti **EN** e **FR**.

## 4. Vincoli / non toccato

- **Parser / conversione:** non modificati.
- **GPS / Misura / Range Rings / Traccia / OPSEC / tile / geocoding / IndexedDB / SunCalc / WMM / OLC / QR:** nessuna modifica intenzionale; smoke diff baseline `/tmp/goi-gis-before-6F1.html` su righe **`+/-`**: **nessuna** contenente token campione (`gps`, `getCurrentPosition`, `misura`, `measurePanel`, `rangeRings`, `trackModal`, `nominatim`, `indexed`, `opsec`, `tileMap`, `geocod`).
- **Schema store / `state.savedTracks` / nuove chiavi localStorage / cronologia / permalink:** non toccati da questo step.
- **`<script src>` / `type="module"`:** assenti (verifica `grep`).

## 5. QA automatica

| Controllo | Esito |
|-----------|--------|
| `git status --short` | Solo `M coordinate_converter Claude.html` (atteso) |
| `git diff --stat` | Vedi repo: delta ampio sul monolite (include lavoro locale cumulativo + 6F.1) |
| Conteggio `<script>` | **2** |
| `node --check` blocchi inline | **OK** — righe **9854–9980** e **9984–41924** estratte in `/tmp/goi-gis-script1.js` / `script2.js` |
| Marker `6F.1` | Presenti (HTML comment + JSDoc puntuali) |

**Test browser:** **non eseguiti** in questa sessione (nessun check manuale su `http.server`).

## 6. Commit / push (solo memoria orchestratore)

- **Inclusi:** `docs/orchestrator/latest.md`, questo file `inbox`.
- **Esclusi:** `coordinate_converter Claude.html`, `/tmp/goi-gis-before-6F1.html`.
- **Messaggio commit:** `docs: memoria Pass 6 Step 6F1 convert waypoint favorites local`

**Commit memoria:** `ca15e20` — messaggio `docs: memoria Pass 6 Step 6F1 convert waypoint favorites local`. **Push:** `main` aggiornato (solo `docs/orchestrator/**`).
