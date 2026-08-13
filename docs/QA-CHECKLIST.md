<!-- AUTO-VIA-HEADER: NON RIMUOVERE -->
> **REGOLA OPERATIVA VINCOLANTE — AUTO-VIA.** Se il prossimo passo non richiede una decisione reale dell’operatore — scelta di prodotto, scope ambiguo, rischio non autorizzato o conflitto non risolvibile — l’assistente deve considerare il `vai` già concesso e procedere autonomamente. È vietato chiedere conferme, autorizzazioni o un nuovo `vai` per attività già approvate, programmi già autorizzati o passaggi tecnicamente determinati. Un programma esplicitamente autorizzato resta autorizzato per i blocchi successivi finché non emerge una scelta reale o un gate fallito. Fermarsi soltanto davanti a una decisione effettiva che può cambiare il risultato.
<!-- /AUTO-VIA-HEADER -->

# GOI GIS Tool — QA operatore

## D-FLIGHT-G-UI-OVERLAY-A-FIX2 — CLOSED / PASS (2026-08-13)

- Automated Browser QA **PASS** (pre-operatore; wheel pannelli + Layer menu + safeTop).
- Attestazione operatore: `QA D-FLIGHT-G-UI-OVERLAY-A-FIX2 PASS operatore` → auto-`finito` Regola H.
- Catena: G FAIL → FIX1 FAIL → **FIX2 PASS**. `D-FLIGHT-F` resta **FAIL** storico (non CLOSED).
- Runtime tip: `42edb6f` / build 167.

## D-FLIGHT-CDE — CLOSED / PASS (2026-08-12)

- Automated Browser QA **PASS** (pre-operatore; fixture sintetiche).
- Attestazione operatore: `QA D-FLIGHT-CDE PASS operatore` → auto-`finito` Regola H.
- Scope: bundle ROUTINE SVG overlay + Cataloghi toggle/legend + zone details; zero rete helper/OPSEC/persistenza dataset.
- Runtime tip: `a37b912` / build 160.

## D-FLIGHT-B — CLOSED / PASS (2026-08-12)

- Automated Browser QA **PASS** (pre-operatore).
- Attestazione operatore: `QA D-FLIGHT-B PASS operatore` → auto-`finito` Regola H.
- Scope: normalized semantic model `window.GOIDflight.normalize`; zero rete/storage/UI overlay.
- Runtime tip: `4fc7ee3` / build 159.
- Finding wheel latency: PREEXISTING/EXPECTED (non regressione B).

## D-FLIGHT-A — CLOSED / PASS (2026-08-12)

- Automated Browser QA **PASS** (pre-operatore).
- Attestazione operatore: `QA D-FLIGHT-A PASS operatore` → auto-`finito` Regola H.
- Scope: parser puro `window.GOIDflight`; zero rete/storage/UI overlay.
- Runtime tip: `d52367b` / build 158.

> **Natura del file**
> - Fa parte del **read-set operativo** (voce 4; vedi [`README.md`](../README.md)).
> - È una **procedura/template**, **non** la fonte dello stato vivo.
> - Lo stato operativo corrente resta in [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) **§7**.
> - La governance di handoff/chiusura è in [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) **§4 — Handoff & Close Discipline**.

## Principi

- **Tre gate distinti.** (1) **PASS tecnico** (hash, deploy VPS, byte-match, `node --check`, `git ls-remote`); (2) **Automated Browser QA** (`AUTOMATED BROWSER QA <BLOCK-ID> PASS|FAIL|NOT APPLICABLE`) — Cursor, post-deploy, metodo `AUTOMATED-BROWSER-QA-PREOP` / OM §4 Regola D2bis; (3) **PASS operatore** (`QA <BLOCK-ID> PASS operatore`) — persona, QA umana residua.
- **Automated Browser QA ≠ PASS operatore.** Cursor può attestare solo Automated Browser QA (prove automatiche realmente eseguite). Cursor **non** attesta la QA umana/percettiva e **non** prepara/emette le istruzioni QA operatore (Regola D2).
- **Sequenza viva:** deploy tecnico PASS → Automated Browser QA → **solo se PASS/N/A** → fatti tecnici + URL + Automated Browser QA esito + `QA FINALE CHATGPT — PENDING` → ChatGPT emette QA umana residua.
- **Formato vivo QA umana: `QA-HUMAN-SHORT-TARGETED`.** Automated Browser QA fa il lavoro tecnico approfondito; la QA operatore verifica **solo** il residuo operativo/percettivo, in forma **corta e mirata** (normalmente 3–6 casi). Dettaglio: OM §4 Regola D2 + procedura sotto. Il precedente `QA-CHATGPT-3LINE-HANDOFF-PREF` (`Dove:` / `Azione:` / `Risultato atteso:` obbligatori) è **SUPERSEDED** per il formato.
- **Autore QA umana:** **ChatGPT** prepara ed emette **un unico** messaggio QA operatore (aspetti non affidabili da automatizzare).
- **Fail-closed.** Senza attestazione esplicita dell'operatore, l'esito resta **QA operatore non eseguita / non attestata**. Non si inferisce PASS operatore da PASS tecnico, Automated Browser QA PASS, diff pulito o `node --check`. Su Automated Browser QA FAIL: **non** dichiarare `QA FINALE CHATGPT — PENDING`.
- **Lingua IT (QA-OPERATOR-IT-ONLY-PREF CLOSED).** Istruzioni QA operatore **solo in italiano**, salvo blocchi il cui oggetto è la verifica i18n/localizzazione. Runtime app resta IT/EN/FR.
- **Etichette UI visibili.** Usare testi/percorsi realmente visibili (etichetta, tooltip se unico ID, icona/posizione, nome pannello, sequenza concreta). **Vietato** come percorso UI: nomi interni, ID DOM, «Workbench», «Import Hub» (salvo nota tecnica separata). Preferire **«Oggetti GIS»** / **«Import GIS»** quando sono le etichette visibili. Prima di emettere: verificare nel monolite corrente; non inventare menu.
- **Attestazione in Cursor (umana):** solo la riga finale `QA <BLOCK-ID> PASS operatore` oppure `QA <BLOCK-ID> FAIL operatore — <errore preciso>`; dubbi/FAIL intermedi con ChatGPT.

## Automated Browser QA PRE-OPERATORE (`AUTOMATED-BROWSER-QA-PREOP`)

**Vincolo vivo (OM §4 Regola D2bis; adozione `DOCS-AUTOMATED-BROWSER-QA-PREOP-A`).**

1. Obbligatoria di default dopo deploy tecnico PASS se il blocco ha acceptance browser verificabili.
2. Cursor esegue browser automation / CDP (o equivalenti) scoped al blocco: load URL `?v=<runtime-short-sha>`, Console, Network, UI, interazioni, pan/zoom/overlay, OPSEC/offline se pertinente, ecc. (capability, non checklist universale).
3. Attestazioni ammesse: `AUTOMATED BROWSER QA <BLOCK-ID> PASS` · `FAIL — <finding>` · `NOT APPLICABLE — <motivo>` (N/A solo senza superficie browser reale).
4. Report minimo: URL; metodo; casi eseguiti; PASS/FAIL per caso; Console; Network se pertinente; evidenze; anomalie; gate.
5. Login: una richiesta operatore; dopo `login fatto` proseguire. Vietato chiedere secret/token. Segreti mai in docs/repo/report.
6. FAIL → FIX path; **non** QA umana su build già fallita. BLOCKED/INCOMPLETE → non convertire in PASS.

## Procedura canonica ChatGPT — corta e mirata (`QA-HUMAN-SHORT-TARGETED`)

**Vincolo vivo (OM §4 Regola D2 + D2bis; adozione `DOCS-QA-HUMAN-SHORT-TARGETED-A`).**  
Precedente **`QA-CHATGPT-3LINE-HANDOFF-PREF`** (obbligo `Dove:` / `Azione:` / `Risultato atteso:`): **SUPERSEDED** per il formato.

1. Un solo messaggio QA da **ChatGPT** **dopo** che Cursor ha dichiarato deploy PASS + Automated Browser QA PASS|N/A + URL + `QA FINALE CHATGPT — PENDING`.
2. Cursor **non** emette istruzioni QA umane (né post-deploy né nel report `finito`); **deve** aver eseguito Automated Browser QA quando applicabile.
3. La QA umana **non** ripete controlli già affidabilmente coperti da statici, selftest, Console, Network, DOM, HTTP/status, hash, contatori interni, smoke API o Automated Browser QA — salvo osservazione umana necessaria o gate ad alto rischio.
4. Struttura normale del messaggio: apertura breve → `Apri:` + URL esatto → `Verifica questi N casi:` (di solito **3–6**) → riga PASS/FAIL → nota Regola H → eventuale NEXT noto.
5. Ogni caso: titolo umano breve; azioni in bullet; bullet finale `atteso:` con esito inequivocabile. **Non** è obbligatorio ripetere le etichette `Dove:` / `Azione:` / `Risultato atteso:`.
6. Niente tabelle né spiegazioni tecniche lunghe. Eccezione proporzionata solo per OPSEC, rete, cache/storage, migrazioni o rischi non automatizzabili.
7. L’operatore riferisce a **ChatGPT** errori, punti non chiari o FAIL circoscritti; ChatGPT chiarisce prima dell’attestazione.
8. `QA <BLOCK-ID> PASS operatore` in Cursor → auto-`finito` Regola H (nessun secondo «finito»). Su FAIL: non PASS; non `finito`.

