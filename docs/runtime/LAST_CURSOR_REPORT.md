# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `25555c2`
* real_task_subject: fix(export): B5.5E-2 JPG export fixed maximum quality 3x without selector
* report_generated_at: 2026-06-21T08:31:00+02:00
* branch: main
* remote_hash_authority: `25555c2`
* local_HEAD: `25555c2`
* local_origin_main: `25555c2`
* ls_remote_origin_main: `25555c27e02a2f01e7a0c429c17e8616ac3dc05b`
* working_tree_status: clean (post step 2; autosync orchestratore in commit successivo)
* pass_tecnico_remoto: PASS
* result_cursor: B5.5E-2 fixed scale 3x; selettore rimosso; JPG_EXPORT_REQUESTED_SCALE=3; cap 8192 preserved
* pass_operatore: pending (post-deploy VPS)
* result_runtime: n/a finché non deployato — runtime locale 25555c2; VPS ancora B5.5E-1 @ 0cc28d5
* qa_attestation_source: n/a
* docs_commit: `25555c2` (monolite+docs stesso commit)
* autosync_commit: `f84422b`
* runtime_ref: `25555c2`
* deploy_ref: pending (VPS B5.5E-1; B5.5E-2 deploy pending)

## OUTPUT VERBATIM

```text
git log --oneline -5
25555c2 fix(export): B5.5E-2 JPG export fixed maximum quality 3x without selector
0cc28d5 docs: LAST_CURSOR_REPORT backfill autosync B5.5E-1
d110835 docs: orchestratore — riconciliazione finito sessione B5.5E-1
1cbd4d1 fix(export): B5.5E-1 JPG export default maximum quality 3x
93b56c1 docs: orchestratore — riconciliazione finito sessione B5.5E

git status --short
(clean)

git rev-parse HEAD
25555c27e02a2f01e7a0c429c17e8616ac3dc05b

git rev-parse origin/main
25555c27e02a2f01e7a0c429c17e8616ac3dc05b

git branch --show-current
main

git show --stat HEAD
 coordinate_converter Claude.html        | 67 +++------------------------------
 docs/OPERATING_MEMORY.md                |  3 +-
 docs/work-units/WU-0005-0009-roadmap.md |  4 +-
 3 files changed, 10 insertions(+), 64 deletions(-)

git ls-remote origin main
25555c27e02a2f01e7a0c429c17e8616ac3dc05b	refs/heads/main
```

## HISTORY

* 1cbd4d1 — B5.5E-1 default 3x; deploy VPS byte-match 2158230; QA parziale radio 3x
* 252ae5a — B5.5E JPG supersampling
* 6524183 — B5.5B-1 overlay style fidelity PASS operatore
