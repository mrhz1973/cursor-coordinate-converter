# GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX6 — REVIEW PACKAGE

**Categoria:** DELICATO  
**Gate:** REVIEW PACKAGE READY — nessun REVIEW PASS  
**CLOSURE:** NONE (no deploy · no promote · no finito)

## Review precedenti

| Candidate | Esito |
| --- | --- |
| build 257–261 | REVIEW GPT-SOSTITUTIVA **FAIL** (storico invariato) |
| `657422e9c191cae0b09593f4313ebe929bd2c858` · build **262** · blob Git `4385686ac24dd18dde2128909aa3e934db224164` | REVIEW GPT-SOSTITUTIVA **FAIL** (C1–C2). P1 `+`, assi, incomplete e le 55+25 fixture erano **PASS**. Tre sonde sui trattini restano fuori scope. |

Evidence FAIL FIX5 (fuori repo): `C:\Users\Utente\AppData\Local\Temp\goi-review-657422e-507lhd3t`  
Evidence FIX6: `C:\Users\Utente\AppData\Local\Temp\goi-fix6-verify`

## Identità FIX6

| Voce | Valore |
| --- | --- |
| Commit | `b60584cc9d32f2f5c035dee0c045673843e85b34` |
| **Blob Git** | `3b60b3a107357de9767698e2c67913bbc9b5b571` |
| SHA-256 LF | `81b0479faef0c0b9e536d354267f03612a4942dd9fe798d8ae574a8c5b5a9981` |
| SHA-256 CRLF | `fa276e6b53b16c66430ec23950a38bb8ae80fe0847e009e9fdc358c9445a8d1f` |
| Build | **263** · `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX6` |
| LIVE | build **256** invariato |

## Correzione

`parseFreeTextLatLon` non ignora più i token sconosciuti: se un token non è numero, segno, emisfero o virgola, il parse fallisce. `autoDetect` e `routingSearchTryParseCoords` usano quel risultato, quindi non inventano un punto.

`doPasteDetect`: geocoding con conferma solo se `classifyGeoSearchInput` è `place_text`. Una coordinata invalida resta errore locale.

## Matrice consumatori

| Ingresso | Esito verificato |
| --- | --- |
| Cerca `classifyGeoSearchInput` | junk/indirizzo/DD foo invariati (`coord_invalid` o `place_text`); validi invariati |
| Converti testo libero `doConvert` → `parseFreeTextLatLon` | UI 11/11: validi aggiornano il punto; `44° foo1`, `Via 20 Settembre 12`, `DD 44foo 9bar` mostrano errore e non spostano `lastResult` |
| Incolla `doPasteDetect` → `autoDetect` | junk: errore, `confirm` non chiamato; indirizzo: conferma OPSEC, punto invariato se si annulla |
| `routingSearchTryParseCoords` | `null` su junk e indirizzo; lat/lon validi uguali al parser |
| `parseWaypointEditorCoordText` / editor poligoni / `trackAddFromText` | passano da `autoDetect`: il fallimento non scrive un punto (nessun waypoint/traccia creato in queste prove) |
| MGRS/UTM in `autoDetect` | restano prima del ramo lat/lon; `30nul…` e `33t 291952 4640699` ancora validi |

`routingSearchTryParseCoords` non interpreta MGRS/UTM (solo lat/lon). I builder GraphHopper/ORS non sono stati modificati.

## Prove

- Classificatore: **31/31** + segni **24/24**.
- Casi FIX5 (incluso UI Cerca): **18/18** e **6/6**.
- Parser condiviso: **14/14** (throw su junk/indirizzo/assi contraddittori/minuti negativi/MGRS invalido; stessi numeri attesi sui validi).
- Converti browser: **11/11**.
- Incolla: conferma solo sull’indirizzo; zero richieste Nominatim di ricerca. I reverse visti nel run Converti sono il reverse già esistente dopo una conversione **valida** (`/reverse` su 44.1 / 9.8), non sugli input rifiutati.

## Non fatto

No deploy · no promote · no finito · audit traghetti non duplicato · Oggetti GIS FROZEN.

## NEXT

Review DELICATO su `raw@b60584c` (blob Git `3b60b3a1`).
