# Build320 — QA browser LIVE aggregata R6/R7

**Data delle esecuzioni: 22 novembre 2026 (UTC).** Revisione documentale di evidenze già prodotte; nessun nuovo browser, test runtime o deploy in questo pass.

## Decisione tecnica e identità

**AUTOMATED BROWSER QA MAP-PAN-TILE-OVERSCAN-A PASS nel perimetro combinato desktop1440 + phone390 (70/70).** Il blocco Build320 resta **APERTO / QA OPERATORE PENDING**. Non è innescato `finito` e non è stata dichiarata alcuna QA umana.

- Source commit LIVE: `ca3a38d1c7703c5bf93724cd5df608af2914751d`.
- SHA-256 runtime: `b3fcec1135b77bd0dec21351fb87b894c5f5828bce455995b8fa03aaf744f689`; 11.334.841 byte; build 320, non modificata.
- URL esatto: `https://ionos-n8n-new.tailc01234.ts.net/gis?v=b3fcec11`.
- Browser verificato: Edge `158.0.4370.33`, catalogo dei componenti osservati SHA-256 `bc8338f428d93657e853ebbf0799b67bb2e3d483a4c25e8ad5861b935eb3096c`.

## Riconciliazione di due ricevute distinte

| Evidenza | Perimetro ed esito | SHA-256 receipt |
| --- | --- | --- |
| `Build320-pan-live-r6-3YDtKn/receipt.json` | desktop1440 **35/35 PASS**; esecuzione phone390 **STOP/CDP_EVENT_FAILED** conservata; root R6 = STOP | `443e4c3578ce6b88d2fff0cfde79b6c482262bc53b220e9cbbd386a409c0f396` |
| `Build320-pan-live-phone390-r7-On3fHc/receipt.json` | phone390 residuo **35/35 PASS**; root R7 = PASS limitato al telefono | `fdcb6658fcd1d5a500c5cf70670a18a3285cf5cd24d6f21debc833a87ca40c37` |

I due run usano **driver distinti** (SHA R6 `f13d5a510c1013c76425cff88720f4a8331802bee34c6dafc7e1ddadf5516971`, R7 `a3734086bc44019e5f4021ac7b231272e1a4b78b3e80771f132163a168d11f7d`) con **identico runtime, catalogo Edge, URL LIVE e manifest fixture** (`bc9bb9e19c0717dc707897094858c054667b9dd6ee26895b543f3864c24592b6`). Non si riscrive il FAIL tecnico del telefono in R6 e non si sommano ripetizioni: l'aggregazione associa un caso valido desktop a un caso valido telefono, ciascuno con i propri 35 check.

Il verificatore docs-only ha confrontato le due ricevute originali con i file per caso: `pan-raw.json`, `case-receipt.json` e `fixture-manifest.json` (sei confronti **dimensione + SHA-256 PASS**), 70/70 check dichiarati senza errori, nessuna anomalia di runtime/console/target, documento HTTPS reale validato in entrambi i casi e dati origine/operatori invariati. I dettagli, gli hash per artefatto e i controlli espliciti sono in [`evidence.json`](evidence.json).

## Boundary, TLS e limiti delle prove

- Browser posseduti, profili temporanei separati e catalogo osservato/pinnato, boundary A dichiarato e verificato nelle ricevute. `appContainer=false` è un limite esplicito, non convertito in AppContainer PASS.
- La consegna HTTPS nei due casi è avvenuta tramite proxy con **un solo CONNECT canonico ammesso**, policy di rete chiusa prima delle azioni UI; nessuna modifica alle protezioni TLS, alla sandbox o al runtime.
- TLS 1.3 e `securityState=secure` dal trust store Edge, con issuer locale **ESET SSL Filter CA**; nessuna attestazione indipendente della catena TLS upstream. I flag di bypass certificato/override host sono assenti.
- Geolocalizzazione `getCurrentPosition=0`, `watchPosition=0`; nessun archivio del browser personale o dato operatore usato, cancellato o migrato.
- L'esito riguarda **Edge158 con viewport desktop1440 e phone390 emulato**, non un dispositivo fisico, Safari/Firefox, altri browser/versioni o una copertura pixel universale. I frame non associati restano esclusi dalle misure valide.
- La qualificazione del candidato e la REVIEW GPT-SOSTITUTIVA PASS sono quelle già pubblicate nel [dossier Build320 precedente](../2026-11-22-pan-tile-overscan-320/REPORT.md), sullo stesso SHA. La review AI esterna post-hoc resta PENDING quando disponibile.

## NEXT

Secondo OM §4, Regole D2bis e D2, il gate tecnico consente ora **QA FINALE CHATGPT — PENDING**. ChatGPT deve presentare all'operatore un collaudo umano breve, in italiano, limitato a continuità visiva della mappa durante pan da cache e comportamento touch. Solo l'attestazione esatta `QA MAP-PAN-TILE-OVERSCAN-A PASS operatore` abilita la chiusura documentale prevista dalla Regola H. P0 rimane autorizzato ma non eseguito; DTM5/10m HOLD; P4 FUTURO.
