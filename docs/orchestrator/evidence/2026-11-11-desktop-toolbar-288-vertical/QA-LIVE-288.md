# Automated Browser QA LIVE Build 288 — colonna verticale

**Data:** 2026-11-11 12:42:59 Europe/Rome. **Metodo:** Edge/Windows tramite CDP da AsusDesktop sul documento HTML reale HTTPS /gis, NO document injection; viewport desktop 1440x900, 1366x768, 1920x1080, 1024x768, 960x650 e mobile emulato 390x844. SHA HTML ce97e3b72e2e17e383417c777509889cd74cebe144f6751f4fda89829f28209b, 11.116.411 byte, Build 288.

**Risultato 62/62 PASS**, zero FAIL; POST 0, 462 richieste verso provider esterni bloccate. Console e pageerror non raccolti separatamente, non dichiarati zero.

- Layout desktop: 12 comandi in una sola colonna VERTICALE sulla destra, pulsanti circa 62x44, targhette sempre presenti sotto l'icona. Nessuna sovrapposizione orizzontale, tutti raggiungibili.
- Short screen 960x650: max-height/scroll interno verificati; ultimo comando (GPS) raggiungibile all'interno della viewport. A 1024x768 barra scorrevole se necessario.
- Poligoni clic diretto con propria evidenza attiva; Traccia non attivata. R&B clic diretto con stato proprio; Traccia resta spenta.
- Traccia clic reale: classe active e aria-pressed true; secondo clic torna spenta. Livelli apre il popup, Nuovo punto accessibile.
- Mobile emulato a 390px: targhette nascoste e sottomenu originali preservati. Nessun test fisico telefono, sviluppo mobile sospeso.
- 62 sono controlli anche ripetuti su viewport diversi, NON 62 dialoghi distinti. QA umana ancora pendente.

GATE QA OPERATORE DESKTOP GIS-DESKTOP-RIGHT-TOOLBAR-LABELS-A-FIX3 PENDING.
