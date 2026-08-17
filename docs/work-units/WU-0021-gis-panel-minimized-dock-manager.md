# WU-0021 — GLOBAL GIS PANEL / MINIMIZED DOCK MANAGER

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN (G-A…G-D CLOSED / PASS; HISTORY-A in QA finale)
**ACTIVE BLOCK:** `GIS-DIALOG-MINIMIZE-HISTORY-A`
**CURRENT GATE:** **QA FINALE CHATGPT — PENDING**
**RUNTIME LIVE:** `7196b30fe0c89acf2bd538640eb2076f012b6380` · build **214** · `GIS-DIALOG-MINIMIZE-HISTORY-A` · blob `d425ec9a…`
**RUNTIME CANDIDATE:** LIVE
**CATEGORIA:** **DELICATO**
**NEXT:** QA operatore ChatGPT sul LIVE **214** · **non** finito · **F NOT OPENED**
**NOTE:** HISTORY-A deploy GIS-only PASS · ABQA 37/37 · helper 0.1.3 · F NOT OPENED
<!-- /WU-HOT-HEADER -->

**Workstream precedente:** [`WU-0020`](WU-0020-branding-tmart-gis-tool.md) **CLOSED / PASS** (candidato H). Side-by-side D-Flight: [`WU-0019`](WU-0019-dflight-panel-side-by-side.md) **CLOSED / PASS**.

---

## 1. Problema

Finding trasversale (non D-Flight-specific): una modal/pannello aperto può **coprire o rendere poco raggiungibili** le etichette dei pannelli minimizzati.

Direzione prodotto già autorizzata:

1. modal/pannelli aperti preferibilmente nell’**area alta utile** della mappa;
2. pannelli minimizzati **non nascosti** dietro modal aperte;
3. uso progressivo della **barra superiore** (header GIS scuro) come dock per le etichette minimizzate;
4. spazio libero a **destra e/o sinistra del titolo** quando disponibile;
5. comportamento **responsive** quando lo spazio orizzontale si esaurisce;
6. **coordinamento globale** dei pannelli GIS — non patch locali indipendenti.

Brand corrente (post H): **TMART GIS tool**.

---

## 2. Baseline (AUDIT-A)

| Voce | Valore |
| --- | --- |
| Repo | `mrhz1973/cursor-coordinate-converter` |
| Branch | `main` |
| Monolite tip LIVE | `508dd039981b1878e427c9440033fcad854351b1` |
| Blob monolite | `09fe2b4ac405f874866b19898ee844fe52ea1d8f` |
| Build | **207** · `APP_BUILD_ID=BRANDING-TMART-IMPL-A-FIX1` |
| Helper | **0.1.3** (non toccato) |
| Scope blocco | **docs-only** — zero patch runtime |
| Candidato F | **NOT OPENED** (invariato) |
| WU-0012 | OPEN / NEXT PROVIDER (invariata) |
| H / WU-0020 | CLOSED / PASS (non riaprire) |

**Acceptance AUDIT-A:** inventario + lifecycle + topbar 207 + policy dock/collision + ≥2 architetture + raccomandazione; monolite byte-invariato; nessun bump/deploy/ABQA/QA/finito.

---

## 3. Inventario pannelli / modal GIS (minimize system)

### 3.1 Partecipanti reali al sistema floating + minimize

Whitelist effettiva in `gisMinimizePanel` (~75328): solo i branch espliciti; ogni altro `panelId` fa **`return`** silenzioso.

| id DOM | Minimize OK | Open path (indicativo) | Close path | Minimize | Restore | Drag/resize | Note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `trackModal` | sì | `openTrackModal` | `closeTrackModal` | btn `[data-role="trackmodal-minimize"]` → `gisMinimizePanel` | `gisRestoreMinimizedPanel` + layout track | sì (`gisPanelAttach*`) | block se subdialog / brush |
| `waypointModal` | sì | `openWaypointModal` | `closeWaypointModal` | `waypointmodal-minimize` | restore + `_waypointPanelLayoutOpts` | sì | block import/export dialog |
| `favoritesPanel` | sì | `openFavoritesPanel` | `closeFavoritesPanel` | `favoritespanel-minimize` | sì | sì | block `#favInlineConfirmBar` |
| `layersPanel` | sì | `openLayersPanel` | `closeLayersPanel` | `layerspanel-minimize` + **auto** bbox | sì + `offlinePanelRestoreAfterBbox` | sì | block `#offlineDraftWarnDialog` |
| `astroPanel` | sì | (open floating GIS) | `closeAstroPanel` | `astropanel-minimize` | sì | sì | block picker waypoint/fav |
| `rangeRingsPanel` | sì | (open floating) | `closeRangeRingsPanel` | minimize + **auto** pick | sì | sì (anche partial clamp) | block source picker / delete confirm |
| `measurePanel` | sì | floating GIS | `closeMeasureFloatingPanelGis` | `measurepanel-minimize` | sì | sì | Esc ≠ minimize |
| `polygonPanel` | sì | `openPolygonPanel` | `closePolygonPanel` | minimize + **auto** draw | sì + `_polygonDrawAutoMinimized` | sì | `skipBlockCheck` in auto-draw |
| `helpOverlay` | sì | Help | close help | `helppanel-minimize` | sì + `positionHelpPanelDefaultGis` | sì | |
| `routingPlannerPanel` | sì | routing open | close routing | `routingpanel-minimize` | sì + list refresh | sì | exit pick / cancel drag on min |
| `cartoIgmPanel` | sì | `openCartoIgmPanel` | `closeCartoIgmPanel` | `minimizeCartoIgmPanel` / `gisMinimizePanel` | restore + `openCartoIgmPanel` + `_cartoUi` | sì | area-pick lifecycle locale |
| `dflightPanel` | sì | D-Flight open | close control | `dflightpanel-minimize` | `dflightRestorePanelToSafeTop` + **`dflightEnsurePairLayout`** | sì | WU-0019 pair |
| `dflightDetailsPanel` | sì | details open | close details | `dflightdetailspanel-minimize` | idem pair | sì | WU-0019 pair |

