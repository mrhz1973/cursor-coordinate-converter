# Review indipendente della correzione UTM — 2026-10-30

Candidato revisionato SHA-256 `9bfbf87c475f9067197030bccedbcb5cef8c3c0e59483eab0f5b0bfbc4af9395` basato su runtime `2cb519c...`. La review precedente aveva trovato due errori nella gestione delle origini e un problema nell'editor sul cambio formato; tutti corretti e riverificati nel candidato.

Sono stati ripetuti i test del nucleo con 594 vettori e, in Chromium isolato, le 36 transizioni fra sei formati, le modifiche esplicite valide e invalide, l'equatore e la persistenza di un waypoint dopo il ricaricamento. Altri 10.879 casi controllano invarianti implementativi, senza costituire un oracolo geodetico globale. Nessun blocco dimostrato nei flussi esaminati.

Un rischio preesistente è stato riprodotto anche sulla base: mentre un editor waypoint è aperto, uno spostamento esterno del punto può essere sovrascritto dal successivo salvataggio dell'editor. La review non ha rilevato attribuzione impropria della sorgente nel candidato in quel caso. Da correggere e testare separatamente.

Limiti aperti: fasce e zone ai confini esatti, permalink che salvano solo coordinate arrotondate, importazioni e trasformazioni non interamente verificate, dispositivi fisici e concorrenza. Non è una certificazione mondiale. La patch è stata poi applicata insieme al fix Workbench: serve QA del file integrato effettivo prima del deploy.
