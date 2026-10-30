# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Routing land-only |
| **WU ATTIVA** | `—` (N/A) |
| **BLOCCO ATTIVO** | ROUTING-LAND-ONLY-NO-FERRY-A |
| **STATO BLOCCO** | REVISIONE E QA IN CORSO — GATE NON SUPERATO |
| **GATE CORRENTE** | Candidate routing v3 pubblicato su main; QA mock 24/24 sul precedente byte locale. Self-check 320px corretti e verificati indipendentemente sul byte locale attuale; limiti UTM/MGRS restano aperti. Nessun deploy del candidato integrato. QA visiva routine automatizzata autorizzata; nessun PASS operatore inventato |
| **RUNTIME LIVE** | cf9ae0aed70713191975d00395abfe36746388f6 build268 blob f980a3dd843eb34b32895774fad6aa5ade255dd7 SHA256 HTTP 51a3e9821d0f70c57ad23adb7f10bd66ee6214065ce0e0c7abc9870cc681a11d |
| **RUNTIME CANDIDATE** | c80eda2 (vedi FULL SHA git) build269 blob 701ba964769a1afdc24eb1caaf6c9d66907a50ea SHA256 777bfd6efb1e701d8a820c5fcd4dc37c07426aedb61a23715e437d7b00929010; ulteriori correzioni header, MGRS, self-check e UI solo locali SHA256 f0e284437facb379b6596ac6356eb161e798fa44b7f20c1a338d2c8672ee8b2c, non committate né deployate |
| **NEXT** | Verificare e migliorare target touch e adattamento mobile/tablet; analizzare e correggere in sicurezza i limiti UTM/MGRS; verificare byte finale → deploy solo dopo gate |
| **EVIDENCE** | [Review e ABQA build268](orchestrator/evidence/2026-10-30-export-history/abqa/ABQA.md) · [Cronologia fonti](orchestrator/evidence/2026-10-30-export-history/history/report.md) · [QA integrata precedente](orchestrator/evidence/2026-10-30-integrated-qa/REPORT.md) · [Self-check 320](orchestrator/evidence/2026-10-30-selfcheck-320/REPORT.md) · [Audit finestre](orchestrator/evidence/2026-10-30-modal-ui-audit/REPORT.md) · [Inventario 38 finestre](orchestrator/evidence/2026-10-30-modal-ui-full-audit/REPORT.md) |
| **VPS VERIFICATO** | IONOS31.70.139.73, tailnet100.99.54.93 / ionos-n8n-new. Vecchio alias locale ionos-n8n errato. ServiziGIS active, nessuna modifica infrastrutturale |
| **ALTRI WORKSTREAM** | L’utente ha richiesto evoluzione waypoint/tracce, 3D, mobile e interoperabilità formati ATAK: aggiornare roadmap e priorità. Audit di uniformità delle finestre richiesto e in corso |
