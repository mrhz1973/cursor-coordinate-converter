# Ripresa GPT — routing Build 280 e proposta HTTPS 443

Data delle verifiche: **9 novembre 2026**. Blocco: `ROUTING-LAND-ONLY-NO-FERRY-A`.

## Stato corrente

**Candidato Build 280 preparato e verificato in isolamento; runtime pubblico ancora Build 279.** Il checkpoint pubblica documentazione, strumenti di QA ed evidenze. Non pubblica il candidato HTML e non applica la proposta infrastrutturale.

| Oggetto | Identità e stato verificato |
| --- | --- |
| Base GitHub acquisita con `git ls-remote` | `84154391a40705815adf758098ebf8e4c63e302b` — osservazione precedente a questo checkpoint, non HEAD finale |
| Runtime canonico e HTTP VPS | Build **279**, `GIS-CONVERT-VIEWPORT-A`; **11.082.679 byte**; SHA-256 `bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253` |
| Candidato isolato | Build **280**, `ROUTING-LAND-ONLY-NO-FERRY-A`; **11.108.273 byte**; SHA-256 `1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a` |
| Pubblicazione candidato | Non committato; nessun blob Git candidato creato; non distribuito |
| Infrastruttura | Proposta HTTPS 443 completa e collaudata con upstream simulati; **non installata** |
| Gate residui | Approvazione della modifica infrastrutturale; verifica reale TLS/CORS/provider/UI; successivi gate di pubblicazione e deploy |
| Esecutore di questa ripresa | GPT, con revisori GPT separati. Codex e Cursor non eseguiti |

Il clone osservato sul VPS era pulito al commit `7a2c88b1b292ff0b46a2f90b1115143673fe72f1`: è un dato del checkout VPS, distinto dalla HEAD GitHub. I byte effettivamente serviti sono stati verificati indipendentemente dal commit del clone. Lo stato vivo resta esclusivamente [FRONTIER](../../../FRONTIER.md).

## Provenienza e recupero

La richiesta iniziale era il passaggio da «TMAR GIS TOOL 47 Codex Goal» a GPT dopo esaurimento della quota Codex; l'utente ha poi autorizzato la continuazione. Non è stata recuperata integralmente la vecchia conversazione e non è stata trasferita o modificata un'automazione Goal. Il CORE BOOT e i file di `origin/main` hanno determinato lo stato operativo; le chat precedenti e gli staging sono stati usati soltanto come storico da verificare.

È stato ritrovato sul dispositivo Windows `Utente` lo staging originale Build 277, SHA-256 `8bada07bf241118fe4e32ecfd3aa214521803ab7092018e98866adfa81414116`, coincidente con il riferimento di FRONTIER. Sono stati recuperati anche il riallineamento Build 279, la successiva variante HTTPS 443 e i relativi harness. La Build 280 integra quel lavoro sulla base canonica Build 279, con le correzioni descritte sotto. La vecchia copia del repository su un altro PC, contenente modifiche locali, è stata lasciata intatta.

Il candidato esatto è disponibile in staging:

```text
C:\Users\Utente\Downloads\Documents\ChatGPT\TMART GIS Tool\work\gpt-resume-20261109\candidate-280-1e6c11cf.html
```

Copia di lavoro cloud della sessione:

```text
/workspace/scratch/bcbe375c6817/gis-recovery/candidate-280.html
```

Entrambe le copie hanno lo SHA completo indicato sopra. La directory cloud è transitoria: alla ripresa usare lo staging Windows e verificare i byte, senza presumere l'esistenza della copia cloud.

## Modifiche nel candidato

