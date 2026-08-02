<!-- AUTO-VIA-HEADER: NON RIMUOVERE -->
> **REGOLA OPERATIVA VINCOLANTE — AUTO-VIA.** Se il prossimo passo non richiede una decisione reale dell’operatore — scelta di prodotto, scope ambiguo, rischio non autorizzato o conflitto non risolvibile — l’assistente deve considerare il `vai` già concesso e procedere autonomamente. È vietato chiedere conferme, autorizzazioni o un nuovo `vai` per attività già approvate, programmi già autorizzati o passaggi tecnicamente determinati. Un programma esplicitamente autorizzato resta autorizzato per i blocchi successivi finché non emerge una scelta reale o un gate fallito. Fermarsi soltanto davanti a una decisione effettiva che può cambiare il risultato.
<!-- /AUTO-VIA-HEADER -->

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
| **GPT / ChatGPT** | Orchestratore — scrive prompt Cursor e prompt review Claude; **autore unico** delle istruzioni QA operatore (Regola D2: Dove/Azione/Risultato atteso) |
| **Claude** | Consigliere upstream e verifier byte downstream; advisory; **no push**; **non** scrive prompt Cursor |
| **Cursor** | Implementa, testa tecnicamente, committa, deploya; dopo deploy PASS dichiara `QA FINALE CHATGPT — PENDING`; riceve **solo** l’attestazione finale PASS/FAIL |

---

## Disciplina Cursor

- **Cursor write+commit = Agent+Auto** (Plan solo per diagnosi pura read-only).
- Prompt Cursor: **pulito e unico**; indicazioni operatore **fuori** dal prompt.
- **`finito`** = workflow interno a Cursor (non passo manuale operatore).
- Nei prompt **bundle** runtime: coda `finito` **pre-autorizzata**; trigger automatico = riga `QA <BLOCK-ID> PASS operatore` (OM §4 Regola H) — **non** chiedere «ora lancia finito» dopo QA PASS.
- Nei blocchi non-bundle: `finito` **condizionale in coda** al prompt quando applicabile.
- **Bundling di default (METHOD-BUNDLING-DEFAULT):** un bundle / un commit / una QA (≥5 item routine); gate solo a livello bundle; non frammentare micro-modifiche routine. Dettaglio: OM §4 Regola G.
- **QA-PASS auto-finito (METHOD-QA-PASS-AUTO-FINITO):** chiusura docs obbligatoria dopo QA PASS; cambia solo il trigger (automatico da attestazione). Dettaglio: OM §4 Regola H.
- **QA ChatGPT a tre righe (Regola D2):** dopo deploy PASS Cursor **non** emette QA; gate `QA FINALE CHATGPT — PENDING`; ChatGPT emette un messaggio con passaggi `Dove:` / `Azione:` / `Risultato atteso:`; dubbi/FAIL con ChatGPT; in Cursor solo attestazione finale.

---

## L10N — IT attiva / EN·FR frozen

- **Nuove feature e nuove stringhe UI:** italiano only (obbligo di lavoro).
- **EN / FR:** espansione e manutenzione evolutiva **congelate** — no nuove traduzioni, no parità formale, no backfill, no QA ordinaria EN/FR, no fix cosmetici EN/FR non richiesti.
- **Sistema i18n esistente:** preservato (dizionari, selettore, chiavi, `data-i18n` / `data-i18n-html`, traduzioni storiche).
- **Unfreeze:** solo decisione **esplicita** dell’operatore.
- Rule: [`.cursor/rules/32-l10n-en-fr-freeze.mdc`](../.cursor/rules/32-l10n-en-fr-freeze.mdc) — prevale su requisiti storici di parità IT/EN/FR.

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
- Dopo deploy PASS: Cursor dichiara **`QA FINALE CHATGPT — PENDING`** (non emette istruzioni QA).
- QA operativa: **ChatGPT**, struttura obbligatoria **Dove / Azione / Risultato atteso** (OM §4 Regola D2); checklist estesa solo OPSEC/rete/cache/storage/migrazioni/alto rischio, sempre da ChatGPT.
- Riga `QA <BLOCK-ID> PASS operatore` in Cursor → **auto-finito** Regola H.

---

## Stato fresco (snapshot — verificare sempre con `ls-remote`)

