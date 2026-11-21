# P0 — quattro backup e confronto completati; residui parziali

Data registrazione: 19/11/2026 20:38:41 Europe/Rome.
Aggiornamento: 21/11/2026 04:18 Europe/Rome; quattro backup logici verificati, confronto nativo completato alle 03:10:33.587 UTC e inventario residui di soli metadati PARTIAL. Gate corrente di decisione sui dati HTTP, con verifica di attualità e copertura residua prima di qualsiasi intervento. Payload personali conservati sul PC.
BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0. Tipo: audit non distruttivo, nessun bundle runtime.
**Esito corrente: FOUR_SCOPED_BACKUPS_VERIFIED / COMPARISON_COMPLETE / RESIDUALS_PARTIAL / ORIGIN_BACKUP_PENDING. Quattro backup logici verificati e confronto delle copie completato; acquisizioni distinte e non atomiche, `completeOriginBackup:false`. Il confronto è strutturale e limitato agli export: identità funzionale e stato attuale dei contenuti browser NON attestati. P0 resta APERTO; migrazione e pulizia non autorizzate.**

## Mandato e fonte viva

L'operatore ha richiesto «continua» dopo la chiusura P3. origin/main verificato a 6dbcd7732e1d88d3de733b7a6b9c53b007d46516; FRONTIER indica P0 come prossimo residuo distinto. README AI-BOOT e OM §4 erano già acquisiti nella stessa chat: refresh mirato, WU N/A. Il [backlog P0](../../backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md) richiede inventario, backup verificato e confronto fra le due origini prima di qualsiasi pulizia; il servizio HTTP tecnico va conservato.

URL operativo da usare: https://ionos-n8n-new.tailc01234.ts.net/gis?v=ed760bbd. L'origine HTTP tecnica rimane documentata per questo confronto e per l'infrastruttura.

## Confronto delle quattro copie — 21 novembre 2026, 03:10:33.587 UTC

[Evidenza persistente](origin-comparison.json), esito **COMPARED**. Tutti i controlli input sono `true`: hash degli export e delle ricevute, contratti/schema, univocità delle chiavi, Base64 canonico, hash dei binari e stabilità degli input durante lettura/confronto. L’[helper qualificato](compare-origin-backups.cjs), SHA256 `2b52af8981bcc76927a2129faea8daceeb539f38222930633afde94222a56f3a`, ha confrontato soltanto le quattro copie locali già verificate. Payload privati rimasti sul PC; nessuna scrittura nelle sorgenti, migrazione o pulizia.

| Elemento nei backup | HTTP | HTTPS | Esito / perimetro |
| --- | ---: | ---: | --- |
| Chiavi Local Storage | 2 | 2 | Stesse due chiavi; entrambi i valori raw diversi. |
| Proprietà principali `coordconv_v2` | 14 | 14 | 8 strutturalmente identiche, 6 diverse. |
| `savedTracks` | 1 | 5 | Nessuna occorrenza strutturale esatta comune (`commonExact:0`). |
| `mapWaypoints` | 200 | 0 | Confronto strutturale; nessun confronto geografico fra collezioni. |
| `namedAreas` | 1 | 0 | Conteggi nei rispettivi snapshot. |
| `history` | 3 | 0 | Conteggi nei rispettivi snapshot. |
| Proprietà `settings` | 58 | 40 | Strutture differenti; nessuna equivalenza funzionale dedotta. |
| Record IndexedDB tiles | 1.028 | 315 | Unione di 1.343 chiavi; nessuna chiave comune. |

La sovrapposizione delle raccolte usa **occorrenze strutturali (multiset)**, conservando i duplicati: non è un’analisi dell’identità funzionale dei record. Non confronta la stessa geometria fra raccolte diverse e non deduce equivalenza dei tile quando le chiavi differiscono. Le differenze osservate riguardano i quattro snapshot; il catalogo browser successivo non prova che i valori attuali siano immutati. Il confronto **non autorizza migrazione o deduplicazione**.

L’output nativo completo è stato acquisito dopo tutti i controlli; il processo Node risultava terminato. Il wrapper PowerShell proprio era rimasto attivo ed è stato chiuso dopo guard. **ExitCode Node NON attestato dal trasporto**; causa della persistenza del wrapper `NOT_DETERMINED`. Dopo l’emissione del risultato il comparatore non svolge altre operazioni sui file. Nessuna ripetizione del confronto; questa limitazione di trasporto è distinta dall’esito completo acquisito.

## Contenitori residui — inventario parziale del 21 novembre 2026

Sonda di soli metadati: HTTPS **03:08:00.274–03:08:00.288 UTC**, HTTP **03:09:51.405–03:09:51.408 UTC**. [Metadati integrali](inventory-metadata.json), proprietà `residuals`, incluso il preflight HTTP della pagina neutra. Sonda SHA256 `d5cad4a47f45ced825f92e9654fbe77a9eca02a0754855dbe77e458728e379d2`, review e **4 fixture PASS** come registrato in `origin-comparison.json` → `helperQualification`; nessuna precedente suite ripetuta.

