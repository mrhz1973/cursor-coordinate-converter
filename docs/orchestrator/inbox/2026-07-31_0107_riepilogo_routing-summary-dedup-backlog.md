# Riepilogo — docs-only ROUTING-SUMMARY-DEDUP-A

Timestamp: 2026-07-31 ~01:07 (locale)

## Natura

Riconciliazione **docs-only** post-finito TRACK-SAVE-AS-NAME-A. **Nessuna** modifica runtime. **Nessun** `finito` di chiusura runtime aggiuntivo.

## Backlog registrato

**ROUTING-SUMMARY-DEDUP-A** — Riepilogo Routing senza metriche duplicate — **BACKLOG / NON APERTO**

Testo canonico: eliminare dalla riga di stato superiore distanza, tempo stimato, dislivello positivo e dislivello negativo, già presenti nelle card metriche; conservare nella riga superiore soltanto «Percorso pronto» e gli eventuali messaggi operativi, di loading, avviso o errore.

Motivazione: metriche duplicate; testo superiore piccolo/rumoroso; card = sede primaria metriche; riga superiore = stato.

Emerso in QA TRACK-SAVE-AS-NAME-A — **non** FAIL del blocco.

## Runtime (invariato)

- Tip: `8a641bc7abb9b1c2be98c3591e4a590e127e0a77`
- Build: `B6.1TSN-A · build 83`
- Blob: `be95db55576f79e53fa7b07cee630530adebfbe9`
- TRACK-SAVE-AS-NAME-A: **CLOSED / PASS end-to-end** (invariato)
- WU-0010: **OPEN** (Bundle F futuro)

## Commit docs (pre-autosync)

- SHA: `726ee816336ee9b07eba57be67a6ecc35dfe3527`
- Subject: `docs: register routing summary dedup backlog`
- File: OM §7, HANDOFF, WU-0010, roadmap WU-0005-0009
- Monolite: **escluso** / non modificato

## git status --short (dopo docs, prima autosync)

```
 M docs/orchestrator/latest.md
 M docs/runtime/LAST_CURSOR_REPORT.md
?? docs/orchestrator/inbox/2026-07-31_0107_riepilogo_routing-summary-dedup-backlog.md
```

## Limiti

- Fatti del commit autosync corrente: **EXTERNAL_ONLY**
- Nessun deploy; nessuna QA aggiuntiva; nessun blocco aperto
