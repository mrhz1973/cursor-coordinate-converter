# Build 281 — dossier di deploy preparato, non eseguito

## Stato e limiti di questa preparazione

Questo dossier prepara il deploy del solo runtime della Build 281. **Non costituisce un GO** e non attesta pubblicazione, preflight VPS o deploy della Build 281. In questa preparazione non è stata aperta alcuna nuova connessione SSH né eseguito alcun comando sul server.

Il coordinatore comunicherà un GO esplicito soltanto dopo QA e review PASS, pubblicazione e verifica della HEAD remota. La HEAD comprenderà il commit runtime e un successivo checkpoint documentale. Gli script distinguono queste due identità e non seguono automaticamente eventuali avanzamenti successivi di `origin/main`.

| Identità | Valore vincolante |
|---|---|
| Repository | `mrhz1973/cursor-coordinate-converter` |
| Runtime | `coordinate_converter Claude.html` |
| Commit sorgente runtime | `0c0f6785654dbba279774bb8569788088f0762e9` |
| Blob runtime | `3dcff61081a2f461f8841953986ced17b058eab1` |
| SHA-256 runtime | `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62` |
| Dimensione e build | 11.108.861 byte, Build 281 |
| `expected_remote_head` | **Da fornire nel GO, con SHA Git completo di 40 caratteri** |
| SHA-256 di partenza ammesso | `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |
| Dimensione e build di partenza | 11.108.654 byte, Build 280 |

Le identità della Build 281 provengono dall'incarico del coordinatore. Il futuro preflight le verificherà negli oggetti Git della HEAD pubblicata. La baseline Build 280 deriva dal deploy PASS del 9 novembre 2026 alle 13:32:47 UTC, acquisito in `qa-gis-runtime-deployed-280/deployment-summary.json`: è un'evidenza storica e sarà ricontrollata integralmente al GO.

## Pacchetto e percorso operativo

- `runtime281-remote.py`: codice Python standard library eseguito sul VPS via stdin; fasi separate `preflight`, `apply` e `status`.
- `runtime281-launch-windows.py`: launcher per ASUSDESKTOP, con hash del codice remoto fissato, controllo del file candidato locale, identità SSH esistente e una sola connessione per invocazione.
- `ssh-readonly-proof.json`: trascrizione strutturata della connessione SSH di lettura già conclusa; non è un nuovo test.
- `syntax-and-static-checks.json`: verifiche locali del dossier, senza eseguire gli script.
- `artifact-manifest.json`: hash dei file preparati, escluso il manifest stesso.

Il pacchetto sarà copiato, dopo il GO, in una sottodirectory dedicata della workspace Windows già autorizzata, ad esempio:

```text
D:\ChatGPT\TMAR-GIS\work\gpt-audit-20261109-1a2a0a10\deploy-build281
```

Il launcher richiede il candidato locale già verificato dal coordinatore:

```text
D:\ChatGPT\TMAR-GIS\work\gpt-audit-20261109-1a2a0a10\runtime-281-e8bd8c1d.html
```

Questo file è utilizzato per la verifica locale dell'identità del candidato. Il contenuto distribuito sul VPS proviene dal fast-forward della HEAD Git approvata; il launcher non sovrascrive il runtime mediante copia diretta.

## Accesso SSH già provato

La connessione precedente da ASUSDESKTOP ha completato `id -un`, restituendo `root`, con exit code 0. Il processo Desktop Commander 72180 è concluso. L'esito è stato recuperato dal registro della stessa chiamata dopo un troncamento della risposta; non è stata ripetuta la connessione.

Il client è `C:\WINDOWS\System32\OpenSSH\ssh.exe`. La configurazione esistente `ionos-n8n-new` seleziona `C:\Users\mrhz\.ssh\ionos_n8n_vps`, con `IdentitiesOnly=yes`. Destinazione, utente e porta vengono comunque fissati nelle opzioni: `31.70.139.73`, `root`, `22`. Il vecchio alias non viene utilizzato.

Le connessioni operative richiedono `BatchMode=yes`, `StrictHostKeyChecking=yes` e `UpdateHostKeys=no`; non accettano nuove host key e non richiedono password interattive. Non vengono attivati agent forwarding, tunnel, comandi locali SSH o connessioni master. Le chiavi non vengono lette o esportate dal codice: il client SSH usa l'identità già configurata.

## Sequenza dopo il GO

### 1. Congelare l'identità autorizzata

L'esecutore acquisisce dal GO la HEAD remota completa e verifica gli hash del pacchetto trasferito. Il launcher richiede `--go-remote-head` per entrambe le fasi operative. Il valore non viene dedotto da `main` né sostituito con il solo commit sorgente runtime.

Le invocazioni seguenti sono **modelli da completare soltanto dopo il GO**. I segnaposto non sono commit o percorsi validi per lo script.

```powershell
python runtime281-launch-windows.py --phase preflight --go-remote-head HEAD_COMPLETA_DAL_GO
```

Il launcher genera e registra nel proprio `intent.json` un percorso backup univoco prima della connessione. Il percorso viene passato anche al VPS:

```text
/var/backups/goi-gis-runtime/<timestamp-UTC-con-microsecondi>-build281
```

Questa identità permette di recuperare il risultato della stessa transazione anche se la connessione cade prima della risposta finale. Il processo asincrono Desktop Commander deve essere seguito fino alla conclusione.

### 2. Preflight fresco e backup

Il preflight richiede il clone canonico `/root/local-files/handoff-runtime/cursor-coordinate-converter`, branch `main`, worktree completamente pulito e origine del repository canonico. Il runtime presente sul disco deve corrispondere esattamente a SHA, byte e numero della Build 280.

Verifica quindi `git ls-remote origin refs/heads/main`, esegue un fetch circoscritto senza force e confronta `FETCH_HEAD`, `origin/main` e un secondo `ls-remote` con la sola HEAD indicata nel GO. Il commit di partenza deve essere suo antenato.

Il commit sorgente `0c0f678…` deve essere antenato della HEAD approvata. Il blob del runtime nella sorgente e nella HEAD deve essere esattamente `3dcff610…`; SHA-256, dimensione e Build 281 devono coincidere. Il delta sorgente→HEAD può contenere soltanto documentazione in `docs/`; il delta clone→HEAD può contenere soltanto il runtime e documentazione in `docs/`.

Prima del backup vengono acquisiti:

- hash esatti delle sei configurazioni dell'infrastruttura HTTPS applicata e già documentata;
- stato active, substate e PID di Nginx, gateway ORS, proxy HTTPS e servizio GIS;
- indirizzi e PID dei listener condivisi sulle porte 443, 8020, 18080, 8989, 8089 e 8099;
- HTTP 200 e identità completa della Build 280 sia su HTTP 8000 sia su HTTPS `/gis`, con verifica TLS normale;
- status, hash, dimensione, content type e CORS di ORS con il vecchio e il nuovo Origin, catalogo e VPS.

La directory backup viene creata con accesso 0700 e proprietà root; il runtime precedente viene salvato con accesso 0600, scrittura esclusiva e fsync. Il registro `state.json` viene scritto in modo atomico. Directory o file preesistenti inattesi non vengono sovrascritti. La validità temporale del preflight è di dieci minuti, oltre ai controlli ripetuti immediatamente prima della mutazione.

Un errore di baseline, una differenza infrastrutturale, un'origine inattesa o un commit remoto diverso provoca STOP. Lo script non cerca di correggere questi casi.

### 3. Applicazione del runtime

Dopo `PREFLIGHT_PASS`, usare esattamente la directory backup restituita e la stessa HEAD del GO:

```powershell
python runtime281-launch-windows.py --phase apply --go-remote-head HEAD_COMPLETA_DAL_GO --backup-directory DIRECTORY_ESATTA_DEL_PREFLIGHT
```

Prima della mutazione vengono nuovamente verificati pulizia e HEAD del clone, HEAD remota, candidato, runtime precedente, backup, servizi, listener, configurazioni ed endpoint. Un lock sul clone impedisce due fasi concorrenti dello stesso applicatore.

La mutazione consiste esclusivamente in:

1. `git merge --ff-only --no-edit` della HEAD esplicitamente autorizzata;
2. verifica del runtime su disco, del blob e del clone pulito;
3. `systemctl restart goi-gis-app.service`.

I comandi Git disabilitano gli hook soltanto per la singola invocazione; non modificano configurazioni persistenti. Gli aggiornamenti di documentazione nel clone sono conseguenza del fast-forward; non producono modifiche operative all'infrastruttura.

### 4. Prova del risultato e invarianti

Il PASS richiede HTTP 200, Build 281, 11.108.861 byte e SHA-256 `e8bd8c1d…` su entrambi gli endpoint:

```text
http://100.99.54.93:8000/coordinate_converter%20Claude.html
https://ionos-n8n-new.tailc01234.ts.net/gis
```

La verifica HTTPS usa il trust store normale e controlla il nome del server. Redirect, contenuto diverso e incongruenze del numero build non vengono accettati. Dopo il restart è ammessa una breve attesa solo per indisponibilità di trasporto o risposta temporanea 502/503/504.

Il servizio GIS deve risultare active con un nuovo PID. Gli altri servizi devono mantenere stato e PID identici alla baseline; listener condivisi, sei configurazioni ed endpoint ORS/catalogo/VPS devono essere identici. La HEAD locale deve essere la HEAD del GO e il clone deve essere pulito sul branch `main`.

Soltanto allora il registro passa a `DEPLOY_PASS`. Nessuna chiamata POST ai provider viene effettuata. La QA browser postdeploy rimane un gate separato, da aprire tramite il coordinatore.

## Errori, rollback e risultati incerti

L'intento di ogni mutazione viene registrato prima dell'azione. Il registro contiene le fasi, le prove, i codici di ritorno e gli hash degli output dei comandi; non salva contenuti di credenziali o chiavi.

Se l'applicazione fallisce, lo script può tornare al commit iniziale soltanto quando la HEAD e il worktree coincidono con uno degli stati esatti della transazione e il runtime ha l'hash atteso. In presenza di file modificati o di una HEAD estranea si ferma senza usare reset, clean, force o sovrascritture.

Se la HEAD approvata è già stata applicata, il rollback usa `git switch --detach` del commit iniziale, riavvia soltanto GIS e verifica la Build 280 su HTTP e HTTPS, oltre agli stessi invarianti di configurazioni, servizi, listener ed endpoint. `ROLLED_BACK_TO_280` indica quindi anche che il clone è rimasto intenzionalmente detached; l'eventuale riallineamento del branch richiede una valutazione separata, senza forzature automatiche.

Se il fast-forward non ha prodotto alcuna modifica al runtime e nessun restart è stato tentato, vengono verificate le condizioni iniziali e registrato `DEPLOY_STOPPED_NO_RUNTIME_CHANGE`, senza un restart superfluo. Qualsiasi verifica di rollback non riuscita produce `ROLLBACK_INCOMPLETE_REQUIRES_REVIEW`.

Una caduta della connessione, un timeout del launcher o un risultato non decodificabile non autorizzano a ripetere l'applicazione. Il launcher salva `REMOTE_OUTCOME_UNKNOWN_DO_NOT_RETRY`. Usare l'identità della transazione già registrata sul PC per leggere il registro esistente:

```powershell
python runtime281-launch-windows.py --phase status --backup-directory DIRECTORY_ESATTA_REGISTRATA_NELL_INTENT
```

La fase `status` non esegue fetch, controlli HTTP, restart o modifiche. Se un'altra fase ha ancora il lock, segnala che la transazione è in esecuzione. Se il registro non esiste, questa assenza deve essere interpretata insieme al processo originale e al suo output; non equivale automaticamente a prova di mancata esecuzione. Nessun rilancio viene effettuato dal codice.

## Perimetro dell'autorizzazione

Questa consegna autorizza soltanto la preparazione dei file locali. Il preflight e la mutazione rimangono subordinati al futuro GO specifico del coordinatore, con HEAD pubblicata e verificata.

Il deploy previsto non modifica Nginx, ORS, proxy HTTPS, routing dei provider, Tailscale, DNS, certificati, firewall, account, chiavi o altri servizi. I file del pacchetto infrastrutturale HTTPS non vengono riapplicati; nessun servizio condiviso viene riavviato. In caso di drift il flusso si ferma e riferisce il dato osservato.

## Fonti e data

Preparazione: **9 novembre 2026**. Identità del candidato e separazione fra commit runtime e HEAD documentale: messaggi del coordinatore del 9 novembre 2026. Baseline e percorsi: prove autonome del deploy Build 280 del 9 novembre 2026. Accesso SSH: processo 72180 del 9 novembre 2026, con timestamp `16:28:46` riportato dal registro locale del tool; nessuna conversione di fuso è attribuita a quel campo.
