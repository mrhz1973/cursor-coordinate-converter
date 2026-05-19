# Fix: map click → nuovo waypoint (draft pin assente)

**Data:** 2026-05-19 11:30 locale  
**Eseguito da:** Claude Code (claude-sonnet-4-6) — modalità IMPLEMENTER/DEBUG  
**Repo:** mrhz1973/cursor-coordinate-converter  
**Branch:** main  
**Base commit:** e821858

---

## Summary

| Voce | Risultato |
|---|---|
| Bug segnalato | Clic su «Nuovo waypoint» → clic sulla mappa → **nessun feedback visivo sulla mappa** |
| Root cause | In `onUp` (branch `waypointsModalOpen=true`): `state.trackWaypointDraft` azzerato prima del re-render → pin bozza non appariva |
| File modificato | `coordinate_converter Claude.html` |
| Righe toccate | 28971, 29910–29913, 40129–40130 |
| Script count | 2 / 2 |
| No src | PASS |
| No type=module | PASS |
| node --check | NOT EXECUTED (node non in PATH) |
| Risultato | **FIX APPLICATO (static PASS)** — browser QA pending |

---

## Root cause analysis

Flusso pre-fix quando l'utente clicca la mappa con `waypointPickMode=true` e `waypointsModalOpen=true`:

```javascript
// onUp handler — branch modale (PRIMA del fix)
state.trackWaypointDraft = { lat: pick.lat, lon: pick.lon, ... };
// ... waypointsModalOpen=true:
state.trackWaypointDraft = null;          // ← azzerato immediatamente
openWaypointEditor({ fromDraft: true });  // riempie campo coord nel pannello
return;                                   // nessun re-render mappa
```

Conseguenza: il campo coord veniva riempito nel pannello flottante (effetto corretto), ma **nessun pin bozza compariva sulla mappa** — l'utente guardava la mappa e non vedeva nulla.

Nel branch non-modale (`waypointsModalOpen=false`) il pin bozza compariva correttamente perché `renderTileMap` era chiamato con `trackWaypointDraft` ancora valido.

Ulteriore problema: se `trackWaypointDraft` fosse rimasto valorizzato senza modifiche a `renderTileMap`, sarebbe comparsa la box `.tile-waypoint-editor` (editor su mappa) in conflitto con l'editor modale `#waypointEditor`.

---

## Fix (3 modifiche minime)

### 1. `renderTileMap` — sopprime `.tile-waypoint-editor` quando il modale è aperto (riga 28971)

```javascript
// PRIMA
const showWp = draft && Number.isFinite(draft.lat) && Number.isFinite(draft.lon);
// DOPO
const showWp = draft && Number.isFinite(draft.lat) && Number.isFinite(draft.lon) && !state.waypointsModalOpen;
```

Effetto: quando il pannello Waypoint è aperto, viene mostrato solo il **pin bozza** (`.tile-marker.tile-marker-draft`) ma NON la box editor su mappa (`.tile-waypoint-editor`). In modalità non-modale, comportamento invariato.

### 2. `onUp` handler — mantiene `trackWaypointDraft`, aggiunge `refreshTileMapForTrackUi` (riga 29910)

```javascript
// PRIMA
state.trackWaypointDraft = null;
if (typeof openWaypointEditor === "function"){
  openWaypointEditor({ fromDraft: true });
}
return;

// DOPO
if (typeof openWaypointEditor === "function"){
  openWaypointEditor({ fromDraft: true });
}
if (typeof refreshTileMapForTrackUi === "function") refreshTileMapForTrackUi();
return;
```

Effetto: `state.trackWaypointDraft` rimane valorizzato con le coordinate del click → `refreshTileMapForTrackUi` ri-renderizza la mappa → il **pin bozza** appare nel punto cliccato.

### 3. `closeWaypointEditor` — pulisce `trackWaypointDraft` alla chiusura (riga 40130)

```javascript
// AGGIUNTO prima del blocco if (wasNew && state.waypointPickMode)
state.trackWaypointDraft = null;
```

Effetto: quando l'utente annulla o salva il waypoint, il pin bozza viene rimosso dal rendering successivo (già garantito da `refreshTileMapForTrackUi` chiamato nel blocco `wasNew && pickMode`).

---

## Static checks post-fix

```powershell
# Script count
((Select-String -Path "coordinate_converter Claude.html" -Pattern '<script' -AllMatches).Matches).Count
# → 2 ✓

((Select-String -Path "coordinate_converter Claude.html" -Pattern '</script>' -AllMatches).Matches).Count
# → 2 ✓

# No src
((Select-String -Path "coordinate_converter Claude.html" -Pattern '<script[^>]*src' -AllMatches).Matches).Count
# → 0 ✓

# No module
((Select-String -Path "coordinate_converter Claude.html" -Pattern 'type="module"' -AllMatches).Matches).Count
# → 0 ✓
```

### node --check

NOT EXECUTED — `node` non presente in PATH su questo workstation Windows 10.

---

## Browser QA (checklist manuale pending)

- [ ] Aprire `coordinate_converter Claude.html` con server locale (`python -m http.server 8000`)
- [ ] Aprire pannello Waypoint (icona mappa → Waypoint)
- [ ] Verificare: `state.waypointsModalOpen = true`
- [ ] Cliccare «Nuovo waypoint»
- [ ] Verificare: cursore mappa cambia in `copy`, hint compare
- [ ] Verificare: editor aperto con campo coord vuoto
- [ ] Cliccare un punto sulla mappa (fuori dal pannello)
- [ ] Verificare: **pin bozza** (marker colorato) appare nel punto cliccato ← **FIX principale**
- [ ] Verificare: campo coord nell'editor riempito con le coordinate del punto
- [ ] Verificare: **NO** box `.tile-waypoint-editor` sulla mappa (solo il pin, non il form su mappa)
- [ ] Compilare nome, cliccare Salva → waypoint aggiunto alla lista
- [ ] Verificare: pin bozza sparisce dopo salvataggio
- [ ] Verificare: cursore mappa torna normale (no più `copy`)
- [ ] Cliccare di nuovo «Nuovo waypoint» → cliccare mappa → cliccare Annulla
- [ ] Verificare: pin bozza sparisce dopo annullamento
- [ ] Verificare: flusso delete singolo waypoint ancora funzionante
- [ ] Verificare: flusso delete selezionati (6F.3) ancora funzionante
- [ ] Verificare: console browser senza errori

---

## Regression checks (statici)

| Funzione | Stato |
|---|---|
| Pin bozza su click mappa (modal mode) | FIX applicato ✓ |
| `.tile-waypoint-editor` non compare in modal mode | FIX applicato ✓ |
| `.tile-waypoint-editor` compare in non-modal mode | Invariato ✓ |
| Pin bozza rimosso dopo salva/annulla | FIX applicato ✓ |
| 6F.3 delete selezionati | Non toccato ✓ |
| GPS / Traccia / Misura / RR | Non toccati ✓ |

---

## Next recommendation

Eseguire browser QA manuale (checklist sopra). Se PASS:

- Prossimo Tier 1: **CoT XML import/export waypoints** o **compound polygon dedicated**.
