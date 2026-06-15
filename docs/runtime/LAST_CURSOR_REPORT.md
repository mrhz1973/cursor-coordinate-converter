# LAST_CURSOR_REPORT

> Evidenza rolling post-push — **non** fonte viva primaria. Read-set: OM §7, roadmap, latest/inbox.

## LATEST

* real_task_commit: `d69b100`
* real_task_subject: Fase F3 attivazione obbligo LAST_CURSOR_REPORT GIS-only
* report_generated_at: 2026-06-16T01:51:30+02:00
* branch: main
* remote_hash_authority: git ls-remote origin main
* local_HEAD: `d69b100d8efefede0e4d82b318348a0386172f7c`
* local_origin_main: `d69b100d8efefede0e4d82b318348a0386172f7c`
* ls_remote_origin_main: `d69b100d8efefede0e4d82b318348a0386172f7c`
* working_tree_status: pulito (pre-commit autosync/report F3)
* pass_tecnico_remoto: PASS
* result_cursor: HEAD = origin/main = ls-remote post-push commit principale F3; branch main
* pass_operatore: non-attestato
* result_runtime: non eseguito / non applicabile (F3 docs/governance)
* qa_attestation_source: non attestata
* notes: Fase F3 — obbligo LAST_CURSOR_REPORT attivo GIS-only; tensione aggio scope risolta; fail-closed soft; nessuna patch runtime
* pending_self_reference: commit autosync/report F3 che include questo file = PENDING_SELF_REFERENCE (SHA autosync non va in real_task_commit; backfill in HISTORY al report successivo; nessun terzo commit finalize-hash)

<!-- pass_* = esito sintetico: PASS / FAIL / non-attestato. result_* = descrizione o evidenza sintetica. -->

## OUTPUT VERBATIM

```text
git log --oneline -5
d69b100 docs: activate LAST_CURSOR_REPORT requirement for method Fase F3
ec60d47 docs: orchestratore — riconciliazione Fase F2 LAST_CURSOR_REPORT
47b0016 docs: validate LAST_CURSOR_REPORT flow for method Fase F2
93bcf25 docs: orchestratore — riconciliazione Fase F1 LAST_CURSOR_REPORT
5c59346 docs: add LAST_CURSOR_REPORT spec and template for method Fase F1

git status --short
(vuoto)

git rev-parse HEAD
d69b100d8efefede0e4d82b318348a0386172f7c

git rev-parse origin/main
d69b100d8efefede0e4d82b318348a0386172f7c

git branch --show-current
main

git show --stat HEAD
commit d69b100d8efefede0e4d82b318348a0386172f7c
 .cursor/rules/30-output-workflow.mdc    | 47 ++++++++++++++++++++++++---------
 docs/OPERATING_MEMORY.md                |  3 ++-
 docs/work-units/WU-0005-0009-roadmap.md | 25 +++++++++++++-----
 3 files changed, 56 insertions(+), 19 deletions(-)

git ls-remote origin main
d69b100d8efefede0e4d82b318348a0386172f7c	refs/heads/main
```

## HISTORY

### Fase F2 — collaudo LAST_CURSOR_REPORT (archiviato da F3)

* real_task_commit: `47b0016`
* report_autosync_commit: `ec60d47` *(backfill F3 — risolve pending_self_reference F2)*
* real_task_subject: Fase F2 collaudo LAST_CURSOR_REPORT su commit docs innocuo
* report_generated_at: 2026-06-16T01:25:30+02:00
* pass_tecnico_remoto: PASS
* pass_operatore: non-attestato
* result_runtime: non eseguito / non applicabile (F2 docs-only)
* pending_self_reference: **risolto** — autosync/report F2 = `ec60d47`

<!--
Fase F1 spec/template: commit principale 5c59346, autosync 93bcf25 — non duplicata; backfill futuro se necessario.
-->

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
