# FIX7 → FIX8 — evidence raccolta il 28 ottobre 2026

Questo pacchetto conserva evidence, harness e rapporti originali senza modificarne i byte. Non è LIVE STATE: lo stato operativo resta in `docs/FRONTIER.md`. I rapporti mantengono le formulazioni e l'identità disponibili al momento della loro emissione; eventuali «candidate locale / commit da associare» non devono sostituire la tabella d'identità sottostante.

## Identità e limiti di trasferimento delle prove

| Runtime | Commit noto | SHA-256 LF | Copertura raccolta |
| --- | --- | --- | --- |
| FIX7 / build 264 | `080e71c161be76e3ff494b1cdee1aed6889f9290` | `d5496fb01873d3748fd1c173f7d4091351f41aec54b7fa37a23947ecd4bcca69` | Baseline review, QA browser e geodesia; finding riproducibili, non PASS globale |
| FIX8 coordinate / build 265, prima dell'allineamento endpoint VPS | `d72babe2de3d3b3d874582abd6453f865abdedb9` | `c570bee51534ccba73352bd650b9bb6be55b414dfbbfd1e568abd323a9368ea3` | Review indipendente, 72 punti geodesia, QA browser locale desktop/mobile, selfcheck |
| FIX8 con endpoint VPS migrato | `762fb1605a7c20b3b7bd21a6b0cfa1c04f8e4739` | `0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145` | Rapporto implementatore, review migrazione indipendente PASS scoped, QA browser locale finale PASS nello scope rieseguito, selfcheck |

**La matrice geodetica completa e le regressioni estese/editor sono sul secondo hash (`c570bee5…`), non una certificazione automatica del terzo.** Sul candidate finale la review indipendente prova esattamente sei sostituzioni endpoint/selftest e nessun altro byte diverso; la QA locale riesegue prefissi, gate rete, 12 punti mondiali desktop/mobile e selfcheck. I rapporti finali sono raccolti separatamente. Questo pacchetto non attesta deploy, runtime LIVE, ABQA HTTP, QA operatore, routing land-only o connettività effettiva dei provider.

## Mappa delle fonti

Ogni sottodirectory deriva dalla directory omonima sotto `work/` nella sessione di esecuzione. `MANIFEST.json` elenca per ogni file percorso originale, percorso raccolto, dimensione e SHA-256; le copie sono state confrontate byte per byte.

| Cartella | Contenuto e punto d'ingresso |
| --- | --- |
| `geodesy/` ← `work/geodesy/` | `report.md` baseline FIX7; `report-fix8.md` retest FIX8; 72 fixture in `cases.json`, output effettivi `actual*.json`, statistiche `summary*.json`, misure `measurements*.json`; harness Python/Node |
| `review-fix7/` ← `work/review-fix7/` | `review.md`, riproduzione indipendente parser `parser-review.cjs`, `parser-results.json` |
| `review-fix8/` ← `work/review-fix8/` | `review.md`, `verify.cjs`, `results.json`; verifica del commit `d72babe…` e hash esatto. `migration-review.md`, `migration-verify.cjs`, `migration-results.json`: review separata sul finale `762fb160…` |
| `qa-fix7/` ← `work/qa-fix7/` | `REPORT.md`, harness comuni matrix/editor/arity/gates e JSON baseline; harness riutilizzati esplicitamente anche sul candidate FIX8 |
| `qa-fix8/` ← `work/qa-fix8/` | `REPORT.md`, retest desktop/mobile, prefissi, editor, rete opt-in, 12 punti globali, harness aggiuntivi. Due screenshot selezionati: `desktop-Rome.png` e `mobile-AntiWest.png` |
| `qa-fix8-final/` ← `work/qa-fix8-final/` | `REPORT.md`, nuovi JSON e harness sul finale: 41/41 helper prefissi, 12/12 interazioni, 3/3 gate luogo, 24/24 punti globali desktop/mobile e selfcheck PASS locale. `postdeploy.cjs` è soltanto preparato e verificato sintatticamente, **non eseguito** in questo snapshot |
| `fix8/` ← `work/fix8/` | `implementation.md`, test implementatore `helper-test.cjs`/`helper-results.json`, `selfcheck.cjs`/`selfcheck-results.json`, rapporto e selfcheck migrazione endpoint |

Esclusi intenzionalmente: dipendenze Python/Node, copie HTML runtime, script di patch, log intermedi e screenshot ulteriori. I runtime si ricostruiscono dai commit Git; non è conservata una seconda copia del monolite. 65 file sorgente raccolti, 3 392 264 byte, oltre a questo indice e al manifest.

## Riproduzione

