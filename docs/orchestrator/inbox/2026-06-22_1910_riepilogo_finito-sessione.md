# WU-0007 B6.7b — Range Rings memoria ultimo stile persistente

**Data:** 2026-06-22  
**Commit task:** `0ba6cdc` — `feat: WU-0007 B6.7b Range Rings memoria ultimo stile persistente`  
**Push task:** riuscito

## Implementazione

- Preferenza additiva `settings.rangeRingsLastStyle` in `coordconv_v2` (nessuna nuova chiave LS / schema)
- Helper `sanitizeRangeRingsLastStyle`, `rrExtractLastStyleFromSet`, `rrPersistRangeRingsLastStyleFromSet`, `rrGetPreferredNewRingFormStyle`
- Nuovo ring: `rrResetRangeRingsFormToNew()` + bind UI usano ultimo stile confermato o default (`showTitle: true`, `opacity: 0.55`)
- Aggiornamento preferenza solo su `rrCreateFromUi()` e `rrSaveEditedRangeRingSetFromUi()` riusciti
- Cancel/import/reset bozza/selezione non alterano preferenza; ring esistenti invariati
- `opacity` inclusa senza nuovo controllo UI; export GeoJSON stile limite preesistente invariato
- **`APP_BUILD_ID` `B5.5Z` invariato**

## B6.7a

Resta **CLOSED / PASS end-to-end** (`b2d828f`).

## QA

**QA operatore pending** — checklist B6.7b (create/save/cancel/reload/showTitle/spokes).

## File task

- `coordinate_converter Claude.html`
- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md`

## Verifiche statiche

- `git diff --check` OK
- `node --check` JS inline OK
- Nessun `<script src>` / module esterno aggiunto

## Working tree pre-autosync

(vuoto)
