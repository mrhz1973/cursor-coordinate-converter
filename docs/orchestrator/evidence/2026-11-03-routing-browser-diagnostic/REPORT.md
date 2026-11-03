# Diagnostica browser rete locale — 2026-11-03

## Esito

**CAUSA OSSERVATA: blocco Local Network Access di Chromium 151 da origine HTTP non sicura.** La diagnostica ha verificato che i servizi rispondono via curl e che i loro header CORS corrispondono all’origine corrente. In Chromium, invece, le richieste autorizzate falliscono con `corsError=InsecureLocalNetwork` e `net::ERR_FAILED`. Non è una prova di indisponibilità del VPS, né di errore nel payload di routing.

## Perimetro e risultati

- Runtime locale verificato prima della prova: SHA-256 `32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28`.
- Origine browser: `http://100.99.54.93:8000`; Chromium `151.0.7922.34`.
- Dal browser sono stati tentati solo `GET /info`, `GET /ors/status` e richieste `OPTIONS` ai percorsi di routing. Nessun `POST /route` o directions è stato inviato.
- Con curl, `GET /info` e `GET /ors/status` hanno risposto `200`; le sole preflight `OPTIONS` ai percorsi `/route` e ORS directions hanno risposto `200` e `204`. GraphHopper ha restituito `Access-Control-Allow-Origin: *`; il gateway ORS ha restituito `Access-Control-Allow-Origin: http://100.99.54.93:8000`, con metodi/header richiesti consentiti.
- Nel browser tutti e quattro i metodi/path sopra hanno restituito `ERR_FAILED`; il protocollo CDP ha classificato ogni errore `InsecureLocalNetwork`. Nessuna risposta HTTP è stata osservata dal browser. Gli errori della console sono stati conservati solo come classi, senza messaggi o URL.
- Le risposte curl ai preflight legacy contenenti `Access-Control-Request-Private-Network: true` non includono `Access-Control-Allow-Private-Network`. La guida corrente di Chrome indica che LNA usa permessi lato browser e CORS standard; i vecchi header PNA non sono il rimedio richiesto.

## Diagnosi e prossimo passo

L’HTML è servito sull’origine `http://100.99.54.93:8000`, non in un contesto sicuro. Chromium 151 segnala direttamente il blocco LNA per richieste verso gli endpoint tailnet. Chrome documenta che gli accessi LNA richiedono un contesto HTTPS sicuro e vengono negati automaticamente da una pagina top-level HTTP; il browser può poi richiedere il permesso LNA quando l’accesso è avviato esplicitamente dall’utente. [Guida Local Network Access per Chrome](https://developer.chrome.com/docs/modern-web-guidance/guides/security/local-network-access), [rilascio Chrome 142](https://developer.chrome.com/release-notes/142?hl=en).

Proposta, non applicata: servire la pagina candidata da un’origine HTTPS Tailscale con certificato fidato, mantenere gli endpoint GH/ORS già configurati e verificare `/info` e `/ors/status` dal browser. Se Chrome richiede il permesso di rete locale, richiederlo solo dopo spiegazione e gesto esplicito dell’utente. Non disabilitare TLS/CORS o le protezioni del browser. Solo dopo che i GET sono leggibili dal browser, riprendere una singola prova di routing con dati pubblici e gli stessi stop condition.

## Limiti

Nessun servizio, runtime, gateway, ACL o impostazione del browser è stato modificato. Non sono stati inviati `/nearest`, route POST o ORS directions POST. Quindi snap, dettagli cartografici, anti-ferry, anteprima e salvataggio restano **non verificati**; il gate routing rimane aperto. Il runner diagnostico e i risultati sanitizzati sono in [run.cjs](run.cjs) e [result.json](result.json).