### 3.2 Gap / quasi-partecipanti

| id | Floating / z-order | Minimize whitelist | Nota audit |
| --- | --- | --- | --- |
| `gisWorkbenchPanel` | sì; in `GIS_MIN_FOCUS_MAP` / blocked map / restore branch | **NO** (cade in `else return`) | Handler minimize (~88281) chiama `gisMinimizePanel` ma **non ha effetto** — gap infrastrutturale |
| `searchPanel` | sì; in `gisPanelBringToFront` ids | **sì** (HISTORY-A / 214) | `−` + dock condiviso; close ≠ minimize |
| `convertModal` | sì (z CSS ~28 area) | **sì** in GIS (HISTORY-A / 214) | GIS floating `aria-modal=false`; fuori GIS modal classica, `−` nascosto |
| `historyPanel` | sì (HISTORY-A) | **sì** | dialog floating; **non** più `#tabDrawer` / right-slide |
| `qrModal` / help-like | overlay alto | no (help sì; qr no) | fuori dock |
| Subdialog (`waypointImportDialog`, `trackExportDialog`, `rrSourcePickerDialog`, …) | app-modal | no | bloccano minimize del parent dove previsto |
| `#tabDrawer` | z=30 | n/a | non è floating minimize |
| `#gisMinimizedDock` | creato runtime | n/a | host chip; **non** un pannello |

### 3.3 Non inventariare

`alert` / `confirm` / `prompt` browser — esclusi per brief.

### 3.4 Stato layout / minimize (per pannello)

| Stato | Dove | Persistenza |
| --- | --- | --- |
| minimized class | `dialog.gis-panel-minimized` → `display:none !important` | session DOM |
| dock rows | `_gisMinimizedPanels[]` `{id,labelKey}` | **session-only** (commento ~75142) |
| position/size/touched | `gPanelLayouts[key]` via `gisPanelGet/SetLayout` | **anche** `coordconv_ui_v1` (`captureUiState` / `sanitizeUiState`) — layout only, **non** minimized |
| z-order | `gPanelZCounter` + `style.zIndex` | session-only |
| chip label | i18n `gis.minimized.*` | dict (già presente) |

---

## 4. Infrastruttura esistente (simboli)

### 4.A — Generale già riutilizzabile

| Simbolo | Ruolo |
| --- | --- |
| `gisMinimizePanel` / `gisRestoreMinimizedPanel` / `gisPanelIsMinimized` | API minimize/restore |
| `gisRenderMinimizedDock` / `gisRemoveFromMinimizedDock` / `gisClearPanelMinimizeUi` | dock chip host `#gisMinimizedDock` |
| `gisPanelBringToFront` / `gisPanelAttachBringToFront` | z 24–29, repack overflow |
| `gisPanelGet/SetLayout` / `ApplyLayout` / `ClampRect` (+ `PartialVisible`) / `DefaultRect` / `SyncBodySize` | geometry session (+ UI persist) |
| `gisPanelAttachDrag` / `AttachResize` | drag/resize condivisi |
| `GIS_PANEL_DEFAULTS` (`topbarReserve:104`, pad 12, …) | default geometry |
| `GIS_MIN_BLOCKED_MAP` / `GIS_MIN_FOCUS_MAP` / `gisFlashMinimizeBlockedNotice` | block + focus restore |
| `GIS_MAP_FLOATING_OCCLUDER_IDS` | occluder map-aware (include dock) |
| CSS `.gis-minimized-dock` / `.gis-minimized-dock-chip` / `.gis-panel-minimized` | UX dock attuale |

### 4.B — Eccezioni locali

| Area | Simbolo / comportamento |
| --- | --- |
| D-Flight pair (WU-0019) | `dflightEnsurePairLayout`, `dflightRestorePanelToSafeTop`, touched one-sided / both-touched skip |
| Carto IGM | `minimizeCartoIgmPanel`, `state._cartoUi.isMinimized`, restore → `openCartoIgmPanel` |
| Offline bbox | `offlinePanelMinimizeForBbox` / `RestoreAfterBbox` |
| Polygon draw | `polygonDrawMinimizeIfOpen` / `RestoreIfAutoMinimized` |
| Range Rings pick | minimize su pick-first |
| Track brush | `trackBrushOnMinimizeAttempt` |
| Routing | `routingExitPickMode` / `routingCancelMarkerDrag` on minimize |

### 4.C — Duplicazioni / fragilità

- Whitelist minimize **hardcoded** in `if/else` (non allineata a `GIS_MIN_FOCUS_MAP` → workbench gap).
- Lista ids in `gisPanelBringToFront` **separata** dalla whitelist minimize.
- Dock **separato** dalla topbar/header (posizione mappa, non chrome).
- Clamp/default height usano `topbarReserve` ma **non** riservano spazio al dock.

