# LAST_CURSOR_REPORT

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX7` |
| **GATE** | **REVIEW PACKAGE READY** (DELICATO) — nessun REVIEW PASS |
| **NEXT** | Review ChatGPT su FIX7 → deploy solo dopo gate |
| **Runtime LIVE** | tip `f215011` · build **256** |
| **Candidate FULL SHA** | `080e71c161be76e3ff494b1cdee1aed6889f9290` |
| **Build / blob Git** | **264** · blob Git `dc1ec34ddb12c37e0502d074559e7a4aab279106` |
| **SHA-256 byte LF** | `d5496fb01873d3748fd1c173f7d4091351f41aec54b7fa37a23947ecd4bcca69` |
| **SHA-256 byte CRLF** | `64d85f215e9d0b619315c350ca44a25940ae123c446809f171c1df3610e29ff0` |
| **Deployed state** | invariato — **NO DEPLOY** |
| **Result Cursor** | FIX7 candidate; FIX6 FAIL (F1–F2) registrata |
| **Working tree** | atteso pulito post-push |

### Identità SHA

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `080e71c161be76e3ff494b1cdee1aed6889f9290` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `a6a813719a747b063c46f0ac0ad72375cf1c5eda` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `080e71c161be76e3ff494b1cdee1aed6889f9290` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

## B. RIEPILOGO COMPLETO

1. **Autosync:** sì. File aggiornati: FRONTIER, latest, inbox FIX7 e questo report. Il monolite è escluso dall'autosync docs e ha un commit runtime separato. L'audit traghetti non è stato duplicato.
2. **FIX6 FAIL registrata:** `b60584c` / build 263 / blob `3b60b3a1…` ha avuto **REVIEW GPT-SOSTITUTIVA FAIL** su F1–F2. I risultati FIX6 su token estranei, indirizzi e prefissi restano PASS.
3. **F1:** `parseFreeTextLatLon` applica `normalizeEuroDecimalLatLonSearch` dopo la rimozione dell'etichetta. `45,5; 9,2`, `45,5;9,2` e `45,5 9,2` danno 45.5 / 9.2 in Cerca, Converti, Incolla, routing ed editor. La regex accetta anche `+`.
4. **F2:** il segno esplicito dei gradi deve concordare con N/S/E/W. `-44.1N`, `+44.1S`, `N-44.1`, `S+44.1`, `44.1N -9.8E`, `44.1N +9.8W` e `DMS -0 … N` vengono rifiutati. Restano validi `-44.1S`, `+44.1N` e `-0 … S`.
5. **Minuti e secondi:** un `-` su minuti o secondi, compreso `-0`, ora viene rifiutato.
6. **Editor Poligoni (manutenzione):** i campi Lat/Lon separati leggono «45,5» come decimale prima dell'unione. Il vertice non viene più salvato a 45 / 5.15.
7. **Matrice di equivalenza:** 38 input su 7 ingressi helper, con attesi indipendenti. Baseline FIX6 **26/38**, FIX7 **38/38**.
8. **UI reale:**

   | Ingresso | FIX6 | FIX7 |
   | --- | --- | --- |
   | Cerca | 8/12 | 12/12 |
   | Converti | 6/12 | 12/12 |
   | Incolla | 6/12 | 12/12 |
   | Routing, campo punto | 6/12 | 12/12 |
   | Editor waypoint | 0/4 | 4/4 |
   | Editor Poligoni, vertice | 1/4 | 4/4 |

9. **Regressioni:** script del reviewer FIX6 confrontati riga per riga, tutti identici tranne `euro`, che ora è coerente con `autoDetect`.
   - 31 + 24 fixture storiche, 25 casi FIX5, FIX5 18 + 6, FIX6 14 + 11: tutti PASS.
   - Gate OPSEC strict, geocoding off e offline: 0 richieste Nominatim.
   - Stale: invariato.
   - Boundary 22 + 7: le stesse 3 + 1 esclusioni documentate da FIX4.
10. **Selftest e controlli statici:** `runSelfCheck` (`?debug`) passa senza assert falliti. Diff +63 / −9: nessun fetch, URL, storage, `innerHTML`, dialog o geolocalizzazione aggiunti. Builder GraphHopper/ORS invariati.
11. **Forme ambigue non cambiate** (stesso esito su 6 ingressi): `45,5` → 45 / 5, `45,5, 9,2` → 45 / 5°9'2", e `45,5N 9,2E` → DDM. Renderle decimali è una decisione semantica: va presa solo se l'operatore lo chiede.
12. **Commit runtime:** `080e71c`. **NO DEPLOY · NO FINITO.**
13. **Evidence:** `C:\Users\Utente\AppData\Local\Temp\goi-fix7-verify` (elenco nel file inbox).

```text
STATO FRESCO DA CURSOR
origin/main HEAD: (pre-report) a6a8137… — post-push EXTERNAL_ONLY
working tree: atteso clean
ultimo blocco PASS: APP-BUILD-LABEL-UX-A (256 LIVE)
prossimo candidato: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX7 @ 080e71c
note operative: FIX6 FAIL F1–F2; forme ambigue documentate; routing land-only resta audit STOP
```

## C. OUTPUT GIT (pre-container)

```text
git log --oneline -5
080e71c fix(search): euro decimals and sign/hemisphere coherence in the shared parser (FIX7)
a6a8137 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX6 REVIEW PACKAGE READY
b60584c fix(search): reject unknown tokens in the shared lat/lon parser (FIX6)
13d7e37 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX5 REVIEW PACKAGE READY
657422e fix(search): consume plus signs and bind values to axis markers (FIX5)

git rev-parse HEAD
080e71c161be76e3ff494b1cdee1aed6889f9290

git rev-parse origin/main
a6a813719a747b063c46f0ac0ad72375cf1c5eda

git branch --show-current
main

git ls-remote origin refs/heads/main
a6a813719a747b063c46f0ac0ad72375cf1c5eda	refs/heads/main
```
