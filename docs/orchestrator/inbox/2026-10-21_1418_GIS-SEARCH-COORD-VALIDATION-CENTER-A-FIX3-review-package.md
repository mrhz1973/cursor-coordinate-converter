# GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX3 — REVIEW PACKAGE

**Categoria:** DELICATO  
**Gate:** REVIEW PACKAGE READY — nessun REVIEW PASS  
**CLOSURE:** NONE (no deploy · no promote · no finito)

## Review precedenti (FAIL, non riscritte)

| Candidate | Esito |
| --- | --- |
| `4c2fd18` · build 257 · blob Git `37325c50…` | REVIEW GPT-SOSTITUTIVA **FAIL** |
| `7e41a14` · build 258 · blob Git `9ca0a526…` | REVIEW GPT-SOSTITUTIVA **FAIL** |
| `fd8d1cc` · build **259** · blob Git `d82c51a8de8ad490a83b8a788e64808428b6a7c3` | REVIEW GPT-SOSTITUTIVA **FAIL** (S1–S3) |

Evidence FIX2: `C:\Users\Utente\AppData\Local\Temp\goi-review-fd8d1cc-ofji_1xk` (fuori repo, invariata).

## Identità FIX3

| Voce | Valore |
| --- | --- |
| Commit | `faed7b18988884f5c961bd1b16bdd2f474d8bc4e` |
| **Blob Git** | `dd8c8c708df9b11887a15fcae444beefcff0bc06` |
| SHA-256 byte working tree (LF) | `4e12c50ab295511410cab48e46c5793d7845171e3b8aa2f88ff423a099416adc` |
| SHA-256 stessi byte con CRLF | `df07c2b2bb16009999b1bf38be369bd098568bc22409d18c96cc4cc67a55fa71` |
| Build | **260** · `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX3` |
| LIVE | tip `f215011` · build **256** (invariato) |

Il blob Git non è lo SHA-256 del file. I due SHA-256 descrivono i byte LF del working tree e la stessa sequenza con terminatori CRLF.

## Finding

| ID | Correzione |
| --- | --- |
| S1 | Dopo il prefisso, il meno attaccato a una cifra resta il segno (`DD -44.1, 9.8`, `DD:-44.1,9.8`, `DDM`/`DMS`/`LATLON`). Due punti, uguale e spazi restano separatori. La conversione è `parseFreeTextLatLon`. |
| S2 | `DD`/`DDM`/`DMS` con ° ′ ″ e prefisso restano della famiglia dichiarata. Il censimento conta i numeri; il parser canonico converte. Parole e conteggi incompatibili restano invalidi. |
| S3 | N insieme a S, oppure E insieme a W, è `coord_invalid`. Nessun emisfero viene scelto al posto dell’altro. |

## Prove locali (build 260)

- Fixture segni/simboli della review: 30/30, coordinate attese incluse.
- Regressione classificatore FIX2: 31/31.
- Playwright, click/Invio senza `force`, rete esterna intercettata: `DD -44.1, 9.8` e `DD:-44.1,9.8` centrano −44.1 / 9.8; `DMS 44°6'0" N 9°49'0" E` e `DD 44.1° N 9.8° E` centrano il punto canonico; `44 N S 9 E` e `DD 44foo 9bar` non spostano il punto e non chiamano Nominatim.

## Non fatto

No deploy · no promote · no finito · Oggetti GIS FROZEN · nessun parser parallelo.

## NEXT

Review DELICATO su `raw@faed7b1` (blob Git `dd8c8c70`).