### 4.D — Gap che richiedono manager globale

1. **z-index:** dock CSS `z-index:22` vs floating panels base **24–29** → ogni pannello aperto **copre** i chip (root cause strutturale del finding).
2. **Posizione dock:** `top: safe-area + --gis-minimized-dock-offset` (78–92px) = **sotto** header, nell’area mappa — non nella barra titolo.
3. **Nessun reflow** su open/close/resize di altre modal rispetto ai chip.
4. **Nessuna policy** overflow chip / priorità / lato L-R del brand.
5. **Nessun coordinamento** “modal alta utile” vs dock (solo pin locali tipo D-Flight safeTop).
6. Workbench minimize dichiarato in UI ma **non wired** nella whitelist.

---

## 5. Top bar / branding (LIVE build 207) — audit read-only

### 5.1 Geometria brand

- Markup: `<header>` → `.header-inner` → `.brand` → `h1.brand-title` → **solo** `.brand-main` = `TMART GIS tool` (`data-i18n="app.titleMain"`).
- Post FIX1: **niente** `.brand-by` / `.brand-signature` nel DOM (CSS orfano ammesso).
- GIS: `body.gis-mode > header .brand h1` → `clamp(1.28rem … 1.82rem)`; subtitle `p` nascosto.
- `.brand-title` ha `flex-wrap:wrap` + `overflow-wrap:anywhere` → titolo può wrappare su stretto.

### 5.2 Controlli header

Cluster destro `.header-ctrls`: `#netStatus`, primary format chip, settings ⚙️ (lingua/tema/reset layout pannelli/full reset/help), stampa, export JPG, Tools 🧰.

### 5.3 `#appTopbar`

In GIS mode reparentata nel header: tab Preferiti/… + CTA Converti. Desktop: stessa riga concettuale del chrome; **mobile ≤768px**: brand order1, ctrls order2, **topbar order3 full-width** (seconda riga). Stima header mobile `--gis-mobile-header-est:132px`.

### 5.4 Spazio utile L/R del titolo

- Desktop: brand centrato (`max-width` fino 680px) con spacer/topbar a sinistra e ctrls a destra → **fasce laterali** esistono ma **non sono slot dock**; oggi non c’è mount chip nell’header.
- Stretto/mobile: brand `max-width:calc(100% - 108px)` + wrap → spazio laterale **ridotto/assente**; topbar prende riga intera sotto.

### 5.5 Safe area / z / overflow

- Header: padding con `env(safe-area-inset-*)` su mobile.
- Dock odierno: `z-index:22`, `max-width:min(560px, 100vw-160px)`, wrap chip, `left:16px`.
- Tab drawer `z-index:30` (sopra pannelli 24–29 e dock).
- Commento CSS dock: “Sotto branding/header… sotto dialog Converti/traccia (26–28)” — conferma intenzionalità **sotto** le modal.

### 5.6 Fattibilità tecnica chip in header (solo audit)

**Sì, tecnicamente:** mount di chip in slot L/R del `.header-inner` (o sotto-riga dedicata) è fattibile senza framework; richiede CSS flex/grid + reflow JS. **Non** implementato in AUDIT-A. Rischio: collisioni con `#appTopbar` tabs e ctrls; wrap brand; safe-area.

---

## 6. Current minimized UX (casi documentati)

Metodologia: inferenza da CSS/JS LIVE 207 (nessun ABQA in questo blocco).

| Caso | Dove appare la label oggi | Chi può coprirla | Note |
| --- | --- | --- | --- |
| 1 pannello min | chip in `#gisMinimizedDock` top-left sotto header | qualsiasi floating open (z≥24), convert/tools con backdrop, tab drawer (30), map chrome parziale | |
| N pannelli min | stessa dock, wrap orizzontale | idem; overflow → wrap verso il basso → più superficie mappa | ordine = ordine di minimize (`_gisMinimizedPanels` push) |
| Altra modal sopra | chip resta sotto header ma **sotto** z pannello | quasi sempre occlusione se modal pin top-left / larga | finding operatore |
| Viewport larga | dock max ~560px a sinistra | toolbar mappa dx meno coinvolta | |
| Viewport stretta | offset 88–92px; max-width quasi full; header più alto | brand wrap + topbar row2 alzano il dock ma restano chip in area mappa | |
| Restore | click chip → `gisRestoreMinimizedPanel` | — | flash + focus head; D-Flight pair layout |
| Close | close button / Esc path del pannello | deve `gisClearPanelMinimizeUi` nei closer (pattern esistente) | close ≠ minimize |
| Drag aperto | `touched:true` in `gPanelLayouts` | dock **non** si muove | WU-0019: no auto-move sibling |
| Resize | sync body; resize window → clamp locali | dock posizione CSS fissa (no JS reflow dedicato al dock) | |

Collisioni tipiche: toolbar mappa top, CTA topbar, coordinate/footer **meno** del floating panel stesso (z).

---

## 7. Lifecycle / semantica (invarianti per il futuro manager)

