# HANDOFF — GOI GIS Tool

Handoff canonico breve del repository GIS. **Non sostituisce** `docs/OPERATING_MEMORY.md` §7 (stato vivo). Aggiornare questo file a ogni chiusura docs rilevante; non usare come dump storico.

---

## Regola stato

1. Leggere lo **stato corrente da GitHub `origin/main`** — non memoria interna dell’agente, cartelle locali stale o vecchi checkpoint.
2. **Autorità finale HEAD:** `git ls-remote origin refs/heads/main` da attore git-capabile.
3. RAW GitHub, blob via connector o copie locali sono **utili ma secondari** — possono essere stale; se divergono da `ls-remote`, vince `ls-remote`.

---

## Read-set operativo

In ordine:

1. `README.md` — bootloader e regole di lettura
2. `docs/OPERATING_MEMORY.md` — protocollo §4 e stato vivo §7
3. `docs/work-units/WU-0005-0009-roadmap.md` — piano, backlog, workstream
4. `docs/QA-CHECKLIST.md` — procedura/template QA
5. **`docs/HANDOFF.md`** — seed operativo sintetico (questo file)
6. `coordinate_converter Claude.html` — solo se serve codice/runtime

---

## Precedenza fonti

| Fonte | Ruolo |
| --- | --- |
| `README.md` | Bootloader / read-set |
| `docs/OPERATING_MEMORY.md` §7 | **Stato vivo** (autorità operativa) |
| `docs/work-units/WU-0005-0009-roadmap.md` | Piano / backlog / workstream |
| `docs/QA-CHECKLIST.md` | Procedura/template QA — **non** stato vivo |
| `docs/HANDOFF.md` | Seed handoff sintetico — **non** sostituisce OM §7 |
| `coordinate_converter Claude.html` | Runtime |
| `checkpoint.md`, `session-*.md`, `orchestrator/latest.md`, `chatgpt-checkpoint.md` | Legacy/storico — **non** stato corrente primario |

In conflitto: segnalare e preferire il documento **più specifico e più recente** (OM §7 / roadmap viva).

---

## Ruoli

| Attore | Ruolo |
| --- | --- |
| **GPT** | Orchestratore — scrive prompt Cursor e prompt review Claude |
| **Claude** | Consigliere upstream e verifier byte downstream; advisory; **no push**; **non** scrive prompt Cursor |
| **Cursor** | Esegue, committa, deploya secondo prompt e workflow del repo |

---

## Disciplina Cursor

- **Cursor write+commit = Agent+Auto** (Plan solo per diagnosi pura read-only).
- Prompt Cursor: **pulito e unico**; indicazioni operatore **fuori** dal prompt.
- **`finito`** = workflow interno a Cursor (non passo manuale operatore).
- Nei prompt **bundle** runtime: coda `finito` **pre-autorizzata**; trigger automatico = riga `QA <BLOCK-ID> PASS operatore` (OM §4 Regola H) — **non** chiedere «ora lancia finito» dopo QA PASS.
- Nei blocchi non-bundle: `finito` **condizionale in coda** al prompt quando applicabile.
- **Bundling di default (METHOD-BUNDLING-DEFAULT):** un bundle / un commit / una QA (≥5 item routine); gate solo a livello bundle; non frammentare micro-modifiche routine. Dettaglio: OM §4 Regola G.
- **QA-PASS auto-finito (METHOD-QA-PASS-AUTO-FINITO):** chiusura docs obbligatoria dopo QA PASS; cambia solo il trigger (automatico da attestazione). Dettaglio: OM §4 Regola H.

---

## Gate bundle (sostituisce separazione per-microblocco come default)

| Tipo bundle | Contenuto tipico | Review / deploy |
| --- | --- | --- |
| **ROUTINE** | CSS, HTML, attributi, i18n, UI, cosmetico, Ramo A, JS basso rischio | **Nessun hop Claude** — deploy + QA bundle |
| **DELICATO** | sanitizer/whitelist, OPSEC, rete/tile/proxy, cache/storage, nuovo campo persistito, create-path, lifecycle modale/dialog −/× | Claude `raw@FULL_SHA` pre-deploy se disponibile; altrimenti review sostitutiva GPT (checklist obbligatoria) + QA + Claude post-hoc |

