# Accesso diretto al VPS — preparazione 2026-11-09

## Autorizzazione e stato

L'utente ha chiesto di operare direttamente sul VPS senza computer del lavoro acceso e ha autorizzato «ok vai» dopo la spiegazione della necessità di un canale indipendente. Il tunnel Windows recente è ancora disponibile per la sola configurazione iniziale. Il canale SSH diretto dal cloud non è disponibile. Origin/main verificato: 989fed05f064acfcaa6e9e67565afcf46fbe5fc1. Il gate applicativo rimane QA operatore Astro della Build281.

## Perimetro concreto

Installare Remote Desktop Commander 0.3.1 in uno stato dedicato, con servizio systemd DynamicUser. Nessun agente root, nessuna porta entrante, nessuna modifica di SSH, firewall, Nginx, ORS, GIS o account esistenti. Il nuovo agente può scrivere nel proprio workspace; non può amministrare liberamente i servizi di sistema o il checkout live sotto /root. Eventuali deploy privilegiati richiederanno un percorso specifico controllato, non sono implicitamente abilitati dall'agente.

L'associazione remota è un'azione esplicitamente richiesta per questo canale. Richiede una conferma dell'account nel browser dell'utente secondo il flusso ufficiale. I token rimangono esclusivamente nello stato privato del servizio; non vengono letti, esportati o inseriti nel repository. Il nome dispositivo della versione scelta deriva dall'hostname: sul VPS comparirà ubuntu. L'ID restituito dopo il pairing sarà la selezione canonica, da non confondere con i PC Windows.

## Confine del sistema operativo

- Servizio: tmar-vps-access.service; DynamicUser=yes, User=tmar-vps-access.
- Home reale persistente: /var/lib/tmar-vps-access; StateDirectoryMode=0700.
- Workspace: /var/lib/tmar-vps-access/workspace.
- Configurazione e sessione nelle sottocartelle standard della home privata.
- Pacchetto npm installato da utente dinamico non-root, versione esatta e SRI verificati.
- ProtectSystem=strict, ProtectHome=yes, PrivateTmp/PrivateDevices, NoNewPrivileges, capacità vuote.
- Codice del pacchetto in sola lettura durante l'esercizio ordinario.
- Limiti CPU, memoria e numero processi; nessun accesso al socket Docker.
- allowedDirectories configura gli strumenti file; non viene considerato un confine di sicurezza del terminale.

## Sequenza

1. Preflight: root via SSH esistente con host-key rigorosa, runtime SHA e repository invariati, quattro servizi attivi; directory/unit nuove assenti.
2. Crea soltanto /opt/tmar-vps-access e la unit dedicata; installa tramite systemd-run con identità dinamica.
3. npm install --ignore-scripts evita l'esecuzione generale dei lifecycle script. Esegue soltanto il rebuild di @vscode/ripgrep come utente senza privilegi, necessario per la ricerca file. Nessun download browser automatico.
4. Verifica identità del pacchetto, lockfile, import sharp, ricerca ripgrep e CLI remote --help. Verifica sintattica unit.
5. Confronta runtime, HEAD, stato Git, PID dei quattro servizi e listener TCP con il preflight. Nessun riavvio applicativo.
6. Avvia/abilita solo la nuova unit. Per il primo pairing usa Restart=no, così un timeout non sostituisce silenziosamente il codice consegnato. Estrae soltanto URL/codice per la verifica, senza leggere la sessione. La durata effettiva è comunicata dal server.
7. Dopo conferma utente: list_devices, get_config sul nuovo ID, identità Linux/non-root, lettura/scrittura/rimozione di un file di prova nel workspace e prova dei confini. Imposta la politica ordinaria Restart=on-failure e riavvia soltanto la nuova unit per verificare persistenza e riconnessione, prima di dichiarare il PASS operativo.

Il PASS dell'accesso diretto richiede il punto7. La sola installazione o l'URL di associazione non equivalgono a collegamento funzionante.

## Arresto e rollback

Qualsiasi guardia fallita interrompe il pass. Dopo esito ambiguo si legge prima lo stato del journal; nessuna ripetizione cieca dell'installer. Il rollback iniziale disabilita e arresta soltanto tmar-vps-access.service, mantenendo lo stato privato per diagnosi. Dopo pairing la revoca lato server deve essere eseguita sul singolo dispositivo nel dashboard; --logout della0.3.1 elimina solo la sessione locale. Nessun Revoke All. Il ripristino non modifica i servizi GIS preesistenti.

## Fonti e identità

- Inventario reale 2026-11-09T17:56:31Z: Ubuntu24.04.4, systemd255, Node22.23.2, npm10.9.8. VPSlive HEADcee1c9a1, runtime281 SHAe8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62.
- https://github.com/desktop-commander/remote-desktop-commander/blob/main/docs/SETUP.md — flusso pairing/gestione dispositivi, consultazione9novembre2026.
- https://registry.npmjs.org/@wonderwhy-er%2fdesktop-commander/0.3.1 — metadata acquisito2026-11-09T17:58:44Z.
- Tarball ufficiale0.3.1, 1698882byte; SRI sha512-cx7KTscLF951adHmDLVCDIVTqJ/Bg1LtdRILZoo5wa/UMeyOfMAuOJOEBulNMKBKb5Xd3nHDQnB9aXroN9Fw5A==; gitHead7251da501d760e6eb5f95d802d9b42c741190950.
- Verifica indipendente del pacchetto esatto: Node>=22.12.0, persistenza defaulttrue, --disable-no-sleep supportato, nessun flag nome device/enrollment automatico; --report non utilizzato.
