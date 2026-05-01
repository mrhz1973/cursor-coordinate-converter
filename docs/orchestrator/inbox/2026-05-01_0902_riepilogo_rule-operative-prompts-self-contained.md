# Riepilogo — rule prompt operativi autosufficienti

**Timestamp:** 2026-05-01_0902

## Perché

Dopo **Pass 5 Step A** è emerso un errore di processo: è stato usato un **pass separato** dedicato solo a verifiche standard che **avrebbero dovuto** essere già incluse nel **primo** prompt operativo. Questo non deve diventare il flusso normale.

## Cosa è stato cambiato

- Aggiunta in **`.cursor/rules/30-output-workflow.mdc`** la sezione **«Prompt operativi autosufficienti (anti micro-pass di sola verifica)»**, posizionata tra *Messaggio finale* e *Autosync orchestratore*.
- Contenuto: principio di autosufficienza (implementazione + verifiche automatiche + test browser se possibile + orchestratore + RIEPILOGO nella stessa risposta); elenco **eccezioni** ammesse per un pass di sola verifica; blocco **controlli standard** quando si modifica il monolite (`git status`, `git diff --stat`, assenza `<script src>` / `type="module"`, `node --check` su JS estratto, test browser se fattibile, autosync); obbligo di dichiarare test browser non eseguiti + checklist manuale; non invitare a un secondo prompt di verifica se il RIEPILOGO è già completo.

## Nuovo comportamento atteso da Cursor

- Un **prompt operativo** implica un **unico** intervento che chiude il cerchio operativo + QA standard + memoria + riepilogo, salvo le eccezioni elencate nella rule.

## Eccezioni ammesse (riepilogo)

Pass di **sola verifica** separato solo se: controlli non eseguiti o impossibilità dichiarata; output mancante/contraddittorio/incompleto; test fallito; rischio concreto pre-commit; richiesta esplicita utente; task dichiarato solo audit/verifica.

## File modificati (questo intervento)

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-05-01_0902_riepilogo_rule-operative-prompts-self-contained.md` (questo file)

## File non toccati (conferma)

- `coordinate_converter Claude.html` — **non modificato**, **non incluso** nel commit di questo intervento
- `docs/PROJECT_notes.md`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`
- `docs/roadmap.md`
- `.cursor/rules/00-project-core.mdc`
- `.cursor/rules/10-html-architecture.mdc`
- `.cursor/rules/20-domain-knowledge.mdc`
- `.cursor/rules/99-known-state.mdc`

## Git

- Messaggio commit: `docs: rendi autosufficienti i prompt operativi`
- Stage: **solo** i tre file in *File modificati*; nessun `git add .`
- Hash short: vedi risposta chat / `git log -1 --oneline` dopo il push.
