# GIS-DIALOG-MINIMIZE-HISTORY-A-REVIEW-EVIDENCE-B — verify-only

**BLOCK-ID:** `GIS-DIALOG-MINIMIZE-HISTORY-A-REVIEW-EVIDENCE-B`  
**Categoria:** DELICATO / VERIFY-ONLY  
**Scope:** checklist REVIEW GPT-SOSTITUTIVA lifecycle modal/dialog. **Zero patch runtime.**

## Candidate immutabile

| Campo | Valore |
| --- | --- |
| FULL SHA | `7196b30fe0c89acf2bd538640eb2076f012b6380` |
| Build / APP_BUILD_ID | **214** / `GIS-DIALOG-MINIMIZE-HISTORY-A` |
| Blob monolite | `d425ec9a6c0fe4dc9e8f3a7445e6a1f6f6686f9f` — **invariato pre e post test** |
| Bytes LF / SHA-256 LF | `10468712` / `523fc1cccc930461445235f7f50980dbc02db410b01e0e9225a6e63e1c2fd541` |
| HEAD repo (pre-docs) | `cf4e13c37faff0848820b72c2560222ca980ae43` = origin/main = ls-remote |
| Monolite | **NON modificato** · **NON bumpato** · **NON nuovo candidate** · **NON deployato** |

Raw live: sibling JSON `2026-08-17_2240_gis-dialog-minimize-history-a-review-evidence-b.json` (57/57 PASS). Esecuzione: Chromium Playwright headless, click reali su CTA/`−`/`×`/chip dock, Esc tastiera, poi ramo fuori GIS (`body.gis-mode` rimosso). Snippet sotto = raw@`7196b30`.

## Verdetto prove

| Prova | Esito |
| --- | --- |
| A apertura context-aware (GIS + fuori GIS) | **PASS** |
| B controlli − / × | **PASS** |
| C backdrop / inert | **PASS** |
| D Cronologia drawer → dialog | **PASS** |
| E regressione minima | **PASS** |

Live checks: **57 / 57** PASS · fail **0**.

---

## A. APERTURA CONTEXT-AWARE — **PASS**

### GIS — Converti

Percorso: `#topbarConvertBtn` → `openConvertModal` (`78426`).

```78458:78468:coordinate_converter Claude.html
  state.convertOpen = true;
  const isGis = document.body.classList.contains("gis-mode");
  // GIS: non-modal floating panel so the map stays interactive (no backdrop/inert).
  if (isGis && typeof dlg.show === "function"){
    try { dlg.show(); } catch(_){ dlg.setAttribute("open", ""); }
  } else if (typeof dlg.showModal === "function"){
    try { dlg.showModal(); } catch(_){ dlg.setAttribute("open", ""); }
  } else {
    dlg.setAttribute("open", "");
  }
  try { dlg.setAttribute("aria-modal", isGis ? "false" : "true"); } catch(_){}
```

Live @1400×900: `open=true`, `:modal=false`, `aria-modal=false`, `html/body` non inert.

### GIS — Cerca

Percorso: `#appTopbar [data-tab="geocoding"]` → `toggleSearchPanel` (`75814-75816`) → `openSearchPanel` (`91435`). Gate GIS; `dlg.show()`; `aria-modal=false`. Nessun `showModal`.

Live: `:modal=false`, `aria-modal=false`, no inert.

### GIS — Cronologia

Percorso: `#appTopbar [data-tab="history"]` → `toggleHistoryPanel()` (`75826-75828`) → `openHistoryPanel` (`91557`). Gate GIS; `gisMoveSectionTo("sec-history", historyPanelBody)`; `dlg.show()`; `aria-modal=false`. `String(openHistoryPanel)` senza `tabDrawer` / `translateX`.

Live: parent `#sec-history` = `historyPanelBody`; `#tabDrawer` non open.

### Fuori GIS

`body.gis-mode` rimosso (opt-out classico; `gisMode===false` è path dormiente in `gisInit` `75749`).

| Elemento | Semantica osservata | Live |
| --- | --- | --- |
| Converti | `showModal` + `aria-modal=true`; `−` nascosto CSS `8293` | `:modal=true`; min `display:none`; top-layer bloccante |
| Cerca | `openSearchPanel` gated (`return` se non GIS); classico = `activateTab("geocoding")` → `#tabDrawer` | opener non apre `#searchPanel`; drawer `geocoding` + `geocodeCard` in `tabDrawerBody` |
| Cronologia | `openHistoryPanel` gated; `activateTab("history")` no-op (`GIS_VALID_TABS` esclude `history` `75638`) | nessun right-slide; `#sec-history` resta sezione homepage unica (non drawer, non clone) |

