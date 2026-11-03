# Accesso di un amico al GIS tramite Tailscale

Il destinatario usa il proprio account Tailscale. Il proprietario condivide il singolo VPS `ionos-n8n-new` mediante un invito di condivisione dispositivo. Non occorre consegnare credenziali o copiare l'HTML: l'app e le icone sono servite dal VPS.

## Passaggi del proprietario

1. Accedere alla pagina **Machines** della propria console Tailscale e individuare `ionos-n8n-new` (IPv4 attuale `100.99.54.93`).
2. Controllare la policy di accesso prima di inviare l'invito: il destinatario deve raggiungere soltanto i servizi GIS scelti sul VPS. Per l'app serve **TCP 8000**; aggiungere **TCP 5000** soltanto se si concede anche il proxy nautico Navionics/SonarChart. Verificare eventuali regole generali già presenti: le autorizzazioni Tailscale sono additive e una regola più stretta non annulla quelle più ampie. La policy corrente del tailnet non è stata ispezionata in questa sessione.
3. Nel menu della macchina scegliere **Share**, quindi invito per email oppure **Copy invite link** con link monouso. Inviare il link privatamente all'amico; è un invito di accesso e non va salvato in GitHub o inserito nei prompt AI.
4. Dopo l'accettazione, controllare nel pannello Share che il profilo destinatario corrisponda all'amico. L'operazione concede accesso alla sola macchina condivisa, ulteriormente limitato dalle policy dei due tailnet.

Non servono accesso SSH, privilegi amministrativi sul VPS o la sua configurazione come exit node per aprire il GIS. La condivisione non deve essere accompagnata da modifiche a proxy, firewall o altri servizi del VPS.

## Passaggi dell'amico

1. Installare Tailscale dal sito ufficiale e accedere con il proprio account.
2. Aprire manualmente il link monouso ricevuto dal proprietario e accettare l'invito. L'utente che accetta deve poter amministrare il proprio tailnet (per un account personale normalmente è il proprietario).
3. Tenere Tailscale connesso e aprire nel browser:

   [MART GIS Tool sul VPS](http://100.99.54.93:8000/coordinate_converter%20Claude.html)

4. Se il dispositivo condiviso riceve un indirizzo differente nel tailnet dell'amico, usare l'indirizzo mostrato da Tailscale oppure il suo nome MagicDNS completo. La documentazione Tailscale indica che l'IPv4 è normalmente uguale a quello del proprietario, salvo conflitti di indirizzo.
5. Se la pagina non si apre, riferire al proprietario l'errore visibile e lo stato del dispositivo condiviso; la policy dell'amico e quella del proprietario devono entrambe consentire il traffico.

Il browser esegue l'app ricevuta dal VPS. Preferiti, cronologia, waypoint, tracce e cache locali restano separati nel browser dell'amico: non sono sincronizzati con quelli del proprietario.

## Prompt da dare all'AI dell'amico

> Aiutami a usare MART GIS Tool attraverso un VPS condiviso tramite Tailscale. Uso il mio account Tailscale personale. Verifica se il client ufficiale è già installato; se manca, guidami nell'installazione da tailscale.com. Lascia a me l'accesso al mio account e l'apertura manuale del link monouso di condivisione ricevuto dal proprietario: non chiedermi il link, password o chiavi. Dopo l'accettazione, verifica che Tailscale sia connesso e che il dispositivo condiviso ionos-n8n-new sia visibile. Apri http://100.99.54.93:8000/coordinate_converter%20Claude.html, usando l'indirizzo del dispositivo condiviso mostrato da Tailscale se differente. Se non funziona, raccogli soltanto errore visibile e stato di connessione da riferire al proprietario. Non modificare policy Tailscale, firewall, router o servizi, e non installare copie locali dell'app.

## Revoca e fonti

Il proprietario può revocare la condivisione dal pannello **Machines → Share → Revoke invite**. La condivisione del nodo è soggetta alle policy Tailscale; non rende il server pubblico su Internet.

- [Condividere una macchina con un altro utente](https://tailscale.com/docs/features/sharing)
- [Invitare un utente oppure condividere un dispositivo](https://tailscale.com/docs/reference/inviting-vs-sharing)
- [Installazione di Tailscale per Windows](https://tailscale.com/docs/install/windows)
- [Controllo degli accessi](https://tailscale.com/docs/features/access-control)
- [Regole additive dei grants](https://tailscale.com/docs/reference/syntax/grants)

Istruzioni preparate il 2026-11-03. Nessun invito o cambiamento di policy è stato eseguito da questa guida.
