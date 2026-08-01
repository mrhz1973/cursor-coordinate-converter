# ROUTING-POINT-COORD-EDIT-A — Piano tecnico (docs-only)

**Gate sessione:** `ROUTING-POINT-COORD-EDIT-A DESIGN OPENED — RUNTIME NOT STARTED`  
**Data:** 2026-08-01  
**Tipo:** documentazione e progettazione — **nessuna modifica runtime** da questo commit.

---

## A. Stato e autorità

| Campo | Valore |
| --- | --- |
| HEAD documentale al momento del piano | `1fc30962bc664d419b27150edc74aeb386ccd494` (pre-commit docs) |
| Runtime monolite autorevole | `d0688ea44513501cae766f79d1538934729234e3` (`d0688ea`) |
| Build | `B6.2MCV-A-FIX3 · build 93` |
| Blob monolite | `55d414bca54b7e8e18a487c74ef28e58301f2ce7` |
| Byte LF | `3149321` |
| Vecchio ID | **ROUTING-PROFILE-EDIT-A** — **SUPERSEDED / RENAMED — NO RUNTIME** |
| Nuovo ID | **ROUTING-POINT-COORD-EDIT-A** |
| Stato | **OPEN / DESIGN READY — DOCS-ONLY** |
| Runtime autorizzato da questo commit | **No** — serve un successivo prompt runtime chirurgico |

---

## B. Motivazione

La discovery (sessione ROUTING-PROFILE-EDIT-A, read-only) ha dimostrato che il planner Outdoor Routing **già dispone** di:

- modifica label inline (`routing-pt-field`, max 80);
- pick dalla mappa (`routingEnterPickMode` / `routingApplyMapPick` / ramo `attachPanHandlers.onUp`);
- drag marker (Pointer Events capture + RAF);
- GPS single-shot esplicito (`getCurrentPosition`);
- aggiunta / eliminazione intermedi (`routingAddVia` / `routingRemovePoint`; A/B strutturali protetti);
- riordino HTML5 drag + Su/Giù;
- Reverse (`routingReversePoints`);
- Undo storico session-only (`pointUndoStack`, cap 30);
- invalidazione route (`routingInvalidateRoutePreview`) + ricalcolo **manuale** (Calcola);
- ID stabili (`uidRouting` prefisso `rt`);
- limite 20 punti (`ROUTING_MAX_POINTS`).

**Funzione residua mancante:** immissione numerica diretta e atomica della coppia latitudine/longitudine per ogni punto A / B / intermedio.

Il vecchio ID **ROUTING-PROFILE-EDIT-A** non descriveva più lo scope reale: la maggior parte delle operazioni immaginate era già disponibile. Nessuna implementazione è stata eseguita sotto quel nome; **non** va presentato come CLOSED/PASS né come prossimo candidato runtime.

---

## C. UX ratificata

**Opzione ratificata:** modalità globale light **«Modifica coordinate»** (ex Option B discovery).

Contratto:

- CTA esplicita nel pannello Routing (`.routing-panel-actions`);
- label italiana: **«Modifica coordinate»**;
- equivalenti i18n EN/FR da definire nel runtime;
- entrando nella modalità, ogni riga mostra input latitudine e longitudine;
- la card profilo altimetrico e difficoltà (`#routingResultCard`) resta **read-only**;
- la modalità **non** trasforma il grafico in editor;
- **«Fine modifica»** nasconde gli input;
- **Esc** esce dalla modalità;
- modifiche già applicate restano applicate;
- **Undo** resta il meccanismo di ripristino;
- **nessuna** sessione staged globale con Conferma/Annulla.

---

## D. Contratto input coordinate

- Due input distinti: latitudine e longitudine.
- Commit della **coppia sempre atomico** — nessun aggiornamento di un solo asse.
- Applicazione: pulsante per-riga **«Applica»** oppure **Enter**.
- Enter da uno dei due campi applica **entrambi** i valori.
- **Blur non** deve applicare automaticamente un solo campo.
- Un solo commit logico → una sola snapshot Undo → una sola invalidazione route → un solo aggiornamento marker/lista.

