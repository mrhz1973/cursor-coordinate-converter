# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4 — REVIEW-RAW-RECOVERY-FIX4

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4`  
**PASS:** `REVIEW-RAW-RECOVERY-FIX4`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (invariato; FRONTIER / WU-HOT-HEADER **non** toccati)  
**Verdetto review:** **NON EMETTERE** (evidence-only per GPT sostitutiva)  
**Deploy / ABQA / QA operatore / finito / build bump / monolite:** **NON ESEGUITI** — candidate **immutabile**  
**Selftest 793/793 (RPCF4 24/24):** **non rieseguito** (candidate immutato)

Linee citate = blob candidate **225** (working tree byte-identico al blob, verificato sotto).

Evidence FIX4 già persistita: [`2026-08-18_1853_outdoor-routing-f-provider-compare-a-fix4.md`](2026-08-18_1853_outdoor-routing-f-provider-compare-a-fix4.md).

---

## 1. ANCHOR — RUNTIME_CANDIDATE_SHA

| Campo | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `f1d9fc0540f8073d5e79f59164237a951e80215c` |
| Subject | `feat(routing): FIX4 params layout, multi-trace colors, ring warn, build 225` |
| Files nel commit | **solo** `coordinate_converter Claude.html` (+581 / −151) |
| Base 224 (FIX3) | `d4558419c7139a4587389528d76bd82395ada100` |
| `APP_BUILD_ID` | `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4` |
| `APP_BUILD_DETAIL` | `Routing params layout, multi-trace colors, ring warn, tab next-point (FIX4).` |
| `APP_BUILD_NUM` | **225** |
| Blob git monolite | `8f9a6abe796adbfbab17d5ded1d9542efa70c306` |
| Bytes LF | `10682160` (blob LF puro: working tree = 10682160 byte, 0 CRLF, `hash-object` = blob) |
| SHA-256 LF | `800b4159897df1c425d0bee89c37fcce0a78f622c3b39ae3f2c54c7f80a48c21` |
| Helper | **0.1.3** invariato (commit tocca solo l'HTML; nessun file helper nel delta) |

Costanti build nel blob (`24076–24079`):

```javascript
const APP_BUILD_ID = "OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4";
const APP_BUILD_DETAIL = "Routing params layout, multi-trace colors, ring warn, tab next-point (FIX4).";
const APP_BUILD_NUM = 225;
```

Verifica anchor dal candidate esatto:

```text
git rev-parse f1d9fc0540f8073d5e79f59164237a951e80215c:"coordinate_converter Claude.html"
8f9a6abe796adbfbab17d5ded1d9542efa70c306
git hash-object -- "coordinate_converter Claude.html"   (working tree)
8f9a6abe796adbfbab17d5ded1d9542efa70c306
```

**NON** usare HEAD / current container come sostituto di `RUNTIME_CANDIDATE_SHA`.  
HEAD locale al momento dell'anchor (docs container post-candidate, **non** il candidate runtime): `9b445f8bf7419f5b17679d137f18f0dd4ca66c1b`.

## 2. REMOTE_HEAD_AT_EVIDENCE_TIME (separato)

Attestazione **prima** del commit docs di questo recovery:

```text
git ls-remote origin refs/heads/main
9b445f8bf7419f5b17679d137f18f0dd4ca66c1b	refs/heads/main
```

**REMOTE_HEAD_AT_EVIDENCE_TIME** = `9b445f8bf7419f5b17679d137f18f0dd4ca66c1b`

Un successivo commit docs-only può avanzare `origin/main`: **non** cambia `RUNTIME_CANDIDATE_SHA`.

---

## 3. RAW — PARAMETRI / LAYOUT / TAB

### 3.1 Gruppo unico Profilo + Velocità media + Calcola (`15176–15205`)

`#routingParamsRow` = `role="group"` con `data-i18n-aria="routing.paramsRowAria"`; contiene nell'ordine `.routing-profile-row` (label + `#routingProfileSelect`), `#routingSpeedRow` (label + `#routingSpeedSelect` + `#routingSpeedCustom` + `#routingSpeedSummary`) e `#routingCalculateBtn`:

