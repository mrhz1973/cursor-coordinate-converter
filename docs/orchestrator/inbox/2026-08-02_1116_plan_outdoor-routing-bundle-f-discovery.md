# OUTDOOR-ROUTING-BUNDLE-F-DISCOVERY-A — Piano discovery (pubblicazione memoria)

**Tipo:** pubblicazione memoria orchestratore del piano Plan (read-only).  
**Data pubblicazione:** 2026-08-02  
**Baseline al momento della discovery:** `da5615656e3a10b028136e4abd843a3f1d163f98`  
**Runtime autorevole:** tip `1f7c05f` / `B6.5RGM-A-FIX2 · build 101` (invariato)  
**Bundle F:** futuro / **non aperto**  
**Oggetti GIS:** FROZEN  
**Probe GraphHopper:** **non eseguito** in questa pubblicazione  
**Monolite:** non modificato  

> Piano completo autosufficiente. Capacità UNKNOWN restano UNKNOWN. Nessuna apertura runtime.

---
# OUTDOOR-ROUTING-BUNDLE-F-DISCOVERY-A — Discovery (read-only)

**Tipo:** Solo analisi e piano. Nessuna modifica runtime, documentale, di stato o di build. Nessun commit, autosync, deploy, QA, `finito`.

---

## 1. Esito pre-flight

- repo root: `C:/Users/mrhz/Documents/AI/GitHub/cursor-coordinate-converter` (corretto)
- branch: `main`
- `git status --short`: vuoto
- `git fetch origin`: ok
- HEAD / origin/main / `git ls-remote origin main`: **`da5615656e3a10b028136e4abd843a3f1d163f98`** (baseline confermata)
- Runtime autorevole: tip `1f7c05f2186be5759d3e0e34a69d88564a0d8690` / `B6.5RGM-A-FIX2 · build 101` (invariato)

## 2. Stato Bundle F

- Stato: **futuro / non aperto**.
- WU-0010 §6 (linea 348-356) elenca 5 scope: Alternative, Andata/ritorno, Round trip, Avoid areas, Confronto futuro provider.
- «Bundle F» non è mai aperto nei documenti vivi (OM §7: "backlog non aperto").
- Oggetti GIS **FROZEN** — nessuna interferenza con poligoni GIS canonici.

---

## 3. Mappa del runtime Routing corrente (coordinate_converter Claude.html)

Regioni chiave (linee 1-indexed, inclusive):

