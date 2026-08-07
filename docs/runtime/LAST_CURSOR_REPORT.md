# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `d42e3d22a8c0255872a2b338116ef3e31ab8ee56`
* real_task_subject: fix(map): enforce overlay max zoom and preserve sonar path
* report_generated_at: 2026-08-07T23:35:00+02:00
* branch: main
* remote_head_after_task_push: `d42e3d22a8c0255872a2b338116ef3e31ab8ee56`
* previous_report_container: `7833eb8` (autosync overlay stack implemented)
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: FIX1 runtime `d42e3d2` pushato; docs autosync in preparazione
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); task FIX1 `d42e3d2` già su origin pre-autosync
* result_cursor: MAP-TRANSPARENT-OVERLAY-STACK-A-FIX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED
* pass_operatore: NOT EXECUTED
* result_runtime: build 140 pubblicato pre-deploy; VPS live ancora a0a6816 / build 138
* qa_attestation_source: n/a
* notes: Sonar path dedicated restored; offline maxZoom dual defense; parent de8e053 superseded; no deploy/finito

## OUTPUT VERBATIM

```text
real_task_commit (FIX1 runtime):
d42e3d22a8c0255872a2b338116ef3e31ab8ee56

git branch --show-current
main

git log --oneline -5 (post-task, pre-autosync):
d42e3d2 fix(map): enforce overlay max zoom and preserve sonar path
7833eb8 docs: orchestratore — autosync overlay stack implemented review pending
de8e053 feat(map): add cached raster overlay stack
300dda1 docs: orchestratore — autosync open transparent overlay stack
5b4e411 docs: open transparent overlay stack after provider discovery

git rev-parse HEAD (post-task, pre-autosync):
d42e3d22a8c0255872a2b338116ef3e31ab8ee56

git ls-remote origin refs/heads/main (post-task, pre-autosync):
d42e3d22a8c0255872a2b338116ef3e31ab8ee56	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* 7833eb8 — docs: orchestratore — autosync overlay stack implemented review pending (real_task_commit storico `de8e053`)
* de8e053 — feat(map): add cached raster overlay stack
* d42e3d2 — fix(map): enforce overlay max zoom and preserve sonar path (FIX1 corrente)

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non richiede commit finalize-hash.
* Deploy e QA runtime non eseguiti.
