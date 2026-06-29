# MAJOR-5A2-PLAN — GIS Object Workbench: selezione + highlight (session-only)

**Tipo:** piano tecnico read-only  
**Repo:** `mrhz1973/cursor-coordinate-converter`  
**HEAD atteso:** `3d184d3`  
**Runtime live:** `d74cbb7` · build 26  
**Riferimento piano padre:** `docs/orchestrator/inbox/2026-06-29_maj-5a-plan.md`

---

## 1. Stato attuale rilevato

### Git / workspace

| Verifica | Esito |
| --- | --- |
| Repo root | `C:/Users/mrhz/Documents/AI/GitHub/cursor-coordinate-converter` |
| Branch | `main` |
| `git status --short` | *(vuoto — workspace pulito)* |
| `git rev-parse HEAD` | `3d184d3077dc9e66b6e730d027fcdd8ab6efc218` |
| `git rev-parse origin/main` | `3d184d3077dc9e66b6e730d027fcdd8ab6efc218` |
| `git ls-remote origin main` | `3d184d3077dc9e66b6e730d027fcdd8ab6efc218` |

**Conferma read-only:** nessun file modificato, nessun commit, push, deploy o `finito`.

### Documenti letti

1. `README.md` (bootloader + read-set)
2. `docs/OPERATING_MEMORY.md` §7 (MAJOR-5A1 CLOSED; prossimo 5A2)
3. `docs/work-units/WU-0005-0009-roadmap.md` (sezione MAJOR-5A1)
4. `docs/HANDOFF.md` (snapshot `d74cbb7`, build 26)
5. `docs/orchestrator/inbox/2026-06-29_maj-5a-plan.md` (sequenza 5A1→5A2→5A3)
6. `docs/orchestrator/latest.md` (header MAJOR-5A1 CLOSED)
7. `coordinate_converter Claude.html` — regioni workbench e overlay mappa

### Regioni 5A1 nel monolite

| Area | Linee approx. | Contenuto |
| --- | --- | --- |
| CSS workbench | ~8159–8272 | `#gisWorkbenchPanel`, `.wb-row`, toolbar filtri |
| HTML dialog | ~11469–11505 | `#gisWorkbenchPanel`, lista, status, resize |
| i18n | ~13936+, ~15769+, ~17548+ | chiavi `workbench.*` IT/EN/FR |
| JS core | ~51483–51855 | `workbenchCollectRows`, `renderWorkbenchList`, fly-to, wire |
| Toolbar mappa | ~35703, ~37773, ~38400 | `[data-role="workbench-open"]` |
| State init | ~18086 | `workbenchPanelOpen: false` (transiente, non in `saveStore`) |

### Funzioni chiave 5A1

- `ensureWorkbenchState()` — inizializza `state._workbench = { filterKind, search, selected: null }`; **valida `selected` ma non lo usa in UI**
- `workbenchCollectRows()` — adapter read-only su `mapWaypoints[]`, `savedTracks[]`, `gisPolygons[]`
- `workbenchFilterRows()`, `renderWorkbenchList()`, `syncWorkbenchFilterChips()`
- `workbenchFlyToRow()` → `waypointsZoomTo` / `flyToSavedTrackById` / `polygonShowOnMapFromList`
- `workbenchOpenNativePanel()` → modali nativi
- `openGisWorkbenchPanel()` / `closeGisWorkbenchPanel()` / `wireGisWorkbenchPanelOnce()`

### Oggetti supportati (invariato 5A1)

- Waypoint (`kind: "waypoint"`, id da `mapWaypoints[]`)
- Tracce salvate (`kind: "savedTrack"`, id da `savedTracks[]`)
- Poligoni GIS (`kind: "polygon"`, id da `gisPolygons[]`)

**Esclusi:** `state.track` draft, `gisTracks[]`, range rings, `gisLayers[]` come righe catalogo.

---

## 2. Obiettivo 5A2 consigliato

### Minimo utile (MVP 5A2)

1. **Click riga workbench** (area non-azione) → imposta selezione session-only `{ kind, id }`.
2. **Riga evidenziata** (`.wb-row.is-selected`, `aria-selected="true"`).
3. **Highlight mappa temporaneo** coerente con la selezione (ring/glow per tipo).
4. **⌖ fly-to resta separato** — non sostituito dal click selezione (evita salti involontari).
5. **Deselezione** — click riga già selezionata, Esc (se nessun pick mode), chiusura pannello, o oggetto rimosso.

### Cosa NON deve fare 5A2

