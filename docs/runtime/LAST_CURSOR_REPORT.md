# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `261fcdf937de25eb9fcc376b37c4d1de4eb231c0`
* real_task_subject: fix(map): preserve Strava effective-online gate
* report_generated_at: 2026-08-08T01:46:00+02:00
* branch: main
* remote_head_after_task_push: `261fcdf937de25eb9fcc376b37c4d1de4eb231c0`
* previous_report_container: `64eac2d144bd4a2933e1fc13cd7515ac6043d84f`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: FIX3 runtime `261fcdf` pushato; docs autosync in preparazione; monolite escluso
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); task FIX3 `261fcdf` già su origin pre-autosync
* result_cursor: MAP-TRANSPARENT-OVERLAY-STACK-A-FIX3 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED
* pass_operatore: NOT EXECUTED
* result_runtime: build 142 pubblicato pre-deploy; no deploy in questo giro
* qa_attestation_source: n/a
* notes: Gate isEffectivelyOnline dopo cache-hit in hydrateStravaRunHeatmapTiles; parent FIX2 `5aaa54b` review FAIL; maxZoom 11 / displayMaxZoom 20 invariati; OM/roadmap non chiusi

## OUTPUT VERBATIM

```text
real_task_commit (FIX3 runtime):
261fcdf937de25eb9fcc376b37c4d1de4eb231c0

monolite blob:
d71529df649fb91e5bd20a348b3511fdb422682a

parent FIX2 runtime:
5aaa54b8311317d078685d26acc64cdbac28e0cd

git branch --show-current
main

git log --oneline -5 (post-task, pre-autosync):
261fcdf fix(map): preserve Strava effective-online gate
64eac2d docs: orchestratore — autosync overlay stack FIX2 review pending
5aaa54b fix(map): overzoom Strava and distinguish overlays
24aff93 docs: orchestratore — autosync overlay stack FIX1 review pending
d42e3d2 fix(map): enforce overlay max zoom and preserve sonar path

git rev-parse HEAD (post-task, pre-autosync):
261fcdf937de25eb9fcc376b37c4d1de4eb231c0

git ls-remote origin refs/heads/main (post-task, pre-autosync):
261fcdf937de25eb9fcc376b37c4d1de4eb231c0	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* `64eac2d144bd4a2933e1fc13cd7515ac6043d84f` — docs: orchestratore — autosync overlay stack FIX2 review pending (real_task_commit `5aaa54b8311317d078685d26acc64cdbac28e0cd`)
* `24aff93245b7acaa38e7c5797a1da9b86ab8331e` — docs: orchestratore — autosync overlay stack FIX1 review pending (real_task_commit `d42e3d22a8c0255872a2b338116ef3e31ab8ee56`)
* `5aaa54b` — fix(map): overzoom Strava and distinguish overlays (FIX2)
* `d42e3d2` — fix(map): enforce overlay max zoom and preserve sonar path (FIX1)

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Deploy e QA runtime non eseguiti.
* Review GPT-sostitutiva obbligatoria prima del deploy.
