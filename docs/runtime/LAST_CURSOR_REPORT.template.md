# LAST_CURSOR_REPORT template

> Copiare/istanziare come `LAST_CURSOR_REPORT.md` a ogni autosync Cursor (contratto A/B/C). **Non** fonte viva primaria — prevale [`docs/FRONTIER.md`](../FRONTIER.md).
>
> **Home canonica:** OM §4 (LAST_CURSOR_REPORT / `agg`) · [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc).

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | |
| **GATE** | |
| **NEXT** | |
| **Runtime LIVE** | |
| **Candidate FULL SHA** | |
| **Build / ID / blob** | |
| **Deployed state** | |
| **Result Cursor** | |
| **Working tree** | |

### Identità SHA (non autoreferenziali)

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | `<SHA monolite/candidate, se applicabile>` |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `<origin/main al momento della stesura, PRIMA del commit report>` |
| **docs/report HEAD** | `PENDING_SELF_REFERENCE` |
| **real_task_commit** | `<SHA commit task principale — anchor stabile>` |
| **previous_report_container** | `<SHA container precedente già pubblicato, o omettere>` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |
| **final_remote_head_after_report_push** | `EXTERNAL_ONLY` |

Evidence puntata (se il gate la richiede): `<path inbox>`

## B. RIEPILOGO COMPLETO

Il testo completo mostrato all’operatore a fine pass (numerato), non una sintesi. Includere: autosync; git status; diff stat; file modificati; regioni; cosa fatto; funzioni; i18n; non toccato; lint/selftest/ABQA se applicabile; commit runtime/docs; evidence; limiti/backlog; `STATO FRESCO DA CURSOR`.

```text
STATO FRESCO DA CURSOR
origin/main HEAD:
working tree:
ultimo blocco PASS:
prossimo candidato:
note operative:
```

## C. OUTPUT GIT (pre-container)

```text
# Solo output verificabile PRIMA del commit container corrente.
# NON includere lo SHA del commit report corrente (non ancora creato).

git log --oneline -5
...
git rev-parse HEAD
...
git rev-parse origin/main
...
git branch --show-current
...
git ls-remote origin refs/heads/main
...
```

PASS remoto del container corrente: **EXTERNAL_ONLY** — `git ls-remote origin main` e seed Regola F.

### Nota operativa — container e self-reference

- **`real_task_commit`** è l’anchor stabile: **non** sostituirlo con autosync, HEAD finale o blob SHA del report.
- **`current_report_container`** resta **`PENDING_SELF_REFERENCE`** nel commit che contiene questo file.
- **Non** amendare il commit autosync/report per inserire il proprio SHA.
- **Non** creare commit finalize-hash né terzo commit dedicato al backfill del container corrente.
- Il **HEAD finale** post-push del container corrente va attestato nel **report Cursor in chat** e nel seed handoff (Regola F) — non nel file come fatto già verificato.
- Un container precedente può essere backfillato in **HISTORY** soltanto da un report **successivo**.

## HISTORY

<!-- Entry precedenti. Backfill PENDING_SELF_REFERENCE solo se già pubblicati e verificabili. -->

## LIMITI

* Non sostituisce FRONTIER / WU hot-header / roadmap.
* Non certifica PASS operatore senza attestazione esplicita.
* Non usa RAW GitHub come autorità finale.
* Non richiede commit finalize-hash.
* Non prova il proprio HEAD finale.
* Non è seconda LIVE STATE.
