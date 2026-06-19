# Riepilogo — WU-0009B B5.4b leggibilità scala JPG export

**Data:** 2026-06-19  
**Base:** `77cbfaf`  
**Runtime:** `bd1c9e4`

## Causa compressione

`drawJpgExportScale()` usava `textBaseline = "alphabetic"` e avanzava `cy` solo di `lineGap` (3–4 px) dopo ogni barra. Il testo successivo si estende verso l'alto dal baseline (~0.8× fontSize), sovrapponendosi alle barre. `boxH` non rispecchiava l'altezza reale delle righe.

## Fix applicato

- `textBaseline = "top"` per posizionamento verticale prevedibile
- Font min 11 px (max 14), barH min 5 px, pad min 8 px
- Gap separati: `gapAfterText` e `gapAfterBar` (~35–42% fontSize)
- `boxH` calcolato da somma righe (metric+bar + opzionale Nm+bar + ratio)
- `showNm` solo se `canvasH >= fullBoxH + pad` (degradazione su canvas bassi)
- Box bianco opaco `#ffffff` preservato

## pass_operatore

**non-attestato** (B5.4 export QA pending)

## Monolite nel commit autosync

Escluso — versionato in `bd1c9e4` (runtime commit separato).
