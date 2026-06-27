# GOI GIS Tool — QA operatore

> **Natura del file**
> - Fa parte del **read-set operativo** (voce 4; vedi [`README.md`](../README.md)).
> - È una **procedura/template**, **non** la fonte dello stato vivo.
> - Lo stato operativo corrente resta in [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) **§7**.
> - La governance di handoff/chiusura è in [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) **§4 — Handoff & Close Discipline**.

## Principi

- **PASS operatore ≠ PASS tecnico.** Il PASS tecnico remoto (hash, deploy VPS, byte-match, `node --check`) è distinto dal PASS operatore (comportamento runtime verificato da una persona).
- **Cursor non attesta la QA visiva.** Cursor prepara la richiesta QA, ma non apre l'app, non carica tile e non inventa esiti al posto dell'operatore.
- **Emissione unica.** La QA viene emessa **una sola volta** nel report `finito` (o subito dopo deploy), dentro **un unico fenced code block** copiabile; l'operatore risponde **una sola volta**.
- **Fail-closed.** Senza attestazione esplicita dell'operatore, l'esito resta **QA operatore non eseguita / non attestata**. Non si inferisce PASS operatore da PASS tecnico, diff pulito o `node --check`.

## Formato predefinito — QA operatore minima narrativa

Per **micro-fix UI**, **patch runtime localizzate**, **correzioni circoscritte** e **blocchi di routine** senza OPSEC, rete, cache, storage o migrazioni, il formato **predefinito** è una **QA minima narrativa**: breve, operativa, immediatamente eseguibile.

**Non usare come formato ordinario:** tabelle; caselle `[ ]`; sezioni ripetute con sette categorie obbligatorie; campi data/browser/risoluzione salvo reale necessità; audit generale dell'app; controlli non pertinenti al blocco.

### Struttura canonica

1. **Apertura:** `Il deploy tecnico di <BLOCK-ID> è PASS:`
2. **Elenco breve** dei fatti tecnici già provati (quando noti): VPS/HEAD deploy; commit runtime; servizio attivo; HTTP 200; byte-match e SHA-256 match; componenti delicati non toccati; repository pulito.
3. **Frase:** `Ora serve solo la QA operatore minima, senza Cursor.`
4. **Sezione `Apri:`** con URL VPS e cache-buster runtime (vedi sotto).
5. **Sezione `Poi:`** con pochi passaggi concreti nell'app.
6. **Sezione `verifica che:`** con soli controlli specifici del blocco e regressioni strettamente pertinenti.
7. **Chiusura `Riportami:`** una sola risposta attesa:
   - `QA <BLOCK-ID> PASS operatore`
   - oppure il messaggio esatto dell'errore e il punto in cui si verifica.

### Esempio generico (template)

```
Il deploy tecnico di <BLOCK-ID> è PASS:

- VPS aggiornata a <deploy-sha>;
- runtime <runtime-sha> servito correttamente;
- servizio attivo;
- HTTP 200;
- byte-match e SHA-256 match;
- componenti fuori scope non toccati;
- repository pulito.

Ora serve solo la QA operatore minima, senza Cursor.

Apri:

http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=<runtime-short-sha>

Poi:

- <azione operatore 1>;
- <azione operatore 2>;

verifica che:

- <esito specifico 1>;
- <esito specifico 2>;
- l'app resti utilizzabile.

Riportami:

QA <BLOCK-ID> PASS operatore

oppure il messaggio esatto dell'errore e il punto in cui si verifica.
```

## Come innescare il rifiuto canonico del poligono per la QA

Nota operativa per **innescare volontariamente** il rifiuto in creazione poligono durante la QA. Non descrive un uso comune dell'app: serve a verificare i contratti **P5-B1**, **P5-B1-FIX**, **P5-B2-F** e blocchi futuri sullo stesso percorso (`polygonFinishDraw` → `gisFeatureAdd` → sanitizer).

### Condizione del rifiuto

Il messaggio **«Geometria non valida»** con **draft preservato** compare solo quando, dopo la de-duplicazione del ring, restano **meno di tre vertici distinti**. In quel caso `gisSanitizeGeometry` rifiuta la geometria e `gisFeatureAdd` non persiste alcun poligono.

