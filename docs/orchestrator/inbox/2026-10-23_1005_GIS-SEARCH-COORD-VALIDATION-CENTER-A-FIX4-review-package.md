# GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX4 — REVIEW PACKAGE

**Categoria:** DELICATO  
**Gate:** REVIEW PACKAGE READY — nessun REVIEW PASS  
**CLOSURE:** NONE (no deploy · no promote · no finito)

## Review precedenti (FAIL, non riscritte)

| Candidate | Esito |
| --- | --- |
| `4c2fd18` · build 257 · blob Git `37325c50…` | REVIEW GPT-SOSTITUTIVA **FAIL** |
| `7e41a14` · build 258 · blob Git `9ca0a526…` | REVIEW GPT-SOSTITUTIVA **FAIL** |
| `fd8d1cc` · build **259** · blob Git `d82c51a8de8ad490a83b8a788e64808428b6a7c3` | REVIEW GPT-SOSTITUTIVA **FAIL** (S1–S3) |
| `faed7b18988884f5c961bd1b16bdd2f474d8bc4e` · build **260** · blob Git `dd8c8c708df9b11887a15fcae444beefcff0bc06` | REVIEW GPT-SOSTITUTIVA **FAIL** (V1–V3) |

Evidence FIX3 FAIL (fuori repo, invariata): `C:\Users\Utente\AppData\Local\Temp\goi-review-faed7b1-opkea1ky`  
Evidence FIX4 verify: `C:\Users\Utente\AppData\Local\Temp\goi-fix4-verify`

## Identità FIX4

| Voce | Valore |
| --- | --- |
| Commit | `e3da4e89c723246c4925f89c2ef0dbf58b746844` |
| **Blob Git** | `b7d62b118cac4467bf8ee9d291b4835f98dbf042` |
| SHA-256 byte working tree (LF) | `9a9ff8bfd228dbf2e72359cf3614c95e037d39d8fcafbf54c9e3f3d9c53941b7` |
| SHA-256 stessi byte con CRLF | `584e85527f72ddbbae98f6f1cb0ed76a3c9b53bdfafe64fc67adfda95e8d4ac1` |
| Build | **261** · `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX4` |
| LIVE | tip `f215011` · build **256** (invariato) |

Il blob Git non è lo SHA-256 del file. I due SHA-256 descrivono i byte LF del working tree e la stessa sequenza con terminatori CRLF.

## Finding

| ID | Correzione |
| --- | --- |
| V1 | Validazione dell’intero input anche senza prefisso: `latLonCensus.junk` rifiuta `foo1` / `6foo` / suffissi estranei; non basta il successo di `parseFreeTextLatLon` che ignorava token sconosciuti. |
| V2 | Latitudine sola (`44.1N`, `N44.1`, `44.1 N`) → `coord_invalid` via `looksLikeIncompleteLatLonSearch`; zero Nominatim in digitazione/Cerca/Invio; marker/PUNTO/centro invariati; testo preservato. |
| V3-A/B | Minuti o secondi negativi (`DMS 44 -6 0…`, `DMS 44 6 -1…`) → invalidi in `combineComponents` (controllo sul componente originale, non sull’`abs`). |
| V3-C | Assi duplicati (`DD 44 N 9 N`) → `conflict` in `latLonCensus` + rifiuto emisfero duplicato in `parseFreeTextLatLon`. |
| V3-D | `DMS -0 0 1 9 0 0` → lat `-1/3600`; segno IEEE −0 preservato; strip prefisso allineato a FIX3 (meno attaccato a cifra = segno). |

## Prove locali (build 261)

- Regressione classificatore FIX2/extended: **31/31**.
- Segni/simboli FIX3: **24/24** → totale regressione obbligatoria **55/55**.
- Boundary V1–V3 (classificatore): PASS su junk bare/DMS, lat-only ×3, minuti/secondi negativi, assi duplicati, −0.
- Playwright UI boundary (click/Invio, rete esterna intercettata): V1/V2/V3 PASS; centro/feedback/zero Nominatim; nessun waypoint automatico.
- Digitazione `44.1N` + Invio: zero `/search`; input preservato; OPSEC strict / geocode off → zero rete; offline + DD valido → centro locale.
- Esclusioni esplorative non bloccanti (invariate da review FIX3): `DD - 44.1 9.8`, `32T NU -12589 15323`, `- 44.1 9.8`.

## Non fatto

No deploy · no promote · no finito · Oggetti GIS FROZEN · nessun parser parallelo.

## NEXT

Review DELICATO su `raw@e3da4e8` (blob Git `b7d62b11`).
