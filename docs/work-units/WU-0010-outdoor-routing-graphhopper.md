
# WU-0010 — Outdoor Routing GraphHopper

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN / Bundle F — **OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1** **AUTOMATED BROWSER QA — FAIL**
**ACTIVE BLOCK:** OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1
**CURRENT GATE:** AUTOMATED BROWSER QA — FAIL
**RUNTIME LIVE:** `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` · build **220** · `OUTDOOR-ROUTING-ORS-PROVIDER-A` · blob `23fe93aae3c7c2c6f32dfdcaab90f2cc827e14a1`
**RUNTIME CANDIDATE:** `105bedf3c0fa4f15f1be0edf4929d19e8842235b` · build **222** · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1` · blob `99233802af29998ee3c0c659d72ffa9db6bbe100` · DEPLOYED VPS · ABQA FAIL
**NEXT:** FIX2 constrained-loop live HTTP (no alternatives on >2 points)
<!-- /WU-HOT-HEADER -->

**Stato:** **OPEN / B1a–E + REVERSE-A + ELEVATION-STYLE-A + TRACK-ELEVATION-PROFILE-A + TRACK-SAVE-AS-NAME-A + ROUTING-SUMMARY-DEDUP-A + ROUTING-UX-POLISH-BUNDLE-A (+ FIX1) + APP-BUILD-LABEL-UX-A (+ FIX1) + TRACK-PROFILE-POINTS-DISPLAY-A + MAP-CENTER-VIEWPORT-AWARE-A (+ FIX1–FIX3) + ROUTING-POINT-COORD-EDIT-A (+ FIX1) + ROUTING-GEOCODING-MULTIROW-A (+ FIX1 + FIX2) + ROUTING-ALTERNATIVE-ROUTES-A (+ FIX1–FIX3) + ROUTING-GEOCODE-SNAP-A + UX-SEARCH-ERROR-FOCUS-A + ROUTING-MODAL-OPEN-EXPANDED-A (+ FIX1) + UI-MODAL-ERROR-FOCUS-A-FIX1 (+ FIX2) + ROUTING-ANDATA-RITORNO-A + ROUTING-ACTION-ROW-UX-A + ROUTING-ANELLO-A (+ FIX1) + OUTDOOR-ROUTING-F-AVOID-AREAS-A (+ FIX1) + OUTDOOR-ROUTING-ORS-PROVIDER-A CLOSED / resto Bundle F futuro / INFRA-GH-1D CLOSED**
**Data pubblicazione piano:** 2026-07-24
**Runtime autorevole attuale:** `f7185823af3028069ff24613151a6ef0209d0966` (`f718582`) — display **`ROUTING-ANELLO-A-FIX1 · build 115`**
**MAJOR-3-b1:** CLOSED / PASS end-to-end (storico tip `1812010`)
**MAJOR-3-b2 (+ FIX1):** **CLOSED / PASS end-to-end** (2026-08-01) — tip storico **`cad28e7`** build 98 / `B6.4IHA-B2-FIX1`; superseded live.
**ROUTING-GEOCODING-MULTIROW-A (+ FIX1 + FIX2):** **CLOSED / PASS end-to-end** (2026-08-02) — tip storico **`1f7c05f`** build 101 / `B6.5RGM-A-FIX2`; superseded live.
**ROUTING-ALTERNATIVE-ROUTES-A (+ FIX1 + FIX2 + FIX3):** **CLOSED / PASS end-to-end** (2026-08-02) — tip storico **`0c078ae`** build 105 / `B6.6AR-A-FIX3`; superseded live.
**ROUTING-GEOCODE-SNAP-A:** **CLOSED / PASS end-to-end** (2026-08-02) — tip storico **`d1e770e`** build 106 / `ROUTING-GEOCODE-SNAP-A`; superseded live.
**UX-SEARCH-ERROR-FOCUS-A:** **CLOSED / PASS end-to-end** (2026-08-02) — tip storico **`0b27e27`** build 107 / `UX-SEARCH-ERROR-FOCUS-A`; superseded live.
**ROUTING-MODAL-OPEN-EXPANDED-A (+ FIX1):** **CLOSED / PASS end-to-end** (2026-08-02) — tip storico **`89a08fb`** build 109 / `ROUTING-MODAL-OPEN-EXPANDED-A-FIX1`; superseded live da **UI-MODAL-ERROR-FOCUS-A-FIX2** (geometria 680/0.98 preservata).
**UI-MODAL-ERROR-FOCUS-A-FIX1 (+ FIX2):** **CLOSED / PASS end-to-end** (2026-08-02) — tip storico **`5fc39e9`** build 111 / `UI-MODAL-ERROR-FOCUS-A-FIX2`; blob `45b9132a…`; byte LF **3293265**; SHA-256 LF **`da5e8f95…`**; catena `6d272d7` (FIX1 · 110) → FIX2; follow-up finding su **UI-MODAL-ERROR-FOCUS-A**; QA FAIL FIX1 → FIX2; Regola H; **superseded live** da **ROUTING-ANDATA-RITORNO-A**.
**ROUTING-ANDATA-RITORNO-A:** **CLOSED / PASS end-to-end** (2026-08-03) — tip storico **`c1a6c89`** build 112 / `ROUTING-ANDATA-RITORNO-A`; blob `0d8824e0…`; byte LF **3308964**; SHA-256 LF **`71f7bb1b…`**; due POST `/route` sequenziali out-and-back; session-only `routeMode`; DELICATO; review PASS PRE-DEPLOY; deploy+QA PASS; Regola H; **superseded live** da **ROUTING-ACTION-ROW-UX-A**.
**ROUTING-ACTION-ROW-UX-A:** **CLOSED / PASS end-to-end** (2026-08-03) — tip storico **`dde5156`** build 113 / `ROUTING-ACTION-ROW-UX-A`; blob `e999cafe…`; byte LF **3309352**; SHA-256 LF **`53293444…`**; action strip unificata mode+actions; ROUTINE; harness 28/28; deploy+QA PASS; Regola H; **superseded live** da **ROUTING-ANELLO-A-FIX1**.
**ROUTING-ANELLO-A (+ FIX1):** **CLOSED / PASS end-to-end** (2026-08-03) — tip **`f718582`** build 115 / `ROUTING-ANELLO-A-FIX1`; catena `4135737` (114) → FIX1; blob `0ffb7b34…`; byte LF **3347642**; SHA-256 LF **`0513e768…`**; `round_trip` multi-seed + `ch.disable`; FIX1 re-gate/timeout/antimeridiano; DELICATO; review FIX1 PASS; deploy+QA PASS; Regola H.
**OUTDOOR-ROUTING-F-AVOID-AREAS-A (+ FIX1):** **CLOSED / PASS end-to-end** (2026-08-18) — catena `12a7477` build 218 → tip **`5477a5e`** FIX1 build 219; blob `a823ae9b…`; byte LF **10537443**; SHA-256 LF **`eb7a8aa0…`**; aree da evitare `custom_model` + draw lifecycle; FIX1 preserve `algorithm`/alternative/round_trip con avoid; DELICATO; REVIEW GPT-SOSTITUTIVA PASS; deploy+ABQA+QA operatore PASS; Regola H. Evidence: [`2026-08-18_0130_outdoor-routing-f-avoid-areas-a-fix1-deploy-qa.md`](../orchestrator/inbox/2026-08-18_0130_outdoor-routing-f-avoid-areas-a-fix1-deploy-qa.md).
**OUTDOOR-ROUTING-ORS-PROVIDER-A:** **CLOSED / PASS end-to-end** (2026-08-18) — catena `2687873` build 220 HTML → FIX1 infra **`cfee0e4`**; blob `23fe93aa…`; byte LF **10562488**; SHA-256 HTTP **`67d86081…`**; provider ORS opt-in (mai Auto); gateway HTTPS Tailscale; secret server-side; hiking/MTB/alternative/OOB/anello/avoid; DELICATO; REVIEW GPT-SOSTITUTIVA PASS; deploy+ABQA+QA operatore PASS; Regola H. Evidence: [`2026-08-18_0508_outdoor-routing-ors-provider-a-deploy-abqa.md`](../orchestrator/inbox/2026-08-18_0508_outdoor-routing-ors-provider-a-deploy-abqa.md).
**OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A:** **QA operatore FAIL SCOPED** (2026-08-18) — candidate **221** `1a5e971` deploy+ABQA PASS; FAIL UX + Anello vincolato → **FIX1**.
**OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1:** **AUTOMATED BROWSER QA — FAIL** (2026-08-18) — REVIEW GPT-SOSTITUTIVA **PASS** · deploy GIS **PASS** (`105bedf` / **222** / blob `99233802…`) · ABQA desktop 18 FAIL: anello con VIA live HTTP 400 (`alternative_route` / `alternative_routes` su >2 punti). LIVE FRONTIER resta **220**. Evidence: [`2026-08-18_1510_outdoor-routing-f-provider-compare-a-fix1-deploy-abqa.md`](../orchestrator/inbox/2026-08-18_1510_outdoor-routing-f-provider-compare-a-fix1-deploy-abqa.md).
**Review upstream GLM:** **PASS CON CORREZIONI** — 3 correzioni bloccanti registrate qui sotto
**B1a (+ FIX1 + FIX2):** **CLOSED / PASS end-to-end** (shell no-map; tip `d95f745` build 54)
**B1b (+ FIX1):** **CLOSED / PASS end-to-end** (pick/marker/GPS + disarmo BBOX; tip `3a702e1` build 56)
**B2 operativo:** GraphHopper endpoint / richiesta `/route` / preview transiente — **CLOSED / PASS end-to-end** (catena `42b01b3`→`feb1eb3`→tip `89bbf28` build 62; blob `83da60d9…`; endpoint `http://100.114.7.53:8989`; review GPT-sostitutiva pre-deploy PASS; deploy+QA PASS 2026-07-27). Superseded live da **C** → **D** → **E** → **REVERSE-A** → **TRACK-MODAL** → **ELEVATION-STYLE-A**.
**C (+ FIX1):** provider Local/VPS/Auto + `/info` + consenso loopback — **CLOSED / PASS end-to-end** (catena `61b5b34` build 63 → tip `dd9ad2f` FIX1 build 64; blob `a650c1c6…`; review GLM PASS + GPT-sostitutiva FIX1 PASS; deploy+QA PASS 2026-07-27).
**D (+ FIX1):** Salva percorso corrente come traccia — **CLOSED / PASS end-to-end** (catena `c806099` build 65 → tip `567b611` FIX1 build 66; blob `4f679f5b…`; review GPT-sostitutiva D+FIX1 PASS; deploy+QA PASS 2026-07-28).
**INFRA-GH-1D (VPS elevation V3):** **CLOSED / PASS end-to-end** (2026-07-29) — graph live `nord-ovest-B-v3-elev`; bilinear+ramer max_elevation 5; QA «**QA INFRA-GH-1D-EXEC-C PASS operatore**»; V0+backup trattenuti; **finito Regola H** (correzione coda EXEC-C). Gate: `PASS INFRA-GH-1D-EXEC-C — V3 ADOTTATA E QA PASS`.
**E (+ FIX1–FIX8):** profilo altimetrico + difficoltà + sync mappa + locale numerico — **CLOSED / PASS end-to-end** (catena `e3cf114`…→ tip `e7d9398` FIX8 build 75; blob `df09e9dc…`; review GPT-sostitutiva E+FIX1–FIX8 PASS; deploy FIX8+QA PASS 2026-07-29).
**REVERSE-A:** Inverti percorso — **CLOSED / PASS end-to-end** (tip `d54c915` build 76 / `B6.0R-A`; blob `5c79d266…`; deploy+QA PASS 2026-07-29).
**TRACK-MODAL-DISPLAY-PREFS-A:** unità/formato display modale Tracce — **CLOSED / PASS end-to-end** (tip `1e218a2` build 77 / `B6.0TDP-A`; blob `8ef3e171…`; review GPT-sostitutiva PASS; deploy+QA PASS 2026-07-30).
**ELEVATION-STYLE-A:** restyle visuale profilo altimetrico — **CLOSED / PASS end-to-end** (tip `d28bc44` build 78 / `B6.0ES-A`; blob `e9ae353…`; deploy+QA PASS 2026-07-30; Regola H). Superseded live da **TRACK-ELEVATION-PROFILE-A**.
**TRACK-ELEVATION-PROFILE-A (+ FIX1–FIX3):** profilo altimetrico Saved Track — **CLOSED / PASS end-to-end** (tip storico `1fc9d70` build 82 / `B6.1TP-A-FIX3`; superseded live da **TRACK-SAVE-AS-NAME-A**).
**TRACK-SAVE-AS-NAME-A:** nome editabile inline prima di «Salva come traccia» — **CLOSED / PASS end-to-end** (tip storico `8a641bc` build 83 / `B6.1TSN-A`; superseded live da **ROUTING-SUMMARY-DEDUP-A**).
**ROUTING-SUMMARY-DEDUP-A:** riga stato solo «Percorso pronto» — **CLOSED / PASS end-to-end** (tip storico `58197bb` build 84 / `B6.1RSD-A`; superseded live da UX-POLISH).
**ROUTING-UX-POLISH-BUNDLE-A (+ FIX1):** undo storico / unità session / feedback / badge / focus — **CLOSED / PASS end-to-end** (catena `7653ee7` build 85 → tip `173b6cb` build 86 / `B6.2UX-A-FIX1`; blob `9686245e…`; byte LF **3150227**; SHA-256 LF **`4c197243…`**; deploy+QA PASS 2026-07-31; Regola H). Absorbe **POINT-UNDO-A** e **UNITS-A**.
**APP-BUILD-LABEL-UX-A (+ FIX1):** HUD testuale rimossa + footer stabile — **CLOSED / PASS end-to-end** (tip storico `da3397b` build 88 / `B6.2BL-A-FIX1`; superseded live da TPD-A).
**TRACK-PROFILE-POINTS-DISPLAY-A:** overlay punti Saved Track in sola apertura Profilo (max 120, distance-decimated) — **CLOSED / PASS end-to-end** (tip storico `3838e9e` build 89 / `B6.2TPD-A`; superseded live da **MAP-CENTER**).
**MAP-CENTER-VIEWPORT-AWARE-A (+ FIX1–FIX3):** Centra viewport-aware (usable rect + costi normalizzati) — **CLOSED / PASS end-to-end** (tip storico `d0688ea` build 93 / `B6.2MCV-A-FIX3`; superseded live da **ROUTING-POINT-COORD-EDIT-A**).
**ROUTING-PROFILE-EDIT-A:** **SUPERSEDED / RENAMED — NO RUNTIME** (2026-08-01) — discovery: editing base già presente; nessuna implementazione sotto questo ID; residuo → **ROUTING-POINT-COORD-EDIT-A**.
**ROUTING-POINT-COORD-EDIT-A (+ FIX1):** **CLOSED / PASS end-to-end** (2026-08-01) — tip `6475804` build 95 / `B6.3RPC-A-FIX1`; blob `a87920fe…`; byte LF **3162728**; SHA-256 LF **`559795bf…`**; CTA «Modifica coordinate»; DD atomici; FIX1 clear feedback stale; review+deploy+QA PASS; Regola H. Piano: [`docs/orchestrator/inbox/2026-08-01_1724_plan_routing-point-coord-edit-a.md`](../orchestrator/inbox/2026-08-01_1724_plan_routing-point-coord-edit-a.md). Bundle F resta futuro e separato.
**Backlog UX:** **QA-OPERATOR-IT-ONLY-PREF CLOSED / PASS docs-only** (2026-08-01). **Oggetti GIS FROZEN**. **ROUTING-GEOCODING-MULTIROW-A (+ FIX1 + FIX2) CLOSED**. **ROUTING-ALTERNATIVE-ROUTES-A (+ FIX1–FIX3) CLOSED**. **ROUTING-GEOCODE-SNAP-A CLOSED**. **ROUTING-SEARCH-UX-A CLOSED** (nel bundle UX-SEARCH-ERROR-FOCUS-A). **UI-MODAL-ERROR-FOCUS-A CLOSED** + **FIX1/FIX2 CLOSED**. **UX-SEARCH-ERROR-FOCUS-A CLOSED / PASS end-to-end**. **ROUTING-MODAL-OPEN-EXPANDED-A (+ FIX1) CLOSED / PASS end-to-end**. **ROUTING-ANDATA-RITORNO-A CLOSED / PASS end-to-end**. **ROUTING-ACTION-ROW-UX-A CLOSED / PASS end-to-end**. **ROUTING-ANELLO-A (+ FIX1) CLOSED / PASS end-to-end**. **OUTDOOR-ROUTING-F-AVOID-AREAS-A (+ FIX1) CLOSED / PASS end-to-end**. **OUTDOOR-ROUTING-ORS-PROVIDER-A CLOSED / PASS end-to-end**. **OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1 REVIEW GPT-SOSTITUTIVA — PENDING** (candidate 222).
**Infrastruttura prerequisito:** [`WU-0011 — INFRA-GH-1A + INFRA-GH-1B`](WU-0011-infra-gh-1a-graphhopper-local-poc.md) — **CLOSED / PASS**; **INFRA-GH-1D** — **CLOSED / PASS** (vedi [`INFRA_VPS.md`](../INFRA_VPS.md)).
**Nota numerazione storica:** la sezione §5 «BUNDLE B2 — Cerca/geocoding multi-riga» è una **numerazione storica superseded**. Il geocoding multi-riga è stato chiuso come **ROUTING-GEOCODING-MULTIROW-A (+ FIX1 + FIX2)** (tip `1f7c05f`). La modalità **Online/gateway** non è cancellata: è rinviata a **OUTDOOR-ROUTING-API-GATEWAY-A** (**BACKLOG / NON APERTO**, vedi §6) — nessuna WU numerata aperta per il gateway.

