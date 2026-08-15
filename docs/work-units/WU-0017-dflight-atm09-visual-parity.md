# WU-0017 — D-FLIGHT-ATM09-VISUAL-PARITY

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN
**ACTIVE BLOCK:** D-FLIGHT-ATM09-VISUAL-PARITY-AUDIT-A (AUDIT COMPLETE · GATE BLOCKED)
**CURRENT GATE:** **OFFICIAL VISUAL REFERENCE REQUIRED**
**RUNTIME BASELINE / LIVE:** monolite tip `c7d1734a488d59def2237fc42648f7c9020758bb` · build **196** · `APP_BUILD_ID=D-FLIGHT-UX-COHERENCE-MASTER-VIS-A` · helper **0.1.3** (invariato)
**CATEGORIA:** AUDIT / READ-ONLY (docs-first)
**ORIGINE:** backlog QA build 183 candidato **C** — ATM09 VISUAL PARITY AUDIT
**NEXT:** fornire screenshot/evidenza ufficiale D-Flight ATM09 (operatore) → riesame matrice → eventuale `D-FLIGHT-ATM09-VISUAL-PARITY-IMPL-A` (non aperto)
**NOTE:** 2026-08-15 audit deterministico PASS (helper+monolite) · **nessuna** patch runtime · **nessun** HEX/pattern inventato · visual parity **non** dichiarata
<!-- /WU-HOT-HEADER -->

**Workstream precedente:** [`WU-0016`](WU-0016-dflight-ux-coherence.md) **CLOSED / PASS** (MASTER-VIS-A / build 196).

---

## 1. Scopo

Audit comparativo della resa **ATM09 ufficiale** (WMS via helper) vs presentazione GOI **prima** di qualsiasi modifica visuale runtime. Obiettivo: specifica verificabile per un eventuale blocco IMPL successivo — **non** restyle cosmetico «a occhio».

Vincoli di questa fase (inviolabili):

- nessun patch a `coordinate_converter Claude.html`;
- nessun patch a `infra/dflight-helper/goi_dflight_helper.py`;
- nessun deploy / bump build / nuovo endpoint;
- nessun RGB/HEX/pattern/opacità inventati;
- nessun `finito` di questa WU in questo giro.

---

## 2. Pipeline ufficiale (helper 0.1.3) — audit sorgente

File: `infra/dflight-helper/goi_dflight_helper.py` · `HELPER_VERSION = "0.1.3"`.

| Voce | Valore effettivo |
| --- | --- |
| `ATM09_LAYER` | `D-FLIGHT:ATM09` |
| `ATM09_STYLE` | `D-FLIGHT:atm09_style` |
| `ATM09_INFO_TYPENAME` | `D-FLIGHT:ATM09_INFO` |
| Tile | WMS **GetMap** · `format=image/png` · `transparent=true` · `width/height=256` · `srs=EPSG:3857` · bbox WebMercator tile |
| Legend | WMS **GetLegendGraphic** · stesso `layer` + `style` · `format=image/png` · `width=20` · `height=20` · `legend_options=fontSize:12;dpi:96` |
| Proxy client | `GET /atm09/tile/{z}/{x}/{y}.png` · `GET /atm09/legend.png` · `GET /atm09/info` |
| Trasformazione colore/pattern | **nessuna** — byte PNG upstream passati al client se `content-type` contiene `image/png` |
| Endpoint | **invariati** (nessuna modifica in questa fase) |

**Stile tile ↔ legenda:** entrambi usano **lo stesso** `ATM09_LAYER` + `ATM09_STYLE`. Differenza documentata solo nei parametri GetLegendGraphic (`width`/`height` icon + `legend_options`), tipici GeoServer per layout legenda — **non** un secondo stile map.

### Smoke helper (Tailnet, session-only, fuori repo)

Acquisizione via helper esistente `http://100.114.7.53:8010` (nessuna chiamata diretta a d-flight.it):

| Artefatto | HTTP | Content-Type | Bytes | IHDR |
| --- | --- | --- | --- | --- |
| `/atm09/legend.png` | 200 | `image/png` | 3378 | **181×189** RGB (color type 2) |
| `/atm09/tile/11/1079/743.png` | 200 | `image/png` | 3589 | **256×256** RGBA (color type 6) |

File salvati solo in `%TEMP%` locale (`atm09-legend-audit.png`, `atm09-tile-audit.png`) — **non** committati.

---

## 3. Pipeline visuale GOI (monolite `c7d1734` / build 196) — audit read-only

### A. Raster ATM09

