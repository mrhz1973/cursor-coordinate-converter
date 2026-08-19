# CARTO-IIM-PROVIDER-A-FIX1 — candidate 231 (QA FAIL 230, no deploy)

**BLOCK:** `CARTO-IIM-PROVIDER-A-FIX1`  
**WU:** [`WU-0012`](../../work-units/WU-0012-carto-index-federated.md)  
**GATE:** REVIEW GPT-SOSTITUTIVA — PENDING  
**LIVE:** build **228** `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` invariato  
**CANDIDATE:** `f90c503355d7c98eaf300f7f1afe647102a2330f` · build **231** · blob `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038`  
**SUPERSEDED:** `CARTO-IIM-PROVIDER-A` candidate **230** `8d6e0b0` — **QA FAIL operatore** (filtro «IIM carte nautiche» non deselezionabile)  
**UKHO:** `CARTO-UKHO-FOOTPRINT-A` — **NOT OPENED / DISCOVERY BLOCKED**  
**Planet-Clone:** non modificato  
**Oggetti GIS:** FROZEN / non toccato  
**NON DEPLOY / NON ABQA / NON QA operatore / NON finito**

## Causa

`cartoUiGetState()` (ramo `_cartoUi` già esistente) re-inseriva `selectedSeries` `"paper"` a ogni get. Flusso:

1. L’operatore toglie la spunta a `#cartoIimFilterPaper`.
2. `onFilter` legge il DOM e imposta `selectedSeries` senza `"paper"`.
3. `cartoUiRunSearch` → `cartoUiRenderPanel` richiama `cartoUiGetState()` che **re-pushava `"paper"`**.
4. Il render risincronizzava `el.checked` → la spunta restava attiva.

`_cartoUi` è transiente (non persistito). Il default di init include già `"paper"`; il push su ogni get non serviva.

## Patch

- Rimossa la coppia di righe `selectedSeries.push("paper")` da `cartoUiGetState`.
- Default init invariato: `selectedSeries: [..., "paper"]`.
- Selftest `GOICartoIndex.selfTest()`: `filter_iim_uncheckable` + `filter_igm_uncheckable`.
- Identità **231** / `CARTO-IIM-PROVIDER-A-FIX1` (230 non riusato).
- Payload IGM `#cartoIgmEmbeddedData` non toccato. Nessun `#cartoUkhoEmbeddedData`.

Pipeline: `tools/carto/_patch_html_iim_fix1.py`. Probe UI: `tools/carto/_probe_iim_filter_uncheck.py`.

## Identità runtime 231

| Voce | Valore |
| --- | --- |
| FULL SHA | `f90c503355d7c98eaf300f7f1afe647102a2330f` |
| Build | **231** / `CARTO-IIM-PROVIDER-A-FIX1` |
| Blob | `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` |
| Bytes LF | `10796791` |
| SHA-256 LF | `42b822cc05404443736b90cfe613c12731a020c3b44d29dad004c1c4fafb9280` |
| 230 | **non riusato** (runtime cambiato) |

## Selftest (pre-review)

| Probe | Esito |
| --- | --- |
| `tools/carto/selftest_carto_providers.py` | **PASS** |
| `GOICartoIndex.selfTest()` Playwright file:// | **PASS** (`ok=true`) |
| `filter_iim_uncheckable` | **PASS** (`checked: false`, series senza `"paper"`) |
| `filter_igm_uncheckable` | **PASS** |
| `tools/carto/_probe_iim_filter_uncheck.py` | **PASS** (uncheck resta off; recheck ripristina `"paper"`; IGM uncheck invariato) |
| IGM 8204 / IIM 180 / tot 8384 / UKHO assente | **PASS** |
| forcedOffline / opsecStrict / zero auto net / zero wp·poly mut | **PASS** |

## STOP

- LIVE FRONTIER = **228** / `c5bc4b1` (invariato)
- GIS VPS serve ancora **230** (`?v=8d6e0b0`) — **non** ridistribuito 231
- NEXT: **REVIEW GPT-SOSTITUTIVA** candidate 231
- NON deploy · NON ABQA · NON QA operatore · NON finito
