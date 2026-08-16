# EVIDENCE-B — GIS-PANEL-DOCK-MGR-AUDIT-A

**BLOCK-ID:** `GIS-PANEL-DOCK-MGR-AUDIT-A-EVIDENCE-B`  
**WU:** WU-0021  
**Data:** 2026-08-16  
**LIVE:** `508dd039981b1878e427c9440033fcad854351b1` · build **207** · `APP_BUILD_ID=BRANDING-TMART-IMPL-A-FIX1` · helper **0.1.3**  
**Metodo:** read-only — Cursor browser LIVE + Playwright Chromium headless contro stessa URL LIVE (nessuna patch monolite).  
**Raw JSON:** [`2026-08-16_2240_gis-panel-dock-mgr-audit-a-evidence-b.json`](2026-08-16_2240_gis-panel-dock-mgr-audit-a-evidence-b.json)

---

## 1. Casi riprodotti (sintesi)

| Caso | Esito | Evidenza chiave |
| --- | --- | --- |
| **A** 1 min + floating | PASS | favorites min + measure open; dock z**=22**, panel z**=26**; su viewport molto largo measure può non overlap geometrico, ma stacking già inferiore |
| **B** ≥3 min | PASS | favorites+measure+layers chip FIFO; dock unico body |
| **C** panel sopra dock | PASS **root cause CONFIRMED** | astro forzato `top≈70` → overlap dock area **20300** (1400×900); `elementFromPoint` → `app-modal-title` / body, **onChip=false**; panel z**=29** vs dock **22** |
| **D** convert / backdrop-like | PASS | convert z**=29** overlap dock (wide/stretto); tools backdrop CSS **z=990** occlude chip quando open (Cursor probe) |
| **E** desktop larga | PASS | 1400×900 (PW) + 2227×1253 (Cursor) |
| **F** 360×640 | PASS (PW) | mq768/520 true; dock wrap h**=106**; chip ancora z22 |
| **G** restore chip | PASS | favorites rimosso da `_gisMinimizedPanels`; panel restored open non-min |
| **H** resize con chip | PASS | 1400→360: dock y 78→92, wrap 3 chip su 2 righe; **topbar mobile overlap banda dock** (topbar top≈99 vs chip y≈102) |

### Root cause

**Confermata:** `#gisMinimizedDock` `position:fixed; z-index:22` sotto floating panels (`style.zIndex` 24–29 via `gPanelZCounter`). Occlusione = stacking + geometria top-left, non solo “sfortuna” D-Flight.

---

## 2. Header capacity (brand `TMART GIS tool`, build 207)

| Viewport | leftOfBrand px | rightOfBrand→ctrls px | headerH | brandW×H | topbarH | roomBelowBrand | Note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1400×900 | **586** | **227** | 85 | 228×74 | 40 | 5 | Lati ampi; riga sotto brand quasi nulla |
| 900×800 | **340** | **0** | 175 | 221×38 | 40 | 85 | ctrls wrap; destra esaurita |
| 360×640 | **115** | **0** | 144 | 130×25 | 40 | **115** | mobile CSS; topbar su riga sotto; **destra 0**; sinistra insufficiente per 3 chip (~330–350px utili) |

Chip osservati (IT/FR labels): ~80–155px × 38px + gap 10 → **3 chip ≈ 330–360px** min.

**Criterio futuro (da rect, non breakpoint inventati):**

- Se `rightOfBrandBeforeCtrlsPx` (o left) ≥ somma larghezze chip+gap → host laterale brand.
- Altrimenti → **riga dedicata** nello spazio `roomBelowBrandInHeader` / sotto brand+topbar, non overlay mappa a z&lt;panels.
- A 360: laterali insufficienti → riga dedicata obbligatoria.

---

## 3. Stacking context — risposte A/B/C

### Misure stacking LIVE

| Layer | position | z-index |
| --- | --- | --- |
| `header` | sticky | **10** (crea stacking context) |
| `#gisMinimizedDock` | fixed (body) | **22** |
| floating panels | fixed | **24–29** (`gPanelZCounter`, maxZ 29) |
| `#tabDrawer` | fixed | **30** |
| `#toolsDrawerBackdrop` | fixed | **990** |
| subdialog unsaved/clear | fixed | 30000+ |

### A. Dock montato dentro `header` → chip sopra panels senza z tra 29 e 30?

**NO.** `header` crea stacking context a **z=10**. Figli del header non possono sovrastare sibling body-level a z=24–29. Montare il dock nel DOM header **senza** alzare il context dell’header lascia i chip **ancora sotto** i panel.

### B. Drawer / backdrop vs chip

| Superficie | Chip devono stare |
| --- | --- |
| Floating GIS panels aperti | **sopra** i panel (raggiungibilità) — obiettivo prodotto |
| `#tabDrawer` (z30) | **sotto** il drawer (drawer = navigazione primaria full-height) |
| `#toolsDrawerBackdrop` (z990) + tools drawer | **sotto** (sessione tools modale) |
| `convertModal` / dialog “pesanti” con overlap | **sotto** mentre la modal di sistema è in primo piano *oppure* chip riposizionati fuori overlap — policy: non competere col top-layer tools; per convert, preferire chip in chrome header non coperto |

