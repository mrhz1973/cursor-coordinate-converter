# GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX2 — REVIEW PACKAGE

**Categoria:** DELICATO  
**Gate:** REVIEW PACKAGE READY — nessun REVIEW PASS  
**CLOSURE:** NONE (no deploy · no promote · no finito)

## Review precedenti (FAIL, non riscritte)

| Candidate | Esito |
| --- | --- |
| `4c2fd18` · build 257 · blob Git `37325c50…` | REVIEW GPT-SOSTITUTIVA **FAIL** |
| `7e41a14` · build **258** · blob Git `9ca0a52676334278c464a6e7d4fbf17385dcb0ab` | REVIEW GPT-SOSTITUTIVA **FAIL** (F1–F4) |

Evidence FIX1: `C:\Users\Utente\AppData\Local\Temp\goi-review-7e41a14-4tfhh1ve` (fuori repo, invariata).

## Identità FIX2

| Voce | Valore |
| --- | --- |
| Commit | `fd8d1cc53e88577fb8fe1c737c9db16864e996e3` |
| **Blob Git** | `d82c51a8de8ad490a83b8a788e64808428b6a7c3` |
| SHA-256 working tree CRLF | `c66192e57d34bff57850b0bc27b472547860334dfa78ac306b48ace4aaa77876` |
| SHA-256 normalizzato LF | `3d5344296a6fe6526de58d847fa4df00beefad4f77b9a6f110b42fd2b8cfb102` |
| Build | **259** · `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX2` |
| LIVE | tip `f215011` · build **256** (invariato) |

## Finding

| ID | Correzione |
| --- | --- |
| F1 | Intento lat/lon = solo numeri + emisferi (2/4/6 componenti), anche decimali misti e lettere N/E attaccate. Coppia fuori range e MGRS con troppe cifre restano `coord_invalid`, non `place_text`. Nessun fallback `autoDetect`. |
| F2 | Prefisso esplicito consuma `:`/`=`/spazio (`DD:44.1,9.8`). Il resto deve essere tutto della famiglia dichiarata: parole extra o conteggio componenti diverso (DD con 4 numeri) → invalido, senza scartare token né reinterpretare come DDM. |
| F3 | Ogni modifica dell’input azzera subito la lista e la generazione. Invio applica un risultato solo se appartiene alla query corrente; altrimenti cerca l’input corrente. Il debounce pendente viene cancellato sull’azione esplicita. |
| F4 | `pointer-events:none` non copre più tutto `.geo-body`. Filtri/avviso rete restano non cliccabili; riga Cerca resta cliccabile. `runPlaceSearch` continua a rifiutare OPSEC / geocoding disabilitato. |

## Prove locali (build 259)

- 31 fixture di classificazione della review estesa: **31/31 PASS** (inclusi `44.1, 9`, `44.1N 9.8E`, `N44.1 E9.8`, `95.0 10`, `95 10`, `32T NU 1258912 1532345`, `DD:44.1,9.8`, `DD 44foo 9bar`, `DD Via 20 Settembre 12`, `DD 44 30 9 12`).
- Sequenza Roma → Milano + Invio: il punto **non** diventa Roma; la lista successiva è Milano. Invio con risultati della query corrente seleziona quel risultato.
- OPSEC strict e geocoding disabilitato: `pointer-events` del pulsante Cerca = `auto`; `44.1, 9.8` e `44 9` applicati in locale; Nominatim 0.
- `95.0 10`: punto invariato, feedback di invalidità, Nominatim 0.

## Non fatto

No deploy · no promote · no finito · Oggetti GIS FROZEN · nessun parser parallelo.

## NEXT

Review DELICATO su `raw@fd8d1cc` (blob Git `d82c51a8`).
