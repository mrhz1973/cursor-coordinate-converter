# Checkpoint ChatGPT esteso — GOI GIS Tool

**Data:** 2026-04-30 23:59  
**Tipo:** memoria estesa per ChatGPT  
**Creato da:** ChatGPT su richiesta esplicita dell’utente  
**Uso previsto:** riprendere il contesto operativo quando Cursor non è disponibile o quando serve riallineare ChatGPT tramite GitHub.

Questo file è una memoria di supporto per ChatGPT. Non sostituisce i documenti ufficiali del progetto e non deve essere usato da Cursor come unica fonte operativa, salvo richiesta esplicita dell’utente.

---

## 1. Regola nuova: checkpoint ChatGPT su GitHub

L’utente ha chiesto che ChatGPT possa salvare una memoria propria direttamente su GitHub, senza passare da Cursor, solo quando riceve il comando:

```text
checkpoint
```

Regola approvata:

- se l’utente scrive `checkpoint`, ChatGPT può creare un file in:

```text
docs/orchestrator/chatgpt-checkpoints/
```

- il file serve principalmente a ChatGPT;
- Cursor non deve leggerlo obbligatoriamente;
- se un giorno Cursor dovrà usarlo, l’utente lo dirà esplicitamente;
- il file non deve modificare il workflow operativo del repository.

File breve già creato:

```text
docs/orchestrator/chatgpt-checkpoints/2026-04-30_2359_checkpoint_chatgpt_gis.md
```

File esteso corrente:

```text
docs/orchestrator/chatgpt-checkpoints/2026-04-30_2359_checkpoint_chatgpt_gis_extended.md
```

---

## 2. Cosa ChatGPT può e non può salvare direttamente

### Consentito su comando esplicito `checkpoint`

ChatGPT può salvare:

- memoria della conversazione;
- stato operativo sintetico;
- decisioni prese;
- prossimi passi;
- prompt già approvati;
- note di rischio;
- regole conversazionali dell’utente;
- distinzione tra documenti ufficiali e memoria ChatGPT.

### Non consentito nel flusso normale

ChatGPT non deve modificare direttamente:

```text
coordinate_converter Claude.html
docs/roadmap.md
docs/checkpoint.md
docs/session-geolocalizzazione-e-mappa.md
.cursor/rules/
docs/orchestrator/latest.md
```

Eccezione: solo se l’utente chiede esplicitamente una modifica diretta a uno di questi file e il rischio di conflitto con Cursor è stato valutato.

Motivo pratico: Cursor lavora sul repository locale. Se ChatGPT modifica file operativi sul remoto mentre Cursor ha modifiche locali, possono nascere disallineamenti o conflitti.

---

## 3. Distinzione tra le memorie del progetto

### 3.1 Memoria ChatGPT permanente

Percorso:

```text
docs/orchestrator/chatgpt-checkpoints/
```

Scopo:

- aiutare ChatGPT a riprendere il contesto;
- mantenere decisioni conversazionali non sempre presenti nei documenti ufficiali;
- servire quando Cursor non è disponibile.

Questa memoria non è il registro ufficiale del lavoro tecnico.

### 3.2 Orchestratore Cursor

Percorsi:

```text
docs/orchestrator/latest.md
docs/orchestrator/inbox/
```

Scopo:

- stato operativo sintetico;
- piani generati da Cursor;
- riepiloghi di Agent;
- riepiloghi di chiusura sessione;
- informazioni leggibili da ChatGPT tramite `aggio`.

### 3.3 Checkpoint ufficiale progetto

Percorso:

```text
docs/checkpoint.md
```

Scopo:

- indice breve del progetto;
- stato repository riconosciuto dal workflow Cursor;
- aggiornato normalmente da Cursor, specialmente con `finito`.

### 3.4 Session log lungo

Percorso:

```text
docs/session-geolocalizzazione-e-mappa.md
```

Scopo:

- cronologia estesa;
- decisioni e passaggi storici;
- backlog e note operative lunghe.

---

## 4. Stato remoto noto al momento del checkpoint

L’ultimo controllo GitHub con `aggio` ha mostrato che è stato pubblicato il piano:

