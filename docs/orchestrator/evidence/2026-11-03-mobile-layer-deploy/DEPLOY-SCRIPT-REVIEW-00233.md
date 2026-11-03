# Review statica deploy Build 270 — versione AF69… corretta fino a 00233…

Data: 2026-11-03. Review indipendente in sola lettura dello script `work/release270-root/deploy-gis.sh`, SHA-256 `00233EDF0BD7FD9D5605438E885DE034461A2A0FF021D9CF6C22FF2999D4729F`.

## Esito

**PASS per i controlli richiesti.** Lo script non è stato eseguito e non è avvenuto alcun deploy durante questa review.

- Richiede il repository e l'origin GitHub esatti, branch `main`, HEAD VPS atteso `099d67b44e4f0c1910cc62476ccba10708c8f20a`, worktree pulito, runtime Build 268 e servizio GIS attivo.
- Verifica il tip GitHub due volte, l'ascendenza, il blob HTML e il suo SHA-256 prima del fast-forward.
- Salva runtime e snapshot degli stati/PID di proxy, GraphHopper, ORS e container n8n.
- Riavvia soltanto `goi-gis-app`; poi controlla servizio, byte HTTP serviti, e invarianza dei servizi non GIS e di n8n.
- I trap ERR/HUP/INT/TERM avviano il rollback e conservano il codice d'uscita. `merge_started` copre l'intervallo del fast-forward. Il rollback ripristina la ref `main`, verifica HEAD, SHA locale e HTTP, servizio GIS e gli altri PID.
- `git status` è fail-closed prima del merge, dopo il merge e prima di ogni reset.

## Limite residuo

Se dopo il merge Git non riesce a verificare lo stato o trova modifiche nel worktree, lo script si ferma con `STOP_GUARD` e non forza il rollback; Build 270 potrebbe restare in servizio e richiedere intervento manuale. Questa guardia preserva modifiche inattese.

Sintassi Bash verificata sul VPS con `bash -n` (solo lettura; nessuna istruzione dello script eseguita). La validità finale dipende ancora dal commit GitHub esatto e dai gate QA del candidato.

La review precedente [DEPLOY-SCRIPT-REVIEW.md](DEPLOY-SCRIPT-REVIEW.md), hash e7f28a…, riguarda una versione superata dello script e non è il gate corrente.