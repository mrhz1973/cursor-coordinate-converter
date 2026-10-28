# Report guida utente e FAQ — analisi statica

Base: bd03ae754f9f1fc26b4f8599a03577a833c97210, runtime ce02321c6a95f729c6b9e1baeabe27077689a9c8. Proposta: guide.md in questa directory; nessuna modifica al runtime.

## Collocazione raccomandata
Impostazioni ha già pulsante #btnHelp «Guida» e #btnReleaseNotes; la finestra #helpOverlay contiene le sezioni, controlli geocoding e informazioni/notes. Riutilizzare la Guida esistente e aggiungere sezioni chiaramente denominate «Guida utente» e «Domande frequenti», con headings e details/summary nativi, lasciando funzionanti helpClose, minimizzazione e scorciatoie. Se si aggiunge pulsante FAQ direttamente in Impostazioni, aprire la medesima guida e portare focus al summary, come btnReleaseNotes; nessuna nuova finestra, rete o storage.

## Controlli da preservare tassativamente
All'interno della guida esistente #geoSettings ospita #setGeoEnabled, #setGeoReverseAuto, #setOpsecStrict, #setGeoEndpoint, #btnGeoImport, #btnGeoClearDs e #geoDatasetFile. Non sostituire l'intero contenuto della guida tramite innerHTML, non duplicare ID, non eliminare controls/listeners. Conservare #btnClearStore, #persistStatus, #appBuildAbout, #releaseNotesSummary e lifecycle modale/pannello GIS.

## Correzioni urgenti al testo preesistente
- help.guide.privacy.body (riga ~15922; duplicato nei dizionari IT/EN/FR): «nessun server» e «tile unici dati di rete» non sono affidabili; geocoding, servizi meteo e routing, proxy/tiles possono usare rete. Sostituire solo stringa IT coerentemente con L10N freeze; non sopprimere OPSEC.
- help.guide.gps.body (~15850): cita tracking live. Non affermare che esista o sia implicito; se la funzione non viene verificata, spiegare soltanto la posizione su richiesta dell'utente.
- help.guide.geo.rev (~15887): «dopo ogni conversione» contraddice presenza del controllo #setGeoReverseAuto (~15892) e i gate; dire «se abilitato e consentito» senza promettere automaticità.
- help.guide.offline.* (~15863) fa riferimento a «Pannello pre-cache» mentre etichetta attiva è «Mappe Offline» e distingue area salvata/download. Usare guida proposta e distinguere sempre tile scaricate da nome area e export JPG.
- help.guide.geo.fwd (~15886) cita «Cerca indirizzo» anziché pannello «Cerca»; usare etichetta effettiva.
- help.guide.share.export (~15909) elenca KMZ senza dimostrazione: non promettere formati particolari finché non verificati nel percorso pertinente. Importazione drag/drop non assumere CSV né KMZ senza test.
- help.guide.convert.body (~15845) «qualsiasi formato» e «tutti i formati» sono formulazioni eccessive; usare i formati disponibili e verificare la visualizzazione dei risultati e gli eventuali errori.

Nota: l'attuale UI è dinamica e parte delle stringhe statiche è sovrascritta da i18n. Correggere la chiave IT appropriata oltre al testo fallback, preservare EN/FR e meccanismo i18n in accordo con freeze. La guida proposta deve allinearsi alle etichette reali dell'interfaccia dopo la riorganizzazione barra in corso.

## Evidenza puntuale
- Pannello Impostazioni e bottoni guida/note: monolite righe 12745–12788.
- Area offline: 13150–13245, pulsante «Scarica area corrente», layer condiviso e range zoom, salvataggio area, Export JPG offline a un solo zoom.
- Dialog JPG vista: 14367–14454, include opzioni scala/overlay/coordinate.
- Guida attuale, dati locali, geocoding, note: 15827–15994; dizionario italiano ~17700–17880 e 18660–18682.
- Privacy: help stesso avverte che un servizio Nominatim riceve ricerca; le stringhe OPSEC citano blocchi e consensi proxy per sessione. Non attribuire garanzia assoluta oltre ai gate.
- Routing: FINO a implementazione e verifica dell'obiettivo land-only non presentare l'assenza traghetti come acquisita.

## Validazione raccomandata
Browser desktop/mobile con tastiera e touch emulato: accesso da Impostazioni, apertura FAQ, scroll, chiusura/minimizza/reopen, mantenimento controlli geocoding e note di rilascio; contenuti leggibili, nessuna richiesta di rete attribuibile all'apertura guida; strict e offline conservano blocchi; nessuna modifica storage alla sola apertura; zero pageerror. Non attestare salute provider da mock o dispositivo fisico da emulazione.
