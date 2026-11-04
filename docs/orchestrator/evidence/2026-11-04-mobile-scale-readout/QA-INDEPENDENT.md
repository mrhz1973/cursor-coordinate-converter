# QA Build275 — scala e coordinate mobile

## Byte esaminato

- Candidato: Build275 `GIS-MOBILE-MAP-READOUT-A`
- SHA-256: `196B23CB090ADAD35129DAB05DDA3CEFD1AA4B94516274E4007FA9DAD26BDE84`
- Baseline desktop: `HEAD:coordinate_converter Claude.html` Build274, SHA-256 `74D2DB4ADA570A50E59E1BDE8879726DD7702BC3CEE1C67922ACE5DA7D5E9C3B`
- Browser automatizzati: Edge stabile via Playwright channel `msedge` e WebKit eseguibile indicato nel runner. Non sono browser iOS fisici.
- Rete: tutte le richieste verso origini non locali sono state bloccate; tile, elevation e immagini satellitari non sono validati visivamente.

## Comandi

Eseguiti dal root `release270-root/tree`:

```powershell
node --check docs/orchestrator/evidence/2026-11-04-mobile-scale-readout/qa-build275.js
node docs/orchestrator/evidence/2026-11-04-mobile-scale-readout/qa-build275.js
```

## Esiti utilizzabili

| Verifica | Edge | WebKit | Nota |
|---|---|---|---|
| HUD mobile e frecce visibili, cliccabili; aria-expanded, etichette e aria-controls | PASS nei profili completati | PASS | Inclusi 320×568, 428×737, 667×375, 926×359 |
| Minimizzazione indipendente e ripristino | PASS | PASS | Scala e readout non si comandano a vicenda |
| Toggle senza pan, zoom, cambio Layer o scrittura storage | PASS | PASS | Confronto dello stato prima/dopo i tocchi |
| Cinque formati coordinate nel readout compatto | PASS | PASS | Testo leggibile e contenuto non tagliato nei profili completati |
| Stato collassato dopo redraw e resize/rotazione emulati | PASS | PASS | IOS fisico non simulato |
| Layer apribile e popup entro viewport | PASS nei profili completati | PASS | Vedi osservazione sul popup sotto |
| Footer non visibile su mobile, crediti presenti entro il viewport | PASS | PASS | Provider esterni bloccati |
| Errori JavaScript di pagina | Nessuno nei profili completati | Nessuno | |
| Desktop 1280×800 rispetto a Build274 | PASS, geometrie entro 1 px | PASS, geometrie entro 1 px | I toggle mobile restano nascosti; footer invariato |

## FAIL non conclusivi del runner

Il JSON riporta il run complessivo come `pass:false`; i seguenti controlli hanno falsi esiti o copertura incompleta e non vanno interpretati come difetti Build275 confermati:

- **Misura/cache:** testo sentinella invariato attraverso il collasso. Il test ha confrontato `getClientRects()` e quindi ha letto `visible=false` quando il contenitore genitore era correttamente nascosto. Non ha distinto l'attributo `hidden` del contatore e non ha popolato una cache reale.
- **Scala fisica:** le prove multi-latitudine/zoom sono partite mentre la scala era ancora minimizzata; i `getBoundingClientRect()` delle barre erano zero. Questa esecuzione non attesta la formula né l'assenza di clipping. Il test rapido separato del parent ha dato PASS sulla scala.
- **Intersezioni toolbar/HUD:** la raccolta includeva anche i pulsanti del popover Layer. Perciò i FAIL di collisione non distinguono i controlli della colonna dal menu aperto.
- **Edge 428×737 e 667×375:** il runner non ha completato i passi successivi al ritorno dalla rotazione emulata perché un locator non aveva bounding box. Gli altri controlli precedenti avevano PASS; il parent riferisce QA rapida PASS sui sei profili.

## Osservazione misurata

Con Layer aperto, il rettangolo del popover copre geometricamente parte del readout/scala e dei crediti ai profili bassi e stretti (per esempio 320×568 e 926×359). È una sovrapposizione del menu aperto, non una prova di collisione della toolbar chiusa. Va considerata nel retest visivo/di uso se l'utente deve leggere gli HUD mentre sceglie un Layer.

## File

- Runner: `qa-build275.js`
- Dati grezzi e dettagli per viewport: `qa-build275-results.json`

Nessun HTML o altro file applicativo è stato modificato in questo incarico; nessun deploy è stato eseguito.
