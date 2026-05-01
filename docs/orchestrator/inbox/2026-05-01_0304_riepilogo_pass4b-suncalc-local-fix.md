# Riepilogo — Pass 4B: fix runtime Astro dopo split SunCalc (monolite solo locale)

**Timestamp:** 2026-05-01_0304  
**Commit memoria (previsto):** messaggio `docs: memoria Pass4b fix Astro SunCalc post-split`

## Bug riscontrato

Dopo **Pass 4B Step 1** (SunCalc in `<script>` vendored separato prima del core con `"use strict"`), dalla UI **Strumenti → Astro**, inserendo la data e cliccando **«Calcola»**, **non comparivano risultati** (tabella sole/luna assente o handler che non popola `#astro-result`).

## Diagnosi (motivo più probabile)

- Il core è uno script **strict**; SunCalc era esposto come **`const SunCalc`** nello script vendored precedente. In alcuni ambienti la risoluzione dell’identificatore globale **`SunCalc`** dal codice strict nello script successivo può **non** allinearsi al binding `const` dello script precedente come ci si aspetta da un unico blocco monolitico.
- In parallelo, **`runAstroUI`** fa **return silenzioso** se manca `state.lastResult` (nessun punto da conversione corrente): sintomo simile (“nulla succede”) se l’utente non ha ancora convertito; in questo intervento si è comunque indurito il percorso verso l’API SunCalc.

## Fix applicato (solo monolite, locale)

File: **`coordinate_converter Claude.html`** (non committato in questo step memoria).

1. **Dopo l’IIFE vendored:** `window.SunCalc = SunCalc;` + commento (senza sottostringa letterale `<script` nei commenti, per evitare falsi positivi nei grep).
2. **`runAstroUI`:** `const sc = (typeof SunCalc !== "undefined" ? SunCalc : window.SunCalc);` e uso di **`sc.getTimes` / `sc.getMoonTimes` / `sc.getMoonIllumination`** al posto di `SunCalc.*` solo in quella funzione (pulsante Calcola Astro).

**Non** duplicato il blocco SunCalc; **non** spostato SunCalc nel core; **non** toccati WMM/OLC/QR/i18n/`state` schema.

## Test eseguiti (automatici)

- `grep` assenza `<script…src` e `type="module"`.
- Conteggio `<script>` / `</script>` bilanciato (2/2).
- Estratto script vendored → `node --check /tmp/suncalc-vendored-check.js` → OK.
- `grep` occorrenze `SunCalc` (incluso `window.SunCalc`).

## Test browser

**Non eseguito** da questa sessione (nessun browser avviato).

## `git status --short` (tipico post-fix, monolite non in commit memoria)

Atteso: ` M "coordinate_converter Claude.html"` e nessun altro file modificato per questo fix; dopo commit orchestratore: monolite ancora **`M`** finché non si fa commit separato.

## Monolite e commit

- **`coordinate_converter Claude.html`:** modificato **solo in locale**; **NON incluso** nel commit/push della memoria orchestratore di questo intervento.
- **Motivo esclusione:** richiesta esplicita workflow — pubblicazione memoria obbligatoria **senza** versionare il monolite nello stesso commit.

## File toccati da questo intervento Cursor

- `coordinate_converter Claude.html` (fix).
- `docs/orchestrator/latest.md` (sintesi).
- `docs/orchestrator/inbox/2026-05-01_0304_riepilogo_pass4b-suncalc-local-fix.md` (questo file).

## File non toccati

- `docs/*` escluso orchestratore sopra.
- `.cursor/rules/*`.
- Altri path non elencati.

## Prossimo passo consigliato

1. **Smoke test browser:** Strumenti → Astro, data, **punto da ultima conversione** (`state.lastResult`), Calcola → tabella visibile; console senza `ReferenceError: SunCalc is not defined`.
2. **Review** diff monolite; poi **commit dedicato** del monolite (o rollback) e/o **`finito`** quando appropriato.
