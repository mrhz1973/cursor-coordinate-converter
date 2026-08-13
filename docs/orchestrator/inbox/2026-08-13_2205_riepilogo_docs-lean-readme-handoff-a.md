# Riepilogo — DOCS-LEAN-README-HANDOFF-A

**Data:** 2026-08-13 ~22:05 (locale)  
**Tipo:** docs/governance wiki-LLM lean — Blocco 2  
**Gate:** `DOCS-LEAN-README-HANDOFF-A CLOSED / PASS DOCS-ONLY`  
**Task commit:** `6b4a84a89249767a5bf720db6577d037d9d70c92`  
**Subject:** docs: lean README AI-BOOT + HANDOFF seed (DOCS-LEAN-README-HANDOFF-A)  
**Push task:** riuscito (`6873f61..6b4a84a`)  
**Baseline pre-flight:** `6873f613216139ce5b8d55f080da4ac42003aa73` (= ls-remote, nessun avanzamento remoto)  
**Working tree pre-autosync:** pulito dopo push task (solo file autosync in questo commit)

## Cosa è stato fatto

1. README: blocco `<!-- AI-BOOT: START/END -->` (CORE BOOT); rimosso read-set esteso obbligatorio e snapshot operativo stale; docs prodotto umane conservate.
2. `docs/HANDOFF.md`: trasformato in seed/pointer stabile (~79 righe); niente current-state / CLOSED history.
3. OM §4 Regola F: seed handoff minimale (repo/SHA/frontiera/CORE BOOT).
4. OM §4 Regola I: CORE BOOT esplicito; §7.2/7.3 e fonti on-demand.
5. `finito` / rules: README solo se cambia AI-BOOT; HANDOFF non rolling.
6. OM §7.1: gate runtime FIX2 **invariato**; nota docs lean CLOSED. §7.2: pointer chiusura docs.

## File modificati (task)

- `README.md`
- `docs/HANDOFF.md`
- `docs/OPERATING_MEMORY.md` (§4 F/I + §7.2 registrazione chiusura; §7.1 gate runtime non convertito)
- `.cursor/rules/00-project-core.mdc`
- `.cursor/rules/30-output-workflow.mdc`

## Esclusi

- `coordinate_converter Claude.html` — invariato
- roadmap — invariata
- WU hot-header / gate runtime — invariati
- QA-CHECKLIST — invariata
- Deploy / QA browser — N/A docs-only

## Misure

| Metrica | Prima | Dopo |
| --- | --- | --- |
| README AI-BOOT | (sezione boot estesa ~60+ nel corpo) | **38** righe marker |
| HANDOFF | ~316–460 | **79** (~75–83% riduzione) |
| Bootstrap simulato | read-set 5–6 doc | AI-BOOT+§7.1+hot = **~65** righe |

## Smoke anti-duplicazione

PASS (20/20 checks del prompt): OM §7.1 unica live; HANDOFF senza current-state; AI-BOOT senza snapshot runtime; finito non ricresce HANDOFF/README per gate; AUTO-VIA/F3 invariati; monolite/roadmap invariati.

## Bootstrap simulato

PASS — determina workstream WU-0013, FIX2, gate review GPT, REVIEW BASE/CANDIDATE/LIVE, NEXT senza leggere resto README/OM§4/roadmap/HANDOFF/QA/inbox/monolite.

## Prossimo passo (runtime, non questo blocco)

GPT review FULL SHA `52927c565d5301870a82d688c899024d8d499aee` → se PASS: deploy GIS-only → Automated Browser QA → QA operatore → Regola H `finito`.

## Limiti

- Fatti del commit autosync corrente = EXTERNAL_ONLY (F3).
- Non alterato il gate runtime FIX2.
