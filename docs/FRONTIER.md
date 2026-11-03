# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Menu Layer iOS Build 271; dopo retest, routing terrestre senza ferry |
| **WU ATTIVA** | — (ripresa a livello blocco; nessuna WU in esecuzione) |
| **BLOCCO ATTIVO** | `MOBILE-IOS-LAYER-RETEST-271` |
| **STATO BLOCCO** | Build 271 è pubblicata su GitHub e VPS. Replay Edge touch e fallback superati; retest su iPhone reale ancora richiesto prima di dichiarare risolto il difetto segnalato. |
| **GATE CORRENTE** | [Confronto Build 270/271](orchestrator/evidence/2026-11-03-layer-ios-dismiss/touch-compat-results.json): evento `mousedown` tardivo simulato chiude 270 e non 271. [Replay Build 271](orchestrator/evidence/2026-11-03-layer-ios-dismiss/selection-results.json): apertura, toggle, chiusura esterna, selezione layer, fallback e `pageErrors=0` su 4 profili. Deploy strict PASS: runtime locale, VPS e HTTP SHA `7f96e58ea912cd9c017c225b1d12276f5ef397c55b3e4ee6c8bfbd11c5b76ea8`; GIS active, servizi non GIS e n8n invariati. Questi controlli non dimostrano l’ordine eventi nativo su iOS. |
| **RUNTIME LIVE** | Build 271 · SHA-256 `7f96e58ea912cd9c017c225b1d12276f5ef397c55b3e4ee6c8bfbd11c5b76ea8` |
| **RUNTIME CANDIDATE** | Nessuno; Build 269 più ampia resta preservata nel ramo `candidate/build269-20261103`. |
| **NEXT** | Nicola ricarica [Build 271](http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=271) su Safari e Chrome iOS, prova l’icona Layer e conferma che il menu resti aperto e che una mappa si selezioni. Se passa, riprendere `ROUTING-LAND-ONLY-NO-FERRY-A`; se no, chiedere una breve registrazione e continuare la diagnosi WebKit. |
| **EVIDENCE** | [Diagnosi e QA Layer iOS 271](orchestrator/evidence/2026-11-03-layer-ios-dismiss/REPORT.md) · [Esito deploy Build 271](orchestrator/evidence/2026-11-03-layer-ios-dismiss/DEPLOY-RESULT.md) · [Script deploy](orchestrator/evidence/2026-11-03-layer-ios-dismiss/deploy-gis-build271.sh) · [QA mobile Build 270](orchestrator/evidence/2026-11-03-mobile-layer-hotfix/REPORT.md) · [Routing runtime](orchestrator/evidence/2026-11-03-routing-runtime-tailnet/REPORT.md) |
| **VPS VERIFICATO** | IONOS `31.70.139.73`, tailnet `100.99.54.93` (`ionos-n8n-new`). SSH strict verificato come `root` sull’IP corretto; alias locale `ionos-n8n` punta ancora al vecchio IP e non va usato. Runtime Build 271; GIS active; proxy, GraphHopper, ORS e n8n invariati. |
| **ALTRI WORKSTREAM** | Restano evoluzione waypoint/tracce, 3D, mobile e interoperabilità formati ATAK; audit uniformità finestre richiesto. |

## Ripresa — 2026-11-03

L’utente ha dato priorità al menu Layer su iOS, che su Build 270 si apriva e si chiudeva subito in Safari e Chrome. Build 271 sostituisce il listener outside-dismiss `mousedown` con `pointerdown` quando disponibile e conserva il fallback mouse. QA Edge touch/fallback e confronto Build270/271 PASS; la sequenza nativa non è stata registrata su iPhone reale. Il commit `173611f27299662bcc203212d063158ee411a5cf` è live su GitHub e VPS. Deploy strict PASS; runtime locale e HTTP hanno lo stesso SHA-256. Proxy, GraphHopper, ORS e n8n sono rimasti invariati. Il checkpoint aperto è il retest di Nicola su Safari e Chrome iOS, poi routing terrestre senza ferry.

La QA Build 270 usava Edge Chromium touch; WebKit/Safari reale e caricamento dei provider esterni non erano stati verificati. Build 271 è una mitigazione candidata; il retest richiesto è descritto sopra. Dopo quel checkpoint, riprendere `ROUTING-LAND-ONLY-NO-FERRY-A` con i gate provider/browser già documentati.

## Checkpoint di pausa — 2026-10-30

Pausa richiesta dall'utente; nessun lavoro automatico fino alla ripresa. L'app LIVE resta build 268: il candidato build 269 SHA-256 `33e8d90257e56dba0bdf47de9776b018f301a103c5688ad124aab10bf953f548` è su GitHub ma non è stato distribuito. QA locale scoped e prove provider parziali sono collegate sopra; non attestano la chiusura dei gate.

Rilievi preliminari degli agenti interrotti, **da riprodurre e verificare alla ripresa**, senza dichiararli corretti:

1. Import GIS: scegliendo un GeoJSON scaricato tramite selettore file, l'anteprima può restare vuota; possibile causa FileList live letto dopo reset dell'input. Verificare selezione, drag-and-drop, ripetizione e ciclo save→reload→export→import di tracce e poligoni.
2. MGRS: `32NNA0000000000` e `32MNF0000050000` risultano accettati ma i quadrati ricadono nell'emisfero opposto. Analisi e possibile fix erano in staging; riesaminare con riferimenti indipendenti e prove positive/negative.
3. Routing/OPSEC: agente riferisce 24 controlli mock aggiuntivi passati nel proprio perimetro; matrice, timeout/fallback e prove reali runtime non erano complete né revisionate. Riprendere dal materiale di staging e documentare i risultati sul byte esatto.

Le attività degli agenti sono state interrotte prima delle consegne finali: non assumere completate le loro prove. Il lavoro intermedio potrebbe trovarsi nella cartella locale `work/` non tracciata o nella directory di lavoro della chat; non cancellarla. L'utente ha chiesto di riprendere lunedì, senza programmare un'automazione.
