# PIANO FINALE — Standardizzazione memoria GIS su modello “wiki-LLM” lean

Data piano: 2026-06-13
Repository: `mrhz1973/cursor-coordinate-converter`
Progetto: APP GIS / GOI GIS Tool
Stato dichiarato: ciclo OPSEC Steps 1–4 chiuso; repo allineato a `3f68da6`; GitHub e VPS in pari.
Scope: solo documentazione/governance. Nessuna modifica a `coordinate_converter Claude.html`.

Stato del piano: **APPROVATO CON MICRO-CORREZIONI RECEPITE**.
Prossimo passaggio, dopo questa versione finale: salvataggio in inbox.

---

## 1. Obiettivo

Standardizzare la memoria del repo GIS adottando un modello “wiki-LLM” lean, ispirato al control-plane ma adattato al peso reale del GIS.

L’obiettivo pratico è ridurre:

* numero di file letti dagli agenti;
* duplicazioni tra checkpoint, session log, latest e README;
* consumo token;
* rischio di usare fonti storiche come stato corrente;
* ambiguità tra orchestratore ChatGPT e implementor Cursor.

A regime, un agente deve leggere solo:

```text
README.md
docs/OPERATING_MEMORY.md
docs/work-units/WU-XXXX-<unità-corrente>.md
```

Tutto il resto resta storico, autosync, audit o supporto, ma non memoria corrente primaria.

---

## 2. Principio centrale

Un dato di stato deve avere **un solo punto di aggiornamento**.

Quindi:

* `README.md` = entry point, snapshot breve, indice.
* `docs/OPERATING_MEMORY.md` = memoria corrente degli agenti.
* WU corrente = dettaglio operativo/implementativo del blocco.
* vecchi checkpoint/session/latest = legacy/storico/autosync, non current-state.
* semantiche tecniche estese vivono nella WU dedicata, non replicate in README e OM.

Esempio OPSEC:

```text
README.md
  → OPSEC strict cycle = PASS, link a WU-0001.

docs/OPERATING_MEMORY.md
  → OPSEC strict cycle PASS, dettaglio in WU-0001.

docs/work-units/WU-0001-opsec-strict-cycle.md
  → unica fonte estesa della semantica OPSEC:
     forced-offline, cache, Navionics, seamarks, Esri, Open-Meteo, /sonar/.
```

---

## 3. Differenza GIS rispetto al control-plane

Il modello non si trasferisce 1:1 perché il control-plane è prevalentemente docs/governance, mentre il GIS contiene:

* monolite applicativo grande;
* storico implementativo;
* funzioni e helper critici;
* invarianti runtime;
* decisioni di codice;
* relazioni tra OPSEC, tile, cache, offline maps, geocoding, waypoint, tracce e UI.

Per questo le work unit del GIS non devono essere solo one-liner. Devono contenere il dettaglio tecnico selettivo, ma in forma strutturata.

Formato previsto nelle WU tecniche:

```text
## Indice tecnico implementativo

| Area | Funzioni / simboli | Invarianti | Note |
| --- | --- | --- | --- |
| OPSEC gate | tileFetchAllowed, internetApiFetchAllowed | forceOffline prevale | Strict graduato |
| Navionics | ensureNavProxyConsent, state._navProxyConsentGranted | transiente, non persistito | consenso per sessione |
| Seamarks | SEAMARK_OVERLAY, renderTileMap | bloccati sotto strict | nessun consenso |
```

---

## 4. Struttura finale lean

Struttura proposta:

```text
.
├── README.md
├── coordinate_converter Claude.html
├── .cursor/
│   └── rules/
│       └── *.mdc
└── docs/
    ├── OPERATING_MEMORY.md
    ├── roadmap.md
    ├── work-units/
    │   ├── WU-0001-opsec-strict-cycle.md
    │   └── WU-0002-memory-standardization.md
    ├── checkpoint.md
    ├── session-geolocalizzazione-e-mappa.md
    └── orchestrator/
        ├── latest.md
        ├── chatgpt-checkpoint.md
        └── inbox/
            └── AAAA-MM-GG_<HHMM>_*.md
```

