# QA toolbar captions and Layer position — 2026-11-03

## Esito

**PASS circoscritto sul runtime finale SHA-256 `32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28`.** La barra principale mostra tutte e sette le didascalie inferiori; Layer è collocato subito sotto l'intestazione, primo controllo della mappa. I tab, Strumenti, Esporta e il menu Layer si attivano nei tre viewport provati. Nessun overflow orizzontale del documento e nessuna eccezione JavaScript.

## Correzione rilevata dalla QA

La prima esecuzione sul prototipo `2d9f3dd802baa661bcd53ffa349d0e55d761dca09fc5181eabf3688651128217` rilevava solo 6 didascalie su 7: mancava quella di Converti in tutti i viewport. La review del codice ha trovato che `syncI18nInRoot` traduce ogni elemento `[data-i18n]` assegnandogli `textContent`; l'attributo era sul pulsante Converti padre e rimuoveva i suoi figli, compresa la nuova didascalia. L'orchestratore ha spostato la chiave di traduzione sul solo testo figlio. La riesecuzione sul nuovo hash finale ha dato **7/7** didascalie visibili in tutti i viewport.

## Condizioni e risultati

Edge headless `156.0.4314.50`, dati di storage isolati, viewport emulati; cache HTTP disattivata, query univoco per caricamento. Le richieste esterne sono state intercettate e bloccate prima della trasmissione: 105 richieste bloccate nella riesecuzione finale, zero richieste esterne consentite. Di conseguenza la mappa mostra gli stati di risorse remote bloccate; la review visiva riguarda barra, controlli e layout, non il contenuto cartografico.

| Viewport | Intestazione (bottom) | Layer (top) | Didascalie | Menu / tab | Overflow pagina |
| --- | ---: | ---: | ---: | --- | --- |
| 1280×900 desktop | 69 px | 83 px | 7/7 visibili; pulsanti alti 54 px | Preferiti, Strumenti, Esporta, Layer: PASS | 1280/1280 |
| 390×844 mobile | 153,94 px | 157,94 px | 7/7 visibili; pulsanti alti 54 px | PASS | 390/390 |
| 320×720 mobile | 153,63 px | 157,63 px | 7/7 visibili; pulsanti alti 54 px | PASS | 320/320 |

Su schermi mobili l'intera barra dei comandi è più larga del viewport (`691 px` di contenuto a fronte di `374 px` disponibili a 390 px e `304 px` a 320 px), ma resta contenuta nel suo scorrimento orizzontale; il documento non si allarga. La didascalia Layer si trova 14 px sotto il bordo dell'intestazione sul desktop e 4 px sotto sui viewport mobili, senza sovrapposizione. In tutte le misure la console non ha registrato eccezioni JavaScript.

## Interazioni verificate

- Preferiti passa ad `aria-selected=true`.
- Strumenti apre il relativo drawer (`aria-expanded=true`).
- Esporta apre il menu associato.
- Layer apre il menu cartografico.
- Tutte le didascalie rettangolari sono visibili (`display` diverso da `none` e riquadro non nullo); Converti ora mantiene correttamente l'icona, il testo e la didascalia dopo l'inizializzazione delle traduzioni.
- `git diff --check`: PASS sul checkout al momento della verifica.

## Artefatti e limiti

- Script ripetibile: [`run-cdp.mjs`](run-cdp.mjs).
- Metriche e risultati grezzi: [`results.json`](results.json).
- Screenshot: [desktop 1280×900](desktop-1280.png), [mobile 390×844](mobile-390.png), [mobile 320×720](mobile-320.png).
- Test interattivi eseguiti via DevTools Protocol in Edge headless; i menu sono stati attivati con eventi DOM e non con tocco su dispositivo fisico. Non sono stati provati screen reader, dialogo Layer compatto in orientamento orizzontale né telefoni/tablet reali.
- La barra mobile richiede scorrimento orizzontale per raggiungere Esporta; questa è la modalità prevista dal CSS attuale. Il test non valuta se tale modalità sia la scelta UX finale.
- Nessun deploy eseguito.
