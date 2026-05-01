# Pass 5 Step E — Astro favorite chooser (monolite solo locale)

**Data:** 2026-05-01  
**File toccato (solo locale, non nel commit memoria):** `coordinate_converter Claude.html`

## Cosa è stato fatto

- Sorgente Astro **`data-astro-src="favorite"`** nel pannello `#astroPanel` (testo `astro.src.favorite`, tooltip `tip.astro.src.favorite`).
- Dialog **`#astroFavoritePicker`**: ricerca, pulsante **Colonne** + popover (MGRS, Quando, Località, Note, Meta), tabella compatta, max **50** righe dopo filtro + ordinamento, pulsante **Usa** per riga.
- **`astroSetPosition("favorite", …)`** + **`astroSyncPosUI`**: origine posizione mostrata come favorito; **`runAstroPanelUI`** invariato (usa `state.astro.lat` / `lon`).
- Stato **transient** (nessun `localStorage` nuovo): `astroFavoritePickerOpen`, `astroFavPickerColsMenuOpen`, `astroFavPickerCols`, `astroFavPickerSort`.
- Funzioni: `astroEnsureFavPickerUiState`, `astroCloseFavColsPopover`, `astroToggleFavColsPopover`, `astroSyncFavColCheckboxes`, `astroSortFavPickerRows`, `astroIndexPickerFavorites`, `astroFillFavoritePicker`, `astroOpenFavoritePicker`, `astroCloseFavoritePicker`, `astroApplyFavoriteFromPicker`, `ensureAstroFavoritePickerWired`.
- **Mutua esclusione** con picker waypoint: apertura favoriti chiude waypoint e viceversa (`astroOpenFavoritePicker` / `astroOpenWaypointPicker`).
- **`astroSetSource`**, **`astroEnterPickCenterMode`**, **`closeAstroPanelCore`**: chiudono anche il picker favoriti.
- **Esc:** `bindHotkeys` + listener GIS — prima menu colonne favoriti, poi chiusura dialog (stesso schema waypoint).
- **`gisInit`**: `ensureAstroFavoritePickerWired()`; **`gisRefreshI18n`**: refresh picker favoriti se aperto.
- **CSS:** estesi i selettori Step D.2 a `dialog#astroFavoritePicker` (incluso hover su `th[data-astro-fav-sort]`).
- **i18n** IT/EN/FR: chiavi `astro.src.favorite`, `astro.fav.*`, `astro.notice.posFromFavorite`, `tip.astro.src.favorite`, `tip.astro.src.useFavorite`, `tip.astro.fav.columns`, `tip.astro.fav.sort`, ecc.

## Struttura favoriti rilevata (sola lettura)

- **`state.favorites[]`**: tipicamente `{ id, name, notes, lat, lon, createdAt, locality?, meta? }`; opzionali **`updatedAt`** se presenti da import/merge.
- **`loadStore`**: `Object.assign({}, f, …)` mantiene campi extra (es. `locality`) se presenti nel JSON salvato.
- **Validazione coordinate:** solo `Number.isFinite(lat)` e `Number.isFinite(lon)` dopo `Number(f.lat)` / `Number(f.lon)` + `normalizeLon` — allineato a **`rrIndexRrPickerFavorites`** / **`favoriteAddAsWaypoint`** (nessun parsing testuale aggiuntivo).

## Colonne

| Chiave stato | Obbligatoria | Note |
|--------------|--------------|------|
| `name`, `coord` | sì | sempre in tabella |
| `action` | sì | colonna **Usa** |
| `mgrs`, `when`, `locality`, `notes`, `meta` | opzionali | toggle nel popover **Colonne** |

## Ordinamento e ricerca

- Header ordinabili: nome, coordinate, MGRS, quando, località, note, meta — primo clic **asc**, secondo **desc**, indicatori ▲/▼, `aria-sort`.
- Flusso: **filtro ricerca** (stringa aggregata lower-case) → **sort** → **slice(0, 50)**; tie-break su **`id`**.
- Stringa **`search`**: id, nome, DD, mgrs, date formattate, ISO created/updated, locality, note, meta (type/raw), ecc.

## Non implementato (per vincolo prompt)

- **Mostra sulla mappa**; edit/delete/import/export favoriti da Astro; Favorite Manager; modifica **`state.favorites`**; **`state.lastResult`**; cronologia; permalink; **`renderResults`**; nuove chiavi **`localStorage`**; SunCalc/WMM/OLC/QR; OPSEC/tiles/IndexedDB.

## Test automatici (sessione)

- `git status --short`: atteso solo monolite modificato prima del commit memoria.
- Nessun `<script src>`; nessun `type="module"`; **2** `<script>` / **2** `</script>`.
- **`node --check`**: OK su **entrambi** i blocchi inline (estrazione non-greedy `<script>…</script>`).

## Test browser

**Non eseguiti** in ambiente Cursor (nessun browser automatizzato). Checklist manuale: aprire GIS → Astro → «Da favorito…» → colonne/sort/ricerca/Usa → Calcola; Esc su popover e dialog; verificare result/mapCenter/mapPick/waypoint e Range Rings.

## Git / commit memoria

- **Commit memoria (solo docs):** messaggio richiesto `docs: memoria Pass 5 Step E favorite chooser local` — **esclude** `coordinate_converter Claude.html`.
- **Motivo esclusione monolite:** richiesta esplicita utente (intervento locale / review prima del commit principale).

## Prossimo passo

Smoke manuale Step E; eventuale commit monolite quando autorizzato; **`finito`** a fine giornata se serve chiusura ufficiale.