Validazione:

- parsing numerico esplicito;
- `Number.isFinite` obbligatorio;
- latitudine ∈ [−90, +90];
- longitudine ∈ [−180, +180];
- valori fuori range **rifiutati**;
- **nessuna** normalizzazione silenziosa della longitudine;
- **nessuna** coercizione lasca;
- errore via regione `aria-live` Routing esistente (`#routingPlannerStatus`);
- stato e coordinate precedenti **invariati** in caso di errore.

---

## E. Draft transiente

Piccolo store UI transiente keyed by **stable point ID**, per preservare i testi lat/lon non ancora applicati durante i rerender di `routingRenderList`.

Contratto:

- nessuna persistenza; nessun ingresso in `saveStore`;
- nessuna condivisione con `state.mapWaypoints[]`;
- inizializzazione lazy;
- cancellazione del draft della riga dopo commit valido;
- uscita da «Modifica coordinate» scarta **solo** i testi non applicati;
- modifiche già applicate restano in `state._routing.points`;
- chiusura / `routingFullCleanup` cancella `editMode` e draft;
- minimizzazione del pannello preserva la modalità nella stessa sessione aperta, salvo incompatibilità dimostrata dal runtime.

Nomi JavaScript definitivi: da scegliere in implementazione (non vincolanti qui).

---

## F. Campo `source`

- **Non** introdurre `source: "manual"`.
- Verificare nel futuro runtime **tutti** i lettori di `point.source`.
- L’immissione manuale **non** deve lasciare il punto falsamente marcato come `"gps"` o `"map"`.
- Preferenza progettuale: **rimuovere o azzerare** il campo opzionale `source` sul commit manuale.
- Se un lettore richiede obbligatoriamente `"gps"|"map"`, **STOP** e nuova decisione prodotto.
- Nessun nuovo enum senza necessità dimostrata.

---

## G. Funnel di mutazione

Riuso obbligatorio:

- `routingSetPointCoordinates` (esteso solo se necessario per policy `source`, senza nuovo enum);
- `routingPushPointUndoSnapshot`;
- `routingInvalidateRoutePreview`;
- `routingRenderList`;
- sync marker esistenti (`renderRoutingMarkers` / refresh UI).

Contratto:

- nessuna scrittura diretta parallela a `points[]`;
- nessun secondo helper concorrente di invalidazione;
- nessun nuovo listener sulla mappa;
- nessun auto-ricalcolo;
- modifica valida → invalida route corrente;
- richiesta GraphHopper in corso abortita/scartata dal funnel esistente (`requestController` / `requestSequence`);
- operatore preme **«Calcola percorso»** dopo aver concluso le modifiche.

**Non** ratificare il blocco totale degli input durante `requestLoading` come requisito. Preferenza:

- consentire il commit manuale;
- abort/invalidazione via percorso esistente;
- scarto risposte stale via `requestSequence`/`requestController`.

Se il runtime corrente blocca uniformemente tutte le mutazioni durante loading, documentare il comportamento reale **prima** di cambiare contratto.

---

## H. Stato e lifecycle

Nuovo stato **esclusivamente transiente**:

- `editMode` (default `false`);
- draft coordinate per ID stabile (default vuoto).

Contratto:

- non persistito;
- chiusura / full cleanup → reset;
- riapertura pannello → modalità normale;
- minimizzazione → nessuna mutazione delle coordinate;
- nessun GPS all’apertura;
- nessun live tracking;
- nessun auto-recenter;
- nessun auto-ricalcolo.

---

## I. Azioni esistenti preservate

Restano disponibili e riusate: label; pick mappa; drag marker; GPS esplicito; aggiungi/elimina passaggio; drag reorder; Su/Giù; Reverse; Undo; Calcola; Salva come traccia.

- A e B restano **non eliminabili**.
- Limite resta **20** punti.

---

## J. Ambito autorizzabile futuro

