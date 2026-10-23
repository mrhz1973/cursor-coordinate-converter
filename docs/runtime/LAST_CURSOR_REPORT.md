# LAST_CURSOR_REPORT

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX6` |
| **GATE** | **REVIEW PACKAGE READY** (DELICATO) — nessun REVIEW PASS |
| **NEXT** | Review ChatGPT su FIX6 → deploy solo dopo gate |
| **Runtime LIVE** | tip `f215011` · build **256** |
| **Candidate FULL SHA** | `b60584cc9d32f2f5c035dee0c045673843e85b34` |
| **Build / blob Git** | **263** · blob Git `3b60b3a107357de9767698e2c67913bbc9b5b571` |
| **SHA-256 byte LF** | `81b0479faef0c0b9e536d354267f03612a4942dd9fe798d8ae574a8c5b5a9981` |
| **SHA-256 byte CRLF** | `fa276e6b53b16c66430ec23950a38bb8ae80fe0847e009e9fdc358c9445a8d1f` |
| **Deployed state** | invariato — **NO DEPLOY** |
| **Result Cursor** | FIX6 candidate; FIX5 FAIL (C1–C2) registrata |
| **Working tree** | atteso pulito post-push |

### Identità SHA

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `b60584cc9d32f2f5c035dee0c045673843e85b34` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `13d7e376913d79a1d64e38c4e1af32fdf137bf2e` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `b60584cc9d32f2f5c035dee0c045673843e85b34` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

## B. RIEPILOGO COMPLETO

1. Autosync: sì — FRONTIER, latest, inbox FIX6, questo report. Monolite escluso dall’autosync docs. Audit traghetti non duplicato.
2. FIX5 `657422e` / build 262 / blob `4385686a…`: **REVIEW GPT-SOSTITUTIVA FAIL** su C1–C2. P1–P3 e le 55+25 fixture restano PASS nel verbale.
3. `parseFreeTextLatLon` rifiuta i token fuori grammatica. Niente più `44° foo1` → 44.0166/9.0333 né `Via 20 Settembre 12` → 20/12.
4. Stesso fallimento in `autoDetect` e `routingSearchTryParseCoords`.
5. Incolla: conferma geocoding solo per `place_text`.
6. Prove: 31+24, FIX5 18+6, parser 14/14, Converti UI 11/11, incolla senza ricerca sull’invalido.
7. Commit runtime `b60584c`. **NO DEPLOY · NO FINITO.**

```text
STATO FRESCO DA CURSOR
origin/main HEAD: (pre-report) 13d7e37… — post-push EXTERNAL_ONLY
working tree: atteso clean
ultimo blocco PASS: APP-BUILD-LABEL-UX-A (256 LIVE)
prossimo candidato: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX6 @ b60584c
note operative: FIX5 FAIL C1–C2; routing land-only resta audit STOP
```

## C. OUTPUT GIT (pre-container)

```text
git log --oneline -5
b60584c fix(search): reject unknown tokens in the shared lat/lon parser (FIX6)
13d7e37 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX5 REVIEW PACKAGE READY
657422e fix(search): consume plus signs and bind values to axis markers (FIX5)
5c82589 docs: ROUTING-LAND-ONLY-NO-FERRY-A audit STOP (isolamento Search)
407a089 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX4 REVIEW PACKAGE READY

git rev-parse HEAD
b60584cc9d32f2f5c035dee0c045673843e85b34

git rev-parse origin/main
13d7e376913d79a1d64e38c4e1af32fdf137bf2e
```