```html
    <div id="routingParamsRow" class="routing-params-row" role="group" data-i18n-aria="routing.paramsRowAria" aria-label="Profilo, velocità e calcolo">
    <div class="routing-profile-row">
      <label class="routing-profile-label routing-section-heading" for="routingProfileSelect" data-i18n="routing.profile">Profilo</label>
      <select id="routingProfileSelect" class="routing-profile-select" ...>
    ...
      <div class="routing-speed-row" id="routingSpeedRow">
        <label for="routingSpeedSelect" data-i18n="routing.avgSpeed">Velocità media</label>
        <select id="routingSpeedSelect" class="routing-speed-select" ...>
    ...
        <button type="button" id="routingCalculateBtn" class="btn btn-sm btn-primary" disabled
                data-i18n="routing.calculate" ...>Calcola percorso</button>
    </div>
```

### 3.2 Gruppo **prima** dei punti (`15176` < `15206`)

Ordine in `#routingPlannerPanelBody`: status → nota servizio → details provider chiuso → **`#routingParamsRow`** → `#routingPointsList` (`15206`) → `#routingRouteOptionsZone` (`15208`).

Selftest: `RPCF4_params_group` (contiene prof+speed+calc), `RPCF4_params_before_points` (`compareDocumentPosition` FOLLOWING), `RPCF4_speed_not_in_result` (speed fuori dalla result card), `RPCF4_calc_not_in_mode` (`90379–90383`).

### 3.3 Zona Alternative + Confronto compatta sotto i punti (`15208–15251`)

Stesso contenitore `#routingRouteOptionsZone` ospita `#routingAlternativesRow` **e** `#routingCompareSection` (nessun margine extra tra i due). CSS (`9849–9871`):

```css
.routing-params-row{ display:flex; flex-wrap:wrap; align-items:center; gap:8px 10px; padding:4px 0 6px; }
.routing-route-options-zone{ display:flex; flex-direction:column; gap:4px; padding:6px; border:1px solid ...; border-radius:8px; ... }
```

Selftest `RPCF4_zone_compact_css` (computed `paddingTop <= 8`).

### 3.4 Tab / Shift+Tab / ultimo punto → Calcola (`85028–85067`)

```javascript
function routingPointLabelHandleTab(ev, fromEl){
  if (!ev || !fromEl || ev.key !== "Tab") return false;
  const row = fromEl.closest && fromEl.closest(".routing-point-row");
  if (!row) return false;
  const rows = ... list.querySelectorAll(".routing-point-row") ...
  if (ev.shiftKey){
    if (idx > 0){ ev.preventDefault(); rows[idx - 1].querySelector("input.routing-pt-field").focus(); return true; }
    return false;                       // primo punto: Shift+Tab nativo (nessun trap)
  }
  ...
  if (idx >= 0 && idx < rows.length - 1){ ev.preventDefault(); rows[idx + 1].querySelector("input.routing-pt-field").focus(); return true; }
  const nextCtl = document.getElementById("routingCalculateBtn") || ...;
  if (nextCtl){ ev.preventDefault(); nextCtl.focus(); return true; }   // ultimo punto → Calcola
}
```

- **Tab** da punto corrente → `input.routing-pt-field` della **riga successiva**; se dropdown aperto, prima fermata = pulsante *Chiudi risultati* (`[data-routing-search-dismiss]`).
- **Shift+Tab** → riga precedente; alla prima riga `return false` = comportamento nativo (nessun focus trap).
- **Ultimo punto** → `#routingCalculateBtn` (fallback chain Calcola → Confronta → mode row).
- Nessun micro-ciclo pick: selftest `RPCF4_no_focus_trap_pick` — `data-routing-act="pick"` **assente** dalla funzione. Grip `tabindex="-1"` invariato.
- Wiring: tre call-site keydown (`93886–93891`). Selftest `RPCF4_tab_next_point` (`90445–90446`).

---

## 4. RAW — MULTI-TRACCIA PER PROVIDER

### 4.1 `routingCollectPreviewOverlayTracks` (`86557–86599`)

