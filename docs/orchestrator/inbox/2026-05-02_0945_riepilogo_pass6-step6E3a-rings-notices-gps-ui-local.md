# Pass 6 Step 6E.3a — polish Range Rings UI, notice bars, undo rimosso, Layers, GPS qualità (monolite solo locale)

## Sintesi

Micro-step **post-smoke 6E.3** su `coordinate_converter Claude.html`: uniformità sezione **Importa / esporta set** Range Rings; palette **notice interne modal** distinta dal blu tool-active; **rimosso pulsante undo mappa** (`.tundo-btn`); **allineamento pulsante Layers** in GIS; **colori GPS** pulsante + overlay per qualità (buono/medio/scarso + unknown).

## Checklist richiesta

| Voce | Esito |
|------|--------|
| Range Rings import/export style uniformato | **Sì** — `#sec-rangerings .rr-io-details` card neutra (`var(--border)`, `var(--panel2)`); summary senza `sub-section-title` accent; markup `details` senza inline margin ridondante |
| Notice / modal bars uniformate | **Sì** — variabili **`--gis-modal-notice-bg` / `--gis-modal-notice-border`** su `html` (+ override light); applicate a **`.gis-modal-minimize-notice`**, **`#sec-rangerings`**.`rr-map-first-hint`, **`rr-notice-box--info`**, **`#sec-measure`**.`meas-notice-box--info`, **`rr-rename-confirm-box`**, **`fav-inline-confirm--rename`** |
| Palette notice scelta | **Slate/neutral** (`#64748b` mix con `--panel2` / `--border`), non blu accent |
| Undo button rimosso | **Sì** — niente più **`renderTileMap`** chunk **`map-undo`**, listener, **`UI_SEL`/`CTRL_SEL`**, CSS **`.tundo-btn`**; **`*btnTrackUndo`** nel modal Traccia **non toccato** |
| Layers button allineato | **Sì** — GIS **`body.gis-mode #gisMapMount … .tlayer-btn`**: flex center + **`line-height:0`**; icona **`display:block`** |
| GPS quality colors | **Sì** — **`gisGpsAccToQualityTier(accM)`** (≤10m good, ≤30m medium, else poor; accuracy invalida → unknown); classi **`gis-gps-q-*`** su **`#btnGisMapMyLocation`** con **`gis-gps-fix-active`**; overlay **`gis-gps-map-q-*`** su wrapper **`renderGisMapGpsOverlay`** |
| GPS core non toccato (logica acquisizione) | **`requestGisMapCurrentLocation`** non modificato; **`_gisMapGpsFixTransient`** non modificato (solo lettura `accM` esistente) |
| `renderGisMapGpsOverlay` | **Modificato** solo per classe qualità sul wrapper (vincolo “salvo strettamente necessario” per styling) |
| Converti non toccato | **Sì** |
| Schema / localStorage / state.lastResult | **Nessuna modifica** |
| OPSEC / tile / cache / geocoding / IndexedDB | **Nessuna modifica logica** |

## Non implementato (fuori scope)

Hub undo/redo/cronologia vicino Strumenti; `finito`; commit monolite; `git add .`; 6D globale.

## QA automatica

- **`git status --short`**: atteso solo ` M coordinate_converter Claude.html` prima/poi commit memoria.
- **Script count**: **2** / **2** (`<script>` / `</script>`).
- **`node --check`**: estratti righe **9715–9841** (SunCalc stub) e **9845–41401** (core) — **OK**.
- **grep** `<script src>` / `type="module"`: nessun match.
- **Diff baseline** `/tmp/goi-gis-before-6E3a.html`: solo CSS/UI mappa, **`syncGisMapGpsButtonFromTransient`**, **`renderGisMapGpsOverlay`** wrapper class; nessuna modifica funzionale richiesta a Converti/state persistenza.

## Test browser

**Non eseguiti** in ambiente agent — checklist Task 7 utente consigliata.

## Commit memoria

- **Monolite**: **NON incluso** nel commit orchestratore (solo locale fino a decisione team).
- **Commit pushato**: **`6c313c9`** — messaggio `docs: memoria Pass 6 Step 6E3a rings notices gps ui local`