---

## B. CONTROLLI − / × — **PASS**

Markup (tutti `type="button"`, close `.app-modal-close`, testo `×`, nessun SVG, nessun `formmethod`):

- Converti `13807-13810` — `data-role="convertmodal-minimize"` + `#convertModalClose`
- Cerca `14116-14118` — `searchpanel-minimize` + `#searchPanelClose`
- Cronologia `14135-14137` — `historypanel-minimize` + `#historyPanelClose`

Handler **specifici** (getElementById / `querySelector` singolare, non `querySelectorAll` globale close/min):

- Converti close `#convertModalClose` → `closeConvertModal` (`75846-75850`); min `75857-75863` → `gisMinimizePanel("convertModal", …)`
- Cerca `#searchPanelClose` → `closeSearchPanel` (`75892-75906`)
- Cronologia `#historyPanelClose` → `closeHistoryPanel` (`76014-76028`)

`close*` chiama `gisClearPanelMinimizeUi` (`78490` / `91468` / `91588`). Minimize ≠ close: dopo `−` lo stato `convertOpen`/`searchPanelOpen`/`historyPanelOpen` resta true; `×` lo azzera e toglie il chip.

Live: click reale `−` → chip dock; restore da chip; `×` pulisce chip/stato. Esc su Converti minimizzato **non** chiude (`76470-76472`).

---

## C. BACKDROP / INERT — **PASS**

GIS usa `HTMLDialogElement.show()` (non `showModal`) → nessun top-layer/backdrop nativo; `aria-modal=false`.

Live dopo minimize Converti/Cerca/Cronologia: `html/body` non inert; `elementFromPoint` sul centro mappa **non** cade nel dialog; dialog `inert=false`; flag open ancora true.

Esc skip se minimizzato (`76470-76486`). Close reale solo da `×` / Esc su pannello non minimizzato.

Fuori GIS Converti: `:modal=true` (backdrop/blocco previsti). Cerca/Cronologia non usano i floating GIS; Cerca classica via drawer; Cronologia via `#sec-history` in page.

---

## D. CRONOLOGIA — **PASS**

| Check | Raw@7196b30 | Live |
| --- | --- | --- |
| Apertura nuovo dialog | `#historyPanel` `14131`; `openHistoryPanel` `91557` | `open=true`, parent `historyPanelBody` |
| Path `tabDrawer` inattivo per history | `GIS_VALID_TABS` filtra `history` `75638`; `activateTab` early-return `78278` | drawer non open in GIS history |
| Nessun translate/right-slide specifico Cronologia | `openHistoryPanel` senza `translateX`/`tabDrawer` | confermato |
| CSS drawer condiviso **conservato** | `.tab-drawer{` `6759-6778` (`translateX(100%)` per altri tab) | `.tab-drawer` presente nel DOM |
| Un solo contenuto | `#sec-history` `13628` · `#history-list` · un `#historyPanel` | count 1/1/1; nessun clone |
| × / Esc | `#historyPanelClose` `76016`; Esc `76481-76486` | click × e Esc chiudono; min+Esc non chiude |

---

## E. REGRESSIONE MINIMA — **PASS**

- Selftest **592 / 592** (fail=0, pageErrors=0) · `DH_*` 28/28 · `DOCK_GD_*` **40 / 40**
- Un solo `#gisMinimizedDock` · un solo `_gisMinimizedPanels[]`
- `gisWorkbenchPanel` mai aperto (`workbenchPanelOpen=false`) · Oggetti GIS **UNTOUCHED**
- **F NOT OPENED**
- Helper **0.1.3** (`infra/dflight-helper/**` diff vs candidate = vuoto)
- `state.mapWaypoints` Array intatto
- Nessuna nuova rete/storage/GPS in questo pass (verify-only, zero patch)
- Blob candidate **identico** pre/post: `d425ec9a6c0fe4dc9e8f3a7445e6a1f6f6686f9f`

## STOP

Tutte le prove PASS. Nessuna patch. Nessun bump. Nessun nuovo candidate.

**REVIEW GPT-SOSTITUTIVA — PENDING** (verdetto a ChatGPT) su FULL SHA `7196b30fe0c89acf2bd538640eb2076f012b6380`.

**NO DEPLOY** · **NO QA OPERATORE** · **NO FINITO** · **F NOT OPENED** · **Oggetti GIS FROZEN / UNTOUCHED**.
