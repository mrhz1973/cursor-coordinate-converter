# D-FLIGHT-G-UI-OVERLAY-A — implementazione + deploy + Automated Browser QA

**Data:** 2026-08-12  
**Block-ID:** `D-FLIGHT-G-UI-OVERLAY-A`  
**Scope:** solo monolite UI overlay/pannelli/legenda/hover — **nessuna** modifica helper Python, CORS, VPS rete/auth, OPSEC.

## Storico D-FLIGHT-F (invariato)

```text
QA D-FLIGHT-F FAIL operatore — overlay D-Flight non segue il drag della mappa in tempo reale; pannello principale e dettagli non conformi alle modal GIS (ridimensionamento/posizionamento/visibilità); styling aree incompleto (mancano colori/legenda); manca tooltip hover di anteprima
```

Questo FAIL **resta** registrato. Questo blocco G **non** lo convalida né lo cancella.

## Root cause drag-sync

SVG D-Flight era montato con `tileMap.appendChild(svg)` (sibling di `.tile-layer`). Il pan live applica `translate3d` solo a `.tile-layer` → overlay fermo fino a mouseup/redraw. Fix: `tileLayer.appendChild(svg)` (stesso pattern carto/track) mantenendo compensazione `tx/ty`.

## Cosa è stato fatto

1. Overlay mount in `.tile-layer` + hover handler (preview nome · restriction · temporal)
2. Pannelli Zone / Dettaglio: minimize (−), pin sotto topbar, altezza viewport maggiore, restore da dock, whitelist `gisMinimizePanel`
3. Legenda sempre 5 categorie restriction quando dataset presente; colori/pattern stroke più distintivi + swatch allineati
4. Build `D-FLIGHT-G-UI-OVERLAY-A` · **164** (163 feature + 164 minimize whitelist)

## Commit task

| SHA | Subject |
|-----|---------|
| `457984bf5919d5b1c93e8fc51e7c48728144b351` | feat(dflight): UI overlay pan-sync, GIS panels, legend/hover |
| `950aa544e6a7029265326693c21551f8c3af7956` | fix(dflight): allow GIS minimize for D-Flight panels (build 164) |

**real_task_commit (runtime live):** `950aa544e6a7029265326693c21551f8c3af7956`

## Deploy GIS-only

- Host: `ionos-n8n` · path `/root/local-files/handoff-runtime/cursor-coordinate-converter`
- `git pull --ff-only` → HEAD `950aa54…`
- `systemctl restart goi-gis-app` → active
- HTTP 200 · **CMP_PASS yes** · SHA256 LF `deadd15a23052912871035738e0694c3e022236efba988db5a72749ae857ceb1`
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=950aa544`
- **Nessun** restart/config helper `:8010`

## Controlli statici

- `node --check` 2× script inline: PASS
- nessun `<script src>` / `type="module"`
- `git diff --check`: OK (pre-commit)

## Automated Browser QA — PASS

Metodo: CDP `Runtime.evaluate` su runtime live `?v=950aa544` (fixture dataset Spezia, senza rete helper).

| Check | Esito |
|-------|-------|
| build 164 / D-FLIGHT-G-UI-OVERLAY-A | PASS |
| SVG parent = `.tile-layer` | PASS |
| pan live translate3d(80,40) → overlay delta 80/40 | PASS |
| panel open + resize + top sotto header + in viewport | PASS |
| minimize + dock + restore | PASS |
| details open + top + zone id | PASS |
| legend 5 voci | PASS |
| hover format | PASS |
| hide/show overlay remount in tile-layer | PASS |

```text
AUTOMATED BROWSER QA D-FLIGHT-G-UI-OVERLAY-A PASS
```

## Gate

`QA FINALE CHATGPT — PENDING`

QA operatore: **non attestata** (Cursor non emette passaggi umani).

## Non toccato

- Helper Python / CORS / ACL / OPSEC / rete `:8010`
- Credenziali / fetch D-Flight diretto
- `finito` non eseguito

## Prossimo passo

ChatGPT emette QA umana residua unica per `D-FLIGHT-G-UI-OVERLAY-A`. Attestare:

```text
QA D-FLIGHT-G-UI-OVERLAY-A PASS operatore
```

oppure FAIL con passaggio esatto.
