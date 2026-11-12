# LAST_CURSOR_REPORT — GPT, Build295 LIVE footer/HUD

Nome file storico. GPT tramite TMAR Desktop Commander Win su AsusDesktop, non Cursor. Fonte unica LIVE [FRONTIER](../FRONTIER.md).

## A. Header
BLOCK: GIS-DESKTOP-FOOTER-HUD-REFLOW-A, OPEN.
GATE: QA OPERATORE DESKTOP 295 PENDING.
NEXT: verifica footer riga unica, credits left, session cache center, provider right, readout PUNTO/CURSORE al bordo footer e lateral shift in bassa risoluzione, senza sovrapposizioni.
RUNTIME: Build295 LIVE, source b213b80fb8c006508e40d6d50e79a0036f3a8cfe, blob 57eb5cedf84982806bdd726c438d4d35acf473eb, SHA256 8bc8ce1bde2e448ba3b6f60f042d371520707c21b5f6cea581eacb8135724840, 11.127.935 byte.
REVIEW: GPT-SOSTITUTIVA 42/42 PASS, reviewer esterno NOT_PERFORMED/post-hoc backstop.
DEPLOY: GIS-only PASS, backup294, SHA HTTP/HTTPS e workspace pulito.
ABQA HTTPS nativa: 86/86 footer/HUD +25/25 Waypoint +42/42 Escape +17/17 D-Flight =170/170 PASS, 0 POST.
MOBILE: layout non modificato, sviluppo in PAUSA.
NOTE: Escape294 precedente ancora senza QA operatore, non chiuso automaticamente.
real_task_commit=dc5155ac86bc10dcc6b925a5fc2c47a85f86a4c9; current_report_container=PENDING_SELF_REFERENCE; final_remote_head_after_report_push=EXTERNAL_ONLY.

## B. Evidenza
Screenshot utente richiede banda nera una sola riga con tre zone; posizione dinamica PUNTO/CURSORE deve prevenire overlap. Build295 modifica CSS/HTML UI, legge cache sessione preesistente senza nuove scritture, clona attribuzione layer già renderizzata e usa variabili CSS/RAF per shift su desktop bassi. Niente modifica a rete/storage/OPSEC/GPS o mobile layout. Candidate QA86+Waypoint25, review42; deploy GIS-only con backup e single restart, QA nativa live totale170/170. Prima regressione Escape non completata per timeout runner, ripetuta correttamente senza cambi runtime. Console/pageerror generale non misurati, provider esterni bloccati, nessun PASS operatore inventato.

## C. Identità
real_task_commit=dc5155ac86bc10dcc6b925a5fc2c47a85f86a4c9
current_report_container=PENDING_SELF_REFERENCE
final_remote_head_after_report_push=EXTERNAL_ONLY

[Dossier](../orchestrator/evidence/2026-11-12-footer-single-row-295/REPORT.md).
