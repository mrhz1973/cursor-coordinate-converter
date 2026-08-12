# Riepilogo — D-FLIGHT-G-UI-OVERLAY-A-FIX2

## Trigger

```text
QA D-FLIGHT-G-UI-OVERLAY-A-FIX1 FAIL operatore — isolamento wheel incompleto: con il cursore sui pannelli D-Flight la rotellina può ancora modificare lo zoom della mappa; inoltre nel menu Layer la rotellina scrolla l’elenco ma contemporaneamente zooma la mappa e la prima voce del menu risulta parzialmente coperta dal bordo superiore.
```

## Cosa è stato fatto

1. **`gisUiBlocksMapWheelZoom(ev)`** — hit-test su `closest` + fallback geometrico `getBoundingClientRect` per dialog aperti, `.tlayer-menu` / basemap menu, float GIS, dock.
2. **`attachWheelZoom`** — se UI sotto cursore: nessun accumulo zoom; su fall-through `preventDefault` + `gisScrollBlockingUi`.
3. **`positionBasemapMenuGis`** — `safeTop` da fondo `header` + pad; clamp menu in `[safeTop, safeBottom]`.
4. CSS menu: padding / `overscroll-behavior: contain` / titoli sezione `pointer-events: auto`.
5. Build **`D-FLIGHT-G-UI-OVERLAY-A-FIX2` / 167**.

## Fuori scope (invariato)

Helper Python, CORS, VPS net/auth, OPSEC. Nessuna scrittura false ED su `restriction` (B28).

## File

- `coordinate_converter Claude.html` (task commit `42edb6f`)
- questo inbox + `docs/orchestrator/latest.md` + `docs/runtime/LAST_CURSOR_REPORT.md` (autosync; monolite **escluso**)

## Funzioni / regioni

- `gisUiBlocksMapWheelZoom`, `gisScrollBlockingUi`, `gisPanelTrapWheel` (commento)
- `attachWheelZoom` (branch block)
- `positionBasemapMenuGis` (`safeTop`)
- CSS `.tlayer-menu` / section title

## QA

- `node --check` su 2 blocchi JS inline: OK
- Deploy GIS: `git pull --ff-only` + `systemctl restart goi-gis-app` → active; HTTP 200 su `?v=42edb6fb`
- **AUTOMATED BROWSER QA D-FLIGHT-G-UI-OVERLAY-A-FIX2 PASS**
  - pannello D-Flight aperto: wheel su pannello e fall-through mappa → `mapZoom` invariato
  - menu Layer: `menuTop` ≥ `headerBottom`; prima voce visibile; wheel / fall-through → zoom invariato
- **QA operatore:** non attestata (gate ChatGPT)
- **No** passaggi QA umani da Cursor

## Storico FAIL da conservare

- `QA D-FLIGHT-F FAIL operatore`
- `QA D-FLIGHT-G-UI-OVERLAY-A FAIL operatore`
- `QA D-FLIGHT-G-UI-OVERLAY-A-FIX1 FAIL operatore`

## Repo (pre-autosync / task)

- Task commit: `42edb6fb86b98ccf5e2636884d748c043cd6b7c2` — `fix(dflight): harden wheel UI isolation + Layer menu safeTop (G-FIX2)`
- Push task: OK
- `git rev-parse HEAD` / `origin/main` / `ls-remote`: allineati su `42edb6f` prima di questo autosync

## Runtime

- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=42edb6fb`
- Title: `GOI GIS Tool · D-FLIGHT-G-UI-OVERLAY-A-FIX2 · build 167`

## Prossimo passo

`QA FINALE CHATGPT — PENDING` su FIX2. **No** `finito` finché non arriva `QA D-FLIGHT-G-UI-OVERLAY-A-FIX2 PASS operatore`.

## Limiti

- Isolamento geometrico dipende da UI aperta e rect valide; panel minimizzati esclusi di proposito.
- Heuristica stile WFS (FIX1) invariata.
