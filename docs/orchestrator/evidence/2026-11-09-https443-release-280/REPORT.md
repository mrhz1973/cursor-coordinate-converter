# HTTPS 443 e rilascio GIS Build 280 — 9 novembre 2026

## Stato verificato

**HTTPS 443 applicato, Build 280 pubblicata e distribuita; Automated Browser QA sulla pagina live PASS.** Il runtime è servito all'indirizzo [GIS HTTPS](https://ionos-n8n-new.tailc01234.ts.net/gis?v=70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde), con accesso tailnet. Il precedente [URL HTTP](http://100.99.54.93:8000/coordinate_converter%20Claude.html) resta disponibile. Verifiche del **9 novembre 2026**; deploy runtime completato alle **14:32:47 Europe/Rome**.

Il blocco resta `ROUTING-LAND-ONLY-NO-FERRY-A`, senza WU attiva. Questo rapporto è evidenza del pass; [FRONTIER](../../../FRONTIER.md) rimane l'unica LIVE STATE. L'esecutore è GPT. Codex e Cursor non sono stati eseguiti. Nessun PASS operatore e nessuna dichiarazione FINITO.

## Autorizzazione e perimetro

L'operatore ha approvato il pacchetto infrastrutturale concreto con «Okay, autorizzato.» il 9 novembre 2026. L'approvazione copre il proxy loopback dedicato, l'include Nginx e il solo Origin HTTPS aggiuntivo nel gateway ORS, con attivazione e verifica descritte nel [pacchetto già pubblicato](../2026-11-09-gpt-routing-280/infra/README.md). Non estende la standing authorization a modifiche infrastrutturali future. Pubblicazione e deploy del runtime GIS seguono invece la standing authorization del 3 novembre, dopo i gate pertinenti.

La configurazione HTTPS è stata applicata alle **13:57:21 CET del 9 novembre 2026** (`12:57:21Z`), con risultato `APPLIED_PASS`, senza rollback. Il runtime allora servito era ancora Build 279. Le prove del candidato e il deploy successivo sono distinti da questa attivazione.

## Identità del runtime

| Voce | Valore |
| --- | --- |
| File canonico | `coordinate_converter Claude.html` |
| Build | 280 |
| Commit runtime pubblicato | `c33f58c956e9630b03f9ff86eb35eccd35879a4a` |
| Parent del commit runtime | `e94d26a45a9dc1da152812995270d9726f556578` |
| Blob | `d2ec773205da2a6d4bf954f635765eb872ec646c` |
| SHA-256 definitivo | `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |
| Dimensione | 11.108.654 byte |
| Delta completo rispetto al parent | 500 aggiunte, 89 rimozioni; solo il monolite |

Il candidato precedente `1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a` (11.108.273 byte, commit locale `fb10709eddffaf8ce57cfba7e892618f0d2533df`) resta l'identità delle prove iniziali. Quel commit è stato corretto prima della pubblicazione: nessuna riscrittura della storia remota. L'intermedio `68fb2dbc…` non è stato eseguito nel browser.

## Comportamento introdotto e correzioni

Il bundle riallineato alla Build 279 conserva le difese no-ferry, verifica i metadati dei segmenti e lo snap entro 50 m, e usa gli anchor verificati/confermati nel confronto dei provider. Il confronto ORS ha una deadline complessiva di 20 secondi, mantiene un risultato GraphHopper valido se ORS fallisce e distingue cancellazione e timeout. Un generico 404 ORS non viene presentato come prova di assenza di collegamento terrestre; resta la diagnosi specifica GraphHopper.

L'origine HTTPS esatta usa `/_routing/gh` per GraphHopper e `/ors` per OpenRouteService. Origini HTTPS estranee restano bloccate. Il comportamento HTTP precedente è preservato. La compatibilità condizionale con l'esatta origine 8443, recuperata dallo staging e nuova rispetto alla base 279, si attiva soltanto quando il documento si trova già su quell'origine: nessun fallback o contatto da 443 verso 8443, nessun listener 8443 attivato da questo pass. Il commento nel codice che descrive HTTP come un'origine esatta è più restrittivo del comportamento effettivo, che conserva le copie ospitate via HTTP in generale.

Le prove reali hanno inoltre isolato due difetti UI preesistenti nel sorgente 279, documentati mediante confronto dei byte e riproduzione sul primo candidato:

1. Con sessione compare vuota, fallita o già scelta, il click su un'alternativa entrava nel ramo overlay del confronto e lasciava anteprima e selezione sul percorso principale. `routingWireAlternativesRowOnce` ora usa quel ramo solo con un confronto non ancora scelto e almeno un pack PASS, coerentemente con renderer e raccolta overlay.
2. Il pulsante **Confronta GraphHopper e OpenRouteService** poteva conservare lo stato disabilitato o la nota del profilo precedente dopo un cambio di punti/profilo. `routingCompareOnInputInvalidated` ora sincronizza la UI anche prima del ritorno per sessione vuota.

Queste due funzioni e una nota di rilascio sono l'intero delta finale rispetto a `1e6c11cf…`: 9 aggiunte e 3 rimozioni. La [ricostruzione esatta del blob](review-selection-storage/review/final-delta-integrity.json) dimostra che gli altri byte sono invariati. La correzione del riferimento Roma–Abidjan riguarda soltanto il self-check; algoritmi MGRS/Converti invariati. Restano singolo HTML, CSS/JS inline, vanilla JS, storage esistente, `state.mapWaypoints[]` canonico, consenso rete, OPSEC/offline e assenza di nuovo GPS implicito. Tre nuove etichette IT; freeze EN/FR rispettato.

## Infrastruttura applicata

Nodo verificato: IP pubblico `31.70.139.73`, tailnet `100.99.54.93`, nome `ionos-n8n-new.tailc01234.ts.net`. Il vecchio alias SSH non è stato usato.

- `goi-gis-https443-proxy` attivo e abilitato, bind esclusivamente `127.0.0.1:18080`; sandbox systemd e DynamicUser effettivi verificati, nessun drop-in.
- Nginx espone `/gis` e i percorsi GraphHopper ammessi. ORS continua a essere inoltrato direttamente al gateway loopback 8020, senza passare dal nuovo proxy.
- Il gateway ORS accetta sia il vecchio Origin `http://100.99.54.93:8000` sia il nuovo `https://ionos-n8n-new.tailc01234.ts.net`; un Origin estraneo riceve 403.
- Nessuna modifica a DNS, certificati, firewall, Tailscale Serve/Funnel o listener pubblici. Catalogo, `/vps/`, root e servizi condivisi verificati durante l'applicazione.
- Backup e registro delle fasi: `/var/backups/goi-gis-https443/20261109T124519Z`.