> Questa WU è la **fonte di piano dedicata** per il programma Outdoor Routing GraphHopper. Implementazione e chiusura avvengono nei singoli bundle; lo stato operativo vivo resta in `docs/OPERATING_MEMORY.md` §7.

---

## 1. Scopo del programma

Realizzare un **planner outdoor dedicato**, principalmente a:

- **Hiking**
- **Hiking facile**
- **MTB Touring**
- **MTB Trail**

**Provider iniziale:** **GraphHopper**.

**Modalità previste:**

- **Automatico**
- **Locale / offline** (GraphHopper loopback)
- **VPS tramite Tailscale**
- **Online tramite gateway**

**Ordine Auto iniziale:**

1. Locale
2. VPS Tailscale
3. Online
4. errore controllato

**L'endpoint effettivamente usato** deve essere sempre mostrato all'operatore (in pannello, transiente).

---

## 2. Decisioni UX ratificate

- Pannello floating dedicato
- Lista ordinata **A / passaggi / B**
- **ID dei punti stabili** e indipendenti dall'indice
- **Massimo iniziale 20 punti** complessivi
- Riordino tramite handle
- Comandi accessibili **Sposta su / Sposta giù**
- Campi indirizzo separati per ogni punto
- **Click mappa** per assegnare un punto
- **Marker temporanei trascinabili**
- **GPS single-shot** soltanto su comando esplicito
- **Nessun GPS automatico**
- **Nessun live tracking**
- Ricalcolo soltanto alla fine di una modifica
- Profilo altimetrico previsto (Bundle E)
- Difficoltà stimata e spiegabile (Bundle E)
- Preview prima del salvataggio canonico (Bundle D)

