# Riepilogo finito sessione — convenzione QA operatore minima narrativa

**Data:** 2026-06-22  
**Commit task:** `7dc30b9` — `docs: QA operatore minima narrativa come formato predefinito`  
**Push task:** riuscito (`e80ce79..7dc30b9` → `origin/main`)

## Cosa è stato fatto

Aggiornata la convenzione canonica QA operatore:

1. **Default:** QA minima narrativa (PASS tecnico + «Ora serve solo la QA operatore minima, senza Cursor» + URL runtime + pochi passaggi + risposta `QA <BLOCK-ID> PASS operatore`).
2. **Eccezione:** checklist estesa solo per OPSEC, rete/tile/proxy, cache/storage, migrazioni, architettura, diff multi-area, alto rischio, richiesta esplicita.
3. Fail-closed e distinzione PASS tecnico / PASS operatore invariati.

## File modificati

- `docs/QA-CHECKLIST.md` — riscrittura struttura default/eccezione + esempio generico
- `docs/OPERATING_MEMORY.md` — §4 Regola D + passo 5 sequenza blocco (QA condotta)
- `.cursor/rules/30-output-workflow.mdc` — sezione «QA operatore minima (default)» + allineamento controlli standard

## Non toccato

- `coordinate_converter Claude.html`
- `README.md`, roadmap, §7 stato operativo (salvo allineamento §4)
- `APP_BUILD_ID`

## QA

- `git diff --check` — OK
- Scope — solo 3 file target
- Test browser — N/A (docs/metodo)

## Prossimo passo

Applicare il nuovo formato QA minima ai prossimi blocchi di routine (es. QA pending B4X1).
