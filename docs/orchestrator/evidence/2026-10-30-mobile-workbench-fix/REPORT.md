# Correzione mobile — Oggetti GIS

Base: commit `a32791da767480c2af34671f8503e7cfa91a2e31`, SHA-256 HTML `2CB519C390B21EF5034F8254A44C850E8F474F0D6BA7FAE4F1663DE8B747D02B`. Solo copia di staging; nessuna modifica al checkout o VPS.

## Modifica

Nei viewport compatti il dialog diventa l'unico contenitore scorrevole, includendo filtri, import/export e lista. Il body non trattiene lo scorrimento touch; le righe si dispongono in modo che le azioni non escano in orizzontale. Nei viewport compatti la geometria predefinita viene adattata all'altezza visibile, anche dopo il clamp; i layout già modificati manualmente non vengono adattati. Non sono state aggiunte funzioni né modificati dati o storage.

`candidate.html` SHA-256: `86B5D1778C2E7AF753D50D91FCAAB35563CDFBCA80E22E943132FBEC357E6DF4`. La patch `workbench.patch` è stata applicata a una copia della base e il risultato ha SHA-256 identico al candidato.

## Verifiche

Chromium headless isolato con profili temporanei, dati sintetici e rete esterna bloccata; solo server localhost per il file. Dettagli in `results.json` e script riproducibili `test.cjs` e `manual.cjs`.

- 320×640 dark, 568×320 light e dark, 390×844 light, 320×480 light: 12 waypoint e una traccia sintetici; filtri WP, Tracce, Poligoni (stato vuoto), Tutti e ricerca; selezione, azione centra e apertura pannello waypoint. Gesti touch hanno spostato lo scroll del dialog; entrambe le azioni dell'ultima riga erano visibili e colpibili dopo scroll, 44×44 px.
- 820×1180 dark: filtri, selezione e apertura verificati con dati sintetici; azioni ultima riga visibili e colpibili. 1365×768 dark: confronto geometria e stile con base identici; selezione e apertura funzionano. Il clipping desktop preesistente della lista, riscontrato anche nella base a questa altezza, rimane fuori da questa correzione mobile.
- A 568×320 il pannello predefinito misura 154 px e termina a y=308; a 320×640 termina a y=506. Tema chiaro/scuro verificati nella matrice. A 390×844 un layout manuale `{left:20, top:180, w:345, h:300, touched:true}` coincide con la base e resta invariato dopo chiusura e riapertura.
- La verifica è basata su emulazione Chromium, non su dispositivi fisici. Le richieste esterne erano bloccate e le mappe non sono state valutate.

Limite della prova: il gesto touch ha prodotto scorrimento, ma per portare in vista l'ultima riga il test ha poi usato scrollIntoView; non è stata completata una sequenza di swipe fino al fondo. Il filtro poligoni è stato verificato solo nello stato vuoto; la prova supplementare con poligono popolato non è stata completata. L'azione centra è stata toccata senza verificare separatamente il cambiamento della mappa.
