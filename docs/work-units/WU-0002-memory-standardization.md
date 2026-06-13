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
| Fase 2b | Marcare legacy: checkpoint / session / latest / chatgpt-checkpoint | PENDING |
| Fase 3 | Flip atomico rules + aggio ChatGPT | PENDING |
| Fase 4 | Autosync finale | PENDING |
| Fase 5 | Verifica successo nuova chat/agente | PENDING |

---

## Decisioni ratificate

- Memoria agenti: `docs/OPERATING_MEMORY.md`
- Nessuno spostamento fisico dei vecchi file nella prima migrazione
- README: snapshot breve + descrizione + dettagli linkati
- Protocollo orchestratore minimo dentro OPERATING_MEMORY
- `chatgpt-checkpoint.md` declassato a legacy in Fase 2b
- Read-set target: README + OPERATING_MEMORY + WU corrente
- Sul repo GIS, **`aggio`** e **`aggio gis`** equivalenti; su control-plane **`aggio control`**
- Trade-off: `aggio` secco non identifica il repo — responsabilità operatore
- Flip rules nello stesso ciclo, ma **non** in Fase 2a (Fase 3)
- Piano-inbox separato da autosync finale

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
