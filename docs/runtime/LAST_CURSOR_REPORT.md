# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `2072b7acd1fa57c2e1058b4fce15db000f86937f`
* real_task_subject: docs: route operator QA through ChatGPT three-line format
* report_generated_at: 2026-08-02T08:35:00Z
* branch: main
* remote_head_after_task_push: `2072b7acd1fa57c2e1058b4fce15db000f86937f` (docs task pre-autosync); runtime tip invariato `1f7c05f`
* previous_report_container: `8d48f62` (autosync finito MULTIROW-A — esterno/verificabile)
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: docs task `2072b7a` pushato; monolite tip `1f7c05f` escluso
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); docs `2072b7a` pushato pre-autosync
* result_cursor: QA-CHATGPT-3LINE-HANDOFF-PREF CLOSED / PASS docs-only; Regola D2 in OM §4
* pass_operatore: N/A — docs-only (nessuna QA runtime richiesta)
* result_runtime: invariato tip `1f7c05f` / B6.5RGM-A-FIX2 · build 101
* qa_attestation_source: N/A (docs-only)
* notes: nessun deploy; Bundle F non aperto; Oggetti GIS FROZEN; nessun candidato runtime auto-aperto

## OUTPUT VERBATIM

```text
real_task_commit (docs-only):
2072b7acd1fa57c2e1058b4fce15db000f86937f

runtime tip (invariato):
1f7c05f2186be5759d3e0e34a69d88564a0d8690

git branch --show-current
main

git ls-remote origin refs/heads/main (post-docs, pre-autosync):
2072b7acd1fa57c2e1058b4fce15db000f86937f	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* 8d48f62 — autosync / riconciliazione finito MULTIROW-A (+ FIX1 + FIX2); real_task_commit storico `16499ea`
* 16499ea — docs: finito ROUTING-GEOCODING-MULTIROW-A after Regola H QA PASS
* 1f7c05f — MULTIROW-A-FIX2 runtime tip (build 101)
* 2793816 — autosync / riconciliazione finito QA-OPERATOR-IT-ONLY-PREF; real_task_commit storico `157a31d`
* 157a31d — docs: close QA-OPERATOR-IT-ONLY-PREF and freeze Oggetti GIS
* 2072b7a — docs: route operator QA through ChatGPT three-line format

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
* Non prova il proprio HEAD finale — verifica esterna obbligatoria.
