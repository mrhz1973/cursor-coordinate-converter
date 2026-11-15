# Build303 - GIS-GPX-KML-TRACK-ELEVATION-ROUNDTRIP-A

Data 15 novembre 2026, Europe/Rome. Categoria DELICATO: importatore, sanitizer e nuovo campo persistito per tracce salvate. Lavoro di QA/deploy condotto da GPT tramite TMAR Desktop Commander Windows. Il commit runtime era gia stato pubblicato su GitHub main prima del pass: non e stata duplicata l implementazione.

## Identita e sorgente
Parent main 1e96f286166ed44486aa37d2deeee790a12ff9a7, source commit 2f02a24c0320ee44f9814f7378a8392f901d7c75, Git blob d865651a9336afa143b6b040120dd7e4795cfd89. SHA256 monolite 0b117c13a96da9f8c421fba3772c19a297bd002ec60409d19703b329ac83b9f7, 11,165,656 byte, 192 CR e zero CRLF. Unico file modificato coordinate_converter Claude.html; 113 inserimenti e 22 rimozioni (git diff --stat). Build label 303. Nessun framework, npm, bundler, TypeScript o network provider introdotto.

## Modifica effettiva
- Il parser GPX conserva la quota numerica valida della coordinata terza [lon,lat,ele]. I punti senza ele valida restano bidimensionali, non diventano quota zero. Un numero zero o negativo entro limiti numerici accettabili resta valido.
- L importatore per Tracce salvate costruisce l addon importedElevations: schema1, source=spatial-file, geometryHash e array heights con null nei vuoti, in storage passando dal sanitizer. L addon viene validato su caricamento, salvataggio, confronto read-back e esportazione; un cambio di geometria lo rende non valido, senza inventare valori. Restano separati i profili altimetrici DEM/routing gia esistenti.
- L export GPX conserva le quote in wpt, rtept e trkpt quando presenti. Il KML include quote e altitudeMode absolute soltanto su geometrie interamente elevate; su tracce parziali o 2D l output KML resta 2D (quota 0 come prima), mentre GPX conserva i campioni validi e i vuoti.
- Il campo nuovo si applica alle SavedTracks aperte, non a poligoni e non altera state.mapWaypoints[] canonico. Il livello di precisione del DTM regionale 5m NON si applica alle quote importate dal GPX, per le quali l origine e l accuratezza rimangono quelle del file.

## QA candidata
Nel browser Edge CDP con profili test isolati, e stato caricato un candidato HTML su origin HTTPS soltanto nel test (nessuna sostituzione runtime pubblica). Quattro GPX reali individuati sul computer autorizzato: 877+198+706+531 = 2,312 punti, tutti dotati di quota. Round-trip parsing GPX -> FeatureCollection -> GPX, conversione KML 3D e return, addon salvatraccia e invalidazione su geometria mutata 4/4 PASS. Verifiche negative 13/13 PASS: ele zero/negativa, NaN/infinito/missing, GPX misto, KML absolute/clampToGround, partial KML 2D, hash stale, quota out-of-range e legacy track 2D. Poligoni e 2D legacy 5/5 PASS.

Verifica di persistenza in profilo browser temporaneo: 198/198 quote create in un SavedTrack, scritte su localStorage, riaperte dopo Page.navigate e riesportate identiche con GPX. Inoltre testato il vero percorso applyDroppedFeatureCollection con lo stesso file: summary.tracks=1, nessun errore, 198/198 quote conservate in storage e dopo reload; storage del profilo di prova pulito a fine test. Nessuna modifica ai dati di Edge personale, nessun file GPX utente incluso o pubblicato nel repo. Inline JavaScript syntax 2/2, CR192, git diff --check PASS.

## Review
REVIEW GPT-SOSTITUTIVA eseguita esplicitamente sul commit Git FULL SHA: 43/43 controlli PASS, con particolare attenzione a sanitizer e limiti numerici, campo persistito, hash di geometria, ciclo di salvataggio, poligoni e legacy. Reviewer esterno NON ESEGUITO (NOT_PERFORMED), backstop post-hoc quando disponibile. Metodo adottato: Regola B, G e categoria storage della checklist da docs/OPERATING_MEMORY.md, non si attribuisce una review a un soggetto esterno.

## Deploy
Deploy GIS-only da main con working tree pulito, fonte corrispondente, backup verificato di Build302 /var/backups/goi-gis-runtime/20261115T141311Z-build303. Unico restart goi-gis-app.service PID 1427028 -> 3325976; SHA file locale VPS, HTTP interno e HTTPS /gis uguali al runtime303. Primo HTTP dopo restart aveva listener non ancora pronto; retry limitato PASS. Nessun intervento su GraphHopper, ORS, proxy, GPS, servizi condivisi, storage utente o migrazione dei dati.

## QA HTTPS LIVE e limiti
Sulla Build303 realmente servita via HTTPS (senza injection) ripetute 4/4 tracce reali e 2,312 campioni, import applicativo/reload/export 198/198, 13/13 casi negativi, 5/5 poligoni/legacy 2D, 19/19 regressioni altimetriche medie e 18/18 DTM locale 5/10 m; Escape 7/7. Zero POST e zero eccezioni JS nei test conclusivi. Un primo run E2E nativo ha registrato errore generico 'Uncaught' senza dettagli, ma non riprodotto con un retry diagnostico e un ciclo completo PASS: non classificato come bug del prodotto senza evidenza ripetibile; prova iniziale non conteggiata PASS. Dettaglio in QA-LIVE-303.md.

## Gate residui
QA operatore della Build303 su file importato, elenco SavedTracks, riapertura ed export resta PENDING. Non dichiarare che la quota GPX e una pendenza reale su 5m senza DEM pertinente. L accuratezza al suolo della Build302 DTM5/10m resta HOLD, separata da questo bundle. Altri gate umani storici restano PENDING. Sviluppo mobile PAUSA. Non inferire Build304.
