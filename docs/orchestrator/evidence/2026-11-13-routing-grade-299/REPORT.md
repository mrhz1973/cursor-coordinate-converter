# ROUTING-GRADE-OUTLIER-GUARD-A - Build299 LIVE

Data 13 novembre 2026. Categoria DELICATO (calcolo numerico pendenze, profilo altimetrico, rendering del grafico e addon profili savedTrack). Test con provider esterni non attivati; strumenti TMAR Desktop Commander Windows, Edge CDP HTTPS, profili browser isolati con terze risorse bloccate.

## Fonte, identity e causa
GitHub origin/main base 676cb2adaf7f6f10d7cd78ff7086b6dc57e02a9c. Build298 baseline source 651c872b914025d6f0e84b19e51313b92599342b, monolite SHA256 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca. Sorgente Build299 4a9a61f6886f3cedbef83dcf7768db138351f96d, Git blob 9ac09afa5823d9d44bddab80dfd5c06a06772100, SHA256 0b4535fa8acb34cd49176f798774acd812be02a70b6638820e275889f54a802b, 11.135.062 byte e 192 CR, diff limitato a coordinate_converter Claude.html, 137 aggiunte / 36 rimozioni. Nessuna libreria aggiunta, no framework, no modules e nessun GPS o rete aggiuntivi.

Formula base della pendenza percentuale corretta (delta quota / distanza orizzontale * 100). Il bug era nella qualifica: piccoli segmenti con salto altimetrico passavano nel gradiente grezzo; il filtro con median bucket 25m aggregava ancora step non plausibili, talvolta ignorava flag sospetto e aumentava il guadagno altimetrico; il tooltip visualizzava valori grezzi anche quando marcati non utilizzabili. Fallback server per insufficienti dati filtrati riutilizzava dislivello potenzialmente contaminato.

## Evidenza baseline (BUILD298 LIVE)
- Tratto ordinario 10% piu salto artificiale +100m in 1m: pendenza istantanea nel tooltip 10.010%, massima filtrata 410%, dislivello positivo 110m e circa 1.110m/km nel caso 99m, con avviso generico di segmento sospetto. Riscontrato nel vero DOM e renderer del runtime LIVE, dati campione session-only.
- Un gradino +70m su 20m produceva pendenza massima 185% nonostante substrato regolare 10%.
- Spike finale +250m su percorso 495m producendo guadagno ~299m anziche ~49m, senza scarto corretto.
- SavedTrack precedente: profilo archiviato con salto +100m su 1m poteva mostrare 10.010% pur in una traccia con terreno ordinario.

## Correzione implementata
- Soglia euristica di plausibilita >100% pendenza con tolleranza numerica +0.01 punti percentuali per evitare falsi scarti al limite. La soglia NON equivale a dimostrazione che tutte le pendenze sopra 100% siano fisicamente impossibili su ogni terreno; appropriata come limite cautelativo su un grafo di routing terrestre.
- Segmenti di lunghezza zero o quasi zero con salto quota anomalo classificati non attendibili. I gap raw e i gradini filtrati interrompono l'aggregazione del guadagno/discesa e delle bande pendenza; nessun clamp artificiale, p95/max su span qualificati >=15m.
- Colori del grafico e tooltip derivano dalla pendenza filtrata qualificata, non da delta puntuale rumoroso; punti sospetti senza pendenza visualizzata e segmenti grafici separati ai gap. Gli spike isolati non ampliano piu la scala del grafico con min/max fittizi.
- Quando non esiste sufficiente filtrato affidabile e c'e anomalia, autorita ascent/descent = null, difficolta stimata = unknown e avviso 'Profilo filtrato non disponibile', anziche fallback a guadagno del provider.
- Tracce archiviate: visualizzazione grade oltre soglia soppressa (senza modificare il contenuto persistito). Le summary altimetriche archiviate possono ancora includere valori storici errati e NON sono migrate o ricalcolate. Le nuove tracce possono essere salvate senza addon altimetrico se quel profilo non e qualificabile, evitando di persistere il falso zero.

## QA e review
Sintassi inline 2/2 PASS, diff --check e invarianti 192 CR/0 CRLF PASS. Review GPT-SOSTITUTIVA statica sul commit Git object full SHA 25/25 PASS; esterna NOT_PERFORMED / post-hoc backstop. QA candidata Edge origin HTTPS con document substitution SOLO nel test: 18/18 casi numerici, 9/9 geografia/performance (fino a 20mila punti), matrice UI di 6 scenari, compatibilita savedTrack e addon, 7/7 Escape precedente, parity layout touch 390x844/844x390 uguale a Build298. QA HTTPS LIVE nativa senza injection dopo deploy: stessi test numerici 18/18, geografia/performance 9/9, UI 6 scenari, savedTrack/addon, regression Escape 7/7. Zero POST e zero Runtime.exceptionThrown osservati, provider terzi bloccati. Dettagli nei documenti QA-CANDIDATE-299.md e QA-LIVE-299.md.

## Deploy e gate
Deploy GIS-only con backup di Build298 al path /var/backups/goi-gis-runtime/20261113T174217Z-build299; unico restart GIS PID 1299971 -> 3203672. Primo HTTP dopo restart connection refused prima della readiness, retry conclusivo file/HTTP/HTTPS checksum della Build299 PASS. Nessun secondo restart. Dettagli nel DEPLOY-RESULT-299.md.

QA OPERATORE Build299 su un percorso reale interessato da grade fuori scala PENDING: non assumere PASS dalla QA di fixture; i provider di routing/altimetria esterni non sono stati interrogati. Ancora PENDING le QA indipendenti D-Flight Build298, footer295 ed Escape294. Sviluppo GIS telefono PAUSA, comportamento layout mobile preservato; valori numerici condivisi risultano corretti su tutti i dispositivi. Seguira eventuale follow-up separato sul riepilogo altimetrico storico dei saved tracks, senza migrazione implicita.