| Configurazione | SHA-256 applicato |
| --- | --- |
| `/etc/nginx/sites-available/goi-ors-gateway` | `b57501bb9306127c6aef551a4afd8ecc720922ccb4979d8ab5461303478f5fd5` |
| `/opt/goi-ors-gateway/current/goi_ors_gateway.py` | `e15a23f6b098b340b4c7f290c9ea96d4e01085bc4a5d9cc843ad32e9135089d8` |

TLS 1.3 e SAN del certificato di produzione sono stati verificati direttamente dal VPS; validità osservata 6 novembre 2026–4 febbraio 2027. Nel browser Windows la catena è filtrata da ESET SSL Filter CA, tramite trust normale del sistema e senza bypass TLS. Sono prove diverse e non vanno confuse. Dettagli e rollback: [rapporto infrastruttura](infra-applied/REPORT.md), [stato applicato](infra-applied/https443-applied-state.json), [sandbox effettivo](infra-applied/systemd-effective-proof.json).

## QA e attribuzione delle prove

| Prova | Esito | Byte e limite |
| --- | --- | --- |
| Sintassi inline | 2/2 PASS | Definitivo `70553e52…` |
| Review GPT sostitutiva | Nessun blocker di codice residuo | Review completa del primo commit immutabile + review dell'intero delta finale e prova di identità dei restanti byte |
| Regressione alternative | 8/8 PASS; 9 salvataggi/reload/riaperture | Originale e definitivo; risposta ORS reale riprodotta offline; zero richieste provider e zero page error |
| Aggiornamento Compare | PASS | Definitivo; abilitato/disabilitato/abilitato tramite UI, zero sync manuali e zero richieste reali |
| Provider reali prima del deploy | 6 scenari PASS, esattamente 7 POST | Definitivo; tutti i 7 profili, 15 selezioni e 7 salvataggi/riaperture; documento candidato intercettato sul vero Origin HTTPS |
| Routing mock precedente | 54/54 PASS | `1e6c11cf…`, componenti invariati; non nuova esecuzione sull'intero file definitivo |
| Timeout mock precedente | 15/15 PASS | `1e6c11cf…`; deadline ridotta a 25 ms nell'harness, 20.000 ms in produzione |
| Geodesia/input/UI precedenti | 2.112/2.112, 96 invalidi rifiutati, 24/24 UI PASS | `1e6c11cf…`, algoritmi e componenti invariati; campione, non certificazione geografica globale |

