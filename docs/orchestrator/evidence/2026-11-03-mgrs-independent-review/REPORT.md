# Review indipendente — fix MGRS celle di banda

Data: 2026-11-03. Review in sola lettura del checkout `b6f84fb3c92689c9bc7cd900241016536fbd6ae0`. Runtime verificato: `coordinate_converter Claude.html`, SHA-256 `434fd40ee3585c07893aab096292a40b19ba4a64ab85ddf4d9919060cc80b7a9`. Il diff include soltanto il fix MGRS e la precedente correzione d'import FileList. `git diff --check`: PASS. Nessuna modifica al runtime, commit o deploy.

## Decisione

**PASS circoscritto per il parser MGRS UTM e i casi testati.** La logica JavaScript è coerente con la funzione `UTMRow` di GeographicLib 2.5, compresi i quattro casi eccezionali legati a riga, colonna e fascia. Il parser sostituisce correttamente il precedente northing-cycle heuristic, rifiuta i riferimenti testati che non intersecano la fascia e mantiene quelli ufficiali di confine. Non è una certificazione geodetica mondiale né un PASS dei percorsi non provati.

## Confronto dell'algoritmo con la fonte primaria

La funzione del runtime mappa il band index C–X in `[-10, 9]`, calcola la stessa riga centrale e gli stessi limiti safe (`floor(c - 4.3 - 0.1*north)` e `floor(c + 4.4 - 0.1*north)`, con le eccezioni polari), normalizza il row index sul periodo 20, ripiega banda/riga/colonna per i quattro casi di bordo e rifiuta gli altri. `Math.trunc` replica la divisione intera C++ in `baserow`; la normalizzazione aggiunge 100 prima del modulo, rendendo il residuo positivo per l'intero intervallo di righe. In seguito il northing firmato è convertito al false northing standard meridionale di 10.000.000 m. Gli insiemi di riga pari/dispari e le colonne di zona restano gestiti dai set del parser preesistente.

Il confronto è stato fatto contro l'implementazione primaria pubblicata [GeographicLib 2.5 `MGRS.cpp`, UTMRow e MGRS::Reverse](https://sources.debian.org/src/geographiclib/2.5-1/src/MGRS.cpp). Il codice runtime corrisponde alle formule e alle condizioni del sorgente; nel harness la funzione di riferimento è però una trascrizione della stessa regola, non una seconda libreria eseguibile. Il binario ufficiale GeographicLib e GEOTRANS non sono stati eseguiti.

## Prove eseguite in modo indipendente

- Verificato SHA-256 prima di test e poi rieseguito `mgrs-prefix-matrix.cjs`: **192.000/192.000** prefissi zona/banda/colonna/riga processati senza differenze rispetto alla trascrizione della regola; 97.920 accettati e 94.080 rifiutati. Il confronto controlla parser effettivo, northing/easting e rifiuti, ma la trascrizione coincide deliberatamente con la logica sorgente tradotta e pertanto non è un oracolo implementativo indipendente.
- Ricalcolati, e verificati nel harness, i dieci fixture: validi `38VLS`, `38WLS`, `38MPE`, `38NPF`; invalidi `38VMS`, `38NPE`, `38MPF`, `32NNA0000000000`, `32MNF0000050000`, `32MNF0000000000`. I primi sette sono gli esempi pubblicati dal sorgente GeographicLib 2.5; gli ultimi tre coprono i finding del checkpoint. Sono state verificate anche quattro celle di confine valide a precisione 1 m.
- Rieseguita `mgrs-ui-validation.cjs` in Edge headless con HTTP/HTTPS bloccati: **PASS** sul medesimo hash. Converti e incolla rifiutano i sei codici invalidi senza sostituire l'ultimo risultato; Cerca li classifica come coordinate non valide. Converti, incolla e Cerca accettano i quattro riferimenti di confine validi.
- Rieseguita `2026-10-30-qa-final-mgrs/mgrs-core.cjs`: **PASS**, 594 vettori GEOTRANS, 6 prove di precisione, 2 floating point adiacenti, 9 controlli stale e fallback zona; i due script inline compilano. Questa suite è rilevante per regressioni esistenti, ma non sostituisce i test di validità delle celle.
- La suite browser storica `mgrs-browser.cjs` non è stata rieseguita da questa review. Il report di implementazione documenta un fallimento successivo a un fixture MGRS ora invalido e a un'asserzione sulla provenance waypoint; non ho provato la stessa asserzione sul pre-fix `0FC76AA…`. Esito per questa suite: **NON_VERIFICATO**, non contata come PASS né come difetto baseline.

## Limiti residui

- La matrice esaustiva riguarda i prefissi del modello `UTM 60 × 20 × 8 × 20`; il suo expected-result deriva dalla stessa regola tradotta, non da 192.000 chiamate al binario GeographicLib.
- Non ho rieseguito browser su editor waypoint/tracce, Batch o URL/permalink; questi percorsi restano **NON_VERIFICATI** in questa review. La prova Cerca chiama `classifyGeoSearchInput` senza eseguire richieste online.
- Nessuna review completa di tutte le modifiche dal runtime LIVE 268, nessun test routing/provider reale, nessun device fisico, deploy o verifica VPS.
- Non si conclude che tutte le celle MGRS del mondo o ogni proiezione/geodesia siano certificate: il test verifica la regola cella/fascia della versione GeographicLib dichiarata e i percorsi elencati sopra.

## Handoff

La correzione è pronta per essere integrata con il successivo intervento UI, preservando la prova sul byte `434fd40…` e rieseguendo i controlli pertinenti sul nuovo hash integrato. Conservare il fallimento della suite browser storica come NON_VERIFICATO finché non è riprodotto sul byte pre-fix.
