# Riepilogo finito sessione — WU-0008 8d-B1-A docs

**Data:** 2026-06-15  
**Trigger:** `finito`  
**Commit step 2:** `4f6ec4f` — `docs: WU-0008 8d-B1-A roadmap debiti offline UX e prerequisiti EOX`  
**Push step 2:** OK (`d03cf80..4f6ec4f` → `origin/main`)

---

## Cosa è stato fatto

1. **WU-0008 8d-B1-A** — diagnosi read-only completata (sessione precedente): IndexedDB schema, stats per-layer Caso B1, badge/pannello/maxZoom.
2. **WU-0008 8d-B1-A-docs** — registrati in roadmap debiti e candidati follow-up:
   - Debito alta priorità: `OFFLINE_LAYER_IDS` manuale vs `TILE_LAYERS[id].cacheable === false` (prerequisito EOX).
   - Debito media priorità: fit-area `Math.min(18,z)` hardcoded (~26392, 26420, 26888) — zoom-guard separato.
   - Candidati: **8d-B1-B1** badge + pannello neutro; **8d-B1-B2** stats per-layer; **8d-B1-B3** zoom-guard fit-area.
   - i18n badge FR: `pas hors ligne` / `non disponible hors ligne`.
3. **`docs/OPERATING_MEMORY.md` §7** — aggiornato: 8d-B0 QA operatore PASS; 8d-B1-A PASS; prossimo **8d-B1-B1**; EOX dopo prerequisiti.

---

## File modificati (commit `4f6ec4f`)

| File | Natura |
|------|--------|
| `docs/work-units/WU-0005-0009-roadmap.md` | Sezione 8d-B1, debiti, ordine operativo, matrice dipendenze |
| `docs/OPERATING_MEMORY.md` | §7 stato corrente |

**Monolite:** `coordinate_converter Claude.html` — **non modificato**, **non incluso** nel commit.

---

## QA

- Nessun `node --check` (solo docs).
- `git diff --stat`: 2 file, +65 −11.

---

## git status finale (post step 2, pre orchestratore)

Working tree pulito dopo commit step 2.

---

## Prossimo passo consigliato

**WU-0008 8d-B1-B1** — badge «No offline» in Layers + stato neutro pannello offline; idealmente fix `OFFLINE_LAYER_IDS` coerente con `cacheable`. EOX (**8d-B**) solo dopo prerequisito debito 1.

---

## Rischi residui

- `OFFLINE_LAYER_IDS` e `#pcLayer` ancora includono layer online-only finché non patchato B1-B1.
- Fit-area z18 hardcoded resta bug latente per layer maxZoom < 18.
