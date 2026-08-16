# WU-0018 — D-FLIGHT-ATM09-LEGEND-UX

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN
**ACTIVE BLOCK:** D-FLIGHT-ATM09-LEGEND-UX-TOPOLOGY-ADJUDICATION-A (**CLOSED / PASS** — Caso **T1**)
**CURRENT GATE:** READY FOR D-FLIGHT-ATM09-LEGEND-UX-IMPL-A
**REVIEW BASE:** monolite tip `d2d3ab34adf7e30e07771c0edcf0e2700e931715` · build **197**
**RUNTIME LIVE:** monolite tip `d2d3ab34adf7e30e07771c0edcf0e2700e931715` · build **197** · `APP_BUILD_ID=D-FLIGHT-ATM09-VISUAL-PARITY-IMPL-A` · helper **0.1.3**
**CATEGORIA:** TOPOLOGY-ADJUDICATION = docs-only · IMPL-A futura = **ROUTINE** (strategia E ibrida; no helper patch)
**ORIGINE:** backlog QA build 183 candidato **D** — Legenda ATM09 esterna / label user-facing
**NEXT:** `D-FLIGHT-ATM09-LEGEND-UX-IMPL-A` — NON implementare in questo blocco
**NOTE:** `costa` ∈ RED-0-SOLID (no 9ª voce UI) · secondo Max 120 = DEFAULT/NON-RESTRICTED (no TECH rule) · official pixel crop misurato · USER-FACING SOURCE **8/8**
<!-- /WU-HOT-HEADER -->

**Workstream precedente:** [`WU-0017`](WU-0017-dflight-atm09-visual-parity.md) **CLOSED / PASS** (IMPL-A / build 197 — arbitration legenda contestuale).

---

## 1. Scopo

Aprire in modo persistente il candidato backlog **D** («Legenda ATM09 esterna / label user-facing») con un audit tecnico read-only che:

1. mappa la pipeline legenda ATM09 corrente (monolite + helper);
2. verifica quali informazioni esistono per una legenda user-facing senza inventare stile;
3. costruisce la matrice label tecniche ↔ swatch ↔ label operative con stati fail-closed;
4. valuta architetture minime (A–E) senza implementare;
5. fissa acceptance matrix e gate per un futuro `D-FLIGHT-ATM09-LEGEND-UX-IMPL-A`.

**Questo blocco AUDIT-A:** nessuna patch runtime, nessun helper change, nessun deploy, nessuna QA browser/operatore, nessun `finito`.

---

## 2. Invarianti

Evidenza canonica già ratificata in WU-0017 (non riaprire):

1. UI D-Flight ufficiale = **una** legenda contestuale (REFERENCE-R1).
2. Label user-facing ufficiali **almeno** (elenco **non** esaustivo — R2): Height 0 / 25 / 45 / 60 / 120 meters AGL; Dangerous Area.
3. Simbologie osservate nello screenshot ufficiale (R2): rosso pieno; rosso a righe diagonali; arancio; arancio a righe diagonali; giallo; azzurro/ciano; verde; ulteriori — **senza** RGB/HEX inventati.
4. Raster ATM09 WMS READY materialmente coerente col riferimento (R3) → **vietato** restyle raster / cambio `ATM09_STYLE`.
5. Legenda GOI GetLegendGraphic = label **tecniche** WMS (R5), es. `geometrie_rosse_scure`, `geometrie_rosse_piene`, `geometrie_verdi`.
6. Build **197** ha risolto arbitration contestuale (`dflightLegendPaintMode` / `dflightSyncContextualLegends`) — D **non** deve regressirla.
7. Vietato associare label tecnica ↔ user-facing per intuizione, colore solo, ordine solo, o traduzione inventata.

Invarianti runtime assoluti (futuro IMPL): single-file vanilla; no nuove dipendenze; OPSEC/offline; no GPS silenzioso; no `watchPosition`; helper **0.1.3** invariato salvo decisione DELICATO esplicita; FIX5 / temporal / master / INFO-hit invariati.

---

## 3. Baseline

| Voce | Valore |
| --- | --- |
| Base remota avvio AUDIT-A | `dd16787d1fc88fdbc0da6419c39c1a3a1f149c77` |
| RUNTIME LIVE | `d2d3ab34adf7e30e07771c0edcf0e2700e931715` · build **197** |
| `APP_BUILD_ID` | `D-FLIGHT-ATM09-VISUAL-PARITY-IMPL-A` |
| Helper | **0.1.3** |
| WU precedente | WU-0017 CLOSED / PASS |

---

## 4. Pipeline legenda corrente (AUDIT A)

### 4.1 Sorgente PNG

| Voce | Evidenza |
| --- | --- |
| Client URL | `dflightAtm09LegendUrl()` → `{dflightHelperBaseUrl()}/atm09/legend.png` — monolite ~39918–39921 |
| Helper route | `GET /atm09/legend.png` — `goi_dflight_helper.py` ~1573–1582 |
| Upstream | `build_atm09_legend_url()` → WMS `GetLegendGraphic` — ~600–621 |
| Layer / style | `ATM09_LAYER=D-FLIGHT:ATM09` · `ATM09_STYLE=D-FLIGHT:atm09_style` — ~49–50 |
| Parametri legend | `format=image/png` · `width=20` · `height=20` · `legend_options=fontSize:12;dpi:96` |
| Trasformazione | **nessuna** — byte PNG upstream se `content-type` contiene `image/png` (~1283–1311) |
| Cap | `ATM09_LEGEND_BYTE_CAP = 1 MiB` |

**Implicazione D:** i pixel della legenda sono ufficiali; le label nel PNG sono baked-in (tecniche). Nessun testo i18n nelle entry del PNG.

### 4.2 DOM / CSS

| Voce | Evidenza |
| --- | --- |
| DOM | `#dflightAtm09LegendDetails` → summary + `#dflightAtm09LegendWrap` → `#dflightAtm09LegendImg` + hint — ~14169–14174 |
| CSS details | `.dflight-atm09-legend-details` bordo + `background:var(--panel-2…)` — ~8651–8654 (**card opaca** — gap vs roadmap §7 fondo trasparente) |
| CSS img | `max-width:100%; height:auto; image-rendering:auto; background:transparent` — ~8667–8669 |
| Scaling | responsive al pannello; natural size non forzata in CSS |
| Light/dark | nessun filtro sull’`<img>`; il **contenitore** panel-2 può alterare percezione (già notato WU-0017 §3.B) |

### 4.3 Lazy load / eligibility / READY

| Voce | Evidenza |
| --- | --- |
| Eligibility | `dflightAtm09EnsureLegend`: `can = (dflightLegendPaintMode()==="atm09") ∧ network ∧ legendUrl` — ~40043–40061 |
| Auto-expand | OFF→ON eligibility: `details.open=true` + `forceLoad` — ~40065–40069 |
| Lazy | load PNG solo se `forceLoad` o `details.open` — ~40073–40076 |
| Cache sessione | `_dflightAtm09LegendLoaded` + stesso `src` → skip reload — ~40080–40084 |
| onerror | reset `_dflightAtm09LegendLoaded=false` — ~40090–40091 (nessun falso READY sulla legenda) |
| READY raster | `dflightAtm09SetReady` / `dflightAtm09RecomputeReady` (tile completeness) — ~39754–39774; paint mode richiede READY per `"atm09"` |
| INFO unavailable | `dflightAtm09MarkInfoUnavailable` → paint mode può diventare `"restrictions"` se overlay D ON (caso D matrice WU-0017) — ~40181–40193 |
| ATM09 OFF | preferred off → legend wrap hidden, ready false, ensureLegend — ~39962–39976; paint mode ≠ atm09 → details hidden |
| Entrambi master ON | se ATM09 READY+visible → sola legenda ATM09; altrimenti restrizioni (IMPL-A) — `dflightLegendPaintMode` ~40004–40021 |

