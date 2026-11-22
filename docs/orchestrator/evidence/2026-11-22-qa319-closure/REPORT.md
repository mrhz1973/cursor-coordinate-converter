# Build319 — ricevuta QA operatore e chiusura del blocco

**Attestazione acquisita il 22 novembre 2026.** Blocco **MAP-RIGHT-TOOLBAR-TOOLTIPS-A**.

Attestazione esatta ricevuta dall’operatore:

> QA MAP-RIGHT-TOOLBAR-TOOLTIPS-A PASS operatore

**Conclusione: CLOSED per PASS operatore.** Dispositivo, browser e ora di esecuzione del collaudo umano non sono stati specificati. La ricevuta conserva questo limite senza attribuire una qualifica universale o a dispositivi identificati.

## Evidenze riusate

Restano acquisite le prove del [rapporto Build319](../2026-11-22-toolbar-tooltips-319/REPORT.md) e delle [evidenze tecniche](../2026-11-22-toolbar-tooltips-319/evidence.json), già pubblicate al commit `b9678d62a3e6c1bd51fc6f9c4d2927a4480ac970`: candidato **196/196 PASS**, LIVE HTTPS reale **112/112 PASS**, documenti verificati **3/3** e deploy tecnico PASS.

La chiusura documentale riusa tali ricevute: nessun nuovo test runtime o deploy. Le prove automatizzate restano riferite a Edge157.0.4341.60 con viewport/touch emulati. Il limite TLS1.3 `secure` con issuer ESET SSL Filter CA rimane documentato; questa attestazione non trasforma il risultato in una prova di TLS diretta non intercettata.

## Runtime invariato

| Identità | Valore |
| --- | --- |
| Build | 319 |
| Source commit | `b858b4e368d4eaa9ac007e73b0487c7e1a253f2c` |
| Blob | `d953ae6416b6b6e3b0405acc5b59400e93166703` |
| SHA256 | `5bd0375bdc851de12763b648eefb736db2c6a8e076ba8cbb4cbc3052d4600d18` |
| Dimensione | 11.299.241 byte; CR192, CRLF0 |

Il runtime e l’archivio dell’operatore restano fuori dal delta di chiusura. [Ricevuta strutturata](evidence.json).

## Metodo e prosecuzione

Chiusura secondo **OM §4 Regola H**: questo bundle documentale è seguito dall’autosync separato e dalla verifica finale esterna di HEAD, tracking, ref remoto, worktree e immutabilità del runtime. La presente ricevuta non anticipa l’esecuzione di quei passaggi.

La direttiva **«segui il backlog»** resta attiva: dopo la pubblicazione della chiusura si prosegue dal [backlog operativo](../../../work-units/WU-0005-0009-roadmap.md), con letture mirate al prossimo requisito e senza richiedere un nuovo obiettivo generico. Nessun candidato successivo è ancora aperto al momento di questa ricevuta.

P0 resta **aperto, autorizzato e non applicato**. DTM5/10m HOLD; P4 FUTURO; Oggetti GIS FROZEN/MAINTENANCE ONLY.
