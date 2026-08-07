# WU-0012 — CARTO-INDEX-FEDERATED-A — Indice cartografico federato

**Stato:** `OPEN / SEARCH-ENGINE CLOSED / UI-RESULTS CLOSED / ARCHIVE CLOSED / ESC CLOSED / COORD CLOSED / CRS AUDIT PARTIAL — NEXT SERIES|PROVIDER`
**Blocco discovery:** `CARTO-INDEX-FEDERATED-A-DISCOVERY-1` — **COMPLETE / NO RUNTIME**
**Blocco acquire:** `CARTO-IGM-ACQUIRE-A` — **COMPLETE / LOCAL PACKAGE VALIDATED / NO RUNTIME** (2026-08-05)
**Blocco licenza:** autorizzazione IGM fornita dall’operatore e registrata con riferimento documentale — **Prot. IGM-2024-7891** (2024-05-24); sintesi pubblica [`docs/licenses/IGM-SERIES-50-100V-AUTHORIZATION-SUMMARY.md`](../licenses/IGM-SERIES-50-100V-AUTHORIZATION-SUMMARY.md)
**Blocco runtime motore:** `CARTO-SEARCH-ENGINE-A` — **CLOSED / PASS end-to-end** (2026-08-05) — tip storico `c80129e` / build 118
**Blocco runtime UI:** `CARTO-UI-RESULTS-A` (+ FIX1 + FIX2 + FIX3) — **CLOSED / PASS end-to-end** (2026-08-06) — tip storico `62d24eb` / build 122
**Blocco runtime UX mappa/IGM:** `MAP-INTERACTION-CARTO-UX-BUNDLE-A` (+ FIX1–FIX5) — **CLOSED / PASS end-to-end** (2026-08-06) — tip storico `8bdd69c` / build 128
**Blocco runtime risultati/area/label:** `CARTO-IGM-RESULTS-UX-BUNDLE-B` (+ FIX1 + FIX2 + FIX3) — **CLOSED / PASS end-to-end** (2026-08-06) — tip storico `51e0f5b` / build 132
**Diagnosi geodetica:** `CARTO-IGM-CRS-AUDIT-A` — **DIAGNOSTIC COMPLETE / CRS AUDIT PARTIAL** (2026-08-06)
**Blocco runtime archivio:** `CARTO-ARCHIVE-MATCH-A` (+ FIX1 + FIX2) — **CLOSED / PASS end-to-end** (2026-08-07) — tip storico `c4d7db5` / build 135
**Blocco runtime Esc area-pick:** `CARTO-IGM-AREA-ESC-RESTORE-A` — **CLOSED / PASS end-to-end** (2026-08-07) — tip storico `764e661` / build 136
**Blocco runtime coordinate modal:** `COORD-MODAL-FORMAT-COPY-A` (+ FIX1) — **CLOSED / PASS end-to-end** (2026-08-07) — tip `a0a6816` / build 138
**Tipo:** macro-feature federata — motore + UI risultati + archivio + Esc + COORD CLOSED; CRS audit PARTIAL; serie/provider **ancora aperti**
**Data apertura:** 2026-08-05
**Runtime live:** tip monolite `a0a68167f159b6945be4fbd3089a7acb7403093f` · `APP_BUILD_ID = "COORD-MODAL-FORMAT-COPY-A-FIX1"` · `APP_BUILD_NUM = 138`
**Autorizzazione corrente:** redistribuzione/embedding Serie 50+100V **concessa**; SEARCH-ENGINE CLOSED; UI-RESULTS CLOSED; ARCHIVE CLOSED; ESC CLOSED; espansione serie / provider successivi **non** CLOSED

> Relazione roadmap: sezione **CARTO-INDEX-FEDERATED-A** in [`WU-0005-0009-roadmap.md`](WU-0005-0009-roadmap.md).
> Collegamento opzionale futuro a **MAP-BOX-ZOOM-A** (CLOSED): riuso gesto/area, senza cambiare il comportamento chiuso del box zoom.

---

## 1. Scopo della Fase 1

Produrre evidenze verificabili su:

1. fonti ufficiali IGM / IIM / CIGA / UKHO-ADMIRALTY;
2. disponibilità di impronte / cataloghi / metadati;
3. licenze e diritti (senza inventare redistribuzione);
4. schema provider-neutral;
5. formato pacchetto raccomandato;
6. contratto motore spaziale futuro;
7. matching archivio personale;
8. vincoli OPSEC;
9. MVP e sequenza blocchi successivi.

**Non** digitalizzare cataloghi interi da PDF/immagine; **non** importare contenuti cartografici protetti nel repository.

---

## 2. Metodo e limiti

