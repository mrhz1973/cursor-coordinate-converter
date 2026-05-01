# Riepilogo — Fix bug Step C (Astro pick Esc + Range Rings) — monolite locale

**Data:** 2026-05-01 (`2026-05-01_1038`)  
**Scope:** solo bugfix su Pass 5 Step C; nessuna Step D/E; nessun chooser waypoint/favorite; monolite **locale** (non committato).

## Bug osservati

1. **Esc durante “Scegli sulla mappa” chiude `#astroPanel`.** Atteso: Esc annulla solo il pick e lascia `#astroPanel` aperto; solo un secondo Esc (pick non attivo) può chiudere il pannello.
2. **Aprire Range Rings mentre Astro è aperto chiude Astro.** Atteso: Range Rings non deve chiudere `#astroPanel`; i due pannelli devono poter convivere.

## Causa individuata

- **Bug 1 (Esc):** esistono **due** listener `keydown` per `Escape` (uno in `bindHotkeys`, uno nel handler “GIS modali”). Il ramo Astro-pick in `bindHotkeys` faceva `preventDefault()` ma l’evento continuava e veniva intercettato dal secondo listener che chiudeva `#astroPanel`.
- **Bug 2 (Range Rings):** l’apertura Range Rings usa `openRangeRingsFloatingPanelGis()` che chiama `closeToolsModal()`. La precedente `closeToolsModal()` chiudeva anche Astro se `state.toolsMenuOpen === "astro"`, quindi **aprire Range Rings** (o chiudere il tools drawer) causava la chiusura di `#astroPanel`. Inoltre `activateToolPanel()` chiudeva Astro quando si cambiava tool.

## Fix applicato (minimo)

- **Esc pick Astro:** nel ramo `if (state.astroPickCenterMode)` in `bindHotkeys` aggiunto `ev.stopImmediatePropagation()` (fallback a `stopPropagation`) dopo `preventDefault`, così lo stesso Esc **non** arriva al listener “GIS modali” e non chiude `#astroPanel`.
- **Coesistenza Range Rings + Astro:**  
  - in `activateToolPanel()` rimosso l’auto-close di Astro quando si cambia tool (Astro resta un pannello floating indipendente).  
  - in `closeToolsModal()` rimosso lo special-case che chiudeva Astro quando `toolsMenuOpen === "astro"`: chiudere la UI strumenti non deve chiudere `#astroPanel`.
- **Disarmo pick:** quando si entra in pick Range Rings (`rangeRingsEnterPickCenterMode` / `rangeRingsEnterPickAndCreateMode`) viene disarmato l’Astro pick con `astroClearPickCenterMode("rr")` (disarmo senza chiudere il pannello Astro).

## Vincoli confermati

- **Nessuna** scrittura a `state.lastResult` dal pick Astro.
- **Nessuna** cronologia, permalink, `renderResults` nel flusso pick Astro.
- Nessun cambiamento a SunCalc/WMM/OLC/QR, OPSEC/geocoding/tile/IndexedDB, persistenza/localStorage.
- Nessun `<script src>` e nessun `type="module"`.

## File modificati

- **Locale (non committato):** `coordinate_converter Claude.html`
- **Versionato (commit memoria):** `docs/orchestrator/latest.md`, `docs/orchestrator/inbox/2026-05-01_1038_riepilogo_pass5-stepC-astro-esc-rr-fix-local.md`

## Verifiche automatiche

- `git status --short`: `M coordinate_converter Claude.html`
- `git diff --stat`: 1 file, monolite locale
- `<script` / `</script>`: 2 / 2
- `<script src>`: assente
- `type="module"`: assente
- `node --check` sui 2 blocchi inline estratti con regex non greedy: **OK**

## Test browser

- **Non eseguiti** in questa sessione. Checklist manuale:
  1) GIS → Strumenti → Astro → “Scegli sulla mappa” → **Esc**: pick annullato, pannello aperto; **Esc** di nuovo: pannello chiuso.  
  2) Apri Astro → apri Range Rings: entrambi aperti; attiva pick RR: Astro pick disarmato se attivo, pannello Astro resta aperto.  
  3) Verifica result/mapCenter/mapPick ancora OK, resize/drag RR + Astro, console senza errori.

## Prossimo passo

- Smoke manuale su browser dei due bugfix; poi valutare Step D o `finito` a fine giornata (quando autorizzato).