```javascript
function routingCollectPreviewOverlayTracks(){
  ...
  function pushPack(provider, pack, activeKey){
    if (!pack || pack.status !== "pass") return;
    const alts = Array.isArray(pack.alternatives) && pack.alternatives.length
      ? pack.alternatives
      : [{ previewCoordinates: pack.previewCoordinates }];
    for (let i = 0; i < alts.length && i < 3; i++){          // fino a 3 route per provider
      const pts = alts[i] && alts[i].previewCoordinates;
      if (!pts || pts.length < 2) continue;                   // niente alternative inventate
      const key = provider + ":" + i;
      out.push({ id: provider, provider: provider, altIndex: i, key: key, pts: pts, active: activeKey === key, main: i === 0 });
    }
  }
  const compareLive = !!(_routingCompareSession && !_routingCompareSession.chosen && (...pass...));
  if (compareLive){
    const active = (r && r.activeOverlayKey) || "";
    pushPack("gh", _routingCompareSession.gh, active);
    pushPack("ors", _routingCompareSession.ors, active);
    if (out.length && !active){ for (...) out[i].active = false; }   // nessuna attiva senza selezione
    return out;
  }
  const provider = routingStyleProviderKey(r);                 // provider attivo / scelto
  ... alts >= 2 → fino a 3 tracce (active = selectedAlternative) ; else singola main attiva ...
}
```

- **Fino a 3 route per provider** (`i < 3`), main = indice 0, alternative = 1/2.
- **Alternative assenti non inventate**: pack senza `alternatives` → una sola traccia (la main del pack); alts senza geometria valida (`pts.length < 2`) scartate (`continue`), mai sintetizzate.
- **Appartenenza provider esplicita**: ogni traccia porta `provider`/`key = "<prov>:<idx>"`; in compare i chip sono raggruppati con etichetta provider (`88361–88383`: gruppi `.routing-alt-group` con label `routing.serviceGraphHopper` / `routing.serviceOrs`).
- Modalità normale = alternative del **solo provider attivo**; confronto = gruppi GH **e** ORS.

### 4.2 Colori chip ↔ tracce coerenti

`routingAltStyleClass` (`88309–88312`): chip → `is-route-<provider>-<idx>` (+ `is-active`); etichetta `routing.altMain` («Principale») / `routing.altNamed` («Alternativa {0}») (`88324`). CSS chip (`9899–9904`): GH-0 `#b91c1c`, GH-1 `#c2410c`, GH-2 `#9d174d`; ORS-0 `#1d4ed8`, ORS-1 `#0e7490`, ORS-2 `#0f766e`.  
Tracce SVG (`9952–9965`): `is-route-gh-0` `#ef4444` continuo; `is-route-ors-0` `#2563eb` tratt. 7-5; `is-route-ors-1` `#06b6d4`; `is-route-ors-2` `#0d9488`; `is-route-context` opacità .55 / spessore 2.4; `is-route-active` spessore 4.2; casing per provider+alternativa. Rendering (`91156–91166`): classe = `is-compare-<side> is-route-<side>-<i>` + `is-route-active`|`is-route-context`.

### 4.3 Persistenza provider scelto

`routingCompareChoose` (`89711–89740`): applica il pack canonico, poi

```javascript
  _routingCompareSession.chosen = side === "ors" ? "ors" : "gh";
  r.previewStyleProvider = _routingCompareSession.chosen;
  r.activeOverlayKey = _routingCompareSession.chosen + ":0";
```

`routingStyleProviderKey` (`86550–86556`): `chosen==="ors"` → `ors`; `chosen==="gh"` → `gh`; `previewStyleProvider==="ors"` → `ors`; `service==="ors"` → `ors`; default `gh`. Traccia singola (`91224–91229`): classe `is-route-<prov>-0 is-route-active is-compare-<prov>` → **ORS resta blu, GH resta rosso** dopo il choose. Selftest `RPCF4_ors_keeps_blue` / `RPCF4_gh_keeps_red` (`90431`/`90436`).

### 4.4 Coordinate canoniche non alterate