| Contenitore / contesto | HTTPS | HTTP | Limite dell’evidenza |
| --- | --- | --- | --- |
| Local Storage | 2 chiavi | 2 chiavi | Solo catalogo, nessuna nuova verifica dei valori. |
| IndexedDB | 1 database atteso v1 | 1 database atteso v1 | Zero aperture database, nessun nuovo conteggio/lettura dei record. |
| CacheStorage | 0 cache | `UNAVAILABLE`, `count:null` | API HTTP non disponibile; non equivale a zero dati. |
| Service Worker | 0 registrazioni, pagina non controllata | `UNAVAILABLE`, conteggio/controllo `null` | Contesto HTTP non sicuro. |
| Session Storage | 0 nella nuova scheda | 0 nella nuova scheda | Solo le due nuove sessioni di scheda; sessioni preesistenti non inventariate. |
| Cookie visibili | 0 | 0 | Solo cookie visibili al documento sul relativo percorso; HttpOnly e altri percorsi esclusi. |

**OPFS, filesystem legacy e WebSQL: `NOT_INSPECTED`, conteggi `null`** in entrambe le origini. La presenza o assenza delle API non prova presenza o assenza di dati. Nessuna apertura delle relative radici/database; zero chiamate di mutazione storage e zero richieste di rete esplicite dalla sonda. Copertura `METADATA_CATALOG_ONLY`, inventario **PARTIAL**, nessuno snapshot atomico o backup completo dell’origine attestato.

Terminata l’acquisizione, root ha chiuso soltanto le due nuove schede neutre tramite guard sull’indirizzo: conteggio schede **5 → 4 → 3**, nessuna scheda neutra residua e tre schede preesistenti ancora aperte. Nessuna terminazione o riavvio del browser.

## IndexedDB HTTPS verificato — nuovo snapshot del 21 novembre 2026

[Ricevuta reale HTTPS](https-indexeddb-verification.json): snapshot **02:53:25.362 UTC**, verifica nativa **02:58:10.144 UTC**. File `TMAR-GIS-P0-HTTPS-IndexedDB-20261121T025325362Z.json`, **10.695.152 byte**, SHA256 `18edc0d33596f52b0dcbccfe927c3323fbfc022c96446d9d2e7a123e7918ee7a`. CoordConvMapTiles v1, store tiles: **315 record**, **7.984.081 byte binari**. Verificatore qualificato, processo **35224**: dimensione/stabilità/hash globale, schema, chiavi univoche, Base64 canonico, lunghezze/SHA256 dei binari e totali **PASS**; copia locale non sovrascrivente e rilettura byte per byte **PASS**.

Cartella: `C:\Users\mrhz\AppData\Local\TMAR-GIS\Backups\P0-20261121T025325362Z-HTTPS-IndexedDB`. Ricevuta locale `verification.json`, SHA256 `275f1ba91ceb0243452c8bcf3b6c8ccc3e839691c1649faeecf584253d31802c`. Copertura `INDEXEDDB_TILES_ONLY`, `completeOriginBackup:false`; nella ricevuta all’atto della verifica il confronto era `NOT_PERFORMED`, poi acquisito alle 03:10:33.587 UTC come descritto sopra. Questo PASS riguarda il **nuovo snapshot**, non verifica retroattivamente il file dichiarato il 20/11.

Il vecchio download esatto `20261120T165609715Z` è stato individuato nella UI Edge con stato **«Rimossi»**. TMAR ha operato Edge tramite Windows UIAutomation/Win32, senza elevazione, riavvio o clipboard. Nuova scheda sulla pagina neutra HTTPS, senza caricare il runtime GIS; exporter qualificato e hash invariati, contenuto console confrontato integralmente prima di Enter mediante wrapper base64 UTF-8. Il nuovo download restava alla domanda **«Come intendi usare…?»**: conferma visiva di **Salva**, file definitivo presente e relativo `.crdownload` assente prima della verifica. Lo stato UI del vecchio elemento non identifica causa o autore di una rimozione.

## Storico: IndexedDB HTTPS dichiarato il 20/11, sorgente allora non individuata

Il seguente blocco descrive il gate precedente; è superato dalla verifica del nuovo export sopra. Le evidenze dei tentativi precedenti sono conservate senza attribuire loro un PASS.