Nota: nella prima migrazione non si spostano fisicamente i grandi file storici. Si aggiungono avvisi in cima e si flippano le regole di lettura. Il risparmio token deriva dal nuovo read-set, non dallo spostamento fisico dei file.

---

## 5. Ruoli finali dei file

### 5.1 `README.md`

Ruolo: entry point unico.

Contiene:

* snapshot operativo corrente in cima;
* breve descrizione progetto;
* indice documentazione;
* link a `docs/OPERATING_MEMORY.md`;
* link alle WU principali.

Non contiene:

* log lungo;
* dettagli funzione-per-funzione;
* semantica OPSEC completa;
* duplicazioni della OM.

Esempio snapshot:

```text
## Snapshot operativo corrente

| Campo | Stato |
| --- | --- |
| File operativo | coordinate_converter Claude.html |
| Architettura | HTML standalone, vanilla JS, no framework/npm/bundler |
| Memoria agenti | docs/OPERATING_MEMORY.md |
| Stato OPSEC | PASS — vedi WU-0001 |
| Unità corrente | WU-0002 — memory standardization |
```

---

### 5.2 `docs/OPERATING_MEMORY.md`

Ruolo: unica memoria corrente per agenti.

Nome ratificato:

```text
docs/OPERATING_MEMORY.md
```

Contiene:

* identità progetto;
* vincoli architetturali;
* read-set obbligatorio;
* protocollo orchestratore minimo;
* stato corrente sintetico;
* link alla WU corrente;
* tabella breve delle WU.

Non contiene:

* semantica OPSEC completa;
* log lungo;
* backlog infrastrutturale control-plane;
* duplicazioni estese del README.

Schema corretto:

```text
# GIS Tool — OPERATING_MEMORY

> Gli agenti devono leggere questo file prima di modificare il GIS Tool.
> Read-set operativo: README.md + docs/OPERATING_MEMORY.md + WU corrente.
> checkpoint.md, session-geolocalizzazione-e-mappa.md e latest.md sono legacy/storico/autosync, non memoria corrente.

## 1. Identità progetto

- Repo: mrhz1973/cursor-coordinate-converter
- File operativo: coordinate_converter Claude.html
- Tipo: app GIS tattica leggera, offline-first, OPSEC-aware

## 2. Vincoli architetturali

- Singolo file HTML standalone
- HTML/CSS/JS nello stesso file
- Vanilla JS
- No framework
- No TypeScript
- No npm
- No bundler
- No ES modules
- No split operativo

## 3. Protocollo orchestratore minimo

- ChatGPT e Cursor leggono README + OPERATING_MEMORY + WU corrente.
- Il flusso aggio aggiorna OPERATING_MEMORY/WU, non chatgpt-checkpoint.md.
- Prompt Cursor: istruzioni esterne fuori, blocco operativo pulito dentro.
- Procedere per blocchi piccoli.
- Non toccare aree non correlate.
- Non usare finito salvo richiesta esplicita del workflow.
- Nessun GPS silenzioso.
- Nessun live tracking GPS senza decisione esplicita.

## 4. Stato corrente

1. PASS — OPSEC strict cycle chiuso. Dettaglio: WU-0001.
2. PREPARED — Standardizzazione memoria wiki-LLM. Dettaglio: WU-0002.
3. PENDING — Prossimo blocco GIS monolite da decidere.

## 5. Work unit

| WU | Stato | Scopo |
| --- | --- | --- |
| WU-0001 | PASS | OPSEC strict cycle |
| WU-0002 | PREPARED | Memory standardization |
```

---

### 5.3 `docs/work-units/WU-0001-opsec-strict-cycle.md`

Ruolo: unica fonte estesa della semantica OPSEC implementativa.

Contiene:

* OPSEC Steps 1–4;
* commit;
* validazioni;
* smoke test VPS;
* funzioni/helper principali;
* invarianti;
* decisioni utente;
* backlog GIS collegato al monolite.

Deve contenere, una sola volta per esteso:

