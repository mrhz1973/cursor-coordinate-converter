# MGRS band-cell validity fix — 2026-11-03

## Esito

**Fix implementato e verificato sul runtime locale; nessun deploy o commit.** Il parser rifiuta ora le celle MGRS da 100 km che non intersecano la fascia dichiarata, preservando le celle che attraversano equatore e confini di fascia.

## Identità e modifiche

- Checkout canonico: `b6f84fb3c92689c9bc7cd900241016536fbd6ae0` (`origin/main` era allineato all'avvio).
- Byte pre-fix MGRS con la correzione import già applicata: `0FC76AA28EA2CF493F966C6E4310C8D82A8085050892CFAFBA4D0227897FD13A`.
- Runtime finale di questa modifica: `434fd40ee3585c07893aab096292a40b19ba4a64ab85ddf4d9919060cc80b7a9`.
- HTML modificato: `coordinate_converter Claude.html`. Contiene anche la patch import FileList già consegnata separatamente; nessun'altra proprietà del runtime è stata cambiata qui.
- Harness e output: `mgrs-prefix-matrix.cjs`, `mgrs-ui-validation.cjs`.

La precedente scelta del ciclo northing più vicino alla latitudine media della fascia non bastava a validare un riferimento. Il parser ora risolve la riga periodica secondo la regola `UTMRow` di GeographicLib: limiti safe di riga per fascia, normalizzazione del ciclo ventennale e quattro eccezioni che dipendono da fascia, riga e colonna ai confini proiettati. Dopo la convalida applica il false northing standard di 10.000.000 m alle fasce meridionali. Non usa il segno/emisfero o il centro della cella come scorciatoia e non sposta una coordinata in un'altra fascia.

La logica è un adattamento di `GeographicLib 2.5`, `MGRS.cpp` (`UTMRow` e `MGRS::Reverse`), licenza MIT/X11: [sorgente](https://sources.debian.org/src/geographiclib/2.5-1/src/MGRS.cpp). Il criterio seguito è la compatibilità della cella MGRS da 100 km secondo quella libreria; non è una nuova dimostrazione numerica dell'intersezione ellissoidale di ogni poligono di cella.

## Verifiche

| Verifica | Esito |
| --- | --- |
| Sintassi dei due script inline del monolite | PASS |
| Tutti i 192.000 prefissi UTM MGRS: 60 zone × 20 fasce × 8 colonne × 20 righe, confrontati con una trascrizione indipendente della regola GeographicLib | **PASS** — 97.920 accettati e 94.080 rifiutati come atteso |
| Riferimenti GeographicLib espliciti: `38VLS`, `38WLS`, `38MPE`, `38NPF` validi; `38VMS`, `38NPE`, `38MPF` invalidi | PASS |
| Casi del checkpoint `32NNA0000000000`, `32MNF0000050000`, `32MNF0000000000` | PASS — tutti rifiutati |
| Celle di confine valide, anche a precisione 1 m (`0000000000`) | PASS |
| Suite MGRS core esistente sul nuovo hash | PASS — 594 vettori, 6 controlli di precisione, 2 di doppia precisione adiacente, 9 controlli stale e fallback zona |
| Browser Edge isolato, HTTP/HTTPS bloccati: Converti, incolla/auto-detect e classificazione Cerca | PASS — 6 riferimenti invalidi rifiutati, 4 prefissi validi di confine accettati |
| `git diff --check` | PASS |

I casi di `Cerca` sono verificati tramite la funzione effettiva `classifyGeoSearchInput`, cioè la classificazione coordinate che precede ogni ricerca di luogo/rete; la suite non invia richieste esterne.

## Esito della suite browser storica e limite

È stato eseguito anche `2026-10-30-qa-final-mgrs/mgrs-browser.cjs`, ma non è stato contato come PASS: l'input `32MNF0000000000` usato da quel vecchio test ora è correttamente invalido e l'esecuzione si arresta poi sull'asserzione storica `waypoint transfer intentionally lacks source`. Il runtime attuale trasferisce intenzionalmente `mgrsSource` ai waypoint (`waypointAddFromConvertedPoint`), in coerenza con la funzionalità di provenienza verificata nei test più recenti. Questa suite non è stata aggiornata né il suo errore è stato qualificato come mismatch del byte pre-fix `0FC…`; non la si usa come prova né contro né a favore della fix. I controlli pertinenti di parser, Converti, incolla, Cerca e 594 vettori sono stati eseguiti separatamente sul checksum finale sopra.

## Limiti e handoff

- La matrice copre ogni prefisso di zona/banda/colonna/riga contro una trascrizione della regola di riferimento; non è un'esecuzione del binario ufficiale GeographicLib o GEOTRANS.
- La suite core non certifica la correttezza mondiale di tutte le conversioni geodetiche, ogni flusso batch o URL, né il routing.
- I controlli UI toccano direttamente i flussi MGRS Converti, incolla e Cerca; non attestano round-trip waypoint/tracce o le altre categorie del gate.
- Il candidato resta locale e non deployato. Occorre una review indipendente di questo diff e una nuova integrazione/replay dopo le successive modifiche. Il runtime è consegnato all'orchestratore, che deve fissare il nuovo checksum prima di ulteriori interventi.
