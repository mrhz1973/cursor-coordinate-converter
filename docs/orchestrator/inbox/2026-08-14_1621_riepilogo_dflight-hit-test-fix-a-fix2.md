# Riepilogo — D-FLIGHT-HIT-TEST-FIX-A-FIX2 (IMPLEMENTED — REVIEW REQUIRED)

**Data:** 2026-08-14  
**Blocco:** `D-FLIGHT-HIT-TEST-FIX-A-FIX2`  
**Categoria:** DELICATO  
**Fase:** IMPLEMENTATION ONLY — PRE-REVIEW (no deploy, no QA operatore, no `finito`)

## Baseline / candidate

- Baseline pre-implementazione: `d994e1d48b76682124009126b43ef5b33f406770`
- **Candidate runtime FULL SHA:** `7501d0f7f24957f17497357230baebe36b11f298`
- `APP_BUILD_ID` = `D-FLIGHT-HIT-TEST-FIX-A-FIX2`
- `APP_BUILD_NUM` = **186**
- Runtime **LIVE** (non aggiornato): `488b6c0559810f19bf75aa37d727902b57b9c2b2` · build **185** · FIX1

## Input operatore vincolante

`QA D-FLIGHT-HIT-TEST-FIX-A-FIX1 FAIL operatore` — dopo pan/zoom ~z8, INFO 502 cap: hit-layer invisibile resta, filtro 5/5 ON → hitOnly, manina assente. FUTURE OFF mostra vector colorato; FUTURE ON ripristina hitOnly.

## Cosa è stato fatto

1. Stato session-only `_dflightAtm09InfoUnavailable` (no localStorage/IndexedDB/schema).
2. `dflightAtm09MarkInfoUnavailable` — clear INFO + redraw `.dflight-zone-overlay` visibile/interattivo.
3. `dflightAtm09ApplyInfoSuccess` — exit fallback + hitlayer z2 + ATM09_INFO z3.
4. `hitOnly` = suppress ∧ non-restrittivo ∧ **NOT** unavailable.
5. Fetch failure (`!resp.ok` / FC invalida / catch) → mark; success 200 → apply. Token guards invariati.
6. Reset unavailable: preferred OFF; network gate OFF; sessione overlay nullata; success corrente. **Non** in `dflightAtm09ClearInfo`; **non** su reapply preferred ON.
7. Selftest HitA FIX2 sync + `selfTestAsync` (stale concurrency async reale + 502 async).
8. Build 186 / build-lock Tf/H/HitA.

## File nel candidate runtime

- `coordinate_converter Claude.html` soltanto

## Helper / dataset

- Helper **0.1.3** invariato; nessun bump cap; nessuna nuova rete.
- Dataset canonico invariato.

## Validazione pre-review

- `node --check` JS principale: PASS
- CDP locale sequenza reale: INFO 200 → fetch 502 → visible fallback → FUTURE OFF → FUTURE ON (paint resta) → fetch 200 recovery → single-dispatch: **PASS**
- `GOIDflight.selfTest()`: **276/276 PASS**
- `GOIDflight.selfTestAsync()`: **278/278 PASS**

## Gate

`D-FLIGHT-HIT-TEST-FIX-A-FIX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

**NEXT:** REVIEW PRE-DEPLOY sul FULL SHA FIX2 — **non** deployare.

## Note F3 / autosync

- Task commit = candidate runtime `7501d0f…`
- Questo file + `latest` + OM/WU/report = commit autosync separato
- Fatti del container autosync corrente: **EXTERNAL_ONLY** / omissione