| Azione | Semantica attuale | Implicazione manager |
| --- | --- | --- |
| Minimize | nasconde UI (`gis-panel-minimized`), dialog resta **`open`**, chip in dock | **≠ close** |
| Restore | toglie class, rimuove chip, re-apply layout/clamp/bringToFront; side effects per id | **≠** semplice `show()` |
| Close (×) | chiude dialog / stato open false; clear minimize UI | non lasciare ghost chip |
| Esc | cascata document keydown: subdialog → convert/tools/search → panel close **se non minimized**; se minimized spesso **early return** (Esc non chiude il min) | non reinterpretare Esc come restore |
| Overlay / backdrop | convert/help-like usano `::backdrop`; floating GIS spesso senza overlay full | dock sotto backdrop = irraggiungibile |
| Auto-minimize | layers bbox; polygon draw; RR pick; (carto pick flows) | manager **non** deve cambiare trigger |
| D-Flight | minimize consentito; restore safeTop + pair; touched policy WU-0019 | **non** rompere pair / no sibling auto-reposition on drag |

Il manager futuro **non** deve unificare close↔minimize né alterare queste semantiche.

---

## 8. State model — raccomandazione persistenza

| Bisogno manager | Stato esistente sufficiente? |
| --- | --- |
| chi è minimized | sì: class + `_gisMinimizedPanels` |
| chip label | sì: `labelKey` + i18n |
| geometry pannelli | sì: `gPanelLayouts` (+ UI persist già esistente) |
| z-order | sì: session counter |
| dock placement / overflow | **no** — solo CSS fisso oggi |

**Raccomandazione:** **A — coordinatore UI/session-only** sopra stato esistente.

- **Non** introdurre nuova chiave localStorage/IndexedDB per dock/minimize.
- Non persistire minimized across reload (oggi già session-only — mantenere).
- Layout touched persistito resta com’è; manager non scrive nuove forme di persistenza.

---

## 9. Architetture candidate

### OPTION A — Thin global coordinator (raccomandata)

**Idea:** registry sottile dei panel IDs già minimize-capable; `gisDockReflow()` su minimize/restore/open/close/resize/viewport; **relocation chip** verso slot header (L/R del brand) o fallback; lifecycle pannelli **invariato**; riuso `gisMinimizePanel` / restore / `gPanelLayouts`.

| Criterio | Valutazione |
| --- | --- |
| Blast radius | basso–medio (dock + header CSS/JS; whitelist fix) |
| Touched / manual | compatibile (non sposta pannelli touched) |
| WU-0019 SBS | compatibile se reflow dock non chiama pair layout tranne hook restore già esistenti |
| Regressione | media su z-index/header chrome |
| Testabilità | alta (dock visibility, chip count, z vs open panel) |
| Incrementale | sì → G-A…G-D |

### OPTION B — Panel manager ampio

Centralizza layout + z + minimize + open defaults (“sempre alto”) in un unico servizio che sostituisce pezzi di `gisPanel*` e pin D-Flight.

| Criterio | Valutazione |
| --- | --- |
| Blast radius | **alto** |
| Touched / SBS | rischio alto di violare WU-0019 |
| Regressione | alta |
| Incrementale | scarso (big-bang) |

### Raccomandazione motivata

**OPTION A.** Soddisfa il requisito prodotto (chip raggiungibili + dock in chrome) con riuso massimo e senza riscrivere lifecycle. OPTION B non necessaria finché A copre occlusione + dock policy.

Eventuale **A+** (fase successiva, non obbligatoria in G-A): soft default “pin high” solo per pannelli **untouched** all’open — policy esplicita, mai sui touched.

---

## 10. Dock policy candidata (deterministica, non cosmetica arbitraria)

Derivata da geometria LIVE + vincoli prodotto:

1. **Host preferito:** slot nell’header GIS (chrome scuro), **non** overlay mappa a z<panels.
2. **Lato:** preferenza **sinistra del brand** se spazio ≥ soglia misurata (larghezza chip + gap); altrimenti **destra del brand** prima dei ctrls; se entrambi insufficienti → **riga dedicata sotto brand** (prima di o al posto del wrap distruttivo) — soglie da calibrare in IMPL con misura `getBoundingClientRect`, non valori inventati qui.
3. **Ordine chip:** ordine di minimize (FIFO in `_gisMinimizedPanels`) — stabile, già esistente.
4. **Gap:** riuso gap CSS dock attuale (~10px) come baseline; non fissare px “di design” nuovi senza misura.
5. **Priorità overflow:** mantenere tutti i chip raggiungibili; se overflow → wrap nella riga dock header; se ancora overflow su narrow → **menu overflow** (“+N”) *solo se* wrap supera altezza header budget (da definire in G-D con evidenza).
6. **Narrow/mobile:** non forzare chip nella stessa riga del brand se `max-width` brand già compresso; preferire riga sotto (coerente con topbar order3).
7. **Quando usare barra superiore:** sempre quando `_gisMinimizedPanels.length > 0` in `gis-mode`.
8. **Fallback:** se header non montabile (edge case), dock mappa ma con **z-index ≥ max floating + 1 e ≤ drawer-1** (es. 29.5 non esiste → usare 29 con bring-dock-front o range dedicato 29.x via intero 29 e panels max 28) — dettaglio numerico in IMPL; vincolo: **chip sopra pannelli aperti, sotto drawer/overlay globali**.

---

## 11. Collision policy candidata

