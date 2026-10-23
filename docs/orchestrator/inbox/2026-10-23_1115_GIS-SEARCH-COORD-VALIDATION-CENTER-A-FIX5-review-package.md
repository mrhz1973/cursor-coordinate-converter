# GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX5 — REVIEW PACKAGE

**Categoria:** DELICATO  
**Gate:** REVIEW PACKAGE READY — nessun REVIEW PASS  
**CLOSURE:** NONE (no deploy · no promote · no finito)

## Review precedenti (FAIL, non riscritte)

| Candidate | Esito |
| --- | --- |
| `4c2fd18` · build 257 | REVIEW GPT-SOSTITUTIVA **FAIL** |
| `7e41a14` · build 258 | REVIEW GPT-SOSTITUTIVA **FAIL** |
| `fd8d1cc` · build **259** · blob `d82c51a8…` | REVIEW GPT-SOSTITUTIVA **FAIL** |
| `faed7b1` · build **260** · blob `dd8c8c70…` | REVIEW GPT-SOSTITUTIVA **FAIL** (V1–V3) |
| `e3da4e89c723246c4925f89c2ef0dbf58b746844` · build **261** · blob Git `b7d62b118cac4467bf8ee9d291b4835f98dbf042` | REVIEW GPT-SOSTITUTIVA **FAIL** (P1–P3) |

Evidence FIX4 (fuori repo): `C:\Users\Utente\AppData\Local\Temp\goi-fix4-verify`  
Evidence FIX5: `C:\Users\Utente\AppData\Local\Temp\goi-fix5-verify`

Routing land-only: audit STOP invariato, nessun candidate — [`2026-10-23_1100_ROUTING-LAND-ONLY-NO-FERRY-A-audit-stop.md`](2026-10-23_1100_ROUTING-LAND-ONLY-NO-FERRY-A-audit-stop.md).

## Identità FIX5

| Voce | Valore |
| --- | --- |
| Commit | `657422e9c191cae0b09593f4313ebe929bd2c858` |
| **Blob Git** | `4385686ac24dd18dde2128909aa3e934db224164` |
| SHA-256 byte LF | `90d155f7dbbaa2c508a018d12af1321bb1c6481a95816e717264d99a4ba62201` |
| SHA-256 byte CRLF | `3d58a5d6c2194feeaf5da729c394fd0101e27b37ab575e95448f13f9321d482d` |
| Build | **262** · `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX5` |
| LIVE | tip `f215011` · build **256** (invariato) |

## Finding

| ID | Correzione |
| --- | --- |
| P1 | `parseFreeTextLatLon` accetta `[+-]?\d`. `DMS +44 6 0 N 9 49 0 E` → lat **44.1** (non 6). `+9` nel blocco lon resta il primo componente. `-` e `-0` invariati. |
| P2 | Con entrambi gli assi, i numeri seguono l’indicatore che li introduce. `E9.8 N44.1` → lat **44.1**, lon **9.8**. `N44.1 E9.8` e `44.1N 9.8E` restano lat-prima. |
| P3 | `E9.8`, `N44 6 0`, `44.1 N S` → `coord_invalid` (anche in digitazione). Zero Nominatim / reverse. PUNTO, centro e testo invariati. |

## Parser condivisi (audit, nessuna seconda implementazione)

| Consumatore | Effetto |
| --- | --- |
| Cerca `classifyGeoSearchInput` → `trySearchLatLon` | usa `parseFreeTextLatLon` |
| Converti `autoDetect` / `parseFreeTextLatLon` / `#pasteInput` / `#free-text` | stesso parser: input valido → stessa lat/lon |
| `combineComponents` | invariato (segno da gradi, incluso −0) |
| Editor poligoni / batch (`autoDetect`) | ereditano P1/P2 |
| `routingSearchTryParseCoords` | eredita il parser; **nessuna** modifica a body GraphHopper/ORS |

Residuo pre-esistente, non in scope: `parseFreeTextLatLon` ignora ancora token alfabetici sconosciuti (es. Converti su un indirizzo può estrarre numeri). Cerca classifica quegli input come `place_text` e non applica quel risultato.

## Prove (build 262)

- Regressione classificatore: **31/31** + segni/simboli **24/24** = **55/55**.
- FIX5 classifier vs expected indipendenti (44+6/60, 9+49/60): **18/18**. `parseFreeTextLatLon` e `autoDetect` concordi sui validi.
- UI Cerca: digitazione + Invio su `DMS +44…`, `E9.8 N44.1`, `44.1N 9.8E`, `E9.8`, `N44 6 0`, `44.1 N S`. Validi: centro = punto, zero rete. Invalidi: punto/centro invariati, feedback locale, testo preservato, zero Nominatim, zero waypoint.
- Esclusioni esplorative invariate (non bloccanti): `DD - 44.1 9.8`, `32T NU -12589…`, `- 44.1 9.8`.

## Non fatto

No deploy · no promote · no finito · nessun blocco traghetti · Oggetti GIS FROZEN.

## NEXT

Review DELICATO su `raw@657422e` (blob Git `4385686a`).
