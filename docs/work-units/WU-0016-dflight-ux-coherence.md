<!-- AUTO-VIA-HEADER: NON RIMUOVERE -->
> **REGOLA OPERATIVA VINCOLANTE — AUTO-VIA.** Se il prossimo passo non richiede una decisione reale dell’operatore — scelta di prodotto, scope ambiguo, rischio non autorizzato o conflitto non risolvibile — l’assistente deve considerare il `vai` già concesso e procedere autonomamente. È vietato chiedere conferme, autorizzazioni o un nuovo `vai` per attività già approvate, programmi già autorizzati o passaggi tecnicamente determinati. Un programma esplicitamente autorizzato resta autorizzato per i blocchi successivi finché non emerge una scelta reale o un gate fallito. Fermarsi soltanto davanti a una decisione effettiva che può cambiare il risultato.
<!-- /AUTO-VIA-HEADER -->

# WU-0016 — D-FLIGHT-UX-COHERENCE — Coerenza UX D-Flight

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN
**ACTIVE BLOCK:** D-FLIGHT-UX-COHERENCE-LEGEND-ATM09-UX-A
**CURRENT GATE:** QA FINALE CHATGPT — PENDING
**RUNTIME LIVE:** monolite tip `0c0f97d924ae817dc057b2bd384bfb6336435c98` · build **194** · `APP_BUILD_ID=D-FLIGHT-UX-COHERENCE-LEGEND-ATM09-UX-A` · helper **0.1.3** (invariato)
**REVIEW BASE:** tip pre-B2 `aa6e3cebf8ca1057ae83545fdca42dbc7cbdc33c` (build 193 / TEMPORAL-UX-A)
**NEXT:** D-FLIGHT-UX-COHERENCE-AGGIORNA-A (dopo PASS operatore + finito B2)
**NOTE:** B2 deploy + Automated Browser QA PASS · QA umana PENDING · finito NON eseguito
<!-- /WU-HOT-HEADER -->

**Stato:** OPEN — blocco `D-FLIGHT-UX-COHERENCE-LEGEND-ATM09-UX-A` in gate **QA FINALE CHATGPT — PENDING** (deploy tecnico PASS · Automated Browser QA PASS).
**Origine:** candidato **B** del backlog D-Flight emerso dalla QA build **183** (registrato in [`WU-0005-0009-roadmap.md`](WU-0005-0009-roadmap.md) — *D-Flight — backlog emerso QA build 183*).
**Workstream precedente:** [`WU-0015`](WU-0015-dflight-hit-test.md) **CLOSED / PASS** (OPTION-B-IMPL-A-FIX5).

---

## 1. Decisioni prodotto ratificate (non riaprire)

1. Unico comando **«Aggiorna»** (eliminare la distinzione UI Aggiorna / Rivaluta ora).
2. Il comando tenta il **refresh remoto** usando **esclusivamente** helper / rete / gate già esistenti.
3. La **rivalutazione locale** degli stati temporali è **sempre** eseguita, anche se il refresh remoto non è disponibile.
4. Due master **indipendenti**:
   - **Mostra zone D-Flight**
   - **Mostra overlay ATM09 ufficiale**
5. I cinque filtri temporali (`ACTIVE_NOW`, `ALWAYS_ACTIVE`, `FUTURE`, `EXPIRED`, `UNKNOWN`) sono **subordinati** al master D-Flight.
6. ATM09 è **indipendente** dai cinque filtri temporali.
7. Comandi **Seleziona tutte** / **Deseleziona tutte** sui filtri temporal (non sostituiscono i master).
8. Feedback temporal morbido: **2–3 pulse**, durata complessiva circa **1.5–2 s** (niente strobo).
9. ATM09: solo **fade/pulse dell’intero overlay**, salvo futura geometria individualmente affidabile.
10. **Legende contestuali** (D-Flight e ATM09).

### Apply Update

