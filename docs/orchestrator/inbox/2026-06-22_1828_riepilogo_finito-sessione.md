# WU-0007 B6.7a — Range Rings titolo opzionale + sezione Stili comprimibile

**Data:** 2026-06-22  
**Commit task:** `b2d828f` — `feat: WU-0007 B6.7a Range Rings showTitle e sezione Stili comprimibile`  
**Push task:** riuscito (`46aeace..b2d828f`)

## Cosa è stato fatto

1. **`showTitle` per-ring** — proprietà booleana in `sanitizeRangeRingSet`; fallback legacy: se assente → `labelMode === "name"`.
2. **Checkbox `#rrShowTitle`** in sezione Stili (IT/EN/FR `rangeRings.showTitle`).
3. **Gate render `rrSetShowsTitle(set)`** — titolo mappa indipendente da etichette distanza (`.rr-distance-label` invariato).
4. **Sezione comprimibile `#rrStyleDetails`** — `<details class="rr-io-details rr-style-details">` default chiuso; raggruppa `.rr-style-block` + `.rr-spokes-block`.
5. **Flussi form** — `rrReadStyleFromForm`, `rrApplyStyleToForm`, `rrStylePayloadFromSet`, `rrCreateFromUi`, `rrSaveEditedRangeRingSetFromUi` aggiornati.
6. **`labelMode` conservato** per compatibilità storica.

## File modificati

- `coordinate_converter Claude.html` (+48 righe nette circa)
- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md`

## Non implementato (scope)

- **B6.7b** memoria ultimo stile persistente (`rangeRingsLastStyle`) — backlog
- Import/export GeoJSON — invariati (`showTitle` segue limite preesistente: export non serializza stile completo)
- `APP_BUILD_ID` — invariato (`B5.5Z`)

## Controlli statici

- `git diff --check` — OK
- `node --check` su JS inline estratto — OK (exit 0)
- Nessun `<script src>` / `type="module"` aggiunto
- `rangeRingsLastStyle` — assente (verificato)

## QA

- **QA operatore:** pending (non attestata)
- **Smoke browser Cursor:** non eseguito (checklist manuale consigliata)

## Working tree pre-autosync

(vuoto)

## Prossimo passo

B6.7b — memoria ultimo stile persistente per nuovi ring; poi deploy VPS + QA operatore B6.7a.
