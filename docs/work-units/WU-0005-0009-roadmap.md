# WU-0005 → WU-0009 — Piano backlog GIS monolite

**Stato:** PLANNED  
**Repo:** `mrhz1973/cursor-coordinate-converter`  
**Ambito:** GOI GIS Tool / GIS monolite  
**File operativo:** `coordinate_converter Claude.html`  
**Fonte backlog:** `docs/OPERATING_MEMORY.md` §7  
**Nota:** questo documento pianifica il backlog. Non apre ancora una WU runtime e non autorizza modifiche al monolite.

---

## 1. Vincoli operativi

Il piano rispetta i vincoli del GIS Tool:

- deliverable monolite: singolo file HTML standalone;
- HTML/CSS/JS nello stesso file;
- vanilla JS;
- no framework;
- no TypeScript;
- no npm;
- no bundler;
- no ES modules;
- no split operativo;
- OPSEC-aware;
- nessun GPS silenzioso all'avvio;
- nessun live tracking GPS senza decisione esplicita;
- OPSEC strict e forced-offline restano gate di rete;
- `state.mapWaypoints[]` resta fonte canonica dei waypoint;
- i prompt Cursor vengono scritti da GPT, non da Claude;
- i comandi manuali all'operatore vanno dati uno alla volta;
- i prompt-task per Cursor restano completi.

---

## 2. Ordine consigliato complessivo

Ordine operativo consigliato:

1. **WU-0005 — Governance “GIS online di default”**  
   Prima di toccare layer, basemap e proxy bisogna chiarire la semantica online/offline.

2. **WU-0006 — Diagnosi e decisione poligoni**  
   Va fatta prima di spostare “Poligoni” dentro “Tracce”, perché non ha senso riorganizzare in UI una funzione rotta senza sapere se sarà corretta, degradata o rimossa.

3. **WU-0007 — UX toolbar laterale e razionalizzazione strumenti**  
   Include sia interventi cosmetici sia spostamenti funzionali. Va fatta dopo la diagnosi poligoni e prima dei basemap multipli.

4. **WU-0008 — Basemap XYZ aperti nel monolite**  
   Solo layer pubblici/XYZ aperti: OSM-HOT, CARTO Voyager, OpenTopoMap.

5. **WU-0009 — Google/Bing via proxy Planet-Clone, lavoro a due teste**  
   Parte sensibile: coinvolge proxy, fetch, gate OPSEC, consenso e separazione tra GIS e Planet-Clone.

---

# WU-0005 — Governance: “GIS online di default”

## Scopo

Scrivere e bloccare la regola operativa: il GIS è **online di default**, mentre `forced-offline` è un interruttore volontario dell’operatore, non un vincolo predefinito.

Questo non deve indebolire OPSEC strict: OPSEC strict resta un gate superiore per chiamate sensibili, tile, geocoding, proxy e fetch.

## Tipo

**Sensibile / governance + OPSEC semantics — pipeline.**

Motivo: anche se può iniziare come docs-only, la regola influenza successivamente layer, tile online, cache, geocoding e proxy.

## Blocchi

### B0 — Docs di decisione

Aggiornare la memoria operativa e, se serve, creare WU-0005 con stato OPEN.

La decisione deve dire chiaramente:

- online è il comportamento normale quando l’operatore non ha attivato forced-offline;
- forced-offline blocca la rete perché è una scelta volontaria;
- OPSEC strict resta più forte di “online default”;
- nessun GPS silenzioso e nessun live tracking implicito;
- tile/geocoding/proxy restano opt-in dove già previsto.

### B1 — Mappatura semantica esistente

Analisi read-only nel monolite:

- dove viene letto `state.forcedOffline` o equivalente;
- dove vengono applicati i gate OPSEC;
- dove si distinguono tile online, cache offline, geocoding, Esri, Open-Meteo, seamarks, Navionics/proxy;
- se ci sono testi UI ambigui che fanno sembrare l’app “offline di default”.

### B2 — Eventuale allineamento UI/testi

Solo se B1 trova ambiguità:

- testi UI che chiariscono “usa online se consentito”;
- forced-offline come modalità scelta dall’operatore;
- nessuna modifica sostanziale ai gate senza approvazione.

