# REVIEW Build312 / P2-A — tutte le colonne Tracce salvate

Data: 18 novembre 2026. Gate DELICATO per due preferenze persistite nello schema settings del singolo STORAGE_KEY.
Blocco: GIS-SAVED-TRACKS-COLUMNS-P2A; CLOSURE STANDARD_RUNTIME_BUNDLE.
Reviewer AI esterno NOT_PERFORMED; checklist GPT-SOSTITUTIVA effettuata su sorgente immutabile e QA reale; backstop review esterna post-hoc rimane aperto.

## Identità immutabile

- Commit sorgente FULL SHA: 433795275d3b17cc06a738d918eef7c0f48e51bd.
- Blob Git: 013451187920c33bfe8c4a6adb6d1fad38d80f73.
- SHA256 LF: 66a7b6a94271bc107e67c0a8028a2b41be0d194a0233ba7008c7c1f60999d2e1.
- 11.230.224 byte, CR192/CRLF0; delta +151/-111; un solo runtime HTML modificato, sorgente git show byte-identico al candidato.

## Checklist per categoria

1. Persistence: nuovi campi savedTracksColumnWidths e savedTracksSort esclusivamente sotto settings dell'originario STORAGE_KEY; recupero da settings al boot, default espliciti; nessuna chiave localStorage secondaria. Tutte le larghezze passano per savedTracksSanitizeColumnWidths, con typeof number, Number.isFinite, clamp numeric e soli 7 nomi in whitelist. Sort chiave in whitelist e direzione enum asc/desc. Nessuna coercizione da stringhe non fidate.
2. Layout: 7/7 colgroup con variabili CSS, aria separator per trascinamento anche checkbox/Vis./Pti/Azioni, minima larghezza per select, indicatori e pulsanti. La vista stretta desktop scorre in orizzontale. CSS e applicazione preferenze limitati a desktop; resizer mobile nascosti e layout mobile originario preservato.
3. Eventi: pointer fine-only, handler unico delegato e governato dalla whitelist, pointercancel ripristina memoria/UI; al pointerup salva tramite saveStoreReported e verifica valori letti da STORAGE_KEY; al fallimento ripristina la preferenza e il raw precedente senza toccare geometrie. Sort preesistente e checkbox operatore conservati.
4. OPSEC/rete: nessun nuovo endpoint, fetch, GPS, framework, bundle o esecuzione automatica; offline e opt-in invariati. Geometrie e stato canonico state.mapWaypoints[] invariati.
5. Regression ABQA candidate: 46/46 PASS, 31 clic nativi, 10 file chooser, zero POST/eccezioni/console; 7 drag, reload su tutte le preferenze, sort 5 colonne e toggle, selezione riga/tutte, quota simulata, inventario dati invariato, importazione batch Build311, quote 2D/3D, persistenza 20 tracce, poligono positivo con save→export→import parser→reload; viewport desktop stretto, mobile non modificato. Cleanup dati browser PASS, alcune directory temporanee Edge non rimosse (false).
6. Out of scope: P2-B Waypoint/Poligoni/Aree offline/Range rings e P2-C Preferiti/Astro/Batch sono ancora non implementati; non dichiarare intero P2 risolto. DTM terreno accuratezza 5–10m HOLD e mobile PAUSA.

## Verdetto

REVIEW GPT-SOSTITUTIVA PASS, con source identity FULL SHA sopra, prima di qualunque deploy. Reviewer esterno NOT_PERFORMED / review post-hoc backstop aperta. Prossimi gate indipendenti: deploy GIS-only con prebackup, confronti hash, QA HTTPS Build312, QA operatore. Non attribuire PASS umano prima dell'attestazione.
