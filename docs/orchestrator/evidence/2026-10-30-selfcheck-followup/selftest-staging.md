# Selfcheck: correzioni candidate in staging, 30 ottobre 2026

## Stato

Il lavoro è fuori dal repository. Base immutabile `before.html`, SHA-256 `72b92bf76c26203aa28142e2f3a4ce7e65d27dacb7f79afd4acb2ddff81361b2`. Nessun commit, push o intervento server. Le patch sono verificabili con `git apply --check` sulla base indicata:

- `selftest-only.patch`: modifiche ai test e reporting; `candidate.html` è il risultato.
- `grip-only.patch`: sola correzione CSS mobile del pulsante di chiusura D-Flight; `grip-fix-only.html` è il risultato.
- `combined.patch`: le due modifiche, SHA-256 `759ef6529c03a2c4458d65be0710a66d07d9e31ed43899996379a804c8f46a67`; il risultato `candidate-with-grip.html` ha SHA-256 `d8294328ba4e0ae5f0a830ed41a1d383804d22e6add63d67b38aa327c147121d`.

**Non è un PASS generale.** La patch MGRS è a carico separato e non è inclusa: l'assert `QA MGRS cell identity` resta rosso. A 320 pixel rimangono inoltre cinque check aggregati rossi. Il CSS è separato dalla patch test perché riguarda il comportamento prodotto.

## Risultati automatizzati

Chromium headless, localhost, rete esterna bloccata, viewport indicati; contesti nuovi separati per `?debug` e per `GOIDflight.selfTest()` dopo 500 ms. I runner finali `run-combined.cjs` e `run-320.cjs` attendono esplicitamente il messaggio conclusivo `Self-check passed`/`Self-check failed` con timeout 10 s: un timeout è errore di prova, non PASS. `combined-results.json` e `combined-320-results.json` identificano SHA e risultati dettagliati. Il riferimento originale nelle stesse condizioni è `results.json` e `before-320-results.json`.

| Viewport | Originale: check falliti/totale | Combinata: check falliti/totale | Assert console `?debug` combinata |
| --- | ---: | ---: | --- |
| 1280×720 | 42/919 | 0/919 | MGRS |
| 1920×900 | 38/919 | 0/919 | MGRS |
| 390×844 | 42/922 | 0/922 | MGRS |
| 320×720 | 47/922 | 5/922 | MGRS e aggregato |

Nessun `Self-check passed` compare nei quattro casi: il log ora dipende dal conteggio locale degli assert; ogni assert resta emesso con `console.assert`, e una eccezione produce il log di errore. A 320 tutti i cinque nomi rossi sono presenti anche sull'originale; nessun nuovo nome. La differenza da 919 a 922 è dovuta a rami runtime della suite, non indica un numero fisso di test applicabili a tutte le dimensioni. Zero pageerror nei risultati finali; il blocco intenzionale della rete genera errori di risorsa separati e non valutati come errori del codice. La prova di `GOIDflight.selfTest` non equivale a PASS del percorso `?debug` generale, che contiene altri assert.

## Cambiamenti e negativi

