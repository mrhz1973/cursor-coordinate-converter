# Riepilogo — WU-0009B B5.4c ratio 1:N export JPG

**Data:** 2026-06-19  
**Base:** `bb881b5`  
**Runtime:** `f70b35d`

## Causa scomparsa / illeggibilità ratio

1. **boxH errato in layout full:** Nm era sommato dopo il blocco ratio nel calcolo altezza, ma disegnato prima della ratio → box troppo basso, ratio fuori dallo sfondo bianco.
2. **Ratio secondaria:** font `ratioFs = fontSize - 1`, colore `#222222`, gap condiviso con `gapAfterBar` insufficiente.
3. **Clipping:** con canvas basso, `boxY` clamped poteva far uscire la ratio dal box bianco (illeggibile su basemap).

## Fix

- Struttura altezza: `metricBlockH + [nmBlockH] + ratioRowH` (ratio sempre ultima riga)
- `gapBeforeRatio` dedicato; font ratio **700** ≥11px, colore `#111111`
- `showNm` solo se `fullBoxH <= maxBoxH`; Nm omessa prima di sacrificare ratio
- Ratio sempre disegnata con fallback `"1:?"` se label vuota

## pass_operatore

**non-attestato**

## Monolite nel commit autosync

Escluso — versionato nel commit runtime separato.
