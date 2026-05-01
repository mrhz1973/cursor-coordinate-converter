# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-05-01 — **Pass 5 Step E — Astro favorite chooser (monolite solo locale):** in **`coordinate_converter Claude.html`** — sorgente **`data-astro-src="favorite"`**, dialog **`#astroFavoritePicker`** (ricerca, colonne opzionali MGRS/Quando/Località/Note/Meta, header ordinabili, max 50, **Usa** → `state.astro` `favorite` + `runAstroPanelUI`); transient `astroFavPickerCols` / `astroFavPickerSort` / menu; mutua esclusione con waypoint picker; Esc (`bindHotkeys` + GIS); `gisRefreshI18n` / `gisInit`. **Non:** mostra mappa, gestione favoriti in Astro, modifica `state.favorites` / `lastResult`. Test browser: **non eseguiti**. **Monolite non committato.** Inbox: **`docs/orchestrator/inbox/2026-05-01_1300_riepilogo_pass5-stepE-astro-favorite-chooser-local.md`**. Commit memoria: **`docs: memoria Pass 5 Step E favorite chooser local`**.

2026-05-01 — **Pass 5 Step D.2 — Astro waypoint picker colonne + sort (monolite solo locale):** in **`coordinate_converter Claude.html`** — stato transient `astroWpPickerCols` / `astroWpPickerSort` / menu colonne; tabella con header ordinabili (filtra → sort → max 50); popover **Colonne**; Esc menu vs picker (`bindHotkeys` + GIS). **Non:** favorite, Step E, mostra mappa. Test browser: **non eseguiti**. **Monolite non committato.** Inbox: **`docs/orchestrator/inbox/2026-05-01_1240_riepilogo_pass5-stepD2-astro-waypoint-columns-sort-local.md`**. Commit memoria: **`docs: memoria Pass 5 Step D2 waypoint columns sort local`**.

2026-05-01 — **Pass 5 Step D.1 — Astro waypoint picker campi + tooltip (monolite solo locale):** in **`coordinate_converter Claude.html`** — `astroIndexPickerWaypoints` / `astroFillWaypointPicker` arricchiti (coord, MGRS, `formatWaypointTableWhen`, note/meta, icona, `detailTitle` creato/aggiornato, ricerca estesa); tooltip Astro via **`data-i18n-tip`** / **`syncI18nInRoot`** su `#astroPanel` e picker; **`gisRefreshI18n`** aggiorna picker aperto. **Non:** favorite, Step E, mostra mappa. Test browser: **non eseguiti**. **Monolite non committato.** Inbox: **`docs/orchestrator/inbox/2026-05-01_1212_riepilogo_pass5-stepD1-astro-waypoint-fields-tooltips-local.md`**. Commit memoria: **`docs: memoria Pass 5 Step D1 waypoint fields tooltips local`**.

2026-05-01 — **Pass 5 Step D — Astro waypoint chooser (monolite solo locale):** in **`coordinate_converter Claude.html`** — sorgente **`data-astro-src="waypoint"`**, dialog **`#astroWaypointPicker`** (ricerca, lista max 50, Usa → `state.astro` `waypoint` + `astroSyncPosUI` / `runAstroPanelUI`), Esc in **`bindHotkeys`** + GIS; **`astroIndexPickerWaypoints`** / fill / open / close / apply / **`ensureAstroWaypointPickerWired`** in **`gisInit`**. **Non implementati:** favorite, «Mostra sulla mappa», Step E. Test browser: **non eseguiti** (checklist in inbox). **Monolite non committato.** Inbox: **`docs/orchestrator/inbox/2026-05-01_1149_riepilogo_pass5-stepD-astro-waypoint-chooser-local.md`**. Commit memoria: **`docs: memoria Pass 5 Step D Astro waypoint local`**.

2026-05-01 — **Fix bug Step C — Esc pick Astro + Range Rings non chiude Astro (monolite solo locale):** in **`coordinate_converter Claude.html`** — Esc in `bindHotkeys` per Astro pick usa `stopImmediatePropagation()` per non arrivare al listener “GIS modali”; `activateToolPanel()` non auto-chiude più Astro quando si cambia tool; `closeToolsModal()` non chiude più Astro (Range Rings può convivere). In pick RR disarmo Astro pick con `astroClearPickCenterMode("rr")`. Test browser: **non eseguiti** (checklist in inbox). **Monolite non committato.** Inbox: **`docs/orchestrator/inbox/2026-05-01_1038_riepilogo_pass5-stepC-astro-esc-rr-fix-local.md`**. Commit memoria: **`docs: memoria fix Astro Esc e Range Rings local`**.