- 32 controlli di build restano espliciti ma verificano ora un'invariante comune: numero intero positivo, forma ID, dettaglio, coerenza della label con title/footer/about/dettaglio. È conservato il controllo funzionale extra presente in `RPCF2_build_223`. `negative.json` verifica che un footer corrotto faccia fallire la verifica; il nome storico dei 32 check rimane per tracciabilità e non indica la build attesa.
- I quattro check ATM/MVISA allestiscono il flag del pannello aperto e lo ripristinano; il controllo ATM ripristina anche opsec, precedentemente mutato. `atm-restore.json` mostra prima/dopo uguale per flag pannello, master, preferenza, overlay, offline, opsec, timer, token e sessione nel caso di partenza chiuso; `negative.json` forza il sincronizzatore a non abilitare la preferenza e i tre check MVISA falliscono. Ciò non prova ogni possibile combinazione di sessione e timer attivi.
- `BLUX_no_hud_create_source` ora usa un elemento DOM sentinella e verifica rimozione, ritorno null e mancata ricreazione; un helper difettoso che non rimuove il nodo fa fallire il check (`negative.json`).
- I tre nomi DOCK_GD relativi a posizionamento/plan sono stati rinominati per aderire alla semantica. Il test confronta gli slot con il piano, controlla collisioni, misura posizione dei primi quattro prima/dopo il quinto e richiede l'uso della banda laterale se il primo chip vi entra, considerando padding e viewport. I test unitari storici di planner e overflow restano. In `dock-negative.json` un piano forzato all-row a 1920, senza collisioni e con 645 px disponibili a destra, fa fallire i tre controlli di layout mentre il collision guard rimane verde. I nomi nuovi non vanno interpretati come test scomparsi nei confronti automatici per nome.
- Il controllo grip NE verifica ancoraggi correnti, cursore e geometria reale di grip e X, aprendo temporaneamente l'attributo del dialog con visibilità nascosta, senza avviare il ciclo applicativo; stato ripristinato nel `finally`. È un test geometrico, non sostituisce azioni mouse. `grip-fix-test.cjs` prova drag e click X su originale e CSS isolato a 320, 390, 1280 e 1920: intersezione grip/X da 24 px² a 0 sui due viewport mobili, 0 invariato su desktop; drag e click X riusciti in tutti. A 320 la larghezza parte già al massimo e cambia l'altezza. `adjacent.json` verifica che i controlli di minimizzazione funzionino, non si sovrappongano alla X e che gli stili calcolati di tutti gli handle restino identici nelle quattro prove. Non sono state provate tutte le posizioni o orientamenti touch.
- `Roma-Abidjan` confronta ora il valore WGS84 4366,528479734 km (GeographicLib indipendente, `../selftest-resolution/independent.json`) con tolleranza 1 m. Il runtime distanza non è cambiato.
- L'esecuzione debug è spostata al successivo frame di animazione perché al momento originario `body` era ancora `gis-boot` e il test di raggiungibilità dock colpiva la mappa; `debug-diag.cjs` ha documentato la causa. Questo cambia solo l'avvio in debug. Un browser che sospende i frame in una scheda non visibile può sospendere il selfcheck: si deve attendere il messaggio conclusivo e trattare il timeout come non eseguito.
- A 390, il fixture EDGE fissava dialog a x=40 e width=400, ponendo il bordo destro fuori viewport: ora limita la larghezza al viewport e continua a testare il punto reale. Il test `HitA_FIX2_recovery_single_dispatch` isolato passa a 390 ma in suite veniva coperto dal pannello D-Flight precedentemente aperto; ora nasconde temporaneamente il pannello solo durante l'evento sintetico sul layer, ripristinando pannello e callback nel finally e mantenendo le verifiche di dispatch singolo e livelli. Non è una prova di click attraverso un pannello visibile.

## Cinque fallimenti rimasti a 320

- `HitA_FIX1_info_above_efp` e `HitA_FIX1_single_dispatch_info`: `hita-sequence.json` mostra che il punto sintetico viene coperto dal pannello D-Flight aperto nella suite; le prove isolate in `hita-diag.json` indicano che i medesimi layer ricevono il puntamento senza pannello. Probabile effetto di fixture/ordine, non prova di assenza di difetto in uso reale; restano rossi, senza modifiche ad essi.
- `DOCK_GA1_all_chips_rendered`: test storico conta solo chip visibili, mentre a 320 i tre pannelli non entrano tutti in riga e il dock supporta anche voci overflow; è plausibile un'aspettativa non aggiornata, ma non è stata verificata qui l'accessibilità/ripristino dell'elemento overflow nel caso specifico. Resta rosso.
- `WSF1_A_both_sbs` e `WSF1_B_solo_df_right`: pretendono che entrambe le legende siano affiancate e che quella sola si sposti strettamente a destra; la logica prevede anche posizionamento sopra quando il lato è troppo stretto. La disposizione e la fruibilità effettive a 320 non sono state misurate indipendentemente; rimangono aperti e rossi.

Servono prove manuali/automatiche mirate per quelle cinque voci, più riesecuzione su artefatto finale integrato MGRS/routing. I mock negativi provano che alcune regressioni sono rilevate, non esauriscono tutte le possibilità. L'API `selfTestAsync` e hardware touch reale non sono verificati in questo lavoro.
