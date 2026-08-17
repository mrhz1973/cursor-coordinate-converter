# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `7fb0c202378966a412e454459f2fdf278e14ccee` — `feat(dock): G-D-BATCH1 dual-side header dock and +N overflow` (candidate immutabile — questo pass è docs-only deploy/ABQA, nessun runtime commit)
* real_task_subject: feat(dock): G-D-BATCH1 dual-side header dock and +N overflow
* report_generated_at: 2026-08-17T13:43:00+02:00
* branch: main
* remote_head_after_task_push: `956efa7c89670115f1a31c13e8e256d7f89b5a0f` (pre-autosync deploy+ABQA docs)
* previous_report_container: `956efa7c89670115f1a31c13e8e256d7f89b5a0f`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: monolite invariato; solo docs orchestratore deploy/ABQA
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente)
* result_cursor: deploy GIS-only PASS + ABQA 32/32 PASS (selftest 564/564) su LIVE `7fb0c20` / 213
* pass_operatore: non attestato
* result_runtime: LIVE = CANDIDATE `7fb0c20` / 213 blob `bbc9a5c8…`; helper 0.1.3; GIS PID `2746464`
* qa_attestation_source: none (gate QA FINALE CHATGPT — PENDING)
* notes: no patch/no bump; F NOT OPENED; Oggetti GIS FROZEN/UNTOUCHED; WU-0012 invariata; no finito; no QA human cases

## OUTPUT VERBATIM

```text
candidate/LIVE 7fb0c202378966a412e454459f2fdf278e14ccee
blob bbc9a5c88888b9d0a79fcef2374a252aaf9893b7
build 213 GIS-PANEL-DOCK-MGR-G-D-BATCH1
deploy GIS-only PASS (VPS FF 6464345..956efa7, GIS PID 2738253->2746464, proxy/GH invariati)
ABQA 32/32 PASS selftest 564/564
URL http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7fb0c20
NO QA OPERATORE / NO FINITO
```

PASS remoto container corrente: **EXTERNAL_ONLY**.

## HISTORY

* G-D-BATCH1 deploy GIS-only + ABQA PASS — questo LATEST
* previous container `956efa7c89670115f1a31c13e8e256d7f89b5a0f`: docs G-D-BATCH1 REVIEW-EVIDENCE-B verify-only PASS; real_task_commit runtime `7fb0c20` / 213
* previous container `60cb7d2dab2baf255f8c6b33ec8d8b0d1b86e499`: docs G-D-BATCH1 evidence + REVIEW PENDING; real_task_commit runtime `7fb0c20` / 213
* previous container `b2eafd0101f8208a9e8ecba46c5aaff939616aca`: docs orchestratore — riconciliazione finito sessione; real_task_commit `ae076a8` (G-BC-BATCH1 CLOSED/PASS)
* previous container `ef6370cb0236a9b487309d6997db4d89c206c368`: docs(WU-0021): G-BC-BATCH1 deploy + ABQA PASS → QA FINALE PENDING; real_task_commit runtime `7e984df`; ABQA 78/78
* G-BC-BATCH1 runtime candidate `7e984df` / 212

## LIMITI

* Gate QA FINALE CHATGPT — PENDING; QA umana a ChatGPT; Cursor non emette casi
* F NOT OPENED
* Helper 0.1.3 invariato
* Container autosync corrente = PENDING_SELF_REFERENCE
