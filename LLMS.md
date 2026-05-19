# LLMS — GIS Tool

## What this project is

GOI GIS Tool is a single-file HTML GIS utility. The deliverable is `coordinate_converter Claude.html`. There is no build step and no bundler.

## Where to start

| Need | Go to |
|---|---|
| Project method and routing | [`docs/METHOD.md`](docs/METHOD.md) |
| Current project state | [`docs/checkpoint.md`](docs/checkpoint.md) |
| Architecture constraints | [`README.md`](README.md) — Architecture principles section |
| Orchestrator session docs | [`docs/orchestrator/`](docs/orchestrator/) |

## Method

This project uses [dev-method v0.1.0](https://github.com/mrhz1973/dev-method/blob/v0.1.0/README.md).  
Active posture: **Level 2.5 / Level 3-track**.  
Implementers: Claude Code / Cursor CLI.  
Orchestrator: ChatGPT web.

## Key constraints for implementers

- Do not split the single HTML file prematurely.
- Do not introduce a build step or bundler.
- Do not make silent network calls.
- Do not request GPS at startup.
- Run a syntax check after editing inline JS.
- Commit selectively — never `git add .`.
- Gate any destructive or irreversible action.
