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
| HEAD remoto (verificato) | `c0fb4da` — aggiornare con `git ls-remote` prima di ogni sessione |
| Ultimo blocco chiuso | **MAJOR-3-a** — Unified GIS export hub (build 32) |
| Metodo vivo | **METHOD-BUNDLING-DEFAULT** + **METHOD-QA-PASS-AUTO-FINITO** (OM §4 Regole G + H) |
| Runtime live VPS | `c0fb4da4205f0771d5c9e8952ed48eefe49f7475` |
| Blob monolite (git) | `92d8ff692bc5ea7d7eb45ca1fae449d75e38b640` |
| `APP_BUILD_NUM` | `32` |
| Display runtime | `B5.5Z · build 32` |
| `APP_BUILD_ID` | `B5.5Z` (invariato) |
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
| URL runtime QA | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=c0fb4da` |

**Prossimo ordine operativo:**

**MAJOR-4** backlog basso. **OFFLINE-DOWNLOAD-CONTROLS** backlog (Pausa / Stop-Annulla / Riprendi download tile — **non ora**). **Programma pick Workbench MAJOR-5A2 completo.**

**Backlog basso / non ora:** MAJOR-4, eventuali estensioni MAJOR-3 (import unificato), OFFLINE-DOWNLOAD-CONTROLS.

**Stop:** microcorrezioni UX non funzionali salvo bug reale.

---

## Backlog / note immediate

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
