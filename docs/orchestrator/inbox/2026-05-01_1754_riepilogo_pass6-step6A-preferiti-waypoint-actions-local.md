# Pass 6 Step 6A — Preferiti (UI IT) + lista tabellare + azioni compatte; Waypoint azioni compatte (monolite locale)

**Data:** 2026-05-01 (timestamp inbox `1754`)  
**Scope:** solo **Step 6A** del piano Pass 6 (`docs/orchestrator/inbox/2026-05-01_1709_plan_pass6-modal-actions-standardization.md`). **Non** implementati: 6B (Mappe online/offline), 6C (Traccia), 6D (QA globale).

## Cosa è stato fatto

1. **UI italiana — etichette utente «Favoriti» → «Preferiti»**  
   Aggiornati dizionario **IT** (`I18N.it`) e testi di fallback in HTML dove serviva coerenza visiva iniziale. **Invariati:** `state.favorites`, funzioni `favorite*`, id DOM `favorites*`, `sec-favorites`, `#favorites-list`, ecc. **EN** «Favorites» / **FR** «Favoris» invariati per le chiavi equivalenti.

2. **`renderFavorites`**  
   - Lista in **`#favorites-list`** come **tabella** (`.favorites-modal-table` dentro `.favorites-table-wrap`) con **header** visibili.  
   - Colonne: **Nome** (`waypointModal.listColName`), **Coordinate** (`fav.listColCoord`), **Dettagli** (`waypointModal.listColDetails` — data + località), **Azioni** (`fav.listColActions`).  
   - **Sub-riga** dedicata alle **note** (`colspan="4"`), textarea invariata per edit/salvataggio su `change`.  
   - Ricerca/filtro (`#favFilter`), stati vuoto / no match **inalterati** a livello logico.  
   - Delegazione click: **`[data-fav-focus-name]`** → focus/select sul campo nome; **`[data-fav-center]`** → `favoriteMapCenterTo` (nessun `renderResults`); **`[data-fav-waypoint]`** → `favoriteAddAsWaypoint`; load/del come prima (`loadFavorite`, `removeFavorite` + `confirm` esistente).  
   - Pulsanti azioni compatti: **✎** (edit/focus nome), **⌖** (centra), **★** (waypoint), **↻** (convertitore), **✕** (`btn-danger-subtle`).  
   - **`syncI18nInRoot(root, state.lang)`** dopo il render per `data-i18n-tip` / `data-i18n-aria` / `data-i18n-ph`.

3. **`renderWpModalList`**  
   - Azioni **solo icona** con **`data-role`** invariati (`wp-edit`, `wp-zoom`, `wp-fav`, `wp-del`) e stessi handler delegati.  
   - Tooltip/ARIA via **`data-i18n-tip`** / **`data-i18n-aria`** (`waypointModal.editor.editTitle`, `waypointModal.zoomTo`, `tip.favAddWaypointRow`, `tip.mapWpRemove`).  
   - **`syncI18nInRoot(root, …)`** dopo `innerHTML`.

4. **i18n**  
   - Nuove chiavi **IT/EN/FR:** `fav.listColCoord`, `fav.listColActions`, `tip.favEdit`, `tip.favLoadConverter`.  
   - Aggiornamenti IT estesi su `tabs.favorites`, `sec.favorites`, `fav.*`, `waypointModal.fromFavorites` / picker, Astro (`astro.src.favorite`, `astro.fav.*`, `tip.astro.*` pertinenti), `persist.*`, `help.guide.*`, `session.hint`, `tip.rangeRingsCenterFromFav`, `rangeRings.centerFromFav`, ecc.

5. **CSS** (già presente da lavoro precedente nella sessione + coerenza)  
   Stili scoped sotto `#sec-favorites #favorites-list` per tabella preferiti; `#waypointModalPanel` per pulsanti azione compatti (allineati a Range Rings / saved tracks pattern).

## Vincoli rispettati

- **Nessuna** modifica a schema dati, **`state.favorites`**, **`state.lastResult`**, persistenza / **localStorage** (nessuna nuova chiave), **`loadFavorite`** / **`favoriteMapCenterTo`** semantica (Centra non usa `renderResults`).  
- **Non** toccati: SunCalc/WMM/OLC/QR, OPSEC/geocoding/tile/IndexedDB, Step 6B/6C/6D.  
- **Non** `finito`. **Monolite non committato** nell’autosync (solo memoria orchestratore).

## QA automatico

- `git status --short`: monolite modificato (`M coordinate_converter Claude.html`).  
- `git diff --stat`: ~366 righe toccate nel monolite (dettaglio in chat / `git diff`).  
- Nessun `<script src>`; nessun `type="module"`.  
- **2** `<script>` / **2** `</script>`.  
- **`node --check`** sui **due** blocchi estratti con `sed` (righe script 1: 9047–9173; script 2: 9177–39160): **OK**.

## Test browser

**Non eseguiti** in ambiente Cursor (nessun browser avviato). Checklist manuale consigliata: tab Preferiti IT, tabella + colonne + icone + tooltip, rename/note/centra/carica/elimina, Waypoint modal icone, Astro picker favoriti, Range Rings, cambio lingua IT/EN/FR, console pulita, clamp E.3 ancora ok.

## Git / commit memoria

- **Commit memoria orchestratore (solo `docs/orchestrator/**`):**  
  - **`818ab33`** — `docs: memoria Pass 6 Step 6A preferiti waypoint local` (`latest.md` + creazione inbox).  
  - **`98dfa2b`** — `docs: inbox Step 6A — hash commit memoria 818ab33` (riga hash in questo file).  
  - **`f4ad5c9`** — `docs: latest — hash commit memoria Step 6A (818ab33 + 98dfa2b)` (allineamento `latest.md` dopo follow-up inbox).  
  **Push:** tutti riusciti su `main`.  
- **`coordinate_converter Claude.html` escluso** da ogni commit memoria (policy + richiesta utente).

## Prossimo passo consigliato

1. Smoke manuale browser su Step 6A (checklist sopra).  
2. Eventuale fix da feedback.  
3. **Pass 6 Step 6B** (Mappe online/offline) oppure **`finito`** quando il monolite sia pronto per versionamento completo.
