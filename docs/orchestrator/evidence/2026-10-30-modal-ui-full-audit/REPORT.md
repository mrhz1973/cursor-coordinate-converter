# Matrice completa delle finestre — audit visivo GIS

30 ottobre 2026. Staging `coordinate_converter Claude.html` SHA-256 `ef1631aa74f3226cef25d2a5637d62ca264954a8be55d4606d99893620dc8cab`, comprensivo della patch isolata Converti/Offline. Chromium headless, loopback HTTP, contesto nuovo per vista, service worker e rete esterna bloccati; dati sintetici, nessuna operazione distruttiva confermata. Tema scuro, italiano, 1365×768 e 390×844. Tile e alcuni asset remoti assenti. Nessun file di progetto modificato.

Catturate 76 viste per le 38 dichiarazioni `<dialog>`: 37 finestre aperte con le rispettive funzioni applicative su entrambe le dimensioni, invocate direttamente in una sessione isolata; non verificata l'intera sequenza di clic utente. Per `rrSourcePickerDialog` la funzione ha preparato titolo e contenuto con un favorito sintetico ma il dialogo non è rimasto aperto nel contesto di prova: aperto forzatamente con `showModal()` per la sola resa visiva. Ciò non prova la raggiungibilità del percorso utente. Schermate tramite link D/M; dati grezzi in [results.json](results.json).

## Riscontri

- **Controlli bianchi con aspetto nativo sul tema scuro**: `#rrSourcePickerSearch`, `#astroWaypointPickerSearch` e `#astroFavoritePickerSearch` condividono `.rr-source-picker-search`; `#gisWorkbenchSearch` usa `.wb-search-inp`; `#astroDate2` è un input date nativo. Il risultato sintetico `.rr-pick-item` nel selettore Range Rings appare anch'esso come pulsante del browser. Le regole esistenti `.rr-pick-item` sono limitate a `#sec-rangerings`, mentre il dialogo è fuori da quel contenitore. Esempi [Range Rings desktop](desktop-rrSourcePickerDialog.png), [Astro waypoint](desktop-astroWaypointPicker.png), [Oggetti GIS mobile](mobile-gisWorkbenchPanel.png), [Astro mobile](mobile-astroPanel.png). Una correzione può usare i token comuni di campi e pulsanti, conservando semantica di ricerca, selezione e calendario; opzioni nascoste e menu nativi non sono stati esaminati.
- **Astro mobile, da confermare nel flusso utente**: nell'apertura diretta il rettangolo è (0,0,374,720) e la barra superiore copre la testata ([immagine](mobile-astroPanel.png)). Apertura da pulsante e stabilizzazione successiva non sono state riprovate: osservazione limitata al setup descritto.
- **Range Rings e Pianifica percorso mobile**: rettangoli (12,142,374,716) e (12,142,366,716), entrambi fino a y=858 su viewport alto 844: bordo inferiore fuori di 14 px ([Range Rings](mobile-rangeRingsPanel.png), [Percorso](mobile-routingPlannerPanel.png)). Raggiungibilità di ogni azione dopo scroll e causa non verificate.
- Pannelli operativi usano generalmente testata scura, titolo marcato, minimizzazione e chiusura; conferme e import/export impiegano la stessa superficie, spesso centrata con sfondo attenuato. Varietà di pulsanti, dimensioni e ordine riflette compiti diversi; non è di per sé incoerenza. Strumenti usa un drawer distinto; QR e conferme hanno azioni proprie. Guida e note di rilascio condividono la finestra con presentazione diversa già descritta nell'[audit precedente](../2026-10-30-modal-ui-audit/REPORT.md).

## Matrice di copertura

D = desktop, M = mobile. “Funzione” significa invocazione diretta della funzione d'apertura, non navigazione UI completa. Nessuna azione distruttiva confermata.

