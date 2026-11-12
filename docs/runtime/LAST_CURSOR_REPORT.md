# LAST_CURSOR_REPORT — GPT, Build 291 HUD desktop anti-overlap

Nome storico. Esecutore GPT via TMAR Desktop Commander Win su AsusDesktop; Cursor non invocato. Fonte LIVE [FRONTIER](../FRONTIER.md).

## A. Header
BLOCK: GIS-DESKTOP-TOOLBAR-DUAL-GROUPS-A-FIX1 aperto; GATE: QA OPERATORE DESKTOP 291 PENDING.
NEXT: verifica visiva che PUNTO/CURSORE e © OpenStreetMap non siano coperti dai tasti, incluso GPS raggiunto scorrendo la colonna; eventuale attestazione esatta QA GIS-DESKTOP-TOOLBAR-DUAL-GROUPS-A-FIX1 PASS operatore.
RUNTIME: Build 291 LIVE, source a32bf2b5eede5ffcfbc0307eda8b4a0171edb6e9, blob 76211816541dbf54651171f7febe4f5150ff4ae3, SHA 35d5dc79bc6e48e8d8d0558743411311e7fcfeb66db56218c5d07d908b3c46e5, 11.120.857 byte.
REVIEW: routine CSS desktop 16/16 PASS.
DEPLOY: GIS-only, backup 290, smoke HTTP/HTTPS PASS.
ABQA LIVE: Edge HTTPS nativa 115/115 PASS (14 anti-overlap, 76 dual-groups, 25 Waypoint), 0 POST.
Mobile: sviluppo sospeso, layout e codice non modificati.
real_task_commit=7675cdf5f5c9746ddf3bbd41d531087cb5f76b45; current_report_container=PENDING_SELF_REFERENCE; final remote=EXTERNAL_ONLY.

## B. Report e limiti
Build 290 LIVE era risultata 101/101 PASS automatici ma screenshot utente ha dimostrato la sovrapposizione al HUD della mappa. Diagnosi reale a 5 desktop viewport e toolbar scroll: PUNTO/CURSORE e OpenStreetMap erano anchor-right sotto i pulsanti.
Fix Build 291: applicate due regole CSS scoped su desktop con un gutter 96px a destra, 18px di separazione effettiva. Nessuna modifica a JS applicativo, calcoli GIS, waypoint, OPSEC, GPS, rete o mobile. Review del blob/code source 16/16, Node 2/2 e 192 CR preservati.
QA candidata 14/14 collisioni e 76/76 layout e 25/25 Waypoint; poi FF main, backup e restart soltanto GIS, 115/115 ABQA HTTPS nativa su asset realmente servito; nessun POST.
Nessun PASS operatore 291 attribuito e nessun PASS generale delle 38 finestre. Console/pageerror generali non raccolti separatamente; tile provider esterni bloccati.
Autosync F3 latest, inbox e LAST; nessun commit autoreferenziale.

## C. Identità
real_task_commit=7675cdf5f5c9746ddf3bbd41d531087cb5f76b45
current_report_container=PENDING_SELF_REFERENCE
final_remote_head_after_report_push=EXTERNAL_ONLY

[Dossier](../orchestrator/evidence/2026-11-12-desktop-toolbar-291-hud-safe/REPORT.md).