---

## 3. Stato transiente — contratto di piano

Stato planner: **`state._routing`**.

**Vincolo:** deve restare **session-only** e **non entrare in `saveStore`**.

Shape concettuale:

- `points[]` — lista punti A/passaggi/B
- `pickMode` — true quando il prossimo click mappa (no-drag) imposta un punto
- `pickTargetId` — id del punto che il prossimo click mappa imposta
- `markerDrag` — stato drag marker in corso (`{ pid, id, ... }`)
- `listReorderDrag` — id durante drag HTML5 lista
- `panelOpen` — visibilità pannello
- `provider` — `"auto" | "local" | "vps" | "online"`
- `resolvedEndpoint` — endpoint risolto per l'ultima richiesta (mostrato all'operatore)
- `activityProfile` — profilo attività (hiking / hiking facile / MTB touring / MTB trail)
- `requestGeneration` — token monotono per request stale (Bundle C)
- `abortController` — `AbortController` per richiesta GraphHopper in corso (Bundle C)
- `alternatives` — alternative restituite (Bundle C/F)
- `selectedAlternative` — alternativa scelta (Bundle C/F)
- `lastResult` — snapshot route risultato, transient
- `elevationProfile` — profilo altimetrico (Bundle E)
- `difficultySummary` — difficoltà stimata (Bundle E)
- `dirty` — ricalcolo pendente dopo modifica conclusa
- `error` — stato errore in-pannello (`aria-live`)
- `loopbackConsent` — consenso esplicito routing loopback in forced-offline (Bundle C; chiave transiente, default `false`, non usata in B)