1. **Routing terrestre:** ripresa delle difese no-ferry, della validazione dei metadati dei segmenti e del limite di aggancio di 50 m. La posizione confermata dall'utente viene mantenuta anche nel confronto GH/ORS; le coordinate originali non vengono sovrascritte.
2. **Origine HTTPS:** instradamento same-origin sul solo host autorizzato `https://ionos-n8n-new.tailc01234.ts.net`, con GH sotto `/_routing/gh` e ORS sotto `/ors`. Restano il supporto esistente dell'origine 8443 e il comportamento HTTP legacy. Gli origin HTTPS estranei non avviano richieste provider.
3. **Deadline del confronto ORS:** limite complessivo di 20.000 ms anche durante lettura del body, sequenze andata/ritorno e tentativi di circuito. Il timeout annulla il controller ORS, conserva un risultato GH valido e ripulisce timer/stato. La cancellazione volontaria resta distinta dal timeout.
4. **Errore ORS 404:** il gateway reale traduce ogni 404 upstream in `ors_not_found`; ciò non dimostra l'assenza di una connessione terrestre. Il candidato rifiuta la risposta e mostra l'errore gateway ordinario. Solo l'errore specifico GH `ConnectionNotFoundException` mantiene la diagnosi di percorso terrestre non disponibile.
5. **Self-check Roma–Abidjan:** corretto il valore atteso della prova, non l'algoritmo geodetico. Per i punti fissi della fixture il riferimento GeographicLib è 4.366.528,479734087 m; la vecchia attesa di circa 4.557 km era errata.
6. **Versione e lingua:** Build 280, note di rilascio e tre nuove etichette italiane. Rimosse soltanto le nuove traduzioni EN/FR introdotte dallo staging, rispettando L10N-FREEZE; traduzioni esistenti conservate.

Il file resta un unico HTML con CSS/JS inline e vanilla JS. Nessuna dipendenza, schema persistente o attivazione GPS aggiunti. `state.mapWaypoints[]` resta canonico. Le implementazioni MGRS e Converti sono quelle della base Build 279. È stata esclusa una normalizzazione estranea della vecchia cronologia: i 192 CR isolati preesistenti sono conservati, così come l'assenza di BOM del runtime canonico. [Mappa delle regioni modificate](runtime-scope.json).

## QA sullo SHA esatto della Build 280

| Verifica | Esito corrente | Evidenza e perimetro |
| --- | --- | --- |
| Sintassi JavaScript inline | **2/2 PASS** | [syntax.json](syntax.json), compilazione dei due script con Node |
| Ciclo di vita timeout ORS | **15/15 PASS** | [timeout-results.json](routing/timeout-results.json); funzioni reali estratte, fetch simulato, deadline ridotta a 25 ms soltanto nell'harness |
| Routing nel browser | **54/54 PASS**, zero page error | [Rapporto routing](routing/browser/REPORT.md), [manifest risultati](routing/browser/results-manifest.json) |
| Conversioni e parser geografici | **2.112/2.112 PASS su 72 punti** | [Manifest esecuzione](geodesy/execution-manifest.json), [misure](geodesy/measurements.json), [dati runtime](geodesy/actual.json) |
| Input geografici non validi | **96/96 rifiutati** | [Riepilogo geodetico](geodesy/summary.json) |
| UI geografica desktop/mobile | **24/24 PASS**, zero page error | [world-ui.json](geodesy/world-ui.json); 12 punti su due viewport; 573 richieste esterne bloccate |
| Self-check Roma–Abidjan | **PASS**, scarto 0,000001293 m | [roma-abidjan.json](geodesy/roma-abidjan.json), tolleranza 0,01 m e sensibilità della soglia verificata |

Le 54 prove routing comprendono **38 casi generali, 4 transizioni OPSEC/offline, 9 casi anchor recuperati e 3 origin HTTPS estranei**. Ogni context era temporaneo e le richieste erano intercettate: risposte provider simulate, altre richieste annullate. L'unico adattamento di acceptance è il 404 ORS ambiguo, mantenendo identica la fixture e il rifiuto di preview/salvataggio. I [diff e il manifest degli adattamenti](routing/browser/adaptation-manifest.json) rendono la modifica verificabile.