- Delete, rename, edit geometria, import/export workbench.
- Nuovo schema persistito; scrittura in `saveStore` / `loadStore`.
- Pick mappa → lista **nel primo runtime** (rinviato a sottoblocco 5A2b/5A2c se non in bundle unico).
- Unificare selezioni batch waypoint (`_waypointsSelectedIds`) o tracce (`_savedTracksSelectedIds`).
- Usare `state.gisSelection[]` così com'è.

### Perché è utile all'operatore

- Orientamento tattico: «quale oggetto sto guardando» senza aprire tre modali separati.
- Base per 5A3+ (azioni delegate, batch leggere) e per sync bidirezionale futura.
- Rischio contenuto se si parte **lista → mappa** prima del pick mappa.

---

## 3. Inventario conflitti modalità mappa

| Modalità / flag | Area codice | Rischio | Guardia necessaria | Decisione |
| --- | --- | --- | --- | --- |
| `state.waypointPickMode` | ~36021+, pan `onUp` ~38976 | **Alto** — click mappa aggiunge WP | `workbenchCanMapPick()` → false; non intercettare click WP handle in pick workbench | Pick workbench **mutuamente esclusivo** |
| `state.track.pickMode` / `trackMapPickEditingActive()` | ~38817, ~38975 | **Alto** — click aggiunge vertici traccia | Stessa guardia | Escluso durante track pick |
| `state.polygonDrawMode` | ~50811+, pan ~38919 | **Alto** — click aggiunge vertici poligono | Guard + messaggio in `#gisWorkbenchStatus` | Escluso durante draw |
| `polygonIsEditing()` / `state._polyEdit` | ~34244+, pan ~18787 | **Alto** — drag vertici/move | Guard | Escluso durante edit poligono |
| `state.mapPickMode` (converti) | ~38818 | Medio | Guard | Escluso |
| `state.rangeRingsPickCenterMode` / `PickAndCreateMode` / `_rrEditingMoveCenterMode` | ~38834, ~26004 | **Alto** | Guard | Escluso |
| `state.astroPickCenterMode` | ~38818, ~39069 | Medio | Guard | Escluso |
| `state._bboxSelecting` / offline bbox | ~38836, CSS ~1691 | **Alto** | Guard | Escluso |
| Misura GIS (`measurePanelOpen`, measure flow) | ~18344 | Medio — click misura | Guard se measure pick attivo | Escluso |
| Drag waypoint `.wpt-handle` | ~36861 | Medio — conflitto tap vs drag | Pick workbench: solo se pick mode esplicita + soglia movimento | Waypoint map pick **solo in 5A2b+** |
| Pan/zoom/wheel | `attachPanHandlers` ~38858 | Basso per **solo highlight** da lista | Highlight non altera handler pan | OK per 5A2a |
| Saved track overlay click | ~34103 `pointer-events:auto` | Medio — stroke cattura click vs pan | Pick esplicito + `!drag.moved` + stopPropagation | **5A2b** |
| Poligoni overlay `pointer-events:none` | ~34200, ~34232 | **Bloccante** per pick diretto | Hit layer dedicato o pick per prossimità | **5A2c** |
| Selezione batch nativa (`_savedTracksSelectedIds`, waypoint modal checkbox) | liste native | Basso se separata | `_workbench.selected` **indipendente** | Non mescolare stati |

**Funzione consigliata:**

```javascript
function workbenchMapInteractionBlocked(){
  if (state.waypointPickMode) return "waypointPick";
  if (state.track && state.track.pickMode) return "trackPick";
  if (state.polygonDrawMode) return "polygonDraw";
  if (typeof polygonIsEditing === "function" && polygonIsEditing()) return "polygonEdit";
  if (state.rangeRingsPickCenterMode || state.rangeRingsPickAndCreateMode || state._rrEditingMoveCenterMode) return "rangeRings";
  if (state.mapPickMode || state.astroPickCenterMode) return "otherPick";
  if (state._bboxSelecting) return "bbox";
  // + measure pick se flag dedicato esiste
  return null;
}
```

---

## 4. Design selezione session-only

### Forma consigliata di `state._workbench`

Estendere l'oggetto già presente (non persistito):

```javascript
state._workbench = {
  filterKind: "all" | "waypoint" | "savedTrack" | "polygon",
  search: string,
  selected: null | { kind: string, id: string },  // già scaffold 5A1
  pickMode: false   // NEW — solo per sottoblocco map→list
};
```

