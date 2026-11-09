# ABQA dopo il deploy — Build 281

**Esito: PASS dei tre casi mirati sul documento HTTPS realmente servito.** Esecuzione unica del 9 novembre 2026, dalle `16:18:42.686Z` alle `16:18:57.697Z`: tre documenti nativi verificati, tre casi completati, 23 asserzioni senza fallimenti. Launcher concluso con codice 0; durata registrata dal processo 15,49 secondi. Nessun blocker.

## Documento effettivamente osservato

URL esatto del collaudo:

<https://ionos-n8n-new.tailc01234.ts.net/gis?v=e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62&qa=windows-postdeploy-281>

In ciascuno dei tre contesti nuovi, la vera navigazione HTTPS restituisce stato 200, **11.108.861 byte**, SHA-256 **`e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62`** e Build 281. Il corpo è stato letto con `Network.getResponseBody` nativo e verificato prima delle azioni UI. Nessun documento proviene dalla cache disco o da un Service Worker. Il runner non sostituisce né modifica il documento e non carica l'HTML locale come fallback.

Il GO dell'esecutore comunicava `DEPLOY_PASS` alle `16:17:38.520901 UTC`, HEAD VPS `cee1c9a1e71a38fc36ba33ab717870730d70036b` e blob runtime `3dcff61081a2f461f8841953986ced17b058eab1`. Questi identificativi di deploy provengono dall'esecutore; l'identità dei byte sopra indicata è stata controllata indipendentemente dal browser.

## Ambiente e isolamento

Microsoft Edge 157.0.4341.42 su ASUSDESKTOP/Windows, Node 26.8.1 e Playwright 1.62.1. Tre contesti non persistenti, senza profili dell'operatore, permessi GPS, storage o cookie caricati. La navigazione HTTPS del documento è l'unica richiesta applicativa autorizzata; tutte le richieste accessorie e i WebSocket sono bloccati.

La verifica TLS del browser resta attiva (`ignoreHTTPSErrors=false`). Tutte le tre risposte riportano `securityState=secure`, protocollo **TLS 1.3**, hostname corretto e issuer **ESET SSL Filter CA**. È la CA locale osservata dal browser sul PC: questo risultato non attribuisce al browser la catena server vista dall'esecutore sul VPS.

Runner congelato: `postdeploy-panels-edge-281.cjs`, SHA-256 `5979c49ed81a8a07d17e7cfe2409c2c0705cd28166d1037e1ccf766c88dd98b0`. Il launcher ne verifica l'hash prima dell'avvio. Il buffer CDP è dimensionato per il documento standalone di 11 MB; non sono stati necessari retry, fallback o modifiche al runner.

## Risultati osservati

| Caso live | Asserzioni | Riscontro |
|---|---:|---|
| Converti, desktop 1440×1000 | 8 | Dialogo AX con nome «Convertitore — inserisci coordinate», ruolo `dialog`, `ignored=false`, titolo collegato da `aria-labelledby=convertModalTitle`. Header e controlli raggiungibili, chiusura normale funzionante. |
| Guida sopra Converti, desktop | 5 | Apertura tramite i controlli reali, focus sul minimize di Guida. Primo Escape chiude Guida e mantiene Converti aperto; secondo Escape chiude Converti. |
| Astro, viewport 390×844 | 10 | Pannello `(12,105,366,438)` px, topbar terminante a y=90. Centri di close/minimize raggiungibili; minimize, restore dal dock e chiusura effettuati senza click forzati. Geometria dopo restore invariata. |

Le 23 asserzioni comprendono anche il documentGate, l'assenza di errori JavaScript e l'assenza di tentativi POST/provider per ciascun caso. Non rappresentano 23 scenari indipendenti.

## Console e rete

- **3 richieste GET native del documento, 3 documentGate PASS.**
- **0 tentativi POST, 0 tentativi provider/routing, 0 errori JavaScript `pageerror`.**
- **170 richieste accessorie bloccate**, con i soli messaggi Console `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT.Inspector`: 59 nel caso Converti, 59 nel caso Escape e 26 nel caso Astro.
- **0 risposte favicon.**

I messaggi di risorsa e lo sfondo senza cartografia negli screenshot sono conseguenze del blocco intenzionale dei tile e delle risorse accessorie. Il rapporto non li presenta come una Console vuota né come errori JavaScript del prodotto.

## Prove e perimetro

`postdeploy-281/postdeploy-summary.json` contiene il riepilogo strutturato; `audit-results.json` conserva le osservazioni complete; `execution-manifest.json` e `execution-console.txt` documentano l'unica esecuzione. `evidence-manifest.json` elenca nove file con lunghezza e SHA-256, compresi tre PNG diagnostici e i due file del runner/launcher: tutti verificati dopo il trasferimento dal PC.

Questa prova live è distinta dalla precedente matrice sul candidato intercettato. Non sono stati ripetuti i nove casi completi, il supplemento di scroll o i test routing/provider. Le viste strette sono emulazione Edge/Chromium con mouse e tastiera, non Safari o un telefono fisico. L'esito è l'ABQA mirata dei tre difetti corretti, non un PASS generale delle 38 finestre o una conferma della QA umana.
