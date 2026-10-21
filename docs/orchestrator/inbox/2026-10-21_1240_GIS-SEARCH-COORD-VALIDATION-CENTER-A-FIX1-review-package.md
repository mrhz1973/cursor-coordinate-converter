# GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX1 — REVIEW PACKAGE

**Categoria:** DELICATO  
**Gate:** REVIEW PACKAGE READY — **nessun** REVIEW PASS  
**CLOSURE:** NONE (no deploy · no promote · no finito)

## Review precedente (FAIL registrata)

| Voce | Valore |
| --- | --- |
| Esito | **REVIEW GPT-SOSTITUTIVA FAIL** (non PASS) |
| Candidate fallito | `4c2fd18ac3f9a568df8092825245bcc8f79d978f` · build **257** |
| Evidence esterna | `C:\Users\Utente\AppData\Local\Temp\goi-review-4c2fd18-orxvfq5x` |

### Rettifica identità file (R5) — candidate 257

L’evidence storica pubblicata per 257 **non viene riscritta**. Rettifica qui:

| Nome | Valore corretto |
| --- | --- |
| Commit | `4c2fd18ac3f9a568df8092825245bcc8f79d978f` |
| **Blob Git** | `37325c506b34acb0a5985dfb9f7823a3577d1776` (oggetto git del path monolite) |
| Valore già etichettato “blob” in report 257 | `643462c97d1d5079…` = **SHA-256 del working tree CRLF**, non il blob Git |
| Normalizzazione | Windows working copy CRLF; git object tipicamente LF (`core.autocrlf`) |

## Identità candidate FIX1 (258)

| Voce | Valore |
| --- | --- |
| Commit candidate | `7e41a1435394d1cc0d0cdb1b3c2f45d464e11635` |
| **Blob Git** | `9ca0a52676334278c464a6e7d4fbf17385dcb0ab` |
| SHA-256 working tree (CRLF) | `5f502ad0037f85cf54f045fde2f697ba3fe3429fa437b7c883c4f056bac500b3` |
| SHA-256 normalizzato LF | `7dd417474c82d99129849a54d6a093981976e04270dbf10a8c321b33cfea695e` |
| Build | **258** · `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX1` |
| LIVE preservato | tip `f215011` · build **256** |
| BASE runtime fallito | `4c2fd18` · build **257** |

## Finding corretti

| ID | Fix |
| --- | --- |
| R1 | Shape/intent MGRS/UTM allargata (incompleti, banda invalida, digit dispari) → `coord_invalid`, mai `place_text` / Nominatim |
| R2 | Rimossa fallback `autoDetect`; gate `searchInputHasPlaceLexemes` → indirizzi restano `place_text` |
| R3 | Apostrofi/virgolette = DMS solo se adiacenti a cifre; toponimi `L'Aquila` ecc. → `place_text` |
| R4 | Prefisso esplicito `DD`/`UTM`/`MGRS` forza famiglia; `DD 95 10` → invalid non BNG; `45,5; 9,2` / `45,5 9,2` → decimali EU → 45.5/9.2 |
| R5 | Identità commit / blob Git / SHA-256 / LF\|CRLF distinte in questo package |

## Prove

### Classificazione — 25/25 fixture review

Tutte le fixture di `classifier-results.json` (4c2fd18) ripassate su build 258 con esiti attesi (invalid/place/valid+known). **PASS.**

### UI locale (fill/click + fetch Nominatim intercettato)

| Caso | Esito |
| --- | --- |
| valid DD → center | PASS |
| original invalid MGRS → punto invariato, feedback IT, no Nominatim | PASS |
| Via 20 Settembre 12 → non LatLon 20/12 | PASS (place path) |
| L'Aquila → non `coord_invalid` | PASS (place path) |
| UTM 33T 291952 → invalid, no Nominatim | PASS |
| 32I NU … → invalid, no Nominatim | PASS |
| DD 95 10 → invalid, non BNG | PASS |
| 45,5; 9,2 → 45.5 / 9.2 locale | PASS |

## Non fatto

No deploy · no promote · no finito · Oggetti GIS FROZEN · nessun nuovo parser/formato.

## NEXT

Nuova review DELICATO su `raw@7e41a14…` (blob Git `9ca0a526…`).
