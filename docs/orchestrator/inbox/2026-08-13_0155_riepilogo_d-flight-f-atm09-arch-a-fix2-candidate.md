# D-FLIGHT-F-ATM09-ARCH-A-FIX2 — candidate pre-deploy

## Contesto

FIX1 `a5da8d4` = REVIEW GPT-SOSTITUTIVA FAIL / NO-GO DEPLOY.  
Problema: primo tile `load` impostava `_dflightAtm09Ready=true`; error successivi non demotevano se okCount>0 → NFZ soppressa su copertura ATM09 parziale.

## Task commit

- **FULL SHA:** `887d321944b941af06ff6091b0fb2bc19df4c065`
- **Subject:** `feat: D-FLIGHT-F-ATM09-ARCH-A-FIX2 — generation-complete readiness + settle-once`
- **Build:** `D-FLIGHT-F-ATM09-ARCH-A-FIX2` / **170**
- Baseline HEAD pre-task: `2fdc6e977fb6a5da2e38f213f84408eb11448dce`

## File modificati

- `coordinate_converter Claude.html` (+246 / −75)
- Helper: **non modificato**

## Readiness generation-complete

```text
ready = expected > 0
     && loaded === expected
     && errors === 0
     && preferred && overlay && network && helper
```

- `_dflightAtm09Expected` fissato con `SetExpected(gen, n)` **prima** del bind
- Qualunque error della gen corrente ⇒ ready false
- expected=0 ⇒ ready false
- Nuova gen: reset expected/ok/err/ready

## Settle-once (per img)

`dflightAtm09SettleTile(img, gen, outcome)` — terminale DOM/session-only (`img._atm09Settled`):

- primo LOAD/ERROR conta una sola volta
- listener load/error e fallback `img.complete` passano dalla stessa settle
- eventi successivi sullo stesso img ignorati
- gen stale ignorata

## MultiPolygon — Esito B

Helper ATM09_INFO passa geometry dict senza filtro Polygon-only → MultiPolygon raggiungibile.  
`dflightAtm09GeomToSvgPathD` prima delegava MultiPolygon a helper Polygon-only (path vuoto).  
Fix minimo: flatten MultiPolygon → path concatenati via Polygon parts. Helper invariato.

## Test

- `node --check` JS eseguibili: PASS
- `git diff --check`: PASS
- Browser `GOIDflight.selfTest`: **140/140 PASS** (FIX2_1…11 + multipolygon)
- Boot: preferred/ready false, expected 0, 0 img ATM09, 0 resource atm09/d-flight.it
- Helper suite: non rieseguita (helper invariato)

## Non fatto

- Deploy GIS / helper prod
- Automated Browser QA live
- QA operatore / `finito`

## Gate

```text
D-FLIGHT-F-ATM09-ARCH-A-FIX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED
```
