# ROUTING-LAND-ONLY-NO-FERRY-A — AUDIT + STOP HARD (isolamento)

**Categoria:** DELICATO  
**Esito pass:** **STOP HARD** — nessuna patch runtime, nessun nuovo candidate, nessun deploy, nessun finito  
**Motivo primario:** impossibile pubblicare un secondo **RUNTIME CANDIDATE** senza alterare [`docs/FRONTIER.md`](../../FRONTIER.md) mentre `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX4` è in **REVIEW PACKAGE READY**.

## Stato canonico verificato (pre-intervento)

| Voce | Valore |
| --- | --- |
| `origin/main` / `HEAD` / `ls-remote` | `407a08992f5499b678617a3db78c0394c5476e00` |
| Working tree | clean |
| FRONTIER BLOCCO | `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX4` |
| FRONTIER GATE | Review DELICATO — FIX4 in review (nessun PASS) |
| RUNTIME LIVE | tip `f215011…` · build **256** |
| RUNTIME CANDIDATE | tip `e3da4e8…` · build **261** · blob Git `b7d62b11…` |
| Oggetti GIS | FROZEN / MAINTENANCE-ONLY |

**FRONTIER non modificato in questo pass.** Nessuna promozione/PASS/chiusura del blocco Cerca coordinate.

## Requisito prodotto (registrato)

Il GIS Tool deve calcolare **solo percorsi terrestri**, senza traghetti / navigazione marittima, per GraphHopper e ORS, tutti i profili terrestri, normale / alternative / VIA / A-R / anello / confronto / salvataggio traccia.

Messaggio atteso se assente rete terrestre continua:

> «Percorso terrestre non disponibile senza collegamenti marittimi.»

Ponti/tunnel stradali consentiti. Nessuna linea retta costa–costa. Nessun provider che ignora il vincolo.

---

## AUDIT — simboli e punti di modifica (monolite LIVE tip docs HEAD = `407a089`, runtime candidate Search = `e3da4e8`)

### GraphHopper — builder e vincoli

| Simbolo | Ruolo attuale | Intervento necessario (quando ammissibile) |
| --- | --- | --- |
| `routingBuildGraphhopperRouteBody` (~90050) | Body `/route`: profile, points, elevation; alternative_route se 2 punti; poi avoid | Applicare sempre priorità land-only **dopo/con** avoid |
| `routingBuildGraphhopperRoundTripBody` (~89245) | Anello: `algorithm=round_trip`, `ch.disable`, poi avoid | Idem |
| `routingApplyAvoidPayloadToBody` (~88799) | Se aree attive → `custom_model` + `ch.disable=true` (**sostituisce** `body.custom_model`) | **Comporre** (merge) priority ferry + aree; non sostituire cieco |
| `routingBuildAvoidAreasCustomModel` (~88767) | `areas` + `priority` `in_<id>` ×0 | Preservare; unire array `priority` |
| `routingAvoidPreflightBlock` / `ROUTING_AVOID_GH_*` | Gate avoid+alt / avoid+anello | Verificare compatibilità con custom_model ferry obbligatorio |
| `routingNearestForPoint` (~87946) | GET `/nearest?point=` — **nessun** filtro edge/ferry | Rischio snap su arco ferry; serve strategia supportata dal grafo o rifiuto esplicito |
| `routingResolveProvider` (~88286) | Auto: local→vps; riusa stesso body builder | Vincolo deve restare su **ogni** candidato; errore ≠ retry senza filtro |
| `routingParseGraphhopperPath` (~90125) | Geometria LineString; `instructions: false` | Filtro primario = motore; path_details ferry non richiesti oggi |

**Regola target GH (quando `road_environment` supportato):**

```json
{ "priority": [{ "if": "road_environment == FERRY", "multiply_by": "0" }] }
```

Obbligatoria; merge con avoid esistente; `ch.disable` se custom_model presente.

### ORS — builder e gateway

| Simbolo | Ruolo attuale | Intervento necessario |
| --- | --- | --- |
| `routingBuildOrsRouteBody` (~90688) | coordinates + alternative_routes; poi avoid polygons | Forzare `options.avoid_features` ⊇ `["ferries"]` |
| `routingBuildOrsRoundTripBody` (~90701) | `options.round_trip`; poi avoid polygons | Idem (append, non cancellare) |
| `routingApplyAvoidPayloadToOrsBody` (~90680) | Solo `avoid_polygons` | Estendere o aggiungere helper land-only che **merge** `avoid_features` |
| `routingPostOrsDirections` (~90922) | POST gateway | Nessun strip lato client osservato |
| `ROUTING_ORS_PROFILES` | `foot-hiking`, `foot-walking`, `cycling-mountain` | Verificare supporto `avoid_features: ferries` per ciascun profilo ORS |

**Gateway** [`infra/ors-gateway/goi_ors_gateway.py`](../../../infra/ors-gateway/goi_ors_gateway.py):

