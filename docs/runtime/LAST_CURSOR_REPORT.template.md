# LAST_CURSOR_REPORT template

> **Fase F1 — spec preparatoria.** Copiare/istanziare come `LAST_CURSOR_REPORT.md` solo da Fase F2 (collaudo). Non fonte viva primaria.
>
> **Home canonica dettagliata:** `.cursor/rules/30-output-workflow.mdc` (sezione LAST_CURSOR_REPORT Fase F3).

## LATEST

* real_task_commit: `<SHA commit task principale — anchor stabile>`
* real_task_subject:
* report_generated_at:
* branch:
* remote_head_after_task_push: `<SHA remoto verificato dopo push del task, prima del commit report>`
* previous_report_container: `<SHA container autosync/report precedente, solo se già pubblicato e verificabile; altrimenti omettere>`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status:
* pass_tecnico_remoto: `<non attestare PASS del container corrente nel file — verifica esterna post-push>`
* result_cursor:
* pass_operatore:
* result_runtime:
* qa_attestation_source:
* notes:

<!-- pass_* = esito sintetico: PASS / FAIL / non-attestato / EXTERNAL_ONLY. result_* = descrizione o evidenza sintetica. -->

### Nota operativa — container e self-reference

- **`real_task_commit`** è l’anchor stabile: **non** sostituirlo con autosync, HEAD finale o blob SHA del report.
- **`current_report_container`** resta **`PENDING_SELF_REFERENCE`** nel commit che contiene questo file — **non** sostituirlo nel commit corrente.
- **Non** amendare il commit autosync/report per inserire il proprio SHA.
- **Non** creare commit finalize-hash né terzo commit dedicato al backfill del container corrente.
- Il **HEAD finale** post-push del container corrente va attestato nel **report Cursor esterno** e nel **seed handoff** (Regola F) — non nel file come fatto già verificato.
- Un container precedente può essere backfillato in **HISTORY** soltanto da un report **successivo**, quando è esterno e verificabile.

## OUTPUT VERBATIM

```text
# Solo output effettivamente disponibile e verificabile PRIMA del commit container corrente.
# Può includere: commit task, remote HEAD post-task-push, pre-flight follow-up, container precedenti esterni.
# NON includere: SHA del commit report corrente non ancora creato; futuro HEAD post-push del report.

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
git ls-remote origin main
...
```

PASS remoto del container corrente: **EXTERNAL_ONLY** — verificare post-push con `git ls-remote origin main` e seed Regola F.

## HISTORY

<!--
Le entry precedenti confluiscono qui.
Quando una nuova entry LATEST sostituisce la precedente, i container con PENDING_SELF_REFERENCE risolti possono essere backfillati qui — solo se già pubblicati e verificabili dall'esterno.
Non creare commit dedicati solo per finalize-hash.
Non modificare retroattivamente commit container precedenti.
-->

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
* Non prova il proprio HEAD finale — verifica esterna obbligatoria.
* In Fase F1 è solo template/spec, non report vivo.
