# Pairing remoto — Desktop Commander 0.3.1

Data: 9 novembre 2026. Stato: **analisi statica del pacchetto esatto PASS; nessun pairing reale avviato**.

## Identità della fonte

Artefatto primario: https://registry.npmjs.org/@wonderwhy-er/desktop-commander/-/desktop-commander-0.3.1.tgz

- Dimensione: 1.698.882 byte.
- Integrità SHA-512 Base64 verificata: `cx7KTscLF951adHmDLVCDIVTqJ/Bg1LtdRILZoo5wa/UMeyOfMAuOJOEBulNMKBKb5Xd3nHDQnB9aXroN9Fw5A==`.
- Versione e requisito dichiarati: 0.3.1, Node >=22.12.0.
- Cache intermedia: `research/desktop-commander-0.3.1.tgz`; non includere l'archivio nella pubblicazione documentale Git.
- Hash dei tre file letti: `research/package-provenance.json`.

File pertinenti letti senza eseguirli: `dist/remote-device/device-authenticator.js`, `dist/remote-device/desktop-commander-integration.js`, `dist/npm-scripts/remote.js`.

## Output da recuperare e consegnare all'operatore

L'authenticator, dopo la richiesta del codice, stampa il collegamento completo fornito dal server (`verification_uri_complete`), il codice da confrontare (`user_code`) e la durata restante espressa in minuti (`Math.floor(expires_in / 60)`). Le righe applicative rilevanti sono 82–98 del file pubblicato `device-authenticator.js`.

Forma sintetica dell'output, con placeholder e senza valori reali:

```text
Verify this device in your browser:
<verification_uri_complete>
Make sure the code matches: <user_code>
Code expires in <floor(expires_in/60)> minutes.
Waiting for authorization...
```

Non ricostruire il collegamento da ipotesi sul percorso: usare quello effettivamente stampato, verificandone l'host previsto `mcp.desktopcommander.app`. Non acquisire la risposta API completa: `device_code`, verifier PKCE e token di sessione non sono necessari per il passaggio all'operatore.

## Durata e timeout

La durata **non è una costante di 15 minuti nel client 0.3.1**: arriva dal server nel campo `expires_in`. La verifica deve registrare il valore realmente osservato al primo avvio. Il polling usa l'intervallo restituito dal server, con fallback di 5 secondi, e un numero massimo di tentativi calcolato da `expires_in / interval`. Errori temporanei e `slow_down` possono allungare il tempo trascorso; il servizio remoto mantiene la propria scadenza.

Esauriti i tentativi, il metodo genera un errore di timeout. Il chiamante del dispositivo gestisce l'errore di avvio e termina. Una unit con riavvio automatico può quindi generare un nuovo codice: il collegamento consegnato deve appartenere all'ultimo tentativo corrente. Per la fase di pairing si può scegliere `Restart=no`; l'eventuale politica di riavvio ordinaria si verifica dopo l'associazione. Questa è una raccomandazione operativa, non un'opzione CLI del prodotto.

## Linux senza browser e senza TTY

L'apertura automatica del browser è un tentativo asincrono, non atteso dal polling. Se fallisce, il client stampa il messaggio di mancata apertura e il collegamento semplice `verification_uri`, poi continua ad attendere l'autorizzazione. Il browser può quindi essere su un altro dispositivo.

Nei tre file pertinenti non compaiono letture da `process.stdin`, richieste `readline` o controlli `isTTY`. La comunicazione con il MCP locale usa `StdioClientTransport`, cioè i propri canali verso il processo figlio; non richiede che lo stdin esterno sia un terminale interattivo.

**Conclusione statica:** il percorso di pairing è compatibile con una unit systemd con `StandardInput=null` e senza GUI, quando pacchetto e dipendenze sono già installati. Usare l'eseguibile Node e il file `dist/index.js` installati: non affidare a `npx` eventuali richieste interattive di installazione durante l'avvio del servizio.

**Limite:** non è un PASS runtime della unit. Al primo avvio devono essere verificati separatamente inizializzazione MCP locale, raggiungibilità del servizio remoto, emissione del codice, associazione, comando innocuo attraverso il connettore e riavvio con sessione ripristinata.

## Persistenza e identità del servizio

La sessione è persistente per default. Non usare `--no-persist-session`. La home del servizio deve rimanere la stessa tra associazione e funzionamento ordinario, con stato persistente scrivibile per `.desktop-commander-device/device.json` e configurazione MCP. Il nome remoto deriva dall'hostname del VPS, senza flag CLI dedicato in questa versione.

La configurazione proposta con identità non-root e `StateDirectory` va collaudata nel proprio perimetro. L'associazione non concede automaticamente privilegi root, pubblicazione GitHub o deploy del runtime GIS.

## Attività svolte e assenti

- Sola lettura di fonti pubbliche e dell'archivio verificato; creazione della cache e di questo rapporto.
- Nessun comando `remote` eseguito, nessuna richiesta di codice a un account reale, nessuna sessione o credenziale privata letta.
- Nessuna connessione a dispositivi Windows o VPS da questo agente.