[Evidenza del gate](https-indexeddb-verification-blocked.json). Ricevuta browser riferita dall’operatore il **20/11/2026**, snapshot **16:56:09.715 UTC**: origine HTTPS attesa, `DOWNLOAD_AVVIATO`, file `TMAR-GIS-P0-HTTPS-IndexedDB-20261120T165609715Z.json`, **315 tile**, **7.984.081 byte binari**, **10.695.152 byte file**, SHA256 dichiarato `b9e23683f3b33683586843e72ac27d1c82638d2bf630971d1816a9927ae48211`. Questi sono metadati dichiarati dal browser; **il file e la copia non sono verificati**.

Il **21/11/2026 alle 02:28:21.0695286 UTC** il probe di connessione TMAR su ASUSDESKTOP è PASS. Il verificatore HTTPS già qualificato si è fermato con **STOP / SOURCE_READ / LOCAL_OPERATION_FAILED**, senza ottenere una verifica attestata del payload GIS o della copia. Lo STOP non permette di attestare quanto della sorgente sia stato letto; nessun payload GIS è stato restituito dagli strumenti. Non è una verifica negativa dei contenuti.

La ricerca nella cartella attesa `C:\Users\mrhz\Downloads` e nella cartella Download di Windows Known Folder, coincidente con lo stesso percorso, ha restituito **zero riscontri** per il prefisso `TMAR-GIS-P0-HTTPS-IndexedDB-20261120T165609715Z*`, incluse collisioni e suffissi `.crdownload` con quel nome. **Temporanei con nomi generici, come `Unconfirmed…`, non sono stati enumerati**: non è escluso un download in corso o salvato altrove. I percorsi alternativi configurati non sono stati acquisiti: lettura Preferences di Edge Default e Chrome Default `ACCESS_DENIED`. Anche il file e `verification.json` nei due percorsi esatti della cartella di backup prevista `P0-20261120T165609715Z-HTTPS-IndexedDB` risultano `ABSENT`; il controllo non riguarda altre posizioni. Nessuna modifica dei permessi e nessun payload GIS restituito.

**Storico preservato:** un precedente avvio nell’origine HTTP aveva prodotto `STOP_ORIGINE_INATTESA`, senza apertura IndexedDB o download da parte dell’helper. La successiva interruzione TMAR aveva lasciato esecuzione nativa e copia non determinate; il blocco di connessione era stato superato dal probe del 21/11. In quel passaggio rimaneva il gate di reperimento/completamento del file, senza dedurne cancellazione o assenza globale; la successiva osservazione UI e il nuovo export verificato sono registrati sopra.

## Local Storage HTTPS verificato — 20 novembre 2026

[Ricevuta reale HTTPS](https-localstorage-verification.json): snapshot **12:02:48.832 UTC**, verifica **12:04:06.585 UTC** (13:04 Europe/Rome). File `TMAR-GIS-P0-HTTPS-localStorage-20261120T120248832Z.json`, **388.370 byte**, **2 chiavi**, SHA256 `9ed07e750fb110484a0a6c0417dedd129773759dde12b4e5f24abfc926905578`. Dimensione/stabilità/hash della sorgente, schema e coppie stringa/stringa univoche: PASS. Copia locale non sovrascrivente riletta byte per byte e con lo stesso SHA256: PASS. Verifica nativa già eseguita; nessuna ripetizione per questo aggiornamento.

Cartella: `C:\Users\mrhz\AppData\Local\TMAR-GIS\Backups\P0-20261120T120248832Z-HTTPS-localStorage`. Ricevuta locale `verification.json`, SHA256 `cabcf91eaa13b99ef719d3cafc3fdbad3afab86234a2b7754d442145480e3d7f`. `coordconv_v2` è un oggetto JSON valido di **325.057 unità UTF-16**: **5 tracce salvate**, **0 waypoint**, **0 poligoni**, impostazioni presenti. Chiave UI presente, legacy assente nel set acquisito. Payload e copie restano esclusivamente sul PC.

Guard dell’origine HTTPS superato e screenshot della pagina404 acquisito come **evidenza dell’operatore**. L’identità del profilo usato non è stata verificata programmaticamente. Il PASS della copia riguarda esclusivamente `LOCALSTORAGE_ONLY`; `completeOriginBackup:false`.

### Storico: confronto dei soli conteggi del 20 novembre 2026

| Origine / snapshot UTC del 20/11/2026 | Tracce salvate | Waypoint | Poligoni | Impostazioni |
| --- | ---: | ---: | ---: | --- |
| HTTP / 02:21:03.176 | 1 | 200 | 0 | Presenti |
| HTTPS / 12:02:48.832 | 5 | 0 | 0 | Presenti |

In quel passaggio il confronto riguardava soltanto i conteggi attestati dalle due ricevute: **identità e contenuti non erano ancora confrontati**. I conteggi da soli non determinavano dati unici, condivisi, duplicati o da migrare. Il confronto strutturale successivo del 21/11 è registrato sopra; identità funzionale e stato attuale del browser restano non attestati.

## Storico: qualificazione degli helper IndexedDB HTTPS

