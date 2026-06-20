# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `e6b28db`
* real_task_subject: feat(export): B5.5B JPG export map overlays dialog and SVG capture
* report_generated_at: 2026-06-21T00:37:00+02:00
* branch: main
* remote_hash_authority: `e6b28db`
* local_HEAD: `e6b28db`
* local_origin_main: `e6b28db`
* ls_remote_origin_main: `e6b28db3575e720f19dc36f223b30836a1e16bdf`
* working_tree_status: clean (post step 2; autosync orchestratore in commit successivo)
* pass_tecnico_remoto: PASS
* result_cursor: B5.5B JPG export overlay base implementato; build B5.5B; includeOverlays default true; 4 overlay SVG WYSIWYG
* pass_operatore: pending (QA post-deploy VPS)
* result_runtime: n/a finché non deployato — runtime locale e6b28db; VPS ancora B6.6C 41f180b
* qa_attestation_source: n/a — QA operatore post-deploy pending
* docs_commit: `e6b28db` (monolite+docs stesso commit)
* autosync_commit: PENDING_SELF_REFERENCE
* runtime_ref: `e6b28db`
* deploy_ref: `69fa6cf` (VPS precedente B6.6C; non aggiornato in questo blocco)

## OUTPUT VERBATIM

```text
git log --oneline -5
e6b28db feat(export): B5.5B JPG export map overlays dialog and SVG capture
69ec3cb docs: orchestratore — riconciliazione finito sessione backfill B5.5A-1
0a550e9 docs: LAST_CURSOR_REPORT — backfill finito B5.5A-1 autosync self-reference
ba34260 docs: orchestratore — riconciliazione finito sessione B5.5A-1
a9cb078 docs(memory): register B5.5A-1 PASS piano/diagnosi export JPG avanzato

git status --short
(clean)

git rev-parse HEAD
e6b28db3575e720f19dc36f223b30836a1e16bdf

git rev-parse origin/main
e6b28db3575e720f19dc36f223b30836a1e16bdf

git branch --show-current
main

git show --stat HEAD
 coordinate_converter Claude.html        | 41 +++++++++++++++++++++++++++++----
 docs/OPERATING_MEMORY.md                |  1 +
 docs/work-units/WU-0005-0009-roadmap.md |  2 ++
 3 files changed, 40 insertions(+), 4 deletions(-)

git ls-remote origin main
e6b28db3575e720f19dc36f223b30836a1e16bdf	refs/heads/main
```

## HISTORY

* e6b28db — B5.5B JPG export overlays; orchestratore PENDING_SELF_REFERENCE; deploy VPS pending
* a9cb078 — B5.5A-1 PASS piano/diagnosi; orchestratore ba34260
* 41f180b — B6.6C runtime panel restore
* 3c2b7c5 — B6.6C PASS operatore docs
