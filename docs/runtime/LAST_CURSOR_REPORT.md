# LAST_CURSOR_REPORT

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK (questo pass)** | `ROUTING-LAND-ONLY-NO-FERRY-A` |
| **GATE (questo pass)** | **AUDIT STOP HARD** — isolamento candidate |
| **FRONTIER (prevale)** | `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX4` · **REVIEW PACKAGE READY** · **invariato** |
| **NEXT** | Review Search FIX4 (primario) · ripresa routing solo dopo isolamento ammissibile |
| **Runtime LIVE** | tip `f215011` · build **256** |
| **Candidate Search (FRONTIER)** | `e3da4e89c723246c4925f89c2ef0dbf58b746844` · build **261** · blob `b7d62b11…` |
| **Candidate routing** | **nessuno** (STOP) |
| **Deployed state** | invariato — **NO DEPLOY** |
| **Result Cursor** | Audit completo + finding isolamento; monolite non toccato |
| **Working tree** | atteso pulito post-push docs |

### Identità SHA

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `e3da4e89c723246c4925f89c2ef0dbf58b746844` (Search — FRONTIER) |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `407a08992f5499b678617a3db78c0394c5476e00` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | nessuno (no runtime patch) |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

## B. RIEPILOGO COMPLETO

1. Autosync: sì — inbox audit-stop, `latest.md`, questo report. **FRONTIER non toccato.** Monolite escluso.
2. Verifica: `HEAD`=`origin/main`=`ls-remote`=`407a089…`; tree clean; Search FIX4 ancora candidate.
3. Audit GH: `routingBuildGraphhopperRouteBody`, `routingBuildGraphhopperRoundTripBody`, `routingApplyAvoidPayloadToBody`, `routingBuildAvoidAreasCustomModel`, `routingNearestForPoint`, `routingResolveProvider`.
4. Audit ORS: `routingBuildOrsRouteBody`, `routingBuildOrsRoundTripBody`, `routingApplyAvoidPayloadToOrsBody`; gateway whitelista `avoid_features`.
5. **STOP F1:** due candidate runtime non coesistono in FRONTIER senza sovrascrivere Search in review.
6. F2: `/info` GH timeout — `road_environment`/FERRY non attestato live.
7. F3: `/nearest` senza filtro ferry.
8. F4: vincolo ferry oggi assente nei payload.
9. **NO DEPLOY · NO FINITO · NO PASS Search.**

```text
STATO FRESCO DA CURSOR
origin/main HEAD: 407a089… (pre-docs) — post-push EXTERNAL_ONLY
working tree: atteso clean
ultimo blocco PASS: APP-BUILD-LABEL-UX-A (256 LIVE)
prossimo candidato: Search FIX4 @ e3da4e8 (review) · routing land-only parcheggiato
note operative: FRONTIER Search invariato; audit routing in inbox
```

## C. OUTPUT GIT (pre-container)

```text
git log --oneline -5
407a089 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX4 REVIEW PACKAGE READY
e3da4e8 fix(search): whole-input validation, incomplete lat, signed DMS components (FIX4)
bb185f4 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX3 REVIEW PACKAGE READY
faed7b1 fix(search): keep signs, symbols and reject conflicting hemispheres (FIX3)
f7e7edb docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX2 REVIEW PACKAGE READY

git rev-parse HEAD
407a08992f5499b678617a3db78c0394c5476e00

git rev-parse origin/main
407a08992f5499b678617a3db78c0394c5476e00
```
