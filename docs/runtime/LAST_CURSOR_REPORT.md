# LAST CURSOR REPORT

> Rolling handoff **completo** dell’ultimo pass Cursor. **Non** LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).  
> Contratto: header sintetico (A) + RIEPILOGO COMPLETO (B) + output git (C).  
> Disciplina F3: questo file **non** attesta il proprio HEAD finale.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `CARTO-IIM-PROVIDER-A-FIX1` (invariato) |
| **GATE** | **REVIEW GPT-SOSTITUTIVA — PENDING** (invariato) |
| **NEXT** | REVIEW GPT-SOSTITUTIVA candidate 231 |
| **Runtime LIVE** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` · build **228** · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` · helper **0.1.3** |
| **Candidate FULL SHA** | `f90c503355d7c98eaf300f7f1afe647102a2330f` (invariato) |
| **Build / ID / blob** | **231** / `CARTO-IIM-PROVIDER-A-FIX1` / `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` |
| **Deployed state** | GIS VPS resta **230** `?v=8d6e0b0` · 231 **non** deployato · LIVE **228** |
| **Result Cursor** | **DOCS-ONLY** backlog QA CARTO-IIM · **no** runtime · **no** deploy · **no** ABQA · **no** QA operatore · **no** finito |
| **Working tree (pre-docs-container)** | HTML invariato `f90c503`; docs backlog pending this container |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `f90c503355d7c98eaf300f7f1afe647102a2330f` (invariato) |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `6a7073c639c00a64db5df39ee01985240dfc7e32` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | questo pass = docs-only (nessun commit runtime) |
| **previous_report_container** | `6a7073c639c00a64db5df39ee01985240dfc7e32` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

## B. RIEPILOGO COMPLETO

1. Autosync orchestratore: **sì** (questo container). FRONTIER **non** toccato. File: WU-0012 §15i/§15j, WU-0013 §23, roadmap, OM §7.3, latest, inbox 0205, LAST_CURSOR_REPORT. Monolite **escluso**.
2. `git status --short` (pre-docs): docs WU/roadmap/OM/latest/inbox/report dirty; HTML pulito su `f90c503`.
3. `git diff --stat` runtime: **vuoto**.
4. File docs: WU-0012, WU-0013, `WU-0005-0009-roadmap.md`, OM §7.3, latest, inbox `2026-08-19_0205_backlog_carto-iim-qa-ux.md`, LAST_CURSOR_REPORT.
5. Regioni HTML: **non toccate**.
6. Cosa fatto: registrati backlog **NOT OPENED** (search/filter/labelling CARTO; D-Flight close cleanup; global modal edge resize) + finding QA 230 filtro IIM distinto.
7. Cosa rimosso: niente.
8. Funzioni: nessuna.
9. i18n: non toccato.
10. Non toccato: FRONTIER LIVE STATE; WU-0012/0013 hot-header; candidate 231; GIS VPS 230; Oggetti GIS; Planet-Clone; helper; UKHO; deploy; ABQA; QA operatore; finito.
11. Lint/selftest: n/a (docs-only).
12. Planet-Clone: **nessun commit**.
13. UKHO: invariato.
14. Limiti: item **NOT OPENED**; finding 230 non corretto in questo pass.

## C. OUTPUT GIT (pre-docs-container)

```
6a7073c docs(orchestrator): CARTO-IIM-PROVIDER-A-FIX1 candidate 231 review pending
f90c503 feat(carto): allow unchecking IIM nautical chart filter, build 231
dbdb008 docs(orchestrator): CARTO-IIM-PROVIDER-A REVIEW PASS, GIS deploy + ABQA PASS
87e2ec3 docs(orchestrator): CARTO-IIM-PROVIDER-A candidate 230 review pending
8d6e0b0 feat(carto): split IIM snapshot provider from blocked UKHO, build 230
```

- `git rev-parse HEAD` (pre-docs): `6a7073c639c00a64db5df39ee01985240dfc7e32`
- `git rev-parse origin/main` (evidence time): `6a7073c639c00a64db5df39ee01985240dfc7e32`
- `git branch --show-current`: `main`
- HTML blob: `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` (invariato)
- `git ls-remote origin refs/heads/main`: **EXTERNAL_ONLY** (dopo push)

## STATO FRESCO DA CURSOR

```
STATO FRESCO DA CURSOR
origin/main HEAD: EXTERNAL_ONLY (pre-push evidence 6a7073c)
working tree: helper untracked; HTML f90c503
ultimo blocco PASS: OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6 (LIVE 228)
prossimo candidato: CARTO-IIM-PROVIDER-A-FIX1 231 REVIEW PENDING
note operative: docs-only backlog NOT OPENED; NON deploy / NON ABQA / NON QA operatore / NON finito
```