### Vertici distinti e soglia `gisSameCoord`

Il confronto usa la soglia di **`gisSameCoord`**: **1e-7 gradi** su latitudine e longitudine (ordine di grandezza **circa un centimetro** a terra).

Due vertici più vicini di tale soglia sono considerati **coincidenti** e contano come **un solo** vertice dopo la de-duplicazione dei punti consecutivi e della chiusura del ring.

### Conseguenza pratica per la QA

- **Non basta** mettere punti «vicini»: servono vertici che il sanitizer consideri **distinti**.
- A **zoom 14**, un pixel rappresenta indicativamente **circa 9–10 metri**; due tap/click in posizioni anche solo leggermente diverse sono normalmente distanti metri e quindi **vertici distinti** → il poligono può risultare **valido** e il messaggio **non** compare.
- Per innescare il rifiuto serve lo **stesso identico punto**, non un punto semplicemente vicino.
- **Aumentare lo zoom** non rende affidabile il test: per questa procedura ripetere il click sullo **stesso identico pixel/coordinata**.

### Procedura operativa con il mouse

Usare il **mouse** (il dito su touch non è sufficientemente affidabile per sovrapporre due vertici):

1. Avviare un nuovo poligono e cliccare il **primo** punto.
2. **Senza muovere** il mouse, cliccare di nuovo sullo **stesso identico pixel** (secondo vertice sovrapposto).
3. Cliccare un **terzo** punto in un'altra posizione.
4. Eseguire il **doppio clic** previsto dall'app per chiudere il poligono.
5. I due vertici sovrapposti vengono fusi dalla de-duplicazione → restano **meno di tre** vertici distinti.
6. Deve comparire il messaggio rosso **«Geometria non valida»**; il **disegno** resta **aperto** e il **draft** **preservato** (vertici, nome draft se presente, possibilità di correggere e riprovare o Annulla).

### Ambito futuro

Riutilizzare questa procedura per la QA di qualunque blocco futuro che tocchi:

- il **rifiuto** della creazione poligono;
- la **visualizzazione** del messaggio di geometria non valida;
- la **preservazione** o **modifica** del draft dopo il rifiuto.

## Formato eccezionale — checklist estesa

Usare la **checklist estesa** (con caselle e categorie strutturate) **solo** quando serve copertura più ampia, ad esempio:

- OPSEC;
- rete, tile o proxy;
- cache o storage;
- migrazioni dati;
- modifiche architetturali;
- diff multi-area;
- più ambienti o combinazioni indipendenti da attestare;
- blocchi ad alto rischio;
- richiesta esplicita dell'utente.

Anche in questi casi: **una sola** checklist; **una sola** restituzione; controlli pertinenti; **nessun PASS inventato**; fail-closed invariato.

### Nucleo standing (riferimento per checklist estesa)

Le sette categorie sotto valgono come **riferimento** per la checklist estesa, non come obbligo su ogni blocco di routine:

1. **Identificazione** — block ID; runtime SHA; HEAD/deploy; build; URL QA.
2. **Versione servita** — pagina caricata; build corretta; cache-buster runtime corretto.
3. **Funzione primaria** — comportamento principale; output atteso; nessun errore evidente.
4. **Stati positivi e negativi (quando pertinenti)** — opzione attiva/disattiva; fail-closed; cancel/annulla.
5. **Regressioni** — solo regressioni **correlate al blocco**.
6. **Stabilità** — app utilizzabile; mappa e pannelli non bloccati.
7. **Limiti** — sotto-check non eseguiti; condizioni non osservate.

### Template checklist estesa (eccezione)