| Evento | Comportamento proposto (A) |
| --- | --- |
| Modal aperta vs dock | **non** spostare pannello touched; reflow **solo chip**; opzionale (fase successiva) pin-high se **untouched** |
| Topbar piena | wrap chip / overflow menu; non ridurre brand sotto leggibilità minima |
| Titolo wrappa | misurare altezza header → aggiornare offset; chip non sovrappongono testo brand |
| 3+ minimized | stesso ordine FIFO; wrap |
| Restore | rimuovi chip; `gisDockReflow`; lifecycle restore invariato (incl. pair D-Flight) |
| Viewport change | clamp pannelli esistenti (già); **reflow dock** (nuovo) |
| Pannello touched trascinato | **mai** auto-riposizionare sibling (WU-0019 resta); dock indipendente |

---

## 12. OPSEC / invarianti (confermati per scope futuro)

- Nessuna rete nuova; nessun GPS/live tracking; helper **0.1.3** invariato.
- Nessun localStorage/IndexedDB **nuovo** per il manager (layout UI esistente ok).
- `state.mapWaypoints[]` invariato; monolite vanilla standalone; no framework/split.
- H chiuso; F **NOT OPENED**; WU-0012 invariata.

---

## 13. Rischi

| Rischio | Severità | Mitigazione |
| --- | --- | --- |
| Chip in header rompono topbar tabs / ctrls | alta | G-A su 1–2 pannelli + misura geometria |
| z-index fight con drawer/backdrop | media | range z documentato; test convert open |
| Regressione D-Flight pair | alta | non toccare `dflightEnsurePairLayout` salvo hook restore già lì |
| Silent fail workbench minimize | media | fix whitelist in G-A/G-B |
| Persistenza accidentale minimized | bassa | tenere `_gisMinimizedPanels` session-only |
| L10N | bassa | riuso chiavi `gis.minimized.*` (freeze EN/FR) |

---

## 14. Acceptance futura (IMPL, non questo blocco)

1. Con ≥1 pannello minimizzato e un altro floating aperto, i chip restano **raggiungibili** (click restore).
2. Chip preferibilmente nel chrome superiore; fallback documentato.
3. Lifecycle close/Esc/minimize/auto-min invariati per pannelli coperti.
4. Touched + WU-0019 sibling policy rispettate.
5. Nessuna nuova persistenza minimize; OPSEC invarianti ok.
6. Selftest + Automated Browser QA sul bundle runtime; QA umana solo residuo percettivo (no OPSEC).

---

## 15. Piano micro-blocchi (da audit reale)

| Blocco | Scope | Note |
| --- | --- | --- |
| **G-A** | Foundation coordinator **G-A1** (shared host/reflow per tutti i minimized già supportati) + z 29/28/30 + acceptance pilota `favoritesPanel`+`measurePanel` | DELICATO; no big-bang; no workbench fix |
| **G-B** | Estensione certificazione pannelli ordinari + **fix whitelist workbench** | |
| **G-C** | Eccezioni lifecycle (D-Flight pair, auto-min bbox/draw/pick, carto) — solo integrazione reflow | |
| **G-D** | Responsive/polish: overflow +N, wrap brand, mobile topbar↔dock | |

**Non** aprire F in questi blocchi.

---

## 16. Decisione audit (sintesi)

| Voce | Esito |
| --- | --- |
| Categoria | **DELICATO** (confermata) |
| Architettura | **OPTION A** thin coordinator |
| Persistenza | session-only minimize; no new storage |
| Root cause finding | dock z=22 sotto panels 24–29 + dock fuori header |
| Gate | **REVIEW PENDING** |

---

## 17. File toccati da AUDIT-A

Solo memoria/docs: questo WU, `FRONTIER.md`, OM §7.2, roadmap candidato G, inbox/latest, LAST_CURSOR_REPORT. **Monolite non toccato.**

## 18. EVIDENCE-B (2026-08-16) — runtime probe LIVE 207

**Blocco:** `GIS-PANEL-DOCK-MGR-AUDIT-A-EVIDENCE-B` · docs-only · monolite blob `09fe2b4ac405f874866b19898ee844fe52ea1d8f` invariato.

**Evidence:** [`../orchestrator/inbox/2026-08-16_2240_gis-panel-dock-mgr-audit-a-evidence-b.md`](../orchestrator/inbox/2026-08-16_2240_gis-panel-dock-mgr-audit-a-evidence-b.md) + JSON raw sibling.

### Decisioni chiuse da evidence

| Tema | Decisione |
| --- | --- |
| Root cause | **CONFIRMED** — dock z=22 sotto panels 24–29; overlap top-left riprodotto (astro/convert) |
| Stacking header | `header` sticky z=10 crea context → mount dock *solo* in header **non** alza chip sopra panels |
| Strategia z | interi: panels **maxZ 28**, dock/header chrome **29**, tabDrawer **30**, tools backdrop **990** |
| G-A host | **OPTION G-A1** — shared `_gisMinimizedPanels` + un solo dock render; pilot acceptance favorites+measure |
| G-A2 | **non raccomandata** (rischio doppio dock / branching) |
| Workbench gap | bug preesistente → **G-B** (non G-A) |
| Capacity | 1400: L586/R227; 900: R0; 360: L115/R0 + roomBelowBrand 115 → narrow = riga dedicata |
| WU-0019 / touched | invariati |

### Policy / piano

Policy dock revisionata in evidence §6. Micro-blocchi: G-A = thin coordinator shared host; G-B = ordinari+workbench; G-C = eccezioni; G-D = polish.

**Gate:** resta **REVIEW PENDING**. No IMPL / deploy / ABQA / QA / finito.

## 19. G-A1 IMPL (2026-08-16) — REVIEW PENDING

