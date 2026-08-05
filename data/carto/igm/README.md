# data/carto/igm — indice cartografico IGM (Serie 50 / 100V)

## Origine

Quadri d’unione ufficiali IGM (SHP WGS84 geografici), convertiti in GeoJSON nel blocco CARTO-IGM-ACQUIRE-A e autorizzati alla redistribuzione/embedding (Prot. IGM-2024-7891).

## Serie

| File | Feature | SHA-256 (LF) |
| --- | ---: | --- |
| `igm-series-50.geojson` | 633 | `401D6715E65561ECBF4FC9C653DF769324BC6D747FC5CA7EA73C91279E1158A1` |
| `igm-series-100v.geojson` | 278 | `C9619E5238A7F3FEA1DDFB0A95DCE886CBCDF0C88858B3B6D9BBA6AA22F9704C` |

Totale: **911** feature. CRS: WGS84 geografico (lon/lat), geometrie 2D.

## Struttura

- GeoJSON FeatureCollection per serie (sorgente auditabile)
- `manifest.json` — metadati, checksum, diritti
- `NOTICE.md` — condizioni d’uso dati
- Questo `README.md`

## Uso nel monolite

L’HTML standalone **non** fa fetch di questi file a runtime. Contiene un **payload embedded** compatto (`carto-igm-compact-v1`) generato deterministicamente da questi GeoJSON, caricato in lazy parsing alla prima ricerca.

## Aggiornamento futuro

1. Scaricare ZIP ufficiali IGM aggiornati (stesse serie).
2. Riconvertire con la pipeline di acquisizione (fuori monolite).
3. Sostituire i GeoJSON in questa directory **byte-verified**.
4. Rigenerare payload embedded e aggiornare checksum in `manifest.json`.
5. Mantenere attribuzione, NOTICE e sintesi licenza.

## Attribuzione

© Istituto Geografico Militare Italiano (IGM) — Quadri d'unione Serie 50 e 100V. Dati geografici elaborati per uso non commerciale.
