# GraphHopper ferry filter probe — 2026-10-30

## Ambito e vincoli

Probe HTTP read-only sull'endpoint GraphHopper 11 all'indirizzo `100.99.54.93:8989`. Nessun comando SSH, nessuna modifica a VPS o configurazione. Il solo materiale creato è questo report e il JSON con le richieste/risposte. Nessun provider esterno contattato. Timeout client massimo: 8 secondi. QA268 resta pending.

## Correzione del primo tentativo

Il primo tentativo `hiking` è stato inviato con il JSON annidato `"ch":{"disable":true}`. Questa forma **non** invia la proprietà HTTP richiesta da GraphHopper (`"ch.disable": true`) e quindi non costituiva un test valido di `ch.disable`. GraphHopper ha risposto HTTP 400 dicendo che il custom model richiede di disabilitare speed mode. Il primo risultato è mantenuto in `results.json` per audit; l'errore riflette la sintassi del probe, non dimostra un difetto del server.

## Probe corretto

Sono state inviate richieste POST `/route` con le coordinate liguri già usate nella baseline: `[9.8236,44.1024]` → `[9.8290,44.1070]`, nell'ordine `[lon,lat]`. Ogni richiesta aveva `"ch.disable": true` come proprietà top-level letterale, `details: ["road_environment"]`, `snap_prevention: ["ferry"]` e un custom model con priorità moltiplicata per zero quando `road_environment == FERRY`.

| Profilo | HTTP | Tempo client | Distanza route | Valori `road_environment` restituiti |
|---|---:|---:|---:|---|
| `hiking` | 200 | 0,244 s | 749,668 m | `road` |
| `hiking_easy` | 200 | 0,141 s | 749,668 m | `road` |
| `mtb_touring` | 200 | 0,138 s | 708,264 m | `road` |
| `mtb_trail` | 200 | 0,147 s | 698,701 m | `road` |

Tutte e quattro le risposte contengono una route, i dettagli `road_environment` e nessun campo `errors` non nullo; nessun segmento della route restituita è etichettato `FERRY`. Questo conferma che la sintassi HTTP del custom model, `ch.disable`, `details` e `snap_prevention` è accettata per queste route.

## Limite del risultato

La baseline ligure provata è una route terrestre che non attraversa un ferry. L'assenza di segmenti `FERRY` in queste risposte **non** verifica che il motore escluda i ferry quando esiste un'alternativa o quando un ferry è necessario. Non è stata eseguita una baseline ferry, né si afferma una garanzia generale “no ferry”. `/nearest` non è stato interrogato in questo secondo tentativo perché il probe richiesto sui quattro profili si è concluso senza errori; il supporto specifico di snap prevention per lo snapping resta quindi non caratterizzato.

## Riproducibilità

`results.json` conserva il primo tentativo errato e, in sequenza, le quattro richieste corrette con payload, status, tempi, risposte integrali e valori derivati dai dettagli.
