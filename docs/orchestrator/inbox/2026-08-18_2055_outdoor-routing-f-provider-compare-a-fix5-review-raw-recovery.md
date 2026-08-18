# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5 — REVIEW-RAW-RECOVERY-FIX5

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5`  
**PASS:** `REVIEW-RAW-RECOVERY-FIX5`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (invariato; FRONTIER / WU-HOT-HEADER **non** toccati)  
**Verdetto review:** **NON EMETTERE** (evidence-only per GPT sostitutiva)  
**Deploy / ABQA / QA operatore / finito / build bump / monolite:** **NON ESEGUITI** — candidate **immutabile**  
**Selftest 829/829 (RPCF5 28/28, RWF1 8/8):** **non rieseguito** (candidate immutato)

Linee citate = blob candidate **227** (`git cat-file -p 20c09c0c…`, LF, 0 CRLF).

Evidence FIX5 già persistita: [`2026-08-18_2045_outdoor-routing-f-provider-compare-a-fix5.md`](2026-08-18_2045_outdoor-routing-f-provider-compare-a-fix5.md).

---

## 1. ANCHOR — RUNTIME_CANDIDATE_SHA

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `118dc9d511c547f5032a7d0fd2f81dc65091b72a` |
| Subject | `fix(routing): FIX5 compact params, track lifecycle, alt borders, ring+VIA, build 227` |
| Files nel commit | **solo** `coordinate_converter Claude.html` (+423 / −88) |
| Base 226 (FIX4-FIX1) | `2e616352042f63a650124efcabe704796e6042af` (blob `82ecf7d7…`) |
| `APP_BUILD_ID` | `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5` |
| `APP_BUILD_DETAIL` | `Compact params, track lifecycle, alt borders, ring+VIA alts (FIX5).` |
| `APP_BUILD_NUM` | **227** |
| Blob git monolite | `20c09c0c23ab338082abef3b661bb079e32559d9` |
| Bytes LF | `10702356` (blob LF puro, 0 CRLF) |
| SHA-256 LF | `272c645dd05e58360c643e764d6edc76a96800ee20edcf20fea91d66eb8f0b3a` |
| Helper | **0.1.3** invariato (commit tocca solo l'HTML; nessun file helper nel delta) |

Costanti build nel blob (`24141–24144`):

```javascript
const APP_BUILD_ID = "OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5";
const APP_BUILD_DETAIL = "Compact params, track lifecycle, alt borders, ring+VIA alts (FIX5).";
const APP_BUILD_NUM = 227;
```

Verifica anchor dal candidate esatto:

```text
git rev-parse 118dc9d511c547f5032a7d0fd2f81dc65091b72a:"coordinate_converter Claude.html"
20c09c0c23ab338082abef3b661bb079e32559d9
git cat-file -p 20c09c0c23ab338082abef3b661bb079e32559d9  → bytes 10702356, CRLF 0,
sha256 272c645dd05e58360c643e764d6edc76a96800ee20edcf20fea91d66eb8f0b3a
```

**NON** usare HEAD / current container come sostituto di `RUNTIME_CANDIDATE_SHA`.  
HEAD locale al momento dell'anchor (docs container post-candidate, **non** il candidate runtime): `b9e560a05c6c152588b239c84718092f66e815ea`.

## 2. REMOTE_HEAD_AT_EVIDENCE_TIME (separato)

Attestazione **prima** del commit docs di questo recovery:

```text
git ls-remote origin refs/heads/main
b9e560a05c6c152588b239c84718092f66e815ea	refs/heads/main
```

**REMOTE_HEAD_AT_EVIDENCE_TIME** = `b9e560a05c6c152588b239c84718092f66e815ea`

Un successivo commit docs-only può avanzare `origin/main`: **non** cambia `RUNTIME_CANDIDATE_SHA`.

---

## 3. RAW — PARAMS COMPACT + PERCORSO INTEGRATO

### 3.1 Ordine nel gruppo (`15239–15278`)

`#routingParamsRow` contiene, in ordine DOM:

1. **Profilo** — `.routing-profile-row` + `#routingProfileSelect`
2. **Percorso** — `#routingModeGroup` (stesso markup chip `data-routing-mode`, **un solo** gruppo)
3. **Velocità media** — `#routingSpeedRow` + `#routingSpeedSelect`
4. **Calcola percorso** — `#routingCalculateBtn`

