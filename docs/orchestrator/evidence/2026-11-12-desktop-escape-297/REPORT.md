# GIS-MINIMIZED-HELP-TOOLS-ESCAPE-PRIORITY-D - Build297

Data 2026-11-12. Categoria DELICATO (lifecycle Escape), desktop-only. Rispetto alla Build296 source e222efc35b9d0dc988935ffd05464fee12417398 (monolite SHA256 380ee97a3cb82feba3592016011e7510b63df7aab4ec82bc786d842d3484e2ff), codice Build297 source 1adf52d26efaaf62da491e3a445f37ce716a8351, blob cd158698c6de3a66f27bafb22be0da4443ab861b, SHA256 e9be9dc2c694a930cb607d3bd71a56cdff4f8dd6a78b4d4e86d2ab15800b1a96, 11.129.498 byte, 192 CR. Un solo HTML modificato: 16 righe aggiunte e 6 eliminate.

Baseline Edge HTTPS LIVE 296 con profilo isolato: Guida e Strumenti minimizzati e Poligoni visibile, Escape chiudeva Guida/Strumenti, lasciando Poligoni aperto (2/2 FAIL). Range Rings stesso percorso PASS. Waypoint e Traccia presentavano pickMode attivo dopo apertura, Escape lo annullava con priorita intenzionale; disarmando il pickMode prima della pressione, Escape chiude Poligoni e lascia i minimizzati ripristinabili (2/2 PASS). Questi ultimi non sono bug del prodotto.

Causa: il listener bindHotkeys precedente al gestore GIS globale chiudeva incondizionatamente toolsDrawer.open e helpOverlay.open anche quando minimizzati. Delta: riuso del predicato desktop GIS con media query min-width 960, hover:hover, pointer:fine; solo se il pannello e minimizzato il listener passa Escape al successivo handler. Comportamento mobile (touch e fuori GIS), stati pick, rete, dati, GPS, layout e close normali immutati. Nessun modulo, nuovo handler o dipendenza introdotto.

QA candidata: 2/2 target PASS, 2/2 visibili PASS, 2/2 minimizzati senza altro pannello PASS, 4/4 regressione Build296 PASS, 2/2 parity touch 390x844 PASS. Zero POST, nessuna eccezione JS nelle suite. Sintassi inline 2/2 PASS e CR192 invariati. Review GPT-SOSTITUTIVA statica 18/18 PASS sul Git object full SHA; esterna NOT_PERFORMED con post-hoc backstop.

Deploy GitHub main, VPS fast-forward main, backup Build296 /var/backups/goi-gis-runtime/20261112T210823Z-build297, unico restart goi-gis-app.service PID 1127560 -> 1200974, smoke HTTP/HTTPS SHA Build297 PASS. Il primo tentativo HTTP in retry ha riportato connection refused durante la readiness, il retry ha ottenuto risposta con SHA esatto; nessun secondo restart. [Deploy](DEPLOY-RESULT-297.md) e [QA HTTPS LIVE](QA-LIVE-297.md).

Gate QA OPERATORE DESKTOP 297 PENDING. Le QA umane 295 footer/HUD e 294 Escape sono indipendenti e ancora PENDING; Build296 invece CLOSED con PASS umano. Nessun PASS generale sulle 38 finestre.
