# Ultimo checkpoint orchestratore

Stato canonico LIVE: [FRONTIER](../FRONTIER.md). **12 novembre 2026: Build 291 LIVE, QA OPERATORE DESKTOP PENDING.**

Block GIS-DESKTOP-TOOLBAR-DUAL-GROUPS-A-FIX1: dopo la screenshot QA negativa della Build 290, corrette collisioni fra barra destra (Nuovo punto/GPS) e HUD PUNTO/CURSORE + © OpenStreetMap. Solo CSS desktop (right gutter 96px rispetto a toolbar right:10px width68, separazione 18px), mobile invariato, gruppi blu/teal preservati.

Source a32bf2b5eede5ffcfbc0307eda8b4a0171edb6e9, blob 76211816541dbf54651171f7febe4f5150ff4ae3, SHA256 35d5dc79bc6e48e8d8d0558743411311e7fcfeb66db56218c5d07d908b3c46e5, 11.120.857 byte. Review routine 16/16 PASS; deploy GIS-only con backup 290 e smoke HTTP/HTTPS PASS; QA automatica LIVE Edge 14/14 anti-overlap + 76/76 dual-groups + 25/25 Waypoint = **115/115 PASS**, 0 POST. Console/pageerrors non rilevati separatamente.

**NEXT:** breve QA operatore sul problema screenshot: PUNTO/CURSORE e attribuzione sempre leggibili, nessun pulsante che li copre anche scorrendo fino a GPS. Solo dopo esatta conferma QA GIS-DESKTOP-TOOLBAR-DUAL-GROUPS-A-FIX1 PASS operatore -> chiusura H. Mobile in pausa, ramo Escape 284 non distribuito.

[Dossier](evidence/2026-11-12-desktop-toolbar-291-hud-safe/REPORT.md) · [Deploy](evidence/2026-11-12-desktop-toolbar-291-hud-safe/DEPLOY-RESULT-291.md) · [QA nativa](evidence/2026-11-12-desktop-toolbar-291-hud-safe/QA-LIVE-291.md) · [Inbox](inbox/2026-11-12_1015_desktop-toolbar-291-hud-safe-live.md) · [LAST](../runtime/LAST_CURSOR_REPORT.md).

real_task_commit=7675cdf5f5c9746ddf3bbd41d531087cb5f76b45; current_report_container=PENDING_SELF_REFERENCE; final_remote_head_after_report_push=EXTERNAL_ONLY.
