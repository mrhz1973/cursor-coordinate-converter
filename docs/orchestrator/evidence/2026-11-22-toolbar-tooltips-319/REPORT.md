# Build319 — tooltip della toolbar mappa GIS

**22 novembre 2026 · MAP-RIGHT-TOOLBAR-TOOLTIPS-A · ROUTINE.**

**DEPLOY_TECHNICAL_PASS / AUTOMATED_BROWSER_QA_PASS / QA_FINALE_CHATGPT_PENDING.** Nessun PASS operatore319, CLOSED o FINITO attribuito. [Evidenze e ricevute](evidence.json).

La direttiva «segui il backlog» porta alla voce operativa già specificata in [WU-0005-0009-roadmap](../../../work-units/WU-0005-0009-roadmap.md#map-right-toolbar-tooltips-a), dopo la chiusura dei lavori eseguibili della lista del 16 novembre. T1.1 non aperto; Oggetti GIS resta FROZEN/MAINTENANCE ONLY. P0 rimane secondario, aperto, autorizzato e non applicato.

## Identità e modifica

| Identità | Valore |
| --- | --- |
| Source commit | `b858b4e368d4eaa9ac007e73b0487c7e1a253f2c` |
| Blob | `d953ae6416b6b6e3b0405acc5b59400e93166703` |
| SHA256 | `5bd0375bdc851de12763b648eefb736db2c6a8e076ba8cbb4cbc3052d4600d18` |
| File | 11.299.241 byte; CR192, CRLF0 |

I tooltip della toolbar destra GIS sono immediati su hover e focus da tastiera, fuori dallo scroller e contenuti nella porzione visibile del viewport. Il focus resiste allo scroll automatico delle righe annidate; Escape e touch chiudono senza riaperture residue. Hover sui pulsanti disabilitati conservato senza renderli focalizzabili. Traccia usa il nome tradotto; gli altri testi, incluso GPS, restano quelli di `data-tip`, inseriti tramite `textContent`. Il contenuto del menu basemap è escluso dal nuovo comportamento. Nessuna modifica agli handler delle azioni, al GPS, allo storage o alla rete.

Review statica e controllo sintattico PASS sul runtime identificato.

## Iterazioni e qualifica candidata

- **R1 STOP del collaudo:** riferimenti DOM diventati disconnessi dopo reset; nessun risultato QA del prodotto.
- **R2 FAIL reale, 178/180:** due controlli a 320 px perdevano il tooltip durante lo scroll automatico pur mantenendo il focus. Corretto il solo helper di presentazione.
- **R3 FAIL dell’oracle:** il driver trattava wrapper `display:contents` come rettangoli di clipping nulli. R4 corregge una sola riga del driver; il runtime R3/R4 resta identico.
- **R4 finale: 196/196 PASS**, 03:28:45–03:29:14 Europe/Rome (UTC+01:00). Quattro suite complete: 1440×900, 1024×768, 390×844, 320×568; supplemento 1440×568 per Tab/scroll. Coperti Tab naturale verso controlli ritagliati, focus dopo scroll reale, controllo interamente ritagliato, chiusura dell’hover e mancata riapertura dopo Escape. [Driver candidato](candidate-tooltip-qa.cjs).

## Pubblicazione, deploy e LIVE

Runtime pubblicato e verificato alle 03:30:44 Europe/Rome; deploy GIS-only PASS alle 03:31:22 Europe/Rome (UTC+01:00). Servizio attivo, clone pulito, backup `/var/backups/goi-gis-runtime/prebuild319-v1omhzk6`. HTTP e HTTPS: **200**, nessun redirect, Content-Length **11299241**, build e SHA256 concordi.

**LIVE HTTPS reale: 112/112 PASS**, 03:32:07–03:32:27 Europe/Rome (UTC+01:00): 1440×900 **56/56**, 390×844 **28/28**, 320×568 **28/28**. Documenti reali acquisiti via HTTPS e verificati **3/3** prima dell’esecuzione; nessuna risposta HTML sintetica. Le altre richieste sono negate nel perimetro di prova. I probe estesi candidati non sono stati ripetuti. [Driver LIVE](live-tooltip-qa.cjs).

Nelle prove: zero errori console/runtime, chiamate GPS e click sulle azioni della toolbar; profilo operatore e dati privati non usati, archivio dell’operatore non modificato. Input invariati e chiusura dei browser propri osservata.

## Limiti e NEXT

Prove su **Edge157.0.4341.60**, profili esclusivi e viewport/touch emulati; nessun PASS universale, Safari/Firefox o dispositivo fisico identificato. Il perimetro è quello dei browser propri e componenti qualificati, non AppContainer né qualifica del recupero P0.

TLS1.3 `secure` con issuer **ESET SSL Filter CA** in tutti i tre casi LIVE; flag di bypass certificati e override host assenti. Nessuna attestazione di TLS diretta non intercettata.

Aprire [Build319 HTTPS](https://ionos-n8n-new.tailc01234.ts.net/gis?v=5bd0375b) per la breve QA operatore dei tooltip. Dopo il PASS: chiusura secondo metodo e prosecuzione del backlog operativo. Ultimo blocco chiuso: Build318. DTM5/10m HOLD; P4 FUTURO.
