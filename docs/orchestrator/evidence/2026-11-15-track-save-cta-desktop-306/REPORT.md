# Build306 - GIS-TRACK-SAVE-CTA-DESKTOP-A

Data 15 novembre 2026, registrazione 2026-11-16 00:03 CET. ROUTINE UI desktop (OM sezione 4 Regola B); reviewer esterno N/A. CLOSURE STANDARD_RUNTIME_BUNDLE, ma QA operatore **PENDING**: nessun finito anticipato.

## Identita di sorgente e deploy

- Base GitHub: `633b99f90b89ea07fdeb1e3b771ad907f0b7d568` (Build305 CLOSED con QA PASS operatore).
- Runtime source `287d90c59cf6e77feb7144e79bdaa7087dccc490`, Git blob `dcf143d899c2c074f32dae03edd0058326c5ebef`, Build306 APP_BUILD_ID `GIS-TRACK-SAVE-CTA-DESKTOP-A`.
- SHA-256 `47a770d9cb8ed963e2c8171311f638c1f72ef1bf90090fe18c545d8809480d9b`, 11.172.093 byte, 192 CR, zero CRLF; runtime un unico HTML inline senza nuove dipendenze.
- GIS-only deploy PASS: backup305 `/var/backups/goi-gis-runtime/20261115T225548Z-prebuild306/coordinate_converter Claude.html`, service PID 3632670 -> 7891 (un solo restart). Altri servizi non riavviati.
- HTTP interno e HTTPS nativo 200; byte, hash e Build306 identici. [Apri runtime](https://ionos-n8n-new.tailc01234.ts.net/gis?v=47a770d9).
- Branch `task/gis-track-save-cta-desktop-306`, push del source su origin/main verificato.

## Diff ROUTINE e scope

Solo `coordinate_converter Claude.html`: bottone `btnTrackSaveLibrary` reso visibile nella sezione Tracce salvate; disabilitato con 0/1 punti e messaggio chiaro, abilitato con >=2; continua a richiamare il gestore Salva/Aggiorna gia esistente. Il doppione nella testata Punti e nascosto solo sul desktop (viewport oltre 768px); mobile mantiene il comportamento precedente. Due nuove stringhe IT/EN/FR (aiuto testuale e tooltip). Nessun cambio ad import/export, dati, storage, sanitizer, API, GPS, OPSEC, tile, rete o state.mapWaypoints[].

## Evidence e gate

- `git diff --check` PASS. JavaScript inline estratto dall'HTML e verificato con `node --check`: **2/2 PASS**.
- Edge Windows con profili temporanei QA isolati: candidato HTTP loopback **13/13 PASS** ([JSON](candidate-qa.json)); pagina HTTPS nativa, senza sostituzione sorgente **13/13 PASS** ([JSON](live-qa.json)).
- Scenari: 0/1/2 punti, disabled e helper, singola CTA desktop; dialog reale Salva, archivio e reload; editing SavedTrack e Update che conserva ID; viewport mobile 390px regressione PASS.
- In entrambi i run: **zero POST, eccezioni JS, errori console e harness**. Tutti i profili temporanei rimossi.
- Reviewer esterno N/A per ROUTINE. **QA FINALE CHATGPT/OPERATORE PENDING**, non dedurre PASS dal precedente blocco305.

## QA operatore residua

Nel pannello Traccia desktop, con traccia corrente vuota: verificare nella sezione Tracce salvate che Salva traccia in archivio sia visibile, disabilitato e accompagnato da istruzione sui due punti. Importare dal pulsante Importa superiore un GPX di almeno due punti o crearne due: il tasto deve attivarsi. Salvarlo con nome univoco; in Modifica la CTA deve diventare Aggiorna traccia. Evitare la sovrascrittura involontaria di dati personali.

Attestazione quando realmente verificato: `QA GIS-TRACK-SAVE-CTA-DESKTOP-A PASS operatore`. Dopo PASS si applica Regola H, chiusura docs-only.

## NEXT

Separare nel successivo bundle **DELICATO I/O** Importa/Esporta corrente vs archivio, con sanitizer, transazioni, save->reload->export->import di tracce e poligoni, quote GPX/KML complete/parziali; non duplicare import e non modificare state.mapWaypoints[]. Profilo solo XY senza quote backlog indipendente, accuratezza DTM terreno HOLD; sviluppo telefono PAUSA.
