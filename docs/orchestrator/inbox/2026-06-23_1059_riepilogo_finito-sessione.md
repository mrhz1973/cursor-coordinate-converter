# Riepilogo finito sessione — POLY-PARITY-P1-FIX

**Data:** 2026-06-23  
**Commit task (`finito` step 2):** `d30a3a8` — `fix: POLY-PARITY-P1-FIX correzioni UI/i18n poligono edit`  
**HEAD iniziale:** `9cc170f`  
**Runtime P1 base:** `7a668d7`  
**Push step 2:** riuscito (`main` → `origin/main`)

## Cosa è stato fatto

Implementati i cinque fix UI/i18n emersi dalla QA operatore P1 sul monolite `coordinate_converter Claude.html`:

1. **Nome default i18n** — chiave `gis.polygonPanel.defaultName` IT/EN/FR; helper `polygonDisplayName`, `polygonIsLegacyDefaultNameKey`, `polygonEditNamesEquivalent` per fallback visualizzazione legacy senza migrazione storage; Salva clean non dirty su legacy.
2. **Formatter distanze** — `polygonEditFormatDistance` riusa `formatMapMeasureDistance` + `state.mapMeasureUnit`; se unità `m` e distanza ≥1000 m passa `km` al formatter (evita `4.335k m`); area `fmtAreaPlain` invariata; rimossa riga `Unità` fuorviante.
3. **Barra errore vuota** — CSS `#polygonPanelEditErr[hidden]{ display:none !important; ... }`.
4. **Hint utente** — `editVerticesHint` IT/EN/FR neutro («evidenziati sulla mappa»); nessun riferimento a blocchi futuri.
5. **Modifica bloccata** — causa: `openPolygonPanel` auto-arma `polygonDrawMode` vuoto; `polygonEditEnterFromList` bloccava su draw attivo. Fix: disarmo draw vuoto (`polygonDisarmEmptyDrawIfSafe` / `polygonCancelDraw`); draft con punti → badge `editDrawBlock` invariato; disarmo dopo Salva/Annulla edit.

## File modificati

- `coordinate_converter Claude.html` (+57/−20 netto nel commit)
- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md` §POLY-PARITY-P1-FIX

## Regioni monolite

- i18n IT/EN/FR (`gis.polygonPanel.defaultName`, `editVerticesHint`)
- CSS `.poly-edit-err[hidden]`
- HTML hint edit bar
- Helper: `polygonDisplayName`, `polygonEditNamesEquivalent`, `polygonEditFormatDistance`, `polygonDisarmEmptyDrawIfSafe`
- `polygonRecomputeEditDirty`, `polygonEditSyncTitle`, `renderPolygonEditInfo`, `renderPolygonEditBar`
- `polygonEditSaveHandler`, `polygonEditCancelHandler`, `polygonEditEnterFromList`
- `renderPolygonPanelList`, `polygonShowDeleteConfirm`, `polygonShowRenameBar`

## Contratti preservati

- `state.gisPolygons` canonico; `_polyEdit` transiente non persistito
- `polygonSaveEdit`: una sola `gisFeatureUpdate(id,{geometry,properties})`
- Salva clean / Annulla senza CRUD canonico
- Nessuna modifica sanitizer, timestamp, import/export, Tracce, Waypoint, rete/cache/OPSEC
- **`APP_BUILD_ID` `B5.5Z` invariato**

## QA statico

- `git diff --stat`: 3 file, +75/−23
- `node --check` su JS inline: **PASS**
- Nessun testo «blocco successivo» residuo
- Chiave `defaultName` presente IT/EN/FR

## QA operatore

**Pending** — non attestato da Cursor.

## Deploy

**Nessun deploy VPS.**

## Prossimo passo

QA operatore P1-FIX; poi backlog P2 drag vertici.

## Frontiera

`POLY-PARITY-P1-FIX runtime implementato e pushato; QA operatore pending; nessun deploy`
