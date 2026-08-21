# MAP-CENTER-VIEWPORT-AWARE-A — estensione POLYGON PANEL / DOCK + DRAWING VIEWPORT

**Tipo:** docs-only backlog extension  
**ID:** `MAP-CENTER-VIEWPORT-AWARE-A` (stesso ID — **no** duplicate)  
**Scope aggiunto:** **POLYGON PANEL — DOCK + DRAWING VIEWPORT**  
**Stato:** **CLOSED / PASS** build **245** FIX1 — estensione POLYGON PANEL ROUTINE + FIX1 dock sinistro. Camera useful-rect DELICATO del piano originale resta fuori (non in questo blocco).  
**Runtime:** tip `03a222e` / blob `b9258d75…` · deploy+ABQA PASS · QA operatore PASS · finito Regola H  
**FRONTIER:** CLOSED (2026-08-21)  
Evidence finito: [`2026-08-21_2145_riepilogo_finito-MAP-CENTER-VIEWPORT-AWARE-A-FIX1.md`](2026-08-21_2145_riepilogo_finito-MAP-CENTER-VIEWPORT-AWARE-A-FIX1.md)  
Evidence deploy FIX1: [`2026-08-21_2135_MAP-CENTER-VIEWPORT-AWARE-A-FIX1_deploy-abqa.md`](2026-08-21_2135_MAP-CENTER-VIEWPORT-AWARE-A-FIX1_deploy-abqa.md)  
Evidence 244 (superseded dock): [`2026-08-21_2105_MAP-CENTER-VIEWPORT-AWARE-A_deploy-abqa.md`](2026-08-21_2105_MAP-CENTER-VIEWPORT-AWARE-A_deploy-abqa.md)

## Precheck verificato

| Campo | Valore |
| --- | --- |
| `origin/main` FULL SHA | `cd09f57236c0162959bb991c94d7ae50ab35e600` |
| Branch / tree | `main` · clean · = origin/main |
| LIVE blob monolite | `92ec73f7be579e8616ee83fcab085f1c7c6a426d` |
| LIVE build / ID | **241** / `GIS-POLYGON-VERTEX-COORD-UX-A-FIX2` |

## Relazione col piano esistente

- Piano canonico: [`2026-08-01_1013_plan_map-center-viewport-aware-a.md`](2026-08-01_1013_plan_map-center-viewport-aware-a.md)
- Core CTA Centra / usable-rect / FIX1–FIX3: **CLOSED / PASS** (storico build 93).
- Questa registrazione **estende** quel piano (sezione *EXTENSION 2026-08-21*), non apre un secondo backlog «map center» concorrente.
- Roadmap: [`WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) § Map UX.

## Requisito operatore (sintesi)

1. **Modal laterale** — desktop/viewport larga: `#polygonPanel` dock a **sinistra** (FIX1 post-QA: non coprire chrome destro); non centrare inutilmente sulla mappa; non coprire topbar / `.tile-scale` / footer; riuso panel system esistente.
2. **Altezza** — usare altezza GIS disponibile; scroll interno solo se necessario; no overflow; azioni raggiungibili; ricalcolo su resize.
3. **Nuovo poligono** — **no** auto-minimize; panel resta laterale; lista coordinate/metriche/controlli consultabili; mappa libera interattiva; open panel ≠ start drawing.
4. **Viewport-aware center (principale)** — lo stesso punto geografico che era al centro pre-dock deve stare al centro della **porzione libera** post-dock (non centro geometrico `#miniMap`).
5. **Transizioni** — open/dock/resize/Nuovo/minimize/restore/close/window-resize: anchor geografico deterministico, **zero** drift cumulativo.
6. **Scala** — resta visibile; preferenza dock destro; non spostare senza necessità.
7. **Responsive** — dock laterale su larga; fallback su stretta/mobile via sistema canonico (no colonna inutilizzabile).
8. **Altri backlog** — collegare senza fondere: `GIS-POLYGON-METRICS-COMPACT-FORMAT-A`, `GIS-POLYGON-WAYPOINT-INTERACTION-A`, `GIS-POLYGON-PRESET-SHAPES-A`.

## Proposta anchor geografico / useful viewport

Allineata al modello A′ del piano originale:

1. Prima della transizione geometry del pannello: catturare il punto geografico corrispondente al **centro visuale attuale della porzione libera** (o, se ancora full-bleed, centro `#miniMap` ≡ useful).
2. Dopo layout (dock/resize): ricalcolare **useful rect** = `#miniMap.getBoundingClientRect()` meno intersezione reale di `#polygonPanel` (e altri occlusori già in inventario piano), via DOM — **zero** width hardcoded.
3. Riposizionare `state.viewCenter` (o path camera esistente riusato da `gisMapCenterOnLatLon` / helper panel-aware) così che l’anchor resti al centro del useful rect.
4. Vietato: sommare ripetutamente offset pixel tra transizioni (fonte tipica di drift).

## Lifecycle da auditare all’apertura

| Evento | Note |
| --- | --- |
| Apertura pannello | dock + center compensation |
| Dock / riposizionamento | useful rect |
| Resize pannello | ricalcolo altezza + center |
| Nuovo poligono | no minimize; drawing stay-open |
| Minimize / restore | camera deterministica |
| Chiusura | restore useful = full map senza drift |
| Resize finestra | altezza + useful + center |

## Responsive fallback

- Larga: dock destro target.
- Stretta/mobile: fallback adattivo (es. floating full/compact già canonico) — soglia in implementazione.
- Non forzare laterale se rende inutilizzabili pannello o mappa.

## Classificazione ROUTINE vs DELICATO

| Pezzo | Classe |
| --- | --- |
| CSS dock / altezza / scroll interno isolabile | **ROUTINE** |
| Camera / useful-rect compensation | **DELICATO** |
| Open / minimize / restore / close transitions | **DELICATO** |
| Drawing lifecycle (no minimize on Nuovo) | **DELICATO** |

## Zero runtime changes

- Monolite non modificato.
- Build 241 invariata.
- Nessun deploy.
- Nessun nuovo WU.
- Gate QA FRONTIER **non** modificato.

## Output atteso

`MAP-CENTER-VIEWPORT-AWARE-A POLYGON EXTENSION REGISTERED — RUNTIME 241 UNCHANGED — QA GATE UNCHANGED`
