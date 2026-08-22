# LAST_CURSOR_REPORT

## A. Header

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-MAP-UI-RESIDUAL-MAINTENANCE-A` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA operatore unica · PASS → finito Regola H / promote **249** |
| **RUNTIME LIVE** | tip `aa6e8f5a5af7b215fcda7bc7055b2b6472143396` · build **248** · blob `dadbf8af428770ef1724bcd6444b17caeb69fdcf` |
| **RUNTIME_CANDIDATE_SHA** | `b26409724d8514a14bb84971d24db345635a5574` · build **249** · blob `f0bb0be1f7216dd8c708b8210704c2ec518df97b` |
| **Result Cursor** | IMPLEMENTED · deploy GIS PASS · ABQA **19/19** PASS · PENDING QA |
| **Working tree (pre-report-commit)** | docs dirty → this commit |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `b26409724d8514a14bb84971d24db345635a5574` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

## B. RIEPILOGO COMPLETO

1. Autosync orchestratore: sì — FRONTIER PENDING QA, latest, backlog CONSUMED×4, deploy-abqa, abqa.json, LAST_CURSOR_REPORT. Monolite **escluso** da questo commit docs.
2. `git status --short` (pre-docs): solo docs dirty; runtime già su `origin/main` tip `b264097`.
3. Runtime candidate: tip `b264097` / **249** / blob `f0bb0be…` / byte LF `10855216` / SHA-256 `4cff438c…`.
4. Catena: `bfb4dbc` (4 item) → `b264097` (openPolygonPanel → trackSyncPickModeUi).
5. ITEM1: `wireWaypointListCoordFormatOnce` rewrite `#wpFieldCoord` via `writeWaypointEditorCoordFieldFromDraft`.
6. ITEM2: no GIS backdrop dismiss; `mapToolDeactivate` su finish/close; toolbar sync open+close.
7. ITEM3: flyout autoclose + `refreshTileMapForTrackUi` su Poligoni e Range & Bearing.
8. ITEM4: col resize Nome/Dettagli — `table-layout:fixed`, max≥startW, min 72/96, session-only.
9. Regressioni 248 preservate: map-name no overlap; metrics 1dp; Oggetti GIS frozen.
10. Deploy GIS-only PASS (CMP, proxy PID `1387`, HTTP 200).
11. ABQA **19/19** PASS.
12. Gate: **QA FINALE CHATGPT — PENDING**. No `finito` finché PASS operatore.
13. `STATO FRESCO DA CURSOR` sotto.

### STATO FRESCO DA CURSOR

```text
STATO FRESCO DA CURSOR
origin/main HEAD: b26409724d8514a14bb84971d24db345635a5574
working tree: docs dirty (pre-container) → PENDING_SELF_REFERENCE
ultimo blocco PASS: GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A (LIVE 248)
prossimo candidato: GIS-MAP-UI-RESIDUAL-MAINTENANCE-A (249) PENDING QA
note operative: Oggetti GIS FROZEN / MAINTENANCE-ONLY; URL ?v=b264097
```

## C. OUTPUT GIT

```text
git log --oneline -5:
b264097 fix(ui): sync polygon toolbar active state on panel open
bfb4dbc fix(ui): map residual QA — coord format sync, polygon toolbar, flyout autoclose, WP col resize
2be7b6f docs: finito GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A after QA PASS
1aedb07 docs: triage QA FAIL maintenance A — no FIX1, four backlogs
6c848cc docs: GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A PENDING QA

git rev-parse HEAD: b26409724d8514a14bb84971d24db345635a5574
git rev-parse origin/main: b26409724d8514a14bb84971d24db345635a5574
git branch --show-current: main
git ls-remote origin refs/heads/main: b26409724d8514a14bb84971d24db345635a5574
RUNTIME_CANDIDATE_SHA: b26409724d8514a14bb84971d24db345635a5574
REMOTE_HEAD_AT_EVIDENCE_TIME: b26409724d8514a14bb84971d24db345635a5574
current_report_container: PENDING_SELF_REFERENCE
```
