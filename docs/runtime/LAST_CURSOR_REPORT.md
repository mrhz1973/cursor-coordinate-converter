# LAST_CURSOR_REPORT

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX4` |
| **GATE** | **REVIEW PACKAGE READY** (DELICATO) — nessun REVIEW PASS |
| **NEXT** | Review ChatGPT su FIX4 → deploy solo dopo gate |
| **Runtime LIVE** | tip `f215011` · build **256** |
| **Candidate FULL SHA** | `e3da4e89c723246c4925f89c2ef0dbf58b746844` |
| **Build / blob Git** | **261** · blob Git `b7d62b118cac4467bf8ee9d291b4835f98dbf042` |
| **SHA-256 byte LF** | `9a9ff8bfd228dbf2e72359cf3614c95e037d39d8fcafbf54c9e3f3d9c53941b7` |
| **SHA-256 byte CRLF** | `584e85527f72ddbbae98f6f1cb0ed76a3c9b53bdfafe64fc67adfda95e8d4ac1` |
| **Deployed state** | invariato (LIVE 256) — **NO DEPLOY** |
| **Result Cursor** | FIX4 candidate; FIX3 FAIL registrata |
| **Working tree** | atteso pulito post-push |

### Identità SHA

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `e3da4e89c723246c4925f89c2ef0dbf58b746844` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `bb185f4de98d3bd566d584ddf84af4c2ae6dcba0` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `e3da4e89c723246c4925f89c2ef0dbf58b746844` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

## B. RIEPILOGO COMPLETO

1. Autosync orchestratore: sì — `docs/FRONTIER.md`, `docs/orchestrator/latest.md`, inbox FIX4 review package, `docs/runtime/LAST_CURSOR_REPORT.md`. Monolite **escluso** dall’autosync docs (già in commit runtime).
2. FIX3 `faed7b1` / build 260 / blob `dd8c8c70…`: **REVIEW GPT-SOSTITUTIVA FAIL** (V1–V3). Storico 257–259 FAIL preservato. FIX4 non esisteva su origin prima di questo pass.
3. V1: census junk sul path bare (con/senza prefisso).
4. V2: `looksLikeIncompleteLatLonSearch` → errore locale, zero Nominatim.
5. V3: `combineComponents` (−0, min/sec negativi); assi duplicati in census + parser.
6. Prove: 55/55 regressione; boundary V1–V3 PASS; UI click/Invio; typing OPSEC/offline.
7. Commit runtime `e3da4e8`. **NO DEPLOY · NO FINITO.**

```text
STATO FRESCO DA CURSOR
origin/main HEAD: (pre-report) bb185f4… — post-push EXTERNAL_ONLY
working tree: atteso clean
ultimo blocco PASS: APP-BUILD-LABEL-UX-A (256 LIVE)
prossimo candidato: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX4 @ e3da4e8
note operative: 257–260 FAIL registrate; nessun deploy
```

## C. OUTPUT GIT (pre-container)

```text
git log --oneline -5
e3da4e8 fix(search): whole-input validation, incomplete lat, signed DMS components (FIX4)
bb185f4 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX3 REVIEW PACKAGE READY
faed7b1 fix(search): keep signs, symbols and reject conflicting hemispheres (FIX3)
f7e7edb docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX2 REVIEW PACKAGE READY
fd8d1cc fix(search): complete coord intent, prefix consumption, stale hits (FIX2)

git rev-parse HEAD
e3da4e89c723246c4925f89c2ef0dbf58b746844

git rev-parse origin/main
bb185f4de98d3bd566d584ddf84af4c2ae6dcba0
```