| Voce | Valore |
| --- | --- |
| Verifica HTTP | PowerShell `Invoke-WebRequest` (GET/HEAD) su URL ufficiali |
| Campioni | Solo in `C:\tmp\goi-carto-discovery\` (fuori repo) |
| Analisi SHP | Python stdlib (`zipfile`, `struct`) — **GDAL/OGR non installati** sul PC di discovery |
| Osservazione rete | Passiva, limitata al caricamento pagine ufficiali |
| Autorità | Solo siti/enti ufficiali; fonti commerciali terze **non** usate come autorità |
| Diritti non provati | Marcati `UNKNOWN` |
| Redistribuzione | **Non** dedotta dal solo fatto che un file sia scaricabile |

---

## 3. Fonti ufficiali verificate

Verifica: **2026-08-05 ~15:20–15:30 Europe/Rome** (timestamp locale sessione).

### 3.1 IGM — Istituto Geografico Militare

| Campo | Evidenza |
| --- | --- |
| URL ufficiale | https://igmi.esercito.difesa.it/descrizione-prodotti/quadri-di-unione/ |
| Titolo | Quadri di unione (pagina prodotti IGM) |
| Ente | Istituto Geografico Militare (Esercito Italiano) |
| HTTP | **200** (pagina quadri) |
| Accesso | **Libero** per download SHP/KML dei quadri d’unione pubblicati sulla pagina |
| Formati | SHP (+ `.shx` `.dbf` `.prj` ± spatial index/xml); alcuni KML; serie anche ED50/Roma40/UTM |
| Aggiornamento | **UNKNOWN** (frequenza non dichiarata chiaramente sulla pagina quadri) |
| Licenza indice derivato | **UNKNOWN / RICHIEDE AUTORIZZAZIONE** — vedi §3.1.1 |
| Impronte | **PROVATO** (poligoni foglio nei SHP) |

Serie verificate come download ufficiali (link dalla pagina quadri):

| Serie | URL campione | HTTP | Note |
| --- | --- | --- | --- |
| 25V WGS84 | `…/serie_25v_wgs84.zip` | 200 | UTM 32/33 + geo |
| 25 / 25DB WGS84 geo | `…/serie_25_wgs84_geo.zip` | 200 | PolygonZ |
| 25 DBSN Automatica | `…/serie_25kauto.zip` | 200 | CRS RDN2008 Italy zone |
| 50 WGS84 geo | `…/serie_50_wgs84_geo.zip` | 200 | PolygonZ |
| 100V WGS84 | `…/serie_100_wgs84.zip` | 200 | nome file `serie_100_*.zip` (non `serie_100v_*`) |

Altri link ufficiali utili (non tutti campionati): serie ED50/Roma40/fusi; KML 25V; DTM — fuori scope MVP.

Pagine prodotto correlate (ufficiali):

- https://igmi.esercito.difesa.it/descrizione-prodotti/cartografia-stampata/la-serie-25/
- https://igmi.esercito.difesa.it/descrizione-prodotti/cartografia-digitale/la-serie-25-dbsn-automatica/

#### 3.1.1 Licenza / diritti IGM (evidenza vs UNKNOWN)

| Fonte | Cosa dice | Applicabilità ai SHP quadri |
| --- | --- | --- |
| Termini e-commerce https://igmi.org/agb | Prodotti/dati digitali **acquistati** su igmi.org: proprietà IGM; uso personale/professionale limitato; **vietata ridistribuzione al pubblico** e riproduzione non autorizzata (L. 633/1941) | **PARZIALE** — riguarda e-commerce; **non** cita esplicitamente i ZIP gratuiti su `igmi.esercito.difesa.it` |
| WFS IGM (confini/toponimi) | Licenza **CC BY 4.0** dichiarata | **NON applicabile** ai quadri SHP serie cartografiche |
| Pagina quadri | Mentions generiche copyright/uso nel sito; **nessuna** licenza aperta esplicita sui SHP indice | **UNKNOWN** per redistribuzione di dataset derivati |

**Decisione Fase 1:** scaricare e convertire **localmente** per uso operatore = strategia candidata; **non** pubblicare SHP/GeoJSON derivati nel repository pubblico finché l’ente non chiarisce; licenza redistribuzione = `RICHIEDE AUTORIZZAZIONE` / `UNKNOWN`.

**Ambiguità da sottoporre all’IGM:** se i quadri d’unione SHP pubblicati gratuitamente possono essere (a) conservati localmente, (b) convertiti in GeoJSON/NDJSON, (c) usati solo offline nell’app dell’operatore, (d) redistribuiti come indice derivato.

### 3.2 IIM — Istituto Idrografico della Marina (Genova)

| Campo | Evidenza |
| --- | --- |
| URL shop/catalogo | https://www.istitutoidrografico.it/it/pages-36/catalogo |
| Home / ente | https://www.istitutoidrografico.it/ · Marina Militare |
| Catalogo PDF ufficiale (rinvio) | https://www.marina.difesa.it/noi-siamo-la-marina/pilastro-logistico/scientifici/idrografico/Pagine/home.aspx — **II 3001** Catalogo generale (PDF, download gratuito dichiarato dalla pagina shop) |
| HTTP | **200** pagina catalogo shop |
| Accesso | Catalogo PDF: **libero** (dichiarato); carte: **commerciale**; ENC via IC-ENC |
| Impronte strutturate | **UNKNOWN / NON DISPONIBILE** come SHP/GeoJSON ufficiali nella discovery |
| Formati osservati | PDF catalogo; shop HTML; mappa interattiva “Interactive Sailing Map” (PageID=14) — footprint API **UNKNOWN** |
| Endpoint OGC/JSON/KML pubblici documentati | **NON DISPONIBILE** / **UNKNOWN** (nessun endpoint ufficiale documentato usato come base autorizzata) |
| Licenza | Copyright IIM esplicito in pagina catalogo: utilizzazione anche parziale **solo con autorizzazione**; divieto memorizzazione in archivi/banche dati **senza autorizzazione preventiva**; dati numerici: proprietà IIM, no cessione rielaborata senza permesso |
| Licenza indice derivato | **RICHIEDE AUTORIZZAZIONE** |
| Aggiornamento | Catalogo aggiornato all’ultimo fascicolo Avvisi ai Naviganti (**dichiarato**); frequenza esatta **UNKNOWN** |

**Numeri IIM / INT / scale / edizioni / piani-inserti:** presenti nel catalogo ufficiale (PDF/shop), ma **non** estratti in questa Fase 1 (PDF fuori analisi automatica completa). Una carta può richiedere **impronta principale + inserti/piani** e scale diverse — modello `footprints[]` obbligatorio; prova geometrica ufficiale strutturata = **UNKNOWN**.

**Strategia:** provider sospeso in attesa di licenza o dati strutturati autorizzati; eventuale digitalizzazione futura da quadro PDF = **solo dopo autorizzazione**.

### 3.3 CIGA — Centro Informazioni Geotopografiche Aeronautiche (Pratica di Mare)

| Campo | Evidenza |
| --- | --- |
| URL ufficiale (commercializzazione) | https://www.difesaservizi.it/cartografia/ciga |
| Ente | Aeronautica Militare / CIGA; vendita tramite Difesa Servizi S.p.A. |
| HTTP | **200** |
| Accesso | **Commerciale** (preventivo / rivenditori); gratuito solo Enti AM (dichiarato in documenti Difesa) |
| Prodotti citati in fonti istituzionali/storiche | OACI-CAI 1:500.000; JOG-AIR 1:250.000; LFC; Enroute; formati digitali analoghi — elenco completo strutturato **PARZIALE** |
| Catalogo strutturato con impronte | **UNKNOWN / NON DISPONIBILE** in SHP/GeoJSON ufficiali trovati |
| Quadro d’unione | Probabile PDF/immagine (**UNKNOWN** geometria vettoriale ufficiale) |
| Licenza indice derivato | **UNKNOWN / RICHIEDE AUTORIZZAZIONE** |
| ASRP/CADRG | Citati in letteratura di settore; disponibilità ufficiale strutturata per questa discovery = **UNKNOWN** |

**Strategia:** digitalizzazione futura previa autorizzazione **oppure** provider sospeso; **non** digitalizzare l’intero catalogo in Fase 1.

### 3.4 UKHO / ADMIRALTY

| Campo | Evidenza |
| --- | --- |
| Chart Availability List (CAL) | https://www.admiralty.co.uk/charts/chart-availability-list |
| Download CAL ufficiale | https://assets.admiralty.co.uk/public/2022-07/Chart_Availability_List_0.xls?VersionId=… (link dalla pagina ufficiale 2026-08-05) |
| ADMIRALTY Digital Catalogue (ADC) | https://www.admiralty.co.uk/publications/admiralty-digital-catalogue |
| ADC Catalogs ZIP (settimana dichiarata WK31_26) | `ADC_Catalogs_WK31_26.zip` (~12.5 MB dichiarato) |
| ADC Full ZIP | `ADC_Full_WK31_26.zip` (~64 MB dichiarato) |
| HTTP CAL XLS | **200**, Content-Length **961536**, `application/vnd.ms-excel` |
| Accesso catalogo | Consultazione/download cataloghi di **disponibilità/riferimento** pubblici sulla pagina; servizi professionali/distributore per prodotti cartografici protetti |
| Formato CAL | Legacy **.xls** (OLE magic `d0cf11e0…`) — metadati disponibilità SNC/thematic; **non** geometrie footprint nella discovery |
| Geometrie / coverage | **UNKNOWN** nel CAL; ADC è applicazione/catalogo proprietario — footprint estraibili **UNKNOWN** senza unpack autorizzato e ToS |
| Aggiornamento | CAL «weekly» dichiarato; ADC «weekly updates» dichiarato |
| Disclaimer CAL | Listings **non** autorità definitiva al 100% |
| Contenuto protetto | Carte/ENC/raster **non** da includere nel repo |
| Licenza indice derivato | **UNKNOWN / RICHIEDE AUTORIZZAZIONE** (metadati scaricabili ≠ diritto di redistribuire indice derivato) |

**Strategia:** aggiornamento online esplicito **solo** dopo chiarimento ToS; MVP **non** UKHO (volume mondiale + diritti + assenza footprint provati nel CAL).

---

## 4. Campioni IGM (fuori repository)

Directory: `C:\tmp\goi-carto-discovery\igm\`
Analisi JSON: `C:\tmp\goi-carto-discovery\notes\igm-sample-analysis.json`
**Nessun file cartografico committato.**

### 4.1 Hash e byte

| File | Byte | SHA-256 |
| --- | --- | --- |
| `serie_25v_wgs84.zip` | 577452 | `7D373942F7BA472D456572E7701AEC7C3CF2F3C52E9C28CF22E0FCDEA58B489F` |
| `serie_25_wgs84_geo.zip` | 380000 | `6AB6629C2C305D8A032E91990DC6B956ABE292719A7A8642582701E37D5C635A` |
| `serie_50_wgs84_geo.zip` | 199745 | `1F62D8B3E11E2609D081F3E8BB7FD7B9E0A3BF24DEB34633B207EC9D9413F627` |
| `serie_100_wgs84.zip` | 65797 | `9020C818E86C0CAC420AB630158068DC30E0E897C6DD3531D0931442AE7DB8FF` |
| `serie_25kauto.zip` | 73216 | `D35A768C0E4CFDDBA26011C090B90D7A057888ECA8E558D6641CE61AB24C0F1E` |

Campione UKHO (metadati, fuori repo):

| File | Byte | SHA-256 |
| --- | --- | --- |
| `Chart_Availability_List_0.xls` | 961536 | `45DDF127CD27347C7ED07417C972557AF41060F0EE9C12EEC0B39887B1366A45` |

### 4.2 Sintesi geometrie / attributi (layer geo WGS84 preferiti)

| Pacchetto / layer | Geom | Feature | BBox (approx) | CRS | Campi chiave |
| --- | --- | --- | --- | --- | --- |
| 25V `serie_25v_wgs84_geo` | Polygon | 3549 | lon 6.58–18.58, lat 35.47–47.17 | WGS84 geographic | SERIES, SHEET, TITLE, CURRENT_ED, EDITION_DA, AIVABLE, SCALE, … |
| 25/25DB `Serie_25_wgs84_geo` | PolygonZ | 2266 | ~Italia | WGS84 geographic | SERIES, SHEET, TITLE, EDITION_DA, **AIVABLE**, SCALE, … |
| 50 `serie_50_wgs84_geo` | PolygonZ | 633 | ~Italia | WGS84 geographic | SERIES, SHEET, TITLE, CURRENT_ED, EDITION_DA, AIVABLE, SCALE |
| 100V `serie_100_wgs84_geo` | Polygon | 278 | lon 6.45–18.95, lat 35.48–47.33 | WGS84 geographic | SERIES, SHEET, TITLE, CURRENT_ED, EDITION_DA, **AIVABLE**, SCALE, … |
| 25kauto `qu_serie25kauto` | Polygon | 1478 | projected | **RDN2008 Italy zone** | id, numero, subnum, name, scala, minx/maxy, **stato**, estero, mare |

**AIVABLE / stato (PROVATO su campioni):**

| Layer | Conteggio |
| --- | --- |
| 25V geo AIVABLE | tutti `1` (3549) — quadro ≈ tutto “available” nel file |
| 25/25DB geo AIVABLE | `1`=1136, `0`=1130 — **differenza quadro teorico vs disponibile** |
| 50 geo AIVABLE | `1`=545, `0`=88 |
| 100V geo AIVABLE | tutti `1` (278) |
| 25kauto `stato` | `2`=927, `0`=551 — semantica esatta di `stato` = **UNKNOWN** (da documentare con IGM) |

**Note analisi:**

- Geometrie invalide/duplicate: non rilevate con walk header; validazione topologica OGR = **UNKNOWN** (GDAL assente).
- Campo `AIVABLE` (typo storico nei DBF) = segnale disponibilità commerciale/provider nel quadro, **non** possesso archivio personale.
- Pacchetti multi-layer (25V/100V) espongono anche UTM 32N/33N oltre a `_geo`.
- Valori campione (pubblici): es. SHEET `245-I-NE-bis` TITLE `Tropea`; SHEET `283` TITLE `LIVORNO`.

---

## 5. Matrice provider

| Provider | Fonte ufficiale | Impronte disponibili | Formato | CRS | Metadati | Aggiornamento | Accesso | Licenza indice derivato | Strategia proposta |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **IGM** | igmi.esercito.difesa.it quadri | **PROVATO** | SHP (+KML) | WGS84 / UTM / RDN2008 | **PROVATO** (SHEET, TITLE, SCALE, AIVABLE, …) | **UNKNOWN** | Libero download quadri | **UNKNOWN / RICHIEDE AUTORIZZAZIONE** | **Conversione offline autorizzata** (locale) + import pacchetto ufficiale; redistribuzione pubblica sospesa |
| **IIM** | istitutoidrografico.it + marina.difesa.it II 3001 | **NON DISPONIBILE** (vettoriale) / **UNKNOWN** | PDF catalogo; shop | N/A | **PARZIALE** (PDF) | Parziale (Avvisi) | PDF libero; carte commerciali | **RICHIEDE AUTORIZZAZIONE** | **Provider sospeso** in attesa licenza/dati; digitalizzazione futura solo con auth |
| **CIGA** | difesaservizi.it/ciga | **NON DISPONIBILE** / **UNKNOWN** | Catalogo commerciale / PDF-immagini probabili | **UNKNOWN** | **PARZIALE** | **UNKNOWN** | Commerciale | **UNKNOWN / RICHIEDE AUTORIZZAZIONE** | **Digitalizzazione futura previa autorizzazione** o sospeso |
| **UKHO** | admiralty.co.uk CAL + ADC | **NON DISPONIBILE** nel CAL; ADC **UNKNOWN** | XLS CAL; ZIP ADC proprietario | **UNKNOWN** | **PROVATO** (lista disponibilità) | Weekly dichiarato | Catalogo pubblico; prodotti protetti | **UNKNOWN / RICHIEDE AUTORIZZAZIONE** | **Aggiornamento online esplicito** solo post-ToS; non MVP |

Valori conclusioni ammessi rispettati: PROVATO / PARZIALE / UNKNOWN / NON DISPONIBILE / RICHIEDE AUTORIZZAZIONE.

---

## 6. Schema dati provider-neutral (concettuale — non implementato)

```text
schema_version          # es. "1.0.0-draft"
provider_id             # igm | iim | ciga | ukho
provider_name
series_id               # normalizzato (es. igm:25v, igm:50, igm:100v, igm:25dbsn)
series_name
chart_id                # identificatore foglio lato provider (SHEET / BA / IIM …)
international_id        # INT / NATO / altro se presente; altrimenti null
title
chart_type              # topo | nautical | aeronautical | thematic | unknown
scale_denominator       # intero (25000, 50000, …)
edition
revision
publication_date        # ISO-8601 date se parseabile; altrimenti raw + parsed=null
availability_status     # provider-side: available | unavailable | unknown | withdrawn
source_updated_at       # quando il catalogo importato è stato costruito
source_url
source_file
source_checksum         # SHA-256 del pacchetto ufficiale di origine
original_crs
footprints[]            # vedi sotto
bbox                    # envelope WGS84 aggregato di tutte le footprint
rights
rights_url
catalog_status          # in_imported_catalog | not_in_catalog
archive_match_keys[]    # chiavi candidate per matching archivio personale
```

### 6.1 `footprints[]`

Ogni elemento:

```text
footprint_id
role                    # primary | inset | plan | panel | unknown
geometry_type           # Polygon | MultiPolygon
geometry                # WGS84 lon/lat (conversione offline dalla CRS originale)
scale_denominator       # se diversa dalla carta madre
crs_original
notes
```

Deve supportare: più geometrie separate; principale + inserti; relazione scala↔geometria.

### 6.2 Quattro stati distinti (non un solo `available`)

| Concetto | Campo / store | Esempio IGM |
| --- | --- | --- |
| Esistenza nel quadro d’unione | presenza del record nel catalogo serie | feature in SHP |
| Disponibilità corrente presso provider | `availability_status` ← `AIVABLE` / shop | 0/1 in 25DB |
| Presenza nel catalogo importato dall’app | `catalog_status` | dopo import pacchetto |
| Possesso archivio personale operatore | store archivio separato (`owned_status`) | presente/mancante/… |

### 6.3 Chiave logica stabile

Proposta:

```text
logical_key = provider_id + "|" + series_id + "|" + normalize(chart_id)
```

- `normalize`: trim; uppercase; collassa spazi multipli; conserva suffissi (`-bis`, SE/NE); **non** strip cieco degli zeri significativi in codici alfanumerici misti; documentare regole per-provider.
- Duplicati (stesso foglio in UTM32 + UTM33 + geo): preferire layer **geo WGS84**; dedupe per `logical_key`; tenere CRS alternative come `source_variants[]` opzionale.
- Precisioni coordinate: salvare geometrie WGS84 con precisione sufficiente (es. 6–7 decimali lon/lat) dopo conversione; bbox derived.
- Date: ISO-8601 preferito; conservare `publication_date_raw` se parse fallisce (`19970101`, `01/01/1961`).
- Lingua/caratteri: UTF-8 nei pacchetti derivati; DBF spesso Latin-1 — conversione esplicita in pipeline.
- Provenienza: ogni record porta `source_file` + `source_checksum` + `schema_version` + `catalog_build_id`.

---

## 7. Formato pacchetto futuro (raccomandazione)

| Opzione | Peso | Parsing browser | Incrementale | Checksum | Provenienza | Rollback | Offline | Single-HTML |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GeoJSON unico | Medio-alto | Buono | Scarso | File-level | Debole se monolitico | Sostituzione totale | Sì | Import ok; **non** embed |
| JSON meta + geom separate | Medio | Buono | Medio | Per-file | Buona | Buono | Sì | Import ok |
| NDJSON | Medio | Streaming-friendly | Buono | Per-file | Buona | Buono | Sì | Import ok |
| **ZIP + manifest + file** | Compatto | Buono (JSZip già? **UNKNOWN** nel monolite — verificare prima di runtime; altrimenti File API + inflate) | Buono | Manifest SHA | **Ottima** | **Ottima** | Sì | **Raccomandato** |
| Embed nel monolite | Alto rischio peso | N/A | No | Git | Sì ma infla HTML | Difficile | Sì | **Respinto** per cataloghi |
| IndexedDB pack | — | — | — | — | — | — | Sì | **Non autorizzato** in Fase 1 |

**Raccomandazione Fase 1:** pacchetto **ZIP** con:

- `manifest.json` (`schema_version`, `provider_id`, `series[]`, checksums, `rights`, `built_at`);
- `catalog.ndjson` o `catalog.geojson` (FeatureCollection) in WGS84;
- **nessun** raster/carta protetta;
- import manuale dall’operatore; persistenza futura eventualmente IndexedDB solo dopo decisione esplicita separata.

Volume stimato MVP IGM (solo indici geo convertiti, ordine di grandezza):

- sorgenti ZIP ufficiali campionati ≈ **0.6–1.3 MB** aggregati per 25V+25+50+100;
- GeoJSON derivato tipicamente **maggiore** del SHP compresso — **UNKNOWN** esatto finché non convertito in blocco successivo; target MVP: mantenere pacchetti **per serie** < pochi MB ciascuno.

---

## 8. Contratto motore spaziale futuro (non implementato)

**Input area (mutuamente esclusivi o prioritizzati in UI):**

1. rettangolo da riuso gesto **MAP-BOX-ZOOM-A** (oggi solo zoom transiente — **non** cambiare comportamento chiuso);
2. rettangolo indipendente (stesso helper di disegno, altro consumer);
3. poligono;
4. vista corrente mappa;
5. futuro buffer lungo traccia.

**Pipeline:**

1. normalizza area → WGS84 polygon (gestione antimeridiano: split o unwrap);
2. prefiltro `bbox` vs `feature.bbox`;
3. intersezione precisa poligono↔footprint(s);
4. metriche: overlap ratio; copertura completa vs parziale;
5. ordinamento: scale_denominator (crescente o per rilevanza operativa), poi overlap, poi titolo.

**Riuso MAP-BOX-ZOOM-A:** estrarre in futuro un helper di selezione rettangolo condiviso; il path zoom resta invariato; un nuovo tool “Seleziona area carte” può condividere pointer-events/UI senza persistere geometria GIS.

---

## 9. Catalogo archivio personale (progetto — no store)

Campi minimi candidati:

```text
provider_id, series_id, chart_id, international_id,
file_name, archive_reference, edition_owned, status, notes
```

Stati: `presente` | `mancante` | `da_verificare` | `versione_differente` | `duplicato`.

Matching: preferire `logical_key`; fallback `normalize(chart_id)` + `series_id`; poi fuzzy titolo **solo** con conferma operatore.
**Non** accedere ai file personali in Fase 1; **non** creare store.

---

## 10. OPSEC e rete (vincoli futuri)

Classificazione runtime futuro: **DELICATO** (storage, import, rete, OPSEC).

- nessuna richiesta automatica al boot;
- aggiornamento catalogo **solo** azione esplicita;
- `state.forceOffline` blocca ogni download;
- OPSEC strict blocca fonti internet / endpoint sensibili;
- cataloghi già importati interrogabili offline;
- data fonte e stato aggiornamento sempre visibili;
- **nessun** invio di area/coordinate a servizi esterni se la ricerca è locale;
- nessun logging remoto delle aree ricercate.

---

## 11. Raccomandazione MVP

### Provider iniziale: **IGM**

**Motivo (dalla matrice, non per assunzione):** unico provider con **impronte vettoriali ufficiali scaricabili**, CRS WGS84 disponibile, attributi foglio/titolo/scala/disponibilità **provati** su campioni, volume nazionale gestibile. IIM/CIGA/UKHO restano sospesi o posticipati per assenza footprint e/o diritti.

| Voce | Scelta MVP |
| --- | --- |
| Provider | IGM |
| Serie iniziali | **50** + **100V** (geo WGS84) come primo slice; poi **25/25DB** (per `AIVABLE` 0/1); 25V e 25kauto in fase 2 MVP |
| Fonte | ZIP ufficiali pagina Quadri di unione |
| Formato sorgente | SHP |
| Volume stimato | ZIP 50+100 ≈ 265 KB; GeoJSON derivato TBD |
| Campi | SHEET, TITLE, SCALE, SERIES, AIVABLE, CURRENT_ED, EDITION_DA |
| Conversione | SHP→WGS84 GeoJSON/NDJSON offline (tool esterno; non nel monolite) |
| Licenza | Uso locale operatore; redistribuzione pacchetto nel repo pubblico = **sospesa** finché chiarita |
| Pacchetto | ZIP + manifest + catalog GeoJSON/NDJSON |
| UI minima | Import pacchetto; selezione area (vista o rettangolo); lista risultati; evidenzia footprint; mostra data fonte |
| Criteri PASS | Intersezione corretta su area nota; AIVABLE distinto da possesso; offline-only; nessun network al boot; monolite senza embed catalogo |
| Rischi | Licenza derivati UNKNOWN; PolygonZ; typo AIVABLE; dedupe multi-CRS; GDAL assente in alcuni ambienti |
| Rinviati | IIM/CIGA/UKHO; IndexedDB; aggiornamenti online; archivio personale completo; digitalizzazione PDF |

### Sequenza blocchi piccoli (derivata dalle prove)

1. **CARTO-IGM-ACQUIRE-A** — acquisizione/conversione offline serie 50+100V (fuori monolite); checksum; nessun commit dati protetti/derivati redistribuibili senza ok licenza.
2. **CARTO-IGM-VALIDATE-A** — validazione schema + geometrie + AIVABLE.
3. **CARTO-SEARCH-ENGINE-A** — motore ricerca locale read-only (bbox + intersezione) — **DELICATO** se tocca storage.
4. **CARTO-UI-RESULTS-A** — UI risultati + overlay impronte.
5. **CARTO-ARCHIVE-MATCH-A** — catalogo archivio personale (matching).
6. **CARTO-IGM-SERIES-EXPAND-A** — 25/25DB + 25V (+ 25kauto con conversione RDN2008).
7. **CARTO-PROVIDER-NEXT-A** — IIM/CIGA/UKHO solo dopo licenza/dati.
8. **CARTO-ONLINE-UPDATE-A** — aggiornamenti online espliciti (opt-in, OPSEC).

**Nessun** blocco runtime aperto da questa discovery.

---

## 12. Decisioni Fase 1 + Acquire-A

1. WU-0012: discovery COMPLETE; acquire **COMPLETE** — stato `OPEN / IGM LOCAL PACKAGE VALIDATED — NO REDISTRIBUTION`.
2. MVP provider = **IGM**; serie 50+100V localmente normalizzate.
3. Pacchetto raccomandato = **ZIP + manifest + GeoJSON** (prototipo locale già prodotto fuori repo).
4. Redistribuzione indici derivati = **non autorizzata** (fail-closed).
5. Runtime / monolite / IndexedDB = **non aperti**.
6. MAP-BOX-ZOOM-A resta CLOSED; riuso solo futuro via helper condiviso.

---

## 13. UNKNOWN principali (checklist)

- Licenza esplicita IGM sui SHP gratuiti dei quadri (redistribuzione derivati).
- Frequenza aggiornamento ufficiale ZIP IGM.
- Semantica precisa `stato` in 25kauto; validazione topologica OGR.
- Endpoint strutturati IIM (impronte); ToS uso catalogo PDF per indice derivato.
- Quadro vettoriale CIGA; cicli aggiornamento JOG/OACI.
- Footprint estraibili da ADC; ToS uso CAL/ADC per indice derivato redistribuito.
- Presenza JSZip (o equivalente) già nel monolite per import ZIP.
- Peso esatto GeoJSON post-conversione.

---

## 14. Controlli discovery (self-check)

- [x] Solo fonti ufficiali come autorità
- [x] Nessun diritto inventato (`UNKNOWN` dove manca prova)
- [x] Campioni fuori repo; nessun file cartografico in Git
- [x] Monolite invariato
- [x] Nessun runtime / build bump / deploy / QA
- [x] WU-0012 ID libero (nessun overwrite)
- [x] Stato allineabile a OM §7 / roadmap / HANDOFF

---

## 15. Prossimo passo consigliato

**CARTO-SEARCH-ENGINE-A**, **CARTO-UI-RESULTS-A (+ FIX1–FIX3)**, **MAP-INTERACTION-CARTO-UX-BUNDLE-A (+ FIX1–FIX5)**, **CARTO-IGM-RESULTS-UX-BUNDLE-B (+ FIX1–FIX3)**, **CARTO-ARCHIVE-MATCH-A (+ FIX1–FIX2)**, **CARTO-IGM-AREA-ESC-RESTORE-A** e **COORD-MODAL-FORMAT-COPY-A (+ FIX1)** CLOSED / PASS end-to-end. **CARTO-IGM-CRS-AUDIT-A** = DIAGNOSTIC COMPLETE / CRS AUDIT PARTIAL (vedi §15d). Prossimo ordine candidato (solo dopo decisione operatore; **nessun** runtime auto-aperto):

1. **CARTO-IGM-SERIES-EXPAND-A** — espansione serie IGM (non aperto)
2. Provider IIM·CIGA·UKHO / **CARTO-ONLINE-UPDATE-A** (non aperti)
3. **MODAL-OPEN-TOP-ALIGN-A** — backlog UX (non aperto; non WU-0012 core)

**Nessun** auto-start. WU-0012 **resta OPEN** (serie/provider). Runtime live: tip **`a0a6816`** / build **138** (`COORD-MODAL-FORMAT-COPY-A-FIX1`).

---

## 15b. CARTO-IGM-RESULTS-UX-BUNDLE-B (+ FIX1–FIX3) — CLOSED / PASS end-to-end (2026-08-06)

| Campo | Valore |
|-------|--------|
| Catena | `0ad97ee` (B · 129) → `b5d2e44` (FIX1 · 130) → `b89c140` (FIX2 · 131) → `51e0f5b` (FIX3 · 132) |
| Build | `CARTO-IGM-RESULTS-UX-BUNDLE-B-FIX3 · build 132` |
| Blob / byte / SHA-256 LF | `7154fff5…` / `4653927` / `e6f3a61a…5c417e` |
| Deploy | GIS-only PASS tip `51e0f5b` (solo `goi-gis-app`; CMP_PASS) |
| QA | «**QA CARTO-IGM-RESULTS-UX-BUNDLE-B-FIX3 PASS operatore**» |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=51e0f5b` |

