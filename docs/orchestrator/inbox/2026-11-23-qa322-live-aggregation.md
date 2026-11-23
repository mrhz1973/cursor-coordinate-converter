# Build322 — Aggregazione QA HTTPS LIVE PASS (R1/R5/R6)

- GitHub HEAD prima del pass `1b41cf0bce6560c592d05bf8ec7e72f2a2beab59`, runtime SHA `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c`, nessuna modifica al monolite.
- R1 desktop1440 21/21 e phone320 19/19 completati; R5 tablet768 19/19 PASS; R6 phone390 19/19 PASS. Aggregazione fail-closed **78/78 PASS**.
- Originale R1 FAIL 44/46, R2/R3/R4 FAIL conservati. R5/R6 non intercettano il documento principale; intercettano e bloccano risorse secondarie qualificate; nessun bypass TLS/sandbox.
- Il precedente `ERR_INCOMPLETE_CHUNKED_ENCODING` non è attribuito a una causa unica. Test R5/R6 riusciti sul vero URL HTTPS LIVE con profili isolati.
- Nessun deploy nuovo, no GPS silenzioso, nessun archivio operatore letto o modificato.
- Gate: QA FINALE CHATGPT — PENDING; soltanto PASS operatore chiude il solo T1. Parent fractional zoom persistente non CLOSED. P0 autorizzato/non applicato, DTM HOLD, P4 FUTURO.
