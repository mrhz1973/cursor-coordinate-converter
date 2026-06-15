# 2026-06-15 — Riepilogo finito sessione — WU-0008 8d-B0 browse-cache guard

## Chiusura `finito`

Sessione chiusa con commit monolite + memoria lean.

## Commit step 2 (`finito`)

- **Hash:** `23db6b4`
- **Subject:** `fix(gis): make cacheable:false authoritative in browse-cache (WU-0008 8d-B0)`
- **Push step 2:** da verificare in RIEPILOGO Cursor (comando eseguito nello stesso intervento)

## File nel commit principale

| File | Modifica |
|------|----------|
| `coordinate_converter Claude.html` | +13 righe — `parseTileKeyLayerId`, guard in `cacheTileFromDisplay` |
| `docs/OPERATING_MEMORY.md` | §7 — bullet 8d-B0 PASS |
| `docs/work-units/WU-0005-0009-roadmap.md` | sezioni 8d-B0 / 8d-B, backlog, matrice dipendenze |

**Monolite incluso** nel commit `finito` step 2.

## Cosa è stato fatto (8d-B0)

- Gap corretto: `hydrateMapTiles` → `cacheTileFromDisplay` persisteva tile di layer `cacheable:false` (osmStandard, Esri) durante navigazione.
- Guard **solo** nel sink `cacheTileFromDisplay` (non nei chiamanti).
- `layerId` da `tkey` (`makeTileKey` format), **non** `state.mapLayer`.
- Fail-open: layerId ignoto o assente da `TILE_LAYERS` → cache invariata.
- Nessun layer EOX aggiunto; Navionics/SonarChart/seamarks/OPSEC invariati.

## Funzioni / regioni

- `parseTileKeyLayerId` (~23789)
- `cacheTileFromDisplay` (~24211)

## QA

| Check | Esito |
|-------|--------|
| `node --check` (JS estratto inline) | PASS |
| `git diff --check` | PASS |
| Browser QA IndexedDB before/after | **non eseguita** — checklist sotto |

### Checklist browser QA (operatore)

1. DevTools → Application → IndexedDB → store tile.
2. Contare chiavi `esriTopo:` → pan/zoom su Esri → conteggio **invariato**.
3. Ripetere con `osmStandard:` → conteggio **invariato**.
4. Layer cacheable (`osm:` / `osmHot:`) → nuove chiavi attese al pan.

## Diagnosi sessione (read-only, pre-implementazione)

- WU-0008 **8d-A-bis** diagnosi EOX completata in sessione precedente (HEAD `efcdbf6`); EOX compatibile con `urlBase` + `tileScheme:zyx` + `.jpg`; prerequisito 8d-B0 identificato.

## Rischi residui

- Tile già in IDB prima del fix restano fino a wipe manuale.
- SonarChart (`sonarchart`) non in `TILE_LAYERS` → fail-open, browse-cache overlay invariato.

## Prossimo passo

**WU-0008 8d-B** — layer EOX Sentinel-2 cloudless (`s2cloudless-2024_3857`), sezione Satellitare, `cacheable:false`, esclusione consigliata da `#pcLayer` / build pubblici (CC BY-NC-SA).

## Stato git post-step-2

Working tree atteso pulito dopo commit; orchestratore in commit separato step 4.