```text
- forced-offline prevale su tutto;
- cache hit sempre consentito;
- cache hit non tracciato;
- internet layer bloccati su cache miss sotto strict;
- Navionics con consenso per-sessione transiente;
- consenso Navionics resettato al toggle;
- seamarks bloccati secchi;
- Esri identify nel gate;
- Open-Meteo elevation nel gate;
- futuro /sonar/ eredita consenso nav quando integrato.
```

README e OM devono linkare questa WU, non ricopiare la semantica completa.

---

### 5.4 `docs/work-units/WU-0002-memory-standardization.md`

Ruolo: unità di lavoro della migrazione memoria.

Contiene:

* piano approvato;
* decisioni ratificate;
* commit previsti;
* criterio successo token/read-set;
* aggiornamento `aggio`;
* flip atomico rules;
* validazione finale.

Stato iniziale:

```text
PREPARED
```

Stato dopo esecuzione:

```text
PASS
```

---

### 5.5 `docs/checkpoint.md`

Ruolo target: legacy current-state file.

Azione:

* aggiungere avviso in cima;
* non usarlo più come memoria corrente dopo il flip;
* non cancellare contenuto nella prima migrazione.

Avviso previsto:

```text
> LEGACY / STORICO.
> La memoria operativa corrente è docs/OPERATING_MEMORY.md.
> Gli agenti non devono leggere questo file come stato corrente dopo il flip rules.
```

---

### 5.6 `docs/session-geolocalizzazione-e-mappa.md`

Ruolo target: storico implementativo lungo.

Azione:

* aggiungere avviso in cima;
* non appendere più come memoria corrente dopo il flip;
* consultarlo solo per audit o ricostruzione storica.

Avviso previsto:

```text
> STORICO LUNGO.
> Per lo stato operativo corrente leggere docs/OPERATING_MEMORY.md e la WU corrente.
> Questo file non è più aggiornato come memoria corrente dopo il flip rules.
```

---

### 5.7 `docs/orchestrator/latest.md`

Ruolo target: autosync non autoritativo.

Azione:

* mantenere se serve al workflow;
* aggiungere avviso;
* non leggerlo come current-state dopo il flip.

Avviso previsto:

```text
> AUTOSYNC NON AUTORITATIVO.
> Per stato corrente leggere README.md, docs/OPERATING_MEMORY.md e la WU corrente.
```

---

### 5.8 `docs/orchestrator/inbox/`

Ruolo target: archivio append-only e audit trail.

Azione:

* non cancellare;
* non leggere sistematicamente;
* salvare il piano approvato solo dopo questa fase di revisione.

Nome standard:

```text
docs/orchestrator/inbox/AAAA-MM-GG_<HHMM>_plan_memory-standardization-wiki-llm.md
```

---

### 5.9 `docs/orchestrator/chatgpt-checkpoint.md`

Decisione ratificata: **Opzione A**.

Ruolo target: legacy.

Il protocollo orchestratore minimo viene trasferito in `docs/OPERATING_MEMORY.md`.

Azione:

* aggiungere avviso in cima;
* non usarlo più come fonte viva del flusso `aggio`;
* mantenere come storico/compatibilità.

Avviso previsto:

```text
> LEGACY / PROTOCOLLO ORCHESTRATORE STORICO.
> Il protocollo operativo corrente vive in docs/OPERATING_MEMORY.md.
> Il flusso aggio non deve più usare questo file come fonte primaria dopo il flip rules.
```

---

### 5.10 `.cursor/rules/*.mdc`

Ruolo target: regole esecutive Cursor.

Azione:

* aggiornare nello stesso ciclo di migrazione;
* flip atomico obbligatorio;
* nuovo read-set obbligatorio:

  * `README.md`;
  * `docs/OPERATING_MEMORY.md`;
  * WU corrente.

Le rules devono dichiarare che:

```text
checkpoint.md, latest.md, session-geolocalizzazione-e-mappa.md e chatgpt-checkpoint.md
non sono più memoria corrente.
```

---

### 5.11 `docs/roadmap.md`

Ruolo target: strategia di lungo periodo.

Azione:

* resta consultabile;
* non entra nel read-set ordinario;
* viene letta solo per decisioni strategiche o quando la WU corrente lo richiede.

---

## 6. Boundary GIS / control-plane / Planet-Clone

