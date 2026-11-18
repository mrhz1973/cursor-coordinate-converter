# Review Build316 — completamento P2 tabelle desktop

Data: 18 novembre 2026. Block: GIS-TABLES-ALL-REMAINING-P2.
Tier: DELICATO — nuove preferenze persistite in settings, checkbox/export selettivo Favoriti.
Profilo: CLOSURE STANDARD_RUNTIME_BUNDLE con QA operatore unica finale su tutti i tab, come da mandato ricevuto.
Verdetto predeploy: REVIEW GPT-SOSTITUTIVA PASS sul sorgente immutabile. Reviewer AI esterno NOT_PERFORMED, backstop post-hoc APERTO.

## Identità del codice verificato

- Source commit FULL SHA: de583b4a1d774544b53b3277c334680f2a973652.
- Blob Git: 025f3ffa9818586c05b602eff29c989974659074.
- SHA256: edf2042254b53852ee7402655b139c698cc09d958be555b397fdc13162525917.
- 11.277.535 byte, CR192/CRLF0, unico HTML standalone; git show byte-identico al workspace.
- Base git origin/main precedente: 486b4c7a163e34827329b1de4df6423c388a0c44 (Build315 live e chiusa).
- Le modifiche originali del workspace esistevano già prima di questo pass e sono state preservate in snapshot locale con SHA256 261cc698011975959eb60168108b46885cc241cba56d14182f7934fdfeacdb06; l'ultima modifica aggiunta in questo pass limita la nuova selezione Favoriti al desktop.

## Checklist rischi

1. **Range rings**: 7 larghezze con whitelist numerica e 5 sort keys, ordinamento su copia del vettore, selection id-based; prefs rrTableWidths/rrTableSort dentro settings della storage canonica, ripristino su errore.
2. **Preferiti**: 5 larghezze e 3 sort keys con whitelist; selezione per ID, seleziona tutte e deselect, export selected in GeoJSON opt-in tramite click del proprietario. Non invia rete, non elimina preferiti né modifica coordinate. Nuovi controlli batch nascosti su viewport mobile/coarse.
3. **Astro waypoint/favorite picker**: larghezze e ordinamenti indipendenti per famiglia con sanitizer; l'azione Usa continua a scegliere un solo target per riga, nessuna checkbox bulk introdotta. Nessuna modifica ai calcoli Astro.
4. **Batch risultati**: 7 colonne potenziali incluso Località opzionale, ordinamento su copia derivata con indici di origine stabili, non riorganizza o modifica input o calcolo. Nessuna nuova azione di delete/rename sui risultati.
5. **Persistenza e rollback**: solo nuovi campi settings sotto l'attuale STORAGE_KEY, whitelist numeric finite e sort enum. Salvataggio con readback, ripristino vecchio raw storage e preferenze on fail, nessun secondo database/migrazione. Geometrie state.mapWaypoints, state.savedTracks, namedAreas/RangeRingSet non modificate dalle azioni P2.
6. **OPSEC/offline**: no nuovo fetch/network provider, GPS, live tracking, service worker, cache delete o IndexedDB. Nessuna modifica ai vincoli OPSEC strict e all'offline.
7. **Automated browser QA candidate**: Edge CDP isolato 134/134 PASS, 79 clic nativi, 10 file selection events, zero POST, zero JS exception e console errors, data origin cleanup PASS. Baseline 98 test importazioni/tracce/waypoint/poligoni/offline + 36 test nuovi RR/Favoriti/Astro/Batch incl sort, resize, click selection, export GeoJSON struttura, reload quattro famiglie, compatibilità mobile. La navigazione al Batch deve usare Strumenti -> Batch, e non Convertitore o tabDrawer; gli errori precedenti del runner furono corretti senza modifica runtime. In un caso profileDirectoryRemoved=false: alcune cartelle Edge temp residue, dati origin cancellati.
8. **Perimetro P2**: audit originale documentato in ../2026-11-18-table-uniformity-p2-audit/AUDIT.md. Sono completate le tabelle operative: Tracce salvate Build312, Waypoint Build313, Poligoni Build314, Aree offline Build315, Range rings, Preferiti, due picker Astro e Batch Build316. Non si impongono checkbox/azioni a tabelle puramente informative (diagnostiche, profili routing, stampa/help). Le liste non-table vanno classificate per significato prima di dichiararne una copertura indiscriminata.
9. **Limiti**: QA operatore unica FINALE PENDING fino a esplicita approvazione; non dichiarare P2 COMPLETO/chiuso prima del gate. Mobile sviluppo PAUSA, DTM terreno 5–10 m accuratezza HOLD, menu Nuova traccia FUTURO.

## Verdetto

**REVIEW GPT-SOSTITUTIVA PASS** sulla full SHA, con 27 controlli statici e 134 QA candidate PASS. Reviewer AI esterno NOT_PERFORMED e backstop post-hoc aperto. NEXT: backup Build315, deploy GIS-only, sha VPS/HTTP/HTTPS, QA HTTPS 134/134; poi QA operatore UNICA su tutti i tab. Nessuna chiusura automatica prima della riga finale attestata.
