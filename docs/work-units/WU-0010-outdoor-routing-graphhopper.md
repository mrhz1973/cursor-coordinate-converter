# WU-0010 — Outdoor Routing GraphHopper

**Stato:** **OPEN / PLAN APPROVED / RUNTIME NOT STARTED**
**Data pubblicazione piano:** 2026-07-24
**Runtime autorevole attuale:** `18120102f319721aa237badb1db3c28327739e88` (`1812010`) — display **`B5.5Z · build 51`** — **invariato**
**MAJOR-3-b1:** CLOSED / PASS end-to-end (runtime live `1812010`)
**MAJOR-3-b2:** **parcheggiato** (non annullato)
**Review upstream GLM:** **PASS CON CORREZIONI** — 3 correzioni bloccanti registrate qui sotto
**Prossimo bundle runtime autorizzabile:** **B1** (richiede prompt Cursor dedicato + review downstream pre-deploy)

> Questa WU è la **fonte di piano dedicata** per il programma Outdoor Routing GraphHopper. Implementazione e chiusura avvengono nei singoli bundle; lo stato operativo vivo resta in `docs/OPERATING_MEMORY.md` §7.

---

## 1. Scopo del programma

Realizzare un **planner outdoor dedicato**, principalmente a:

- **Hiking**
- **Hiking facile**
- **MTB Touring**
- **MTB Trail**

**Provider iniziale:** **GraphHopper**.

**Modalità previste:**

- **Automatico**
- **Locale / offline** (GraphHopper loopback)
- **VPS tramite Tailscale**
- **Online tramite gateway**

**Ordine Auto iniziale:**

1. Locale
2. VPS Tailscale
3. Online
4. errore controllato

**L'endpoint effettivamente usato** deve essere sempre mostrato all'operatore (in pannello, transiente).

---

## 2. Decisioni UX ratificate

- Pannello floating dedicato
- Lista ordinata **A / passaggi / B**
- **ID dei punti stabili** e indipendenti dall'indice
- **Massimo iniziale 20 punti** complessivi
- Riordino tramite handle
- Comandi accessibili **Sposta su / Sposta giù**
- Campi indirizzo separati per ogni punto
- **Click mappa** per assegnare un punto
- **Marker temporanei trascinabili**
- **GPS single-shot** soltanto su comando esplicito
- **Nessun GPS automatico**
- **Nessun live tracking**
- Ricalcolo soltanto alla fine di una modifica
- Profilo altimetrico previsto (Bundle E)
- Difficoltà stimata e spiegabile (Bundle E)
- Preview prima del salvataggio canonico (Bundle D)

---

## 3. Stato transiente — contratto di piano

Stato planner: **`state._routing`**.

**Vincolo:** deve restare **session-only** e **non entrare in `saveStore`**.

Shape concettuale:

- `points[]` — lista punti A/passaggi/B
- `pickMode` — true quando il prossimo click mappa (no-drag) imposta un punto
- `pickTargetId` — id del punto che il prossimo click mappa imposta
- `markerDrag` — stato drag marker in corso (`{ pid, id, ... }`)
- `listReorderDrag` — id durante drag HTML5 lista
- `panelOpen` — visibilità pannello
- `provider` — `"auto" | "local" | "vps" | "online"`
- `resolvedEndpoint` — endpoint risolto per l'ultima richiesta (mostrato all'operatore)
- `activityProfile` — profilo attività (hiking / hiking facile / MTB touring / MTB trail)
- `requestGeneration` — token monotono per request stale (Bundle C)
- `abortController` — `AbortController` per richiesta GraphHopper in corso (Bundle C)
- `alternatives` — alternative restituite (Bundle C/F)
- `selectedAlternative` — alternativa scelta (Bundle C/F)
- `lastResult` — snapshot route risultato, transient
- `elevationProfile` — profilo altimetrico (Bundle E)
- `difficultySummary` — difficoltà stimata (Bundle E)
- `dirty` — ricalcolo pendente dopo modifica conclusa
- `error` — stato errore in-pannello (`aria-live`)
- `loopbackConsent` — consenso esplicito routing loopback in forced-offline (Bundle C; chiave transiente, default `false`, non usata in B)

