# LAST_CURSOR_REPORT

> Evidenza rolling post-push — **non** fonte viva primaria. Read-set: OM §7, roadmap, latest/inbox.

## LATEST

* real_task_commit: `47b0016`
* real_task_subject: Fase F2 collaudo LAST_CURSOR_REPORT su commit docs innocuo
* report_generated_at: 2026-06-16T01:25:30+02:00
* branch: main
* remote_hash_authority: git ls-remote origin main
* local_HEAD: `47b0016feecc8cfc134413902bf74f5edf96724a`
* local_origin_main: `47b0016feecc8cfc134413902bf74f5edf96724a`
* ls_remote_origin_main: `47b0016feecc8cfc134413902bf74f5edf96724a`
* working_tree_status: pulito (pre-commit autosync/report)
* pass_tecnico_remoto: PASS
* result_cursor: HEAD = origin/main = ls-remote post-push commit principale F2; branch main
* pass_operatore: non-attestato
* result_runtime: non eseguito / non applicabile (F2 docs-only)
* qa_attestation_source: non attestata
* notes: Collaudo F2 — primo report vivo; commit principale = task roadmap innocuo; questo file nel commit autosync/report; nessuna patch runtime
* pending_self_reference: commit autosync/report che include questo file = PENDING_SELF_REFERENCE (SHA autosync non va in real_task_commit; backfill opzionale in HISTORY al report successivo; nessun terzo commit finalize-hash)

<!-- pass_* = esito sintetico: PASS / FAIL / non-attestato. result_* = descrizione o evidenza sintetica. -->

## OUTPUT VERBATIM

```text
git log --oneline -5
47b0016 docs: validate LAST_CURSOR_REPORT flow for method Fase F2
93bcf25 docs: orchestratore — riconciliazione Fase F1 LAST_CURSOR_REPORT
5c59346 docs: add LAST_CURSOR_REPORT spec and template for method Fase F1
906418f docs: orchestratore — riconciliazione finito sessione
41411ec docs: add legacy checkpoint/session governance for method Fase E

git status --short
(vuoto)

git rev-parse HEAD
47b0016feecc8cfc134413902bf74f5edf96724a

git rev-parse origin/main
47b0016feecc8cfc134413902bf74f5edf96724a

git branch --show-current
main

git show --stat HEAD
commit 47b0016feecc8cfc134413902bf74f5edf96724a
 docs/work-units/WU-0005-0009-roadmap.md | 9 ++++++++-
 1 file changed, 8 insertions(+), 1 deletion(-)

git ls-remote origin main
47b0016feecc8cfc134413902bf74f5edf96724a	refs/heads/main
```

## HISTORY

<!--
Nessuna entry precedente (primo report vivo F2).
Entry F1 spec/template: commit principale 5c59346, autosync 93bcf25 — non duplicata qui; backfill futuro se verificabile.
-->

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
