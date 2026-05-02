# Pass 6 — Step 6E.3d (Misura: resize + Esc; monolite solo locale)

**Data:** 2026-05-02  
**Scope:** correzione micro-step **6E.3d** dopo **6E.3c** (`#measurePanel` floating).

## Sintesi

1. **Resize Misura non funzionava:** gli handle erano nel DOM e il wiring `gisPanelAttachResize` / `_measurePanelLayoutOpts` era già corretto; **mancavano le regole CSS di ancoraggio agli angoli** per `#measurePanel` (come già fatto per `#rangeRingsPanel` / `#astroPanel`). Gli handle restavano di fatto non agganciati ai bordi del dialog.
2. **Esc con Misura aperta non chiudeva:** `#measurePanel` usa **`dialog.show()`** (non `showModal`). Con `show()` il browser **non emette l’evento `cancel` su Esc** come per modal stack; il listener `cancel` su `#measurePanel` non basta. Il ramo Misura in `bindHotkeys` azzerava i punti solo se ce n’erano; **senza punti** si cascava nel ramo «idle» GIS (`preventDefault` + `return`) senza chiudere il pannello.
3. **Fix resize:** blocco CSS `#measurePanel .gis-panel-resize-handle[…]` speculare a Range Rings (posizioni SE/NW/NE/SW + `::after` angoli + NE senza alone visivo). Aggiunte `#measurePanelHead` alle regole cursore grab/dragging coerenti con gli altri floating e **`body:not(.gis-mode) #measurePanel .gis-panel-resize-handle { display:none }`** per parità con RR/Astro.
4. **Fix Esc:** nel ramo `gis-mode && gisMeasureIsDrawerContext() && state.mapMeasureMode`, dopo aver gestito **`hadPts`** (clear overlay), se non ci sono punti si chiama **`closeMeasureFloatingPanelGis()`**, `preventDefault`, `return`. **Minimizzato:** `gisMeasureIsDrawerContext()` è falso → il ramo non gira → Esc resta «idle» come altri pannelli minimizzati (GIS listener già ignorava minimizzato).

## Checklist richiesta (Task 9)

| Voce | Esito |
|------|--------|
| Causa resize non funzionava | CSS: handle senza ancoraggio ai vertici del dialog |
| Resize fix | **Sì** |
| Handle/angoli funzionanti | **Sì** (atteso: stesso pattern RR; QA browser non eseguito qui) |
| Body sync dopo resize | **Sì** (invariato: `gisPanelAttachResize` chiama già `gisPanelSyncBodySize`) |
| Partial-offscreen dopo resize | **Sì** (invariato: `gisPanelClampRectPartialVisible` in resize) |
| Causa Esc non funzionava | `dialog.show()` + ramo bindHotkeys senza close quando non `hadPts` |
| Esc fix | **Sì** |
| Comportamento Esc scelto | Prima Esc continua a **cancellare vertici** se presenti; senza vertici **chiude Misura** (`closeMeasureFloatingPanelGis`), allineato ai floating con gestione Esc centralizzata |
| Esc ignora Misura minimizzata | **Sì** (`gisMeasureIsDrawerContext()` false se minimizzato) |
| Misura floating/drag/bring/minimizza non regressione | **Sì** (solo CSS handle + bindHotkeys; drag/z-order non rifattorizzati) |
| Altri pannelli davanti a Misura | **Sì** (nessuna modifica z-index) |
| Converti non toccato | **Sì** |
| Converti→Waypoint | **NON implementato** |
| Rimozione Preferiti da Waypoint | **NON implementata** |
| GPS non toccato | **Sì** |
| Schema / localStorage / `state.lastResult` | **Nessuna modifica** |
| OPSEC / tile / cache / geocoding | **Nessuna modifica** |
| Test automatici | `git status`, `git diff --stat`, grep `<script src>` / `type="module"`, conteggio `<script>` 2/2, `node --check` blocchi **9836–9962** e **9966–41751** OK |
| Test browser | **Non eseguiti** (ambiente agent); checklist manuale nel RIEPILOGO utente |
| Diff baseline 6E.3d | ~76 righe: solo CSS Misura + bindHotkeys Misura |
| Monolite in commit | **No** (policy default) |

## File toccati (locale)

- `coordinate_converter Claude.html` — CSS `#measurePanel` resize; `#measurePanelHead` grab; bindHotkeys Esc Misura.

## Prossimo passo consigliato

- Smoke utente su resize + Esc (incluso Misura minimizzata + coesistenza Traccia).  
- Passo funzionale **6F.1** solo quando autorizzato (non parte di 6E.3d).
