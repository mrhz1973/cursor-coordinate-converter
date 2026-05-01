# Pass 6 — Piano: standardizzazione liste modali GIS

**Tipo:** piano (nessuna implementazione in questo intervento).  
**Monolite:** `coordinate_converter Claude.html` — **non modificato** da questo salvataggio.  
**Contesto:** Pass 5 ha portato Astro/Favoriti/Waypoint verso UX GIS-first; Step E.3 ha reso Favoriti/Waypoint partial-offscreen (`partialMinVisible: 72` + `gisPanelClampRectPartialVisible`).

---

## 1. Sintesi decisionale

- **Allineamento liste:** portare **Preferiti** (oggi card `.favorite-item` + `.fav-actions` in `renderFavorites`) verso un modello **tabellare** simile a **Waypoint** (`renderWpModalList`, tabella `.wp-modal-table` con colonna azioni già intitolata tramite i18n `waypointModal.listColActions` → IT «Azioni»).
- **Azioni compatte:** prendere come **riferimento visivo e di markup** la colonna azioni di **Range Rings** (`renderRangeRingsList`, `#rrList`, `.rr-table`): pulsanti `.btn.btn-sm` con **icone** (`✎`, `⌖`, `✕`), `data-i18n-tip` / `data-i18n-aria` dove applicabile, `btn-danger-subtle` solo per elimina.
- **«Preferiti» in IT:** solo **etichette UI** (oggetto `i18n` IT + eventuali fallback HTML); **nessun** rename di `state.favorites`, chiavi persistenza, o nomi funzione `favorite*`.
- **Mappe online/offline:** il dialog **`#layersPanel`** ha già drag/resize e tabella aree in `renderOfflineAreasList`; oggi usa **clamp completo** (`gisPanelClampRect` in `clampLayersPanelRect`) e **`_layersPanelLayoutOpts` senza `partialMinVisible`**. Per coerenza con Pass 5 E.3: aggiungere **clamp parziale** (`partialMinVisible: 72`), **senza** toccare logica tile/IndexedDB oltre al posizionamento pannello.
- **Non inventare azioni:** conservare **↻ load converter** (`loadFavorite` → `renderResults`), **aggiungi waypoint**, **centra mappa** (`favoriteMapCenterTo` → `gisMapCenterOnLatLon`), **elimina**; per Traccia draft (`renderTrackPointsList`) oggi c’è solo **rimuovi punto** (`data-role="tp-rm"`); non aggiungere «centra per punto» se non esiste. Tracce **salvate** (`renderSavedTracksList`): Modifica / Centra / Elimina — compattare icone come RR **senza** cambiare handler `data-saved-*`.

**Riferimenti codice (monolite, linee indicative):**

- `gisPanelAttachDrag` / `partialMinVisible` in drag (~34508–34519); resize (~34614–34617).
- `clampLayersPanelRect` (~35829–35837); `_layersPanelLayoutOpts` (~35561–35577).
- `clampFavoritesPanelRect` (~35764–35777); `_favoritesPanelLayoutOpts` con `partialMinVisible: 72`.
- `renderFavorites` (~28928–29038); `renderWpModalList` (~36809–36985); `renderRangeRingsList` (~32317–32414); `renderOfflineAreasList` (~23463–23658); `renderTrackPointsList` (~25989–26099); `renderSavedTracksList` (~24241–24333).

---

## 2. Audit modal / liste

### A. Preferiti / Favoriti

| Aspetto | Evidenza |
|--------|----------|
| Modal principale | `#favoritesPanel` + `wireFavoritesPanelFloatingGis`; sezione `#sec-favorites` reparent in body; titolo `data-i18n="tabs.favorites"`. |
| Render lista | **`renderFavorites`**: crea `.favorite-item` per riga; **non** tabellare. |
| Campi | Nome (`input.fav-name-inp` inline rename), coordinate, località opzionale, meta data, `textarea` note a tutta larghezza. |
| Azioni attuali | `.fav-actions`: testo **Waypoint**, testo **Centra**, icona **↻** (load), **×** delete (`btn-danger`); delegati `data-fav-center`, `data-fav-waypoint`. |
| Centra | `favoriteMapCenterTo` — **non** usa `renderResults` (rispetta vincolo «non renderResults per semplice centra»). |
| Edit / delete | Rename su `change` + `window.confirm`; `removeFavorite` + `window.confirm`. |
| i18n | `tabs.favorites`, `sec.favorites`, `fav.*`, `tip.fav*`, picker waypoint, Astro `astro.fav.*`, help/tools. |

