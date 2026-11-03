# QA integrata — runtime candidato 32f2b7a — 2026-11-03

## Identità

- Repository canonico: `mrhz1973/cursor-coordinate-converter`.
- Checkout locale: `b6f84fb3c92689c9bc7cd900241016536fbd6ae0` (sincronizzato con `origin/main` all'avvio della ripresa).
- Runtime candidato locale `coordinate_converter Claude.html`: SHA-256 `32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28`.
- Runtime VPS: resta build 268 secondo `FRONTIER.md`; questo candidato non è stato distribuito.

## Risultati

| Area | Esito sul byte 32f2b7a | Evidenza |
| --- | --- | --- |
| Import GIS | **PASS scoped**: file GeoJSON sintetico con 1 waypoint, 1 traccia e 1 poligono; anteprima e Apply; ricaricamento; export 3 feature; reimport e conteggi 2/2/2. Riselezione dello stesso file e drop: PASS. | Replay locale del 2026-11-03 degli script `2026-11-03-import-filelist-fix/runtime-roundtrip.mjs` e `reselection-drop.mjs`; stesso hash del report toolbar. |
| Parser MGRS | **PASS scoped**: 192.000 prefissi confrontati con la regola UTMRow dichiarata; 10 fixture (ufficiali/checkpoint), 4 celle di confine valide; UI Converti/incolla/Cerca; core 594/594. | Replay locale sul checksum finale con `2026-11-03-mgrs-cell-validity-fix/mgrs-prefix-matrix.cjs`, `mgrs-ui-validation.cjs`, `2026-10-30-qa-final-mgrs/mgrs-core.cjs`. La matrice condivide la trascrizione della regola; i fixture pubblicati sono il riscontro indipendente più forte. |
| Toolbar e controlli Layer | **PASS scoped**: 7/7 didascalie; 1280×900, 390×844 e 320×720; Layer subito sotto header; menu Layer, Esporta, Strumenti e tab Preferiti attivati; nessun overflow del documento o eccezione JS. | `2026-11-03-toolbar-caption-qa/REPORT.md`, screenshot, metriche e risultati sullo stesso hash. Tutte le richieste esterne sono state intercettate e bloccate; cartografia remota non disponibile negli screenshot. |
| Routing/OPSEC simulati | **PASS scoped**: 34/34 scenari e 4/4 transizioni strict/offline, zero errori JS. I payload provider mock hanno mantenuto i filtri; nessuna rete reale usata. | `2026-11-03-routing-final-qa/REPORT.md`, runner e JSON sullo stesso hash. |
| Diff e sintassi | **PASS**: `git diff --check`; entrambi gli script inline analizzati dalla suite MGRS. | Suite indicate sopra. |

## Limiti e gate ancora aperti

- La prova di selezione usa un oggetto `File` sintetico inviato in Edge via DevTools; non apre il dialogo nativo. File corrotti, KMZ, limiti dimensionali, errori di lettura e concorrenza non sono coperti. La round-trip verifica le geometrie e conteggi supportati, non ogni proprietà o la provenienza MGRS.
- Nessun telefono o tablet fisico, screen reader, né orientamento mobile landscape è stato provato.
- Le prove routing citate sono tutte mock o fixture. Restano da svolgere le prove dei provider reali **attraverso il runtime dell'app** per i casi pertinenti (traghetto/deviazione o assenza rete terrestre, dettagli/snap e modi applicabili). Le precedenti richieste live dirette non sostituiscono questo gate.
- Il browser MGRS storico che contiene l'asserzione obsoleta `waypoint transfer intentionally lacks source` resta `NON_VERIFICATO` sul byte pre-fix; non è contato come PASS né come bug riprodotto.
- Nessun commit/push o deploy è compreso in questa verifica; nessuna modifica VPS.

## Decisione

Le correzioni import, MGRS e toolbar sono verificate sul byte locale corrente e non mostrano regressioni nei controlli elencati. **Il gate complessivo e il deploy non sono PASS** finché manca il routing con provider reali attraverso l'app e la review finale del candidato rispetto ai criteri operativi. Il live resta build 268.
