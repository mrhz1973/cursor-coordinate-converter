# WU-0017 — D-FLIGHT-ATM09-VISUAL-PARITY

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** CLOSED / PASS
**ACTIVE BLOCK:** D-FLIGHT-ATM09-VISUAL-PARITY-IMPL-A (CLOSED / PASS)
**CURRENT GATE:** none
**RUNTIME LIVE:** monolite tip `d2d3ab34adf7e30e07771c0edcf0e2700e931715` · build **197** · `APP_BUILD_ID=D-FLIGHT-ATM09-VISUAL-PARITY-IMPL-A` · helper **0.1.3**
**CATEGORIA:** ROUTINE (UI + JS a basso rischio)
**ORIGINE:** backlog QA build 183 candidato **C** — ATM09 VISUAL PARITY
**NEXT:** backlog D–H **NOT OPENED** (prossimo naturale: **D** Legenda ATM09 esterna / label user-facing)
**NOTE:** WU CLOSED 2026-08-16 · AUDIT-A + REFERENCE-A + IMPL-A PASS · QA operatore PASS · finito Regola H · LIVE `d2d3ab3` / 197
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

### 4.1 Stato asset repo

Le immagini **non** sono presenti nel repository. **Non** esistono asset `.png`/`.jpg` di riferimento ATM09 committati.

### 4.2 Evidenza orchestratore (REFERENCE-A — 2026-08-16)

**Registrazione formale:** *official visual reference supplied by operator to orchestrator*.

ChatGPT (orchestratore) ha ricevuto e analizzato due screenshot forniti direttamente dall’operatore:

- **(A)** screenshot UI D-Flight ufficiale;
- **(B)** screenshot GOI GIS Tool LIVE build **196** sul medesimo settore geografico.

Gate precedente:

### OFFICIAL VISUAL REFERENCE REQUIRED → **SODDISFATTO**

(evidenza operatore via orchestratore; **non** asset repo).

---

## 5. Finding visivi ratificati (REFERENCE-R1 … R6)

| ID | Finding ratificato |
| --- | --- |
| **REFERENCE-R1** | La UI D-Flight ufficiale mostra **UNA sola** legenda ATM09 contestuale. |
| **REFERENCE-R2** | La legenda ufficiale D-Flight usa label operative/user-facing, tra cui: Height 0 / 25 / 45 / 60 / 120 meters AGL; Dangerous Area. Sono visibili almeno: rosso pieno; rosso a righe diagonali; arancio; arancio a righe diagonali sulla mappa; giallo; azzurro/ciano; verde; ulteriori simbologie ATM09. **Non** ricavare/inventare HEX dai soli screenshot. |
| **REFERENCE-R3** | Nel GOI build **196** il raster ATM09 mostra già pattern visuali **materialmente coerenti** con il riferimento ufficiale (rosso pieno, rosso tratteggiato, arancio tratteggiato, altre campiture). **Nessuna evidenza** per autorizzare un restyle del raster WMS in questo momento. |
| **REFERENCE-R4** | Mismatch UX principale: **doppia legenda** GOI contemporanea — «Legenda restrizioni» + «Legenda ATM09 ufficiale». |
| **REFERENCE-R5** | La legenda ATM09 GOI (GetLegendGraphic) mostra label **tecniche** WMS (es. `geometrie_rosse_scure`, `geometrie_rosse_piene`, `geometrie_verdi`, …). Sorgente ufficiale WMS, ma **non** la stessa presentazione user-facing della UI D-Flight. |
| **REFERENCE-R6** | Il finding audit **F6** (fallback NFZ fill solido) resta reale, ma va distinto dallo stato ATM09 **READY**: READY → paint primario = raster WMS ufficiale; fallback NFZ = modalità degradata GOI — **non** prova che il raster ufficiale sia visualmente errato. |

### Aggiornamento finding audit precedenti

| ID audit | Stato post-REFERENCE |
| --- | --- |
| F10 (screenshot assenti → gate bloccante) | **SUPERSEDED** — riferimento soddisfatto via orchestratore (non via asset repo) |
| F6 | **CONFERMATO** ma **declassato** rispetto al percorso IMPL-A: non giustifica restyle raster; rilevante solo in fallback |
| F4 / label GetLegendGraphic | Affinato da **R5**: label tecniche vs user-facing → backlog **D** (non IMPL-A) |
| Matrice § precedente (celle ND colore/pattern) | Per raster READY: **coerenza materiale** ratificata (**R3**); HEX ancora vietati |

---

## 6. Decisione prodotto ratificata — `D-FLIGHT-FAMILIARITY-FIRST`

Utenti target provenienti da D-Flight. La UI GOI deve preservare per quanto possibile il **modello mentale D-Flight** senza sacrificare la separazione tecnica interna.

**Principio:** separazione tecnica interna ≠ duplicazione UX obbligatoria.

**Mantenere invariati (non negoziabili in IMPL-A):**

- due master indipendenti;
- raster ATM09;
- NFZ / fallback;
- INFO-hit;
- FIX5;
- temporal;
- gate rete / OPSEC / offline;
- helper **0.1.3**.

**Obbligo UX:** mostrare **UNA SOLA LEGENDA CONTESTUALE ALLA VOLTA**.

---

## 7. Matrice legenda ratificata (paint-driven)

La legenda descrive il **paint realmente visibile**, non solo lo stato teorico dei checkbox.

