# Build 282 — ABQA desktop HTTPS nativa

**PASS: 3 casi / 44 controlli, 44 PASS e 0 FAIL.** Unica esecuzione: 10 novembre 2026, 13:08:44.352–13:09:05.616 Europe/Rome; processo 22,203 secondi, exit 0, cleanup `closed`.

## Identità

Source runtime `6b906869b77a2b3c91c8848012894ffff85399e3`; blob `4636ad186934b0d2f43e8564c9e657cdcdfc652e`. **3/3 risposte HTTPS native HTTP 200**, Build 282, 11.108.980 byte, SHA-256 `71267f1a9d95488adf527db40333c811c2beeef0c9051e98ee5673debb5a7399`.

`sourceMode: native_https_document`, nessun runtimePath o HTML sostituito. Edge 157.0.4341.42 / Windows, Node 24.16.0, viewport 1440 × 1000; contesti freschi isolati. Esecuzione GPT tramite RDC originale sul PC del lavoro; Codex/Cursor non invocati.

## Risultati

| Caso | Esito |
| --- | --- |
| Preferiti minimizzato da solo | 22/22 PASS: Escape conserva dialog e chip; ripristino, ×, riapertura e secondo ciclo puliti. |
| Preferiti minimizzato + Mappe Offline visibile | 11/11 PASS: Escape chiude layersPanel e conserva Preferiti minimizzato. |
| Preferiti visibile, mappa ed Escape | 11/11 PASS: dialog non modale, percorso mappa senza inert, gesto efficace, chiusura con Escape. |

Rotella reale `deltaY:120` nel punto libero (720, 289.25): scala `1:196k → 1:393k`, metrica `20.0 km · 12.4 mi → 50.0 km · 31.1 mi`, nautica `10.0 NM → 20.0 NM`. Preferiti rimane visibile durante il gesto.

## Limiti e artefatti

Tre documenti nativi; **164 richieste accessorie bloccate**, **0 POST**, **0 pageerror**. Console generale non raccolta separatamente; nessuna interazione GPS/routing. Fuori GIS **N/A**, non raggiungibile tramite UI ordinaria; nessuno stato forzato. Telefono in pausa, nessun dispositivo/viewport telefonico.

- [Runner v2](desktop-favorites-regression-v2.cjs): 19.247 byte, SHA-256 `5f625374f8b88cfc7117d3a3f4a2fd3579d6c17aefcac019c7159aa66ae2bbc5`.
- [Config LIVE](desktop-favorites-live-282-v2.config.json): 1.625 byte LF, SHA-256 `4d0da2d0023b9676c5e971f6bc0fed337ba07a00cff5ba727bf9d918b2c6f495`.
- [Risultato completo](desktop-favorites-live-282-v2.json): 16.145 byte LF, SHA-256 `2ae22679b6a2713ce1fe9d69737882e34abc5eb5245cccff93fa0c82e493be0c`.

[Deploy](deploy/DEPLOY-RESULT-282.md) e [review finale](review-favorites-282-final.md) sono gate distinti già PASS. La QA operatore desktop 282 resta pendente. Il primo tentativo candidato INCOMPLETE e i rapporti provvisori restano conservati.
