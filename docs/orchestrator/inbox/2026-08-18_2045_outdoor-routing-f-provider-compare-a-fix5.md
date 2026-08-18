# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5 — candidate 227

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE` (override: **NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito)  
**GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**LIVE FRONTIER:** resta build **220** / `cfee0e4`

QA operatore FIX4-FIX1 (226): **FAIL SCOPED**. Tutto il resto di FIX4/FIX1 resta approvato. Questo FIX5 tocca solo i 5 finding citati.

## Candidate

| Campo | Valore |
| --- | --- |
| **FULL SHA** | `118dc9d511c547f5032a7d0fd2f81dc65091b72a` |
| Base 226 (FIX4-FIX1) | `2e616352042f63a650124efcabe704796e6042af` (blob `82ecf7d7…`) |
| Build / ID | **227** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5` |
| Blob monolite | `20c09c0c23ab338082abef3b661bb079e32559d9` |
| Bytes LF | `10702356` |
| SHA-256 LF | `272c645dd05e58360c643e764d6edc76a96800ee20edcf20fea91d66eb8f0b3a` |
| Helper | **0.1.3** invariato |
| Diff vs 226 | `coordinate_converter Claude.html` +423 / −88 |
| Selftest globale | **829/829 PASS** (RPCF5 28/28 · RWF1 8/8) |

Un solo runtime commit: `fix(routing): FIX5 compact params, track lifecycle, alt borders, ring+VIA, build 227`.

Questo pass **non** deploya. VPS resta sul candidate **226** deployato (`2e61635`).

## 1–2. Barra parametri compatta + Percorso integrato

`#routingParamsRow` ora contiene, in ordine: **Profilo** (select) · **Percorso** (chip Solo andata / Andata e ritorno / Anello, `id="routingModeGroup"`) · **Velocità media** (select) · **Calcola percorso**.

- I chip Percorso sono gli stessi nodi (nessuna seconda copia). `#routingModeRow` resta solo per le azioni (Annulla / Modifica coordinate / Aggiungi VIA / Inverti / Salva).
- Select: `flex:0 0 auto`, `width:max-content`; override di `#routingProfileSelect { width:100% }` via `.routing-params-row #routingProfileSelect`.
- `routingSyncModeRowUi` / `routingWireModeRowOnce` usano `routingModeChipsHost()` (`#routingModeGroup`).
- Semantica `routeMode` / profili invariata. Aria IT: `routing.paramsRowAria`.

## 3. Pianifica percorso ↔ modal Traccia

API canoniche: `gisMinimizePanel("trackModal", "gis.minimized.track")` / `gisRestoreMinimizedPanel("trackModal")`.

- `routingMaybeMinimizeTrackForPlanner()` (`93909`): se Traccia è aperta e **non** già minimizzata → minimizza e setta `state._routing._trackMinimizedByPlanner`.
- Apertura fresh azzera `_plannerCommitted` / flag; reopen (planner già aperto) non resetta il commit.
- `closeRoutingPlannerPanel()` (`93923`): snapshot flag **prima** di `routingFullCleanup()` (che azzera `state._routing`); se minimizzata dal planner e **nessun commit** → restore solo se ancora minimizzata.
- Commit esplicito (`routingMarkPlannerCommit`, `93903`): Usa risultato GH/ORS (`routingCompareChoose`); scelta alternativa applicata (`routingSelectAlternativeAt`); Salva come traccia confermato. **Calcola non è commit**. Overlay-chip in confronto live non è commit.
- Traccia già minimizzata manualmente: flag resta false → nessun restore.

## 4. Bordi colore alternative

Le classi esistevano con `border-color:transparent` — il bordo visibile non coincideva con lo stroke SVG.

Specificità `#routingPlannerPanel button.btn.routing-alt-chip.is-route-*`:

| Chip | Fill | Bordo = stroke traccia |
| --- | --- | --- |
| GH-0 | `#b91c1c` | `#ef4444` |
| GH-1 | `#c2410c` | `#f97316` |
| GH-2 | `#9d174d` | `#db2777` |
| ORS-0 | `#1d4ed8` | `#2563eb` |
| ORS-1 | `#0e7490` | `#06b6d4` |
| ORS-2 | `#0f766e` | `#0d9488` |

Attiva: `border-width:3px` + outline nel colore stroke. Label Principale / Alternativa + provider restano. Selftest verifica **computed** `border-top-color`, non solo className.

## 5. Anello + VIA / alternative

Guard FIX2 `routingAlternativesAllowed(n === 2)` **invariato** (HTTP 400 su `alternative_route` / `alternative_routes` multi-point). Payload START→VIA→START resta senza alternatives.

Caso B (provider non offre alternative valide): una sola route per provider; nessuna geometria inventata; nota IT `#routingAlternativesNote` (`routing.altConstrainedNoAlts`): «Percorso Anello vincolato: {provider} non offre alternative per questa configurazione.»

- Single-provider Anello vincolato: riga alternative visibile con chip Principale + nota.
- Confronto: entrambe le main GH/ORS restano visibili (`routingCollectPreviewOverlayTracks`); nota per ciascun provider senza alt; coincidenza 45 m invariata.
- Anello zero-VIA (seed) resta sul flusso «Genera un altro anello» — la riga alternatives resta nascosta come prima.

## Selftest RPCF5 (28/28)

`routingCompareFix5SelfTest` concatenata in `dflightSelfTestAll` con Fix3+Fix4+RWF1. API `GOIDflight.selfTestRoutingCompareFix5`.

Params row Profile+Mode+Speed+Calc · nessuna duplicazione chip in mode row · select `flex-grow:0` / `width:max-content` · payload 2pt alt sì / loop chiuso alt no · computed border = palette · Anello+VIA explanation · compare entrambe le main · Track auto-min / restore no-commit / no-restore dopo commit / no-restore se min manuale · `mapWaypoints` / `gisPolygons` invariati.

Assert storici 226 / FIX4-FIX1 → 227 / FIX5 (28 occorrenze ID).

## NON modificato

ORS scelto blu · GH scelto rosso · elevation solo route attiva · identity GH/ORS · warning Anello + lifecycle FIX1 · Avoid dblclick · Tab punto→punto→Calcola · Add VIA pick immediato · geocoder dismiss · minimize/close/restore planner · OPSEC · forcedOffline/opsecStrict · Auto GH Local→VPS · ORS mai Auto · `state.mapWaypoints[]` · `state.gisPolygons` · Oggetti GIS FROZEN · helper 0.1.3.

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING**  
LIVE resta **220**.  
NEXT: review FIX5 candidate **227**.  
NON deploy. NON ABQA. NON QA operatore. NON finito.
