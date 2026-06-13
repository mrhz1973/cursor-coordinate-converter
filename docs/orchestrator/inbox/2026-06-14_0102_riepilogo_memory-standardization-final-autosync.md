# Riepilogo finale — Memory standardization wiki-LLM

## Stato

- Fase 1: PASS
- Fase 2a: PASS
- Fase 2b: PASS
- Fase 3: PASS
- Fase 4: PASS

## Read-set operativo attivo

- `README.md`
- `docs/OPERATING_MEMORY.md`
- WU corrente in `docs/work-units/`

## Commit della migrazione

- `4d52e8c` docs(orchestrator): record memory standardization plan
- `61d7223` docs(memory): introduce GIS operating memory model
- `fd36cbe` docs(memory): mark legacy memory files as historical
- `5680886` docs(cursor): flip GIS memory read-set to wiki-LLM model

## File legacy / storici

- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/chatgpt-checkpoint.md`

Nota: questi file non sono più memoria corrente primaria dopo il flip di Fase 3.

## Convenzioni attive

- Sul repo GIS, `aggio` e `aggio gis` sono equivalenti.
- Su control-plane si usa `aggio control`.
- `aggio` secco non identifica il repo: va usato nel contesto/chat corretto.
- `finito` chiude secondo modello lean: OM + WU corrente + README snapshot se necessario + Git.
- `checkpoint.md` e session log non sono più scritture primarie di memoria corrente.

## Esclusioni confermate

- Monolite non toccato.
- Rules non modificate in Fase 4.
- OM/WU/README non modificati in Fase 4.
- OPSEC runtime non modificato.
- Nessun nuovo feature work.

## Residui / verifica successiva

1. In `.cursor/rules/30-output-workflow.mdc` resta una frase circa «checkpoint ufficiali» che non è stata modificata perché fuori scope del flip finale. Valutare in Fase 5 se è solo storico/lessicale o se genera ambiguità operativa.

2. In Fase 5 valutare audit mirato delle rules `.cursor/rules/10*`, `.cursor/rules/20*`, `.cursor/rules/99*` per eventuali riferimenti legacy residui come current-state. In Fase 4 non modificare queste rules.

3. Valutare in Fase 5 se fissare in `docs/OPERATING_MEMORY.md` il pattern ufficiale dei nomi file inbox: `AAAA-MM-GG_HHMM_<tipo>_<slug>.md` per evitare futuri nomi con doppio underscore o senza segmento tipo.

## Prossimo passo

Fase 5: verifica nuova chat/agente con read-set lean.
