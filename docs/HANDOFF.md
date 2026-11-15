
# HANDOFF — seed / pointer (stabile)

**Ruolo:** seed/pointer di handoff tra chat. **Non** è stato operativo vivo. **Non** aggiornare a ogni `finito` con gate/runtime/SHA/history.

Stato vivo → [`docs/FRONTIER.md`](FRONTIER.md). Metodo → [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) **§4**. Audit → WU / inbox / `LAST_CURSOR_REPORT` / git history.

---

## Autorità remota

```text
git ls-remote origin refs/heads/main
```

Autorità **finale**. RAW/CDN secondari (possono essere stale).

---

## CORE BOOT (dopo il seed)

1. Verifica `git ls-remote origin refs/heads/main`
2. `README.md` — **solo** blocco `<!-- AI-BOOT: START -->` … `<!-- AI-BOOT: END -->`
3. [`docs/FRONTIER.md`](FRONTIER.md)
4. Hot-header della WU attiva (`<!-- WU-HOT-HEADER -->`), solo se FRONTIER indica una WU e il relativo path; se `WU ATTIVA` è `—` / `NONE` / `N/A`, il passo è N/A. Non cercare o inferire il path.

Poi: materiale ulteriore **solo on demand** (OM §4 Regola I).

---

## Principio context-safe

- Nessun preload di OM §4 intero, roadmap, WU body, QA-CHECKLIST, questo file oltre il protocollo, LAST_CURSOR_REPORT, inbox, monolite.
- §7.2 / §7.3 = on-demand.
- AUTO-VIA invariata: passo tecnicamente determinato → procedere senza nuovo `vai`.

---

## Precedenza

**GitHub / documenti vivi** (pinnati allo SHA remoto) **>** seed chat / questo file.

Un handoff vecchio resta solo seed: dopo riconciliazione, il repo vivo prevale.

---

## ON DEMAND (pointer)

| Bisogno | Fonte |
| --- | --- |
| Metodo (F/G/H/I/D2/…) | OM §4 — sola Regola necessaria |
| Piano / backlog | roadmap / WU body |
| Gate QA | [`QA-CHECKLIST.md`](QA-CHECKLIST.md) |
| Evidence post-push | [`runtime/LAST_CURSOR_REPORT.md`](runtime/LAST_CURSOR_REPORT.md) |
| History intervento | `docs/orchestrator/inbox/` · `latest.md` |
| Runtime | monolite — symbol / range / diff / FULL SHA |

---

## Template seed minimo (fine sessione — Regola F)

Emettere in chat (fenced), **non** persistere come current-state in questo file:

```text
repo: mrhz1973/cursor-coordinate-converter
HEAD verificato (ls-remote) @ <timestamp> = <full-sha>
frontiera: <block-id> (<data>)
CORE BOOT: README AI-BOOT → docs/FRONTIER.md → WU hot-header (solo se WU ATTIVA non N/A)
```

---

## Manutenzione

Aggiornare questo file **solo** se cambia il protocollo seed/pointer o i puntatori strutturali.  
**Vietato** usarlo come copia rolling di blocco/gate/candidate/live/CLOSED.