### C. Strategia z solo interi (no 29.5, no rewrite globale)

**Raccomandata (thin):**

1. Abbassare `maxZ` floating panels da **29 → 28** in `gisPanelBringToFront`.
2. Portare dock (body-fixed *oppure* host header) a **z-index: 29**.
3. Lasciare `#tabDrawer` a **30**, tools backdrop **990**.
4. Se i chip vivono **nel DOM header**: alzare anche `header` a **z-index: 29** (stesso intero del dock) così il context non resta a 10; panels restano ≤28.

Nessun valore decimale; tocco localizzato a costanti/CSS già esistenti.

---

## 4. Shared dock — OPTION G-A1

### Fatti codice LIVE

- Host unico `#gisMinimizedDock` creato in `gisRenderMinimizedDock` → `document.body.appendChild`.
- Renderizza **tutto** `_gisMinimizedPanels[]` nello stesso host.
- Chiamate `gisRenderMinimizedDock`: da `gisMinimizePanel`, `gisRemoveFromMinimizedDock`, e re-apply i18n (~91624).
- `gisWorkbenchPanel` **assente** dalla whitelist `gisMinimizePanel` (`workbenchInMinimize: false`).

### Decisione: **OPTION G-A1** (raccomandata)

Il nuovo host/reflow è **globale** per tutti i pannelli già in `_gisMinimizedPanels` / whitelist attuale.  
Acceptance/ABQA iniziale usa **1–2 pannelli pilota** (`favoritesPanel`, `measurePanel`) senza certificare eccezioni lifecycle (D-Flight, carto, auto-min).

**OPTION G-A2** (codice limitato a 1–2 ID) **non raccomandata:** richiederebbe branching fragile / rischio doppio dock — vietato salvo ragione forte (assente).

---

## 5. Workbench gap — classificazione

**Bug indipendente preesistente** → backlog **G-B** (non G-A).  
Handler minimize + focus map esistono; whitelist `gisMinimizePanel` manca → no-op.  
**Non** correggere in EVIDENCE-B; **non** allargare G-A.

---

## 6. Policy dock revisionata (deterministica)

1. **Host:** chrome header (slot L/R se capacity rect ok; else riga sotto brand/topbar). Un solo `#gisMinimizedDock` / un solo `_gisMinimizedPanels[]`.
2. **Ordine:** FIFO minimize (invariato).
3. **z:** dock **29**, panels **max 28**, drawer **30**, tools **990** (interi).
4. **Reflow:** su minimize/restore/open-close floating rilevante/viewport resize/i18n (hook esistenti + `gisDockReflow` sottile).
5. **Narrow:** se laterali &lt; fabbisogno chip misurato → riga dedicata (evidence 360: right=0, left=115 &lt; ~350).
6. **3+ chip:** wrap nella riga dock; overflow menu solo se supera budget altezza header (G-D).
7. **Restore / viewport:** lifecycle restore invariato; solo reflow dock.
8. **Touched panels:** mai auto-move; **WU-0019** sibling no-auto-move **invariato**.

---

## 7. G-A scope proposto (preciso)

### Autorizzato a toccare

- `gisRenderMinimizedDock` / mount host / CSS `.gis-minimized-dock*`
- eventuale slot markup in `header` / `.header-inner` (senza cambiare brand string)
- `gisPanelBringToFront` **maxZ** (29→28) + CSS z dock/header
- thin `gisDockReflow()` richiamato da minimize/restore/resize/i18n path già noti
- selftest mirato G-A

### Pilot acceptance IDs

`favoritesPanel`, `measurePanel` (rappresentativi; shared host globale).

### NON toccare in G-A

- Lifecycle Esc/close/auto-min (layers bbox, polygon draw, RR pick, carto `_cartoUi`)
- `dflightEnsurePairLayout` / touched pair policy (WU-0019)
- Whitelist workbench (→ G-B)
- convert/tools semantics
- nuova persistenza; helper; F; WU-0012

### Rimane

- **G-B** ordinari + workbench fix + certificazione ampia  
- **G-C** eccezioni D-Flight/carto/auto-min integrazione reflow only  
- **G-D** overflow +N / polish mobile topbar↔dock

---

## 8. Acceptance EVIDENCE-B checklist

| Criterio | Stato |
| --- | --- |
| Casi reali A–H | PASS |
| Root cause z/occlusione | CONFIRMED |
| Stacking header noto | PASS |
| Strategia z interi | PASS (29/28/30) |
| Pilot vs shared host | **G-A1** |
| No doppio dock | PASS |
| G-A scope determinato | PASS |
| WU-0019/touched/lifecycle preservati (docs) | PASS |
| Monolite blob invariato | PASS (`09fe2b4…`) |
| No bump/deploy | PASS |

**Gate resta REVIEW PENDING** (nessun IMPL).
