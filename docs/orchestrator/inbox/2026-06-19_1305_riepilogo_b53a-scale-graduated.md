# Riepilogo — WU-0009B B5.3a scala senza toggle + barre graduate

**Data:** 2026-06-19  
**Base remota:** `cfa59fe`  
**Task:** B5.3a — rimozione toggle m/km + barre graduate 10 tacche CSS

---

## Autosync orchestratore

- **Eseguito:** sì (post-commit)
- **Monolite nel commit autosync:** escluso (commit runtime dedicato)
- **Push:** da verificare post-commit

---

## Riepilogo tecnico

1. **Rimosso toggle m/km:** nodo `<button data-role="scale-unit-cycle">`, handler, `state.scaleUnit`, `buildScaleUnitCycleTooltip`, i18n `tip.scaleUnitCycle*`, CSS `.tile-scale-unit-btn`
2. **Scala metrica sempre km:** `formatScaleMetricDisplay(pickM, "km")` — helper `formatScaleMetricDisplay` e `formatScaleDistanceMi` **mantenuti**
3. **Barre graduate:** 10 tacche uniformi via `repeating-linear-gradient` + `--scale-step: barPx/10` su barra metrica e Nm; zero nodi DOM extra per tacca
4. **Label centrale:** valore/2 al 50% (`formatScaleKmCenter`, `formatScaleNmLabel(pickNm/2)`); nascosta su mobile GIS (`display:none`)
5. **Legenda decorativa:** container `aria-hidden="true"` (nessun controllo interattivo)
6. **Preservati:** mi secondario, Nm, ratio 1:N, containment mobile B5.2
7. **Non toccato:** `exportMapAsJpg()` — backlog **B5.4** annotato in roadmap (export JPEG scala opzionale su canvas 2D)

---

## Controlli eseguiti

- Pre-flight: `HEAD == origin/main == cfa59fe`, working tree pulito
- `node --check` su 2 script inline: **OK**
- Static: nessun `scale-unit-cycle`, `scaleUnit`, `buildScaleUnitCycleTooltip`, `tile-scale-unit-btn`
- Static: `formatScaleMetricDisplay`, `formatScaleDistanceMi` presenti
- Static: diff monolite non tocca OPSEC/proxy/waypoint/export JPEG
- **Test browser:** non eseguiti

---

## pass_operatore

**non-attestato** — QA visuale bundlata B5.1+B5.2+B5.3/B5.3a pending

---

## Checklist QA manuale

### Desktop
- [ ] Toggle ⇄ assente
- [ ] Scala sempre km + mi secondario
- [ ] Barra Nm + ratio 1:N
- [ ] Tacche graduate visibili (10 segmenti)
- [ ] Label centrale visibile se non sporca UI
- [ ] Zoom aggiorna valori
- [ ] Readout/coord-cycle invariato

### Mobile/iPhone
- [ ] Scala nel viewport, no overlap readout
- [ ] Label centrale nascosta
- [ ] Mappa usabile

---

## Commit attesi

1. `feat(gis): remove scale m/km toggle; add graduated scale bars (B5.3a)` — monolite
2. `docs: OM §7 — B5.3a scale graduated bars PASS tecnico` — OM + roadmap B5.4 backlog
3. `docs: orchestratore + LAST_CURSOR_REPORT — B5.3a scale graduated bars` — autosync