| Aspetto | Evidenza codice |
| --- | --- |
| Classe | `.tile-wrap .tile.tile-atm09` (CSS ~1971–1978; render `img.tile.tile-atm09`) |
| Opacity | `1` light e dark — commento esplicito «official WMS PNG untouched» |
| `mix-blend-mode` | **assente** su ATM09 (presente su seamark, non su atm09) |
| z-index | `3` (stack overlay raster; sotto GIS vectors z≥4) |
| `image-rendering` | ereditato da `.tile` → `auto` |
| Pulse/fade | solo classe temporanea `.tile-map.is-atm09-overlay-pulse` (keyframes opacity 1↔0.42, 2 cicli) via `dflightAtm09PulseOverlayFx` |
| Display/hide | governato da `_dflightAtm09Preferred` / `dflightAtm09OverlayVisible` (master ATM09 + gate rete/helper/zoom≤19) |
| URL | `dflightAtm09TileUrl` → `{helper}/atm09/tile/{z}/{x}/{y}.png` |

### B. Legenda ATM09

| Aspetto | Evidenza |
| --- | --- |
| Sorgente | `dflightAtm09LegendUrl` → `{helper}/atm09/legend.png` (lazy su expand / auto-expand OFF→ON) |
| DOM | `#dflightAtm09LegendImg.dflight-atm09-legend-img` |
| Scaling CSS | `max-width:100%; height:auto; image-rendering:auto` |
| Background img | `transparent` |
| Contenitore | `.dflight-atm09-legend-details` con `background:var(--panel-2…)` e bordo — **può alterare percezione** dei colori PNG su temi light/dark |
| Opacity | nessuna opacity ridotta sull’`<img>` |

### C. NFZ vettoriale / fallback

| Aspetto | Evidenza |
| --- | --- |
| SVG zone colorate | `.dflight-zone-overlay` + swatch/classi `is-prohibited` ecc. (fill **solidi** rgba, **non** hatch CSS) |
| Suppress | `dflightAtm09ShouldSuppressNfzColors()`: preferred ∧ rete ∧ helper ∧ ready ∧ zoom≤max → skip paint NFZ colorato |
| Hit-only | `.dflight-zone-hitlayer` fill `rgba(0,0,0,0)` quando suppress e INFO available |
| Fallback | se suppress ma `_dflightAtm09InfoUnavailable` → NFZ colorato visibile (`atm09_info_visible_fallback`) |
| Layering | hitlayer z=2; INFO overlay z=3; raster ATM09 z=3 nello stack tile |

### D. FIX5 — separazione

Confermato invariato a livello struttuale:

1. raster ATM09 (`img.tile-atm09`);
2. SVG NFZ / hitlayer;
3. ATM09 INFO-hit (`.dflight-atm09-info-hit` fill `rgba(0,0,0,0)` sempre; stroke solo se `.is-selected`).

### E. Temporal / master (MASTER-VIS-A)

- Preferred ATM09: **solo** master ATM09 + dataset + gate + helper (`dflightAtm09SyncPreferredFromUi`) — **non** `_dflightOverlayVisible`, **non** filtri temporal.
- `dflightAtm09SyncTemporalContextUi`: solo sync INFO interactivity — **nessun** dim/hide ATM09.
- Classe `atm09-temporal-hidden`: non più scritta dal sync (selftest MVISA lo verificano).
- Residuo non visual-map: chiave i18n `dflight.filter.temporal.atm09AllOffHint` ancora testualmente «ATM09 nascosto» — **stale copy**, fuori scope patch di questo audit.

---

## 4. Riferimento screenshot operatore

**Esito ricerca:** **assente** dal repository (zero asset `.png`/`.jpg` di riferimento ATM09 ufficiale; nessuna evidenza allegata in docs/orchestrator oltre descrizioni testuali roadmap).

Gate esplicito:

### OFFICIAL VISUAL REFERENCE REQUIRED

Manca almeno **una** evidenza ufficiale riprodibile, ad esempio:

1. screenshot D-Flight web ufficiale della mappa ATM09 (stesso / analogo viewport);
2. e/o screenshot ufficiale della legenda ATM09 / categorie (in particolare zone proibite / no-fly a **righe/tratteggio** citate dall’operatore 2026-08-15).

Senza questi, **non** si dichiara visual parity e **non** si apre IMPL con valori colore/pattern.

---

## 5. Matrice visual parity

Separazione colonne: (1) pixel/stile upstream WMS · (2) compositing GOI · (3) fallback SVG NFZ · (4) INFO-hit invisibile.

