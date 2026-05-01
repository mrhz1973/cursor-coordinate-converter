# Checkpoint ChatGPT esteso — 02 Workflow ChatGPT / Cursor / GitHub

**Data:** 2026-05-01

---

## 1. Ruoli

- ChatGPT: cervello, pianificazione, validazione, prompt.
- Cursor: implementazione codice.
- GitHub: stato persistente del progetto.

---

## 2. Workflow operativo standard

1. Idea / problema.
2. ChatGPT analizza e propone prossimo passo.
3. Utente conferma.
4. ChatGPT prepara prompt Cursor.
5. Cursor esegue.
6. Utente riporta output.
7. ChatGPT verifica diff/stato.
8. Iterazione.
9. Chiusura con `finito` in Cursor.

---

## 3. Comando `finito`

`finito` in Cursor significa:

- riepilogo finale;
- aggiornamento docs;
- commit;
- push;
- repo pulito.

ChatGPT NON deve proporre commit manuali nel flusso normale.

---

## 4. Regola fondamentale ChatGPT

Sempre:

- lavorare a piccoli blocchi;
- non generare prompt lunghi senza conferma;
- separare istruzioni esterne e prompt Cursor;
- non inserire spiegazioni nel prompt Cursor;
- non toccare codice non correlato.

---

## 5. Modalità Cursor

- Plan + Auto → architettura / feature complesse.
- Agent + Auto → fix e patch localizzate.
- Chat Cursor → analisi.
- Inline edit → micro modifiche.

---

## 6. Controlli post Cursor

Quando serve:

```bash
git status --short
git diff --stat
```

---

## 7. Uso orchestrator

Prima di decisioni:

- leggere `docs/orchestrator/latest.md`;
- leggere inbox rilevanti;
- usare `aggio` per riallinearsi.

---

## 8. Anti-pattern

Da evitare:

- riscrivere grandi blocchi;
- introdurre framework;
- modificare architettura senza approvazione;
- duplicare store dati;
- introdurre rete non controllata.
