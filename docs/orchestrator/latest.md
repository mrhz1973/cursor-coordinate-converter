# TMAR GIS Tool — stato operativo corrente

> Fonte canonica LIVE STATE: [`docs/FRONTIER.md`](../FRONTIER.md). Questo riepilogo è un puntatore, non una seconda fonte di verità.

| Campo | Stato |
| --- | --- |
| Ultimo blocco chiuso | **MAP-PAN-TILE-OVERSCAN-A — Build320**, `CLOSED / QA_OPERATORE_PASS` (22/11/2026) |
| QA tecnica | DEPLOY_TECHNICAL_PASS; browser LIVE Edge158 aggregata **70/70 PASS** (R6 desktop35/35 + R7 phone35/35) |
| QA operatore | Attestazione esatta `QA MAP-PAN-TILE-OVERSCAN-A PASS operatore` acquisita in chat |
| Runtime LIVE | Build320 — source `ca3a38d1c7703c5bf93724cd5df608af2914751d`, SHA-256 `b3fcec1135b77bd0dec21351fb87b894c5f5828bce455995b8fa03aaf744f689` |
| Candidato successivo | **Nessuno**; nessuna WU attiva |
| NEXT | Riprendere il backlog MAP UX autorizzato con audit mirato; P0 secondario autorizzato ma non applicato |
| Limiti | QA umana senza browser/dispositivo/ora esatti; dispositivo mobile fisico, Safari/Firefox non attestati. DTM5/10m HOLD, P4 FUTURO |

**Ricevute:** [chiusura Build320](evidence/2026-11-22-qa320-closure/REPORT.md) · [QA browser aggregata](evidence/2026-11-22-build320-live-qa-aggregation/REPORT.md) · [roadmap](../work-units/WU-0005-0009-roadmap.md).

**Provenienza:** chiusura docs-only sul commit `17f17d036cf835393cae77fd32f8d5394e07a31b`, poi autosync separato. `coordinate_converter Claude.html` invariato; nessun nuovo test o deploy in chiusura.
