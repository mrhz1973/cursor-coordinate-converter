# Build 281 — correzioni circoscritte alle finestre GIS

Data delle prove: **9 novembre 2026**. Blocco: `GIS-WINDOW-CONTROLS-A`. Profilo: `STANDARD_RUNTIME_BUNDLE`.

## Stato di questo checkpoint

Il candidato corregge tre difetti riprodotti nell'audit delle finestre. La regressione mirata sul candidato e la **REVIEW GPT-SOSTITUTIVA conclusiva sono PASS**. Questo documento precede il deploy: la Build 280 resta il runtime live fino a una prova di distribuzione successiva. Nessun PASS della Build 281 viene attribuito alla conferma operatore della release precedente.

| Identità | Valore |
| --- | --- |
| Runtime sorgente | `0c0f6785654dbba279774bb8569788088f0762e9` |
| Blob | `3dcff61081a2f461f8841953986ced17b058eab1` |
| SHA-256 | `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62` |
| Dimensione | 11.108.861 byte |
| Base documentale | `63d4fd7b3bbd2b02fe10d8e2180c58c31b9e11d0` |
| Baseline runtime | Build 280, SHA-256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |

Il commit sorgente del runtime è un riferimento immutabile, distinto dalla HEAD documentale del checkpoint. Il candidato è stato controllato sul byte esatto; le prove browser qui descritte usano **HTML candidato iniettato**, non attestano la pagina distribuita dal server. Il deploy e l'ABQA sulla vera risposta HTTPS richiedono evidenze separate.

## Dall'audit alla correzione

L'inventario statico comprende 38 dialoghi: 37 basati su `.app-modal` e il pannello Strumenti. La struttura comune esiste già; le differenze dei dialoghi brevi, di conferma o intenzionalmente modali non giustificano una riscrittura generale. Sono stati selezionati tre difetti riprodotti attraverso gli opener reali dell'interfaccia.

| Difetto sulla Build 280 | Evidenza osservata | Delta della Build 281 |
| --- | --- | --- |
| Converti privo di nome accessibile | Albero di accessibilità: `role=dialog`, nome vuoto, `ignored=false`, su desktop e 390×844 | Il dialogo fa riferimento all'`h2` esistente mediante `aria-labelledby`; titolo e chiave di traduzione restano gli stessi |
| Un Escape chiude sia Guida sia Converti | Apertura Converti → Impostazioni → Guida; focus sul pulsante Minimizza della Guida; entrambe le finestre si chiudono con un tasto | I due listener rispettano l'evento già consumato. La delega GIS lascia procedere il secondo listener quando il primo non esegue un'azione |
| Comandi Astro coperti su viewport stretto | A 390×844, pannello `(0,0,374,720)`; i centri di × e − sono intercettati rispettivamente da `.hdr-group.hdr-iconbar` e `.net-label` | Rimosse le sole tre righe CSS che forzavano la geometria mobile; il percorso JavaScript esistente controlla posizione e dimensione |

Fonti: [inventario statico](baseline-audit-280/static-inventory/STATIC-WINDOWS-AUDIT-280.md), [lifecycle](baseline-audit-280/lifecycle/LIFECYCLE-AUDIT.md), [audit browser osservato](baseline-audit-280/browser/edge-attempt/AUDIT-OBSERVED-280.md).

La baseline browser principale è stata eseguita dalle 15:16:16 alle 15:16:36 UTC (16:16:16–16:16:36 Europe/Rome): sette casi diagnostici completati, tre difetti riprodotti, nessuna eccezione JavaScript. Il dettaglio del focus Escape è stato raccolto separatamente. Strumenti, Guida e Misura non hanno mostrato anomalie nei controlli mirati; questo non equivale a un PASS generale delle 38 finestre.

## Perimetro e integrità

Il diff runtime contiene 8 aggiunte e 10 rimozioni. Dieci sostituzioni controllate comprendono i tre fix, i metadati della build e la nuova nota di rilascio. La ricostruzione indipendente dalle sostituzioni dichiarate produce esattamente il blob candidato; gli altri byte sono invariati. I 192 caratteri CR isolati, l'assenza di CRLF e l'assenza di BOM sono preservati.

La sintassi dei due script JavaScript inline è PASS. Il runtime conserva il singolo HTML standalone e i componenti routing, rete, OPSEC, GPS e modello dati non modificati. Le prove routing precedenti sono evidenza acquisita sui componenti invariati; non sono presentate come nuove esecuzioni sulla Build 281.

Fonti: [implementazione](IMPLEMENTATION-281.md), [integrità](implementation-integrity.json), [sintassi](syntax.json), [verifica indipendente](review-source-verification.json), [diff Git canonico](review-raw-git.diff). Il diff preparatorio `runtime-281.diff` è conservato, ma il riferimento canonico per intestazioni e hunks è quello prodotto dal Git object immutabile.

## Regressione del candidato

Ambiente osservato: **Microsoft Edge 157.0.4341.42, Windows, Node 26.8.1, Playwright 1.62.1**. Nuove sessioni isolate; nessun profilo reale dell'utente aperto. Le viste mobili sono emulazione Chromium, non Safari o iPhone fisico.

Esecuzione: **15:41:39.090–15:42:02.766 UTC**, pari a 16:41:39.090–16:42:02.766 Europe/Rome. **9/9 casi, 123 controlli, 0 fallimenti e 0 eccezioni JavaScript.** SHA del runtime identico prima e dopo. Le richieste applicative sono intercettate; 0 tentativi POST e 0 richieste ai provider di routing. I messaggi delle risorse intenzionalmente bloccate non sono conteggiati come eccezioni JavaScript.