```html
<div id="routingParamsRow" ... data-i18n-aria="routing.paramsRowAria"
     aria-label="Profilo, percorso, velocità e calcolo">
  <div class="routing-profile-row">…#routingProfileSelect…</div>
  <div class="routing-mode-group" id="routingModeGroup">
    <span … data-i18n="routing.routeMode">Percorso</span>
    <div class="routing-mode-chips" role="radiogroup">
      <button … data-routing-mode="one_way">Solo andata</button>
      <button … data-routing-mode="out_and_back">Andata e ritorno</button>
      <button … data-routing-mode="round_trip">Anello</button>
    </div>
  </div>
  <div class="routing-speed-row" id="routingSpeedRow">…#routingSpeedSelect…</div>
  <button type="button" id="routingCalculateBtn" …>Calcola percorso</button>
</div>
```

### 3.2 Nessuna seconda copia dei mode chip (`15330–15341`)

`#routingModeRow` resta **solo azioni** (Annulla / Modifica coordinate / Aggiungi VIA / Inverti / Salva). Zero `[data-routing-mode]` in quella riga.

Selftest già eseguito (non rieseguito): `RPCF5_params_has_all`, `RPCF5_mode_in_params` (3 chip in params), `RPCF5_no_dup_mode_row` (0 chip in mode row), `RPCF5_actions_remain`.

### 3.3 Select stretti — CSS effettivo (`9849–9886`) vs ID globale (`10473–10476`)

```css
.routing-params-row .routing-profile-row,
.routing-params-row .routing-speed-row,
.routing-params-row .routing-mode-group{ flex:0 0 auto; width:auto; }
.routing-params-row .routing-profile-select,
.routing-params-row .routing-speed-select,
.routing-params-row #routingProfileSelect,
.routing-params-row #routingSpeedSelect{
  flex:0 0 auto; width:max-content; max-width:none;
}
@media (max-width:480px){
  .routing-params-row{ gap:6px; }
  … #routingProfileSelect, #routingSpeedSelect{ max-width:100%; }  /* wrap, no overflow orizzontale */
}
```

L'ID `#routingProfileSelect{ width:100%; }` (`10473–10476`) è **sovrascritto** nella params row (specificità `.routing-params-row #routingProfileSelect` = 1,1,0 > 1,0,0).

Computed già catturato in selftest `RPCF5_select_no_grow` **PASS**, detail verbatim:

```text
0|0|max-content|none
```

= `flexGrow` riga `0`, `flexGrow` select `0`, `width:max-content`, `max-width:none`. Non `width:100%`.

### 3.4 Handler / state invariati

`routingSyncModeRowUi` / `routingWireModeRowOnce` (`88002–88041`) usano `routingModeChipsHost()` → `#routingModeGroup`. Click ancora su `.routing-mode-chip` → `routingSetRouteMode(mode)` con whitelist `one_way|out_and_back|round_trip`. Profili: stesso `#routingProfileSelect` / stessi `option value`. Nessuna seconda copia di controlli.

---

## 4. RAW — TRACK MODAL ↔ PLANNER

API dock canoniche (nessun secondo sistema): `gisMinimizePanel("trackModal", "gis.minimized.track")` (`93917`); `gisRestoreMinimizedPanel("trackModal")` (`93940`); predica `gisPanelIsMinimized("trackModal")`.

### Helper (`93903–93942`)

```javascript
function routingMarkPlannerCommit(){
  const r = routingEnsureState();
  r._plannerCommitted = true;
}
function routingMaybeMinimizeTrackForPlanner(){
  const trackOpen = !!(state.trackModalOpen && trackDlg && trackDlg.open);
  if (!trackOpen) return;
  if (gisPanelIsMinimized("trackModal")) return;          // B: già min → nessuna ownership
  gisMinimizePanel("trackModal", "gis.minimized.track");
  if (gisPanelIsMinimized("trackModal")) r._trackMinimizedByPlanner = true;  // A
}
function closeRoutingPlannerPanel(){
  restoreTrack = !!(r && r._trackMinimizedByPlanner && !r._plannerCommitted); // snapshot PRIMA di FullCleanup
  routingFullCleanup();  // azzera state._routing
  if (restoreTrack && gisPanelIsMinimized("trackModal"))
    gisRestoreMinimizedPanel("trackModal");               // C; G: skip se non più min / non open
}
```

`gisRestoreMinimizedPanel` (`78934–78936`): `if (!dlg || !dlg.open) return` — Track chiusa dall'utente → no-op (G).