```
QA OPERATORE ESTESA — <BLOCK-ID>

URL QA:
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=<runtime-short-sha>

VERSIONE
[ ] Build attesa: <build>
[ ] Runtime: <runtime-sha>
[ ] HEAD/deploy: <deploy-sha>
[ ] Pagina caricata con cache-buster runtime corretto

NUCLEO STANDING
[ ] Funzione primaria eseguita
[ ] Output atteso verificato
[ ] Nessun errore evidente
[ ] App ancora utilizzabile dopo il test

CONTROLLO SPECIFICO DEL BLOCCO
[ ] <controllo specifico 1>
[ ] <controllo specifico 2>

REGRESSIONI PERTINENTI
[ ] <regressione correlata 1>

LIMITI / NON ESEGUITO
- <eventuali limiti>

ESITO
[ ] QA <BLOCK-ID> PASS operatore
[ ] QA <BLOCK-ID> FAIL operatore

Punti falliti:
- ...
```

## Formato URL QA

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=<runtime-short-sha>
```

- Usare lo **short SHA del commit runtime reale**.
- **Mai** SHA docs/autosync al posto del runtime.
- **Mai** etichette `*-local` sul VPS.
- L'URL è **già compilato** dal workflow quando il runtime è noto.

## P-VERTEX-MODAL — modifica numerica coordinate vertice — CLOSED / PASS end-to-end

**Runtime autorevole:** `5449cb9` (catena `a4fa8e7` + `5f8f73d` + `5449cb9`) — deploy GIS-only **PASS tecnico**; **CLOSED / PASS end-to-end**.

**Catena runtime:**

| Commit | Ruolo |
|--------|--------|
| `a4fa8e7` | Runtime principale — modal coordinate vertice; pipeline P2 click-vs-drag; **review byte Claude retroattiva = PASS** |
| `5f8f73d` | Fix lista «Lati» — scope `vtxNum`; nessuna nuova review Claude |
| `5449cb9` | FIX2 visibilità pannello — **RAMO A** CSS-only (`:not([open]){ display:none }`); review Claude **non richiesta** |

**Sequenza QA registrata:**

```text
QA FAIL operatore — lista Lati vuota (a4fa8e7)
→ fix 5f8f73d
QA FAIL operatore — controlli header ×/− non affidabili (5f8f73d)
→ fix CSS 5449cb9
→ deploy GIS-only PASS tecnico
→ QA P-VERTEX-MODAL PASS operatore
```

**Attestazione finale (operatore):**

```
QA P-VERTEX-MODAL PASS operatore
```

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=5449cb9
```

**Checklist eseguita (storico):** controlli header `×`/`−`; lista Lati popolata; modal coordinate; drag P2; Salva/Annulla; P3/P3-ADD/P4 invariati; IT/EN; FR non modificato.

## P-VERTEX-FORMAT — selettore formato coordinate vertice — CLOSED / PASS end-to-end

**Runtime autorevole live:** `6ef714a` (catena base `b9db963` + UX2 `6ef714a`) — deploy GIS-only **PASS tecnico** (base + UX2); **CLOSED / PASS end-to-end**.

**Catena runtime:**

| Commit | Ruolo | Blob monolite |
|--------|--------|----------------|
| `b9db963` | Base — selettore formato in `#polygonVertexCoordDialog`; formati dd/signed/ddm/dms/utm/mgrs; `polygonVertexCoordModalCanon`; Salva-only; canonico `[lon, lat]` | `0cae293bb3b91fd3ed549531e477649f4b37a769` |
| `6ef714a` | UX2 — mirror `#polygonPanelVertexCoordFormatSel` in `#polygonPanelUnits`; sync bidirezionale `polygonVertexCoordFormat` | `ed62117316c4e6ad04fc67f1f484c46a3f5aa76b` |

**Deploy registrato:**

| Fase | Runtime VPS | Esito tecnico |
|------|-------------|---------------|
| Base | `b9db963` | GIS-only PASS — HTTP 200, byte/SHA match, CMP_PASS, `goi-gis-app` active/enabled |
| UX2 | `6ef714a` | GIS-only PASS — byte **2352764**, SHA-256 **`7f879905…`**, CMP_PASS, HTTP 200; altri servizi non toccati |

**Attestazioni QA (operatore):**

```text
QA P-VERTEX-FORMAT PASS operatore
QA P-VERTEX-FORMAT-UX2 PASS operatore
```

