# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6 — candidate 228

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE` (override: **NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito)  
**GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**LIVE FRONTIER:** resta build **220** / `cfee0e4`

Finding unico FIX5 ABQA: viewport 360×740, chip Percorso non wrappano, **Anello** tagliato, overflow `#routingPlannerPanelBody`. Resto FIX5 approvato, non riaperto.

## Candidate

| Campo | Valore |
| --- | --- |
| **FULL SHA** | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| Base 227 (FIX5) | `118dc9d511c547f5032a7d0fd2f81dc65091b72a` (blob `20c09c0c…`) |
| Build / ID | **228** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` |
| Blob monolite | `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| Bytes LF | `10710401` |
| SHA-256 LF | `ba6df30dca84f31f38b80fd8d7a34f6f61d180473a78a65f2777451dde0124ce` |
| Helper | **0.1.3** invariato |
| Selftest globale | **847/847 PASS** (RPCF6 18/18 · RPCF5 28/28 · RWF1 8/8) |
| Smoke 360×740 | planner `sw=cw=342`; chip Anello visibile (62×27); page overflow OK |

Un solo runtime commit: `fix(routing): FIX6 mobile Percorso chips wrap, build 228`.

Questo pass **non** deploya.

## Patch (CSS minima)

- `#routingModeGroup` / `.routing-params-row .routing-mode-group`: `flex: 0 1 auto` (può restringersi), `min-width: 0`, `max-width: 100%`.
- `.routing-params-row .routing-mode-chips`: `display:flex; flex-wrap:wrap; min-width:0; max-width:100%`.
- Chip: `white-space:nowrap`, `text-overflow:clip`, nessuna ellipsis; label complete.
- `@media (max-width:480px)`: gruppo `flex: 1 1 100%; width:100%`.
- Select profilo/velocità: invariati (`flex-grow:0`, `width:max-content`; mobile `max-width:100%`).
- Ordine Profilo → Percorso → Velocità → Calcola invariato.

Non toccati: lifecycle Track, `routingMarkPlannerCommit`, bordi alt, payload GH/ORS, `routingAlternativesAllowed`, OPSEC, GPS, waypoints, poligoni, helper.

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING** · **NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito.
