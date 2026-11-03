# Replay accoppiato LIVE 268 / hotfix 270 — v3

## Esito del replay e cleanup

Il runner v3 ha eseguito una sola volta la stessa coppia HTML, la stessa sequenza e gli stessi controlli del v2. Il risultato strutturato riporta `pass: true` e `failureCount: 0`; i cinque profili LIVE e hotfix hanno gli stessi esiti funzionali del v2.

Il comando non ha però terminato con exit code 0. Dopo aver chiuso il server HTTP e le connessioni, `browser.close()` ha superato il limite di cleanup di 20 secondi. Il runner ha emesso l’errore `Edge browser cleanup exceeded 20000ms`; l’exit code osservato è 1. Il processo Node specifico è stato terminato dopo la persistenza degli output e verificato assente. Non sono stati eseguiti altri replay. Perciò il campo JSON `pass: true` indica solo il PASS dei controlli funzionali; questa esecuzione v3 non è un PASS completo del processo.

## Risultati funzionali

LIVE chiude il menu al resize in tutti e cinque i viewport. Build 270 resta aperto e sicuro dopo rotazione e variazione d’altezza in tutti e cinque. La basemap OSM HOT è selezionabile in tutti i profili di entrambi i file. Chiusura esterna, riapertura e chiusura finale riescono in tutti i profili hotfix. `pageErrors=0` per entrambe le sorgenti.

| Profilo | LIVE MGRS | Build 270 MGRS | Input di scroll e tap | Menu dopo rotazione/altezza hotfix |
| --- | --- | --- | --- | --- |
| 390×844 portrait | attivo, scrollTop 85 | attivo, scrollTop 85 | gesto touch e tap touch | aperto e sicuro / aperto e sicuro |
| 320×720 portrait | attivo, scrollTop 85 | attivo, scrollTop 85 | gesto touch e tap touch | aperto e sicuro / aperto e sicuro |
| 844×390 landscape | attivo, scrollTop 255 | attivo, scrollTop 255 | gesto touch e tap touch | aperto e sicuro / aperto e sicuro |
| 720×320 landscape | non raggiungibile, scrollTop 0 | attivo, scrollTop 343 | gesto touch e tap touch | aperto e sicuro / aperto e sicuro |
| 1280×800 desktop | attivo, scrollTop 180 | attivo, scrollTop 180 | mouse wheel e mouse click | aperto e sicuro / aperto e sicuro |

## Metodo e provenienza

- Un runner ha eseguito lo stesso ordine d’azioni per LIVE e hotfix e per ciascun profilo: apri Layer; ruota viewport; ripristina; tocca fuori e riapri; riduci altezza; ripristina; tocca fuori e riapri; seleziona OSM HOT; normalizza con chiusura esterna e riapertura; scorri fino a MGRS; verifica il target e toccalo; chiudi fuori; riapri e richiudi.
- Le fasi rotazione, variazione altezza e interazione sono state eseguite in browser context/pagine separati, non in un solo flusso continuo. Sequenza, viewport e controlli sono identici tra LIVE e Build 270.
- I quattro viewport mobili usano emulazione Edge/Chromium, user-agent iPhone 13 Pro e input touch: tap coordinate, gesto touch per scroll e tap MGRS. Il desktop usa mouse click e mouse wheel.
- HTML e asset sono serviti da disco dal server temporaneo locale. Playwright consente solo quell’origine e abortisce tutte le richieste esterne.
- Runner: [`runner-used.js`](runner-used.js), SHA-256 `01bc1a801bc08f288452be20cb64ff19a24e12a50a9f666bc91129e609180152`.
- LIVE 268: runtime Build 268 estratto dal commit `cf9ae0aed70713191975d00395abfe36746388f6`, SHA-256 `51a3e9821d0f70c57ad23adb7f10bd66ee6214065ce0e0c7abc9870cc681a11d`, git blob `f980a3dd843eb34b32895774fad6aa5ade255dd7`.
- Build 270: runtime candidato `coordinate_converter Claude.html` nel tree di release, SHA-256 `704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544`, git blob `3acd864dd4bd7510d920bc420e9c223f528e4397`.

## Console e limiti

La console non è pulita. Le richieste esterne abortite intenzionalmente producono messaggi `net::ERR_BLOCKED_BY_CLIENT`; questi sono blocchi di rete e non eccezioni JavaScript. Il LIVE registra inoltre un solo 404 senza URL attribuibile; la hotfix nessun 404. `pageErrors=0` per entrambe le sorgenti, ma il campo `pass: true` non equivale a console pulita. WebKit/Safari non è stato eseguito: non si dichiara PASS su Safari o iPhone reale.
