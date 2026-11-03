# Deploy Build 272 — esito verificato

Data: 2026-11-03. La pubblicazione di ogni nuova versione GIS su GitHub e VPS è autorizzata dall’utente.

## Artefatto

- Build: `GIS-MOBILE-LANDSCAPE-UX-A`, 272.
- Commit GitHub e VPS: `dd3968e8012692dcdb95c55dc3886afcae48dfa5`.
- Runtime SHA-256: `523a0cdd295d8c5840ed736fd07b65513889b85da533b6f3e715e5a60210c234`.
- Link tailnet: [TMART GIS Build 272](http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=272).
- Deploy limitato al servizio `goi-gis-app`; script aggiornato: [deploy-gis-build272.sh](deploy-gis-build272.sh).

## Preflight SSH e VPS

SSH strict ha autenticato `root@31.70.139.73` con la chiave host ED25519 già verificata. Prima del rilascio, il repository remoto era pulito sul commit Build 271 `173611f27299662bcc203212d063158ee411a5cf`, con runtime SHA-256 `7f96e58ea912cd9c017c225b1d12276f5ef397c55b3e4ee6c8bfbd11c5b76ea8`. GIS, proxy, GraphHopper, ORS e n8n erano attivi.

Il server ascolta su `100.99.54.93:8000` tramite Tailscale, non su loopback. Il controllo HTTP sul loopback non era applicabile; il preflight e il deploy hanno verificato la pagina sull’indirizzo tailnet.

## Esito deploy e verifica indipendente

Lo script ha verificato il commit esatto di GitHub e l’hash runtime, ha avanzato il repository VPS in fast-forward, riavviato solo `goi-gis-app` e ottenuto hash HTTP e runtime identici. Il servizio GIS è `active/running`, PID `434836`. I PID dei servizi non GIS sono rimasti invariati: proxy `1699043`, GraphHopper `4095839`, ORS `1699002`; n8n è rimasto `2945282 running`.

```text
DEPLOY=PASS
COMMIT=dd3968e8012692dcdb95c55dc3886afcae48dfa5
RUNTIME_SHA=523a0cdd295d8c5840ed736fd07b65513889b85da533b6f3e715e5a60210c234
HTTP_SHA=523a0cdd295d8c5840ed736fd07b65513889b85da533b6f3e715e5a60210c234
BACKUP=/tmp/goi-gis-mobile-layer-272.W1WnFA
OTHER_SERVICES=UNCHANGED
MainPID=434836
ActiveState=active
SubState=running
```

La sessione SSH ha restituito 127 dopo il blocco `DEPLOY=PASS`: la pipeline PowerShell ha inviato il testo dello script con CRLF e Bash ha tentato di eseguire il `\r` finale. Il deploy e i controlli interni erano già terminati; una seconda sessione SSH strict, in sola lettura, ha confermato branch `main`, worktree pulito, commit e hash esatti, servizio attivo e PID non GIS invariati. Il file archiviato usa LF e `bash -n` sul VPS passa. Per le prossime esecuzioni, inviare il file come byte o normalizzare il flusso con `tr -d '\r'` prima di `bash -s`. Non è stato ripetuto il deploy.

## Automated Browser QA post-deploy

Edge/Chromium con emulazione touch ha caricato la pagina live in entrambi i formati landscape. Per ciascun profilo Build 272 è corretta, titolo e controlli condividono il centro verticale `y=24 px`, i gruppi non si sovrappongono e Layer si apre senza ricreare il nodo mappa (`renderTileMap` chiamate: 0). Nessun errore JavaScript.

- 844×390: PASS · [screenshot](build272-live-landscape-844x390.png)
- 667×375: PASS · [screenshot](build272-live-landscape-667x375.png)
- [Risultati completi](build272-postdeploy-results.json) · [script di QA](build272-postdeploy-qa.js)

I fornitori cartografici esterni sono stati bloccati nel replay, quindi questa prova non attesta il caricamento delle mappe reali. Safari/Chrome su iPhone fisico, safe-area e viewport dinamica restano da verificare sul dispositivo.
