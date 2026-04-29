# Riepilogo — standard UI/UX (tabelle, preset, map-first, pulsanti)

**Data:** 2026-04-29.

## Problema

Regole UI/UX ripetute a mano su ogni modal/pannello; serviva formalizzazione vincolante per prompt futuri.

## Standard aggiunti (sintesi)

1. **Tabelle operative** — Colonne a contenuto variabile: **resize** in larghezza ove possibile, min-width/clamp, niente rottura di sticky, selezione, batch, scroll, mobile; larghezze in stato transiente/session; **no localStorage** per larghezze salvo decisione esplicita; riuso pattern monolite.
2. **Preset input tecnici** — Preset che **precompilano/assistono**, non sostituiscono; i18n IT/EN/FR; minimo impatto a parser/modello.
3. **Map-first** — Flusso primario mappa-centrico; input manuale secondario; invariati OPSEC/offline/geo (no GPS silenzioso, no `watchPosition`).
4. **Pulsanti** — Primary solo azione primaria reale; secondary, danger, ghost coerenti; CTA in alto, opzioni in basso.

**Check esplicito:** prima di implementare un nuovo modal/pannello/tabella/tool GIS, verificare il blocco in `.cursor/rules/10-html-architecture.mdc` (*GIS & tools UI/UX standards*). Riferimento in `.cursor/rules/00-project-core.mdc`.

## File modificati

- `.cursor/rules/00-project-core.mdc` — sezione *UI/UX — standard GIS* (puntamento a regola 10).
- `.cursor/rules/10-html-architecture.mdc` — sezione *GIS & tools UI/UX standards* (quattro sottosezioni).
- `docs/PROJECT_notes.md` — sottosezione in §1 (panoramica).
- `docs/orchestrator/latest.md`, questo inbox.

**Non toccati:** `coordinate_converter Claude.html`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/roadmap.md`.

## Coerenza

Nessun conflitto con OPSEC, offline, geoloc opt-in, single-file, *Rejected patterns*; roadmap non modificata (mirror Notice invariato in 00 salvo sezione aggiuntiva localizzata).

## Prossimo passo

Applicare i controlli pre-UI a ogni nuova feature modale/tabellare; Range Rings 5E/5F (piano inbox) sotto questi vincoli.
