# LAST CURSOR REPORT

> Evidence rolling post-push. **Non** fonte viva primaria — [`docs/FRONTIER.md`](../FRONTIER.md).

## LATEST

* real_task_commit: `PENDING_SELF_REFERENCE` (docs-only REVIEW-ANCHOR-AND-RAW-RECOVERY)
* real_task_subject: REVIEW-ANCHOR-AND-RAW-RECOVERY `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A` — SHA esatto + raw A–L
* report_generated_at: `2026-08-18T13:22:00+02:00`
* branch: `main`
* remote_head_after_task_push: `EXTERNAL_ONLY`
* previous_report_container: `1a5e971459f13b12ed303f1e7105998db774b3bf`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: helper locali `_*.py` / `tmp/` **esclusi**; monolite **non** modificato
* pass_tecnico_remoto: da verificare dopo push
* result_cursor: RUNTIME_CANDIDATE_SHA `1a5e971459f13b12ed303f1e7105998db774b3bf` registrato; GATE review PENDING; **NON** deploy / **NON** ABQA / **NON** QA / **NON** finito / **NON** build bump
* pass_operatore: n/a
* result_runtime: LIVE build **220** / `cfee0e4` · CANDIDATE `1a5e971` / **221** · blob `90c52d57…`
* qa_attestation_source: n/a
* notes: REMOTE_HEAD_AT_EVIDENCE_TIME (pre-docs) = `1a5e971459f13b12ed303f1e7105998db774b3bf`; helper 0.1.3.

## OUTPUT VERBATIM (pre-autosync)

```text
git log -1 --format=%H -- "coordinate_converter Claude.html"
1a5e971459f13b12ed303f1e7105998db774b3bf

git ls-remote origin refs/heads/main
1a5e971459f13b12ed303f1e7105998db774b3bf	refs/heads/main

blob
90c52d57f58ec49af91bf0364e2fe7c8aa5ece3b
```

PASS remoto del container corrente: **EXTERNAL_ONLY** fino a `git ls-remote` post-push.

## HISTORY

- `1a5e971459f13b12ed303f1e7105998db774b3bf` — runtime candidate build 221 (HTML)
- `9e811d58668067ae48ce40f44d9466a3953040e2` — chiusura docs ORS-PROVIDER-A CLOSED/PASS
- `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` — LIVE infra/runtime 220

## LIMITI

* Non sostituisce FRONTIER.
* Non prova il proprio HEAD finale.
* Monolite non toccato in questo pass.
