# REVIEW Build314 / P2-B2 — Poligoni desktop

Data: 18 novembre 2026. Block: GIS-POLYGON-TABLE-COLUMNS-P2B2.
Tier DELICATO: nuovi campi persistiti nella storage canonica. CLOSURE STANDARD_RUNTIME_BUNDLE.
REVIEW GPT-SOSTITUTIVA PASS prima del deploy. Reviewer AI esterno NOT_PERFORMED; backstop post-hoc aperto.

## Identità review immutabile

- Source commit FULL SHA ff1db25a4242b8258c4de7c9a705af0197f26d32.
- Git blob 1523fe5b32b7293f407ee3bf3083f8d39fbfe39e.
- SHA256 9fba532f5dec9e8aee2833da78997055819326d44b7d356bbbb12ba545c39e37.
- 11.239.262 byte, CR192/CRLF0; delta +152/-95 in un solo monolite HTML; git show byte-identico al file candidato.

## Checklist categorie DELICATO

1. Storage e sanitizer: due campi polygonPanelColumnWidths e polygonPanelSort soltanto sotto settings del vecchio STORAGE_KEY. Strict numeric typeof number e isFinite, min/max/clamp per nove campi in whitelist. Sort enum vis/name/vtx/area/perim/when, direzioni asc/desc; dati malformati respinti.
2. Geometrie: nessun create-path nuovo o geometria modificata. Ordinamento su copia con slice e tie-break ID; nessuna mutazione a state.gisPolygons, state.mapWaypoints o savedTracks.
3. UI: nove resizer sel/vis/name/vtx/area/perim/style/when/actions, sei sort esistenti conservati, checkbox e azioni originali conservate; minimi su selezione e pulsanti. Corretto il conflitto reale del resizer Azioni con la maniglia esterna del pannello tramite posizionamento interno di 30px. Handle su desktop, nuovo handle selezione nascosto sul mobile.
4. Salvataggio/rollback: saveStoreReported su pointerup e sort, readback esatto di settings, rollback in-memory/DOM e raw localStorage se il salvataggio fallisce. Nessun fetch/provider/GPS implicito, OPSEC/offline invariati.
5. Browser QA candidata: Edge CDP in profilo isolato, 82/82 PASS, 53 clic nativi, 10 file chooser, zero POST/eccezioni/console, data origin cleanup PASS. Nove drag, sei sort asc/desc, checkbox, reload, whitelist, QuotaExceeded forzato, geometrie invarianti, GeoJSON roundtrip export/import parser. Regressioni Build311,312,313 mantenute.
6. Finding registrati: prima esecuzione runner con riferimento a state nel Node host; successiva runner senza scroll orizzontale esplicito; una prova ha identificato vera sovrapposizione della maniglia Azioni con resize pannello, corretta CSS. Esecuzione finale 82/82 PASS. Directory Edge temporanee residue (profileDirectoryRemoved=false); origin test data ripuliti.
7. Scope: P2-B3 Aree offline, P2-B4 Range rings e P2-C Preferiti/Astro/Batch ancora APERTI. DTM terreno accuratezza 5–10m HOLD, sviluppo mobile PAUSA.

## Verdetto

REVIEW GPT-SOSTITUTIVA PASS sul source FULL SHA sopra; reviewer esterno NOT_PERFORMED/backstop post-hoc. NEXT: backup Build313, deploy GIS-only, hash VPS/HTTP/HTTPS, ABQA HTTPS LIVE 82/82 e successiva QA operatore distinta.
