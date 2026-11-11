# Automated Browser QA LIVE Build 287 — HTTPS nativa

**Metodo:** Edge CDP su AsusDesktop, URL HTTPS /gis realmente servito, senza sostituzione HTML o server locale. Runtime Build 287 e SHA-256 fdb28dd544a4f138b4e249b6fbc1d2257029e9fecff0fa5fd93fddf27fc559db, 11.115.745 byte verificati via smoke HTTP/HTTPS e curl Windows.

**Risultato finale: 60/60 PASS, 0 FAIL**, 0 POST, 467 richieste accessorie esterne bloccate.

- 960×650, 1024×768, 1366×768, 1440×900, 1920×1080: tutti i 12 comandi principali sono visibili, allineati nella stessa fila orizzontale, 64×50 px, nessun overlap o clipping.
- Caption sotto le icone visibili; aprono Poligoni e R&B senza flyout; Livelli rimane popup.
- Attivando Poligoni, Traccia rimane disattivata: aria-pressed=false e assenza classe active. R&B è indipendente analogamente. Traccia attiva soltanto quando si apre il proprio pannello e torna inattiva alla chiusura.
- Mobile emulato 390×844: etichette desktop nascoste, flyout previsti conservati e nessuna nuova funzionalità mobile.

**Storico della prova:** primo run postdeploy 55/60 con 5 casi di geometria falliti per harness stale, che richiedeva altezza minima 52 px nonostante il target di 50 px. Rettificato soltanto il limite del runner; rieseguita l'intera suite in HTTPS nativa 60/60 PASS. Non si tratta di una modifica al runtime o di un bug della barra.

**Limiti:** la console generale e pageerror non sono raccolti separatamente; 467 richieste esterne sono state bloccate intenzionalmente dal test. Nessun PASS su 38 finestre distinti, nessun telefono fisico, nessuna QA operatore dichiarata.
