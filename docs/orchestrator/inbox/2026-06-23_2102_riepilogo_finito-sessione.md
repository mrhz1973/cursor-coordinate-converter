# Riepilogo finito — POLY-PARITY-P7-B1 contratto metadata/data poligono legacy-safe

**Data:** 2026-06-23  
**Blocco:** WU-0006 POLY-PARITY-P7-B1  
**Tipo:** runtime + docs vivi

## Commit task (step 2 finito)

- **SHA:** `57c6d390e6f7ebd9eb6e42ec3506442bd1454a47` (short `57c6d39`)
- **Subject:** `feat: POLY-PARITY-P7-B1 contratto metadata poligono legacy-safe`
- **Push task:** riuscito (`706f190..57c6d39 main -> main`)

## Working tree pre-autosync

```text
(vuoto)
```

## File principali (commit task)

| File | Modifica |
|------|----------|
| `coordinate_converter Claude.html` | Contratto dati P7-B1 (+15/−4) |
| `docs/OPERATING_MEMORY.md` | §7 P7-A + P7-B1 |
| `docs/work-units/WU-0005-0009-roadmap.md` | Sezione POLY-PARITY-P7 |

## Cosa è stato fatto

1. **`gisSanitizeProperties`** — branch `kind === "polygon"`: preserva-o-ometti `created_at`/`updated_at` con predicato `typeof x === "string" && x && !Number.isNaN(Date.parse(x))`; nessun `new Date`/`Date.now`/`toISOString` nel branch poligoni; Tracce (`kind !== "polygon"`) invariati.
2. **`polygonFinishDraw`** — singola `nowIso` assegnata a `created_at` e `updated_at`; una `gisFeatureAdd`.
3. **`polygonSaveEdit`** — bump `updated_at` prima dell'unica `gisFeatureUpdate`; `created_at` non toccato; Salva clean invariato (via `polygonEditSaveHandler` → `polygonCancelEdit`).
4. **`polygonRenameExecute`** — `updated_at` nella stessa patch `properties`; una `gisFeatureUpdate`.
5. **`polygonBuildGeoJson`** — export `updated_at` solo se predicato valido.

## Non implementato / escluso

- P7-B2 UI (righe Creato/Aggiornato, formatter, i18n, CSS)
- Migrazione retroattiva
- Import GeoJSON poligoni
- Modifiche KML
- Deploy VPS

## Verifiche statiche

- `git diff --stat`: solo monolite + 2 docs nel commit task
- `node --check` su blocchi inline JS: **PASS** (2 blocchi)
- `APP_BUILD_ID`: **B5.5Z** invariato
- `polygonToggleVisibility`: invariato (nessun bump)
- P1/P2 drag/Salva/CTRL_SEL: invariati

## QA

- **QA operatore:** non eseguita (gate review byte Claude prima di deploy)
- **Review byte Claude P7-B1:** **pending**

## Prossimo passo

1. Review byte Claude su commit runtime `57c6d39`
2. Deploy VPS solo dopo PASS Claude
3. P7-B2 UI metadata date

## Limiti

- Poligoni legacy con date ISO storicamente fabbricate dal vecchio sanitizer restano preservate se valide (non distinguibili da date autentiche)
- Legacy senza `created_at` dopo modifica reale: solo `updated_at` presente (comportamento intenzionale)
