# CARTO-IIM-UKHO-PROVIDERS-A — candidate 229 (no deploy)

**BLOCK:** `CARTO-IIM-UKHO-PROVIDERS-A`  
**WU:** [`WU-0012`](../../work-units/WU-0012-carto-index-federated.md)  
**GATE:** REVIEW GPT-SOSTITUTIVA — PENDING  
**LIVE:** build **228** `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` invariato  
**CANDIDATE:** `a0e439e059f32026ae381a56854ccf800b50548e` · build **229** · blob `9cc2345fcb45fc45c727969df103f28ca801fd53`  
**Planet-Clone:** non modificato  
**Oggetti GIS:** FROZEN / non toccato

## Discovery — fonti realmente osservate

### UKHO

| Voce | Evidence |
| --- | --- |
| CAL page | `https://www.admiralty.co.uk/charts/chart-availability-list` |
| CAL XLS | `Chart_Availability_List_0.xls` · 946688 B · SHA-256 `945bc29498cb997a98e3b18bd567d893edb2ffe52fb32272855a7b0baddfec83` (fuori repo) |
| Formato | OLE `d0cf11e0` · sheet `Chart_Availability_List` · header riga 2 |
| Colonne | Number, Title, Scale, Edition Date, Withdrawn Date, Replaced By, Replaces, Last NM Number, Last NM Week-Year, Product Status, ARCS Chart, Folio, Disk, Update Disk, Edition Number |
| Bbox/polygon | **assenti** (`has_lat/has_lon` erano falsi positivi da stili Excel) |
| Record normalizzati | **3912** · `catalog_status=metadata_only` · 0 footprint · 0 quarantine |
| ADC Catalogs | `ADC_Catalogs_WK33_26.zip` · `Paper Charts.cat` è ZIP SevenCs `.7CB` (`SevenCs Hamburg`) — **non parsabile** senza spec |
| ADC `objects.csv` | gazetteer, **non** footprint |

### IIM

| Voce | Evidence |
| --- | --- |
| Shop map chrome | `https://www.istitutoidrografico.it/it/pages-14/interactive-sailing-map` |
| Mappa reale | iframe `https://www.istitutoidrografico.it/InteractiveSailingMap/myPath.php` |
| Lookup | **POST** `myPathMaps.php` · `application/x-www-form-urlencoded` · `markers` / `drawRecs` / `selScala=tutte` |
| Response | `text/html; charset=UTF-8` · `var rectMaps = [[S,N,W,E],…]` + `var mapInfoWin = [[id,INT,title,ed,date,scale,…],…]` |
| Harvest world | POST drawRecs `S-80 W-180 N80 E180` → **180** record / **180** footprint / 0 metadata_only / 0 quarantine |
| Harvest Med | 172 (sottoinsieme; world_only: 350,360,431,435,437,881,884,885) |
| Panel raw | `sngpnl` 162 · `mltpnl` 18 (un rettangolo-inviluppo, pannelli non separati) |
| II 3001 PDF | numeri/titoli/scale; **niente poligoni limiti carta** |
| Completeness gap | shop Liguria elenca carte **2** (Imperia–Portofino) e **326** INT3350 (Bonifacio) **assenti** dal POST world |

`SchedeVedi.asp?mappaID=` restituisce il catalogo generico (canonical `/it/catalogo`), non la scheda. Cross-check utile: cartelle shop `/00601d018-1/` (Ligure) e `/00601d002-1/` (Generali Med).

### Cross-check shop vs mappa (nessuna auto-correzione)

| chart_id | INT | scala | titolo | edizione mappa | edizione shop | esito |
| --- | --- | --- | --- | --- | --- | --- |
| 59 | — | 5000 | Porto della Spezia | ed. 3 / 2020-01-01 | Luglio 2021 ristampa 2022 | **id/titolo/scala OK; edizione discordante** |
| 60 | 3365 | 10000 | Rada della Spezia | ed. 2 / 2013-10-01 | 2022 | **id/INT/titolo/scala OK; edizione discordante** |
| 115 | 3364 | 30000 | Litorale della Spezia | ed. 3 / 2019-11-01 | 2025 | **id/INT/titolo/scala OK; edizione discordante** |
| 3 | — | 100000 | Da Portofino a San Rossore | ed. 2 / 2020-06-01 | GIUGNO 2020 | **OK** (edizione coerente) |
| 340 | 301 | 2250000 | Mar Mediterraneo (+ subtitle Bacino Occidentale) | ed. 4 | shop «Mare Mediterraneo - Bacino Occidentale» | **id/INT/scala OK; titolo wording shop ≠ mappa** |
| 360 | 300 | 4200000 | Mar Mediterraneo e Mar Nero | ed. 2 | INT300 in generali | **id/INT/titolo OK** |

## Pipeline / parser

- `tools/carto/iim_parse_mapinfo.py` — `rectMaps` + `mapInfoWin` → record provider-neutral WGS84
- `tools/carto/ukho_cal_parse.py` — xlrd (tooling only) su CAL XLS
- `tools/carto/build_iim_ukho_packages.py` — `data/carto/iim/**` + `data/carto/ukho/**`
- `tools/carto/_patch_html_fed.py` — embed + motore (payload IGM **mai** riscritto)

## Dataset

| Provider | record | footprint | metadata_only | quarantine | compact embed |
| --- | --- | --- | --- | --- | --- |
| IIM | 180 | 180 | 0 | 0 | 79994 B |
| UKHO | 3912 | 0 | 3912 | 0 | 1081366 B |
| IGM (preesistente) | 8204 | 8204 | 0 | 0 | invariato |

Logical key: `provider_id|series_id|normalize(chart_id)` → `iim|paper|115`, `ukho|ba|2`.

## Federazione monolite

- Loader: `#cartoIgmEmbeddedData` + `#cartoIimEmbeddedData` + `#cartoUkhoEmbeddedData`
- Ricerca spaziale **salta** `metadata_only` / geometria assente (UKHO non entra nei hit)
- Filtro UI IIM (`paper`) + hint UKHO
- Ranking invariato (scala, serie, chart_id)
- `cartoTryProviderRefresh()` sempre `blocked` (nessun fetch IIM/UKHO)
- Oggetti GIS / `state.mapWaypoints` / `state.gisPolygons` non mutati dal selftest

## Selftest

- Python `tools/carto/selftest_carto_providers.py` **PASS**
- Playwright `GOICartoIndex.selfTest()` **PASS** (IGM 8204 / IIM 180 / UKHO 3912; mixed La Spezia IGM+IIM; UKHO spatial 0; forceOffline/opsecStrict block refresh)

## Gateway Planet-Clone

**Non implementato.** CAL/ADC scaricabili da workstation; IIM POST same-origin per il tooling. Nessun CORS obbligatorio per il runtime (dati embedded).

## STOP / split residui

- UKHO geometria: richiede spec SevenCs `.7CB` o artefatto ufficiale GeoJSON/SHP — **non inventata**
- IIM harvest 180 ≠ catalogo shop completo (finding 2, 326)
- Edizioni shop vs mappa: finding, dati mappa conservati come fonte geometrica
- CIGA: fuori scope

## Non fatto (prompt)

- NON deploy · NON ABQA · NON QA operatore · NON finito
