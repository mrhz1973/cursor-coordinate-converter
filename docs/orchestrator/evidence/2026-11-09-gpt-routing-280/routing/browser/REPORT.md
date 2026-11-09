# Build 280 — QA routing/browser isolata

Data: 9 novembre 2026. Esecuzione Windows attraverso Remote Desktop Commander, device `d83b73f5-cd48-4f0b-a180-e2beb21ee14d`.

## Identità e risultato

Candidato: `candidate-280-1e6c11cf.html`, SHA-256 `1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a`. SHA verificata prima delle prove da ogni runner e nuovamente sul dispositivo dopo tutte le prove. Nessuna modifica al runtime.

**54/54 PASS, 0 FAIL, 0 pageError.** Copertura effettiva: **38 casi generali + 4 transizioni policy + 9 casi anchor recuperati + 3 nuove prove negative di origine**. Non è dichiarata la riproduzione dei 13 casi anchor storici.

| Evidenza | PASS/casi | pageError |
| --- | --- | --- |
| `general-38.json` | 38/38 | 0 |
| `transitions-4.json` | 4/4 | 0 |
| `qa-compare-snap-anchor-280-results.json` | 1/1 | 0 |
| `qa-compare-snap-guard-280-results.json` | 6/6 | 0 |
| `qa-snap-anchor-280-results.json` | 2/2 | 0 |
| `origin-guard-3.json` | 3/3 | 0 |

## Ambiente e isolamento

Playwright: `C:/goi-pw-probe/node_modules/playwright`; Chromium dal percorso `C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe`, headless. Ogni scenario usa un browser context nuovo e non persistente, con service worker bloccati. Il documento viene servito direttamente dai byte del candidato tramite intercettazione Playwright. Tutte le richieste osservate passano nell'intercettazione: provider simulati o richiesta annullata; nessun server di prova o provider reale contattato. Le coordinate sono le fixture sintetiche originali. I test di salvataggio usano soltanto lo stato del context temporaneo, poi chiuso.

Origine dei casi ordinari: `https://ionos-n8n-new.tailc01234.ts.net/`. Il solo caso di fallback GH locale→VPS usa `http://31.70.139.73/gis/` per conservare il contratto HTTP legacy senza allentare i gate HTTPS. Le tre prove negative usano `https://app.invalid/` e richiedono **zero richieste provider in tutte le fasi**, comprese apertura e preparazione.

## Esiti rilevanti

- Le38 prove generali conservano la matrice e le fixture originali: filtri no-ferry, metadati mancanti/corrotti, snap oltre soglia, alternative miste, errori di rete/timeout, aree da evitare, selezione/salvataggio da Compare, profili GH/ORS e fallback locale→VPS. Nessun POST routing prima dell'azione esplicita nei38 scenari.
- Le4 transizioni GH/ORS verso OPSEC strict oppure offline rifiutano il risultato e non avviano ulteriori richieste provider dopo il cambio policy.
- I9 casi anchor verificano l'anchor confermato a150m, il mantenimento delle coordinate originali, mismatch di profilo/provider, conferma richiesta, anchor stale, snap ORS troppo distante e snap GH oltre50m. Il confronto conserva l'anchor condiviso e lascia selezionabile il risultato valido quando l'altro viene rifiutato.
- Le3 prove di origine HTTPS sconosciuta rifiutano GH, ORS e Compare, senza alcuna richiesta provider in startup/setup/action.

## Adattamenti e acceptance

`adaptation-manifest.json` e i sei file `.cjs.diff` distinguono le modifiche di I/O dalle acceptance. Modifiche ordinarie: path e pin SHA del candidato; documento all'origine HTTPS443 esatta consentita; HTTPlegacy per il solo fallback locale; browser Chromium esplicito per gli harness che prima cercavano Edge/Chrome; output isolato e service worker bloccati. I file originali non sono stati modificati.

Unica correzione dell'acceptance esistente: il404 ORS con `error: ors_not_found` è ambiguo nel contratto gateway fornito per la ripresa. La fixture originaria resta identica, ma deve produrre rifiuto/no preview/no salvataggio e `routing.errorOrsHttp`, senza la falsa diagnosi `routing.landUnavailable`. Osservato: **Errore gateway ORS**. Il caso GH con `ConnectionNotFoundException` conserva l'aspettativa specifica `routing.landUnavailable`; osservato il messaggio di percorso terrestre non disponibile.

Il riferimento storico13 anchor non è stato trasformato in un PASS corrente. Un'unica ricerca mirata nella directory remota autorizzata ha recuperato altri5 runner, che duplicano matrici già disponibili; le prove anchor effettivamente recuperate sono1+6+2. Non sono stati inventati ulteriori casi per raggiungere13.

## Artefatti e riproduzione

Cartella remota: `C:/Users/Utente/Downloads/Documents/ChatGPT/TMART GIS Tool/work/gpt-resume-20261109/routing`. Cartella cloud: `/workspace/scratch/bcbe375c6817/qa-gis-routing-final`.

Eseguire i sei runner `.cjs` adattati su Windows con il candidato al percorso pinnato nei file. `adapt-routing-harnesses.py` riproduce gli adattamenti dalle copie originali. Il pacchetto include runner, originali utilizzati, diff, manifest e JSON dei risultati; il runtime candidato è identificato dal percorso e dall'hash e non è duplicato nel pacchetto.

## Limiti

Questa è QA browser con provider simulati, eseguita tramite GPT. Non prova disponibilità dei provider reali, TLS/CORS attraverso la rete reale, copertura geografica, correttezza universale dei dati cartografici o un deploy. Non è review esterna di un provider differente. Non sostituisce i gate reali ancora aperti in FRONTIER.
