# MAP-CENTER-VIEWPORT-AWARE-A — REVIEW N/A (ROUTINE) + deploy GIS + ABQA PASS

**BLOCK-ID:** `MAP-CENTER-VIEWPORT-AWARE-A`  
**Categoria:** ROUTINE — estensione POLYGON PANEL (layout + Ctrl+Z)  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE uscita:** **QA FINALE CHATGPT — PENDING**

## Scope implementato

1. Pannello Poligoni: altezza GIS utile (fraction + `bottomScaleReserve` per `.tile-scale`), dock destro (`preferRight`).
2. Priorità contenuto: ops (unità/nome/vertici/coord) sopra; lista salvati / «Nessun poligono» in fondo; durante draw/edit lista compatta (`poly-panel-focus-ops`).
3. `Ctrl+Z` durante `Nuovo poligono` → riusa `polygonRemoveLastDraftPoint` (no seconda mutazione); skip su input/textarea/select/contenteditable.
4. Out-of-scope invariati: METRICS-COMPACT, camera useful-rect DELICATO, schema/storage/rete/GPS.

## A — Runtime

| Campo | Valore |
| --- | --- |
| Tip | `6d0b78a0a67b9fc804a387d1fc37f30c85b0ca69` |
| Build / ID | **244** / `MAP-CENTER-VIEWPORT-AWARE-A` |
| Blob | `de49d320b902bb0433f3bab349cee99fdfb6eb2b` |
| BASE LIVE pre | FIX4 `ccb4166` / blob `04cfdfcc…` |

## B — Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS HEAD | `6d0b78a0a67b9fc804a387d1fc37f30c85b0ca69` |
| CMP | **PASS** · SHA-256 `6d08ecf596274a050f72a22229d8e068345b7b9f32b5fbb09d8787470b9feb7a` · bytes `10848088` |
| Proxy PID | `2481045` invariato |
| HTTP | **200** |

**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=6d0b78a`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA MAP-CENTER-VIEWPORT-AWARE-A PASS** · **15/15**  
JSON: [`2026-08-21_2105_MAP-CENTER-VIEWPORT-AWARE-A-abqa.json`](2026-08-21_2105_MAP-CENTER-VIEWPORT-AWARE-A-abqa.json)

Altezza/dock/scala · ordine verts→lista · Ctrl+Z singolo/ripetuto · protezione Nome · finish dopo undo · drag FIX4 · viewport stretta · pageerrors 0.

## Gate

**QA FINALE CHATGPT — PENDING**

Non attestare QA operatore. Non `finito`.
