# Cursor Workflow — How to Use `docs/roadmap.md`

**Companion document to**: `docs/roadmap.md` rev. 2
**Purpose**: operational guidance for leveraging the strategic roadmap in daily Cursor work without wasting tokens or introducing noise.
**Audience**: you (the user), for reference; also readable by AI assistants if attached.

---

## 1. When to @-mention `@docs/roadmap.md`

### 1.1 Always mention

| Trigger | Why |
|---|---|
| Planning a work package ≥ 4 hours effort | §9.3 explicit trigger |
| Feature addition not yet in roadmap | Scope check needed against §§2, 3, 5, 8 |
| Architectural decision (any file split, state restructure, new library) | §§3, 4 are authoritative |
| Scope ambiguity ("should I build X into this tool or leave it to QGIS?") | §§2.2, 8 resolve it |
| Onboarding a new AI session on a non-trivial task | Forces Notice reading |
| Distribution model question ("can I add this CDN thing just for dev?") | §3 only source of truth |
| Cross-document synthesis ("write a spec for T1.2 CoT export") | Roadmap + domain knowledge together |

### 1.2 Sometimes mention

| Trigger | When yes | When no |
|---|---|---|
| Bug fix request | If the bug reveals an architectural tension | Pure logic bug → don't attach |
| Refactor proposal | If refactor > 50 lines or restructures `state` | Inline renaming / helper extraction → don't attach |
| New UI component | If it introduces new interaction patterns | Adding a button to an existing panel → don't attach |
| Performance optimization | If optimization requires new APIs (Workers, OffscreenCanvas) | Algorithm-level optimization → don't attach |

### 1.3 Never mention

| Anti-trigger | Why |
|---|---|
| i18n string addition | Not strategic; goes through existing pattern |
| Typo fix | Obvious |
| Single-function bug fix with known cause | `session.md` or source is sufficient |
| CSS tweak | Visual only, no architectural impact |
| Adding a test to `runSelfCheck()` | Implementation detail |
| Renaming a local variable | Zero scope impact |
| Adding a comment | Self-evident |

**Rule of thumb**: if the answer would be the same regardless of roadmap content, don't attach the roadmap. You're paying tokens for nothing.

---

## 2. Mode-specific invocation

### 2.1 Plan mode

**Attach roadmap**: yes, by default, for any non-trivial plan.

**Rationale**: Plan mode generates a written plan that constrains the subsequent Agent execution. A plan that ignores roadmap constraints produces a defective execution downstream. Roadmap attachment here is the cheapest intervention point.

**Prompt pattern**:
```
@docs/roadmap.md @docs/session-geolocalizzazione-e-mappa.md 

Plan the implementation of [feature/change]. Verify against §3 (Distribution 
Strategy), §4 (Architectural Principles), and §8 (Out of Scope) before 
proposing anything.

[specific request]
```

### 2.2 Agent mode

**Attach roadmap**: only if Plan mode was skipped or if the agent is operating across a boundary (new file, new feature area).

**Rationale**: if a plan was approved in Plan mode, Agent should execute the plan. Re-reading the roadmap inside Agent is redundant and costly. Exception: when Agent encounters a decision point not covered by the plan, it should consult roadmap rather than improvise.

**Prompt pattern** (when attaching):
```
@docs/roadmap.md

Execute the approved plan [from Plan mode / described below]. If you 
encounter a decision not covered by the plan, consult roadmap §3 and §4 
before proceeding. Do not propose alternatives to the plan — request 
clarification instead.
```

### 2.3 Chat mode (standard inline Cursor chat)

**Attach roadmap**: situationally, per §1.1 and §1.2 above.

**Rationale**: chat mode is the widest-use mode, lowest per-prompt cost. Selective attachment avoids noise.

**Prompt pattern** (when attaching):
```
@docs/roadmap.md

[question or request]

Hard constraints apply per §3, §4, §8. Respond within those.
```

### 2.4 Inline edit (Cmd+K / Ctrl+K)

**Attach roadmap**: never.

**Rationale**: inline edits are surgical (5-20 lines typically). Roadmap attachment would triple the token cost for zero gain. If you're thinking about roadmap during an inline edit, you're likely in the wrong mode — switch to Plan or Chat.

---

## 3. Prompt templates that force Notice reading