> Valori registrati al momento dell’ultimo aggiornamento di questo file. **Non** fidarsi senza ri-verifica remota.

| Campo | Valore |
| --- | --- |
| HEAD documentale (pre-autosync) | commit docs **finito UX-SEARCH-ERROR-FOCUS-A** (verificare `git ls-remote` post-push); monolite tip `0b27e27` |
| Runtime live / commit monolite | `0b27e27c46fecd69b42983680c2d70c12d8fe302` (`0b27e27`) — tip UX-SEARCH-ERROR-FOCUS-A |
| Ultimo blocco chiuso | **UX-SEARCH-ERROR-FOCUS-A** — **CLOSED / PASS end-to-end** (QA PASS + finito Regola H; chiude SEARCH-UX-A + UI-MODAL-ERROR-FOCUS-A) |
| Ultimo blocco runtime monolite | **UX-SEARCH-ERROR-FOCUS-A** — tip `0b27e27` build 107 — **CLOSED / PASS end-to-end** |
| Task aperto corrente | nessuno runtime aperto — resto Bundle F da scegliere |
| L10N-EN-FR-FREEZE-A | **CLOSED / PASS docs-only** — IT nuove stringhe; EN/FR frozen; i18n esistente preservato |
| ROUTING-PROFILE-EDIT-A | **SUPERSEDED / RENAMED — NO RUNTIME** (residuo → ROUTING-POINT-COORD-EDIT-A **CLOSED**) |
| GraphHopper VPS live | **`nord-ovest-B-v3-elev`** — bilinear + ramer `max_elevation: 5`; import `2026-07-28T23:39:23Z`; downtime cutover **11 s**; V0 `nord-ovest-B` + backup/staging **mantenuti** |
| WU infrastruttura corrente | **WU-0011 / INFRA-GH-1A + INFRA-GH-1B + INFRA-GH-1D — CLOSED / PASS end-to-end** — [`WU-0011`](work-units/WU-0011-infra-gh-1a-graphhopper-local-poc.md), [`INFRA_VPS.md`](INFRA_VPS.md) |
| Endpoint GraphHopper | VPS **`http://100.114.7.53:8989`** (Tailscale); Local **`http://127.0.0.1:8989`** (PoC); admin VPS **`127.0.0.1:8990`** |
| Metodo vivo | **METHOD-BUNDLING-DEFAULT** + **METHOD-QA-PASS-AUTO-FINITO** (OM §4 Regole G + H) |
| Runtime Git / atteso VPS | `0b27e27c46fecd69b42983680c2d70c12d8fe302` (deploy GIS-only Cursor SSH PASS) |
| Blob monolite (git) | `c56b4a357687150158231676cdecb9ca6030a2b5` |
| Byte monolite (git LF) | `3285428` |
| `APP_BUILD_NUM` | `107` |
| Display runtime | `UX-SEARCH-ERROR-FOCUS-A · build 107` |
| `APP_BUILD_ID` | `UX-SEARCH-ERROR-FOCUS-A` |
| QA-OPERATOR-IT-ONLY-PREF | **CLOSED / PASS docs-only** (QA IT + etichette UI visibili; Regola D1) |
| QA-CHATGPT-3LINE-HANDOFF-PREF | **CLOSED / PASS docs-only** (QA via ChatGPT; Dove/Azione/Risultato atteso; Regola D2) |
| QA-CHATGPT-3LINE-CURSOR-RULES-A | **CLOSED / PASS docs-only** (`.cursor/rules` allineate a Regola D2; no runtime) |
| Oggetti GIS / Workbench | **FROZEN** — resta in runtime; nessun ulteriore sviluppo autorizzato |
| UX-SEARCH-ERROR-FOCUS-A | **CLOSED / PASS end-to-end** (bundle ROUTINE: history + modal error focus; build 107) |
| ROUTING-SEARCH-UX-A | **CLOSED nel bundle** UX-SEARCH-ERROR-FOCUS-A (session-only) |
| UI-MODAL-ERROR-FOCUS-A | **CLOSED nel bundle** UX-SEARCH-ERROR-FOCUS-A (helper centrale) |
| ROUTING-GEOCODE-SNAP-A | **CLOSED / PASS end-to-end** (superseded live da UX-SEARCH-ERROR-FOCUS-A) |
| ROUTING-ALTERNATIVE-ROUTES-A / FIX1–FIX3 | **CLOSED / PASS end-to-end** (superseded live) |
| ROUTING-GEOCODING-MULTIROW-A / FIX1 / FIX2 | **CLOSED / PASS end-to-end** (superseded live) |
| MAJOR-3-b2 / FIX1 | **CLOSED / PASS end-to-end** (superseded live) |
| TRACK-POINT-CENTER-BUTTON-A | **CLOSED / PASS end-to-end** (Centra per-riga; ID stabile; ROUTINE; review N/A; deploy+QA PASS; superseded live da MAJOR-3-b2) |
| ROUTING-POINT-COORD-EDIT-A / FIX1 | **CLOSED / PASS end-to-end** (coord DD atomiche; FIX1 clear feedback stale; review+deploy+QA PASS; superseded live) |
| MAP-CENTER-VIEWPORT-AWARE-A / FIX1–FIX3 | **CLOSED / PASS end-to-end** (superseded live) |
| TRACK-PROFILE-POINTS-DISPLAY-A | **CLOSED / PASS end-to-end** (overlay punti Profilo; superseded live da MAP-CENTER) |
| APP-BUILD-LABEL-UX-A / FIX1 | **CLOSED / PASS end-to-end** (HUD rimossa; footer stabile; superseded live da TPD-A) |
| ROUTING-UX-POLISH-BUNDLE-A / FIX1 | **CLOSED / PASS end-to-end** (undo storico + unità session + feedback + badge + focus; QA PASS FIX1; superseded live da APP-BUILD-LABEL) |
| ROUTING-SUMMARY-DEDUP-A | **CLOSED / PASS end-to-end** (status «Percorso pronto» senza metriche duplicate; QA PASS; superseded live) |
| TRACK-SAVE-AS-NAME-A | **CLOSED / PASS end-to-end** (nome inline pre-salvataggio Routing→traccia; QA PASS; superseded live da RSD-A) |
| TRACK-ELEVATION-PROFILE-A / FIX1–FIX3 | **CLOSED / PASS end-to-end** (profilo Saved Track; QA FAIL FIX2 → FIX3; QA PASS FIX3; superseded live da TSN-A) |
| OUTDOOR-ROUTING-ELEVATION-STYLE-A | **CLOSED / PASS end-to-end** (restyle profilo altimetrico segmentato; QA PASS) |
| TRACK-MODAL-DISPLAY-PREFS-A | **CLOSED / PASS end-to-end** (unità m/ft + formato coordinate display; QA PASS) |
| OUTDOOR-ROUTING-REVERSE-A | **CLOSED / PASS end-to-end** (Inverti percorso; QA PASS) |
| OUTDOOR-ROUTING-GH-E / FIX1–FIX8 | **CLOSED / PASS end-to-end** (altimetria + difficoltà + sync + locale; due QA FAIL intermedi chiusi; QA PASS finale) |
| INFRA-GH-1D / EXEC-C | **CLOSED / PASS end-to-end** (V3 MMAP live `nord-ovest-B-v3-elev`; QA PASS; finito Regola H 2026-07-29) |
| OUTDOOR-ROUTING-GH-D / FIX1 | **CLOSED / PASS end-to-end** (salva route come traccia + harden; QA PASS) |
| OUTDOOR-ROUTING-GH-C / FIX1 | **CLOSED / PASS end-to-end** (providers Local/VPS/Auto + init A/B; QA PASS) |
| OUTDOOR-ROUTING-GH-B1b / FIX1 | **CLOSED / PASS end-to-end** (pick/marker/GPS + BBOX mutual disarm; QA PASS) |
| OUTDOOR-ROUTING-GH-B2 / FIX1 / FIX2 | **CLOSED / PASS end-to-end** (endpoint + `/route` + preview; review GPT-sostitutiva PASS; deploy+QA PASS) |
| OUTDOOR-ROUTING-GH-B1a / FIX1 / FIX2 | **CLOSED / PASS end-to-end** (shell planner; QA PASS) |
| MAJOR-3-b1 | **CLOSED / PASS end-to-end** (Import Hub preview; QA PASS; superseded live da MAJOR-3-b2) |
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
| URL runtime QA | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=0b27e27` |

**Prossimo ordine operativo:**

Nessun task runtime aperto. Ultimo blocco chiuso: **UX-SEARCH-ERROR-FOCUS-A CLOSED / PASS end-to-end** (chiude SEARCH-UX-A + UI-MODAL-ERROR-FOCUS-A). **Oggetti GIS FROZEN**. **ROUTING-PROFILE-EDIT-A** = **SUPERSEDED / RENAMED — NO RUNTIME**. Resto **Bundle F** da scegliere. **INFRA-GH-1A/1B/1D CLOSED / PASS**. Runtime live monolite **`0b27e27`** / **`UX-SEARCH-ERROR-FOCUS-A · build 107`**. GraphHopper VPS **V3**. Dettaglio: [`WU-0010`](work-units/WU-0010-outdoor-routing-graphhopper.md), [`WU-0011`](work-units/WU-0011-infra-gh-1a-graphhopper-local-poc.md), [`INFRA_VPS.md`](INFRA_VPS.md).

**UX-SEARCH-ERROR-FOCUS-A** CLOSED tip **`0b27e27`**. **MAJOR-4** import/restore backlog basso. Programma pick **Oggetti GIS** (MAJOR-5A2) completo e pannello **FROZEN**.

**Backlog basso / non ora:** **OUTDOOR-ROUTING-API-GATEWAY-A**; import/restore MAJOR-4; resto Bundle F. **QA-OPERATOR-IT-ONLY-PREF CLOSED**. **QA-CHATGPT-3LINE-HANDOFF-PREF CLOSED**. **TRACK-POINT-CENTER-BUTTON-A CLOSED**. **ROUTING-PROFILE-EDIT-A** non è più backlog attivo (SUPERSEDED / RENAMED).

**Stop:** non gateway senza decisione; **non** cancellare `nord-ovest-B` / `nord-ovest-B-v3-elev` / backup o staging EXEC-C.

---

## Backlog / note immediate

### MAP-CENTER-VIEWPORT-AWARE-A (+ FIX1 + FIX2 + FIX3) — Centra viewport-aware — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-08-01). Tip `d0688ea` / `B6.2MCV-A-FIX3 · build 93`. Catena `5b5e052`→`1a7c98c`→`a640ca2`→`d0688ea`. Blob `55d414bc…` · byte LF **3149321** · SHA-256 LF **`0c23594c…`**. Review FIX3 PASS; deploy GIS-only PASS; QA «**QA MAP-CENTER-VIEWPORT-AWARE-A-FIX3 PASS operatore**».

### TRACK-PROFILE-POINTS-DISPLAY-A — Overlay punti Profilo Saved Track — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-08-01). Tip storico `3838e9e` / `B6.2TPD-A · build 89`. Blob `48abde62…` · byte LF **3144095** · SHA-256 LF **`464eed94…`**. Review downstream PASS; deploy GIS-only PASS; QA «**QA TRACK-PROFILE-POINTS-DISPLAY-A PASS operatore**». Superseded live da MAP-CENTER.

### TRACK-ELEVATION-PROFILE-A (+ FIX1 + FIX2 + FIX3) — Profilo altimetrico Saved Track — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-07-31). Tip `1fc9d70` / `B6.1TP-A-FIX3 · build 82`. Catena `4fb0d5a`→`45bbf57`→`ae9ca1e`→`1fc9d70`. QA FAIL FIX2 storica preservata; QA «**QA TRACK-ELEVATION-PROFILE-A-FIX3 PASS operatore**».

### OUTDOOR-ROUTING-ELEVATION-STYLE-A — Restyle profilo altimetrico — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-07-30). Tip `d28bc44` / `B6.0ES-A · build 78`. QA «**QA OUTDOOR-ROUTING-ELEVATION-STYLE-A PASS operatore**».

### OUTDOOR-ROUTING-REVERSE-A — Inverti percorso — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-07-29). Tip `d54c915` / `B6.0R-A · build 76`. QA «**QA OUTDOOR-ROUTING-REVERSE-A PASS operatore**».

### OUTDOOR-ROUTING-POINT-UNDO-A — Undo punti Routing — BACKLOG / NON APERTO

**Stato:** **BACKLOG / NON APERTO** (2026-07-29). Undo spostamenti punti planner, session-only. **Nessuna implementazione**.

### OUTDOOR-ROUTING-UNITS-A — Unità dedicate planner — BACKLOG / NON APERTO

**Stato:** **BACKLOG / NON APERTO** (2026-07-29). Selettori km/mi e m/ft nel pannello Routing, indipendenti da mappa/poligoni. **Nessuna implementazione**.

### TRACK-SAVE-AS-NAME-A — Nome in Salva come traccia — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-07-31). Tip `8a641bc` / `B6.1TSN-A · build 83`. Form inline; Invio/Esc; validazione nome obbligatorio; elevation addon preservato. Review GPT-sostitutiva PASS. Deploy GIS-only PASS. QA «**QA TRACK-SAVE-AS-NAME-A PASS operatore**».

### ROUTING-SUMMARY-DEDUP-A — Riepilogo Routing senza metriche duplicate — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-07-31). Tip storico `58197bb` / `B6.1RSD-A · build 84`. Status solo «Percorso pronto»; card metriche invariate. Deploy GIS-only PASS. QA «**QA ROUTING-SUMMARY-DEDUP-A PASS operatore**». Superseded live da UX-POLISH.

### ROUTING-UX-POLISH-BUNDLE-A (+ FIX1) — Undo / unità / feedback / badge / focus — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-07-31). Catena `7653ee7` build 85 → tip storico `173b6cb` / `B6.2UX-A-FIX1 · build 86`. Undo storico fail-closed; A/B strutturali; unità page-session; badge positioned; feedback punti; focus risultato. Deploy GIS-only PASS. QA «**QA ROUTING-UX-POLISH-BUNDLE-A-FIX1 PASS operatore**». Absorbe POINT-UNDO-A e UNITS-A. Superseded live da APP-BUILD-LABEL.

### APP-BUILD-LABEL-UX-A (+ FIX1) — HUD testuale rimossa + footer stabile — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-07-31). Catena `6de0e98` build 87 → tip `da3397b` / `B6.2BL-A-FIX1 · build 88`. HUD `#gisMapHud` rimossa; footer GIS fixed + riserva dinamica; build solo footer/About. QA FAIL A → FIX1. Deploy GIS-only PASS. QA «**QA APP-BUILD-LABEL-UX-A-FIX1 PASS operatore**».

