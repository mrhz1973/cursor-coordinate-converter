# TRACK-PROFILE-POINTS-DISPLAY-A — Piano tecnico (docs-only)

**Stato task:** BACKLOG / NON APERTO  
**Gate:** TRACK-PROFILE-POINTS-DISPLAY-A PLAN READY — RUNTIME NOT OPENED  
**Data piano:** 2026-07-31 23:46 (locale)  
**Opzione selezionata:** **B** — overlay read-only punti Saved Track attiva, decimazione uniforme per distanza cumulativa (budget max 120)  
**Classificazione futuro runtime:** DELICATO leggero (lifecycle + overlay GIS)  
**Review downstream pre-deploy:** OBBLIGATORIA  
**Monolite in questo intervento:** non toccato

---

## 1. Baseline

| Campo | Valore |
|---|---|
| Branch | `main` |
| HEAD | `62808f47e8c1bc563abe90c7a50fa998ee96d6e6` |
| origin/main | `62808f47e8c1bc563abe90c7a50fa998ee96d6e6` |
| ls-remote `refs/heads/main` | `62808f47e8c1bc563abe90c7a50fa998ee96d6e6` |
| Workspace | pulito |
| Runtime monolite autorevole | `da3397b8658a46dd2689f26dc79ec12ad48b0461` |
| Blob monolite | `f028f390c46f306b18177b535c1d0fd09c36872c` |
| Byte LF | `3139603` |
| SHA-256 LF | `49d4db86ca68545a78374f5ffd43ec0339f7e7668f0c5c2d7abde7f19df024cb` |
| Build | `B6.2BL-A-FIX1 · build 88` |
| Ultimo blocco CLOSED | APP-BUILD-LABEL-UX-A (+ FIX1) CLOSED / PASS |

HEAD = origin/main = ls-remote confermati. Monolite invariato rispetto al tip runtime autorevole.

---

## 2. Stato del task

**TRACK-PROFILE-POINTS-DISPLAY-A — BACKLOG / NON APERTO**

- Obiettivo registrato: overlay punti quando si apre il Profilo di una Saved Track; visualizzazione read-only; nessuna modifica geometrica; non mescolare con ROUTING-PROFILE-EDIT-A.
- Questa fase: **solo** pubblicazione del piano tecnico docs-only.
- **Non** implementare runtime, **non** modificare monolite / build / storage / dati, **non** deploy, **non** `finito`.
- OM / HANDOFF / QA-CHECKLIST / WU-0010 / roadmap: **non** aggiornati in questo intervento (task resta backlog).

---

## 3. Diagnosi runtime (funzioni e regioni reali)

File: `coordinate_converter Claude.html` (blob `f028f39`).

| Funzione / simbolo | Regione ~ | Ruolo |
|---|---|---|
| `ensureSavedTrackElevationViewState` | ~36735 | Stato transiente `state._savedTrackElevationView = { trackId, hover, layout, runtimeProfile, geometryCache }` — non persistito |
| `savedTrackClearElevationView` | ~36882 | Cleanup primario: ResizeObserver, cache, marker sync, sezione nascosta, reset view |
| `savedTrackBuildRuntimeElevationProfile` | ~36998 | Addon → samples runtime con lat/lon interpolati |
| `savedTrackBuildGeometryCumCache` | ~36914 | Cache `{ geo, cum, total }` su `st.points` con unwrap antimeridiano |
| `openSavedTrackElevationProfile` | ~37752 | Set `view.trackId`, apre modal, disarm pickMode (FIX3), render sezione |
| `closeSavedTrackElevationProfile` | ~37793 | Delega a `savedTrackClearElevationView` |
| `renderSavedTrackElevationSection` | ~37584 | Stati `is-unavailable` / `is-stale` / `is-partial` / `is-valid`; chart; hover |
| `renderSavedTracksList` | ~42230 | CTA Profilo; su lista vuota chiude profilo |
| `renderSavedTracksOverlays` | ~42485 | Rebuild `.saved-tracks-overlay` (svg); coda `savedTrackUpdateElevationSyncMarkerOnly` |
| `savedTrackUpdateElevationSyncMarkerOnly` | ~37188 | Marker hover `.saved-track-elevation-sync-marker` |
| `savedTrackRemoveElevationSyncMarker` | ~36873 | Remove idempotente marker hover |
| `routingAltitudeOnMapHover` | ~64313 | Dispatcher map-hover owner-aware |
| `routingAttachAltitudeMapHoverOnce` | ~64363 | Bind pointermove una sola volta |
| `elevationProfileMapSyncOwner` | ~64189 | `"routing" \| "saved-track" \| "none"` |
| `savedTrackElevationMapHoverActive` | ~37106 | Predicato hover map attivo |
| `savedTrackElevationSectionOpen` | ~37096 | Sezione aperta + `view.trackId` |
| `savedTrackElevationIsStale` | ~37086 | `geometryHash` vs hash corrente |
| CSS `.saved-track-elevation-sync-marker` | ~9133 | Hover marker stile |
| HTML `#trackSavedElevationSection` | ~11886 | Sezione profilo nel modal Tracce |
| Cleanup già wired | `_closeTrackModalCore` ~67234; `deleteSavedTracksByIds` ~41049; `prepareUiBeforeAppFullReset` ~29116; lista vuota ~42240 | |