**Vincoli di scrittura canonica:**

- **Nessuna** scrittura in `state.mapWaypoints`
- **Nessuna** scrittura in `state.savedTracks`
- **Nessuna** scrittura in `state.gisPolygons`
- **Nessuna** scrittura in `state.track`
- **Nessuna** persistenza prima del Bundle D

---

## 4. Correzioni bloccanti della review GLM (obbligatorie)

Le tre correzioni sono **vincolanti per ogni futuro bundle runtime** di questo programma.

### Correzione 1 — Guardia interazioni mappa

`workbenchMapInteractionBlocked()` deve essere **estesa**, non sostituita.

Il futuro **Bundle B1** deve aggiungere soltanto le condizioni necessarie per:

- `state._routing.pickMode`
- `state._routing.markerDrag`

**Non creare una seconda guardia parallela.**

Gli altri pick-mode devono **disarmare il routing pick-mode** e viceversa (disarmo reciproco via la stessa guardia centrale, pattern già usato da `trackSyncPickModeUi` e attivatori WP/Track/Polygon/RangeRings/Convert/Astro/Measure/Bbox).

### Correzione 2 — Pick mappa

Il pick routing deve essere integrato come **nuovo ramo nello stesso `attachPanHandlers.onUp`**.

Il ramo deve:

- verificare `!drag.moved`
- rispettare `trackBrushYieldsPan()`
- rispettare `state._bboxSelecting`
- rispettare `CTRL_SEL` (lista selettori toolbar/handle)
- **non** aggiungere un nuovo listener `click` su `tileMap`
- **non** introdurre pan concorrente

Pattern di riferimento: ramo `rangeRingsPickAndCreateMode` già presente in `attachPanHandlers.onUp`.

### Correzione 3 — Geocoding

Ogni futura chiamata planner a:

```js
geocodeSearch(...)
```

deve essere preceduta da un controllo esplicito:

```js
if (!geocodingAllowed()) { /* fallback offlineForwardSearch */ }
```

In caso di gate negato, offline o errore deve essere usato:

```js
offlineForwardSearch(...)
```

**Non modificare:**

- `geocodeSearch`
- `offlineForwardSearch`
- `geocodingAllowed`
- `isEffectivelyOnline`
- gate OPSEC esistenti

---

## 5. Split B1 + B2 (ratificato)

Il precedente Bundle B viene **diviso**. La review GLM raccomanda fermamente **B1 + B2** per ragioni strutturali del monolite: il Cerca esistente è single-input + single-results; un adapter multi-riga è codice nuovo che parla con `geocodeSearch`/`offlineForwardSearch`, non riuso del widget Cerca.

### BUNDLE B1 — Planner UI no-route

**Scope:**

- Pannello floating dedicato
- Stato transiente (`state._routing`)
- Lista punti A / passaggi / B
- ID stabili
- Aggiunta/eliminazione punti
- Riordino lista
- Pulsanti accessibili Su/Giù
- Pick dalla mappa (ramo in `attachPanHandlers.onUp`, Correzione 2)
- Marker temporanei
- Drag marker (Pointer Events, vedi §9)
- GPS single-shot (Correzione di method, vedi §11)
- Cleanup idempotente (Esc / chiusura / disarmo)
- i18n IT/EN (FR congelato)
- Build bump futuro **51 → 52**

**Esclusioni:**

- Nessun geocoding
- Nessuna chiamata GraphHopper
- Nessuna configurazione endpoint
- Nessuna rete nuova
- Nessun salvataggio canonico
- Nessuno storage
- Nessun profilo altimetrico

**Classificazione:** **DELICATO** per lifecycle pick/drag e interazioni mappa.

**Review downstream pre-deploy:** **obbligatoria**.

**Target diff:** 350–500 righe.

**Soglia di arresto:** oltre 650 righe rivalutare split B1a (pannello + lista) / B1b (pick + drag + GPS).