**Tipo lista:** card / list.

### B. Waypoint

| Aspetto | Evidenza |
|--------|----------|
| Modal | `#waypointModal`, `_waypointPanelLayoutOpts` con **`partialMinVisible: 72`**. |
| Render | **`renderWpModalList`**: `.wp-modal-table`; header `waypointModal.listColActions`. |
| Azioni riga | `data-role="wp-edit"`, `wp-zoom`, `wp-fav` (★), `wp-del` — attualmente **testo** su Modifica/Centra. |
| Centra | `waypointsZoomTo` → `gisMapCenterOnLatLon`. |

**Tipo lista:** tabellare.

### C. Range Rings (pattern di riferimento)

| Aspetto | Evidenza |
|--------|----------|
| Lista | **`renderRangeRingsList`**, `#rrList`, `.rr-table`. |
| Header azioni | `t("rangeRings.colActions")` → IT «Azioni»; `<th class="rr-th-actions ...">`. |
| Azioni riga | `.rr-row-actions`: `btn-rr-edit` (✎), `btn-rr-fly` (⌖), `btn-danger-subtle` ✕; `data-i18n-tip` / `data-i18n-aria`. |
| CSS | `#sec-rangerings .rr-table .rr-actions-cell`, `.rr-row-actions`, `.btn-rr-edit`, `.btn-rr-fly`. |
| Post-render | `syncI18nInRoot(root)` dopo innerHTML. |

**Tipo lista:** tabellare; azioni compatte a icona.

### D. Mappe online / offline (`#layersPanel`)

| Aspetto | Evidenza |
|--------|----------|
| Modal | `#layersPanel`; `wireLayersPanelFloatingGis`. |
| Lista | **`renderOfflineAreasList`** → `#offlineAreasList`, `.offline-areas-table`; header `offcache.list.colActions`. |
| Azioni riga | **Carica**, **Adatta** (testo), delete icona `btn-danger-subtle`. |
| Floating | `gis-panel-floating`, drag, resize handles. |
| Clamp | **`clampLayersPanelRect`** usa **`gisPanelClampRect`** (completo); `_layersPanelLayoutOpts` **senza** `partialMinVisible`. |

**Tipo lista:** tabellare.

### E. Traccia (`#trackModal`)

| Aspetto | Evidenza |
|--------|----------|
| Draft punti | **`renderTrackPointsList`**: `.track-point-row` card; `.tp-actions` solo **✕** `data-role="tp-rm"`; drag reorder. |
| Tracce salvate | **`renderSavedTracksList`**: `.saved-tracks-table`, colonna **«Azioni»** (`track.savedColActions`), bottoni testuali Modifica / Centra / Elimina. |

**Tipi lista:** draft = card; archivio = tabella.

### Riepilogo

- **Tabellari:** Waypoint, Range Rings, Aree offline, Tracce salvate.
- **Card:** Preferiti (`renderFavorites`), punti traccia draft (`renderTrackPointsList`).
- **Azioni reali Preferiti:** center map, add waypoint, load converter (`renderResults` — semantica da mantenere), delete, rename+note inline.
- **Non aggiungere** senza requisito: export per riga, visibilità favorito, centra su singolo punto traccia se assente.

---

## 3. Pattern Range Rings da riusare

- **Markup azioni:** `<td class="…-actions-cell"><div class="…-row-actions">` + `button.btn.btn-sm` + `<span aria-hidden="true">` icona + `data-i18n-tip` / `data-i18n-aria` (o `data-tip` + `aria-label` allineati).
- **Stile:** `btn-danger-subtle` + `.danger-x` per elimina.
- **Header:** `<th class="…-th-actions">` + chiave i18n per «Actions».
- **Post-render i18n scoped:** `syncI18nInRoot(root)` se si aggiungono `data-i18n-tip` dinamici.
- **Resize colonne:** riusare pattern sessione già presente (regola tabelle operative), **senza** localStorage dedicato alle larghezze.