**Ramo A / B** (legacy per singolo diff): restano utili come etichette tecniche dentro un bundle, non come obbligo di un commit per item.

| Ramo | Criterio | Nota bundle |
| --- | --- | --- |
| **A** | Solo HTML / CSS / attributi, **zero JS** | Tipico mega-bundle ROUTINE |
| **B** | Qualsiasi JS | ROUTINE se basso rischio; DELICATO se tocca categorie sopra |
| **Dubbio** | — | Trattare come **DELICATO** |

**Review Claude obbligatoria (bundle DELICATO):** sanitizer/whitelist, create-path, nuovo campo persistito, OPSEC, rete/tile/proxy, cache/storage, architettura, lifecycle pannelli/dialog −/×.

---

## Deploy GIS-only

| Parametro | Valore |
| --- | --- |
| Host SSH | `ionos-n8n` |
| Repo VPS | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| Servizio | `goi-gis-app.service` |

**Procedura:** `git fetch` → `git checkout main` → `git pull --ff-only origin main` → `systemctl restart goi-gis-app.service` → smoke HTTP + byte/SHA/cmp.

**Non toccare:** Planet-Clone, Navionics proxy, Docker, n8n, Tailscale/firewall, altri servizi.

**Push ≠ app aggiornata** finché non eseguito deploy GIS-only verificato.

---

## PASS

| Tipo | Definizione |
| --- | --- |
| **PASS tecnico remoto** | Hash / HEAD / blob / deploy / byte / SHA / cmp verificati |
| **PASS operatore** | Attestazione **persona** su app live |

- Cursor **non inventa** PASS operatore.
- **Fail-closed** senza attestazione esplicita.
- QA **minima narrativa** di default; checklist estesa solo per OPSEC, rete, cache/storage, migrazioni, architettura, diff multi-area, alto rischio.

---

## Stato fresco (snapshot — verificare sempre con `ls-remote`)

> Valori registrati al momento dell’ultimo aggiornamento di questo file. **Non** fidarsi senza ri-verifica remota.

