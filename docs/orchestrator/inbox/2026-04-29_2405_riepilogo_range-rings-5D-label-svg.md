# Riepilogo — Range Rings blocco **5D** (label SVG nome al centro)

**Data:** 2026-04-29.

## Obiettivo

Etichetta SVG `<text>` con nome set vicino al centro proiettato, solo per set **visibili** e `labelMode === "name"`; offset **+10 / −6** px; troncamento ~40 caratteri (`rrLabelText`); stile `.rr-label` con `paint-order` / stroke alone e `pointer-events: none`; nessun toggle globale né label per anello.

## File modificati

- `coordinate_converter Claude.html` — `RANGE_RING_LABEL_MODES` esteso con `"name"`; `sanitizeRangeRingSet` invariato nella shape; `rrCreateFromUi` imposta `labelMode: "name"` per i **nuovi** set; helper `rrLabelModeShowsName`, `rrLabelText`; `renderRangeRingsOverlay` secondo loop `<text class="rr-label">`; CSS `.range-rings-overlay .rr-label` + variante `html[data-theme="dark"]`.

## Non toccato

Lista 5C, pick, batch, overlay track/waypoint, Mappe Offline, doc ufficiali, `finito`.

## Compatibilità `labelMode`

- Set persistiti con `"off"` (o sconosciuto → `"off"` in sanitize) **non** mostrano label.
- `"cardinal"` / `"all`** restano nel set sanitizzato ma **non** attivano la label nome in 5D (solo `"name"`).

## QA locale

- `git diff --check -- "coordinate_converter Claude.html"`: ok.
- `node --check` su estratto script righe **8369–34782**: ok.

## Rischi residui

- Estrazione righe script: se il monolite sposta `<script>`, aggiornare intervallo `sed` per `node --check`.

## Prossimo passo

- **5E** / **5F** secondo piano `2026-04-29_2130_plan_range-rings-next-ui-label-autocreate-drag.md`.
