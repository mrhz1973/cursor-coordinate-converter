# REVIEW GPT-SOSTITUTIVA — Build 281

## Verdetto preliminare e stato

**Review statica completata: nessun blocker concreto individuato nel bundle esaminato. Il gate finale resta IN ATTESA della regressione browser sugli stessi byte.** Questo documento non dichiara un PASS comportamentale, una pubblicazione, un deploy o un esito post-deploy.

La review è svolta da un agente GPT interno diverso dall'esecutore della patch, nel percorso GPT già autorizzato nella sessione. È esplicitamente una **REVIEW GPT-SOSTITUTIVA**, non una review di un provider AI esterno. Il backstop esterno resta distinto, quando disponibile, secondo la Regola B già acquisita.

Data dell'ultima verifica indipendente di identità e integrità: **9 novembre 2026, 15:40 UTC**. Stato comunicato dal root e registrato in `candidate-identity.json`: commit locale immutabile, non pubblicato e non deployato. Il reviewer non ha effettuato commit, push, deploy, modifiche al runtime o prove browser/provider.

## Fonte immutabile

| Campo | Valore verificato |
|---|---|
| BLOCK-ID | `GIS-WINDOW-CONTROLS-A` |
| Profilo | `CLOSURE: STANDARD_RUNTIME_BUNDLE` |
| Fonte | raw Git `coordinate_converter Claude.html` al FULL_SHA sotto indicato |
| Commit candidato | `0c0f6785654dbba279774bb8569788088f0762e9` |
| Parent | `63d4fd7b3bbd2b02fe10d8e2180c58c31b9e11d0` |
| Blob runtime | `3dcff61081a2f461f8841953986ced17b058eab1` |
| SHA256 runtime | `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62` |
| Dimensione | 11.108.861 byte |
| Diff dell'intero commit | Un solo file; 8 aggiunte / 10 rimozioni |
| Worktree alla verifica | Pulita, HEAD coincidente con il candidato |
| Base runtime | Build 280, SHA256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |

Il sorgente è stato letto con `git show FULL_SHA:coordinate_converter Claude.html`; il diff completo è stato acquisito da Git fra parent e candidato. La lunga riga delle note di rilascio è stata isolata: il prefisso Build 281 è nuovo, il suffisso Build 280 e storico di 3.224 byte è identico. Il suo SHA256 è `09f2e9c648dc3f83be04b84c5dc8fb646a475c94f89cd2071baa6603631dd925`.

La ricostruzione indipendente delle dieci sostituzioni dichiarate in `implementation-integrity.json`, applicate una sola volta ciascuna ai byte raw della base, produce esattamente il raw del candidato. È quindi provata l'identità di tutti i byte esterni a queste regioni. Nessun BOM è stato introdotto; i 192 CR isolati e l'assenza di CRLF sono conservati.

## Scope e lettura del diff completo

Il TASK DELTA delimita tre difetti riprodotti sulla Build 280 dal browser agent: nome accessibile vuoto di Converti, doppia chiusura Converti/Guida con una pressione di Escape, controlli Astro coperti a 390 × 844. La presente review acquisisce tale motivazione dal task e dalle comunicazioni del root; non attribuisce al reviewer una nuova riproduzione browser.

### Converti: collegamento al titolo esistente

Il dialog riceve `aria-labelledby="convertModalTitle"` e il suo H2 già presente riceve l'ID corrispondente. L'ID è definito una sola volta. Testo, chiave `data-i18n="convert.title"`, struttura dei comandi, apertura, chiusura, focus e minimizzazione restano invariati. Il riferimento ARIA segue quindi lo stesso titolo tradotto dalla UI, senza creare una seconda etichetta divergente.

Il cambiamento è coerente con il difetto segnalato. Il nome effettivo nell'albero di accessibilità, a dimensione desktop e a 390 px, resta una verifica browser sul candidato.

### Astro: rimozione di tre sole forzature mobili

All'interno di `@media (max-width:600px)`, per il solo selettore `body.gis-mode dialog#astroPanel.astro-panel`, sono rimosse le tre righe che imponevano posizione all'origine, larghezza viewport e altezza a viewport, comprese le relative dichiarazioni max-width/max-height. Restano il `border-radius:0` e il gap delle righe sorgente. Nessuna regola desktop o CSS legacy condivisa è rimossa.

I helper esistenti restano responsabili della geometria: `gisPanelSafeTop` considera header/dock; `gisPanelApplyLayout` e il clamp scrivono left/top/width/height inline e gestiscono layout salvato, drag e ridimensionamento. Le opzioni Astro restano `pad:12`, `minW:360`, `minH:240`, `defaultW:480`, `defaultHeightFraction:0.52`, `defaultHeightCap:560`, `topbarReserve:104`, `bodyMinH:120`, `partialMinVisible:72`.

