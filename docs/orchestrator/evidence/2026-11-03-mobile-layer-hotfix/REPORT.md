# Mobile Layer menu hotfix — Build 270

## Esito

Hotfix isolata pronta per review, basata sui byte del runtime LIVE Build 268. La prova automatizzata in Edge Chromium con viewport mobile e input touch ha riprodotto e verificato i due difetti osservati: il menu si chiudeva a ogni resize e, a 720×320 in landscape, il limite minimo di 160 px lo faceva finire sotto il footer. Build 270 mantiene il menu aperto e lo riposiziona dopo resize/rotazione; ora lo limita all’altezza realmente disponibile e l’overlay MGRS si può raggiungere scorrendo.

Review indipendente e rilascio VPS restano a carico dell’orchestratore. Non è stato eseguito alcun deploy.

## Provenienza e hash

| Artefatto | SHA-256 | Git blob |
| --- | --- | --- |
| LIVE 268 estratto da `cf9ae0aed70713191975d00395abfe36746388f6` | `51a3e9821d0f70c57ad23adb7f10bd66ee6214065ce0e0c7abc9870cc681a11d` | `f980a3dd843eb34b32895774fad6aa5ade255dd7` |
| Copia hotfix Build 270 | `704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544` | `3acd864dd4bd7510d920bc420e9c223f528e4397` |

Il file LIVE estratto misura 11.035.368 byte; la copia hotfix misura 11.036.371 byte. Il file canonico e il candidato Build 269 non sono stati modificati né inclusi.

## Patch

La patch unificata applicabile al file canonico è in [`hotfix270.patch`](hotfix270.patch). Modifica solo la copia derivata dal LIVE 268:

- `positionBasemapMenuGis` usa le dimensioni di `visualViewport` quando disponibili e limita `max-height` all’area tra header e footer; rimuove il minimo fisso di 160 px che copriva il menu a 720×320.
- Il menu resta aperto ai resize di `window` e `visualViewport`. Gli eventi sono accorpati su `requestAnimationFrame`; il callback cerca il `.tile-map` corrente in `#gisMapMount`, senza conservare riferimenti a nodi che un render può staccare.
- Aggiornati etichetta e note in sola copia: `GIS-MOBILE-LAYER-MENU-A`, Build 270. Nessun intervento su geodesia, routing, privacy, storage o provider.

La Build 268 non contiene `dialog.compact-basemap-dialog` (conteggio DOM 0); non è stato introdotto un dialog nuovo.

## Replay accoppiati e validità del gate

Il replay accoppiato v2 è stato approvato dal reviewer per i controlli funzionali; è documentato in [`replay-v2/REPLAY.md`](replay-v2/REPLAY.md), con sintesi in [`replay-v2/replay-summary.json`](replay-v2/replay-summary.json) e dettagli in [`replay-v2/replay-results.json`](replay-v2/replay-results.json). A seguito del processo Node rimasto vivo dopo la stampa, è stato eseguito un solo replay v3 con la stessa sequenza e gli stessi controlli e con cleanup limitato; i risultati sono in [`replay-v3/REPLAY.md`](replay-v3/REPLAY.md), [`replay-v3/replay-summary.json`](replay-v3/replay-summary.json) e [`replay-v3/replay-results.json`](replay-v3/replay-results.json). Il runner v3 è [`runner v3 archiviato`](replay-v3/runner-used.js).

Entrambi gli output JSON riportano `pass: true` e zero failure sui controlli funzionali. LIVE chiude il menu durante rotazione e cambio altezza in tutti e cinque i profili; Build 270 lo mantiene aperto e nei limiti visibili in tutti e cinque. MGRS è raggiunto con gesto touch e selezionato con tap touch nei quattro profili mobili; sul desktop l'interazione usa mouse wheel e mouse click. Sul LIVE, a 720×320 landscape MGRS non è raggiungibile né attivato. Chiusura esterna, riapertura e chiusura finale riescono in tutti i profili hotfix. Nessuna eccezione JavaScript non gestita (`pageerror`) in entrambi i file.

Il replay v3 non ha terminato con exit code 0: la chiusura Edge ha superato il limite di 20 secondi; il runner ha riportato un errore di cleanup e il codice effettivo è stato 1. Il processo specifico è stato fermato dopo la persistenza dei risultati e non ne resta uno attivo. `pass: true` nel JSON v3 descrive i controlli funzionali e non annulla il fallimento del cleanup. Non è stato avviato un altro replay.

