> Nota dell'orchestratore: il requisito 3D è stato richiesto esplicitamente dall'utente; resta da definire l'architettura compatibile con gli invarianti. La presente analisi è un piano futuro, non un requisito di nuova autorizzazione generale. Diritti e condizioni d'uso dei dati vanno verificati quando pertinenti.

# Proposta strategica: MART GIS autonomo e interoperabilità TAK

**Tipo:** analisi e proposta backlog; non autorizza implementazione, accesso a provider protetti o cambi infrastrutturali.  
**Riferimento repository:** `origin/main` = `9d676116c6c387af522fb7c928bb6dc1b5408135` (verificato con `git ls-remote`).  
**Stato operativo letto:** FRONTIER indica routing land-only come workstream attivo, WU attiva N/A, audit Strumenti e poi routing come NEXT; Oggetti GIS è FROZEN / MAINTENANCE-ONLY.

## Sintesi

L’intento dell’utente amplia la direzione futura del prodotto; non trasforma automaticamente l’elenco in attività operative. Parte dei temi è già presente nella roadmap strategica, alcuni hanno backlog specifico, e altri richiedono una decisione architetturale o una ricognizione separata. La proposta è scomporli in fasi verificabili e accettare ogni eventuale sviluppo solo dopo aver chiarito formato, dati, licenze e limiti di distribuzione.

Il requisito chiarito è che **MART GIS rimanga un prodotto autonomo**, con funzioni e UX simili ad ATAK, senza incorporare o integrare il prodotto/codice ATAK. L’obiettivo d’interoperabilità è la più ampia compatibilità praticabile con i formati ATAK, in scambio bidirezionale; il perimetro va censito e verificato per ogni formato, versione, direzione (import/export), profilo e categoria di dati. Non si dichiara supporto universale prima di prove. TAK Server può essere valutato come interoperabilità separata e facoltativa, soltanto dopo requisiti OPSEC, consenso/opt-in, protocolli, sicurezza e architettura. Restano distinti codice/prodotto ATAK, SDK/API, plugin e capability riservate: non sono incorporati né assunti accessibili. Il perimetro attuale del GIS resta app HTML singolo, desktop-first, offline-first, OPSEC-aware; i vincoli strategici escludono la partecipazione al prodotto/ecosistema TAK e il renderer 3D, pur consentendo CoT import/export e overlay/georeferenziazione.

## Confronto con le fonti canoniche