2026-05-01 — **Pass 5 Step C — Astro map pick `mapPick` (monolite solo locale):** in **`coordinate_converter Claude.html`** — sorgente **Scegli sulla mappa** (`data-astro-src="mapPick"`), `astroEnterPickCenterMode` / `astroClearPickCenterMode` / `astroApplyPickedMapPoint`, ramo **`onUp`** prima di `mapPickMode` conversione, Esc + flag `_astroSkipNextGisPanelClose`, CSS **`astro-pick-mode`**, i18n Step C; disarm concorrenti (RR pick, track/waypoint pick, misura, map pick conversione). **Nessun** `lastResult` / cronologia / permalink / `renderResults` nel pick. **Non implementati:** waypoint/favorite, Mostra mappa, Step D/E. Test browser: **non eseguiti** (checklist in inbox). **`coordinate_converter Claude.html` non committato.** Inbox: **`docs/orchestrator/inbox/2026-05-01_1007_riepilogo_pass5-stepC-astro-map-pick-local.md`**. Commit memoria: **`docs: memoria Pass 5 Step C Astro map pick local`**.

2026-05-01 — **Fix resize `#astroPanel` (solo CSS, monolite locale):** causa: handle resize **senza regole di ancoraggio agli angoli** (a differenza di `#rangeRingsPanel` e altri pannelli floating); aggiunto blocco CSS speculare a RR. **JS invariato.** Test browser: checklist manuale. Memoria: **`docs/orchestrator/inbox/2026-05-01_0946_riepilogo_pass5-stepB-astro-resize-fix-local.md`**. Commit: **`docs: memoria fix resize Astro panel local`**. **`coordinate_converter Claude.html` non committato.**

2026-05-01 — **Pass 5 Step B — Astro floating `#astroPanel` (monolite solo locale):** in **`coordinate_converter Claude.html`** — dialog dedicato GIS, sorgenti **result** + **mapCenter** (`state.viewCenter`), `runAstroCore` / `runAstroPanelUI`, **`runAstroUI`** di nuovo solo su **`state.lastResult`** per **`#sec-astro`**; drag/resize/clamp parziale stile RR; Esc + `closeToolsModal`; i18n Step B. **Test browser non eseguiti** (checklist in inbox). **`coordinate_converter Claude.html` non committato** qui. Inbox: **`docs/orchestrator/inbox/2026-05-01_0932_riepilogo_pass5-stepB-astro-floating-panel-local.md`**. Commit memoria: **`docs: memoria Pass 5 Step B Astro floating panel local`**.

2026-05-01 — **Rule 30 — prompt operativi autosufficienti:** aggiornata **`.cursor/rules/30-output-workflow.mdc`** (sezione anti micro-pass di sola verifica: stesso intervento = implementazione + QA standard + test browser se possibile + autosync orchestratore + RIEPILOGO; eccezioni esplicite). **`coordinate_converter Claude.html` non modificato.** Memoria: **`docs/orchestrator/inbox/2026-05-01_0902_riepilogo_rule-operative-prompts-self-contained.md`**. Commit: **`docs: rendi autosufficienti i prompt operativi`** (hash in chat dopo push).

2026-05-01 — **`finito` sessione — Pass 5 Step A versionato:** commit **`35a722a`** su **`main`** (push riuscito). **`coordinate_converter Claude.html` incluso** — `state.astro` transient, `astroPanelOpen` / `astroPickCenterMode`, `runAstroUI` da astro o `lastResult`, i18n `astro.col.utcLmt`; **`docs/checkpoint.md`** + append **`docs/session-geolocalizzazione-e-mappa.md`**. In chat: convenzione **prompt operativi** (bundle implementazione + QA + test browser + orchestratore + RIEPILOGO) registrata in doc sessione, **non** in `.cursor/rules` in questo passo. Working tree **pulito** post-push. Riconciliazione orchestratore: **`docs/orchestrator/inbox/2026-05-01_0851_riepilogo_finito-sessione.md`** (+ commit dedicato step 4).

2026-05-01 — **Verifica Pass 5 Step A (solo lettura):** marker presenti nel monolite locale (`state.astro`, `runAstroUI`, `astro.col.utcLmt`); nessun `<script src>` / `type="module"`; **2** coppie `<script>`/`</script>`; `node --check` **OK** sui **due** blocchi estratti con regex **non greedy** (il metodo greedy del `README.md` fallisce con due blocchi inline — nota in inbox). **Test browser non eseguiti** (checklist manuale in inbox). Memoria: **`docs/orchestrator/inbox/2026-05-01_0930_verifica_pass5-stepA-astro.md`**. Stato **superato** dal `finito` **`35a722a`** (monolite ora su remoto).

