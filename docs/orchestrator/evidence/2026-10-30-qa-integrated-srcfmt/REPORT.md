# QA mirata srcFmt integrato

File letto direttamente dal checkout; SHA-256 prima e dopo: `231db5825250d3a8ecde184feaf21f41f8d9249282d310f8e5c007af1e5d77f9`. Browser Edge headless in contesto isolato, richieste HTTP/HTTPS bloccate, chiuso al termine; nessuna modifica checkout o VPS.

Esito: PASS, nessun errore pagina. Ricerca coordinate UTM reale → waypoint srcFmt UTM → reload → modifica note nell'editor e salvataggio → secondo reload conservano entrambi srcFmt e note. In storage sintetico i valori null, numero, booleano, oggetto e array vengono scartati; una stringa di 40 caratteri viene limitata a 24 unità UTF-16; icona sconosciuta e campo extra vengono scartati. Markup malevolo conservato come dato troncato non crea il nodo img né attiva alert nel rendering del pannello waypoint e mappa provati. Risultati e script accanto a questo rapporto.

Limiti: i controlli UI e di sicurezza sono circoscritti ai percorsi sopra indicati, non sono un audit XSS generale; le prove non verificano il round-trip di srcFmt mediante esportazioni esterne. I valori già persi da storage in passato non sono recuperati.
