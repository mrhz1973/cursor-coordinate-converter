# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `b2d828f63091b2d0bb9373fe3c4e447b75de01d7`
* real_task_subject: feat: WU-0007 B6.7a Range Rings showTitle e sezione Stili comprimibile
* report_generated_at: 2026-06-22T18:28:00+02:00
* branch: main
* remote_head_after_task_push: `b2d828f63091b2d0bb9373fe3c4e447b75de01d7` (verificato post push commit task)
* previous_report_container: `dba24e9` (container autosync B5.5Z-BUILD PASS operatore docs — storico verificabile)
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: clean (pre-autosync)
* pass_tecnico_remoto: non attestato nel file per container corrente — verifica esterna post-push
* result_cursor: B6.7a implementato — showTitle, details Stili, node --check OK; monolite incluso nel commit task
* pass_operatore: non attestato
* result_runtime: QA operatore B6.7a pending
* qa_attestation_source: —
* notes: B6.7b non implementato; APP_BUILD_ID B5.5Z invariato; PENDING_SELF_REFERENCE per design F3

## OUTPUT VERBATIM

```text
# Stato verificato PRIMA del commit container corrente (pre-autosync finito B6.7a)

git log --oneline -5
b2d828f feat: WU-0007 B6.7a Range Rings showTitle e sezione Stili comprimibile
46aeace docs: orchestratore — riconciliazione finito sessione WU-0007 T1 PASS
a716ae7 docs: chiudi WU-0007 T1 end-to-end — PASS operatore
d533e8b docs: orchestratore — riconciliazione finito sessione WU-0007 T1
002624e feat: WU-0007 T1 — unità distanza/velocità persistenti nella modal Traccia

git status --short
(vuoto)

git rev-parse HEAD
b2d828f63091b2d0bb9373fe3c4e447b75de01d7

git rev-parse origin/main
b2d828f63091b2d0bb9373fe3c4e447b75de01d7

git branch --show-current
main

git ls-remote origin main
b2d828f63091b2d0bb9373fe3c4e447b75de01d7	refs/heads/main

git push (task)
46aeace..b2d828f main -> main
```

PASS remoto del container corrente: **EXTERNAL_ONLY** — verificare post-push con `git ls-remote origin main` e seed Regola F nel report Cursor esterno.

## HISTORY

* eeb923a — B5.5Z-BUILD PASS operatore docs finito (container storico)
* 053ac18 — B5.5Z-BUILD label finito autosync
* dba24e9 — B5.5Z-BUILD closure autosync

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
* Non prova il proprio HEAD finale — verifica esterna obbligatoria.
