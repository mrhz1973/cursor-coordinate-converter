# LAST_CURSOR_REPORT

> Rolling handoff completo del pass promote+deploy+ABQA su `D-FLIGHT-CLOSE-CLEANUP-A-FIX1` (build 235). Non LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `D-FLIGHT-CLOSE-CLEANUP-A-FIX1` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA umana residua (ChatGPT) — **non** attestata in Cursor |
| **Runtime LIVE** | `4f004339c510c8848ffa0641908a487eeb3701c2` · build **235** · `D-FLIGHT-CLOSE-CLEANUP-A-FIX1` · blob `d2b7e1cdbd6a463741ab86b0a9616de85a9a2c9d` |
| **Reviewed candidate** | `f140e115fd2b8e2c321d94da41960f5cfefbc7fa` (blob identico) |
| **Result Cursor** | REVIEW PASS · cherry-pick main PASS · deploy PASS · ABQA PASS · docs evidence |
| **Working tree** | docs commit in corso |

## B. Identità git (F3)

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `4f004339c510c8848ffa0641908a487eeb3701c2` (cherry-pick di `f140e115…`) |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `4f004339c510c8848ffa0641908a487eeb3701c2` (pre-docs tip) |
| **real_task_commit** | `4f004339c510c8848ffa0641908a487eeb3701c2` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

Evidence: [`docs/orchestrator/inbox/2026-08-20_2142_D-FLIGHT-CLOSE-CLEANUP-A-FIX1_deploy-abqa.md`](../orchestrator/inbox/2026-08-20_2142_D-FLIGHT-CLOSE-CLEANUP-A-FIX1_deploy-abqa.md)

## C. Esiti

- Deploy GIS-only: **PASS** (CMP PASS, HTTP 200, blob match)
- Automated Browser QA: **PASS** 18/18
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=4f00433`
- origin push locale: **DISABLED_PUSH** (push espliciti URL)

## STATO FRESCO DA CURSOR

```text
STATO FRESCO DA CURSOR
origin/main HEAD: 4f004339c510c8848ffa0641908a487eeb3701c2 (pre-docs)
working tree: docs-only commit in corso
ultimo blocco PASS tecnico: D-FLIGHT-CLOSE-CLEANUP-A-FIX1 deploy+ABQA
prossimo candidato: QA FINALE CHATGPT — PENDING
note operative: non finito; non QA operatore
```
