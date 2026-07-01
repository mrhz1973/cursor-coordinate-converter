# WU-0005 → WU-0009 — Piano backlog GIS monolite

**Stato:** ACTIVE / PARTIALLY EXECUTED — piano vivo con blocchi completati e candidati futuri  
**Repo:** `mrhz1973/cursor-coordinate-converter`  
**Ambito:** GOI GIS Tool / GIS monolite  
**File operativo:** `coordinate_converter Claude.html`  
**Fonte backlog:** `docs/OPERATING_MEMORY.md` §7  
**Nota:** questo documento è piano/backlog/workstream. Non apre automaticamente una WU runtime; alcuni blocchi sono **PASS**, altri restano candidati. Stato operativo vivo: OM §7.

---

## 1. Vincoli operativi

Il piano rispetta i vincoli del GIS Tool:

- deliverable monolite: singolo file HTML standalone;
- HTML/CSS/JS nello stesso file;
- vanilla JS;
- no framework;
- no TypeScript;
- no npm;
- no bundler;
- no ES modules;
- no split operativo;
- OPSEC-aware;
- nessun GPS silenzioso all'avvio;
- nessun live tracking GPS senza decisione esplicita;
- OPSEC strict e forced-offline restano gate di rete;
- `state.mapWaypoints[]` resta fonte canonica dei waypoint;
- i prompt Cursor vengono scritti da GPT, non da Claude;
- i comandi manuali all'operatore vanno dati uno alla volta;
- i prompt-task per Cursor restano completi.

---

## 2. Ordine consigliato complessivo

Ordine operativo consigliato:

1. **WU-0005 — Governance “GIS online di default”**  
   Prima di toccare layer, basemap e proxy bisogna chiarire la semantica online/offline.

2. **WU-0006 — Diagnosi e decisione poligoni**  
   Va fatta prima di spostare “Poligoni” dentro “Tracce”, perché non ha senso riorganizzare in UI una funzione rotta senza sapere se sarà corretta, degradata o rimossa.

3. **WU-0007 — UX toolbar laterale e razionalizzazione strumenti** — **PASS** (B1–B8, `fa12567`..`e4c2be3`). Completata prima dei basemap multipli; flyout Tracce/Waypoint e MGRS in Layers.

4. **WU-0008 — Basemap XYZ aperti nel monolite** — **PASS** end-to-end (8a–8d-B, incluso EOX Sentinel-2 cloudless; browser QA PASS). Vedi Piano espansione e ordine operativo dettagliato.

5. **WU-0009 — Google/Bing via proxy Planet-Clone, lavoro a due teste**  
   Parte sensibile: coinvolge proxy, fetch, gate OPSEC, consenso e separazione tra GIS e Planet-Clone.

---

# WU-0005 — Governance: “GIS online di default”

## Scopo

Scrivere e bloccare la regola operativa: il GIS è **online di default**, mentre `state.forceOffline` è un interruttore volontario dell’operatore, non un vincolo predefinito.

Questo non deve indebolire OPSEC strict: OPSEC strict resta un gate superiore per chiamate sensibili, tile, geocoding, proxy e fetch.

## Tipo

**Sensibile / governance + OPSEC semantics — pipeline.**

Motivo: anche se può iniziare come docs-only, la regola influenza successivamente layer, tile online, cache, geocoding e proxy.

## Blocchi

### Stato WU-0005 — B0/B1 governance online/offline

**Stato:** B0/B1 documentati.

Decisione:

- Il GIS è online di default (`state.forceOffline` default `false`; `isEffectivelyOnline()` = `navigator.onLine && !state.forceOffline`).
- `state.forceOffline` / offline-only è un interruttore volontario dell’operatore (checkbox pannello offline, persistito).
- `state.opsecStrict` resta gate superiore e deve bloccare chiamate di rete sensibili quando attivo.
- Tile online, geocoding, layer esterni e proxy devono rispettare OPSEC strict, `state.forceOffline` e cache/offline mode dove previsto; consenso esplicito per tailnet-proxy sotto OPSEC strict.
- Nessun nuovo comportamento runtime introdotto da questo blocco.

Mappa gate esistenti (read-only monolite):

| Area | Variabile/funzione/punto | Ruolo | Coerenza con governance | Note |
| --- | --- | --- | --- | --- |
| Online effettivo | `isEffectivelyOnline()` (~22416) | Combina `navigator.onLine` con `!state.forceOffline` | Sì | Comportamento online di default se browser online e operatore non forza offline |
| Forced offline | `state.forceOffline` (default `false`, ~14882) | Interruttore volontario operatore; UI `#chkForceOffline` / toggle offline panel; persistito | Sì | Blocca fetch rete indipendentemente da `navigator.onLine` |
| OPSEC strict | `state.opsecStrict` (default `false`, ~14895) | Gate superiore; toggle UI resetta `_navProxyConsentGranted` | Sì | Quando attivo: niente fetch internet diretto; tailnet-proxy solo con consenso |
| Tile/layer fetch | `tileFetchAllowed(layerId)` (~22543) | Gate tile/layer: `forceOffline`→no; sotto OPSEC strict internet→no, tailnet-proxy→solo se `_navProxyConsentGranted` | Sì | Eccezioni batch precache/export JPG confermati via flag transiente |
| API internet | `internetApiFetchAllowed()` (~22568) | Gate API internet (Esri imagery identify, Open-Meteo elevation) | Sì | `forceOffline` o `opsecStrict` → false |
| Proxy/Navionics-like | `ensureNavProxyConsent()`, `_navProxyConsentGranted` (~22574) | Dialogo consenso per-sessione sotto OPSEC strict per layer `tailnet-proxy` (nav, sonarchart) | Sì | Non richiesto se `opsecStrict` disattivo; consenso non persistito |
| Tile hydrate/cache | `hydrateMapTiles`, `fetchAndStoreTile` (~23873, ~24010) | IndexedDB/cache first; fetch rete solo se online, `!forceOffline`, `tileFetchAllowed` (+ consenso proxy se serve) | Sì | Cache-on-browse; precache offline chiede conferma OPSEC strict |
| Geocoding/reverse | `geocodingAllowed()`, `nominatimQuery`, `reverseGeocode` (~21120) | Nominatim forward/reverse; disabilitato se `opsecStrict`; richiede `geocodeEnabled` + online effettivo | Sì | Fallback dataset città offline su errore |
| Tracking eventi rete | `recordNetEvent`, `state._netEvents` (~23855) | Tracciamento host/eventi rete transiente (sessione) | Sì | Diagnostica, non gate |
| MGRS | `state.showGrid`, `buildMgrsGridSVG` (~23095) | Overlay SVG locale sulla mappa | Sì | Nessuna fetch internet |
| Basemap | `TILE_LAYERS`, `state.mapLayer` (~22470) | Provider tile `osmHot`/osm/topo/sat/nav (`external`: internet o tailnet-proxy) | Sì | Governato da `tileFetchAllowed`; id `osm` = CARTO Voyager; `osmHot` = OSM HOT (`cf6d796`) |
| Seamarks/OpenSeaMap | `SEAMARK_OVERLAY`, `state.showSeamarks` (~22510, ~30539) | Overlay marino online-only; render `<img src>` solo se `showSeamarks && !forceOffline && !opsecStrict` | Sì | Non passa da `tileFetchAllowed` ma gate render impedisce fetch sotto OPSEC/forced-offline |
| SonarChart overlay | `SONARCHART_OVERLAY`, `sonarChartFetchAllowed()` (~22517) | Overlay tailnet-proxy; gate via `tileFetchAllowed("sonarchart")` | Sì | Toggle Layers; consenso Navionics riusato sotto OPSEC strict |
| Proxy/layer futuri | WU-0009 | Google/Bing via proxy Planet-Clone | Da governare | WU-0008 XYZ aperti PASS; stessi gate: OPSEC strict, `forceOffline`, consenso, cache |

Esito:

- Governance chiarita prima di WU-0008/WU-0009.
- Nessuna modifica runtime.
- Ambiguità rilevate: docs storici usano talvolta `forced-offline` mentre il codice usa `state.forceOffline`; copy UI generale non auditata oltre checkbox offline — B2 opzionale.

### B0 — Docs di decisione

**Stato:** PASS (documentato in blocco B0/B1 sopra).

Aggiornare la memoria operativa e, se serve, creare WU-0005 con stato OPEN.

La decisione deve dire chiaramente:

- online è il comportamento normale quando l’operatore non ha attivato `state.forceOffline`;
- `state.forceOffline` blocca la rete perché è una scelta volontaria;
- OPSEC strict resta più forte di “online default”;
- nessun GPS silenzioso e nessun live tracking implicito;
- tile/geocoding/proxy restano opt-in dove già previsto.

### B1 — Mappatura semantica esistente

**Stato:** PASS (tabella gate in blocco B0/B1 sopra).

Analisi read-only nel monolite:

- dove viene letto `state.forceOffline`;
- dove vengono applicati i gate OPSEC;
- dove si distinguono tile online, cache offline, geocoding, Esri, Open-Meteo, seamarks, Navionics/proxy;
- se ci sono testi UI ambigui che fanno sembrare l’app “offline di default”.

### B2 — Eventuale allineamento UI/testi

Solo se B1 trova ambiguità:

- testi UI che chiariscono “usa online se consentito”;
- forced-offline come modalità scelta dall’operatore;
- nessuna modifica sostanziale ai gate senza approvazione.

### B3 — Chiusura WU

Aggiornare WU, `OPERATING_MEMORY.md`, README snapshot se cambia davvero lo stato operativo, autosync se previsto.

## Decisioni da bloccare prima di iniziare

- Nome definitivo della regola: consigliato `GIS online di default; state.forceOffline volontario`.
- Chiarire che non equivale a “rete sempre permessa”: OPSEC strict e consenso layer restano superiori.
- Chiarire se la WU deve essere solo documentale o anche UI-copy.

## Dipendenze

Nessuna a monte.  
È prerequisito logico per WU-0008 e WU-0009.

---

# WU-0006 — Bug: “poligoni non funziona”

## Scopo

Capire se la funzione poligoni è rotta per bug localizzato, regressione UI, stato incoerente, export/import incompleto o feature ormai da rimuovere/declassare.

Solo dopo la diagnosi si decide fix o rimozione.

## Tipo

**Sensibile / diagnostica funzionale — pipeline.**

Motivo: tocca strumenti di misura, stato mappa, UI, possibili export e integrazione con Tracce.

### Stato parziale post-fix base

- Fix base pubblicato: `72a194e fix(gis): guard polygon draw mode against map dblclick recenter`.
- Esito test manuale: PASS — doppio-click chiude il poligono e la mappa non si ricentra più.
- Il bug grezzo “poligoni non funziona” è risolto per il caso base verificato.
- Restano fuori dal fix base (prima dell’UX leggera): editing vertici, drag del poligono intero, standardizzazione modal.

### Stato parziale post-UX leggera

- UX poligoni leggera pubblicata: `f7260d9 feat(gis): improve polygon panel workflow`.
- Esito test manuale: PASS.
- Implementato:
  - auto-arm draw mode all’apertura pannello poligoni;
  - cancellazione poligono con `✕` nella lista;
  - pannello poligoni minimizzato durante il disegno e ripristinato dopo finish/cancel.
- Verifiche manuali PASS:
  - auto-arm;
  - minimizzazione;
  - ripristino;
  - cancellazione con `✕`;
  - tracce;
  - waypoint.
- Restano fuori dal blocco leggero:
  - editing vertici;
  - drag del poligono intero;
  - standardizzazione modal trasversale.
- Editing vertici e drag poligono restano lavori pesanti da WU/blocco dedicato.

## Blocchi

### B0 — Docs WU e perimetro diagnosi

Aprire WU-0006. Definire che il primo blocco è **read-only**: nessuna modifica runtime.

### B1 — Diagnosi read-only

Cursor deve leggere il monolite e produrre mappa tecnica:

- funzioni legate a poligoni;
- pulsanti/menu che attivano poligoni;
- stato interno usato;
- eventuali array dati;
- eventi mappa collegati;
- calcolo area/perimetro;
- export/import collegati;
- i18n IT/EN/FR;
- possibili conflitti con tracce, waypoint e range/bearing.

Output atteso:

- diagnosi;
- punto di rottura probabile;
- opzioni operative.

### B2 — Decisione: fix, degrado o rimozione

Dopo B1 si sceglie:

- **Fix** se il problema è localizzato;
- **Degrado controllato** se la feature esiste ma va semplificata;
- **Rimozione UI** se è troppo fragile o non coerente con il GIS-first attuale.

### B3A — Fix poligoni

Solo se deciso fix:

- ripristinare attivazione;
- garantire disegno su mappa;
- calcolo area/perimetro;
- chiusura/cancellazione sicura;
- nessuna regressione su tracce e waypoint.

### B3B — Rimozione/declassamento poligoni

Solo se deciso rimozione:

- togliere pulsanti o voci UI;
- lasciare eventuali funzioni interne non richiamate solo se rimozione completa è rischiosa;
- aggiornare testi e docs.

### B4 — QA manuale e chiusura

Verifiche:

- apertura GIS;
- creazione poligono o conferma rimozione;
- nessuna rottura di tracce, waypoint, distanza;
- `node --check` su JS estratto;
- aggiornamento WU/docs/autosync.

### Estensione backlog — UX poligoni + modal standard

**Stato:** UX leggera PASS (`f7260d9`); restano voci pesanti/trasversali — **non implementate**, **non PASS**, **nessuna WU runtime aperta**.
**Prerequisito:** fix base poligoni pubblicato (`72a194e`), doppio-click chiude il poligono senza ricentrare la mappa.

Obiettivo:
migliorare l'esperienza d'uso dei poligoni e standardizzare il comportamento delle finestre flottanti/modali.

Voci:
- ~~Modal poligoni con draw mode già armato all'apertura~~ — PASS (`f7260d9`).
- ~~Cancellazione poligono con `X` nella lista~~ — PASS (`f7260d9`).
- ~~Modal poligoni minimizzata durante il disegno~~ — PASS (`f7260d9`).
- **[PESANTE — backlog]** Modifica poligoni sulla mappa (parità UX Mappe Offline, in-place):
  - nell'elenco poligoni salvati (`#polygonPanelList`) almeno azioni **Modifica** (matita) ed **Elimina**;
  - **Modifica** apre il poligono esistente in modalità edit sulla mappa: geometria evidenziata, handle sui vertici visibili e trascinabili, poligono intero spostabile per drag;
  - azioni esplicite **Salva** e **Annulla** nel pannello;
  - **Salva** aggiorna in-place lo stesso oggetto in `state.gisPolygons[]` (identità, nome, metadati conservati; nessuna copia);
  - **Annulla** ripristina integralmente la geometria originale;
  - stato **dirty** esplicito durante la modifica;
  - chiusura pannello o cambio strumento con modifiche non salvate: comportamento sicuro (conferma o annulla; nessuna perdita silenziosa);
  - **riferimento UX/tecnico:** modal Mappe Offline (`#offlineTilePanel`, `offcache.editingAreaTitle` / `offcache.editingAreaHint`, overlay bbox con handle) per ingresso in modifica, visualizzazione su mappa e handle — **senza** riutilizzare o sostituire lo storage tile offline (`IndexedDB` / aree nominate);
  - **vincoli:** non alterare `state.mapWaypoints[]`; non fondere arbitrariamente modelli tracce/waypoint/poligoni;
  - evidenza operatore: lista con matita, geometria su mappa, handle vertici, modifica diretta a schermo.
- **[PESANTE — backlog]** Vertici modificabili e spostamento poligono intero — coperti dal flusso edit sopra; eventuale split in micro-blocchi in implementazione futura.
- **[TRASVERSALE — backlog]** Standardizzazione modal trasversale — altezza verticale utile tipo Range & Bearing:
  - tutti i modal e pannelli operativi GIS devono aprirsi occupando l'**intera altezza utile** della viewport (margini e safe-area superiori/inferiori dell'app; **non** necessariamente larghezza full-screen);
  - header, titolo, chiusura e azioni primarie sempre raggiungibili; contenuto eccedente con scroll **interno** al corpo del modal;
  - coerenza desktop, finestre strette, touch/mobile;
  - compatibile con minimizzazione, ripristino e modalità disegno/modifica sulla mappa;
  - `#polygonPanel` può minimizzarsi durante disegno/modifica quando necessario; apertura normale = standard verticale;
  - **riferimento tecnico esistente:** `#measurePanel` / `#sec-measure` (Range & Bearing via `openMeasureFloatingPanelGis`, `_measurePanelLayoutOpts` ~L45278); pattern full-height già su Range Rings B6.4a-2 (`_rangeRingsPanelLayoutOpts`, `defaultHeightFraction: 0.92`);
  - implementazione futura a **blocchi piccoli**, verifica modal per modal; **nessuna** riscrittura CSS/HTML/JS generale in questo step documentale;
  - **perimetro:** modal/pannelli operativi app; **esclude** dialoghi nativi browser (`alert`, `confirm`, `prompt`).
  - **Landed (2026-06-30):** **MAJOR-5A2b** — Workbench pick mappa WP+traccia (`cef7d42`, build 28, QA PASS); terzo sottoblocco MAJOR-5A.
  - **Landed (2026-06-30):** **MAJOR-5A2a** — Workbench selezione lista + highlight (`d2f7856`, build 27, QA PASS); secondo sottoblocco MAJOR-5A.
  - **Landed (2026-06-30):** **MAJOR-5A1** — GIS Object Workbench catalogo read-only (`d74cbb7`, build 26, QA PASS); primo sottoblocco MAJOR-5A.
  - **Landed (2026-06-29):** **MAJOR-2BCD** — offline tile management combined 2B+2C+2D (`823bb73`, build 25, QA PASS); programma MAJOR-2 completato per scope 2BCD.
  - **Landed (2026-06-29):** **MAJOR-2A** — verificatore copertura offline read-only (`07ad4f4`, build 24, QA PASS); primo sottoblocco MAJOR-2.
  - **Landed (2026-06-29):** **MAJOR-1** — pannello Diagnostica runtime read-only (`9b359b7`, build 23, QA PASS); programma major-feature avviato.
  - **Landed (2026-06-28):** **MODAL-STD-SEARCH-B1** — `#searchPanel` (`33c95ad`, build 10); **MODAL-STD-B2** — `#favoritesPanel` + Poligoni ESC (`06ed2a0`→`266b116`, build 11→13); **BUNDLE-BACKLOG-B3** — audit bundle + micro-fix (`709079c`, build 14); **ROUTINE-CLEANUP-BUNDLE** — primo bundle-first cleanup (`7b8cf04`, build 15, QA PASS); **UX-NEXT-RUNTIME-BUNDLE-A** — resize pilota Preferiti + HUD + cleanup rename bar (`61bcda5`, build 16, QA PASS); **UX-NEXT-RUNTIME-BUNDLE-B** — resize multi-pannello + HUD avanzato (`584135e`, build 17, QA PASS); **UX-NEXT-RUNTIME-BUNDLE-C** — resize pannelli residui + HUD polish (`8f56566`, build 18, QA PASS); **UX-NEXT-RUNTIME-BUNDLE-D** — HUD/resize polish + wheel zoom (`ec86b62`→`5fec693` FIX1 FAIL→`19700b6` FIX2 PASS, build 19→21, QA PASS FIX2); **UX-NEXT-RUNTIME-BUNDLE-E** — consolidamento UX pannelli/mappa (`fb871b7`, build 22, QA PASS).
  - **Prossimi candidati audit:** titolo statico `<title>` allineamento build.
- Resize laterale dai lati, non solo dagli angoli (backlog correlato).