**Candidate:** `7a5c42f3708cfa3dff3f7a7a7e1fdab5e470066c` / build **208** / blob `d57ead862ef65e894cb637b590650912ff261a16`

**Evidence:** [`../orchestrator/inbox/2026-08-16_2255_gis-panel-dock-mgr-g-a1-evidence.md`](../orchestrator/inbox/2026-08-16_2255_gis-panel-dock-mgr-g-a1-evidence.md)

**Ship:** `gisDockReflow` + header host `#gisMinimizedDock` + maxZ 28 + CSS z 29. Shared `_gisMinimizedPanels`. Workbench/WU-0019/lifecycle invariati.

**Gate:** REVIEW GPT-SOSTITUTIVA — PENDING · no deploy.

## 20. G-A1 REVIEW-EVIDENCE-B (2026-08-16)

Evidence-only per review indipendente. Candidato **invariato** `7a5c42f…` / 208.

**Evidence:** [`../orchestrator/inbox/2026-08-16_2350_gis-panel-dock-mgr-g-a1-review-evidence-b.md`](../orchestrator/inbox/2026-08-16_2350_gis-panel-dock-mgr-g-a1-review-evidence-b.md) · hunk account JSON sibling · rects JSON sibling.

**Hunk:** 17 · **+352/−30** riconciliato · **OTHER=0**.

**Gate:** REVIEW GPT-SOSTITUTIVA — PENDING · nessun verdetto in questo pass · no patch/deploy.

## 21. G-A1 DEPLOY + ABQA (2026-08-17)

REVIEW GPT-SOSTITUTIVA **PASS** su `7a5c42f…`. Deploy GIS-only PASS. ABQA **30/30** PASS.

**Evidence:** [`../orchestrator/inbox/2026-08-17_0015_gis-panel-dock-mgr-g-a1-deploy-qa.md`](../orchestrator/inbox/2026-08-17_0015_gis-panel-dock-mgr-g-a1-deploy-qa.md)

**Gate:** **QA FINALE CHATGPT — PENDING** · no finito · G-B/C/D NOT OPENED · F NOT OPENED.

## 22. G-A1-FIX1 (2026-08-17) — REVIEW PENDING

QA operatore FAIL circoscritto: drag troppo alto → title bar dietro header z29.

**Candidate:** `c122fd49c7046a8a3ef98f08d9d94d1e6b4676a6` / build **209** / blob `278421cc…`

**Evidence:** [`../orchestrator/inbox/2026-08-17_0035_gis-panel-dock-mgr-g-a1-fix1-evidence.md`](../orchestrator/inbox/2026-08-17_0035_gis-panel-dock-mgr-g-a1-fix1-evidence.md)

**Ship:** `gisPanelSafeTop` + clamp/drag/resize nudge. Z-order G-A1 invariato. WU-0019 invariato.

**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** · no deploy.

## 23. G-A1-FIX1 REVIEW-EVIDENCE-B (2026-08-17)

Evidence-only. Candidato **invariato** `c122fd4…` / 209.

**Evidence:** [`../orchestrator/inbox/2026-08-17_0050_gis-panel-dock-mgr-g-a1-fix1-review-evidence-b.md`](../orchestrator/inbox/2026-08-17_0050_gis-panel-dock-mgr-g-a1-fix1-review-evidence-b.md)

**Hunk:** 18 · **+217/−40** · **OTHER=0**. FINDING: dock row absolute può eccedere header.bottom (hit @360+3chip).

**Gate:** REVIEW GPT-SOSTITUTIVA — PENDING · no verdetto · no patch/deploy.

## 24. G-A1-FIX2 + DEPLOY + ABQA + QA PASS (2026-08-17)

REVIEW FAIL FIX1 → FIX2: `gisPanelSafeTop` usa `max(header.bottom, dock.bottom)`.

**LIVE:** `525e7df50cb4edf768b0da7f59e7414dd79d56de` / build **210** / blob `9aa5441d…`

**Evidence:** [`../orchestrator/inbox/2026-08-17_0115_gis-panel-dock-mgr-g-a1-fix2-evidence.md`](../orchestrator/inbox/2026-08-17_0115_gis-panel-dock-mgr-g-a1-fix2-evidence.md) · deploy+ABQA [`../orchestrator/inbox/2026-08-17_0130_gis-panel-dock-mgr-g-a1-fix2-deploy-qa.md`](../orchestrator/inbox/2026-08-17_0130_gis-panel-dock-mgr-g-a1-fix2-deploy-qa.md)

**ABQA:** 39/39 PASS · **QA operatore:** PASS · **finito** Regola H.

**STATUS blocco G-A1-FIX2:** **CLOSED / PASS** · G-B/C/D **NOT OPENED** · F **NOT OPENED** · WU-0021 resta **OPEN**.

## 25. G-B-AUDIT-A (2026-08-17) — REVIEW PENDING

Audit docs-only. G-A1-FIX2 **non** riaperto. Monolite **invariato**.

**Evidence:** [../orchestrator/inbox/2026-08-17_0150_gis-panel-dock-mgr-g-b-audit-a-evidence.md](../orchestrator/inbox/2026-08-17_0150_gis-panel-dock-mgr-g-b-audit-a-evidence.md)

**Determinato:**
- G_B_ORDINARY_IDS (11 id, incluso workbench post-fix)
- G_C_RESERVED_IDS/STATES (D-Flight pair, carto _cartoUi, auto-min bbox/draw/pick, …)
- Workbench gap = **solo** branch assente in gisMinimizePanel (infra già completa; i18n gis.minimized.workbench già presente)