### 4.4 i18n

| Chiave | Uso |
| --- | --- |
| `dflight.legendOfficialSummary` | summary «Legenda ATM09 ufficiale» |
| `dflight.legendOfficialHint` | hint sotto PNG |
| `dflight.legendTitle` | heading restrizioni (arbitration) |

Le **entry** della legenda ATM09 **non** sono i18n: sono pixel del GetLegendGraphic. Futuro testo user-facing andrà in chiavi IT (L10N-FREEZE: no nuove EN/FR salvo unfreeze).

### 4.5 Arbitration IMPL-A (non toccare in D)

- `dflightLegendPaintMode()` ~40004–40021
- `dflightSyncContextualLegends()` ~40025–40040
- Selftest `dflightSelfTestIMPLA()` ~44348+

**Implicazione D:** qualsiasi legenda «esterna» deve restare governata dallo stesso paint mode (visibile solo in mode `"atm09"`).

---

## 5. Evidenza GetLegendGraphic (AUDIT B)

### 5.1 Sessione AUDIT-A

Tentativo `http://127.0.0.1:8010/atm09/legend.png` e `http://localhost:8010/atm09/legend.png`: **connessione fallita / timeout**.

**HELPER LEGEND EVIDENCE UNAVAILABLE** (questa sessione).

Nessuna chiamata diretta a d-flight.it. Nessun secret. Nessun PNG committato.

### 5.2 Evidenza repository (WU-0017 smoke — Tailnet, fuori repo)

| Campo | Valore documentato |
| --- | --- |
| HTTP | 200 |
| Content-Type | `image/png` |
| Bytes | 3378 |
| IHDR | **181×189** RGB (color type 2) |
| Entry/ordine/label OCR | **non** riestratte in AUDIT-A (helper down); label tecniche esempio da R5 |

**Fattibilità riuso pixel:** alta in principio (PNG ufficiale, stesso style del raster). **Crop per-entry:** dimensioni icona request `20×20` + fontSize 12 suggeriscono layout GeoServer a righe, ma **coordinate crop non misurate in questa sessione** → non PROVEN per implementazione.

---

## 6. Matrice label ↔ swatch ↔ significato

Stati: **PROVEN** | **PARTIAL** | **UNKNOWN**. Fail-closed. Tre livelli distinti obbligatori.

### 6.1 Semantica normativa colore ↔ quota (REFERENCE-B) — PROVEN = 4

Invariata da REFERENCE-B (§ precedente): rosso/0 · arancione/25 · giallo/45 · esterno azzurro 60\|120.

### 6.2 SWATCH / PATTERN ↔ USER-FACING (REFERENCE-C1/C2) — da asset ufficiale D-Flight

Fonte: screenshot web-app D-Flight ufficiale (legenda intestata **ATM09**), asset pubblico 2024-08-02. Label IT osservate; R2 EN restano localizzazione alternativa (non contraddicono la semantica).

| # | SWATCH / PATTERN (descrizione visiva; no HEX) | USER-FACING (IT ufficiale) | STATO |
| --- | --- | --- | --- |
| 1 | Rosso **pieno** | Max 0 metri AGL | **PROVEN** |
| 2 | Rosso con **righe diagonali** (fondo rosso / bande chiare) | Max 0 metri AGL | **PROVEN** |
| 3 | Arancione **pieno** | Max 25 metri AGL | **PROVEN** |
| 4 | Giallo **pieno** | Max 45 metri AGL | **PROVEN** |
| 5 | Azzurro/ciano **pieno** | Max 60 metri AGL | **PROVEN** |
| 6 | Verde **pieno** | Max 120 metri AGL | **PROVEN** |
| 7 | Chiaro/bianco-azzurro con **bordo** sottile | Max 120 metri AGL | **PROVEN** |
| 8 | Rosso con **pattern denso** dedicato (Area pericolosa) | Area pericolosa | **PROVEN** |

| Conteggio SWATCH↔USER-FACING | N |
| --- | ---: |
| **PROVEN** | **8** |
| **PARTIAL** | **0** |
| **UNKNOWN** | **0** (sulle 8 righe legenda ATM09 dell’asset) |

**Risoluzioni UX:** split 60 vs 120 **PROVEN** (ciano vs verde + secondo 120 bordato) · doppio 0 **PROVEN** · Area pericolosa **PROVEN** (swatch dedicato).

### 6.3 TECH WMS ↔ SWATCH GetLegendGraphic (REFERENCE-C4) — stessa riga PNG helper

Helper LIVE effettivo: `http://100.114.7.53:8010/atm09/legend.png` · HTTP **200** · `image/png` · **3378** B · **181×189** · 9 bande contenuto.

| # | TECHNICAL WMS LABEL | SWATCH GLG (stessa riga) | STATO TECH↔SWATCH | NOTE JOIN vs UI ufficiale |
| --- | --- | --- | --- | --- |
| 1 | `geometrie_rosse_scure` | rosso/rosa pieno pastello | **PROVEN** (riga GLG) | pixel **identici** a #2/#3 → **non** discrimina pieno vs diagonale UI |
| 2 | `geometrie_rosse_piene` | rosso/rosa pieno pastello | **PROVEN** (riga GLG) | identico a #1 |
| 3 | `geometrie_rosse_piene` | rosso/rosa pieno pastello | **PROVEN** (riga GLG) | **duplicato** label+#2; quirk GeoServer |
| 4 | `geometrie_verdi` | verde pastello pieno | **PROVEN** (riga GLG) | join a Max 120 verde UI = **PARTIAL** (colore nominale; rendering diverso) |
| 5 | `geometrie_rosse_quadri` | bianco + bordo rosso + **X** diagonale | **PROVEN** (riga GLG) | candidato Area pericolosa / diagonale 0 = **PARTIAL** (pattern non identico all’UI) |
| 6 | `geometrie_arancioni` | arancione pastello pieno | **PROVEN** (riga GLG) | join Max 25 = **PARTIAL** (no HEX; pastello vs UI) |
| 7 | `geometrie_gialle` | giallo pastello pieno | **PROVEN** (riga GLG) | join Max 45 = **PARTIAL** |
| 8 | `geometrie_azzurre` | ciano pastello pieno | **PROVEN** (riga GLG) | join Max 60 = **PARTIAL** |
| 9 | `geometrie_italia` | **nessuno** | **PARTIAL** | label senza swatch |

### 6.4 Triple implementative TECH ↔ SWATCH ↔ USER-FACING

Fail-closed: vietato ordine-solo, colore-nominale-solo, intuizione su `scure`/`piene`.

| STATO | N | Motivo |
| --- | ---: | --- |
| **PROVEN** | **0** | nessuna tripla con swatch GLG **distintivo** e match affidabile allo swatch UI ufficiale |
| **PARTIAL** | **8** | coppie SWATCH↔USER-FACING PROVEN + TECH GLG noti, ma join ambiguo |
| **UNKNOWN** | residui | secondo 120 bordato / diagonale 0 senza controparte GLG distinta; `geometrie_italia` |

Gate: **Caso C2**.

### 6.5 CROP SPEC (diagnostica GLG)

