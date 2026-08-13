<!-- AUTO-VIA-HEADER: NON RIMUOVERE -->
> **REGOLA OPERATIVA VINCOLANTE — AUTO-VIA.** Se il prossimo passo non richiede una decisione reale dell’operatore — scelta di prodotto, scope ambiguo, rischio non autorizzato o conflitto non risolvibile — l’assistente deve considerare il `vai` già concesso e procedere autonomamente. È vietato chiedere conferme, autorizzazioni o un nuovo `vai` per attività già approvate, programmi già autorizzati o passaggi tecnicamente determinati. Un programma esplicitamente autorizzato resta autorizzato per i blocchi successivi finché non emerge una scelta reale o un gate fallito. Fermarsi soltanto davanti a una decisione effettiva che può cambiare il risultato.
<!-- /AUTO-VIA-HEADER -->

# WU-0014 — D-FLIGHT-TEMPORAL-FILTER — Filtro UI stato temporale zone D-Flight

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** OPEN / D-FLIGHT-TEMPORAL-FILTER-UI-A READY
**ACTIVE BLOCK:** D-FLIGHT-TEMPORAL-FILTER-UI-A — READY FOR PLAN/IMPLEMENTATION
**CURRENT GATE:** plan/runtime implementation non ancora eseguita
**RUNTIME LIVE:** monolite `52927c565d5301870a82d688c899024d8d499aee` · build **179** · `APP_BUILD_ID=D-FLIGHT-PERF-VISUAL-READY-A-FIX2` · helper **0.1.3**
**NEXT:** pianificare/implementare D-FLIGHT-TEMPORAL-FILTER-UI-A
<!-- /WU-HOT-HEADER -->

**Stato:** `OPEN / D-FLIGHT-TEMPORAL-FILTER-UI-A READY` — apertura formale `DOCS-DFLIGHT-WU0014-OPEN-A` (2026-08-14)
**Blocco autorizzato:** `D-FLIGHT-TEMPORAL-FILTER-UI-A` — **READY / NOT IMPLEMENTED**
**Categoria preliminare:** **ROUTINE** (salvo finding runtime che tocchi categorie delicate)
**Tipo:** follow-up UI client-side sul layer D-Flight (non nuova pipeline dati)
**Data apertura:** 2026-08-14
**Runtime live (invariato):** `52927c565d5301870a82d688c899024d8d499aee` · build **179** · helper **0.1.3**
**Monolite in questa WU (apertura):** **non** modificato (docs-only open)
**Helper VPS:** **invariato** 0.1.3

> Origine: backlog post-chiusura [`WU-0013`](WU-0013-uas-geozone-dflight.md) §23 — `D-FLIGHT-TEMPORAL-FILTER-UI-A`.  
> WU-0013 resta **CLOSED / PASS end-to-end** (scope H2+overlay). **Non** riaprire WU-0013.

---

## 1. Scopo

Aggiungere nel pannello/layer D-Flight un **filtro UI** basato sullo **stato temporale già calcolato** dal core esistente, così l’operatore può scegliere quali stati visualizzare **senza** modificare il dataset canonico.

---

## 2. Motivazione

- In WU-0013 lo **stato temporale** delle zone è **già implementato e verificato** (normalize / eval temporale; mostrato in details/badge).
- Manca solo il **filtro operativo UI** (visibilità overlay / elenco), classificato backlog non bloccante in WU-0013 §23.
- Decisione prodotto (2026-08-14): procedere con questo follow-up in **WU-0014** autonoma.

Stati concettuali da riusare (nomi runtime esatti da validare nel monolite in fase implementazione):

| Concetto | Note |
| --- | --- |
| ACTIVE_NOW | attiva “ora” |
| FUTURE | non ancora attiva |
| EXPIRED | scaduta |
| ALWAYS_ACTIVE (o equivalente canonico live) | permanente / sempre attiva |
| UNKNOWN | stato non determinabile |

> **Non** inventare simboli/API nel piano di patch finché la fase runtime non ha letto i simboli mirati nel monolite.

---

## 3. Dipendenza

