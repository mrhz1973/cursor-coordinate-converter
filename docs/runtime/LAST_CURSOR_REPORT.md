# LAST_CURSOR_REPORT

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX1` |
| **GATE** | **REVIEW PACKAGE READY** (DELICATO) — nessun REVIEW PASS |
| **NEXT** | Review ChatGPT su FIX1 → deploy solo dopo gate |
| **Runtime LIVE** | tip `f215011` · build **256** |
| **Candidate FULL SHA** | `7e41a1435394d1cc0d0cdb1b3c2f45d464e11635` |
| **Build / ID / blob Git** | **258** · `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX1` · blob Git `9ca0a52676334278c464a6e7d4fbf17385dcb0ab` |
| **SHA-256 WT CRLF** | `5f502ad0037f85cf54f045fde2f697ba3fe3429fa437b7c883c4f056bac500b3` |
| **SHA-256 LF-norm** | `7dd417474c82d99129849a54d6a093981976e04270dbf10a8c321b33cfea695e` |
| **Deployed state** | invariato (LIVE 256) — **NO DEPLOY** |
| **Result Cursor** | FIX1 candidate + evidence; prior 257 FAIL registered |
| **Working tree** | atteso pulito post-push |

### Identità SHA

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `7e41a1435394d1cc0d0cdb1b3c2f45d464e11635` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `3674fd457e672532a5e05a03863e586dab60d59a` (pre report container) |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `7e41a1435394d1cc0d0cdb1b3c2f45d464e11635` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

Evidence: [`docs/orchestrator/inbox/2026-10-21_1240_GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX1-review-package.md`](../orchestrator/inbox/2026-10-21_1240_GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX1-review-package.md)

## B. RIEPILOGO COMPLETO

1. Prior candidate `4c2fd18` / build 257: **REVIEW GPT-SOSTITUTIVA FAIL** (R1–R5); non attribuito PASS.
2. R5 rettifica: “blob” `643462c9…` era SHA-256 WT CRLF; blob Git 257 = `37325c50…`.
3. FIX1: `classifyGeoSearchInput` riscritto — intent/shape → parse/validate; no `autoDetect` fallback; place lexemes; apostrofi; prefissi DD/UTM/MGRS; decimali EU.
4. Build **258** · ID `…-FIX1`.
5. Prove: 25/25 classify; UI R1–R4 PASS (Nominatim assente su invalid; indirizzi non → LatLon).
6. Commit runtime `7e41a14`; autosync docs (questo report) in container successivo.
7. **NO DEPLOY · NO FINITO.**

```text
STATO FRESCO DA CURSOR
origin/main HEAD: (pre-report) 3674fd4… — post-push EXTERNAL_ONLY
working tree: atteso clean
ultimo blocco PASS: APP-BUILD-LABEL-UX-A (256 LIVE)
prossimo candidato: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX1 @ 7e41a14 (REVIEW PACKAGE READY)
note operative: 257 FAIL registrata; review FIX1; nessun deploy
```

## C. OUTPUT GIT (pre-container)

```text
git log --oneline -5
7e41a14 fix(search): harden Cerca coord classification before geocoding (FIX1)
3674fd4 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A REVIEW PACKAGE READY
4c2fd18 feat(search): classify coordinates locally before Nominatim (build 257)
2e0547c docs: finito APP-BUILD-LABEL-UX-A after QA PASS
478df26 docs: APP-BUILD-LABEL-UX-A PENDING QA (256 candidate)

git rev-parse HEAD
7e41a1435394d1cc0d0cdb1b3c2f45d464e11635

git rev-parse origin/main
3674fd457e672532a5e05a03863e586dab60d59a

git rev-parse HEAD:coordinate_converter\ Claude.html
9ca0a52676334278c464a6e7d4fbf17385dcb0ab
```