Offset duale solo **pixel schermo** (`91152–91153`: `routingOffsetComparePolylinePx(mapPtsC, side)` su punti già convertiti in px; GH `side=-1`, ORS `+1`); `pts` = copie da `filter()`; `previewCoordinates`/`pack.previewCoordinates` solo letti, mai riscritti.

---

## 5. RAW — PROFILO ALTIMETRICO / TRACCIA ATTIVA

- **Confronto multi-traccia senza `activeOverlayKey` → profilo nascosto**: `routingElevationIsAmbiguous` (`86600–86609`) — `compareLive` (GH+ORS pass, nessun chosen) **senza** `r.activeOverlayKey` → `true`; inoltre `tracks.length > 1` senza alcuna attiva → `true`. In `routingRenderAltitudePanel` (`92252–92256`): ambiguo → `altWrap.hidden = true` + return.
- **Selezione di una traccia imposta l'attiva e il profilo usa solo quella** (`88447–88463`): click chip in compare → `r.activeOverlayKey = ovKey`; profilo ricostruito **dall'alternativa selezionata** (`routingBuildElevationProfile(alt.previewCoordinates, ...)`); re-render profilo + overlay.
- **Altre tracce restano visibili come contesto**: rendering con `active !== false` → `is-route-active`, le altre → `is-route-context` (opacità ridotta, `91156–91164`).
- **Choose finale mantiene coerenza route/profilo**: `routingCompareChoose` applica pack (alternatives + preview + elevation) e setta `activeOverlayKey = chosen+":0"`; `routingApplyRouteResultFromValidated` (`88732–88754`) imposta `selectedAlternative = 0` e profilo dalla route scelta.
- **Nessun profilo attribuito al provider/traccia sbagliati**: il profilo vive solo su `r.elevationProfile` (traccia attiva/selezionata); con ambiguità il pannello è nascosto, non mostrato con dati di un'altra traccia.

---

## 6. RAW — COINCIDENZA GH / ORS

### 6.1 Soglia e criterio (`86459–86506`)

```javascript
const ROUTING_PATH_IDENTICAL_M = 45;
function routingPathsSubstantiallyIdentical(a, b){
  if (!Array.isArray(a) || !Array.isArray(b) || a.length < 2 || b.length < 2) return false;
  return routingMeanNearestM(a, b) < ROUTING_PATH_IDENTICAL_M && routingMeanNearestM(b, a) < ROUTING_PATH_IDENTICAL_M;
}
```

Criterio effettivo: distanza media nearest-neighbour **simmetrica** (a→b e b→a) su path **risampati per lunghezza d'arco** (28 campioni, clamp 2–48; `routingResampleByDist` `86467–86486`; `routingMeanNearestM` `86487–86501`; haversine `routingHaversineM` `86459–86466`). Soglia deterministica **45 m**.

### 6.2 Tre stati (`86533–86549`)

```javascript
function routingCompareIdentityKind(){
  ...
  const sameMain = routingPathsSubstantiallyIdentical(gh.previewCoordinates, ors.previewCoordinates);
  if (!sameMain) return "different";
  function altsDiffer(pack){ ... ogni alt i>=1 con pts>=2 non sostanzialmente identica alla propria main → true ... }
  if (altsDiffer(gh) || altsDiffer(ors)) return "same_main_diff_alts";
  return "same";
}
```

**A. main differenti** → `"different"` → nota nascosta.  
**B. main sostanzialmente uguali + alternative equivalenti/assenti** → `"same"` → nota `routing.compareSameMain`.  
**C. main uguali + alternative differenti** → `"same_main_diff_alts"` → nota `routing.compareSameMainDiffAlts`.

UI (`89629–89643`): `#routingCompareIdentityNote` (role=status, aria-live) — `"same"` → testo «GraphHopper e OpenRouteService propongono lo stesso percorso principale.»; `"same_main_diff_alts"` → «Il percorso principale coincide, ma sono disponibili alternative differenti.»; altro → `hidden` + testo vuoto. Anche `#routingCompareStatus` riceve gli stessi messaggi (`89602–89604`).

