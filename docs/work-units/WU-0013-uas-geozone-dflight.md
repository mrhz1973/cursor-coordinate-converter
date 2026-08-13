<!-- AUTO-VIA-HEADER: NON RIMUOVERE -->
> **REGOLA OPERATIVA VINCOLANTE — AUTO-VIA.** Se il prossimo passo non richiede una decisione reale dell’operatore — scelta di prodotto, scope ambiguo, rischio non autorizzato o conflitto non risolvibile — l’assistente deve considerare il `vai` già concesso e procedere autonomamente. È vietato chiedere conferme, autorizzazioni o un nuovo `vai` per attività già approvate, programmi già autorizzati o passaggi tecnicamente determinati. Un programma esplicitamente autorizzato resta autorizzato per i blocchi successivi finché non emerge una scelta reale o un gate fallito. Fermarsi soltanto davanti a una decisione effettiva che può cambiare il risultato.
<!-- /AUTO-VIA-HEADER -->

# WU-0013 — UAS-GEOZONE-DFLIGHT — Zone Geografiche UAS italiane (D-Flight ED-269/ED-318)

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** CLOSED / PASS end-to-end (scope H2+overlay completato)
**ACTIVE BLOCK:** —
**CURRENT GATE:** —
**RUNTIME LIVE:** monolite `52927c565d5301870a82d688c899024d8d499aee` · build **179** · `APP_BUILD_ID=D-FLIGHT-PERF-VISUAL-READY-A-FIX2` · helper **0.1.3**
**NEXT:** nessuno — WU chiusa; residui in backlog; riapertura/nuovo blocco solo con decisione di prodotto
<!-- /WU-HOT-HEADER -->