**Vincoli di scrittura canonica:**

- **Nessuna** scrittura in `state.mapWaypoints`
- **Nessuna** scrittura in `state.savedTracks`
- **Nessuna** scrittura in `state.gisPolygons`
- **Nessuna** scrittura in `state.track`
- **Nessuna** persistenza prima del Bundle D

---

## 4. Correzioni bloccanti della review GLM (obbligatorie)

Le tre correzioni sono **vincolanti per ogni futuro bundle runtime** di questo programma.

### Correzione 1 — Guardia interazioni mappa

`workbenchMapInteractionBlocked()` deve essere **estesa**, non sostituita.

Il futuro **Bundle B1** deve aggiungere soltanto le condizioni necessarie per:

- `state._routing.pickMode`
- `state._routing.markerDrag`

**Non creare una seconda guardia parallela.**

Gli altri pick-mode devono **disarmare il routing pick-mode** e viceversa (disarmo reciproco via la stessa guardia centrale, pattern già usato da `trackSyncPickModeUi` e attivatori WP/Track/Polygon/RangeRings/Convert/Astro/Measure/Bbox).

### Correzione 2 — Pick mappa

Il pick routing deve essere integrato come **nuovo ramo nello stesso `attachPanHandlers.onUp`**.

Il ramo deve:

- verificare `!drag.moved`
- rispettare `trackBrushYieldsPan()`
- rispettare `state._bboxSelecting`
- rispettare `CTRL_SEL` (lista selettori toolbar/handle)
- **non** aggiungere un nuovo listener `click` su `tileMap`
- **non** introdurre pan concorrente

Pattern di riferimento: ramo `rangeRingsPickAndCreateMode` già presente in `attachPanHandlers.onUp`.

### Correzione 3 — Geocoding

Ogni futura chiamata planner a:

```js
geocodeSearch(...)
```

deve essere preceduta da un controllo esplicito:

```js
if (!geocodingAllowed()) { /* fallback offlineForwardSearch */ }
```

In caso di gate negato, offline o errore deve essere usato:

```js
offlineForwardSearch(...)
```

**Non modificare:**

- `geocodeSearch`
- `offlineForwardSearch`
- `geocodingAllowed`
- `isEffectivelyOnline`
- gate OPSEC esistenti

---

## 5. Split B1 + B2 (ratificato)

Il precedente Bundle B viene **diviso**. La review GLM raccomanda fermamente **B1 + B2** per ragioni strutturali del monolite: il Cerca esistente è single-input + single-results; un adapter multi-riga è codice nuovo che parla con `geocodeSearch`/`offlineForwardSearch`, non riuso del widget Cerca.

### BUNDLE B1 — Planner UI no-route

> **Split operativo eseguito:** **B1a** (shell no-map) **CLOSED** tip `d95f745` build 54; **B1b** (pick + marker + GPS) **CLOSED** tip `3a702e1` build 56; prossimo **B2**.

**Scope originale B1 (piano):**

- Pannello floating dedicato
- Stato transiente (`state._routing`)
- Lista punti A / passaggi / B
- ID stabili
- Aggiunta/eliminazione punti
- Riordino lista
- Pulsanti accessibili Su/Giù
- Pick dalla mappa (ramo in `attachPanHandlers.onUp`, Correzione 2) — **B1b**
- Marker temporanei — **B1b**
- Drag marker (Pointer Events, vedi §9) — **B1b**
- GPS single-shot (Correzione di method, vedi §11) — **B1b**
- Cleanup idempotente (Esc / chiusura / disarmo)
- i18n IT/EN (FR congelato)
- Build: B1a **52→54** (con FIX1/FIX2); B1b userà build successiva