### 3.1 Verbose template (use for first session of a work package)

```
@docs/roadmap.md

Before responding, execute the reading order defined in the Notice to AI 
Assistants at the top of the roadmap:
1. Read the Notice in full
2. Read my request below
3. Verify against §3 (Distribution Strategy), §4 (Architectural Principles), 
   §8 (Out of Scope)
4. If any rejected pattern from the Notice is applicable, refuse and 
   counter-propose within constraints

My request:
[request here]

After responding, confirm at the end which distribution scenario(s) govern 
your proposed approach.
```

**When to use**: starting a new feature, major refactor, architectural discussion. Once per work package is enough.

### 3.2 Concise template (use for follow-up prompts in same session)

```
@docs/roadmap.md

Per Notice + §3/§4/§8: [request]
```

**When to use**: continuation of a session where the assistant has already demonstrated roadmap awareness. Reminds but doesn't over-instruct.

### 3.3 Minimal template (use for simple in-scope requests)

```
@docs/roadmap.md

[request]
```

**When to use**: when the roadmap is relevant for context but the request is clearly within scope. The attachment alone signals authority without prompt overhead.

---

## 4. Document reading order for AI assistants

When multiple docs are attached, the intended reading order is:

```
1. Notice to AI Assistants (top of roadmap.md)     ← governance
2. .cursor/rules/00-project-core.mdc (if loaded)   ← hard constraints mirror
3. docs/roadmap.md §3, §4, §8                      ← scenarios + principles + exclusions
4. docs/session-geolocalizzazione-e-mappa.md       ← operational history
5. .cursor/rules/99-known-state.mdc (if invoked)   ← invariants
6. .cursor/rules/10-html-architecture.mdc (auto)   ← implementation patterns
7. .cursor/rules/20-domain-knowledge.mdc (auto)    ← domain specifics
8. Source code                                      ← ground truth
```

**Decision tree for attachment**:

```
Is the task architectural / strategic / ≥ 4h?
├── YES → attach roadmap (full)
│         and possibly session.md
└── NO  → is it a known invariant concern?
          ├── YES → attach @99-known-state
          └── NO  → is it domain-specific (CRS, DTG, formats)?
                   ├── YES → rely on auto-attach of 20-domain
                   └── NO  → don't attach anything extra;
                             00-project-core + 10-html are enough
```

---

## 5. Integration with `.cursor/rules/*`

### 5.1 Role separation

| Document | Role | Trigger | Authority |
|---|---|---|---|
| `00-project-core.mdc` | Hard constraints (always loaded) | Always | Authoritative on stack, comms style, anti-patterns |
| `10-html-architecture.mdc` | Implementation patterns | Auto on `*.html` | Authoritative on state, persistence, i18n, idempotency |
| `20-domain-knowledge.mdc` | Domain specifics | Agent-requested | Authoritative on CRS, DTG, geocoding OPSEC, tile pack |
| `99-known-state.mdc` | Invariants | Manual `@` only | Authoritative on "do not break this" list |
| `docs/roadmap.md` | Strategy | Manual `@` only | Authoritative on distribution, principles, scope, tiers |
| `docs/session-*.md` | History | Manual `@` only | Authoritative on what was done and why |
| `checkpoint.md` | Index | Always readable, rarely @-mentioned | Pointer only |

### 5.2 Mirror relationships

**Critical**: some content is deliberately duplicated across documents. These duplications are maintained intentionally.

| Content | Primary location | Mirror location | When to update both |
|---|---|---|---|
| Hard constraints list (no framework, no build, etc.) | `00-project-core.mdc` | `roadmap.md` Notice § "Rejected patterns" | Any change to either |
| Architectural principles summary | `00-project-core.mdc` | `roadmap.md` §4 | When principle added/removed |
| Response style (IT, no preamble, diff > 20 lines) | `00-project-core.mdc` | `roadmap.md` Notice § "Disagreement protocol" | Style change affecting AI behavior |

**Update procedure**: change the primary, then open the mirror in the same commit to keep in sync. Commit message: `docs: sync [content] between roadmap and 00-project-core`.

### 5.3 Precedence when documents conflict

If two documents appear to conflict:

