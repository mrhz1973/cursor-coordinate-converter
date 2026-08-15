<!-- AUTO-VIA-HEADER: NON RIMUOVERE -->
> **REGOLA OPERATIVA VINCOLANTE — AUTO-VIA.** Se il prossimo passo non richiede una decisione reale dell’operatore — scelta di prodotto, scope ambiguo, rischio non autorizzato o conflitto non risolvibile — l’assistente deve considerare il `vai` già concesso e procedere autonomamente. È vietato chiedere conferme, autorizzazioni o un nuovo `vai` per attività già approvate, programmi già autorizzati o passaggi tecnicamente determinati. Un programma esplicitamente autorizzato resta autorizzato per i blocchi successivi finché non emerge una scelta reale o un gate fallito. Fermarsi soltanto davanti a una decisione effettiva che può cambiare il risultato.
<!-- /AUTO-VIA-HEADER -->

# WU-0015 — D-FLIGHT-HIT-TEST — Hit-test / click zone D-Flight

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN / OPTION-B-IMPL-A-FIX4 DEPLOYED — AUTOMATED BROWSER QA PASS
**ACTIVE BLOCK:** D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX4
**CURRENT GATE:** QA FINALE CHATGPT — PENDING
**RUNTIME LIVE:** monolite `c3061a2983f46bf317f292426509563746c40378` · build **191** · `APP_BUILD_ID=D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX4` · helper **0.1.3**
**FEATURE COMMIT:** `c3061a2983f46bf317f292426509563746c40378`
**SUPERSEDED path:** FIX3 → FIX4 (restrictive hides ATM09 + INFO off)
**NEXT:** QA umana ChatGPT → `QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX4 PASS operatore` → auto-`finito`
**NOTE:** DEPLOY PASS · Automated Browser QA PASS · finito NON eseguito (attesa PASS operatore)
<!-- /WU-HOT-HEADER -->

**Stato:** OPEN — diagnosi `D-FLIGHT-HIT-TEST-DIAG-A` **COMPLETE** (2026-08-14)
**Origine:** backlog QA build 183 candidato **A** (*BUG intermittente hit-test / «manina»*)
**Runtime baseline/live:** `20b1b494238f8dd483b3eb739f42dbf1194ab727` · build **183** · helper **0.1.3**
**WU-0014:** resta **CLOSED / PASS** (non riaperta)
**Monolite in DIAG-A:** **byte-invariato** (nessun fix, nessun `APP_BUILD` bump)

---

## 1. Sintomo (evidenza prodotto, non causa)

- Click sulle zone D-Flight inizialmente funziona.
- Dopo uso prolungato può smettere; può sparire il cursore/manina.
- Osservato soprattutto circa **z8**.
- **Reload pagina ripristina**.

## 2. Scope diagnostico

Catena overlay vettoriale D-Flight: SVG NFZ, ATM09_INFO, `pointer-events` / `.is-interactive`, listener bind-once su `.tile-map`, redraw `renderTileMap`, filtro temporale, suppress ATM09, stacking z-index, overlay DOM coprenti. Nessuna area non collegata.

## 3. Invarianti DIAG-A

- Nessun fix runtime; monolite invariato; helper 0.1.3 invariato.
- Nessuna nuova rete/storage/OPSEC; nessun deploy; nessun `finito`; nessuna QA operatore.

## 4. Protocollo eseguito

Live `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=20b1b49` (CDP, non persistente). Snapshot sano z11; zoom z8; pan; toggle temporale FUTURE; close/reopen pannello; fetch `/atm09/info` in-page; reload di verifica.

## 5. Risultato

**Riprodotto: SÌ** a overlay ON, zoom **8**, ATM09 tile ready, filtro 5/5 ON (suppress NFZ), ATM09_INFO assente.

Stato FALLITO vs SANO:

| Campo | SANO (z11, post-reload) | FALLITO (z8, ATM09 ready) |
| --- | --- | --- |
| `.dflight-volume` | 24 (ATM09 not-ready) / 0 se suppress | **0** |
| `.dflight-atm09-info-hit` | **44** | **0** |
| `elementFromPoint` centro mappa | `.dflight-atm09-info-hit` `cursor:pointer` | `.tile-wrap` cursore GIS (non pointer) |
| `/atm09/info` | 200, 44 feature | **HTTP 502** `{"error":"cap"}` |

