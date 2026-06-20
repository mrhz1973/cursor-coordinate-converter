# GIS Tool — OPERATING_MEMORY

> Gli agenti devono leggere questo file prima di modificare il GIS Tool.  
> Read-set operativo: `README.md` (bootloader) → `docs/OPERATING_MEMORY.md` (§7 stato vivo) → `docs/work-units/WU-0005-0009-roadmap.md` (piano/backlog).  
> Questo file riguarda il **GIS monolite**, non il control-plane e non Planet-Clone.

---

## 1. Identità progetto

- **Repo:** `mrhz1973/cursor-coordinate-converter`
- **File operativo:** `coordinate_converter Claude.html`
- **Tipo:** app GIS tattica leggera, offline-first, OPSEC-aware

---

## 2. Vincoli architetturali

- Singolo file HTML standalone
- HTML / CSS / JS nello stesso file
- Vanilla JS
- No framework
- No TypeScript
- No npm
- No bundler
- No ES modules
- No split operativo
- Nessuna dipendenza runtime esterna salvo tile/geocoding opt-in o cache offline

---

## 3. Read-set operativo

**Read-set corrente (wiki-LLM lean):** gli agenti devono leggere, in ordine:

1. `README.md` — bootloader e regole di lettura; **non** stato operativo vivo.
2. `docs/OPERATING_MEMORY.md` — stato operativo vivo, soprattutto **§7**.
3. `docs/work-units/WU-0005-0009-roadmap.md` — piano, backlog e workstream WU-0005→0009.

**Precedenza:** se README, OPERATING_MEMORY e roadmap confliggono, segnalare il conflitto e usare il documento più specifico e più recente.

