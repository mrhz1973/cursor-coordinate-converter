# Build327 — DEPLOY e ABQA HTTPS LIVE PASS

UTC 2026-11-24T06:39:59.065Z. GIS-WAYPOINT-COORD-UX-A; DELICATO / STANDARD_RUNTIME_BUNDLE. QA operatore PENDING.

- Runtime c2676056cb828ba6f96aa0a3bb8c484417c6ecb9; blob 2abebd508f151436e82d3d3c4592a0f60271b117; SHA256 2b9e3c354f8179b0aabeb16b65abc8bc03604fc98ec2bf3bcd56c6b6a917ab3d; 11.363.953 byte.
- Deploy GIS-only: VPS checkout 8e92a1798d68cafb8a97d081eb801dbcccbf296d, backup Build326 /var/backups/goi-gis-runtime/prebuild327-I63fo3cP, goi-gis-app active. Primo HTTP rifiutato durante avvio; retry HTTP200/HTTPS200 e byte/SHA esatti.
- Review GPT sostitutiva 40/40 PASS; [review](REVIEW.md). Review AI indipendente post-hoc PENDING. Candidato R4 90/90 PASS.
- ABQA HTTPS LIVE90/90 PASS su desktop1440/tablet768/phone390/phone320 emulati: map pick e pan, guard click-self GIS, X/Esc, bozza e conferma scarto, minimize/restore, modal non-GIS. Coordinate, storage e dati canonici invariati.
- Baseline FAIL riprodotto con evento sintetico sul contenitore, non con ogni click reale segnalato. R1-R3 FAIL conservati nella review; driver R4 rispetta precedenza Esc e usa DD per fixture clean. Nessuna certificazione universale o device fisici.
- Ricevuta LIVE 291154f1af5eee94a0fb070c3cd40eb562220bd81cf117f47eb6867ee57dc9aa; driver 2770990c6795e8dab33288eb18047ce51a6ca58cc2182e9e5019cb3f4a2122bf.

[Runtime LIVE](https://ionos-n8n-new.tailc01234.ts.net/gis?v=2b9e3c35) - [Evidenza](evidence.json) - [Review](review.json).

NEXT: QA operatore GIS-WAYPOINT-COORD-UX-A prima della chiusura Regola H. P0 non applicato; DTM HOLD; P4 FUTURO.