2026-05-01 — **Pass 5 Step A (monolite locale):** in **`coordinate_converter Claude.html`** — introdotto **`state.astro`** transient + **`astroPanelOpen`** / **`astroPickCenterMode`**; **`runAstroUI`** legge `lat`/`lon` da `state.astro` se finiti, altrimenti da **`state.lastResult`**; intestazione tabella **`astro.col.utcLmt`** (IT/EN/FR). **Nessun** `#astroPanel`, markup Astro invariato, nessun picker. **Monolite non committato** nell’autosync memoria. Dettaglio: **`docs/orchestrator/inbox/2026-05-01_0900_riepilogo_pass5-stepA-astro-state.md`**. Prossimo: **Step B** (pannello floating dedicato).

2026-05-01 — **Pass 5 — piano Astro source picker + pannello floating GIS-first:** salvato in **`docs/orchestrator/inbox/2026-05-01_0804_plan_astro-source-picker-floating-panel.md`** (piano completo: stato attuale Astro, sorgenti posizione, clone RR floating + `#rrSourcePickerDialog`, stato minimo `state.astro`, i18n, 6 step A–F, QA, rischi, raccomandazione, prompt Step A). Commit memoria: **`docs: piano astro source picker floating panel`**.

2026-05-01 — **`finito` sessione — Pass 4B SunCalc versionato:** commit **`51a9fc2`** `feat: Pass 4B — SunCalc vendored inline, fix Astro, checkpoint sessione` su **`main`** (push riuscito). **`coordinate_converter Claude.html` incluso** — script vendored SunCalc + `window.SunCalc` + fallback in **`runAstroUI`**; aggiornati **`docs/checkpoint.md`**, append **`docs/session-geolocalizzazione-e-mappa.md`**. Working tree **pulito** post-push. Riconciliazione orchestratore: **`2026-05-01_0310_riepilogo_finito-sessione.md`**. Precedenti su memoria: **`555f6c5`** (rule workflow), **`fc52438`** / **`b3cb726`** (inbox Pass4b fix mentre monolite era locale).

2026-05-01 — **Pass 4B fix Astro post-split SunCalc (monolite locale):** in **`coordinate_converter Claude.html`** — `window.SunCalc = SunCalc` dopo l’IIFE vendored; **`runAstroUI`** usa fallback `typeof SunCalc !== "undefined" ? SunCalc : window.SunCalc` per le tre chiamate API. **Motivo:** binding globale `const` cross-`<script>` vs core `"use strict"` / risoluzione inconsistente; esplicitazione su `window` + uso locale in Astro. **Monolite non committato** qui. Memoria: commit **`docs: memoria Pass4b fix Astro SunCalc post-split`**. Inbox: **`docs/orchestrator/inbox/2026-05-01_0304_riepilogo_pass4b-suncalc-local-fix.md`**.

2026-05-01 — **Rule workflow orchestratore:** aggiornata **`.cursor/rules/30-output-workflow.mdc`**: dopo **ogni** intervento operativo è **obbligatoria** la pubblicazione memoria (`latest.md` + `inbox/` + commit/push selettivo) **anche** se il monolite resta **solo locale** / **non committato** nell’autosync; l’`inbox` deve documentare modifiche locali al monolite (file, natura, test, `git status`, motivo esclusione, prossimo passo). La pubblicazione **non** autorizza il commit del monolite. **Eccezione** solo se l’utente dice esplicitamente «non aggiornare orchestratore» o «solo locale, non pubblicare memoria». Commit: **`docs: rendi obbligatoria memoria orchestratore post-intervento`**. **`coordinate_converter Claude.html` non incluso** in questo commit; se risulta `M` in working tree, è **stato locale separato** (non descritto da questo intervento).

2026-05-01 — **Pass 4A piano Tier 1 vendored split salvato:** solo documentazione in **`docs/orchestrator/inbox/2026-05-01_0241_plan_tier1-vendored-split.md`** (piano completo: candidati SunCalc/WMM/OLC/QR §26, rischi, architettura Tier 1, step incrementali, QA, rollback, prompt Step 1 SunCalc). **Nessuna implementazione**; **`coordinate_converter Claude.html` non modificato**. Primo candidato consigliato: **SunCalc**. **Attesa conferma utente** prima di toccare il monolite. Commit: **`docs: piano tier1 vendored split (Pass 4A)`**.

