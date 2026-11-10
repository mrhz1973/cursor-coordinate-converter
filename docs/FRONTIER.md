# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Uniformità e controlli delle finestre GIS |
| **WU ATTIVA** | — (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | `GIS-FAVORITES-MINIMIZED-ESCAPE-A` |
| **STATO BLOCCO** | Build 282 candidata: due manifestazioni desktop riprodotte nella 281 live, una correzione funzionale circoscritta. Sintassi 2/2 PASS; QA candidata e review downstream pendenti. Build 281 resta live. |
| **GATE CORRENTE** | Regressione candidata desktop e REVIEW GPT-SOSTITUTIVA downstream dal commit immutabile, prima del deploy. |
| **RUNTIME LIVE** | Build 281 · source commit `0c0f6785654dbba279774bb8569788088f0762e9` · blob `3dcff61081a2f461f8841953986ced17b058eab1` · SHA-256 `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62` · 11.108.861 byte. Deploy 2026-11-09 17:17:38; ABQA conclusa 17:18:57 Europe/Rome. |
| **RUNTIME CANDIDATE** | Build 282 · blob `4636ad186934b0d2f43e8564c9e657cdcdfc652e` · SHA-256 `71267f1a9d95488adf527db40333c811c2beeef0c9051e98ee5673debb5a7399` · 11.108.980 byte. Un guard su Escape/Preferiti e tre metadati; tutti gli altri byte invariati. |
| **ULTIMO BLOCCO CHIUSO** | `GIS-WINDOW-CONTROLS-A` · PASS operatore esplicito del 2026-11-10; [chiusura e direttiva telefono](orchestrator/evidence/2026-11-10-window-controls-281-closure/REPORT.md). |
| **NEXT** | Completare QA candidata desktop e review downstream; se PASS, deploy standard circoscritto e ABQA HTTPS nativa. Nessuno sviluppo o test specifico per telefono. D-Flight e altre priorità Escape restano da riprodurre. |
| **SVILUPPO TELEFONO** | **PAUSA fino a nuovo ordine dell'utente**, limitatamente a TMAR GIS Tool, dal 2026-11-10. Proseguire con il backlog desktop; la direttiva non rimuove o disabilita le funzioni mobili esistenti. [Attestazione e scope](orchestrator/evidence/2026-11-10-window-controls-281-closure/REPORT.md). |
| **FOLLOW-UP REVIEW** | Review AI esterna routing 280 e finestre 281 non eseguita; backstop post-hoc sul percorso GPT sostitutivo loggato. Non blocca i gate già soddisfatti e non è dichiarata completata. |
| **EVIDENCE** | [Rilascio finestre 281](orchestrator/evidence/2026-11-09-gis-window-controls-281/REPORT.md) · [ABQA live](orchestrator/evidence/2026-11-09-gis-window-controls-281/QA-WINDOWS-281-POSTDEPLOY.md) · [Chiusura routing 280](orchestrator/evidence/2026-11-09-routing-280-operator-closure/REPORT.md) · [Astro desktop PC lavoro](orchestrator/evidence/2026-11-10-workpc-astro-281/REPORT.md) · [Chiusura finestre 281](orchestrator/evidence/2026-11-10-window-controls-281-closure/REPORT.md) · [Preferiti/Escape 282](orchestrator/evidence/2026-11-10-favorites-escape-282/REPORT.md) |
| **VPS VERIFICATO** | IONOS `31.70.139.73`, tailnet `100.99.54.93`; HTTPS `https://ionos-n8n-new.tailc01234.ts.net/gis`. Unico restart GIS; Nginx, gateway ORS, proxy HTTPS, configurazioni/listener/endpoint condivisi preservati. Backup e journal nel rapporto deploy. |
| **ACCESSO OPERATIVO — sessione al PC del lavoro** | 2026-11-10: su richiesta esplicita dell'utente, Remote Desktop Commander originale sul PC DESKTOP-DPIJL64. Comandi, Git e prova HTTPS nativa Astro desktop verificati. Autonomia dal PC e accesso SSH diretto non attestati in questo pass. La precedente scelta TMAR/ASUS resta [storico del 9 novembre](orchestrator/evidence/2026-11-09-vps-direct-access/TMAR-ROUTE-CORRECTION.md); non è il connettore selezionato per questa sessione. [Prova ed evidenze](orchestrator/evidence/2026-11-10-workpc-astro-281/REPORT.md). |
| **ALTRI WORKSTREAM** | Nessun PASS generale delle 38 finestre. Preferiti minimizzato su Escape riprodotto e in correzione nel blocco attivo; D-Flight e priorità fisse Escape restano candidati statici. Altri workstream e freeze Oggetti GIS invariati. |

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
