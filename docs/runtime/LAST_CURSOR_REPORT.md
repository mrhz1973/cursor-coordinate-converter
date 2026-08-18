# LAST CURSOR REPORT

> Evidence rolling post-push. **Non** fonte viva primaria — [`docs/FRONTIER.md`](../FRONTIER.md).

## LATEST

* real_task_commit: `268787379f18f52bf2f6285d3e852f9770f260ed`
* real_task_subject: `feat(routing): ORS provider opt-in candidate build 220`
* report_generated_at: `2026-08-18T04:35:00+02:00`
* branch: `main`
* remote_head_after_task_push: `268787379f18f52bf2f6285d3e852f9770f260ed`
* previous_report_container: `268787379f18f52bf2f6285d3e852f9770f260ed`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: untracked helper locali (`_ors_*`, `_patch_*`, `tmp/`) — **monolite identico al blob candidate**
* pass_tecnico_remoto: `EXTERNAL_ONLY` (container corrente)
* result_cursor: REVIEW-ANCHOR-RECOVERY — WU hot-header + evidence scoped + questo report; **nessuna** patch runtime
* pass_operatore: non-attestato
* result_runtime: LIVE invariato build **219** · CANDIDATE immutabile build **220**
* qa_attestation_source: n/a (no deploy / no ABQA / no QA)
* notes: GATE resta **REVIEW GPT-SOSTITUTIVA — PENDING**. Capability 1–10 già PASS (inbox `2026-08-18_0425_*`); non rieseguite.

### Nota operativa — container e self-reference

- **`real_task_commit`** = FULL SHA del monolite candidate 220 (`2687873…`). Non è “Pending”.
- **`current_report_container`** resta **`PENDING_SELF_REFERENCE`** in questo commit autosync.
- HEAD finale post-push di *questo* report: **EXTERNAL_ONLY**.

## OUTPUT VERBATIM (pre-autosync)

```text
git log --oneline -5
2687873 feat(routing): ORS provider opt-in candidate build 220
757a6f2 docs(orchestrator): INFRA3 STOP — Tailscale ACL non applicabile da Cursor
842f701 docs: INFRA2 secret PRESENT, STOP GIS client ACL tcp:443
5f84f70 infra(ors): INFRA1 HTTPS ORS gateway seat (nginx+Tailscale TLS)
2e52ece docs: OUTDOOR-ROUTING-ORS-PROVIDER-A infra/capability gate FAIL — STOP

git rev-parse HEAD
268787379f18f52bf2f6285d3e852f9770f260ed

git rev-parse origin/main
268787379f18f52bf2f6285d3e852f9770f260ed

git branch --show-current
main

git ls-remote origin main
268787379f18f52bf2f6285d3e852f9770f260ed	refs/heads/main

git ls-tree 268787379f18f52bf2f6285d3e852f9770f260ed -- "coordinate_converter Claude.html"
100644 blob 23fe93aae3c7c2c6f32dfdcaab90f2cc827e14a1	coordinate_converter Claude.html
```

PASS remoto del container corrente: **EXTERNAL_ONLY**.

## HISTORY

- `268787379f18f52bf2f6285d3e852f9770f260ed` — task candidate 220 (monolite + FRONTIER/inbox/LAST_CURSOR_REPORT con testo «Pending» — **superseded** da questo recovery; published = immutable).

## LIMITI

* Non sostituisce FRONTIER / WU / inbox.
* Non certifica PASS operatore.
* Non usa RAW GitHub come autorità finale.
* Non prova il proprio HEAD finale.