Il vecchio riferimento storico a **13** casi compare/anchor non è stato trasformato in un PASS corrente: i runner effettivamente recuperati riproducono **9** casi. Gli ulteriori runner trovati duplicano le matrici disponibili. I test storici dei provider reali non sono risultati della Build 280 e non chiudono i gate correnti.

### Precisione geografica osservata e limiti

Riferimenti indipendenti installati nell'ambiente di prova: **pyproj 3.8.0 / PROJ 9.8.1**, **mgrs 1.6.0** e, per la coppia Roma–Abidjan, **GeographicLib 2.1**. Ultima esecuzione geografica terminata il **9 novembre 2026 alle 11:38 UTC**. Gli harness recuperati sono stati adattati solo nei percorsi e nell'isolamento di rete: [manifest](geodesy/ADAPTATION-MANIFEST.json).

| Confronto | Campioni | Scarto massimo osservato | Soglia della prova |
| --- | ---: | ---: | ---: |
| UTM diretto rispetto a PROJ | 68 | 4,075 × 10⁻⁹ m | 0,01 m |
| UTM inverso su input PROJ | 68 | 4,958 × 10⁻⁹ m | 0,01 m |
| MGRS inverso, angolo sud-ovest GEOTRANS | 68 | 3,272 × 10⁻⁸ m | 0,02 m |
| MGRS diretto, confronto dopo decodifica | 68 | 0,635695 m | 0,72 m, inclusa la quantizzazione della cella da 1 m |

