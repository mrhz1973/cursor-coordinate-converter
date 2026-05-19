# Fix: waypoint double-click save non funzionava

**Data:** 2026-05-19 13:09  
**Commit base:** d125924 (feat: improve waypoint map pick UX)  
**File modificato:** `coordinate_converter Claude.html`

---

## QA failure utente

- Apertura pannello Waypoint → pick mode attivo automaticamente ✓
- Doppio click sulla mappa → **nessun salvataggio, nessun avanzamento** ✗

---

## Root cause

`gisMapOnDblClickCenter` è registrato sul nodo `#miniMap` (capture=true) ma non riceve mai il dblclick perché:

1. Il primo click (`onUp`) chiama `renderTileMap()` (o `refreshTileMapForTrackUi()`) che **sostituisce l'intero inner HTML di `.tile-map`**.
2. Il secondo click (mousedown) avviene sul nuovo DOM. Il suo `onUp` chiama di nuovo `renderTileMap()` / `refreshTileMapForTrackUi()`.
3. Il browser emette il dblclick **dopo** il secondo renderTileMap. A quel punto `ev.target` punta a un elemento ora **staccato dal documento**.
4. Nel handler: `root.contains(ev.target)` → **false** per nodi detached → early return → nessuna azione.

In aggiunta, anche se il dblclick raggiungesse il handler, esso controlla `state.waypointEditorDraft.lat/lon` che è `NaN` dopo `startWaypointNewWaypointFlow()` (chiamato all'apertura del pannello). L'editor draft con coordinate valide viene impostato solo dal primo click (`onUp`), ma a quel punto il DOM è già stato ri-renderizzato e il dblclick è già compromesso.

---

## Fix applicato

**File:** `coordinate_converter Claude.html` (interno a `attachPanHandlers` → closure `onUp`)

Invece di dipendere dall'evento `dblclick` del browser (inaffidabile dopo re-render del DOM), il secondo click rapido viene rilevato **dentro `onUp`** tramite un timestamp su `state`.

**Logica inserita prima del codice di first-click draft:**

```js
const _wpNow = Date.now();
if (state._waypointLastPickMs && (_wpNow - state._waypointLastPickMs) < 400){
  // Secondo click rapido → commit waypoint
  state._waypointLastPickMs = 0;
  const _wd = state.waypointEditorDraft;
  if (_wd && Number.isFinite(_wd.lat) && Number.isFinite(_wd.lon)){
    // Modalità modale: editor draft valido → commitWaypointEditor
    if (typeof commitWaypointEditor === "function") commitWaypointEditor();
  } else {
    // Modalità inline tile-map: usa trackWaypointDraft o coordinate evento
    const _wt = state.trackWaypointDraft;
    const _wlat = (_wt && Number.isFinite(_wt.lat)) ? _wt.lat : pick.lat;
    const _wlon = (_wt && Number.isFinite(_wt.lon)) ? _wt.lon : pick.lon;
    const _wnm = (typeof t === "function" ? (t("track.waypointDefaultName") || "Waypoint") : "Waypoint");
    if (typeof waypointAdd === "function") waypointAdd(_wlat, normalizeLon(_wlon), _wnm, { from: "waypoint-map-pick", icon: "hq", color: "#2563eb" });
    state.trackWaypointDraft = null;
  }
  if (typeof startWaypointNewWaypointFlow === "function") startWaypointNewWaypointFlow();
  if (ev.cancelable) ev.preventDefault();
  try { ev.stopPropagation(); } catch(_){}
  return;
}
state._waypointLastPickMs = _wpNow;
// ... first-click draft logic unchanged ...
```

`state._waypointLastPickMs` è su `state` (non persistito nel `saveStore` perché prefissato `_`), quindi sopravvive ai re-render di `renderTileMap`.

**Soglia:** 400 ms (compatibile con doppio click standard; superiore al debounce fisico, inferiore a un secondo click lento).

---

## File modificati

- `coordinate_converter Claude.html` — `attachPanHandlers` → `onUp` → branch `waypointPickMode`
- `docs/orchestrator/latest.md` — aggiornato
- `docs/orchestrator/inbox/2026-05-19_1309_fix-waypoint-double-click-save.md` — questo file

---

## Controlli statici

| Check | Risultato |
|---|---|
| `git diff --check` | PASS (nessun whitespace error) |
| `<script>` count | 2 |
| `</script>` count | 2 (bilanciato) |
| `<script src` | assente |
| `type="module"` | assente |
| `node --check` | NOT EXECUTED (node non disponibile nell'environment) |

---

## QA manuale pending (checklist per l'utente)

1. Apri pannello Waypoint → conferma pick mode attivo automaticamente (cursore copy, hint)
2. Doppio click sulla mappa → waypoint salvato nella lista con nome default
3. App rimane in pick mode per il prossimo waypoint (no uscita manuale necessaria)
4. Aggiungi secondo waypoint con altro doppio click → appare nella lista
5. Singolo click → pin bozza compare, editor aperto → comportamento draft invariato
6. Cancel sull'editor draft → nessun waypoint aggiunto
7. Delete waypoint selezionato → funziona ancora (conferma interna)
8. Batch "Aggiungi selezionati ai Preferiti" → funziona
9. Converti → "Aggiungi waypoint" → funziona
10. Console browser → nessun errore JS

---

## Rischi

- **Basso:** La soglia 400 ms potrebbe essere troppo corta su sistemi molto lenti (mouse down→up lento). In tal caso aumentarla a 500 ms.
- **Basso:** Se `startWaypointNewWaypointFlow` fallisce dopo `commitWaypointEditor`, il pick mode non si re-entra. Il blocco `try/catch` nel commit originale gestisce già questo caso.
- **Nullo:** Nessun impatto su track pick, mapPickMode, astroPickCenterMode, rangeRings, bbox, GPS, misura.

---

## Raccomandazione successiva

Browser QA manuale (checklist sopra). Se tutto passa → nessun altro intervento necessario su questo flusso.