### BUNDLE B2 — Cerca/geocoding multi-riga

**Scope:**

- Adapter per ciascuna riga (risultati isolati)
- Debounce (~250 ms indicativo)
- Stale-token monotono per riga
- `geocodingAllowed()` esplicito prima di ogni `geocodeSearch` (Correzione 3)
- `geocodeSearch` solo quando consentito
- `offlineForwardSearch` come fallback (OPSEC strict / offline / errore)
- Nessun endpoint nuovo
- Build bump futuro **52 → 53**

**Esclusioni:**

- Nessuna modifica a `geocodeSearch` / `offlineForwardSearch` / `geocodingAllowed` / `isEffectivelyOnline`
- Nessun secondo geocoder
- Nessuna modifica al Cerca esistente

**Classificazione:** **DELICATO** per geocoding e gate rete esistenti.

**Review downstream pre-deploy:** **obbligatoria**.

**Target diff:** 200–350 righe.

**Soglia di arresto:** oltre 450 righe rivalutare split B2a (adapter core + gate) / B2b (autocomplete dropdown UI).

---

## 6. Bundle successivi (scope futuro, sintetico)

### BUNDLE C — GraphHopper provider preview

**Scope futuro:**

- Endpoint Locale / VPS / Online
- Modalità Auto (ordine Locale → VPS → Online → errore controllato)
- `/info` (verifica provider)
- POST `/route`
- `AbortController` + generation token
- Timeout e fallback
- Normalizzazione risposta
- Preview percorso (geometria read-only, no salvataggio)
- Endpoint effettivamente usato mostrato all'operatore

**Classificazione:** **DELICATO** per rete, proxy e OPSEC.

**Review downstream estesa obbligatoria** (checklist QA-CHECKLIST estesa, non minima narrativa).

### BUNDLE D — Salva come traccia

**Scope futuro:**

- Riuso `savedTrackAddFromPoints(opts)` (helper esistente, già read-only rispetto al draft `state.track`)
- `saveStore` (prima persistenza del programma)
- Read-back canonico
- Rollback su errore
- Refresh Tracce (`renderSavedTracksList`) e Workbench

**Classificazione:** **DELICATO** per create-path e storage.

**Review downstream estesa obbligatoria.**

### BUNDLE E — Altimetria e difficoltà

**Scope futuro:**

- Grafico **SVG vanilla** (preferenza SVG su canvas)
- Quota e distanza
- Pendenza per segmento
- Salita e discesa cumulative
- Sincronizzazione mappa ↔ profilo (crosshair)
- Difficoltà stimata spiegabile (facile / moderata / difficile / molto difficile)
- Dark/light + mobile + unità metriche/imperiali
- Gestione quote mancanti e spike

**Vincoli:** nessuna libreria runtime esterna; nessuna modifica a sanitizer/storage/CRUD.

### BUNDLE F — Funzioni avanzate

**Scope futuro:**

- Alternative
- Andata/ritorno
- Round trip
- Avoid areas
- Confronto futuro fra provider

---

## 7. Politica loopback ratificata (Bundle C)

**Scelta:** forced-offline consente routing loopback **soltanto** tramite opzione esplicita nel pannello Routing.

**Requisiti futuri:**

- Consenso **default OFF**
- Consenso **per-sessione** (transiente, non persistito)
- Solo **endpoint loopback validato**
- Host considerati loopback: **`localhost`** e **`127.0.0.1`** (eventualmente con porta)
- **Nessun altro host** considerato loopback
- **Nessun bypass silenzioso** di forced-offline
- **Nessuna API key nel monolite** HTML
- **Nessun health check al boot generale** (coerente OPSEC, no rete silenziosa)

Gli endpoint configurabili potranno essere persistiti in un blocco futuro dedicato, ma **credenziali e API key devono restare fuori dal file HTML**.

---

## 8. Regioni runtime previste per B1 (autorizzabili)

Documentate come regioni future; il runtime B1 non è ancora iniziato.

