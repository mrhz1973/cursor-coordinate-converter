# DOCS-QA-HUMAN-SHORT-TARGETED-A

Data: 2026-08-13 (~02:38 +02)  
Tipo: docs/workflow only — **NO runtime, NO deploy, NO finito**

## Obiettivo

Rendere permanente il formato QA operatore **corta e mirata** (`QA-HUMAN-SHORT-TARGETED`) per nuove chat ChatGPT.

## Baseline

- HEAD pre-task: `b4d3662baea9104bee49ddeddbffffaad24380bc`
- branch `main`, workspace pulito, allineato a ls-remote

## Task commit

- SHA: `6ca86c84c451283ba267aa523048b672a70b5e9d`
- subject: `docs(method): standardize short targeted operator QA`

## File modificati (task)

1. `docs/OPERATING_MEMORY.md` — Regola D2 + sequenza §4 punto 7
2. `docs/QA-CHECKLIST.md` — Principi, procedura, template, legacy pointer, footer Cursor
3. `README.md` — boot AI punto 7 (richiamo breve)
4. `docs/HANDOFF.md` — bullet vivo + tabella CLOSED/SUPERSEDED
5. `.cursor/rules/31-qa-single-message.mdc` — formato vivo SHORT-TARGETED
6. `.cursor/rules/30-output-workflow.mdc` — sezione QA post-deploy punto 5

## Nuova regola (sintesi)

- Automated Browser QA = tecnico approfondito
- QA operatore = residuo umano corto (di solito 3–6 casi con `atteso:`)
- un solo messaggio ChatGPT dopo `QA FINALE CHATGPT — PENDING`
- non obbligatorio `Dove:` / `Azione:` / `Risultato atteso:`
- fail-closed + Regola H auto-finito invariati

## SUPERSEDED

`QA-CHATGPT-3LINE-HANDOFF-PREF` — SUPERSEDED **per il formato** (resta CLOSED storico)

## Storico lasciato invariato

- inbox orchestratore precedenti
- sezioni CLOSED di QA-CHECKLIST
- WU CLOSED bullets storici
- citazioni storiche in piani inbox

## Invariati

- Regola D1 (IT + UI visibile)
- Regola D2bis (Automated Browser QA)
- Regola H (auto-finito)
- monolite / helper / VPS / runtime

## Limiti

- SHA/push del commit autosync corrente = EXTERNAL_ONLY
- NO FINITO
