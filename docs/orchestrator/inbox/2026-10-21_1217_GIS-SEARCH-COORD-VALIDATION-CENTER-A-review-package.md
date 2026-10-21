# GIS-SEARCH-COORD-VALIDATION-CENTER-A — REVIEW PACKAGE

**Categoria:** DELICATO (input locale/rete · OPSEC)  
**Gate:** REVIEW PACKAGE READY — **nessun** REVIEW PASS acquisito  
**CLOSURE:** NONE (no deploy · no promote · no finito)

## Identità

| Voce | Valore |
| --- | --- |
| BASE runtime LIVE | `f215011d9b725664506a1a155e27b64d5011fb99` · build **256** · blob `7f9804d5333145552bba65d6570749c070656951` |
| CANDIDATE FULL SHA | `4c2fd18ac3f9a568df8092825245bcc8f79d978f` |
| Build | **257** · `GIS-SEARCH-COORD-VALIDATION-CENTER-A` |
| Blob monolite | `643462c97d1d5079e620c86c5d30c8289da28c3475da7b2353af9a8b78c46d77` |
| Diff scoped | `coordinate_converter Claude.html` · +254 / −20 |

## Diagnosi (pre-patch)

- Handler Cerca/Invio: `bindGeocode` → `runSearch` (ex) andava **diretto** a `geocodeSearch` / offline cities **senza** classificazione coordinate.
- Fixture operatore `3 2t hu 12589 15323` → shape MGRS `32THU1258915323`: regex MGRS match, `colIdx=-1` (zone 32 set `JKLMNPQR` non contiene H) → `err.mgrsInvalid`, ma UI trattava l’input come luogo.
- Sintomo: readout/PUNTO precedente restava visibile senza errore utile; possibile Nominatim su testo spazzatura.
- Parser canonici riutilizzati: `mgrsToLatLonExt` / `parseMGRS`, `parseUTMFree`+`validateUTM`, `parseFreeTextLatLon`, `decodePlusCode`, `bngToWgs84`, `parseSK42GaussKruger`, fallback `autoDetect`.
- Centratura canonica: `renderResults` → `renderMiniMap(lat,lon)` (`resetView` default true) aggiorna `state.lastPoint` + `state.viewCenter`.

## Implementazione

- `classifyGeoSearchInput` + shape helpers (`looksLikeMgrsSearchShape`, `looksLikeUtmSearchShape`, `looksLikeLatLonSearchShape`, …) — shape-first per evitare coercizione incompleta MGRS→LatLon (`32T HU 12`).
- `bindGeocode`: percorso condiviso Cerca/Invio; `coord_valid` → `applyLocalCoord` (locale, `skipReverse`); `coord_invalid` → feedback IT via `tIt('geo.coordInvalid')`, `gen++`, nessun network; `place_text` → `runPlaceSearch` invariato.
- Debounce as-you-type: skip rete se input coordinate-shaped.
- UI: `#geoSearchFeedback`; hint IT `search.panelHint`; chiavi `geo.coordInvalid` / `geo.coordOk` (solo IT, L10N freeze).
- Selftest assert classificazione in `runSelfCheck`.

## Prove locali (Automated Browser QA locale — non deploy)

Ambiente: `http://127.0.0.1:8765` · build 257.

| Caso | Esito |
| --- | --- |
| Classify fixtures invalid MGRS ×3 + incompleto + out-of-range | PASS `coord_invalid` |
| Place text con cifre (`Via Roma 12`, CAP) | PASS `place_text` |
| DD / MGRS lowercase / UTM lowercase → valid + known coords | PASS |
| Cerca click invalid: PUNTO/view invariati, Nominatim 0, feedback IT | PASS |
| Cerca valid DD: center+lastPoint, no Nominatim forward/reverse | PASS |
| Enter UTM: near Roma known, no Nominatim fwd/rev | PASS |
| Invalid dopo valid: punto invariato | PASS |
| OPSEC strict: coord locale OK; place bloccato | PASS |
| Waypoint auto-create | PASS count 0 |
| `node --check` main script | PASS |

Nota: `runSelfCheck` riporta ancora fail preesistenti non correlati (Vincenty Roma-Abidjan tolleranza; D-Flight helper offline). Assert classificazione search non in fail list.

## Non fatto (vincoli)

- Nessun deploy / promote LIVE  
- Nessun `finito`  
- Nessuna review esterna attestata  
- Nessun scheduler / D-Flight  
- Oggetti GIS FROZEN non toccato  

## NEXT

Review DELICATO da `raw@4c2fd18…` → eventuale FIX → solo dopo gate: deploy + QA umana.
