# Riepilogo — D-FLIGHT-HIT-TEST-FIX-A (IMPLEMENTED — REVIEW REQUIRED)

**Data:** 2026-08-14  
**Blocco:** `D-FLIGHT-HIT-TEST-FIX-A`  
**Categoria:** DELICATO  
**Fase:** IMPLEMENTATION ONLY — PRE-REVIEW (no deploy, no QA operatore, no `finito`)

## Baseline / candidate

- Baseline pre-implementazione: `649aaba1b52338431e6bb4a926841995e63a6000`
- **Candidate runtime FULL SHA:** `62de84ea61d52c4c10460c755c7bb20ef36bc1c7`
- `APP_BUILD_ID` = `D-FLIGHT-HIT-TEST-FIX-A`
- `APP_BUILD_NUM` = **184**
- Runtime **LIVE** (non aggiornato): `20b1b494238f8dd483b3eb739f42dbf1194ab727` · build **183**

## Cosa è stato fatto

1. **Hit-layer interaction-only** quando `dflightAtm09ShouldSuppressNfzColors()` + filtro non restrittivo: SVG `.dflight-zone-hitlayer` / `.dflight-volume-hit` da dataset canonico + stesso culling/temporal/`dflightGeomPolygonToSvgPathD`.
2. **SVG hit:** `pointer-events:fill` + `fill:rgba(0,0,0,0)` + `stroke:none` + `fill-rule:evenodd` (non `visiblePainted`+`fill:none`).
3. **Listener:** click/hover accettano `.dflight-volume-hit`; bind-once sul `.tile-map` corrente dopo ogni draw (anche hit-only).
4. **INFO lifecycle:** su `!resp.ok` / invalid / catch → `clearStaleInfoKeepHit` (null FC + remove INFO overlay); hit-layer vettoriale resta.
5. Selftest HitA + aggiornamento assert build 184 / FIX1 suppress.

## File nel candidate runtime

- `coordinate_converter Claude.html` soltanto

## Helper / dataset

- Helper **0.1.3** invariato (nessuna modifica helper; nessun bump `ATM09_INFO_FEATURE_CAP`).
- Dataset canonico `_dflightOverlaySession.dataset` non duplicato.

## Validazione pre-review

- `node --check` sul JS principale: PASS
- Selftest `dflightSelfTestAll`: **262/262 PASS** (HitA 12/12)
- Harness CDP locale A–E: PASS (B: `elementFromPoint` on-screen + click singolo; geometria off-screen La Spezia non usata come prova efp)

## Gate

`D-FLIGHT-HIT-TEST-FIX-A IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

**NEXT:** REVIEW PRE-DEPLOY — **non** deployare.

## Note F3 / autosync

- Task commit = candidate runtime `62de84e…`
- Questo file + `latest` + OM/WU/report = commit autosync separato
- Fatti del container autosync corrente: **EXTERNAL_ONLY** / omissione