### B3 — Chiusura WU

Aggiornare WU, `OPERATING_MEMORY.md`, README snapshot se cambia davvero lo stato operativo, autosync se previsto.

## Decisioni da bloccare prima di iniziare

- Nome definitivo della regola: consigliato `GIS online di default; forced-offline volontario`.
- Chiarire che non equivale a “rete sempre permessa”: OPSEC strict e consenso layer restano superiori.
- Chiarire se la WU deve essere solo documentale o anche UI-copy.

## Dipendenze

Nessuna a monte.  
È prerequisito logico per WU-0008 e WU-0009.

---

# WU-0006 — Bug: “poligoni non funziona”

## Scopo

Capire se la funzione poligoni è rotta per bug localizzato, regressione UI, stato incoerente, export/import incompleto o feature ormai da rimuovere/declassare.

Solo dopo la diagnosi si decide fix o rimozione.

## Tipo

**Sensibile / diagnostica funzionale — pipeline.**

Motivo: tocca strumenti di misura, stato mappa, UI, possibili export e integrazione con Tracce.

## Blocchi

### B0 — Docs WU e perimetro diagnosi

Aprire WU-0006. Definire che il primo blocco è **read-only**: nessuna modifica runtime.

### B1 — Diagnosi read-only

Cursor deve leggere il monolite e produrre mappa tecnica:

- funzioni legate a poligoni;
- pulsanti/menu che attivano poligoni;
- stato interno usato;
- eventuali array dati;
- eventi mappa collegati;
- calcolo area/perimetro;
- export/import collegati;
- i18n IT/EN/FR;
- possibili conflitti con tracce, waypoint e range/bearing.

Output atteso:

- diagnosi;
- punto di rottura probabile;
- opzioni operative.

### B2 — Decisione: fix, degrado o rimozione

Dopo B1 si sceglie:

- **Fix** se il problema è localizzato;
- **Degrado controllato** se la feature esiste ma va semplificata;
- **Rimozione UI** se è troppo fragile o non coerente con il GIS-first attuale.

### B3A — Fix poligoni

Solo se deciso fix:

- ripristinare attivazione;
- garantire disegno su mappa;
- calcolo area/perimetro;
- chiusura/cancellazione sicura;
- nessuna regressione su tracce e waypoint.

### B3B — Rimozione/declassamento poligoni

Solo se deciso rimozione:

- togliere pulsanti o voci UI;
- lasciare eventuali funzioni interne non richiamate solo se rimozione completa è rischiosa;
- aggiornare testi e docs.

### B4 — QA manuale e chiusura

Verifiche:

- apertura GIS;
- creazione poligono o conferma rimozione;
- nessuna rottura di tracce, waypoint, distanza;
- `node --check` su JS estratto;
- aggiornamento WU/docs/autosync.

## Decisioni da bloccare prima di iniziare

- Cosa significa esattamente “non funziona”: non si apre, non disegna, non salva, non esporta, non calcola area.
- Se la feature deve restare autonoma o diventare sottovoce di Tracce.
- Soglia di accettazione: fix minimo o revisione UX completa.

## Dipendenze

- Precede WU-0007 blocco “Poligoni dentro Tracce”.
- Se si decide rimozione, WU-0007 dovrà rimuovere/assorbire la voce invece di spostarla.

---

# WU-0007 — UX toolbar laterale e razionalizzazione strumenti

## Scopo

Ridurre ingombro e disordine della toolbar laterale, correggere allineamenti e raggruppare strumenti correlati.

È una WU mista: alcuni blocchi sono cosmetici, altri cambiano struttura UI e wiring.

## Tipo

**Misto.**

- B1-B3 sono prevalentemente **cosmetici / Cursor diretto**, salvo impatto JS.
- B4-B8 sono **sensibili / layering UI + state wiring — pipeline.**

## Blocchi

### B0 — Docs WU e inventario UI

Aprire WU-0007. Prima analisi read-only:

- regioni HTML/CSS della toolbar;
- handler JS dei pulsanti;
- data-i18n coinvolti;
- relazione con pannello Layers, GPS, distanza, waypoint, tracce, MGRS, range/bearing;
- eventuali sovrapposizioni con barra cache al cambio zoom.

