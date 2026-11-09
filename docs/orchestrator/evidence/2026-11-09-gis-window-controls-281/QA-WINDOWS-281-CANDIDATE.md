# QA mirata delle finestre — candidato Build 281

**Esito: PASS della matrice mirata sul candidato, 9 casi e 123 asserzioni, nessuna fallita.** Esecuzione del 9 novembre 2026, dalle `15:41:39.090Z` alle `15:42:02.766Z`. Il launcher è terminato con codice 0. Questo risultato riguarda il documento candidato intercettato localmente; il controllo della risposta HTTPS pubblicata è un passaggio distinto.

**Integrazione mirata: PASS di un ulteriore caso Astro corto, 11 asserzioni**, eseguito fra `15:52:55.802Z` e `15:52:58.633Z`, richiesto dopo l'ispezione visiva dello screenshot. Totale dei due passaggi sul candidato: 10 casi e 134 asserzioni; la matrice principale non è stata ripetuta.

## Identità e metodo

Build 281, commit candidato comunicato dall'esecutore `0c0f6785654dbba279774bb8569788088f0762e9`, blob `3dcff61081a2f461f8841953986ced17b058eab1`. SHA-256 verificato dal launcher e dal runner prima e dopo: `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62`, 11.108.861 byte. La baseline Build 280 resta `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`.

Runner effettivo: `regression-panels-edge-281.cjs`, SHA-256 `b68f5fe12b65299ee146cba78a341a940d4a1d9be172448b5e67dd0467cb8594`. Microsoft Edge 157.0.4341.42 su ASUSDESKTOP/Windows, Node 26.8.1 e Playwright 1.62.1. Un nuovo contesto non persistente per ciascun caso, senza profilo dell'operatore, senza permessi GPS o stato di autenticazione caricato.

Il solo documento di navigazione è stato fornito con i byte verificati del candidato. Tutte le altre richieste applicative sono state bloccate, inclusi tile, favicon e WebSocket; non sono stati inviati POST o richieste provider. Nessuna funzione applicativa è stata invocata per forzare aperture, coordinate, stati pick o geometria. Le letture dello stato e del DOM sono osservazioni; le azioni sono click, tastiera e trascinamenti sui controlli UI reali. Non sono stati usati click forzati.

## Risultati per percorso

| Caso | Risultato osservato |
|---|---|
| Converti desktop, 1440×1000 | Nodo AX nativo con ruolo `dialog`, nome «Convertitore — inserisci coordinate» e `ignored=false`. `aria-labelledby=convertModalTitle`. Apertura, scroll interno, minimize, restore, chiusura, riapertura e singolo Escape completati. |
| Converti stretto, 390×844 | Stesso nome AX completo; controlli raggiungibili e ciclo di vita completato. Il nome accessibile è verificato nel browser, non dedotto dalla presenza dell'attributo. |
| Guida sopra Converti | Percorso `#topbarConvertBtn` → `#btnHeaderSettings` → `#btnHelp`; focus sul pulsante minimize di Guida. Primo Escape chiude solo Guida; Converti resta aperto. Secondo Escape chiude Converti. |
| Input di Converti | Dopo l'inserimento della fixture pubblica `44.10270, 9.82360` in `#pasteInput`, Escape chiude Converti, porta il focus a `BODY` e conserva il testo. Corrisponde alla baseline osservata. |
| Pick di Traccia | Il pulsante Traccia sulla mappa apre il pannello e attiva il pick. Primo Escape esce dal pick lasciando aperto Traccia; secondo Escape chiude il pannello vuoto. Sulla baseline il primo Escape eseguiva entrambe le azioni. |
| Dialogo figlio Salva traccia | Due punti sintetici aggiunti con click sulla mappa; il CTA visibile `[data-role="track-save-current"]` apre `trackSaveNameDialog` con `showModal`. Se il pick è ancora attivo, il primo Escape esce dal pick e lascia il figlio aperto. Dopo annullamento e riapertura con pick spento, Escape chiude solo il figlio; pannello e punti restano invariati e il numero di tracce salvate rimane zero. Il comportamento del cancel isolato corrisponde alla baseline. |
| Astro desktop, 1440×1000 | Geometria iniziale e dopo restore/riapertura `(12,77,480,520)` px, identica alla baseline entro 1 px. Controlli raggiungibili. |
| Astro stretto, 390×844 | Apertura sotto la testata; drag verticale effettivo di 48 px, limite superiore rispettato, resize verticale effettivo di 40 px. Dimensioni nuove conservate dopo minimize/restore e chiusura/riapertura. |
| Astro corto, 390×600 | Stesso ciclo di azioni e stessi controlli di raggiungibilità; nessun pannello oltre il viewport nelle fasi osservate. |

Il cancel del dialogo figlio è esercitato attraverso Escape e il controllo Annulla dell'applicazione: l'asserzione riguarda lo stato del dialogo HTML nativo e dei suoi dati. Non si attribuisce all'evento nativo `cancel` una gestione che il codice può intercettare e completare direttamente.