Reload: z11, 44 hit, `pointer` ripristinato.

## 6. Classificazione

**A — ROOT CAUSE CONFIRMED**

Catena causale:

1. Con ATM09 preferred + filtro non restrittivo, `dflightAtm09ShouldSuppressNfzColors()` rimuove l’SVG NFZ (`dflightDrawOverlayDom` early-return) → zero `.dflight-volume` hittable.
2. L’hit-test resta solo su `.dflight-atm09-info-hit`.
3. A z8 il bbox viewport fa superare il cap helper `ATM09_INFO_FEATURE_CAP` (1000) → **502 cap**.
4. Il client (`dflightAtm09FetchInfoForViewport`) su `!resp.ok` **return silenzioso** → `_dflightAtm09InfoFc` resta null, nessun overlay INFO.
5. Risultato: **zero geometrie hittable**, niente manina, click inerte. Reload torna allo zoom di default (~11) dove INFO sta sotto cap → ripristino.

## 7. Findings correlati (non la causa z8)

1. **H2:** ogni `renderTileMap` fa `root.innerHTML = html` (sostituisce `.tile-map`). I flag bind-once si azzerano; con suppress l’early-return **non** reinstall `dflightAttachClickHandler`.
2. **H3:** NFZ e ATM09_INFO condividono `z-index:2`; l’ordine di append dipende dal ciclo redraw (ATM09 può coprire i volume quando entrambi esistono).
3. **H5:** `#dflightPanel .app-modal-body` intercetta `elementFromPoint` sulla sinistra mappa a pannello aperto (copertura UI, non il degrado z8).
4. In build 183 **non** esiste un toggle ATM09 indipendente: preferred = overlay visibile + rete.

## 8. Piano blocchi

| Blocco | Scope | Stato |
| --- | --- | --- |
| **D-FLIGHT-HIT-TEST-DIAG-A** | Diagnosi read-only | **DIAGNOSTIC COMPLETE — ROOT CAUSE CONFIRMED** |
| **D-FLIGHT-HIT-TEST-FIX-A** | Fix client-only hit-layer | **REVIEW FAIL / BLOCKING** — candidate `62de84e` / 184 superseded (non deployato) |
| **D-FLIGHT-HIT-TEST-FIX-A-FIX1** | Precedenza INFO vs hit-layer | **QA OPERATORE FAIL** — superseded (build 185) |
| **D-FLIGHT-HIT-TEST-FIX-A-FIX2** | Visible NFZ fallback su INFO unavailable | **DEPLOYED** — LIVE `7501d0f` / build **186** — REVIEW GPT-SOSTITUTIVA PASS — Automated Browser QA PASS — QA FINALE PENDING |

## 8b. FIX2 — visible fallback (post FAIL operatore FIX1)

**QA FIX1 FAIL operatore (vincolante):** dopo pan/zoom ~z8, `/atm09/info` → 502 `{"error":"cap"}`; INFO stale eliminata; hit-layer invisibile resta; con filtro 5/5 ON (`hitOnly`) l’operatore non trova la manina. FUTURE OFF fa ricomparire l’overlay colorato; FUTURE ON ripristina hitOnly invisibile.

**Fix client-only (build 186):**

- Stato session-only `_dflightAtm09InfoUnavailable` (no storage).
- Failure richiesta corrente → `dflightAtm09MarkInfoUnavailable` (clear INFO + redraw `.dflight-zone-overlay` visibile).
- `hitOnly` richiede anche `!_dflightAtm09InfoUnavailable`.
- Success INFO 200 → `dflightAtm09ApplyInfoSuccess` (exit fallback + hitlayer z2 + INFO z3 + single-dispatch).
- Reset unavailable solo su: success corrente; preferred OFF; network gate OFF; sessione overlay nullata. **Non** in `dflightAtm09ClearInfo` né su reapply preferred ON.

**Deploy + Automated Browser QA (2026-08-14):** LIVE blob `a421a620…` = candidate. Helper 0.1.3. QA con **502 reale** (body `{"error":"cap"}`), visible fallback (325 volumes), FUTURE×2, redraw, recovery 200, single-dispatch, selftest 276/276+278/278.

## 9. NEXT

**QA FINALE CHATGPT — PENDING.** Attestazione operatore `QA D-FLIGHT-HIT-TEST-FIX-A-FIX2 PASS operatore` → auto-`finito`. Backlog B–H NOT OPENED.