[Exporter HTTPS](export-https-indexeddb.console.js), SHA256 `1c2fb500af42b8f7dbff8c63715afb1518d95b455d03c771b6da47be51f2287d`; [verificatore HTTPS](verify-https-indexeddb-backup.cjs), SHA256 `bc5d8a5fb2ed4e5076645af412aaa5ad34240e21bf9026c64f6daca50246a147`. Qualificazione mirata del delta: **3 gruppi / 6 esecuzioni exporter PASS**, **3 gruppi verifier PASS**; review indipendente root dei soli diff e della compatibilità PASS. Le precedenti prove SHA, Edge e schema non sono state ripetute. [Metadati della qualificazione](inventory-metadata.json).

Il comportamento qualificato distingue i casi: catalogo vuoto → `DATABASE_ABSENT`, copertura `IDB_CATALOGO_ONLY`, `attesoVersione:null`, `versioneRichiesta:1`, `apertureDatabase:0`, `file:null`, `completeOriginBackup:false`; unico database atteso alla versione1 → percorso di export qualificato; catalogo inatteso → STOP. Questi sono risultati della qualificazione dell’helper, **non un inventario reale di IndexedDB HTTPS**.

Comando preparato e hash verificato nativamente: `C:\Users\mrhz\AppData\Local\TMAR-GIS\P0-Aiuto-20261120\P0-HTTPS-IDB-Comando.txt`, **10.202 byte**, stesso SHA256 dell’exporter. **Al momento della preparazione**, esecuzione nel browser personale, download e verifica del backup IndexedDB HTTPS non erano eseguiti. La successiva ricevuta browser e il blocco alla lettura della sorgente sono registrati nella sezione corrente sopra; nessun PASS dei dati IndexedDB HTTPS è attribuito alla qualificazione degli helper.

## IndexedDB HTTP verificato — 20 novembre 2026

[Ricevuta reale](http-indexeddb-verification.json), già acquisita tramite TMAR: snapshot **11:34:39.385 UTC**, verifica **11:39:51.041 UTC** (12:39 Europe/Rome). CoordConvMapTiles v1, store tiles: **1.028 record**, **16.012.203 byte binari**; file JSON **21.511.025 byte**, SHA256 `a1f72fd84a9f7f49cb0e0e9cbc023e813841388192f5ccda56b2b34d81919056`. Dimensione/hash globale, schema, chiavi univoche, Base64 canonico, lunghezza/SHA256 di ogni binario e totali: PASS. Copia locale non sovrascrivente riletta byte per byte: PASS; nessuna nuova prova ripetuta per registrare questa ricevuta.

Cartella: `C:\Users\mrhz\AppData\Local\TMAR-GIS\Backups\P0-20261120T113439385Z-HTTP-IndexedDB`. Ricevuta locale `verification.json`, SHA256 `e7be9711dd3d3d5d4c9357017486c8a57e31efdada6f47924403af378ffe2a11`. Sorgente e payload rimasti sul PC; qui soltanto metadati.

**I quattro snapshot sono distinti:** Local Storage HTTP il **20/11 alle 02:21:03.176 UTC**, IndexedDB HTTP il **20/11 alle 11:34:39.385 UTC**, Local Storage HTTPS il **20/11 alle 12:02:48.832 UTC**, IndexedDB HTTPS il **21/11 alle 02:53:25.362 UTC**. Non attestano atomicità fra contenitori/origini né assenza di modifiche successive nel browser. Coperture limitate ai quattro export logici; `completeOriginBackup:false`. Il confronto successivo riguarda le copie acquisite, non verifica l’attualità dei contenuti browser.

## Storico: preparazione Local Storage HTTPS prima dell’esecuzione

[Export HTTPS](export-https-localstorage.console.js), SHA256 `0b22d441474a38fe23df61315ad737cf0e0239f161daa5bb04af9a44ed808910`; [verificatore HTTPS](verify-https-localstorage-backup.cjs), SHA256 `22f6a591933a9218ccdd83f59070cd9b9186c7a48b625da53b5f4d9a5360274a`. Guard esclusivo dell’origine HTTPS, schema V1 e copertura LOCALSTORAGE_ONLY invariati; tutte le coppie raw conservate anche con zero chiavi o chiave principale assente, con presenza di quest’ultima indicata separatamente.

Verifiche sintetiche del solo delta: **3 gruppi exporter PASS** (HTTPS con chiavi, HTTPS vuoto/main assente, origine HTTP respinta) e **3 gruppi verifier PASS** (HTTPS con chiavi; vuoto/assenza distinti da zero record; configurazione/nome/payload HTTP respinti prima della copia), senza valori privati nell’output. Review statica indipendente dei soli delta HTTPS PASS. SHA qualificata invariata, sue prove non ripetute. [Metadati e risultati](inventory-metadata.json).