- `state` defaults transiente vicino a `_polyEdit` (nuova chiave `_routing`)
- `attachPanHandlers.onUp` (nuovo ramo pick routing, Correzione 2)
- `workbenchMapInteractionBlocked` (estensione +2 condizioni, Correzione 1)
- Helper routing (pick/drag/cleanup/reorder) vicino agli helper drag mappa esistenti (`mapWptDocDrag`, `mapTrackDocDrag`, `mapRrCenterDocDrag`, `mapPolyEditDocDrag`, `mapPolyMoveDocDrag`)
- HTML pannelli GIS floating (nuovo `<dialog class="app-modal">` per routing)
- CSS routing-specifico (handle, drag affordance, minimo)
- Toolbar Tracce/GIS (nuova CTA routing se prevista)
- i18n IT/EN (nuove chiavi `routing.*`)
- `APP_BUILD_NUM` (bump 51 → 52)

## 9. Regioni da NON toccare in B1/B2

- Sanitizer GIS (`gisSanitizeFeature` / `gisSanitizeGeometry` / `gisSanitizeProperties`)
- Parser import (`spatialTextToFeatureCollection` e sub-parser gpx/kml/geojson)
- `saveStore` / `loadStore` / `localStorage` / write `IndexedDB`
- Dati canonici (`state.mapWaypoints`, `state.savedTracks`, `state.gisPolygons`, `state.track`)
- `geocodeSearch`, `offlineForwardSearch`, `reverseGeocode`, `nominatimQuery`
- `geocodingAllowed`, `isEffectivelyOnline`, `tileFetchAllowed`
- Drop globale (`bindDragDrop`, `bindGlobalSpatialDropOnce`, `waypointImportDropZone`, paste dropzone)
- Import Hub (`#wbImportHub`)
- Mission Package (`#wbExportHub` mission package export)
- Cache/tile (hydrate/fetch paths)
- Proxy (Planet-Clone, Navionics)
- OPSEC strict gate
- Workbench non correlato (pick WP/Track/Polygon MAJOR-5A2)

---

## 10. Contratto punti e ID

**Formato ID:** stabile per tutta la durata della sessione planner.

- Pattern coerente con `uidNamed`: prefisso dedicato routing (es. `"rt"` + timestamp base36 + random base36 breve)
- L'ID **non cambia** dopo riordino, drag, modifica coordinate, cambio source, rename label
- L'ID **viene rimosso** solo quando l'utente cancella il punto (prune + render)
- Un nuovo punto ottiene sempre un nuovo ID

**Struttura punto (concettuale):**

```
{
  id: "<stable>",
  kind: "start" | "via" | "end",   // derivato dalla posizione, non identità persistente
  lat: <finite number>,
  lon: <finite number>,
  label: "<string>",
  source: "manual" | "map" | "gps" | "geocode",
  geocodeToken: <monotonic>        // per stale detection (B2)
}
```

**`kind` derivato dalla posizione:**

- Prima riga → `start`
- Ultima riga → `end`
- Righe interne → `via`

Riordinare può cambiare il `kind` di un punto (es. spostare in fondo promuove a `end`). `kind` **non** è identità persistente.

`lat`/`lon` sempre `Number.isFinite` validate; `null`/`NaN` non ammessi (rifiuta inserimento).

---

## 11. Drag marker — vincolo tecnico

- **Pointer Events** (non mouse-only)
- Listener `pointermove` / `pointerup` / `pointercancel` su `document` in **capture phase** (`true`)
- `pointerId` check
- RAF per il rendering
- Cleanup **idempotente** (chiamarlo due volte non fa danno)
- Pattern coerente con `mapWptDocDrag`, `mapTrackDocDrag`, `mapRrCenterDocDrag`, `mapPolyEditDocDrag`, `mapPolyMoveDocDrag`
- Marker handle inserito in `CTRL_SEL` (così `attachPanHandlers` non intercetta)
- **Niente pan concorrente** (handle dedicato)
- `pointercancel` **ripristina l'ultima coordinata confermata**

