# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-29 (seconda nota) — chiarito: memoria obbligatoria **non** significa un file `inbox` per ogni micro-fix; **un** file (o stesso file) per **intervento** con elenco di tutte le micro-modifiche; `latest` resta breve, **senza** duplicazioni inutili con `inbox`. Regola 30, `README` e `chatgpt-checkpoint` aggiornati. **Nessun** edit a `coordinate_converter Claude.html` né a `docs/roadmap.md`.

## Ultimo intervento Cursor

Micro-chiarimento su **un file inbox per intervento** (più micro-fix nello stesso intervento = un unico `inbox` o sezioni, non un file per micro-fix); allineati [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc) (sezione *Dopo ogni intervento* + vincolo *Piano operativo*), `README.md`, `chatgpt-checkpoint.md`, addendum sotto a `inbox/2026-04-29_1548_...`.

## File modificati (sintesi)

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/README.md`, `docs/orchestrator/chatgpt-checkpoint.md`, `docs/orchestrator/latest.md` (questo)
- `docs/orchestrator/inbox/2026-04-29_1548_riepilogo_workflow-vincolante.md` (addendum al micro-chiarimento)

**Non toccati:** `coordinate_converter Claude.html`, `docs/roadmap.md`, script, npm, GitHub Actions, hook, n8n.

## Stato verifiche

- Rilettura per typo e link relativi; coerenza con vincolo “non toccare monolite/roadmap”.

## Stato Git noto

*(lasciare a ciò che risulta da `git status` in sede. Questa memoria descrive il lavoro appena fatto.)*

## Prossimo passo consigliato

- Eseguire, se d’accordo, commit/push **selettico** (solo `docs/orchestrator/**` + `.cursor/rules/30-output-workflow.mdc`) o avviare in sessione Cursor il flusso **«aggiornati»** (allineare memoria e commit/push selettivo) per Git.

## Prompt successivo / decisione richiesta

- Nessuna, salvo se si vuole includere il monolite in un commit separato lato utente.

## Dettagli

- Riepilogo completo: vedi `inbox` citato sopra. Checkpoint stabile: `docs/orchestrator/chatgpt-checkpoint.md`.
