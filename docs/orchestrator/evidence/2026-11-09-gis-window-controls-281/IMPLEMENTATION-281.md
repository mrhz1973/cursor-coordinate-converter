# Implementazione candidata Build 281 — GIS-WINDOW-CONTROLS-A

**Stato: IMPLEMENTATA, non committata/pubblicata/distribuita da questo agente.** Data: 09/11/2026 16:33:32 Europe/Rome. Il root gestisce commit immutabile, review, browser QA e gate successivi.

**Sequenza verificata/comunicata:** al momento dei controlli di implementazione di questo agente il runtime era ancora non committato. Successivamente il root ha comunicato la creazione del commit locale `0c0f6785654dbba279774bb8569788088f0762e9`, blob `3dcff61081a2f461f8841953986ced17b058eab1`, con lo stesso SHA256 candidato. Questo aggiornamento non sostituisce il fatto storico dei controlli e non costituisce evidenza di push o deploy; review indipendente e QA browser sono gestite dal root.

| Identità | Valore |
| --- | --- |
| Worktree | `/workspace/scratch/bcbe375c6817/gis-windows-281` |
| Base documentale | `63d4fd7b3bbd2b02fe10d8e2180c58c31b9e11d0` |
| Runtime base | Build 280, `c33f58c956e9630b03f9ff86eb35eccd35879a4a` |
| SHA base | `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |
| Runtime candidato | Build 281, `GIS-WINDOW-CONTROLS-A` |
| SHA candidato | `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62` |
| Dimensione candidata | 11.108.861 byte |
| Diff | 8 aggiunte, 10 rimozioni, **solo** `coordinate_converter Claude.html` |

Il perimetro deriva dal [TASK DELTA](TASK-DELTA.md). Le tre anomalie della baseline sono state riprodotte dall'audit browser del collega e comunicate dal root; questa implementazione non attribuisce una propria nuova esecuzione di quelle prove.

## 1. Converti: nome accessibile

Aggiunto `aria-labelledby="convertModalTitle"` al dialog `#convertModal` e `id="convertModalTitle"` al suo **h2 esistente**. Sono conservati classe `.app-modal-title`, testo e `data-i18n="convert.title"`.

Prima del delta c'erano un solo dialog e un solo h2 pertinente, zero ID `convertModalTitle` nel DOM e zero occorrenze di quel nome nell'intero sorgente. Dopo il delta l'ID è univoco e il riferimento punta al titolo originale. Il CSS `#convertModal .app-modal-title` continua a selezionare lo stesso elemento. Non viene introdotta una stringa tradotta distinta che possa divergere dal titolo visibile.

## 2. Astro: geometria mobile affidata al layout esistente

Nella sola media query `@media (max-width:600px)` per `body.gis-mode dialog#astroPanel.astro-panel` sono rimosse le tre righe che forzavano:

- `left/right/top/bottom`, con `top:0!important`;
- `width/max-width`, con larghezza viewport forzata;
- `height/max-height`, con altezza indipendente dall'area utile.

Sono conservati `border-radius:0` e il gap di 6 px della riga sorgente, il CSS condiviso e tutti gli helper/default JavaScript. La regola base GIS già imposta posizione fissa, margine zero, `right/bottom:auto`, overflow nascosto e limiti viewport. Il percorso `wireAstroPanelFloatingGis` → layout → `clampAstroPanelRect` già scrive `left/top/width/height` inline e conserva la geometria.

Valori esistenti acquisiti dal collega lifecycle: pad 12, minW 360, minH 240, defaultW 480, defaultHeightFraction 0,52, cap 560, topbarReserve 104, bodyMinH 120, partialMinVisible 72. Nessuno di questi valori viene modificato. Rimuovere soltanto `top!important` avrebbe lasciato un'altezza forzata indipendente dalla posizione utile: il delta restituisce invece l'intera geometria allo stesso percorso già esistente.

## 3. Escape: rispetto dell'evento già gestito e delega GIS

Ordine statico verificato nella base: `init` invoca `bindHotkeys()` a L103753 e poi `gisInit()` a L103795. Il primo registra un listener `document.keydown` in bubble (default), il secondo registra il listener a L81239 esplicitamente con `false`. Le registrazioni e il loro ordine non sono cambiati.

- Nel **solo ramo Escape** di `bindHotkeys` viene inserito `if (ev.defaultPrevented) return;`.
- Dopo il filtro Escape del secondo listener viene inserita la stessa guardia.
- Nel ramo finale di `bindHotkeys` che delega GIS viene tolto **soltanto** il `ev.preventDefault()` incondizionato; il ritorno rimane.

