# REVIEW GPT-SOSTITUTIVA — addendum definitivo Build 280

Verifica chiusa: **2026-11-09T13:21:38.284154+00:00**. Reviewer: `/root/storage_origin_check`, GPT nel medesimo flusso di esecuzione. **Non è una review di un provider esterno.**

## Verdetto

**TECHNICAL_CHECKLIST_PASS_WITH_RESIDUAL_GATES. Nessun blocker di codice residuo rilevato nel bundle definitivo.** I due finding UI emersi dopo la prima review sono corretti e hanno evidenza di regressione. Questa review tecnica non chiude automaticamente QA operatore, review esterna post-hoc o pubblicazione.

| Identità del bundle definitivo | Valore verificato dal raw Git |
|---|---|
| Commit locale immutabile | `c33f58c956e9630b03f9ff86eb35eccd35879a4a` |
| Parent effettivo | `e94d26a45a9dc1da152812995270d9726f556578` |
| Runtime | `coordinate_converter Claude.html` |
| Blob | `d2ec773205da2a6d4bf954f635765eb872ec646c` |
| SHA256 | `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |
| Dimensione | 11,108,654 byte |

Il parent del definitivo è `e94d26a…`; `fb10709…` è il candidato precedente usato come termine di confronto, non viene descritto come suo parent. La review completa precedente è quella documentata da `REVIEW-GPT-SOSTITUTIVA.md` e `review.json`, riferita a `fb10709…` / SHA `1e6c11cf…`.

## Metodo e integrità

Letto il delta completo raw Git `fb10709… → c33f58c…`: **9 aggiunte / 3 rimozioni**, esclusivamente due funzioni UI e la riga delle note di rilascio. La lunga riga delle note è stata isolata e confrontata separatamente; aggiunge una sola voce italiana sul comportamento corretto delle alternative e sull’aggiornamento del confronto.

La ricostruzione del nuovo blob dal vecchio, tramite sostituzione esatta delle due funzioni e di quella riga, è **byte-identica** al raw Git definitivo. Il resto del monolite è quindi esattamente quello già esaminato; non sono state ripetute lettura completa, QA geodesia, mock no-ferry/snap/anchor o timeout. Assenza BOM e 192 CR isolati preservati. L’evidenza dei vecchi test resta attribuita al vecchio SHA, mentre l’applicabilità al resto invariato è sostenuta dalla prova byte per byte.

## Finding risolti

### Selezione ordinaria di un’alternativa

Il vecchio handler entrava nel ramo overlay quando esisteva la sessione compare globale senza `chosen`, anche se entrambi i pack erano assenti. Il renderer invece mostrava alternative ordinarie. La nuova condizione `compareLive` richiede anche almeno un pack con stato `pass`, come già fanno renderer e collector. I guard busy/indice, il ramo overlay e il percorso esistente `routingSelectAlternativeAt` sono preservati.

**Regressione eseguita su browser: 8/8 PASS.** Il difetto è riprodotto sullo SHA originale: click indice 1 lascia selezione 0, preview di 31 punti e distanza 811 m, pur portando `activeOverlayKey` a `ors:1`. Sul definitivo gli indici 1, 2 e 0 aggiornano selezione, geometria, distanza/durata dello stato, distanza visibile, chip e linea SVG attivi nelle sessioni vuota, fallita e già scelta. Nove tracce sono salvate con il form reale, ripristinate dopo reload e riaperte con **Modifica**, con geometria uguale alla risposta ORS originale. Il confronto attivo con uno e due pack PASS mantiene gli stessi risultati osservabili sul vecchio e sul nuovo runtime.

I pack compare della prova selezione sono fixture in memoria costruite dalle alternative ORS validate, con pack GH sintetico. Il test verifica il ramo UI effettivo e non rivendica un calcolo Compare end-to-end. Zero richieste inoltrate a provider, otto risposte ORS riprodotte localmente, 3680 altre richieste della pagina intercettate e bloccate, zero errori pagina. Non è stato usato il profilo reale dell’utente.

La prova `preexisting-source-proof.json` del root attesta l’identità del ramo difettoso con base 279. Questo costituisce evidenza sul sorgente; **non è stato eseguito un test browser di Build 279**.

### Pulsante Compare non aggiornato

`routingCompareOnInputInvalidated` ora richiama `routingSyncCompareUi()` prima del ritorno nel caso di sessione vuota. La chiamata aggiorna stato del pulsante e UI in modo sincrono; non introduce fetch, GPS, controller, consent o nuove persistenze. Il ramo con sessione caricata/in corso continua ad annullare e pulire tramite la stessa funzione precedente. Nessuna ricorsione introdotta nel percorso esaminato.

Acquisita, senza rieseguirla, l’evidenza del collega `../qa-gis-routing-real-280/final-offline-regression.json`, SHA256 `64c885543fe5c186876f9054e2f6d0af63abb04e141bb95b0d612af9380a38f5`. Sul definitivo, tramite UI, Compare è abilitato con profilo compatibile, disabilitato con `hiking_easy`, di nuovo abilitato ripristinando `mtb_trail`; **0 chiamate manuali di sync**. La regressione del guard dell’osservatore GH risulta PASS, con quattro risposte sintetiche, nessuna rete reale, una traccia salvata e ripristinata. Non è qualificata come QA provider reale né come review esterna.

## Checklist canonica, applicata al delta definitivo

| Categoria | Check effettivo / N/A motivato |
|---|---|
| Dialog, focus, ARIA, scroll, CSS | **N/A al delta:** nessun percorso apertura/chiusura o markup dei dialog modificato. I form salvati e riaperti sono stati comunque esercitati nella regressione mirata. |
| UI selezione/confronto | **PASS:** condizione coerente con renderer/collector; ordinario e overlay verificati nel browser; Compare verificato dall’evidenza acquisita. |
| Persistenza, sanitizer, create-path | **N/A al delta:** byte-identici; nessun campo persistente nuovo o bypass. La precedente review prova anche identità delle sezioni sensibili rispetto a 279. |
| Parsing/whitelist risposta provider | **N/A al delta:** validatori invariati rispetto al bundle già esaminato. La risposta ORS originale passa il percorso reale di parsing nei nuovi test. |
| Destinazioni rete, OPSEC, offline, opt-in | **PASS di integrità del delta:** nessuna destinazione, gate o consenso alterato; non viene eseguita rete dalle nuove istruzioni UI. Restano applicabili le verifiche della prima review, inclusa la provenienza staging del ramo 8443, attivo solo da quell’origin e senza fallback da 443. |
| GPS o rete implicita aggiunta | **PASS:** nessun nuovo trigger, fetch, geolocalizzazione, WebSocket o beacon nel delta. Le richieste già tentate dal runtime nei test sono state bloccate. |
| Controller, deadline, sequenza/cancellazione | **N/A al delta:** byte-identici; evidenza preesistente non rieseguita. |
| No-ferry, metadati, snap, anchor | **N/A al delta:** nessuna modifica, regole del bundle precedente mantenute byte per byte. |
| I18n freeze | **PASS:** sola voce italiana nelle note; nessuna nuova chiave o modifica EN/FR. |
| Standalone e integrità del resto | **PASS:** un HTML, stesso resto del blob, nessun framework/file runtime aggiunto; hash finali verificati prima/dopo browser. |

## Gate residui e limiti

- **QA operatore: non eseguita da questa review; nessun PASS attribuito.**
- **Review esterna post-hoc: non eseguita; questa è la review GPT sostitutiva.**
- **QA provider reale e pubblicazione: in corso presso altri esecutori al cutoff della review; esito non anticipato.**
- Le limitazioni degli export e la separazione storage HTTP/HTTPS restano quelle documentate nella nota storage; nessuna migrazione aggiunta o presunta.

## Finding di metodo

La prima acquisizione del JSON del collega con `cat` ha prodotto output troncato per la lunga lista di richieste bloccate. È un finding di payload, non una prova di errore runtime. Il rapporto usa i soli campi necessari mediante una proiezione esplicita salvata in `acquired-final-offline-qa-summary.json`; non attribuisce alcun contenuto alla porzione omessa. Non sono stati ripetuti test né ricerche generiche per recuperarla.

## Artefatti

`review-final-70553e52.json` contiene il verdetto strutturato, la checklist precedente con il delta e le prove acquisite. `final-delta-integrity.json` conserva le identità delle due funzioni e la ricostruzione esatta; `final-ui-delta.diff` il diff raw completo. La regressione propria è in `../qa-gis-selection-regression/REGRESSIONE-SELEZIONE-70553e52.md` e `results.json`. Le sole scritture di questa attività sono artefatti QA e dati sintetici nei context temporanei; nessun commit, deploy, servizio o dato utente modificato.