### B1 — Pulsanti più piccoli

Obiettivo: ridurre dimensione o padding dei pulsanti laterali che coprono la barra cache al cambio zoom.

Classificazione: **cosmetico / Cursor diretto**, se limitato a CSS.

Dipendenze: B0.

Decisione da bloccare:

- riduzione solo dimensioni;
- nessun cambio di posizione generale mappa/pannelli.

### B2 — Layers disallineato

Correggere allineamento visivo del pulsante Layers.

Classificazione: **cosmetico / Cursor diretto**, se solo CSS.

Dipendenze: B0.

Decisione da bloccare:

- mantenere icona stack/layers;
- non cambiare logica del pannello Layers.

### B3 — GPS icona → scritta con colore qualità segnale

Trasformare GPS da icona a scritta, con colore che rappresenta qualità segnale.

Classificazione: **sensibile medio / pipeline leggera**, perché non è solo CSS: serve capire dove vive lo stato qualità GPS e non introdurre live tracking.

Dipendenze:

- B0;
- vincolo: nessun GPS silenzioso e nessun live tracking senza decisione esplicita.

Decisioni da bloccare:

- testo esatto: `GPS`, `POS`, `FIX`, oppure altro;
- scala colori: nessun fix / scarso / medio / buono;
- da quale metrica derivare qualità: accuracy, timestamp, stato ultimo fix;
- comportamento prima del primo fix.

### B4 — Distanza → righello

Convertire lo strumento distanza in icona/strumento righello.

Classificazione: **cosmetico se solo icona/testo; pipeline se cambia handler o pannello**.

Dipendenze: B0.

Decisioni da bloccare:

- usare simbolo testuale semplice o icona già esistente;
- mantenere identico handler distanza;
- non fondere ancora con range/bearing.

### B5 — Pulsante espandibile Waypoint a 3 azioni

Raggruppare:

- Waypoint;
- posiziona punto;
- torna al punto;

in un pulsante espandibile a 3, con azione principale = nuovo waypoint.

Classificazione: **sensibile / pipeline**.

Motivo: cambia struttura UI, handler, stato aperto/chiuso, accessibilità operativa, rischio regressioni waypoint.

Dipendenze:

- B0;
- meglio dopo B1-B4, perché prima va stabilizzata la toolbar.

Decisioni da bloccare:

- click principale = nuovo waypoint;
- secondarie in menu espandibile;
- chiusura menu al click fuori o al secondo click;
- comportamento mobile/touch;
- i18n IT/EN/FR;
- nessun cambiamento a `state.mapWaypoints[]` come fonte canonica.

### B6 — Poligoni dentro Tracce

Spostare o assorbire la voce Poligoni dentro Tracce.

Classificazione: **sensibile / pipeline**.

Dipendenze obbligatorie:

- WU-0006 completata;
- se WU-0006 decide rimozione, questo blocco diventa rimozione UI o nota “decaduto”.

Decisioni da bloccare:

- poligoni come sottostrumento di Tracce;
- nome UI: “Tracce” contiene anche poligoni/aree;
- se poligoni rimane distinto nello state model o viene solo spostato in UI;
- evitare refactor ampio.

### B7 — MGRS dentro Layers come overlay

Spostare MGRS in Layers come overlay.

Classificazione: **sensibile / layering UI — pipeline**.

Motivo: “Layers” gestisce basemap/overlay; MGRS come overlay deve rispettare forced-offline/OPSEC se genera rete, oppure dichiarare che è solo overlay locale se non usa rete.

Dipendenze:

- B2 Layers allineato;
- WU-0005 governance online/offline;
- prima di WU-0008 basemap multipli, così Layers è già pronto.

Decisioni da bloccare:

- MGRS è overlay locale o dipende da tile/rete?
- toggle indipendente o opzione nel pannello Layers;
- persistenza stato overlay;
- i18n.

### B8 — Range & Bearing dentro Tracce

Spostare Range & Bearing dentro Tracce.

Classificazione: **sensibile / pipeline**.

Dipendenze:

- B0;
- possibilmente dopo B6, perché entrambi razionalizzano il gruppo Tracce.

Decisioni da bloccare:

- Range & Bearing resta strumento autonomo richiamato da Tracce;
- nessun cambio al calcolo;
- evitare conflitto con distanza/righello;
- i18n.

### B9 — QA integrata toolbar

Verifiche finali:

- toolbar non copre barra cache al cambio zoom;
- Layers allineato;
- GPS non parte da solo;
- distanza funziona;
- waypoint/posiziona/torna al punto funzionano;
- poligoni coerente con decisione WU-0006;
- MGRS toggle nel posto corretto;
- Range & Bearing accessibile;
- `node --check`;
- docs/autosync.

## Dipendenze principali

- WU-0006 prima di B6.
- WU-0005 prima di B7.
- WU-0007 prima di WU-0008, perché WU-0008 aggiunge contenuto a Layers.

---

# WU-0008 — Basemap multipli XYZ aperti nel monolite

## Scopo

Aggiungere basemap aperti nel solo monolite:

- OSM-HOT;
- CARTO Voyager;
- OpenTopoMap.

La WU deve mantenere il modello radio basemap: una base sempre attiva, nessuno stato “basemap nascosta”, coerente con la chiusura WU-0004.

## Tipo

**Sensibile / layer + OPSEC + cache — pipeline.**

Motivo: tocca catalogo layer, fetch tile, offline mode, OPSEC strict, UI Layers e forse cache/offline maps.

## Blocchi

### B0 — Docs WU e matrice layer

Aprire WU-0008. Documentare:

- layer target;
- URL template;
- attribution;
- max zoom;
- tipo `external: "internet"` se il modello layer lo prevede;
- comportamento forced-offline;
- comportamento OPSEC strict;
- se entrano anche nel selettore offline maps.

### B1 — Diagnosi read-only catalogo tile/layers

Mappare:

- costanti TILE_LAYERS o equivalenti;
- radio basemap;
- hydrate/fetch tile;
- offline download;
- export offline JPG;
- attribution;
- i18n labels.

### B2 — Aggiunta OSM-HOT

Un layer alla volta.

Decisioni da bloccare:

- label UI;
- max zoom;
- attribution;
- uso consentito offline cache;
- gate OPSEC.

### B3 — Aggiunta CARTO Voyager

Stesso schema di B2.

Decisioni da bloccare:

- variante chiara: Voyager standard, non dark/light salvo decisione esplicita;
- attribution;
- max zoom.

### B4 — Revisione OpenTopoMap esistente o nuova voce

Il README cita OpenTopoMap come basemap esistente. Quindi questo blocco non deve duplicarlo alla cieca: deve verificare se esiste già e, se esiste, solo normalizzarlo nella nuova matrice.

Decisioni da bloccare:

- se OpenTopoMap è già presente, non creare doppione;
- allineare solo label, attribution, max zoom, offline behavior.

### B5 — Integrazione Layers UI

Dopo i layer:

- ordine radio;
- labels IT/EN/FR;
- default invariato salvo decisione;
- nessuna regressione Navionics/SonarChart/seamarks.

### B6 — Integrazione Offline Maps / Export JPG

Decidere e implementare se i nuovi basemap sono disponibili:

- nel download offline;
- nell’export offline JPG;
- nella coverage visualization.

Questo blocco è sensibile: non cancellare tile già scaricate per operazioni metadata-only.

### B7 — QA layer

Test:

- ogni basemap carica online quando consentito;
- forced-offline blocca rete e usa cache se disponibile;
- OPSEC strict blocca dove previsto;
- Navionics e seamarks non regrediscono;
- una sola basemap radio attiva;
- node check;
- docs/autosync.

## Dipendenze

- WU-0005 governance.
- WU-0007 B2/B7 preferibilmente completati, perché il pannello Layers deve essere stabile.
- Non dipende da WU-0009.

---

# WU-0009 — Google/Bing via proxy Planet-Clone, lavoro a due teste

## Scopo

Integrare Google/Bing attraverso proxy Planet-Clone, con Path B scrape keyless deciso da privato.

Questa WU non è solo GIS monolite: è un lavoro a due teste, quindi va gestita esplicitamente come separazione tra:

- **Planet-Clone/proxy:** endpoint, scraping/keyless, token/headers/cache/limiti;
- **GIS monolite:** catalogo layer, consenso, OPSEC gate, UI Layers, fetch via proxy.