## Misure Astro

Rettangoli espressi come `x, y, larghezza, altezza` in CSS pixel. Nelle due emulazioni strette, la topbar occupa `(8,50,374,40)` e termina a y=90. Il pannello comincia a y=105; header e centri dei due pulsanti ricevono gli hit test previsti.

| Fase | 390×844 | 390×600 |
|---|---|---|
| Apertura | `(12,105,366,438)` | `(12,105,366,312)` |
| Drag verso il basso | `(12,153,366,438)` | `(12,153,366,312)` |
| Drag verso y=0, dopo clamp | `(12,105,366,438)` | `(12,105,366,312)` |
| Resize verticale | `(12,105,366,478)` | `(12,105,366,352)` |
| Restore e riapertura | `(12,105,366,478)` | `(12,105,366,352)` |

L'incremento di larghezza non è richiesto: lo spazio utile a 390 px è limitato dal vincolo minimo esistente. La prova usa il resize sud-est con spostamento verticale e verifica gli effetti reali senza invocare gli helper di layout.

## Console, rete e integrità

Zero errori JavaScript `pageerror`; zero tentativi POST/provider; zero risposte favicon. I 731 errori risorsa in Console corrispondono esclusivamente a `net::ERR_BLOCKED_BY_CLIENT.Inspector`, coerenti con il blocco intenzionale delle richieste accessorie. Non sono presentati come Console priva di messaggi né come difetti del runtime. Lo sfondo senza tile negli screenshot dipende da questo isolamento.

`evidence-manifest.json` elenca 21 artefatti con lunghezza e SHA-256, tutti ricontrollati dopo il trasferimento dal PC; comprende sette PNG diagnostici a risoluzione originale, JSON completi, manifest di esecuzione, console e runner effettivi. `credential-check.json` registra il controllo esteso di 23 file testuali, inclusi integrazione, rapporti e runner live preparato, senza assegnazioni sospette. Il runner non acquisisce cookie, header Authorization, chiavi API, credenziali o contenuti di profili utente.

## Tentativi conservati e limiti

`instrumentation-attempt1` conserva il primo giro aggiuntivo sulla baseline: input e pick osservati correttamente; il percorso del dialogo figlio era bloccato dall'uso di un pulsante legacy intenzionalmente nascosto e il reopen Astro era anticipato rispetto alla visibilità del menu. Sono errori del percorso di collaudo, non FAIL del prodotto. Il runner corretto attende una condizione UI osservabile e usa il CTA canonico. I due soli casi da completare sono stati eseguiti in `baseline-280`; il candidato confronta l'input con il caso già completo e non lo ricostruisce artificialmente.

Il precedente audit Build 280 con tre difetti riprodotti e i tentativi infrastrutturali bloccati restano separati. Non è stata ripetuta la matrice routing/provider.

## Integrazione: scroll interno fino a Calcola su Astro corto

I 24 controlli iniziali del caso 390×600 verificavano la geometria e il ciclo di vita, senza raggiungere l'azione primaria tramite scroll. L'ispezione dello screenshot ha quindi motivato un solo controllo aggiuntivo nel pannello appena aperto, alto 312 px, ancora più corto del pannello ridimensionato e riaperto alto 352 px.

La rotella dentro `#astroPanelBody` porta `scrollTop` da 0 a 123; lo scroll della pagina resta `(0,0)`. L'header resta esattamente `(13,106,364,59)`. Il pulsante `#btnAstro2`, inizialmente non raggiungibile al centro e posizionato a y=448,78125, arriva a y=325,78125: `elementFromPoint` restituisce il pulsante stesso, abilitato. Il normale clic su Calcola genera la tabella locale di Sole, crepuscoli e Luna con tempi UTC/LMT; i punti e la data sono pubblici/sintetici. Non è un controllo dell'accuratezza astronomica, ma dell'utilizzabilità dell'azione locale e dello scroll. Header stabile anche dopo il calcolo, zero errori JavaScript e zero tentativi POST/provider.

Runner supplementare SHA-256 `b217175041d52ba112404fe5f58d7ec408f3f803ee33722da8621b94810663a7`; runtime ancora `e8bd8c1d…`. `short-scroll-281/evidence-manifest.json` conserva i sette artefatti associati con hash e lunghezza, tutti verificati dopo il trasferimento. I due screenshot attendono le animazioni finite del dialogo prima dell'acquisizione; il primo mostra Calcola interamente raggiungibile dopo lo scroll.

I viewport stretti sono emulazioni Edge/Chromium con DPR 1, `isMobile` e `hasTouch`, ma le azioni usano input mouse e tastiera. Non sono test Safari, touch fisico, rotazione su telefono o tutte le 38 finestre. La modalità fuori GIS non è stata forzata. Queste prove non attestano il file pubblicato: l'ABQA dopo il deploy deve leggere e verificare la vera risposta HTTPS senza sostituire il documento.