Eseguire su copie di lavoro dell'evidence, perché i harness scrivono JSON di risultato. Non sovrascrivere l'evidence pubblicata. Prima di ogni prova ricostruire il runtime dal commit corretto e verificarne SHA-256: gli script che accettano un file arbitrario non sostituiscono questo controllo.

### Review indipendenti

Richiedono Node.js e Git. Eseguire `node review-fix7/parser-review.cjs <repository>`, `node review-fix8/verify.cjs <repository>` e `node review-fix8/migration-verify.cjs <repository>` dalla copia del pacchetto. Gli script leggono i commit Git, non il monolite modificabile del working tree. Il repository deve contenere la storia richiesta.

### Matrice geodetica

Richiede Python 3.12, Node.js, Git e versioni pyproj 3.8.0 (PROJ 9.8.1), mgrs 1.6.0 e geographiclib 2.1. Installarle in ambiente di test isolato oppure nella cartella `geodesy/deps`, esclusa dal pacchetto. Impostare `GEODESY_REPO` sul repository storico; in assenza di override il harness cerca il repository Git della sua directory.

- FIX7: eseguire `python geodesy/reference.py`, poi `python geodesy/analyze.py`. Il primo genera i riferimenti indipendenti e invoca Node; `run.cjs` legge `080e71c…` con Git e impone l'hash FIX7.
- FIX8 coordinate: usare un checkout separato al commit `d72babe…`, impostare `GEODESY_REPO` su quel checkout e `GEODESY_FIX8=1`, poi `node geodesy/run.cjs` e `python geodesy/analyze.py --fix8`. Controllare il campo `sha256` in `actual-fix8.json` contro `c570bee5…`. La modalità FIX8 legge il working tree e registra il suo hash: non lo assume immutabile.

Le tolleranze e la distinzione centro/SW cella MGRS sono documentate nei rapporti geodetici. I confronti tra easting/northing sono nel medesimo CRS; non confrontare numeri appartenenti a zone UTM diverse.

### Browser e selfcheck

Gli harness originali usano Playwright da `C:/goi-pw-probe/node_modules/playwright` e Chromium da `C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe`. Questi percorsi assoluti sono dipendenze dell'ambiente originale e sono conservati nei file per integrità. Su altro ambiente adattare esclusivamente questi percorsi in una copia del harness; registrare la versione effettiva del browser e distinguere il nuovo risultato dall'evidence originale. Non installare dipendenze nel runtime HTML.

Gli script `qa-fix7/matrix.cjs`, `matrix-mobile.cjs`, `arity-ui.cjs`, `editors-ui.cjs`, `qa-fix8/editors-mobile.cjs` e `prefix-mobile.cjs` ricevono `<runtime.html> <risultato.json>` come argomenti. `place-gates.cjs` e `gates.cjs` ricevono `<runtime.html>` e scrivono nella propria directory. `fix8/helper-test.cjs` riceve `<runtime.html>`; `fix8/selfcheck.cjs` riceve `<runtime.html> <risultato.json>`. Servono il file su localhost e intercettano/bloccano richieste esterne: non sono prove di disponibilità dei servizi VPS.

`qa-fix8/world-ui.cjs` usa percorsi relativi all'originario workspace: `work/geodesy/cases.json` e `work/qa-fix8/candidate.html`; scrive sotto `work/qa-fix8`. Per riprodurlo ricreare queste due cartelle in scratch, copiare la fixture e ricostruire `candidate.html` da `d72babe…` preservando i byte LF. Copiare lo script o eseguirlo dalla directory workspace che contiene `work/`. Il candidate HTML resta file temporaneo, escluso da Git.

Per il retest locale finale usare il runtime estratto da `762fb160…`, verificare hash `0c39ce77…` e usare i harness pertinenti sotto `qa-fix8-final/` (il suo `world-ui.cjs` usa `work/qa-fix8-final/candidate.html` e la stessa fixture geodesy). Non riutilizzare il file temporaneo del precedente candidate. `qa-fix8-final/postdeploy.cjs <URL-runtime>` richiede un URL reale, verifica stato HTTP/hash prima dei test e salva `postdeploy-results.json`: in questo pacchetto non è presente tale risultato perché il test HTTP non era stato eseguito.

### Completezza

L'evidence raccolta copre le prove dichiarate nei rapporti sorgente, conserva il confronto FIX7/FIX8 e include review indipendente e QA locale del candidate finale. Rimangono esterni a questo snapshot: verifiche sul candidate finale via HTTP e VPS, ABQA dopo deploy e attestazione operatore. Non inferire PASS per questi gate dall'esistenza del pacchetto.