| Tema richiesto | Già previsto o registrato | Valutazione / dipendenza |
|---|---|---|
| Cataloghi CIGA e UKHO / ADMIRALTY | WU-0012 nomina entrambi come provider candidati. Stato: discovery blocked / not opened; online update è a sua volta non aperto. | Già tracciato. Prima solo ricognizione pubblica di copertura, termini d’uso, accesso e formati; nessun fetch di dati protetti e nessuna integrazione finché condizioni e autorizzazioni non sono chiare. UKHO e ADMIRALTY non vanno trattati come un singolo prodotto senza specifica. |
| 3D | `docs/roadmap.md` esclude il globo/renderer terreno 3D; WU roadmap chiama “3D terreno” candidato lungo periodo con decisione companion vs monolite. | In conflitto con il limite strategico attuale se inteso come renderer 3D nel GIS. Va mantenuto come opzione fuori scope finché non c’è revisione strategica esplicita. Elevazione/profilo e overlay 2D possono essere valutati separatamente entro i limiti già previsti. |
| Georeferenziazione | Roadmap strategica ammette overlay immagini con georeferenziazione a quattro punti; vieta pipeline di elaborazione raster. | Già previsto in termini circoscritti; non equivale a georeferenziazione arbitraria o rettifica/processing. Definire input, CRS, trasformazione, precisione attesa, persistenza ed export prima della WU. |
| Export dettagliato tracce e waypoint | Roadmap elenca GPX, KML, GeoJSON, CSV e diversi formati missione (tra cui CoT, Litchi, WPML, MAVLink, UgCS); dichiara esplicitamente limiti di fedeltà round-trip per GPX/KML/GeoJSON. Formato coordinate e copia waypoint sono già stati chiusi; un hub export locale per waypoint/tracce/poligoni è in roadmap WU. | Gran parte della direzione è già pianificata. Prima inventariare ciò che è davvero implementato; definire campi, selezione, metadati, unità, quote/timestamp e comportamento lossless/lossy. Non presentare ogni formato come implementato solo perché appare nella matrice strategica. |
| Futuro archivio cartografico / interoperabilità | Roadmap tratta interop come matrice per formati; il corpus include catalogo cartografico e archive match per provider. | “Archivio cartografico” è ambiguo: catalogo/indice, cache offline, archivio documentale o pacchetto portabile sono problemi diversi. Fare discovery e modello dati prima di scegliere formato o storage; nessuna migrazione dati implicita. |
| Android, iOS e PC | Distribuzione attuale privilegia singolo HTML desktop; PWA mobile è scenario futuro non bloccante e non progettato. TAK.gov descrive prodotti distinti Android (ATAK), iOS (iTAK) e Windows (WinTAK). | PC browser è il target coerente più vicino. Mobile richiede studio PWA/browser, touch, storage offline, permessi, installazione e QA per piattaforma; app native esulano dalla forma attuale senza revisione strategica. |
| Standard NATO | La roadmap copre riferimenti dottrinali e alcune interoperabilità; CoT è previsto come import/export. Non si deve inferire copertura generale di standard NATO. | Elencare standard specifici e release, profili/campi richiesti, uso previsto e fonte pubblica. Trattare CoT come formato/interop selezionata, non come certificazione o conformità generale NATO/TAK. |
| Autonomia e compatibilità ATAK | MART GIS deve restare autonomo; la roadmap prevede già CoT import/export e formati quali GPX, KML, GeoJSON, CSV, ma non documenta la compatibilità completa ATAK per formato/versione. | Costruire matrice di compatibilità ATAK × formato × versione × import/export × tipo-oggetto, con fixture e round-trip testati. Censire anche formati/package e profili pubblicamente documentati; marcare ogni cella come supportato/verificato, parziale, non supportato o ignoto. Nessuna promessa “tutti i formati” senza riscontri. Nessun codice/prodotto ATAK incorporato. |
| Funzioni e UX simili ad ATAK | Visione GIS include supporto mission planning e waypoints; roadmap definisce autonomia architetturale. | Tradurre capability e flussi d’uso osservabili (marker, route planning, disegni, package offline, overlays, report) in requisiti MART GIS autonomi. Implementazioni native e UX restano di MART GIS e soggette a freeze/roadmap; non copiare o dipendere dal codice ATAK o da plugin. |
| TAK Server | Non è una dipendenza della compatibilità file e non è il prodotto richiesto in questa fase. | Interoperabilità server è una linea separata e opzionale: prima protocollo e use case, threat model, OPSEC, consenso esplicito opt-in, gestione credenziali/certificati, modalità offline e policy di rete; nessuna connessione automatica o integrazione infrastrutturale implicita. |

