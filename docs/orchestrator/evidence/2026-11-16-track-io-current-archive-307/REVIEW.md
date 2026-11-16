# Build 307 - review DELICATO I/O Traccia corrente vs archivio

Data 2026-11-16 01:06 CET. Fonte GitHub `1aaa72ec6c3db7bb944c1b58108e456fb4eee611` (raw@FULL_SHA), blob `b59bbd89b45ef3c31e8a28395f8d2070ee6c5dfb`, HTML SHA-256 `d5274ebdb9358a1fd3675c7688af4a562997f3580f7146ca7c3c4b8b70c16e22`. Base origin/main `76d72011ef0612b0e95bf18ab322d2de80cae64e` (Build306 CLOSED). Solo monolite HTML modificato, CR=192 e CRLF=0. Build307 NON ancora LIVE al checkpoint di review.

**Gate di review:** REVIEW GPT-SOSTITUTIVA PASS con 18 controlli statici; reviewer AI esterno NOT_PERFORMED, review post-hoc BACKSTOP ancora aperta. Il PASS sostitutivo NON e attribuito al reviewer esterno. [Checklist verificabile](review-structured.json).

## Delta, metodo e rischi

1. Desktop: comandi superiori Importa/Esporta corrente, inferiori Importa in archivio/Esporta selezionate; su mobile rimane la semantica Build306.
2. Esporta corrente legge solo draft e usa serializer/sanitizer delle tracce esistenti; non trasferisce selezioni da archivio e non scrive in storage.
3. Esporta selezionate usa ancora la selezione archivio, singolo file o bundle ZIP a seconda del numero.
4. Importa archivio apre Workbench Import GIS esistente con filtro transitorio Saved Tracks e ripristina filtri precedenti alla chiusura; il vero applicatore usa prevalidate, snapshot, saveStoreReported, verify persisted e rollback.
5. Salvataggio quote importate originarie: savedTrackBuildImportedElevations con hash geometrico prima della persistenza; nessun nuovo schema, tipo numerico coercizzato o mutazione diretta dei waypoint.
6. Export modal desktop GIS show non modale con aria-modal=false e livello 29 sopra pannelli floating 24-28, sotto drawer 30; fuori GIS e su mobile showModal, aria-modal=true; close/focus per trigger specifico.
7. IT/EN/FR: tutte le nuove chiavi I18N verificate 3/3, nessuna risorsa esterna, framework o GPS.

## Checklist REVIEW GPT-SOSTITUTIVA

- Raw@FULL_SHA, SHA256 e blob certificati e file cambiati esattamente uno; nessuna modifica incongruente.
- Storage: vecchi schema, sanitizer, persist verify e rollback riusati; prova fail-once controlla uguaglianza del raw storage e degli ID dopo rollback.
- Quote: GPX sparse, GeoJSON 3D e KML completo e parziale verificati, niente altitudini inventate; stringa numerica rifiutata.
- Poligoni GIS: import/save/reload/reimport indipendente dal savedTracks store.
- Lifecycle dialog: show/showModal con viewport e contesto; aria-modal coerente; popup cliccabile provato con elementFromPoint; focus torna al pulsante visibile.
- OPSEC: 0 POST, traffico di terze parti bloccato nel profilo Edge temporaneo, 0 eccezioni JavaScript, 0 errori console/harness; nessuna nuova API di rete, GPS o dipendenza.
- Mobile PAUSA: regressione controllata senza nuove funzioni mobile, layout <=768px invariato.
- Reviewer AI esterno NON DISPONIBILE: eseguita review sostitutiva secondo OM ?4 Regola B; review esterna post-hoc da eseguire se disponibile.

## QA browser candidata, 27/27 PASS

| # | Controllo | Esito |
|---:|---|---|
| 1 | Desktop labels and bottom archive I/O visible | PASS |
| 2 | Current export 0 points: guarded and GIS modeless | PASS |
| 3 | Synthetic current and archive geometries isolated | PASS |
| 4 | Desktop modeless export dialog is actually topmost/clickable | PASS |
| 5 | Upper export uses current draft despite empty archive selection | PASS |
| 6 | Lower export uses checked saved row only | PASS |
| 7 | Archive export empty selection stays guarded | PASS |
| 8 | Archive import opens transactional Import GIS with only saved tracks selected | PASS |
| 9 | Import Hub parses mixed file but adds only track | PASS |
| 10 | Imported 3D geometry retains original elevations | PASS |
| 11 | Import persist failure rolls back exact archive and raw storage | PASS |
| 12 | Current export keeps sparse 3D heights without fabricating middle altitude | PASS |
| 13 | GPX current export keeps only valid elevation nodes | PASS |
| 14 | Complete 3D KML export retains all three heights | PASS |
| 15 | Partial KML exports 2D without invented or incomplete Z | PASS |
| 16 | Elevation sanitizer rejects string numeric coercion | PASS |
| 17 | Polygon-only import remains valid with track elevation patch | PASS |
| 18 | Closing archive import restores previous Workbench categories | PASS |
| 19 | Save/reload retains only archive rows and 3D track | PASS |
| 20 | Polygon geometry survives save/reload | PASS |
| 21 | Polygon GeoJSON export/import roundtrip does not touch saved tracks | PASS |
| 22 | Mobile retains Build306 archive export and hidden new controls | PASS |
| 23 | Outside GIS export remains native modal with backdrop | PASS |
| 24 | No POST | PASS |
| 25 | No runtime exceptions | PASS |
| 26 | No console errors | PASS |
| 27 | No harness errors | PASS |

[Dati QA JSON](candidate-qa.json). Runtime SHA in QA coincide con d5274ebdb9358a1fd3675c7688af4a562997f3580f7146ca7c3c4b8b70c16e22. Profilo temporaneo pulito, nessuna informazione utente coinvolta.

## Gate successivo

Prima del deploy: release main fast-forward/squash con HTML blob e SHA identici, backup del runtime306, no deploy in caso di conflitto. Poi smoke HTTP/HTTPS, Edge LIVE e QA operatore **PENDING**, senza attribuirla a prove automatiche. DTM terreno HOLD, profilo solo XY senza quote backlog, sviluppo telefono PAUSA.