**B1a landed (CLOSED):** pannello + lista + label editabili + CTA/menu GraphHopper (no rete) + minimize/resize GIS; zero mappa/GPS/geocode/GraphHopper network.

**Esclusioni (B1a e B1b shell):**

- Nessun geocoding (B2)
- Nessuna chiamata GraphHopper `/info`/`/route` (C)
- Nessuna configurazione endpoint (C)
- Nessun salvataggio canonico (D)
- Nessuno storage
- Nessun profilo altimetrico (E)

**Classificazione:** **DELICATO** (B1a lifecycle pannello; B1b lifecycle pick/drag mappa).

**Review downstream pre-deploy:** **obbligatoria**.

**Target diff B1 originale:** 350–500 righe → split B1a/B1b sotto soglia di arresto 650.

### BUNDLE B2 — Cerca/geocoding multi-riga

> **Numerazione storica superseded (2026-07-25).** Il **B2 operativo vivo** (OM §7 / HANDOFF) è **GraphHopper endpoint / `/route` / preview** — **CLOSED / PASS end-to-end** tip `89bbf28` build 62. Il contenuto sotto resta piano storico per un **backlog geocoding multi-riga separato** — **non** fa parte di INFRA-GH-1A/1B e **non** è il B2 operativo chiuso.

**Scope:**

- Adapter per ciascuna riga (risultati isolati)
- Debounce (~250 ms indicativo)
- Stale-token monotono per riga
- `geocodingAllowed()` esplicito prima di ogni `geocodeSearch` (Correzione 3)
- `geocodeSearch` solo quando consentito
- `offlineForwardSearch` come fallback (OPSEC strict / offline / errore)
- Nessun endpoint nuovo
- Build bump futuro **52 → 53**

**Esclusioni:**

- Nessuna modifica a `geocodeSearch` / `offlineForwardSearch` / `geocodingAllowed` / `isEffectivelyOnline`
- Nessun secondo geocoder
- Nessuna modifica al Cerca esistente

**Classificazione:** **DELICATO** per geocoding e gate rete esistenti.

**Review downstream pre-deploy:** **obbligatoria**.

**Target diff:** 200–350 righe.

**Soglia di arresto:** oltre 450 righe rivalutare split B2a (adapter core + gate) / B2b (autocomplete dropdown UI).

---

## 6. Bundle successivi (scope futuro, sintetico)

### OUTDOOR-ROUTING-API-GATEWAY-A — gateway HTTPS API mondiale (**BACKLOG / NON APERTO**)

**Stato:** **BACKLOG / NON APERTO** (registrato 2026-07-25). **Nessuna implementazione autorizzata.** Nessuna WU numerata aperta. **Non** interrompe [`WU-0011 / INFRA-GH-1A`](WU-0011-infra-gh-1a-graphhopper-local-poc.md).

**Obiettivo futuro:** piccolo gateway HTTPS server-side che custodisce la chiave di un’API di routing **mondiale** e inoltra le richieste dal file HTML standalone (PC e cellulari):

`HTML standalone → endpoint HTTPS controllato → API esterna mondiale → risposta normalizzata al planner GIS`

**Evita:** API key nel monolite; GraphHopper installato sul dispositivo; distribuzione graph-cache; VPS con molta RAM per il grafo mondiale; CORS diretto browser↔provider; esposizione incontrollata della quota.

**Provider da confrontare (nessuno scelto):** GraphHopper Directions API; openrouteservice API; eventuali provider outdoor-compatibili. Riferimenti open source da studiare (licenza, termini, API — senza copiare codice alla cieca): GNOME Maps, WTracks, Obsidian Map View, openrouteservice-app, client ufficiali GraphHopper.

**Vincoli strategici:** nessuna API key nel HTML; gateway minimo/stateless (salvo rate-limit/cache ammessa); HTTPS obbligatorio; endpoint configurabile; nessuna chiamata al boot; richieste solo su comando operatore; errori controllati; provider usato mostrato nel planner; fallback futuro Locale → VPS → gateway; HTML standalone; i18n IT/EN (FR congelato).

**Nessun legame obbligatorio** con la graph-cache locale/VPS. Online/gateway di B2 **non cancellato**: rinviato qui. Rivalutazione dopo PASS INFRA-GH-1A oppure prima di implementare Online in B2.

**Questioni aperte prima di qualsiasi apertura:** provider; quota/costi; licenza/ToS; profili hiking/MTB; elevation/alternative; formato API; hosting; stack già sul VPS; auth/token app; rate-limit; anti-abuso; logging senza dati sensibili inutili; cache consentita; mobile; offline/fallback; dominio+certificato HTTPS.

**OUTDOOR-ROUTING-ORS-PROVIDER-A (2026-08-18):** **CLOSED / PASS end-to-end** — tip LIVE **`cfee0e4`** build **220**; HTML `2687873` blob `23fe93aa…`; FIX1 infra LoadCredential; REVIEW GPT-SOSTITUTIVA PASS; deploy GIS-only + ABQA A–P + QA operatore PASS; Regola H. Evidence: [`2026-08-18_0508_outdoor-routing-ors-provider-a-deploy-abqa.md`](../orchestrator/inbox/2026-08-18_0508_outdoor-routing-ors-provider-a-deploy-abqa.md).

### BUNDLE C — GraphHopper provider Local/VPS/Auto — **CLOSED / PASS end-to-end**

**Stato:** **CLOSED / PASS end-to-end** (2026-07-27). Tip runtime **`dd9ad2f`** build **64** / `B6.0C-FIX1` (base C `61b5b34` build 63 + FIX1 init A/B).

**Landed:**