| Campo | Valore |
| --- | --- |
| HEAD documentale (pre-autosync finito QA) | runtime **`1812010`** già su main/VPS; nuovo commit docs di questa chiusura aggiorna la HEAD documentale (verificare `git ls-remote` post-push) |
| Runtime live / commit monolite | `18120102f319721aa237badb1db3c28327739e88` (`1812010`) — tip MAJOR-3-b1 |
| Ultimo blocco runtime chiuso | **MAJOR-3-b1** — Unified GIS Import Hub foundation preview zero-write (build 51) — **CLOSED / PASS end-to-end** |
| Metodo vivo | **METHOD-BUNDLING-DEFAULT** + **METHOD-QA-PASS-AUTO-FINITO** (OM §4 Regole G + H) |
| Runtime Git / atteso VPS | `18120102f319721aa237badb1db3c28327739e88` (deploy GIS-only Cursor SSH PASS) |
| Blob monolite (git) | `ba2cf240f20595ef066dd59e7a3b685850f049c5` |
| Byte monolite (git LF) | `2815080` |
| `APP_BUILD_NUM` | `51` |
| Display runtime | `B5.5Z · build 51` |
| `APP_BUILD_ID` | `B5.5Z` (invariato) |
| MAJOR-3-b1 | **CLOSED / PASS end-to-end** (Import Hub preview; QA PASS) |
| OFFLINE-DOWNLOAD-CONTROLS-A / FIX1 / FIX2 / FIX3 | **CLOSED / PASS end-to-end** (Pause/Resume/Stop + sticky bar + tabella; QA PASS) |
| TRACK-CREATE-EDIT-UX-A / FIX1 | **CLOSED / PASS end-to-end** (CTA punti/pennello + stile unificato + verify; QA PASS) |
| TRACK-BRUSH-ANTIMERIDIAN / FIX1 | **CLOSED / PASS end-to-end** (dateline shortest-wrap + fit ordinato; QA PASS) |
| TRACK-BRUSH-A / FIX1 / FIX2 / FIX3 | **CLOSED / PASS end-to-end** (pennello freehand + lifecycle + import lock + Esc) |
| TRACK-STYLE-A / FIX1 / FIX2 | **CLOSED / PASS end-to-end** (stile saved tracks + lifecycle + Include sync) |
| IMPORT-DROP-B / TRACK-MODAL-UX-A | **CLOSED / PASS end-to-end** (KMZ drop + fit + Centra/Unità) |
| IMPORT-DROP-A | **CLOSED / PASS end-to-end** (drag & drop GPX/KML multi-file) |
| MAJOR-4-a | **CLOSED / PASS end-to-end** (Mission Package JSON export Workbench) |
| MAJOR-3-a | **CLOSED / PASS end-to-end** (export hub Workbench GeoJSON/GPX/KML) |
| MAJOR-2E-a | **CLOSED / PASS end-to-end** (persistenza status post-Verifica IDB) |
| MAJOR-5A2-UX-BACKLOG | **CLOSED / PASS end-to-end** (toolbar dark, resize pannello, chip filtri) |
| MAJOR-5A2c | **CLOSED / PASS end-to-end** (pick mappa poligoni GIS) |
| MAJOR-5A2b | **CLOSED / PASS end-to-end** (pick mappa esplicito WP+traccia) |
| MAJOR-5A2a | **CLOSED / PASS end-to-end** (selezione riga + highlight mappa session-only) |
| MAJOR-5A1 | **CLOSED / PASS end-to-end** (catalogo oggetti read-only + filtri + fly-to) |
| MAJOR-2BCD | **CLOSED / PASS end-to-end** (quota/errori + delete metadata vs fisico protetto) |
| MAJOR-2A | **CLOSED / PASS end-to-end** (verificatore copertura offline read-only) |
| MAJOR-1 | **CLOSED / PASS end-to-end** (pannello Diagnostica read-only) |
| UX-NEXT-RUNTIME-BUNDLE-E | **CLOSED / PASS end-to-end** (build 22) |
| UX-NEXT-RUNTIME-BUNDLE-D | **CLOSED / PASS end-to-end** (build 21; wheel FIX2) |
| UX-NEXT-RUNTIME-BUNDLE-C | **CLOSED / PASS end-to-end** (build 18) |
| UX-NEXT-RUNTIME-BUNDLE-B | **CLOSED / PASS end-to-end** (build 17) |
| UX-NEXT-RUNTIME-BUNDLE-A | **CLOSED / PASS end-to-end** (build 16) |
| ROUTINE-CLEANUP-BUNDLE | **CLOSED / PASS end-to-end** (build 15) |
| URL runtime QA | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=1812010` |

**Prossimo ordine operativo:**

**MAJOR-3-b2** (apply additivo Import Hub) da decidere. **MAJOR-4** import/restore backlog basso. **Programma pick Workbench MAJOR-5A2 completo.** **MAJOR-3-b1** **CLOSED** (`1812010`, build 51). **OFFLINE-DOWNLOAD-CONTROLS-A** (+ FIX1–FIX3) **CLOSED** (`fb11986`, build 50).

**Backlog basso / non ora:** apply MAJOR-3-b2 (finché non autorizzato), import/restore MAJOR-4.

**Stop:** microcorrezioni UX non funzionali salvo bug reale. Nessuna WU runtime aperta in chiusura TRACK-CREATE-EDIT-UX-A.

---

## Backlog / note immediate

### TRACK-CREATE-EDIT-UX-A (+ FIX1) — CTA Nuova traccia + stile unificato (build 46) — CLOSED

**Stato:** **CLOSED / PASS end-to-end** (2026-07-24). **Non** WU aperta.

**Runtime tip:** `793f4cb30437eb490cb65a71831195bdc5441837` — catena `33dc33d` (45) → `793f4cb` (46 FIX1) — blob `0afb9c91…` — byte LF **2765139** — SHA-256 LF **`61c8b386…`** — display **`B5.5Z · build 46`** — deploy GIS-only Cursor SSH PASS — review downstream FIX1 PASS — QA «**QA TRACK-CREATE-EDIT-UX-A + FIX1 PASS operatore**».

**Sintesi:** menu Nuova traccia (Per punti / Con pennello); `workingStyle` in review brush; Modifica unificata geometria+nome+stile; rimozione Stile riga; batch stile preservato; FIX1 confronto canonico post-`saveStore` + rollback.

### IMPORT-DROP-B-TRACK-MODAL-UX-A — KMZ drop + Centra/Unità (build 35) — CLOSED

**Stato:** **CLOSED / PASS end-to-end** (2026-07-21).

**Runtime:** `1d2816351c71bcecd69d33325cd3d8f01cea8028` — blob `ee599bde…` — byte **2610149** — SHA-256 **`21617a76…`** — build **35** — QA «**QA IMPORT-DROP-B-TRACK-MODAL-UX-A PASS operatore**» — deploy Cursor SSH non disponibile (manuale operatore); chiusi **IMPORT-DROP-B** + **TRACK-MODAL-UX-A**.

### IMPORT-DROP-A — multi-file GPX/KML drag & drop (build 34) — CLOSED

**Stato:** **CLOSED / PASS end-to-end** (2026-07-21).

**Runtime:** `5f57a755c5e809de2e4495aa9d5caba58d8084a5` — blob `0d713702…` — byte **2606270** — SHA-256 **`849bf44f…`** — CMP_PASS — PR #2 squash — review PASS — deploy GIS-only PASS — restart servizio **non necessario** — QA «**QA IMPORT-DROP-A PASS operatore**».

### TRACK-STYLE-A (+ FIX1 + FIX2) — stile saved tracks (build 38) — CLOSED

**Stato:** **CLOSED / PASS end-to-end** (2026-07-21).

**Runtime tip:** `40c97b6bec5ac9120d772b444906accca00f8c9d` — blob `2acf7711…` — byte **2655368** — SHA-256 **`952550ef…`** — build **38** — catena `ab5455d` (36) → `1146e59` (37 FIX1) → `40c97b6` (38 FIX2) — deploy PASS (operatore fuori Cursor) — QA «**QA TRACK-STYLE-A PASS operatore**».

### TRACK-BRUSH-ANTIMERIDIAN (+ FIX1) — dateline brush/render/fit (build 44) — CLOSED

**Stato:** **CLOSED / PASS end-to-end** (2026-07-23). **Non** WU aperta.

**Runtime tip:** `9cc7937e807f06f92a783472f292372b9ec7f085` — catena `bebf517` (43) → `9cc7937` (44 FIX1) — blob `6f22b7e9…` — byte **2733148** — SHA-256 **`91272498…`** — display **`B5.5Z · build 44`** — deploy GIS-only Cursor SSH PASS — review downstream PASS — QA «**QA TRACK-BRUSH-ANTIMERIDIAN PASS operatore**».

**Sintesi:** shortest-wrap render (saved/draft/brush review) + lift reject antimeridiano brush; FIX1 fit/Centra su unwrap ordinato (stesso ordine del render), incluso segmento chiusura se `closed`.

### TRACK-BRUSH-A (+ FIX1–FIX3) — pennello freehand (build 42) — CLOSED

**Stato:** **CLOSED / PASS end-to-end** (2026-07-23). **Non** è una WU aperta. **Non** è un candidato corrente.

**Runtime tip:** `d4f877ae0d4c7d936fc1e0193e9c40fa8f7c1a9c` — catena `15f9640` (39) → `75a1d5c` (40) → `db10408` (41) → `d4f877a` (42) — blob `6e676089…` — byte **2728773** — SHA-256 **`3660ce50…`** — display **`B5.5Z · build 42`** — deploy GIS-only Cursor SSH PASS — QA «**QA TRACK-BRUSH-A PASS operatore**».

**Sintesi storica utile:** disegno libero + screen-to-geo + ricampionamento + anteprima/review + salvataggio via helper saved-track comune; FIX1 lifecycle/pointer; FIX2 persistence/geometry; FIX3 import lock + Esc non distruttivo in review.

Finding IMPORT-DROP-A **note-only** (storico; non runtime ora): concatenazione segmenti (F1); costanti nominate cap; feedback `saveStore`; conteggio errori aggregato (F6); mismatch accept drop vs paste; sampling fit; N+1 `saveStore` poligoni.

### OFFLINE-DOWNLOAD-CONTROLS — controlli download tile (backlog)

**Stato:** backlog candidato — **non implementato**, **non bloccante**.

**Origine:** nota operatore post-QA MAJOR-2E-a (2026-07-01).

**Ambito:** Mappe Offline — aggiungere in futuro controlli sul job download tile: **Pausa**, **Stop/Annulla**, **Riprendi**.

**Non ora:** nessun runtime in questo blocco.

### MAJOR-5A2-UX-BACKLOG — Workbench visual polish (build 30) — CLOSED

**Origine:** backlog UX non bloccante post-QA MAJOR-5A2b — **chiuso** runtime **`d9c8f7b`**, QA «**QA MAJOR-5A2-UX-BACKLOG PASS operatore**».

1. Toolbar `.twb-btn` — tema scuro GIS (PASS).
2. `#gisWorkbenchPanel` — resize angoli via CSS handle + z-order (PASS).
3. Chip `.wb-filter-chip` — palette dark scoped (PASS).

