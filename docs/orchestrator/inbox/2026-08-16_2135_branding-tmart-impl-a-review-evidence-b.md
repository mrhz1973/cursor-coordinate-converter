# Evidence B — BRANDING-TMART-IMPL-A-REVIEW-EVIDENCE-B

**Tipo:** DIAGNOSTIC / DOCS — evidence-only  
**Data:** 2026-08-16  
**WU:** WU-0020  
**Gate (invariato):** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**Verdetto review:** *non emesso* (STOP esplicito)

## Candidate (invariato)

| Voce | Valore |
| --- | --- |
| BASE | `9820c8ab9cb0d2103adf955ba3b873bca4c89e08` |
| CANDIDATE | `1abc247fd783526531307c7a6997292f103b986d` |
| Blob monolite | `f0f9d265bd368a62dfb6efc2dc32b4fbe31b51ef` (index in diff) |
| Build | **206** · `APP_BUILD_ID=BRANDING-TMART-IMPL-A` |
| Runtime patch in questo pass | **NESSUNA** |
| Monolite modificato | **NO** |

### Fonte delta (esatta)

```bash
git diff -U6 \
  9820c8ab9cb0d2103adf955ba3b873bca4c89e08 \
  1abc247fd783526531307c7a6997292f103b986d \
  -- "coordinate_converter Claude.html"
```

### Diff stat / riconciliazione

| Metrica | Valore |
| --- | --- |
| `git diff --numstat` | `178` added · `53` deleted |
| Hunk runtime totali | **32** |
| Somma `+` su hunk | **178** |
| Somma `-` su hunk | **53** |
| Riconciliazione | **PASS** (`178/53` ≡ numstat) |

---

## 1. Hunk account completo

Legenda classificazione: `BRAND_STRING` · `BUILD_META` · `BRAND_SELFTEST` · `OTHER`.

**OTHER:** **0** (nessun finding OTHER).

| # | Header | +/− | Area / simbolo | Class |
| --- | --- | --- | --- | --- |
| 1 | `@@ -1,12 +1,12 @@` | +2/−2 | HTML head `application-name` / `<title>` | BRAND_STRING |
| 2 | `@@ -12075,13 +12075,13 @@` | +1/−1 | `.brand-main` fallback | BRAND_STRING |
| 3 | `@@ -14986,13 +14986,13 @@` | +1/−1 | footer `footer.appName` HTML | BRAND_STRING |
| 4 | `@@ -15447,15 +15447,15 @@` | +3/−3 | I18N **it** `app.title*` | BRAND_STRING |
| 5 | `@@ -16895,13 +16895,13 @@` | +1/−1 | I18N **it** `footer.appName` | BRAND_STRING |
| 6 | `@@ -17868,15 +17868,15 @@` | +3/−3 | I18N **en** `app.title*` | BRAND_STRING |
| 7 | `@@ -19132,13 +19132,13 @@` | +1/−1 | I18N **en** `footer.appName` | BRAND_STRING |
| 8 | `@@ -20070,15 +20070,15 @@` | +3/−3 | I18N **fr** `app.title*` | BRAND_STRING |
| 9 | `@@ -21218,13 +21218,13 @@` | +1/−1 | I18N **fr** `footer.appName` | BRAND_STRING |
| 10 | `@@ -22816,13 +22816,13 @@` | +1/−1 | `buildMeasureGeoJSONFeature` creator | BRAND_STRING |
| 11 | `@@ -23572,21 +23572,21 @@` | +4/−4 | `APP_BUILD_*` + `applyAppBuildLabel` / `document.title` | BUILD_META + BRAND_STRING |
| 12 | `@@ -29333,25 +29333,25 @@` | +2/−2 | `exportGeoJsonMetadata` creator + `buildGPX` creator | BRAND_STRING |
| 13 | `@@ -29360,13 +29360,13 @@` | +1/−1 | `buildGPX` / KML `<name>` | BRAND_STRING |
| 14 | `@@ -29441,13 +29441,13 @@` | +1/−1 | `buildGPXRoute` creator | BRAND_STRING |
| 15 | `@@ -32207,13 +32207,13 @@` | +1/−1 | `spatialGeoJSONToGpx` creator | BRAND_STRING |
| 16 | `@@ -32239,13 +32239,13 @@` | +1/−1 | `spatialGeoJSONToKml` `<name>` | BRAND_STRING |
| 17 | `@@ -38837,14 +38837,14 @@` | +2/−2 | `dflightSelfTestF` build assert | BUILD_META |
| 18 | `@@ -39859,14 +39859,14 @@` | +2/−2 | `dflightSelfTestTf` build assert | BUILD_META |
| 19 | `@@ -41787,14 +41787,14 @@` | +2/−2 | `dflightSelfTestH` build assert | BUILD_META |
| 20 | `@@ -42288,14 +42288,14 @@` | +2/−2 | `dflightSelfTestHitFixA` build assert | BUILD_META |
| 21 | `@@ -43302,14 +43302,14 @@` | +2/−2 | `dflightSelfTestOptB` build assert | BUILD_META |
| 22 | `@@ -43740,14 +43740,14 @@` | +2/−2 | `dflightSelfTestOptB` (2°) build assert | BUILD_META |
| 23 | `@@ -44332,14 +44332,14 @@` | +2/−2 | `dflightSelfTestMVISA` build assert | BUILD_META |
| 24 | `@@ -44967,14 +44967,14 @@` | +2/−2 | `dflightSelfTestIMPLA` build assert | BUILD_META |
| 25 | `@@ -45124,14 +45124,14 @@` | +2/−2 | `dflightSelfTestLEGENDUX` build assert | BUILD_META |
| 26 | `@@ -45548,15 +45548,15 @@` | +3/−3 | `dflightSelfTestSideBySide` build assert | BUILD_META |
| 27 | `@@ -45929,12 +45929,137 @@` | +125/−0 | `brandingSelfTestTmartImplA` + `brandingExtendSelfTestTmart` | BRAND_SELFTEST (+ BUILD_META/STRING in asserts) |
| 28 | `@@ -64428,13 +64553,13 @@` | +1/−1 | `buildCsvFromTrack` `# creator` | BRAND_STRING |
| 29 | `@@ -64497,13 +64622,13 @@` | +1/−1 | `exportSavedTrackSingleFile` CSV creator | BRAND_STRING |
| 30 | `@@ -64551,13 +64676,13 @@` | +1/−1 | `exportSavedTracksZipBundle` CSV creator | BRAND_STRING |
| 31 | `@@ -71274,13 +71399,13 @@` | +1/−1 | `rangeRingSetToGeoJSON` `app:` | BRAND_STRING |
| 32 | `@@ -79233,13 +79358,13 @@` | +1/−1 | `polygonBuildKml` document name | BRAND_STRING |

