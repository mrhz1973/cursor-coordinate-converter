# D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2 — REVIEW PACKAGE

**Status:** REVIEW PACKAGE READY — MAIN UNCHANGED — NO DEPLOY  
**Category:** DELICATO — sanitizer / safe rendering

## Identifiers

| Key | Value |
|---|---|
| BASE (main) | `d67d37f75e89a1f522f778424d4c7175dd316bdb` |
| CANDIDATE_FULL_SHA | `d899cff2c7ac24f1b9bba3eb99d10e08d2442b25` |
| Parent | `d67d37f75e89a1f522f778424d4c7175dd316bdb` |
| CANDIDATE_BUILD | `238` |
| CANDIDATE_APP_BUILD_ID | `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2` |
| CANDIDATE_BLOB | `c36109d1ebda7470748a3284089bf11b262d01cf` |
| LIVE prior | build **237** / `8a350f7…` / blob `4d8c2b3…` |
| Review branch | `review/D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2-238` |
| origin push | `DISABLED_PUSH` |

## Why build 237 did not fix this

237 patched `dflightBuildDetailsHtml` / `dflightOpenDetailsPanel` (D-Flight zone details).  
Operator repro ATM09 uses **`dflightAtm09OpenDetails`**, which filled `#dflightDetailsPanelBody` via `dd.textContent = String(v)`.  
That path is secure (no HTML execution) but shows **literal markup** for `p.rule` / `p.regola`.

## Renderer / sink

| Item | Value |
|---|---|
| Function | `dflightAtm09OpenDetails` |
| DOM sink | `#dflightDetailsPanelTitle.textContent` + `#dflightDetailsPanelBody` via created `<dt>/<dd>` + **`dd.textContent`** |
| Fields | ID, Nome, Tipo, Sottotipo, Quota max, Limite inf/sup, **Rule=`p.rule`**, **Regola=`p.regola`**, Designator, Valid from/to, Priority, Note |
| Pipeline | raw → `dflightDetailsDisplayText` (markupPass incl. `<a href>` text+URL → decode bounded) → `textContent` |
| Raw mutation | **none** |

Full runtime diff (complete text): [`2026-08-21_0055_D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2-full-runtime-diff.md`](./2026-08-21_0055_D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2-full-runtime-diff.md)

## git show --stat

```text
commit d899cff2c7ac24f1b9bba3eb99d10e08d2442b25
Author:     Martino Tuso <53308962+mrhz1973@users.noreply.github.com>
AuthorDate: Fri Aug 21 00:59:33 2026 +0200
Commit:     Martino Tuso <53308962+mrhz1973@users.noreply.github.com>
CommitDate: Fri Aug 21 00:59:33 2026 +0200

    fix(dflight): normalize ATM09 details Rule/Regola display text, build 238
    
    Reuse display-only helpers so ATM09 info panel no longer shows literal HTML in rule/regola fields, without mutating raw feature properties.
    
    Co-authored-by: Cursor <cursoragent@cursor.com>

 coordinate_converter Claude.html | 80 ++++++++++++++++++++++++++++++++++------
 1 file changed, 69 insertions(+), 11 deletions(-)
```

## Diff summaries

### --numstat
```text
69	11	coordinate_converter Claude.html
```

### --stat
```text
coordinate_converter Claude.html | 80 ++++++++++++++++++++++++++++++++++------
 1 file changed, 69 insertions(+), 11 deletions(-)
```

### --check
```text
(empty — PASS)
```

## Local QA

Artifact: `C:\tmp\dflight-details-fix2\local-qa.json` — **20/20 PASS**  
Covered: BASE markup-visible raw · candidate clean Rule/Regola · entities · encoded FIX1 · hostile DOM · raw preserve · title · generic 237 wiring · close invalidate · networkΔ0 · offline · DC_* incl. `DC_ATM09_*`.

## Security

- Sink is `textContent` after display normalize (no raw innerHTML of rule/regola).
- Hostile img/script/iframe encoded → zero executable nodes / on*.
- Rendering fetch not invoked.

## Regression

- D-Flight generic 237 helpers retained + anchor href text preserve in `dflightDetailsMarkupPass`.
- Close lifecycle still references `dflightAtm09InvalidateVisual`.
- No network/provider/storage changes.

## Verdict

D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2 REVIEW PACKAGE READY — MAIN UNCHANGED — NO DEPLOY
