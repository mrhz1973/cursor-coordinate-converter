# P0 — roundtrip su Edge posseduto e requisito di portabilità

Base operativa: `0e65851ab15441e65bebfbf4244d2ef9aa7f25c4`. **Copie qualificate per il recupero selettivo (`COPIES_QUALIFIED_FOR_SELECTIVE_RECOVERY`)**: driver completato, tutte le 6 tracce e i 200 waypoint del candidato conservati strutturalmente in ogni fase e differenze residue interamente spiegate. Il candidato resta **PREPARED_NOT_APPLIED**. Il prossimo gate riguarda l’eventuale applicazione agli origin, fuori dallo scope della scelta A.

## Decisione operatore acquisita

**L’opzione A è accettata.** Il browser Edge posseduto e i componenti del catalogo già acquisito per la versione osservata rientrano nel perimetro operativo di fiducia descritto nel [rapporto precedente](../2026-11-21-driver-isolation-qualification/REPORT.md). La decisione supera l’attesa della scelta A/B; non costituisce un PASS retroattivo del driver e non trasforma in prove le informazioni tecniche rimaste non attestate.

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
