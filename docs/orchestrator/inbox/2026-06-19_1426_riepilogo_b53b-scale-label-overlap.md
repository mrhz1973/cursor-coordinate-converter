# Riepilogo — WU-0009B B5.3b fix overlap label scala metrica

**Data:** 2026-06-19  
**Base remota:** `989609e`  
**Task:** B5.3b — fix overlap label centrale vs caption metrica

---

## Diagnosi

La label centrale (es. `1000 km`) usava `position:absolute; top:100%` sul `.tile-scale-bar-wrap`: con `padding-bottom:10px` il testo usciva dal box riservato e si sovrapponeva alla caption principale (`2000 km · 1242.7 mi`) a causa del `gap:2px` insufficiente tra bar-row e `.tile-scale-labels`.

## Fix applicato (solo CSS)

1. **Mid-label in flow:** `.tile-scale-bar-wrap` flex column `align-items:center`; rimosso `position:absolute` da `.tile-scale-mid-label`
2. **Spacing:** `.tile-scale` padding/gap/line-height leggermente aumentati; `.tile-scale-row-metric` gap 4px
3. **Mobile:** label centrale ancora `display:none` su GIS mobile; rimosso hack `padding-bottom:0` obsoleto

## Invariato

- Calcoli scala, snap 1-2-5, toggle assente, km+mi+Nm+ratio, tacche CSS, `exportMapAsJpg()`, OPSEC/proxy/waypoint

## Controlli

- `node --check`: OK
- Toggle/scaleUnit: assenti
- Diff: solo CSS scala (~28 righe monolite)

## pass_operatore

**non-attestato**

## Commit attesi

1. `fix(gis): resolve metric scale label overlap (B5.3b)` — monolite
2. `docs: OM §7 — B5.3b scale label overlap PASS tecnico`
3. `docs: orchestratore + LAST_CURSOR_REPORT — B5.3b scale label overlap`
