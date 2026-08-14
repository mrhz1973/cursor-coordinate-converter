# D-FLIGHT-HIT-TEST-FIX-A — FIX PLAN COMPLETE

**Data:** 2026-08-14 12:16 (locale)  
**Fase:** FIX PLAN ONLY — **nessuna implementazione** in questo intervento  
**Baseline docs:** `1af82ad3721cdd09ecad2482aca515cf4bf89512`  
**Runtime live (da preservare):** `20b1b494238f8dd483b3eb739f42dbf1194ab727` · build **183** · `APP_BUILD_ID=D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX3` · helper **0.1.3**  
**WU-0015:** OPEN · DIAG-A COMPLETE — ROOT CAUSE CONFIRMED  
**WU-0014:** CLOSED / PASS · backlog B–H NOT OPENED

---

## 1. Root cause (da DIAG-A)

ATM09 preferred + filtro non restrittivo → `dflightAtm09ShouldSuppressNfzColors()` sopprime l'SVG NFZ → zero `.dflight-volume` hittable → interazione solo su `.dflight-atm09-info-hit` → a z8 il viewport supera `ATM09_INFO_FEATURE_CAP=1000` → `/atm09/info` HTTP 502 `cap` → `dflightAtm09FetchInfoForViewport` esce su `!resp.ok` senza creare overlay → **zero geometrie hittable**, nessuna manina, click inerte. Reload torna a ~z11 (INFO sotto cap) e il click ricompare.

Finding correlato: `renderTileMap` sostituisce `.tile-map` (`root.innerHTML = html`); con il ramo suppress l'early-return non reinstalla `dflightAttachClickHandler` (listener bind-once sul nodo sostituito).

## 2. Principio di progetto vincolante

La selezionabilità di una zona D-Flight **non deve dipendere** dal successo di `/atm09/info`. Visual ATM09 (raster ufficiale), disponibilità rete/helper INFO e capacità di selezione (vettoriale canonica) restano separati. Nessuna mappa visivamente D-Flight/ATM09 attiva senza superficie hittable.

## 3. Categoria / tier

**DELICATO** (OM §4 Regola B/G): hit-test, event lifecycle su nodo sostituito, suppress/render overlay, comportamento su errore di sorgente di rete. Bundle **separato**; nessun mix routine.
Review gate: **Claude upstream/downstream da `raw@FULL_SHA` candidate prima del deploy** se disponibile; altrimenti review sostitutiva GPT con checklist per-categoria + QA operatore categoria + review byte Claude post-hoc.

## 4. Soluzione scelta — Alternative A: interaction-only vector hit layer

