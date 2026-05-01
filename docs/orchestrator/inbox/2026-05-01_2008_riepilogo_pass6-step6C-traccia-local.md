# Riepilogo — Pass 6 Step 6C — Traccia (monolite locale)

**Data:** 2026-05-01  
**Scope:** UI/layout modal **`#trackModal`** (partial-offscreen) + azioni compatte tracce salvate e rimozione punto draft; **nessun** cambio a logica tracking, GPS live, schema `state.track` / `state.savedTracks`, export/import, persistenza.

## Cosa è stato fatto (monolite)

### 1. Modal Traccia partial-offscreen — **sì**

- **`_trackPanelLayoutOpts()`**: aggiunto **`partialMinVisible: 72`** (stesso valore Waypoint / Layers / RR / Preferiti).
- **`attachTrackModalDrag`** / **`attachTrackModalResize`**: già delegano a **`gisPanelAttachDrag`** / **`gisPanelAttachResize`** con `Object.assign({}, opts, …)` → ereditano automaticamente drag/resize parziale.
- **`clampTrackModalRect`**: da **`gisPanelClampRect`** a **`gisPanelClampRectPartialVisible`** quando `opts.partialMinVisible` è definito (coerente con altri pannelli).
- **`applyTrackModalSavedPosition`**: stesso criterio sul clamp posizione dopo restore layout (finestra ridimensionata / riapertura).

### 2. Tracce salvate — azioni compatte — **sì**

- **`renderSavedTracksList`**: pulsanti **Modifica / Centra / Elimina** resi **✎ / ⌖ / ✕** (icone + `data-i18n-tip` / `data-i18n-aria`); attributi **`data-saved-edit`**, **`data-saved-fly`**, **`data-saved-del`** e delegazione click **invariati**.
- Post-render: **`data-tip`** / **`aria-label`** anche per **`[data-saved-fly]`** (come già per edit/del).
- CSS: colonna azioni **`min-width: 120px`**, **`.saved-row-actions`** gap compatto, regola **`.saved-row-actions .btn.btn-sm:not(.btn-danger-subtle)`** per icone.

### 3. Punti draft — azioni compatte — **sì**

- **`renderTrackPointsList`**: bottone rimozione con **`btn btn-sm btn-danger-subtle`**, **`data-role="tp-rm"`** invariato, **`danger-x`** + **`aria-label`**; wiring **`trackRemovePoint`** invariato.
- CSS **`.track-point-row .tp-actions`**: layout compatto; stile dedicato **`[data-role="tp-rm"]`**.

## Cosa è stato lasciato invariato (sicurezza)

- Nessun **live tracking** / `watchPosition` / GPS silenzioso.
- **`window.confirm`** su rename traccia salvata: **lasciato** (pre-esistente; non sostituito).
- **Schema** `state.savedTracks` / `state.track`, **localStorage**, export/import, overlay, DnD reorder, **`deleteSavedTracksByIds`**, **`flyToSavedTrackById`**, **`beginEditSavedTrackById`**: **non modificati** nella logica.

## Non implementato

- **Pass 6 Step 6D** (QA globale).
- **Range Rings** polish.

## QA automatico

- `git status --short`: atteso **`M coordinate_converter Claude.html`** (monolite locale).
- Nessun `<script src>` / `type="module"`.
- **2** coppie `<script>` / `</script>`.
- **`node --check`**: OK su **due** blocchi inline estratti (regex senza `src`).

## Test browser

- **Non eseguiti** dall’agente. Checklist: GIS → Traccia → drag parziale ai bordi; resize; tracce salvate ✎/⌖/✕ + tooltip; rimuovi punto draft; salvataggio/export/import; nessun GPS live; Preferiti/Waypoint/Layers/Astro/RR; console.

## Git / memoria

- **`coordinate_converter Claude.html`**: modificato **solo in locale**; **non incluso** nel commit memoria.
- Commit memoria: messaggio **`docs: memoria Pass 6 Step 6C traccia local`** (solo `docs/orchestrator/latest.md` + questo inbox).

## Prossimo passo consigliato

- Smoke manuale Step 6C; poi **Pass 6 Step 6D** o **`finito`** / commit monolite a fine sessione.
