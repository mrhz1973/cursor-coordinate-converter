# Escape desktop 294 — Astro, Range & Bearing, Misura minimizzati

Data 2026-11-12 12:51:59 Europe/Rome. Stato PREDEPLOY.

## Evidenza baseline Build293
PC lavoro DESKTOP-DPIJL64 Windows, Remote Desktop Commander originale, Edge CDP con profilo isolato, URL HTTPS /gis nativo (Build293). Con Astro, Range & Bearing o Misura aperti e minimizzati e Poligoni visibile, Escape lascia Poligoni aperto. Tre FAIL concreti, 13/16 PASS. Sulle prove i pannelli minimizzati rimangono minimizzati. Nessun POST, provider terzi bloccati.

## Candidata Build294
Source code dd4bb2a2180c59b32c2259c7016f771a7bda0b16 su base main c4906eef3ba2099ccab8e161baac6b31c6696958; blob c6aec7daa7330cd501883585d52d5e021a3dee33; SHA256 2556773e442a2822461067df118713375388e71825efc46195ffd12936887743; 11.121.515 byte. Solo monolite coordinate_converter Claude.html, 9 righe aggiunte e 6 eliminate. Tre condizioni Escape ora cedono al pannello visibile esclusivamente in GIS desktop (predicato matchMedia min-width 960 hover pointer fine esistente nella 293). Close handlers, markup modale, layout, OpenStreetMap/PUNTO, marca TMAR GIS Tool, GPS, OPSEC, storage, export e comportamento mobile invariati. Node inline 2/2 PASS; 192 CR preservati.

## QA, review, gate
QA candidata Edge sul PC lavoro: 36/36 PASS su sette scenari minimizzati (Astro, Range, Misura, Offline, Cerca, Cronologia, D-Flight), Escape chiude Poligoni senza chiudere il pannello minimizzato. HTML 294 inserito solo nella sessione CDP su origin HTTPS; runtime server rimane 293. 0 POST e 578 accessorie esterne bloccate.
REVIEW GPT-SOSTITUTIVA su source full SHA: 31/31 PASS, [JSON](REVIEW-GPT-294.json); reviewer esterno NOT_PERFORMED e backstop post-hoc dichiarato. Questa è una modifica delicata di priorità/lifecycle, non nuova implementazione di modali.
Nessun deploy o PASS operatore 294 anticipato. [QA](QA-CANDIDATE-294.md).

NEXT: pubblicazione main fast-forward, backup e deploy GIS-only, QA HTML LIVE nativa sul PC lavoro, poi QA operatore desktop.
