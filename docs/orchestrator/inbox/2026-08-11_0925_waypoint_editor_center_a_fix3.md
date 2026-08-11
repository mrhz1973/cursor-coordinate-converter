# WAYPOINT-EDITOR-CENTER-A-FIX3 — implementazione

**Data:** 2026-08-11 ~09:25 locale  
**Tipo:** DELICATO — core UTM/MGRS + waypoint conversion copy  
**Baseline:** `50ee47faf787631a717c7501c554c18fad73caa6`  
**RUNTIME:** `79155a36aa7199408853ae40ee12a58815737854`  
**Subject:** `fix(coords): correct UTM inverse and waypoint conversion preview`  
**Blob monolite:** `f0cd56583e0df601ef4074ed734236b7608cabdd`  
**Build:** `WAYPOINT-EDITOR-CENTER-A-FIX3` · **154**  
**Push task:** riuscito  
**Monolite in autosync:** escluso

## Core

- Bug: in `utmToLatLon`, inversa conformal→geodetic usava `t = tp·A + σ·B` invece di `t = (tp + σ·B)/A`.
- `latLonToUTM` **invariato**.
- QA `32T NQ 75167 01394`: lat≈44.26190620 lon≈9.94169824; RT ΔE/ΔN ≈ 0; MGRS identity.

## UI

- Preview MGRS identity via `formatMgrsCanonicalFromParse` (stessa precisione).
- `#wpFieldCoordFeedback` + `#wpFieldCoordCopyBtn` (`.copy-btn` / `copyText` / `data-copy` solo valore).

## Gate

- Deploy: **NOT EXECUTED** (review GPT-sostitutiva required)
- QA: NOT EXECUTED
- `finito`: solo dopo review + deploy + QA PASS
- MAP-ZOOM-FOCUS-ANCHOR-A: **non** implementato

## Autosync corrente

SHA/push/HEAD = **EXTERNAL_ONLY**
