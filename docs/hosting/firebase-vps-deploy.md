# GIS Tool Hosting / Deploy Runbook

Runbook operativo per pubblicare **GOI GIS Tool** su **Firebase Hosting** (pubblico) e su **VPS staging** (demo interna). Nessuna credenziale, API key o segreto va commessa nel repository.

## Ambienti registrati

| Ambiente | URL / percorso | Note |
|----------|----------------|------|
| **Firebase Hosting** | https://gistoolmarty-33cf8.web.app | Project display name: `gistoolmarty` |
| **Firebase Project ID** | `gistoolmarty-33cf8` | ID reale del progetto Firebase |
| **Firebase public dir** | `public` | File pubblicato: `public/index.html` |
| **Cartella locale Firebase** | `C:\Users\Utente\Documents\GIS-Firebase-Hosting` | Workspace di deploy (fuori dal repo GIS) |
| **VPS staging** | http://217.160.71.145/gis/ | Demo/staging, **non** production critica |
| **VPS path** | `/var/www/html/gis/index.html` | File servito da nginx |

### Relazione file sorgente ↔ deploy

- **Sorgente canonica (repo GIS):** `coordinate_converter Claude.html`
- **Copia deployabile (Firebase / VPS):** `public/index.html` nella cartella `GIS-Firebase-Hosting`

Ad ogni aggiornamento si copia il monolite del repo nella cartella Firebase; `public/index.html` è la versione pubblicata, non un file separato da mantenere a mano nel repo GIS.

## Setup una tantum (non ripetere a ogni modifica)

Eseguire **una sola volta** su ogni PC che deve fare deploy Firebase:

1. **Node.js** — es. via winget o installer ufficiale (ambiente verificato: Node.js v24.x, npm 11.x).
2. **Firebase CLI** — `npm install -g firebase-tools` (ambiente verificato: Firebase CLI 15.x).
3. **Login Firebase** — `firebase login` con l’account autorizzato (es. `mrhz1973@gmail.com`).
4. **Init Hosting** — dalla cartella `C:\Users\Utente\Documents\GIS-Firebase-Hosting`:
   ```powershell
   Set-Location "$env:USERPROFILE\Documents\GIS-Firebase-Hosting"
   firebase init hosting
   ```
   Selezionare il progetto **`gistoolmarty-33cf8`**, directory pubblica **`public`**, SPA rewrite secondo esigenza (config già presente se init fatto in precedenza).
5. **File di config** — verificare che esistano `.firebaserc` (project alias → `gistoolmarty-33cf8`) e `firebase.json` (`hosting.public` = `public`).

**Non** rifare login/init a ogni aggiornamento dell’HTML. Il flusso normale è solo copia file + deploy (vedi sotto).

## Update ricorrente (flusso normale)

Dopo modifiche al monolite nel repo GIS:

1. Aggiornare la copia in Firebase Hosting:
   ```powershell
   Copy-Item -Path ".\coordinate_converter Claude.html" -Destination "$env:USERPROFILE\Documents\GIS-Firebase-Hosting\public\index.html" -Force
   ```
   Oppure usare lo script helper (consigliato):
   ```powershell
   Set-Location "C:\Users\Utente\Documents\AI\GitHub\cursor-coordinate-converter"
   .\scripts\deploy-hosting.ps1
   ```
2. **Firebase deploy** (vedi sezione dedicata).
3. **VPS staging** (opzionale, manuale — vedi sezione dedicata).

### Riscaricare HTML da GitHub `main` (senza aprire il repo locale)

Se serve allineare la copia deploy alla versione remota del monolite:

```powershell
$repoUrl = "https://raw.githubusercontent.com/mrhz1973/cursor-coordinate-converter/main/coordinate_converter%20Claude.html"
$dest = "$env:USERPROFILE\Documents\GIS-Firebase-Hosting\public\index.html"
New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
Invoke-WebRequest -Uri $repoUrl -OutFile $dest -UseBasicParsing
Write-Host "Scaricato main -> $dest"
```

Poi eseguire il deploy Firebase come sotto.

## Firebase deploy

Dalla cartella Firebase Hosting:

```powershell
Set-Location "$env:USERPROFILE\Documents\GIS-Firebase-Hosting"
firebase.cmd deploy --only hosting
```

Con lo script helper (copia + deploy):

```powershell
Set-Location "C:\Users\Utente\Documents\AI\GitHub\cursor-coordinate-converter"
.\scripts\deploy-hosting.ps1 -DeployFirebase
```

Verifica post-deploy: aprire https://gistoolmarty-33cf8.web.app e controllare che l’app carichi correttamente.

## VPS staging update (manuale)

Il VPS è **staging/demo**, non un ambiente production critico. L’aggiornamento è **manuale** via SCP/SSH; **non** automatizzare password o chiavi nel repo.

Dopo aver copiato il file in `public\index.html` (locale Firebase) o direttamente dal repo:

```powershell
# Esempio — sostituire <user> con l’utente SSH reale; non commettere password o chiavi
scp "$env:USERPROFILE\Documents\GIS-Firebase-Hosting\public\index.html" <user>@217.160.71.145:/var/www/html/gis/index.html

ssh <user>@217.160.71.145 "sudo nginx -t && sudo systemctl reload nginx"
```

Per stampare solo i comandi (senza eseguirli):

```powershell
.\scripts\deploy-hosting.ps1 -PrintVpsCommands
```

Verifica: http://217.160.71.145/gis/

## Sicurezza e segreti

- **Non** committare: token Firebase, password SSH, chiavi private, cartella `.firebase/`, cache deploy, credenziali API.
- **Non** inserire API key (Navionics, Garmin, ecc.) nel frontend o in questo runbook.
- Lo script `scripts/deploy-hosting.ps1` di default **non** esegue deploy Firebase né comandi VPS; servono switch espliciti (`-DeployFirebase`, `-PrintVpsCommands`).

## Riferimenti rapidi

| Azione | Comando |
|--------|---------|
| Solo preparare `public/index.html` | `.\scripts\deploy-hosting.ps1` |
| Copia + deploy Firebase | `.\scripts\deploy-hosting.ps1 -DeployFirebase` |
| Mostra comandi VPS | `.\scripts\deploy-hosting.ps1 -PrintVpsCommands` |
| Deploy Firebase manuale | `Set-Location "$env:USERPROFILE\Documents\GIS-Firebase-Hosting"; firebase.cmd deploy --only hosting` |