2026-05-01 — **Pass 3 (feature storiche / OPSEC strict / valutazione §4.8):** commit **`docs: consolida OPSEC e valutazione file size`** (`5097f98`). Inbox: **`docs/orchestrator/inbox/2026-05-01_0221_riepilogo_pass3-opsec-file-size.md`**.

2026-04-30 — **Pass 2 (persistenza / cap array):** commit **`docs: consolida persistenza e cap array`** (`e23acba`). Inbox: **`docs/orchestrator/inbox/2026-04-30_1815_riepilogo_pass2-persistenza-cap.md`**.

## Ultimo intervento Cursor

**Pass 5 Step E — Astro favorite chooser** — picker tabellare allineato a D.2; monolite **solo locale**; memoria orchestratore in commit dedicato (senza monolite).

## File modificati (sintesi)

- **Locale:** `coordinate_converter Claude.html` — Step B/C/D/D.1/D.2 + **Step E** (non in commit memoria).
- **Versionato (commit memoria):** `docs/orchestrator/latest.md`, `docs/orchestrator/inbox/2026-05-01_1300_riepilogo_pass5-stepE-astro-favorite-chooser-local.md`.
- Precedente inbox D.2: **`2026-05-01_1240_...`**.

## Prossimo passo consigliato

Smoke manuale Step E (favoriti, colonne, sort, Esc, Calcola); eventuale commit monolite; **`finito`** a fine giornata se serve.

## Dettagli (inbox)

- **Pass 5 Step E favorite chooser (locale):** `docs/orchestrator/inbox/2026-05-01_1300_riepilogo_pass5-stepE-astro-favorite-chooser-local.md`
- **Pass 5 Step D.2 colonne + sort (locale):** `docs/orchestrator/inbox/2026-05-01_1240_riepilogo_pass5-stepD2-astro-waypoint-columns-sort-local.md`
- **Pass 5 Step D.1 campi + tooltip (locale):** `docs/orchestrator/inbox/2026-05-01_1212_riepilogo_pass5-stepD1-astro-waypoint-fields-tooltips-local.md`
- **Pass 5 Step D waypoint chooser (locale):** `docs/orchestrator/inbox/2026-05-01_1149_riepilogo_pass5-stepD-astro-waypoint-chooser-local.md`
- **Fix bug Step C (Esc + RR):** `docs/orchestrator/inbox/2026-05-01_1038_riepilogo_pass5-stepC-astro-esc-rr-fix-local.md`
- **Pass 5 Step C map pick (locale):** `docs/orchestrator/inbox/2026-05-01_1007_riepilogo_pass5-stepC-astro-map-pick-local.md`
- **Fix resize Astro:** `docs/orchestrator/inbox/2026-05-01_0946_riepilogo_pass5-stepB-astro-resize-fix-local.md`
- **Pass 5 Step B (locale):** `docs/orchestrator/inbox/2026-05-01_0932_riepilogo_pass5-stepB-astro-floating-panel-local.md`
- **Rule prompt autosufficienti:** `docs/orchestrator/inbox/2026-05-01_0902_riepilogo_rule-operative-prompts-self-contained.md`
- **Verifica Step A:** `docs/orchestrator/inbox/2026-05-01_0930_verifica_pass5-stepA-astro.md`
- **Pass 5 Step A implementato (monolite locale):** `docs/orchestrator/inbox/2026-05-01_0900_riepilogo_pass5-stepA-astro-state.md`
- **Pass 5 piano Astro source picker + floating:** `docs/orchestrator/inbox/2026-05-01_0804_plan_astro-source-picker-floating-panel.md`
- **`finito` sessione 2026-05-01:** `docs/orchestrator/inbox/2026-05-01_0310_riepilogo_finito-sessione.md`
- **Pass4b Astro SunCalc fix (locale):** `docs/orchestrator/inbox/2026-05-01_0304_riepilogo_pass4b-suncalc-local-fix.md`
- **Rule orchestratore / monolite locale:** `docs/orchestrator/inbox/2026-05-01_0253_riepilogo_rule-orchestrator-local-work.md`
- **Pass 4A piano Tier 1 vendored split:** `docs/orchestrator/inbox/2026-05-01_0241_plan_tier1-vendored-split.md`
- **Pass 3 OPSEC / §4.8:** `docs/orchestrator/inbox/2026-05-01_0221_riepilogo_pass3-opsec-file-size.md`
- **Pass 2 persistenza/cap:** `docs/orchestrator/inbox/2026-04-30_1815_riepilogo_pass2-persistenza-cap.md`
- **Pass 1.5 audit numerico:** `docs/orchestrator/inbox/2026-05-01_0157_riepilogo_pass1_5-verifica-audit-numerico.md`
