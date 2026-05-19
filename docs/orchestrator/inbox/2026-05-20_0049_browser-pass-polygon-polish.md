# Browser PASS — T1.1 Pass E Polygon Polish / Edit / Delete

**Data:** 2026-05-20  
**Tipo:** Browser QA (docs-only)  
**Stato:** PASS  
**User quote:** "PASS GIS Pass E"  
**Commit testato:** `9f98c5d` — `feat: add polygon polish controls`

---

## Test Result: PASS

Test eseguito **manualmente dall'utente**. **Nessuna modifica codice** in questa sessione: solo registrazione PASS in memoria orchestratore.

La conferma utente «PASS GIS Pass E» copre l'intera checklist Pass E (delete, rename, visibilità, export dopo edit, assenza regressioni sui flussi Pass A–D e su waypoint/track/pan/zoom/floating panel).

### Delete polygon — PASS

| Check | Result |
|---|---|
| Pulsante Elimina nella riga lista del pannello Poligoni | ✓ |
| Conferma interna `#polygonPanelDeleteBar` (no `window.confirm`) | ✓ |
| `gisFeatureDelete` rimuove il poligono da `state.gisPolygons` | ✓ |
| Poligono sparisce dalla lista del pannello | ✓ |
| Poligono sparisce dall'overlay SVG sulla mappa | ✓ |
| Dopo reload pagina, poligono eliminato **non** ricompare | ✓ |

### Rename polygon — PASS

| Check | Result |
|---|---|
| Barra rename `#polygonPanelRenameBar` apre con input pre-popolato | ✓ |
| `polygonRenameExecute` aggiorna `properties.name` via `gisFeatureUpdate` | ✓ |
| Nuovo nome visibile in lista pannello | ✓ |
| Nuovo nome persistente dopo reload | ✓ |

### Visibility toggle — PASS

| Check | Result |
|---|---|
| Toggle visibilità per riga su `data-poly-id` | ✓ |
| `polygonToggleVisibility` aggiorna `properties.visible` | ✓ |
| Overlay SVG rispetta lo stato visible/hidden | ✓ |
| Stato visibilità persistente dopo reload | ✓ |

### Export GeoJSON / KML dopo edit — PASS

| Check | Result |
|---|---|
| Export GeoJSON dopo rename/delete/visibility | ✓ |
| Export KML dopo rename/delete/visibility | ✓ |
| FeatureCollection / KML Document coerenti con stato corrente | ✓ |

### Regressioni — nessuna osservata

| Area | Result |
|---|---|
| Polygon draw (Pass C) | ✓ |
| Polygon export base (Pass D) | ✓ |
| Waypoint auto-pick / double-click save / Enter save | ✓ |
| Track auto-ready on open | ✓ |
| Pan / zoom / tile map | ✓ |
| Floating panel drag / resize / bring-to-front | ✓ |

---

## No code changes

Questo record **non** modifica `coordinate_converter Claude.html` né altro runtime. Aggiorna solo la memoria orchestratore (`docs/orchestrator/latest.md` + questo file inbox).

---

## Stable GIS flow (post Pass E)

| Feature | Status |
|---|---|
| Waypoint auto-pick / re-arm | PASS |
| Track auto-ready on open | PASS |
| Polygon render (Pass A) | PASS |
| Polygon panel (Pass B) | PASS |
| Polygon draw (Pass C) | PASS |
| Polygon export GeoJSON/KML (Pass D) | PASS |
| Polygon polish / edit / delete (Pass E) | **PASS** |

T1.1 polygon flow è **completo** attraverso Pass A / B / C / D / E.

---

## Next recommended step

- **Next:** creare un breve record di **closeout T1.1** / pianificazione del prossimo task GIS prima di iniziare una nuova feature.
- Il **prossimo lavoro candidato** deve essere scelto dalla roadmap GIS / docs orchestratore correnti (es. piano in `docs/orchestrator/inbox/2026-05-19_1300_next-tier1-plan.md` o aggiornamento successivo), **non** inventato dentro questo task di registrazione PASS.
- **Non** implementare nuovo codice in questo task: questo record è docs-only.
- Possibili candidati già in roadmap (da rivalutare in fase di closeout, non da decidere qui): T1.3 layer cartografici (research-gated), polish accessori T1.1 fuori scope Pass E (es. import GeoJSON poligoni, vertex drag), o blocco Tier 1 successivo.

---

## Validation commands run

- `git rev-parse --show-toplevel`
- `git branch --show-current`
- `git status --short`
- `git log -1 --oneline`
- `git diff -- docs/orchestrator/latest.md docs/orchestrator/inbox/`
- `git diff --check`

---

## Commit

- Messaggio: `docs: record browser PASS polygon polish`
- Scope: solo `docs/orchestrator/latest.md` + `docs/orchestrator/inbox/2026-05-20_0049_browser-pass-polygon-polish.md`.
- `coordinate_converter Claude.html` **escluso** (docs-only).
