# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1 — candidate 222

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**Base:** `1a5e971459f13b12ed303f1e7105998db774b3bf` · build **221** · blob `90c52d57f58ec49af91bf0364e2fe7c8aa5ece3b`  
**QA operatore 221:** FAIL SCOPED (funzionalità principale valida; UX + Anello vincolato)

## Candidate

| Campo | Valore |
| --- | --- |
| FULL SHA | `105bedf3c0fa4f15f1be0edf4929d19e8842235b` |
| Build / ID | **222** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1` |
| Monolite blob | `99233802af29998ee3c0c659d72ffa9db6bbe100` |
| Bytes LF | `10631301` |
| SHA-256 LF | `fb76c7fff6d08b15bce236d52a72e0cf367e2abed5ad1c3456b50b0217891eba` |
| Diff scoped | `coordinate_converter Claude.html` +609 / −116 |
| Helper | **0.1.3** invariato |
| Selftest | **716/716 PASS** (`GOIDflight.selfTest()`, RPC 30/30 + RAC/RPCF1) |

## Cosa

UX confronto (legenda mappa+sezione, CTA primary, pulsanti provider colorati, metriche, «Centra risultato», titoli, help Aree da evitare) + **Anello vincolato** START→VIA…→START senza `round_trip` quando c’è almeno un passaggio. Zero VIA = round_trip storico identico.

## Payload samples (selftest)

**Zero VIA GH:** `algorithm: "round_trip"`, `round_trip.distance: 8000`.  
**Zero VIA ORS:** `options.round_trip` presente.

**1 VIA closed loop:** `points/coordinates` length 3 = START, VIA, START (stesso primo/ultimo). State `points` length 3 = START, VIA, hidden B — **nessuna** copia START nello state.

**2 VIA:** length 4 = START, V1, V2, START.

**GH constrained:** `algorithm === "alternative_route"`, **non** `round_trip`. Con avoid: `custom_model` presente.  
**ORS constrained:** **non** `options.round_trip`. Con avoid: `options.avoid_polygons` presente.

**Compare:** stesso snapshot open-chain per GH e ORS; close solo in body; fingerprint ignora distanza/seed se constrained.

## Invarianti

- `state.mapWaypoints` / `state.gisPolygons` non usati dal compare/anello vincolato
- nessun storage nuovo, nessun GPS, nessun endpoint nuovo
- ORS gateway invariato; GraphHopper Auto Local→VPS
- normale routing GH/ORS invariato
- lifecycle modale invariato

## Gate

**REVIEW GPT-SOSTITUTIVA — PENDING**

LIVE resta build **220**. NON deploy. NON ABQA. NON QA operatore. NON finito.
