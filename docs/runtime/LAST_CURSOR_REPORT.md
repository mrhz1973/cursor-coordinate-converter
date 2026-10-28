# LAST_CURSOR_REPORT

Nome legacy preservato. Esecutore: Codex orchestratore e subagenti; nessun Cursor utilizzato.

## Header
BLOCK: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX8, build265.
GATE: review, deploy e ABQA PASS; QA FINALE CHATGPT — PENDING.
NEXT: QA operatore → chiusura Search → routing land-only.
RUNTIME_CANDIDATE_SHA / real_task_commit: `762fb1605a7c20b3b7bd21a6b0cfa1c04f8e4739`.
Blob: `5da70951b43300f5165448049ba8c20a2f8ae867`.
SHA256 LF: `0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145`.
current_report_container: PENDING_SELF_REFERENCE; final_remote_head_after_report_push: EXTERNAL_ONLY.
LIVE: build265 candidate762fb160, endpoint migrati preservati; deploy e hash HTTP PASS.

## Riepilogo completo
1. CORE BOOT: FIX7 era ancora in review. Review distinta e browser hanno dimostrato prefissi DD/DDM/DMS accettati incoerentemente (9 falsi successi, incluso fallback BNG Incolla). FAIL registrato, difetto residuo acceptance non regressione specifica FIX7.
2. Geodesia: 72 punti con PROJ/GEOTRANS/GeographicLib. Trovati MGRS antimeridiano rifiutato dagli editor e zona Svalbard errata a +84°.
3. FIX8 corregge parser canonico per asse, dispatch autoDetect, normalizzazione MGRS e Svalbard. Commit coordinate d72babe2de3d3b3d874582abd6453f865abdedb9.
4. QA coordinate: 2112 verifiche +96 invalidi PASS. Browser desktop/mobile emulato: regressioni, editor e12 punti mondiali x2 viewport con PUNTO DOM/marker/centro. Limiti visivi/mobile dichiarati.
5. VPS: alias storico puntava a IP errato. Console IONOS verificata con utente; chiave del nuovoIP31.70.139.73 coincide. Tailscale100.99.54.93 online, HTTP GIS200 e quattro serviziGIS active. Nessuna modifica Tailscale/SSH/ACL/container/servizi.
6. Sei sostituzioni endpoint non committate sul LIVE preservate nel candidate finale762fb160. Review dedicata PASS,10/10 gate strict/offline. Nessun IP pubblico nel runtime. QA browser finale PASS: arità41/41+12/12 UI,24/24 punti,3/3 gate geocoding, selfcheck senza errori.
7. GraphHopper11 /info live attesta FERRY; nessuna patch routing effettuata.
8. Invarianti: HTML standalone vanillaJS, nessuna dipendenza runtime, storage invariato, no GPS implicito, OPSEC/offline, Oggetti GIS maintenance-only.

## Evidence
[Indice](../orchestrator/evidence/2026-10-28-fix8/INDEX.md): report completi separati, harness, JSON e manifest. Hash testati e limiti espliciti. Nessuna review esterna inventata; ABQA postdeploy attestata sotto; QA operatore non attestata. Stato vivo solo FRONTIER.

## Aggiornamento post-deploy
Deploy tecnico PASS, HTTP SHA256 finale verificato prima/dopo browser. VPS repo a31136b8bc14141993ec7a0f8dae27e8bf48ef66 pulito; LIVE runtime762fb160 build265. Backup e stash conservati, serviziPID invariati, nessuna modifica infrastrutturale.
AUTOMATED BROWSER QA GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX8 PASS:24/24 punti desktop/mobile emulato,6/6 gate,zero erroriJS. Hash HTTP0c39ce77... invariato. Documenti HTTP reali; richieste esterne intercettate/bloccate; non attestata disponibilità cartografia/provider.
GATE CORRENTE: QA FINALE CHATGPT — PENDING. QA operatore non attestata, nessun finito/chiusura. NEXT: verifica visiva operatore, poi chiusura e routing land-only.
Evidence: DEPLOY.md e postdeploy/ nel pacchetto FIX8.

## Chiusura FIX8 — 2026-10-28
QA GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX8 PASS operatore: attestazione esplicita ricevuta in chat; blocco CLOSED. LIVE build265 invariato. Nuova richiesta operatore: rimuovere Paese e cambiare esempio Cerca; blocco GIS-SEARCH-SIMPLIFY-COUNTRY-A in implementazione, candidate non ancora disponibile. Fonte LIVE: FRONTIER.


## GIS-SEARCH-SIMPLIFY-COUNTRY-A build266
Utente ha attestato FIX8 PASS; chiuso in a7661f1. Richiesti rimozione Paese, esempio diverso, note release in Impostazioni. Candidate ce02321c6a95f729c6b9e1baeabe27077689a9c8 blob da1191e9a48353175f5ffef8f73ee3e8150212a7 SHA256 85252fa3bb9fd43f9eeca4a5d1ddce8b5e9ee307be94defc5e0b66c61eda23ff. Review indipendente scoped e QA locale PASS. Note documentano release255/256/265/266 e dichiarano storico incompleto; METHOD richiede aggiornamento futuro.
Deploy GIS-only su VPS da repo6dc54d2, backup /tmp/goi-search-266-predeploy/runtime-before.html; hash file e HTTP coincidono. Servizi e processi invariati. ABQA HTTP PASS: desktop e mobile emulato, luogo mock senza countrycodes, coordinate,6 gate, accesso note, zero erroriJS. Richieste esterne intercettate; non attesta salute provider. Mobile emulato testo piccolo, verifica umana necessaria. QA OPERATORE PENDING. Nessun finito.
Evidence docs/orchestrator/evidence/2026-10-28-search-ux/abqa; stato vivo FRONTIER.
