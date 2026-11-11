# Build 290 — restyling barra destra desktop, due gruppi

Data: 2026-11-11 15:28:25 Europe/Rome. Stato storico: candidata predeploy. Stato corrente: Build 290 LIVE, QA operatore grafica PENDING.

## Stato LIVE

Build 290 LIVE, source 56d336a3942028836924f68af322d36996095b15, blob f8c469e39e2c647b2bde377e5ac1b6b7e90683cc, SHA256 7d69fc145779f223c570e9596e23b497ab678329d4b495ebc03567301f010e69, 11.120.343 byte. Review 22/22, deploy GIS-only, backup 289, smoke HTTP/HTTPS e Automated Browser QA nativa 76/76 layout + 25/25 Waypoint PASS. QA operatore grafica PENDING. [Deploy](DEPLOY-RESULT-290.md) · [QA](QA-LIVE-290.md).

## Requisito
L'operatore ha richiesto due aree grafiche distinte: NAVIGAZIONE mappa in alto (Livelli, Zoom +/−, Zoom area, Livello zN) e STRUMENTI GIS verso fondo dello schermo (Misura, Traccia, Poligoni, Range & Bearing, Waypoint, Nuovo punto, GPS). Livelli era disallineato di circa 4 px; richiesta anche grafica più curata e due colori/bordi diversi.

## Scope implementato
- Source 56d336a3942028836924f68af322d36996095b15, base main 1b1e6b09d956e3171c245148af4f694e786d1318, branch task/gis-toolbar-dual-groups-290.
- HTML standalone, blob f8c469e39e2c647b2bde377e5ac1b6b7e90683cc, SHA256 7d69fc145779f223c570e9596e23b497ab678329d4b495ebc03567301f010e69, 11.120.343 byte; 192 CR isolati preservati.
- Un blocco style CSS inline solo body.gis-mode, viewport >=960 e hover/pointer fine: toolbar fixed al viewport, nav in alto e gruppo strumenti spinto in basso con margin-top:auto; bottom 76px evita sovrapposizione footer.
- Palette navigazione blu con bordi #60a5fa, strumenti verde acqua con bordi #5eead4, sfumature leggere e ombre; stato attivo strumenti teal, labels sempre visibili. Livelli traslato a sinistra di 4px in desktop per allinearlo ai pulsanti Zoom.
- Altezza tasti preesistente 44px mantenuta; su desktop bassi toolbar scrollabile. Menu Livelli non clippato all'apertura.
- Non modificati metodi Waypoint, stato Traccia, GPS, OPSEC, rete/tile, storage, geometria, state.mapWaypoints e nessuna dipendenza aggiunta. Mobile escluso da CSS.

## Evidenze
- QA candidata Edge HTTPS (HTML iniettato solo nel browser, non LIVE) **76/76 PASS**, 0 POST, sei viewport: 1440,1366,1920,1024,960 desktop e 390 mobile emulato. Colonna verticale, Livelli x allineato a Zoom, colori nav/strumenti differenti, superiore e inferiore separati, strumenti ancorati sopra footer, scrolling su 960 basso; comandi diretti e stati Traccia invariati.
- Regressione Waypoint 289 sul candidato **25/25 PASS**.
- Prima iterazione QA aveva FAIL di posizionamento e screenshot con GPS coperto da footer. Corretta prima della review definitiva. Seconda iterazione PASS, screenshot di controllo finale ispezionato.
- REVIEW ROUTINE su codice source pinnato **22/22 PASS**, [JSON](REVIEW-290.json). JS inline identico alla 289 salvo tre metadati.
- Console/pageerrors generici e tile provider non verificati; chiamate terze bloccate durante QA. Nessun test utente attribuito.
- Il FIX3 toolbar 288 non possiede ancora un PASS operatore canonico autonomo; Waypoint 289 è CLOSED.

NEXT: pubblicare main, backup e deploy GIS-only con smoke HTTP/HTTPS, ABQA LIVE nativa, QA grafica operatore. Ramo Escape 284 non distribuito; sviluppo telefono in pausa.
