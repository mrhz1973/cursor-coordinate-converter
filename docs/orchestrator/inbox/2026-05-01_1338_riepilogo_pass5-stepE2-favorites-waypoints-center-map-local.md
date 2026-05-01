# Pass 5 Step E.2 — Favoriti/Waypoint: riga duplicata, Centra, map-first (monolite locale)

**Data:** 2026-05-01  
**Monolite:** `coordinate_converter Claude.html` — **non** incluso nel commit memoria (solo locale).

## Cosa è stato fatto

1. **Riga blu «★ Favoriti» ridondante** nel modal principale Favoriti (`#favoritesPanel`): la sezione `#sec-favorites` è un `<details>` con `<summary>` identico al titolo del dialog; riparentata in `favoritesPanelBody` restava visibile. **Fix:** stesso schema Range Rings — `#favoritesPanelBody #sec-favorites > summary` reso **visually hidden** (clip 1×1), `.section-body` forzato `display:block`, contenitore `details` senza bordo/margini ridondanti.

2. **Waypoint modal:** il summary era già nascosto per `#waypointModalPanel #sec-waypoints`; nessun duplicato aggiuntivo richiesto.

3. **Pulsante «Centra»**  
   - **Favoriti:** in `renderFavorites`, riga azioni: bottone `data-fav-center` + delegazione click in `renderFavorites`.  
   - **Waypoint:** pulsante esistente `data-role="wp-zoom"` ora usa etichette/tooltip **`common.center`** / **`tip.common.centerMapPoint`** (fallback alle chiavi traccia se assenti).

4. **Centratura mappa:** nuova **`gisMapCenterOnLatLon(lat, lon, opts)`** — `validateLatLon`, `normalizeLon`, aggiorna `state.viewCenter`, bump zoom se `mapZoom < 12` → 14 (solo memoria sessione, **nessun** `saveStore`), **`renderTileMap`** (non **`renderMiniMap`**) così **non** si tocca `state.lastPoint` né `state.lastResult`. **`waypointsZoomTo`** delega qui + badge **`map.noticeCenteredOnPoint`**. **`favoriteMapCenterTo(id)`** per i favoriti.

5. **Mappa visibile sotto i modal (GIS):** niente refactor architetturale; aggiunto **sfondo leggermente trasparente** (`color-mix`) su `#favoritesPanel > .app-modal-body` e su `.waypoint-modal-panel` in `body.gis-mode` così la mappa a schermo intero resta **percepibile** dietro il pannello flottante. Il modal Waypoint in GIS continua a nascondere l’host mappa interno (`.waypoint-modal-map-host { display:none }`) — la mappa utile è quella **hub** sotto.

## Cosa non è stato toccato

`state.lastResult`, persistenza / nuove chiavi `localStorage`, SunCalc/WMM/OLC/QR, OPSEC/geocoding/tiles/IndexedDB, Astro picker, Range Rings (logica), cronologia, permalink, `renderResults`.

## QA automatici (sessione)

- `git status --short`: solo monolite modificato.  
- Nessun `<script src>`, nessun `type="module"`, 2× `<script>` / `</script>`.  
- `node --check` sui due blocchi inline (estrazione non greedy): OK.

## Test browser

**Non eseguiti** in Cursor. Checklist: modal Favoriti senza summary duplicato; Centra su favorito/waypoint; badge «Mappa centrata»; Astro picker / Range Rings; console.

## Commit memoria

Messaggio: `docs: memoria Pass 5 Step E2 center map local` — solo `docs/orchestrator/latest.md` + questo file.
