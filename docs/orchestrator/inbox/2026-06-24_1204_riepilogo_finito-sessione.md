# Riepilogo finito — backlog candidato HUD (docs-only)

**Data:** 2026-06-24  
**Tipo:** aggiornamento roadmap docs-only; **non** WU aperta; **non** runtime.

## Cosa è stato fatto

Aggiunta in `docs/work-units/WU-0005-0009-roadmap.md` la voce:

**«Backlog candidato — Personalizzazione HUD a schermo (visibilità + riposizionamento)»**

Posizione: dopo la sezione «Estensione backlog — UX poligoni + modal standard» (item standardizzazione modal trasversale), prima di `WU-0006 POLY-EDIT-B2`.

### Contenuto registrato

- **HUD-VIS:** toggle visibilità scala, readout PUNTO/CURSORE, gruppi toolbar/header; reset «Mostra tutto»; persistenza futura `coordconv_v2` + sanitizer (contratto dati; hop/review Claude al blocco runtime).
- **HUD-MOVE:** riposizionamento overlay HUD in modalità modifica layout separata; nota tecnica overlay fissi vs drag pannelli; persistenza condivisa con HUD-VIS; containment B5.2.
- **Distinzione B5.5C:** asse export JPG distinto da visibilità live.
- **Priorità:** backlog non bloccante; dopo residui Poligoni e candidati in coda; due blocchi separati (HUD-MOVE non in HUD-VIS).

## Riferimenti UX (stato invariato)

- WU-0007: **PASS** (non riaperta).
- Backlog standardizzazione modal: invariato.
- A2-B2-FIX (`70ed7b3`): invariato; deploy/QA FIX ancora pending.
- Stati Poligoni: non modificati.

## File modificati

| File | Azione |
|------|--------|
| `docs/work-units/WU-0005-0009-roadmap.md` | +72 righe (backlog HUD) |

**Non modificati:** `coordinate_converter Claude.html`, `docs/OPERATING_MEMORY.md` (OM §7), README, runtime docs, inbox storici, WU-0007 stato.

## Commit

| Commit | Messaggio | Contenuto |
|--------|-----------|-----------|
| `38ec7c5` | `docs: add HUD customization backlog candidate` | Solo roadmap WU-0005-0009 |

**Push `origin/main`:** riuscito (`06b1f58..38ec7c5`).

## QA / controlli

- `git diff --check`: PASS
- Solo `WU-0005-0009-roadmap.md` nel commit docs
- `node --check`: N/A (nessun JS)
- Test browser: N/A

## Working tree post-finito

Atteso pulito dopo commit orchestratore.

## Prossimo passo consigliato

1. Deploy VPS + QA **A2-B2-FIX** (`70ed7b3`) quando operatore pronto.
2. Apertura futura **HUD-VIS** / **HUD-MOVE** solo come blocchi runtime dedicati (dopo residui Poligoni).

## Monolite nel commit

**Escluso** — policy default; nessuna modifica locale al monolite in questo intervento.
