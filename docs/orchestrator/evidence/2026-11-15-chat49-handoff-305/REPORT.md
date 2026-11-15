# Handoff chat49 e ripresa — Build305 LIVE

Data: **15 novembre 2026, Europe/Rome**. Progetto: TMAR GIS Tool, repository canonico `mrhz1973/cursor-coordinate-converter`. Esecuzione: ChatGPT orchestratore con subagenti; GitHub e TMAR Desktop Commander Win. Questo rapporto è evidenza datata; lo stato vivo rimane [FRONTIER](../../../FRONTIER.md).

## 1. Mandato, fonti e limite del recupero

L'utente ha chiesto l'handoff di **«TMAR GIS TOOL 49 GPT»** e la prosecuzione in questa chat usando GitHub. Il recupero supplementare non ha restituito la trascrizione integrale della chat esatta; gli estratti disponibili permettono di conservare due richieste: riorganizzazione dei comandi Tracce e profilo delle tracce importate. Non si dichiara di avere letto tutti gli ultimi messaggi della chat49. Questo è un handoff operativo ricostruito da GitHub e dalle richieste disponibili, non una trascrizione.

CORE BOOT effettuato: `git ls-remote origin refs/heads/main`, README AI-BOOT, FRONTIER; WU N/A. HEAD iniziale verificata `938b2b3c601ae61b6c71cf806ae67119537af8aa`. README acquisito inizialmente da `main`: blob `996655d3ebb8178ba764a448e01accc9d75f4320`, poi verificato identico nel tree pinnato senza rileggerlo. FRONTIER acquisito allo SHA remoto.

## 2. Riconciliazione dello stato reale

| Fonte al passaggio | Riscontro |
| --- | --- |
| FRONTIER / LAST_CURSOR_REPORT | Dichiaravano Build303 LIVE, source `2f02a24c0320ee44f9814f7378a8392f901d7c75`. |
| Monolite in HEAD iniziale | Build304, commit `938b2b3…`, blob `2d02d72e1fb28300a11ba5db9e8abbe3ebd8a93b`, SHA-256 `6e31044dbd4eb2e331db93a4f25194f105e6cb60ff4c1a8d6311990cc04a6240`, 11.169.790 byte. |
| HTTPS e VPS verificati in questa sessione | Build304 e stesso hash; VPS su `main`, HEAD `938b2b3…`, working tree pulito, servizio attivo. |
| Handoff stabile | Conteneva puntatori superati a OM §7.1; corretti verso `docs/FRONTIER.md` e WU condizionale. |
| `orchestrator/latest.md` | Ancora riferito alla Build295; da riallineare nell'autosync di questo pass. |

Il profilo GPX/KML della Build304 era quindi già distribuito e non è stato duplicato. La conservazione delle quote della Build303 e i suoi test precedenti restano evidenza storica: non sono nuovi test di questa sessione. [Ricevuta di riconciliazione](handoff-reconciliation.json).

## 3. Finding riprodotti e correzioni

1. **Singola quota valida persa.** `savedTrackSanitizeImportedElevations` rigettava l'intero allegato se conteneva meno di due quote. Il minimo per la conservazione è ora una quota valida; i requisiti numerici, il geometryHash e l'esclusione dei poligoni rimangono. Il profilo continua a richiedere almeno due quote e una coppia contigua utilizzabile.
2. **Importa superiore → Salva perdeva le quote.** Il draft manteneva `_importEle`, ma `saveCurrentTrackToLibrary` non costruiva l'allegato persistito. Ora lo snapshot di geometria, chiusura e quote passa dal builder/sanitizer esistente. Creazione, replacement, read-back e rollback conservano il contratto di storage; `_importEle` non entra nei punti salvati.
3. **Punto importato spostato prima del salvataggio.** Il mutatore reale `trackUpdatePointLatLon` lasciava la quota associata alle nuove coordinate. Ora elimina la quota del solo punto effettivamente spostato. La prima candidata confrontava longitudini grezze e normalizzate: la QA ha riprodotto una perdita anche nel no-op `9.0004`. Il source definitivo normalizza entrambi i termini, senza epsilon e senza cambiare il geometryHash.

Rinomina/replacement con geometria identica conserva l'allegato precedente valido; geometria differente lo invalida. Nessun nuovo schema persistito, provider, GPS o dipendenza runtime. `state.mapWaypoints[]` invariato. L'applicazione rimane un singolo HTML con CSS/JS inline.

