# Project Roadmap — Coordinate Converter → Light Tactical GIS Tool

**Type**: Strategic reference document
**Status**: Stable (major revisions only)
**Language**: English (body); Italian acceptable in operational notes
**Last revision**: 2026-04-23 (rev. 2 — added Notice to AI Assistants, §3 Distribution Strategy)

---

## Notice to AI Assistants

> **Scope of this notice**: this is a meta-instruction, not document content. It governs how you read the rest of this file. Read it in full before responding to any request that touches this project.
>
> **Mirror notice**: this section deliberately duplicates constraints present in `.cursor/rules/00-project-core.mdc`. The duplication is intentional — both documents are authoritative. When either is modified, the other must be updated in the same change.

### Authority of sections

§3 (Distribution Strategy), §4 (Architectural Principles), and §8 (Out of Scope) are **hard constraints**, not informational content. Treat them with the same authority as runtime assertions in the code: a response that violates them is defective, regardless of technical merit.

All other sections are strategic context. They inform judgment but do not constrain it with the same force.

### Precedence rule

When tension arises between "technically better" and "architecturally coherent", **architectural coherence wins**. This is not a preference — it is a structural property of this project driven by distribution scenarios (§3). A technically superior solution that violates §4 is not a solution; it is a scope change disguised as an improvement.

Before proposing any non-trivial change, verify:
1. Which distribution scenario(s) the change is consistent with (§3)
2. Whether any architectural principle is affected (§4)
3. Whether the change crosses an out-of-scope boundary (§8)

If any of these checks fail, the default response is refusal with a targeted counter-proposal inside the constraints.

### Rejected patterns (non-exhaustive)

The following patterns are **rejected by default**, even when they represent current industry best practice in other contexts. This list enumerates known recurring anti-patterns; the underlying principle is broader.

**Underlying principle**: any pattern that (a) breaks single-file deployability, (b) introduces a build step, (c) requires runtime network access outside opt-in tile fetching, or (d) restructures centralized state without explicit strategic decision, is rejected.

Current known examples:

| Pattern | Why rejected |
|---|---|
| ES Modules (`import`/`export` syntax) | Requires either build step or multi-file serving; breaks scenarios (a) and (b) |
| React / Vue / Svelte / Lit / any UI framework | Build step, dependency chain, restructures state |
| TypeScript | Build step, breaks single-file |
| Bundlers (Webpack, Vite, esbuild, Rollup, Parcel) | Build step |
| Transpilers (Babel, SWC) | Build step |
| Centralized Store pattern refactor (Redux, MobX, Zustand, Pinia, custom "proper" store) | Restructures `state` without strategic justification |
| Global event delegation refactor | Restructures existing idempotent bind pattern without need |
| Architectural rewrites | Non-incremental by definition |
| Refactors > 50 lines without prior approval | Violates incremental evolution principle (§4.7) |
| CSS preprocessors (Sass, Less, PostCSS) | Build step |
| NPM / package.json introduction | Dependency resolution, build step implication |
| Web Components with external templates | Typically multi-file |

This list is **non-exhaustive**. When evaluating a pattern not listed, apply the underlying principle.

### Disagreement protocol

You may disagree with an architectural decision. The protocol is strict:

- **One strategic concern per turn, maximum**. A "turn" is a single response unit, regardless of mode (Plan, Chat, Agent). A concern voiced in Plan mode counts as raised for the entire planning→execution cycle; do not repeat it in Agent mode.
- **Format**: prefix the response with a single block:
  ```
  ⚠️ Strategic concern: [specific principle] appears to conflict with 
  [specific goal] because [concise reasoning]. Proceeding per §[N].
  ```
- **After the block, execute the requested work fully aligned with the roadmap.** The strategic concern is registered, not acted upon.
- **Do not**: lecture, repeat the concern across multiple turns, propose the rejected pattern as "just an alternative to consider", or include the rejected pattern in code samples as "illustration".

The user decides whether a strategic concern warrants a revision. You register concerns; you do not re-open decisions.

### Reading order for new requests

1. This Notice (always)
2. The specific user request
3. `.cursor/rules/00-project-core.mdc` (if auto-loaded by Cursor; otherwise assume mirrored here)
4. §3 Distribution Strategy — identify which scenario governs the current task
5. §4 Architectural Principles — identify active constraints
6. §8 Out of Scope — identify forbidden directions
7. Remaining sections as needed

