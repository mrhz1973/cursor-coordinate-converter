# Riepilogo — QA-CHATGPT-3LINE-HANDOFF-PREF (docs-only)

**Data:** 2026-08-02  
**Tipo:** docs-only (nessuna QA runtime, nessun deploy)

## Commit task

- **Hash:** `2072b7acd1fa57c2e1058b4fce15db000f86937f`
- **Subject:** `docs: route operator QA through ChatGPT three-line format`
- **Push task:** riuscito (`8d48f62..2072b7a`)

## Cosa è stato fatto

1. OM §4: Regola D aggiornata (superseded nel formato); **Regola D2** prevalente (QA ChatGPT a tre righe).
2. Sequenza runtime + template coda bundle: Cursor non emette QA; gate `QA FINALE CHATGPT — PENDING`.
3. `docs/QA-CHECKLIST.md`: procedura canonica Dove/Azione/Risultato atteso; template ChatGPT; istruzioni Cursor post-deploy; coda bundle allineata.
4. `docs/HANDOFF.md`: ruoli / disciplina / PASS aggiornati.
5. Roadmap: nota metodologica D2 + prossimo ordine.
6. OM §7: voce **QA-CHATGPT-3LINE-HANDOFF-PREF CLOSED / PASS docs-only**.

## Runtime

- Tip invariato: `1f7c05f` / `B6.5RGM-A-FIX2 · build 101`
- Blob invariato: `c1fc1ca4cad61105893bd948c6262f962ff2c2cb`
- Monolite **escluso** dal commit

## Invarianti

- Regola H intatta (PASS → auto-finito)
- Bundle F **non** aperto
- Oggetti GIS **FROZEN**
- Fail-closed / D1 IT / etichette UI invariati

## Stato pre-autosync

- `git status --short`: vuoto dopo push docs
- Prossimo candidato: Bundle F (non aperto)

## Limiti

- Fatti del commit autosync corrente: **EXTERNAL_ONLY**
- `.cursor/rules` (es. 30-output-workflow) possono ancora citare «QA minima narrativa» da Cursor — backlog di allineamento rules non in questo blocco