**Stato:** **CLOSED / PASS end-to-end** (scope H2+overlay completato) — chiusura formale `DOCS-DFLIGHT-WU0013-CLOSE-A` (2026-08-14)
**Data chiusura:** 2026-08-14
**Scope completato:** helper H2 + parser/normalize + overlay SVG/details + ATM09 + refresh/apply/reeval + autoload UX + VISUAL READY
**Runtime live:** monolite `52927c565d5301870a82d688c899024d8d499aee` · build **179** · `APP_BUILD_ID=D-FLIGHT-PERF-VISUAL-READY-A-FIX2`
**Helper VPS:** **0.1.3 LIVE** (`:8010` · `NO_FLY_ZONE` + `/atm09/*`)
**REVIEW BASE (storico, non gate corrente):** `12fcba580391e456cd1d9984f340355707a7ecc2` (FIX1 / build 178)
**Blocco discovery:** `CARTO-DFLIGHT-DISCOVERY-A` — **DIAGNOSTIC COMPLETE — TECHNICAL PLAN READY** (2026-08-11, read-only)
**Blocco apertura WU:** `DOCS-DFLIGHT-WU-0013-OPEN-A` — **CLOSED / PASS DOCS-ONLY** (2026-08-11)
**Blocco validate:** `DFLIGHT-REAL-DATA-VALIDATE-A` — **PARTIAL — OPERATOR AUTH CAPTURE REQUIRED** (2026-08-11, diagnostic; gate intermedio **superato** da AUTH-CAPTURE)
**Blocco auth capture:** `DFLIGHT-AUTH-CAPTURE-A` — **DIAGNOSTIC COMPLETE — PUBLIC/HYBRID/AUTH HELPER PATH PROVEN** · **PATH = H2 AUTHENTICATED** (2026-08-11, diagnostic read-only; sample fuori repo)
**Blocco riconciliazione:** `DOCS-DFLIGHT-H2-RECONCILE-A` — **CLOSED / PASS DOCS-ONLY** (2026-08-11)
**Blocco helper:** `DFLIGHT-HELPER-H2-A` (+ `FIX1`) — **CLOSED / PASS end-to-end** (2026-08-11) — repo `bc80604` · VPS deploy TECHNICAL PASS · Automated Browser QA **N/A** · QA operatore **PASS**
**Blocco client parser:** `D-FLIGHT-A` — **CLOSED / PASS end-to-end** (2026-08-12) — tip `d52367b` · build **158** · A3-light · `window.GOIDflight` · Automated Browser QA **PASS** · QA operatore **PASS**
**Blocco normalized model:** `D-FLIGHT-B` — **CLOSED / PASS end-to-end** (2026-08-12) — tip `4fc7ee3` · build **159** · `GOIDflight.normalize` · Automated Browser QA **PASS** · QA operatore **PASS**
**Blocco overlay+UI:** `D-FLIGHT-CDE` — **CLOSED / PASS end-to-end** (2026-08-12) — tip `a37b912` · build **160** · SVG+toggle/legend+details · Automated Browser QA **PASS** · QA operatore **PASS**
**Blocco rete client / ATM09:** `D-FLIGHT-F` → serie **ATM09-ARCH-A** (+FIX1/FIX2) + **`D-FLIGHT-F-ATM09-HELPER-DEPLOY-A`** — **CLOSED / PASS end-to-end** (2026-08-13) — monolite tip `887d321` · build **170** · helper prod **0.1.3** · Automated Browser QA **PASS** · QA operatore **PASS** (`QA D-FLIGHT-F-ATM09-HELPER-DEPLOY-A PASS operatore`). FAIL operatore iniziale (helper 0.1.2 senza `/atm09`) **superseduto** dal deploy helper.
**Blocco UI overlay polish:** `D-FLIGHT-G-UI-OVERLAY-A` (+ FIX1 FAIL → **FIX2 PASS**) — **CLOSED / PASS end-to-end** (2026-08-13) — tip `42edb6f` · build **167** · pan-sync SVG + stile WFS + wheel isolation + Layer menu safeTop · Automated Browser QA **PASS** · QA operatore **PASS** (`QA D-FLIGHT-G-UI-OVERLAY-A-FIX2 PASS operatore`)
**Blocco autoload UX:** `D-FLIGHT-H-AUTOLOAD-UX-A` (+ FIX1–FIX4 → **FIX5 PASS**) — **CLOSED / PASS end-to-end** (2026-08-13) — tip monolite `fb773c9` · build **176** · panel-open autoload `/dataset` · refresh 30 min · legenda ATM09/native · selftest isolation FIX5 · Automated Browser QA **PASS** · QA operatore **PASS** (`QA D-FLIGHT-H-AUTOLOAD-UX-A-FIX5 PASS operatore`). Helper **invariato** 0.1.3.
**Blocco VISUAL READY / panel lifecycle:** `D-FLIGHT-PERF-VISUAL-READY-A` (+ **FIX1** → **FIX2 PASS**) — **CLOSED / PASS end-to-end** (2026-08-13). **FIX1** `12fcba5` / build **178**: review PASS · deploy PASS · Automated Browser QA PASS · QA operatore **FAIL** lifecycle (close/minimize). **FIX2** `52927c5` / build **179**: review GPT sostitutiva **PASS** · deploy GIS-only **PASS** · Automated Browser QA **PASS** · QA operatore **PASS** (`QA D-FLIGHT-PERF-VISUAL-READY-A-FIX2 PASS operatore`) · `APP_BUILD_ID=D-FLIGHT-PERF-VISUAL-READY-A-FIX2` · helper **0.1.3** invariato. First draft `58ade6c` = **SUPERSEDED**.
**Tipo:** macro-feature separata — layer operativo UAS / spazio aereo (non carta cartografica statica)
**Data apertura:** 2026-08-11
**Runtime live (GIS tip):** `52927c565d5301870a82d688c899024d8d499aee` · `APP_BUILD_ID = "D-FLIGHT-PERF-VISUAL-READY-A-FIX2"` · `APP_BUILD_NUM = 179`
**Candidate:** *(omesso — coincidente con RUNTIME LIVE)*
**Monolite in WU-0013:** **modificato** in A+B+CDE+G+F-ATM09+H+VISUAL-READY (parser + normalize + overlay/UI + ATM09 + autoload UX + visual ready/lifecycle). Helper VPS **0.1.3** (ATM09 routes) live.
**Helper VPS:** **LIVE 0.1.3** — `/opt/goi-dflight-helper/current/` · `:8010` · `NO_FLY_ZONE` + **`/atm09/*`**. **Client GIS:** overlay/UI **CLOSED** (CDE+G); rete/ATM09 **CLOSED** (HELPER-DEPLOY PASS); autoload UX **CLOSED** (H-FIX5 PASS); VISUAL-READY **CLOSED** (FIX2 PASS).

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

