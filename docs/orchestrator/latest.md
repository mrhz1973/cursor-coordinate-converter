# Ultimo checkpoint orchestratore

Stato vivo [FRONTIER](../FRONTIER.md). **Build 293 LIVE, QA OPERATORE DESKTOP PENDING**.

Block GIS-MINIMIZED-WINDOW-ESCAPE-PRIORITY-A: correzione desktop della priorità Escape con Mappe Offline, Cerca e Cronologia minimizzate davanti a Poligoni. Baseline 292 su HTTPS 18/21 con tre FAIL; candidata 293 21/21 PASS + D-Flight 17/17. Predicato desktop GIS preserva il comportamento mobile.

Source 86d27e7707046ec9829f5be4ef2832aec86f4a6c, blob f7ef7266bbf6d0b9912bc9f9d6f0c9f0336c7442, SHA256 b4bc346f74be303fa157bc8b7ebc80b532e50fec002edde55adf13ba64e3720e, 11.121.119 byte. REVIEW GPT-SOSTITUTIVA 32/32 PASS, reviewer esterno NOT_PERFORMED e backstop post-hoc. Deploy GIS-only con backup292, smoke HTTP/HTTPS PASS; ABQA HTTPS nativa 38/38 PASS, POST zero.

**NEXT:** QA operatore desktop: minimizzare Mappe Offline, aprire Poligoni dalla toolbar, premere Escape: Poligoni chiude, Offline resta minimizzata e ripristinabile. Dopo trigger QA GIS-MINIMIZED-WINDOW-ESCAPE-PRIORITY-A PASS operatore, chiusura Regola H. Telefono in pausa.

[Dossier](evidence/2026-11-12-desktop-escape-293/REPORT.md) · [Deploy](evidence/2026-11-12-desktop-escape-293/DEPLOY-RESULT-293.md) · [QA LIVE](evidence/2026-11-12-desktop-escape-293/QA-LIVE-293.md) · [Inbox](inbox/2026-11-12_1203_desktop-escape-293-live.md) · [LAST](../runtime/LAST_CURSOR_REPORT.md).

real_task_commit=2d6596e97dd9140ef0d2143607e4bc6ade3fb0b1; current_report_container=PENDING_SELF_REFERENCE; final_remote_head_after_report_push=EXTERNAL_ONLY.
