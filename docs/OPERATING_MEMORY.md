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

**Legacy (non memoria corrente):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/orchestrator/latest.md`, `docs/orchestrator/chatgpt-checkpoint.md` e WU chiuse (WU-0001→0004 salvo richiamo esplicito dalla roadmap viva) — consultabili per audit, **non** come current-state primario.

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
- **Motore tile tileScheme (WU-0008 8c-A):** PASS runtime — helper `normalizeTileScheme` / `formatTilePath` / `buildTileUrl`; layer `sat` migrato a `urlBase` + `tileScheme: "zyx"` (URL invariato); fetch centralizzati in hydrate/precache/export JPG; nessun nuovo provider Esri, nessuna modifica UI Layers; `makeTileKey` invariato. Static: `node --check` OK (2× script inline); regressione URL sat verificata. Browser QA operatore: da confermare in sessione successiva se non già fatto.
- **Governance online/offline:** WU-0005 B0/B1 documentata — regola: GIS online di default; `state.forceOffline` è interruttore volontario dell’operatore; `state.opsecStrict` resta gate superiore per chiamate di rete sensibili. Mappati i gate esistenti nel monolite: `isEffectivelyOnline()`, `tileFetchAllowed(layerId)`, `internetApiFetchAllowed()`, consenso proxy/Navionics-like (`ensureNavProxyConsent()`, `_navProxyConsentGranted`), geocoding (`geocodingAllowed()`, Nominatim/`reverseGeocode`), tile/layer fetch (`hydrateMapTiles`, `fetchAndStoreTile`), cache/offline maps, seamarks/SonarChart, tracking rete (`recordNetEvent`, `_netEvents`). Eventuali ambiguità UI/copy vanno trattate in micro-patch B2 separata.
- **Mappe offline UX (backlog):** micro-fix «Scarica selezionate» su aree COMPLETATA + copy IndexedDB vs file PC (`345d712`). Revisione UX futura: etichette cache vs export JPG, azione export da riga area, feedback fine job — candidato non-WU.

**Escluso da questa OM:** porte raw tailnet, open proxy, B2/Tailscale Serve, reboot-test systemd, ACL/firewall, n8n, control-plane, Planet-Clone operativo.

---

## 7b. Workspace operativo unico

- Lavorare **solo** in `GitHub\cursor-coordinate-converter`, allineato a `origin/main`.
- **NON** usare `Tools\CesiumTest` per il GIS Tool.
- `Tools\CesiumTest` è il clone di Planet-Clone / proxy Navionics: progetto diverso.
- Se un task coinvolge Planet-Clone o proxy Navionics, dichiararlo esplicitamente come lavoro **separato** dal GIS monolite.

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
