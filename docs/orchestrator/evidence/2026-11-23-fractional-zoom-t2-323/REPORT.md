# Build323 T2 - DEPLOY e ABQA LIVE PASS

UTC: 2026-11-23T22:50:30.439Z. MAP-FRACTIONAL-ZOOM-A-T2, DELICATO / STANDARD_RUNTIME_BUNDLE. Parent OPEN, QA operatore PENDING.

- Runtime source c484e7d467b8927055cb6779b9bcdd1d01ce02e3; blob 09df8b67c832ee38818ed8d1134b9ccb3647590a; SHA256 c260561d7ab9fa9cddf827b29547b8464aa2ab97a49090a161c606504e1db09a; 11.354.085 byte.
- VPS checkout e0a075e387716b9ea9521c22ee4f8f6dab4d5139, clean. Solo restart goi-gis-app; active. Backup Build322 /var/backups/goi-gis-runtime/prebuild323-5o4t7ooL verificato per SHA precedente.
- HTTP prima richiesta: connection refused in avvio; retry HTTP200 PASS. HTTPS200 PASS; corpo identico per byte e SHA, TLS non alterato.
- Review GPT sostitutiva 23/23 PASS; [rapporto](REVIEW.md). Reviewer AI indipendente non eseguito, post-hoc pending.
- ABQA HTTPS LIVE sul medesimo URL: R2 79/79 PASS (desktop1440/tablet768/phone390/phone320); R3 33/33 PASS (overlay e roundtrip sintetico); R4 29/29 PASS (layer compatibili, cache, export); R5 27/27 PASS (controlli, focus, limiti e fallback). Suite sovrapposte: nessuna somma.
- Camera reale persistente, tile source intero, wheel/pinch/pan, target 1:N, coordinate e geometrie. I test usano fixture sintetiche isolate; nessun archivio operatore modificato. Nessun attestato dispositivi fisici, altri browser o provider online.

[Runtime LIVE](https://ionos-n8n-new.tailc01234.ts.net/gis?v=c260561d) | [Evidenza completa](evidence.json) | [Review](review.json).

NEXT: attestazione operatore esatta QA MAP-FRACTIONAL-ZOOM-A-T2 PASS operatore dopo verifica funzionale sul runtime LIVE. Non chiudere T2 o parent senza attestazione. P0 non applicato; DTM HOLD; P4 futuro.
