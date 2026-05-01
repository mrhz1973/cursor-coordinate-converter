# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-05-01 — **Pass 5 — piano Astro source picker + pannello floating GIS-first:** salvato in **`docs/orchestrator/inbox/2026-05-01_0804_plan_astro-source-picker-floating-panel.md`** (piano completo: stato attuale Astro, sorgenti posizione, clone RR floating + `#rrSourcePickerDialog`, stato minimo `state.astro`, i18n, 6 step A–F, QA, rischi, raccomandazione, prompt Step A). **Nessuna implementazione**; **`coordinate_converter Claude.html` non modificato**. Primo step consigliato: **Step A — refactor minimo `runAstroUI`**. **Attesa conferma utente** prima del monolite (e conferma architettura floating vs inline prima di Step B). Commit memoria: **`docs: piano astro source picker floating panel`**.

2026-05-01 — **`finito` sessione — Pass 4B SunCalc versionato:** commit **`51a9fc2`** `feat: Pass 4B — SunCalc vendored inline, fix Astro, checkpoint sessione` su **`main`** (push riuscito). **`coordinate_converter Claude.html` incluso** — script vendored SunCalc + `window.SunCalc` + fallback in **`runAstroUI`**; aggiornati **`docs/checkpoint.md`**, append **`docs/session-geolocalizzazione-e-mappa.md`**. Working tree **pulito** post-push. Riconciliazione orchestratore: **`2026-05-01_0310_riepilogo_finito-sessione.md`**. Precedenti su memoria: **`555f6c5`** (rule workflow), **`fc52438`** / **`b3cb726`** (inbox Pass4b fix mentre monolite era locale).

2026-05-01 — **Pass 4B fix Astro post-split SunCalc (monolite locale):** in **`coordinate_converter Claude.html`** — `window.SunCalc = SunCalc` dopo l’IIFE vendored; **`runAstroUI`** usa fallback `typeof SunCalc !== "undefined" ? SunCalc : window.SunCalc` per le tre chiamate API. **Motivo:** binding globale `const` cross-`<script>` vs core `"use strict"` / risoluzione inconsistente; esplicitazione su `window` + uso locale in Astro. **Monolite non committato** qui. Memoria: commit **`docs: memoria Pass4b fix Astro SunCalc post-split`**. Inbox: **`docs/orchestrator/inbox/2026-05-01_0304_riepilogo_pass4b-suncalc-local-fix.md`**.

2026-05-01 — **Rule workflow orchestratore:** aggiornata **`.cursor/rules/30-output-workflow.mdc`**: dopo **ogni** intervento operativo è **obbligatoria** la pubblicazione memoria (`latest.md` + `inbox/` + commit/push selettivo) **anche** se il monolite resta **solo locale** / **non committato** nell’autosync; l’`inbox` deve documentare modifiche locali al monolite (file, natura, test, `git status`, motivo esclusione, prossimo passo). La pubblicazione **non** autorizza il commit del monolite. **Eccezione** solo se l’utente dice esplicitamente «non aggiornare orchestratore» o «solo locale, non pubblicare memoria». Commit: **`docs: rendi obbligatoria memoria orchestratore post-intervento`**. **`coordinate_converter Claude.html` non incluso** in questo commit; se risulta `M` in working tree, è **stato locale separato** (non descritto da questo intervento).

2026-05-01 — **Pass 4A piano Tier 1 vendored split salvato:** solo documentazione in **`docs/orchestrator/inbox/2026-05-01_0241_plan_tier1-vendored-split.md`** (piano completo: candidati SunCalc/WMM/OLC/QR §26, rischi, architettura Tier 1, step incrementali, QA, rollback, prompt Step 1 SunCalc). **Nessuna implementazione**; **`coordinate_converter Claude.html` non modificato**. Primo candidato consigliato: **SunCalc**. **Attesa conferma utente** prima di toccare il monolite. Commit: **`docs: piano tier1 vendored split (Pass 4A)`**.

2026-05-01 — **Pass 3 (feature storiche / OPSEC strict / valutazione §4.8):** commit **`docs: consolida OPSEC e valutazione file size`** (`5097f98`). Inbox: **`docs/orchestrator/inbox/2026-05-01_0221_riepilogo_pass3-opsec-file-size.md`**.

2026-04-30 — **Pass 2 (persistenza / cap array):** commit **`docs: consolida persistenza e cap array`** (`e23acba`). Inbox: **`docs/orchestrator/inbox/2026-04-30_1815_riepilogo_pass2-persistenza-cap.md`**.

## Ultimo intervento Cursor

**Pass 5 (solo piano)** — Astro/SunCalc: source picker + pannello floating; memoria orchestratore aggiornata; monolite **non** toccato.

## File modificati (sintesi)

- `docs/orchestrator/latest.md`, `docs/orchestrator/inbox/2026-05-01_0804_plan_astro-source-picker-floating-panel.md` (commit memoria corrente).

## Prossimo passo consigliato

Conferma utente su **Step A** (`state.astro` + `runAstroUI`); prima di **Step B** confermare **pannello floating dedicato** vs estensione inline di `#sec-astro`. In parallelo: **Pass 4B Step 2** (WMM vendored) resta sul backlog Tier 1 se prioritario.

## Dettagli (inbox)

- **Pass 5 piano Astro source picker + floating:** `docs/orchestrator/inbox/2026-05-01_0804_plan_astro-source-picker-floating-panel.md`
- **`finito` sessione 2026-05-01:** `docs/orchestrator/inbox/2026-05-01_0310_riepilogo_finito-sessione.md`
- **Pass4b Astro SunCalc fix (locale):** `docs/orchestrator/inbox/2026-05-01_0304_riepilogo_pass4b-suncalc-local-fix.md`
- **Rule orchestratore / monolite locale:** `docs/orchestrator/inbox/2026-05-01_0253_riepilogo_rule-orchestrator-local-work.md`
- **Pass 4A piano Tier 1 vendored split:** `docs/orchestrator/inbox/2026-05-01_0241_plan_tier1-vendored-split.md`
- **Pass 3 OPSEC / §4.8:** `docs/orchestrator/inbox/2026-05-01_0221_riepilogo_pass3-opsec-file-size.md`
- **Pass 2 persistenza/cap:** `docs/orchestrator/inbox/2026-04-30_1815_riepilogo_pass2-persistenza-cap.md`
- **Pass 1.5 audit numerico:** `docs/orchestrator/inbox/2026-05-01_0157_riepilogo_pass1_5-verifica-audit-numerico.md`
