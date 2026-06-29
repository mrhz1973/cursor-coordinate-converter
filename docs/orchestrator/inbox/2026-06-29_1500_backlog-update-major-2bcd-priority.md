# BACKLOG-UPDATE — priorità post MAJOR-2A

**Data:** 2026-06-29  
**Tipo:** docs-only (backlog/stato operativo)  
**Commit task:** `ea1e168` — `docs(backlog): prioritize MAJOR-2BCD offline tile program`

## Cosa è stato fatto

Registrata decisione operatore sulla priorità post MAJOR-2A in:

- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md` — nuova sezione «Programma MAJOR-2 post MAJOR-2A — priorità 2B/2C/2D»
- `docs/HANDOFF.md` — snapshot operativo

## Decisione registrata

### MAJOR-2A (già CLOSED)

- Runtime: `07ad4f4`
- Build: `B5.5Z · build 24`
- Finito docs: `28b2cc4`
- Autosync precedente: `ade8ac3`
- Verifier copertura offline read-only, session-only; nessun write/delete IDB; nessun fetch; OPSEC/fetch/proxy/geocoding/sanitizer/import-export invariati

### Prossima priorità: MAJOR-2BCD

Programma unico **Offline tile management combined**:

1. **MAJOR-2B** — Quota warning + cache/precache error surfacing
2. **MAJOR-2C** — UI chiara metadata-only vs cancellazione tile fisiche
3. **MAJOR-2D** — Delete fisico selettivo e protetto (preview, conferma danger, tile condivise protette)

Vincoli: categoria **DELICATA**; piano/gate/review tiered prima del runtime; nessun cambio fetch/proxy/OPSEC salvo decisione esplicita; Diagnostica MAJOR-1 + verifier MAJOR-2A come QA.

**Prossimo blocco:** `MAJOR-2BCD-PLAN`

### Backlog bassa priorità / non ora

- **MAJOR-2E** — Status partial/complete persistito da scan IDB
- **MAJOR-3** — Import/export GIS unificato
- **MAJOR-4** — Mission/project package

Motivazione: attendere stabilizzazione offline/tile management.

### Candidato futuro

- **MAJOR-5A — GIS Object Workbench** — da valutare dopo MAJOR-2BCD

### Stop micro-UX

Microcorrezioni UX non funzionali fermate salvo bug reale.

## File modificati

- `docs/OPERATING_MEMORY.md`
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/HANDOFF.md`

## Monolite

- `coordinate_converter Claude.html` — **non modificato**, **non incluso** nel commit task
- Runtime VPS live invariato: `07ad4f4`

## QA / deploy

- QA runtime: **non eseguita** (blocco docs-only)
- Deploy: **non eseguito**

## Stato repo pre-autosync (dopo commit task)

```text
git status --short: (vuoto dopo commit ea1e168)
```

## Prossimo passo

Piano operativo **MAJOR-2BCD-PLAN** con gate review tiered prima di qualsiasi runtime.
