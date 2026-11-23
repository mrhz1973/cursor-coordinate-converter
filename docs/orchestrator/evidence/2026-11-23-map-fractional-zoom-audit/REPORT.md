# MAP-FRACTIONAL-ZOOM-A — audit preliminare su Build321

**23 novembre 2026 · sola lettura del runtime.** Questo rapporto non è una QA, un candidato Build322, una review del diff, un deploy o una chiusura del requisito. Fonte primaria: `coordinate_converter Claude.html` al commit runtime `64522d52d102cdd0bcd89f4b671b65dc0ba8e9b2`, SHA-256 `96c2c34eec74f43a1dbc636620d6e54989529d53213e58f31edd2d56203dd971`.

## Fatti verificati nel sorgente

1. `renderTileMap(...)` arrotonda lo zoom con `Math.round(zoom)` e assegna `state.mapZoom` al risultato. Il calcolo XYZ e dei limiti dei layer utilizza quindi uno zoom intero per scegliere le tile.
2. `attachWheelZoom(...)` accumula eventi wheel, attende **140 ms** d’inattività e applica un solo passo `±1` con un cooldown di **100 ms**, preservando il focus quando disponibile. Non esiste un’anteprima frazionaria equivalente del wheel in questa funzione.
3. `attachPanHandlers(...)` ha già un’anteprima touch continua: `drag.scale` e `translate3d(...) scale(...)` (o `updateGisPanCacheTransform(...)`), con ancoraggio geografico della coppia di dita. Al rilascio arrotonda `drag.startZoom + log2(scale)` a un livello intero, aggiorna centro/zoom e completa tramite `prepareGisPanCommit(...)` o commit diretto.
4. Il gestore del pan da cache della Build320 è connesso ai gesti ed espone limiti di memoria, job e tempo; modifiche ai transform del piano tile potrebbero interferire con cleanup, cancel, nuova gesture e pinch→pan.
5. Overlay e hit-test hanno dipendenze da camera/zoom (`renderMapWaypointsOverlay`, `renderGisPolygonsOverlay`, `renderMapMeasureOverlay`, `renderRangeRingsOverlay`, `mapClientToLatLonMap`, `gisMapPxAt`, `mapZoomFocusCaptureCamera`). Sono punti da verificare, non prove di regressione.
6. `TILE_LAYERS` comprende raster XYZ/ZYX diversi, con `maxZoom` e criteri di rete/caching distinti; D-Flight ATM09 ha una propria soglia di zoom. Non è provato il supporto universale WMS/vector e non va dichiarato in anticipo.

## Contratto raccomandato per la prossima implementazione

**Classificazione prudenziale: DELICATO**, perché interessa la trasformazione della scena, i percorsi tile/cache, le interazioni mappa e potenzialmente la corrispondenza pixel-coordinate. Non mescolare con interventi UI ROUTINE estranei.

**Scope di partenza tecnicamente isolabile:** anteprima fluida durante il wheel **solo sulla superficie raster compatibile**, sfruttando una trasformazione transitoria e mantenendo la camera canonica, lo zoom tile intero e `state.mapWaypoints[]` invariati fino al commit. Mantenere intatta la prevenzione wheel sulle UI e i gesti touch già esistenti. Nessun nuovo campo persistito, endpoint, provider, modifica permessi, geolocalizzazione implicita o richiesta esterna.

Lo snap a livello intero al termine del wheel potrebbe non coprire l’intera aspettativa di uno **zoom frazionario persistente**. Questo limite va reso esplicito nella acceptance e valutato prima di dichiarare `MAP-FRACTIONAL-ZOOM-A` CLOSED; non presentare il primo sottoinsieme come supporto a scale 1:N esatte.

**Gate implementativo:** preparare un contratto con casi negativi e positiva continuità pixel/geografica, poi modifica mirata al monolite, diff completo da raw@FULL_SHA, review per categoria DELICATO, candidate QA, eventuale deploy GIS-only e ABQA HTTPS LIVE prima del collaudo umano. Nessun runtime Build322 è stato aperto da questo audit.

## Matrice QA necessaria (non ancora eseguita)

- Raster XYZ/ZYX: gesture wheel rapida/lenta, ancoraggio del puntatore e transizioni a livelli min/max; tile già in cache, tile mancanti, offline/opt-in, zero chiamate inattese.
- Touch: pinch→pan e cancel, confronto con baseline Build320, scene continuity/blank-edge; protezioni tool-gesture attive.
- Hit-test: waypoint, tracce, poligoni, range rings, punti misura e gestione handle con coordinate cartografiche coerenti durante preview/commit.
- UI e limiti: scroll wheel sopra pannelli, toolbar e scala non deve zoomare la mappa; accessibilità e viewport desktop/tablet/phone; cambio layer/strumento durante un’animazione.
- Overlay speciali: D-Flight/ATM09, heatmap e altre sovrapposizioni da qualificare o escludere esplicitamente senza inventare compatibilità.

## Esito

**AUDIT_ONLY_COMPLETED / IMPLEMENTATION_NOT_OPENED.** Nessun cambiamento al runtime o al servizio. NEXT: definire il contratto d’implementazione DELICATO e aprire il candidato solo dopo guard del nuovo HEAD; non saltare review e QA.
