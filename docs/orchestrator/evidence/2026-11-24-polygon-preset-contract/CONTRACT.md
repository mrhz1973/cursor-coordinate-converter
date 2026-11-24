# Build328 — GIS-POLYGON-PRESET-SHAPES-A

Decisione operatore: «vai vanti» in risposta alla proposta esplicita di sblocco forme geometriche e avvio Build328 (24/11/2026). Autorizzazione circoscritta a quadrato, rettangolo, triangolo. Il resto di Oggetti GIS resta FROZEN / MAINTENANCE-ONLY.

Base: f116dcebad3f2146e7752af6a565de2a3cb93949, Build327 CLOSED, SHA256 2b9e3c354f8179b0aabeb16b65abc8bc03604fc98ec2bf3bcd56c6b6a917ab3d. Categoria DELICATO leggero: create path e interazione draft, persistenza canonica.

UX: selezione Forma (Libero default, Quadrato, Rettangolo, Triangolo); Nuovo poligono arma il tool esistente. Tre click/tap: quadrato/rettangolo lato iniziale A-B (dimensione + orientamento) e terzo punto lato di sviluppo o altezza perpendicolare; triangolo tre vertici. Geometria regolare nella proiezione Web Mercator, non geodetica. Non si promette precisione metrica su terreno. Preview read-only per mantenere la forma; undo rimuove ultimo anchor, cancel scarta, Chiudi poligono salva esplicitamente. Dopo save, normale edit poligono. Il freehand e il relativo snap restano invariati.

Guard: nessuna auto-creazione o schema persistente nuovo; usare esclusivamente polygonFinishDraw/gisFeatureAdd("polygon", ...) e il sanitizer a sette decimali esistenti; invalidi/degeneri/polar-bound/cross-antimeridian rifiutati prima del salvataggio, no ring globale accidentale. Snap read-only ai waypoint dove applicabile agli anchor, nessuna modifica ai waypoint. Chiudi su draft non vuoto resta protetto Build326. No nuovi endpoint, storage keys, GPS, OPSEC o provider. Niente P0/P4/DTM.

Acceptance: test geometria proiettata orientata, quadrato lati uguali e ortogonali, rettangolo lati opposti/ortogonali, triangolo tre distinti; no degeneri; input trusted mouse/touch sui viewport supportati, undo, cancel, finish non prematuro, no extra click dopo 3, save/reload/export e edit canonico, freehand/snap regressione, dirty close. Test dati sintetici isolati; review raw@FULL_SHA, deploy GIS-only backup, QA HTTPS LIVE prima di QA operatore. Nessun claim universale/device fisici.