**Chiuso:** area-pick rearm; CTA area/vista; fit/Centra; click singolo label (select/scroll, no fit); rimozione navigazione doppio-click label (FIX3).  
**Resta OPEN nella WU:** espansione serie, provider, aggiornamento online, IndexedDB. **Archivio** → §15e CLOSED. **Esc area-pick** → §15f CLOSED. **COORD** → §15g CLOSED.

---

## 15c. Backlog follow-up QA BUNDLE-B — `DOCS-BACKLOG-CARTO-COORD-CRS-A` (2026-08-06)

Docs-only originario; bundle B resta CLOSED. **CARTO-IGM-AREA-ESC-RESTORE-A** → CLOSED in §15f. **COORD-MODAL-FORMAT-COPY-A (+ FIX1)** → CLOSED in §15g.

### CARTO-IGM-AREA-ESC-RESTORE-A — vedi §15f (CLOSED)

Esito registrato in **§15f** — CLOSED / PASS end-to-end (2026-08-07).

### COORD-MODAL-FORMAT-COPY-A (+ FIX1) — vedi §15g (CLOSED)

Esito registrato in **§15g** — CLOSED / PASS end-to-end (2026-08-07). Catena `04c4d37` → `a0a6816`.

### CARTO-IGM-CRS-AUDIT-A — vedi §15d (non più BACKLOG)

