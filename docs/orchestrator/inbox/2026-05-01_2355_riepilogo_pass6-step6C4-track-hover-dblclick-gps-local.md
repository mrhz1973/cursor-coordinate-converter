# Pass 6 Step 6C.4 — Traccia mappa: menu senza Centra, hover hint, doppio click centra, pulse solo GPS

**Data:** 2026-05-01  
**Scope:** micro-step **6C.4** sul monolite locale; **nessun** commit monolite; **nessuna** minimizzazione modal; **nessun** 6D globale; **nessun** `finito`.

## Checklist richiesta (sì/no)

1. **Menu contestuale da overlay mappa senza «Centra»:** **sì** — `showTrkSavedCtxMenu(x, y, id, opts)` con `opts.source === "map"` nasconde il pulsante `data-trk-ctx="fly"`; dalla mappa si passa `{ source: "map" }`.
2. **«Centra» mantenuto su tabella / long-press riga:** **sì** — `ensureSavedTracksCtxMountWired` passa `{ source: "list" }`.
3. **Feedback hover traccia in mappa:** **sì** — CSS hover su `[data-saved-map-hit]`; hint fisso `#savedTrackMapHoverHint` dopo ~480 ms (`wireSavedTrackMapHoverHintOnHitEl`); i18n **`track.savedMapHoverHint`** (IT/EN/FR); hint nascosto su `contextmenu` sulla geometria.
4. **Doppio click centra mappa:** **sì** — `gisMapOnDblClickCenter` su `#miniMap` (capture, una tantum `root._gisMapDblCenterWired`); aggiorna **`state.viewCenter`** + **`saveStore()`** + **`renderTileMap`**; **non** `lastResult` / `renderResults` / cronologia. Esclusi: controlli mappa (`UI_SEL` allineato alla toolbar), track/waypoint pick, `mapPickMode`, Astro pick, Range Rings pick/create/edit move, bbox. **Nessun** zoom nativo double-click preesistente sul tile map da preservare (non c’era); convive con il flusso track pick che usa **mouseup** differito, non l’evento `dblclick`.
5. **GPS pulse solo overlay GPS:** **sì** — animazioni **`@keyframes gisGpsCorePulse`**, **`gisGpsAccPulse`**, **`gisGpsRingPulse`** solo sotto **`.gis-map-gps-overlay`**; cerchio **`gis-gps-pulse`** ripristinato in **`renderGisMapGpsOverlay`** quando c’è raggio accuratezza. **Marker generici:** restano **senza** `mapMarkerPulse` in **`body.gis-mode .tile-marker::after`** (invariato da 6C.3).
6. **Pulsante GPS attivo dopo fix:** **sì** — classe **`.gis-gps-fix-active`** + **`aria-pressed`**; **`syncGisMapGpsButtonFromTransient()`** dopo barriere geoloc e fine **`renderTileMap`**; a **inizio** nuova richiesta GPS: `_gisMapGpsFixTransient = null`, rimozione overlay, sync (fino al nuovo successo il pulsante non è «fix attivo»).

## Vincoli confermati

- Nessun **`watchPosition`**; GPS solo su click; nessun GPS silenzioso all’avvio.
- Nessuna modifica **`state.savedTracks`**, localStorage (nessuna nuova chiave), **`state.lastResult`**.

## QA automatico

- Due blocchi `<script>`; nessun `src` / `type="module"`.
- **`node --check`:** OK su **9389–9515** e **9519–40310**.

## Test browser

**Non eseguiti** (nessun browser in sessione). Checklist: voci Task 7 del prompt operativo.

## Non implementato

- Minimizza modal; Step 6D; `finito`; commit monolite.

## Commit memoria

- Messaggio: **`docs: memoria Pass 6 Step 6C4 track hover gps local`**
- Hash: **`f6242d6`** — push **riuscito**.
- **`coordinate_converter Claude.html` escluso.**
