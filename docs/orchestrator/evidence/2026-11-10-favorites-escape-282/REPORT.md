# Build 282 — Preferiti minimizzati ed Escape, desktop

## Stato

**LIVE — Build 282 distribuita: REVIEW GPT-SOSTITUTIVA finale PASS, deploy PASS alle 13:06:57 e ABQA HTTPS nativa PASS (3 casi / 44 controlli) alle 13:09:05 del 10 novembre 2026, Europe/Rome. Gate residuo: QA OPERATORE DESKTOP; nessun PASS operatore 282 ancora ricevuto.**

Blocco: `GIS-FAVORITES-MINIMIZED-ESCAPE-A`. Il precedente `GIS-WINDOW-CONTROLS-A` è chiuso con PASS operatore; lo sviluppo telefono resta in pausa fino a nuovo ordine, come registrato nella [chiusura 281](../2026-11-10-window-controls-281-closure/REPORT.md).

Tier **DELICATO, lifecycle modale/dialog** secondo OM §4 B/G. Percorso **REVIEW GPT-SOSTITUTIVA** concluso PASS sul candidato immutabile e sul manifest corretto al checkpoint predeploy. [Review finale](review-favorites-282-final.md), con provvisori preservati. Review AI esterna **NOT_PERFORMED**, backstop distinto.

## Baseline live riprodotta

**10 novembre 2026, 12:10:29–12:10:43 Europe/Rome**: tre documenti HTTPS nativi, Edge 157.0.4341.42 / Windows, viewport 1440 × 1000. Dimensione e SHA-256 verificati prima delle azioni in ciascuna pagina: 11.108.861 byte, `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62`.

| Caso | Osservazione reale | Esito |
| --- | --- | --- |
| Preferiti minimizzato, Escape | Dialog chiuso, stato minimizzato e chip del dock rimossi | FAIL riprodotto |
| Preferiti minimizzato, Mappe Offline aperto, Escape | Preferiti chiuso; il pannello visibile layersPanel resta aperto | FAIL riprodotto |
| Preferiti visibile, Escape | Chiusura normale e dock pulito | PASS di controllo |

**26 controlli: 19 PASS e 7 FAIL**, riferiti a due manifestazioni dello stesso difetto. Zero pageerror e zero tentativi POST; richieste accessorie bloccate dal test. Opener reali «Preferiti» e «Mappe Offline», nessuna forzatura dello stato applicativo.

## Correzione e scope

Il ramo Escape di Preferiti viene eseguito soltanto se il pannello non è minimizzato. Altrimenti il listener continua a valutare i pannelli successivi, senza chiudere Preferiti né consumare l'evento in quel ramo.

Un semplice return anticipato non risolverebbe la mancata consegna a Mappe Offline. Il corpo di chiusura visibile, preventDefault(), opener e pulizia per ID rimangono identici.

Il delta contiene **una modifica funzionale e tre metadati**: APP_BUILD_ID, APP_BUILD_DETAIL, APP_BUILD_NUM. Nessuna modifica a CSS, markup, touch o layout telefono, persistenza, rete, routing, coordinate, state.mapWaypoints[] o GPS. D-Flight e le altre priorità Escape non sono dichiarati corretti.

## Identità e controlli

- Base immutabile: `b7ba9e1af0da4e3a4bbf6790790d39dec20041d4`.
- Runtime distribuito **Build 282**, **11.108.980 byte**.
- Source runtime `6b906869b77a2b3c91c8848012894ffff85399e3`; blob `4636ad186934b0d2f43e8564c9e657cdcdfc652e`.
- SHA-256: `71267f1a9d95488adf527db40333c811c2beeef0c9051e98ee5673debb5a7399`.
- Quattro sostituzioni ricostruite e invertite esattamente; nessun byte modificato fuori dal delta.
- **192 CR isolati preservati**, nessuna conversione globale dei terminatori.
- Sintassi dei due script inline: **2/2 PASS**, Node.js 24.16.0.
- Nessuna QA specifica per telefono eseguita o richiesta in questo scope.

