# Esperimento MGRS: rappresentante interno di 0,1 µm

## Esito e portata

È disponibile una **patch sperimentale**, non applicata al repo, che corregge il caso del selfcheck senza modificare il troncamento di coordinate DD o UTM arbitrarie. Quando un MGRS a 1 m viene decodificato, il punto restituito è proiettato a partire da un UTM spostato di **+0,0000001 m per ciascun asse** rispetto all'angolo SW. Il vettore ideale è dunque lungo circa 0,1414 µm, cioè 1,414×10⁻⁷ della larghezza della cella di 1 m. L'intervallo dei 171 scostamenti misurati con PROJ è 0,136–0,151 µm; nel campione aggiuntivo di 3000 punti il massimo è 0,1503 µm. La soglia empirica controllata è 0,2 µm, **non una garanzia teorica valida per ogni piattaforma e input**.

La modifica cambia un comportamento preciso: prima il rappresentante a 1 m era ottenuto dall'angolo SW; ora è un'approssimazione deliberatamente spostata all'interno e non coincide matematicamente con SW. Gli oggetti separati `sw` e `ne` continuano a essere calcolati dagli angoli UTM senza lo spostamento. Le loro coordinate geografiche possono tuttavia differire nei bit bassi rispetto al sorgente originale, perché il candidato include la correzione della normalizzazione descritta sotto; sono identiche alla versione con sola normalizzazione corretta. Il cambiamento del punto rappresentativo è misurabile e va esplicitamente accettato come tolleranza numerica, non descritto come SW esatto.

Il sorgente documenta «centro cella se precisione ridotta» e denomina separatamente gli angoli SW/NE; l'implementazione per 1 m usa SW, e un selfcheck chiama il rappresentante «SW». Non è stato trovato un divieto esplicito di tolleranza numerica, ma neppure una soglia preesistente che autorizzi automaticamente questa scelta. La semantica esatta precedente non è conservata: se essa è vincolante, questa alternativa va respinta.

## Componenti della modifica

1. Evita il modulo `normalizeLon` per le tre longitudini già in `(-180,180]` nel solo `mgrsToLatLonExt`. Valori fuori intervallo e -180 continuano a essere normalizzati; la convenzione −180 → +180 resta invariata. Ciò evita di perdere bit già validi. Per il caso originale, la sola normalizzazione incondizionata cambia 9.941698241384206 a 9.941698241384188, facendo proiettare easting a 575166.9999999986 invece di 575167.
2. Solo se `cellSize === 1`, aggiunge 10⁻⁷ m a easting e northing del punto restituito prima dell'inversa. Non tocca l'UTM dell'angolo SW, l'angolo NE, il calcolo del centro a precisione ridotta o la funzione di conversione diretta.

Il valore 10⁻⁷ m è una **scelta sperimentale**, non un limite matematico dimostrato: è circa 13 volte il massimo errore di ricostruzione di 7,45 nm rilevato sugli assi nei 100 casi numerici della prima prova. Non può garantire il comportamento su ogni combinazione di piattaforme o coordinate. Il normale floor rimane strettamente applicato alle coordinate arbitrarie, comprese quelle autenticamente appena sotto un bordo.

## Prove e risultati

Le prove sono eseguite su funzioni estratte effettivamente dal monolite con Node 24.16, Python, pyproj 3.8.0 / PROJ 9.8.1 e mgrs 1.7.0 (GEOTRANS). Tutti i pacchetti e i file sono nello staging.

