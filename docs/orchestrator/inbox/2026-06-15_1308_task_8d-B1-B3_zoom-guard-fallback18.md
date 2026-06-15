# WU-0008 8d-B1-B3 — zoom-guard fit-area (task consolidato + semantica fallback 18)

**Data:** 2026-06-15  
**Tipo:** integrazione prompt / spec esecutiva — **nessuna patch monolite in questo step**  
**Stato task:** approvato, in attesa esecuzione runtime

---

## Obiettivo

Sostituire `Math.min(18, z)` negli helper **fit-area / offline-area** con clamp al `maxZoom` del **basemap layer reale** quando `layerId` è risolvibile senza refactor largo.

**Non** toccare: EOX, OPSEC/forced-offline, overlay (non devono clampare la basemap), roadmap/OM/README (salvo `finito` successivo).

---

## Semantica fallback 18 (integrazione obbligatoria)

Il fallback **18** **non** è un “fix corretto del layer”. Significa solo: comportamento **non più permissivo** del vecchio `Math.min(18, z)`.

### Regole

| Caso | Azione | Classificazione riepilogo |
|------|--------|---------------------------|
| Helper fit-area/offline-area; `layerId` risolvibile | Clamp con `TILE_LAYERS[layerId].maxZoom` | **CORRETTA / FIXATA** |
| Helper fit-area/offline-area; `layerId` non risolvibile senza refactor largo | Non usare fallback 18 come fix | **NON RISOLTA / DEBITO RESIDUO** |
| Percorso senza layer target concettuale | Fallback 18 ammesso, **motivato** | Fuori criterio PASS fit-area |
| Layer target reale ma si usa solo fallback 18 | Vietato dichiarare fix completo | **DEBITO RESIDUO** |

### Criterio PASS

**PASS completo** solo se **tutte** le occorrenze fit-area/offline-area con layer target reale usano `TILE_LAYERS[layerId].maxZoom`.

Se resta **anche una sola** occorrenza fit-area/offline-area con layer target reale ma fallback 18 per `layerId` non risolto → debito residuo esplicito, **non** dichiarare fix completo.

### Vincoli implementazione (invariati)

- Patch piccola; niente refactor largo
- Overlay non clampano la basemap
- Niente EOX; niente docs nel blocco runtime
- Fallback 18 solo dove non esiste concettualmente un layer target

---

## Output riepilogo A (obbligatorio a esecuzione)

1. **Occorrenze corrette** — funzione/area; `layerId` risolto da dove; `maxZoom` da `TILE_LAYERS[layerId].maxZoom`
2. **Occorrenze lasciate** — funzione/area; motivo `layerId` non risolvibile; fallback 18 = non-fix / debito
3. **`Math.min(18,...)` residue** — fuori scope o debito residuo (con motivazione)

---

## Audit pre-implementazione (HEAD monolite post-B1-B2)

### In scope fit-area / offline-area (debito roadmap — da FIXARE)

| Funzione | Riga ~ | Layer target | Risoluzione `layerId` | Stato attuale |
|----------|--------|--------------|----------------------|---------------|
| `flyMapToTrackPoints` (1 punto) | 26587 | basemap display | `sanitizeMapLayer(state.mapLayer)` | `Math.min(18,…)` — **da fixare** |
| `flyMapToTrackPoints` (bbox multi) | 26614 | basemap display | `sanitizeMapLayer(state.mapLayer)` | `Math.min(18,…)` — **da fixare** |
| `flyMiniMapToOfflineNamedAreaById` | 27082 | basemap display | `sanitizeMapLayer(state.mapLayer)` | `Math.min(18,…)` — **da fixare** |

**Nota layer target:** il fit centra la **vista mappa** (tile basemap da `state.mapLayer`), non il solo `#pcLayer` offline né obbligatoriamente `area.layerId` salvato (può differire se l’utente ha cambiato basemap).

**Patch attesa:** helper compatto es. `clampBasemapFitZoom(z, layerId?)` vicino a `offlineLayerMaxZoom` / sanitize layer; sostituire le 3 occorrenze sopra.

**Previsione esito:** tutte e 3 risolvibili **senza refactor largo** → blocco **PASS** possibile se implementate correttamente.

### Fuori scope B1-B3 (non fit-area)

| Occorrenza | Riga ~ | Motivazione |
|------------|--------|-------------|
| Callback GPS `getCurrentPosition` (recenter) | 22487 | Geoloc opt-in, non fit-area/offline-area; nessun bbox/area fit |
| Restore `stored.settings.mapZoom` al boot | 44510 | Persistenza settings, non fit-area; `mapLayer` ripristinato subito dopo |

Fallback 18 qui: **accettabile** come compat legacy finché non esiste task dedicato persistenza zoom vs `maxZoom` layer.

---

## QA previsto (esecuzione)

- `node --check` su JS inline estratto
- `git diff --stat` monolite
- Checklist browser manuale: basemap `esriRelief` (maxZoom 13) → fit traccia salvata / area offline → zoom ≤ 13, nessuna richiesta tile z18

---

## Prossimo passo

Eseguire patch monolite B1-B3 con questa spec; riepilogo A secondo sezioni sopra; commit monolite solo su richiesta/`finito`; autosync orchestratore post-esecuzione.
