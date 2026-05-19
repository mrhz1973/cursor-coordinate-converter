# Browser PASS CoT XML + Enter-to-save waypoint name

**Data:** 2026-05-19 16:00  
**Branch:** main  
**HEAD after commit:** (see commit hash in report)

---

## Part A — Browser PASS: T1.2 CoT XML import/export

### Test source

Utente, manualmente, nel browser. Risultato: **"funziona tutto"**.

### Risultato

| Test | Esito |
|------|-------|
| Export CoT XML (pulsante dialog export) | **PASS** |
| Import CoT XML (drag/browse file .cot) | **PASS** |
| Roundtrip app-interno (export → delete all → import) | **PASS** |

### Rischio deferred

Il root XML del bundle è `<goiCotWaypointBundle>` (namespace proprietario), non `<events>` standard ATAK/WinTAK. L'import nella app funziona in roundtrip (usa `getElementsByTagName("event")` che ignora il root). Compatibilità con ATAK/WinTAK client reali **non separatamente validata**. Da verificare in futuro se richiesta interop esterna.

---

## Part B — Implementazione: Enter-to-save nel campo nome waypoint

### Richiesta utente

Dopo aver selezionato un punto sulla mappa e scritto il nome nel campo waypoint, premere **Enter** deve salvare il waypoint e rimettere l'app in stato "pronto per il prossimo waypoint" (stesso flusso del doppio-click).

### File modificato

`coordinate_converter Claude.html`

### Patch (targeted diff)

Aggiunto handler `keydown` su `#wpFieldName` immediatamente dopo il binding esistente di `#wpFieldCoord` (riga ~36068), in un blocco idempotente (`_wpNameEnterBound`):

```js
const wpName = document.getElementById("wpFieldName");
if (wpName && !wpName._wpNameEnterBound) {
  wpName._wpNameEnterBound = true;
  wpName.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    if (!state.waypointEditorDraft) return;
    const wasNew = !state.waypointEditorDraft.id;
    commitWaypointEditor();
    if (wasNew && !state.waypointEditorDraft) {
      if (typeof startWaypointNewWaypointFlow === "function") startWaypointNewWaypointFlow();
    }
  });
}
```

### Logica

| Caso | Comportamento |
|------|---------------|
| Nuovo waypoint (draft senza `id`), coord valide | Salva + `startWaypointNewWaypointFlow()` → pick mode re-armato |
| Nuovo waypoint, coord non valide | `commitWaypointEditor` fa `return` senza chiudere; draft resta; feedback coord mostrato; `startWaypointNewWaypointFlow` **non** chiamato |
| Editing waypoint esistente (draft con `id`) | Salva; `wasNew = false`; `startWaypointNewWaypointFlow` **non** chiamato |
| `#wpFieldNotes` (textarea) | Handler su `wpFieldName` non coinvolto; Enter in textarea invariato |
| Aperture ripetute del modale | Guard `_wpNameEnterBound` evita listener duplicati |

### Riferimenti a funzioni esistenti

| Funzione | Riga | Ruolo |
|----------|------|-------|
| `commitWaypointEditor()` | 40248 | Valida coord, chiama `waypointAdd`/`waypointUpdate`, `closeWaypointEditor()` |
| `closeWaypointEditor()` | 40179 | Nasconde editor, azzera `state.waypointEditorDraft` |
| `startWaypointNewWaypointFlow()` | 40196 | Riattiva pick mode mappa, apre editor vuoto |
| `openWaypointEditor()` | 40105 | Apre editor (usato da `startWaypointNewWaypointFlow`) |

---

## Static checks

| Check | Risultato |
|-------|-----------|
| `<script src` | **0** |
| `type="module"` | **0** |
| Blocchi `<script>` / `</script>` | **2** |
| `node --check` blocco principale | **SYNTAX OK** (Node v24.15.0) |

---

## Browser QA

**NOT EXECUTED** — ambiente senza browser.

### Checklist manuale

1. Aprire GIS Tool nel browser.
2. Aprire pannello Waypoint.
3. Cliccare sulla mappa per creare un waypoint → editor aperto con pick mode.
4. Scrivere "Alpha" nel campo nome.
5. Premere **Enter**.
6. Verificare: "Alpha" salvato nell'elenco; editor svuotato e pick mode ri-armato (cursore `copy` / hint visibile).
7. Doppio-click sulla mappa per "Bravo" → verificare che il doppio-click save funziona ancora.
8. Scrivere "Bravo", premere **Enter** → salvato e re-arm.
9. Aprire editor su waypoint esistente (click ✎ in lista) → cambiare nome → **Enter** → salvato; **no** nuovo waypoint creato.
10. Regressione:
    - **Annulla** / **Esc** ancora funzionanti.
    - **Enter** nel campo note (textarea) non salva (solo newline).
    - Delete waypoint, delete-all, preferiti invariati.
    - Export CoT XML, GPX, KML, GeoJSON invariati.
    - Import CoT XML invariato.
    - Nessun errore in console.

---

## Rischi noti / deferred

- Se coordinate non sono ancora state inserite quando si preme Enter, `commitWaypointEditor` mostra feedback errore ma non chiude l'editor — comportamento corretto e coerente con il bottone Salva.
- `_wpNameEnterBound` è una proprietà sull'elemento DOM: è persistente per la vita della pagina (elemento statico). Non crea leak.
- Interop ATAK/WinTAK per CoT XML rimane deferred (root bundle non standard).