| Caso | Esito mirato |
| --- | --- |
| Converti desktop | Nome accessibile corretto, scroll interno, close, reopen, minimize/restore, singolo Escape |
| Converti 390×844 | Stessi controlli mirati PASS nella vista emulata |
| Converti + Guida | Primo Escape chiude Guida lasciando Converti; secondo Escape chiude Converti |
| Input Converti | Chiusura e focus coerenti con baseline; testo conservato |
| Pick Traccia | Primo Escape esce dal pick e mantiene il pannello; secondo Escape chiude il pannello |
| Nome traccia, dialogo nativo figlio | Verificati sia pick attivo con figlio aperto sia cancel isolato senza pick; punti e salvataggi preservati |
| Astro desktop | Riferimento layout e lifecycle PASS |
| Astro 390×844 | Header e controlli raggiungibili, drag/clamp, resize verticale, minimize/restore e riapertura PASS |
| Astro 390×600 | Stesse verifiche mirate PASS nella vista più corta |

Nel caso del figlio nativo, dopo il primo Escape con pick attivo il runner usa Annulla e riapre il figlio senza pick prima di provare il cancel isolato. Non si tratta di due Escape consecutivi sul medesimo figlio senza azioni intermedie.

Astro a 390×844 si apre ora a `(12,105,366,438)`: il limite superiore rimane sotto la barra. Il trascinamento porta il pannello a y=153 e il limite superiore lo riporta a y=105; l'altezza scelta di 478 px rimane alla riapertura. Nella vista 390×600, l'altezza passa da 312 a 352 px e viene conservata. Si tratta di misure dei viewport provati, non di una certificazione su ogni dispositivo.

Fonti: [riepilogo strutturato](regression-summary.json), [risultati completi](candidate-281/audit-results.json), [manifest di esecuzione](candidate-281/execution-manifest.json), [runner](regression-panels-edge-281.cjs). Le prove della baseline aggiuntiva e i tentativi iniziali con errori del harness restano separati in `baseline-280/` e `instrumentation-attempt1/`.


### Controllo supplementare dell’azione primaria Astro

La revisione visiva della vista 390×600 ha richiesto una verifica circoscritta dello scroll fino a «Calcola». Esecuzione separata il 9 novembre 2026, 15:52:55.802–15:52:58.633 UTC: **1 caso e 11 assert PASS**, senza ripetere la matrice. La rotella nel corpo porta scrollTop da 0 a 123; pagina e header rimangono fermi. Il pulsante abilitato viene raggiunto con un clic normale e produce localmente la tabella Sole/Luna UTC/LMT. Nessuna eccezione JavaScript o richiesta reale di rete. È una prova di utilizzabilità dell’azione, non una nuova validazione dell’accuratezza astronomica.

Le due esecuzioni coprono quindi **9 + 1 casi e 123 + 11 controlli**, sul medesimo SHA. Evidenze: [supplemento scroll](short-scroll-281/evidence-manifest.json) e [schermata del pulsante raggiungibile](short-scroll-281/short-astro-internal-scroll-primary-visible.png).

## Review e gate successivi

La [review preliminare](REVIEW-GPT-SOSTITUTIVA.md) e l'[addendum conclusivo PASS](REVIEW-GPT-SOSTITUTIVA-ADDENDUM-FINALE.md) riguardano l'intero bundle delicato e distinguono analisi statica, prove comportamentali e stato di pubblicazione. Il reviewer è un agente GPT interno distinto dall'autore del runtime. La review AI esterna non è stata eseguita e rimane un backstop post-hoc sul percorso sostitutivo già autorizzato.

La [review statica del dossier deploy](deploy/DEPLOY-REVIEW.md) è PASS sui due script congelati; non equivale a una verifica del server o a un deploy eseguito. Prima dell'applicazione occorrono la pubblicazione verificata del candidato e della FRONTIER coerente e il preflight fresco sulla HEAD esplicita del GO. Dopo il deploy tecnico PASS, l'ABQA deve caricare la vera risposta HTTPS, verificarne SHA e dimensione ed eseguire i tre controlli principali. Solo allora può essere richiesto il breve riscontro operatore residuo su dispositivo fisico.

## Limiti e seguito dell'audit

Non è stata esercitata una modalità non GIS ottenuta forzando classi o stato: l'avvio corrente impone GIS e non è stato trovato un percorso utente supportato per uscirne. Le 19 aperture `showModal()` secondarie non sono state convertite; conferme, picker e dialoghi figli possono richiedere intenzionalmente modalità nativa.

I rilievi statici sui pannelli Preferiti/D-Flight minimizzati e sulle priorità fisse di Escape restano candidati per un pass successivo, senza attribuzione di FAIL browser o dichiarazione di correzione in questo bundle. Il test su Safari/iPhone fisico resta distinto dall'emulazione Chromium.

I precedenti impedimenti del setup browser cloud e del primo collegamento Windows sono conservati come tentativi bloccati. La prova riuscita è quella del collegamento alternativo ASUSDESKTOP; nessun fallimento di setup è stato trasformato in PASS. Un output locale eccessivo del riepilogo QA è registrato come [finding di payload](method-payload-finding.json), seguito da proiezioni limitate dei campi necessari. La successiva [verifica documentale](publication-method-findings.json) distingue il controllo dei file redatti dai byte immutabili delle evidenze Windows; la scansione aggregata fallita non viene dichiarata PASS.

La conferma operatore «Okay, i tre casi sono perfetti, andiamo avanti.» chiude il precedente blocco routing secondo la [registrazione dedicata](../2026-11-09-routing-280-operator-closure/REPORT.md). La chiusura e il suo autosync sono stati verificati su GitHub; non sono riutilizzati come attestazione umana della Build 281.