**Non viene dichiarata uguaglianza complessiva quando le alternative differiscono**: `altsDiffer` è valutato **prima** di restituire `"same"` — stato C non può produrre il messaggio B. Selftest: `RPCF4_different_main` / `RPCF4_identical_main` / `RPCF4_notify_same` / `RPCF4_notify_same_diff_alts` (`90396–90405`).

---

## 7. RAW — ANELLO / WARNING

### 7.1 Criterio geometrico (`86507–86522`)

```javascript
function routingPathLooksLikeOutAndBack(coords){
  if (!Array.isArray(coords) || coords.length < 8) return false;
  ... lunghezza totale (haversine); if (!(total > 80)) return false; ...
  // split alla metà della distanza; seconda metà invertita
  return routingMeanNearestM(first, second) < 90;
}
```

**Non dipende solo da start≈end**: confronta la prima metà del percorso con la seconda metà **invertita** (media nearest < 90 m su risampling). Un anello reale non torna sui propri passi → `false`; un andata-ritorno → `true`. Selftest `RPCF4_ring_warn_oab` (path A→B→A → true) e `RPCF4_ring_ok_loop` (anello circolare 16 punti → false) (`90406–90415`).

### 7.2 Warning solo in modalità Anello, non invasivo, payload intatto

`routingApplyRingSemanticWarn` (`86523–86532`): se `routingGetRouteMode() !== "round_trip"` → `r.ringSemanticWarn = false` (mai warning fuori da Anello). L'unica azione è settare il **booleano di stato**; **nessuna** modifica a payload HTTP, `previewCoordinates` o geometria canonica. Display (`87363–87375`): feedback **in-pannello** via `routingSetRoundTripFeedback(..., "warn")` → `#routingRoundTripFeedback` classe `is-warn`, `hidden` se vuoto (`87287–87302`). Non trasforma il routing in Andata/Ritorno: la modalità resta `round_trip`, i punti e il payload non cambiano.

### 7.3 Zero-VIA e VIA constrained restano chiusi

Payload invariato: `routingExtractClosedLoopPoints` (`86610–86629`) — visibili + append START, semantica identica a FIX2/FIX3. Selftest FIX3 **invariati e inclusi** nella 793/793: `RPCF3_zero_via_no_force_close` (`90293`), `RPCF3_two_via_still_closed` (`90280`), `RPCF3_compare_via` (`90326`), `RPCF3_avoid_via` (`90333`).

### 7.4 Aggiornamento/rimozione warning

- **Nuova route**: `routingApplyRingSemanticWarn` richiamato a ogni apply (`87816` zero-VIA round_trip — dove può anche impostare `roundTripWarnKey = "routing.ringNotLoopWarn"` `87817`; `88745` apply generale) → il flag è **ricomputato** sulla geometria nuova.
- **Cambio modalità fuori Anello**: `routingSyncRoundTripControlsUi` con `!on` → `routingSetRoundTripFeedback("", "")` = feedback nascosto (`87318–87321`).
- **Invalidazione** (`routingInvalidateRoutePreview`, `84317–84349`): azzera preview/alternatives/profilo, rimuove overlay, `routingClearAltitudeUi`; il flag `ringSemanticWarn` **non è azzerato esplicitamente** in questa funzione — viene ricomputo al prossimo apply. Vedasi §12 nota N2.

---

## 8. RAW — AVOID DOUBLE CLICK

### 8.1 Stesso drawing engine, unico call-site (`69692–69704` → `86889–86896`)

```javascript
function routingAvoidApplyMapClick(lat, lon, ev){
  if (!_routingAvoidSession.drawActive) return false;
  const dbl = !!(ev && (ev.detail === 2 || ev.type === "dblclick"));
  if (dbl){
    const n = (_routingAvoidSession.draft && _routingAvoidSession.draft.vertices) ? _routingAvoidSession.draft.vertices.length : 0;
    if (n >= 3) return routingAvoidConfirmDraft();   // conferma SOLO con >=3 vertici
  }
  return routingAvoidAddDraftVertex(lat, lon);       // single click → aggiunge vertice
}
```

Il gestore click mappa esistente (unico, `69699`) passa `ev`: **nessun secondo drawing engine**, stessa sessione `_routingAvoidSession`, stesso overlay.