Questi scarti sono confronti numerici nel campione, non precisione assoluta del posizionamento sul terreno. I parser MGRS confrontati con il punto sorgente arrivano a circa 1,342 m per la convenzione della cella; il riepilogo riporta separatamente ogni gruppo. Sono presenti sei differenze di rappresentazione testuale MGRS (zero iniziale della zona e convenzione 1/60 sull'antimeridiano), senza FAIL metrico.

Le prove non sono una certificazione universale, non coprono tutti i datum o UPS e non attestano Safari/iPhone fisico. Le dieci fixture MGRS Build 278 recuperate sono conservate per riproducibilità ma non sono dichiarate come una nuova esecuzione separata. La conferma fisica iPhone del 5 novembre sulla Build 277 resta storico, non QA operatore della Build 280.

## HTTPS 443: proposta concreta e test di preservazione

La verifica del server ha confermato due ostacoli: mancano i nuovi percorsi GIS/GH nel server Nginx 443 e l'allowlist ORS ammette soltanto l'origin HTTP preesistente. Il solo cambio di URL nel browser non risolve il controllo Origin del gateway.

Il [pacchetto infrastrutturale](infra/README.md) propone:

- un servizio Python stdlib v7 su `127.0.0.1:18080`, con destinazioni fisse e guardie di richiesta già implementate;
- un unico include Nginx per `/gis` e i tre endpoint GH esatti, con logging delle nuove route disattivato e fallback GH chiusi;
- l'aggiunta del solo Origin HTTPS esatto alla allowlist ORS;
- nessuna modifica ai byte delle route esistenti `/ors`, `/catalogo`, `/vps`, ai listener o ai certificati.

Il percorso ORS resta `Nginx → gateway 127.0.0.1:8020`, evitando un loop verso lo stesso HTTPS 443. Il proxy v7 conserva le validazioni di JSON, profili e coordinate che un semplice pass-through Nginx perderebbe. `/gis` serve il runtime HTTP già pubblicato; non installa il candidato.

**Dieci gruppi di collaudo PASS** con Nginx reale, UID non privilegiato 65534, tmpfs temporaneo, TLS di test verificato e upstream esclusivamente simulati. Inclusi 14 casi GH negativi, isolamento degli header sensibili, body maggiore di 64 kB nel solo nuovo endpoint, mantenimento del limite ORS, controllo del 502 quando il proxy è spento e assenza di coordinate sintetiche nei log delle nuove route. [Risultato e baseline pre/post](infra/evidence/vps-isolated-result.json).

I file di configurazione, i byte HTTP, lo stato del clone e i PID di Nginx, gateway ORS e GIS sono rimasti identici prima e dopo. Processi e file temporanei sono stati rimossi. Non sono state lette chiavi o credenziali di produzione. Il controllo statico systemd non dimostra ancora l'avvio reale con il sandbox del servizio.

Il pacchetto contiene sorgenti, patch, baseline, manifest, verificatore senza scritture, sostituzione atomica con guardia hash e istruzioni di applicazione/rollback. Verifica di integrità nella destinazione documentale: **19/19 file PASS**. La [review del disegno e dell'applicazione](infra/evidence/independent-review.txt) è una review GPT separata, non di un provider esterno; ha fatto correggere il fallback dei percorsi GH estranei e il recupero dopo un'applicazione parziale. Il rollback ora distingue ogni file già originale, modificato dal pacchetto o in conflitto e usa un registro delle fasi; la [prova locale](infra/evidence/atomic-helper-local.json) copre anche la prima sostituzione riuscita con la seconda rifiutata. Nessun blocker residuo nella review. Il logging globale dei servizi condivisi non viene alterato; gli errori HTTP respinti prima della selezione della location mantengono la policy del server esistente.

## Gate e prosecuzione

L'[autorizzazione permanente del 3 novembre](../../../OPERATING_MEMORY.md) permette commit/push e deploy del **solo runtime GIS completo**, dopo PASS dei gate, ed esclude proxy, configurazione provider, infrastruttura e servizi condivisi. L'approvazione ancora necessaria riguarda esattamente **installazione e avvio del nuovo proxy, include Nginx con reload, aggiunta dell'Origin ORS e restart del solo gateway ORS**. Il pacchetto è preparato e verificabile prima di chiedere questa decisione.

Dopo l'approvazione:

1. Verificare che hash e precondizioni live coincidano ancora con il pacchetto; applicare secondo [istruzioni e rollback](infra/README.md).
2. Verificare il TLS reale, l'avvio systemd, `/gis`, GH e ORS, inclusa la preservazione degli endpoint esistenti.
3. Eseguire UI e provider reali sul candidato SHA `1e6c11cf…` con consenso di rete esplicito e fixture pubbliche; verificare il comportamento no-ferry e l'intero ciclo confronto/selezione/salvataggio.
4. Solo dopo i gate pertinenti, pubblicare il monolite e le note secondo il metodo canonico, quindi deploy del runtime con la standing authorization già acquisita.

Un cambio di origin HTTP→HTTPS crea uno spazio browser distinto per dati e cache. Non esiste una migrazione automatica dei dati dell'utente. Questo aspetto va comunicato quando si introduce il nuovo URL; non sono stati migrati o cancellati dati.

**Non dichiarare FINITO, PASS operatore, provider reali PASS o deploy Build 280 sulla base di questo checkpoint.**

## Finding di metodo

Durante il recupero alcune ricerche troppo ampie hanno intercettato dati inline molto grandi e prodotto output troncato. L'eccedenza non è stata usata come prova; le letture successive sono state ristrette a simboli, intervalli e file specifici. Il precedente `LAST_CURSOR_REPORT.md` e la vecchia riga di `latest.md` erano storici e non sono stati trattati come LIVE STATE. I nuovi report distinguono base osservata, candidato, runtime HTTP e commit contenitore secondo F3.

Il controllo whitespace generale segnala gli spazi di contesto necessari nei file patch/diff archiviati e una riga vuota finale nell'harness geodetico recuperato. Questi byte sono conservati per mantenere gli hash delle evidenze; non sono correzioni da applicare al runtime. Il controllo dei restanti file documentali e sorgenti proposti è distinto dalla verifica di integrità byte per byte degli artefatti.

Gli hash degli artefatti pubblicati sono nel [manifest complessivo](evidence-manifest.json). I JSON originali conservano i percorsi dell'esecuzione, anche quando i file sono stati copiati sotto questa directory documentale.
