# Audit statico lifecycle JS — finestre Build 280

## Stato e fonte

**STATIC_AUDIT_COMPLETE_BEHAVIOR_UNVERIFIED.** Nessun browser, provider, GPS o test comportamentale eseguito da questo audit; nessuna modifica al runtime/repository. Sono censiti i 38 dialog del DOM comunicati dall’agente HTML/CSS e il pannello `offlineTilePanel` separato. La verifica riguarda il ciclo JS delle finestre; markup, CSS e prove browser sono di altri esecutori.

Fonte immutabile: commit `c33f58c956e9630b03f9ff86eb35eccd35879a4a`, blob `d2ec773205da2a6d4bf954f635765eb872ec646c`, runtime SHA256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`, 11.108.654 byte. L’esatto raw Git è stato confrontato anche con i byte del file usato nelle letture mirate. Metodo: OM §4, Regola B, checklist lifecycle al commit `365a3172ea4878b38be446aefdcf6edcb5735f27`. Le linee numeriche di questo rapporto sono coordinate LF del blob, non un rimando a `main` mutevole.

## Evidenza principale

- **4 aperture contestuali:** `convertModal` e `waypointModal` con rami espliciti; `helpOverlay` e `qrModal` attraverso `openContextAwareAppDialog`.
- **11 opener con guard GIS e show**, 3 opener floating con show ma senza guard GIS locale, 1 drawer con show e backdrop custom fuoriGIS.
- **19 dialog secondari usano showModal senza ramo GIS**. È uno scostamento statico rispetto al modello richiesto dalla checklist quando si interviene su quei dialog; non è un FAIL browser né dimostra che tutti debbano diventare non modali senza verificare le conferme e i guard delle operazioni.
- **18 pannelli supportati dal minimize comune**, con registro e dock condivisi. QR e dialog secondari non appartengono a tale allowlist.
- Le chiusure esaminate sono indirizzate a ID di dialog o a controlli scoped al singolo dialog. Non è stato trovato un binder di chiusura globale su `querySelectorAll` dei dialog o di `.app-modal-close`.

### Reachability del contesto fuoriGIS

`state.gisMode` nasce true; `gisInit` conserva un opt-out futuro, ma `init` ripristina esplicitamente `state.gisMode=true` anche dopo lettura delle vecchie preferenze (103590–103594). Il commento dichiara il layout classico disattivato nella release. Non è stato identificato un comando UI/query per uscire normalmente dal GIS. Pertanto i rami fuoriGIS sono censiti come codice legacy: forzare classi o stato in una pagina di prova sarebbe una diagnosi artificiale, non prova di raggiungibilità da parte dell’utente.

## Finding e candidati da verificare

| ID | Natura e evidenza statica | Portata |
|---|---|---|
| JS-L01 | I 19 opener marcati `showModal senza ramo GIS` nella matrice non applicano il modello context-aware della checklist. Tra essi `polygonOpenVertexCoordModal` (86106), export/import Waypoint, salvataggio/conferme Traccia, picker Astro/Range Rings e conferme offline/OPSEC/reset. | Scostamento di progetto da valutare nel prossimo scope lifecycle. La semantica modale può interferire con mappa/pannelli GIS; nessun esito browser attribuito. Le conferme distruttive richiedono una decisione coerente, non una sostituzione automatica globale. |
| JS-L02 | `bindHotkeys` registra un listener Escape sul documento (51862), e `gisInit` un secondo listener (81239). Nessuno dei due parte controllando `ev.defaultPrevented`. Il primo può chiudere Help/QR (52128); il secondo chiude Converti e altre finestre per priorità fissa di ID (81325 e seguenti), senza scegliere il pannello effettivamente in primo piano. | Rischio concreto di doppia chiusura o chiusura del pannello diverso da quello attivo. Caso candidato: Help + Converti aperti, un Escape, con eventuali modalità pick disattivate. Segnalato al browser agent; non riprodotto da questo audit. |
| JS-L03 | Nel secondo listener Escape, `favoritesPanel` (81343) e `dflightDetailsPanel` (81397) non hanno il guard `gisPanelIsMinimized` presente invece per Search, History, Layers, Astro, Range Rings, Measure, Carto, D-Flight Control, Routing, Workbench, Waypoint e Track. Minimize mantiene `open` e stato del pannello. | Possibile chiusura di una finestra minimizzata da un Escape destinato al contesto visibile. Per D-Flight il percorso passa da `dflightSelectZone(null)`; l’esito completo resta da verificare. |
| JS-L04 | `openToolsDrawer` imposta `aria-modal=true` fuoriGIS e apre un backdrop custom, ma usa sempre `show()` (70730–70752). | Divergenza semantica del ramo legacy nonGIS rispetto a `showModal`; non dichiarata regressione operativa del normale ingresso GIS. In GIS scrive `aria-modal=false`. |
| JS-L05 | `openConvertModal` e `wireConvertModalFloatingGis` non aggiungono un nome accessibile al dialog. Nessuna assegnazione mirata aria-label/aria-labelledby a Converti trovata. | Supporto JS al candidato del proprietario HTML/CSS, che ha rilevato assenza di nome nel markup. Il finding di accessibilità e la verifica del nome effettivo restano attribuiti a quegli esecutori. |

Questi rilievi descrivono il runtime attuale; l’audit non attribuisce automaticamente la loro introduzione a Build 280 e non modifica i precedenti verdetti del bundle routing.

## Aperture, ARIA e chiusure

`openContextAwareAppDialog` (51792) usa show in GIS, showModal fuoriGIS con fallback; dopo apertura imposta aria-modal sulla modalità effettiva tramite `matches(':modal')`, con fallback contestuale. Se il dialog è già aperto non ne cambia la modalità nativa. Non essendoci un normale toggle GIS/nonGIS in questa release, tale particolare non è un bug operativo dimostrato. I due caller verificati sono `openHelp` e `openQrModal`.

Converti e Waypoint hanno rami show/showModal espliciti e scrivono aria-modal in base al contesto; non passano dall’helper comune. Per i floating GIS-only il ritorno fuoriGIS è presente nei rispettivi opener; i tre opener non guarded sono D-Flight Control, D-Flight Details e Polygon. Il ramo `dflightAtm09OpenDetails` (43926) è un ulteriore ingresso per `dflightDetailsPanel`: preferisce show, ha fallback showModal se show non è disponibile, poi imposta aria-modal=false; anche questo fallback va considerato nell’eventuale consolidamento lifecycle.

Per i 5 dialog di conferma offline/OPSEC i controlli senza ID individuale nel markup sono cercati **dentro** il dialog ottenuto tramite ID: `d.querySelector('[data-close-offline-draft]')`, `data-close-offline-area-del`, `data-close-offline-batch-del`, `data-close-offline-global-clear`, `data-close-opsec-strict-confirm`. I binder hanno guard una-tantum e un resolver `done` locale che chiude quel solo dialog e risolve la Promise; cancel e X passano dallo stesso percorso. Non sono un binder globale di chiusura. Non sono state eseguite azioni distruttive.

`polygonWireVertexCoordModalOnce` (86156) indirizza Save/Cancel/X ai rispettivi ID, pulisce gli indici/canonici alla close e intercetta cancel/Escape. La checklist menziona espressamente il dialog vertice: la sua apertura rimane showModal anche in GIS, come riportato in JS-L01.

L’unico `document.querySelectorAll('dialog[open]')` individuato nel perimetro delle ricerche è `copyTextExecCommandHost` (73779), che sceglie un contenitore per il fallback clipboard: **non chiude finestre**. In `gisPanelAttachDrag` il fallback `.app-modal-close` è cercato dentro `root` e serve a escludere il pulsante dal trascinamento, non è un binder di close.

## Minimize, restore e pulizia

`gisMinimizePanel` (82461) è limitato al GIS e all’allowlist; mantiene il dialog aperto, applica `gis-panel-minimized`, registra un’unica entry in `_gisMinimizedPanels`, renderizza il dock e sposta il focus dalla finestra al relativo chip. I guard specifici includono subdialog Waypoint e Traccia, conferme Favorites/Layers/Astro/Range Rings/Polygon e attività brush. Routing esce dal pick e annulla il marker drag con rollback; Track chiude l’editor di stile. `gisClearPanelMinimizeUi` rimuove classe ed entry del dock nelle chiusure pertinenti.

`gisRestoreMinimizedPanel` (82572) richiede GIS e dialog ancora open, rimuove classe/dock, rialza il pannello e riapplica layout/clamp per ID; alla fine cerca il controllo di focus nella testata. `gisDockMakeChip` (82172) genera `#gisMinimizedDock [data-gis-min-panel="ID"]` e chiama restore al click. Queste sono operazioni lette nel codice: posizione, visibilità e focus effettivi devono essere osservati nel browser.

