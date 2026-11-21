# P0 — attualità verificata e recupero selettivo da qualificare

Aggiornamento: **21 novembre 2026**. Orari delle evidenze sotto in UTC; Europe/Rome = UTC+1. [Metadati completi](evidence.json). FRONTIER resta l'unica LIVE STATE.

**P0 APERTO. Quattro contenitori logici coperti, cinque snapshot verificati conservati; nuovo LocalStorage HTTP acquisito dopo una differenza reale. Compatibilità applicativa e backup completo origine NON attestati. Nessun candidato di dati creato, migrazione, pulizia, modifica runtime o nuova QA.**

## Mandato e attualità delle copie

L'operatore ha richiesto di proseguire usando il PC. CORE BOOT e metodo erano già acquisiti: refresh minimo di origin/main/FRONTIER, WU N/A. Base canonica `f536dfacc15457ad569bf97e049bf8c73e1c844d`, riconfermata prima della persistenza. Il pass verifica l'attualità delle copie e prepara una proposta sul trattamento dei dati HTTP. [Evidenze precedenti](../2026-11-19-http-origin-p0-inventory/REPORT.md) conservate.

Helper di attualità vincolato alle quattro copie e relative ricevute già verificate; impronte aggregate delle coppie raw LocalStorage e delle tuple complete IndexedDB. Esecuzione nel profilo personale Edge su pagine neutre: 404 atteso, senza script/risorse, redirect, Set-Cookie o Clear-Site-Data. Nessun avvio del GIS.

| Contenitore | Controllo corrente UTC | Esito rispetto al backup precedente |
| --- | --- | --- |
| HTTPS LocalStorage | 13:05:54.939–13:05:55.201 | MATCH: 2 chiavi, 325.111 unità UTF-16 chiavi+valori. |
| HTTPS IndexedDB | stesso intervallo HTTPS | MATCH: 315 record, 7.984.081 byte binari. |
| HTTP LocalStorage | 13:06:45.671–13:06:46.114 | DIFFERENT: stessa dimensione/numero chiavi, impronta diversa. |
| HTTP IndexedDB | stesso intervallo HTTP | MATCH: 1.028 record, 16.012.203 byte binari. |

Ogni sonda ha eseguito due letture LocalStorage iniziali e due finali coincidenti intorno alla lettura IDB; un'apertura del DB atteso v1 con transazione readonly, nessun upgrade. Zero richieste di rete, download o scritture storage da parte delle sonde. Le impronte descrivono gli intervalli osservati: non uno snapshot atomico fra archivi/origini né una garanzia sulle modifiche successive.

## Nuova copia LocalStorage HTTP: VERIFIED

La differenza concreta ha giustificato **solo un nuovo export LocalStorage HTTP**. Exporter e verifier già qualificati riusati invariati; gli altri tre contenitori non sono stati riesportati.

- Snapshot **13:08:01.748 UTC**; verifica nativa **13:11:08.056 UTC**, processo 38508, exit code 0.
- File `TMAR-GIS-P0-HTTP-localStorage-20261121T130801748Z.json`, **36.618 byte**, 2 chiavi.
- SHA256 `31f21f40771c9114fa15b62bb58740508367b5c3941a947d7b2809f1a0ba04a0`.
- Copia non sovrascrivente in `C:\Users\mrhz\AppData\Local\TMAR-GIS\Backups\P0-20261121T130801748Z-HTTP-localStorage`.
- Ricevuta locale SHA256 `0b2daf53d6553b828845cd7ca7cf0cb80ce55c1fac78e6730efd2d62366b8475`.
- Dimensione/stabilità/hash, schema, coppie stringa/stringa univoche e copia riletta byte per byte: PASS.

`coordconv_v2` conserva 30.908 unità UTF-16, 1 traccia, 200 waypoint, 0 poligoni e impostazioni presenti. Edge richiedeva «Salva»: conferma visiva della voce esatta, file finale presente e `.crdownload` assente prima del verifier. Il precedente snapshot HTTP e gli altri backup sono preservati. Copertura `LOCALSTORAGE_ONLY`, `completeOriginBackup:false`.

