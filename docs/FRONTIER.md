# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Menu Layer iOS Build 271; dopo retest, routing terrestre senza ferry |
| **WU ATTIVA** | — (ripresa a livello blocco; nessuna WU in esecuzione) |
| **BLOCCO ATTIVO** | `MOBILE-IOS-LAYER-RETEST-271` |
| **STATO BLOCCO** | Build 270 era presente sul telefono ma il menu si apriva e si chiudeva in Safari e Chrome iOS. Build 271 cambia la chiusura esterna da `mousedown` a `pointerdown` quando disponibile. Replay Edge touch e fallback superati; il retest su iPhone reale è ancora richiesto. |
| **GATE CORRENTE** | [Confronto Build 270/271](orchestrator/evidence/2026-11-03-layer-ios-dismiss/touch-compat-results.json): evento `mousedown` tardivo simulato chiude 270 e non 271. [Replay Build 271](orchestrator/evidence/2026-11-03-layer-ios-dismiss/selection-results.json): apertura, toggle, chiusura esterna, selezione layer, fallback e `pageErrors=0` su 4 profili. Il test non dimostra l’ordine eventi nativo su iOS. |
| **RUNTIME LIVE** | Build 270 · SHA-256 `704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544` |
| **RUNTIME CANDIDATE** | Build 271 · SHA-256 `7f96e58ea912cd9c017c225b1d12276f5ef397c55b3e4ee6c8bfbd11c5b76ea8` · da pubblicare |
| **NEXT** | Pubblicare Build 271 su GitHub e VPS. Nicola fa un tap sull’icona Layer su Safari/Chrome iOS e conferma apertura stabile e selezione mappa; se passa, riprendere `ROUTING-LAND-ONLY-NO-FERRY-A`. |
| **EVIDENCE** | [Diagnosi e QA Layer iOS 271](orchestrator/evidence/2026-11-03-layer-ios-dismiss/REPORT.md) · [QA mobile Build 270](orchestrator/evidence/2026-11-03-mobile-layer-hotfix/REPORT.md) · [Deploy Build 270](orchestrator/evidence/2026-11-03-mobile-layer-deploy/DEPLOY-RESULT.md) · [Routing runtime](orchestrator/evidence/2026-11-03-routing-runtime-tailnet/REPORT.md) |
| **VPS VERIFICATO** | IONOS `31.70.139.73`, tailnet `100.99.54.93` (`ionos-n8n-new`). Connessione SSH strict verificata sull’IP corretto; alias locale `ionos-n8n` punta ancora al vecchio IP e non va usato. GIS active; proxy, GraphHopper, ORS e n8n invariati. |
| **ALTRI WORKSTREAM** | Restano evoluzione waypoint/tracce, 3D, mobile e interoperabilità formati ATAK; audit uniformità finestre richiesto. |

## Ripresa — 2026-11-03

L’utente ha dato priorità alla correzione del menu Layer su mobile, da pubblicare sul VPS per provare le mappe. Build 270 deriva dai byte LIVE Build 268 e modifica solo la gestione/posizione del menu Layer più i metadati di release. Il commit applicativo è su GitHub `main`; il deploy GIS è stato completato, il runtime locale e quello HTTP hanno lo stesso SHA-256 e i servizi non GIS sono rimasti invariati. L’errore di codice 127 si è verificato solo dopo che lo script aveva stampato `DEPLOY=PASS`, per un carattere CR trasmesso dopo il body; la successiva sessione SSH strict ha riconfermato lo stato live.

La QA Build 270 usava Edge Chromium touch; WebKit/Safari reale e caricamento dei provider esterni non erano stati verificati. Build 271 è una mitigazione candidata; il retest richiesto è descritto sopra. Dopo quel checkpoint, riprendere `ROUTING-LAND-ONLY-NO-FERRY-A` con i gate provider/browser già documentati.

## Checkpoint di pausa — 2026-10-30

Pausa richiesta dall'utente; nessun lavoro automatico fino alla ripresa. L'app LIVE resta build 268: il candidato build 269 SHA-256 `33e8d90257e56dba0bdf47de9776b018f301a103c5688ad124aab10bf953f548` è su GitHub ma non è stato distribuito. QA locale scoped e prove provider parziali sono collegate sopra; non attestano la chiusura dei gate.

Rilievi preliminari degli agenti interrotti, **da riprodurre e verificare alla ripresa**, senza dichiararli corretti:

1. Import GIS: scegliendo un GeoJSON scaricato tramite selettore file, l'anteprima può restare vuota; possibile causa FileList live letto dopo reset dell'input. Verificare selezione, drag-and-drop, ripetizione e ciclo save→reload→export→import di tracce e poligoni.
2. MGRS: `32NNA0000000000` e `32MNF0000050000` risultano accettati ma i quadrati ricadono nell'emisfero opposto. Analisi e possibile fix erano in staging; riesaminare con riferimenti indipendenti e prove positive/negative.
3. Routing/OPSEC: agente riferisce 24 controlli mock aggiuntivi passati nel proprio perimetro; matrice, timeout/fallback e prove reali runtime non erano complete né revisionate. Riprendere dal materiale di staging e documentare i risultati sul byte esatto.

Le attività degli agenti sono state interrotte prima delle consegne finali: non assumere completate le loro prove. Il lavoro intermedio potrebbe trovarsi nella cartella locale `work/` non tracciata o nella directory di lavoro della chat; non cancellarla. L'utente ha chiesto di riprendere lunedì, senza programmare un'automazione.
