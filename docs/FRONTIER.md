# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Routing terrestre senza ferry; hotfix mobile Layer Build 270 rilasciata |
| **WU ATTIVA** | — (ripresa a livello blocco; nessuna WU in esecuzione) |
| **BLOCCO ATTIVO** | `ROUTING-LAND-ONLY-NO-FERRY-A` |
| **STATO BLOCCO** | Priorità mobile completata: Build 270 pubblicata e verificata sul VPS. Prova Safari/iPhone fisico e caricamento tile reali ancora da fare; riprendere routing land-only. |
| **GATE CORRENTE** | Replay Edge Chromium touch su 5 viewport: LIVE chiude su resize 5/5; Build 270 resta visibile e rende MGRS selezionabile 5/5; `pageErrors=0`. `DEPLOY=PASS`; SSH strict post-deploy conferma runtime e HTTP SHA-256 `704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544`, GIS active; servizi non GIS e n8n invariati. Cleanup Edge v3 exit 1 è distinto dai test funzionali; wrapper SSH ha poi restituito 127 per CRLF dopo tutte le verifiche PASS. Nessun PASS operatore inventato. |
| **RUNTIME LIVE** | Build 270 · SHA-256 `704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544` |
| **RUNTIME CANDIDATE** | Nessun candidato mobile attivo. Build 269 più ampia resta preservata nel ramo `candidate/build269-20261103`. |
| **NEXT** | Riprendere il blocco routing terrestre senza ferry; mantenere i gate e i limiti già documentati. |
| **EVIDENCE** | [QA mobile Build 270](orchestrator/evidence/2026-11-03-mobile-layer-hotfix/REPORT.md) · [Replay accoppiato](orchestrator/evidence/2026-11-03-mobile-layer-hotfix/replay-v3/REPLAY.md) · [Esito deploy](orchestrator/evidence/2026-11-03-mobile-layer-deploy/DEPLOY-RESULT.md) · [Review deploy](orchestrator/evidence/2026-11-03-mobile-layer-deploy/DEPLOY-SCRIPT-REVIEW-00233.md) · [QA geodesica indipendente](orchestrator/evidence/2026-11-03-geodesy-reference-replay/REPORT.md) · [Routing runtime](orchestrator/evidence/2026-11-03-routing-runtime-tailnet/REPORT.md) |
| **VPS VERIFICATO** | IONOS `31.70.139.73`, tailnet `100.99.54.93` (`ionos-n8n-new`). Connessione SSH strict verificata sull’IP corretto; alias locale `ionos-n8n` punta ancora al vecchio IP e non va usato. GIS active; proxy, GraphHopper, ORS e n8n invariati. |
| **ALTRI WORKSTREAM** | Restano evoluzione waypoint/tracce, 3D, mobile e interoperabilità formati ATAK; audit uniformità finestre richiesto. |

## Ripresa — 2026-11-03

L’utente ha dato priorità alla correzione del menu Layer su mobile, da pubblicare sul VPS per provare le mappe. Build 270 deriva dai byte LIVE Build 268 e modifica solo la gestione/posizione del menu Layer più i metadati di release. Il commit applicativo è su GitHub `main`; il deploy GIS è stato completato, il runtime locale e quello HTTP hanno lo stesso SHA-256 e i servizi non GIS sono rimasti invariati. L’errore di codice 127 si è verificato solo dopo che lo script aveva stampato `DEPLOY=PASS`, per un carattere CR trasmesso dopo il body; la successiva sessione SSH strict ha riconfermato lo stato live.

La QA usa Edge Chromium con input touch e cinque viewport; WebKit/Safari reale e caricamento dei provider esterni non sono stati verificati. Il cleanup del replay v3 ha exit 1 ma non ha invalidato i controlli funzionali. Il prossimo blocco è `ROUTING-LAND-ONLY-NO-FERRY-A`; i gate provider/browser incompleti restano come documentato.

## Checkpoint di pausa — 2026-10-30

Pausa richiesta dall'utente; nessun lavoro automatico fino alla ripresa. L'app LIVE resta build 268: il candidato build 269 SHA-256 `33e8d90257e56dba0bdf47de9776b018f301a103c5688ad124aab10bf953f548` è su GitHub ma non è stato distribuito. QA locale scoped e prove provider parziali sono collegate sopra; non attestano la chiusura dei gate.

Rilievi preliminari degli agenti interrotti, **da riprodurre e verificare alla ripresa**, senza dichiararli corretti:

1. Import GIS: scegliendo un GeoJSON scaricato tramite selettore file, l'anteprima può restare vuota; possibile causa FileList live letto dopo reset dell'input. Verificare selezione, drag-and-drop, ripetizione e ciclo save→reload→export→import di tracce e poligoni.
2. MGRS: `32NNA0000000000` e `32MNF0000050000` risultano accettati ma i quadrati ricadono nell'emisfero opposto. Analisi e possibile fix erano in staging; riesaminare con riferimenti indipendenti e prove positive/negative.
3. Routing/OPSEC: agente riferisce 24 controlli mock aggiuntivi passati nel proprio perimetro; matrice, timeout/fallback e prove reali runtime non erano complete né revisionate. Riprendere dal materiale di staging e documentare i risultati sul byte esatto.

Le attività degli agenti sono state interrotte prima delle consegne finali: non assumere completate le loro prove. Il lavoro intermedio potrebbe trovarsi nella cartella locale `work/` non tracciata o nella directory di lavoro della chat; non cancellarla. L'utente ha chiesto di riprendere lunedì, senza programmare un'automazione.