- `python experiment.py`: 171 punti (150 globali pseudo-casuali e 21 mirati) per sei precisioni = 1026 roundtrip. A 1 m: 164 identità e 7 differenze riconducibili a zona o fascia; prima della patch completa 55 identità e 116 differenze, e dopo la sola correzione della normalizzazione 64 identità e 107 differenze. Rispetto alla sola normalizzazione, nessuna identità precedente è persa nel campione. Le altre 855 prove sono identiche alla sola normalizzazione; tutti i 1026 SW/NE sono identici alla sola normalizzazione. Formattare direttamente la provenienza MGRS con il formatter originale mantiene l'etichetta in 1026/1026 casi.
- `python stress.py`: 3000 coordinate globali pseudo-casuali supplementari (seed 871551), ciascuna trasformata da GEOTRANS in un riferimento a 1 m, poi decodificata e ricodificata: 3000 identità, nessuna perdita di identità rispetto alla sola normalizzazione, massimo scostamento radiale SW misurato 1,5024×10⁻⁷ m, sotto la soglia campionaria di 2×10⁻⁷ m.
- 192 punti DD indipendenti generati con inversa PROJ: in quattro zone, due assi, tutte le sei precisioni e offset ±1 µm e ±1 mm da bordi di griglia. Le uscite dirette del sorgente, della sola normalizzazione e della patch completa sono identiche; tutte concordano con floor delle coordinate proiettate da PROJ. Differenza massima delle proiezioni 2,80 nm. GEOTRANS differisce in 48 casi all'offset −1 µm ma concorda agli offset ±1 mm e +1 µm. Il test non autorizza una soglia di snapping su input arbitrari.
- Selfcheck mirato: `32T NQ 75167 01394` ricodifica alla stessa precisione come `32T NQ 75167 01394`; l'antimeridiano della prova esistente `01NAA6602100000` resta normalizzato nell'intervallo richiesto.
- `candidate_inward_0p1um.patch` supera `git apply --check`. SHA-256 monolite sperimentale: `8b5f3af1ae2b938b1e62cb4257fd9d7198890bad0537e700533100ca13d17e8b`; patch: `d7a91329e41a0d2d671ca26196f7c11845d1f1cfe13d10d5d664e7cf88831dbc`. Repo sorgente iniziale `72b92bf76c26203aa28142e2f3a4ce7e65d27dacb7f79afd4acb2ddff81361b2`.

Dettagli completi, semi, casi e comandi negli script `experiment.py`, `stress.py`, `oracle.js` e output JSON. Le prove non sono una certificazione per tutte le coordinate né sostituiscono una verifica dell'intera applicazione e dei selfcheck nel browser.

## Limiti: zone, fasce e provenienza

L'identità complessiva rimane impossibile da promettere con la sola coppia latitudine/longitudine e selezione automatica della zona. Un MGRS valido può rappresentare una cella che interseca una zona o fascia, mentre il suo angolo SW o centro si trova nell'area adiacente; nei sette casi residui a 1 m la ricodifica sceglie un'altra zona o fascia. A precisioni inferiori rimangono i 63 casi preesistenti rilevati nelle 855 prove, inclusi alcuni centri fuori dall'intervallo UTM. Il campione include un caso GEOTRANS vicino all'equatore in cui la stessa libreria emette un riferimento che poi non riesce a decodificare: GEOTRANS non è considerato un oracolo assoluto sui confini.

Un'opzione distinta è propagare il riferimento MGRS originale e la sua precisione, usando `formatMgrsCanonicalFromParse` per la visualizzazione dell'input originale. Conserva i caratteri senza spostare coordinate ma non rende identica una nuova proiezione di numeri privi di contesto. La provenienza dovrebbe essere esplicita, invalidata al cambiamento della posizione, e distinta da una nuova codifica della coordinata; non è stata implementata né richiede necessariamente storage permanente.

A risoluzioni inferiori alla stabilità numerica della proiezione, una coppia di numeri non può rivelare se proviene esattamente da un confine o da un punto autenticamente appena al di sotto. Spostare il solo rappresentante decodificato risolve pragmaticamente molti roundtrip mantenendo il normale troncamento per input arbitrari, ma attribuisce al punto ritornato uno scostamento deliberato. La scelta va valutata con questa semantica e senza affermare identità universale.
