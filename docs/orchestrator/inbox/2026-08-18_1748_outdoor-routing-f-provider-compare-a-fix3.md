# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3 — candidate 224

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE` (override prompt: **NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito)  
**GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**LIVE FRONTIER:** resta build **220** / `cfee0e4`

## Candidate

| Campo | Valore |
| --- | --- |
| **FULL SHA** | `d4558419c7139a4587389528d76bd82395ada100` |
| Base 223 | `4a6dca938057d2c1e2b0f0a2cdec1480c13f3d20` |
| Build / ID | **224** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3` |
| Blob monolite | `4a9565af089bde990b9d9c64689164da21949273` |
| Bytes LF | `10657904` |
| SHA-256 LF | `a895f02c79339e19887dc3c2f3cb903bcbabd7bf3f25f14c86202fff68700a0a` |
| Helper | **0.1.3** invariato |
| Diff vs 223 | `coordinate_converter Claude.html` +492 / −118 (scoped) |
| Selftest globale | **769/769 PASS** |

Un solo runtime commit: `feat(routing): FIX3 layout, VIA pick, loop/compare readability, build 224`.

Questo pass **non** deploya. VPS resta sul candidate **223** deployato (`4a6dca9`).

## Layout planner (FIX3)

Ordine in `#routingPlannerPanelBody`:

1. stato + nota servizio
2. `<details id="routingGraphhopperProviderDetails">` **chiuso di default** — Provider GraphHopper + endpoint (niente spazio fisso)
3. profilo
4. lista punti / waypoint
5. `#routingRouteOptionsZone` — **Percorsi alternativi** + **Confronto provider** nella stessa zona funzionale
6. card risultato (summary + velocità; senza alternative duplicate)
7. mode + azioni **senza** «Centra risultato» (resta il Centra per-alternativa e `routingCenterResultAction` per fit dopo calcolo)
8. anello / save / dettagli altimetrici / aree da evitare / unità / loopback

Minimize / close / restore invariati.

## Correzioni UX / runtime

1. **Aggiungi punto di passaggio** = insert VIA + `routingEnterPickMode` immediato (casella editabile resta per indirizzo/coordinate).
2. **Tab** sulla casella nome: `routingPointLabelHandleTab` — focus locale (Chiudi risultati se dropdown aperto, altrimenti «Scegli sulla mappa» della stessa riga). Grip `tabindex="-1"`. Nessun trap.
3. **Dismiss geocoding:** pulsante visibile «Chiudi risultati»; `routingSearchDismiss` chiude la lista **senza** cancellare il testo; `dismissed` evita il reopen su focus finché l’utente non ridigita.
4. **Aree da evitare:** fill più coprente + bordo più spesso; vertici cerchiati; draft evidenziato. Semantica invariata.
5. **Anello 2+ VIA:** `routingEnsureLoopDisplayCoords` chiude visivamente la preview START→…→START se l’ultimo vertice non coincide con lo start (solo display; dati percorso non riscritti). Costruzione HTTP constrained loop invariata.
6. **Compare overlap:** offset laterale solo visivo (`routingOffsetComparePolylinePx`, ±6 px) + casing/halo GH rosso / ORS blu. `data-routing-compare-offset="1"` sul overlay dual-track. **Usa risultato GH/ORS** imposta `chosen` → overlay compare assente, preview canonica senza offset.

## Invarianti

- singolo HTML standalone / vanilla JS
- `state.mapWaypoints[]` / `state.gisPolygons` / Oggetti GIS **FROZEN**
- nessun nuovo storage / GPS / endpoint
- helper 0.1.3 invariato; gateway ORS invariato
- Auto GH Local→VPS invariato; ORS mai Auto
- `forcedOffline` / `opsecStrict` invariati
- zero-VIA `round_trip`, alternative su 2 punti, compare+VIA, avoid+VIA: regression selftest PASS

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING**  
LIVE resta **220**.  
NEXT: review FIX3 candidate **224**.  
NON deploy. NON ABQA. NON QA operatore. NON finito.
