# DOCS-BACKLOG-CARTO-IIM-QA-UX-A — registrazione docs-only

**Data:** 2026-08-19  
**Tipo:** DOCS-ONLY / BACKLOG REGISTRATION  
**NON** runtime · **NON** nuova build · **NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito  
Oggetti GIS **FROZEN**. Nessun nuovo blocco di implementazione.

## Gate LIVE (invariato — FRONTIER non toccato)

`CARTO-IIM-PROVIDER-A-FIX1` · candidate `f90c503` / build **231** · **REVIEW GPT-SOSTITUTIVA — PENDING**  
GIS VPS resta **230** (`?v=8d6e0b0`). LIVE FRONTIER resta **228**.

## Finding QA corrente (non backlog)

Candidate **230** `CARTO-IIM-PROVIDER-A`: checkbox «IIM carte nautiche» non deselezionabile. Casa: [`WU-0012` §15i](../../work-units/WU-0012-carto-index-federated.md). **Non** corretto in questo pass.

## Backlog registrati (NOT OPENED)

Scope logici tenuti **separati**:

| Scope | Item | Casa canonica |
| --- | --- | --- |
| 1. CARTO search / filter / labelling | `CARTO-SEARCH-FILTER-LABEL-UX-A` | WU-0012 §15j; pointer roadmap *CARTO-INDEX-FEDERATED-A* |
| 2. D-Flight close cleanup | `D-FLIGHT-CLOSE-CLEANUP-A` | WU-0013 §23; pointer roadmap *Map UX + D-Flight details* |
| 3. Global modal edge resize | `GLOBAL-MODAL-EDGE-RESIZE-A` | roadmap *Estensione backlog — UX poligoni + modal standard* |

Esempio «Côte d'Ivoire» / campo Paese: controlli attuali `geo.placeholder` / `geo.countryPh` (pannello Cerca), registrati in §15j senza WU extra.

Nessun WU-ID inventato. Nessun blocco aperto.

## File

- `docs/work-units/WU-0012-carto-index-federated.md` — §15i finding + §15j backlog (hot-header **invariato**)
- `docs/work-units/WU-0013-uas-geozone-dflight.md` — riga §23 `D-FLIGHT-CLOSE-CLEANUP-A` (hot-header **invariato**)
- `docs/work-units/WU-0005-0009-roadmap.md` — pointer CARTO; tabella D-Flight; `GLOBAL-MODAL-EDGE-RESIZE-A`
- `docs/OPERATING_MEMORY.md` — pointer OM §7.3 (FRONTIER / §7.1 / §7.2 **non** toccati)
- `docs/orchestrator/latest.md` — sintesi + puntatore inbox
- `docs/runtime/LAST_CURSOR_REPORT.md`

Monolite **non** modificato. `proxy.py` **non** toccato. Helper **non** toccato.

## Prossimo passo

REVIEW GPT-SOSTITUTIVA candidate 231 (separato). I tre item restano **NOT OPENED**.
