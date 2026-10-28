# FIX7 — verifica browser indipendente, 28 ottobre 2026

Candidate: 080e71c161be76e3ff494b1cdee1aed6889f9290, build 264.
Runtime locale SHA-256 LF verificato: d5496fb01873d3748fd1c173f7d4091351f41aec54b7fa37a23947ecd4bcca69.

## Esito: FAIL — equivalenza ingressi

La suite storica passa, ma tre nuovi casi dimostrano falsa accettazione e mutazione del risultato. Ogni azione parte da sentinel verificato 10/20. Gli input vengono inseriti con fill e confermati con Invio/click reale; nessuna chiamata diretta ai parser per il livello UI.

| Input | Cerca | Converti | Incolla | Routing |
|---|---|---|---|---|
| DD 44 6 9 49 | rifiuto, 10/20 invariato | 44.1 / 9.816666666666666 | 58.17784498467327 / 22.925636735450478 | 44.1 / 9.816666666666666 |
| DDM 44.1 9.8 | rifiuto, 10/20 invariato | 44.1 / 9.8 | 44.1 / 9.8 | 44.1 / 9.8 |
| DMS 44.1 9.8 | rifiuto, 10/20 invariato | 44.1 / 9.8 | 44.1 / 9.8 | 44.1 / 9.8 |

Evidence: arity-ui.json; harness arity-ui.cjs. 9 fallimenti nelle 12 interazioni. Zero pageerror. In particolare DD produce due posizioni differenti fra Converti e Incolla.

## Regressioni realmente rieseguite

- Desktop Chromium, 1440 x 2200: matrice storica 38/38 helper; Cerca 12/12, Converti 12/12, Incolla 12/12, routing 12/12. Evidence matrix-desktop.json.
- Emulazione mobile Chromium, 390 x 844, isMobile e hasTouch: stessa matrice 38/38 helper e 48/48 interazioni. Evidence matrix-mobile.json. Non è test su dispositivo fisico.
- Editor desktop, 1440 x 1000: waypoint 4/4, poligono 4/4 con bozza di tre vertici creata da click mappa. Evidence editors-desktop.json. Zero pageerror.
- Ricerca luogo Roma mediante Invio con OPSEC strict, geocoding disabilitato, offline: 0 tentativi Nominatim; punto invariato. Evidence ui-place-gates-results.json. Stato dei gate predisposto tramite evaluate, input e submit reali.
- Primo harness storico mouse per gate coordinate registra timeout di click in due casi durante carico parallelo: conservato ui-gates-results.json, non usato per dichiarare PASS delle interazioni. Controllo aggiuntivo luogo via tastiera completato senza timeout.

## Metodo e limiti

Harness storici copiati dall'evidence locale, letti e rieseguiti contro byte candidate verificati. Suite arità aggiunta dopo finding indipendente del reviewer. Servizio HTTP locale su porta effimera. Richieste esterne intercettate e bloccate; la ricerca luogo esplicitamente consentita nella matrice viene simulata con risposta vuota. I tentativi rete sono osservabili prima del blocco. Nessun provider reale contattato.

Cerca verifica numericamente state.lastPoint e state.viewCenter; Converti/Incolla state.lastResult; routing le coordinate in state._routing.points; editor verificano dati canonici effettivamente salvati. Questa esecuzione non certifica separatamente pixel marker o testo PUNTO DOM, né resa visiva, editor mobile, runtime HTTP VPS o ABQA post-deploy. Apertura di alcuni pannelli e scelta tab avvengono via evaluate; inserimento e salvataggio sono interazioni browser. Converti/Incolla usano a volte Invio sul pulsante focalizzato per posizione fuori viewport: risultato dichiarato nel JSON.

Il FAIL di equivalenza blocca PASS complessivo e deploy. Nessuna modifica runtime, commit, push o deploy eseguita da questo agente.

## Riproduzione

Gli script richiedono Playwright già disponibile in C:/goi-pw-probe/node_modules/playwright e Chromium in C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe. Eseguire node arity-ui.cjs <candidate.html> <output.json>; analogamente matrix.cjs e matrix-mobile.cjs. Gli script gate ricevono candidate.html come primo argomento e salvano il JSON accanto al proprio file.