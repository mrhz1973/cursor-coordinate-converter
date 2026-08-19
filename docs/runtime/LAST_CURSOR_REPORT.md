# LAST CURSOR REPORT

> Rolling handoff **completo** dell’ultimo pass Cursor. **Non** LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).  
> Contratto: header sintetico (A) + RIEPILOGO COMPLETO (B) + output git (C).  
> Disciplina F3: questo file **non** attesta il proprio HEAD finale.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `CARTO-IIM-PROVIDER-A-FIX1` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA FINALE CHATGPT candidate 231 |
| **Runtime LIVE** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` · build **228** · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` · helper **0.1.3** · blob `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| **Candidate FULL SHA** | `f90c503355d7c98eaf300f7f1afe647102a2330f` |
| **Build / ID / blob** | **231** / `CARTO-IIM-PROVIDER-A-FIX1` / `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` |
| **Deployed state** | GIS VPS **231** `?v=f90c503` · LIVE FRONTIER resta **228** fino a QA |
| **Result Cursor** | REVIEW PASS · deploy GIS PASS · ABQA PASS · **no** QA operatore · **no** finito |
| **Working tree (pre-docs-container)** | HTML invariato `f90c503`; docs FRONTIER/WU/inbox/report pending this container |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `f90c503355d7c98eaf300f7f1afe647102a2330f` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `f58ea5228d43cc8aed9c2d6f5693fe1fd8ebb57a` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `f90c503355d7c98eaf300f7f1afe647102a2330f` (runtime immutato; questo pass = deploy+ABQA+docs) |
| **previous_report_container** | `f58ea5228d43cc8aed9c2d6f5693fe1fd8ebb57a` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

HTML candidate: bytes LF **10796791** · SHA-256 LF `42b822cc05404443736b90cfe613c12731a020c3b44d29dad004c1c4fafb9280` · blob `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038`

URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=f90c503`  
Evidence: [`docs/orchestrator/inbox/2026-08-19_0215_carto-iim-provider-a-fix1-deploy-abqa.md`](../orchestrator/inbox/2026-08-19_0215_carto-iim-provider-a-fix1-deploy-abqa.md)

## B. RIEPILOGO COMPLETO

1. Autosync orchestratore: **sì** (questo container). File: FRONTIER, WU-0012, latest, inbox 0215 deploy-abqa + JSON ABQA, LAST_CURSOR_REPORT. Monolite **escluso** (identità 231 immutata).
2. `git status --short` (pre-docs): docs FRONTIER/WU/latest/inbox/report dirty; HTML pulito `f90c503`.
3. `git diff --stat` runtime: **vuoto**.
4. File docs: FRONTIER, WU-0012, latest, `inbox/2026-08-19_0215_carto-iim-provider-a-fix1-deploy-abqa.md`, `inbox/2026-08-19_0215_carto-iim-provider-a-fix1-abqa.json`, LAST_CURSOR_REPORT.
5. Regioni HTML: **non toccate**.
6. Cosa fatto: registrato REVIEW PASS; hard-guard identità 231; deploy GIS-only exact SHA; ABQA A–H + uncheck IIM + selftest live PASS; gate → QA FINALE CHATGPT PENDING.
7. Cosa rimosso: niente.
8. Funzioni: nessuna patch; usate `openCartoIgmPanel`, `GOICartoIndex.selfTest/searchBbox`, `cartoTryProviderRefresh`, `renderTileMap`.
9. i18n: non toccato.
10. Non toccato: Oggetti GIS; Planet-Clone; helper 0.1.3; UKHO runtime (resta assente); LIVE 228; QA operatore; finito; build 232; backlog UX futuro.
11. Lint/selftest: identity PASS; deploy HTTP MATCH; ABQA 56/56 PASS; `GOICartoIndex.selfTest()` live PASS (24/24); console rel=0; zero fetch IIM/UKHO.
12. Planet-Clone: **nessun commit**.
13. UKHO: NOT OPENED / DISCOVERY BLOCKED; 0 `#cartoUkhoEmbeddedData` sul file servito.
14. Limiti: LIVE FRONTIER resta 228 fino a QA ChatGPT; finding 2/326 non-bloccanti.

## C. OUTPUT GIT (pre-docs-container)

```
f58ea52 docs(orchestrator): register CARTO/D-Flight/modal UX backlog from IIM QA
6a7073c docs(orchestrator): CARTO-IIM-PROVIDER-A-FIX1 candidate 231 review pending
f90c503 feat(carto): allow unchecking IIM nautical chart filter, build 231
dbdb008 docs(orchestrator): CARTO-IIM-PROVIDER-A REVIEW PASS, GIS deploy + ABQA PASS
87e2ec3 docs(orchestrator): CARTO-IIM-PROVIDER-A candidate 230 review pending
```

- `git rev-parse HEAD` (pre-docs): `f58ea5228d43cc8aed9c2d6f5693fe1fd8ebb57a`
- `git rev-parse origin/main` (evidence time): `f58ea5228d43cc8aed9c2d6f5693fe1fd8ebb57a`
- `git branch --show-current`: `main`
- HTML blob: `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038`
- `git ls-remote origin refs/heads/main`: **EXTERNAL_ONLY** (dopo push)

## STATO FRESCO DA CURSOR

```
STATO FRESCO DA CURSOR
origin/main HEAD: EXTERNAL_ONLY (pre-push evidence f58ea52)
working tree: helper untracked; HTML f90c503
ultimo blocco PASS: OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6 (LIVE 228)
prossimo candidato: CARTO-IIM-PROVIDER-A-FIX1 231 QA FINALE CHATGPT PENDING (GIS deployed)
note operative: NON QA operatore / NON finito; UKHO DISCOVERY BLOCKED / NOT OPENED
```