**Non introdurre** campo `highlight` separato nel MVP: `selected` guida sia riga che mappa. Se serve flash temporaneo (es. dopo fly-to ⌖), usare classe CSS transiente `.is-wb-flash` con timeout — non secondo id persistito.

### Cosa non persistere

- `_workbench` intero
- `workbenchPanelOpen` (già transiente; opzionale persist UI layout via `gPanelLayouts` esistente — **non** selezione)
- Qualsiasi highlight overlay state oltre `selected`

### Evitare saveStore / loadStore

- `saveStore()` (~19182) **non** include `_workbench` né `workbenchPanelOpen` — **mantenere così**.
- `loadStore()` non re-idrata selezione — al boot `ensureWorkbenchState()` → `selected: null`.
- Dopo mutazioni waypoint/track/polygon che rimuovono id: `workbenchPruneSelection()` in `renderWorkbenchList` o post-delete hooks esistenti (5A2 solo validazione, no delete UI).

### Preservare store canonici

- `state.mapWaypoints[]` resta fonte waypoint; adapter solo lettura.
- Nessuna duplicazione geometrie in `_workbench`.

---

## 5. Design highlight

### Opzioni valutate

| Opzione | Pro | Contro | Rischio | Implementabilità |
| --- | --- | --- | --- | --- |
| **A — Solo riga `.is-selected`** | Trivial, zero regressione mappa | Poco valore tattico su mappa | Basso | Alta |
| **B — Riga + fly-to automatico** | Oggetto subito visibile | Conflitto con ⌖ esplicito; salti fastidiosi | Medio UX | Alta |
| **C — Overlay session dedicato** | Isolato; no refactor renderer | Duplica geometria; sync pan/zoom | Medio | Media |
| **D — Hook renderer esistenti** | Un solo redraw pipeline | Tocca 3 renderer; regressioni visive | Medio | Media-alta |
| **E — Minimo: riga + fly-to manuale ⌖** | Già 5A1 | Non soddisfa obiettivo 5A2 | — | — |

### Scelta consigliata per 5A2: **D (hook renderer) + A (riga)**

Motivo: `renderTileMap` già richiama `renderMapWaypointsOverlay`, `renderSavedTracksOverlays`, `renderGisPolygonsOverlay` — aggiungere branch «se `workbenchIsSelected(kind,id)`» è coerente con pattern `.is-selected` già usati altrove.

**Highlight per tipo:**

| Tipo | Implementazione |
| --- | --- |
| **Waypoint** | Classe `.is-wb-highlight` su `.wpt-handle` + CSS: anello SVG `circle` extra r=20 stroke accent, o `filter: drop-shadow` |
| **Traccia salvata** | Su `[data-saved-map-hit]` matching id: `stroke-width` maggiore + `filter: drop-shadow` (estende hover CSS ~9222) |
| **Poligono** | Su `<polygon>` matching id: attributo `data-gis-poly-id` + stroke più spesso / dash accent (fill invariato) |

**Refresh:** `workbenchSetSelection(kind, id)` → `renderWorkbenchList()` + `refreshTileMapForTrackUi()` o `renderTileMap` con viewCenter corrente (no pan forzato).

**Deselezione mappa:** clear classi al re-render (overlay ricreati ogni frame mappa).

---

## 6. Design lista → mappa

### Interazione click riga

- **Target:** click su `.wb-row` esclusi `[data-wb-fly]`, `[data-wb-open]`, input.
- **Toggle:** stesso `{kind,id}` → `selected = null`.
- **Handler:** estendere listener in `wireGisWorkbenchPanelOnce` (~51837).

### Pulsante seleziona (opzionale)

Non obbligatorio se click riga basta; se si aggiunge per accessibilità: icona secondaria `.wb-select-btn` — evitare proliferazione; **preferire click riga + `aria-selected`**.

### Mantenere ⌖ distinto

- `[data-wb-fly]` continua a chiamare `workbenchFlyToRow` **senza** cambiare selezione (comportamento 5A1) **oppure** opzione UX: ⌖ seleziona **e** centra — **consiglio: ⌖ solo fly-to; click riga solo selezione+highlight** (due gesti chiari).

### UI stato / conteggio

- `#gisWorkbenchCount` resta `{shown} / {total}`.
- Opzionale riga status: `workbench.selectedHint` i18n «Selezionato: {name}» in `#gisWorkbenchStatus` (non errore).
- `role="listbox"` + `aria-activedescendant` se si vuole accessibilità piena — minimo: `aria-selected` per riga.

### Scroll / focus