| Caso | Master D | Master ATM09 | Condizione paint | Legenda mostrata | Legenda nascosta |
| --- | --- | --- | --- | --- | --- |
| **A** | ON | OFF | zone D / NFZ (se applicabile) | **Legenda restrizioni** | Legenda ATM09 |
| **B** | OFF | ON | ATM09 raster READY/visibile | **Legenda ATM09** | Legenda restrizioni |
| **C** | ON | ON | ATM09 raster READY/visibile | **SOLO Legenda ATM09** | Legenda restrizioni (non compete) |
| **D** | * | ON | ATM09 non disponibile / fallback NFZ colorato **realmente attivo** | **Legenda restrizioni** (paint effettivo) | non presentare Legenda ATM09 come se il raster fosse attivo |
| **E** | OFF | OFF | nessuno | **nessuna** legenda visuale occupa spazio | entrambe |

---

## 8. Scope futuro — `D-FLIGHT-ATM09-VISUAL-PARITY-IMPL-A` (**non implementato**)

**Classificazione attesa:** **ROUTINE** (UI + JS a basso rischio), salvo finding tecnico contrario in pre-implementazione.

### In scope

- sola **arbitration / visibility contestuale** delle due legende secondo la matrice §7 A–E;
- allineamento a `D-FLIGHT-FAMILIARITY-FIRST`.

### Fuori scope (esplicito)

- nessun cambio colori / pattern / raster;
- nessun cambio `ATM09_STYLE`;
- nessun cambio helper / endpoints;
- nessun cambio lifecycle rete;
- nessun cambio hit-test / FIX5;
- nessun cambio temporal / master semantics;
- miglioramento resa/label ATM09 verso pannello D-Flight user-facing → resta backlog **D** «Legenda ATM09 esterna» — **non** inglobare silenziosamente in IMPL-A.

**Non** aprire automaticamente candidati D–H.

---

## 9. Gate e NEXT

| Voce | Valore |
| --- | --- |
| Gate precedente | OFFICIAL VISUAL REFERENCE REQUIRED → **soddisfatto** (REFERENCE-A) |
| IMPL-A | **CLOSED / PASS** tip `d2d3ab3` / build **197** · deploy · AB QA · QA operatore · finito |
| **GATE CORRENTE** | **none** |
| **NEXT** | backlog D–H **NOT OPENED** (prossimo naturale: D Legenda ATM09 esterna) |
| WU-0017 | **CLOSED / PASS** |
| Runtime / helper | LIVE **197** · helper **0.1.3** invariato |

### 9.1 IMPL-A implementato (2026-08-16)

- Helper: `dflightLegendPaintMode()` + `dflightSyncContextualLegends()`
- Hook: `dflightSyncPanelUi`, `dflightAtm09EnsureLegend` (eligibility), `dflightAtm09SetReady`, `dflightAtm09MarkInfoUnavailable`, `dflightAtm09ApplyInfoSuccess`
- Selftest: `dflightSelfTestIMPLA` (A–E)
- **Non** toccati: raster/style/helper/endpoint/FIX5/temporal/master semantics/label PNG
- Chiusura: `QA D-FLIGHT-ATM09-VISUAL-PARITY-IMPL-A PASS operatore` → finito Regola H


---

## 10. Appendice — audit deterministico precedente (AUDIT-A, storico)

Sezioni storiche sotto restano evidenza tecnica di pipeline; le decisioni operative prevalgono da §4–§9 (REFERENCE-A).

### 10.1 Matrice visual parity (pre-REFERENCE; celle ND supersedute dove indicato)

Separazione colonne: (1) pixel/stile upstream WMS · (2) compositing GOI · (3) fallback SVG NFZ · (4) INFO-hit invisibile.

| Aspetto | Ufficiale / evidenza | GOI corrente | Match post-REFERENCE | Note |
| --- | --- | --- | --- | --- |
| colore / pattern raster READY | UI D-Flight (A) + WMS | raster GOI (B) | **coerenza materiale (R3)** | no HEX; no restyle autorizzato |
| opacity | WMS transparent | CSS opacity **1** | **OK** | |
| doppia legenda | una sola (R1) | due contemporanee (R4) | **MISMATCH UX** → IMPL-A | |
| label legenda ATM09 | user-facing (R2) | tecniche WMS (R5) | **diverso** | backlog **D**, non IMPL-A |
| fallback NFZ fill solido | n/a | F6 / R6 | degrado GOI | distinto da READY |

### 10.2 Finding audit A–F (storico)

| ID | Finding | Classe | Post-REFERENCE |
| --- | --- | --- | --- |
| F1–F3, F5, F7–F9, F11 | come AUDIT-A | A/B | invariati / contesto |
| F4 | panel legenda | D | residuale; non prioritario vs R4 |
| F6 | NFZ solid fallback | C | **R6** — distinto da READY |
| F10 | screenshot assenti | F | **SUPERSEDED** |

### 10.3 Pipeline helper / monolite

Vedi §2 e §3 sopra (invariate; helper 0.1.3; monolite build 196).

---

## 11. Riferimenti

- Roadmap backlog 183 § candidato C — [`WU-0005-0009-roadmap.md`](WU-0005-0009-roadmap.md)
- WU-0016 MASTER-VIS-A — [`WU-0016-dflight-ux-coherence.md`](WU-0016-dflight-ux-coherence.md)
- Helper ATM09 ARCH — `infra/dflight-helper/goi_dflight_helper.py`
- Evidenza: *official visual reference supplied by operator to orchestrator* (non in repo)
