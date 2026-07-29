# Riepilogo finito sessione — OUTDOOR-ROUTING-GH-E (+ FIX1–FIX8)

**Data:** 2026-07-29  
**Blocco:** OUTDOOR-ROUTING-GH-E — profilo altimetrico + difficoltà + sync mappa + locale numerico  
**Trigger:** «**QA OUTDOOR-ROUTING-GH-E PASS operatore**» (auto-`finito` **METHOD-QA-PASS-AUTO-FINITO / Regola H**)

## Gate / esito

- Stato: **CLOSED / PASS end-to-end**
- Review finale: **PASS REVIEW GPT-SOSTITUTIVA OUTDOOR-ROUTING-GH-E + FIX1–FIX8**
- Deploy FIX8: **PASS** (GIS-only; solo `goi-gis-app`)

## Commit TASK reale (step 2 / chiusura docs)

- **SHA:** `5884f6220d9b8421e16020f272ce7a976962d357`
- **Subject:** `docs: finito OUTDOOR-ROUTING-GH-E after Regola H QA PASS`
- **Push task:** riuscito (`e7d9398..5884f62`)

## Runtime tip (monolite — già versionato, non in commit docs)

- **Tip:** `e7d93984ad875c1faf6cd5873199f815d5062448` (`e7d9398`)
- **Blob:** `df09e9dc073e1fc0c39b2e2167254c6a1155ca59`
- **Byte LF:** 3029257
- **SHA-256 LF:** `1f7e2a7f2fad9794cd2b380df48e18cf8a58c1b6ba310d6a8ce9ca9f3bcd383c`
- **Display:** `B6.0E-FIX8 · build 75`

## Catena runtime Bundle E

| Commit | Ruolo | Build |
|--------|--------|-------|
| `e3cf114` | Feature elevation + difficulty | 67 |
| `ab9c0a9`…`166f1c4` | FIX1–FIX4 | 68–71 |
| `476c446` | FIX5 metrics + pointer | 72 |
| `abbd836` | FIX6 filtered contract | 73 |
| `8ea0938` | FIX7 pointer sync robust | 74 |
| `e7d9398` | FIX8 numeric locale | 75 · tip |

## QA FAIL intermedi (registrati, chiusi)

1. **QA FAIL #1 — altimetrico/pointer** (post deploy FIX4 `166f1c4`): quote/km errate; rename Dislivello±/Tempo stimato; sync mouse grafico↔mappa assente; pendenza max vs P95; velocità→tempo; dettaglio fasce → chiusi da **FIX5–FIX7**.
2. **QA FAIL #2 — locale numerico** (post deploy FIX7 `8ea0938`): IT mostrava `3.8km` invece di `3,8km` → chiuso da **FIX8** (`applyLanguage(state.lang)` + normalize + fallback `it`).

## QA finale

- Provenienza: **operatore**
- Attestazione: `QA OUTDOOR-ROUTING-GH-E PASS operatore` (2026-07-29)
- Ambito: build 75; locale IT/EN/FR; smoke Routing (route/profilo/difficoltà/velocità; sync grafico↔mappa; no JS bloccante)

## Deploy FIX8 (già eseguito pre-QA)

- HEAD VPS precedente: `8ea0938…` → finale `e7d9398…`
- HTTP 200; byte/SHA/`cmp` match; GH/proxy/n8n invariati

## Backlog registrati (NON APERTI)

1. **TRACK-ELEVATION-PROFILE-A** — profilo altimetrico tracce salvate
2. **OUTDOOR-ROUTING-POINT-UNDO-A** — undo spostamento punti Routing
3. **OUTDOOR-ROUTING-UNITS-A** — unità dedicate planner (km/mi, m/ft)

## Working tree pre-autosync (post-task push)

```text
(vuoto — git status --short pulito)
```

## File principali nel commit task docs

- `docs/OPERATING_MEMORY.md` §7
- `docs/HANDOFF.md`
- `docs/QA-CHECKLIST.md`
- `docs/work-units/WU-0010-outdoor-routing-graphhopper.md`
- `docs/work-units/WU-0005-0009-roadmap.md`

**Monolite:** **non** incluso (`coordinate_converter Claude.html` escluso — già su tip `e7d9398`).

## Prossimo passo

**OUTDOOR-ROUTING-REVERSE-A** / backlog E (PROFILE / POINT-UNDO / UNITS) / routing UX / MAJOR-3-b2 quando autorizzato.

## Limiti

- Fatti del commit autosync corrente (SHA, push, HEAD finale): **EXTERNAL_ONLY**
- Nessun terzo commit finalize-hash
