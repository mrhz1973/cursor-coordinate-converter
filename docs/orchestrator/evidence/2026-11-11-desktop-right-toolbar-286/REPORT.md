# Toolbar desktop — Build 286 FIX1, Waypoint self-contained

Data: 2026-11-11 09:45:00 Europe/Rome. **STORICO PREDEPLOY**. Fix nel medesimo ambito UI della Build 285, senza infrastruttura.

## Stato aggiornato dopo deploy

Build 286 LIVE: deploy GIS-only, backup 285, HTTP/HTTPS SHA corretta; ABQA nativa Edge **33/33 PASS**, nessun HTML iniettato, 0 POST e 402 richieste esterne bloccate. QA operatore PENDING. [Deploy](DEPLOY-RESULT-286.md) · [ABQA](QA-LIVE-286.md).

## Finding reale e correzione
Dopo deploy e QA geometrica della Build 285 (28/28 PASS), due URL dell'icona Waypoint hanno restituito HTTP 404: /assets/waypoint-map.png e /gis/assets/waypoint-map.png. File presente sul clone ma non esposto dal reverse-proxy GIS. Non alterare Nginx/proxy.

Candidato 286: nel ramo GIS desktop pointer fine con viewport >=960px, usa una semplice icona Waypoint SVG inline al posto dell'immagine esterna. GIS mobile, modalità Converti, aria-label, click handler e stato Waypoint invariati. I comandi desktop con etichette introdotti nella 285 sono preservati. Patch solo monolite: 9 righe aggiunte, 4 eliminate.

## Identità
- Base main: 2b64dd0e5e8c8a781acbe8f0268da9589dc139d4
- Code source: 6fc34c2a614728b6acc8a9eeae6270a06427d0fe
- Blob HTML: abed2cd19ca6b3ec7a728345c2c1525d7f4e7be0
- SHA-256: af28f2585016c495362a5046ee9d0c4a3a75f0d27cdbf1c750807e1511b4e63c
- Size: 11.115.294 bytes; 192 CR invariati.
- Browser QA candidata Edge HTTPS con HTML iniettato: **33/33 PASS** su 1440x900, 1366x768, 1920x1080, 1024x768 e 390x844. 0 POST; 424 accessorie bloccate. Le 4 prove desktop aggiuntive confermano icona SVG e assenza IMG esterna; il controllo mobile conferma IMG originale.
- Review ROUTINE: **14/14 PASS**, sintassi JS inline 2/2; [dossier di review](REVIEW-286.json).
- Nessun deploy 286 e nessun PASS operatore anticipato.

## Limiti e NEXT
I 404 di altre risorse esterne bloccate o non disponibili non sono dichiarati risolti; il nuovo SVG elimina la dipendenza esterna solo per icona Waypoint su desktop. Nessuna modifica GPS/live tracking, OPSEC, network, storage, toolbar mobile o provider.

NEXT preflight/backup, pull FF, restart solo GIS, hash HTTP/HTTPS, ABQA LIVE completa. Poi QA breve operatore delle etichette e icona Waypoint.