## Tipo

**Molto sensibile / multi-repo + proxy + OPSEC + layering — pipeline stretta.**

## Struttura consigliata

Spezzare il lavoro in due WU coordinate, invece di una sola WU enorme:

- **WU-0009A — Planet-Clone proxy Google/Bing readiness**  
  Fuori dal GIS monolite; repo Planet-Clone/control-plane secondo contesto operativo.

- **WU-0009B — GIS monolite integration Google/Bing proxy basemaps**  
  Dentro `cursor-coordinate-converter`.

In alternativa, se si vuole mantenere numerazione lineare solo nel GIS, WU-0009 può contenere due fasi, ma la separazione A/B è consigliata perché i repo e i rischi sono diversi.

---

## WU-0009A — Proxy readiness Google/Bing

### B0 — Decisione privata e perimetro

Formalizzare, fuori dal repo pubblico se necessario:

- quali layer Google/Bing;
- Path B scrape keyless;
- limiti OPSEC;
- nessuna esposizione pubblica;
- tailnet/private-only;
- cache aggressiva o no;
- user-agent/header strategy;
- rate limiting;
- health endpoint.

### B1 — Diagnosi Planet-Clone read-only

Mappare:

- proxy attuale;
- endpoint Navionics esistenti;
- token/refresh se presenti;
- CORS;
- cache;
- logging;
- systemd/VPS.

### B2 — Endpoint Google/Bing proxy

Implementare endpoint separati, non confondere con Navionics:

- `/google/...` o schema da decidere;
- `/bing/...`;
- status/health separato;
- redaction dei log.

### B3 — Gate e sicurezza proxy

- no open proxy pubblico;
- bind tailnet;
- rate limit;
- logging senza dati sensibili;
- fail closed;
- niente chiavi hardcoded se non previsto dal modello privato.

### B4 — QA proxy

Test su proxy:

- tile risponde;
- CORS compatibile col GIS;
- errori gestiti;
- nessun segreto nei log;
- nessun leak nei docs.

## Decisioni da bloccare per WU-0009A

- Quali provider: Google, Bing o entrambi.
- Quali varianti: road, satellite, hybrid, terrain.
- Nomi endpoint.
- Cache sì/no e durata.
- Se documentare pubblicamente solo comportamento astratto, non dettagli sensibili.

---

## WU-0009B — Integrazione GIS monolite Google/Bing

### B0 — Docs WU GIS

Aprire WU-0009B nel GIS, dichiarando dipendenza da WU-0009A.

### B1 — Diagnosi read-only layer proxy nel GIS

Mappare come Navionics viene chiamato oggi tramite proxy e come si può riusare pattern senza duplicazioni fragili.

### B2 — Modello layer proxy

Aggiungere proprietà layer, ad esempio:

- tipo proxy/tailnet;
- consenso richiesto;
- OPSEC strict behavior;
- forced-offline behavior;
- attribution;
- non disponibile su public Firebase/VPS pubblico se proxy non esposto.

### B3 — Google basemap via proxy

Un provider alla volta.

Decisioni da bloccare:

- label;
- variante;
- consenso;
- fallback se proxy non raggiungibile;
- messaggio errore.

### B4 — Bing basemap via proxy

Stesso schema di B3.

### B5 — UI Layers

- radio basemap coerenti;
- nessuno stato basemap nascosto;
- messaggi per proxy non disponibile;
- i18n.

### B6 — QA OPSEC/proxy/offline

Test:

- online default consente se non forced-offline e non OPSEC strict;
- forced-offline blocca proxy;
- OPSEC strict blocca o richiede consenso secondo decisione;
- public deployment non tenta endpoint privati non disponibili;
- tailnet deployment funziona;
- Navionics non regredisce.

## Dipendenze

- WU-0005 governance.
- WU-0008 completata.
- WU-0009A completata e verificata.
- Revisione Claude/GPT obbligatoria prima di ogni prompt sensibile.

---

# Ordine operativo dettagliato consigliato

## Fase 1 — Regole e diagnostica

1. **WU-0005 B0-B3** — governance online default.
2. **WU-0006 B0-B2** — diagnosi poligoni e decisione.
3. **WU-0006 B3A/B3B-B4** — fix o rimozione.

