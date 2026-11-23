# Build322 T1 — QA operatore PASS e chiusura Regola H

**Attestazione esplicita acquisita il 23 novembre 2026:**

> QA MAP-FRACTIONAL-ZOOM-A-T1 PASS operatore

**Stato: CLOSED / QA_OPERATORE_PASS per il solo T1.** Il requisito generale `MAP-FRACTIONAL-ZOOM-A` rimane aperto: questa versione offre una preview fluida durante wheel ma lo zoom finale resta un livello intero.

## Evidenza già verificata

- [Release Build322](../2026-11-23-wheel-preview-322/REPORT.md): `DEPLOY_TECHNICAL_PASS`, runtime servito via HTTP/HTTPS con SHA-256 esatto.
- [Review](../2026-11-23-wheel-preview-322/REVIEW.md): GPT sostitutiva **18/18 PASS**, review esterna indipendente non attestata.
- [QA browser LIVE aggregata](../2026-11-23-build322-live-qa-aggregation/REPORT.md) e [dati](../2026-11-23-build322-live-qa-aggregation/evidence.json): **78/78 PASS**, quattro viewport Edge158 emulati, R1/R5/R6. STOP precedenti di intercettazione HTTPS conservati separatamente.
- QA operatore: PASS ricevuto nella chat corrente, senza indicazione di dispositivo, browser o orario esatto del test umano. Non estendere il PASS a Safari/Firefox, dispositivi fisici o compatibilità universale.

## Identità runtime invariata

| Elemento | Valore |
| --- | --- |
| Build | **322** |
| Source commit | `e707870b7f0b550f2e4ccf61af498e7dd480b8f6` |
| Git blob | `5b3ddb2700736c6f5d7bed0574179c74929424bc` |
| SHA-256 | `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c` |
| Dimensione | 11.351.420 byte |

## Chiusura docs-only e NEXT

Regola H del metodo applicata senza ulteriore comando manuale `finito`. Nessun test, deploy, commit runtime o accesso agli archivi dell’operatore durante questa chiusura. Non dichiarare un secondo rilascio.

Il prossimo passo del backlog è un **audit mirato T2** dell’eventuale zoom finale frazionario persistente: coordinate, camera, gestione delle tile, layer e hit-test devono essere qualificati prima di aprire una build. P0 recupero archivi autorizzato ma non applicato; accuratezza DTM5/10m HOLD e P4 FUTURO.

[Ricevuta strutturata](evidence.json).
