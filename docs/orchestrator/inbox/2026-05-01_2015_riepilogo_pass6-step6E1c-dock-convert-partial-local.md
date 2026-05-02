# Pass 6 — Step 6E.1c (dock più sotto + Converti partial-offscreen)

**Data:** 2026-05-01  
**Monolite:** `coordinate_converter Claude.html` — **non committato** in questo step.  
**GPS / Esc / qualità segnale:** **non toccati** (diff baseline senza righe su funzioni GPS).

## Task 1 — Dock minimizzati

- **Problema radice:** in `body.gis-mode` la variabile **`--gis-topbar-h`** è **`0px`**, quindi `top: calc(var(--gis-topbar-h, 56px) + 8px)` diventava **~8px** dal bordo viewport → dock nella fascia header/branding.
- **Fix:** introdotto **`--gis-minimized-dock-offset`** (78px desktop, 88px stretto) + **`env(safe-area-inset-top)`**; `top` della **`.gis-minimized-dock`** usa solo questo offset (non `--gis-topbar-h`).
- **z-index:** dock portata a **22** (sotto `#convertModal` 26 / modali traccia 28), sempre sopra mappa, senza coprire il dialog Converti quando aperto.

## Task 2 — Converti (`#convertModal`)

- **Elemento:** `<dialog id="convertModal" class="app-modal convert-modal">` — floating GIS (`show()`, non modal backdrop), drag/resize già presenti.
- **Prima:** `_convertPanelLayoutOpts()` **senza** `partialMinVisible`; **`clampConvertModalRect`**, **`applyConvertModalGisDefaultSize`**, **`applyConvertModalGisLayout`** e **`positionConvertModalNearTopbar`** usavano **`gisPanelClampRect`** → pannello interamente dentro viewport.
- **Dopo:** **`partialMinVisible: 72`** in **`_convertPanelLayoutOpts()`**; tutti i clamp sopra usano **`gisPanelClampRectPartialVisible`** (stesso pattern Waypoint/Favoriti/Traccia). Drag/resize ereditano già il comportamento da **`opts.partialMinVisible`**.

## QA

- `git status --short`: atteso solo `M coordinate_converter Claude.html` prima del commit memoria.
- `<script>` / `</script>`: **2 / 2**; nessun `script src` / `type="module"`.
- `node --check`: blocchi **9578–9704**, **9708–41062** — OK.
- Diff baseline vs GPS: nessuna modifica a `requestGisMapCurrentLocation` / `renderGisMapGpsOverlay` / `_gisMapGpsFixTransient`.
- Diff baseline vs pannelli 6E.2: nessun match su `favoritesPanel|layersPanel|astroPanel|rangeRingsPanel`.
- Test browser: **non eseguiti**.

## Commit memoria

`docs: memoria Pass 6 Step 6E1c dock convert partial local` — hash **`3e3cbf3`**.

## Backlog

6E.2; eventuale micro-tuning pixel `--gis-minimized-dock-offset` da screenshot reale.
