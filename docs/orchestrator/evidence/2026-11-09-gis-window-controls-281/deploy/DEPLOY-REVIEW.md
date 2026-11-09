# Build 281 — review indipendente del dossier di deploy

**Esito: PASS della review statica sul pacchetto congelato. Blocker concreti: 0.**

Questa review non autorizza l'esecuzione e non attribuisce PASS al preflight, al deploy o alla QA postdeploy. Non sono stati eseguiti gli script, aperte connessioni SSH, interrogati i servizi o modificati file dell'autore. Il GO del coordinatore, con HEAD remota pubblicata e verificata, resta un gate separato.

Revisore: `/root/windows_inventory_280`. Data UTC: 2026-11-09T15:50:59.731080+00:00.

## Identità esatte esaminate

| Artefatto | SHA256 |
| --- | --- |
| `runtime281-remote.py` — 540 righe, 23.165 byte | `a6f7215d7761bd7f725236605f4ede024d6b1807d85b80fbe379bc2a3920fbea` |
| `runtime281-launch-windows.py` — 172 righe, 7.816 byte | `502c10cfa0da602483532fd7a9a64479bc2bcf7bb76b1dfeafe35af5f4686dc9` |
| `PLAN.md` — 152 righe, 12.190 byte | `d72bd662ac352de32ef63fdef78593894630a78c29e0ec1013606f9034502a87` |
| `artifact-manifest.json` | `170333c74040ca56ddfd6ef96cb9fd73730ad4b8c2400bd5e930a24acbdfb0b1` |

Il manifest corrisponde ai byte presenti per **5/5 artefatti**. La sintassi dei due script è stata verificata indipendentemente tramite `ast.parse`, senza importazione o esecuzione: **2/2 PASS**. Il codice remoto è stato letto integralmente in tre blocchi limitati; il launcher in due blocchi. Non è stato riletto il monolite runtime.

## Identità del candidato e HEAD del GO

Il codice remoto fissa commit sorgente `0c0f6785654dbba279774bb8569788088f0762e9`, blob `3dcff61081a2f461f8841953986ced17b058eab1`, SHA256 `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62`, dimensione 11.108.861 byte e Build 281. Questi valori corrispondono al candidato oggetto dell'incarico.

La HEAD documentale successiva non è confusa con il commit sorgente runtime. Il parametro `--go-remote-head` richiede esattamente 40 caratteri esadecimali; preflight e apply non lo derivano automaticamente da `main`. Sono controllati origine canonica, branch `main`, clone completamente pulito, HEAD iniziale, ancestry e identità di `FETCH_HEAD`/`origin/main`/`ls-remote`. Un avanzamento remoto diverso dalla HEAD del GO arresta il flusso.

`check_candidate` richiede che il commit sorgente sia antenato della HEAD del GO e che entrambi contengano lo stesso blob runtime. Il delta sorgente→HEAD è limitato a `docs/`; il delta clone→HEAD al runtime e a `docs/`. Gli oggetti Git del runtime vengono verificati anche per SHA256, byte e numero build. Il launcher vincola inoltre il codice remoto tramite SHA e verifica il candidato Windows prima delle fasi operative.

Riferimenti: remoto 24–32, 150–190, 292–302, 313–333, 434–449 e 492–508; launcher 17–33 e 78–106.

## Preflight, backup e scritture

