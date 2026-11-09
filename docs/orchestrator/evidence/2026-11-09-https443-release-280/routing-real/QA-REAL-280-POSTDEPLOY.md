# Build 280 — Automated Browser QA dopo il deploy

## Esito

**PASS sul documento live**, il 9 novembre 2026 dalle **13:36:32 alle 13:36:46 UTC**, equivalenti alle **14:36:32–14:36:46 italiane**. Questa prova è distinta dalla matrice prepubblicazione eseguita con il candidato iniettato.

URL esatto utilizzato, disponibile anche per la QA umana:

`https://ionos-n8n-new.tailc01234.ts.net/gis?v=70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`

Il risultato tecnico non sostituisce l'accettazione umana o la review esterna previste dal processo del progetto.

## Documento, build e richieste

Il browser ha caricato il documento reale tre volte: apertura iniziale, ricaricamento per verificare il salvataggio, riapertura per i controlli delle impostazioni di rete. Per tutti e tre i caricamenti:

- HTTP 200; **11.108.654 byte**.
- SHA256 **`70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`**.
- `documentServes=0`, `documentInterception=false`: nessun `fulfill` dell'HTML.
- Build letta nel browser: **280**, identificativo `ROUTING-LAND-ONLY-NO-FERRY-A`; titolo coerente.
- TLS 1.3 verificato dal browser, con issuer **ESET SSL Filter CA** del sistema Windows. Non si attribuisce a questo browser la catena server osservata separatamente dal VPS.

**Sono stati consumati esattamente due POST reali:** uno GraphHopper `mtb_trail` e uno ORS `cycling-mountain`, sulla stessa fixture pubblica A 44.1024/9.8236 e B 44.107/9.829. Un solo GET GraphHopper `/info`; nessun `/nearest` necessario per questo confronto. Entrambi i POST riportano nel log `documentGate`, con la SHA del documento già verificato prima del dispatch. Non sono state ripetute le altre combinazioni di profilo.

Le richieste provider sono rimaste native e le risposte originali sono archiviate senza riscrittura. Per entrambe: HTTP 200, metadati terrestri e snap validati indipendentemente; una alternativa effettivamente restituita da ciascun servizio.

## Riscontro dell'interfaccia e dei dati salvati

Il confronto ha prodotto due risultati PASS. Sono stati selezionati entrambi i provider tramite i pulsanti dell'app e verificati i punti della preview contro la geometria originale della risposta. I due salvataggi contengono rispettivamente **20 punti GH** e **34 punti ORS**; geometria coerente sia nello stato dell'app sia nel localStorage del context temporaneo. Dopo il ricaricamento, entrambe le tracce sono state ritrovate con la stessa geometria.

La schermata `postdeploy/postdeploy-compare-mtb-routing-pass.png` mostra il confronto, le metriche, i controlli di scelta e la geometria sovrapposta sulla mappa. Le tile e altre risorse esterne sono intenzionalmente bloccate: lo screenshot verifica la UI del routing e la sovrapposizione, non la qualità della cartografia di fondo.

## Offline e OPSEC

I controlli sono stati azionati attraverso l'interfaccia reale, senza modificare direttamente lo stato: Mappe Offline per la modalità forzata, Impostazioni → Guida per OPSEC strict. Prima dei clic di confronto sono stati ricontrollati entrambi i punti nello stato e nei campi di coordinate.

| Impostazione | Riscontro GH e ORS | Tentativi provider |
|---|---|---:|
| Offline forzato | Entrambe le card visibili: «Errore: Routing bloccato: modalità offline forzata.» | 0 |
| OPSEC strict | Entrambe le card visibili: «Errore: Routing bloccato: OPSEC strict attivo.» | 0 |

Gli assert richiedono sia lo stato di errore atteso sia la presenza del messaggio corretto nelle card visibili. Il runner avrebbe bloccato e registrato qualsiasi tentativo di richiesta provider nelle due fasi; non ne è stato osservato alcuno. Il totale POST è rimasto due.

Le schermate `postdeploy/postdeploy-compare-mtb-offline-pass.png` e `postdeploy/postdeploy-compare-mtb-opsec-pass.png` sono state ispezionate e mostrano le rispettive card di errore.

## Console e rete

- Zero `pageerror`.
- Zero errori di trasporto provider e zero rifiuti del guard per i POST autorizzati.
- I 616 errori console hanno tutti il testo `ERR_BLOCKED_BY_CLIENT.Inspector` e corrispondono ai blocchi intenzionali delle risorse accessorie. Nessun errore console di altro tipo in questa esecuzione.
- Tre richieste favicon automatiche, tutte bloccate da CDP con `blockedReason=inspector`; **zero risposte server** e nessun 404 favicon.
- Context browser nuovi, non persistenti, chiusi al termine; nessun profilo utente aperto, nessuna permission di geolocalizzazione concessa, nessun comando GPS azionato.

## Tentativo preliminare del gate e correzione del runner

Il primo tentativo postdeploy si è fermato con **zero POST**: il buffer DevTools predefinito non conservava il corpo dell'HTML da 11,1 MB e Playwright riportava `Request content was evicted from inspector cache`. Il gate SHA ha impedito qualsiasi richiesta di calcolo. Questo tentativo non dimostra un mismatch del file e non è riportato come PASS.

È conservato in `postdeploy-attempt1/`, con runner effettivo SHA256 `cb0a6be1a9ae8be79b42a9eb15d8d0deacec2aae6c87ed45050084ce3d94a273`, risultato, manifest, console e screenshot.

La sola correzione riguarda l'osservazione del runner: buffer CDP totale 64 MiB, per risorsa 24 MiB, lettura del corpo mediante `Network.getResponseBody`. Non modifica le risposte, l'HTML o il DOM. Il secondo tentativo ha verificato la SHA su tutti i caricamenti e completato l'intera matrice autorizzata.

## Evidenze e integrità

Runner effettivo del PASS: `postdeploy/real-routing-280.cjs`, SHA256 **`4d3c4283a24a902ad379a20864b2f0cc79a57faea04d150ea00a76092b2ce770`**.

Le prove principali sono `postdeploy/qa-summary.json`, `postdeploy/results.json` e `postdeploy/execution-manifest.json`. Le due risposte sono in `postdeploy/responses/`; i tre screenshot sono nella stessa directory `postdeploy`.

`postdeploy-artifact-manifest.json` elenca le SHA256 dei quindici file del tentativo preliminare e del PASS. Dopo il trasferimento tutti e quindici sono stati verificati byte per byte. Il pacchetto di trasporto non è necessario per il checkpoint.

La scansione aggiornata `evidence-data-check.json` non rileva chiavi o valori Cookie, Authorization, API key o token nelle evidenze JSON. Gli screenshot mostrano esclusivamente l'app e la fixture pubblica sintetica. La QA reale complessiva ha consumato **1 POST sul candidato precedente fallito, 7 POST prepubblicazione sul definitivo e 2 POST dopo il deploy**; il tentativo buffer non ne ha consumati.