## Fase 2 — Toolbar e strumenti

4. **WU-0007 B0** — inventario UI.
5. **WU-0007 B1** — pulsanti più piccoli.
6. **WU-0007 B2** — Layers allineato.
7. **WU-0007 B3** — GPS scritta/colore qualità.
8. **WU-0007 B4** — distanza/righello.
9. **WU-0007 B5** — gruppo Waypoint espandibile.
10. **WU-0007 B6** — poligoni dentro Tracce o rimozione UI, secondo WU-0006.
11. **WU-0007 B7** — MGRS dentro Layers.
12. **WU-0007 B8** — Range & Bearing dentro Tracce.
13. **WU-0007 B9** — QA integrata.

## Fase 3 — Basemap aperti

14. **WU-0008 B0-B1** — matrice e diagnosi layer.
15. **WU-0008 B2** — OSM-HOT.
16. **WU-0008 B3** — CARTO Voyager.
17. **WU-0008 B4** — OpenTopoMap: verifica/normalizzazione, non duplicazione.
18. **WU-0008 B5** — UI Layers.
19. **WU-0008 B6** — Offline maps/export JPG.
20. **WU-0008 B7** — QA.

## Fase 4 — Proxy Google/Bing

21. **WU-0009A B0-B4** — proxy readiness in Planet-Clone, separato.
22. **WU-0009B B0-B2** — predisposizione GIS.
23. **WU-0009B B3** — Google via proxy.
24. **WU-0009B B4** — Bing via proxy.
25. **WU-0009B B5-B6** — UI + QA OPSEC/offline/proxy.

---

# Matrice sintetica dipendenze

| Elemento | Dipende da | Motivo |
| --- | --- | --- |
| WU-0005 Governance | nessuna | regola base online/offline |
| WU-0006 Poligoni | nessuna | diagnosi autonoma, ma blocca UX poligoni |
| WU-0007 B6 Poligoni dentro Tracce | WU-0006 | non si sposta una feature rotta senza decisione |
| WU-0007 B7 MGRS in Layers | WU-0005, WU-0007 B2 | overlay/layer deve rispettare semantica online/offline e Layers stabile |
| WU-0008 Basemap XYZ | WU-0005, preferibile WU-0007 | layer nuovi dopo governance e toolbar stabile |
| WU-0009A Proxy | decisione privata Path B | lavoro extra-monolite, sensibile |
| WU-0009B GIS Google/Bing | WU-0005, WU-0008, WU-0009A | GIS integra solo proxy già pronto e regole OPSEC già chiare |

---

# Decisioni architetturali da prendere prima dei lavori

## Prima di WU-0005

Decidere se la governance resta solo documentale o deve modificare anche testi UI. Consiglio operativo: prima docs-only, poi eventuale UI solo se la diagnosi trova ambiguità.

## Prima di WU-0006

Definire il sintomo minimo del bug poligoni. Anche una frase basta, per esempio: “clicco poligoni e non succede nulla” oppure “disegna ma non calcola area”.

## Prima di WU-0007

Decidere se la toolbar deve rimanere una barra verticale semplice o diventare una mini-toolbar con gruppi espandibili. Il gruppo Waypoint a 3 azioni introduce già una logica espandibile: conviene stabilire un pattern riusabile.

## Prima di WU-0008

Decidere la politica dei nuovi basemap aperti:

- entrano anche in download offline?
- entrano anche in export JPG?
- default basemap resta quello attuale?
- attribution sempre visibile?

## Prima di WU-0009

Decidere fuori dal repo GIS:

- Google e Bing entrambi o uno alla volta;
- varianti supportate;
- endpoint proxy;
- cache;
- livello di documentazione pubblica;
- vincoli legali/OPSEC da non scrivere nel repo pubblico se sensibili.

---

# Prima WU consigliata

Partire da **WU-0005 — Governance “GIS online di default”**.

Motivo pratico: è piccola, chiarisce il comportamento generale e riduce il rischio che i blocchi successivi su Layers, basemap e proxy vengano implementati con una semantica ambigua.

Subito dopo: **WU-0006 — diagnosi poligoni**, perché condiziona la riorganizzazione toolbar.
