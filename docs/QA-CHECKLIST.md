# GOI GIS Tool — QA checklist operatore

> **Natura del file**
> - Fa parte del **read-set operativo** (voce 4; vedi [`README.md`](../README.md)).
> - È una **procedura/template**, **non** la fonte dello stato vivo.
> - Lo stato operativo corrente resta in [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) **§7**.
> - La governance di handoff/chiusura è in [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) **§4 — Handoff & Close Discipline**.

## Principi

- **PASS operatore ≠ PASS tecnico.** Il PASS tecnico remoto (hash, `git ls-remote`, byte-match) è distinto dal PASS operatore (comportamento runtime verificato da una persona).
- **Cursor non attesta la QA visiva.** Cursor prepara la checklist già compilata, ma non apre l'app, non carica tile e non inventa esiti al posto dell'operatore.
- **Emissione unica.** La checklist viene emessa **già compilata** nel report `finito`, dentro un unico fenced code block, e l'operatore la **restituisce una sola volta** con PASS/FAIL.
- **Fail-closed.** Senza attestazione esplicita dell'operatore, l'esito resta **QA operatore non eseguita / non attestata**. Non si inferisce PASS operatore da PASS tecnico, diff pulito o `node --check`.

## Nucleo standing (sette categorie)

1. **Identificazione** — block ID; data; runtime SHA; HEAD/deploy; build; URL QA.
2. **Versione servita** — pagina caricata; build corretta servita; cache-buster runtime corretto.
3. **Funzione primaria** — comportamento principale del blocco; output atteso; nessun errore evidente.
4. **Stati positivi e negativi (quando pertinenti)** — opzione attiva; opzione disattiva; fail-closed; cancel/annulla.
5. **Regressioni** — esclusivamente regressioni **correlate al blocco**; nessun audit generale non pertinente.
6. **Stabilità** — app ancora utilizzabile; mappa e pannelli non bloccati; secondo tentativo possibile.
7. **Limiti** — sotto-check non eseguiti; condizioni non osservate; attestazione non estesa oltre quanto realmente verificato.

## Formato URL QA

```
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=<runtime-short-sha>
```

- Usare lo **short SHA del commit runtime reale**.
- **Mai** SHA docs/autosync al posto del runtime.
- **Mai** etichette `*-local` sul VPS.
- L'URL è **già compilato** dal workflow quando il runtime è noto.

## Template unico copiabile

```
QA OPERATORE — <BLOCK-ID>

DATA:
<data>

URL QA:
http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=<runtime-short-sha>

VERSIONE
[ ] Build attesa: <build>
[ ] Runtime: <runtime-sha>
[ ] HEAD/deploy: <deploy-sha>
[ ] Pagina caricata con cache-buster runtime corretto

NUCLEO STANDING
[ ] Funzione primaria eseguita
[ ] Output atteso verificato
[ ] Nessun errore evidente
[ ] App ancora utilizzabile dopo il test
[ ] Secondo tentativo eseguibile

STATI POSITIVI / NEGATIVI PERTINENTI
[ ] <stato positivo pertinente>
[ ] <stato negativo, fail-closed o cancel pertinente>

CONTROLLO SPECIFICO DEL BLOCCO
[ ] <controllo specifico 1>
[ ] <controllo specifico 2>
[ ] <controllo specifico 3>

REGRESSIONI PERTINENTI
[ ] <regressione correlata 1>
[ ] <regressione correlata 2>

LIMITI / NON ESEGUITO
- <eventuali limiti o condizioni non osservate>

ESITO
[ ] QA <BLOCK-ID> PASS operatore
[ ] QA <BLOCK-ID> FAIL operatore

Punti falliti:
- ...
```

La sezione **CONTROLLO SPECIFICO DEL BLOCCO** deve restare breve e pertinente al blocco corrente.

## Istruzioni per il workflow `finito`

Quando emette la checklist, `finito` deve:

- compilare automaticamente tutti i placeholder noti;
- inserire il **runtime short SHA reale** nell'URL QA;
- includere **solo** controlli specifici e regressioni pertinenti al blocco;
- emettere l'intera checklist in **un unico fenced code block**, senza spezzarla in più messaggi;
- **non** dichiarare PASS prima dell'attestazione dell'operatore;
- distinguere **sempre** PASS tecnico e PASS operatore.
