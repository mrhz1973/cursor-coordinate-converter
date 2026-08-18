# LAST CURSOR REPORT

> Rolling handoff **completo** dell’ultimo pass Cursor. **Non** LIVE STATE — prevale [`docs/FRONTIER.md`](../FRONTIER.md).  
> Contratto: header sintetico (A) + RIEPILOGO COMPLETO (B) + output git (C).  
> Disciplina F3: questo file **non** attesta il proprio HEAD finale.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5` |
| **GATE** | **AUTOMATED BROWSER QA — FAIL** |
| **NEXT** | FIX6 overflow mobile Percorso/Anello (candidate 227 immutabile) |
| **Runtime LIVE** | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` · build **220** · `OUTDOOR-ROUTING-ORS-PROVIDER-A` · helper **0.1.3** · blob `23fe93aae3c7c2c6f32dfdcaab90f2cc827e14a1` |
| **Candidate FULL SHA** | `118dc9d511c547f5032a7d0fd2f81dc65091b72a` |
| **Build / ID / blob** | **227** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5` / `20c09c0c23ab338082abef3b661bb079e32559d9` |
| **Deployed state** | GIS VPS serve 227 · ABQA FAIL · LIVE FRONTIER resta **220** |
| **Pass Cursor (questo file)** | `METHOD-LAST-CURSOR-REPORT-FULL-A` · docs/method only |
| **Result Cursor** | contratto handoff completo su `LAST_CURSOR_REPORT` + `agg`/nuova chat on-demand · **nessuna** patch runtime · FRONTIER/WU **invariati** |
| **Working tree (pre-container)** | helper `_*.py` / `tmp/` untracked; `coordinate_converter Claude.html` pulito |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `118dc9d511c547f5032a7d0fd2f81dc65091b72a` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `d0e08bf5d803bf9547ddc750197ae82e63399886` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` (container corrente; verifica esterna post-push) |
| **real_task_commit** | `118dc9d511c547f5032a7d0fd2f81dc65091b72a` (anchor runtime del blocco vivo; questo pass **non** ha commit monolite) |
| **previous_report_container** | `d0e08bf5d803bf9547ddc750197ae82e63399886` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

Evidence gate FIX5 (ABQA FAIL, non questo pass): [`docs/orchestrator/inbox/2026-08-18_2112_outdoor-routing-f-provider-compare-a-fix5-deploy-abqa.md`](../orchestrator/inbox/2026-08-18_2112_outdoor-routing-f-provider-compare-a-fix5-deploy-abqa.md)

## B. RIEPILOGO COMPLETO — METHOD-LAST-CURSOR-REPORT-FULL-A

**TYPE:** DOCS/METHOD ONLY. Obiettivo: l’operatore non deve più copiare/incollare in ChatGPT il riepilogo finale Cursor. GitHub contiene il report; l’operatore scrive `agg`.

