# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `20b1b494238f8dd483b3eb739f42dbf1194ab727` — verify short `20b1b49`
* real_task_subject: fix(dflight): clamp panel resize to actual top inside usable rect (deploy + Browser QA)
* report_generated_at: 2026-08-14T09:57:00+02:00
* branch: main
* remote_head_after_task_push: `2e355582e23c86fcfd39c1aebd985068612a6c14`
* previous_report_container: `2e355582e23c86fcfd39c1aebd985068612a6c14`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: solo autosync memoria/report
* pass_tecnico_remoto: deploy VPS GIS-only PASS (HTTP 200, CMP_OK, build 183); git HEAD pre-autosync `2e35558`
* result_cursor: DEPLOY PASS — AUTOMATED BROWSER QA PASS — QA FINALE CHATGPT PENDING
* pass_operatore: non-attestato
* result_runtime: LIVE `20b1b49` / build 183 · helper 0.1.3
* qa_attestation_source: Automated Browser QA Cursor su `?v=20b1b49` — PASS casi 1–10
* notes: no finito; WU-0014 OPEN; no PASS operatore

## OUTPUT VERBATIM

```text
git rev-parse HEAD (pre-autosync this follow-up)
2e355582e23c86fcfd39c1aebd985068612a6c14

VPS pull FF cc4a9b1..2e35558
HTTP 200 BYTES 10117693 CMP_OK SHA256 081c93c44a440f58b53c75be116c9c42e3ec79f972a5f1654c1c63bfe32d8bfe
BUILD 183 D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX3
helper 0.1.3 READY
URL http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=20b1b49
selftest 250/250
caso 3 PASS: top 287, maxH 339, bottom 626 <= map 638 / pad 12 (FIX2 would-be 819)
```

PASS remoto container corrente: **EXTERNAL_ONLY**.

## HISTORY

* `2e355582e23c86fcfd39c1aebd985068612a6c14` — docs: orchestratore — FIX3 temporal filter UI-A geometry clamp
* `07514b5a8a9b6f45d5801380274dbb5ec1a9409e` — docs: orchestratore — FIX2 deploy PASS, Browser QA FAIL caso 8
* `cc4a9b145a4ed51f22df605017e50940114f1681` — docs: orchestratore — FIX2 deploy BLOCKED (SSH timeout)
* `f6b57f7c0c3c0dabe6712d3e55df8e6c8edee02d` — docs: orchestratore — FIX2 temporal filter UI-A (autosync/report)
* `20b1b494238f8dd483b3eb739f42dbf1194ab727` — fix(dflight): clamp panel resize to actual top inside usable rect

## LIMITI

* QA operatore non attestata. WU-0014 OPEN. Non finito.
