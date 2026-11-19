# Build317 P3 — LIVE riconciliata, QA operatore PENDING

Data: **19 novembre 2026, Europe/Rome**. Blocco `GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A`, tier DELICATO, closure `STANDARD_RUNTIME_BUNDLE`.

## Esito e stato corrente

**Build317 già servita dal VPS e ora verificata: identità GitHub/VPS/HTTP/HTTPS concorde; Automated Browser QA HTTPS LIVE 151/151 PASS. QA FINALE CHATGPT — PENDING; QA operatore non attestata.**

Il CORE BOOT ha trovato FRONTIER ancora fermo alla chiusura P2/Build316; la successiva lettura on-demand di LAST_CURSOR_REPORT ha confermato lo stesso stato storico. La review Build317 già pubblicata attestava soltanto il candidato. Questo pass riconcilia il servizio realmente attivo e aggiorna la documentazione: nessuna modifica runtime, nessun nuovo deploy, nessun riavvio di servizi. P2 resta CLOSED con il PASS operatore del 18/11; P3 resta aperto in attesa della propria QA umana.

## Identità e distribuzione osservata

- Source runtime: `aff215323c97a309cbd5c6c7e0c694d35dd45ad0`.
- Git blob: `4578788467822123ea7ad7e929d3bdf0e262b1a8`.
- SHA256: `ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec`.
- Dimensione: **11.288.727 byte**, CR192 / CRLF0.
- GitHub origin/main al momento dell'acquisizione: `6dc476918a2a6f4c5f1e7971c76ecfe0f9eec4bd`, verificato con `git ls-remote`; il runtime a questa HEAD ha il blob e lo SHA256 sopra.
- VPS: `/root/local-files/handoff-runtime/cursor-coordinate-converter`, branch `main`, HEAD e tracking `origin/main` pari a `6dc476918a2a6f4c5f1e7971c76ecfe0f9eec4bd`, working tree pulito all'osservazione del **19/11/2026 01:51:57 CET**.
- `goi-gis-app` osservato `active/running`, PID `3001592`; avvio del processo registrato dal servizio il **19/11/2026 00:25:03 CET** (18/11 23:25:03 UTC). È un fatto osservato del deploy precedente, non un riavvio eseguito da questo pass.
- Backup preesistente: `/var/backups/goi-gis-runtime/prebuild317-FdlskfH8`; runtime Build316 di 11.277.535 byte con SHA256 `edf2042254b53852ee7402655b139c698cc09d958be555b397fdc13162525917`.
- HTTP: `http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=ed760bbd`.
- HTTPS canonico: `https://ionos-n8n-new.tailc01234.ts.net/gis?v=ed760bbd`.
- Entrambi gli endpoint: HTTP 200, Content-Length 11.288.727 e SHA256 concorde, verificati dal client Windows con TLS ordinario il **19/11/2026 01:52:16 CET**.

[Ricevuta identità completa](runtime-identity.json). Le HEAD dei contenitori documentali successivi sono distinte dal source runtime.

## Evidenze riutilizzate e verifica LIVE eseguita

La [review GPT-SOSTITUTIVA predeploy](REVIEW.md) del 18/11 resta acquisita: 32 controlli statici, JavaScript inline 2/2, candidato Edge 151/151 PASS. Non sono stati ripetuti sviluppo, statici o QA candidato. Reviewer AI esterno `NOT_PERFORMED`; backstop post-hoc ancora aperto.

È stato eseguito **una sola volta** il [runner già qualificato](browser-qa.cjs), invariato, in modalità `live` su Edge headless Windows, URL HTTPS canonico, profilo temporaneo nuovo. SHA256 runner `92b0af9d589fbfd115c290281aea60c7280fad9228d866da73180c1fbcc83375`.

- **151 controlli eseguiti, 151 PASS, zero FAIL**; comprende i 17 controlli P3 e i 134 controlli di regressione già inclusi nel runner.
- **79 clic nativi**, **10 aperture del selettore file**; zero eccezioni JavaScript, zero errori console, zero POST.
- Provider Open-Meteo simulato: nessun invio reale di coordinate. Richieste esterne intercettate; 786 richieste non necessarie bloccate nel profilo di test.
- Coperti successo e risposta parziale del completamento, rifiuto del consenso, OPSEC/offline, errore provider, DTM locale sintetico, persistenza/reload, export delle sole quote originali, rollback su errore storage, limite punti e race sulla geometria.
- Il risultato `network.documentHashes` del runner è vuoto: **non** viene usato per attestare l'identità HTTPS; questa è provata separatamente nella ricevuta dei GET nativi.
- Pulizia dei dati sintetici dell'origine: **PASS**. Rimozione della directory del profilo temporaneo: **non riuscita, EPERM**. Nessun cambio di permessi o pulizia forzata; il residuo temporaneo non appartiene al profilo personale.

[Risultato integrale LIVE](live-qa.json), SHA256 `e21a094bdd60164d7f753764c67cbe64c38efe577b92baa6da971348189e2942`. [Screenshot P3 realmente ispezionato](live-p3-partial-quoted-composite.png) e [manifest](screenshots-manifest.json). La carta di sfondo non è caricata perché le richieste esterne sono bloccate dalla suite; il grafico e i conteggi Originali/Stimate sono visibili.

`AUTOMATED BROWSER QA GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A PASS`

## Gate residuo e limiti

**QA operatore PENDING.** Ai sensi di OM §4 D1/D2/D2bis, la QA umana residua deve riguardare individuabilità del comando, comprensibilità del profilo misto e uso del grafico sul desktop reale. Nessun PASS umano è dedotto dai controlli automatici. Nessuna chiusura Regola H prima dell'attestazione dell'operatore.

Quote originali conservate; stime `terrainFill` separate e non esportate come Z originale. Nessun dislivello totale misto o pendenza tra fonti diverse. Il test con provider simulato non certifica disponibilità del servizio esterno né accuratezza topografica. DTM 5–10m precisione terreno **HOLD**, mobile **PAUSA**, P0 inventario origine HTTP/backup **aperto**, P4 menu Nuova traccia **SOLO FUTURO**.

## Finding di metodo e perimetro documentale

Il primo fetch README ha restituito righe oltre AI-BOOT: eccedenza ignorata, range futuro corretto a 4–68. Un output combinato del rapporto cumulativo e dei metadata connector è risultato troppo ampio/troncato: fonti considerate già acquisite, nessun refetch; estrazioni successive limitate a regole, simboli e range pertinenti. Nessun conflitto prodotto o LIVE STATE deriva da questi finding.

Aggiornati FRONTIER e il presente dossier. Il rapporto rolling, latest e un solo inbox vengono pubblicati nel contenitore autosync separato secondo F3. Runtime, metodo stabile, roadmap e checkpoint legacy restano fuori dal pass.
