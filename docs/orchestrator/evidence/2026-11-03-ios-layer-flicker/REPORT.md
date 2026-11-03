# Build 272 — Layer iOS e barra mobile compatta

## Esito candidato

La correzione locale ha superato il gate pre-deploy. Commit, pubblicazione GitHub e deploy VPS non sono ancora avvenuti.

## Modifiche

- Il menu Layer in modalità GIS apre, chiude e si riposiziona aggiornando i nodi esistenti. Aprire o chiudere non chiama `renderTileMap`; selezionare una basemap lo chiama una volta.
- In orizzontale, navigazione a sinistra, titolo al centro e Strumenti/Esporta con Online/Impostazioni a destra condividono una riga di 48 px. Il footer fisso scompare e la mappa occupa lo spazio residuo. In verticale i comandi tornano nella barra originale.
- La maniglia comprime la barra a 22 px e la ripristina. Il controllo schermo intero usa la Fullscreen API quando disponibile e una vista mappa espansa come ripiego.
- Il pulsante Converti ora conserva l’icona dopo la traduzione e ha un nome accessibile. I controlli spostati mantengono i rispettivi nomi accessibili.

## Verifica automatizzata

Microsoft Edge / Chromium 156 ha superato sei profili: iPhone emulato 390×844 in verticale, 844×390 e 667×375 in orizzontale, iPhone emulato 320×568, Chromium stretto con Fullscreen API nativa e desktop 1280×800. Il JSON registra PASS e zero errori JavaScript per tutti i profili.

Il Valutatore del metodo ha esaminato separatamente geometria e screenshot di entrambe le larghezze landscape: PASS, titolo centrato e gruppi separati senza sovrapposizioni; comandi ripristinati nei contenitori originali tornando al portrait. Strumenti, Esporta e Impostazioni restano controlli compatti da 32×30 px: questa verifica dimostra l’allineamento, non il comfort del tocco su telefoni piccoli.

La suite verifica il menu e il numero di ridisegni, l’allineamento verticale dei tre gruppi sulla riga, l’assenza di sovrapposizioni, ordine e nomi accessibili dei pulsanti, la traduzione e il ripristino al cambio orientamento. L’area cartografica è verificata con otto tessere SVG locali, decodificate e ricontrollate dopo la selezione di una basemap:

- 844×390: barra 48 px, mappa 844×342; compressa 844×368; vista espansa 844×390.
- 667×375: barra 48 px, mappa 667×327; compressa 667×353; vista espansa 667×375.

Screenshot 844×390 con tessere di prova deterministiche:

- [Layer aperto](build272-landscape-844-expanded.png)
- [Barra compressa](build272-landscape-844-toolbar-collapsed.png)
- [Mappa espansa](build272-landscape-844-map-expanded.png)

Screenshot 667×375:

- [Layer aperto](build272-landscape-667-expanded.png)
- [Barra compressa](build272-landscape-667-toolbar-collapsed.png)
- [Mappa espansa](build272-landscape-667-map-expanded.png)

Esito macchina completo: [build272-results.json](build272-results.json). Harness: [build272-regression.js](build272-regression.js).

## Limiti residui

Le tessere SVG verificano la composizione e l’area della mappa; non verificano i fornitori cartografici reali. Il fullscreen nativo è stato verificato in Chromium; il ripiego in Edge touch emulato. Safari e Chrome su un iPhone reale, le aree sicure e la viewport dinamica restano da verificare. Il ripiego espande la mappa nell’area web visibile, ma non nasconde la barra del browser iOS.

## Prossimo passo

Dopo la pubblicazione su GitHub, distribuire Build 272 sul solo servizio GIS del VPS e svolgere Automated Browser QA sulla versione remota. Il controllo su iPhone reale rimane un checkpoint separato.