**Regressione Workbench pick/selezione:** OK in QA operatore.

### UX-NEXT-RUNTIME-BUNDLE-E — consolidamento UX GIS (runtime landed)

- Empty states + micro-help su Preferiti, Tracce, Poligoni, Waypoints, Layers, Range Rings, Misura, Cerca
- Focus-visible toolbar/zoom/strati; `tip.modalClosePanelEsc` su pannelli GIS floating
- HUD chip build 22 + tooltip `APP_BUILD_LABEL`; centro mappa con `gis.hud.centerFmt`
- Mobile: hit target toolbar 36px; scroll body pannelli
- **Wheel zoom invariato** (fix D-FIX2)

### UX-NEXT-RUNTIME-BUNDLE-D — HUD/resize polish + wheel zoom (runtime landed)

- HUD compact/chip polish; focus-visible su HUD e handle resize e/w
- `gisPanelResetEwWidth` — doppio-clic ripristino larghezza pannello
- `tip.panelResizeEW` IT/EN/FR aggiornato
- **Wheel zoom FIX2** — wire-once `#miniMap`, idle 140 ms, cooldown 100 ms, ±1 per gesto
- **D-FIX1** (`5fec693`, build 20) — QA FAIL storico; superseded da FIX2

### UX-NEXT-RUNTIME-BUNDLE-C — resize residui + HUD polish (runtime landed)

