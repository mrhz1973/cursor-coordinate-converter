# Control Plane watcher test

This file is a minimal docs-only marker used to verify the control-plane multirepo watcher.

Latest test:
- Date: 2026-05-21
- Repo: mrhz1973/cursor-coordinate-converter
- Purpose: trigger n8n multirepo polling notification
- Runtime touched: no
- App code touched: no

## Automatic handoff trigger test

- Date: 2026-05-21
- Repo: mrhz1973/cursor-coordinate-converter
- Purpose: verify automatic handoff after multirepo watcher notification
- Expected Telegram 1: commit notification
- Expected Telegram 2: handoff result Prompt ready yes/no
- Runtime touched by this commit: no
- App code touched: no

## Automatic handoff IF-fix retest

- Date: 2026-05-21
- Repo: mrhz1973/cursor-coordinate-converter
- Purpose: verify automatic handoff after IF input fix
- Expected Telegram 1: commit notification
- Expected Telegram 2: handoff result Prompt ready yes/no
- Runtime touched by this commit: no
- App code touched: no

## Handoff Telegram prompt preview retest

- Date: 2026-05-21
- Repo: mrhz1973/cursor-coordinate-converter
- Purpose: verify enriched Telegram handoff message with generated prompt preview
- Expected Telegram 1: commit notification
- Expected Telegram 2: handoff result with Prompt ready, Next action, and Generated prompt preview
- Runtime touched by this commit: no
- App code touched: no

## Telegram handoff file attachment test

- Date: 2026-05-21
- Repo: mrhz1973/cursor-coordinate-converter
- Purpose: verify Telegram handoff file attachment from workflow 02B
- Expected Telegram 1: commit notification
- Expected Telegram 2: handoff preview
- Expected Telegram 3: attached latest-gis-handoff.md
- Runtime touched by this commit: no
- App code touched: no
