# P0 — osservazioni del catalogo e decisione sul confine di fiducia

**21 novembre 2026; tutti gli orari sono UTC.** Base operativa GitHub: `586a9bdc716055272d6dcac69c61bb07be643908`. Fonti operative: [evidence.json](evidence.json), ricevute native aggregate e riferimenti primari indicati sotto. Il mandato «vai» riguarda la qualificazione del driver sulle copie; non autorizza applicazione agli origin, migrazione o pulizia.

## 1. Stato corrente

Restano **`DRIVER_ISOLATION_NOT_QUALIFIED`** e **`WAIT_TRUST_BOUNDARY_DECISION`**. Due nuove osservazioni native sono terminate con exit 0: una del catalogo nel browser posseduto, una offline sul catalogo acquisito. Il loro stato è `OBSERVATION_COMPLETED_REQUIRES_ASSESSMENT`, non PASS di isolamento.

Build317/P3 resta CLOSED. Non sono stati letti runtime GIS o dati GIS reali, trasmessi seed, modificati runtime, estensioni, policy o protezioni, effettuati deploy o ripetuti QA151. Il candidato SHA256 `2cbf48cea7f6baef931018185f031d244f56ba9223924f0cda567c0c983bf865` conserva lo stato **`PREPARED_NOT_APPLIED`**; non è stato ricreato o riesaminato in questo pass. Nuovo pilota sintetico e roundtrip privato: **`NOT_STARTED`**.

Il precedente runner `e5996173…`, il suo STOP sintetico e la diagnostica `97908f68…` rimangono evidenze distinte nel [dossier precedente](../2026-11-21-selective-recovery-roundtrip/REPORT.md). I nuovi risultati non li trasformano retroattivamente in PASS.

## 2. Esecuzioni effettivamente acquisite

Il prerequisito di sessione è attestato alle **20:58:42.2309395Z**: repository nativo pulito alla base indicata, Node `v26.8.1`, Edge `157.0.4341.60`. Oltre a tale prerequisito, sono state eseguite le due osservazioni seguenti dal root, unico esecutore nativo.

| Osservazione | Intervallo UTC | Processo / esito |
| --- | --- | --- |
| Catalogo browser | 21:17:53.728–21:17:55.115 | PID 16892, exit 0 |
| Metadati dei percorsi | 21:31:27.588–21:31:28.013 | PID 52688, exit 0 |

Il primo strumento, SHA256 `501debbafec870f71c8444226a4d2106b99308c7f32ca90cf2d29082ec70776d`, 28500 byte, aveva review statica PASS. Ha effettuato **una sola navigazione** a `edge://extensions-internals/`, senza fallback, su profilo nuovo posseduto. File DevTools, argv del profilo e PID del browser sono stati verificati; nessun flag aggiuntivo rispetto alla diagnostica congelata e nessun flag di disabilitazione della sandbox.

La chiusura del solo browser posseduto è osservata, exit 0; il profilo è conservato. Il proxy senza inoltro ha negato 1 richiesta HTTP e 7 CONNECT. I contatori Fetch della pagina pari a zero non significano assenza globale di tentativi di rete. I raw del catalogo e dei target restano privati sul PC.

## 3. Catalogo corrente: fatti e portata

Il catalogo contiene **10 record**, 10 identificativi unici, zero record malformati o ID duplicati. Tutti riportano location `COMPONENT`; 8 tipi sono `TYPE_EXTENSION`, 2 restano **`UNINTERPRETED`**. Nessun tipo ulteriore è stato indovinato.

In ciascuno snapshot, prima e dopo la navigazione, risultano 3 `service_worker` e 4 `background_page` di classe `EXTENSION`. **Tutti e 7 hanno corrispondenza univoca nel catalogo**, senza mancanti o ambiguità. La pagina tecnica passa da `ABOUT_BLANK` a `EDGE_INTERNAL`. Le acquisizioni non sono atomiche; queste corrispondenze non ricostruiscono i target della diagnostica storica né la causa dei suoi eventi.

I permessi attivi presentano **57 voci API e 5 voci explicit-host**: sono somme di voci osservate, non 57 capacità o 5 host distinti. Gli altri array attivi esaminati sono vuoti; anche i gruppi withheld e optional risultano vuoti. I contenitori tab-specific sono oggetti senza insiemi registrati. Questi metadati non costituiscono una dimostrazione di innocuità o di tutte le capacità effettive.

Il raw acquisito misura **19594 byte**, SHA256 `00888441d1c8be3a355daf53f90afee144886bfb0388c9c6ed573ccf08b57f12`. La ricevuta del primo strumento misura 8837 byte, SHA256 `4c5e0670b41265f38d68964a3a7123850ef94f1f7e629452b5f617183abbc302`.

## 4. Percorsi: il secondo lettore chiarisce il limite del primo

Il primo observer aveva classificato tutti i percorsi come `BROWSER_PATH_RESOLUTION_NOT_OBSERVED`, senza conservare il codice dell’errore. Il lettore successivo usa esclusivamente quel catalogo vincolato per dimensione/hash, rimasto invariato. La lettura riguarda solo metadati: nessun avvio di browser, lettura di contenuti sotto Edge, elenco di directory, consultazione di firme/policy o modifica degli accessi.

