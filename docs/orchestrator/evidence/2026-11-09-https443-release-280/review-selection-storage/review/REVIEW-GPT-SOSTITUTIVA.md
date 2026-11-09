# REVIEW GPT-SOSTITUTIVA — bundle runtime Build 280

Data: **9 novembre 2026**. Reviewer: agente GPT distinto dall'implementatore, `/root/storage_origin_check`. Nessuna review di un altro provider viene attribuita a questo controllo.

## Verdetto

**Checklist tecnica eseguita: PASS nel perimetro sotto indicato. Nessun blocker tecnico individuato nel bundle.** La review non attesta QA operatore, review esterna post-hoc, provider reali o deploy; i rispettivi gate restano separati. In particolare OM §4, Regola B richiede di mantenere esplicite la QA operatore della categoria e la review esterna post-hoc prevista per la sostitutiva: questo documento non le trasforma in PASS.

## Identità immutabile e metodo

| Campo | Valore |
| --- | --- |
| Commit esaminato `raw@FULL_SHA` | `fb10709eddffaf8ce57cfba7e892618f0d2533df` |
| Parent | `e94d26a45a9dc1da152812995270d9726f556578` |
| File | `coordinate_converter Claude.html` |
| Blob Git | `fa8e7f5e38a201b5e87c470f8c9543cccaff7bfa` |
| SHA-256 raw Git | `1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a` |
| Byte | 11.108.273 |
| Diff bundle | Un solo file; **492 aggiunte, 87 rimozioni** |

Acquisito il raw con `git show FULL_SHA:path`, verificati parent/blob/SHA, letto l'intero diff Git. La lunga riga delle note è stata isolata e verificata separatamente: è aggiunta soltanto la nota Build 280 e il contenuto precedente è byte-identico. Le funzioni di contesto necessarie sono state lette dallo stesso raw Git. Nessun affidamento su un worktree mutable come identità del candidato.

Regola applicata: `docs/OPERATING_MEMORY.md`, §4, Regola B e checklist alle righe 111–133 nel parent. La nuova destinazione 443 è quella del pacchetto esplicitamente autorizzato dall'utente nella chat il 9 novembre; le altre differenze sono chiarite sotto.

## Checklist per categoria

| Categoria | Esito | Controllo effettivamente eseguito |
| --- | --- | --- |
| Lifecycle modale/dialog −/× | **N/A** | Il diff non modifica apertura, chiusura, attributi `aria-modal`, markup dei comandi −/×, selettori globali o CSS dei dialog. L'unico HTML modificato è la nota di rilascio. Non è pertinente una nuova matrice modale GIS/non-GIS. |
| Sanitizer e whitelist persistenti | **N/A per regressione di questi percorsi** | `gisSanitizeFeature`, `gisSanitizeFeatureArray`, `gisSanitizeLayerArray` e `savedTrackSanitizeElevationProfile` sono byte-identici alla base. Nessun allentamento dei loro type-check. Le nuove validazioni routing sono controllate nella riga dedicata sotto. |
| Nuovo campo persistito / storage / cache | **N/A** | Nessun campo persistito aggiunto. Dieci sezioni di persistenza/import/export/ripristino e le chiavi `coordconv_v2` / `coordconv_ui_v1` risultano identiche alla base. Nessuna nuova scrittura localStorage o IndexedDB nel diff. Il cambio origin crea storage separato, ma non è una migrazione di schema. |
| Nuovo create-path | **N/A** | `routingSubmitSaveAsTrack`, `routingPerformSaveAsTrack`, `savedTrackAddFromPoints` e `routingApplyRouteResultFromValidated` sono byte-identici. I risultati continuano attraverso il percorso esistente di creazione/salvataggio. Nessun nuovo percorso diretto di scrittura. La regressione save→reload→export→import richiesta per cambi a sanitizer/storage/create-path non viene dichiarata eseguita o necessaria per una categoria non modificata. |
| Rete, endpoint, proxy | **PASS tecnico con perimetro esplicito** | I resolver usano GH `/_routing/gh` e ORS `/ors` sul solo origin 443 esatto. Controllati hostname, origin e porta standard. Su HTTPS estraneo il resolver remoto restituisce vuoto e il gate rifiuta. Nessun nuovo sito di chiamata `fetch`, nessun nuovo canale WebSocket/XHR/beacon nel diff. I call site esistenti sono riconfigurati e rafforzati con controlli prima/dopo. |
| OPSEC, offline, consensi | **PASS tecnico** | OPSEC strict continua a precedere ogni eccezione locale. Offline blocca i provider remoti; l'eccezione loopback richiede il consenso già previsto e non viene estesa. Verificati resolver, preflight, POST e rivalutazione prima dell'accettazione del risultato. Nessun consenso nuovo implicito o bypass dei controlli origin. Le transizioni sono anche coperte dalle evidenze browser già eseguite. |
| GPS / rete implicita | **PASS tecnico** | Nessuna aggiunta di geolocalizzazione, `watchPosition` o `getCurrentPosition`. I nuovi resolver non effettuano richieste. Il resolver GH anticipato nel confronto rimane nel flusso esplicito `routingCompareStart`; non è introdotto un avvio autonomo alla navigazione. Lo stesso vale per il wrapper self-test, che registra funzioni e non invia richieste. |
| Controller, timeout e risultati stantii | **PASS tecnico** | La deadline ORS è unica per l'intero confronto e include body, andata/ritorno e seed del circuito. Interrompe il solo controller ORS, distingue annullamento volontario e timeout, controlla sequenza/fingerprint e cancella sempre il timer nel `finally`. Il risultato GH valido può restare disponibile. Sono stati letti i 15 risultati già eseguiti sullo SHA esatto, senza ripeterli. |
| No-ferry, metadati e snap | **PASS tecnico** | Richieste GH: esclusione FERRY con priorità zero, snap prevention e dettagli `road_environment`; ORS: aggiunta `ferries` ad `avoid_features` e richiesta `waytype`. Gli intervalli devono coprire in modo contiguo l'intera geometria; valori non ammessi o metadati assenti rifiutano la risposta. Snap richiesto/risposto verificato entro 50 m; corrispondenza ordinata sulla geometria GH e indici `way_points` ORS validati. Tutti i call site dei validator passano i punti richiesti. La risposta considerata non è salvabile quando fallisce una di queste guardie. |
| Anchor confermati e confronto | **PASS tecnico** | Il clone mantiene separati originali e coordinate di aggancio, omette snap null/vuoti e usa la riutilizzabilità esistente per profilo/provider. `confirm-required` e anchor stantii vengono bloccati. Entrambi i provider ricevono l'anchor condiviso accettato; ORS deve comunque rispettare la propria verifica di snap. Se GH non risponde, l'anchor in cache viene riusato solo con identità provider esplicita e coerente, mai dedotta dalla scelta auto. |
| Classificazione errori | **PASS tecnico** | Il generico 404 ORS non è più trasformato in prova di mancata connessione terrestre. Rimane l'errore GH specifico `ConnectionNotFoundException`; PointNotFound non è equiparato. Le risposte errate restano rifiutate. |
| I18N freeze | **PASS** | Tre sole nuove chiavi IT; nessuna nuova traduzione EN/FR. Letto `routingT`: il fallback italiano esiste già e copre le nuove chiavi. Note di rilascio e descrizione Build sono in italiano. |
| Integrità del resto | **PASS tecnico** | Un solo runtime HTML standalone, nessuna dipendenza o split. Nessuna modifica agli algoritmi geodetici; è corretto soltanto il riferimento del self-check Roma–Abidjan, con metodo Vincenty e soglia di 0,01 m. Nessun BOM; 192 CR isolati conservati. Nota precedente delle versioni preservata. |