`docs/OPERATING_MEMORY.md` del GIS deve contenere solo stato del GIS-monolite.

Esclusi dalla OM GIS:

```text
- porte raw tailnet 5000/8000;
- open proxy Navionics;
- B2 / Tailscale Serve / loopback;
- reboot-test systemd;
- systemd VPS;
- ACL/firewall;
- n8n;
- control-plane;
- Planet-Clone operativo.
```

Ammessi nella OM GIS:

```text
- integrazione futura /sonar/ nel monolite;
- UX GIS;
- mappe offline;
- import/export GIS;
- waypoint/tracce/poligoni;
- OPSEC lato monolite;
- cache/tile/geocoding lato app.
```

---

## 7. Trigger `aggio` e `finito`

### 7.1 Principio

Il cambio semantica trigger deve essere atomico.

Non deve esistere una fase in cui un agente non sa se aggiornare:

```text
vecchio set: checkpoint/session/latest/chatgpt-checkpoint
nuovo set: README/OPERATING_MEMORY/WU
```

---

### 7.2 Nuova semantica di `aggio`

Dopo il flip:

```text
aggio = aggiorna memoria operativa lean.
```

Aggiorna solo se necessario:

```text
- docs/OPERATING_MEMORY.md;
- WU corrente;
- README snapshot;
- autosync/inbox, se il workflow lo prevede.
```

Non aggiorna più come current-state:

```text
- docs/checkpoint.md;
- docs/session-geolocalizzazione-e-mappa.md;
- docs/orchestrator/latest.md;
- docs/orchestrator/chatgpt-checkpoint.md.
```

Punto B recepito:

```text
Il nuovo read-set vale anche per il flusso aggio di ChatGPT, non solo per Cursor.
Dopo il flip, aggio deve puntare a docs/OPERATING_MEMORY.md e alla WU corrente,
non a docs/orchestrator/chatgpt-checkpoint.md.
```

---

### 7.3 Nuova semantica di `finito`

Dopo il flip:

```text
finito = chiusura workflow Cursor secondo modello lean.
```

Deve verificare:

```text
1. WU corrente aggiornata;
2. OPERATING_MEMORY aggiornata solo se cambia stato corrente;
3. README snapshot aggiornato solo se necessario;
4. autosync/inbox creato se richiesto;
5. commit separati coerenti;
6. working tree pulito;
7. push completato se previsto.
```

Non deve più appendere automaticamente log lunghi come memoria corrente.

---

## 8. Finestra di deprecazione

Decisione ratificata:

```text
La finestra di coesistenza dura solo fino al commit atomico di flip rules.
```

Dopo quel commit:

```text
checkpoint.md
latest.md
session-geolocalizzazione-e-mappa.md
chatgpt-checkpoint.md
```

smettono di essere current-state.

Restano fisicamente presenti, ma solo come storico, legacy, autosync o audit.

---

## 9. Doc gate lean

Il gate documentale viene ridotto a 5 punti:

```text
DOC GATE LEAN

1. Read-set rispettato: README + OPERATING_MEMORY + WU corrente.
2. Un dato di stato aggiornato in un solo posto.
3. WU corrente aggiornata con stato PASS / FAIL / BLOCKED / PREPARED / PENDING.
4. Autosync separato dai docs operativi.
5. Nei blocchi docs-only, monolite non toccato.
```

Motivo: evitare nuova cerimonia pesante.

---

## 10. Schema commit corretto

### Commit 1 — piano approvato in inbox

Da fare solo dopo questa versione finale.

```text
docs(orchestrator): record memory standardization plan
```

File:

```text
docs/orchestrator/inbox/AAAA-MM-GG_<HHMM>_plan_memory-standardization-wiki-llm.md
```

---

### Commit 2a — creazione modello memoria

Micro-correzione A recepita: separare creazione modello da marcatura legacy.

```text
docs(memory): introduce GIS operating memory model
```

File:

```text
README.md
docs/OPERATING_MEMORY.md
docs/work-units/WU-0001-opsec-strict-cycle.md
docs/work-units/WU-0002-memory-standardization.md
```

---

### Commit 2b — marcatura legacy