**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** · no patch/deploy · G-C/G-D/F NOT OPENED.

## 26. G-B IMPL (2026-08-17) — REVIEW PENDING

Audit PASS → IMPL. Branch whitelist `gisWorkbenchPanel` in `gisMinimizePanel` + selftest `gisDockSelfTestGB`.

**Candidate:** `361345d6d330347a0ced6cd57c4a3fcb7d7b173a` / build **211** / blob `a0b86614…`

**Evidence:** [`../orchestrator/inbox/2026-08-17_0210_gis-panel-dock-mgr-g-b-evidence.md`](../orchestrator/inbox/2026-08-17_0210_gis-panel-dock-mgr-g-b-evidence.md)

**Hunk:** 18 · **+340/−38** · **OTHER=0** · selftest **486/486**.

**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** · no deploy · G-C/G-D/F NOT OPENED.

## 27. G-B REVIEW-EVIDENCE-B (2026-08-17)

Evidence-only. Candidato **invariato** `361345d…` / 211.

**Evidence:** [`../orchestrator/inbox/2026-08-17_0220_gis-panel-dock-mgr-g-b-review-evidence-b.md`](../orchestrator/inbox/2026-08-17_0220_gis-panel-dock-mgr-g-b-review-evidence-b.md) · JSON blocked paths sibling.

**Blocked A–G:** favorites / waypoint / astro / layers / rangeRings / polygon / track(subdialog) — **7/7 PASS** · post-unblock normal min+restore PASS · selftest **486/486**.

**Gate:** REVIEW GPT-SOSTITUTIVA — PENDING · nessun verdetto · no patch/deploy.

## 28. G-BC-BATCH1 (2026-08-17) — REVIEW PENDING

Batch 5 lane su base G-B `361345d` / 211 → candidate **212** `7e984df…` / `GIS-PANEL-DOCK-MGR-G-BC-BATCH1`.

**Evidence:** [`../orchestrator/inbox/2026-08-17_0235_gis-panel-dock-mgr-g-bc-batch1-evidence.md`](../orchestrator/inbox/2026-08-17_0235_gis-panel-dock-mgr-g-bc-batch1-evidence.md)

**Lane:** L1 CERTIFIED · L2–L4 CERTIFIED/NO CHANGE · L5 PATCHED (carto sync+export) · hunks 21 · OTHER=0 · selftest **524/524**.

**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** · no deploy · G-D/F NOT OPENED.

## 29. G-BC-BATCH1 DEPLOY + ABQA (2026-08-17)

REVIEW PASS → deploy GIS-only + ABQA batch unica.

**LIVE:** `7e984dff49bd7a0a2396f11b028f4f264c90fe52` / **212** / blob `b7919851…`

**Evidence:** [`../orchestrator/inbox/2026-08-17_0245_gis-panel-dock-mgr-g-bc-batch1-deploy-qa.md`](../orchestrator/inbox/2026-08-17_0245_gis-panel-dock-mgr-g-bc-batch1-deploy-qa.md)

**ABQA:** **78/78 PASS** · selftest **524/524** · helper **0.1.3** invariato.

**QA operatore:** **PASS** — attestazione `QA GIS-PANEL-DOCK-MGR-G-BC-BATCH1 PASS operatore` (2026-08-17) → auto-`finito` Regola H.

**STATUS blocco G-BC-BATCH1:** **CLOSED / PASS** · **F NOT OPENED** · WU-0021 resta **OPEN**.

## 31. G-D-BATCH1 REVIEW-EVIDENCE-B (2026-08-17) — verify-only

Gap evidenza della REVIEW chiuso su candidate **immutabile** `7fb0c20` / **213** (blob `bbc9a5c8…` invariato).

**Evidence:** [`../orchestrator/inbox/2026-08-17_1215_gis-panel-dock-mgr-g-d-batch1-review-evidence-b.md`](../orchestrator/inbox/2026-08-17_1215_gis-panel-dock-mgr-g-d-batch1-review-evidence-b.md) + JSON raw sibling.

**Esiti:** A restore slot sinistro (click reale @1920, 4 right + 1 left, n 5→4, no ghost, destra stabile) **PASS** · B restore reale da `+N` (mouse @360, «Altri 9»→«Altri 8», n 11→10) **PASS** · C accessibilità keyboard (Enter apre menu + focus item + Enter ripristina, n 9→8, «Altri 7»→«Altri 6») **PASS** · D regressione (4→5 stabile, resize senza duplicati, spy `dflightEnsurePairLayout`=0, workbench non toccato, selftest 564/564) **PASS**.

Nota metodo: primo tentativo C con evento sintetico `rawKeyDown` senza `text` non attivava il button (artefatto strumento); re-run con `keyDown`+`text="\r"` PASS. Nessun finding prodotto.

**Gate:** resta **REVIEW GPT-SOSTITUTIVA — PENDING** (verdetto ChatGPT) · **no patch** · **no bump** · **no deploy** · F NOT OPENED · Oggetti GIS FROZEN/UNTOUCHED.

## 32. G-D-BATCH1 DEPLOY + ABQA (2026-08-17)

REVIEW GPT-SOSTITUTIVA **PASS** su `7fb0c20…`. Deploy GIS-only PASS. ABQA **32/32** PASS · selftest **564/564**.

