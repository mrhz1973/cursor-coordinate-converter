# Pass 6 Step 6C.2 — polish Traccia + GPS visual (monolite locale)

**Data:** 2026-05-01  
**File:** `coordinate_converter Claude.html` (solo working tree; **non** nel commit memoria).

## 1. Feedback hover desktop (tracce salvate)

- **Sì:** CSS su `#savedTracksMount .saved-tracks-table tbody tr[data-saved-row]` — evidenziazione hover/focus-within + hint **`::after`** con **`data-saved-hint`** (testo da **`track.savedRowCtxHint`**, IT/EN/FR).
- Ritardo apparizione hint **~0,42 s**; **non** apre il menu contestuale da solo; tasto destro / long-press touch invariati.

## 2. Collegamento F → I / “chiusura” traccia

- **Causa (rendering):** con traccia **aperta** (`closed === false`) ma **ultimo vertice duplicato del primo** (dati/import), la **polyline** disegnava comunque il segmento finale che coincide con la chiusura visiva I↔F.
- **Fix:** helper **`trackLinePointsForMapRender(pts, closed)`** — se primo e ultimo punto hanno le stesse coordinate: su **aperta** con ≥3 punti si omette l’ultimo duplicato per la sola geometria disegnata; su **chiusa** con ≥4 punti si omette il duplicato di chiusura esplicito. Applicato in **`renderTrackOverlay`** e **`renderSavedTracksOverlays`**.
- **Non** modificato schema `savedTracks` / punti in memoria.

## 3. Doppio «Aggiorna traccia»

- **Causa:** con **`state._trackPromptOpen`** (banner completamento), il pulsante in **`#track-completion-prompt`** e quello in **`#track-points-head`** (`data-role="track-save-current"`) mostravano entrambi **`track.updateLibrary`** in modifica archivio.
- **Fix:** con **`canSave && state._trackPromptOpen`**, il pulsante **`track-save-current`** nell’head resta **nascosto/disabilitato**; resta il CTA nel prompt (o viceversa un solo punto di salvataggio visibile).

## 4. GPS mappa — marker + accuratezza

- **Sì:** variabile runtime **`_gisMapGpsFixTransient`** `{ lat, lon, accM }` (non persistita).
- **`renderGisMapGpsOverlay`**: cerchio accuratezza (raggio da **`coords.accuracy`** in px via scala Web Mercator approssimata), anello “pulse” leggero, **dot** centrale blu; chiamata da **`renderTileMap`** dopo Range Rings.
- **`requestGisMapCurrentLocation`:** imposta transient + badge con **`geo.mapCenteredGps`** e opz. **`geo.gpsMapAccuracyBadge`**; **rimosso `saveStore()`** in questo handler per allineamento al vincolo «non modificare persistenza» in 6C.2 (il centro mappa non viene più scritto in `localStorage` solo da questo click).
- **Solo `getCurrentPosition`**; nessun **`watchPosition`**; nessun **`lastResult`** / `renderResults`.

## 5. QA automatico

- `node --check` sul blocco core **9436–40016**: **OK**.
- Nessun `<script src>` / `type="module"`.

## 6. Test browser

- **Non eseguiti** in Cursor; checklist Task 7 del prompt.

## 7. Non implementato / backlog

- Step **6D** globale; **`finito`**; commit monolite.

## 8. Commit memoria

- Messaggio: **`docs: memoria Pass 6 Step 6C2 traccia gps polish local`**
- Solo `docs/orchestrator/latest.md` + questo inbox; **monolite escluso**.
