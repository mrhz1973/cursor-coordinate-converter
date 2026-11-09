# Correzione del percorso — TMAR Desktop Commander dell'operatore

**Stato corrente: usare il plugin privato TMAR Desktop Commander Win selezionato dall'utente. Il precedente servizio di associazione hosted sul VPS è fermo e disabilitato.**

Il 9 novembre 2026 l'operatore ha precisato: «Aspetta, io voglio usare questo desktop commander, il mio», selezionando l'App `asdk_app_6ae6702b503481919cd42f8010997469`. La scelta corregge il trasporto del lavoro in corso; l'obiettivo di poter operare anche senza PC acceso non è dichiarato già raggiunto.

## DONE osservato

- Il plugin selezionato risponde tramite OpenAI Secure MCP Tunnel e raggiunge ASUSDESKTOP, Windows, Desktop Commander 0.3.1. È stato osservato il processo del suo eseguibile TMAR; non è stato sostituito il collegamento Windows.
- Con lo stesso plugin è stato eseguito il rollback limitato a `tmar-vps-access.service`: stop e disabilitazione verificati, MainPID0. Il journal registra la chiusura alle 23:01:30 Europe/Rome; lettura successiva alle 23:05:53 conferma assenza di processo e unit disabilitata.
- Il risultato systemd conservato è `failed`; non significa che il servizio sia ancora in esecuzione. Le directory preparate restano conservate. Il file di sessione del dispositivo non esiste; nessun token è stato letto.
- Il vecchio collegamento di verifica hosted non è più un NEXT valido. Non deve essere nuovamente attivato o presentato all'operatore come soluzione scelta.

Evidenze: [stop osservato](STOP-OBSERVATION.json), [connessione selezionata](TMAR-SELECTED-CONNECTION.json). La procedura di rollback è quella già revisionata in [install-root.py](install-root.py). I rapporti precedenti rimangono storico datato del percorso poi corretto.

## Percorso coerente con la scelta dell'utente

L'attuale connessione TMAR Windows dipende dal computer che la ospita. Per un VPS indipendente serve un'istanza Linux di Desktop Commander in modalità **MCP stdio**, trasportata da **OpenAI Secure MCP Tunnel** sul VPS. Non utilizzare il comando `remote`, che avvia il diverso servizio hosted precedente.

La documentazione OpenAI permette l'esecuzione di tunnel-client su VM/systemd. Per stdio prescrive una sola istanza attiva per tunnel_id: mantenendo Windows operativo, il VPS richiede un tunnel distinto. La possibilità di aggiungerlo al medesimo App ID non è verificata. Non ripuntare il plugin Windows né far competere due macchine sul suo tunnel.

## NEXT concreto / WAIT

Per completare il percorso occorrono un tunnel VPS registrato nel corretto account/organizzazione OpenAI, una credenziale runtime dedicata fornita con meccanismo protetto e il relativo collegamento ChatGPT. Gli strumenti Plugin Creator disponibili non possono modificare la connessione MCP di un plugin App-backed tramite archivio; il flusso ufficiale passa dalla gestione tunnel e da ChatGPT Plugins, Connection: Tunnel.

La preparazione successiva deve usare il tunnel VPS verificato e mantenere il limite non-root del workspace. Dopo configurazione: CLI help reale, doctor/readiness, chiamata dal connettore e verifica della persistenza. Non creare automaticamente un duplicato del plugin né riutilizzare/copiare la credenziale Windows. Nessuna credenziale va richiesta nella chat. Non attribuire già autonomia o deploy privilegiato a questo checkpoint.

La verifica svolta ha rilevato l'assenza dei tre binding standard OpenAI nell'ambiente del figlio MCP; non dimostra l'assenza di credenziali nello storage protetto dell'app. Tale storage non è stato ricercato o letto.

## Stato applicativo

Nessuna modifica runtime in questo pass. Build281, source0c0f6785654dbba279774bb8569788088f0762e9 e blob3dcff61081a2f461f8841953986ced17b058eab1 invariati nel repository. Il riscontro operatore Astro della281 resta separato. [FRONTIER](../../../FRONTIER.md) è la fonte live.

## Fonti e limiti

Consultazione **9 novembre 2026**:

- [OpenAI Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels): requisiti, ruolo del client sul server, creazione del collegamento e verifica.
- [OpenAI tunnel-client — connector behavior](https://github.com/openai/tunnel-client/blob/master/docs/connectors.md): singola istanza stdio per tunnel_id e selezione del tunnel.
- Skill `update-plugin`, `references/account-updates.md`: per plugin App-backed, gli aggiornamenti archivio preservano App binding, connessione e configurazione MCP. È un limite del workflow esposto, non un rifiuto di approvazione automatica.

Nessuna modifica, duplicazione o riconfigurazione del plugin TMAR Windows è stata effettuata. La ricerca del plugin nel catalogo non ha restituito una corrispondenza verificata; nessun ID backend è stato inventato o sostituito con un risultato estraneo.