- **WU-0013** — **CLOSED / PASS end-to-end** (scope H2+overlay).
- Runtime baseline: build **179** / tip `52927c5` / helper **0.1.3**.
- Cross-reference: [`WU-0013-uas-geozone-dflight.md`](WU-0013-uas-geozone-dflight.md) (core temporale, overlay, pannello H).

---

## 4. Invarianti

1. Dataset D-Flight in sessione **invariato** (nessuna eliminazione zone dal canonico).
2. **Normalize / parsing** canonici **invariati**.
3. **Helper** D-Flight **invariato** (nessuna nuova API, nessun deploy helper).
4. **Nessuna** nuova rete / fetch D-Flight o helper oltre al path già live.
5. **Nessuno** nuovo storage (no localStorage / IndexedDB dedicato al filtro).
6. Filtro **session-only**, puramente **client-side**, applicato come **filtro di visualizzazione**.
7. **Default** = equivalente a build 179 **“mostra tutto”** finché l’operatore non modifica il filtro.
8. Workbench / Oggetti GIS **FROZEN**.
9. L10N: nuove stringhe **solo IT** (freeze EN/FR).

---

## 5. Scope UI previsto (`D-FLIGHT-TEMPORAL-FILTER-UI-A`)

- Controlli nel pannello/layer D-Flight per abilitare/disabilitare la visualizzazione per stato temporale.
- Applicazione del filtro al **render overlay** (e, se già presente e coerente, a eventuali liste/dettagli collegati alla stessa sessione) **senza** mutare il dataset.
- Comportamento iniziale: tutti gli stati **visibili** (parità con build 179).
- Coerenza con **re-eval** temporale locale e con **refresh/apply** dataset (il filtro resta semantica di view; non reset distruttivo non documentato).
- Close/reopen pannello: nessuna regressione lifecycle rispetto a VISUAL-READY.

**Piano di patch dettagliato:** nel blocco runtime successivo, dopo lettura simboli/range mirati nel monolite — **non** in questa apertura docs.

---

## 6. Fuori scope (esplicito — non assorbire)

- Filtro restriction / reason / quota
- Ricerca zona id/nome
- Opacity slider
- Persistenza offline opt-in
- Export vettoriale zone
- UI import ED-269/318
- Feed NOTAM
- Parity ED-269 ↔ WFS
- Modifica helper / nuove chiamate rete
- Riapertura o estensione scope WU-0013

---

## 7. Categoria e QA

| Voce | Valore |
| --- | --- |
| Categoria preliminare | **ROUTINE** |
| Escalation | Se il finding runtime tocca sanitizer/storage/rete/OPSEC → rivalutare come DELICATO |
| Automated Browser QA | **Obbligatoria** (superficie browser) |
| QA operatore | **Obbligatoria** (residuo UX filtro) |
| Deploy | solo dopo implementazione runtime (fuori da questo open docs-only) |

---

## 8. Criteri PASS preliminari

1. Di default tutti gli stati restano visibili (parità build 179).
2. Il filtro modifica **solo** la visibilità, non il dataset.
3. Toggling filtro **non** muta normalize/SHA/count canonici.
4. Re-eval temporale locale continua a funzionare.
5. Refresh/apply dataset mantiene semantica filtro coerente (view filter, non wipe silenzioso non dichiarato).
6. Close/reopen pannello senza regressioni lifecycle.
7. ATM09 **non** influenzato.
8. OPSEC / network **invariati** (nessuna nuova rete).

---

## 9. Piano blocchi

| Blocco | Scope | Stato | Categoria |
| --- | --- | --- | --- |
| **DOCS-DFLIGHT-WU0014-OPEN-A** | Apertura WU + OM/roadmap | **CLOSED / PASS DOCS-ONLY** (questo task) | DOCS |
| **D-FLIGHT-TEMPORAL-FILTER-UI-A** | Filtro UI temporal state | **READY / NOT IMPLEMENTED** | ROUTINE (preliminare) |

**NEXT:** pianificazione runtime mirata / implementazione `D-FLIGHT-TEMPORAL-FILTER-UI-A`.