```text
docs(memory): mark legacy memory files as historical
```

File:

```text
docs/checkpoint.md
docs/session-geolocalizzazione-e-mappa.md
docs/orchestrator/latest.md
docs/orchestrator/chatgpt-checkpoint.md
```

Scopo:

* aggiungere avvisi;
* declassare i file a legacy/storico/autosync;
* non cancellare contenuto;
* non usarli più come current-state dopo il flip.

---

### Commit 3 — flip atomico rules + aggio ChatGPT

Micro-correzione B recepita.

```text
docs(cursor): flip GIS memory read-set to wiki-LLM model
```

File probabili:

```text
.cursor/rules/*.mdc
docs/OPERATING_MEMORY.md
docs/work-units/WU-0002-memory-standardization.md
```

Questo commit deve riallineare:

```text
- Cursor;
- ChatGPT;
- flusso aggio;
- flusso finito;
- read-set operativo.
```

Requisito esplicito:

```text
Dopo il flip, il nuovo read-set README + OPERATING_MEMORY + WU corrente vale anche
per il flusso aggio di ChatGPT, non solo per le rules Cursor.
```

Verifica richiesta:

```text
aggio punta a docs/OPERATING_MEMORY.md e alla WU corrente,
non più a docs/orchestrator/chatgpt-checkpoint.md.
```

---

### Commit 4 — autosync finale

```text
docs(orchestrator): autosync memory standardization
```

File:

```text
docs/orchestrator/latest.md
docs/orchestrator/inbox/AAAA-MM-GG_<HHMM>_memory-standardization.md
```

---

## 11. Compatibilità con OPSEC e monolite

Questa migrazione non tocca runtime.

Vincoli assoluti:

```text
- non modificare coordinate_converter Claude.html;
- non modificare gate OPSEC;
- non modificare i18n runtime;
- non modificare proxy Navionics;
- non integrare /sonar/;
- non toccare VPS/systemd/ACL;
- non toccare Planet-Clone;
- non toccare control-plane;
- non usare finito;
- nessuna feature;
- nessun refactor.
```

La semantica OPSEC completa viene centralizzata in:

```text
docs/work-units/WU-0001-opsec-strict-cycle.md
```

README e OM la linkano soltanto.

---

## 12. Piano operativo finale

### Fase 0 — stato attuale

Completata.

* Piano revisionato due volte dal consigliere.
* Cinque correzioni sostanziali recepite.
* Micro-correzioni A e B recepite.
* Decisione §17.9 ratificata: protocollo orchestratore minimo dentro OM.

---

### Fase 1 — salvataggio piano approvato in inbox

File:

```text
docs/orchestrator/inbox/AAAA-MM-GG_<HHMM>_plan_memory-standardization-wiki-llm.md
```

Commit:

```text
docs(orchestrator): record memory standardization plan
```

---

### Fase 2a — creare modello memoria

Azioni:

* aggiornare README con snapshot + indice;
* creare `docs/OPERATING_MEMORY.md`;
* creare `WU-0001-opsec-strict-cycle.md`;
* creare `WU-0002-memory-standardization.md`.

Commit:

```text
docs(memory): introduce GIS operating memory model
```

---

### Fase 2b — marcare legacy

Azioni:

* aggiungere avviso a `docs/checkpoint.md`;
* aggiungere avviso a `docs/session-geolocalizzazione-e-mappa.md`;
* aggiungere avviso a `docs/orchestrator/latest.md`;
* aggiungere avviso a `docs/orchestrator/chatgpt-checkpoint.md`.

Commit:

```text
docs(memory): mark legacy memory files as historical
```

---

### Fase 3 — flip atomico rules + aggio

Azioni:

* aggiornare `.cursor/rules/*.mdc`;
* dichiarare nuovo read-set;
* ridefinire `aggio`;
* ridefinire `finito`;
* integrare doc gate lean;
* dichiarare che il read-set vale anche per ChatGPT;
* verificare che `aggio` non punti più a `chatgpt-checkpoint.md`.

Commit:

```text
docs(cursor): flip GIS memory read-set to wiki-LLM model
```

---

### Fase 4 — autosync finale

Azioni:

* aggiornare `docs/orchestrator/latest.md`;
* creare inbox finale.

File inbox finale:

```text
docs/orchestrator/inbox/AAAA-MM-GG_<HHMM>_memory-standardization.md
```

Commit:

```text
docs(orchestrator): autosync memory standardization
```

---

### Fase 5 — verifica successo

Criterio:

```text
Una nuova chat/agente deve poter ripartire leggendo solo:
- README.md
- docs/OPERATING_MEMORY.md
- WU corrente
```

Se chiede ancora checkpoint/session/latest/chatgpt-checkpoint come current-state, il flip non è riuscito.

---

## 13. Decisioni §17 ratificate

### 13.1 Nome memoria agenti

Ratificato:

```text
docs/OPERATING_MEMORY.md
```

---

### 13.2 `docs/checkpoint.md`

Ratificato:

```text
warning in cima, contenuto mantenuto, non più current-state dopo flip.
```

---

### 13.3 `docs/session-geolocalizzazione-e-mappa.md`

Ratificato:

```text
warning in cima, storico lungo, non più current-state dopo flip.
```

---

### 13.4 `docs/orchestrator/latest.md`

Ratificato:

```text
autosync non autoritativo.
```

---

### 13.5 `.cursor/rules`

Ratificato:

```text
aggiornamento nello stesso ciclo, con commit atomico di flip.
```

---

### 13.6 README

Ratificato:

```text
snapshot breve in cima, descrizione normale sotto, dettagli linkati.
```

---

### 13.7 Archiviazione fisica vecchi file

Ratificato:

```text
nessuno spostamento fisico nella prima migrazione.
```

---

### 13.8 Finestra di archiviazione/deprecazione

Ratificato:

```text
finestra secca fino al commit atomico di flip rules.
```

---

### 13.9 Confine orchestratore/esecutore

Ratificato:

```text
Opzione A — protocollo orchestratore minimo dentro docs/OPERATING_MEMORY.md;
docs/orchestrator/chatgpt-checkpoint.md declassato a legacy.
```

---

### 13.10 Piano-inbox e autosync finale

Ratificato:

```text
piano approvato in inbox separato dall’autosync finale.
```

---

## 14. Rischi residui

### Rischio 1 — doppia memoria

Mitigazione:

* commit atomico di flip;
* finestra di coesistenza chiusa al commit di flip;
* `aggio` e `finito` ridefiniti.

### Rischio 2 — ChatGPT e Cursor leggono fonti diverse

Mitigazione:

* protocollo orchestratore minimo dentro OM;
* `chatgpt-checkpoint.md` legacy;
* Fase 3 dichiara esplicitamente che il nuovo read-set vale anche per ChatGPT.

### Rischio 3 — perdita dettaglio implementativo

Mitigazione:

* WU tecniche con funzioni, invarianti e decisioni;
* session log conservato come storico.

### Rischio 4 — confine GIS/control-plane sporco

Mitigazione:

* OM GIS contiene solo stato monolite;
* infrastruttura resta fuori dalla OM GIS.

### Rischio 5 — nuova burocrazia

Mitigazione:

* read-set a 3 file;
* doc gate lean a 5 punti;
* niente archivi fisici nella prima migrazione.

---

## 15. Esclusioni esplicite

Questo piano non prevede:

```text
- modifiche a coordinate_converter Claude.html;
- modifiche OPSEC runtime;
- modifiche proxy Navionics;
- integrazione /sonar/;
- modifiche Planet-Clone;
- modifiche control-plane;
- modifiche VPS;
- modifiche systemd;
- modifiche ACL/firewall;
- uso di finito;
- prompt Cursor in questo turno;
- salvataggio inbox in questo turno;
- commit in questo turno.
```

---

## 16. Stato finale del piano

Stato:

```text
APPROVATO — pronto per salvataggio in inbox nel prossimo blocco.
```

Nome file previsto per il piano:

```text
docs/orchestrator/inbox/AAAA-MM-GG_<HHMM>_plan_memory-standardization-wiki-llm.md
```

Prossimo passo operativo:

```text
salvare il piano approvato in inbox, senza eseguirlo.
```
