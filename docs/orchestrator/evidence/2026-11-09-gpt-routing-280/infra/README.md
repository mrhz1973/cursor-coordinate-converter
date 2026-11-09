# TMAR GIS — pacchetto HTTPS 443 da approvare

**Stato al 9 novembre 2026: preparato e collaudato in isolamento; non installato.**
Il pacchetto non distribuisce il candidato runtime e non chiude i gate UI/provider.

## Modifica proposta

1. Un solo include aggiunto al server Nginx tailnet esistente. Tutti i byte precedenti, inclusi `/ors`, `/catalogo`, `/vps`, certificati, listener e limiti globali, rimangono identici.
2. `/gis` serve il file HTML esistente attraverso un proxy limitato al loopback. Tre percorsi GraphHopper esatti (`info`, `nearest`, `route`) passano allo stesso proxy. Due fallback silenziosi respingono gli altri percorsi del namespace GH.
3. Il proxy è il v7 già sviluppato, byte-identico allo SHA `ae32a22ac5b66fc4771e3d19d5fe7f89b34ce6ccfec0e1c02dc792a4165dc06d`. Mantiene validazione di profili/JSON/query, guardie Host/Origin, limiti e rimozione di credenziali/header. Le destinazioni restano fisse.
4. Il gateway ORS aggiunge esclusivamente `https://ionos-n8n-new.tailc01234.ts.net` alla allowlist. L'origin HTTP esistente resta ammesso. Nessuna wildcard, segreto o controllo rimosso.

È stato valutato il solo pass-through Nginx: otterrebbe same-origin con meno processi, ma perderebbe le verifiche semantiche di JSON, profili e coordinate già implementate nel v7. Il validatore browser non sostituisce queste guardie per gli altri client. Per conservarle, la proposta comprende **un servizio Python stdlib nuovo**, `goi-gis-https443-proxy`, con `DynamicUser`, listener `127.0.0.1:18080` e hardening dedicato. Nessuna dipendenza runtime aggiuntiva.

**ORS non viene riscritto verso il proxy.** Il suo percorso rimane `Nginx /ors → 127.0.0.1:8020`. Ciò evita il loop verso il medesimo gateway HTTPS 443.

## Identità della baseline

| Elemento | Prima | Dopo proposto |
|---|---|---|
| `/etc/nginx/sites-available/goi-ors-gateway` | `ebdfcdcbbddf9c4ffcad20f7f8cab79c588bdb66eabd40a2dffd5f17b2aad4ca` | `b57501bb9306127c6aef551a4afd8ecc720922ccb4979d8ab5461303478f5fd5` |
| `/opt/goi-ors-gateway/current/goi_ors_gateway.py` | `dd329ce310bea97f4900a065ea91083d7853047173ba53ea2a6f092d07ae3625` | `e15a23f6b098b340b4c7f290c9ea96d4e01085bc4a5d9cc843ad32e9135089d8` |

`manifest.json` contiene hash e dimensioni dei file. `verify_packet.py` verifica indipendentemente l'integrità, l'identità di tutti i byte Nginx fuori dall'inserimento e la singola modifica alla allowlist ORS, senza rete o scritture.

La verifica HTTP reale pre/post test ha confermato Build **279**, `GIS-CONVERT-VIEWPORT-A`, **11.082.679 byte**, SHA-256 `bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253`.
Il clone VPS era pulito a `7a2c88b1b292ff0b46a2f90b1115143673fe72f1`; questo è il checkout osservato sul VPS, distinto dalla HEAD GitHub della chat.

## Collaudo eseguito

`evidence/vps-isolated-result.json` registra il test con il binario Nginx già installato, **UID 65534**, directory tmpfs privata, certificato di test effimero e upstream esclusivamente simulati su loopback. Nessun provider reale ha ricevuto POST; non sono stati letti file di credenziali o certificati privati di produzione.

**PASS: dieci gruppi di verifiche**, comprendenti:

- sintassi delle direttive Nginx proposte e verifica statica dell'unità systemd;
- TLS con catena e hostname verificati, senza bypass;
- byte del documento statico, HEAD e conservazione del cache-buster;
- richieste GH reali attraverso il proxy v7, eliminazione degli header sensibili e body oltre 64k nel solo nuovo percorso;
- quattordici casi negativi GH senza inoltro all'upstream;
- proxy upstream spento: risposta 502 e assenza delle coordinate sintetiche nei log;
- assenza di temporanei body/response e di dati delle nuove route nei log;
- nuovo e vecchio Origin ORS ammessi, tre Origin estranei respinti, limite ORS 64k preservato e nessun percorso di loop;
- comportamento di catalogo, pannello VPS, redirect e root invariato sui mock.

Hash Nginx/gateway, byte HTTP, HEAD/status del clone e PID dei servizi reali sono rimasti identici prima/dopo. PID osservati: Nginx `209145`, gateway ORS `1699002`, GIS `2243979`. Tutti i processi e file del test sono stati rimossi.

La review indipendente ha chiuso due rilievi: fallback GH silenzioso e recupero dell'applicazione parziale. Il secondo è coperto anche da una prova locale: prima sostituzione riuscita, seconda rifiutata, ripristino della prima e seconda lasciata intatta. Nessun ulteriore blocker nella review documentale finale; questo esito non equivale a collaudo di produzione.

## Applicazione — solo dopo autorizzazione dell'utente

L'autorizzazione necessaria copre precisamente **installazione/avvio del nuovo proxy, aggiunta dei percorsi Nginx con reload e restart del gateway ORS per caricare l'unico Origin aggiunto**. La standing authorization del solo runtime GIS non copre queste operazioni. Le seguenti istruzioni sono destinate all'assistente operativo, non a un copia-incolla richiesto all'utente.

1. Rieseguire `python3 -B verify_packet.py` sul pacchetto trasferito. Verificare che i due hash live coincidano con la tabella, che la porta loopback 18080 sia libera e che non esistano un servizio o file omonimi già installati. Se una precondizione differisce, fermarsi e aggiornare la review; non sovrascrivere lavoro diverso.
2. Registrare stato/PID dei servizi e baseline HTTP. Conservare copie complete dei due file originali in una directory di backup privata, annotando il percorso risolto del gateway e i due hash. Nella stessa directory mantenere un registro della fase raggiunta: nuovi file effettivamente installati, daemon-reload eseguito, proxy avviato, ciascun target sostituito, restart gateway tentato/eseguito, reload Nginx tentato/eseguito, enable del proxy eseguito. Aggiornare il registro dopo ogni esito verificato; se un comando ha esito incerto verificarne lo stato prima di proseguire. Non leggere o copiare LoadCredential o file di chiavi.
3. Installare esclusivamente i nuovi file: `proxy/gis_same_origin_proxy.py` in `/opt/goi-gis-https443/gis_same_origin_proxy.py`; i due file `nginx/*.conf` in `/etc/nginx/snippets/`; l'unità in `/etc/systemd/system/goi-gis-https443-proxy.service`. File 0644, directory nuova 0755. Non cambiare permessi delle directory già presenti.
4. Eseguire `systemctl daemon-reload`, avviare solamente `goi-gis-https443-proxy` e verificare listener **127.0.0.1:18080**, stato active e GET `/_routing/gh/info` con Host esatto. Non abilitare ancora l'avvio automatico se la verifica fallisce.
5. Sostituire i due file esistenti tramite `replace_if_hash.py TARGET SOURCE EXPECTED_CURRENT_SHA EXPECTED_SOURCE_SHA`, usando `proposed/nginx.after.conf` e `proposed/goi_ors_gateway.after.py` e i quattro hash della tabella. Il helper mantiene mode/owner e rifiuta hash o symlink cambiati; non gestisce servizi.
6. Eseguire `nginx -t` prima di qualsiasi reload. Qualsiasi errore durante installazione, avvio, sostituzione di uno dei file o verifica di sintassi interrompe l'avanzamento e richiama il recupero per-file/per-fase descritto sotto: non presumere che entrambi i target siano stati sostituiti.
7. Riavviare esclusivamente `goi-ors-gateway`, verificarne lo stato, poi fare reload di Nginx. Un restart, controllo di salute o reload fallito/indeterminato richiama lo stesso recupero per-file/per-fase. Non riavviare GIS, GraphHopper, catalogo, pannello VPS, n8n o Tailscale.
8. Con normale verifica TLS, controllare `/gis`, `/_routing/gh/info` e `/ors/status`; verificare che `/gis` serva gli stessi byte del runtime HTTP attuale. Confermare lo stato dei percorsi preesistenti e il mantenimento del vecchio Origin HTTP. Solo dopo PASS abilitare il nuovo servizio all'avvio.
9. Salvare output, hash e verifiche nel repository. La pubblicazione del candidato runtime segue il suo gate separato; questo pacchetto non copia HTML sul VPS.