**URL runtime live:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=6ef714a
```

**Checklist UX2 (storico):** selettore in Unità di misura; sync pannello↔modal; riformattazione con modal aperto senza salvataggio automatico; nessuna mutazione geometria con modal chiuso; Salva/Annulla; Lati/Unità/Stile/drag/Sposta/salvataggio poligono senza regressioni.

**Note:** formato transiente/sessione; nessun nuovo store persistente; **`APP_BUILD_ID` `B5.5Z` invariato** (non bumpato). Review Claude **non richiesta** in chiusura docs (zero delta runtime).

## P-POLYGON-LIST-ENRICHMENT — lista Poligoni arricchita — CLOSED / PASS end-to-end

**Runtime autorevole live:** `28cc2d2` (catena base `0409ad4` + FIX1 `d65410f` + FIX2 `28cc2d2`) — deploy GIS-only **PASS tecnico** su tutte le fasi runtime; **CLOSED / PASS end-to-end** (chiusura docs-only post-FIX2).

**Catena runtime:**

| Commit | Ruolo | Blob monolite |
|--------|--------|----------------|
| `0409ad4` | Base — metadati lista (vertici, area, perimetro, timestamp); azioni Mostra/Centra/Rinomina/Elimina | `70f790e0448b2bed436c790e6f69928722720c3b` |
| `d65410f` | FIX1 — tabella ordinabile; sort transiente; stacking `gisPanelBringToFront` | `701fc3ed063d1faa786918491478f7820acad16c` |
| `28cc2d2` | FIX2 — scroll orizzontale/verticale; unità in cima; lista in fondo | `f3c979170c89b879bae2bd3aa0fc927330a8959c` |

**Review / gate:**

- FIX1: **review byte Claude PASS con osservazioni**
- FIX2: regressione statica/harness su `5449cb9` **PASS**; `git diff --check` OK; `node --check` OK; harness **17/17 PASS**

**Deploy FIX2 registrato (GIS-only, PASS tecnico):**

```text
HEAD VPS = 28cc2d293b72b22ea1018a397c9e3d846b694481
blob = f3c979170c89b879bae2bd3aa0fc927330a8959c
goi-gis-app.service active / enabled
HTTP 200
byte repo = 2365251
byte servito = 2365251
SHA-256 = 58a53e20eed0567dccb5ce0e36212e5ffc137fda919012c45ed839d134eb14da (match)
CMP_PASS = sì
Planet-Clone, Navionics proxy, Docker, n8n, Tailscale/firewall non toccati
```

**Attestazioni QA (operatore):**

```text
QA P-POLYGON-LIST-ENRICHMENT PASS operatore
QA P-POLYGON-LIST-ENRICHMENT-FIX1 PASS operatore
QA P-POLYGON-LIST-ENRICHMENT-FIX2 PASS operatore
```

**URL runtime live:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=28cc2d2
```

**Checklist FIX2 (storico):** scroll tabella H+V; unità di misura e selettore P-VERTEX-FORMAT in cima; lista in fondo; sorting FIX1; stacking FIX1; nome con `title` completo; nessuna regressione evidente su Modifica/salvataggio/export.

**Backlog UX next (non FAIL):** **UX-NEXT-A CLOSED** — vedi sezione dedicata sotto; **UX-NEXT-B** runtime landed (build 4, docs closure separata); **UI-MODAL-PARITY-HELP-QR CLOSED** — vedi sezioni dedicate sotto.

## UI-MODAL-PARITY-HELP-QR — migrazione Help/QR a dialog (build 5) — CLOSED / QA operatore FAIL (storico)

**Runtime:** `dcea02f` — blob `cf23cc9ca4392fc489c8ccf4a7cda11b67f7f673` — **`APP_BUILD_NUM = 5`**.

**Contenuto:** migrazione `#helpOverlay` / `#qrModal` a `<dialog class="app-modal">`; pattern GIS `show()` / non-GIS `showModal()`.

**Deploy GIS-only:** PASS tecnico (runtime VPS `dcea02f`).

**QA operatore:** **FAIL (storico)** — Help GIS tagliata/non floating/senza minimizza; QR da Converti non si apre.

