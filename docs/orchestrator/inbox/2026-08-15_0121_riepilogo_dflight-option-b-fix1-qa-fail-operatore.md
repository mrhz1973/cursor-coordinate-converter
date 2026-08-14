# Riepilogo — QA OPERATORE FAIL OPTION-B-IMPL-A-FIX1

**Data:** 2026-08-15  
**Attestazione:**

```text
QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX1 FAIL operatore — ALL OFF: con tutti i filtri temporali disattivati la manina/hit-test resta attiva; atteso: hit-test D-Flight inattivo.
```

## Azioni eseguite

- **finito:** non eseguito (FAIL operatore)
- **runtime:** non modificato
- **deploy:** non rieseguito

## Contesto tecnico

| Gate | Stato |
| --- | --- |
| REVIEW GPT-SOSTITUTIVA | PASS su `4a66084` |
| Deploy GIS-only | PASS — LIVE build **188** |
| Automated Browser QA | PASS (I/J) |
| QA operatore | **FAIL** |

## Lettura del finding

L’Automated Browser QA caso J (OPTION B) aveva accettato intenzionalmente:

- vols WFS = 0;
- ATM09 raster attenuato;
- **ATM09 INFO ancora interrogabile** (atmN=1).

L’operatore richiede invece che in ALL OFF il **hit-test D-Flight sia inattivo** (niente manina).

Quindi il FAIL è una **tensione prodotto** tra:

1. **OPTION B originale** — ATM09 resta contesto ufficiale interrogabile anche con filtri temporali tutti OFF;
2. **aspettativa operatore** — nessun hit-test D-Flight quando tutti i filtri temporali sono OFF.

Non è un regressione del FIX1 CSS TEMP-B (opacity 0.35), che resta tecnico PASS.

## Prossimo passo (decisione richiesta)

Scegliere una delle due:

- **A)** Accettare OPTION B (ATM09 INFO hit in ALL OFF) e aggiornare la QA umana di conseguenza; oppure
- **B)** FIX runtime: in ALL OFF disabilitare anche INFO hit / cursor pointer D-Flight, poi rebuild + deploy + re-QA.

## Monolite

Invariato in questo intervento; escluso dall’autosync.
