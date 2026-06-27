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
| HEAD remoto (verificato) | `7975c5c7aae138c7616c4cd0b1f7b32fe4f94c2f` |
| Ultimo blocco chiuso | **APP-BUILD-NUM-B1** — CLOSED / PASS tecnico end-to-end |
| Runtime live VPS | `bd588a89a6bf0674351b384c607ab7ef73952ab2` |
| Blob monolite | `afddf87a6f05929b540f768a0193872057fe24cb` |
| `APP_BUILD_NUM` | `1` |
| Display runtime | `B5.5Z · build 1` |
| `APP_BUILD_ID` | `B5.5Z` (invariato) |
| P-POLYGON-LIST-ENRICHMENT | **CLOSED / PASS end-to-end** |
| URL runtime QA | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=bd588a8` |

**Prossimo ordine operativo:**

1. **P-POLYGON-LIST-UX-NEXT-A** — rinomina inline cella Nome
2. **P-POLYGON-LIST-UX-NEXT-B** — colonne tabella ridimensionabili

---

## Backlog / note immediate

### Cleanup build display (prossimo blocco runtime)

Foldare nel **prossimo** incremento `APP_BUILD_NUM` (non blocco separato obbligatorio):

- `#appBuildFooter` e `#appBuildAbout` oggi hard-codano `B5.5Z · build 1`
- Riportarli a solo `B5.5Z` o vuoto
- `applyAppBuildLabel()` = **unica fonte** della composizione ` · build N`

### UX-NEXT-A — rinomina inline

- Rinomina inline sulla cella Nome deve chiamare **`polygonRenameExecute(id, value)`**
- **Mai** scrivere `properties.name` diretto

### UX-NEXT-B — colonne ridimensionabili

- Larghezze **sessione / transienti** su `state` o nodo mount
- **Non** persistite in localStorage dedicato (salvo decisione esplicita futura)

---

## Aggiornamento di questo file

- **Method A:** handoff canonico repo — creato con blocco docs `docs/HANDOFF.md method A` (2026-06-27).
- Aggiornare snapshot § stato fresco e prossimo ordine a ogni chiusura docs rilevante; dettaglio completo resta in OM §7 e roadmap.
