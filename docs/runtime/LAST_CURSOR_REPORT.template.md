# LAST_CURSOR_REPORT template

> **Fase F1 — spec preparatoria.** Copiare/istanziare come `LAST_CURSOR_REPORT.md` solo da Fase F2 (collaudo). Non fonte viva primaria.

## LATEST

* real_task_commit:
* real_task_subject:
* report_generated_at:
* branch:
* remote_hash_authority:
* local_HEAD:
* local_origin_main:
* ls_remote_origin_main:
* working_tree_status:
* pass_tecnico_remoto:
* result_cursor:
* pass_operatore:
* result_runtime:
* qa_attestation_source:
* notes:
* pending_self_reference:

<!-- pass_* = esito sintetico: PASS / FAIL / non-attestato. result_* = descrizione o evidenza sintetica. -->

## OUTPUT VERBATIM

```text
git log --oneline -5
...
git status --short
...
git rev-parse HEAD
...
git rev-parse origin/main
...
git branch --show-current
...
git show --stat HEAD
...
git ls-remote origin main
...
```

## HISTORY

<!--
Le entry precedenti confluiscono qui.
Quando una nuova entry LATEST sostituisce la precedente, i campi auto-referenziali rimasti PENDING_SELF_REFERENCE possono essere backfillati qui se verificabili.
Non creare commit dedicati solo per finalize-hash.
-->

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
* In Fase F1 è solo template/spec, non report vivo.