### ROUTING-PROFILE-EDIT-A — SUPERSEDED / RENAMED — NO RUNTIME

**Stato:** **SUPERSEDED / RENAMED — NO RUNTIME** (2026-08-01). Discovery: operazioni editing (label/pick/drag/GPS/CRUD/reorder/Reverse/Undo) già presenti. **Nessuna implementazione** sotto questo ID; **non** CLOSED/PASS. Residuo → **ROUTING-POINT-COORD-EDIT-A**.

### MAJOR-3-b2 (+ FIX1) — Import Hub Apply + verify persistenza — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-08-01). Catena `4d70bbc` build 97 → tip `cad28e7` / `B6.4IHA-B2-FIX1 · build 98`. Documentale tip `80265c3` (AUTO-VIA; monolite invariato). Blob `ca931d93…` · byte LF **3195195** · SHA-256 LF **`177c9cb1…`**. Apply anteprima additivo all-or-nothing; FIX1 read-back persistenza; Mission Package rifiutato; DELICATO; harness 90/90; review+deploy GIS-only PASS; QA «**QA MAJOR-3-b2 PASS operatore**».

### TRACK-POINT-CENTER-BUTTON-A — Centra per-riga Track Builder — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-08-01). Tip storico `0482ef8` / `B6.3TPC-A · build 96`. Blob `4f121880…` · byte LF **3164587** · SHA-256 LF **`e77ad65e…`**. Pulsante ⌖ per riga; `trackCenterOnPointById` + `gisMapCenterOnLatLon`; ID stabile; ROUTINE; harness 31/31; deploy GIS-only PASS; QA «**QA TRACK-POINT-CENTER-BUTTON-A PASS operatore**». Superseded live da MAJOR-3-b2 tip `cad28e7`. Backlog: [`docs/orchestrator/inbox/2026-07-27_backlog_track-point-center-button.md`](orchestrator/inbox/2026-07-27_backlog_track-point-center-button.md).

