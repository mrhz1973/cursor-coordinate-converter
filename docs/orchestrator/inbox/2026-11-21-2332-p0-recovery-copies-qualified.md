# Handoff — P0 recupero qualificato sulle copie e portabilità GIS

> Report del pass; FRONTIER rimane l’unica LIVE STATE. Esecutore effettivo: ChatGPT tramite TMAR Desktop Commander. Implementazione e review delegate; nessun pass Cursor eseguito e nessun dispatch di un nuovo task Cursor.

Redazione: 2026-11-21T23:32:27+01:00 (Europe/Rome). Prova Git acquisita dopo il push del task, prima di questo autosync.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| **BLOCK** | GIS-HTTP-ORIGIN-INVENTORY-P0 |
| **GATE** | APPLICATION_SCOPE_DECISION_PENDING; COPY_RECOVERY_QUALIFIED. A acquisita e problema del driver risolto. |
| **NEXT** | Definire l’applicazione selettiva all’archivio HTTPS: +1 traccia HTTP di 11 punti e +200 waypoint, preservando i dati HTTPS. Prima di eventuali scritture: attualità, backup aggiornato e collisioni. Nessun nuovo gate Edge. |
| **Runtime LIVE** | Build317 secondo FRONTIER; P3 CLOSED già attestato. Nessun nuovo probe VPS o deploy in questo pass. |
| **Candidate FULL SHA** | Nessun nuovo candidato runtime. Candidato dati 2cbf48cea7f6baef931018185f031d244f56ba9223924f0cda567c0c983bf865, qualificato sulle copie e NON APPLICATO. |
| **Build / ID / blob** | Build317 / aff215323c97a309cbd5c6c7e0c694d35dd45ad0 / 4578788467822123ea7ad7e929d3bdf0e262b1a8. |
| **Deployed state** | Invariato nel perimetro del pass. |
| **Result Cursor** | N/A — pass ChatGPT/TMAR. Un pilot sintetico, un roundtrip privato e una classificazione offline completati, exit0. |
| **Product direction** | Portabilità Windows/macOS/browser desktop/mobile/iPad; lavoro mobile di compatibilità riaperto. Nessun PASS universale attribuito. |
| **Working tree** | CLEAN al task pubblicato, prima del container autosync. |

### Identità SHA non autoreferenziali

| Nome | Valore |
| --- | --- |
| **RUNTIME_CANDIDATE_SHA** | N/A — nessuna modifica runtime. |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | d1dd339490a5c04067ccde7fa42d4f50a74bd488 |
| **docs/report HEAD** | PENDING_SELF_REFERENCE |
| **real_task_commit** | d1dd339490a5c04067ccde7fa42d4f50a74bd488 |
| **previous_report_container** | 0e65851ab15441e65bebfbf4244d2ef9aa7f25c4 |
| **current_report_container** | PENDING_SELF_REFERENCE |
| **final_remote_head_after_report_push** | EXTERNAL_ONLY |