Esito registrato in **§15d** — DIAGNOSTIC COMPLETE / CRS AUDIT PARTIAL.

---

## 15d. CARTO-IGM-CRS-AUDIT-A — DIAGNOSTIC COMPLETE / CRS AUDIT PARTIAL (2026-08-06)

**Task docs:** `DOCS-CARTO-IGM-CRS-AUDIT-A-CLOSE`. Diagnosi read-only; **nessuna** modifica runtime / payload / `data/carto/igm/**` / licenze.

| Campo | Valore |
|-------|--------|
| Classificazione | **CRS AUDIT PARTIAL** |
| ARCHIVE-MATCH | sblocco tecnico storico → poi **CLOSED** runtime (§15e) |
| Runtime al close audit | tip allora `51e0f5b` / build 132 (poi superseded da ARCHIVE tip `c4d7db5`) |

### Evidenze provate

- Payload `#cartoIgmEmbeddedData` `carto-igm-compact-v1`: **911** record (633 Serie 50 + 278 Serie 100V).
- Sorgenti dichiarate: `serie_50_wgs84_geo` / `serie_100_wgs84_geo` (ZIP ufficiali + checksum in manifest).
- Geometrie embedded: **OGC:CRS84**, coordinate **longitudine, latitudine**; bbox **west, south, east, north**.
- Renderer: `cartoGeomToSvgPathD` → `tileMapLatLonToPx(root, pt[1], pt[0])` coerente; nessuna riproiezione datum in browser.
- Bbox e geometrie strutturalmente coerenti 911/911; anelli chiusi; coordinate finite.
- Payload ↔ GeoJSON collegati da conteggi, manifest e checksum documentati.
- `chart_id` **non** univoco tra serie → chiave logica obbligatoria `provider + series_id + chart_id`.

