# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Routing terrestre senza traghetti |
| **WU ATTIVA** | — (ripresa a livello blocco; nessuna WU in esecuzione) |
| **BLOCCO ATTIVO** | `ROUTING-LAND-ONLY-NO-FERRY-A` |
| **STATO BLOCCO** | Difese no-ferry e HTTPS integrate nel candidato Build 280 sulla base 279; QA isolata PASS. La Build 279 live resta priva di tali difese e non garantisce percorsi senza traghetti. |
| **GATE CORRENTE** | Approvazione della modifica infrastrutturale HTTPS 443, esclusa dalla standing authorization runtime. Pacchetto e rollback pronti, collaudo isolato PASS. UI/provider reali, TLS reale e avvio del nuovo servizio ancora NON_VERIFICATI. |
| **RUNTIME LIVE** | Build 279 · SHA-256 `bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253` · 11.082.679 byte · file e HTTP VPS concordano, verificati 2026-11-09 |
| **RUNTIME CANDIDATE** | Build 280 · SHA-256 `1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a` · 11.108.273 byte · staging Windows, non committato né distribuito. QA: routing browser 54/54, timeout 15/15, geodesia 2.112/2.112 + 96 invalidi, UI geografica 24/24, sintassi 2/2 PASS. |
| **NEXT** | Ottenere approvazione del pacchetto HTTPS 443 già revisionabile; quindi applicarlo con guardie hash, verificare UI/provider reali sul candidato e completare i gate prima di pubblicare/distribuire Build 280. Nessuna nuova approvazione richiesta per il solo runtime quando i gate saranno PASS. |
| **EVIDENCE** | [Ripresa GPT Build 280](orchestrator/evidence/2026-11-09-gpt-routing-280/REPORT.md) · [Pacchetto HTTPS 443](orchestrator/evidence/2026-11-09-gpt-routing-280/infra/README.md) · [Build 276](orchestrator/evidence/2026-11-04-mobile-portrait-276/REPORT.md) · [Routing indipendente](orchestrator/evidence/2026-10-30-routing-live-independent/REPORT.md) · [Ferry profiles](orchestrator/evidence/2026-10-30-routing-ferry-profiles/report.md) |
| **VPS VERIFICATO** | IONOS `31.70.139.73`, tailnet `100.99.54.93`; verifica 2026-11-09: HTTP Build 279, hash configurazioni e PID servizi invariati pre/post collaudo isolato. Nessun reload/restart live eseguito. Non usare il vecchio alias SSH. |
| **ALTRI WORKSTREAM** | Restano evoluzione waypoint/tracce, 3D, mobile e interoperabilità formati ATAK; audit uniformità finestre richiesto. |

## Checkpoint 2026-11-09 — ripresa GPT e routing Build 280

Recuperato lo staging originale e riallineato il routing alla Build 279. Il candidato Build 280 aggiunge anche una deadline complessiva al confronto ORS e corregge la falsa classificazione dei 404 ORS come assenza di percorso terrestre. Corretto il riferimento del self-check Roma–Abidjan; algoritmi MGRS/Converti invariati. Le prove correnti sono sullo SHA completo indicato nella tabella: 54 casi browser con provider simulati, 15 timeout, 2.112 controlli geografici su 72 punti, 96 invalidi e 24 casi UI. I 13 casi compare storici non sono dichiarati riprodotti: gli harness recuperati ne coprono 9, inclusi nei 54.

Il pacchetto HTTPS propone un proxy loopback, un include Nginx e un solo Origin aggiuntivo nel gateway ORS. Dieci gruppi di collaudo, compresi 14 negativi GH, sono PASS in ambiente temporaneo sul VPS; i servizi live non sono stati modificati. Applicazione e rollback sono documentati. La decisione residua è l'approvazione dell'infrastruttura, poi QA reale e gate runtime. La precedente conferma iPhone del 5 novembre riguarda la Build 277 e resta storico; non è PASS operatore della Build 280.

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
