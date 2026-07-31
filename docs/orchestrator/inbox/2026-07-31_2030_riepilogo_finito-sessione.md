# Riepilogo finito sessione — ROUTING-UX-POLISH-BUNDLE-A-FIX1

**Data:** 2026-07-31  
**Trigger:** `QA ROUTING-UX-POLISH-BUNDLE-A-FIX1 PASS operatore` → Regola H / `finito` automatico

## Esito

**ROUTING-UX-POLISH-BUNDLE-A (+ FIX1)** — **CLOSED / PASS end-to-end**

## Commit task reale (runtime)

| Campo | Valore |
| --- | --- |
| SHA | `173b6cb1ab4358c94352fed4b82e0b394b4e8d7b` |
| Subject | `fix(routing): restore point changes and preserve endpoints` |
| Parent | `7653ee7c8f088f27750e66197401bc2117024426` (bundle A build 85) |
| Blob monolite | `9686245ee19476440ecaeb1a1625aed28b50ea07` |
| Byte LF | `3150227` |
| SHA-256 LF | `4c1972430c241ea5be7926257dcc6a603d2de7bb6cdc0f912bf13ad4d2238828` |
| Display | `B6.2UX-A-FIX1 · build 86` |
| Push task | già su `origin/main` prima del finito docs |

## Commit docs finito (pre-autosync)

| Campo | Valore |
| --- | --- |
| SHA | `b0758b083b3f234046128f746512f9b0ae91465b` |
| Subject | `docs: finito ROUTING-UX-POLISH-BUNDLE-A-FIX1 after Regola H QA PASS` |
| Push docs | riuscito (`173b6cb..b0758b0`) |
| Monolite nel commit docs | **no** (policy; tip già versionato in `173b6cb`) |

## Working tree pre-autosync

Pulito dopo push docs (`git status --short` vuoto).

## File docs aggiornati (commit `b0758b0`)

- `docs/OPERATING_MEMORY.md` §7
- `docs/HANDOFF.md`
- `docs/QA-CHECKLIST.md`
- `docs/work-units/WU-0010-outdoor-routing-graphhopper.md` (WU resta **OPEN** / Bundle F)
- `docs/work-units/WU-0005-0009-roadmap.md`

## Scope chiuso

1. Undo = restore snapshot storico (`pointUndoStack`, max 30), non delete-last
2. A/B strutturali invarianti (`routingEnsureAbPoints`)
3. Unità km/mi + m/ft page-session (`_routingSessionPrefs`)
4. Badge `data-positioned` + `data-active`
5. `#routingPointsFeedback` + focus risultato accessibile
6. Absorbe **OUTDOOR-ROUTING-POINT-UNDO-A** e **OUTDOOR-ROUTING-UNITS-A**

## QA

| Step | Esito |
| --- | --- |
| Deploy GIS-only FIX1 | PASS |
| Harness locale | 59/59 PASS |
| `QA ROUTING-UX-POLISH-BUNDLE-A-FIX1 PASS operatore` | PASS (2026-07-31) → auto-`finito` |

## Prossimo passo

Candidato: backlog UX profilo (**ROUTING-PROFILE-EDIT-A** / **TRACK-PROFILE-POINTS-DISPLAY-A** / **MAP-CENTER-VIEWPORT-AWARE-A**) / **QA-OPERATOR-IT-ONLY-PREF** / Bundle F / geocoding multi-riga / **MAJOR-3-b2** parcheggiato.

## Limiti

- Autosync corrente: SHA / push / HEAD finale = **EXTERNAL_ONLY** (report Cursor esterno).
- WU-0010 non chiusa (Bundle F futuro).
- Nessun nuovo deploy in questo finito.
