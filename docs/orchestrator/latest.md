# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-05-01 — **Pass 4B fix Astro post-split SunCalc (monolite locale):** in **`coordinate_converter Claude.html`** — `window.SunCalc = SunCalc` dopo l’IIFE vendored; **`runAstroUI`** usa fallback `typeof SunCalc !== "undefined" ? SunCalc : window.SunCalc` per le tre chiamate API. **Motivo:** binding globale `const` cross-`<script>` vs core `"use strict"` / risoluzione inconsistente; esplicitazione su `window` + uso locale in Astro. **Monolite non committato** qui. Memoria: commit **`docs: memoria Pass4b fix Astro SunCalc post-split`**. Inbox: **`docs/orchestrator/inbox/2026-05-01_0304_riepilogo_pass4b-suncalc-local-fix.md`**.

2026-05-01 — **Rule workflow orchestratore:** aggiornata **`.cursor/rules/30-output-workflow.mdc`**: dopo **ogni** intervento operativo è **obbligatoria** la pubblicazione memoria (`latest.md` + `inbox/` + commit/push selettivo) **anche** se il monolite resta **solo locale** / **non committato** nell’autosync; l’`inbox` deve documentare modifiche locali al monolite (file, natura, test, `git status`, motivo esclusione, prossimo passo). La pubblicazione **non** autorizza il commit del monolite. **Eccezione** solo se l’utente dice esplicitamente «non aggiornare orchestratore» o «solo locale, non pubblicare memoria». Commit: **`docs: rendi obbligatoria memoria orchestratore post-intervento`**. **`coordinate_converter Claude.html` non incluso** in questo commit; se risulta `M` in working tree, è **stato locale separato** (non descritto da questo intervento).

2026-05-01 — **Pass 4A piano Tier 1 vendored split salvato:** solo documentazione in **`docs/orchestrator/inbox/2026-05-01_0241_plan_tier1-vendored-split.md`** (piano completo: candidati SunCalc/WMM/OLC/QR §26, rischi, architettura Tier 1, step incrementali, QA, rollback, prompt Step 1 SunCalc). **Nessuna implementazione**; **`coordinate_converter Claude.html` non modificato**. Primo candidato consigliato: **SunCalc**. **Attesa conferma utente** prima di toccare il monolite. Commit: **`docs: piano tier1 vendored split (Pass 4A)`**.

2026-05-01 — **Pass 3 (feature storiche / OPSEC strict / valutazione §4.8):** commit **`docs: consolida OPSEC e valutazione file size`** (`5097f98`). Inbox: **`docs/orchestrator/inbox/2026-05-01_0221_riepilogo_pass3-opsec-file-size.md`**.

2026-04-30 — **Pass 2 (persistenza / cap array):** commit **`docs: consolida persistenza e cap array`** (`e23acba`). Inbox: **`docs/orchestrator/inbox/2026-04-30_1815_riepilogo_pass2-persistenza-cap.md`**.

## Ultimo intervento Cursor

**Pass 4B** — correzione runtime Astro dopo split SunCalc (`window.SunCalc` + fallback in `runAstroUI`); monolite ancora **solo locale** finché non si fa commit dedicato.

## File modificati (sintesi)

- `coordinate_converter Claude.html` (locale), `docs/orchestrator/latest.md`, `docs/orchestrator/inbox/2026-05-01_0304_riepilogo_pass4b-suncalc-local-fix.md`

## Prossimo passo consigliato

**QA browser** su Astro + self-check SunCalc; poi **commit/push del monolite** (split Step 1 + fix) o rollback se non conforme; **`finito`** solo se richiesto.

## Dettagli (inbox)

- **Pass4b Astro SunCalc fix (locale):** `docs/orchestrator/inbox/2026-05-01_0304_riepilogo_pass4b-suncalc-local-fix.md`
- **Rule orchestratore / monolite locale:** `docs/orchestrator/inbox/2026-05-01_0253_riepilogo_rule-orchestrator-local-work.md`
- **Pass 4A piano Tier 1 vendored split:** `docs/orchestrator/inbox/2026-05-01_0241_plan_tier1-vendored-split.md`
- **Pass 3 OPSEC / §4.8:** `docs/orchestrator/inbox/2026-05-01_0221_riepilogo_pass3-opsec-file-size.md`
- **Pass 2 persistenza/cap:** `docs/orchestrator/inbox/2026-04-30_1815_riepilogo_pass2-persistenza-cap.md`
- **Pass 1.5 audit numerico:** `docs/orchestrator/inbox/2026-05-01_0157_riepilogo_pass1_5-verifica-audit-numerico.md`
