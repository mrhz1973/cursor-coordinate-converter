# Review indipendente Codex — FIX7

Reviewer: subagente Codex /root/review_fix7, distinto dall'implementatore storico. Non costituisce attestazione di un reviewer esterno non coinvolto né QA operatore.

Gate proposto: **FAIL — equivalenza ingressi incompleta**, NO DEPLOY. Decisione finale all'orchestratore.

Candidate: 080e71c161be76e3ff494b1cdee1aed6889f9290, blob dc1ec34ddb12c37e0502d074559e7a4aab279106, SHA256 LF verificato d5496fb01873d3748fd1c173f7d4091351f41aec54b7fa37a23947ecd4bcca69.
Base LIVE: f215011d9b725664506a1a155e27b64d5011fb99. Base delta FIX6: b60584cc9d32f2f5c035dee0c045673843e85b34.

## F1 — P1: prefisso formato applicato solo da Cerca

Righe candidate 27569–27572: parseFreeTextLatLon elimina DD/DDM/DMS prima di verificare che il numero di componenti rispetti il formato dichiarato. Il percorso Cerca invece applica tryDeclaredLatLon, righe 51410–51423, che impone 2/4/6 componenti. routingSearchTryParseCoords (86985) usa direttamente il parser senza questo controllo.

Riproduzioni eseguite su funzioni originali estratte senza modifiche da git show FULL_SHA:

| Input | Cerca | Parser condiviso e routing |
| --- | --- | --- |
| DD 44 6 9 49 | coord_invalid | 44.1 / 9.816666666666666 |
| DDM 44.1 9.8 | coord_invalid | 44.1 / 9.8 |
| DMS 44.1 9.8 | coord_invalid | 44.1 / 9.8 |

Atteso: rifiuto coerente per dichiarazione incompatibile, conformemente al contratto esplicito già presente in tryDeclaredLatLon e alla richiesta di equivalenza Cerca/Converti/routing. Il parser condiviso può produrre successo su dati incompleti o appartenenti a un formato diverso da quello dichiarato.

Origine: il comportamento permissivo del parser esiste già in LIVE e FIX6. Non è una regressione introdotta dalle sole 63 righe FIX7. L'incoerenza fra ingressi è residua nel bundle Search/Converti (il classificatore non esiste in LIVE); blocca l'acceptance attuale di equivalenza, non prova che FIX7 peggiori LIVE. Nessuna richiesta di cambiare le tre forme ambigue esplicitamente escluse dallo scope.

Correzione suggerita: controllare il formato esplicito nel parser canonico, preservare prefisso o famiglia prima della rimozione, applicare lo stesso contratto sui componenti per DD/DDM/DMS senza chiamate ricorsive classifier->parser. Testare anche componente per asse, segni e decimali europei.

## Verifiche e limiti

- Harness indipendente parser-review.cjs e risultato parser-results.json: 10 casi x 3 revisioni; compara parser, Cerca dove presente, routing. I casi validi DD/DDM/DMS e le correzioni FIX7 per decimali europei e segno/emisfero sono coerenti nei controlli mirati eseguiti.
- Dipendenze estratte dal monolite; ErrI18n sostituito con semplice classe Error per non richiedere traduzione/UI. Nessun algoritmo parser sostituito. Riferimenti mancanti provocano fallimento harness, non vengono conteggiati come rifiuti validi.
- Ispezionato delta FIX6->FIX7 integralmente e blocchi rilevanti del diff LIVE->candidate: niente nuova chiamata di rete/storage nel delta FIX7; skipReverse e invalidazione risultati obsoleti nel bundle sono presenti. Questo controllo statico non equivale a prova browser OPSEC.
- Non eseguiti browser QA, QA mondiale, export/import storage, deploy o verifica HTTP. Non attribuito PASS generale alle regressioni o alla rete.
- Nessuna modifica al runtime o push.

Riproduzione: node parser-review.cjs <percorso-clone-git>.

## Decisione orchestratore

Gate FIX7 FAIL confermato da review distinta e riproduzione browser. Il mandato utente del 2026-10-28 autorizza subagenti Codex, correzione scoped e ripetizione review; i riferimenti legacy a Cursor non comportano utilizzo di Cursor. Nessuna attestazione di review esterna o QA operatore. Runtime LIVE invariato e non verificato via HTTP in questa sessione. FIX8 in lavorazione, nessun nuovo candidate ancora pubblicato.

Preflight VPS: SSH alias canonico rifiutato per host key cambiata; endpoint HTTP tailnet timeout. Non modificati known_hosts, servizi o infrastruttura. Verifica dell'identità richiesta attraverso console IONOS prima dell'accesso/deploy.

## Riscontro browser indipendente

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

Harness riproducibili allegati nello stesso inbox come FIX7-parser-review.cjs e FIX7-arity-ui.cjs. Evidence estesa locale in work/review-fix7 e work/qa-fix7; non confonderla con artefatti pubblicati. QA geodetica mondiale ancora in consolidamento al momento di questa registrazione.