### Template ChatGPT (canonico)

```text
Quindi ora la QA umana è molto corta e mirata.

Apri:

http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=<runtime-short-sha>&qa=human

Verifica questi N casi:

1. **<caso>**
   - <azione>;
   - <azione>;
   - atteso: **<risultato osservabile>**.

2. **<caso>**
   - <azione>;
   - atteso: **<risultato osservabile>**.

…

Se tutti sono corretti, incolla in Cursor soltanto:

QA <BLOCK-ID> PASS operatore

Quella riga può far partire la coda `finito` prevista dal workflow (Regola H). Non serve un secondo comando «finito».

Se invece trovi un difetto, non dare PASS e usa:

QA <BLOCK-ID> FAIL operatore — <errore preciso>

Dopo la chiusura di questo gate, il prossimo blocco sarà: <NEXT>.
```

Note URL: usare lo **short SHA runtime reale** del blocco (non inventare). Il parametro `qa=human` è un marker di cache/query opzionale solo se non interferisce col runtime; altrimenti usare solo `?v=<runtime-short-sha>`. La riga NEXT va omessa se non determinata dalle fonti vive.

## CARTO-UI-RESULTS-A (+ FIX1 + FIX2 + FIX3) — UI risultati IGM — CLOSED / PASS end-to-end

**Runtime autorevole live:** `62d24eb` — deploy GIS-only **PASS tecnico**; **CLOSED / PASS end-to-end**.

| Campo | Valore |
| --- | --- |
| Block ID | `CARTO-UI-RESULTS-A-FIX3` (catena A → FIX1 → FIX2 → FIX3) |
| Tip A | `5e734f5478325e7242dc6d84181c60c400acd927` (build 119) |
| Tip FIX1 | `9991955df9ec88a8c9667e54b633db00b0b13258` (build 120) |
| Tip FIX2 | `105fd7f1c7372441dee99f7d19cda2336638c456` (build 121) |
| Tip FIX3 / live | `62d24eb15b119adb19d60fde5e5c386d6a21a87b` |
| Build | `CARTO-UI-RESULTS-A-FIX3 · build 122` |
| Blob | `af24b5bf97abd616f80c1f310c73ffbbe3b7d5c8` |
| Byte LF | `4610584` |
| SHA-256 LF | `f489b4459b8e144f7cb3aa0176869993f2ff9c68afc88f3a3f837d1ad4bb1cd1` |
| Payload embedded | `E65C39C01EC274EB558EDFA3369D8C1364965140CC2B693595703D4F4223CA5D` invariato |
| Bundle | DELICATO leggero — UI stato/lifecycle/a11y + L10N freeze-safe |
| Scope | pannello Indice IGM; overlay; `cartoUiT`; no chiavi CARTO EN/FR; no modifica `t()` globale |
| Review FIX3 | GPT-sostitutiva **PASS / DEPLOY AUTHORIZED** |
| FIX2 | deploy PASS; QA non iniziata; review revocata (finding L10N) |
| Deploy | GIS-only PASS (solo `goi-gis-app`; HTTP 200; CMP_PASS) |
| QA | **PASS** «QA CARTO-UI-RESULTS-A-FIX3 PASS operatore» |
| Finito | Regola H auto-finito |

**URL:**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=62d24eb

## CARTO-SEARCH-ENGINE-A — Motore indice IGM embedded — CLOSED / PASS end-to-end

**Runtime storico (superseded live da CARTO-UI-RESULTS-A-FIX3):** `c80129e` — **CLOSED / PASS end-to-end**.

| Campo | Valore |
| --- | --- |
| Block ID | `CARTO-SEARCH-ENGINE-A` |
| Tip feature / live | `c80129ed7d3a1928236b6b4f7de874fb595b2f98` |
| Parent licenza | `ec1cd88e13062edd3718e8ca1670e2717373ea47` |
| Build | `CARTO-SEARCH-ENGINE-A · build 118` |
| Blob | `2ef0a206f76b392bcdcd58bae329ee36fc4b773f` |
| Byte LF | `4571370` |
| SHA-256 LF | `c6b01abe588ab3d4ff4bf99f1424e8d1c84654a0f7c64aec61cc81aa6cc17572` |
| Bundle | DELICATO — redistribuzione dati IGM + embed + motore spaziale |
| Scope | `data/carto/igm/**` + payload `#cartoIgmEmbeddedData` + `cartoIndex*` + About attribuzione; no UI risultati |
| Review | GPT-sostitutiva **PASS / DEPLOY AUTHORIZED** |
| Deploy | GIS-only PASS (solo `goi-gis-app`; HTTP 200; CMP_PASS) |
| QA | **PASS** «QA CARTO-SEARCH-ENGINE-A PASS operatore» |
| Finito | Regola H auto-finito |

**URL:**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=c80129e

## MAP-BOX-ZOOM-A (+ FIX1) — Zoom mappa via riquadro — CLOSED / PASS end-to-end

**Runtime storico (superseded live da CARTO-SEARCH-ENGINE-A):** `8e3cee4` — **CLOSED / PASS end-to-end**.

| Campo | Valore |
| --- | --- |
| Block ID | `MAP-BOX-ZOOM-A-FIX1` (catena A build 116 → FIX1) |
| Tip feature | `ffbe9fd1af6f267d8a6b9735195f9222540dbe86` (build 116) |
| Tip FIX1 / live | `8e3cee446cab76120ce4da4df1b6c01e4a45afd6` |
| Build | `MAP-BOX-ZOOM-A-FIX1 · build 117` |
| Blob | `f05a4ea9611d97b38e3dff0eeada7a7dac4f3cbe` |
| Byte LF | `3364287` |
| SHA-256 LF | `4b350d44f7f5e77e0c24530e63bf2f4a6931596d69f5eda4447b9dec7f41ce75` |
| Bundle | ROUTINE — UI/JS mappa transiente; no rete/storage |
| Scope | Box zoom sotto `+/−`; FIX1 fit pixel-ratio (no `flyMapToTrackPoints`) |
| Review | N/A (ROUTINE) |
| Deploy | GIS-only PASS (FF → `8e3cee4`; solo `goi-gis-app`; HTTP 200; CMP_PASS) |
| QA | FAIL A → FIX1; **PASS** «QA MAP-BOX-ZOOM-A-FIX1 PASS operatore» |
| Finito | Regola H auto-finito |

**URL:**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=8e3cee4

## ROUTING-ANELLO-A (+ FIX1) — modalità Anello GraphHopper `round_trip` — CLOSED / PASS end-to-end

**Runtime storico (superseded live da MAP-BOX-ZOOM-A-FIX1):** `f718582` — **CLOSED / PASS end-to-end**.

| Campo | Valore |
| --- | --- |
| Block ID | `ROUTING-ANELLO-A-FIX1` (catena A build 114 → FIX1) |
| Tip feature | `4135737c4d630989726e66170b12e04ca9e3f23b` (build 114) |
| Tip FIX1 / live | `f7185823af3028069ff24613151a6ef0209d0966` |
| Build | `ROUTING-ANELLO-A-FIX1 · build 115` |
| Blob | `0ffb7b34d036722945350b4094c73d89c3dab1da` |
| Byte LF | `3347642` |
| SHA-256 LF | `0513e768591a8e03bdb6f92100f81913b2e19a84bdd944efc28828bbd766a19b` |
| Bundle | DELICATO — GraphHopper `round_trip` + multi-seed + OPSEC/rete |
| Scope | Anello nativo; max 3 seed; FIX1 re-gate per seed + timeout-with-best + chiusura antimeridiano |
| Review | build 114 FIX REQUIRED; FIX1 **PASS — DEPLOY AUTHORIZED** |
| Deploy | GIS-only PASS (FF → `f718582`; solo `goi-gis-app`; HTTP 200; CMP_PASS; GH `/info` 200) |
| QA | **PASS** «QA ROUTING-ANELLO-A-FIX1 PASS operatore» |
| Finito | Regola H auto-finito |

**URL:**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=f718582

## ROUTING-ACTION-ROW-UX-A — Action strip unificata modalità+azioni — CLOSED / PASS end-to-end

**Runtime storico (superseded live da ROUTING-ANELLO-A-FIX1):** `dde5156` — **CLOSED / PASS end-to-end**.