- **`ev.detail===2` chiude/conferma solo con ≥3 vertici validi**: guard `n >= 3`; con <3 vertici il doppio click ricade nel ramo `routingAddDraftVertex` (comportamento preesistente).
- **Nessun vertice duplicato indesiderato dal doppio click**: con `n >= 3` il `return` conferma **senza** aggiungere il vertice del doppio click. Inoltre `routingAvoidValidateVertices` (`86712–86724`) scarta vertici non distinti: `routingAvoidDistinctCount` (`86699–86711`) deduplica a 6 decimali e la validazione richiede `>= ROUTING_AVOID_MIN_VERTS` (3, `86671`) **distinti** — un eventuale doppione non rende valida un'area con <3 vertici effettivi.
- **Area risultante valida e chiusa**: `routingAvoidConfirmDraft` (`86866–86888`) invariato — valida, clona `val.vertices.slice()`, push in `areas[]`, exit draw silent, `routingAvoidTouchInvalidatePreview()`. Cap `ROUTING_AVOID_MAX_VERTS = 24` (`86670`).
- **Single click continua ad aggiungere vertici**: ramo `routingAvoidAddDraftVertex` (`86845–86859`) con normalize + cap.
- **Cleanup/invalidazione invariati**: `routingAvoidExitDrawMode` / `routingAvoidTouchInvalidatePreview` / delete/toggle/clear untouched dal delta FIX4. Selftest `RPCF4_avoid_dblclick` (`90416–90418`).

---

## 9. RAW — I18N EN/FR

### 9.1 Chiavi nuove — solo IT (`17943–17949`)

```javascript
    "routing.paramsRowAria":"Profilo, velocità media e calcolo percorso",
    "routing.altMain":"Principale",
    "routing.altNamed":"Alternativa {0}",
    "routing.compareSameMain":"GraphHopper e OpenRouteService propongono lo stesso percorso principale.",
    "routing.compareSameMainDiffAlts":"Il percorso principale coincide, ma sono disponibili alternative differenti.",
    "routing.ringNotLoopWarn":"Il risultato non è un anello riconoscibile (sembra un andata-ritorno). Non trattarlo come anello chiuso.",
    "routing.elevSelectTrace":"Seleziona una traccia per mostrare il profilo altimetrico.",
```

Dizionari: `it` `15859–18348`, `en` `18349–20571`, `fr` `20572–22674`. Le 7 chiavi compaiono **una sola volta** ciascuna (blocco IT) → **non presenti in EN/FR** (conforme a L10N-FREEZE).

### 9.2 Fallback effettivo EN/FR — sicuro

- **Stringhe dinamiche (`routingT`, `83384–83398`)**: dizionario lingua corrente → `I18N.it` → **fallback italiano hardcoded a ogni call-site** (es. `routingT("routing.compareSameMain", "GraphHopper e ...")` `89635`) → `t(key)` (`22540–22543`, che a sua volta fallback su `I18N.en` o la key, **mai raggiunto** perché il fallback IT è già risolto). In EN/FR l'utente vede il testo **italiano**, **non** la raw key, **non** label vuote (il fallback è sempre non-vuoto: stringa literal o, in extremis, la key mai restituita prima del fallback IT).
- **Attributi statici (`data-i18n-aria` / `data-i18n` / `data-i18n-tip` / `data-i18n-ph`, `syncI18nInRoot` `73669–73694`)**: guard `if (dict[k] !== undefined)` — chiave assente in EN/FR → attributo/testo **non sovrascritto** → resta il valore italiano del markup (es. `aria-label="Profilo, velocità e calcolo"` `15176`). Nessuna raw key, nessuna label vuota.

**Fallback sicuro → nessun finding / nessuno STOP.**

### 9.3 Nota (non blocker)

`routing.elevSelectTrace` è **dichiarata ma priva di consumer** nel candidate (unica occorrenza = dichiarazione `17949`); l'hint «seleziona una traccia» non è attualmente renderizzato. Chiave morta, nessuna esposizione di raw key. Vedasi §12 N1.

---

## 10. RAW — OPSEC / STATE (delta FIX4)

