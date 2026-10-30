# Review indipendente — provenienza MGRS, slice parziale

Patch `d161d9fd541c8dda504ff1e91af6fa89238cb0e216a7606fa8fde66c3eb77336`, candidato `d15e860382b4e57b28f710715250a7ae105fd7da29988404b6cb71633c90c4a6`, base `231db582...`. Non trovati nuovi blocchi nel perimetro verificato, dopo più cicli di correzione.

Controllati con interazioni browser: centratura del preferito e revoca dopo modifica osservata, avviso visibile al trasferimento da punto convertito con editor chiuso, rollback su quota simulata con 200 preferiti e 10 elementi cronologia, avviso dopo cambio lingua, testo lungo 5015 caratteri, codice XML con caratteri di controllo, celle al margine superiore UTM e punto indipendente con coordinate coincidenti.

La soluzione è parziale: waypoint e tracce non conservano ancora l'origine MGRS; avvisi sono previsti nei trasferimenti controllati, non tutti i possibili percorsi sono verificati. La validità geodetica della cella non è garantita e la prova non certifica precisione globale. L'anchor preferito verifica le modifiche quando viene letto: non dimostra di rilevare modifiche transitorie non osservate. Richiesta QA sul file integrato effettivo.