Helper riusabili: `trackPointsToMapPx`, `trackLinePointsForMapRender`, `trackLonsUnwrapTransient`, `trackLonsAlignToView`, `tileMapLatLonToPxUnwrapped`, `routingTileLayerTranslatePx`, `savedTrackBuildGeometryCumCache`.

Caps: `TRACK_POINTS_CAP = 2000`, `SAVED_TRACKS_CAP = 50`.

---

## 4. Modello dati reale

### Geometria canonica — `st.points[]`

- Elementi: `{ lat, lon, ele?, name?, desc?, time? }` — `ele` **opzionale**.
- Cap: 2000 (`TRACK_POINTS_CAP`).
- Fonte autoritativa della geometria della Saved Track.
- **Questo è l’input dell’overlay punti (opzione B).**

### Addon elevation — `st.elevationProfile` (opzionale, persistito)

- Schema `SAVED_TRACK_ELEVATION_SCHEMA`, source `routing`.
- Campi: `geometryHash`, `pointCount`, `totalDistM`, `completeProfile`, `summary`, `runs[]` con `{ d, e }`.
- **Non** contiene lat/lon per campione; lat/lon del sample runtime sono interpolati sulla geometria.
- Numero sample ≠ `st.points.length` (campionamento GraphHopper).
- **Non** è la fonte dei marker fissi; **non** va modificato dalla feature.

### Distinzione strutturale

Vertici geometrici (max 2000, lat/lon nativi) ≠ sample profilo addon (d/e). L’overlay punti legge solo la geometria; la **visibilità** dell’overlay è legata al lifecycle del Profilo (non diventa una modalità generale di visualizzazione tracce).

---

## 5. Confronto opzioni A / B / C / D

| Opzione | Descrizione | Esito |
|---|---|---|
| **A** | Tutti i vertici canonici (fino a 2000) | **Respinta** — leggibilità e DOM/SVG pessimi su tracce dense/mobile |
| **B** | Subset decimato per distanza cumulativa, max 120, primo/ultimo sempre | **SELEZIONATA** |
| **C** | Solo punti semanticamente significativi | **Respinta** — il modello non marca start/end/summit in modo affidabile; inventerebbe semantica |
| **D** | Nessun marker fisso; solo hover esistente | **Respinta** — non implementa la visualizzazione dei punti richiesta dal backlog |

---

## 6. Opzione B selezionata

Overlay SVG read-only dei punti della **sola** Saved Track attiva (`state._savedTrackElevationView.trackId`), alimentato da `st.points[]`, session-only, budget **120**, decimazione **per distanza cumulativa**, primo e ultimo sempre inclusi.

Nomi proposti (adattabili al codice, ma distinti dal marker hover):

| Simbolo | Ruolo |
|---|---|
| `SAVED_TRACK_PROFILE_POINTS_BUDGET` | Costante = 120 |
| `savedTrackBuildProfilePointSubset(st)` | Helper puro → array indici/punti decimati |
| `savedTrackAppendProfilePointsOverlay(svg, st, …)` | Append `<g class="saved-track-profile-points-overlay">` |
| `savedTrackRemoveProfilePointsOverlay()` | Remove idempotente |
| `.saved-track-profile-points-overlay` | Gruppo SVG |
| `.saved-track-profile-point` | Singolo cerchio |

