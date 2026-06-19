# LAST_CURSOR_REPORT

> Evidenza rolling post-push — **non** fonte viva primaria. Read-set: OM §7, roadmap, latest/inbox.

## LATEST

* real_task_commit: `4d40fae`
* real_task_subject: feat(gis): optional scale on JPG export via canvas 2D (B5.4)
* report_generated_at: 2026-06-19T15:09:00+02:00
* branch: main
* pass_tecnico_remoto: PASS *(post-push atteso)*
* result_cursor: B5.4 — dialog export JPG con checkbox «Includi scala» (default off); `computeMapScaleModel` + `drawJpgExportScale` canvas 2D; `toBlob("image/jpeg")` preservato; nessun foreignObject/raster HTML; export base invariato; UI scala B5.3b invariata; node --check OK
* pass_operatore: non-attestato
* result_runtime: QA export JPG con/senza scala pending operatore
* docs_commit: `0e92b8c`
* autosync_commit: `7e2d8fd`
* notes: B5.x visual QA bundlata già PASS operatore (fec53ca). B5.4 QA export separata pending.

## HISTORY

### B5.x QA visuale bundlata (archiviato)

* deploy: `fec53ca`
* pass_operatore: **attestato** (B5.1+B5.2+B5.3b)

### WU-0009B B5.3b runtime (archiviato)

* real_task_commit: `ad7d977`
