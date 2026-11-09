# Build 280 — QA routing reale prepubblicazione

## Esito corrente

**PASS funzionale sul candidato SHA256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`.**

Esecuzione Windows diretta HTTPS: **9 novembre 2026, 13:18:56–13:19:21 UTC** (14:18:56–14:19:21 italiane). Sei scenari, sette POST reali, quindici selezioni di percorso verificate, sette salvataggi e sette riaperture verificate. Non costituisce ancora il gate browser sul documento pubblicato.

Il runner effettivo è conservato in `attempt2/real-routing-280.cjs`, SHA256 `b83d81be6c89671b34b05fa7deda543c7cc9579c483d550ea7576ca381133cb5`. Le prove complete sono `attempt2/results.json`, il riepilogo `attempt2/qa-summary.json`; il manifesto `attempt2/artifact-manifest.json` contiene le SHA256 dei dodici file raccolti e verificati dopo il trasferimento.

## Matrice realmente eseguita

La fixture pubblica è identica in tutti i casi: A **44.1024, 9.8236**, B **44.107, 9.829**. Le coordinate sono state immesse con i controlli dell'app e riscontrate sia in `state._routing.points` sia nei due campi visibili prima del clic di calcolo.

| Scenario | Profili effettivi | POST | Alternative restituite | Esito |
|---|---|---:|---:|---|
| GraphHopper singolo | `hiking` | 1 | 3 | PASS |
| OpenRouteService singolo | `foot-hiking` | 1 | 3 | PASS |
| Confronto MTB | GH `mtb_trail`, ORS `cycling-mountain` | 2 | 1 GH, 1 ORS | PASS |
| GraphHopper singolo | `hiking_easy` | 1 | 3 | PASS |
| GraphHopper singolo | `mtb_touring` | 1 | 1 | PASS |
| OpenRouteService singolo | `foot-walking` | 1 | 3 | PASS |

La verifica non richiede tre alternative quando il servizio ne produce legittimamente meno. Sono state selezionate tutte quelle realmente ricevute; è stata salvata l'ultima alternativa di ciascun provider/scenario.

## Cosa è stato verificato

- Byte del candidato controllati prima e dopo l'esecuzione. Nel test prepubblicazione soltanto la risposta HTML è stata fornita localmente all'origine HTTPS autorizzata.
- Richieste provider native del browser, TLS attivo, `ignoreHTTPSErrors:false`; risposte originali preservate e archiviate senza riscrittura o sanitizzazione del contenuto consegnato all'app.
- Contratto dei body inviati: profilo previsto, punti della fixture o snap osservati, opzioni no-ferry, alternative e metadati richiesti. Zero POST precedenti al clic esplicito; zero rifiuti del guard nei sei scenari riusciti.
- Validazione indipendente di ogni percorso ricevuto: metadati terrestri su tutta la geometria, assenza di ferry nei metadati rilevanti e distanze di snap entro il contratto. I dati non dimostrano una garanzia geografica universale fuori dalla fixture.
- Interfaccia: card risultato e dettagli visibili, salvataggio abilitato, geometria di preview corrispondente all'alternativa cliccata, elementi SVG di preview presenti. Quindici selezioni corrispondenti alle geometrie originali.
- Salvataggio: geometria identica nel nuovo elemento di `state.savedTracks` e nel solo localStorage del context temporaneo. Ricaricamento del documento e ripristino dei sette elementi salvati con la stessa geometria; profilo di elevazione presente.
- Nel confronto sono stati scelti e salvati entrambi i provider. Nessun provider è stato dichiarato migliore.
- Zero `pageerror` e zero errori di trasporto dei provider.

I controlli sulla presenza/visibilità degli elementi DOM e le geometrie lette sono assert browser; le conclusioni sull'assenza di ferry sono validazioni dei metadati del backend. Non sono una verifica indipendente delle caratteristiche fisiche di ciascuna strada.

## Trasporto, isolamento e limite osservato

Il test usa Chromium Playwright con context nuovi e non persistenti, senza accesso a profili o storage del browser dell'operatore. I context e il processo browser sono stati chiusi al termine. Nessun comando GPS è stato azionato e non sono state concesse permission di geolocalizzazione.

L'accesso Windows è stato **diretto**; non è stato usato il tunnel opzionale presente nel vecchio runner. Il browser ha riportato **TLS 1.3 con issuer `ESET SSL Filter CA`**, cioè la CA locale di sistema. Questo riscontro non viene presentato come osservazione della catena certificati originaria del server dal browser; il controllo TLS dal VPS appartiene alla prova infrastrutturale separata.

Le richieste estranee al routing (font, tile, meteo e risorse accessorie) sono state bloccate dal runner. La console ne registra i conseguenti `ERR_BLOCKED_BY_CLIENT`. **Eccezione osservata:** nel primo context un GET automatico del browser a `/favicon.ico` ha ricevuto 404 senza transitare dal route handler Playwright. Non era un POST e non ha interessato provider o dati di routing, ma impedisce di descrivere questa esecuzione come isolamento delle richieste senza eccezioni.

Il runner successivo blocca `/favicon.ico` tramite CDP prima della navigazione. La prova offline `post-policy-offline-proof.json` osserva `blockedReason: inspector` e nessuna risposta server; non modifica HTML o DOM. Questa preparazione non viene retroattivamente applicata al risultato storico di `attempt2`.

## Tentativo precedente e correzioni

`attempt1` riguarda esclusivamente il precedente SHA `1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a` e **non è PASS**. Ha consumato un solo POST reale ORS, risposta 200 originale conservata in `attempt1/responses/ors-foot-hiking-ors.json`, SHA256 `ddfc9b7cc9551f52b5fa06b2bfd23126c45f4e6bcaecb6149d5deb3231129c1f`.

Sono state distinte tre cause:

1. **Runtime, selezione alternativa:** una sessione confronto vuota veniva trattata come confronto attivo; il clic cambiava la chiave overlay senza applicare la geometria scelta alla preview. La correzione del proprietario del runtime richiede almeno un pack confronto con stato PASS. Il replay della risposta ORS originale è stato affidato al revisore separato.
2. **Runtime, pulsante confronto:** dopo punti/profilo iniziali mancava la sincronizzazione della UI quando la sessione confronto era vuota. Prima della correzione il profilo effettivo `mtb_trail` coesisteva con una nota `hiking ↔ foot-hiking` e pulsante disabilitato. La diagnosi offline mostra che l'unica chiamata diagnostica al sincronizzatore correggeva la UI; il definitivo è stato poi verificato con soli clic normali, senza questa chiamata.
3. **Runner, guard GraphHopper:** l'app poteva inviare gli snap ricevuti prima che l'observer asincrono registrasse il secondo `/nearest`. Il body corretto veniva così rifiutato dal guard. La riproduzione offline naturale e una barriera deterministica lo documentano in `offline-diagnostics.json`. Il guard corretto attende le Promise d'osservazione prima di applicare lo stesso exact match, senza allargare il limite dei punti né ritardare artificialmente la UI. La regressione mirata completa è PASS in `final-offline-regression.json`.

Le suite precedenti di 54 mock, 15 timeout e 2112 casi geodesici non sono state rieseguite da questo agente. Nessuna loro evidenza è stata presentata come nuova esecuzione.

## Preparazione del gate dopo pubblicazione

Il runner in modalità `postdeploy` è preparato per il vero `/gis?v=<SHA>`, senza intercettazione del documento. Il gate di esecuzione richiede l'autorizzazione distinta `D2BIS_DEPLOY_PASS`. La prova prevista consiste in un confronto reale MTB (due POST), byte/build/TLS di ogni caricamento, selezione, salvataggio, riapertura e controllo Console/Network.

La preparazione offline dei controlli è PASS: tramite gli interruttori effettivi dell'interfaccia, forced-offline e OPSEC strict producono il messaggio appropriato in entrambe le card provider, con zero tentativi di richiesta provider. Questa è una prova preparatoria e non sostituisce la QA sul documento pubblicato.

## Dati presenti nelle evidenze

`evidence-data-check.json` registra la scansione dei diciannove JSON del tentativo fallito, del tentativo riuscito e delle diagnosi. Nessuna chiave Cookie, Set-Cookie, Authorization, Proxy-Authorization, API key, access token, refresh token, secret, password né valore Bearer è presente. I log richieste non serializzano header o `storageState`; risposte e geometrie riguardano esclusivamente la fixture pubblica.

Il vecchio helper CONNECT rimane nel sorgente del runner come parte del codice effettivamente derivato; il codice contiene nomi di variabili per credenziali effimere, ma il helper non è stato utilizzato e nessun valore di tali credenziali è stato serializzato.