### ROUTING-POINT-COORD-EDIT-A (+ FIX1) — Coordinate manuali A/B/intermedi — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-08-01). Catena `f509125` build 94 → tip storico `6475804` / `B6.3RPC-A-FIX1 · build 95`. Blob `a87920fe…` · byte LF **3162728** · SHA-256 LF **`559795bf…`**. CTA «Modifica coordinate»; DD atomici; draft keyed-by-id; clear `source` su commit; FIX1 clear feedback stale. Review PASS; deploy GIS-only PASS; QA «**QA ROUTING-POINT-COORD-EDIT-A PASS operatore**». Piano: [`docs/orchestrator/inbox/2026-08-01_1724_plan_routing-point-coord-edit-a.md`](orchestrator/inbox/2026-08-01_1724_plan_routing-point-coord-edit-a.md). Superseded live da TRACK-POINT-CENTER tip `0482ef8`.

### QA-OPERATOR-IT-ONLY-PREF — QA operatore IT + etichette UI — CLOSED / PASS docs-only

**Stato:** **CLOSED / PASS docs-only** (2026-08-01). Regola D1 OM §4: QA future solo IT (salvo i18n); percorsi = etichette UI visibili («Oggetti GIS», «Import GIS»); vietati nomi tecnici non visibili come percorso QA. Runtime invariato. Deploy non richiesto.

