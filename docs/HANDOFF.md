<!-- AUTO-VIA-HEADER: NON RIMUOVERE -->
> **REGOLA OPERATIVA VINCOLANTE — AUTO-VIA.** Se il prossimo passo non richiede una decisione reale dell’operatore — scelta di prodotto, scope ambiguo, rischio non autorizzato o conflitto non risolvibile — l’assistente deve considerare il `vai` già concesso e procedere autonomamente. È vietato chiedere conferme, autorizzazioni o un nuovo `vai` per attività già approvate, programmi già autorizzati o passaggi tecnicamente determinati. Un programma esplicitamente autorizzato resta autorizzato per i blocchi successivi finché non emerge una scelta reale o un gate fallito. Fermarsi soltanto davanti a una decisione effettiva che può cambiare il risultato.
<!-- /AUTO-VIA-HEADER -->

# HANDOFF — seed / pointer (stabile)

**Ruolo:** seed/pointer di handoff tra chat. **Non** è stato operativo vivo. **Non** aggiornare a ogni `finito` con gate/runtime/SHA/history.

Stato vivo → [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) **§7.1**. Metodo → OM **§4**. Audit → WU / inbox / `LAST_CURSOR_REPORT` / git history.

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
3. OM **§7.1 FRONTIER**
4. Hot-header della WU attiva (`<!-- WU-HOT-HEADER -->`)

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
CORE BOOT: README AI-BOOT → OM §7.1 → WU hot-header
```

---

## Manutenzione

Aggiornare questo file **solo** se cambia il protocollo seed/pointer o i puntatori strutturali.  
**Vietato** usarlo come copia rolling di blocco/gate/candidate/live/CLOSED.