Comando preparato e hash verificato nativamente: `C:\Users\mrhz\AppData\Local\TMAR-GIS\P0-Aiuto-20261120\P0-HTTPS-LocalStorage-Comando.txt`, **4.173 byte**, stesso SHA256 dell’export. Il file contiene soltanto codice. **Al momento della preparazione**, esecuzione nel browser, download e backup HTTPS non erano acquisiti; la successiva esecuzione dell’operatore e la verifica nativa sono registrate nella sezione Local Storage HTTPS sopra.

### Accesso HTTPS: risposta nativa e successiva attestazione dell’operatore

GET mirato su `https://ionos-n8n-new.tailc01234.ts.net/gis/__tmar_p0_inventory__`: **HTTP404**, `application/json`, **45 byte**, nessun redirect, script/risorsa, Set-Cookie o Clear-Site-Data; SHA256 corpo `ff8de22dcfc848726255ab059ff25aeb8c957768999e90ebddb99360077b9261`, controllo **11:47:00.968 UTC**. Nessuna modifica server. Il primo risultato GET è stato perso per troncamento e non usato come evidenza; un solo recupero mirato ha salvato questi metadati. Il requestCount1 della ricevuta riguarda il recupero, non l’intera sequenza.

L’istruzione operativa era aprire l’indirizzo in una nuova scheda dello stesso browser/profilo, con STOP se comparivano GIS o un altro avviso. Successivamente l’operatore ha fornito lo screenshot della pagina404 e ha eseguito l’export con guard HTTPS superato. Questa evidenza del contesto personale è distinta dal GET nativo; **l’identità del profilo non è verificata programmaticamente**. Eventuali residui Service Worker non sono esclusi. Il contenuto Local Storage HTTPS acquisito resta sul PC; al momento di questo passaggio del 20/11, IndexedDB HTTPS e altri contenitori non erano ancora acquisiti.

## Storico: catalogo IndexedDB HTTP e preparazione prima dell’esecuzione reale — 20 novembre 2026

Output riferito dall’operatore, con acquisitoUTC 2026-11-20T03:22:30.769Z (04:22 Europe/Rome):

```json
{"origine":"http://100.99.54.93:8000","copertura":"IDB_CATALOGO_ONLY","numeroDatabase":1,"databaseAtteso":"CoordConvMapTiles","attesoPresente":true,"attesoVersione":1,"altriDatabase":0,"apertureDatabase":0,"esito":"ELENCO_DATABASE_OK","acquisitoUTC":"2026-11-20T03:22:30.769Z"}
```

Attesta solo il catalogo in quel momento: **un solo database, CoordConvMapTiles versione1**. Nessuna apertura del DB o lettura delle tile in questa ricevuta; conteggio record, schema effettivo degli store e integrità non acquisiti. Le righe GET con URL redatti non sono una misura delle tile memorizzate.

Per ridurre i passaggi manuali, [un solo comando](export-indexeddb.console.js) esegue il prossimo controllo di schema/conteggi e, se conforme, prepara l’export locale. Il guard aggiorna il catalogo prima dell’apertura, usa esclusivamente la versione1 ed abortisce sincronicamente ogni evento di upgrade/creazione; handler tardivi mantenuti per chiudere eventuali connessioni dopo timeout. Schema ammesso dal runtime qualificato: solo store tiles, keyPath null, autoIncrement false, nessun indice. Ogni valore deve contenere esattamente b:ArrayBuffer e ct:string; chiave stringa. Differenze causano STOP senza saltare o troncare record.

Count e cursore sono nella stessa transazione readonly. L’export avviene soltanto dopo oncomplete, cursore esaurito e conteggi coincidenti, con connessione chiusa. File JSON con chiave/MIME originali, binario Base64, lunghezza e SHA256 di ogni ArrayBuffer; hash globale sugli stessi byte UTF-8 del Blob. Limiti dichiarati:150.000 record,64MiB binari,4MiB di byte UTF-16 per chiavi/MIME,60secondi; superamento=STOP, mai backup parziale presentato come completo. Copertura INDEXEDDB_TILES_ONLY. Questi limiti non sono una misura del database personale.

Il [verificatore locale](verify-indexeddb-backup.cjs) controllerà dimensione/hash globale/schema, conteggi, unicità, Base64 canonico, lunghezza/SHA di ogni binario e totali; copia non sovrascrivente, rilettura e ricevuta con soli metadati. Codice e ricevute non promuovono la copertura a backup completo dell’origine.

[Validazione](indexeddb-helper-validation.json): review statica indipendente dei due helper PASS;14 controlli sintetici del verificatore PASS. Nuovo Edge headless con profilo temporaneo separato, documento servito tramite intercettazione locale e zero richieste inoltrate:4 casi PASS (export reale di4 tile sintetiche/65.593 byte binari con verifica Node e sorgente invariata; schema inatteso; valore inatteso; cancellazione simulata fra catalogo e apertura con upgrade abortito e DB non ricreato). Nessun runtime GIS caricato o profilo personale usato. Funzione SHA256 già qualificata riutilizzata identica, senza ripetere le sue prove.

