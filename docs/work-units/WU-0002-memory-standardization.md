# WU-0002 — Memory standardization wiki-LLM

**Stato:** PREPARED

**Scopo:** migrare la memoria del repo GIS verso il modello wiki-LLM lean.

**Fonte piano approvato:** [`docs/orchestrator/inbox/2026-06-14_0016_plan_memory-standardization-wiki-llm.md`](../orchestrator/inbox/2026-06-14_0016_plan_memory-standardization-wiki-llm.md)

---

## Fasi

| Fase | Descrizione | Stato |
| --- | --- | --- |
| Fase 1 | Piano approvato salvato in inbox (`4d52e8c`) | PASS |
| Fase 2a | Creare modello memoria (README, OPERATING_MEMORY, WU-0001/0002) | PASS |
| Fase 2b | Marcare legacy: checkpoint / session / latest / chatgpt-checkpoint | PASS |
| Fase 3 | Flip atomico rules + aggio ChatGPT | PASS |
| Fase 4 | Autosync finale | PENDING |
| Fase 5 | Verifica successo nuova chat/agente | PENDING |

---

## Fase 3 — esito

Flip atomico read-set applicato in `.cursor/rules/00-project-core.mdc` e `.cursor/rules/30-output-workflow.mdc`:

- **Read-set corrente:** `README.md` + `docs/OPERATING_MEMORY.md` + WU corrente.
- **«Checkpoint md»** e **`finito`** non scrivono più `docs/checkpoint.md` / `docs/session-geolocalizzazione-e-mappa.md` come memoria primaria.
- **`aggio`** / **`aggio gis`** (repo GIS) puntano a OM + WU corrente (+ README snapshot se necessario); **`aggio control`** resta per control-plane.
- `docs/orchestrator/chatgpt-checkpoint.md` resta legacy, non fonte primaria.

---

## Decisioni ratificate

- Memoria agenti: `docs/OPERATING_MEMORY.md`
- Nessuno spostamento fisico dei vecchi file nella prima migrazione
- README: snapshot breve + descrizione + dettagli linkati
- Protocollo orchestratore minimo dentro OPERATING_MEMORY
- `chatgpt-checkpoint.md` declassato a legacy (Fase 2b)
- Read-set target: README + OPERATING_MEMORY + WU corrente
- Sul repo GIS, **`aggio`** e **`aggio gis`** equivalenti; su control-plane **`aggio control`**
- Trade-off: `aggio` secco non identifica il repo — responsabilità operatore
- Flip rules eseguito in Fase 3 (commit atomico)
- Piano-inbox separato da autosync finale (Fase 4 ancora pending)

---

## Criterio successo

Una nuova chat/agente deve poter ripartire leggendo solo:

- `README.md`
- `docs/OPERATING_MEMORY.md`
- WU corrente

---

## Doc gate lean

1. Read-set rispettato: README + OPERATING_MEMORY + WU corrente.
2. Un dato di stato aggiornato in un solo posto.
3. WU corrente aggiornata con stato PASS / FAIL / BLOCKED / PREPARED / PENDING.
4. Autosync separato dai docs operativi.
5. Nei blocchi docs-only, monolite non toccato.
