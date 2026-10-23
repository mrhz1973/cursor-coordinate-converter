# GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX7 — REVIEW PACKAGE

**Categoria:** DELICATO  
**Gate:** REVIEW PACKAGE READY — nessun REVIEW PASS  
**CLOSURE:** NONE (no deploy · no promote · no finito)

## Review precedenti

| Candidate | Esito |
| --- | --- |
| build 257–261 | REVIEW GPT-SOSTITUTIVA **FAIL** (storico invariato) |
| `657422e9c191cae0b09593f4313ebe929bd2c858` · build **262** · blob Git `4385686ac24dd18dde2128909aa3e934db224164` | REVIEW GPT-SOSTITUTIVA **FAIL** (C1–C2) |
| `b60584cc9d32f2f5c035dee0c045673843e85b34` · build **263** · blob Git `3b60b3a107357de9767698e2c67913bbc9b5b571` | REVIEW GPT-SOSTITUTIVA **FAIL**. F1: `45,5; 9,2` e `45,5 9,2` davano 45.5/9.2 in Cerca ma 45 / 5°9'2" in Converti e Incolla. F2: `-44.1N`, `+44.1S`, `N-44.1`, `S+44.1` riuscivano su un'altra posizione. I risultati FIX6 su token estranei, indirizzi e prefissi restano validi. |

Evidence FAIL FIX6 (fuori repo): `C:\Users\Utente\AppData\Local\Temp\goi-review-b60584c`  
Evidence FIX7: `C:\Users\Utente\AppData\Local\Temp\goi-fix7-verify`

## Identità FIX7

| Voce | Valore |
| --- | --- |
| Commit | `080e71c161be76e3ff494b1cdee1aed6889f9290` |
| **Blob Git** | `dc1ec34ddb12c37e0502d074559e7a4aab279106` |
| SHA-256 LF | `d5496fb01873d3748fd1c173f7d4091351f41aec54b7fa37a23947ecd4bcca69` |
| SHA-256 CRLF | `64d85f215e9d0b619315c350ca44a25940ae123c446809f171c1df3610e29ff0` |
| Dimensione LF | 10 902 389 byte |
| Build | **264** · `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX7` |
| LIVE | build **256** invariato |

## Correzione

Tutto passa dal parser canonico `parseFreeTextLatLon`; nessun parser parallelo.

- **F1** — dopo la rimozione dell'etichetta (`DD`, `LL`…) il parser applica `normalizeEuroDecimalLatLonSearch`, la stessa funzione che Cerca usava già. Converti, Incolla (`autoDetect`), routing ed editor leggono quindi `45,5; 9,2`, `45,5;9,2` e `45,5 9,2` come 45.5 / 9.2. La regex accetta ora anche `+` oltre a `-`, per simmetria con i segni già supportati.
- **F2** — il parser registra il segno esplicito di ogni numero. Se il segno dei gradi contraddice la lettera (N con `-`, S con `+`, E con `-`, W con `+`, compreso `-0`) il parse fallisce con `err.parseFailed`; prima la lettera sovrascriveva il segno. Un segno coerente resta valido (`-44.1S`, `+44.1N`, `-0 … S`).
- **Stesso difetto su minuti e secondi** — `DMS 44 -0 30 N …` era accettato perché `-0 < 0` è falso. Un `-` su minuti o secondi ora dà `err.minutes` / `err.seconds`.
- **Editor Poligoni** (manutenzione, area FROZEN/MAINTENANCE-ONLY) — `polygonCollectVertexCoordModalInputText` univa Lat «45,5» e Lon «9,2» in `45,5, 9,2` e salvava il vertice a 45 / 5.15. Ora un campo che contiene un solo numero con virgola decimale viene letto come decimale prima dell'unione, come già fa `polygonParseDecimalCoordInput`. Un campo Lat isolato «45,5» non diventa più la coppia 45 / 5.
- Selftest `runSelfCheck` esteso con questi casi; con `?debug` passa senza assert falliti.

Diff: 1 file, +63 / −9. Nessun fetch, URL, storage, `innerHTML`, `alert`/`confirm`/`prompt` o geolocalizzazione aggiunti. Builder GraphHopper/ORS non toccati.

## Semantica ambigua — non cambiata, da decidere solo se l'operatore lo chiede

Queste forme hanno ora lo stesso esito in tutti gli ingressi, ma l'interpretazione resta quella storica:

| Input | Esito attuale ovunque | Motivo |
| --- | --- | --- |
| `45,5` | 45 / 5 | la virgola isolata separa lat e lon, come `45, 5` |
| `45,5, 9,2` | 45 / 5°9'2" | tre virgole: decimale o separatore non è decidibile |
| `45,5N 9,2E` · `44,6 N, 9,49 E` | DDM (45°5'N 9°2'E) | virgola + emisfero: decimale o minuti non è decidibile |

Rendere decimali queste forme è una decisione semantica: fuori scope per il prompt (STOP previsto).

## Matrice di equivalenza (attesi indipendenti, scritti prima della patch)