Il successivo audit delle sole tre copie LocalStorage ha dimostrato che il cambiamento HTTP riguarda **soltanto settings**: 13 proprietà principali su 14 identiche, traccia salvata e waypoint strutturalmente identici, chiave UI raw identica. I valori specifici cambiati all'interno di settings e la causa non sono stati acquisiti. L'impronta aggregata del nuovo snapshot coincide con quella della sonda HTTP; il confronto non costituisce una nuova lettura browser.

## Recupero selettivo: precontrolli reali

Audit nativo alle **13:16:27.791 UTC**, processo 18908, exit code 0; input/receipt hash e stabilità tutti PASS. L'exit code attesta l'esecuzione, non l'idoneità del recupero. Selezione valutata come proposta: aggiungere l'unica traccia e i 200 waypoint HTTP alle raccolte HTTPS, preservando le altre sezioni HTTPS e conservando integralmente HTTP.

| Precontrollo | Risultato |
| --- | --- |
| Tracce risultanti | 6 su massimo 50; nessuna traccia oltre 2.000 punti. |
| Waypoint risultanti | 200 su massimo 200: nessun margine residuo. |
| ID tracce/waypoint | Nessun ID mancante/falsey/non supportato, duplicato nelle rispettive raccolte o collisione fra origini. |
| Coordinate | 3.464 punti di traccia e 200 waypoint passano il filtro di finitezza acquisito; waypoint entro il range di waypointAdd. Nessuna prova di equivalenza geografica. |
| ID dei punti di traccia | Una occorrenza ripetuta dentro una traccia, inizialmente aggregata sulle sei esaminate. |
| Campi data waypoint | 396 campi non già numerici finiti nella rappresentazione originale: controllo conservativo, non 396 record né 396 perdite o rigenerazioni dimostrate. |
| Metadati punti | 11 metadati presenti di tipo non-object, null incluso: osservazione aggregata, non un terzo blocker né diagnosi di perdita. |

Il referto originale dell'helper conserva `candidateReadiness:BLOCKED`, `roundTripProven:false` e `candidateDataCreated:false`. I codici emessi sono `POINT_ID_DUPLICATES_REQUIRE_REVIEW` e `KNOWN_NORMALIZATION_WOULD_CHANGE_SELECTED_RECORDS`. **La review semantica ha chiarito che questi indicatori conservativi non provano errori dei dati o cambi persistiti.** Una data assente può restare assente; null o stringhe numeriche seguono coercizioni diverse. Il loader waypoint esaminato non rigenera le date con Date.now(). Un meta:null può restare identico, e il normalizzatore esaminato non deduplica automaticamente i punti.

Sanitizzatori completi, stili, hash/sorgenti degli addon, riferimenti e preservazione delle sezioni HTTPS estranee alla selezione restano non attestati. L'audit rileva due oggetti importedElevations, nessun terrainFill e tre elevationProfile nell'insieme delle sei tracce: conteggi senza attestazione di validità né attribuzione all'HTTP. Nessuna stima promossa a quota originale.

## Chiarimento finale degli indicatori conservativi

Il solo delta di classificazione è stato eseguito sulle due copie LocalStorage correnti, con pin delle copie/ricevute e parser qualificati, senza rieseguire audit completo, confronto IDB o runtime. Esecuzione nativa conclusa alle **13:29:47.160 UTC**, exit code 0; nessuna lettura browser o scrittura dei dati.

| Indicatore iniziale | Classificazione reale |
| --- | --- |
| 396 campi data waypoint | Tutti **assenti**: createdAt assente in 198 waypoint, updatedAt assente in 198; 4 campi complessivi già numerici finiti. Zero null, stringhe o altri tipi. |
| 11 metadati dei punti non-object | Tutti **meta:null** negli 11 punti dell'unica traccia HTTP. Nessun altro tipo inatteso. |
| Una ripetizione ID dentro una traccia | Appartiene all'insieme delle **cinque tracce HTTPS già presenti**. Nessuna ripetizione negli 11 punti HTTP. |