Note operative:
- Editing geometrie, vertici e drag poligono sono lavori non banali.
- La logica deve restare coerente con tracce e waypoint.
- Non introdurre refactor ampi senza WU dedicata.
- La standardizzazione modal è trasversale e si lega alla WU-0007 toolbar/UX (senza riaprire WU-0007 PASS).
- Blocchi futuri:
  - ~~UX poligoni leggera: auto-arm, `X` in lista, modal minimizzata~~ — PASS (`f7260d9`);
  - UX geometrie pesante: modifica in-place su mappa — P1/P1-FIX/P2 **CLOSED**; **P7** metadata/data **CLOSED** (B1 `57c6d39` + B2 `47bb3f6`); **A1**/**A2** **CLOSED**; **P3** cancellazione vertice **CLOSED** (`fc38247` + P3-FIX `6083abe`, deploy+QA PASS); **P3-ADD** inserimento vertice su lato **CLOSED** (`5df925f`, deploy+QA PASS); **P4-B1** traslazione intero poligono **CLOSED** (`505e7d0`, deploy+QA PASS); **P5-B1/P5-B1-FIX** finalizzazione sicura creazione **CLOSED** (`8bc7804` + `59f2bd1`, review Claude PASS, deploy+QA PASS); **P5-B2-A** toggle spostamento **CLOSED** (`5cc2e1b`, review Claude NON RICHIESTA, deploy+QA PASS); **P5-B2-B** nome automatico F2 **CLOSED** (`b68c774`, review Claude NON RICHIESTA, deploy+QA PASS); **P5-B2-C** nome editabile durante drawing **CLOSED** (`d893775`, review Claude NON RICHIESTA, deploy+QA PASS); **P5-B2-D** metriche live drawing **CLOSED** (`c2c4836`, review Claude NON RICHIESTA, deploy+QA PASS); **P5-B2-E** rimuovi ultimo punto **CLOSED** (`aea7434`, review Claude NON RICHIESTA, deploy+QA PASS); **P5-B2-F** pulizia errore stale **CLOSED** (`739bf49`, review Claude NON RICHIESTA, deploy indiretto P-STYLE-E/`0a51379`, QA PASS); **P5-B2-G** ramo `verts<3`→`polygonCancelDraw` **covered** (preesistente, UI ordinaria); **P5 complessivo CLOSED / PASS end-to-end**;
  - **BATCH FEATURE POLIGONI (quasi completo — backlog UX residuo):** (1) **P-UI-UNIFORM** **CLOSED / PASS end-to-end** — runtime **`e0e9578`**, blob **`edd4b973…`**, deploy+QA PASS («**QA P-UI-UNIFORM PASS operatore**»); Review Claude **NON RICHIESTA**; (2) **P-UNITS** (**`8c266ae`** + **`8be2845`** + **`11838a1`**) **CLOSED / PASS end-to-end** — blob **`10f5f1e…`**, deploy GIS-only **PASS tecnico** (HEAD VPS **`26f73f7`**, byte **2314390**, SHA-256 **`9b9aca0c…`**, cmp PASS); **QA operatore PASS** («**QA P-UNITS PASS operatore**»); lunghezza auto/m/km/NM/mi/ft; area auto/m²/ha/km²; session-only; isolamento Misura GIS/R&B; Review Claude **NON RICHIESTA**; (3) **P-VERTEX-MODAL** **CLOSED / PASS end-to-end** — runtime principale **`a4fa8e7`** (review byte Claude retroattiva **PASS**) + fix lista Lati **`5f8f73d`** (nessuna nuova review) + fix visibilità pannello **`5449cb9`** (P-VERTEX-MODAL-FIX2 — **RAMO A** CSS-only, review Claude **non richiesta** correttamente); causa radice header `×`/`−`: `display:flex` incondizionato su dialog senza `[open]`; sequenza QA: FAIL lista Lati → fix `5f8f73d`; FAIL header `×`/`−` → fix CSS `5449cb9` → deploy PASS → **QA PASS** («**QA P-VERTEX-MODAL PASS operatore**»); blob finale **`acafd519…`**; deploy GIS-only **PASS tecnico**; (4) **P-STYLE** **CLOSED / PASS end-to-end** — catena **`95c100d`** (A+B, review byte Claude **PASS**, blob **`4a8463b1…`**) + **`efca0bf`** (D, review byte Claude **PASS**, blob **`ac8a7c30…`**) + **`0a51379`** (C, gate orchestratore **PASS**, review Claude **NON RICHIESTA** — solo UI/working-copy; nessun sanitizer/export/import/create-path/`saveStore` diretto; nessun nuovo campo persistito; FR congelato); monolite blob **`8d13e41a…`**; deploy GIS-only **PASS tecnico** (HEAD VPS **`0a51379`**, byte **2340941**, SHA-256 **`a8225332…`**, cmp PASS, HTTP **200**, `goi-gis-app` active/enabled); **QA operatore PASS** («**QA P-STYLE PASS operatore**»); chiusura docs-only dopo blocco README **`c409819`** (che registrava P-STYLE pending); **P5 CLOSED / PASS end-to-end** (docs-only separato post-P-STYLE); (5) **P-VERTEX-FORMAT** **CLOSED / PASS end-to-end** — runtime base **`b9db963`** (selettore formato in modal vertice; formati dd/signed/ddm/dms/utm/mgrs; working copy `polygonVertexCoordModalCanon`; Salva-only; canonico `[lon, lat]`; blob **`0cae293…`**) + UX2 **`6ef714a`** (mirror `#polygonPanelVertexCoordFormatSel` in `#polygonPanelUnits`; `data-role="poly-vertex-coord-format"`; `polygonVertexCoordFormat` sessione; sync bidirezionale; blob live **`ed621173…`**); deploy base+UX2 GIS-only **PASS tecnico**; **QA PASS** («**QA P-VERTEX-FORMAT PASS operatore**» + «**QA P-VERTEX-FORMAT-UX2 PASS operatore**»); runtime live VPS **`6ef714a`**; Review Claude **NON RICHIESTA** in chiusura docs; **`APP_BUILD_ID` `B5.5Z` invariato**; (6) **P-POLYGON-LIST-ENRICHMENT** **CLOSED / PASS end-to-end** — base **`0409ad4`** (blob **`70f790e0…`**, deploy+QA PASS) + FIX1 **`d65410f`** (tabella ordinabile + stacking modal; review byte Claude **PASS con osservazioni**; blob **`701fc3ed…`**, deploy+QA PASS) + FIX2 **`28cc2d2`** (scroll tabella + layout unità/lista; blob **`f3c97917…`**, deploy GIS-only **PASS tecnico** byte **2365251** SHA **`58a53e20…`**, CMP_PASS; **QA PASS** «**QA P-POLYGON-LIST-ENRICHMENT-FIX2 PASS operatore**»); runtime live VPS **`28cc2d2`**; chiusura docs-only post-FIX2; backlog UX next separato **P-POLYGON-LIST-UX-NEXT** (colonne ridimensionabili; rinomina inline Nome) — desiderata futura, **non FAIL**; micro-fix multi-touch P2 pending;
  - **P-POLYGON-LIST-UX-NEXT — backlog candidato (A chiuso; B runtime landed; B-FIX2 chiuso):** **(A) rinomina inline** — **CLOSED** (`6892890`, QA PASS); **(B) colonne ridimensionabili** — runtime landed (`0c5fe42`/`e1d7718`, build 4, QA PASS operatore storico); chiusura docs dedicata B non in questo blocco; **(B-FIX2) indicatore Vis.** — **CLOSED** (`b7b98c2`, build 9, QA PASS).
  - **APP-BUILD-NUM-B1 — build number monotono runtime (metodo B) — CLOSED / PASS tecnico end-to-end:** runtime **`bd588a8`**, blob **`afddf87a…`**; `APP_BUILD_NUM = 1`; display **`B5.5Z · build 1`**; review byte Claude **PASS**; deploy GIS-only **PASS tecnico** (byte **2365479**, SHA **`23907b80…`**, CMP_PASS); verifica runtime minima display **PASS**; **nessuna QA operatore estesa**; cleanup span build foldato in UX-NEXT-A; **`APP_BUILD_ID` `B5.5Z` invariato**; runtime VPS superseded da **`6892890`**.
  - **P-POLYGON-LIST-UX-NEXT-A — rinomina inline + build 2 — CLOSED / PASS end-to-end:** runtime **`6892890`**, blob **`30358cd3…`**; inline rename via **`polygonRenameExecute(id, value)`**; `APP_BUILD_NUM = 2`; display **`B5.5Z · build 2`**; cleanup span statici; review byte Claude **PASS**; deploy GIS-only **PASS tecnico** (byte **2368796**, SHA **`96f9468e…`**, CMP_PASS); **QA operatore PASS** («**QA P-POLYGON-LIST-UX-NEXT-A PASS operatore**»); **`APP_BUILD_ID` `B5.5Z` invariato**; runtime VPS live **`6892890`**.
  - **Prossimo ordine operativo:** **MAJOR-4** backlog basso; **OFFLINE-DOWNLOAD-CONTROLS** backlog (Pausa/Stop/Riprendi download tile — non ora); **MAJOR-3-a CLOSED** `c0fb4da` build 32; **MAJOR-2E-a CLOSED** `d9238b6` build 31; programma pick Workbench **MAJOR-5A2 completo**; **MAJOR-5A2-UX-BACKLOG CLOSED** `d9c8f7b` build 30; titolo statico `<title>` e micro-UX **non ora** (salvo bug reale).
  - **UI-MODAL-PARITY-HELP-QR build 5 — CLOSED / PASS tecnico, QA FAIL:** runtime **`dcea02f`**, blob **`cf23cc9…`**, migrazione Help/QR a dialog, **`APP_BUILD_NUM = 5`**, deploy GIS-only PASS, QA operatore FAIL (Help GIS/QR Converti) → FIX1.
  - **UI-MODAL-PARITY-HELP-QR-FIX1 build 6 — CLOSED / PASS end-to-end:** runtime **`e8e8ff1`**, blob **`6eee6872…`**, Help floating + QR ripristinato, review **GPT sostitutiva PASS** (Claude indisponibile), deploy GIS-only PASS (byte **2404202**, SHA **`3fe2ac2e…`**, CMP_PASS), **QA operatore PASS** («**QA UI-MODAL-PARITY-HELP-QR-FIX1 PASS operatore**»); display **`B5.5Z · build 6`**.
  - **UI-MODAL-PARITY-HELP-QR-FIX2 build 7 — CLOSED / PASS end-to-end:** runtime **`14605e9`**, blob **`0886b6bb…`**, QR ridimensionabile GIS mode (handle angoli, pattern Help FIX1), review **GPT sostitutiva PASS** (Claude non disponibile), deploy GIS-only PASS (byte **2407357**, SHA **`14477224…`**, CMP_PASS), **QA operatore PASS** («**QA UI-MODAL-PARITY-HELP-QR-FIX2 PASS operatore**»); display **`B5.5Z · build 7`**; superseded per runtime live da **CONVERT-SOURCE-PICKER** (`b294140`).
  - **CONVERT-SOURCE-PICKER build 8 — CLOSED / PASS end-to-end:** runtime **`b294140`**, blob **`6feba1c9…`**, sorgente coordinate Convertitore, review **GPT sostitutiva PASS**, deploy GIS-only PASS (byte **2423291**, SHA **`1a954ca9…`**, CMP_PASS), **QA operatore PASS** («**QA CONVERT-SOURCE-PICKER PASS operatore**»); display **`B5.5Z · build 8`**; superseded per runtime live da **P-POLYGON-LIST-UX-NEXT-B-FIX2** (`b7b98c2`).
  - **P-POLYGON-LIST-UX-NEXT-B-FIX2 build 9 — CLOSED / PASS end-to-end:** runtime **`b7b98c2`**, blob **`dc8067d9…`**, indicatore Vis. poligoni (pallino verde/grigio, `.poly-vis-indicator`, `polygonMapVisible`), review **NON RICHIESTA**, deploy GIS-only PASS (byte **2423809**, SHA **`87746763…`**, CMP_PASS), **QA operatore PASS** («**QA P-POLYGON-LIST-UX-NEXT-B-FIX2 PASS operatore**»); display **`B5.5Z · build 9`**; superseded per runtime live da **MODAL-STD-SEARCH-B1** (`33c95ad`).
  - **MODAL-STD-SEARCH-B1 build 10 — CLOSED / PASS end-to-end:** runtime **`33c95ad`**, blob **`d048ee2…`**, standardizzazione `#searchPanel` (altezza utile 0.78 fraction, scroll body, clamp parziale, CSS geocode summary nascosto), review **NON RICHIESTA**, deploy GIS-only PASS (byte **2424747**, SHA **`fd6203f6…`**, CMP_PASS), **QA operatore PASS** («**QA MODAL-STD-SEARCH-B1 PASS operatore**»); display **`B5.5Z · build 10`**; superseded per runtime live da **MODAL-STD-B2-FIX2** (`266b116`).
  - **MODAL-STD-B2 build 11 — CLOSED / PASS tecnico, QA parziale:** runtime **`06ed2a0`**, blob **`431a9c88…`**, Preferiti layout/scroll (`_favoritesPanelLayoutOpts`, CSS MODAL-STD-B2) + Poligoni ESC GIS (precedenza barre/modali interne), review **NON RICHIESTA**, deploy GIS-only PASS; **QA parziale** — Poligoni ESC PASS; Preferiti FAIL (scroll/ESC/× guscio) → FIX1.
  - **MODAL-STD-B2-FIX1 build 12 — CLOSED / PASS tecnico, QA parziale:** runtime **`f53e2d8`**, blob **`4ac10423…`**, fix close/ESC Preferiti (`:not([open])`, `closeFavoritesPanel`, `preventDefault` ESC), review **NON RICHIESTA**, deploy GIS-only PASS (byte **2427546**, SHA **`4531f47e…`**, CMP_PASS); **QA** — ×/ESC/riapertura/Poligoni ESC PASS; scroll FAIL residuo → FIX2.
  - **MODAL-STD-B2-FIX2 build 13 — CLOSED / PASS end-to-end:** runtime **`266b116`**, blob **`0f4d275e…`**, scroll `#favoritesPanelBody`, deploy GIS-only PASS, **QA operatore PASS**; display **`B5.5Z · build 13`**; superseded per runtime live da **BUNDLE-BACKLOG-B3** (`709079c`).
  - **BUNDLE-BACKLOG-B3 build 14 — CLOSED / PASS end-to-end:** runtime **`709079c`**, blob **`da27be43…`**, audit 4 candidati backlog; patch: rimossa `polygonShowRenameBar()`, guard P2 multi-touch vertex drag; non implementato: resize laterale, HUD, CSS legacy, `renderAllMaps`; review **NON RICHIESTA**, deploy GIS-only PASS (byte **2426501**, SHA **`ca0d74a6…`**, CMP_PASS), **QA operatore PASS** («**QA BUNDLE-BACKLOG-B3 PASS operatore**»); display **`B5.5Z · build 14`**; superseded per runtime live da **ROUTINE-CLEANUP-BUNDLE** (`7b8cf04`).
  - **ROUTINE-CLEANUP-BUNDLE build 15 — CLOSED / PASS end-to-end:** runtime **`7b8cf04`**, blob **`71e353ee…`**, primo bundle METHOD-BUNDLING-DEFAULT (7 item: CSS legacy modal, renderAllMaps no-op, cleanup cosmetico); review **NON RICHIESTA**, deploy GIS-only PASS (byte **2423860**, SHA **`0caa7065…`**, CMP_PASS), **QA operatore PASS** («**QA ROUTINE-CLEANUP-BUNDLE PASS operatore**»); runtime VPS live **`7b8cf04`**, display **`B5.5Z · build 15`**.
  - **METHOD-QA-PASS-AUTO-FINITO — CLOSED / PASS docs-only (2026-06-28):** commit task **`78ea6c9`**, autosync **`bacabef`**; regola QA-PASS auto-innesca finito (OM §4 Regola H); template coda bundle; monolite invariato **`71e353ee…`**; runtime VPS **`7b8cf04`** build 15; prossimo bundle runtime con coda pre-autorizzata.
  - standardizzazione modal trasversale: altezza utile + scroll interno + rollout per-modal;
  - resize laterale pannelli flottanti.

### Backlog candidato — Personalizzazione HUD a schermo (visibilità + riposizionamento)

**Stato:** backlog candidato, **non avviato**, **non bloccante**. Docs-only finché non viene aperto un blocco runtime specifico. **Non** è una WU aperta; **non** modifica OM §7.

**Ambito:** GIS monolite, livello UI/overlay sopra la mappa.

**Idea operatore:** permettere di scegliere quali elementi HUD mostrare a schermo e, in un secondo tempo, riposizionarli tramite una modalità esplicita di modifica layout.

**Riferimenti UX (stato invariato):**
- **WU-0007** — razionalizzazione toolbar e gruppi pulsanti (**PASS**; non riaperta; questo backlog **non** è prosecuzione automatica di WU-0007);
- backlog **standardizzazione modal/pannelli flottanti** (sezione sopra, `[TRASVERSALE — backlog]`);
- **B5.2** mobile viewport containment — riferimento per clamp/fallback/reset nel viewport.

**Priorità e coda:** priorità backlog; **non bloccante**; **dopo** i residui Poligoni (A2-B2-FIX deploy/QA, A2-B3, P7-B2, ecc.) e **dopo** gli altri candidati già in coda; apertura futura solo mediante **blocchi runtime separati** (nessuna implementazione autorizzata da questa voce).

L'implementazione futura deve restare **due blocchi distinti** — **non** accorpati in un unico intervento.

#### HUD-VIS — Visibilità elementi HUD

Blocco più semplice: **solo** show/hide degli overlay HUD.

**Scope candidato:**
- toggle show/hide per la **scala** (`buildScaleBar`, `.tile-scale`);
- toggle show/hide per il readout **PUNTO/CURSORE** (`.tile-readout`);
- toggle show/hide per **gruppi** di pulsanti toolbar/header (perimetro da definire al blocco);
- comando **Mostra tutto** (reset visibilità), sempre disponibile.

**Persistenza (contratto dati futuro — schema non definitivo in questo step):**
- preferenze in store `coordconv_v2`;
- sanitizer dedicato;
- pattern di riferimento: `settings.rangeRingsLastStyle` / `sanitizeRangeRingsLastStyle`;
- la parte schema, hydration, sanitizer e persistenza costituisce un **CONTRATTO DATI**;
- quando HUD-VIS verrà aperto come blocco runtime, la costruzione del contratto dati richiederà **hop/review Claude**.

**Distinzione obbligatoria:**
- **HUD-VIS** stabilisce cosa è visibile durante l'uso live;
- asse **distinto** da **B5.5C** (cosa includere nell'immagine JPG esportata);
- un modello condiviso schermo → export è **sinergia futura opzionale**, non requisito iniziale di HUD-VIS.

#### HUD-MOVE — Riposizionamento in modalità modifica layout

Blocco più delicato: da aprire **separatamente** dopo HUD-VIS o per decisione esplicita — **non** inglobato automaticamente in HUD-VIS.

**Scope candidato:**
- rendere trascinabili gli elementi HUD;
- memorizzare posizione personalizzata sullo schermo;
- blocco layout successivo;
- comando **Reset layout**, sempre disponibile.

**Nota tecnica obbligatoria:**
- scala e readout PUNTO/CURSORE sono oggi **overlay fissi** — non pannelli flottanti;
- **non** coperti dal sistema drag/resize dei pannelli esistenti;
- riferimenti tecnici pannelli: `drag-head`, `gisPanelAttachResize`, `attachPolygonPanelFloatingGis`;
- il riposizionamento richiederà riuso/adattamento **controllato** di quel sistema **oppure** un layer di layout HUD dedicato;
- **non** descrivere HUD-MOVE come semplice riuso automatico del drag dei modal.

**Persistenza:** posizioni nello stesso store/sanitizer previsti per HUD-VIS; anche questa parte è **contratto dati** (schema non deciso in docs-only).

**Modalità modifica layout:**
- modo operativo **distinto** dall'uso normale;
- mentre attiva: sospendere/intercettare gesture mappa incompatibili (pan, tap, pinch, drag handle edit, minimize/restore pannelli);
- pattern concettuali: `mapMeasureMode`, `rangeRingsPickCenterMode`, altri pickMode transitori;
- **nessun** live tracking GPS o comportamento implicito.

**Responsive e containment:**
- posizioni desktop possono uscire dal viewport su mobile;
- in futuro: clamp ai bordi, fallback sicuro, reset, eventuale normalizzazione per viewport;
- riferimento: containment **B5.2**;
- nessun elemento HUD irraggiungibile fuori schermo.

**Ordine:** HUD-VIS prima (o parallelo solo per decisione esplicita); HUD-MOVE separato; nessun nome definitivo `state.*` / `settings.*` in questa voce.

### WU-0006 POLY-EDIT-B2 — Fondazione edit state (transiente)

**Stato:** **review byte PASS** (base `9bd2e4c` + micro-fix `0e23b42`); **nessun deploy**; fondazione assorbita in catena POLY-EDIT.

**Micro-fix single-source:** rimossi controlli `length < 3` duplicati in `polygonEnterEdit`/`polygonSaveEdit`; validità minima e cap vertici delegati esclusivamente a `gisSanitizeFeature`/`gisSanitizeGeometry` via `gisFeatureUpdate`.

**Implementazione (monolite):**

- `state._polyEdit: null` — transient, escluso da allowlist `saveStore()`;
- `polygonIsEditing()` — interrogazione read-only;
- `polygonEnterEdit(id)` — `original` (geometria chiusa clone), `working` (ring aperto, de-dup finale `gisSameCoord`); idempotente stesso id; rifiuto id diverso;
- `polygonCancelEdit()` — scarta `_polyEdit`, canonico invariato;
- `polygonSaveEdit()` — singola `gisFeatureUpdate(id,{geometry})` senza opts; undo/persistenza delegati; clear edit solo su successo.

**Invariati:** creazione/cancel/delete/rename/lista/render saved/draft; Mappe Offline; altri strumenti mappa; **`APP_BUILD_ID` `B5.5Z`**.

**Fuori scope B2:** pulsante Modifica, overlay edit, handle, drag vertici/intero, dirty-confirm, Esc/chiusura sicura, i18n, CSS — **B3+**.

### WU-0006 POLY-EDIT-B3 — Modifica + overlay + barra Salva/Annulla (no drag)

**Stato:** **review byte PASS**; **QA operatore FAIL** (editor insufficiente vs Tracce); **nessun deploy**; **non** CLOSED end-to-end.

**Runtime:** `77ad65e`.

**QA operatore FAIL (causa):** assenza info live, nome non integrato in edit, vertici non trascinabili, assenza parità funzionale con Poligono Tracce.

**Implementazione (monolite):** vedi commit `77ad65e` — Modifica in lista, overlay edit, barra Salva/Annulla, vertici visibili non interattivi.

### POLY-PARITY-P1 — Scheda informazioni live + nome salvabile

**Stato:** **runtime `7a668d7`** — **review byte Claude PASS**; **QA operatore FAIL**; **nessun deploy**; **non** CLOSED end-to-end.

**Implementazione (monolite):**

- `#polygonPanelEditBar` — titolo, input nome transiente, riepilogo (vertici/area/perimetro/unità), dettaglio lati+bearing (`<details>` scroll), Salva/Annulla, errore;
- `_polyEdit` esteso: `name`, `originalName`, `nameDirty`, `geometryDirty` (false in P1), `dirty` composito;
- Helper: `gisRingToLatLonPts`, `polygonRecomputeEditDirty`, `renderPolygonEditInfo`, `polygonNormalizeEditName`;
- Calcoli da `working` via `sphericalPolygonArea`, `computePolylinePerimeterMeters`, `vincentyInverse`, `formatMapMeasureDistance`, `fmtAreaPlain`;
- Unità: `state.mapMeasureUnit` (formatter Misura);
- Salva dirty: **una** `gisFeatureUpdate(id,{geometry,properties})` con proprietà canoniche clonate + `name` transiente;
- Salva clean: `polygonCancelEdit()` senza CRUD;
- **Nessun** drag, resize, metadata data, modifica sanitizer.

**Review byte:** `polygonSaveEdit` — una sola `gisFeatureUpdate`; proprietà canoniche preservate; nessun timestamp; sanitizer invariato; contratto transiente B2 intatto.

**Invariati:** overlay edit non interattivo; **`APP_BUILD_ID` `B5.5Z`**.

**QA operatore P1 — PASS parziali:** Annulla non modifica il canonico; Salva aggiorna il nome; nome salvato persiste dopo reload.

**QA operatore P1 — FAIL (UI/i18n; storage canonico intatto):**

1. Chiave grezza `gis.polygonPanel.defaultName` in titolo/input/lista — chiave mancante IT/EN/FR.
2. Formattazione unità incoerente (`4.335k m`; riga `Unità: m` scollegata da area km²/perimetro km) — fix: `state.mapMeasureUnit` + formatter Misura per etichetta e valori.
3. `#polygonPanelEditErr` mostrata vuota come fascia rossa.
4. Testo tecnico «trascinamento nel blocco successivo» esposto all’utente.
5. Riapertura **Modifica** bloccata dopo Salva finché **Esc**.

**Chiarimento:** geometrie visibili ma assenti dalla lista Poligoni erano poligoni **Tracce**, non `state.gisPolygons` — non bug P1; separazione GIS/Tracce da mantenere.

### POLY-PARITY-P1-FIX — Correzioni UI/i18n QA P1

**Stato:** **CLOSED / PASS end-to-end** (scope P1-FIX) — runtime **`d30a3a8`**; deploy tecnico GIS-only PASS; **QA operatore P1-FIX PASS**.

**Fix (monolite):** i18n `defaultName`; formatter distanze; barra errore; hint utente; sblocco Modifica con draw auto-arm vuoto.

**Invariati:** `polygonSaveEdit` una sola `gisFeatureUpdate`; **`APP_BUILD_ID` `B5.5Z`**.

### POLY-PARITY-P2 — Drag vertici in modalità Modifica (+ P2-FIX)

**Stato:** **CLOSED / PASS end-to-end**

**Catena:**

| Step | Commit / esito |
|------|----------------|
| Runtime P2 | **`e22e40b`** — drag vertici; live `working`/info; dirty geometrico; nessun CRUD durante drag; Salva → una `gisFeatureUpdate` |
| Review Claude P2 | **FIX REQUIRED** — (1) handle assenti da `CTRL_SEL`; (2) `setPointerCapture` senza release simmetrico |
| Runtime P2-FIX | **`f35e4d9`** — `.poly-edit-handle`/`.poly-edit-handle-hit` in `CTRL_SEL`; rimossa capture pointerdown poligono |
| Review Claude P2-FIX | **PASS** — GO DEPLOY P2-FIX |
| Deploy VPS GIS-only | **PASS tecnico** — runtime `f35e4d9` su `:8000`; byte **2274553**; SHA **`96082c09…80701`**; warning test-harness non bloccante |
| QA operatore | **PASS** — «QA WU-0006 POLY-PARITY-P2 PASS operatore» |

**Nessun fix / deploy / QA pendente su P2 o P2-FIX.**

### POLY-PARITY-P7 — Metadata/data poligono (regola legacy-safe)

**Stato:** **catena POLY-PARITY-P7 CLOSED / PASS end-to-end** — P7-A completata; **P7-B1** runtime **`57c6d39`**; **P7-B2** runtime **`47bb3f6`** (deploy VPS PASS; QA operatore PASS).

| Sotto-blocco | Stato |
|--------------|-------|
| P7-A diagnosi read-only | **completata** |
| P7-B1 contratto dati legacy-safe | **CLOSED / PASS end-to-end** — runtime `57c6d39` |
| P7-B2 UI date Creato/Aggiornato | **CLOSED / PASS end-to-end** — runtime `47bb3f6` |

### POLY-UX-STABILITY — Handle / pannello Poligoni

| Sotto-blocco | Stato |
|--------------|-------|
| A-DIAG diagnosi read-only | **completata** — `renderAllMaps` indefinita; auto-minimize ≠ close |
| A1 handle ingresso Modifica | **CLOSED / PASS end-to-end** — runtime `af87259` |
| A2 pannello / drawing / UX stabilità | **CLOSED / PASS end-to-end** — **A2-B1** (`db2f6ea`); **A2-B2** storico superseded (`cb9f92f`); **A2-B2-FIX** (`70ed7b3`); **A2-B3** (`87cbe64`, deploy+QA PASS) |

**A1:** rimossa `renderAllMaps()` da `polygonRefreshEditUi`; `polygonScheduleEditOverlayRefresh` (RAF+token+guardie) → `renderTileMap` diretto (deviazione ratificata vs `refreshTileMapForTrackUi` — precedenza `viewCenter`→`lastPoint`); review Claude PASS; deploy VPS PASS; **QA operatore PASS** («QA POLY-UX-STABILITY-A1 PASS operatore»). **A2-B1:** CLOSED/PASS end-to-end (`db2f6ea`, deploy+QA PASS). **A2-B2:** rollback logico PASS; QA PARTIAL FAIL storico; runtime `cb9f92f`; superseded da A2-B2-FIX. **A2-B2-FIX:** redraw sincrono post-close edit; runtime **`70ed7b3`**; deploy+QA PASS. **A2-B3:** apertura senza auto-arm; disegno esplicito `#polygonPanelNewBtn`; runtime **`87cbe64`**; deploy VPS PASS; **QA operatore PASS** («QA POLY-UX-STABILITY-A2-B3 PASS operatore»). **Catena A2 completata end-to-end.**

**Backlog parità (non avviati, salvo decisione operativa):** ~~P3 cancellazione vertice~~ — **CLOSED / PASS end-to-end** (`fc38247` + P3-FIX `6083abe`); ~~P3-ADD inserimento vertice su lato~~ — **CLOSED / PASS end-to-end** (`5df925f`); ~~P4 traslazione intero poligono~~ — **CLOSED / PASS end-to-end** (`505e7d0`, P4-B1); ~~P5-B1/P5-B1-FIX finalizzazione sicura creazione~~ — **CLOSED / PASS end-to-end** (`8bc7804` + `59f2bd1`, review Claude PASS, deploy+QA PASS); ~~P5-B2-A toggle spostamento~~ — **CLOSED / PASS end-to-end** (`5cc2e1b`, review Claude NON RICHIESTA, deploy+QA PASS); ~~P5-B2-B nome automatico F2~~ — **CLOSED / PASS end-to-end** (`b68c774`, review Claude NON RICHIESTA, deploy+QA PASS); ~~P5-B2-C nome editabile durante drawing~~ — **CLOSED / PASS end-to-end** (`d893775`, review Claude NON RICHIESTA, deploy+QA PASS); ~~P5-B2-D metriche live drawing~~ — **CLOSED / PASS end-to-end** (`c2c4836`, review Claude NON RICHIESTA, deploy+QA PASS); ~~P5-B2-E rimuovi ultimo punto~~ — **CLOSED / PASS end-to-end** (`aea7434`, review Claude NON RICHIESTA, deploy+QA PASS); ~~**P5-B2-F** pulizia errore stale~~ — **CLOSED / PASS end-to-end** (`739bf49`, review Claude NON RICHIESTA, deploy indiretto P-STYLE-E/`0a51379`, QA PASS); ~~**P5-B2-G** ramo `verts<3`→`polygonCancelDraw`~~ — **covered** (preesistente, irraggiungibile UI ordinaria); ~~**P5 complessivo**~~ — **CLOSED / PASS end-to-end**; P6 ✕ intero poligono; P8 resize modal (P8-A). **Backlog tecnico non urgente (non bloccante, NON landed):** guardia multi-touch P2 `if (mapPolyEditDocDrag || mapPolyMoveDocDrag) return` — finding review P4-B1; micro-fix futuro separato Ramo B + review byte Claude prima deploy.

### POLY-PARITY-P4-B1 — Traslazione intero poligono in Modifica

**Stato:** **CLOSED / PASS end-to-end** — runtime **`505e7d0`**; review byte Claude **PASS**; deploy VPS PASS; **QA operatore PASS** («QA POLY-PARITY-P4-B1 PASS operatore»).

**Implementazione (monolite):**

- toggle «Sposta poligono» ghost/subtle con `aria-pressed`; hint i18n IT/EN/FR;
- `_polyEdit.moveMode` transiente (default false; persiste post-pointerup fino a toggle o fine edit);
- pipeline dedicata `mapPolyMoveDocDrag*` separata da P2;
- `snapshotGeo`/`snapshotPx` immutabili al pointerdown; offset totale pointer-based; proiezione `tileMapLatLonToPx`/`tileMapPxToLatLon`;
- zero-salto; world wrap breve; frame invalidi fail-closed;
- fill interattivo solo in move mode; handle P2 visibili ma non interattivi; mutua esclusione P4/P2;
- working-copy-only; una `gisFeatureUpdate` su Salva; cleanup simmetrico.

**Review byte Claude:** PASS — GO DEPLOY. Contratti snapshot/offset totale, mutua esclusione, working-copy-only, una update su Salva verificati.

**Finding non bloccante (backlog tecnico separato):** ramo pointerdown P2 — assenza guardia `if (mapPolyEditDocDrag || mapPolyMoveDocDrag) return`; secondo pointer touch su altro handle durante drag P2 può sostituire il primo; non raggiungibile mouse singolo; nessuna corruzione geometria/persistenza; **non** impedisce chiusura P4-B1.

**Deploy VPS PASS:** runtime servito **`505e7d0`**, blob **`7dbe96ef5b68d670d647556a8883039a054d9ad4`**, byte **2294595**, SHA **`2ae34929…`**, cmp PASS, HTTP **200**, `goi-gis-app` active/enabled.

**QA:** toggle/hint; traslazione intero poligono; vertici invariati; move mode persistente; pan fuori fill; P2 post-toggle; Annulla/X/Salva; P3 insert/delete + drag; IT/EN/FR.

**Invariati:** P2 core byte-invariato; P3/P3-ADD; P7; A1/A2; **`APP_BUILD_ID` `B5.5Z`**. **P5/P6/P8/HUD:** **P5 CLOSED / PASS end-to-end** (B1…B2-G covered); P6/P8/HUD backlog separati.

### Governance i18n (decisione 2026-06-25)

**Vincolante per i blocchi futuri** (nessuna modifica retroattiva al monolite in questa decisione):

- italiano = lingua principale; inglese = seconda lingua mantenuta;
- francese = lingua legacy congelata — non aggiungere nuove stringhe FR; non modificare stringhe FR esistenti;
- nuovi sviluppi UI: chiavi **solo IT ed EN**;
- stringhe FR già presenti non cancellate finché non si apre un blocco dedicato;
- rimozione FR da selettore, dizionari o runtime = blocco separato e approvato;
- nessuna chiave mancante che destabilizzi il runtime.

Sostituisce per i **nuovi** blocchi il precedente requisito operativo di aggiornare sempre IT/EN/FR.

### POLY-PARITY-P5 — Creazione poligono (Opzione A)

**Stato:** **P5 — CLOSED / PASS end-to-end** — **P5-B1/P5-B1-FIX CLOSED / PASS end-to-end** — runtime **`59f2bd1`**; **P5-B2-A…E CLOSED / PASS end-to-end** — runtime fino a **`aea7434`**; **P5-B2-F CLOSED / PASS end-to-end** — runtime **`739bf49`** (review Claude NON RICHIESTA; deploy indiretto P-STYLE-E/`0a51379`; QA operatore PASS); **P5-B2-G covered** — ramo `verts.length < 3` → `polygonCancelDraw()` preesistente, irraggiungibile da UI ordinaria. Monolite autorevole **`8d13e41a36fe7cc0605dc8f315eff551725340ed`**.

| Sotto-blocco | Stato |
|--------------|-------|
| P5 analisi read-only | **completata** — Opzione A (info + controllo base) |
| P5-B1 finalizzazione sicura + recupero draft | **CLOSED / PASS** — runtime **`8bc7804`** |
| P5-B1-FIX visibilità errore su rifiuto | **CLOSED / PASS** — runtime **`59f2bd1`** |
| P5-B2-A toggle etichetta spostamento | **CLOSED / PASS** — runtime **`5cc2e1b`** |
| P5-B2-B nome automatico F2 | **CLOSED / PASS** — runtime **`b68c774`** |
| P5-B2-C nome editabile durante drawing | **CLOSED / PASS** — runtime **`d893775`** |
| P5-B2-D metriche live durante drawing | **CLOSED / PASS** — runtime **`c2c4836`** |
| P5-B2-E rimuovi ultimo punto | **CLOSED / PASS** — runtime **`aea7434`** |
| P5-B2-F pulizia errore stale draft | **CLOSED / PASS** — runtime **`739bf49`**; deploy indiretto **`0a51379`**; QA PASS |
| P5-B2-G ramo verts&lt;3 | **covered** — `polygonCancelDraw()` preesistente; irraggiungibile UI ordinaria |

**Percorso canonico (invariato):** `polygonFinishDraw` → una sola `gisFeatureAdd("polygon", feature)` → `gisSanitizeFeature` → `gisSanitizeGeometry` → persistenza CRUD interna; sanitizer unico backstop; P7 `created_at === updated_at` alla creazione.

**P5-B1 (`8bc7804`, blob `820d4d7…`):** su rifiuto sanitizer preserva draft e `polygonDrawMode`; `#polygonPanelDrawErr` + i18n IT/EN/FR; retry/Annulla; nessuna feature fantasma; una sola `gisFeatureAdd`; nessuna `gisFeatureUpdate`; nessun `saveStore` diretto.

**Review Claude P5-B1 (storico):** NO-GO — errore invisibile con pannello auto-minimizzato; superseded da P5-B1-FIX.

**P5-B1-FIX (`59f2bd1`, blob `c289f655…`):** nel ramo `if (!added)` di `polygonFinishDraw`: `polygonDrawRestoreIfAutoMinimized()` prima di `polygonShowDrawErr(...)`; ordine: add → `!added` → restore pannello → errore → sync UI → return senza clear; ramo successo invariato; solo `polygonFinishDraw` modificata.

**Review byte Claude P5-B1-FIX:** **PASS** — GO DEPLOY. Contratti: draft preservato; draw mode preservata; pannello ripristinato; errore visibile; retry/Annulla; nessuna feature fantasma; creazione valida invariata; una `gisFeatureAdd`; nessuna `gisFeatureUpdate` post-add; nessun `saveStore` diretto.

**Deploy VPS PASS (P5-B1-FIX):** runtime servito **`59f2bd1`**, blob **`c289f655…`**, byte **2295978**, SHA **`a99654a8…`**, cmp PASS, HTTP **200**, `goi-gis-app` active/enabled.

**QA operatore PASS (P5-B1-FIX):** «**QA POLY-PARITY-P5-B1/P5-B1-FIX PASS operatore**».

**P5-B2-A (`5cc2e1b`, blob `306765a…`):** `#polygonPanelEditMove` sincronizzato da `state._polyEdit.moveMode` in `renderPolygonEditBar()`; inattivo `↔ Sposta` / attivo `■ Termina spostamento` (IT/EN/FR); `textContent`, `title`, `aria-label`, `aria-pressed`; hook `applyLanguage()` durante edit; `polygonToggleMoveMode` byte-invariata.

**Review Claude P5-B2-A:** **NON RICHIESTA** — solo UI/i18n; sanitizer/create-path/CRUD invariati; nessun nuovo campo persistito.

**Deploy VPS PASS (P5-B2-A):** pull FF `1b0924f`→`5cc2e1b`, HEAD VPS **`5cc2e1b`**, blob **`306765aa06d55ebfd03928290c5702ba8b661204`**, byte **2297265**, SHA **`da0c8c20…`**, cmp PASS, HTTP **200**, 6 stringhe i18n nel body.

**QA operatore PASS (P5-B2-A):** «**QA POLY-PARITY-P5-B2-A PASS operatore**» — toggle inattivo/attivo; secondo click termina; hint visibile; reset Salva/Annulla/chiusura; cambio lingua IT/EN/FR in move mode; nessuna regressione modifica; P5-B1 invariato.

**P5-B2-B (`b68c774`, blob `1d585c4…`):** `polygonParseAutoNameSuffix` + `polygonBuildNextDefaultName()`; base da `gis.polygonPanel.defaultName`; `max(suffisso numerico valido)+1` con anti-collisione; nessun `length+1`; sequenze indipendenti per base IT/EN/FR; `properties.name` esistente; create-path e sanitizer invariati; nessun nuovo campo persistito.

**Review Claude P5-B2-B:** **NON RICHIESTA** — sanitizer/create-path/CRUD invariati; nessun nuovo campo persistito.

**Deploy VPS PASS (P5-B2-B):** pull FF `5cc2e1b`→`b68c774`, HEAD VPS **`b68c774`**, blob **`1d585c4fe337a5a16e8f6be8820405fefd1c276e`**, byte **2298437**, SHA **`a87322ed…`**, cmp PASS, HTTP **200**, helper presenti; vecchia espressione F2 assente.

**QA operatore PASS (P5-B2-B):** «**QA POLY-PARITY-P5-B2-B PASS operatore**» — nomi progressivi non duplicati; buco post-cancellazione senza collisione; sequenze per base localizzata; nomi invariati al cambio lingua; persistenza dopo reload; P5-B2-A e creazione/modifica senza regressioni.

**P5-B2-C (`d893775`, blob `cc759b8…`):** `#polygonPanelDraftNameWrap` + `state._polygonDraftName` transiente; `polygonSyncDraftNameUi()`; chiavi IT/EN `drawNameLabel`/`drawNamePlaceholder` (nessuna FR); `draftNorm || polygonBuildNextDefaultName()`; reset solo start/cancel/successo; ramo `!added` senza reset nome/vertici (P5-B1); `properties.name` unico campo persistito; create-path e sanitizer invariati.

**Review Claude P5-B2-C:** **NON RICHIESTA** — stato transiente; sanitizer/create-path/CRUD invariati; nessun nuovo campo persistito.

**Deploy VPS PASS (P5-B2-C):** pull FF `b68c774`→`d893775`, HEAD VPS **`d893775`**, blob **`cc759b80f2cd691bd386066bf34429a36e82b451`**, byte **2300677**, SHA **`d5138ab6…`**, cmp PASS, HTTP **200**, controllo draft presente; ramo `!added` senza reset nome.

**QA operatore PASS (P5-B2-C):** «**QA POLY-PARITY-P5-B2-C PASS operatore**» — campo Nome solo in drawing; nome manuale/vuoto/spazi; reset start/Annulla/successo; cambio IT↔EN; nessuna FR nuova; P5-B2-A/B invariati; reload; nessuna regressione creazione/modifica.

**P5-B2-D (`c2c4836`, blob `7919e6e…`):** `#polygonPanelDraftInfo` + `renderPolygonDraftInfo()`; metriche read-only da `state._polygonDraftVertices`; chiavi riusate `editVertices`/`editArea`/`editPerimeter`/`editNoData` (nessuna nuova i18n); `polygonFinishDraw` e ramo `!added` byte-invariati; nessuna persistenza metriche; nessun timer/polling.

**Review Claude P5-B2-D:** **NON RICHIESTA** — metriche derivate read-only; sanitizer/create-path/CRUD invariati; nessun nuovo campo persistito.

**Deploy VPS PASS (P5-B2-D):** pull FF `d893775`→`c2c4836`, HEAD VPS **`c2c4836`**, blob **`7919e6ebce2f9671987a03c11eaa173abedc7b6b`**, byte **2302987**, SHA **`2df56ba3…`**, cmp PASS, HTTP **200**, contenitore e helper metriche presenti.

**QA operatore PASS (P5-B2-D):** «**QA POLY-PARITY-P5-B2-D PASS operatore**» — riepilogo solo in drawing; 0/1→`—`; 2→perimetro segmento; ≥3→area+perimetro chiuso; live update; nascosto Annulla/successo; nuovo drawing da zero; IT↔EN preserva draft; nome P5-B2-C invariato; P5-B2-A/B/C senza regressioni. **Limitazione:** cambio unità di misura non disponibile nel flusso generale — **non verificato** in QA P5-B2-D (intervento separato).

**P5-B2-E (`aea7434`, blob `8d17497…`):** `#polygonPanelRemoveLastBtn` + `polygonRemoveLastDraftPoint()` + `polygonSyncRemoveLastPointUi()`; unica mutazione `.pop()` su `_polygonDraftVertices`; `_polygonDraftLastClick = null`; refresh overlay+metriche; nome draft invariato; errore non nascosto; chiave IT/EN `removeLastPoint`; `polygonFinishDraw`/`!added`/metriche byte-invariati.

**Review Claude P5-B2-E:** **NON RICHIESTA** — mutazione transiente draft; sanitizer/create-path/CRUD invariati; nessun nuovo campo persistito.

**Deploy VPS PASS (P5-B2-E):** pull FF `c2c4836`→`aea7434`, HEAD VPS **`aea7434`**, blob **`8d17497a556a9be9ab8fa30c27120083e3f2ad06`**, byte **2304409**, SHA **`6bd47463…`**, cmp PASS, HTTP **200**, singola `.pop()` confermata.

**QA operatore PASS (P5-B2-E):** «**QA POLY-PARITY-P5-B2-E PASS operatore**» — pulsante solo in drawing; disabled/enabled; rimozione ultimo vertice; overlay/metriche; nome preservato; errore non nascosto (storico pre-P5-B2-F); P5-B2-A/B/C/D senza regressioni. **Limitazione unità:** non verificata (invariata).

**P5-B2-F (`739bf49`, blob `ba8a7f0…`):** `polygonHideDrawErr()` dopo push vertice valido (handler polygon draw in `attachPanHandlers`) e dopo `.pop()` riuscita in `polygonRemoveLastDraftPoint()`; helper esistente; no-op non nascondono errore; `polygonFinishDraw` e ramo `!added` byte-invariati; nessuna i18n/HTML/CSS; sanitizer/create-path/CRUD invariati; diff +2.

**Review Claude P5-B2-F:** **NON RICHIESTA** — stato transiente; sanitizer/create-path/CRUD invariati; nessun nuovo campo persistito.

**Deploy VPS (P5-B2-F):** già coperto indirettamente da deploy P-STYLE-E — HEAD VPS **`0a51379`**, monolite **`8d13e41a…`** (include runtime **`739bf49`**); **nessun nuovo deploy** in blocco docs-only chiusura. Nota storica «Deploy VPS NON ESEGUITO» **stale** — corretta.

**QA operatore PASS (P5-B2-F):** «**QA POLY-PARITY-P5-B2-F PASS operatore**». **P5-B2-F CLOSED / PASS end-to-end.**

**P5-B2-G:** ramo `verts.length < 3` → `polygonCancelDraw()` — comportamento **preesistente**; irraggiungibile da UI ordinaria; **covered** senza runtime aggiuntivo.

**P5 complessivo:** **CLOSED / PASS end-to-end** (B1…B2-G covered).

**Backlog tecnico separato (non bloccante, NON landed):** micro-fix multi-touch P2 — guardia `if (mapPolyEditDocDrag || mapPolyMoveDocDrag) return`; finding review P4-B1; futuro blocco runtime Ramo B + review byte Claude prima deploy. **Non** parte di P5-B2-F.

**Invariati:** P1–P4/P7/A1/A2 CLOSED; P2/P3/P3-ADD/P4 pipeline; sanitizer; storage; import/export; **`APP_BUILD_ID` `B5.5Z`**.

### POLY-PARITY-P3-ADD — Inserimento vertice su un lato in Modifica

**Stato:** **CLOSED / PASS end-to-end** — runtime **`5df925f`**; deploy VPS PASS; **QA operatore PASS** («QA POLY-PARITY-P3-ADD PASS operatore»).

**Implementazione (monolite):**

- `polygonInsertEditVertex(index)` — `splice(i+1,0,mid)` su `_polyEdit.working`; wrap ultimo lato (`i=n-1` → append in coda, ring aperto);
- `polygonGeodesicMidpointLonLat` — Vincenty inverse + direct a metà distanza; `normalizeLon` + `round(,7)`; niente media aritmetica lon/lat;
- pulsante `+` ghost per lato in `renderPolygonEditInfo` (cella `.poly-edit-leg-actions` con `✕` P3);
- gate cap **`POLYGON_RING_VERT_CAP` 500** (coerente `gisSanitizeGeometry`);
- i18n `editInsertVertex` / `editMaxVertices` / `editInsertVertexInvalid` IT/EN/FR;
- dirty + overlay A1 via `polygonRefreshEditUi`; nessun CRUD fino a Salva; una `gisFeatureUpdate` su Salva.

**Deploy VPS PASS:** HEAD documentale **`75229c9`**, runtime servito **`5df925f`**, byte **2285990**, SHA **`760772d2…`**, cmp PASS, HTTP **200**, `goi-gis-app` active/enabled.

**QA:** `+` lato interno e ultimo→primo; handle/drag/info live; Annulla immediato; Salva + riapertura; insert + `✕`; IT/EN/FR.

**Invariati:** `polygonSaveEdit`; `polygonDeleteEditVertex`; P2 drag; P3/P3-FIX; P7 metadata/UI; A1/A2; **`APP_BUILD_ID` `B5.5Z`**.

### POLY-PARITY-P3 — Cancellazione vertice in Modifica

**Stato:** **CLOSED / PASS end-to-end** — runtime **`fc38247`** + **P3-FIX `6083abe`**; deploy VPS PASS; **QA operatore PASS** («QA POLY-PARITY-P3-FIX PASS operatore»).

**Implementazione (monolite):**

- `polygonDeleteEditVertex(index)` — splice su `_polyEdit.working`; gate `length > 3`; `mapPolyEditDocDragCleanup` prima della mutazione;
- pulsante ✕ per vertice iniziale su ogni riga lato in `renderPolygonEditInfo` (pattern Tracce `tp-rm`);
- `polygonShowEditBarErr` / `editMinVertices` i18n IT/EN/FR;
- dirty via `polygonRecomputeEditDirty`; refresh UI + overlay A1;
- nessun CRUD/`saveStore` fino a Salva; `polygonSaveEdit` invariato.

**P3-FIX (`6083abe`):** `polygonInvalidateEditOverlayRefresh` + `polygonSyncRenderMapAfterEditEnd` in `polygonEditCancelHandler`; dedup redraw in `closePolygonPanel` (pattern A2-B2-FIX). Deploy VPS PASS (byte **2281832**, SHA **`46d265c6…`**). QA: Annulla → ripristino immediato senza pan; Salva e chiusura pannello OK.

**Invariati:** P2 drag; P7 metadata/UI date; A1/A2; lista principale; **`APP_BUILD_ID` `B5.5Z`**.

## Decisioni da bloccare prima di iniziare

- Cosa significa esattamente “non funziona”: non si apre, non disegna, non salva, non esporta, non calcola area.
- Se la feature deve restare autonoma o diventare sottovoce di Tracce.
- Soglia di accettazione: fix minimo o revisione UX completa.

## Dipendenze

- Precede WU-0007 blocco “Poligoni dentro Tracce”.
- Se si decide rimozione, WU-0007 dovrà rimuovere/assorbire la voce invece di spostarla.

---

# WU-0007 — UX toolbar laterale e razionalizzazione strumenti

## Scopo

Ridurre ingombro e disordine della toolbar laterale, correggere allineamenti e raggruppare strumenti correlati.

È una WU mista: alcuni blocchi sono cosmetici, altri cambiano struttura UI e wiring.

## Tipo

**Misto.**

- B1-B3 sono prevalentemente **cosmetici / Cursor diretto**, salvo impatto JS.
- B4-B8 sono **sensibili / layering UI + state wiring — pipeline.**

### Stato finale WU-0007 — Toolbar GIS

**Stato:** PASS.

- B1 — Pulsanti più piccoli: PASS (`e4c2be3`).
- B2 — Layers allineato: PASS (`e4c2be3`).
- B3 — GPS label + colore qualità: PASS (`c051ee1`).
- B4 — Distanza → righello: PASS (`54d8586`).
- B5 — Waypoint / Posiziona punto / Torna al punto in gruppo espandibile: PASS (`7a02a7e`).
- B6 — Poligoni dentro Tracce: PASS (`e8395e9`).
- B7 — MGRS dentro Layers: PASS (`74d3f32`).
- B8 — Range & Bearing dentro Tracce: PASS (`fa12567`).

Esito:

- Toolbar GIS più compatta.
- Pulsanti principali più leggibili.
- Accessi secondari raggruppati in flyout coerenti (Tracce, Waypoint).
- Poligoni e Range & Bearing accessibili da Tracce senza fusione dei dati.
- MGRS accessibile da Layers come overlay locale.
- Nessuna modifica intenzionale a modelli dati waypoint/tracce/poligoni.
- Nessun GPS silenzioso o live tracking introdotto.
- Validazione operativa per blocco durante implementazione; blocco formale B9 (QA integrata unica) non eseguito separatamente.

## Blocchi

### B0 — Docs WU e inventario UI

Aprire WU-0007. Prima analisi read-only:

- regioni HTML/CSS della toolbar;
- handler JS dei pulsanti;
- data-i18n coinvolti;
- relazione con pannello Layers, GPS, distanza, waypoint, tracce, MGRS, range/bearing;
- eventuali sovrapposizioni con barra cache al cambio zoom.

### B1 — Pulsanti più piccoli

**Stato:** PASS (`e4c2be3`).

Obiettivo: ridurre dimensione o padding dei pulsanti laterali che coprono la barra cache al cambio zoom.

Classificazione: **cosmetico / Cursor diretto**, se limitato a CSS.

Dipendenze: B0.

Decisione da bloccare:

- riduzione solo dimensioni;
- nessun cambio di posizione generale mappa/pannelli.

### B2 — Layers disallineato

**Stato:** PASS (`e4c2be3`).

Correggere allineamento visivo del pulsante Layers.

Classificazione: **cosmetico / Cursor diretto**, se solo CSS.

Dipendenze: B0.

Decisione da bloccare:

- mantenere icona stack/layers;
- non cambiare logica del pannello Layers.

### B3 — GPS icona → scritta con colore qualità segnale

**Stato:** PASS (`c051ee1`).

Trasformare GPS da icona a scritta, con colore che rappresenta qualità segnale.

Classificazione: **sensibile medio / pipeline leggera**, perché non è solo CSS: serve capire dove vive lo stato qualità GPS e non introdurre live tracking.

Dipendenze:

- B0;
- vincolo: nessun GPS silenzioso e nessun live tracking senza decisione esplicita.

Decisioni da bloccare:

- testo esatto: `GPS`, `POS`, `FIX`, oppure altro;
- scala colori: nessun fix / scarso / medio / buono;
- da quale metrica derivare qualità: accuracy, timestamp, stato ultimo fix;
- comportamento prima del primo fix.

### B4 — Distanza → righello

**Stato:** PASS (`54d8586`).

Convertire lo strumento distanza in icona/strumento righello.

Classificazione: **cosmetico se solo icona/testo; pipeline se cambia handler o pannello**.

Dipendenze: B0.

Decisioni da bloccare:

- usare simbolo testuale semplice o icona già esistente;
- mantenere identico handler distanza;
- non fondere ancora con range/bearing.

### Estensione backlog — Measurement label collision avoidance (Distanza/Righello)

**WU-0007 B4** (`54d8586`) resta **PASS** invariato.

**WU-0007 B4X1 — implementato runtime** (`debd5b4`); **QA operatore: FAIL** — pill/background non sempre allineato al testo definitivo; offset troppo aggressivo su segmenti quasi nulli.

**WU-0007 B4X2 — implementato runtime** (`d4b73bb`); **QA operatore: PASS**; deploy HEAD **`f5854c3`**; smoke tecnico HTTP 200, byte-match e SHA-256 match; **`APP_BUILD_ID` `B5.5Z`**.

**Measurement label collision avoidance — CLOSED / PASS end-to-end** (B4X2 operatore). Nessun fix aperto su questo tema.

**Contesto monolite:** overlay misura `renderMapMeasureOverlay()`; etichette segmento linea `.tile-measure-overlay` / `.mm-label`; riepilogo poligono (centroide) **escluso**.

**Implementazione B4X1** (`debd5b4`):
- helper `mmEstimateLabelPillSize`, `mmMeasurePillDimsFromTextEl`, `mmLineLabelNormalOffset`;
- offset normale dinamico su segmenti corti in pixel.

**Fix B4X2:**
- `layoutPill()` — unica fonte `{ rw, rh }` per rect e offset; `requestAnimationFrame` aggiorna background **prima** del posizionamento finale;
- guard `g.isConnected` nel callback;
- tuning offset: `MM_LINE_LBL_CLEAR_GAP` **3** (era ~5); `MM_MEAS_HANDLE_CLR` **18** (era 22); `MM_LINE_LBL_SHORT_GAIN` **0.20** (era 0.42); `MM_LINE_LBL_MAX_OFF` **84** (era 150); base **14** invariata.

**QA operatore B4X2 PASS** (attestazione «QA WU-0007 B4X2 PASS operatore»): pill racchiude il testo; segmento lungo correttamente posizionato; segmento quasi nullo senza offset eccessivo; linea, marker S/E e freccia visibili; zoom, drag, Esc e Clear verificati; app utilizzabile.

### WU-0007 T1 — Unità distanza/velocità modal Traccia

**Stato:** **CLOSED / PASS end-to-end**.

**Runtime:** `002624e` — selettore persistente `trackDisplayUnit` (`km` | `nm` | `mi`, default `km`); helper `formatTrackDistance` / `formatTrackSpeed`; archivio tracce disaccoppiato da `mapMeasureUnit`; etichette ETA con velocità di riferimento dinamica; normalizzazione UI `NM` in stringhe visibili (Misura, scala, helper distanza misura).

**Deploy:** HEAD **`d533e8b`** — smoke tecnico HTTP 200; Content-Length/byte **2 235 808**; SHA-256 file VPS = body HTTP **`d8bc2b49e6bf1a90402c189995b53d630277fb7d8fd96b0dff1787fc218775f2**; marker T1 presenti; **`APP_BUILD_ID` `B5.5Z`**.

**Non in scope T1 (originale):** float mappa esterno — esteso da **T1-FLOAT** (sotto); statistiche velocità media/massima misurate, geometria/import/export/storage tracce.

**QA operatore PASS** (attestazione «QA WU-0007 T1 PASS operatore»): selettore `km`/`NM`/`mi` verificato; summary, segmenti, leg chiusura e archivio aggiornati; label ETA coerenti in `km/h`/`kn`/`mph`; tempo ETA invariato al cambio unità; persistenza al reload; funzionamento traccia regolare; UI `NM` corretta; nessuna regressione operativa pertinente.

**Backlog futuro — velocità di pianificazione ETA configurabile** (non implementato; nessuna WU runtime aperta):

1. Possibilità futura di modificare la **velocità generale** usata per il calcolo ETA (pianificazione, non misura).
2. Possibilità futura di assegnare una **velocità specifica a ogni singola tratta/segmento**.
3. Velocità canonica fisica (es. m/s o km/h interni) **indipendente** dall’unità di visualizzazione `trackDisplayUnit`.
4. Visualizzazione automatica coerente con `trackDisplayUnit`: `km/h`, `kn`, `mph`.
5. Fallback per tratta: velocità specifica del segmento se presente, altrimenti velocità generale della traccia.
6. Nessuna dipendenza da velocità GPS misurata o timestamp, salvo decisione futura esplicita.
7. Valori attuali **4 km/h** (cammino) e **60 km/h** (auto) restano invariati fino a implementazione dedicata.
8. Distinto da statistiche **misurate** (velocità media/massima da timestamp GPX): fuori scope T1 e non parte di questo backlog come implementato.

### WU-0007 T1-FLOAT — Float Traccia coerente con `trackDisplayUnit`

**Stato:** **CLOSED / PASS end-to-end**.

**Runtime:** `e92e301` — float mappa esterno allineato a `trackDisplayUnit` (`km` | `nm` | `mi`).

**Scope:** allineare il float mappa esterno (`.tile-track-float`, `[data-role="track-float-out"]`) all’unità distanza del modal Traccia (`trackDisplayUnit`), senza toccare Misura né il modal.

**Implementazione (monolite):**

- `updateTrackMapFloatReadout()` — `formatTrackDistance` + `normalizeTrackDisplayUnit(state.trackDisplayUnit)`.
- Markup float in `renderTileMap()` — picker `[data-role="track-float-unit"]` con sole opzioni `km`, `nm` (label `NM`), `mi`.
- Listener float — scrive `state.trackDisplayUnit`, `saveStore()`, `updateTrackMapFloatReadout(root)`; **rimossi** write su `mapMeasureUnit` e side-effect Misura (`renderMapMeasureOverlay`, `updateMeasureReadouts`, `renderTrackOverlay`).

**Invariati:** modal Traccia (`wireTrackDisplayUnitOnce`, `renderTrackSummary`, archivio), listener `measure-unit` / `gis-meas-unit`, geometria/import/export, ETA, i18n aggiuntivo, CSS, `APP_BUILD_ID` **`B5.5Z`**.

**Deploy:** HEAD **`8995239`** — deploy GIS-only **PASS**; VPS allineata; blob Git monolite **`7c5350e0a1888317a0fc717e01f6c085ba579091`**; smoke HTTP **200**; byte file VPS = Content-Length = body HTTP **2 243 669**; SHA-256 file VPS = body HTTP **`2e4afcea5160f584fe11f8487854218941120dd6a55878cdeda5e2268e3dd362**; `goi-gis-app.service` riavviato (PID post-restart **324062**); ascolto **100.114.7.53:8000**; proxy invariato (PID **47062**); Planet-Clone, Docker e n8n non toccati; URL QA `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=e92e301`; **`APP_BUILD_ID` `B5.5Z`**.

**Fuori scope T1-FLOAT:** velocità nel float; statistiche velocità misurate.

**QA operatore PASS** (attestazione «**QA WU-0007 T1-FLOAT PASS operatore**»):

1. picker float `km`/`NM`/`mi` — readout distanza aggiornato immediatamente;
2. Measure box — unità indipendente, non cambia con il float;
3. modal Traccia riaperta — selettore coerente con unità impostata nel float.

### B5 — Pulsante espandibile Waypoint a 3 azioni

**Stato:** PASS (`7a02a7e`).

Raggruppare:

- Waypoint;
- posiziona punto;
- torna al punto;

in un pulsante espandibile a 3, con azione principale = nuovo waypoint.

Classificazione: **sensibile / pipeline**.

Motivo: cambia struttura UI, handler, stato aperto/chiuso, accessibilità operativa, rischio regressioni waypoint.

Dipendenze:

- B0;
- meglio dopo B1-B4, perché prima va stabilizzata la toolbar.

Decisioni da bloccare:

- click principale = nuovo waypoint;
- secondarie in menu espandibile;
- chiusura menu al click fuori o al secondo click;
- comportamento mobile/touch;
- i18n IT/EN/FR;
- nessun cambiamento a `state.mapWaypoints[]` come fonte canonica.

### B6 — Poligoni dentro Tracce

**Stato:** PASS (`e8395e9`).

Spostare o assorbire la voce Poligoni dentro Tracce.

Classificazione: **sensibile / pipeline**.

Dipendenze obbligatorie:

- WU-0006 completata;
- se WU-0006 decide rimozione, questo blocco diventa rimozione UI o nota “decaduto”.

Decisioni da bloccare:

- poligoni come sottostrumento di Tracce;
- nome UI: “Tracce” contiene anche poligoni/aree;
- se poligoni rimane distinto nello state model o viene solo spostato in UI;
- evitare refactor ampio.

### B7 — MGRS dentro Layers come overlay

**Stato:** PASS (`74d3f32`).

Spostare MGRS in Layers come overlay.

Classificazione: **sensibile / layering UI — pipeline**.

Motivo: “Layers” gestisce basemap/overlay; MGRS come overlay deve rispettare forced-offline/OPSEC se genera rete, oppure dichiarare che è solo overlay locale se non usa rete.

Dipendenze:

- B2 Layers allineato;
- WU-0005 governance online/offline;
- prima di WU-0008 basemap multipli, così Layers è già pronto.

Decisioni da bloccare:

- MGRS è overlay locale o dipende da tile/rete?
- toggle indipendente o opzione nel pannello Layers;
- persistenza stato overlay;
- i18n.

### B8 — Range & Bearing dentro Tracce

**Stato:** PASS (`fa12567`).

Spostare Range & Bearing dentro Tracce.

Classificazione: **sensibile / pipeline**.

Dipendenze:

- B0;
- possibilmente dopo B6, perché entrambi razionalizzano il gruppo Tracce.

Decisioni da bloccare:

- Range & Bearing resta strumento autonomo richiamato da Tracce;
- nessun cambio al calcolo;
- evitare conflitto con distanza/righello;
- i18n.

### B9 — QA integrata toolbar

Verifiche finali:

- toolbar non copre barra cache al cambio zoom;
- Layers allineato;
- GPS non parte da solo;
- distanza funziona;
- waypoint/posiziona/torna al punto funzionano;
- poligoni coerente con decisione WU-0006;
- MGRS toggle nel posto corretto;
- Range & Bearing accessibile;
- `node --check`;
- docs/autosync.

## Dipendenze principali

- WU-0006 prima di B6.
- WU-0005 prima di B7.
- WU-0007 prima di WU-0008, perché WU-0008 aggiunge contenuto a Layers.

---

# WU-0008 — Basemap multipli XYZ aperti nel monolite

## Scopo

Aggiungere basemap aperti nel solo monolite:

- OSM-HOT;
- CARTO Voyager;
- OpenTopoMap.

La WU deve mantenere il modello radio basemap: una base sempre attiva, nessuno stato “basemap nascosta”, coerente con la chiusura WU-0004.

## Tipo

**Sensibile / layer + OPSEC + cache — pipeline.**

Motivo: tocca catalogo layer, fetch tile, offline mode, OPSEC strict, UI Layers e forse cache/offline maps.

### Stato WU-0008 — Basemap aperti: PASS end-to-end

**Stato:** PASS runtime end-to-end per **8a**, **8b**, **8c-A**, **8c-B**, **8d-B0**, **8d-B1**, **8d-B**; EOX Sentinel-2 cloudless incluso; browser QA PASS. Vedi Piano espansione e ordine operativo dettagliato (pos. 30).

Commit 8a:

- `cf6d796 feat(gis): add OSM HOT and normalize open XYZ basemaps (WU-0008)`

Commit 8b:

- `dad28b4 feat(gis): add CyclOSM and OSM standard basemaps (WU-0008 8b)`

Esito 8a:

- OSM HOT aggiunto come basemap XYZ aperto.
- CARTO Voyager normalizzato con label e `maxZoom: 20`.
- OpenTopoMap già presente: mantenuto/normalizzato senza duplicazione.
- `resolveCatalogLayerId` aggiornato per attivazione `osmHot`.
- Modificato solo `coordinate_converter Claude.html`.
- Nessuna modifica a docs/README nel commit runtime.

Esito 8b:

- CyclOSM aggiunto (cache/offline come altri basemap internet).
- OpenStreetMap standard aggiunto (online-only, `cacheable: false`).

Gate e governance (8a/8b):

- I layer aperti restano classificati/gateati come basemap internet secondo lo schema del monolite.
- Devono passare dal flusso esistente `tileFetchAllowed(layerId)`.
- `state.forceOffline` resta interruttore volontario dell'operatore.
- `state.opsecStrict` resta gate superiore.
- Cache/offline maps ed export mappa devono continuare a usare il flusso esistente e i limiti `maxZoom` del layer.

Validazione operativa riportata:

- test a schermo eseguito;
- commit e push completati;
- branch `main...origin/main` pulito/allineato.

Fuori scope:

- WU-0009 Google/Bing proxy;
- proxy Planet-Clone;
- modifiche a geocoding;
- modifiche a OPSEC/gate runtime;
- cancellazione cache/tile esistenti.

Espansione completata: vedi **Piano espansione basemap WU-0008** — **8c** (Esri, prereq `tileScheme`/y-order) e **8d** (EOX Sentinel-2 cloudless) **PASS**.

### Piano espansione basemap WU-0008

**Stato:** roadmap operativa a blocchi.

#### 8a — Basemap XYZ aperti iniziali

**Stato:** landed / PASS runtime (`cf6d796`).

Scope:

- OSM HOT.
- CARTO Voyager.
- OpenTopoMap:
  - già presente;
  - normalizzato;
  - non duplicato.

Note:

- XYZ puro `{z}/{x}/{y}`.
- Nessun y-flip.
- Layer internet governati dai gate esistenti:
  - `tileFetchAllowed(layerId)`;
  - `state.forceOffline`;
  - `state.opsecStrict`.

#### 8b — CyclOSM + OSM standard

**Stato:** landed / PASS runtime (`dad28b4`).

Scope:

- CyclOSM:
  - XYZ puro;
  - cacheabile come gli altri basemap internet, seguendo il pattern OpenTopoMap;
  - evitare indicazioni che incoraggino bulk aggressivo.
- OpenStreetMap standard:
  - XYZ puro;
  - host singolo `tile.openstreetmap.org`;
  - niente subdomain `a/b/c.tile.openstreetmap.org`;
  - **ONLINE-ONLY** per download/bulk offline;
  - non va offerto per bulk cache/offline, in coerenza con policy OSMF;
  - esclusione via `cacheable: false` sul layer (pattern già presente nel monolite).

Vincoli:

- Nessun secondo catalogo.
- Nessun refactor motore tile.
- `maxZoom` per layer:
  - CyclOSM: circa 20;
  - OSM standard: circa 19.
- Se lo schema layer supporta `maxZoom`/`minZoom`, popolarli.
- Se lo schema non li supporta, non inventare schema: segnalare e usare default esistente.

#### 8c — Famiglia Esri

**Stato:** **8c-A PASS** (`cddc565`); **8c-B PASS** runtime (monolite). Ocean Reference / EOX restano fuori scope.

##### 8c-A — tileScheme / y-order (prerequisito motore)

**Stato:** PASS runtime (`cddc565`).

Esito:

- helper `normalizeTileScheme`, `formatTilePath`, `buildTileUrl`;
- `tileScheme` default `xyz` → URL `{z}/{x}/{y}`; `zyx` / `esri` → `{z}/{y}/{x}`;
- layer `sat` (Esri World Imagery già esistente) migrato a `urlBase` + `tileScheme: "zyx"` — stesso URL effettivo;
- call site centralizzati: `loadTileImageForOfflineExport`, `fetchAndStoreTile`, `hydrateMapTiles`, `hydrateSonarChartTiles`;
- `makeTileKey` e chiavi cache invariate; gate OPSEC/offline invariati;
- nessun nuovo layer Esri; nessuna modifica UI Layers.

##### 8c-B — layer Esri catalogo

**Stato:** PASS runtime (monolite).

Esito:

- aggiunti 5 layer: `esriTopo`, `esriStreet`, `esriHillshade`, `esriRelief`, `esriOceanBase`;
- `urlBase` + `tileScheme: "zyx"`, `external: "internet"`, `cacheable: false` (no bulk offline);
- menu Layers: topo/strade/hillshade/relief in Topografica; Ocean Base in Nautica; `sat` in Satellitare invariato;
- i18n IT/EN/FR; endpoint ArcGIS REST verificati HTTP 200;
- **non** aggiunti: World Imagery (già `sat`), Ocean Reference, EOX, proxy.

maxZoom conservativi: Hillshade 15, Shaded Relief 13, Ocean Base 16, Topo/Street 19.

##### 8c-B backlog (escluso da 8c-B)

Layer non implementati in questo blocco:

- Esri World Hillshade — **PASS** (`esriHillshade`).
- Esri World Shaded Relief — **PASS** (`esriRelief`).
- Esri World Imagery — già `sat`.
- Esri World Topo — **PASS** (`esriTopo`).
- Esri World Street — **PASS** (`esriStreet`).
- Esri Ocean Base — **PASS** (`esriOceanBase`); Ocean Reference escluso (overlay/reference).

Prerequisito tecnico:

- ~~supporto per y-order `{z}/{y}/{x}` tramite flag per-layer, ad esempio `tileScheme`~~ — **8c-A PASS**;
- il supporto `tileScheme` va implementato e testato PRIMA di aggiungere i layer Esri — **soddisfatto da 8c-A**; **8c-B PASS** (catalogo layer + UI).

Motivo:

- è una modifica al motore tile, quindi deve essere blocco isolato con test dedicati;
- una volta introdotto il flag per-layer, i layer Esri diventano economici perché condividono schema simile.

Vincoli:

- non rompere i layer XYZ `{z}/{x}/{y}`;
- non alterare cache/offline/export senza test;
- rispettare `tileFetchAllowed(layerId)`, `state.forceOffline`, `state.opsecStrict`.

#### 8d — EOX Sentinel-2 cloudless

**Stato:** **PASS** end-to-end — **8d-B0 PASS**, **8d-B1 PASS** (A/B1/B2/B3), **8d-B PASS** runtime + browser QA operatore (`2ca47b6`); layer `eoxS2Cloudless` incluso.

##### 8d-B0 — browse-cache guard `cacheable:false` (prerequisito EOX)

**Stato:** PASS runtime (monolite, sessione `finito` 2026-06-15).

Implementato:

- helper `parseTileKeyLayerId(tkey)` accanto a `makeTileKey`;
- guard generale fail-open in **`cacheTileFromDisplay`** (sink unico, non nei chiamanti);
- blocca persistenza IndexedDB browse-cache se `TILE_LAYERS[layerId].cacheable === false`;
- layerId dalla chiave tile (`tkey`), non `state.mapLayer`;
- layer ignoto/non in `TILE_LAYERS` → fail-open (comportamento cache invariato);
- copre osmStandard, Esri 8c-B, futuri online-only (EOX);
- precache/bulk/export mosaic guard preesistenti invariati; rendering online invariato.

QA: `node --check` OK; browser QA IndexedDB before/after consigliato operatore.

##### 8d-B1 — offline UX / cache per-layer / maxZoom

**Stato:** **8d-B1-A PASS** (diagnosi); **8d-B1-B1 PASS**; **8d-B1-B2 PASS**; **8d-B1-B3 PASS** runtime; **8d-B PASS**.

###### 8d-B1-A — diagnosi read-only

**Stato:** PASS (nessuna patch runtime).

###### 8d-B1-B1 — badge + pannello neutro

**Stato:** PASS runtime (`29ebf3a`).

###### 8d-B1-B2 — stats cache per-layer

**Stato:** PASS runtime (monolite, `finito` 2026-06-15).

Esito:

- `getLayerTileCacheStats(layerId)` — cursor store `tiles`, filtro `layerId + ":"`, somma `b.byteLength`.
- UI `#pcLayerCacheStat` nel pannello offline; i18n IT/EN/FR; loading/zero/stats.
- Scan O(n) **solo on-demand** (apertura pannello, cambio `#pcLayer`, post-precache, clear cache); anti-race `_layerCacheStatsGen`.
- Guard `isLayerOfflineUnavailable`; nessun hook pan/zoom/timer.
- `node --check` OK.

###### 8d-B1-B3 — zoom-guard fit-area

**Stato:** PASS runtime (monolite, `finito` 2026-06-15).

Esito:

- `clampBasemapFitZoom(z)` — layerId via `sanitizeMapLayer(state.mapLayer)`; maxZoom da `TILE_LAYERS[layerId]`.
- Applicato a `flyMapToTrackPoints` (1 pt + bbox multi) e `flyMiniMapToOfflineNamedAreaById`.
- Fallback 18 solo se `maxZoom` non numerico (compat); overlay non toccati.
- GPS recenter e restore boot `mapZoom` fuori scope (compat legacy).
- `node --check` OK.

###### 8d-B1 follow-up / EOX prerequisites (debiti)

**Debito 1 — `OFFLINE_LAYER_IDS` manuale vs `cacheable` — ~~prerequisito EOX~~ RISOLTO in 8d-B1-B1**

- ~~`OFFLINE_LAYER_IDS` oggi include layer derivati manualmente~~ → ora derivato da `!isLayerOfflineUnavailable(id)` su `MAP_BASE_LAYER_IDS` + `sonarchart`.
- EOX può procedere; lista offline non più manuale; stats per-layer **PASS** (B1-B2).

**Debito 2 — fit-area `Math.min(18,z)` hardcoded — ~~blocco zoom-guard~~ RISOLTO in 8d-B1-B3**

- ~~Helper fit-area ignorano `layer.maxZoom`~~ → `clampBasemapFitZoom` su fit traccia e area offline; basemap da `state.mapLayer`.
- es. `esriRelief` maxZoom 13: fit-area non supera z13.
- Overlay non clampano zoom globale basemap (invariato).

##### 8d-B — layer EOX

**Stato:** **PASS** runtime + **Browser QA operatore PASS** (`2ca47b6`) — layer `eoxS2Cloudless` implementato nel monolite; pre-check prerequisiti PASS (HEAD `9f98c5d`).

###### Implementazione runtime (WU-0008 8d-B)

| Aspetto | Valore |
|---|---|
| Layer id | `eoxS2Cloudless` |
| Endpoint | `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg` |
| Schema tile | `urlBase` + `tileScheme: "zyx"` + `urlSuffix: ".jpg"` (motore 8c-A esistente) |
| `external` | `internet` |
| `cacheable` | `false` (online-only; escluso da `OFFLINE_LAYER_IDS`, precache, export JPG, browse-cache IDB) |
| `maxZoom` | `18` (conservativo; fit-area via `clampBasemapFitZoom`) |
| Licenza | CC BY-NC-SA 4.0 / uso non-commerciale |
| Attribution | Sentinel-2 cloudless — s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2024) |
| Gate host | **Fail-closed allowlist** — `isPrivateEoxHostAllowed()` / `eoxLayerAllowedOnCurrentHost()`: `localhost`, `127.0.0.0/8`, `100.64.0.0/10`, `::1`; hostname vuoto/`file://` → DENY; host pubblico/sconosciuto → DENY |
| Gate fetch autoritativo | `tileFetchAllowed(layerId)` — nega `eoxS2Cloudless` se host non allowlisted (prima di forceOffline/OPSEC) |
| UI | Sezione Satellitare Layers — voce EOX solo se `eoxLayerAllowedOnCurrentHost()` (difesa in profondità) |
| `sanitizeMapLayer` | fallback a `osm` se EOX persistito su host non ammesso |
| Endpoint live | HTTP 200 + `image/jpeg` + `access-control-allow-origin: *` (curl 2026-06-15) |
| Test | `node --check` JS inline OK; **Browser QA operatore PASS** |

**Deploy pubblico:** anche se il monolite viene copiato su Firebase/VPS pubblico via `scripts/deploy-hosting.ps1`, EOX **non fetcha** e **non compare** in UI su host non allowlisted (gate runtime, non blocklist deploy).

###### Browser QA operatore — PASS (post-`2ca47b6`)

- **localhost:** EOX visibile in Layers → Satellitare e tile caricano.
- **tailnet `100.110.35.23`:** EOX visibile e tile caricano.
- **forced-offline ON:** nessun fetch EOX.
- **OPSEC strict ON:** nessun fetch EOX.
- **Mappe offline / bulk:** EOX non scaricabile (online-only).
- **host non allowlisted `192.168.1.108`:** EOX non visibile in UI.
- **`192.168.1.108` + EOX forzato manualmente:** nessun fetch tile EOX.

###### Pre-check read-only prerequisiti EOX — PASS a HEAD `9f98c5d`

**PRE-CHECK 1 — `OFFLINE_LAYER_IDS` derivato / offline eligibility:** PASS.

- Set offline-eligible effettivo: `osmHot`, `cyclosm`, `osm` (CARTO Voyager), `topo` (OpenTopoMap), `sat`, `nav`, `sonarchart`.
- Esclusi perché `cacheable:false`: `osmStandard`, `esriTopo`, `esriStreet`, `esriHillshade`, `esriRelief`, `esriOceanBase`.
- Nota: `sat` resta offline-eligible per design corrente (Esri World Imagery, non marcato `cacheable:false`).
- Gate verificati: precache, export offline JPG, browse-cache IndexedDB, stats/contatori escludono i `cacheable:false`.

**PRE-CHECK 2 — fallback 18 / fit-area / offline-area:** PASS.

- `clampBasemapFitZoom` legge `TILE_LAYERS[id].maxZoom`; fallback 18 ammesso solo se `maxZoom` non numerico.
- Percorsi fit-area/offline-area rilevanti usano `clampBasemapFitZoom` (`flyMapToTrackPoints`, `flyMiniMapToOfflineNamedAreaById`).
- Residui opzionali/non bloccanti: GPS `requestGisMapCurrentLocation` (~22487), `loadStore` mapZoom (~44519); entrambi fuori fit-area; coperti dal clamp globale `renderTileMap` (~30940).

**Esito pre-check:** prerequisiti EOX soddisfatti a HEAD `9f98c5d`; **non serve rifare** pre-check prima del blocco runtime.

**Vincoli bloccanti nel prompt EOX runtime (parcheggiato):** licenza/hosting; CC BY-NC-SA / non-commerciale; esclusione deploy pubblici (Firebase web.app, VPS staging `/gis/`, altri deploy pubblici); online-only; `cacheable:false`; no bulk/offline; `maxZoom` numerico conservativo (≤18; Sentinel-2 10 m nativo).

Scope:

- EOX Sentinel-2 cloudless.
- Satellite alternativo non-US per ridondanza/cross-check.

Vincoli:

- ONLINE-ONLY.
- WMTS / y-order.
- Rate-limited.
- Niente bulk cache.
- Utile come layer satellite alternativo, non come sorgente bulk offline.

Note:

- richiede prima supporto tecnico compatibile nel loader;
- non va mischiato ai layer XYZ puri.

### Backlog metodo — Adozione metodo / handoff discipline (post-catena 8d)

**Stato:** candidato backlog processo (non WU tecnica aperta; non runtime GIS; distinto da WU-0008 e WU-0009); **Blocco 0 PASS**; **Blocco B PASS** (`f2099c4`); **Fase C PASS** (`c691b8b`); **Fase D PASS** (`efaf77b`); **Fase E PASS** (`41411ec`); **Fase F1 PASS** (`5c59346`); **Fase F2 PASS** (`47b0016`); **Fase F3 PASS** (`d69b100`); **METHOD-BUNDLING-DEFAULT PASS** (`93f188a`, 2026-06-28); **METHOD-QA-PASS-AUTO-FINITO PASS** (`78ea6c9`/`bacabef`, 2026-06-28).

**Fonte frozen per adozione metodo:** `mrhz1973/control-plane` `main` a SHA `df046f68867cdffcd350592a2781b53ce21ca8c0` (verificato con `git ls-remote https://github.com/mrhz1973/control-plane.git refs/heads/main`). Le fasi C–F copieranno/adatteranno forme operative da questo SHA; avanzare a uno SHA successivo richiede re-sync esplicito, non drift silenzioso.

**Gerarchia fonti metodo:** control-plane @ SHA `df046f68867cdffcd350592a2781b53ce21ca8c0` = unico riferimento vivo/avanzato congelato; **dev-method** = STORIA/legacy, non fonte viva; re-sync esplicito richiesto per adottare uno SHA control-plane successivo.

**Nota Blocco B:** `session-and-repo-guard` è un **adattamento pragmatico GIS** (non copia letterale dallo SHA frozen). Il freeze vincola le forme operative dove la forma esatta conta: remote-hash PASS, QA evidence, legacy governance e LAST_CURSOR_REPORT.

`dev-method` resta generalizzazione/tag indietro, **STORIA/legacy**, non fonte viva primaria per i pattern operativi sotto.

#### Blocco 0 — freeze fonte control-plane

- **Esito:** PASS (docs-only; SHA frozen).
- **Comando:** `git ls-remote https://github.com/mrhz1973/control-plane.git refs/heads/main`
- **SHA:** `df046f68867cdffcd350592a2781b53ce21ca8c0`
- **Scope:** solo annotazione roadmap; **non** Blocco B / `.cursor/rules/`.

#### Blocco B — session-and-repo-guard (adattamento pragmatico GIS)

- **Esito:** implementato (pending review diff).
- **Scope:** pre-volo repo/sessione fail-closed sul giudizio; **non** remote-hash, QA evidence, legacy governance, LAST_CURSOR_REPORT, two-commit.
- **File:** `.cursor/rules/30-output-workflow.mdc` (sezione Session / repo guard); `docs/OPERATING_MEMORY.md` §4 (bullet); roadmap (questa sottosezione).
- **Regola:** prima di patch non read-only → `git rev-parse --show-toplevel`, `git branch --show-current`, `git status --short`; repo/cartella/branch non attesi o workspace atteso pulito sporco all’avvio → STOP e riporto; Cursor **non** decide autonomamente se procedere.

#### Fase C — remote-hash-pass-verification

- **Esito:** implementata (pending review diff).
- **Tipo:** PASS **tecnico remoto** post-push — distinto da Fase D (QA evidence / PASS operatore) e da browser QA.
- **Fonte:** adattamento da control-plane SHA frozen `df046f68867cdffcd350592a2781b53ce21ca8c0` (`PROJECT_VISION.md` §8.1 / §7.1).
- **Autorità:** `git ls-remote origin main` (finale); `git rev-parse origin/main` (tracking locale, deve combaciare con `ls-remote`); RAW GitHub secondario/best-effort (può essere stale).
- **File:** `.cursor/rules/30-output-workflow.mdc` (sezione Remote hash); `docs/OPERATING_MEMORY.md` §4; roadmap (questa sottosezione).
- **Non introduce:** `LAST_CURSOR_REPORT`, two-commit convention, Fase D/E/F.

#### Fase D — QA evidence / PASS operatore

- **Esito:** PASS (chiusura `finito` 2026-06-16).
- **Tipo:** PASS **operatore/runtime** — distinto da Fase C (PASS tecnico remoto hash/`ls-remote`).
- **Fonte:** principio control-plane SHA frozen `df046f68867cdffcd350592a2781b53ce21ca8c0` — output runtime esplicitamente attestato dall’utente; test non deterministici ≠ evidenza PASS.
- **Regola:** PASS operatore solo con attestazione esplicita nel flusso; Cursor **non** inferisce da PASS tecnico; default fail-closed = QA non eseguita/non attestata.
- **Anti-pattern (es. EOX):** evita QA attestata registrata come «non eseguita» e QA non attestata registrata come PASS.
- **File:** `.cursor/rules/30-output-workflow.mdc` (sezione QA evidence); `docs/OPERATING_MEMORY.md` §4; roadmap (questa sottosezione).
- **Non introduce:** `LAST_CURSOR_REPORT`, two-commit; **non** modifica `finito`; **non** Fase E/F.

#### Fase E — legacy checkpoint/session governance

- **Esito:** PASS (chiusura `finito` 2026-06-16).
- **Tipo:** correzione **pragmatica GIS** — precedenza documentale; **non** copia letterale da control-plane SHA frozen.
- **Delta:** checkpoint/session possono restare append storico/audit nel **`finito`**; non sono fonte viva primaria; conflitti con OM §7 / roadmap → segnalare, precedenza documenti vivi; **non** riscrivere log storici già pushati salvo richiesta esplicita.
- **File:** `.cursor/rules/30-output-workflow.mdc` (precisazioni autosync/`finito`); `docs/OPERATING_MEMORY.md` §3; roadmap (questa sottosezione).
- **Non introduce:** `LAST_CURSOR_REPORT`, two-commit; **non** modifica meccanismo **`finito`**; **non** Fase F.

#### Fase F1 — LAST_CURSOR_REPORT spec + template

- **Esito:** PASS.
- **Cronologia:** Blocco B e Fasi C/D/E **non** introducevano `LAST_CURSOR_REPORT` nel rispettivo scope; Fase F1 introduce **solo** spec + `docs/runtime/LAST_CURSOR_REPORT.template.md` — **non** report vivo, **non** uso obbligatorio.
- **Fase F2 (futura):** collaudo su commit docs innocuo; nessuna patch runtime prima del collaudo.
- **Mapping GIS:** commit principale + autosync orchestratore = modello concettuale task + report; nessun terzo commit; no commit finalize-hash; `PENDING_SELF_REFERENCE` + backfill HISTORY; `pass_tecnico_remoto`/`result_cursor` ↔ Fase C; `pass_operatore`/`result_runtime` ↔ Fase D.
- **Non sostituisce:** OM §7, roadmap, `latest`/`inbox`; **non** modifica `finito` in Fase F1.
- **File:** `.cursor/rules/30-output-workflow.mdc` (sezione F1); `docs/OPERATING_MEMORY.md` §4; `docs/runtime/LAST_CURSOR_REPORT.template.md`; roadmap (questa sottosezione).

#### Fase F2 — collaudo LAST_CURSOR_REPORT su commit docs innocuo

- **Esito:** PASS (collaudo docs innocuo; report vivo in commit autosync).
- **Scope:** nessuna patch runtime; commit principale = task docs innocuo; commit autosync = report + primo `docs/runtime/LAST_CURSOR_REPORT.md` vivo.
- **Mapping:** `real_task_commit` = SHA commit principale F2 (non autosync); nessun terzo commit; no finalize-hash; `pass_tecnico_remoto`/`result_cursor` ↔ Fase C; `pass_operatore`/`result_runtime` ↔ Fase D (non inferibile; non-attestato in collaudo docs-only).
- **Non sostituisce:** OM §7, roadmap, `latest`/`inbox` come fonti vive primarie.

#### Fase F3 — attivazione obbligo LAST_CURSOR_REPORT (GIS-only)

- **Esito:** PASS (pending review diff).
- **Obbligo:** post-push task reale GIS-only; fail-closed soft se report/output git mancanti; non per read-only/plan/review diff senza commit.
- **Scope:** GIS-only — `aggio`/`aggio gis` = memoria GIS; `aggio control` = control-plane; nessuna semantica «tutti i repo» nel riferimento vivo.
- **Mapping:** commit principale = task; autosync = report + `LAST_CURSOR_REPORT.md`; `real_task_commit` = principale; nessun terzo commit/finalize-hash; LATEST rolling → precedente in HISTORY; `pass_tecnico_remoto`/`result_cursor` ↔ Fase C; `pass_operatore`/`result_runtime` ↔ Fase D.
- **Non sostituisce:** OM §7, roadmap, `latest`/`inbox`; **non** modifica `finito`; **non** patch runtime in F3; **non** introduce `LAST_HANDOFF_VERIFY`; cross-repo rinviato ad allineamento control-plane dedicato.
- **File:** `.cursor/rules/30-output-workflow.mdc`; `docs/OPERATING_MEMORY.md` §4 (§6 riga scoped); roadmap (questa sottosezione).

**File canonici / riferimenti da adottare nel repo GIS:**

1. **control-plane:** `docs/runtime/LAST_CURSOR_REPORT.md` — rolling report post-push; due commit (task + report); `PENDING_SELF_REFERENCE` + backfill in HISTORY; niente commit finalize-hash; split `result_cursor` / `result_runtime`.
2. **control-plane:** `PROJECT_VISION.md` §7.1 — guardia hash remoto; PASS richiede `git ls-remote origin main`; raw GitHub può essere stale (cache/CDN); vince hash remoto.
3. **control-plane:** `PROJECT_VISION.md` §8.1 — output verbatim; regola no-finalize-hash.
4. **dev-method:** `patterns/session-and-repo-guard.md` — header SESSION/REPO GUARD; nota pre-volo; `git status` a inizio sessione; se workspace sporco, sospettare clone/stash/cartella errata; presente in dev-method **v0.1.1**.
5. **dev-method:** `adapters/single-file-html.md` — bibbia monolite; 13 sezioni; version marker; large-file token policy; presente in dev-method **v0.1.0 / v0.1.1**.

**Metodo di adozione:**

- pin tag `dev-method` per le forme generiche (STORIA/legacy, non fonte viva operativa);
- copiare/adattare forme operative dal **SHA frozen** (`df046f68867cdffcd350592a2781b53ce21ca8c0`); re-sync esplicito per SHA successivo;
- pattern chiave LAST_CURSOR_REPORT / remote-hash **non** sono nei tag dev-method → copiare forma operativa da control-plane, non spostare il pin dev-method.

**Tensione `aggio` scope — RISOLTA (Fase F3):**

- **`aggio` scoped per-target:** control-plane vivo usa **`aggio control`**; GIS usa **`aggio`** / **`aggio gis`**.
- Nessuna semantica «tutti i repo» nel riferimento vivo control-plane @ SHA frozen.
- Il polo «tutti i repo attivi» proviene da **dev-method storico**, non fonte viva metodo.
- Estensione cross-repo / `LAST_HANDOFF_VERIFY` rinviata a eventuale allineamento control-plane dedicato (fuori scope F3).

**Idea aperta, non decisa:**

- Claude Code come reviewer nell’automazione.
- Paletti: reviewer separato dall’implementer; valutare prima se basta checklist nell’orchestratore; decisione di costo gated; rispettare control-plane §7.5 no-API-default.

#### APP-BUILD-NUM-B1 — build number monotono runtime (metodo B)

**Stato:** **CLOSED / PASS tecnico end-to-end** (2026-06-27).

**Runtime:** `bd588a89a6bf0674351b384c607ab7ef73952ab2` — blob `afddf87a6f05929b540f768a0193872057fe24cb`.

**Scopo:** contatore build runtime monotono `APP_BUILD_NUM` visibile accanto a `APP_BUILD_ID` / `APP_BUILD_DETAIL`; incrementabile a ogni patch runtime senza bumpare `APP_BUILD_ID`.

**Review Claude:** PASS — GO DEPLOY GIS-only (8 controlli: diff build/display; costante non derivata; label; applyAppBuildLabel; detail intatto; invarianti; no dipendenze esterne).

**Deploy:** GIS-only PASS tecnico — VPS HEAD/blob match; HTTP 200; byte **2365479**; SHA-256 **`23907b809bb47ed52befe36058b6e8a1f01148d40ec54104a71dc019da3b0614**; CMP_PASS.

**Verifica:** runtime minima display PASS — nessuna QA operatore estesa richiesta.

**Nota cleanup:** implementato in **UX-NEXT-A** (`6892890`) — span statici footer/about → solo `B5.5Z`; `applyAppBuildLabel` unica fonte ` · build N`.

**Prossimo ordine operativo candidato:** **da scegliere da roadmap/backlog**.

#### UI-MODAL-PARITY-HELP-QR — migrazione Help/QR a dialog (build 5)

**Stato:** **CLOSED / PASS tecnico** — **QA operatore FAIL (storico)** → superseded da FIX1 (2026-06-27).

**Runtime:** `dcea02f131c71c587d2c345059fb14cc8458e401` — blob `cf23cc9ca4392fc489c8ccf4a7cda11b67f7f673`.

**Scopo:** migrare `#helpOverlay` e `#qrModal` da legacy `div.modal-overlay` a `<dialog class="app-modal">`; pattern context-aware GIS/non-GIS; **`APP_BUILD_NUM = 5`**.

**Deploy:** GIS-only **PASS tecnico** (runtime VPS `dcea02f`).

**QA operatore FAIL (storico):** Help GIS tagliata/non floating/senza `−`; QR non si apre da Converti.

**Prossimo al tempo:** **UI-MODAL-PARITY-HELP-QR-FIX1**.

#### UI-MODAL-PARITY-HELP-QR-FIX1 — Help floating + QR ripristinato (build 6)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-27).

**Runtime:** `e8e8ff13030496ccf31e6b4bcb8fc57772a60cac` — blob `6eee6872d47dd8a0ed4e04c34dd990e661ced153`.

**Scopo:** Help GIS floating (drag/resize/minimize/scroll body); QR da Converti con `openContextAwareAppDialog`; **`APP_BUILD_NUM = 6`**; display **`B5.5Z · build 6`**.

**Review:** **GPT sostitutiva PASS** (Claude indisponibile — **non** review byte Claude ordinaria).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = e8e8ff13030496ccf31e6b4bcb8fc57772a60cac
VPS blob = 6eee6872d47dd8a0ed4e04c34dd990e661ced153
HTTP 200
byte repo/servito = 2404202 / 2404202
SHA-256 = 3fe2ac2e39c2a92cc8b282eede1e937036440f7cc4acfb672003eb0290899775 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA UI-MODAL-PARITY-HELP-QR-FIX1 PASS operatore**».

**Backlog non bloccante:** CONVERT-SOURCE-PICKER; P-POLYGON-LIST-UX-NEXT-B-FIX2 Vis.

**Prossimo candidato:** **CONVERT-SOURCE-PICKER**.

#### UI-MODAL-PARITY-HELP-QR-FIX2 — QR ridimensionabile (build 7)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-27).

**Runtime:** `14605e9d4dcdce738d5759a4c24ecc38dbb7e7e4` — blob `0886b6bb4ab4b2cd13e060b1c6f34eafe6953259`.

**Scopo:** QR modal ridimensionabile in GIS mode (handle angoli, pattern Help FIX1); drag header; layout body flex; resize transiente; flusso Converti/QR generation invariati; **`APP_BUILD_NUM = 7`**; display **`B5.5Z · build 7`**.

**Review:** **GPT sostitutiva PASS** (Claude non disponibile — **non** review byte Claude ordinaria).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 14605e9d4dcdce738d5759a4c24ecc38dbb7e7e4
VPS blob = 0886b6bb4ab4b2cd13e060b1c6f34eafe6953259
HTTP 200
byte repo/servito = 2407357 / 2407357
SHA-256 = 1447722424f5d8c180b4b89fb2c5dff7fb6d1e9b173d542f5b30484990e832b5 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA UI-MODAL-PARITY-HELP-QR-FIX2 PASS operatore**».

**Runtime autorevole live VPS:** superseded da **CONVERT-SOURCE-PICKER** (`b294140`). **Catena UI-MODAL-PARITY-HELP-QR (build 5 → FIX1 → FIX2) CLOSED / PASS end-to-end**.

**Prossimo candidato (storico al tempo FIX2):** **CONVERT-SOURCE-PICKER** — ora **CLOSED**.

#### CONVERT-SOURCE-PICKER — sorgente coordinate Convertitore (build 8)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-27).

**Runtime:** `b294140c6464c28634c775018c4bd80853041491` — blob `6feba1c9e0b192c1655ba052314e7d8cae87df98`.

**Scopo:** sezione **Sorgente coordinate** in `#manualInputSection` / Converti — waypoint (`state.mapWaypoints[]` + **Usa** → DD + `doConvert()`), preferito (`state.favorites[]`, solo lat/lon validi), punto mappa **click one-shot** (`convertSourcePickMode`; Esc/Annulla/chiusura Converti; nessun GPS/tracking), centro mappa (`state.viewCenter` \|\| `state.lastPoint`); feedback `#convertSourceFeedback`; input manuale DD/DDM/DMS/free/UTM/MGRS invariato; QR da Converti e Help/QR build 7 non regressi; nessuna nuova persistenza; **`APP_BUILD_NUM = 8`**; display **`B5.5Z · build 8`**.

**Review:** **GPT sostitutiva PASS** (Claude non disponibile — **non** review byte Claude ordinaria).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = b294140c6464c28634c775018c4bd80853041491
VPS blob = 6feba1c9e0b192c1655ba052314e7d8cae87df98
HTTP 200
byte repo/servito = 2423291 / 2423291
SHA-256 = 1a954ca989e436bb1dadb319d7fc84701ed760a845d3127d6d963f4b1ae6b4ab (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA CONVERT-SOURCE-PICKER PASS operatore**».

**Runtime autorevole live VPS:** superseded da **ROUTINE-CLEANUP-BUNDLE** (`7b8cf04`).

#### ROUTINE-CLEANUP-BUNDLE — primo bundle bundle-first cleanup routine (build 15)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-28).

**Runtime:** `7b8cf041383b55b80668a30ce12607a8888b774c` — blob `71e353ee85c15bf2713bc7998c72582f81723ec5`.

**Scopo:** primo bundle **METHOD-BUNDLING-DEFAULT** — cleanup routine Ramo A + JS no-op in un unico gate (commit/deploy/QA).

**Bundle (7 item):** rimozione CSS legacy `.modal-overlay`/`.modal`; selettori Help duplicati; chip `.modal .modal-close`; print/mobile; `.qr-modal` ridondante; 7× `renderAllMaps()`; commento chip.

**Review:** **NON RICHIESTA** (ROUTINE).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 7b8cf041383b55b80668a30ce12607a8888b774c
VPS blob = 71e353ee85c15bf2713bc7998c72582f81723ec5
HTTP 200
byte repo/servito = 2423860 / 2423860
SHA-256 = 0caa70651a4fca7b04112abddc1af50a44059c5539a9407ed5702ddb646146ba (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA ROUTINE-CLEANUP-BUNDLE PASS operatore**».

**Runtime autorevole live VPS:** `7b8cf04`.

**Prossimi candidati:** estensione resize laterale ad altri pannelli; HUD avanzato (HUD-MOVE / HUD-VIS).

#### MAJOR-2A — Verificatore copertura offline read-only (build 24)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-29).

**Runtime:** `07ad4f41c0916df1fcefebf64a11e1d49ec75b6d` — blob git `b789538db128f4467e1e503b82d4e245c8de7591`.

**Scopo:** primo sottoblocco MAJOR-2 — audit read-only tile attese vs IndexedDB per named areas; UI «Verifica copertura» per riga + batch selezionate; stato session-only `state._offlineAreaAudit`; integrazione Diagnostica `offlineAreaAudits`; nessun fetch/write/delete IDB.

**Review:** **NON RICHIESTA** (read-only ROUTINE).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 07ad4f41c0916df1fcefebf64a11e1d49ec75b6d
HTTP 200
byte repo/servito = 2502490 / 2502490
SHA-256 file = c8c5679c4c3dbe621ab0aaa2543bb184b4d9d85edfca92c4904f802c4436e1ea (match)
CMP_PASS = yes
goi-gis-app.service = active (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA MAJOR-2A PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `07ad4f4`.

**Prossimi candidati MAJOR-2:** vedi § **Programma MAJOR-2 post MAJOR-2A — priorità 2B/2C/2D** sotto.

## Programma MAJOR-2 post MAJOR-2A — priorità 2B/2C/2D

**Stato programma:** **MAJOR-3-a** **CLOSED / PASS end-to-end** (`c0fb4da`, build 32). **MAJOR-2E-a** **CLOSED / PASS end-to-end** (`d9238b6`, build 31). **MAJOR-5A2-UX-BACKLOG** **CLOSED / PASS end-to-end** (`d9c8f7b`, build 30). **MAJOR-5A2c** **CLOSED / PASS end-to-end** (`eb1451b`, build 29). **MAJOR-5A2b** **CLOSED / PASS end-to-end** (`cef7d42`, build 28). **MAJOR-5A2a** **CLOSED / PASS end-to-end** (`d2f7856`, build 27). **MAJOR-5A1** **CLOSED / PASS end-to-end** (`d74cbb7`, build 26). **MAJOR-2BCD** **CLOSED / PASS end-to-end** (`823bb73`, build 25). **MAJOR-2A** landed/PASS (`07ad4f4`, build 24). **Prossima priorità operatore:** **MAJOR-4** backlog basso; **OFFLINE-DOWNLOAD-CONTROLS** backlog; eventuali estensioni MAJOR-3 (import) backlog basso; programma pick Workbench **MAJOR-5A2 completo**; catena UX backlog 5A2b **chiusa**.

#### MAJOR-3-a — Unified GIS export hub (build 32)

**Stato:** **CLOSED / PASS end-to-end** (2026-07-01).

**Runtime:** `c0fb4da4205f0771d5c9e8952ed48eefe49f7475` — blob git `92d8ff692bc5ea7d7eb45ca1fae449d75e38b640`.

**Scopo:** hub export unificato nel Workbench — checkbox categorie (waypoint, tracce salvate, poligoni); export GeoJSON + riuso GPX/KML; helper `gisExportHub*`; file-first locale.

**Gate:** bundle **ROUTINE** (export read-only; nessun nuovo campo persistito).

**Esclusi:** import unificato, mission package, sanitizer/schema nuovi.

**Review:** **GPT-sostitutiva PASS** — «REVIEW GPT-SOSTITUTIVA MAJOR-3-a PASS — GO DEPLOY» (Claude offline; **non** review byte Claude).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = c0fb4da4205f0771d5c9e8952ed48eefe49f7475
HTTP 200
byte repo/servito = 2591276 / 2591276
SHA-256 file = 09d8ca97af546a1de1a81d44ee65bf8afcd70ae9642adf258e39f9418eff4cee (CMP_PASS)
goi-gis-app.service = active/enabled (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA MAJOR-3-a PASS operatore**».

**Runtime autorevole live VPS:** `c0fb4da`.

**Prossimi candidati:** **MAJOR-4** backlog basso; estensioni MAJOR-3 (import) backlog basso.

#### MAJOR-2E-a — Persist offline area audit status (build 31)

**Stato:** **CLOSED / PASS end-to-end** (2026-07-01).

**Runtime:** `d9238b62291507c05789e369caeabb9061ec8bca` — blob git `73a6936a850ca1c65edd82ceb235593117aca946`.

**Scopo:** dopo «Verifica» esplicita (MAJOR-2A), persistere in `namedAreas[]` status e contatori da scan IDB reale (`applyOfflineAreaAuditToNamedArea`); badge/lista coerenti dopo reload.

**Gate:** bundle **DELICATO** (cache/storage metadata); review pre-deploy **PASS**.

**Esclusi:** auto-scan boot, write/delete tile, precache/download, nuovi campi schema.

**Review:** **PASS pre-deploy** — «REVIEW MAJOR-2E-a PASS — GO DEPLOY».

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = d9238b62291507c05789e369caeabb9061ec8bca
HTTP 200
byte repo/servito = 2581430 / 2581430
SHA-256 file = cd61d8a76f4f3c1ac4bd4b344c3488c97961f7609cd3d73506094c9a1e53b03f (CMP_PASS)
goi-gis-app.service = active/enabled (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA MAJOR-2E-a PASS operatore**».

**Backlog emerso (non implementato):** **OFFLINE-DOWNLOAD-CONTROLS** — controlli download tile Mappe Offline: Pausa, Stop/Annulla, Riprendi.

**Runtime autorevole live VPS:** `d9238b6`.

**Prossimi candidati:** **MAJOR-4** backlog basso; estensioni MAJOR-3 (import) backlog basso.

#### MAJOR-5A2-UX-BACKLOG — Workbench visual polish (build 30)

**Stato:** **CLOSED / PASS end-to-end** (2026-07-01).

**Runtime:** `d9c8f7b79d668050e3cdfbc9a5aa809da7eb3229` — blob git `2b2bb3beac1575bba946c3170c3a2d8d48bd72f1`.

**Scopo:** polish UX non bloccante emerso da QA 5A2b/5A2c — toolbar `.twb-btn` dark; resize angoli `#gisWorkbenchPanel` (CSS handle + z-order); chip `.wb-filter-chip` dark scoped.

**Gate:** resize persistence PASS — `gisWorkbenchPanel` non in `UI_PANEL_KEYS`; nessuna nuova persistenza.

**Esclusi:** logica pick/selezione Workbench, storage, i18n, lifecycle dialog.

**Review:** **NON RICHIESTA** (bundle ROUTINE CSS/HTML).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = d9c8f7b79d668050e3cdfbc9a5aa809da7eb3229
HTTP 200
byte repo/servito = 2578728 / 2578728
SHA-256 file = e22bbe34b92a1ec1c5a631ebb40c237eac6f1fdadffe813500e48d8ba474fc9e (CMP_PASS)
goi-gis-app.service = active/enabled (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA MAJOR-5A2-UX-BACKLOG PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `d9c8f7b`.

**Prossimi candidati:** **MAJOR-2E/3/4** backlog basso.

#### MAJOR-5A2c — Workbench pick mappa poligoni (build 29)

**Stato:** **CLOSED / PASS end-to-end** (2026-07-01).

**Runtime:** `eb1451b04a3d46322b826ae9e3e0c977ddb21640` — blob git `5ed0d4c5cb37d60fe8ce4a683f3bd172a7e060b2`.

**Scopo:** estendere pick mode Workbench a poligoni GIS salvati visibili; hit-test geometrico only (no overlay interattivo); priorità WP→traccia→poligono; `skipEditId` coerente overlay; selezione via `workbenchSetSelection` + highlight 5A2a.

**Esclusi:** persistenza, delete/rename/edit, fix UX backlog 5A2, inner-ring donut (nota non bloccante).

**Review:** **PASS pre-deploy** — Claude diff `4f598ed..eb1451b` (bundle DELICATO leggero).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = eb1451b04a3d46322b826ae9e3e0c977ddb21640
HTTP 200
byte repo/servito = 2574712 / 2574712
SHA-256 file = 3f3adb173b04dc5edcf2270f6e8304c8c30a3a05ddb0e308a20ee4e6c8f0618c (CMP_PASS)
goi-gis-app.service = active (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA MAJOR-5A2c PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `d9c8f7b` (superseded da UX-BACKLOG).

**Prossimi candidati:** **MAJOR-2E/3/4** backlog basso.

#### MAJOR-5A2b — Workbench pick mappa WP+traccia (build 28)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-30).

**Runtime:** `cef7d42ada6ec88d571b758e28db78fd3bc4231a` — blob git `638978935fcbead38a7c885b725976417a71c628`.

**Scopo:** toggle pick mappa esplicito dal Workbench; click waypoint/traccia salvata → `workbenchSetSelection` + highlight 5A2a; guardia `workbenchMapInteractionBlocked()`; uscita pick sicura.

**Esclusi:** pick poligoni, persistenza, delete/rename/edit.

**Review:** **PASS pre-deploy** — Claude diff `41f4740..cef7d42` (bundle DELICATO leggero).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = cef7d42ada6ec88d571b758e28db78fd3bc4231a
HTTP 200
byte repo/servito = 2571484 / 2571484
SHA-256 file = 8786d08290051f6fca8a71f484982871a00e0cffaab71ff62c1d235ddf4d4466 (CMP_PASS)
goi-gis-app.service = active (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA MAJOR-5A2b PASS operatore**» (trigger auto-`finito` Regola H). Funzionale verificato: selezione riga, pick WP/traccia, esclusione poligoni, Esc/cleanup, build 28. **Backlog UX non bloccante** (non FAIL) emerso in QA — **chiuso** in **MAJOR-5A2-UX-BACKLOG** (`d9c8f7b`, build 30).

**Runtime autorevole live VPS:** `cef7d42`.

**Prossimi candidati:** **MAJOR-5A2c**; **MAJOR-2E/3/4** backlog basso.

#### MAJOR-5A2-UX-BACKLOG — Workbench visual polish (build 30) — CLOSED

**Stato:** **CLOSED / PASS end-to-end** — vedi sezione programma MAJOR-2 sopra (runtime `d9c8f7b`, build 30).

**Origine:** QA operatore arricchita post-chiusura MAJOR-5A2b — item UX non bloccanti (non FAIL).

**Item risolti:**

1. Toolbar «Oggetti GIS» — tema scuro GIS.
2. `#gisWorkbenchPanel` — resize angoli coerente altri pannelli floating.
3. Chip filtro `.wb-filter-chip` — palette dark, stati attivo/inattivo/disabilitato.

#### MAJOR-5A2a — Workbench selezione lista + highlight (build 27)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-30).

**Runtime:** `d2f7856881dcb213e33b5f403ad27bff219d10a4` — blob git `895e1b9bc8fad8e12374ebe10f1d9962639bdfb4`.

**Scopo:** click riga Workbench → selezione session-only `{ kind, id }`; riga evidenziata; highlight mappa non interattivo per waypoint/traccia/poligono; ⌖ fly-to separato; prune su delete.

**Esclusi:** pick mappa→lista, pick mode, delete/rename/edit, persistenza.

**Review:** **NON RICHIESTA** (bundle ROUTINE).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = d2f7856881dcb213e33b5f403ad27bff219d10a4
HTTP 200
byte repo/servito = 2559724 / 2559724
SHA-256 file = 328377add5d78cb1799709c19d0b4c25d7e9935269a761329e96839e147bb559 (CMP_PASS)
goi-gis-app.service = active (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA MAJOR-5A2a PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `d2f7856`.

**Prossimi candidati:** **MAJOR-5A2b**; **MAJOR-2E/3/4** backlog basso.

#### MAJOR-5A1 — GIS Object Workbench catalogo read-only (build 26)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-30).

**Runtime:** `d74cbb736e0543035112601625f8685c8c6fe0fa` — blob git `335257d4e1e02a467af149572613105a23c2bc5f`.

**Scopo:** primo sottoblocco MAJOR-5A — pannello floating `#gisWorkbenchPanel`; adapter read-only `workbenchCollectRows` (waypoint + savedTracks + gisPolygons); filtri tipo/testo; fly-to delegato; Apri pannello nativo; `state._workbench` session-only.

**Esclusi:** pick mappa, delete, rename, edit, `gisTracks[]`, range rings, import/export, schema persistito nuovo.

**Review:** **NON RICHIESTA** (bundle ROUTINE read-only).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = d74cbb736e0543035112601625f8685c8c6fe0fa
HTTP 200
byte repo/servito = 2550551 / 2550551
SHA-256 file = 2ec9a006b2362b5dec18cdadbcd7423e9aa039be97d1d18d5611811c8bfcb314 (CMP_PASS)
goi-gis-app.service = active (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA MAJOR-5A1 PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `d74cbb7`.

**Prossimi candidati:** **MAJOR-5A2**; **MAJOR-2E/3/4** backlog basso.

#### MAJOR-2BCD — Offline tile management combined program (build 25)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-29).

**Runtime:** `823bb7303351264c80f1c38cbc5ef455eb4c8fde` — blob git `02a08d495671ba7e4a9684a5e7d613eb3c8bdb59`.

**Scopo:** programma unico **2B+2C+2D** — quota/error surfacing, UI metadata-only vs delete fisico, delete selettivo protetto con preview e tile condivise conservate.

**Review:** pre-deploy read-only **PASS** (`REVIEW MAJOR-2BCD PASS — GO DEPLOY`, diff `71ff501..823bb73`).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 823bb7303351264c80f1c38cbc5ef455eb4c8fde
HTTP 200
byte repo/servito = 2522536 / 2522536
SHA-256 file = 7cd4c01b79f4f3392b8cebc1f5591e33a72654742778aa8d6683e4759e859dfa (CMP_OK)
goi-gis-app.service = active (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA MAJOR-2BCD PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `823bb73`.

**Prossimi candidati:** **MAJOR-5A**; **MAJOR-2E/3/4** backlog basso.

### Scopo del programma MAJOR-2BCD

| Sottoblocco | Scopo |
| --- | --- |
| **MAJOR-2B** | Rendere visibili quota alta, `QuotaExceededError` ed errori IDB/cache/precache |
| **MAJOR-2C** | Rendere inequivocabile **metadata-only** vs cancellazione **tile fisiche** |
| **MAJOR-2D** | Introdurre o rafforzare delete fisico selettivo, con preview, conferma danger e protezione tile condivise |

### Vincoli (2B/2C/2D)

- **Nessun** cambio fetch/proxy/OPSEC salvo decisione esplicita.
- **Nessun** delete fisico senza preview e conferma esplicita.
- Default conservativo **metadata-only**.
- **Tile condivise protette** (non cancellabili senza guardrail).
- Usare **Diagnostica MAJOR-1** e **coverage verifier MAJOR-2A** come strumenti QA del programma.
- Categoria **DELICATA** o mista (cache/storage/delete) → **piano/gate/review tiered obbligatori** prima del runtime.

### Backlog bassa priorità / rinviato (non ora)

| ID | Titolo | Nota |
| --- | --- | --- |
| **MAJOR-2E-a** | Status partial/complete persistito da scan IDB | **CLOSED / PASS** (`d9238b6`, build 31) — persistenza post-Verifica |
| **OFFLINE-DOWNLOAD-CONTROLS** | Pausa / Stop-Annulla / Riprendi download tile | Backlog — emerso QA MAJOR-2E-a; **non implementare ora** |
| **MAJOR-3** | Import/export GIS unificato | **MAJOR-3-a CLOSED** (`c0fb4da`, build 32 — export hub); import unificato backlog basso |
| **MAJOR-4** | Mission/project package | Rinviato — backlog basso |
| **MAJOR-5A** | GIS Object Workbench | **5A1 CLOSED** (`d74cbb7`, build 26); **5A2a CLOSED** (`d2f7856`, build 27); **5A2b CLOSED** (`cef7d42`, build 28); **5A2c CLOSED** (`eb1451b`, build 29); **5A2-UX-BACKLOG CLOSED** (`d9c8f7b`, build 30) — programma pick **completo**; catena UX backlog **chiusa** |
| **MAJOR-5A2-UX-BACKLOG** | Workbench UX dark/resize/filtri | **CLOSED / PASS** (`d9c8f7b`, build 30) — toolbar dark, resize pannello, chip filtri; ROUTINE CSS/HTML |

**Microcorrezioni UX non funzionali:** stop salvo bug reale.

#### MAJOR-1 — Diagnostica runtime / QA hardening (build 23)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-29).

**Runtime:** `9b359b71ee4f9791a5145c0b5ab6aa36164c2dc8` — blob git `51f0781fc26f4226e5516f49bbe34aa44d25c2cf`.

**Scopo:** primo blocco programma major-feature — pannello Diagnostica read-only in Strumenti; strumentazione quota/cache/OPSEC/rete prima di offline/import/package.

**Review:** **NON RICHIESTA** (read-only, nessuna categoria delicata).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 9b359b71ee4f9791a5145c0b5ab6aa36164c2dc8
HTTP 200
byte repo/servito = 2485630 / 2485630
SHA-256 file = db61845988dee8a60ae4e679ee4ea5dd3e0392c926b20cfc7c61c1d6f4a299ea (match)
CMP_PASS = yes
goi-gis-app.service = active (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA MAJOR-1 PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `9b359b7` (superseded da MAJOR-2A `07ad4f4`).

**Prossimi candidati:** MAJOR-2A **CLOSED** — vedi sopra; MAJOR-2B/2D/2E.

#### UX-NEXT-RUNTIME-BUNDLE-E — consolidamento UX GIS pannelli/mappa (build 22)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-29).

**Runtime:** `fb871b7684160c1eff48cb8567f62819544d7d5d` — blob git `3c5759048a8572b10e1271dd6d6759949dd1fc98`.

**Scopo:** bundle ROUTINE — 18 interventi UX (aria/focus, empty states, micro-help, mobile polish, HUD build marker); wheel zoom / OPSEC / storage / sanitizer invariati.

**Review:** **NON RICHIESTA**.

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = fb871b7684160c1eff48cb8567f62819544d7d5d
HTTP 200
byte repo/servito = 2455175 / 2455175
SHA-256 file = 19bf6dc9c896d571d5babf564477a451990783cc05afa1773676907c84bd9c11 (match)
CMP_PASS = yes
goi-gis-app.service = active (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA UX-NEXT-RUNTIME-BUNDLE-E PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `fb871b7`.

**Prossimi candidati:** titolo statico `<title>`.

#### UX-NEXT-RUNTIME-BUNDLE-D — HUD/resize polish + wheel zoom (build 19 → FIX2 build 21)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-28).

**Runtime finale:** `19700b6a2cec925ec2bca16cd6127c46b7d84202` — blob git `65b7293ab229b2a37cb3f1ec03666f565900c73e`.

**Catena runtime:**

| Step | SHA | Build | Esito |
| --- | --- | --- | --- |
| Base | `ec86b62` | 19 | landed |
| D-FIX1 wheel | `5fec693` | 20 | **QA FAIL** (2–5 livelli/scatto) |
| D-FIX2 wheel | `19700b6` | 21 | **PASS end-to-end** |

**Scopo:** bundle ROUTINE — polish HUD/resize e/w (focus-visible, compact chips, doppio-clic reset larghezza, i18n `tip.panelResizeEW`) + zoom rotellina prevedibile (max ±1 per gesto fisico).

**Wheel FIX2:** `attachWheelZoom` wire-once su `#miniMap`; idle **140 ms**; cooldown **100 ms**; un listener `wheel`.

**Review:** **NON RICHIESTA**.

**Deploy GIS-only (PASS tecnico, FIX2):**

```text
VPS HEAD = 19700b6a2cec925ec2bca16cd6127c46b7d84202
HTTP 200
byte repo/servito = 2446515 / 2446515
SHA-256 file = 7019c56e063659bd974e68a365a19bab2029bfef25dbd8285e78c253af90312a (match)
CMP_PASS = yes
goi-gis-app.service = active (bind 100.114.7.53:8000)
```

**QA operatore:** PASS — «**QA UX-NEXT-RUNTIME-BUNDLE-D-FIX2 PASS operatore**» (trigger auto-`finito` Regola H). D-FIX1 documentato come insufficiente / QA FAIL.

**Runtime autorevole live VPS:** `19700b6`.

**Prossimi candidati:** titolo statico `<title>`.

#### UX-NEXT-RUNTIME-BUNDLE-C — resize pannelli residui + HUD polish (build 18)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-28).

**Runtime:** `8f56566557ef0ae9c5b740beed57eeaae630d784` — blob git `44a9ce09be9a977d304b41c152f35451d4110f8d`.

**Scopo:** bundle ROUTINE con 9 item UX: resize e/w su Range Rings, Misura, Help, Waypoints; affordance resize; HUD collision/tooltip/reset; cleanup i18n orphan.

**Review:** **NON RICHIESTA**.

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 8f56566557ef0ae9c5b740beed57eeaae630d784
HTTP 200
byte repo/servito = 2440464 / 2440464
SHA-256 file = 8ae47bdf76af3496ab2f1d295911e3fab7dca984e09a0606f1538704dab36d1e (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA UX-NEXT-RUNTIME-BUNDLE-C PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `8f56566`.

**Prossimi candidati:** titolo statico `<title>`; polish HUD/pannelli da audit.

#### UX-NEXT-RUNTIME-BUNDLE-B — resize multi-pannello + HUD avanzato (build 17)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-28).

**Runtime:** `584135e1dc5840d15a212e5714805f8d94db85b2` — blob git `40f435685e473ebd2cd5e77995cc980b88c8a868`.

**Scopo:** bundle ROUTINE con 8 item UX: resize e/w su Poligoni, Tracce, Mappe Offline, Cerca; HUD 4 angoli + compatto; chip centro/Seamarks; polish layout.

**Review:** **NON RICHIESTA**.

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 584135e1dc5840d15a212e5714805f8d94db85b2
HTTP 200
byte repo/servito = 2434043 / 2434043
SHA-256 file = c303e69a9b3c74c1b1cffa87f30e50969cee1953f7b4643ee708920aa2a4479f (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA UX-NEXT-RUNTIME-BUNDLE-B PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `584135e`.

**Prossimi candidati:** resize su pannelli flottanti residui; cleanup i18n cosmetico.

#### UX-NEXT-RUNTIME-BUNDLE-A — resize pilota + HUD + cleanup rename bar (build 16)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-28).

**Runtime:** `61bcda5a309aca0db7e7a053e4e65aa0280615eb` — blob `5bf008d739ba5679e64605fd3e6f9a3fb9644836`.

**Scopo:** bundle ROUTINE con 3 item UX: (1) resize laterale pilota `#favoritesPanel`; (2) HUD GIS leggero `#gisMapHud`; (3) cleanup dead code `#polygonPanelRenameBar` / `polygonHideRenameBar` (rename inline invariato).

**Review:** **NON RICHIESTA**.

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 61bcda5a309aca0db7e7a053e4e65aa0280615eb
VPS blob = 5bf008d739ba5679e64605fd3e6f9a3fb9644836
HTTP 200
byte repo/servito = 2426256 / 2426256
SHA-256 = 2684590171b5f260dd0ea7c5d04fdb189fabbc7411285a39effd72e2e88a5b5b (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA UX-NEXT-RUNTIME-BUNDLE-A PASS operatore**» (trigger auto-`finito` Regola H).

**Runtime autorevole live VPS:** `61bcda5`.

#### BUNDLE-BACKLOG-B3 — audit backlog bundle + micro-fix sicuri (build 14)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-28).

**Runtime:** `709079c989cc34b695e9cff3abf239ced77670dd` — blob `da27be4363e878f97f1f1b8d4dbc9df34f9c7ed3`.

**Scopo:** audit interno 4 candidati backlog (dead code, resize laterale, HUD, multi-touch P2) con gate sicurezza; implementare solo patch basso rischio.

**Implementato:** `polygonShowRenameBar()` rimossa (dead certo); guard `mapPolyEditDocDrag || mapPolyMoveDocDrag` su vertex `pointerdown` in `renderPolygonEditOverlay`.

**Audit non implementato:** `polygonHideRenameBar`/barra rename; CSS `.modal-overlay`; `renderAllMaps` undefined; resize laterale (solo angoli); HUD-VIS.

**Review:** **NON RICHIESTA**.

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 709079c989cc34b695e9cff3abf239ced77670dd
VPS blob = da27be4363e878f97f1f1b8d4dbc9df34f9c7ed3
HTTP 200
byte repo/servito = 2426501 / 2426501
SHA-256 = ca0d74a61395d02fc3a3281a29851721c4425e24e5073b68fe5d3d3ba95a0902 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA BUNDLE-BACKLOG-B3 PASS operatore**».

**Runtime autorevole live VPS:** `709079c`.

**Prossimi candidati:** resize laterale pilota; HUD-VIS design; CSS `.modal-overlay` Ramo A; audit `renderAllMaps`.

#### MODAL-STD-B2 — Preferiti layout/scroll + Poligoni ESC (build 11 → FIX2 build 13)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-28) — catena runtime **B2** + **FIX1** + **FIX2**.

**Runtime autorevole live:** `266b1161a6f8d6f95fbc012687d0b0b377538484` — blob `0f4d275ea86b5b78690421405ffa5909add5783e` — **`APP_BUILD_NUM = 13`** — display **`B5.5Z · build 13`**.

**Scopo combinato (audit MODAL-STD-FAVORITES-B1 + MODAL-STD-POLYGON-ESC-B1):**

| Fase | Commit | Build | Esito QA |
|------|--------|-------|----------|
| B2 | `06ed2a09d5e621112877f9389c8ed839d9ae1f65` | 11 | Parziale — Poligoni ESC PASS; Preferiti FAIL |
| FIX1 | `f53e2d8ff8881434ff49104fb79e42202ad28e27` | 12 | Parziale — close/ESC PASS; scroll FAIL |
| FIX2 | `266b1161a6f8d6f95fbc012687d0b0b377538484` | 13 | **PASS end-to-end** |

**Preferiti:** layout `defaultHeightFraction` 0.78; scroll reale su `#favoritesPanelBody` (FIX2, schema Search B1); `:not([open])` hide on close (FIX1); ×/ESC/riapertura; header/×/− accessibili; nessun tocco dati/store/import-export.

**Poligoni ESC:** catena GIS — vertex modal → delete bar → rename bar → inline rename → `polygonEditCancelHandler()` → `closePolygonPanel()`; draw mode via `bindHotkeys`; confermato non regressito in QA FIX1/FIX2.

**Review:** **NON RICHIESTA** (micro-blocchi layout/ESC Ramo B).

**Deploy GIS-only FIX2 (PASS tecnico):**

```text
VPS HEAD = 266b1161a6f8d6f95fbc012687d0b0b377538484
VPS blob = 0f4d275ea86b5b78690421405ffa5909add5783e
HTTP 200
byte repo/servito = 2427039 / 2427039
SHA-256 = c8b39050e456511ea64ea4eaf60df88784ede46b0f490cf77efd587f9a227dc3 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA MODAL-STD-B2-FIX2 PASS operatore**».

**Prossimo candidato:** **da scegliere da roadmap/backlog**.

#### MODAL-STD-SEARCH-B1 — standardizzazione pannello Cerca (build 10)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-28).

**Runtime:** `33c95ad7cecbb7fa75e82f0e8ba9015ed9457193` — blob `d048ee2ff92bf956b31a74aa8ecde21ae49a4540`.

**Scopo:** primo micro-blocco standardizzazione modal — `#searchPanel` altezza utile viewport (`defaultHeightFraction` 0.78), scroll interno body, `gisPanelClampRectPartialVisible`, summary `#geocodeCard` nascosto nel floating; geocoding/rete/OPSEC/altri modal invariati; **`APP_BUILD_NUM = 10`**; display **`B5.5Z · build 10`**.

**Review:** **NON RICHIESTA** (layout Ramo B).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 33c95ad7cecbb7fa75e82f0e8ba9015ed9457193
VPS blob = d048ee2ff92bf956b31a74aa8ecde21ae49a4540
HTTP 200
byte repo/servito = 2424747 / 2424747
SHA-256 = fd6203f61e7f1b7fe14936664e20d280d0e32276988c769fe582178dd593b731 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA MODAL-STD-SEARCH-B1 PASS operatore**».

**Runtime autorevole live VPS:** `33c95ad` (superseded da **MODAL-STD-B2-FIX2** `266b116`).

**Prossimo candidato:** **da scegliere da roadmap/backlog**.

#### P-POLYGON-LIST-UX-NEXT-B-FIX2 — indicatore Vis. poligoni (build 9)

**Stato:** **CLOSED / PASS end-to-end** (2026-06-27).

**Runtime:** `b7b98c205d93001f2b0121330bbde43a4737725b` — blob `dc8067d960a0ae0901f4a6f59d7ee19fb0e9586b`.

**Scopo:** colonna **Vis.** tabella Poligoni — indicatore non interattivo (pallino verde visibile, grigio/spento nascosto); CSS `.poly-vis-indicator`; stato via `polygonMapVisible(f)`; i18n `gis.polygonPanel.visible`/`hidden`; toolbar batch show/hide invariata; **`APP_BUILD_NUM = 9`**; display **`B5.5Z · build 9`**.

**Review:** **NON RICHIESTA** (micro-fix UX Ramo B).

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = b7b98c205d93001f2b0121330bbde43a4737725b
VPS blob = dc8067d960a0ae0901f4a6f59d7ee19fb0e9586b
HTTP 200
byte repo/servito = 2423809 / 2423809
SHA-256 = 87746763adf80441c9c952a0572972cffa199dc62dcdb66cc5f9326a9b77b844 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**QA operatore:** PASS — «**QA P-POLYGON-LIST-UX-NEXT-B-FIX2 PASS operatore**».

**Runtime autorevole live VPS:** `b7b98c2`.

**Prossimo candidato:** **da scegliere da roadmap/backlog**.

#### P-POLYGON-LIST-UX-NEXT-A — rinomina inline cella Nome + build bump 2

**Stato:** **CLOSED / PASS end-to-end** (2026-06-27).

**Runtime:** `68928909a91cb2f828b968ce774e7f12e42666a9` — blob `30358cd3aafa9879d76400e23ce103ff5372b081`.

**Scopo:** rinomina inline nella cella **Nome** della tabella Poligoni (senza barra separata); path dati obbligatorio **`polygonRenameExecute(id, value)`**; fold cleanup span build + `APP_BUILD_NUM` bump **1 → 2**.

**Review Claude:** PASS — GO DEPLOY GIS-only.

**Deploy:** GIS-only PASS tecnico — VPS HEAD/blob match; HTTP 200; byte **2368796**; SHA-256 **`96f9468ed8ea6d1e39acd8186af0ffbe295747ac684848131ff4da9dfb7c893e**; CMP_PASS.

**QA operatore:** PASS — «**QA P-POLYGON-LIST-UX-NEXT-A PASS operatore**».

**Nota backlog:** `polygonShowRenameBar` non più chiamata dalla lista — possibile dead code cleanup futuro.

**Prossimo candidato (storico):** **P-POLYGON-LIST-UX-NEXT-B-FIX2** — ora **CLOSED**.

#### docs/HANDOFF.md method A — handoff canonico repo

**Stato:** **CLOSED / PASS docs-only** (2026-06-27).

**Scopo:** handoff breve e operativo in-repo per nuove chat/agenti; regola stato, read-set, precedenza, ruoli, disciplina Cursor, gate Ramo A/B, deploy GIS-only, PASS, snapshot fresco, backlog immediato.

**File:** `docs/HANDOFF.md` (+ puntatore minimo README read-set).

**Non sostituisce:** OM §7, roadmap, QA-CHECKLIST come fonte stato vivo.

### Tier B — workstream proxy separato

**Stato:** separato dal monolite GIS.

Repo/contesto:

- lavoro da svolgere nel repo/progetto Planet-Clone/proxy;
- il monolite `coordinate_converter Claude.html` deve vedere solo endpoint proxy stabili, come già avviene per Navionics-like;
- token, chiavi, refresh, 401, CORS e provider-specific handling devono stare lato proxy.

Provider legittimi con chiavi ufficiali server-side:

- Thunderforest;
- Mapbox;
- MapTiler.

Regola:

- chiavi gratuite ufficiali tenute server-side;
- quote rispettate;
- accesso tramite proxy;
- integrazione GIS solo dopo endpoint proxy stabile.

Google/Bing:

- nessun tile keyless ufficiale per uso libero equivalente;
- il metodo non ufficiale si basa su scraping di endpoint interni;
- scraping, proxy e cache sono categoria diversa e più rischiosa lato ToS;
- decisione separata del privato, non da confondere con provider ufficiali server-side.

Non è WU runtime pronta nel monolite: resta workstream separato (collegato a WU-0009, non a WU-0008).

### Tier 3 — 3D terreno, candidato lungo periodo

**Stato:** candidato; non WU pronta.

Target in-scope:

- 3D del terreno;
- drappeggio dei basemap 2D esistenti su un DEM aperto/keyless;
- possibili sorgenti:
  - terrain-RGB/Terrarium su AWS Open Data;
  - Copernicus DEM 30m;
- offline-cacheabile;
- compatibile con OPSEC;
- utile per:
  - lettura terreno;
  - line-of-sight;
  - intervisibilità;
  - valutazione tattica del rilievo.

Decisione architetturale a monte:

- decidere prima se il 3D vive:
  - dentro il monolite;
  - oppure come companion app/modalità separata che condivide dati.
- Motori candidati:
  - MapLibre GL JS, circa 1 MB ma comunque framework di fatto;
  - CesiumJS, più pesante.
- Dato il vincolo single-file vanilla, la strada più probabile è companion app/modalità separata, non un semplice tab dentro `coordinate_converter Claude.html`.

Out of scope:

- fotorealismo stile Google Earth;
- Google Photorealistic 3D Tiles.

Motivo dell'esclusione:

- richiede API key e billing;
- non è keyless;
- non è offline-first;
- i termini non sono compatibili con cache/prefetch/uso offline;
- non è compatibile con image analysis, object detection o geodata extraction in un contesto intel;
- un proxy può nascondere la firma tecnica, ma non rende l'uso lecito o compatibile con OPSEC/offline-first.

Prossimo passo:

- decisione di scope: companion app vs interno;
- non implementazione runtime.

## Blocchi

### B0 — Docs WU e matrice layer

Aprire WU-0008. Documentare:

- layer target;
- URL template;
- attribution;
- max zoom;
- tipo `external: "internet"` se il modello layer lo prevede;
- comportamento forced-offline;
- comportamento OPSEC strict;
- se entrano anche nel selettore offline maps.

### B1 — Diagnosi read-only catalogo tile/layers

Mappare:

- costanti TILE_LAYERS o equivalenti;
- radio basemap;
- hydrate/fetch tile;
- offline download;
- export offline JPG;
- attribution;
- i18n labels.

### B2 — Aggiunta OSM-HOT

Un layer alla volta.

Decisioni da bloccare:

- label UI;
- max zoom;
- attribution;
- uso consentito offline cache;
- gate OPSEC.

### B3 — Aggiunta CARTO Voyager

Stesso schema di B2.

Decisioni da bloccare:

- variante chiara: Voyager standard, non dark/light salvo decisione esplicita;
- attribution;
- max zoom.

### B4 — Revisione OpenTopoMap esistente o nuova voce

Il README cita OpenTopoMap come basemap esistente. Quindi questo blocco non deve duplicarlo alla cieca: deve verificare se esiste già e, se esiste, solo normalizzarlo nella nuova matrice.

Decisioni da bloccare:

- se OpenTopoMap è già presente, non creare doppione;
- allineare solo label, attribution, max zoom, offline behavior.

### B5 — Integrazione Layers UI

Dopo i layer:

- ordine radio;
- labels IT/EN/FR;
- default invariato salvo decisione;
- nessuna regressione Navionics/SonarChart/seamarks.

### B6 — Integrazione Offline Maps / Export JPG

Decidere e implementare se i nuovi basemap sono disponibili:

- nel download offline;
- nell’export offline JPG;
- nella coverage visualization.

Questo blocco è sensibile: non cancellare tile già scaricate per operazioni metadata-only.

### B7 — QA layer

Test:

- ogni basemap carica online quando consentito;
- forced-offline blocca rete e usa cache se disponibile;
- OPSEC strict blocca dove previsto;
- Navionics e seamarks non regrediscono;
- una sola basemap radio attiva;
- node check;
- docs/autosync.

## Dipendenze

- WU-0005 governance.
- WU-0007 B2/B7 preferibilmente completati, perché il pannello Layers deve essere stabile.
- Non dipende da WU-0009.

---

# WU-0009 — Google/Bing via proxy Planet-Clone, lavoro a due teste

> **Deploy WU-0009 Google Satellite (`gsat`) — PASS end-to-end (2026-06-16):** backend Planet-Clone `a7359e7` (`/gsat/`, `/status`); frontend GIS `013b8cb` / autosync `ef953fc`; VPS tailnet smoke OK (`static_fallback_configured:true`, tile `200 image/jpeg`); **Browser QA operatore PASS** (OPSEC strict, GIS `:8000`, proxy `:5000`, TEST 1–8); documentazione runtime [`docs/runtime/VPS_DEPLOY_RUNTIME.md`](../runtime/VPS_DEPLOY_RUNTIME.md). Bing e varianti Google restano backlog WU-0009B.

## Scopo

Integrare Google/Bing attraverso proxy Planet-Clone, con Path B scrape keyless deciso da privato.

Questa WU non è solo GIS monolite: è un lavoro a due teste, quindi va gestita esplicitamente come separazione tra:

- **Planet-Clone/proxy:** endpoint, scraping/keyless, token/headers/cache/limiti;
- **GIS monolite:** catalogo layer, consenso, OPSEC gate, UI Layers, fetch via proxy.

## Tipo

**Molto sensibile / multi-repo + proxy + OPSEC + layering — pipeline stretta.**

## Struttura consigliata

Spezzare il lavoro in due WU coordinate, invece di una sola WU enorme:

- **WU-0009A — Planet-Clone proxy Google/Bing readiness**  
  Fuori dal GIS monolite; repo Planet-Clone/control-plane secondo contesto operativo.

- **WU-0009B — GIS monolite integration Google/Bing proxy basemaps**  
  Dentro `cursor-coordinate-converter`.

In alternativa, se si vuole mantenere numerazione lineare solo nel GIS, WU-0009 può contenere due fasi, ma la separazione A/B è consigliata perché i repo e i rischi sono diversi.

---

## WU-0009A — Proxy readiness Google/Bing

### B0 — Decisione privata e perimetro

Formalizzare, fuori dal repo pubblico se necessario:

- quali layer Google/Bing;
- Path B scrape keyless;
- limiti OPSEC;
- nessuna esposizione pubblica;
- tailnet/private-only;
- cache aggressiva o no;
- user-agent/header strategy;
- rate limiting;
- health endpoint.

### B1 — Diagnosi Planet-Clone read-only

Mappare:

- proxy attuale;
- endpoint Navionics esistenti;
- token/refresh se presenti;
- CORS;
- cache;
- logging;
- systemd/VPS.

### B2 — Endpoint Google/Bing proxy

Implementare endpoint separati, non confondere con Navionics:

- `/google/...` o schema da decidere;
- `/bing/...`;
- status/health separato;
- redaction dei log.

### B3 — Gate e sicurezza proxy

- no open proxy pubblico;
- bind tailnet;
- rate limit;
- logging senza dati sensibili;
- fail closed;
- niente chiavi hardcoded se non previsto dal modello privato.

### B4 — QA proxy

Test su proxy:

- tile risponde;
- CORS compatibile col GIS;
- errori gestiti;
- nessun segreto nei log;
- nessun leak nei docs.

## Decisioni da bloccare per WU-0009A

- Quali provider: Google, Bing o entrambi.
- Quali varianti: road, satellite, hybrid, terrain.
- Nomi endpoint.
- Cache sì/no e durata.
- Se documentare pubblicamente solo comportamento astratto, non dettagli sensibili.

---

## WU-0009B — Integrazione GIS monolite Google/Bing

### B0 — Docs WU GIS

Aprire WU-0009B nel GIS, dichiarando dipendenza da WU-0009A.

### B1 — Diagnosi read-only layer proxy nel GIS

Mappare come Navionics viene chiamato oggi tramite proxy e come si può riusare pattern senza duplicazioni fragili.

### B2 — Modello layer proxy

Aggiungere proprietà layer, ad esempio:

- tipo proxy/tailnet;
- consenso richiesto;
- OPSEC strict behavior;
- forced-offline behavior;
- attribution;
- non disponibile su public Firebase/VPS pubblico se proxy non esposto.

### B3 — Google basemap via proxy

**Stato:** layer **`gsat`** (Google Satellite) **PASS end-to-end** + **Browser QA operatore PASS (OPSEC strict, 2026-06-16)** — backend `a7359e7`, frontend `013b8cb`, deploy VPS verificato, runtime doc [`docs/runtime/VPS_DEPLOY_RUNTIME.md`](../runtime/VPS_DEPLOY_RUNTIME.md). Consenso Google separato da Navionics; Annulla fail-closed; tile visibili dopo consenso. **Backlog:** altre varianti Google, Bing (B4), polish UI (B5), reboot-test VPS formale.

###### Browser QA operatore `gsat` — PASS (2026-06-16, VPS tailnet)

- **Ambiente:** browser operatore via Tailscale; GIS `http://100.114.7.53:8000/coordinate_converter%20Claude.html`; proxy `http://100.114.7.53:5000`; DevTools Console + UI.
- **TEST 1–8:** PASS attestati dall'operatore (non inferiti da Cursor).
- **Strict OFF:** `setMapLayer('gsat')` — tile Google visibili; nessun errore console rosso.
- **Strict ON:** dialog Google dedicato (`maps.googleapis.com`, `khms/mt.google.com`; solo Google Satellite, non Navionics/SonarChart); consenso Google **non** abilita Navionics; consenso Navionics **non** abilita Google; **Annulla** → `tileFetchAllowed('gsat')` false, placeholder grigio/`?` su area non-cache.
- **Nota metodo:** dialog su area non-cache (es. Tokyo z19) se layer già `gsat`/cache — coerente con `hydrateMapTiles` async.

Un provider alla volta.

Decisioni da bloccare:

- label;
- variante;
- consenso;
- fallback se proxy non raggiungibile;
- messaggio errore.

### B4 — Bing basemap via proxy

Stesso schema di B3.

**Stato (2026-06-17):** proxy Planet-Clone **`1e8944d`** — route `/bsat/`, deploy VPS B4.1C PASS. **B4.2 frontend GIS `bsat`:** PASS tecnico statico (runtime **`8d4deab`**). **Deploy frontend GIS VPS `fe6b289`:** PASS (HTTP smoke `:8000`). **B4.4 Browser QA OPSEC strict:** **PASS operatore** (7/7 step). **B4.3A annullato** — `#setOpsecStrict` già esistente; non serve nuovo toggle. **Backlog UX:** discoverability OPSEC strict (toggle sotto geocoding). **Catena B4 Bing `bsat`:** chiusa end-to-end.

### B5 — UI Layers

- radio basemap coerenti;
- nessuno stato basemap nascosto;
- messaggi per proxy non disponibile;
- i18n.

**B5.1 polish discoverability OPSEC strict (2026-06-17):** PASS tecnico statico — label `set.opsec.strict` + help-line `set.opsec.strictHelp` sotto `#setOpsecStrict`; nessun secondo toggle; gate OPSEC invariati; hint Layers Satellitare differito (rebuild dinamico menu). Browser QA visuale B5.1: PASS operatore.

**B5.2 mobile viewport containment iPhone (2026-06-18):** PASS tecnico statico — meta `viewport-fit=cover`; blocco CSS `@media (max-width:768px)` additive (toolbar laterale scroll, header/topbar wrap, modal/drawer/help containment, dialog OPSEC sticky actions); nessuna logica GIS/OPSEC/JS modificata. Browser QA mobile: **PASS operatore** (bundle B5.1+B5.2+B5.3b, 2026-06-19).

**B5.3 legenda scala multi-unità (2026-06-18):** PASS tecnico statico — `buildScaleBar` esteso (toggle m/km, poi rimosso in B5.3a); mi secondario, barra Nm, ratio 1:N. Superseded in QA visuale da B5.3b.

**B5.3a scala senza toggle + barre graduate (2026-06-19):** PASS tecnico statico — barre 10 tacche CSS; label centrale. **Superata da B5.3b** per layout label.

**B5.3b fix overlap label scala metrica (2026-06-19):** PASS tecnico statico — mid-label in flow; spacing box `.tile-scale`. Browser QA visuale: **PASS operatore** (bundle B5.1+B5.2+B5.3b, deploy VPS `fec53ca`).

**QA visuale bundlata B5.1+B5.2+B5.3b (2026-06-19):** **PASS operatore** — attestazione operatore post-deploy; non AI.

**B5.4 export JPEG con scala opzionale (2026-06-19):** PASS tecnico statico — dialog `#jpgExportDialog` con checkbox «Includi scala» (default off); `drawJpgExportScale` su canvas 2D prima di `toBlob("image/jpeg")`; riuso `computeMapScaleModel`; nessun `foreignObject`; export base preservato. **B5.4a (2026-06-19):** PASS tecnico — box scala JPG bianco pieno/opaco, contrasto testo/barre; nessun cambio calcoli. **B5.4b (2026-06-19):** PASS tecnico — leggibilità scala JPG export (layout canvas: `textBaseline top`, gap/font/barH/boxH; Nm degradato se canvas basso); box bianco opaco preservato. **B5.4c (2026-06-19):** PASS tecnico — ratio 1:N sempre presente e leggibile nel JPG export; Nm declassabile prima della ratio; box bianco opaco preservato. **B5.4d (2026-06-19):** PASS tecnico — ratio 1:N in blocco separato a sinistra (centrata verticalmente); tabella metrica/Nm a destra; box bianco opaco preservato. **QA operatore PASS (2026-06-20) — output JPG scaricato** (runtime `97406ab`, deploy `63084dd`, QA `?v=97406ab&force=b66b`); PASS limitato al JPG verificato.

**Stato:** QA visuale bundlata B5.1+B5.2+B5.3b **PASS operatore** (2026-06-19). B5.4 **PASS tecnico + PASS operatore export JPG** (B5.4d, 2026-06-20).

**B5.4eB scala in-app allineata a export JPG (2026-06-20):** PASS tecnico + **PASS operatore post-deploy VPS** — runtime **`0edf503`**; HEAD/deploy **`f904279`**; smoke **`200`**, Content-Length **`2151652`**; build **`B5.4eB`**; QA `:8000/coordinate_converter%20Claude.html?v=0edf503`; export B5.4d invariato; Range Rings B6.6B OK; attestazione «tutto a posto».

**B5.4f etichette graduate scala valore per-tacca (backlog):** valore per-tacca tondo (`pickM`/`pickNm` = 1/2/5 × 10ⁿ); opz. mid-label; solo km/Nm (non mi); parità `buildScaleBar` + `drawJpgExportScale`; B5.4d PASS → nuova ri-QA export; **PLAN-FIRST**.

**B5.5C export JPG selezione granulare overlay + label waypoint (2026-06-21):** PASS tecnico remoto + deploy VPS + **PASS operatore** — runtime **`5a10a48`**; build **`B5.5C`**; deploy HEAD **`4da28f5`**; smoke **`200`**, byte-match **`2161529`**; granularità overlay: tracce, waypoint, label waypoint, poligoni/aree, Range Rings; qualità fissa **3×** invariata; nessuna rete/cache/proxy; attestazione «tutto pass». **B5.5C chiuso end-to-end.**

**B5.5D export JPG riquadro coordinate punto/waypoint (2026-06-21):** PASS tecnico remoto + deploy VPS + **PASS operatore** — runtime **`5551622`**; build **`B5.5D`**; deploy HEAD **`e99f60f`**; smoke **`200`**, byte-match **`2179062`**; SHA-256 **`67f927f8fab1ba60e518e169b25aafbaa01cb90837969e5591e31e4a01e6035f**; «Includi coordinate» fail-closed (OFF ad ogni apertura); sorgenti centro/ultimo punto/waypoint (`wp.id`); formati primary/DD/DDM/DMS/UTM/MGRS/DD+MGRS; snapshot pre-await; box canvas top-left; indipendente overlay/scala; qualità 3× cap 8192 invariati; nessun GPS/rete/cache/proxy; Planet-Clone/proxy non toccati; QA `:8000?v=5551622`; attestazione «QA B5.5D PASS operatore». **B5.5D chiuso end-to-end.**

**B5.5Z-FIX0 offline-export JPG — `layer` undefined (2026-06-21):** PASS tecnico remoto + deploy VPS + **PASS operatore** — bug **preesistente** (non feature B5.5Z): `exportOfflineAreaAsJpg()` leggeva `layer` senza dichiarazione in strict mode; fix runtime **`3751e19`**: `const layer = getOfflineTileLayer(layerId)`; nessuna modifica cache/rete/OPSEC/progress/download; **`node --check`** OK; deploy HEAD **`ff904dd`**; smoke **`200`**, byte-match **`2179108`**; SHA-256 **`9c5e766709774a725440f35406936a577ce988abcb5090b26795fd627b273cc4**; build **`B5.5D`** servita; Planet-Clone/proxy non toccati; QA `:8000?v=3751e19`; export Mappe Offline OK, JPG apribile, nessun `layer is not defined`; attestazione operatore PASS. **B5.5Z-FIX0 chiuso end-to-end.** Prerequisito catena **B5.5Z**.

**B5.5Z-1 quick export — snapshot viewport e zoom dinamico (2026-06-21):** PASS tecnico statico — `getQuickExportViewportSnapshot()` + `computeQuickExportZoomLevels()`; infrastruttura read-only; antimeridiano fail-closed (pixel mondiale + `w > e`); limiti esistenti offline-export; nessun call site; **`node --check`** OK. Assorbito in **B5.5Z CLOSED**.

**B5.5Z-2A offline-export — core mosaico geografico (2026-06-21):** PASS tecnico statico — `renderGeographicJpgMosaic(options)`; `exportOfflineAreaAsJpg()` delega; **`node --check`** OK. Regressione Mappe Offline **PASS** in QA DELTA-A1. Assorbito in **B5.5Z CLOSED**.

**B5.5Z-3 export JPG rapido pulsante superiore (2026-06-22):** PASS tecnico statico + review diff PASS — export geografico dal pulsante JPG; viewport all'apertura; layer = `state.mapLayer`; zoom corrente→max esportabile singolo; overlay/scala/coordinate; Mappe Offline invariato; percorso entro-cap **PASS** post-DELTA-A1; **`node --check`** OK. Assorbito in **B5.5Z CLOSED**.

**B5.5Z-DELTA-A1 export alto-zoom segmentato tile-only (2026-06-22):** PASS tecnico statico + review byte-level PASS + fix memoria deterministico PASS + **PASS operatore post-deploy VPS** — runtime **`1099655`**; HEAD/deploy **`e15e772`**; deploy GIS-only; `goi-gis-app` **active** su `100.114.7.53:8000`; proxy/Planet-Clone **non toccati**; smoke **`200`**, byte-match **`2228069`**; SHA-256 **`263ef4603a6ea1053f696631787901dc5b48145b0363b1d464c10e0832bab386**; QA `:8000?v=1099655`; select zoom fino a `layer.maxZoom`; entro-cap B5.5Z-3 invariato; oltre-cap segmenti tile-only sequenziali; stima tile/immagini/egress; soglia alta + hard-stop; download sequenziale; cleanup deterministico; Mappe Offline **PASS**; attestazione «QA B5.5Z-DELTA-A1 PASS operatore». **B5.5Z-DELTA-A1 CLOSED / PASS end-to-end.**

**B5.5Z export JPG rapido zoom reale — catena FIX0→1→2A→3→DELTA-A1 (2026-06-22):** **CLOSED / PASS end-to-end.** Backlog opzionale: overlay geografici su segmenti oltre-cap.

**B5.5Z-BUILD label runtime visibile (2026-06-22):** PASS tecnico statico + deploy VPS + smoke etichetta + **PASS operatore** — runtime **`3fa6212`**; HEAD/deploy **`053ac18`**; `APP_BUILD_ID` **`B5.5D` → `B5.5Z`**; footer/About **`B5.5Z`**; detail *Quick geographic JPG export and segmented high-zoom tiles*; solo identificativo (5 righe); smoke **`200`**, byte **`2228096`**, SHA-256 match; proxy/Planet-Clone non toccati; app avviata normalmente; attestazione «QA B5.5Z-BUILD PASS operatore». **B5.5Z-BUILD CLOSED / PASS end-to-end.**

**B5.5E-2 export JPG qualità fissa 3× senza selettore (2026-06-21):** PASS tecnico remoto + deploy VPS + **PASS operatore** — runtime **`25555c2`**; HEAD/deploy **`2d505af`**; smoke **`200`**, byte-match **`2155320`**; build **`B5.5E-2`**; selettore rimosso; qualità richiesta sempre **3×** (`JPG_EXPORT_REQUESTED_SCALE`); downgrade automatico interno cap 8192 preservato; tile raster interpolate = atteso; QA `:8000?v=25555c2`; attestazione «QA B5.5E-2 PASS operatore». **Catena B5.5E chiusa.**

**B5.5E-1 export JPG default qualità 3× (2026-06-21):** PASS tecnico + QA parziale (radio 3×) — build **`B5.5E-1`** → superato da **B5.5E-2** (selettore rimosso).

**B5.5E export JPG supersampling 1×/2×/3× (2026-06-21):** PASS tecnico statico — build **`B5.5E`**; radio 1×/2×/3×; `exportMapAsJpg({ scale })`; canvas supersampling + `rasterizeSvgOntoCanvas` `rasterScale`; cap 8192; tile interpolate only; B5.5Z fuori scope. **`node --check`** OK. **QA operatore post-deploy: pending** (default 3× → B5.5E-1).

**B5.5B-1 export JPG overlay style fidelity (2026-06-21):** PASS tecnico + **PASS operatore post-deploy VPS** — runtime **`6524183`**; deploy **`30849de`**; smoke **`200`**, byte-match **`2154397`**; build **`B5.5B-1`**; QA `:8000?v=6524183`; label/overlay fedeli; no fill nero; overlay ON/OFF; cursore escluso; scala OK; B6.6C OK; «tutto ok».

**B5.5B export JPG overlay mappa base (2026-06-20):** PASS tecnico + deploy VPS **`4b75e22`** byte-match **`2153290`**; runtime **`e6b28db`**; build **`B5.5B`**. **QA operatore FAIL parziale** (label/traccia nero pieno) → B5.5B-1.

**B5.5A-1 export JPG avanzato — PASS piano/diagnosi (2026-06-20):** diagnosi: `exportMapAsJpg` (~L19719) DOM-to-canvas 1×; `rasterizeSvgOntoCanvas` (~L19691) scalabile; dialog `#jpgExportDialog` (~L9890) solo `#jpgExportIncludeScale`; scala `computeMapScaleModel`/`drawJpgExportScale` (B5.4d/B5.4eB **da preservare**). Oggi JPG include tile/`.tile-grid`/`.tile-marker svg`/scala; **NON** include overlay SVG separati (`.saved-tracks-overlay`, `.waypoints-overlay`, `.range-rings-overlay`, `.gis-polygons-overlay`, draft/GPS/coverage/bbox); `.tile-readout` fuori, cursore escluso per costruzione. Canonici: `state.mapWaypoints[]`/`savedTracks[]`/`track`/`gisPolygons[]`/`rangeRingSets[]`/`lastPoint|viewCenter`/`primary`/`mapZoom`/`mapSize`. **Decisione:** WYSIWYG SVG capture overlay live; no re-render geometria fase 1; no fetch/cache/offline/proxy per B5.5B-E; zoom reale separato in B5.5Z (OPSEC strict/forced-offline/cache/proxy). **Blocchi:** B5.5B scaffolding dialog+config+cattura overlay base; B5.5C selezione granulare + label wpt; B5.5D tab coordinate punto/wpt canvas; B5.5E risoluzione 1×/2×/3× (no fetch); B5.5Z studio zoom reale. **Rischi:** regressione B5.4d/B5.4eB; mismatch in-app/export; overlay DOM-dipendenti/nascosti; canvas 3× performance; rete solo se zoom reale. **Raccomandazione:** primo runtime **B5.5B** (gap principale, rischio minimo). Test: `node --check`, no `<script src>`/`type="module"`, deploy GIS-only + byte-match, QA `?v=<hash>` confronto in-app vs JPG + cursore escluso + regressioni scala/B6.6C.

**B6.1 fix creazione Range Rings manuali (2026-06-19):** PASS tecnico statico — `#rrCreateBtn` visibile quando centro risolvibile (`rrGetCenterFromUi`); un solo primary (Crea anelli vs Punta e crea); default unità `NM` + reset distanze `1, 5, 10`; parser/rendering invariati. **QA operatore N/A — SUPERATO da B6.2** (B6.2 ha rimosso «Crea anelli»).

**B6.2 Range Rings pick-first UX (2026-06-19):** PASS tecnico statico — runtime **`d38c253`**; `Crea anelli` rimosso; **`Punta e crea`** unico primary; pannello minimizzato al pick (`gisMinimizePanel`/dock); default `NM` + distanze `1, 5, 10`; preset chips unit-aware.

**B6.3/B6.3a stili Range Rings (2026-06-19):** PASS tecnico — runtime **`d69cacd`** (stile cerchi/label) e **`22f19f1`** (badge sfondo label + offset label dalle guide legacy); colore/spessore/tipo linea cerchi; colore label distanza; sfondo label.

**B6.3b edit style parity (2026-06-19):** PASS tecnico statico — runtime **`50b0a86`**; modifica da lista carica/salva tutti gli stili Range Rings.

**B6.3c center map on edit (2026-06-19):** PASS tecnico statico — runtime **`20d2141`**; click **`Modifica`** centra/fit mappa sul set (`rrFocusRangeRingSetOnMap`).

**B6.4 radial/bearing spokes (2026-06-19):** PASS tecnico statico — runtime **`d0a4a0a`**; deploy VPS byte-match **`2f7ee52`**; toggle linee radiali; count `{2,3,4,8,16}`; default **`spokeCount=3`** preserva bearing legacy **`0/90/270`**; colore/spessore/tipo linea radiale; comportamento legacy: guide per ogni anello → spokes dal centro al **raggio massimo**; retrocompat in `sanitizeRangeRingSet` (set vecchi → `spokesEnabled=true`, count default `3`). **QA operatore non più pending — COPERTA da regressione B6.6B (2026-06-20):** spokes/radiali B6.4 invariati PASS in QA B6.6B.

**B6.4a-2 Range Rings panel full-height (2026-06-20):** PASS tecnico + **PASS operatore post-deploy VPS** — runtime **`656dd13`**; HEAD/deploy **`7dd1a41`**; attestazione «tutto perfetto».

**B6.5 Range Rings center drag (2026-06-20):** runtime **`f943675`**; deploy VPS **`2cfd553`**; handle centro trascinabile in modalità edit «Sposta centro sulla mappa»; `mapRrCenterDocDrag`; live redraw; persistence `set.center`; build label **`B6.5`**. **Browser QA operatore: FAIL** — handle non visibile/afferrabile (overlay z-index 2 sotto pin centrale z-index 8; dot piccolo/poco contrastato). → **B6.5B-1**.

**B6.5B-1 Range Rings center handle visibility (2026-06-20):** PASS tecnico + **PASS operatore post-deploy VPS** — runtime **`3963c76`**; HEAD/deploy **`e694c0f`**; deploy GIS-only (Planet-Clone/proxy **non toccato**); smoke **`200`**, Content-Length **`2151292`**; build label **`B6.5B-1`** servita; QA tailnet `:8000/coordinate_converter%20Claude.html?v=3963c76`; fix z-index `.rr-move-center-active{z-index:12}` + handle target/crosshair; handle visibile/afferrabile; drag live; click-to-place/pan OK; B6.3/B6.4/B6.4a-2 non regressi. **Nota UX accettata:** drag solo dopo «Sposta centro sulla mappa». **`node --check`** OK.

**B6.6B Range Rings edit-mode center handle affordance (2026-06-20):** PASS tecnico + **PASS operatore post-deploy VPS** — runtime **`97406ab`**; HEAD/deploy **`63084dd`**; deploy GIS-only; smoke **`200`**, Content-Length **`2152189`**; build **`B6.6B`** servita; QA `:8000/coordinate_converter%20Claude.html?v=97406ab` (`&force=b66b` per cache browser). Handle in Modifica senza move-center; drag live; click-to-place su move-center OK; B6.3/B6.4/B6.4a-2/B6.5B-1 OK. **`node --check`** OK.

**B6.6C Range Rings panel restore after create (2026-06-20):** PASS tecnico + **PASS operatore post-deploy VPS** — runtime **`41f180b`**; HEAD/deploy **`69fa6cf`**; deploy GIS-only; smoke **`200`**, Content-Length/wc -c **`2151776`** byte-match **PASS**; build **`B6.6C`**; QA `:8000/coordinate_converter%20Claude.html?v=41f180b`; pannello restore post pick-and-create OK; errore distanze vuote visibile; B6.6B/export/scala OK; attestazione «tutto ok».

**WU-0007 B6.7a Range Rings titolo opzionale + Stili comprimibile (2026-06-22):** **CLOSED / PASS end-to-end** — runtime **`b2d828f`**; deploy HEAD **`d3122e4`**; deploy tecnico GIS-only **PASS**; smoke **`200`**, **`2237896`** byte, SHA-256 match; build **`B5.5Z`**; QA `:8000/coordinate_converter%20Claude.html?v=b2d828f`; attestazione **«QA WU-0007 B6.7a PASS operatore»** — `showTitle` per-ring, fallback legacy `labelMode`, `#rrStyleDetails` (`<details>`), titolo indipendente da etichette distanza; proxy/Planet-Clone/n8n/Docker non toccati; **nessun fix aperto B6.7a**.

**WU-0007 B6.7b Range Rings memoria ultimo stile persistente (2026-06-22):** **CLOSED / PASS end-to-end** — runtime **`0ba6cdc`**; deploy HEAD **`230eb6e`**; deploy tecnico GIS-only **PASS**; smoke **`200`**, file/body **`2243940`** byte, SHA-256 **`9130ef55392309ecc073cd18d3104490aee7575e39e31353e728844f4be1dbb2`** match; blob **`def83a9`**; build **`B5.5Z`**; QA `:8000/coordinate_converter%20Claude.html?v=0ba6cdc`; attestazione **«QA WU-0007 B6.7b PASS operatore»** — `settings.rangeRingsLastStyle` / `sanitizeRangeRingsLastStyle`; ultimo stile al nuovo ring; create/save riusciti aggiornano preferenza; cancel/import invariati; proprietà geometriche/identificative non copiate; ring esistenti invariati; persistenza reload; `showTitle` e spokes verificati; B6.7a (`#rrStyleDetails`, etichette distanza) senza regressioni pertinenti; proxy/Planet-Clone/n8n/Docker non toccati; **nessun fix aperto B6.7b**. **WU-0007 B6.7a–B6.7b — CLOSED / PASS end-to-end**.

### B6 — QA OPSEC/proxy/offline

**Stato (2026-06-20):** **PASS operatore** post-catena Range Rings B6.1→B6.6B — runtime **`97406ab`**, deploy **`63084dd`**, build **`B6.6B`**; QA tailnet `:8000/coordinate_converter%20Claude.html?v=97406ab&force=b66b`; attestazione operatore «tutto ok» (dettaglio OM §7).

Test:

- online default consente se non forced-offline e non OPSEC strict;
- forced-offline blocca proxy;
- OPSEC strict blocca o richiede consenso secondo decisione;
- public deployment non tenta endpoint privati non disponibili;
- tailnet deployment funziona;
- Navionics non regredisce.

## Dipendenze

- WU-0005 governance.
- WU-0008 completata.
- WU-0009A completata e verificata.
- Revisione Claude/GPT obbligatoria prima di ogni prompt sensibile.

---

# Ordine operativo dettagliato consigliato

## Fase 1 — Regole e diagnostica

1. **WU-0005 B0-B3** — governance online default.
2. **WU-0006 B0-B2** — diagnosi poligoni e decisione.
3. **WU-0006 B3A/B3B-B4** — fix o rimozione.

## Fase 2 — Toolbar e strumenti — **WU-0007 PASS**

4. ~~**WU-0007 B0** — inventario UI.~~
5. ~~**WU-0007 B1** — pulsanti più piccoli (`e4c2be3`).~~
6. ~~**WU-0007 B2** — Layers allineato (`e4c2be3`).~~
7. ~~**WU-0007 B3** — GPS scritta/colore qualità (`c051ee1`).~~
8. ~~**WU-0007 B4** — distanza/righello (`54d8586`).~~
9. ~~**WU-0007 B5** — gruppo Waypoint espandibile (`7a02a7e`).~~
10. ~~**WU-0007 B6** — poligoni dentro Tracce (`e8395e9`).~~
11. ~~**WU-0007 B7** — MGRS dentro Layers (`74d3f32`).~~
12. ~~**WU-0007 B8** — Range & Bearing dentro Tracce (`fa12567`).~~
13. **WU-0007 B9** — QA integrata toolbar (non formalizzata; validazione operativa per blocco).

## Fase 3 — Basemap aperti — **WU-0008 PASS**

14. ~~**WU-0008 B0-B1** — matrice e diagnosi layer.~~
15. ~~**WU-0008 B2** — OSM-HOT (`cf6d796`).~~
16. ~~**WU-0008 B3** — CARTO Voyager (`cf6d796`).~~
17. ~~**WU-0008 B4** — OpenTopoMap: verifica/normalizzazione, non duplicazione (`cf6d796`).~~
18. ~~**WU-0008 B5** — UI Layers (`cf6d796`).~~
19. ~~**WU-0008 B6** — Offline maps/export JPG (`cf6d796`).~~
20. ~~**WU-0008 B7** — QA (`cf6d796`).~~
21. ~~**WU-0008 8b** — CyclOSM + OSM standard (`dad28b4`).~~
22. ~~**WU-0008 8c-A** — tileScheme / y-order (prerequisito motore).~~
23. ~~**WU-0008 8c-B** — famiglia Esri (layer catalogo).~~
24. ~~**WU-0008 8d-B0** — browse-cache guard `cacheable:false` (prerequisito EOX).~~
25. ~~**WU-0008 8d-B1-A** — diagnosi offline UX / cache per-layer / maxZoom.~~
26. ~~**WU-0008 8d-B1-B1** — badge «No offline» + pannello neutro + `OFFLINE_LAYER_IDS`.~~
27. ~~**WU-0008 8d-B1-B2** — stats cache per-layer (IDB O(n) on-demand).~~
28. ~~**WU-0008 8d-B1-B3** — zoom-guard: fit-area maxZoom layer (debito `Math.min(18,z)`).~~
29. ~~**WU-0008 8d-B pre-check** — prerequisiti EOX read-only PASS (HEAD `9f98c5d`).~~
30. ~~**WU-0008 8d-B** — layer EOX Sentinel-2 cloudless (WMTS/y-order; online-only; browser QA PASS).~~

## Fase 4 — Proxy Google/Bing / Tier B

31. **WU-0009A B0-B4** — proxy readiness in Planet-Clone, separato.
32. **WU-0009B B0-B2** — predisposizione GIS.
33. **WU-0009B B3** — Google via proxy.
34. **WU-0009B B4** — Bing via proxy.
35. **WU-0009B B5-B6** — UI + QA OPSEC/offline/proxy.

---

# Matrice sintetica dipendenze

| Elemento | Dipende da | Motivo |
| --- | --- | --- |
| WU-0005 Governance | nessuna | regola base online/offline |
| WU-0006 Poligoni | nessuna | diagnosi autonoma, ma blocca UX poligoni |
| WU-0007 B6 Poligoni dentro Tracce | WU-0006 | non si sposta una feature rotta senza decisione |
| WU-0007 B7 MGRS in Layers | WU-0005, WU-0007 B2 | overlay/layer deve rispettare semantica online/offline e Layers stabile |
| WU-0008 Basemap XYZ | WU-0005, preferibile WU-0007 | **PASS** end-to-end (8a–8d-B incluso EOX; browser QA PASS) |
| WU-0008 8c Esri | WU-0008 8a/8b, prereq `tileScheme` | **PASS** 8c-A + 8c-B |
| WU-0008 8d-B1 offline UX | WU-0008 8d-B0 | **PASS** 8d-B1-A/B1/B2 |
| WU-0008 8d EOX | WU-0008 8d-B0, 8d-B1, pre-check 8d-B | **PASS** runtime + browser QA 8d-B |
| Tier B proxy (Thunderforest/Mapbox/MapTiler/Google/Bing) | Planet-Clone/proxy separato | non monolite; chiavi e ToS lato proxy |
| Tier 3 3D terreno | decisione scope companion vs monolite | candidato lungo periodo, non WU pronta |
| WU-0009A Proxy | decisione privata Path B | lavoro extra-monolite, sensibile |
| WU-0009B GIS Google/Bing | WU-0005, WU-0008, WU-0009A | GIS integra solo proxy già pronto e regole OPSEC già chiare |
| Mappe offline UX | nessuna | candidato: cache IndexedDB vs export file, etichette, azioni riga, feedback job |

---

# Decisioni architetturali da prendere prima dei lavori

## Prima di WU-0005

Decidere se la governance resta solo documentale o deve modificare anche testi UI. Consiglio operativo: prima docs-only, poi eventuale UI solo se la diagnosi trova ambiguità.

## Prima di WU-0006

Definire il sintomo minimo del bug poligoni. Anche una frase basta, per esempio: “clicco poligoni e non succede nulla” oppure “disegna ma non calcola area”.

## Prima di WU-0007 — **risolto**

Pattern adottato: mini-toolbar verticale con gruppi espandibili (flyout Tracce e Waypoint); MGRS spostato nel menu Layers. Vedi stato finale WU-0007 sopra.

## Prima di WU-0008 — **risolto**

Politica adottata: nuovi basemap XYZ entrano in Layers, download offline e export JPG via catalogo `TILE_LAYERS`/`OFFLINE_LAYER_IDS` esistente; default basemap resta `osm` (CARTO Voyager); attribution per-layer invariata; gate `tileFetchAllowed`/`forceOffline`/`opsecStrict` invariati. Vedi stato finale WU-0008 (`cf6d796`).

## Prima di WU-0009

Decidere fuori dal repo GIS:

- Google e Bing entrambi o uno alla volta;
- varianti supportate;
- endpoint proxy;
- cache;
- livello di documentazione pubblica;
- vincoli legali/OPSEC da non scrivere nel repo pubblico se sensibili.

---

# Prima WU consigliata

**WU-0007** e **WU-0008** sono **PASS** (toolbar/UX e basemap aperti end-to-end, incluso EOX Sentinel-2 cloudless con browser QA PASS).

**WU-0005** ha governance documentata (B0/B1 PASS) ma **non è chiusa** — B2 UI-copy opzionale e B3 chiusura WU restano aperti.

**WU-0006** ha fix base + UX leggera **PASS**; resta backlog residuo documentato (modifica poligoni in-place con parità UX Mappe Offline; standardizzazione modal trasversale con altezza utile tipo Range & Bearing; resize laterale).

**Prossimo candidato operativo** coerente con la roadmap:

- **B5.5Z backlog opzionale:** overlay geografici su segmenti oltre-cap (non bloccante);
- **WU-0009A B0-B4 — proxy readiness in Planet-Clone**, separato/sensibile;
- **Mappe offline UX** (matrice dipendenze), alternativa leggera non-proxy.
