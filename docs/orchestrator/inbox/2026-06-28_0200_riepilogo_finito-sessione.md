# Riepilogo finito — METHOD-BUNDLING-DEFAULT codifica metodo

**Data:** 2026-06-28  
**Tipo:** docs/rules-only (`finito`) — monolite **non** modificato.

## Scopo

Codificare definitivamente l'invariante **METHOD-BUNDLING-DEFAULT**: bundling di default al posto della separazione per-microblocco.

## Commit task

- **`93f188adbd877627d2e82315d9cc0700d883e021`** — `docs(method): codify bundle-first workflow default`

## File aggiornati

- `README.md` — regola #4 front-load AI boot (bundle-first)
- `docs/OPERATING_MEMORY.md` — §4 Regola B aggiornata (gate a livello bundle) + **Regola G** (METHOD-BUNDLING-DEFAULT completa + checklist sostitutiva GPT)
- `docs/HANDOFF.md` — gate bundle, disciplina Cursor, snapshot metodo vivo
- `.cursor/rules/30-output-workflow.mdc` — sezione bundling default per Cursor

## Contenuto codificato (sintesi)

1. Default = **un bundle / un commit / una QA** (≥5 item; 5–10+ normale).
2. **Mega-bundle ROUTINE:** CSS, HTML, i18n, UI, cosmetico, Ramo A, JS basso rischio — **nessun hop Claude**.
3. **Bundle DELICATO** isolato: sanitizer/whitelist, OPSEC, rete/tile/proxy, cache/storage, nuovo campo persistito, create-path, lifecycle modale/dialog −/×.
4. Gate/review/deploy/QA solo a livello **bundle**, mai per item.
5. Review sostitutiva GPT con checklist obbligatoria se Claude non disponibile (bundle delicato).

## Runtime (invariato)

| Campo | Valore |
|-------|--------|
| Runtime VPS live | `709079c989cc34b695e9cff3abf239ced77670dd` |
| Blob monolite | `da27be4363e878f97f1f1b8d4dbc9df34f9c7ed3` |
| Build | `B5.5Z · build 14` |

**Monolite:** non toccato in questo intervento.

## QA / deploy

- **Nessun deploy** (docs-only)
- **QA operatore:** non applicabile

## Prossimo

**Da scegliere da roadmap/backlog** — applicare il nuovo default bundling ai prossimi blocchi routine.
