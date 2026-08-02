# Riepilogo — QA-CHATGPT-3LINE-CURSOR-RULES-A (docs/rules-only)

**Data:** 2026-08-02  
**Tipo:** docs/rules-only (nessuna QA runtime, nessun deploy)

## Commit task

- **Hash:** `0703f92a77949ec0c6bab021ee0cbf0ad6ea6606`
- **Subject:** `docs(cursor): align QA workflow rules with ChatGPT handoff`
- **Push task:** riuscito (`101cc73..0703f92`)

## Cosa è stato fatto

1. Audit `.cursor/rules/**/*.mdc` (5 file): conflitto vivo solo in `30-output-workflow.mdc`.
2. Rimossa direttiva viva «QA minima narrativa» / «Cursor prepara per default».
3. Controlli monolite / test browser mancanti → dichiarare fatti + URL + `QA FINALE CHATGPT — PENDING`; non emettere QA.
4. Nuova sezione **QA operatore post-deploy (Regola D2)**: ChatGPT autore unico; Dove/Azione/Risultato atteso; dubbi→ChatGPT; Cursor solo attestazione finale; Regola H invariata.
5. OM §7: voce **QA-CHATGPT-3LINE-CURSOR-RULES-A CLOSED / PASS docs-only**.
6. HANDOFF snapshot + roadmap: chiusura e prossimo ordine aggiornati.

## Runtime

- Tip invariato: `1f7c05f` / `B6.5RGM-A-FIX2 · build 101`
- Blob invariato: `c1fc1ca4cad61105893bd948c6262f962ff2c2cb`
- Monolite **escluso** dal commit

## Occorrenze residue (non prescrittive)

- «QA minima narrativa» in `30-output-workflow.mdc`: solo come riferimento storico («sostituisce la vecchia…»).
- `**Azione:**` in Regola H: etichetta del bullet auto-finito, non formato QA.

## Invarianti

- Regola H intatta (PASS → auto-finito)
- Bundle F **non** aperto
- Oggetti GIS **FROZEN**
- Fail-closed / D1 IT / etichette UI / METHOD-BUNDLING / autosync a due commit invariati

## Stato pre-autosync

- `git status --short`: vuoto dopo push task
- Prossimo candidato: Bundle F (non aperto)

## Limiti

- Fatti del commit autosync corrente: **EXTERNAL_ONLY**
