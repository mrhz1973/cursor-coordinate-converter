# Checkpoint ChatGPT permanente — GOI GIS Tool

**Data:** 2026-04-30 23:59  
**Creato da:** ChatGPT su comando esplicito `checkpoint`  
**Scopo:** memoria stabile per ChatGPT leggibile da GitHub con `aggio`.

Questo file non sostituisce `docs/checkpoint.md`, non modifica il workflow Cursor e non deve essere considerato fonte primaria per implementazioni. Serve solo a ChatGPT per riprendere il contesto.

---

## Regola checkpoint ChatGPT

Da ora, quando l’utente scrive `checkpoint`, ChatGPT può creare un file di memoria in:

```text
docs/orchestrator/chatgpt-checkpoints/
```

Vincoli:

- non modificare `coordinate_converter Claude.html`;
- non modificare `docs/roadmap.md`;
- non modificare `docs/checkpoint.md`;
- non modificare `docs/session-geolocalizzazione-e-mappa.md`;
- non modificare `.cursor/rules/`;
- non modificare `docs/orchestrator/latest.md`, salvo richiesta esplicita.

---

## Stato remoto noto

L’ultimo stato letto con `aggio` indica che è stato pubblicato il piano:

```text
docs/orchestrator/inbox/2026-04-30_2345_plan_range-rings-ui-standardization.md
```

Il piano è solo documentazione: il monolite non risulta modificato da quel piano. L’implementazione resta da fare in Cursor Agent.

Ultimo aggiornamento workflow noto:

```text
commit a2da326
```

Riguarda la riconciliazione del workflow `finito` con la memoria orchestratore.

---

## Blocco corrente

Prossimo blocco previsto:

```text
Range Rings — Blocco 1 UI/UX standardizzazione
```

Il piano è stato valutato da ChatGPT come approvabile con tre correzioni operative.

### Correzioni da mantenere

1. Non fare commit/push manuale in questo blocco. Il commit finale resta al workflow `finito`, salvo richiesta esplicita dell’utente.
2. Il cambio al clamp dei pannelli deve essere minimo e sicuro. L’header deve restare recuperabile. Se l’impatto globale è rischioso, limitare la modifica a Range Rings.
3. Import/Export: solo uniformità UI. Non cambiare formati, builder o logica import/export.

---

## Decisioni già prese

- I plan Cursor devono essere salvati su GitHub se devono essere letti da ChatGPT con `aggio`.
- `finito` resta comando da usare in Cursor, non in ChatGPT.
- ChatGPT non deve proporre commit manuali nel flusso normale.
- Il checkpoint ChatGPT su GitHub è una memoria separata, destinata a ChatGPT.

---

## Bug critici già chiusi prima di questo checkpoint

- Freeze Range Rings: risolto con guard in `rrCancelPendingRename`.
- Mappa bianca dopo refresh: risolta con generazione mappa/tile e controlli stale.
- Strumentazione debug temporanea rimossa.

---

## Prossimo passo consigliato

Far implementare a Cursor il piano Range Rings UI Blocco 1, applicando le tre correzioni sopra.

Dopo Cursor, riportare a ChatGPT:

```text
Riepilogo Cursor:
git status --short:
git diff --stat:
eventuali errori/test:
```

Non eseguire `finito` prima della verifica del risultato del blocco.
