# GIS Tool — Project Method Overlay

## Method source

- Method repository: `mrhz1973/dev-method`
- Method tag: `v0.1.1`

Pinned references:

| Document | Link |
|---|---|
| README | [dev-method/README.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/README.md) |
| LLMS | [dev-method/LLMS.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/LLMS.md) |
| Principles | [core/00-principles.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/00-principles.md) |
| Roles | [core/01-roles.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/01-roles.md) |
| Session protocol | [core/02-session-protocol.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/02-session-protocol.md) |
| Autonomy levels | [core/03-autonomy-levels.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/03-autonomy-levels.md) |
| Branch safety | [core/04-branch-safety.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/04-branch-safety.md) |
| Definition of Done | [core/05-definition-of-done.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/05-definition-of-done.md) |
| Gates and decision packets | [core/06-gates-and-decision-packets.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/06-gates-and-decision-packets.md) |
| Project import adapter | [adapters/project-import.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/adapters/project-import.md) |
| Single-file HTML adapter | [adapters/single-file-html.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/adapters/single-file-html.md) |
| GIS Tool example | [examples/gis-tool.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/examples/gis-tool.md) |
| Implementer prompt | [prompts/implementer-standard.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/prompts/implementer-standard.md) |
| Overlay template | [templates/project-method-overlay.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/templates/project-method-overlay.md) |

All links are pinned to `v0.1.1`. Never follow `main`.

### Why v0.1.1 for GIS Tool

GIS Tool is the first pilot and adopts `v0.1.1` because it codifies policies that emerged from this pilot:

- **Large single-file / token-efficiency policy** — operate on `coordinate_converter Claude.html` with marker searches, narrow ranges, targeted diffs, and small scoped patches; avoid full-file reads/rewrites.
- **Session/repo guard** — every implementer session must validate repo root, remote, and branch before acting, and refuse out-of-scope paths.
- **Idea intake during use** — capture incidental product/process ideas into orchestrator inbox without derailing the current task.
- **Context compaction / debug reconstruction** — keep `latest.md` short, push detail into dated inbox entries, and make state reconstructable from docs + git log.
- **Prompt/template integration** — implementer prompts and overlay template carry these policies by default.

---

## Local operating note — large-file / token-efficiency

When touching `coordinate_converter Claude.html` (the monolith), agents must follow the large-file/token-efficiency policy from `v0.1.1`:

- use **marker searches** (Grep) to locate the relevant function, id, or comment marker before reading;
- read **narrow ranges** (offset + limit), not the whole file;
- produce **targeted diffs** (`Edit` with minimal `old_string`/`new_string`), not rewrites;
- run **extracted syntax checks** on the changed blocks when feasible (`node --check` on isolated `<script>` extracts), not on the full document;
- keep patches **small and scoped** to one concern per commit;
- **no full-file read or rewrite** unless clearly justified and called out in the inbox report.

This rule applies in addition to the dev-method core; it is not a substitute for it.

---

## Project goal

GOI GIS Tool is a lightweight, offline-first GIS utility distributed as a single standalone HTML file. It covers coordinate conversion, waypoint management, track building, offline map areas, measurement tools, and field-oriented geospatial workflows.

Development is:

- roadmap-driven and milestone-based;
- single-file architecture by design (no bundler, no framework, no npm runtime);
- branch-safe with commits to `main` after each verified milestone;
- tested manually at milestones (no automated test suite);
- OPSEC-aware — network calls must remain explicit and user-initiated.

---

## Active autonomy level

**Current effective posture: Level 2.5 / Level 3-track**

- Recoverable work (scoped patches, docs, UI changes) should be batched and auto-proceeded by the implementer without per-step confirmation.
- Irreversible or high-risk actions (deploy, destructive deletion, credential handling, external API setup, production mutations) remain gated and require explicit human confirmation.
- The posture may be upgraded toward Level 3 as confidence in tooling and workflow grows.

See: [core/03-autonomy-levels.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/03-autonomy-levels.md)

---

## Active roles

| Role | Tool / System | Status |
|---|---|---|
| Source of truth | GitHub (`mrhz1973/cursor-coordinate-converter`) | Active |
| High-level orchestrator | ChatGPT web | Active |
| Implementers | Claude Code / Cursor CLI | Active |
| Classifier / router / risk scorer | Ollama | Future optional |
| Human gate channel | Telegram | Future optional |
| Control plane | n8n | Future optional |

See: [core/01-roles.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/01-roles.md)

---

## Active adapters

### project-import adapter

Applied. This file (`docs/METHOD.md`) is the project-specific method overlay produced by this adapter.

See: [adapters/project-import.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/adapters/project-import.md)

### single-file HTML adapter

Applied. The project deliverable is a single HTML file. This adapter governs:

- no premature split of the single-file architecture;
- patches scoped and verified inline;
- syntax check after each edit before commit.

See: [adapters/single-file-html.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/adapters/single-file-html.md)

### Apps Script adapter

Not active. Not applicable unless future work introduces Google Apps Script.

---

## Active patterns

| Pattern | Status |
|---|---|
| Roadmap-first execution | Active — work follows the declared roadmap and milestone plan |
| Branch safety | Active — `main` is stable; task branches used for risky or large-scope work |
| Batch recoverable work | Active — implementer batches and auto-proceeds recoverable steps |
| Milestone testing | Active — manual test at each milestone before commit/push |
| File-based task lifecycle | Optional — used when tracking multi-step passes in orchestrator docs |
| B+ minimal confined automation | Optional — available if clearly beneficial, not mandatory |

---

## Project-specific gates

The following actions require explicit human confirmation regardless of autonomy level:

- deploy or publication to any external service;
- destructive deletion (files, branches, stored data);
- irreversible migrations;
- credential or secret handling;
- external provider API setup or configuration;
- privacy-sensitive data transmission;
- production-impacting runtime mutations;
- force-push or history rewrite on `main`.

See: [core/06-gates-and-decision-packets.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/06-gates-and-decision-packets.md)

---

## Branch policy

- `main` = stable delivery branch. Every commit on `main` must be in a known-good state.
- Task branches: used for risky, exploratory, or large-scope work when isolation is appropriate.
- No long-lived unstable branches without a declared reason.
- No force-push to `main`.

See: [core/04-branch-safety.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/04-branch-safety.md)

---

## Definition of Done

A session or task is done when:

1. Requested work is completed and verified.
2. Applicable checks are run (syntax check, git diff review).
3. Changes are selectively staged and committed with a clear message.
4. Commit is pushed to `origin main`.
5. A visible version marker or checkpoint entry exists for milestone tests when applicable.
6. Workspace status is declared clean (`git status --short` = empty).

See: [core/05-definition-of-done.md](https://github.com/mrhz1973/dev-method/blob/v0.1.1/core/05-definition-of-done.md)

---

## What does not apply

The following method capabilities are **not required** for this project:

- Provider API usage (no mandatory external API integration).
- Automated control plane (n8n is optional and not active).
- Ollama routing or risk scoring (optional and not active).
- Telegram gate (optional and not active).
- Splitting the single-file HTML architecture prematurely.
- Any mandatory ES module or bundler migration.
- Automated test suite (manual milestone testing is the current practice).
