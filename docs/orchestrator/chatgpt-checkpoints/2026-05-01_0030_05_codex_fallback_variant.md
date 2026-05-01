# Checkpoint ChatGPT esteso — 05 Variante Codex fallback

**Data:** 2026-05-01  
**Scopo:** mantenere aperte due modalità operative: Cursor quando disponibile, Codex quando Cursor non è utilizzabile per circa 20 giorni.

---

## 1. Premessa

L’utente potrebbe non poter usare Cursor per circa 20 giorni. In quel periodo si userà Codex al posto di Cursor come implementatore.

Questa variante non sostituisce il workflow Cursor. Aggiunge un percorso parallelo.

---

## 2. Due opzioni aperte

### Opzione A — Cursor disponibile

Continuare con il workflow normale:

1. ChatGPT pianifica e prepara prompt Cursor.
2. Cursor implementa.
3. Utente riporta riepilogo, `git status --short`, `git diff --stat`.
4. ChatGPT verifica.
5. A fine sessione, l’utente usa `finito` in Cursor.
6. Cursor aggiorna docs, commit, push e orchestratore.

### Opzione B — Cursor non disponibile, usare Codex

Durante il blocco Cursor, Codex sostituisce Cursor come implementatore.

Regole:

1. ChatGPT resta cervello operativo.
2. Codex esegue modifiche tecniche.
3. ChatGPT deve preparare prompt Codex più espliciti rispetto a Cursor.
4. Codex deve rispettare gli stessi vincoli del progetto.
5. Ogni intervento deve restare piccolo e verificabile.
6. Non cambiare architettura.
7. Non introdurre framework, npm, bundler, TypeScript, ES modules o split operativo.

---

## 3. Differenza pratica Cursor vs Codex

Cursor aveva:

- progetto locale aperto;
- rules `.cursor/rules/`;
- workflow `finito`;
- memoria orchestratore;
- possibilità di lavorare direttamente nel workspace.

Codex potrebbe non avere automaticamente tutto questo contesto.

Quindi ChatGPT deve includere nei prompt Codex:

- file da leggere;
- vincoli hard;
- area del monolite da toccare;
- cosa non toccare;
- test richiesti;
- output richiesto;
- indicazione chiara di non fare refactor globale.

---

## 4. Prompt Codex: struttura standard

Quando si usa Codex, ChatGPT deve separare:

1. istruzioni esterne per l’utente;
2. prompt pulito per Codex.

Schema consigliato:

```text
Modalità consigliata: Codex / code editing
File da allegare o rendere disponibili:
- coordinate_converter Claude.html
- docs/roadmap.md
- docs/checkpoint.md
- docs/PROJECT_notes.md
- docs/session-geolocalizzazione-e-mappa.md
- docs/orchestrator/latest.md

Dopo Codex riportami:
- riepilogo Codex
- git status --short
- git diff --stat
- eventuali errori/test
```

Il prompt a Codex deve essere più completo di un prompt Cursor perché non si può assumere che legga automaticamente le rules Cursor.

---

## 5. Vincoli da ripetere sempre a Codex

Ogni prompt Codex operativo deve includere almeno:

- file canonico: `coordinate_converter Claude.html`;
- deliverable: singolo HTML standalone;
- vanilla JS;
- no framework;
- no TypeScript;
- no npm;
- no bundler;
- no ES modules;
- no split operativo;
- no refactor globale;
- no codice non correlato;
- i18n IT/EN/FR per ogni testo visibile;
- `data-i18n` sicuro;
- OPSEC e offline-first da rispettare;
- nessun GPS silenzioso;
- nessuna rete automatica;
- non toccare tile/cache/offline se il task non lo richiede.

---

## 6. GitHub durante periodo Codex

Senza Cursor, GitHub resta ancora più importante.

ChatGPT deve usare:

```text
aggio
```

per leggere:

```text
docs/orchestrator/latest.md
docs/orchestrator/inbox/
docs/orchestrator/chatgpt-checkpoints/
```

Se Codex produce commit/push, l’utente deve riportare:

```text
git status --short
git diff --stat
commit hash
push status
```

Se Codex non aggiorna `docs/orchestrator/latest.md`, ChatGPT può mantenere memoria tramite checkpoint ChatGPT, ma deve segnalare che l’orchestratore ufficiale potrebbe essere indietro.

---

## 7. Fine sessione senza Cursor

Se Cursor non è disponibile, il comando `finito` potrebbe non esistere.

Alternativa manuale/assistita con Codex:

1. Codex implementa il blocco.
2. Esegue test richiesti.
3. Aggiorna, se possibile:
   - `docs/orchestrator/latest.md`
   - un file in `docs/orchestrator/inbox/`
4. Commit e push.
5. Riporta commit hash e repo pulito.

ChatGPT deve essere esplicito: questo è un fallback, non il flusso preferito quando Cursor è disponibile.

---

## 8. Regola anti-confusione

Quando l’utente dice “vai” o chiede un prompt, ChatGPT deve prima capire quale implementatore si userà:

- Cursor disponibile → prompt Cursor;
- Cursor non disponibile → prompt Codex.

Se l’utente ha già detto che Cursor non è disponibile, assumere Codex come default fino a nuova indicazione.

---

## 9. Prossimo blocco già noto

Stato attuale al momento di questa variante:

- Range Rings UI Blocco 1 risulta implementato e pushato secondo `latest.md`;
- prossimo passo reale: QA Range Rings in browser;
- dopo QA, possibile backlog 5F: drag avanzato anelli / spostamento centro / editing mappa.

Se Cursor non è disponibile e si prosegue con Codex, il primo task Codex non deve essere una nuova feature grande: deve essere prima verifica/QA o microfix derivato dal QA.

---

## 10. Regola finale

Tenere aperte entrambe le opzioni:

- Cursor quando torna disponibile;
- Codex come implementatore temporaneo.

ChatGPT resta il punto di coordinamento e deve mantenere continuità tramite GitHub, `aggio` e checkpoint ChatGPT.
