# Riepilogo — Bugfix reset totale dati locali (modal bloccato “Cancellazione in corso…”)

Data: 2026-04-30 16:37

## Problema osservato

- All’avvio l’app mostrava il modal **“Cancellare tutti i dati locali?”** già in stato **“Cancellazione in corso…”**, con input già compilato **“CANCELLA”** e pulsante disabilitato.
- Il dialog restava sopra l’app (backdrop) bloccando l’uso della mappa; di conseguenza gli **overlay mappa** (bbox, Range Rings, Misura, ecc.) risultavano “invisibili” perché coperti/ostruiti.

## Causa probabile (root cause)

- Il dialog `<dialog id="appFullResetDialog">` può rimanere **aperto e “busy”** se una cancellazione precedente non termina (es. IndexedDB non risponde) oppure se il browser ripristina lo stato della pagina.
- In quello stato la chiusura standard è impedita: `closeAppFullResetDialog()` rifiuta la chiusura quando `#appFullResetBusy` è visibile (`display:block`).

## Fix applicato (minimo e sicuro)

1. **Recovery al boot**: nuova funzione `recoverAppFullResetDialogStuckOnBoot()` che:
   - rileva se il dialog risulta già `open` e/o `busy` al caricamento;
   - **resetta la UI** (input, errori, busy) e **forza la chiusura** del dialog (anche se era in “busy”).
   - viene chiamata in `init()` subito dopo `bindUI()`.

2. **Timeout su cancellazione IndexedDB**:
   - `idbClearAllTilesOrThrow()` ora è atteso con `Promise.race()` e timeout a **12s**;
   - se scade, viene mostrato un errore interno e la UI esce da “in corso” (nessun overlay bloccante infinito).
   - aggiunta chiave i18n `settings.fullReset.errIdbTimeout` (IT/EN/FR).

## File / funzioni toccate

- `coordinate_converter Claude.html`
  - `recoverAppFullResetDialogStuckOnBoot()` (nuova)
  - `init()` (aggiunta chiamata recovery dopo `bindUI()`)
  - `performAppFullLocalReset()` (timeout su `idbClearAllTilesOrThrow()`)
  - i18n: `settings.fullReset.errIdbTimeout` (IT/EN/FR)

## Cosa NON è stato toccato

- **Misura M6** (overlay polish) non modificato.
- Nessun refactor globale di IndexedDB/offline tiles/cache; solo wrapping con timeout nel flusso reset già esistente.
- Nessuna chiamata automatica a geolocalizzazione / rete; OPSEC/offline invariati.

## QA eseguito (Cursor)

- `git diff --stat`
- `git diff --check -- "coordinate_converter Claude.html"`
- Estrazione JS inline in `/tmp/coordconv_inline.js` + `node --check`

## Rischi residui / note

- Se IndexedDB è realmente bloccato dal browser (tab/worker/permessi), il timeout evita il blocco infinito ma il reset potrebbe richiedere un secondo tentativo o intervento manuale nelle impostazioni del browser (già suggerito da `settings.fullReset.errIdb`).

## Stato git / autosync

- Working tree: **modificato** (bugfix nel monolite).
- Memoria orchestratore: questo file creato; `latest.md` aggiornato nello stesso intervento.
- Commit/push: **non eseguiti** in questo intervento.

