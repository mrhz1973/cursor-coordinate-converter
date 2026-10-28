# Worldwide Geodetic Accuracy QA — FIX8 retest

**PASS limitato alla matrice helper descritta.** Non è ABQA, attestazione operatore o gate deploy.

Runtime locale revisionato SHA-256 LF `c570bee51534ccba73352bd650b9bb6be55b414dfbbfd1e568abd323a9368ea3`. Identità Git candidate demandata all'orchestratore: al momento del test il file locale era in preparazione, non ho creato commit/push. La prova vale esclusivamente per questi byte.

Stessi 72 punti e riferimenti indipendenti del rapporto FIX7: pyproj 3.8.0/PROJ 9.8.1, mgrs 1.6.0/GEOTRANS, GeographicLib 2.1. Fixture, precisioni e tolleranze in `report.md`, `cases.json`, `reference.py`.

| Gruppo | Esito | Max m | Media m | Mediana m | P95 m |
| --- | --- | --- | --- | --- | --- |
| UTM forward / PROJ nel CRS restituito | 68/68 | 4.075e−9 | 1.389e−9 | 1.118e−9 | 3.733e−9 |
| UTM inverse da PROJ | 68/68 | 4.958e−9 | 1.740e−9 | 1.519e−9 | 4.602e−9 |
| MGRS inverse GEOTRANS, convenzione SW allineata | 68/68 | 3.272e−8 | 5.905e−9 | 3.262e−9 | 1.841e−8 |
| MGRS forward decodificato GEOTRANS | 68/68 | 0.635695 | 0.420238 | 0.447629 | 0.580950 |

- DD/DDM/DMS: 72/72 per formato su ciascuno dei sei helper (1296 prove).
- UTM/MGRS: 68/68 su ciascuno dei quattro ingressi che supportano griglie.
- 16 invalidi/incompleti × 6 helper: 96 rifiuti attesi, nessuna falsa accettazione.
- G1: gli MGRS validi attraverso antimeridiano ora restituiscono longitudini normalizzate; waypoint/poligoni accettano le stesse coordinate di Cerca/Incolla.
- G2: il limite +84° ora genera MGRS zona35 a 30°E, decodificato dal riferimento indipendente entro tolleranza. La matematica UTM è confrontata nel CRS effettivo restituito, senza sottrarre easting appartenenti a zone differenti.

Riesecuzione: impostare `GEODESY_FIX8=1` ed eseguire `node work/geodesy/run.cjs`, poi `python work/geodesy/analyze.py --fix8`. Il primo salva il SHA-256 effettivo in `actual-fix8.json`. Metriche complete e dettagli in `summary-fix8.json` e `measurements-fix8.json`; baseline FIX7 preservata in file senza suffisso, sempre acquisita con `git show` e controllo hash.

Il harness usa funzioni reali estratte tramite confini simbolici, senza browser o stub geodetici. Le modifiche dei numeri di riga in FIX8 non possono cambiare silenziosamente i blocchi estratti. Nessuna verifica UI/runtime HTTP eseguita da questo incarico; nessuna copertura automatica di tutti i datum o precisioni MGRS ridotte dichiarata. Il reviewer separato mantiene responsabilità sulla semantica prefissi e sul diff completo.