- HTML specifico pannello Routing;
- CSS specifico Routing;
- stato transiente Routing (`editMode` + draft);
- `routingRenderList`;
- point mutation helper esistente;
- UI wiring Routing;
- ramo Esc Routing;
- i18n Routing IT/EN/FR;
- build label.

---

## K. Regioni vietate

`saveStore`/`loadStore`; sanitizer; storage; `state.mapWaypoints[]`; schema `savedTracks`; `gisPolygons`; `state.track`; `geocodeSearch`; `offlineForwardSearch`; `geocodingAllowed`; OPSEC; provider/endpoints; implementazione request Routing salvo riuso invalidazione; `attachPanHandlers`; `workbenchMapInteractionBlocked`; marker drag handlers salvo chiamata esistente; profilo altimetrico; difficoltà; **MAP-CENTER-VIEWPORT-AWARE-A**; profilo Saved Track; Bundle F; gateway online.

---

## L. Esclusioni v1

Geocoding per riga / multi-riga; editing grafico altimetrico; editing quote; persistenza punti Routing; salvataggio label punti in `savedTracks`; condivisione con waypoint canonici; nuovi provider; alternative; round trip; andata/ritorno; avoid areas; cronologia persistente; auto-ricalcolo; coordinate in formati diversi da **DD numerici**.

---

## M. Classificazione e gate

**Classificazione futura:** **DELICATO leggero**.

Motivazioni: nuovo stato UI transiente; draft keyed by ID; nuova modalità lifecycle nel pannello; validazione e commit atomico; interazione con undo e stale request.

**Review downstream pre-deploy:** **OBBLIGATORIA**.

Non classificare come modifica storage, rete, OPSEC o sanitizer.

---

## N. Stima

| Region | Righe (±) |
| --- | --- |
| HTML | 10–25 |
| CSS | 25–45 |
| JS stato/draft/lifecycle | 30–60 |
| JS rendering e commit atomico | 60–100 |
| i18n | 18–30 |
| build | bump esistente |
| **Totale indicativo** | **150–260** |

**Singolo bundle coerente.** Nessuno split per micro-item.

---

## O. Test futuri

**Harness/static:** editMode default/reset; draft keyed per ID; parsing valido; NaN/Infinity rifiutati; lat/lon fuori range rifiutati; nessuna normalizzazione; commit atomico; una snapshot undo; una invalidazione; source non falsamente gps/map; nessuna persistenza; `mapWaypoints` invariato; build e i18n.

**Browser:** attiva/disattiva modalità; coordinate A/B/intermedio; Enter; Applica; errore + stato precedente preservato; Undo; pick/drag/GPS; add/remove/reorder; Reverse; richiesta in corso + stale; Calcola manuale; profilo/difficoltà dopo nuovo calcolo; Salva come traccia; minimize/close/reopen; mobile; tastiera; nessun GPS automatico; nessun auto-ricalcolo.

**QA operatore futura:** minima narrativa con copertura A, B, intermedio, input invalido, Undo, ricalcolo, pannello mobile/stretto.

---

## P. Stop conditions runtime

Il futuro prompt runtime deve **fermarsi** se:

- `_routing` entra nella persistenza;
- serve cambiare schema `savedTracks`;
- serve un nuovo valore `source` non ratificato;
- serve modificare geocoding/rete;
- serve toccare `attachPanHandlers`;
- non è possibile fare commit atomico della coppia;
- vengono introdotti listener concorrenti;
- il diff supera significativamente la stima;
- il profilo altimetrico viene trasformato in editor;
- lifecycle del pannello richiede una riscrittura.

---

## Prossimo gate

1. Review del piano (operatore / orchestratore).
2. Prompt runtime chirurgico Agent — **non** autorizzato da questo documento.
3. Review downstream pre-deploy obbligatoria.
4. Deploy GIS-only + QA operatore minima narrativa.
5. `finito` / Regola H solo dopo QA PASS (se coda pre-autorizzata nel prompt runtime).

**ROUTING-POINT-COORD-EDIT-A DESIGN OPENED — RUNTIME NOT STARTED**
