# Build321 — MAP-TARGET-SCALE-A LIVE, Automated Browser QA PASS

**Rilascio del 23 novembre 2026.** Profilo `ROUTINE / STANDARD_RUNTIME_BUNDLE`. Stato: `DEPLOY_TECHNICAL_PASS / AUTOMATED_BROWSER_QA_PASS / QA_OPERATORE_PENDING`. **Blocco APERTO**, nessun `finito` e nessun PASS umano.

## Identità verificata

| Campo | Valore |
| --- | --- |
| Source Git commit | `64522d52d102cdd0bcd89f4b671b65dc0ba8e9b2` |
| Blob Git `coordinate_converter Claude.html` | `d102cc7e91ea39ad6f85afdbc2348e36bb7c12ec` |
| SHA-256 runtime | `96c2c34eec74f43a1dbc636620d6e54989529d53213e58f31edd2d56203dd971` |
| Dimensione | 11.345.158 byte |
| Runtime LIVE | [Build321 HTTPS](https://ionos-n8n-new.tailc01234.ts.net/gis?v=96c2c34e) |
| Base Build320 | `d1fbc357fb3dafc42fec13e3283444efdfec4a91` docs; runtime precedente source `ca3a38d1c7703c5bf93724cd5df608af2914751d` |
| Backup VPS verificato | `/var/backups/goi-gis-runtime/prebuild321-4jkjgYPN` |

## Delta funzionale

Interfaccia `1:N` affiancata alla scala già visibile sulla mappa; pannello *Scala nominale 1:* con input, Applica, Chiudi e risultato accessibile. Per zoom integer XYZ/TMS sceglie il livello disponibile più vicino usando il modello già esistente `156543.03392·cos(latitude)/2^zoom / 0.00028` e mostra **scala richiesta, scala ottenuta, zoom e scostamento**. Input 100–100.000.000, rifiuto valori non validi, center/layer invariati; zoom salvato nel campo canonico esistente. Chiusura con ×, Esc e gestione focus. Traduzioni IT/EN/FR. Nessun nuovo campo persistito, endpoint esterno, migrazione, GPS automatico, framework o modifica al core tile/cache.

La scala è **nominale convenzionale 0,28 mm per pixel**, non calibrata sul DPI fisico dello schermo. Il livello frazionario e l’eventuale scala 1:N più precisa restano oggetto separato di `MAP-FRACTIONAL-ZOOM-A`; non è dichiarato supporto uniforme per tutti i layer.

## Qualificazione predeploy

- Monolite unico, vanilla JS; diff selettivo **173 aggiunte / 3 rimozioni**, un file codice.
- Sintassi e calcolo: **77/77 PASS** per script inline, i18n, limiti numerici, molteplici latitudini e zoom per layer.
- Browser candidato con tre viewport temporanei (desktop 1440×900, phone 390 e phone 320): **45/45 PASS**. Verificati interfaccia, feedback, center/layer, input non valido, Esc/×, focus, persistenza e responsive. Screenshot diagnostici locali non committati; nessun dato dell’archivio personale caricato.
- Caso dimostrativo 44,1027 N, 9,8236 E: richiesta 1:25.000 → zoom14 e scala nominale approssimata **1:24.504** (scostamento 2%).

## Deploy tecnico — PASS, con prima lettura fallita conservata

VPS `ionos-n8n-new` preflight: Build320 HEAD e SHA attesi, checkout pulito e servizio attivo; backup Build320 con SHA verificato. Aggiornato via `git pull --ff-only origin main` al source completo Build321, controllato Git blob/file/SHA; riavviato esclusivamente `goi-gis-app`. Il primo smoke HTTP immediato ha dato **connection refused**; non si deduce una causa certa dal solo errore. La successiva diagnostica ha osservato il listener `100.99.54.93:8000` e servizio active. Il readback successivo, eseguito separatamente, ha verificato **HTTP 200, HTTPS 200, 11.345.158 byte e SHA-256 uguale al runtime per entrambi**, nessun redirect, worktree VPS pulito e source HEAD esatto. **DEPLOY_TECHNICAL_PASS**.

## QA browser LIVE — PASS, con STOP intermedi distinti

Il browser posseduto Edge **158.0.4370.33** su Windows ha caricato il documento HTTPS esatto LIVE tramite la policy di richieste di collaudo; tutte le risorse secondarie sono state bloccate, senza bypass TLS, senza uso del profilo personale, segreti o geolocalizzazione. Nessuna prova di compatibilità universale o su device fisici.

- Primo tentativo LIVE: **FAIL 28/31** per tre STOP driver; non qualificato PASS.
- Diagnostico LIVE separato: **FAIL 42/45**, con `ReferenceError: state is not defined` solo nella lettura di stato dopo `Page.reload` quando il driver aveva atteso 1,5 s fissi. La pagina iniziale risultava già `complete`, runtime corretto e JavaScript attivo. STOP preservato.
- Driver di collaudo corretto **senza modificare il runtime**, sostituendo l’attesa fissa con guard di URL, `readyState=complete`, `typeof state`, controllo presente e build corretta, inclusa ricarica. **Ultima suite LIVE: 45/45 PASS** su desktop1440, phone390 e phone320 emulati, tutti con Documento HTTPS200 validato. Timeout reali inizializzazione fra 2,4 e 5,2 s.
- Esiti verificati: target scale, feedback, center/layer invariati, nessun input malformato applicato, ×/Esc/focus, persistenza senza nuovi settings, nessun errore JS osservato o richiesta GPS nei test, popup dentro viewport; screenshot diagnostici conservati solo localmente.

Le [ricevute normalizzate](evidence.json) contengono gli hash SHA-256 dei file originali e mantengono gli STOP distinti dal PASS definitivo. Non si aggregano prove ripetute come punteggio unico.

## Gate operativo

**QA FINALE CHATGPT — PENDING.** ChatGPT deve emettere una breve verifica umana della resa e dell’uso di `1:N` secondo OM §4 Regole D2/D2bis. Solo la riga esatta `QA MAP-TARGET-SCALE-A PASS operatore` potrà attivare la chiusura Regola H. Su FAIL non dichiarare finito, acquisire finding specifico e correggere il blocco. Build320 resta ultimo blocco **CLOSED**. P0 archivio: autorizzato/non applicato. DTM5/10m HOLD; P4 FUTURO.
