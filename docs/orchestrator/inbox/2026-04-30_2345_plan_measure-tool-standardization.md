# Piano tecnico — Misura (GIS): allineamento agli standard UI/UX del progetto

**Data/ora file:** 2026-04-30 — piano solo documentazione (nessuna modifica al monolite in questa fase).

## Sintesi stato attuale (audit lettura codice)

### Dove vive Misura

| Layer | Posizione | Note |
|-------|-----------|------|
| **HTML** | `#sec-measure` (`data-tab-key="measure"`) dentro `#toolsDrawer` / hub GIS | Due layer: `.meas-gis-only` (solo `body.gis-mode`) e `.meas-classic-only` (homepage legacy con textarea `#meas-p1`/`#meas-p2`, `#btnMeasure`, direct `#btnDirect`). |
| **CSS** | ~L1596–2614, 3354–3361, `.measure-grid`, `#sec-measure` toggles GIS | Stili floating `.tile-measure-box`, `.tile-measure-row`, `.tmeas-btn`, `.measure-on` sulla mappa. |
| **JS — stato** | `state` (~12310–12323): `mapMeasureMode`, `mapMeasurePts`, `mapPolyPts`, `mapMeasureUnit`, `mapMeasureKind` (`line`|`poly`), `gisMeasureFlow` (`inverse2`|`direct`), `mapPolyClosed`, `mapMeasurePanelOpen`, `mapCursorLL` | Geometrie **transienti** (non serializzate come entità); in **`saveStore()` → settings** solo preferenze: `mapMeasureUnit`, `mapMeasureKind`, `mapPolyClosed` (~12919–12921). **`gisMeasureFlow` non** risulta nel payload persistito letto (solo RAM salvo re-idratazione futura). |
| **Overlay mappa** | `renderMapMeasureOverlay` → SVG `.tile-measure-overlay` in `.tile-layer` | Linea + frecce, poligono/chiusura, handle `.mm-handle`, etichette `addLabel` (midpoint linea / centroid poly). **pointer-events: auto** sull’SVG per drag/delete. |
| **Letture** | `updateMeasureReadouts`, `formatMapMeasureDistance`, `vincentyInverse`, `sphericalPolygonArea`, `computePolylinePerimeterMeters`, `mapUndoLastAction`, `mapUndoAvailable` | Undo condivide toolbar con traccia/waypoint (priorità misura). |
| **Toolbar mappa** | `renderTileMapControls` costruisce `tmeas-btn`, opzionale **`tile-measure-box`** | **Con `_gisHub` true:** box floating **non** viene renderizzato (`if (state.mapMeasurePanelOpen && !_gisHub)` ~26151); strumento Misura GIS è nel **drawer** tab Misura. Senza GIS: box sulla mappa come HUD classico. |
| **Hotkey / Esc** | `bindHotkeys` / `trackExitPickMode` / priorità tra modalità | Misura interagisce con `state.mapMeasureMode`; Esc chiude altre cose prima (dipende ordine); undo dedicato `data-role="map-undo"`. |
| **i18n** | `meas.*`, `map.measure*`, `tip.mapMeasure*` | Presenti IT/EN/FR per gran parte; hint lunghi inline anche come testo nella floating box. |

### Modalità supportate (funzionali)

1. **Linea:** due punti su mappa → distanza geodetica + azimuth (mil anche testo); modalità **direct** (`gisMeasureFlow`): origine + Vincenty diretto + punto finale draggabile (`syncGisDirectInputsFromMeasurePts`).
2. **Poligono:** vertici multipli, opzione chiusura (`mapPolyClosed`), perimetro + area sferica se chiuso ≥3 punti.
3. **Unità:** `formatMapMeasureDistance` — m, km, nm, mi, ft (coerente con select).
4. **Undo:** rimozione ultimo vertice (`mapUndoLastAction`), non storico multi-sessione.
5. **Clear / Exit:** pulsanti nella floating box (non-GIS) / logica toggle toolbar + `measure-exit` handlers (da verificare in binding).

### Interazioni con altri strumenti

- **Pan/zoom:** overlay ricalcolato con `renderTileMap` / `refreshTileMapForTrackUi` quando cambia vista (stesso pattern traccia).
- **Track / waypoint pick:** mutua esclusione tipica tramite `trackSyncPickModeUi`, `rangeRingsClearPickCenterMode` dove applicabile — **non** va alterato senza test regressione.
- **Range Rings:** armare RR può disarmare altre modalità; Misura armata richiede coordinamento Esc (già presente in catena).

### Cosa è già solido (toccare il meno possibile)

- Matematica **Vincenty** + overlay SVG con handle drag e contextmenu delete.
- **Dual UX** GIS (solo mappa nel drawer) vs classic paste (retrocompatibilità homepage).
- **i18n** base per stringhe misura mappa.
- Persistenza solo **preferenze** unità/tipo poligono, non geometrie.

### Incoerenze / gap rispetto agli standard progetto post–Range Rings

1. **Notifiche interne:** esiti e stati sono principalmente **testo singolo** (`gis-meas-drawer-out`, `measure-box-out`) — niente box dedicati errore/successo/modalità armata come `#rrOperativeNotices`.
2. **`alert`/`confirm`:** nessun uso specifico Misura emerso dalla ricerca mirata; restano pattern globali altrove — Misura non richiede conferme destroy salvo future “cancella storico”.
3. **Import/Export:** **nessun** export GeoJSON della misura corrente; session JSON generico potrebbe non includere geometria misura (verificare prima di promettere).
4. **Floating panel GIS:** Range Rings ha **pannello floating dedicato**; Misura GIS usa **solo drawer** — UX diversa (non sbagliata, ma da **decidere** se parificare con `measurePanel` floating opzionale).
5. **Gerarchia pulsanti:** nel drawer GIS i tab “Due punti / Proietta” e Calcola classico sono mix — revisione **primary** solo sull’azione principale del flusso attivo.
6. **Tabelle:** **non applicabile** oggi — non esiste lista di “misure salvate”; solo stato runtime.

