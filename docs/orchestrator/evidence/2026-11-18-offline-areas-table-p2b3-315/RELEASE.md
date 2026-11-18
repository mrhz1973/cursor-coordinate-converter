# Build315 LIVE — P2-B3 tabella Aree offline

Data deploy: 18 novembre 2026, 09:35:08 UTC (10:35 Europe/Rome).
Block: GIS-OFFLINE-AREAS-TABLE-COLUMNS-P2B3.
Profilo CLOSURE: STANDARD_RUNTIME_BUNDLE. Categoria DELICATO per preferenze in localStorage canonico.
Gate: REVIEW GPT-SOSTITUTIVA PASS, JS inline 2/2, Edge candidato 98/98 e HTTPS LIVE 98/98 PASS. QA FINALE CHATGPT / operatore PENDING. Reviewer AI esterno NOT_PERFORMED; backstop post-hoc aperto.

## Scope implementato

- Pannello Mappe Offline / Aree offline salvate: 10 intestazioni Sel., Vis., Nome, Stato, Data, Zoom, Strato, Tile, Spazio e Azioni con separatore ridimensionabile sul desktop. Le prime due maniglie sono nuove; le altre otto riutilizzano i controlli preesistenti.
- Le otto intestazioni Vis., Nome, Stato, Data, Zoom, Strato, Tile e Spazio conservano il sort crescente/decrescente, ora persistito in settings.offlineAreaSort. Righe visualizzate da copia state.namedAreas.slice(), senza alterare ordine/metadata originali. Selezione riga/Seleziona tutte resta per ID.
- Larghezze persistite in settings.offlineAreaColumnWidths sotto la sola STORAGE_KEY preesistente; whitelist di dieci chiavi, valori typeof number + Number.isFinite, clamp min/max; readback e rollback sulla scrittura fallita. Nessuna nuova origine o migrazione, nessuna modifica a tile, IndexedDB, service-worker, download o audit. OPSEC Strict/offline rimangono invariati.
- Nuove maniglie invisibili sul mobile (sviluppo telefono in PAUSA); nessun framework, GPS silenzioso o chiamata di rete nuova.

## Identità e deploy GIS-only

- Source commit runtime: 92c45c22797979b1f374d1c66b974ce204e54151.
- Blob Git: 07c55db6986e6be2886582d8446e4c5482b4f7d2.
- SHA256: ee2941001ca693d769df093d1e041e6cf5b33f94280bea7ac3383b6fe0aaccef.
- File: coordinate_converter Claude.html, 11.241.529 byte, CR192/CRLF0, standalone vanilla.
- Review predeploy su GitHub origin/main: 4659cd9ab609d0df5fc285bc3b49fc76a6f2caed.
- VPS prima: HEAD 913c24acb7463fc198222a2e12b7532fe41f5651, Build314, servizio PID1450249.
- Backup verificato Build314: /var/backups/goi-gis-runtime/prebuild315-7FdQ5EdT, SHA256 9fba532f5dec9e8aee2833da78997055819326d44b7d356bbbb12ba545c39e37.
- VPS dopo: fast-forward a 4659cd9ab609d0df5fc285bc3b49fc76a6f2caed, worktree pulito; un solo restart goi-gis-app.service, active/running, PID1609084 dal 18/11/2026 09:35:08 UTC.
- VPS file, HTTP interno 100.99.54.93:8000 e HTTPS LIVE: 11.241.529 byte e hash identici.
- URL Build315: https://ionos-n8n-new.tailc01234.ts.net/gis?v=ee294100.

## Evidenza review e browser

- [Review GPT-SOSTITUTIVA](REVIEW.md): checklist DELICATO 19/19 PASS sul sorgente immutabile; reviewer esterno NOT_PERFORMED / backstop.
- [Candidato 98/98](candidate-qa.json), [LIVE HTTPS 98/98](live-qa.json), 73 clic nativi, 10 selezioni file, 0 POST, zero eccezioni/console.
- Prove 10 drag, 8 sort asc/desc, selezione riga/tutte, reload preferenze, errore forzato QuotaExceeded e rollback, whitelist rigida e metadati aree invariati. Quattro aree fittizie normalizzate; NON premuto Scarica, Verifica, Svuota cache o Elimina, nessun download effettuato. Regressioni Build311–314 positive. Dati browser isolati rimossi (dataCleanup PASS), alcune directory temporanee Edge non eliminate (profileDirectoryRemoved=false), nessun permesso cambiato.
- [Evidenze schermate](screenshots-manifest.json). Il primo runner era in errore di dichiarazione variabili, poi un refuso nel reporting; corretti senza mutare runtime. Esecuzioni finali candidate/live 98/98 PASS.

## Gate operatore — PENDING

1. Aprire Mappe Offline, scorrere a Aree offline salvate. Trascinare i bordi delle dieci intestazioni; usare lo scroll orizzontale per raggiungere le ultime.
2. Fare clic due volte su Nome, Stato, Data, Zoom, Strato, Tile e Spazio per alternare crescente/decrescente. Selezionare una riga e usare la checkbox generale, senza scaricare o cancellare tile.
3. Ricaricare la pagina e verificare larghezze e ordinamento preservati, non cambiare metadati e non avviare precache.

Solo dopo prova positiva, attestazione canonica: QA GIS-OFFLINE-AREAS-TABLE-COLUMNS-P2B3 PASS operatore. Non dedurre PASS dall'ABQA.

## NEXT non completati

P2-B4 Range rings e P2-C Preferiti/Astro/Batch, oltre agli elenchi dinamici utili. Il P2 complessivo NON è chiuso. Non aprire un nuovo runtime prima della QA P2-B3. Sviluppo mobile PAUSA, DTM terreno accuratezza 5–10m HOLD, menu Nuova traccia FUTURO.