```text
docs/orchestrator/inbox/2026-04-30_2345_plan_range-rings-ui-standardization.md
```

Stato del piano:

- è solo documentazione;
- il monolite non è stato modificato da quel piano;
- l’implementazione deve ancora essere fatta in Cursor Agent.

Ultimo aggiornamento workflow noto:

```text
commit a2da326
```

Quel commit riguarda il workflow `finito` e la riconciliazione dell’orchestratore.

---

## 5. Stato bug critici già risolti

### 5.1 Freeze Range Rings

Problema osservato:

- aprendo Range Rings, l’app si bloccava;
- la console mostrava chiamate ripetute a `renderRangeRingsList`;
- il problema avveniva anche con lista vuota.

Causa individuata:

```text
renderRangeRingsList
→ rrCancelPendingRename
→ renderRangeRingsList
```

Correzione:

- `rrCancelPendingRename` deve chiamare `renderRangeRingsList()` solo se esisteva realmente un rename pendente.

Risultato verificato:

- Range Rings aperto e chiuso molte volte senza blocco;
- rename inline con Annulla verificato OK.

### 5.2 Mappa bianca dopo hard refresh

Problema osservato:

- dopo hard refresh la mappa poteva non caricare;
- i log mostravano tile pending senza immagini assegnate.

Causa individuata:

- render multipli ravvicinati sostituivano il DOM mentre `hydrateMapTiles` lavorava ancora sui vecchi nodi.

Correzioni conservate:

- generazione mappa/tile;
- controlli stale;
- abort dei fetch superati;
- parallelizzazione dei controlli viewport offline.

Risultato verificato:

- hard refresh in GIS mode;
- mappa OSM carica entro pochi secondi.

### 5.3 Pulizia debug

La strumentazione temporanea di diagnosi è stata rimossa.

Da non reintrodurre:

- log locali di debug persistenti;
- ingest locale;
- marcatori di sessione debug precedenti;
- spam console.

---

## 6. Blocco corrente: Range Rings UI/UX standardizzazione

Blocco corrente da implementare:

```text
Range Rings — Blocco 1 UI/UX standardizzazione
```

Obiettivo generale:

- rendere Range Rings coerente con gli altri pannelli/modal;
- non toccare ancora il drag avanzato dell’anello sulla mappa;
- sistemare pulsanti, lista, import/export, apertura/chiusura, notifiche e layout pannello.

Il piano è stato letto da ChatGPT e giudicato approvabile con correzioni.

---

## 7. Correzioni obbligatorie al piano Range Rings

Prima dell’implementazione Cursor deve rispettare queste tre correzioni.

```text
1. NON fare commit e push selettivo in questo blocco.
   Mantieni il comportamento standard: modifica i file, aggiorna docs/orchestrator/latest.md e inbox se previsto, ma non eseguire finito e non fare commit manuale/push. Riporta git status/diff. Il commit finale resta al workflow finito, salvo mia richiesta esplicita.

2. Attenzione al clamp generale dei pannelli.
   Puoi rendere i pannelli trascinabili parzialmente fuori viewport, ma la modifica deve essere minima e sicura.
   L’header/area di presa deve restare sempre recuperabile.
   Se il cambio a gisPanelClampRect impatta tutti i pannelli, test obbligatorio su Track, Waypoint, Convert, Search, Favorites, Layers e Range Rings.
   Se c’è rischio, limita il comportamento al solo Range Rings e lascia il resto invariato.

3. Non trasformare Import/Export in un redesign ulteriore.
   Limitati a togliere il primary blu improprio se presente e rimuovere GeoJSON dalla riga, mantenendo disponibili le funzioni esistenti. Non cambiare formati, builder o logica import/export.
```

---

## 8. Dettagli del piano Range Rings Blocco 1

### 8.1 Pulsante Rings sulla mappa

Da fare:

- rendere il pulsante più leggibile;
- usare icona più grande;
- togliere la scritta invasiva o renderla secondaria;
- click sul pulsante = toggle:
  - se chiuso, apre;
  - se aperto, chiude;
- aggiungere stato active/aria dove coerente;
- rimuovere Range Rings dal menu Altri strumenti se duplicato.