**Stati temporali overlay** — **IMPLEMENTED** (`dflightEvalTemporalState`; filtro UI = backlog):

| Stato | Quando |
| --- | --- |
| `ACTIVE_NOW` | now ∈ [start,end] e schedule match |
| `FUTURE` | start > now |
| `EXPIRED` | end < now |
| `ALWAYS_ACTIVE` | `permanent=YES` / permanente |
| `UNKNOWN` | date mancanti/malformate |

---

## 8. Strategia pipeline raccomandata

### 8.1 Path helper autorizzato (post AUTH-CAPTURE) — **LIVE** (helper 0.1.3)

Decisione tecnica **autorizzata** dopo `DFLIGHT-AUTH-CAPTURE-A` (PATH = **H2 AUTHENTICATED**) e **implementata** (`DFLIGHT-HELPER-H2-A` + client F/H):

```text
GOI GIS → helper VPS GOI → autenticazione D-Flight → WFS D-Flight autenticato
```

- H0 PUBLIC-WFS CACHE: **ESCLUSO** (anonymous replay HTTP 401 su `/maps/*`).
- Credenziali **solo** server-side (preferenza `systemd LoadCredential`); **mai** in monolite / browser / repo / docs / log.
- Dataset operativo primario overlay: **WFS GeoServer** via helper (`NO_FLY_ZONE`); equivalenza completa al Download ED-269 **non** dimostrata (UNKNOWN non bloccante — vedi backlog).
- Parser ED-269/ED-318 client **esiste** (`GOIDflight.parse`); UI import file **non** esiste (backlog opzionale). **Non** blocca il path H2 chiuso.

Dettaglio architettura H2: §22 (storico design + stato LIVE in §22.6).

### 8.2 Path import file (discovery iniziale — HISTORY / fallback non primario)

Confronto storico discovery (2026-08-11):

1. JSON ED-269 importato direttamente dal browser → complessità bassa, offline ok.
2–3. Conversioni offline → opzionali.
4. Fetch manuale esplicita → come #1 con UX import.
5–6. Web map scraping → scartati.

**Current-state:** path primario = helper H2. Import file UI D-Flight = **BACKLOG / NOT OPENED**. Parser API senza UI = disponibile. Nessuna fetch D-Flight dal browser; nessuna credenziale client.

---

## 9. Modello dati GOI GIS — **IMPLEMENTED** (normalize live)

**Current-state (post D-FLIGHT-B + H):** modello normalizzato live via `GOIDflight.normalize` / `dflightNormalize*`; dataset in sessione client (`_dflightClientSession` / overlay session), **session-only** (no persistenza IndexedDB/localStorage del dataset D-Flight). Cap operativo allineato al design (~5000).

Campi core verificati in runtime (non elenco esaustivo di ogni proprietà WFS grezza):

