# Automated Browser QA — GIS-HELP-TOOLBAR-UX-A build 267

**Esito: PASS limitato ai casi seguenti.** Non è QA operatore, né prova di provider esterni, stampa reale, download o funzionamento di tutte le altre schermate.

Runtime HTTP effettivo: `http://100.99.54.93:8000/coordinate_converter%20Claude.html`; commit runtime `e7225e7` (FULL SHA a cura orchestratore). Risposta HTTP 200, 10.919.671 byte, SHA-256 `06fed6daf3f4843538eda8f9f0139e7bfc8605c26baae2bfd977f08eb7898f74` prima e dopo prove; Last-Modified coerente.

## Prove browser

Chromium headless: desktop 1440×900, mobile emulato 390×844, mobile emulato 320×568, finestra bassa 820×420. In ogni viewport: apertura Impostazioni → Note, testata e × visibili con hit-test reale; ×, riapertura Guida e FAQ, chiusura; apertura Strumenti, Esporta → dialogo JPG e Annulla; click Cerca e Mappe offline, pannelli corretti. 4/4 PASS, zero pageerror. Documento HTML caricato dall'URL reale, non simulato. Hash esterno calcolato su GET HTTP prima e dopo navigazioni.

Tutte le altre richieste sono state intercettate e bloccate. Sono stati osservati tentativi per font, tile, Open-Meteo e asset: 61 desktop, 28 mobile390, 20 mobile320, 28 finestra bassa. Questi numeri includono caricamento iniziale e altre azioni: non attestano assenza generale di rete. OPSEC/geocoding e stampa erano verificati separatamente in QA locale (`REPORT.md`); non sono replicati in questo harness HTTP.

Screenshot `abqa-desktop-notes.png`, `abqa-mobile-notes.png`, `abqa-tiny-notes.png`, `abqa-short-notes.png`; risultati dettagliati `abqa-results.json`; riproduzione `node work/ui-review/abqa.cjs <URL>`.

Il meta viewport modifica l'intera app, pertanto restano necessari controlli operatore percettivi su telefono reale e ulteriori controlli per superfici non esercitate. Nessuna modifica VPS, commit o push da questo reviewer.