I profili reali sono GraphHopper `hiking`, `hiking_easy`, `mtb_trail`, `mtb_touring` e ORS `foot-hiking`, `foot-walking`, `cycling-mountain`. Il confronto MTB copre due profili in un solo scenario. Non esiste un profilo auto in questa matrice. La fixture pubblica è La Spezia: `(44.1024, 9.8236)` → `(44.107, 9.829)`.

Le sette risposte reali sono state conservate senza modificarne i byte. I metadati di ogni alternativa e le guardie di richiesta sono stati verificati insieme a selezione, anteprima, salvataggio e riapertura. `requestPolicyValid=true` e nessuna richiesta provider rifiutata dalla policy nei sei scenari. Nessun errore JavaScript di pagina né errore provider. Sono stati bloccati font/tile/meteo e altre richieste fuori perimetro; nel primo context un GET automatico `/favicon.ico` ha raggiunto il server e ricevuto 404. Questo tentativo non è descritto come isolamento di rete senza eccezioni. Il blocco favicon è stato poi corretto nell'harness tramite CDP, senza modificare runtime o risposte provider.

Il primo tentativo sul candidato `1e6c11cf…` conserva l'esito fallito: un solo POST ORS 200, difetto di selezione e UI Compare da correggere. Il POST GH fu fermato da una race dell'osservatore nell'harness: la pagina aveva già ricevuto la risposta nearest mentre l'osservatore ne stava ancora leggendo il corpo. La correzione attende il completamento di quell'osservazione prima di verificare il POST, preservando il controllo esatto del body; non rilassa la policy e non riscrive la richiesta. La regressione offline ha riprodotto e verificato questo caso.

Rapporti: [QA reale prepubblicazione](routing-real/QA-REAL-280-PREPUBLICATION.md), [riepilogo dei sei scenari](routing-real/attempt2/qa-summary.json), [review finale](review-selection-storage/review/REVIEW-GPT-SOSTITUTIVA-70553e52.md), [regressione selezione](review-selection-storage/selection/REGRESSIONE-SELEZIONE-70553e52.md), [gate prepubblicazione](release/prepublication-gate.json). I rapporti e manifest originari sono conservati senza riscrivere gli esiti storici.

## Pubblicazione e deploy

Il commit runtime è stato pubblicato con push normale dal repository bare isolato Windows, tramite Git Credential Manager già configurato. Il cloud non dispone di credenziali di push: non sono state lette o copiate credenziali e non sono stati alterati i checkout preesistenti dell'operatore. Parent, commit, blob, SHA e dimensione sono stati verificati prima del push. La [verifica indipendente dal cloud](release/publication-verification.json) conferma commit locale, tracking e `ls-remote` concordi, runtime esatto e worktree pulito alle `13:26:16Z` (14:26:16 CET).

Il deploy VPS è `DEPLOY_PASS` alle **14:32:47 CET** (`13:32:47Z`). Il clone era pulito su `main` a `7a2c88b…`; dopo fetch e controllo del delta è stato portato in fast-forward al commit runtime esatto. Backup: `/var/backups/goi-gis-runtime/20261109T133117Z`. File, HTTP8000 e HTTPS `/gis` riportano Build 280, 11.108.654 byte e lo SHA definitivo. È stato riavviato soltanto `goi-gis-app` (PID 1838127); Nginx, gateway ORS e proxy HTTPS hanno mantenuto i loro PID. Sei hash infrastrutturali, listener condivisi e risposte ORS/catalogo/VPS invariati; nessun rollback. [Rapporto deploy](runtime-deployed/REPORT.md), [registro originale](runtime-deployed/runtime280-deployed-state.json) e [verifica del root](release/root-deploy-verification.json).

La prima esecuzione postdeploy si è fermata prima di qualsiasi POST: il buffer DevTools aveva espulso il corpo del documento HTML da 11,1 MB e il runner non poteva verificarne lo SHA. Non era un mismatch dimostrato del runtime. Il tentativo è conservato come fallito, con 0 POST. Dopo la sola correzione del buffer/osservazione, il runner definitivo `4d3c4283a24a902ad379a20864b2f0cc79a57faea04d150ea00a76092b2ce770` ha eseguito la prova sulla **pagina live, senza fulfill/sostituzione del documento**: SHA verificato prima di entrambe le richieste, confronto MTB con esattamente 2 POST (uno GraphHopper e uno ORS), selezione, salvataggio e riapertura PASS. Le successive prove offline e OPSEC hanno bloccato i provider. Il blocco favicon è applicato prima della navigazione; Console/Network sono inclusi nel gate.

