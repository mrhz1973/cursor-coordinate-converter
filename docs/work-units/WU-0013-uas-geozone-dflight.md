<!-- AUTO-VIA-HEADER: NON RIMUOVERE -->
> **REGOLA OPERATIVA VINCOLANTE — AUTO-VIA.** Se il prossimo passo non richiede una decisione reale dell’operatore — scelta di prodotto, scope ambiguo, rischio non autorizzato o conflitto non risolvibile — l’assistente deve considerare il `vai` già concesso e procedere autonomamente. È vietato chiedere conferme, autorizzazioni o un nuovo `vai` per attività già approvate, programmi già autorizzati o passaggi tecnicamente determinati. Un programma esplicitamente autorizzato resta autorizzato per i blocchi successivi finché non emerge una scelta reale o un gate fallito. Fermarsi soltanto davanti a una decisione effettiva che può cambiare il risultato.
<!-- /AUTO-VIA-HEADER -->

# WU-0013 — UAS-GEOZONE-DFLIGHT — Zone Geografiche UAS italiane (D-Flight ED-269/ED-318)

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN / D-FLIGHT-A+B+CDE CLOSED / HELPER H2 LIVE — ACTIVE D-FLIGHT-F
**ACTIVE BLOCK:** D-FLIGHT-F
**CURRENT GATE:** review GPT-sostitutiva → CORS/config VPS → deploy → Automated Browser QA → QA operatore
**REVIEW BASE:** `b1edfef6c678e3c75249371a8b73530d0dd68714`
**CANDIDATE RUNTIME:** `52703420d97ee456476a1480aff53968a4472052` · build 161 · `APP_BUILD_ID=D-FLIGHT-F` · NOT DEPLOYED
**RUNTIME LIVE:** `a37b91265a927a8ddfa8325437f34867b9de0570` · build 160 · `APP_BUILD_ID=D-FLIGHT-CDE`
**NEXT:** review sostitutiva DELICATO su `5270342` → CORS/config helper `:8010` → deploy GIS-only
<!-- /WU-HOT-HEADER -->

**Stato:** `OPEN / D-FLIGHT-A+B+CDE CLOSED / HELPER H2 LIVE — NEXT D-FLIGHT-F`
**Blocco discovery:** `CARTO-DFLIGHT-DISCOVERY-A` — **DIAGNOSTIC COMPLETE — TECHNICAL PLAN READY** (2026-08-11, read-only)
**Blocco apertura WU:** `DOCS-DFLIGHT-WU-0013-OPEN-A` — **CLOSED / PASS DOCS-ONLY** (2026-08-11)
**Blocco validate:** `DFLIGHT-REAL-DATA-VALIDATE-A` — **PARTIAL — OPERATOR AUTH CAPTURE REQUIRED** (2026-08-11, diagnostic; gate intermedio **superato** da AUTH-CAPTURE)
**Blocco auth capture:** `DFLIGHT-AUTH-CAPTURE-A` — **DIAGNOSTIC COMPLETE — PUBLIC/HYBRID/AUTH HELPER PATH PROVEN** · **PATH = H2 AUTHENTICATED** (2026-08-11, diagnostic read-only; sample fuori repo)
**Blocco riconciliazione:** `DOCS-DFLIGHT-H2-RECONCILE-A` — **CLOSED / PASS DOCS-ONLY** (2026-08-11)
**Blocco helper:** `DFLIGHT-HELPER-H2-A` (+ `FIX1`) — **CLOSED / PASS end-to-end** (2026-08-11) — repo `bc80604` · VPS deploy TECHNICAL PASS · Automated Browser QA **N/A** · QA operatore **PASS**
**Blocco client parser:** `D-FLIGHT-A` — **CLOSED / PASS end-to-end** (2026-08-12) — tip `d52367b` · build **158** · A3-light · `window.GOIDflight` · Automated Browser QA **PASS** · QA operatore **PASS**
**Blocco normalized model:** `D-FLIGHT-B` — **CLOSED / PASS end-to-end** (2026-08-12) — tip `4fc7ee3` · build **159** · `GOIDflight.normalize` · Automated Browser QA **PASS** · QA operatore **PASS**
**Blocco overlay+UI:** `D-FLIGHT-CDE` — **CLOSED / PASS end-to-end** (2026-08-12) — tip `a37b912` · build **160** · SVG+toggle/legend+details · Automated Browser QA **PASS** · QA operatore **PASS**
**Tipo:** macro-feature separata — layer operativo UAS / spazio aereo (non carta cartografica statica)
**Data apertura:** 2026-08-11
**Runtime live (GIS tip):** `a37b91265a927a8ddfa8325437f34867b9de0570` · `APP_BUILD_ID = "D-FLIGHT-CDE"` · `APP_BUILD_NUM = 160`
**Monolite in WU-0013:** **modificato** in A+B+CDE (parser + normalize + overlay/UI; **nessuna** rete helper/persistenza dataset). Helper VPS **invariato**.
**Helper VPS:** **IMPLEMENTATO E DEPLOYATO** — `infra/dflight-helper/` @ `bc806049c887417eea195da11b00b9c588bc05ea`; live `READY` · `NO_FLY_ZONE` · features **849** · sha `88d564a65152…`. **Client GIS:** parser+normalize+overlay/UI **CLOSED**; integrazione rete — NEXT **`D-FLIGHT-F`**.

