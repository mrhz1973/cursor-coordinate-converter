# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Routing land-only |
| **WU ATTIVA** | `—` (N/A) |
| **BLOCCO ATTIVO** | ROUTING-LAND-ONLY-NO-FERRY-A |
| **STATO BLOCCO** | REVISIONE E QA IN CORSO — GATE NON SUPERATO |
| **GATE CORRENTE** | Candidate routing v3 pubblicato su main; review routing e QA browser mock scoped PASS. Self-check preesistenti in correzione e review, limiti geodetici residui in analisi. Nessun deploy. QA visiva di routine automatizzata autorizzata; nessun PASS operatore inventato |
| **RUNTIME LIVE** | cf9ae0aed70713191975d00395abfe36746388f6 build268 blob f980a3dd843eb34b32895774fad6aa5ade255dd7 SHA256 HTTP 51a3e9821d0f70c57ad23adb7f10bd66ee6214065ce0e0c7abc9870cc681a11d |
| **RUNTIME CANDIDATE** | c80eda2 (vedi FULL SHA git) build269 blob 701ba964769a1afdc24eb1caaf6c9d66907a50ea SHA256 777bfd6efb1e701d8a820c5fcd4dc37c07426aedb61a23715e437d7b00929010; fix header e correzione numerica MGRS in lavorazione, non committati né deployati |
| **NEXT** | Completare review e correzioni self-check, valutare limiti MGRS/UTM e verificare il byte finale → deploy solo dopo gate; audit di uniformità delle finestre in parallelo |
| **EVIDENCE** | [Review e ABQA build268](orchestrator/evidence/2026-10-30-export-history/abqa/ABQA.md) · [Cronologia fonti](orchestrator/evidence/2026-10-30-export-history/history/report.md) |
| **VPS VERIFICATO** | IONOS31.70.139.73, tailnet100.99.54.93 / ionos-n8n-new. Vecchio alias locale ionos-n8n errato. ServiziGIS active, nessuna modifica infrastrutturale |
| **ALTRI WORKSTREAM** | L’utente ha richiesto evoluzione waypoint/tracce, 3D, mobile e interoperabilità formati ATAK: aggiornare roadmap e priorità. Audit di uniformità delle finestre richiesto e in corso |
