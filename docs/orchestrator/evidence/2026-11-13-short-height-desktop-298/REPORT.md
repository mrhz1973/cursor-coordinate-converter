# Audit desktop altezza ridotta - TMAR GIS Tool Build298

Data: 13 novembre 2026. Test tecnici read-only, non una nuova build e non QA operatore.

## Fonte e ambiente
GitHub origin/main al preflight ccf02885476a2461ac72b8a732fc7216e63a692d. Runtime HTTPS nativo Build298, code source 651c872b914025d6f0e84b19e51313b92599342b, SHA256 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca. TMAR Desktop Commander Windows su AsusDesktop, Microsoft Edge CDP con profilo isolato, nessuna injection HTML. Richieste esterne bloccate, 0 POST, 0 eccezioni JavaScript.

## A. Geometria e chiusura dei 20 dialog brevi
Apertura DOM sintetica showModal senza operazioni effettive; hit-test sui controlli Chiudi, nessun click su conferma o comandi distruttivi.

| Viewport | Dialog | Geometria entro viewport | Chiudi raggiungibile |
| --- | ---: | ---: | ---: |
| 960x540 | 20 | 20/20 PASS | 20/20 PASS |
| 960x400 | 20 | 20/20 PASS | 20/20 PASS |
| 1200x500 | 20 | 20/20 PASS | 20/20 PASS |
| 1280x720 | 20 | 20/20 PASS | 20/20 PASS |
| Totale | 80 | 80/80 PASS | 80/80 PASS |

Titoli ARIA gia valorizzati 72/80: le 8 assenze sono i 2 titoli dinamici su ciascuna delle 4 viewport, che nei percorsi applicativi reali del report precedente risultano valorizzati correttamente. Non dedurre un difetto da apertura DOM artificiale.

## B. Raggiungibilita dei pulsanti dopo scorrimento
Tutti i pulsanti con box di layout visibile nei 20 dialog: scrollIntoView block nearest e hit-test elementFromPoint al centro, senza cliccarli.

| Viewport | Controlli testati | Hit-test raggiungibili |
| --- | ---: | ---: |
| 960x400 | 70 | 70/70 PASS |
| 1024x480 | 70 | 70/70 PASS |
| Totale | 140 | 140/140 PASS |

Queste prove verificano la geometria dopo scorrimento, non il comportamento funzionale dei pulsanti o i controlli intenzionalmente nascosti.

## C. Sei dialog da funzioni opener reali

| Dialogo | 960x400 | 1024x480 | 1280x540 |
| --- | --- | --- | --- |
| Esporta waypoint | PASS | PASS | PASS |
| Importa waypoint | PASS | PASS | PASS |
| Esporta traccia | PASS | PASS | PASS |
| Picker Astro waypoint | PASS | PASS | PASS |
| Picker Astro preferiti | PASS | PASS | PASS |
| Esporta JPG | PASS | PASS | PASS |

18/18 PASS: funzione opener reale, testo titolo non vuoto collegato via aria-labelledby, geometria entro viewport, chiusura via Escape. Nessuna esportazione/importazione/download eseguita.

## Rete, limiti e NEXT
Richieste verso terzi intenzionalmente bloccate rispettivamente 128, 67 e 561 nelle tre suite; nessun POST e nessuna eccezione JavaScript. Nessun intervento sul runtime, cache, OPSEC, GPS, dati waypoint, VPS o mobile. NON e una certificazione generale delle 38 finestre o dei flussi di esportazione/importazione.

Nessun difetto confermato, nessuna Build299 richiesta. Il NEXT canonico resta QA operatore con zona D-Flight reale sulla Build298, impossibile da attribuire a un test con fixture sintetica. QA umane Build294 e Build295 separate e PENDING, mobile PAUSA.
