# Riepilogo — Hosting deploy runbook e script PowerShell

**Data:** 2026-05-27  
**Commit principale:** `a614405` — `docs: add GIS hosting deploy runbook and helper script`  
**Push:** riuscito su `origin/main`  
**Trigger:** prompt operativo PC lavoro + `aggio gis`

## Cosa è stato fatto

1. **Preflight PC lavoro:** repo `mrhz1973/cursor-coordinate-converter`, branch `main`, workspace clean, pull `--ff-only` OK (Already up to date, HEAD `11e663d` pre-intervento).
2. **Creato** `docs/hosting/firebase-vps-deploy.md` — runbook completo:
   - setup una tantum (Node, Firebase CLI, login, init hosting, `.firebaserc`/`firebase.json`);
   - update ricorrente (copia monolite → `public/index.html`);
   - Firebase deploy (`gistoolmarty-33cf8`, URL https://gistoolmarty-33cf8.web.app);
   - VPS staging manuale (http://217.160.71.145/gis/, path `/var/www/html/gis/index.html`);
   - comandi PowerShell per cartella Firebase, download da GitHub main, deploy;
   - esempi SCP/SSH con placeholder `<user>`, senza password;
   - note sicurezza (no segreti/API key nel repo).
3. **Creato** `scripts/deploy-hosting.ps1` — helper PowerShell:
   - default sicuro: solo copia sorgente → `GIS-Firebase-Hosting/public/index.html`;
   - parametri: `SourceHtml`, `FirebaseHostingDir`, `-DeployFirebase`, `-PrintVpsCommands`, `VpsUser`/`VpsHost`/`VpsPath`;
   - verifica esistenza sorgente e directory Firebase; crea `public` se assente;
   - `-DeployFirebase` esegue `firebase.cmd deploy --only hosting`;
   - senza switch stampa comando manuale deploy;
   - `-PrintVpsCommands` stampa SCP/SSH senza eseguirli.
4. **Aggiornato** `README.md` — sezione breve Hosting / Deploy con URL, link runbook, esempi script, nota setup Firebase già completato.

## File modificati

| File | Azione |
|------|--------|
| `docs/hosting/firebase-vps-deploy.md` | creato |
| `scripts/deploy-hosting.ps1` | creato |
| `README.md` | aggiornato (+19 righe sezione Hosting) |

## Non toccato

- `coordinate_converter Claude.html` (monolite)
- codice app / backend / Firebase Functions / Docker / GitHub Actions
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/roadmap.md`

## QA / verifiche

- `git diff --check`: OK (nessun trailing whitespace issue)
- Verifica manuale diff: **nessun segreto**, token, API key o password commessi
- **Nessun deploy Firebase reale** eseguito
- **Nessun aggiornamento VPS reale** eseguito
- Commit identità: usato `-c user.name/email` one-off (repo senza git config locale; autore allineato a commit precedenti `Martino Tuso <53308962+mrhz1973@users.noreply.github.com>`)

## Stato hosting registrato

| Voce | Valore |
|------|--------|
| Firebase URL | https://gistoolmarty-33cf8.web.app |
| Firebase Project ID | `gistoolmarty-33cf8` |
| Firebase display name | `gistoolmarty` |
| Cartella locale Firebase | `C:\Users\Utente\Documents\GIS-Firebase-Hosting` |
| VPS staging URL | http://217.160.71.145/gis/ |
| VPS path | `/var/www/html/gis/index.html` |

## Git post-intervento (commit docs)

- **Hash:** `a614405`
- **HEAD finale:** `a614405`
- **Workspace:** clean (post-push commit principale)

## Autosync orchestratore

- File memoria: `docs/orchestrator/latest.md` + questo inbox
- Monolite **escluso** dal commit autosync (non modificato)
- Commit autosync orchestratore: da registrare in chiusura step autosync

## Prossimo passo consigliato

- Su PC lavoro: dopo modifiche al monolite, `.\scripts\deploy-hosting.ps1 -DeployFirebase` quando serve pubblicare su Firebase
- VPS staging: aggiornamento manuale con `-PrintVpsCommands` per i comandi SCP/SSH