> Relazione roadmap: sezione **WU-0013 — UAS-GEOZONE-DFLIGHT** in [`WU-0005-0009-roadmap.md`](WU-0005-0009-roadmap.md).
> Relazione WU-0012: D-Flight è semanticamente diverso da IGM/IIM/CIGA/UKHO (carte cartografiche statiche a scala definita). Condivide con [`WU-0012`](WU-0012-carto-index-federated.md) solo il **pattern architetturale overlay** (SVG, layer menu, helper coordinate, sanitizer) — **non** il modello dati. Riferimento incrociato in WU-0012 §*Collegamento a WU-0013*.

---

## 1. Scopo

Produrre un layer vettoriale autonomo delle **Zone Geografiche UAS italiane** pubblicate da **D-Flight** (portale ENAV/ENAC), in formato **EUROCAE ED-269** / **ED-318** (JSON), come overlay operazionale del GOI GIS Tool. Il layer deve restare **dataset/layer concettualmente autonomo**, separato da:

- `state.mapWaypoints[]` (waypoint);
- `state.cartoArchiveRecords` (catalogo archivio personale IGM WU-0012);
- `state.track` / `state.savedTracks[]` (tracce);
- `state.gisPolygons[]` (poligoni GIS).

**Non** incorpora carte cartografiche protette: il dataset D-Flight è un insieme di volumi di spazio aereo con geometria, verticalità, temporalità, regole e contatti.

---

## 2. Metodo e limiti (identici ai vincoli repo)

