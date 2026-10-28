# LAST_CURSOR_REPORT

Nome legacy preservato. Esecutore: Codex orchestratore e subagenti; nessun Cursor utilizzato.

## Header
BLOCK: GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX8, build265.
GATE: review indipendente Codex PASS scoped; QA finale pre-deploy PASS.
NEXT: QA byte finali → deploy GIS-only → ABQA HTTP → QA operatore.
RUNTIME_CANDIDATE_SHA / real_task_commit: `762fb1605a7c20b3b7bd21a6b0cfa1c04f8e4739`.
Blob: `5da70951b43300f5165448049ba8c20a2f8ae867`.
SHA256 LF: `0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145`.
current_report_container: PENDING_SELF_REFERENCE; final_remote_head_after_report_push: EXTERNAL_ONLY.
LIVE: build256 base f215011, sei modifiche endpoint locali verificate. Nessun deploy in questo pass.

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
[Indice](../orchestrator/evidence/2026-10-28-fix8/INDEX.md): report completi separati, harness, JSON e manifest. Hash testati e limiti espliciti. Nessuna review esterna inventata, ABQA postdeploy o QA operatore attestata. Stato vivo solo FRONTIER.
