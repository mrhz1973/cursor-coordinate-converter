# Riepilogo — D-FLIGHT-HIT-TEST-FIX-A-FIX1 (IMPLEMENTED — REVIEW REQUIRED)

**Data:** 2026-08-14  
**Blocco:** `D-FLIGHT-HIT-TEST-FIX-A-FIX1`  
**Categoria:** DELICATO  
**Origine review:** FAIL / BLOCKING su `62de84ea61d52c4c10460c755c7bb20ef36bc1c7`

## Baseline / candidate

- Baseline docs pre-patch: `c67d9f9380bc7d99cc7e40d9cf9583c982622afa`
- Candidate corretto (superseded): `62de84ea61d52c4c10460c755c7bb20ef36bc1c7` / build 184 — **REVIEW FAIL**
- **FIX1 FULL SHA:** `488b6c0559810f19bf75aa37d727902b57b9c2b2`
- `APP_BUILD_ID` = `D-FLIGHT-HIT-TEST-FIX-A-FIX1`
- `APP_BUILD_NUM` = **185**
- LIVE invariato: `20b1b49` / build **183**

## Finding riprodotto

**SÌ.** Dopo `5/5 → FUTURE OFF → FUTURE ON` via `dflightRedrawOverlayFromSession`, ordine DOM diventava INFO poi HIT; `elementFromPoint` sull’overlap → `.dflight-volume-hit`; click → `dflightSelectZone` invece di ATM09 details.

## Soluzione

1. CSS + inline: `.dflight-atm09-info-overlay` **z-index:3** (hit-layer resta 2)
2. Helper `dflightAtm09EnsureInfoAboveHitLayer(tileMap)` — append INFO in coda + zIndex 3
3. Chiamato da `dflightDrawOverlayDom` e `dflightAtm09DrawInfoHitOverlay`
4. `dflightAtm09ClearStaleInfoKeepHit` estratto (testabile) per ramo `!resp.ok`

## Validazione

- Selftest: **266/266 PASS** (HitA 16)
- Harness: INFO 200 efp+single dispatch PASS; INFO fail → volume-hit PASS; fetch 502 async PASS

## Gate

`D-FLIGHT-HIT-TEST-FIX-A-FIX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

**NEXT:** REVIEW PRE-DEPLOY sul FULL SHA FIX1 — **non** deployare.
