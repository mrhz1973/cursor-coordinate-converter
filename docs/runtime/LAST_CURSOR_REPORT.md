# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `5b4e4119da8e08f096cc1dec97baf3aedd683a46`
* real_task_subject: docs: open transparent overlay stack after provider discovery
* report_generated_at: 2026-08-07T15:55:00+02:00
* branch: main
* remote_head_after_task_push: `5b4e4119da8e08f096cc1dec97baf3aedd683a46`
* previous_report_container: `d5ce8fe` (autosync backlog waypoint center overlays)
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: docs task `5b4e411` pushato; monolite tip `a0a6816` invariato
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); task docs `5b4e411` già su origin pre-autosync
* result_cursor: DOCS-MAP-TRANSPARENT-OVERLAY-STACK-A-OPEN CLOSED / PASS docs-only
* pass_operatore: non applicabile (docs-only; nessun QA runtime)
* result_runtime: tip live invariato `a0a6816` / COORD-MODAL-FORMAT-COPY-A-FIX1 · build 138
* qa_attestation_source: n/a (docs-only)
* notes: overlay promosso OPEN/READY; diagnostic+scope+proxy registrati; WU-0012 sospesa; target GIS build 139; monolite escluso

## OUTPUT VERBATIM

```text
real_task_commit (docs-only):
5b4e4119da8e08f096cc1dec97baf3aedd683a46

git branch --show-current
main

git log --oneline -5 (post-task, pre-autosync):
5b4e411 docs: open transparent overlay stack after provider discovery
d5ce8fe docs: orchestratore — autosync backlog waypoint center overlays
77bceb1 docs: backlog waypoint center and transparent overlay stack
c702d89 docs: orchestratore — riconciliazione finito sessione
a7dc659 docs: finito COORD-MODAL-FORMAT-COPY-A-FIX1 after Regola H QA PASS

git rev-parse HEAD (post-task, pre-autosync):
5b4e4119da8e08f096cc1dec97baf3aedd683a46

git ls-remote origin refs/heads/main (post-task, pre-autosync):
5b4e4119da8e08f096cc1dec97baf3aedd683a46	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* d5ce8fe — docs: orchestratore — autosync backlog waypoint center overlays (real_task_commit storico `77bceb1`)
* 77bceb1 — docs: backlog waypoint center and transparent overlay stack
* c702d89 — docs: orchestratore — riconciliazione finito sessione (COORD-FIX1; real_task_commit storico `a0a6816`)
* a7dc659 — docs: finito COORD-MODAL-FORMAT-COPY-A-FIX1 after Regola H QA PASS
* 5b4e411 — docs: open transparent overlay stack after provider discovery (docs-only corrente)

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
* Non prova il proprio HEAD finale — verifica esterna obbligatoria.
