# Build312 — P2-A Tracce salvate, colonne uniformi LIVE

Data deploy: 18 novembre 2026, 01:41:11 UTC (02:41:11 Europe/Rome).
Block: GIS-SAVED-TRACKS-COLUMNS-P2A.
CLOSURE: STANDARD_RUNTIME_BUNDLE. Scope LIMITATO a Tracce salvate desktop.
Gate DELICATO: REVIEW GPT-SOSTITUTIVA PASS; JS inline 2/2, Edge candidato 46/46 e HTTPS LIVE 46/46 PASS; QA FINALE CHATGPT PENDING e QA operatore PENDING. Reviewer esterno NOT_PERFORMED/backstop post-hoc aperto.

## Funzioni consegnate

- Tracce salvate: tutte le 7 intestazioni Sel., Vis., Nome, Pti, Data, Distanza, Azioni dotate di handle trascinabile desktop (prima solo Nome/Data/Distanza). Limiti minimi su checkbox, indicatori e pulsanti.
- Larghezze persistite sotto settings.savedTracksColumnWidths del solo STORAGE_KEY esistente, valori numerici finite con clamp e whitelist. Ordinamento precedente su Vis., Nome, Pti, Data, Distanza riutilizzato e ora persistito in settings.savedTracksSort (chiave/direzione in whitelist). Nessun nuova origine o chiave di storage.
- Multi-selection riga e Seleziona tutte originali conservate, Modifica/Profilo/Centra/Elimina invariati. Per viewport desktop stretti tabella scorre in orizzontale; nessuna modifica funzionale mobile. Nessun GPS, rete o fetch nuovo.
- In caso di scrittura non riuscita delle larghezze, la preferenza è ripristinata e lo stato precedente resta conservato. Dati geografici mai alterati dalla modifica delle larghezze o dal sort.

## Identità runtime e deploy

- Source commit: 433795275d3b17cc06a738d918eef7c0f48e51bd.
- Git blob: 013451187920c33bfe8c4a6adb6d1fad38d80f73.
- SHA256 LF: 66a7b6a94271bc107e67c0a8028a2b41be0d194a0233ba7008c7c1f60999d2e1.
- Runtime: 11.230.224 byte, CR192/CRLF0, standalone vanilla HTML.
- GitHub review predeploy: 0b306f00ecbaecf93174861a63b63d70228e3ab8.
- VPS prima: HEAD 53d887f4bf204bb51530bc0f4c50cb3da9742991, Build311; service active PID 697099.
- Backup verificato prebuild312: /var/backups/goi-gis-runtime/prebuild312-gKYpleKY, SHA256 originale Build311 4381c1930a358fc8ad5842507a40a5d44caaa8466708e66c050991e5b2c0fc4d.
- VPS dopo: fast-forward a 0b306f00ecbaecf93174861a63b63d70228e3ab8, working tree clean.
- Un solo restart goi-gis-app.service, PID successivo 821723; ActiveEnterTimestamp 18/11/2026 01:41:11 UTC.
- VPS, HTTP interno e HTTPS LIVE 11.230.224 byte, SHA256 identico al candidato.
- URL per operatore: https://ionos-n8n-new.tailc01234.ts.net/gis?v=66a7b6a9.

## Qualificazione

- [Review DELICATO GPT-SOSTITUTIVA](REVIEW.md), sorgente pinnato e categorie rischio, reviewer AI esterno NOT_PERFORMED.
- [QA candidato 46/46](candidate-qa.json) e [QA LIVE 46/46](live-qa.json); 31 click nativi, 10 selezioni file, 0 richieste POST, 0 eccezioni/console.
- [Evidenze visive](screenshots-manifest.json): tabella con colonne dopo drag, batch precedente non regresso.
- Prove: 7 drag separati, 5 sort, checkbox riga/tutte, reload preferenze, quota simulata/rollback, waypoint e savedTracks invariati, poligono save→export→classify import→reload, importazione batch Build311 e conservazione quote originali. Isolamento dati browser PASS; rimozione directory temporanee Edge non completa in questo run (profileDirectoryRemoved=false), senza azioni su permessi o dati reali.
- Accuratezza altimetrica DTM terreno 5–10m HOLD.

## QA operatore — PENDING

1. Aprire Traccia > Tracce salvate; trascinare i separatori delle intestazioni Sel./Vis./Nome/Pti/Data/Distanza/Azioni e verificare che ogni larghezza cambi. Dove necessario usare lo scorrimento orizzontale.
2. Cliccare due volte su Nome, Pti o Distanza per verificare ordinamento crescente/decrescente; provare checkbox di riga e Seleziona tutte, senza eliminare dati.
3. Ricaricare la pagina e verificare che larghezze e ultimo ordinamento siano conservati. La zona Importa file superiore e il batch archivio inferiore devono funzionare come prima.

Solo dopo approvazione del proprietario, riga esatta: QA GIS-SAVED-TRACKS-COLUMNS-P2A PASS operatore. Non dedurre il PASS da prove automatiche.

## NEXT ancora APERTO

Questo blocco è P2-A, non tutto P2. P2-B: Waypoint, Poligoni, Aree offline, Range rings. P2-C: Preferiti, selettori Astro, Batch, ulteriori elenchi non-table e casi informativi da confermare. [Matrice P2](../2026-11-18-table-uniformity-p2-audit/AUDIT.md). Menu Nuova traccia FUTURO, mobile PAUSA, DTM accuratezza HOLD. Non iniziare nuovo runtime prima della QA operatore P2-A.