| Voce | Valore |
| --- | --- |
| Verifica HTTP | PowerShell `Invoke-WebRequest` (GET/HEAD) su URL ufficiali |
| Campioni | Solo in `C:\tmp\goi-carto-provider-next\dflight\` (fuori repo) |
| Osservazione rete | Passiva, limitata a fonti pubbliche |
| Autorità | Solo siti/enti ufficiali; fonti commerciali terze non usate come autorità |
| Diritti non provati | Marcati `UNKNOWN` |
| Redistribuzione | **Non** dedotta dal solo fatto che un file sia scaricabile |
| OPSEC / offline-first | Nessuna fetch automatica al boot; import manuale esplicito |
| Workbench / Oggetti GIS | **FROZEN** |

---

## 3. Fonti ufficiali verificate (Discovery 2026-08-11)

Verifica: **2026-08-11 ~15:40–16:00 Europe/Rome** (timestamp sessione discovery).

### 3.1 D-Flight — portale operativo

| Campo | Evidenza |
| --- | --- |
| URL portale | https://www.d-flight.it/ · https://www.d-flight.it/new_portal/ |
| URL servizi mappe | https://www.d-flight.it/new_portal/services/mappe/ |
| URL annuncio JSON | https://www.d-flight.it/new_portal/d-flight-disponibili-le-zone-geografiche-uas-nel-formato-standard-comunitario/ (2 ago 2024) |
| URL webapp | https://www.d-flight.it/web-app/ (SPA Leaflet-like; fallback HTML identico 57877 byte → routing client-side) |
| URL manuali | https://www.d-flight.it/new_portal/guide-manuali/ |
| HTTP | **200** su tutte le pagine pubbliche |
| Servizio download JSON ED-269 | **PROVATO** (esiste) ma **dietro autenticazione** BASE/PRO subscription |
| Endpoint live JSON | **UNKNOWN** (URL generato da azione utente post-login) |
| Web map endpoint | **UNKNOWN** (dietro auth; non osservabile passivamente) |
| Aggiornamento | «costantemente aggiornate» (dichiarato); frequenza esatta UNKNOWN |

### 3.2 Documentazione tecnica D-Flight

| Documento | URL | Stato |
| --- | --- | --- |
| Manuale Utente v15 ENG (gen 2026) | https://www.d-flight.it/new_portal/wp-content/uploads/2026/01/D-Flight-Manuale_Utente-v15-ENG.pdf | **PROVATO** — §6 *DOWNLOAD UAS GEOZONE* pag. 126 |
| Manuale Utente v14 EN (lug 2024) | https://www.d-flight.it/new_portal/wp-content/uploads/2024/07/D-Flight-Manuale_Utente-v14_EN.pdf | PROVATO |
| ICD U-Box/UTM v1.4 | https://www.d-flight.it/new_portal/wp-content/uploads/2022/08/DFLIGHT_ICD_U-Box_UTM_V.1.4.pdf | PROVATO (OpenID privato; M2M su richiesta) |

### 3.3 Sorgenti istituzionali correlate

| Fonte | URL | Ruolo |
| --- | --- | --- |
| ENAC — annuncio ED-269 | https://www.enac.gov.it/news/operazioni-con-uas-disponibilita-delle-zone-geografiche-uas-secondo-lo-standard-eurocae-ed-269/ | Conferma ufficiale download JSON ED-269 via D-Flight |
| ENAC — Bozza Reg Zone Geografiche UAS (giu 2026) | https://www.enac.gov.it/app/uploads/2026/06/2026_06_22-Bozza-Reg-Zone-geografiche-UAS.pdf | Quadro normativo art. 15 Reg. (UE) 2019/947 |
| EUROCAE ED-269 Change 1 (gen 2025) | https://www.eurocae.net/product/ed-269-change-1-mops-for-geofencing/ | Standard MOPS; **Ch. 8/9/Appendix 2 rimossi** (sostituiti da ED-318) |
| EUROCAE ED-318 (gen 2024) | https://www.eurocae.net/product/ed-318-technical-specification-for-geographical-zones-and-u-space-data-provision-and-exchange/ | Technical Specification GeoZones + U-Space data exchange |
| EUROCONTROL SWIM — UAS GeoZones | https://swim-eurocontrol.atlassian.net/wiki/spaces/UGZ/ | Linee guida implementative |
| EUROCONTROL SWIM — Validation page | https://swim-eurocontrol.atlassian.net/wiki/spaces/UGZ/pages/59113476 | JSON Schema pubblico + esempi |
| Schema JSON ED-269 (EUROCONTROL) | https://github.com/eurocontrol-swim/geofencing-prototype/tree/master/specs | **PROVATO** — UASZone + Authority + TimePeriod + AirspaceVolume |
| Schema/esempi ED-318 | https://github.com/UASGeoZones/ED-318 | **PROVATO** — FeatureCollection GeoJSON + `layer` + `extent` |

### 3.4 NOT REQUIRED

| Voce | Classificazione |
| --- | --- |
| Web map scraping | **NOT REQUIRED** — il JSON ED-269 ufficiale è autosufficiente (tutte le geometrie) |
| Endpoint tile privati | fuori scope (basemap commerciali PRO Google/Bing/Navteq; Land Use CORINE / Census ISTAT) |
| Servizi M2M/API addizionali | fuori scope (richiedono contatto `protocollogenerale@pec.d-flight.it`) |

---

## 4. Schema JSON (ED-269 / ED-318) — pubblico

Lo schema è documentato in `eurocontrol-swim/geofencing-prototype` + esempi `UASGeoZones/ED-318`. Il file IT può seguire una di tre varianti: il parser futuro deve rilevarla.

### 4.1 Top-level — tre varianti

- **V1 (ED-269 stand-alone array)**: `[ UASZone, … ]`.
- **V2 (ED-269 con header)**: `{ "title": str, "description": str, "features": [ UASZone, … ] }`.
- **V3 (ED-318 FeatureCollection)**: `{ "type": "FeatureCollection", "title": str, "metadata": { validFrom, issued }, "features": [ Feature, … ] }`.

### 4.2 Campi `UASZone` (ED-269 schema)

| Campo | Tipo | Obb/Opz | Esempio | Uso GIS |
| --- | --- | --- | --- | --- |
| `identifier` | string(7) | **OBBL** | `NFZ6546` | stable id |
| `country` | string(3) | **OBBL** | `ITA` | filter |
| `name` | string(200) | opz / multilingua V3 | `LIPA-4` | label/tooltip |
| `type` | enum `COMMON`/`CUSTOMIZED` | **OBBL** | `COMMON` | categoria |
| `restriction` | enum `PROHIBITED`/`REQ_AUTHORISATION`/`CONDITIONAL`/`NO_RESTRICTION` | **OBBL** | `REQ_AUTHORISATION` | styling/legenda |
| `restrictionConditions` | string[] | opz | — | tooltip |
| `region` | integer | opz | — | filtro |
| `reason` | enum[≤9] `AIR_TRAFFIC`/`SENSITIVE`/`PRIVACY`/`POPULATION`/`NATURE`/`NOISE`/`FOREIGN_TERRITORY`/`EMERGENCY`/`OTHER` | opz | `["AIR_TRAFFIC"]` | legenda/filtro |
| `otherReasonInfo` | string(200) | opz | — | tooltip |
| `regulationExemption` | enum `YES`/`NO` | opz | — | icona |
| `uSpaceClass` | string(100) | opz | — | filtro U-Space |
| `message` | string(200) | opz | — | tooltip |
| `zoneAuthority[]` | obj[] | **OBBL** (≥1) | vedi §4.3 | contatti/azioni |
| `applicability[]` | obj[] (TimePeriod) | opz | vedi §4.4 | temporale |
| `geometry[]` | obj[] (AirspaceVolume) | **OBBL** (≥1) | vedi §4.5 | rendering |
| `extendedProperties` | object | opz | — | raw-only |

### 4.3 `zoneAuthority[]`

`name`, `service`, `email`, `contactName`, `siteURL`, `phone`, `purpose` (enum `AUTHORIZATION`/`NOTIFICATION`/`INFORMATION`), `intervalBefore` (ISO-8601 duration).

### 4.4 `applicability[]` / TimePeriod

`permanent` (`YES`/`NO`, **OBBL**), `startDateTime` (date-time), `endDateTime` (date-time), `schedule[]` (`day[]` MON…SUN/ANY, `startTime`/`endTime` time UTC).

### 4.5 `geometry[]` / AirspaceVolume

`uomDimensions` (enum `M`/`FT`, **OBBL**), `lowerLimit` (int), `lowerVerticalReference` (enum `AGL`/`AMSL`, **OBBL**), `upperLimit` (int), `upperVerticalReference` (enum `AGL`/`AMSL`, **OBBL**), `horizontalProjection` (`Polygon` GeoJSON oppure `Circle` center+radius, **OBBL**).

---

## 5. Geometria orizzontale

- **Tipi**: `Polygon` (GeoJSON; array di anelli; primo = shell esterno; successivi = holes) e `Circle` (center `[lon,lat]` + radius metri).
- **MultiPolygon nativo**: non presente — zone disgiunte/multi-volume → array `geometry[]` con più AirspaceVolume (Polygon) oppure `GeometryCollection` in ED-318.
- **CRS**: `urn:ogc:def:crs:OGC::CRS84` (lon/lat), identico al default GeoJSON RFC 7946.
- **Ordine coordinate**: **lon, lat** (verificato in tutti gli esempi pubblici).
- **Anelli**: min 4 vertici (primo = ultimo → chiusura esplicita).
- **Circle**: da rasterizzare in poligono (32-64 vertici; Vincenty geodetico).
- **Antimeridiano**: non rilevante per Italia (lon ~6-19, lat ~35-48 atteso); parser difensivo con `normalizeLon` esistente.

---

## 6. Dimensione verticale

Modello normalizzato (campo `geometry[]` è array → **più layer verticali** nativi):

```text
lower_value        = geometry[i].lowerLimit
lower_unit         = geometry[i].uomDimensions      # M | FT
lower_reference    = geometry[i].lowerVerticalReference   # AGL | AMSL
upper_value        = geometry[i].upperLimit
upper_unit         = geometry[i].uomDimensions
upper_reference    = geometry[i].upperVerticalReference   # AGL | AMSL
```

Casi speciali:

- `lowerLimit` assente + `lowerVerticalReference=AGL` → **SFC/GND** (0 AGL).
- `upperLimit` assente/very-large → **unlimited**.
- Conversione FT↔M per display (1 ft = 0.3048 m esatto).
- ED-318 `layer` parallelo: `upper/lower/upperReference/lowerReference/uom`.

---

## 7. Temporale

- `applicability[]` array di TimePeriod; ogni entry ha `permanent`, `startDateTime`, `endDateTime`, `schedule[]`.
- `schedule[].day[]` MON…SUN o `ANY`; `startTime/endTime` ISO-8601 time (UTC).
- `permanent=YES` → zona sempre attiva (date opzionali ignorate).
- `permanent=NO` + `startDateTime/endDateTime` → intervallo esplicito; `schedule` opzionale per sotto-intervalli giornalieri.
- Timezone: UTC (Z) ovunque negli esempi pubblici.

**Stati temporali futuri per l'overlay** (logica non implementata):

| Stato | Quando |
| --- | --- |
| `ACTIVE_NOW` | now ∈ [start,end] e schedule match |
| `FUTURE` | start > now |
| `EXPIRED` | end < now |
| `ALWAYS_ACTIVE` | `permanent=YES` |
| `UNKNOWN` | date mancanti/malformate |

---

## 8. Strategia pipeline raccomandata

### 8.1 Path helper autorizzato (post AUTH-CAPTURE) — **NON implementato**

Decisione tecnica **autorizzata** dopo `DFLIGHT-AUTH-CAPTURE-A` (PATH = **H2 AUTHENTICATED**):

```text
GOI GIS → helper VPS GOI → autenticazione D-Flight → WFS D-Flight autenticato
```

- H0 PUBLIC-WFS CACHE: **ESCLUSO** (anonymous replay HTTP 401 su `/maps/*`).
- Credenziali **solo** server-side (preferenza `systemd LoadCredential`); **mai** in monolite / browser / repo / docs / log.
- Dataset operativo primario MVP overlay: **WFS GeoServer** (FeatureCollection), non equivalenza dimostrata al Download ED-269.
- Import manuale ED-269 resta **utile** per parity EUROCAE futura; **non** blocca il percorso helper H2.

Dettaglio architettura H2: §22.

### 8.2 Path import file (discovery iniziale — ancora valido come fallback/MVP client)

Confronto storico discovery:

1. JSON ED-269 importato direttamente dal browser → complessità bassa, offline ok.
2–3. Conversioni offline → opzionali.
4. Fetch manuale esplicita → come #1 con UX import.
5–6. Web map scraping → scartati.

**MVP client futuro** può combinare: dataset da helper H2 (preferito) **e/o** import file ED-269. Nessuna fetch D-Flight dal browser; nessuna credenziale client.

---

## 9. Modello dati GOI GIS (concettuale — NON implementato)

Dataset autonomo `dflightZones[]` (cap 5000 di default, **transiente session-only per MVP**).

| Campo | Tipo | Categoria |
| --- | --- | --- |
| `provider_id` | `"dflight"` | CORE |
| `zone_id` | string (identifier + country) | CORE |
| `name` | string (lingua preferita) | CORE |
| `zone_type` | enum `COMMON`/`CUSTOMIZED` | CORE |
| `restriction` | enum `PROHIBITED`/`REQ_AUTHORISATION`/`CONDITIONAL`/`NO_RESTRICTION` | CORE |
| `reasons` | string[] | OPTIONAL |
| `volumes[]` | array (vedi sotto) | CORE |
| `bbox` | [w,s,e,n] | DERIVED |
| `applicability[]` | normalized TimePeriod[] | OPTIONAL |
| `permanent` | bool | CORE |
| `temporal_state` | enum ACTIVE/FUTURE/EXPIRED/ALWAYS/UNKNOWN | DERIVED |
| `zone_authority[]` | normalized authority[] | OPTIONAL |
| `message` | string | OPTIONAL |
| `source_updated_at` | ISO-8601 (da metadata del file se presente) | OPTIONAL |
| `source_url` | string (note provenienza, mai automatic fetch) | OPTIONAL |
| `source_checksum` | SHA-256 del file importato | CORE |
| `raw_properties` | object | RAW-ONLY |

`volumes[i]`: `{ horizontal_type: Polygon|Circle, geometry: GeoJSON-like, lower: {value,unit,reference}, upper: {value,unit,reference} }`.

---

## 10. Regioni del monolite da usare (design futuro, NON implementato)

Identificate in fase di discovery (riferimenti di linea indicativi; validare all'apertura del blocco runtime):

- Layer menu `tlayerSection` + sezione "Cataloghi" già esistente con item IGM (`data-role="open-carto-igm"`) — punto di integrazione naturale per toggle "Zone D-Flight".
- Helper coordinate: `tileMapLatLonToPx`, `tileMapPxToLatLon`, `gisMapTileMathViewport`.
- Template overlay SVG: `drawCartoIgmOverlay`, `cartoGeomToSvgPathD` (gestisce già Polygon + MultiPolygon + chiusura anelli + translate tile-layer). **Riuso diretto** per `drawDflightOverlay(tileMap)`.
- Lifecycle: `renderTileMap`, `refreshTileMapForTrackUi` — hook di re-render post pan/zoom.
- Export JPG overlay list — aggiungere `.dflight-zone-overlay svg` se export incluso.
- State fields: `forceOffline`, `opsecStrict`; gate non necessario per render puro (no network), ma import va gestito OPSEC-aware.
- i18n: dizionari IT/EN/FR con pattern `data-i18n`. **L10N freeze** (rule 32): nuove stringhe **solo IT** per MVP.

### 10.1 Tecnologia overlay raccomandata: **SVG**

Allineato al pattern esistente (`drawCartoIgmOverlay` + `cartoGeomToSvgPathD`); Canvas richiederebbe un'architettura nuova non coerente con il monolite. Hit-testing/tooltip nativi DOM; viewport culling + bbox prefilter per scalare a migliaia di zone.

---

## 11. Rendering design (futuro, NON implementato)

- Conversione coordinate → pixel: `tileMapLatLonToPx(root, lat, lon)` riuso.
- Viewport culling: prefilter per `bbox` vs viewport corrente.
- Polygon/MultiPolygon/GeometryCollection: helper riuso/riadattato da `cartoGeomToSvgPathD` (anelli, holes impliciti via `fill-rule="evenodd"`).
- Circle: approssimazione a poligono 32-64 vertici (Vincenty come `polygonGeodesicMidpointLonLat`).
- Stile: fill opacity 0.15-0.25 + stroke 1.5-2px; palette per `restriction` (PROHIBITED=rosso, REQ_AUTHORISATION=arancio, CONDITIONAL=giallo, NO_RESTRICTION=verde); z-index sotto vettori GIS; pointer-events auto su path/label.
- Label: identifier (max 18 char).
- Hover/click/tooltip: pattern `data-record-id`; pannello laterale riusabile da `cartoIgmPanel` con dettagli (nome, restriction, reasons, quota, validità, authority).
- Legenda minima basata su `restriction` effettivamente presenti nel dataset (4 valori enum); non inventare categorie.

---

## 12. UI/UX MVP

- Posizionamento: **Layers → sezione "Cataloghi"** (la stessa di IGM) → toggle **"Zone D-Flight (UAS)"**.
- Stato: `state.showDflightZones` (transiente session-only per MVP) + `state._dflightDataset` (raw parsed, transiente).
- **MVP** (D-FLIGHT-A → D-FLIGHT-E bundle):
  1. Import file JSON (drag-drop su Layers o file picker).
  2. Toggle on/off.
  3. Legenda categorie `restriction`.
  4. Click zona → pannello dettaglio.
  5. Indicator dataset (source_updated_at + checksum + count).
  6. i18n IT only (rule 32).
- **LATER** (D-FLIGHT-F + follow-up):
  1. Opacità slider.
  2. Filtro categorie `restriction`/`reason`.
  3. Filtro stato temporale (ACTIVE_NOW/FUTURE/EXPIRED/ALWAYS/UNKNOWN).
  4. Persistenza IndexedDB opt-in.
  5. Export GPX/GeoJSON zone selezionate.
  6. Cerca per identifier/nome.
- **Vincoli**: nessuna modifica a Workbench/Oggetti GIS (FROZEN); nessun nuovo storage persistent senza decisione esplicita.

---

## 13. Offline / update design

- **MVP storage = SESSION-ONLY** (no localStorage, no IndexedDB). Caricamento tramite import file; perso al refresh.
- **Import flow**: drag-drop o picker → parse JSON → validate schema (V1/V2/V3 detect) → normalize → set `state._dflightDataset` + `state.showDflightZones=true` → render.
- **Versione dataset visibile**: `source_updated_at` (da metadata se presente, altrimenti `UNKNOWN`) + SHA-256 file + count.
- **Rollback**: re-import di file precedente (dataset in memoria sostituito; nessuno storico versionato in MVP).
- **Malformed JSON**: parse error → notifica in-pannello + mantenimento dataset precedente se presente.
- **Empty dataset**: clear overlay + notifica "no zones".
- **Large dataset**: cap 5000 zone importate (fail-closed oltre); viewport culling al render.
- **Network unavailable**: irrilevante per MVP (no fetch); versione future con download esplicito richiede OPSEC consent.
- **Nessun fetch automatico al boot**.

---

## 14. Performance (stima architetturale — dataset reale IT NON disponibile)

- Byte JSON: Francia pubblica ~1-5 MB; Italia atteso stesso range.
- Zone count: ~1000-3000 (inclusi NOTAM dinamici).
- Vertici: tipici Polygon ED-269 ~5-50 vertici; 100+ per circonvallazioni/scale operazionali.
- Costi browser (stima da confermare con campione reale): parse JSON <500 ms / 5 MB; normalizzazione <200 ms / 3000 zone; render SVG ~50-200 ms / 500 zone visibili.
- **Verdetti attesi**:
  - **FULL RENDER OK** fino a ~500 zone visibili in-view.
  - **VIEWPORT CULLING REQUIRED** sopra 500.
  - **CANVAS** non richiesto (SVG + culling sufficiente).
  - **SIMPLIFICATION** opzionale LATER (Douglas-Peucker); non MVP.

---

## 15. Piano blocchi (aggiornato post H2 reconcile)

| Blocco | Scope | Stato / note | Categoria |
| --- | --- | --- | --- |
| **DFLIGHT-REAL-DATA-VALIDATE-A** | Inventario VPS + probing pubblico + auth flow da bundle | **PARTIAL — OPERATOR AUTH CAPTURE REQUIRED** (superato da AUTH-CAPTURE) | DIAGNOSTIC |
| **DFLIGHT-AUTH-CAPTURE-A** | Sessione autenticata; WFS/WMS inventory; fingerprint; path helper | **COMPLETE — PATH H2 AUTHENTICATED** | DIAGNOSTIC |
| **DOCS-DFLIGHT-H2-RECONCILE-A** | Allineamento docs vivi a evidenze H2 | **CLOSED / PASS DOCS-ONLY** | DOCS |
| **DFLIGHT-HELPER-H2-A** (+ FIX1) | Servizio helper VPS autenticato (WFS→cache→API); **no monolite** | **CLOSED / PASS end-to-end** (repo `bc80604`; VPS live; QA PASS) | **DELICATO** |
| **D-FLIGHT-A** | parser/adapter client | **CLOSED / PASS end-to-end** — tip `d52367b` / build 158 | ROUTINE |
| **D-FLIGHT-B** | normalized model | **CLOSED / PASS end-to-end** — tip `4fc7ee3` / build 159 | ROUTINE |
| **D-FLIGHT-CDE** | overlay SVG + toggle/legend + details | **CLOSED / PASS end-to-end** — tip `a37b912` / build 160 | ROUTINE |
| **D-FLIGHT-F** | client helper integration / persistence / OPSEC | candidato; non auto-aperto; decomporre se necessario | DELICATO |

**NEXT univoco:** **`D-FLIGHT-F`** (helper client / rete / OPSEC / cache — **non** auto-aperto; richiede prompt esplicito). Helper H2 **CLOSED**. `D-FLIGHT-A`+`B`+`CDE` **CLOSED**.

**Automated Browser QA (`AUTOMATED-BROWSER-QA-PREOP`):** obbligatoria sui blocchi D-Flight con superficie browser (`D-FLIGHT-A`+). Per `DFLIGHT-HELPER-H2-A`: **NOT APPLICABLE** (backend-only) — attestato in deploy. CDE = PASS.

**Helper VPS:** implementato + deployato. **Client GIS overlay/UI:** CLOSED (CDE).

---

## 16. UNKNOWN principali (checklist — da chiudere in DFLIGHT-REAL-DATA-VALIDATE-A)

- SHA-256 / byte / dataset reale IT (login required) → Fase B/N discovery non chiuse con prova.
- Schema esatto del file IT (V1 array / V2 header / V3 FeatureCollection ED-318).
- Versione ED-269Change1 vs ED-318 dichiarata nel file IT.
- Presenza effettiva di `Circle` e `GeometryCollection` multi-layer nel dataset IT.
- Frequenza aggiornamento dichiarata (manuale non specifica).
- Distribuzione vertici per zona (max/avg) — non stimabile senza campione.
- Mappatura `reason`/`restrictionConditions` effettivamente usate in IT.
- Comportamento dataset NOTAM dinamici (vita breve; update frequente).
- Possibile presenza di zone estere al confine (San Marino, Vaticano) nel file IT.
- ToS D-Flight su conservazione offline del JSON (utenza BASE/PRO ha diritto di scaricare; redistribuzione pubblica del dataset derivato = **UNKNOWN/RICHIEDE AUTORIZZAZIONE** → fail-closed).

---

## 17. OPSEC e rete (vincoli futuri)

- Nessuna richiesta automatica al boot.
- Aggiornamento dataset **solo** azione esplicita (import file o, in futuro, download esplicito OPSEC-gated).
- `state.forceOffline` blocca ogni download (in futuro).
- OPSEC strict blocca fonti internet / endpoint sensibili.
- Dataset già importato interrogabile offline.
- Data fonte e stato aggiornamento sempre visibili.
- **Nessun** invio di area/coordinate a servizi esterni (ricerca locale).
- Nessun logging remoto delle aree ricercate.
- **Nessun login automatico, nessuna acquisizione credenziali, nessun bypass auth.**

---

## 18. Collocazione WU — motivazione separazione da WU-0012

**Raccomandazione applicata**: **WU-0013 separata**.

Motivazione tecnica:

1. D-Flight è semanticamente un **layer operativo di spazio aereo UAS**, non una **carta cartografica** (IGM/IIM/CIGA/UKHO sono indici di carte statiche a scala definita; D-Flight è un dataset vettoriale dinamico con logica temporale e verticale).
2. Condivide con WU-0012 solo il **pattern architetturale overlay** (SVG, layer menu, helper coordinate, sanitizer), non il modello dati.
3. Riutilizzare `cartoArchiveRecords` o `state.cartoArchive*` per D-Flight creerebbe accoppiamento improprio (concetti misti: chart_id/scale vs zone_id/restriction).
4. Schema dati, provider relationship (login/API M2M), workflow di update e tematismo (verticale/temporale) sono tutti **diversi** da WU-0012.
5. Una WU dedicata mantiene tracciabilità pulita e non inquina la storia WU-0012.

WU-0012 resta **OPEN / NEXT PROVIDER** (IIM/CIGA/UKHO / online update) con solo un riferimento incrociato a WU-0013 (nessuna duplicazione).

---

## 19. Decisioni DOCS-DFLIGHT-WU-0013-OPEN-A (storico apertura)

1. WU-0013 **APERTA** / `OPEN / DISCOVERY COMPLETE / NO RUNTIME` (all’apertura).
2. NEXT iniziale: **`DFLIGHT-REAL-DATA-VALIDATE-A`**.
3. D-Flight = layer operativo UAS separato da WU-0012.
4. Modello dati concettuale autonomo `dflightZones[]`.
5. Strategia iniziale: import manuale JSON + parser V1/V2/V3 + SVG (integrata/superseduta per path helper da §8.1 / §22).
6–10. Overlay SVG; L10N IT; SESSION-ONLY MVP; piano A→F; monolite invariato.

## 19bis. Decisioni DOCS-DFLIGHT-H2-RECONCILE-A (2026-08-11)

1. `DFLIGHT-REAL-DATA-VALIDATE-A` registrato come **PARTIAL — OPERATOR AUTH CAPTURE REQUIRED** (intermedio superato).
2. `DFLIGHT-AUTH-CAPTURE-A` = **DIAGNOSTIC COMPLETE — PATH H2 AUTHENTICATED**.
3. Stato WU vivo: **`OPEN / DISCOVERY COMPLETE / H2 AUTHENTICATED PROVEN / NO GIS RUNTIME — NEXT DFLIGHT-HELPER-H2-A`**.
4. **Nessun** helper implementato; **nessun** runtime GIS D-Flight.
5. Architettura H2 autorizzata (non implementata) — §22.
6. Fingerprint: **CANONICAL-FEATURE-HASH** su `properties.id` (raw SHA instabile).
7. WFS sufficiente per MVP overlay (YES/PARTIAL); equivalenza ED-269 **non** dimostrata.
8. NEXT univoco: **`DFLIGHT-HELPER-H2-A`** (**DELICATO**).
9. Sample/secret: **fuori repo**; mai nei docs.
10. Workbench / Oggetti GIS **FROZEN**; runtime live **`ac3a0ea` / build 157** invariato.

---

## 20. Controlli apertura (self-check)

- [x] Repo root, branch `main`, workspace pulito verificati in pre-flight
- [x] HEAD = origin/main = `git ls-remote` = `fc2d1a4` prima della scrittura (apertura)
- [x] Monolite `coordinate_converter Claude.html` non toccato
- [x] Nessun bump build, nessun deploy, nessuna modifica runtime
- [x] Workbench / Oggetti GIS FROZEN
- [x] Nessuna fetch automatica / login / credenziali nei docs
- [x] WU-0012 non duplicata (solo riferimento incrociato)
- [x] L10N freeze rispettato (solo IT per future stringhe)
- [x] NEXT iniziale `DFLIGHT-REAL-DATA-VALIDATE-A` registrato (poi superseduto da H2 reconcile → `DFLIGHT-HELPER-H2-A`)
- [x] Discovery `CARTO-DFLIGHT-DISCOVERY-A` richiamata come base

---

## 21. Prossimo passo consigliato

**`D-FLIGHT-F`** (DELICATE — helper client / rete / OPSEC / cache; **non** auto-aperto):

- Acquisizione dataset da helper H2 (`/dataset` / refresh) e feed a `GOIDflight.renderOverlay`.
- Nessuna ridefinizione di CDE; F fornisce il canale dati.
- Alternativi (decisione operatore): provider WU-0012; **MODAL-OPEN-TOP-ALIGN-A**.

### 21quinquies. Chiusura `D-FLIGHT-CDE` — 2026-08-12

- Runtime tip: `a37b91265a927a8ddfa8325437f34867b9de0570` · build **160** · `APP_BUILD_ID = D-FLIGHT-CDE`.
- Bundle ROUTINE C+D+E: SVG overlay + Cataloghi toggle/legend + details non-modale; API `renderOverlay`/`setOverlayVisible`/`selectZone`/`detailsState`.
- Automated Browser QA **PASS**; QA operatore **`QA D-FLIGHT-CDE PASS operatore`** → auto-`finito` Regola H.
- Zero rete helper/OPSEC/persistenza dataset; Workbench FROZEN; F resta separato.

### 21quater. Chiusura `D-FLIGHT-B` — 2026-08-12

- Runtime tip: `4fc7ee3898bb69d465efb2ec81caa6b3b9046144` · build **159** · `APP_BUILD_ID = D-FLIGHT-B`.
- Pure normalize: clustering B1+B2, zone_id, vertical/temporal, Circle→Polygon 64, `GOIDflight.normalize`.
- Automated Browser QA **PASS**; QA operatore **`QA D-FLIGHT-B PASS operatore`** → auto-`finito` Regola H.
- Finding wheel latency: **PREEXISTING/EXPECTED** (idle 140 ms) — non regressione B.
- Zero state/storage/rete/UI overlay; Workbench FROZEN; helper VPS non toccato.

### 21ter. Chiusura `D-FLIGHT-A` — 2026-08-12

- Runtime tip: `d52367b6f2b714f02384e9dc0dc8c4131447e5ea` · build **158** · `APP_BUILD_ID = D-FLIGHT-A`.
- A3-light: detect + validate + adapter WFS H2 + adapter ED-269/318 + intermediate form; `window.GOIDflight`.
- Automated Browser QA **PASS**; QA operatore **`QA D-FLIGHT-A PASS operatore`** → auto-`finito` Regola H.
- Zero rete/storage/state D-Flight; Workbench FROZEN; helper VPS non toccato.

### 21bis. Chiusura `DFLIGHT-HELPER-H2-A` (+ FIX1) — 2026-08-11

- Repo: `feat(dflight)` `f32f7c1` → FIX1 `bc806049c887417eea195da11b00b9c588bc05ea`.
- VPS: `/opt/goi-dflight-helper/current`, user `goi-dflight`, LoadCredential, bind `100.114.7.53:8010`.
- Live: `READY_CHANGED`; features **849**; bytes **7360227**; sha `88d564a65152a795fb2ea2cff8d11dc7b5fd013992cfdc7160b722a37f0d67f7`.
- Cooldown 429; restart persistence; secret scan PASS; altri servizi GIS invariati.
- Automated Browser QA: **NOT APPLICABLE** (backend-only).
- QA operatore: **`QA DFLIGHT-HELPER-H2-A-FIX1 PASS operatore`** → auto-`finito` Regola H.
- Finding minore: CLI `--rollback` stampa category `rollback` (non il testo `previous missing`); fail-closed verificato.

---

## 22. Evidenze AUTH-CAPTURE + architettura H2 (sintesi — NO secrets)

### 22.1 Auth / endpoint (presence only)

| Voce | Evidenza |
| --- | --- |
| Mappe operative | `https://www.d-flight.it/maps/wms` (anche WFS via stesso path GeoServer) |
| Auth token | `https://www.d-flight.it/auth-iam/token` (valori **non** nei docs) |
| Downstream | `Authorization: Bearer` richiesto; cookie soli → **401** |
| Anonymous replay | tutti i probe `/maps/wms|wfs|ows` → **HTTP 401** |
| H0 PUBLIC-WFS | **ESCLUSO** |
| Path helper | **H2 AUTHENTICATED** (provato) |

### 22.2 WFS / WMS inventory (auth)

- **36** FeatureType WFS `D-FLIGHT:*` (GetCapabilities auth PASS; `updateSequence` osservato).
- **52** layer WMS `D-FLIGHT:*` (GetCapabilities auth PASS).
- DescribeFeatureType auth PASS (`NO_FLY_ZONE`, `NOTAM`).
- **NOTAM:** WMS raster **e** WFS vector (18 feature nel campione).
- **ATM09:** anche GWC/TMS raster (`…/gwc/service/tms/1.0.0/D-FLIGHT:ATM09@…@png/{z}/{x}/{y}.png`).

### 22.3 `NO_FLY_ZONE` (campione WFS reale — fuori repo)

| Metrica | Valore |
| --- | --- |
| Tipo | GeoServer `FeatureCollection` |
| Count | **850** feature |
| Geometrie | tutte **Polygon**; 0 empty/invalid nel campione |
| CRS | `EPSG:32633` e `EPSG:4326` (4326 = candidato GOI) |
| Sample 4326 | **7 362 971** byte (fuori repo) |
| Vertici | ~**149 479** tot; media ~176; mediana **33**; max **1513** |

Properties principali: `id`, `name`, `quota_max`, `rule`, `status`, `regola`, `type`, `subtype`, `lower_limit_m`, `upper_limit_m`, `valid_from`, `valid_to`, `priority`, `description`, `descrizione`, `owner`, `note`.

**Nota:** `feature.id` (fid GeoServer) **instabile**; chiave stabile = **`properties.id`**.

### 22.4 Update detection

| Detector | Esito |
| --- | --- |
| Raw body SHA-256 | **UNSTABLE** (`timeStamp` top-level + fid volatili) |
| ETag / Last-Modified | **assenti** |
| GetCapabilities `updateSequence` | presente; **non** sufficiente da solo come prova dataset applicativo |
| Canonical fingerprint su `properties.id` (+ geometry/properties) | **STABLE** |
| Strategia helper | **CANONICAL-FEATURE-HASH** |

Separare: **raw transport hash ≠ semantic/canonical dataset fingerprint**.

### 22.5 WFS vs ED-269

- WFS webapp = modello operativo GeoServer **reale e verificato**.
- Download UAS Geozone ED-269 = formato **distinto**; equivalenza completa **NON** dimostrata.
- MVP overlay: WFS **tecnicamente sufficiente** (geometria + quota + temporalità + regole osservate) → **YES/PARTIAL**.
- Parity ED-269 = futura; **non** blocca `DFLIGHT-HELPER-H2-A`.

### 22.6 Architettura H2 (autorizzata — NON implementata)

```text
GOI GIS → helper VPS GOI → auth D-Flight → WFS autenticato
```

Helper target:

- Python **3.12** stdlib se sufficiente; servizio **separato**;
- credenziali **solo** server-side; preferenza **`systemd LoadCredential`**;
- **nessuna** credenziale in monolite/browser/repo/docs/log;
- WFS preferibilmente **EPSG:4326**;
- cache **last-known-good**; **atomic replacement**; previous dataset per rollback;
- change detection: **CANONICAL-FEATURE-HASH**;
- status metadata; failure **non distruttivo** (no update current se download/parse/validation fallisce).

Infra già osservata (VALIDATE): Ubuntu **24.04**, systemd **255**, Python **3.12**; porta candidata tailnet-only **`:8010`** (non vincolo definitivo).

API candidata (**non** contratto definitivo — validare in H2-A): `GET /status`, `GET /dataset`, `POST /refresh`.

### 22.7 Requisiti client futuro (quando si integra il helper)

- Nessuna rete D-Flight al boot; nessuna credenziale D-Flight nel browser.
- `forceOffline` e `opsecStrict` bloccano ogni call helper.
- Check solo durante uso/attivazione D-Flight; cooldown indicativo **30–60 min**.
- Dataset nuovo → indicazione non invasiva; applicazione **esplicita**.
- Helper irraggiungibile → nessuna regressione GIS; LKG utilizzabile.