I **10 percorsi distinti** ricadono lessicalmente sotto installazione e versione osservata 157. Sono stati pianificati **13 nodi**: 2 hanno metadati e risoluzione riusciti; 1 antenato risulta mancante, con HRESULT `-2147024894`, Win32 **2**, e `ENOENT`/errno **-4058** per lstat e realpath. I 10 discendenti vengono fermati dall’antenato: operazioni Node **`NOT_ATTEMPTED`**, non dieci errori ENOENT indipendenti.

Non sono osservati reparse point o link nei nodi esaminati; questo dato non si estende ai discendenti non attraversati. La rilevazione non è atomica. **Virtualità dei percorsi non provata**; nessuna deduzione di compromissione o di assenza dei componenti.

## 5. Cosa consentono le fonti primarie

La sorgente Chromium di `extensions-internals` restituisce un array JSON come `text/plain`, ricavato dal registro installato, con percorso, location, tipo e gruppi di permessi. Il registro upstream comprende anche stati diversi da enabled: supera il solo elenco dei target attivi, ma l’equivalenza completa con Edge157 non è attestata.

`ComponentLoader` può leggere il manifest dal ResourceBundle, comporre la radice rispetto a `DIR_RESOURCES` e registrare manifest/radice come componente. Il resource manager risolve percorsi mediante tabelle compilate percorso→resource ID, senza realpath nel ramo acquisito. Il modello è compatibile con risorse incorporate e radici logiche; **non identifica un `.pak` o il pacchetto dei dieci record locali**. La firma del solo eseguibile non completerebbe il legame record→manifest/registrazione→mapping della build→contenitore.

Restano `NOT_OBSERVED`: enabled per record, incognito effettivo, policy applicate, manifest completo e firma del publisher. Restano `NOT_ATTESTED`: proprietà del pacchetto, completezza oltre la superficie presentata dal browser ed equivalenza upstream/Edge. `componentAdmission` resta **`NOT_GRANTED`**. Nessun componente è ammesso dalla sola etichetta, URL, browserContext o collocazione lessicale.

## 6. Decisione richiesta: due opzioni circoscritte

**A — Accettare un confine operativo di fiducia.** Includere nel software fidato (TCB) l’Edge posseduto e i componenti del catalogo acquisito per la versione osservata, mantenendo espliciti i limiti sopra indicati. È una scelta di fiducia sul perimetro concreto, non una prova nuova di provenienza né una garanzia di isolamento dai componenti inclusi. Non ammette automaticamente future voci `COMPONENT`. Il successivo delta deve riconciliare il perimetro accettato e fermarsi sugli accessori non qualificati.

**B — Definire un ambiente separato.** Specificarne disponibilità, confini, protezioni e successiva qualificazione. Nessuna installazione o creazione di VM è autorizzata o eseguita da questo pass. Un ambiente separato non eredita un PASS del driver.

Nessuna delle due opzioni è stata selezionata dalle ricevute. La scelta **non vale come PASS retroattivo** e non sostituisce i gate tecnici.

## 7. Sequenza successiva, subordinata alla decisione

Dopo la scelta occorrono il delta minimo del driver, review e pilota nativo esclusivamente sintetico, con HTML e fixture già vincolati, due bracci e quattro fasi previste. Restano richiesti binding, relazioni osservabili dei target, rispetto del confine dati accettato, rete negata, GPS denied, protezioni preservate e distinzione tra seed inviato, acknowledgement ed esecuzione verificata. Completamento procedurale, drift della baseline e conservazione del candidato restano separati.

**Dopo il PASS dei gate richiesti, le prove sulle copie già comprese nel mandato proseguono senza conferme aggiuntive.** Applicazione agli origin, migrazione e pulizia restano escluse. Nessun ulteriore run viene attestato da questo rapporto.

## 8. Riferimenti e finding di metodo

Fonti consultate il **21 novembre 2026**; righe riferite al testo web acquisito. I riferimenti Chromium mobili non sono pin del binario Edge.

- [Extensions internals](https://chromium.googlesource.com/chromium/src.git/+/92bf36029638ae236920177e722650bed2a40e84/chrome/browser/ui/webui/extensions/extensions_internals_source.cc), revisione `92bf360…`, righe 253–276, 299–365, 436–475.
- [Extension registry](https://chromium.googlesource.com/chromium/src.git/+/HEAD/extensions/browser/extension_registry.cc), blob acquisito `4e61eadd070d68c5fe6fef3670d44a016214ba24`, righe 29–51.
- [CDP Target](https://chromium.googlesource.com/chromium/src/+/a488704fa0d1134a929f07509e878fcd2880ff6a/third_party/blink/public/devtools_protocol/domains/Target.pdl), revisione `a488704…`, righe 19–39, 117–174, 219–253, 272–278.
- [ComponentLoader](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/chrome/browser/extensions/component_loader.cc), righe 238–246, 348–397, 678–692.
- [Component resource manager](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/chrome/browser/extensions/chrome_component_extension_resource_manager.cc), righe 130–150, 213–254.

Un errore di quoting JS/PowerShell si è verificato **prima dell’esecuzione dello strumento**, senza azione nativa; è stato corretto usando `Environment.NewLine`. Il prerequisito resta datato 20:58 UTC. Nessuna di queste correzioni costituisce QA o qualificazione dell’isolamento.