## 4. Identità del runtime definitivo

| Campo | Valore |
| --- | --- |
| Build / blocco | 305 / `GIS-SAVED-TRACK-IMPORT-ELEVATION-SAVE-A` |
| Source definitivo | `95080bac23a1642c1a2c6f8c0bdd4885b7bac960` |
| Candidata preliminare, superata | `2664bb1fc1f34732758e6fbf1668e25792744f7a` |
| Baseline LIVE precedente | `938b2b3c601ae61b6c71cf806ae67119537af8aa`, Build304 |
| Git blob | `e9b949cdb3d444128f70a6188122bf05fb715d09` |
| SHA-256 | `5ffa64ff3ba9746de9a5463cc4adfc058ceb7de77e095aacdd51259e39d72464` |
| Byte / terminatori | 11.170.887 byte / 192 CR / 0 CRLF |
| Delta runtime rispetto alla 304 | Unico HTML, 22 inserimenti / 8 rimozioni; tre aree funzionali e metadati di rilascio. |

## 5. Review e prove nuove, circoscritte

**REVIEW GPT-SOSTITUTIVA tecnica PASS scoped.** Checklist sanitizer/storage/create-path applicata al diff e ai byte Git: numeri finiti e limiti invariati, ambito tracce aperte, null preservati, geometryHash, snapshot sincrono, sanitizer obbligatorio, replacement, read-back/rollback, nessun endpoint/GPS. Review di subagente distinta dall'implementazione. Reviewer AI esterno formale **NOT_PERFORMED**, backstop post-hoc; nessuna attribuzione a soggetti che non hanno eseguito la review.

| Evidenza | Risultato e limite |
| --- | --- |
| [Harness singola quota, source definitivo](gis-single-elevation-final305.json) | 16/16 PASS: singola positiva/zero/negativa, invalidi, hash, poligoni ed export GPX/KML. Funzioni originali; `ensureSavedTracksState` isolata con no-op dichiarato. Non è il test browser. |
| Guardia finale del mutatore | 7/7 probe Node dell'implementatore: no-op `9.0004`, equivalenti ±360°, spostamenti lat/lon `1e-9`, NaN/Infinity. Altri campi e altro punto invariati. |
| [Associazione review al source](gis-review-final305-binding.json) | Byte definitivo verificato; la correzione finale sostituisce una sola riga. |
| Sintassi / perimetro | Due script inline compilabili, `git diff --check` PASS, CR192 preservati. |
| [Browser candidato — tracce](candidate-result.json) | **49/49 PASS**, Edge Windows, HTML candidato iniettato esclusivamente nel profilo di prova. |
| [Browser candidato — poligono GIS](candidate-polygons-result.json) | **16/16 PASS**, fixture autonoma in nuovo profilo isolato. |
| [Browser HTTPS LIVE — tracce](live-result.json) | **49/49 PASS**, documento nativo, senza sostituzione HTML. |
| [Browser HTTPS LIVE — poligono GIS](live-polygons-result.json) | **16/16 PASS**, documento nativo, senza sostituzione HTML. |

I 49 controlli coprono importazione dall'input superiore con evento applicativo, CTA di salvataggio visibile, persistenza/reload, quote complete/parziali/singole/assenti, profilo e provenienza, gap, hover da tastiera, export GPX e reimportazione/salvataggio, replacement e mutatore delle coordinate. Il mutatore è esercitato direttamente: non è una prova del gesto fisico di trascinamento.

Il caso poligono usa il vero store `state.gisPolygons[]`, non un SavedTrack chiuso come surrogato: import Hub → persistenza → reload → esportatori nativi GeoJSON/KML → parser applicativo. L'importatore e gli esportatori sono esercitati con le loro API; selettore file del sistema operativo e gesto di download non sono simulati.

Nelle quattro sessioni conclusive: zero POST, eccezioni JavaScript ed errori console. Richieste accessorie bloccate, profili temporanei eliminati; nessun profilo personale, GPX privato o dato utente. La cattura registra separatamente richieste d'intercettazione cancellate durante la navigazione, con relativo evento/epoca; non vengono nascoste come errori applicativi. Nessuna ripetizione delle precedenti suite 2.312 quote, DTM18, media200m19 o Escape7.

