# Riepilogo — WIKI-LLM-LEAN-CONSOLIDATION-A (docs-only)

Data: 2026-08-15 · Tipo: consolidamento architettura documentale (audit memoria operativa) · Monolite: **non toccato**.

## Contesto

Audit richiesto dall'operatore: le chat operative saturano il contesto troppo rapidamente. Diagnosi: causa primaria = Project Instructions massive (~1200 righe/5 rule `alwaysApply` ≈ 78 KB iniettati in ogni messaggio) che duplicano quasi integralmente OM §4; cause secondarie = header AUTO-VIA duplicato in 13 file, OM §7b/§8/§9 duplicati dalle rules, orchestrator/README duplicato dalla rule 30, ambiguità live/legacy in LLMS.md/METHOD.md/cursor-workflow.md.

## Cosa è stato fatto

1. **OM §4 = casa canonica del metodo** (rafforzata):
   - nuovo **indice regole** in testa (tabella A/B/C/D/D1/D2/D2bis/E/F/G/H/I/CBG + mini-regole) con indicazione on-demand;
   - nuova estensione **CONNECTOR-SCHEMA-GUARD** (parte integrante di CONTEXT-BUDGET-GUARD): schema acquisito non si riacquisisce; discovery generica vietata se un tool noto basta; `list_resources` max una volta per capability; payload GitHub con range/compare, mai «per completezza»;
   - nuove **mini-regole canoniche** L10N-FREEZE e QA-HUMAN-NO-OPSEC (prerequisito per ridurre le rules 32 senza perdita).
2. **Rules ridotte a puntatori + sola esecuzione Cursor:**
   - `00-project-core.mdc`: 106 → 28 righe (identità, invarianti, bootstrap, AUTO-VIA pointer, trigger Checkpoint md / Finito compatti, mirror notice con rejected patterns in sintesi);
   - `30-output-workflow.mdc`: 538 → 32 righe (RIEPILOGO, STATO FRESCO, /tmp file, plan-mode save, autosync esecuzione, session guard/PASS remoto — tutti puntati a OM §4);
   - `31-qa-single-message.mdc`: 74 → 12; `32-l10n-en-fr-freeze.mdc`: 33 → 7; `32-qa-human-no-opsec.mdc`: 25 → 7 (stub con sintesi vincolante + pointer a OM §4).
3. **Header AUTO-VIA rimossi da 12 file** (restava solo README AI-BOOT come copia canonica: Principi → AUTO-VIA «unica copia canonica: questo blocco»; il footer AUTO-VIA di OM è stato eliminato con §8/§9). Nessun'altra riga modificata in quei file.
4. **OM deduplicato:**
   - §3 read-set: 14 → 6 righe (pointer a README AI-BOOT per CORE BOOT/precedenza/legacy; cache RAW);
   - §7b invariato (contenuto unico VPS/Planet-Clone); §8 tabella WU (stale, ferma a WU-0013) → pointer a §7.1 + roadmap; §9 pattern nomi inbox → 2 righe (template + pointer).
5. **orchestrator/README.md**: 100 → 18 righe (sintesi + pointer a OM §4/rule 30; regole pratiche un-file-per-intervento, commit selettivo, no automazioni).
6. **LLMS.md**: riga stato corrente corretta da `checkpoint.md` a `docs/OPERATING_MEMORY.md` §7.1; rimossi riferimenti dev-method/Claude-Code/Cursor-CLI obsoleti; aggiunte righe CORE BOOT/method/plan/legacy.
7. **METHOD.md / cursor-workflow.md**: header `STATO: STORICO` (metodo vivo = OM §4 + rules).

## File modificati (19)

`.cursor/rules/{00,30,31,32-l10n,32-qa}.mdc` · `README.md` · `LLMS.md` · `docs/OPERATING_MEMORY.md` · `docs/HANDOFF.md` · `docs/QA-CHECKLIST.md` · `docs/METHOD.md` · `docs/cursor-workflow.md` · `docs/orchestrator/README.md` · `docs/work-units/{WU-0005-0009-roadmap,WU-0010,WU-0013,WU-0014,WU-0015,WU-0016}.md` (ultimi sette = sola rimozione header AUTO-VIA).

## Verifiche eseguite

- `git status --short` / `git diff --stat`: 19 file, **+117/−891** (saldo −774 righe);
- grep `AUTO-VIA-HEADER` nel repo: **0** occorrenze residue (canonica = README AI-BOOT);
- testo integrale `METHOD-BUNDLING-DEFAULT` / `QA-HUMAN-SHORT-TARGETED` / F3: **solo** OM §4 (+QA-CHECKLIST per il template);
- OM §7.1/§7.2 **intatti** (nessuna regione diff) — blocco LEGEND-ATM09-UX-A della sessione parallela non toccato;
- monolite `coordinate_converter Claude.html` **assente** dal diff;
- newline finali ripristinati dopo le riscritture; nessuna corruzione caratteri (diff WU/HANDOFF/QA-CHECKLIST = solo header);
-Automated Browser QA: **NOT APPLICABLE** (docs-only, nessuna superficie browser).

## QA / gate

Docs-only, no deploy, no build bump. Automated Browser QA = NOT APPLICABLE. QA operatore non richiesta (nessuna superficie percepibile in runtime).

## Cosa NON è stato toccato

Monolite; WU body (spec/acceptance); roadmap.md §Notice (casa canonica rejected patterns); QA-CHECKLIST contenuto; LAST_CURSOR_REPORT(+template); inbox esistenti; checkpoint.md/session-*.md (già flaggati LEGACY); HANDOFF (solo header AUTO-VIA rimosso); templates orchestratore.

## Rischi residui / backlog

1. **Cursor client**: le rules sono file repo → l'operatore deve ricaricare la finestra Cursor (o attendere re-index) perché i Project Instructions ridotti abbiano effetto sulla prossima chat.
2. **inbox/ = 529 file** senza ciclo di vita: backlog separato per policy di archiviazione (es. >90 gg → archive) — NON in questo blocco.
3. Renumbering rule doppia numerazione `32-*`: cosmetico, backlog.
4. README §Documentazione operativa → `docs/METHOD.md` (ora flaggato STORICO): coerente, ma eventualmente da rivedere nel prossimo sweep README prodotto.
5. Boot budget atteso per nuova chat: **~200 righe** (PI ~85 vs ~1200 odierne + CORE BOOT ~110) — verificare empiricamente alla prossima chat operativa.

## Prossimo passo

QA FINALE CHATGPT — N/A per questo blocco (docs-only). Prossimo blocco funzionale: **D-FLIGHT-UX-COHERENCE-LEGEND-ATM09-UX-A** in gate `QA FINALE CHATGPT — PENDING` (sessione parallela; non toccare finché non arriva l'attestazione).
