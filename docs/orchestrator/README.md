# Memoria operativa (orchestratore ChatGPT)

`docs/orchestrator/` = memoria operativa versionata per l'orchestratore **ChatGPT**: `latest.md` (sintesi breve) + `inbox/YYYY-MM-DD_HHMM_<tipo>_<slug>.md` (dettaglio, un file per intervento) + `templates/`. **Non** sostituisce OM §7.1, roadmap o regole canoniche, e **non** è fonte primaria dello stato vivo (CORE BOOT = README AI-BOOT → OM §7.1 → WU hot-header).

Casa canonica del metodo (obblighi autosync, quando scatta, riconciliazione codice↔memoria, eccezioni, piani Plan mode, alias `aggio`): [`docs/OPERATING_MEMORY.md`](../OPERATING_MEMORY.md) §4 + [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc).

Regole pratiche valide qui:

- **Un intervento → un file inbox** (mai un file per micro-fix); piani/debug separati solo se migliorano la lettura.
- Commit autosync = **solo** `docs/orchestrator/**` (+ `.cursor/rules/**` pertinenti se toccate); monolite **mai** incluso salvo richiesta esplicita.
- Nessuna automazione (script, hook, CI, n8n) in questa cartella: solo markdown.
- `latest.md` = sintesi sempre aggiornata; log esteso nell'inbox.
- Cartella `archive/` per rotazione manuale (opzionale).