### Rollback preciso

Il helper è atomico per un file, non per la coppia Nginx/gateway. Il recupero deve quindi funzionare anche se soltanto una sostituzione è riuscita. Per **ciascun target**, confrontare lo stato attuale con la tabella: hash **Prima** = già intatto, non scrivere; hash **Dopo proposto** = ripristinabile con helper; qualsiasi altro hash = conflitto, non sovrascrivere quel file. Per i nuovi file: assente = saltare; presente e identico al manifest = gestibile; diverso = conflitto. Riportare i conflitti e le azioni già eseguite, senza forzare reload/restart su configurazioni di provenienza incerta.

1. Ripristinare soltanto i target classificati **Dopo** dai backup verificati o da `baseline/`, usando `replace_if_hash.py` con hash invertiti. Lasciare intatti quelli già **Prima**. La rimozione dell'unico include ripristina integralmente il server originale. In caso di conflitto, limitarsi ai file di provenienza certa e fermarsi prima di qualsiasi attivazione che dipenda dal file in conflitto.
2. Se il gateway non era stato riavviato e Nginx non era stato ricaricato, il ripristino dei file non richiede di riavviare i servizi originari. Se un restart/reload era stato tentato o eseguito, verificare entrambi gli hash originari e `nginx -t`, poi ripristinare l'esecuzione originale del solo servizio interessato. Verificare i percorsi originari. Nessun reload su un file in conflitto.
3. Fermare/disabilitare il nuovo proxy solo se era stato avviato/abilitato da questa applicazione e la sua identità è ancora quella del pacchetto. Rimuovere esclusivamente i nuovi file effettivamente installati e ancora identici al manifest; saltare quelli mancanti. Non rimuovere snippet ancora referenziati da una configurazione attiva o incerta. Rimuovere la nuova directory solo se vuota; non usare cancellazioni ricorsive generiche.
4. Eseguire `systemctl daemon-reload` se l'unità era stata registrata/rimossa; verificare hash originari, assenza del listener18080 installato da questa applicazione e baseline HTTP. Conservare backup, registro delle fasi e rapporto del rollback.

## Limiti e gate aperti

- Nessuna configurazione di produzione è stata applicata. Il collaudo non prova il certificato reale, l'avvio effettivo del servizio con sandbox systemd né la disponibilità dei provider.
- Le richieste che Nginx rifiuta prima di selezionare una location, o che vengono normalizzate fuori dal namespace GH, restano soggette alla policy di logging del server esistente. Questa proposta non cambia globalmente il logging dei servizi condivisi.
- L'audience eredita l'accesso già esistente al listener tailnet 443; il pacchetto non modifica ACL, Tailscale Serve, Funnel, DNS, porte pubbliche o certificati.
- `/gis` punta al runtime HTTP attualmente pubblicato. Il candidato finale della chat (`1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a`) non è installato da questo pacchetto. QA UI/provider reale e successiva distribuzione restano separate.
- Il cambio da origin HTTP a HTTPS comporta uno spazio browser distinto per storage/cache. Non è presente una migrazione automatica dei dati dell'utente.
