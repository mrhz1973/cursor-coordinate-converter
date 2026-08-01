# MAP-CENTER-VIEWPORT-AWARE-A — Piano tecnico

**Stato task:** BACKLOG / NON APERTO (nessuna apertura runtime in questa sessione)  
**Gate sessione:** `MAP-CENTER-VIEWPORT-AWARE-A PLAN READY — RUNTIME NOT OPENED`  
**Data piano:** 2026-08-01  
**Tipo:** docs-only (diagnosi + pubblicazione)

---

## 1. Baseline

| Voce | Valore |
| --- | --- |
| HEAD documentale @ piano | `88d47db59f6ca8ea361b215fca6f540c21321cd3` |
| Runtime autorevole monolite | `3838e9ec57efa5ebdc977f88279b30928a47c851` |
| Blob monolite | `48abde6250c7f92dbc4f1650d5552ec3f8c921a0` |
| Byte LF | `3144095` |
| SHA-256 LF | `464eed94966acf4ae6ffa52f770c2669163765d6ec68dced04e3395f3284d0e5` |
| Build | `B6.2TPD-A · build 89` |
| Branch | `main` (HEAD = origin/main = ls-remote) |
| Workspace | pulito |
| Monolite in questo intervento | **non toccato** |

Nota autorità: `TRACK-PROFILE-POINTS-DISPLAY-A` è **CLOSED / PASS end-to-end**. Eventuali menzioni storiche «backlog» in sezioni obsolete **non** sono stato corrente e **non** vanno corrette qui.

---

## 2. Stato task

- **Nome:** MAP-CENTER-VIEWPORT-AWARE-A  
- **Stato vivo (OM §7):** BACKLOG / NON APERTO  
- **Obiettivo futuro:** centrare / adattare oggetti geografici rispetto alla porzione di mappa **realmente libera** (non coperta da pannelli flottanti), invece del solo centro geometrico di `#miniMap`.  
- **Questa sessione:** solo piano. Runtime **non** aperto.

---

## 3. Diagnosi mappa

### Comportamento attuale

1. La camera vive in `state.viewCenter` + `state.mapZoom`.
2. `renderTileMap` proietta i tile sul **box client completo** di `#miniMap` (`gisMapTileMathViewport` ≈ righe **34837–34847**).
3. I pannelli flottanti GIS **galleggiano sopra** la mappa: **non** riducono `clientWidth`/`clientHeight` del mount.
4. Header (~76px) e footer (`--gis-footer-reserve` via `syncGisFooterReserve`) riducono l’altezza di `#gisMapMount`, quindi **sono già** nel rettangolo mappa.
5. **Nessuna** logica esistente sottrae i rettangoli dei pannelli flottanti al centro/fit, salvo un padding **uniforme 12%** solo in `routingFitMapToRoutePreview` (**62122–62124**) — viewport-aware numerico, **non** panel-aware.
6. Non esiste un registro aggregato «pannelli aperti → rettangoli» per la camera. Esistono: `gPanelLayouts` (layout session/persist selettivo), `_gisMinimizedPanels` (solo minimizzati), flag `dlg.open` / feature flags per dialog.

### Implicazione

Il problema non è «manca un pad generico»: manca un **rettangolo utile misurato dal DOM** al momento di un’azione esplicita Center/Fit. Un pad fisso o una larghezza nominale di pannello **non** basta (pannelli trascinabili, ridimensionabili, parzialmente fuori viewport).

---

## 4. Contenitore canonico

| Nodo | Ruolo |
| --- | --- |
| `#gisMapMount` | Host full-bleed in `<main>` (GIS) |
| `#miniMap` | Radice mappa canonicamente interrogata da JS (`getElementById("miniMap")`); reparentata in `#gisMapMount` da `gisInit` |
| `.tile-map` | Viewport slippy (tile + overlay + `.tile-ctrls`) |

**Contratto futuro:** tutte le misure di «area utile» partono da `getBoundingClientRect()` di `#miniMap` (o del `.tile-map` interno se coincidente), **non** da `window` intero e **non** da larghezze hardcode dei pannelli.

---

## 5. Inventario occlusori

### A. Chrome già assorbito nell’altezza mount (non come “pannelli”)

| Elemento | Contribuisce all’occlusione flottante? | Note |
| --- | --- | --- |
| `<header>` + `#appTopbar` | No (già fuori/`inside` header) | Altezza mount già `100vh − 76px − footer` |
| `<footer>` + `--gis-footer-reserve` | No (già fuori) | `syncGisFooterReserve` |
| safe-area iOS | Parziale CSS | Solo layout chrome |

