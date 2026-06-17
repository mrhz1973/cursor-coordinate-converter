# LAST_CURSOR_REPORT

> Evidenza rolling post-push — **non** fonte viva primaria. Read-set: OM §7, roadmap, latest/inbox.

## LATEST

* real_task_commit: `150d6ac`
* real_task_subject: feat(gis): improve OPSEC strict proxy discoverability (WU-0009B B5.1)
* report_generated_at: 2026-06-17T23:45:00+02:00
* branch: main
* remote_hash_authority: git ls-remote origin main
* local_HEAD: *(post-push autosync — vedi OUTPUT VERBATIM in RIEPILOGO B5.1)*
* local_origin_main: *(post-push)*
* ls_remote_origin_main: *(post-push)*
* working_tree_status: pulito (atteso post-push)
* pass_tecnico_remoto: PASS *(atteso post-push B5.1)*
* result_cursor: B5.1 OPSEC strict UX polish — label `set.opsec.strict` + help-line `set.opsec.strictHelp` sotto `#setOpsecStrict`; CSS `.geo-opsec-help`; i18n IT/EN/FR; node --check OK; static checks PASS (toggle unico, gate/listener invariati, `_bingConsentGranted` reset presente); hint Layers Satellitare **differito** (rebuild dinamico `basemapLayersHtml`); `tip.layerGsat`/`tip.layerBsat` invariati
* pass_operatore: non-attestato
* result_runtime: Browser QA visuale B5.1 non eseguita — checklist manuale post-deploy in inbox
* qa_attestation_source: —
* docs_commit: `8475ff7` (OM §7 + roadmap B5.1)
* notes: Nessun secondo toggle OPSEC; logica `tileFetchAllowed`/`ensureProxyConsent`/route proxy invariata. Step 3 hint Layers differito consapevolmente.
* pending_self_reference: **risolto** — report autosync B5.1 referenzia `real_task_commit=150d6ac`

<!-- pass_* = esito sintetico: PASS / FAIL / non-attestato. result_* = descrizione o evidenza sintetica. -->

## OUTPUT VERBATIM

*(Output git post-push registrato nel RIEPILOGO B5.1 e inbox orchestratore.)*

## HISTORY

### WU-0009B B4.2 bsat frontend + B4.4 attestation (archiviato da B5.1 LATEST)

* real_task_commit: `8d4deab`
* real_task_subject: feat: add Bing Satellite basemap bsat via tailnet proxy (WU-0009B B4.2)
* report_generated_at: 2026-06-17T07:00:00+02:00
* report_updated_at: 2026-06-17T23:00:00+02:00 *(B4.4 attestation docs-only — stessa entry, no duplicato LATEST)*
* pass_tecnico_remoto: PASS *(B4.2 push `fe6b289`)*
* pass_operatore: **attestato**
* result_runtime: **Browser QA OPSEC strict PASS (7/7 step)** — B4.4
* qa_attestation_docs_commit: `eb809fc`
* notes: Proxy Planet-Clone deploy 1e8944d; B4.3A annullato. Catena B4 Bing `bsat` chiusa end-to-end.
* pending_self_reference: risolto — autosync B4.2 = `fe6b289`; attestation B4.4 = `80e8c64`

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