La baseline richiesta è precisamente Build 280, 11.108.654 byte, SHA256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`. È controllata sul file locale e sugli endpoint HTTP e HTTPS, prima del backup e nuovamente prima della mutazione.

Il backup usa un percorso vincolato a `/var/backups/goi-gis-runtime/<timestamp>-build281`, scelto e registrato nel PC prima della connessione. Directory già esistenti non sono riutilizzate per un nuovo preflight. La directory padre e la transazione devono appartenere a root con modo 0700; il runtime è creato con apertura esclusiva, `O_NOFOLLOW`, modo 0600, fsync e verifica del contenuto. Il journal usa file temporaneo, sostituzione atomica e sincronizzazione della directory. La lettura del journal controlla metadati, identità della transazione e HEAD registrata.

Il preflight ha validità di dieci minuti; apply ricontrolla runtime precedente, backup, clone, HEAD, servizi e invarianti. Il lock sul directory descriptor del clone impedisce la contemporaneità delle fasi di questo applicatore. È un lock cooperativo: la review non gli attribuisce protezione contro qualunque processo Git esterno.

Le scritture osservate sono circoscritte a evidenze locali del launcher, oggetti/riferimenti e file consentiti del clone, backup e journal. Non ci sono comandi che scrivano le configurazioni infrastrutturali, installino pacchetti o modifichino account, chiavi, firewall, DNS o certificati. Gli hook e fsmonitor vengono disabilitati solo nelle singole invocazioni Git, senza alterare configurazioni persistenti.

Riferimenti: remoto 85–143, 305–398 e 434–454; launcher 94–125.

## Esito incerto e assenza di rilancio automatico

Il launcher esegue una sola invocazione SSH operativa per fase. Prima dell'avvio salva un `intent.json` con identità della transazione e percorso del backup. Il codice remoto registra `APPLYING` e l'intento del fast-forward prima della mutazione; apply rifiuta uno stato già avviato o concluso.

Timeout del trasporto, exit code SSH 255 o risultato non decodificabile producono `REMOTE_OUTCOME_UNKNOWN_DO_NOT_RETRY`. Il percorso indicato è leggere il journal della stessa transazione mediante `status`, senza ripetere apply. La fase status legge lo stato esistente sotto lock; non esegue fetch, richieste HTTP o restart e non scrive il journal. Un lock ancora occupato è segnalato come transazione in corso. L'assenza del journal, da sola, non dimostra che il tentativo originale non sia mai iniziato.

Il successo del comando status indica la lettura del journal, **non** un deploy riuscito: l'esecutore deve esaminare il campo `status` restituito e ricostruire l'esito della stessa transazione. Tale distinzione è coerente con il piano.

Riferimenti: remoto 434–453 e 492–536; launcher 114–163; PLAN 126–142.

## Applicazione e rollback circoscritti

L'applicazione esegue un fast-forward verso la sola HEAD del GO, verifica nuovamente clone, runtime e blob, quindi riavvia esclusivamente `goi-gis-app.service`. Non esistono restart di Nginx, gateway ORS o proxy HTTPS.

Dopo l'inizio della mutazione, un errore registra il fallimento e attiva il percorso di rollback. Questo accetta soltanto un clone pulito con HEAD esattamente uguale alla HEAD approvata o a quella iniziale e runtime corrispondente al rispettivo SHA. Una HEAD estranea o file modificati provocano rifiuto, senza reset, clean, force o sovrascritture arbitrarie.

Se il candidato è stato applicato, il ritorno usa `git switch --detach` al commit iniziale; lo stato detached è intenzionale e descritto nel piano. Non viene forzato indietro il branch main. Se il runtime è ancora quello iniziale e nessun restart è stato tentato, il percorso verifica la baseline senza un restart superfluo e restituisce `DEPLOY_STOPPED_NO_RUNTIME_CHANGE`. Negli altri casi ammessi viene riavviato soltanto GIS e vengono ricontrollati runtime e invarianti. Un rollback non verificato produce `ROLLBACK_INCOMPLETE_REQUIRES_REVIEW`.

Il backup è disponibile per recupero controllato, ma il rollback automatico usa gli oggetti Git già verificati; non sovrascrive il clone copiando ciecamente il backup. Non è prevista una seconda applicazione automatica dopo un errore o un rollback.

Riferimenti: remoto 401–485; PLAN 126–142.

## Servizi, infrastruttura ed endpoint

Il PASS del deploy richiede identità completa della Build 281 sia via HTTP sia via HTTPS, normale verifica TLS, clone pulito sulla HEAD del GO e nuovo PID GIS. Gli altri servizi devono conservare stato e PID; sono confrontati listener condivisi, sei configurazioni tramite hash esatto e risposte ORS/catalogo/VPS, inclusi CORS e hash dei contenuti.

Le richieste applicative presenti nel codice sono GET verso i percorsi espliciti di verifica. Non vi sono POST ai provider, richieste di routing né riesecuzione della QA funzionale consumata. Lo script non propone correzioni di infrastruttura in caso di drift: arresta il flusso o segnala il rollback incompleto.

Precisazione del controllo HTTP: il client standard può seguire un redirect; il codice rifiuta il risultato se l'URL finale differisce da quello richiesto. Non si attribuisce a questo controllo la disabilitazione preventiva dei redirect. Il confronto byte/SHA/build resta comunque obbligatorio per i due runtime. Questa precisazione non costituisce un blocker per l'identità del contenuto distribuito.

Riferimenti: remoto 34–60, 193–289 e 455–473.

## Credenziali e log

Il launcher controlla esistenza e identità del percorso della chiave configurata, senza leggerne o esportarne il contenuto. L'accesso usa il client SSH esistente, destinazione fissata e verifica della configurazione effettiva. Sono espliciti BatchMode, StrictHostKeyChecking, UpdateHostKeys=no, IdentitiesOnly, assenza di agent forwarding, forwarding di porte, LocalCommand e ControlMaster.

Il codice remoto non stampa né persiste l'URL origin grezzo e consente soltanto forme canoniche prive di credenziali incorporate. Per i comandi salva argv, codice di uscita e hash di stdout/stderr; i contenuti delle configurazioni vengono confrontati mediante hash. Non sono presenti token o chiavi private incorporati negli script esaminati. Le prove di accesso pregresse restano storiche e non sono state ripetute.

Riferimenti: remoto 128–161; launcher 17–33, 57–75 e 116–155.

## Limiti del PASS e condizioni per la fase successiva

Il giudizio riguarda esclusivamente i due SHA esatti riportati sopra e la coerenza del dossier. Non è stata eseguita alcuna prova comportamentale degli script, né verificata la situazione attuale di origin/main, VPS, certificati, porte, configurazioni, servizi o backup.

Il coordinatore deve completare i gate QA/review del runtime e pubblicare/verificare la HEAD documentale prima del GO. L'esecutore deve mantenere gli hash del pacchetto, usare quella stessa HEAD, osservare fino a conclusione la singola transazione, interpretare il journal in caso di esito incerto e fermarsi davanti a qualsiasi guard fallita. Il PASS statico non sostituisce `PREFLIGHT_PASS`, `DEPLOY_PASS` o la successiva QA browser.
