# ROOT REVIEW — preparazione deploy Build 282

**10 novembre 2026 — PASS STATICO della procedura preparata, dichiarato dal coordinatore dopo revisione diretta.** Questo rapporto è distinto dalla review del runtime. Nessun preflight, apply, SSH, fetch VPS o restart è attestato da questa revisione o da questo checkpoint.

La procedura deriva dal deploy 281 al ref `b7ba9e1af0da4e3a4bbf6790790d39dec20041d4`. L'esame AST/diff del coordinatore limita le modifiche remote a `checked_backup_path`, `load_state`, `main`, `preflight` e all'etichetta rollback; nel launcher a `main` e `result_summary`. Applicazione, health HTTP/TLS e invarianti condivisi sono byte-identici alla procedura 281.

Il preflight prepara backup e journal prima del fetch. `load_state` permette di leggere il preflight fallito senza allentare le guardie apply. Il congelatore locale verifica ancestry, blob, SHA-256, byte, build e delta docs-only dal source al target; non apre SSH.

## Identità raw dei file revisionati sul PC

| File | SHA-256 raw |
| --- | --- |
| runtime282-remote.template.py | `e633af45cd26fd65e0dc81dd41b81cbb462f58d40d6c5ee3f7c703a55c0be44d` |
| runtime282-launch-windows.template.py | `8e8647dd81b74e001e080e6c8c9dacb8cd19d32219947a9fdf7d62799f2c063e` |
| freeze-runtime282-package.py | `b2b2b75ce1f6dc846acbb30c7eec863eba457fe99f48d74a6692822a88a1616b` |

Il [pacchetto preparato](deploy-preparation/PREPARATION.md) è archiviato senza directory frozen e senza duplicare il runtime. Il suo [manifest di preparazione](deploy-preparation/preparation-manifest.json) descrive gli originali preparati sul PC. L'evidence-manifest del dossier misura invece i blob Git staged/pubblicati e conserva separatamente le identità raw e le normalizzazioni.

Il commit di questo checkpoint può diventare TARGET per il solo congelamento locale. La verifica finale del reviewer sul nuovo ref, il GO del coordinatore, il preflight/apply effettivo e l'ABQA nativa sono passaggi successivi: non sono anticipati da PASS STATICO.
