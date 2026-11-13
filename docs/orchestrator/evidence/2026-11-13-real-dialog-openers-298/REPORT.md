# Build298 - QA desktop real opener e annullamenti sicuri

Data: 13 novembre 2026. Scope: audit supplementare read-only, NON una nuova build e NON QA operatore. GitHub origin/main al preflight e305dcb7c48241d38a881d062578a673907281ab. Runtime Build298, source 651c872b914025d6f0e84b19e51313b92599342b, SHA256 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca.

## Ambiente
TMAR Desktop Commander Windows, Edge Chromium CDP con profilo temporaneo isolato, pagina HTTPS nativa GIS senza sostituzione/injection HTML. Sono stati bloccati i fetch verso provider terzi, non i GET di caricamento HTML della stessa origine. Viewport 1440x900 e 1024x650. Ciascun scenario e stato eseguito con un nuovo documento dell'app nel browser isolato. Gli opener sono vere funzioni JavaScript del runtime invocate dal CDP, non click reali su tutti i menu.

## A. Apertura e chiusura di sei dialog operativi

| Dialogo | Funzione di apertura | 1440x900 | 1024x650 |
| --- | --- | --- | --- |
| Esporta waypoint | openWaypointExportDialog() | PASS | PASS |
| Importa waypoint | openWaypointImportDialog() | PASS | PASS |
| Esporta traccia | openTrackExportDialog() | PASS | PASS |
| Picker Astro waypoint | astroOpenWaypointPicker() | PASS | PASS |
| Picker Astro preferiti | astroOpenFavoritePicker() | PASS | PASS |
| Esporta mappa JPG | openJpgExportDialog() | PASS | PASS |

12/12 PASS: dialog aperto, aria-labelledby collegato a titolo non vuoto, interamente nella viewport e chiusura con Escape. Su dati assenti alcuni comandi export sono disabilitati come previsto; non e stato provato il contenuto dei formati o il salvataggio dei file. Nessun file generato/download confermato.

## B. Percorsi di annullamento sicuro

| Dialogo | Percorso di prova | 1440x900 | 1024x650 |
| --- | --- | --- | --- |
| Aggiungi waypoint dai preferiti | openWaypointFromFavoritesDialog() e closeWaypointFromFavoritesDialog() | PASS | PASS |
| Reset globale dati locali | openAppFullResetDialog() e pulsante Annulla | PASS | PASS |
| Area offline non salvata | showOfflineDraftWarnDialog() e Annulla | PASS / cancel | PASS / cancel |
| Elimina area offline | showOfflineAreaDeleteChoiceDialog() e Annulla | PASS / cancel | PASS / cancel |
| Elimina aree offline selezionate | showOfflineAreaBatchDeleteChoiceDialog({}) e Annulla | PASS / cancel | PASS / cancel |
| Svuota cache globale tile | showOfflineGlobalClearDialog() e Annulla | PASS / false | PASS / false |

12/12 PASS: opener reale, titolo accessibile, geometria valida, pulsante Annulla o chiusura corretti e dialog chiuso. Non e stato premuto alcun Conferma/Cancella dati/Svuota. Nessuna operazione distruttiva eseguita, nessuna scrittura nello stato personale dell'operatore.

## Bilancio e limiti
Totale 24/24 verifiche mirate PASS su 12 categorie per due viewport. Prima suite: 661 richieste terze bloccate, zero POST, zero Runtime.exceptionThrown. Seconda suite: 616 richieste terze bloccate, zero POST e zero eccezioni JS. Tutto eseguito nel profilo browser isolato, non in una sessione utente reale.

Questa diagnostica NON costituisce certificazione delle funzionalita complete dei 38 dialoghi, dei contenuti di import/export, di file JPG, di conferme distruttive, di dati D-Flight reali, di servizi esterni o di dispositivi mobili fisici. Il runtime non e stato modificato.

## Gate invariati
Nessun nuovo difetto confermato, nessuna Build299 o deploy. Il gate QA operatore Build298 su zona D-Flight reale resta PENDING; le QA Build294/295 rimangono distinte e PENDING. Sviluppo GIS telefono in PAUSA. Il futuro Bundle F Routing resta NOT OPENED / da scegliere, non aperto tramite questa attivita.
