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

Per lavorare sul GIS gli agenti devono leggere:

1. `README.md`
2. `docs/OPERATING_MEMORY.md`
3. WU corrente in `docs/work-units/`

**Fase 2a (stato attuale):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/orchestrator/latest.md` e `docs/orchestrator/chatgpt-checkpoint.md` **non sono stati ancora declassati** — saranno marcati legacy/storico/autosync in Fase 2b/3. In Fase 2a non modificarli.

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

---

## 5. Modalità Cursor consigliata

- Default per blocchi docs/governance: **Agent + Auto**.
- Per blocchi runtime, architettura, OPSEC, storage, offline/cache, import/export o modifiche multi-area, la modalità viene fissata dal prompt approvato volta per volta.
- **GPT-5.5** è escalation: usarlo solo se Auto si incarta, propone scope troppo largo o il rischio è alto.

---

## 6. Alias scoped memoria GIS

- Sul repo **GIS**, **`aggio`** e **`aggio gis`** sono **equivalenti**: entrambi aggiornano la memoria operativa del repo GIS.
- Sul **control-plane** si usa **`aggio control`**.
- **Trade-off:** `aggio` secco non identifica il repo; l’operatore deve lanciarlo nel contesto/chat corretto. Documentare questa ambiguità la rende gestibile.
- Read-set invariato: `README.md` + `docs/OPERATING_MEMORY.md` + WU corrente.

**Dopo il flip operativo (Fase 3),** `aggio` / `aggio gis` aggiorneranno:

- `OPERATING_MEMORY` solo se cambia lo stato corrente;
- WU corrente;
- README snapshot solo se cambia lo snapshot;
- eventuale autosync/inbox se il workflow lo richiede.

Non deve puntare a `docs/orchestrator/chatgpt-checkpoint.md` come fonte primaria dopo il flip.

**Fase 2a:** alias e semantica documentati qui; flip rules **non** attivo — resta Fase 3.

---

## 7. Stato corrente

1. **PASS** — OPSEC strict cycle chiuso. Dettaglio: [`docs/work-units/WU-0001-opsec-strict-cycle.md`](work-units/WU-0001-opsec-strict-cycle.md)
2. **PREPARED** — Standardizzazione memoria wiki-LLM (Fase 2a modello creato). Dettaglio: [`docs/work-units/WU-0002-memory-standardization.md`](work-units/WU-0002-memory-standardization.md)
3. **PENDING** — Prossimo blocco GIS monolite da decidere.

**Backlog GIS-monolite ammesso (non infrastruttura control-plane):**

- Integrazione futura `/sonar/` SonarChart nel monolite
- UX GIS / mappe offline / import-export / waypoint / tracce / poligoni
- OPSEC, cache/tile/geocoding lato app

**Escluso da questa OM:** porte raw tailnet, open proxy, B2/Tailscale Serve, reboot-test systemd, ACL/firewall, n8n, control-plane, Planet-Clone operativo.

---

## 8. Work unit

| WU | Stato | Scopo |
| --- | --- | --- |
| WU-0001 | PASS | OPSEC strict cycle |
| WU-0002 | PREPARED | Memory standardization |