| Campo | Tipo | Stato |
| --- | --- | --- |
| `provider_id` / provenienza | `"dflight"` / helper meta | LIVE |
| `zone_id` | string stabile | LIVE |
| `name` | string | LIVE |
| `volumes[]` | Polygon/MultiPolygon (+ Circle→poly) + vertical bounds | LIVE |
| `bbox` | [w,s,e,n] | LIVE (DERIVED) |
| `applicability[]` / `permanent` | TimePeriod normalizzati | LIVE |
| `temporal_state` | `ALWAYS_ACTIVE` / `ACTIVE_NOW` / `FUTURE` / `EXPIRED` / `UNKNOWN` | LIVE (`dflightEvalTemporalState`) |
| vertical `lower`/`upper` | value + unit + AGL/AMSL | LIVE (`dflightNormalizeVerticalBound`) |
| indicatori source | count + SHA/canonical + fetched times (pannello H) | LIVE |
| `restriction` / `reasons` | presenti dove disponibili; WFS spesso `restriction` null / reasons `[]` | PARTIAL dati sorgente |
| `raw_properties` | object | LIVE (RAW-ONLY) |

Design originario (tabella discovery con enum restriction ED-269 formali, `source_checksum` da file importato, ecc.) resta **HISTORY** rispetto al path H2; non inventare campi non verificati come “sempre popolati”.

---

## 10. Regioni del monolite — **IMPLEMENTED** (overlay path)

**Current-state:** integrazioni live nel monolite (simboli `GOIDflight` / `dflight*` / pannello D-Flight / ATM09). Riferimenti discovery sotto restano utili come mappa concettuale.

- Pannello / Cataloghi D-Flight + toggle overlay; Layer menu.
- Helper coordinate: `tileMapLatLonToPx`, viewport math.
- Overlay SVG: `dflightDrawOverlayDom` (+ pattern affine a carto SVG).
- Lifecycle re-render post pan/zoom; JPG export include `.dflight-zone-overlay`.
- Gate rete: `forceOffline` / `opsecStrict` sul client helper (F/H) — non sul solo render SVG.
- i18n: stringhe D-Flight IT; **L10N freeze** EN/FR.

### 10.1 Tecnologia overlay: **SVG** (scelta confermata)

SVG + viewport bbox culling live. Canvas / Douglas-Peucker = **OPTIONAL LATER** (non requirement — vedi backlog).

---

## 11. Rendering — **IMPLEMENTED** (core overlay)

**Current-state:**

- Conversione lat/lon → pixel via helper mappa esistenti.
- **Viewport bbox culling** live (`dflightViewportBboxLonLat` + `dflightBboxOverlaps` in `dflightDrawOverlayDom`).
- Polygon / MultiPolygon supportati; Circle → poligono (64) in normalize.
- Stile / legenda (euristiche WFS `rule`/`regola`/`status` quando `restriction` assente); details HTML (`dflightBuildDetailsHtml`) con temporal/vertical.
- Click/select zona; pannello dettagli non-modale.

**LATER (non implementati):** filtri UI restriction/reason/temporal; ricerca zona; opacity slider — vedi §23 backlog.

---

## 12. UI/UX — path primario H2 (MVP file-import SUPERSEDED)

- Posizionamento: pannello D-Flight / Layers (Cataloghi) — toggle zone + ATM09 dove previsto.
- Stato runtime: session module vars (`_dflightClientSession`, `_dflightOverlaySession` / visibility) — **non** `state.showDflightZones` persistito.
- **Path primario LIVE (H2):**
  1. Autoload / load da helper `GET /dataset` (panel-open).
  2. Toggle on/off overlay.
  3. Legenda + details click.
  4. Indicatori dataset (count · SHA · tempi fetched/update).
  5. Refresh check + pending + **apply esplicito**; re-eval temporale locale.
  6. i18n IT (rule 32).
- **Parser** ED-269/ED-318: **API disponibile** (`GOIDflight.parse`); **UI file-import D-Flight: assente** (backlog).
- **HISTORY (design MVP file-import):** drag-drop/picker come path primario — **SUPERSEDED BY H2** per lo scope chiuso.
- **LATER / BACKLOG / NOT OPENED:** opacity; filtri restriction/reason/temporal; persistenza IDB opt-in; export vettoriale zone; ricerca id/nome — §23.
- **Vincoli**: Workbench/Oggetti GIS FROZEN; nessuno storage persistent D-Flight senza nuova decisione.