**Non** confondere con `.saved-track-elevation-sync-marker` (hover).

---

## 7. Motivazione del rifiuto di D

Il backlog richiede di **mostrare i punti** della traccia all’apertura del Profilo. L’opzione D (solo rafforzamento hover) non crea alcuna visualizzazione dei vertici: lascia solo il marker puntuale già esistente. Non soddisfa il contratto registrato. Resta documentata nel confronto storico, **non** come raccomandazione né fallback preferito.

---

## 8. Algoritmo di decimazione per distanza (obbligatorio)

**Non** usare campionamento uniforme per indice come strategia principale.

Motivo pratico: il campionamento per indice sovrarappresenta le zone in cui GPX/KML hanno molti vertici ravvicinati; il campionamento per distanza produce una distribuzione visiva più uniforme lungo la traccia.

### Passi deterministici

1. Filtrare solo punti con `lat`/`lon` finite e valide; mantenere ordine originale; tenere gli indici originali.
2. Se `nValid ≤ SAVED_TRACK_PROFILE_POINTS_BUDGET` (120) → restituire tutti.
3. Se `nValid > 120`:
   - Ottenere / riusare la cache di distanza cumulativa tramite **`savedTrackBuildGeometryCumCache(st)`** (già esistente: unwrap + Vincenty/haversine). **Non** duplicare formule geodetiche.
   - Sia `total = cache.total`, `cum[i]` distanza cumulativa del vertice valido i-esimo.
4. Creare `budget` target equidistanti: `t_k = k * total / (budget - 1)` per `k = 0 … budget-1`.
5. Per ogni target, scegliere il vertice valido con `|cum[i] - t_k|` minimo (nearest).
6. Garantire indici **strettamente crescenti**: se il nearest sarebbe ≤ ultimo già scelto, avanzare al successivo indice valido disponibile; se non esiste, saltare quel target.
7. Eliminare duplicati.
8. Forzare inclusione di **primo** e **ultimo** vertice valido (se non già presenti, sostituire / inserire agli estremi rispettando budget).
9. Clip finale: lunghezza ≤ 120.
10. La decimazione **non altera** `st.points` (sola lettura → nuovo array di indici o copie shallow lat/lon per render).

### Fallback distanza totale nulla / non calcolabile

Se `cache` è null, o `total ≤ 0`, o meno di 2 punti validi dopo filtro:

- Se `nValid ≤ 120` → tutti i validi (già coperto).
- Se `nValid > 120` e `total` non usabile: fallback **deterministico per indice uniforme** `round(k * (nValid-1) / (budget-1))` con primo/ultimo forzati, indici unici crescenti. Documentato come degrado, non come path principale.
- Se `nValid < 1` → array vuoto (nessun marker).

---

## 9. Contratto funzionale

| Aspetto | Contratto |
|---|---|
| Quando compare | Solo con Profilo Saved Track aperto e in stato **valid** o **partial** |
| Quale traccia | `state._savedTrackElevationView.trackId` → `state.savedTracks.find(...)` |
| Quali punti | Subset di `st.points[]` (geometria canonica), max 120, distance-decimated |
| Drag / click / selezione | Assenti (`pointer-events:none`) |
| Modifica geometrica | Assente |
| Scrittura storage | Assente (`saveStore` non nel path) |
| Addon elevation | Immutato |
| Label permanenti | Nessuna |
| Hover esistente | Mantenuto; disegnato **sopra** i punti fissi |
| Session-only | Sì; nessun nuovo campo persistito |
| Preferenze persistite | Nessuna |
| i18n | Nessuna chiave nuova (nessun testo UI nuovo) |

---

## 10. Stati profilo — predicati reali e visibilità overlay

Da `renderSavedTrackElevationSection` (~37584):