I tre conteggi iniziali sono così spiegati; **non dimostrano corruzione, perdita o necessità di riparazione dei dati HTTP**. Il referto conservativo originale BLOCKED rimane come evidenza storica dell'audit, interpretato con questo chiarimento. Non va promosso a errore applicativo reale né corretto modificando i dati per far passare l'helper.

La review del loader indica che le date assenti possono restare assenti e meta:null può restare null. Questa classificazione non esegue caricamento/salvataggio: `persistedChangeAssessment:NOT_PERFORMED`, `roundTripProven:false`. L'ID ripetuto in HTTPS resta preservato; nessuna deduplicazione o riparazione implicita. Il gate applicativo effettivo resta la qualificazione del recupero senza perdite, distinto dal blocco dei residui.

## Contratto applicativo pertinente

Fonte: [runtime Build317](https://github.com/mrhz1973/cursor-coordinate-converter/blob/aff215323c97a309cbd5c6c7e0c694d35dd45ad0/coordinate_converter%20Claude.html), lettura statica mirata del 21/11/2026. Riferimenti e review dei contatori inclusi nei metadati; nessuna nuova esecuzione del runtime.

| Percorso | Effetto rilevante |
| --- | --- |
| savedTrackToFeatureCollection, righe 71877–71898 | Geometria a 7 decimali e quote originali valide; non rappresenta tutto il record, i metadati dei punti, elevationProfile o terrainFill. |
| gisImportHubMutateApply, 36793–36862; savedTrackAddFromPoints, 64085–64130 | Ricostruzione delle tracce con nuovi ID/date e valori predefiniti; closed false, visible true. |
| waypointAdd, 69586–69606 | Nuovi ID/date; chiamate dirette oltre 200 rimuovono elementi iniziali. La prevalidazione Import Hub è un percorso distinto. |
| ensureSavedTracksState, 63556–63616; caricamento waypoint, 106788–106844 | Ricostruzione con campi ammessi e sanitizzatori; non equivalenza garantita con il record raw. |
| saveStore, 29035–29148 | Ricostruzione dell'intera coordconv_v2, incluse impostazioni e raccolte estranee. |
| Session JSON, 78001–78067 | Non include le due raccolte e può cambiare impostazioni/altre sezioni. |

L'importazione UI ordinaria non è una via qualificata per riprodurre tutti i record e gli addon senza perdite. Anche un'unione raw della chiave non dimostra il risultato dopo caricamento/salvataggio. Non è stato creato o applicato un candidato di dati.

## Residui: blocco di lettura accertato

La UI `edge://version` ha identificato il profilo `C:\Users\mrhz\AppData\Local\Microsoft\Edge\User Data\Default` alle **12:54:30.113 UTC**. Le etichette di versione non abbinate alla funzione non sono usate per dedurre un formato di database.

Alle **12:57:22.970 UTC**, aperture OS in sola lettura sui soli nomi di metadati previsti:

- `WebStorage\QuotaManager` e relativo journal: **ACCESS_DENIED(5)** prima della lettura di byte.
- `File System\Origins\CURRENT` e `Service Worker\Database\CURRENT`: stesso esito, **zero byte letti**.
- Altri nomi attesi assenti soltanto nei percorsi esaminati; directory WebStorage/CacheStorage presenti come metadati.

Nessuna libreria SQLite/LevelDB aperta sulle sorgenti, interpretazione dei formati, modifica ACL, elevazione o riavvio. Il rifiuto di accesso non prova assenza di dati e impedisce di completare la mappatura dei residui. I limiti del precedente inventario browser restano validi: HTTPS Cache/SW osservati vuoti; HTTP API non disponibili; sessione/cookie con perimetro limitato; OPFS/legacy/WebSQL non acquisiti. **Backup completo origine ancora NON attestato.**

## Proposta sul trattamento dei dati — decisione non assunta

Conservare integralmente HTTP, il servizio tecnico e tutti gli snapshot. Valutare un recupero additivo della **sola traccia salvata e dei 200 waypoint HTTP** nella base HTTPS verificata, preservando i cinque record traccia HTTPS e tutte le altre sezioni/chiavi HTTPS. Nessuna deduplicazione per somiglianza geografica, rimappatura implicita di ID o troncatura.

Questa selezione è una proposta esplicita. Impostazioni HTTP, UI, cronologia, area nominata, tile e altre raccolte rimangono conservate negli archivi, fuori dalla selezione proposta. Qualsiasi nuovo waypoint HTTPS richiederebbe rivalutare il limite: non eliminare elementi per far rientrare il recupero.

Prima di applicare occorrono il contratto pertinente qualificato sulle copie, copertura residua risolta per l'azione prevista o decisione esplicita su un perimetro limitato, basi correnti nuovamente verificate e gestione degli scrittori concorrenti. Una lettura seguita da localStorage.setItem non è un confronto-e-scrittura atomico fra schede. Nessuna chiusura delle schede personali o scrittura storage autorizzata da questa proposta.

### TASK DELTA preparatorio per un prossimo pass — non emesso a Cursor

**Obiettivo:** qualificare su copie il recupero selettivo concordato, producendo una proposta applicabile e verificabile senza perdite o modifiche estranee.

**Scope:** copie LocalStorage vincolate alle ricevute correnti; sola aggiunta degli oggetti concordati in savedTracks/mapWaypoints. Letture mirate ai contratti necessari; nessuna scrittura HTTP, runtime o browser nel pass preparatorio.

**Acceptance:** selezione e capienza esatte; identità e riferimenti spiegati; roundtrip pertinente dimostrato; quote originali/addon corretti; sezioni HTTPS estranee preservate; copertura residua risolta per l'azione prevista. Eventuale candidato solo sul PC, con impronta globale e metadati di verifica.

**STOP:** collisioni o normalizzazioni non decise, contratto non qualificato, perdita/troncatura, variazione delle basi, necessità di modifiche runtime/permessi o scritture browser non autorizzate. Nessuna nuova WU/build, QA runtime, deploy, migrazione o pulizia impliciti.

## Qualificazione, privacy e chiusura del pass

- [Helper di attualità](prepare-http-recovery.cjs), SHA256 `5e18766164d836a64a6008d483543c0f804908367905aecc6ba70be3424d9beb`: 3 gruppi / 44 asserzioni sintetiche PASS e review statica indipendente PASS.
- [Audit selettivo](audit-selective-recovery.cjs), SHA256 `8825ff02d369b801e7463bfa6d532605138505d4d805dda4de9db4bf4b75a0ca`: 4 gruppi / 27 asserzioni sintetiche PASS, review statica indipendente PASS e review dei soli metadati reali PASS.
- [Classificatore del solo delta](classify-recovery-findings.cjs): 11 asserzioni nuove sulle classi ambigue PASS e review statica indipendente PASS. SHA256 qualificato/eseguito `a5841bae61cf992136b21d2d3de76d5d0365619e23421d2bb30393bdc3432a26`; copia documentale `9bd0aba6b1e338470a1aa15250310a6bb4b4a3ab8aca6b6b233e5680d7b3c18f`, con la sola riga vuota finale rimossa per diff check. La prova byte per byte nei metadati ricostruisce l'eseguito aggiungendo un LF. Nessuna variazione del codice operativo o riesecuzione; helper precedente invariato.
- Verificate soltanto nuove logiche; suite precedenti e QA runtime non ripetute. Comparator e funzione SHA qualificati riusati con pin.
- Payload geografici e backup rimasti sul PC; rapporti con soli conteggi, esiti, riferimenti e impronte aggregate, senza nomi/ID/coordinate/hash per record.
- Chiusura della sola scheda tecnica creata: 7→6 schede, altre sei preservate alle **13:12:06.513 UTC**. Nessuna cancellazione degli archivi o backup.
- Finding di metodo e recuperi ristretti elencati nei metadati: range locale iniziale non valido, scheda tecnica non più trovata, pattern UI indisponibili/popup con owner distinto, stampa di review troppo ampia. Nessun evento trattato come PASS dei dati.

Build317/P3 CLOSED rimangono invariati; DTM5/10m HOLD, mobile PAUSA, P4 FUTURO. P0 resta APERTO fino alla risoluzione dei gate effettivi.
