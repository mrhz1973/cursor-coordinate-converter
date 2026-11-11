# Audit supplementare Escape — preparazione isolata Build 284

Data: 2026-11-11 06:56:09 Europe/Rome. Esecuzione GPT via TMAR Desktop Commander Win sull'AsusDesktop.

## LIVE STATE (non modificato)
Build 283 sul VPS; blocco GIS-DFLIGHT-MINIMIZED-ESCAPE-A, gate QA OPERATORE DESKTOP pendente. Il messaggio «vai vanti» non viene interpretato come PASS operatore. Sviluppo telefono in pausa. Nessuna modifica al runtime distribuito, nessun restart o servizio modificato da questo pass.

## Tre finding riprodotti in Edge sulla Build 283 HTTPS nativa
Ogni scenario è stato eseguito in un profilo Edge temporaneo isolato, viewport 1440 x 1000, apertura dei pannelli dai controlli UI, Escape reale, senza invio POST. Il controllo Poligoni da solo chiude correttamente.

| Pannello minimizzato | Pannello visibile | Escape atteso | Esito |
| --- | --- | --- | --- |
| Mappe Offline | Poligoni | Chiude Poligoni | FAIL (6/7 PASS) |
| Cerca | Poligoni | Chiude Poligoni | FAIL (6/7 PASS) |
| Cronologia | Poligoni | Chiude Poligoni | FAIL (6/7 PASS) |

Totale baseline: 18 PASS e 3 FAIL su 21 controlli. Un primo tentativo Cronologia era INCOMPLETE per un ID mancante nel solo harness; dopo correzione del runner, riproduzione completa. Nessun PASS generale delle 38 finestre. I finding sono della stessa famiglia del ramo Escape ma non sono stati risolti nella 283.

## Correzione sperimentale, NON DEPLOY
Ramo GitHub: task/gis-escape-minimized-followup-284
Commit codice: 274e59c0e972189f937af78ad2c6080150ed8247
Base: b19e4db5feb7412423d68cec97db38cbe1c32290
File interessato: solo coordinate_converter Claude.html
Diff: 9 righe aggiunte, 9 eliminate; tre condizioni Escape e tre metadati di build.
Build sperimentale: 284, 11.108.988 byte; SHA-256 6ac22c7a9ae382c1344115a6c159f46f4d7a25789faf4ef45d5262e823ede2ad; blob Git 1bb1e2c4d8ff5c35fd197583658d5b105379406a.

La guardia dei tre dialog opera soltanto se il dialog è aperto e non minimizzato; Escape può proseguire verso Poligoni visibile. Tutto il resto del runtime è preservato. Sintassi Node 2/2 PASS; patch reversibile, git diff --check PASS, 192 CR isolati invariati.

## QA candidata INIETTATA, distinta da LIVE
Browser Edge con documento candidato sostituito soltanto in memoria mantenendo l'origin HTTPS del VPS. Nessun deploy.
- Mappe Offline minimizzata + Poligoni: 7/7 PASS.
- Cerca minimizzata + Poligoni: 7/7 PASS.
- Cronologia minimizzata + Poligoni: 7/7 PASS.
- Regressione D-Flight Build 283: 17/17 PASS.
Totale 38/38 controlli PASS, con controlli ripetuti tra scenari; non significa 38 dialoghi verificati. Nessuna QA operatore 284 o review definitiva dichiarata.

## Gate e NEXT
Mantenere QA operatore 283 pendente. Solo dopo attestazione esplicita, chiudere la 283 secondo Regola H; riallineare la branch 284 alla HEAD canonica se necessario, quindi review delicata, gate pertinenti e deploy GIS-only se tutti PASS. Non trattare questa candidata come LIVE.