- Resize e/w su **`#rangeRingsPanel`**, **`#measurePanel`**, **`#helpOverlay`**, **`#waypointModal`** (+ 5 pannelli da BUNDLE-A/B)
- Affordance resize comune (handle/grip/hover/touch)
- HUD: collision polish, tooltip/aria i18n, reset session-only `↺`
- Cleanup i18n orphan `renameLabel`/`renameSave` **eseguito**

### UX-NEXT-RUNTIME-BUNDLE-B — resize multi-pannello + HUD (runtime landed)

- Resize laterale e/w su **`#polygonPanel`**, **`#trackModal`**, **`#layersPanel`**, **`#searchPanel`** (+ Preferiti da BUNDLE-A)
- HUD: 4 angoli session-only, modalità compatta, chip centro mappa + Seamarks

### UX-NEXT-RUNTIME-BUNDLE-A — resize pilota + HUD (runtime landed)

- Resize laterale **pilota** su `#favoritesPanel` (handle `e`/`w`) — esteso in BUNDLE-B/C
- HUD leggero `#gisMapHud` (layer, zoom, offline/OPSEC warning) — sessione/transiente
- Cleanup `#polygonPanelRenameBar` / `polygonHideRenameBar` **eseguito** (rename inline invariato)

---

## Aggiornamento di questo file

- **Method A:** handoff canonico repo — creato con blocco docs `docs/HANDOFF.md method A` (2026-06-27).
- Aggiornare snapshot § stato fresco e prossimo ordine a ogni chiusura docs rilevante; dettaglio completo resta in OM §7 e roadmap.