1. **Hard constraints**: `00-project-core.mdc` wins (it's the mandatory auto-load; it's the last line of defense).
2. **Invariants**: `99-known-state.mdc` wins over roadmap when explicitly invoked.
3. **Everything else**: roadmap wins over session.md (roadmap is strategic, session is historical; history describes what was done, strategy describes what should be done).

In practice, conflicts should be rare if mirrors are kept in sync. If you discover a conflict, treat it as a bug in documentation — reconcile before proceeding.

---

## 6. Anti-patterns

Things NOT to do with the roadmap:

### 6.1 Don't attach in debugging sessions

Debugging asks "why is this broken?" — roadmap answers "where are we going?". Different questions. Attach source, `10-html-architecture.mdc`, and maybe `session.md` for context. Leave roadmap out.

### 6.2 Don't attach for style questions

"How should I format this CSS?" has nothing to do with distribution strategy. Token waste.

### 6.3 Don't paraphrase the roadmap in the prompt

Wrong:
```
@docs/roadmap.md

Remember that this is a single-file HTML app with no framework and offline-first.
[request]
```

This costs tokens twice for the same information. The attachment is the source; don't restate it in prose.

Right:
```
@docs/roadmap.md

[request]
```

### 6.4 Don't attach roadmap to override it

If you want to propose a pattern the roadmap rejects (e.g., "let's split into ES modules"), the roadmap is not what you attach — you open a **strategic revision conversation**, decide, update the roadmap first, then implement. Attaching the roadmap while asking to violate it forces the assistant into the disagreement protocol and wastes the exchange.

### 6.5 Don't attach in automated / agent-loop contexts

If you're using Cursor's agent mode with Auto-Run for a long task, attaching the roadmap at each step is redundant after the initial plan approval. Approve the plan with roadmap attached once; let the agent execute with smaller context.

### 6.6 Don't rely on roadmap for implementation details

Roadmap says "CoT XML export (T1.2)". It does NOT say how to structure the XML. For that, consult:
- `20-domain-knowledge.mdc` for project-specific patterns
- MITRE CoT Schema (cited in §7.3) for authoritative spec
- `session.md` if prior work touched CoT

---

## 7. Sniff test — is the AI actually reading the Notice?

When you attach `@docs/roadmap.md` with the Notice, verify the assistant respected it. Signs it did:

**Positive signals**:
- Response explicitly references §3 scenarios when proposing architectural choices
- Rejects a suggestion with specific principle citation ("Violates §4.1 driven by scenario (a)")
- Uses the disagreement protocol format (⚠️ block) when proposing alternatives
- Self-checks at end: "This approach is consistent with scenarios (a) and (b)."

**Negative signals** (Notice was ignored or skimmed):
- Proposes ES modules, TypeScript, framework, bundler despite attachment
- Says "you could also consider [rejected pattern]" as a side note
- Ignores single-file constraint and suggests a folder structure
- Includes a "best practice" lecture without tying it to roadmap content
- Uses `localStorage` or `IndexedDB` guidance inconsistent with §4.4

If you see negative signals, the assistant either didn't read the Notice or is defaulting to training data. Respond by:

1. Quoting the specific Notice section being violated
2. Requesting the disagreement-protocol format for any dissent
3. If it persists: switch to verbose template (§3.1) and restart the task

---

## 8. Maintenance cadence

| Activity | Frequency | Owner |
|---|---|---|
| Review this workflow document | Quarterly | You |
| Update roadmap per §10 triggers | Event-driven | You |
| Sync mirror between roadmap Notice and `00-project-core.mdc` | On any change to either | You |
| Add newly encountered AI anti-patterns to Notice rejected list | Event-driven | You |
| Log strategic concerns raised by AI into `session.md` | Session-by-session | You |

---

## 9. Quick reference — the three most useful patterns

**Starting a new feature**:
```
@docs/roadmap.md @docs/session-geolocalizzazione-e-mappa.md

Plan implementation of [feature]. Execute Notice reading order. Verify 
§3/§4/§8 before proposing anything. Flag scenario alignment explicitly.
```

**Quick scope check**:
```
@docs/roadmap.md

Is [proposed change] within scope? Answer with reference to §§2, 3, 8.
```

**Continuing approved work**:
```
Execute step [N] of the approved plan. No roadmap re-read needed.
```

That's 90% of usage. Everything else is refinement.
