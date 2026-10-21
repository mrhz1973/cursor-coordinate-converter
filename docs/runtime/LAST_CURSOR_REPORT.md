# LAST_CURSOR_REPORT

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX2` |
| **GATE** | **REVIEW PACKAGE READY** (DELICATO) — nessun REVIEW PASS |
| **NEXT** | Review ChatGPT su FIX2 → deploy solo dopo gate |
| **Runtime LIVE** | tip `f215011` · build **256** |
| **Candidate FULL SHA** | `fd8d1cc53e88577fb8fe1c737c9db16864e996e3` |
| **Build / blob Git** | **259** · blob Git `d82c51a8de8ad490a83b8a788e64808428b6a7c3` |
| **SHA-256 WT CRLF** | `c66192e57d34bff57850b0bc27b472547860334dfa78ac306b48ace4aaa77876` |
| **SHA-256 LF-norm** | `3d5344296a6fe6526de58d847fa4df00beefad4f77b9a6f110b42fd2b8cfb102` |
| **Deployed state** | invariato (LIVE 256) — **NO DEPLOY** |
| **Result Cursor** | FIX2 candidate; 258 FAIL registrata |
| **Working tree** | atteso pulito post-push |

### Identità SHA

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `fd8d1cc53e88577fb8fe1c737c9db16864e996e3` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `68b1621caadea173d02f2fcbd6acd9e02b23b5a5` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `fd8d1cc53e88577fb8fe1c737c9db16864e996e3` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

## B. RIEPILOGO COMPLETO

1. FIX1 `7e41a14` / build 258 / blob `9ca0a526…`: **REVIEW GPT-SOSTITUTIVA FAIL** (F1–F4). Nessun PASS.
2. F1: intento lat/lon su coppie miste e emisferi attaccati; invalide e MGRS troppo lunghi non vanno in geocoding.
3. F2: prefisso consuma il separatore e rifiuta testo o componenti incompatibili (`DD` ≠ DDM).
4. F3: edit azzera hit e generazione; Invio non applica risultati di un’altra query.
5. F4: click Cerca resta disponibile per la conversione locale con OPSEC / geocoding off; i gate di rete restano in `runPlaceSearch`.
6. Prove: 31/31 classify; UI stale / OPSEC / invalid come in evidence.
7. Commit runtime `fd8d1cc`. **NO DEPLOY · NO FINITO.**

```text
STATO FRESCO DA CURSOR
origin/main HEAD: (pre-report) 68b1621… — post-push EXTERNAL_ONLY
working tree: atteso clean
ultimo blocco PASS: APP-BUILD-LABEL-UX-A (256 LIVE)
prossimo candidato: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX2 @ fd8d1cc
note operative: 257 e 258 FAIL registrate; nessun deploy
```

## C. OUTPUT GIT (pre-container)

```text
git log --oneline -5
fd8d1cc fix(search): complete coord intent, prefix consumption, stale hits (FIX2)
68b1621 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX1 REVIEW PACKAGE READY
7e41a14 fix(search): harden Cerca coord classification before geocoding (FIX1)
3674fd4 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A REVIEW PACKAGE READY
4c2fd18 feat(search): classify coordinates locally before Nominatim (build 257)

git rev-parse HEAD
fd8d1cc53e88577fb8fe1c737c9db16864e996e3

git rev-parse origin/main
68b1621caadea173d02f2fcbd6acd9e02b23b5a5
```
