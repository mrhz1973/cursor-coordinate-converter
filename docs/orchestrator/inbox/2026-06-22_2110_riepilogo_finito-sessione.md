# Riepilogo finito sessione — WU-0007 T1-FLOAT

**Data:** 2026-06-22  
**Trigger:** `finito`  
**Commit task:** `e92e301` — `feat: WU-0007 T1-FLOAT — float Traccia allineato a trackDisplayUnit`

## Cosa è stato fatto

Allineamento del float mappa esterno Traccia all’unità distanza del modal (`trackDisplayUnit`), opzione 2 approvata: picker nel float, repoint da `mapMeasureUnit` a `trackDisplayUnit`.

### Monolite (`coordinate_converter Claude.html`)

1. **`updateTrackMapFloatReadout()`** — `normalizeTrackDisplayUnit(state.trackDisplayUnit)` + `formatTrackDistance(distM, u)` al posto di `mapMeasureUnit` / `formatMapMeasureDistance`.
2. **Markup float in `renderTileMap()`** — readout iniziale e picker `[data-role="track-float-unit"]` con sole opzioni `km`, `nm` (label `NM`), `mi`; rimossi `m` e `ft`.
3. **Listener float** — scrive `state.trackDisplayUnit`, `saveStore()`, `updateTrackMapFloatReadout(root)`; rimossi write su `mapMeasureUnit` e side-effect Misura (`renderMapMeasureOverlay`, `updateMeasureReadouts`, `renderTrackOverlay`).

### Documentazione

- `docs/OPERATING_MEMORY.md` §7 — bullet T1-FLOAT (runtime implementato, QA pending).
- `docs/work-units/WU-0005-0009-roadmap.md` — sezione WU-0007 T1-FLOAT; nota su float fuori scope T1 originale.

## Invariati (by design)

- Modal Traccia, archivio, ETA, `wireTrackDisplayUnitOnce`, `renderTrackSummary`.
- Listener Misura (`measure-unit`, `gis-meas-unit`) — ancora `mapMeasureUnit`.
- Geometria, import/export, settings schema, i18n aggiuntivo, CSS.
- **`APP_BUILD_ID` `B5.5Z`** invariato.
- Float mostra **solo distanza** (nessuna velocità).

## Verifiche eseguite

- `git diff --check` OK (pre-commit).
- `node --check` su JS inline estratto OK.
- Nessun `<script src>` aggiunto.

## QA

- **QA operatore T1-FLOAT:** non attestata.
- **Deploy VPS GIS-only:** non eseguito in questo blocco.

## Git (pre-autosync)

```text
git log --oneline -3
e92e301 feat: WU-0007 T1-FLOAT — float Traccia allineato a trackDisplayUnit
37b3625 docs: orchestratore — riconciliazione finito sessione B6.7b PASS operatore
2b0f961 docs: chiudi WU-0007 B6.7b end-to-end — PASS operatore VPS

git status --short
(vuoto post-push task)

git rev-parse HEAD
e92e301

git push (task)
37b3625..e92e301 main -> main
```

**Monolite incluso** nel commit task `e92e301`.

## Prossimo passo

1. Deploy VPS GIS-only @ `e92e301` + smoke tecnico.
2. QA operatore T1-FLOAT: float coerente con modal; persistenza reload; Misura indipendente.
3. Eventuale chiusura docs PASS operatore (come B6.7b) dopo attestazione.
