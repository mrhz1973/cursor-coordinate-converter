# Audit leggero — pannello Strumenti

Data: 2026-10-30 (Europe/Rome)
Ambiente: runtime `http://100.99.54.93:8000/coordinate_converter Claude.html`, titolo `TMART GIS tool · GIS-EXPORT-ALIGNMENT-A · build 268`.
Riferimento visuale: screenshot utente `codex-clipboard-e4f5d959-d24b-4ec6-b4b2-7f33b57a5f2d.png`.

## Perimetro e metodo

- Ispezione mirata del markup, CSS e handler Strumenti nell'HTML corrispondente nel repo `mart-gis` (nessuna modifica al repo o al runtime).
- Controllo visivo/funzionale nel browser desktop (viewport rilevata 1852×1127) tramite Playwright/DOM sul tab runtime già aperto.
- Esplorati i sei tile: Batch, Note, Sessione, Diagnostica, Astro, Declinazione; apertura/chiusura del drawer; apertura Preferiti in sola lettura; presenza e scroll delle righe.
- Non creati, cancellati o riordinati preferiti; nessun import/export, nessun reset storage/dati.
- Nessuna richiesta remota iniziata deliberatamente dai controlli del pannello. Il bridge non ha permesso di installare un interceptor sul tab live; non si certifica quindi il traffico complessivo della mappa/runtime.

## Risultati

### Funzionalità confermate

- Il drawer Strumenti apre con sei tile GIS visibili e la griglia usa due colonne alla larghezza desktop osservata.
- Batch, Note, Sessione, Diagnostica e Declinazione aprono nel riquadro inline la sezione attesa. Diagnostica mostra lettura locale/build/storage/rete e avvisi, senza che l'audit attivasse azioni di esportazione o aggiornamento manuale.
- Astro apre il dialog flottante dedicato; il codice lo dichiara esplicitamente come eccezione all'inline (`activateToolPanel`, HTML circa riga 102440). Quindi non è un tile guasto. Il drawer resta aperto mentre il pannello Astro fluttua: comportamento previsto dal codice ma potenziale sovrapposizione UX, non bug confermato.
- La chiusura del drawer imposta `open=false`, rimuove la classe `open`, imposta `aria-hidden=true` e riporta `aria-expanded=false`; alla riapertura risulta fruibile.
- Il drawer ha scroll verticale (`overflow-y:auto`); nell'asset runtime visto aveva 694 px di contenuto contro 654 px disponibili. È stato osservato scroll interno, senza perdita della vista della mappa.
- Preferiti si apre in dialog separato. La lista riportava “Nessun preferito”; nessun dato è stato creato/modificato.

### Bug confermati

- Nessun bug funzionale confermato nel perimetro osservato.

### Osservazioni UX, non bug confermati

- Le intestazioni Info del punto, Archivio e Note e riferimenti hanno item nel markup classico, ma tali righe sono nascoste in modalità GIS per i duplicati destinati alla griglia secondaria; Preferiti resta visibile. Le tile sono raccolte sotto “Apri nello spazio sotto”. La separazione può apparire come intestazioni vuote/sezioni mancanti e allunga il pannello prima dei sei strumenti.
- La tile Astro apre un secondo pannello flottante mentre il drawer resta aperto. Coerente con l'implementazione, ma l'utente deve gestire due pannelli e può avere sovrapposizione spaziale.
- Lo screenshot fornito mostra le intestazioni vuote e le tile in viewport stretta; in quella situazione una parte considerevole dell'altezza è occupata dalle intestazioni/spazi, prima delle tile.

## Diagnostica e privacy

- In `activateToolPanel`, il ramo Astro chiama `openAstroFloatingPanelGis`; le descrizioni UI lo indicano come locale/senza rete. La verifica effettuata è funzionale, non una prova di assenza di ogni richiesta di rete.
- Batch espone anche “Aggiungi colonna Località (reverse geocoding, 1 req/s)”: è un'azione esplicitamente online. Non attivata.
- La sezione Sessione dichiara export/import JSON che comprende preferiti, cronologia, impostazioni e testo batch. Non attivata; può contenere dati operativi se esportata.
- La sezione Preferiti si descrive come memorizzata nel browser/localStorage e il pannello indicava “solo visualizzazione” per il formato lista. Nessuna modifica eseguita.

## Limiti

- Non verificato mobile in un viewport emulato: il bridge usato non consentiva di impostare il viewport sul tab esistente. Lo screenshot fornito è stato usato come riferimento visivo, non come esito di una sessione mobile indipendente.
- Il browser automation collegato non ha consentito l'intercettazione preventiva della rete esterna nel tab già aperto; nessun'azione online del pannello è stata invocata. Il runtime potrebbe comunque avere traffico cartografico di sfondo.
- La verifica della chiusura del dialog Astro è stata incoerente nel bridge: dopo il click sul controllo ×, una lettura successiva ha riportato `open` ancora presente. Chiusura del drawer invece verificata chiaramente. Non classificato come bug applicativo senza un riscontro riproducibile affidabile.
- Audit circoscritto a Strumenti e Preferiti, senza eseguire i calcoli dei tool o modificare dati persistenti.

## Riferimenti codice mirati

- Markup drawer e tile: `coordinate_converter Claude.html`, circa righe 15800–15905.
- CSS drawer e griglia: circa righe 5136–5175 e 12376–12436.
- Apertura/chiusura drawer: circa righe 70550–70625.
- Mapping e attivazione tile: circa righe 79823–79832 e 102440–102485.
- Pulizia tile al close: circa righe 82869–82878.



