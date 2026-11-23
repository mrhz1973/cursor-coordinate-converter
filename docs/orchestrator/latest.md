# TMAR GIS Tool — stato operativo corrente

> [`docs/FRONTIER.md`](../FRONTIER.md) è l’unica fonte canonica LIVE STATE; questo file è un indice di continuità.

| Campo | Stato |
| --- | --- |
| Runtime LIVE | **Build322 T1 MAP-FRACTIONAL-ZOOM-A-T1** — source `e707870b7f0b550f2e4ccf61af498e7dd480b8f6`, SHA-256 `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c` (11.351.420 byte) |
| Ultimo CLOSED | **Build322 T1**, attestazione `QA MAP-FRACTIONAL-ZOOM-A-T1 PASS operatore` 23/11/2026; [ricevuta](evidence/2026-11-23-qa322-t1-closure/REPORT.md) |
| Gate riusati | Build323 statici44/44; candidato R2 79/79, R3 33/33, R4 29/29, R5 27/27; review sostitutiva23/23 PASS. Deploy/ABQA LIVE PENDING. |
| Bundle runtime attivo | **Build323 MAP-FRACTIONAL-ZOOM-A-T2 DELICATO** - [review](evidence/2026-11-23-fractional-zoom-t2-323/REVIEW.md); parent OPEN. |
| NEXT | Deploy GIS-only controllato; ABQA LIVE stesso SHA; QA operatore. |
| Residui | P0 recupero archivio autorizzato ma non applicato; DTM5/10m HOLD, P4 FUTURO; nessuna compatibilità universale o dispositivo fisico attestati |

Chiusura Regola H docs-only al commit `57cb5f5043bc5b873150317a4720c0f6224f34c1`; nessun nuovo deploy, test o accesso agli archivi utente durante tale chiusura.

[Build322 LIVE](https://ionos-n8n-new.tailc01234.ts.net/gis?v=c2c31a2e) · [QA operatore](evidence/2026-11-23-qa322-t1-closure/REPORT.md) · [Roadmap MAP UX](../work-units/WU-0005-0009-roadmap.md)