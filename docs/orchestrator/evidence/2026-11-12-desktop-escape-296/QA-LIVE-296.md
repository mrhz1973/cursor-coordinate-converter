# Automated Browser QA HTTPS LIVE ? Build296

Data 12 novembre 2026, pagina HTTPS nativa https://ionos-n8n-new.tailc01234.ts.net/gis?v=380ee97a. SHA256 file VPS / HTTP tailnet / HTTPS: 380ee97a3cb82feba3592016011e7510b63df7aab4ec82bc786d842d3484e2ff. Edge Chromium CDP AsusDesktop, profilo temporaneo isolato; richieste ai provider esterni bloccate; nessuna injection o sostituzione del documento LIVE.

| Suite | Esito |
| --- | --- |
| Converti minimizzato, poi Poligoni aperto, Escape | PASS; Poligoni chiuso, Converti ancora minimizzato e dock presente |
| Indice cartografico minimizzato, poi Poligoni aperto, Escape | PASS; Poligoni chiuso, Indice ancora minimizzato |
| Oggetti GIS minimizzato, poi Poligoni aperto, Escape | PASS; Poligoni chiuso, Oggetti GIS ancora minimizzato |
| Pianifica percorso minimizzato, poi Poligoni aperto, Escape | PASS; Poligoni chiuso, Pianifica percorso ancora minimizzato |
| Quattro pannelli aperti e NON minimizzati, Escape | 4/4 PASS; chiusi normalmente |
| Touch emulato 390x844, quattro casi target | 4/4 PARITY con Build295; nessuna modifica del comportamento mobile |

Risultato ABQA LIVE scoped: 12/12 PASS, 0 POST, 0 Runtime.exceptionThrown nelle tre suite. Richieste accessorie esterne bloccate: 271 (quattro fix), 275 (quattro visibili), 111 (parity touch). I quattro stati touch risultano identici alla baseline: il campo pass:false stampato dal runner desktop indica solo che il touch non usa la nuova priorit? desktop, NON un FAIL di regressione. Nessuna prova fisica Safari/iPhone; altri pannelli e tutte le 38 finestre NON dichiarati qualificati.

AUTOMATED BROWSER QA GIS-MINIMIZED-WINDOW-ESCAPE-PRIORITY-C PASS. QA FINALE CHATGPT - PENDING; nessuna attestazione QA operatore 296, 295 o 294 ricavata dai test.
