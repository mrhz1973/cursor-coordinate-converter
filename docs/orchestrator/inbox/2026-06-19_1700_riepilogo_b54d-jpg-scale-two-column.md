# Riepilogo — WU-0009B B5.4d ratio sx / tabella dx export JPG

**Data:** 2026-06-19  
**Base:** `0f9837a`  
**Runtime:** `ed3f948`

## Layout

- **Colonna sinistra:** solo ratio 1:N, font 700 ≥12px, centrata orizzontalmente nella colonna e verticalmente nel box (`textBaseline: middle`, `boxY + boxH/2`)
- **Colonna destra:** km·mi, barra metrica, Nm + barra nautica (se spazio)
- **Separazione:** `colGap` ≥10px tra colonne; unico box bianco opaco `#ffffff`

## Fallback

- Canvas stretto: ratio sempre a sinistra; dx mantiene km·mi + barra metrica; Nm omessa per prima

## pass_operatore

**non-attestato**

## Monolite nel commit autosync

Escluso — versionato in `ed3f948`.
