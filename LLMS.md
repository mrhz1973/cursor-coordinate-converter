# LLMS — GIS Tool

## What this project is

GOI GIS Tool is a single-file HTML GIS utility. The deliverable is `coordinate_converter Claude.html`. There is no build step and no bundler.

## Where to start

| Need | Go to |
|---|---|
| Operational bootstrap (CORE BOOT) | [`README.md`](README.md) — AI-BOOT block |
| Current live state | [`docs/OPERATING_MEMORY.md`](docs/OPERATING_MEMORY.md) §7.1 |
| Project method | [`docs/OPERATING_MEMORY.md`](docs/OPERATING_MEMORY.md) §4 |
| Architecture constraints | [`docs/OPERATING_MEMORY.md`](docs/OPERATING_MEMORY.md) §2 · [`docs/roadmap.md`](docs/roadmap.md) §4 |
| Plan / backlog | [`docs/work-units/WU-0005-0009-roadmap.md`](docs/work-units/WU-0005-0009-roadmap.md) |
| Legacy history (audit only) | `docs/checkpoint.md` · `docs/session-geolocalizzazione-e-mappa.md` |

## Key constraints for implementers

- Do not split the single HTML file prematurely.
- Do not introduce a build step or bundler.
- Do not make silent network calls.
- Do not request GPS at startup.
- Run a syntax check after editing inline JS.
- Commit selectively — never `git add .` in autosync; never include the monolith in memory autosync.
- Gate any destructive or irreversible action.