| Voce | Valore |
| --- | --- |
| PNG | 181×189 · 3378 B |
| Bande y (contenuto) | 3–18, 24–39, 45–60, 66–81, 87–102, 108–123, 129–144, 150–165, 172–186 |
| Altezza riga tipica | **15** px (ultima 14) |
| Gap tipico | **6** px |
| Colonna swatch | circa x0–24 |
| **CROP SPEC** | **PROVEN** (geometria GLG misurata) — **non** sblocca triple |

---

## 7. Strategie architetturali valutate (AUDIT D)

### A. HTML/CSS + swatch ricostruiti

- **Pro:** controllo testo i18n; layout esterno.
- **Limiti:** richiede colori/pattern/ordine/mapping deterministici.
- **Failure:** inventare HEX/CSS hatch «a occhio».
- **Manutenzione:** alta se stile upstream cambia.
- **Categoria:** N/A finché mapping assente.
- **GO / NO-GO:** **NO-GO** allo stato attuale (valori non PROVEN).

### B. Riuso/crop PNG GetLegendGraphic

- **Pro:** pixel ufficiali; nessun nuovo endpoint; allineato a helper 0.1.3.
- **Limiti:** layout GeoServer può cambiare; label tecniche ancora nel PNG se non croppate via; crop coords non misurate ora.
- **Failure:** layout upstream drift; OCR/crop fragile.
- **Manutenzione:** media (selftest dimensionali).
- **Categoria futura:** ROUTINE se crop stabile + mapping testo.
- **GO / NO-GO:** **GO condizionato** (dopo mapping + misura crop).

### C. Elaborazione browser (canvas)

- **Pro:** crop/nascondi testo tecnico in-client.
- **Limiti:** complessità; failure modes; same-origin helper OK (no CORS tipico); single-file ok.
- **Manutenzione:** alta.
- **Categoria:** ROUTINE-alta / borderline.
- **GO / NO-GO:** **secondaria** rispetto a B/E.

### D. Nuovo endpoint/helper normalizzato

- **Pro:** JSON legend entries / SLD parse / swatch isolati server-side.
- **Limiti:** rete/helper change; auth invariata ma superficie nuova.
- **Categoria futura:** **DELICATO**.
- **GO / NO-GO:** **NO-GO per AUDIT-A**; riservato se B/E non affidabili.

### E. Ibrida (raccomandata)

- Pixel ufficiali (crop swatch da GetLegendGraphic o img sprites) + **testo user-facing** controllato in monolite (i18n IT).
- Evita HEX inventati; evita nuovo endpoint **se** crop stabile.
- Integra arbitration IMPL-A (visibilità solo mode `"atm09"`).
- Anchor statico minimale (non drag / non dock — fuori E/F/G).

| | |
| --- | --- |
| **Raccomandazione** | **E (ibrida)** come target minimo post-mapping |
| **Categoria se mapping+crop OK** | **ROUTINE** |
| **Escalation** | **D (helper)** → **DELICATO** |

---

## 8. Decisione tecnica

**Caso C2** (REFERENCE-C) — SWATCH↔USER-FACING **PROVEN (8)**; TECH↔SWATCH GLG acquisito; **triple implementative 0 PROVEN** (join ambiguo, soprattutto rossi identici).

| Campo | Valore |
| --- | --- |
| CURRENT GATE | **OFFICIAL LABEL↔STYLE MAPPING REQUIRED** |
| NEXT | chiudere join TECH↔pattern UI: `geometrie_rosse_scure` vs `geometrie_rosse_piene` (GLG identici) ↔ Max 0 pieno / Max 0 diagonale / Area pericolosa; verificare `geometrie_rosse_quadri` ↔ Area pericolosa; secondo 120 bordato / `geometrie_italia` — **NON IMPL-A** |
| HELPER BASE EFFECTIVE | `http://100.114.7.53:8010` (`dflightHelperBaseUrl` = `location.hostname:8010`; LIVE Tailnet da config/WU-0017) |
| CROP SPEC | **PROVEN** (geometria GLG) |
| Architettura post-gate | **E ibrida** (invariata) |
| Runtime / helper | **invariati** |

---

## 8ter. REFERENCE-C — official D-Flight legend asset

**Blocco:** `D-FLIGHT-ATM09-LEGEND-UX-REFERENCE-C` · **CLOSED / PASS** · 2026-08-16 · docs-only.

### C1 — Pagina + asset

| Voce | Valore |
| --- | --- |
| Pagina | https://www.d-flight.it/new_portal/d-flight-disponibili-le-zone-geografiche-uas-nel-formato-standard-comunitario/ |
| Data | **2 agosto 2024** |
| Asset | https://www.d-flight.it/new_portal/wp-content/uploads/2024/08/d-flight-download-GeoUAS.png |
| Dominio | `d-flight.it` · asset **collegato** nella pagina |
| Immagine | 960×422 RGB · web-app D-Flight · legenda **ATM09** visibile |
| TEMP | `%TEMP%\atm09-ref-c\` — **non** in repo |

### C2 — SWATCH ↔ USER-FACING

Otto righe PROVEN (§6.2). Localizzazione: IT «Max N metri AGL» / «Area pericolosa» vs R2 EN «Height N meters AGL» / «Dangerous Area» — semantica allineata; stringa non congelata cross-locale. L10N-FREEZE: nessuna nuova EN/FR in questo blocco.

### C3 — Helper base effettivo

| Voce | Valore |
| --- | --- |
| Runtime | `dflightHelperBaseUrl()` → `{protocol}//{location.hostname}:8010` · `DFLIGHT_HELPER_PORT=8010` |
| Config esempio / smoke LIVE | host Tailnet **`100.114.7.53`** |
| **HELPER BASE EFFECTIVE** | **`http://100.114.7.53:8010`** |
| `127.0.0.1:8010` / `localhost:8010` | **TCP_REFUSAL** (nessun listener locale) |

### C4 — GetLegendGraphic

| Voce | Valore |
| --- | --- |
| URL | `http://100.114.7.53:8010/atm09/legend.png` |
| Esito | HTTP **200** · `image/png` · 3378 B · 181×189 |
| Classificazione | **HTTP 200 valido** (Tailnet raggiungibile da questa sessione) |
| TECH labels | §6.3 (incl. doppio `geometrie_rosse_piene`; `geometrie_italia` senza swatch) |

### Esito livelli

| Livello | Conteggio |
| --- | --- |
| SEMANTICA | PROVEN **4** |
| SWATCH↔USER-FACING | PROVEN **8** / PARTIAL **0** / UNKNOWN **0** |
| TRIPLE IMPLEMENTATIVE | PROVEN **0** / PARTIAL **8** / UNKNOWN residui |
| CROP SPEC | **PROVEN** |

**Gate:** Caso **C2**.

---

## 8bis. REFERENCE-B — official semantic mapping evidence

**Blocco:** `D-FLIGHT-ATM09-LEGEND-UX-REFERENCE-B` · **CLOSED / PASS** · 2026-08-16 · docs-only.

### B1 — ENAC pagina ufficiale

URL: https://www.enac.gov.it/sicurezza-aerea/droni/zone-geografiche-space/voli-con-droni-uas-limitazioni-riserve-dello/

Citazione verificata (safety su d-flight): le zone sono «rappresentate su d-flight con colori diversi»; «in funzione del colore, la zona geografica inizia a una altezza diversa (es: "zona rossa" 0 mt, "zona arancione" 25 mt, etc)».