**Superseded by:** **UI-MODAL-PARITY-HELP-QR-FIX1** (build 6).

## UI-MODAL-PARITY-HELP-QR-FIX1 — Help floating + QR ripristinato (build 6) — CLOSED / PASS end-to-end

**Runtime autorevole live:** `e8e8ff1` — blob `6eee6872d47dd8a0ed4e04c34dd990e661ced153` — **`APP_BUILD_NUM = 6`** — display **`B5.5Z · build 6`**.

| Campo | Valore |
|--------|--------|
| Commit | `e8e8ff13030496ccf31e6b4bcb8fc57772a60cac` |
| Subject | `fix(ui): restore GIS help and QR dialog behavior` |
| Review | **GPT sostitutiva PASS** (Claude indisponibile — non review byte Claude ordinaria) |

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = e8e8ff13030496ccf31e6b4bcb8fc57772a60cac
VPS blob = 6eee6872d47dd8a0ed4e04c34dd990e661ced153
HTTP 200
byte repo/servito = 2404202 / 2404202
SHA-256 = 3fe2ac2e39c2a92cc8b282eede1e937036440f7cc4acfb672003eb0290899775 (match)
CMP_PASS = yes
```

**Attestazione QA (operatore):**

```text
QA UI-MODAL-PARITY-HELP-QR-FIX1 PASS operatore
```

**Checklist QA verificata:** Help GIS floating; non tagliata; drag/resize; `−` minimizza; ripristino Help; `×` chiude; scroll body; QR da Converti si apre; QR sopra Converti; fuori GIS dialog nativo; ESC/`×`; footer/about **`B5.5Z · build 6`**; regressioni principali non bloccanti.

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=e8e8ff1
```

**`APP_BUILD_ID` `B5.5Z` invariato.**

## UI-MODAL-PARITY-HELP-QR-FIX2 — QR ridimensionabile (build 7) — CLOSED / PASS end-to-end

**Runtime autorevole live:** `14605e9` — blob `0886b6bb4ab4b2cd13e060b1c6f34eafe6953259` — **`APP_BUILD_NUM = 7`** — display **`B5.5Z · build 7`**.

| Campo | Valore |
|--------|--------|
| Commit | `14605e9d4dcdce738d5759a4c24ecc38dbb7e7e4` |
| Subject | `fix(ui): make QR dialog resizable` |
| Review | **GPT sostitutiva PASS** (Claude non disponibile — non review byte Claude ordinaria) |

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 14605e9d4dcdce738d5759a4c24ecc38dbb7e7e4
VPS blob = 0886b6bb4ab4b2cd13e060b1c6f34eafe6953259
HTTP 200
byte repo/servito = 2407357 / 2407357
SHA-256 = 1447722424f5d8c180b4b89fb2c5dff7fb6d1e9b173d542f5b30484990e832b5 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**Attestazione QA (operatore):**

```text
QA UI-MODAL-PARITY-HELP-QR-FIX2 PASS operatore
```

**Checklist QA verificata:** GIS → Converti → QR si apre; QR sopra Converti; drag header OK; resize angoli OK; SVG/URL/copia/download OK; mappa interattiva; Help non regressa; footer/about **`B5.5Z · build 7`**.

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=14605e9
```

**Backlog operativo (non FAIL):**

1. **CONVERT-SOURCE-PICKER** — waypoint/preferito/punto mappa nel Convertitore
2. **P-POLYGON-LIST-UX-NEXT-B-FIX2** — indicatore Vis. poligoni (pallino verde/grigio)

**`APP_BUILD_ID` `B5.5Z` invariato.**

## P-POLYGON-LIST-UX-NEXT-A — rinomina inline cella Nome + build 2 — CLOSED / PASS end-to-end

**Runtime autorevole live:** `6892890` — deploy GIS-only **PASS tecnico**; **CLOSED / PASS end-to-end** (chiusura docs-only post-deploy+QA).

| Campo | Valore |
|--------|--------|
| Commit | `68928909a91cb2f828b968ce774e7f12e42666a9` |
| Blob monolite | `30358cd3aafa9879d76400e23ce103ff5372b081` |
| Feature | Rinomina inline cella **Nome** tabella Poligoni |
| Path dati | `polygonCommitInlineRename` → **`polygonRenameExecute(id, value)`** |
| Vincoli dati | Nessuna scrittura diretta `properties.name`; nessun `gisFeatureUpdate`/`saveStore` diretto nel path inline |
| `APP_BUILD_NUM` | `2` |
| Display | `B5.5Z · build 2` via `applyAppBuildLabel()` |
| Cleanup build | `#appBuildFooter` / `#appBuildAbout` statici → solo `B5.5Z` |
| `APP_BUILD_DETAIL` | intatto — *Quick geographic JPG export and segmented high-zoom tiles* |

