# Build324 - DEPLOY e ABQA HTTPS LIVE PASS

Registrazione UTC: 2026-11-23T23:38:18.767Z. GIS-LEGENDS-NO-OVERLAP-COORD-BARS-A; DELICATO / STANDARD_RUNTIME_BUNDLE, QA operatore PENDING.

- Runtime source b08459bfa2eaf49df938d550b1800edce105096d; blob cb838af70477a2136f654f1b52397e35046d2848; SHA256 78d8acb4a549ab60e4d44fd798240b57b0617bf0964a7e93700db12dab90ebbf; 11.356.016 byte.
- Deploy GIS-only: VPS checkout 276794c5a7099bcc5ea42c21b0d2eac6c8c2b300; backup Build323 /var/backups/goi-gis-runtime/prebuild324-FXSQb9US verificato; goi-gis-app active. Prima richiesta HTTP rifiutata in avvio, retry HTTP200 PASS e HTTPS200 PASS; byte/SHA esatti.
- Review GPT sostitutiva 19/19 PASS; [review](REVIEW.md). Reviewer AI indipendente post-hoc PENDING.
- Statici12/12, geometria pura4065/4065; candidato R3 108/108 PASS. [Storico e limiti](REVIEW.md).
- ABQA HTTPS LIVE 108/108 PASS, quattro viewport: desktop1440, tablet768, phone390 e phone320 emulati. Fixture sintetiche su DOM prodotto, drag reale mouse/touch, resize/orientamento e resize durante drag, contenimento delle legende, no spazio/recupero, redraw, camera invariata. Richieste secondarie bloccate; nessun GPS implicito.
- Nessuna qualifica della disponibilita dei servizi cartografici esterni o di dispositivi fisici/altri browser. Nessun dato aeronautico, schema, cache/tile, archivio operatore o logica provider modificati.
- Ricevuta LIVE originale conservata localmente; SHA256 56b35e3cab6eb0491c4ee1fd1a0b4c666e34798f58b8f53ea917a60e6da00a1f. Driver SHA256 4d5ac8a196a1dca91576fa0e0d2e8ee71dbb1558a4fdbe477326d318aca66662. Baseline/R1 FAIL conservati, suite non sommate.

[Runtime LIVE](https://ionos-n8n-new.tailc01234.ts.net/gis?v=78d8acb4) - [Evidenza](evidence.json) - [Review](review.json).

NEXT: QA umana sul solo layout. Attestazione esatta QA GIS-LEGENDS-NO-OVERLAP-COORD-BARS-A PASS operatore. Regola H dopo PASS; non riaprire WU-0018. P0 non applicato; DTM HOLD; P4 FUTURO.