Attenzione di integrazione per un futuro passaggio dei figli a non-modal: `gisWaypointModalBlockingSubdialogsOpen` controlla soltanto Import/Export; `gisPolygonMinimizeBlocked` controlla rinomina/delete inline, non il dialog coordinate vertice. Oggi i figli nativi modali possono impedire il normale accesso ai comandi del genitore; rendendoli floating andrà riesaminata la protezione del contesto, non semplicemente sostituito showModal.

`offlineTilePanel` è un details, non un dialog. `offlinePanelMinimizeForBbox` / `offlinePanelRestoreAfterBbox` mantengono un restore token: in GIS minimizzano/ripristinano `layersPanel`; altrimenti operano sulla visibilità del floating offline. Nessuna nuova persistenza è stata introdotta o esaminata mediante dati utente.

Routing aggiunge una relazione specifica: `routingMaybeMinimizeTrackForPlanner` può minimizzare Traccia; `closeRoutingPlannerPanel` pulisce lo stato routing e ripristina Traccia soltanto se l’aveva minimizzata e il planner non è stato committed. Minimize del planner usa invece il percorso comune, lasciando i dati del planner in sessione.

## Matrice completa

I numeri dopo gli helper sono le linee delle dichiarazioni nel blob. “Nessuna scrittura nell’opener” non significa attributo assente: il valore del markup è censito dall’agente HTML/CSS.

