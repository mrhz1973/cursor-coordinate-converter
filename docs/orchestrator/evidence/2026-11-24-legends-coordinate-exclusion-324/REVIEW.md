# Build324 - GIS-LEGENDS-NO-OVERLAP-COORD-BARS-A - review sostitutiva PASS

Fonte b08459bfa2eaf49df938d550b1800edce105096d; blob cb838af70477a2136f654f1b52397e35046d2848; SHA256 78d8acb4a549ab60e4d44fd798240b57b0617bf0964a7e93700db12dab90ebbf; 11.356.016 byte. Review del diff intero da raw@FULL_SHA, 166 aggiunte/167 rimozioni, unico HTML.

- Tier DELICATO prudenziale (lifecycle pannelli floating); REVIEW GPT-SOSTITUTIVA 19/19 PASS; nessun reviewer AI indipendente disponibile, post-hoc PENDING.
- Statici 12/12; matematica clamp/exclusion 4.065/4.065 PASS.
- Baseline Build323 FAIL 17/22: overlap durante e dopo drag; fixture estrema storica non qualificata. Candidato R1 84/88 FAIL: la fixture di occlusione non copriva realmente il viewport (precondizione mancata). R2 fixture corretta 92/92 PASS; R3 108/108 PASS su desktop1440, tablet768, telefono390/320 emulati, inclusi touch, resize durante drag e redraw. Suite sovrapposte non sommate.
- Invariante: nessun overlap di barre coordinate/toolbar nei casi qualificati; pieno contenimento, dimensioni reali, overflow scroll, fallback visibilita nascosta solo senza spazio minimo e recupero automatico. Nessun dato aeronautico o API modificato.
- OPSEC/network/cache/storage: nessun nuovo endpoint, chiave, GPS o cambiamento di tile/cache. Lifecycle dialog N/A; layout/drag/ResizeObserver verificati.
- Test su elementi legenda reali con fixture sintetiche, profili browser isolati; non attestano servizi provider o device fisici.

[Review strutturata](review.json).

NEXT: deploy GIS-only con backup e readback HTTP/HTTPS, ABQA HTTPS LIVE, QA operatore.
