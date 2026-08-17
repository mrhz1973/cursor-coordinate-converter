# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `7fb0c202378966a412e454459f2fdf278e14ccee` — `feat(dock): G-D-BATCH1 dual-side header dock and +N overflow` (candidate immutabile — REVIEW-EVIDENCE-B è verify-only, nessun runtime commit)
* real_task_subject: feat(dock): G-D-BATCH1 dual-side header dock and +N overflow
* report_generated_at: 2026-08-17T12:15:00+02:00
* branch: main
* remote_head_after_task_push: `60cb7d2dab2baf255f8c6b33ec8d8b0d1b86e499` (pre-autosync verify-only)
* previous_report_container: `60cb7d2dab2baf255f8c6b33ec8d8b0d1b86e499`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: monolite invariato; solo docs evidence
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente)
* result_cursor: REVIEW-EVIDENCE-B verify-only A/B/C/D **PASS** su `7fb0c20` / 213 immutabile
* pass_operatore: non attestato
* result_runtime: LIVE invariato `7e984df` / 212; CANDIDATE `7fb0c20` / 213 blob `bbc9a5c8…` invariato
* qa_attestation_source: none (gate REVIEW GPT-SOSTITUTIVA — PENDING)
* notes: no patch/no bump/no deploy; F NOT OPENED; Oggetti GIS FROZEN/UNTOUCHED; WU-0012 invariata

## OUTPUT VERBATIM

```text
candidate 7fb0c202378966a412e454459f2fdf278e14ccee (immutable)
blob bbc9a5c88888b9d0a79fcef2374a252aaf9893b7 (pre == post test)
A left-slot restore PASS (click reale, 4R+1L, n 5->4, no ghost, right stable)
B +N restore PASS (mouse, Altri 9 -> Altri 8, n 11->10)
C keyboard PASS (Enter open + item focus + Enter restore, n 9->8, Altri 7 -> Altri 6)
D regression PASS (4->5 stable, resize no dup, pair spy 0, workbench untouched, selftest 564/564)
NO DEPLOY / NO QA OPERATORE / NO FINITO
```

PASS remoto container corrente: **EXTERNAL_ONLY**.

## HISTORY

* G-D-BATCH1 REVIEW-EVIDENCE-B verify-only PASS — questo LATEST
* previous container `60cb7d2dab2baf255f8c6b33ec8d8b0d1b86e499`: docs G-D-BATCH1 evidence + REVIEW PENDING; real_task_commit runtime `7fb0c20` / 213
* previous container `b2eafd0101f8208a9e8ecba46c5aaff939616aca`: docs orchestratore — riconciliazione finito sessione; real_task_commit `ae076a8` (G-BC-BATCH1 CLOSED/PASS)
* previous container `ef6370cb0236a9b487309d6997db4d89c206c368`: docs(WU-0021): G-BC-BATCH1 deploy + ABQA PASS → QA FINALE PENDING; real_task_commit runtime `7e984df`; ABQA 78/78
* G-BC-BATCH1 runtime candidate `7e984df` / 212

## LIMITI

* Gate REVIEW GPT-SOSTITUTIVA — PENDING; verdetto a ChatGPT
* F NOT OPENED
* Helper 0.1.3 invariato
* Container autosync corrente = PENDING_SELF_REFERENCE
