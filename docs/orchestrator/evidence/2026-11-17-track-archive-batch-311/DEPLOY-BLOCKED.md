# Build311 — deploy non eseguito per blocco di sicurezza dello strumento

Data: 17 novembre 2026. Block: GIS-TRACK-ARCHIVE-BATCH-10-A.

## Stato verificato

- Codice candidato su GitHub source 4ddcb641b756ac987f619c2cd7fa09e236734147, SHA256 4381c1930a358fc8ad5842507a40a5d44caaa8466708e66c050991e5b2c0fc4d.
- Review GPT-SOSTITUTIVA DELICATO PASS pubblicata a main commit 5906c4fe86de88308c568086a677069e779aa3b5. Edge candidato 30/30 PASS. Reviewer esterno NOT_PERFORMED/post-hoc.
- Preparazione script deploy su Windows rifiutata esplicitamente dai controlli di sicurezza dello strumento. Non aggirato il blocco; nessuna operazione di deploy GIS-only eseguita in questo pass.
- Verifica VPS in sola lettura: HEAD d62b2b51f197f7a37f8ad877ff6c7c68eced0b34, SHA256 runtime ff0c618e089a56cdba221e9f69d35273f0b34996c4e17be4ed6c013152373aea = Build310; goi-gis-app.service active. Working tree storico non modificato.
- Nessun rollback necessario: il servizio LIVE rimane Build310. Nessuna QA HTTPS Build311 eseguita. Nessun PASS operatore Build311.

## Gate e NEXT

**DEPLOY BLOCKED — TOOL SAFETY.** Fermarsi: non aggirare il controllo, non dichiarare LIVE/QA browser remoto. Quando sia disponibile un percorso di esecuzione autorizzato, da source/review già acquisiti si potrà riprendere il deploy GIS-only con backup predeploy, confronto hash e QA HTTPS secondo OM §4. Ripetere test candidato soltanto se codice/source varia. DTM5/10m HOLD, mobile PAUSA, batch non ancora accettato.
