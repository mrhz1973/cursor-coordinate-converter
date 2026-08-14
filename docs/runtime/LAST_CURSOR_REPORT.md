# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `20b1b494238f8dd483b3eb739f42dbf1194ab727` — verify short `20b1b49`
* real_task_subject: fix(dflight): clamp panel resize to actual top inside usable rect
* report_generated_at: 2026-08-14T09:41:00+02:00
* branch: main
* remote_head_after_task_push: `20b1b494238f8dd483b3eb739f42dbf1194ab727`
* previous_report_container: `07514b5a8a9b6f45d5801380274dbb5ec1a9409e`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: solo autosync memoria/report (monolite già nel commit task)
* pass_tecnico_remoto: task push verificato pre-autosync `20b1b49` = origin/main = ls-remote
* result_cursor: FIX3 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED — NON DEPLOY
* pass_operatore: non-attestato
* result_runtime: LIVE resta `7f35382` / build 182; candidate `20b1b49` / build 183 locale
* qa_attestation_source: selftest 250/250 + harness locale Cursor; Automated Browser QA VPS non eseguita (no deploy)
* notes: no finito; WU-0014 OPEN; no QA operatore; filtro/ATM09 invariati

## OUTPUT VERBATIM

```text
git rev-parse HEAD (task, pre-autosync)
20b1b494238f8dd483b3eb739f42dbf1194ab727

git ls-remote origin refs/heads/main (post-task-push, pre-autosync)
20b1b494238f8dd483b3eb739f42dbf1194ab727	refs/heads/main

git diff --stat 7f35382c7e04876428b3c5d4bd45fafff308486d..20b1b49 -- coordinate_converter Claude.html
 coordinate_converter Claude.html | 459 +++++++++++++++++++++++++++++++++++++--
 1 file changed, 443 insertions(+), 16 deletions(-)

selftest 250/250
harness 1280x700: top 287 preserved, maxH 339, bottom 626 <= map 638-12
findingWouldHaveBeen 819 (FIX2)
```

PASS remoto container corrente: **EXTERNAL_ONLY**.

## HISTORY

* `07514b5a8a9b6f45d5801380274dbb5ec1a9409e` — docs: orchestratore — FIX2 deploy PASS, Browser QA FAIL caso 8
* `cc4a9b145a4ed51f22df605017e50940114f1681` — docs: orchestratore — FIX2 deploy BLOCKED (SSH timeout)
* `f6b57f7c0c3c0dabe6712d3e55df8e6c8edee02d` — docs: orchestratore — FIX2 temporal filter UI-A (autosync/report)
* `7f35382c7e04876428b3c5d4bd45fafff308486d` — fix(dflight): FIX2 review hardening for temporal filter UI

## LIMITI

* FIX3 non deployato. Live resta build 182. Review GPT-sostitutiva pending.
