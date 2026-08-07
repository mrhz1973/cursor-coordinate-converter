# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `5aaa54b8311317d078685d26acc64cdbac28e0cd`
* real_task_subject: fix(map): overzoom Strava and distinguish overlays
* report_generated_at: 2026-08-08T01:26:00+02:00
* branch: main
* remote_head_after_task_push: `5aaa54b8311317d078685d26acc64cdbac28e0cd`
* previous_report_container: `24aff93245b7acaa38e7c5797a1da9b86ab8331e`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: FIX2 runtime `5aaa54b` pushato; docs autosync in preparazione; monolite escluso dall'autosync
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); task FIX2 `5aaa54b` già su origin pre-autosync
* result_cursor: MAP-TRANSPARENT-OVERLAY-STACK-A-FIX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED
* pass_operatore: NOT EXECUTED
* result_runtime: build 141 pubblicato pre-deploy; no deploy in questo giro
* qa_attestation_source: n/a
* notes: Strava displayMaxZoom 20 local overzoom from native z11; fetch/precache maxZoom 11 invariato; tlayer-overlay-item CSS; Planet-Clone/proxy non toccati; OM/roadmap non chiusi

## OUTPUT VERBATIM

```text
real_task_commit (FIX2 runtime):
5aaa54b8311317d078685d26acc64cdbac28e0cd

monolite blob:
06dde2459bdf07b021d2635a8a75d21504655468

git branch --show-current
main

git log --oneline -5 (post-task, pre-autosync):
5aaa54b fix(map): overzoom Strava and distinguish overlays
24aff93 docs: orchestratore — autosync overlay stack FIX1 review pending
d42e3d2 fix(map): enforce overlay max zoom and preserve sonar path
7833eb8 docs: orchestratore — autosync overlay stack implemented review pending
de8e053 feat(map): add cached raster overlay stack

git rev-parse HEAD (post-task, pre-autosync):
5aaa54b8311317d078685d26acc64cdbac28e0cd

git rev-parse origin/main (post-task, pre-autosync):
5aaa54b8311317d078685d26acc64cdbac28e0cd

git ls-remote origin refs/heads/main (post-task, pre-autosync):
5aaa54b8311317d078685d26acc64cdbac28e0cd	refs/heads/main

git status --short (post-task, pre-autosync):
(vuoto)
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* `24aff93245b7acaa38e7c5797a1da9b86ab8331e` — docs: orchestratore — autosync overlay stack FIX1 review pending (real_task_commit `d42e3d22a8c0255872a2b338116ef3e31ab8ee56`)
* `7833eb8` — docs: orchestratore — autosync overlay stack implemented review pending (real_task_commit storico `de8e053`)
* `d42e3d2` — fix(map): enforce overlay max zoom and preserve sonar path (FIX1)
* `de8e053` — feat(map): add cached raster overlay stack

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non richiede commit finalize-hash.
* Deploy e QA runtime non eseguiti in questo giro.
* Review GPT-sostitutiva obbligatoria prima del deploy.