`#dflightBtnApplyUpdate` **non** va eliminato né fuso in «Aggiorna» in questa WU. Va **preservato** finché esiste il workflow `READY_CHANGED` / pending dataset. Non è una nuova domanda prodotto.

---

## 2. Finding tecnico audit (READ-ONLY)

Oggi il toggle D-Flight (`#dflightVisibleToggle` / `_dflightOverlayVisible`) governa un comportamento **misto**:

- vettori D-Flight;
- `_dflightAtm09Preferred` via `dflightAtm09SyncPreferredFromUi` (preferred ≈ overlay ∧ rete ∧ helper);
- lifecycle tile / legend PNG / ATM09 INFO quando i gate lo consentono.

Quindi la **separazione dei master è DELICATA** e **non** deve essere implementata come semplice modifica cosmetica.

---

## 3. Invarianti FIX5 (vincolanti per tutta la WU)

- Preservare hit-test NFZ (overlay colorato / hitlayer).
- Preservare fallback quando ATM09 INFO è unavailable.
- Preservare separazione: raster ATM09 / SVG NFZ / ATM09 INFO-hit layer.
- `.dflight-atm09-info-hit` deve restare **visualmente trasparente** (niente fill nero SVG default).
- Nessuna regressione «manina» / click (anche a zoom problematici).
- Helper prod **0.1.3** invariato.
- **Nessun** nuovo endpoint.

---

## 4. Piano blocchi

| ID | BLOCK-ID | Categoria | Note |
| --- | --- | --- | --- |
| **B0** | `D-FLIGHT-UX-COHERENCE-OPEN-A` | docs-only | Apertura WU — **CLOSED / PASS** con questo task |
| **B1** | `D-FLIGHT-UX-COHERENCE-TEMPORAL-UX-A` | **ROUTINE** | **CLOSED / PASS** — Seleziona/Deseleziona tutte; pulse/fade; legenda D-Flight contestuale · LIVE `aa6e3ce` / **193** |
| **B2** | `D-FLIGHT-UX-COHERENCE-LEGEND-ATM09-UX-A` | **ROUTINE** | Deploy + Automated Browser QA PASS · gate **QA FINALE CHATGPT — PENDING** · LIVE `0c0f97d` / **194** |
| **B3** | `D-FLIGHT-UX-COHERENCE-AGGIORNA-A` | **DELICATO** | CTA Aggiorna unificata; refresh path/gate esistenti; reeval locale sempre; nessun nuovo endpoint; Apply Update separato. Review DELICATA rete/OPSEC |
| **B4** | `D-FLIGHT-UX-COHERENCE-MASTER-VIS-A` | **DELICATO** | Due master indipendenti; decoupling ATM09 ↔ cinque temporal; lifecycle preferred/fetch/tiles/INFO solo da master ATM09 + gate; preservare FIX5. Blocco **più rischioso** |

Ordine runtime consigliato: **B1 → B2 → B3 → B4** (ROUTINE prima; mai ROUTINE+DELICATO nello stesso bundle).

---

## 5. Fuori scope WU-0016

- Candidato **C** ATM09 VISUAL PARITY AUDIT
- Restyle colori/pattern ATM09
- Legenda ATM09 esterna grande (candidato **D**)
- Layout affiancato pannelli (candidato **E**)
- Workspace legende trascinabili (candidato **F**)
- Global minimized-panel dock (candidato **G**)
- Branding (candidato **H**)
- Modifica helper **0.1.3**
- Nuovi endpoint
- Nuovo storage/persistenza se non esplicitamente aperto in un blocco futuro

---

## 6. Riferimenti

- Roadmap backlog: [`WU-0005-0009-roadmap.md`](WU-0005-0009-roadmap.md) — sezione *D-Flight — backlog emerso QA build 183*
- FIX5 / hit-test: [`WU-0015-dflight-hit-test.md`](WU-0015-dflight-hit-test.md)
- Metodo ROUTINE/DELICATO: `docs/OPERATING_MEMORY.md` §4 Regola B / Regola G
