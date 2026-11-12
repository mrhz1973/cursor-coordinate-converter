# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Uniformità e controlli delle finestre GIS |
| **WU ATTIVA** | — (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | GIS-MINIMIZED-DFLIGHT-DETAILS-ESCAPE-PRIORITY-E - dettaglio D-Flight minimizzato cede Escape ai pannelli visibili su desktop |
| **STATO BLOCCO** | Build298 LIVE. Baseline Build297: Dettaglio zona D-Flight minimizzato con Poligoni visibile intercettava Escape, chiudeva il dettaglio e lasciava dock stale (1/1 FAIL in fixture browser isolata). Build298 candidate 1/1 fix PASS, 1/1 dettaglio visibile PASS, 1/1 minimizzato isolato PASS, 1/1 touch parity con 297, 2/2 regressione Build297 e 4/4 regressione Build296 PASS. REVIEW GPT-SOSTITUTIVA statica 18/18 PASS, esterna NOT_PERFORMED/post-hoc backstop. Deploy GIS-only e SHA file/HTTP/HTTPS PASS, backup297. ABQA HTTPS nativa LIVE 10/10 scoped PASS, zero POST/eccezioni JS. QA OPERATORE DESKTOP 298 PENDING. |
| **GATE CORRENTE** | QA OPERATORE DESKTOP Build298 PENDING: con un dettaglio reale D-Flight gia disponibile, minimizzarlo, aprire Poligoni e premere Escape; Poligoni deve chiudersi e il dettaglio rimanere minimizzato/ripristinabile. Test automatico svolto con zona sintetica per lifecycle, NON prova del provider reale. Nessun PASS operatore 298 ricevuto. |
| **RUNTIME LIVE** | Build298 ? source 651c872b914025d6f0e84b19e51313b92599342b ? Git blob 2390e70f133e534b76e70e71e3fa30f1946ed94a ? SHA256 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca ? 11.129.915 byte, 192 CR. GIS-only deploy su VPS main 651c872, backup Build297 /var/backups/goi-gis-runtime/20261112T220719Z-build298 (prev SHA e9be9dc2c694a930cb607d3bd71a56cdff4f8dd6a78b4d4e86d2ab15800b1a96), unico restart GIS PID 1200974 -> 1299971, HTTP/HTTPS SHA uguali, ABQA LIVE 10/10 PASS. |
| **RUNTIME CANDIDATE** | Nessun candidato successivo alla Build298 gia distribuita. Branch sorgente task/gis-dflight-details-escape-298, main source 651c872. |
| **ULTIMO BLOCCO CHIUSO** | GIS-MINIMIZED-HELP-TOOLS-ESCAPE-PRIORITY-D ? Build297 ? PASS operatore 2026-11-12; [ricevuta](orchestrator/evidence/2026-11-12-desktop-escape-297/OPERATOR-CLOSURE-297.md). |
| **NEXT** | QA operatore desktop Build298, se dati D-Flight disponibili: Dettaglio zona -> minimizza -> Poligoni -> Escape, verificare che Poligoni si chiuda e dettaglio resti ripristinabile. Se non sono presenti zone reali, dichiarare test umano NON ESEGUITO e non forzare fetch. PASS accettabile con QA GIS-MINIMIZED-DFLIGHT-DETAILS-ESCAPE-PRIORITY-E PASS operatore, poi Regola H. Le QA umane 295 footer e 294 Escape restano PENDING distinte; mobile PAUSA. |
| **SVILUPPO TELEFONO** | **PAUSA fino a nuovo ordine dell'utente**, limitatamente a TMAR GIS Tool, dal 2026-11-10. Proseguire con il backlog desktop; la direttiva non rimuove o disabilita le funzioni mobili esistenti. [Attestazione e scope](orchestrator/evidence/2026-11-10-window-controls-281-closure/REPORT.md). |
| **FOLLOW-UP REVIEW** | Build298 DELICATO lifecycle Escape. REVIEW GPT-SOSTITUTIVA 18/18 PASS da Git object full SHA source 651c872; reviewer esterno NOT_PERFORMED/post-hoc backstop. QA candidato 1 fix+1 visibile+1 isolato+1 parity touch+2 regressione297+4 regressione296=10/10 scoped PASS; QA HTTPS LIVE nativa stesso ambito 10/10 PASS, zero POST/eccezioni. Sorgente zona D-Flight sintetico session-only, provider reale NON collaudato. Non e PASS generale delle 38 finestre. |
| **EVIDENCE** | [Audit 20 dialog brevi Build298](orchestrator/evidence/2026-11-13-short-dialogs-298/REPORT.md) - [Audit desktop 298 - 7/7](orchestrator/evidence/2026-11-13-desktop-window-audit-298/REPORT.md) - [Escape D-Flight dettagli298](orchestrator/evidence/2026-11-12-desktop-escape-298/REPORT.md) - [QA LIVE298](orchestrator/evidence/2026-11-12-desktop-escape-298/QA-LIVE-298.md) - [Chiusura operatore 297](orchestrator/evidence/2026-11-12-desktop-escape-297/OPERATOR-CLOSURE-297.md) - [Escape297](orchestrator/evidence/2026-11-12-desktop-escape-297/REPORT.md) - [QA LIVE297](orchestrator/evidence/2026-11-12-desktop-escape-297/QA-LIVE-297.md) - [Chiusura Build296](orchestrator/evidence/2026-11-12-desktop-escape-296/OPERATOR-CLOSURE-296.md) ? [Escape desktop 296](orchestrator/evidence/2026-11-12-desktop-escape-296/REPORT.md) - [QA LIVE 296](orchestrator/evidence/2026-11-12-desktop-escape-296/QA-LIVE-296.md) -  [Footer GIS desktop 295](orchestrator/evidence/2026-11-12-footer-single-row-295/REPORT.md) · [Escape desktop 294](orchestrator/evidence/2026-11-12-desktop-escape-294/REPORT.md) · [Chiusura Escape293](orchestrator/evidence/2026-11-12-desktop-escape-293/OPERATOR-CLOSURE-293.md) · [QA PC lavoro](orchestrator/evidence/2026-11-12-desktop-escape-293/QA-WORKPC-293.md) · [Escape desktop 293](orchestrator/evidence/2026-11-12-desktop-escape-293/REPORT.md) · [Chiusura Build 292](orchestrator/evidence/2026-11-12-toolbar-292-operator-closure/REPORT.md) · [Bottom-right e branding 292](orchestrator/evidence/2026-11-12-toolbar-bottom-right-292/REPORT.md) · [Anti-overlap HUD 291](orchestrator/evidence/2026-11-12-desktop-toolbar-291-hud-safe/REPORT.md) · [Attestazione tardiva 287](orchestrator/evidence/2026-11-11-toolbar-287-delayed-operator-qa/REPORT.md) · [Toolbar due gruppi 290](orchestrator/evidence/2026-11-11-toolbar-dual-groups-290/REPORT.md) · [Toolbar FIX3 288](orchestrator/evidence/2026-11-11-desktop-toolbar-288-vertical/REPORT.md) · [Toolbar FIX2 287](orchestrator/evidence/2026-11-11-desktop-toolbar-287/REPORT.md) · [Toolbar FIX1 286](orchestrator/evidence/2026-11-11-desktop-right-toolbar-286/REPORT.md) · [Toolbar desktop 285](orchestrator/evidence/2026-11-11-desktop-right-toolbar-285/REPORT.md) · [D-Flight/Escape 283](orchestrator/evidence/2026-11-11-dflight-escape-283/REPORT.md) · [Rilascio finestre 281](orchestrator/evidence/2026-11-09-gis-window-controls-281/REPORT.md) · [ABQA live](orchestrator/evidence/2026-11-09-gis-window-controls-281/QA-WINDOWS-281-POSTDEPLOY.md) · [Chiusura routing 280](orchestrator/evidence/2026-11-09-routing-280-operator-closure/REPORT.md) · [Astro desktop PC lavoro](orchestrator/evidence/2026-11-10-workpc-astro-281/REPORT.md) · [Chiusura finestre 281](orchestrator/evidence/2026-11-10-window-controls-281-closure/REPORT.md) · [Preferiti/Escape 282](orchestrator/evidence/2026-11-10-favorites-escape-282/REPORT.md) |
| **VPS VERIFICATO** | IONOS `31.70.139.73`, tailnet `100.99.54.93`; HTTPS `https://ionos-n8n-new.tailc01234.ts.net/gis`. Unico restart GIS; Nginx, gateway ORS, proxy HTTPS, configurazioni/listener/endpoint condivisi preservati. Backup e journal nel rapporto deploy. |
| **ACCESSO OPERATIVO — sessione al PC del lavoro** | 2026-11-10: RDC originale sul PC DESKTOP-DPIJL64, su scelta esplicita dell'utente. Comandi, Git, HTTPS nativo e SSH dal PC al VPS realmente verificati. La sessione continua tramite RDC sul PC del lavoro; non attesta accesso indipendente dal PC. [Deploy](orchestrator/evidence/2026-11-10-favorites-escape-282/deploy/DEPLOY-RESULT-282.md). La scelta TMAR/ASUS resta [storico del 9 novembre](orchestrator/evidence/2026-11-09-vps-direct-access/TMAR-ROUTE-CORRECTION.md). |
| **ACCESSO OPERATIVO — AsusDesktop** | 2026-11-11: TMAR Desktop Commander Win 0.3.1 sul PC di casa PASS; SSH autenticato al VPS tramite alias `ionos-n8n-new` su `31.70.139.73:22` PASS; HTTPS GIS HTTP 200, SHA-256 Build 282 corrispondente. Nessuna modifica di servizi o infrastruttura. |
| **ALTRI WORKSTREAM** | Build297 CLOSED/PASS operatore; Build298 LIVE QA operatore PENDING. Build295 footer/HUD e Build294 Escape QA umane PENDING e indipendenti. Sviluppo telefono PAUSA, nessuna QA generale dei 38 dialog. |

## Checkpoint 2026-11-13 - audit desktop read-only 20 dialog brevi Build298

Su Edge CDP, profilo isolato, HTTPS Build298: 20 dialog senza minimizzazione a 1440x900 e 1024x650; 40/40 geometrie entro viewport e 40/40 pulsanti Chiudi hit-test raggiungibili. Titoli ARIA valorizzati in apertura sintetica 36/40; due dialog dinamici (RR Source Picker e OPSEC Strict, quattro osservazioni) hanno ottenuto titoli corretti mediante i reali opener applicativi. OPSEC annullato con esito false, zero POST, zero JS exception; nessuna azione distruttiva e nessun provider esterno interpellato. Audit DOM sintetico NON certifica il ciclo di vita completo dei 20 dialog. Nessun nuovo bug confermato, nessuna Build299, nessun deploy; Build298 QA operatore D-Flight reale PENDING, Build294/295 QA umane PENDING; mobile PAUSA. [Rapporto](orchestrator/evidence/2026-11-13-short-dialogs-298/REPORT.md).

## Checkpoint 2026-11-13 - audit desktop aggiuntivo in sola lettura Build298

Il comando operatore "ok vai" autorizza la prosecuzione tecnica, non un PASS umano. Su Windows TMAR Desktop Commander + Edge CDP isolato, HTTPS nativo Build298: 7/7 PASS per Cerca, Cronologia, Preferiti, Mappe Offline, Misura, Astro e Range Rings. Verificati real opener, minimizzazione, Poligoni visibile, Escape che chiude Poligoni e ripristino del minimizzato. Provider esterni bloccati, zero POST, zero eccezioni JS. Browser isolato privo di dataset D-Flight reale: dflightHasSessionDataset() = false; non e stato forzato alcun provider D-Flight. Nessun accesso al browser personale utente, nessuna porta CDP utente gia esposta sul PC. Nessun nuovo runtime o deploy. Build298 QA operatore PENDING; Build294/295 QA umane distinte PENDING. [Report](orchestrator/evidence/2026-11-13-desktop-window-audit-298/REPORT.md).

## Checkpoint 2026-11-12 - Build298 LIVE e ABQA HTTPS nativa 10/10 PASS

Dopo PASS umano e chiusura docs-only della Build297, il diagnostico desktop ha censito 18 dialog minimizzabili. Poligoni minimizzato con Range Rings visibile: PASS. Dettaglio D-Flight minimizzato con Poligoni visibile: baseline297 FAIL; Escape chiudeva il dettaglio e lasciava il dock stale. Prova con dflightOpenDetailsPanel e fixture di zona sintetica isolata, non rete/dati D-Flight reali.

Build298 source 651c872b914025d6f0e84b19e51313b92599342b, blob 2390e70f133e534b76e70e71e3fa30f1946ed94a, SHA256 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca, 11.129.915 byte / CR192. Singola guardia Escape desktop sull'ID dflightDetailsPanel: il minimizzato cede a Poligoni. Nessuna modifica a provider tile, D-Flight dataset, GPS, OPSEC, storage, mobile.

QA candidata 10/10 scoped PASS, review GPT-SOSTITUTIVA statica full SHA 18/18 PASS; esterna NOT_PERFORMED/post-hoc backstop. Deploy GIS-only PASS, backup Build297 /var/backups/goi-gis-runtime/20261112T220719Z-build298, service PID 1200974->1299971, SHA file/HTTP/HTTPS corrispondenti. ABQA HTTPS LIVE Edge nativa senza injection: 10/10 scoped PASS, zero POST e zero eccezioni JS. Il tile/provider D-Flight esterno non e stato interrogato. QA umana 298 PENDING, 294/295 restano indipendenti e PENDING. [Report](orchestrator/evidence/2026-11-12-desktop-escape-298/REPORT.md) - [QA](orchestrator/evidence/2026-11-12-desktop-escape-298/QA-LIVE-298.md).

## Checkpoint 2026-11-12 - Build297 CLOSED / QA operatore PASS

Ricevuto dall'operatore immediatamente dopo la QA della Build297: "PASS vai avanti". Nel contesto stretto della prova Guida e Strumenti minimizzati con Poligoni visibile + Escape, acquisita come "QA GIS-MINIMIZED-HELP-TOOLS-ESCAPE-PRIORITY-D PASS operatore", normalizzazione operativa non trascrizione letterale della riga tecnica. Review GPT-SOSTITUTIVA 18/18 PASS, deploy GIS-only con backup296 e SHA HTTP/HTTPS verificati, ABQA HTTPS nativa 12/12 PASS gia acquisiti. Il reviewer AI esterno resta NOT_PERFORMED/post-hoc backstop. Applicata Regola H: CLOSED docs-only, senza nuovo HTML, QA tecnica, restart o deploy. Restano in attesa le QA umane 294 e 295, non assorbite dal PASS del 297. NEXT audit read-only dei pannelli rimanenti. [Ricevuta](orchestrator/evidence/2026-11-12-desktop-escape-297/OPERATOR-CLOSURE-297.md).

## Checkpoint 2026-11-12 - Build297 LIVE, Escape Guida e Strumenti desktop

Dal backlog read-only post-Build296, Edge HTTPS LIVE ha riprodotto Guida e Strumenti minimizzati che chiudevano se stessi anziche cedere Escape a Poligoni visibile (2/2 FAIL). Range Rings PASS; Waypoint e Traccia avevano pickMode attivo e Escape lo disarmava, comportamento confermato intenzionale e verificato PASS quando il pickMode era disabilitato. Nessuna correzione a Waypoint/Traccia.

Build297 source 1adf52d26efaaf62da491e3a445f37ce716a8351, blob cd158698c6de3a66f27bafb22be0da4443ab861b, SHA256 e9be9dc2c694a930cb607d3bd71a56cdff4f8dd6a78b4d4e86d2ab15800b1a96, 11.129.498 byte, 192 CR. Due guardie desktop della funzione bindHotkeys ora cedono Escape sui pannelli minimizzati Guida e Strumenti. Note di rilascio e build bump inclusi. Nessun intervento ad altri handler, storage, GPS, OPSEC, rete, mobile.

Candidate QA Edge origin HTTPS in memoria: 2/2 target PASS, 2/2 visible close PASS, 2/2 minimized-only PASS, 4/4 Build296 regression PASS, 2/2 mobile touch parity; zero POST / errori JS. Review GPT-SOSTITUTIVA statica 18/18 PASS da Git object full SHA, reviewer esterno NOT_PERFORMED/post-hoc backstop. Deploy GIS-only sul VPS con backup precedente verificato, unico restart del servizio GIS e smoke finale HTTP/HTTPS PASS con retry di readiness. ABQA Edge LIVE su HTTPS nativo senza injection: 12/12 PASS, zero POST/JS errors, provider terzi bloccati. QA OPERATORE DESKTOP 297 PENDING; 295 e 294 ancora PENDING separatamente. [Dossier](orchestrator/evidence/2026-11-12-desktop-escape-297/REPORT.md).

## Checkpoint 2026-11-12 - Build296 CLOSED, QA operatore PASS

La risposta dell'operatore al gate QA Build296 appena comunicato ?: ?Sto qui a posto, qui fatto e funziona tutto, vai avanti.?. Attestazione normalizzata: QA GIS-MINIMIZED-WINDOW-ESCAPE-PRIORITY-C PASS operatore. Non ? una citazione letterale del comando tecnico e non precisa quali casi abbia ripetuto l'operatore. Regola H: CLOSED documentale, senza nuovo runtime/deploy/restart; restano precedenti review GPT-SOSTITUTIVA 18/18 PASS, ABQA nativa HTTPS12/12 PASS, deploy GIS-only PASS. Reviewer esterno NOT_PERFORMED / post-hoc backstop. QA 294 e 295 restano pending. NEXT audit read-only desktop pannelli rimanenti.

[Ricevuta](orchestrator/evidence/2026-11-12-desktop-escape-296/OPERATOR-CLOSURE-296.md).

## Checkpoint 2026-11-12 - Escape desktop Build296 LIVE, ABQA HTTPS 12/12 PASS

Proseguito il backlog desktop indipendente dai gate QA operatore 295/294 ancora aperti. Audit nativo Edge del runtime Build295: Converti, Indice IGM, Oggetti GIS e Pianifica percorso minimizzati intercettavano Escape destinato a Poligoni visibile. Baseline riprodotta 4/4 FAIL con opener reali e assestamento delle finestre; 38 dialog censiti, NON qualifica generale delle 38 finestre. Candidata Build296, source e222efc35b9d0dc988935ffd05464fee12417398, blob aebedfd05656166ec403c7ad85699061abde46ae, SHA256 380ee97a3cb82feba3592016011e7510b63df7aab4ec82bc786d842d3484e2ff, 11.128.759 byte, 192 CR: quattro guardie Escape desktop, build label e nota rilascio; nessun dato o comportamento mobile modificato.

Candidata QA origin HTTPS con HTML servito solo nella sessione CDP: 4/4 correzioni, 4/4 pannelli visibili, 4/4 parity touch, 4/4 soli pannelli minimizzati, 0 POST. Sintassi JS 2/2. REVIEW GPT-SOSTITUTIVA 18/18 statica su Git object full SHA, esterna NOT_PERFORMED/post-hoc backstop. Il fetch GitHub range del monolite ha restituito blob esatto ma payload vuoto; la review è stata compiuta sul Git object locale pin-nato allo stesso SHA, non su una lettura parziale erroneamente inventata.

Deploy solo GIS: backup originale della 295 verificato nel path /var/backups/goi-gis-runtime/20261112T202323Z-build296, Git VPS fast-forward a e222efc, riavviato unicamente goi-gis-app.service. Il primo smoke HTTP immediato ha fallito con connection refused prima della readiness del listener; nessun secondo restart. Follow-up read-only: servizio active PID1127560, branch main clean, SHA esatto del file VPS, HTTP tailnet 8000 e HTTPS /gis tutti 380ee97a3...4e2ff PASS. QA LIVE Edge nativa HTTPS senza injection: 4/4 fix, 4/4 pannelli visibili, 4/4 touch parity = 12/12 scoped PASS, zero POST ed eccezioni JS; provider terzi bloccati, telefono fisico non testato.

Gate: QA OPERATORE 296 PENDING, QA 295 e 294 ancora distinte e non chiuse. [Rapporto](orchestrator/evidence/2026-11-12-desktop-escape-296/REPORT.md) - [Deploy](orchestrator/evidence/2026-11-12-desktop-escape-296/DEPLOY-RESULT-296.md) - [QA LIVE](orchestrator/evidence/2026-11-12-desktop-escape-296/QA-LIVE-296.md).

## Checkpoint 2026-11-12 — Build295 LIVE, QA nativa 170/170 PASS, QA operatore PENDING

Deploy GIS-only source b213b80fb8c006508e40d6d50e79a0036f3a8cfe, blob 57eb5cedf84982806bdd726c438d4d35acf473eb, SHA256 8bc8ce1bde2e448ba3b6f60f042d371520707c21b5f6cea581eacb8135724840, 11.127.935 byte: preflight main pulito e whitelist PASS, backup /var/backups/goi-gis-runtime/20261112T191026Z-build295, FF pull e unico restart goi-gis-app.service (PID 1008612) PASS. HTTP interno 8000 e HTTPS /gis status 200 con SHA/bytes identici, Windows curl HTTPS SHA esatto. Nessuna modifica Nginx/ORS/proxy, storage, GPS, OPSEC o sviluppo mobile.

ABQA Edge HTTPS **nativa** sul documento LIVE senza iniezione: **86/86 PASS** geometria footer single-row/cache dinamica/attribuzione reale/anticollisione e mobile emulato; **25/25 PASS** Waypoint; **42/42 PASS** regressione Escape sei pannelli minimizzati; **17/17 PASS** D-Flight. Totale **170/170 PASS**, zero POST. Il runner Escape ha avuto un primo caricamento del documento incompleto (timeout del solo harness); ampliata la finestra di caricamento, ripetizione completa 42/42 PASS senza modifica runtime. Provider tile reali bloccati in QA, nessuna verifica della console/pageerrors generali. REVIEW GPT-SOSTITUTIVA 42/42 PASS, esterna NON effettuata con backstop. [Deploy](orchestrator/evidence/2026-11-12-footer-single-row-295/DEPLOY-RESULT-295.md) · [QA LIVE](orchestrator/evidence/2026-11-12-footer-single-row-295/QA-LIVE-295.md).

QA OPERATORE DESKTOP Build295 **PENDING**. QA operatore Escape294 precedente ancora senza attestazione umana, non dedotta dal nuovo QA automatico. Telefono PAUSA.

## Checkpoint 2026-11-12 — richiesta footer HUD e candidata 295 (predeploy)

Screenshot dell'operatore: footer GIS a una sola riga. Firma/versione **a sinistra**, cache sessione **al centro**, dicitura attribuzione mappa (esempio Imagery © Google — proxy tailnet, punto 2 evidenziato nello screenshot) **a destra**, rimossa dalla fascia superiore l'indicazione Applicazione 100% offline. PUNTO e CURSORE **aderenti al bordo superiore footer**, non sovrapposti; dove la toolbar destra non entra, readout spostato lateralmente a sinistra della colonna, preservando accesso al GPS. Mobile escluso dalle modifiche.

Build295 source b213b80fb8c006508e40d6d50e79a0036f3a8cfe, blob 57eb5cedf84982806bdd726c438d4d35acf473eb, SHA256 8bc8ce1bde2e448ba3b6f60f042d371520707c21b5f6cea581eacb8135724840, 11.127.935 byte, CSS/HTML e JS di sola presentazione. Footer desktop 30px e stringhe single-row; attribution clonata dal layer effettivo per mantenere i link e cambio mappa; cache dinamica esistente aggiorna footer, senza nuova rete o scritture. Position fixed HUD calcolata dal footer, CSS var della sua altezza, shift auto via scrollHeight su viewport basso. Su Edge candidata con documento iniettato su origin HTTPS: **86/86 PASS** geometria, cache 107 tile/1.2 MB, mobile e attribuzione; Waypoint 25/25 PASS, 0 POST. REVIEW GPT-SOSTITUTIVA **42/42 PASS** con backstop esterno post-hoc. **Non LIVE** a questo checkpoint. [Dossier](orchestrator/evidence/2026-11-12-footer-single-row-295/REPORT.md).

Il precedente blocco Escape294 resta QA operatore PENDING, senza PASS e senza chiusura retroattiva.

## Checkpoint 2026-11-12 — Build294 LIVE e QA HTTPS nativa 59/59 PASS

Rilascio GIS-only: source dd4bb2a2180c59b32c2259c7016f771a7bda0b16, blob c6aec7daa7330cd501883585d52d5e021a3dee33, SHA256 2556773e442a2822461067df118713375388e71825efc46195ffd12936887743, 11.121.515 byte. Preflight main clean con whitelist di soli HTML/FRONTIER/evidence, backup verificato della 293 (/var/backups/goi-gis-runtime/20261112T115406Z-build294), FF pull e unico restart goi-gis-app.service (PID 298873). Smoke HTTP interno 8000 e HTTPS /gis PASS. Nginx, ORS, altri servizi, storage e mobile invariati.

QA nativa Edge da AsusDesktop sul documento LIVE 294 senza injection: **42/42 PASS** sui sei pannelli Astro, Range & Bearing, Misura, Offline, Cerca, Cronologia minimizzati + Poligoni; **17/17 PASS** regressione D-Flight. Totale 59/59 PASS, zero POST. QA candidata precedente su PC lavoro era 36/36 PASS. Un nuovo runner WorkPC per QA LIVE non ha completato l'invio perché il connettore originale ha avuto timeout: non attribuire una prova LIVE al PC lavoro. REVIEW GPT-SOSTITUTIVA 31/31 PASS, esterna NOT_PERFORMED con backstop post-hoc. [Deploy](orchestrator/evidence/2026-11-12-desktop-escape-294/DEPLOY-RESULT-294.md) · [QA LIVE](orchestrator/evidence/2026-11-12-desktop-escape-294/QA-LIVE-294.md).

Gate residuo QA OPERATORE DESKTOP 294 PENDING; nessun PASS delle 38 finestre in generale. Sviluppo telefono in pausa.

## Checkpoint 2026-11-12 — tre nuovi finding Escape e candidata 294 (predeploy)

Su PC lavoro DESKTOP-DPIJL64, Edge reale in profilo isolato e runtime Build293 HTTPS nativo: con Astro, Range & Bearing o Misura minimizzati, Escape non chiude Poligoni visibile. Baseline 13/16 PASS, 3 FAIL. La vecchia correzione del 293 di Offline/Cerca/Cronologia resta LIVE.

Candidata 294, source dd4bb2a2180c59b32c2259c7016f771a7bda0b16, blob c6aec7daa7330cd501883585d52d5e021a3dee33, SHA256 2556773e442a2822461067df118713375388e71825efc46195ffd12936887743, 11.121.515 byte. Aggiornate tre guardie Escape esistenti usando il predicato desktop GIS introdotto nel 293; comportamento del mobile invariato. JavaScript inline 2/2 PASS, CR 192, diff 9 inserimenti 6 eliminazioni. In Edge sul PC lavoro con documento 294 iniettato su origin HTTPS, **36/36 PASS** su Astro, Range & Bearing, Misura, Offline, Cerca, Cronologia e D-Flight, 0 POST. REVIEW GPT-SOSTITUTIVA **31/31 PASS**, reviewer esterno NON eseguito, backstop post-hoc. Non LIVE a questo checkpoint. [Dossier](orchestrator/evidence/2026-11-12-desktop-escape-294/REPORT.md).

## Checkpoint 2026-11-12 — Build 293 CLOSED, QA operatore PASS e test sul PC del lavoro

Attestazione umana ricevuta esattamente: QA GIS-MINIMIZED-WINDOW-ESCAPE-PRIORITY-A PASS operatore. Era già completa la REVIEW GPT-SOSTITUTIVA 32/32 su source 86d27e7707046ec9829f5be4ef2832aec86f4a6c, l'evidenza di deploy GIS-only/backup della 292 e ABQA LIVE HTTPS 38/38 PASS. Reviewer AI esterno non disponibile: NOT_PERFORMED/post-hoc backstop documentato. Regola H applicata: chiusura documentale, HTML e servizi invariati.

In risposta alla richiesta di usare il **Remote Desktop Commander originale del PC del lavoro**, device DESKTOP-DPIJL64 ONLINE, Windows, Desktop Commander 0.3.2: Edge headless con profilo temporaneo isolato ha riprodotto le azioni UI sul GIS LIVE 293 (HTTPS status 200, 11.121.119 byte): Mappe Offline, Cerca, Cronologia e D-Flight minimizzati davanti a Poligoni, tasto Escape reale. **21/21 PASS**, 0 POST, 301 richieste di terze parti bloccate. La verifica tecnica aggiuntiva non sostituisce e non inventa la QA operatore. [Report WorkPC](orchestrator/evidence/2026-11-12-desktop-escape-293/QA-WORKPC-293.md) · [Chiusura](orchestrator/evidence/2026-11-12-desktop-escape-293/OPERATOR-CLOSURE-293.md).

NEXT: audit desktop delle altre condizioni Escape per pannelli minimizzati, senza modificare mobile e senza inventare regressioni. Telefono in pausa.

## Checkpoint 2026-11-12 — Build 293 LIVE, QA nativa 38/38 PASS, operatore PENDING

Deploy GIS-only Build293: source 86d27e7707046ec9829f5be4ef2832aec86f4a6c, blob f7ef7266bbf6d0b9912bc9f9d6f0c9f0336c7442, SHA b4bc346f74be303fa157bc8b7ebc80b532e50fec002edde55adf13ba64e3720e, 11.121.119 byte. Preflight e backup Build292 (/var/backups/goi-gis-runtime/20261112T105954Z-build293) PASS, pull main FF e restart solo goi-gis-app.service (PID 210200), smoke HTTP 8000 / HTTPS /gis PASS. Nessun cambio a proxy, Nginx, ORS, altri servizi, dati persistiti, rete, GPS o mobile.

ABQA HTTPS **nativa** su codice realmente servito, non HTML sostituito: **21/21 PASS** per Escape con Mappe Offline, Cerca e Cronologia minimizzate davanti a Poligoni visibile; **17/17 PASS** D-Flight, 0 POST. Review GPT-SOSTITUTIVA 32/32 PASS, esterna NOT_PERFORMED, backstop post-hoc esplicito. [Deploy](orchestrator/evidence/2026-11-12-desktop-escape-293/DEPLOY-RESULT-293.md) · [QA LIVE](orchestrator/evidence/2026-11-12-desktop-escape-293/QA-LIVE-293.md).

Gate residuo: QA OPERATORE DESKTOP 293 PENDING. Mobile e naming TMAR GIS Tool invariati. Non è una qualifica generale delle 38 finestre.

## Checkpoint 2026-11-12 — audit Escape 284 vs main 292 e candidata desktop 293

La vecchia branch Escape 284 era basata sulla Build 283 e non era LIVE. Sulla 292 LIVE, Edge HTTPS nativo ha riprodotto **3/3 finding**: Offline, Cerca o Cronologia minimizzati lasciano Poligoni aperto dopo Escape, mentre il controllo senza altri pannelli chiude correttamente. Risultato 18/21 PASS + 3 FAIL. Il vecchio ramo 284 non è stato reimmesso su main.

Candidata 293 su main 292: tre guardie Escape aggiornate e unico predicato desktop GIS (min-width 960, hover e pointer fine). Su desktop il minimizzato cede la priorità a pannelli visibili; su mobile e fuori GIS resta il vecchio comportamento. Nessun gestore di close/open o dato cambiato. Sorgente 86d27e7707046ec9829f5be4ef2832aec86f4a6c, blob f7ef7266bbf6d0b9912bc9f9d6f0c9f0336c7442, SHA b4bc346f74be303fa157bc8b7ebc80b532e50fec002edde55adf13ba64e3720e, 11.121.119 byte, 192 CR preservati. QA candidata Edge con documento sostituito solo in memoria: 21/21 PASS sui tre casi + 17/17 PASS regressione D-Flight, zero POST. REVIEW GPT-SOSTITUTIVA **32/32 PASS**; review esterna NOT_PERFORMED, backstop post-hoc. **NO DEPLOY ancora a questo checkpoint.** [Dossier](orchestrator/evidence/2026-11-12-desktop-escape-293/REPORT.md).

## Checkpoint 2026-11-12 — Build 292 CLOSED, QA PASS operatore

Ricevuto in chat il trigger esatto: QA GIS-DESKTOP-TOOLBAR-DUAL-GROUPS-A-FIX2 PASS operatore. La verifica umana conferma la disposizione HUD PUNTO/CURSORE e OpenStreetMap in basso a destra, GPS sopra con distacco circa un pulsante, e nome TMAR GIS Tool. Review routine 23/23 PASS, deploy GIS-only/backup 291/smoke HTTP-HTTPS PASS e ABQA HTTPS nativa 117/117 + branding visibile 9/9 PASS erano gia completati. Il selftest branding storico hardcoded Build 234 resta 17/18 per un controllo preesistente stale; non viene dichiarato PASS. Applicata Regola H: CLOSED docs-only; HTML SHA a71206104ac0944edac4da5ffecece4321cddea53c9fb016160f2866e2af8917, blob fc432b1ca383f6abe168286084b7961e96c6908f e servizio GIS invariati. [Ricevuta](orchestrator/evidence/2026-11-12-toolbar-292-operator-closure/REPORT.md).

Prossimo backlog desktop: valutare la compatibilita delle correzioni Escape predisposte nel ramo sperimentale Build 284 con la base attuale 292. Mobile ancora in pausa.

## Checkpoint 2026-11-12 — Build 292 LIVE: HUD originale e spazio GPS/PUNTO; TMAR GIS Tool

Deploy GIS-only Build 292: source b8a3a6c18e29ba382df0c6e6b3c1a4ea3f9f22c9, blob fc432b1ca383f6abe168286084b7961e96c6908f, SHA256 a71206104ac0944edac4da5ffecece4321cddea53c9fb016160f2866e2af8917, 11.120.400 byte. Preflight PASS, backup 291 /var/backups/goi-gis-runtime/20261112T102821Z-build292, git pull FF, unico restart goi-gis-app.service (PID 157384), smoke HTTP 8000 e HTTPS /gis PASS. Nginx, ORS, servizi condivisi e runtime mobile layout non modificati.

ABQA HTTPS **nativa** Edge su Build 292 realmente servita, senza HTML injection: 16/16 geometria HUD anchored-right e toolbar bottom235px con separazione GPS/PUNTO ≥44px, 9/9 nome TMAR GIS Tool (header/footer/tab/meta) e 1/1 viewport mobile, 76/76 regressione dual-groups, 25/25 Waypoint, POST 0. Totale 117 controlli funzionali/geometrici (16+76+25) e 9 verifiche nome. Branding selftest 17/18, unico check storico Build 234 non aggiornato. Console e page errors non rilevati separatamente. [Deploy](orchestrator/evidence/2026-11-12-toolbar-bottom-right-292/DEPLOY-RESULT-292.md) · [QA LIVE](orchestrator/evidence/2026-11-12-toolbar-bottom-right-292/QA-LIVE-292.md).

GATE RESIDUO: QA OPERATORE DESKTOP Build 292 PENDING; lo screenshot della 291 era feedback negativo e non diventa PASS. Sviluppo telefono in pausa.

## Checkpoint 2026-11-12 — QA 291 rifiutata: HUD bottom-right e nome app TMAR GIS Tool, candidata 292

Correzione esatta richiesta: lasciare PUNTO/CURSORE e © OpenStreetMap contributors ancorati in basso a destra, alzare la colonna strumenti affinché GPS resti ad almeno un altezza di pulsante (44px) sopra PUNTO. Nome pubblico: TMAR GIS Tool. 291 non riceve PASS umano.

Candidata 292: CSS desktop elimina right=96px HUD introdotto in 291 e imposta bottom=235px nella toolbar, ripristinando gli ancoraggi di 290. A 1440x634/1366x768/1920x1080 distanza geometrica 46px dal GPS alla prima riga PUNTO, no overlap; scroll su viewport corti. Branding aggiornato in header/footer/meta/document.title/i18n IT-EN-FR/export metadata; note storiche mantenute. Mobile solo nome, layout non cambiato.

Source b8a3a6c18e29ba382df0c6e6b3c1a4ea3f9f22c9, blob fc432b1ca383f6abe168286084b7961e96c6908f, SHA256 a71206104ac0944edac4da5ffecece4321cddea53c9fb016160f2866e2af8917, 11.120.400 byte. Browser candidata 16/16 geometria, 9/9 brand, 76/76 toolbar, 25/25 Waypoint; Node 2/2, CR 192, zero POST. Branding selftest 17/18: unico fail storico hardcoded Build 234 preesistente. Review routine 23/23 PASS. Non LIVE. [Dossier](orchestrator/evidence/2026-11-12-toolbar-bottom-right-292/REPORT.md).

## Checkpoint 2026-11-12 — Build 291 LIVE, collisioni HUD risolte tecnicamente

Build 291 source a32bf2b5eede5ffcfbc0307eda8b4a0171edb6e9, blob 76211816541dbf54651171f7febe4f5150ff4ae3, SHA256 35d5dc79bc6e48e8d8d0558743411311e7fcfeb66db56218c5d07d908b3c46e5, 11.120.857 byte. Deploy GIS-only: preflight main pulito, backup verificato della 290 (/var/backups/goi-gis-runtime/20261112T091009Z-build291), fast-forward, unico restart goi-gis-app.service (PID 30305), smoke HTTP interno e HTTPS /gis PASS. Nginx, proxy, ORS, altri servizi, dati GIS e telefono non modificati.

ABQA HTTPS nativa Edge sulla versione realmente servita, senza iniezione HTML: **14/14 PASS anti-overlap** (7 viewport desktop fra 960×540 e 1920×1080, scroll top/bottom), **76/76 PASS toolbar due gruppi** e **25/25 PASS Waypoint**, 115/115 complessivi, 0 POST. Risorse esterne bloccate: 226+454+304 su run distinti. Console/pageerror generali non misurati separatamente. Elementi cartografici PUNTO/CURSORE e OpenStreetMap restano ≥18px a sinistra della toolbar, anche a finestra bassa; l'area legenda/scala resta priva di nuove collisioni. [Deploy](orchestrator/evidence/2026-11-12-desktop-toolbar-291-hud-safe/DEPLOY-RESULT-291.md) · [QA LIVE](orchestrator/evidence/2026-11-12-desktop-toolbar-291-hud-safe/QA-LIVE-291.md).

GATE residuo: QA OPERATORE DESKTOP 291 PENDING, lo screenshot precedente resta finding 290. Sviluppo telefono in pausa.

## Checkpoint 2026-11-12 — FAIL visiva Build 290, candidata anti-overlap 291

Sullo screenshot utente i pulsanti Nuovo punto e GPS si sovrappongono a PUNTO/CURSORE e OpenStreetMap. Reproduzione automatizzata HTTPS su 290 LIVE: collisioni a cinque viewport desktop, scrollbar top/bottom. La QA 290 resta NON PASS. I due elementi del HUD dati sono entrambi ancorati a destra come la barra strumenti.

Candidata 291: CSS desktop min-width:960px hover/pointer fine, due riquadri HUD .tile-readout e .tile-attrib spostati a right:96px (barra right:10px width:68px), garantendo 18px liberi senza nascondere i pulsanti. Max-width del readout 55%. Nessun cambiamento a gruppi blu/teal, JS funzionale, mobile, OPSEC o GPS. Source a32bf2b5eede5ffcfbc0307eda8b4a0171edb6e9; blob 76211816541dbf54651171f7febe4f5150ff4ae3; SHA256 35d5dc79bc6e48e8d8d0558743411311e7fcfeb66db56218c5d07d908b3c46e5; bytes 11.120.857.

Test candidata: 14/14 anti-overlap su 7 viewport e due scroll, 76/76 regressione toolbar dual-groups, 25/25 Waypoint, POST zero. Review routine 16/16 PASS. **Non deploy** a questo checkpoint. [Dossier](orchestrator/evidence/2026-11-12-desktop-toolbar-291-hud-safe/REPORT.md).

## Checkpoint 2026-11-11 — PASS operatore tardivo della toolbar FIX2 287, senza effetto sul gate 290

L'operatore ha inviato in questa chat la riga esatta `QA GIS-DESKTOP-RIGHT-TOOLBAR-LABELS-A-FIX2 PASS operatore` il **11 novembre 2026**, quando l'autorità remota `origin/main` era già avanzata alla Build **290**. Attestazione acquisita come **evidenza storica riferita alla 287**, non come QA della 290. Al momento dell'avvio della successiva 288 la QA della 287 non era ancora approvata: tale fatto storico rimane corretto. Dopo la 287 era stato richiesto esplicitamente il cambio di orientamento da fila orizzontale a colonna verticale, poi confluito nel layout a due gruppi della 290: **questa direttiva successiva non è revocata** dal PASS tardivo.

Nessun rollback, merge, deploy o ripristino della 287. Il blocco LIVE resta `GIS-DESKTOP-TOOLBAR-DUAL-GROUPS-A`, con gate **QA OPERATORE DESKTOP 290 PENDING**. Questo PASS non attesta la grafica, l'allineamento Livelli né le posizioni GPS/Nuovo punto della 290. [Evidenza e conciliazione cronologica](orchestrator/evidence/2026-11-11-toolbar-287-delayed-operator-qa/REPORT.md).

## Checkpoint 2026-11-11 — Build 290 LIVE, QA HTTP/HTTPS e browser PASS

Build 290 con source 56d336a3942028836924f68af322d36996095b15, blob f8c469e39e2c647b2bde377e5ac1b6b7e90683cc, SHA256 7d69fc145779f223c570e9596e23b497ab678329d4b495ebc03567301f010e69, 11.120.343 byte. Dopo review 22/22 PASS, preflight, backup Build 289 in /var/backups/goi-gis-runtime/20261111T143022Z-build290, pull FF su main, restart del solo goi-gis-app.service e smoke HTTP/HTTPS VPS PASS. Nessuna modifica a proxy, gateway, altri servizi o OPSEC.

ABQA **HTTPS nativa Edge** sulla versione realmente servita: **76/76 PASS** layout/stati su 5 viewport desktop e 1 mobile emulato, 0 POST, 500 risorse terze bloccate; regressione Waypoint **25/25 PASS** con 0 POST e 304 risorse terze bloccate. Tutte le etichette, Livelli allineato, navigazione blu alto, strumenti verde acqua verso bottom, GPS sopra footer; sui desktop bassi scroll. Screenshot candidato 1440 ispezionato e difetto di footer corretto prima del deploy. Console/pageerrors non misurati separatamente, provider tile reali bloccati durante QA. [Deploy](orchestrator/evidence/2026-11-11-toolbar-dual-groups-290/DEPLOY-RESULT-290.md) · [ABQA](orchestrator/evidence/2026-11-11-toolbar-dual-groups-290/QA-LIVE-290.md).

**Gate residuo:** QA OPERATORE DESKTOP grafica 290 PENDING, non dedotta dalla QA tecnica. Sviluppo telefono in pausa, FIX3 288 QA umana distinta.

## Checkpoint 2026-11-11 — candidata grafica desktop Build 290 (predeploy)

Build 290, source 56d336a3942028836924f68af322d36996095b15, blob f8c469e39e2c647b2bde377e5ac1b6b7e90683cc, SHA256 7d69fc145779f223c570e9596e23b497ab678329d4b495ebc03567301f010e69, 11.120.343 byte. Modifiche solo CSS desktop e tre metadati. Due gruppi in colonna sulla destra: navigazione blu (Livelli, +, −, Zoom area, Livello zN) fissata in alto, strumenti operativi verde acqua (Misura, Traccia, Poligoni, R&B, Waypoint, Nuovo punto, GPS) verso il fondo sopra footer; Livelli allineato esattamente agli altri tasti. Su schermi bassi barra scrollabile, mobile CSS esclusa. QA candidata Edge in origin HTTPS con HTML iniettato: **76/76 PASS** su sei viewport e **25/25 PASS** regressione Waypoint, POST 0. Screenshot 1440x900 verificato: prima iterazione fermata per sovrapposizione al footer, seconda corretta e collaudata. Review routine 22/22 PASS; no HTML LIVE sostituito a questo checkpoint. [Rapporto](orchestrator/evidence/2026-11-11-toolbar-dual-groups-290/REPORT.md).

## Checkpoint 2026-11-11 — Waypoint 289 CLOSED e NEXT toolbar dual-groups desktop

Attestazione operatore ricevuta: `QA GIS-WAYPOINT-CLOSE-UNSAVED-A PASS operatore`. Review GPT routine 20/20 PASS, deploy GIS-only e ABQA HTTPS nativa 25/25 PASS erano già conclusi. Secondo Regola H il blocco `GIS-WAYPOINT-CLOSE-UNSAVED-A` è **CLOSED / QA PASS operatore**. La chiusura è solo documentale: Build 289 LIVE invariata, nessun nuovo deploy o restart. Il PASS umano non viene convertito retroattivamente in QA automatizzata di click mappa reale.

Nuovo NEXT già richiesto: toolbar desktop con due gruppi nella colonna destra, navigazione alta (Livelli, Zoom+, Zoom−, Zoom area, Livello zN) e strumenti in basso (Misura, Traccia, Poligoni, R&B, Waypoint, Nuovo punto, GPS); differenziare bordi/colori/icone e correggere allineamento Livelli. Mobile resta immutato; QA operatore del precedente FIX3 toolbar 288 non dedotta dal PASS Waypoint. [Rapporto](orchestrator/evidence/2026-11-11-waypoint-289-operator-closure/REPORT.md).

## Checkpoint 2026-11-11 — Waypoint Build 289 LIVE, ABQA HTTPS PASS

Source 214e6ea248f4d390bfd1c79b12b95123f93642f0, blob 6a4a2639e6b2a205ee26ab38778e5b85b3ad6d0b, SHA256 19be22d478262c6ad7f1dbb9ef4c7a0706a8d58bf2a39236fb02750129e45107, bytes 11.116.484. Backup Build 288 /var/backups/goi-gis-runtime/20261111T140024Z-build289, Git fast-forward, restart del solo servizio GIS, smoke su HTTP interno e HTTPS /gis PASS. ABQA Edge su documento HTTPS **nativo**, senza HTML iniettato: **25/25 PASS**, POST 0, 304 risorse esterne bloccate. Apri e chiudi Waypoint dal pulsante/X senza conferma se draft vuoto; coordinate inserite ma non salvate producono conferma, Annulla conserva i dati, Scarta chiude.

Limite: stato draft gia posizionato provato via contratto deterministico nella candidata (32/32 PASS), mentre clic mappa diretto non riprodotto dall harness; non e attestato un test UI completo di posizionamento. Nessun salvataggio dati reali; telefoni in pausa. [Deploy](orchestrator/evidence/2026-11-11-waypoint-close-289/DEPLOY-RESULT-289.md) · [QA LIVE](orchestrator/evidence/2026-11-11-waypoint-close-289/QA-LIVE-289.md).

## Checkpoint 2026-11-11 — Waypoint close UX, candidata 289

L operatore chiede: pulsante Waypoint o X chiudono senza avviso se nessun waypoint e stato posizionato o modificato; presenza di coordinate/draft non salvati deve mantenere il blocco di conferma. Il pannello in GIS entra subito in pickMode anche da vuoto: tale sola modalita non e una modifica. Corretto il false positive in waypointModalUnsavedCloseRisk, mantenuto il controllo reale su trackWaypointDraft ed editor modificato; quando il pannello e gia aperto, clic Waypoint chiama requestWaypointModalClose invece di rilanciare Nuovo waypoint.

Candidato 289 source 214e6ea248f4d390bfd1c79b12b95123f93642f0, SHA-256 19be22d478262c6ad7f1dbb9ef4c7a0706a8d58bf2a39236fb02750129e45107, solo monolite. Edge candidata: 25/25 PASS su apertura, chiusura da Waypoint e X, editor coordinate e Annulla/Scarta; 32/32 PASS sul contratto di stato del waypoint posizionato con draft impostato deterministicamente, non equivale a clic mappa reale (prova diretta inconcludente). 0 POST. Review 20/20 PASS. [Dossier](orchestrator/evidence/2026-11-11-waypoint-close-289/REPORT.md).

## Checkpoint 2026-11-11 — Build 288 LIVE e ABQA HTTPS nativa PASS

Deploy GIS-only Build 288: preflight backup 287 in /var/backups/goi-gis-runtime/20261111T114016Z-build288, aggiornamento main fast-forward, restart del solo goi-gis-app.service, smoke HTTP 8000 e HTTPS /gis con SHA256 ce97e3b72e2e17e383417c777509889cd74cebe144f6751f4fda89829f28209b e 11.116.411 byte PASS. Il clone VPS e stato verificato clean dopo il deploy; servizi condivisi e proxy non modificati.

QA Edge HTTPS **NATIVA**, senza iniezione document: **62/62 PASS**, 0 POST, 462 richieste a provider esterni bloccate durante il test. 5 viewport desktop (960,1024,1366,1440,1920 px) e 390px mobile emulato: 12 pulsanti in **colonna verticale**, etichette, compatti 62x44, accessibili; sullo schermo 960x650 lo scroll interno raggiunge GPS; Traccia resta separata da Poligoni/R&B. Browser console e pageerror non rilevati separatamente. [Deploy](orchestrator/evidence/2026-11-11-desktop-toolbar-288-vertical/DEPLOY-RESULT-288.md) · [QA LIVE](orchestrator/evidence/2026-11-11-desktop-toolbar-288-vertical/QA-LIVE-288.md).

Gate: QA OPERATORE DESKTOP 288 PENDING. La 287 non riceve PASS retroattivo. Sviluppo telefono in pausa.

## Checkpoint 2026-11-11 — correzione orientamento toolbar: candidata 288 verticale

Feedback operatore sulla 287: la fila deve essere **verticale**, non orizzontale. La 287 NON ha PASS operatore; resta LIVE soltanto finche la 288 non completa i gate. Sviluppo telefono in pausa.

Build 288, source d4e9821e180f82a33bb506c48b5c1d683a8cb82a, blob 67fb15263fc5a6d2461552f33fd3d6165f66c466, SHA256 ce97e3b72e2e17e383417c777509889cd74cebe144f6751f4fda89829f28209b, 11.116.411 byte; CSS solo GIS desktop a partire da 960px con pointer fine, una **colonna** di 12 pulsanti 62x44px, nomi sotto. Su viewport bassi colonna scorrevole per raggiungere tutti i comandi, popup Livelli preservato. Stato indipendente Traccia/Poligoni/R&B della 287 mantenuto. Review ROUTINE 21/21 PASS, Node inline 2/2, CR 192 invariati. Browser candidata con documento iniettato, HTTPS origin VPS: **62/62 PASS** (1440,1366,1920,1024,960 desktop e 390 mobile emulato), 0 POST, 486 richieste esterne bloccate. Nessun deploy 288 a questo checkpoint. [Dossier](orchestrator/evidence/2026-11-11-desktop-toolbar-288-vertical/REPORT.md).

## Checkpoint 2026-11-11 — Build 287 LIVE, QA nativa 60/60 PASS

Deploy GIS-only dal main 43b4ad610b56e57e49febe0ec9392e150dee0c26, source runtime d69a21a1cb3f09828a51b342c91bec50f2e88380, blob 71e2931bbff30ea81b5fbbc17d071953618af3d1, SHA-256 fdb28dd544a4f138b4e249b6fbc1d2257029e9fecff0fa5fd93fddf27fc559db, 11.115.745 byte. Preflight PASS dopo correzione di due path nel manifest del launcher (prima esecuzione fermata senza effetti), backup Build 286 /var/backups/goi-gis-runtime/20261111T103743Z-build287, git pull FF, unico restart goi-gis-app.service. Smoke HTTP 8000 e HTTPS /gis PASS, hash verificato anche su AsusDesktop.

ABQA LIVE Edge HTTPS su HTML realmente servito (nessuna injection): **60/60 PASS** su cinque viewport Windows (960×650, 1024×768, 1366×768, 1440×900 e 1920×1080) e mobile emulato 390×844. 12 icone in fila unica orizzontale, 64×50 px, caption leggibili tecnicamente e non tagliate; Poligoni/R&B non attivano Traccia, che si attiva sul proprio pannello. Zero POST, 467 accessorie esterne bloccate. Primo runner LIVE 55/60 per 5 attese geometriche stale del solo test (minimo 52 px contro 50 px richiesti); dopo correzione soglie e ripetizione intera, 60/60 PASS. Console/pageerror generale non acquisiti separatamente.

[Deploy](orchestrator/evidence/2026-11-11-desktop-toolbar-287/DEPLOY-RESULT-287.md) · [QA LIVE](orchestrator/evidence/2026-11-11-desktop-toolbar-287/QA-LIVE-287.md).

GATE: **QA OPERATORE DESKTOP Build 287 PENDING**. Nessun PASS generale delle 38 finestre, sviluppo telefono in pausa.

## Checkpoint 2026-11-11 — feedback operatore su toolbar 286 e candidata FIX2 287

L'operatore segnala due difetti della Build 286 LIVE: cliccando Poligoni o R&B si illumina anche Traccia; inoltre richiede che tutti i comandi destra siano su un'unica fila orizzontale, leggermente più piccoli, etichette sottostanti. Non è un PASS umano 286, e il blocco FIX1 non è chiuso con PASS.

La candidata Build 287 cambia due punti di calcolo aria-pressed/class Traccia (GIS desktop soltanto) e il CSS toolbar desktop: fila unica orizzontale con pulsanti 64×50 px invece di 84×62, etichette preservate; Mobile resta invariato tramite la media query 960px/pointer fine/hover. JS syntax 2/2 PASS, CR 192 invariati.
Source d69a21a1cb3f09828a51b342c91bec50f2e88380, blob 71e2931bbff30ea81b5fbbc17d071953618af3d1, SHA-256 fdb28dd544a4f138b4e249b6fbc1d2257029e9fecff0fa5fd93fddf27fc559db. QA browser candidato HTTPS con documento iniettato **48/48 PASS** su 960×720, 1024×768, 1366×768, 1440×900, 1920×1080, 390×844, POST 0 e 503 accessorie bloccate. Review routine **22/22 PASS**. **Non distribuita a questo checkpoint**.
[Dossier](orchestrator/evidence/2026-11-11-desktop-toolbar-287/REPORT.md).

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