Fonti repository: [roadmap strategica](https://github.com/mrhz1973/cursor-coordinate-converter/blob/main/docs/roadmap.md), [FRONTIER](https://github.com/mrhz1973/cursor-coordinate-converter/blob/main/docs/FRONTIER.md), [WU-0005→0009 e temi GIS](https://github.com/mrhz1973/cursor-coordinate-converter/blob/main/docs/work-units/WU-0005-0009-roadmap.md), [WU-0012 cataloghi](https://github.com/mrhz1973/cursor-coordinate-converter/blob/main/docs/work-units/WU-0012-carto-index-federated.md), [WU-0010 routing](https://github.com/mrhz1973/cursor-coordinate-converter/blob/main/docs/work-units/WU-0010-outdoor-routing-graphhopper.md).

## Proposta di backlog, per aree e criteri d’ingresso

Queste sono **proposte da triagiare**, non WU aperte. L’ordine sotto separa scoperta e decisione da implementazione; le aree GIS che coinvolgono Oggetti GIS restano soggette al freeze attuale.

### A. Matrice verificabile di formati, versioni e direzioni di scambio

- **Esito:** inventario di tutte le vie d’interscambio ATAK documentate pubblicamente e rilevanti per MART GIS, organizzato in una matrice `formato × versione/profilo × import/export × tipo-oggetto × target ATAK`. Tenere una colonna distinta per ciò che la roadmap promette, ciò che esiste nel runtime e ciò che è stato verificato con test.
- **Criteri:** schema e provenienza; versioni; geometrie/attributi; media/allegati; metadata; codifica e coordinate; estensioni; limiti di dimensione; error handling; fixture lecite; round-trip e perdita informativa. Ogni cella ha stato verificabile: supportato e testato, parziale, non supportato, oppure non verificato.
- **Dipendenze:** discovery pubblica e audit runtime separati; nessun cambiamento applicativo richiesto per censire. I test d’interoperabilità precedono ogni dichiarazione di compatibilità.
- **Gate:** l’obiettivo di ampiezza è da perseguire per tranche; “tutti i formati ATAK compatibili” resta un obiettivo da misurare, mai una garanzia generale non testata.

### B. CIGA e ADMIRALTY / UKHO: provider discovery

- **Esito:** dossier pubblico separato per provider, copertura/aggiornamento, licenze/termini, modalità di accesso, formati, limiti di caching/redistribuzione e requisiti tecnici.
- **Criteri:** fonti provider ufficiali; nessun endpoint autenticato o dato protetto; distinzione tra catalogo/metadata e contenuto cartografico; parere legale/permessi forniti dal titolare prima di un’integrazione.
- **Dipendenze:** WU-0012 già aperta come macro-feature ma provider discovery è marcata blocked/not opened; richiede sblocco del gate provider, non solo implementazione GIS.
- **Passo futuro eventuale:** spike read-only con dataset pubblici autorizzati; poi una proposta provider-specifica con acceptance, policy cache/offline e OPSEC.

### C. Export d’oggetti e pacchetto portabile

- **Esito:** specifica dei campi per waypoint/tracce/poligoni e degli oggetti importabili/esportabili per ogni formato/versione ATAK selezionato, con entrambe le direzioni esplicitate. Separare export singolo oggetto da pacchetto di missione/archivio.
- **Criteri:** round-trip misurato per ogni formato/versione/direzione supportata; report dei campi persi o non rappresentabili; schema/versione; unità e datum espliciti; comportamento allegati/package; export locale e nessuna rete per i file; fixtures pubbliche autorizzate.
- **Dipendenze:** inventario runtime e matrice A; WU esistente di export hub è riferita come candidato; Oggetti GIS frozen richiede una decisione esplicita di sblocco prima di nuovi comportamenti.
- **Possibili passi, non promesse:** consolidare GPX/KML/GeoJSON/CSV; valutare CoT XML standalone; successivamente formati missione specifici solo se richiesti e supportati da specifiche verificabili.

### D. Georeferenziazione immagini e archivio cartografico

- **Esito:** requisiti distinti per overlay a quattro punti e per archivio/catologo di mappe.
- **Criteri overlay:** formati input supportati, CRS/datum, trasformazione e limiti geometrici, precisione/errore mostrati, persistenza, export; nessun image processing.
- **Criteri archivio:** definire se si tratta di indice, libreria locale o pacchetto offline; provenienza/licenza, hash, versione, extent/scala/CRS, retention e portabilità.
- **Dipendenze:** non confondere con provider online; dipende da storage/offline policy e decisioni export. Oggetti GIS rimane frozen se l’intervento cambia gli oggetti GIS esistenti.

### E. Mobile e distribuzione multipiattaforma

- **Esito:** studio di fattibilità PWA mobile e matrice browser/device per Android, iOS e PC.
- **Criteri:** compatibilità touch/viewport, storage quota e persistenza offline, file import/export, permessi/localizzazione solo espliciti, accessibilità, test senza rete, update e rollback; nessuna raccolta telemetrica.
- **Dipendenze:** promozione dello scenario PWA da “future/non-blocking” a scenario progettato richiede revisione dei principi strategici e della roadmap; non implica riscrittura nativa.

### F. Capability MART GIS autonome e compatibilità file ATAK

- **Esito:** capability-by-capability implementate in MART GIS con UX autonoma; priorità funzionale guidata da matrice A. Candidate da valutare: marker/route/drawing, pacchetti locali, overlay e report.
- **Criteri:** caso d’uso, utente, modalità offline, rischio safety/OPSEC, requisiti di UX, schema e campi; per ogni formato selezionato test d’importazione ed esportazione separati, con fixtures e perdita dati documentata.
- **Dipendenze:** A e C; ogni cambiamento a waypoint/tracce/poligoni subordinato al freeze e a un eventuale sblocco esplicito. Nessuna integrazione di codice/prodotto/plugin ATAK. Lo scambio server non è incluso: resta opzione separata secondo area H.

### H. TAK Server come interoperabilità separata e opt-in

- **Esito:** solo studio di protocollo e decisione architetturale; nessun collegamento operativo in questa proposta.
- **Criteri:** caso d’uso approvato, flussi e protocolli pubblici, threat model, autenticazione/certificati, autorizzazioni, consenso e opt-in espliciti, endpoint configurato dall’utente, indicatori di connessione, comportamento offline, minimizzazione dati e test locale controllato.
- **Dipendenze:** revisione strategica rispetto al vincolo attuale che esclude la partecipazione al prodotto/ecosistema TAK; decisione OPSEC e valutazione tecnica prima di qualunque WU. Nessun accesso a sistemi protetti o server reali nella fase di discovery.

### G. 3D / elevazione

- **Esito:** mantenere elevazione 2D/profilo come area valutabile; 3D renderer come opzione strategica separata.
- **Criteri per riaprire:** decisione esplicita che confronti renderer embedded 2D-derived, companion separato e vincoli distribuzione; dataset, licensing, offline storage, performance e QA definiti.
- **Dipendenze:** revisione della roadmap §2.2/§3/§4/§8. Nessuna attività 3D GIS entra nel backlog implementativo corrente prima di tale decisione.

## Dipendenze e freeze

1. Il workstream operativo resta quello in FRONTIER; questo report non lo sostituisce né lo riordina.
2. `Oggetti GIS = FROZEN / MAINTENANCE-ONLY`: niente nuove funzioni waypoint/poligoni/tracce come conseguenza automatica del report. È possibile solo manutenzione e un eventuale specifico sblocco prodotto.
3. WU-0012 CIGA/UKHO è il punto di registrazione esistente e marcato discovery-blocked/not opened; riprenderlo richiede prima fonti pubbliche/termini/licenze, poi gate provider.
4. CoT import/export è già esplicitamente previsto nella roadmap; è un sottoinsieme del censimento, non prova compatibilità universale bidirezionale ATAK. Nessun prodotto/codice ATAK è incorporato; API/SDK e plugin non sono dipendenze presunte. TAK Server resta possibile solo come interoperabilità separata, facoltativa, configurata e opt-in, dopo revisione OPSEC/strategica.
5. Mobile PWA è futura e non pianificata; 3D è in conflitto col perimetro strategico. Entrambi richiedono revisione strategica prima di pianificazione esecutiva.

## Fonti pubbliche ufficiali TAK consultate

- [TAK.gov — prodotti](https://tak.gov/products): distingue ATAK-CIV, WinTAK-CIV, iTAK e WebTAK; descrive capacità generali e piattaforme.
- [TAK.gov — FAQ](https://tak.gov/faq): dichiara che accesso a SDK ATAK/WinTAK è previsto in presenza di sponsor governativo; dettaglia alcune capacità specifiche, ad esempio elevazione/DSM.
- [TAK.gov — processo](https://tak.gov/pages/our-process): distingue risorse pubbliche CIV da capability/release controllate e chiarisce che accesso a risorse non equivale ad approvazione/transition operativa.
- [TAK Product Center — repository pubblico ATAK-CIV](https://github.com/TAK-Product-Center/atak-civ): sorgente ufficiale pubblica CIV; non è stata usata per derivare una promessa di compatibilità o accesso a capability riservate.
- [TAK Product Center — schema CoT protobuf pubblico](https://github.com/TAK-Product-Center/Server/blob/main/src/takserver-protobuf/src/main/proto/cotevent.proto): riferimento tecnico pubblico, non certifica da solo un profilo d’interoperabilità dell’app.

L’uso di tali fonti serve a descrivere il perimetro pubblico e i nomi delle piattaforme. Non è stata richiesta né tentata l’autenticazione a sistemi TAK, provider cartografici protetti o portali riservati; non si assume licenza, sponsor, diritto di redistribuzione, accesso a SDK non pubblici o disponibilità di dati.

## Limiti e decisione successiva

Report basato sulle fonti repository a HEAD verificata e sulle sole fonti TAK pubbliche citate. Non è audit del codice runtime, parere legale, inventario esaustivo di ogni formato o versione ATAK, né verifica di licenze provider. Primo passo riesaminabile: approvare o correggere la matrice di censimento e l’ambito di “compatibilità ATAK”; poi verificare ogni combinazione con fonti pubbliche e fixture prima di dichiararla supportata. Inoltre riesaminare priorità rispetto al routing corrente, freeze Oggetti GIS, scenario PWA e limite 3D. Nessun supporto universale è dichiarato da questo report.
