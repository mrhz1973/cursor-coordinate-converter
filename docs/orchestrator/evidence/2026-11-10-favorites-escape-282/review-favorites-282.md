# REVIEW GPT-SOSTITUTIVA downstream — Build 282

**Codice: PASS. QA candidata desktop: PASS, 3 casi e 44/44 controlli. Verdetto downstream complessivo: PENDING_METADATA_VERIFICATION.**

Il solo finding ancora aperto riguarda un valore di integrità nel manifest degli artefatti. La correzione attesa è determinata; la sua pubblicazione non è ancora stata verificata da questa review.

## Identità e perimetro

- Blocco: `GIS-FAVORITES-MINIMIZED-ESCAPE-A`, categoria **DELICATO — lifecycle modale/dialog**.
- [Commit candidato immutabile](https://github.com/mrhz1973/cursor-coordinate-converter/commit/6b906869b77a2b3c91c8848012894ffff85399e3): `6b906869b77a2b3c91c8848012894ffff85399e3`.
- Parent verificato: `b7ba9e1af0da4e3a4bbf6790790d39dec20041d4`.
- Blob runtime: `4636ad186934b0d2f43e8564c9e657cdcdfc652e`.
- SHA-256 runtime: `71267f1a9d95488adf527db40333c811c2beeef0c9051e98ee5673debb5a7399`; **11.108.980 byte**.
- Lettura indipendente mediante `git show FULL_SHA:path` dal clone verificato del PC del lavoro. Nessun monolite stampato e nessuna operazione di modifica del repository da parte del reviewer.

Il diff comprende otto file: monolite, FRONTIER e sei artefatti del dossier. Il runtime contiene esattamente **una sostituzione funzionale e tre metadati di build**. L'applicazione delle quattro sostituzioni al parent ricostruisce il candidato byte per byte; la loro inversione ricostruisce il parent. I **192 CR isolati** sono preservati.

## Valutazione della modifica funzionale

Il ramo Escape di Preferiti ora esclude il pannello minimizzato dalla propria condizione. In quel caso il listener continua verso i pannelli successivi, senza eseguire la chiusura di Preferiti e senza consumare l'evento in quel ramo.

Il corpo di chiusura del pannello visibile rimane identico. Il helper `gisPanelIsMinimized` esiste e legge soltanto la classe canonica del dialog. Il controllo `typeof` mantiene il comportamento precedente se l'helper non è disponibile. Non sono modificate le altre priorità Escape.

Il listener conserva il controllo iniziale di `ev.defaultPrevented`. Il percorso anticipato per la conferma/rinomina Preferiti, incluso il ripristino del valore precedente, rimane prima della condizione modificata.

## Checklist B/G

| Punto | Esito e base della verifica |
| --- | --- |
| Apertura context-aware di Preferiti | PASS: opener GIS e uso di show/aria-modal invariati; candidato osservato come dialog non modale. |
| Chiusura mirata per ID | PASS: closeFavoritesPanel invariato; nessun nuovo binder globale o querySelectorAll di chiusura. |
| Pulsanti − e × | PASS: markup, type=button, glifi e classi preservati; riduzione, ripristino e × verificati nel browser candidato. |
| CSS condivisa | PASS: nessuna modifica alla CSS; identità dei byte esterni alle quattro sostituzioni. |
| Conferme e rinomina | PASS statico di preservazione del ramo anticipato; nessuna nuova prova distruttiva o modifica dei dati utente. |
| GIS interattivo e assenza di inert | PASS candidato: percorso della mappa senza inert e wheel reale su un punto libero con variazione della scala. |
| Ciclo di vita | PASS candidato: minimizzazione, Escape, restore, ×, riapertura e secondo ciclo completo. |
| Fuori GIS/backdrop legacy | N/A: non raggiungibile attraverso la UI ordinaria secondo l'audit canonico; nessuna forzatura dello stato per simulare una prova operativa. |

## QA candidata verificata

Esecuzione **10 novembre 2026, 12:40:31.746–12:40:41.048 Europe/Rome**; Edge 157.0.4341.42, Node.js 24.16.0, viewport 1440 × 1000.

**Fonte: candidate_injected_document.** I tre documenti caricati dal runner contengono il byte candidato, con dimensione e SHA-256 verificati prima delle azioni. Questa è QA candidata, non ABQA della pagina live.

| Caso | Esito |
| --- | --- |
| Preferiti minimizzato, Escape, restore/×/riapertura e secondo ciclo | 22/22 PASS |
| Preferiti minimizzato con Mappe Offline/layersPanel visibile, Escape | 11/11 PASS |
| Preferiti visibile, dialog non modale, mappa interattiva, Escape | 11/11 PASS |

La wheel reale cambia la scala da **1:196k a 1:393k**, mentre Preferiti resta visibile. Escape successivo chiude il pannello. Nei tre casi: **0 tentativi POST e 0 pageerror catturati**, richieste accessorie bloccate dal test, cleanup del browser concluso.

- Risultato: `desktop-favorites-candidate-282-v2.json`, **16.151 byte**, SHA-256 `a01e79ed45ed197f00da438e4300803b537367e20937ed88dcee7fd1aae88dd5`.
- Runner: `desktop-favorites-regression-v2.cjs`, **19.247 byte**, SHA-256 `5f625374f8b88cfc7117d3a3f4a2fd3579d6c17aefcac019c7159aa66ae2bbc5`.

Il primo tentativo resta **INCOMPLETE**, con 18 controlli precedenti al blocco superati e un errore Puppeteer di elemento del dock staccato. Il delta del runner v2 è stato letto indipendentemente: i due click del chip usano Locator con riacquisizione e attese di interagibilità; cambiano inoltre soli metadati diagnostici e lunghezza dello stack. Nessun controllo eliminato o attenuato. Il tentativo incompleto non è convertito in un PASS.

## Finding F01 — manifest degli artefatti

Nel [manifest del commit candidato](https://github.com/mrhz1973/cursor-coordinate-converter/blob/6b906869b77a2b3c91c8848012894ffff85399e3/docs/orchestrator/evidence/2026-11-10-favorites-escape-282/evidence-manifest.json), tre artefatti su quattro corrispondono esattamente ai blob Git. La sola entry di `patch-manifest.json` descrive invece la rappresentazione CRLF del file di lavoro:

| Campo | Dichiarazione nel candidato | Blob Git pubblicato verificato |
| --- | --- | --- |
| Byte | 1.938 | **1.886** |
| SHA-256 | `47e9af1b6a0eaece01349aefe95fc2d981eaa120794990f4075795acb030a393` | **`d90d47ed8915466746060f701d9c7ffcbd9f38c25778e64fada84cf9f51412fd`** |

La ricostruzione CRLF del blob Git riproduce esattamente i valori dichiarati: causa confermata, non ipotizzata. Il runtime e il contenuto logico del manifest patch non sono alterati da questa incongruenza.

**Risoluzione attesa:** aggiornare l'entry documentale ai byte del blob pubblicato, senza amend del candidato e senza nuova modifica runtime. Il dato CRLF può restare soltanto come storico esplicitamente etichettato. La verifica del nuovo commit docs è ancora pendente.

## Limiti e gate successivi

- Review eseguita come **REVIEW GPT-SOSTITUTIVA**; backstop AI esterna **NOT_PERFORMED**.
- Nessuna prova live della Build 282, nessun deploy e nessun PASS operatore 282 attestati da questa review.
- Lo sviluppo e le prove specifiche per telefono restano in pausa per direttiva dell'utente.
- D-Flight e le altre priorità Escape non sono dichiarati corretti; nessun PASS generale delle 38 finestre.
- Il verdetto downstream complessivo potrà diventare PASS dopo verifica del manifest corretto pubblicato, mantenendo il runtime identico. Non occorre ripetere i test già validati per una correzione esclusivamente documentale di quel valore.
