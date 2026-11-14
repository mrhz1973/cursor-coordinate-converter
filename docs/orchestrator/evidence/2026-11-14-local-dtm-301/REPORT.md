# ROUTING-LOCAL-DTM-5M10M-A - Build301 LIVE

Data 14 novembre 2026. Categoria DELICATO: sorgente DTM, rete volontaria, GeoTIFF e conversione EPSG. Esito tecnico PASS scoped; QA operatore real-world PENDING; accuratezza assoluta sul sentiero NON CERTIFICATA.

## Necessita e soluzione
L operatore necessita pendenze locali su tratti di 5 e 10 metri; la media 200 m di Build300 non puo sostituirle. Fonte scelta: DTM Liguria ed. 2023, griglia originale 5 m e licenza CC BY, servizio WCS ufficiale M2056:L6952, EPSG:3003 Gauss-Boaga Ovest. Link: https://www.regione.liguria.it/homepage-opendata/opendata-per-tipo/opendata-cartografia/item/22047-dtm-modello-digitale-terre-edizione-liguria-2017.html e https://geoservizi.regione.liguria.it/geoserver/M2056/wcs.

L applicazione desktop include un pannello Pendenza locale 5/10 m nel Routing. L operatore puo scegliere 5 oppure 10 m, chiedere esplicitamente (con seconda conferma) un ritaglio regionale tramite un solo GET CORS, oppure importare un GeoTIFF precedentemente scaricato in modalita offline. OPSEC Strict e offline forzato bloccano richieste. Nessun GPS o tracking, nessun salvataggio automatico a storage; DTM e campionamento rimangono esclusivamente in RAM e possono essere rimossi con un pulsante.

Il campionatore lavora sul percorso con passo 2.5 m, quote bilineari dal raster nativo 5m, differenza altimetrica su finestra esatta 5/10m, senza attraversare gap/NODATA e senza ridurre silenziosamente la finestra. Mostra max assoluto, salita/discesa con segno, angolo, posizione chilometrica, P95, copertura e valore al cursore. Valori >100% vengono esplicitamente segnalati come sospetti senza clamp inventati.

## Proiezione e affidabilita
Dal WCS ufficiale sono stati verificati GetCapabilities, DescribeCoverage e un GetCoverage reale GeoTIFF 80x80, signed Int16 non compresso, tag GeoKey EPSG:3003, matrice affine 5m e NoData -32767. Il lettore JavaScript restituisce quota 185.304066826 m su un punto pubblico coincidente con una lettura TIFF indipendente entro 1e-6m numerico. La proiezione WGS84->EPSG:3003 dedicata usa l inversa dell operazione EPSG Monte Mario to WGS84 (4), Helmert 7-parametri, confrontata con pyproj su tre punti (scarto numerico <0.002m).

La trasformazione geodetica ha accuratezza nominale di ordine 4m; la griglia raster 5m NON equivale a precisione di posizione 5m, tantomeno accuratezza di pendenza al suolo. Sui percorsi costieri esistono tratti DEM molto ripidi. Il campione reale GH Monterosso-Vernazza produce max +135.7%/5m e +124.8%/10m, entrambi marcati ATTENZIONE: dato sospetto, non misura certificata. La media 200m resta separata nei fattori generali di difficolta.

## Perimetro e limiti
Prima area geografica supportata: Liguria, EPSG:3003. GeoTIFF classico non compresso mono-banda signed Int16/Float32, raster nativo 5m; altri CRS, TIFF compressi e BigTIFF vengono respinti anziche produrre valori fittizi. Max singolo ritaglio WCS 350000 celle, 900px per lato, file <=48 MB, limiti ai punti; per percorsi estesi e altre regioni occorre un diverso contratto. Nuovo pannello esclusivamente desktop, non modifica vista telefono; sviluppo mobile PAUSA. I nuovi testi UI sono italiani; estensione i18n e scope futuro, non dichiarata completa.

## Identita e gate
Base GitHub main a170dac175b49f5785ef18b28a25d3b83a46b9e0; source Build301 6bd373f37b2b078cc9868bc6b32012b3ab769821, blob 7207ec7893b23bea34d72e512e7513cfd0c80bf1, SHA256 481ec4124e49526e331fcf90d2b2f970562e987172d0aef50d97ef7aa8e17c0f, 11159053 byte, 192 CR / 0 CRLF, singolo HTML vanilla JS. Diff solo monolite, 339 inserimenti / 4 rimozioni. Review GPT-SOSTITUTIVA statica 50/50 PASS; reviewer esterno NOT_PERFORMED/post-hoc backstop.

Deploy GIS-only con backup Build300 /var/backups/goi-gis-runtime/20261114T144206Z-build301, unico restart GIS PID 233261 -> 1043544; file, HTTP interno e HTTPS pubblico SHA coincidono. QA LIVE: download WCS volontario, GeoTIFF offline, rimozione, 5/10m e tooltip; 8/8 TIFF negativi, 7/7 piani/proiezione, 19/19 numerici precedenti, 9/9 geo/performance, savedTrack e 7/7 Escape. Nessun errore JS, nessun POST. Dettagli in QA-CANDIDATE-301.md e QA-LIVE-301.md.

NEXT: QA operatore sul tracciato reale di interesse e verifica in situ se serve accuratezza metrica; niente PASS ground-truth implicito. Limiti degli altri DEM e QA pregresse 300/299/298/295/294 rimangono aperti e separati.