| Stato UI | Condizione codice | Classi CSS | Overlay punti B |
|---|---|---|---|
| **unavailable** | `!st.elevationProfile` **oppure** `!runtime.meta.hasAnyElevation` | `is-unavailable` | **NON visibile** |
| **stale** | `savedTrackElevationIsStale(st)` (`geometryHash !== savedTrackGeometryHash(st)`) | `is-stale` | **NON visibile** |
| **partial** | runtime ok e `!runtime.meta.completeProfile` | `is-partial` | **visibile** |
| **valid** | runtime ok e `runtime.meta.completeProfile` | `is-valid` | **visibile** |
| **chiuso** | `!savedTrackElevationSectionOpen()` (`sec.hidden` o `!view.trackId`) | sezione `hidden` | **NON visibile** |

### Predicato esatto proposto per il futuro runtime

```text
savedTrackProfilePointsOverlayShouldShow() ≡
  savedTrackElevationSectionOpen()
  && sectionEl presente
  && !sectionEl.classList.contains("is-unavailable")
  && !sectionEl.classList.contains("is-stale")
  && (sectionEl.classList.contains("is-valid")
      || sectionEl.classList.contains("is-partial"))
```

Equivalente pratico: profilo aperto **e** (valid ∨ partial).  
Nota: l’overlay usa la geometria canonica, ma la **visibilità** resta legata al lifecycle Profilo (non è una modalità generale di visualizzazione tracce).

In stati stale/unavailable `renderSavedTrackElevationSection` già azzera `runtimeProfile`/`hover` e rimuove il marker sync: il cleanup punti dovrà allinearsi allo stesso path.

---

## 11. Stile e stacking

### Stile marker fissi

- Cerchio `r ≈ 2.5–3` px
- `fill: var(--accent)`
- Opacità moderata (indicativamente 0.55–0.7)
- Bordo sottile leggibile chiaro/scuro (es. `stroke: #fff` / contrasto su `--panel`, stroke-width ~1)
- `vector-effect: non-scaling-stroke` se coerente con SVG esistenti nel monolite
- Nessuna etichetta, nessun cursore interattivo, nessun tooltip
- `pointer-events: none`
- Gruppo `aria-hidden="true"` (decorativo)

### Stacking

1. Polilinea saved track (già in svg)
2. **Gruppo punti** `.saved-track-profile-points-overlay` (append dopo le linee della traccia attiva)
3. **Marker hover** `.saved-track-elevation-sync-marker` (già aggiunto per ultimo da `savedTrackUpdateElevationSyncMarkerOnly` in coda a `renderSavedTracksOverlays` ~42586) → **sopra** i punti fissi
4. Overlay editing / poligoni / strumenti prioritari restano su layer z-index superiori (poly-edit z:6, polygons z:4, saved-tracks z:3)

Nessuna nuova preferenza persistita. Nessun i18n nuovo.

---

## 12. Lifecycle

### Apertura

1. `openSavedTrackElevationProfile(trackId)` imposta `view.trackId`.
2. `renderSavedTrackElevationSection()` classifica lo stato (valid/partial/stale/unavailable).
3. Al prossimo (o immediato) refresh overlay: se predicato true, `savedTrackAppendProfilePointsOverlay` crea il gruppo per la sola traccia attiva.
4. Eventuale `refreshTileMapForTrackUi()` / path esistente di refresh solo se già coerente con gli helper — non inventare un nuovo bus di eventi.

### Re-render mappa

1. `renderSavedTracksOverlays` ricrea `.saved-tracks-overlay` (rimuove il vecchio wrap) su pan/zoom/cambio layer/refresh.
2. Nello **stesso ciclo**, dopo le polilinee, se predicato true → append gruppo punti della traccia `view.trackId` (solo se quella traccia è nel set visibile **oppure** anche se nascosta? → **solo se la traccia esiste**; se `visible===false` ma profilo aperto, ancora mostrare i punti della traccia attiva — altrimenti l’utente apre il profilo e non vede i punti. **Decisione piano:** disegnare i punti della traccia attiva indipendentemente dal flag `visible`, purché la traccia esista in `state.savedTracks`; la polilinea resta soggetta a `visible` come oggi).
3. Poi `savedTrackUpdateElevationSyncMarkerOnly()` (già in coda) → hover sopra i punti.

### Chiusura e cambio traccia — cleanup idempotente obbligatorio

Rimuovere il gruppo **subito** (non solo al prossimo pan) tramite `savedTrackRemoveProfilePointsOverlay()` in:

- `closeSavedTrackElevationProfile` / `savedTrackClearElevationView`
- apertura profilo di una seconda traccia (prima del nuovo render: clear o sostituzione via trackId)
- chiusura modal Tracce (`_closeTrackModalCore` già chiama close profilo)
- eliminazione traccia attiva (`deleteSavedTracksByIds` già chiama close)
- lista tracce vuota (`renderSavedTracksList` già chiama close)
- reset completo (`prepareUiBeforeAppFullReset` già chiama close)
- passaggio a stato stale / unavailable (path early-return di `renderSavedTrackElevationSection`: aggiungere remove punti accanto a `savedTrackRemoveElevationSyncMarker`)

Il rebuild completo di `.saved-tracks-overlay` **contribuisce** al cleanup ma **non** è l’unico meccanismo: chiusura profilo deve rimuovere i marker anche senza pan/refresh mappa.

---

## 13. Architettura futura (minima)

```text
SAVED_TRACK_PROFILE_POINTS_BUDGET = 120
savedTrackBuildProfilePointSubset(st)           // puro, no DOM, no mutate
savedTrackAppendProfilePointsOverlay(svg, …)    // DOM append
savedTrackRemoveProfilePointsOverlay()          // querySelectorAll + remove, fail-soft
savedTrackProfilePointsOverlayShouldShow()      // predicato §10
```

Integrazioni localizzate:

1. Fine loop tracce / post-polilinee in `renderSavedTracksOverlays` → append se shouldShow.
2. `savedTrackClearElevationView` → `savedTrackRemoveProfilePointsOverlay()`.
3. Early-return stale/unavailable in `renderSavedTrackElevationSection` → remove punti (allineato al remove sync marker).

**Non** creare nuovo store. **Non** aggiungere proprietà persistite. **Non** toccare chart/dispatcher/owner/parser/sanitizer/saveStore/GraphHopper/rete/OPSEC/tile/`state.mapWaypoints`/`state._routing`.

---

## 14. Regioni autorizzate (futuro runtime)

| Regione | Azione |
|---|---|
| Costanti vicino a `SAVED_TRACK_ELEVATION_*` (~36446) | Aggiungere `SAVED_TRACK_PROFILE_POINTS_BUDGET` |
| Nuove funzioni vicino al blocco TRACK-ELEVATION-PROFILE-A (~36734+) | subset + append + remove + shouldShow |
| `renderSavedTracksOverlays` (~42485) | Chiamata append localizzata |
| `savedTrackClearElevationView` (~36882) | Chiamata remove |
| `renderSavedTrackElevationSection` early-return stale/unavailable | Chiamata remove (allineamento) |
| CSS (~9126–9144) | Stili `.saved-track-profile-points-overlay` / `.saved-track-profile-point` |

---

## 15. Funzioni vietate

Non modificare:

- `elevationProfileDrawChart`
- `routingAltitudeOnMapHover`
- `routingAttachAltitudeMapHoverOnce`
- `elevationProfileMapSyncOwner`
- `elevationProfileMapInteractionBlocked`
- `savedTrackSanitizeElevationProfile` / `savedTrackGeometryHash`
- parser GPX/KML/GeoJSON/CSV
- `saveStore`
- GraphHopper / rete / OPSEC / tile/cache
- `state.mapWaypoints[]` / `state._routing`
- editing Saved Track / geometria canonica

---

## 16. Invarianti

Il futuro runtime **non** modifica:

- punti canonici Saved Track (`st.points`)
- `state.mapWaypoints[]`
- `state._routing`
- addon elevation persistito
- parser / import-export
- storage / `saveStore`
- GraphHopper / rete / OPSEC / tile-cache
- Routing profile
- geometria della traccia
- editing Saved Track

Feature = session-only, puramente visuale.

---

## 17. Classificazione

**DELICATO leggero — lifecycle e overlay GIS.**

Motivazione:

- modifica `renderSavedTracksOverlays`;
- integra lifecycle profilo Saved Track;
- aggiunge/rimuove nodi SVG durante rebuild mappa;
- **non** tocca storage, rete, OPSEC, dati canonici.

---

## 18. Review downstream

