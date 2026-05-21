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

## Telegram handoff file attachment retest after tmp fix

- Date: 2026-05-21
- Repo: mrhz1973/cursor-coordinate-converter
- Purpose: verify Telegram handoff file attachment from /tmp output path
- Expected Telegram 1: commit notification
- Expected Telegram 2: handoff preview
- Expected Telegram 3: attached latest-gis-handoff.md
- Runtime touched by this commit: no
- App code touched: no

## Telegram handoff file attachment retest with n8n-files path

- Date: 2026-05-21
- Repo: mrhz1973/cursor-coordinate-converter
- Purpose: verify Telegram handoff file attachment from workflow 02C using /home/node/.n8n-files
- Expected Telegram 1: commit notification
- Expected Telegram 2: handoff preview
- Expected Telegram 3: attached latest-gis-handoff.md
- Runtime touched by this commit: no
- App code touched: no

## Telegram handoff file attachment final retest with split fix

- Date: 2026-05-21
- Repo: mrhz1973/cursor-coordinate-converter
- Purpose: verify workflow 02D sends correct handoff preview plus attached latest-gis-handoff.md
- Expected Telegram 1: commit notification
- Expected Telegram 2: handoff preview with Prompt ready and NOT undefined
- Expected Telegram 3: attached latest-gis-handoff.md
- Runtime touched by this commit: no
- App code touched: no

## Telegram handoff final retest with cat stdout

- Date: 2026-05-21
- Repo: mrhz1973/cursor-coordinate-converter
- Purpose: verify workflow 02E sends correct handoff preview plus attached latest-gis-handoff.md
- Expected Telegram 1: commit notification
- Expected Telegram 2: handoff preview with Prompt ready and generated prompt preview
- Expected Telegram 3: attached latest-gis-handoff.md
- Runtime touched by this commit: no
- App code touched: no

## Telegram handoff final retest with safe text and file attachment

- Date: 2026-05-21
- Repo: mrhz1973/cursor-coordinate-converter
- Purpose: verify workflow 02F sends safe short Telegram handoff text plus attached latest-gis-handoff.md
- Expected Telegram 1: commit notification
- Expected Telegram 2: safe handoff text without Markdown/entities parse error
- Expected Telegram 3: attached latest-gis-handoff.md
- Runtime touched by this commit: no
- App code touched: no
