# METHOD-QA-PASS-AUTO-FINITO — codifica regola auto-finito dopo QA PASS

**Data:** 2026-06-28  
**Tipo:** docs/rules-only — nessun runtime, nessun deploy  
**Commit task:** `78ea6c9440943308d7588652167022f36a270352` — `docs(method): auto-run finito after bundle QA pass`

## Cosa è stato fatto

Codificata la regola **QA-PASS AUTO-INNESCA FINITO** (METHOD-QA-PASS-AUTO-FINITO):

- Nei prompt **bundle runtime**, la coda `finito` è **pre-autorizzata** nel prompt.
- **Trigger:** riga esatta `QA <BLOCK-ID> PASS operatore`.
- Cursor esegue **automaticamente** chiusura docs (OM §7, roadmap/WU, QA-CHECKLIST, HANDOFF se previsti), autosync orchestratore, commit/push, verifica HEAD = origin/main = ls-remote, workspace pulito.
- **Non** chiedere un secondo messaggio «finito» / «ora lancia finito» dopo QA PASS di bundle autorizzato.
- La chiusura docs resta **obbligatoria**; saltarla = OM §7 stale = errore di metodo.
- **Eccezioni** (no auto): read-only/diagnosi; review Claude pendente; review sostitutiva GPT non loggata; errori; scope drift; workspace sporco; deploy/smoke non PASS; prompt senza coda pre-autorizzata.

## File modificati (commit task)

| File | Modifica |
| --- | --- |
| `docs/OPERATING_MEMORY.md` | §4 Regola A aggiornata; **Regola H** nuova; Regola B/D aggiornate; template coda bundle |
| `.cursor/rules/30-output-workflow.mdc` | Sezione METHOD-QA-PASS-AUTO-FINITO; QA minima → trigger auto-finito |
| `docs/QA-CHECKLIST.md` | Template coda prompt bundle canonico; nota post-QA PASS |
| `README.md` | Bootloader regole #2 e #5 (auto-finito) |
| `docs/HANDOFF.md` | Disciplina Cursor + metodo vivo |

## Monolite

- **Invariato** nel commit task: blob `71e353ee85c15bf2713bc7998c72582f81723ec5`
- Runtime VPS live: `7b8cf04` (build 15) — invariato
- `coordinate_converter Claude.html` **escluso** dal commit task e dall'autosync

## QA / verifiche

- `git diff --check`: PASS
- `git ls-remote origin refs/heads/main` pre-flight: `c1d61e26…` (match atteso)
- Post-push task: HEAD = origin/main = ls-remote = `78ea6c9…`
- QA operatore: **non applicabile** (blocco metodo docs-only)
- `node --check`: non eseguito (nessuna modifica JS)

## Push commit task

Push task **riuscito** (`c1d61e2..78ea6c9 main -> main`).

## Prossimo passo

Bundle runtime successivo da roadmap/backlog con template coda pre-autorizzata; dopo deploy + `QA <BLOCK-ID> PASS operatore` → finito automatico senza hop GPT «ora lancia finito».

## Rischi residui

- Bundle delicati: auto-finito solo dopo review richiesta completata e loggata.
- Prompt bundle legacy senza coda pre-autorizzata: comportamento manuale invariato.
