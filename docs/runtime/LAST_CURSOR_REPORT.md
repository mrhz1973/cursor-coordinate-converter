# LAST_CURSOR_REPORT

> Rolling handoff completo del pass "promuovi + deploy GIS + ABQA" su `GLOBAL-MODAL-EDGE-RESIZE-A-FIX1` (candidate 233). Non LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GLOBAL-MODAL-EDGE-RESIZE-A-FIX1` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA umana residua (ChatGPT) — **non** attestata in Cursor |
| **Runtime LIVE** | `1b8aa3c688f9800a47d0f7851af4c3d38ffe3c00` · build **233** · `GLOBAL-MODAL-EDGE-RESIZE-A-FIX1` · blob `8bb4133bbfe29a13794fdb7355c0e4aec0c35213` |
| **Candidate FULL SHA** | `1b8aa3c688f9800a47d0f7851af4c3d38ffe3c00` |
| **Build / ID / blob** | **233** / `GLOBAL-MODAL-EDGE-RESIZE-A-FIX1` / `8bb4133bbfe29a13794fdb7355c0e4aec0c35213` |
| **Result Cursor** | REVIEW PASS · main promote PASS · deploy PASS · ABQA PASS · docs evidence |
| **Working tree (pre-docs tip)** | clean after promote |

## B. Identità git (F3)

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `1b8aa3c688f9800a47d0f7851af4c3d38ffe3c00` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `PENDING_SELF_REFERENCE` (questo container docs) |
| **real_task_commit** | `1b8aa3c688f9800a47d0f7851af4c3d38ffe3c00` |
| **evidence_on_main** | `0590faee18e617ddd228f23e1090236605ead1ef` (review package cherry-pick) |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

Evidence: [`docs/orchestrator/inbox/2026-08-20_1645_GLOBAL-MODAL-EDGE-RESIZE-A-FIX1_deploy-abqa.md`](../orchestrator/inbox/2026-08-20_1645_GLOBAL-MODAL-EDGE-RESIZE-A-FIX1_deploy-abqa.md)

## C. Esiti

- Convert stress: **PRE-EXISTING / NOT REGRESSION**
- Deploy GIS-only: **PASS** (CMP PASS, HTTP 200, blob match)
- Automated Browser QA: **PASS** 20/20 · selftest 31/31
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=1b8aa3c`
- origin push locale: **DISABLED_PUSH** (push espliciti URL)

## STATO FRESCO DA CURSOR

```text
STATO FRESCO DA CURSOR
origin/main HEAD: (post-docs push — verificare ls-remote)
working tree: docs-only commit in corso
ultimo blocco PASS: GLOBAL-MODAL-EDGE-RESIZE-A-FIX1 deploy+ABQA
prossimo candidato: QA FINALE CHATGPT — PENDING
note operative: non finito; non QA operatore
```