---

## Piano incrementale (blocchi piccoli)

### M1 — Audit e isolamento stato Misura

- **Obiettivo:** documentare nel codice (commento breve in `state` o helper) cosa è transient vs persistito; verificare se `gisMeasureFlow` va salvato in `settings` per coerenza UX tra sessioni.
- **Regioni:** dichiarazione `state` (~12310), `saveStore` payload (~12917–12922), `loadStore` / sanitize settings.
- **Funzioni:** `saveStore`, lettura init settings, eventuale `sanitize…` se si aggiunge chiave.
- **Rischi:** basso; invalidare solo se chiavi nuove non sanificate.
- **Test:** ricarica pagina — unità e tipo line/poly coerenti; flow direct/inverse se persistito.
- **NON toccare:** geometrie altri tool, IndexedDB tile.

### M2 — UI pannello Misura (drawer) secondo standard

- **Obiettivo:** riallineare `#sec-measure` a gerarchia pulsanti (primary/secondary/danger), hints chiari, eventuale **header** coerente con altri tab GIS.
- **Regioni:** HTML `#sec-measure` (~7667+), CSS `#sec-measure` ~3359+, blocchi `.meas-gis-*`.
- **Funzioni:** listener tab `data-gis-meas-flow`, `data-gis-meas-kind`, wiring già in init (cercare `gis-meas`).
- **Rischi:** medio — regression su toggle GIS/classic.
- **Test:** switch tab Due punti / Proietta / line / poly; tema chiaro/scuro.
- **NON toccare:** sezione classic paste se non in scope del blocco.

### M3 — Notifiche interne e conferme

- **Obiettivo:** aggiungere area messaggi stile RR (`#measOperativeNotices` o reuse pattern) per errori parse direct/inverse, stato “modalità misura attiva”, chiaro messaggio se conflitto con altro tool (senza `alert`).
- **Regioni:** HTML dentro `#sec-measure .meas-gis-only`, CSS scoped, JS dove si validano input `gis-meas-dir-*`.
- **Funzioni:** `syncGisDirectInputsFromMeasurePts`, handler misura che oggi silenziano errori.
- **Rischi:** medio — non duplicare messaggi con `updateMeasureReadouts`.
- **Test:** input distanza/azimuth invalidi; switch modalità con punti già piazzati.
- **NON toccare:** conferme globali reset app.

### M4 — Lista / storico misure

- **Obiettivo:** **solo se** si decide di introdurre “misura come oggetto”. Default raccomandato: **non** nel primo sprint — Misura resta **strumento operativo volatile** come ora. Eventuale futuro: array transient max N in `state` **senza** persistenza, oppure export-only clipboard.
- **Regioni:** nuovo blocco HTML + stato opzionale.
- **Rischi:** alto se si persiste senza schema — **fuori** piano minimo.
- **NON toccare:** Range Rings store.

### M5 — Export (GeoJSON / CSV / clipboard)

- **Obiettivo:** export **file locale** della geometria corrente (LineString o Polygon GeoJSON **Feature**) coerente con §7 Import/Export; CSV opzionale due colonne lat/lon per vertice.
- **Regioni:** nuovo `<details>` o riga azioni in `.meas-gis-only`, handler file download (blob), no rete.
- **Funzioni:** nuovo `exportCurrentMeasureGeoJSON()`, lettura da `mapMeasurePts`/`mapPolyPts`.
- **Rischi:** basso se solo snapshot corrente; medio se si promette round-trip import.
- **Test:** linea 2 punti, poligono chiuso/aperto; OPSEC — nessuna rete.
- **NON toccare:** import GPX traccia.

### M6 — Polish overlay e leggibilità tema

- **Obiettivo:** etichette `addLabel` / `.mm-lbl-bg` allineate a **tema chiaro/scuro** (`var(--text)` / halo come RR); verificare contrasto su tile sat/OSM.
- **Regioni:** CSS per `.tile-measure-overlay`, fine `renderMapMeasureOverlay` (~15428+).
- **Funzioni:** `renderMapMeasureOverlay`, `addLabel` locale.
- **Rischi:** basso visivo; attenzione a `getBBox`/performance.
- **Test:** zoom estremi, dark mode, poligono grande.
- **NON toccare:** logica hit-test handle.

---

## Anomalie / decisioni aperte

1. **GIS:** floating `tile-measure-box` disattivato — va **documentato** come scelta UX (drawer unico) o ripristinato opzionale per parità Range Rings.
2. **`gisMeasureFlow`** potrebbe resettarsi a refresh — se fastidioso, persistere in settings (M1).
3. **`saveStore()` chiamato** su delete handle misura (~15574): verifica se necessario o legacy — micro-audit per evitare write superflue.

---

## QA piano (post-implementazione futura)

Per ogni blocco: smoke manuale GIS mode — Misura + pan/zoom + undo + Range Rings arm/disarm + Esc.

---

## File letti (analisi)

- `coordinate_converter Claude.html` (sezioni `#sec-measure`, `state`, `saveStore` settings misura, `renderMapMeasureOverlay`, `updateMeasureReadouts`, `renderTileMapControls` misura, CSS misura mappa).

---

## Prossimo passo consigliato (dopo approvazione)

Approvare ordine **M1 → M6** saltando **M4** salvo requisito esplicito storico misure.
