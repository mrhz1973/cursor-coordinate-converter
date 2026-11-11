# Automated Browser QA candidata Build 288 — layout verticale

Metodo: Edge Windows via CDP, profilo temporaneo; origin HTTPS VPS con documento candidato sostituito in memoria. Server LIVE Build 287 invariato.
Source d4e9821e180f82a33bb506c48b5c1d683a8cb82a, SHA256 ce97e3b72e2e17e383417c777509889cd74cebe144f6751f4fda89829f28209b, 11.116.411 byte.

Risultato **62/62 PASS**, 0 POST, 486 richieste esterne bloccate. Console e pageerror non raccolti separatamente.

- 1440x900, 1366x768, 1920x1080: 12 comandi disposti in un'unica colonna verticale a destra; tagli e sovrapposizioni assenti, label sotto icone, pulsanti 62x44.
- 1024x768 e 960x650: stessi comandi in ordine verticale, scorrimento interno disponibile sugli schermi bassi; a 960x650 ultimo comando raggiungibile.
- Poligoni/R&B clic diretto senza attivare Traccia; Traccia propria attivazione e disattivazione PASS; Livelli menu e Nuovo punto PASS.
- 390x844 mobile emulato: etichette extra non visibili, flyout esistenti preservati.
- Non equivale a 62 dialoghi distinti e non sostituisce QA operatore visiva. Non e test su dispositivo mobile fisico.