Ingressi verificati per ogni riga:
- Cerca: `classifyGeoSearchInput`;
- Converti testo libero: `parseFreeTextLatLon`;
- Incolla: `autoDetect`;
- routing: `routingSearchTryParseCoords`;
- editor Poligoni, sia sul campo combinato (`polygonParseVertexCoordInputText`) sia sul formato DMS;
- editor Waypoint: `parseWaypointEditorCoordText`.

| Input | Atteso | FIX6 (Converti/Incolla/routing) | FIX7 tutti gli ingressi |
| --- | --- | --- | --- |
| `45,5; 9,2` | 45.5 / 9.2 | 45 / 5.150556 ✗ | ✓ 45.5 / 9.2 |
| `45,5 9,2` | 45.5 / 9.2 | 45 / 5.150556 ✗ | ✓ 45.5 / 9.2 |
| `45,5;9,2` | 45.5 / 9.2 | 45 / 5.150556 ✗ | ✓ 45.5 / 9.2 |
| `-45,5; 9,2` | -45.5 / 9.2 | -45 / 5.150556 ✗ | ✓ -45.5 / 9.2 |
| `+45,5; +9,2` | 45.5 / 9.2 | 45 / 5.150556 ✗ (anche Cerca) | ✓ 45.5 / 9.2 |
| `45.5, 9.2` | 45.5 / 9.2 | 45.5 / 9.2 | ✓ 45.5 / 9.2 |
| `45.5 9.2` | 45.5 / 9.2 | 45.5 / 9.2 | ✓ 45.5 / 9.2 |
| `45, 5` | 45 / 5 | 45 / 5 | ✓ 45 / 5 |
| `45,5` | ambiguo: stesso esito ovunque | 45 / 5 | ✓ 45 / 5 |
| `45,5N 9,2E` | ambiguo: stesso esito ovunque | 45.083333 / 9.033333 | ✓ 45.083333 / 9.033333 |
| `44.1N 9.8E` | 44.1 / 9.8 | 44.1 / 9.8 | ✓ 44.1 / 9.8 |
| `44.1S 9.8E` | -44.1 / 9.8 | -44.1 / 9.8 | ✓ -44.1 / 9.8 |
| `-44.1S 9.8E` | -44.1 / 9.8 | -44.1 / 9.8 | ✓ -44.1 / 9.8 |
| `+44.1N 9.8E` | 44.1 / 9.8 | 44.1 / 9.8 | ✓ 44.1 / 9.8 |
| `44.1N -9.8W` | 44.1 / -9.8 | 44.1 / -9.8 | ✓ 44.1 / -9.8 |
| `44.1N +9.8E` | 44.1 / 9.8 | 44.1 / 9.8 | ✓ 44.1 / 9.8 |
| `N44.1 E9.8` | 44.1 / 9.8 | 44.1 / 9.8 | ✓ 44.1 / 9.8 |
| `E9.8 N44.1` | 44.1 / 9.8 | 44.1 / 9.8 | ✓ 44.1 / 9.8 |
| `DD +44.1, +9.8` | 44.1 / 9.8 | 44.1 / 9.8 | ✓ 44.1 / 9.8 |
| `DMS +44 6 0 N +9 49 0 E` | 44.1 / 9.816667 | 44.1 / 9.816667 | ✓ 44.1 / 9.816667 |
| `DMS -0 0 1 9 0 0` | -0.000278 / 9 | -0.000278 / 9 | ✓ -0.000278 / 9 |
| `DMS -0 0 1 S 9 0 0 E` | -0.000278 / 9 | -0.000278 / 9 | ✓ -0.000278 / 9 |
| `44.1, 9.8` | 44.1 / 9.8 | 44.1 / 9.8 | ✓ 44.1 / 9.8 |
| `30nul8431881439` | ≈ 5.259444 / -4.043909 (±1e-4) | 5.259439 / -4.043914 | ✓ uguale; testo libero e routing non leggono griglie (rifiuto atteso) |
| `33t 291952 4640699` | ≈ 41.8908 / 12.4922 (±1e-3) | 41.890853 / 12.492247 | ✓ uguale; testo libero e routing rifiutano |
| `-44.1N 9.8E` | rifiuto | 44.1 / 9.8 ✗ | ✓ rifiuto |
| `+44.1S 9.8E` | rifiuto | -44.1 / 9.8 ✗ | ✓ rifiuto |
| `N-44.1 E9.8` | rifiuto | 44.1 / 9.8 ✗ | ✓ rifiuto |
| `S+44.1 E9.8` | rifiuto | -44.1 / 9.8 ✗ | ✓ rifiuto |
| `44.1N -9.8E` | rifiuto | 44.1 / 9.8 ✗ | ✓ rifiuto |
| `44.1N +9.8W` | rifiuto | 44.1 / -9.8 ✗ | ✓ rifiuto |
| `DMS -0 0 1 N 9 0 0 E` | rifiuto | 0.000278 / 9 ✗ | ✓ rifiuto |
| `44° foo1 9° bar2` | rifiuto | rifiuto | ✓ rifiuto |
| `Via 20 Settembre 12` | luogo in Cerca · rifiuto altrove | rifiuto | ✓ |
| `DD 44foo 9bar` | rifiuto | rifiuto | ✓ rifiuto |
| `44.1 N S` | rifiuto | rifiuto | ✓ rifiuto |
| `DMS 44 -6 0 N 9 49 0 E` | rifiuto | rifiuto | ✓ rifiuto |
| `3 2t hu 12589 15323` | rifiuto | rifiuto | ✓ rifiuto |