| Campo | Valore |
| --- | --- |
| Block ID | `ROUTING-ACTION-ROW-UX-A` |
| Tip | `dde51561f908e025f5cdcbfc9ec26b578b13f29a` |
| Build | `ROUTING-ACTION-ROW-UX-A · build 113` |
| Blob | `e999cafe156b7ddf449f267a70c914fed04450d9` |
| Byte LF | `3309352` |
| SHA-256 LF | `53293444955ceb9c0781c9a2e0007c0657b9043f106b468b3ea6c9e732ffdff2` |
| Bundle | ROUTINE — HTML/CSS action strip; no rete/storage/lifecycle |
| Scope | unico `#routingModeRow` + `.routing-panel-actions` annidato; flex/wrap; Calcola unica primary |
| Harness | 28/28 PASS, `executesRealJs=true` |
| Deploy | GIS-only PASS (FF `c1a6c89`→`dde5156`; solo `goi-gis-app`; GH PID invariato) |
| QA | **PASS** «QA ROUTING-ACTION-ROW-UX-A PASS operatore» |
| Finito | Regola H auto-finito |

**URL:**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=dde5156

## ROUTING-ANDATA-RITORNO-A — Andata e ritorno reale GraphHopper — CLOSED / PASS end-to-end

**Runtime storico (superseded live da ROUTING-ACTION-ROW-UX-A):** `c1a6c89` — **CLOSED / PASS end-to-end**.

| Campo | Valore |
| --- | --- |
| Block ID | `ROUTING-ANDATA-RITORNO-A` |
| Tip | `c1a6c8939d34ae42f0342813388cc2984ee3cf0e` |
| Build | `ROUTING-ANDATA-RITORNO-A · build 112` |
| Blob | `0d8824e018ecbbb38f6ce6b6061d62a005ffdcba` |
| Byte LF | `3308964` |
| SHA-256 LF | `71f7bb1b5bbecb1590f42ac70430e7ee2c2567f93b59cfdb45750b00c7da9c56` |
| Bundle | DELICATO — due POST `/route`, anti-stale/abort, modalità transiente |
| Scope | `routeMode` session-only; out-and-back sequenziale; merge 1 m; metriche/profilo unici; alternative solo `one_way` |
| Review | PASS PRE-DEPLOY |
| Deploy | GIS-only PASS (FF `5fc39e9`→`c1a6c89`; solo `goi-gis-app`; GH PID invariato) |
| QA | **PASS** «QA ROUTING-ANDATA-RITORNO-A PASS operatore» |
| Finito | Regola H auto-finito |

**URL:**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=c1a6c89

## UI-MODAL-ERROR-FOCUS-A-FIX1 (+ FIX2) — Attenzione errori rossi modali layout-neutral — CLOSED / PASS end-to-end

**Runtime storico (superseded live da ROUTING-ANDATA-RITORNO-A):** `5fc39e9` — **CLOSED / PASS end-to-end**.

| Campo | Valore |
| --- | --- |
| Block ID | `UI-MODAL-ERROR-FOCUS-A-FIX2` (catena FIX1 → FIX2; finding su **UI-MODAL-ERROR-FOCUS-A**) |
| Tip FIX1 | `6d272d7de32f8315bbf5844d5efa46bd19b20bf8` (build 110) |
| Tip FIX2 | `5fc39e9f1294b92828867628e2b439f55f051cb2` |
| Build | `UI-MODAL-ERROR-FOCUS-A-FIX2 · build 111` |
| Blob | `45b9132ab3479d7b0e9a7742fd6802f7041c45c8` |
| Byte LF | `3293265` |
| SHA-256 LF | `da5e8f956eb8e6c26e28205940fd74f845d38c0a2bba1b276c1b04a8530ab077` |
| Bundle | ROUTINE — CSS/JS attenzione; no storage/rete/lifecycle |
| Fix | paint-only pulse; scroll solo se clipped; multi-errore → focus/scroll solo primo |
| Harness FIX2 | 37/37 PASS, `executesRealJs=true` |
| QA | FAIL FIX1 (layout jump) → FIX2; **PASS** «QA UI-MODAL-ERROR-FOCUS-A-FIX2 PASS operatore» |
| Finito | Regola H auto-finito |

**URL:**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=5fc39e9

## ROUTING-MODAL-OPEN-EXPANDED-A (+ FIX1) — Max height + larghezza operativa — CLOSED / PASS end-to-end

**Runtime storico (superseded live da UI-MODAL-ERROR-FOCUS-A-FIX2; geometria 680/0.98 preservata):** `89a08fb` — **CLOSED / PASS end-to-end**.

| Campo | Valore |
| --- | --- |
| Block ID | `ROUTING-MODAL-OPEN-EXPANDED-A-FIX1` (catena A → FIX1) |
| Tip A | `ae28eec5b4bc5bab1ed47ac2f2816b1eaabbd97d` (build 108) |
| Tip FIX1 | `89a08fb0954051dc3e2232c6c7b740f05cd03f43` |
| Build | `ROUTING-MODAL-OPEN-EXPANDED-A-FIX1 · build 109` |
| Blob | `a1ad55e518dba1107574cbb0973807970e96ae9d` |
| Byte LF | `3287946` |
| SHA-256 LF | `235ea017dce93d239cf124890934b0b02898a3a1633b0ccb01c346e49b74f3fc` |
| Bundle | DELICATO leggero — lifecycle apertura `#routingPlannerPanel` |
| Geometria | altezza max utile; `defaultW` **680**; reset session-only a riapertura |
| Harness | 26/26 PASS, `executesRealJs=true` |
| QA | FAIL A (larghezza full-bleed) → FIX1; **PASS** «QA ROUTING-MODAL-OPEN-EXPANDED-A-FIX1 PASS operatore» |
| Finito | Regola H auto-finito |

**URL:**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=89a08fb

## UX-SEARCH-ERROR-FOCUS-A — History Cerca + focus errori modal — CLOSED / PASS end-to-end

**Runtime storico (superseded live da ROUTING-MODAL-OPEN-EXPANDED-A-FIX1):** `0b27e27` — **CLOSED / PASS end-to-end**.

| Campo | Valore |
| --- | --- |
| Block ID | `UX-SEARCH-ERROR-FOCUS-A` |
| Tip | `0b27e27c46fecd69b42983680c2d70c12d8fe302` |
| Build | `UX-SEARCH-ERROR-FOCUS-A · build 107` |
| Blob | `c56b4a357687150158231676cdecb9ca6030a2b5` |
| Byte LF | `3285428` |
| SHA-256 LF | `25988cb5f51c57da73d0c9c02ba9bd51e6438c6b78173920df85f2a4ce9c0c8f` |
| Bundle | ROUTINE — chiude **ROUTING-SEARCH-UX-A** + **UI-MODAL-ERROR-FOCUS-A** |
| Persistenza | session-only (`state._routing.searchHistory`) |
| Harness | 38/38 PASS, `executesRealJs=true` |
| QA operatore | **PASS** — «QA UX-SEARCH-ERROR-FOCUS-A PASS operatore» |
| Finito | Regola H auto-finito |

## ROUTING-GEOCODE-SNAP-A — Preflight /nearest + soglie — CLOSED / PASS end-to-end

**Runtime storico (superseded live da UX-SEARCH-ERROR-FOCUS-A):** `d1e770e` — **CLOSED / PASS end-to-end**.

**Commit:** `d1e770e26e1eda625a877fbbe6e2b1b301567b21` — `feat(routing): preflight geocoded points against GraphHopper` (`ROUTING-GEOCODE-SNAP-A` · build 106).

**Deploy registrato (GIS-only, PASS tecnico):**
- VPS HEAD / runtime tip `d1e770e26e1eda625a877fbbe6e2b1b301567b21`
- blob `204f901c9ccca47ec0faace4ac242aebb2a5d592`
- byte LF **3266772** / SHA-256 LF **`98b1e5077206e38d072222bd5c7484d10aad354690b20dd9939107085b649f04`**
- goi-gis-app.service active / enabled
- HTTP 200 (bind Tailscale 100.114.7.53:8000)
- CMP_PASS
- GraphHopper PID invariato `2034035` (non riavviato)

**QA:** attestazione «**QA ROUTING-GEOCODE-SNAP-A PASS operatore**» (2026-08-02); finito Regola H.

**URL:**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=d1e770e

**Backlog additivo:** **ROUTING-SEARCH-UX-A** e **UI-MODAL-ERROR-FOCUS-A** chiusi nel bundle **UX-SEARCH-ERROR-FOCUS-A** (tip `0b27e27`).

## ROUTING-ALTERNATIVE-ROUTES-A (+ FIX1 + FIX2 + FIX3) — Percorsi alternativi — CLOSED / PASS end-to-end

**Runtime storico (superseded live da GEOCODE-SNAP-A):** `0c078ae` — **CLOSED / PASS end-to-end**.

**Catena:** `0d14820` (A · build 102) → `2728ca2` (FIX1 · 103) → `ab432b7` (FIX2 · 104) → tip `0c078ae` (FIX3 · 105 / `B6.6AR-A-FIX3`). Antenato docs `ccac6d8` (QA single-message rule).

