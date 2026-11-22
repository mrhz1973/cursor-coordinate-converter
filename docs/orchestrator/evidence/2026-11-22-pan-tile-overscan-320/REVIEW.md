# Build320 — REVIEW GPT-SOSTITUTIVA sul codice pubblicato

**22 novembre 2026 — ESITO PASS; GO al gate predeploy.** Nessun finding bloccante concreto nel bundle pubblicato. Questa è una review GPT-sostitutiva interna, eseguita perché non è disponibile un reviewer AI esterno distinto. Non è presentata come review esterna e non attesta deploy, LIVE, QA operatore o FINITO già eseguiti.

## Identità della fonte effettiva

- **FULL_SHA:** `ca3a38d1c7703c5bf93724cd5df608af2914751d`.
- Parent: `b8d0313803d618cf08cc92264f5789af57f7f1c5`.
- Tree: `0de9be90f05e32dffc21f5e5c52fba48c1712e4c`.
- Runtime blob: `7e6af6b480fb634928ee9a5fc6b73d1be5440cdd`.
- Runtime: **11.334.841 byte**, SHA256 `b3fcec1135b77bd0dec21351fb87b894c5f5828bce455995b8fa03aaf744f689`, CR=192, CRLF=0.

Fonte raw realmente acquisita dal root: [GitHub raw del runtime al FULL_SHA](https://raw.githubusercontent.com/mrhz1973/cursor-coordinate-converter/ca3a38d1c7703c5bf93724cd5df608af2914751d/coordinate_converter%20Claude.html). La ricevuta registra download concluso con exit0 alle **2026-11-22T15:42:05.0039132Z**, stesso hash e dimensione, redirect non ammessi e nessun bypass della validazione del certificato. Non se ne deduce un'attestazione di TLS non intercettato.

Il reviewer ha verificato direttamente che `git show FULL_SHA:runtime` e il runtime locale coincidano **byte per byte**, e che entrambi corrispondano alla ricevuta raw. Ha letto la sorgente locale così vincolata e **tutto il diff** parent→FULL_SHA: un solo file modificato, `coordinate_converter Claude.html`, **810 aggiunte / 61 rimozioni, 20 hunk**. Diff unificato esaminato: 50.172 byte, SHA256 `962070993361f0203c96555fcaf275c3ba35dcc3e5b55d7fae42cc33978a9a54`.

La prova di pubblicazione registra remote, tracking e commit coincidenti, push ordinario non forzato e worktree nativo pulito all'osservazione. Questa review è vincolata al FULL_SHA, non a un riferimento mobile a `main`.

## Applicazione della checklist canonica

Riferimento: `docs/OPERATING_MEMORY.md` al medesimo commit, §4, checklist REVIEW GPT-SOSTITUTIVA righe129–133, letta nel solo range pertinente.

### Rete / tile / proxy / OPSEC — APPLICABILE, PASS nel perimetro verificato

Il nuovo manager prepara immagini tramite il **getter di cache esistente `getTileBlobByKey`**, che nel diff non è modificato. Il manager non introduce `fetch`, XHR, WebSocket, endpoint, host, proxy o provider. Genera soltanto BlobURL locali per Blob già restituiti dalla cache. Il formato delle chiavi resta quello di `makeTileKey`; X geografico viene normalizzato per la chiave, mentre gli slot DOM mantengono X non avvolto per rappresentare copie distinte del mondo.

`hydrateMapTiles` riceve soltanto un fast path vincolato a chiave, layer, zoom, generazione, sorgente BlobURL e immagine pronta. Il trasferimento del nodo già decodificato evita una seconda assegnazione `src` e una rilettura della tile trasferita. I percorsi provider/rete preesistenti e le chiamate degli overlay restano invariati. Non vengono cambiati opt-in, `forceOffline`, OPSEC strict, GPS o politiche del proxy.

Le prove candidate vincolate allo stesso hash coprono cache offline con rete negata, pan oltre l'impronta iniziale, wrap, handoff reale, tile indisponibile, errore di decodifica, timeout e budget. Le richieste dell'asset UI legacy sono registrate e negate; non vengono presentate come nuove richieste del manager né come assenza assoluta di eventi di rete. La modalità standard successiva al budget conserva la politica esistente.

### Sanitizer / whitelist / nuovo campo persistito / create-path / storage — round-trip archivio NON APPLICABILE

Il diff completo non modifica schema, chiavi di persistenza, implementazione di `saveStore`, serializer, sanitizer, whitelist, import/export, reload o create-path di Tracce, poligoni o waypoint. `state.mapWaypoints[]` resta canonico e non è toccato. Non viene rimosso o allentato alcun type-check di quei percorsi.

Le nuove Map, code, immagini, timer e ownership sono proprietà transitorie del nodo DOM `root` o oggetti locali; non sono nuovi campi nello stato persistito. Il getter IDB rimane puro e invariato. Le nuove operazioni di lettura della cache tile appartengono alla categoria cache/rete sopra; non introducono una scrittura archivio.

**Applicabilità distinta:** viene differito il momento delle scritture camera già esistenti (`state.viewCenter`, `state.mapZoom`, `saveStore`). I due callsite di salvataggio restano nei rispettivi commit pan/pinch, con le stesse formule e dati; il manager decide quando eseguirli o annullarli. Questa variazione temporale è applicabile ai controlli di commit ed è coperta da singolo salvataggio/render, composizione del secondo gesto, cancel, cessione al tool, fault/timeout e assenza di commit tardivi.

Non è stato eseguito né dichiarato PASS un round-trip save→reload→export→import di Tracce e poligoni. Il requisito specifico della checklist non si attiva per questo bundle perché quei percorsi e dati non cambiano. Qualsiasi successiva modifica a tali percorsi richiederebbe una nuova valutazione e la prova prescritta.

### Lifecycle modale/dialog — NON APPLICABILE

Nessun hunk modifica dialog, apertura `show`/`showModal`, `aria-modal`, close per-dialog, pulsanti −/×, minimize, backdrop, inert o gestione del focus. I riferimenti a dialog/openTrackPasteModal nelle intestazioni o nel contesto del diff non sono modifiche a quei percorsi.

La nuova UI è un avviso **non modale**, figlio diretto di `#miniMap`, con `role=status`, `aria-live=polite`, `aria-atomic=true`, testo tramite `textContent` e `pointer-events:none`. Non crea un dialog né richiede una QA modale nuova. Il suo lifecycle transitorio è invece applicabile ed è valutato sotto.

## Verifiche trasversali sull'intero bundle

- **Standalone e scope:** solo HTML/CSS/JS inline vanilla; nessuna dipendenza, modulo, framework o split runtime. Identità Build319→320 e nuovo blocco sono coerenti. Il manager si attiva soltanto nel mount GIS; le classi del buffer sono proprie e non entrano nei selettori legacy `.tile`/`.tile-wrap` prima del trasferimento controllato.
- **Coerenza della scena:** durante il gesto viene applicata una trasformazione soltanto quando la finestra richiesta è pronta; i canonici che escludono la preview hanno un gate di presentazione dedicato. Il gruppo geografico resta `.tile-layer`; non vengono cambiate formule di camera, coordinate formatter, readout o dispatcher. Il completamento asincrono aggiorna la disponibilità, senza introdurre trasformazioni asincrone separate o nuove query di elevazione.
- **Ownership e lifecycle:** nodi immagine già pronti passano al renderer con identità verificabile e ownership BlobURL trasferita. Le generazioni obsolete non possono committare. Resize, uscita GIS, render e fallback SVG invalidano/disconnettono il manager; SVG revoca anche i BlobURL già passati al percorso legacy. Observer e listener sono circoscritti al mount, al suo parent immediato e all'attributo class del body.
- **Risorse:** ledger comune al root comprende lavori precedenti ancora in rilascio e decode canoniche. Limiti: 4 job, 256 record, 512 slot/URL, 32 MiB di Blob e 128 MiB di stima RGBA decodificata; deadline lavoro2,5s e commit5s. La corona opzionale viene scartata prima delle risorse necessarie al viewport. La stima RGBA non è un'attestazione del picco totale di memoria del browser.
- **Interazioni e provider:** restano le precedenze dei tool/handle/brush e le formule pan/pinch; un nuovo gesto del tool annulla il commit pendente. Il monitor tile conserva la politica offline, la soglia80% e il timeout4,5s, con controllo di generazione e cleanup. Non si amplia il perimetro provider. Coverage dark/light è riprodotta senza doppia tinta sui canonici.

## Evidenze riutilizzate e loro limiti

La review statica R3 e il gate candidato aggregato sono fissati allo stesso runtime verificato. Il gate candidato documenta CORE originale68/70 FAIL con chiusura supplementare dei finding di associazione; desktop1440 originale93/97 FAIL con prove distinte; remaining originale125/142 FAIL; i75 PASS consumati di tablet768/phone320; e il supplemento R4 **49/49 PASS** con precondizioni positive, endpoint36/44, tre pending/save1/0/0 e transizione trusted a un solo contatto prima del pan.

Gli originali FAIL/STOP restano tali nelle ricevute. Le chiusure non sono un punteggio retroattivo né una nuova esecuzione. La matrice reale riguarda l'ambiente Edge registrato e i viewport emulati: non attesta Safari/Firefox, dispositivi fisici, tutti i provider o ogni refresh del display. La verifica LIVE resta successiva.

## Finding, decisione e backstop

**Finding bloccanti nuovi: nessuno.** Le correzioni statiche precedenti risultano presenti nel diff pubblicato; le lacune dei driver e le relative prove supplementari sono mantenute nel dossier. Non è stata apportata alcuna modifica runtime durante questa review.

**Decisione:** gate REVIEW GPT-SOSTITUTIVA sul FULL_SHA sopra **PASS**; il root può procedere al deploy tecnico previsto e poi alla QA LIVE. Non si attesta che queste azioni siano già state eseguite.

**Backstop esterno post hoc: PENDING.** Resta da far esaminare questo stesso FULL_SHA e il dossier a un reviewer AI esterno distinto quando disponibile, registrandone fonte, finding ed esito. Questa review interna, le verifiche dei colleghi e le ricomputazioni indipendenti non vengono dichiarate equivalenti a quel backstop. Un eventuale finding successivo richiederà correzione e rivalutazione dei gate pertinenti.

## Pin documentali

| Artefatto in `.git/` | Byte | SHA256 |
|---|---:|---|
| `build320-published-raw-proof.json` | 658 | `ad1480a200cd11317ea0e00d8bee7a4e7ce8e50b1f0cfc2401a52c779ef4642c` |
| `build320-code-publication-proof.json` | 861 | `fd874b5dfbd350dbe29e93e718540d64f4e22cb74b2d553b242df5bf63fb95ca` |
| `build320-static-review-r3.md` | 6943 | `77463d1599ad4c582fc214371762e4b1b78dc2ed1e9860442b2e02ca00c1fe15` |
| `build320-candidate-final-gate-review.md` | 5182 | `4714e0403ad4a0d87c3b2d4d0ed34bd9e1a0318d01782bebac11c26c4f2c220f` |

Il gate candidato contiene i pin delle ricevute e dei supplementi richiamati. Per questa review non sono stati rieseguiti test, avviati browser o strumenti nativi, effettuati push o deploy. L'unico nuovo artefatto scritto dal reviewer è questo verbale.