**OBBLIGATORIA** pre-deploy (`raw@FULL_SHA` se disponibile; altrimenti review sostitutiva GPT con checklist per-categoria).

---

## 19. Matrice test (futuro)

1. Traccia 2 punti → 2 marker  
2. `< 120` punti → tutti presenti  
3. Esattamente 120 → 120 marker  
4. `> 120` → massimo 120  
5. Primo e ultimo sempre inclusi  
6. Indici selezionati ordinati e unici  
7. Distribuzione basata su distanza, non indice  
8. Tratto con molti punti ravvicinati non sovrarappresentato  
9. Punti invalidi gestiti senza errore  
10. Distanza totale nulla → fallback deterministico  
11. Antimeridiano  
12. Profilo valid → overlay visibile  
13. Profilo partial → overlay visibile  
14. Profilo stale → overlay assente  
15. Profilo unavailable → overlay assente  
16. Sola traccia attiva alimenta l’overlay  
17. Apertura profilo seconda traccia rimuove la prima  
18. Chiusura profilo rimuove subito i marker  
19. Chiusura modal rimuove i marker  
20. Eliminazione traccia rimuove i marker  
21. Reset rimuove i marker  
22. Pan/zoom ricostruisce correttamente  
23. Cambio layer ricostruisce correttamente  
24. Marker hover sopra i marker fissi  
25. Marker fissi non ricevono pointer event  
26. Nessuna modifica a `st.points`  
27. Nessuna modifica all’addon elevation  
28. Nessuna chiamata `saveStore`  
29. Nessun fetch  
30. Nessuna regressione profilo Routing  
31. Tema chiaro/scuro  
32. Larghezza mobile  

---

## 20. Harness futuro (minimo)

Verificare almeno:

- budget ≤ 120  
- primo/ultimo inclusi  
- ordine strettamente crescente  
- unicità indici  
- distribuzione per distanza (su fixture sintetica con cluster locale: densità marker nel cluster < densità indice-uniforme)  
- cleanup idempotente (doppia chiamata remove senza throw)  
- immutabilità deep-equal `st.points` / `st.elevationProfile` pre/post  
- assenza `saveStore` / fetch nel path  

Metodo: estrazione JS inline + `node --check` + harness logico (pattern già usato nel repo).

---

## 21. Stima diff runtime

**50–80 righe** (costante + 3–4 helper + 2 call-site + CSS).

### Soglia di arresto / ripianificazione

Fermarsi e ripianificare/dividere se:

- oltre **100** righe;
- necessità di modificare chart condiviso;
- necessità di modificare dispatcher hover;
- necessità di modificare persistenza o sanitizer.

---

## 22. Rischi

| ID | Rischio | Mitigazione |
|---|---|---|
| R1 | Confusione con handle di editing | `pointer-events:none`; r=2.5–3 vs handle r=6 fill `#fff`; stacking sotto editing |
| R2 | Marker residui dopo chiusura senza pan | Remove esplicito in `savedTrackClearElevationView`, non solo rebuild overlay |
| R3 | Sovraccarico DOM su 2000 pt | Budget 120 hard |
| R4 | Cluster GPX sovrarappresentato | Decimazione per distanza (non per indice) |
| R5 | Regressione owner hover Routing | Non toccare dispatcher/owner |
| R6 | Traccia attiva `visible:false` | Disegnare punti della traccia attiva anche se polilinea nascosta (vedi §12) |

---

## 23. Gate GO / NO-GO runtime

**GO** se:

- piano approvato (questo documento);
- opzione B distance-decimated confermata;
- workspace pulito;
- HEAD = origin/main = ls-remote;
- monolite = tip runtime autorevole PASS;
- review downstream pianificata;
- QA operatore post-deploy pianificata.

**NO-GO** se:

- HEAD ≠ origin/main ≠ ls-remote;
- workspace sporco non autorizzato;
- monolite già modificato fuori tip;
- conflitto con ROUTING-PROFILE-EDIT-A in lavorazione simultanea;
- richiesta di toccare chart/dispatcher/persistenza nello stesso blocco.

---

## Gate finale di questa fase docs

**TRACK-PROFILE-POINTS-DISPLAY-A PLAN READY — RUNTIME NOT OPENED**

Task resta **BACKLOG / NON APERTO**. Monolite invariato.