| Aspetto | Ufficiale / evidenza | GOI corrente | Match | Note |
| --- | --- | --- | --- | --- |
| colore | PNG GetMap stile `atm09_style` (bytes proxy) | stesso PNG a opacity 1 | **ND** vs UI D-Flight | serve screenshot ufficiale |
| opacity | WMS `transparent=true` + alpha tile | CSS opacity **1**, no blend | **OK (GOI non attenua)** | compositing neutro sul raster |
| outline | nello stile WMS (non ispezionato pixel) | non ridisegnato da GOI sul raster | **ND** | |
| fill | nello stile WMS | non ridisegnato da GOI sul raster | **ND** | |
| pattern/retino | atteso ufficiale = tratteggio (claim operatore) | raster = pixel WMS; NFZ fallback = **fill solido** | **ND / rischio C** | se ATM09 non ready → NFZ solido ≠ hatch |
| angolo retino | upstream / screenshot | GOI non genera hatch ATM09 | **ND** | |
| densità retino | upstream / screenshot | idem | **ND** | |
| categoria | legenda GetLegendGraphic stesso style | PNG legenda 181×189 via helper | **parziale** | stesso style; layout legenda WMS params 20×20 |
| ordine legenda | GetLegendGraphic | immagine intera, nessun riordino client | **OK (passthrough)** | |
| label | nel PNG legenda | nessuna overlay testo GOI sulle categorie ATM09 | **OK** | |
| mappa ↔ legenda | stesso LAYER+STYLE | tile GetMap + legend GetLegendGraphic | **OK strutturalmente** | differenza solo params legend_options |
| compositing/layering | n/a | opacity1; panel bg su legenda; pulse temp; NFZ suppress | **parziale** | panel-2 può alterare percezione legenda |

---

## 6. Finding classificati (A–F)

| ID | Finding | Classe |
| --- | --- | --- |
| F1 | Helper passa PNG ATM09 senza recolor/pattern; layer+style unici per tile e legend | **A** UPSTREAM (+ conferma proxy fedele) |
| F2 | GetLegendGraphic usa `width/height=20` + `legend_options`; output 181×189 ≠ tile 256 | **A** UPSTREAM (parametri legend) — non secondo stile |
| F3 | GOI raster ATM09: opacity 1, no mix-blend, image-rendering auto | **B** GOI COMPOSITING — **neutro** (non altera colore intenzionalmente) |
| F4 | Contenitore legenda con `background: var(--panel-2)` può cambiare percezione PNG | **D** LEGEND PRESENTATION — candidato CSS futuro se confermato da screenshot |
| F5 | Pulse overlay temporaneo altera opacity solo durante FX | **B** — effimero; fuori parity statica |
| F6 | NFZ SVG fallback / pre-ready: fill solidi (`is-prohibited`…) senza hatch | **C** FALLBACK VECTOR — possibile causa del gap «tratteggio» se confrontato con UI ufficiale mentre ATM09 non suppress |
| F7 | Con ATM09 ready: NFZ color suppress; paint = raster WMS | **A** (+ **B** neutro) — parity dipende dai pixel upstream |
| F8 | INFO-hit trasparente (FIX5) | **B** — corretto / non contribuisce al colore zona |
| F9 | MASTER-VIS-A: temporal non dimmano/nascondono ATM09 | **B** — invariante prodotto rispettata |
| F10 | Screenshot ufficiali operatore assenti in repo | **F** NON DETERMINABILE — **gate bloccante** |
| F11 | i18n stale `atm09AllOffHint` («ATM09 nascosto») | fuori matrice pixel — nota copy; non causa resa mappa |

---

## 7. Cosa è già determinato vs cosa richiede confronto umano

**Determinato senza screenshot ufficiale:**

- pipeline helper e monolite;
- stessa style key tile/legend;
- assenza di recolor GOI sul raster;
- layering FIX5;
- decoupling temporal;
- esistenza di un percorso fallback NFZ a fill solido.

**Richiede evidenza ufficiale / giudizio umano:**

- se i pixel WMS `atm09_style` coincidono con la UI D-Flight vista dall’operatore;
- se il «tratteggio» no-fly è già nel raster upstream o solo nella UI ufficiale diversa;
- se il panel background della legenda GOI è un problema percettivo reale;
- ogni valore RGB/HEX/angolo/densità pattern.

---

## 8. Piano successivo (non implementato)

Candidato futuro (solo dopo sblocco gate + finding stabili):

**`D-FLIGHT-ATM09-VISUAL-PARITY-IMPL-A`**

Scope **esclusivamente** dai finding post-riferimento. Classificazione attesa:

| Se i finding stabilizzati toccano… | Categoria |
| --- | --- |
| solo CSS presentazione legenda / panel / scaling (es. F4) | potenzialmente **ROUTINE** |
| helper `ATM09_STYLE` / GetMap params / rete / proxy / lifecycle tile | **DELICATO** |
| solo fallback SVG NFZ hatch quando ATM09 OFF (F6) | da rivalutare (ROUTINE CSS vs DELICATO se tocca hit-test/FIX5) |

**Non** aprire automaticamente candidati D–H.

---

## 9. Riferimenti

- Roadmap backlog 183 § candidato C / §6 VISUAL PARITY AUDIT — [`WU-0005-0009-roadmap.md`](WU-0005-0009-roadmap.md)
- WU-0016 MASTER-VIS-A — [`WU-0016-dflight-ux-coherence.md`](WU-0016-dflight-ux-coherence.md)
- Helper ATM09 ARCH — `infra/dflight-helper/goi_dflight_helper.py`
