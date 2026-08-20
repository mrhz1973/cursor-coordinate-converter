# LAST_CURSOR_REPORT

> Rolling handoff: REVIEW PASS + promote exact + deploy GIS + ABQA per `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1`. Non LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA umana residua (ChatGPT) → attestazione operatore |
| **Runtime LIVE** | `8a350f7a9654fe1de0b6757c31ae39fa6c07ac05` · build **237** · `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1` · blob `4d8c2b3a68c348b30c8683319c31df3cb01e138a` |
| **Result Cursor** | REVIEW PASS registrato · FF exact su main · deploy CMP PASS · ABQA 21/21 PASS |
| **Working tree** | docs commit in corso |

## B. Identità git (F3)

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `8a350f7a9654fe1de0b6757c31ae39fa6c07ac05` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `8a350f7a9654fe1de0b6757c31ae39fa6c07ac05` (pre-docs tip) |
| **real_task_commit** | `8a350f7a9654fe1de0b6757c31ae39fa6c07ac05` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

Evidence: [`docs/orchestrator/inbox/2026-08-21_0035_D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1_deploy-abqa.md`](../orchestrator/inbox/2026-08-21_0035_D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1_deploy-abqa.md)

## C. Esiti

- Promote: FF exact candidate (no merge review branch; no recreate)
- Deploy GIS: HTTP 200 · CMP PASS · VPS HEAD/blob = candidate
- ABQA: **21/21 PASS**
- Rejected 236: non deployato
- Gate: **QA FINALE CHATGPT — PENDING** (no QA operatore / no finito)
- origin push locale: **DISABLED_PUSH**

## STATO FRESCO DA CURSOR

```text
STATO FRESCO DA CURSOR
origin/main HEAD: 8a350f7a9654fe1de0b6757c31ae39fa6c07ac05 (pre-docs; post-docs = tip docs)
working tree: docs-only commit in corso
ultimo blocco PASS tecnico: D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1 deploy+ABQA
prossimo candidato: QA FINALE CHATGPT — PENDING
note operative: LIVE blob 4d8c2b3… build 237; 236 rejected
```
