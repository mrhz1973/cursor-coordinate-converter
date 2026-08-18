# CARTO-IIM-PROVIDER-A — candidate 230 (split da FAIL 229, no deploy)

**BLOCK:** `CARTO-IIM-PROVIDER-A`  
**WU:** [`WU-0012`](../../work-units/WU-0012-carto-index-federated.md)  
**GATE:** REVIEW GPT-SOSTITUTIVA — PENDING  
**LIVE:** build **228** `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` invariato  
**CANDIDATE:** `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` · build **230** · blob `faa7499c178d53f3a2b68bb35cb9089579e30240`  
**SUPERSEDED:** `CARTO-IIM-UKHO-PROVIDERS-A` candidate **229** `a0e439e` — **FAIL** review GPT-sostitutiva (acceptance/scope, non regressione tecnica)  
**UKHO next:** `CARTO-UKHO-FOOTPRINT-A` — **NOT OPENED / DISCOVERY BLOCKED**  
**Planet-Clone:** non modificato  
**Oggetti GIS:** FROZEN / non toccato  
**NON DEPLOY / NON ABQA / NON QA operatore / NON finito**

## Perché lo split

Il candidate 229 federava IIM (geometrie) e UKHO (3912 record CAL metadata_only, 0 footprint, ~1.08 MB embedded) nello stesso runtime e nello stesso blocco. La review ha dichiarato FAIL di **scope/acceptance**: UKHO non è un provider cartografico spaziale completato; attestarlo a runtime (anche con skip spaziale) mescola due stati.

Metodo WU-0012: slot generico `CARTO-PROVIDER-NEXT-A`; naming per-provider come IGM (`CARTO-IGM-SERIES-EXPAND-A`, …). ID dedicato **`CARTO-IIM-PROVIDER-A`** — nessun conflitto in registry.

## A. IIM — provider geometrico candidate (in review)

- Dataset = **snapshot** della Interactive Sailing Map osservata (**NON** catalogo IIM completo)
- 180 record / 180 footprint / 0 metadata_only / 0 quarantine
- Geometrie: `rectMaps` `[S,N,W,E]` WGS84, allineate per indice a `mapInfoWin`
- Finding (non fixture, non auto-fix): carte **2** e **326** assenti dallo snapshot, presenti nello shop Liguria
- Edizioni shop vs mappa discordanti: **nessuna auto-correzione**
- Runtime: `#cartoIimEmbeddedData` only (+ IGM preesistente)
- UI: hint snapshot `#cartoIimSnapshotHint` / `carto.iimSnapshotNote` (IT)

## B. UKHO — NOT OPENED FOR RUNTIME

- CAL resta evidence/tooling (`data/carto/ukho/**`, parser `ukho_cal_parse.py`)
- `runtime_status = NOT_OPENED_FOR_RUNTIME`
- `footprint_status = DISCOVERY_BLOCKED`
- `footprint_count = 0` esplicito
- **Nessun** bbox/poligono inventato
- Fixture spaziali = `NOT_AVAILABLE` / `BLOCKED`
- Fixture parser metadati solo per chart id **presenti** nel CAL (niente `optional: true` + `ok: true` su missing)
- **Non** embedded nel monolite (`#cartoUkhoEmbeddedData` rimosso)

**Blocker preciso:** geometria deterministica non disponibile dalla CAL; ADC Paper Charts `.7CB` (magic `SevenCs Hamburg`) non parsato senza specifica o artefatto geometrico ufficiale utilizzabile.

## Identità runtime 230

| Voce | Valore |
| --- | --- |
| FULL SHA | `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` |
| Build | **230** / `CARTO-IIM-PROVIDER-A` |
| Blob | `faa7499c178d53f3a2b68bb35cb9089579e30240` |
| Bytes LF | `10795338` |
| SHA-256 LF | `46d0a6b053847f2f94f861817fbabe3b5c2f8613bac8a7458f318254fe47b5c1` |
| 229 | **non riusato** (runtime cambiato) |

## Selftest (pre-review)

| Probe | Esito |
| --- | --- |
| `tools/carto/selftest_carto_providers.py` | **PASS** |
| `GOICartoIndex.selfTest()` Playwright file:// | **PASS** |
| IGM 8204 (50=633, 100v=278, 25=2266, 25v=3549, 25kauto=1478) | **PASS** |
| IIM 180 snapshot | **PASS** |
| mixed IGM+IIM Spezia | **PASS** |
| `ukho_not_in_runtime` | **PASS** (providerCounts senza `ukho`) |
| `ukho_spatial_blocked` | **PASS** |
| reload featureCount 8384 (8204+180) | **PASS** |
| forcedOffline / opsecStrict block refresh | **PASS** |
| zero network automatico | **PASS** |
| zero mutation `state.mapWaypoints[]` / `state.gisPolygons` | **PASS** |

## Pipeline

- `tools/carto/_patch_html_iim_split.py` — patcher runtime IIM-only (payload IGM mai riscritto)
- `tools/carto/embed_carto_fed.py` — embed IIM only
- `tools/carto/_patch_html_fed.py` — **SUPERSEDED** (guard: non re-embeddare UKHO)
- `tools/carto/build_iim_ukho_packages.py` — IIM snapshot + UKHO tooling metadata, spatial BLOCKED
