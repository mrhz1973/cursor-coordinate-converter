# Build320 — review dello stato del gate di rilascio

Data: 22 novembre 2026. Review documentale delle sole quattro ricevute indicate dal root; nessuna nuova esecuzione, lettura del runtime, modifica dei guard o riapertura delle prove consumate.

## Decisione e stato corrente

**Build320 LIVE / DEPLOY_TECHNICAL_PASS / QA_CANDIDATO_QUALIFICATA / ABQA_LIVE_BLOCKED / QA_OPERATORE_PENDING. FINITO non innescato. Causa dello STOP browser: NON ATTRIBUITA.**

LIVE indica il runtime effettivamente distribuito e verificato sul servizio. Il gate di Automated Browser QA LIVE resta fallito in ammissione, prima dell'esecuzione degli scenari prodotto. Il PASS candidato e la REVIEW GPT-SOSTITUTIVA predeploy già acquisiti restano validi nel proprio perimetro; non sostituiscono il gate LIVE e non sono stati rieseguiti in questa review.

Identità del codice distribuito: commit `ca3a38d1c7703c5bf93724cd5df608af2914751d`, blob `7e6af6b480fb634928ee9a5fc6b73d1be5440cdd`, runtime di **11.334.841 byte**, SHA256 `b3fcec1135b77bd0dec21351fb87b894c5f5828bce455995b8fa03aaf744f689`.

## Evidenze e attribuzione

1. **Deploy tecnico PASS.** La ricevuta acquisita alle `2026-11-22T15:53:00.987692Z` attesta servizio `goi-gis-app` active, working tree VPS CLEAN, backup della Build319 e smoke HTTP/HTTPS 200 sull'identità completa della Build320. I campi QA PENDING della ricevuta descrivono quel momento; il successivo STOP browser determina lo stato corrente ABQA_LIVE_BLOCKED.

2. **GET HTTPS del client nativo PASS, distinto dal browser.** La prova binaria acquisita alle `2026-11-22T16:01:58.2213044Z` registra status 200, stream completato, lunghezza e SHA256 esatti, senza redirect ammessi né bypass della validazione certificati. Attesta la risposta completa ottenuta da quel client; non dimostra che il browser abbia superato l'ammissione, né attesta una catena TLS indipendente o non intercettata. La precedente cattura WebCmdlet incompleta resta non qualificata e non prova la presenza di una versione più vecchia.

3. **Primo LIVE: STOP `LIVE_RESPONSE_STATUS`.** La run `15:54:43.235Z–15:54:44.582Z` registra una richiesta documento e zero documenti LIVE validati; nessun gesto prodotto eseguito, browser chiuso con `OWN_BROWSER_EXIT_OBSERVED`. I contatori di errori a zero prima degli scenari non costituiscono un PASS prodotto.

4. **Diagnostico di ammissione: STOP confermato, causa non risolta.** La run `16:05:22.937Z–16:05:24.778Z` osserva `responseStatusCode: null`, `responseStatusText: null` e `responseErrorReason: "Failed"`, con URL/metodo/frame/network ID canonici corrispondenti. Nessun corpo completo è stato validato; fixture, azioni UI e controlli prodotto non sono stati eseguiti. Il successivo `net::ERR_ABORTED` è esplicitamente marcato `afterFatalStop: true` e `duringOwnedShutdown: true`: non identifica autonomamente la causa dello STOP originario. Il browser owned è uscito, gli input risultano invariati e `fullGateSatisfied` resta false.

Le evidenze non consentono di attribuire un HTTP 403, un guasto TLS/certificati, una causa di rete/Tailscale, un difetto del runtime o un responsabile esterno specifico. I due percorsi client hanno esiti diversi; questa differenza resta un dato, senza spiegazione causale dimostrata.

## Gate operativo

Si arresta la progressione al gate effettivamente fallito e si allinea la documentazione con questi stati. Nessuna attenuazione di boundary A, TLS o OPSEC è autorizzata o proposta da questa review. Nessun nuovo test generale è richiesto qui. La successiva eventuale ripresa del gate LIVE richiederà una base concreta; questa review non la presume, non dichiara QA operatore PASS e non innesca FINITO. Il backstop AI esterno post-hoc già registrato resta distinto e non risolto da queste quattro ricevute.

## Identità delle fonti lette

| Fonte locale | Byte | SHA256 |
|---|---:|---|
| `.git/build320-deploy-receipt.json` | 1594 | `d7cb4ef55494124be207db9936871d025085837f6c57ecf4e9a6daa5a245bee4` |
| `.git/build320-native-https-binary-proof.json` | 1231 | `532ec9c939bf7c6c797138958e8348d8e2555deacd91b00ca0f5796fee293154` |
| `.git/build320-live-https-stop-summary.json` | 1181 | `cc5ef98943d12f8b22a75bbc85fef05b96501c3d8698b60097468180596a11bf` |
| `.git/build320-live-admission-diagnostic-receipt.json` | 5404 | `aa31f4d8b79b9b34cd349a869f0be2f3bf255edf21aa4f96fe4989705227b89b` |

Esito della review di attribuzione: **PASS documentale**, con **gate prodotto LIVE BLOCKED** preservato. Il PASS documentale non cambia l'esito delle run.
