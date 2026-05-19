# T1.1 Polygon Flow — Closeout

**Data:** 2026-05-20  
**Tipo:** docs-only closeout  
**Stato T1.1:** **CLOSED / COMPLETE**  
**Ultimo commit PASS:** `81f3bc5` — `docs: record browser PASS polygon polish`  
**Implementazione Pass E:** `9f98c5d` — `feat: add polygon polish controls`

---

## Executive summary

Il flusso **T1.1 compound polygon** (roadmap §5.1 — poligono semantico dedicato, non track-chiuso) è **completo** attraverso Pass **A → B → C → D → E**, con browser/manual QA **PASS** registrata per ogni passo funzionale. Nessuna modifica runtime in questo record di closeout.

---

## Pass summary (A / B / C / D / E)

| Pass | Scope | Commit feature (o docs) | Browser PASS |
|------|--------|-------------------------|--------------|
| **A** | Rendering overlay SVG poligoni su tile map (`renderGisPolygonsOverlay`) | `6e0b416` feat: render gis polygons overlay | `5314744` docs PASS render |
| **B** | Pannello floating `#polygonPanel` (shell, lista, drag/resize) | `a883b11` feat: polygon floating panel shell | `2026-05-19_1830` (Pass B + track auto-arm, utente «ok poligoni funziona») |
| **C** | Draw interaction mappa (vertici, chiudi, draft overlay) | `4848950` feat: polygon draw interaction | `33746db` docs PASS draw |
| **D** | Export GeoJSON + KML | `4e7d3ff` feat: add polygon export | `e83349c` docs PASS export |
| **E** | Polish: delete, rename, visibility (lista + barre in-pannello) | `9f98c5d` feat: add polygon polish controls | `81f3bc5` docs PASS polish |

**Piano originale:** `docs/orchestrator/inbox/2026-05-19_1700_plan_t1.1-compound-polygon.md` (data layer già presente; implementazione UI/interaction/export in sequenza A–E).

---

## Confirmed stable features (browser PASS)

- **Render:** overlay poligoni su mappa tile (Pass A).
- **Panel:** pannello floating Poligoni, lista, pattern GIS standard (Pass B).
- **Draw:** nuovo poligono da mappa, draft, salva in `state.gisPolygons`, Esc/cancel (Pass C).
- **Export:** GeoJSON FeatureCollection + KML Document/Placemark/Polygon (Pass D).
- **Delete:** da pannello, `#polygonPanelDeleteBar`, persistenza dopo reload (Pass E).
- **Rename:** `#polygonPanelRenameBar`, `polygonRenameExecute`, persistenza dopo reload (Pass E).
- **Visibility:** `polygonToggleVisibility`, overlay rispetta visible/hidden (Pass E).

**Contesto GIS stabile (non T1.1, ma verificato durante QA poligoni):** waypoint auto-pick/re-arm, track auto-ready on open, pan/zoom, floating panel drag/resize — PASS come da inbox Pass C/E.

---

## Explicit out of scope (non incluso in T1.1)

Come da piano Pass E e scope T1.1; **non** trattati come gap bloccanti del closeout:

- Import GeoJSON / KML poligoni da file
- Vertex drag / modifica geometria vertice-per-vertice
- Advanced geometry editing (sposta centro, reshape, split)
- Holes / MultiPolygon advanced handling
- CoT polygon / interop ATAK per aree poligono
- Annotazioni semantiche avanzate oltre name/visible/color di base (category, symbol, ecc. — data layer presente ma UI non esposta in T1.1)

Questi item possono diventare **accessori post-T1.1** o blocchi Tier 1 separati solo dopo decisione esplicita in roadmap/orchestratore aggiornato.

---

## Tier 1 context (da docs esistenti)

| ID roadmap | Titolo | Stato (orchestratore) |
|------------|--------|------------------------|
| **T1.2** | CoT XML import/export waypoint | **CLOSED** — implementato + browser PASS (`2026-05-19`, inbox `1600` / `1630`) |
| **T1.1** | Compound polygon dedicated workflow | **CLOSED** — questo closeout |
| **T1.3** | Layer cartografici esterni PCN/Geoportale (OGC) | **Deferred / research-gated** — `2026-05-19_1300_next-tier1-plan.md` candidato C |

**Sequenza raccomandata nel piano Tier 1 (2026-05-19):** Blocco 1 CoT ✓ → Blocco 2 compound polygon ✓ → **Separato:** PCN/Geoportale gate clearance prima di qualsiasi implementazione.

---

## Next Tier 1 recommendation (solo da docs esistenti)

### Raccomandazione primaria

**T1.3 — Layer cartografici esterni (PCN / Geoportale via WMS/WMTS/OGC)** — come **prossimo workstream Tier 1**, ma **non** come implementazione CODE immediata.

**Azione immediata consigliata:** sessione **docs-only / plan** per **gate decision packet** (tabella gate in `2026-05-19_1300_next-tier1-plan.md` §Gate decision packet — endpoint, CORS, licensing/ToS, OPSEC, compatibilità tile fetch). Finché i gate non sono PASS, T1.3 resta **research-gated** per policy orchestratore.

