# HANDOFF — GOI GIS Tool

Handoff canonico breve del repository GIS. **Non sostituisce** `docs/OPERATING_MEMORY.md` §7 (stato vivo). Aggiornare questo file a ogni chiusura docs rilevante; non usare come dump storico.

---

## Regola stato

1. Leggere lo **stato corrente da GitHub `origin/main`** — non memoria interna dell’agente, cartelle locali stale o vecchi checkpoint.
2. **Autorità finale HEAD:** `git ls-remote origin refs/heads/main` da attore git-capabile.
3. RAW GitHub, blob via connector o copie locali sono **utili ma secondari** — possono essere stale; se divergono da `ls-remote`, vince `ls-remote`.

---

## Read-set operativo

In ordine:

1. `README.md` — bootloader e regole di lettura
2. `docs/OPERATING_MEMORY.md` — protocollo §4 e stato vivo §7
3. `docs/work-units/WU-0005-0009-roadmap.md` — piano, backlog, workstream
4. `docs/QA-CHECKLIST.md` — procedura/template QA
5. **`docs/HANDOFF.md`** — seed operativo sintetico (questo file)
6. `coordinate_converter Claude.html` — solo se serve codice/runtime

---

## Precedenza fonti

| Fonte | Ruolo |
| --- | --- |
| `README.md` | Bootloader / read-set |
| `docs/OPERATING_MEMORY.md` §7 | **Stato vivo** (autorità operativa) |
| `docs/work-units/WU-0005-0009-roadmap.md` | Piano / backlog / workstream |
| `docs/QA-CHECKLIST.md` | Procedura/template QA — **non** stato vivo |
| `docs/HANDOFF.md` | Seed handoff sintetico — **non** sostituisce OM §7 |
| `coordinate_converter Claude.html` | Runtime |
| `checkpoint.md`, `session-*.md`, `orchestrator/latest.md`, `chatgpt-checkpoint.md` | Legacy/storico — **non** stato corrente primario |

In conflitto: segnalare e preferire il documento **più specifico e più recente** (OM §7 / roadmap viva).

---

## Ruoli

| Attore | Ruolo |
| --- | --- |
| **GPT** | Orchestratore — scrive prompt Cursor e prompt review Claude |
| **Claude** | Consigliere upstream e verifier byte downstream; advisory; **no push**; **non** scrive prompt Cursor |
| **Cursor** | Esegue, committa, deploya secondo prompt e workflow del repo |

---

## Disciplina Cursor

- **Cursor write+commit = Agent+Auto** (Plan solo per diagnosi pura read-only).
- Prompt Cursor: **pulito e unico**; indicazioni operatore **fuori** dal prompt.
- **`finito`** = workflow interno a Cursor (non passo manuale operatore).
- Nei blocchi già approvati: `finito` **condizionale in coda** al prompt quando applicabile.
- Blocchi delicati o **Ramo B** pre-review: **stop** prima del deploy / prima del `finito` se previsto dal gate.

---

## Gate Ramo A / B

| Ramo | Criterio | Flusso |
| --- | --- | --- |
| **A** | Solo HTML / CSS / attributi, **zero JS** | Deploy diretto GIS-only + QA se richiesta |
| **B** | Qualsiasi JS | Commit/push → **STOP** → review byte Claude → deploy |
| **Dubbio** | — | Trattare come **Ramo B** |

**Review Claude obbligatoria** per: sanitizer/whitelist, create-path, nuovo campo persistito, OPSEC, rete/tile/proxy, cache/storage, architettura.

**Review Claude consigliata/obbligatoria** (secondo gate) per: lifecycle pannelli/dialog, drag P2/P4.

---

## Deploy GIS-only

| Parametro | Valore |
| --- | --- |
| Host SSH | `ionos-n8n` |
| Repo VPS | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| Servizio | `goi-gis-app.service` |

**Procedura:** `git fetch` → `git checkout main` → `git pull --ff-only origin main` → `systemctl restart goi-gis-app.service` → smoke HTTP + byte/SHA/cmp.

**Non toccare:** Planet-Clone, Navionics proxy, Docker, n8n, Tailscale/firewall, altri servizi.

**Push ≠ app aggiornata** finché non eseguito deploy GIS-only verificato.

---

## PASS

| Tipo | Definizione |
| --- | --- |
| **PASS tecnico remoto** | Hash / HEAD / blob / deploy / byte / SHA / cmp verificati |
| **PASS operatore** | Attestazione **persona** su app live |

- Cursor **non inventa** PASS operatore.
- **Fail-closed** senza attestazione esplicita.
- QA **minima narrativa** di default; checklist estesa solo per OPSEC, rete, cache/storage, migrazioni, architettura, diff multi-area, alto rischio.

---

## Stato fresco (snapshot — verificare sempre con `ls-remote`)

> Valori registrati al momento dell’ultimo aggiornamento di questo file. **Non** fidarsi senza ri-verifica remota.

| Campo | Valore |
| --- | --- |
| HEAD remoto (verificato) | `14605e9` — aggiornare con `git ls-remote` prima di ogni sessione |
| Ultimo blocco chiuso | **UI-MODAL-PARITY-HELP-QR-FIX2** — CLOSED / PASS end-to-end |
| Runtime live VPS | `14605e9d4dcdce738d5759a4c24ecc38dbb7e7e4` |
| Blob monolite | `0886b6bb4ab4b2cd13e060b1c6f34eafe6953259` |
| `APP_BUILD_NUM` | `7` |
| Display runtime | `B5.5Z · build 7` |
| `APP_BUILD_ID` | `B5.5Z` (invariato) |
| UI-MODAL-PARITY-HELP-QR | **CLOSED / PASS end-to-end** (build 5 → FIX1 build 6 → FIX2 build 7) |
| URL runtime QA | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=14605e9` |

**Prossimo ordine operativo:**

1. **CONVERT-SOURCE-PICKER** — sorgenti waypoint/preferito/punto mappa nel Convertitore
2. **P-POLYGON-LIST-UX-NEXT-B-FIX2** — indicatore Vis. poligoni (pallino verde/grigio)

---

## Backlog / note immediate

### CONVERT-SOURCE-PICKER

- Waypoint / preferito / punto mappa corrente come sorgente Convertitore
- Blocco separato, GIS-first

### P-POLYGON-LIST-UX-NEXT-B-FIX2 — Vis indicator

- Colonna Vis.: pallino verde se visibile, spento/grigio se nascosto
- Micro-fix UX; non blocca chiusura Help/QR

### UX-NEXT-B — colonne ridimensionabili (runtime landed)

- Larghezze **sessione / transienti** su `state` o nodo mount
- **Non** persistite in localStorage dedicato (salvo decisione esplicita futura)

### Dead code candidato (non implementare ora)

- `polygonShowRenameBar` non più chiamata dalla lista Poligoni; cleanup futuro solo se nessun altro path la usa

---

## Aggiornamento di questo file

- **Method A:** handoff canonico repo — creato con blocco docs `docs/HANDOFF.md method A` (2026-06-27).
- Aggiornare snapshot § stato fresco e prossimo ordine a ogni chiusura docs rilevante; dettaglio completo resta in OM §7 e roadmap.
