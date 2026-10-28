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
