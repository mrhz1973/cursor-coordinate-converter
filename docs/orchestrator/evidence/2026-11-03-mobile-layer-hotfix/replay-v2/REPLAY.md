# Replay accoppiato LIVE 268 / hotfix 270

## Esito

Replay autorevole completato con Edge Chromium 156.0.4314.50 tramite Playwright. `replay-summary.json` riporta `pass: true` e `failureCount: 0`. Un solo runner ha eseguito lo stesso scenario e prodotto lo stesso schema per entrambi gli HTML. Il runner registra i mismatch e termina con codice non zero se un controllo richiesto fallisce.

Il confronto dimostra il difetto LIVE: dopo rotazione e variazione di altezza il menu Layer si chiude in tutti i cinque profili. Build 270 mantiene il menu aperto e nei limiti visibili dopo entrambe le variazioni in tutti i cinque profili. Il tap della basemap OSM HOT e le operazioni esterne di chiusura/riapertura riescono nei profili previsti. MGRS è raggiunto e selezionato con gesto e tap touch nei quattro profili mobili Build 270; sul desktop si usa mouse wheel e mouse click.

| Profilo | LIVE dopo rotazione e altezza | LIVE MGRS | Build 270 dopo rotazione e altezza | Build 270 MGRS | Build 270: fuori/riapri/chiudi | pageErrors |
| --- | --- | --- | --- | --- | --- | ---: |
| 390×844 portrait | chiuso / chiuso | attivo, scrollTop 85 | aperto e sicuro / aperto e sicuro | attivo, scrollTop 85 | PASS | 0 |
| 320×720 portrait | chiuso / chiuso | attivo, scrollTop 85 | aperto e sicuro / aperto e sicuro | attivo, scrollTop 85 | PASS | 0 |
| 844×390 landscape | chiuso / chiuso | attivo, scrollTop 255 | aperto e sicuro / aperto e sicuro | attivo, scrollTop 255 | PASS | 0 |
| 720×320 landscape | chiuso / chiuso | non raggiungibile, scrollTop 0; punto di tap clamped sul footer | aperto e sicuro / aperto e sicuro | attivo, scrollTop 343 | PASS | 0 |
| 1280×800 desktop | chiuso / chiuso | attivo, scrollTop 180 | aperto e sicuro / aperto e sicuro | attivo, scrollTop 180 | PASS | 0 |

La basemap OSM HOT è risultata selezionabile in tutti e cinque i profili per entrambi gli HTML. Le aperture iniziali, i tap, il gesto touch di scroll nei quattro profili mobili, la rotella mouse nel desktop, la verifica del target prima del tap e la chiusura finale sono registrati in `replay-results.json`. Rotazione, variazione d'altezza e interazione sono state eseguite su page/context separati; l'ordine dei controlli è stato identico tra LIVE e hotfix, ma non era un unico flusso continuo sulla stessa pagina.

## Metodo e provenienza

- Sorgenti: `live268.html` e `hotfix270.html`, serviti da disco tramite server locale temporaneo.
- Rete: Playwright ha consentito solo l'origine del server temporaneo e ha abortito le altre origini. Questo mantiene locali gli asset e impedisce richieste esterne.
- Sequenza identica: apri Layer; ruota viewport; ripristina; tocca fuori e riapri; riduci altezza; ripristina; tocca fuori e riapri; seleziona OSM HOT; chiudi fuori e riapri; scorri fino a MGRS; verifica e seleziona MGRS; chiudi fuori; riapri e richiudi. Nei profili mobili lo scroll e i tap usano touch; nel desktop lo scroll usa la rotella e i tap usano il mouse.
- Profili identici: 390×844 portrait, 320×720 portrait, 844×390 landscape, 720×320 landscape e 1280×800 desktop.
- Runner: [`runner-used.js`](runner-used.js), SHA-256 `3fb4ada73e55656b9bf008963a8890115fc4fb15123372f76887ba5a3a2dc77c`.
- LIVE 268: runtime Build 268 estratto dal commit `cf9ae0aed70713191975d00395abfe36746388f6`, SHA-256 `51a3e9821d0f70c57ad23adb7f10bd66ee6214065ce0e0c7abc9870cc681a11d`, git blob `f980a3dd843eb34b32895774fad6aa5ade255dd7`.
- Build 270: runtime candidato `coordinate_converter Claude.html` nel tree di release, SHA-256 `704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544`, git blob `3acd864dd4bd7510d920bc420e9c223f528e4397`.

Le schermate per rotazione, cambio altezza e tap MGRS 720×320 sono archiviate accanto a questo file. I riepiloghi macchina sono `replay-summary.json` e `replay-results.json`.

## Errori di console e limiti

`pageErrors=0` per LIVE e Build 270. La console non è pulita: il LIVE registra 1.401 messaggi `net::ERR_BLOCKED_BY_CLIENT` e un singolo 404 senza URL attribuibile; la hotfix registra 1.425 messaggi `net::ERR_BLOCKED_BY_CLIENT` e nessun 404. Sono state intenzionalmente bloccate 1.408 richieste esterne sul LIVE e 1.484 sulla hotfix. I messaggi `ERR_BLOCKED_BY_CLIENT` descrivono questi blocchi attesi e non sono eccezioni JavaScript. `pass: true` copre i controlli del gate e non implica una console senza errori.

Playwright WebKit non è disponibile nell'ambiente; il replay è Edge Chromium con user-agent iPhone 13 Pro e input touch emulato sui quattro profili mobili. Non si dichiara un PASS Safari o su iPhone reale. I precedenti `before/baseline/after/final-probe.json` e le relative schermate restano prove preliminari, perché usavano runner e schema diversi. Le etichette di tap erroneamente attribuite a WebKit in quei file sono state corrette in Edge Chromium.
