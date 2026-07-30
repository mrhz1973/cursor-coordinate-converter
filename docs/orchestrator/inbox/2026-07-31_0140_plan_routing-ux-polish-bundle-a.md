# ROUTING-UX-POLISH-BUNDLE-A — Piano rettificato (READ-ONLY)

Repo: `mrhz1973/cursor-coordinate-converter`
File runtime: `coordinate_converter Claude.html`
Modalità: piano docs-only (nessuna scrittura codice runtime, nessun deploy, nessun `finito`).
Stato: **PIANO RETTIFICATO** — correzioni A–G applicate obbligatoriamente rispetto alla bozza Plan mode.

**Build / commit:** proposte solo per la successiva implementazione; **non** applicate in questa fase.

- `APP_BUILD_ID` proposto: `B6.2UX-A`
- `APP_BUILD_NUM` proposto: `85`
- Display proposto: `B6.2UX-A · build 85`
- Commit runtime futuro proposto: `feat(routing): add undo, units and planner feedback`

---

## 1. Pre-flight

Eseguito al salvataggio memoria (2026-07-31):

```text
git status --short        → (vuoto)
git branch --show-current → main
git rev-parse HEAD        → c3c307d0b8c1140f29ecb7bebe3c9a1b97c1e8e0
git rev-parse origin/main → c3c307d0b8c1140f29ecb7bebe3c9a1b97c1e8e0
git ls-remote origin refs/heads/main → c3c307d0b8c1140f29ecb7bebe3c9a1b97c1e8e0
git rev-parse HEAD:"coordinate_converter Claude.html" → 79ba3e6556198c1a2509594f4947f8526e2872d6
```

## 2. Conferma baseline

| Campo | Atteso | Rilevato | Esito |
|---|---|---|---|
| Repo root | `cursor-coordinate-converter` | OK | PASS |
| Branch | `main` | `main` | PASS |
| HEAD | `c3c307d` | `c3c307d` | PASS |
| origin/main | `c3c307d` | `c3c307d` | PASS |
| ls-remote main | `c3c307d` | `c3c307d` | PASS |
| Blob monolite | `79ba3e65…` | `79ba3e65…` | PASS |
| Build live | `B6.1RSD-A · build 84` | — (runtime) | n/a |
| Working tree | pulito | pulito | PASS |

Ultimo blocco: **ROUTING-SUMMARY-DEDUP-A** — CLOSED / PASS end-to-end. WU-0010 OPEN per Bundle F futuro.

## 3. Classificazione ROUTINE/DELICATO per item

| Item | Tocca storage? | OPSEC/rete? | Create-path? | Lifecycle modale? | Fonti canoniche? | Classe |
|---|---|---|---|---|---|---|
| A. Undo ultimo punto | no | no | no | no | no (`state.mapWaypoints[]` non toccato) | **ROUTINE** |
| B. Unità display | no (session-page, fuori `saveStore`) | no | no | no | no (canoniche in metri) | **ROUTINE** |
| C. Indicatore punto attivo | no | no | no | no | no (derivato `pickMode`/`pickTargetId`) | **ROUTINE** |
| D. Feedback punti insufficienti | no | no | no | no | no (**elemento dedicato** `#routingPointsFeedback`, non `#routingPlannerStatus`) | **ROUTINE** |
| E. Focus risultato | no | no | no | no | no (preserva `routingFitMapToRoutePreview`) | **ROUTINE** |

Bundle unico **ROUTINE**. Cinque item. Nessun item escluso per delicatezza.

## 4. Item esclusi / out-of-scope

Non includere: ROUTING-PROFILE-EDIT-A; TRACK-PROFILE-POINTS-DISPLAY-A; MAP-CENTER-VIEWPORT-AWARE-A; metriche pendenza/grade; gate OPSEC/forced-offline/consenso rete/provider; Bundle F; gateway API; storage / nuovi campi persistiti; nuovi endpoint/fetch; modifica salvataggio Routing→Saved Track; refactor generale planner; nuovi modal; confirm per Undo.

**Limite noto:** FR routing dictionary preesistente è parziale. Il bundle aggiunge le **proprie** chiavi nuove in IT/EN/FR ma **non** chiude il gap FR storico (fuori scope).

## 5. Regioni HTML/CSS/JS coinvolte

### 5.1 HTML (`#routingPlannerPanel`, ~13287–13412)

| Regione | Modifica |
|---|---|
| `.routing-panel-actions` (~13378) | +`#routingUndoLastPointBtn` (secondary/ghost) |
| Sotto lista punti / sopra result card | +`#routingPointsFeedback` (`role="status"` `aria-live="polite"` `hidden`) |
| Sotto actions, prima di loopback | +`.routing-units-row` (label + chip km/mi + chip m/ft) |
| `#routingResultCard` | +`tabindex="-1"` (accessibile per focus programmatico) |
| Righe punti (JS) | `.routing-pt-badge` riceve `data-active` da `pickMode`/`pickTargetId` |