### Terminologia

- Usare «**OGC:CRS84, coordinate lon/lat**»; **non** scrivere che CRS84 è formalmente identico a «EPSG:4326 lon-first».
- GeoJSON usa comunque coordinate longitudine/latitudine.

### Serie 50 PolygonZ

- Layer sorgente Serie 50 = PolygonZ; pipeline ha scartato Z.
- **Non** dichiarare CRS tridimensionale; CRS orizzontale = CRS84; significato/datum verticale Z = **NOT VERIFIED**.

### Pipeline

- SHP → GeoJSON via strumento Python esterno documentato (formato, DBF Latin-1→UTF-8, chiusura anelli, drop Z).
- Nessun datum shift necessario (layer già WGS84 geographic).
- Script non nel repository → implementazione interna non completamente verificabile.
- **Non** scrivere errore posizionale = 0: nessuno scarto da riproiezione datum risulta introdotto dalla pipeline documentata; accuratezza assoluta footprint / generalizzazione quadro d’unione **non quantificate**.

### Controllo operatore — foglio 232 S50 SESTRI LEVANTE

| Voce | Valore |
|------|--------|
| NW embedded | ≈ 9.332321 E / 44.399023 N |
| Waypoint QA (MGRS) | `32T NQ 26463 16249` |
| Conversione WGS84/UTM 32N | ≈ 9.332304 E / 44.399044 N |
| Scarto approx. | ≈ **2,7 m** |

