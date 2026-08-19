# LAST CURSOR REPORT

> Rolling handoff **completo** dell’ultimo pass Cursor. **Non** LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).  
> Contratto: header sintetico (A) + RIEPILOGO COMPLETO (B) + output git (C).  
> Disciplina F3: questo file **non** attesta il proprio HEAD finale.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `CARTO-IIM-PROVIDER-A-FIX1` |
| **GATE** | **REVIEW GPT-SOSTITUTIVA — PENDING** |
| **NEXT** | REVIEW GPT-SOSTITUTIVA candidate 231 |
| **Runtime LIVE** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` · build **228** · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` · helper **0.1.3** · blob `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| **Candidate FULL SHA** | `f90c503355d7c98eaf300f7f1afe647102a2330f` |
| **Build / ID / blob** | **231** / `CARTO-IIM-PROVIDER-A-FIX1` / `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` |
| **Deployed state** | GIS VPS resta **230** `?v=8d6e0b0` · **231 non deployato** · LIVE FRONTIER resta **228** |
| **Result Cursor** | FIX runtime 231 · selftest PASS · **no** review · **no** deploy · **no** ABQA · **no** QA operatore · **no** finito |
| **Working tree (pre-docs-container)** | HTML committed `f90c503`; docs FRONTIER/WU/inbox/report pending this container |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `f90c503355d7c98eaf300f7f1afe647102a2330f` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `dbdb00872e63552a2ac2633d17640fd36d4be6f5` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `f90c503355d7c98eaf300f7f1afe647102a2330f` |
| **previous_report_container** | `dbdb00872e63552a2ac2633d17640fd36d4be6f5` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

HTML candidate: bytes LF **10796791** · SHA-256 LF `42b822cc05404443736b90cfe613c12731a020c3b44d29dad004c1c4fafb9280` · blob `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038`

Evidence: [`docs/orchestrator/inbox/2026-08-19_0150_carto-iim-provider-a-fix1.md`](../orchestrator/inbox/2026-08-19_0150_carto-iim-provider-a-fix1.md)

## B. RIEPILOGO COMPLETO

1. Autosync orchestratore: **sì** (questo container). File: FRONTIER, WU-0012, latest, inbox 0150, LAST_CURSOR_REPORT. Monolite **escluso** da questo commit (già in `f90c503`).
2. `git status --short` (pre-docs): docs FRONTIER/WU/latest/inbox/report dirty; HTML pulito su `f90c503`.
3. `git diff --stat` runtime: nel `real_task_commit` HTML + patcher FIX1 + probe uncheck + nota `_patch_html_fed.py`.
4. File docs: FRONTIER, WU-0012, latest, `inbox/2026-08-19_0150_carto-iim-provider-a-fix1.md`, LAST_CURSOR_REPORT.
5. Regioni HTML: `cartoUiGetState` (rimosso re-push `"paper"`); `cartoDiagSelfTest` (`filter_iim_uncheckable` / `filter_igm_uncheckable`); identità `APP_BUILD_ID`/`APP_BUILD_NUM` 231; pin selftest storici 230→231.
6. Cosa fatto: FIX QA FAIL filtro IIM; default init con `"paper"` invariato; `_cartoUi` resta transiente.
7. Cosa rimosso: `state._cartoUi.selectedSeries.push("paper")` su ogni get.
8. Funzioni: `cartoUiGetState`, `cartoDiagSelfTest`, `onFilter` / `cartoUiRenderPanel` (non riscritte; cessano di re-spuntare).
9. i18n: non toccato (nessuna stringa nuova).
10. Non toccato: Oggetti GIS; Planet-Clone; helper 0.1.3; UKHO runtime (resta assente); LIVE 228; GIS VPS 230; deploy; ABQA; QA operatore; finito; payload IGM.
11. Lint/selftest: `selftest_carto_providers.py` PASS; `GOICartoIndex.selfTest()` PASS (IGM 8204, IIM 180, tot 8384, UKHO assente, uncheck IIM/IGM); `_probe_iim_filter_uncheck.py` PASS.
12. Planet-Clone: **nessun commit**.
13. UKHO: NOT OPENED / DISCOVERY BLOCKED invariato; 0 `#cartoUkhoEmbeddedData`.
14. Limiti: 231 in REVIEW, non deployato; finding 2/326 invariati.

## C. OUTPUT GIT (pre-docs-container)

```
f90c503 feat(carto): allow unchecking IIM nautical chart filter, build 231
dbdb008 docs(orchestrator): CARTO-IIM-PROVIDER-A REVIEW PASS, GIS deploy + ABQA PASS
87e2ec3 docs(orchestrator): CARTO-IIM-PROVIDER-A candidate 230 review pending
8d6e0b0 feat(carto): split IIM snapshot provider from blocked UKHO, build 230
6f6c24e docs(orchestrator): CARTO-IIM-UKHO-PROVIDERS-A candidate 229 review pending
```

- `git rev-parse HEAD` (pre-docs): `f90c503355d7c98eaf300f7f1afe647102a2330f`
- `git rev-parse origin/main` (evidence time): `dbdb00872e63552a2ac2633d17640fd36d4be6f5`
- `git branch --show-current`: `main`
- HTML blob: `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038`
- `git ls-remote origin refs/heads/main`: **EXTERNAL_ONLY** (dopo push)

## STATO FRESCO DA CURSOR

```
STATO FRESCO DA CURSOR
origin/main HEAD: EXTERNAL_ONLY (pre-push evidence dbdb008; local candidate f90c503)
working tree: helper untracked; HTML f90c503
ultimo blocco PASS: OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6 (LIVE 228)
prossimo candidato: CARTO-IIM-PROVIDER-A-FIX1 231 REVIEW PENDING (230 QA FAIL filtro IIM)
note operative: NON deploy / NON ABQA / NON QA operatore / NON finito; UKHO DISCOVERY BLOCKED / NOT OPENED; GIS VPS resta 230
```
