# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `02c7b99bd282df4723ecd879b75c655874327dc1`
* real_task_subject: fix(carto): clear stale IGM results with no active series
* report_generated_at: 2026-08-11T00:03:00+02:00
* branch: main
* remote_head_after_task_push: `02c7b99bd282df4723ecd879b75c655874327dc1`
* previous_report_container: `ed9ffd8757c15cafd1861c4978c01422f6022409`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: task runtime `02c7b99` pushato; docs autosync in preparazione; monolite escluso dall'autosync
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); task `02c7b99` già su origin pre-autosync
* result_cursor: CARTO-IGM-SERIES-EXPAND-A-UX3-FIX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED
* pass_operatore: NOT EXECUTED
* result_runtime: build 148; zero-serie clears results/overlay; query/area preservati; payload 8204 invariato
* qa_attestation_source: n/a
* notes: solo ramo onFilter zero-serie; Objects GIS FROZEN; dataset/payload invariati

## OUTPUT VERBATIM

```text
real_task_commit:
02c7b99bd282df4723ecd879b75c655874327dc1

monolite blob:
6830e583459d420ee6101bc875a2db3aacabdb3e

git branch --show-current
main

git log --oneline -5 (post-task, pre-autosync):
02c7b99 fix(carto): clear stale IGM results with no active series
ed9ffd8 docs: orchestratore — autosync CARTO-IGM-SERIES-EXPAND-A-UX3 review pending
9588e6c fix(carto): streamline IGM filters and panel opening
3eac57b docs: orchestratore — autosync CARTO-IGM-SERIES-EXPAND-A-UX2 review pending
ebc6752 fix(carto): improve IGM label contrast on light basemaps

git rev-parse HEAD (post-task, pre-autosync):
02c7b99bd282df4723ecd879b75c655874327dc1

git ls-remote origin refs/heads/main (post-task, pre-autosync):
02c7b99bd282df4723ecd879b75c655874327dc1	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* `ed9ffd8757c15cafd1861c4978c01422f6022409` — docs: orchestratore — autosync CARTO-IGM-SERIES-EXPAND-A-UX3 review pending (real_task_commit `9588e6cdeca743afed3dad0358984a5af637e9a1`)
* `3eac57ba68527cd91ec4a8eb581b0ecc7f1d6c70` — docs: orchestratore — autosync CARTO-IGM-SERIES-EXPAND-A-UX2 review pending (real_task_commit `ebc6752ae880d74282425e4a19483eede9f97dca`)
* `b08d7c45a9fc8b428a9abf10894dcfc1ddf04ed7` — docs: orchestratore — autosync CARTO-IGM-SERIES-EXPAND-A-UX1 review pending (real_task_commit `1482f16c570f7d5c5f2b64af873ac673b5ad38e6`)
* `02c7b99` — fix(carto): clear stale IGM results with no active series (CARTO-IGM-SERIES-EXPAND-A-UX3-FIX1)
* `9588e6c` — fix(carto): streamline IGM filters and panel opening (CARTO-IGM-SERIES-EXPAND-A-UX3)

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Deploy e QA runtime FIX1 non eseguiti.
* Review GPT-sostitutiva obbligatoria prima del deploy.