### Open (`93944–93976`)

- Reopen (planner già `open`): `routingMaybeMinimizeTrackForPlanner()` **senza** reset commit (`93953–93954`).
- Fresh open: `_plannerCommitted = false`; `_trackMinimizedByPlanner = false`; poi maybe-minimize (`93974–93976`).

### A–G (prove)

| Caso | Prova nel blob / selftest già PASS |
| --- | --- |
| **A** Track aperta non min → auto-min + flag | maybe-minimize se `open && !alreadyMin`; `RPCF5_track_auto_min` |
| **B** già min manuale → no ownership, close no restore | early `return` se già min; `RPCF5_track_manual_min_flag_off` + `RPCF5_track_manual_min_stays` |
| **C** close senza commit → restore | `restoreTrack && still minimized`; `RPCF5_track_restore_no_commit` |
| **D** solo Calcola → NON commit | `routingCalculateRouteGraphhopper` (`90857`) **non** è tra i call-site `routingMarkPlannerCommit` |
| **E** commit call-site | `routingCompareChoose` `89848`; `routingSelectAlternativeAt` apply `88530`; `routingPerformSaveAsTrack` confirmed `84361` |
| **F** close dopo commit → no restore | `_plannerCommitted` true; `RPCF5_track_no_restore_after_commit` |
| **G** Track ripristinata/chiusa utente | restore solo se `gisPanelIsMinimized`; restore no-op se `!dlg.open` |

Compare overlay-chip (`88561–88574`) setta solo `activeOverlayKey` — **non** chiama `routingMarkPlannerCommit`.

---

## 5. RAW — BORDI ALTERNATIVE

Classe chip (`88384–88387`): `is-route-<provider>-<idx>` + opzionale `is-active`. Label (`88399`): `routing.altMain` «Principale» / `routing.altNamed` «Alternativa {0}» + provider group label in compare (`88457–88458`).

Mapping CSS chip (`9923–9965`) vs stroke SVG (`10013–10020`):

| Classe | Fill chip | `border` chip = stroke SVG | Computed atteso (selftest) |
| --- | --- | --- | --- |
| `is-route-gh-0` | `#b91c1c` | `2px solid #ef4444` | `rgb(239, 68, 68)` |
| `is-route-gh-1` | `#c2410c` | `2px solid #f97316` | `rgb(249, 115, 22)` |
| `is-route-gh-2` | `#9d174d` | `2px solid #db2777` | `rgb(219, 39, 119)` |
| `is-route-ors-0` | `#1d4ed8` | `2px solid #2563eb` | `rgb(37, 99, 235)` |
| `is-route-ors-1` | `#0e7490` | `2px solid #06b6d4` | `rgb(6, 182, 212)` |
| `is-route-ors-2` | `#0f766e` | `2px solid #0d9488` | `rgb(13, 148, 136)` |

SVG: `is-route-gh-0` `#ef4444` continuo; ORS-0 `#2563eb` dash 7-5; context `opacity:.55; stroke-width:2.4`; active `stroke-width:4.2`. Chip active: `border-width:3px` + outline colore stroke (`9947–9965`).

Selftest **già eseguito** (non rieseguito), `RPCF5_chip_border_palette` **PASS**: per ciascun `k` in `{gh,ors}×{0,1,2}` `getComputedStyle(btn).borderTopColor === palette[k]` (non className-only). `RPCF5_chip_active_emphasis` **PASS** (`borderTopWidth >= 2.5` o `outlineStyle=solid` su `.is-route-gh-0.is-active`). Chip costruiti con `routingAppendAltChip` per GH **e** ORS (single + compare class set).

Specificità `#routingPlannerPanel button.btn.routing-alt-chip…` batte `.btn { border:1px solid var(--border) }`.

---

## 6. RAW — ANELLO + VIA / ALTERNATIVE

Guard FIX2 **invariato** (`88093–88096`):

```javascript
function routingAlternativesAllowed(effectiveRoutePointCount){
  return Number(effectiveRoutePointCount) === 2;
}
```

GH (`88107–88112`): `alternative_route` solo se `withAlternatives && routingAlternativesAllowed(nPts)`.  
ORS (`88739–88745`): `alternative_routes` stessa guardia.

START→VIA→START = 3 coordinate chiuse → `nPts === 3` → **nessun** `alternative_route` / **nessun** `alternative_routes`. Nessuna geometria sintetica: overlay usa solo `previewCoordinates` esistenti (`86632–86638` skip se `pts.length < 2`).

