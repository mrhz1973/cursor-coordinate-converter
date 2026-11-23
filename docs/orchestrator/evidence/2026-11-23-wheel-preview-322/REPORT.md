# Build322 T1 — LIVE, QA browser HTTPS bloccata sul flusso del documento

**23 novembre 2026.** `MAP-FRACTIONAL-ZOOM-A-T1`, categoria **DELICATO / STANDARD_RUNTIME_BUNDLE**. Il codice è distribuito, il **deploy tecnico è PASS**, la candidata è qualificata e la **REVIEW GPT-SOSTITUTIVA è PASS**. Il gate **Automated Browser QA LIVE non è PASS** perché alcune sessioni Edge ricevono incompletamente il documento HTML HTTPS. **QA operatore PENDING; FINITO non innescato.** Build321 resta l'ultimo blocco CLOSED.

## Identità tecnica

| Voce | Verifica |
| --- | --- |
| Source commit runtime | `e707870b7f0b550f2e4ccf61af498e7dd480b8f6` |
| VPS checkout dopo deploy (contiene documentazione review, stesso runtime) | `cc398bf20953031645bb4960f660953fa564ee4b` |
| Runtime Git blob | `5b3ddb2700736c6f5d7bed0574179c74929424bc` |
| Runtime SHA-256 | `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c` |
| Dimensione | 11.351.420 byte |
| URL distribuito | [Build322 T1 HTTPS](https://ionos-n8n-new.tailc01234.ts.net/gis?v=c2c31a2e) |
| Backup Build321 verificato | `/var/backups/goi-gis-runtime/prebuild322-zBb7KfJS` |
| Review | [REVIEW GPT-SOSTITUTIVA PASS 18/18](REVIEW.md), esterna post-hoc PENDING |

## Funzione implementata e perimetro

Wheel desktop: anteprima fluida tramite scala CSS transitoria della scena geografica raster, con ancoraggio al cursore. Il centro e il livello cartografico canonici rimangono invariati durante il gesto; l'idle completa il consueto commit a **zoom intero**. Gestione di cancellazione su nuovo pan/touch, click, redraw e cambio camera/layer; esclusione di strumenti e overlay speciali non qualificati. Nessun nuovo endpoint, campo persistente o GPS implicito. Non è zoom finale frazionario persistente; il parent `MAP-FRACTIONAL-ZOOM-A` resta parziale.

## Qualificazione e deploy

- Statici: **17/17 PASS**. Browser candidato (profili isolati, cache sintetica locale, network secondario negato): **78/78 PASS** su Edge158 desktop1440, tablet768, phone390 e phone320 emulati. Difetti reali intermedi CSSOM touch-cleanup e stale-scene cursor sono stati corretti; le ricevute storiche FAIL restano preservate.
- Review sostitutiva per DELICATO: **18/18 PASS** sull'intero diff da raw@FULL_SHA; nessuna review esterna viene attribuita fittiziamente.
- VPS: preflight Build321 HEAD/SHA e worktree pulito; backup byte/SHA verificato; `git pull --ff-only`, runtime nuovo e blob verificati; riavviato **soltanto `goi-gis-app`**.
- Readback dal VPS: **HTTP 200 e HTTPS 200**, ciascuno con 11.351.420 byte e SHA256 `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c`; servizio active, clone clean. Il servizio HTTP è stato disponibile al secondo tentativo del nuovo controllo con retry, dopo il riavvio.
- GET HTTPS binario dal client Windows: **HTTP 200**, 11.351.420 byte, SHA-256 esatto, circa 10,3 s. Questo prova la distribuzione a quel client, **non** la riuscita del browser prodotto.

## QA browser HTTPS LIVE — arresto tecnico, non attribuito al GIS

1. **R1**: due viewport completati (`desktop1440`, `phone320`); `tablet768` e `phone390` STOP durante la disponibilità del documento/stato JS. Ricevuta complessiva **FAIL 44/46**, non una suite PASS.
2. **R2 residuo**: `tablet768` e `phone390` nuovamente STOP con `document.readyState=loading` e `typeof state` non disponibile; ricevuta **FAIL 0/2**, senza esecuzione degli scenari applicativi residui.
3. **R3 diagnostico tablet**: risposta principale HTTPS **status 200**, ma la ricezione si arresta con `net::ERR_INCOMPLETE_CHUNKED_ENCODING`, 11.340.412 byte osservati in **604** frammenti, `loadingFinished=false`; mancano 11.008 byte rispetto alla Build322 attesa. La pagina mantiene il titolo HTML iniziale e non esegue ancora il codice applicativo. L'errore di trasporto è osservato; **non è dimostrata la causa originaria** (server, filtro locale, browser o altro).
4. **Diagnostico alternativo** con tunnel CONNECT HTTPS a destinazione unica: blocco `net::ERR_TUNNEL_CONNECTION_FAILED`; non costituisce QA valida e non viene sommato. Nessun bypass certificati, sandbox o restrizioni di rete.

La documentazione preserva le ricevute originarie e relative identità (hash/byte) nella [evidence.json](evidence.json). Non si riscrivono i FAIL e non si dichiarano `AUTOMATED BROWSER QA ... PASS` o `QA ... PASS operatore`.

## Vincoli e NEXT

**Stato: `BUILD322_LIVE / DEPLOY_TECHNICAL_PASS / REVIEW_GPT_SOSTITUTIVA_PASS / ABQA_LIVE_BLOCKED_HTTPS_MAIN_INCOMPLETE / QA_OPERATORE_PENDING / FINITO_NOT_TRIGGERED`.**

NEXT: risolvere e qualificare la ricezione del documento principale HTTPS **nel browser posseduto**, senza allentare TLS, OPSEC o il confine di richieste, quindi eseguire soltanto la QA LIVE residua di tablet768 e phone390 e aggregarla con i due casi R1 completati, conservando gli STOP. Soltanto dopo una revisione aggregata **ABQA PASS** segue la breve QA operatore; nessuna richiesta anticipata di attestazione PASS umana.

Le prove non certificano Safari/Firefox o dispositivi fisici; P0 resta autorizzato ma NON eseguito; DTM5/10m HOLD e P4 FUTURO. Nessun intervento è stato effettuato sugli archivi utente e nessuna modifica è stata apportata a nginx o ai servizi VPS estranei al GIS.