**Somma classificazioni (hunk, non mutua esclusione su #11/#27):** 20 BRAND_STRING-primary · 10 BUILD_META-primary · 1 BRAND_SELFTEST-primary · 0 OTHER.

---

## 2. Meta / title / header (codice reale)

### Hunk 1 — meta + title statico (nessun CSS nel hunk: `<style>` subito sotto invariato)

```diff
-<meta name="application-name" content="GOI GIS Tool">
-<title>GOI GIS Tool · B6.1RSD-A</title>
+<meta name="application-name" content="TMART GIS tool">
+<title>TMART GIS tool · B6.1RSD-A</title>
 <style>
```

### Hunk 2 — `.brand-main` (`.brand-by` / `.brand-signature` invariati nello stesso contesto)

```diff
-        <span class="brand-main" data-i18n="app.titleMain">GOI GIS Tool</span>
+        <span class="brand-main" data-i18n="app.titleMain">TMART GIS tool</span>
         <span class="brand-by" data-i18n="app.titleBy">by</span>
         <span class="brand-signature" data-i18n="app.titleSig">Marty</span>
```

### Hunk 11 — `applyAppBuildLabel` / build meta

Cambio stringa `document.title` prefisso + `APP_BUILD_ID` / `APP_BUILD_DETAIL` / `APP_BUILD_NUM` 205→206. Nessuna riga CSS.

Evidence locale selftest (pass precedente IMPL, non rieseguito in questo pass docs-only):  
`document.title` = `TMART GIS tool · BRANDING-TMART-IMPL-A · build 206`.

### CSS strutturale

Vedi §8 — blocco `<style>` **identical** BASE↔CANDIDATE.

---

## 3. I18N (IT/EN/FR)

Valori sul CANDIDATE (tre lingue, estratti da dizionario):

| Key | it / en / fr |
| --- | --- |
| `app.title` | `TMART GIS tool by Marty` ×3 |
| `app.titleBase` | `TMART GIS tool by` ×3 |
| `app.titleMain` | `TMART GIS tool` ×3 |
| `app.titleBy` | `by` ×3 (**invariato**) |
| `app.titleSig` | `Marty` ×3 (**invariato**) |
| `footer.appName` | `TMART GIS tool` ×3 |

**Brand identico** nelle tre lingue: `TMART GIS tool`.  
Hunk i18n = solo rename brand su chiavi già esistenti; **nessuna nuova chiave** funzionale EN/FR; `about.desc` / `convert.title` / altre stringhe funzionali **non** nel delta brand (fuori hunk 4–9).

Esempio IT (hunk 4):

```diff
-    "app.title":"GOI GIS Tool by Marty",
-    "app.titleBase":"GOI GIS Tool by",
-    "app.titleMain":"GOI GIS Tool",
+    "app.title":"TMART GIS tool by Marty",
+    "app.titleBase":"TMART GIS tool by",
+    "app.titleMain":"TMART GIS tool",
     "app.titleBy":"by",
     "app.titleSig":"Marty",
```

---

## 4. Footer / attribuzione

```diff
     <span data-i18n="footer.made">Realizzato da</span>
     <strong>T.M.</strong>
     <span class="sig-sep">·</span>
-    <span data-i18n="footer.appName">GIS Tool/Converter by Marty</span>
+    <span data-i18n="footer.appName">TMART GIS tool</span>
```

- Footer brand = **`TMART GIS tool`** (puro).  
- Attribuzione **`Realizzato da` + `T.M.`** invariata.  
- Nessuna duplicazione `by Marty` nel footer (rimossa la vecchia formula `GIS Tool/Converter by Marty`).  
- Header mantiene separatamente `by` + `Marty`.

---

## 5. Export (solo stringhe)

| Famiglia | Funzione / sito | Hunk | Cambio |
| --- | --- | --- | --- |
| Measure GeoJSON | `buildMeasureGeoJSONFeature` `creator` | 10 | string only |
| GeoJSON metadata | `exportGeoJsonMetadata` `creator` | 12 | string only |
| GPX | `buildGPX` `creator` + `<name>` | 12–13 | string only |
| GPX route | `buildGPXRoute` `creator` | 14 | string only |
| spatial GPX | `spatialGeoJSONToGpx` `creator` | 15 | string only |
| spatial KML | `spatialGeoJSONToKml` `<name>` | 16 | string only |
| CSV track | `buildCsvFromTrack` `# creator` | 28 | string only |
| CSV saved track | `exportSavedTrackSingleFile` | 29 | string only |
| CSV zip | `exportSavedTracksZipBundle` | 30 | string only |
| Range rings | `rangeRingSetToGeoJSON` `app:` | 31 | string only |
| Polygons KML | `polygonBuildKml` name | 32 | → `TMART GIS tool — Polygons` |

**Nota session:** `getSessionExportObject()` **non** contiene campo `app` brand (né in BASE né in CANDIDATE). Il punto audit «session/export app» corrisponde al campo **`app`** in `rangeRingSetToGeoJSON` (hunk 31), non al JSON sessione `coordconv_session.json`.

Nei hunk export non compaiono cambi a chiavi schema, geometrie, loop serializzazione o rami di flusso — solo literali stringa brand.

---

## 6. Residui old brand (CANDIDATE monolite)

Ricerche esatte su tip `1abc247` file `coordinate_converter Claude.html`:

| Pattern | Count | Classificazione residui |
| --- | --- | --- |
| `GOI GIS Tool` | **0** | — |
| `GIS Tool/Converter by Marty` | **0** | — |
| `GOI GIS` | **0** | — |

**Acceptance residui A:** **PASS** (zero A nel monolite).

---

## 7. Identificatori tecnici — negative evidence

| Identificatore | BASE | CANDIDATE | Nota |
| --- | --- | --- | --- |
| Filename `coordinate_converter Claude.html` | presente | presente (stesso path) | **invariato** |
| `const STORAGE_KEY = "coordconv_v2";` | sì | sì | riga **identica** |
| `const UI_STORAGE_KEY = "coordconv_ui_v1";` | sì | sì | riga **identica** |
| `CoordConvMapTiles` (TILE_IDB.name) | sì | sì | semantica invariata |
| `X-Client: CoordinateConverter/1.0` | sì | sì | riga **identica** in `nominatimQuery` |
| `state.mapWaypoints` | presente | presente | nessun cambio schema/cap nel delta |

**Conteggi grezzi** `coordconv_v2` / `coordconv_ui_v1` / `CoordConvMapTiles` / `CoordinateConverter/1.0` / `mapWaypoints` aumentano di **+1** (o +1 su substring) **solo** perché il nuovo selftest (hunk 27) *cita* queste stringhe negli assert negativi (`STORAGE_KEY === "coordconv_v2"`, `String(nominatimQuery).indexOf('CoordinateConverter/1.0')`, ecc.). Non sono nuovi store/endpoint.

---

## 8. CSS

Un solo blocco `<style>…</style>` in BASE e CANDIDATE.

| | SHA-256 |
| --- | --- |
| BASE style | `52dd09f432c60f23cc109e224d66c587aa5e136570f8e94479caf808f4b3e4a9` |
| CANDIDATE style | `52dd09f432c60f23cc109e224d66c587aa5e136570f8e94479caf808f4b3e4a9` |

**identical = true** → **nessuna modifica CSS**.

---

## 9. Selftest branding

### Inserimento (hunk 27)

Dopo `dflightExtendSelfTestLEGENDUX`, inseriti:

1. `function brandingSelfTestTmartImplA()` (~L45937 tip candidate)
2. IIFE `brandingExtendSelfTestTmart` che concatena i check a `dflightSelfTestAll` e espone `GOIDflight.selfTestBrandingTmart`

### Natura degli assert (non tautologici)

Il selftest verifica **DOM/runtime/export reali**, non solo la presenza della stringa nel proprio source:

- `.brand-main` / `.brand-by` / `.brand-signature` `textContent`
- `document.title` dopo `applyAppBuildLabel()`
- `meta[name=application-name]` attribute
- footer `[data-i18n=footer.appName]` text
- dizionario `I18N.it|en|fr` valori
- output di `buildGPX` / `buildKML` / `buildGeoJSON` su punti campione
- source di builder export per CSV/polygons/measure/range-ring (assenza old brand via `"GOI"+" GIS Tool"`)
- negative: `STORAGE_KEY`, `nominatimQuery` X-Client, `TILE_IDB.name`, `state.mapWaypoints` array

### Conteggi (evidence IMPL precedente, non rieseguiti in questo pass docs-only)

| Voce | Valore |
| --- | --- |
| Branding checks | **17** (`BRAND_*`) |
| Selftest totale `GOIDflight.selfTest()` | **421** |
| fail count | **0** |
| ok | **true** |

Fonte: inbox IMPL evidence `2026-08-16_2125_…` + run locale `?v=brand206`.

---

## 10. Docs BASE → candidate (`1abc247`)

File nel commit runtime candidate:

| File | Categoria |
| --- | --- |
| `README.md` | **prodotti living** (H1 / descrizione / author) |
| `LLMS.md` | **prodotti living** (intro) |
| `docs/METHOD.md` | **prodotti living** (intro; file già storico/overlay) |
| `docs/QA-CHECKLIST.md` | **prodotti living** (titolo) |
| `docs/PROJECT_notes.md` | **prodotti living** (sola riga brand corrente; narrazione storica non cancellata) |
| `coordinate_converter Claude.html` | runtime (fuori docs) |

**Non** nel commit candidate (storico non riscritto): `docs/checkpoint.md`, `docs/session-*`, inbox storici, chatgpt-checkpoints.

Commit docs tip **dopo** candidate (operativo, non parte del blob runtime): `c4cba40` — FRONTIER/WU/evidence IMPL / LAST_CURSOR_REPORT (stato gate). Questo pass **REVIEW-EVIDENCE-B** aggiunge solo evidence/docs operative.

Nessuna modifica documentale fuori da: living brand · stato operativo WU/FRONTIER/orchestrator.

---

## 11. Invarianti (dal delta monolite)

| Invariante | Evidence |
| --- | --- |
| Nessun nuovo storage key | STORAGE/UI keys invariati; no nuove `localStorage` keys nel delta |
| Nessuna rete/endpoint nuova | solo stringa brand; X-Client invariato |
| Nessun GPS / live tracking | assente dal delta |
| Helper 0.1.3 | non nel tree monolite; non toccato |
| `state.mapWaypoints` | nessuna modifica struttuale nel delta |
| F NOT OPENED | nessuna WU/frontiera F aperta |
| G NOT OPENED | FRONTIER NEXT invariato su G |

---

## Acceptance matrix (evidence-only)

| Criterio | Esito |
| --- | --- |
| Candidate FULL SHA identico `1abc247…` | PASS |
| Nessuna modifica runtime in questo pass | PASS |
| 32 hunk contabilizzati; +/− = 178/53 | PASS |
| OTHER inspiegati | **0** |
| Codice branding inspectable | PASS (excerpt §2–5, §9) |
| Zero residue A | PASS |
| ID tecnici invariati (semantica) | PASS |
| CSS invariato | PASS |
| Selftest non tautologico | PASS (DOM/export runtime) |
| Scope drift F/G/rete/GPS | nessuno osservato |

## STOP

- **NON** emesso verdetto review  
- **NON** patch / bump / deploy / ABQA / QA / finito / apertura G  
- Gate resta: **REVIEW GPT-SOSTITUTIVA — PENDING**
