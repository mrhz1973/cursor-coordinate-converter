# D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1 — REVIEW PACKAGE

**Status:** REVIEW PACKAGE READY — MAIN UNCHANGED — NO DEPLOY  
**Category:** DELICATO — sanitizer / safe rendering  
**Rejected candidate 236:** `d223b38f8f1dd6ab0e5aac312fb46b2a34bdcc03` (NON DEPLOY)

## Identifiers

| Key | Value |
|---|---|
| BASE (main) | `8a9bd27b8a738b046ffbfde91318ec2d8b030969` |
| CANDIDATE_FULL_SHA | `8a350f7a9654fe1de0b6757c31ae39fa6c07ac05` |
| CANDIDATE_BUILD | `237` |
| CANDIDATE_APP_BUILD_ID | `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1` |
| CANDIDATE_BLOB | `4d8c2b3a68c348b30c8683319c31df3cb01e138a` |
| Parent | `8a9bd27b8a738b046ffbfde91318ec2d8b030969` (direct) |
| Runtime commits above main | **1** (monolite only) |
| Review branch | `review/D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1-237` |

## Finding addressed (GPT-sostitutiva FAIL on 236)

236 pipeline: strip tags → decode entities.  
Entity-encoded markup such as `&lt;p&gt;Prima&lt;br&gt;Seconda&lt;/p&gt;` became literal `<p>…<br>…</p>` after decode and was shown as text.

## Pipeline raw → display (FIX1)

Display-only helpers (scoped D-Flight; **not** a global sanitizer):

1. `dflightDetailsMarkupPass(s)` — drop hostile containers; `br`/`p`/`li`/block closers → newlines; strip remaining tags; remove residual `<>`.
2. `dflightDetailsDecodeEntities(s)` — textarea entity decode **only** when no `<>` remain (fail-closed).
3. `dflightDetailsDisplayText(raw)` — up to **4** bounded passes of `(markupPass → decodeEntities)`; then residual `<>` strip + whitespace normalize.
4. `dflightDetailsEscDisplay(raw)` — `dflightEscHtml(plain)` then `\n` → `<br>` (structured sink only after escape).

**Why no raw HTML executes:** decoded content never goes to `innerHTML` unescaped; body uses escaped HTML string; title uses `textContent` + `dflightDetailsDisplayText`.

### Fields through normalizer

| Field | Sink |
|---|---|
| `zone.name` (meta + title) | `dflightDetailsEscDisplay` / `textContent` via `dflightDetailsDisplayText` |
| `zone.message` | `dflightDetailsEscDisplay` |
| `reasons` / `reasons_raw` join | `dflightDetailsEscDisplay` |
| authority names | `dflightDetailsEscDisplay` |
| `owner_raw` | `dflightDetailsEscDisplay` |
| `warnings` join | `dflightDetailsEscDisplay` |

Structured IDs/labels/volumes/restriction enum labels remain `dflightEscHtml` only.

### DOM sinks

- `#dflightDetailsPanelBody.innerHTML = dflightBuildDetailsHtml(zone)` — HTML **structure** only; descriptive values pre-escaped.
- `#dflightDetailsPanelTitle.textContent = …` — pure text.

### Raw preservation

Normalizer does not write back into zone/session objects. Local QA: `raw_preserved` PASS. No new persistence.

## Diff

- `git diff --numstat` BASE…CANDIDATE: `153 16 coordinate_converter Claude.html`
- `git diff --stat`: `169 ++++ / ----` (153 insertions, 16 deletions)
- `git diff --check`: PASS
- Full runtime diff (complete text, persisted): [`2026-08-21_0021_D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1-full-runtime-diff.md`](./2026-08-21_0021_D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1-full-runtime-diff.md)
- Bytes (candidate working file): `10924483`
- Lines: `100694`
- No ApplyPatch / formatter / EOL rewrite / full-file rewrite

## Local QA evidence

Artifact: `C:\tmp\dflight-details-fix1\local-qa.json` — **24/24 PASS**

Covered:

- plain / markup / entity / hostile literal DOM
- **encoded markup** `&lt;p&gt;Prima&lt;br&gt;Seconda&lt;/p&gt;` → `Prima\nSeconda` (no `<p`/`<br`/`&lt;` visible)
- **numeric hostile** `&#60;img…&#62;` / `&#60;script…&#62;` → text only; **0** img/script/iframe nodes; no `on*` attrs
- mixed literal + entity + encoded
- raw preservation; multiline; empty/null
- details open/close; title safe
- network delta rendering = 0; offline no fetch
- helpers present; CDE selftest ran

Lifecycle smoke (`lifecycle-smoke.json`): close path still has `dflightAtm09InvalidateVisual` + overlay off (build 235 close cleanup preserved); minimize helpers present.

Selftests added/updated: `DC_encoded_markup`, `DC_numeric_hostile`, `DC_mixed_encoded`, `DC_markup_pass_helper`; prior `DC_*` retained; build pins → 237 / FIX1 (3 sites).

## Security invariants

- After decode, value always passes `dflightEscHtml` before body structured HTML.
- Title: `textContent` only.
- Zero executable nodes / event attributes / network from rendering fixtures.
- Hostile fixtures verified on **DOM**, not only visible text.

## Out of scope / unchanged

- FRONTIER / LAST_CURSOR_REPORT / roadmap / WU / main
- ATM09 rendering, network/VPS helpers, overlays geometry, storage, other modals
- Origin push remains `DISABLED_PUSH`
- No deploy / no finito / no REVIEW PASS attestation

## Remote refs (at package time)

- `refs/heads/main` expected: `8a9bd27b8a738b046ffbfde91318ec2d8b030969`
- Review branch tip after docs commit: (set on push)

## Verdict line

D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1 REVIEW PACKAGE READY — MAIN UNCHANGED — NO DEPLOY

## Evidence repair (docs-only)

- Local `C:\tmp\...\full.diff` was **not** sufficient for REVIEW GPT-SOSTITUTIVA.
- Full runtime diff is now persisted in-repo: `docs/orchestrator/inbox/2026-08-21_0021_D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX1-full-runtime-diff.md`
- Includes complete `git diff` text plus `--numstat` / `--stat` / `--check`.
- Runtime candidate `8a350f7a9654fe1de0b6757c31ae39fa6c07ac05` / blob `4d8c2b3a68c348b30c8683319c31df3cb01e138a` **unchanged**.
- Main unchanged; origin push `DISABLED_PUSH`.
