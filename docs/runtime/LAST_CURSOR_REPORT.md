# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `42edb6fb86b98ccf5e2636884d748c043cd6b7c2` — verify short `42edb6f`
* real_task_subject: fix(dflight): harden wheel UI isolation + Layer menu safeTop (G-FIX2)
* report_generated_at: 2026-08-13T00:08:00+02:00
* branch: main
* remote_head_after_task_push: `42edb6fb86b98ccf5e2636884d748c043cd6b7c2`
* previous_report_container: `0b650cc5481f6bc7d3f805d125db1f8b1116301b`
* current_report_container: `PENDING_SELF_REFERENCE`
* final_remote_head_after_report_push: `EXTERNAL_ONLY`
* working_tree_status: pulito salvo autosync di questo intervento
* pass_tecnico_remoto: EXTERNAL_ONLY (container corrente); task+deploy GIS già PASS su `42edb6f`
* result_cursor: AUTOMATED BROWSER QA D-FLIGHT-G-UI-OVERLAY-A-FIX2 **PASS**
* pass_operatore: non-attestato — **non** inferito — STOP per QA umana FIX2
* result_runtime: GIS `42edb6f` / D-FLIGHT-G-UI-OVERLAY-A-FIX2 / build **167**; helper/CORS **non** toccati
* qa_attestation_source: Automated Browser QA Cursor PASS; FAIL operatore FIX1 / G / F restano in storico
* notes: no finito; wheel rect+target; Layer menu safeTop sotto header

## OUTPUT VERBATIM

```text
git rev-parse HEAD (task, pre-autosync)
42edb6fb86b98ccf5e2636884d748c043cd6b7c2

git ls-remote origin main (post-task, pre-autosync)
42edb6fb86b98ccf5e2636884d748c043cd6b7c2	refs/heads/main

Deploy GIS: active; HTTP 200 ?v=42edb6fb
Title: D-FLIGHT-G-UI-OVERLAY-A-FIX2 · build 167

Browser QA (CDP):
panelWheelOk true; mapFallOk true; menuBelowHeader true; firstItemVisible true;
menuWheelZoomOk true; menuFallOk true; pass true
AUTOMATED BROWSER QA D-FLIGHT-G-UI-OVERLAY-A-FIX2 PASS
```

PASS remoto container corrente: **EXTERNAL_ONLY**.

## HISTORY

* `0b650cc` — docs: orchestratore — D-FLIGHT-G-UI-OVERLAY-A-FIX1 deploy + browser QA PASS
* `8d180314aaae69a6b2e49bd402d2090d143be442` — docs: orchestratore — D-FLIGHT-G-UI-OVERLAY-A deploy + browser QA PASS
* `5f48c99003c0f352f9180297e1b872efee1d64c2` — docs: orchestratore — AUTOMATED BROWSER QA D-FLIGHT-F PASS
* `d9fa25b130794de8402c30550fd0597211e139d2` — docs: orchestratore — D-FLIGHT-F ACL :8010 still blocked
* `76109a72597ce3b56ac7bec5ac21d72544d94a08` — docs: orchestratore — D-FLIGHT-F-FIX1 deploy + browser QA FAIL ACL

## LIMITI

* QA operatore FIX2 ancora da eseguire (ChatGPT).
* FAIL FIX1 / G / F restano storici (non PASS).
* No finito. SHA autosync = EXTERNAL_ONLY.