| Dialogo | Resa D / M | Apertura e osservazioni |
|---|---|---|
| `convertModal` — Convertitore — inserisci coordinate | [D](desktop-convertModal.png) / [M](mobile-convertModal.png) | Funzione. Cornice operativa; staging con correzione di posizione e nome. |
| `waypointModal` — Waypoint | [D](desktop-waypointModal.png) / [M](mobile-waypointModal.png) | Funzione. Modulo di creazione, azioni proprie. |
| `jpgExportDialog` — Esporta mappa JPG | [D](desktop-jpgExportDialog.png) / [M](mobile-jpgExportDialog.png) | Funzione. Configurazione densa e scorrevole. |
| `waypointExportDialog` — Esporta waypoint | [D](desktop-waypointExportDialog.png) / [M](mobile-waypointExportDialog.png) | Funzione. Formati, nessun waypoint nel profilo. |
| `waypointImportDialog` — Importa waypoint | [D](desktop-waypointImportDialog.png) / [M](mobile-waypointImportDialog.png) | Funzione. Area scelta file, nessun file importato. |
| `waypointDeleteAllDialog` — Eliminare tutti i waypoint? | [D](desktop-waypointDeleteAllDialog.png) / [M](mobile-waypointDeleteAllDialog.png) | Funzione. Conferma con punto sintetico, nessuna cancellazione. |
| `waypointFromFavoritesDialog` — Aggiungi dai preferiti | [D](desktop-waypointFromFavoritesDialog.png) / [M](mobile-waypointFromFavoritesDialog.png) | Funzione. Lista vuota, nessuna importazione. |
| `trackExportDialog` — Esporta traccia | [D](desktop-trackExportDialog.png) / [M](mobile-trackExportDialog.png) | Funzione. Formati, nessuna traccia selezionata. |
| `trackSaveNameDialog` — Salva traccia | [D](desktop-trackSaveNameDialog.png) / [M](mobile-trackSaveNameDialog.png) | Funzione. Nome sintetico, nessun salvataggio. |
| `trackUnsavedCloseDialog` — Traccia non salvata | [D](desktop-trackUnsavedCloseDialog.png) / [M](mobile-trackUnsavedCloseDialog.png) | Funzione. Scelte di salvataggio/scarto, nessuna eseguita. |
| `trackClearCurrentDialog` — Elimina traccia corrente | [D](desktop-trackClearCurrentDialog.png) / [M](mobile-trackClearCurrentDialog.png) | Funzione. Conferma con punto sintetico, nessuna cancellazione. |
| `searchPanel` — Cerca | [D](desktop-searchPanel.png) / [M](mobile-searchPanel.png) | Funzione. Campo e pulsante ricerca, nessuna ricerca inviata. |
| `historyPanel` — Cronologia | [D](desktop-historyPanel.png) / [M](mobile-historyPanel.png) | Funzione. Lista vuota. |
| `favoritesPanel` — Preferiti | [D](desktop-favoritesPanel.png) / [M](mobile-favoritesPanel.png) | Funzione. Lista vuota e corpo scorrevole. |
| `layersPanel` — Mappe Offline | [D](desktop-layersPanel.png) / [M](mobile-layersPanel.png) | Funzione. Staging: bordo mobile entro viewport. |
| `measurePanel` — Misura — distanza e azimuth | [D](desktop-measurePanel.png) / [M](mobile-measurePanel.png) | Funzione. Pulsanti e modi specifici. |
| `cartoIgmPanel` — Indice cartografico IGM / IIM | [D](desktop-cartoIgmPanel.png) / [M](mobile-cartoIgmPanel.png) | Funzione. Dati incorporati e opzioni numerose. |
| `dflightPanel` — Zone D-Flight (UAS) | [D](desktop-dflightPanel.png) / [M](mobile-dflightPanel.png) | Funzione. Dataset assente, rete bloccata. |
| `dflightDetailsPanel` — Zona di prova | [D](desktop-dflightDetailsPanel.png) / [M](mobile-dflightDetailsPanel.png) | Funzione. Zona sintetica, nessuna zona reale. |
| `gisWorkbenchPanel` — Oggetti GIS | [D](desktop-gisWorkbenchPanel.png) / [M](mobile-gisWorkbenchPanel.png) | Funzione. Campo #gisWorkbenchSearch bianco. |
| `rangeRingsPanel` — Range Rings | [D](desktop-rangeRingsPanel.png) / [M](mobile-rangeRingsPanel.png) | Funzione. Bordo mobile oltre viewport di 14 px. |
| `polygonPanel` — Poligoni | [D](desktop-polygonPanel.png) / [M](mobile-polygonPanel.png) | Funzione. Filtri e azioni specifiche. |
| `polygonVertexCoordDialog` — Modifica coordinate vertice | [D](desktop-polygonVertexCoordDialog.png) / [M](mobile-polygonVertexCoordDialog.png) | Funzione. Vertice sintetico, nessun salvataggio. |
| `astroPanel` — Alba / tramonto / luna (locale) | [D](desktop-astroPanel.png) / [M](mobile-astroPanel.png) | Funzione. Data #astroDate2 bianca; testata mobile coperta nel setup diretto. |
| `rrSourcePickerDialog` — Scegli un Favorito come centro | [D](desktop-rrSourcePickerDialog.png) / [M](mobile-rrSourcePickerDialog.png) | Forzata. Campo e risultato bianchi; apertura forzata. |
| `astroWaypointPicker` — Scegli waypoint | [D](desktop-astroWaypointPicker.png) / [M](mobile-astroWaypointPicker.png) | Funzione. Campo #astroWaypointPickerSearch bianco; lista vuota. |
| `astroFavoritePicker` — Scegli preferito | [D](desktop-astroFavoritePicker.png) / [M](mobile-astroFavoritePicker.png) | Funzione. Campo #astroFavoritePickerSearch bianco; lista vuota. |
| `offlineDraftWarnDialog` — Area sulla mappa non salvata | [D](desktop-offlineDraftWarnDialog.png) / [M](mobile-offlineDraftWarnDialog.png) | Funzione. Conferma senza selezionare azioni. |
| `offlineAreaDeleteDialog` — Rimuovere area offline? | [D](desktop-offlineAreaDeleteDialog.png) / [M](mobile-offlineAreaDeleteDialog.png) | Funzione. Conferma senza eliminare dati. |
| `offlineAreaBatchDeleteDialog` — Rimuovere aree selezionate? | [D](desktop-offlineAreaBatchDeleteDialog.png) / [M](mobile-offlineAreaBatchDeleteDialog.png) | Funzione. Conferma senza eliminare dati. |
| `offlineGlobalClearDialog` — Svuotare tutta la cache tile? | [D](desktop-offlineGlobalClearDialog.png) / [M](mobile-offlineGlobalClearDialog.png) | Funzione. Conferma senza svuotare cache. |
| `opsecStrictConfirmDialog` — Conferma di prova | [D](desktop-opsecStrictConfirmDialog.png) / [M](mobile-opsecStrictConfirmDialog.png) | Funzione. Titolo e corpo sintetici, nessuna conferma. |
| `appFullResetDialog` — Cancellare tutti i dati locali? | [D](desktop-appFullResetDialog.png) / [M](mobile-appFullResetDialog.png) | Funzione. Conferma senza esecuzione. |
| `trackModal` — Traccia | [D](desktop-trackModal.png) / [M](mobile-trackModal.png) | Funzione. Traccia vuota, corpo scorrevole. |
| `routingPlannerPanel` — Pianifica percorso | [D](desktop-routingPlannerPanel.png) / [M](mobile-routingPlannerPanel.png) | Funzione. Nessuna richiesta; bordo mobile oltre viewport di 14 px. |
| `toolsDrawer` — 🧰
Strumenti | [D](desktop-toolsDrawer.png) / [M](mobile-toolsDrawer.png) | Funzione. Drawer con gruppi e cornice distinta. |
| `helpOverlay` — Guida rapida & scorciatoie | [D](desktop-helpOverlay.png) / [M](mobile-helpOverlay.png) | Funzione. Guida scorrevole; note di rilascio stessa finestra. |
| `qrModal` — QR — Condividi coordinata | [D](desktop-qrModal.png) / [M](mobile-qrModal.png) | Funzione. Coordinate sintetiche; copia/download non eseguiti. |