Helper su tutti gli ingressi: FIX6 **26/38**, FIX7 **38/38**. I 12 fallimenti FIX6 sono esattamente F1 (5 casi) e F2 (7 casi). L'editor Poligoni arrotonda a 1e-7 (`gisSanitizeCoordinate`, invariante preesistente); la tolleranza è stata applicata solo a quell'ingresso.

## Interazioni reali per ingresso

Prima di ogni caso viene eseguito un sentinel valido `10, 20`. Così un caso invalido deve lasciare il punto a 10/20, e due false-success consecutive sullo stesso punto non sembrano un «invariato».

| Ingresso | Azione | FIX6 | FIX7 |
| --- | --- | --- | --- |
| Cerca | fill `#geoInput` + Enter; controllo `lastPoint`, `viewCenter`, waypoint e richieste | 8/12 | **12/12** |
| Converti → Testo libero | fill `#free-text` + `#btnConvert` (attivato da tastiera: in headless il mouse non lo raggiunge perché resta fuori viewport) | 6/12 | **12/12** |
| Incolla | fill `#pasteInput` + click mouse `#pasteDetect`; `confirm` registrato | 6/12 | **12/12** |
| Routing, campo punto | planner aperto con `openTrackModal()` + click «Pianifica percorso»; fill + Enter sul campo | 6/12 | **12/12** |
| Editor waypoint | fill `#wpFieldCoord` + click «Salva» | 0/4 | **4/4** |
| Editor Poligoni, vertice | bozza creata con 3 click reali sulla mappa; «Modifica 1», campi Lat/Lon, «Salva» | 1/4 | **4/4** |

I casi UI coprono `45,5; 9,2`, `45,5 9,2`, `-44.1N`, `+44.1S`, `N-44.1`, `S+44.1`, `-44.1S`, `+44.1N`, i token estranei, l'indirizzo, `DMS -0 …` e `E9.8 N44.1`. Sugli invalidi:
- il punto non si muove;
- non viene creato nessun waypoint;
- in Incolla `confirm` non viene chiamato;
- Converti, waypoint e poligoni mostrano un errore («Formato non riconosciuto…», «Coordinate non valide.»).

L'unica ricerca Nominatim (mock) è quella su `Via 20 Settembre 12`, che è testo di luogo. Nessun errore di pagina.

## Regressioni (stessi script del reviewer FIX6, confronto riga per riga)

| Suite | FIX6 | FIX7 |
| --- | --- | --- |
| 55 fixture storiche (31 + 24) | 31 + 24 | **31 + 24** |
| 25 casi FIX5 (`review-structure`) | 25/25 | **25/25** |
| FIX5 classificatore + UI | 18/18 · 6/6 | **18/18 · 6/6** |
| FIX6 parser condiviso + Converti UI | 14/14 · 11/11 | **14/14 · 11/11** |
| UI regressione / extended / segni / structure | invariati | **identici riga per riga** |
| Boundary (25 + UI 8) | 22 + 7 | **22 + 7**, stesse esclusioni documentate da FIX4: `DD - 44.1 9.8`, `32T NU -12589 15323`, `- 44.1 9.8` |
| OPSEC strict / geocoding off / offline (click reale) | 0 richieste Nominatim | **0 richieste Nominatim**, identico |
| Stale (Roma → Milano senza selezione) | punto invariato | **identico** |

Unica riga diversa da FIX6: `euro` in classifier-extended. Nel verbale FIX6 il campo `canonical` (`autoDetect`) dava 45 / 5.15 contro 45.5 / 9.2 di Cerca; in FIX7 coincidono.

Richieste esterne bloccate: solo tile `basemaps.cartocdn.com`, `api.open-meteo.com` e `fonts.googleapis.com`, cioè gli stessi host di FIX6. Nessun endpoint nuovo.

## File evidence (`goi-fix7-verify`)

- Harness: `matrix.cjs`, `editors-ui.cjs`, `poly-fields.cjs`, `ambiguous.cjs`, `selfcheck.cjs`, `compare.cjs`.
- Risultati: `baseline-fix6.json`, `matrix-fix7.json`, `editors-fix6.json`, `editors-fix7.json`, `poly-fields.json`, `ambiguous-fix7.json` (le 4 forme ambigue hanno lo stesso esito su 6 ingressi), `selfcheck-fix7.json`, `regression-compare.json`.
- Script e risultati del reviewer rieseguiti: `regr/`.
- Diff: `diff-fix7.patch`.

## Non fatto

No deploy · no promote · no finito · audit traghetti non duplicato · builder GH/ORS invariati · semantica ambigua non toccata.

## NEXT

Review DELICATO su `raw@080e71c` (blob Git `dc1ec34d`).