1. Autosync orchestratore: **sì**. File: `docs/runtime/LAST_CURSOR_REPORT.md` (sovrascritto col contratto A/B/C), `docs/runtime/LAST_CURSOR_REPORT.template.md`, `README.md` blocco AI-BOOT, `docs/OPERATING_MEMORY.md` §4 / §6 `agg` / Regola I / CBG chiusura chat, `.cursor/rules/30-output-workflow.mdc`, `docs/orchestrator/latest.md`, inbox `2026-08-18_2126_method-last-cursor-report-full-a.md`. Commit/push docs: **EXTERNAL_ONLY** (container corrente). Monolite **escluso**. FRONTIER **non** toccato. WU gate/block **non** toccati.
2. `git status --short` (pre-container, path in scope): file method/docs modificati sotto; helper `_*.py` / `tmp/` untracked preesistenti; HTML pulito.
3. `git diff --stat` (pre-container): solo docs/method + rule 30 (+ template). Nessun diff monolite.
4. File modificati: `README.md` (AI-BOOT); `docs/OPERATING_MEMORY.md` (§4 LAST_CURSOR_REPORT, handoff paste, Regola I.2, CBG §6, alias `agg`); `.cursor/rules/30-output-workflow.mdc` (contratto report + autosync); `docs/runtime/LAST_CURSOR_REPORT.md`; `docs/runtime/LAST_CURSOR_REPORT.template.md`; `docs/orchestrator/latest.md`; inbox method.
5. Regioni toccate: AI-BOOT Principi + ON DEMAND; OM §4 bullet F3/handoff, §4 Regola I/CBG, §6 `agg`; rule 30 RIEPILOGO/autosync; template F3 + sezioni A/B/C.
6. Cosa fatto: contratto rolling handoff completo sul file esistente; `agg` = refresh minimo HEAD+FRONTIER+WU poi report **una volta**, coerenza BLOCK/CANDIDATE, FRONTIER prevale in conflitto; nuova chat = CORE BOOT invariato (4 passi) poi eventuale una lettura on-demand del report; autosync Cursor futuro deve scrivere A/B/C; mai paste operatore se GitHub ha il report (anche su FAIL prodotto).
7. Funzioni runtime: **nessuna**.
8. Chiavi i18n: **nessuna**.
9. Non toccato: `coordinate_converter Claude.html`; FRONTIER live state; WU-0010 gate/block; runtime/build 227; QA/deploy; helper 0.1.3; Oggetti GIS; `docs/roadmap.md`; checkpoint/session.
10. Lint / selftest / ABQA: n/a (docs/method). Nessun deploy. Nessuna QA operatore. **NON** finito (gate vivo resta ABQA FAIL FIX5).
11. Commit runtime: nessuno. Commit docs: questo container (`PENDING_SELF_REFERENCE`).
12. Evidence questo pass: inbox `2026-08-18_2126_method-last-cursor-report-full-a.md`. Evidence blocco vivo FIX5: inbox `2026-08-18_2112_outdoor-routing-f-provider-compare-a-fix5-deploy-abqa.md`.
13. Limiti / backlog: LIVE NEXT resta FIX6 overflow mobile Percorso/Anello; candidate 227 immutabile. Questo pass **non** corregge l’overflow. Report **non** sostituisce FRONTIER. HEAD del commit report = verifica esterna `git ls-remote`.

```text
STATO FRESCO DA CURSOR
origin/main HEAD: d0e08bf5d803bf9547ddc750197ae82e63399886 (REMOTE_HEAD_AT_EVIDENCE_TIME; docs/report HEAD = EXTERNAL_ONLY)
working tree: helper _*.py / tmp/ untracked; coordinate_converter Claude.html pulito
ultimo blocco PASS: nessuno (FIX5 ABQA FAIL resta il gate vivo)
prossimo candidato: FIX6 overflow mobile Percorso/Anello (227 immutabile)
note operative: METHOD-LAST-CURSOR-REPORT-FULL-A docs/method; FRONTIER invariato; NON QA operatore; NON finito
```

## C. OUTPUT GIT (pre-container — REMOTE_HEAD_AT_EVIDENCE_TIME)

```text
git log --oneline -5
d0e08bf docs(orchestrator): FIX5 REVIEW PASS + GIS deploy + ABQA FAIL
f703cee docs(orchestrator): REVIEW-RAW-RECOVERY-FIX5 evidence (candidate 227 immutable)
b9e560a docs(orchestrator): FIX5 candidate 227 review pending (no deploy)
118dc9d fix(routing): FIX5 compact params, track lifecycle, alt borders, ring+VIA, build 227
8fd4561 docs(orchestrator): FIX4-FIX1 REVIEW PASS + GIS deploy + ABQA PASS

git rev-parse HEAD
d0e08bf5d803bf9547ddc750197ae82e63399886

git rev-parse origin/main
d0e08bf5d803bf9547ddc750197ae82e63399886

git branch --show-current
main

git ls-remote origin refs/heads/main
d0e08bf5d803bf9547ddc750197ae82e63399886	refs/heads/main
```

PASS remoto del container corrente: **EXTERNAL_ONLY**.

## HISTORY

- `d0e08bf5d803bf9547ddc750197ae82e63399886` — docs FIX5 REVIEW PASS + GIS deploy + ABQA FAIL (report precedente abbreviato; evidence completa in inbox 2112).

## LIMITI

* Non sostituisce FRONTIER / WU hot-header / roadmap.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
* Non prova il proprio HEAD finale.
* Non è seconda LIVE STATE.
