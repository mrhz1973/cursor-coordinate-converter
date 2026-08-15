# Riepilogo — CONTEXT-BUDGET-GUARD (docs-only)

## Task

- **SHA:** `2ab537668a7b9a590405278d36d9136c9d55f989`
- **Subject:** `docs: CONTEXT-BUDGET-GUARD in AI-BOOT + OM §4`
- **Push task:** riuscito

## File task

- `README.md` — solo blocco AI-BOOT (pointer CONTEXT GUARD + riga ON DEMAND)
- `docs/OPERATING_MEMORY.md` — solo §4: nuova **Regola CONTEXT-BUDGET-GUARD** dopo Regola I; cross-ref breve in Regola I §3

## Non toccati

- `coordinate_converter Claude.html`
- WU / roadmap / QA-CHECKLIST / helper / runtime / deploy
- OM §7 / hot-header WU (fuori scope esplicito)

## Controlli

- `git diff --check`: PASS
- Scope: 2 file docs
- Automated Browser QA: **NOT APPLICABLE** (docs-only)
- QA operatore runtime: non richiesta

## Contenuto regola (sintesi)

Tool discovery lean; letture mirate una sola volta; monolite compare→diff→simboli→range; niente fonti storiche per conferma; budget output connector; chiusura chat + nuova chat da CORE BOOT; precede «rileggi per sicurezza», integra Regola I.

## Limiti

Fatti del commit autosync corrente: **EXTERNAL_ONLY**.