### 5.2 CSS (blocco routing ~8797–9244)

Additive: badge `data-active`; `.routing-units-row` / chip `.is-active`; `#routingPointsFeedback` (+ `:empty`, `.is-warn`); Undo `aria-disabled` opacity; dark theme override; mobile wrap.

### 5.3 Funzioni JS esatte

| Funzione | Linea ~ | Modifica |
|---|---|---|
| `routingEnsureState()` | 60480 | non ospita unità (vedi §6 store page-session) |
| `routingFullCleanup()` | 61342 | **non** azzera unità page-session |
| NUOVA `routingGetUnitsPrefs()` / `routingSetUnitsPrefs()` | — | legge/scrive store page-session |
| `routingRenderList()` | 61395 | badge `data-active`; sync feedback + undo UI |
| NUOVA `routingRemoveLastPoint()` | — | Undo fail-closed (§8C) |
| `routingInvalidateRoutePreview()` | 60960 | riusata da Undo; non chiama GH |
| `routingSyncCalculateBtnUi()` | 60633 | +sync feedback + undo |
| NUOVA `routingSyncUndoBtnUi()` | — | enable/disable secondo contratto C |
| NUOVA `routingSyncPointsFeedback()` | — | scrive solo `#routingPointsFeedback` |
| `routingRenderAltitudePanel()` | 63132 | card + asse + tooltip via formatter unità |
| NUOVI wrapper formatter | — | distanza/quota unit-aware (interni metri) |
| Call site asse/tooltip (37668, 63689, 37091, …) | — | stesso wrapper unità coerente |
| Success path `routingCalculateRouteGraphhopper` | 62063–62087 | +`routingFocusResultAfterSuccess()` |
| NUOVA `routingFocusResultAfterSuccess()` | — | contratto E |
| `routingFitMapToRoutePreview()` | 61852 | **invariata** |
| `openRoutingPlannerPanel()` | 64315 | wire units; sync UI; **riusa** prefs page-session |
| NUOVA `routingWireUnitsRowOnce()` | — | chip → prefs → re-render card+profilo |

## 6. Modello di stato — CORREZIONE A (unità session-only reali)

### 6.1 Preferenze unità (page-session, non panel-lifetime)

**Problema della bozza:** mettere `unitsDistance`/`unitsAltitude` dentro `state._routing` le faceva sparire con `routingFullCleanup()` alla chiusura pannello → non erano “session-only” reali.

**Contratto rettificato:**

- distanza: `km` \| `mi`
- quota/dislivelli: `m` \| `ft`
- sopravvivono a **chiusura e riapertura** del pannello Routing
- si azzerano **solo al reload** della pagina
- **nessun** `localStorage`
- **nessun** ingresso in `saveStore`
- **non** eliminate da `routingFullCleanup()`

**Implementazione proposta:** store transiente **separato** dal lifecycle del pannello, es.:

```js
// modulo-level (fuori state._routing), reset solo al reload pagina
const _routingUnitsPrefs = {
  distance: "km", // "km" | "mi"
  altitude: "m"   // "m" | "ft"
};
```

- Letto da: formatter, chip UI, `routingRenderAltitudePanel`, asse/tooltip profilo
- Scritto da: `routingWireUnitsRowOnce` / `routingSetUnitsPrefs`
- `routingEnsureState` / `openRoutingPlannerPanel`: **riusa** `_routingUnitsPrefs` (non reset)
- `routingFullCleanup`: **non tocca** `_routingUnitsPrefs`

Alternative accettabile: campo su `state` top-level transient (es. `state._routingUnitsPrefs`) con commento esplicito “session-only, not persisted, survives panel close” e **escluso** da snapshot/`saveStore`/sanitize persistito — stesso contratto.

### 6.2 Altri campi

| Campo | Dove | Note |
|---|---|---|
| Indicatore attivo | derivato `pickMode` + `pickTargetId` | nessun nuovo campo |
| Feedback punti | DOM `#routingPointsFeedback` | nessun flag persistito |
| Undo confirm | **nessuno** | Undo senza confirm |

Nessuna duplicazione metriche canoniche. Valori interni sempre metri.

## 7. UX e gerarchia