- Endpoint Locale `http://127.0.0.1:8989` / VPS `http://100.114.7.53:8989` (Online **non** in C — resta **OUTDOOR-ROUTING-API-GATEWAY-A**)
- Modalità Auto (ordine Locale → VPS → errore controllato; nessun Online)
- `/info` (Verifica provider + resolve Auto)
- POST `/route` (una sola dopo resolve; payload B2 invariato)
- `AbortController` + sequence anti-stale
- Timeout `/info` ~3s / `/route` 20s
- Consenso loopback session-only; OPSEC fail-closed; forced-offline scoped
- Endpoint effettivo mostrato read-only
- FIX1: init planner soli A/B (nessun via automatico)
- **Nessuna API key nel monolite**; nessuna persistenza route

**Classificazione:** **DELICATO** (rete/OPSEC). Review GLM PASS; QA estesa PASS.

**Backlog UX (non implementato in C):** ROUTING-POINT-ACTIVE-BADGE-A; ROUTING-INCOMPLETE-POINT-FEEDBACK-A; ROUTING-GRADE-METRICS-A; ROUTING-RESULT-FOCUS-A; ROUTING-BLOCKED-ACTION-FEEDBACK-A.

### BUNDLE D — Salva come traccia — **CLOSED / PASS end-to-end**

**Stato:** **CLOSED / PASS end-to-end** (2026-07-28). Tip runtime **`567b611`** build **66** / `B6.0D-FIX1` (base D `c806099` build 65 + FIX1 harden).

**Landed:**

- CTA `#routingSaveAsTrackBtn` in `.routing-panel-actions` (secondaria; primary resta Calcola)
- Predicato `routingRoutePreviewIsValid` (preview ≥2 + fail-closed su `requestLoading`/`infoLoading`)
- Sequenza transazionale `routingPerformSaveAsTrack`: snapshot `STORAGE_KEY` + selezione → `savedTrackAddFromPoints` → `saveStoreReported` → `trackVerifyPersistedSavedTrack` → rollback mirato su fail
- Auto-name `trackMakeAutoName` (nessun dialog nome)
- Lock modulo `_routingSaveBusy`; guardia doppio clic `Number(ev.detail) > 1` (FIX1)
- Snapshot `localStorage.getItem` diretto fail-closed (FIX1; niente IIFE swallow)
- Refresh `renderSavedTracksList` + `refreshTileMapForTrackUi` + `renderWorkbenchList` se aperto
- i18n IT/EN (`routing.saveAsTrack*`, `tip.routingSaveAsTrack`); FR congelato
- **Nessuna** rete aggiuntiva; **nessun** nuovo campo persistito; draft/`mapWaypoints`/GIS store intatti

**Classificazione:** **DELICATO** (cache/storage + create-path caller). Review GPT-sostitutiva D PASS (3 finding → FIX1); review FIX1 PASS / GO DEPLOY; deploy GIS-only PASS; QA «**QA OUTDOOR-ROUTING-GH-D PASS operatore**».

### BUNDLE E — Altimetria e difficoltà

**Stato:** **CLOSED / PASS end-to-end** (2026-07-29) — tip `e7d9398` / `B6.0E-FIX8 · build 75`.

**Landed:**

- Grafico **SVG vanilla** (quota/distanza; gap-safe)
- Pendenza / Dislivello ± filtrati (bucket mediana 25 m; deadband 3 m su ascent/descent filtrati; autorità `filterAvailable`)
- Difficoltà stimata 0–100 spiegabile (pesi `/4.7`)
- Sincronizzazione mappa ↔ profilo (pointer ownership; marker SVG su preview; FIX7 GIS guards)
- Velocità media → Tempo stimato (no refetch)
- Formattatori quota sempre metri; distanza `X,Ykm` / `X.Ykm` via locale IT/EN/FR (FIX8 preserva `state.lang`)
- Dark/light + mobile; gestione quote mancanti/spike (FIX1+)

**QA FAIL registrati (chiusi):**

1. **Altimetrico/pointer** (post deploy FIX4 `166f1c4`) → FIX5–FIX7
2. **Locale numerico IT** (post deploy FIX7 `8ea0938`, forma `3.8km`) → FIX8

**Review finale:** PASS REVIEW GPT-SOSTITUTIVA OUTDOOR-ROUTING-GH-E + FIX1–FIX8.

**Vincoli rispettati:** nessuna libreria runtime esterna; nessuna modifica a sanitizer/storage/CRUD.

**Fuori scope Bundle E (storico):** unità dedicate planner (**OUTDOOR-ROUTING-UNITS-A**, ancora backlog); profilo su tracce salvate (**TRACK-ELEVATION-PROFILE-A** — **ora CLOSED** tip `1fc9d70`); undo punti (**OUTDOOR-ROUTING-POINT-UNDO-A**, ancora backlog).

### BUNDLE F — Funzioni avanzate

**Scope futuro:**

- Alternative
- Andata/ritorno
- Round trip
- Avoid areas
- Confronto futuro fra provider

---

## 7. Politica loopback ratificata (Bundle C)

**Scelta:** forced-offline consente routing loopback **soltanto** tramite opzione esplicita nel pannello Routing.

**Requisiti futuri:**

- Consenso **default OFF**
- Consenso **per-sessione** (transiente, non persistito)
- Solo **endpoint loopback validato**
- Host considerati loopback: **`localhost`** e **`127.0.0.1`** (eventualmente con porta)
- **Nessun altro host** considerato loopback
- **Nessun bypass silenzioso** di forced-offline
- **Nessuna API key nel monolite** HTML
- **Nessun health check al boot generale** (coerente OPSEC, no rete silenziosa)

Gli endpoint configurabili potranno essere persistiti in un blocco futuro dedicato, ma **credenziali e API key devono restare fuori dal file HTML**.

---

## 8. Regioni runtime previste per B1 (autorizzabili)

Documentate come regioni future; il runtime B1 non è ancora iniziato.

- `state` defaults transiente vicino a `_polyEdit` (nuova chiave `_routing`)
- `attachPanHandlers.onUp` (nuovo ramo pick routing, Correzione 2)
- `workbenchMapInteractionBlocked` (estensione +2 condizioni, Correzione 1)
- Helper routing (pick/drag/cleanup/reorder) vicino agli helper drag mappa esistenti (`mapWptDocDrag`, `mapTrackDocDrag`, `mapRrCenterDocDrag`, `mapPolyEditDocDrag`, `mapPolyMoveDocDrag`)
- HTML pannelli GIS floating (nuovo `<dialog class="app-modal">` per routing)
- CSS routing-specifico (handle, drag affordance, minimo)
- Toolbar Tracce/GIS (nuova CTA routing se prevista)
- i18n IT/EN (nuove chiavi `routing.*`)
- `APP_BUILD_NUM` (bump 51 → 52)

