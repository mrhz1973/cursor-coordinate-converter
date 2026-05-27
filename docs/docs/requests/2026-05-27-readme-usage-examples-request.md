# Request — README usage examples

Date: 2026-05-27
Repo: mrhz1973/cursor-coordinate-converter
Risk: low
Requested by: control-plane manual end-to-end validation

## Goal

Improve the repository documentation so a new user can understand how to run or use the coordinate converter without reading the source code first.

## Requested change

Ask the implementer to inspect the repository and update the most appropriate documentation file, preferably `README.md`, with:

1. a short description of what the converter does;
2. the supported input/output coordinate formats actually present in the code or current docs;
3. one minimal usage example;
4. one short note about what is not supported yet, if that is clear from the repo.

## Constraints

- Do not invent unsupported features.
- Do not change application/runtime behavior.
- Do not touch n8n, control-plane, workflow 40 or workflow 41.
- Do not add secrets.
- Do not deploy.
- Keep the change small and reviewable.

## Expected control-plane behavior

This commit should trigger workflow 42.
Codex CLI should classify it as low risk and decide whether Cursor should update documentation.
Cursor should be used only if it can make a small useful documentation improvement.