| ID | Apertura | Modello statico | Chiusura / binder scoped | Minimize comune | aria-modal JS |
|---|---|---|---|---|---|
| `convertModal` | `openConvertModal` (83317) | show GIS / showModal fuoriGIS, ramo esplicito | `closeConvertModal` (83378) | sì | scrittura nell’apertura |
| `waypointModal` | `openWaypointModal` (83581) | show GIS / showModal fuoriGIS, ramo esplicito | `closeWaypointModal` (83652) | sì | scrittura nell’apertura |
| `jpgExportDialog` | `openJpgExportDialog` (32955) | showModal senza ramo GIS | `closeJpgExportDialog` (32944) | no | nessuna scrittura nell’opener; vedere markup |
| `waypointExportDialog` | `openWaypointExportDialog` (83743) | showModal senza ramo GIS | `closeWaypointExportDialog` (83766) | no | nessuna scrittura nell’opener; vedere markup |
| `waypointImportDialog` | `openWaypointImportDialog` (83848) | showModal senza ramo GIS | `closeWaypointImportDialog` (83870) | no | nessuna scrittura nell’opener; vedere markup |
| `waypointDeleteAllDialog` | `openWaypointDeleteAllDialog` (102611) | showModal senza ramo GIS | `closeWaypointDeleteAllDialog` (102630) | no | nessuna scrittura nell’opener; vedere markup |
| `waypointFromFavoritesDialog` | `openWaypointFromFavoritesDialog` (102716) | showModal senza ramo GIS | `closeWaypointFromFavoritesDialog` (102734) | no | nessuna scrittura nell’opener; vedere markup |
| `trackExportDialog` | `openTrackExportDialog` (101575) | showModal senza ramo GIS | `closeTrackExportDialog` (101597) | no | nessuna scrittura nell’opener; vedere markup |
| `trackSaveNameDialog` | `openTrackSaveNameDialog` (68795) | showModal senza ramo GIS | `closeTrackSaveNameDialog` (68790) | no | nessuna scrittura nell’opener; vedere markup |
| `trackUnsavedCloseDialog` | `openTrackUnsavedCloseDialog` (68880) | showModal senza ramo GIS | `closeTrackUnsavedCloseDialog` (68875) | no | nessuna scrittura nell’opener; vedere markup |
| `trackClearCurrentDialog` | `openTrackClearCurrentDialog` (68844) | showModal senza ramo GIS | `closeTrackClearCurrentDialog` (68839) | no | nessuna scrittura nell’opener; vedere markup |
| `searchPanel` | `openSearchPanel` (100696) | show, guard GIS esplicito | `closeSearchPanel` (100726) | sì | scrittura nell’apertura |
| `historyPanel` | `openHistoryPanel` (100818) | show, guard GIS esplicito | `closeHistoryPanel` (100846) | sì | scrittura nell’apertura |
| `favoritesPanel` | `openFavoritesPanel` (100874) | show, guard GIS esplicito | `closeFavoritesPanel` (100900) | sì | scrittura nell’apertura |
| `layersPanel` | `openLayersPanel` (100933) | show, guard GIS esplicito | `closeLayersPanel` (101346) | sì | scrittura nell’apertura |
| `measurePanel` | `openMeasureFloatingPanelGis` (100454) | show, guard GIS esplicito | `closeMeasureFloatingPanelGis` (100517) | sì | scrittura nell’apertura |
| `cartoIgmPanel` | `openCartoIgmPanel` (28043) | show, guard GIS esplicito | `closeCartoIgmPanel` (28108) | sì | scrittura nell’apertura |
| `dflightPanel` | `dflightOpenControlPanel` (39966) | show; nessun guard GIS nel solo opener | `dflightCloseControlPanel` (39998) | sì | scrittura nell’apertura |
| `dflightDetailsPanel` | `dflightOpenDetailsPanel` (40002) | show; nessun guard GIS nel solo opener | `dflightCloseDetailsPanel` (40022) | sì | scrittura nell’apertura |
| `gisWorkbenchPanel` | `openGisWorkbenchPanel` (99780) | show, guard GIS esplicito | `closeGisWorkbenchPanel` (99816) | sì | scrittura nell’apertura |
| `rangeRingsPanel` | `openRangeRingsFloatingPanelGis` (84948) | show, guard GIS esplicito | `closeRangeRingsPanel` (84994) | sì | scrittura nell’apertura |
| `polygonPanel` | `openPolygonPanel` (85043) | show; nessun guard GIS nel solo opener | `closePolygonPanel` (85068) | sì | nessuna scrittura nell’opener; vedere markup |
| `polygonVertexCoordDialog` | `polygonOpenVertexCoordModal` (86073) | showModal senza ramo GIS | `polygonCloseVertexCoordModal` (86061) | no | nessuna scrittura nell’opener; vedere markup |
| `astroPanel` | `openAstroFloatingPanelGis` (100614) | show, guard GIS esplicito | `closeAstroPanel` (100681) | sì | scrittura nell’apertura |
| `rrSourcePickerDialog` | `rrOpenRrSourcePicker` (78042) | showModal senza ramo GIS | `rrCloseRrSourcePicker` (77944) | no | nessuna scrittura nell’opener; vedere markup |
| `astroWaypointPicker` | `astroOpenWaypointPicker` (75032) | showModal senza ramo GIS | `astroCloseWaypointPicker` (75023) | no | nessuna scrittura nell’opener; vedere markup |
| `astroFavoritePicker` | `astroOpenFavoritePicker` (75393) | showModal senza ramo GIS | `astroCloseFavoritePicker` (75384) | no | nessuna scrittura nell’opener; vedere markup |
| `offlineDraftWarnDialog` | `showOfflineDraftWarnDialog` (101015) | showModal senza ramo GIS | `ensureOfflineDraftWarnDialogWired` (100976) | no | nessuna scrittura nell’opener; vedere markup |
| `offlineAreaDeleteDialog` | `showOfflineAreaDeleteChoiceDialog` (101126) | showModal senza ramo GIS | `ensureOfflineAreaDeleteDialogWired` (101094) | no | nessuna scrittura nell’opener; vedere markup |
| `offlineAreaBatchDeleteDialog` | `showOfflineAreaBatchDeleteChoiceDialog` (101182) | showModal senza ramo GIS | `ensureOfflineAreaBatchDeleteDialogWired` (101150) | no | nessuna scrittura nell’opener; vedere markup |
| `offlineGlobalClearDialog` | `showOfflineGlobalClearDialog` (101236) | showModal senza ramo GIS | `ensureOfflineGlobalClearDialogWired` (101209) | no | nessuna scrittura nell’opener; vedere markup |
| `opsecStrictConfirmDialog` | `showOpsecStrictConfirmDialog` (101284) | showModal senza ramo GIS | `ensureOpsecStrictConfirmDialogWired` (101257) | no | nessuna scrittura nell’opener; vedere markup |
| `appFullResetDialog` | `openAppFullResetDialog` (51601) | showModal senza ramo GIS | `closeAppFullResetDialog` (51618) | no | nessuna scrittura nell’opener; vedere markup |
| `trackModal` | `openTrackModal` (101388) | show, guard GIS esplicito | `closeTrackModal` (101487) | sì | nessuna scrittura nell’opener; vedere markup |
| `routingPlannerPanel` | `openRoutingPlannerPanel` (98544) | show, guard GIS esplicito | `closeRoutingPlannerPanel` (98523) | sì | nessuna scrittura nell’opener; vedere markup |
| `toolsDrawer` | `openToolsDrawer` (70721) | show sempre; backdrop custom fuoriGIS | `closeToolsDrawer` (70782) | sì | scrittura nell’apertura |
| `helpOverlay` | `openHelp` (51821) | helper contestuale condiviso | `closeHelp` (51836) | sì | helper contestuale |
| `qrModal` | `openQrModal` (104743) | helper contestuale condiviso | `closeQrModal` (104761) | no | helper contestuale |

## Coordinamento e limiti

Sono stati passati agli altri esecutori soltanto ID, helper e casi mirati: Help/Converti con Escape, toolsDrawer legacy, dialog vertice, restore dock e Astro mobile. Per Astro, `_astroPanelLayoutOpts` usa pad12/topbarReserve104 e altezza 0,52/cap560; `wireAstroPanelFloatingGis` e `clampAstroPanelRect` scrivono top/left/width/height inline. Il possibile override CSS mobile `!important` è un candidato dell’agente HTML/CSS, non un risultato comportamentale di questo audit.

Inventario ed estratti mirati sono in `lifecycle-map.json`. I confini delle dichiarazioni sono usati soltanto per indicizzazione e prova degli statement letti: non è stato prodotto un call graph completo né un certificato di assenza di ogni possibile listener dinamico. Le sezioni self-test, come `dflightSelfTestTf`, `gisDockSelfTestGC` e `gisModalEdgeResizeSelfTest`, contengono chiamate show e sono state escluse dal conteggio degli opener utente; non sono state eseguite. L’attività non costituisce review AI esterna, QA operatore o PASS comportamentale delle finestre.
