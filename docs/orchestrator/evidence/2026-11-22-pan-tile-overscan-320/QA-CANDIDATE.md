# Build 320 — sintesi della QA candidata R3

**Qualificazione candidata conclusa il 22 novembre 2026.** Il supplemento mirato è acquisito con **49/49 controlli PASS** sul candidato R3. Le ricevute precedenti conservano gli esiti originali FAIL/STOP. La copertura è ricomposta per ambiti e chiusure distinte; il GO aggregato è registrato nel verbale `4714e0403ad4a0d87c3b2d4d0ed34bd9e1a0318d01782bebac11c26c4f2c220f`. Lo stato successivo del rilascio è descritto in [REPORT.md](REPORT.md) e [GATE.md](GATE.md): questa sezione non attribuisce PASS alla QA browser LIVE o all’operatore.

## Identità e perimetro

Il candidato è `coordinate_converter Claude.html`, Build 320, **11.334.841 byte**, SHA256 `b3fcec1135b77bd0dec21351fb87b894c5f5828bce455995b8fa03aaf744f689`. La base Git dell’implementazione è `b8d0313803d618cf08cc92264f5789af57f7f1c5`. Le quattro ricevute identificano lo stesso runtime: supplementi e correzioni delle misure non introducono un nuovo candidato.[^core][^extended][^remaining][^supplement]

Il blocco è `MAP-PAN-TILE-OVERSCAN-A`: preparazione delle tile da cache, trasferimento dei nodi decodificati, gestione dei gesti concorrenti e feedback GIS. Un bypass di budget verso il pan ordinario conserva il proprio limite: non dimostra continuità da cache.

## Evidenze originali e supplementi già acquisiti

| Ricevuta originale | Esito conservato | Qualificazione separata |
|---|---|---|
| CORE R2, desktop1440 e phone390 | **68/70, FAIL**; 34/35 per viewport | I due finding raster sono chiusi dal verbale supplementare come problemi di associazione della misura nel perimetro analizzato. |
| EXTENDED R2, desktop1440 | **93/97, FAIL** | Quattro finding chiusi mediante prove specifiche. |
| EXTENDED R2, desktop1024 | **STOP al preflight** | Calibrazione densa qualificata; i controlli funzionali sono poi stati acquisiti nel remaining R3. |

Non si riscrivono i punteggi originari. CORE completo non significava gate completo; EXTENDED R2 conservava `suiteComplete=false`, stato STOP e `fullGateSatisfied=false`.[^core][^extended][^core-review][^extended-review]

### CORE e baseline negativa

Il supplemento esamina 45 frame di movimento contestati. Quattro patch interne prefissate identificano una geometria precedente univoca, senza usare i bordi per scegliere l’allineamento e mantenendo tolleranza RGB 3. Nei 23 frame desktop e 21 phone i bordi sono conformi con le maschere assegnate originali. Nel restante phone frame 16, sei residui ricadono nella posizione storica registrata del pulsante HUD: con quella maschera esatta risultano 2.625 campioni e zero mismatch.[^core-review]

Nove pixel letti indipendentemente tramite System.Drawing confermano puntualmente il decoder, senza attestare tutti i pixel. Le età massime osservate delle geometrie precedenti, 60,228 ms desktop e 49,110 ms phone, non sono un limite universale del compositore.[^core-review]

Il negativo utilizza lo still baseline 319 reale `east-drag-4.png`, SHA256 `7ae6b2885a74c114d918de545873210202f811f4e328e3cd81d587624e25d9d9`, mantenendo 18 maschere. L’oracolo riproduce **5.070 campioni e 2.492 mismatch ai bordi**. Nessuna delle cinque geometrie precedenti, da 24 campioni ammessi, soddisfa la registrazione interna o rende completo il PNG; il minimo dei mismatch resta 2.492. `negativeDiscriminantPreserved=true` riguarda questo caso concreto, non una sensibilità universale. Non esiste qui una registrazione valida seguita da errore del bordo: quella eventualità resta non applicabile.[^core-review]

### Desktop esteso già consumato

