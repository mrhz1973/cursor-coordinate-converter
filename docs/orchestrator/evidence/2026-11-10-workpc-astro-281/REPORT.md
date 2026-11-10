# Astro Build 281 — prova nativa dal PC del lavoro

## Stato ed evidenza corrente

**PASS limitato: 11 controlli su 11, solo Astro desktop. Il gate operatore su telefono resta aperto.**

Prova del **10 novembre 2026, 10:52:48–10:52:56 Europe/Rome** (09:52:48–09:52:56 UTC), eseguita tramite il Remote Desktop Commander originale sul PC del lavoro DESKTOP-DPIJL64. Browser Edge 157.0.4341.42, Node.js 24.16.0, viewport 1440 × 1000, contesto nuovo e isolato, modalità headless.

L'operatore ha richiesto il connettore originale del lavoro e successivamente: «Okay, facciamo delle prove per vedere se tutto funziona. Andiamo avanti.» È autorizzazione a eseguire prove, non attestazione della QA su telefono.

## Identità del documento provato

- Documento HTTPS nativo: `https://ionos-n8n-new.tailc01234.ts.net/gis?v=e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62`.
- HTTP 200; una navigazione principale ammessa.
- Build 281; source commit `0c0f6785654dbba279774bb8569788088f0762e9`; blob `3dcff61081a2f461f8841953986ced17b058eab1`.
- Corpo della stessa risposta browser: **11.108.861 byte**.
- SHA-256: `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62`, verificato prima delle azioni UI.
- `origin/main` osservato prima della registrazione: `2df614103aea2c3a59e1a2bcd29befe1c9d29ea6`, tramite `git ls-remote origin refs/heads/main`.

Il corpo è stato letto dalla risposta nativa con CDP; nessun `setContent`, HTML locale o risposta simulata. Questo pass non modifica né distribuisce il runtime.

## Controlli eseguiti

| Controllo | Esito |
| --- | --- |
| Documento nativo HTTP 200 | PASS |
| Dimensione e SHA-256 del runtime servito | PASS |
| Apertura Astro dal menu Strumenti | PASS |
| Header, riduzione e chiusura raggiungibili al punto centrale | PASS |
| Rettangoli dei tre controlli interamente nel viewport | PASS |
| Testo dell'header presente | PASS |
| Riduzione del pannello | PASS |
| Ripristino dal dock | PASS |
| Chiusura del pannello | PASS |
| Nessun tentativo di POST intercettato | PASS |
| Nessun errore catturato dall'evento browser `pageerror` | PASS |

Titolo osservato: «Alba / tramonto / luna (locale)». Il browser isolato è stato chiuso regolarmente; processo concluso con exit code 0.

Le richieste accessorie sono state bloccate dal test: **72 richieste bloccate**, **0 tentativi di POST**, **0 pageerror** catturati. I risultati non certificano il funzionamento di servizi esterni o dell'intera applicazione.

## Tentativo preliminare e correzione del test

Alle 10:51:16–10:51:21 Europe/Rome, il primo tentativo ha ottenuto HTTP 200 ma si è fermato prima delle azioni UI: `Network.getResponseBody` ha segnalato `Request content was evicted from inspector cache`. È un errore di acquisizione dell'harness, non un FAIL applicativo dimostrato.

Il secondo harness configura prima della navigazione una sessione CDP con buffer complessivo di 48 MiB e per risorsa di 24 MiB; acquisisce la risposta nella stessa sessione, senza normalizzare il testo. La correzione è verificata dall'esito v2 e dall'impronta esatta del documento.

Entrambi i tentativi sono conservati. L'integrità del file eseguito è stata confrontata con il sorgente preparato prima di ogni avvio. I timer limitano la durata e il risultato è salvato anche prima della pulizia del browser. Revisione indipendente GPT del solo harness eseguita; non equivale alla review AI esterna dei bundle 280/281, che resta non eseguita.

## Limiti e gate

- Questa prova riguarda Astro desktop in un browser nuovo sul PC del lavoro. Non è una prova touch o Safari/iPhone fisico.
- Lo scorrimento interno fino a Calcola non è stato ripetuto in questo pass.
- Rimane necessaria la [QA operatore su telefono](../2026-11-09-gis-window-controls-281/OPERATOR-CHECK-281.md): titolo e comandi accessibili, scroll fino a Calcola, riduzione, ripristino e chiusura.
- Nessun PASS generale delle 38 finestre; nessun nuovo esito per Preferiti/D-Flight o priorità Escape.
- I tre casi routing già confermati non vengono ripetuti né convertiti in un PASS della 281.
- Nessun commit runtime, deploy o modifica al VPS in questo pass. Accesso SSH diretto e autonomia dal PC non attestati.
- Codex e Cursor non invocati: esecuzione e registrazione effettuate da GPT. Le denominazioni storiche dei file di handoff restano convenzioni del repository.

## File di prova

- [Harness iniziale](workpc-live-check.cjs) e [risultato iniziale](workpc-live-result.json).
- [Harness corretto eseguito](workpc-live-check-v2.cjs) e [risultato PASS](workpc-live-result-v2.json).
- [Manifest con dimensioni e SHA-256](evidence-manifest.json).

Le evidenze e questa registrazione non costituiscono una chiusura di `GIS-WINDOW-CONTROLS-A`. Il NEXT rimane l'esito osservato dall'operatore sul telefono reale.