Evidence puntata: `docs/orchestrator/inbox/2026-11-21-2332-p0-recovery-copies-qualified.md`. [Rapporto task](https://github.com/mrhz1973/cursor-coordinate-converter/blob/d1dd339490a5c04067ccde7fa42d4f50a74bd488/docs/orchestrator/evidence/2026-11-21-edge-owned-roundtrip/REPORT.md) · [Ricevute e classificazione](https://github.com/mrhz1973/cursor-coordinate-converter/blob/d1dd339490a5c04067ccde7fa42d4f50a74bd488/docs/orchestrator/evidence/2026-11-21-edge-owned-roundtrip/evidence.json) · [FRONTIER al task](https://github.com/mrhz1973/cursor-coordinate-converter/blob/d1dd339490a5c04067ccde7fa42d4f50a74bd488/docs/FRONTIER.md).

## B. RIEPILOGO COMPLETO

# P0 — roundtrip su Edge posseduto e requisito di portabilità

Base operativa: `0e65851ab15441e65bebfbf4244d2ef9aa7f25c4`. **Copie qualificate per il recupero selettivo (`COPIES_QUALIFIED_FOR_SELECTIVE_RECOVERY`)**: driver completato, tutte le 6 tracce e i 200 waypoint del candidato conservati strutturalmente in ogni fase e differenze residue interamente spiegate. Il candidato resta **PREPARED_NOT_APPLIED**. Il prossimo gate riguarda l’eventuale applicazione agli origin, fuori dallo scope della scelta A.

## Decisione operatore acquisita

**L’opzione A è accettata.** Il browser Edge posseduto e i componenti del catalogo già acquisito per la versione osservata rientrano nel perimetro operativo di fiducia descritto nel [rapporto precedente](https://github.com/mrhz1973/cursor-coordinate-converter/blob/d1dd339490a5c04067ccde7fa42d4f50a74bd488/docs/orchestrator/evidence/2026-11-21-driver-isolation-qualification/REPORT.md). La decisione supera l’attesa della scelta A/B; non costituisce un PASS retroattivo del driver e non trasforma in prove le informazioni tecniche rimaste non attestate.

Il nuovo strumento deve riconciliare il perimetro accettato e fermarsi in presenza di accessori o cambiamenti non qualificati. L’accettazione non si estende automaticamente a qualsiasi futura voce del catalogo. Non vengono richieste ulteriori approvazioni per i passaggi sulle copie già compresi nel mandato, una volta superati i gate tecnici previsti.

## Prodotto e ambiente di prova

**Il GIS deve funzionare su Windows, macOS, browser desktop e mobile, compreso iPad.** Edge è soltanto l’infrastruttura scelta per questo pass di verifica: non limita le piattaforme del prodotto.

Versione e catalogo Edge vincolati identificano questa prova riproducibile: non sono requisiti per usare il GIS e non istituiscono una richiesta di approvazione per ogni futuro computer o browser. La scelta A risolve il criterio operativo attuale; la compatibilità estesa del prodotto resta un requisito da verificare concretamente.

Il nuovo ordine dell’operatore supera la precedente pausa mobile. Il lavoro di compatibilità mobile è quindi riaperto, mentre gli esiti per ciascun sistema e browser restano da verificare. Questa decisione non crea una Build318 e non attesta compatibilità universale. Restano vincolanti HTML standalone, vanilla JS, assenza di GPS silenzioso, modalità offline/OPSEC strict e consenso esplicito per la rete.

Un controllo statico mirato della copia Build317 già qualificata non ha rilevato vincoli espliciti Edge/Windows nei guard cercati. L’accesso diretto a `navigator.userAgent` serve alla diagnostica (righe 77685–77691); non sono emerse occorrenze di `navigator.platform`, `showOpenFilePicker` o `showSaveFilePicker`. I percorsi acquisiti usano input file, FileReader e download tramite Blob/object URL/attributo download (righe 14115–14125, 35824–35837, 32837–32844). Sono presenti regole CSS per viewport mobile e safe-area (12740–12746). Questo controllo limitato a 15 contesti non certifica tutti i browser, le API o i comportamenti mobili; non ha modificato il runtime né eseguito nuove prove. Un lieve troncamento dell’output ha coinvolto note storiche, escluse dalle evidenze utilizzate.

## Lavoro autorizzato e sequenza

Il pass ha completato la qualificazione sulle copie necessaria al recupero selettivo, con runtime Build317 invariato. Il candidato esistente resta **PREPARED_NOT_APPLIED**: 6 tracce e 200 waypoint, ottenuti conservando le 5 tracce HTTPS e aggiungendo la traccia HTTP di 11 punti e i 200 waypoint HTTP.

La sequenza autorizzata è stata eseguita:

1. Delta minimo dello strumento preparato e revisionato.
2. Pilota sintetico completato con due bracci separati, baseline e candidato, e quattro fasi: caricamento iniziale, primo salvataggio, ricaricamento senza reiniezione, secondo salvataggio.
3. Completamento del driver, cambiamenti della baseline e conservazione del candidato valutati separatamente.
4. Stessa verifica completata sulle copie GIS già autorizzate, dopo i gate richiesti e senza un’ulteriore richiesta di «vai».

Una differenza o un errore deve produrre un finding concreto; il completamento del processo da solo non dimostra conservazione dei dati. Origini e profili personali restano intatti: applicazione dei dati, migrazione e pulizia non rientrano in questo pass.

## Esito sintetico acquisito

Il nuovo pilota sintetico è terminato con **exit 0**, PID 34308, il **21 novembre 2026 dalle 22:11:28.290 alle 22:11:32.415 UTC**. Entrambi i bracci hanno completato le quattro fasi, con seed verificato, ricaricamento senza reiniezione e input invariati. Non sono stati registrati errori JavaScript, target inattesi o dialoghi.

Lo strumento eseguito, 39968 byte, ha SHA256 `85648ee540851ce587cc12f53b9c7f44aec1a58a2078ee1067db8d43ea6f381a` e review statica **PASS**. La ricevuta sintetica misura 18651 byte, SHA256 `0f1bfea51aebc28d48e25073058a7465353382d945b3c7fc3b1806748f3a66e4`.

Il completamento procedurale è attestato. La fixture presenta un cambiamento iniziale del main da **4 a 14 proprietà**, con `selectedRecordsPreservedAtEveryObservedPhase: false`. Dopo il primo salvataggio, tutti i confronti raw `save1 → reload` e `save1 → save2` risultano identici. Questo documenta stabilità successiva al primo salvataggio, **non un PASS globale di conservazione dei dati iniziali**.

## Esito sulle copie GIS reali

Con lo stesso strumento è stato completato il roundtrip reale, **exit 0**, PID 11436, il **21 novembre 2026 dalle 22:13:29.493 alle 22:13:34.839 UTC**; il footer nativo è acquisito alle **22:13:45.8873832Z**. La ricevuta, copiata esattamente da quella nativa, misura 18662 byte e ha SHA256 `62ee2ca63078314e4e68df07228f49c034055b5ae1c2077b787734de0519d259`.

Entrambi i bracci hanno completato le quattro fasi. Seed verificato, sua rimozione e ricaricamento senza reiniezione risultano corretti; gli input sono rimasti invariati. Non sono stati registrati errori JavaScript, target inattesi o dialoghi.

**Tutte le 6 tracce e i 200 waypoint del candidato coincidono strutturalmente con gli originali in ciascuna fase osservata**, così come le 5 tracce della baseline. Il controllo `selectedRecordsPreservedAtEveryObservedPhase` è true. Dopo il primo salvataggio, i confronti raw verso ricaricamento e secondo salvataggio sono identici in entrambi i bracci.

Il confronto dell’intero main e quello della proiezione relativa non sono integralmente uguali: risultano differenze nelle impostazioni di entrambi i bracci e negli altri campi del main del candidato. La classificazione successiva, descritta sotto, ha spiegato tutte queste differenze usando gli snapshot esistenti, senza ripetere il roundtrip.

Il problema procedurale del driver Edge è superato per questa prova; il prodotto Build317 resta invariato.

## Classificazione conclusiva delle differenze

Il classificatore `875a9205…`, 14550 byte, con review statica **PASS**, è stato eseguito una sola volta, PID 32972, **exit 0**. Il risultato è acquisito il **21 novembre 2026 alle 22:24:06.150 UTC**, con footer nativo alle **22:24:06.1839921Z**. La ricevuta misura 17121 byte, SHA256 `ca9ab7f4fcb247aff6c8495b74592a7fc8d4fb43eed1fcb63d1a9eb565eb2d7c`.

L’esito `allObservedDriftExplained: true` si fonda su due cambiamenti circoscritti:

- In tutte e quattro le fasi, entrambi i bracci aggiungono **esattamente 18 preferenze delle tabelle**. Le **40 impostazioni preesistenti restano invariate**; le 58 risultanti sono identiche fra baseline e candidato.
- Nel candidato viene ricostruito **un solo array `featureIds` di `gisLayers`**, coerente esattamente con i 200 ID canonici dei waypoint nello stesso ordine. Le altre proprietà dei layer e tutti gli altri campi del main restano preservati.

Differenze sconosciute: **zero**. Input invariati; nessun nuovo avvio del browser o riesecuzione del runtime. È quindi attestato il **PASS di conservazione dei record** e sono qualificate le copie per il recupero selettivo. I flag originari `losslessStructuralPreservationAtEveryObservedPhase` e `relativeProjectionEqualAtEveryObservedPhase` restano false: registrano le differenze effettive nell’intero stato e non vengono forzati per rappresentare la qualificazione.

## Stato dei passaggi

| Passaggio | Stato corrente |
| --- | --- |
| Decisione A | ACCETTATA |
| Requisito di portabilità e riapertura mobile | ACQUISITI; compatibilità specifica da verificare |
| Delta dello strumento e review | REVIEW STATICA PASS sulla versione eseguita |
| Pilota sintetico, due bracci e quattro fasi | COMPLETATO, exit 0 |
| Valutazione dei confronti sintetici | Drift iniziale registrato; stabilità successiva attestata |
| Roundtrip sulle copie GIS | COMPLETATO, exit 0, due bracci e quattro fasi |
| Conservazione delle raccolte GIS reali | PASS strutturale: 6 tracce e 200 waypoint a ogni fase; anche le 5 tracce della baseline conservate |
| Classificazione di impostazioni e altri campi del main | COMPLETATA: tutte le differenze spiegate, zero sconosciute |
| Qualificazione delle copie per recupero selettivo | PASS; candidato PREPARED_NOT_APPLIED |
| Applicazione agli origin personali | NON ESEGUITA; fuori scope |

## Prossimo gate effettivo

Resta il **gate applicativo reale**: verificare attualità delle sorgenti e della destinazione, backup e collisioni prima di un’eventuale applicazione. La copertura del backup completo dell’origin è ancora parziale (`completeOriginBackup: false`). Questi aspetti non sono risolti dal roundtrip sulle copie.

Il candidato non è stato applicato. Le scritture sugli origin, la migrazione e la pulizia restano fuori dallo scope della scelta A. Nessun nuovo vincolo Edge o consenso per l’uso del GIS su futuri computer/browser deriva da questo gate; la compatibilità estesa resta il requisito di prodotto riaperto dall’operatore.

### Review e pubblicazione del pass

Review statica indipendente PASS per runner e classificatore; review interpretativa delle ricevute PASS entro il perimetro documentato. Review documentale finale idb_verify PASS sul REPORT 0b232812e42fa7f5e755e1632602b8969227889f39870b465b5bf991d8df45bd, su FRONTIER e sulle conclusioni delle evidenze. Nessuna nuova prova richiesta. Cinque file docs-only nel task; runtime invariato. Il publisher nativo ha verificato commit, tree, runtime blob, remote/tracking e working tree pulita prima di questa sincronizzazione.

## C. OUTPUT GIT — pre-container

### git log --oneline -5

```text
d1dd339 docs(p0): qualify recovery copies and record portable GIS scope
0e65851 docs(p0): autosync driver trust boundary handoff
2ab7df4 docs(p0): record browser catalog and trust boundary decision
586a9bd docs(p0): autosync selective recovery driver gate report
c8bc308 docs(p0): preserve selective candidate and record isolated driver gate
```

### git rev-parse HEAD

```text
d1dd339490a5c04067ccde7fa42d4f50a74bd488
```

### git rev-parse origin/main

```text
d1dd339490a5c04067ccde7fa42d4f50a74bd488
```

### git branch --show-current

```text
main
```

### git ls-remote origin refs/heads/main

```text
d1dd339490a5c04067ccde7fa42d4f50a74bd488	refs/heads/main
```

### git status --porcelain=v1

```text
```

### git show --format= --stat HEAD

```text
 docs/FRONTIER.md                                   |   32 +-
 .../2026-11-21-edge-owned-roundtrip/REPORT.md      |   84 +
 .../classify-roundtrip-drift.cjs                   |  184 ++
 .../2026-11-21-edge-owned-roundtrip/evidence.json  | 2113 ++++++++++++++++++++
 .../roundtrip-runner.cjs                           |  649 ++++++
 5 files changed, 3053 insertions(+), 9 deletions(-)
```

### git show --format= --name-only HEAD

```text
docs/FRONTIER.md
docs/orchestrator/evidence/2026-11-21-edge-owned-roundtrip/REPORT.md
docs/orchestrator/evidence/2026-11-21-edge-owned-roundtrip/classify-roundtrip-drift.cjs
docs/orchestrator/evidence/2026-11-21-edge-owned-roundtrip/evidence.json
docs/orchestrator/evidence/2026-11-21-edge-owned-roundtrip/roundtrip-runner.cjs
```

## HISTORY

Base di questo pass e precedente report-container: `0e65851ab15441e65bebfbf4244d2ef9aa7f25c4`. La decisione A dell’operatore e il nuovo requisito di portabilità superano l’attesa A/B e la pausa mobile riportate in quel container. Task reale pubblicato: `d1dd339490a5c04067ccde7fa42d4f50a74bd488`. Il precedente [report-container](https://github.com/mrhz1973/cursor-coordinate-converter/blob/0e65851ab15441e65bebfbf4244d2ef9aa7f25c4/docs/runtime/LAST_CURSOR_REPORT.md) resta consultabile come storico.

## LIMITI DEL REPORT

Le conclusioni riguardano gli snapshot acquisiti e la selezione di recupero esaminata. Non attestano attualità dei browser originali, backup completo dell’origine, applicazione dei dati, identità raw dell’intero stato o compatibilità universale. Le impostazioni preesistenti e i record sono conservati; le differenze di preferenze tabellari e indice waypoint sono classificate, non eliminate dai confronti.

Questo container non contiene il proprio SHA né la verifica remota successiva al proprio push. La prova finale resta EXTERNAL_ONLY nella chat e negli artefatti locali di verifica; nessun terzo commit di finalizzazione è previsto.