| ID | Semantica registrata |
| --- | --- |
| **REFERENCE-B1-RED** | AREA ROSSA / zona rossa ↔ **0 m AGL** (dal suolo) |
| **REFERENCE-B1-ORANGE** | AREA ARANCIONE / zona arancione ↔ **25 m AGL** |
| **REFERENCE-B1-YELLOW** | AREA GIALLA ↔ **45 m AGL** (da ATM-09A §6.8–6.11 + Allegato A; ENAC pagina usa «etc» dopo 25 mt) |
| **REFERENCE-B1-OUTER** | area esterna azzurro/blu nelle figure Allegato A ↔ **60 m AGL** in ATZ/CTR **oppure 120 m AGL** fuori spazi controllati |

Distinzione obbligatoria: **SEMANTICA NORMATIVA PROVATA** ≠ **LABEL UI D-FLIGHT ESATTA PROVATA** (stringhe «Height N meters AGL» restano da R2 / UI, non da ENAC).

### B1 — Circolare ATM-09A

URL: https://www.enac.gov.it/app/uploads/2024/04/ATM-09A.pdf (TEMP locale; **non** in repo).

- **§6.8–6.11:** AREA ROSSA (verticale fino a UNL dal suolo); AREA ARANCIONE da 25 m AGL; AREA GIALLA da 45 m AGL; fascia esterna da 60 m (ATZ/CTR) oppure 120 m (fuori controllati).
- **Allegato A pp. 17–18:** figure A.1–A.4 con anelli rosso/arancio/giallo e fondo azzurro/blu etichettato 60/120; **nessun HEX** estratto; PDF figure analizzate solo visualmente (TEMP PNG).
- **Zone D:** definizione «zona D: pericolosa» (§4) e divieto UAS su P/D (§5.3) — **non** identifica un pattern della legenda raster ATM09.

### B2 — D-Flight pagina pubblica Servizi

URL: https://www.d-flight.it/new_portal/servizi-d-flight/

- Tabella geo-consapevolezza: riga **ATM-09** = «Elaborazione d-flight della circolare a partire dai dati riportati sopra» → ATM-09 = elaborazione D-Flight di ATM-09A (**PROVEN** come provenance layer).
- Zone Pericolose (D) elencate come elemento cartografico **separato** (AIP ENR 5.1.3), non come voce della legenda ATM-09.
- **Nessuna** legenda pubblica / manuale / screenshot con label «Height … AGL» o pairing pattern↔label.

**PUBLIC D-FLIGHT LABEL EVIDENCE NOT FOUND** (per label UI esatte e Dangerous Area↔swatch).

### B3 — GetLegendGraphic helper

Tentativo `http://127.0.0.1:8010/atm09/legend.png` e `localhost:8010`: connessione rifiutata / timeout.

Classificazione: **helper non raggiungibile dalla sessione Cursor** (non prova che il servizio prod sia globalmente down). **HELPER LEGEND EVIDENCE UNAVAILABLE**. Nessun WMS diretto; nessun secret. Smoke dimensionale resta quello WU-0017 (181×189 / 3378 B).

### Esito mapping

| Classe | Esito |
| --- | --- |
| Semantica colore↔quota | **PROVEN = 4** (§6.1) |
| TECH↔SWATCH | **0 PROVEN** (helper down) |
| Triple TECH↔SWATCH↔USER-FACING | **0 PROVEN** |
| Dangerous Area | **PARTIAL** |
| Pattern pieno vs tratteggiato | **UNKNOWN** / non discriminato |

**Gate:** Caso **B2** — resta `OFFICIAL LABEL↔STYLE MAPPING REQUIRED`.

---

## 9. Acceptance matrix futuro IMPL-A

Blocco proposto (non aperto): `D-FLIGHT-ATM09-LEGEND-UX-IMPL-A`.

| ID | Scenario | Atteso |
| --- | --- | --- |
| **A** | ATM09 OFF | legenda ATM09 non visibile; non occupa spazio |
| **B** | ATM09 READY + paint atm09 | legenda user-facing; label e swatch **solo** da mapping PROVEN |
| **C** | Master D-Flight ON + ATM09 ON | arbitration build 197 invariata; nessuna doppia legenda competitiva |
| **D** | ATM09 non disponibile / fallback NFZ | non presentare legenda ATM09 come se raster READY; coerente col paint |
| **E** | Ordine | solo ordine supportato da evidenza PROVEN |
| **F** | Mapping | nessuna label user-facing senza mapping PROVEN |
| **G** | Grafica | no colori/pattern inventati; swatch più leggibili; base trasparente/semitrasparente; cartografia leggibile; contrasto; light/dark |
| **H** | Degrado | helper down senza falsi READY; forced-offline / OPSEC invariati |
| **I** | Regressioni vietate | no cambio raster WMS / `ATM09_STYLE` / temporal / master / FIX5 / INFO-hit; no GPS silenzioso; no tracking; no nuovo persist |

---

## 10. Out-of-scope E / F / G / H

| Candidato | Scope | Vietato in D |
| --- | --- | --- |
| **E** | Layout affiancato Zone / Dettagli | lifecycle dialog |
| **F** | Workspace due legende trascinabili | drag/dock workspace |
| **G** | Global minimized-panel dock / layout manager | manager trasversale |
| **H** | Branding TMART GIS tool | rename/branding |

In D: al massimo **anchor statico non trascinabile** se «esterna» lo richiede. Niente persistenza posizione, dock, layout manager.

Roadmap stile futuro (§7 Legenda ATM09 esterna): swatch maggiori, pattern leggibili, fondo trasparente/semitrasparente — resta vincolo prodotto per IMPL, non per questo audit.

---

## 11. Gate e NEXT

| Voce | Valore |
| --- | --- |
| AUDIT-A | **CLOSED / PASS** |
| REFERENCE-B | **CLOSED / PASS** |
| REFERENCE-C | **CLOSED / PASS** |
| RULE-META-DESIGN-A | **CLOSED / PASS** |
| RULE-META-PROBE-A | **BLOCKED** (Caso P4) — superseduto da VPS-B |
| RULE-META-PROBE-VPS-B | **CLOSED / PASS** diagnostico (Caso **B-P2**) |
| STYLE-META-CLOSE-A | **CLOSED / PASS** diagnostico (Caso **M2**) |
| TOPOLOGY-ADJUDICATION-A | **CLOSED / PASS** (Caso **T1**) |
| CURRENT GATE | **READY FOR D-FLIGHT-ATM09-LEGEND-UX-IMPL-A** |
| NEXT | `D-FLIGHT-ATM09-LEGEND-UX-IMPL-A` (ROUTINE; no helper patch) — **NON** aperto qui |
| WU-0018 | **OPEN** |
| E–H | **NOT OPENED** |

---

## TOPOLOGY-ADJUDICATION-A

**Blocco:** `D-FLIGHT-ATM09-LEGEND-UX-TOPOLOGY-ADJUDICATION-A` · **CLOSED / PASS** · 2026-08-16 · Caso **T1** · docs-only (+ misure asset TEMP).

**Principio:** non richiedere 8 USER rows = 8 TECH rules. Ammesso: più TECH → una equivalence class UI; zero TECH → una classe DEFAULT — solo se dimostrato.

### Fonti ufficiali (accesso 2026-08-16)

