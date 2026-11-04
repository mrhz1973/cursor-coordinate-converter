# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Stabilità landscape iPhone Build 273; dopo retest, routing terrestre senza ferry |
| **WU ATTIVA** | — (ripresa a livello blocco; nessuna WU in esecuzione) |
| **BLOCCO ATTIVO** | `MOBILE-IOS-LANDSCAPE-STABILITY-273` |
| **STATO BLOCCO** | Build 273 è pubblicata su GitHub e VPS. Il confronto Edge con viewport landscape variabile ha ridotto lo scarto transitorio mappa da 17–22 px a 0 px su due profili; Layer e maniglia barra rispondono dopo la sequenza. Safari/Chrome iOS fisico restano da verificare. |
| **GATE CORRENTE** | [Report Build 273](orchestrator/evidence/2026-11-04-ios-landscape-stability/REPORT.md): confronto stress 844×390 e 667×375 PASS, geometria stabile, Layer raggiungibile. [QA live](orchestrator/evidence/2026-11-04-ios-landscape-stability/postdeploy-results.json): Build 273, layer e barra touch PASS su entrambi i profili, zero errori JS. Deploy strict e verifica SSH indipendente PASS: runtime e HTTP SHA `4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a`; GIS active, servizi non GIS e n8n invariati. Safari/Chrome iOS reale, animazione di rotazione fisica e provider cartografici restano da verificare. |
| **RUNTIME LIVE** | Build 273 · SHA-256 `4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a` |
| **RUNTIME CANDIDATE** | Nessuno; Build 269 più ampia resta preservata nel ramo `candidate/build269-20261103`. |
| **NEXT** | Ricaricare [Build 273](http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=273) su Safari iPhone e provare in landscape: ruotare il telefono, attendere che la barra di Safari si assesti, toccare Layer e alcuni pulsanti. Se ora è stabile, fare un controllo rapido anche in portrait e riprendere `ROUTING-LAND-ONLY-NO-FERRY-A`; se il tremolio rimane, indicare modello iPhone e versione iOS/Safari per restringere la diagnosi. |
| **EVIDENCE** | [Diagnosi e QA Build 273](orchestrator/evidence/2026-11-04-ios-landscape-stability/REPORT.md) · [Esito deploy Build 273](orchestrator/evidence/2026-11-04-ios-landscape-stability/DEPLOY-RESULT.md) · [QA live Build 273](orchestrator/evidence/2026-11-04-ios-landscape-stability/postdeploy-results.json) · [Diagnosi, QA e screenshot Build 272](orchestrator/evidence/2026-11-03-ios-layer-flicker/REPORT.md) · [Routing runtime](orchestrator/evidence/2026-11-03-routing-runtime-tailnet/REPORT.md) |
| **VPS VERIFICATO** | IONOS `31.70.139.73`, tailnet `100.99.54.93`. SSH strict verificato come `root` sull’IP corretto; alias locale `ionos-n8n` punta ancora al vecchio IP e non va usato. Runtime Build 273; GIS active; proxy, GraphHopper, ORS e n8n invariati. |
| **ALTRI WORKSTREAM** | Restano evoluzione waypoint/tracce, 3D, mobile e interoperabilità formati ATAK; audit uniformità finestre richiesto. |

## Ripresa — 2026-11-03

L’utente ha dato priorità al menu Layer su iOS, che su Build 270 si apriva e si chiudeva subito in Safari e Chrome. Build 271 sostituisce il listener outside-dismiss `mousedown` con `pointerdown` quando disponibile e conserva il fallback mouse. QA Edge touch/fallback e confronto Build270/271 PASS; la sequenza nativa non è stata registrata su iPhone reale. Il commit `173611f27299662bcc203212d063158ee411a5cf` è live su GitHub e VPS. Deploy strict PASS; runtime locale e HTTP hanno lo stesso SHA-256. Proxy, GraphHopper, ORS e n8n sono rimasti invariati. Il checkpoint aperto è il retest di Nicola su Safari e Chrome iOS, poi routing terrestre senza ferry.

Build 272 aggiunge l’apertura e la chiusura Layer senza ridisegnare la mappa, e compatta la barra in landscape a 48 px con navigazione a sinistra, titolo centrato e controlli a destra sulla stessa linea. Build 272 è live su GitHub e VPS. QA locale su sei profili e post-deploy Edge touch su due viewport landscape PASS; HTTP/runtime SHA corrispondono e gli altri servizi sono rimasti invariati. Il replay live blocca i provider esterni; il retest su iPhone fisico resta necessario. Dati e limiti completi: [REPORT Build 272](orchestrator/evidence/2026-11-03-ios-layer-flicker/REPORT.md) e [deploy](orchestrator/evidence/2026-11-03-ios-layer-flicker/DEPLOY-RESULT.md).

La QA Build 270 usava Edge Chromium touch; WebKit/Safari reale e caricamento dei provider esterni non erano stati verificati. Build 271 è una mitigazione candidata; il retest richiesto è descritto sopra. Dopo quel checkpoint, riprendere `ROUTING-LAND-ONLY-NO-FERRY-A` con i gate provider/browser già documentati.

## Ripresa — 2026-11-04

L’utente ha riferito che Build 272 su iPhone landscape oscillava e rendeva i pulsanti difficili da premere. Il confronto del codice ha isolato come ipotesi le transizioni di altezza da 180 ms aggiunte alla mappa e alla barra mentre la mappa usa `100dvh`. Build 273 rimuove solo queste transizioni. Il replay di sette altezze variabili in Edge touch ha misurato uno scarto massimo di 17,23 px (844×390) e 22 px (667×375) su Build 272, contro 0 px su Build 273; il tocco Layer e la maniglia barra sono rimasti utilizzabili. Commit `450c83188956401ce098747879195ac3b20932f4`, runtime SHA `4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a`, distribuito e verificato via HTTP/SSH. Il test resta emulazione Chromium, non prova Safari fisico né la UI dinamica del browser iOS; il retest dell’utente è il gate residuo.

## Checkpoint di pausa — 2026-10-30

Pausa richiesta dall'utente; nessun lavoro automatico fino alla ripresa. L'app LIVE resta build 268: il candidato build 269 SHA-256 `33e8d90257e56dba0bdf47de9776b018f301a103c5688ad124aab10bf953f548` è su GitHub ma non è stato distribuito. QA locale scoped e prove provider parziali sono collegate sopra; non attestano la chiusura dei gate.

Rilievi preliminari degli agenti interrotti, **da riprodurre e verificare alla ripresa**, senza dichiararli corretti:

1. Import GIS: scegliendo un GeoJSON scaricato tramite selettore file, l'anteprima può restare vuota; possibile causa FileList live letto dopo reset dell'input. Verificare selezione, drag-and-drop, ripetizione e ciclo save→reload→export→import di tracce e poligoni.
2. MGRS: `32NNA0000000000` e `32MNF0000050000` risultano accettati ma i quadrati ricadono nell'emisfero opposto. Analisi e possibile fix erano in staging; riesaminare con riferimenti indipendenti e prove positive/negative.
3. Routing/OPSEC: agente riferisce 24 controlli mock aggiuntivi passati nel proprio perimetro; matrice, timeout/fallback e prove reali runtime non erano complete né revisionate. Riprendere dal materiale di staging e documentare i risultati sul byte esatto.

Le attività degli agenti sono state interrotte prima delle consegne finali: non assumere completate le loro prove. Il lavoro intermedio potrebbe trovarsi nella cartella locale `work/` non tracciata o nella directory di lavoro della chat; non cancellarla. L'utente ha chiesto di riprendere lunedì, senza programmare un'automazione.
