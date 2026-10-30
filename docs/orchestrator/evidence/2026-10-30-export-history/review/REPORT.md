# Review indipendente — build268 candidate

Candidate: SHA256 51a3e9821d0f70c57ad23adb7f10bd66ee6214065ce0e0c7abc9870cc681a11d; base runtime build267. Reviewer distinto dall'implementatore. **PASS scoped**; decisione gate all'orchestratore.

- Esporta/Strumenti: differenza verticale e altezza zero su quattro viewport (1920,1024,390,320). Menu click, Escape e focus PASS, zero pageerror. check.cjs/results.json.
- Strumenti GIS: apertura, azione Note, toggle, minimizza/ripristina, chiusura, Escape PASS su desktop/390/320. Hit-test a griglia sulla mappa con pannello aperto rileva punti raggiungibili (1979/31/32); non copre ogni punto. lifecycle.cjs/lifecycle-results.json.
- Trascinamento e resize reali PASS, sequenza GIS→modalità classica simulata: backdrop e chiusura PASS. Il primo candidate 1fe0ba7 era FAIL per backdrop che intercettava ×, corretto prima di questo candidate. drag-classic.cjs/drag-classic-results.json.
- Note desktop/mobile: apertura, scorrimento fino a fondo e chiusura PASS, zero pageerror. Dataset annidato in details, inizialmente collassato; test non percorre ogni sezione con interazione umana. notes.cjs/notes-results.json.
- Confronto automatico indipendente di markup e dataset fornito work/release-history/numbered-builds.json: 267 summary unici, nessun numero mancante 1–267, status/date/SHA/ID/dettaglio e lista subject corrispondono a dataset; 192/192 righe pre-numerazione trovate. data-check.py/data-results.json. Analisi del blocco: zero script e attributi on-event. Subject con caratteri speciali sono HTML-escaped e confronto eseguito a testo decodificato.
- Build236/239 etichettate candidate non promosse, 222/227 distribuite con QA fallita e corretta. Frase originaria che imputava ogni commit alla build successiva è stata corretta; ora descrive raggruppamento dall'inizio di una build fino alla successiva, precisando che i commit da soli non attestano deploy e che lo storico è incompleto.
- Campione di sei SHA/build (1,70,176,236,239,267) verificato con git show; i subject corrispondono. Questa verifica non dimostra ogni dettaglio delle 267 build, le evidenze di deploy individuali né la completezza della storia.
- I test Chromium intercettano/bloccano rete esterna, non attestano salute provider; niente dispositivo fisico, stampa/export effettivi o prova estesa di ogni azione GIS. Non è QA operatore o ABQA HTTP.

Evidence work/export-review: check.cjs/results.json, lifecycle.cjs/lifecycle-results.json, drag-classic.cjs/drag-classic-results.json, notes.cjs/notes-results.json, data-check.py/data-results.json. Nessuna modifica a runtime o VPS.