## 9. Regioni da NON toccare in B1/B2

- Sanitizer GIS (`gisSanitizeFeature` / `gisSanitizeGeometry` / `gisSanitizeProperties`)
- Parser import (`spatialTextToFeatureCollection` e sub-parser gpx/kml/geojson)
- `saveStore` / `loadStore` / `localStorage` / write `IndexedDB`
- Dati canonici (`state.mapWaypoints`, `state.savedTracks`, `state.gisPolygons`, `state.track`)
- `geocodeSearch`, `offlineForwardSearch`, `reverseGeocode`, `nominatimQuery`
- `geocodingAllowed`, `isEffectivelyOnline`, `tileFetchAllowed`
- Drop globale (`bindDragDrop`, `bindGlobalSpatialDropOnce`, `waypointImportDropZone`, paste dropzone)
- Import Hub (`#wbImportHub`)
- Mission Package (`#wbExportHub` mission package export)
- Cache/tile (hydrate/fetch paths)
- Proxy (Planet-Clone, Navionics)
- OPSEC strict gate
- Workbench non correlato (pick WP/Track/Polygon MAJOR-5A2)

---

## 10. Contratto punti e ID

**Formato ID:** stabile per tutta la durata della sessione planner.

- Pattern coerente con `uidNamed`: prefisso dedicato routing (es. `"rt"` + timestamp base36 + random base36 breve)
- L'ID **non cambia** dopo riordino, drag, modifica coordinate, cambio source, rename label
- L'ID **viene rimosso** solo quando l'utente cancella il punto (prune + render)
- Un nuovo punto ottiene sempre un nuovo ID

**Struttura punto (concettuale):**

```
{
  id: "<stable>",
  kind: "start" | "via" | "end",   // derivato dalla posizione, non identità persistente
  lat: <finite number>,
  lon: <finite number>,
  label: "<string>",
  source: "manual" | "map" | "gps" | "geocode",
  geocodeToken: <monotonic>        // per stale detection (B2)
}
```

**`kind` derivato dalla posizione:**

- Prima riga → `start`
- Ultima riga → `end`
- Righe interne → `via`

Riordinare può cambiare il `kind` di un punto (es. spostare in fondo promuove a `end`). `kind` **non** è identità persistente.

`lat`/`lon` sempre `Number.isFinite` validate; `null`/`NaN` non ammessi (rifiuta inserimento).

---

## 11. Drag marker — vincolo tecnico

- **Pointer Events** (non mouse-only)
- Listener `pointermove` / `pointerup` / `pointercancel` su `document` in **capture phase** (`true`)
- `pointerId` check
- RAF per il rendering
- Cleanup **idempotente** (chiamarlo due volte non fa danno)
- Pattern coerente con `mapWptDocDrag`, `mapTrackDocDrag`, `mapRrCenterDocDrag`, `mapPolyEditDocDrag`, `mapPolyMoveDocDrag`
- Marker handle inserito in `CTRL_SEL` (così `attachPanHandlers` non intercetta)
- **Niente pan concorrente** (handle dedicato)
- `pointercancel` **ripristina l'ultima coordinata confermata**

Helper consigliati: `mapRoutingMarkerDocDrag` + `mapRoutingMarkerDocDragCleanup`.

## 12. Riordino lista — vincolo tecnico

- **HTML5 `draggable=true`** solo come supporto mouse
- **Comandi Su/Giù obbligatori** per touch/tastiera/accessibilità (pulsanti + `↑`/`↓` con focus + `Delete` per rimuovere)
- **ID invariati** dopo riordino
- Prima riga derivata come `start`
- Ultima riga derivata come `end`
- Righe interne derivate come `via`
- `kind` derivato dalla posizione, **non come identità persistente**
- Ricalcolo soltanto al drop o al comando concluso (non durante drag)

## 13. Cerca B2 — vincolo tecnico

- Adapter **async** per riga
- `offlineForwardSearch` è **asincrono e IDB-backed** (chiama `loadOfflineCities`)
- Debounce indicativo **250 ms**
- Token monotono per riga (stale detection)
- Risultati separati per riga
- Dropdown separati per riga
- Callback stale ignorate
- Nessun secondo geocoder
- Nessuna modifica al Cerca esistente

## 14. GPS — vincolo tecnico

