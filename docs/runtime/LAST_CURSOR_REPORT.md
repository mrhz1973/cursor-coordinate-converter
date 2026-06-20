# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `6524183`
* real_task_subject: fix(export): B5.5B-1 JPG overlay style fidelity via inline computed styles
* report_generated_at: 2026-06-21T01:07:00+02:00
* branch: main
* remote_hash_authority: `6524183`
* local_HEAD: `6524183`
* local_origin_main: `6524183`
* ls_remote_origin_main: `6524183233ba59d593ed9073ce5edb2d6db602c3`
* working_tree_status: clean (post step 2; autosync orchestratore in commit successivo)
* pass_tecnico_remoto: PASS
* result_cursor: B5.5B-1 inline computed styles su overlay export JPG; build B5.5B-1; fix QA FAIL parziale B5.5B
* pass_operatore: pending (re-deploy + QA post B5.5B-1)
* result_runtime: n/a finché non deployato — runtime locale 6524183; VPS ancora 4b75e22 (B5.5B)
* qa_attestation_source: operatore — FAIL parziale B5.5B (label/traccia nero pieno); B5.5B-1 non ancora QA
* docs_commit: `6524183` (monolite+docs stesso commit)
* autosync_commit: PENDING_SELF_REFERENCE
* runtime_ref: `6524183`
* deploy_ref: `4b75e22` (VPS B5.5B; B5.5B-1 deploy pending)

## OUTPUT VERBATIM

```text
git log --oneline -5
6524183 fix(export): B5.5B-1 JPG overlay style fidelity via inline computed styles
4b75e22 docs: orchestratore — riconciliazione finito sessione B5.5B
e6b28db feat(export): B5.5B JPG export map overlays dialog and SVG capture
69ec3cb docs: orchestratore — riconciliazione finito sessione backfill B5.5A-1
0a550e9 docs: LAST_CURSOR_REPORT — backfill finito B5.5A-1 autosync self-reference

git status --short
(clean)

git rev-parse HEAD
6524183233ba59d593ed9073ce5edb2d6db602c3

git rev-parse origin/main
6524183233ba59d593ed9073ce5edb2d6db602c3

git branch --show-current
main

git show --stat HEAD
 coordinate_converter Claude.html        | 41 +++++++++++++++++++++++++++++----
 docs/OPERATING_MEMORY.md                |  3 ++-
 docs/work-units/WU-0005-0009-roadmap.md |  4 +++-
 3 files changed, 42 insertions(+), 6 deletions(-)

git ls-remote origin main
6524183233ba59d593ed9073ce5edb2d6db602c3	refs/heads/main
```

## HISTORY

* 6524183 — B5.5B-1 overlay style fidelity; orchestratore PENDING_SELF_REFERENCE; deploy B5.5B-1 pending
* e6b28db — B5.5B JPG export overlays; deploy 4b75e22; QA FAIL parziale
* 41f180b — B6.6C runtime panel restore
