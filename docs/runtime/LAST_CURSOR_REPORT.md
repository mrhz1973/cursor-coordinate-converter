# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `cb2a38b447f27c2e93b1c9c01ddd38785d31393b`
* real_task_subject: fix(carto): eliminate startup flash and top-align IGM panel
* report_generated_at: 2026-08-11T00:33:00+02:00
* branch: main
* remote_head_after_task_push: `cb2a38b447f27c2e93b1c9c01ddd38785d31393b`
* previous_report_container: `f35075be550d3b77100488174be26f63a7a6b3cd`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: task runtime `cb2a38b` pushato; docs autosync in preparazione; monolite escluso dall'autosync
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); task `cb2a38b` già su origin pre-autosync
* result_cursor: CARTO-IGM-SERIES-EXPAND-A-UX3-FIX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED
* pass_operatore: NOT EXECUTED
* result_runtime: build 149; gis-boot pre-paint; IGM top = header.bottom+10; height 0.78/720; payload 8204 invariato
* qa_attestation_source: n/a
* notes: solo first-paint + top pannello IGM; Objects GIS FROZEN; dataset/payload invariati

## OUTPUT VERBATIM

```text
real_task_commit:
cb2a38b447f27c2e93b1c9c01ddd38785d31393b

monolite blob:
d43ae6e083322647e7604b463144c94ab5c83862

git branch --show-current
main

git log --oneline -5 (post-task, pre-autosync):
cb2a38b fix(carto): eliminate startup flash and top-align IGM panel
f35075b docs: orchestratore — autosync CARTO-IGM-SERIES-EXPAND-A-UX3-FIX1 review pending
02c7b99 fix(carto): clear stale IGM results with no active series
ed9ffd8 docs: orchestratore — autosync CARTO-IGM-SERIES-EXPAND-A-UX3 review pending
9588e6c fix(carto): streamline IGM filters and panel opening

git rev-parse HEAD (post-task, pre-autosync):
cb2a38b447f27c2e93b1c9c01ddd38785d31393b

git ls-remote origin refs/heads/main (post-task, pre-autosync):
cb2a38b447f27c2e93b1c9c01ddd38785d31393b	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* `f35075be550d3b77100488174be26f63a7a6b3cd` — docs: orchestratore — autosync CARTO-IGM-SERIES-EXPAND-A-UX3-FIX1 review pending (real_task_commit `02c7b99bd282df4723ecd879b75c655874327dc1`)
* `ed9ffd8757c15cafd1861c4978c01422f6022409` — docs: orchestratore — autosync CARTO-IGM-SERIES-EXPAND-A-UX3 review pending (real_task_commit `9588e6cdeca743afed3dad0358984a5af637e9a1`)
* `cb2a38b` — fix(carto): eliminate startup flash and top-align IGM panel (CARTO-IGM-SERIES-EXPAND-A-UX3-FIX2)
* `02c7b99` — fix(carto): clear stale IGM results with no active series (CARTO-IGM-SERIES-EXPAND-A-UX3-FIX1)

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Deploy e QA runtime FIX2 non eseguiti (hard reload browser = pending operatore post-deploy).
* Review GPT-sostitutiva obbligatoria prima del deploy.