### Oggetti GIS / Workbench — FROZEN

**Stato:** **FROZEN** (2026-08-01). Pannello/pulsante restano; nessun nuovo sviluppo/refactor dedicato; non auto-proporre; solo bug bloccanti / perdita dati / regressioni; nuove idee backlog non aperto senza autorizzazione esplicita.

### TRACK-MODAL-DISPLAY-PREFS-A — Unità e formato coordinate modale Tracce — CLOSED / PASS end-to-end

**Stato:** **CLOSED / PASS end-to-end** (2026-07-30). Tip `1e218a2` / `B6.0TDP-A · build 77`. Review GPT-sostitutiva PASS. Deploy GIS-only PASS. QA «**QA TRACK-MODAL-DISPLAY-PREFS-A PASS operatore**».

### Routing UX post-C (registrati, non aperti)

**Stato:** backlog documentazione post-QA GH-C (2026-07-27). **Non** implementare senza blocco dedicato.

1. **ROUTING-POINT-ACTIVE-BADGE-A** — colorare badge A/B/numerici quando il punto ha coordinate valide; indicatore accessibile non solo colore.
2. **ROUTING-INCOMPLETE-POINT-FEEDBACK-A** — evidenziare riga bloccante e motivo quando Calcola è disabilitato per punto incompleto.
3. **ROUTING-GRADE-METRICS-A** — pendenza media/max % da altimetria (semantica media, smoothing, segmento minimo).
4. **ROUTING-RESULT-FOCUS-A** — dopo calcolo OK, portare pannello ai risultati ed evidenziare card (non su errori/stale).
5. **ROUTING-BLOCKED-ACTION-FEEDBACK-A** — feedback percepibile su Verifica/Calcola bloccati da OPSEC/offline/consenso; distinguere le azioni; aria-live.

