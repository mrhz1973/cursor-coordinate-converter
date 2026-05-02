# Pass 6 Step 6E.3c — Misura floating standard (monolite solo locale)

**Data:** 2026-05-02  
**Scope:** `coordinate_converter Claude.html` modificato **solo in working tree** — **non incluso** nel commit memoria.

## Audit struttura Misura (prima dello step)

- Misura era la tab **`measure`**: `#sec-measure` veniva spostato in **`#tabDrawerBody`** da **`activateTab("measure")`**.
- Il drawer **`.tab-drawer`** ha **`z-index: 30`**; **`gisPanelBringToFront`** mantiene i pannelli floating operativi tra **24 e 29** (sotto il drawer). Risultato: Misura **restava sempre sopra** Traccia/Waypoint/Astro/RR/Preferiti/Mappe.

## Cause tecniche

| Problema | Causa |
|----------|--------|
| Misura sempre davanti | Contenuto nel tab drawer (z=30) sopra i `dialog.app-modal` (z-order 24–29). |
| Altri pannelli non tornavano davanti | Stesso stacking: bring-to-front JS non può superare il drawer. |
| Non draggable/resizable | Nessun wiring **`gisPanelAttachDrag` / `gisPanelAttachResize`** sul drawer. |

## Strategia applicata

- Nuovo **`<dialog id="measurePanel">`** (head, minimize, close, notice, body, 4 handle resize) — stesso pattern di Range Rings.
- **`gisMoveSectionTo("sec-measure", measurePanelBody)`** all’apertura; **`gisRestoreSection("sec-measure")`** alla chiusura reale.
- **`measure` escluso da `GIS_VALID_TABS`** (come `track` / `waypoints`): niente più flusso drawer per Misura.
- Apertura: **`openMeasureFloatingPanelGis()`**; toggle topbar / mappa: **`toggleMeasureFloatingPanelGis()`**; chiusura: **`closeMeasureFloatingPanelGis()`**.
- Stato runtime: **`state.measurePanelOpen`** (transiente, **non** in **`saveStore`**).
- Helper: **`_measurePanelLayoutOpts()`** con **`partialMinVisible: 72`**, **`wireMeasurePanelFloatingGis`**, **`clampMeasurePanelRect`** → **`gisPanelClampRectPartialVisible`**; **`measurePanel`** aggiunto all’array repack in **`gisPanelBringToFront`**.
- **Resize finestra:** branch su **`measurePanel`** nel listener esistente.
- **Esc:** chiusura Misura (ignora se minimizzata), coerente con altri floating.
- **`gisNavigateToolTarget`:** ramo **`tabKey === "measure"`** → **`openMeasureFloatingPanelGis()`**.
- **`activateTab` / `deactivateTab`:** ripristino pill topbar **Misura** se il pannello resta aperto mentre il drawer cambia tab (evita pill spenta a torto).
- **`prepareUiBeforeAppFullReset`:** **`closeMeasureFloatingPanelGis()`**.
- **CSS:** `#measurePanelBody > #sec-measure` come **`#trackModalBody > #sec-track`** (summary nascosto, body visibile).
- **i18n:** `gis.minimized.measure` (IT/EN/FR), `measurePanel.minimizeBlockedSubdialog` (rete di sicurezza; blocco minimizza non usato: nessun sub-dialog modale su Misura).

## Checklist esiti (sì/no)

| Voce | Esito |
|------|--------|
| Misura floating standard | **Sì** |
| Draggable | **Sì** |
| Resizable | **Sì** |
| Partial-offscreen (72px) | **Sì** |
| Bring-to-front / z-order con altri pannelli | **Sì** |
| Altri pannelli possono tornare davanti a Misura | **Sì** |
| Misura + Traccia coesistenza (6E.3b mantenuto) | **Sì** (nessun gate aggiunto che chiuda Traccia all’apertura Misura) |
| Misura + Waypoint/Astro/RR/Preferiti/Mappe | **Sì** (coesistenza floating) |
| Minimizza Misura implementato | **Sì** (nessun picker/confirm modale interno; export resta `<details>`) |
| UI header coerente | **Sì** (app-modal-head / minimize / close) |

## Regola operativa futura (vincolo)

> Ogni nuovo pannello/modal GIS deve essere progettato fin dall’inizio con lo standard floating già usato dagli altri pannelli: draggable, resizable, partial-offscreen, bring-to-front, z-index non bloccante, Esc/focus coerenti, notice coerenti e, se sicuro, minimizza/dock standard. **Non va richiesto di nuovo dall’utente per ogni pannello.**

## Vincoli rispettati

- **Non toccati:** GPS (`requestGisMapCurrentLocation`, `_gisMapGpsFixTransient`, logica acquisizione), **`#convertModal`**, **`state.lastResult`**, **`state.mapWaypoints`**, **`state.favorites`**, **`state.savedTracks`**, schema persistenza / nessuna nuova chiave `localStorage`, OPSEC/geocoding/tile/IndexedDB, calcolo/geometrie/export Misura (solo contenitore + navigazione).
- **Non implementato:** 6F.1 (Converti → waypoint), rimozione Preferiti da Waypoint, `finito`, commit monolite, `git add .`.

## QA automatica (eseguita in Cursor)

- `git status --short`: atteso **`M coordinate_converter Claude.html`** (oltre a `docs/orchestrator/**` dopo commit).
- `git diff --stat`: vedi shell sessione (~544 insertions, ~120 deletions sul monolite).
- Nessun `<script src>`; nessun `type="module"`.
- Conteggio `<script>` / `</script>`: **2 / 2**.
- `node --check`: blocchi **9799–9925** (SunCalc) e **9929–41708** (app) — **OK**.
- Diff baseline `/tmp/goi-gis-before-6E3c.html` filtrato su token vietati: solo occorrenze contestuali (commenti / elenco id / `favoritesPanel` vicino a diff) — **nessuna modifica funzionale** a GPS/Converti/dati persistiti.

## Test browser

**Non eseguiti** in questa sessione (nessun browser automatizzato). Checklist manuale consigliata: apri Misura → drag/resize/partial offscreen; apri Traccia poi clic Misura / Traccia per z-order; Esc con Misura aperta; minimizza → chip dock → ripristino; coesistenza Misura + RR/Astro/WP.

## Prossimo passo consigliato

**Pass 6 Step 6F.1** — Converti → aggiungi waypoint diretto + Waypoint → rimuovi Preferiti con conferma in-pannello.

## Monolite

**`coordinate_converter Claude.html`:** modificato **solo localmente**; **escluso** dal commit memoria orchestratore.
