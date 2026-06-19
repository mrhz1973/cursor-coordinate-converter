# Riepilogo — B6.4 Range Rings radial/bearing spokes controls

**Data:** 2026-06-19  
**Runtime commit:** `d0a4a0a`  
**Monolite:** incluso nel commit runtime (escluso autosync docs)

## Obiettivo

Controlli UI/persistenza/rendering per linee radiali (spokes) configurabili su Range Rings.

## Modifiche principali

### Costanti e helper

- `RR_SPOKE_COUNTS`, `RR_DEFAULT_SPOKE_STYLE`; esteso `RR_DEFAULT_RING_STYLE` con 5 campi spoke.
- `rrSanitizeSpokeCount`, `rrGetSpokeBearings` (count 3 → `[0,90,270]`), `rrGetSetMaxRadiusM`, `rrGetDistanceLabelBearingDeg`.

### Persistenza

- `sanitizeRangeRingSet`: `spokesEnabled` default `true` legacy; campi spoke solo se enabled.
- `rrApplySanitizedRangeRingSet`: delete spoke keys quando disabled.
- `rrStylePayloadFromSet`, create/edit/createFromUi con parità spoke.

### UI

- Blocco `.rr-spokes-block` dopo `.rr-style-block`: `#rrSpokesEnabled`, `#rrSpokeCount`, `#rrSpokeColor`, `#rrSpokeWidth`, `#rrSpokeLineStyle`.
- `rrSyncSpokesControlState`; 6 chiavi i18n IT/EN/FR.

### Rendering

- Sostituito `RR_GUIDE_BEARINGS` per-raggio: N raggi dal centro al **raggio max** del set.
- Label distanza: `rrGetDistanceLabelBearingDeg(s)` (count 3 → 45° B6.3a; altrimenti `360/(count*2)`).

## Default e legacy

| Campo | Default |
|-------|---------|
| spokesEnabled | true |
| spokeCount | 3 (bearing legacy 0/90/270) |
| spokeColor | #16a34a |
| spokeWidth | 1 |
| spokeLineStyle | solid |

**Nota comportamento legacy:** prima le guide erano ripetute per ogni anello; B6.4 disegna spokes una volta fino al raggio massimo (scelta UX voluta). Stile unificato `solid` vs vecchio misto continuo/tratteggio su 90/270.

## Fuori scope

- Drag centro (B6.5); bearing labels testuali; preview live.

## QA

- `node --check`: OK (2 blocchi).
- Browser QA operatore: non attestata.

## Prossimo passo

Browser QA B6.4; candidato B6.5 drag centro.
