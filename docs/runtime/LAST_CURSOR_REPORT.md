# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `a667f7455ca0cdf73e56ea5944832011639e32e4`
* real_task_subject: fix(map): use native Strava tile size for overzoom
* report_generated_at: 2026-08-10T13:20:00+02:00
* branch: main
* remote_head_after_task_push: `a667f7455ca0cdf73e56ea5944832011639e32e4`
* previous_report_container: `c71d15c36d67dd087da45a4646020ff8a047425d`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: FIX4 runtime `a667f74` pushato; docs autosync in preparazione; monolite escluso
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); task FIX4 `a667f74` già su origin pre-autosync
* result_cursor: MAP-TRANSPARENT-OVERLAY-STACK-A-FIX4 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED
* pass_operatore: NOT EXECUTED
* result_runtime: build 143 pubblicato pre-deploy; no deploy in questo giro
* qa_attestation_source: n/a
* notes: Crop Strava dimension-aware (width/naturalWidth); nessun hard-code 512; z11 path invariato; OPSEC fuori scope; coda finito solo dopo review+deploy+QA PASS

## OUTPUT VERBATIM

```text
real_task_commit (FIX4 runtime):
a667f7455ca0cdf73e56ea5944832011639e32e4

monolite blob:
db1b6f24c22c9811f6a7d3d276b0215db4afeddc

parent live FIX3 runtime:
261fcdf937de25eb9fcc376b37c4d1de4eb231c0

git branch --show-current
main

git log --oneline -5 (post-task, pre-autosync):
a667f74 fix(map): use native Strava tile size for overzoom
c71d15c docs: orchestratore — autosync overlay stack FIX3 review pending
261fcdf fix(map): preserve Strava effective-online gate
64eac2d docs: orchestratore — autosync overlay stack FIX2 review pending
5aaa54b fix(map): overzoom Strava and distinguish overlays

git rev-parse HEAD (post-task, pre-autosync):
a667f7455ca0cdf73e56ea5944832011639e32e4

git ls-remote origin refs/heads/main (post-task, pre-autosync):
a667f7455ca0cdf73e56ea5944832011639e32e4	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* `c71d15c36d67dd087da45a4646020ff8a047425d` — docs: orchestratore — autosync overlay stack FIX3 review pending (real_task_commit `261fcdf937de25eb9fcc376b37c4d1de4eb231c0`)
* `64eac2d144bd4a2933e1fc13cd7515ac6043d84f` — docs: orchestratore — autosync overlay stack FIX2 review pending (real_task_commit `5aaa54b8311317d078685d26acc64cdbac28e0cd`)
* `24aff93245b7acaa38e7c5797a1da9b86ab8331e` — docs: orchestratore — autosync overlay stack FIX1 review pending (real_task_commit `d42e3d22a8c0255872a2b338116ef3e31ab8ee56`)
* `261fcdf` — fix(map): preserve Strava effective-online gate (FIX3)
* `5aaa54b` — fix(map): overzoom Strava and distinguish overlays (FIX2)

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Deploy e QA runtime non eseguiti.
* Review GPT-sostitutiva obbligatoria prima del deploy.
* OPSEC frozen / fuori scope di questo blocco.