| Funzione | Linee | Ruolo |
|---|---|---|
| `routingEnsureState` | [61480:61565](coordinate_converter Claude.html#L61480) | init lazzy `state._routing` |
| `ROUTING_MAX_POINTS = 20` | [61310](coordinate_converter Claude.html#L61310) | cap punti |
| `ROUTING_GRAPHHOPPER_ENDPOINT` (VPS) | [61311](coordinate_converter Claude.html#L61311) | `http://100.114.7.53:8989` |
| `ROUTING_GRAPHHOPPER_ENDPOINT_LOCAL` | [61312](coordinate_converter Claude.html#L61312) | `http://127.0.0.1:8989` |
| `ROUTING_GRAPHHOPPER_PROFILES` (frozen 4) | [61358:61363](coordinate_converter Claude.html#L61358) | hiking / hiking_easy / mtb_touring / mtb_trail |
| `routingProviderNormalize` | [61333:61337](coordinate_converter Claude.html#L61333) | `"vps"\|"local"\|"auto"` |
| `routingEndpointForProvider` | [61338:61342](coordinate_converter Claude.html#L61338) | endpoint hardcoded |
| `routingEndpointIsValidatedLoopback` | [61343:61353](coordinate_converter Claude.html#L61343) | solo `127.0.0.1`/`localhost` |
| `routingNetworkGateGraphhopper` | [63255:63283](coordinate_converter Claude.html#L63255) | gate OPSEC/offline/loopback |
| `routingValidateGraphhopperInfo` | [63284:63300](coordinate_converter Claude.html#L63284) | richiede 4 profili in `/info` |
| `routingGraphhopperInfoCheck` | [63301:63343](coordinate_converter Claude.html#L63301) | GET `/info` + AbortController + 3s timeout |
| `routingResolveProvider` | [63344:63409](coordinate_converter Claude.html#L63344) | Auto: candidates `[local, vps]` |
| `routingVerifyProvider` | [63410:63450](coordinate_converter Claude.html#L63410) | sequenza info+gate |
| `routingBuildGraphhopperRouteBody` | [63451:63459](coordinate_converter Claude.html#L63451) | **body minimal** |
| `routingValidateGraphhopperResponse` | [63515:63577](coordinate_converter Claude.html#L63515) | **legge solo `paths[0]`** |
| `routingFitMapToRoutePreview` | [63578:63635](coordinate_converter Claude.html#L63578) | fit viewport |
| `routingCalculateRouteGraphhopper` | [63636:63869](coordinate_converter Claude.html#L63636) | orchestratore Calcola |
| `renderRoutingRoutePreviewOverlay` | [63871](coordinate_converter Claude.html#L63871) | polyline preview (2D, transient) |
| `routingRemoveRoutePreviewOverlay` | [61761](coordinate_converter Claude.html#L61761) | cleanup overlay |
| `renderRoutingMarkers` | [62487:62561](coordinate_converter Claude.html#L62487) | A/B/via marker |
| `routingRenderAltitudePanel` | [64927:65041](coordinate_converter Claude.html#L64927) | summary card + chart |
| `routingBuildElevationProfile` | [64387:64508](coordinate_converter Claude.html#L64387) | profilo + bucket median + deadband |
| `routingComputeDifficulty` | [64541:64627](coordinate_converter Claude.html#L64541) | score 0-100 + livelli |
| `routingDrawAltitudeChart` / `elevationProfileDrawChart` | [65469:65506](coordinate_converter Claude.html#L65469) / [65161:65468](coordinate_converter Claude.html#L65161) | SVG chart |
| `routingSetAltitudeHover` / sync marker | [65574:65591](coordinate_converter Claude.html#L65574) / [65517:65572](coordinate_converter Claude.html#L65517) | map↔profile |
| `elevationProfileMapSyncOwner` | [65765:65771](coordinate_converter Claude.html#L65765) | ownership `"routing"|"saved-track"|"none"` |
| `routingPerformSaveAsTrack` | [62022:62131](coordinate_converter Claude.html#L62022) | save via `savedTrackAddFromPoints` |
| `routingReversePoints` | [61877:61905](coordinate_converter Claude.html#L61877) | inverte `points[]`, no `/route` |
| `routingInvalidateRoutePreview` | [62132:62159](coordinate_converter Claude.html#L62132) | abort + bump sequence + clear derived |
| `routingPushPointUndoSnapshot` / `routingUndoLastPointChange` | [61618:61630](coordinate_converter Claude.html#L61618) / [61713:61751](coordinate_converter Claude.html#L61713) | undo (cap 30) |
| HTML pannello routing | [13360:13482](coordinate_converter Claude.html#L13360) | select profile, bottoni, units, loopback |

### `state._routing` shape reale (non piano)

Inizializzato in `routingEnsureState`. Campi runtime (non tutti in literal init):

```
points[], listReorderDrag, panelOpen, dirty, error, service,
pickMode, pickTargetId, markerDrag,
requestController, requestSequence, requestLoading, requestTimedOut, infoLoading,
previewCoordinates, elevationCoordinates, routeMetrics,
elevationProfile, difficultySummary, altitudeHover, _altitudeChartLayout, _altitudeProfileGeneration,
speedMode, customSpeedKmh, routeError,
provider, resolvedProvider, resolvedEndpoint,
loopbackConsent, providerStatusKey,
gpsRequestGeneration, gpsBusyId,
saveAsTrackPromptOpen, saveAsTrackNameDraft,
pointUndoStack, _pointUndoSuppress,
coordEditMode, coordEditDrafts, coordEditFeedback, coordEditFeedbackIsErr,
search
```

**NOT present (nonostante WU-0010 §3 li menzionasse come piano):** `alternatives`, `selectedAlternative`, `lastResult`, `requestGeneration` (l'anti-stale token si chiama **`requestSequence`**), `abortController` (si chiama **`requestController`**).

### Builder body — forma esatta

```63451:63459:coordinate_converter Claude.html
function routingBuildGraphhopperRouteBody(profile, pointsLonLat){
  return {
    profile: profile,
    points: pointsLonLat,
    elevation: true,
    points_encoded: false,
    instructions: false
  };
}
```

**NON presenti nel body (grep exhaustive, 0 match):** `locale`, `details`, `ch.disable`, `custom_model`, `algorithm`, `alternative_route.*`, `round_trip.*`, `avoid`, `block_area`, `headings`, `snap_prevention`, `curb_side`, `turn_costs`.

### Parser — selezione di `paths[0]`

```63515:63524:coordinate_converter Claude.html
function routingValidateGraphhopperResponse(data){
  if (!data || typeof data !== "object") return { ok: false, errKey: "routing.errorInvalidResponse" };
  const paths = Array.isArray(data.paths) ? data.paths : null;
  if (!paths || paths.length < 1) return { ok: false, errKey: "routing.errorNoPath" };
  const p0 = paths[0];
  // ... valida LineString, coordinates, estrae distance/time/ascend/descend ...
}
```

`metrics = { distanceM, durationMs, ascentM, descentM }` da `p0`. **Non legge** `paths[1..]`, `details`, `legs`, `snapped_waypoints`, `points_encoded` (assunto sempre `false`).

### Anti-stale (`requestSequence`)

Bump siti: `routingInvalidateRoutePreview` [62135](coordinate_converter Claude.html#L62135), `routingAbortActiveRequestForPolicy` [62219](coordinate_converter Claude.html#L62219), `routingFullCleanup` [62572](coordinate_converter Claude.html#L62572), `routingCalculateRouteGraphhopper` [63668](coordinate_converter Claude.html#L63668). Stale check: confronto `requestSequence` + identità `requestController`. Pattern già robusto — riuso diretto.

### Reverse e save

- **Reverse** [61894](coordinate_converter Claude.html#L61894): `pts.reverse()` in-place; poi `routingInvalidateRoutePreview()` (abort + clear); nessuna chiamata `/route`. Status: "Route order reversed. Press Calculate route."
- **Save-as-track** [62053](coordinate_converter Claude.html#L62053): `savedTrackAddFromPoints({ points: r.previewCoordinates, name, closed:false, visible:true })`. Usa `previewCoordinates` (2D); addon `elevationProfile` attachable.

---

## 4. Matrice dei cinque punti

| Punto | Stato runtime | Dipendenze | Rischio | ROUTINE/DELICATO | Decisione prodotto | Size stimata | Rollback | Review down | QA |
|---|---|---|---|---|---|---|---|---|---|
| **A. Alternative** | **NON impl.** Body senza `algorithm`/`alternative_route.*`; parser scarta `paths[1..]`; nessun campo `alternatives`/`selectedAlternative` in `_routing`. | Probe capacità server (step 0); aggiunta campi transienti; parser multi-path; UI selettore; riuso anti-stale, preview, profilo, difficoltà, save. | Medio (rete + nuova variabile stato, ma session-only) | **DELICATO** (rete + nuova forma di interazione provider) | vedi §12 — 1 sola (numero max alternative) | ~250-400 righe | Sì (feature flag session-only, fallback a `paths[0]`) | obbligatoria (rete) | Sì (Regola D2) |
| **B. Andata/ritorno** | **Parzialmente impl.** esiste `routingReversePoints` [61877](coordinate_converter Claude.html#L61877) ma inverte solo `points[]` senza ricalcolare. Varianti possibili: (1) ritorno su stesso tracciato invertito (gratis); (2) A→B + B→A ricalcolato (richiede `/route` multi-segment); (3) lista A→…→B→…→A; (4) = Reverse esistente (no). | Definizione semantica (1 vs 2 vs 3) | Basso per (1)/(4); Medio per (2) (rete extra) | (1)/(3) **ROUTINE**; (2) **DELICATO** | **SÌ** — quale variante è "andata/ritorno" | variabile | Sì | per (2) obbligatoria | Sì |
| **C. Round trip** | **NON impl.** Body senza `algorithm=round_trip`/`round_trip.*`. | Capacità server (`algorithm=round_trip`, parametri `distance`/`seed`/`points`); custom model compatibilità; UI dedicata. | Alto (non determinismo, costo richieste, semantica UI) | **DELICATO** (rete + algoritmo non deterministico) | SÌ — target distance obbligatoria; seed opzionale; profile whitelist | ~300-500 righe | Sì, ma complesso | obbligatoria | Sì |
| **D. Avoid areas** | **NON impl.** Body senza `custom_model`/`avoid_polygons`/`block_area`. | Contratto GH 11 (custom_model con `priority`/`areas`); integrazione read-only con poligoni GIS (Oggetti GIS FROZEN); validazione geometrica/antimeridiano; OPSEC payload size. | Molto alto (geometria + custom_model + payload + FROZEN) | **DELICATO** (geometria + rete + OPSEC) | SÌ — fonte aree (poligoni GIS read-only vs stato Routing transiente dedicato) | ~500-800 righe | Sì, ma complesso | obbligatoria | Sì |
| **E. Confronto provider** | **NON impl.** `routingResolveProvider` [63344](coordinate_converter Claude.html#L63344) picksa **un** endpoint; nessun comparison. | Solo due engine identici (Local + VPS, stesso graph `nord-ovest-B-v3-elev`) — utilità limitata; gateway online = `OUTDOOR-ROUTING-API-GATEWAY-A` (BACKLOG); moltiplicazione richieste; OPSEC. | Alto con utilità dubbia | **DELICATO** (rete ×N + OPSEC) | SÌ — ha senso solo post-gateway | n/a ora | n/a | obbligatoria | Sì |

---

## 5. Capacità GraphHopper provate

Autorità: codice corrente + WU-0011 (INFRA-GH-1A/1B/1D) + `docs/INFRA_VPS.md` + `routingValidateGraphhopperInfo` [63284](coordinate_converter Claude.html#L63284).

| Capacità | Prova | Stato |
|---|---|---|
| GraphHopper versione | WU-0011: **11.0** | Provata |
| Endpoint VPS | `http://100.114.7.53:8989` (Tailscale ACL) | Provata |
| Endpoint Local | `http://127.0.0.1:8989` (PoC) | Provata |
| Grafo VPS | `nord-ovest-B-v3-elev` (bilinear+ramer `max_elevation:5`) | Provata |
| Profili (4) | hiking, hiking_easy, mtb_touring, mtb_trail | Provata (`routingValidateGraphhopperInfo`) |
| POST `/route` body `{profile, points, elevation, points_encoded:false, instructions:false}` | `routingCalculateRouteGraphhopper` [63636](coordinate_converter Claude.html#L63636) | Provata (MULTIROW-A-FIX2 PASS) |
| GET `/info` `{profiles[]}` | `routingGraphhopperInfoCheck` [63301](coordinate_converter Claude.html#L63301) | Provata |
| CH (Contraction Hierarchies) abilitate ×4 profili | WU-0011 Import B: `CH×4` | Provata |

## 6. Capacità UNKNOWN — verifica dedicata necessaria

Queste capacità sono **note in GraphHopper 11 pubblicamente**, ma il **contratto verso il nostro server** (graph custom con `max_elevation:5` ramer, CH×4 con `hiking_easy`/`mtb_*` custom, behaviour con CH disabilitato) **non è dimostrabile dalle fonti autorizzate** senza inviare `/route`. Da verificare nello **step 0 probe** del primo sottoblocco:

| Capacità | Perché UNKNOWN |
|---|---|
| `algorithm: "alternative_route"` + `alternative_route.max_paths`/`max_weight_factor`/`max_share_factor` | Body corrente non lo imposta mai; non sappiamo se il server con graph custom + CH lo accetta o se serve `ch.disable:true` |
| `ch.disable: true` (per forzare flex routing su graph CH) | Non impostato; comportamento su graph V3 non provato |
| `algorithm: "round_trip"` + `round_trip.distance`/`seed`/`points` | Idem; richiede flex, costo non deterministico |
| `custom_model` con `priority` multipliers e `areas` (avoid_polygons equivalente) | Profili V3 sono già custom model frozen (`max_elevation:5`); sovrapposizione di un altro `custom_model` runtime non provata |
| `details: ["*"]` (per `legs`, `snapped_waypoints`, street_names) | Body disabilita `instructions`; nessun `details` mai richiesto; response parsing non gestisce questi campi |

**Regola di scoperta:** non inventare il contratto API. Se lo step 0 probe fallisce, fermarsi e tornare a piano.

---

## 7. Dipendenze e blocchi

- **INFRA-GH-1A/1B/1D — CLOSED/PASS** (GraphHopper 11.0 deployato VPS). Prerequisito soddisfatto.
- **`OUTDOOR-ROUTING-API-GATEWAY-A`** — BACKLOG / NON APERTO. Il gateway mondiale è prerequisito per **E. Confronto provider** in modalità online; per E tra Local↔VPS l'utilità è dubbia (stesso graph).
- **Oggetti GIS FROZEN** — per **D. Avoid areas** qualsiasi integrazione con poligoni GIS deve essere **read-only** oppure usare uno stato Routing transiente dedicato (es. `state._routing.avoidAreas` session-only), non `state.gisPolygons`.
- **CH×4 abilitate** — solleva la questione `ch.disable` per alternative_route/round_trip/custom_model (verifica step 0).

---

## 8. Sequenza raccomandata dei sottoblocchi

```mermaid
flowchart LR
    Probe["ROUTING-ALTERNATIVE-ROUTES-A<br/>step 0: probe capacità server<br/>(read-only)"]
    Probe -->|PASS| Alt["ROUTING-ALTERNATIVE-ROUTES-A<br/>feature impl"]
    Probe -->|FAIL| Back["Torna a piano"]
    Alt --> RT["ROUTING-ROUND-TRIP-A<br/>(dipende da ch.disable provato)"]
    Alt --> AR["ROUTING-AVOID-AREAS-A<br/>(read-only vs gisPolygons<br/>o stato transiente)"]
    RT --> Compare["ROUTING-PROVIDER-COMPARE-A<br/>(post-gateway)"]
    AR --> Compare
    subgraph BacklogRT [Andata-Ritorno]
        And1["Andata-Ritorno variante 1<br/>(gratis, riuso reverse)"]
        And2["Andata-Ritorno variante 2<br/>(ricalcolo, opzionale)"]
    end
    Alt -.->. And1
```

1. **ROUTING-ALTERNATIVE-ROUTES-A** (primo sottoblocco, vedi §10-11) — include step 0 probe.
2. **Andata-Ritorno variante 1** (ROUTINE, riuso reverse esistente) — solo dopo decisione prodotto §12-B.
3. **ROUTING-ROUND-TRIP-A** (DELICATO) — sfrutta `ch.disable` provato in step 0 di Alternative.
4. **ROUTING-AVOID-AREAS-A** (DELICATO) — `custom_model` read-only su poligoni GIS esistenti, OPSEC gating.
5. **ROUTING-PROVIDER-COMPARE-A** (backlog, post-`OUTDOOR-ROUTING-API-GATEWAY-A`).

**Mai** un mega-bundle che mischia A/C/D/E — sono categorie delicate distinte (geometria/rete/stato complesso); ciascuno nel proprio bundle separato.

---

## 9. Primo sottoblocco raccomandato: ROUTING-ALTERNATIVE-ROUTES-A

**Perché primo:**
- È l'unico dei cinque il cui runtime è **già strutturato per `paths[]`** (parser valida già `Array.isArray(data.paths)`); richiede solo di non scartare `paths[1..]`.
- Nessun nuovo endpoint: riuso `/route` + `/info`.
- Nessun nuovo store persistito: campi transienti su `state._routing` (session-only, coerenti con WU-0010 §3 contratto).
- Preview/profilo/difficoltà/save possono riusare la singola alternativa selezionata **senza duplicare logiche**: il path selezionato passa negli stessi `r.previewCoordinates`/`r.elevationCoordinates`/`r.routeMetrics` già esistenti; gli altri path restano metadati read-only.
- Scope localizzabile: builder body + parser + 1 campo `alternatives` + 1 campo `selectedAlternative` + UI selettore.

**Condizioni soddisfatte:**
- runtime strutturato per `paths[]`: SÌ
- nessun nuovo endpoint: SÌ
- session-only: SÌ
- scope localizzabile: SÌ

**Condizione da verificare (motivo step 0):** supporto del server a `algorithm=alternative_route` (richiede tipicamente `ch.disable:true` su GH 11 con CH abilitate). Se il probe fallisce → blocco si ferma.

---

## 10. Contratto implementativo — ROUTING-ALTERNATIVE-ROUTES-A

**ID proposto:** `ROUTING-ALTERNATIVE-ROUTES-A`
**Obiettivo:** aggiungere percorsi alternativi multipli (max N) in fase di calcolo, con selezione singola, riutilizzando l'intera catena preview/profilo/difficoltà/save.
**Classificazione:** **DELICATO** (rete + interazione provider non banale).
**Build ID proposto:** `B6.6AR-A` (nuovo segmento 6.6; `APP_BUILD_NUM` 101 → **102**).
**Baseline attesa:** `da56156` (HEAD), tip runtime `1f7c05f`.

### Regioni autorizzate del monolite

| Regione | Scope |
|---|---|
| `routingBuildGraphhopperRouteBody` [63451:63459](coordinate_converter Claude.html#L63451) | estensione body (`algorithm`, `alternative_route.*`, `ch.disable:true` se probe lo richiede) |
| `routingValidateGraphhopperResponse` [63515:63577](coordinate_converter Claude.html#L63515) | parser multi-path: ritorna `alternatives[]` + `previewCoordinates/elevationCoordinates/metrics` dal path selezionato |
| `routingEnsureState` [61480:61565](coordinate_converter Claude.html#L61480) | +2 campi transienti `alternatives`, `selectedAlternative` |
| `routingCalculateRouteGraphhopper` [63636:63869](coordinate_converter Claude.html#L63636) | assegnazione `r.alternatives`, reset `selectedAlternative` su invalidate |
| `routingInvalidateRoutePreview` [62132:62159](coordinate_converter Claude.html#L62132) | clear `alternatives`/`selectedAlternative` |
| HTML pannello routing [13383:13430](coordinate_converter Claude.html#L13383) | nuovo `<div id="routingAlternativesRow">` con chip/bottoni per selezione alternativa (sotto result summary, sopra difficulty) |
| i18n IT/EN (FR congelato) | nuove chiavi `routing.alternatives*`, `tip.routingAlternatives*` |

### Funzioni esistenti da riusare

- `routingExtractValidGraphhopperPoints` [61778](coordinate_converter Claude.html#L61778)
- `routingResolveProvider` [63344](coordinate_converter Claude.html#L63344)
- `routingGraphhopperInfoCheck` [63301](coordinate_converter Claude.html#L63301) (anche per probe step 0)
- `routingNetworkGateGraphhopper` [63255](coordinate_converter Claude.html#L63255)
- `routingFitMapToRoutePreview` [63578](coordinate_converter Claude.html#L63578)
- `routingBuildElevationProfile` [64387](coordinate_converter Claude.html#L64387)
- `routingComputeDifficulty` [64541](coordinate_converter Claude.html#L64541)
- `routingRenderAltitudePanel` [64927](coordinate_converter Claude.html#L64927)
- `renderRoutingRoutePreviewOverlay` [63871](coordinate_converter Claude.html#L63871)
- `routingPerformSaveAsTrack` [62022](coordinate_converter Claude.html#L62022)
- `routingPushPointUndoSnapshot` [61618](coordinate_converter Claude.html#L61618) (non toccato — alternative non è mutazione punti)
- anti-stale `requestSequence` + `requestController` pattern (riuso passivo)

### Stato transiente necessario

```text
state._routing.alternatives: Array<{ index, previewCoordinates, elevationCoordinates, metrics }> | null
state._routing.selectedAlternative: number | null   // indice in alternatives, default 0
```

**Session-only. Non entra in `saveStore`. Non entra in `state.mapWaypoints`/`savedTracks`/`gisPolygons`/`track`.**

### Stato canonico da NON toccare

- `state.mapWaypoints`, `state.savedTracks`, `state.gisPolygons`, `state.track`, `state.gisTracks`, `state.gisLayers`
- sanitizer `gisSanitizeFeature`/`gisSanitizeGeometry`/`gisSanitizeProperties`
- `saveStore`/`loadStore`/IndexedDB/tile cache
- `geocodeSearch`/`offlineForwardSearch`/`reverseGeocode`
- GraphHopper server config / VPS / Tailscale / Docker / systemd

### UI minima

- `<div id="routingAlternativesRow" hidden>` in `routingResultCard` [13383](coordinate_converter Claude.html#L13383), tra `routingResultSummary` e `routingDifficultyRow`.
- Una chip per ogni alternativa: `Percorso 1`, `Percorso 2`, … (fino a N). Active = primary; altre = secondary.
- Tooltip: distanza + tempo stimato (formato locale FIX8).
- Click → `routingSelectAlternative(i)`: swap `previewCoordinates`/`elevationCoordinates`/`routeMetrics`/`elevationProfile`/`difficultySummary` + redraw overlay + chart.
- Hidden se `alternatives.length < 2`.

### Comportamento desktop/mobile

- Desktop: chip in linea, hover mostra delta vs selezionato.
- Mobile: chip wrap, tap = selezione; nessun hover.
- `prefers-reduced-motion`: nessuna animazione di transizione; redraw statico.

### i18n

- IT/EN nuove chiavi: `routing.alternativesLabel`, `routing.alternativeN` (con `{n}`), `routing.alternativesDelta`, `tip.routingAlternatives`.
- **FR congelato** (governance 2026-06-25): nessuna nuova stringa FR; fallback FR → EN.

### Rete e OPSEC

- Riuso `routingNetworkGateGraphhopper` [63255](coordinate_converter Claude.html#L63255): stesso gate OPSEC/offline/loopback del calcolo normale.
- Payload leggermente più grande (`algorithm`/`alternative_route.*`/`ch.disable`), ma stesso endpoint `/route`.
- **Nessuna** nuova chiamata rete rispetto a Calcola (1 POST `/route` per richiesta; N path nella stessa risposta).
- **Nessuna** persistenza; nessun logging di coordinate.

### Anti-stale

- Riuso `requestSequence` + `requestController` pattern invariato.
- Selezione alternativa **non** richiede nuova chiamata rete: solo swap di dati già in `r.alternatives`. Nessun bump di `requestSequence` su selezione.
- Modifica punti / reverse / undo → `routingInvalidateRoutePreview` [62132](coordinate_converter Claude.html#L62132) pulisce anche `alternatives`/`selectedAlternative`.

### Error handling

- Se `paths.length === 1`: comportamento identico a oggi (nessuna UI alternative; `alternatives = [single]`).
- Se `paths.length === 0`: `routing.errorNoPath` (già gestito).
- Se il server risponde 400/500 su `algorithm=alternative_route`: fallback automatico a body senza `algorithm` (single-path) con messaggio `routing.alternativesNotSupported` in-pannello; `alternatives = [single]`.
- Se path[i] non ha `points.coordinates` valide: skip con `console.warn`, ma non fallire l'intera risposta.

### Preview

- `renderRoutingRoutePreviewOverlay` [63871](coordinate_converter Claude.html#L63871) riceve `r.previewCoordinates` (già swappato dalla selezione). Nessuna modifica necessaria alla funzione di render.
- Path non selezionati: **non** disegnati (evita clutter mappa). Opzionale backlog futuro: overlay grigio sottilo per alternative non selezionate — **fuori scope** di questo blocco.

### Profilo, difficoltà, sync mappa

- `routingBuildElevationProfile`/`routingComputeDifficulty`/`routingRenderAltitudePanel` ricevono già `r.elevationCoordinates`/`r.routeMetrics`/`r.elevationProfile` — swappati in `routingSelectAlternative`. Nessuna modifica necessaria.
- Map↔profile sync (`elevationProfileMapSyncOwner` [65765](coordinate_converter Claude.html#L65765)): ownership invariata (routing vince se preview valido). Pixel cache invalidated dal bump `_altitudeProfileGeneration` (già presente).

### Salvataggio traccia

- `routingPerformSaveAsTrack` [62022](coordinate_converter Claude.html#L62022) usa `r.previewCoordinates` — salva l'alternativa correntemente selezionata. Nessuna modifica necessaria; behavior coerente (l'utente vede cosa sta salvando).

### Undo / reverse

- **Undo** (`routingUndoLastPointChange` [61713](coordinate_converter Claude.html#L61713)): alterna `points[]`, non alternative; invariato. `routingInvalidateRoutePreview` pulisce alternative su undo.
- **Reverse** (`routingReversePoints` [61877](coordinate_converter Claude.html#L61877)): inverte `points[]`; invalida alternative. Ricalcolo successivo rigenera alternative sul nuovo ordine. Invariato.

### Casi limite

- 0 alternative restituite (server non supporta): fallback single-path.
- N > cap (vedi §12): clamped a cap; resto ignorato silenziosamente con `console.info`.
- Selezione alternativa mentre `requestLoading`: disabilitata (UI sync via `routingSyncAlternativesRowUi`).
- Selezione alternativa mentre `pickMode`/`markerDrag`: permessa (non tocca punti).
- Esc durante selezione: invariato (nessuna pick mode).

### Scope escluso

- Alternative in modalità online via gateway (`OUTDOOR-ROUTING-API-GATEWAY-A`).
- Overlay mappa delle alternative non selezionate (backlog).
- Confronto metriche tabellare esteso (backlog).
- Round trip / avoid areas / andata-ritorno / provider compare (altri sottoblocchi).
- FR strings.

### Build markers

- `APP_BUILD_ID`: `"B6.5RGM-A-FIX2"` → **`"B6.6AR-A"`**
- `APP_BUILD_NUM`: `101` → **`102`**
- `APP_BUILD_DETAIL`: invariato

### Test statici

- `git status --short` pre/post
- `git diff --stat`
- `git diff --check`
- Verifica assenza `<script src>`/`type="module"` non autorizzati
- `node --check` su JS estratto (snippet README: extract `<script>` → `/tmp/goi-gis-inline-check.js` → `node --check`)
- Verifica build marker coerenti

### Harness JS

- Estendere `C:\tmp\rgm-a-harness.js` (88/88 esistente) con casi:
  - body builder con flag alternative attivi
  - parser multi-path con 1, 2, 3 path
  - selezione alternativa swap metrics/preview
  - fallback quando server non supporta
  - anti-stale: selezione non bumpa sequence

### Test browser (post-deploy, ChatGPT QA Regola D2)

- ChatGPT emette QA tre righe; Cursor non emette.

### Review downstream

- Obbligatoria (bundle DELICATO, rete).
- Claude `raw@FULL_SHA` se disponibile; altrimenti review sostitutiva GPT con checklist per-categoria (rete + nuovo campo stato transiente).

### Deploy

- GIS-only (SSH `ionos-n8n`, solo `goi-gis-app.service`); nessun tocco GraphHopper/Planet-Clone/Docker/Tailscale.

### QA ChatGPT (Regola D2)

- Post-deploy PASS → Cursor fermo → `QA FINALE CHATGPT — PENDING`.
- ChatGPT: 1 messaggio, passaggi `Dove:`/`Azione:`/`Risultato atteso:`.
- In Cursor solo `QA ROUTING-ALTERNATIVE-ROUTES-A PASS operatore`.

### Auto-finito (Regola H)

- Riga PASS trigger automatico workflow `finito` (docs OM §7 + roadmap + autosync + commit/push + verify `HEAD=origin/main=ls-remote` + workspace pulito). Nessun secondo comando `finito`.

### Step 0 — PROBE capacità server (read-only, gating)

Prima di qualsiasi implementazione, all'interno dello stesso blocco:

1. Verifica `/info` su endpoint VPS e Local (solo `routingGraphhopperInfoCheck` esistente): leggere eventuali `features`/`version`/`custom_models` supportati (campi aggiuntivi non attualmente letti da `routingValidateGraphhopperInfo` — lettura opzionale, non modifica la validazione esistente).
2. **Singola** POST `/route` controllata (script locale, **non** nel monolite runtime) con:
   - coordinate fittizie ma **non sensibili** (es. due punti noti pubblici nel Nord-Ovest Italia, come La Spezia 44.1024,9.8236 → Lerici 44.0940,9.8490)
   - body `{ profile: "hiking", points: [...], elevation: true, points_encoded: false, instructions: false, algorithm: "alternative_route", "alternative_route.max_paths": 3, "ch.disable": true }`
3. Esito:
   - **PASS** (200, `paths.length >= 2`): procedere all'implementazione con i parametri provati.
   - **FAIL parziale** (200, `paths.length === 1`): server accetta `algorithm=alternative_route` ma non restituisce alternative; riprovare con `ch.disable:true` esplicito; se ancora 1 path, server non supporta alternative sul graph V3 → fermare blocco, tornare a piano.
   - **FAIL** (400/500, `error` contenente `alternative_route` o `ch.disable`): server non supporta → fermare blocco, tornare a piano.
4. Output step 0: documento diagnostico locale (`C:\tmp\routing-alt-probe.md`); **non** committato; riassunto nel RIEPILOGO blocco.

**Nessuna coordinata operatore. Nessuna chiamata con dati sensibili. Nessuna modifica server.**

---

## 11. Funzioni/regioni toccate dal blocco (sintesi)

| File | Regioni |
|---|---|
| `coordinate_converter Claude.html` | `routingBuildGraphhopperRouteBody` [63451](coordinate_converter Claude.html#L63451); `routingValidateGraphhopperResponse` [63515](coordinate_converter Claude.html#L63515); `routingEnsureState` [61480](coordinate_converter Claude.html#L61480); `routingCalculateRouteGraphhopper` [63636](coordinate_converter Claude.html#L63636); `routingInvalidateRoutePreview` [62132](coordinate_converter Claude.html#L62132); HTML pannello [13383](coordinate_converter Claude.html#L13383); i18n dict |
| `docs/OPERATING_MEMORY.md` | §7 voce `ROUTING-ALTERNATIVE-ROUTES-A` |
| `docs/work-units/WU-0010-outdoor-routing-graphhopper.md` | status + nota |
| `docs/HANDOFF.md` | snapshot se previsto dal workflow |

**Non toccare:** `coordinate_converter Claude.html` build marker al di fuori di `APP_BUILD_ID`/`APP_BUILD_NUM`; sanitizer; storage; import/export; GraphHopper server; Oggetti GIS.

---

## 12. Decisioni operatore realmente necessarie

### Primo sottoblocco (ROUTING-ALTERNATIVE-ROUTES-A)

**NESSUNA DECISIONE OPERATORE NECESSARIA PER IL PRIMO SOTTOBLOCCO** oltre alla scelta già fatta (probe-step0).

- Numero max alternative: decisione tecnica conservativa → **3** (default GraphHopper `alternative_route.max_paths` consueto; bilancia utilità vs costo). Modificabile senza nuova decisione se il probe mostra che 2 o 5 sono più appropriati.
- `ch.disable: true`: deciso dal probe (tecnico).
- UI chip vs select: tecnico (chip per coerenza con `.routing-unit-chip` [13459](coordinate_converter Claude.html#L13459) esistenti).
- IT/EN, FR congelato: governance esistente.

### Blocchi successivi (NON aperture — solo elenco decisioni quando si apriranno)

- **B. Andata-Ritorno**: quale variante (1 = reverse tracciato; 2 = ricalcolo A→B→A; 3 = lista A→…→B→…→A). Non automatizzabile: cambia semantica prodotto.
- **C. Round Trip**: target distance default; seed UI; profile whitelist round-trip. Non automatizzabile.
- **D. Avoid Areas**: fonte aree (poligoni GIS read-only vs stato Routing transiente). Non automatizzabile; **Oggetti GIS FROZEN** vincola.
- **E. Confronto provider**: ha senso solo post-`OUTDOOR-ROUTING-API-GATEWAY-A` (BACKLOG).

---

## 13. Rischi e mitigazioni

| Rischio | Mitigazione |
|---|---|
| Server V3 non supporta `alternative_route` con graph CH | Step 0 probe gating; fallback a single-path |
| `ch.disable:true` su graph custom rallenta eccessivo | Timeout 20s esistente [61315](coordinate_converter Claude.html#L61315); eventuale bump a 30s se probe mostra latenza |
| `paths[i]` con campi `points_encoded:true` (server bug) | Parser esistente già rifiuta (`points.type !== "LineString"` [63523](coordinate_converter Claude.html#L63523)); skip path con warn |
| Stato transiente `alternatives` cresce in RAM per path lunghi | Cap N=3; cleanup su `routingInvalidateRoutePreview` |
| UI confusion (troppe alternative) | Cap N=3; chip discrete; nessun overlay mappa multi-path |
| FROZEN Oggetti GIS violato da Avoid Areas futuro | Contratto esplicito: read-only o stato transiente dedicato; niente `state.gisPolygons` mutation |
| Network exposure (richieste extra) | Stesso endpoint, 1 POST per Calcola; nessuna nuova route; OPSEC gate invariato |

---

## 14. Test e gate

- **Step 0 probe** (read-only server) → gating go/no-go.
- Statici: `git diff --check`, `node --check`, build marker check, monolite escluso da diff se non target.
- Harness JS esteso.
- Review downstream obbligatoria (DELICATO rete).
- Deploy GIS-only.
- QA ChatGPT Regola D2 (3 righe per passaggio).
- Auto-finito Regola H.

---

## 15. Conferma nessun file modificato

- `git status --short`: vuoto
- `git diff --stat`: (vuoto)
- Nessun commit, nessun autosync, nessun `finito`, nessun deploy.
- Bundle F resta **non aperto** nei documenti vivi.
- Runtime autorevole `1f7c05f` / build 101 **invariato**.
- Oggetti GIS **FROZEN**.

---

## 16. Blocco copiabile

```text
STATO FRESCO DA CURSOR
origin/main HEAD: da5615656e3a10b028136e4abd843a3f1d163f98 — docs: orchestratore — riconciliazione finito sessione (baseline intatta)
working tree: ## main...origin/main (pulito)
ultimo blocco PASS: QA-CHATGPT-3LINE-CURSOR-RULES-A CLOSED / PASS docs-only
prossimo candidato: discovery OUTDOOR-ROUTING-BUNDLE-F-DISCOVERY-A (read-only; nessuna apertura runtime)
note operative: tip 1f7c05f / B6.5RGM-A-FIX2 · 101; Bundle F non aperto; Oggetti GIS FROZEN; primo sottoblocco raccomandato ROUTING-ALTERNATIVE-ROUTES-A con step 0 probe (operatore ha scelto probe-step0)
```

---

## 17. Errori o limiti

- Capacità GraphHopper V3 su `alternative_route`/`round_trip`/`custom_model` runtime: **UNKNOWN** fino a probe step 0. Non inventate.
- WU-0010 §3 menziona `alternatives`/`selectedAlternative`/`lastResult`/`requestGeneration`/`abortController` come piano: il runtime li chiama diversamente o non li ha (`requestSequence`/`requestController`). Allineamento nominale WU ↔ runtime = backlog docs futuro, non in questo blocco read-only.
- Nessuna richiesta `/route` inviata in questa discovery (vincolo rispettato).
- `.cursor/rules/30-output-workflow.mdc` e OM §4 Regola D2/H applicabili invariati al futuro blocco (già allineate).

---

