# Riepilogo — Pass 6 Step 6B — Mappe online/offline (monolite locale)

**Data:** 2026-05-01  
**Scope:** solo UI/layout `#layersPanel` + lista aree offline; nessuna modifica a logica tile/cache/IndexedDB/OPSEC/download/cancellazioni.

## Cosa è stato fatto (monolite)

1. **`#layersPanel` partial-offscreen — sì**
   - In **`_layersPanelLayoutOpts()`**: aggiunto **`partialMinVisible: 72`** (allineato a Favoriti / Range Rings / Waypoint).
   - In **`clampLayersPanelRect`**: sostituito **`gisPanelClampRect`** con **`gisPanelClampRectPartialVisible`** (stesso pattern di **`clampFavoritesPanelRect`** / **`clampRangeRingsPanelRect`**).
   - **`attachLayersPanelFloatingGis`** / **`gisPanelAttachDrag`** / **`gisPanelAttachResize`** ricevono già `opts` da `_layersPanelLayoutOpts()` → drag e resize usano automaticamente il clamp parziale dove previsto dal helper condiviso.

2. **Azioni lista aree offline compattate — sì (solo presentazione)**
   - In **`renderOfflineAreasList`**: pulsanti **Carica nei campi** (edit area) e **Adatta/Centra** resi **icona** ✎ e ⌖ con **`data-offline-load`** / **`data-offline-fit`**, **`data-tip`**, **`data-i18n-tip`**, **`data-i18n-aria`**, **`aria-label`** invariati semanticamente (testo = tip esistente).
   - **Elimina**: markup e attributi **invariati** (solo danger ✕, stessi handler delegati).
   - CSS: colonna azioni default **`--offa-actions-col: 132px`**, **`min-width: 112px`**, gap ridotto, stile **`.offa-actions .btn.btn-sm:not(.btn-danger-subtle)`** compatto (coerente Preferiti).
   - **`ensureOfflineAreasNameColResizeWired`**: min/max colonna azioni da **200** a **112** px minimo; clamp applicato in **`renderOfflineAreasList`** per **`_offaActionsColPx`**.

## Helper / clamp usati

- **`gisPanelClampRectPartialVisible`** (in **`clampLayersPanelRect`**).
- **`partialMinVisible: 72`** in **`_layersPanelLayoutOpts`**.
- Drag/resize: **`gisPanelAttachDrag`**, **`gisPanelAttachResize`** (logica esistente con `opts.partialMinVisible`).

## Cosa è stato lasciato invariato (sicurezza)

- Nessuna modifica a **OPSEC**, **geocoding**, **download/cancel tile**, **cache tile**, **IndexedDB**, **schema `state`**, **`localStorage`** (nessuna nuova chiave), **`state.lastResult`**, **`state.lastPoint`**, cronologia, permalink.
- **Nessuna cancellazione tile** aggiunta o modificata; semantica **Elimina** invariata (solo UI delete button appearance già a icona).
- **`ensureOfflineAreasListDelegation`**, funzioni **`loadNamedAreaIntoPrecacheFieldsById`**, **`flyMiniMapToOfflineNamedAreaById`**, portal **`ensureOfflineAreasTooltipPortal`** (selettori **`data-offline-load`**, **`data-offline-fit`**) — handler e attributi dati **inalterati** per la logica.

## Non implementato in questo step

- **Pass 6 Step 6C** (Traccia).
- **Pass 6 Step 6D** (QA globale).
- **Range Rings** polish.
- **`finito`**.

## QA automatico

- `git status --short`: atteso **`M coordinate_converter Claude.html`** (e dopo commit memoria: monolite ancora modificato localmente).
- `grep` `<script src>` / `type="module"`: nessun match atteso.
- Conteggio **2×** `<script>` / `</script>`: OK.
- **`node --check`**: OK su **due** blocchi inline estratti con regex non-greedy (no `src`).

## Test browser

- **Non eseguiti** in ambiente agent. Checklist manuale: aprire GIS → **Mappe online/offline** → trascinare `#layersPanel` oltre bordi sinistro/destro/alto/basso; resize; verificare **Carica** (✎), **Adatta** (⌖), **Elimina** + conferme; tooltip portal su load/fit; OPSEC/offline toggle; Preferiti/Waypoint/Astro/RR senza regressioni; console pulita.

## Git / memoria

- **`coordinate_converter Claude.html`**: modificato **solo in locale** in questo intervento; **non incluso** nel commit orchestratore (policy default).
- Commit memoria atteso messaggio: **`docs: memoria Pass 6 Step 6B mappe offline local`** (solo `docs/orchestrator/latest.md` + questo file inbox).

## Prossimo passo consigliato

- Smoke manuale Step 6B in browser; poi **Pass 6 Step 6C** (Traccia) o **`finito`** a fine sessione utente.
