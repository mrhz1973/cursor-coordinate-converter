# QA candidata Build 282 — desktop

**PASS: 3 casi, 44/44 controlli.** Unica esecuzione sostitutiva v2 del 10 novembre 2026, **12:40:31.746–12:40:41.048 Europe/Rome**; processo 10,313 s, exit 0, browser chiuso regolarmente.

**sourceMode: `candidate_injected_document`.** Documento candidato iniettato dal test; questa prova non attesta il runtime live né il deploy.

## Identità verificata

- Source commit: `6b906869b77a2b3c91c8848012894ffff85399e3`.
- Blob: `4636ad186934b0d2f43e8564c9e657cdcdfc652e`.
- SHA-256: `71267f1a9d95488adf527db40333c811c2beeef0c9051e98ee5673debb5a7399`; **11.108.980 byte**, verificati prima delle azioni in tutti e tre i documenti.
- Edge 157.0.4341.42, Node.js 24.16.0, viewport desktop 1440 × 1000; contesti nuovi e isolati.

## Casi

| Caso | Controlli | Esito |
| --- | --- | --- |
| Preferiti minimizzato + Escape; restore, ×, riapertura e nuovo ciclo minimize/restore/× | 22/22 | PASS |
| Preferiti minimizzato + Mappe Offline/layersPanel visibile + Escape | 11/11 | PASS: Preferiti resta minimizzato, il pannello visibile riceve Escape |
| Preferiti visibile, interazione mappa, poi Escape | 11/11 | PASS |

Nel terzo caso il dialog è non modale e il percorso DOM della mappa è privo di inert. Il wheel reale, deltaY 120, è stato inviato al punto libero (720, 289,25), su `.tile-wrap.tile-missing`. La scala visibile è cambiata **1:196k → 1:393k**, **20,0 km → 50,0 km**, **10,0 NM → 20,0 NM**. Preferiti è rimasto visibile durante il gesto ed è stato chiuso successivamente con Escape. Nessun helper applicativo o app state forzato.

Durante l'esecuzione: **164 richieste accessorie bloccate**, **0 tentativi POST**, **0 eventi pageerror**. La console generale non è stata campionata separatamente; non si dichiara un PASS generale della console o dei servizi esterni. Nessuna interazione GPS/routing. Telefono in pausa: nessun viewport o dispositivo telefono. Fuori GIS **N/A**, non raggiungibile tramite UI ordinaria; non forzato.

## Tentativo iniziale conservato

Il tentativo del 10 novembre, 12:29:59.483–12:30:03.290 Europe/Rome, è **INCOMPLETE per errore dell'harness**, con 18/18 assert eseguiti PASS nel primo caso; non è un FAIL applicativo. Puppeteer ha rilevato un ElementHandle staccato dal documento prima del secondo click sul chip.

Lo stack salvato è troncato a 1400 caratteri: contiene Frame.js:754:17 e assertConnectedElement. La riga 86 dell'harness è ricostruita dal sorgente e dall'ultimo checkpoint `newCycleMinimized`, non letta nella parte troncata. Frame.js:752 acquisisce un singolo handle; ElementHandle.js:1305–1306 rifiuta `!element.isConnected`.

La v2 riacquisisce i due chip con Locator, attende visibilità, abilitazione, viewport e bounding box stabile; non forza click e non rimuove controlli. Lo stack salvato è esteso a 4000 caratteri. Harness, config e risultato originali restano conservati.

## Identità raw Windows degli artefatti eseguiti

Questa tabella misura i file sul PC prima dello staging. Gli esatti blob pubblicati e le eventuali normalizzazioni CRLF → LF sono attestati separatamente in `evidence-manifest.json`; i due tipi di hash non sono intercambiabili.

| File | Byte raw | SHA-256 raw | CRLF | CR isolati |
| --- | ---: | --- | ---: | ---: |
| `desktop-favorites-regression.cjs` | 18833 | `1a7d5fea849916038447698dda5516696bac2295aeb47d1337ad6485b6ffca91` | 0 | 0 |
| `desktop-favorites-regression-v2.cjs` | 19247 | `5f625374f8b88cfc7117d3a3f4a2fd3579d6c17aefcac019c7159aa66ae2bbc5` | 0 | 0 |
| `desktop-favorites-regression.config.json` | 374 | `41fb9412024197a4ed1f8b6de749116019d4165fb13029fab4be45fefd5f42b7` | 8 | 0 |
| `desktop-favorites-regression-v2.config.json` | 1570 | `ce4e8507bdb209965d7b3cd4f093ec7e895ea0b8c717a33e40b18eebd9485674` | 22 | 0 |
| `desktop-favorites-candidate-282.json` | 7644 | `f6a0505c181f50452b6c316a9b571b59a96fcdf8eb4c781ba8edfd4aaa936777` | 0 | 0 |
| `desktop-favorites-candidate-282-v2.json` | 16151 | `a01e79ed45ed197f00da438e4300803b537367e20937ed88dcee7fd1aae88dd5` | 0 | 0 |

[Risultato v2](desktop-favorites-candidate-282-v2.json) · [Config v2](desktop-favorites-regression-v2.config.json) · [Harness v2](desktop-favorites-regression-v2.cjs) · [Tentativo iniziale](desktop-favorites-candidate-282.json).

Nessun commit, modifica applicativa, deploy o operazione VPS eseguiti da questo incarico QA. Review downstream e ABQA live restano gate distinti.
