# DOCS-AUTOMATED-BROWSER-QA-PREOP-A — riepilogo

**Data:** 2026-08-11 ~22:05 Europe/Rome  
**Tipo:** DOCS / METHOD only  
**Gate:** `DOCS-AUTOMATED-BROWSER-QA-PREOP-A CLOSED / PASS DOCS-ONLY`  
**Baseline pre-task:** `62a81c80d4a3e8cde62b05700245fb91719fbab5`

## Cosa è stato fatto

Introdotto come default permanente il gate **AUTOMATED BROWSER QA PRE-OPERATORE** (`AUTOMATED-BROWSER-QA-PREOP`), eseguito da Cursor dopo deploy tecnico PASS e **prima** della QA finale ChatGPT/operatore.

## File modificati (commit task)

- `docs/OPERATING_MEMORY.md` — §4 Regola D2bis + D2 aggiornata; sequenza runtime; template coda; §7 voce chiusura
- `docs/QA-CHECKLIST.md` — principi tre gate; sezione Automated Browser QA; procedura/template ChatGPT; coda bundle
- `docs/HANDOFF.md` — ruoli Cursor, disciplina QA, tabella PASS
- `.cursor/rules/30-output-workflow.mdc` — post-deploy / tre gate / D2bis
- `.cursor/rules/31-qa-single-message.mdc` — trigger ChatGPT dopo Automated Browser QA PASS/N/A

## Non toccati

- `coordinate_converter Claude.html`
- build / runtime / VPS / WU-0013 feature
- `README.md` (read-set invariato)
- `docs/runtime/VPS_DEPLOY_RUNTIME.md` (nessuna sequenza normativa post-deploy→QA FINALE da aggiornare)

## Sequenza runtime finale

1. implementazione  
2. controlli tecnici  
3. pubblicazione  
4. deploy tecnico PASS  
5. Automated Browser QA Cursor  
6. solo se PASS/N/A → `QA FINALE CHATGPT — PENDING`  
7. ChatGPT QA umana residua (`Dove:` / `Azione:` / `Risultato atteso:`)  
8. operatore  
9. `QA <BLOCK-ID> PASS|FAIL operatore`  
10. Regola H / finito / autosync

## Semantica attestazioni

- `AUTOMATED BROWSER QA <BLOCK-ID> PASS|FAIL|NOT APPLICABLE` — Cursor  
- `QA <BLOCK-ID> PASS operatore` — solo umano (Cursor non può emetterla)

## QA

- Automated Browser QA: N/A (docs-only)  
- QA operatore: N/A (docs-only)

## Monolite

Escluso / invariato.

## Note F3

Commit task reale (noto pre-autosync): `9508139e2664b838bedd0312f7cf7e644ecbda2b`.  
Fatti del commit autosync corrente (SHA, push, HEAD finale): **EXTERNAL_ONLY** — non autorati qui.
