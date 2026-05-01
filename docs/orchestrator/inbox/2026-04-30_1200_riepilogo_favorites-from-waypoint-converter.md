# Riepilogo — Favoriti da Waypoint Modal e Convertitore

**Data:** 2026-04-30  
**Ambito:** piccolo blocco UX — salvataggio in `state.favorites` senza nuovo store o schema.

## Cosa è stato implementato

1. **Waypoint Modal (`renderWpModalList`)**  
   - Nella colonna azioni di ogni riga: pulsante compatto `★` con `data-tip` / `aria-label` da `tip.favAddWaypointRow` (IT/EN/FR).  
   - Click → `favoriteAddFromWaypointRowId(id)`: coordinate dal waypoint, nome da `p.name` se presente altrimenti `fav.defaultName` + coordinate; note da `p.meta.notes` se presenti; `meta` del waypoint passato al favorito come già fa il flusso “corrente”.  
   - Feedback: `#wpListFavFeedback` (`.wp-feedback`, classi `is-ok` / `is-err`) con messaggi `fav.savedFromWaypoint` / `fav.noValidPoint`.

2. **Convertitore (`.results-col`)**  
   - Nuovo pulsante `#btnAddResultToFavorites` (stile `btn btn-sm`, non primary), `disabled` finché non c’è un risultato valido — allineato a `btnAddResultToWaypoint` tramite `syncConvertResultWaypointBtn()`.  
   - Click → `addConvertedResultToFavoritesSilent()`: usa `state.lastResult`; località solo se `state.lastLocality` è già allineata alle coordinate (stessa tolleranza di `addCurrentAsFavorite`); nessuna chiamata di rete aggiuntiva; nome = stringa da località + coordinate oppure `fav.convertedPointName` + coordinate.  
   - Feedback: `#pasteStatus` con `flashPasteStatusLine` (classi `ok` / `err`), messaggi `fav.savedFromConverter` / `fav.noValidPoint`.

3. **Sistema Favoriti esistente**  
   - Nuovo helper **`pushFavoriteEntrySilent(lat, lon, opts)`**: stesso payload di `addCurrentAsFavorite` (`id`, `name`, `notes`, `lat`, `lon`, `createdAt`, `locality`, `meta`), rispetta il checkbox **convenzione nome** `[ES]-[CAT]-[num]` come il flusso con prompt.  
   - Nessuna deduplica aggiuntiva (non presente nel sistema esistente).  
   - `addCurrentAsFavorite` non è stato riscritto (resta con `prompt`/`confirm` dove già previsto).

## File modificati

- `coordinate_converter Claude.html` (HTML, CSS minimo `#wpListFavFeedback`, dizionari i18n IT/EN/FR, JS).

## Funzioni / regioni toccate (principali)

- `pushFavoriteEntrySilent`, `flashPasteStatusLine`, `showWpModalListFavFeedback`, `addConvertedResultToFavoritesSilent`, `favoriteAddFromWaypointRowId` (zona Favorites, dopo `nextFavPatternId`).
- `addCurrentAsFavorite` — non modificata.
- `syncConvertResultWaypointBtn` — abilita anche `#btnAddResultToFavorites`.
- `renderWpModalList` — bottone riga `data-role="wp-fav"` + delegazione click.
- Init: listener su `#btnAddResultToFavorites`.

## Chiavi i18n aggiunte

- `fav.addFromResult`, `fav.convertedPointName`, `fav.savedFromWaypoint`, `fav.savedFromConverter`, `fav.noValidPoint`
- `tip.favAddFromResult`, `tip.favAddWaypointRow`

## Test eseguiti (automatici)

- `git diff --stat` sul repo  
- `git diff --check -- coordinate_converter Claude.html` (nessun errore)  
- Estrazione JS inline (righe script) + `node --check` — OK  

## Test manuali

Non eseguiti in questa sessione; checklist richiesta dall’utente: hard refresh GIS, salvataggio da modal waypoint e da convertitore, verifica elenco Favoriti, cronologia/permalink/lingua/tema, assenza spam console.

## Aree non toccate (come richiesto)

Mappe Offline core, tile hydrate, `_mapTileGen`, AbortController tile, `syncOfflineDeltaViewportHints`, IndexedDB tile, OPSEC, GPS, Range Rings, Track, Misura, `docs/roadmap.md`, workflow `finito`.

## Rischi residui

- Con **convenzione nome** attiva nei Favoriti, anche i salvataggi “silenziosi” usano solo il pattern (comportamento volutamente allineato al pulsante esistente).  
- Azioni rapide ripetute possono creare più favoriti sullo stesso punto (nessuna deduplica preesistente).

## Commit / push

- **Monolite:** modificato in working tree; **non** incluso nel commit autosync di questo blocco (solo memoria orchestratore), salvo richiesta esplicita successiva.

## Prossimo passo consigliato

QA manuale in browser (checklist sopra); opzionale: valutare deduplica leggera solo se il team la richiede esplicitamente.
