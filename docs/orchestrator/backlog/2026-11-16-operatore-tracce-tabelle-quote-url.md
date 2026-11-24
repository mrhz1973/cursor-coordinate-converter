# Backlog operatore TMAR GIS - 16 novembre 2026

Fonte: richiesta operatore nella chat corrente e screenshot tabella Tracce salvate. Questo file e BACKLOG, non prova di implementazione. FRONTIER e la LIVE STATE. Build308 FIX1 rimane LIVE con QA operatore PENDING; non aprire nuovi blocchi runtime prima del gate.

## P1 - Importazione batch fino a 10 tracce in archivio (DA IMPLEMENTARE)

Evidenza Build308: il file input inferiore trackArchiveFileInput non ha attributo multiple; trackArchivePreparePreview accetta un solo file e usa h.files=[row]. Esiste invece selezione multipla nel modulo generale Import GIS, ma non nella finestra semplificata Traccia.

Acceptance: Importa file SUPERIORE carica una sola traccia nella Traccia in modifica, visibile sulla mappa e modificabile. Importa file INFERIORE seleziona fino a 10 tracce distinte in una sessione, anche file multipli o file con percorsi separati: una riga/nome/quote per traccia nell'archivio, senza fonderle e senza sovrapporle automaticamente sulla mappa. La mappa si aggiorna solo dopo azione esplicita Mostra o Centra; indicatore Vis. coerente. Anteprima compatta per file/traccia, Importa tutte / Annulla.

Transazioni: valida prima punti, nomi, quote, cap e numero; commit all-or-none con snapshot, rollback su errore, persist verify per ogni traccia, zero mutazioni di waypoint/poligoni o draft quando si archivia. QA su 1/10/11 tracce, file misti GPX/KML/GeoJSON, quote parziali, multi LineString, duplicati, fallimento scrittura, riapertura e export. Il percorso tecnico attuale di Import Hub usa visible:true: da correggere nello scope batch, non modificare senza gate.

## P2 - Colonne e selezione omogenee in TUTTE le liste/tab

Inventario iniziale statico del monolite Build308: 15 occorrenze di tag table, incluse tabelle di diagnostica e aiuto; NON equivalgono a 15 tab operative. Contesti rilevati: Tracce salvate, waypoint, preferiti, aree offline, poligoni, anelli/range rings, selettori Astro e batch; censire ciascuna tab e tutti gli elenchi che non usano table.

Requisiti per ogni lista operativa: checkbox riga e selezione multipla/tutte; sort ascendente/descendente per testo, numeri, date e stati dove appropriato; larghezza di TUTTE le colonne regolabile, anche oggi fisse (Nome, Pti, Data, Distanza, Vis., Azioni ecc.) con minimi per icone e selezione; persistenza delle preferenze solo tramite canali autorizzati, scroll orizzontale su finestre corte; Centra, Modifica, Elimina e azioni categoria dove applicabili, senza inventarle su tabelle informative.

Gate: MATRICE tab/pannello x colonna x ordinamento x resize x checkbox x azioni, prova clic/trascina e reload per ogni tab; non dichiarare tutto completato dalla scansione preliminare. La modifica e molto ampia: audit prima, poi bundle e QA per categorie secondo metodo, senza toccare aree non correlate. Telefono PAUSA.

## P3 - Profilo altimetrico calcolato su tracce senza quota

Per GPX/KML/GeoJSON solo XY, pulsante esplicito Calcola quote da terreno nella funzione Profilo. Utilizzare provider/dataset gia autorizzati con consenso rete esplicito, o DTM offline disponibile; niente fetch silenzioso in OPSEC strict/offline. Nel runtime esiste fetchElevation che consulta Open-Meteo Elevation soltanto quando internetApiFetchAllowed; NON assumere che GraphHopper sia il DEM. Mostrare la provenienza in chiaro: Quote originali Garmin/GPX/KML oppure Profilo calcolato da provider X, risoluzione/copertura/limiti quando noti. Mantenere quote originali e quelle stimate distinte, missing data espliciti, geometry hash e sanitizer, test rollback/reload. Precisione DTM terreno 5-10 m rimane HOLD fino a prova indipendente; non promettere accuratezza dei tratti brevi.

## P4 - Menu Nuova traccia (Build329 CANDIDATE QA/REVIEW PASS / DEPLOY PENDING)

[Review Build329](../evidence/2026-11-24-track-new-unified-329/REVIEW.md).

Decisione 24/11/2026: «ok vai avanti» alla proposta Build329. [Contratto](../evidence/2026-11-24-track-new-unified-contract/CONTRACT.md). Il testo seguente conserva il requisito e il precedente rinvio come storico.


Un solo pulsante con QUATTRO scelte: Per punti; Con pennello; Pianifica percorso GraphHopper; Pianifica percorso OpenRouteService. Riutilizzare i gestori dei due planner esistenti; nessuna nuova build per questo punto adesso. Il nome tecnico verificato e GraphHopper (l'operatore ha detto Grasshopper).

## P0 - Un solo link operativo HTTPS, nessuna eliminazione rischiosa

Unica URL operativa dell'operatore: https://ionos-n8n-new.tailc01234.ts.net/gis?v=50dcedce ; origine stabile HTTPS tailnet. Il parametro v e un cache-buster che puo cambiare nei release futuri, senza cambiare origine e dati browser.

Verifica diretta 16/11: l'HTTP tecnico http://100.99.54.93:8000/coordinate_converter%20Claude.html e il preferito HTTPS servono gli stessi 11.200.744 byte, SHA256 50dcedce9e51549f36136742bfd0dab4816ce7019710c969f06007ddaed95882. NON sono due runtime o due repository GitHub. Non cancellare il monolite, origin/main, commit, backup e references storiche tecniche. Il backend HTTP serve verifiche interne e non va rimosso per eliminare un collegamento browser.

Le due origini conservano localStorage/cache separati. Prima di eliminare i dati dell'origine HTTP sul PC effettivamente usato: inventario, backup verificato e confronto con dati HTTPS (savedTracks, mapWaypoints, poligoni e impostazioni); migrare eventuali dati unici; solo dopo pulire ESCLUSIVAMENTE i dati del sito HTTP, non browser intero. NESSUNA CANCELLAZIONE effettuata; inventario dati HTTP non ancora acquisito. Pubblicare nei documenti per l'operatore solo l'HTTPS, conservando le informazioni HTTP necessarie a infra/storico.

## Sequenza

1. Gate corrente: QA umana FIX1 Build308 ancora PENDING, nessuna attestazione fittizia.
2. Dopo QA PASS e Regola H: implementare batch/visibilita come bundle DELICATO separato con proof storage.
3. Audit completo tabelle e successivi bundle UX.
4. Profilo quota stimata con OPSEC/provider/provenienza e DTM terreno HOLD.
5. Menu unico Nuova traccia solo quando il backlog futuro e riaperto.

Invarianti: HTML standalone, CSS/JS inline vanilla, zero framework/TS/npm/bundler, OPSEC strict, offline, rete opt-in, state.mapWaypoints[] canonico, non modificare altre aree.
