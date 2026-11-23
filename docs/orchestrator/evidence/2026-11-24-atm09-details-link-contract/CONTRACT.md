# D-FLIGHT-ATM09-DETAILS-READABILITY-LINKS-A — contratto Build325

Base Build324 CLOSED, HEAD 63535cf10f41dcf09e1d12eaa3f8d2ad6189a0d3, SHA256 78d8acb4a549ab60e4d44fd798240b57b0617bf0964a7e93700db12dab90ebbf. 24/11/2026. Tier DELICATO (validazione URL e navigazione esterna).

Scope: solo funzione dflightAtm09OpenDetails, helper specifici Rule/Regola e CSS interno al body del pannello. Il normalizzatore display-only esistente, i dati grezzi, il ciclo dialog, gli overlay, provider, cache, GPS, storage e GIS Objects restano invariati. Non riaprire CLEANUP-A o WU-0013.

Acceptance: conservare esattamente textContent prodotto dal normalizzatore esistente; riconoscere al massimo 24 token interi HTTP(S) assoluti e validati, senza ricostruire HTML. Accettazione prudenziale: URL ASCII con host DNS a piu etichette, porta standard, senza credenziali, controlli, backslash, host locali/IP/tailnet o ambiguita del parser; token non ammessi restano testo. Non e una verifica DNS/reputazione o dei redirect di destinazione. Nessuna modifica al valore raw.

Link come anchor semantico role=link, tabindex=0, deliberatamente senza href nativo; click/tastiera attendibili, conferma esplicita della destinazione canonica per singola apertura, gate dflightClientNetworkAllowed prima e dopo conferma; no navigazione se forceOffline, OPSEC strict, offline, annullamento, evento sintetico o URL invalido. Apertura solo a gesto confermato con noopener,noreferrer; nessuna autorizzazione persistita, nessun fetch automatico. Informare se HTTP non cifrato.

Layout ATM09 scoped, scuro, gerarchia dt/dd, Rule/Regola su intera larghezza con wrapping e spaziatura; link visibili e focus tastiera. Nessun cambio del tema globale.

Gate: test URL validi/avversariali e testo HTML/entity, no sink nuovo, raw identico, nessun traffico automatico; test browser desktop/tablet/phone con dati sintetici, gate offline/OPSEC, revoca durante conferma, annullamento, click/tastiera, apertura simulata senza traffico effettivo; regressione pannello non ATM09 e lifecycle. Review DELICATO sul raw@FULL_SHA; deploy solo dopo PASS e QA HTTPS LIVE, poi QA operatore. FAIL reale -> STOP o fix-forward con nuova identita. Non attribuire QA reale dei provider o di dispositivi fisici.
