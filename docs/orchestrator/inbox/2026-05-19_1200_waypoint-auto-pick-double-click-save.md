# Feat: waypoint auto pick + double-click save

**Data:** 2026-05-19 12:00 locale  
**Eseguito da:** Claude Code (claude-sonnet-4-6) — modalità IMPLEMENTER  
**Repo:** mrhz1973/cursor-coordinate-converter  
**Branch:** main  
**Base commit:** 5ae8ff2

---

## Summary

| Voce | Risultato |
|---|---|
| Feature 1 | Apertura pannello Waypoint → auto-attiva modalità pick nuovo waypoint |
| Feature 2 | Doppio click sulla mappa in pick mode → salva waypoint direttamente |
| File modificato | `coordinate_converter Claude.html` |
| Righe toccate | 29769, 37567 |
| Script count | 2 / 2 |
| No src | PASS |
| No type=module | PASS |
| node --check | NOT EXECUTED (node non in PATH) |
| Risultato | **IMPLEMENTATO (static PASS)** — browser QA pending |

---

## Feature 1 — Auto-start pick mode all'apertura del pannello Waypoint

### Motivazione

L'utente apriva il pannello Waypoint e doveva poi cliccare manualmente «Nuovo waypoint» per entrare in modalità pick. Il flusso atteso è che il pannello si apra già pronto a ricevere un click sulla mappa.

### Modifica (fine di `openWaypointModal`, dopo il blocco GIS rAF, riga ~37567)

```javascript
// AGGIUNTO subito prima della } di chiusura di openWaypointModal
  if (isGis){
    try { if (typeof startWaypointNewWaypointFlow === "function") startWaypointNewWaypointFlow(); } catch(_){}
  }
```

### Sicurezza

- `closeWaypointEditor()` è già chiamata alla riga 37550 (prima del nostro inserimento) → editor sempre pulito all'ingresso.
- Il branch «già aperto» (`isOpen` guard, righe 37509–37526) fa `return` prima di raggiungere questa riga → nessun doppio trigger.
- `startWaypointNewWaypointFlow()` contiene il guard `state._trackNewPromptOpen` → non interferisce con eventuali prompt track aperti.
- Il blocco GIS rAF esistente (`wireWaypointModalFloatingGis`) resta invariato sopra la nuova riga.

---

## Feature 2 — Doppio click sulla mappa in pick mode → salva waypoint

### Motivazione

In pick mode il singolo click posiziona il pin bozza e riempie il campo coordinate nell'editor. Il doppio click deve salvare direttamente il waypoint con nome default, poi re-entrare in pick mode per aggiungere un secondo waypoint.

### Modifica (`gisMapOnDblClickCenter`, riga 29769)

```javascript
// PRIMA
  if (trackPickActive || state.waypointPickMode || state.mapPickMode || state.astroPickCenterMode) return;

// DOPO
  if (trackPickActive || state.mapPickMode || state.astroPickCenterMode) return;
  if (state.waypointPickMode){
    if (ev.cancelable) ev.preventDefault();
    try {
      const d = state.waypointEditorDraft;
      if (d && Number.isFinite(d.lat) && Number.isFinite(d.lon)){
        const nm = document.getElementById("wpFieldName");
        if (nm && !String(nm.value || "").trim() && typeof t === "function")
          nm.value = t("track.waypointDefaultName") || "Waypoint";
        if (typeof commitWaypointEditor === "function") commitWaypointEditor();
        if (typeof startWaypointNewWaypointFlow === "function") startWaypointNewWaypointFlow();
      }
    } catch(_){}
    return;
  }
```

### Sicurezza

- Il guard `d && Number.isFinite(d.lat) && Number.isFinite(d.lon)` evita save se il primo singolo click non ha ancora impostato un draft valido.
- Il nome viene scritto nel campo solo se è vuoto (`!String(nm.value || "").trim()`) → rispetta quanto l'utente ha già digitato.
- `commitWaypointEditor()` legge `state.waypointEditorDraft` e i campi del form, valida, chiama `waypointAdd()`, poi `closeWaypointEditor()`.
- Dopo save, `startWaypointNewWaypointFlow()` re-entra in pick mode → l'utente può continuare a posizionare waypoint senza riaprire il pannello.
- Il doppio click non raggiunge il blocco re-center originale (il `return` alla fine del nuovo branch lo interrompe).

