#Requires -Version 5.1
<#
.SYNOPSIS
  Prepara public/index.html per Firebase Hosting e opzionalmente esegue deploy o stampa comandi VPS.

.DESCRIPTION
  Default sicuro: copia il monolite GIS in GIS-Firebase-Hosting/public/index.html.
  Non esegue deploy Firebase ne comandi VPS salvo switch espliciti.

.PARAMETER SourceHtml
  Percorso del file sorgente nel repo GIS (default: monolite nella cwd).

.PARAMETER FirebaseHostingDir
  Cartella locale del progetto Firebase Hosting.

.PARAMETER DeployFirebase
  Se presente, esegue firebase.cmd deploy --only hosting dalla cartella Firebase.

.PARAMETER PrintVpsCommands
  Se presente, stampa comandi SCP/SSH di esempio (non li esegue).

.PARAMETER VpsUser
  Placeholder utente SSH per i comandi VPS stampati.

.PARAMETER VpsHost
  Host VPS staging.

.PARAMETER VpsPath
  Percorso remoto del file index.html sul VPS.
#>
[CmdletBinding()]
param(
    [string]$SourceHtml = ".\coordinate_converter Claude.html",
    [string]$FirebaseHostingDir = "$env:USERPROFILE\Documents\GIS-Firebase-Hosting",
    [switch]$DeployFirebase,
    [switch]$PrintVpsCommands,
    [string]$VpsUser = "<user>",
    [string]$VpsHost = "217.160.71.145",
    [string]$VpsPath = "/var/www/html/gis/index.html"
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "[deploy-hosting] $Message"
}

# --- Verifica file sorgente ---
$sourceResolved = $null
try {
    $sourceResolved = Resolve-Path -LiteralPath $SourceHtml -ErrorAction Stop
} catch {
    Write-Error "File sorgente non trovato: $SourceHtml"
    exit 1
}

Write-Step "Sorgente: $sourceResolved"

# --- Verifica directory Firebase ---
if (-not (Test-Path -LiteralPath $FirebaseHostingDir -PathType Container)) {
    Write-Error "Directory Firebase Hosting non trovata: $FirebaseHostingDir"
    Write-Error "Eseguire prima il setup una tantum (firebase init hosting) come da docs/hosting/firebase-vps-deploy.md"
    exit 1
}

Write-Step "Directory Firebase: $FirebaseHostingDir"

# --- Crea/verifica public ---
$publicDir = Join-Path $FirebaseHostingDir "public"
if (-not (Test-Path -LiteralPath $publicDir -PathType Container)) {
    Write-Step "Creazione cartella public: $publicDir"
    New-Item -ItemType Directory -Path $publicDir -Force | Out-Null
} else {
    Write-Step "Cartella public presente: $publicDir"
}

# --- Copia monolite -> public/index.html ---
$destIndex = Join-Path $publicDir "index.html"
Copy-Item -LiteralPath $sourceResolved -Destination $destIndex -Force
Write-Step "Copiato -> $destIndex"

# --- Deploy Firebase (solo se richiesto) ---
if ($DeployFirebase) {
    Write-Step "Deploy Firebase (--only hosting)..."
    Push-Location -LiteralPath $FirebaseHostingDir
    try {
        & firebase.cmd deploy --only hosting
        if ($LASTEXITCODE -ne 0) {
            Write-Error "firebase deploy terminato con codice $LASTEXITCODE"
            exit $LASTEXITCODE
        }
        Write-Step "Deploy Firebase completato."
    } finally {
        Pop-Location
    }
} else {
    Write-Host ""
    Write-Host "Deploy Firebase non eseguito (default sicuro). Comando manuale:"
    Write-Host "  Set-Location `"$FirebaseHostingDir`""
    Write-Host "  firebase.cmd deploy --only hosting"
    Write-Host ""
}

# --- Comandi VPS (solo stampa, se richiesto) ---
if ($PrintVpsCommands) {
    Write-Host ""
    Write-Host "Comandi VPS staging (esempio — non eseguiti; sostituire $VpsUser):"
    Write-Host "  scp `"$destIndex`" ${VpsUser}@${VpsHost}:${VpsPath}"
    Write-Host "  ssh ${VpsUser}@${VpsHost} `"sudo nginx -t && sudo systemctl reload nginx`""
    Write-Host "  Verifica: http://${VpsHost}/gis/"
    Write-Host ""
}

Write-Step "Operazione completata."