| ID | Dominio / URL | Fatto pertinente |
| --- | --- | --- |
| **DF-AIRSPACE** | https://www.d-flight.it/new_portal/tipi-di-spazi-aerei/ · titolo **Tipi di Spazi aerei** | Sezione **«Spazi aerei non soggetti a restrizione»** → **Altezza Max (M) = 120m AGL** |
| **DF-SERVICES** | https://www.d-flight.it/new_portal/servizi-d-flight/ · **Servizi d-flight** / geo-consapevolezza | **ATM-09** = «Elaborazione d-flight della circolare…»; pop-up mappa: **Altezza massima consentita**; «In caso di sovrapposizione di diverse regole viene applicata la **più restrittiva**» |
| **ENAC-B1** | già REFERENCE-B · https://www.enac.gov.it/…/voli-con-droni-uas-limitazioni-riserve-dello/ + ATM-09A §6.8–6.11 | Rosso ↔ **0 m**; rimanente / fuori controllati ↔ soglia generale **120 m** (REFERENCE-B1-OUTER / circolare) |
| **DF-ASSET** | https://www.d-flight.it/new_portal/wp-content/uploads/2024/08/d-flight-download-GeoUAS.png (REFERENCE-C) | SWATCH↔USER **8/8** già PROVEN; riusato solo per crop pixel DEFAULT |

Nessun sito terzo. Nessun probe VPS/auth in questo blocco.

### Adjudication `costa` → RED-0-SOLID

| Check | Esito |
| --- | --- |
| C1 symbolizer `costa` ≡ `rosso` | **IDENTICAL** (STYLE-META-CLOSE-A) |
| C2 RULE-PNG `geometrie_rosse_schure` | rosso pieno visibile (stesso tipo swatch) |
| C3 semantica normativa rosso ↔ 0 m | **PROVEN** (REFERENCE-B) |
| C4 UI ufficiale: **una** voce rosso pieno Max 0 (+ diagonale distinta) | **PROVEN** (REFERENCE-C) |
| C5 assenza label «costa» in UI | **supporto** (non prova isolata) |
| INFO feature_count=0 | **CURRENTLY NO FEATURES ≠ NO SEMANTICS** |

**Verdetto:** TECH `geometrie_rosse_schure` / `type='costa'` → **IMPLEMENTATIVE CLASS RED-0-SOLID** → USER-FACING **Max 0 metri AGL** · **PROVEN AS EQUIVALENCE-CLASS MEMBER** · **non** genera voce UI separata.

### Adjudication secondo Max 120 → DEFAULT / NON-RESTRICTED

| Check | Esito |
| --- | --- |
| D1 seconda voce UI Max 120 chiaro/bordato | **PROVEN** (REFERENCE-C) |
| D2 `geometrie_italia` esclusa | opacity 0 · RULE-PNG senza pixel/bordo (STYLE-META-CLOSE-A) |
| D3 nessuna altra rule TECH fornisce quello swatch | **PROVEN** (9/9 JSON: sole alternative già mappate o invisibili) |
| D4 spazio non soggetto a restrizione = **120m AGL** | **PROVEN** (DF-AIRSPACE) |
| D5 mappa: altezza max + regola più restrittiva | **PROVEN** (DF-SERVICES) |
| D6 ENAC soglia generale 120 nel rimanente | **PROVEN** (ENAC-B1 / ATM-09A) |

**Verdetto:** seconda voce **Max 120 metri AGL** = classe **DEFAULT / NO ADDITIONAL ATM09 RESTRICTION** · **TECH SOURCE: NONE** · **PROVEN**.

`geometrie_italia`: **TECH INVISIBLE / NON-LEGEND** — USER-FACING **NONE** (PROVEN non-source del secondo 120).

### Official pixel source — crop DEFAULT 120

Asset TEMP (non in repo): `d-flight-download-GeoUAS.png` · **960×422** · mode **RGB** (no alpha).

| Voce | Valore |
| --- | --- |
| Voce | secondo Max 120 chiaro/bordato (riga 7 UI) |
| **bbox crop** (xyxy, px) | **`[268, 266, 280, 278]`** |
| Dimensioni crop | **12×12** |
| Border | **sì** (dark_border_frac ≈ 0.53 sul perimetro) |
| Fill chiaro/azzurro percepibile | **sì** (fill medio diagnostico chiaro-azzurro; **nessun HEX** usato come stile GOI) |
| Alpha | **non disponibile** (RGB) |
| Ruolo | **OFFICIAL PIXEL SOURCE** per IMPL (alternativa a GetLegendGraphic assente per questa voce) |

**DEFAULT_SWATCH_BACKGROUND_CONSISTENCY:** **PARTIAL** — fill chiaro coerente con aree mappa poco/non colorate ATM09, ma non pixel-identico al basemap; supporto a D4–D6, non sostituto.

### Topology table — 8 voci USER-FACING

| # | USER-FACING | VISUAL SOURCE | TECH SOURCE / EQUIVALENCE CLASS | SEMANTIC SOURCE | IMPLEMENTATION SOURCE | STATUS |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Max 0 metri AGL (pieno) | official red-solid | **RED-0-SOLID** = `type='rosso'` + `type='costa'` (`geometrie_rosse_piene` + `geometrie_rosse_schure`) | ENAC/ATM-09A rosso↔0 | TECH class + label i18n | **PROVEN** |
| 2 | Max 0 metri AGL (diagonale) | official red-diagonal | `type='rosso_righe'` | ENAC rosso↔0 | TECH + i18n | **PROVEN** |
| 3 | Max 25 metri AGL | official orange | `type='arancione'` | ENAC/ATM-09A 25 | TECH + i18n | **PROVEN** |
| 4 | Max 45 metri AGL | official yellow | `type='giallo'` | ATM-09A 45 | TECH + i18n | **PROVEN** |
| 5 | Max 60 metri AGL | official cyan | `type='azzurra'` | ATM-09A 60 (controllati) | TECH + i18n | **PROVEN** |
| 6 | Max 120 metri AGL (verde) | official green | `type='verde'` | ATM-09A / UI split 120 | TECH + i18n | **PROVEN** |
| 7 | Max 120 metri AGL (chiaro/bordato) | **official asset crop** bbox sopra | **NONE / DEFAULT** | DF non-restricted 120 + ENAC 120 | official crop + i18n | **PROVEN** |
| 8 | Area pericolosa | official pattern | `type='rosso_quadri'` (`shape://times`) | UI + AIP Zone D (contesto) | TECH + i18n | **PROVEN** |

### Contatori

| Livello | Stato |
| --- | --- |
| SEMANTICA NORMATIVA | PROVEN **4** |
| SWATCH↔USER | PROVEN **8/8** |
| TECH↔RULE | PROVEN **9/9** |
| USER-FACING IMPLEMENTATIVE SOURCE | PROVEN **8/8** |
| TECH RULE WITHOUT DISTINCT USER ROW | `costa` / `geometrie_rosse_schure` (∈ RED-0-SOLID); `italia` (invisible / non-legend) |
| USER ROW WITHOUT TECH RULE | secondo Max 120 chiaro/bordato (**DEFAULT**) |

### Gate / NEXT

| Campo | Valore |
| --- | --- |
| TOPOLOGY-ADJUDICATION-A | **CLOSED / PASS** (Caso **T1**) |
| CURRENT GATE | **READY FOR D-FLIGHT-ATM09-LEGEND-UX-IMPL-A** |
| NEXT | `D-FLIGHT-ATM09-LEGEND-UX-IMPL-A` · categoria **ROUTINE** · no helper patch · **NON** implementare qui |
| TEMP CLEANUP | **PASS** (asset/crop solo TEMP) |

---

## STYLE-META-CLOSE-A

**Blocco:** `D-FLIGHT-ATM09-LEGEND-UX-STYLE-META-CLOSE-A` · **CLOSED / PASS** diagnostico · 2026-08-16 · Caso **M2**.

### Review

**REVIEW GPT-SOSTITUTIVA UPSTREAM — PASS** (autorizzazione probe mirato costa/italia + ATM09_INFO CQL chiuso).

### Contesto

