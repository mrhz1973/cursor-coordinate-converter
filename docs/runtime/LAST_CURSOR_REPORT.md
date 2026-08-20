# LAST_CURSOR_REPORT

> Rolling handoff completo del pass "promuovi + deploy GIS + ABQA" su `D-FLIGHT-CLOSE-CLEANUP-A` (candidate 234). Non LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `D-FLIGHT-CLOSE-CLEANUP-A` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA umana residua (ChatGPT) — **non** attestata in Cursor |
| **Runtime LIVE** | `ea8370460ae133fbba2592235277a9cc1f7d9d1e` · build **234** · `D-FLIGHT-CLOSE-CLEANUP-A` · blob `7232d08e1452bbea4563fe096fa71342b2cb2b63` |
| **Candidate FULL SHA** | `ea8370460ae133fbba2592235277a9cc1f7d9d1e` |
| **Result Cursor** | REVIEW PASS · main promote PASS · deploy PASS · ABQA PASS · docs evidence |
| **Working tree** | docs commit in corso |

## B. Identità git (F3)

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `ea8370460ae133fbba2592235277a9cc1f7d9d1e` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `1b97146ee56683d03eb1722c1cc3e847c5fa0b2f` (pre-docs tip) |
| **real_task_commit** | `ea8370460ae133fbba2592235277a9cc1f7d9d1e` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

Evidence: [`docs/orchestrator/inbox/2026-08-20_2105_D-FLIGHT-CLOSE-CLEANUP-A_deploy-abqa.md`](../orchestrator/inbox/2026-08-20_2105_D-FLIGHT-CLOSE-CLEANUP-A_deploy-abqa.md)

## C. Esiti

- Deploy GIS-only: **PASS** (CMP PASS, HTTP 200, blob match)
- Automated Browser QA: **PASS** 16/16
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=ea83704`
- origin push locale: **DISABLED_PUSH** (push espliciti URL)

## STATO FRESCO DA CURSOR

```text
STATO FRESCO DA CURSOR
origin/main HEAD: (post-docs push — verificare ls-remote)
working tree: docs-only commit in corso
ultimo blocco PASS: D-FLIGHT-CLOSE-CLEANUP-A deploy+ABQA
prossimo candidato: QA FINALE CHATGPT — PENDING
note operative: non finito; non QA operatore
```