Il finding sulle coordinate a basso zoom deriva dalla precisione dell’origine CSS nell’expected. La ricostruzione a precisione piena chiude il rilievo mantenendo runtime e tolleranza 10⁻⁷° invariati. Nei fault decode/timeout, stato e salvataggi sono invariati, il manager è drenato e gli still hanno **5.743 campioni visibili, zero mismatch**. Il notice copre il ribbon inferiore: rollback attestato, nessun PASS dei quattro bordi.[^extended-review]

Per il release del wrap, i due contesti differiscono esattamente di 1024 pixel, un mondo XYZ a zoom 2. Entrambe le coppie originali contesto/maschera sono conformi: 6.239 e 6.235 campioni, zero mismatch. Lo still conserva `stable=false`; la prova è specifica, senza eccezione generale alle transizioni di generazione.[^extended-review]

Il preflight 1024 originario aveva 3.486 campioni conformi ma right=18/bottom=8. La densità preventiva 1, invece di 2, produce 12.526 campioni conformi con ROI, maschere, colori, tolleranza e minimo 20 per lato invariati. Qualifica il campionamento, senza sostituire le prove funzionali.[^extended-review]

## Remaining R3: esiti originali e chiusure mirate

La ricevuta, conclusa il 22 novembre alle 15:13:26 UTC, ha `suiteComplete=true`, **status FAIL** e `fullGateSatisfied=false`.[^remaining]

| Preset | Risultato originale | Attribuzione e chiusura distinta |
|---|---:|---|
| desktop1024 | **32/35, FAIL** | Bottom non osservabile per UI/griglia; i nuovi endpoint sono qualificati dal supplemento. |
| tablet768 | **40/40, PASS** | Preset acquisito; non viene ripetuto. |
| phone390 | **18/32, FAIL** | Pending non attivati e protocollo pinch→pan inadeguato; i casi corretti sono qualificati dal supplemento. |
| phone320 | **35/35, PASS** | Preset acquisito; non viene ripetuto. |

I PASS tablet768/phone320 riguardano i loro 75 controlli. Sul phone390 originario restano registrati 11 incompleti e 3 product failure; il supplemento qualifica nuovi casi con precondizioni verificate, senza riscrivere le classificazioni precedenti.[^remaining][^supplement]

### Attribuzioni verificate e limiti

Nel desktop1024 i quattro still release/settle sono stabili e riportano zero mismatch, ma `bottom.n=0`. Il ribbon ha 11.928 posizioni: 11.880 coperte dall’unione delle maschere, 48 residue nelle colonne 934–937. Tutte 48 sono escluse dalla fase della griglia fixture. Il bordo non è completamente coperto dalla UI, ma nessun punto residuo è valutabile. I drag validi restano evidenza del movimento; non sostituiscono release/settle. Nessuna eccezione notice è applicata ai pan ordinari.[^bottom]

Nel phone390 originario mancava l’attivazione osservata dei pending: gli assert dipendenti su centro, salvataggi e rete non qualificavano la corsa prevista. Nel pinch, omettere ID2 da move non lo terminava; il movimento successivo conservava due contatti. Il supplemento corregge queste precondizioni secondo il piano, verificando la lettura pendente e la terminazione parziale prima degli assert prodotto.[^targeted][^supplement]

## Supplemento mirato acquisito: 49/49 PASS

La nuova ricevuta, conclusa il 22 novembre alle **15:36:19 UTC**, riporta **PASS**, `suiteComplete=true`, 49 controlli attesi/eseguiti e `fullGateSatisfied=false`. Non sono stati ripetuti CORE, desktop1440, tablet768 o phone320.[^supplement]

| Scope eseguito | Esito | Evidenza acquisita |
|---|---:|---|
| Desktop1024: endpoint east/NW | **17/17 PASS** | Quattro still release/settle conformi sui quattro bordi, zero mismatch; bottom 36/44 campioni, offset +4 CSS px prefissato. |
| Phone390: tre pending e pinch→pan | **32/32 PASS** | Pending attivati positivamente; seconda gesture, cancel e tool-yield verificati; terminazione parziale touch e pinch→pan corretti. |