Only after this reading should you formulate a response.

---

## 1. Document Purpose

Forward-looking strategic reference. Complements:

- `checkpoint.md` — short index for fast @-mention lookup
- `docs/session-geolocalizzazione-e-mappa.md` — operational history, living backlog, decision log
- `.cursor/rules/99-known-state.mdc` — invariants ("do not break this")

This document answers: **where is the product going, within what boundaries, against which references**. It does not track daily tasks (that belongs in `session.md`) and does not restate implementation invariants (those belong in `99-known-state.mdc`).

Consult via `@docs/roadmap.md` when planning a new feature, scoping a work package, or deciding whether a request falls inside or outside product boundaries.

---

## 2. Product Vision

### 2.1 What this is

A **single-file HTML light tactical GIS tool** with offline-first operation, OPSEC-aware behavior, and professional-grade coordinate handling. Originated as a coordinate converter; evolving toward a compact operational planning and analysis workstation for:

- Dismounted / vehicular / maritime navigation
- Drone mission planning support (ISR and waypoint-based)
- JTAC support workflows
- Intelligence analyst compound / AOI analysis
- OSINT geospatial workflows

### 2.2 What this is NOT

Explicit negative scope — protects against feature creep:

| Not this | Why |
|---|---|
| Enterprise GIS (ArcGIS Pro / QGIS replacement) | Complexity ceiling incompatible with single-file constraint |
| Multi-user C2 platform | No server, no federation, no realtime sync by design |
| TAK server / TAK ecosystem participant | Interop (CoT import/export) yes; participation no |
| Automated targeting / weapon system interface | Advisory tools only; no kinetic decision automation |
| Raster processing / image analysis pipeline | Overlay and georeferencing yes; processing no |
| 3D globe / terrain renderer | 2D with DEM-derived overlays only |
| Build-step web application | Breaks single-file deployability |

### 2.3 Target users

- J-2 / S-2 intelligence analysts producing AOI products
- SOF operators in planning phase
- JTAC / FAC personnel for CAS pre-brief
- Drone operators needing format translation
- Field personnel requiring offline-capable navigation

### 2.4 Operating environment assumptions

Operational context of use (not distribution — see §3 for that):

- Desktop-first UX; mobile secondary
- Frequent disconnected operation expected (caches pre-populated, no runtime fetches unless explicitly opted in)
- Classified / sensitive data may be handled; data never leaves the device by default
- Users technically competent (GIS / military background assumed)
- Intermittent network quality when connected (assume degraded bandwidth, high latency)

---

## 3. Distribution Strategy

Distribution scenarios are the **root cause** of the architectural principles in §4. Every constraint in §4 is traceable to at least one scenario below. When evaluating architectural decisions, the chain is: *scenario (§3) → principle (§4) → implementation*.

### 3.1 Scenario priorities

| Priority | Scenario | Status |
|---|---|---|
| **Primary** | (a) Air-gapped / classified distribution | Active driver |
| **Primary** | (b) Informal peer-to-peer sharing | Active driver |
| Future | (c) Progressive Web App (PWA) | Non-blocking, not designed against |

### 3.2 Scenario (a) — Air-gapped / classified distribution

**Description**: distribution via physical media (USB, optical) to workstations in classified enclaves with no internet access. Recipient opens the file directly from the removable medium or a local copy.

**Constraints imposed**:

- Single file only — no folder structures, no sibling assets
- No runtime network calls (CDN scripts, tracking, auto-updates)
- File-URL loading must work (`file:///...` protocol)
- Audit viability — a single artifact can be reviewed, hashed, signed, and approved for a classified enclave; a multi-file bundle cannot
- No build artifacts requiring runtime reconstruction

**Drives**: §4.1 (Single-file HTML), §4.2 (Zero runtime CDN dependencies), §4.4 (Offline-first), §4.5 (OPSEC by design)

### 3.3 Scenario (b) — Informal peer-to-peer sharing

**Description**: file sent via email, messaging app, or shared drive to a colleague for non-classified use. Recipient saves the file and opens it by double-click on Mac or Windows without launching a local server, without extracting an archive, without following setup instructions.

**Constraints imposed**:

- Single file or single archive — email attachment must be one deliverable
- No local server requirement (no `python -m http.server`, no Node runtime)
- No CORS issues from `file://` context (no `fetch()` to local sibling files, no `import` from local modules)
- No post-download setup steps (no "install these fonts first", no "configure this path")
- Cross-platform identical behavior (Mac Finder / Windows Explorer / Linux file manager)

**Drives**: §4.1 (Single-file HTML), §4.3 (Vanilla JavaScript, no framework)

### 3.4 Scenario (c) — Progressive Web App (future, non-blocking)

**Description**: hypothetical future deployment where the tool is hosted on a web server (possibly internal) and installed as a PWA on mobile devices for offline-capable field use. Not currently planned; flagged as long-term possibility.

**Current status**: **non-blocking**. Decisions today are not made against scenario (c). However, we avoid choices that would definitively preclude it.

**Preclusivity test** — a choice precludes scenario (c) if it fails any of:

1. **Storage API compatibility**: if a pattern uses `localStorage` with synchronous read→modify→write in hot paths and cannot be migrated to async-capable storage, it partially precludes (c). Soft-preclusive — requires migration work, not impossible.
2. **DOM API compatibility**: use of `document.execCommand`, `window.showModalDialog`, or main-thread-blocking APIs incompatible with service worker context. Hard-preclusive.
3. **Script composition compatibility**: introduction of patterns that would break if the file were split into multiple `<script>` tags served independently (top-level await, cross-script IIFE side effects with implicit ordering). Hard-preclusive.

A choice that passes all three is automatically PWA-safe. A choice that fails one is a risk signal requiring strategic decision before adoption — not an automatic prohibition.

**Does not drive any current §4 principle.** Would drive new principles if promoted to active scenario.

### 3.5 Promotion / demotion of scenarios

Scenario priority changes are **major strategic decisions**, not tactical adjustments. Promotion of (c) to active status would:

- Trigger review of §4.8 (File size management) — splits previously forbidden may become acceptable
- Require service worker architecture design
- Reopen evaluation of some §8 exclusions (mobile-native considerations)
- Require revision policy update (§10)

Demotion of (a) or (b) is not envisioned but would similarly trigger architectural review.

---

## 4. Architectural Principles (Stable)

These principles are not up for reconsideration without an explicit strategic review. Each principle is traced to the distribution scenario(s) that drive it — see §3.

### 4.1 Single-file HTML

All HTML, CSS, and JavaScript reside in one `.html` file. **Driven by scenarios (a) and (b).**

- Enables file-URL deployment from removable media (scenario a)
- Enables email/message attachment of a single deliverable (scenario b)
- Enables trivial audit — single artifact to hash, sign, and review (scenario a)
- Zero install, zero build, zero dependency resolution

### 4.2 Zero runtime CDN dependencies

Tile basemaps are the only network touchpoint, and always opt-in or offline-cached. No CDN JavaScript libraries. Any library introduced must be vendored inline. **Driven by scenario (a).**

Classified and air-gapped deployments cannot reach CDN URLs at runtime. This principle is not about preference — it is about deployability in the primary distribution environment.

### 4.3 Vanilla JavaScript, no framework

No React, Vue, Svelte, Lit, TypeScript, or bundler. ES2020+ only. **Driven by scenarios (a), (b), and long-term maintainability.**

Frameworks imply build steps (scenarios a and b violated) and create dependency chains that fail audit scrutiny (scenario a). Vanilla JS also provides long-term maintainability without dependency churn.

### 4.4 Offline-first

`localStorage` for settings/state (< 5 MB). `IndexedDB` for tile pack and reverse-geocoding cache. All features designed to degrade gracefully when network is absent. **Driven by scenarios (a) and operating environment §2.4.**

### 4.5 OPSEC by design

- No telemetry, analytics, or tracking
- No automatic geolocation on load
- `opsecStrict` mode disables all outbound geocoding calls
- Sanitize all persisted state on load (defense against tampered `localStorage`)
- Classification markings supported on exports

**Driven by scenario (a) and operating environment §2.4.**

### 4.6 i18n obligatory

Every user-facing string passes through the `I18N` dictionary. New strings require entries in IT / EN / FR. No hardcoded UI text.

**Driven by deployment to multi-lingual coalition environments.**

