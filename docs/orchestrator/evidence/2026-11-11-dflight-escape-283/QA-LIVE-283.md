# ABQA LIVE Build 283 — HTTPS nativa

**Data:** 11 novembre 2026. **Metodo:** Edge/Windows su AsusDesktop, profilo browser temporaneo isolato; URL HTTPS realmente servita `https://ionos-n8n-new.tailc01234.ts.net/gis`, nessuna sostituzione o iniezione HTML. Viewport 1440×1000.

Runtime identificato come `GIS-DFLIGHT-MINIMIZED-ESCAPE-A · build 283`. SHA-256 della risposta HTTPS verificato separatamente via curl Windows e via VPS: `dbdc54753722bee425d9c4e6528455ef7b72d946b69e747ae109621de414ea24`, 11.108.965 byte. **Risultato QA: 17/17 PASS**, POST 0, 305 richieste accessorie bloccate; non sono stati raccolti separatamente console generale e pageerror (non dichiarati zero). Nessuna chiamata reale a provider esterni.

| Caso | Esito |
| --- | --- |
| T00 identificazione Build 283 nativa | PASS |
| T01 D-Flight aperto da menu Layer | PASS |
| T02 minimizzazione + chip | PASS |
| T03 Escape con solo D-Flight minimizzato | PASS |
| T04 Mappe Offline visibile | PASS |
| T05 Escape chiude Offline, preserva D-Flight minimizzato | PASS |
| T06 ripristino dal chip | PASS |
| T07 Escape chiude D-Flight visibile | PASS |
| T08 riapertura pulita | PASS |
| T09 × chiude senza chip fantasma | PASS |
| T10 due pannelli visibili | PASS |
| T11 Escape prioritario Mappe Offline | PASS |
| T12 Escape successivo chiude D-Flight | PASS |
| T14 D-Flight minimizzato prima di Poligoni | PASS |
| T15 Poligoni visibile, apertura reale da menu Traccia | PASS |
| T16 Escape chiude Poligoni con D-Flight minimizzato | **PASS — correzione rispetto al FAIL 282** |
| T13 assenza POST | PASS |

La prova è automatica, non equivale a PASS operatore. Connettività HTTPS dal PC AsusDesktop: precedenti richieste iniziali incomplete, poi GET completo verificato e questa prova nativa completata. Nessun test telefono reale (sviluppo mobile in pausa).
