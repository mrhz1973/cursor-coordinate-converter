# FIX8 — preservazione migrazione VPS

Mandato orchestratore: preservare le sei sostituzioni già osservate nel runtime LIVE del VPS migrato, evitando che il deploy di FIX8 ripristini gli endpoint del vecchio server. Identità e migrazione verificate dall'orchestratore mediante conferma operatore/console; nessuna verifica SSH eseguita da questo subagente.

Base locale verificata pulita prima della patch: d72babe2de3d3b3d874582abd6453f865abdedb9.
Build265/FIX8 invariata, candidate non ancora pubblicato; commit additivo affidato all'orchestratore, nessun amend.

Conteggio prima della sostituzione (assert nel patch script):
- 100.114.7.53: cinque occorrenze, esattamente due override selftest D-Flight, endpoint GraphHopper e due controlli selftest GH.
- ubuntu.tailc01234.ts.net: una occorrenza, base ORS gateway.

Sostituzioni:
- 100.114.7.53 -> 100.99.54.93
- ubuntu.tailc01234.ts.net -> ionos-n8n-new.tailc01234.ts.net

Diff ispezionato: solo sei righe sostituite (+6/-6). Nessuna porta, path, logica provider, controllo OPSEC, storage o fallback modificato. GraphHopper localhost rimane127.0.0.1:8989. Il helper D-Flight operativo continua a ricavare hostname e protocollo da location, quindi segue dinamicamente il nuovo host; sono aggiornati soltanto gli override nei suoi selftest.

Verifiche:
- git diff --check PASS.
- Chromium reale ?debug tramite harness selfcheck.cjs con richieste esterne bloccate: Self-check passed, zero assert falliti, zero pageerror, build265 FIX8.
- Evidence: selfcheck-migration.json.
- SHA256 finale LF: 0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145.

Nessuna modifica VPS/SSH, nessun commit/push/deploy. Questo selfcheck non attesta reachability dei servizi: preflight e smoke HTTP sono responsabilità dell'orchestratore. Review indipendente richiesta sulla sostituzione degli endpoint prima del deploy.