---

## 13. Offline / update — **IMPLEMENTED** (helper path; session-only)

- **Storage = SESSION-ONLY** (no localStorage / IndexedDB per dataset D-Flight). Perso al refresh pagina.
- **Update corrente:** `dflightClientLoadZones` / `dflightClientRefresh` → pending SHA → **apply esplicito** (`dflightBtnApplyUpdate`); auto-check periodico `DFLIGHT_AUTO_REFRESH_MS` (30 min) **senza** auto-apply.
- **Re-eval temporale locale:** `dflightBtnReeval` (no rete).
- **Versione dataset visibile:** count + canonical SHA + fetched/pending times nel pannello H (non “file importato”).
- **Malformed / empty:** fail-closed con retention dataset precedente dove previsto dai selftest F.
- **Viewport culling** al render (performance).
- **Nessun fetch D-Flight diretto dal browser**; nessuna credenziale client.
- **HISTORY:** workflow “import file → SHA file” come update MVP — superseduto dal path helper per lo scope chiuso. UI import file = backlog.

---

## 14. Performance (architetturale — dataset WFS live via helper)

- Dataset IT operativo: WFS `NO_FLY_ZONE` via helper (~849 feature tipiche; byte multi-MB).
- **Viewport culling:** implementato.
- **SVG + culling:** sufficienti per lo scope chiuso.
- **CANVAS / Douglas-Peucker:** **OPTIONAL LATER** — non requirement (backlog).

---

## 15. Piano blocchi (aggiornato post H2 reconcile; WU chiusa 2026-08-14)

| Blocco | Scope | Stato / note | Categoria |
| --- | --- | --- | --- |
| **DFLIGHT-REAL-DATA-VALIDATE-A** | Inventario VPS + probing pubblico + auth flow da bundle | **PARTIAL — OPERATOR AUTH CAPTURE REQUIRED** (superato da AUTH-CAPTURE) | DIAGNOSTIC |
| **DFLIGHT-AUTH-CAPTURE-A** | Sessione autenticata; WFS/WMS inventory; fingerprint; path helper | **COMPLETE — PATH H2 AUTHENTICATED** | DIAGNOSTIC |
| **DOCS-DFLIGHT-H2-RECONCILE-A** | Allineamento docs vivi a evidenze H2 | **CLOSED / PASS DOCS-ONLY** | DOCS |
| **DFLIGHT-HELPER-H2-A** (+ FIX1) | Servizio helper VPS autenticato (WFS→cache→API); **no monolite** | **CLOSED / PASS end-to-end** (repo `bc80604`; VPS live; QA PASS) | **DELICATO** |
| **D-FLIGHT-A** | parser/adapter client | **CLOSED / PASS end-to-end** — tip `d52367b` / build 158 | ROUTINE |
| **D-FLIGHT-B** | normalized model | **CLOSED / PASS end-to-end** — tip `4fc7ee3` / build 159 | ROUTINE |
| **D-FLIGHT-CDE** | overlay SVG + toggle/legend + details | **CLOSED / PASS end-to-end** — tip `a37b912` / build 160 | ROUTINE |
| **D-FLIGHT-F** (+ ATM09-ARCH-A/FIX1/FIX2 + HELPER-DEPLOY-A) | client helper / ATM09 overlay / OPSEC | **CLOSED / PASS** su **HELPER-DEPLOY-A** — monolite `887d321`/170 · helper **0.1.3**; FAIL iniziale (0.1.2) superseduto | DELICATO |
| **D-FLIGHT-G-UI-OVERLAY-A** (+FIX1/FIX2) | pan-sync SVG, stile WFS, pannelli GIS, wheel, Layer menu | **CLOSED / PASS** su **FIX2** — tip `42edb6f` / build 167; G FAIL → FIX1 FAIL → FIX2 PASS | ROUTINE |
| **D-FLIGHT-H-AUTOLOAD-UX-A** (+FIX1–FIX5) | panel-open autoload, refresh 30m, legenda ATM09/native, selftest isolation | **CLOSED / PASS** su **FIX5** — tip `fb773c9` / build 176; H→FIX4 FAIL Caso 5 → FIX5 PASS | DELICATO |
| **D-FLIGHT-PERF-VISUAL-READY-A** (+FIX1/FIX2) | post-apply ATM09 start + true VISUAL READY; FIX1 zoom-aware; FIX2 close/minimize lifecycle | **CLOSED / PASS** su **FIX2** — tip `52927c5` / build **179** LIVE · review GPT sostitutiva PASS · deploy GIS-only PASS · Automated Browser QA PASS · QA operatore PASS; FIX1 QA operatore FAIL lifecycle → FIX2; `58ade6c` SUPERSEDED; helper **0.1.3** invariato | DELICATO |

