# Pass 5 Step D — Astro waypoint chooser (monolite locale)

**Data:** 2026-05-01 (timestamp inbox `1149` locale).

## Cosa è stato fatto

Implementato **solo Step D** del piano Astro source picker: sorgente **Da waypoint…** (`data-astro-src="waypoint"`), dialog **`#astroWaypointPicker`** con ricerca, lista compatta (max **50** risultati + hint `rangeRings.pickerMaxHint`), stato vuoto / nessun match, pulsante **Usa** per riga.

Helper: `astroIndexPickerWaypoints`, `astroFillWaypointPicker`, `astroOpenWaypointPicker`, `astroCloseWaypointPicker`, `astroApplyWaypointFromPicker`, `ensureAstroWaypointPickerWired`.

Comportamento **Usa**: solo `astroSetPosition("waypoint", …)` + `state.astro.source = "waypoint"`; **nessuna** modifica a `state.mapWaypoints`, `state.lastResult`, cronologia, permalink, `renderResults`. `runAstroPanelUI` continua a leggere `state.astro.lat` / `lon`.

**Esc:** `bindHotkeys` chiude il picker Astro con `stopImmediatePropagation` (come pick mappa); listener GIS `keydown` chiude il picker se aperto **prima** di altre modali, così il pannello `#astroPanel` non viene chiuso per errore. Chiusura pannello Astro: `closeAstroPanelCore` chiama anche `astroCloseWaypointPicker`. Ingresso map pick / cambio sorgente result/mapCenter: chiusura picker.

**i18n IT/EN/FR:** `astro.src.waypoint`, `astro.src.search`, `astro.src.use`, `astro.src.noWaypointsValid`, `astro.src.noPickerMatch`, `astro.picker.title`, `astro.notice.posFromWaypoint`.

## File modificato (locale, non in questo commit)

- **`coordinate_converter Claude.html`** — HTML/CSS/JS/i18n Step D (include modifiche cumulative Step B/C/fix già presenti nel working tree).

## Struttura waypoint rilevata

`state.mapWaypoints[]`: tipicamente `{ id, lat, lon, name, meta?, createdAt, updatedAt }` (`waypointAdd`). Picker: solo voci con `Number.isFinite(lat)` e `Number.isFinite(lon)`; colore riga opzionale da `meta.color` via `sanitizeTrackColor`.

## Non implementato (come da vincoli)

- Favorite chooser, Step E, WMM vendored, modifica SunCalc vendored, OLC/QR, OPSEC/geocoding/tile/IndexedDB, nuove chiavi `localStorage`, **«Mostra sulla mappa»** (dubbio / non richiesto: omesso, backlog esplicito).

## Test automatici (eseguiti)

- `git status --short`: solo `M coordinate_converter Claude.html`.
- `git diff --stat`: riportato in sessione.
- Nessun `<script src>`; nessun `type="module"`; **2** `<script>` / **2** `</script>`.
- `node --check` su **due** blocchi inline estratti con regex **non greedy** `<script>(.*?)</script>`: **OK** entrambi.
- `grep` marker Step D: presenti.

## Test browser

**Non eseguiti** in ambiente agente (nessun browser automatizzato). Checklist manuale: aprire GIS → waypoint validi → Strumenti → Astro → «Da waypoint…» → ricerca → Usa → verificare picker chiuso, pannello aperto, Calcola tabella; Esc con picker aperto / chiuso; result, mapCenter, mapPick, RR ancora coerenti.

## Motivo esclusione monolite dal commit memoria

Policy autosync + istruzioni utente: **monolite non committato** in questo intervento; commit/push **solo** `docs/orchestrator/**`.

## Prossimo passo

Smoke manuale Step D; poi Step E o **`finito`** a fine giornata se appropriato.
