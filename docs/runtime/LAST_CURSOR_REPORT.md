# LAST_CURSOR_REPORT

> Rolling handoff: REVIEW PASS + FF exact promote + deploy GIS + ABQA per `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2`. Non LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA umana residua (ChatGPT) → attestazione operatore |
| **Runtime LIVE** | `d899cff2c7ac24f1b9bba3eb99d10e08d2442b25` · build **238** · `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2` · blob `c36109d1ebda7470748a3284089bf11b262d01cf` |
| **Result Cursor** | REVIEW PASS · FF exact · deploy CMP PASS · ABQA 21/21 PASS |
| **Working tree** | docs commit in corso |

## B. Identità git (F3)

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `d899cff2c7ac24f1b9bba3eb99d10e08d2442b25` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `d899cff2c7ac24f1b9bba3eb99d10e08d2442b25` (pre-docs tip) |
| **real_task_commit** | `d899cff2c7ac24f1b9bba3eb99d10e08d2442b25` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

Evidence: [`docs/orchestrator/inbox/2026-08-21_0115_D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2_deploy-abqa.md`](../orchestrator/inbox/2026-08-21_0115_D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2_deploy-abqa.md)

## C. Esiti

- Promote: FF exact candidate (no merge review branch)
- Deploy GIS: HTTP 200 · CMP PASS · VPS HEAD/blob = candidate
- ABQA: **21/21 PASS** (ATM09 panel evidence + screenshot)
- Gate: **QA FINALE CHATGPT — PENDING**
- origin push locale: **DISABLED_PUSH**

## STATO FRESCO DA CURSOR

```text
STATO FRESCO DA CURSOR
origin/main HEAD: d899cff2c7ac24f1b9bba3eb99d10e08d2442b25 (pre-docs; post-docs = tip docs)
working tree: docs-only commit in corso
ultimo blocco PASS tecnico: D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2 deploy+ABQA
prossimo candidato: QA FINALE CHATGPT — PENDING
note operative: LIVE blob c36109d1… build 238; ATM09 Rule/Regola display-only
```
