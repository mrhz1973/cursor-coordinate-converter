# Automated Browser QA LIVE — Build 292

**Metodo:** Edge headless Windows AsusDesktop, CDP su HTTPS /gis nativo; documento realmente servito, nessuna sostituzione HTML. Profilo temporaneo, provider esterni bloccati. SHA256 a71206104ac0944edac4da5ffecece4321cddea53c9fb016160f2866e2af8917, 11.120.400 byte.

- **16/16 PASS** geometria desktop, viewport 960×540, 960×650, 1024×600, 1280×720, 1366×768, 1440×634, 1440×900 e 1920×1080. Toolbar all inizio e fine scroll, GPS accessibile, nessun overlap; readout/attribuzione in posizione originaria inferiore destra, distanza GPS↔PUNTO ≥44px dove PUNTO visibile. POST zero, 319 richieste esterne bloccate.
- **9/9 PASS** nome TMAR GIS Tool in scheda browser, intestazione, footer e meta application-name, incluso viewport mobile 390×844. Regressione layout mobile 1/1 PASS.
- **17/18 branding selftest**: 17 controlli operativi PASS, il check storico BRAND_build_214 hardcoded Build 234 resta FAIL come nella baseline 291; non nuovo errore e non viene dichiarato PASS totale.
- **76/76 PASS** regressione grafica dual-groups/nav blu/teal e toolbar, criteri di test adeguati al nuovo bottom235px; 0 POST, 478 richieste esterne bloccate.
- **25/25 PASS** Waypoint chiusura/salvataggio draft, 0 POST, 304 risorse esterne bloccate.

Totale controlli geometrici/funzionali 117/117 PASS (16+76+25), più 9 verifiche branding e 1 verifica layout mobile. Non sono 117 dialoghi GIS diversi. Console/pageerror generali non raccolti separatamente; provider esterni non testati; telefono fisico non testato.

**GATE:** QA OPERATORE DESKTOP Build 292 ancora PENDING. L approvazione visiva della posizione non viene dedotta dai risultati tecnici.