Quando il suppress ATM09 è attivo, `dflightDrawOverlayDom` (invece dell'early-return) disegna un SVG **hit-only**:

- riuso del loop zone→volumes→`dflightGeomPolygonToSvgPathD`, dataset canonico `_dflightOverlaySession.dataset`, viewport culling invariati;
- root `.dflight-zone-hitlayer` (`z-index:2`, `pointer-events:none` sul root come gli altri overlay D-Flight);
- path `.dflight-volume-hit` con `data-zone-id` / `data-temporal-state` identici → click/hover/details via `dflightSelectZone` esistente, nessun duplicato di stato;
- **temporal filter applicato all'hit layer** con lo stesso `dflightTemporalFilterAllows(zone)`: ALL OFF → zero hit; nessun hit invisibile su zone escluse;
- coesistenza con ATM09_INFO hit quando INFO 200: ordine di append deterministico nel redraw, nessun doppio dispatch.

Verifiche fatte sul codice reale: le geometrie selezionabili sono già nel dataset NFZ vettoriale; `dflightSelectZone`/details lavorano direttamente sul modello vettoriale; INFO aggiunge solo metadati extra nel proprio details, non geometrie uniche.

### CORREZIONE TECNICA SVG (decisione di implementazione da validare)

**Non** fissare come soluzione definitiva `pointer-events:visiblePainted` + `fill:none` + `stroke:none` per `.dflight-volume-hit`: con fill/stroke non visibili `visiblePainted` può non produrre superficie hittable. Da validare all'implementazione:

- modalità SVG realmente hittable sulla geometria del path: `pointer-events:all` / `fill` e/o fill trasparente;
- nessuna resa visuale percepibile (fill trasparente, nessuno stroke che alteri la resa ATM09);
- hit limitato alla geometria reale, inclusi eventuali hole/ring;
- verifica via `elementFromPoint` e click reale;
- verifica che ATM09_INFO, quando presente, mantenga l'ordine di interazione desiderato senza doppio dispatch.

La soluzione architetturale interaction-only **non cambia**: la nota riguarda solo la corretta implementazione SVG del path.

## 5. Componente 2 — rebind idempotente listener

- `dflightAttachClickHandler` / `dflightAttachHoverHandler`: chiamarli **sempre** all'uscita di `dflightDrawOverlayDom`, anche nel ramo suppress/hit-layer (prima del return); `dflightAtm09DrawInfoHitOverlay` già li chiama;
- i flag `_dflightClickBound` / `_dflightHoverBound` si azzerano naturalmente al replacement del nodo (bind-once per nodo corrente);
- **nessuna delegation su ancestor, nessun event manager globale**: il FIX resta locale alla catena D-Flight.

## 6. Componente 3 — lifecycle errori `/atm09/info`

Comportamento esplicito in `dflightAtm09FetchInfoForViewport`:

| Esito | Comportamento |
| --- | --- |
| INFO 200 valida | overlay INFO hit + hit layer vettoriale; nessuna regressione |
| HTTP 502 cap | nessuna rimozione dell'unica superficie hittable; fallback vettoriale vivo; nessuna mutazione dataset/filtri |
| altri `!resp.ok` / timeout / network | come 502; rimozione di un eventuale hit overlay INFO precedente solo se il nuovo bbox è disgiunto |
| risposta vuota/invalida | come errore; nessun overlay parziale |
| risposta valida | normale |

- **niente last-good INFO geograficamente stale** (Alternativa D scartata);
- feedback interno minimo (`aria-live` se già presente nel pannello): nessuna nuova UI obbligatoria;
- nessun indebolimento OPSEC, nessuna nuova rete.

## 7. Alternative scartate

- **B unsuppress visivo su failure**: flicker/doppia simbologia su transizioni async 200↔502 durante pan; resa ATM09 degradata.
- **C fix helper/cap**: da sola non copre timeout/network/5xx; eventuale aumento cap = blocco separato futuro, non parte di FIX-A.
- **D last-good INFO overlay**: hit geograficamente stale dopo pan; richiederebbe invalidazione complessa.

## 8. Helper

**NO** — client-only. Helper 0.1.3 invariato; **nessun aumento cap** in FIX-A (la robustezza del click non deve dipendere da un limite del servizio).

## 9. Regioni runtime previste (righe indicative da validare all'implementazione)

- CSS overlay/hit D-Flight (~8528–8572, ~8647–8657): nuove regole hit-only se necessario;
- `dflightDrawOverlayDom` (~36052–36160): ramo suppress → hit layer + rebind sempre;
- `dflightAttachClickHandler` / `dflightAttachHoverHandler` (~36867–36946);
- `dflightAtm09FetchInfoForViewport` (~39617–39662) + `dflightAtm09DrawInfoHitOverlay` (~39697): error lifecycle e coesistenza;
- selftest D-Flight (nuovo wrapper dopo `dflightSelfTestAtm09` ~39869 / chain `dflightSelfTestAll*`);
- `APP_BUILD_ID` / `APP_BUILD_NUM` (~23427–23431) e assert build selftest (~39153–39154, ~40416–40417) → **184** / `D-FLIGHT-HIT-TEST-FIX-A` **solo nella futura implementazione**.

Non toccare: UI backlog B–H, layout FIX3 salvo dipendenza stretta, storage, geocoding, Oggetti GIS, routing, offline maps, altri overlay, i18n non necessaria.

## 10. Comportamento atteso per stato

| Stato | Vettori visibili | Hit surface |
| --- | --- | --- |
| ATM09 not ready / pending | NFZ colorati (suppress false) | `.dflight-volume` esistenti |
| ATM09 ready + INFO 200 | ATM09 raster (NFZ soppressi) | `.dflight-volume-hit` + `.dflight-atm09-info-hit` |
| ATM09 ready + INFO 502/err | ATM09 raster | `.dflight-volume-hit` |
| Filtro restrittivo (ogni combinazione) | vettori filtrati (FIX1 bypass) | solo categorie consentite |
| ALL OFF | nessun vettore | zero hit |
| restr ↔ non-restr | semantica invariata | idempotente, no duplicati |

## 11. Selftest da aggiungere (non distruttivi)

1. suppress + INFO assente → hit layer presente (count > 0 su dataset sintetico), verificato `elementFromPoint`;
2. INFO 502 simulato → fallback interattivo vivo;
3. INFO 200 → nessuna regressione (hit INFO + hit layer coesistenti, nessun doppio dispatch);
4. restrictive → hit solo categorie consentite;
5. ALL OFF → zero `.dflight-volume-hit`;
6. tile-map replacement simulato → `_dflightClickBound` true sul nodo corrente;
7. cicli redraw/pan/zoom → nessuna duplicazione listener/hit layer (1 SVG root per tipo);
8. preesistenti `dflightSelfTestAll*` invariati (baseline 250/250 → atteso 250+N con aggiornamento count assert).

## 12. Automated Browser QA futura (build 184)

Runtime deployato con cache-buster; z11→z8 con ATM09 ready e 5/5 ON; `/atm09/info` 502 cap; click/manina funzionanti; `elementFromPoint` su geometria valida; temporal restrictive; ALL OFF; pan/zoom ripetuti; close/reopen pannello; resize; transizione 502→200 **senza reload**; Console; Network mirato; dataset canonico invariato.

## 13. Sequenza

implementazione (build 184, bundle DELICATO separato) → review Claude `raw@FULL_SHA` (o sostitutiva GPT loggata) → deploy GIS-only → Automated Browser QA PRE-OPERATORE (Regola D2bis) → `QA FINALE CHATGPT — PENDING` → QA operatore corta (Regola D2) → PASS → auto-`finito` (Regola H).

## 14. Rischi residui

- `visiblePainted` vs fill trasparente: la modalità hit esatta va validata con selftest 1 e `elementFromPoint` (correzione §4);
- densità path a z8 (fino a ~487 zone) su layer invisibile: costo render già sostenuto oggi nel ramo non-suppress;
- coesistenza INFO + hit layer a stesso z-index: ordine di append deterministico;
- incremento count selftest da riflettere negli assert.

## 15. Gate del piano

**D-FLIGHT-HIT-TEST-FIX-A PLAN COMPLETE — READY FOR IMPLEMENTATION**

Nessuna scelta prodotto non risolvibile tecnicamente: l'interaction-only fallback è verificato compatibile col modello dati esistente.

## 16. Stato dopo questa persistenza

WU-0015 OPEN · DIAG-A COMPLETE · FIX-A **FIX PLAN COMPLETE — NOT IMPLEMENTED** · runtime live resta `20b1b49` / 183 · helper 0.1.3. NEXT: implementazione FIX-A.
