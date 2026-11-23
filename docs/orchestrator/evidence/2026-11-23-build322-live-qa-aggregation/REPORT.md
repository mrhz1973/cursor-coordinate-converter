# Build322 T1 — Automated Browser QA HTTPS LIVE aggregata PASS

**23 novembre 2026 · Gate tecnico PASS nel perimetro verificato; QA operatore PENDING.** Blocco `MAP-FRACTIONAL-ZOOM-A-T1` (DELICATO / STANDARD_RUNTIME_BUNDLE). Questa revisione combina quattro **casi completati**, non sostituisce o cancella gli STOP precedenti e non dichiara `finito`.

## Runtime e identità

| Campo | Valore |
| --- | --- |
| Commit sorgente runtime | `e707870b7f0b550f2e4ccf61af498e7dd480b8f6` |
| Blob Git runtime | `5b3ddb2700736c6f5d7bed0574179c74929424bc` |
| SHA-256 HTML | `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c` |
| Dimensione | 11.351.420 byte |
| LIVE | [Build322 HTTPS](https://ionos-n8n-new.tailc01234.ts.net/gis?v=c2c31a2e) |
| Deploy precedente | `DEPLOY_TECHNICAL_PASS`, con backup Build321 e readback HTTP/HTTPS200 byte/SHA |

## Quattro casi validi, senza sommare prove parziali

| Caso | Ricevuta | Esito verificato |
| --- | --- | --- |
| Desktop 1440 px | **R1** | **21/21**, caso COMPLETED |
| Telefono 320 px | **R1** | **19/19**, caso COMPLETED |
| Tablet 768 px | **R5** | **19/19 PASS**, caso COMPLETED |
| Telefono 390 px | **R6** | **19/19 PASS**, caso COMPLETED |
| **Totale** | **Aggregazione fail-closed** | **78/78 PASS** |

L'originale R1 resta **FAIL 44/46** perché includeva i due casi `tablet768` e `phone390` interrotti. Le verifiche parziali dei due STOP **non** sono state sommate. R2, R3 e R4 restano ricevute FAIL distinte: R2 non raggiungeva l'inizializzazione nei residui; R3 registrava `ERR_INCOMPLETE_CHUNKED_ENCODING` sul documento dopo 11.340.412 byte; R4 si arrestava per un tipo di risorsa non supportato dal filtro di debug.

Nei due casi residui validi **R5/R6**, il driver non intercetta più il documento principale HTTPS; blocca invece le richieste secondarie per le classi di risorsa qualificate. Il cambiamento è confinato al **driver QA**, non al runtime, VPS o ai certificati. La riuscita dopo questa modifica suggerisce un'interferenza del precedente filtro sul documento, ma **non prova da sola la causa unica** delle ricezioni incomplete.

## Verifiche della suite LIVE completata

Identità runtime invariata, browser Edge `158.0.4370.33` con profili temporanei posseduti e viewport emulati; per ogni caso sono stati verificati 121 tile sintetiche nella cache isolata, immagini caricate, trasformazione transitoria progressiva, centro/zoom canonici conservati durante il gesto, commit finale zoom 12 da zoom 11, ancoraggio Web Mercator, annullamento su redraw e pan, blocco wheel nella UI, absence di eccezioni JS/console nei casi qualificati. Le regressioni touch, pinch→pan, cancellazione e scena stale sono coperte dalle rispettive suite, senza attribuire verifiche su dispositivi fisici.

Il verificatore ha confrontato ricevute e PNG diagnostici con i rispettivi SHA-256, lo SHA del monolite nel checkout e le invarianti geometriche, con **zero incongruenze**. I file originali R1/R5/R6 e gli STOP R2/R3/R4 restano separati; [ricevuta aggregata strutturata](evidence.json). I PNG restano nella directory locale del driver e **non** sono caricati su GitHub.

## Confini e limiti

- TLS e policy OPSEC non sono stati indeboliti; non sono stati usati flag di bypass certificati o sandbox. L'assenza di una certificazione TLS indipendente upstream resta un limite.
- La QA è limitata ai viewport **emulati in Edge158**, non equivale a prove su iPad/iPhone reali, Safari, Firefox o tutti i browser del mondo.
- Le richieste secondarie sono state respinte dal filtro nei casi validi R5/R6. La qualifica riguarda le richieste e gli scenari osservati, non un test universale di ogni tipo di risorsa di rete.
- Questo è il sottointervento **T1**: anteprima wheel fluida, con zoom finale ancora intero. **Il parent `MAP-FRACTIONAL-ZOOM-A` non è CLOSED** e lo zoom frazionario persistente resta lavoro separato.
- Nessun nuovo deploy, modifica del monolite, accesso o scrittura agli archivi dell'operatore in questo pass documentale.

## Gate successivo

**`DEPLOY_TECHNICAL_PASS / REVIEW_GPT_SOSTITUTIVA_PASS / AUTOMATED_BROWSER_QA_PASS_AGGREGATED_78_OF_78 / QA_OPERATORE_PENDING`.** Dopo la registrazione del PASS tecnico su FRONTIER, ChatGPT emette una **QA umana breve** sullo zoom wheel T1. Solo l'attestazione esatta `QA MAP-FRACTIONAL-ZOOM-A-T1 PASS operatore` può innescare la chiusura documentale del **solo T1** secondo OM §4 Regola H. Su FAIL, identificare il finding e non chiudere.