Selftest già PASS: `RPCF5_alt_allowed_2`, `RPCF5_alt_blocked_3`, `RPCF5_gh_2pt_alt`, `RPCF5_gh_loop_no_alt`, `RPCF5_ors_2pt_alt`, `RPCF5_ors_loop_no_alt`.

### UI single-provider vincolato (`88476–88493`)

Se `round_trip && routingRoundTripIsConstrained() && routeMetrics`: riga visibile, un chip Principale se una sola route, nota:

```javascript
note.textContent = routingFmtConstrainedNoAltsNote(pname);
// "Percorso Anello vincolato: {GraphHopper|OpenRouteService} non offre alternative…"
```

`RPCF5_ring_via_explains` + `RPCF5_ring_via_single_chip` **PASS**.

### Compare (`88445–88473` + `86645–86652`)

`pushPack` su GH e ORS se `status==="pass"`; pack senza alts → una sola main. Nota per ciascun provider con `showAlts < 2`. `RPCF5_compare_ring_both_mains` (2 track, gh+ors) e `RPCF5_compare_explains_both` **PASS**.

Identità 45 m **invariata**: `ROUTING_PATH_IDENTICAL_M = 45` (`86572–86575`).

### Zero-VIA round_trip (`88495–88497`)

`constrainedRt` è false → cade nel ramo `routingGetRouteMode() === "round_trip"` → `row.hidden = true`. Nessuna explanation impropria. Flusso seed / «Genera un altro anello» invariato.

---

## 7. RAW — I18N

| Chiave | IT | EN | FR | Consumo |
| --- | --- | --- | --- | --- |
| `routing.paramsRowAria` | aggiornata (`18007`): «Profilo, percorso, velocità media e calcolo percorso» | **assente** (freeze) | **assente** | solo `data-i18n-aria` |
| `routing.altConstrainedNoAlts` | nuova (`18008`) | **assente** (freeze) | **assente** | solo `routingT(..., fb IT)` |

`applyLanguage` (`73755–73758`): `if (dict[k] !== undefined) e.setAttribute("aria-label", dict[k])`. EN/FR **non** sovrascrivono → resta l'`aria-label` HTML italiano. **Nessuna raw key**, nessuna stringa vuota.

`routingT` (`83449–83463`): lang miss → `I18N.it[key]` → else `fb`. Nota Anello: fallback IT letterale identico al dizionario. **Fallback sicuro.** Nessun FINDING.

---

## 8. RAW — INVARIANTI (delta FIX5 = solo HTML)

`git show --stat 118dc9d` → 1 file, +423/−88. Nessun file helper/infra.

- Nessun endpoint nuovo; `RPC_no_new_endpoint` / `RPC_no_api_key` (assert `Authorization` **assente** da `routingPostOrsDirections`, `89917–89919`).
- Auto GH Local→VPS e ORS mai Auto: non toccati nel delta scoped.
- `forcedOffline` / `opsecStrict`: non toccati.
- Nessun GPS aggiunto; `watchPosition` compare solo in selftest regressione.
- Storage: `STORAGE_KEY` resta `coordconv_v2`; nessun `coordconv_v3`.
- Zero write `state.mapWaypoints[]` / `state.gisPolygons` nel delta FIX5; `RPCF5_wp_untouched` / `RPCF5_poly_untouched` **PASS**.
- Oggetti GIS FROZEN: non toccati.
- Helper **0.1.3** invariato (nessun path helper nel commit).

---

## 9. TEST ESISTENTI (puntatore, non rieseguiti)

Fonte: [`2026-08-18_2045_outdoor-routing-f-provider-compare-a-fix5.md`](2026-08-18_2045_outdoor-routing-f-provider-compare-a-fix5.md)

| Suite | Esito dichiarato |
| --- | --- |
| Selftest globale | **829/829 PASS** |
| RPCF5 | **28/28 PASS** |
| RWF1 | **8/8 PASS** |

Questo recovery **non** ha rilanciato Playwright.

---

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING**  
Candidate immutabile: `118dc9d511c547f5032a7d0fd2f81dc65091b72a` · build **227** · blob `20c09c0c23ab338082abef3b661bb079e32559d9`  
LIVE resta **220**.  
NEXT: review FIX5 candidate **227**.  
NON deploy. NON ABQA. NON QA operatore. NON finito. NON monolite.
