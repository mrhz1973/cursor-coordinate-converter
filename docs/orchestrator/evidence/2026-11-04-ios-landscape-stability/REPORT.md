# Build 273 candidate — stabilita viewport in landscape

## Sintomo e diagnosi

L’utente riferisce che Build 272, su iPhone in orizzontale, fa oscillare l’intera vista e rende difficile premere i pulsanti; Build 271 in precedenza era utilizzabile in landscape. Il report dell’utente è la prova del difetto reale, ma non include modello/versione iOS o una registrazione video.

La review comparativa del codice ha isolato una modifica nuova in Build 272: la mappa e l’header animano l’altezza per 180 ms. La mappa usa `100dvh`, che può variare mentre Safari mostra o nasconde i propri comandi dopo la rotazione. L’ipotesi è che le variazioni successive ritargettino l’animazione e facciano muovere la mappa mentre si tenta di toccarla. È un’ipotesi plausibile dal diff, non una diagnosi dimostrata sul dispositivo fisico.

## Modifica candidata

- Rimossa la transizione di altezza di `.gis-map-mount` e dell’header compatto in landscape.
- Lasciate invariate geometria, breakpoint, menu Layer, pulsanti, modalità fullscreen e comportamento portrait.
- Etichetta runtime candidata: Build 273, `GIS-IOS-LANDSCAPE-STABILITY-A`.

## Verifica controllata

`stress-viewport.js` confronta Build 272 e 273 nella stessa sessione Edge/Chromium, con input touch emulato e identiche sequenze di sette altezze rapide sui profili 844×390 e 667×375. Registra lo scarto dell’altezza mappa dal valore atteso 45 ms dopo ogni variazione, la geometria finale e l’apertura del menu Layer.

| Viewport | Build 272: massimo scarto transitorio | Build 273 | Geometria finale / Layer |
| --- | ---: | ---: | --- |
| 844×390 | 17,23 px | 0 px | Conforme / PASS |
| 667×375 | 22 px | 0 px | Conforme / PASS |

Entrambe le build finiscono con altezza corretta e il menu Layer si apre dopo la sequenza. In questa prova specifica, rimuovere le transizioni elimina il ritardo misurato della mappa durante i cambi ravvicinati della viewport; non dimostra che Safari su iPhone reale sia già stabile.

## Valutazione del metodo

Decisione del Valutatore: **CORREGGI_PASSAGGIO**. Il gate della Build 272 verificava la composizione e le dimensioni statiche in Chromium, senza misurare il comportamento durante ridimensionamenti ripetuti; il report dichiarava Safari e viewport dinamica non verificati. La correzione del gate consiste nell’aggiungere questo confronto temporale e verificare i tocchi dopo la sequenza. Il revisore UI ha individuato le due transizioni nuove in Build 272 come causa candidata; il confronto automatizzato mostra il beneficio misurato su Chromium.

## Limiti e checkpoint

- Safari e Chrome su iPhone fisico restano **NON VERIFICATI**. Playwright WebKit non è installato in questo ambiente; non è stato installato un nuovo browser per questo intervento.
- La simulazione automatica modifica la finestra del browser, ma non riproduce i controlli dinamici di Safari né l’animazione hardware di rotazione.
- Nessun test ha caricato mappe esterne; la prova copre la geometria del mount e il comando Layer.
- Prossimo passo: distribuire questa patch solo dopo il gate locale; poi l’utente/Nicola può confermare su Safari reale se l’oscillazione e l’instabilità al tocco sono scomparse.
