# WU-0019 — D-FLIGHT-PANEL-SIDE-BY-SIDE

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN
**ACTIVE BLOCK:** D-FLIGHT-PANEL-SIDEBYSIDE-AUDIT-A (**AUDIT COMPLETE / EVIDENCE PERSISTED**)
**CURRENT GATE:** GPT AUDIT REVIEW — PENDING
**REVIEW BASE:** monolite tip `67d9cc79c4896adc39b7a38a6828bf4d31346305` · build **200** · `APP_BUILD_ID=D-FLIGHT-ATM09-LEGEND-UX-IMPL-A-FIX2`
**RUNTIME LIVE:** monolite tip `67d9cc79c4896adc39b7a38a6828bf4d31346305` · build **200** · helper **0.1.3** (invariato; audit docs-only)
**CATEGORIA:** DIAGNOSTIC / pre-implementazione **DELICATO** (lifecycle/layout dialog)
**ORIGINE:** backlog QA build 183 candidato **E** — Layout affiancato Zone D-Flight / Dettagli
**NEXT:** review GPT dell’audit → solo dopo PASS definire `D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A`
**NOTE:** nessun patch monolite/helper in AUDIT-A · nessun deploy · nessun ABQA/QA operatore · F/G/H **non** aperti
<!-- /WU-HOT-HEADER -->

**Workstream precedente:** [`WU-0018`](WU-0018-dflight-atm09-legend-ux.md) **CLOSED / PASS** (candidato D).

---

## 1. Scopo

Aprire persistentemente il candidato backlog **E** e documentare, con evidenza di codice, perché oggi i pannelli **Zone D-Flight (UAS)** e **Dettagli zona** si sovrappongono quando aperti insieme, e quale architettura minima (DELICATO) è raccomandata per un futuro `IMPL-A`.

**Questo blocco AUDIT-A:** sola ispezione read-only del monolite + documentazione. Nessuna implementazione runtime.

### Requisito prodotto canonico (futuro IMPL)

Quando entrambi i pannelli sono aperti:

1. preferire disposizione **affiancata** se lo spazio mappa lo consente;
2. evitare sovrapposizione inutile;
3. su spazio insufficiente: fallback/clamp coerente;
4. entrambi raggiungibili;
5. nessun contenuto irraggiungibile o perso.

---

## 2. Baseline

| Voce | Valore |
| --- | --- |
| Repo | `mrhz1973/cursor-coordinate-converter` |
| Branch | `main` |
| HEAD audit | `349774be06c01aa1a0f3130702dbb8881b3513f7` (docs tip post-finito WU-0018) |
| Monolite tip LIVE | `67d9cc79c4896adc39b7a38a6828bf4d31346305` · build **200** |
| Helper | **0.1.3** (non toccato) |
| WU precedente | WU-0018 CLOSED / PASS |
| Candidati F/G/H | **NOT OPENED** (invariati) |

---

## 3. Mappa DOM / CSS / JS

### 3.1 DOM root

| Pannello | Elemento | Classi | Ruolo |
| --- | --- | --- | --- |
| Zone D-Flight (UAS) | `<dialog id="dflightPanel">` | `app-modal dflight-panel` (+ runtime `gis-panel-floating`) | Control panel dataset/master/filtri/legenda |
| Dettagli zona | `<dialog id="dflightDetailsPanel">` | `app-modal dflight-details-panel` (+ runtime `gis-panel-floating`) | Dettaglio zona selezionata |

Struttura comune (entrambi):

- head: `#dflightPanelHead` / `#dflightDetailsPanelHead` (+ `gis-panel-drag-head` a runtime)
- minimize: `[data-role="dflightpanel-minimize"]` / `[data-role="dflightdetailspanel-minimize"]`
- close: `#dflightPanelClose` / `#dflightDetailsPanelClose`
- body: `#dflightPanelBody` / `#dflightDetailsPanelBody`
- resize handles: `[data-role="gis-panel-resize"]` (nw/ne/sw/se/w/e)