### 4.7 Incremental evolution

No rewrites. No framework migrations. Features added as additive modules within the existing namespace. Refactoring is opportunistic, not scheduled. Refactors > 50 lines require prior approval.

**Driven by codebase maturity and long-term maintainability.**

### 4.8 File size management

The single-file constraint derives from §3 scenarios (a) and (b), both requiring a single deliverable artifact. When file size becomes a practical editing obstacle, splitting follows a strict hierarchy determined by which distribution scenario is authoritative at that moment:

**Tier 1 split — acceptable under (a)+(b) priority (current state)**:
Multiple `<script>` tags within the same `.html` file. No separate `.js` files. Preserves single-artifact distribution. Each `<script>` must be self-contained and order-insensitive to the degree practical (no top-level await, no cross-script IIFE side effects with implicit ordering).

**Tier 2 split — requires promotion of scenario (c) to active priority**:
Separate `.js` files loaded via standard `<script src="">`. Breaks scenario (b) (email distribution of single file) and scenario (a) (single-artifact audit). Requires strategic decision, not tactical refactor.

**Tier 3 split — requires full PWA commitment**:
Service worker + asset manifest + separate modules. Only when scenario (c) becomes primary distribution channel.

**Soft threshold**: ~22,000 lines triggers evaluation, not automatic split. Evaluation must answer: which distribution scenarios are authoritative, and which split tier is consistent with them.

---

## 5. Functional Roadmap (Preliminary)

> **Note**: This tier list is a working hypothesis pending a dedicated analysis session.
> Some Tier 1 items already implemented (partial polygon support via track builder, MGRS precision selector, OPSEC strict, WMM-2025). Priorities and completeness require review.

### 5.1 Tier 1 — Core tactical gaps (no external dependencies)

| ID | Feature | Use case | Notes |
|---|---|---|---|
| T1.1 | Dedicated compound polygon (semantic, not track-closed) | Intel analyst | Separate from track; structured annotations (accesses, buildings, observations) |
| T1.2 | CoT XML import/export | ATAK interop | Event-based schema; unidirectional is acceptable for v1 |
| T1.3 | CDE rings with 9-line workflow | JTAC | Radii per ATP 3-09.32; no automated targeting |
| T1.4 | MIL-STD-2525 symbology subset | All | Subset only (MGS, IFV, INF, MORT, COP, TGT, LZ, PZ as minimum) |
| T1.5 | Timestamp-based annotations | Pattern-of-life analysis | Temporal filter on points/polygons |
| T1.6 | Classification markings on exports | Intel products | UNCLASSIFIED / CUI / equivalents on header/footer |

### 5.2 Tier 2 — Drone format interoperability

| ID | Feature | Target platform | Notes |
|---|---|---|---|
| T2.1 | Litchi CSV waypoint export | Litchi (iOS/Android) | Well-documented schema |
| T2.2 | DJI WPML (.kmz) export | DJI Pilot / Fly | Schema per DJI WPML spec |
| T2.3 | MAVLink `.plan` export | QGroundControl, Mission Planner | JSON-based, open |
| T2.4 | UgCS route export | UgCS | Proprietary but documented |
| T2.5 | KML with drone-aware altitude modes | Google Earth, most drone planners | `altitudeMode` absolute vs relative |
| T2.6 | Gimbal/camera footprint calculator | Mission planning | FOV × altitude → area coverage |

### 5.3 Tier 3 — Raster, imagery, terrain

| ID | Feature | Dependencies | Notes |
|---|---|---|---|
| T3.1 | Image overlay with 4-point georeferencing | Internal (distortable canvas) | No library dependency achievable |
| T3.2 | Elevation profile along track | OpenTopography API or cached DEM | Opt-in fetch |
| T3.3 | Line-of-sight / viewshed | Local DEM tiles | Per-pixel visibility test |
| T3.4 | Swipe slider for imagery comparison | Internal | Extension of existing tile renderer |
| T3.5 | GeoTIFF import | `geotiff.js` vendored | Read-only |
| T3.6 | Shapefile import | `shpjs` vendored | Read-only, DBF attributes |

### 5.4 Tier 4 — OSINT workflow