---

## 4. Naming Preferiti / Favoriti (solo UI IT)

**Invariato:** `state.favorites`, persistenza, funzioni `favorite*`, id DOM come `favorites-list`, `favoritesPanel` (cambiare id sconsigliato).

**Aggiornare in IT (indicativo):** `tabs.favorites`, `tabs.favorites.tip`, `sec.favorites`, `fav.*`, `waypointModal.favoritesPicker*`, `astro.fav.*`, `astro.src.favorite` / tip, `tools.fav.desc`, `help.guide.fav.*` dove visibile.

**EN/FR:** Favorites / Favoris invariati salvo decisione team.

**Rischi:** incoerenza temporanea tra sezioni; mitigare con pass unico su chiavi IT.

---

## 5. Pattern colonna «Azioni»

- **Chiavi i18n:** riusare `waypointModal.listColActions`, `offcache.list.colActions`, `rangeRings.colActions`, `track.savedColActions` dove già presenti. Per tabella Preferiti nuova: es. **`fav.listColActions`** (IT «Azioni», EN «Actions», FR «Actions»).
- **Tooltip / ARIA:** ogni icona con `data-tip` o `data-i18n-tip` + `aria-label` coerente.
- **Testo sul bottone:** opzionale; preferire icone come RR su viewport stretti.
- **CSS:** scope sotto `#favoritesPanelBody` / `#sec-favorites` oppure classe condivisa **minima**; evitare regressioni RR con regole globali troppo larghe.
- **Danger:** solo elimina (e batch danger già nel toolbar offline).

---

## 6. Piano incrementale Step 6A / 6B / 6C / 6D

### Step 6A — Preferiti + Waypoint

- **File / regioni:** i18n IT (blocchi lingua); HTML `#sec-favorites`, `#favoritesPanel`; CSS `.favorite-item` / nuova tabella; **`renderFavorites`**; **`renderWpModalList`**; CSS `#waypointModalPanel .wp-modal-table .wp-row-actions`.
- **Non toccare:** `state.favorites`, persistenza, semantica `loadFavorite` (`renderResults` per convertitore); geocoding; tile.
- **Rischio:** migrazione card→tabella e note/rename UX.
- **Test:** `node --check` su JS estratto post-implementazione; smoke browser GIS.
- **Rollback:** revert `renderFavorites` + CSS + i18n.

### Step 6B — Mappe online/offline

- **File / regioni:** `_layersPanelLayoutOpts` (+ `partialMinVisible: 72`); **`clampLayersPanelRect`** → `gisPanelClampRectPartialVisible`; **`renderOfflineAreasList`** (bottoni Carica/Adatta compatti); CSS `.offa-actions`.
- **Non toccare:** download/cancel tile, IndexedDB, `state.namedAreas` schema.
- **Rischio:** pannello largo + strip 72px in viewport piccoli.
- **Test:** drag oltre bordo, recupero; resize; load/fit.
- **Rollback:** revert opts + clamp + CSS azioni.

### Step 6C — Traccia

- **File / regioni:** **`renderSavedTracksList`**; CSS `.saved-row-actions`; opzionale compattazione `.tp-actions` draft (solo se resta una azione — stile compatto senza forzare header «Azioni»).
- **Non toccare:** `state.track` / `state.savedTracks` schema; niente live GPS.
- **Rischio:** delegazione `data-saved-*` su mount.
- **Rollback:** revert stringhe HTML + CSS.

### Step 6D — QA UX finale

- i18n IT/EN/FR; mobile; Esc; focus/tooltip; RR e Astro smoke; console; `node --check`; nessun script esterno / `type="module"`.

---

## 7. Mappe online/offline — partial-offscreen

