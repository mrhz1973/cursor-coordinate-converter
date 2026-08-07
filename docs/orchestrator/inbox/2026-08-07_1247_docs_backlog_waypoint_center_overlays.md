# DOCS-BACKLOG-WAYPOINT-CENTER-MAP-OVERLAYS-A — registrazione backlog

**Data:** 2026-08-07  
**Tipo:** DOCS-ONLY  
**Gate:** CLOSED / PASS docs-only

## Baseline

- Avvio: `c702d89612fa5e5e336d6bdb4fc32cac4a5ddaa7` (HEAD = origin/main = ls-remote; divergenza 0 0)
- Monolite: **non** modificato; tip runtime QA’d resta **`a0a6816`** / build **138**

## Cosa è stato registrato

### WAYPOINT-EDITOR-CENTER-A — BACKLOG / NOT OPENED

CTA secondaria **Centra** in editor Nuovo/Modifica waypoint sulla lat/lon canonica del draft/editor. Contratto futuro: nuovo+modifica; no Salva richiesto; no mutazione `mapWaypoints`; no salva implicito; no auto-center paste/input; invalido → disabled/no-op; riuso helper center (viewport-aware preferito); no nuova persistenza. Categoria futura ROUTINE / DELICATO leggero da confermare. **Non** next; **non** runtime.

### MAP-TRANSPARENT-OVERLAY-STACK-A — BACKLOG / NOT OPENED

Overlay trasparenti Layers sopra basemap (tipo SAS.Planet). Famiglie A labels/annotation + B thematic (es. Strava Heatmap). Precedenti `SEAMARK_OVERLAY` / `SONARCHART_OVERLAY`. Contratto OPSEC/offline/gate/cache/licensing. Categoria **DELICATO** — prima DIAGNOSTIC/PLAN. **Fuori WU-0012**. **Non** next; **non** runtime.

## Preservato

- COORD-MODAL-FORMAT-COPY-A (+ FIX1) CLOSED
- MODAL-OPEN-TOP-ALIGN-A BACKLOG
- Ordine next: (1) SERIES-EXPAND (2) provider (3) MODAL-OPEN
- WU-0012 OPEN (file invariato)
- Oggetti GIS FROZEN

## Commit task

- Hash: **`77bceb10976dbd06fa1001f0eaadfe38c804641e`** (`77bceb1`)
- Subject: `docs: backlog waypoint center and transparent overlay stack`
- File: `docs/OPERATING_MEMORY.md`, `docs/work-units/WU-0005-0009-roadmap.md`, `docs/HANDOFF.md`
- Push: **riuscito**
- Monolite: **escluso**

## Limiti

- Fatti del commit autosync corrente: EXTERNAL_ONLY
