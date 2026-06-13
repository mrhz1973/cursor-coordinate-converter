# WU-0002 — Memory standardization wiki-LLM

**Stato:** PASS (CLOSED)

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
| Fase 4 | Autosync finale | PASS |
| Fase 5 | Verifica + riallineamento read-set | PASS |

**Migrazione memoria wiki-LLM:** CLOSED / PASS

---

## Fase 5 — esito

**Test nuova chat/agente** (istanza Claude pulita, già eseguito): **PASS**

- Criterio: riparte dal read-set lean (`README.md` + `docs/OPERATING_MEMORY.md` + WU corrente) e non chiede file legacy come memoria primaria.
- Nota emersa: i tre file del read-set contenevano frasi stale (Fase 2a/4 pending, allineamento `4d52e8c`); riallineati in Fase 5.

**Audit rules** (sola lettura, nessuna modifica):

- `.cursor/rules/10*`, `20*`, `99*`: **PASS** — nessun riferimento legacy bloccante come current-state.
- Residuo riga ~141 in `30-output-workflow.mdc` («checkpoint ufficiali»): classificato **lessicale/non-bloccante** (prosa descrittiva, non trigger operativo); lasciato invariato.

**Pattern nomi inbox:** aggiunto in `docs/OPERATING_MEMORY.md` (§ Pattern nomi inbox orchestratore).

---

## Read-set operativo attivo

- `README.md`
- `docs/OPERATING_MEMORY.md`
- WU corrente in `docs/work-units/`

---

## Prossimo stato

Migrazione memoria **chiusa**. Il prossimo lavoro GIS va aperto come **nuova WU** o blocco operativo separato.

---

## Doc gate lean (riferimento)

1. Read-set rispettato: README + OPERATING_MEMORY + WU corrente.
2. Un dato di stato aggiornato in un solo posto.
3. WU corrente aggiornata con stato PASS / FAIL / BLOCKED / PREPARED / PENDING.
4. Autosync separato dai docs operativi.
5. Nei blocchi docs-only, monolite non toccato.
