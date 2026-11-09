# Ultimo checkpoint orchestratore

Stato vivo: [FRONTIER](../FRONTIER.md). **9 novembre 2026 — scelta del plugin TMAR recepita; percorso hosted precedente fermato.**

L’operatore ha scelto esplicitamente il proprio TMAR Desktop Commander Win tramite OpenAI Secure MCP Tunnel. Il plugin risponde su ASUSDESKTOP, Windows, versione 0.3.1. Il servizio hosted tmar-vps-access predisposto sul VPS è fermo e disabilitato: MainPID=0, UnitFileState=disabled; lo stato systemd failed residuo non indica un processo attivo. Il precedente pairing non va ripreso.

**NEXT / WAIT:** Usare il plugin TMAR selezionato. L’autonomia dal PC resta aperta: il percorso coerente richiede un tunnel OpenAI dedicato al VPS, credenziale runtime configurata privatamente e relativo collegamento ChatGPT verificato. Non duplicare la stessa identità stdio su Windows e VPS, non ripuntare il plugin Windows e non riattivare il servizio hosted precedente. Nessun nuovo tunnel, trasferimento di credenziali o modifica del plugin è stato eseguito.

Build 281 invariata, source commit 0c0f6785654dbba279774bb8569788088f0762e9, blob 3dcff61081a2f461f8841953986ced17b058eab1, SHA-256 e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62. GIS-WINDOW-CONTROLS-A resta aperto per la QA operatore Astro su telefono. La preferenza sul connettore non è un PASS di quella QA.

[Correzione ed evidenze](evidence/2026-11-09-vps-direct-access/TMAR-ROUTE-CORRECTION.md) · [Inbox](inbox/2026-11-09_2320_tmar-tunnel-choice.md) · [Controllo operatore Astro](evidence/2026-11-09-gis-window-controls-281/OPERATOR-CHECK-281.md).

`real_task_commit = a3bc2b189d2ad4cc8dfe26fe5d71ab4f64b3bf62`; `current_report_container = PENDING_SELF_REFERENCE`; proprio push e HEAD finale `EXTERNAL_ONLY`.