### B. Overlay in-map (non riducono W/H math)

| Elemento | Selettore / ID | Visibile se | Includere nel v1? |
| --- | --- | --- | --- |
| Controlli zoom/layer | `.tile-ctrls` | sempre in GIS | **No** (v1) — piccoli, angolo; rischio over-inset |
| Readout / scale | `.tile-readout`, `.tile-scale` | tipici | **No** (v1) |
| Offline float | `.tile-offline-float` | job/area offline | **No** (v1) — fuori scope primario |
| Overlay SVG (tracce, WP, routing) | gruppi SVG | dati | **No** — non occlusori UI |

### C. Pannelli flottanti GIS (occlusori primari)

Misura: `getBoundingClientRect()` se il dialog è **aperto** e non `display:none` / non minimizzato.

| Dialog / pannello | ID tipico | Drag | Resize | Minimize/dock | Persist layout |
| --- | --- | --- | --- | --- | --- |
| Tracce | `#trackModal` | sì | sì | sì | `track` / `gTrackModalLayout` |
| Waypoints | `#waypointModal` | sì | sì | sì | `waypoint` |
| Converti | `#convertModal` | sì | sì | sì | `convert` |
| Cerca | `#searchPanel` | sì | sì | sì | `search` |
| Preferiti | `#favoritesPanel` | sì | sì | sì | `favorites` |
| Layer / offline | `#layersPanel` | sì | sì | sì | `layers` |
| Misura | `#measurePanel` | sì | sì | sì | session |
| Workbench | `#gisWorkbenchPanel` | sì | sì | sì | session key |
| Range Rings | `#rangeRingsPanel` | sì | sì | sì (partial offscreen ammesso) | session |
| Poligoni | `#polygonPanel` | sì | sì | sì | session |
| Astro | `#astroPanel` | sì | sì | sì | session |
| Routing | `#routingPlannerPanel` | sì | sì | sì | session |
| Help GIS | `#helpOverlay` | sì | sì | sì | session |
| QR (GIS) | `#qrModal` | floating | — | — | — |

**Dock minimizzati** `#gisMinimizedDock`: chip sotto header. **v1:** includere solo se il dock interseca `#miniMap` con area significativa; altrimenti ignorare (altezza tipicamente fuori o marginale).

### D. Esclusi dal calcolo

| Categoria | Motivo |
| --- | --- |
| `display:none` / non `open` | non occludono |
| Minimizzati (solo in dock) | rettangolo dialog assente; dock gestito a parte |
| Toast / badge / tooltip | transitori, non Center |
| Backdrop modale nativo non-GIS | fuori percorso GIS primario |
| `visibility:hidden` con box residuale | trattare come non occlusore se area utile ≈ 0 o opacity 0 (fail-safe: solo elementi con area intersezione ≥ soglia, es. 24×24 px) |

### E. Registro canonico?

**Non esiste** un aggregatore «tutti i pannelli aperti → rect».  
`UI_PANEL_KEYS` e `gPanelLayouts` sono **layout**, non visibilità.  
**v1:** lista **whitelist di ID dialog** GIS noti + filtro `open` / `.gis-panel-floating` / `getBoundingClientRect` + intersezione con mappa. Non hardcode larghezze; solo ID strutturali già nel monolite.

---

## 6. Inventario call-site Center / Fit

### Helper camera condivisi

| Helper | Righe ≈ | Tipo | Note |
| --- | --- | --- | --- |
| `gisMapTileMathViewport` | 34837 | W×H math | full `#miniMap` |
| `tileMapPxToLatLon` / `tileMapLatLonToPx` | 34852+ | proiezione | origine = centro geometrico |
| `flyMapToTrackPoints` | 38314 | point o bounds (heuristica span→z) | **chiama `saveStore()`** oggi |
| `gisMapCenterOnLatLon` | 68399 | punto | zoom bump opzionale |
| `routingFitMapToRoutePreview` | 62082 | route | padFrac 0.12; Mercator |
| `flyToSavedTrackById` | 41137 | → flyMap | |
| `waypointsZoomTo` / `favoriteMapCenterTo` | 68425+ | → centerOn | |
| `polygonShowOnMapFromList` | 60381 | → flyMap | |
| `workbenchFlyToRow` | 65579 | dispatch | |
| `flyToRangeRingSetById` | 52733 | → flyMap | |
| `flyMiniMapToOfflineNamedAreaById` | 41393 | bbox | |

