# CARTO-IGM-SERIES-EXPAND-A-UX1 — riepilogo intervento

## Esito
CARTO-IGM-SERIES-EXPAND-A-UX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED

## Contesto
- Baseline tip: `586e338867a3aa2f6d34ec41ac9929592ee0fa7c`
- Runtime precedente: `535670041dcb22f1505ff85e45ff3286ff91d293` (build 144)
- Tipo: polish UI localizzato CARTO IGM — no dataset, no motore, no storage

## Cosa è stato fatto
1. Mappa centralizzata `CARTO_IGM_SERIES_VISUAL` (series_id → fill/stroke/label).
2. Applicazione stile serie a footprint SVG e label in `drawCartoIgmOverlay`.
3. Selected: stesso hue, stroke più spesso, fillOpacity più alta; niente blu generico.
4. CTA risultati: «Cataloga» / «Modifica» + tooltip/aria-label IT; matching archive invariato (`provider_id`/`series_id`/`chart_id`).
5. Build bump: `CARTO-IGM-SERIES-EXPAND-A-UX1` / `145`.

### Mapping colori
| series_id | famiglia | fill | stroke | label |
|-----------|----------|------|--------|-------|
| 50 | blu | `#2563eb` @0.14 (sel 0.22) | `#1d4ed8` | `#1e40af` |
| 100v | turchese | `#0891b2` @0.14 (sel 0.22) | `#0e7490` | `#155e75` |
| 25 | ambra | `#d97706` @0.14 (sel 0.22) | `#b45309` | `#92400e` |
| 25v | viola | `#7c3aed` @0.14 (sel 0.22) | `#6d28d9` | `#5b21b6` |
| 25kauto | verde | `#16a34a` @0.14 (sel 0.22) | `#15803d` | `#166534` |

### CTA
- Non catalogato: testo **Cataloga**; tip **Aggiungi questo foglio al catalogo personale**
- Catalogato: testo **Modifica**; tip **Modifica i dati di catalogo di questo foglio**
- Persistenza / matching invariati

## File
- Task commit: solo `coordinate_converter Claude.html`
- Monolite **escluso** da questo autosync
- `data/carto/igm/**` non toccati

## Runtime
- CARTO_IGM_SERIES_EXPAND_UX1_RUNTIME_COMMIT = `1482f16c570f7d5c5f2b64af873ac673b5ad38e6`
- blob monolite = `a6d97610a6864fd659a3fc0d9fd3e79c915cdbd4`
- byte monolite = `9762421`
- SHA-256 monolite = `c71a0855272a819cf2c8f8909ba6e6692e7b67851ab10cc60b3370aa6ce90221`
- payload count = 8204; payload SHA invariato `487AC0A0…6283`

## QA / deploy
- Deploy: NOT EXECUTED (gate esplicito)
- QA operatore: NOT EXECUTED
- Review: REVIEW GPT-SOSTITUTIVA REQUIRED

## Verifiche
- `node --check` su blocchi JS estratti: PASS
- `git diff --check`: PASS
- payload embedded byte-invariato: PASS
- dataset/manifest: invariati

## Prossimo passo
Review GPT-sostitutiva → eventuale deploy UX1 → QA (EXPAND-A / UX1 secondo orchestratore).

## Limiti
- Nessun test browser funzionale in questo intervento
- EN/FR freeze: nuove tip keys solo IT (fallback cartoUiT)
