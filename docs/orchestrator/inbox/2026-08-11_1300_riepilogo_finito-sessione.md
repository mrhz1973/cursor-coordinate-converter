# Riepilogo finito sessione — MAP-ZOOM-FOCUS-ANCHOR-A-FIX1

## Trigger
`QA MAP-ZOOM-FOCUS-ANCHOR-A-FIX1 PASS operatore` → auto-`finito` Regola H.

## Catena chiusa CLOSED / PASS end-to-end
- **MAP-ZOOM-FOCUS-ANCHOR-A** (`f134629`, build 156) — focus transiente `gMapZoomFocus`; zoom-in usable-center; camera signature/stale; neutral/dblclick/WP Centra
- **FIX1** (`ac3a0ea`, build 157) — allowlist neutral basemap; waypoint focus `pointerup`-only

## Live state registrato
- focus zoom-in panel-aware (`gisMapUsableRect` + `gisMapOffsetVC`)
- focus transiente non persistito
- camera signature / stale behavior
- neutral map click (allowlist)
- waypoint marker pointerup-only
- track focus **DEFERRED / OUT V1**
- Workbench/Oggetti GIS **FROZEN**

## Commit TASK (chiusura docs)
- FULL SHA: `5da286f6573abe59eeec349638b7f02aafd69e89`
- subject: `docs: close MAP-ZOOM-FOCUS-ANCHOR-A chain after QA PASS`
- push task: **riuscito** (pre-autosync)
- file: `docs/OPERATING_MEMORY.md`, `docs/work-units/WU-0005-0009-roadmap.md`, `docs/HANDOFF.md`
- monolite: **non** incluso (già in `ac3a0ea`; docs-only chiusura)

## Runtime QA'd / deployato
- FULL SHA: `ac3a0eaefd334e20f3e4ed3085668c70c5dbf1c9`
- build: `MAP-ZOOM-FOCUS-ANCHOR-A-FIX1` / 157
- blob: `fceb5626511f38f75154759f0c4ab8a7474acebe`
- byte: 9789222
- SHA-256: `0bcd7f5349464ed51c8ffaa779fe13d9bc1020d580c9aedd4e0a68d91db98717`
- Deploy tecnico: PASS (solo `goi-gis-app`; tip VPS `3ed3f8e`)
- QA: PASS operatore (provenienza operatore via ChatGPT, 2026-08-11)
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=ac3a0ea`

## Working tree pre-autosync
pulito dopo push task `5da286f` (solo docs autosync in preparazione).

## Prossimo passo
Provider IIM·CIGA·UKHO / online update — solo dopo decisione operatore. Backlog **MODAL-OPEN-TOP-ALIGN-A**. Oggetti GIS FROZEN.

## Limiti
Fatti del commit autosync corrente = EXTERNAL_ONLY (non autorati qui).
