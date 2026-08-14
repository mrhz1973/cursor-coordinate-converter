# D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX1 — implementazione runtime

**Data:** 2026-08-14 08:56 (locale)  
**Categoria:** DELICATO (lifecycle/geometry + filtro UX)  
**Gate:** `D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`  
**NON** deploy · **NON** finito · **NON** chiusura WU-0014 · **NON** PASS operatore

## Task

- **real_task_commit:** `b504c0205dcb8a33ffef06bb2a16841630de64a6`
- **subject:** `fix(dflight): FIX1 temporal filter immediate redraw + adaptive panels`
- **parent / baseline:** `6c9c6972350dffcc9596179875b79ed06c7c6cd3` (build 180)
- **diff range:** `6c9c697..b504c02`
- **file runtime:** solo `coordinate_converter Claude.html`
- **build:** `APP_BUILD_NUM=181` · `APP_BUILD_ID=D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX1`

## Root cause (confermata)

Listener checkbox OK (`dflightSetTemporalFilter` + redraw). Con ATM09 preferred+ready, `dflightDrawOverlayDom` faceva early-return su `dflightAtm09ShouldSuppressNfzColors()` **prima** del loop `dflightTemporalFilterAllows` → nessun vettore NFZ percepibile. I selftest stubbavano suppress→false, quindi QA automatica poteva PASS mentre QA umana FAIL.

## Fix applicati

1. **`dflightTemporalFilterIsRestrictive()`** — true se almeno uno stato canonico è OFF.
2. Gate ATM09: suppress early-return **solo** se suppress AND **non** restrictive (5/5 ON = comportamento parent 180).
3. Change handler → **`dflightRedrawOverlayFromSession(tm)`** (zero rete / Refresh / Apply / mutazione dataset).
4. Tooltip `title=` IT sulle 5 `<label>` del filtro.
5. **`dflightSyncAdaptivePanelGeometry`**: altezza naturale + max-height = spazio utile (safeTop→bottom); overflow body solo se contenuto eccede.
6. **`dflightRestorePanelToSafeTop`**: minimize→maximize riancora Y a safeTop (preserva left); wired in `gisRestoreMinimizedPanel` per `#dflightPanel` e `#dflightDetailsPanel`.
7. CSS: rimosso `max-height:min(82vh, 640px)` sui due pannelli D-Flight.

## Verifiche

- `git diff --check` PASS
- `node --check` JS inline principale PASS
- `GOIDflight.selfTest()` **231/231 PASS** (locale `http://127.0.0.1:8899/...`)
- Nessuna nuova rete/storage nel diff filtro
- Helper VPS / ATM09 API-routes / sanitizer non toccati
- Monolite incluso nel commit task; docs **non** in commit runtime

## Stato WU / OM

- WU-0014 resta **OPEN** (non CLOSED)
- Review GPT-sostitutiva **obbligatoria** prima del deploy
- QA operatore **non** attestata su FIX1

## Prossimo passo

Review GPT-sostitutiva da `raw@b504c02` (checklist DELICATO) → poi deploy + Automated Browser QA → QA umana residua ChatGPT.
