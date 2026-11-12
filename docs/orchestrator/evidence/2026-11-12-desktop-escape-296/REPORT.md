# Build296 - quattro guardie Escape desktop su pannelli minimizzati

Data 12 novembre 2026. Blocchi QA precedenti: Build295 footer e Build294 Escape PENDING, non chiusi dalla nuova lavorazione.

## Identità
Repo mrhz1973/cursor-coordinate-converter, runtime coordinate_converter Claude.html. Base source Build295 main 42374ae49ec4ebdd9893c69ae1417ed2994f5f04; nuovo code source e222efc35b9d0dc988935ffd05464fee12417398, Git blob aebedfd05656166ec403c7ad85699061abde46ae, SHA256 380ee97a3cb82feba3592016011e7510b63df7aab4ec82bc786d842d3484e2ff, 11.128.759 byte, 192 CR invariati. Commit runtime unico file HTML: 16 righe aggiunte, 11 eliminate. Build ID GIS-MINIMIZED-WINDOW-ESCAPE-PRIORITY-C / numero 296, nota rilascio aggiornata.

## Diagnosi e delta
Build295 LIVE ha riprodotto 4/4 FAIL su desktop quando Converti, Indice cartografico IGM/IIM, Oggetti GIS o Pianifica percorso sono minimizzati e Poligoni è visibile: un singolo Escape non chiude Poligoni. Real opener di ciascun pannello, click del pulsante - e attesa stabilizzazione prima di premere Escape. Il primo tentativo Routing troppo ravvicinato aveva mostrato perdita dello stato minimized: finding dell'harness, NON attributo persistente del prodotto; ripetizione assestata prima dell'accettazione.

Il delta riusa il predicato GIS desktop esistente min-width 960 / hover:hover / pointer:fine per saltare i quattro blocchi Escape se il loro pannello è minimizzato e consentire il passaggio al successivo pannello visibile. Spostata la sola dichiarazione del predicato prima di Converti. Nessun cambiamento ad opener, close, minimize, modali, dati persistiti, cache, GPS, stato waypoint, OPSEC o rete. Mobile escluso intenzionalmente.

## Prove e gate
- Baseline 295: 4/4 FAIL dei quattro casi target.
- Candidata 296: 4/4 PASS; visibili 4/4 PASS; minimizzati soli 4/4 invariati; viewport touch 390x844 baseline/candidata parity 4/4.
- Sintassi JS inline 2/2 PASS, CR preservati, diff check PASS, zero POST nelle sessioni Edge candidate.
- Review sostitutiva statica 18/18 PASS sul Git object e222efc full SHA, blob verificato da GitHub.fetch_file. Il range del monolite via connector aveva restituito contenuto vuoto: non usato come prova contenutistica; local git show del blob immutabile ha sostenuto la checklist. Reviewer esterno NOT_PERFORMED; backstop post-hoc distinto.
- Deploy GIS-only verificato ex post, vedi DEPLOY-RESULT-296.md. QA nativa LIVE 12/12 PASS, vedi QA-LIVE-296.md. Nessun PASS umano acquisito.

NEXT: QA OPERATORE DESKTOP 296; Build295 e 294 restano QA umana PENDING. Non qualificare tutte le 38 finestre per deduzione.
