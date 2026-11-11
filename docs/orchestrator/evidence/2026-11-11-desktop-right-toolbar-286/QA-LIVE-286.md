# Automated Browser QA LIVE — Build 286

Metodo: Edge headless Windows AsusDesktop via CDP; HTTPS /gis **nativo**, nessuna sostituzione HTML, profili browser temporanei isolati. Risposta HTTPS SHA256 af28f2585016c495362a5046ee9d0c4a3a75f0d27cdbf1c750807e1511b4e63c, 11.115.294 byte verificata.

**Risultato: 33/33 PASS, zero FAIL**, 0 POST, 402 richieste esterne bloccate.

- 1440×900, 1366×768, 1920×1080, 1024×768: griglia desktop a due colonne, 12 controlli etichettati visibili nel viewport.
- Poligoni e R&B aprono direttamente il proprio pannello; Nuovo punto azionabile; Livelli popup funziona.
- Waypoint desktop contiene SVG inline, nessun IMG esterno nel suo pulsante.
- 390×844: emulazione mobile, etichette nuove nascoste, vecchio markup IMG e controlli di espansione preservati.
- Nessun test su telefono fisico. Console/pageerror non rilevati separatamente: non dichiarati zero.
- Non è una verifica generale delle 38 finestre.

GATE: QA OPERATORE DESKTOP Build 286 PENDING.