Helper consigliati: `mapRoutingMarkerDocDrag` + `mapRoutingMarkerDocDragCleanup`.

## 12. Riordino lista — vincolo tecnico

- **HTML5 `draggable=true`** solo come supporto mouse
- **Comandi Su/Giù obbligatori** per touch/tastiera/accessibilità (pulsanti + `↑`/`↓` con focus + `Delete` per rimuovere)
- **ID invariati** dopo riordino
- Prima riga derivata come `start`
- Ultima riga derivata come `end`
- Righe interne derivate come `via`
- `kind` derivato dalla posizione, **non come identità persistente**
- Ricalcolo soltanto al drop o al comando concluso (non durante drag)

## 13. Cerca B2 — vincolo tecnico

- Adapter **async** per riga
- `offlineForwardSearch` è **asincrono e IDB-backed** (chiama `loadOfflineCities`)
- Debounce indicativo **250 ms**
- Token monotono per riga (stale detection)
- Risultati separati per riga
- Dropdown separati per riga
- Callback stale ignorate
- Nessun secondo geocoder
- Nessuna modifica al Cerca esistente

## 14. GPS — vincolo tecnico

- `getCurrentPosition` soltanto (single-shot)
- **Mai** `watchPosition`
- Azione **esplicita** (pulsante "Usa posizione corrente")
- Secure-context check (`window.isSecureContext`): se false, pulsante disabled + tooltip
- Timeout/error in area `aria-live` del pannello (non globale)
- **GPS e pick-mode si disarmano reciprocamente** (l'azione GPS chiama `routingExitPickMode()`)

---

## 15. Profilo altimetrico (Bundle E) — vincoli di piano

- **SVG o canvas vanilla** — preferenza **SVG**
- Nessuna libreria runtime esterna
- Asse X: distanza cumulativa
- Asse Y: quota
- Pendenza per segmento
- Tooltip/crosshair
- Sincronizzazione con posizione sulla mappa
- Dark/light
- Mobile
- Unità metriche/imperiali
- Gestione quote mancanti e spike

## 16. Difficoltà (Bundle E) — vincoli di piano

- Livelli: **facile / moderata / difficile / molto difficile**
- **Sempre marcata come stima**
- **Nessuna** classificazione se i dati sono insufficienti
- Warning separati (cumulativi + tratti critici)
- Tratti critici evidenziabili
- **Nessuna** comunicazione di garanzia di sicurezza

---

## 17. i18n

- Nuove chiavi **solo IT/EN**
- **Francese congelato** (governance OM §7 2026-06-25)
- **Nessun backfill FR**
- Fallback FR → EN

---

## 18. Test matrix

### B1

| # | Test | Esito atteso |
|---|---|---|
| B1.1 | Apertura/chiusura pannello | render corretto, transient, niente persistenza |
| B1.2 | A + B e più passaggi | ID stabili, lista corretta |
| B1.3 | Cap 20 punti | 21° bloccato, messaggio in-pannello |
| B1.4 | Pick A / via / B dalla mappa | coord settate, marker appare |
| B1.5 | Click vs drag mappa | drag = pan mappa, click no-drag = pick |
| B1.6 | Drag marker | marker segue, mappa non pan |
| B1.7 | `pointercancel` durante drag marker | rollback coord, markerDrag null |
| B1.8 | Esc durante pick | exit pick, marker pick-mode rimosso |
| B1.9 | Disarmo reciproco tool (Waypoint/Track/Polygon/RangeRings/Convert/Astro/Measure/Bbox) | `workbenchMapInteractionBlocked` blocca; messaggio "blocked" |
| B1.10 | GPS single-shot | coord settate, source="gps", no watchPosition |
| B1.11 | Secure context (`!isSecureContext`) | pulsante disabled + tooltip |
| B1.12 | Riordino mouse (HTML5 drag) | ID stabili, ordine preservato, `kind` ridderivato |
| B1.13 | Riordino tastiera (Su/Giù/Delete) | come sopra |
| B1.14 | ID stabili dopo riordino/drag/modifica | ID non cambiano |
| B1.15 | `kind` rideterminato dopo riordino | start/via/end coerenti con posizione |
| B1.16 | Cleanup su Esc/chiusura/disarmo | `state._routing = null` o prune completo, marker rimossi |
| B1.17 | Reload senza persistenza | `_routing` riparte vuoto |
| B1.18 | Zero write canonici | `mapWaypoints`/`savedTracks`/`gisPolygons`/`state.track` intatti |
| B1.19 | Zero GraphHopper | nessuna chiamata rete routing |
| B1.20 | Regressioni: Workbench/Brush/Poligoni/Range Rings/Import Hub | tutti non interferiti |

### B2

| # | Test | Esito atteso |
|---|---|---|
| B2.1 | Ricerca su più righe | dropdown indipendenti |
| B2.2 | Debounce ~250 ms | niente spam richieste |
| B2.3 | Stale token (type veloce A poi B) | dropdown A non aggiornato da callback A stale |
| B2.4 | OPSEC strict on | fallback `offlineForwardSearch` |
| B2.5 | Forced-offline | fallback `offlineForwardSearch` |
| B2.6 | Fallback offline (offline/exception) | badge error una tantum, dropdown offline |
| B2.7 | Eccezione `geocodeSearch` | fallback offline |
| B2.8 | Input vuoto | dropdown chiuso, `lat/lon` preservati |
| B2.9 | Selezione risultato | lat/lon/label settati, dropdown chiuso |
| B2.10 | Zero endpoint nuovi | riuso puro `geocodeSearch`/`offlineForwardSearch` |
| B2.11 | Regressione Cerca esistente | Cerca principale non modificato |

### C–F (sintetica, da dettagliare nei singoli bundle)

- **C:** `/info` + POST `/route`; AbortController; generation token; endpoint risolto mostrato; fallback Auto (Locale → VPS → Online → errore); timeout; normalizzazione risposta; preview read-only; nessun salvataggio; loopback solo con consenso esplicito; nessuna API key nel monolite; nessun health check al boot.
- **D:** salvataggio via `savedTrackAddFromPoints`; read-back; rollback su errore; refresh Tracce/Workbench; prima persistenza del programma.
- **E:** profilo altimetrico SVG vanilla; quota/distanza/pendenza; difficoltà stimata; sincronizzazione mappa; dark/light/mobile; unità metriche/imperiali; gestione spike.
- **F:** alternative; andata/ritorno; round trip; avoid areas; confronto futuro provider.

---

## 19. Acceptance criteria B1

1. Pannello routing transiente (apre/chiude, ×/Esc, niente persistenza)
2. Punti con **ID stabili**
3. Pick integrato in `attachPanHandlers.onUp` (no listener duplicato)
4. `workbenchMapInteractionBlocked` estesa (+2 condizioni `_routing.pickMode` / `_routing.markerDrag`)
5. Drag marker con cleanup idempotente (Pointer Events capture phase)
6. GPS single-shot (no `watchPosition`)
7. Riordino mouse (HTML5) e tastiera (Su/Giù/Delete)
8. Cap 20 punti
9. Nessun dato canonico modificato
10. Nessuna rete GraphHopper
11. Nessuna persistenza
12. i18n IT/EN; FR invariato (congelato)
13. Build **52**
14. Review downstream **PASS** prima del deploy

---

## 20. Note operative

- **MAJOR-3-b2 resta parcheggiato** (non annullato). OUTDOOR-ROUTING-GH ha la precedenza come programma corrente.
- **MAJOR-4 import/restore** resta backlog basso.
- Runtime autorevole resta **`1812010` build 51** finché il primo bundle runtime di questo programma non sarà mergeato e deployato.
- Ogni bundle runtime di questo programma è **DELICATO** e richiede **review downstream pre-deploy** (B1/B2/D/E minima narrativa o estesa a seconda del contenuto; **C estesa** per rete/OPSEC).
- Questo documento è **piano**, non stato corrente. Stato vivo: `docs/OPERATING_MEMORY.md` §7.
