# OUTDOOR-ROUTING-F-AVOID-AREAS-A — evidence (candidate)

**BLOCK-ID:** `OUTDOOR-ROUTING-F-AVOID-AREAS-A`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**Deploy / ABQA / QA operatore:** **NOT EXECUTED**

## BASE

| Campo | Valore |
| --- | --- |
| BASE LIVE | `1e37e56f04ddb9e2ea85975db978498b6727da6c` · build **217** · `GIS-WORKSPACE-LEGENDS-F-BATCH1-FIX2` |
| FULL SHA (candidate) | `12a7477414a311b1650e9b575c89cab6966e240e` |
| Blob git | `5c25a1fa923fb41f9a82e9cecb9108fa61ba681a` |
| SHA-256 LF | `872503b6c77fefa83534e2820a3d301dcc57c8aa0ccdc8d755c8918b09185d42` |

## GraphHopper capability (pre-patch probe)

Endpoint: `http://100.114.7.53:8989/route` · GraphHopper **11.0** (INFRA-GH-1D).

POST con `custom_model.areas` + `priority: [{ if: "in_avoid1", multiply_by: "0" }]` + `ch.disable: true`:

- **HTTP 200** · path restituito
- La Spezia test A→B: distanza **3196 m** senza avoid vs **3793 m** con polygon blocking (+596 m detour) → meccanismo **utilizzabile**

Contratto adottato: stesso schema verificato (Feature Polygon + `in_<areaId>` + `ch.disable` solo quando avoid attive).

## 10 task — esito

| # | Task | Esito |
| --- | --- | --- |
| 1 | State transient session-only `_routingAvoidSession` | PASS |
| 2 | UI sezione Routing + IT/EN | PASS |
| 3 | Draw mode esplicito (click/Esc/undo/confirm) | PASS |
| 4 | Overlay mappa dedicato | PASS |
| 5 | Lista lifecycle + invalidate preview | PASS |
| 6 | Payload `/route` + round_trip con custom_model | PASS |
| 7 | Validazione geom fail-closed + antimeridiano | PASS |
| 8 | requestSequence invalidate su mutazioni | PASS |
| 9 | CSS responsive sezione compatta | PASS (smoke layout) |
| 10 | Regression contract + selftest | PASS |

## Selftest

**644/644 PASS** (+7 `RAA_*`) · `node --check` OK.

## Delta rete / storage / GPS

- **Rete:** nessuna chiamata al boot; solo payload `/route` esistente arricchito su Calcola
- **Storage:** nessuna persistenza (session-only `_routingAvoidSession`)
- **GPS:** invariato
- **Oggetti GIS:** **UNTOUCHED** (`state.gisPolygons` read-only in test)

## WU governance

- **WU-0021:** **CLOSED / PASS** (docs-only close)
- **WU-0012:** OPEN / waiting provider
- **Confronto provider:** NOT OPENED

**NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito
