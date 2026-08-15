# Riepilogo — WIKI-LLM-LEAN-CONSOLIDATION-B (final cleanup governance)

**Data:** 2026-08-15 · **Task:** governance/docs-only · **Commit task:** `b90217b` (`docs: complete lean governance SSOT cleanup`) — push riuscito, HEAD = origin/main = ls-remote verificato pre-autosync.

## Session guard

- Repo root `mrhz1973/cursor-coordinate-converter`, branch `main`, working tree iniziale pulito.
- HEAD iniziale verificata live: `c2ac6b8d83d77c28785aed0087af26eafd96428c` (combacia con SHA indicata da GPT; non assunta, verificata via `git ls-remote`).

## Cosa è stato fatto

1. **README AI-BOOT**: AUTO-VIA ora **scope-bound** («un NEXT appartenente a un'altra chat/task/workstream si riconosce come stato ma non si prende in carico»); riga ON-DEMAND roadmap riscritta: strategia/architettura/planning/backlog/distribution/out-of-scope, **mai** nel CORE BOOT ordinario. Blocco resta ~40 righe, nessuna espansione di metodo.
2. **`.cursor/rules/00-project-core.mdc`**: 44 → 26 righe. Vero alwaysApply guard/pointer: identità/invarianti minimi (single-file/vanilla, OPSEC, patch scoped), pointer CORE BOOT → README AI-BOOT, metodo → OM §4, esecuzione → rule 30, architettura → rule 10, riga unica Checkpoint/Finito. Rimozioni: procedura Checkpoint/Finito dettagliata, step git, schema due commit, autosync dettagliato, Mirror notice, joint authority, copia Rejected patterns, disagreement protocol copiato.
3. **`docs/roadmap.md`** (solo Notice + §1): Notice ora STRATEGIC REFERENCE ON-DEMAND (non CORE BOOT, non sempre caricata; rimossi read-in-full, mirror notice, both-authoritative, reading order always). Rejected patterns/disagreement protocol preservati come unica casa strategica. §1 riclassificato al modello vivo (AI-BOOT INDEX/BOOT · OM §4 METHOD · OM §7.1 LIVE STATE · WU hot-header LOCAL INDEX · roadmap STRATEGY/PLAN/BACKLOG · checkpoint/session LEGACY/HISTORY · rules = guards/pointers). Due residui «must be mirrored» nel body (§update-triggers, §review) corretti (classificati A).
4. **OM §7.1 FRONTIER**: rimossa prosa narrativa duplicata sotto la tabella (bootstrap/AGGIORNA-A/WU-0016). **Tabella invariata nei valori** (AGGIORNA-A, gate QA FINALE CHATGPT — PENDING, LIVE 2574250/195, NEXT QA operatore → auto-finito).
5. **WU-0016**: rimossa riga status stale post-hot-header (contraddiceva: REVIEW DOWNSTREAM PENDING/build 194 vs hot-header QA FINALE PENDING/build 195). **Hot-header invariato nei valori**. Origine/workstream precedente/decisioni/piano blocchi preservati.
6. **Rule 30**: invariata (nessun pointer rotto dalla rimozione del metodo da rule 00).

## Grep joint-authority / always-read (governance vive)

- `docs/roadmap.md:510` «must be mirrored in 00-project-core» → **A** corretto.
- `docs/roadmap.md:543` «add it and mirror to 00-project-core» → **A** corretto.
- `docs/cursor-workflow.md` (204 mirror table, 257) → **C** HISTORY/STORICO (header STATO: STORICO già presente), non modificato.
- README/OM/rules → nessun hit residuo.

## Cold boot test statico

- ls-remote + AI-BOOT (40) + OM §7.1 (13) + WU hot-header (10) = **63 righe** documentali (target ≤100).
- Determinabili: workstream, blocco, stato, gate, REVIEW BASE/RUNTIME LIVE, NEXT, conflitti (nessuno). Roadmap/OM §4/WU body non necessari.

## QA / veriche

- `git diff --stat`: esattamente i 5 file attesi. Monolite **non toccato** (invariato a LIVE build 195).
- Automated Browser QA: **NOT APPLICABLE** (docs-only). QA operatore: **NOT APPLICABLE** (per prompt).
- Nessun deploy, nessun build bump, nessun gate APP GIS avanzato; checkpoint/session legacy non modificati.

## Rischi residui / limiti

- Rule 00 lean richiede ricaricamento client Cursor perché i ridimensionamenti abbiano effetto nelle chat successive.
- `docs/cursor-workflow.md` resta STORICO con concetti mirror obsoleti (accettato, classificato C).
- Backlog noti (da CONSOLIDATION-A): archiviazione inbox >90gg, README §Opzione3 ↔ VPS_DEPLOY_RUNTIME, rinumerazione rule 32 doppia, README §Documentazione operativa → file STORICO.

## Prossimo passo

- Sessione APP GIS: attendere `QA D-FLIGHT-UX-COHERENCE-AGGIORNA-A PASS operatore` → auto-`finito` (Regola H). Governance: nessun'altra azione pendente.
