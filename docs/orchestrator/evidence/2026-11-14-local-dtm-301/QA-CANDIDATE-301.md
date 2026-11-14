# Build301 candidate - scoped QA

Source commit 6bd373f37b2b078cc9868bc6b32012b3ab769821, SHA256 481ec4124e49526e331fcf90d2b2f970562e987172d0aef50d97ef7aa8e17c0f. Windows TMAR Desktop Commander, Edge CDP con HTML candidato soltanto nel browser isolato.

- WCS 5m EPSG3003 ufficiale: GetCapabilities/DescribeCoverage/GetCoverage HTTP200 e GeoTIFF corretto. Proiezione 7-param a confronto pyproj, tre coordinate entro 0.002m numerici. Lettura pixel TIFF indipendente quota 185.304066826 m entro 1e-6m.
- Click DTM con dialog conferma -> 1 GET WCS, 0 POST, model caricato; max5m +135.7%, max10m +124.8% su fixture GH pubblica, high-grade sospetto segnalato, tooltip al cursore cambia su finestra10m, reset ripristina tooltip 200m. Non e validazione topografica al suolo.
- Offline: importazione manuale GeoTIFF e clear, OPSEC Strict e forcedOffline nessun GET. Parser 8/8 test (formato corretto, datum errato, compressione, 30m, BigTIFF, troncamento, bbox cap, NoData) PASS.
- Superficie sintetica 20%: finestre5/10m entrambe circa19.99%, 7/7 casi compresi gap/noData, tratto corto, angolo, proiezione.
- Regressioni Build300: 19/19 numerici, 9/9 geo/performance, savedTrack addon e grade storico PASS, Escape builds296-298 7/7 PASS. Desktop 1440x900/1024x650/800x600: hit-test controllo dopo scorrimento PASS; emulazione mobile 390x844/844x390 geometry parity, nuova UI nascosta.
- Inline JS syntax 2/2 PASS, Git diff --check, 192 CR/0 CRLF. Reviewer esterno NOT_PERFORMED.
