# WU-0018 — D-FLIGHT-ATM09-LEGEND-UX

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN
**ACTIVE BLOCK:** D-FLIGHT-ATM09-LEGEND-UX-AUDIT-A (CLOSED / PASS)
**CURRENT GATE:** OFFICIAL LABEL↔STYLE MAPPING REQUIRED
**REVIEW BASE:** monolite tip `d2d3ab34adf7e30e07771c0edcf0e2700e931715` · build **197**
**RUNTIME LIVE:** monolite tip `d2d3ab34adf7e30e07771c0edcf0e2700e931715` · build **197** · `APP_BUILD_ID=D-FLIGHT-ATM09-VISUAL-PARITY-IMPL-A` · helper **0.1.3**
**CATEGORIA:** AUDIT-A = DOCS-ONLY / READ-ONLY RUNTIME · IMPL-A futura = **condizionata** (preferenza **E ibrida** → ROUTINE se mapping PROVEN + crop stabile; altrimenti endpoint helper → DELICATO)
**ORIGINE:** backlog QA build 183 candidato **D** — Legenda ATM09 esterna / label user-facing
**NEXT:** acquisire esclusivamente evidenza autorevole mancante per completare la matrice label ↔ swatch ↔ significato (NON aprire IMPL-A)
**NOTE:** AUDIT-A CLOSED / PASS 2026-08-16 · helper legend endpoint non raggiungibile in sessione (`HELPER LEGEND EVIDENCE UNAVAILABLE`) · smoke dimensioni da WU-0017 (repo)
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

## 6. Matrice label ↔ swatch ↔ significato (AUDIT C)

Stati ammessi: **PROVEN** | **PARTIAL** | **UNKNOWN**. Fail-closed.

| TECHNICAL WMS LABEL | OFFICIAL USER-FACING LABEL | SWATCH / PATTERN | EVIDENZA | STATO | NOTE |
| --- | --- | --- | --- | --- | --- |
| `geometrie_rosse_scure` | — | — | R5 (esempio tecnico) | **UNKNOWN** | nessuna associazione user-facing |
| `geometrie_rosse_piene` | — | — | R5 | **UNKNOWN** | idem |
| `geometrie_verdi` | — | — | R5 | **UNKNOWN** | idem |
| — | Height 0 meters AGL | — | R2 | **PARTIAL** | label user-facing ratificata; manca tech + swatch |
| — | Height 25 meters AGL | — | R2 | **PARTIAL** | idem |
| — | Height 45 meters AGL | — | R2 | **PARTIAL** | idem |
| — | Height 60 meters AGL | — | R2 | **PARTIAL** | idem |
| — | Height 120 meters AGL | — | R2 | **PARTIAL** | idem |
| — | Dangerous Area | — | R2 | **PARTIAL** | idem |
| *(ulteriori entry GetLegendGraphic)* | *(eventuali altre label ufficiali)* | rosso pieno / hatch / arancio / … (R2) | R2 + R5 | **UNKNOWN** | elenco user-facing **non** esaustivo; pattern osservati senza HEX e senza pairing |

**Conteggi:**

| STATO | N |
| --- | ---: |
| **PROVEN** | **0** |
| **PARTIAL** | **6** |
| **UNKNOWN** | **≥3** (label tecniche esemplificate) + residuali non enumerati |

Una matrice incompleta **non** fallisce AUDIT-A: è il finding che determina il gate (Caso 2).

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

**Caso 2** — mapping label ↔ stile **non** completamente provato (PROVEN = 0).

| Campo | Valore |
| --- | --- |
| CURRENT GATE | **OFFICIAL LABEL↔STYLE MAPPING REQUIRED** |
| NEXT | acquisire **solo** evidenza autorevole mancante per completare la matrice (fonte ufficiale / SLD / documentazione D-Flight / pairing operator-proven) — **senza** aprire IMPL-A |
| Architettura raccomandata (post-gate) | **E ibrida** |
| Categoria IMPL-A | **condizionata** (ROUTINE se E fattibile; DELICATO se serve endpoint) |
| Runtime / helper | **invariati** in AUDIT-A |

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
| AUDIT-A | **CLOSED / PASS** (docs-only) |
| CURRENT GATE | **OFFICIAL LABEL↔STYLE MAPPING REQUIRED** |
| NEXT | evidenza autorevole per matrice completa — **NON** `…-IMPL-A` |
| WU-0018 | **OPEN** |
| E–H | **NOT OPENED** |

---

## 12. Riferimenti

- [`WU-0017-dflight-atm09-visual-parity.md`](WU-0017-dflight-atm09-visual-parity.md) — R1–R6, familiarity-first, matrice paint, IMPL-A CLOSED
- [`WU-0005-0009-roadmap.md`](WU-0005-0009-roadmap.md) — candidato D + §7 stile futuro
- Monolite: `dflightAtm09LegendUrl`, `dflightAtm09EnsureLegend`, `dflightLegendPaintMode`, `dflightSyncContextualLegends` (tip LIVE `d2d3ab3`)
- Helper: `build_atm09_legend_url`, `fetch_atm09_legend`, route `/atm09/legend.png` (0.1.3)
- OM §7.1 FRONTIER (stato vivo)
