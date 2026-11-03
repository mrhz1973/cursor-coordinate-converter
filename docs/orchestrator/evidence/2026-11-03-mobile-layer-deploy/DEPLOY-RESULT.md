# Deploy Build 270 — esito verificato

Data: 2026-11-03. Operazione autorizzata dall’utente: pubblicare ogni release del GIS su GitHub e sul VPS. Ambito: solo il runtime `coordinate_converter Claude.html` e il servizio `goi-gis-app`; nessuna modifica agli altri servizi o all’infrastruttura.

## Artefatto rilasciato

- Commit applicativo GitHub: `cd575bc7f7521f669223e1696e079ab0da57426f`.
- Build 270 HTML SHA-256: `704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544`.
- URL tailnet: [TMART GIS Build 270](http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=270).
- Host verificato: `31.70.139.73` (`ubuntu`). La connessione SSH ha usato `StrictHostKeyChecking=yes`; una sessione in sola lettura ha confermato prima del deploy HEAD VPS `099d67b44e4f0c1910cc62476ccba10708c8f20a`, runtime Build 268 SHA-256 `51a3e9821d0f70c57ad23adb7f10bd66ee6214065ce0e0c7abc9870cc681a11d` e worktree pulito. L’alias locale `ionos-n8n` puntava al vecchio IP `217.160.71.145`; il tentativo si è fermato alla verifica della chiave e non ha eseguito comandi remoti. Si è proseguito solo sull’IP corretto verificato.

## Deploy e verifica

Lo script revisionato `deploy-gis.sh` SHA-256 `00233EDF0BD7FD9D5605438E885DE034461A2A0FF021D9CF6C22FF2999D4729F` ha fatto fetch del tip GitHub esatto, fast-forward del branch VPS `main`, verifica del runtime locale e risposta HTTP, riavvio del solo servizio `goi-gis-app`, verifica del suo stato e confronto degli snapshot dei PID dei tre servizi non GIS e di n8n.

Output finale dello script:

```text
DEPLOY=PASS
COMMIT=cd575bc7f7521f669223e1696e079ab0da57426f
RUNTIME_SHA=704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544
HTTP_SHA=704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544
BACKUP=/tmp/goi-gis-mobile-layer-270.XfLeDO
OTHER_SERVICES=UNCHANGED
MainPID=219628
ActiveState=active
SubState=running
```

Dopo queste righe, PowerShell ha trasmesso un carattere CR isolato alla riga finale vuota dello stream e SSH ha restituito exit code 127 (`bash: line 142: $'\r': command not found`). Il valutatore del metodo ha controllato lo script e l’ordine delle istruzioni: `DEPLOY=PASS` viene stampato solo dopo tutti i gate; i trap sono già disabilitati, quindi l’errore di trasporto successivo non ha avviato un rollback. Non si considera exit 0 del wrapper, ma il deploy è stato verificato indipendentemente.

Una sessione SSH successiva, con verifica strict, ha confermato:

```text
COMMIT=cd575bc7f7521f669223e1696e079ab0da57426f
RUNTIME_SHA=704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544
HTTP_SHA=704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544
GIS: ActiveState=active, SubState=running, MainPID=219628
n8n: /root-n8n-1 pid=2945282 status=running
```

Proxy, GraphHopper e ORS erano tutti `active/running`; lo script ha inoltre confrontato i loro PID e quelli di n8n con gli snapshot pre-deploy (`OTHER_SERVICES=UNCHANGED`). Il backup runtime è conservato sul VPS in `/tmp/goi-gis-mobile-layer-270.XfLeDO`.

## Limiti e prossimo test

La correzione è stata verificata con replay in Edge Chromium, cinque viewport e input touch. Non è stata provata su Safari/iPhone fisico e le richieste ai provider cartografici esterni erano bloccate nei replay. Nicola può ora aprire il link sopra da Safari con Tailscale connesso, aggiornare la pagina e provare il menu Layer e il caricamento delle mappe. Per i futuri deploy da PowerShell, evitare la pipe testuale CRLF: trasferire lo script preservando LF e verificare l’hash del payload.