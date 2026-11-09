# REVIEW GPT-SOSTITUTIVA — addendum conclusivo Build 281

## Verdetto corrente

**PASS del gate di review del bundle runtime Build 281. Nessun blocker residuo individuato nello scope esaminato.** Il verdetto integra la review statica e acquisisce la regressione browser mirata sugli stessi byte. Sostituisce lo stato “BROWSER PENDING” della precedente `REVIEW-GPT-SOSTITUTIVA.md`, conservata come rapporto preliminare storico.

È una review sostitutiva svolta da un agente GPT interno diverso dall'esecutore. Non viene attribuita una review AI esterna; il relativo backstop resta separato, quando disponibile. Il root può proseguire con la pubblicazione e il deploy già autorizzati, mantenendo il blob qui identificato. Questo PASS non è un esito di deploy, ABQA sul runtime pubblicato o QA umana.

Ultima acquisizione e verifica delle evidenze: **9 novembre 2026, 15:48:54 UTC**. Alla richiesta di chiusura della review, il root dichiarava pubblicazione e deploy ancora fermi; il reviewer non ha effettuato tali operazioni.

## Identità vincolante

| Campo | Identità verificata |
|---|---|
| BLOCK-ID | `GIS-WINDOW-CONTROLS-A` |
| Runtime source commit immutabile | `0c0f6785654dbba279774bb8569788088f0762e9` |
| Parent | `63d4fd7b3bbd2b02fe10d8e2180c58c31b9e11d0` |
| Runtime | `coordinate_converter Claude.html` |
| Blob | `3dcff61081a2f461f8841953986ced17b058eab1` |
| SHA256 | `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62` |
| Dimensione | 11.108.861 byte |
| Runner SHA256 | `b68f5fe12b65299ee146cba78a341a940d4a1d9be172448b5e67dd0467cb8594` |

Il raw Git del commit è stato nuovamente confrontato con gli identificatori delle evidenze: SHA256 del candidato, SHA dopo l'esecuzione e dimensione coincidono in summary, risultati e manifest. L'hash del runner locale coincide con summary e manifest. La review statica aveva già verificato il diff completo, le dieci regioni autorizzate, l'identità dei byte esterni e la corrispondenza dei due script JS alla prova sintattica 2/2 PASS; quelle verifiche restano valide e non sono state ripetute.

Il checkpoint documentale successivo annunciato dal root può accompagnare la pubblicazione senza spostare la fonte della review: il verdetto resta riferito al source commit sopra indicato e allo stesso blob runtime. Nessun FULL_SHA futuro viene inventato o considerato già pubblicato.

## Evidenza browser acquisita

Esecuzione **15:41:39.090–15:42:02.766 UTC**, Microsoft Edge/Chromium **157.0.4341.42** su Windows, Playwright **1.62.1**, Node **v26.8.1**. Il documento candidato è stato fornito localmente al contesto temporaneo (`sourceMode: candidate_injected`); il manifest dichiara rete non consentita e nessun profilo utente esistente aperto. L'URL HTTPS registrato identifica il contesto del test, non una verifica del nuovo runtime già deployato.

Ho ricalcolato dal dettaglio **9 casi completati, 123 check, 0 check falliti, 0 pageerror**. Il processo termina con codice 0. Nessuna richiesta di rete reale, nessun tentativo verso provider di routing, nessun POST o WebSocket. I **731 tentativi ordinari bloccati** restano distinti da una dichiarazione di assenza assoluta di tentativi di rete del runtime.

| Caso eseguito | Check | Riscontro pertinente |
|---|---:|---|
| Converti desktop, 1440 × 1000 | 20 | Nome accessibile uguale al titolo; apertura, scroll interno, minimize/restore, chiusura, riapertura ed Escape singolo. |
| Converti emulazione mobile, 390 × 844 | 20 | Stessi controlli mirati; comandi raggiungibili nel viewport. |
| Escape con Converti e Guida aperti | 4 | Il primo Escape chiude soltanto Guida; il secondo chiude Converti. |
| Escape dall'input di Converti | 4 | Valore incollato preservato; comportamento before/after identico al caso baseline acquisito. |
| Escape durante pick traccia | 5 | Prima uscita dal pick con Track aperto; successivo Escape chiude Track, verificando la delega rimasta operativa. |
| Dialog nome traccia nativo | 8 | Combinazione pick attivo + figlio aperto e cancel isolato verificati via UI; dettagli sotto. |
| Astro desktop, 1440 × 1000 | 14 | Geometria iniziale coincidente con la baseline; comandi, restore e riapertura corretti. |
| Astro emulazione mobile, 390 × 844 | 24 | Comandi raggiungibili; drag, clamp, resize, minimize/restore, chiusura e riapertura. |
| Astro emulazione mobile bassa, 390 × 600 | 24 | Medesimi controlli di geometria e lifecycle nel viewport più basso. |