Range HTML (approssimativo tip 200): `dialog#dflightPanel` ~14185–14261; `dialog#dflightDetailsPanel` ~14263–14280+.

### 3.2 CSS (responsabilità)

| Area | Selettori / note | Ruolo |
| --- | --- | --- |
| Floating base | `.gis-panel-floating` (~10445) | `position:fixed; margin:0; transform:none; right/bottom:auto` |
| Open/size | `body.gis-mode dialog#dflightPanel…[open]`, `#dflightDetailsPanel…[open]` (~8828–8836) | `width:min(400px,94vw); height:auto; display:flex; flex-direction:column` |
| Scroll body | `#dflightPanelBody` (~8850) | overflow-x hidden; overflow-y da JS |
| Closed | `:not([open])` (~8824) | `display:none` |
| Resize grips | `#dflightPanel` / `#dflightDetailsPanel` handle CSS (~10514+) | hit area e/w/corners |

**Non esiste** CSS di layout twin / grid / `left` distinto per i due pannelli aperti insieme. La posizione XY è **interamente JS**.

### 3.3 Primitive generiche già esistenti (riuso)

| Simbolo | Ruolo | Persistenza |
| --- | --- | --- |
| `gPanelLayouts` | memoria layout session-only `{left,top,w,h,touched,anchor}` | **RAM only** (mai localStorage) |
| `gisPanelSetLayout` / `gisPanelGetLayout` | read/write layout | session |
| `gisPanelApplyLayout` | applica layout touched oppure `gisPanelDefaultRect` | session |
| `gisPanelClampRect` / `gisPanelClampRectPartialVisible` | clamp viewport | — |
| `gisPanelBringToFront` / `gisPanelAttachBringToFront` | z-order 24–29 | session |
| `gisPanelAttachDrag` / `gisPanelAttachResize` | drag head + resize handles | — |
| `gisMinimizePanel` / `gisRestoreMinimizedPanel` / dock | minimize/restore | session (`_gisMinimizedPanels`) |
| `dflightSyncAdaptivePanelGeometry` | max-height / scroll verticale da spazio mappa | — |
| `dflightComputePanelSafeTop` / `UsableRect` / `ClampPanelTop` | Y sotto header GIS | — |
| `dflightPinPanelBelowTopbar` | **default placement** non-touched | — |
| `dflightRestorePanelToSafeTop` | restore minimize → safeTop, left preservato | — |

**Non esiste** un “pair layout” / side-by-side arbitrator. Il candidato **G** (global dock/manager) **non** è necessario per risolvere E in modo locale.

### 3.4 Funzioni D-Flight di apertura/chiusura

| Azione | Funzione | Note |
| --- | --- | --- |
| Apri Zone | `dflightOpenControlPanel` | `show()` → Wire → **Pin** → sync UI / autoload |
| Chiudi Zone | `dflightCloseControlPanel` → `dflightPanelCloseLifecycle` | close dialog; overlay OFF; session dataset **preservata** |
| Apri Dettagli | `dflightOpenDetailsPanel(zone)` | fill body HTML → `show()` → Wire → **Pin** |
| Chiudi Dettagli | `dflightCloseDetailsPanel` | close; flag `_dflightDetailsOpen=false` |
| Selezione zona | `dflightSelectZone(zoneId)` | set selection → `dflightOpenDetailsPanel(zone)` (o close se null) |
| Wire | `dflightWireFloatingPanel(dlg, kind)` | floating + drag/resize + bringToFront + ApplyLayout + geometry |
| Resize window | `dflightEnsurePanelGeometryResize` | listener passivo: SyncAdaptive su entrambi se open |

Flag session-only: `_dflightPanelOpen`, `_dflightDetailsOpen`, `_dflightSelectedZoneId`.

---

## 4. Lifecycle (stato attuale)

