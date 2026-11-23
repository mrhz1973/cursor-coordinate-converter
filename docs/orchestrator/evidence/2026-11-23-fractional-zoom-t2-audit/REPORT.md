# MAP-FRACTIONAL-ZOOM-A — audit T2, zoom persistente non intero

**23 novembre 2026 — AUDIT_ONLY COMPLETED / IMPLEMENTATION NOT OPENED.** Fonte: `coordinate_converter Claude.html` Build322 T1, sorgente `e707870b7f0b550f2e4ccf61af498e7dd480b8f6`, SHA-256 `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c` e HEAD documentale di partenza `b74e5ce5bea4e67cc10af0d457628d131785cdc1`. La Build322 T1 resta CLOSED; parent `MAP-FRACTIONAL-ZOOM-A` resta OPEN.

## Evidenza diretta del runtime

1. `renderTileMap(lat,lon,zoom)` forza `Math.round(zoom)` e assegna lo stesso intero a `state.mapZoom`; l’attuale rendering non accetta una camera frazionaria persistente.
2. Il ripristino dell’impostazione `stored.settings.mapZoom` forza `Math.round(...)` con limite 2…18. Il percorso di salvataggio conserva invece `mapZoom: state.mapZoom || 11`. Il contratto di persistenza va reso coerente, senza aggiungere campi arbitrari o indebolire type-check/sanitizer.
3. `attachWheelZoom`, i controlli ± e il commit del pinch arrotondano i livelli al termine del gesto; T1 introduce soltanto un’anteprima CSS transitoria e torna allo zoom intero. Modificare solo un handler lascerebbe comportamenti incoerenti.
4. Le formule `lonToTileX`, `latToTileY` e `computeMapScaleModel` usano `2^zoom` e sono matematicamente compatibili con zoom reale. Il renderer tile, invece, deve mantenere una scelta intera `tileZ` per URL/chiavi cache e applicare `scale=2^(viewZ-tileZ)` alla scena completa.
5. `hydrateMapTiles` e il gestore pan-cache sono identificati con livello tile/generazione e restituiscono immagini raster. Senza separazione esplicita camera `viewZ` / livello `tileZ`, una frazione entrerebbe in URL o IDB, con possibili errori offline/cache.
6. Overlay e hit-test: `mapClientToLatLonMap`, `gisMapPxAt`, `renderTrackOverlay`, `renderMapWaypointsOverlay`, `renderGisPolygonsOverlay`, `renderRangeRingsOverlay`, `renderMapMeasureOverlay`, routing e D-Flight richiedono una camera coerente. Il monolite contiene numerose letture di `state.mapZoom` (82 occorrenze di `state.mapZoom ||` nell’audit), non tutte necessariamente incompatibili: servirà una matrice d’impatto puntuale.
7. I layer raster possiedono `maxZoom` diversi e alcune immagini usano URL `zyx`; WMS, D-Flight/ATM09, heatmap, hillshade e overlay speciali non vanno abilitati implicitamente senza QA specifica.

## Matematica preliminare T2 — PASS limitato alla geometria

È stata eseguita una simulazione indipendente, senza browser e senza modifiche al runtime, su combinazioni di latitudine −80…+80, longitudine −179…+179, zoom reale 2.4…18.52 e spostamenti puntatore. Il modello separa `viewZ` da `tileZ=floor(viewZ)` e confronta posizione raster scalata e proiezione diretta, poi l’ancoraggio del punto geodetico dopo uno zoom frazionario. **6.048/6.048 casi PASS**, scarto massimo pixel pari a circa `5.18e−9 px`, scarto massimo geografico `9.95e−14 gradi` nei casi campionati.

Questi risultati qualificano **solo il modello matematico**. Non sono una QA dell’HTML, del renderer, della cache, degli overlay o dei dispositivi.

## Contratto da definire prima dell’implementazione T2

- **Tier DELICATO:** introdurre una camera continua `viewZoom` e livello tile **intero** `tileZoom`, decidendo esplicitamente se usare lo stesso `state.mapZoom` per un numero reale o una chiave persistita distinta. Nessuna migrazione implicita di dati dell’operatore.
- **Renderer:** `tileZ` intero e tile/cache URL invariati; geometrie in pixel sulla camera `viewZ`, trasformazioni uniformi del piano geografico, overscan su tutto il viewport e correzione delle differenze antimeridiane.
- **Gesture:** wheel, pinch, pulsanti ±, zoom target scala nominale e pan devono rispettare lo stesso stato continuo; annullamento, redraw, cambio layer/strumento, focus e zoom limits non possono lasciare scene trasformate o zoom fantasma.
- **Overlay/hit-test:** assegnare un owner unico della trasformazione; testare coordinate cursore, click e handle di waypoint/traccia/poligoni, misura e routing, prima di accettare la modifica.
- **Persistenza:** type-check `number && isFinite`, clamp coerente con layer e format, round-trip salva→reload e export/import ove il gate modifica effettivamente sanitizer o create-path; non dichiarare persistenza se il load arrotonda.
- **Sicurezza/provider:** OPSEC strict, cache offline, opt-in rete, nessun GPS silenzioso, `state.mapWaypoints[]` canonico. Layer non qualificati usano un fallback intero esplicito, non un comportamento occulto.
- **QA:** test matematici + statici, regressione del comportamento T1, prova browser a zoom reali 11.1/11.5/11.9 e limiti min/max, cache parziale e assente, antimeridiano, raster provider, overlays e dispositivi emulati; review DELICATO, deploy solo dopo gate e QA HTTPS LIVE prima della QA umana.

## Esito operativo

**AUDIT_ONLY_COMPLETED.** Nessuna candidata Build323, nessuna QA prodotto T2, nessuna pubblicazione runtime o nuovo deploy. **NEXT:** fissare il contratto T2 partendo da queste evidenze, con confine di compatibilità provider e politica di persistenza espliciti. P0 resta autorizzato ma non eseguito; DTM5/10m HOLD, P4 FUTURO.
