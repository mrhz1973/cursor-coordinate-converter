# Audit statico finestre — Build 280

**Stato: inventario HTML/CSS completato; nessun verdetto browser attribuito.** Data: 09/11/2026 15:43:22 Europe/Rome.

Fonte immutabile: commit `c33f58c956e9630b03f9ff86eb35eccd35879a4a`, blob runtime Build 280 da 11.108.654 byte, SHA-256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`. La copia locale letta coincide byte per byte con il runtime del commit.

Il perimetro è la struttura delle finestre dichiarate nel markup e le regole CSS pertinenti. Il lifecycle JS è affidato all'altro agente; geometria calcolata, accessibilità effettiva e raggiungibilità dei comandi richiedono la prova browser dedicata. Nessuna modifica a runtime/repository/servizi, nessuna richiesta provider, nessun accesso al profilo browser dell'utente.

## Evidenza acquisita

- **38 dialog HTML effettivi**, di cui **37 `.app-modal`** e il drawer Strumenti con struttura propria. I match `<dialog>` presenti nei commenti o nelle stringhe JS sono esclusi.
- **18 dialog con pulsante di minimizzazione nel markup**, compreso Strumenti; gli altri 20 sono esportazioni, picker, decisioni brevi o QR. L'assenza del pulsante non dimostra da sola un difetto.
- Tutti i 38 dialog hanno un controllo di chiusura nel markup. I controlli rilevati hanno `type="button"`; i cinque dialog offline/OPSEC usano un `data-close-*` distinto invece di un ID sul pulsante. Il collega lifecycle ha verificato il binding scoped al relativo dialog: non viene dedotto un difetto da questa sola differenza.
- **37 dialog hanno `aria-labelledby` con destinazione presente**. Converti è l'unico senza `aria-labelledby` o `aria-label` statici. Due titoli vuoti nel markup (`rrSourcePickerDialog` e `opsecStrictConfirmDialog`) hanno chiavi i18n: non sono classificati come mancanti a runtime.
- Sono censiti separatamente **`offlineTilePanel`** (contenuto `details`, adattato a pannello tramite wrapper runtime) e **`tabDrawer`** (aside legacy inizialmente hidden). Popover e wrapper generati interamente da JS non sono oggetto di un censimento HTML completo.

La base CSS già condivisa include: `dialog.app-modal` con limite verticale `min(92vh,92dvh)`, header flessibile, chiusura e minimizzazione da 34×34 px, glifo × via `::before`, corpo con scroll interno; per GIS, pannelli fissi con limiti viewport e layout ulteriormente determinato dal JS. Il corpo adatta il limite verticale alle safe-area sotto 768 px. Questi sono valori dichiarati, non misure browser.

## Candidati da verificare nel browser

| ID | Fatto statico | Impatto possibile | Verifica mirata |
| --- | --- | --- | --- |
| `WIN-280-A11Y-CONVERT` | `convertModal` e il suo h2 non dichiarano un collegamento per il nome accessibile. Il collega non ha trovato assegnazioni nei due helper di apertura/layout esaminati. | Dialog privo di nome nell'albero di accessibilità. | Aprire Converti da `#topbarConvertBtn` e leggere il nome effettivo dal tree AX; non basta l'assenza HTML. |
| `WIN-280-ASTRO-SAFE-TOP` | A ≤600 px, `body.gis-mode dialog#astroPanel.astro-panel` impone `top:0!important`, `width:100vw!important`, `height:min(92vh,720px)!important`, `max-height:92vh` (CSS L9311). | Possibile prevalenza sulla posizione calcolata dal layout GIS e sovrapposizione alla toolbar/safe-area. | Aprire Astro a 390 px, confrontare bounds del pannello/header/azioni con toolbar e area utile; niente GPS o rete. |

**Nessun FAIL del prodotto è attribuito da questa sola analisi statica.** I due candidati sono già inoltrati al browser agent. Il comportamento di Escape di Strumenti e il ramo nonGIS appartengono all'audit lifecycle/browser e restano fuori dal verdetto HTML/CSS.

Ordine consigliato della verifica: **Astro mobile** per la possibile interferenza con i comandi, quindi **nome accessibile di Converti**. La priorità indica cosa misurare per primo, non una severità di difetto già dimostrato.

## Cosa non giustifica una riscrittura generale

L'ossatura comune esiste già. Una normalizzazione indiscriminata di tutti i 38 dialog rischierebbe di trattare come equivalenti pannelli operativi, conferme brevi, esportazioni e drawer. Le regole di altezza e scroll possono essere sovrascritte intenzionalmente dal layout runtime: eventuali difetti vanno riprodotti sul pannello interessato.

La specifica pertinente del backlog richiede altezza utile, header e azioni raggiungibili, scroll interno e compatibilità con minimizzazione/disegno. Non si trasforma ogni differenza di classe o `max-height` in un finding funzionale. Il percorso nonGIS attualmente disabilitato non va abilitato per ampliare artificialmente la matrice.

## Sottoinsieme browser e locator statici

