# LAST_CURSOR_REPORT

## A. Header

| Campo | Valore |
| --- | --- |
| **BLOCK** | `MAP-CENTER-VIEWPORT-AWARE-A-FIX1` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA operatore · non finito |
| **RUNTIME LIVE** | tip `03a222e429905477d4a288c4ba7cc5b986f08bff` · build **245** · `MAP-CENTER-VIEWPORT-AWARE-A-FIX1` · blob `b9258d757fd8bba291e4506680ba579a480f5c56` |
| **RUNTIME_CANDIDATE_SHA** | `03a222e429905477d4a288c4ba7cc5b986f08bff` |
| **Result Cursor** | deploy GIS **PASS** · ABQA **18/18 PASS** · gate PENDING |
| **Working tree (pre-report-commit)** | docs dirty → this commit |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `03a222e429905477d4a288c4ba7cc5b986f08bff` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

## B. RIEPILOGO COMPLETO

1. Autosync: sì — FRONTIER, OM §7.2, roadmap, backlog inbox, latest, deploy-abqa, abqa.json, questo report. Monolite **escluso** da questo commit (già in tip runtime `03a222e`).
2. Input: `QA MAP-CENTER-VIEWPORT-AWARE-A FAIL operatore` — dock destro copriva chrome destro; caso 2 PASS.
3. FIX1 runtime: `preferRight: false`; `polygonPanelComputeGisBand` / `polygonPanelApplyLeftGisBand`; migrazione layout destra; build **245**.
4. Funzioni: `_polygonPanelLayoutOpts`, `polygonPanelComputeGisBand`, `polygonPanelApplyLeftGisBand`, `attachPolygonPanelFloatingGis`.
5. i18n: nessuna nuova stringa (L10N freeze).
6. Non toccato: METRICS-COMPACT, schema/storage, rete/GPS, caso 2 content order, Ctrl+Z path.
7. Lint/selftest: triad F/Tf/H → 245 / FIX1.
8. Deploy GIS-only PASS · CMP PASS · proxy PID invariato · HTTP 200.
9. ABQA **18/18 PASS** (dock left, topbar/footer/scala, right ctrls free, verts, Ctrl+Z, FIX4 drag, narrow).
10. Limiti: resize finestra a panel già aperto non ricalcola banda (riapertura sì); camera useful-rect DELICATO ancora fuori scope.

### STATO FRESCO DA CURSOR

```text
STATO FRESCO DA CURSOR
origin/main HEAD: PENDING_SELF_REFERENCE (pre-container 03a222e)
working tree: dirty docs → this commit
ultimo blocco PASS tecnico: MAP-CENTER-VIEWPORT-AWARE-A-FIX1 (deploy+ABQA)
prossimo candidato: QA operatore MAP-CENTER / FIX1
note operative: non finito; URL ?v=03a222e
```

## C. OUTPUT GIT

```text
(pre-container — real_task_commit)
git log --oneline -5  → 03a222e fix(map): polygon panel dock LEFT…
git rev-parse HEAD → 03a222e429905477d4a288c4ba7cc5b986f08bff
git rev-parse origin/main → 03a222e429905477d4a288c4ba7cc5b986f08bff
git branch --show-current → main
git ls-remote origin refs/heads/main → 03a222e429905477d4a288c4ba7cc5b986f08bff
RUNTIME_CANDIDATE_SHA = 03a222e429905477d4a288c4ba7cc5b986f08bff
REMOTE_HEAD_AT_EVIDENCE_TIME = 03a222e429905477d4a288c4ba7cc5b986f08bff
current_report_container = PENDING_SELF_REFERENCE
```
