# Pass 6 Step 6F.1a — Visibilità pulsante «Aggiungi waypoint» nel Converti (monolite locale)

**Data:** 2026-05-02 (`1327` locale).  
**Monolite:** `coordinate_converter Claude.html` — **non** incluso nel commit memoria (policy default).

## Causa pulsante non percepito come visibile

- **`#btnAddResultToWaypoint`** e **`#btnAddResultToFavorites`** erano in coda alla **`.results-col`**, **dopo** la griglia **`#results`** (contenuto molto alto dopo una conversione).
- Nel pannello **Converti GIS**, **`gisPanelSyncBodySize`** imposta **`max-height` + `overflow-y: auto`** su **`#convertModalBody`**: l’utente doveva **scorrere in fondo** alla colonna risultati per vedere la riga azioni — in smoke è stato interpretato come «pulsante assente».

## Fix applicato (solo layout DOM + CSS scoped Converti)

1. **DOM:** nuovo contenitore **`.convert-cm-primary-actions`** (classe **`actions`**) **subito sotto** **`.results-head`**, **prima** di **`#results`**, contenente solo i due pulsanti con **id invariati** (`#btnAddResultToWaypoint`, `#btnAddResultToFavorites`).
2. **`#convertWaypointFeedback`** spostato **sotto** quella riga e **sopra** **`#results`** (sempre visibile senza scroll oltre l’intestazione).
3. **`.convert-cm-actions-row`:** rimangono Copia / QR / export / ★ rapida (nessun id duplicato).
4. **CSS (`#convertModalBody`…):** stile pulsanti secondari allineato alla precedente **`.convert-cm-actions-row`** anche per **`.convert-cm-primary-actions`**; commento marker **`6F.1a`**.

## Checklist richiesta (sì/no)

| Voce | Esito |
|------|--------|
| Pulsante dentro Converti visibile (senza scroll profondo) | **Sì** (posizione sotto titolo Risultati) |
| Posizione / layout | Riga primaria sopra **`#results`**; riga secondaria export invariata sotto risultati |
| Disabled / enabled | **Invariato** — **`syncConvertResultWaypointBtn`** / **`renderResults`** / **`openConvertModal`** non modificati in questo step |
| Click → flusso esistente | **Sì** — stessi **id**, stessi listener init |
| Feedback `#convertWaypointFeedback` | **Sì** — nodo spostato, **id** invariato; **`setConvertWaypointFeedback`** invariato |
| Aggiunta waypoint da Converti | **Non regressa** (nessuna modifica a `waypointAddFromConvertedPoint` / parser / `state.lastResult` scrittura) |
| Waypoint → rimuovi Preferiti (6F.1) | **Non toccato** in questo step |
| GPS / Misura / RR / Traccia / OPSEC / tile / geocoding / IndexedDB | **Non toccati** (diff baseline `/tmp/goi-gis-before-6F1a.html` senza match su token campione del prompt) |

## QA automatica

- **`git status --short`:** solo `M coordinate_converter Claude.html` (prima del commit memoria).
- **`<script src>` / `type="module"`:** assenti.
- **Conteggio `<script>` / `</script>`:** **2 / 2**.
- **`node --check`:** OK su blocchi **9869–9995** e **9999–41939** (range post-edit).
- **Test browser:** **non eseguiti** in questa sessione.

## Commit memoria

**Hash:** `8078b9f` (memoria step) + `389b096` (hash in `latest`/inbox).  
File: `docs/orchestrator/latest.md`, questo inbox. **Push:** `main` aggiornato.  
**Esclusi:** monolite, `/tmp/goi-gis-before-6F1a.html`.