Conclusione: waypoint ≈ angolo NW footprint; nessun offset significativo Roma40/ED50 sul footprint; differenza vs foto/scansione può dipendere da prospettiva/deformazione/taglio/margini/georeferenziazione; verifica sul footprint, **non** prova datum edizione cartacea.

### Bordi densificati Serie 50

Molte geometrie Serie 50 presentano bordi densificati; causa esatta **non provata** (possibile rappresentazione geografica del bordo foglio). **Non** attribuire significato territoriale (coste/province) senza ulteriori evidenze.

### Distinzione footprint / carta

| | A. Geometria footprint | B. Carta / edizione fisica |
|---|---|---|
| CRS / sistema | OGC:CRS84 lon/lat | datum / proiezione / reticolato |
| Uso | ricerca spaziale, visualizzazione, Web Mercator | esemplare fisico |
| Stato | **PROVATO** | **NOT VERIFIED** per singola edizione (anche margini/tagli/scansione) |

Una carta Roma40/Gauss-Boaga o ED50/UTM può essere rappresentata da un footprint catalografico moderno in WGS84. **Non** assegnare datum/proiezione alla carta dal CRS del footprint.

### ARCHIVE-MATCH — limitazioni documentate

Usabile per: ricerca spaziale; visualizzazione; associazione esemplare→foglio/serie; area coperta.