- Dopo selezione programmatica (futuro map→list): `row.scrollIntoView({ block: "nearest", behavior: "smooth" })`.
- Per lista→mappa: scroll non richiesto; focus resta su riga se keyboard nav (future).

---

## 7. Design mappa → lista

### Verdetto: **NON nel primo runtime MAJOR-5A2** (solo 5A2a)

**Motivazione:**

1. **Poligoni:** overlay `pointer-events:none` (~34200) — zero hit target; serve layer pick o algoritmo point-in-polygon on click mappa vuota.
2. **Waypoint:** `.wpt-handle` usa `pointerdown` per drag (~36861); tap singolo competerebbe con pan; oggi solo `contextmenu` (~36884).
3. **Tracce salvate:** hit target esistono (`data-saved-map-hit`, CSS ~9206) ma solo `contextmenu` (~34104); aggiungere click richiede pick mode + anti-pan (`!drag.moved`).
4. **Conflitti** tabella §3 — pick implicito senza toggle rischia regressioni track/waypoint/polygon.

### Se incluso in fase successiva (5A2b / 5A2c)

| Fase | Scope | Pick mode |
| --- | --- | --- |
| **5A2b** | Toggle «Seleziona da mappa» in toolbar workbench; waypoint + traccia salvata | **Esplicito** (`state._workbench.pickMode`); Esc disattiva |
| **5A2c** | Poligoni: hit-test point-in-polygon su click (no pointer-events su fill) o marker centro cliccabile solo in pick mode | Stessa guardia |

**Guardie:** `workbenchMapInteractionBlocked()`; feedback `#gisWorkbenchStatus` con chiave `workbench.pickBlocked`; pan handler early-return se pick mode workbench attivo e hit valido.

**Proposta fase successiva:** **MAJOR-5A2b** (map pick WP + traccia) separato da **MAJOR-5A2c** (poligoni).

---

## 8. Sequenza runtime consigliata

### MAJOR-5A2a — Lista → highlight mappa (primo deploy)

| | |
| --- | --- |
| **Scope** | Selezione riga; `.is-selected`; highlight renderer; prune selection; Esc clear selection |
| **Funzioni** | `workbenchSetSelection`, `workbenchClearSelection`, `workbenchIsSelected`, tweak `renderWorkbenchList`, 3 overlay renderers, CSS `.wb-row.is-selected`, `.is-wb-highlight` |
| **Rischio** | **Basso** |
| **Review** | **ROUTINE** |
| **QA** | Click riga WP/traccia/poligono; highlight visibile; ⌖ separato; filtri OK |

### MAJOR-5A2b — Pick mappa esplicito (WP + traccia)

| | |
| --- | --- |
| **Scope** | Toggle pick mode; click hit → `workbenchSetSelection` + scroll riga; guard conflitti |
| **Funzioni** | `workbenchCanEnablePickMode`, wire map click (saved overlay + wpt tap), i18n hint, Esc |
| **Rischio** | **Medio** |
| **Review** | **DELICATO leggero** — checklist conflitti |
| **QA** | Pick WP/traccia; no conflitto track pick; pan OK fuori pick |

### MAJOR-5A2c — Pick poligoni (opzionale stesso programma)

| | |
| --- | --- |
| **Scope** | Point-in-polygon o centroid hit layer |
| **Rischio** | **Medio-alto** |
| **Review** | DELICATO leggero |
| **QA** | Pick poligono; draw/edit poligono incompatibile |

**Bundling metodo:** 5A2a **deploy singolo** (come 5A1). 5A2b+5A2c possono bundle se gate unico superato.

---

## 9. Primo runtime consigliato

**MAJOR-5A2a** (o etichetta operatore **MAJOR-5A2** se scope ridotto esplicitamente nel prompt):

- Selezione **lista → mappa** + highlight session-only.
- **Senza** click mappa → lista.
- **Senza** delete/rename/edit.
- `APP_BUILD_NUM` → **27**.
- Regioni: ~51483–51855 workbench + CSS ~8220 + renderer overlay ~36798, ~34075, ~34177.

---

## 10. Gate e review

| Classificazione | 5A2a | 5A2b/5A2c |
| --- | --- | --- |
| Bundle | **ROUTINE** | **DELICATO leggero** (interazione mappa) |
| Review Claude pre-deploy | Non richiesta | Checklist conflitti pick (GPT sostitutiva se Claude indisponibile) |
| `node --check` | Obbligatorio | Obbligatorio |
| `git diff --check` | Obbligatorio | Obbligatorio |
| Scope vietato | saveStore, sanitizer, tile, OPSEC, import/export | Idem |