- `getCurrentPosition` soltanto (single-shot)
- **Mai** `watchPosition`
- Azione **esplicita** (pulsante "Usa posizione corrente")
- Secure-context check (`window.isSecureContext`): se false, pulsante disabled + tooltip
- Timeout/error in area `aria-live` del pannello (non globale)
- **GPS e pick-mode si disarmano reciprocamente** (l'azione GPS chiama `routingExitPickMode()`)

---

## 15. Profilo altimetrico (Bundle E) — vincoli di piano

- **SVG o canvas vanilla** — preferenza **SVG**
- Nessuna libreria runtime esterna
- Asse X: distanza cumulativa
- Asse Y: quota
- Pendenza per segmento
- Tooltip/crosshair
- Sincronizzazione con posizione sulla mappa
- Dark/light
- Mobile
- Unità metriche/imperiali
- Gestione quote mancanti e spike

## 16. Difficoltà (Bundle E) — vincoli di piano

- Livelli: **facile / moderata / difficile / molto difficile**
- **Sempre marcata come stima**
- **Nessuna** classificazione se i dati sono insufficienti
- Warning separati (cumulativi + tratti critici)
- Tratti critici evidenziabili
- **Nessuna** comunicazione di garanzia di sicurezza

---

## 17. i18n

- Nuove chiavi **solo IT/EN**
- **Francese congelato** (governance OM §7 2026-06-25)
- **Nessun backfill FR**
- Fallback FR → EN

---

## 18. Test matrix

### B1

| # | Test | Esito atteso |
|---|---|---|
| B1.1 | Apertura/chiusura pannello | render corretto, transient, niente persistenza |
| B1.2 | A + B e più passaggi | ID stabili, lista corretta |
| B1.3 | Cap 20 punti | 21° bloccato, messaggio in-pannello |
| B1.4 | Pick A / via / B dalla mappa | coord settate, marker appare |
| B1.5 | Click vs drag mappa | drag = pan mappa, click no-drag = pick |
| B1.6 | Drag marker | marker segue, mappa non pan |
| B1.7 | `pointercancel` durante drag marker | rollback coord, markerDrag null |
| B1.8 | Esc durante pick | exit pick, marker pick-mode rimosso |
| B1.9 | Disarmo reciproco tool (Waypoint/Track/Polygon/RangeRings/Convert/Astro/Measure/Bbox) | `workbenchMapInteractionBlocked` blocca; messaggio "blocked" |
| B1.10 | GPS single-shot | coord settate, source="gps", no watchPosition |
| B1.11 | Secure context (`!isSecureContext`) | pulsante disabled + tooltip |
| B1.12 | Riordino mouse (HTML5 drag) | ID stabili, ordine preservato, `kind` ridderivato |
| B1.13 | Riordino tastiera (Su/Giù/Delete) | come sopra |
| B1.14 | ID stabili dopo riordino/drag/modifica | ID non cambiano |
| B1.15 | `kind` rideterminato dopo riordino | start/via/end coerenti con posizione |
| B1.16 | Cleanup su Esc/chiusura/disarmo | `state._routing = null` o prune completo, marker rimossi |
| B1.17 | Reload senza persistenza | `_routing` riparte vuoto |
| B1.18 | Zero write canonici | `mapWaypoints`/`savedTracks`/`gisPolygons`/`state.track` intatti |
| B1.19 | Zero GraphHopper | nessuna chiamata rete routing |
| B1.20 | Regressioni: Workbench/Brush/Poligoni/Range Rings/Import Hub | tutti non interferiti |

### B2

| # | Test | Esito atteso |
|---|---|---|
| B2.1 | Ricerca su più righe | dropdown indipendenti |
| B2.2 | Debounce ~250 ms | niente spam richieste |
| B2.3 | Stale token (type veloce A poi B) | dropdown A non aggiornato da callback A stale |
| B2.4 | OPSEC strict on | fallback `offlineForwardSearch` |
| B2.5 | Forced-offline | fallback `offlineForwardSearch` |
| B2.6 | Fallback offline (offline/exception) | badge error una tantum, dropdown offline |
| B2.7 | Eccezione `geocodeSearch` | fallback offline |
| B2.8 | Input vuoto | dropdown chiuso, `lat/lon` preservati |
| B2.9 | Selezione risultato | lat/lon/label settati, dropdown chiuso |
| B2.10 | Zero endpoint nuovi | riuso puro `geocodeSearch`/`offlineForwardSearch` |
| B2.11 | Regressione Cerca esistente | Cerca principale non modificato |

### C–F (sintetica, da dettagliare nei singoli bundle)

- **C:** `/info` + POST `/route`; AbortController; generation token; endpoint risolto mostrato; fallback Auto (Locale → VPS → Online → errore); timeout; normalizzazione risposta; preview read-only; nessun salvataggio; loopback solo con consenso esplicito; nessuna API key nel monolite; nessun health check al boot.
- **D:** salvataggio via `savedTrackAddFromPoints`; read-back; rollback su errore; refresh Tracce/Workbench; prima persistenza del programma.
- **E:** profilo altimetrico SVG vanilla; quota/distanza/pendenza; difficoltà stimata; sincronizzazione mappa; dark/light/mobile; unità metriche/imperiali; gestione spike.
- **F:** alternative; andata/ritorno; round trip; avoid areas; confronto futuro provider.

---

## 19. Acceptance criteria B1

1. Pannello routing transiente (apre/chiude, ×/Esc, niente persistenza)
2. Punti con **ID stabili**
3. Pick integrato in `attachPanHandlers.onUp` (no listener duplicato)
4. `workbenchMapInteractionBlocked` estesa (+2 condizioni `_routing.pickMode` / `_routing.markerDrag`)
5. Drag marker con cleanup idempotente (Pointer Events capture phase)
6. GPS single-shot (no `watchPosition`)
7. Riordino mouse (HTML5) e tastiera (Su/Giù/Delete)
8. Cap 20 punti
9. Nessun dato canonico modificato
10. Nessuna rete GraphHopper
11. Nessuna persistenza
12. i18n IT/EN; FR invariato (congelato)
13. Build **52**
14. Review downstream **PASS** prima del deploy

---

## 20. Note operative

- **MAJOR-3-b2 (+ FIX1) CLOSED** tip **`cad28e7`**. OUTDOOR-ROUTING-GH resta programma corrente (Bundle F futuro).
- **MAJOR-4 import/restore** resta backlog basso.
- Runtime autorevole: **`567b611` build 66** / `B6.0D-FIX1` (**D + FIX1 CLOSED**); endpoint VPS `http://100.114.7.53:8989` + Local `http://127.0.0.1:8989`; prerequisito [`WU-0011 / INFRA-GH-1A+1B`](WU-0011-infra-gh-1a-graphhopper-local-poc.md) **CLOSED / PASS**.
- Ogni bundle runtime di questo programma è **DELICATO** e richiede **review downstream pre-deploy** (B1/B2/E minima narrativa o estesa a seconda del contenuto; **C estesa** rete/OPSEC — **chiuso**; **D estesa** storage/create-path — **chiuso**).
- Questo documento è **piano**, non stato corrente. Stato vivo: `docs/OPERATING_MEMORY.md` §7.
<!-- AUTO-VIA-FOOTER: NON RIMUOVERE -->
> **PROMEMORIA FINALE — AUTO-VIA.** In assenza di una decisione reale da sottoporre all’operatore, procedere direttamente al passo successivo senza chiedere conferme. Non trasformare raccomandazioni tecniche, preferenze già ratificate o gate già risolti in false scelte utente. Il nuovo `vai` si chiede soltanto quando esistono alternative sostanziali che richiedono davvero la scelta dell’operatore.
<!-- /AUTO-VIA-FOOTER -->