Quest'ultima rimozione è necessaria: aggiungere soltanto la guardia al secondo listener avrebbe fatto risultare già consumato anche un Escape che il primo non aveva gestito. I rami di chiusura/annullamento che eseguono un'azione mantengono i propri `preventDefault`, `stopPropagation` o `stopImmediatePropagation` originari.

Non sono cambiate priorità, condizioni input, pick/disegno, conferme, native cancel, callback di chiusura, altri tasti o registrazioni. Questo significa identità del loro sorgente, **non** prova comportamentale già superata: la regressione mirata deve verificare che la diversa propagazione sia corretta anche nei percorsi di input e cancel nativo.

## 4. Metadati e note di rilascio

`APP_BUILD_ID`, `APP_BUILD_DETAIL` e `APP_BUILD_NUM` sono aggiornati al bundle 281. È anteposta una sola voce italiana alle note di rilascio, limitata al nome accessibile di Converti, alla doppia chiusura Guida/Converti e ai comandi Astro su schermo stretto. Nessuna nuova chiave i18n o modifica EN/FR. Le note e i byte della cronologia precedente sono conservati.

## Integrità e controlli eseguiti

- **10 sostituzioni univoche e dichiarate** in `implementation-integrity.json`, incluse le quattro voci di metadati/rilascio. La ricostruzione esatta dal blob base dimostra l'identità di tutti i byte esterni ai target.
- **192 CR isolati conservati**, zero CRLF e nessun BOM sia prima sia dopo. Scrittura binaria senza normalizzazione dell'intero file.
- **2/2 script inline: sintassi PASS** mediante Node `v24.22.1`; dettagli e hash in `syntax.json`.
- `git diff --check`: **PASS**. Un solo file runtime modificato nella worktree assegnata; nessun file di progetto, documento operativo o servizio modificato dall'agente.
- ID titolo Converti e collegamento ARIA verificati sul DOM candidato. Nessun calcolo dell'accessible name effettivo eseguito da questo controllo statico.

La prova d'integrità qualifica lo scope dei byte; non sostituisce la review della semantica o il browser QA. Gli esiti delle Build precedenti e il PASS operatore 280 non sono presentati come QA della 281.

## QA mirata necessaria

1. **Converti:** nome AX effettivo uguale al titolo visibile nella lingua corrente; apri/×/−/ripristino sui viewport già previsti.
2. **Escape:** Guida e Converti sovrapposti, una sola chiusura per pressione; delega a Converti rimasto; evento già gestito da input/rename o pick rispettato; cancel del dialog nativo conservato. Usare azioni browser reali, senza chiamare direttamente gli handler per dichiarare il PASS UI.
3. **Astro, stesso caso mobile 390 px:** header/×/− raggiungibili via hit test; drag verticale breve entro area utile, poi verso il bordo alto per il clamp; resize verticale dell'handle `.gis-panel-resize-handle.h-se` entro spazio disponibile; chiusura e riapertura con geometria conservata. Riutilizzare minimize/restore della matrice esistente. La minW 360 lascia poco margine X: non pretendere un grande trascinamento orizzontale a390 px.
4. **Desktop:** controllo mirato di assenza di regressione del layout e dei comandi già in matrice; nessuna matrice globale delle 38 finestre o ripetizione delle prove routing reali.

Tolleranza proposta per confronto dei bounds a riapertura: 1 CSS px dopo assestamento del layout. Le aspettative di area utile devono derivare da viewport/toolbar/hit test osservabili; non da chiamate dirette agli helper di clamp che si stanno verificando.

## Artefatti

- `runtime-281.diff`: delta del solo monolite.
- `implementation-integrity.json`: identità, ledger e prova di conservazione dei byte.
- `syntax.json`: controlli di sintassi effettivamente eseguiti.
- `apply_delta_281.py`: applicazione riproducibile, protetta dall'hash della base; non rieseguire sul candidato.
- `implementation-manifest.json`: hash degli artefatti.

### Finding di metodo contenuto

Due letture di sorgente hanno superato il budget d'output: una riga di cronologia release molto lunga e un estratto del secondo listener delimitato erroneamente fino a un callback successivo. Non sono state usate le parti non visibili come evidenza; la modifica release usa solo un marker univoco e i rami mancanti del listener sono stati letti successivamente per intervallo ristretto. Il report non attribuisce una review dell'intero monolite.