GitHub.fetch_file ha restituito content vuoto nei range del monolite. Il fallback è stato il blob del clone Git verificato, pinnato al commit indicato, con output limitato ai range necessari.

## Storico — checkpoint predeploy del 10 novembre 2026

La [QA candidata](QA-CANDIDATE-282.md) concluse 3 casi e 44/44 controlli PASS. Il primo tentativo INCOMPLETE per riferimento DOM staccato è conservato; non è classificato come bug applicativo.

La [review provvisoria](review-favorites-282.md) conserva l'esito storico PENDING_METADATA_VERIFICATION. Il checkpoint `2b929e3433b2fbd9d0e0644a90b00e5c25aaccd7` corresse il manifest: patch-manifest.json misura 1886 byte Git LF / SHA-256 `d90d47ed8915466746060f701d9c7ffcbd9f38c25778e64fada84cf9f51412fd`, mentre il precedente manifest misurava 1938 byte raw Windows CRLF. La verifica finale successiva ha risolto il finding; le identità restano separate.

La [review della procedura](ROOT-REVIEW-DEPLOY-PREPARATION.md) è PASS STATICO. Il [pacchetto preparatorio](deploy-preparation/PREPARATION.md) resta storico precedente al GO; PREPARED_NOT_EXECUTED non descrive lo stato corrente.

## Deploy e ABQA LIVE

[Deploy PASS](deploy/DEPLOY-RESULT-282.md): preflight 13:06:18 e applicazione 13:06:57 Europe/Rome, una sola esecuzione per fase. Il VPS ha raggiunto `2b929e3433b2fbd9d0e0644a90b00e5c25aaccd7`, main/clean: **TARGET storico del rilascio**, distinto dalla HEAD GitHub corrente. File, HTTP 8000 e HTTPS /gis: Build 282, byte e SHA attesi; HTTP 200 e TLS verificato. Unico restart GIS; servizi condivisi, sei hash di configurazione, listener ed endpoint/CORS preservati.

[ABQA LIVE](QA-LIVE-282.md): tre risposte HTTPS native, 3 casi / 44 controlli PASS, senza sostituzione HTML. Lifecycle, priorità Escape verso Mappe Offline e gesto reale sulla mappa verificati; scala 1:196k → 1:393k. Accessorie bloccate 164, POST 0, pageerror 0; console generale non raccolta separatamente. Fuori GIS N/A, telefono in pausa.

Percorso effettivo: RDC originale sul PC DESKTOP-DPIJL64, poi SSH dal PC al VPS; non è attestata autonomia dal PC. Archiviati i dieci artefatti del deploy, senza runtime duplicato, backup privato o chiavi. Il frozen-manifest conserva lo stato del congelamento e rinvia al blob Git canonico per il runtime.

## Evidence e NEXT

[Patch e sintassi](patch-manifest.json) · [Baseline](baseline-result.json) · [QA candidata](QA-CANDIDATE-282.md) · [Review finale](review-favorites-282-final.md) · [Deploy](deploy/DEPLOY-RESULT-282.md) · [ABQA LIVE](QA-LIVE-282.md) · [Manifest](evidence-manifest.json).

**NEXT: un caso umano breve nella normale sessione desktop.** Aprire Preferiti e minimizzarlo; aprire Mappe Offline e premere Escape: Mappe Offline deve chiudersi mentre Preferiti resta minimizzato. Ripristinare Preferiti dal chip. Se corretto, attestare `QA GIS-FAVORITES-MINIMIZED-ESCAPE-A PASS operatore`; fino ad allora il blocco resta aperto.

Dopo la chiusura, backlog desktop: D-Flight e altre priorità Escape restano da riprodurre. Nessun PASS generale delle 38 finestre. Esecuzione GPT; Codex e Cursor non invocati.
