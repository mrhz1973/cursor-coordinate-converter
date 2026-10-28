# Review indipendente — preservazione migrazione VPS in FIX8

Reviewer: subagente Codex /root/review_fix7, distinto dall'implementatore. **PASS scoped** sul candidate finale immutabile 762fb1605a7c20b3b7bd21a6b0cfa1c04f8e4739, blob5da70951b43300f5165448049ba8c20a2f8ae867, SHA256 LF0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145. Hash/blob verificati direttamente. La review FIX8 precedente resta valida per il delta funzionale identico.

Base d72babe2de3d3b3d874582abd6453f865abdedb9. Il confronto byte per byte prova che l'intero candidate è esattamente la base con cinque sostituzioni di100.114.7.53 in100.99.54.93 e una diubuntu.tailc01234.ts.net inionos-n8n-new.tailc01234.ts.net. Nessun altro byte alterato. Conteggio verificato:6 righe,+6/-6.

I due endpoint operativi restano GraphHopper HTTP tailnet porta8989 e gateway ORS HTTPS sullo stesso suffisso tailnet. Quattro sostituzioni sono attesi/override dei selftest. Non viene inserito l'IP pubblico del VPS nel runtime, né un endpoint Internet alternativo, né un nuovo fallback. Porte/path/protocolli, provider, consenso loopback, OPSEC, offline e storage non cambiano. Nessuna modifica server o Tailscale effettuata da questa review.

Verifiche autonome:10/10 controlli helper PASS su routingNetworkGateGraphhopper e routingNetworkGateOrs (strict, offline forzato, navigator offline, effective offline, online). In strict/offline i due endpoint remoti restano bloccati. Harness estrae le funzioni reali dal commit; state/navigator/connettività sono controllati, e il consenso loopback è fissato falso. Nessuna richiesta di rete è stata inviata. Questo è un test della decisione gate, non un'intercettazione di tutte le richieste browser.

Il mandato per preservare queste sostituzioni è dell'orchestratore, che riferisce conferma utente dell'identità VPS e del LIVE migrato. Questo subagente non ha verificato autonomamente identità SSH, impronta host, reachability o servizi condivisi: tali evidence e il preflight restano all'orchestratore. Il PASS scoped autorizza tecnicamente l'integrazione del delta endpoint nel gate complessivo; non sostituisce smoke HTTP, ABQA, QA operatore o consenso infrastrutturale.

Evidence: migration-verify.cjs (pinnato al commit finale), migration-results.json. Nessuna modifica runtime, commit/push/deploy eseguita dal reviewer.
