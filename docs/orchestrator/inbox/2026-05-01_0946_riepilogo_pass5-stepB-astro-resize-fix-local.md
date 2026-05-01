# Riepilogo — fix resize `#astroPanel` (monolite **solo locale**)

**Timestamp:** 2026-05-01_0946

## Causa

Gli handle `.gis-panel-resize-handle` sono `position:absolute` con hit area 22×22, ma **l’ancoraggio agli angoli** (`left`/`right`/`top`/`bottom` e pseudo-elementi `::after`) era definito per `#waypointModal`, `#convertModal`, `#searchPanel`, `#favoritesPanel`, `#layersPanel` e, separatamente, per **`#rangeRingsPanel`** — **non** per **`#astroPanel`**. Senza quelle regole, i quattro handle restavano sovrapposti (es. in alto a sinistra) e il resize risultava **non utilizzabile**, pur con `gisPanelAttachResize` cablato correttamente come Range Rings.

## Fix applicato

- Aggiunto in **`coordinate_converter Claude.html`** un blocco CSS **speculare a `#rangeRingsPanel`**: posizionamento SE/NW/NE/SW, hover/focus NE, e `::after` per i grip visivi (stesso pattern già documentato nel monolite per RR: *handle nel DOM ma senza posizionamento*).

## File modificato (locale)

- **`coordinate_converter Claude.html`** — solo CSS (nessun cambio a logica calcolo Astro, sorgenti, SunCalc, RR JS).

## Test automatici (eseguiti)

- `git status --short` — `M coordinate_converter Claude.html`
- `git diff --stat` — solo monolite
- Nessun `<script src>` / `type="module"` aggiunto
- Conteggio `<script>` / `</script>`: **2** / **2**
- `node --check` su **2** blocchi inline (regex non greedy): **OK**
- `grep` marker resize / astro: presenti

## Test browser

- **Non eseguiti** da Cursor in questa sessione. **Checklist utente** (dopo pull locale / apertura file):
  1. GIS → Strumenti → Astro → ridimensionare da **almeno due angoli**; clamp parziale; drag; Calcola result/mapCenter; Esc; verificare **Range Rings** ancora ridimensionabile.

## Commit memoria

- **Solo** `docs/orchestrator/**` — **`coordinate_converter Claude.html` escluso** (policy: monolite non committato qui).

## Prossimo passo

- Smoke manuale resize + RR; se OK, **`finito`** o commit monolite quando autorizzato.
