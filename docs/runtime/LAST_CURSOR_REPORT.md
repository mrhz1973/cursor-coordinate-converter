# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `0703f92a77949ec0c6bab021ee0cbf0ad6ea6606`
* real_task_subject: docs(cursor): align QA workflow rules with ChatGPT handoff
* report_generated_at: 2026-08-02T08:45:00Z
* branch: main
* remote_head_after_task_push: `0703f92a77949ec0c6bab021ee0cbf0ad6ea6606` (docs/rules task pre-autosync); runtime tip invariato `1f7c05f`
* previous_report_container: `101cc73` (autosync QA-CHATGPT-3LINE-HANDOFF-PREF — esterno/verificabile)
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: docs/rules task `0703f92` pushato; monolite tip `1f7c05f` escluso
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); docs/rules `0703f92` pushato pre-autosync
* result_cursor: QA-CHATGPT-3LINE-CURSOR-RULES-A CLOSED / PASS docs-only; 30-output-workflow allineato a Regola D2
* pass_operatore: N/A — docs/rules-only (nessuna QA runtime richiesta)
* result_runtime: invariato tip `1f7c05f` / B6.5RGM-A-FIX2 · build 101
* qa_attestation_source: N/A (docs/rules-only)
* notes: nessun deploy; Bundle F non aperto; Oggetti GIS FROZEN; nessun candidato runtime auto-aperto

## OUTPUT VERBATIM

```text
real_task_commit (docs/rules-only):
0703f92a77949ec0c6bab021ee0cbf0ad6ea6606

runtime tip (invariato):
1f7c05f2186be5759d3e0e34a69d88564a0d8690

git branch --show-current
main

git ls-remote origin refs/heads/main (post-docs, pre-autosync):
0703f92a77949ec0c6bab021ee0cbf0ad6ea6606	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**

## HISTORY

* 101cc73 — autosync / riconciliazione QA-CHATGPT-3LINE-HANDOFF-PREF; real_task_commit storico `2072b7a`
* 2072b7a — docs: route operator QA through ChatGPT three-line format
* 8d48f62 — autosync / riconciliazione finito MULTIROW-A (+ FIX1 + FIX2); real_task_commit storico `16499ea`
* 16499ea — docs: finito ROUTING-GEOCODING-MULTIROW-A after Regola H QA PASS
* 1f7c05f — MULTIROW-A-FIX2 runtime tip (build 101)
* 2793816 — autosync / riconciliazione finito QA-OPERATOR-IT-ONLY-PREF; real_task_commit storico `157a31d`
* 157a31d — docs: close QA-OPERATOR-IT-ONLY-PREF and freeze Oggetti GIS

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
* Non prova il proprio HEAD finale — verifica esterna obbligatoria.
