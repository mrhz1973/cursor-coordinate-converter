# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Hotfix menu Layer mobile Build 270 → poi riprendere routing land-only |
| **WU ATTIVA** | `GIS-MOBILE-LAYER-MENU-A` (rilascio Build 270) |
| **BLOCCO ATTIVO** | `GIS-MOBILE-LAYER-MENU-A` |
| **STATO BLOCCO** | QA UI funzionale Build 270 PASS; cleanup Edge v3 FAIL (exit 1), distinto dai risultati app. Push GitHub/deploy VPS pendenti; LIVE resta Build 268 |
| **GATE CORRENTE** | Replay accoppiato Edge Chromium: 5 viewport, LIVE chiude su resize 5/5, Build270 resta visibile/sicura e attiva MGRS 5/5; `pageErrors=0`. Richieste esterne intercettate, console non pulita; Safari e tile reali non verificati. Review statica script deploy PASS; `bash -n` PASS. Nessun PASS operatore inventato |
| **RUNTIME LIVE** | cf9ae0aed70713191975d00395abfe36746388f6 build268 blob f980a3dd843eb34b32895774fad6aa5ade255dd7 SHA256 HTTP 51a3e9821d0f70c57ad23adb7f10bd66ee6214065ce0e0c7abc9870cc681a11d |
| **RUNTIME CANDIDATE** | Build 270, SHA-256 `704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544`, basata sui byte LIVE 268 con solo fix Layer mobile; commit GitHub e deploy ancora da completare. Build269 candidata full preservata nel ramo `candidate/build269-20261103` |
| **NEXT** | Completare commit/push Build270; deploy GIS-only e verificare SHA HTTP e PID invariati dei servizi non GIS; poi riprendere routing terrestre senza ferry e gli altri gate rimasti |
| **EVIDENCE** | [QA mobile Build270](orchestrator/evidence/2026-11-03-mobile-layer-hotfix/REPORT.md) · [Replay accoppiato](orchestrator/evidence/2026-11-03-mobile-layer-hotfix/replay-v3/REPLAY.md) · [Review deploy](orchestrator/evidence/2026-11-03-mobile-layer-deploy/DEPLOY-SCRIPT-REVIEW-00233.md) · [QA geodesica indipendente](orchestrator/evidence/2026-11-03-geodesy-reference-replay/REPORT.md) · [Routing runtime](orchestrator/evidence/2026-11-03-routing-runtime-tailnet/REPORT.md) |
| **VPS VERIFICATO** | IONOS31.70.139.73, tailnet100.99.54.93 / ionos-n8n-new. Vecchio alias locale ionos-n8n errato. ServiziGIS active, nessuna modifica infrastrutturale |
| **ALTRI WORKSTREAM** | L’utente ha richiesto evoluzione waypoint/tracce, 3D, mobile e interoperabilità formati ATAK: aggiornare roadmap e priorità. Audit di uniformità delle finestre richiesto e in corso |

## Ripresa — 2026-11-03

L’utente ha ripreso il lavoro e ha dato priorità alla correzione del menu Layer su mobile, da pubblicare sul VPS per provare le mappe. Il candidato Build 270 deriva dai byte LIVE Build 268 e modifica solo la gestione/posizione del menu Layer più i metadati di release. La Build 269 più ampia resta preservata separatamente e non è inclusa in questo hotfix.

La QA accoppiata usa lo stesso runner e cinque profili per LIVE e Build 270; evidenze e limiti sono collegate sopra. I controlli funzionali sono PASS; il runner v3 ha avuto un timeout separato durante la chiusura di Edge. Il rilascio resta pendente finché GitHub/VPS non verificano lo stesso SHA del runtime. Il VPS attualmente serve Build 268. Dopo la correzione mobile, riprendere il blocco routing `ROUTING-LAND-ONLY-NO-FERRY-A`; i test provider/browser restano non verificati o incompleti come documentato.
## Checkpoint di pausa — 2026-10-30

Pausa richiesta dall'utente; nessun lavoro automatico fino alla ripresa. L'app LIVE resta build 268: il candidato build 269 SHA-256 `33e8d90257e56dba0bdf47de9776b018f301a103c5688ad124aab10bf953f548` è su GitHub ma non è stato distribuito. QA locale scoped e prove provider parziali sono collegate sopra; non attestano la chiusura dei gate.

Rilievi preliminari degli agenti interrotti, **da riprodurre e verificare alla ripresa**, senza dichiararli corretti:

1. Import GIS: scegliendo un GeoJSON scaricato tramite selettore file, l'anteprima può restare vuota; possibile causa FileList live letto dopo reset dell'input. Verificare selezione, drag-and-drop, ripetizione e ciclo save→reload→export→import di tracce e poligoni.
2. MGRS: `32NNA0000000000` e `32MNF0000050000` risultano accettati ma i quadrati ricadono nell'emisfero opposto. Analisi e possibile fix erano in staging; riesaminare con riferimenti indipendenti e prove positive/negative.
3. Routing/OPSEC: agente riferisce 24 controlli mock aggiuntivi passati nel proprio perimetro; matrice, timeout/fallback e prove reali runtime non erano complete né revisionate. Riprendere dal materiale di staging e documentare i risultati sul byte esatto.

Le attività degli agenti sono state interrotte prima delle consegne finali: non assumere completate le loro prove. Il lavoro intermedio potrebbe trovarsi nella cartella locale `work/` non tracciata o nella directory di lavoro della chat; non cancellarla. L'utente ha chiesto di riprendere lunedì, senza programmare un'automazione.