### Shortlist (nessun ordine di priorità inventato oltre il piano Tier 1)

| # | Candidato | Fonte | Tipo | Note |
|---|-----------|-------|------|------|
| 1 | **T1.3 gate research** | `2026-05-19_1300_next-tier1-plan.md` | docs-only / plan | Unico candidato **Tier 1** nominato come «Separato» dopo A+B completati |
| 2 | **Polygon import GeoJSON/KML** | Out-of-scope T1.1; inbox `0049` | code-change (accessorio) | Non è blocco Tier 1 nel piano 2026-05-19; richiede nuovo handoff dedicato se scelto |
| 3 | **CoT ATAK/WinTAK interop reale** | `latest.md` rischio deferred T1.2 | QA / validazione | Non sostituisce T1.3 come prossimo blocco roadmap |
| 4 | **Aggiornamento piano Tier 1** | Stato post T1.1+T1.2 | docs-only | Riconciliare `latest.md` §Prossimo passo (ancora CoT) con stato reale |

**Nessun candidato CODE Tier 1 «avviabile subito»** risulta dai documenti esistenti senza prima superare i gate T1.3 o emettere un nuovo piano Tier 1 aggiornato.

---

## No code changes

Questo closeout **non** modifica `coordinate_converter Claude.html` né altro runtime.

---

## Riferimenti inbox

- Pass E PASS: `docs/orchestrator/inbox/2026-05-20_0049_browser-pass-polygon-polish.md`
- Piano Tier 1: `docs/orchestrator/inbox/2026-05-19_1300_next-tier1-plan.md`
- Piano T1.1: `docs/orchestrator/inbox/2026-05-19_1700_plan_t1.1-compound-polygon.md`

---

## Future Handoff Prompt — T1.3 gate decision (structured)

Prossimo passo **actionable** derivato dai soli documenti esistenti: sessione research/docs per sbloccare o confermare defer T1.3. **Non** è un prompt di implementazione WMS/WMTS.

```markdown
TASK: GIS — T1.3 PCN/Geoportale OGC layer gate decision packet
TASK STATUS: pending
Operation type: plan
Risk level: medium
Target file(s):
  - docs/orchestrator/latest.md
  - docs/orchestrator/inbox/*.md
Preferred implementer: Cursor
Commit: authorized
Push: authorized

SESSION / REPO GUARD:
- Repo: mrhz1973/cursor-coordinate-converter
- Local path: C:\Users\mrhz\Documents\AI\GitHub\cursor-coordinate-converter
- Branch: main (stop if not main)
- Do NOT touch dev-method, alina-lavoro, or unrelated repos
- Do NOT modify coordinate_converter Claude.html in this task
- Do NOT use git add .

CONTEXT:
- T1.1 compound polygon flow: CLOSED (closeout 2026-05-20_0055_t1-1-polygon-flow-closeout.md).
- T1.2 CoT XML waypoint: CLOSED with browser PASS (orchestratore 2026-05-19).
- Next Tier 1 sequence per 2026-05-19_1300_next-tier1-plan.md: Blocco 1 CoT done, Blocco 2 polygon done, Separato = T1.3 PCN/Geoportale research-gated.
- Candidate C requires gate clearance before any WMS/WMTS code in monolite.

SCOPE:
- Produce a gate decision packet (docs-only) answering the five gates in next-tier1-plan.md:
  1) Endpoint availability (official WMS/WMTS URLs + public documentation)
  2) CORS feasibility from file:// or app origin
  3) Licensing / ToS for offline-first peer distribution
  4) OPSEC review (gov IT servers from classified/air-gapped context)
  5) Tile fetch compatibility with existing tile engine (not Leaflet)
- For each gate: PASS / FAIL / UNKNOWN + evidence links or notes (no secrets).
- End with recommendation: proceed to implementation planning | remain deferred | blocked.
- Update docs/orchestrator/latest.md (brief top entry) + one inbox file with full packet.

OUT OF SCOPE:
- Implementing WMS/WMTS layers in coordinate_converter Claude.html
- Scraping external viewers or unofficial endpoints
- Network calls from this docs task except public documentation fetch if needed for evidence
- Changing package.json, build, deploy, tags

FILES ALLOWED:
- docs/orchestrator/latest.md
- docs/orchestrator/inbox/*.md

FILES FORBIDDEN:
- coordinate_converter Claude.html
- dev-method repo, alina-lavoro repo
- package.json, package-lock.json, build tooling, deploy config, secrets, .env

VALIDATION:
- git status --short (clean before start; only intentional docs after)
- git diff -- docs/orchestrator/latest.md docs/orchestrator/inbox/
- git diff --check

GIT RULES:
- git rev-parse --show-toplevel; git branch --show-current; git status --short; git log -1 --oneline at start
- Never git add .
- Stage only intentional docs files
- Commit message: docs: T1.3 OGC layer gate decision packet

COMMIT MESSAGE:
docs: T1.3 OGC layer gate decision packet

FINAL REPORT:
- Gate table with PASS/FAIL/UNKNOWN per gate
- Overall recommendation (proceed | deferred | blocked)
- Files changed; inbox path; latest.md updated yes/no
- Commit hash; push result; final git status
```