**Esecuzione sul database personale e download IndexedDB: NOT_PERFORMED / NOT_STARTED.** Nessun conteggio tile reale, backup IDB o acquisizione HTTPS dedotti dalle fixture.

Comando preparato sul PC come `C:\Users\mrhz\AppData\Local\TMAR-GIS\P0-Aiuto-20261120\P0-HTTP-IDB-Comando.txt`: 9.794 byte, SHA256 `11b29c29b073d3943a633848c98e7165278fb0e984399bc7311b61e7bd3f8826`, rilettura identica all’helper revisionato e provato. Il file contiene soltanto codice; la preparazione non esegue l’export e non legge dati personali.

### Accesso operativo disponibile

Nel pass del **20/11**, TMAR esponeva25 strumenti per file/processi e nessun comando dedicato a schede/UI; il connettore Browser personale era indisponibile. Il controllo read-only aveva osservato22 processi Edge e zero righe comando ispezionabili, senza determinare la disponibilità di debugging. In quel passaggio l’avvio nel browser era stato affidato all’operatore; i test headless isolati non davano accesso alla scheda personale. **Il 21/11 è stato dimostrato un ulteriore percorso tecnico:** TMAR ha operato la UI Edge tramite Windows UIAutomation/Win32 ed eseguito l’export qualificato nella nuova scheda neutra HTTPS, senza elevazione, riavvio o clipboard. L’assenza di uno strumento dedicato non costituisce quindi un limite generale all’avvio via automazione nativa; questa evidenza non modifica retroattivamente l’accesso disponibile nel pass precedente.

## Backup Local Storage HTTP verificato — 20 novembre 2026, 03:25 Europe/Rome

L’operatore ha eseguito lo snippet e ricevuto `DOWNLOAD_AVVIATO`: file `TMAR-GIS-P0-HTTP-localStorage-20261120T022103176Z.json`, **36.618 byte**, **2 chiavi**, SHA256 **7811e2250e1b18e9651f0cd4467b79eb5a4f0511c8fc1e1602f144081db56a95**. L’avviso del browser segnala l’origine HTTP del Blob; non è stato trattato come prova di riuscita o fallimento del salvataggio e non sono state modificate protezioni del browser. I messaggi GET con URL redatti nel log operatore non sono stati attribuiti allo snippet, che non contiene richieste di rete.

TMAR ha individuato il file nella cartella Downloads, senza file .crdownload, e ha eseguito il [verificatore locale](verify-localstorage-backup.cjs). Lettura del file con dimensione/stabilità/hash, schema/origine/data, coppie stringa/stringa univoche e ordinate, conteggi e unità UTF-16: **PASS**. Copia non sovrascrivente nella cartella seguente, rilettura byte per byte e confronto dello stesso SHA256: **PASS**.

```text
C:\Users\mrhz\AppData\Local\TMAR-GIS\Backups\P0-20261120T022103176Z-HTTP-localStorage
```

La cartella conserva il JSON e `verification.json`; la ricevuta ha SHA256 `2307c79a3e81b32f88fa36e38014df5306cd2dcf24e23b3fc966bf11b07fa6e7`. [Metadati verificati](http-localstorage-verification.json), acquisizione 02:21:03.176 UTC, verifica 02:25:39.619 UTC del 20 novembre. Il payload resta sul PC; qui sono pubblicati soltanto metadati ed esiti.

Dal file verificato: `coordconv_v2` contiene 30.908 unità UTF-16 e JSON con radice oggetto valida; 1 traccia salvata, 200 waypoint, 0 poligoni e impostazioni presenti. La chiave UI `coordconv_ui_v1` è inclusa; la chiave legacy `coordconv_v1` non è presente nel set acquisito. Nessuna ricostruzione o scrittura delle sorgenti; originale nella cartella Downloads conservato.

[Verifiche del verificatore](verify-localstorage-backup-validation.json): sorgente sintetica preservata, hash errato respinto prima della copia, destinazione esistente divergente preservata, rilettura della copia esatta e nessun valore privato nello stdout. Finding di review corretto prima dell’esecuzione reale: una ricevuta preesistente viene accettata soltanto se coincide integralmente con quella ricostruita dai risultati correnti, con il solo timestamp ISO validato preservato; proprietà extra o copertura alterata causano STOP. Test mirato PASS e revisione statica finale PASS.

**Questo PASS qualifica esclusivamente LOCALSTORAGE_ONLY dell’origine HTTP.** Non attesta un backup completo dell’origine, tile/IndexedDB, memoria non persistita dell’app, dati HTTPS o confronto tra origini. La doppia lettura dello snippet non viene presentata come transazione atomica su tutti i contenitori.

