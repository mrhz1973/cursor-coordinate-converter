# Review indipendente — GIS-HELP-TOOLBAR-UX-A build 267

**Esito: PASS scoped con limitazioni** per i casi eseguiti; la decisione sul gate complessivo resta all'orchestratore. Candidate SHA-256 `06fed6daf3f4843538eda8f9f0139e7bfc8605c26baae2bfd977f08eb7898f74`, identità commit definitivo a cura orchestratore. Base runtime build 266 commit `ce02321`. Revisione da subagente distinto dall'implementatore, non review esterna o QA operatore.

## Correzioni successive alla review

Un primo candidate `caa2d176…` è stato respinto: dopo Note → chiudi → Guida → FAQ la testata rimaneva dietro l'header e × non riceveva click. Un secondo candidate `4afbe012…` è stato respinto per brand disposto verticalmente, un carattere per riga, e header alto ~327 px a 1024×768. Entrambi i difetti sono stati comunicati all'implementatore e ritestati su `b055367…`. Non riutilizzare i PASS dei candidate scartati.

## Verifiche indipendenti

- `check.cjs`/`results.json` su copia immutabile: Chromium desktop 1440×900, mobile 390×844 con `isMobile` e `hasTouch`, finestra bassa 820×420. Le note si aprono nella vista dedicata; testata e × nella viewport e hit-test punta al pulsante. Note → × → Guida utente → apertura FAQ → × funziona. Drawer Strumenti si apre e chiude, menu Esporta si apre e Escape lo chiude; stampa invoca `window.print()` intercettato esattamente una volta, JPG apre il dialogo e Annulla lo chiude. Zero pageerror. Controlli realmente interattivi, tranne stampa stub: nessuna stampa/download reale.
- Posizione: desktop, pulsante Strumenti segue visivamente Mappe offline; non è un falso tab e mantiene un listener separato. A mobile la barra è scorrevole: la lettura dei rettangoli senza considerare il clipping dopo auto-scroll non dimostra indipendentemente l'ordine visivo; si veda verifica operatore.
- `opsec/check.cjs`/`opsec/results.json` sullo stesso SHA: desktop/mobile ricerca luogo simulata invia richiesta Nominatim senza countrycodes, coordinate 41.8908/12.4922 corrette, Paese assente, placeholder Roma; strict/geocoding-off/offline non tentano Nominatim. Provider esterni intercettati/bloccati; non si attesta zero richieste a tutti gli endpoint né salute provider reali. `search-ui-results.json` ripete gli stessi casi con apertura pannello via click reale della topbar.
- `theme.cjs`/`theme-results.json` e screenshot `light-settings.png`/`dark-settings.png`: a 1024×768 i temi chiaro/scuro aprono Impostazioni, brand non è più verticale e valori Lingua/Tema sono leggibili. Screenshot light valutato visivamente; test non misura tutti i rapporti di contrasto né tutti i temi/componenti.
- `classic.cjs`/`classic-results.json`: simulazione ramo non-GIS con rimozione classe e `state.gisMode=false` dopo bootstrap; Note/Guida si aprono `:modal`, `aria-modal=true`, chiusura funziona. **Non** è un bootstrap completo in modalità classica, che il runtime forza a GIS in questa release; non attesta intero layout classico.
- Diff letto con scope mirato: nessun nuovo endpoint, fetch, storage o geolocalizzazione; nuova interfaccia sfrutta Guida e handler esistenti. La release notes distingue build pubblicate e cronologia precedente incompleta. Messaggio FAQ avverte che il routing senza traghetti non è ancora garantito.

## Rischio meta viewport e limiti

L'aggiunta `<meta name="viewport" content="width=device-width, initial-scale=1">` cambia il viewport dell'intera app. In Chromium con dispositivo emulato 390×844 il layout passa da `innerWidth=981` della baseline a `innerWidth=390`, rendendo le note leggibili a dimensioni normali. È un cambiamento globale, quindi i controlli mirati di questa review **non** dimostrano l'assenza di regressioni in tutte le schermate, modali, percorsi di editing, import/export e layout salvati. Sono state inoltre eseguite 15 interazioni reali a 320/390/1024 per Converti, Cerca, Mappe offline, Strumenti ed Esporta, tutte PASS con hit-test; vedere navbar-results.json. Sono necessarie prove browser integrative su altri viewport stretti e QA percettiva su dispositivo reale, con particolare attenzione ai pannelli trascurati.

Nessun test su browser diversi da Chromium, dispositivo fisico, servizi provider effettivi, salvataggio/import dati reali, stampa fisica, o runtime HTTP pubblicato. Network di terzi bloccato durante i test. Prevedere ABQA post-deploy e attestazione operatore distinte. Harness `abqa.cjs` prepara verifica dell'URL HTTP reale, hash prima/dopo, Note/Guida/FAQ, Strumenti e dialogo JPG; non ancora eseguito e non contiene tutta la regressione.


## Fix 320px successivo
Candidate b055367... è stato scartato dopo QA orchestratore che ha rilevato click intercettati a 320px. Su 06fed6... test indipendente navbar.cjs 15/15: click reali e hit-test per Converti, Cerca, Mappe offline, Strumenti ed Esporta su 320, 390 e 1024; pannelli corretti aperti, zero pageerror. Rieseguiti sullo stesso hash Note/FAQ/×, stampa stub, JPG, ricerca, OPSEC, temi light/dark e ramo non-GIS simulato: PASS nel solo scope descritto. Nessuna attestazione complessiva per tutte le schermate sensibili alla meta viewport.
