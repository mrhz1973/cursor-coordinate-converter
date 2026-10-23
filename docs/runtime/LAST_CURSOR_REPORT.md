# LAST_CURSOR_REPORT

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX5` |
| **GATE** | **REVIEW PACKAGE READY** (DELICATO) — nessun REVIEW PASS |
| **NEXT** | Review ChatGPT su FIX5 → deploy solo dopo gate |
| **Runtime LIVE** | tip `f215011` · build **256** |
| **Candidate FULL SHA** | `657422e9c191cae0b09593f4313ebe929bd2c858` |
| **Build / blob Git** | **262** · blob Git `4385686ac24dd18dde2128909aa3e934db224164` |
| **SHA-256 byte LF** | `90d155f7dbbaa2c508a018d12af1321bb1c6481a95816e717264d99a4ba62201` |
| **SHA-256 byte CRLF** | `3d58a5d6c2194feeaf5da729c394fd0101e27b37ab575e95448f13f9321d482d` |
| **Deployed state** | invariato (LIVE 256) — **NO DEPLOY** |
| **Result Cursor** | FIX5 candidate; FIX4 FAIL registrata |
| **Working tree** | atteso pulito post-push |

### Identità SHA

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `657422e9c191cae0b09593f4313ebe929bd2c858` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `5c82589f9e652d8969c637d845fc54e5167d1ee9` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `657422e9c191cae0b09593f4313ebe929bd2c858` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

## B. RIEPILOGO COMPLETO

1. Autosync: sì — FRONTIER, latest, inbox FIX5, questo report. Monolite escluso dall’autosync docs. Audit traghetti non duplicato.
2. FIX4 `e3da4e8` / build 261 / blob `b7d62b11…`: **REVIEW GPT-SOSTITUTIVA FAIL** (P1–P3). Storico 257–260 preservato.
3. P1: il `+` è un componente (`parseFreeTextLatLon` + census). `DMS +44 6 0 N …` → lat 44.1.
4. P2: con N/S ed E/W entrambi presenti, i numeri restano sull’asse che li introduce. `E9.8 N44.1` → 44.1 / 9.8.
5. P3: `E9.8`, `N44 6 0`, `44.1 N S` → errore locale, zero rete, punto invariato.
6. Converti / `autoDetect` / `routingSearchTryParseCoords` usano lo stesso parser. Nessun body GH/ORS toccato.
7. Prove: 55/55 + 18/18 + UI 6/6 (digitazione e Invio).
8. Commit runtime `657422e`. **NO DEPLOY · NO FINITO.**

```text
STATO FRESCO DA CURSOR
origin/main HEAD: (pre-report) 5c82589… — post-push EXTERNAL_ONLY
working tree: atteso clean
ultimo blocco PASS: APP-BUILD-LABEL-UX-A (256 LIVE)
prossimo candidato: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX5 @ 657422e
note operative: 257–261 FAIL registrate; routing land-only resta audit STOP
```

## C. OUTPUT GIT (pre-container)

```text
git log --oneline -5
657422e fix(search): consume plus signs and bind values to axis markers (FIX5)
5c82589 docs: ROUTING-LAND-ONLY-NO-FERRY-A audit STOP (isolamento Search)
407a089 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX4 REVIEW PACKAGE READY
e3da4e8 fix(search): whole-input validation, incomplete lat, signed DMS components (FIX4)
bb185f4 docs: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX3 REVIEW PACKAGE READY

git rev-parse HEAD
657422e9c191cae0b09593f4313ebe929bd2c858

git rev-parse origin/main
5c82589f9e652d8969c637d845fc54e5167d1ee9
```
