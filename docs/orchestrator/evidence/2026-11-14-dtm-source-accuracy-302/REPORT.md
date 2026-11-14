# TMAR GIS Tool - Audit B0 fonti DTM 1m e attendibilita pendenze locali 5/10m

**Data:** 14 novembre 2026, verifica docs-only. **Source of truth preflight:** GitHub origin/main c7fa36b78148e505cc9f71cfcbba9f76bb0deae0. Build302 LIVE, source 182b83a32dc9a32fa2a748458a9ad6f7b5b066a5, SHA256 runtime 35c1af1dcb30c44fa7f136a19f7d3df4618ffbbdf5a64c1722c222f3271c253f. QA operatore sul tracciato originale PENDING, accuratezza DEM al suolo HOLD.

## Obiettivo

Accertare se un dato altimetrico indipendente a 1 metro sia realmente utilizzabile per validare le pendenze a 5 e 10 metri, senza inventare copertura geografica, accuratezza o nuove disponibilita di provider.

## Verifica delle fonti, 14/11/2026

1. DTM ufficiale Regione Liguria ed. 2023: la Regione dichiara griglia 5m e precisione sulla quota dei dati di partenza pari a circa 0.6m, derivati dal DB Geotopografico e da cartografia tecnica, non esclusivamente da LiDAR. Fonte: https://www.regione.liguria.it/homepage-opendata/opendata-per-tipo/opendata-cartografia/item/22047-dtm-modello-digitale-terre-edizione-liguria-2017.html . Il WCS effettivamente integrato nella Build301/302 e M2056:L6952, EPSG:3003, 5m.
2. Il metadato RNDT Regione Liguria r_liguri:D.1584 etichetta il servizio M1584 come **Esposizione dei versanti LIDAR**. Il raster classifica l'orientamento, non restituisce quote metriche del terreno. Il GetCapabilities WCS 1.0.0 e stato letto dal PC via TMAR Desktop Commander: nome WCS_M1584, layers L4098 Genova, L4094 Imperia, L4096 Savona e L4097 La Spezia, tutti di esposizione, NON di altezza. Non utilizzare questi layer come un DEM 1m. Fonte: https://geodati.gov.it/geoportale/visualizzazione-metadati/scheda-metadati?metadataid=r_liguri:D.1584 .
3. Il catalogo nazionale MASE registra un **DTM LiDAR a risoluzione a terra 1 metro**, acquisizioni 2008-2010, prevalentemente aste fluviali di primo/secondo ordine; la copertura effettiva del tracciato originario NON e stata accertata. Il link di servizio pubblicato e principalmente WMS/portale; non e stato identificato un endpoint dati altimetrici numerici verificato su Monterosso o sul tracciato dell'utente. Pertanto non si integra un presunto DEM 1m sulla sola base del catalogo. Fonti: https://www.dati.gov.it/node/view-dataset/dataset?id=7478f124-f23d-44d4-a4e3-a3bb1571784b e https://geodati.gov.it/geoportale/visualizzazione-metadati/scheda-metadati?metadataid=m_amte:299FN3:4291293c-ab34-4926-c2b6-db19eeb41b5f .
4. Geoportale Liguria spiega che il DTM a 5m e prodotto da elementi cartografici e interpolazioni, mentre alcuni prodotti costieri derivano da LiDAR; griglia raster e realismo delle misure puntuali sono concetti distinti. Fonte: https://geoportal.regione.liguria.it/progetti/dtm%2C-acclivit%C3%A0%2C-esposizione-dei-versanti.html .

## Ordine di grandezza della sensibilita

Formula esatta grade (%) = 100 * (z2-z1) / lunghezza orizzontale (m).

| Variazione ipotetica di dislivello | L = 5m | L = 10m |
| --- | ---: | ---: |
| 0.6m | 12 punti percentuali | 6 punti percentuali |
| 1.2m | 24 punti percentuali | 12 punti percentuali |

I valori sono esempi condizionali, NON limiti massimi, intervalli di confidenza o propagazioni statistiche inferite da metadati. Il dato 0.6m riguarda la precisione delle quote dei dati di partenza, non la stima d'errore della singola misura lungo un sentiero. Ulteriore incertezza e associata al georiferimento e all'allineamento del tracciato rispetto al raster.

La matrice Build302 gia pubblicata, sul solo tratto pubblico verificato di ~43.5m, con offset trasversali da -6 a +6m, misurava un intervallo di massime 5m circa 82.9-98.9% e massime 10m circa 78.3-91.7% dopo campionamento bidirezionale. E un caso concreto, NON una banda di incertezza valida regionalmente. [Evidenza Build302](../2026-11-14-local-dtm-direction-302/REPORT.md).

## Esito e gate

Lavoro in sola lettura, nessun nuovo GeoTIFF o download sulla posizione utente, nessuna prova GPS, nessuna modifica a HTML/servizi/VPS, nessuna Build303 e nessun QA operatore PASS implicito. Il DTM1m MASE non e stato verificato come disponibile nel tratto originale; il servizio M1584 e sicuramente un prodotto di esposizione RGB e non una sorgente di quote.

**NEXT canonico invariato:** una validazione puntuale sul percorso reale che aveva manifestato anomalie, se diventa disponibile con coordinate o tracciato e con riferimento altimetrico indipendente pertinente; altrimenti accuracy HOLD. Ogni eventuale integrazione di nuovi DTM 1m, modello di incertezza UI o provider richiede blocco/scope separato. Sviluppo mobile PAUSA.
