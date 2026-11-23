# MAP-FRACTIONAL-ZOOM-A — contratto T1: anteprima wheel raster

**23 novembre 2026 · CONTRACT_READY / IMPLEMENTATION_NOT_STARTED.** Base: runtime Build321 source `64522d52d102cdd0bcd89f4b671b65dc0ba8e9b2`, SHA-256 `96c2c34eec74f43a1dbc636620d6e54989529d53213e58f31edd2d56203dd971`. Audit preliminare: [REPORT](../2026-11-23-map-fractional-zoom-audit/REPORT.md).

## Decisione di perimetro

Per il **primo sottointervento T1** introdurre una **anteprima visiva continua** dello zoom con la rotella per le basemap raster compatibili nella mappa GIS, con lo stesso comportamento di **commit finale al livello intero** esistente. Non dichiarare lo zoom frazionario persistente già realizzato; `MAP-FRACTIONAL-ZOOM-A` resta PARTIAL fino ad eventuale decisione/QA T2.

**Tier: DELICATO** per modifica transitoria al piano tile/overlay e interferenza potenziale con lifecycle pan/click/hit-test. Nessun cambio al motore delle tile, alla cache IDB, a sanitizer, rete/proxy, schema persistito, fonti cartografiche o servizi. Un solo HTML vanilla standalone.

## Contratto tecnico T1

1. *Wheel*: conservare il comportamento finale esistente per segno, passo ±1, soglie min/max, `140ms` idle e `100ms` cooldown. Durante il flusso wheel, una trasformazione CSS transitoria della **scena cartografica completa** (`.tile-layer`, comprese le geometrie disegnate sul piano), con `transform-origin` al cursore e `scale=2^delta` limitata in `[0.5,2]`, fornisce feedback progressivo e non altera `state.mapZoom`/`state.viewCenter` prima del commit.
2. *Compatibilità*: abilitare solo nel GIS e su layer base raster con sorgente tile definita (`url`/`urlBase`). Qualsiasi layer/strumento/camera non idoneo segue il codice wheel esistente, senza falso PASS. Nessuna modifica al touch pinch o al gestore dei movimenti da cache.
3. *Ownership/lifecycle*: cancellare e azzerare transform/transition/will-change in ogni fine gesto, redraw, nuovo pan/touch, cambio layer, perdita del contesto o guard fallito. Un timer stale non deve eseguire commit dopo re-render o sostituzione della `.tile-map`; nessun secondo save/commit per lo stesso gesto.
4. *Geometria e hit-test*: un’anteprima non è una camera canonica. Impedire che un click/pan/hit-test sulla superficie geografica durante il breve periodo trasformato utilizzi coordinate relative alla scena non ancora committata. Comandi chrome e scroll UI restano operabili; `gisUiBlocksMapWheelZoom` mantiene precedenza. La trasformazione deve essere unica e applicata in modo coerente anche ai suoi overlay, senza introdurre ridisegno o hit-test frazionari.
5. *Rete e OPSEC*: nessuna chiamata per il solo preview; caricare le tile soltanto tramite i percorsi esistenti al commit. Offline, `forceOffline`, opt-in provider, assenza GPS silenzioso e `state.mapWaypoints[]` invariati. Nessuna lettura o modifica degli archivi operatore nei test.
6. *Accessibilità/utente*: nessun toggle o UI aggiuntivo in T1; l’esperienza wheel deve essere percettibilmente più fluida, ma l’app conserva la scala nominale approssimata della Build321. Nessuna promessa di scala fisica calibrata o zoom finale frazionario.

## Acceptance e negative test obbligatori

- Frame intermedio dopo wheel: transform non identità e camera/zoom canonici **immutati**. Al termine idle, **un** commit intero e nessun transform residuo; anchor del punto sotto il cursore coerente con le formule Web Mercator.
- Sequenze: un detent, più eventi ravvicinati, verso opposto, min/max zoom, zoom-in a focus centrato, cancellazione per redraw e per touch/pan/cambio layer. Le versioni di click e drag non devono ricevere camera falsa durante preview.
- UI: wheel su pannelli/toolbar/scala non attiva preview GIS; nessun overlay visivo staccato dalla tile layer. Test desktop1440, tablet768, phone390/320 con touch emulato, senza rivendicare device fisici.
- Offline e sicurezza: requests esterne bloccate, dati sintetici/profili posseduti; zero GPS, nessun nuovo endpoint. Nessuna regressione pan dalla cache Build320 o selettore 1:N Build321.
- Review DELICATO dell’intero diff al FULL_SHA, statici, QA candidato, deploy GIS-only e QA HTTPS LIVE prima della QA umana; FAIL o inconcludente → STOP senza dichiarare blocco chiuso.

## Limite esplicito / NEXT

**T1 non realizza lo zoom persistente non intero.** Dopo la sua qualificazione, se T1 risolve il caso d’uso previsto, registrarlo come sottointervento completato; l’eventuale T2 richiede un contratto specifico di camera/scene e hit-test con compatibilità layer e overlay. Nessuna candidata Build322 o test PASS deriva dalla semplice pubblicazione di questo contratto.
