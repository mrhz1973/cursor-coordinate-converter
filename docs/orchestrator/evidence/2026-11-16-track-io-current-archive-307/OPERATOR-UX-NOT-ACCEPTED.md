# Build307 - usabilita non accettata dall'operatore

Data feedback: 16 novembre 2026. Fonte: messaggio e screenshot dell'operatore nella conversazione corrente.

## Feedback reale, non attestazione sintetica

Testo esatto: "non si capisce una mazza.. è troppo confuzionario".

L'operatore NON ha inviato una riga QA PASS per GIS-TRACK-IO-CURRENT-ARCHIVE-A. Il feedback costituisce una non accettazione dell'usabilita del percorso importazione tracce. Stato: QA OPERATORE NON ACCETTATA / FAIL UX, nessun finito. Non inventare una riga di attestazione formale FAIL a nome dell'operatore.

## Evidenza visiva e limiti

Lo screenshot mostra insieme il pannello Traccia (198 punti, 4.383 km, archivio vuoto) e Oggetti GIS, con Import GIS aperto, categorie Waypoint/Tracce salvate/Poligoni, anteprima e sotto un elenco di waypoint 200/200. Sono elementi osservati nello screenshot, non nuove misure del browser o un audit dei dati personali. L'origine dei 200 waypoint NON e stata verificata. Vietato considerarli duplicati da cancellare o attribuirli all'importazione senza prova.

Il percorso Build307 collega Importa in archivio all'interfaccia generale Oggetti GIS. Il PASS automatico 27/27 esistente verifica soltanto il proprio perimetro tecnico; non equivale ad accettazione ergonomica. I test storici non vengono retroattivamente inventati o rimossi.

## TASK DELTA del FIX UX - non ancora implementato

Obiettivo: gestire la traccia corrente e l'archivio nella sola finestra Traccia, senza passaggi obbligati in Oggetti GIS e senza categorie tecniche estranee al compito.

Scope desktop:
- Due zone chiaramente separate: Traccia in modifica sopra, Tracce salvate sotto.
- Il salvataggio della traccia corrente appartiene alla zona superiore, sempre individuabile, disabilitato con motivazione quando non applicabile; mantenere la funzione Aggiorna in modifica senza cambiare identita o dati archiviati.
- In alto, preservare Nuova traccia/Pianifica percorso e azioni di aggiunta, importazione ed esportazione della sola traccia in modifica. Presentare numero punti e distanza in una riga; dettagli coordinate, unita, tempi e lista punti richiudibili, senza eliminare funzioni.
- In basso, importazione file direttamente nell'archivio ed esportazione delle righe selezionate. Importa deve aprire il selettore file e una conferma essenziale nel contesto Traccia (file/nome, punti, eventuali quote, Importa/Annulla); nessuna apertura automatica di Oggetti GIS, nessuna lista waypoint o selezione di categorie.
- Archivio vuoto: messaggio breve e comando Importa file; evitare barre di azioni grigie prive di oggetti. Mostra/Nascondi, Stile ed Elimina devono comparire quando pertinenti a una selezione, conservando le funzioni esistenti in posizione comprensibile.
- Niente cancellazioni o ripuliture automatiche di waypoint, tracce, poligoni o dati personali. state.mapWaypoints[] resta canonico.

Invarianti: unico HTML standalone con CSS/JS inline, vanilla JS; storage/sanitizer/transazioni esistenti, conservazione quote e hash geometrico, rollback, OPSEC/offline e rete opt-in; sviluppo mobile PAUSA. Profilo XY senza quote e precisione DTM sul terreno restano separati/HOLD.

Acceptance: interazione nativa sul desktop dall'inizio alla fine senza aprire Oggetti GIS, casi archivio vuoto/popolato, traccia vuota/popolata, selezione nulla/multipla, Annulla senza effetti, quote preservate e persistenza verificata. Ispezionare screenshot reali dell'intera finestra a viewport normali e corti, non soltanto dialog.open o chiamate JS. No nuova QA operatore prima di candidato corretto e review/browser PASS pertinenti.

STOP: non dichiarare Build307 approvata o blocco CLOSED. Nessuna nuova build/deploy in questa registrazione; un successivo FIX con relativo gate e necessario. Non proseguire al backlog altimetrico mentre il percorso Tracce resta non accettato.

Registrazione UTC: 2026-11-16T00:46:32.263357+00:00.
