# Correzioni finestre GIS — staging isolato

30 ottobre 2026. Base `coordinate_converter Claude.html`: SHA-256 `b5a8c27f60f350ef1b914d29de4efefb7aa89d9c5cca4cce5ee972a8c521d6b5`. Copia corretta: `ef1631aa74f3226cef25d2a5637d62ca264954a8be55d4606d99893620dc8cab`. Patch: `60d5569ff60970861641e78ddbc27e6fd5de2e0cc7cc1884fae467c48c9d58e2`. La patch è stata applicata a una copia indipendente: il suo SHA coincide con quello della copia corretta. Checkout principale non modificato e nessun deploy.

## Cause e interventi

- Converti calcolava l'ancoraggio al bordo destro della barra usando la larghezza iniziale del dialogo, prima di applicare la dimensione definitiva; il clamp consentiva visibilità parziale. La dimensione predefinita è ora applicata prima dell'ancoraggio e l'ancoraggio iniziale è contenuto nel viewport. Il ramo dei layout spostati dall'utente conserva la logica precedente, compresa la visibilità parziale intenzionale.
- Il dialogo Converti aveva un titolo visibile senza associazione semantica. `aria-labelledby` ora punta all'ID del titolo già tradotto.
- L'altezza iniziale di Mappe Offline era limitata rispetto all'intero viewport, senza tenere conto della barra superiore. Nel solo layout non spostato, l'altezza viene limitata allo spazio disponibile sotto la posizione effettiva, lasciando scorrere il corpo. I layout segnati come spostati mantengono il comportamento esistente.

## Prove

Chromium headless con Playwright, server HTTP loopback, profili nuovi, service worker disabilitati e rete esterna bloccata. Vista GIS, lingua italiana e tema predefinito; nessun dato utente. Alle larghezze 320 e 390 (altezza 844), e 1024, 1365 e 1920 (altezza 768): apertura, posizione, chiusura Escape e riapertura di Converti e Offline; verifica del testo associato al nome di Converti; apertura e Escape di Cerca, Preferiti, Cronologia e Strumenti. Tutti i controlli automatici previsti sono passati; risultati dettagliati in [test-results.json](test-results.json), script ripetibile in [test.cjs](test.cjs).

Converti e Offline sono stati anche aperti a 1365×768 e poi ridimensionati a 390×844: risultano visibili nei limiti verificati. Un trascinamento reale seguito da chiusura e riapertura a 1365×768 ha conservato la posizione nella sessione (Offline con variazione di 1 px). Le schermate anonime `320-converti.png`, `390-offline.png`, `1365-converti.png` e le altre corrispondenti sono nella cartella del rapporto. Su mobile Offline conserva lo scorrimento interno; la schermata mostra il bordo inferiore entro il viewport.

Limiti: prova delle posizioni spostate solo nella stessa sessione, senza ricaricamento o riavvio; non coperti lettori di schermo, modalità classica, zoom, tastiera virtuale, altri temi/lingue, resize di ogni pannello, condizioni di viewport di altezza estremamente ridotta o flussi con dati. Le richieste esterne sono state bloccate, quindi le tile non sono valutabili. Il test dei pannelli campione verifica apertura e Escape, non tutti i contenuti o flussi.

## Integrazione dopo review indipendente

Il listener di ridimensionamento manteneva l'ordine precedente e a 390×844 → 844×390 collocava Converti a x=464 con larghezza 680, oltre il bordo destro. Anche quel ramo ora applica la dimensione prima dell'ancoraggio. Inoltre, per il layout predefinito, l'altezza viene contenuta nello spazio sotto la barra superiore: nel caso landscape il rettangolo risultante è x=150, y=123, 680×255, interamente nel viewport. Il layout manuale segue il ramo precedente.

Ripetute con successo le prove 390×844 → 844×390, ritorno 844×390 → 390×844, 390×844 → 1365×768 e 1365×768 → 390×844. Dopo trascinamento a 1365×768, un resize a 1500×800 e la riapertura hanno conservato la posizione manuale. Dettagli e schermate in [resize-results.json](resize-results.json) e `resize-*.png`; test in [resize-test.cjs](resize-test.cjs). Il controllo di visibilità in questi quattro casi riguarda entrambi gli assi.

La review ha inoltre rilevato un comportamento preesistente separato: dopo resize di Offline 1365×768 → 844×390 → 1365×768, l'altezza resta ridotta fino alla riapertura. Non è stato corretto in questa patch. La verifica della posizione manuale non copre persistenza dopo ricaricamento o riavvio.

La review segnala anche che il ripristino di Offline con posizione parzialmente fuori viewport è già ricondotto entro i limiti da gisPanelApplyLayout: è un comportamento preesistente, non una garanzia di conservazione esatta di ogni posizione parziale.
