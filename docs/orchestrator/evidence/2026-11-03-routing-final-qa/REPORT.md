# QA routing/OPSEC sul runtime integrato — 2026-11-03

## Esito

**PASS circoscritto sul byte integrato finale** `coordinate_converter Claude.html`, SHA-256 `32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28`, dal checkout `b6f84fb3c92689c9bc7cd900241016536fbd6ae0`. Passati 34 scenari mock e 4 transizioni durante una richiesta. Nessun errore di pagina JavaScript. Nessun provider reale o rete esterna usata; nessun deploy o commit.

## Risultati

- `results.json`: **34/34 PASS, 0 FAIL**. I casi coprono GraphHopper e ORS con ferry/tag o dettagli mancanti, dettagli incompleti, aggancio lontano, HTTP 400, errore di rete, timeout e ponte; payload `avoid`, fallback, confronto e salvataggio simulati, modalita' e profili selezionati.
- `transitions.json`: **4/4 PASS**. Durante una richiesta gia' partita, l'attivazione di OPSEC strict o offline lascia senza anteprima e disabilita il salvataggio, senza emettere ulteriori richieste provider dopo il cambio.
- I casi strict/offline impostati prima del calcolo non producono richieste provider nella fase d'azione. Le richieste gia' intercettate durante il normale avvio/controllo o prima del cambio di policy non possono essere annullate retroattivamente.
- Il runner intercetta ogni richiesta. App e risposte dei provider sono servite dai byte locali e da fixture deterministiche; le altre richieste vengono abortite. Nessuna chiamata reale e' stata trasmessa.

## Ripetibilita'

I runner [run.cjs](run.cjs) e [transitions.cjs](transitions.cjs) verificano l'hash sopra e leggono il runtime locale; i risultati sono [results.json](results.json) e [transitions.json](transitions.json). Per rieseguire occorrono Node, Playwright del probe locale e Chromium indicato nel runner. `work/routing-final-qa/` conserva lo snapshot e la copia esatta dei runner usata nell'esecuzione iniziale.

## Limiti

Questa e' una prova della logica dell'app con mock, non dell'accuratezza o disponibilita' dei servizi di routing reali. Non chiude il gate di routing/provider: restano prove sintetiche attraverso il runtime con provider veri, casi di deviazione o rete terrestre assente, snap/dettagli e modalita'/profili pertinenti. La copertura non e' il prodotto cartesiano di ogni profilo, opzione, modo e risposta. Le transizioni non revocano richieste gia' inviate prima che la policy cambi. Nessun PASS operatore o gate di deploy e' attestato.
