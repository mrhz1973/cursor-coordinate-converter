# GOI GIS Tool — QA operatore

> **Natura del file**
> - Fa parte del **read-set operativo** (voce 4; vedi [`README.md`](../README.md)).
> - È una **procedura/template**, **non** la fonte dello stato vivo.
> - Lo stato operativo corrente resta in [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) **§7**.
> - La governance di handoff/chiusura è in [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) **§4 — Handoff & Close Discipline**.

## Principi

- **PASS operatore ≠ PASS tecnico.** Il PASS tecnico remoto (hash, deploy VPS, byte-match, `node --check`) è distinto dal PASS operatore (comportamento runtime verificato da una persona).
- **Cursor non attesta la QA visiva.** Cursor prepara la richiesta QA, ma non apre l'app, non carica tile e non inventa esiti al posto dell'operatore.
- **Emissione unica.** La QA viene emessa **una sola volta** nel report `finito` (o subito dopo deploy), dentro **un unico fenced code block** copiabile; l'operatore risponde **una sola volta**.
- **Fail-closed.** Senza attestazione esplicita dell'operatore, l'esito resta **QA operatore non eseguita / non attestata**. Non si inferisce PASS operatore da PASS tecnico, diff pulito o `node --check`.

## Formato predefinito — QA operatore minima narrativa

Per **micro-fix UI**, **patch runtime localizzate**, **correzioni circoscritte** e **blocchi di routine** senza OPSEC, rete, cache, storage o migrazioni, il formato **predefinito** è una **QA minima narrativa**: breve, operativa, immediatamente eseguibile.

**Non usare come formato ordinario:** tabelle; caselle `[ ]`; sezioni ripetute con sette categorie obbligatorie; campi data/browser/risoluzione salvo reale necessità; audit generale dell'app; controlli non pertinenti al blocco.

### Struttura canonica

1. **Apertura:** `Il deploy tecnico di <BLOCK-ID> è PASS:`
2. **Elenco breve** dei fatti tecnici già provati (quando noti): VPS/HEAD deploy; commit runtime; servizio attivo; HTTP 200; byte-match e SHA-256 match; componenti delicati non toccati; repository pulito.
3. **Frase:** `Ora serve solo la QA operatore minima, senza Cursor.`
4. **Sezione `Apri:`** con URL VPS e cache-buster runtime (vedi sotto).
5. **Sezione `Poi:`** con pochi passaggi concreti nell'app.
6. **Sezione `verifica che:`** con soli controlli specifici del blocco e regressioni strettamente pertinenti.
7. **Chiusura `Riportami:`** una sola risposta attesa:
   - `QA <BLOCK-ID> PASS operatore`
   - oppure il messaggio esatto dell'errore e il punto in cui si verifica.

### Esempio generico (template)

```
Il deploy tecnico di <BLOCK-ID> è PASS:

- VPS aggiornata a <deploy-sha>;
- runtime <runtime-sha> servito correttamente;
- servizio attivo;
- HTTP 200;
- byte-match e SHA-256 match;
- componenti fuori scope non toccati;
- repository pulito.

Ora serve solo la QA operatore minima, senza Cursor.

Apri:

http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=<runtime-short-sha>

Poi:

- <azione operatore 1>;
- <azione operatore 2>;

verifica che:

- <esito specifico 1>;
- <esito specifico 2>;
- l'app resti utilizzabile.

Riportami:

QA <BLOCK-ID> PASS operatore

oppure il messaggio esatto dell'errore e il punto in cui si verifica.
```

## Come innescare il rifiuto canonico del poligono per la QA

Nota operativa per **innescare volontariamente** il rifiuto in creazione poligono durante la QA. Non descrive un uso comune dell'app: serve a verificare i contratti **P5-B1**, **P5-B1-FIX**, **P5-B2-F** e blocchi futuri sullo stesso percorso (`polygonFinishDraw` → `gisFeatureAdd` → sanitizer).

### Condizione del rifiuto

Il messaggio **«Geometria non valida»** con **draft preservato** compare solo quando, dopo la de-duplicazione del ring, restano **meno di tre vertici distinti**. In quel caso `gisSanitizeGeometry` rifiuta la geometria e `gisFeatureAdd` non persiste alcun poligono.

### Vertici distinti e soglia `gisSameCoord`

Il confronto usa la soglia di **`gisSameCoord`**: **1e-7 gradi** su latitudine e longitudine (ordine di grandezza **circa un centimetro** a terra).

Due vertici più vicini di tale soglia sono considerati **coincidenti** e contano come **un solo** vertice dopo la de-duplicazione dei punti consecutivi e della chiusura del ring.

### Conseguenza pratica per la QA

- **Non basta** mettere punti «vicini»: servono vertici che il sanitizer consideri **distinti**.
- A **zoom 14**, un pixel rappresenta indicativamente **circa 9–10 metri**; due tap/click in posizioni anche solo leggermente diverse sono normalmente distanti metri e quindi **vertici distinti** → il poligono può risultare **valido** e il messaggio **non** compare.
- Per innescare il rifiuto serve lo **stesso identico punto**, non un punto semplicemente vicino.
- **Aumentare lo zoom** non rende affidabile il test: per questa procedura ripetere il click sullo **stesso identico pixel/coordinata**.

