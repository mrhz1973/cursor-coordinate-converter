# TASK DELTA — GIS-WINDOW-CONTROLS-A

Data: 2026-11-09. CLOSURE: STANDARD_RUNTIME_BUNDLE.

Base documentale: `63d4fd7b3bbd2b02fe10d8e2180c58c31b9e11d0`.
Runtime di partenza: Build 280, commit `c33f58c956e9630b03f9ff86eb35eccd35879a4a`, SHA-256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`.
Worktree candidata: `/workspace/scratch/bcbe375c6817/gis-windows-281`.

## Obiettivo e scope

Correggere tre difetti riprodotti nell'audit `GIS-WINDOW-UNIFORMITY-AUDIT-A` sulla Build 280: nome accessibile vuoto di Converti; due finestre chiuse con un solo Escape quando Guida e Converti sono aperti; controlli Astro coperti su viewport 390×844. Un solo bundle delicato, solo il runtime `coordinate_converter Claude.html` e le note/versione necessarie.

## Acceptance specifica

- Converti conserva il titolo tradotto esistente e lo espone come nome accessibile del dialogo, su desktop e viewport stretto.
- Un Escape produce una sola azione contestuale; un secondo Escape può chiudere la finestra rimasta. Conservare la delega GIS quando il primo listener non gestisce l'evento, il comportamento degli input, i percorsi pick/disegno, il cancel dei dialoghi nativi e il recupero delle finestre minimizzate.
- Astro usa la geometria già calcolata dal percorso JavaScript, con header e controlli accessibili nell'area utile. Verificare apertura, chiusura, minimize/restore, trascinamento/riapertura e ridimensionamento pertinente. Conservare il CSS condiviso e il layout desktop.
- Il diff deve dimostrare l'integrità dei componenti non coinvolti; niente nuovi provider, richieste di rete, dipendenze runtime o modifica del modello dati.

## Stop

Fermare la pubblicazione/deploy su regressione irrisolta, mismatch del byte testato, drift di origin/main, review fallita o necessità di ampliare lo scope. Una prova bloccata o non eseguita resta tale. Gli esiti diagnostici della baseline non sono PASS del candidato.

## Override specifico

Per il passaggio da Codex a GPT già autorizzato dall'operatore, l'esecuzione avviene con GPT e strumenti disponibili; Codex e Cursor non sono invocati. Si applica il percorso REVIEW GPT-SOSTITUTIVA loggato sul candidato completo; il backstop esterno resta distinto. Le regole stabili di review, QA, deploy e F3 restano nel repository e non sono ricopiate in questo delta.
