# QA HUMAN NO-OPSEC + D-FLIGHT-H operator findings

**Data:** 2026-08-13 11:42 +02:00  
**Runtime osservato:** `2124d25c80873f11b3b86ddc410545d62975e704` · `D-FLIGHT-H-AUTOLOAD-UX-A-FIX2` · build **173**  
**Gate precedente:** `D-FLIGHT-H-AUTOLOAD-UX-A-FIX2 DEPLOYED — AUTOMATED BROWSER QA PASS — QA OPERATORE REQUIRED`

## Decisione QA operatore

Decisione esplicita operatore: **OPSEC non deve più essere incluso nella QA umana**.

Nuova rule always-apply: `.cursor/rules/32-qa-human-no-opsec.mdc`.

Le verifiche OPSEC/rete restano tecniche e devono essere coperte prima della QA operatore tramite review, selftest, Automated Browser QA, Network/Console instrumentation o smoke appropriati. Se non verificabili tecnicamente, il gate resta BLOCKED/FAIL/INCOMPLETE: non si delegano alla QA umana.

## Feedback QA operatore su build 173

La QA operatore **NON è PASS**. Non eseguire `finito`.

Finding osservati:

1. **Tempo di caricamento D-Flight percepito molto alto:** circa **1 minuto** per arrivare al dataset/zone operative. Non classificare come normale senza misura: richiede diagnosi tempi fetch / parse / normalize / render / ATM09.
2. **Legenda ATM09 ufficiale:** click/espansione non mostra contenuto visibile all'operatore. Questo confligge con l'atteso umano della sezione espandibile e richiede diagnosi runtime/UI anche se Automated Browser QA aveva verificato il lazy `src`.
3. **Interazione zona:** avvicinandosi compare il tooltip, ma il click non apre ulteriori dettagli. Possibile problema di hit-testing / stacking di layer sovrapposti o lifecycle interazione; da diagnosticare, non assumere la causa.
4. **Pannello/modale D-Flight ancora non modificabile/spostabile/ridimensionabile** secondo aspettativa operatore. Riconciliare con scope/decisioni già registrate prima di classificarlo come regressione H o backlog separato.
5. Il resto della UX risulta **grossomodo funzionante**, ma i finding sopra impediscono PASS operatore.

## Gate

`D-FLIGHT-H-AUTOLOAD-UX-A-FIX2 QA OPERATORE FAIL — DIAG REQUIRED`

## NEXT

Diagnosi mirata, senza patch preventiva, su:

- timing reale autoload fino a ready;
- lazy legend ATM09: request/status/content/render dopo expand;
- click zone e hit-testing con layer sovrapposti;
- requisito pannello movable/resizable rispetto alle decisioni vive del workstream D-Flight G/H.

**NO deploy / NO finito / NO attestazione PASS operatore.**