```text
[Cataloghi → Zone D-Flight]
        │
        ▼
dflightOpenControlPanel
  → Wire(control) → ApplyLayout (default o touched)
  → Pin(control): se !touched → top=safeTop, left=pad(12)
        │
        ▼  (utente click zona / ATM09 INFO → select)
dflightSelectZone(id)
  → dflightOpenDetailsPanel(zone)
       → Wire(details) → ApplyLayout
       → Pin(details): se !touched → top=safeTop, left=pad(12)   ← STESSO ANCORAGGIO
        │
        ▼
Entrambi aperti, stesso angolo top-left → SOVRAPPOSIZIONE
  z-order: gisPanelBringToFront (ultimo aperto / pointerdown vince)
```

Minimize: `gisMinimizePanel("dflightPanel"|"dflightDetailsPanel", …)` — **non** chiama close lifecycle Zone.  
Restore: `gisRestoreMinimizedPanel` → branch D-Flight → `dflightRestorePanelToSafeTop` (Y=safeTop, left da layout).

Esc / close X: wiring in `dflightEnsureUiWired` (~37292+). Close Details azzera selezione e ridisegna overlay.

---

## 5. Finding / root cause

### RC-1 (primaria) — default pin identico

`dflightPinPanelBelowTopbar` (~36879–36899), per **entrambi** i `kind` (`"control"` | `"details"`), se `gPanelLayouts[key].touched` è falso:

- `top = dflightComputePanelSafeTop(...)` (stesso safeTop)
- `left = opts.pad` (**12** per entrambi)

Quindi al primo open di Dettagli mentre Zone è già aperto (caso tipico post-selezione), i due dialog si ancorano **nello stesso rettangolo**. Non c’è offset orizzontale né “place beside sibling”.

Evidenza: `_dflightPanelLayoutOpts` differenzia solo `defaultW` (340 vs 380) e height fraction — **non** `defaultLeft` / anchor twin.

### RC-2 — assenza di arbitrator twin

Nessuna funzione tipo `dflightLayoutOpenPanelsPair` / side-by-side. `dflightSyncAdaptivePanelGeometry` gestisce solo **altezza/scroll** e clamp **Y**, non collisione orizzontale tra i due.

### RC-3 — z-order maschera, non risolve

`gisPanelBringToFront` (range z 24–29) rende recuperabile il pannello sotto al click, ma **non** evita la sovrapposizione geometrica. L’utente deve spostare a mano (drag) per vedere entrambi.

### RC-4 (secondaria, non blocker E) — occluder map

`GIS_MAP_FLOATING_OCCLUDER_IDS` (~51661) **non** include `dflightPanel` / `dflightDetailsPanel`. La camera “usable rect” ignora questi pannelli. Fuori scope stretto di E; utile nota per IMPL o candidato G futuro — **non** è collisione strutturale con G.

### Perché non affiancati oggi

Perché il placement di default è **indipendente e identico**, non perché manchino primitive di clamp/drag. Il prodotto chiede twin layout; il codice fornisce solo due floating panels autonomi.

---

## 6. Matrice rischi (futuro IMPL-A)

| ID | Rischio | Severità | Mitigazione |
| --- | --- | --- | --- |
| R1 | Toccare lifecycle close Zone (overlay OFF) mentre si riposiziona | Alta | Non modificare `dflightPanelCloseLifecycle` salvo necessità; side-by-side solo in open/geometry |
| R2 | Interferire con `touched` user drag | Alta | Twin layout solo se Details non-touched **oppure** overlap rilevato al pair-open; rispettare touched |
| R3 | Viewport stretto: due pannelli non entrano affiancati | Media | Fallback: stack verticale con offset Y, o clamp + bringToFront + entrambi ≥ partial visible |
| R4 | Mobile / 94vw width | Media | Se `2*minW + gap > usableW` → non forzare side-by-side |
| R5 | Race Wire→Pin→ApplyLayout | Media | Un solo punto di pair-layout dopo entrambi open (es. fine `OpenDetails` / resize) |
| R6 | Espandere a global manager (G) | Alta (scope) | **Vietato** in IMPL-A E; riuso primitive esistenti sì |
| R7 | Persistenza layout | Alta (invariante) | Solo `gPanelLayouts` RAM; **no** localStorage nuovo |
| R8 | Occluder map incompleto | Bassa | Opzionale in IMPL-A o backlog; non blocker |