**NEXT (current-state):** nessuno — WU-0013 **CLOSED / PASS** (2026-08-14). Residui = **BACKLOG / NOT OPENED** (§23). Helper **0.1.3** LIVE. Scope H2+overlay: `A`+`B`+`CDE`+`G`+`F-ATM09`+`H`+`VISUAL-READY` **CLOSED**.

**Automated Browser QA (`AUTOMATED-BROWSER-QA-PREOP`):** obbligatoria sui blocchi D-Flight con superficie browser (`D-FLIGHT-A`+). Per `DFLIGHT-HELPER-H2-A`: **NOT APPLICABLE** (backend-only) — attestato in deploy. CDE/G/ATM09-HELPER-DEPLOY/H-FIX5/VISUAL-READY-FIX1/FIX2 Automated = PASS.

**Helper VPS:** **0.1.3** live (`/atm09/*` + NO_FLY_ZONE). **Client GIS overlay/UI + ATM09 + H autoload UX + VISUAL-READY:** CLOSED.

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

## 17. OPSEC e rete — **IMPLEMENTED** (helper H2 live)

- Nessuna richiesta D-Flight automatica al **boot** GIS; autoload dataset solo all’uso del pannello D-Flight (H), non silenzioso globale.
- Aggiornamento dataset: check refresh (manuale o timer) + **apply esplicito**; nessuna applicazione automatica del dataset nuovo.
- `forceOffline` / `opsecStrict`: bloccano le call al helper secondo gate client F/H esistenti (nessun nuovo comportamento inventato qui).
- Dataset in sessione interrogabile offline dopo load (session-only; perso al refresh).
- Indicatori source/version visibili nel pannello (count / SHA / tempi).
- **Nessuna** credenziale D-Flight nel browser / monolite / repo.
- **Nessun** invio di area/coordinate a D-Flight dal client; ricerca locale se/quando aggiunta resta locale.
- Helper VPS **0.1.3 LIVE** — path H2 non è più “futuro”.
- Persistenza offline opt-in del dataset = **BACKLOG / NOT OPENED** (ToS conservazione = UNKNOWN non bloccante).

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

## 21. Chiusura WU e storico passi (current-state + HISTORY)

**Current-state (2026-08-14):** WU-0013 **CLOSED / PASS end-to-end** (scope H2+overlay). **Nessun** NEXT runtime D-Flight obbligatorio. Residui = §23 backlog (**NOT OPENED**). Riapertura solo con decisione di prodotto.

> **HISTORY:** il testo seguente fino a §21bis conserva chiusure di blocco datate. Un eventuale “prossimo passo `D-FLIGHT-F`” sotto era CURRENT al momento della scrittura post-CDE ed è **SUPERSEDED** (F/ATM09 già CLOSED).

### 21sexies. Snapshot CURRENT post-CDE (SUPERSEDED — storico)

**`D-FLIGHT-F`** era il candidato delicato successivo (helper client / rete / OPSEC). **Chiuso** nella serie ATM09 + HELPER-DEPLOY + H + VISUAL-READY. Non riaprire come NEXT corrente.

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

