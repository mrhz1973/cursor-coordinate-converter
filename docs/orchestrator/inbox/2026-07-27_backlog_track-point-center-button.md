# Backlog — TRACK-POINT-CENTER-BUTTON-A

**Data:** 2026-07-27  
**Stato:** **CLOSED / PASS end-to-end** (2026-08-01) — tip runtime **`0482ef8`** / **`B6.3TPC-A · build 96`**; QA «**QA TRACK-POINT-CENTER-BUTTON-A PASS operatore**»; finito Regola H  
**Tipo:** UX Track Builder, ROUTINE  
**File runtime:** `coordinate_converter Claude.html`

## Richiesta operatore

Aggiungere un pulsante **Centra** su ogni singola riga della lista punti di una traccia, così da portare la mappa sul punto selezionato senza avviare GPS, tracking o altre azioni implicite.

## Contratto funzionale proposto

- Il pulsante agisce solo su input esplicito dell’operatore.
- Centra la mappa sul punto della riga corrente usando latitudine/longitudine già presenti in `state.track.points[]`.
- Non modifica coordinate, ordine, nome, stile o persistenza della traccia.
- Non cambia la sorgente canonica: `state.track.points[]` resta completa e autorevole.
- Con paginazione attiva deve usare l’ID o l’indice **globale** del punto, mai l’indice locale della pagina.
- Deve funzionare sulle pagine successive alla prima, compresa l’ultima pagina.
- Nessun GPS silenzioso, nessun live tracking, nessuna richiesta di rete.
- Nessun nuovo store o campo persistito.
- Riutilizzare un helper di centratura già esistente quando compatibile; evitare duplicazioni e refactor generali.
- Testi e tooltip in i18n IT/EN/FR; `data-i18n` sicuro, niente `data-i18n-html`.
- Il controllo deve restare compatto e non rendere la riga eccessivamente larga su desktop o mobile.

## QA minima futura

1. Centra sul punto 1 della prima pagina.
2. Centra sul punto 51 della seconda pagina e verifica che il punto corretto venga selezionato.
3. Centra su un punto dell’ultima pagina di una traccia da 2000 punti.
4. Verifica che nome, totale punti, ordine e persistenza restino invariati.
5. Verifica assenza di GPS, tracking e chiamate di rete.
6. Verifica IT/EN/FR e layout mobile.

## Fuori scope

- selezione automatica del punto sulla mappa;
- apertura popup complessi;
- modifica coordinate;
- drag cross-page;
- follow mode o tracking live;
- refactor del renderer Track Builder.

## Priorità

Da valutare nel prossimo bundle UX Track Builder, senza interrompere la QA e la chiusura di `TRACK-POINT-CAP-2000-FIX2`.
