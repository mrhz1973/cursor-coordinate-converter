# Fix: Waypoint panel bottom actions reachable

**Data:** 2026-05-19 ~14:00
**Tipo:** bugfix UI/layout
**Commit:** (vedi git log — fix: make waypoint panel bottom actions reachable)

---

## Problema segnalato

In GIS mode, dopo apertura pannello Waypoint con molti waypoint, l'utente non riesce a raggiungere/vedere il fondo della lista (dove si trovano le azioni finali incluso il pulsante «Elimina tutti i waypoint» — `#wpDeleteAllBtn`). La barra di avviso «modifiche non salvate» (`#waypointModalUnsavedCloseBar`) visibile nella schermata peggiora il problema riducendo lo spazio verticale disponibile.

---

## Root cause

**Causa 1 — doppio scroll container:**
`.waypoint-modal-panel` aveva `overflow: auto; max-height: min(88vh, 860px)`. Il body (`.waypoint-modal-body`) riceveva `overflow-y: auto` da `gisPanelSyncBodySize`. Due scroll container nidificati: body + panel. Il fondo del panel era raggiungibile ma richiedeva navigazione su due scrollbar contemporaneamente, pratica e non intuitiva.

**Causa 2 — `gisPanelSyncBodySize` non teneva conto degli elementi tra head e body:**
`gisPanelSyncBodySize` calcolava:
```
mh = dialog_height - head_height - 3
body.style.maxHeight = mh + "px"
```
Non teneva conto di `#waypointModalUnsavedCloseBar` (~50–80 px) né di `#waypointModalMinimizeNotice`, entrambi fra `<head>` e `<body>` nel DOM del dialogo. Quando la barra era visibile, il body aveva `maxHeight` ~80 px di troppo, traboccava oltre il dialogo (che ha `overflow: hidden`), e il fondo veniva tagliato.

**Causa 3 — barra mostrata/nascosta senza ricalcolo:**
`waypointModalShowUnsavedCloseBar` e `waypointModalHideUnsavedCloseBar` non ricalcolavano la dimensione del body dopo il cambio di visibilità.

---

## Delete-all esistente?

**Sì, `#wpDeleteAllBtn` esiste già** (riga ~8861 del monolite, dentro `.wp-list-actions` dentro `.wp-modal-table-wrap`). Era presente ma non raggiungibile a causa del bug di layout. Questo fix lo rende accessibile — nessuna nuova funzione distruttiva aggiunta.

---

## Fix applicato

### CSS (`coordinate_converter Claude.html`)

Aggiunto a regola GIS esistente `body.gis-mode dialog#waypointModal… .waypoint-modal-panel`:
```css
overflow: visible;
max-height: none;
```
Il panel cessa di essere uno scroll container autonomo in GIS mode; il body (gestito da `gisPanelSyncBodySize`) diventa l'unico scroll container. Singola scrollbar, fondo sempre raggiungibile.

### JS `gisPanelSyncBodySize`

Sostituito il calcolo basato su `head.getBoundingClientRect().height` con la differenza `body.getBoundingClientRect().top - root.getBoundingClientRect().top`. Questo misura lo spazio sopra il body **qualunque elemento sia visibile** (head, barra avvisi, minimize notice), senza dover conoscere ogni elemento per nome.

```js
// Prima:
const head = opts.headEl || root.querySelector(".app-modal-head");
const hh = head ? Math.max(0, head.getBoundingClientRect().height) : 58;
...
const mh = Math.max(minBody, (h - hh - 3));

// Dopo:
const bodyBr = body.getBoundingClientRect();
const topOffset = Math.max(0, bodyBr.top - br.top);
...
const mh = Math.max(minBody, (h - topOffset - 3));
```

Cambia comportamento per **tutti i pannelli GIS** che chiamano `gisPanelSyncBodySize`. Per i pannelli senza elementi extra tra head e body, `topOffset ≈ head.height` → comportamento identico al precedente.

### JS `waypointModalHideUnsavedCloseBar` / `waypointModalShowUnsavedCloseBar`

Aggiunto in entrambe le funzioni un rAF-deferred call a `gisPanelSyncBodySize` (solo se dialogo aperto in GIS mode). Garantisce che il `maxHeight` del body venga ricalcolato ogniqualvolta la barra cambia visibilità, anche senza un resize esplicito del pannello.

---

## File modificati

- `coordinate_converter Claude.html` (3 patch: 1 CSS, 2 JS)
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-05-19_1400_fix-waypoint-panel-bottom-actions.md` (questo file)

---

## Controlli statici eseguiti

- `git diff --check`: PASS (nessun whitespace error)
- `<script>` opening: 2
- `</script>` closing: 2
- `<script src`: 0 ✓
- `type="module"`: 0 ✓
- `node --check`: NOT EXECUTED (node non in PATH in git bash su Windows)

---

## QA manuale — checklist (da eseguire in browser)

1. Apri pannello Waypoint (GIS mode).
2. Crea o carica abbastanza waypoint da far scorrere la lista.
3. Verifica che la barra avvisi in cima non nasconda controlli.
4. Scorri fino in fondo alla lista waypoint.
5. Conferma che le azioni finali (`.wp-list-actions`) siano visibili/raggiungibili.
6. Conferma che il pulsante «Elimina tutti i waypoint» (`#wpDeleteAllBtn`) sia visibile/raggiungibile.
7. Conferma che «Elimina selezionati» funzioni ancora.
8. Conferma che «Aggiungi selezionati ai Preferiti» funzioni ancora.
9. Conferma che il pick mode automatico all'apertura funzioni ancora.
10. Conferma che il doppio click per salvare funzioni ancora.
11. Apri un waypoint in modifica → modifica qualcosa → tenta chiusura → barra avvisi appare → verifica che il fondo della lista sia ancora raggiungibile.
12. Verifica la console browser: nessun errore.

---

## Rischi

- **Basso**: la modifica CSS è scoped a `body.gis-mode dialog#waypointModal`. Non tocca non-GIS mode né altri pannelli.
- **Basso**: `gisPanelSyncBodySize` cambia strategia di misura per tutti i pannelli GIS, ma la nuova formula è più accurata per tutti.
- **Nessuna** modifica al modello dati waypoint, alla logica di salvataggio, ai flussi pick mode o double-click save.

---

## Prossimo consigliato

Browser QA manuale (checklist sopra). Se PASS, pubblicare o procedere con successiva feature.
