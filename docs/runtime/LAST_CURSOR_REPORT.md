# LAST CURSOR REPORT

> Rolling handoff **completo** dell’ultimo pass Cursor. **Non** LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).  
> Contratto: header sintetico (A) + RIEPILOGO COMPLETO (B) + output git (C).  
> Disciplina F3: questo file **non** attesta il proprio HEAD finale.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `CARTO-IIM-PROVIDER-A-FIX1` |
| **GATE** | **none** |
| **NEXT** | WU-0012 resto **NOT OPENED** (UKHO DISCOVERY BLOCKED · CIGA · online update · backlog UX) |
| **Runtime LIVE** | `f90c503355d7c98eaf300f7f1afe647102a2330f` · build **231** · `CARTO-IIM-PROVIDER-A-FIX1` · helper **0.1.3** · blob `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` |
| **Candidate FULL SHA** | — |
| **Build / ID / blob** | **231** / `CARTO-IIM-PROVIDER-A-FIX1` / `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` |
| **Deployed state** | GIS VPS **231** `?v=f90c503` · LIVE FRONTIER = **231** |
| **Result Cursor** | QA operatore **PASS** → auto-`finito` (Regola H) · docs-only · CLOSED / PASS |
| **Working tree (pre-docs-container)** | HTML invariato `f90c503`; docs FRONTIER/WU/OM/roadmap/latest/inbox/report pending this container |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `f90c503355d7c98eaf300f7f1afe647102a2330f` (ora LIVE; immutato) |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `23b3098e70ecb5bb2efac2a41cf17bebd8e910c6` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `f90c503355d7c98eaf300f7f1afe647102a2330f` (runtime immutato; questo pass = chiusura docs `finito`) |
| **previous_report_container** | `23b3098e70ecb5bb2efac2a41cf17bebd8e910c6` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

HTML LIVE: bytes LF **10796791** · SHA-256 LF `42b822cc05404443736b90cfe613c12731a020c3b44d29dad004c1c4fafb9280` · blob `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038`

URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=f90c503`  
Evidence finito: [`docs/orchestrator/inbox/2026-08-19_0627_carto-iim-provider-a-fix1-finito.md`](../orchestrator/inbox/2026-08-19_0627_carto-iim-provider-a-fix1-finito.md)  
Evidence deploy/ABQA: [`docs/orchestrator/inbox/2026-08-19_0215_carto-iim-provider-a-fix1-deploy-abqa.md`](../orchestrator/inbox/2026-08-19_0215_carto-iim-provider-a-fix1-deploy-abqa.md)

## B. RIEPILOGO COMPLETO

1. Autosync orchestratore: **sì** (questo container). File: FRONTIER, OM §7.2, WU-0012, roadmap CARTO-INDEX, latest, inbox 0627 finito + 0215 STOP, LAST_CURSOR_REPORT. Monolite **escluso** (identità 231 immutata).
2. `git status --short` (pre-docs): docs FRONTIER/WU/OM/roadmap/latest/inbox dirty; HTML pulito `f90c503`. Helper/script untracked **non** in commit.
3. `git diff --stat` runtime: **vuoto**.
4. File docs: FRONTIER, OPERATING_MEMORY §7.2, WU-0012, WU-0005-0009-roadmap, latest, `inbox/2026-08-19_0627_carto-iim-provider-a-fix1-finito.md`, `inbox/2026-08-19_0215_carto-iim-provider-a-fix1-deploy-abqa.md`, LAST_CURSOR_REPORT.
5. Regioni HTML: **non toccate**.
6. Cosa fatto: trigger `QA CARTO-IIM-PROVIDER-A-FIX1 PASS operatore` → coda `finito` Regola H. Promosso LIVE `f90c503` / **231**. GATE **none**. WU-0012 resta OPEN. §15k CLOSED end-to-end. Finding §15i risolto. OM §7.2 rotola FIX1 in testa (ORS esce dal rolling 5).
7. Cosa rimosso: niente runtime. Da §7.2 rolling: riga ORS-PROVIDER-A (resta in HISTORY/WU-0010).
8. Funzioni: nessuna patch.
9. i18n: non toccato.
10. Non toccato: monolite; helper 0.1.3; VPS redeploy; ABQA; build 232; HANDOFF.md; Oggetti GIS FROZEN; UKHO; backlog UX implementazione; Planet-Clone.
11. Lint/selftest: **non** rieseguiti (docs-only; ABQA 56/56 già PASS sul candidate immutato).
12. Planet-Clone: **nessun commit**.
13. UKHO: NOT OPENED / DISCOVERY BLOCKED.
14. Limiti: WU-0012 OPEN per CIGA/UKHO/online/backlog UX; finding shop 2/326 non-bloccante.

## C. OUTPUT GIT (pre-docs-container)

```
23b3098 docs(orchestrator): CARTO-IIM-PROVIDER-A-FIX1 REVIEW PASS, GIS deploy + ABQA PASS
f58ea52 docs(orchestrator): register CARTO/D-Flight/modal UX backlog from IIM QA
6a7073c docs(orchestrator): CARTO-IIM-PROVIDER-A-FIX1 candidate 231 review pending
f90c503 feat(carto): allow unchecking IIM nautical chart filter, build 231
dbdb008 docs(orchestrator): CARTO-IIM-PROVIDER-A REVIEW PASS, GIS deploy + ABQA PASS
```

- `git rev-parse HEAD` (pre-docs): `23b3098e70ecb5bb2efac2a41cf17bebd8e910c6`
- `git rev-parse origin/main` (evidence time): `23b3098e70ecb5bb2efac2a41cf17bebd8e910c6`
- `git branch --show-current`: `main`
- HTML blob: `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038`
- `git ls-remote origin refs/heads/main`: **EXTERNAL_ONLY** (dopo push)

## STATO FRESCO DA CURSOR

```
STATO FRESCO DA CURSOR
origin/main HEAD: EXTERNAL_ONLY (pre-push evidence 23b3098)
working tree: helper untracked; HTML f90c503
ultimo blocco PASS: CARTO-IIM-PROVIDER-A-FIX1 (LIVE 231)
prossimo candidato: resto WU-0012 NOT OPENED (UKHO DISCOVERY BLOCKED)
note operative: docs-only finito; nessun redeploy; UKHO DISCOVERY BLOCKED / NOT OPENED
```
