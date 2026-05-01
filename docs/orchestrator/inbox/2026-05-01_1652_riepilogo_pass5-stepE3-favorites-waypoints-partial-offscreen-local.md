# Pass 5 Step E.3 — Favoriti / Waypoint modal partial-offscreen (monolite locale)

**Data:** 2026-05-01  
**Monolite:** `coordinate_converter Claude.html` — **non** incluso nel commit memoria (solo locale).

## Cosa è stato fatto

1. **`_favoritesPanelLayoutOpts()`** e **`_waypointPanelLayoutOpts()`**: aggiunto **`partialMinVisible: 72`** (allineato a Range Rings / Astro).

2. **`gisPanelAttachDrag` / `gisPanelAttachResize`**: ricevono già `opts` tramite `Object.assign({}, opts, …)` in **`attachFavoritesPanelFloatingGis`** / **`attachWaypointModalFloatingGis`** — con `partialMinVisible` su `opts`, il drag durante il move e il resize usano già la logica parziale (stesso codice condiviso con RR).

3. **`clampFavoritesPanelRect`** e **`clampWaypointModalRect`**: sostituito **`gisPanelClampRect`** con **`gisPanelClampRectPartialVisible`** così fine drag, **`window.resize`**, **`gisRefreshI18n`** e ri-wiring non riportano il pannello per intero dentro il viewport se resta una striscia ≥ 72 px recuperabile.

## Cosa non è stato toccato

- Nessun nuovo `localStorage` / chiavi; nessuna modifica a `state.lastResult` / `state.lastPoint`; `gisMapCenterOnLatLon`, Centra favoriti/waypoint, Astro pickers, Range Rings core, SunCalc/WMM/OPSEC/tiles.

## Comportamento runtime posizione

- **`gPanelLayouts`** invariato: se già persistito in sessione / `coordconv_ui_v1` per waypoint/favoriti, resta il meccanismo esistente; **E.3** non introduce nuove chiavi.
- **`gisPanelApplyLayout`** resta su **`gisPanelClampRect`** (come Astro/RR): al open può ancora “centrare” una volta, poi **`clamp*PartialVisible`** applica il secondo passo — pattern già usato per RR/Astro.

## QA automatici (sessione)

- `git status --short`: solo monolite modificato.
- Nessun `<script src>`; nessun `type="module"`; 2× `<script>` / `</script>`.
- `node --check` sui due blocchi inline (non greedy): OK.
- `git diff --stat` monolite: piccolo delta (solo E.3).

## Test browser

**Non eseguiti** in Cursor. Checklist: trascinare Favoriti/Waypoint oltre bordo; resize; Centra non chiude/sposta reset; Astro + RR + console.

## Commit memoria

Messaggio: `docs: memoria Pass 5 Step E3 partial offscreen local` — solo `docs/orchestrator/latest.md` + questo file.