| ID | Feature | Notes |
|---|---|---|
| T4.1 | Link-out to Mapillary / KartaView / Wikimapia | Parameterized URLs |
| T4.2 | Sentinel Hub Playground deep links | For imagery review |
| T4.3 | Overpass QL queries for AOI features | POI extraction from OSM |
| T4.4 | EXIF GPS import from photos | Pattern creation from image sets |
| T4.5 | Multi-layer annotation with NATO classification | Existing annotation + classification field |
| T4.6 | IPB product export (SVG + coordinates table + descriptive PDF) | Multi-format bundled export |

### 5.5 Tier 5 — Maritime

| ID | Feature | Notes |
|---|---|---|
| T5.1 | OpenSeaMap tile layer | Trivial addition |
| T5.2 | EMODnet bathymetry tiles | Trivial addition |
| T5.3 | Laylines / maritime routing | Custom geodetic calculation |
| T5.4 | Marine weather overlay | Open-Meteo marine API |
| T5.5 | ENC S-57 chart display | Complex; evaluate only if mission-critical |

### 5.6 Parallel — Monitoring & technical health

- **File-size threshold monitoring**: at 25k lines, evaluate split strategy per §4.8
- **Self-check harness extension**: every critical new module adds a test in `runSelfCheck()`
- **Performance audit**: tile rendering with track > 500 points, MGRS grid redraw on pan

---

## 6. Target Platform Interoperability Matrix

Compatibility targets for import (I) and export (E). Empty = not planned. Partial = subset of spec.

| Format | Spec ref | ATAK / WinTAK | QGIS | ArcGIS Pro | Google Earth | DJI | Litchi | QGC / MP | Garmin | Current status |
|---|---|---|---|---|---|---|---|---|---|---|
| GPX 1.1 | Topografix | I/E | I/E | I/E | I | — | — | — | I/E | ✅ done |
| KML 2.2 | OGC | I/E | I/E | I/E | I/E | via KMZ | — | — | I | ✅ done |
| KMZ | OGC | I/E | I/E | I/E | I/E | I (WPML) | — | — | I | ⚠️ export pending |
| GeoJSON | RFC 7946 | partial | I/E | I/E | — | — | — | — | — | ✅ done |
| CSV (lat/lon) | — | I | I | I | — | partial | I | partial | I | ✅ done |
| Shapefile | Esri | I | I/E | I/E | — | — | — | — | — | ❌ T3.6 |
| GeoTIFF | OGC | I (limited) | I/E | I/E | — | — | — | — | — | ❌ T3.5 |
| CoT XML | MITRE | **I/E native** | — | — | — | — | — | — | — | ❌ T1.2 |
| Litchi CSV | Litchi docs | — | — | — | — | — | **E native** | — | — | ❌ T2.1 |
| DJI WPML | DJI docs | — | — | — | — | **E native** | — | — | — | ❌ T2.2 |
| MAVLink `.plan` | QGC JSON schema | — | — | — | — | — | — | **E native** | — | ❌ T2.3 |
| UgCS route | UgCS docs | — | — | — | — | — | — | — | — | ❌ T2.4 |
| MBTiles | MapBox spec | — | I | I | — | — | — | — | — | partial (internal cache) |
| PMTiles | Protomaps | — | I | — | — | — | — | — | — | not planned |

**Legend**:
- `I` = import supported by target
- `E` = export supported by target
- `native` = format primarily designed for that platform
- `—` = not applicable
- Status column refers to **our** implementation state

**Roundtrip fidelity note**: GPX / KML / GeoJSON roundtrip through the app preserves geometry but lossy on extended attributes. Explicitly not a lossless interchange tool.

---

## 7. Doctrinal and Standards References

Authoritative sources for scope and design decisions. Consult before implementing features in the relevant domain.

### 7.1 Joint doctrine (US / NATO)

| Reference | Title | Relevance |
|---|---|---|
| JP 5-0 | Joint Planning | Planning framework; OPP alignment for mission workflows |
| JP 2-0 | Joint Intelligence | Intel cycle; product types |
| JP 3-09.3 | Close Air Support | CAS integration; supports T1.3 workflow |
| ATP 2-01.3 | Intelligence Preparation of the Battlefield (IPB) | Compound analysis methodology; T4.6 export structure |
| ATP 3-09.32 / JFIRE | Multi-Service Tactics for the JFIRE | 9-line CAS, CDE procedures; T1.3 |
| FM 1-02.2 | Military Symbols | MIL-STD-2525 cross-reference; T1.4 |
| FM 3-25.26 | Map Reading and Land Navigation | MGRS usage, terrain analysis basics |

