# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-05-01 — **Pass 3 (feature storiche / OPSEC strict / valutazione §4.8):** **`docs/PROJECT_notes.md`** aggiornato con sezioni **OPSEC strict — definizione operativa**, **Valutazione roadmap §4.8**, marcature **`REMOVED 2026-04-24`** in §4 e §7, backlog UI floating panels. Monolite **non** modificato; **`docs/roadmap.md`** non modificata. Rules: **`20-domain-knowledge.mdc`** + **`99-known-state.mdc`** (allineamento minimo principio vs gate geocoding); **`10-html-architecture.mdc`** invariato. Commit: **`docs: consolida OPSEC e valutazione file size`**. Inbox: **`docs/orchestrator/inbox/2026-05-01_0221_riepilogo_pass3-opsec-file-size.md`**.

2026-04-30 — **Pass 2 (persistenza / IndexedDB / cap array):** audit meccanico solo lettura sul monolite; **`docs/PROJECT_notes.md`** arricchito con sezione **«Persistenza, IndexedDB e cap array»**. Commit **`docs: consolida persistenza e cap array`** (`e23acba`). Inbox Pass 2: **`docs/orchestrator/inbox/2026-04-30_1815_riepilogo_pass2-persistenza-cap.md`**.

2026-05-01 — **Pass 1.5 (verifica audit numerico):** sanity **`wc -l` ≡ `awk END{print NR}` ≡ 37011**. Inbox: **`docs/orchestrator/inbox/2026-05-01_0157_riepilogo_pass1_5-verifica-audit-numerico.md`**.

## Ultimo intervento Cursor

**Pass 3** — consolidamento documentale storico/OPSEC/file-size + rules minime.

## File modificati (sintesi)

- `docs/PROJECT_notes.md`, `docs/orchestrator/latest.md`, `docs/orchestrator/inbox/2026-05-01_0221_riepilogo_pass3-opsec-file-size.md`, `.cursor/rules/20-domain-knowledge.mdc`, `.cursor/rules/99-known-state.mdc`

## Prossimo passo consigliato

Decidere se aprire **piano Tier 1 vendored split** (candidati: WMM, SunCalc, QR, OLC) oppure riprendere **QA/feature** solo dopo conferma utente — senza split implicito.

## Dettagli (inbox)

- **Pass 3 OPSEC / §4.8:** `docs/orchestrator/inbox/2026-05-01_0221_riepilogo_pass3-opsec-file-size.md`
- **Pass 2 persistenza/cap:** `docs/orchestrator/inbox/2026-04-30_1815_riepilogo_pass2-persistenza-cap.md`
- **Pass 1.5 audit numerico:** `docs/orchestrator/inbox/2026-05-01_0157_riepilogo_pass1_5-verifica-audit-numerico.md`