**Blocker strutturale per E?** **NO.** Nessuna dipendenza obbligatoria da candidato G, nessun nuovo storage, nessun helper/endpoint.

---

## 7. Opzioni architetturali

### A — Soluzione locale minima D-Flight

Aggiungere una funzione scoped, es. `dflightEnsurePairLayout()`, chiamata da:

- fine di `dflightOpenDetailsPanel` (quando Zone già open);
- fine di `dflightOpenControlPanel` (quando Details già open);
- opzionalmente resize window (dopo SyncAdaptive).

Comportamento:

1. se entrambi open e non minimized;
2. se spazio orizzontale ≥ `wControl + gap + wDetails` (con minW);
3. allora: Zone a sinistra (safeTop, pad), Details a `left = zone.right + gap` (clamp destra);
4. altrimenti fallback (vedi acceptance): offset verticale o leave + ensure both partially visible;
5. **non** resettare posizione se `touched` sul pannello che si sta riposizionando (salvo overlap totale).

Pro: scope E; DELICATO ma confinabile. Contro: logica twin solo D-Flight.

### B — Riuso primitive generiche esistenti (senza nuovo manager)

Come A, ma implementata **solo** tramite `gisPanelSetLayout` / `gisPanelApplyLayout` / `gisPanelClampRect` + misura `getBoundingClientRect` dei due dialog. Nessuna nuova macchina di stato globale; nessun dock manager.

Pro: allineata allo stack già usato da Track/Waypoints/… Contro: ancora codice D-Flight-specific per la *policy* twin (accettabile).

### C — Alternativa ampia (OUT OF SCOPE → candidato G)

Global GIS panel/minimized dock manager che orchestra tutte le modal floating, dock etichette, usable-map occluders, policy anti-overlap generica.

**OUT OF SCOPE per WU-0019 / IMPL-A E.** Appartiene al candidato **G** (roadmap §11). Non aprirlo qui.

---

## 8. Raccomandazione

**Raccomandata: opzione B** (policy locale D-Flight + primitive `gisPanel*` / `dflight*Geometry` esistenti).

Motivazione tecnica:

1. La root cause è un **default pin identico**, non assenza di infrastruttura floating.
2. Le primitive di layout/clamp/drag/z/minimize sono già mature e session-only.
3. Un arbitrator twin a due ID noti (`dflightPanel`, `dflightDetailsPanel`) è sufficiente per il requisito prodotto E.
4. Evita di anticipare G (dock globale, branding H, workspace F).
5. Categoria resta **DELICATO** (lifecycle dialog) ma con superficie chirurgica: open Details / open Zone / resize — non close lifecycle overlay.

IMPL-A futuro: **DELICATO** con review tier appropriata (Regola B), non ROUTINE cosmetico.

---

## 9. Acceptance matrix — futuro `D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A`

