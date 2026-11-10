# Build 282 — Preferiti minimizzati ed Escape, desktop

## Stato

**CANDIDATE PREPARED — QA candidata e review downstream pendenti alla pubblicazione di questo checkpoint. Nessun deploy della 282 attestato qui.**

Blocco: `GIS-FAVORITES-MINIMIZED-ESCAPE-A`. Il precedente `GIS-WINDOW-CONTROLS-A` è chiuso con PASS operatore; lo sviluppo telefono resta in pausa fino a nuovo ordine, come registrato nella [chiusura 281](../2026-11-10-window-controls-281-closure/REPORT.md).

Tier **DELICATO, lifecycle modale/dialog** secondo OM §4 B/G. Percorso **REVIEW GPT-SOSTITUTIVA**: review upstream della scelta svolta; downstream sul commit candidato immutabile ancora da concludere. Nessuna review AI esterna dichiarata.

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
- Build candidata **282**, **11.108.980 byte**.
- SHA-256: `71267f1a9d95488adf527db40333c811c2beeef0c9051e98ee5673debb5a7399`.
- Quattro sostituzioni ricostruite e invertite esattamente; nessun byte modificato fuori dal delta.
- **192 CR isolati preservati**, nessuna conversione globale dei terminatori.
- Sintassi dei due script inline: **2/2 PASS**, Node.js 24.16.0.
- Nessuna QA specifica per telefono eseguita o richiesta in questo scope.

GitHub.fetch_file ha restituito content vuoto nei range del monolite. Il fallback è stato il blob del clone Git verificato, pinnato al commit indicato, con output limitato ai range necessari.

## Evidence e NEXT

[Manifest patch e sintassi](patch-manifest.json) · [Harness baseline](baseline-harness.cjs) · [Config](baseline.config.json) · [Risultato baseline](baseline-result.json) · [Manifest artefatti](evidence-manifest.json).

NEXT: regressione candidata desktop sui tre casi, restore/×/riapertura e interattività mappa; review GPT sostitutiva downstream dal commit immutabile; dopo PASS, deploy circoscritto e ABQA HTTPS nativa. La QA operatore residua sarà soltanto desktop secondo D2.

Esecuzione GPT; Codex e Cursor non invocati. Questo checkpoint non attribuisce PASS candidato, review downstream o deploy non ancora osservati.
