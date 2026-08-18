# NOTICE — indice IIM (carte nautiche)

I file in questa directory sono **metadati e impronte rettangolari derivate** dalla
Interactive Sailing Map pubblica dell’Istituto Idrografico della Marina.
Condizioni **separate** dalla licenza del codice.

## Fonte

- POST `InteractiveSailingMap/myPathMaps.php` (flusso ufficiale della mappa pubblica)
- Geometrie: `rectMaps` = rettangoli WGS84 `[south, north, west, east]` serviti dalla pagina
- Non è un quadro d’unione vettoriale ufficiale (SHP/GeoJSON IIM assente)

## Diritti

- Titolare delle carte: **Istituto Idrografico della Marina**
- Questo pacchetto **non** include raster, PDF di carte, né contenuti editoriali
- Indice derivato da lookup pubblico; redistribuzione nell’app richiesta dall’operatore per WU-0012
- **Non affiliato** all’IIM; l’IIM non fornisce supporto per questo software
- Autorizzazione formale analoga a IGM **non** è registrata: `rights_status = derived-public-interactive-map-index`

## Uso

- Interrogazione offline dell’indice nel GIS standalone
- Uso non commerciale del solo indice/impronte
