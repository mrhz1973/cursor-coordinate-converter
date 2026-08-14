# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `7501d0f7f24957f17497357230baebe36b11f298` — verify short `7501d0f`
* real_task_subject: fix: D-FLIGHT-HIT-TEST-FIX-A-FIX2 — visible NFZ fallback after ATM09 INFO failure (build 186)
* report_generated_at: 2026-08-14T16:21:00+02:00
* branch: main
* remote_head_after_task_push: `7501d0f7f24957f17497357230baebe36b11f298`
* previous_report_container: `d994e1d48b76682124009126b43ef5b33f406770`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: solo autosync memoria/report (monolite già nel task commit)
* pass_tecnico_remoto: EXTERNAL_ONLY (verifica esterna post-push autosync)
* result_cursor: IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED — no deploy — no finito
* pass_operatore: non-attestato (FIX1 FAIL ricevuto; FIX2 non in QA operatore)
* result_runtime: LIVE resta `488b6c0` / 185; candidate `7501d0f` / 186 non deployato
* qa_attestation_source: pre-review CDP locale Cursor (async 200→502→visible→FUTURE→recovery) + selfTest 276/276 + selfTestAsync 278/278
* notes: helper 0.1.3 invariato; ClearInfo ≠ clear unavailable; preferred ON reapply non resetta flag

## OUTPUT VERBATIM

```text
git rev-parse HEAD (post task push, pre autosync)
7501d0f7f24957f17497357230baebe36b11f298

git rev-parse origin/main
7501d0f7f24957f17497357230baebe36b11f298

git ls-remote origin refs/heads/main
7501d0f7f24957f17497357230baebe36b11f298	refs/heads/main

git show --stat HEAD (task)
 coordinate_converter Claude.html | 579 ++++++++++++++++++++++++++++++++++++---
 1 file changed, 536 insertions(+), 43 deletions(-)

APP_BUILD_NUM = 186 / D-FLIGHT-HIT-TEST-FIX-A-FIX2
CDP pre-review: ok=true; selfTest 276/276; selfTestAsync 278/278
```

PASS remoto container corrente: **EXTERNAL_ONLY**.

## HISTORY

* `d994e1d` — docs FIX1 deploy + Automated Browser QA PASS
* `488b6c0` — runtime FIX1 build 185 (LIVE; QA operatore FAIL)
* `0c3f690` — docs FIX1 implemented review required
* `62de84e` — FIX-A 184 REVIEW FAIL superseded

## LIMITI

* Nessun deploy FIX2. Nessun `finito`. QA operatore FIX2 non eseguita. Review GPT-sostitutiva pending.
