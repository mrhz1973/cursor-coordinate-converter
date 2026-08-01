# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `d0688ea44513501cae766f79d1538934729234e3`
* real_task_subject: fix(map): normalize viewport occluder edge selection
* report_generated_at: 2026-08-01T14:53:00Z
* branch: main
* remote_head_after_task_push: `d0688ea44513501cae766f79d1538934729234e3` (runtime tip); docs finito pre-autosync `b77d643322f0f40fc553b43505a8b4a342fa99e6`
* previous_report_container: `88d47db` (autosync finito TRACK-PROFILE / riconciliazione — esterno/verificabile via history)
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: docs finito `b77d643` pushato; monolite tip `d0688ea` escluso da docs/autosync
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); runtime `d0688ea` + docs `b77d643` pushati pre-autosync
* result_cursor: MAP-CENTER-VIEWPORT-AWARE-A (+ FIX1–FIX3) CLOSED / PASS end-to-end in OM/HANDOFF/WU-0010/roadmap/QA-CHECKLIST; finito Regola H
* pass_operatore: PASS — attestazione esplicita «QA MAP-CENTER-VIEWPORT-AWARE-A-FIX3 PASS operatore» (2026-08-01)
* result_runtime: tip `d0688ea` / B6.2MCV-A-FIX3 · build 93; blob `55d414bca54b7e8e18a487c74ef28e58301f2ce7`; byte LF 3149321; SHA-256 LF `0c23594cd87bd7ce06ceaa271b22e238b40b643c2cb235f20c84bd45bf308a24`
* qa_attestation_source: operatore
* notes: DELICATO leggero; review FIX3 PASS; deploy GIS-only PASS; backlog residuo PROFILE-EDIT / QA-IT-ONLY; TPD CLOSED tip storico `3838e9e`

## OUTPUT VERBATIM

```text
real_task_commit (runtime tip):
d0688ea44513501cae766f79d1538934729234e3

docs finito (pre-autosync):
b77d643322f0f40fc553b43505a8b4a342fa99e6

git rev-parse HEAD:"coordinate_converter Claude.html"
55d414bca54b7e8e18a487c74ef28e58301f2ce7

git branch --show-current
main

git ls-remote origin refs/heads/main (post-docs, pre-autosync):
b77d643322f0f40fc553b43505a8b4a342fa99e6	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* 88d47db — autosync / riconciliazione finito TRACK-PROFILE-POINTS-DISPLAY-A; real_task_commit storico `3838e9e`
* 62808f4 — autosync / riconciliazione finito APP-BUILD-LABEL-UX-A-FIX1; real_task_commit storico `da3397b`
* 4314f03 — docs: finito APP-BUILD-LABEL-UX-A-FIX1 after Regola H QA PASS
* da3397b — APP-BUILD-LABEL-UX-A-FIX1 runtime tip storico (build 88)
* 2484e8d — docs: plan TRACK-PROFILE-POINTS-DISPLAY-A
* 3838e9e — TRACK-PROFILE-POINTS-DISPLAY-A runtime tip (build 89)
* cb4e4a2 — docs: finito TRACK-PROFILE-POINTS-DISPLAY-A after Regola H QA PASS
* 5b5e052 — MAP-CENTER-VIEWPORT-AWARE-A runtime tip iniziale (build 90)
* 1a7c98c — MAP-CENTER FIX1 (build 91)
* a640ca2 — MAP-CENTER FIX2 (build 92)
* d0688ea — MAP-CENTER FIX3 runtime tip (build 93)
* b77d643 — docs: finito MAP-CENTER-VIEWPORT-AWARE-A-FIX3 after Regola H QA PASS
* 24787f6 — autosync backlog APP-BUILD-LABEL-UX-A; real_task_commit storico `acb4539`

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
* Non prova il proprio HEAD finale — verifica esterna obbligatoria.
