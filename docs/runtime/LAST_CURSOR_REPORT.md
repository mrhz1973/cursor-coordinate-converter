# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `db2d4303104c66cc23424d6d0440d07557769bfb`
* real_task_subject: docs(carto): record IGM CRS audit outcome
* report_generated_at: 2026-08-06T11:55:00Z
* branch: main
* remote_head_after_task_push: `db2d4303104c66cc23424d6d0440d07557769bfb`
* previous_report_container: `a536e42` (autosync DOCS-BACKLOG-CARTO-COORD-CRS-A)
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: task docs `db2d430` pushato; monolite tip `51e0f5b` invariato
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); task `db2d430` pushato pre-autosync
* result_cursor: DOCS-CARTO-IGM-CRS-AUDIT-A-CLOSE CLOSED / PASS docs-only; CRS AUDIT PARTIAL; ARCHIVE-MATCH PASS WITH DOCUMENTED LIMITATIONS (non aperto)
* pass_operatore: non applicabile (docs-only)
* result_runtime: tip live invariato `51e0f5b` / CARTO-IGM-RESULTS-UX-BUNDLE-B-FIX3 · build 132
* qa_attestation_source: n/a docs-only
* notes: due commit previsti (task + autosync); monolite escluso; nessun deploy

## OUTPUT VERBATIM

```text
real_task_commit:
db2d4303104c66cc23424d6d0440d07557769bfb

runtime tip (live, invariato):
51e0f5b7e0b6975e745de0de5c5461f72c9446d6

git branch --show-current
main

git log --oneline -5 (post-task, pre-autosync):
db2d430 docs(carto): record IGM CRS audit outcome
a536e42 docs: orchestratore — autosync DOCS-BACKLOG-CARTO-COORD-CRS-A
f0a68b3 docs(backlog): register coordinate and IGM CRS follow-ups
4e68ebe docs: orchestratore — riconciliazione finito sessione
c79e9d2 docs: finito CARTO-IGM-RESULTS-UX-BUNDLE-B after Regola H QA PASS

git rev-parse HEAD (post-task, pre-autosync):
db2d4303104c66cc23424d6d0440d07557769bfb

git ls-remote origin refs/heads/main (post-task, pre-autosync):
db2d4303104c66cc23424d6d0440d07557769bfb	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* a536e42 — docs: orchestratore — autosync DOCS-BACKLOG-CARTO-COORD-CRS-A (real_task_commit storico `f0a68b3`)
* f0a68b3 — docs(backlog): register coordinate and IGM CRS follow-ups
* 4e68ebe — docs: orchestratore — riconciliazione finito sessione (BUNDLE-B FIX3)
* c79e9d2 — docs: finito CARTO-IGM-RESULTS-UX-BUNDLE-B after Regola H QA PASS
* 51e0f5b — fix(carto): remove IGM label double-click navigation (runtime tip live)

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
* Non prova il proprio HEAD finale — verifica esterna obbligatoria.
