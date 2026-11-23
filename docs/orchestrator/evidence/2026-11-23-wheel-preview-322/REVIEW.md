# Build322 T1 — REVIEW GPT-SOSTITUTIVA predeploy

**23 novembre 2026 · REVIEW GPT-SOSTITUTIVA PASS (18/18).** Bundle `MAP-FRACTIONAL-ZOOM-A-T1`, categoria **DELICATO**, `CLOSURE: STANDARD_RUNTIME_BUNDLE`. Questa review **non è una review di un’altra AI**. Il reviewer esterno post-hoc resta `PENDING_WHEN_AVAILABLE`.

## Identità e provenienza

| Campo | Evidenza verificata |
| --- | --- |
| Base | `be39bf163d8de541fc1158e3d2f1fe4f13f613a4` (Build321 runtime) |
| Source commit iniziale | `d715c18e4ecaad66ff9490faf1dc42521ca4bb0d` |
| Source commit definitivo con FIX1 | `e707870b7f0b550f2e4ccf61af498e7dd480b8f6` |
| Git blob | `5b3ddb2700736c6f5d7bed0574179c74929424bc` |
| Runtime SHA-256 | `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c` |
| Dimensione | 11.351.420 byte |
| Fonte | Raw GitHub SHA-pinned scaricato con HTTPS e senza redirect; hash, dimensione e copia locale concordi |
| Delta | Unico file `coordinate_converter Claude.html`, 144 aggiunte / 5 rimozioni |

[Contratto T1](../2026-11-23-map-fractional-wheel-preview-contract/CONTRACT.md) · [Audit preliminare](../2026-11-23-map-fractional-zoom-audit/REPORT.md) · [Review strutturata](review.json).

## Review per categoria applicabile

1. **Rete/tile/offline/OPSEC:** nessun endpoint, `fetch`, XMLHttpRequest, proxy, cambio provider o accesso GPS aggiunto. Durante il preview si trasforma soltanto il piano raster esistente, senza richieste di tile; il commit usa il percorso wheel già esistente. Restano il controllo del layer raster `url`/`urlBase`, l’esclusione delle sovrapposizioni speciali non qualificate e dei gesti posseduti da strumenti, e la protezione di pending cache-pan.
2. **Geometria/camera/hit-test:** `state.viewCenter` e `state.mapZoom` canonici non cambiano durante l’anteprima; all’idle viene applicato il consueto passo ±1. Generazione scena, layer, zoom e centro vengono confrontati prima del commit; pan, touch, click, redraw e UI wheel cancellano la trasformazione transient. Gli eventi mousemove sul piano trasformato non producono coordinate di cursore erronee.
3. **Lifecycle/cancellazioni:** la prima QA touch ha trovato un difetto CSSOM: `scale(1.155350)` serializzato come `scale(1.15535)` impediva il cleanup; corretto con confronto numerico e protezione di ownership. Il controllo del diff ha individuato anche il riavvio di una wheel dopo una scena stale: FIX1 ripristina il cursore dopo la cancellazione prima del nuovo evento. I precedenti FAIL sono conservati, non riscritti.
4. **Persistenza:** nessun nuovo campo o storage schema; lo zoom rimane il precedente valore canonico esistente dopo il commit. **Roundtrip archivi/sanitizer/import-export N/A**, perché nessun percorso o schema di tali dati è modificato. **Lifecycle modale N/A**: nessun dialog o modalità di chiusura è modificato.

## Evidenza QA predeploy

- Controlli statici del runtime definitivo: **17/17 PASS**.
- Candidato R3 e R4: **73/76 FAIL** (cleanup CSSOM), ricevute originali preservate.
- Candidato R5 dopo fix CSSOM: **76/76 PASS**, sul relativo SHA precedente.
- Candidato R6 dopo FIX1 stale-scene: **78/78 PASS** sullo **SHA definitivo**. Browser Edge158 su profili temporanei posseduti, viewport desktop1440, tablet768, phone390, phone320; fixture di tile sintetiche in IndexedDB dedicata, richieste secondarie bloccate, nessun archivio operatore caricato.
- Verificati: trasformazione prima del commit, progressione di scala, zoom/centro canonici stabili fino a idle, ancoraggio Web Mercator, cleanup dopo commit/redraw/pan/touch, interazione UI wheel esclusa, min/max zoom, esclusione degli overlay speciali, pinch→pan, tocco che interrompe wheel, riavvio dopo scena stale. Zero eccezioni JS e nessun GPS silenzioso osservati nei casi qualificati.
- Prima valutazione meccanica review 17/18 `FAIL` per un falso negativo nel controllo del diff (la riga `st.lastCursor` era contesto invariato, non linea aggiunta); revisione con asserzione ancorata al raw definitivo: **18/18 PASS**. La prima ricevuta locale è conservata distintamente.

## Gate e limiti

**REVIEW GPT-SOSTITUTIVA PASS / DEPLOY PENDING / ABQA HTTPS LIVE PENDING / QA OPERATORE PENDING.** Non dichiarare BUILD322 LIVE o `finito` sulla base di questa review. La Build321 resta ultima versione distribuita e CLOSED.

**T1** fornisce un’anteprima wheel visivamente fluida ma lo zoom finale rimane intero: **non realizza uno zoom frazionario persistente**. Safari, Firefox, dispositivi fisici e overlay/provider esclusi non sono certificati. Procedere al deploy GIS-only soltanto con preflight e backup, poi ABQA sul vero HTTPS LIVE e infine QA umana secondo OM §4.