La rimozione permette a tali valori inline di prevalere sulle tre forzature mobili. La sola analisi statica non prova hit testing, visibilità dei comandi, assenza di interferenze del dock o ripristino del rettangolo: questi sono i casi browser pertinenti. Il giudizio non viene esteso a ogni dimensione di telefono possibile.

### Escape: consumo dell'evento e delega

Le chiamate di inizializzazione registrano `bindHotkeys` prima di `gisInit`; entrambi i listener documentali operano in bubble. Ordine, fase di ascolto e rami specifici non sono modificati.

Le tre modifiche JS sono coerenti fra loro:

1. Il ramo Escape di `bindHotkeys` ritorna quando `ev.defaultPrevented` è già vero, rispettando un gestore precedente che abbia consumato l'evento.
2. Il listener Escape aggiuntivo di `gisInit` applica la stessa guardia subito dopo il filtro della chiave.
3. Il semplice ritorno di delega quando il documento è in GIS non esegue più `preventDefault()`. Un Escape ancora privo di azione deve poter raggiungere il fallback GIS.

Nel percorso del difetto, la chiusura di Guida da parte del primo listener continua a consumare l'evento; il secondo listener può ora riconoscerlo e non chiudere anche Converti. Quando il primo listener non svolge un'azione GIS, la rimozione del preventDefault finale evita che la nuova guardia renda irraggiungibile il secondo. Non sono aggiunti `stopPropagation`, `stopImmediatePropagation`, nuovi listener o binder globali.

Le priorità esistenti di brush, draft, disegno poligono, pick, menu, Strumenti, QR e Guida sono preservate nel testo. In particolare, il ramo `isTypingInField()` continua a eseguire blur e ritorno senza preventDefault: la patch non introduce una nuova regola secondo cui il primo Escape debba sempre limitarsi al blur.

Il listener GIS conserva le chiusure per ID dei figli nativi prima dei genitori e i guard di minimizzazione già esistenti. Il `cancel` nativo del dialog nome traccia continua a prevenire il comportamento predefinito e a chiudere soltanto quel dialog; il suo input gestisce localmente Enter, non Escape. Questi rami sono byte-identici, ma il coordinamento globale di Escape cambia: la regressione browser è necessaria per valutarne l'effetto effettivo.

**Punto di copertura comunicato al browser agent:** il CTA reale `[data-role="track-save-current"]` può aprire il dialog nome anche con pick ancora attivo. Uscire dal pick tramite il comando UI `#miniMap [data-role="track-float-close"]` prima di Salva isola correttamente il cancel nativo, ma non copre automaticamente la combinazione pick attivo + figlio aperto. In tale combinazione, il primo listener può consumare Escape uscendo dal pick e il nuovo guard impedisce al secondo di eseguire anche la chiusura. Va valutato come comportamento di priorità nel test mirato, senza dedurre un FAIL o un PASS dal solo sorgente. Il pulsante `#btnTrackSaveLibrary` è legacy hidden/disabled e non è un percorso utente valido per questa prova.

## Checklist per categoria

Il metodo pertinente è OM §4, Regole DELTA, B, G, D2bis e D2 già acquisite al parent `63d4fd7b3bbd2b02fe10d8e2180c58c31b9e11d0`; il gate preparatorio è conservato in `qa-gis-windows-audit-280/lifecycle/REVIEW-GATE.md`. Nessun nuovo CORE BOOT, audit generale o rilettura di H/F3 è stato eseguito in questa review.

