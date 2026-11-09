# RIEPILOGO — HTTPS 443 e Build 280 live

Data evidenza Git: `2026-11-09T13:48:27.373358+00:00` (2026-11-09 14:48:27 Europe/Rome). Autore operativo: **GPT**. Il nome canonico `LAST_CURSOR_REPORT.md` non implica un'esecuzione Cursor: **Cursor e Codex NOT_RUN**.

## A. Header sintetico

| Campo | Stato |
| --- | --- |
| BLOCK | `ROUTING-LAND-ONLY-NO-FERRY-A` |
| WU attiva | Nessuna |
| GATE | QA operatore residua sul territorio e telefono reale; review esterna post-hoc pendente. Gate tecnici prepubblicazione, deploy e Automated Browser QA live PASS. |
| NEXT | Raccogliere i 3 casi umani preparati e completare il backstop esterno secondo metodo; nessun FINITO o PASS operatore anticipato. |
| Runtime LIVE | Build 280, 11.108.654 byte, SHA-256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |
| Commit runtime / blob | `c33f58c956e9630b03f9ff86eb35eccd35879a4a` / `d2ec773205da2a6d4bf954f635765eb872ec646c` |
| Deploy | VPS `main` pulito al commit runtime; 9 novembre 2026 14:32:47 Europe/Rome; solo GIS riavviato |
| Automated Browser QA | PASS sul documento live, 14:36:32–14:36:46 Europe/Rome; tre SHA documento verificati, due POST reali |
| Runtime candidato ulteriore | Nessuno per questo pass; il precedente 1e6c11cf… resta storico delle prove iniziali |
| Working tree al momento dell'evidenza Git | Pulito, prima della scrittura dei tre file autosync |
| REMOTE_HEAD_AT_EVIDENCE_TIME | `fcca5cdf53e355c397a365fb15d77d729691bcf7` |
| real_task_commit | `fcca5cdf53e355c397a365fb15d77d729691bcf7` — checkpoint documentale/evidenze già pubblicato |
| current_report_container | `PENDING_SELF_REFERENCE` |
| Esito del proprio autosync / HEAD finale | `EXTERNAL_ONLY` — verifica esterna dopo il push, nessun terzo commit di autocitazione |

FRONTIER è l'unica LIVE STATE. Questo file è EVIDENCE/HANDOFF. [Rapporto completo](../orchestrator/evidence/2026-11-09-https443-release-280/REPORT.md), [manifest delle evidenze](../orchestrator/evidence/2026-11-09-https443-release-280/evidence-manifest.json) e [QA operatore](../orchestrator/evidence/2026-11-09-https443-release-280/QA-OPERATORE.md). Nessuna nuova autorizzazione richiesta per le azioni già autorizzate ed eseguite.

## B. RIEPILOGO COMPLETO

### Esito e autorizzazioni

L'approvazione specifica «Okay, autorizzato.» ha consentito l'applicazione del pacchetto HTTPS 443 preparato: proxy loopback 18080, include Nginx e un solo Origin aggiuntivo per ORS. `APPLIED_PASS` alle 13:57:21 Europe/Rome. Vecchio Origin HTTP mantenuto; nessuna modifica a DNS, certificati, firewall, Tailscale Serve/Funnel o listener pubblici. La standing authorization del 3 novembre resta riferita al runtime, senza estensione automatica a futura infrastruttura.

La Build 280 è stata poi pubblicata e distribuita dopo i gate pertinenti. File VPS, HTTP8000, HTTPS /gis e documento browser corrispondono allo SHA definitivo. Il deploy runtime ha riavviato solo GIS; Nginx, ORS, proxy HTTPS, configurazioni e listener condivisi sono rimasti invariati. Backup e registri delle due operazioni sono descritti nel rapporto. Nessun rollback necessario.

### Runtime e correzioni

Il bundle aggiunge difese no-ferry, copertura dei metadati terrestri, guardia snap entro 50 m e anchor verificati/confermati; usa percorsi same-origin sull'HTTPS esatto, deadline ORS complessiva di 20 secondi e corretta distinzione fra 404 generico e assenza di collegamento terrestre. Il riferimento Roma–Abidjan del self-check è corretto senza modificare gli algoritmi geodetici.

La prima QA reale ha isolato due difetti UI: il compare vuoto intercettava i click sulle alternative e il pulsante Compare poteva restare disabilitato dopo un cambio di punti/profilo. Il definitivo corregge `routingWireAlternativesRowOnce` e `routingCompareOnInputInvalidated`, più una sola nota di rilascio. Tutti gli altri byte sono identici al candidato iniziale 1e6c11cf…; review compositiva e prova di ricostruzione esatta pubblicate. Lo staging intermedio 68fb2dbc… non è stato eseguito nel browser.

Singolo HTML standalone con CSS/JS inline e vanilla JS conservato. Nessun cambio di storage, GPS, canonicità di `state.mapWaypoints[]`, MGRS/Converti o aree estranee. Tre nuove etichette IT; freeze EN/FR rispettato. La compatibilità condizionale 8443 non attiva alcun listener né fallback da 443.

### QA e limiti