**Review byte Claude:** PASS — GO DEPLOY GIS-only.

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 68928909a91cb2f828b968ce774e7f12e42666a9
VPS blob = 30358cd3aafa9879d76400e23ce103ff5372b081
goi-gis-app.service = active / enabled
HTTP 200
byte repo = 2368796
byte servito = 2368796
SHA-256 = 96f9468ed8ea6d1e39acd8186af0ffbe295747ac684848131ff4da9dfb7c893e (match)
CMP_PASS = sì
Planet-Clone, Navionics proxy, Docker, n8n, Tailscale/firewall non toccati
```

**Attestazione QA (operatore):**

```text
QA P-POLYGON-LIST-UX-NEXT-A PASS operatore
```

**Checklist QA verificata:** Enter conferma; Esc annulla; blur annulla; nome lungo; click input non triggera sort/azioni; rename altre righe disabilitato durante editing; sort durante editing non rompe; footer/about `B5.5Z · build 2`; regressione pannello `−`/`×`/minimize/modal vertice OK.

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=6892890
```

**Nota backlog (non implementare):** `polygonShowRenameBar` non più chiamata dalla lista — possibile dead code cleanup futuro. **`APP_BUILD_ID` `B5.5Z` invariato.**

## APP-BUILD-NUM-B1 — build number monotono runtime — CLOSED / PASS tecnico end-to-end

**Runtime autorevole live:** `bd588a8` — deploy GIS-only **PASS tecnico**; **CLOSED / PASS tecnico end-to-end** (chiusura docs-only post-deploy).

| Campo | Valore |
|--------|--------|
| Commit | `bd588a89a6bf0674351b384c607ab7ef73952ab2` |
| Blob monolite | `afddf87a6f05929b540f768a0193872057fe24cb` |
| `APP_BUILD_NUM` | `1` (costante numerica monotona, non persistita) |
| Display | `B5.5Z · build 1` (title / `#appBuildFooter` / `#appBuildAbout`) |
| `APP_BUILD_DETAIL` | intatto — *Quick geographic JPG export and segmented high-zoom tiles* |

**Review byte Claude:** PASS — GO DEPLOY GIS-only.

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = bd588a89a6bf0674351b384c607ab7ef73952ab2
VPS blob = afddf87a6f05929b540f768a0193872057fe24cb
pull = FF 28cc2d2..bd588a8
goi-gis-app.service = active / enabled
HTTP 200
byte repo = 2365479
byte servito = 2365479
SHA-256 = 23907b809bb47ed52befe36058b6e8a1f01148d40ec54104a71dc019da3b0614 (match)
CMP_PASS = sì
```

**Verifica runtime minima (tecnica, non QA funzionale estesa):**

- `APP_BUILD_NUM = 1` presente nel body servito
- Footer / About = `B5.5Z · build 1`
- `#appBuildAboutDetail` / `APP_BUILD_DETAIL` intatto

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=bd588a8
```

**Nota metodo:** al prossimo blocco runtime, fold cleanup span statici `#appBuildFooter`/`#appBuildAbout` (solo `B5.5Z` o vuoto; `applyAppBuildLabel` unica fonte ` · build N`). **`APP_BUILD_ID` `B5.5Z` invariato.**

## P-STYLE — stile poligoni (schema, export, editor) — CLOSED / PASS end-to-end

