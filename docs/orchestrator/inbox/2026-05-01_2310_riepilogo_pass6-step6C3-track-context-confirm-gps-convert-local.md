# Pass 6 Step 6C.3 — Traccia: context menu su mappa, conferme interne, GPS statico, Converti non blu

**Data:** 2026-05-01  
**Scope:** solo micro-step **6C.3** su monolite locale; **nessun** Step 6D globale; **nessuna** minimizzazione modal; **nessun** `finito`; **nessun** commit del monolite.

## Checklist richiesta (sì/no)

1. **Fix no lampeggio marker / posizione:** **sì**
   - Rimosso cerchio extra **`.gis-gps-pulse`** da **`renderGisMapGpsOverlay`** (nessuna animazione continua sull’overlay GPS).
   - Rimossa regola CSS **`.gis-gps-pulse`**.
   - In **`body.gis-mode`**: anello **`::after`** del pin **`.tile-marker`** senza **`mapMarkerPulse`** (incluso **`tile-marker-draft`**) — evita sensazione di tracking live quando si centra / pin principale.

2. **Tasto destro su traccia salvata visibile in mappa:** **sì**
   - **`renderSavedTracksOverlays`**: SVG **`pointer-events: auto`**; **`data-saved-map-hit`** su `circle` / `polyline` / `polygon`; CSS mirato (`stroke` / `visiblePainted` / `all`) al posto del precedente **`pointer-events: none`** sulla geometria.
   - Listener **`contextmenu`** in capture su SVG → **`showTrkSavedCtxMenu`**.

3. **Causa mancato tasto destro prima:** overlay salvate con **`pointer-events: none`** su SVG e su ogni linea/punto; il menu era cablato solo su **`#savedTracksMount`** (righe tabella).

4. **Conferme eliminazione traccia salvata sempre interne al modal Traccia (quando il modal è aperto):** **sì**
   - Barra **`#trackSavedDeleteBar`** (skin **`.gis-rr-confirm-skin`**) sotto **`#trackSaveGuardMsg`**.
   - **`requestSavedTracksDelete(ids)`** → barra interna se **`#trackModal`** aperto; altrimenti fallback **`window.confirm`** (solo se modal chiuso).
   - **`deleteSavedTracksByIds(ids, opts)`** con **`opts.skipConfirm`** per il commit dopo conferma interna.
   - **Esc** (prima di chiudere il modal): annulla la barra (**`trackHideSavedDeleteConfirmBar`**).
   - **`_closeTrackModalCore`** / apertura modal: nasconde la barra (conferma annullata alla chiusura).

5. **`window.confirm` sostituiti nei flussi delete traccia salvata (con modal aperto):** quelli che passavano da **`deleteSavedTracksByIds`** senza skip — ovvero **delete da riga tabella**, **batch «Elimina selezionate»**, **Elimina dal menu contestuale** (tutti ora **`requestSavedTracksDelete`**).  
   **`deleteSavedTracksByIds`** conserva ancora **`window.confirm`** se chiamato senza **`skipConfirm`** (compatibilità / chiamate legacy non trovate).

6. **Pulsante «Converti» topbar non blu:** **sì** — rimossa classe **`app-topbar-btn-primary`** da **`#topbarConvertBtn`**; commento CSS allineato.

7. **Minimizza modal floating:** **non implementato**; resta **prossimo blocco separato** (helper/pattern comune, non patch locale Traccia).

8. **Nessun live tracking GPS:** **sì** — nessun **`watchPosition`** (grep assente).

9. **Nessun GPS silenzioso:** **sì** — solo flusso esistente **`getCurrentPosition`** su azione utente.

10. **Nessuna modifica schema `state.savedTracks` / localStorage / `state.lastResult`:** **sì** — solo variabili runtime a modulo (**`_trackSavedDeletePendingIds`**) per la conferma.

## Funzioni / regioni toccate (monolite)

- CSS: **`body.gis-mode .tile-marker::after`**, **`.gis-map-gps-overlay`** (rimozione pulse), **`.saved-tracks-overlay`** pointer-events per hit-test.
- HTML: **`#trackSavedDeleteBar`**, **`#topbarConvertBtn`** classi.
- JS: **`trackHideSavedDeleteConfirmBar`**, **`trackShowSavedDeleteConfirmBar`**, **`requestSavedTracksDelete`**, **`trackWireSavedDeleteBarOnce`**, **`deleteSavedTracksByIds`**, **`renderSavedTracksOverlays`**, **`renderGisMapGpsOverlay`**, **`ensureTrkSavedCtxMenu`** (delete → request), **`renderSavedTracksList`** click delete, batch delete handler, **`bindHotkeys`** (Esc), **`_closeTrackModalCore`**, **`openTrackModal`**, init track (`trackWireSavedDeleteBarOnce`).

## QA automatico

- `git status --short` / `git diff --stat`: monolite modificato (diff ampio include lavoro preesistente 6A–6C.2 + 6C.3).
- Nessun `<script src>`; nessun `type="module"`; 2× `<script>` / `</script>`.
- **`node --check`**: OK sui blocchi **9326–9452** e **9456–40120**.

## Test browser

**Non eseguiti** in questa sessione (nessun browser). Checklist manuale: aprire Traccia + Waypoint; RMB tabella e mappa; Elimina → barra interna; Esc sulla barra; GPS statico; Converti funziona e stile non primario; smoke Preferiti / Waypoint / offline / RR / Astro.

## Non implementato (come da vincoli)

- Minimizza modal; Step 6D globale; `finito`; commit monolite; `git add .`.

## Commit memoria orchestratore

- Messaggio: **`docs: memoria Pass 6 Step 6C3 track context local`**
- Hash: **`40bd194`**
- Push: **riuscito** (`main` → remoto).
- File: **`docs/orchestrator/latest.md`**, questo **`inbox`**.
- **`coordinate_converter Claude.html` escluso** dal commit.

## `window.confirm` residui (audit futuro, fuori scope 6C.3)

Esempi ancora presenti nel monolite: **`beginEditSavedTrackById`** (modifica traccia salvata), rename inline tabella, **`track.clear`/`track` batch altrove**, Preferiti clear, map waypoint clear, session/offline, ecc. — non sostituiti in questo micro-step.
