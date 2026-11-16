# Build308 — Tracce in una sola finestra

Data: 16 novembre 2026. Blocco GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX1. Categoria DELICATO: importazione locale, integrazione della transazione e lifecycle della preview. CLOSURE: STANDARD_RUNTIME_BUNDLE; QA operatore PENDING.

## Identità revisionata

Base origin/main `2244ed1caf982fb21c7082ef61c642203b55917d`.
Candidato remoto verificato e raw Git immutabile `d347ec792d515c1ffaa1f8ddd5f8bf3d51d4d0c8`.
Blob HTML `6182162db2e39360cd42d33153769c0412df6902`.
SHA256 `50dcedce9e51549f36136742bfd0dab4816ce7019710c969f06007ddaed95882`.
11.200.744 byte, CR192/CRLF0; unico HTML/CSS/vanilla JS inline.

## Delta

Una sola finestra Traccia, con due zone: Traccia in modifica e Tracce salvate. Salva/Aggiorna è nella zona corrente, sempre individuabile. Numero punti e distanza rimangono visibili; coordinate, unità, tempi e lista punti sono in Dettagli e punti. I pulsanti originali conservano gli stessi listener. Azioni batch mostrate solo con selezione; Mostra/Nascondi tutte rimangono in Altre azioni; nessuna barra inutile nell'archivio vuoto.

Importa file nella zona Tracce salvate apre il selettore nativo e una conferma con nome, punti e quote dentro Traccia. Non apre Oggetti GIS, non cambia l'anteprima generale e non mostra categorie estranee. La conferma esplicita importa solo la traccia; Annulla non salva.

## REVIEW GPT-SOSTITUTIVA — PASS scoped

Reviewer AI esterno NOT_PERFORMED, backstop post-hoc aperto. La review è di ChatGPT sul raw Git alla FULL_SHA sopra, non attribuita a un'altra AI.

- Le 12 funzioni canoniche in static-checks.json sono byte-identiche alla base: parser, prevalidazione, applicatore, snapshot, rollback, verifica della persistenza, sanitizer quote, salvataggio e serializer. Nessun nuovo schema o scrittura diretta di storage.
- Il coordinamento della preview usa stato transitorio separato dal Workbench. Applica attraverso il funnel esistente con waypoints=false, savedTracks=true, polygons=false. Verifica conteggi e persistenza, oltre all'uguaglianza dei waypoint e poligoni rispetto allo snapshot. Errore di scrittura: rollback del raw storage e degli ID esatti. Errore di rollback: retry disabilitato.
- Lock proprietario e generazione impediscono callback tardive dopo Annulla. La chiusura reale di Traccia annulla il caricamento senza salvare. Nessun nuovo dialog modale; Salva ed Esporta preesistenti invariati.
- Reparenting DOM reversibile: a viewport mobile i nodi originali tornano nelle posizioni originarie, senza duplicazione di ID o perdita di listener. Sviluppo mobile ancora PAUSA.
- Stringhe IT/EN/FR; nessun nuovo endpoint, GPS, framework o modulo. Prove con fixture sintetiche e profili isolati, non sul browser personale. Zero POST, eccezioni JavaScript e errori console nel perimetro osservato.

## QA candidata e ispezione visiva

27/27 controlli funzionali PASS, 26 clic CDP nativi e 5 aperture native del selettore file. Casi: archivio vuoto/popolato, selezione singola/multipla, importazione e Annulla, quote parziali, GPX corrente di 198 punti, esportazioni separate, ZIP, salvataggio/reload/Aggiorna, rollback, file invalido, callback annullata, chiusura finestra, ritorno mobile e viewport 1280×600.

Screenshot Edge reali ispezionati a 1440×900 e 1280×600: finestra intera, conferma in pannello, stati vuoto/popolato. Nessun Oggetti GIS. Scorrimento verticale disponibile su finestra bassa, nessun overflow orizzontale del pannello. La mappa non è oggetto della QA: richieste terze bloccate. Manifest delle immagini incluso; PNG mantenuti fuori dal runtime.

## Finding conservati e limite ambientale

Rapporti iniziali conservati separatamente: soglia errata del test sul numero di selettori; controllo su finestra bassa con nearest-scroll che puntava sotto il bordo inferiore. Il test finale centra il controllo e verifica hit-test prima del clic nativo. Dopo Aggiorna, i dettagli si richiudono.

Windows ha impedito di rimuovere alcune directory temporanee isolate di Edge. La rimozione dei file NON è dichiarata riuscita. Il rapporto finale distingue dataCleanup=true, con pulizia verificata dei dati applicativi della sola origine di prova, da cleanup=false per le directory. Alcuni artefatti sintetici restano in Temp; nessun dato operativo o browser personale è stato modificato. Il limite di housekeeping è dichiarato, non convertito in un PASS di cancellazione file.

## NEXT e STOP

Questo documento non dichiara il candidato già LIVE. Prossimo gate: backup307, deploy GIS-only, identità HTTP/HTTPS e QA nativa sulla versione distribuita; poi valutazione operatore. STOP su HEAD remota cambiata, working tree sporco, hash discordante o test fallito. Non accettazione storica307 preservata; profilo XY e DTM terreno separati/HOLD. Nessun PASS umano dedotto dai test.
