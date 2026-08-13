# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `fb773c94088d7dbe6c672a104f1fdcb797ca6a6e` — verify short `fb773c9`
* real_task_subject: fix(dflight): FIX5 selftest legend pure/static — no live DOM side-effects
* report_generated_at: 2026-08-13T13:30:00+02:00
* branch: main
* remote_head_after_task_push: `a61c9aa99a3b14c50ee6f10a83f067cd6f6d6f28` (tip docs; monolite = candidate)
* previous_report_container: `a61c9aa99a3b14c50ee6f10a83f067cd6f6d6f28`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: solo autosync memoria in questo commit
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); deploy VPS verificato su tip `a61c9aa` pre-autosync
* result_cursor: Deploy GIS-only PASS; Automated Browser QA targeted PASS (A/B/C + smoke D2/D3/D4 + E) — QA OPERATORE REQUIRED
* pass_operatore: non-attestato — **non** inferito
* result_runtime: live build 176 / FIX5 su VPS `a61c9aa` (blob monolite = `fb773c9`)
* qa_attestation_source: Automated Browser QA Cursor (Caso 5 isolation + smoke); no QA operatore
* notes: helper PID 2645184 invariato; F session reset PREEXISTING; no patch; no finito

## OUTPUT VERBATIM

```text
candidate fb773c94088d7dbe6c672a104f1fdcb797ca6a6e
deployed_tip a61c9aa99a3b14c50ee6f10a83f067cd6f6d6f28
VPS_PRE 1be9359e1775bdb8b4f49a6729d138db59711df6
VPS_POST a61c9aa99a3b14c50ee6f10a83f067cd6f6d6f28
HTTP 200 bytes 10036257 sha256 babde9d2c54ee028b077ea8fc1a69f312686ead31242b658a376f677a2d3a621 CMP_PASS=yes
helper 0.1.3 pid 2645184 unchanged
caseA PASS 165/165 zero-net
caseB PASS legend open preserved zero-net
caseC PASS legend closed
smoke D2/D3/D4/native PASS
caseE reopen loadCalls=0 PASS
F_session_reset PREEXISTING/OUT_OF_SCOPE
GATE: DEPLOYED — AUTOMATED BROWSER QA PASS — QA OPERATORE REQUIRED
```

PASS remoto container corrente: **EXTERNAL_ONLY**.

## HISTORY

* `a61c9aa99a3b14c50ee6f10a83f067cd6f6d6f28` — docs: orchestratore — D-FLIGHT-H-AUTOLOAD-UX-A-FIX5 pre-review
* `fb773c94088d7dbe6c672a104f1fdcb797ca6a6e` — fix(dflight): FIX5 selftest legend pure/static
* `34ffec2534d1e741bde268a8786cae9a2c74de06` — docs: FIX4 deploy + Automated Browser QA FAIL Caso 5

## LIMITI

* QA operatore non eseguita / non attestata.
* NO finito.
* SHA autosync corrente = EXTERNAL_ONLY.