### Provenienza e comportamento del ramo HTTPS 8443

Il supporto esatto `https://ionos-n8n-new.tailc01234.ts.net:8443` è **nuovo rispetto alla base 279/main** e proviene dallo staging recuperato. Non viene presentato come già presente in main.

La costante compare soltanto nella dichiarazione e nell'uguaglianza con `location.origin`. Il ramo si attiva esclusivamente quando il documento è già ospitato in quell'origin esatto; gli URL sono costruiti da `location.origin`. **Partendo dal 443 non esistono fallback, navigazioni o richieste verso 8443.** Il ramo usa GH `/_routing/gh` e ORS `/_routing/ors` soltanto nel documento 8443, conservando gli stessi controlli OPSEC/offline e di azione esplicita.

L'autorizzazione infrastrutturale corrente attiva soltanto 443. Questo runtime non installa listener, Tailscale Serve, ACL o servizi 8443. La compatibilità storica condizionale è distinta dall'attivazione del pacchetto: non è un ulteriore servizio distribuito o un nuovo destinatario contattato dal 443.

## Evidenze già esistenti, legate al medesimo SHA

Letti i manifest pubblicati in `docs/orchestrator/evidence/2026-11-09-gpt-routing-280`:

- Routing browser: **54/54 PASS**, zero page error; provider simulati.
- Timeout ORS: **15/15 PASS**. Produzione 20.000 ms; harness 25 ms. Funzioni reali del ciclo ORS, con UI, parte geospaziale e risultato GH simulati: non attribuita copertura superiore.
- Sintassi: **2/2 PASS**.
- QA geodetica: **2.112/2.112**, 96 invalidi rifiutati, UI geografica **24/24**. Questi risultati sono acquisiti, non rieseguiti da questo reviewer.

Le verifiche con provider reali e l'applicazione infrastrutturale appartengono ai rispettivi esecutori. Questo controllo non ne anticipa l'esito.

## Finding non bloccanti e limiti

1. **Provenienza 8443:** distinzione sopra; nessun collegamento automatico dal 443 osservato.
2. **Commento HTTP impreciso:** il commento del gate parla di “exact legacy HTTP origin”, ma il comportamento intenzionale preservato ammette le copie ospitate su HTTP in generale. Il codice non restringe HTTP a un solo hostname; questo non è un allentamento rispetto alla base, ma il report non deve sostenere una restrizione che non c'è.
3. **Export parziali preesistenti:** Esporta sessione ed Export GIS non costituiscono un backup totale o una migrazione senza perdite. Si veda la nota storage separata. Nessun cambiamento introdotto in queste funzioni e nessuna migrazione eseguita.

Nessun blocker tecnico è stato individuato nelle modifiche lette. Rimangono **QA operatore non eseguita** e **review esterna post-hoc non eseguita**. Questa review GPT non è una certificazione universale della cartografia o dell'assenza fisica di attraversamenti marittimi: il comportamento validato rifiuta i risultati che non soddisfano le evidenze richieste al provider.

## Artefatti

- `runtime.diff`: diff completo dal parent al commit esaminato.
- `unchanged-sensitive-paths.json`: confronto di nove funzioni sensibili byte-identiche.
- `storage-contract-comparison.json`: dieci sezioni e chiavi di persistenza byte-identiche.
- `review.json`: identità, checklist e requisiti residui in forma strutturata.

Nessun commit creato, runtime modificato, dato utente letto, servizio avviato o test già consumato ripetuto da questo reviewer.