### 22.6 Architettura H2 — **LIVE** (helper 0.1.3; design target sotto = HISTORY implementato)

```text
GOI GIS → helper VPS GOI → auth D-Flight → WFS autenticato
```

**Current-state:** helper **0.1.3** LIVE su VPS (`:8010`); API operative include `GET /status`, `GET /dataset`, `POST /refresh`, più `/atm09/*`. Credenziali solo server-side (`LoadCredential`). Cache LKG / change detection canonical come da implementazione H2-A (+FIX). **Non** descrivere più H2 come “NON implementata”.

Design target originale (preservato come HISTORY di specifica):

- Python **3.12** stdlib se sufficiente; servizio **separato**;
- credenziali **solo** server-side; preferenza **`systemd LoadCredential`**;
- **nessuna** credenziale in monolite/browser/repo/docs/log;
- WFS preferibilmente **EPSG:4326**;
- cache **last-known-good**; **atomic replacement**; previous dataset per rollback;
- change detection: **CANONICAL-FEATURE-HASH**;
- status metadata; failure **non distruttivo**.

### 22.7 Client helper — **IMPLEMENTED** (F / H / VISUAL-READY)

**Current-state (live):**

- Nessuna rete D-Flight al boot; nessuna credenziale D-Flight nel browser.
- `forceOffline` e `opsecStrict` bloccano le call helper (gate client esistenti).
- Load / refresh / pending / apply esplicito / re-eval temporale locale / ATM09 overlay: **LIVE**.
- Autoload all’apertura pannello (H); cooldown refresh ~30 min senza auto-apply.
- Helper irraggiungibile → no regressione GIS globale; retention session dove applicabile.

> Testo design “requisiti client futuro” della discovery resta semanticamente soddisfatto dal path F+H; non riaprire come gap obbligatorio.

---

## 23. Backlog post-chiusura WU-0013 — **BACKLOG / NOT OPENED** (non bloccante)

Residui dal gap audit `D-FLIGHT-BACKLOG-GAP-AUDIT-A` (2026-08-14). **Non** aperti. **Non** obbligatori per lo scope H2+overlay chiuso. Riapertura solo con decisione di prodotto.

| Item | Note | Candidato (NOT OPENED) |
| --- | --- | --- |
| Filtro UI temporal state | Core `temporal_state` già live | `D-FLIGHT-TEMPORAL-FILTER-UI-A` |
| Filtro restriction | UI assente; dati WFS spesso euristici | `D-FLIGHT-RESTRICTION-FILTER-UI-A` |
| Filtro reason | Qualità reasons WFS debole (`[]` tipico h2-wfs) | — |
| Ricerca zona id/nome | UI assente | — |
| Opacity slider | CSS fissa oggi | — |
| Persistenza offline opt-in | Session-only oggi; DELICATO se aperto | `D-FLIGHT-SESSION-PERSIST-OPTIN-A` |
| Export vettoriale GeoJSON/GPX zone | JPG overlay già live | — |
| UI import ED-269/ED-318 | Parser API esiste; UI no | — |
| Feed NOTAM vettoriale | Discovery WFS NOTAM ≠ prodotto; helper senza `/notam` | — |
| Parity completa ED-269 ↔ WFS | UNKNOWN non bloccante | — |
| Filtro operativo quota/altitudine | Display vertical live; filtro no | — |
| Douglas-Peucker / Canvas | **OPTIONAL LATER** — non requirement | — |

**UNKNOWN non bloccanti (registrati, non aperti):**

- Parity semantica completa ED-269 vs WFS;
- Qualità/distribuzione restriction/reason sul WFS live;
- ToS / conservazione offline del dataset D-Flight.

**Chiusura formale:** `DOCS-DFLIGHT-WU0013-CLOSE-A` — **CLOSED / PASS DOCS-ONLY** (2026-08-14).