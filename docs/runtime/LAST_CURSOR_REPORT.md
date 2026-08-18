# LAST CURSOR REPORT

> Rolling handoff **completo** dell’ultimo pass Cursor. **Non** LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).  
> Contratto: header sintetico (A) + RIEPILOGO COMPLETO (B) + output git (C).  
> Disciplina F3: questo file **non** attesta il proprio HEAD finale.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` |
| **GATE** | **REVIEW GPT-SOSTITUTIVA — PENDING** |
| **NEXT** | review FIX6 candidate 228 |
| **Runtime LIVE** | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` · build **220** · `OUTDOOR-ROUTING-ORS-PROVIDER-A` · helper **0.1.3** · blob `23fe93aae3c7c2c6f32dfdcaab90f2cc827e14a1` |
| **Candidate FULL SHA** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| **Build / ID / blob** | **228** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` / `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| **Deployed state** | **NON deployato** · LIVE FRONTIER resta **220** |
| **Result Cursor** | CSS wrap mobile Percorso · selftest **847/847 PASS** · **NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito |
| **Working tree (pre-docs-container)** | helper `_*.py` / `tmp/` untracked; HTML committed in `c5bc4b1` |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| **previous_report_container** | `1cb1e06ceadf0bed08b0f054512c0b5311592d3a` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

Evidence: [`docs/orchestrator/inbox/2026-08-18_2140_outdoor-routing-f-provider-compare-a-fix6.md`](../orchestrator/inbox/2026-08-18_2140_outdoor-routing-f-provider-compare-a-fix6.md)

## B. RIEPILOGO COMPLETO — OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6

Finding unico FIX5: 360×740 chip Percorso non wrappano, **Anello** tagliato. Solo CSS responsive; resto FIX5 non riaperto.

1. Autosync orchestratore: **sì** (questo container). File: FRONTIER, WU-0010 hot-header + voce FIX6, `latest.md`, inbox 2140, `LAST_CURSOR_REPORT.md`. Commit docs **EXTERNAL_ONLY**. Push **EXTERNAL_ONLY**. Monolite **escluso** da questo container (già in `c5bc4b1`).
2. `git status --short` (pre-docs): HTML pulito dopo runtime commit; helper `_*.py` / `tmp/` untracked.
3. `git diff --stat` runtime: `coordinate_converter Claude.html` +231/−66.
4. File runtime: solo `coordinate_converter Claude.html`. File docs: FRONTIER, WU-0010, latest, inbox 2140, LAST_CURSOR_REPORT.
5. Regioni: CSS `.routing-params-row` / `#routingModeGroup` / `.routing-mode-chips` / `@media (max-width:480px)`; `routingCompareFix6SelfTest`; bump `APP_BUILD_NUM` 227→228 / `APP_BUILD_ID` FIX6.
6. Cosa fatto: `flex: 0 1 auto` + `min-width:0` + `max-width:100%` sul gruppo Percorso; chips `flex-wrap:wrap`; mobile gruppo `flex:1 1 100%`; label complete, no ellipsis. Select e ordine parametri invariati. Smoke 360×740: `sw=cw=342`, Anello visibile 62×27.
7. Funzioni: `routingCompareFix6SelfTest` (nuova). Non toccate: `routingMarkPlannerCommit`, `routingMaybeMinimizeTrackForPlanner`, `routingAlternativesAllowed`, payload GH/ORS.
8. Chiavi i18n: nessuna.
9. Non toccato: Track lifecycle, bordi alt, elevation, identity, Anello+VIA guard, Avoid, Tab, VIA pick, geocoder, OPSEC, GPS, waypoints, poligoni, helper 0.1.3, Oggetti GIS.
10. Lint: n/a. Selftest **847/847 PASS** (RPCF6 18/18, RPCF5 28/28, RWF1 8/8). ABQA: **non** eseguita. Deploy: **non** eseguito.
11. Commit runtime: `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc`. Bytes LF `10710401`. SHA-256 LF `ba6df30dca84f31f38b80fd8d7a34f6f61d180473a78a65f2777451dde0124ce`. Blob `225b1a7b673bd0cfa6aa3b407993cc453402923b`.
12. Limiti: GATE review PENDING. GIS VPS resta su 227 fino a review+deploy. LIVE 220. **NON** QA operatore. **NON** finito. Futuro ABQA: non reintrodurre i 4 false-fail harness 227.

```text
STATO FRESCO DA CURSOR
origin/main HEAD: c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc (REMOTE_HEAD_AT_EVIDENCE_TIME; docs/report HEAD = EXTERNAL_ONLY)
working tree: helper _*.py / tmp/ untracked; HTML = candidate 228
ultimo blocco PASS: nessuno in attesa review FIX6
prossimo candidato: review FIX6 candidate 228
note operative: NON deploy; NON ABQA; NON QA operatore; NON finito
```

## C. OUTPUT GIT (pre-docs-container)

```text
git log --oneline -5
c5bc4b1 fix(routing): FIX6 mobile Percorso chips wrap, build 228
1cb1e06 docs(method): LAST_CURSOR_REPORT full rolling handoff for agg
d0e08bf docs(orchestrator): FIX5 REVIEW PASS + GIS deploy + ABQA FAIL
f703cee docs(orchestrator): REVIEW-RAW-RECOVERY-FIX5 evidence (candidate 227 immutable)
b9e560a docs(orchestrator): FIX5 candidate 227 review pending (no deploy)

git rev-parse HEAD
c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc

git rev-parse origin/main
c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc

git branch --show-current
main

git ls-remote origin refs/heads/main
c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc	refs/heads/main
```

PASS remoto del container docs corrente: **EXTERNAL_ONLY**.

## HISTORY

- `1cb1e06ceadf0bed08b0f054512c0b5311592d3a` — METHOD-LAST-CURSOR-REPORT-FULL-A (docs/method).
- `d0e08bf5d803bf9547ddc750197ae82e63399886` — FIX5 REVIEW PASS + deploy + ABQA FAIL.

## LIMITI

* Non sostituisce FRONTIER.
* Non certifica PASS operatore.
* Non prova il proprio HEAD finale.
* Non deploy / non ABQA in questo pass.
