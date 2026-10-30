# Audit statico: adattamento mobile e touch dell'app GIS

**Data:** 30 ottobre 2026  
**Oggetto:** `coordinate_converter Claude.html` nel checkout `mart-gis`  
**Perimetro:** sola ispezione del sorgente HTML/CSS. Nessuna modifica al repository e nessuna verifica in browser o su dispositivi. Le dimensioni riportate sono valori dichiarati nel CSS, non misure del rendering effettivo.

## Sintesi

Il file contiene già un insieme sostanziale di regole responsive per la modalità GIS: viewport meta presente (riga 5), header riordinato sotto 768 CSS px, safe area per iPhone, mappa dimensionata con `dvh`, controlli mappa scorrevoli, dialog a larghezza mobile, drawer a fondo schermo, e variazioni dedicate a telefono in landscape. Per tablet sono previste regole intermedie e la mappa può passare a dimensioni half/full.

La barriera principale rispetto al requisito “pulsanti comodi al tocco” è che diverse famiglie di controlli rimangono dichiarate a 26–42 CSS px: nella colonna GIS la regola mobile assicura solo un minimo di 36 CSS px, mentre alcuni pulsanti dell’header scendono a 40–42 CSS px e la chiusura dei dialog resta 34×34 CSS px. Le regole di touch coarse nascondono le maniglie di ridimensionamento delle tabelle, ma non applicano un allargamento generale dei bersagli touch. Le tabelle offline hanno una larghezza minima di 980 CSS px e quindi richiedono scorrimento orizzontale sul telefono.

Questi sono punti da verificare e possibili priorità di lavoro, non una conclusione che l’interfaccia fallisca su un dispositivo reale. Dal sorgente non si possono dedurre accuratezza del tap, overflow effettivo, leggibilità o altezza realmente disponibile.

## Inventario delle regole responsive e dei pattern

- **Viewport e tipografia:** `width=device-width, initial-scale=1` (5); il titolo base scende a 2rem sotto 700px (147). Le unità `rem` dipendono dalla dimensione del font radice.
- **Breakpoint ricorrenti:** 900, 860, 768, 760, 720, 700, 620, 600, 560, 520, 480 e 380 CSS px; ci sono inoltre una regola per 769–1250px e regole landscape basate anche sull’altezza. La copertura è ricca ma frammentata tra sezioni e componenti, con soglie vicine ma diverse.
- **Header e barra GIS:** i layout generali si impilano a 900px; la barra nasconde etichette delle schede a 720px; le azioni possono andare a capo a 860px, mentre sotto 480px una barra azioni è resa scorribile orizzontalmente (5014–5016). L’override mobile GIS sotto 768px usa flex-wrap, safe-area inset e mette la barra sotto brand e controlli (12533+). Stima CSS dell’altezza header: 132px sotto 768px e 148px sotto 480px, ridotta a 88px in landscape stretto (12534, 12731, 12744). Sono stime impostate nel CSS, non altezze misurate.
- **Mappa:** il contenitore principale usa `100vh` con override `100dvh` e `min-height:360px` (circa riga 6682); l’override mobile lo dimensiona in base a viewport dinamico e header stimato e porta il minimo a 220px (12595+). Safe-area inset sono usati su lati, bordo superiore e inferiore. I controlli mobili hanno colonna a larghezza 38px, ridotta a 36px sotto 480px, e possono scorrere verticalmente quando non ci stanno (12601, 12731). In landscape corto la larghezza scende a 34px (12744).
- **Pannelli e dialog:** i dialog generici sono fino a 96vw e 92vh/vdvh (circa riga 6948); sotto 768px ricevono margini laterali e limiti basati su `100dvh` e safe area (12700+). Il drawer diventa un bottom sheet a tutta larghezza sotto 620px (riga 12533+), con supporto `dvh`. Ci sono adattamenti locali per pannelli specifici (ad es. poligoni sotto 600px, riga 2800; pannello astronomia sotto 600px, circa riga 9310).
- **Contenuto e tabelle:** griglie e risultati passano a una colonna a 900px (697, 4254, 4292); il pannello tabellare Aree offline ha larghezza/min-width 980px (1350–1352), mentre la zona che lo contiene consente scorrimento orizzontale (1256–1268). Il sorgente include inoltre una presentazione a schede per aree offline; verificare nel browser che sia quella effettivamente usata sui telefoni. Su input coarse vengono nascoste numerose maniglie resize (1450+).
- **Orientamento e safe area:** ci sono eccezioni per landscape sotto 926×480 e per alcuni pannelli sotto 560px di altezza (12744, 9048, 10783, 11163, 11752). `env(safe-area-inset-*)` è già usato in più componenti: va verificato con browser e configurazione viewport iOS effettivi.

## Barriere e priorità suggerite

### P1 — Dimensioni minime dei bersagli touch

Valori piccoli dichiarati nel sorgente da verificare/valutare:

- Controlli principali sovrapposti alla mappa: diverse regole base impostano 26×26 CSS px per zoom, griglia, copertura e misura (ad es. 2287, 2410, 2435, 2445, 2459, 2467, 2479, 2614, 2639, 2660, 2707). La regola mobile porta alcuni controlli della colonna a un minimo di 36×36 CSS px (12645+), ma non porta tutta la colonna a 44 CSS px; alcuni elementi possono avere regole più specifiche da ricontrollare.
- Pulsante di chiusura modal: 34×34 CSS px (circa 6978+), senza override mobile di dimensione visibile nel blocco mobile principale.
- Pulsanti di chiusura float: 34×34 CSS px (circa 3504+); palette swatch e altri selettori includono elementi piccoli (ad es. swatch 28×28 circa 3632; item iconici 26×26 circa 2318).
- UI topbar: pulsanti e schede prendono l’altezza da `--gis-topbar-btn-h` (circa 5040+); questa variabile va risolta e confrontata con le dimensioni touch desiderate. Il foglio include altezza 34px per schede a schermo molto stretto (5014–5016 o regole successive da verificare in ordine di cascata).
- Controlli GIS nell’header: 40×42 CSS px su mobile e 52×52 CSS px per stampa (12626–12634); il primo gruppo è sotto una soglia di 44px su un asse.
- Azioni compatte `.btn-sm` hanno solo padding 5×11px e testo .82rem (4434), e alcune varianti ancora più compatte: per esempio azioni area offline .72rem con padding 4×9px (1783), azioni nominate .78rem con padding 5×10px (1952). Le dimensioni risultanti dipendono dal testo e dalla cascata.

**Priorità consigliata:** individuare i controlli più usati su mappa e pannelli; definire un minimo touch coerente (ad esempio 44–48 CSS px come obiettivo di progetto); ampliare la hit area anche quando l’icona resta visivamente piccola; consentire alle eccezioni dense di usare spaziatura senza rendere impossibile l’azione. Il valore 44px è un criterio di progetto comune, non una misura fisica universale né una prova di usabilità.

### P2 — Spazio verticale e densità del GIS sui telefoni piccoli

Header, topbar, dock minimizzato, scale, readout e colonne strumenti competono per lo spazio verticale. La mappa mobile usa un’altezza che sottrae una stima header fissa; eventuali wrap di testi, zoom del browser, font maggiorati, barre browser o contenuti localizzati possono modificare l’altezza effettiva. La colonna controlli scorre internamente, ma questo può rendere meno visibili alcune azioni. Verificare casi da 320/360 CSS px e telefoni in landscape, con l’interfaccia GIS reale e pannelli aperti.

### P3 — Tabelle e azioni ripetute

La tabella Aree offline richiede almeno 980 CSS px e scorre lateralmente su viewport stretti; questo rende selezione, lettura e azioni per riga un flusso multi-asse. Le maniglie di resize sono disattivate con `hover:none`/`pointer:coarse`, utile per rimuovere affordance da mouse ma non risolve il layout tabellare. Verificare la variante a schede e le liste/colonne di azioni per tracce, waypoint, favoriti e poligoni, che contengono gruppi di pulsanti `.btn-sm`.

### P4 — Coerenza dei breakpoint e mantenibilità

Le soglie da 900 a 380px sono molte e alcuni pattern si ripetono a 520/600/760px con scopi locali. L’ordine e la specificità delle regole in un singolo file molto esteso possono far prevalere un override più vecchio o più specifico. Dopo le correzioni funzionali, consolidare le regole comuni per header, map controls, dialog e touch targets, mantenendo eccezioni per pannelli che hanno bisogno di scroll o tavole dense.

## Dimensioni da misurare in browser/dispositivo

Queste verifiche non sono state eseguite, per il vincolo di audit statico:

1. Larghezza/altezza CSS viewport e scroll orizzontale globale a 320, 360, 390 e 430 CSS px; controllare anche 768, 820 e 1024 CSS px per tablet e layout intermedio.
2. Box renderizzato e area cliccabile (bounding box e hit area, inclusi elementi `::before` o label) di ogni pulsante touch prioritario: header, topbar, controlli mappa, close/minimize, azioni nei pannelli, checkbox e swatch. Registrare larghezza × altezza in **CSS px**, non solo la dimensione dell’icona.
3. Altezza renderizzata di header/topbar/dock e area mappa rispetto a `visualViewport`, in portrait/landscape; ripetere con tastiera aperta, browser chrome visibile/nascosta, notch/safe area e font o zoom aumentati.
4. Scroll: pagina, drawer, modal, tabelle, colonna controlli mappa; verificare che ogni controllo resti raggiungibile e che lo scroll/touch non venga interpretato come pan o disegno sulla mappa.
5. Tablet portrait e landscape: quanto spazio usa la mappa, quali pannelli affiancano o coprono la mappa, e se i target restano proporzionati invece di diventare semplicemente più grandi col modo half/full.
6. Input iOS/Android reali: dimensione del testo dopo focus, comportamento dei select nativi, hover/focus tooltip su touch, doppio tap, gesture zoom/pan e focus visibile per tastiera.

## CSS px e dimensioni fisiche

I numeri come `36px`, `44px` o `980px` in questo report sono **pixel CSS** dichiarati o risultanti da CSS. Un CSS px è un’unità logica del layout browser: non equivale necessariamente a un pixel fisico dello schermo. Il rapporto tra pixel CSS e pixel fisici dipende dal device-pixel-ratio, dallo zoom, dalla scala del sistema e dal browser. Anche `rem`, `vw`, `vh` e `dvh` sono unità di layout, non pollici.

Non si possono convertire questi valori in pollici fisici a partire dal solo HTML/CSS. Per misurare dimensioni fisiche servono il dispositivo/browser specifico e una misura o calibrazione sullo schermo; il numero di pollici della diagonale del dispositivo non basta a ricavare l’altezza fisica di un controllo senza densità e scala effettive.

## Riferimenti del sorgente

Intervalli e righe sono indicativi del checkout ispezionato e possono cambiare mentre il monolite è in lavorazione: viewport e base (5, 131–147); touch coarse e tabelle (1450–1470, 1350–1372); controlli mappa (2287–2715); regole GIS mobile (12533–12758); breakpoint globali (vedi inventario); `.btn` e `.btn-sm` (4345–4434); dialog e close (6948–6988).