- **Possibile:** **Sì.** Stessa infrastruttura: `gisPanelAttachDrag` / `gisPanelAttachResize` rispettano `opts.partialMinVisible`; `clampLayersPanelRect` va allineato a **`gisPanelClampRectPartialVisible`** come `clampFavoritesPanelRect` / `clampRangeRingsPanelRect`.
- **Intervento minimo:** aggiungere `partialMinVisible: 72` a **`_layersPanelLayoutOpts`**; in **`clampLayersPanelRect`** sostituire `gisPanelClampRect` → **`gisPanelClampRectPartialVisible`**. Verificare altri clamp diretti con key `layers`.
- **Rischi:** pannello molto alto (`defaultHeightCap: 2000`); verificare `topbarReserve` vs altezza finestra.
- **Piano separato:** **No** (resta Step 6B).

---

## 8. Rischi

- `window.confirm` su Preferiti/rename vs standard notifiche in-pannello (debito UX, fuori scope minimo Pass 6).
- Tabella Preferiti + note: layout e accessibilità.
- CSS condiviso: regressioni RR/Waypoint se si globalizza troppo.
- Non confondere **`loadFavorite`** (`renderResults`) con **centratura** (`favoriteMapCenterTo` senza `renderResults`).

---

## 9. QA checklist (Pass 6 completo)

1. Preferiti: tabella (se implementata), colonna Azioni, icone + tooltip + aria, filtri/rename/note/load/center/waypoint/delete.
2. Waypoint: azioni compatte; modifica apre editor; centra non tocca `state.lastResult`.
3. Elimina: conferme esistenti; nessuna cancellazione tile non richiesta.
4. `favoriteMapCenterTo` / `waypointsZoomTo`: nessuna cronologia / permalink / `renderResults` per semplice centra.
5. `#layersPanel`: drag oltre bordo, recupero strip 72px; resize; lista aree; load/fit.
6. Traccia: saved list + (opz.) draft; nessuna regressione overlay.
7. Astro picker favoriti + RR: smoke.
8. i18n; mobile; Esc; console; `node --check`; monolite senza script esterni.

---

## 10. Raccomandazione finale

Eseguire **6A** prima (Preferiti ≈ Waypoint + lessico IT), poi **6B** (clamp layers + icone offline), poi **6C** (saved tracks + eventuale `tp-rm`), infine **6D** QA. Evitare refactor globale «una classe per tutte le tabelle»: preferire scope CSS mirati e helper locale minima se serve.

---

## 11. Prompt suggerito per implementare solo Step 6A

```text
Implementa SOLO Pass 6 Step 6A sul monolite `coordinate_converter Claude.html`:

1) UI italiana: sostituire le etichette utente «Favoriti/favorito/…» con «Preferiti/preferito/…» nel dizionario i18n **IT** (chiavi tabs.favorites, sec.favorites, fav.*, waypointModal.favoritesPicker*, astro.fav.* e astro.src.favorite dove visibile, tools/help se necessario). NON rinominare state.favorites, id DOM critici, né funzioni favorite*.

2) Lista Preferiti: avvicinare il modello a Waypoint — introdurre tabella in #favorites-list (o wrapper) con colonna finale intestata con nuova chiave i18n fav.listColActions (IT «Azioni», EN «Actions», FR «Actions»), colonne dati coerenti (nome, coordinate, quando, … senza cambiare schema dati). Area note: mantenere UX accessibile (sub-riga o cella dedicata).

3) Azioni riga Preferiti compatte (stile Range Rings in renderRangeRingsList): icone per modifica (focus/rename o equivalente senza cambiare semantica), centra (favoriteMapCenterTo), elimina (removeFavorite), mantenere azioni già esistenti: aggiungi waypoint, carica in convertitore (loadFavorite / ↻) con tooltip+aria. Usare btn-danger-subtle solo per elimina. Tooltip e aria-label sempre presenti.

4) Waypoint renderWpModalList: compattare Modifica/Centra/★/Elimina a icone+tooltip come RR, mantenere data-role e handler.

5) Verifiche: node --check su JS estratto; grep assenza script esterni; smoke manuale GIS.

NON implementare Step 6B/6C/6D. NON commit del monolite salvo richiesta esplicita. A fine intervento: autosync orchestratore come da regole progetto (se applicabile).
```
