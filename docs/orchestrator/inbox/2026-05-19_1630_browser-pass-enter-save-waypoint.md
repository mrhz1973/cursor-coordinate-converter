# Browser PASS — Enter-to-save waypoint name

**Data:** 2026-05-19 16:30  
**Branch:** main  
**HEAD:** c7933bc

---

## Test result

| Feature | Esito |
|---------|-------|
| Enter in `#wpFieldName` salva waypoint | **PASS** |
| Dopo salvataggio nuovo waypoint: pick mode ri-armato | **PASS** |
| Doppio-click save ancora funzionante | **PASS** |

**Fonte:** utente, manuale, nel browser.  
**Citazione:** *"TESTAto e funzina"*

---

## Stato attuale flusso waypoint (cumulativo)

Tutti i seguenti comportamenti sono stati verificati via browser PASS in sessioni precedenti:

| Comportamento | Commit | Esito |
|---------------|--------|-------|
| Map click → nuovo waypoint (pin bozza) | `e821858` | PASS |
| Auto-pick: apertura pannello → pick mode automatico | `5ae8ff2` | PASS |
| Doppio-click mappa → salva + re-arm | `f2e4ea8` | PASS |
| Azioni fondo pannello / "Elimina tutti" raggiungibili | `ede1ec4` | PASS |
| CoT XML export/import roundtrip app-interno | (verifica su c7933bc) | PASS |
| Enter nel campo nome → salva + re-arm (nuovo WP) | `c7933bc` | PASS |
| Enter nel campo nome → solo salva (edit WP esistente) | `c7933bc` | PASS |

---

## Modifiche in questa sessione

**Nessuna modifica al codice.** Questa sessione è docs-only.

- `coordinate_converter Claude.html`: **non toccato**
- `docs/orchestrator/latest.md`: aggiornato
- `docs/orchestrator/inbox/2026-05-19_1630_browser-pass-enter-save-waypoint.md`: questo file

---

## Prossimo passo raccomandato

**T1.1 — Compound polygon: PLAN (docs-only, multi-step design pass)**

Scope: progettare l'architettura del compound polygon (area operativa, poi potenziale polygon generale) prima di toccare il codice. Il PLAN deve produrre un documento di design che definisca i passi di implementazione, i gate QA, e i rischi — senza modificare il monolite.

---

## Prompt futuro (copy-paste ready) — T1.1 Compound Polygon PLAN

```
SESSIONE CC DA USARE:
Repo: mrhz1973/cursor-coordinate-converter
Percorso: C:\Users\mrhz\Documents\AI\GitHub\cursor-coordinate-converter
Scopo: T1.1 compound polygon — PLAN docs-only (nessun codice runtime)
NON usare: mrhz1973/dev-method
NON usare: mrhz1973/alina-lavoro
NON usare: altre cartelle o repository locali

Mode: PLAN
Preferred model: Sonnet
Effort: medium

Goal:
Produrre un piano di design per T1.1 compound polygon.
Questo è un pass docs-only. Non modificare coordinate_converter Claude.html.

Preflight:
- Conferma repo, branch main, git status clean.
- Leggi docs/orchestrator/latest.md e il piano Tier 1 esistente.

Research (read-only, marker search):
- Cerca nel monolite pattern esistenti per: polygon, area, shape, drawPolygon.
- Cerca: state.mapWaypoints, waypointAdd, renderTileMap, track/polyline pattern.
- Cerca: export functions (GPX, KML, GeoJSON) per capire come estendere ai polygon.
- NON leggere il file intero. Usa solo Grep + Read a finestre strette.

Output del PLAN:
Creare docs/orchestrator/inbox/2026-05-19_NNNN_plan_t1.1-compound-polygon.md con:

1. Definizione entità:
   - Modello dati compound polygon (id, name, points[], meta, color, type).
   - Come si distingue da Track/waypoint esistente.
   - Cap proposto (es. 50 poligoni, 200 punti per poligono).

2. Strategia UI/pannello:
   - Nuovo pannello floating o tab nel drawer esistente?
   - Come coesiste con Track, Range Rings, Waypoint (pattern minimize/floating già noto).
   - Stato panel in state (non persistito vs persistito).

3. Interazione mappa:
   - Click-to-add vertex (pattern già in Track o Misura).
   - Close polygon gesture.
   - Drag vertex se fattibile.
   - Highlight hover.

4. Persistenza:
   - Dove in state (es. state.mapPolygons).
   - saveStore / loadStore: chiave localStorage, cap.

5. Export:
   - GeoJSON Polygon (minimo richiesto).
   - KML Polygon.
   - GPX (solo waypoints dei vertici, fallback).
   - CoT XML (se pattern già usato per waypoint è estendibile).

6. Gate QA per ogni step:
   - Criteri di PASS per ogni fase prima di procedere.

7. Rischi e deferred:
   - Complessità drag vertex.
   - Hole / MultiPolygon: deferred o in scope?
   - Token budget per il monolite.

8. Step di implementazione raccomandati (es. A → B → C → D):
   - A: modello dati + persistenza (solo state, no UI).
   - B: pannello floating + lista poligoni.
   - C: interazione mappa (click vertex + close).
   - D: export GeoJSON/KML.
   - E: polish + QA.

9. Stima effort per step (S/M/L).

Regole:
- PLAN docs-only. Nessuna modifica al monolite.
- Nessun npm, bundler, TypeScript, dipendenze esterne.
- Nessun commit del monolite.
- Stage solo: docs/orchestrator/latest.md + inbox file.
- Commit message: docs: plan T1.1 compound polygon design
- Push autorizzato dopo commit docs.
```
