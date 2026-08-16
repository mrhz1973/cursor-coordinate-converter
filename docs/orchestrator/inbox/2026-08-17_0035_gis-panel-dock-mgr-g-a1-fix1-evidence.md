# 2026-08-17 — GIS-PANEL-DOCK-MGR-G-A1-FIX1 evidence

## Fatti stabili

- **BASE LIVE:** `7a5c42f3708cfa3dff3f7a7a7e1fdab5e470066c` · build **208** · `GIS-PANEL-DOCK-MGR-G-A1`
- **CANDIDATE FIX1:** `c122fd49c7046a8a3ef98f08d9d94d1e6b4676a6` · build **209** · `APP_BUILD_ID=GIS-PANEL-DOCK-MGR-G-A1-FIX1`
- **Blob:** `278421cc4fd4e3b57965ff717f5fc3cf7e20b4a1`
- **SHA-256 LF / bytes:** `0ef362dfac902f9fe963ed07e73e19ecf9141bcf69ce91e62b8b1a4b08dbe7d2` · **10375356**
- **Diff BASE→FIX1:** `1 file changed, 217 insertions(+), 40 deletions(-)` · ~30 hunk
- **Finding operatore:** title/drag handle dietro header z29 dopo drag troppo alto
- **Fix:** `gisPanelSafeTop()` dinamico (header bottom + gap; dock row via padding header) + clamp in `gisPanelClampRect` / `PartialVisible` / `gisPanelAttachDrag` + `gisPanelNudgeOpenPanelsToSafeTop` su resize
- **Z-order:** invariato (panels ≤28, header/dock 29, drawer 30)
- **Selftest:** **454/454** fail=0 · 10 check `SAFE_TOP_FIX1_*`
- **NO** deploy · **NO** ABQA post-deploy · **NO** QA istruzioni · **NO** finito · G-B/C/D/F **NOT OPENED**

## Gate

**REVIEW GPT-SOSTITUTIVA — PENDING**

## Codice (simboli)

- `gisPanelSafeTop` → shared; `dflightComputePanelSafeTop` delega
- `gisPanelClampRect` / `gisPanelClampRectPartialVisible` minTop = safeTop
- `gisPanelAttachDrag` onMove usa safeTop
- `gisPanelNudgeOpenPanelsToSafeTop` (resize; no pair layout)

## Probe Playwright (locale candidato)

Vedi `2026-08-17_0035_gis-panel-dock-mgr-g-a1-fix1-verify.json`.

| Viewport | beforeTop | afterTop / safe | hitPanel |
|----------|-----------|-----------------|----------|
| 1400×900 | −40 | 95 / 95 | true |
| 360×640 | −40 | 154 / 154 | true |
| 360 + dock row | 0→nudge | 219 / 219 | true |

WU-0019: Details stable during Zone clamp; `pairInClamp=false`.

## Invarianti

- unica SoT dock G-A1; z-order; workbench gap G-B; no rete/GPS/storage/helper; `mapWaypoints` invariato; brand TMART.
