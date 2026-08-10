# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `535670041dcb22f1505ff85e45ff3286ff91d293`
* real_task_subject: feat(carto): expand IGM series index
* report_generated_at: 2026-08-10T19:24:00+02:00
* branch: main
* remote_head_after_task_push: `535670041dcb22f1505ff85e45ff3286ff91d293`
* previous_report_container: `0c3882828a686e27f100eaa1ef4d9172ca34b345`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: task runtime `5356700` pushato; docs autosync in preparazione; monolite escluso
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); task `5356700` già su origin pre-autosync
* result_cursor: CARTO-IGM-SERIES-EXPAND-A IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED
* pass_operatore: NOT EXECUTED
* result_runtime: build 144; payload 8204; 25kauto RDN2008 PASS; no deploy
* qa_attestation_source: n/a
* notes: Series 25/25v/25kauto embedded; hard-code 911 rimosso; UI filtri IT-only; Objects GIS FROZEN; coda finito solo dopo review+deploy+QA PASS

## OUTPUT VERBATIM

```text
real_task_commit:
535670041dcb22f1505ff85e45ff3286ff91d293

monolite blob:
9266de153cfd1e0219e796463ddd0a81c345737e

git branch --show-current
main

git log --oneline -5 (post-task, pre-autosync):
5356700 feat(carto): expand IGM series index
0c38828 docs: orchestratore — riconciliazione finito sessione
53328ef docs: finito MAP-TRANSPARENT-OVERLAY-STACK-A-FIX4 after Regola H QA PASS
e3eb3fb docs: orchestratore — autosync overlay stack FIX4 review pending
a667f74 fix(map): use native Strava tile size for overzoom

git rev-parse HEAD (post-task, pre-autosync):
535670041dcb22f1505ff85e45ff3286ff91d293

git ls-remote origin refs/heads/main (post-task, pre-autosync):
535670041dcb22f1505ff85e45ff3286ff91d293	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* `0c3882828a686e27f100eaa1ef4d9172ca34b345` — docs: orchestratore — riconciliazione finito sessione (real_task_commit `53328eff2dbb0261cf40ae9f400cf0b9d1a5934f`)
* `e3eb3fb3fee12e987b98b318ce9251492c6c6f10` — docs: orchestratore — autosync overlay stack FIX4 review pending (real_task_commit `a667f7455ca0cdf73e56ea5944832011639e32e4`)
* `c71d15c36d67dd087da45a4646020ff8a047425d` — docs: orchestratore — autosync overlay stack FIX3 review pending (real_task_commit `261fcdf937de25eb9fcc376b37c4d1de4eb231c0`)
* `5356700` — feat(carto): expand IGM series index (CARTO-IGM-SERIES-EXPAND-A)
* `a667f74` — fix(map): use native Strava tile size for overzoom (FIX4)

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Deploy e QA runtime non eseguiti.
* Review GPT-sostitutiva obbligatoria prima del deploy.
* OM/roadmap non chiusi in questo giro (solo implementazione + autosync).
