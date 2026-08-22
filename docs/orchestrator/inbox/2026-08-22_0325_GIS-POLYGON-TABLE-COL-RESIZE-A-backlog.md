# BACKLOG — GIS-POLYGON-TABLE-COL-RESIZE-A

**ID:** `GIS-POLYGON-TABLE-COL-RESIZE-A`  
**Stato:** **CONSUMED / IMPLEMENTED** nel blocco omonimo (2026-08-22) — candidate tip `28e87f6…` · build **250** · blob `1482ead…` · **GATE: QA FINALE CHATGPT — PENDING**  
**Casa primaria:** [`docs/work-units/WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) (Map UX / Poligoni)  
**Evidence:** [`2026-08-22_0325_GIS-POLYGON-TABLE-COL-RESIZE-A_deploy-abqa.md`](2026-08-22_0325_GIS-POLYGON-TABLE-COL-RESIZE-A_deploy-abqa.md) · ABQA [`2026-08-22_0325_GIS-POLYGON-TABLE-COL-RESIZE-A-abqa.json`](2026-08-22_0325_GIS-POLYGON-TABLE-COL-RESIZE-A-abqa.json)  
**Nota:** registrato al momento del consumo (nessun backlog NOT OPENED preesistente). Storico preservato.

## Problema

Colonne lista Poligoni non restringibili abbastanza (`min-width:756px` tabella, `min-width:120px` Nome/Azioni, clamp max drag prematuri) → compressione/collisione Area–Perimetro invece di distribuzione.

## Fix implementato

- Rimosso floor `756px`; `col`/`cell` min-width 0; Nome ellipsis; mins JS utili (Nome 48, Area/Perim 48, …); drag `maxW ≥ startW`.
- Session-only su `#polygonPanelList` (invariato). Nessun localStorage.
