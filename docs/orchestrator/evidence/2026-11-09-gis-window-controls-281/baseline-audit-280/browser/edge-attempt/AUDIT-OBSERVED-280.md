# Audit mirato delle finestre — Build 280

Data delle osservazioni: 9 novembre 2026. Esito: **tre difetti riprodotti**. Non è un PASS generale dell'applicazione.

## Documento e ambiente

Runtime immutato prima e dopo il collaudo: SHA-256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`, 11.108.654 byte. Il documento candidato è stato intercettato localmente sul solo URL di navigazione. Questo passaggio non prova il documento pubblicato.

Microsoft Edge 157.0.4341.42 su ASUSDESKTOP/Windows, Playwright 1.62.1, Node 26.8.1. Contesti nuovi, temporanei, senza profilo, cookie o archivio dell'operatore, senza permessi GPS. Richieste accessorie e WebSocket bloccati; zero tentativi POST/provider nei sette casi principali e nel controllo aggiuntivo del focus. Il viewport stretto usa emulazione Chromium 390×844, DPR 1 e input mouse: non è Safari né una prova di gesti su un telefono fisico.

Il primo tentativo Windows/cloud bloccato resta documentato separatamente nella cartella superiore. Il successivo tentativo Edge non ne altera l'esito.

## Osservazioni riprodotte

| Difetto | Percorso UI e risultato osservato | Evidenza |
|---|---|---|
| Converti privo di nome accessibile | `#topbarConvertBtn`; dialogo aperto su desktop e viewport stretto. Il titolo visibile è «Convertitore — inserisci coordinate», ma il nodo AX nativo ha ruolo `dialog`, nome vuoto e `ignored=false`. Il titolo non ha ID e manca `aria-labelledby`. Il risultato si ripete dopo riapertura e ripristino. | `audit-results.json`, casi `desktop-convert` e `mobile-convert-reference`; screenshot omonimi `*-opened.png`. |
| Un Escape chiude Guida e Converti | Apertura ordinata con `#topbarConvertBtn`, `#btnHeaderSettings`, `#btnHelp`. Entrambi i dialoghi sono aperti; il focus è sul pulsante `BUTTON.app-modal-min-btn[data-role="helppanel-minimize"]` dentro `helpOverlay`. Una sola pressione di Escape chiude entrambi. | `escape-focus/audit-results.json` e screenshot prima/dopo. |
| Header Astro coperto a 390×844 | Apertura Strumenti → Astro. Pannello a `(0,0)`, 374×720 px; header a `(1,1)`, 372×59 px. Il centro della chiusura, `(342,30)`, è intercettato da `DIV.hdr-group.hdr-iconbar`; quello di minimize, `(304,30)`, da `SPAN.net-label`. Entrambi i controlli sono nel viewport ma non ricevono il puntatore al centro. | `audit-results.json`, caso `mobile-astro-safe-top`, e `mobile-astro-safe-top-opened.png`. |

Per Astro, `#appTopbar` misura `(8,50)`, 374×40 px. Il centro dell'header del pannello è intercettato da `DIV.brand`; non risultano altri dialoghi sovrapposti. I pulsanti non sono stati azionati con click forzati: minimize/restore/close non sono dunque provati per questo caso baseline. L'ipotesi causale sulle regole CSS mobile `!important` è corroborata dal sorgente ed è distinta dall'osservazione browser dei rettangoli e degli elementi intercettanti.

## Altre verifiche circoscritte

I sette casi diagnostici sono terminati fra `2026-11-09T15:16:16.714Z` e `2026-11-09T15:16:36.270Z`; il controllo aggiuntivo del focus fra `15:23:45.698Z` e `15:23:48.727Z`. Le prove di Guida, Strumenti e Misura desktop non hanno evidenziato anomalie nei controlli, nello scroll e nel ciclo di apertura/minimize/restore/chiusura effettivamente esercitati. Le ripetizioni dello stesso difetto AX di Converti sono conteggiate come un solo difetto.

La modalità fuori GIS non è stata forzata: l'inventario del sorgente segnala che questa build impone GIS all'avvio e non espone un ingresso utente supportato alla modalità legacy. Nessuna conclusione comportamentale è attribuita a quel ramo.

## Integrità e limiti

Runner principale SHA-256 `bfe8d103d9e699d8cc7cb652ee5f7bb0a5ea014f79334e21febae67b38e5b201`. `audit-escape-focus.cjs` verifica quel runner ed estende solamente la raccolta osservativa del focus. `evidence-manifest.json` conserva hash e lunghezze dei 17 artefatti recuperati dal PC; ogni file è stato confrontato dopo il trasferimento. I cinque PNG diagnostici restano a risoluzione originale.

`completed:true` nei JSON significa che la procedura diagnostica è terminata; non significa accettazione del prodotto. Lo sfondo senza cartografia negli screenshot deriva dalle richieste di tile bloccate nel collaudo. Non sono state ripetute prove di routing, dati geodetici o provider.
