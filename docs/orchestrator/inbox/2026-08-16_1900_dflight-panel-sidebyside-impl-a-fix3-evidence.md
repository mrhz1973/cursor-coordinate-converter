# D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX3 — REVIEW EVIDENCE

**BLOCK-ID:** D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX3  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (nessun verdetto PASS)  
**NO** deploy · **NO** QA operatore · **NO** finito

---

## 1. SHA / ancestry

| Ruolo | Full SHA |
|-------|----------|
| LIVE FAIL QA umana (FIX2) | `a40d216300deefa2c23f6b20585f9543c6ee024c` |
| CANDIDATE FIX3 | `9643ca0839878b154e68ffa003aa94570375d111` |

Build FIX3: **204** · `APP_BUILD_ID=D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX3`  
Monolite blob FIX3: `e89fd070444b62aaab2d0f0a26796286f0036866`  
Monolite blob FIX2 LIVE: `4df31cfc013e80e26a6f079e21d198cecbd7d1fb`  
SHA-256 LF FIX3: `46e720a891010ee7bd41faa663a9fc5dc96561d6a14190d48b9fbdf7354dea9e`  
Byte LF FIX3: `10344255`

---

## 2. Root cause (FAIL operatore su LIVE build 203)

Riproduzione **workflow UI reale** su LIVE FIX2 (pre-patch), non fixture-only:

1. Aprire Zone D-Flight + selezionare zona via path **ATM09 / map click** → `dflightAtm09OpenDetails`.
2. Entrambi i dialog a `left:12px` / `top:95px` → **overlap=true**.
3. `gPanelLayouts.*.touched === false` su entrambi.
4. Call chain osservata termina con **Pin** su Details; **nessuna** `dflightEnsurePairLayout`.
5. Source: `dflightAtm09OpenDetails` aveva Wire+Pin ma **non** EnsurePairLayout (`atm09HasPairHook: false`); `dflightOpenDetailsPanel` sì.
6. Chiamata manuale successiva a `dflightEnsurePairLayout()` → `side_by_side`, Details `left≈362`, overlap cleared → conferma che la policy era OK, il **hook path** mancava.

Finding touched (operatore #2): pair-layout agganciato solo a open/resize/restore — **non** a drag-end. Dopo drag, `touched` viene impostato da `gisPanelAttachDrag` → `gisPanelSetLayout(..., touched:true)`, ma il sibling non-touched non veniva ricollocato finché non si riapriva/resize.

Viewport stretta: già PASS (preservata).

---

## 3. Pre-fix LIVE (build 203) — coordinate

```json
{
  "build": {"id": "D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2", "num": 203},
  "overlap": true,
  "zone": {"left": "12px", "top": "95px", "br": {"l": 12, "t": 95, "r": 352, "w": 340}},
  "details": {"left": "12px", "top": "95px", "br": {"l": 12, "t": 95, "r": 392, "w": 380}},
  "layZ": {"left": 12, "top": 95, "touched": false},
  "layD": {"left": 12, "top": 95, "touched": false},
  "atm09HasPairHook": false,
  "openDetailsHasPairHook": true
}
```

Conferma source FIX2 tip: `dflightEnsurePairLayout` **assente** in `dflightAtm09OpenDetails` (`git show a40d216`).

---

## 4. Correzione FIX3 (scoped)

1. **`dflightAtm09OpenDetails`**: dopo Wire+Pin → `dflightEnsurePairLayout()` (allineato a `dflightOpenDetailsPanel`).
2. **`dflightWireFloatingPanel`**: `onDragEnd` / `onResizeEnd` → `dflightEnsurePairLayout` (sibling non-touched si riassetta; touched preservato dalla policy esistente).
3. **`gisPanelAttachDrag` / `gisPanelAttachResize`**: callback opzionale `onDragEnd` / `onResizeEnd` al commit del gesto (no timer, no modal manager).
4. **Legenda** `#dflightAtm09UserLegend`: `z-index:40` → `z-index:5` (mount su `#gisMapMount` poteva competere con floating panels baseZ 24–29). `pointer-events:none` invariato.
5. **Selftest** `SBS_R_*`: catena reale OpenControl + Atm09OpenDetails; hook drag/resize; no-overlap; touched sibling; legend stacking. Devono fallire su FIX2/203 (manca hook Atm09) e passare su FIX3.
6. Build **204** / `…-FIX3`.

`dflightPanelCloseLifecycle`: **byte-invariato** (sha256 `426a8b4dc6988c1b3fcaa867df95305bcac6633cb3ae75df3eef92ed82098dcf`).

---

## 5. Diff FIX2→FIX3 (account hunk)

17 hunk sul monolite (`a40d216..9643ca0`):

| Area | Contenuto |
|------|-----------|
| CSS legend | z-index 40→5 + commento FIX3 |
| APP_BUILD_* | ID/DETAIL/NUM 204 |
| `dflightWireFloatingPanel` | onDragEnd/onResizeEnd |
| `dflightAtm09OpenDetails` | EnsurePairLayout |
| selftest build guards | 203→204 / FIX2→FIX3 |
| `dflightSelfTestSideBySide` | SBS_R_* |
| `gisPanelAttachDrag` | onDragEnd |
| `gisPanelAttachResize` | onResizeEnd |

Niente: storage, rete, OPSEC, GPS, helper, close lifecycle, F/G/H, modal manager globale.

---

## 6. Prove post-fix (locale, monolite FIX3)

Chrome CDP su `http://127.0.0.1/…` (file servito dal working tree = tip `9643ca0`):

### Selftest `dflightSelfTestSideBySide`

27/27 PASS (incluso `SBS_R_*`).

Esempio:

- `SBS_R_atm09_chain_no_overlap` — `sep=true zl=12 dl=362`
- `SBS_R_drag_touched_sibling` — `mode=place_details_beside_zone zl=280px dl=630 sep=true`
- `SBS_R_legend_stack_runtime` — `legendZ=5 panelZ=28`

### Workflow reale post-fix

```json
{
  "wide": {"overlap": false, "zl": 12, "dl": 362, "zt": 95, "dt": 95},
  "touched": {"zoneKept": true, "overlap2": false, "mode": "place_details_beside_zone", "zl": 320, "dl": 670},
  "legend": {"zLeg": 5, "zPan": 28, "ok": true},
  "narrow": {"mode": "stack_fallback", "sep": true}
}
```

### `dflightSelfTestAll`

`ok: true` · **403** checks · **0** fail.

---

## 7. Invarianti esclusi

- Helper D-Flight **0.1.3** non toccato
- `state.mapWaypoints` / localStorage / rete / OPSEC / GPS: non toccati
- Nessun global modal manager
- Minimize/restore hooks preesistenti (EnsurePair su restore) invariati nella semantica
- LIVE VPS **non** aggiornato (NO deploy)

---

## 8. Gate

**REVIEW GPT-SOSTITUTIVA — PENDING**
