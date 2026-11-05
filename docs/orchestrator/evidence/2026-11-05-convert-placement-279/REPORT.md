# Build 279 — posizionamento iniziale Converti

La prima apertura di Converti poteva lasciare fuori viewport il pulsante: a 1280x1600 il pannello risultava a x=-146 e il pulsante a x=-102. Ora la prima apertura usa il clamp viewport intero; il drag mantiene la possibilità di posizionamento parziale e la posizione utente viene preservata.

QA browser su SHA bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253: desktop 1280x1600, mobile 390x844 e 320x568, pannello visibile e conversione PASS; drag al bordo, recupero e riapertura con posizione salvata PASS; nessun errore JS. Test eseguiti da agente indipendente in locale, non su iPhone fisico.
