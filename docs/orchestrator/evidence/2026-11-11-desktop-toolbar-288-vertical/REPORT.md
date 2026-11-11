# Build 288 — toolbar destra in unica colonna verticale desktop

Registrazione 2026-11-11 12:38:28 Europe/Rome. STATO STORICO: candidata predeploy preparata su base Build 287. Build 288 ora LIVE; gate operatore desktop ancora aperto.

## Stato LIVE postdeploy — 11 novembre 2026

Build 288 LIVE, SHA256 ce97e3b72e2e17e383417c777509889cd74cebe144f6751f4fda89829f28209b, 11.116.411 byte. Backup 287, fast-forward, restart del solo GIS e smoke HTTP/HTTPS PASS. ABQA Edge nativa HTTPS **62/62 PASS**, 0 POST, 462 accessorie esterne bloccate. Console/pageerror non raccolti separatamente. QA operatore PENDING. [Deploy](DEPLOY-RESULT-288.md) · [QA](QA-LIVE-288.md).

## Origine e requisito
L'operatore ha corretto esplicitamente l'orientamento richiesto: tutti i pulsanti in linea verticale, NON orizzontale. Devono restare compatti, identificati con targhette e accessibili direttamente. La QA operatore 287 non e stata approvata. Le funzioni mobile restano in pausa.

## Patch
- Base main 184a42bc6a3231baf48714c1d2d5a050fbe1ffa8.
- Source code commit d4e9821e180f82a33bb506c48b5c1d683a8cb82a, branch task/gis-desktop-toolbar-288-vertical.
- HTML standalone unico: blob 67fb15263fc5a6d2461552f33fd3d6165f66c466, SHA256 ce97e3b72e2e17e383417c777509889cd74cebe144f6751f4fda89829f28209b, 11.116.411 byte, 192 CR invariati.
- Solo coordinate_converter Claude.html; modifiche CSS desktop (min-width 960px, hover, pointer fine) e metadati build 288; nessuna modifica a handler JS, stati, storage o rete.
- Nuovo layout flex-direction column, 12 comandi diretti uno sotto l'altro a destra, larghezza pulsanti 62px, altezza 44px, nomi sotto icone.
- Scroll della sola colonna su schermi bassi (960x650), senza tagliare gli ultimi pulsanti. Le risoluzioni desktop piu alte mostrano l'intera colonna. Layers mantiene menu popup; Traccia non si attiva cliccando Poligoni o R&B.
- Invariati GPS, OPSEC, offline/opt-in, state.mapWaypoints, modal, mappa, mobile; nessun framework, module o bundler.

## Test e limiti
- Node check dei due script inline PASS; CR e diff --check PASS.
- QA candidata Edge HTTPS con HTML 288 iniettato solo nella sessione browser: 62/62 PASS, POST 0, 486 chiamate esterne bloccate. Viewport desktop 1440x900, 1366x768, 1920x1080, 1024x768, 960x650; 390x844 mobile emulato senza etichette desktop e con flyout precedenti.
- In 960x650, ultimo pulsante raggiunto con scroll interno al toolbar (PASS).
- Review ROUTINE CSS 21/21 PASS su source pinnato, [review](REVIEW-288.json).
- Non attribuire un test umano o postdeploy prima di eseguire ABQA LIVE.

NEXT: aggiornare main tramite fast-forward, preflight, backup della 287, restart del solo GIS, SHA HTTP/HTTPS e browser QA LIVE, poi istruzioni QA operatore sulla 288. Ramo Escape 284 separato; nessun PASS generale sulle finestre.