### Tabella call-site (sintesi operativa)

| Call-site | Helper | Target | Pannello tipico sopra | Viewport-aware v1? | Rischio |
| --- | --- | --- | --- | --- | --- |
| Saved Track ⌖ / ctx fly | `flyToSavedTrackById` | track | Track modal | **Sì** (via flyMap) | basso |
| Draft track «Centra» | `flyMapToTrackPoints` | track | Track modal | **Sì** | basso |
| Waypoint ⌖ | `waypointsZoomTo` | point | Waypoint modal | **Sì** (via centerOn) | basso |
| Preferiti ⌖ | `favoriteMapCenterTo` | point | Favorites | **Sì** | basso |
| Poligoni ⌖ | `polygonShowOnMapFromList` | polygon | Polygon panel | **Sì** | basso |
| Workbench ⌖ | `workbenchFlyToRow` | wp/track/poly | Workbench | **Sì** | basso |
| Range Rings ⌖ | `flyToRangeRingSetById` | rings | RR panel | **Sì** | medio (partial offscreen) |
| Offline area Centra | `flyMiniMapToOfflineNamedAreaById` | bbox | Layers | **Opzionale follow-up** | medio |
| Import `fitAcc` | `flyMapToTrackPoints` | track/other | variabile | **Sì collaterale** se si patcha flyMap | medio (auto-fit) |
| Routing success | `routingFitMapToRoutePreview` | route | Routing panel | **Follow-up B** | medio (già pad 12%) |
| `renderResults` / geocode | `renderMiniMap` | point | variabile | **No v1** | alto (pan inatteso) |
| GPS / dblclick / `.tile-recenter` | viewCenter diretto | point | — | **No v1** | alto / UX diversa |
| Astro/Convert «Centro mappa» | read-only `viewCenter` | — | — | N/A | — |
| Misura | nessun fly | — | Measure | N/A | — |

---

## 7. Confronto opzioni A / B / C / D

### Opzione A — Padding per bordi (edge insets)

Calcolare `padL/padR/padT/padB` dagli occlusori e usare il rettangolo interno.

| Pro | Contro |
| --- | --- |
| Semplice, prevedibile, allineato a Leaflet/Google padding | Con pannello **centrale** sottostima l’area libera laterale |
| Compatibile con pannelli ai bordi (caso GIS tipico) | Due pannelli opposti riducono molto il rettangolo |
| O(n) occlusori, stabile | — |

### Opzione B — Rettangolo libero massimo (max empty AA rect)

| Pro | Contro |
| --- | --- |
| Più preciso con pannello centrale | Complessità / edge cases; salti se due aree simili |
| — | Costo e manutenzione sproporzionati al caso reale |

### Opzione C — Centro visibile pesato

| Pro | Contro |
| --- | --- |
| Gestisce pannelli centrali | Poco spiegabile; fit W/H ancora da definire a parte |
| — | Instabile / difficile da QA |

### Opzione D — Solo CTA localizzate (no helper globale)

| Pro | Contro |
| --- | --- |
| Diff chirurgico per CTA | Duplicazione; incoerenza Workbench vs lista |
| — | Ogni nuovo Centra dimentica il pad |

---

## 8. Opzione raccomandata

**Ibrido A′ + integrazione negli helper condivisi (non D puro).**

1. **A′ (edge insets misurati):** per ogni occlusore che interseca `#miniMap`, aggiornare i quattro inset come **profondità massima dal bordo mappa più “economico”** (o regola nearest-edge documentata sotto), usando solo `getBoundingClientRect()` — **zero** larghezze nominali.
2. **Integrazione:** applicare il rettangolo utile dentro:
   - `gisMapCenterOnLatLon` (punto);
   - `flyMapToTrackPoints` (punto + bounds).
   Così tutte le CTA «Centra» / ⌖ che già passano da questi helper ereditano il comportamento **senza** patchare N call-site.
3. **Non** adottare B/C nel v1.
4. **Routing fit** e **offline fit**: scope **escluso dal primo runtime** (follow-up), così il diff resta limitato e il padFrac routing non si mescola senza collaudo dedicato.

### Regola inset A′ (algoritmo inset)

Per ogni intersezione `I = occluder ∩ mapRect` con area ≥ soglia:

- Calcolare le quattro «spinte»:  
  `fromL = I.right − map.left`, `fromR = map.right − I.left`,  
  `fromT = I.bottom − map.top`, `fromB = map.bottom − I.top`.
