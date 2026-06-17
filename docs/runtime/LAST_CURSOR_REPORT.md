# LAST_CURSOR_REPORT

> Evidenza rolling post-push — **non** fonte viva primaria. Read-set: OM §7, roadmap, latest/inbox.

## LATEST

* real_task_commit: `8d4deab`
* real_task_subject: feat: add Bing Satellite basemap bsat via tailnet proxy (WU-0009B B4.2)
* report_generated_at: 2026-06-17T07:00:00+02:00
* branch: main
* remote_hash_authority: git ls-remote origin main
* local_HEAD: *(autosync commit — vedi OUTPUT VERBATIM post-push)*
* local_origin_main: *(post-push)*
* ls_remote_origin_main: *(post-push)*
* working_tree_status: pulito (post-push atteso)
* pass_tecnico_remoto: *(post-push)*
* result_cursor: B4.2 bsat frontend — 25/25 controlli statici PASS; node --check OK; monolite + gate OPSEC consenso bing
* pass_operatore: non-attestato
* result_runtime: Browser QA OPSEC strict **pending B4.4**; static-only in B4.2
* qa_attestation_source: non attestata
* notes: Proxy Planet-Clone deploy 1e8944d (audit); cache-first sotto OPSEC strict senza consenso — tile IndexedDB servite localmente, no fetch proxy su hit cache
* pending_self_reference: commit autosync/report che include questo file = PENDING_SELF_REFERENCE

<!-- pass_* = esito sintetico: PASS / FAIL / non-attestato. result_* = descrizione o evidenza sintetica. -->

## OUTPUT VERBATIM

*(compilato post-push nello stesso intervento — vedi RIEPILOGO chat o rigenerare con git log/status/ls-remote)*

## HISTORY

### Fase F3 attivazione — archiviato

* real_task_commit: `d69b100`
* real_task_subject: Fase F3 attivazione obbligo LAST_CURSOR_REPORT GIS-only
* report_generated_at: 2026-06-16T01:51:30+02:00
* pass_tecnico_remoto: PASS
* pass_operatore: non-attestato
* result_runtime: non eseguito / non applicabile (F3 docs/governance)
* pending_self_reference: risolto indirettamente — entry sostituita da B4.2 LATEST

### Fase F2 — collaudo LAST_CURSOR_REPORT (archiviato da F3)

* real_task_commit: `47b0016`
* report_autosync_commit: `ec60d47`
* real_task_subject: Fase F2 collaudo LAST_CURSOR_REPORT su commit docs innocuo
* report_generated_at: 2026-06-16T01:25:30+02:00
* pass_tecnico_remoto: PASS
* pass_operatore: non-attestato
* result_runtime: non eseguito / non applicabile (F2 docs-only)
* pending_self_reference: **risolto** — autosync/report F2 = `ec60d47`

## LIMITI

* Non sostituisce OM §7 / roadmap / latest / inbox.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
