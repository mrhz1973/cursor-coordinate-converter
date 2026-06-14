# Handoff — post B2 correttivo + prossimo blocco toolbar

**Data:** 2026-06-14 16:02 Europe/Rome  
**Repo:** `mrhz1973/cursor-coordinate-converter`  
**Tipo:** `handoff`  
**Read-set operativo target:** `README.md` + `docs/OPERATING_MEMORY.md` + WU corrente  
**File operativo:** `coordinate_converter Claude.html`

---

## 1. Stato remoto verificato

- `origin/main` è arrivato a `5201ff8` — `fix(gis): remove accidental B2 monolite changes`.
- Il commit `3eb167c` — `docs(memory): define Claude counselor role limits` — aveva inglobato per errore anche artefatti runtime B2 nel monolite.
- Il commit correttivo `5201ff8` ha rimosso gli artefatti B2 dal monolite mantenendo la modifica docs.
- `docs/OPERATING_MEMORY.md` contiene la nuova regola sul ruolo Claude: Claude non scrive prompt per Cursor; i prompt per Cursor li scrive GPT.

---

## 2. Stato locale operativo Windows

Repository Windows corretto:

```powershell
C:\Users\mrhz\Documents\AI\Tools\CesiumTest
```

Comando base da usare prima di ogni operazione Git locale:

```powershell
cd "C:\Users\mrhz\Documents\AI\Tools\CesiumTest"
git status -sb
```

Ultimo stato riportato:

```text
## main...origin/main
```

Nota: `C:\Users\mrhz` da solo non è una working copy Git. Tutti i comandi Git progetto vanno eseguiti nel path sopra oppure nel terminale integrato Cursor già aperto su quel repo.

---

## 3. WU-0004 — stato reale dopo la correzione

### Confermato

- B1 resta valido: rimozione della mutua esclusione Navionics/SonarChart.
- `_lastBaseLayerNonNav` deve restare assente.
- Navionics basemap e SonarChart devono poter restare attivi insieme.
- La rimozione del toggle `Basemap visibile` è stata decisa dall'operatore.
- Gli artefatti B2 del toggle `basemapHidden` non devono essere reintrodotti.

### B2 bocciato / rimosso

B2 come toggle `Basemap visibile` è stato scartato. Non reintrodurre:

- `state.basemapHidden`;
- `.tile-map.basemap-hidden`;
- chiavi i18n `map.basemapVisible` / `tip.basemapVisible`;
- voce menu Layers `Basemap visibile`;
- handler `data-overlay="basemap-visible"`;
- hydrate condizionato dalla basemap hidden;
- export JPG con fill scuro condizionale.

### Nota importante sui docs WU

`docs/work-units/WU-0004-navionics-basemap-sonarchart-independence.md` può risultare ancora storico/non riallineato rispetto alla decisione più recente: il testo originale prevedeva la possibilità di nascondere la basemap. La decisione operativa aggiornata è invece: **non serve uno stato nero/no-basemap; se una basemap radio è selezionata, la basemap si vede.**

Prima di chiudere WU-0004, serve un piccolo riallineamento docs se si decide di aggiornare la WU: B1 PASS, B2 toggle basemapHidden bocciato/rimosso, prossimo lavoro spostato su UX toolbar.

---

## 4. Regola ruolo Claude/GPT

Regola ora pubblicata in `docs/OPERATING_MEMORY.md`:

- Claude NON scrive prompt per Cursor, mai.
- Claude lavora a monte come consigliere e a valle come revisore/verificatore.
- GPT scrive sempre i prompt per Cursor.
- Se Claude sta producendo testo destinato a Cursor, deve fermarsi e passare la sostanza a GPT, non il prompt.

Implicazione pratica: i prompt Cursor devono essere emessi da GPT. Claude può criticare, verificare `origin`, proporre decisioni o segnalare rischi.

---

## 5. Prossimo blocco consigliato

Non aprire subito un blocco grande senza nuovo piano. Il prossimo lavoro operativo è **UX toolbar laterale / pulsanti mappa**, separato da WU-0004 B2.

Richiesta utente da trasformare in piano/prompt Cursor, passo-passo:

1. Rimuovere definitivamente l'idea del pulsante `Basemap visibile`.
2. Ridurre/razionalizzare i pulsanti laterali perché coprono la barra cache in basso, soprattutto al cambio zoom.
3. Allineare meglio il pulsante `Layers`.
4. Spostare `MGRS` dentro `Layers` come overlay/layer sovrapponibile.
5. Raggruppare `Posiziona punto sulla mappa`, `Waypoint` e `Torna al punto sulla mappa` in un pulsante unico espandibile a 3 sottopulsanti, con azione principale orientata alla creazione nuovo waypoint.
6. Spostare `Poligoni` dentro il pulsante/area `Traccia`; poligoni attualmente segnalato come non funzionante.
7. Cambiare il pulsante GPS: usare testo `GPS` invece dell'icona attuale; in futuro il testo cambierà colore in base alla qualità del segnale.
8. Aggiungere `Range` e `Bearings` come terzo pulsante/azione dentro `Tracce`.
9. Cambiare l'icona del pulsante distanza con qualcosa di più simile a un righello.

---

## 6. Vincoli per il prossimo prompt Cursor

- Procedere a blocchi piccoli.
- Prima fare analisi/piano, non patch massiva.
- Non toccare OPSEC, fetch, cache, proxy, consenso Navionics, offline download/export.
- Non reintrodurre `basemapHidden` o `Basemap visibile`.
- Non reintrodurre mutua esclusione Navionics/SonarChart.
- Non fare refactor grande del monolite.
- Limitare il prompt a regioni UI mappa/layers/toolbar quando possibile.
- Per UX complessa usare Plan + Auto; GPT-5.5 solo se Auto si incarta o rischio alto.

---

## 7. Stato da verificare all'inizio della prossima chat/sessione

Eseguire o chiedere:

```powershell
cd "C:\Users\mrhz\Documents\AI\Tools\CesiumTest"
git fetch origin
git status -sb
git log origin/main --oneline -5
```

Atteso:

```text
main allineato a origin/main
origin/main include 5201ff8
nessuna modifica pendente
```

Poi leggere read-set:

- `README.md`
- `docs/OPERATING_MEMORY.md`
- WU corrente in `docs/work-units/`

---

## 8. Decisione operativa consigliata

Prima di generare il prompt per Cursor sulla toolbar:

1. chiedere conferma all'operatore se vuole un blocco solo di **analisi/piano UX toolbar**;
2. poi preparare prompt Cursor con modalità **Plan + Auto**;
3. chiedere a Cursor di non modificare codice nel primo giro, ma di mappare regioni/funzioni/pulsanti coinvolti e proporre micro-blocchi;
4. solo dopo il piano, implementare il primo micro-blocco.