### Tentativi precedenti conservati

- Chromium Linux non avviabile per restrizione socket: zero prove applicative, NOT_PERFORMED.
- [Candidata, tentativo1](candidate-attempt1.json): harness usava il vecchio pulsante nascosto `btnTrackSaveLibrary`; corretto verso la CTA corrente. INCOMPLETE, non bug del prodotto.
- [Candidata, tentativo2](candidate-attempt2.json): 48/49, difetto reale nel no-op longitudine; corretto nel source definitivo.
- [Candidata, tentativo3](candidate-attempt3.json): 49 controlli funzionali PASS, ma cattura incompleta per `Invalid InterceptionId`; registrazione delle cancellazioni corretta e sessione conclusiva distinta.
- [Primo tentativo LIVE](live-attempt1.json): zero controlli; documento espulso dalla cache dell'inspector prima della verifica hash. Cattura dimensionata e durable messages abilitati solo dopo verifica dello schema CDP disponibile; retry conclusivo con hash nativo esatto.

## 6. Pubblicazione e deploy

Source definitivo pubblicato su `origin/main` dopo review e QA candidata. Il push dal cloud e dal VPS non disponeva di credenziali di scrittura; è stato eseguito dal collegamento Git già autenticato sul Windows, senza leggere o pubblicare token. Gli oggetti Git esatti sono stati trasferiti a un repository temporaneo; nessuna modifica al repository personale sul PC.

Deploy **GIS-only PASS alle 18:15:42 Europe/Rome**. Preflight: main, HEAD304 attesa, working tree pulito e hash304; backup verificato, pull fast-forward, hash305, un solo restart del servizio GIS. PID `3507097` → `3632670`; readiness al secondo tentativo. Proxy, GraphHopper, ORS e infrastruttura condivisa non modificati.

Backup304: `/var/backups/goi-gis-runtime/20261115T171540Z-build305`. File, HTTP interno, HTTPS e corpo dei documenti nativi Edge concordano per hash e dimensione. [Journal deploy](deploy-result.json) · [Smoke HTTPS](https305-smoke.json). La procedura di rollback prevede controlli su hash e HTTP304 ed è stata revisionata staticamente; il rollback **non è stato eseguito** in produzione.

## 7. Handoff persistente e richieste ancora aperte

FRONTIER è stato riportato alla sola frontiera corrente. I precedenti checkpoint, **75.967 byte preservati integralmente**, sono in [FRONTIER_HISTORY_20261115.md](../../../FRONTIER_HISTORY_20261115.md), mantenendo validi i link relativi. L'originale resta nella storia Git. Non sono stati retroattivamente riscritti PASS o gate storici. HANDOFF contiene solo il protocollo stabile, con puntatori corretti. Autosync finale: `latest.md`, una inbox e `LAST_CURSOR_REPORT.md`, senza commit autoreferenziale.

| Voce | Stato al passaggio |
| --- | --- |
| Quote GPX/KML nel ciclo della traccia corrente salvata | Correzione LIVE305, QA tecnica scoped PASS; QA operatore PENDING. |
| Profilo da quote importate | Già introdotto nella LIVE304; verificato nel ciclo305. Una sola quota non genera profilo; quote parziali mantengono i vuoti. |
| Pannello Tracce, comandi distinti alto/basso | **APERTO**: Importa alto corrente, Esporta alto ancora basato sulle tracce salvate; Importa/Esporta nella barra dell'archivio da organizzare. Non dichiarato risolto da questo rilascio. |
| Profilo da sola geometria XY senza quota | **NON implementato da305**. Richiede un percorso altimetrico esplicito; nessun DTM o provider automatico. |
| DTM5/10m e percorso originale | **HOLD** per precisione sul terreno / ground truth. Quote GPX non equivalgono a precisione DTM. |
| Mobile | Sviluppo **PAUSA**, funzioni preesistenti conservate. |
| QA umane precedenti | Restano distinte; nessuna chiusura dedotta dalla QA tecnica di305. |

**NEXT:** QA operatore breve e percettiva su un proprio file nella Build305; poi riorganizzazione dei comandi Tracce già richiesta. La richiesta «continua» non è stata convertita in un PASS umano. Il gate residuo segue OM §4, Regole D2/H.
