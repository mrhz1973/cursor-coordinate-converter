# Build320 — pan da cache LIVE; gate browser HTTPS bloccato

**Stato verificato il 22 novembre 2026.** `MAP-PAN-TILE-OVERSCAN-A`, DELICATO, `CLOSURE: STANDARD_RUNTIME_BUNDLE`.

La Build320 è pubblicata e distribuita. **Deploy tecnico PASS**, candidato qualificato e **REVIEW GPT-SOSTITUTIVA PASS**. La **QA automatica browser LIVE è bloccata durante l’ammissione del documento HTTPS**, prima di eseguire il GIS o gli scenari prodotto. **QA operatore PENDING; FINITO non innescato.** Build319 resta l’ultimo blocco chiuso.

[Apri Build320 LIVE](https://ionos-n8n-new.tailc01234.ts.net/gis?v=b3fcec11) · [Commit sorgente](https://github.com/mrhz1973/cursor-coordinate-converter/commit/ca3a38d1c7703c5bf93724cd5df608af2914751d) · [Evidenze strutturate](evidence.json) · [Review del gate finale](GATE.md).

## Identità e concordanza delle fonti

| Oggetto | Evidenza |
|---|---|
| Source commit pubblicato | `ca3a38d1c7703c5bf93724cd5df608af2914751d` |
| Runtime Git blob | `7e6af6b480fb634928ee9a5fc6b73d1be5440cdd` |
| SHA256 runtime | `b3fcec1135b77bd0dec21351fb87b894c5f5828bce455995b8fa03aaf744f689` |
| Dimensione | 11.334.841 byte; CR192, CRLF0 |
| Base Git implementativa | `b8d0313803d618cf08cc92264f5789af57f7f1c5` |
| Base runtime Build319 | SHA256 `5bd0375bdc851de12763b648eefb736db2c6a8e076ba8cbb4cbc3052d4600d18`, 11.299.241 byte |
| Pubblicazione | Push normale, remoto/tracking/commit concordanti, checkout posseduto pulito; solo runtime nel commit codice |
| Raw GitHub al FULL_SHA | Download diretto verificato il 22/11 alle 15:42:05 UTC; identità byte/SHA coincidente |
| VPS | Commit/blob/file concordanti; servizio `goi-gis-app` active e worktree pulito dopo deploy |
| Readback HTTP e HTTPS dal VPS | 200, corpo completo e SHA identico, alle 15:53:00 UTC |
| Readback HTTPS binario dal client Windows | 200, Content-Length 11.334.841, stream completo e SHA identico, alle 16:01:58 UTC |

Il GET binario dal client è una prova di distribuzione del file. **Non sostituisce una QA del prodotto eseguita nel browser LIVE.** I valori completi delle ricevute, gli orari e i pin degli artefatti sono in [evidence.json](evidence.json).

## Problema affrontato e modifica

La baseline Build319 riproduceva bordi vuoti durante il trascinamento anche su un’area con tile già presenti nella cache. Il candidato prepara le tile adiacenti mediante il getter esistente, ne attende la decodifica e mantiene una scena geografica coerente durante il gesto. Al rilascio trasferisce i nodi già pronti alla scena canonica, senza una seconda lettura o una nuova assegnazione della sorgente immagine per le tile trasferite.

La gestione comprende un nuovo gesto durante un commit pendente, annullamento, cambio strumento e transizione pinch→pan. Un gesto accettato produce un solo aggiornamento canonico; letture tardive non devono produrre commit dopo annullamento o cessione dello strumento. Budget e timeout hanno feedback esplicito e cleanup. I limiti sono 4 job, 256 record, 512 slot/URL, 32 MiB Blob e 128 MiB stimati per immagini decodificate. Il bypass verso il pan ordinario resta fuori dalla qualificazione di continuità da cache.

Il runtime rimane un singolo HTML standalone con JS vanilla. Non sono introdotti endpoint, richieste esterne, campi persistiti o migrazioni dello schema. Il getter IDB e i percorsi di archivio/sanitizer/import/export rimangono invariati. `state.mapWaypoints[]`, OPSEC strict, offline e opt-in restano vincolanti; nessun GPS silenzioso. Gli archivi dell’operatore non sono stati caricati o modificati dai test.

## Qualificazione candidata e review pubblicata

La qualificazione usa evidenze sullo stesso SHA, con ricevute originali e chiusure supplementari separate. **Non viene ricostruito un punteggio unico sommando prove ripetute.**

| Ambito | Risultato originale conservato | Esito della qualificazione |
|---|---:|---|
| CORE desktop1440/phone390 | 68/70 FAIL | Due problemi di associazione PNG/contesto chiusi con verbale supplementare e controllo negativo |
| Desktop esteso1440 | 93/97 FAIL | Quattro rilievi di misura chiusi con prove specifiche; nessuna riscrittura della ricevuta |
| Preflight1024 esteso | STOP | Densità preventiva qualificata con soglie, maschere e tolleranza invariate |
| Remaining R3 desktop1024 | 32/35 FAIL | Due endpoint successivamente verificati con quattro bordi osservabili |
| Remaining R3 tablet768 | 40/40 PASS | Consumato, non ripetuto |
| Remaining R3 phone390 | 18/32 FAIL | Precondizioni pending e protocollo touch corretti e poi esercitati positivamente |
| Remaining R3 phone320 | 35/35 PASS | Consumato, non ripetuto |
| Supplemento mirato | **49/49 PASS** | Desktop17/17; phone32/32. Entrambi i browser posseduti chiusi |

I due endpoint desktop hanno rispettivamente 36 e 44 campioni sul bordo inferiore, con zero mismatch nei quattro still release/settle. Tutte e tre le condizioni pending sono state osservate prima della seconda azione: salvataggi 1/0/0 e nessun commit tardivo. Il passaggio touch termina realmente ID2 prima dei cinque move del soloID1; zoom 5 e centro finale coincidono con l’expected indipendente. Il pinch comprende 29 frame qualificati, 11 oltre l’area iniziale; i frame non associati restano esclusi.

Dettagli, controllo negativo e limiti delle misure: [QA-CANDIDATE.md](QA-CANDIDATE.md). GO aggregato: SHA256 `4714e0403ad4a0d87c3b2d4d0ed34bd9e1a0318d01782bebac11c26c4f2c220f`.

La [REVIEW GPT-SOSTITUTIVA](REVIEW.md) è eseguita sul diff completo del commit pubblicato e sul sorgente equivalente al raw@FULL_SHA:20 hunk, 810 aggiunte, 61 rimozioni. Rete/tile/offline e differimento della persistenza camera sono applicabili e verificati. Roundtrip archivi e lifecycle modale sono N/A motivati per assenza di delta nei rispettivi percorsi; nessun test non eseguito viene dichiarato PASS. **Review AI esterna post-hoc PENDING quando disponibile.** Il verbale non viene attribuito a un’altra AI.

## Deploy eseguito

Il deploy è limitato al repository/runtime GIS e al servizio `goi-gis-app`. Prima del cambio sono stati verificati il vecchio HEAD/runtime e la pulizia del checkout, quindi il commit e il blob attesi in FETCH_HEAD, prima del fast-forward. Backup del runtime319 creato e riletto in:

`/var/backups/goi-gis-runtime/prebuild320-96vrjw00`

Dopo il fast-forward al FULL_SHA e il riavvio del solo servizio GIS, il controllo ha attestato `DEPLOY_TECHNICAL_PASS`: file/blob/SHA, worktree pulito, servizio active e readback HTTP/HTTPS200 con corpo completo. Il readback HTTP è riuscito al secondo tentativo previsto dal controllo; la ricevuta non conserva la causa del primo tentativo. HTTPS è riuscito al primo tentativo. Nessun intervento P0 o modifica di altri servizi.

## Gate LIVE: arresto prima dell’applicazione

Il primo avvio del driver si è fermato **prima del browser** perché il percorso della copia raw GitHub non rientrava nei percorsi di riferimento ammessi. È stata modificata soltanto la configurazione `runtimePath`, scegliendo la copia già qualificata e consentita. Entrambe le copie sono state rilette e hanno la stessa identità. Il vincolo sui percorsi non è stato ampliato.

Il successivo avvio del browser LIVE si è fermato con `LIVE_RESPONSE_STATUS`: una richiesta main, zero documenti validati, nessuna fixture o azione prodotto. Un diagnostico separato ha conservato le stesse condizioni di ammissione, TLS e singolo CONNECT, aggiungendo osservazioni limitate prima dell’assert. Ha registrato:

- richiesta GET Document esattamente canonica, frame e networkId posseduti coincidenti;
- `responseStatusCode: null`, `responseErrorReason: "Failed"`, nessun Content-Type o Location osservato;
- `net::ERR_ABORTED` soltanto **dopo fatal STOP e durante la chiusura**;
- chiusura del browser posseduto osservata; nessuno scenario prodotto LIVE eseguito.

**Causa NON ATTRIBUITA.** Questi dati non dimostrano un HTTP403, un difetto del runtime o un problema di certificato. L’errore durante shutdown non viene usato come spiegazione originaria. Il GETHTTPS binario completo dal medesimo client conferma separatamente la distribuzione della Build320; il precedente output del cmdlet Web, incompleto e non qualificato, non prova una versione vecchia.

Non sono stati disabilitati controlli dei certificati, sandbox o vincoli di rete; nessun replay viene presentato come prova LIVE. La suite prevista di 70 controlli **non ha superato l’ammissione del documento e non è PASS**. Si applica lo STOP al gate fallito, conservando il deploy già attestato.

## Stato operativo e NEXT

`BUILD320_LIVE / DEPLOY_TECHNICAL_PASS / QA_CANDIDATO_QUALIFICATA / AUTOMATED_BROWSER_QA_BLOCKED_HTTPS_ADMISSION / QA_OPERATORE_PENDING`.

NEXT: risolvere e qualificare l’accesso HTTPS del browser QA nel confine autorizzato, quindi completare la QA prodotto LIVE. Soltanto dopo ABQA PASS segue il collaudo operatore di `MAP-PAN-TILE-OVERSCAN-A`. **Non è attualmente richiesta una riga PASS manuale per superare il blocco. FINITO non è stato innescato.**

Build319 resta ultimo blocco chiuso. P0 rimane aperto, autorizzato e non applicato; DTM 5–10m HOLD; P4 FUTURO. Le prove sono su profili posseduti e viewport emulati, senza attestare dispositivi fisici o tutti i browser. La documentazione distingue stato corrente, evidenza verificata, risultati storici e causa ancora ignota.
