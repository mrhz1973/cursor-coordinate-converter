# LAST CURSOR REPORT

> Rolling handoff **completo** dell’ultimo pass Cursor. **Non** LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).  
> Contratto: header sintetico (A) + RIEPILOGO COMPLETO (B) + output git (C).  
> Disciplina F3: questo file **non** attesta il proprio HEAD finale.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA FINALE CHATGPT candidate 228 |
| **Runtime LIVE** | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` · build **220** · `OUTDOOR-ROUTING-ORS-PROVIDER-A` · helper **0.1.3** · blob `23fe93aae3c7c2c6f32dfdcaab90f2cc827e14a1` |
| **Candidate FULL SHA** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| **Build / ID / blob** | **228** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` / `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| **Deployed state** | **deployato GIS** (`?v=c5bc4b1`) · LIVE FRONTIER resta **220** |
| **Result Cursor** | REVIEW GPT-SOSTITUTIVA **PASS** · deploy GIS **PASS** · ABQA desktop **246/246** + mobile **13/13** **PASS** · **NON** QA operatore · **NON** finito |
| **Working tree (pre-docs-container)** | helper `_*.py` / `tmp/` untracked; HTML = candidate 228 pulito |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `f326552b655e43e0a30d6df319e3c671f8c63f8c` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| **previous_report_container** | `f326552b655e43e0a30d6df319e3c671f8c63f8c` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

Evidence: [`docs/orchestrator/inbox/2026-08-18_2203_outdoor-routing-f-provider-compare-a-fix6-deploy-abqa.md`](../orchestrator/inbox/2026-08-18_2203_outdoor-routing-f-provider-compare-a-fix6-deploy-abqa.md)

## B. RIEPILOGO COMPLETO — OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6

Pass REVIEW+deploy+ABQA. Runtime candidate **immutabile**. Nessuna patch monolite.

1. Autosync orchestratore: **sì** (questo container). File: FRONTIER, WU-0010 hot-header + voce FIX6, `latest.md`, inbox 2203 (md+json+screenshot), `LAST_CURSOR_REPORT.md`. Commit docs **EXTERNAL_ONLY**. Push **EXTERNAL_ONLY**. Monolite **escluso**.
2. `git status --short` (pre-docs): HTML pulito; helper `_*.py` / `tmp/` untracked.
3. `git diff --stat` runtime: nessuno in questo pass (candidate già in `c5bc4b1`).
4. File docs: FRONTIER, WU-0010, latest, inbox 2203, LAST_CURSOR_REPORT. Screenshot `abqa_fix6_{desktop,mobile}{,_params}.png` + JSON ABQA.
5. Regioni runtime: **non toccate**.
6. Cosa fatto: persistito REVIEW GPT-SOSTITUTIVA **PASS** sul FULL SHA `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc`; pre-deploy identity PASS (blob `225b1a7b…`, build 228); deploy GIS-only PASS; ABQA PASS 360×740.
7. Funzioni: nessuna modifica runtime. Harness ABQA (`_abqa_fix6_live.py`, non committed): 4 false-fail 227 corretti (cta `color(srgb)`+classe; same-row su larghezza pannello; abort compare prima single-GH; active chip pre-click + `bordActive`).
8. Chiavi i18n: nessuna.
9. Non toccato: monolite, helper 0.1.3, nav/GH/D-Flight/ORS/nginx PID (solo GIS restart `2803204`→`2805095`), OPSEC, GPS, Oggetti GIS, LIVE 220.
10. Lint: n/a. Selftest live **847/847 PASS** (RPCF6 18/18, RPCF5 28/28, RWF1 8/8). ABQA: desktop **246/246** + mobile **13/13** PASS. Network: 0 `api.openrouteservice.org`, 0 `Authorization`. Boot: 0 POST routing.
11. Deploy: VPS `f703cee`→`f326552`; HTTP bytes `10710401` SHA-256 `ba6df30dca84f31f38b80fd8d7a34f6f61d180473a78a65f2777451dde0124ce`. URL `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=c5bc4b1`.
12. Acceptance 360×740: tre chip visibili (Anello 62×27), wrap, `text-overflow:clip`, planner `sw≤cw+8`, pagina senza overflow, params integra.
13. Limiti: GATE **QA FINALE CHATGPT — PENDING**. LIVE 220. GIS VPS serve 228. **NON** QA operatore. **NON** finito.

```text
STATO FRESCO DA CURSOR
origin/main HEAD: f326552b655e43e0a30d6df319e3c671f8c63f8c (REMOTE_HEAD_AT_EVIDENCE_TIME; docs/report HEAD = EXTERNAL_ONLY)
working tree: helper _*.py / tmp/ untracked; HTML = candidate 228 pulito
ultimo blocco PASS: nessuno in attesa QA FINALE CHATGPT FIX6 228
prossimo candidato: QA FINALE CHATGPT candidate 228
note operative: deploy GIS 228 fatto; ABQA PASS; NON QA operatore; NON finito; LIVE resta 220
```

## C. OUTPUT GIT (pre-docs-container)

```text
git log --oneline -5
f326552 docs(orchestrator): FIX6 candidate 228 review pending (no deploy)
c5bc4b1 fix(routing): FIX6 mobile Percorso chips wrap, build 228
1cb1e06 docs(method): LAST_CURSOR_REPORT full rolling handoff for agg
d0e08bf docs(orchestrator): FIX5 REVIEW PASS + GIS deploy + ABQA FAIL
f703cee docs(orchestrator): REVIEW-RAW-RECOVERY-FIX5 evidence (candidate 227 immutable)

git rev-parse HEAD
f326552b655e43e0a30d6df319e3c671f8c63f8c

git rev-parse origin/main
f326552b655e43e0a30d6df319e3c671f8c63f8c

git branch --show-current
main

git ls-remote origin refs/heads/main
f326552b655e43e0a30d6df319e3c671f8c63f8c	refs/heads/main
```

PASS remoto del container docs corrente: **EXTERNAL_ONLY**.

## HISTORY

- `f326552b655e43e0a30d6df319e3c671f8c63f8c` — FIX6 candidate 228 review pending (no deploy).
- `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` — runtime FIX6 build 228 (`real_task_commit`).
- `1cb1e06ceadf0bed08b0f054512c0b5311592d3a` — METHOD-LAST-CURSOR-REPORT-FULL-A (docs/method).
- `d0e08bf5d803bf9547ddc750197ae82e63399886` — FIX5 REVIEW PASS + deploy + ABQA FAIL.

## LIMITI

* Non sostituisce FRONTIER.
* Non certifica PASS operatore.
* Non prova il proprio HEAD finale.
* QA FINALE CHATGPT PENDING; NON QA operatore; NON finito.