| Prova | Esito e attribuzione |
| --- | --- |
| Review | REVIEW GPT-SOSTITUTIVA, intero bundle iniziale + delta finale immutabile; nessun blocker di codice residuo |
| Sintassi definitiva | 2/2 PASS |
| Alternative e persistenza | 8/8 PASS, 9 salvataggi/reload/riaperture; fixture ORS reale riprodotta offline |
| Compare e osservatore | Regressione offline PASS, nessuna sincronizzazione UI manuale e nessuna chiamata reale |
| Provider reali prima del deploy | 6 scenari, 7 profili, 7 POST PASS; 15 selezioni e 7 salvataggi/riaperture |
| Dopo il deploy | Documento live senza sostituzione HTML, 3 caricamenti con SHA esatto; confronto MTB GH/ORS con 2 POST, 2 salvataggi/riaperture PASS |
| Offline e OPSEC sul live | Messaggi corretti in entrambe le card, zero tentativi provider |
| Suite precedenti acquisite | 54 routing mock, 15 timeout, 2.112 controlli geografici, 96 invalidi e 24 UI PASS sullo SHA1e6; componenti invariati, non nuove esecuzioni sul file definitivo |

I tentativi falliti restano distinti: 1 POST sul primo candidato con difetti UI; 0 POST nel primo postdeploy fermato dal buffer DevTools. Quest'ultimo non dimostrava un mismatch del runtime: corretto soltanto il buffer dell'harness, poi gate SHA e matrice live PASS. Il totale reale del pass è 10 POST. Una favicon 404 appartiene alla QA prepubblicazione; nel postdeploy le tre favicon sono bloccate prima del server. Zero page error e trasporto provider fallito; i 616 messaggi console del postdeploy sono blocchi intenzionali di risorse accessorie, non una console vuota.

TLS di produzione verificato dal VPS; il browser Windows usa normalmente ESET SSL Filter CA e TLS1.3, senza bypass. Tile e altre risorse esterne bloccate durante la QA: gli screenshot verificano routing e policy, non la qualità della cartografia. Nessun profilo utente reale aperto. Nessun PASS Safari/iPhone fisico o operatore e nessuna review attribuita a un provider esterno.

### Dati, stato residuo e handoff

Il vecchio URL HTTP e HTTPS servono la stessa Build 280, ma hanno archivi browser distinti. I dati preesistenti restano sul vecchio Origin dello stesso browser/dispositivo; nessuna migrazione automatica. Le esportazioni sessione/GIS non sono un backup completo o una migrazione senza perdita. La review storage ne documenta i limiti senza cambiare codice o dati.

La QA umana residua riguarda tre casi: plausibilità di un percorso a piedi conosciuto, plausibilità MTB sul territorio e leggibilità/tocchi sul telefono reale. L'URL con cachebuster e le etichette UI sono nel documento collegato. Review esterna post-hoc pendente. Nessuna automazione Goal trasferita o modificata; altri workstream restano in FRONTIER.

### Commit, integrità e autosync

Commit runtime `c33f58c956e9630b03f9ff86eb35eccd35879a4a` già pubblicato e distribuito. Il commit task documentale `fcca5cdf53e355c397a365fb15d77d729691bcf7` aggiorna FRONTIER, il prefisso corrente di INFRA_VPS e il nuovo checkpoint di evidenze: `105 files changed, 32042 insertions(+), 10 deletions(-)`. Non modifica il runtime. Le 91 copie originali coincidono con le fonti; 102 artefatti del manifest sono stati verificati contro i blob staged. Il check whitespace generale segnala CRLF originali e spazi di contesto dei tre diff/delta archiviati: controllo con CRLF riconosciuti PASS per tutti gli altri file, senza riscrivere gli originali.

La pubblicazione usa Git bundle verificati e Git Credential Manager già configurato nel repository bare Windows isolato. Push normali, nessun force push o modifica ai checkout preesistenti. Fetch e ls-remote indipendenti dal cloud hanno confermato il task documentale. Il clone VPS resta sul commit runtime, distinto dalla successiva HEAD documentale.

Il contenitore corrente modifica esclusivamente i tre file autosync: `docs/orchestrator/latest.md`, questa inbox e `docs/runtime/LAST_CURSOR_REPORT.md`. Il suo esito commit/push è `EXTERNAL_ONLY`; `current_report_container=PENDING_SELF_REFERENCE`. Nessun ulteriore commit per registrare l'hash del contenitore stesso.

### STATO FRESCO DA CURSOR — campi canonici, fonte GPT

```text
Cursor: NOT_RUN
origin/main al momento dell'evidenza: fcca5cdf53e355c397a365fb15d77d729691bcf7
working tree prima dell'autosync: clean
ultimo gate tecnico PASS: Automated Browser QA live sulla Build 280
runtime LIVE: Build 280 / 70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde
prossimo passo: QA operatore residua e review esterna post-hoc
stato del blocco complessivo: aperto; nessun FINITO
HEAD finale e stato del contenitore corrente: EXTERNAL_ONLY
```

## C. OUTPUT GIT prima del contenitore

`git fetch --no-tags origin` completato prima dello snapshot. L'indicazione «output vuoto» descrive l'assenza di righe.

```text
$ git log --oneline -5
fcca5cd docs(gis): record HTTPS443 and Build280 verified release
c33f58c fix(gis): validate land-only routes and enable approved HTTPS routing
e94d26a docs(gis): autosync GPT routing handoff and pending infrastructure gate
b8da231 docs(gis): checkpoint GPT routing 280 and HTTPS proposal
8415439 Record build 279 deployment

$ git rev-parse HEAD
fcca5cdf53e355c397a365fb15d77d729691bcf7

$ git rev-parse origin/main
fcca5cdf53e355c397a365fb15d77d729691bcf7

$ git branch --show-current
main

$ git ls-remote origin refs/heads/main
fcca5cdf53e355c397a365fb15d77d729691bcf7	refs/heads/main

$ git status --short
(output vuoto)
```
