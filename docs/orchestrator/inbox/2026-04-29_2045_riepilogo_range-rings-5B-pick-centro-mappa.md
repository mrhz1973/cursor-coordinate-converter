# Riepilogo intervento — Range Rings 5B (pick centro su mappa)

**Data:** 2026-04-29  
**File monolite:** `coordinate_converter Claude.html` (modifiche locali; **non** incluso in commit autosync orchestratore).

## Obiettivo

- Consentire di impostare il centro dei Range Rings con un click/tap sulla mappa, **senza** creare automaticamente gli anelli (l’utente usa poi «Crea anelli»).
- Mantenere le modalità centro esistenti: punto convertito, waypoint, centro mappa.
- Stato transiente, non persistito; niente GPS, niente rete.

## Stati / funzioni aggiunte

- `state.rangeRingsPickCenterMode` (boolean, transiente).
- `state._rangeRingsMapPickCenter` (`{ lat, lon } | null`, transiente).
- `rangeRingsClearPickCenterMode(opts)` — azzera modalità pick; opzione `clearMapCenter` per svuotare anche il punto salvato.
- `rangeRingsEnterPickCenterMode()` — disattiva pick incompatibili (`trackExitPickMode`), disattiva `mapPickMode` + UI tile pick, imposta `rrCenterMode` su `picked`, attiva pick e aggiorna pannello/mappa.

## UI

- Opzione `<select id="rrCenterMode" value="picked">` con i18n `rangeRings.center.mapPicked`.
- Pulsante `#rrPickMapBtn` + `#rrPickMapStatus` (testo di stato / centro scelto).
- CSS `.tile-map.range-rings-pick-mode` (crosshair, allineato al pattern esistente).

## Click mappa

- In `attachPanHandlers` → `onUp`, **dopo** il ramo `mapPickMode` e **prima** della misura: se `rangeRingsPickCenterMode` e click senza drag, `mapClientToLatLonMap(root, lat, lon, zPick, cx, cy)` come per track/waypoint; salva in `_rangeRingsMapPickCenter`, disattiva pick, `preventDefault` / `stopPropagation` se coerente.

## Conflitti pick mode

- Ingresso pick RR: `trackExitPickMode()` + disattivazione map pick tile.
- Uscita / esclusione RR pick: `trackTogglePickMode`, `trackToggleWaypointPickMode`, `startWaypointNewWaypointFlow`, ramo `track.pickMode = true` in `trackAddPoint`, `resumeTrackEditing`, `beginEditSavedTrackById`, click tile map pick (quando si attiva), `openWaypointModal`, `openTrackModal`, `activateTab`, `closeRangeRingsPanel`, `prepareUiBeforeAppFullReset` (doppio clear difensivo).

## Centro da UI / creazione set

- `rrGetCenterFromUi()`: ramo `picked` → `_rangeRingsMapPickCenter` validato.
- `rrCreateFromUi()`: se modalità `picked` e centro assente → `rangeRings.err.mapCenterMissing`; altrimenti flusso sanitize/save invariato.

## Esc / chiusura

- `bindHotkeys` (Escape): se `rangeRingsPickCenterMode`, clear + `renderRangeRingsPanel` + refresh mappa.
- `closeRangeRingsPanel`: clear pick all’inizio (anche se il dialog non risultava «aperto» nello stato, per coerenza reset).

## i18n (IT / EN / FR)

Chiavi `rangeRings.*`: `pickMap`, `pickMapTip`, `pickMapActive`, `pickMapSet`, `center.mapPicked`, `err.mapCenterMissing`; hint `rangeRings.hint` aggiornato (rimosso «no map click»).

## Test browser (manuale)

1. GIS → mappa → Rings → pannello floating.  
2. «Punta sulla mappa» / Pick on map → cursore crosshair.  
3. Clic su mappa → stato «centro scelto» + coordinate; non compaiono waypoint/traccia.  
4. Preset 100/250/500 m → «Crea anelli» → anelli sul punto.  
5. Esc durante pick → modalità annullata.  
6. Chiudi pannello durante pick → pick annullato (`closeRangeRingsPanel`).  
7. Dopo uso: Track/Waypoint/Measure ancora utilizzabili.  
8. Export selezionati Range Rings invariato nel flusso.

## QA tecnico (locale)

- `git diff --check -- coordinate_converter Claude.html`: ok  
- Estrazione script inline + `node --check`: ok  
- `git diff --stat` vs HEAD: include anche modifiche monolite già presenti in working tree rispetto all’ultimo commit (non solo 5B).

## Prossimo passo consigliato

- Commit monolite quando l’utente lo richiede (non parte di questo autosync).  
- Eventuale 5C: preview live / edit set (fuori scope 5B).
