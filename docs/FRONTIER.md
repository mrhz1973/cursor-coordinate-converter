# FRONTIER â€” stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Build324 LIVE, review/deploy/ABQA PASS, QA operatore PENDING; GIS-LEGENDS-NO-OVERLAP-COORD-BARS-A OPEN; Build323 ultimo CLOSED, P0 non applicato. |
| **WU ATTIVA** | — (nessuna WU attiva). |
| **BLOCCO ATTIVO** | GIS-LEGENDS-NO-OVERLAP-COORD-BARS-A - Build324 DELICATO / STANDARD_RUNTIME_BUNDLE. |
| **STATO BLOCCO** | OPEN / DEPLOY_TECHNICAL_PASS / REVIEW_GPT_SOSTITUTIVA_PASS / AUTOMATED_BROWSER_QA_PASS / QA_OPERATORE_PENDING. |
| **GATE CORRENTE** | QA FINALE CHATGPT - PENDING: Build324 ABQA HTTPS LIVE 108/108 PASS. [Build324 LIVE QA](orchestrator/evidence/2026-11-24-legends-coordinate-exclusion-324/REPORT.md) - [evidence](orchestrator/evidence/2026-11-24-legends-coordinate-exclusion-324/evidence.json). |
| **RUNTIME LIVE** | Build324 GIS-LEGENDS-NO-OVERLAP-COORD-BARS-A, source b08459bfa2eaf49df938d550b1800edce105096d, blob cb838af70477a2136f654f1b52397e35046d2848, SHA256 78d8acb4a549ab60e4d44fd798240b57b0617bf0964a7e93700db12dab90ebbf, 11.356.016 byte; VPS checkout 276794c5a7099bcc5ea42c21b0d2eac6c8c2b300 al deploy, HTTP/HTTPS200 byte/SHA verificati; ABQA HTTPS LIVE 108/108 PASS; QA operatore PENDING. |
| **RUNTIME CANDIDATE** | Nessun candidato distinto dal LIVE. Build324 statici12/12, geometria4065/4065, candidato108/108, review19/19 e ABQA LIVE108/108 PASS; QA operatore PENDING. |
| **ULTIMO BLOCCO CHIUSO** | MAP-FRACTIONAL-ZOOM-A-T2 — Build323, QA operatore PASS registrato 24/11/2026; [QA323 CLOSED](orchestrator/evidence/2026-11-24-qa323-t2-closure/REPORT.md) - [attestazione](orchestrator/evidence/2026-11-24-qa323-t2-closure/evidence.json). Parent CLOSED per layer compatibili. |
| **NEXT** | Presentare QA umana breve Build324 LIVE: legende fuori dalle barre coordinate in apertura, trascinamento e resize. Attendere attestazione QA GIS-LEGENDS-NO-OVERLAP-COORD-BARS-A PASS operatore prima della chiusura Regola H. WU-0018 non riaperta. |
| **RICHIESTE CHAT49 ANCORA APERTE** | P1/P2/P3 CLOSED. P0 secondario APERTO / APPLICATION_AUTHORIZED_NOT_EXECUTED: copie qualificate, autorizzazione acquisita; controllo dell’archivio interno richiesto non disponibile, backup corrente atteso e inventario istanze scriventi incompleto. Caricamento operatore già confermato; archivio interno non identificato e backup completo origine non attestato. Compatibilità mobile/iPad riaperta; P4 SOLO FUTURO. |
| **BACKLOG OPERATORE 16/11** | [Backlog originale](orchestrator/backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md) - [Audit P2](orchestrator/evidence/2026-11-18-table-uniformity-p2-audit/AUDIT.md) - [Matrice P2 finale](orchestrator/evidence/2026-11-18-all-remaining-p2-316/MATRIX.md). P2/P3 CLOSED; [P0 recupero qualificato sulle copie](orchestrator/evidence/2026-11-21-edge-owned-roundtrip/REPORT.md); P4 FUTURO. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | Quote importate originali conservate e non sovrascritte; lacune completabili in addon terrainFill separato, DTM locale 5m o Open-Meteo GLO-90 90m con opt-in. Stime non esportate come quote originali; nessun dislivello totale misto né pendenza tra fonti diverse. Accuratezza DTM5/10m HOLD. |
| **SVILUPPO TELEFONO** | Build324 ABQA HTTPS LIVE 108/108 PASS, viewport emulati desktop1440/tablet768/phone390/phone320; resize/orientamento e drag touch verificati. Nessuna certificazione universale o di device fisici. |
| **ACCESSO / DEPLOY** | Build324 LIVE; backup Build323 /var/backups/goi-gis-runtime/prebuild324-FXSQb9US verificato; goi-gis-app active; HTTP primo tentativo ERR in avvio, retry200 PASS e HTTPS200 PASS, 11.356.016 byte e SHA 78d8acb4a549ab60e4d44fd798240b57b0617bf0964a7e93700db12dab90ebbf concordi. [Apri Build324](https://ionos-n8n-new.tailc01234.ts.net/gis?v=78d8acb4). QA operatore PENDING. |
| **EVIDENCE** | [Build324 LIVE QA](orchestrator/evidence/2026-11-24-legends-coordinate-exclusion-324/REPORT.md) - [evidence](orchestrator/evidence/2026-11-24-legends-coordinate-exclusion-324/evidence.json) - [Review](orchestrator/evidence/2026-11-24-legends-coordinate-exclusion-324/REVIEW.md) - [QA323 CLOSED](orchestrator/evidence/2026-11-24-qa323-t2-closure/REPORT.md). |

## Build324 — deploy e ABQA LIVE PASS, operatore PENDING (24 novembre 2026)

GIS-LEGENDS-NO-OVERLAP-COORD-BARS-A; candidato108/108, review19/19, deploy tecnico e ABQA LIVE108/108 PASS. [Build324 LIVE QA](orchestrator/evidence/2026-11-24-legends-coordinate-exclusion-324/REPORT.md) - [evidence](orchestrator/evidence/2026-11-24-legends-coordinate-exclusion-324/evidence.json). Nessun PASS operatore o FINITO attribuito. Build323 ultimo CLOSED.

## Build323 T2 — QA operatore PASS / CLOSED (24/11/2026)

Attestazione QA MAP-FRACTIONAL-ZOOM-A-T2 PASS operatore acquisita; Regola H docs-only. T2 e parent fractional zoom CLOSED nel perimetro qualificato; runtime invariato. [QA323 CLOSED](orchestrator/evidence/2026-11-24-qa323-t2-closure/REPORT.md) - [attestazione](orchestrator/evidence/2026-11-24-qa323-t2-closure/evidence.json). NEXT: GIS-LEGENDS-NO-OVERLAP-COORD-BARS-A audit; nessun nuovo candidato.

## MAP-FRACTIONAL-ZOOM-A T2 — audit preliminare zoom finale persistente (23 novembre 2026)

Sorgente Build322 T1 verificato per hash; `renderTileMap` e restore arrotondano `state.mapZoom`, mentre la matematica Web Mercator ammette zoom reale. Simulazione proposta `viewZ/tileZ` **6.048/6.048 PASS matematica pura**, non QA runtime. [Audit e limiti](orchestrator/evidence/2026-11-23-fractional-zoom-t2-audit/REPORT.md) · [evidenza](orchestrator/evidence/2026-11-23-fractional-zoom-t2-audit/evidence.json). **T2 IMPLEMENTATION NOT OPENED**, Build322 T1 ultimo CLOSED, parent `MAP-FRACTIONAL-ZOOM-A` ancora OPEN; NEXT contratto DELICATO.

## Build322 T1 — QA operatore PASS / CLOSED (23 novembre 2026)

Attestazione esatta ricevuta: `QA MAP-FRACTIONAL-ZOOM-A-T1 PASS operatore`. Chiusura docs-only con **Regola H** sul runtime Build322 invariato: deploy tecnico PASS, review GPT-sostitutiva 18/18, ABQA HTTPS LIVE 78/78 aggregata, QA operatore PASS. [Rapporto di chiusura](orchestrator/evidence/2026-11-23-qa322-t1-closure/REPORT.md) · [evidenza](orchestrator/evidence/2026-11-23-qa322-t1-closure/evidence.json). Operatore non ha indicato device/browser/ora esatta della prova. **T1 CLOSED, parent `MAP-FRACTIONAL-ZOOM-A` NON CLOSED**: zoom finale persistente frazionario resta distinto. NEXT audit T2 on-demand, P0 non applicato e DTM HOLD.

## Storico — Build322 T1 ABQA LIVE aggregata PASS, QA operatore allora PENDING (23 novembre 2026)

R1 desktop1440 e phone320 COMPLETED, R5 tablet768 19/19 PASS, R6 phone390 19/19 PASS: **78/78 verifiche aggregate** sulla stessa Build322 HTTPS LIVE. I precedenti R1 FAIL e R2/R3/R4 STOP sono conservati; nessun nuovo deploy/runtime. R5/R6 lasciano il documento HTTPS principale fuori dall'intercettazione di debug e bloccano le richieste secondarie osservate. [Rapporto QA](orchestrator/evidence/2026-11-23-build322-live-qa-aggregation/REPORT.md) · [evidenza](orchestrator/evidence/2026-11-23-build322-live-qa-aggregation/evidence.json). **QA OPERATORE PENDING, FINITO non innescato.** Build321 ultimo CLOSED; parent `MAP-FRACTIONAL-ZOOM-A` non CLOSED.

## Storico — Build322 T1 LIVE, QA browser HTTPS inizialmente bloccata (23 novembre 2026)

`MAP-FRACTIONAL-ZOOM-A-T1` DELICATO: source `e707870b7f0b550f2e4ccf61af498e7dd480b8f6`, SHA256 `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c`, **DEPLOY_TECHNICAL_PASS** con backup verificato, HTTP/HTTPS200 e corpo identico; **QA browser LIVE BLOCKED** su tablet768/phone390 per stream HTTPS incompleto. Statici17/17, candidato78/78 e REVIEW GPT-SOSTITUTIVA18/18 PASS conservati nel proprio perimetro, non sostituiscono LIVE. [Rapporto](orchestrator/evidence/2026-11-23-wheel-preview-322/REPORT.md) · [evidenza](orchestrator/evidence/2026-11-23-wheel-preview-322/evidence.json). **QA operatore PENDING, FINITO non innescato.** Build321 ultimo CLOSED; P0 autorizzato non applicato.

## Storico — Build322 T1 candidata, review PASS prima del deploy (23 novembre 2026)

Source e707870b7f0b550f2e4ccf61af498e7dd480b8f6, SHA256 c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c. Statici17/17 e candidato browser78/78 PASS con STOP intermedi CSSOM conservati. [REVIEW GPT-SOSTITUTIVA PASS](orchestrator/evidence/2026-11-23-wheel-preview-322/REVIEW.md) sul raw SHA-pinned; esterna post-hoc PENDING. **DEPLOY NON ANCORA ESEGUITO**; Build321 ultimo LIVE/CLOSED. NEXT: preflight/backup/deploy GIS-only e ABQA HTTPS LIVE; non dichiarare T1 frazionario persistente.

## MAP-FRACTIONAL-ZOOM-A — contratto T1 wheel preview (23 novembre 2026)

Definito [contratto DELICATO](orchestrator/evidence/2026-11-23-map-fractional-wheel-preview-contract/CONTRACT.md): animazione temporanea wheel raster con camera/zoom canonici invariati fino al commit intero, cleanup a redraw/pan/touch, hit-test e rete invariati. **CONTRACT_READY / IMPLEMENTATION_NOT_OPENED**; zoom frazionario persistente fuori da T1. Nessun runtime cambiato.

## MAP-FRACTIONAL-ZOOM-A — audit preliminare (23 novembre 2026)

Audit della Build321 in sola lettura: zoom tile intero, wheel a passi ±1, pinch con anteprima continua e commit finale arrotondato, potenziale accoppiamento con cache-pan e hit-test. [Rapporto](orchestrator/evidence/2026-11-23-map-fractional-zoom-audit/REPORT.md). **Solo audit; nessuna implementazione, nuova candidata, QA o deploy.** NEXT: contratto DELICATO per intervento scoped, Build321 resta ultimo CLOSED.

## Build321 — QA operatore PASS / CLOSED (23 novembre 2026)

Ricevuta l’attestazione esatta `QA MAP-TARGET-SCALE-A PASS operatore`. Chiusura Regola H esclusivamente documentale: runtime Build321 invariato, deploy tecnico PASS, statici77/77, browser candidato45/45 e LIVE HTTPS45/45 PASS già acquisiti; nessun nuovo test, deploy o accesso all’archivio operatore. [Rapporto QA321](orchestrator/evidence/2026-11-23-qa321-closure/REPORT.md) · [evidenza strutturata](orchestrator/evidence/2026-11-23-qa321-closure/evidence.json). Browser, dispositivo e ora esatta dell’esecuzione umana non comunicati; compatibilità universale non attestata. NEXT: audit mirato del backlog `MAP-FRACTIONAL-ZOOM-A`; P0 autorizzato non applicato, DTM HOLD, P4 FUTURO.

## Storico — Build321 LIVE, QA browser PASS, operatore allora PENDING (23 novembre 2026)

Il blocco ROUTINE `MAP-TARGET-SCALE-A` è distribuito sulla Build321 dal source `64522d52d102cdd0bcd89f4b671b65dc0ba8e9b2` (SHA256 `96c2c34eec74f43a1dbc636620d6e54989529d53213e58f31edd2d56203dd971`, 11.345.158 byte). Campo 1:N, zoom intero più vicino, feedback esplicito della scala effettivamente ottenuta; nessun nuovo storage/endpoint o modifica a geolocalizzazione. Candidato statico 77/77 e browser 45/45; deploy GIS-only tecnico PASS con backup; LIVE HTTPS browser 45/45 PASS su Edge158 in viewport desktop1440/phone390/320 emulati. Due ricevute LIVE di driver STOP conservate separatamente, corretto solo l’oracolo temporale al reload. [Rapporto e limiti](orchestrator/evidence/2026-11-23-map-target-scale-321/REPORT.md), [evidenza](orchestrator/evidence/2026-11-23-map-target-scale-321/evidence.json). **QA operatore PENDING, FINITO non innescato.** Build320 resta ultimo CLOSED, P0 autorizzato non applicato; DTM5/10m HOLD, P4 FUTURO.

## Build320 — QA operatore PASS / CLOSED (22 novembre 2026)

Acquisita l’attestazione esatta `QA MAP-PAN-TILE-OVERSCAN-A PASS operatore`. Chiusura docs-only Regola H: runtime Build320 invariato, QA browser LIVE R6 desktop35/35 + R7 phone35/35 aggregata 70/70 PASS e deploy/review già acquisite. [Ricevuta](orchestrator/evidence/2026-11-22-qa320-closure/REPORT.md) · [dati](orchestrator/evidence/2026-11-22-qa320-closure/evidence.json). Dispositivo, browser e ora della QA umana non specificati. Prosecuzione backlog autorizzata; P0 non applicato, DTM HOLD, P4 FUTURO.

## Storico — Build320 ABQA LIVE aggregata PASS, QA operatore allora PENDING (22 novembre 2026)

Revisione documentale delle ricevute originali sul medesimo SHA runtime: R6 desktop1440 **35/35 PASS**; R6 phone390 STOP tecnico conservato; R7 phone390 residuo **35/35 PASS**. Aggregazione fail-closed **70/70**, due casi distinti, artefatti locali confrontati per byte e SHA-256, nessun nuovo test/deploy/runtime. [Rapporto e limiti](orchestrator/evidence/2026-11-22-build320-live-qa-aggregation/REPORT.md) · [risultato strutturato](orchestrator/evidence/2026-11-22-build320-live-qa-aggregation/evidence.json).

QA browser LIVE nel perimetro Edge158, desktop1440 e phone390 emulato **PASS tecnico aggregato**. TLS 1.3 via trust store locale con issuer ESET SSL Filter CA, nessun bypass, upstream non attestato in modo indipendente. Dispositivi fisici, altri browser e copertura 100% pixel non attestati. QA operatore **PENDING**; Build320 resta aperta; FINITO non innescato. Prossimo gate: collaudo umano breve secondo OM §4 D2/D2bis; su attestazione PASS esatta si applica H. P0 secondario non eseguito.

## Storico — Build320 LIVE, browser HTTPS bloccato prima dell’aggregazione (22 novembre 2026)

MAP-PAN-TILE-OVERSCAN-A distribuito come DELICATO / STANDARD_RUNTIME_BUNDLE. Preparazione cache-only, decodifica e trasferimento dei nodi pronti mantengono coerente la scena nel perimetro candidato qualificato; il bypass di budget al pan ordinario resta fuori dalla prova di continuità da cache. [Dossier](orchestrator/evidence/2026-11-22-pan-tile-overscan-320/REPORT.md) ed [evidenze](orchestrator/evidence/2026-11-22-pan-tile-overscan-320/evidence.json).

GO candidato aggregato e REVIEW GPT-SOSTITUTIVA PASS sullo stesso runtime, con ricevute originali FAIL/STOP e chiusure supplementari conservate separatamente, incluso il supplemento mirato 49/49 PASS. Non viene ricostruito un punteggio complessivo sommando prove ripetute. Deploy tecnico PASS alle 15:53 UTC; HTTP/HTTPS 200 e corpo/hash concordi. Anche il GET binario HTTPS dal client delle 16:01:58 UTC restituisce il runtime completo atteso, senza costituire un collaudo browser.

Il browser LIVE si arresta prima della UI: nella richiesta principale osservata `responseStatusCode=null` e `responseErrorReason=Failed`; zero controlli prodotto eseguiti. Il successivo `net::ERR_ABORTED` è registrato dopo il fatal stop e durante la chiusura posseduta (`afterFatalStop=true`, `duringOwnedShutdown=true`), quindi non è attribuito come causa del blocco iniziale.

Stato DEPLOY_TECHNICAL_PASS / AUTOMATED_BROWSER_QA_BLOCKED_HTTPS_ADMISSION / QA_OPERATORE_PENDING; FINITO non innescato. NEXT: risolvere e qualificare l’accesso HTTPS del browser QA senza allentare boundary A o TLS, poi eseguire la QA prodotto LIVE; la QA operatore segue soltanto il PASS browser. Build319 resta l’ultimo blocco chiuso. P0 aperto/autorizzato/non applicato, DTM HOLD e P4 FUTURO invariati.

## Build319 — QA operatore PASS, blocco CLOSED (22 novembre 2026)

Ricevuta l’attestazione esatta `QA MAP-RIGHT-TOOLBAR-TOOLTIPS-A PASS operatore`. Il blocco è CLOSED / QA_OPERATORE_PASS; [ricevuta](orchestrator/evidence/2026-11-22-qa319-closure/REPORT.md) ed [evidenza strutturata](orchestrator/evidence/2026-11-22-qa319-closure/evidence.json). Dispositivo, browser e ora del collaudo umano non specificati.

Candidato 196/196 e LIVE HTTPS reale 112/112 PASS già acquisiti e riusati; runtime319 invariato, nessun nuovo test o deploy. La sezione di rilascio seguente conserva il precedente gate umano pendente. Prosecuzione del backlog operativo già autorizzata, con audit della prima voce mappa in corso; nessuna WU attiva o candidato320 aperto. P0 aperto/autorizzato/non applicato, DTM HOLD e P4 FUTURO invariati.

## Build319 — tooltip LIVE, QA operatore pendente (22 novembre 2026)

Voce MAP-RIGHT-TOOLBAR-TOOLTIPS-A aperta dal backlog operativo e distribuita come bundle ROUTINE. R1 STOP del collaudo; R2 FAIL reale sul focus durante autoscroll, corretto nell’helper; R3 FAIL dell’oracle display:contents, corretto nel solo driver. R4 finale candidato 196/196 e LIVE HTTPS reale 112/112 PASS; runtime finale invariato fra R3 e R4. [Rapporto](orchestrator/evidence/2026-11-22-toolbar-tooltips-319/REPORT.md) e [ricevute](orchestrator/evidence/2026-11-22-toolbar-tooltips-319/evidence.json).

Stato DEPLOY_TECHNICAL_PASS / AUTOMATED_BROWSER_QA_PASS / QA_FINALE_CHATGPT_PENDING; nessuna chiusura319 attribuita. Dopo QA operatore, proseguire il backlog operativo. Build318 resta l’ultimo blocco chiuso; P0 aperto/autorizzato/non applicato, DTM HOLD e P4 FUTURO invariati.

## Build318 — QA operatore PASS, blocco CLOSED (22 novembre 2026)

Ricevuta l’attestazione esatta `QA GIS-RESPONSIVE-TOUCH-ACCESSIBILITY-A PASS operatore`. Il blocco è CLOSED; [ricevuta e limiti](orchestrator/evidence/2026-11-22-qa318-closure/REPORT.md), [evidenza strutturata](orchestrator/evidence/2026-11-22-qa318-closure/evidence.json). Dispositivo e browser del collaudo umano non specificati.

Chiusura documentale secondo OM §4 Regola H: runtime Build318 invariato, nessun nuovo test o deploy. Restano acquisite le prove candidato 6/6 e LIVE HTTPS 3/3; nessuna estensione della qualifica agli ambienti non provati. Nessun successivo bundle runtime già determinato. P0 resta aperto e autorizzato/non applicato, P4 FUTURO, DTM5/10m HOLD.

## Build318 — touch/accessibilità LIVE, QA operatore pendente (22 novembre 2026)

Bundle ROUTINE GIS-RESPONSIVE-TOUCH-ACCESSIBILITY-A distribuito: menu Esporta corretto fino a 480 px e nomi accessibili per quattro tab. Candidato 6/6 e LIVE HTTPS reale 3/3 PASS nell’ambiente Edge157 con viewport emulati; limiti e ricevute nel [rapporto318](orchestrator/evidence/2026-11-22-responsive-touch-318/REPORT.md) e nelle [evidenze](orchestrator/evidence/2026-11-22-responsive-touch-318/evidence.json).

Stato DEPLOY_TECHNICAL_PASS / AUTOMATED_BROWSER_QA_PASS / QA_FINALE_CHATGPT_PENDING; nessun PASS operatore o FINITO. La direttiva di procedere con la prossima versione mantiene P0 aperto, autorizzato e non eseguito come lavoro secondario, senza bloccare questo bundle. P3 resta l’ultimo blocco chiuso; P4 FUTURO, DTM5/10m HOLD.

## P0 — caricamento confermato; controllo browser non disponibile (22 novembre 2026)

L’operatore dichiara «si carica perfettamente» per il collegamento GIS nel browser interno. Questo riscontro supera l’attesa della prova manuale di caricamento, senza attestare il contenuto dell’archivio o la capacità dell’agente di controllare quella scheda. La ricognizione CUA mostra Chrome/CDP senza schede; lo strumento Browser richiede il contesto browser d’origine. [Rapporto](orchestrator/evidence/2026-11-22-internal-browser-operator-access/REPORT.md) e [evidenze](orchestrator/evidence/2026-11-22-internal-browser-operator-access/evidence.json).

Il gate corrente riguarda quindi il controllo della scheda richiesta. L’errore HTTP2 e il rifiuto della URL policy restano storico del pass precedente. Nessuna lettura storage, backup corrente, package reale o scrittura di recupero in questo pass. Autorizzazione, qualificazione delle copie e 21/21 verifiche dell’helper restano acquisite; non vanno ripetute. Build317/P3 CLOSED invariati.

## P0 — applicazione autorizzata; accesso interno bloccato (21–22 novembre 2026)

L’operatore ha autorizzato l’aggiunta della sola traccia HTTP di 11 punti e dei 200 waypoint all’archivio HTTPS, preservando tutti i dati presenti. Ha poi richiesto: «fallo qui sul browser interno». L’autorizzazione resta acquisita; non va richiesta nuovamente. [Rapporto corrente](orchestrator/evidence/2026-11-21-selective-recovery-application/REPORT.md) e [evidenze](orchestrator/evidence/2026-11-21-selective-recovery-application/evidence.json).

Preparatore/applicatore revisionato (577b1da…; 30.813 byte), nuovo delta sintetico 21/21 PASS. Riusa le qualifiche precedenti, conserva i dati HTTPS correnti, tratta idempotenza/collisioni e limita la scrittura al main. Package privato locale e bootstrap pubblico via FileReader evitano il payload negli appunti/console. La verifica immediata dello storage non è una transazione fra schede: resta richiesto il controllo operativo delle istanze prima del commit. Nessuna nuova esecuzione del runtime o della QA da 151 casi.

L’inventario UI nativo è rimasto incompleto perché schede e titoli cambiavano durante i controlli; nessuna quiescenza è stata attestata e nessun comando JavaScript di recupero è stato eseguito. Dopo la direttiva dell’operatore si è passati al browser interno disponibile (Chrome/CDP). L’apertura della pagina HTTPS neutra nota ha restituito ERR_HTTP2_PROTOCOL_ERROR. Il successivo tentativo di osservare la pagina d’errore è stato rifiutato dalla URL security policy, che non ha autorizzato il protocollo della pagina. Sono fatti distinti; non dimostrano una causa specifica di rete, Tailscale o VPS. Nessun aggiramento tentato.

Stato effettivo: APPLICATION_AUTHORIZED_NOT_EXECUTED. Backup aggiornati non acquisiti, planner reale non eseguito, package applicativo reale non generato e zero scritture di recupero. Serve prima accesso riuscito nel browser richiesto; andrà poi identificato l’archivio effettivo, senza presumere che coincida con quello Edge. Restano acquisiti il PASS sulle copie, lo strumento già qualificato e l’autorizzazione: non ripetere tali gate.

Build317/P3 CLOSED e requisito di portabilità desktop/mobile/iPad invariati; DTM5/10m HOLD, P4 FUTURO. Le sezioni seguenti sono storico: l’attesa di autorizzazione applicativa che vi compare è superata.

## P0 — recupero qualificato sulle copie; portabilità riaffermata (21 novembre 2026)

L’operatore ha accettato A e riaffermato il requisito del GIS come applicazione web utilizzabile su Windows, macOS, browser desktop, smartphone e iPad. Edge è l’infrastruttura del collaudo corrente: versione e catalogo identificano la prova riproducibile, non requisiti di utilizzo del prodotto né approvazioni da chiedere per ogni futuro computer/browser. La precedente pausa mobile è superata per questo lavoro di compatibilità; nessun PASS universale viene dedotto.

[Rapporto corrente](orchestrator/evidence/2026-11-21-edge-owned-roundtrip/REPORT.md) e [evidenze complete](orchestrator/evidence/2026-11-21-edge-owned-roundtrip/evidence.json). Delta dello strumento revisionato, unico pilot sintetico completato alle 22:11:28.290–22:11:32.415 UTC. Il gate tecnico del driver è PASS entro A; la deriva iniziale della fixture resta distinta dalla conservazione dei dati reali.

Unico roundtrip sulle copie private alle 22:13:29.493–22:13:34.839 UTC: due bracci, quattro fasi ciascuno (boot, save1, reload, save2), zero errori JavaScript, target inattesi o dialoghi. Tutte le 5 tracce HTTPS di controllo e tutte le 6 tracce/200 waypoint del candidato sono strutturalmente identici ai rispettivi input in ogni fase. La traccia HTTP aggiunta conserva i suoi 11 punti; tutte le coppie LocalStorage sono stabili da save1 a reload/save2. Input originali verificati invariati; browser propri chiusi.

Classificazione offline degli snapshot già acquisiti alle 22:24:06.150 UTC, exit0: in entrambi i bracci sono aggiunte esattamente 18 preferenze delle tabelle, con tutti i 40 campi settings preesistenti conservati e i 58 risultanti identici fra i bracci. Nel candidato cambia soltanto l’indice gisLayers.featureIds del layer waypoint, ricostruito in corrispondenza esatta con gli ID canonici di state.mapWaypoints[], nello stesso ordine. Altre proprietà dei layer e del main preservate; zero differenze sconosciute. Tutte le derive osservate sono spiegate; i flag di uguaglianza raw dell’intero archivio restano correttamente false. Nessun nuovo browser o runtime avviato per questa classificazione.

Esito: COPY_RECOVERY_QUALIFIED per questi snapshot e questa selezione; candidato ancora NON APPLICATO. L’eventuale passaggio all’archivio HTTPS originale richiede scope applicativo, verifica di attualità, backup aggiornato e controllo collisioni prima della scrittura. I residui fisici ACCESS_DENIED non sono stati ritentati e il backup completo dell’origine resta non attestato. Il controllo mirato del codice non ha rilevato vincoli espliciti Edge/Windows nei contesti acquisiti; non certifica tutte le API o tutti i browser.

Build317 e P3 CLOSED restano invariati. DTM5/10m HOLD e P4 FUTURO. Le sezioni seguenti conservano lo storico; la decisione A/B e la pausa mobile che vi compaiono sono superate dalle direttive correnti.

## P0 — catalogo e percorsi acquisiti; decisione sull’ambiente di prova (21 novembre 2026)

[Rapporto corrente](orchestrator/evidence/2026-11-21-driver-isolation-qualification/REPORT.md) e [evidenze](orchestrator/evidence/2026-11-21-driver-isolation-qualification/evidence.json). Prerequisito sessione 20:58:42 UTC: PC disponibile, Edge 157.0.4341.60 e Node26.8.1. Una sola osservazione browser nuova alle 21:17:53.728–21:17:55.115 UTC, senza GIS/runtime/seed: la superficie interna restituisce 10 record dichiarati COMPONENT. I 7 target EXTENSION correnti sono riconciliati univocamente in ciascuno snapshot prima/dopo (3 service_worker e 4 background_page, zero mancanti/ambigui); conteggi uguali non provano identità temporale. Le 57 voci API active e 5 voci explicit_hosts sono totali aggregati, non capacità distinte o identità di host. Catalogo e target completi restano sul PC; browser proprio chiuso.

Una sola lettura offline del catalogo acquisito alle 21:31:27.588–21:31:28.013 UTC: 10 percorsi lessicalmente sotto la versione157, 13 nodi deduplicati previsti, 2 con riscontro OK e un antenato comune NOT_FOUND (Win32=2, Node ENOENT/-4058). Il guard blocca i 10 discendenti: lstat/realpath NOT_ATTEMPTED, non dieci errori ENOENT. Nessun accesso negato o reparse osservato sui soli nodi interrogati; input invariato. Il modello di risorse integrate delle primarie è compatibile, ma virtualità e associazione dei10record al bundle Edge non sono provate. Incognito effettivo, policy, manifest completo e firme non attestati. Le due procedure terminano con exit0 e REQUIRES_ASSESSMENT; non è PASS del driver o dei dati.

Gate effettivo WAIT_TRUST_BOUNDARY_DECISION, con DRIVER_ISOLATION_NOT_QUALIFIED. A: includere Edge posseduto e componenti del catalogo acquisito per la versione osservata nel browser fidato, quale criterio operativo accettato; non ammette automaticamente componenti futuri o proprietà non osservate. B: definire un ambiente separato, senza installazioni/disabilitazioni presunte. Dopo la scelta valgono review/delta/pilot e gate tecnici; le prove sulle copie già nel mandato non richiedono nuove conferme dopo i PASS previsti. Applicazione agli origin esclusa.

Candidato dati 2cbf48… ancora PREPARED_NOT_APPLIED; nessun pilot GIS, roundtrip privato, QA151 ripetuta, modifica runtime/estensioni/policy/protezioni o nuovo deploy. Residui fisici ACCESS_DENIED del pass precedente non ritentati; backup completo origine non attestato. Build317/P3 CLOSED invariati. Le sezioni successive conservano lo storico.

## P0 — candidato preparato; gate del driver fallito (21 novembre 2026)

[Rapporto corrente](orchestrator/evidence/2026-11-21-selective-recovery-roundtrip/REPORT.md) e [ricevute aggregate](orchestrator/evidence/2026-11-21-selective-recovery-roundtrip/evidence.json). Alle 14:08:44.560 UTC è stato creato e verificato sul PC il candidato dati: 6 tracce e 200 waypoint, 417.285 byte, SHA256 2cbf48cea7f6baef931018185f031d244f56ba9223924f0cda567c0c983bf865. Aggiunge soltanto la traccia HTTP di 11 punti e i 200 waypoint alla copia HTTPS. Record, ordine, tipi, valori e assenze conservati; altre 12 proprietà main strutturalmente identiche, altra chiave LocalStorage raw identica, input originali invariati. Il main può differire nella formattazione. Stato PREPARED_NOT_APPLIED; nessuna readiness applicativa attribuita.

Review statica indipendente del nuovo driver PASS, ma unico pilot sintetico alle 14:15:35–14:15:36 UTC STOP per UNEXPECTED_TARGET: 0 documenti GIS serviti, seed non confermato, input esclusivamente sintetici. Il valore 12 conta eventi misti, non target unici; il flag post-ack non prova che il comando seed non sia stato trasmesso. Controllo HTTPS e candidato reali NON eseguiti. La suite QA317 da 151 casi non è stata ripetuta.

Una sola diagnostica vuota alle 14:21:08.904–14:21:10.243 UTC: primo inatteso ATTACHED/tab/ABOUT_BLANK, target diverso dalla page selezionata nello stesso browserContext, osservato in AUTOATTACH. Inventario iniziale 3 service_worker EXTENSION, 4 background_page EXTENSION e 1 page selezionata; 9 eventi fino allo STOP. Non dimostra compromissione, provenienza delle estensioni, relazione tab/page o causa di tutti i 12 eventi precedenti. Nessun input, runtime, seed, evaluate o navigazione richiesti nella diagnostica. Browser propri chiusi con exit0; script STOP con exit2; profili e artefatti conservati.

Gate effettivo DRIVER_ISOLATION_NOT_QUALIFIED: qualificare lo strumento preservando le protezioni, poi i due bracci su copie soltanto dopo gate PASS. Nessuna applicazione/migrazione/pulizia, modifica permessi/estensioni, runtime o deploy. Restano quattro contenitori logici e cinque snapshot distinti/non atomici; residui ACCESS_DENIED e backup completo origine non attestato. Build317/P3 CLOSED invariati. Le sezioni successive sono storico dei pass precedenti.

## P0 — attualità, copia HTTP aggiornata e recupero da qualificare (21 novembre 2026)

[Rapporto corrente](orchestrator/evidence/2026-11-21-http-recovery-preparation/REPORT.md). Sonde reali alle 13:05–13:06 UTC: HTTPS LocalStorage/IDB e HTTP IDB coincidono con i backup; HTTP LocalStorage differisce. Nuovo snapshot HTTP 13:08:01.748 UTC, verificato/copiato alle 13:11:08.056 UTC, 36.618 byte/2 chiavi, SHA256 31f21f40771c9114fa15b62bb58740508367b5c3941a947d7b2809f1a0ba04a0. Copia precedente conservata; cinque acquisizioni distinte per quattro contenitori logici, non atomiche.

Audit locale 13:16:27.791 UTC: differenza HTTP limitata a settings; traccia/waypoint e chiave UI identici allo snapshot precedente. Proposta selettiva: 6 tracce e 200 waypoint totali entro i cap, zero collisioni fra ID tracce/waypoint delle origini. Classificazione mirata conclusa alle 13:29:47 UTC: i 396 campi data sono assenti, gli 11 meta dei punti HTTP sono null, l’unico ID punto ripetuto è nelle tracce HTTPS preesistenti. Gli indicatori conservativi del referto originale BLOCKED non dimostrano corruzione/perdite HTTP. Compatibilità completa del caricamento/salvataggio non attestata, nessun candidato dati creato.

Profilo Edge Default identificato dalla UI. Cataloghi fisici residui: ACCESS_DENIED(5) alle 12:57:22 UTC prima dei byte; nessuna mappatura completa o modifica permessi. Proposta e gate nel rapporto: definire trattamento HTTP, qualificare compatibilità su copie e risolvere copertura residua per l’azione prevista. Nessuna migrazione/pulizia autorizzata; runtime Build317, P3 CLOSED e vincoli invariati. Le sezioni successive sono storico dei pass precedenti.

## P0 — quattro backup e confronto completati; residui parziali (21 novembre 2026)

Nuovo IndexedDB HTTPS: snapshot 02:53:25.362 UTC, verifica nativa 02:58:10.144 UTC, 315 record/7.984.081 byte binari, file e copia PASS; [ricevuta](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/https-indexeddb-verification.json). Il vecchio download risultava «Rimossi» nella UI Edge; nuova esecuzione qualificata su pagina neutra tramite TMAR UIAutomation/Win32 e conferma Salva. Quattro backup logici acquisiti in snapshot distinti; nessun backup completo dell’origine.

[Confronto nativo](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/origin-comparison.json) alle 03:10:33.587 UTC, risultato COMPARED e controlli input tutti true: due chiavi Local Storage per origine, entrambe raw diverse; tracce salvate 1 HTTP/5 HTTPS senza occorrenze strutturali esatte comuni; waypoint 200/0. IndexedDB 1.028/315 record, 1.343 chiavi nell’unione e nessuna chiave comune. Non sono attestate identità funzionale, equivalenza geografica o equivalenza di tile con chiavi diverse. ExitCode Node non attestato dal trasporto; output completo acquisito, wrapper proprio chiuso dopo guard, nessuna ripetizione.

Residui HTTPS 03:08 UTC e HTTP 03:09:51 UTC: inventario di soli metadati PARTIAL. Cache/SW HTTPS zero; HTTP UNAVAILABLE/null. Sessione e cookie hanno coperture limitate; OPFS/legacy/WebSQL NOT_INSPECTED/null. Nessuna attestazione di immutabilità dei valori correnti rispetto ai quattro backup. [Rapporto e limiti](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md). Gate reale: decisione sul trattamento dei dati HTTP, con verifica di attualità e copertura residui prima di qualsiasi azione; migrazione/pulizia bloccate. Le sezioni successive conservano i passaggi storici e i relativi gate.

## P0 — TMAR ripristinato; download IndexedDB HTTPS da localizzare (21 novembre 2026)

La ricevuta operatore del 20/11 alle 16:56:09.715 UTC dichiara 315 tile HTTPS, 7.984.081 byte binari e JSON da 10.695.152 byte. Il primo tentativo nativo era rimasto non attestato per Session terminated. Il 21/11 TMAR risponde su ASUSDESKTOP, ma il verifier qualificato si arresta a SOURCE_READ/LOCAL_OPERATION_FAILED. Nessun nome col timestamp atteso nella cartella Download; le preferenze dei browser per percorsi alternativi sono ACCESS_DENIED. Non dedurre cancellazione, assenza altrove o completamento del download. File/copia HTTPS IDB NON VERIFICATI; tre evidenze di backup precedenti preservate. [Esiti e perimetro](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/https-indexeddb-verification-blocked.json). NEXT: percorso locale o stato dalla lista download del browser; nessuna modifica permessi, migrazione, pulizia o nuova QA runtime.

## P0 — Local Storage HTTPS verificato; IndexedDB HTTPS pendente (20 novembre 2026)

Snapshot HTTPS del 20/11 alle 12:02:48.832 UTC, verifica TMAR alle 12:04:06.585 UTC: 388.370 byte, 2 chiavi, SHA256 e copia byte per byte PASS. Chiave principale JSON valida: 5 tracce salvate, 0 waypoint, 0 poligoni e impostazioni presenti; UI inclusa. [Ricevuta metadata](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/https-localstorage-verification.json). Il precedente snapshot HTTP aveva 1 traccia e 200 waypoint: confronto limitato ai conteggi, identità e contenuti dei singoli record ancora da confrontare. Tre acquisizioni separate, nessuno snapshot atomico né backup completo origine attestato. Prossimo gate IndexedDB HTTPS, poi contenitori residui e confronto; nessuna migrazione o pulizia. [Rapporto](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## P0 — IndexedDB HTTP verificato; acquisizione HTTPS pendente (20 novembre 2026)

Export reale del 20/11 alle 11:34:39 UTC, verificato tramite TMAR alle 11:39:51 UTC: 1.028 tile, 16.012.203 byte binari, JSON da 21.511.025 byte. SHA256 globale e di tutti i binari PASS; copia locale identica byte per byte. [Ricevuta metadata](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/http-indexeddb-verification.json). Copertura INDEXEDDB_TILES_ONLY, distinta dal Local Storage acquisito alle 02:21:03 UTC: non costituiscono uno snapshot atomico né una garanzia sulle modifiche successive. HTTPS, contenitori residui e confronto ancora da acquisire; backup completo origine non attestato. [Rapporto e prossimo comando](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## P0 — catalogo IndexedDB HTTP acquisito, export pronto (20 novembre 2026)

L’operatore attesta un solo DB HTTP: CoordConvMapTiles v1. Non ancora acquisiti schema/conteggio/contenuti delle tile personali. Predisposto un comando unico readonly con guard schema, abort upgrade e gestione connessioni tardive, seguito da export solo se completo. Review indipendenti PASS;4 test Edge nativi e14 controlli verifier su fixture PASS. Nessun runtime GIS/profilo personale usato nelle prove; download reale IDB non ancora avviato. Local Storage HTTP già verificato; HTTPS e confronto restano aperti. [Rapporto e comando](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## P0 — Local Storage HTTP verificato (20 novembre 2026)

Download e copia locale verificati sul PC: 36.618 byte, 2 chiavi, stesso SHA256 annunciato dalla Console; file e copia coincidono byte per byte. coordconv_v2 conserva 1 traccia, 200 waypoint, 0 poligoni e impostazioni; UI inclusa. Copertura LOCALSTORAGE_ONLY, nessun payload privato pubblicato. Restano catalogo/contenuti IDB, contenitori residui, HTTPS e confronto. Nessuna migrazione, pulizia, modifica runtime o QA ripetuta. [Ricevuta e gate](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## P0 — lettura HTTP attestata, backup in attesa (20 novembre 2026)

La console operatore legge coordconv_v2 sull’origine HTTP: 30.908 unità UTF-16, 1 traccia salvata, 200 waypoint, 0 poligoni e impostazioni presenti. Questi dati non coprono altre chiavi, memoria dell’app, IDB/cache o HTTPS. Copia fisica negata anche da Esplora file. Predisposto export locale LOCALSTORAGE_ONLY con SHA256, revisione statica e verifica sintetica PASS; esecuzione/download e verifica del file ancora da effettuare. P0 resta aperto; nessuna migrazione, pulizia, modifica runtime o nuova QA. [Rapporto e comando](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## P0 — metadati HTTP/HTTPS acquisiti, backup BLOCKED (19 novembre 2026)

Profilo Edge Default su AsusDesktop segnato attivo; presenti directory IDB di entrambe le origini. Nessun conteggio logico o confronto dei record acquisito. Tentativo di copia fermato prima di copiare dati: Win32 ACCESS_DENIED5 su Local Storage; Browser collegato non disponibile nella sessione. Backup INCOMPLETE, zero sorgenti copiate. Nessuna pulizia, migrazione, modifica runtime o riavvio. [Ricevuta e gate di ripresa](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## Build317 — P3 QA operatore PASS / CLOSED (19 novembre 2026)

Attestazione esatta ricevuta: `QA GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A PASS operatore`. Review sostitutiva, distribuzione verificata e QA HTTPS151/151 già acquisite; chiusura Regola H esclusivamente documentale. Nessun nuovo deploy o ripetizione QA. [Ricevuta](orchestrator/evidence/2026-11-19-qa317-p3-closure/REPORT.md). P0 resta aperto come blocco distinto; DTM5/10m HOLD, mobile PAUSA, P4 FUTURO.

## Build317 — P3 quote parziali LIVE, QA operatore PENDING (19 novembre 2026)

Riconciliata la discrepanza: il runtime Build317 era già servito mentre la tabella LIVE STATE riportava ancora Build316. Verificati source/blob/hash GitHub, file VPS, HTTP e HTTPS; backup316 presente. Nessun nuovo deploy o restart. Review predeploy e candidato151 già acquisiti; eseguita la sola QA HTTPS LIVE151, PASS. Quote originali e stime restano separate; precisione DTM5/10m HOLD. QA umana residua ancora da attestare. [Release e limiti](orchestrator/evidence/2026-11-18-partial-imported-elevation-317/RELEASE.md), [risultati LIVE](orchestrator/evidence/2026-11-18-partial-imported-elevation-317/live-qa.json).

## Build316 — P2 multi-tab LIVE, QA finale operatore PASS / CLOSED (18 novembre 2026)

Range rings, Preferiti, due picker Astro e Batch LIVE; precedenti tabelle P2 già accettate. Review DELICATO GPT-SOSTITUTIVA PASS (esterno NOT_PERFORMED), candidato e HTTPS LIVE 134/134 PASS. QA operatore finale ricevuta il 18/11/2026, [ricevuta CLOSED](orchestrator/evidence/2026-11-18-qa316-p2-final-closure/REPORT.md). [Release](orchestrator/evidence/2026-11-18-all-remaining-p2-316/RELEASE.md) e [matrice](orchestrator/evidence/2026-11-18-all-remaining-p2-316/MATRIX.md).

## Build315 — P2-B3 Aree offline LIVE / QA operatore PASS / CLOSED (18 novembre 2026)

Dieci colonne Aree offline ridimensionabili, otto sort persistiti, storage whitelist senza modifiche tile/OPSEC. REVIEW GPT-SOSTITUTIVA PASS, Edge candidato e HTTPS LIVE 98/98 PASS. P2-B4 e P2-C ancora aperti. [Release](orchestrator/evidence/2026-11-18-offline-areas-table-p2b3-315/RELEASE.md).

## Build314 — P2-B2 Poligoni LIVE, approvazione operatore / CLOSED (18 novembre 2026)

Nove colonne Poligoni ridimensionabili, ordinamento persistito, preferenze whitelisted. Interferenza del resizer Azioni col bordo esterno risolta. Review DELICATO GPT-SOSTITUTIVA PASS, candidato e HTTPS LIVE 82/82 PASS. P2-B3/B4 e P2-C APERTI. [Release](orchestrator/evidence/2026-11-18-polygon-table-p2b2-314/RELEASE.md).

## Build313 — P2-B1 Waypoint LIVE, QA operatore PASS / CLOSED (18 novembre 2026)

Sei colonne Waypoint ridimensionabili, ordinamento Nome/Data/Dettagli, preferenze persistite con whitelist; review GPT-SOSTITUTIVA PASS, Edge candidato 65/65 e HTTPS LIVE 65/65 PASS. QA operatore PASS ricevuta il 18/11/2026; [ricevuta](orchestrator/evidence/2026-11-18-qa313-p2b1-closure/REPORT.md). P2-B2/B3/B4 e P2-C ancora aperti. [Release](orchestrator/evidence/2026-11-18-waypoint-table-p2b1-313/RELEASE.md).

## Build312 — P2-A Tracce salvate LIVE, QA operatore PASS / CLOSED (18 novembre 2026)

Sette colonne ridimensionabili, preferenze persistite nella storage canonica; review GPT-SOSTITUTIVA PASS, candidato 46/46, HTTPS 46/46 PASS. QA operatore PASS 18/11/2026; [ricevuta](orchestrator/evidence/2026-11-18-qa312-p2a-closure/REPORT.md). Questo NON chiude P2 complessivo: P2-B/C rimangono aperti. [Evidenza](orchestrator/evidence/2026-11-18-saved-tracks-columns-p2a-312/RELEASE.md).

## Build311 batch archivio — LIVE, QA operatore PASS / CLOSED (18 novembre 2026)

Review GPT-SOSTITUTIVA DELICATO PASS; candidato Edge e HTTPS LIVE 30/30 PASS. La versione è distribuita sul VPS con backup310 e hash concordi. QA operatore PASS ricevuta il 18/11/2026; [ricevuta](orchestrator/evidence/2026-11-18-qa311-closure/REPORT.md). Reviewer esterno NOT_PERFORMED/backstop. [Release](orchestrator/evidence/2026-11-17-track-archive-batch-311/RELEASE.md). Il precedente [blocco dello script](orchestrator/evidence/2026-11-17-track-archive-batch-311/DEPLOY-BLOCKED.md) è storia superata dall'esito del rilascio.

## Build310 — profili altimetrici XY LIVE, QA operatore PASS / CLOSED (17 novembre 2026)

Review GPT-SOSTITUTIVA PASS, JS 2/2, 30/30 Edge candidato e 30/30 HTTPS LIVE; grafico e persistenza per tracce pennello/XY senza quote. PASS operatore acquisito il 17/11/2026; [ricevuta](orchestrator/evidence/2026-11-17-qa310-closure/REPORT.md). Open-Meteo solo opt-in, DTM locale preferito, pendenze terreno 5–10m non certificate. [Rapporto](orchestrator/evidence/2026-11-16-track-profile-xy-310/RELEASE.md).

## Build309 Centra LIVE - QA operatore PASS, CLOSED (16 novembre 2026)

FIX2 del finding operatore: Centra nella zona corrente, anche prima del salvataggio. Candidato e HTTPS nativo 17/17 PASS. [Rapporto e prove](orchestrator/evidence/2026-11-16-track-center-309/REPORT.md). PASS operatore registrato sul FIX2, senza attribuire PASS alla Build308. [Ricevuta](orchestrator/evidence/2026-11-16-qa309-closure/REPORT.md).

## Build308 single-panel - storico, superseded da Build309

Il 16 novembre l'operatore ha segnalato l'assenza del comando Centra sulla traccia corrente importata; correzione nella Build309, accettazione Build308 non acquisita.

27/27 controlli nativi HTTPS PASS, ispezione screenshot della nuova interfaccia completata. Nessuna approvazione operatore dedotta. [Release](orchestrator/evidence/2026-11-16-track-single-panel-308/RELEASE.md).

## Build307 - QA operatore NON ACCETTATA (16 novembre 2026)

Feedback e screenshot: importazione troppo confusa, apertura Oggetti GIS con categorie e waypoint estranei. Nessun PASS umano307; serve FIX UX single-panel prima di nuova QA. [Ricevuta e delta](orchestrator/evidence/2026-11-16-track-io-current-archive-307/OPERATOR-UX-NOT-ACCEPTED.md).

## Storico tecnico Build307 - prima del feedback operatore

Build307 GIS-TRACK-IO-CURRENT-ARCHIVE-A LIVE dopo review GPT-SOSTITUTIVA, deploy GIS-only e ABQA HTTPS nativa 27/27 PASS. User QA resta da acquisire; reviewer AI esterno NOT_PERFORMED/backstop. [Dossier](orchestrator/evidence/2026-11-16-track-io-current-archive-307/RELEASE.md).

## Build306: QA operatore PASS, blocco CLOSED (16 novembre 2026)

Build306 ROUTINE `GIS-TRACK-SAVE-CTA-DESKTOP-A`, Salva scopribile sul desktop. Candidate + HTTPS nativa 13/13 PASS, zero POST/JS errors; la QA umana per Build306 e stata successivamente attestata il 16/11/2026 (ricevuta nel dossier). [Dossier](orchestrator/evidence/2026-11-15-track-save-cta-desktop-306/REPORT.md).

## Chiusura operatore Build305 - 15 novembre 2026

Attestazione esatta: `QA GIS-SAVED-TRACK-IMPORT-ELEVATION-SAVE-A PASS operatore`. Secondo OM sezione 4 Regola H: review GPT sostitutiva, deploy GIS-only, ABQA HTTPS gia PASS; CLOSED docs-only. Monolite e servizi invariati, DTM terreno HOLD, QA storiche distinte, reviewer esterno NOT_PERFORMED. [Ricevuta](orchestrator/evidence/2026-11-15-chat49-handoff-305/OPERATOR-CLOSURE-305.md).

## Passaggio dalla chat49 â€” 15 novembre 2026

Il CORE BOOT iniziale riportava Build303 in FRONTIER; il successivo confronto del monolite e la verifica HTTPS/VPS hanno identificato **Build304 giÃ  LIVE**, source `938b2b3c601ae61b6c71cf806ae67119537af8aa`. Il profilo importato esistente non Ã¨ stato riscritto. Build305 corregge conservazione della singola quota, salvataggio della traccia corrente e invalidazione della quota del punto spostato.

Le prove consumate delle build precedenti non sono state ripetute. Questo pass ha usato fixture sintetiche in profili Edge temporanei, senza dati del browser personale, file GPX privati, GPS o nuove chiamate a provider. I tentativi incompleti e il candidato inizialmente fallito restano nel dossier.

## Storico e fonti on-demand

- [Checkpoint precedenti, preservati senza modifiche](FRONTIER_HISTORY_20261115.md).
- [Build303 â€” conservazione quote e QA storica](orchestrator/evidence/2026-11-15-gpx-elevation-303/REPORT.md).
- [Build302 â€” DTM bidirezionale e limiti](orchestrator/evidence/2026-11-14-local-dtm-direction-302/REPORT.md).
- [Ultimo rapporto completo](runtime/LAST_CURSOR_REPORT.md), evidenza; questa tabella prevale.