**Deploy registrato (GIS-only, PASS tecnico):**
- VPS HEAD / runtime tip `0c078aeebe6691fa025e5fe448c0886c6dc49056`
- blob `024986bcedeb11514b0da730afaca394ad16643e`
- byte LF **3236322** / SHA-256 LF **`0770e72d70b80ef3534b0f0f9b75a6faf57b37fa1c356f0eb2bb210e65eb6532`**
- goi-gis-app.service active / enabled
- HTTP 200 (bind Tailscale 100.114.7.53:8000)
- CMP_PASS
- GraphHopper PID invariato (non riavviato)

**QA:** FAIL A → FIX1; FAIL FIX1 → FIX2; FAIL FIX2 (layout) → FIX3 → attestazione «**QA ROUTING-ALTERNATIVE-ROUTES-A-FIX3 PASS operatore**» (2026-08-02); finito Regola H.

**URL:**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=0c078ae

## ROUTING-GEOCODING-MULTIROW-A (+ FIX1 + FIX2) — Geocoding per-stop + Centra — CLOSED / PASS end-to-end

**Runtime storico (superseded live da AR-A-FIX3):** `1f7c05f` — **CLOSED / PASS end-to-end**.

**Catena:** `2468418` (A · build 99) → `5e87c86` (FIX1 · 100) → tip `1f7c05f` (FIX2 · 101 / `B6.5RGM-A-FIX2`).

**Deploy registrato (GIS-only, PASS tecnico):**
- VPS HEAD / runtime tip storico `1f7c05f2186be5759d3e0e34a69d88564a0d8690`
- blob `c1fc1ca4cad61105893bd948c6262f962ff2c2cb`
- byte LF **3216092** / SHA-256 LF **`e85559440c5141361901e2ece8508d493febe1a5b2a776936f5189ec2b0c0f89`**
- goi-gis-app.service active / enabled
- HTTP 200 (bind Tailscale 100.114.7.53:8000)
- CMP_PASS

**QA:** FIX1 partial (FAIL circoscritto «Centra») → FIX2 → attestazione «**QA ROUTING-GEOCODING-MULTIROW-A-FIX2 PASS operatore**» (2026-08-02); finito Regola H.

**URL (storico):**
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=1f7c05f

## Formato legacy — QA minima narrativa (storico; non procedura viva)

> **Storico.** Prima di **QA-CHATGPT-3LINE-HANDOFF-PREF** (2026-08-02) il formato predefinito era la «QA minima narrativa» spesso emessa da Cursor. Il formato a tre etichette `Dove:` / `Azione:` / `Risultato atteso:` (**QA-CHATGPT-3LINE-HANDOFF-PREF**) è a sua volta **SUPERSEDED** (2026-08-13) da **`QA-HUMAN-SHORT-TARGETED`**. **Procedura viva = sezione «Procedura canonica ChatGPT — corta e mirata»** e OM §4 Regola D2. I template sotto restano solo come riferimento storico.

Per **micro-fix UI** e blocchi di routine, lo **spirito** resta: breve, operativa, **in italiano**, limitata al blocco — ma l’**autore** è ChatGPT e il formato vivo è **corto e mirato** (`QA-HUMAN-SHORT-TARGETED`), non le tre etichette obbligatorie.

**Non usare come formato ordinario:** tabelle; caselle `[ ]`; audit generale; percorsi UI con nomi tecnici non visibili.

### Struttura canonica (storica — sostituita prima da Dove/Azione/Risultato atteso, poi da QA-HUMAN-SHORT-TARGETED)

> Non usare come procedura viva. Vedi **Procedura canonica ChatGPT — corta e mirata**.

1. **Apertura:** `Il deploy tecnico di <BLOCK-ID> è PASS:`
2. **Elenco breve** dei fatti tecnici già verificati.
3. **Frase storica:** `Ora serve solo la QA operatore minima, senza Cursor.`
4. **Sezione `Apri:`** URL VPS.
5. **Sezione `Poi:`** passaggi (storico intermedio: ogni passaggio = Dove/Azione/Risultato atteso).
6. **Sezione `verifica che:`** esiti (storico).
7. **Chiusura:** riga `QA <BLOCK-ID> PASS operatore` da riportare in Cursor.

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

## OUTDOOR-ROUTING-ELEVATION-STYLE-A — Restyle visuale profilo altimetrico — CLOSED / PASS end-to-end

**Runtime autorevole live:** `d28bc44` — deploy GIS-only **PASS tecnico**; **CLOSED / PASS end-to-end**.

**Deploy registrato (GIS-only, PASS tecnico):**

```text
HEAD VPS = d28bc44ddda221417ef6bcb3296d9df155d2032c
blob = e9ae353257ecb57793c5bb0adaeb0f9dcbe94dfd
goi-gis-app.service active / enabled
HTTP 200 (bind Tailscale 100.114.7.53:8000)
byte repo/servito = 3050747 / 3050747
SHA-256 = 8e94e77a65793b18535c98eb28bb1419044ae581804e17e623f8c586a47acbb8 (match)
CMP_PASS = sì
GraphHopper / proxy / Docker / n8n / Tailscale non toccati
```

**Attestazione QA (operatore):**

```text
QA OUTDOOR-ROUTING-ELEVATION-STYLE-A PASS operatore
```

**Metodo:** attestazione = trigger **METHOD-QA-PASS-AUTO-FINITO / Regola H**.

**URL runtime live:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=d28bc44
```

**Display:** `B6.0ES-A · build 78`.

**Note:** Komoot = ispirazione UI non replica. Classificazione segmento via `b.gradePct`. Dark `:root[data-theme="dark"]`.

**Backlog preservato in chiusura (non aperti):** TRACK-ELEVATION-PROFILE-A; OUTDOOR-ROUTING-POINT-UNDO-A; OUTDOOR-ROUTING-UNITS-A.

## TRACK-MODAL-DISPLAY-PREFS-A — Unità e formato coordinate modale Tracce — CLOSED / PASS end-to-end

**Runtime autorevole live:** `1e218a2` — deploy GIS-only **PASS tecnico**; **CLOSED / PASS end-to-end**. Superseded live da **OUTDOOR-ROUTING-ELEVATION-STYLE-A** `d28bc44`.

**Deploy registrato (GIS-only, PASS tecnico):**

```text
HEAD VPS = 1e218a2fe97199893b2c82b58637524a1da58830
blob = 8ef3e17196790fdfb5507dee711af9ede68967ad
goi-gis-app.service active / enabled
HTTP 200
byte repo/servito = 3038595 / 3038595
SHA-256 = 27f646a13e0d6902eeb24e19671134314df2d67943a2e18b676fbc6939077433 (match)
CMP_PASS = sì
GraphHopper / proxy / Docker / n8n / Tailscale non toccati
```

**Attestazione QA (operatore):**

```text
QA TRACK-MODAL-DISPLAY-PREFS-A PASS operatore
```

**Metodo:** attestazione = trigger **METHOD-QA-PASS-AUTO-FINITO / Regola H**.

**Review:** `PASS REVIEW GPT-SOSTITUTIVA TRACK-MODAL-DISPLAY-PREFS-A`.

**URL runtime live:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=1e218a2
```

**Display:** `B6.0TDP-A · build 77`.

**Backlog preservato in chiusura (non aperti):** TRACK-ELEVATION-PROFILE-A; OUTDOOR-ROUTING-POINT-UNDO-A; OUTDOOR-ROUTING-UNITS-A.

## OUTDOOR-ROUTING-REVERSE-A — Inverti percorso — CLOSED / PASS end-to-end

**Runtime autorevole live:** `d54c915` — deploy GIS-only **PASS tecnico**; **CLOSED / PASS end-to-end**. Superseded live da **TRACK-MODAL-DISPLAY-PREFS-A** `1e218a2` poi **ELEVATION-STYLE-A** `d28bc44`.

**Deploy registrato (GIS-only, PASS tecnico):**

```text
HEAD VPS = d54c915a9c4663ccebe067623bc4f12cdd18e590
blob = 5c79d266e93a9c9ead36aa486bb87a17426a368c
goi-gis-app.service active / enabled
HTTP 200
byte repo/servito = 3033162 / 3033162
SHA-256 = 9643ed48f372cf3f12b7ddaffd4e52531083b40235c65fe066217430a0ed20f5 (match)
CMP_PASS = sì
GraphHopper / proxy / Docker / n8n / Tailscale non toccati
```

**Attestazione QA (operatore):**

```text
QA OUTDOOR-ROUTING-REVERSE-A PASS operatore
```

**Metodo:** attestazione = trigger **METHOD-QA-PASS-AUTO-FINITO / Regola H**.