## Lettura e preparazione precedenti all’export — 20 novembre 2026

La copia manuale di `082968.ldb` tramite Esplora file ha restituito anch’essa accesso negato, documentato dallo screenshot operatore. La prova fisica è conclusa; nessuna modifica dei permessi, elevazione o chiusura del browser. Causa del diniego non determinata.

L’operatore ha poi verificato `location.origin` nella scheda GIS e ha eseguito una IIFE di sola lettura della chiave `coordconv_v2`, con guard sull’origine e distinzione fra chiave assente, lettura negata, JSON/radice invalidi e raccolte non-array. Output ricevuto:

```json
{"origine":"http://100.99.54.93:8000","esito":"LETTURA_OK","caratteri":30908,"tracceSalvate":1,"waypoint":200,"poligoni":0,"impostazioni":"PRESENTI"}
```

`caratteri` indica unità UTF-16 del valore grezzo, non byte. I conteggi riguardano soltanto lo stato persistito in questa chiave: **1 traccia salvata, 200 waypoint, 0 poligoni e oggetto impostazioni presente**. Non sono un inventario dello stato ancora in memoria, delle altre chiavi o della cache; non dimostrano unicità o duplicazione rispetto a HTTPS. La lettura è attestata dall’operatore, non da una sessione Browser automatizzata; il collegamento al profilo fisico Default non è stato verificato programmaticamente in questa fase.

Preparato [export Local Storage HTTP](export-localstorage.console.js): tutte le coppie stringa/stringa dell’origine esatta, valori grezzi preservati, doppia lettura coincidente, UTF-8 e SHA256 sugli stessi byte del Blob, nome file univoco. Nessuna scrittura nello storage, richiesta di rete o uso della clipboard. Output limitato a metadati e `DOWNLOAD_AVVIATO`; nessun PASS di salvataggio dedotto. Copertura dichiarata `LOCALSTORAGE_ONLY`.

[Verifica offline](export-localstorage-validation.json): revisione statica indipendente PASS; SHA256 confrontato con Node crypto su 19 lunghezze, inclusi confini di blocco e input da 1 MiB; roundtrip esatto di fixture sintetiche con Unicode, surrogate isolate, chiavi speciali e valori JSON non validi; 6 scenari fail-closed; zero tentativi di scrittura sorgente. Nessun dato personale usato nelle verifiche. **Snippet non ancora eseguito nel browser; nessun download acquisito o backup verificato in questo aggiornamento.**

## Inventario fisico acquisito — 19 novembre 2026

Sul PC **AsusDesktop**, il profilo **Microsoft Edge / Default** risulta `lastUsed=true` e `lastActive=true` nei metadati Local State. Sono presenti entrambe le directory IndexedDB delle origini richieste. Non è stato acquisito il contesto della scheda GIS attualmente aperta: questa evidenza identifica il profilo segnato attivo e gli archivi esistenti, non una nuova osservazione dell'applicazione in uso.

| Contenitore | File | Byte fisici | Ambito e limite |
| --- | ---: | ---: | --- |
| IndexedDB HTTP `http_100.99.54.93_8000.indexeddb.leveldb` | 14 | 15.214.423 | Directory dell'origine HTTP; record attivi non contati. |
| IndexedDB HTTPS `https_ionos-n8n-new.tailc01234.ts.net_0.indexeddb.leveldb` | 10 | 8.043.119 | Directory dell'origine HTTPS; record attivi non contati. |
| Local Storage LevelDB condiviso | 26 | 43.590.705 | Intero profilo Edge/Default, non soltanto GIS. Chiavi delle due origini non enumerate. |

Sono presenti anche contenitori CacheStorage, Service Worker Database, WebStorage/QuotaManager e File System/Origins. Non è stata accertata la loro attribuzione alle due origini: non sono dichiarati vuoti o estranei. Dimensione diversa delle directory HTTP/HTTPS non dimostra dati GIS unici, duplicati o perduti.

## Tentativo di backup fisico e blocco verificato — 19 novembre 2026

Predisposta una copia locale con confronto del set file e degli SHA256 prima/copia/dopo, senza chiudere Edge o scrivere nelle sorgenti. Il tentativo si è fermato durante la lettura iniziale di `Local Storage/leveldb/082968.ldb`, **prima della fase di copia**:

```text
EPERM: operation not permitted, open .../Local Storage/leveldb/082968.ldb
```

La diagnosi successiva con apertura esplicitamente in sola lettura e condivisione ReadWrite/Delete ha restituito **Win32 5 / HRESULT -2147024891: Accesso negato**. Non è il codice32 di condivisione/file in uso. File proprietario dell'utente corrente; token non amministrativo. La causa precisa del diniego non è stata determinata e non viene attribuita automaticamente al browser aperto o alla necessità di privilegi amministrativi. Nessuna modifica ACL, elevazione, arresto del browser o tentativo di aggirare la restrizione.