| Voce | Valore |
| --- | --- |
| SSH | Host **`ionos-n8n`** |
| Transient | `systemd-run --wait --collect` + LoadCredential (contratto live) |
| Script TEMP | creato via **scp** (no quoting PowerShell→Python) · 0600 · owner `goi-dflight` |
| Credential exposure | **NO** |
| TEMP CLEANUP | **PASS** |
| Helper live post | **active** |

### Probe A — full symbolizer JSON (re-probe)

| Voce | Valore |
| --- | --- |
| HTTP / MIME / bytes | **200** / `application/json` / **2828** |
| Rule count | **9** |
| `costa` symbolizers (canon) | `[{"Polygon":{"fill":"#FF0000","fill-opacity":"0.3"}}]` |
| `rosso` symbolizers (canon) | `[{"Polygon":{"fill":"#FF0000","fill-opacity":"0.3"}}]` |
| `italia` symbolizers (canon) | `[{"Polygon":{"fill":"#FF9900","fill-opacity":"0.0"}}]` |
| **COSTA_STYLE_EQUIVALENCE** | **IDENTICAL** |

(Hex = evidenza upstream, non CSS GOI.)

### Probe B — RULE-specific PNG (Name allowlist)

| RULE (Name) | HTTP | MIME | bytes | size | Finding |
| --- | --- | --- | --- | --- | --- |
| `geometrie_rosse_schure` | 200 | image/png | 120 | 21×21 RGB | pixel non-bianchi presenti; coerenza con fill rosso pieno; **nessun** pattern distinto vs equivalenza JSON |
| `geometrie_italia` | 200 | image/png | 88 | 21×21 RGB | **nessun** pixel non-bianco; **nessun** stroke/bordo visibile; coerente con fill-opacity 0.0; **non** coerente con swatch ufficiale «chiaro/bordato» |

### Probe C — ATM09_INFO WFS (CQL chiuso)

| Query | HTTP | MIME | feature_count | Distinct allowlisted |
| --- | --- | --- | --- | --- |
| `type='costa'` | 200 | application/json | **0** | tutti i campi distinct **vuoti** |
| `type='italia'` | 200 | application/json | **0** | tutti i campi distinct **vuoti** |

`viewparams=build_viewparams()` · `maxFeatures=50` · `propertyName` allowlist · typename `D-FLIGHT:ATM09_INFO`. Nessun raw persistito.

### Mapping finale residui

| Target | Esito | Motivo fail-closed |
| --- | --- | --- |
| `costa` / `geometrie_rosse_schure` → Max 0 | **PARTIAL** | COSTA-C1 **A** soddisfatto (symbolizer ≡ `rosso`); **B** fallisce (INFO feature_count 0 → nessuna quota/regola). COSTA-C2 non applicabile (nessuna metadata «interna»). |
| Secondo Max 120 ↔ `geometrie_italia` | **NOT PROVEN** | INFO feature_count 0; RULE-PNG senza bordo/pixel → **non** soddisfa criterio C (coerenza chiaro/bordato). |
| Funzione `geometrie_italia` | **PARTIAL (tecnica)** | Rule TECH con fill invisibile; non classificata INTERNAL PROVEN (manca metadata strutturata); **esclusa** come fonte del secondo Max 120 su base PNG. |

### Contatori

| Livello | Stato |
| --- | --- |
| SEMANTICA NORMATIVA | PROVEN **4** (invariato REFERENCE-B) |
| SWATCH↔USER-FACING | PROVEN **8** (invariato REFERENCE-C) |
| TECH↔RULE/SYMBOLIZER | PROVEN **9 / 9** |
| USER-FACING IMPLEMENTATIVE MAPPING | PROVEN **7 / 8** |
| Residui | (1) `costa`/`scure` user-facing; (2) secondo Max 120 (fonte ≠ `italia` PNG) |

### Gate / NEXT

| Campo | Valore |
| --- | --- |
| STYLE-META-CLOSE-A | **PASS** diagnostico (Caso **M2**) |
| CURRENT GATE | **ATM09 STYLE METADATA SOURCE REQUIRED** |
| NEXT | solo i due residui sopra — NON endpoint automatico; NON IMPL-A |

---

## RULE-META-PROBE-VPS-B

**Blocco:** `D-FLIGHT-ATM09-LEGEND-UX-RULE-META-PROBE-VPS-B` · **CLOSED / PASS** diagnostico · 2026-08-16 · Caso **B-P2**.

### Contesto esecuzione

| Voce | Valore |
| --- | --- |
| Sessione Cursor iniziale | Windows (AsusDesktop) — **normale** prima del SSH |
| Connessione VPS canonica | Host SSH **`ionos-n8n`** (già configurato; nessun IP/porta hardcodati nel probe) |
| VPS context | Linux · helper `/opt/goi-dflight-helper/current/goi_dflight_helper.py` · `/etc/goi-dflight/config.toml` · `goi-dflight-helper.service` **active** |
| Unit contract live | `User`/`Group=goi-dflight` · `WorkingDirectory=/opt/goi-dflight-helper/current` · `GOI_DFLIGHT_CONFIG=/etc/goi-dflight/config.toml` · `LoadCredential` username+password paths attesi — **coerente** |
| Transient | `systemd-run --wait --collect` · User/Group helper · stessi LoadCredential · hardening compatibile · **nessun** restart/enable/daemon-reload del live |
| Credential exposure | **NO** (nessun cat credential / environ / token stampato) |
| Helper live post-probe | **active** (invariato) |
| TEMP CLEANUP | **PASS** |

### Probe 1 — GetLegendGraphic JSON

| Voce | Valore |
| --- | --- |
| JSON_CAPABILITY | **SUPPORTED** |
| HTTP | **200** |
| MIME | `application/json` |
| Byte count | **2828** |
| Legend count | **1** |
| Rule count | **9** |
| Auth | `ensure_access_token` via LoadCredential; `cred_dir_present=true` (path non stampato) |
| 401 / reauth | non richiesto (primo GET 200) |

### Rules sanitizzate (evidenza upstream — non CSS GOI)

| # | Name | Title | Filter | Symbolizer (sintesi) |
| --- | --- | --- | --- | --- |
| 0 | `geometrie_rosse_schure` (**typo Name** vs title) | `geometrie_rosse_scure` | `[type = 'costa']` | Polygon fill `#FF0000` opacity **0.3** |
| 1 | `geometrie_rosse_piene` | `geometrie_rosse_piene` | `[type = 'rosso']` | Polygon fill `#FF0000` opacity **0.3** |
| 2 | `geometrie_rosse_piene` (title duplicato) | `geometrie_rosse_piene` | `[type = 'rosso_righe']` | Polygon fill `#FF0000` opacity **0.3** — **duplicato spiegato dal filter diverso** |
| 3 | `geometrie_verdi` | `geometrie_verdi` | `[type = 'verde']` | Polygon fill `#287233` opacity **0.3** |
| 4 | `geometrie_rosse_quadri` | `geometrie_rosse_quadri` | `[type = 'rosso_quadri']` | stroke + **graphic-fill** mark `shape://times` |
| 5 | `geometrie_arancioni` | `geometrie_arancioni` | `[type = 'arancione']` | Polygon fill `#FF6F00` opacity **0.3** |
| 6 | `geometrie_gialle` | `geometrie_gialle` | `[type = 'giallo']` | Polygon fill `#FFF200` opacity **0.3** |
| 7 | `geometrie_azzurre` | `geometrie_azzurre` | `[type = 'azzurra']` | Polygon fill `#00FFFF` opacity **0.3** |
| 8 | `geometrie_italia` | `geometrie_italia` | `[type = 'italia']` | Polygon fill `#FF9900` opacity **0.0** → spiega assenza swatch GLG |