## Limiti

Le catture mostrano lo stato iniziale, spesso vuoto o con singolo dato sintetico: non dimostrano tutti gli stati, contenuti lunghi, menu, liste popolate, animazioni, navigazione da tastiera o accessibilità con lettore di schermo. Non verificati tema chiaro, altre lingue, zoom, tastiera virtuale, modalità classica, landscape o provider in rete. Le viste del selettore Range Rings sono forzate e Astro mobile richiede riproduzione tramite UI. L'audit precedente conserva i test specifici di scroll/Escape e l'inventario statico.

## Verifiche successive dei due percorsi

Su base successiva `af143396860a3b9230b20418a304464a2648e43ad59eeef138ec227bfffb36db`, l'apertura effettiva Strumenti → Alba / tramonto / luna a 390×844 ha riprodotto il rettangolo (0,0,374,720) e la testata coperta. La causa individuata è una regola CSS mobile `!important` che forza top/left a zero, prevalendo sulla posizione inline calcolata; [schermata](astro-ui-mobile.png). La verifica originale della matrice resta basata sull'hash precedente indicato in testa.

Nel candidato isolato [uniformity-astro.patch](../modal-ui-style-fix/uniformity-astro.patch), Range Rings è stato aperto, popolato con un favorito sintetico e il pulsante “Preferito” ha aperto correttamente il selettore; campo, risultato e Tab sono stati verificati sui due temi. Questa prova sostituisce il precedente limite di raggiungibilità nel candidato testato, ma non è una ripetizione della sequenza su tutte le altre versioni.

## Target touch: inventario preliminare

Sul candidato isolato successivo `f0e284437facb379b6596ac6356eb161e798fa44b7f20c1a338d2c8672ee8b2c`, misurati alcuni rettangoli dei controlli a 320×568, 390×844, 768×1024 e 844×390: chiusura e minimizzazione 34×34 CSS px con 4 px tra cornici; “Colonne” dei picker Astro 74×29; risultato Range Rings 256×37 a 320 e 326×37 a 390; “Preferito” 76×29; “Calcola percorso” 122×29; “Calcola” Astro 86×42. Risultati in [touch-results.json](../modal-ui-style-fix/touch-results.json). La soglia indicativa 44×44 aiuta a scegliere i controlli da riesaminare; non è una certificazione. Queste misure su emulazione Chromium non equivalgono a prove su Android, iPhone o tablet fisici. Progettare un lavoro responsive separato per target, spaziatura, safe area, tastiera virtuale e orientamenti; le dimensioni fisiche in pollici non determinano il viewport CSS.