- Mappa centrale; pannello non invasivo; larghezza ridotta; nessun nuovo modal
- Contenuti e azioni principali sopra; unità **secondarie in basso**
- Un solo primary: **Calcola**
- Undo: secondary/ghost
- Badge attivo da pick; sparisce al disarmo
- Tema chiaro/scuro via variabili esistenti
- Navigazione tastiera; `aria-live="polite"` senza rumore

Layout top→bottom (sintesi): Header → Status → Provider → Endpoint → Profile → Points list → **`#routingPointsFeedback`** → Actions (Calcola · Undo · Via · Inverti · Salva) → Save form → Result card → **Units row** → Loopback.

## 8. Contratti item rettificati

### 8A. OUTDOOR-ROUTING-POINT-UNDO-A — CORREZIONE C

Contratto definitivo Undo:

- abilitato se esiste **almeno un punto** e non ci sono stati incompatibili
- disabilitato durante `requestLoading` / `infoLoading`
- disabilitato durante marker drag
- disabilitato durante **qualsiasi** pick Routing attivo (`pickMode === true`)
- **nessun** disarmo automatico del pick
- **nessuna** cancellazione durante stato incompatibile (fail-closed)
- **nessun** ricalcolo automatico GraphHopper
- rimozione consentita anche da **1 → 0** punti
- rimuove solo l’ultimo elemento dell’array punti Routing
- `state.mapWaypoints[]` invariato
- invalida preview, metriche, profilo, risultato; aggiorna marker/lista/controlli

### 8B. OUTDOOR-ROUTING-UNITS-A — CORREZIONI A + B

- Prefs page-session (§6.1)
- Applicazione **coerente** a tutti i valori Routing visibili pertinenti:
  - distanza nelle card
  - quota nelle card
  - salita e discesa
  - **asse distanza del profilo**
  - **asse quota**
  - **tooltip del profilo**
  - eventuali label metriche Routing correlate
- **Non** lasciare card in mi/ft e grafico in km/m contemporaneamente
- Interni invariati: coordinate, geometria, `routeMetrics` canoniche (metri), GraphHopper in memoria, richiesta API, salvataggio → Saved Track
- Selettori secondari in basso; i18n IT/EN/FR
- Riuso formatter esistenti: `formatMapMeasureDistance(meters, unit)` (+ wrapper routing); non inventare conversioni canoniche

### 8C. Indicatore punto attivo

- Badge/evidenza vicino lista; distingue A / B / intermedi
- Derivato da `pickMode` / `pickTargetId`
- Nessuna selezione persistente; sparisce al disarmo
- Nessuna modifica geometria; nessuna interferenza altri pick/BBOX

### 8D. Feedback punti insufficienti — CORREZIONE D

- Elemento dedicato **`#routingPointsFeedback`**
- **Non** riusare `#routingPlannerStatus` per il messaggio ordinario zero/uno punti
- Mostra messaggio zero punti; messaggio un punto; hide con ≥2 punti validi
- Hide durante loading; non sovrascrive errori provider/GH né successi operativi
- `role="status"` + `aria-live="polite"`
- Nessun alert/prompt/confirm
- CTA Calcola resta disabilitato/protetto come oggi (`routingSyncCalculateBtnUi`)

### 8E. Focus risultato — CORREZIONE E

- `tabindex="-1"` su `#routingResultCard`
- `focus({ preventScroll: true })` **solo se**, a fine richiesta riuscita, `document.activeElement` è ancora il pulsante Calcola
- `scrollIntoView({ block: "nearest" })` dopo il focus; negli altri casi scroll senza focus
- Nessun focus se activeElement è input/select/contenteditable
- Nessun secondo fit/pan/zoom mappa
- Rispetto `prefers-reduced-motion: reduce` (es. `behavior: "auto"` se reduce)
- Nessuno scroll dell’intera pagina

## 9. i18n

Chiavi nuove (IT/EN/FR), nessun `data-i18n-html` nuovo:

| Chiave | IT | EN | FR |
|---|---|---|---|
| `routing.undoLastPoint` | Annulla ultimo punto | Undo last point | Annuler le dernier point |
| `routing.undoLastPointTip` | Rimuove l'ultimo punto senza ricalcolare | Removes the last point without recalculating | Supprime le dernier point sans recalculer |
| `routing.unitsLabel` | Unità | Units | Unités |
| `routing.unitsDistance` | Distanza | Distance | Distance |
| `routing.unitsAltitude` | Quota | Elevation | Altitude |
| `routing.unitsKm` / `Mi` / `M` / `Ft` | km / mi / m / ft | idem | idem |
| `routing.needsPointsStart` | Aggiungi almeno partenza e destinazione | Add at least start and destination | Ajoutez au moins départ et arrivée |
| `routing.needsPointsEnd` | Aggiungi la destinazione | Add the destination | Ajoutez la destination |
| `routing.activePointBadge` | Punto attivo {0} | Active point {0} | Point actif {0} |