### Analisi timing dblclick / re-render

Il doppio click genera `mousedown → mouseup → click → mousedown → mouseup → click → dblclick`. I due `mouseup` (via `onUp` in `attachPanHandlers`) ri-renderizzano la mappa e aggiornano `state.trackWaypointDraft`. Al momento in cui `gisMapOnDblClickCenter` riceve `dblclick`, `ev.target` punta al DOM **già ri-renderizzato** dall'ultimo `onUp` sincrono. La check `tileMap.contains(ev.target)` passa correttamente perché `onUp` chiama `renderTileMap` (che sostituisce `innerHTML`) ma il `.tile-map` root rimane nel DOM stabile sotto `#miniMap` (i dettagli interni vengono rimpiazzati, non il root stesso).

---

## Static checks post-fix

```powershell
((Select-String -Path "coordinate_converter Claude.html" -Pattern '<script'    -AllMatches).Matches).Count  # → 2 ✓
((Select-String -Path "coordinate_converter Claude.html" -Pattern '</script>'  -AllMatches).Matches).Count  # → 2 ✓
((Select-String -Path "coordinate_converter Claude.html" -Pattern '<script[^>]*src'  -AllMatches).Matches).Count  # → 0 ✓
((Select-String -Path "coordinate_converter Claude.html" -Pattern 'type="module"'    -AllMatches).Matches).Count  # → 0 ✓
```

### node --check

NOT EXECUTED — `node` non presente in PATH su questo workstation Windows 10.

---

## Browser QA (checklist manuale pending)

### Feature 1 — Auto-start pick mode

- [ ] Aprire `coordinate_converter Claude.html` con server locale (`python -m http.server 8000`)
- [ ] Aprire GIS mode
- [ ] Aprire il pannello Waypoint (icona mappa → Waypoint)
- [ ] Verificare: cursore mappa cambia in `copy`, hint pick compare automaticamente
- [ ] Verificare: `state.waypointPickMode === true` (console: `state.waypointPickMode`)
- [ ] Verificare: editor `#waypointEditor` aperto con campo coord vuoto
- [ ] Cliccare un punto sulla mappa → pin bozza compare nel punto cliccato
- [ ] Verificare: campo coord riempito
- [ ] Compilare nome → Salva → waypoint aggiunto alla lista

### Feature 2 — Doppio click salva

- [ ] Con pannello Waypoint aperto e pick mode attivo, cliccare sulla mappa (pin bozza compare)
- [ ] Doppio click sullo stesso punto (o diverso)
- [ ] Verificare: waypoint salvato nella lista con nome default «Waypoint» (se campo vuoto)
- [ ] Verificare: pick mode riattivato automaticamente dopo il salvataggio
- [ ] Verificare: secondo doppio click → secondo waypoint aggiunto
- [ ] Verificare: se nome già digitato nel campo, viene usato il nome digitato (non sovrascritto)
- [ ] Verificare: doppio click senza primo singolo click (draft assente) → nessun save, nessun errore
- [ ] Verificare: doppio click fuori da pick mode → comportamento re-center originale invariato

### Regression checks

- [ ] Flusso delete singolo waypoint ancora funzionante
- [ ] Flusso delete selezionati (6F.3) ancora funzionante
- [ ] Flusso batch Preferiti ancora funzionante
- [ ] Console browser senza errori

---

## Regression checks (statici)

| Funzione | Stato |
|---|---|
| Auto-start pick mode all'apertura Waypoint | IMPLEMENTATO ✓ |
| Doppio click → salva waypoint + re-enter pick mode | IMPLEMENTATO ✓ |
| Singolo click → pin bozza + riempimento coord (fix Task 2) | Invariato ✓ |
| Re-center su doppio click (fuori pick mode) | Invariato ✓ |
| 6F.3 delete selezionati | Non toccato ✓ |
| GPS / Traccia / Misura / RR | Non toccati ✓ |

---

## Next recommendation

Eseguire browser QA manuale (checklist sopra). Se PASS:

- Prossimo Tier 1: **CoT XML import/export waypoints** o **compound polygon dedicated**.