- Scegliere il bordo con **spinta minima** (rimuove meno area utile) e fare  
  `pad[bordo] = max(pad[bordo], spinta)`.
- Se il pannello è quasi a tutta mappa, la spinta minima può comunque lasciare un rettangolo piccolo → scatta il **fallback**.

Questa regola è deterministica, O(n), e si comporta bene con pannelli ancorati a un lato (caso dominante). Pannello perfettamente centrale: può lasciare strip sottili → fallback se sotto soglia (accettabile v1).

---

## 9. Algoritmo centro (punto singolo)

1. `mapRect = miniMap.getBoundingClientRect()`.
2. `usable = applyInsets(mapRect, pads)` → centro pixel `(ux, uy)` nel sistema client; convertire in pixel relativi al tile viewport:  
   `px = ux − mapRect.left`, `py = uy − mapRect.top`.
3. Target geografico `T = (lat, lon)`.
4. Strategia consigliata (riuso proiezione esistente, **niente** formule parallele):
   - Impostare temporaneamente `viewCenter = T` e zoom (bump esistente).
   - Proiettare `T` con `tileMapLatLonToPx` → tipicamente `(W/2, H/2)`.
   - Offset desiderato: il punto deve finire in `(ux_rel, uy_rel)` non in `(W/2, H/2)`.
   - Delta pixel: `dx = W/2 − ux_rel`, `dy = H/2 − uy_rel`.
   - Convertire il pixel `(W/2 + dx, H/2 + dy)` → nuovo centro con `tileMapPxToLatLon` **oppure** equivalenza: spostare `viewCenter` di modo che `T` cada su `(ux_rel, uy_rel)`.
5. `renderTileMap` una sola volta.
6. **Non** introdurre pan continuo / listener.

Se `usable` non valido → comportamento attuale (`viewCenter = T`, centro geometrico).

---

## 10. Algoritmo fit (bounds)

Per `flyMapToTrackPoints` multi-punto (v1 incluso perché helper condiviso):

1. Calcolare bounds geografici come oggi (unwrap antimeridiano `trackLonsUnwrapTransient` **invariato**).
2. Calcolare `availW = usable.width − 2·padMin`, `availH = usable.height − 2·padMin` (padMin estetico 8–12 px oltre insets UI).
3. Selezionare zoom:
   - **v1 pragmatico:** mantenere l’euristica span→z attuale, poi **ricentrare** il `viewCenter` con lo stesso offset del caso punto verso il centro geografico del bounds, verificando (opzionale) che i corner proiettati stiano in `usable`; se non stanno, decrementare z di 1 fino a maxZoom/minZoom / tentativi limitati.
   - **Non** riscrivere da zero il Mercator fit routing nel v1.
4. Preservare `clampBasemapFitZoom`.
5. Degeneri / 1 punto: ramo point già esistente + offset usable.

**Antimeridiano:** riuso unwrap esistente; offset solo in spazio pixel viewport dopo aver scelto `clon` normalizzato.

---

## 11. Fallback

| Condizione | Azione |
| --- | --- |
| Nessun occlusore / GIS non attivo / `#miniMap` assente | comportamento attuale |
| `usable.w < 120` **o** `usable.h < 120` | centro geometrico attuale |
| `usable.area < 0.18 · map.area` (soglia proposta) | centro geometrico attuale |
| Errore in misura DOM | catch → comportamento attuale |
| Punto/bounds non finiti | return early come oggi |

**Area utile minima (proposta vincolante per il futuro runtime):**  
`w ≥ 120 ∧ h ≥ 120 ∧ area ≥ 18% dell’area mappa`, altrimenti fail-safe.

---

## 12. Scope primo runtime

### Incluso (Scope raccomandato = «helper condivisi + CTA Centra ereditate»)

- Helper puri: query occlusori, insets, usable rect, offset centro.
- Patch: `gisMapCenterOnLatLon`, `flyMapToTrackPoints`.
- Effetto ereditato: waypoint, preferiti, saved track, draft track Centra, poligoni, workbench, range rings fly, **e** import `fitAcc` (stesso helper — accettato come collaterale documentato).
- Build bump (`APP_BUILD_ID` / `APP_BUILD_NUM`).
- Harness fuori repo per helper puri.

### Escluso (follow-up)