### 7.2 NATO standards (STANAGs)

| STANAG | Topic | Relevance |
|---|---|---|
| STANAG 2014 | OPORD / WARNORD format | Export product layout reference |
| STANAG 2019 | Military Symbols for Land Based Systems (APP-6) | Symbol harmonization with MIL-STD-2525 |
| STANAG 6011 | MGRS standard | MGRS precision levels, cell definition |
| STANAG 3809 | DTED Digital Terrain Elevation Data | Format for T3.2, T3.3 |
| STANAG 7170 | Additional Military Layers (AML) | Maritime layer reference |

### 7.3 Geodetic / cartographic standards

| Reference | Relevance |
|---|---|
| WGS 84 (NGA.STND.0036) | Canonical internal datum |
| WMM-2025 (NCEI / NGA) | Magnetic declination; already implemented |
| EPSG registry | CRS codes; proj4 parameter source |
| Italian IGM specifications | Gauss-Boaga Roma40 transform parameters |
| MITRE CoT Schema | T1.2 — CoT XML format specification |
| MIL-STD-2525D | Common Warfighting Symbology — T1.4 |

### 7.4 Drone waypoint format specs

| Reference | Relevance |
|---|---|
| DJI WPML Specification | T2.2 — waypoint mission format |
| Litchi Mission Hub CSV format | T2.1 — documented CSV schema |
| MAVLink Mission Protocol | T2.3 — `.plan` JSON schema |
| UgCS Automation API | T2.4 — UgCS route format |

### 7.5 Open data sources (for optional runtime fetch)

| Source | Use | License note |
|---|---|---|
| OpenStreetMap | Base vector, geocoding (Nominatim) | ODbL, attribution required |
| Esri World Imagery | Satellite tiles | Esri terms; attribution required |
| OpenTopoMap | Topographic tiles | CC-BY-SA |
| CARTO | Vector basemaps | CARTO terms |
| OpenSeaMap | Maritime tiles | CC-BY-SA |
| EMODnet | Bathymetry | EMODnet terms |
| OpenAIP | Aeronautical data | OpenAIP terms (free tier) |
| Sentinel Hub / Copernicus | Satellite imagery | Copernicus open data license |
| OpenTopography | DEM / SRTM | CC-BY, attribution required |
| Open-Meteo | Weather, marine weather | Non-commercial free |

---

## 8. Explicit Out of Scope

Items proposed at various points and **deliberately excluded**. All technical exclusions trace to §3 distribution scenarios; see linked scenarios for rationale.

| Excluded | Scenario conflict | Additional rationale |
|---|---|---|
| Real-time multi-user collaboration (TAK server, federated sync) | (a), (b) | Breaks offline-first; adds OPSEC risk |
| Automated target engagement interfaces | — (product scope) | Advisory scope only |
| Server-side processing | (a), (b) | Violates single-file principle |
| Proprietary cartography (HERE, TomTom) | (a) | Licensing incompatibility with offline distribution |
| Mobile-native app (iOS/Android native) | (a), (b) | Web-only product; (c) may cover mobile PWA-side |
| 3D terrain rendering | — (product scope) | 2D with overlay only |
| AI/ML inference in browser | (a), (b) | Adds model weights; breaks lightweight principle |
| Voice interfaces | — (use case) | Not a field-operator primary use case in scope |

---

## 9. Roadmap Principles

### 9.1 Feature acceptance criteria

A feature enters an active tier when:

1. It has a documented use case tied to one of the seven operational profiles
2. It can be implemented without violating any architectural principle (§4)
3. Its distribution scenario compatibility has been verified (§3)
4. Its interop format (if any) has an authoritative spec reference
5. Its scope can be bounded (not an open-ended capability)

### 9.2 Tier promotion / demotion

- Tier 1 items block Tier 2+ by default — close core tactical gaps first
- Drone formats (Tier 2) may run parallel to Tier 1 if compound analyst user is stalled waiting on compound semantics
- Tier 3+ require case-by-case justification before starting

### 9.3 When to consult this document

