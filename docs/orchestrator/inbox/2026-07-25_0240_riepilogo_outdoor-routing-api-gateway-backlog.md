# Riepilogo — OUTDOOR-ROUTING-API-GATEWAY-A backlog

**Data:** 2026-07-25  
**Tipo:** docs-only (registrazione backlog)  
**real_task_commit:** `3e9bc6a8b967a24f96828129b0e2a0b3c3e9aa30`  
**Subject:** `docs(routing): add worldwide API gateway backlog`

## Cosa è stato fatto

Registrato **OUTDOOR-ROUTING-API-GATEWAY-A** come **BACKLOG / NON APERTO**: gateway HTTPS server-side futuro per routing API mondiale (chiave fuori dal monolite; HTML → HTTPS gateway → provider esterno).

**Non** eseguito: implementazione gateway, codice server, installazioni, deploy, VPS, INFRA-GH-1A, monolite, nuova WU numerata.

## File modificati (commit task)

- `docs/OPERATING_MEMORY.md` §7 — voce backlog + prossimo ordine (WU-0011 invariato READY)
- `docs/HANDOFF.md` — nota backlog immediato
- `docs/work-units/WU-0010-outdoor-routing-graphhopper.md` §6 — sezione gateway; Online/gateway rinviato qui

## Stati invariati / aggiornati

| Voce | Valore |
|------|--------|
| WU-0011 INFRA-GH-1A | READY / GO EXECUTION (**invariato**) |
| OUTDOOR-ROUTING-GH-B2 | BLOCKED |
| OUTDOOR-ROUTING-API-GATEWAY-A | BACKLOG / NON APERTO |
| Runtime | `3a702e1` · B5.5Z build 56 |
| Monolite blob | `15c57074…` invariato |
| Deploy / QA operatore | nessuno / n/a |

## Prossimo passo

Esecuzione **WU-0011 / INFRA-GH-1A**. Gateway solo dopo rivalutazione post-PoC o prima di Online in B2.

## Limiti

- Nessun provider scelto; nessuna API key; nessun gateway esistente
- Fatti del commit autosync corrente: **EXTERNAL_ONLY** (omessi)
