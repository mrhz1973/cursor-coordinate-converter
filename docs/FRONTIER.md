# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | GIS Search |
| **WU ATTIVA** | `—` (N/A) |
| **BLOCCO ATTIVO** | GIS-SEARCH-SIMPLIFY-COUNTRY-A |
| **STATO BLOCCO** | REVIEW INDIPENDENTE PASS — deploy GIS-only prossimo |
| **GATE CORRENTE** | Paese e note di rilascio: review indipendenti e test locali PASS scoped; ABQA HTTP e QA operatore pendenti |
| **RUNTIME LIVE** | `762fb1605a7c20b3b7bd21a6b0cfa1c04f8e4739`, build265, blob `5da70951b43300f5165448049ba8c20a2f8ae867`, SHA256 HTTP `0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145`; endpoint migrati preservati |
| **RUNTIME CANDIDATE** | ce02321c6a95f729c6b9e1baeabe27077689a9c8 build266 blob da1191e9a48353175f5ffef8f73ee3e8150212a7 SHA256 85252fa3bb9fd43f9eeca4a5d1ddce8b5e9ee307be94defc5e0b66c61eda23ff |
| **NEXT** | Deploy GIS-only dopo backup → hash HTTP e ABQA → QA operatore → routing land-only |
| **EVIDENCE** | [Pacchetto FIX8](orchestrator/evidence/2026-10-28-fix8/INDEX.md) |
| **VPS VERIFICATO** | IONOS31.70.139.73, tailnet100.99.54.93 / ionos-n8n-new. Vecchio alias locale ionos-n8n errato. ServiziGIS active, nessuna modifica infrastrutturale |
| **ALTRI WORKSTREAM** | Oggetti GIS FROZEN/MAINTENANCE-ONLY. Routing audit parcheggiato fino gate Search; /info live attesta road_environment FERRY, nessun candidate routing |
