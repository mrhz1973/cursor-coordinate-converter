# MAP-CENTER-VIEWPORT-AWARE-A-FIX1 — REVIEW N/A (ROUTINE) + deploy GIS + ABQA PASS

**BLOCK-ID:** `MAP-CENTER-VIEWPORT-AWARE-A-FIX1`  
**Parent:** `MAP-CENTER-VIEWPORT-AWARE-A` (stesso backlog — no duplicate)  
**Categoria:** ROUTINE — FIX1 da QA FAIL operatore (dock / altezza vs chrome)  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE uscita:** **CLOSED / PASS** (QA operatore PASS · finito Regola H)

## Finding QA (input)

`QA MAP-CENTER-VIEWPORT-AWARE-A FAIL operatore` — pannello Poligoni a **destra** copriva barre coordinate/pulsanti destri. Deve aprirsi **tutta a sinistra**, altezza solo banda utile mappa (sotto topbar, sopra scala/barra nera). Caso 2 (priorità verts) **PASS** — non ritoccato.

## Scope FIX1

1. Dock default **LEFT** (`preferRight: false`).
2. `polygonPanelComputeGisBand` / `polygonPanelApplyLeftGisBand`: top ≥ header/`#appTopbar`; bottom ≤ `.tile-scale` / `.tile-bottom-left` / `body > footer` / `--gis-footer-reserve`.
3. Migrazione session layout se ancora dockato a destra (>40% viewport).
4. Caso 2 / Ctrl+Z / METRICS-COMPACT / schema / rete / GPS: **invariati**.

## A — Runtime

| Campo | Valore |
| --- | --- |
| Tip | `03a222e429905477d4a288c4ba7cc5b986f08bff` |
| Build / ID | **245** / `MAP-CENTER-VIEWPORT-AWARE-A-FIX1` |
| Blob | `b9258d757fd8bba291e4506680ba579a480f5c56` |
| BASE LIVE pre | `6d0b78a` / **244** / blob `de49d320…` |

## B — Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS HEAD | `03a222e429905477d4a288c4ba7cc5b986f08bff` |
| CMP | **PASS** · SHA-256 `354e67c47dd36cdde20ef634de7d19bfecc150bec5750e45c6d33ff78fc7cba8` · bytes `10852232` |
| Proxy PID | `2481045` invariato |
| HTTP | **200** |

**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=03a222e`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA MAP-CENTER-VIEWPORT-AWARE-A-FIX1 PASS** · **18/18**  
JSON: [`2026-08-21_2135_MAP-CENTER-VIEWPORT-AWARE-A-FIX1-abqa.json`](2026-08-21_2135_MAP-CENTER-VIEWPORT-AWARE-A-FIX1-abqa.json)

Dock sinistro · sotto topbar · sopra footer/scala · controlli destri liberi · ordine verts · Ctrl+Z · FIX4 drag · viewport stretta · pageerrors 0.

## Gate

**QA FINALE CHATGPT — PASS operatore** (2026-08-21) → auto-`finito` Regola H.

Evidence chiusura: [`2026-08-21_2145_riepilogo_finito-MAP-CENTER-VIEWPORT-AWARE-A-FIX1.md`](2026-08-21_2145_riepilogo_finito-MAP-CENTER-VIEWPORT-AWARE-A-FIX1.md).