- `routingFitMapToRoutePreview` (padFrac dedicato; QA routing separata).
- `flyMiniMapToOfflineNamedAreaById` (opzionale Bundle successivo).
- `renderResults` / geocode / history auto-recenter.
- GPS, dblclick, `.tile-recenter`.
- Auto-pan durante drag/resize pannello.
- Preferenze persistite / nuove i18n (salvo necessità reale zero nel v1).
- Modifica CSS layout pannelli / dock.

### Split

Se in implementazione il diff supera **~150 righe** o tocca **>3 regioni distanti** oltre helper+due funzioni: split in  
**MAP-CENTER-VIEWPORT-AWARE-A** (solo `gisMapCenterOnLatLon`) + **…-B** (`flyMapToTrackPoints`).

---

## 13. Scope escluso (riepilogo)

Routing fit panel-aware; offline fit; auto-recenter conversione; inseguimento pannelli; Option B/C; stato globale persistito; listener continui; tocco a sanitizer/storage/rete/OPSEC/geometrie.

---

## 14. Lifecycle

| Evento | Ricalcolo area utile? | Muove la mappa? |
| --- | --- | --- |
| Click Centra / ⌖ / fit helper | **Sì** (on-demand) | Sì (azione utente) |
| Drag pannello in corso | No | **No** |
| Fine drag / resize | No (salvo nuovo Centra) | **No** |
| Minimize / restore / close | No automatico | **No** |
| Resize finestra | No automatico | **No** |
| Import fitAcc | Sì (via flyMap) | Sì (già oggi) |

**Preferenza vincolante:** calcolo **solo** al momento Center/Fit. Nessun polling. Nessun inseguimento silenzioso.

---

## 15. Accessibilità e UX

- Solo azioni esplicite (o fit già esistenti come import).
- Nessuna animazione obbligatoria nuova.
- Focus / reduced-motion: non peggiorare path esistenti.
- Touch/mouse invariati.
- Tema chiaro/scuro: irrilevante (solo geometria).
- Mobile stretto: fallback geometrico frequente → OK documentato.
- Zoom/pan manuale successivi: invariati.

---

## 16. Regioni autorizzabili (futuro runtime)

| Regione | Funzioni / zona | Righe ≈ | Ruolo |
| --- | --- | --- | --- |
| Nuovi helper puri (vicino viewport math) | `gisMapCollectFloatingOccluderRects`, `gisMapComputeEdgeInsets`, `gisMapUsableRect`, `gisMapOffsetViewCenterToUsablePixel` | ~34837+ | calcolo |
| `gisMapCenterOnLatLon` | 68399+ | integrazione punto | |
| `flyMapToTrackPoints` | 38314+ | integrazione point+bounds | |
| Build constants | `APP_BUILD_*` | ~21524 | bump |
| Whitelist ID | costante freeze vicino helper | — | solo ID dialog esistenti |

**Dipendenze ammesse:** `gisMapTileMathViewport`, `tileMapPxToLatLon`, `tileMapLatLonToPx`, `normalizeLon`, `clampBasemapFitZoom`, `trackLonsUnwrapTransient`, `trackLinePointsForMapRender`, `renderTileMap`.

**Vietato toccare:** drag/resize pannelli (`gisPanelAttach*`), `saveStore` schema, sanitizer, routing calculate, GraphHopper, tile fetch, GPS.

Nota: `flyMapToTrackPoints` **già** chiama `saveStore()` — il v1 **non** deve aggiungere persistenza nuova; può lasciare la chiamata com’è.

---

## 17. Aree vietate

Come da prompt §13: sanitizer, parser, import/export oltre call-site fit ereditato, storage schema, `saveStore` nuovi campi, IndexedDB, localStorage chiavi nuove, rete, provider, OPSEC, GraphHopper, tile cache, GPS, mutazione `state.mapWaypoints` / `savedTracks` / `gisPolygons` / `_routing`, geometrie, elevation addon, hover dispatcher, chart, drag marker, drag pannelli (salvo lettura layout/DOM).

---

## 18. Classificazione

**DELICATO leggero**

- Motivo: modifica helper **centrali** di camera (`gisMapCenterOnLatLon`, `flyMapToTrackPoints`) usati da molti percorsi; non tocca lifecycle drag/resize né storage nuovo.
- **Non** ROUTINE puro (impatto trasversale Centra).
- **Non** DELICATO pieno (niente stato globale persistito / niente drag).

