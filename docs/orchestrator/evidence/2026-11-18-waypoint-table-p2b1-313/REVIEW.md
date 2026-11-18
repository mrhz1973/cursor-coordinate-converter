# REVIEW Build313 / P2-B1 — Waypoint table desktop

Data: 18 novembre 2026. Categoria DELICATO (nuovi campi persistiti sotto settings canoniche).
Blocco: GIS-WAYPOINT-TABLE-COLUMNS-P2B1. CLOSURE: STANDARD_RUNTIME_BUNDLE.
Reviewer AI esterno NOT_PERFORMED; review GPT-SOSTITUTIVA eseguita per categorie sul sorgente FULL_SHA e prove Edge; backstop post-hoc esterno ancora aperto.

## Identità immutabile

- Source commit FULL SHA: 2d4518c297ea977caf79177075ba031053a568b5.
- Git blob: d1027751adc4e095f70fd064f3c8e491aef1df9c.
- SHA256 LF: 5cb7989947a2095f9f1499a87828b3929e25167c03d1836fe93de763d06ac242.
- 11.236.623 byte, CR192/CRLF0; delta +203/-88, un solo HTML cambiato, sorgente git show byte-identico al candidato.

## Checklist rischi e regressione

1. **Storage/sanitizer**: wpTableColumnWidths e wpTableSort persistiti soltanto dentro settings dell'unico STORAGE_KEY, senza nuovi nomi di storage. Strict numeric widths con typeof number+isFinite, clamp per i sei identificatori selezionati; sort chiave enum name/when/details e direzione asc/desc. Load attraverso sanitizer, dati malformati respinti. Il salvataggio delle preferenze non modifica i waypoint o i poligoni.
2. **Ordinamento**: unicamente ordine *di presentazione* (points.slice().sort); name con localeCompare, date tramite timestamp numerico updatedAt/createdAt, details con lat/lon numerici e tie-break ID stabile. Nessun aggiornamento dell'ordine state.mapWaypoints[] canonico; la selezione usa sempre ID stabili.
3. **Resize/layout**: sei resizer Sel./Vis./Nome/Data/Dettagli/Azioni con minima 36/44/72/72/96/248px, limite massimo per colonna, scroll orizzontale nel pannello. Pointer fine-only; nessuna perdita di click dei pulsanti esistenti. Nuovi bottoni di sort e resizer non presenti/visibili su mobile (PAUSA).
4. **Funnel persist e rollback**: pointerup tramite saveStoreReported + readback esatto del campo; simulata quota di storage fallita e rollback preference + raw precedente. Sort con conferma e rollback su errore. No nuovo create-path GIS, GPS, fetch, provider, tracking o bundle/framework.
5. **QA browser candidato**: Edge CDP isolato 65/65 PASS, 38 clic nativi, 10 file chooser, zero POST, eccezioni/console. Ripetuti regressione completa Build311 (import 10, quote parziali, rollback) e Build312 (7 resize/save/reload/sort/select, poligono save/export/import/reload). Waypoint: 6 drag native, tre sorts (name/date/numeric coords), toggle asc/desc, checkboxes row/all, save/reload widths/sort/coordinate, malformazioni whitelist, QuotaExceeded forzata, mobile layout invariato. I test hanno rispettato un waypoint sintetico preesistente; nessuna cancellazione di dati reali. Cleanup dati origin PASS; alcune directory temporanee Edge non eliminate.
6. **Scope**: P2-B1 è solo tabella Waypoint. Poligoni, aree offline, Range rings (P2-B2/B3/B4), più P2-C Preferiti/Astro/Batch, ancora aperti. Precisione DTM5/10m terreno HOLD, mobile PAUSA.

## Verdetto

**REVIEW GPT-SOSTITUTIVA PASS** su FULL_SHA immutabile, prima del deploy. Reviewer esterno NOT_PERFORMED; backstop post-hoc resta aperto.
Gate successivi: backup Build312, deploy GIS-only Build313, hash VPS/HTTP/HTTPS, automated browser QA HTTPS della Build313, infine QA operatore. Non anticipare PASS umano.
