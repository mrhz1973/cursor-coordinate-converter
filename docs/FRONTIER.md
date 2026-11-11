# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Uniformità e controlli delle finestre GIS |
| **WU ATTIVA** | — (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | `GIS-DESKTOP-RIGHT-TOOLBAR-LABELS-A-FIX1` — correzione icona Waypoint nella barra desktop |
| **STATO BLOCCO** | Build 286 LIVE. Review routine 14/14 PASS, deploy GIS-only PASS e Automated Browser QA HTTPS nativa 33/33 PASS. Blocco aperto, QA operatore desktop ancora PENDING. |
| **GATE CORRENTE** | QA OPERATORE DESKTOP per GIS-DESKTOP-RIGHT-TOOLBAR-LABELS-A-FIX1. Verificare etichette sotto i pulsanti, comandi diretti e icona Waypoint; PASS umano non ancora ricevuto. |
| **RUNTIME LIVE** | Build 286 · source 6fc34c2a614728b6acc8a9eeae6270a06427d0fe · blob abed2cd19ca6b3ec7a728345c2c1525d7f4e7be0 · SHA-256 af28f2585016c495362a5046ee9d0c4a3a75f0d27cdbf1c750807e1511b4e63c · 11.115.294 byte. Deploy GIS-only 2026-11-11 09:48:31 Europe/Rome, ABQA Edge HTTPS nativa 33/33 PASS; backup 285 nel dossier. |
| **RUNTIME CANDIDATE** | Nessun candidato successivo. Build 286 distribuita. Branch sperimentale Escape 284 distinto e non distribuito. |
| **ULTIMO BLOCCO CHIUSO** | `GIS-DFLIGHT-MINIMIZED-ESCAPE-A` · PASS operatore 2026-11-11; [chiusura](orchestrator/evidence/2026-11-11-dflight-283-operator-closure/REPORT.md). |
| **NEXT** | QA operatore desktop Build 286: 12 pulsanti destra con etichette leggibili, Poligoni e R&B apribili direttamente e icona Waypoint visibile. Se corretto: QA GIS-DESKTOP-RIGHT-TOOLBAR-LABELS-A-FIX1 PASS operatore. Solo allora chiusura Regola H e backlog desktop. Telefono in pausa. |
| **SVILUPPO TELEFONO** | **PAUSA fino a nuovo ordine dell'utente**, limitatamente a TMAR GIS Tool, dal 2026-11-10. Proseguire con il backlog desktop; la direttiva non rimuove o disabilita le funzioni mobili esistenti. [Attestazione e scope](orchestrator/evidence/2026-11-10-window-controls-281-closure/REPORT.md). |
| **FOLLOW-UP REVIEW** | Build 286 routine UI: review 14/14 PASS e ABQA HTTPS LIVE 33/33 PASS. Reviewer esterno non richiesto per il blocco routine; storico 283 backstop esterno NOT_PERFORMED. |
| **EVIDENCE** | [Toolbar FIX1 286](orchestrator/evidence/2026-11-11-desktop-right-toolbar-286/REPORT.md) · [Toolbar desktop 285](orchestrator/evidence/2026-11-11-desktop-right-toolbar-285/REPORT.md) · [D-Flight/Escape 283](orchestrator/evidence/2026-11-11-dflight-escape-283/REPORT.md) · [Rilascio finestre 281](orchestrator/evidence/2026-11-09-gis-window-controls-281/REPORT.md) · [ABQA live](orchestrator/evidence/2026-11-09-gis-window-controls-281/QA-WINDOWS-281-POSTDEPLOY.md) · [Chiusura routing 280](orchestrator/evidence/2026-11-09-routing-280-operator-closure/REPORT.md) · [Astro desktop PC lavoro](orchestrator/evidence/2026-11-10-workpc-astro-281/REPORT.md) · [Chiusura finestre 281](orchestrator/evidence/2026-11-10-window-controls-281-closure/REPORT.md) · [Preferiti/Escape 282](orchestrator/evidence/2026-11-10-favorites-escape-282/REPORT.md) |
| **VPS VERIFICATO** | IONOS `31.70.139.73`, tailnet `100.99.54.93`; HTTPS `https://ionos-n8n-new.tailc01234.ts.net/gis`. Unico restart GIS; Nginx, gateway ORS, proxy HTTPS, configurazioni/listener/endpoint condivisi preservati. Backup e journal nel rapporto deploy. |
| **ACCESSO OPERATIVO — sessione al PC del lavoro** | 2026-11-10: RDC originale sul PC DESKTOP-DPIJL64, su scelta esplicita dell'utente. Comandi, Git, HTTPS nativo e SSH dal PC al VPS realmente verificati. La sessione continua tramite RDC sul PC del lavoro; non attesta accesso indipendente dal PC. [Deploy](orchestrator/evidence/2026-11-10-favorites-escape-282/deploy/DEPLOY-RESULT-282.md). La scelta TMAR/ASUS resta [storico del 9 novembre](orchestrator/evidence/2026-11-09-vps-direct-access/TMAR-ROUTE-CORRECTION.md). |
| **ACCESSO OPERATIVO — AsusDesktop** | 2026-11-11: TMAR Desktop Commander Win 0.3.1 sul PC di casa PASS; SSH autenticato al VPS tramite alias `ionos-n8n-new` su `31.70.139.73:22` PASS; HTTPS GIS HTTP 200, SHA-256 Build 282 corrispondente. Nessuna modifica di servizi o infrastruttura. |
| **ALTRI WORKSTREAM** | Build 283 D-Flight/Escape CLOSED / PASS operatore; non attestato PASS generale 38 finestre. Ramo sperimentale Escape 284 rimane separato con tre difetti registrati; differito per nuova priorita desktop toolbar. Freeze Oggetti GIS e sviluppo telefono pausa invariati. |

## Checkpoint 2026-11-11 — Build 286 LIVE, ABQA nativa PASS

Rilascio GIS-only Build 286 source 6fc34c2a614728b6acc8a9eeae6270a06427d0fe; blob abed2cd19ca6b3ec7a728345c2c1525d7f4e7be0; SHA-256 af28f2585016c495362a5046ee9d0c4a3a75f0d27cdbf1c750807e1511b4e63c; 11.115.294 byte. Preflight, backup Build 285 (/var/backups/goi-gis-runtime/20261111T084831Z-build286), fast-forward, unico restart del servizio GIS e smoke HTTP 8000 / HTTPS /gis PASS. Nessuna modifica a Nginx, ORS, proxy o servizi condivisi.

QA HTTPS **NATIVA** in Edge/Windows su AsusDesktop, HTML reale senza sostituzione: **33/33 PASS**, quattro viewport desktop e un viewport mobile emulato, icona Waypoint SVG incorporata, pulsanti con etichette, apertura diretta Poligoni/R&B, 0 POST e 402 risorse esterne bloccate. Console e pageerror non misurati separatamente. Il 404 dell'asset esterno Waypoint desktop viene evitato; altri errori dei provider non certificati risolti.
[Deploy](orchestrator/evidence/2026-11-11-desktop-right-toolbar-286/DEPLOY-RESULT-286.md) · [ABQA](orchestrator/evidence/2026-11-11-desktop-right-toolbar-286/QA-LIVE-286.md).

Gate residuo: QA OPERATORE DESKTOP 286, PENDING. Sviluppo telefono in pausa e nessun PASS generale delle 38 finestre.

## Checkpoint 2026-11-11 — toolbar desktop 285 LIVE, finding Waypoint e candidata 286

Build 285 distribuita su VPS (preflight, backup, restart solo GIS, smoke HTTP/HTTPS PASS) e Automated Browser QA nativa: 28/28 PASS su pulsanti/etichette/click e mobile. Il controllo risorse successivo ha rilevato `assets/waypoint-map.png` HTTP **404** dall'origin HTTPS: il PNG/JPEG esiste nel repo ma non e servito dal proxy /gis. Per evitare modifiche infrastrutturali, candidata **Build 286** incorpora il simbolo Waypoint desktop con SVG inline, lasciando desktop menu/etichette e mobile invariati.

Build 286 source `6fc34c2a614728b6acc8a9eeae6270a06427d0fe`, blob `abed2cd19ca6b3ec7a728345c2c1525d7f4e7be0`, SHA256 `af28f2585016c495362a5046ee9d0c4a3a75f0d27cdbf1c750807e1511b4e63c`, 11.115.294 byte. QA candidata HTTPS iniettata 33/33 PASS su 5 viewport, nessun POST, 424 accessorie bloccate, icona desktop SVG e markup mobile invariato. Review ROUTINE 14/14 PASS. Nessun deploy 286 al checkpoint. [Dossier](orchestrator/evidence/2026-11-11-desktop-right-toolbar-286/REPORT.md).

## Checkpoint 2026-11-11 — candidata toolbar desktop 285 (predeploy)

Nuova toolbar destra desktop: 12 comandi principali sempre visibili e nomi sotto icone, incluse azioni Poligoni, R&B e Nuovo punto precedentemente nascoste nei flyout. Layout desktop compatto a due colonne a partire da 960 px con pointer fine/hover; mobile a 390px mantiene etichette nascoste e flyout preesistenti. Un solo HTML standalone.

Candidato codice `7a65a39530691a80b067700e88c0eca4a3ac8a29`, blob `e2c5a304ad84fafad7d95d1371bc8fed14c6789a`, SHA-256 `8a0ac1b4a0cf688d26dc2c94f88803187db64fa75aad1abc664446b00406847d`, 11.114.653 byte. JS inline 2/2 PASS, 192 CR invariati. Browser candidato HTTPS con HTML iniettato: **28/28 PASS** su 5 viewport, apertura diretta Poligoni/R&B, menu Livelli, mobile, POST 0, 450 accessorie bloccate. Review routine scope/invarianti **19/19 PASS**; non serve review esterna. **NO DEPLOY** al checkpoint. [Dossier](orchestrator/evidence/2026-11-11-desktop-right-toolbar-285/REPORT.md) · [QA](orchestrator/evidence/2026-11-11-desktop-right-toolbar-285/QA-CANDIDATE-285.md).

## Checkpoint 2026-11-11 — QA operatore D-Flight 283 PASS; priorita desktop toolbar

Attestazione esatta ricevuta in chat: `QA GIS-DFLIGHT-MINIMIZED-ESCAPE-A PASS operatore`. Chiusa 283 secondo Regola H, con review GPT sostitutiva gia PASS 18/18, deploy GIS-only e ABQA HTTPS nativa 17/17 PASS. Review AI esterna NOT_PERFORMED/backstop. Chiusura docs-only, runtime 283 invariato. [Rapporto](orchestrator/evidence/2026-11-11-dflight-283-operator-closure/REPORT.md).

Nuova richiesta dell'operatore: su desktop tutti i comandi sulla destra devono essere sempre raggiungibili direttamente, anche Poligoni, R&B, Punto/Waypoint, con etichette sotto icona. Non estendere automaticamente a mobile. Nuovo blocco UI `GIS-DESKTOP-RIGHT-TOOLBAR-LABELS-A` prioritario; il candidato Escape 284 preparato su branch separato resta congelato NON DEPLOY. Nessun nuovo runtime ancora pubblicato.

## Checkpoint 2026-11-11 — audit aggiuntivo Escape, 283 ancora in QA operatore

Riprodotti in Edge nativo HTTPS tre blocchi Escape con Poligoni visibile: Mappe Offline, Cerca, Cronologia minimizzate. Ognuno 6 PASS e 1 FAIL su 7 controlli. Ramo sperimentale 284 pubblicato su GitHub separatamente, senza merge/deploy; QA candidata in memoria 21/21 sui tre casi e 17/17 regressione D-Flight. Il gate operatore della 283 resta PENDING, invariato. [Dossier](orchestrator/evidence/2026-11-11-escape-followup-284/REPORT.md).

## Checkpoint 2026-11-11 — Build 283 live, ABQA HTTPS nativa PASS

Deploy GIS-only: preflight, backup e pull fast-forward PASS; restart del solo `goi-gis-app.service` PASS alle **03:09:05 Europe/Rome**. VPS main `8a44e608c68ba1ebd4b4b6ffbdfbbb20505f55d6` al momento del deploy, working tree clean; SHA del file/HTTP 8000/HTTPS confermato `dbdc54753722bee425d9c4e6528455ef7b72d946b69e747ae109621de414ea24`, 11.108.965 byte. Backup Build 282: `/var/backups/goi-gis-runtime/20261111T020904Z-build283`. Nessun comando sui servizi condivisi.

Dall'AsusDesktop iniziali trasferimenti HTTPS incompleti (curl code 18 / HttpClient eccezione), successivamente GET HTTPS completo e SHA verificato e ABQA **nativa (HTML non iniettato) Edge 17/17 PASS**. 0 POST, 305 richieste accessorie bloccate, console generale/pageerror non raccolti separatamente. Infrastruttura non modificata. [Deploy](orchestrator/evidence/2026-11-11-dflight-escape-283/DEPLOY-RESULT-283.md) · [ABQA](orchestrator/evidence/2026-11-11-dflight-escape-283/QA-LIVE-283.md) · [Report](orchestrator/evidence/2026-11-11-dflight-escape-283/REPORT.md).

Gate attivo: QA operatore desktop **non ancora ricevuta**. Nessun PASS generale delle 38 finestre; telefono in pausa. Review GPT sostitutiva completata 18/18; esterna NOT_PERFORMED/backstop.

## Checkpoint 2026-11-11 — candidata desktop D-Flight/Escape 283, predeploy

Baseline 282 HTTPS nativa: 17 controlli, 16 PASS/1 FAIL; Poligoni visibile non si chiude con Escape se D-Flight è minimizzato. D-Flight e Mappe Offline PASS. Causa riprodotta nel ramo Escape che torna prematuramente prima dei pannelli successivi.

Candidata Build 283: modifica funzionale circoscritta al ramo Escape di D-Flight, tre metadati; 192 CR invariati; Node sintassi inline 2/2 PASS. QA candidata **17/17 PASS** in HTTPS con HTML iniettato (non runtime LIVE), POST 0, accessorie bloccate 329. REVIEW GPT-SOSTITUTIVA **18/18 PASS** su raw GitHub pinnato a `5795b6711c5690216a2f1862003af29758520101`; review AI esterna NOT_PERFORMED/backstop. **NO DEPLOY 283** a questo checkpoint.

[Rapporto](orchestrator/evidence/2026-11-11-dflight-escape-283/REPORT.md) · [QA candidata](orchestrator/evidence/2026-11-11-dflight-escape-283/QA-CANDIDATE-283.md) · [Review](orchestrator/evidence/2026-11-11-dflight-escape-283/REVIEW-GPT-283.json). Sviluppo telefono in pausa.

## Checkpoint 2026-11-11 — chiusura 282 e NEXT D-Flight desktop

Ricevuta l'attestazione esatta «QA GIS-FAVORITES-MINIMIZED-ESCAPE-A PASS operatore vai pure avanti»: `GIS-FAVORITES-MINIMIZED-ESCAPE-A` **CLOSED / PASS operatore**, secondo Regola H. Review GPT sostitutiva finale, deploy e ABQA HTTPS 3 casi / 44 controlli erano già PASS. Review AI esterna NOT_PERFORMED/backstop, mai attribuita retroattivamente. Nessun nuovo runtime, restart, deploy o QA attribuito a questa chiusura.

Dal PC di casa AsusDesktop: TMAR Desktop Commander Win 0.3.1 operativo, HTTPS GIS SHA-256 Build 282 verificato e SSH autenticato al VPS PASS. Il clone VPS è stato fast-forwardato dal precedente checkpoint per documenti soltanto; HTML runtime invariato. [Rapporto](orchestrator/evidence/2026-11-11-favorites-escape-282-closure/REPORT.md).

Prosegue il diagnostico desktop `GIS-DFLIGHT-MINIMIZED-ESCAPE-DIAG-A`: D-Flight minimizzato/Escape e priorità di pannelli visibili da riprodurre nel browser. Nessun FAIL o PASS generale delle 38 finestre dedotto; telefono in pausa.

## Checkpoint 2026-11-10 — Build 282 live, ABQA nativa PASS

Review GPT sostitutiva finale, preflight e deploy PASS; ABQA sul documento HTTPS nativo 3 casi / 44 controlli PASS. Il TARGET VPS del rilascio è storico nel rapporto deploy, distinto dalla HEAD canonica GitHub. [Dossier](orchestrator/evidence/2026-11-10-favorites-escape-282/REPORT.md) · [ABQA LIVE](orchestrator/evidence/2026-11-10-favorites-escape-282/QA-LIVE-282.md) · [Deploy](orchestrator/evidence/2026-11-10-favorites-escape-282/deploy/DEPLOY-RESULT-282.md).

Resta la QA operatore desktop, con caso breve nel NEXT; nessun PASS operatore 282 ricevuto. Accessorie bloccate 164, POST 0, pageerror 0; console generale non raccolta separatamente, fuori GIS N/A. Telefono in pausa, Build 281 chiusa, review AI esterna NOT_PERFORMED. SSH verificato dal PC tramite RDC originale; nessuna autonomia dal PC attestata.

## Checkpoint 2026-11-10 — Preferiti 282, QA candidata PASS e dossier predeploy

QA candidata iniettata: 3 casi desktop e 44/44 controlli PASS; primo tentativo INCOMPLETE conservato come errore dell'harness. Codice/checklist e QA esaminati nel rapporto provvisorio; manifest ricalcolato sui blob staged, con identità raw Windows separate. Verifica finale del reviewer sul ref pubblicato ancora pendente. Preparazione deploy: ROOT REVIEW PASS STATICO, nessuna esecuzione VPS. [QA e dossier](orchestrator/evidence/2026-11-10-favorites-escape-282/REPORT.md).

Build 281 resta live. Nessun PASS complessivo review, deploy 282 o ABQA live anticipato. Pausa telefono e chiusura GIS-WINDOW-CONTROLS-A preservate.

## Checkpoint 2026-11-10 — candidato desktop Preferiti/Escape 282

Baseline nativa 281: Preferiti minimizzato viene chiuso da Escape e intercetta il comando destinato a Mappe Offline. Due casi FAIL e controllo visibile PASS, 26 assert (19 PASS/7 FAIL). Candidato 282: una modifica funzionale più tre metadati, byte esterni identici, 192 CR isolati preservati, sintassi 2/2 PASS. QA candidata e review downstream non ancora attestate; nessun deploy. [Evidenze e gate](orchestrator/evidence/2026-11-10-favorites-escape-282/REPORT.md).

## Checkpoint 2026-11-10 — chiusura finestre 281; sviluppo telefono in pausa

Ricevuto il trigger esatto `QA GIS-WINDOW-CONTROLS-A PASS operatore`. Chiuso `GIS-WINDOW-CONTROLS-A` secondo Regola H/H7, con review GPT sostitutiva già loggata, deploy e ABQA PASS. Nessuna nuova review AI esterna dichiarata. L'operatore dispone la pausa dello sviluppo telefono fino a nuovo ordine e la prosecuzione del backlog desktop. [Citazione integrale e chiusura](orchestrator/evidence/2026-11-10-window-controls-281-closure/REPORT.md).

Nessun delta runtime o deploy. Gate successivo: riproduzione UI di Preferiti/D-Flight minimizzati su Escape, poi priorità Escape; nessun nuovo bundle runtime e nessun nuovo FAIL UI attestato da questa registrazione.

I checkpoint precedenti sono storico datato; per gate e NEXT correnti prevale la tabella LIVE STATE sopra.

## Checkpoint 2026-11-10 — Astro desktop dal PC del lavoro

Remote Desktop Commander originale verificato sul PC del lavoro. Prova nativa della Build 281 in Edge/Windows, viewport 1440 × 1000: 11/11 controlli PASS alle 10:52:56 Europe/Rome. Dimensione e SHA-256 della risposta verificati prima delle azioni; apertura, controlli raggiungibili e nel viewport, minimize/restore e chiusura PASS. Zero tentativi di POST e zero pageerror catturati; richieste accessorie bloccate dal test. Un primo tentativo si era fermato per un limite della cache diagnostica del browser, corretto nel solo harness. [Rapporto e limiti](orchestrator/evidence/2026-11-10-workpc-astro-281/REPORT.md).

Nessun delta runtime o deploy. La richiesta di fare prove non è un PASS operatore: il gate su telefono e il NEXT restano invariati.

## Checkpoint 2026-11-09 — Build 281 distribuita e ABQA live PASS

Il bundle corregge il nome accessibile di Converti, l'evento Escape consumato due volte e le forzature CSS che coprivano l'header Astro su schermi stretti. Dieci sostituzioni ricostruiscono esattamente il candidato; i byte esterni sono invariati. Sintassi 2/2, REVIEW GPT-SOSTITUTIVA e review della procedura deploy PASS.

Prima del deploy: 9 casi e 123 check, più un controllo di scroll/Calcola (1 caso e 11 assert), tutti PASS sul candidato iniettato in Edge/Windows. Dopo il deploy: 3 documenti HTTPS nativi, 3 casi e 23 assert PASS, SHA verificato prima delle azioni; nessun HTML sostituito, nessun POST/routing/pageerror. Il browser Windows usa la CA locale ESET, distinta dalla verifica TLS effettuata sul VPS. I viewport mobili restano emulazioni, non prove Safari/iPhone fisico.

Rimane un solo caso umano breve su Astro nel telefono dell'operatore. I tre casi routing già confermati non vanno ripetuti e non valgono come nuova attestazione della 281. Codex e Cursor non sono stati invocati; il passaggio GPT conserva stato ed evidenze nel repository. L'autosync finale segue F3 senza commit aggiuntivi per citare il proprio hash.

---

Le sezioni seguenti sono **storico datato**, non lo stato corrente della tabella.

## Checkpoint 2026-11-09 — candidato finestre 281

Audit browser sulla Build 280: nome AX Converti vuoto a desktop e 390 px; un Escape chiude Guida e Converti quando entrambi sono aperti; Astro a 390 px forza l'header sotto i comandi superiori. Il candidato modifica soltanto tre aree e metadati/release. La ricostruzione indipendente delle dieci sostituzioni restituisce il byte esatto; altri componenti invariati.

Regressione candidata in Edge/Windows: 9 casi e 123 check PASS, più un controllo supplementare di scroll/Calcola su Astro (1 caso e 11 assert PASS), senza ripetere la matrice. Zero pageerror, zero POST e richieste ai provider di routing; richieste applicative intercettate. Verificati anche input, pick, figlio nativo e minimize/restore. Fonte HTML iniettata, non runtime servito; viewport mobile emulato, non iPhone/Safari fisico. Sintassi 2/2 PASS e review GPT sostitutiva conclusiva PASS. Il dossier deploy ha review statica PASS; preflight, deploy, ABQA live e QA operatore sono gate distinti.

La pubblicazione di questo checkpoint accompagna lo stesso blob runtime. L'eventuale HEAD documentale successiva al source commit deve avere soltanto delta docs e runtime identico. Nessun nuovo intervento infrastrutturale è autorizzato da questo bundle.

---

Le sezioni seguenti sono **storico datato**, non lo stato corrente della tabella.

## Checkpoint 2026-11-09 — QA operatore acquisita e prosecuzione

L'operatore ha risposto: «Okay, i tre casi sono perfetti, andiamo avanti.» Nel contesto diretto dei tre casi appena richiesti, la conferma è registrata come `QA ROUTING-LAND-ONLY-NO-FERRY-A PASS operatore`, in forma aggregata. La riga canonica è una normalizzazione dell'orchestratore, non la citazione letterale dell'utente. Browser, dispositivo e località non sono stati specificati. Non sono stati rieseguiti test né dedotte misurazioni mancanti.

La Regola H7 consente la chiusura dopo review GPT sostitutiva loggata, deploy/Automated Browser QA PASS e QA operatore PASS. Il backstop esterno resta distinto e non viene dichiarato completato. La precedente indicazione congiunta dei due punti aperti è riconciliata con questa regola, senza modificarla. Pubblicazione della chiusura e autosync seguono F3; gli artefatti precedenti rimangono immutabili.

L'audit di uniformità delle finestre era già richiesto in FRONTIER. Si applica il contratto esistente: altezza utile, header e azioni raggiungibili, scroll interno, compatibilità con minimize/restore, desktop e viewport stretti/touch. Perimetro iniziale in sola lettura; alert/confirm/prompt nativi esclusi. Le diagnosi statiche sono candidate, non FAIL browser. Nessuna nuova approvazione richiesta per proseguire nel lavoro già autorizzato.

---

Le sezioni seguenti sono **storico datato**, non lo stato corrente della tabella.

## Checkpoint 2026-11-09 — HTTPS applicato e Build 280 live

L'operatore ha approvato il pacchetto HTTPS 443 già revisionabile; applicazione PASS alle 13:57:21 Europe/Rome, con backup e registro delle fasi. Questa approvazione specifica non estende la standing authorization alle future modifiche infrastrutturali. TLS, sandbox systemd, vecchio e nuovo Origin ORS, endpoint condivisi e guardie negative verificati. Nessuna modifica a DNS, certificati, firewall, Tailscale Serve/Funnel o listener pubblici.

Il candidato iniziale 1e6c11cf… aveva superato 54 casi routing mock, 15 timeout, 2.112 controlli geografici, 96 invalidi e 24 casi UI geografica. Le prove reali hanno poi evidenziato due difetti UI: selezione alternative deviata dal compare vuoto e pulsante Compare non sincronizzato. Il definitivo 70553e52… corregge solo queste due funzioni e una nota di rilascio; tutti gli altri byte del primo candidato sono identici. Le suite iniziali restano evidenza acquisita sui componenti invariati, non nuove esecuzioni sullo SHA definitivo.

Sul definitivo: sintassi 2/2, regressione selezione 8/8 con 9 salvataggi/reload/riaperture, aggiornamento Compare offline e QA reale di tutti i 7 profili con esattamente 7 POST PASS. Review GPT sostitutiva completa per composizione, nessun blocker di codice residuo. Dopo il deploy, Automated Browser QA sulla pagina effettivamente servita, senza sostituzione HTML: SHA verificato prima dei 2 POST del confronto MTB, selezione/salvataggio/riapertura e blocchi offline/OPSEC PASS. I tentativi iniziali falliti e i limiti dell'harness sono conservati separatamente, senza trasformarli in PASS.

HTTP precedente e HTTPS restano disponibili e servono la stessa Build 280, ma hanno archivi browser separati. Nessuna migrazione automatica; le esportazioni esistenti non sono un backup completo. Nessun profilo utente reale aperto. Il test Safari/iPhone fisico e la plausibilità dei percorsi nel territorio restano alla QA operatore. Le conferme di Build precedenti non valgono come PASS della 280. Codex e Cursor non eseguiti; stato, evidenze e ripresa affidati al repository.

---

Le sezioni seguenti sono **storico datato**, non lo stato corrente della tabella.

## Ripresa — 2026-11-03

L’utente ha dato priorità al menu Layer su iOS, che su Build 270 si apriva e si chiudeva subito in Safari e Chrome. Build 271 sostituisce il listener outside-dismiss `mousedown` con `pointerdown` quando disponibile e conserva il fallback mouse. QA Edge touch/fallback e confronto Build270/271 PASS; la sequenza nativa non è stata registrata su iPhone reale. Il commit `173611f27299662bcc203212d063158ee411a5cf` è live su GitHub e VPS. Deploy strict PASS; runtime locale e HTTP hanno lo stesso SHA-256. Proxy, GraphHopper, ORS e n8n sono rimasti invariati. Il checkpoint aperto è il retest di Nicola su Safari e Chrome iOS, poi routing terrestre senza ferry.

Build 272 aggiunge l’apertura e la chiusura Layer senza ridisegnare la mappa, e compatta la barra in landscape a 48 px con navigazione a sinistra, titolo centrato e controlli a destra sulla stessa linea. Build 272 è live su GitHub e VPS. QA locale su sei profili e post-deploy Edge touch su due viewport landscape PASS; HTTP/runtime SHA corrispondono e gli altri servizi sono rimasti invariati. Il replay live blocca i provider esterni; il retest su iPhone fisico resta necessario. Dati e limiti completi: [REPORT Build 272](orchestrator/evidence/2026-11-03-ios-layer-flicker/REPORT.md) e [deploy](orchestrator/evidence/2026-11-03-ios-layer-flicker/DEPLOY-RESULT.md).

La QA Build 270 usava Edge Chromium touch; WebKit/Safari reale e caricamento dei provider esterni non erano stati verificati. Build 271 è una mitigazione candidata; il retest richiesto è descritto sopra. Dopo quel checkpoint, riprendere `ROUTING-LAND-ONLY-NO-FERRY-A` con i gate provider/browser già documentati.

## Ripresa — 2026-11-04

L’utente ha riferito che Build 272 su iPhone landscape oscillava e rendeva i pulsanti difficili da premere. Il confronto del codice ha isolato come ipotesi le transizioni di altezza da 180 ms aggiunte alla mappa e alla barra mentre la mappa usa `100dvh`. Build 273 rimuove solo queste transizioni. Il replay di sette altezze variabili in Edge touch ha misurato uno scarto massimo di 17,23 px (844×390) e 22 px (667×375) su Build 272, contro 0 px su Build 273; il tocco Layer e la maniglia barra sono rimasti utilizzabili. Commit `450c83188956401ce098747879195ac3b20932f4`, runtime SHA `4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a`, distribuito e verificato via HTTP/SSH. Il test resta emulazione Chromium, non prova Safari fisico né la UI dinamica del browser iOS; il retest dell’utente è il gate residuo.

Il successivo video dell’utente dimostra che la Build 273 oscilla ancora orizzontalmente: pagina e mappa si muovono mentre la barra del browser rimane ferma. Un confronto di geometria e listener in Chromium emulato non ha riprodotto overflow o un ciclo di ridisegno. La causa resta sconosciuta. La sonda opt-in preparata carica una copia strumentata della stessa Build 273 nello stesso origin, misura viewport/DOM per 30 secondi e presenta dati da copiare senza invio automatico. Occorre eseguirla su iPhone reale prima di scegliere una patch; non dichiarare il difetto risolto senza prova fisica della correzione.

## Checkpoint di pausa — 2026-10-30

Pausa richiesta dall'utente; nessun lavoro automatico fino alla ripresa. L'app LIVE resta build 268: il candidato build 269 SHA-256 `33e8d90257e56dba0bdf47de9776b018f301a103c5688ad124aab10bf953f548` è su GitHub ma non è stato distribuito. QA locale scoped e prove provider parziali sono collegate sopra; non attestano la chiusura dei gate.

Rilievi preliminari degli agenti interrotti, **da riprodurre e verificare alla ripresa**, senza dichiararli corretti:

1. Import GIS: scegliendo un GeoJSON scaricato tramite selettore file, l'anteprima può restare vuota; possibile causa FileList live letto dopo reset dell'input. Verificare selezione, drag-and-drop, ripetizione e ciclo save→reload→export→import di tracce e poligoni.
2. MGRS: `32NNA0000000000` e `32MNF0000050000` risultano accettati ma i quadrati ricadono nell'emisfero opposto. Analisi e possibile fix erano in staging; riesaminare con riferimenti indipendenti e prove positive/negative.
3. Routing/OPSEC: agente riferisce 24 controlli mock aggiuntivi passati nel proprio perimetro; matrice, timeout/fallback e prove reali runtime non erano complete né revisionate. Riprendere dal materiale di staging e documentare i risultati sul byte esatto.

Le attività degli agenti sono state interrotte prima delle consegne finali: non assumere completate le loro prove. Il lavoro intermedio potrebbe trovarsi nella cartella locale `work/` non tracciata o nella directory di lavoro della chat; non cancellarla. L'utente ha chiesto di riprendere lunedì, senza programmare un'automazione.

## Checkpoint 2026-11-05 — MGRS

Build 278 live: correzione dei quadrati/bande MGRS, QA browser Search/Converti 10+10 e review geografica campionata PASS; non certificazione globale. Difetto iniziale di posizionamento Converti corretto nella Build 279; QA desktop/mobile, drag e riapertura PASS. Routing candidato resta non distribuito e va riallineato a Build 278; HTTPS/ORS in sviluppo isolato.

## Checkpoint 2026-11-05 — Converti

Build 279 pubblicata, apertura iniziale Converti nel viewport, QA desktop 1280x1600 e mobile 390x844/320x568 PASS; drag e posizione salvata preservati. Routing staging va riallineato a Build 279; proxy HTTPS ancora in review.