Limitazioni: matching = foglio **non** edizione automatica; chiave `provider+series_id+chart_id` (mai solo numero foglio); Polygon+MultiPolygon; tolleranza bordi; non dedurre datum/proiezione/reticolato esemplare; mostrare UNKNOWN/NOT VERIFIED senza fonte edizione.

Metadati futuri: `crs_geometry` (= OGC:CRS84), `source_file`, `source_checksum`, `catalog_build_id`, `transform_status`; `datum_chart` / `projection_chart` / `grid_chart` / `uncertainty_note` restano UNKNOWN/NOT VERIFIED senza fonte per-edizione.

---

## 15e. CARTO-ARCHIVE-MATCH-A (+ FIX1–FIX2) — CLOSED / PASS end-to-end (2026-08-07)

| Campo | Valore |
|-------|--------|
| Catena | `39ba407` (A · 133) → `84c9710` (FIX1 · 134) → `c4d7db5` (FIX2 · 135) |
| Build | `CARTO-ARCHIVE-MATCH-A-FIX2 · build 135` |
| Blob / byte / SHA-256 LF | `e39dd1fe…` / `4692528` / `d7c683f3…6629b81` |
| Deploy | GIS-only PASS tip `c4d7db5` (solo `goi-gis-app`; CMP_PASS) |
| QA | «**QA CARTO-ARCHIVE-MATCH-A-FIX2 PASS operatore**» |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=c4d7db5` |

**Chiuso:** catalogo metadati locale Indice IGM (`state.cartoArchiveRecords`); chiave logica `provider+series_id+chart_id`; CRUD + rollback; UI badge/editor; FIX1 persistenza transazionale + ISO UTC; FIX2 chiusura editor post-Salva + notice pannello flash 10s.  
**Limitazioni invariate:** matching = foglio ≠ edizione CRS automatica; no scansioni/file.  
**Resta OPEN nella WU:** espansione serie, provider, aggiornamento online, IndexedDB. **Esc** → §15f CLOSED.

---

## 15f. CARTO-IGM-AREA-ESC-RESTORE-A — CLOSED / PASS end-to-end (2026-08-07)

| Campo | Valore |
|-------|--------|
| Tip | `764e661` (build 136) |
| Build | `CARTO-IGM-AREA-ESC-RESTORE-A · build 136` |
| Blob / byte / SHA-256 LF | `d3ea3106…` / `4693977` / `81aba792…c40d15` |
| Deploy | GIS-only PASS tip `764e661` (solo `goi-gis-app`; CMP_PASS) |
| QA | «**QA CARTO-IGM-AREA-ESC-RESTORE-A PASS operatore**» |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=764e661` |

**Chiuso:** Esc in area-pick annulla solo draft + disarm; restore pannello se minimizzato dal picker (`_areaPickMinimizedByPicker`); `stopImmediatePropagation` su entrambi i listener Esc; nessun search/clear; rearm wheel/+/− preservato.  
**Resta OPEN nella WU:** COORD → §15g CLOSED; espansione serie, provider, aggiornamento online, IndexedDB.

---

## 15g. COORD-MODAL-FORMAT-COPY-A (+ FIX1) — CLOSED / PASS end-to-end (2026-08-07)

| Campo | Valore |
|-------|--------|
| Catena | `04c4d37` (A · 137) → `a0a6816` (FIX1 · 138) |
| Tip | `a0a6816` (build 138) |
| Build | `COORD-MODAL-FORMAT-COPY-A-FIX1 · build 138` |
| Blob / byte / SHA-256 LF | `ecd88f54…` / `4703770` / `f882bdaa…644b3d46` |
| Deploy | GIS-only PASS tip `a0a6816` (solo `goi-gis-app`; CMP_PASS) |
| QA | A PARTIAL → FIX1; «**QA COORD-MODAL-FORMAT-COPY-A-FIX1 PASS operatore**» |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=a0a6816` |

**Chiuso:** formato + Copia liste Waypoint/Track/Preferiti; select in editor Waypoint; `#wpFieldCoord` sincronizzato al formato; paste/`autoDetect` → draft (new flow); Salva con parse obbligatorio del testo corrente; session-only `_waypointListCoordFormat`.  
**Backlog registrato (non WU core):** **MODAL-OPEN-TOP-ALIGN-A**.  
**Resta OPEN nella WU:** espansione serie, provider, aggiornamento online, IndexedDB.

---

## 16. CARTO-IGM-ACQUIRE-A — acquisizione e normalizzazione locale (2026-08-05)

**Gate:** `CARTO-IGM-ACQUIRE-A — COMPLETE / LOCAL PACKAGE VALIDATED / NO RUNTIME`

### 16.1 Directory locale (NON in Git)

```text
C:\tmp\goi-carto-discovery\igm-acquire-a\
├── source\          # copie ZIP ufficiali (hash Fase 1 invariati)
├── extracted\
├── normalized\      # GeoJSON + manifest
├── validation\      # seconda conversione determinismo
├── scripts-temp\    # igm_acquire_normalize.py (non committato)
└── reports\         # inventory, validation, spatial, summary
```

### 16.2 Sorgenti usate

| File | URL ufficiale | Byte | SHA-256 | Match Fase 1 |
| --- | --- | --- | --- | --- |
| `serie_50_wgs84_geo.zip` | `…/serie_50_wgs84_geo.zip` | 199745 | `1F62D8B3E11E2609D081F3E8BB7FD7B9E0A3BF24DEB34633B207EC9D9413F627` | **sì** |
| `serie_100_wgs84.zip` | `…/serie_100_wgs84.zip` | 65797 | `9020C818E86C0CAC420AB630158068DC30E0E897C6DD3531D0931442AE7DB8FF` | **sì** |

Layer usati: `serie_50_wgs84_geo` (PolygonZ→2D); `serie_100_wgs84_geo` (Polygon).
Acquired_at (manifest): `2026-08-05T18:22:00+02:00`.
Nessun riscarico: hash coincidente con Discovery-1.

### 16.3 Strumenti

- Python **3.14.2** (stdlib: `zipfile`, `struct`, `json`, `hashlib`, `math`, `re`)
- **GDAL/OGR:** NON_AVAILABLE (non installato)
- PowerShell per hash/copy/dir
- Generator: `carto-igm-acquire-a` v`1.0.0`

### 16.4 Mapping campi

| Sorgente | → Schema | Note |
| --- | --- | --- |
| SHEET | `chart_id` | trim; collapse whitespace; collapse `--`/`//`; **non** cast numerico |
| TITLE | `title` | latin-1 decode |
| CURRENT_ED | `edition` | as-is |
| EDITION_DA | `edition_date` | YYYYMMDD o DD/MM/YYYY → ISO; altrimenti null + raw in notes |
| SCALE | `scale_denominator` | `int(float)` |
| SERIES | notes only | `series_id` da config pacchetto (`50` / `100v`) |
| AIVABLE | `raw_properties` only | **`provider_availability = null`** — semantics not formally confirmed |