**Checklist diff 5A2a:**

- Nessuna chiave nuova in `saveStore` payload
- Nessun `<script src>` / module
- Solo regioni workbench + CSS highlight + hook overlay
- i18n nuove chiavi minime IT/EN/FR (`workbench.selected`, `workbench.clearSelection`, hint opzionale)

---

## 11. QA operatore proposta (runtime 5A2a)

```text
Il deploy tecnico di MAJOR-5A2a è PASS: monolite build 27 su VPS; HEAD atteso post-deploy; node --check OK; scope saveStore/tile/OPSEC invariato.

Ora serve solo la QA operatore minima, senza Cursor.

Apri: http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=<SHA-runtime>

Poi:
1. Apri Oggetti GIS (workbench) dalla toolbar mappa.
2. Con almeno un waypoint, una traccia salvata e un poligono visibile, clicca la riga (non ⌖ né ↗) per ciascun tipo.
3. Premi ⌖ su un'altra riga e verifica che centra senza obbligare selezione (o viceversa, secondo implementazione concordata).
4. Cambia filtro tipo e ricerca; verifica che selezione invalida si azzera o si aggiorna senza errori.
5. Chiudi workbench e riapri; verifica selezione non persistita dopo reload pagina.
6. Con workbench aperto, pan/zoom/wheel sulla mappa; verifica nessuna regressione.
7. Apri modal waypoint/tracce/poligoni nativi; verifica nessuna interferenza.

Verifica che:
- Riga selezionata visivamente distinta (`.is-selected`).
- Highlight mappa visibile per WP/traccia/poligono selezionato.
- Nessun draw/edit/delete attivato dal workbench.
- Filtri e ricerca 5A1 ancora OK.

Riportami: QA MAJOR-5A2a PASS operatore oppure messaggio errore e punto di occorrenza.
```

---

## 12. Non-goals

Confermati fuori scope MAJOR-5A2:

- MAJOR-2E, MAJOR-3, MAJOR-4
- Delete, rename, edit geometria, import/export workbench
- Mission package, schema persistente nuovo
- OPSEC, fetch, proxy, geocoding, tile, cache, IndexedDB
- `gisTracks[]` in catalogo (solo analisi futura)
- Range rings in catalogo (5A4 opzionale nel piano padre)
- Micro-polish cosmetico non funzionale
- Refactor >50 linee architetturali
- Riutilizzo `state.gisSelection[]` senza `{kind,id}`

---

## 13. Bozza prompt runtime futuro

**BOZZA — NON ESEGUIRE ORA**

```
=== INIZIO PROMPT CURSOR ===

BLOCCO: MAJOR-5A2a — Workbench selezione lista + highlight mappa (session-only)

Obiettivo: implementare selezione operatore click riga → state._workbench.selected + highlight riga e mappa; ⌖ fly-to resta azione separata; nessun pick mappa → lista.

Vincoli: singolo file coordinate_converter Claude.html; vanilla JS; no saveStore changes; no delete/rename/edit; APP_BUILD_NUM 27; bundle ROUTINE; commit+push+deploy GIS-only; stop per QA.

Task:
1. workbenchSetSelection / workbenchClearSelection / workbenchIsSelected / workbenchPruneSelection
2. renderWorkbenchList: .is-selected, aria-selected; click riga (esclusi ⌖ ↗)
3. Hook highlight in renderMapWaypointsOverlay, renderSavedTracksOverlays, renderGisPolygonsOverlay (+ data-gis-poly-id su polygon se manca)
4. CSS .wb-row.is-selected, .is-wb-highlight
5. Esc: clear selection se workbench aperto e pickMode false
6. closeGisWorkbenchPanel: optional clear selection
7. i18n workbench.selected / workbench.clearSelection IT EN FR
8. node --check, git diff --check, deploy VPS, QA minima narrativa

Non-goals: map pick mode, gisTracks, range rings, azioni distruttive.

Coda: finito pre-autorizzato dopo QA MAJOR-5A2a PASS operatore.

=== FINE PROMPT CURSOR ===
```

---

## Controlli finali piano

- **File modificati:** nessuno (al momento della redazione Plan mode)
- **`git status --short`:** vuoto (al momento della redazione Plan mode)
- **Limiti analisi:** nessun test browser runtime; comportamento pan vs tap waypoint non verificato live; misura GIS pick flags non enumerati exhaustively oltre grep statico.