**Legacy (non memoria corrente):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/orchestrator/latest.md`, `docs/orchestrator/chatgpt-checkpoint.md` e WU chiuse (WU-0001→0004 salvo richiamo esplicito dalla roadmap viva) — consultabili per audit, **non** come current-state primario. Il **`finito`** può continuare ad appendere checkpoint/session come storico/audit. In conflitto con OM §7 o roadmap → segnalare e dare precedenza ai documenti vivi; **non** riscrivere log storici già pushati salvo richiesta esplicita.

**Verifica remoto / cache RAW:** dopo un push, `raw.githubusercontent.com` può servire contenuto cache per alcuni minuti. Per verifiche immediate usare `git fetch && git log origin/main`, oppure URL RAW con query cache-bust, oppure attendere propagazione. Non considerare una singola lettura RAW immediata come prova negativa definitiva se `git log origin/main` mostra il commit atteso.

---

## 4. Protocollo orchestratore minimo

- ChatGPT e Cursor usano lo stesso read-set target: README (bootloader) → OPERATING_MEMORY §7 → WU-0005-0009-roadmap.
- Prompt Cursor: istruzioni esterne fuori dal prompt; blocco operativo pulito dentro il prompt.
- Procedere per blocchi piccoli.
- Non toccare aree non correlate.
- Non usare `finito` salvo richiesta esplicita del workflow.
- Nessun GPS silenzioso.
- Nessun live tracking GPS senza decisione esplicita.
- Modifiche runtime: commit separati — codice / docs operative / autosync.
- Blocchi docs-only: non toccare il monolite.
- **Session / repo guard:** prima di patch non read-only, verificare repo root, branch e `git status --short`; se workspace atteso pulito risulta sporco all’avvio o repo/cartella non coerenti, fermarsi e riportare lo stato. Cursor non decide autonomamente se procedere; la decisione spetta alla review.
- **Remote hash / PASS tecnico:** dopo push, il PASS remoto richiede output verbatim coerente di `HEAD`, tracking locale `origin/main` e `git ls-remote origin main`; l’autorità finale è `git ls-remote`, mentre RAW GitHub è secondario/best-effort e può essere stale. Se `origin/main` locale diverge da `ls-remote`, non è PASS. Se gli output mancano o sono ambigui, prima prompt Cursor verify-only; shell manuale utente solo fallback finale. Distinto da PASS operatore / QA runtime.
- **QA evidence / PASS operatore:** il PASS operatore è distinto dal PASS tecnico remoto e richiede attestazione esplicita nel flusso da utente/operatore o orchestratore. Cursor non può inferirlo da PASS tecnico, diff pulito o `node --check`. In assenza di attestazione, default fail-closed: QA operatore non eseguita/non attestata. Se la QA è attestata, RIEPILOGO e docs devono registrarne provenienza, esiti concreti, ambiente essenziale e limiti.
- **LAST_CURSOR_REPORT (Fase F3):** da Fase F3 `docs/runtime/LAST_CURSOR_REPORT.md` è **obbligatorio** post-push per task reale GIS-only; non per read-only/plan/review diff senza commit; evidenza rolling post-push, non fonte viva primaria — OM §7 e roadmap restano primari; mapping: commit principale = task, autosync = report, nessun terzo commit/finalize-hash.

### Pipeline prompt Cursor (revisione incrociata a passi fissi)

Per ogni blocco operativo, il prompt Cursor passa UNA volta per questa
catena, a passi fissi, NON iterativa:

1. GPT redige il prompt Cursor (bozza).
2. Claude critica → produce prompt di correzione.
3. GPT critica → ripropone il prompt.
4. Claude revisione finale → critica + proposta definitiva.
5. GPT consegna il prompt a Cursor.

**Regole:**

- Catena CHIUSA a questi 5 passi: due passaggi Claude, due GPT, poi
  Cursor. Nessun giro extra di andata-e-ritorno.
- Il prompt che arriva a Cursor contiene TUTTO ciò che deve fare nel
  blocco. Cursor esegue in un colpo solo: niente esecuzioni a tentativi,
  salvo errore bloccante da riportare.
- Critica = sostanza: scope, fetch, consenso, OPSEC, regressioni,
  storage/cache, container UI, stato repo e rischi di diff; non stile.
- L'operatore arbitra solo se Claude e GPT restano in disaccordo dopo
  il passo 4.

**Chiusura blocco (dopo l'esecuzione Cursor):**

- Verifica esito: diff, controlli automatici pertinenti e gate OPSEC
  mirato se il blocco tocca rete, tile, proxy, cache, storage o fetch.
- Commit e autosync chiusi nello stesso intervento operativo, ma con
  commit separati e selettivi:
  - commit codice/runtime se il monolite o altri file operativi sono
    stati modificati;
  - commit docs operative se OPERATING_MEMORY §7 o roadmap cambiano stato/piano;
  - commit README **solo** se cambia read-set/boot procedure (non a ogni blocco runtime);
  - commit autosync memoria orchestratore per latest.md + inbox/.
- Aggiornare OPERATING_MEMORY §7 quando cambia lo stato operativo; roadmap quando cambia piano/backlog; README solo se cambia boot/read-set.
- Nessun blocco operativo è chiuso finché non risulta pubblicato
  l'autosync orchestratore pertinente.
- "Pubblicato" significa pushato su `origin` e verificato sul remoto,
  non solo committato in locale.
- Verifica del push: `git log origin/main` dopo `git fetch`, oppure
  lettura del file su GitHub a prova di cache. Una sola lettura raw
  immediata non è prova: il CDN può servire contenuto cachato per
  alcuni minuti.

### Sequenza blocco runtime GIS

1. implementazione in Cursor;
2. QA pre-commit a schermo sul file locale (`coordinate_converter Claude.html`), opzionale;
3. `finito` in Cursor → commit selettivo + push `origin`;
4. **deploy VPS** necessario per QA/uso su tailnet — **modalità deploy:**
   - eseguito da **Cursor via SSH**, alias `ionos-n8n`, in **un unico prompt** (non far digitare comandi manuali all'operatore per deploy ordinario);
   - il prompt deploy deve coprire: `git pull origin main`; `systemctl restart goi-gis-app`; smoke HTTP (status, Content-Length, build label);
   - clone GIS VPS: `/root/local-files/handoff-runtime/cursor-coordinate-converter`;
   - **GIS-only** per blocchi GIS-only; Planet-Clone/proxy **solo** se cambia il proxy;
   - riferimento: [`docs/runtime/VPS_DEPLOY_RUNTIME.md`](runtime/VPS_DEPLOY_RUNTIME.md);
5. **QA operatore** sull'app deployata — **condotta QA:**
   - visiva, nel browser; include: caricare l'app; guardare layout/overlay; scaricare/aprire il JPG; cliccare i dialog; provare finestra stretta;
   - la esegue l'**operatore**; Cursor **non** sostituisce la QA visiva (non apre l'app per attestare, non carica tile come operatore, non scarica immagini al posto del giudizio operatore); l'advisor AI non raggiunge il VPS e non inventa esiti — instradare la QA operatore su Cursor è errore noto;
   - l'orchestratore fornisce checklist numerata; su richiesta guida passo-passo, una voce alla volta, operatore risponde PASS/FAIL;
   - tailnet `:8000`; cache-buster con hash runtime reale: `?v=<hash runtime>`; **non** usare etichette `*-local` per QA su VPS;
   - attestazione onesta: PASS copre solo ciò che l'operatore ha guardato; sotto-check non eseguiti = limite dichiarato; esito mai inventato da AI;
6. **registrazione in OM §7:** hash runtime, HEAD deploy, smoke, link QA, esito PASS/FAIL operatore — **verifica pubblicazione / published = verified:**
   - dopo ogni `finito`/push e dopo ogni deploy, la chiusura **non** basa solo su self-report Cursor; Cursor dichiara, la prova è su **origin**, indipendente;
   - autorità: `git ls-remote origin main` (arbitro del ref); lettura SHA-pinned / raw vincolato al commit (non `main` mutevole); per docs delicati, confronto blob SHA del file vs commit precedente per provare byte-identità delle parti non-target (es. mega-bullet §7, B5.5A);
   - post-deploy VPS: byte-match Content-Length servito su `:8000` vs `wc -c` del file allo stesso commit su origin — conferma che il VPS serve quel commit, non clone stale;
   - motivo: in sessione Cursor ha riportato hash/repo errati; ref/blob/byte su origin è l'arbitro.

**Nota chiave:** push su GitHub ≠ app aggiornata. `:8000` mostra solo ciò che il clone VPS ha pullato.

### Ruolo Claude (consigliere) — limiti

- Claude NON scrive prompt per Cursor. Mai. Nemmeno comandi git, nemmeno "una riga".
- Claude lavora solo a monte (imposta i task per GPT) e a valle (legge gli esiti su origin e dà verdetti/critiche).
- I prompt per Cursor li scrive sempre GPT.
- Se Claude sta per produrre testo destinato a Cursor, deve fermarsi e passare la sostanza a GPT, non il prompt.

### Comandi all'operatore — uno alla volta

- I comandi che l'operatore esegue a mano — PowerShell, git, shell, terminale — vanno dati **uno alla volta**: un singolo comando, si attende l'output, poi il successivo.
- Non dare mai blocchi di più comandi in sequenza da copiare insieme quando l'esecuzione è manuale.
- Motivo: l'operatore li esegue manualmente; sequenze multiple causano errori pratici, per esempio copia parziale, cartella sbagliata o comando saltato.
- Prima di comandi git/percorso, indicare sempre la cartella corretta:
  `C:\Users\mrhz\Documents\AI\GitHub\cursor-coordinate-converter`
- **Eccezione:** i prompt per Cursor Agent restano **completi**. Cursor esegue il blocco intero; non spezzettare i prompt-task di Cursor.
- La regola “uno alla volta” vale solo per i comandi eseguiti a mano dall'operatore, non per i prompt-task destinati a Cursor.

### Formato prompt Cursor e blocchi sostanza — copiabili in un colpo solo

Quando ChatGPT prepara un prompt destinato a Cursor, il prompt deve essere un unico blocco contiguo, dentro un fence di codice, con delimitatori espliciti:

````text
=== INIZIO PROMPT CURSOR ===
...
=== FINE PROMPT CURSOR ===
````

Tutto ciò che Cursor deve eseguire deve stare dentro il blocco delimitato. Niente che l'operatore non deve incollare in Cursor deve stare dentro il blocco.

Le meta-istruzioni per l'operatore devono restare fuori dal blocco, sopra o sotto. Esempi:
- modalità Cursor consigliata;
- AI consigliata;
- documenti da allegare;
- cosa riportare dopo l'esecuzione;
- note operative rivolte all'utente.

L'operatore deve poter selezionare l'intero blocco e incollarlo in Cursor senza tagliare parti utili e senza includere testo estraneo.

Lo stesso formato vale per la "sostanza" che Claude passa a GPT: blocco unico, delimitato, copiabile, senza testo estraneo dentro il blocco.

---

## 5. Modalità Cursor consigliata

- Default per blocchi docs/governance: **Agent + Auto**.
- Per blocchi runtime, architettura, OPSEC, storage, offline/cache, import/export o modifiche multi-area, la modalità viene fissata dal prompt approvato volta per volta.
- **GPT-5.5** è escalation: usarlo solo se Auto si incarta, propone scope troppo largo o il rischio è alto.

---

## 6. Alias scoped memoria GIS

- Sul repo **GIS**, **`aggio`** e **`aggio gis`** sono **equivalenti**: entrambi aggiornano la memoria operativa del repo GIS.
- Sul **control-plane** si usa **`aggio control`**.
- **Trade-off:** `aggio` secco non identifica il repo; l’operatore deve lanciarlo nel contesto/chat corretto.
- **`aggio` scoped GIS-only:** in questo repo `aggio`/`aggio gis` non significano «tutti i repo» (semantica dev-method storica); coerente con control-plane scoped `aggio control`.
- Read-set: `README.md` → `docs/OPERATING_MEMORY.md` §7 → `docs/work-units/WU-0005-0009-roadmap.md`.

**Flusso `aggio` / `aggio gis` (attivo da Fase 3):** legge/aggiorna, quando necessario:

- `README.md` solo se cambia read-set, boot procedure o regole di precedenza;
- `docs/OPERATING_MEMORY.md` §7 quando cambia lo stato operativo;
- `docs/work-units/WU-0005-0009-roadmap.md` quando cambia piano/backlog/workstream;
- eventuale autosync/inbox se il workflow lo richiede.

**Non** puntare a `docs/orchestrator/chatgpt-checkpoint.md` come fonte primaria.

---

## 7. Stato corrente

1. **PASS** — OPSEC strict cycle chiuso. Dettaglio: [`docs/work-units/WU-0001-opsec-strict-cycle.md`](work-units/WU-0001-opsec-strict-cycle.md)
2. **PASS** — Standardizzazione memoria wiki-LLM completata (Fasi 1–5). Dettaglio: [`docs/work-units/WU-0002-memory-standardization.md`](work-units/WU-0002-memory-standardization.md)
3. **CLOSED** — SonarChart overlay nel monolite. Dettaglio: [`docs/work-units/WU-0003-sonarchart-overlay.md`](work-units/WU-0003-sonarchart-overlay.md)
4. **CLOSED** — Basemap / SonarChart indipendenti. Dettaglio: [`docs/work-units/WU-0004-navionics-basemap-sonarchart-independence.md`](work-units/WU-0004-navionics-basemap-sonarchart-independence.md). B1 PASS (`0cd3c8c`); B2 rimosso per decisione (`5201ff8`); B3 decaduto con B2. Piano/backlog attivo: [`docs/work-units/WU-0005-0009-roadmap.md`](work-units/WU-0005-0009-roadmap.md).

**Backlog GIS-monolite ammesso (non infrastruttura control-plane):**

- UX GIS / mappe offline / import-export / waypoint / tracce / poligoni
- OPSEC, cache/tile/geocoding lato app

**Backlog esplicito (prossimi candidati, non WU aperte):**

- **Default operativo runtime-first:** per i prossimi blocchi, implementare direttamente nel monolite `coordinate_converter Claude.html` e saltare i blocchi docs-only, salvo lavori davvero delicati. Restano giustificati blocchi docs/governance minimi per OPSEC, rete/tile/proxy, cache/storage, migrazioni dati o cambi architetturali. Obiettivo pratico: ridurre overhead documentale e procedere per patch runtime piccole, testate a schermo, poi commit/push.
- Piano dettagliato WU-0005→0009: vedi docs/work-units/WU-0005-0009-roadmap.md.
- **Poligoni:** fix base PASS (`72a194e`) + UX leggera PASS (`f7260d9`) — auto-arm draw mode all’apertura pannello, cancellazione con `✕` in lista, pannello minimizzato durante il disegno e ripristino dopo finish/cancel. Restano backlog pesanti/separati: editing vertici, drag del poligono intero, standardizzazione modal trasversale. Dettaglio: `docs/work-units/WU-0005-0009-roadmap.md`.
- **UX toolbar laterale:** WU-0007 PASS — B1/B2 pulsanti più piccoli + Layers allineato (`e4c2be3`), B3 GPS label + colore qualità PASS (`c051ee1`), B4 distanza → righello PASS (`54d8586`), B5 waypoint/posiziona/torna in gruppo espandibile PASS (`7a02a7e`), B6 poligoni dentro Tracce (`e8395e9`), B7 MGRS dentro Layers PASS (`74d3f32`), B8 Range & Bearing dentro Tracce (`fa12567`). Restano fuori da WU-0007 eventuali standardizzazioni modal trasversali o refactor futuri non ancora pianificati.
- **Layers UI grouped by map type:** PASS runtime (`a656541`) — menu Layers in tre sezioni (Topografica / Satellitare / Nautica), provider labels attive, selezione layer OK; test operatore senza regressioni su basemap, Navionics/SonarChart, MGRS e strumenti GIS. README bootloader già allineato (`b0a3de0`); nessun sync roadmap/README richiesto per questo blocco.
- **Basemap XYZ aperti:** WU-0008 PASS runtime (`cf6d796`) — aggiunto OSM HOT, normalizzato CARTO Voyager (`maxZoom: 20`, label), OpenTopoMap già presente mantenuto senza duplicazione; fix `resolveCatalogLayerId` per attivazione `osmHot`. I layer restano governati dai gate tile/rete esistenti (`tileFetchAllowed(layerId)`, `state.forceOffline`, `state.opsecStrict`) e dal flusso cache/export esistente. WU-0009 Google/Bing proxy resta filone separato e sensibile.
- **Motore tile tileScheme (WU-0008 8c-A):** PASS runtime (`cddc565`) — helper `normalizeTileScheme` / `formatTilePath` / `buildTileUrl`; layer `sat` su `urlBase` + `tileScheme: "zyx"`; fetch centralizzati; `makeTileKey` invariato.
- **Esri basemap catalogo (WU-0008 8c-B):** PASS runtime (`043b769`) — aggiunti `esriTopo`, `esriStreet`, `esriHillshade`, `esriRelief`, `esriOceanBase` via `urlBase` + `tileScheme: "zyx"`, `cacheable: false` (online-only); menu Layers Topografica/Nautica + i18n IT/EN/FR; `sat`/Navionics/SonarChart/seamarks invariati; endpoint verificati HTTP 200; `node --check` OK. Ocean Reference escluso. Browser QA operatore: da confermare se non già fatto.
- **Browse-cache guard `cacheable:false` (WU-0008 8d-B0):** PASS runtime (`23db6b4`) — `parseTileKeyLayerId` + guard fail-open in `cacheTileFromDisplay`: layer con `cacheable === false` (osmStandard, Esri 8c-B, futuri online-only) non persistono più in IndexedDB durante pan/zoom; layerId dalla `tkey` tile, non `state.mapLayer`; precache/export guard invariati; `node --check` OK. Browser QA IndexedDB before/after: PASS operatore (esriTopo/osmStandard 0→0, osmHot 0→96). Prerequisito per 8d-B (EOX).
- **Offline UX / cache per-layer / maxZoom (WU-0008 8d-B1):** **8d-B1-A PASS** (diagnosi) + **8d-B1-A-docs PASS** (roadmap). **8d-B1-B1 PASS** (`29ebf3a`) — badge «no offline», `OFFLINE_LAYER_IDS` catalogo-driven, pannello neutro, contatore cache nascosto su online-only, layer attivo verde. **8d-B1-B2 PASS** (`a0da9d1`) — stats IndexedDB reali tile/MB per-layer in `#pcLayerCacheStat`; scan O(n) on-demand. **8d-B1-B3 PASS** runtime (`finito` 2026-06-15) — `clampBasemapFitZoom` su `flyMapToTrackPoints` (×2) e `flyMiniMapToOfflineNamedAreaById`; maxZoom da `TILE_LAYERS[sanitizeMapLayer(state.mapLayer)]`; debito fit-area z18 **risolto**; `node --check` OK.
- **WU-0008 8d-B EOX:** **PASS** runtime (`2ca47b6`) + **Browser QA operatore PASS** — `eoxS2Cloudless` online-only (`cacheable:false`, `maxZoom:18`); gate fetch fail-closed allowlist; QA: localhost/tailnet `100.110.35.23` visibile+carica; `192.168.1.108` nascosto e no fetch se forzato; forced-offline/OPSEC strict/no offline bulk OK. Dettaglio: [`docs/work-units/WU-0005-0009-roadmap.md`](work-units/WU-0005-0009-roadmap.md) §8d-B.
- **Backlog metodo / adozione metodo (post-catena 8d):** catena **PASS** fino a **Fase F3** — Blocco 0/B + Fasi C–E + **F1** (spec + template), **F2** (collaudo report vivo), **F3** (obbligo `LAST_CURSOR_REPORT` GIS-only). Non WU tecnica runtime; dettaglio hash e cronologia: roadmap §Backlog metodo. `LAST_CURSOR_REPORT` obbligatorio post-push per task reale GIS-only; **non** per read-only, plan, review diff senza commit o micro-fix docs-only dove esplicitamente escluso — evidenza rolling post-push, **non** fonte viva primaria; **OM §7 e roadmap restano primari** (cfr. §4).
- **Governance online/offline:** WU-0005 B0/B1 documentata — regola: GIS online di default; `state.forceOffline` è interruttore volontario dell’operatore; `state.opsecStrict` resta gate superiore per chiamate di rete sensibili. Mappati i gate esistenti nel monolite: `isEffectivelyOnline()`, `tileFetchAllowed(layerId)`, `internetApiFetchAllowed()`, consenso proxy/Navionics-like (`ensureNavProxyConsent()`, `_navProxyConsentGranted`), geocoding (`geocodingAllowed()`, Nominatim/`reverseGeocode`), tile/layer fetch (`hydrateMapTiles`, `fetchAndStoreTile`), cache/offline maps, seamarks/SonarChart, tracking rete (`recordNetEvent`, `_netEvents`). Eventuali ambiguità UI/copy vanno trattate in micro-patch B2 separata.
- **Mappe offline UX (backlog):** micro-fix «Scarica selezionate» su aree COMPLETATA + copy IndexedDB vs file PC (`345d712`). Revisione UX futura: etichette cache vs export JPG, azione export da riga area, feedback fine job — candidato non-WU.
- **WU-0009B Google Satellite (`gsat`):** **PASS end-to-end** + **Browser QA operatore PASS (OPSEC strict, 2026-06-16)** — backend Planet-Clone `a7359e7` (`/gsat/`), frontend GIS `013b8cb`, deploy VPS verificato (`/status` OK, tile `200 image/jpeg`); browser operatore via Tailscale su GIS `100.114.7.53:8000` + proxy `:5000`; TEST 1–8 PASS (consenso Google ≠ Navionics/SonarChart; Annulla fail-closed; tile visibili post-consenso; placeholder su area non-cache senza consenso). Runtime: [`docs/runtime/VPS_DEPLOY_RUNTIME.md`](runtime/VPS_DEPLOY_RUNTIME.md). **Backlog WU-0009B residuo:** altre varianti Google, polish UI (B5), reboot-test VPS formale.
- **Nota anti-reflow §7 (mega-bullet WU-0009B):** il bullet combinato sotto (WU-0009B B4 → B5.1/B5.2/B5.3/B5.4/B5.4a-d → B6.1) va editato **solo** per clausola puntuale (es. cambio stato QA di una sotto-voce); **mai** riscrivere, rifloware o riformattare l'intero bullet; voci nuove, blocchi e backlog = bullet **separati** fuori dal mega-bullet; dopo edit §7, verificare blob parti non-target invariato (cfr. §4 passo 6 *published = verified*).
- **WU-0009B B4 Bing Satellite (`bsat`) — catena B4 PASS end-to-end (2026-06-17):** **B4.1A/B4.1A-VPS** smoke strategia C PASS; **B4.1B–B4.1C** proxy Planet-Clone **`1e8944d`** route `/bsat/` deploy VPS PASS; **B4.2 frontend GIS** runtime **`8d4deab`** — layer `bsat` (catalogo, gate OPSEC consenso `bing`, UI Layers, offline-eligible); **PASS tecnico statico**; deploy frontend GIS VPS **`fe6b289`** verificato; **B4.4 Browser QA OPSEC strict PASS operatore** (7/7 step); **B4.3A annullato** — `#setOpsecStrict` già presente (Guida → Geocoding → Impostazioni geocoding). **B5.1 polish UX (2026-06-17):** label `set.opsec.strict` ampliata (non solo geocoding); help-line `set.opsec.strictHelp` sotto toggle; **nessun secondo toggle**; gate/listener OPSEC invariati; hint Layers Satellitare **differito** (menu basemap ricostruito via `basemapLayersHtml`/`tlayerBasemapBtn` — rischio wipe se iniettato nel rebuild). **B5.1 Browser QA visuale:** PASS operatore. **B5.2 mobile viewport containment (2026-06-18):** PASS tecnico — meta `viewport-fit=cover`; CSS mobile-only `@media (max-width:768px)` toolbar scroll, header wrap, modal/drawer max-size, dialog OPSEC Conferma/Annulla sticky; nessuna logica GIS/OPSEC modificata. **B5.3 legenda scala multi-unità (2026-06-18):** PASS tecnico — `buildScaleBar` metrica (toggle m/km, poi rimosso in B5.3a); mi secondario, Nm, ratio 1:N. **B5.3a (2026-06-19):** PASS tecnico — toggle m/km rimosso; barre graduate 10 tacche CSS; **superata da B5.3b** per layout label. **B5.3b (2026-06-19):** PASS tecnico — fix overlap label centrale metrica vs caption `km · mi` (mid-label in flow + spacing box scala); runtime **`ad7d977`**. **QA visuale bundlata B5.1+B5.2+B5.3b (2026-06-19):** **PASS operatore** — attestazione **operatore** post-deploy VPS **`fec53ca`** (smoke HTTP `Content-Length: 2107749`; URL tailnet `:8000/coordinate_converter%20Claude.html?v=fec53ca`); copre B5.1 OPSEC label/help, B5.2 mobile viewport, B5.3b scala finale; **non** attestata da AI. **Backlog UX residuo:** hint statico Layers (B5.x). **B5.4 export JPEG scala opzionale (2026-06-19):** PASS tecnico — checkbox «Includi scala» nel dialog export JPG; scala disegnata su canvas 2D (`drawJpgExportScale`, riuso `computeMapScaleModel`); nessun `foreignObject`/raster HTML `.tile-scale`; export senza scala invariato (default off). **B5.4a (2026-06-19):** PASS tecnico — box scala JPG bianco pieno/opaco (`#ffffff`), testo/bordi ad alto contrasto; nessun cambio calcoli/export base. **B5.4b (2026-06-19):** PASS tecnico — fix layout canvas `drawJpgExportScale` (`textBaseline: top`, boxH/gap/font/barH aumentati; degradazione Nm se canvas troppo basso); box bianco opaco preservato; calcoli/export base invariati. **B5.4c (2026-06-19):** PASS tecnico — ratio 1:N sempre renderizzata e leggibile nel JPG export (riga dedicata, `gapBeforeRatio`, font 700 ≥11px, Nm omessa prima della ratio se spazio insufficiente); box bianco opaco preservato. **B5.4d (2026-06-19):** PASS tecnico — layout export a due colonne: ratio 1:N a sinistra (centrata verticalmente), tabella km·mi/barre/Nm a destra; box bianco opaco preservato; **QA operatore PASS (2026-06-20) — output JPG scaricato:** app VPS/tailnet `:8000`, runtime **`97406ab`** (build **B6.6B**), deploy **`63084dd`**, QA `:8000/coordinate_converter%20Claude.html?v=97406ab&force=b66b`; nel file JPG scaricato scala/legenda nel posto corretto, layout export valido; **PASS limitato al JPG verificato** (non copre scala in-app né export avanzato). **B6.1 fix Range Rings creazione manuale (2026-06-19):** PASS tecnico — `#rrCreateBtn` non resta nascosto quando centro risolvibile; primary unico; default `NM` + distanze `1, 5, 10` su reset; nessun rewrite parser/overlay; **QA operatore N/A — SUPERATO da B6.2** (B6.2 ha rimosso «Crea anelli», flusso che B6.1 correggeva).
- **Range Rings B6.2 pick-first UX (2026-06-19):** PASS tecnico — runtime **`d38c253`**; `#rrCreateBtn`/`Crea anelli` rimosso; **`Punta e crea`** unico primary; pannello minimizzato al pick (`gisMinimizePanel`/dock); default **`NM`** + distanze **`1, 5, 10`**; preset chips unit-aware.
- **Range Rings B6.3/B6.3a stili e label (2026-06-19):** PASS tecnico — runtime B6.3 **`d69cacd`**, B6.3a **`22f19f1`**; colore/spessore/tipo linea cerchi; colore label distanza; sfondo/badge label; label a bearing offset dalle guide radiali legacy.
- **Range Rings B6.3b/B6.3c edit UX (2026-06-19):** PASS tecnico — runtime B6.3b **`50b0a86`**, B6.3c **`20d2141`**; B6.3b edit style parity (load/save tutti gli stili in modifica); B6.3c click **`Modifica`** centra/fit mappa sul set selezionato.
- **Range Rings B6.4 radial/bearing spokes (2026-06-19):** PASS tecnico — runtime **`d0a4a0a`**; deploy VPS byte-match **`2f7ee52`**; toggle linee radiali; count **`{2,3,4,8,16}`** (default **`3`** = bearing legacy **`0/90/270`**); colore/spessore/tipo linea radiale; spokes centro→raggio max (non più guide ripetute per ogni anello); `sanitizeRangeRingSet` retrocompat (**set vecchi → `spokesEnabled=true`**, count default **`3`**); **QA operatore non più pending — COPERTA da regressione B6.6B (2026-06-20):** durante QA B6.6B operatore ha attestato spokes/radiali B6.4 invariati PASS; in uso da più deploy successivi.
- **Range Rings B6.4a-2 panel full-height (2026-06-20):** PASS tecnico + **PASS operatore post-deploy VPS** — runtime **`656dd13`**; HEAD/deploy **`7dd1a41`**; deploy GIS-only; smoke **`200`**, Content-Length **`2142705`**; build label **`B6.4a-2`**; QA tailnet `:8000/coordinate_converter%20Claude.html?v=656dd13`; **`node --check`** OK. **Attestazione operatore:** «tutto perfetto» (2026-06-20).
- **Range Rings B6.5 center drag (2026-06-20):** runtime **`f943675`**; deploy VPS **`2cfd553`**; handle `g.rr-center-handle` + controller `mapRrCenterDocDrag`; live redraw; click-to-place invariato. **Browser QA operatore: FAIL** — handle centro non visibile/afferrabile (overlay rings z-index 2 sotto pin `tile-marker` z-index 8; dot r=6 col colore set poco contrastato). → **B6.5B-1**.
- **Range Rings B6.5B-1 center handle visibility (2026-06-20):** PASS tecnico + **PASS operatore post-deploy VPS** — runtime **`3963c76`**; HEAD/deploy **`e694c0f`**; deploy GIS-only (Planet-Clone/proxy **non toccato**); smoke **`200`**, Content-Length **`2151292`**; build label **`B6.5B-1`** servita; QA tailnet `:8000/coordinate_converter%20Claude.html?v=3963c76`; fix z-index confinato `.range-rings-overlay.rr-move-center-active{z-index:12}` + handle **target/crosshair** alto contrasto; handle visibile/afferrabile in Modifica → «Sposta centro sulla mappa»; drag live cerchi/spokes/label; click-to-place e pan fuori handle OK; stili B6.3 e spokes B6.4 non regressi; pannello full-height B6.4a-2 OK; tile tailnet OK. **Nota UX accettata:** drag attivo solo dopo «Sposta centro sulla mappa» (non always-on sul pin centrale). **`node --check`** OK.
- **Range Rings B6.6B edit-mode center handle affordance (2026-06-20):** PASS tecnico + **PASS operatore post-deploy VPS** — runtime **`97406ab`**; HEAD/deploy **`63084dd`**; deploy GIS-only (Planet-Clone/proxy **non toccato**); smoke **`200`**, Content-Length **`2152189`**; build label **`B6.6B`** servita; QA tailnet `:8000/coordinate_converter%20Claude.html?v=97406ab` (cache browser risolta con `&force=b66b`); handle subito visibile in Modifica (`_rrEditingSetId`); centro invariato all'ingresso; drag live cerchi/spokes/label; tap mappa in Modifica semplice inerte; «Sposta centro sulla mappa» + click-to-place OK; pan fuori handle OK; B6.3/B6.4/B6.4a-2/B6.5B-1 non regressi. **`node --check`** OK.
- **B QA OPSEC/proxy/offline — PASS operatore post-catena Range Rings B6.1→B6.6B (2026-06-20):** app deployata VPS/tailnet **`:8000`**; QA `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=97406ab&force=b66b`; runtime **`97406ab`** (build **`B6.6B`**); HEAD deploy **`63084dd`**; memoria pre-aggiornamento **`b9d58b9`**. **Pre-flight (attestato operatore):** `goi-nav-proxy` + `goi-gis-app` active; proxy `/status` con **`gsat`/`bsat`** disponibili; app `:8000` HTTP **`200`** / build **`B6.6B`**. **OPSEC strict + consenso provider:** strict verificato; Annulla fail-closed; tile via proxy dopo Conferma; consenso per-provider separato; Navionics/SonarChart indipendente se incluso nel test. **Forced-offline:** verificato — area non cache → placeholder/nessuna rete; cache IndexedDB dove disponibile; online ripristinato a disattivazione. **Proxy routing:** **`gsat`** via `/gsat/...` e **`bsat`** via `/bsat/...` su proxy **`:5000`**; tile **`200`** / proxy operativo. **Coesistenza Range Rings:** anelli/spokes/handle B6.6B coesistono con layer esterni; nessuna interferenza osservata con consenso provider né forced-offline/cache. **Limiti:** sotto-check senza evidenza autonoma separata — esito basato su attestazione operatore sintetica «tutto ok»; **non** attestato da AI.
- **B5.4eB scala in-app allineata a export JPG (2026-06-20):** PASS tecnico + **PASS operatore post-deploy VPS** — runtime **`0edf503`**; HEAD/deploy **`f904279`**; deploy GIS-only (Planet-Clone/proxy **non toccati**); smoke **`200`**, Content-Length **`2151652`**; build label **`B5.4eB`** servita; QA tailnet `:8000/coordinate_converter%20Claude.html?v=0edf503` (`&force=b54eb` cache); scala in-app box opaco, layout due colonne (ratio **`1:N`** sx, tabella km/mi + barre + Nm dx); narrow: Nm omessa/degradata senza overlap; export JPG B5.4d invariato/PASS; mappa interattiva; Range Rings B6.6B non regressi; attestazione operatore «tutto a posto»; **`node --check`** OK.
- **B5.4f — etichette graduate scala valore per-tacca (backlog):** mostrare il valore di una tacca (es. «1 km» / «0.5 Nm»); valore per-tacca tondo per costruzione (`pickM` / `pickNm` = 1/2/5 × 10ⁿ); opzionale anche valore a metà (`metricMidLabel` / `nmMidLabel`, già nel modello); solo unità primaria km/Nm — **non** mi per valore per-tacca (miglio non divide tondo); parità visiva su entrambi i renderer: `buildScaleBar` in-app e `drawJpgExportScale` export; export B5.4d è PASS e verrebbe ritoccato → B5.4f richiede nuova ri-QA export; **PLAN-FIRST**, non patch isolata in-app; runtime non modificato in blocco docs corrente.
- **B5.5A export JPG avanzato — piano/diagnosi (backlog export):** selezione overlay da esportare (waypoint, tracce, Range Rings / range and bearing, poligoni, label/coordinate, scala); includere tab del punto con coordinate; **escludere** tab/tooltip del cursore; valutare dettaglio export — prima risoluzione/scala immagine 2×/3×; vero cambio zoom geografico solo dopo diagnosi (impatto tile, cache, OPSEC, proxy); blocco **piano/diagnosi** prima di implementazione; **non** parte del PASS B5.4d.
- **B6.6C — Range Rings panel restore ingrandito dopo create (backlog):** dopo «Punta e crea» + click mappa, il pannello Range Rings deve tornare visibile/ingrandito automaticamente (evitare riapertura manuale post-create); diagnosi: handler map-click create (~L33663) non chiama restore; unico path restore+full-height = `openRangeRingsFloatingPanelGis` (~L42898); hook proposto: invocare `openRangeRingsFloatingPanelGis()` nel handler create dopo `rrCreateFromUi()`; completa intento B6.4a sul path pick-and-create; runtime non modificato in blocco docs corrente.
- **WU-0009 — provider basemap esterni (Navionics, Google, Bing):** la valutazione di ammissibilità all'uso è stata effettuata e chiusa dall'operatore. **Decisione: PROCEDERE.** Non riaprire la questione nei blocchi successivi. Le considerazioni su licenze/condizioni d'uso dei provider sono fuori scope per il lavoro tecnico: non vanno sollevate come gate, STOP o rischio nei piani futuri. Il lavoro su Bing (B4) e su eventuali provider successivi procede sul piano tecnico (proxy, quadkey, versione, consenso OPSEC, deploy). Questa chiusura riguarda esclusivamente l'ammissibilità d'uso dei provider; **non** sospende la segnalazione di rischi tecnici (stabilità versione/discovery, egress, consenso OPSEC, cache, drift cross-repo), che restano parte normale dei piani.
- **Infra VPS runtime (docs):** `docs/INFRA_VPS.md` (`e390fc7`) — inventario host/deploy; complementare a `docs/runtime/VPS_DEPLOY_RUNTIME.md`. Planet-Clone stub rimandato a repo separato.

