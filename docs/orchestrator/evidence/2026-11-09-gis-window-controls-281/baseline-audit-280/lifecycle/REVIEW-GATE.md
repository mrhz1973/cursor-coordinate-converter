# Gate predisposto — eventuale correzione lifecycle finestre

## Stato

**Passaggio all’implementazione circoscritta consentito nel percorso GPT già autorizzato; gate di review runtime ancora da eseguire.** Il root riferisce la riproduzione browser dei tre difetti: nome accessibile di Converti vuoto, doppia chiusura Escape di Converti/Guida, controlli Astro coperti a 390 px. Questi riscontri delimitano il TASK DELTA; screenshot e risultati originali saranno acquisiti insieme al diff. Non esiste ancora un nuovo candidato immutabile da approvare. La scelta del metodo non equivale a PASS tecnico o autorizzazione tecnica preventiva del futuro diff.

Fonte metodo: raw Git `docs/OPERATING_MEMORY.md` al checkpoint `63d4fd7b3bbd2b02fe10d8e2180c58c31b9e11d0`. Regola B, Regola G e checklist già acquisite sono risultate byte-identiche al checkpoint precedente `365a3172ea4878b38be446aefdcf6edcb5735f27`. Letti soltanto i passaggi pertinenti DELTA, D2bis e D2; AI-BOOT, Regola H e F3 non riletti. Fonte runtime dell’audit: `c33f58c956e9630b03f9ff86eb35eccd35879a4a`, SHA256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`.

## Regole pertinenti

| Regola canonica OM §4 | Applicazione al possibile intervento |
|---|---|
| **DELTA — CURSOR-PROMPT-DELTA** | Formalizzare soltanto il TASK DELTA: BLOCK-ID effettivo, categoria, base/candidato necessari, problema riprodotto, scope, invarianti, acceptance, stop e profilo `CLOSURE: STANDARD_RUNTIME_BUNDLE`. Non ricopiare metodo, deploy o coda di chiusura. Il percorso esecutivo GPT è quello già autorizzato nella sessione; non viene riqualificato come esecuzione o review di un altro provider. |
| **B — Review tiered** | Una correzione del lifecycle delle finestre è **DELICATO**, anche se piccola. Gate sull’intero bundle. In assenza del reviewer esterno, è ammessa **REVIEW GPT-SOSTITUTIVA**, esplicita e loggata, dal raw del FULL_SHA candidato; review esterna post-hoc resta backstop quando disponibile. L’agente GPT interno può riesaminare indipendentemente il diff, ma non è il reviewer AI esterno. |
| **B — Checklist lifecycle** | Per ogni dialog effettivamente toccato: apertura context-aware show GIS/showModal fuoriGIS dove quel contesto esiste; aria-modal coerente; close per dialog con ID specifici e nessun binder globale querySelectorAll; pulsante close `.app-modal-close` esistente, type button, glifo CSS, nessun SVG/formmethod; nessuna rimozione di CSS legacy condivisa; verifiche pertinenti di mappa/pannelli, inert, close/minimize/restore e dialog vertice. FuoriGIS non normalmente raggiungibile nella Build280 va dichiarato come limite, non forzato e poi presentato come percorso utente. |
| **G — Bundling** | Tenere lifecycle nel bundle delicato coerente; non accodare pulizia cosmetica/routine non correlata. Nessun obbligo di inventare altri item per raggiungere la dimensione consigliata del bundle. |
| **D2bis — Automated Browser QA pre-operatore** | La matrice attuale è diagnostica sul candidato invariato, non certifica il futuro fix. Il nuovo candidato richiede riproduzione/regressione scoped; dopo deploy tecnico PASS occorre ABQA sul runtime pubblicato prima della QA umana. FAIL/BLOCKED/INCOMPLETE non diventano PASS. Evidenza: runtime/URL, metodo, casi e risultati, errori pertinenti, screenshot quando utili e stato del gate; dati isolati e nessuna cancellazione operativa per QA. |
| **D2 — QA umana corta e mirata** | Solo dopo ABQA post-deploy PASS: QA umana residua preparata da ChatGPT, con etichette reali in italiano, senza ripetere i controlli tecnici già coperti. L’AI non attribuisce un PASS operatore. |

## Condizioni del futuro gate di review

1. Finding browser riprodotto e delimitato; scope coerente con la correzione necessaria. La proposta Escape resta una candidata fino al riscontro: non autorizza una conversione globale dei 19 showModal né modifiche ai rami nonGIS non raggiungibili.
2. Nuovo candidato immutabile identificato da FULL_SHA, blob e SHA256, con diff completo rispetto alla base. Riesaminare il diff effettivo dell’intero bundle, incluse eventuali chiamate globali e interazioni tra genitori/figli, non soltanto il sintomo iniziale.
3. Checklist per-categoria compilata con check effettivi oppure N/A motivato. I percorsi non modificati possono essere esclusi con prova di integrità; non inventare nuove migrazioni o regressioni rete/storage estranee allo scope. Conservare i guard di dati, OPSEC, consensi e GPS esistenti.
4. Regressioni necessarie sulle semantiche effettivamente alterate: un evento gestito una sola volta, fallback Escape ancora operativo, priorità di input/pick/disegno, cancel nativo e genitori, minimize/restore. Il numero dei casi dipende dal diff e dal difetto osservato; nessun PASS comportamentale deriva dal solo audit statico.
5. Esito loggato come REVIEW GPT-SOSTITUTIVA, con blocker espliciti e limiti. I PASS della precedente release routing rimangono riferiti a quella release e non sostituiscono il gate del nuovo bundle.

Questa preparazione non modifica il monolite, non avvia nuove QA e non emette un’autorizzazione tecnica preventiva per un diff ancora assente.
