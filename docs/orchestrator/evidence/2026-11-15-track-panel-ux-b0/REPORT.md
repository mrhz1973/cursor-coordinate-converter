# B0 - Audit statico Traccia desktop, Build305

Data: 15 novembre 2026. B0 READ-ONLY: nessuna implementazione, test browser, deploy o QA operatore nuova.
Fonte: GitHub source `95080bac23a1642c1a2c6f8c0bdd4885b7bac960`, monolite SHA256 `5ffa64ff3ba9746de9a5463cc4adfc058ceb7de77e095aacdd51259e39d72464`, intestazione e funzioni con numeri di riga sottostanti. Segnalazioni UI e screenshot della chat49/attuale come richiesta prodotto, non QA tecnica.

## Osservazioni verificate staticamente
1. Il bottone canonico `#btnTrackSaveLibrary` esiste nella toolbar sotto Tracce salvate (L14285-14290), ma `syncTrackSaveLibraryActionsState` lo forza hidden/disabled (L71098-71117). Il bottone alternativo e generato dinamicamente in `#track-points-head` (L70430-70449), solo con almeno 2 punti e senza prompt bloccante; con zero punti tutta l'intestazione viene nascosta (L70395-70405). Questo spiega la CTA invisibile nello screenshot.
2. `#btnTrackImport` sopra la tabella (L14111) apre `#trackFileInput` (L80679-80707), che invoca `importTrackFile` per la traccia corrente.
3. `#btnTrackExportOpenBtn` sopra (L14113-14114, L80897-80900) apre il dialog di esportazione: `syncTrackExportDialogUi` usa `getSelectedSavedTrackIdsForExport` (L102819-102838), cioe gli ID selezionati dell'archivio, non i punti della traccia corrente.
4. La toolbar delle tracce salvate (L14287-14300) contiene Salva legacy nascosto e azioni batch di visibilita, eliminazione e stile, ma non una coppia Importa/Esporta dedicata.
5. Il Workbench offre gia `#wbImportHubSavedTracks` (L15541) e un applicatore transazionale `gisImportHubApplyPreview` (L36630-36699) con prevalidate, snapshot, saveStoreReported, verifica di persistenza e rollback. Questo non dimostra ancora che un tasto archivio possa invocare correttamente il flusso senza ulteriore audit UI/browser.

## Delta proposto, due categorie isolate
A. ROUTINE UI solo desktop: pulsante Salva attivo/disabilitato ma sempre scopribile vicino a Tracce salvate, eliminando il doppione dinamico SOLO su desktop; mantenere behavior mobile esistente. Etichette chiare: Importa/Esporta corrente in alto e Importa/Esporta archivio in basso, con tooltip che spiegano il target. Nessun bottone senza azione reale.
B. DELICATO I/O e storage, separato dalla sola cosmesi: corrente export usa solo geometria draft; archive export usa i saved ID selezionati; import archivio usa applicatore transazionale e sanitizer esistenti, evitando doppie scritture o conversioni non volute. Verificare quote GPX/KML e hash geometrico su roundtrip. Senza autorizzare provider, upload remoto o modificare state.mapWaypoints[].

## Acceptance prima di un eventuale deploy
Desktop 0/1 punti: Salva visibile, disabled, con motivazione; >=2 punti: enabled e apre il dialog reale. Editing di SavedTrack: aggiornamento conforme al draft e dati storici intatti. Esporta corrente senza selezione archivio; esporta archivio solo con le righe selezionate (0/N). Importa corrente non archivia automaticamente; importa archivio conferma esplicitamente e passa dai controlli storage esistenti. GPX/KML quote complete/parziali, legacy2D e poligoni invariati. Verifiche negative Annulla file picker, offline, OPSEC Strict, zero GPS, nessuna rete non opt-in; desktop su viewport corti; parity mobile preesistente (sviluppo mobile PAUSA).

## Limiti e gate
Nessuna prova browser, nessun FAIL applicativo nuovo, nessun commit HTML o candidato successivo; reviewer esterno e QA umane non svolte in questo audit. La precisione DTM terreno HOLD e il profilo da traccia XY senza quote restano workstream distinti.
