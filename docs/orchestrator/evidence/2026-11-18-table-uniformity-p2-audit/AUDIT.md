# P2 — Audit iniziale statico tabelle/list di TMAR GIS Desktop

Data: 18 novembre 2026. Base immutabile: origin/main 53d887f4bf204bb51530bc0f4c50cb3da9742991, runtime Build311. Questo documento è AUDIT / PIANIFICAZIONE, NON QA e NON prova di implementazione delle singole tabelle. Fonte primaria: monolite coordinate_converter Claude.html e backlog operatore 2026-11-16.

## Limiti dell'inventario

Rilevate 15 occorrenze di <table nel sorgente Build311; non sono 15 tab operative. Sei non sono elenchi operativi modificabili: Diagnostica tile, Diagnostica rete, Dettaglio dislivello routing, tabella statica nel manuale, risultati Astro, prospetto stampa. Nessuna checkbox o azione di modifica arbitraria va aggiunta a queste tabelle. I componenti renderizzati con <div>, cards o liste JS richiedono verifica distinta in browser: un'assenza di <table> non significa assenza di liste operative.

## Matrice P2 — stato ESISTENTE verificato nel sorgente

| Categoria e punto del codice | Selezione (attuale) | Sort (attuale) | Resize (attuale) | Azioni/UI | Gap / direzione |
| --- | --- | --- | --- | --- | --- |
| Tracce salvate, renderSavedTracksList ~67805 | checkbox righe e tutte | vis/nome/pt/data/distanza | solo nome/data/distanza su 7 | modifica, profilo, centra, elimina | **P2-A:** tutte le 7 larghezze minime; mantenere sort/checkbox, persist prefs con sanitizer |
| Waypoint, renderWpModalList ~104108 | checkbox righe e tutte | non emerso nell'header statico | nome, dettagli su 6 | azioni punto | **P2-B:** sort appropriato e resize 6/6 |
| Poligoni, renderPolygonPanelList ~102021 | checkbox e tutte | col sort parzialmente predisposto | tutte le colonne dato eccetto selezione (verificare vis/azioni) | categoria poligono | **P2-B:** completare fisse, sort coerente, QA |
| Aree offline, renderOfflineAreasList ~66952 | checkbox e tutte | vis/nome/stato/data/zoom/layer/tile/spazio | nome/stato/data/zoom/layer/tile/spazio/azioni (fisse selezione/vis) | mostra/nascondi ecc. | **P2-B:** completa fisse senza alterare cache/tile |
| Range rings, renderRangeRingsList ~79817 | checkbox e tutte | non emerso nell'header statico | nome/centro/anelli/data/azioni (fisse selezione/vis) | azioni anelli | **P2-B:** sort e resize mancanti |
| Preferiti, renderFavorites ~75642 | nessuna checkbox nell'header tabella | non rilevato | nessuno su 4 | dettaglio/azioni preferiti | **P2-C:** selection, sort e resize con validazione azioni |
| Selettore Astro waypoint, astroFillWaypointPicker ~76112 | selezione target singolo intenzionale | sort via data-astro-wp-sort | nessuno | scegliere target Astro | **P2-C:** resize; valutare multi-sel solo se semanticamente valida (non inventare multiselezione target) |
| Selettore Astro preferiti, astroFillFavoritePicker ~76478 | selezione target singolo intenzionale | sort via data-astro-fav-sort | nessuno | scegliere target Astro | **P2-C:** resize; stesso caveat |
| Batch convertitore, renderBatch ~77631 | nessuna riga checkbox | non rilevato | nessuno | risultati calcolati | **P2-C:** sort/resize utili, non inventare edit/delete di risultati |
| Diagnostica tile/host, tabella dislivello routing, risultati Astro, report stampa, tabella statica help | N/A | N/A o sola lettura | N/A | informative | **ESCLUSE** da checkbox/azioni per evitare elementi fittizi; miglioramenti di leggibilità separati |

Le conclusioni sulle capacità correnti sono statiche, non equivalgono a test click/drag/reload. Occorre proseguire con audit dinamico delle liste non-table e verificare per ciascuna categoria gli event handler già esistenti, la visibilità delle azioni e i minimi dimensionali.

## Sequenza a scope limitato

- **P2-A (primo bundle):** Tracce salvate 7/7 colonne ridimensionabili, sort e select già esistenti non regressi, preferenze larghezze tramite impostazioni canoniche e sanitizer; nessuna modifica geometrie o altri archivi. TEST: drag 7/7, sort 5, checkbox riga/tutte, reload larghezze, short desktop con overflow X, persistenza, rollback preference, non-mobile.
- **P2-B:** Waypoint, poligoni, aree offline, anelli/range-rings, ogni categoria con test autonomi di ordinamento/resize/checkbox, no modifiche cache/DEM.
- **P2-C:** Preferiti, selettori Astro (single target preservato), batch, elenchi non-table. Audit dinamico prima delle modifiche, non trasformare output informativo in oggetto selezionabile.
- **P2 finish:** matrice tab/pannello × colonna × sort × resize × selezione × azioni con prove reali sul browser e dati sintetici isolati per tutte le categorie, QA finale operatore. Non dichiarare P2 completo per il solo P2-A.

Invarianti: singolo HTML standalone vanilla JS, nessuna rete nuova, nessun GPS implicito, offline/OPSEC strict, state.mapWaypoints[] canonico; mobile in PAUSA, DTM terreno 5–10m accuratezza HOLD. Ogni runtime bundle richiede proprio gate; vietato pubblicare modifiche non verificate.