### 8.2 Import / Export

Da fare:

- mantenere funzioni esistenti;
- evitare bottone blu primary se non è vera azione primaria;
- rimuovere GeoJSON come azione riga se già coperta dal menu export;
- non cambiare formati, builder o parsing.

### 8.3 Creazione anelli

Da fare:

- nascondere o rimuovere “Punta sulla mappa”;
- lasciare “Punta e crea” come flusso principale;
- nascondere o rimuovere “Crea anelli” se duplica il flusso;
- impostare distanza predefinita modificabile;
- mantenere input manuale.

Valore proposto:

```text
1, 5, 10 km
```

### 8.4 Lista Range Rings

Da fare:

- colonna “Data” al posto di “Quando”;
- visibilità con controllo/pallino uniforme;
- azioni riga icon-only dove coerente;
- delete con icona e conferma interna;
- rimuovere GeoJSON dalla riga;
- rename inline con notifica/conferma interna;
- preservare il fix di `rrCancelPendingRename`.

### 8.5 Pannello Range Rings

Da fare:

- X/close coerente con gli altri pannelli;
- pannello spostabile parzialmente fuori dalla mappa o dal viewport;
- header sempre recuperabile;
- evitare refactor globale dei pannelli.

### 8.6 Notifiche e i18n

Da fare:

- usare notifiche interne Range Rings già esistenti;
- nuove stringhe solo se necessarie;
- ogni testo visibile deve avere IT/EN/FR;
- niente alert, prompt o confirm nativi.

---

## 9. Cosa non fare nel blocco corrente

Non toccare:

- logica mappa tile;
- cache tile;
- IndexedDB;
- Mappe Offline core;
- Misura;
- Track core;
- Waypoint core;
- reset dati locali;
- OPSEC / privacy mode;
- GPS;
- geocoding;
- roadmap;
- workflow `finito`.

Non fare:

- refactor largo;
- rewrite del pannello Range Rings;
- nuove dipendenze;
- framework;
- build step;
- logging debug permanente;
- commit manuale;
- `finito` prima della verifica ChatGPT.

---

## 10. QA previsto dopo implementazione

Dopo Cursor Agent, verificare:

- `git diff --stat`;
- `git diff --check -- "coordinate_converter Claude.html"`;
- controllo sintassi JS se il JS è stato toccato;
- hard refresh GIS mode;
- mappa carica;
- pulsante Rings apre;
- secondo click chiude;
- apri/chiudi più volte senza freeze;
- Range Rings con zero set non blocca;
- creazione set con default distanza;
- modifica manuale distanza accettata;
- lista mostra Data;
- delete usa conferma interna;
- rename inline OK e Annulla OK;
- pannello trascinabile e recuperabile;
- altri pannelli principali non rotti se clamp generale è stato toccato;
- nessuno spam console.

---

## 11. Workflow conversazionale con l’utente

Regola fondamentale indicata più volte dall’utente:

```text
un passo alla volta
```

Comportamento richiesto a ChatGPT:

- non preparare prompt lunghi senza conferma;
- non saltare al blocco successivo;
- chiedere o attendere il risultato di Cursor;
- dopo ogni output Cursor, verificare prima di procedere;
- non proporre commit manuali nel flusso normale;
- ricordare che `finito` è comando di Cursor.

Comandi utente:

- `aggio` o `aggiornati`: leggere GitHub, soprattutto `docs/orchestrator/latest.md`;
- `checkpoint`: creare memoria ChatGPT in `docs/orchestrator/chatgpt-checkpoints/`;
- `vai`: procedere al prossimo passo operativo già concordato;
- `finito`: comando da usare in Cursor, non in ChatGPT.

---

## 12. Prossimo passo consigliato

Far implementare a Cursor Agent il piano Range Rings Blocco 1, includendo le tre correzioni obbligatorie.

Dopo Cursor, l’utente deve riportare:

```text
Riepilogo Cursor:
git status --short:
git diff --stat:
eventuali errori/test:
```

ChatGPT deve poi controllare se il risultato è coerente prima di autorizzare ulteriori blocchi.
