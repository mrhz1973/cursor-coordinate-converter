# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | GIS Search |
| **WU ATTIVA** | `—` (N/A) |
| **BLOCCO ATTIVO** | GIS-SEARCH-SIMPLIFY-COUNTRY-A |
| **STATO BLOCCO** | IMPLEMENTAZIONE IN CORSO — FIX8 CLOSED / QA OPERATORE PASS |
| **GATE CORRENTE** | FIX8 QA operatore PASS esplicito 2026-10-28; nuova richiesta rimozione Paese ed esempio. Candidate nuovo non ancora disponibile |
| **RUNTIME LIVE** | `762fb1605a7c20b3b7bd21a6b0cfa1c04f8e4739`, build265, blob `5da70951b43300f5165448049ba8c20a2f8ae867`, SHA256 HTTP `0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145`; endpoint migrati preservati |
| **RUNTIME CANDIDATE** | — (in lavorazione) |
| **NEXT** | Implementazione scoped semplificazione Cerca → review, QA e deploy solo dopo gate → QA operatore → routing land-only |
| **EVIDENCE** | [Pacchetto FIX8](orchestrator/evidence/2026-10-28-fix8/INDEX.md) |
| **VPS VERIFICATO** | IONOS31.70.139.73, tailnet100.99.54.93 / ionos-n8n-new. Vecchio alias locale ionos-n8n errato. ServiziGIS active, nessuna modifica infrastrutturale |
| **ALTRI WORKSTREAM** | Oggetti GIS FROZEN/MAINTENANCE-ONLY. Routing audit parcheggiato fino gate Search; /info live attesta road_environment FERRY, nessun candidate routing |
