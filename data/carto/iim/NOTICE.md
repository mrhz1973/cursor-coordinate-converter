# NOTICE — indice IIM (snapshot Interactive Sailing Map)

I file in questa directory sono **metadati e impronte rettangolari** derivate da un
**snapshot osservato** della Interactive Sailing Map pubblica dell’Istituto
Idrografico della Marina. **Non** sono un catalogo IIM completo.

Condizioni **separate** dalla licenza del codice.

## Fonte

- POST `InteractiveSailingMap/myPathMaps.php` (flusso ufficiale della mappa pubblica)
- Query harvest: `drawRecs` world bbox, `selScala=tutte`
- Geometrie: `rectMaps` = rettangoli WGS84 `[south, north, west, east]`
- Conteggio snapshot: **180** carte / **180** footprint
- Non è un quadro d’unione vettoriale ufficiale (SHP/GeoJSON IIM assente)

## Completeness (finding, non correzione)

Assenti dallo snapshot ma presenti nello shop Liguria (2026-08-18):

- carta **2** — Da Imperia a Portofino
- carta **326** — Bocche di Bonifacio (INT 3350)

Le edizioni nello shop possono essere più fresche dei valori `mapInfoWin`.
**Nessuna auto-correzione**: restano i valori della mappa interattiva.

## Diritti

- Titolare delle carte: **Istituto Idrografico della Marina**
- Questo pacchetto **non** include raster, PDF di carte, né contenuti editoriali
- `rights_status = derived-public-interactive-map-index`
- **Non affiliato** all’IIM

## Uso

- Interrogazione offline dell’indice nel GIS standalone
- Uso non commerciale del solo indice/impronte