**Escluso da questa OM:** porte raw tailnet, open proxy, B2/Tailscale Serve, reboot-test systemd, ACL/firewall, n8n, control-plane, Planet-Clone operativo.

---

## 7b. Workspace operativo unico

- Lavorare **solo** in `GitHub\cursor-coordinate-converter`, allineato a `origin/main`.
- **NON** usare `Tools\CesiumTest` per il GIS Tool.
- `Tools\CesiumTest` è il clone di Planet-Clone / proxy Navionics: progetto diverso.
- Se un task coinvolge Planet-Clone o proxy Navionics, dichiararlo esplicitamente come lavoro **separato** dal GIS monolite.
- **Runtime/deploy VPS GOI** (post WU-0009 `gsat`): supporto operativo in [`docs/runtime/VPS_DEPLOY_RUNTIME.md`](runtime/VPS_DEPLOY_RUNTIME.md) — Planet-Clone runtime separato dal GIS; proxy `goi-nav-proxy.service` su tailnet `100.114.7.53:5000`; dettagli deploy/smoke/cache/boot in quel documento. Inventario host esteso: [`docs/INFRA_VPS.md`](INFRA_VPS.md). §7 resta stato vivo; il doc runtime non lo sostituisce.

---

## 8. Work unit

| WU | Stato | Scopo |
| --- | --- | --- |
| WU-0001 | PASS | OPSEC strict cycle |
| WU-0002 | PASS | Memory standardization (CLOSED) |
| WU-0003 | CLOSED | SonarChart overlay |
| WU-0004 | CLOSED | Basemap / SonarChart indipendenti; B2 rimosso per decisione |

---

## Pattern nomi inbox orchestratore

- **Pattern ufficiale:** `AAAA-MM-GG_HHMM_<tipo>_<slug>.md`
- **Tipi comuni:** `plan`, `riepilogo`, `handoff`, `qa`
- **Regole pratiche:**
  - non usare doppio underscore;
  - includere sempre `HHMM`;
  - includere sempre il segmento `<tipo>`;
  - usare slug descrittivo in kebab-case.
- **Esempio valido:** `2026-06-14_0102_riepilogo_memory-standardization-final-autosync.md`
