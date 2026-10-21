# LAST_CURSOR_REPORT

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX3` |
| **GATE** | **REVIEW PACKAGE READY** (DELICATO) — nessun REVIEW PASS |
| **NEXT** | Review ChatGPT su FIX3 → deploy solo dopo gate |
| **Runtime LIVE** | tip `f215011` · build **256** |
| **Candidate FULL SHA** | `faed7b18988884f5c961bd1b16bdd2f474d8bc4e` |
| **Build / blob Git** | **260** · blob Git `dd8c8c708df9b11887a15fcae444beefcff0bc06` |
| **SHA-256 byte LF** | `4e12c50ab295511410cab48e46c5793d7845171e3b8aa2f88ff423a099416adc` |
| **SHA-256 byte CRLF** | `df07c2b2bb16009999b1bf38be369bd098568bc22409d18c96cc4cc67a55fa71` |
| **Deployed state** | invariato (LIVE 256) — **NO DEPLOY** |
| **Result Cursor** | FIX3 candidate; 259 FAIL registrata |
| **Working tree** | atteso pulito post-push |

### Identità SHA

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `faed7b18988884f5c961bd1b16bdd2f474d8bc4e` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `f7e7edb641e2767021d3d5d9a7a783da952c58b4` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `faed7b18988884f5c961bd1b16bdd2f474d8bc4e` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

## B. RIEPILOGO COMPLETO

1. FIX2 `fd8d1cc` / build 259 / blob `d82c51a8…`: **REVIEW GPT-SOSTITUTIVA FAIL** (S1–S3). Nessun PASS. FIX3 non esisteva su origin prima di questo pass.
2. S1: il meno dopo il prefisso resta il segno. Conversione con `parseFreeTextLatLon`.
3. S2: simboli DD/DDM/DMS con prefisso restano nella famiglia dichiarata; converte il parser canonico.
4. S3: N+S oppure E+W → errore locale, senza scegliere un emisfero.
5. Prove: 30/30 segni; 31/31 regressione FIX2; click/Invio Playwright senza Nominatim sui casi nuovi.
6. Commit runtime `faed7b1`. **NO DEPLOY · NO FINITO.**

```text
STATO FRESCO DA CURSOR
origin/main HEAD: (pre-report) f7e7edb… — post-push EXTERNAL_ONLY
working tree: atteso clean
ultimo blocco PASS: APP-BUILD-LABEL-UX-A (256 LIVE)
prossimo candidato: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX3 @ faed7b1
note operative: 257, 258 e 259 FAIL registrate; nessun deploy
```

## C. OUTPUT GIT (pre-container)

```text
git log --oneline -5
faed7b1 fix(search): keep signs, symbols and reject conflicting hemispheres (FIX3)
f7e7edb docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX2 REVIEW PACKAGE READY
fd8d1cc fix(search): complete coord intent, prefix consumption, stale hits (FIX2)
68b1621 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX1 REVIEW PACKAGE READY
7e41a14 fix(search): harden Cerca coord classification before geocoding (FIX1)

git rev-parse HEAD
faed7b18988884f5c961bd1b16bdd2f474d8bc4e

git rev-parse origin/main
f7e7edb641e2767021d3d5d9a7a783da952c58b4
```