- Before proposing a feature addition
- When a session request is ambiguously in/out of scope
- Before starting a work package > 4 hours effort
- When updating `session.md` with new direction decisions
- When an AI assistant proposes a pattern listed in the Notice (at top) as rejected

### 9.4 When NOT to consult this document

- Daily bug fixes, refactors, small improvements → `session.md`
- Implementation details → source code or `10-html-architecture.mdc`
- Coordinate / CRS / format specifics → `20-domain-knowledge.mdc`
- "What have I already implemented?" → `99-known-state.mdc` or `session.md`

---

## 10. Revision Policy

This document is **stable**. Update triggers:

- New operational profile added (currently 7 — see §2.3)
- Architectural principle changes (§4) — requires explicit decision memo
- **Distribution scenario promoted, demoted, or added (§3)** — requires strategic decision memo
- Tier list restructured after dedicated analysis session (pending — flagged in §5)
- New target platform / format added to interop matrix (§6)
- New doctrinal reference incorporated into design decisions (§7)
- Notice to AI Assistants updated — **must be mirrored in `.cursor/rules/00-project-core.mdc`**

**Not** update triggers (these go in `session.md`):

- Individual feature implementation
- Bug discoveries
- Refactors within an existing module
- UI polish decisions

Minor corrections (typos, link updates) don't require version bump. Structural changes require `Last revision` update at top.

---

## 11. Open Items for Future Strategic Review

Flagged for a dedicated future analysis session:

1. **Tier list refinement** (§5): current list is a working hypothesis from previous analysis. Needs:
   - Cross-check against current `session.md` to identify items already closed
   - Effort re-estimation based on evolved codebase
   - Priority re-evaluation based on actual user workflows
   - Possible addition of items not yet identified

2. **Target platform matrix completeness** (§6): may be missing platforms in use (e.g., specific tactical radio waveform exports, fire control system formats).

3. **Export file size impact on scenario (a)**: the interop matrix (§6) does not currently account for export size as a constraint for air-gapped distribution. Large exports (GeoTIFF, MBTiles, bundled IPB products) may need size warnings or split strategies when scenario (a) is authoritative. Analysis pending.

4. **Doctrinal reference coverage** (§7): current list is US/NATO-centric. Italian Armed Forces specific publications not yet surveyed.

5. **Maritime tier depth** (§5.5): T5 is underdeveloped relative to the user's domain (COMSUBIN). May warrant promotion / expansion.

6. **Export product templates** (T4.6 - IPB deliverable): output format and layout to be defined with reference to STANAG 2014.

7. **Reading Protocol evolution** (Notice at top): the rejected-patterns list is non-exhaustive by design. Periodic review required as new anti-patterns emerge from actual Cursor sessions. Update trigger: when an AI assistant bypasses current list with a novel violation, add it and mirror to `00-project-core.mdc`.

8. **PWA preclusivity in Tier 3 features** (§5.3): some Tier 3 features (T3.1 image overlay, T3.4 swipe slider) may use patterns that fail scenario (c) preclusivity tests. Review before implementation if scenario (c) is on the active horizon.

---

## Appendix A — Section Renumbering (rev. 2)

For anyone reading the previous version, this is the mapping from rev. 1 to rev. 2:

| rev. 1 | rev. 2 | Change |
|---|---|---|
| (none) | Notice to AI Assistants | New — non-numbered block |
| §1 Document Purpose | §1 | Unchanged |
| §2 Product Vision | §2 | §2.4 revised (distribution concerns removed) |
| (none) | §3 Distribution Strategy | New |
| §3 Architectural Principles | §4 | Revised — each principle traced to §3 scenarios; §4.8 logically rewritten |
| §4 Functional Roadmap | §5 | Unchanged content |
| §5 Interop Matrix | §6 | Unchanged content |
| §6 Doctrinal References | §7 | Unchanged content |
| §7 Out of Scope | §8 | Revised — traced to §3 scenarios; "Sheet music psyops" removed |
| §8 Roadmap Principles | §9 | Minor — added §9.1 criterion 3 (scenario compatibility) and §9.3 bullet |
| §9 Revision Policy | §10 | Revised — added Notice and Distribution Strategy triggers |
| §10 Open Items | §11 | Revised — added items 3, 7, 8 |
