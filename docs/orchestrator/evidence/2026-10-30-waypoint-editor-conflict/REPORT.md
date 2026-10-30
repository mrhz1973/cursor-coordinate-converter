# Editor waypoint: conflitti e modifiche concorrenti

Base: commit a19cb287054f0de7256d835d5db79dfafb460fbb, file originale SHA-256 b6f0fca1937ee2f79375ddd34af0377644982774b9764a62745af2d88d9598fb. Candidato SHA-256 aa035f52dbd49fd74047798d9b661f16e0e50f722c5f49b3c883924c4dc73066.

## Comportamento

L’editor conserva le coordinate e la provenienza UTM del waypoint corrente se il campo coordinate non è stato modificato, anche se il punto è stato spostato dopo l’apertura. Le modifiche a nome, icona, colore e note vengono confrontate con la versione iniziale e unite alle variazioni indipendenti presenti nello stato corrente. Se lo stesso campo è stato modificato in modo diverso, se si è modificata esplicitamente la coordinata dopo una variazione concorrente diversa, o se il waypoint è stato rimosso, il salvataggio viene bloccato con un messaggio; la bozza rimane aperta. Cambiare formato non equivale a modificare la coordinata.

I metadati non modificati, inclusi campi legacy sconosciuti, non vengono riscritti. La modifica delle note consente anche di eliminarle. Non sono stati modificati layout o dati persistenti dell’utente.

## Verifica

node work/waypoint-editor-conflict/browser-test.cjs: 83 casi superati in Edge headless, profilo temporaneo isolato e richieste HTTP/HTTPS bloccate. Include 36 transizioni tra default, DD, DDM, DMS, UTM e MGRS con spostamento effettivo tramite waypointUpdateLatLon, modifiche a nome/stile, coordinata esplicita valida e non valida, conflitti su nome, stile, posizione e provenienza UTM, rimozione, fusione dei campi indipendenti, cancellazione note, record legacy e coordinata UTM concorrente identica. git apply --check conferma che la patch si applica alla base indicata.

## Limiti

Il confronto riguarda lo stato corrente dell’app nella stessa pagina. Non implementa sincronizzazione o controllo transazionale tra schede/browser distinti, né rileva una modifica esterna che non sia stata acquisita nello stato della pagina. Il candidato richiede review indipendente e verifica del file integrato prima di qualsiasi deploy.