Le registrazioni `net::ERR_BLOCKED_BY_CLIENT` descrivono richieste esterne intercettate intenzionalmente dal runner, non eccezioni JavaScript. Replay v2: 1.408 richieste bloccate sul LIVE e 1.484 sulla hotfix; 1.401/1.425 messaggi corrispondenti in console. Replay v3: 1.436/1.467 richieste bloccate; 1.395/1.431 messaggi totali in console, di cui 1.394/1.431 ERR_BLOCKED_BY_CLIENT. Il LIVE registra quindi un solo 404 senza URL attribuibile, già incluso nel totale; la hotfix nessuno. `pageErrors=0` per entrambi; `pass: true` indica il superamento dei controlli funzionali e non una console pulita. Gli asset sono serviti localmente e le richieste ad altre origini sono state bloccate. Il cleanup v3 ha exit code 1, documentato separatamente.

## Prove preliminari (non gate)

`before-probe.json`, `baseline-probe.json`, `after-probe.json`, `final-probe.json` e le relative schermate sono prove preliminari: usavano runner/fasi e schema diversi e non dimostravano in modo coerente l'esito del tap MGRS sulla baseline. Il replay accoppiato v2 ha ottenuto review PASS sui controlli funzionali; v3 li ha ripetuti con esiti identici ma ha fallito nel cleanup del processo. I metadati dei tap che in precedenza indicavano erroneamente WebKit sono stati corretti in Edge Chromium; nessuna di queste prove costituisce un risultato Safari.

## Verifica preliminare

Il runner è [`runner preliminare`](probe-layer-menu-preliminary.js). Ha servito HTML e gli 8 asset locali dalla copia in `work/mobile-layer-hotfix`; Playwright ha bloccato ogni richiesta fuori dall’origine del server di prova. I tap sono stati eseguiti con `touchscreen.tap(x, y)` alle coordinate lette dal layout; lo scorrimento del menu è stato generato con input rotella. Il profilo desktop usa `mouse.click`.

| Profilo | Menu dopo rotazione/resize | Dentro viewport | Basemap `osmHot` | Overlay MGRS | Scroll fino a MGRS | Chiusura esterna / riapertura | Errori JS |
| --- | --- | --- | --- | --- | ---: | --- | ---: |
| 390×844 portrait | PASS | PASS | PASS | PASS | già visibile | PASS / PASS | 0 |
| 320×720 portrait | PASS | PASS | PASS | PASS | già visibile | PASS / PASS | 0 |
| 844×390 landscape | PASS | PASS | PASS | PASS | scrollTop 360 px | PASS / PASS | 0 |
| 720×320 landscape | PASS | PASS | PASS | PASS | scrollTop 360 px | PASS / PASS | 0 |
| 1280×800 desktop | PASS al cambio altezza | PASS | PASS | PASS | già visibile | PASS / PASS | 0 |

Nel profilo 720×320 il menu ora ha `max-height` di 99 px: resta entro lo spazio utile sopra il footer e scorre fino a MGRS. Prima della patch aveva un minimo di 160 px e il footer ne copriva la parte bassa. Nelle osservazioni LIVE preliminari MGRS non era raggiungibile; il punto di tap era stato clamped sul footer, quindi il tap aveva colpito il footer e non dimostrava un tap fallito sull’overlay. Il replay v2/v3 ha confermato che sul LIVE MGRS non è raggiungibile in quel profilo e che la hotfix lo rende selezionabile. La prova baseline preliminare aveva anche riprodotto la chiusura del menu al resize nei profili mobili. Le evidenze storiche in [`baseline-probe.json`](baseline-probe.json) e [`final-probe.json`](final-probe.json) restano preliminari; gli screenshot sono `baseline-*-open.png` e `final-*-open.png` nella stessa cartella.

## Limiti della prova

Playwright WebKit non era disponibile. Il tentativo d’installazione con la CLI ha scaricato il pacchetto ma si è bloccato dopo il download; l’eseguibile WebKit non è stato installato. Nessun risultato è quindi attribuito a Safari/iPhone reale. Il gate coperto qui è Edge Chromium con user-agent iPhone 13 Pro, emulazione touch e i viewport richiesti; la review deve mantenere esplicito questo limite.