Cartella locale del tentativo:

```text
C:\Users\mrhz\AppData\Local\TMAR-GIS\Backups\P0-20261119T193419439Z-678f68
```

Contiene la ricevuta `physical-capture-manifest.json` con stato **INCOMPLETE**, zero sorgenti copiate e SHA256 `a6949c820242e6d11b0694b1250745b44605c57da4d48f5eb0ef5d7e7f7fb692`. **Non è un backup utilizzabile dei dati del sito.** Nessun payload geografico è stato trasferito nel workspace cloud o pubblicato su GitHub.

Anche lo strumento Browser ha restituito indisponibilità del contesto d'origine della connessione: `Browser access requires the originating browser context`. Un browser cloud separato non avrebbe accesso a questi archivi locali e non è stato usato come sostituto.

[Metadati, ricevuta del tentativo e diagnosi](inventory-metadata.json). I conteggi logici mancanti sono `null`/NOT_ACQUIRED, non zero.

## Copertura dei backup applicativi: verifica del solo codice

La ricognizione mirata del [runtime qualificato](https://github.com/mrhz1973/cursor-coordinate-converter/blob/aff215323c97a309cbd5c6c7e0c694d35dd45ad0/coordinate_converter%20Claude.html), source `aff215323c97a309cbd5c6c7e0c694d35dd45ad0`, blob `4578788467822123ea7ad7e929d3bdf0e262b1a8`, identifica:

- `coordconv_v2`: stato GIS principale, inclusi savedTracks e addon altimetrici, mapWaypoints, gisPolygons, impostazioni, preferiti, cronologia e metadati aree offline; `loadStore`/`saveStore`.
- `coordconv_ui_v1`: layout dei pannelli; `loadUiState`/`saveUiState`. `coordconv_v1` è una chiave legacy da preservare se presente.
- IndexedDB `CoordConvMapTiles`, versione1, store `tiles`: chiave tile e valore binario ArrayBuffer più MIME. `getTileDB()` può creare un DB assente: non è stato invocato per l'inventario.
- L'export Sessione JSON (`getSessionExportObject`/`exportSessionFile`) omette tracce salvate, waypoint, poligoni, layout UI e tile. Mission Package, GPX/KML/GeoJSON e JPG offline non equivalgono a un ripristino integrale dello stato e della cache.

Questa mappa è una proprietà del codice, **non** un'enumerazione dei dati effettivamente presenti nel profilo personale. I backup runtime presenti sul VPS non coprono gli archivi del browser.

## Gate successivo e limiti

Local Storage e IndexedDB tiles HTTP/HTTPS sono verificati in **quattro snapshot distinti** e il confronto delle copie è **COMPLETE**; residui **PARTIAL**, backup completo dell’origine NON attestato. **NEXT: decisione sul trattamento dei dati HTTP distinti nelle copie confrontate**, previa verifica dello stato attuale e copertura dei contenitori residui prima di qualunque azione sui dati. Migrazione e pulizia non sono autorizzate e restano bloccate; identità funzionale e contenuti correnti non sono attestati dal confronto. Nessun ulteriore copia/incolla operativo richiesto in questo gate. Non ripetere i quattro export o il confronto senza un cambiamento concreto. Solo metadati nei rapporti, payload personali sul PC.

**Migrazione e pulizia restano bloccate.** Non inferire che HTTP sia vuoto o duplicato. Nessun dato del sito, collegamento browser, servizio HTTP o backup è stato cancellato. P3/Build317 resta CLOSED con il PASS operatore già ricevuto; runtime invariato, nessun deploy o nuova QA. DTM5/10m HOLD, mobile PAUSA, P4 SOLO FUTURO.

Finding di metodo nella ricognizione offline: una ricerca iniziale troppo ampia ha intercettato una riga cartografica embedded e prodotto troncamento; contenuto estraneo ignorato, successive ricerche limitate a simboli/range. Nessun dato personale era coinvolto.

Finding di metodo del 21/11, ricerca documentale root: `rg` con pattern `P0|gate` su FRONTIER/REPORT era troppo ampio e ha prodotto output troncato. Il recupero successivo è stato ristretto alle sezioni e alle chiavi pertinenti.

Finding di metodo nella review finale: una ricognizione delle sole chiavi metadata ha superato il budget di output; recupero ristretto al delta semantico, con strutture già revisionate collassate. Review finale PASS, senza lettura di payload privati né ripetizione dei test. Il flag storico `verifiedBackup: false` è esplicitamente circoscritto al backup completo origine mediante `verifiedBackupScope`; i quattro backup logici mantengono i propri esiti verificati.