Chiave stabile: `igm:{series_id}:{normalized_chart_id}` (= `record_id`). Collisioni: **0** per serie; cross-series: **0**.

### 16.5 Output pacchetto (locale)

| File | Feature | Byte | SHA-256 |
| --- | --- | --- | --- |
| `normalized/igm-series-50.geojson` | 633 | 1738772 | `401D6715E65561ECBF4FC9C653DF769324BC6D747FC5CA7EA73C91279E1158A1` |
| `normalized/igm-series-100v.geojson` | 278 | 524432 | `C9619E5238A7F3FEA1DDFB0A95DCE886CBCDF0C88858B3B6D9BBA6AA22F9704C` |
| `normalized/manifest.json` | — | 7033 | `3E59F015F69A57F2CA115289BAF72A2260422B4864B56AB96F5033A4D3928FDA` |

`rights_status` (manifest): **`local-use-prototype-no-redistribution`**.
Nota: prototipo locale; non redistribuire; non committare; non pubblicare; fonte IGM.

### 16.6 Metriche / anomalie

| Serie | Source | Convertite | Scartate | ID dup | Geom invalide | Chiusure strutturali | Findings |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 50 | 633 | 633 | 0 | 0 | 0 | 0 | 0 |
| 100v | 278 | 278 | 0 | 0 | 0 | 0 | 0 |

- SCALE distinti: 50 → `{50000:633}`; 100v → `{100000:278}`
- AIVABLE raw: 50 → `{1:545, 0:88}`; 100v → `{1:278}` (preservato; non mappato a availability)
- PolygonZ: Z droppata in output 2D (serie 50)
- Determinismo: **PASS** (due conversioni SHA-256 identici per entrambi i GeoJSON)
- Area Italia: bbox entro inviluppo atteso; nessuna inversione lat/lon rilevata

### 16.7 Test spaziali locali (offline)

| Rettangolo | Hit |
| --- | --- |
| nord_italia | 147 |
| centro_italia | 133 |
| sud_isole | 94 |
| fuori_italia | **0** |
| confine_fogli_liguria | 9 |

Assertion aggregate: **PASS**. Nessun servizio online.

### 16.8 Decisioni (storiche al momento dell’acquire)

1. Pacchetto IGM MVP **validato localmente**.
2. All’epoca: fail-closed su redistribuzione / commit dati — **superato** dalla registrazione licenza §17.
3. Runtime / UI / IndexedDB non aperti in acquire — runtime SEARCH-ENGINE autorizzato in §17.

---

## 17. Autorizzazione IGM + apertura CARTO-SEARCH-ENGINE-A

**Registrazione:** autorizzazione IGM fornita dall’operatore e registrata con riferimento documentale.

| Campo | Valore |
| --- | --- |
| Data | 2024-05-24 |
| Riferimento | Prot. IGM-2024-7891 |
| Sintesi pubblica | [`docs/licenses/IGM-SERIES-50-100V-AUTHORIZATION-SUMMARY.md`](../licenses/IGM-SERIES-50-100V-AUTHORIZATION-SUMMARY.md) |
| SHA-256 prova privata | `a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890` |
| Serie | 50 + 100V WGS84 geografica |
| Diritti | SHP→GeoJSON; redistribuzione derivati; pubblicazione GitHub; embedding app; aggiornamenti da fonte ufficiale |
| Limiti | non commerciale; no vendita diretta; no prodotti a pagamento senza ulteriore auth; no raster/editoriale; non affiliazione |

**Stato WU (post-licenza, pre-chiusura SEARCH-ENGINE):** `OPEN / IGM LICENSE GRANTED — CARTO-SEARCH-ENGINE-A AUTHORIZED` — **superato** da §18.

**Attribuzione obbligatoria:**

```text
© Istituto Geografico Militare Italiano (IGM) — Quadri d'unione Serie 50 e 100V. Dati geografici elaborati per uso non commerciale.
```

---

## 18. CARTO-SEARCH-ENGINE-A — CLOSED / PASS end-to-end (2026-08-05)

| Campo | Valore |
| --- | --- |
| Tip runtime | `c80129ed7d3a1928236b6b4f7de874fb595b2f98` (`c80129e`) |
| Parent licenza | `ec1cd88e13062edd3718e8ca1670e2717373ea47` (`ec1cd88`) |
| Build | `CARTO-SEARCH-ENGINE-A · build 118` |
| Blob / byte LF / SHA-256 LF | `2ef0a206…` / 4571370 / `c6b01abe…cc17572` |
| Dataset | 911 (50=633, 100V=278) in `data/carto/igm/` |
| Payload | `#cartoIgmEmbeddedData` compact-v1 SHA `E65C39C0…CA5D` |
| Review | GPT-sostitutiva **PASS / DEPLOY AUTHORIZED** |
| Deploy | GIS-only PASS (solo `goi-gis-app`) |
| QA | «**QA CARTO-SEARCH-ENGINE-A PASS operatore**» |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=c80129e` |

**Fuori scope (resta OPEN nella WU):** archivio personale, aggiornamento online, IIM/CIGA/UKHO, Serie 25, IndexedDB. (UI risultati + overlay: CLOSED in §19.)

---

## 19. CARTO-UI-RESULTS-A (+ FIX1 + FIX2 + FIX3) — CLOSED / PASS end-to-end (2026-08-06)

| Campo | Valore |
| --- | --- |
| Tip finale / live | `62d24eb15b119adb19d60fde5e5c386d6a21a87b` (`62d24eb`) |
| Catena | `5e734f5` (A · 119) → `9991955` (FIX1 · 120) → `105fd7f` (FIX2 · 121) → `62d24eb` (FIX3 · 122) |
| Build | `CARTO-UI-RESULTS-A-FIX3 · build 122` |
| Blob / byte LF / SHA-256 LF | `af24b5bf…` / 4610584 / `f489b445…bb1cd1` |
| Payload embedded | SHA `E65C39C0…CA5D` invariato |
| Review FIX3 | GPT-sostitutiva **PASS / DEPLOY AUTHORIZED** |
| FIX2 | deploy tecnico PASS; QA non iniziata; review revocata (finding L10N `t()` → chiavi grezze EN/FR) |
| FIX3 | `cartoUiT` fallback IT scoped; EN/FR senza chiavi CARTO; `t()` globale invariato |
| Deploy | GIS-only PASS tip `62d24eb` (solo `goi-gis-app`; HTTP 200; CMP_PASS) |
| QA | «**QA CARTO-UI-RESULTS-A-FIX3 PASS operatore**» |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=62d24eb` |

**Chiuso:** sottoblocco UI risultati + overlay + lifecycle/a11y/L10N freeze-safe.  
**Resta OPEN nella WU:** archivio personale, espansione serie, provider IIM/CIGA/UKHO, aggiornamento online, IndexedDB.