Hex/fill = **EVIDENZA UPSTREAM**, non restyle GOI. Nessun raw JSON / URL autenticato / Authorization persistiti.

### Probe 2 — RULE-specific

| Voce | Valore |
| --- | --- |
| Eseguito con evidenza | **NO** (tentativo su allowlist `geometrie_italia` fallito: script TEMP corrotto da quoting → `SyntaxError`; nessun PNG validato) |
| Cleanup TEMP / PNG | **PASS** (dir `/tmp/atm09-rulemeta.*` rimossa) |

### Mapping fail-closed (join TECH / rule / user)

| Target | Esito | Note |
| --- | --- | --- |
| A. `geometrie_rosse_scure` | **UNKNOWN / PARTIAL** | Filter `costa` — non label quota user-facing; Name typo `schure` |
| B. due `geometrie_rosse_piene` | **PROVEN (perché duplicate)** | Stesso Title/Name; filter `rosso` vs `rosso_righe` |
| B. Max 0 pieno ↔ `type='rosso'` | **PROVEN (join)** | Filter + Title TECH + SWATCH↔USER Max 0 pieno (REFERENCE-C) |
| B. Max 0 diagonale ↔ `type='rosso_righe'` | **PROVEN (join)** | Filter semantico `righe` + dual Max 0 ufficiale |
| C. `geometrie_rosse_quadri` ↔ Area pericolosa | **PROVEN** | `shape://times` univoco + prior swatch Area pericolosa |
| D. arancioni ↔ Max 25 | **PROVEN (join)** | `type='arancione'` + SWATCH↔USER |
| E. gialle ↔ Max 45 | **PROVEN (join)** | `type='giallo'` + SWATCH↔USER |
| F. azzurre ↔ Max 60 | **PROVEN (join)** | `type='azzurra'` + SWATCH↔USER |
| G. verdi ↔ Max 120 | **PROVEN (join)** | `type='verde'` + SWATCH↔USER |
| H. secondo Max 120 chiaro/bordato | **PARTIAL** | Candidato `italia` (opacity 0 / no swatch) — **non** PROVEN senza metadata/RULE-PNG |
| I. `geometrie_italia` | **PARTIAL** | Funzione: layer `italia`, fill invisibile (opacity 0); motivo no-swatch **PROVEN**; semantica user-facing **non** chiusa |

### Contatori

| Livello | Stato |
| --- | --- |
| JSON_CAPABILITY | **SUPPORTED** |
| SEMANTICA (REFERENCE-B) | PROVEN **4** (invariato) |
| SWATCH↔USER-FACING (REFERENCE-C) | PROVEN **8** (invariato) |
| TECH↔RULE/SYMBOLIZER | **PROVEN 9 / 9** (Name/Title/Filter/Symbolizer presenti) |
| TRIPLE IMPLEMENTATIVE necessarie | **incomplete** — mancano scure/costa + secondo Max 120 |
| Probe 2 RULE | **non conclusivo** |

### Associazioni mancanti (gate B-P2)

1. `geometrie_rosse_scure` / `type='costa'` ↔ label user-facing ufficiale (se esiste).
2. Secondo Max 120 chiaro/bordato ↔ rule TECH esatta (`italia` resta solo candidato).

### Gate / NEXT

| Campo | Valore |
| --- | --- |
| RULE-META-PROBE | **PASS** (diagnostico; Caso B-P2) |
| CURRENT GATE | **ATM09 STYLE METADATA SOURCE REQUIRED** |
| NEXT | fonte metadata / Probe2 mirato sulle sole ambiguità residue — NON endpoint automatico; NON IMPL-A |

---

## RULE-META-PROBE-A

**Blocco:** `D-FLIGHT-ATM09-LEGEND-UX-RULE-META-PROBE-A` · **BLOCKED** · 2026-08-16 · Caso **P4**.

### Review

**REVIEW GPT-SOSTITUTIVA UPSTREAM — PASS**

Categoria: RETE / PROXY / AUTH / OPSEC — DELICATO.

Checklist (approvata prima dell’esecuzione): nessuna nuova destinazione runtime; nessun endpoint locale; nessuna modifica `/atm09/legend.png`; nessun bind/CORS; nessun deploy/restart; nessuna credential nel monolite/docs/stdout; request ATM09 hard-coded; Probe 1 `format=application/json` hard-coded; nessun parametro client arbitrario; Probe 2 solo allowlist da Probe 1; timeout/byte cap/MIME fail-closed; output TEMP; helper 0.1.3 invariato; STOP su dubbio auth.

Questo verdetto autorizza **solo** il probe specificato — non patch/deploy/IMPL-A.

### Metodo tentato

One-shot TEMP riusando primitive helper (`load_config` / `AuthClient` / `http_get_bytes_capped` / `build_atm09_legend_url` variant JSON) **senza** patch repo.

### Esito esecuzione

| Check | Risultato |
| --- | --- |
| Config locale (`GOI_DFLIGHT_CONFIG` / `/etc/goi-dflight/config.toml`) | **assente** in sessione Cursor Windows |
| `CREDENTIALS_DIRECTORY` / credential files | **assente** |
| Helper Tailnet `http://100.114.7.53:8010/status` | HTTP **200** (servizio vivo) |
| Route helper JSON | **inesistente** (PNG chiuso; query non forwarded — DESIGN-A) |
| SSH VPS `100.114.7.53:22` | **timeout** (BatchMode) |
| Request upstream GetLegendGraphic JSON | **NON ESEGUITA** |
| Credential exposure | **NO** |

**ONE-SHOT EXECUTION CONTEXT BLOCKED**

Requisito operativo mancante (senza chiedere secret):

> Contesto di esecuzione sul **VPS Tailnet** dove il servizio helper ha già `config.toml` + systemd `LoadCredential` (`CREDENTIALS_DIRECTORY`), tale da poter costruire la request chiusa GetLegendGraphic `format=application/json` con le stesse primitive auth del helper, scrivere solo output TEMP sanitizzato, e riportare l’evidenza in docs — **senza** copiare username/password/token verso Cursor.

### Capability / mapping

| Livello | Stato |
| --- | --- |
| JSON_CAPABILITY | **INCONCLUSIVE** (probe non eseguito) |
| SEMANTICA | PROVEN **4** (invariato REFERENCE-B) |
| SWATCH↔USER-FACING | PROVEN **8** (invariato REFERENCE-C) |
| TECH↔RULE/SYMBOLIZER | PROVEN **0** / PARTIAL **0** / UNKNOWN **n** (non acquisito) |
| TRIPLE IMPLEMENTATIVE | PROVEN **0** (invariato) |
| Probe 2 RULE | **non eseguito** (Probe 1 non avviato) |
| TEMP CLEANUP | **N/A** (nessun raw creato) |

### Gate / NEXT

| Campo | Valore |
| --- | --- |
| CURRENT GATE | **DELICATE RULE-META PROBE EXECUTION CONTEXT REQUIRED** |
| NEXT | rieseguire RULE-META-PROBE-A sul VPS in credential context; NON aprire endpoint permanente automaticamente |

---

## RULE-META-DESIGN-A

**Blocco:** `D-FLIGHT-ATM09-LEGEND-UX-RULE-META-DESIGN-A` · **CLOSED / PASS** · 2026-08-16 · **DESIGN ONLY** (nessun probe, nessun patch helper/runtime).

### 1. Finding helper corrente (0.1.3) — verificato nel codice

