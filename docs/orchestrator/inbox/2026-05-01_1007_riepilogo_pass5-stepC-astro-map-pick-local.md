# Riepilogo — Pass 5 Step C Astro map pick (monolite locale)

**Data:** 2026-05-01 (timestamp inbox `1007`).  
**Ambito:** solo **Step C** — sorgente **mapPick** nel pannello Astro floating; **non** Step D/E, **non** waypoint/favorite, **non** «Mostra sulla mappa».

## Cosa è stato fatto

- **`#astroPanel`**: pulsante `data-astro-src="mapPick"` + **`#astroMapPickCancel`** (visibile solo in pick).
- **Stato:** `state.astroPickCenterMode`, `state.astro.pickMode`, `state.astro.source === "mapPick"` in fase di pick; snapshot **`state._astroPickSuspended`** per ripristino su Esc/Annulla; **`state._astroSkipNextGisPanelClose`** per evitare chiusura pannello sullo stesso Esc che annulla il pick.
- **Funzioni:** `astroEnterPickCenterMode`, `astroClearPickCenterMode`, `astroApplyPickedMapPoint`, `astroSyncMapPickCancelBtn`.
- **Disarm esplicito in `astroEnterPickCenterMode`:** `rangeRingsClearPickCenterMode()`, `trackExitPickMode()`, `mapMeasureMode` + punti misura azzerati, `mapPickMode` + UI tile-pick reset (stesso schema RR).
- **Click mappa (`attachPanHandlers` → `onUp`) — ordine ramo:** dopo track/waypoint pick e **prima** di `state.mapPickMode` (conversione), così il pick Astro non viene intercettato da `renderResults`.
- **Esc:** in `bindHotkeys` dopo Range Rings pick: annulla solo pick Astro; prima di `clearForm` in GIS con `#astroPanel` aperto: `preventDefault` + return così il secondo listener può chiudere il pannello; in listener GIS modali: se `_astroSkipNextGisPanelClose`, consuma flag e non chiude; altrimenti `closeAstroPanel`.
- **Chiusura pannello:** `closeAstroPanelCore` chiama `astroClearPickCenterMode("panelClose")`.
- **Cambio sorgente:** `astroSetSource` disarma pick con `sourceChange` senza notice «cancelled».
- **CSS:** `.tile-map.astro-pick-mode` crosshair (clone selettivo RR, senza modificare regole RR).
- **i18n IT/EN/FR:** `astro.src.mapPick`, `astro.src.mapPickCancel`, `astro.notice.pickActive`, `astro.notice.pickCancelled`, `astro.notice.posSet`.
- **`astroSyncPosUI`:** origine per `mapPick`.

## Cosa NON è stato implementato

- Waypoint chooser, Favorite chooser, «Mostra sulla mappa», Step D/E, WMM/SunCalc vendored, OLC/QR, OPSEC/geocoding/tile/IndexedDB, nuove chiavi `localStorage`, script esterni, ES modules.

## Vincoli rispettati

- Nessuna scrittura su **`state.lastResult`**, nessuna cronologia, nessun permalink, nessuna **`renderResults`** nel flusso pick Astro.
- Nessun GPS, nessuna rete aggiunta.

## File modificato (solo locale, non in commit memoria)

- **`coordinate_converter Claude.html`**

## Test automatici (eseguiti)

- `git status --short`: solo monolite modificato atteso.
- `grep` assenza `<script src>` e `type="module"`: OK.
- Conteggio `<script` / `</script>`: 2 / 2.
- **`node --check`** su **due** blocchi inline estratti con regex **non greedy**: entrambi exit 0.

## Test browser

- **Non eseguiti** in questa sessione (nessun browser automatizzato). Checklist manuale: aprire GIS → Strumenti → Astro → «Scegli sulla mappa» → cursore/notice → click mappa → posizione + Calcola → Esc annulla pick → Esc chiude pannello; verificare result/mapCenter, resize Astro, Range Rings.

## `git status` / commit

- Monolite **escluso** dal commit autosync (policy + richiesta utente: non committare/push monolite).
- Commit memoria previsto: **`docs: memoria Pass 5 Step C Astro map pick local`** (solo `docs/orchestrator/latest.md` + questo file inbox).

## Prossimo passo

- Review monolite locale; smoke Step C in browser; eventuale Step D o `finito` se previsto.
