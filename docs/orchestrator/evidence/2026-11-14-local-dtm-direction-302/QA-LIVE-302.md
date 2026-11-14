# Build302 - Automated Browser QA HTTPS LIVE PASS scoped

Data 14 novembre 2026. TMAR Desktop Commander Win, Edge CDP con profili browser isolati e pagina nativa https://ionos-n8n-new.tailc01234.ts.net/gis?v=35c1af1d, SENZA sostituzione HTML. SHA256 file / HTTP / HTTPS = 35c1af1dcb30c44fa7f136a19f7d3df4618ffbbdf5a64c1722c222f3271c253f, Build302.

| Suite | Risultato |
| --- | --- |
| DTM reale cache + sintetici: inversione A/B su 5m e 10m | 18/18 PASS |
| Coerenza massimo e valore al cursore, avanti/indietro | 4/4 PASS |
| Superfici piane note, gap, coordinate e angolo | 7/7 PASS nella candidata; eredita routine immutate in live |
| Parser GeoTIFF e validazioni formato/proiezione | 8/8 PASS in HTTPS live |
| Importazione manuale offline e pulsante Clear | PASS in HTTPS live |
| Guardie OPSEC Strict e forceOffline | PASS senza download in HTTPS live |
| Regressione media 200m numerica | 19/19 PASS in HTTPS live |
| UI/IT-EN e route corta media 200m | 3/3 PASS in HTTPS live |
| Escape D-Flight / Help / Tools / Converti / IGM / GIS Workbench / Routing | 7/7 PASS in HTTPS live |

Esempio DTM 5m: +85.731134% avanti e -85.731134% indietro; P95 invariato. Su DTM 10m +83.870288% e -83.870288%, P95 invariato entro tolleranza test. Nei test LIVE sono state bloccate le risorse esterne non necessarie; zero POST, zero Runtime.exceptionThrown. Il DTM era una fixture pubblica gia scaricata in una sessione precedente: nessuna nuova richiesta regionale e stata effettuata per questa QA.

La QA tecnica non certifica accuratezza topografica al suolo o il tracciato personale originale. Nessuna qualifica di QA operatore attribuita automaticamente.
