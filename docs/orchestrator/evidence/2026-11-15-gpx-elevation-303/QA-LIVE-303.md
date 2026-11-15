# Build303 ? Automated Browser QA HTTPS LIVE, scoped PASS

Data 15 novembre 2026. Edge CDP via TMAR Desktop Commander Windows, profili di test temporanei. Documento HTML nativo su https://ionos-n8n-new.tailc01234.ts.net/gis?v=0b117c13, **senza Fetch.fulfillRequest** o HTML sostituito. File/runtime SHA256 0b117c13a96da9f8c421fba3772c19a297bd002ec60409d19703b329ac83b9f7.

| Suite | Esito |
| --- | --- |
| 4 GPX reali, 2,312 quote, input output GPX/KML3D, saved addon, geometryHash stale | 4/4 PASS |
| Caso reale tramite import applicativo, 198 punti -> localStorage -> reload -> GPX export | PASS (198/198 quote) |
| Persistenza sintetica controllata e reset della localStorage QA | PASS |
| Quote GPX mancanti/invalide, zero/negative, KML absolute/clamp, KML partial, tampering e legacy | 13/13 PASS |
| Poligoni, linee2D, KML e GPX legacy | 5/5 PASS |
| Regressione numerica Routing media200m | 19/19 PASS |
| DTM 5/10m su finestre bidirezionali | 18/18 PASS |
| Escape regressioni D-Flight/Guida/Tools/Converti/IGM/Workbench/Routing | 7/7 PASS |

Un primo run del test E2E dopo deploy ha terminato con Runtime.evaluate: 'Uncaught' non dettagliato e non e stato contato PASS. Il retry con diagnostica exception.description ha verificato correttamente import, storage, reopen e export, nessun errore nell esecuzione positiva successiva. Non si dichiara causa risolta per il primo run, ne un difetto prodotto verificato.

Tutte le suite con esito finale PASS hanno registrato zero POST e zero Runtime.exceptionThrown; richieste accessorie bloccate. I dati di test sono stati elaborati in profili temporanei separati, non nel profilo utente. Nessuna migrazione dati o GPS. La QA tecnica non e la QA operatore umana (PENDING).