I viewport mobili sono **emulazioni in Edge su Windows**, non prove su un telefono fisico. Il caso fuoriGIS non è stato forzato: l'evidenza lo dichiara non eseguito perché manca un ingresso utente supportato. Non viene esteso un PASS generale a tutti i dialog, a tutti i dispositivi o ad altri percorsi dell'applicazione.

## Verifica specifica della combinazione pick + figlio nativo

La combinazione evidenziata nella review preliminare è effettivamente coperta; non occorre richiedere un test aggiuntivo.

Il runner apre Track dal comando visibile, aggiunge due punti sintetici con clic sulla mappa e usa il CTA canonico `[data-role="track-save-current"]`. Prima di Escape sono osservati `trackPick=true`, Track aperto, dialog nome aperto e `:modal`, focus nell'input del figlio, zero tracce salvate.

**Dopo l'Escape combinato:** `trackPick=false`, Track e figlio restano aperti, il figlio resta modale e mantiene il focus. I due punti non cambiano e il numero di tracce salvate resta zero. L'evento risulta consumato dopo i listener applicativi: una sola azione contestuale viene eseguita.

Il runner chiude poi il figlio con il pulsante Annulla e lo riapre, sempre mediante il CTA, con pick già disattivato. **Dopo l'Escape isolato:** si chiude soltanto il figlio, Track resta aperto, i punti restano identici, non viene salvata alcuna traccia e il focus torna al CTA `track-save-current`.

Questa è la sequenza effettiva: **non sono due Escape consecutivi sul medesimo figlio senza azioni intermedie**. Il before/after del caso isolato è stato confrontato direttamente con `baseline-280/audit-results.json` sullo SHA `70553e52…ffde` ed è identico. Anche il before/after dell'input Converti coincide con il relativo caso completato nell'artefatto baseline conservato in `instrumentation-attempt1`.

La prova certifica l'azione Escape sul figlio nativo e l'isolamento della chiusura. Non viene dedotta l'emissione di un evento DOM `cancel` non registrato: le osservazioni disponibili attestano il consumo del keydown e lo stato dei dialog.

## Chiusura delle categorie rimaste in attesa

| Categoria della review | Esito conclusivo nello scope |
|---|---|
| Nome accessibile Converti | **PASS.** Il browser calcola “Convertitore — inserisci coordinate”, uguale al titolo, a desktop e 390 px, anche dopo restore/riapertura. |
| Escape, consumo e delega | **PASS.** Una chiusura alla volta con Guida/Converti; fallback Converti singolo e Track dopo pick ancora operativi. |
| Input, pick e figlio nativo | **PASS.** Input preservato e baseline coincidente; pick annullabile; combinazione reale e cancel isolato coperti senza perdita o salvataggio dei punti. |
| Minimize/restore e comandi | **PASS nei pannelli esercitati.** Percorsi UI reali per Converti e Astro; nessun setter di stato usato come prova di raggiungibilità. |
| Geometria Astro | **PASS nei tre viewport.** A 390 × 844: apertura `x=12, y=105, w=366, h=438`; drag a `y=153`, clamp a `y=105`, resize a `h=478`, dimensione conservata dopo restore e riapertura. A 390 × 600 i comandi restano raggiungibili e il ciclo è completato. Il desktop mantiene la geometria baseline. |
| Scope, i18n, integrità e categorie N/A | **Confermate dalla review statica.** Nessuna nuova modifica dopo il candidato esaminato. Rete/GPS, storage, sanitizer, create-path, routing e controller restano fuori dal delta e byte-identici. |

## Prove conservate e gate successivi

L'acquisizione selettiva, gli hash dei file sorgente, i totali ricalcolati, gli stati del figlio, le geometrie e i confronti baseline sono salvati in **`review-browser-acquisition.json`**. Le fonti restano `regression-summary.json`, `candidate-281/audit-results.json`, `candidate-281/execution-manifest.json` e il runner `regression-panels-edge-281.cjs`. Il rapporto preliminare e le sue prove di integrità restano intatti.

Finding di metodo contenuto: due proiezioni intermedie hanno superato il budget di output. L'acquisizione è stata ristretta a campi nominati, confronti esatti degli stati e ricalcolo dei totali; gli output troncati non sono stati trattati come evidenza completa. Non sono state avviate altre QA né rieseguite prove già concluse.

**Gate di review pre-pubblicazione superato.** Restano ai passaggi successivi la pubblicazione/checkpoint coerente, il deploy, l'identità del runtime servito, l'ABQA post-deploy e la QA umana residua richiesta dal metodo. Questo addendum non ne anticipa l'esito e non attribuisce attestazioni all'operatore.