**URL runtime live:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=d54c915
```

**Display:** `B6.0R-A · build 76`.

**Backlog registrato in chiusura (non aperti):** TRACK-ELEVATION-PROFILE-A; OUTDOOR-ROUTING-POINT-UNDO-A; OUTDOOR-ROUTING-UNITS-A; TRACK-MODAL-DISPLAY-PREFS-A (poi CLOSED).

## OUTDOOR-ROUTING-GH-E (+ FIX1–FIX8) — Profilo altimetrico + difficoltà — CLOSED / PASS end-to-end

**Runtime autorevole live:** `e7d9398` (catena `e3cf114` + FIX1–FIX8) — deploy GIS-only FIX8 **PASS tecnico**; **CLOSED / PASS end-to-end**. Superseded live da **REVERSE-A** `d54c915` poi **TRACK-MODAL** `1e218a2`.

**Catena runtime (sintesi):**

| Commit | Ruolo | Build |
|--------|--------|-------|
| `e3cf114` | Feature — profilo SVG + difficoltà | 67 · B6.0E |
| `ab9c0a9`…`166f1c4` | FIX1–FIX4 hardening elevation / hover | 68–71 |
| `476c446` | FIX5 — metriche filtrate + pointer + velocità | 72 |
| `abbd836` | FIX6 — contratto dati filtrati + difficoltà 0–100 | 73 |
| `8ea0938` | FIX7 — sync pointer robusto / GIS guards | 74 |
| `e7d9398` | FIX8 — preserva locale numerico planner | 75 · tip |

**QA FAIL intermedi (chiusi):**

```text
QA FAIL #1 — altimetrico/pointer (post deploy FIX4 166f1c4) → FIX5–FIX7
QA FAIL #2 — locale numerico IT 3.8km vs 3,8km (post deploy FIX7 8ea0938) → FIX8
```

**Deploy FIX8 registrato (GIS-only, PASS tecnico):**

```text
HEAD VPS = e7d93984ad875c1faf6cd5873199f815d5062448
blob = df09e9dc073e1fc0c39b2e2167254c6a1155ca59
goi-gis-app.service active / enabled
HTTP 200
byte repo/servito = 3029257 / 3029257
SHA-256 = 1f7e2a7f2fad9794cd2b380df48e18cf8a58c1b6ba310d6a8ce9ca9f3bcd383c (match)
CMP_PASS = sì
GraphHopper / proxy / Docker / n8n / Tailscale non toccati
```

**Review finale:** PASS REVIEW GPT-SOSTITUTIVA OUTDOOR-ROUTING-GH-E + FIX1–FIX8.

**Attestazione QA (operatore):**

```text
QA OUTDOOR-ROUTING-GH-E PASS operatore
```

**Metodo:** attestazione = trigger **METHOD-QA-PASS-AUTO-FINITO / Regola H**.

**URL runtime live:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=e7d9398
```

**Display:** `B6.0E-FIX8 · build 75`.

**Backlog registrato in chiusura (non aperti):** TRACK-ELEVATION-PROFILE-A; OUTDOOR-ROUTING-POINT-UNDO-A; OUTDOOR-ROUTING-UNITS-A.

## INFRA-GH-1D-EXEC-C — cutover GraphHopper VPS MMAP+V3 — CLOSED / PASS end-to-end

**Natura:** infrastruttura GraphHopper VPS (PoC fuori repo + config VPS) — **non** patch monolite. Monolite runtime live superseduto da Bundle E tip `e7d9398`.

**Esito:** **CLOSED / PASS end-to-end** (2026-07-29). Gate: `PASS INFRA-GH-1D-EXEC-C — V3 ADOTTATA E QA PASS`.

| Voce | Valore |
|------|--------|
| Graph live | `nord-ovest-B-v3-elev` (16 file / 776000971 byte) |
| Elevation | bilinear + ramer, `max_elevation: 5` |
| Import date | `2026-07-28T23:39:23Z` |
| Downtime cutover | 11 s |
| Restart persistenza | PASS |
| V0 / backup / staging | `nord-ovest-B` + backup/rollback **mantenuti** (non cancellati) |
| Bundle E | **CLOSED** tip `e7d9398` (post-1D) |
| Backlog | **OUTDOOR-ROUTING-REVERSE-A** (+ backlog E: PROFILE / POINT-UNDO / UNITS) |

**Attestazione QA (operatore):**

```text
QA INFRA-GH-1D-EXEC-C PASS operatore
```

**Metodo:** attestazione = trigger **METHOD-QA-PASS-AUTO-FINITO / Regola H** (correzione: il prompt EXEC-C aveva escluso erroneamente la coda `finito`; questa chiusura esegue il workflow `finito` senza secondo comando).

**URL runtime app (storico al momento 1D):**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=567b611
```

**Ambito QA osservato:** app/route/altimetria + OPSEC strict + forced-offline — PASS.

## OUTDOOR-ROUTING-GH-D (+ FIX1) — Salva percorso come traccia — CLOSED / PASS end-to-end

**Runtime autorevole live:** `567b611` (catena base `c806099` + FIX1 `567b611`) — deploy GIS-only **PASS tecnico**; **CLOSED / PASS end-to-end**. Superseded live da **E** `e7d9398`.

**Catena runtime:**

| Commit | Ruolo | Blob monolite |
|--------|--------|----------------|
| `c806099` | Base — CTA Salva come traccia; create-path + storage + rollback | `bcda184bf5c316e216a37b4ea7d1d5a6db8dc0c1` |
| `567b611` | FIX1 — harden doppio clic / snapshot fail-closed / predicato busy | `4f679f5b3cba9e50ee81b6d6d92689dd9db5ace3` |

**Deploy FIX1 registrato (GIS-only, PASS tecnico):**

```text
HEAD VPS = 567b611a39bd38722a16b7a13dbc2d7e68e14bdd
blob = 4f679f5b3cba9e50ee81b6d6d92689dd9db5ace3
goi-gis-app.service active / enabled
HTTP 200
byte repo/servito = 2945471 / 2945471
SHA-256 = cd1c86e350f89642293ac8110f91665a82339d399d72befd6dddf78b321cd81f (match)
CMP_PASS = sì
GraphHopper / Planet-Clone / proxy / Docker / n8n / Tailscale non toccati
```

**Attestazione QA (operatore):**

```text
QA OUTDOOR-ROUTING-GH-D PASS operatore
```

**URL runtime live (storico):**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=567b611
```

**Display:** `B6.0D-FIX1 · build 66`. Review GPT-sostitutiva D + FIX1 PASS / GO DEPLOY.

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

## ROUTINE-CLEANUP-BUNDLE — primo bundle bundle-first cleanup routine (build 15) — CLOSED / PASS end-to-end

**Runtime autorevole live:** `7b8cf04` — blob `71e353ee85c15bf2713bc7998c72582f81723ec5` — **`APP_BUILD_NUM = 15`** — display **`B5.5Z · build 15`**.

| Campo | Valore |
|--------|--------|
| Commit | `7b8cf041383b55b80668a30ce12607a8888b774c` |
| Subject | `chore(ui): remove dead modal CSS and renderAllMaps calls (build 15)` |
| Gate | **ROUTINE** — METHOD-BUNDLING-DEFAULT; un bundle / un commit / un deploy / una QA |
| Review | **NON RICHIESTA** (Ramo A + JS no-op) |

