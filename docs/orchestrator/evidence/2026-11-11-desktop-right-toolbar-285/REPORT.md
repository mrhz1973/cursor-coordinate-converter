# Build 285 — barra strumenti destra desktop, icone e targhette visibili

**Data registrazione:** 2026-11-11 09:33:15 Europe/Rome. **Stato:** PREDEPLOY, candidata pubblicata su ramo isolato.

## Obiettivo e risultato
Su Windows desktop GIS visualizzare direttamente tutti i controlli della colonna destra, senza sottomenu per Poligoni, Range & Bearing, Nuovo punto; targhette sotto ciascuna icona. Il mobile non deve variare, né la logica di strumenti, dati o servizi.

| Identità | Valore |
| --- | --- |
| Branch code | `task/gis-desktop-right-toolbar-285` |
| Commit source | `7a65a39530691a80b067700e88c0eca4a3ac8a29` |
| Base main | `61e6e50f644d39262481f4970ad64fb6d5467b14` |
| Blob | `e2c5a304ad84fafad7d95d1371bc8fed14c6789a` |
| SHA256 / bytes | `8a0ac1b4a0cf688d26dc2c94f88803187db64fa75aad1abc664446b00406847d` / 11.114.653 |
| File interessato | solo `coordinate_converter Claude.html` |
| Terminatori | 192 CR isolati invariati |
| Review | ROUTINE UI, 19/19 PASS |
| QA candidata | 28/28 PASS, Edge, 5 viewport |
| RUNTIME LIVE al checkpoint | Build 283, invariata |

## Perimetro
17 sostituzioni mirate: metadati build; didascalie brevi sotto Livelli, zoom +/−, Zoom area, Livello, Misura, Traccia, Poligoni, R&B, Waypoint, Nuovo punto, GPS e Ricentra se disponibile. CSS aggiunta in unico blocco dentro HEAD con media query `min-width:960px`, `hover:hover`, `pointer:fine`. A desktop i due flyout Traccia/Waypoint sono presentati come pulsanti in linea usando il DOM, data-role e handler già esistenti (nessun duplicato listener). Barra a due colonne, pulsanti 62 px con labels 10.5px. Layers mantiene popup classico, verificato.

Mobile a 390x844: caption invisibili, frecce espandibili e comportamento originale. Nessuna modifica a GPS live tracking, storage, servizi, network, OPSEC, routing, geometrie, mapWaypoints, logica close dialog, conversione, i18n.

## Gate e limiti
- Node.js check due script inline PASS; byte-diff reverse PASS; diff --check e CR PASS.
- QA Edge HTTPS candidate-injected-document: 28/28 PASS, 0 POST, 450 accessorie bloccate, browser headless 1440x900/1366x768/1920x1080/1024x768/390x844, [dettaglio](QA-CANDIDATE-285.md).
- Review routine mirata su source Git FULL SHA: 19/19 PASS, [report](REVIEW-285.json).
- **Non** dichiarare QA nativa post-deploy, deploy o PASS operatore fino a esecuzione specifica. Le 28 prove non attestano tutte le 38 finestre.
- Prossimo gate: pubblicazione main, preflight, deploy GIS-only (backup, pull FF, restart del solo GIS, SHA HTTP/HTTPS), ABQA HTTPS nativa, poi QA umana corta e mirata.

Ramo Escape 284 già preparato resta separato e non distribuito. Telefono in pausa.
