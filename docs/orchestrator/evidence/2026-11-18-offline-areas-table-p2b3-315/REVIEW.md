# REVIEW Build315 / P2-B3 — Aree offline desktop

Data: 18 novembre 2026. BLOCK GIS-OFFLINE-AREAS-TABLE-COLUMNS-P2B3, categoria DELICATO perché si estendono preferenze persistite in settings.
Profilo: CLOSURE STANDARD_RUNTIME_BUNDLE. REVIEW GPT-SOSTITUTIVA PASS prima del deploy; reviewer AI esterno NOT_PERFORMED/backstop post-hoc ancora aperto.

## Identità immutabile

- Sorgente FULL_SHA 92c45c22797979b1f374d1c66b974ce204e54151.
- Blob Git 07c55db6986e6be2886582d8446e4c5482b4f7d2.
- SHA-256 ee2941001ca693d769df093d1e041e6cf5b33f94280bea7ac3383b6fe0aaccef.
- 11.241.529 byte, CR192/CRLF0, +156/-120, unico monolite HTML. Sorgente git show byte-identico al candidato.

## Checklist delle categorie a rischio

1. **Persistenza**: solo settings.offlineAreaColumnWidths e settings.offlineAreaSort nella stessa STORAGE_KEY; nessuna nuova chiave, migrazione o storage esterno. Whitelist rigorosa dieci colonne, numeri finiti, min/max, serializzazione e lettura filtrata da sanitizer; sort tra otto chiavi e direzione enum asc/desc.
2. **Integrità aree e tile**: questa modifica non tocca state.namedAreas[], la cache, IndexedDB, service worker, download, precache, audit, eliminazioni o inventario tile. Sorting solo su copia areas.slice() già esistente, selezione per ID, metadata originale invariato, nessun GPS. Il codice nuovo non fa fetch di rete e preserva OPSEC Strict/offline.
3. **UI**: due nuove maniglie Sel./Vis. sommate a otto esistenti, totale 10/10. Otto intestazioni già sortable conservate. Limiti di larghezza, scorrimento orizzontale; solo desktop, nuove maniglie nascoste sul mobile in PAUSA.
4. **Transazioni preferenze**: pointerup e sort click fanno saveStoreReported e readback delle sole preferenze. Errore: rollback memoria/UI e raw localStorage precedente, evidenza fallimento non occultata. Non cambia la semantica di visibilità né di selezione.
5. **Prove Edge isolate candidate**: 98/98 PASS; 73 click nativi, 10 eventi file chooser, zero POST, zero eccezioni/console. 10 drag, 8 sorts asc/desc, checkbox singola/tutte, reload persistenza, test whitelist e QuotaExceeded forzata con rollback. Quattro aree sintetiche create con normalizeOfflineArea, senza download/verify/clear; metadata invariato dopo sort e reload. Rigiocati 82 test regressione Build311–314. Pulizia dati origin PASS; alcune cartelle profilo Edge non rimosse (profileDirectoryRemoved=false), non alterati permessi.
6. **Finding runner**: una prima prova non ha compilato per conflitto di variabile di test, la seconda ha fatto 84 controlli e si è fermata per nome errato nella stampa del risultato; entrambe risolte senza cambiare runtime. La suite finale completa 98/98 PASS. Non nascondere tentativi intermedi.
7. **Limiti**: P2-B4 Range rings e P2-C Preferiti/Astro/Batch ancora aperti, oltre eventuali elenchi dinamici. Accuratezza DTM 5–10m terreno HOLD; mobile PAUSA.

## VERDETTO

REVIEW GPT-SOSTITUTIVA PASS sul sorgente FULL SHA e 19 controlli statici, prima del deploy. Reviewer esterno NOT_PERFORMED/backstop. NEXT: backup Build314, deploy GIS-only, hash file/HTTP/HTTPS, ABQA LIVE 98/98 e solo dopo QA operatore. Non attribuire PASS umano.
