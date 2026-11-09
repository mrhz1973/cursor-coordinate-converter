# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Routing terrestre senza traghetti |
| **WU ATTIVA** | — (ripresa a livello blocco; nessuna WU in esecuzione) |
| **BLOCCO ATTIVO** | `ROUTING-LAND-ONLY-NO-FERRY-A` |
| **STATO BLOCCO** | Build 280 live con difese no-ferry, validazione metadati/snap/anchor, deadline ORS e correzioni UI alternative/Compare. Gate tecnici e browser live PASS; validazione operatore e review esterna post-hoc ancora aperte. |
| **GATE CORRENTE** | QA operatore residua sul territorio e telefono reale, con i soli 3 casi collegati sotto; review esterna post-hoc pendente secondo REVIEW GPT-SOSTITUTIVA. Nessun PASS operatore o FINITO attribuito. |
| **RUNTIME LIVE** | Build 280 · SHA-256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` · 11.108.654 byte · file VPS, HTTP, HTTPS e documento browser concordi; deploy 2026-11-09 14:32:47 Europe/Rome |
| **RUNTIME CANDIDATE** | Nessun candidato ulteriore per questo pass. Il definitivo 70553e52… è distribuito; il precedente 1e6c11cf… resta l'identità delle prove iniziali sui componenti invariati. |
| **NEXT** | Raccogliere i 3 esiti di QA operatore già preparati e completare la review esterna post-hoc; poi applicare il gate canonico pertinente. Nessuna nuova approvazione richiesta per quanto già eseguito. Altri workstream non avviati. |
| **EVIDENCE** | [Rilascio HTTPS/Build 280](orchestrator/evidence/2026-11-09-https443-release-280/REPORT.md) · [QA operatore residua](orchestrator/evidence/2026-11-09-https443-release-280/QA-OPERATORE.md) · [Prove iniziali e pacchetto](orchestrator/evidence/2026-11-09-gpt-routing-280/REPORT.md) |
| **VPS VERIFICATO** | IONOS `31.70.139.73`, tailnet `100.99.54.93`; HTTPS `https://ionos-n8n-new.tailc01234.ts.net/gis`. Proxy loopback 18080 attivo/abilitato, Nginx e Origin ORS applicati dopo approvazione specifica. Deploy runtime: restart solo GIS, configurazioni e servizi condivisi preservati. Non usare il vecchio alias SSH. |
| **ALTRI WORKSTREAM** | Restano evoluzione waypoint/tracce, 3D, mobile e interoperabilità formati ATAK; audit uniformità finestre richiesto. |

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