| Voce | Evidenza |
| --- | --- |
| Layer/style hard-coded | `ATM09_LAYER` / `ATM09_STYLE` — `goi_dflight_helper.py` ~49–50 |
| URL PNG chiuso | `build_atm09_legend_url()` ~600–621 forza: `service=WMS` · `version=1.1.1` · `request=GetLegendGraphic` · `layer`/`style` ATM09 · `format=image/png` · `width=20` · `height=20` · `legend_options=fontSize:12;dpi:96` |
| Fetch | `fetch_atm09_legend()` ~1283–1311 — usa solo `build_atm09_legend_url`; `Accept: image/png,*/*`; MIME must contain `image/png`; byte cap `ATM09_LEGEND_BYTE_CAP` |
| Route | `GET /atm09/legend.png` ~1572–1583: `path_only = self.path.split("?", 1)[0]` → **query client ignorata**; chiama `fetch_atm09_legend()` **senza** parametri client |
| Conseguenza | client **non può** oggi ottenere `format=application/json` né `RULE=…` tramite helper |

### 2. Capability GeoServer (documentazione primaria) — CAPABILITY CANDIDATE

Fonte: [GetLegendGraphic](https://docs.geoserver.org/latest/en/user/services/wms/get_legend_graphic/) · [SLD Rules](https://docs.geoserver.org/stable/en/user/styling/sld/reference/rules/).

| Voce | Stato |
| --- | --- |
| Parametro opzionale `RULE` | Documentato — singola rule dello style |
| `format=application/json` | Documentato da GeoServer **≥ 2.15.0** |
| JSON tipico | `Legend[]` → `rules[]` con `title`, `filter` (ECQL), `symbolizers` (Polygon/Line/… fill/stroke/…), eventuale `ElseFilter` |
| SLD Rule | `Name` · `Title` (usato in legende) · `Filter` · Symbolizer(s) |
| Supporto server D-Flight | **NON PROVATO** — resta CAPABILITY CANDIDATE finché probe DELICATO non conferma |

Le stringhe PNG (`geometrie_rosse_*`, …) possono essere Title o Name: **non** assumere validità come `RULE=` senza metadata.

### 3. Problema residuo (REFERENCE-C)

PNG 181×189 · 9 bande · swatch #1/#2/#3 **pixel-identici** · `rosse_quadri` solo candidato · `italia` senza swatch · UI: due Max 0, due Max 120, Area pericolosa. **Ulteriore confronto grafico composito = vietato** come metodo di chiusura.

### 4. Opzioni A–D

| Opzione | Descrizione | GO / NO-GO | Note |
| --- | --- | --- | --- |
| **A — One-shot diagnostic** | Script/comando VPS o repo esplicito; riusa auth/config helper; GetLegendGraphic JSON hard-coded; output TEMP sanitizzato; **nessun** endpoint HTTP nuovo; **nessun** deploy helper live | **GO (raccomandata)** | Minimo privilegio per evidenza una tantum |
| **B — Endpoint diagnostico chiuso** | es. `GET /atm09/legend-meta` hard-coded JSON; stessi gate bind/CORS; no-store | **GO condizionato** | Solo se A non operativa (service user / VPS) |
| **C — Estensione `/atm09/legend.png?...`** | `?format=json` / `?rule=` inoltrati | **NO-GO** | Amplifica proxy; rompe contratto chiuso; parametri arbitrari |
| **D — Endpoint runtime normalizzato** | entries per monolite futuro | **NO-GO ora** | Prematuro; valutare solo dopo mapping chiuso e bisogno runtime reale |

### 5. Threat / risk matrix (A)

| Rischio | Mitigazione design |
| --- | --- |
| Credential / auth upstream | Solo primitive helper esistenti; mai nel monolite; mai nei docs/report |
| URL autenticato / token in log | Vietato; log solo status/MIME/byte count sanitizzati |
| Superficie rete | Nessuna porta nuova; nessun endpoint; Tailnet bind invariato |
| Proxy parametrico | Vietato; layer/style/request/format **hard-coded** |
| RULE client | Solo allowlist da metadata già ottenuta — mai stringa arbitraria |
| OPSEC | Stessi timeout/byte cap; MIME allowlist `application/json`; TEMP + cleanup |
| Live helper 0.1.3 | **Invariato** in DESIGN-A e preferibilmente anche nel probe one-shot |

### 6. Soluzione raccomandata — Caso **D1**

**RECOMMENDED:** **ONE-SHOT RULE-META PROBE**

**CURRENT GATE:** `DELICATE RULE-META PROBE REVIEW REQUIRED`

Categoria: **DELICATO** (OM §4 Regola B — rete/tile/proxy + auth upstream). Review: reviewer AI esterno upstream **oppure** REVIEW GPT-SOSTITUTIVA con checklist rete/proxy/OPSEC **prima** di esecuzione.

### 7. Probe futuro (NON eseguito in DESIGN-A)

**Probe 1 — JSON GetLegendGraphic**

- Costruire URL chiuso analogo a `build_atm09_legend_url` ma `format=application/json` (e Accept JSON).
- Success: HTTP 200 · MIME JSON · `rules[]` con title/filter/symbolizers leggibili · nessuna secret · sufficiente a discriminare regole rosse (e correlati).
- Failure: format unsupported · GeoServer &lt;2.15 · auth denied · schema inatteso · metadata insufficiente → fail-closed; non inventare join.

**Probe 2 — RULE** (solo se Probe 1 passa e serve isolamento)

- `RULE=` da **Name** (o identificatore documentato nel JSON), **allowlist** da Probe 1.
- Success: simbolo/rule isolata con associazione deterministica.
- Failure: stringhe PNG non sono RULE id → non forzare.

**Fallback fail-closed:** se JSON assente/insufficiente → gate `ATM09 STYLE METADATA SOURCE REQUIRED` (Caso D3) senza promote a PROVEN.

Hex/fill nel JSON = **evidenza diagnostica upstream**, non stile GOI.

### 8. Review gate obbligatorio prima dell’esecuzione

1. Specifica/prompt probe DELICATO completa (scope, comandi, TEMP, sanitizzazione, stop conditions).
2. Review OM §4 Regola B (esterna o GPT-SOSTITUTIVA checklist rete/proxy).
3. Solo dopo PASS review → esecuzione one-shot.
4. Report sanitizzato → aggiornamento matrice WU-0018.
5. **NON** patch helper/deploy salvo fallimento A e nuova decisione B.
6. **NON** IMPL-A finché triple necessarie non sono PROVEN.

### 9. NEXT

Preparare specifica/prompt di esecuzione del probe DELICATO e sottoporla al gate review — **senza** eseguire il probe in questo blocco.

---

## 12. Riferimenti

- [`WU-0017-dflight-atm09-visual-parity.md`](WU-0017-dflight-atm09-visual-parity.md) — R1–R6, familiarity-first, matrice paint, IMPL-A CLOSED
- [`WU-0005-0009-roadmap.md`](WU-0005-0009-roadmap.md) — candidato D + §7 stile futuro
- Monolite: `dflightAtm09LegendUrl`, `dflightAtm09EnsureLegend`, `dflightLegendPaintMode`, `dflightSyncContextualLegends` (tip LIVE `d2d3ab3`)
- Helper: `build_atm09_legend_url`, `fetch_atm09_legend`, route `/atm09/legend.png` (0.1.3)
- GeoServer GetLegendGraphic JSON/RULE (docs ufficiali) — CAPABILITY CANDIDATE
- OM §4 Regola B (DELICATO) · OM §7.1 FRONTIER (stato vivo)