**Bundle (7 item):** CSS legacy `.modal-overlay`/`.modal`; selettori `.modal` duplicati Help; `.modal .modal-close` da chip unificati; print/mobile legacy; `.qr-modal` ridondante; 7× `renderAllMaps()` no-op rimossi; commento chip.

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 7b8cf041383b55b80668a30ce12607a8888b774c
VPS blob = 71e353ee85c15bf2713bc7998c72582f81723ec5
HTTP 200
byte repo/servito = 2423860 / 2423860
SHA-256 = 0caa70651a4fca7b04112abddc1af50a44059c5539a9407ed5702ddb646146ba (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**Attestazione QA (operatore):**

```text
QA ROUTINE-CLEANUP-BUNDLE PASS operatore
```

**Checklist QA verificata:** Help e QR aprono/chiudono (GIS + non-GIS); poligoni Modifica/handle/drag vertice OK; nessun errore console nuovo; footer/about **`B5.5Z · build 15`**.

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7b8cf04
```

**Prossimo candidato operativo:** **da scegliere da roadmap/backlog** (resize laterale pilota, HUD-VIS design, `polygonHideRenameBar` cleanup).

**`APP_BUILD_ID` `B5.5Z` invariato.**

## BUNDLE-BACKLOG-B3 — audit backlog bundle + micro-fix sicuri (build 14) — CLOSED / PASS end-to-end

**Runtime autorevole live:** `709079c` — blob `da27be4363e878f97f1f1b8d4dbc9df34f9c7ed3` — **`APP_BUILD_NUM = 14`** — display **`B5.5Z · build 14`**.

| Campo | Valore |
|--------|--------|
| Commit | `709079c989cc34b695e9cff3abf239ced77670dd` |
| Subject | `chore(ui): apply safe backlog micro-fixes` |
| Review | **NON RICHIESTA** (micro-fix mirati Ramo B) |

**Patch implementate:** rimossa `polygonShowRenameBar()` (dead certo); guard P2 multi-touch su vertex drag in `renderPolygonEditOverlay`.

**Audit non implementato:** `polygonHideRenameBar`/barra rename; CSS `.modal-overlay`; `renderAllMaps` undefined; resize laterale; HUD-VIS.

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 709079c989cc34b695e9cff3abf239ced77670dd
VPS blob = da27be4363e878f97f1f1b8d4dbc9df34f9c7ed3
HTTP 200
byte repo/servito = 2426501 / 2426501
SHA-256 = ca0d74a61395d02fc3a3281a29851721c4425e24e5073b68fe5d3d3ba95a0902 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**Attestazione QA (operatore):**

```text
QA BUNDLE-BACKLOG-B3 PASS operatore
```

**Checklist QA verificata:** Poligoni Modifica drag vertice invariato; secondo pointer/touch non sostituisce drag attivo; rename inline Nome OK; lista Poligoni non regressa; footer/about **`B5.5Z · build 14`**.

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=709079c
```

**Prossimi candidati (non obbligatori):** resize laterale pilota; HUD-VIS/HUD-LAYOUT design; CSS `.modal-overlay` Ramo A; audit `renderAllMaps`.

**`APP_BUILD_ID` `B5.5Z` invariato.**

## MODAL-STD-B2 — Preferiti layout/scroll + Poligoni ESC (build 11 → FIX2 build 13) — CLOSED / PASS end-to-end

**Runtime autorevole live:** `266b116` — blob `0f4d275ea86b5b78690421405ffa5909add5783e` — **`APP_BUILD_NUM = 13`** — display **`B5.5Z · build 13`**.

**Catena runtime:**

| Blocco | Commit | Build | Subject |
|--------|--------|-------|---------|
| B2 | `06ed2a09d5e621112877f9389c8ed839d9ae1f65` | 11 | `fix(ui): standardize favorites layout and polygon escape handling` |
| FIX1 | `f53e2d8ff8881434ff49104fb79e42202ad28e27` | 12 | `fix(ui): repair favorites panel close and scroll` |
| FIX2 | `266b1161a6f8d6f95fbc012687d0b0b377538484` | 13 | `fix(ui): restore favorites panel inner scroll` |

**Review:** **NON RICHIESTA** (micro-blocchi layout/ESC Ramo B).

**Scope:** `#favoritesPanel` layout/scroll/close/ESC; ESC `#polygonPanel` con precedenza interna; nessun tocco dati/store/import-export preferiti; OPSEC/rete/tile/cache/geocoding invariati.

**Deploy GIS-only FIX2 (PASS tecnico):**

```text
VPS HEAD = 266b1161a6f8d6f95fbc012687d0b0b377538484
VPS blob = 0f4d275ea86b5b78690421405ffa5909add5783e
HTTP 200
byte repo/servito = 2427039 / 2427039
SHA-256 = c8b39050e456511ea64ea4eaf60df88784ede46b0f490cf77efd587f9a227dc3 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**Attestazione QA finale (operatore):**

```text
QA MODAL-STD-B2-FIX2 PASS operatore
```

**Checklist QA verificata (FIX2, include regressioni FIX1/B2):**

- Preferiti ridimensionato molto in basso: scrollbar sul body, contenuti (lista + azioni) raggiungibili
- Header/×/− visibili e accessibili
- × chiude completo (nessun guscio vuoto)
- ESC chiude completo; confirm bar inline annullata prima se aperta
- Riapertura contenuto integro
- Poligoni ESC ancora OK (vertex modal, barre, inline rename, modifica, close panel)
- Footer/about **`B5.5Z · build 13`**

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=266b116
```

**Storico QA parziale (risolto da FIX1/FIX2):**

- B2 build 11: Poligoni ESC PASS; Preferiti FAIL (scroll, ESC, × guscio)
- FIX1 build 12: ×/ESC/riapertura PASS; scroll FAIL residuo

**`APP_BUILD_ID` `B5.5Z` invariato.**

## MODAL-STD-SEARCH-B1 — standardizzazione pannello Cerca (build 10) — CLOSED / PASS end-to-end

**Runtime autorevole live:** `33c95ad` — blob `d048ee2ff92bf956b31a74aa8ecde21ae49a4540` — **`APP_BUILD_NUM = 10`** — display **`B5.5Z · build 10`**.

| Campo | Valore |
|--------|--------|
| Commit | `33c95ad7cecbb7fa75e82f0e8ba9015ed9457193` |
| Subject | `fix(ui): improve search panel viewport layout` |
| Review | **NON RICHIESTA** (micro-blocco layout Ramo B) |

**Scope:** `#searchPanel` — `_searchPanelLayoutOpts` (`defaultHeightFraction` 0.78, cap 940, `partialMinVisible` 72, `bodyMinH` 120); `clampSearchPanelRect` parziale; CSS body scroll + summary `#geocodeCard` nascosto; geocoding/rete/OPSEC/altri modal invariati.

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = 33c95ad7cecbb7fa75e82f0e8ba9015ed9457193
VPS blob = d048ee2ff92bf956b31a74aa8ecde21ae49a4540
HTTP 200
byte repo/servito = 2424747 / 2424747
SHA-256 = fd6203f61e7f1b7fe14936664e20d280d0e32276988c769fe582178dd593b731 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**Attestazione QA (operatore):**

```text
QA MODAL-STD-SEARCH-B1 PASS operatore
```

**Checklist QA verificata:** tab Cerca pannello più alto (~75–80% viewport); ricerca risultati multipli scroll interno body; header/× fissi; resize angoli OK; input/risultati usabili; drag header OK; mappa interattiva; ESC e × chiudono; nessun summary duplicato; footer/about **`B5.5Z · build 10`**; nessuna regressione Help/QR/Converti/Poligoni.

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=33c95ad
```

**Prossimo candidato operativo:** superseded — **MODAL-STD-B2** ora **CLOSED** (`266b116`, build 13); vedi sezione MODAL-STD-B2 sopra.

**`APP_BUILD_ID` `B5.5Z` invariato.**

## P-POLYGON-LIST-UX-NEXT-B-FIX2 — indicatore Vis. poligoni (build 9) — CLOSED / PASS end-to-end

**Runtime autorevole live:** `b7b98c2` — blob `dc8067d960a0ae0901f4a6f59d7ee19fb0e9586b` — **`APP_BUILD_NUM = 9`** — display **`B5.5Z · build 9`**.

| Campo | Valore |
|--------|--------|
| Commit | `b7b98c205d93001f2b0121330bbde43a4737725b` |
| Subject | `fix(gis): add polygon visibility indicator` |
| Review | **NON RICHIESTA** (micro-fix UX Ramo B) |

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = b7b98c205d93001f2b0121330bbde43a4737725b
VPS blob = dc8067d960a0ae0901f4a6f59d7ee19fb0e9586b
HTTP 200
byte repo/servito = 2423809 / 2423809
SHA-256 = 87746763adf80441c9c952a0572972cffa199dc62dcdb66cc5f9326a9b77b844 (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**Attestazione QA (operatore):**

```text
QA P-POLYGON-LIST-UX-NEXT-B-FIX2 PASS operatore
```

**Checklist QA verificata:** pallino verde visibile / grigio nascosto; Mostra/Nascondi selezionate/tutte aggiornano indicatori; colonna Vis. non cliccabile; checkbox/toolbar/rename/resize invariati; footer/about **`B5.5Z · build 9`**.

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=b7b98c2
```

**Prossimo candidato operativo:** **da scegliere da roadmap/backlog**.

**`APP_BUILD_ID` `B5.5Z` invariato.**

## CONVERT-SOURCE-PICKER — sorgente coordinate Convertitore (build 8) — CLOSED / PASS end-to-end

**Runtime autorevole live:** `b294140` — blob `6feba1c9e0b192c1655ba052314e7d8cae87df98` — **`APP_BUILD_NUM = 8`** — display **`B5.5Z · build 8`**.

| Campo | Valore |
|--------|--------|
| Commit | `b294140c6464c28634c775018c4bd80853041491` |
| Subject | `feat(convert): add waypoint favorite and map source picker` |
| Review | **GPT sostitutiva PASS** (Claude non disponibile — non review byte Claude ordinaria) |

**Deploy GIS-only (PASS tecnico):**

```text
VPS HEAD = b294140c6464c28634c775018c4bd80853041491
VPS blob = 6feba1c9e0b192c1655ba052314e7d8cae87df98
HTTP 200
byte repo/servito = 2423291 / 2423291
SHA-256 = 1a954ca989e436bb1dadb319d7fc84701ed760a845d3127d6d963f4b1ae6b4ab (match)
CMP_PASS = yes
goi-gis-app.service = active / enabled
```

**Attestazione QA (operatore):**

```text
QA CONVERT-SOURCE-PICKER PASS operatore
```

**Checklist QA verificata:** input manuale Convertitore OK; waypoint → Usa → output aggiornato; preferito → Usa → output aggiornato; punto mappa one-shot → output aggiornato; Annulla/ESC disattivano picker; centro mappa → output aggiornato; QR da Converti funziona; mappa interattiva; Help/QR build 7 non regressi; footer/about **`B5.5Z · build 8`**.

**URL runtime:**

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=b294140
```

**Prossimo candidato operativo:** **da scegliere da roadmap/backlog** (superseded: P-POLYGON-LIST-UX-NEXT-B-FIX2 ora **CLOSED**).

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

## Template coda prompt bundle runtime (canonico)

**Home duplicata:** OM §4 *Template coda prompt bundle runtime*. GPT incolla questa coda in ogni prompt bundle runtime con deploy.

````text
GATE / CHIUSURA (coda finito pre-autorizzata):
Dopo deploy tecnico PASS, esegui AUTOMATED BROWSER QA PRE-OPERATORE (Regola D2bis / AUTOMATED-BROWSER-QA-PREOP).
Se Automated Browser QA = FAIL o BLOCKED/INCOMPLETE: NON dichiarare QA FINALE CHATGPT — PENDING; riporta finding; NON eseguire finito.
Solo se Automated Browser QA = PASS (o NOT APPLICABLE giustificato), fermati e riporta:
deploy PASS, URL runtime, Automated Browser QA PASS|N/A, gate «QA FINALE CHATGPT — PENDING».
Non preparare e non emettere istruzioni QA operatore (Regola D2 — ChatGPT emette la QA umana residua).
Quando l'operatore (via ChatGPT) attesta esattamente in Cursor:
QA <BLOCK-ID> PASS operatore
esegui automaticamente la coda finito già autorizzata:
chiusura docs OM §7 + roadmap/checklist/HANDOFF se previsti + autosync orchestratore + commit/push + verifica HEAD = origin/main = ls-remote + workspace pulito + conferma monolite invariato se docs-only.
Non chiedere un comando separato «finito» né attendere un secondo messaggio.
Se QA operatore fallisce o deploy/smoke non PASS o Automated Browser QA non PASS, NON eseguire finito.
Eccezioni: diagnosi/read-only; review Claude pendente (bundle delicato); review sostitutiva GPT non loggata; workspace sporco; scope drift.
````

Sostituire `<BLOCK-ID>` con l'ID reale del bundle (es. `ROUTINE-CLEANUP-BUNDLE`). Dettaglio metodo: OM §4 Regola H + Regola D2 + Regola D2bis.

## TRACK-ELEVATION-PROFILE-A (+ FIX1 + FIX2 + FIX3) — CLOSED / PASS end-to-end

**Blocco:** TRACK-ELEVATION-PROFILE-A + FIX1 + FIX2 + FIX3  
**Stato:** **CLOSED / PASS end-to-end** (2026-07-31)  
**Runtime tip:** `1fc9d7022c48f64176d612936e9d01c47245cc24`  
**Blob / byte LF / SHA-256 LF:** `fd6f6ecc…` / `3121652` / `251dfad4…`  
**Build:** `B6.1TP-A-FIX3 · build 82`

### Storia QA/review (preservata)

| Step | Esito |
| --- | --- |
| Implementazione A `4fb0d5a` build 79 | shipped |
| FIX1 `45bbf57` build 80 | shipped |
| FIX2 `ae9ca1e` build 81 | deploy GIS-only PASS |
| `QA TRACK-ELEVATION-PROFILE-A-FIX2 FAIL operatore` | mappa→profilo FAIL (corde campioni + pickMode auto-arm) |
| FIX3 `1fc9d70` build 82 | review GPT-sostitutiva PASS; deploy GIS-only PASS |
| `QA TRACK-ELEVATION-PROFILE-A-FIX3 PASS operatore` | trigger Regola H / `finito` |

**Backlog UX registrato (non implementato all’epoca; TPD-A poi CLOSED):** ROUTING-PROFILE-EDIT-A; MAP-CENTER-VIEWPORT-AWARE-A; QA-OPERATOR-IT-ONLY-PREF.

## ROUTING-SUMMARY-DEDUP-A — CLOSED / PASS end-to-end

**Blocco:** ROUTING-SUMMARY-DEDUP-A  
**Stato:** **CLOSED / PASS end-to-end** (2026-07-31)  
**Runtime tip:** `58197bb14e1f5eb7f00abbe348500f2d093ff381`  
**Blob / byte LF / SHA-256 LF:** `79ba3e65…` / `3129462` / `db113b40…`  
**Build:** `B6.1RSD-A · build 84`

### Storia QA/review

| Step | Esito |
| --- | --- |
| Implementazione `58197bb` build 84 | shipped |
| Deploy GIS-only PASS | HTTP 200; byte/SHA/`cmp` match; solo `goi-gis-app` |
| `QA ROUTING-SUMMARY-DEDUP-A PASS operatore` | trigger Regola H / `finito` (UI italiana) |

## ROUTING-UX-POLISH-BUNDLE-A (+ FIX1) — CLOSED / PASS end-to-end

**Blocco:** ROUTING-UX-POLISH-BUNDLE-A-FIX1 (chiude anche ROUTING-UX-POLISH-BUNDLE-A)  
**Stato:** **CLOSED / PASS end-to-end** (2026-07-31)  
**Runtime tip:** `173b6cb1ab4358c94352fed4b82e0b394b4e8d7b`  
**Blob / byte LF / SHA-256 LF:** `9686245e…` / `3150227` / `4c197243…`  
**Build:** `B6.2UX-A-FIX1 · build 86`

### Storia QA/review

| Step | Esito |
| --- | --- |
| Implementazione `7653ee7` build 85 | shipped (bundle A) |
| QA operatore FAIL su Undo/A-B/badge | → FIX1 |
| Implementazione `173b6cb` build 86 | shipped (FIX1) |
| Deploy GIS-only PASS | HTTP 200; byte/SHA/`cmp` match; solo `goi-gis-app` |
| Harness locale | 59/59 PASS |
| `QA ROUTING-UX-POLISH-BUNDLE-A-FIX1 PASS operatore` | trigger Regola H / `finito` |

**Backlog UX residuo (storico; TPD-A poi CLOSED):** ROUTING-PROFILE-EDIT-A; MAP-CENTER-VIEWPORT-AWARE-A; QA-OPERATOR-IT-ONLY-PREF.  
**Assorbiti:** OUTDOOR-ROUTING-POINT-UNDO-A; OUTDOOR-ROUTING-UNITS-A.

## APP-BUILD-LABEL-UX-A (+ FIX1) — CLOSED / PASS end-to-end

**Blocco:** APP-BUILD-LABEL-UX-A-FIX1 (chiude anche APP-BUILD-LABEL-UX-A)  
**Stato:** **CLOSED / PASS end-to-end** (2026-07-31)  
**Runtime tip:** `da3397b8658a46dd2689f26dc79ec12ad48b0461`  
**Blob / byte LF / SHA-256 LF:** `f028f390…` / `3139603` / `49d4db86…`  
**Build:** `B6.2BL-A-FIX1 · build 88`

### Storia QA/review

| Step | Esito |
| --- | --- |
| Implementazione `6de0e98` build 87 | shipped (solo badge build) |
| `QA APP-BUILD-LABEL-UX-A FAIL operatore` | HUD residua + footer intermittente → FIX1 |
| Implementazione `da3397b` build 88 | shipped (FIX1) |
| Deploy GIS-only PASS | HTTP 200; byte/SHA/`cmp` match; solo `goi-gis-app` |
| Harness locale | 29/29 PASS |
| `QA APP-BUILD-LABEL-UX-A-FIX1 PASS operatore` | trigger Regola H / `finito` |

**Backlog UX residuo (non implementato):** ROUTING-PROFILE-EDIT-A; QA-OPERATOR-IT-ONLY-PREF.

## ROUTING-POINT-COORD-EDIT-A (+ FIX1) — CLOSED / PASS end-to-end

**Blocco:** ROUTING-POINT-COORD-EDIT-A + FIX1  
**Stato:** **CLOSED / PASS end-to-end** (2026-08-01)  
**Runtime tip:** `6475804db952e311f8a228df1435d104e3d2557a`  
**Blob / byte LF / SHA-256 LF:** `a87920fe…` / `3162728` / `559795bf…`  
**Build:** `B6.3RPC-A-FIX1 · build 95`

### Storia QA/review

| Step | Esito |
| --- | --- |
| Piano `2026-08-01_1724_plan…` | docs-only; Opzione B light |
| Implementazione `f509125` build 94 | shipped (Modifica coordinate) |
| Review downstream A | PASS WITH BLOCKING → FIX1 feedback stale |
| FIX1 `6475804` build 95 | clear feedback dopo setter/Undo/remove |
| Review FIX1 | PASS — DEPLOY AUTHORIZED |
| Deploy GIS-only PASS | HTTP 200 Tailscale; byte/SHA/`cmp` match; solo `goi-gis-app` |
| `QA ROUTING-POINT-COORD-EDIT-A PASS operatore` | trigger Regola H / `finito` |

**Backlog UX residuo (al tempo ROUTING-POINT):** poi **QA-OPERATOR-IT-ONLY-PREF CLOSED**; residuo Bundle F; ROUTING-GEOCODING-MULTIROW-A.

## TRACK-POINT-CENTER-BUTTON-A — CLOSED / PASS end-to-end

**Blocco:** TRACK-POINT-CENTER-BUTTON-A  
**Stato:** **CLOSED / PASS end-to-end** (2026-08-01)  
**Runtime tip:** `0482ef8d88b15daea0a67a0b9552e0c69a35fe5f`  
**Blob / byte LF / SHA-256 LF:** `4f121880…` / `3164587` / `e77ad65e…`  
**Build:** `B6.3TPC-A · build 96`

### Storia QA/review

| Step | Esito |
| --- | --- |
| Backlog `2026-07-27_backlog_track-point-center-button` | docs-only |
| Discovery congiunta 2026-08-01 | ROUTINE confermata; helper `gisMapCenterOnLatLon` |
| Implementazione `0482ef8` build 96 | shipped (Centra per-riga; ID stabile) |
| Review Claude | NON RICHIESTA (ROUTINE) |
| Harness JS reale | 31/31 PASS; `executesRealJs=true` |
| Deploy GIS-only PASS | HTTP 200 Tailscale; byte/SHA/`cmp` match; solo `goi-gis-app` |
| `QA TRACK-POINT-CENTER-BUTTON-A PASS operatore` | trigger Regola H / `finito` |

**Backlog UX residuo (storico al tempo TPC):** poi **QA-OPERATOR-IT-ONLY-PREF CLOSED**; residuo **ROUTING-GEOCODING-MULTIROW-A**; Bundle F. Superseded live da **MAJOR-3-b2** tip `cad28e7`.

## MAJOR-3-b2 (+ FIX1) — CLOSED / PASS end-to-end

**Blocco:** MAJOR-3-b2 + FIX1  
**Stato:** **CLOSED / PASS end-to-end** (2026-08-01)  
**Runtime tip:** `cad28e73ab1b3b00c872a09b9e8455c7ac674196`  
**Documentale tip:** `80265c36ce845639dc75ce39ea304fadc942cd2a` (AUTO-VIA; monolite invariato)  
**Blob / byte LF / SHA-256 LF:** `ca931d93…` / `3195195` / `177c9cb1…`  
**Build:** `B6.4IHA-B2-FIX1 · build 98`

### Storia QA/review

| Step | Esito |
| --- | --- |
| Implementazione `4d70bbc` build 97 | shipped (Applica anteprima Import Hub) |
| Harness JS reale (b2) | 70/70 PASS; `executesRealJs=true` |
| Review downstream b2 | PASS → FIX1 persistenza |
| FIX1 `cad28e7` build 98 | verify persistenza + `saveStoreReported` |
| Harness JS reale (FIX1) | 90/90 PASS; `executesRealJs=true` |
| Docs AUTO-VIA `80265c3` | monolite blob invariato vs FIX1 |
| Deploy GIS-only PASS | HTTP 200 Tailscale; byte/SHA/`cmp` match; solo `goi-gis-app`; VPS `0482ef8`→`80265c3` / runtime tip `cad28e7` |
| `QA MAJOR-3-b2 PASS operatore` | trigger Regola H / `finito` |

**Backlog UX residuo (non implementato):** ROUTING-GEOCODING-MULTIROW-A; Bundle F. **QA-OPERATOR-IT-ONLY-PREF CLOSED** (docs-only). **Oggetti GIS FROZEN**.

## QA-OPERATOR-IT-ONLY-PREF — CLOSED / PASS docs-only

**Blocco:** QA-OPERATOR-IT-ONLY-PREF (+ freeze **Oggetti GIS**)
**Stato:** **CLOSED / PASS docs-only** (2026-08-01)
**Runtime:** invariato (`cad28e7` / build 98)
**Deploy:** non richiesto

### Decisioni registrate

| Decisione | Esito |
| --- | --- |
| QA operatore future solo IT | sì (salvo blocchi i18n) |
| Percorsi UI = etichette visibili | sì; vietati Workbench/Import Hub come percorso QA |
| Verifica monolite prima dell’emissione | obbligatoria |
| QA minima narrativa limitata al blocco | invariata / rafforzata |
| Oggetti GIS | **FROZEN** — resta in runtime; no sviluppo/refactor dedicato; no auto-proposta; solo bug bloccanti/perdita dati/regressioni |

**Backlog UX residuo (non implementato / non aperto):** ROUTING-GEOCODING-MULTIROW-A; Bundle F. Nessun candidato runtime aperto da questo blocco.

## MAP-CENTER-VIEWPORT-AWARE-A (+ FIX1 + FIX2 + FIX3) — CLOSED / PASS end-to-end

**Blocco:** MAP-CENTER-VIEWPORT-AWARE-A + FIX1 + FIX2 + FIX3  
**Stato:** **CLOSED / PASS end-to-end** (2026-08-01)  
**Runtime tip:** `d0688ea44513501cae766f79d1538934729234e3`  
**Blob / byte LF / SHA-256 LF:** `55d414bc…` / `3149321` / `0c23594c…`  
**Build:** `B6.2MCV-A-FIX3 · build 93`

### Storia QA/review

| Step | Esito |
| --- | --- |
| Piano `2026-08-01_1013_plan…` | docs-only; opzione A′ |
| Implementazione `5b5e052` build 90 | shipped (viewport-aware) |
| FIX1 `1a7c98c` build 91 | harden + diff ≤150 |
| FIX2 `a640ca2` build 92 | marker/camera + antimeridiano; deploy PASS |
| QA FAIL operatore post-FIX2 | bordo L/R classificato come B (pixel grezzi) → FIX3 |
| FIX3 `d0688ea` build 93 | costi normalizzati; review PASS — DEPLOY AUTHORIZED |
| Deploy GIS-only PASS | HTTP 200 Tailscale; byte/SHA/`cmp` match; solo `goi-gis-app` |
| `QA MAP-CENTER-VIEWPORT-AWARE-A-FIX3 PASS operatore` | trigger Regola H / `finito` |

**Backlog UX residuo (non implementato):** ROUTING-PROFILE-EDIT-A; QA-OPERATOR-IT-ONLY-PREF.

## TRACK-PROFILE-POINTS-DISPLAY-A — CLOSED / PASS end-to-end

**Blocco:** TRACK-PROFILE-POINTS-DISPLAY-A  
**Stato:** **CLOSED / PASS end-to-end** (2026-08-01)  
**Runtime tip:** `3838e9ec57efa5ebdc977f88279b30928a47c851`  
**Blob / byte LF / SHA-256 LF:** `48abde62…` / `3144095` / `464eed94…`  
**Build:** `B6.2TPD-A · build 89`

### Storia QA/review

| Step | Esito |
| --- | --- |
| Piano `2484e8d` | docs-only; opzione B vincolante |
| Implementazione `3838e9e` build 89 | shipped (+89/−9) |
| Review downstream PASS — DEPLOY AUTHORIZED | harness JS reale 43/43 |
| Deploy GIS-only PASS | HTTP 200 Tailscale; byte/SHA/`cmp` match; solo `goi-gis-app` |
| `QA TRACK-PROFILE-POINTS-DISPLAY-A PASS operatore` | trigger Regola H / `finito` |

**Backlog UX residuo (non implementato):** ROUTING-PROFILE-EDIT-A; QA-OPERATOR-IT-ONLY-PREF. **MAP-CENTER** poi CLOSED tip `d0688ea`.

## Istruzioni per Cursor dopo deploy (e per `finito`)

Quando il deploy tecnico è **PASS** e la QA operatore è ancora **pending**, Cursor deve:

- riportare i **risultati tecnici già verificati** (PASS tecnico);
- riportare l’**URL** con runtime short SHA reale;
- dichiarare il gate **`QA FINALE CHATGPT — PENDING`**;
- **non** emettere istruzioni QA, template umano, né «QA minima narrativa»;
- **non** dichiarare PASS operatore;
- attendere in sessione Cursor solo l’attestazione finale.

**ChatGPT** (non Cursor) emette il messaggio QA unico **corto e mirato** (`QA-HUMAN-SHORT-TARGETED` / OM §4 Regola D2).

**Checklist estesa** (OPSEC/rete/cache/storage/migrazioni/alto rischio): solo da ChatGPT, un solo messaggio; Cursor non emette.

**Dopo attestazione QA PASS (bundle con coda pre-autorizzata):** la riga `QA <BLOCK-ID> PASS operatore` **innesca automaticamente** il workflow `finito` in Cursor (OM §4 Regola H) — **non** serve un secondo messaggio «ora lancia finito» da GPT/orchestratore.
<!-- AUTO-VIA-FOOTER: NON RIMUOVERE -->
> **PROMEMORIA FINALE — AUTO-VIA.** In assenza di una decisione reale da sottoporre all’operatore, procedere direttamente al passo successivo senza chiedere conferme. Non trasformare raccomandazioni tecniche, preferenze già ratificate o gate già risolti in false scelte utente. Il nuovo `vai` si chiede soltanto quando esistono alternative sostanziali che richiedono davvero la scelta dell’operatore.
<!-- /AUTO-VIA-FOOTER -->