Diff runtime `d455841..f1d9fc0` = **solo** `coordinate_converter Claude.html` (+581/−151). Scansione righe aggiunte:

| Invariante | Nel delta FIX4 |
| --- | --- |
| Endpoint nuovi (`fetch(`, `tailc01234`, `api.openrouteservice`) | **assenti**; `ROUTING_ORS_GATEWAY_BASE = "https://ubuntu.tailc01234.ts.net"` (`88551`) e `ROUTING_GRAPHHOPPER_ENDPOINT = "http://100.114.7.53:8989"` (`83311`) **invariati** |
| `Authorization` / `ORS_API_KEY` | **0** occorrenze aggiunte |
| Auto GH Local→VPS | invariato: `routingCompareAutoCandidates` (`89121–89124`) = `["local","vps"]` (ORS mai; `forceOffline` → `["local"]`) |
| ORS mai Auto | stesso hunk sopra; selftest `RPC_auto_no_ors` invariato |
| `forcedOffline` / `opsecStrict` | **nessuna riga aggiunta** li tocca |
| GPS (`getCurrentPosition` / `watchPosition`) | **nessuna aggiunta** (occorrenze preesistenti: solo opt-in click `50968`/`51028`/`84629`) |
| Nuovo storage / `localStorage` | **nessuno** |
| Write `state.mapWaypoints[]` | **zero** — delta contiene solo snapshot read-only (`wp0 = state.mapWaypoints.slice()`) + assert `RPCF4_waypoints_untouched` (`90449`) |
| Write `state.gisPolygons` | **zero** — idem `poly0` + `RPCF4_polygons_untouched` (`90450`) |
| Oggetti GIS | **non toccati** (commit = solo monolite) |
| Helper 0.1.3 | **invariato** (nessun file helper nel delta) |

---

## 11. EVIDENCE ESISTENTE (non rieseguita)

Puntatore: [`2026-08-18_1853_outdoor-routing-f-provider-compare-a-fix4.md`](2026-08-18_1853_outdoor-routing-f-provider-compare-a-fix4.md) sul candidate immutabile `f1d9fc0` / build **225** / blob `8f9a6abe…`.

| Esito già persistito | Valore |
| --- | --- |
| Selftest globale | **793/793 PASS** |
| RPCF4 | **24/24 PASS** |
| Deploy / ABQA / QA operatore | **NON eseguiti** (candidate, non LIVE) |

---

## 12. OSSERVAZIONI FACTUALI (per la review GPT-SOSTITUTIVA — non blocker, nessuna azione in questo pass)

- **N1 — chiave i18n dichiarata senza consumer**: `routing.elevSelectTrace` (`17949`) non è referenziata da alcun codice UI nel candidate. Impatto: nessuno (nessun profilo ambiguo mostrato: pannello nascosto; l'hint testuale opzionale semplicemente non appare). Candidate **immutabile** in questo pass.
- **N2 — invalidazione non azzera esplicitamente `ringSemanticWarn`**: `routingInvalidateRoutePreview` (`84317–84349`) non setta `r.ringSemanticWarn = false`; il flag viene ricomputo a ogni nuovo apply (`87816`/`88745`) e il feedback è svuotato quando si esce dalla modalità Anello (`87318–87321`). Finestra residua: dopo invalidazione **senza** cambio modalità né nuovo calcolo, il testo di warning precedente può restare nel pannello finché un `routingSyncRoundTripControlsUi` non lo rinfresca. Da valutare in review; nessuna modifica runtime in questo pass.

---

## 13. STOP

**REVIEW GPT-SOSTITUTIVA — PENDING** (invariato)

```text
BLOCK:     OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4
GATE:      REVIEW GPT-SOSTITUTIVA — PENDING
CANDIDATE: f1d9fc0540f8073d5e79f59164237a951e80215c
           build 225
           blob 8f9a6abe796adbfbab17d5ded1d9542efa70c306
NEXT:      review FIX4 candidate 225
```

FRONTIER / WU-HOT-HEADER: **non modificati**.  
NON deploy. NON ABQA. NON QA operatore. NON finito. NON build bump. NON monolite.
