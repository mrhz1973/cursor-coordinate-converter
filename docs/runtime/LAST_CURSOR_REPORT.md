# LAST CURSOR REPORT

> Rolling handoff **completo** dell’ultimo pass Cursor. **Non** LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).  
> Contratto: header sintetico (A) + RIEPILOGO COMPLETO (B) + output git (C).  
> Disciplina F3: questo file **non** attesta il proprio HEAD finale.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `CARTO-IIM-PROVIDER-A` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA FINALE CHATGPT candidate 230 |
| **Runtime LIVE** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` · build **228** · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` · helper **0.1.3** · blob `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| **Candidate FULL SHA** | `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` |
| **Build / ID / blob** | **230** / `CARTO-IIM-PROVIDER-A` / `faa7499c178d53f3a2b68bb35cb9089579e30240` |
| **Deployed state** | GIS VPS **230** `?v=8d6e0b0` · LIVE FRONTIER resta **228** fino a QA |
| **Result Cursor** | REVIEW PASS · deploy GIS PASS · ABQA PASS · **no** QA operatore · **no** finito |
| **Working tree (pre-docs-container)** | HTML invariato `8d6e0b0`; docs FRONTIER/WU/inbox/report pending this container |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `87e2ec373460dc608bcc27b83e0084fd9ac1a3a8` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` (runtime immutato; questo pass = deploy+ABQA+docs) |
| **previous_report_container** | `87e2ec373460dc608bcc27b83e0084fd9ac1a3a8` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

HTML candidate: bytes LF **10795338** · SHA-256 LF `46d0a6b053847f2f94f861817fbabe3b5c2f8613bac8a7458f318254fe47b5c1` · blob `faa7499c178d53f3a2b68bb35cb9089579e30240`

URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=8d6e0b0`  
Evidence: [`docs/orchestrator/inbox/2026-08-19_0110_carto-iim-provider-a-deploy-abqa.md`](../orchestrator/inbox/2026-08-19_0110_carto-iim-provider-a-deploy-abqa.md)

## B. RIEPILOGO COMPLETO

1. Autosync orchestratore: **sì** (questo container). File: FRONTIER, WU-0012, latest, inbox 0110 deploy-abqa + JSON ABQA, LAST_CURSOR_REPORT. Monolite **escluso** (identità 230 immutata).
2. `git status --short` (pre-docs): `M docs/FRONTIER.md` `M docs/orchestrator/latest.md` `M docs/work-units/WU-0012-carto-index-federated.md` `?? inbox/2026-08-19_0110_*` + helper untracked.
3. `git diff --stat` runtime: **vuoto** (nessuna modifica HTML).
4. File docs: FRONTIER, WU-0012, latest, `inbox/2026-08-19_0110_carto-iim-provider-a-deploy-abqa.md`, `inbox/2026-08-19_0110_carto-iim-provider-a-abqa.json`, LAST_CURSOR_REPORT.
5. Regioni HTML: **non toccate**.
6. Cosa fatto: registrato REVIEW PASS; hard-guard identità 230; deploy GIS-only exact SHA; ABQA A–H + selftest live PASS; gate → QA FINALE CHATGPT PENDING.
7. Cosa rimosso: niente.
8. Funzioni: nessuna patch; usate `openCartoIgmPanel`, `GOICartoIndex.selfTest/searchBbox`, `cartoTryProviderRefresh`, `renderTileMap`.
9. i18n: non toccato.
10. Non toccato: Oggetti GIS; Planet-Clone; helper 0.1.3; UKHO runtime (resta assente); LIVE 228; QA operatore; finito; build 231.
11. Lint/selftest: identity PASS; deploy HTTP MATCH; ABQA 48/48 PASS; `GOICartoIndex.selfTest()` live PASS; console rel=0; zero fetch IIM/UKHO.
12. Planet-Clone: **nessun commit**.
13. UKHO: NOT OPENED / DISCOVERY BLOCKED invariato; 0 `#cartoUkhoEmbeddedData` sul file servito.
14. Limiti: LIVE FRONTIER resta 228 fino a QA ChatGPT; finding 2/326 non-bloccanti.

## C. OUTPUT GIT (pre-docs-container)

```
87e2ec3 docs(orchestrator): CARTO-IIM-PROVIDER-A candidate 230 review pending
8d6e0b0 feat(carto): split IIM snapshot provider from blocked UKHO, build 230
6f6c24e docs(orchestrator): CARTO-IIM-UKHO-PROVIDERS-A candidate 229 review pending
a0e439e feat(carto): federate IIM footprints and UKHO CAL metadata, build 229
15e5fba docs(orchestrator): FIX6 QA PASS operatore, CLOSED / PASS, LIVE 228
```

- `git rev-parse HEAD` (pre-docs): `87e2ec373460dc608bcc27b83e0084fd9ac1a3a8`
- `git rev-parse origin/main` (evidence time): `87e2ec373460dc608bcc27b83e0084fd9ac1a3a8`
- `git branch --show-current`: `main`
- HTML blob: `faa7499c178d53f3a2b68bb35cb9089579e30240`
- `git ls-remote origin refs/heads/main`: **EXTERNAL_ONLY** (dopo push)

## STATO FRESCO DA CURSOR

```
STATO FRESCO DA CURSOR
origin/main HEAD: EXTERNAL_ONLY (pre-push evidence 87e2ec3)
working tree: helper untracked; HTML 8d6e0b0
ultimo blocco PASS: OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6 (LIVE 228)
prossimo candidato: CARTO-IIM-PROVIDER-A 230 QA FINALE CHATGPT PENDING (GIS deployed)
note operative: NON QA operatore / NON finito; UKHO DISCOVERY BLOCKED / NOT OPENED
```