La prova live è terminata alle **14:36:46 CET** (`13:36:46Z`). Tre caricamenti nativi hanno restituito ogni volta lo SHA e la dimensione previsti; due tracce di 20 punti GH e 34 punti ORS sono state salvate e riaperte. Zero page error, errori di trasporto provider o tentativi provider nelle fasi offline/OPSEC. I 616 messaggi console sono esclusivamente blocchi intenzionali delle risorse accessorie; non è dichiarata una console vuota. Tre favicon bloccate da CDP, zero risposte server.

[Rapporto Automated Browser QA](routing-real/QA-REAL-280-POSTDEPLOY.md), [riepilogo del documento e dei gate](routing-real/postdeploy/qa-summary.json), [verifica del root](release/root-postdeploy-verification.json) e [manifest browser](routing-real/postdeploy-artifact-manifest.json). Le schermate mostrano routing e messaggi delle policy; la cartografia di fondo era intenzionalmente bloccata. Il totale di richieste reali dell'intero pass è 10 POST: 1 sul candidato iniziale fallito, 7 sul definitivo prima del deploy e 2 sul live; zero nel tentativo buffer.

I commit documentali successivi non alterano il runtime distribuito: il commit di deploy rimane `c33f58c…`; la HEAD documentale finale va verificata esternamente secondo F3.

## Dati nel browser e cambio di indirizzo

L'indirizzo HTTP precedente continua a essere servito, senza redirect o cancellazione dei dati del browser. HTTPS costituisce un'origine distinta: i dati del medesimo browser/dispositivo non si trasferiscono automaticamente. Nessun profilo reale dell'utente è stato aperto e nessuna migrazione è stata eseguita.

Dieci sezioni di persistenza/esportazione e le due chiavi principali risultano invariate; il delta finale non le tocca. **Esporta sessione non è un backup completo**: non include waypoint GIS, tracce, poligoni, cache e tutti i layout/consensi. Gli export GIS sono selettivi; più LineString in un unico file vengono unite in una traccia all'import, e una traccia chiusa esportata come Polygon rientra come poligono. MissionPackage è export-only. Non presentare quindi «esporta tutto e importa» come migrazione senza perdita. [Analisi del contratto storage](review-selection-storage/storage/STORAGE-ORIGIN-REVIEW.md).

## Gate residui

QA operatore sul territorio e telefono reale e review esterna post-hoc restano **NON ESEGUITE**. La review eseguita è esplicitamente GPT sostitutiva; non è attribuita a un provider esterno. Le conferme iPhone delle Build precedenti restano storico. Le suite automatiche non equivalgono a un PASS operatore e non chiudono il blocco complessivo.

I [tre casi di QA operatore](QA-OPERATORE.md) usano l'URL con cachebuster dello SHA qualificato: percorso a piedi conosciuto, itinerario MTB conosciuto, leggibilità e tocchi sul telefono reale. Non richiedono di ripetere hash, Console/Network o verifiche tecniche già automatiche.

## Integrità e limiti documentali

Gli artefatti riportano i rispettivi SHA completi e timestamp UTC. Gli orari di lettura operativa in questo rapporto sono Europe/Rome (CET il 9 novembre). Il manifest complessivo del checkpoint protegge i byte effettivamente salvati; `.gitattributes` locale disabilita le conversioni di fine riga per questi artefatti. I manifest storici possono riferirsi ai percorsi originali: l'[indice della raccolta review](review-selection-storage/INDEX.md) spiega gli spostamenti e le esclusioni.

Una lettura iniziale troppo ampia dei risultati ha prodotto output troncato. Nessun verdetto è stato tratto dalla parte non visibile: le verifiche successive hanno usato manifest e proiezioni limitate ai campi pertinenti. Il finding è contenuto; non sono state ripetute suite complete per questo motivo.

Nessuna automazione Goal trasferita o modificata. Altri workstream, interventi su importazione e layout generale, ulteriori modifiche ai provider oltre all'Origin ORS autorizzato e interventi sul sistema operativo restano fuori da questo pass.

La verifica whitespace generale segnala i CRLF originali e gli spazi di contesto dei tre file diff/delta archiviati. Con riconoscimento esplicito dei CRLF (`cr-at-eol`), il controllo di tutti gli altri file staged è PASS; i tre diff/delta sono esclusi per formato, senza alterarne i byte. Le copie originali sono state confrontate con le fonti e i blob staged sono verificati mediante SHA-256.
