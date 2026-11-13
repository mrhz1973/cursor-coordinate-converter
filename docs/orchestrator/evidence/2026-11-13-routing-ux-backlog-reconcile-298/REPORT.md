# Ricognizione B0 backlog UX Routing - Build298

Data 13 novembre 2026. Fonte LIVE: GitHub origin/main 4085cbf9d6b886bda0ece5c7777933b2c3bc5ba3 al preflight, runtime Build298 sorgente 651c872b914025d6f0e84b19e51313b92599342b, SHA256 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca. WU-0010 ?6 e una fonte strategica/storica, non stato vivo alternativo a FRONTIER. Il termine 'non implementato in C' si riferisce alla vecchia milestone C, non dimostra assenza nel runtime attuale.

## Perimetro e verifica

Solo preflight B0 read-only, tramite TMAR Desktop Commander Windows su AsusDesktop e Microsoft Edge CDP con profilo isolato, pagina HTTPS Build298 nativa senza injection. Provider terzi bloccati, zero richieste POST e zero Runtime.exceptionThrown. Niente routing request, map click, GPS, salvataggio o dati dell'operatore; cambi di coordinate di prova eseguiti e ripristinati esclusivamente nella sessione isolata.

### ROUTING-INCOMPLETE-POINT-FEEDBACK-A

Evidenza del runtime: elemento routingPointsFeedback con aria-live polite, routine routingSyncPointsFeedback che conta routingPointIsPositioned e presenta istruzioni differenziate per zero o un punto, poi nasconde il messaggio una volta che i punti posizionati sono almeno due.

| Stato transiente osservato | Feedback |
| --- | --- |
| 0 punti posizionati | Visibile: 'Aggiungi almeno partenza e destinazione' |
| 1 punto posizionato | Visibile: 'Aggiungi la destinazione' |
| 2 punti posizionati | Messaggio nascosto / vuoto |

Lo stato punti di sessione e stato ripristinato dopo il test. Lo stato disabled del pulsante Calcola con due coordinate sintetiche non e stato assunto come bug o readiness, poiche la verifica non ha invocato la completa sincronizzazione di routing o la validazione del provider.

### ROUTING-POINT-ACTIVE-BADGE-A

Evidenza corrente: routingRenderList usa routingPointBadge per A/B, routingEnterPickMode e routingExitPickMode per la selezione, data-active e aria-label per il punto attivo.

| Stato | Badge A | Badge B |
| --- | --- | --- |
| Idle | Non attivo | Non attivo |
| Pick A | Attivo, 'Punto attivo A' | Non attivo |
| Pick B | Non attivo | Attivo, 'Punto attivo B' |
| Exit pick | Non attivo | Non attivo |

Queste osservazioni sono test di stato UI, non attestano un punto realmente selezionato sulla mappa o il trattamento delle coordinate del provider.

## Conclusione e gate

I due nomi del backlog del vecchio Bundle C sono gia rappresentati da comportamento funzionante della Build298 e NON devono essere duplicati automaticamente. Questo non chiude formalmente una WU con Regola H, non esegue review esterna e non certifica scenari aggiuntivi. Gli altri ID in WU-0010 (grade metrics, result focus, blocked-action feedback e gateway mondiale) non sono stati scelti o implementati qui. OUTDOOR-ROUTING-API-GATEWAY-A rimane BACKLOG NON APERTO, con decisioni ancora necessarie su provider/costi/OPSEC.

Nessuna Build299, nessuna modifica HTML o deploy. FRONTIER resta Build298 LIVE, QA operatore D-Flight reale PENDING, QA umane Build294/295 PENDING, sviluppo mobile PAUSA.