- `OPTIONS_KEYS` include **`avoid_features`** (riga ~75).
- `sanitize_directions_body` fa whitelist: **non rimuove** `avoid_features` se presente.
- Nessuna modifica infrastrutturale/API key in questo pass (né richiesta).

### Confronti / preview / traccia

| Area | Note audit |
| --- | --- |
| Confronto GH/ORS (~91374+) | Costruisce body via stessi builder → land-only va nei builder centrali |
| Preview / salvataggio traccia | Nessun check ferry post-risposta oggi; rifiuto pre-preview se motore/istruzioni attestano ferry |
| Fallback Auto | Solo cambio endpoint GH; **non** ricostruisce body senza vincoli — ma oggi i vincoli ferry **non esistono** |
| i18n | Nuova stringa IT only (L10N-FREEZE EN/FR) |

### Config documentata VPS (sola lettura docs; nessun cambio infra)

| Servizio | Fonte | Note ferry |
| --- | --- | --- |
| GraphHopper | [`docs/INFRA_VPS.md`](../../INFRA_VPS.md) §4 · `100.114.7.53:8989` · profili `hiking`, `hiking_easy`, `mtb_touring`, `mtb_trail` · GH 11.0 | PoC WU-0011 elenca `road_environment` in `graph.encoded_values` ([`WU-0011`](../../work-units/WU-0011-infra-gh-1a-graphhopper-local-poc.md) §config-import-A). **Verifica live `/info` da questa sessione: TIMEOUT** (Tailscale non raggiungibile). Supporto FERRY sul grafo **VPS non attestato in questo pass**. |
| ORS gateway | stesso INFRA §5 · whitelist `avoid_features` | OK per inoltro; supporto profilo lato api.openrouteservice da verificare a runtime |

---

## FINDING DI STOP (preciso)

### F1 — Isolamento candidate / FRONTIER (bloccante metodologico)

FRONTIER espone **un solo** campo `RUNTIME CANDIDATE`, oggi occupato da Search FIX4 (`e3da4e8` / build 261) in **REVIEW PACKAGE READY**.

Un candidate routing richiederebbe:

1. commit monolite su `main` (nuovo tip runtime), e  
2. aggiornamento FRONTIER del candidate/gate/NEXT,

oppure un candidate non registrato in FRONTIER (fuori metodo di consegna REVIEW PACKAGE READY).

Entrambe le vie **alterano o aggirano** lo stato Search in review. Il prompt impone STOP in questo caso.

**Azione eseguita:** audit + evidence only. **Nessuna** modifica a `coordinate_converter Claude.html`. **Nessun** nuovo build. FRONTIER Search **invariato**.

### F2 — Supporto `road_environment == FERRY` sul grafo VPS (aperto, pre-impl)

Documentazione PoC include `road_environment` nell’import. **`GET http://100.114.7.53:8989/info` timeout** da questa macchina. Prima di implementare la regola GH obbligatoria serve attestazione `/info` (o evidence operatore) che l’EV e il valore `FERRY` siano presenti sul grafo in produzione. Vietata ricostruzione grafo in questo task.

### F3 — Snap `/nearest` senza filtro ferry (rischio tecnico, post-isolamento)

`routingNearestForPoint` non filtra archi ferry. Anche con `custom_model` sul `/route`, lo snap potrebbe ancorare partenza/arrivo/VIA a un collegamento ferry. Va progettato al ripristino del gate (parametri nearest supportati vs rifiuto UX).

### F4 — Nessun bypass da implementare “dopo”: oggi il vincolo è assente

Stato corrente: **nessun** `avoid_features: ferries`, **nessuna** priority `road_environment == FERRY`. Qualsiasi percorso che il motore risolva via ferry può essere accettato, mostrato e salvato come traccia.

---

## Piano di ripresa (dopo chiusura/PASS Search o decisione operatore di sospendere Search)

1. Attestare GH `/info` → `road_environment` / `FERRY`.  
2. Se non supportato → STOP per percorso GH + finding; non rebuild grafo.  
3. Patch solo routing: merge custom_model GH + `avoid_features` ORS; messaggio IT; selftest payload.  
4. Candidate routing immutabile + FRONTIER routing (solo quando Search non è più candidate attivo in review, o con protocollo esplicito operatore per swap gate).  
5. Acceptance A–H con evidence payload/risposte; no deploy prima review DELICATO.

## Non fatto

- Nessuna patch monolite  
- Nessun deploy / promote / finito  
- Nessuna modifica FRONTIER Search  
- Nessuna modifica ORS gateway / secret / ACL  
- Nessuna ricostruzione grafo  

## NEXT

1. **Primario (FRONTIER):** Review DELICATO su Search FIX4 `raw@e3da4e8`.  
2. **Parcheggiato:** ripresa `ROUTING-LAND-ONLY-NO-FERRY-A` solo dopo isolamento ammissibile (Search fuori da RUNTIME CANDIDATE in review, o decisione operatore esplicita).
