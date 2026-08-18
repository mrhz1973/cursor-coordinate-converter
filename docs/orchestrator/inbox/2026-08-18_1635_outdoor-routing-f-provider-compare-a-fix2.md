# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2 — candidate 223

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE` (override prompt: **NON** deploy · **NON** ABQA post-deploy · **NON** QA operatore · **NON** finito)  
**GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**LIVE FRONTIER:** resta build **220** / `cfee0e4`

## Candidate

| Campo | Valore |
| --- | --- |
| **FULL SHA** | `4a6dca938057d2c1e2b0f0a2cdec1480c13f3d20` |
| Base 222 | `105bedf3c0fa4f15f1be0edf4929d19e8842235b` |
| Build / ID | **223** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2` |
| Blob monolite | `56163b6f4e43e1ea8eec837ba535cd62c4b6c38f` |
| Bytes LF | `10639339` |
| SHA-256 LF | `2b9df0d23602478937528913f19500e1445275a7a447d6944cab9d21336f28e8` |
| Helper | **0.1.3** invariato |
| Diff vs 222 | `coordinate_converter Claude.html` +182 / −64 (scoped) |
| Selftest globale | **741/741 PASS** |
| Live probes | **28/28 PASS** (GH VPS `:8989/route` + ORS gateway Tailscale) |

Un solo runtime commit: `feat(routing): gate alternatives to exactly 2 points and fix VIA reorder, build 223`.

VPS resta sul candidate **222** deployato. Questo pass **non** deploya.

## Cosa è stato corretto

1. **Regola unica** `routingAlternativesAllowed(n) === (n === 2)` **prima** del body HTTP. Con >2 punti: niente `algorithm=alternative_route` / `alternative_route.*` (GH) e niente `alternative_routes` (ORS). Il fallback HTTP storico 400→retry **non** è il meccanismo normale.
2. **Anello vincolato ≥1 VIA:** route multi-point START→VIA…→START; zero-VIA `round_trip` identico; A→B 2 punti + alternative identiche.
3. **Compare con VIA:** stesso snapshot open-chain; entrambi chiudono START nel body; entrambi disabilitano alternatives; controller separati; niente fallback provider→provider.
4. **Reorder VIA — runtime reale (B), non solo harness.** `routingEnsureAbPoints` faceva `r.points = r.points.filter(...)` (nuovo array). `routingMovePoint` e DnD tenevano il riferimento vecchio, scambiavano una copia staccata, `state._routing.points` restava START→VIA1→VIA2. Compact **in-place** (`splice`). START non riordinabile; hidden B non entra nei VIA visibili.
5. **Centra risultato:** runtime **non** toccato. Criterio harness/selftest: click Centra = zero POST `/route` e zero POST `/ors/v2/directions/...` (tile/elevation GET non sono FAIL).

## Live probes (obbligatori)

Tutti HTTP **200** su body costruiti dai builder JS del candidate.

| Probe | Esito |
| --- | --- |
| A GH 1 VIA (3 points, no `alternative_route`) | HTTP 200 |
| B ORS 1 VIA (3 coordinates, no `alternative_routes`) | HTTP 200 |
| C GH 2 VIA (4 points, no `alternative_route`) | HTTP 200 |
| D ORS 2 VIA (4 coordinates, no `alternative_routes`) | HTTP 200 |
| E compare 1 VIA (stesso snapshot, entrambi 200) | PASS |
| F compare 2 VIA (stesso snapshot, entrambi 200) | PASS |
| G constrained + avoid GH `custom_model` no alt | HTTP 200 |
| G constrained + avoid ORS `avoid_polygons` no alt | HTTP 200 |
| H reorder START→VIA2→VIA1→START su body GH e ORS | HTTP 200 entrambi |
| R zero-VIA GH `round_trip` + distance + seed | HTTP 200 |
| R zero-VIA ORS `options.round_trip` | HTTP 200 |
| R 2 punti GH `alternative_route` | HTTP 200 |
| R 2 punti ORS `alternative_routes` | HTTP 200 |

Endpoint invariati: GH `127.0.0.1:8989` / `100.114.7.53:8989`; ORS `https://ubuntu.tailc01234.ts.net/ors/...`. Nessun `api.openrouteservice.org`. Nessuna Authorization/API key.

## Invarianti

- singolo HTML standalone / vanilla JS
- `state.mapWaypoints[]` / `state.gisPolygons` / Oggetti GIS **FROZEN**
- nessun nuovo storage / GPS / endpoint
- helper 0.1.3 invariato; gateway ORS invariato
- Auto GH Local→VPS invariato; ORS mai Auto
- `forcedOffline` / `opsecStrict` invariati
- `routingCenterResultAction` invariato

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING**  
LIVE resta **220**.  
NEXT: review FIX2 candidate **223**.  
NON deploy. NON ABQA. NON QA operatore. NON finito.
