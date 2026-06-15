# Riepilogo finito sessione — WU-0008 8d-B1-B1 offline UX

**Data:** 2026-06-15  
**Trigger:** `finito`  
**Commit step 2:** `29ebf3a` — `feat(gis): offline UX badge, OFFLINE_LAYER_IDS, cache counter (WU-0008 8d-B1-B1)`  
**Push step 2:** OK (`3185ec6..29ebf3a` → `origin/main`)

---

## Cosa è stato fatto

**WU-0008 8d-B1-B1** — runtime monolite:

- `isLayerOfflineUnavailable(layerId)` — predicato unico catalogo-driven (`cacheable === false`).
- Badge «no offline» in menu Layers (i18n IT/EN/FR).
- `OFFLINE_LAYER_IDS` derivato da filtro catalogo (debito EOX **risolto**).
- `#pcLayer` popolato dinamicamente solo layer offline-eligible.
- Pannello offline stato neutro; download/export disabilitati per online-only.
- Contatore «Cache sessione» nascosto quando basemap attivo è online-only.
- Layer attivo nel menu Layers evidenziato in verde chiaro (light + dark).

**Docs:** `docs/OPERATING_MEMORY.md` §7, `docs/work-units/WU-0005-0009-roadmap.md` — 8d-B1-B1 PASS, debito OFFLINE_LAYER_IDS chiuso.

---

## File modificati (commit `29ebf3a`)

| File | Natura |
|------|--------|
| `coordinate_converter Claude.html` | Runtime 8d-B1-B1 (+125/−25 circa) |
| `docs/OPERATING_MEMORY.md` | §7 stato corrente |
| `docs/work-units/WU-0005-0009-roadmap.md` | 8d-B1-B1 PASS, debiti aggiornati |

**Monolite incluso** nel commit step 2.

---

## QA

- `node --check` OK (pre-commit).
- QA operatore: badge Esri/osmStandard OK; contatore non verde su Esri; layer attivo verde nel menu.

---

## git status finale (post step 2)

Working tree pulito dopo commit.

---

## Prossimo passo consigliato

**WU-0008 8d-B1-B2** — stats cache per-layer (IDB O(n) on-demand) **oppure** **8d-B** EOX (prerequisito OFFLINE_LAYER_IDS soddisfatto).

**Debito residuo:** fit-area `Math.min(18,z)` — blocco B1-B3 zoom-guard.

---

## Rischi residui

- Aree salvate con `layerId` Esri legacy → sanitize a layer cacheable al reload form.
- Stats per-layer IDB ancora assenti (B1-B2).