**Runtime autorevole:** `0a51379` (catena A+B `95c100d` + D `efca0bf` + C `0a51379`) — deploy GIS-only **PASS tecnico**; **CLOSED / PASS end-to-end**.

**Catena runtime:**

| Commit | Ruolo | Blob (se applicabile) |
|--------|--------|------------------------|
| `95c100d` | P-STYLE-A+B — sanitizer/rendering stile poligoni | `4a8463b1c6d71cde60d7bfe24a48049e6e3121ef` |
| `efca0bf` | P-STYLE-D — export GeoJSON/KML con stile | `ac8a7c30d3530ab3e92bd80e81a811449e935788` |
| `0a51379` | P-STYLE-C — UI editor stile working-copy | `8d13e41a36fe7cc0605dc8f315eff551725340ed` |

**Review / gate:**

- A+B e D: **review byte Claude PASS**
- C: **gate orchestratore PASS** — solo UI/working-copy; nessun sanitizer/export/import/create-path/`saveStore` diretto; nessun nuovo campo persistito; FR congelato; **review Claude NON RICHIESTA**

**Deploy P-STYLE-E (GIS-only, PASS tecnico):**

```text
HEAD VPS: 0a51379
byte: 2340941 = 2340941
SHA-256: a822533215ebe5c48ea33ee4fe0fc9397c2f1d237de8a92a87535299a93fc937
CMP_PASS
HTTP 200
goi-gis-app.service active/enabled
Planet-Clone / Navionics proxy / Docker / n8n / Tailscale firewall: non toccati
```

**Attestazione finale (operatore):**

```
QA P-STYLE PASS operatore
```

**Nota storica:** al blocco README bootloader (`c409819`) P-STYLE era correttamente **pending** (deploy PASS tecnico, QA operatore pending); chiusura end-to-end registrata in commit docs successivo dopo questa attestazione.

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=0a51379
```

## POLY-PARITY-P5-B2-F — pulizia errore stale draft — CLOSED / PASS end-to-end

**Runtime commit:** `739bf49` — già incluso nel monolite live **`8d13e41a36fe7cc0605dc8f315eff551725340ed`**.

**Fix:** `polygonHideDrawErr()` dopo push vertice valido (handler polygon draw) e dopo `.pop()` riuscita in `polygonRemoveLastDraftPoint()`.

**Deploy:** già coperto indirettamente da deploy P-STYLE-E — VPS runtime **`0a51379`**; **nessun nuovo deploy** in blocco docs-only chiusura. Nota storica «Deploy VPS NON ESEGUITO» in OM era **stale**.

**Review Claude:** **NON RICHIESTA** (zero delta runtime in questo blocco).

**Attestazione finale (operatore):**

```
QA POLY-PARITY-P5-B2-F PASS operatore
```

**P5-B2-G (covered):** ramo `verts.length < 3` → `polygonCancelDraw()` preesistente; irraggiungibile da UI ordinaria.

**P5 complessivo:** **CLOSED / PASS end-to-end** (B1…B2-G covered).

**Backlog separato (NON landed, non bloccante):** micro-fix multi-touch P2 — `if (mapPolyEditDocDrag || mapPolyMoveDocDrag) return`; futuro blocco runtime Ramo B.

**URL runtime (monolite live su VPS):**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=0a51379
```

## Istruzioni per il workflow `finito`

Quando la QA operatore resta **pending**, `finito` (o il report post-deploy) deve:

- riportare prima i **risultati tecnici già verificati** (PASS tecnico);
- emettere per **default** la **QA minima narrativa** (non una checklist lunga con caselle) per blocchi di routine;
- usare la frase **«Ora serve solo la QA operatore minima, senza Cursor»** (o equivalente);
- inserire il **runtime short SHA reale** nell'URL QA;
- includere **solo** passaggi ed esiti specifici e regressioni pertinenti al blocco;
- chiedere come risposta: `QA <BLOCK-ID> PASS operatore` oppure errore esatto e punto di occorrenza;
- emettere tutto in **un unico fenced code block**;
- **non** dichiarare PASS operatore prima dell'attestazione dell'operatore;
- usare la **checklist estesa** solo nei casi delicati/complessi definiti sopra.