**LIVE:** `7fb0c202378966a412e454459f2fdf278e14ccee` / **213** / blob `bbc9a5c88888b9d0a79fcef2374a252aaf9893b7`  
**CANDIDATE:** LIVE

**Evidence:** [`../orchestrator/inbox/2026-08-17_1343_gis-panel-dock-mgr-g-d-batch1-deploy-qa.md`](../orchestrator/inbox/2026-08-17_1343_gis-panel-dock-mgr-g-d-batch1-deploy-qa.md)

**Helper:** **0.1.3** invariato · proxy/GH PID invariati · GIS PID `2738253`→`2746464`

**Gate:** **QA FINALE CHATGPT — PENDING** · no finito · **F NOT OPENED** · Oggetti GIS FROZEN/UNTOUCHED · WU-0012 invariata.

**QA operatore:** **PASS** — attestazione `QA GIS-PANEL-DOCK-MGR-G-D-BATCH1 PASS operatore` (2026-08-17) → auto-`finito` Regola H.

**STATUS blocco G-D-BATCH1:** **CLOSED / PASS** · **F NOT OPENED** · WU-0021 resta **OPEN**.

## 30. G-D-BATCH1 CANDIDATE (2026-08-17)

Bundle unico 10 task — dual-side header dock, no 5th-chip jump, header-budget `+N`.

**Candidato:** `7fb0c202378966a412e454459f2fdf278e14ccee` / **213** / blob `bbc9a5c88888b9d0a79fcef2374a252aaf9893b7`  
**LIVE:** invariato `7e984df` / **212** (**no deploy**)

**Evidence:** [`../orchestrator/inbox/2026-08-17_1054_gis-panel-dock-mgr-g-d-batch1-evidence.md`](../orchestrator/inbox/2026-08-17_1054_gis-panel-dock-mgr-g-d-batch1-evidence.md)

**Selftest:** **564/564** · planner 4-right+1-left · 1920 4→5 = 4 right + 1 left · 360 `+N` Altri 7

**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** · no deploy · **F NOT OPENED** · Oggetti GIS FROZEN/UNTOUCHED · WU-0012 invariata.

## 33. GIS-DIALOG-MINIMIZE-HISTORY-A CANDIDATE (2026-08-17)

Bundle unico: `−` Converti + `−` Cerca nel dock condiviso; Cronologia da drawer destro a `<dialog id="historyPanel">` floating GIS.

**Candidato:** `7196b30fe0c89acf2bd538640eb2076f012b6380` / **214** / blob `d425ec9a6c0fe4dc9e8f3a7445e6a1f6f6686f9f`  
**LIVE:** invariato `7fb0c20` / **213** (**no deploy**)

**Evidence:** [`../orchestrator/inbox/2026-08-17_2235_gis-dialog-minimize-history-a-evidence.md`](../orchestrator/inbox/2026-08-17_2235_gis-dialog-minimize-history-a-evidence.md)

**Selftest:** **592/592** · `DH_*` 28/28 · `DOCK_GD_*` 40/40 · hunks 70 · OTHER=0 · i18n IT-only

**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** · no deploy · **F NOT OPENED** · Oggetti GIS FROZEN/UNTOUCHED · WU-0012 invariata.

## 34. GIS-DIALOG-MINIMIZE-HISTORY-A REVIEW-EVIDENCE-B (2026-08-17) — verify-only

Evidence-only. Candidato **invariato** `7196b30…` / **214** (blob `d425ec9a…` invariato).

**Evidence:** [`../orchestrator/inbox/2026-08-17_2240_gis-dialog-minimize-history-a-review-evidence-b.md`](../orchestrator/inbox/2026-08-17_2240_gis-dialog-minimize-history-a-review-evidence-b.md) + JSON raw sibling.

**Esiti:** A context-aware GIS+fuori GIS **PASS** · B −/× handler specifici **PASS** · C backdrop/inert **PASS** · D Cronologia dialog, no tabDrawer/right-slide, CSS drawer condiviso conservato **PASS** · E selftest 592/592, DOCK_GD 40/40, Oggetti GIS untouched **PASS**. Live 57/57.

**Gate:** resta **REVIEW GPT-SOSTITUTIVA — PENDING** (verdetto ChatGPT) · **no patch** · **no bump** · **no deploy** · F NOT OPENED · Oggetti GIS FROZEN/UNTOUCHED.

## 35. GIS-DIALOG-MINIMIZE-HISTORY-A DEPLOY + ABQA (2026-08-17)

REVIEW GPT-SOSTITUTIVA **PASS** su `7196b30…`. Deploy GIS-only PASS. ABQA **37/37** PASS · selftest **592/592**.

**LIVE:** `7196b30fe0c89acf2bd538640eb2076f012b6380` / **214** / blob `d425ec9a6c0fe4dc9e8f3a7445e6a1f6f6686f9f`  
**CANDIDATE:** LIVE  
**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7196b30`

**Evidence:** [`../orchestrator/inbox/2026-08-17_2255_gis-dialog-minimize-history-a-deploy-qa.md`](../orchestrator/inbox/2026-08-17_2255_gis-dialog-minimize-history-a-deploy-qa.md)

**Helper:** **0.1.3** invariato · proxy/GH PID invariati · GIS PID `2746464`→`2755555`

**Gate:** **QA FINALE CHATGPT — PENDING** · no finito · **F NOT OPENED** · Oggetti GIS FROZEN/UNTOUCHED · WU-0012 invariata.