| Categoria | Check effettivo / N/A motivato |
|---|---|
| Scope del bundle delicato | **CHECK STATICO.** Tre correzioni correlate ai finding, più etichetta Build e prefisso note. Nessuna pulizia aggiunta. Tutto il diff del commit è esaminato. |
| Apertura GIS/fuoriGIS e `aria-modal` | **CHECK DI INTEGRITÀ.** Nessun opener o attributo `aria-modal` modificato. Non si convertono i 19 showModal secondari. FuoriGIS non è presentato come un percorso utente normalmente raggiungibile della release. |
| Nome accessibile e i18n Converti | **CHECK STATICO; BROWSER PENDING.** Ref e ID univoci sul titolo esistente, stessa chiave tradotta. Nessuna nuova chiave o traduzione EN/FR. |
| Close per ID e markup dei comandi | **CHECK DI INTEGRITÀ.** Close specifici, `.app-modal-close`, type button e glifo esistenti invariati. Nessun SVG, formmethod o binder globale aggiunto. |
| Escape, focus, genitori/figli e cancel | **CHECK STATICO; BROWSER PENDING.** Ordine di registrazione e rami letti; consumo e delega sono coerenti. Input, pick/disegno e cancel richiedono la matrice mirata, non un PASS inferito da identità testuale. |
| Minimize/restore, geometria, scroll e inert | **CHECK STATICO; BROWSER PENDING.** Helper di lifecycle invariati; rimosse soltanto le tre forzature Astro mobili. Attesi controlli su raggiungibilità comandi, ripristino, drag/reopen/resize e interazione coi pannelli pertinenti. |
| Dialog vertice e altri opener | **N/A alla modifica diretta.** Nessun percorso del vertice o altro opener è modificato. Nessuna nuova conversione dei dialog o copertura browser generale viene dichiarata. L'effetto del coordinamento Escape è trattato nei casi pertinenti sopra. |
| Sanitizer e whitelist persistenti | **N/A.** Byte-identici fuori dalle dieci regioni; nessun tipo ammesso o controllo allentato. |
| Storage, cache e campi persistiti | **N/A.** Nessun campo/chiave/schema o migrazione introdotto. I helper di layout restano identici; nessuna lettura di dati reali dell'utente. |
| Create-path e salvataggio dati | **N/A.** Percorsi di creazione/salvataggio byte-identici. Il caso del dialog nome verifica il cancel, non costituisce una nuova suite di persistenza. |
| Rete, endpoint, proxy, OPSEC, offline e consensi | **CHECK DI INTEGRITÀ.** Nessuna destinazione, chiamata, gate o consenso modificato. Il pacchetto non aggiunge accessi di rete né amplia l'infrastruttura autorizzata. |
| GPS e rete implicita | **CHECK STATICO.** Nessun trigger di geolocalizzazione, tracking, fetch, XHR, WebSocket o beacon introdotto. |
| Controller, timeout e risultati stantii | **N/A.** Byte-identici; le prove routing precedenti restano riferite alla loro release, non vengono rieseguite o riattribuite a questo bundle. |
| No-ferry, metadati, snap, anchor, errori provider | **N/A.** Nessuna modifica a tali percorsi o validator. |
| I18n freeze e note | **CHECK STATICO.** Stessa chiave Converti; sole note e descrizione Build in italiano. Storico delle note preservato. |
| Standalone e integrità del resto | **CHECK VERIFICATO.** Un solo HTML, nessuna dipendenza o split runtime, dieci regioni ricostruite e resto byte-identico. |
| Sintassi JS | **PASS ACQUISITO 2/2.** `syntax.json` registra il controllo Node v24.22.1. Il reviewer ha confrontato byte/hash dei due script JS con il raw candidato; non ha ripetuto il test. I due blocchi application/json incorporati non sono script eseguibili. |

## Gate residuo e limiti

La review finale deve acquisire l'esito browser sull'esatto SHA256 `e8bd8c1d…ca62`: nome accessibile, chiusura singola/delega Escape, input, pick/disegno pertinente, cancel del figlio nativo, minimize/restore e geometria Astro nei casi delimitati dal task. Ogni FAIL, BLOCKED o caso incompleto resta esplicito; la baseline diagnostica non certifica il fix.

Al momento di questo rapporto non è stato acquisito un risultato browser finale del candidato. Non si emette quindi un GO di pubblicazione/deploy. Verifica del runtime pubblicato, ABQA post-deploy e QA umana residua appartengono ai passaggi successivi gestiti dal root. Nessun esito viene anticipato.

## Prove e precisione documentale

- `candidate-identity.json`: identità e stato locale dopo il commit.
- `implementation-integrity.json`: ledger originario delle dieci regioni; il suo stato “non committato” è storico, precedente alla creazione del candidato immutabile, non lo stato corrente.
- `review-source-verification.json`: ricostruzione indipendente, identità raw, worktree, equivalenza hunks e corrispondenza degli script alla prova sintattica.
- `review-raw-git.diff`: diff completo dal raw Git, SHA256 `86e08d63facc8015b76162b8bb73ca097a2fae30ca95f59d67757ba81f797e02`.
- `runtime-281.diff`: diff preparatorio originale, SHA256 `65b0035b5d08f4f945bbc79c0add398abb4993c15fbbbad3eb3f900083fe5124`.
- `syntax.json`: prova sintattica acquisita, legata al candidato esatto.
- `TASK-DELTA.md`: scope, acceptance e override esecutivo già autorizzato.

Il diff preparatorio non è byte-identico all'output Git: omette intestazioni Git/contesto funzione e conta i CR isolati come separatori di riga. I corpi di tutti gli hunks, inclusi contesti e modifiche, risultano identici eliminando soltanto questi metadati. Per riferimenti di riga canonici usare il raw Git e `review-raw-git.diff`, con separatore LF. È una precisazione delle prove, non un difetto del runtime.
