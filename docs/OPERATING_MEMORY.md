# GIS Tool — OPERATING_MEMORY

> Gli agenti devono leggere questo file prima di modificare il GIS Tool.  
> Read-set operativo target: `README.md` + `docs/OPERATING_MEMORY.md` + WU corrente.  
> Questo file riguarda il **GIS monolite**, non il control-plane e non Planet-Clone.

---

## 1. Identità progetto

- **Repo:** `mrhz1973/cursor-coordinate-converter`
- **File operativo:** `coordinate_converter Claude.html`
- **Tipo:** app GIS tattica leggera, offline-first, OPSEC-aware

---

## 2. Vincoli architetturali

- Singolo file HTML standalone
- HTML / CSS / JS nello stesso file
- Vanilla JS
- No framework
- No TypeScript
- No npm
- No bundler
- No ES modules
- No split operativo
- Nessuna dipendenza runtime esterna salvo tile/geocoding opt-in o cache offline

---

## 3. Read-set operativo

**Read-set corrente:** gli agenti devono leggere:

1. `README.md`
2. `docs/OPERATING_MEMORY.md`
3. WU corrente in `docs/work-units/`

**Legacy (non memoria corrente):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/orchestrator/latest.md` e `docs/orchestrator/chatgpt-checkpoint.md` restano storico/legacy/autosync — consultabili per audit, **non** come current-state primario.

---

## 4. Protocollo orchestratore minimo

- ChatGPT e Cursor usano lo stesso read-set target: README + OPERATING_MEMORY + WU corrente.
- Prompt Cursor: istruzioni esterne fuori dal prompt; blocco operativo pulito dentro il prompt.
- Procedere per blocchi piccoli.
- Non toccare aree non correlate.
- Non usare `finito` salvo richiesta esplicita del workflow.
- Nessun GPS silenzioso.
- Nessun live tracking GPS senza decisione esplicita.
- Modifiche runtime: commit separati — codice / docs operative / autosync.
- Blocchi docs-only: non toccare il monolite.

### Pipeline prompt Cursor (revisione incrociata a passi fissi)

Per ogni blocco operativo, il prompt Cursor passa UNA volta per questa
catena, a passi fissi, NON iterativa:

1. GPT redige il prompt Cursor (bozza).
2. Claude critica → produce prompt di correzione.
3. GPT critica → ripropone il prompt.
4. Claude revisione finale → critica + proposta definitiva.
5. GPT consegna il prompt a Cursor.

**Regole:**

- Catena CHIUSA a questi 5 passi: due passaggi Claude, due GPT, poi
  Cursor. Nessun giro extra di andata-e-ritorno.
- Il prompt che arriva a Cursor contiene TUTTO ciò che deve fare nel
  blocco. Cursor esegue in un colpo solo: niente esecuzioni a tentativi,
  salvo errore bloccante da riportare.
- Critica = sostanza: scope, fetch, consenso, OPSEC, regressioni,
  storage/cache, container UI, stato repo e rischi di diff; non stile.
- L'operatore arbitra solo se Claude e GPT restano in disaccordo dopo
  il passo 4.

**Chiusura blocco (dopo l'esecuzione Cursor):**

- Verifica esito: diff, controlli automatici pertinenti e gate OPSEC
  mirato se il blocco tocca rete, tile, proxy, cache, storage o fetch.
- Commit e autosync chiusi nello stesso intervento operativo, ma con
  commit separati e selettivi:
  - commit codice/runtime se il monolite o altri file operativi sono
    stati modificati;
  - commit docs operative se WU, OPERATING_MEMORY o README cambiano
    stato/snapshot;
  - commit autosync memoria orchestratore per latest.md + inbox/.
- Aggiornare WU, OPERATING_MEMORY e README snapshot solo se cambia
  davvero lo stato operativo o lo snapshot.
- Nessun blocco operativo è chiuso finché non risulta pubblicato
  l'autosync orchestratore pertinente.

---

## 5. Modalità Cursor consigliata

- Default per blocchi docs/governance: **Agent + Auto**.
- Per blocchi runtime, architettura, OPSEC, storage, offline/cache, import/export o modifiche multi-area, la modalità viene fissata dal prompt approvato volta per volta.
- **GPT-5.5** è escalation: usarlo solo se Auto si incarta, propone scope troppo largo o il rischio è alto.

---

## 6. Alias scoped memoria GIS

- Sul repo **GIS**, **`aggio`** e **`aggio gis`** sono **equivalenti**: entrambi aggiornano la memoria operativa del repo GIS.
- Sul **control-plane** si usa **`aggio control`**.
- **Trade-off:** `aggio` secco non identifica il repo; l’operatore deve lanciarlo nel contesto/chat corretto.
- Read-set invariato: `README.md` + `docs/OPERATING_MEMORY.md` + WU corrente.

**Flusso `aggio` / `aggio gis` (attivo da Fase 3):** aggiorna, quando necessario:

- `OPERATING_MEMORY` solo se cambia lo stato corrente;
- WU corrente;
- README snapshot solo se cambia lo snapshot;
- eventuale autosync/inbox se il workflow lo richiede.

**Non** puntare a `docs/orchestrator/chatgpt-checkpoint.md` come fonte primaria.

---

## 7. Stato corrente

1. **PASS** — OPSEC strict cycle chiuso. Dettaglio: [`docs/work-units/WU-0001-opsec-strict-cycle.md`](work-units/WU-0001-opsec-strict-cycle.md)
2. **PASS** — Standardizzazione memoria wiki-LLM completata (Fasi 1–5). Dettaglio: [`docs/work-units/WU-0002-memory-standardization.md`](work-units/WU-0002-memory-standardization.md)
3. **OPEN** — SonarChart overlay nel monolite. Dettaglio: [`docs/work-units/WU-0003-sonarchart-overlay.md`](work-units/WU-0003-sonarchart-overlay.md)

**Backlog GIS-monolite ammesso (non infrastruttura control-plane):**

- UX GIS / mappe offline / import-export / waypoint / tracce / poligoni
- OPSEC, cache/tile/geocoding lato app

**Escluso da questa OM:** porte raw tailnet, open proxy, B2/Tailscale Serve, reboot-test systemd, ACL/firewall, n8n, control-plane, Planet-Clone operativo.

---

## 8. Work unit

| WU | Stato | Scopo |
| --- | --- | --- |
| WU-0001 | PASS | OPSEC strict cycle |
| WU-0002 | PASS | Memory standardization (CLOSED) |
| WU-0003 | OPEN | SonarChart overlay |

---

## Pattern nomi inbox orchestratore

- **Pattern ufficiale:** `AAAA-MM-GG_HHMM_<tipo>_<slug>.md`
- **Tipi comuni:** `plan`, `riepilogo`, `handoff`, `qa`
- **Regole pratiche:**
  - non usare doppio underscore;
  - includere sempre `HHMM`;
  - includere sempre il segmento `<tipo>`;
  - usare slug descrittivo in kebab-case.
- **Esempio valido:** `2026-06-14_0102_riepilogo_memory-standardization-final-autosync.md`