Riutilizzo: `routing.routeReady`, `routing.minimumPoints` (delete path), `routing.errorInvalidPoints` (validazione GH — **non** per feedback ordinario zero/uno).

## 10. Accessibilità

- Feedback dedicato polite; badge attivo con aria-label
- Chip `aria-pressed`
- Undo `aria-disabled`/`disabled` secondo contratto C
- Focus risultato secondo contratto E (`tabindex="-1"`, `preventScroll`, reduced-motion)
- Tema scuro: contrasto chip/badge/feedback

## 11. Invarianti

- `state.mapWaypoints[]`, track/GIS stores non toccati
- Metriche/coordinate canoniche in metri
- Nessuna conversione GraphHopper in memoria
- `routingFitMapToRoutePreview` single-shot invariata
- Pick mutual disarm esistente invariato (Undo **non** disarmà)
- Save-as-track invariato
- Nessun storage / OPSEC / fetch nuovo

## 12. Rischi e mitigazioni

| Rischio | Mitigazione |
|---|---|
| Undo durante pick | bottone disabilitato; nessun disarmo auto |
| Undo durante drag/loading | bottone disabilitato |
| Unità spariscono a close panel | store page-session fuori `_routing` |
| Card vs chart unità diverse | stesso wrapper su card + assi + tooltip |
| Focus ruba input velocità | solo se activeElement === Calcola |
| Feedback vs errori/status | canale dedicato; hide se loading/errori |

## 13. Test automatici

Harness fuori repo (`C:\tmp\_routing_ux_polish_harness.js`) + estrazione JS + `node --check`:

- formatter distanza/quota per unit
- prefs sopravvivono a cleanup panel simulato; reset solo “reload”
- Undo: 1→0; refuse se pick/loading/drag; no GH
- feedback: 0/1 show; ≥2 hide; loading hide
- focus helper: focus solo se active === Calcola

## 14. QA browser

### Undo
- zero punti → disabled; un punto → remove → 0; due+; dopo route; durante pick → disabled (no disarm); durante drag → disabled; durante loading → disabled; marker/lista coerenti; no auto GH

### Unità — CORREZIONE F
- km/m default; mi/ft; cambio con route valida; cambio velocità
- **chiusura e riapertura pannello → unità conservate**
- **reload completo pagina → default km/m**
- Saved Track / Mappa / Poligoni invariati
- nessun campo persistito
- card **e** profilo (assi/tooltip) coerenti sulla stessa unità

### Indicatore attivo
- A / B / intermedio; disarmo; cambio target; conflitto BBOX; SR

### Punti insufficienti
- zero / uno / due; post-delete dopo route; no collisione loading/errori; canale dedicato

### Focus risultato
- mouse; tastiera; Calcola ancora focus → focus card; input velocità attivo → no focus; panel stretto; reduced-motion; no doppio fit; no scroll pagina

## 15. QA operatore futura

Solo IT. URL VPS `?v=<runtime-short-sha>`. Narrativa minima QA-CHECKLIST. Trigger Regola H: `QA ROUTING-UX-POLISH-BUNDLE-A PASS operatore` → auto-`finito`.

## 16. Stima diff — CORREZIONE G

| Area | Stima |
|---|---|
| HTML | ~30 |
| CSS | ~50 |
| JS (stato page-session, Undo, feedback, units wrapper, wire, focus, sync) | ~160 |
| i18n IT/EN/FR | ~36 |
| **Totale** | **~245–280** |

**Nota soglia:** circa **245+ righe è sopra la soglia di 50** linee; il requisito di **piano preventivo è soddisfatto** dal presente piano. **Nessun refactor strutturale** previsto (solo addizioni localizzate).

## 17. Build / commit (proposte, non applicate ora)

Vedi intestazione. Implementazione successiva: bump `APP_BUILD_ID`/`APP_BUILD_NUM`, commit monolite con messaggio proposto, deploy GIS-only, QA IT, Regola H.

## 18. git status / diff di questa fase docs

Solo memoria orchestratore (vedi commit autosync di questo intervento). Monolite **non** modificato.

## 19. Conferma nessun runtime toccato in questa fase

- `coordinate_converter Claude.html` **non** modificato
- nessun deploy
- nessun `finito`
- OM / HANDOFF / roadmap / WU-0010 **non** aggiornati (stato runtime vivo invariato)

## 20. Gate

**PLAN READY ROUTING-UX-POLISH-BUNDLE-A** (rettificato A–G)

**PLAN SAVED ROUTING-UX-POLISH-BUNDLE-A** — dopo commit/push memoria orchestratore.
