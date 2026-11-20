# P0 — IndexedDB HTTP verificato; prossimo gate HTTPS

Data: 20/11/2026 12:51 Europe/Rome.
BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0.
RESULT: HTTP_LOCALSTORAGE_AND_IDB_VERIFIED / HTTPS_INVENTORY_PENDING / ORIGIN_BACKUP_PENDING.
real_task_commit: 338ab66cc3e36f00308446b577062e72a5d0c23f
REMOTE_HEAD_AT_EVIDENCE_TIME: 338ab66cc3e36f00308446b577062e72a5d0c23f
current_report_container: PENDING_SELF_REFERENCE
Autosync publication: EXTERNAL_ONLY

Ricevuta operatore IDB del 20/11 alle 11:34:39.385 UTC, verificata tramite TMAR alle 11:39:51.041 UTC: 1.028 record, 16.012.203 byte binari, file 21.511.025 byte. SHA256 a1f72fd84a9f7f49cb0e0e9cbc023e813841388192f5ccda56b2b34d81919056. Schema, univocità, Base64, ogni hash binario e copia byte per byte PASS. Sorgente e payload privati restano sul PC; copia e receipt locali verificate.

Il Local Storage HTTP era stato acquisito alle 02:21:03.176 UTC: due snapshot distinti, non atomici, nessuna attestazione sulle modifiche successive. Backup origine completo false, confronto HTTPS NOT_PERFORMED; residui ancora da inventariare.

Helper HTTPS qualificati sul solo delta: review statica PASS e 3+3 gruppi sintetici PASS. Origine esclusiva HTTPS; zero chiavi o main assente ammessi e distinguibili da raccolte vuote. File comando sul PC LocalAppData/TMAR-GIS/P0-Aiuto-20261120/P0-HTTPS-LocalStorage-Comando.txt, hash verificato. Nessuna esecuzione HTTPS personale attestata.

Pagina di acquisizione nativa /gis/__tmar_p0_inventory__: 404 JSON da 45 byte, nessun runtime/redirect/header che modifichi cookie o storage osservato. Il primo output non acquisito è stato recuperato con una sola richiesta mirata e ricevuta metadata. Nuova scheda dello stesso browser/profilo; 404 atteso, STOP se compare GIS o altro avviso. Il contesto personale non è dedotto dalla verifica server.

NEXT: esecuzione del comando HTTPS in Console e sola ricevuta metadata/STOP; poi TMAR verifica privatamente download/copia. Seguiranno IndexedDB HTTPS, contenitori residui e confronto. Prima di azioni sui dati, controllo delle variazioni successive agli snapshot. Nessuna migrazione/pulizia; Build317/P3 CLOSED, DTM HOLD, mobile PAUSA, P4 FUTURO.

[Rapporto](../evidence/2026-11-19-http-origin-p0-inventory/REPORT.md) · [Ricevuta](../evidence/2026-11-19-http-origin-p0-inventory/http-indexeddb-verification.json) · [Comando HTTPS](../evidence/2026-11-19-http-origin-p0-inventory/export-https-localstorage.console.js).
