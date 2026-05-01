# Pass 5 Step D.1 — Astro waypoint picker: campi + tooltip (monolite locale)

**Data:** 2026-05-01 (timestamp `1212`).

## Cosa è stato fatto

1. **`astroIndexPickerWaypoints`** — Per ogni waypoint con coordinate finite: `coordStr` (DD 5 dp, lon normalizzata), `mgrsStr` (se `latLonToMGRS` ok), `whenStr` via **`formatWaypointTableWhen`** (allineato alla colonna “Quando” del modal waypoint), `notesFull`/`notesDisplay` da `meta.notes`, `iconLab` via **`waypointIconHumanLabel`**, meta `from` / `type` / `raw` / `locality` nella stringa **`search`**, ISO parziali `createdAt`/`updatedAt`, **`detailTitle`** leggibile (Creato/Aggiornato + date locali) per `title` sulla riga coordinate e per la ricerca.

2. **`astroFillWaypointPicker`** — Riga a tre livelli: linea 1 nome + dot colore + etichetta icona; linea 2 coordinate · MGRS · quando; linea 3 note (clamp 2 righe) o testo **`astro.wp.noNotes`**. Pulsante **Usa** con `data-tip` / `aria-label` da **`tip.astro.src.useWaypoint`**.

3. **Ricerca** — Filtro sulla stringa `search` aggregata (nome, coord, MGRS, date visibili, note, icona, meta, id, ISO).

4. **Tooltip pannello Astro** — Pattern **`data-i18n-tip`** + **`data-i18n-aria`** + **`syncI18nInRoot`**: chiusura pannello (`tip.astro.close`), sorgenti result/mapCenter/mapPick/cancel waypoint (`tip.astro.src.*`), Calcolo (`tip.astro.compute` su `#btnAstro2`), campo ricerca picker (`tip.astro.picker.search`). **`openAstroFloatingPanelGis`** e **`gisRefreshI18n`** sincronizzano `#astroPanel`; apertura picker + cambio lingua sincronizzano `#astroWaypointPicker` e rifanno fill lista se picker aperto.

5. **CSS** — Classi `.astro-wp-line1`, `.astro-wp-line2`, `.astro-wp-notes`, `.astro-wp-ico-hint` per layout compatto.

## File modificato (locale, non in commit)

- **`coordinate_converter Claude.html`**

## Campi waypoint rilevati (modal `#wp-list` / `renderWpModalList`)

Tabella: nome, quando (`formatWaypointTableWhen`), coordinate + MGRS, icona (label umana). Modello `state.mapWaypoints`: `id`, `lat`, `lon`, `name`, `meta` (notes, icon, color, from, type, raw, locality, …), `createdAt`, `updatedAt`.

## Non implementato

Favorite chooser, Step E, «Mostra sulla mappa», edit/delete/import/export nel picker, modifiche a `state.mapWaypoints` / `state.lastResult` / cronologia / permalink / `renderResults`.

## Test automatici

- `git status --short`: solo monolite `M`.
- Nessun `<script src>` / `type="module"`; 2/2 script.
- `node --check` sui due blocchi `<script>(.*?)</script>` non greedy: **OK**.

## Test browser

**Non eseguiti** in agente. Checklist: waypoint con nome/date/note/meta → Astro → Da waypoint… → verificare righe e ricerca (nome, coord, data, nota) → Usa; tooltip su pulsanti e su campo cerca; cambio lingua con pannello/picker aperti.

## Motivo esclusione monolite dal commit memoria

Policy + richiesta: commit memoria **solo** `docs/orchestrator/**`.

## Prossimo passo

Smoke manuale D.1; poi Step E o **`finito`** a fine giornata se opportuno.