### OUTDOOR-ROUTING-API-GATEWAY-A — gateway HTTPS API mondiale — BACKLOG / NON APERTO

**Stato:** **BACKLOG / NON APERTO** (2026-07-25). **Non** WU aperta. **Non** autorizzato.

**Sintesi:** gateway HTTPS server-side futuro per routing API mondiale (HTML standalone → endpoint controllato → provider esterno); chiave **solo** server-side; nessuna API key nel monolite; provider da scegliere (GraphHopper Directions / openrouteservice / compatibili); rivalutazione prima della modalità Online. **INFRA-GH-1A/1B CLOSED**; **OUTDOOR-ROUTING-GH-B2 CLOSED / PASS**; **OUTDOOR-ROUTING-GH-C CLOSED / PASS**.

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
<!-- AUTO-VIA-FOOTER: NON RIMUOVERE -->
> **PROMEMORIA FINALE — AUTO-VIA.** In assenza di una decisione reale da sottoporre all’operatore, procedere direttamente al passo successivo senza chiedere conferme. Non trasformare raccomandazioni tecniche, preferenze già ratificate o gate già risolti in false scelte utente. Il nuovo `vai` si chiede soltanto quando esistono alternative sostanziali che richiedono davvero la scelta dell’operatore.
<!-- /AUTO-VIA-FOOTER -->
