# Automated Browser QA HTTPS LIVE Build297

Data 12 novembre 2026. Edge Chromium CDP su AsusDesktop, profilo temporaneo isolato. Pagina HTTPS nativa https://ionos-n8n-new.tailc01234.ts.net/gis?v=e9be9dc2, senza injection o sostituzione HTML. SHA256 del monolite file VPS / HTTP tailnet / HTTPS: e9be9dc2c694a930cb607d3bd71a56cdff4f8dd6a78b4d4e86d2ab15800b1a96.

| Suite | Risultato |
| --- | --- |
| Guida minimizzata + Poligoni visibile + Escape | PASS, Poligoni chiuso; Guida minimizzata e dock presenti |
| Strumenti minimizzati + Poligoni visibile + Escape | PASS, Poligoni chiuso; Strumenti minimizzati e dock presenti |
| Guida e Strumenti visibili + Escape | 2/2 PASS, chiusure normali |
| Guida e Strumenti minimizzati senza altro pannello | 2/2 PASS, minimizzazione conservata |
| Regressione precedente Build296: Converti/Indice/Oggetti GIS/Routing minimizzati + Poligoni | 4/4 PASS |
| Touch 390x844 emulato sui due pannelli | 2/2 parity baseline296 PASS, nessuna variazione di comportamento mobile |

Totale 12/12 controlli mirati coerenti con gli attesi. Tutte le suite riportano zero POST e zero Runtime.exceptionThrown. Risorse esterne bloccate dal CDP per suite: 159 target, 135 visibili, 111 minimizzati soli, 275 regressione296, 63 parity touch. I due output touch pass:false dei runner di diagnostica desktop indicano la vecchia priorita mobile, non un FAIL della regressione. Nessun test reale Safari/iPhone, nessuna verifica diretta dei provider tile, nessuna certificazione complessiva dei 38 dialog.

Esito: AUTOMATED BROWSER QA GIS-MINIMIZED-HELP-TOOLS-ESCAPE-PRIORITY-D PASS. QA FINALE CHATGPT PENDING. Nessun QA OPERATORE PASS 297 ricevuto.
