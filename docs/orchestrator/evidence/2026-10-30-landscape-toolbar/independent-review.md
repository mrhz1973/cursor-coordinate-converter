# Controprova indipendente — toolbar riallineata

Base di test: copia del monolite corrente SHA-256 `710d1fc5003235c89c29ff09d81d9803c124479d2296e95b4c2c6427b6b82d2c`. La patch `e06ebc348a109183a0346e0f59af223035624fce17d7b2c865b4edb73dfdfbc2` si applica con `git apply --check`; l'applicazione alla copia produce SHA-256 `cf561136f4c1fe13215bd8751ae9d5729aa4b1833e77b366bb77dffe3e9daf76`. Questo è il file servito direttamente ai test. Nessuna modifica al checkout o VPS; profili browser isolati, richieste non locali bloccate.

A 568×320 e 844×390, chiusura del dialogo cartografico con Esc, Esc dopo attivazione MGRS e pulsante ×: in tutti e sei gli scenari il dialogo è chiuso e il focus torna al pulsante mappa. Un input UTM sintetico 46 S 389603 6540383 produce `46J CL 89603 40383`; punto, sorgente UTM, centro vista e zoom coincidono prima e dopo l'operazione in ciascun caso. Nessun pageerror registrato. Dettagli in `focus-utm-results.json`.

A 568×320, con Traccia in modalità pick e pannello minimizzato, un primo tap aggiunge un punto. Aprire e chiudere il dialogo cartografico non aggiunge punti e lascia attivo il pick; un secondo tap aggiunge esattamente il secondo punto. Dettagli `map-pick-results.json`.

La controprova risolve il finding focus precedente nei casi testati. Le prove sono su Chromium emulato: non verificano hardware, screen reader, tastiera virtuale, GPS reale, layer remoti, tutti i flussi mappa o l'intera suite UTM. Le precedenti prove di swipe e toolbar erano svolte sul candidato anteriore e non sostituiscono il rerun completo sull'hash eventualmente integrato. Il test di provenienza sopra riguarda lo specifico punto UTM e non garantisce tutti i confini o i casi di cambio zona.