| Voce | Valore |
| --- | --- |
| Review downstream | **Sì** (pre-deploy), da `raw@FULL_SHA` o sostitutiva GPT checklist |
| Stima diff monolite | **~90–130** righe (target ≤150; split se >) |
| Regioni | 2–3 (helper + centerOn + flyMap) + build |
| Soglia arresto | >150 righe **oppure** tocco non autorizzato a routing/renderResults/panel drag |
| Rollback | revert commit runtime; build bump rende evidente |
| QA browser | **Obbligatoria** (percezione centro libero) |

---

## 19. Review prevista

1. Review piano (questa) — pubblicata.  
2. Implementazione runtime futura → review **downstream** obbligatoria prima del deploy.  
3. Deploy GIS-only solo dopo review PASS.  
4. QA operatore minima narrativa + casi pannello L/R/centrale.

---

## 20. Stima diff

| Item | Stima |
| --- | --- |
| Helper puri + whitelist ID | 55–75 |
| Integrazione `gisMapCenterOnLatLon` | 10–20 |
| Integrazione `flyMapToTrackPoints` | 20–35 |
| Build bump | 4–8 |
| **Totale** | **~90–130** |

CSS/HTML: **0** previsti.

---

## 21. Soglia di arresto

Fermarsi e ripianificare se:

- serve Option B per passare QA;
- si deve patchare `renderResults` per coerenza;
- il fit bounds richiede riscrittura Mercator completa;
- emergono regressioni antimeridiano non risolvibili con offset post-heuristica;
- diff >150 senza split approvato.

---

## 22. Matrice test futura

1. Nessun pannello → equivalente all’attuale  
2–5. Pannello L/R/alto/basso  
6. Due pannelli lati opposti  
7. Pannello centrale → fallback o strip  
8. Parzialmente fuori mappa  
9. Minimizzato  
10. Nascosto / chiuso  
11. Dock  
12–13. Solo topbar/footer (già nel mount)  
14–16. Mobile portrait/landscape/stretto  
17–20. Punto; bounds piccoli/grandi/degeneri  
21. Antimeridiano  
22. Latitudini elevate  
23. maxZoom  
24. Pan/zoom manuale dopo Centra  
25. Apertura/chiusura senza auto-pan  
26–27. Drag/resize poi Centra  
28. Nessun movimento durante drag  
29–31. Waypoint / Saved Track / poligono  
32. Routing **solo se** incluso in follow-up  
33. Workbench  
34–36. Nessuna modifica dati / storage / fetch  
37. Nessun errore console  

---

## 23. Harness futuro (fuori repo)

File tipo `C:\tmp\map-center-viewport-harness.js`:

- stub rettangoli map + occlusori;
- assert insets / usable / fallback soglie;
- assert immutabilità input;
- **non** riscrivere proiezione: se si testa offset, mock di `tileMapPxToLatLon` / `tileMapLatLonToPx` oppure extract reale con stub minimi.

QA visuale **non** sostituibile dall’harness.

---

## 24. QA futura (operatore)

URL con `?v=<runtime-sha>` post-deploy.  
Narrativa minima: aprire Track/Workbench con pannello a sinistra → Centra oggetto → verificare che non resti sotto il pannello; chiudere pannello → Centra ≈ comportamento classico; drag pannello **senza** movimento mappa; poi Centra di nuovo.

Attesa: `QA MAP-CENTER-VIEWPORT-AWARE-A PASS operatore`.

---

## 25. Gate GO / NO-GO runtime

### GO se

- Si implementa **solo** A′ + helper condivisi come da §8–12;
- Diff ≤150 (o split A/B approvato);
- Aree vietate intatte;
- Review downstream PASS;
- Harness helper PASS;
- Fallback documentato attivo.

### NO-GO se

- Si propone B/C come v1 senza prototipo;
- Si aggiunge auto-pan su drag;
- Si tocca storage/rete/OPSEC;
- Si apre il task senza questo piano.

---

## Sintesi esecutiva

| Campo | Valore |
| --- | --- |
| Raccomandazione | **A′ edge-insets DOM + patch `gisMapCenterOnLatLon` / `flyMapToTrackPoints`** |
| Primo scope | CTA Centra/⌖ ereditate + fitAcc collaterale |
| Escluso v1 | Routing fit panel-aware, offline fit, auto-recenter convert, follow pannelli |
| Classificazione | **DELICATO leggero** |
| Review | Downstream obbligatoria |
| Task | **BACKLOG / NON APERTO** |
| Monolite | Invariato in questa sessione |

**MAP-CENTER-VIEWPORT-AWARE-A PLAN READY — RUNTIME NOT OPENED**