| # | Scenario | Atteso |
| --- | --- | --- |
| A1 | Zone open → select zone → Details open; desktop largo | Details a destra di Zone (o affiancati senza overlap material); entrambi leggibili |
| A2 | Entrambi open; utente ha già dragged Details (`touched`) | Non “rubare” la posizione user salvo overlap totale documentato |
| A3 | Viewport stretto / mobile (`2×minW` non entra) | Fallback: no side-by-side forzato; entrambi raggiungibili (offset Y / clamp / bringToFront); niente contenuto perso |
| A4 | Minimize Zone + Details resta | Details resta usabile; restore Zone non ricopre Details se pair-layout re-run intelligente |
| A5 | Minimize Details + Zone resta | Zone usabile; restore Details ripristina pair se !touched |
| A6 | Close Details (X) | Details chiuso; Zone invariato in posizione |
| A7 | Close Zone (X / lifecycle) | Overlay OFF come oggi; Details chiuso via path esistente se applicabile; **non** regressione VR-FIX2 |
| A8 | Resize window | Clamp verticale esistente OK; pair ricalcolato se entrambi open e policy lo prevede |
| A9 | Drag / resize handles | Continuano a funzionare; layout session-only |
| A10 | Nessun localStorage nuovo; `state.mapWaypoints` invariato; helper 0.1.3 invariato | Pass statico |
| A11 | Selftest deterministic: mock entrambi open → assert left Details ≥ right Zone + gap (desktop fixture) | Pass |
| A12 | OPSEC / rete / GPS invariati | Pass |

---

## 10. STOP conditions (IMPL futuro)

Fermarsi / non dichiarare READY se:

- serve un global panel manager (→ aprire G esplicitamente);
- serve persistence layout su disco;
- si deve cambiare semanticamente `dflightPanelCloseLifecycle` / overlay OFF oltre il minimo;
- regressione minimize/restore o Esc order;
- scope drift verso F (due legende) o H (branding).

---

## 11. Simboli / range da riesaminare nel pass runtime IMPL-A

| Simbolo | Tip ~build 200 (indicativo) | Perché |
| --- | --- | --- |
| `_dflightPanelLayoutOpts` | ~36677 | eventuale `defaultLeft` / gap twin |
| `dflightPinPanelBelowTopbar` | ~36879 | oggi left=pad identico |
| `dflightOpenDetailsPanel` | ~37085 | hook pair-layout |
| `dflightOpenControlPanel` | ~37051 | hook pair se Details già open |
| `dflightWireFloatingPanel` | ~36994 | ordine ApplyLayout vs Pin |
| `dflightSyncAdaptivePanelGeometry` | ~36765 | non rompere clamp Y |
| `dflightRestorePanelToSafeTop` | ~36840 | restore minimize |
| `dflightSelectZone` | ~36651 | trigger Details |
| `dflightEnsureUiWired` | ~37292 | minimize/close wiring |
| `gisRestoreMinimizedPanel` branch dflight | ~74678–74691 | restore path |
| `gisPanelSetLayout` / `ApplyLayout` / `ClampRect` | ~74737+ | riuso |
| `gisPanelBringToFront` id list | ~74310 | già include entrambi |
| CSS open dialogs | ~8824–8853 | width 400/94vw |
| HTML dialogs | ~14185–14280 | DOM invariato preferibile |
| `GIS_MAP_FLOATING_OCCLUDER_IDS` | ~51661 | **opzionale** aggiungere i due id |

**Non toccare in IMPL-A E:** helper D-Flight; ATM09 legend UX; candidato F/G/H; `state.mapWaypoints`.

---

## 12. Esito AUDIT-A

| Voce | Valore |
| --- | --- |
| Audit | **COMPLETE** |
| Blocker strutturale | **NO** |
| Collisione inevitabile con G | **NO** (G resta OUT OF SCOPE; E locale fattibile) |
| READY per definire IMPL-A | **SÌ** dopo **GPT AUDIT REVIEW — PASS** |
| Monolite questo pass | **byte-invariato** |
| Gate | **GPT AUDIT REVIEW — PENDING** |

---

## 13. Riferimenti

- Roadmap candidato E: [`WU-0005-0009-roadmap.md`](WU-0005-0009-roadmap.md) § backlog D-Flight E + §10 “Pannello D-Flight + Dettagli affiancati”
- Candidato G (non aprire): stesso file §11 Global modal / minimized dock
- WU-0018 CLOSED: [`WU-0018-dflight-atm09-legend-ux.md`](WU-0018-dflight-atm09-legend-ux.md)
- OM §4 Regola B (DELICATO) · §7.1 FRONTIER
