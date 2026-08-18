# LAST CURSOR REPORT

> Evidence rolling post-push. **Non** fonte viva primaria — [`docs/FRONTIER.md`](../FRONTIER.md).

## LATEST

* real_task_commit: `PENDING_SELF_REFERENCE` (stesso container del candidate build 221)
* real_task_subject: candidate `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A` build 221 — REVIEW GPT-SOSTITUTIVA PENDING
* report_generated_at: `2026-08-18T12:59:00+02:00`
* branch: `main`
* remote_head_after_task_push: `EXTERNAL_ONLY`
* previous_report_container: `9e811d58668067ae48ce40f44d9466a3953040e2`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: helper locali `_*.py` / `tmp/` **esclusi**
* pass_tecnico_remoto: da verificare dopo push (HEAD = origin/main = ls-remote)
* result_cursor: candidate 221 pubblicato; GATE review PENDING; **NON** deploy / **NON** ABQA / **NON** QA operatore / **NON** finito
* pass_operatore: n/a (non richiesto)
* result_runtime: LIVE resta build **220** / `cfee0e4` · CANDIDATE blob `90c52d57…` build **221**
* qa_attestation_source: n/a
* notes: helper 0.1.3; secret/ACL invariati; mapping hiking/mtb_trail only; hiking_easy/mtb_touring/foot-walking non confrontabili.

## OUTPUT VERBATIM (pre-autosync)

```text
git rev-parse HEAD (pre-candidate)
9e811d58668067ae48ce40f44d9466a3953040e2

blob candidate 221
90c52d57f58ec49af91bf0364e2fe7c8aa5ece3b
```

PASS remoto del container corrente: **EXTERNAL_ONLY** fino a `git ls-remote` post-push.

## HISTORY

- `9e811d58668067ae48ce40f44d9466a3953040e2` — chiusura docs ORS-PROVIDER-A CLOSED/PASS
- `c218000d1d2d47e210e7f4969126428efe56c2f6` — deploy+ABQA evidence, QA ChatGPT PENDING
- `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` — infra LoadCredential drop-in (runtime HTML immutabile fino a 221)
- `268787379f18f52bf2f6285d3e852f9770f260ed` — runtime candidate build 220

## LIMITI

* Non sostituisce FRONTIER.
* Non prova il proprio HEAD finale.