### Procedura operativa con il mouse

Usare il **mouse** (il dito su touch non è sufficientemente affidabile per sovrapporre due vertici):

1. Avviare un nuovo poligono e cliccare il **primo** punto.
2. **Senza muovere** il mouse, cliccare di nuovo sullo **stesso identico pixel** (secondo vertice sovrapposto).
3. Cliccare un **terzo** punto in un'altra posizione.
4. Eseguire il **doppio clic** previsto dall'app per chiudere il poligono.
5. I due vertici sovrapposti vengono fusi dalla de-duplicazione → restano **meno di tre** vertici distinti.
6. Deve comparire il messaggio rosso **«Geometria non valida»**; il **disegno** resta **aperto** e il **draft** **preservato** (vertici, nome draft se presente, possibilità di correggere e riprovare o Annulla).

### Ambito futuro

Riutilizzare questa procedura per la QA di qualunque blocco futuro che tocchi:

- il **rifiuto** della creazione poligono;
- la **visualizzazione** del messaggio di geometria non valida;
- la **preservazione** o **modifica** del draft dopo il rifiuto.

## Formato eccezionale — checklist estesa

Usare la **checklist estesa** (con caselle e categorie strutturate) **solo** quando serve copertura più ampia, ad esempio:

- OPSEC;
- rete, tile o proxy;
- cache o storage;
- migrazioni dati;
- modifiche architetturali;
- diff multi-area;
- più ambienti o combinazioni indipendenti da attestare;
- blocchi ad alto rischio;
- richiesta esplicita dell'utente.

Anche in questi casi: **una sola** checklist; **una sola** restituzione; controlli pertinenti; **nessun PASS inventato**; fail-closed invariato.

### Nucleo standing (riferimento per checklist estesa)

Le sette categorie sotto valgono come **riferimento** per la checklist estesa, non come obbligo su ogni blocco di routine:

1. **Identificazione** — block ID; runtime SHA; HEAD/deploy; build; URL QA.
2. **Versione servita** — pagina caricata; build corretta; cache-buster runtime corretto.
3. **Funzione primaria** — comportamento principale; output atteso; nessun errore evidente.
4. **Stati positivi e negativi (quando pertinenti)** — opzione attiva/disattiva; fail-closed; cancel/annulla.
5. **Regressioni** — solo regressioni **correlate al blocco**.
6. **Stabilità** — app utilizzabile; mappa e pannelli non bloccati.
7. **Limiti** — sotto-check non eseguiti; condizioni non osservate.

### Template checklist estesa (eccezione)

```
QA OPERATORE ESTESA — <BLOCK-ID>

URL QA:
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=<runtime-short-sha>

VERSIONE
[ ] Build attesa: <build>
[ ] Runtime: <runtime-sha>
[ ] HEAD/deploy: <deploy-sha>
[ ] Pagina caricata con cache-buster runtime corretto

NUCLEO STANDING
[ ] Funzione primaria eseguita
[ ] Output atteso verificato
[ ] Nessun errore evidente
[ ] App ancora utilizzabile dopo il test

CONTROLLO SPECIFICO DEL BLOCCO
[ ] <controllo specifico 1>
[ ] <controllo specifico 2>

REGRESSIONI PERTINENTI
[ ] <regressione correlata 1>

LIMITI / NON ESEGUITO
- <eventuali limiti>

ESITO
[ ] QA <BLOCK-ID> PASS operatore
[ ] QA <BLOCK-ID> FAIL operatore

Punti falliti:
- ...
```

## Formato URL QA

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=<runtime-short-sha>
```

- Usare lo **short SHA del commit runtime reale**.
- **Mai** SHA docs/autosync al posto del runtime.
- **Mai** etichette `*-local` sul VPS.
- L'URL è **già compilato** dal workflow quando il runtime è noto.

## Istruzioni per il workflow `finito`

Quando la QA operatore resta **pending**, `finito` (o il report post-deploy) deve:

- riportare prima i **risultati tecnici già verificati** (PASS tecnico);
- emettere per **default** la **QA minima narrativa** (non una checklist lunga con caselle) per blocchi di routine;
- usare la frase **«Ora serve solo la QA operatore minima, senza Cursor»** (o equivalente);
- inserire il **runtime short SHA reale** nell'URL QA;
- includere **solo** passaggi ed esiti specifici e regressioni pertinenti al blocco;
- chiedere come risposta: `QA <BLOCK-ID> PASS operatore` oppure errore esatto e punto di occorrenza;
- emettere tutto in **un unico fenced code block**;
- **non** dichiarare PASS operatore prima dell'attestazione dell'operatore;
- usare la **checklist estesa** solo nei casi delicati/complessi definiti sopra.
