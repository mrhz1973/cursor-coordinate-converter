# Build 292 — HUD in basso a destra, barra sollevata, nome TMAR GIS Tool

Data 2026-11-12 11:26:15 Europe/Rome; predeploy. Feedback utente: rifiuta il right-gutter della 291. PUNTO, CURSORE e © OpenStreetMap contributors devono restare nell angolo inferiore destro, senza essere spostati a sinistra. I pulsanti devono terminare sopra i riquadri, con una distanza equivalente all altezza di un pulsante fra GPS e PUNTO. Nome pubblico esatto TMAR GIS Tool.

Implementazione: CSS scoped desktop min-width 960, hover e pointer fine: tolte regole right=96px readout/attribuzione, ripristinati offset originali; toolbar right=10px, width 68px e ora bottom=235px. Nei viewport desktop standard GPS termina 46px sopra PUNTO. Scroll utilizzabile quando la finestra è bassa. I gruppi blu (Livelli/Zoom) e teal (strumenti) restano invariati. Nessun dato GIS, OPSEC, rete, GPS o mobile layout modificato.

Brand corrente TMAR GIS Tool aggiornato nel runtime: title, application-name, header/footer, tre lingue, export GPX/KML/CSV/GeoJSON e aspettative selftest. Note storiche Build 206/207 restano con il nome precedente. Unico file runtime coordinate_converter Claude.html, 49 righe aggiunte e 58 eliminate incluse 44 sostituzioni del nome; nessuna modifica a storage, ID, framework o monolite standalone.

Source b8a3a6c18e29ba382df0c6e6b3c1a4ea3f9f22c9; base 6b293b05a24bc929697b0aa4b14f11abb49523d2; blob fc432b1ca383f6abe168286084b7961e96c6908f; SHA256 a71206104ac0944edac4da5ffecece4321cddea53c9fb016160f2866e2af8917; 11.120.400 byte; 192 CR invariati. Review routine 23/23 PASS ([JSON](REVIEW-292.json)).
QA candidata: 16/16 geometria 8 viewport × scroll top/bottom, 9/9 branding, 1/1 mobile, 76/76 regressione toolbar, 25/25 Waypoint, POST 0. Branding selftest 17/18: il controllo storico BRAND_build_214 hardcoded Build 234 falliva già prima del cambiamento; tutti gli altri PASS. [QA](QA-CANDIDATE-292.md).

GATE: nessun deploy o QA operatore 292 dichiarati. NEXT main FF, preflight/backup 291 e deploy GIS-only, ABQA nativa e breve QA umana.