L’estratto verificato dal coordinatore documenta la key 16/12 oltre il buffer iniziale, ritardo attivo e `pendingCommit=true`: salvataggi rispettivamente **1/0/0** nei tre casi. Il pinch registra touchend trusted di ID2, poi solo ID1 prima dei cinque move, zoom 5 e centro atteso; il preflight conserva lo stato.[^observations]

La copertura phone comprende **29 frame qualificati**, tutti con avanzamento visibile, **11 oltre l’area iniziale**, più still release/settle. Restano esclusi 71 frame non associati: 54 senza predecessore causale, 11 senza bracketing stabile, 6 con cambio maschera UI. Nessuna geometria irrisolta nei frame ammessi; nessuna attestazione di tutti i refresh fisici.[^supplement]

Le chiusure restano distinte: CORE tramite verbale raster e negativo; desktop1440 tramite verbale esteso; tablet768/phone320 tramite i PASS remaining; endpoint1024 e pending/pinch390 tramite questi 49 controlli. Non si sommano ricevute, assert ripetuti e supplementi in un punteggio unico. L’aggregazione sullo stesso SHA ha ricevuto il **GO alla pubblicazione del codice** nel verbale finale `4714e040…`; gli stati LIVE e operatore restano gate separati.

## Confine dell’attestazione

Le prove usano un browser posseduto e viewport emulati, non dispositivi fisici o altri motori. Le ricevute documentano GPS zero e chiusura osservata dei browser, con `appContainer=false` e `inheritsP0Qualification=false`. Questa QA candidata non attesta copertura integrale dei pixel/refresh fisici, QA browser LIVE 320 o PASS operatore 320. Il source commit è stato successivamente pubblicato e il deploy tecnico è PASS; il browser LIVE si è fermato prima dell’applicazione. Questi esiti distinti sono registrati in [REPORT.md](REPORT.md) ed [evidence.json](evidence.json).[^remaining][^supplement]

## Fonti fissate

[^core]: `.git/build320-core-r2-native-receipt.json`, SHA256 `92df5cd7d7f2af097bb9e07646717f91810f2365cb0f5720af97e1e97713718b`.
[^core-review]: `.git/build320-core-supplemental-review.md`, SHA256 `0a40113c13f10d52fc75fb99be213a71450133eab44a6a9522a475a4df4ca87c`.
[^extended]: `.git/build320-extended-r2-native-receipt.json`, SHA256 `22c478bfeff7486276f13f0ec332422289254bb2e6f2352283c21094f8558e78`.
[^extended-review]: `.git/build320-extended-desktop-supplemental-review.md`, SHA256 `1bc952957a1ff7bac98e716109cc9565e787a1a3d364cd015ce43e83cfb909b2`.
[^remaining]: `.git/build320-remaining-r3-native-receipt.json`, 112.764 byte, SHA256 `b97048938c9e7a769ef1edce73a407dc02061363e0e30446dcb41a1f172c003b`.
[^bottom]: `.git/build320-desktop1024-bottom-analysis.md`, SHA256 `3d5a64f3d4ae7c22d459aef24ec2df24781ee388de38ab94950ca3dc98e07d9b`.
[^targeted]: `.git/build320-targeted-supplement-plan.md`, 4.955 byte, SHA256 `0c95f895cc1392c2d401fd6954a4de3a147264162a4111bb75f1a0964664a916`.
[^supplement]: `.git/build320-supplement-r4-native-receipt.json`, 48.811 byte, SHA256 `83902a307f9a7785bf07a27c6091ad34954e1d1075705cfec08c0c481a6b8960`.
[^observations]: `.git/build320-supplement-r4-observations.json`, 39.831 byte, SHA256 `fa9608dbbcbdce869ba7db4989210cf57af81274c7da512649765c0a047ba9ca`. Pin e riscontri comunicati dal coordinatore, senza rilettura dell’estratto. Fonti datate 22 novembre 2026; aggiornamento dai soli campi necessari della ricevuta, senza lettura raw/monolite o esecuzione di prove da parte dell’autore.