| Pannello | Apertura | Header / corpo | − / × |
| --- | --- | --- | --- |
| Converti | `#topbarConvertBtn` | `#convertModalHead` / `#convertModalBody` | `[data-role="convertmodal-minimize"]` / `#convertModalClose` |
| Strumenti | `#btnTopbarTools` o `#btnTools` | `#toolsDrawerHead` / `#toolsDrawer > .tools-drawer-body` | `#toolsDrawerMinimize` / `#toolsDrawerClose` |
| Guida | `#btnHelp`, nel menu Impostazioni | `#helpOverlay .app-modal-head` / `#helpOverlay .app-modal-body` | `[data-role="helppanel-minimize"]` / `#helpClose` |
| Astro | opener runtime fornito dal collega: `#toolsMenuGrid [data-tool="astro"]` | `#astroPanelHead` / `#astroPanelBody` | `[data-role="astropanel-minimize"]` / `#astroPanelClose` |
| Misura, riferimento opzionale | opener runtime da collega lifecycle | `#measurePanelHead` / `#measurePanelBody` | `[data-role="measurepanel-minimize"]` / `#measurePanelClose` |

Il ripristino dal dock è generato dal JS; locator comunicato dal collega: `#gisMinimizedDock [data-gis-min-panel="ID"]`. Non è un elemento presente nel markup statico originale.

## Inventario dichiarato

Titoli letterali o chiavi i18n: possono essere aggiornati dal runtime. “Collegato” significa soltanto che l'ID di `aria-labelledby` esiste nel markup. Le righe sono riferimenti al sorgente immutabile, non conteggi di prove.

| ID | Titolo nel markup | − dichiarato | Nome statico | Riga |
| --- | --- | --- | --- | ---: |
| `offlineTilePanel` | Download mappe Offline | — | non dialog | 13433 |
| `tabDrawer` | Titolo dinamico/non rilevato | — | non dialog | 14602 |
| `convertModal` | Convertitore — inserisci coordinate | sì | assente nel markup | 14615 |
| `waypointModal` | Waypoint | sì | collegato | 14637 |
| `jpgExportDialog` | Esporta mappa JPG | — | collegato | 14673 |
| `waypointExportDialog` | Esporta waypoint | — | collegato | 14778 |
| `waypointImportDialog` | Importa waypoint | — | collegato | 14805 |
| `waypointDeleteAllDialog` | Eliminare tutti i waypoint? | — | collegato | 14824 |
| `waypointFromFavoritesDialog` | Aggiungi dai preferiti | — | collegato | 14838 |
| `trackExportDialog` | Esporta traccia | — | collegato | 14855 |
| `trackSaveNameDialog` | Salva traccia | — | collegato | 14876 |
| `trackUnsavedCloseDialog` | Traccia non salvata | — | collegato | 14895 |
| `trackClearCurrentDialog` | Elimina traccia corrente | — | collegato | 14911 |
| `searchPanel` | Cerca | sì | collegato | 14926 |
| `historyPanel` | Cronologia | sì | collegato | 14945 |
| `favoritesPanel` | Preferiti | sì | collegato | 14963 |
| `layersPanel` | Mappe Offline | sì | collegato | 14982 |
| `measurePanel` | Misura | sì | collegato | 15001 |
| `cartoIgmPanel` | Indice cartografico IGM / IIM | sì | collegato | 15020 |
| `dflightPanel` | Zone D-Flight (UAS) | sì | collegato | 15137 |
| `dflightDetailsPanel` | Dettaglio zona | sì | collegato | 15215 |
| `gisWorkbenchPanel` | Oggetti GIS | sì | collegato | 15234 |
| `rangeRingsPanel` | Range Rings | sì | collegato | 15320 |
| `polygonPanel` | Poligoni | sì | collegato | 15339 |
| `polygonVertexCoordDialog` | Modifica coordinate vertice | — | collegato | 15491 |
| `astroPanel` | Alba / tramonto / luna (locale) | sì | collegato | 15524 |
| `rrSourcePickerDialog` | Titolo dinamico/non rilevato | — | collegato | 15566 |
| `astroWaypointPicker` | Waypoint | — | collegato | 15581 |
| `astroFavoritePicker` | Scegli preferito | — | collegato | 15611 |
| `offlineDraftWarnDialog` | Area non salvata | — | collegato | 15641 |
| `offlineAreaDeleteDialog` | Rimuovere area offline? | — | collegato | 15656 |
| `offlineAreaBatchDeleteDialog` | Rimuovere aree selezionate? | — | collegato | 15672 |
| `offlineGlobalClearDialog` | Svuotare tutta la cache tile? | — | collegato | 15688 |
| `opsecStrictConfirmDialog` | Titolo dinamico/non rilevato | — | collegato | 15702 |
| `appFullResetDialog` | Cancellare tutti i dati locali? | — | collegato | 15716 |
| `trackModal` | Traccia | sì | collegato | 15736 |
| `routingPlannerPanel` | Pianifica percorso | sì | collegato | 15756 |
| `toolsDrawer` | 🧰 Strumenti | sì | collegato | 16024 |
| `helpOverlay` | Guida rapida & scorciatoie | sì | collegato | 16135 |
| `qrModal` | QR — Condividi coordinata | — | collegato | 17412 |

## Artefatti e riproducibilità

- `inventory.json`: 40 elementi, controlli/header/corpi, riferimenti alle regole CSS e 29 regole mirate salvate. Le 593 regole correlate sono indicizzate per riga; non viene pubblicato un dump dell'intero stylesheet.
- `inventory.py`: estrazione mediante parser HTML e scansione lessicale CSS locale. Non valuta la cascade, il layout o il comportamento JS.
- `manifest.json`: SHA-256 degli artefatti del presente audit.

La lettura ha usato il runtime pinning indicato sopra; nessun test del routing già consumato è stato ripetuto. Nessun PASS operatore, test Safari/iPhone o misura visiva è dedotto dall'inventario.
